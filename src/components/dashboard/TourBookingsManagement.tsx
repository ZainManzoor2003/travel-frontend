import React, { useState, useEffect } from 'react';

interface User {
  _id: string;
  username: string;
  email: string;
}

interface Booking {
  _id: string;
  user: User;
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
}

interface Tour {
  _id: string;
  title: string;
  location: string;
  price: number;
  duration: string;
  status: string;
  image?: string;
  maxParticipants: number;
}

interface TourStats {
  totalBookings: number;
  pendingPayments: number;
  confirmedBookings: number;
  totalRevenue: number;
  totalParticipants: number;
}

interface TourWithBookings {
  tour: Tour;
  bookings: Booking[];
  stats: TourStats;
}

const TourBookingsManagement: React.FC = () => {
  const [toursData, setToursData] = useState<TourWithBookings[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedTours, setExpandedTours] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchTourBookings();
  }, []);

  const fetchTourBookings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || 'https://travel-backend-psi.vercel.app';
      const response = await fetch(`${API_BASE}/bookings/tour-bookings`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setToursData(data.data);
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Error fetching tour bookings:', error);
      setError('Failed to fetch tour bookings');
    } finally {
      setLoading(false);
    }
  };

  const toggleTourExpand = (tourId: string) => {
    const newExpanded = new Set(expandedTours);
    if (newExpanded.has(tourId)) {
      newExpanded.delete(tourId);
    } else {
      newExpanded.add(tourId);
    }
    setExpandedTours(newExpanded);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-emerald-100 text-emerald-700 border-emerald-300';
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-300';
      case 'failed': return 'bg-red-100 text-red-700 border-red-300';
      case 'confirmed': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'cancelled': return 'bg-gray-100 text-gray-700 border-gray-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-xl shadow-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Tour Bookings Management</h2>
        <p className="text-teal-100">View all tours and their bookings with customer details</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Tours</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{toursData.length}</p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-emerald-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {toursData.reduce((sum, t) => sum + t.stats.totalBookings, 0)}
              </p>
            </div>
            <div className="bg-emerald-100 rounded-full p-3">
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                ${toursData.reduce((sum, t) => sum + t.stats.totalRevenue, 0)}
              </p>
            </div>
            <div className="bg-purple-100 rounded-full p-3">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-amber-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Pending Payments</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {toursData.reduce((sum, t) => sum + t.stats.pendingPayments, 0)}
              </p>
            </div>
            <div className="bg-amber-100 rounded-full p-3">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Tours List */}
      {toursData.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <div className="max-w-sm mx-auto">
            <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No tours with bookings yet</h3>
            <p className="text-gray-500">Tours will appear here once customers start booking</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {toursData.map((tourData) => {
            const isExpanded = expandedTours.has(tourData.tour._id);
            return (
              <div key={tourData.tour._id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
                {/* Tour Header */}
                <div 
                  className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleTourExpand(tourData.tour._id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      {tourData.tour.image && (
                        <img
                          src={tourData.tour.image}
                          alt={tourData.tour.title}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{tourData.tour.title}</h3>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            </svg>
                            {tourData.tour.location}
                          </span>
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {tourData.tour.duration}
                          </span>
                          <span className="flex items-center font-semibold text-teal-600">
                            ${tourData.tour.price} / person
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Tour Stats */}
                    <div className="flex items-center space-x-6 ml-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-teal-600">{tourData.stats.totalBookings}</p>
                        <p className="text-xs text-gray-500">Bookings</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-emerald-600">{tourData.stats.confirmedBookings}</p>
                        <p className="text-xs text-gray-500">Confirmed</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-purple-600">${tourData.stats.totalRevenue}</p>
                        <p className="text-xs text-gray-500">Revenue</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">{tourData.stats.totalParticipants}</p>
                        <p className="text-xs text-gray-500">Participants</p>
                      </div>
                      <button className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Bookings List (Expandable) */}
                {isExpanded && (
                  <div className="border-t border-gray-200 bg-gray-50">
                    {tourData.bookings.length === 0 ? (
                      <div className="p-8 text-center text-gray-500">
                        No bookings for this tour yet
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-100 border-b border-gray-200">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Contact</th>
                              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Travel Date</th>
                              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Participants</th>
                              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Payment</th>
                              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 bg-white">
                            {tourData.bookings.map((booking) => (
                              <tr key={booking._id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">{booking.customerInfo.name}</p>
                                    <p className="text-sm text-gray-500">{booking.user.username}</p>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm">
                                    <p className="text-gray-900">{booking.customerInfo.email}</p>
                                    {booking.customerInfo.phone && (
                                      <p className="text-gray-500">{booking.customerInfo.phone}</p>
                                    )}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {new Date(booking.travelDate).toLocaleDateString('en-US', { 
                                    month: 'short', 
                                    day: 'numeric', 
                                    year: 'numeric' 
                                  })}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {booking.participants}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                  ${booking.totalPrice}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusBadgeColor(booking.paymentStatus)}`}>
                                    {booking.paymentStatus}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusBadgeColor(booking.status)}`}>
                                    {booking.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TourBookingsManagement; 