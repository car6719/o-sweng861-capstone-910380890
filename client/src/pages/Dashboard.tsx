import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { chargesService, paymentsService } from '../services';
import { Charge, Payment } from '../types';
import { useAuth } from '../contexts/AuthContext';
import PaymentForm from '../components/PaymentForm';
import { format } from 'date-fns';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [charges, setCharges] = useState<Charge[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedCharges, setSelectedCharges] = useState<number[]>([]);
  const [showPayment, setShowPayment] = useState(false);
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [chargesData, paymentsData, balanceData] = await Promise.all([
        chargesService.getCharges(),
        paymentsService.getPayments(),
        chargesService.getBalance()
      ]);
      
      setCharges(chargesData);
      setPayments(paymentsData);
      setBalance(balanceData.balance);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChargeSelection = (chargeId: number) => {
    setSelectedCharges(prev =>
      prev.includes(chargeId)
        ? prev.filter(id => id !== chargeId)
        : [...prev, chargeId]
    );
  };

  const handlePayNow = async () => {
    if (selectedCharges.length === 0) {
      alert('Please select charges to pay');
      return;
    }

    const totalAmount = charges
      .filter(c => selectedCharges.includes(c.id))
      .reduce((sum, c) => sum + c.amount, 0);

    try {
      const response = await paymentsService.createPaymentIntent(totalAmount, selectedCharges);
      setClientSecret(response.clientSecret);
      setShowPayment(true);
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to initiate payment');
    }
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    setSelectedCharges([]);
    setClientSecret('');
    loadData();
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  const unpaidCharges = charges.filter(c => !c.isPaid);

  return (
    <div className="container" style={{ marginTop: '2rem' }}>
      <h1 className="mb-4">Student Dashboard</h1>

      {user?.hasHold && (
        <div className="alert alert-warning">
          ⚠️ Your account has a hold. Please pay your outstanding balance or contact the bursar office.
        </div>
      )}

      {/* Balance Summary */}
      <div className="card">
        <h2 className="card-header">Account Balance</h2>
        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: balance > 0 ? 'var(--danger)' : 'var(--success)' }}>
          ${balance.toFixed(2)}
        </div>
        <p className="text-secondary">
          {balance > 0 ? 'Amount Due' : 'No outstanding balance'}
        </p>
      </div>

      {/* Unpaid Charges */}
      {unpaidCharges.length > 0 && (
        <div className="card">
          <h2 className="card-header">Unpaid Charges</h2>
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: '50px' }}>Select</th>
                <th>Description</th>
                <th>Category</th>
                <th>Semester</th>
                <th>Due Date</th>
                <th style={{ textAlign: 'right' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {unpaidCharges.map(charge => (
                <tr key={charge.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedCharges.includes(charge.id)}
                      onChange={() => handleChargeSelection(charge.id)}
                    />
                  </td>
                  <td>{charge.description}</td>
                  <td>{charge.category}</td>
                  <td>{charge.semester}</td>
                  <td>{format(new Date(charge.dueDate), 'MMM dd, yyyy')}</td>
                  <td style={{ textAlign: 'right', fontWeight: 'bold' }}>
                    ${charge.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {selectedCharges.length > 0 && (
            <div className="flex-between mt-3">
              <div>
                <strong>Selected:</strong> {selectedCharges.length} charge(s)
                <br />
                <strong>Total Amount:</strong> $
                {charges
                  .filter(c => selectedCharges.includes(c.id))
                  .reduce((sum, c) => sum + c.amount, 0)
                  .toFixed(2)}
              </div>
              <button onClick={handlePayNow} className="btn btn-primary">
                Pay Now
              </button>
            </div>
          )}
        </div>
      )}

      {/* Payment Form */}
      {showPayment && clientSecret && (
        <div className="card">
          <h2 className="card-header">Complete Payment</h2>
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <PaymentForm
              chargeIds={selectedCharges}
              onSuccess={handlePaymentSuccess}
              onCancel={() => {
                setShowPayment(false);
                setClientSecret('');
              }}
            />
          </Elements>
        </div>
      )}

      {/* Payment History */}
      <div className="card">
        <h2 className="card-header">Payment History</h2>
        {payments.length === 0 ? (
          <p className="text-secondary">No payment history available</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Transaction ID</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(payment => (
                <tr key={payment.id}>
                  <td>{format(new Date(payment.createdAt), 'MMM dd, yyyy HH:mm')}</td>
                  <td>${payment.amount.toFixed(2)}</td>
                  <td>
                    <span className={`badge badge-${payment.status === 'completed' ? 'success' : payment.status === 'pending' ? 'warning' : 'danger'}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    {payment.stripePaymentIntentId.substring(0, 20)}...
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
