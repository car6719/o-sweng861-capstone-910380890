import React, { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { paymentsService } from '../services';

interface PaymentFormProps {
  chargeIds: number[];
  onSuccess: () => void;
  onCancel: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ chargeIds, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error: submitError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + '/dashboard',
        },
        redirect: 'if_required'
      });

      if (submitError) {
        setError(submitError.message || 'Payment failed');
        setLoading(false);
        return;
      }

      // Get payment intent ID from elements
      const paymentIntent = await stripe.retrievePaymentIntent(
        elements.getElement(PaymentElement)?.options?.clientSecret || ''
      );

      if (paymentIntent.paymentIntent) {
        await paymentsService.confirmPayment(paymentIntent.paymentIntent.id, chargeIds);
        onSuccess();
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Payment confirmation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="alert alert-error mb-3">{error}</div>}
      
      <PaymentElement />
      
      <div className="flex gap-2 mt-3">
        <button
          type="submit"
          disabled={!stripe || loading}
          className="btn btn-primary"
          style={{ flex: 1 }}
        >
          {loading ? 'Processing...' : 'Pay Now'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-secondary"
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default PaymentForm;
