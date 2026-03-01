import { Router, Request, Response } from 'express';
import Stripe from 'stripe';
import { PaymentModel, ChargeModel, UserModel } from '../models';
import { authenticate } from '../middleware/auth';
import { AuthRequest } from '../types';
import { body, validationResult } from 'express-validator';

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia'
});

// Get payment history
router.get('/', authenticate, (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    
    if (authReq.user!.role === 'admin') {
      const payments = PaymentModel.findAll();
      res.json(payments);
    } else {
      const payments = PaymentModel.findByUserId(authReq.user!.userId);
      res.json(payments);
    }
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create payment intent
router.post('/create-intent',
  authenticate,
  body('amount').isFloat({ min: 0.01 }),
  body('chargeIds').optional().isArray(),
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const authReq = req as AuthRequest;
      const { amount, chargeIds } = req.body;

      // Check if user has a hold
      const user = UserModel.findById(authReq.user!.userId);
      if (user?.hasHold) {
        return res.status(403).json({ error: 'Account has a hold. Please contact the bursar office.' });
      }

      // Create Stripe payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: 'usd',
        metadata: {
          userId: authReq.user!.userId.toString(),
          chargeIds: chargeIds ? JSON.stringify(chargeIds) : ''
        }
      });

      // Create payment record
      const payment = PaymentModel.create({
        userId: authReq.user!.userId,
        chargeId: chargeIds && chargeIds.length > 0 ? chargeIds[0] : undefined,
        amount,
        stripePaymentIntentId: paymentIntent.id,
        status: 'pending'
      });

      res.json({
        clientSecret: paymentIntent.client_secret,
        paymentId: payment.id
      });
    } catch (error) {
      console.error('Create payment intent error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// Confirm payment
router.post('/confirm',
  authenticate,
  body('paymentIntentId').notEmpty(),
  body('chargeIds').optional().isArray(),
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const authReq = req as AuthRequest;
      const { paymentIntentId, chargeIds } = req.body;

      // Retrieve payment intent from Stripe
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

      if (paymentIntent.status === 'succeeded') {
        // Update payment status
        const payments = PaymentModel.findByUserId(authReq.user!.userId);
        const payment = payments.find(p => p.stripePaymentIntentId === paymentIntentId);
        
        if (payment) {
          PaymentModel.updateStatus(payment.id, 'completed');

          // Mark charges as paid
          if (chargeIds && chargeIds.length > 0) {
            chargeIds.forEach((chargeId: number) => {
              ChargeModel.markAsPaid(chargeId);
            });

            // Check if user has any remaining unpaid charges
            const balance = ChargeModel.getBalance(authReq.user!.userId);
            if (balance === 0) {
              // Remove hold if no balance
              UserModel.updateHold(authReq.user!.userId, false);
            }
          }

          res.json({ 
            success: true, 
            message: 'Payment successful',
            payment 
          });
        } else {
          res.status(404).json({ error: 'Payment not found' });
        }
      } else {
        res.status(400).json({ error: 'Payment not successful' });
      }
    } catch (error) {
      console.error('Confirm payment error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

export default router;
