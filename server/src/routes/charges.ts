import { Router, Request, Response } from 'express';
import { ChargeModel, UserModel } from '../models';
import { authenticate, requireRole } from '../middleware/auth';
import { AuthRequest } from '../types';
import { body, validationResult } from 'express-validator';

const router = Router();

// Get all charges (students get their own, admins get all)
router.get('/', authenticate, (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    
    if (authReq.user!.role === 'admin') {
      const charges = ChargeModel.findAll();
      res.json(charges);
    } else {
      const charges = ChargeModel.findByUserId(authReq.user!.userId);
      res.json(charges);
    }
  } catch (error) {
    console.error('Get charges error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user balance
router.get('/balance', authenticate, (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const balance = ChargeModel.getBalance(authReq.user!.userId);
    res.json({ balance });
  } catch (error) {
    console.error('Get balance error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create charge (admin only)
router.post('/',
  authenticate,
  requireRole('admin'),
  body('userId').isInt(),
  body('amount').isFloat({ min: 0.01 }),
  body('description').notEmpty(),
  body('category').notEmpty(),
  body('semester').notEmpty(),
  body('dueDate').isISO8601(),
  (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { userId, amount, description, category, semester, dueDate } = req.body;

      // Check if user exists
      const user = UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (user.role !== 'student') {
        return res.status(400).json({ error: 'Can only create charges for students' });
      }

      const charge = ChargeModel.create({
        userId,
        amount,
        description,
        category,
        semester,
        dueDate,
        isPaid: false
      });

      res.status(201).json(charge);
    } catch (error) {
      console.error('Create charge error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// Delete charge (admin only)
router.delete('/:id', authenticate, requireRole('admin'), (req: Request, res: Response) => {
  try {
    const chargeId = parseInt(req.params.id);
    
    const charge = ChargeModel.findById(chargeId);
    if (!charge) {
      return res.status(404).json({ error: 'Charge not found' });
    }

    ChargeModel.delete(chargeId);
    res.json({ message: 'Charge deleted successfully' });
  } catch (error) {
    console.error('Delete charge error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
