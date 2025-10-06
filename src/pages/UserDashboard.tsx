import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import LoadingSpinner from '../components/LoadingSpinner';
import PaymentModal from '../components/PaymentModal';
import ReviewForm from '../components/ReviewForm';
import LazyImage from '../components/LazyImage';

const stripePromise = loadStripe('pk_test_51Rj1dnBOoulucdCvghV3vwtwYiAgrFek2IsnGS9WH0Sd1IQR3qdU0zGnpbWevLioQT3tKeOm4ifQBEQUxpMzrnm700Zw6YCpDl', {
  stripeLink: false
});

// Centralized API base to use in all requests in this file
const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || 'https://travel-backend-psi.vercel.app';

interface Tour {
  _id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  location: string;
  image?: string;
  images?: string[];
}

interface Booking {
  _id: string;
  tour: Tour | null; // The tour might be missing/removed; guard against null
  participants: number;
  totalPrice: number;
  bookingDate: string;
  travelDate: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  status: 'confirmed' | 'pending' | 'cancelled';
  customerInfo: {
    name: string;
    email: string;
    phone?: string;
  };
  notes?: string;
  hasReview?: boolean;
}

const UserDashboard: React.FC = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewBooking, setReviewBooking] = useState<Booking | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchBookings();
  }, [user, navigate]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/bookings/my-bookings`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        const bookingsData = data.bookings || [];
        
        // Check review status for each booking
        const bookingsWithReviewStatus = await Promise.all(
          bookingsData.map(async (booking: Booking) => {
            // If tour is missing, just return as-is with safe defaults
            if (!booking?.tour || !booking.tour._id) {
              return { ...booking, hasReview: false };
            }
            try {
              const reviewResponse = await fetch(`${API_BASE}/reviews/can-review/${booking.tour._id}`, {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              });
              const reviewData = await reviewResponse.json();
              return {
                ...booking,
                hasReview: reviewData.success ? !reviewData.data.canReview : false
              };
            } catch (error) {
              console.error('Error checking review status:', error);
              return { ...booking, hasReview: false };
            }
          })
        );
        
        setBookings(bookingsWithReviewStatus);
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handlePayNow = async (booking: Booking) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/bookings/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ bookingId: booking._id })
      });

      const data = await response.json();
      if (data.success) {
        setClientSecret(data.clientSecret);
        setSelectedBooking(booking);
        setShowPaymentModal(true);
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Error creating payment intent:', error);
      setError('Failed to initiate payment');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    setSelectedBooking(null);
    setClientSecret('');
    fetchBookings();
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    try {
      const response = await fetch(`${API_BASE}/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        fetchBookings();
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      setError('Failed to cancel booking');
    }
  };

  const handleLeaveReview = (booking: Booking) => {
    setReviewBooking(booking);
    setShowReviewForm(true);
  };

  const handleReviewSuccess = () => {
    setShowReviewForm(false);
    setReviewBooking(null);
    fetchBookings();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'failed': return 'bg-red-100 text-red-700 border-red-200';
      case 'confirmed': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'cancelled': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return '✓';
      case 'pending': return '⏱';
      case 'failed': return '✗';
      case 'confirmed': return '✓';
      case 'cancelled': return '✗';
      default: return '•';
    }
  };

  // Calculate stats
  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.paymentStatus === 'pending').length,
    confirmed: bookings.filter(b => b.paymentStatus === 'paid').length,
    totalSpent: bookings.filter(b => b.paymentStatus === 'paid').reduce((sum, b) => sum + b.totalPrice, 0)
  };

  if (loading && bookings.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 mt-[100px]">
      {/* Modern Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-500">Welcome back, {user?.username}</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/packages')}
              className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center space-x-2 shadow-sm hover:shadow-md"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>New Booking</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Modern Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Payment</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.pending}</p>
              </div>
              <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Confirmed</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.confirmed}</p>
              </div>
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">${stats.totalSpent}</p>
              </div>
              <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">{error}</span>
            </div>
          </div>
        )}

        {/* Bookings Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <svg className="w-5 h-5 mr-2 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              My Bookings
            </h2>
          </div>

          {bookings.length === 0 ? (
            <div className="px-6 py-20 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings yet</h3>
                <p className="text-gray-500 mb-6">Start your adventure by booking your first tour</p>
                <button
                  onClick={() => navigate('/packages')}
                  className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
                >
                  Explore Tours
                </button>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {bookings.map((booking) => (
                <div key={booking._id} className="p-6 hover:bg-gray-50/50 transition-colors">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Tour Image */}
                    <div className="flex-shrink-0">
                      <div className="relative group">
                        <LazyImage
                          src={booking.tour?.image || booking.tour?.images?.[0] || '/placeholder.jpg'}
                          alt={booking.tour?.title || 'Tour'}
                          className="w-full lg:w-56 h-40 object-cover rounded-lg shadow-sm"
                        />
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-teal-600 transition-colors cursor-pointer" onClick={() => booking.tour?._id && navigate(`/tour/${booking.tour._id}`)}>
                            {booking.tour?.title || 'Tour unavailable'}
                          </h3>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                            <div className="flex items-center">
                              <svg className="w-4 h-4 mr-1.5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {booking.tour?.location || '—'}
                            </div>
                            <div className="flex items-center">
                              <svg className="w-4 h-4 mr-1.5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {booking.tour?.duration || '—'}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 mb-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.paymentStatus)} inline-flex items-center justify-center w-fit`}>
                            <span className="mr-1">{getStatusIcon(booking.paymentStatus)}</span>
                            {booking.paymentStatus.toUpperCase()}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)} inline-flex items-center justify-center w-fit`}>
                            <span className="mr-1">{getStatusIcon(booking.status)}</span>
                            {booking.status.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
                        <div>
                          <p className="text-xs text-gray-500 font-medium mb-1">Travel Date</p>
                          <p className="text-sm font-semibold text-gray-900">{new Date(booking.travelDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium mb-1">Booked On</p>
                          <p className="text-sm font-semibold text-gray-900">{new Date(booking.bookingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium mb-1">Participants</p>
                          <p className="text-sm font-semibold text-gray-900">{booking.participants} {booking.participants === 1 ? 'Person' : 'People'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium mb-1">Total Price</p>
                          <p className="text-lg font-bold text-teal-600">${booking.totalPrice}</p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-2">
                        {booking.paymentStatus === 'pending' && booking.status !== 'cancelled' && (
                          <button
                            onClick={() => handlePayNow(booking)}
                            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center text-sm"
                          >
                            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                            Pay Now
                          </button>
                        )}
                        {booking.status === 'pending' && booking.paymentStatus !== 'paid' && (
                          <button
                            onClick={() => handleCancelBooking(booking._id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center text-sm"
                          >
                            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Cancel
                          </button>
                        )}
                        {booking.paymentStatus === 'paid' && !booking.hasReview && (
                          <button
                            onClick={() => handleLeaveReview(booking)}
                            className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center text-sm"
                          >
                            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                            Leave Review
                          </button>
                        )}
                        {booking.paymentStatus === 'paid' && booking.hasReview && (
                          <div className="bg-green-50 text-green-700 px-4 py-2 rounded-lg font-medium flex items-center text-sm border border-green-200">
                            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Review Submitted
                          </div>
                        )}
                        <button
                          onClick={() => booking.tour?._id && navigate(`/tour/${booking.tour._id}`)}
                          className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-400 transition-colors flex items-center text-sm"
                        >
                          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View Tour
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && clientSecret && selectedBooking && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <PaymentModal
            booking={selectedBooking}
            clientSecret={clientSecret}
            onClose={() => {
              setShowPaymentModal(false);
              setSelectedBooking(null);
              setClientSecret('');
            }}
            onSuccess={handlePaymentSuccess}
          />
        </Elements>
      )}

      {/* Review Form Modal */}
      {showReviewForm && reviewBooking && reviewBooking.tour && (
        <ReviewForm
          tourId={reviewBooking.tour._id}
          tourTitle={reviewBooking.tour.title}
          bookingId={reviewBooking._id}
          onSuccess={handleReviewSuccess}
          onClose={() => {
            setShowReviewForm(false);
            setReviewBooking(null);
          }}
        />
      )}
    </div>
  );
};

export default UserDashboard; 