import React, { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useAuth } from '../contexts/AuthContext';

interface Booking {
  _id: string;
  tour: {
    title: string;
  };
  totalPrice: number;
  participants: number;
}

interface PaymentModalProps {
  booking: Booking;
  clientSecret: string;
  onClose: () => void;
  onSuccess: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ booking, clientSecret, onClose, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { token } = useAuth();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError('');

    try {
      const { error: submitError, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
      });

      if (submitError) {
        setError(submitError.message || 'Payment failed');
        setProcessing(false);
        return;
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Update payment status in backend
        const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || 'https://travel-backend-psi.vercel.app';
        const response = await fetch(`${API_BASE}/bookings/update-payment-status`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            bookingId: booking._id,
            paymentIntentId: paymentIntent.id,
            paymentStatus: 'paid',
            paymentMethod: paymentIntent.payment_method
          })
        });

        const data = await response.json();
        if (data.success) {
          setMessage('Payment successful!');
          setTimeout(() => {
            onSuccess();
          }, 2000);
        } else {
          setError('Payment succeeded but failed to update booking');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Complete Payment</h2>
            <p className="text-gray-600 mt-1">for {booking.tour.title}</p>
          </div>
          <button
            onClick={onClose}
            disabled={processing}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-6 bg-teal-50 p-4 rounded-lg">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Participants:</span>
            <span className="font-semibold text-teal-600">{booking.participants}</span>
          </div>
          <div className="flex justify-between text-lg font-bold">
            <span>Total Amount:</span>
            <span className="text-teal-600">${booking.totalPrice}</span>
          </div>
        </div>

        {message && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <div className="payment-element-container">
              <PaymentElement 
                options={{
                  style: {
                    base: {
                      color: '#0d9488', // teal-600
                      fontFamily: 'system-ui, sans-serif',
                      fontSize: '16px',
                      '::placeholder': {
                        color: '#64748b', // slate-500
                      },
                    },
                    invalid: {
                      color: '#dc2626', // red-600
                    },
                  },
                }}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={processing}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={processing || !stripe || !elements}
              className="flex-1 px-4 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? 'Processing...' : `Pay $${booking.totalPrice}`}
            </button>
          </div>
        </form>

        <div className="mt-4 text-xs text-gray-500 text-center">
          <p>🔒 Secure payment powered by Stripe</p>
        </div>
      </div>

      <style jsx>{`
        .payment-element-container {
          padding: 12px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          background-color: #f9fafb;
        }
        
        .payment-element-container :global(.p-Input) {
          color: #0d9488 !important;
        }
        
        .payment-element-container :global(.p-Label) {
          color: #0d9488 !important;
        }
        
        .payment-element-container :global(.p-CardNumberElement) {
          color: #0d9488 !important;
        }
        
        .payment-element-container :global(.p-CardExpiryElement) {
          color: #0d9488 !important;
        }
        
        .payment-element-container :global(.p-CardCvcElement) {
          color: #0d9488 !important;
        }
        
        .payment-element-container :global(.p-PaymentRequestButton) {
          color: #0d9488 !important;
        }
        
        .payment-element-container :global(.p-Text) {
          color: #0d9488 !important;
        }
      `}</style>
    </div>
  );
};

export default PaymentModal; 