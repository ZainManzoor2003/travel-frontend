import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import DashboardLayout from '../layouts/DashboardLayout';
import StatsCard from '../components/dashboard/StatsCard';
import UserManagement from '../components/dashboard/UserManagement';
import ToursManagement from '../components/dashboard/ToursManagement';
import TourBookingsManagement from '../components/dashboard/TourBookingsManagement';
import GalleryManagement from '../components/dashboard/GalleryManagement';
import BlogManagement from '../components/dashboard/BlogManagement';
import { useAuth } from '../contexts/AuthContext';

const DashboardPage = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({ users: 0, blogs: 0, gallery: 0, tours: 0, bookings: 0 });
  const [statsLoading, setStatsLoading] = useState(false);
  const { token } = useAuth();
  const heroRef = useRef<HTMLDivElement>(null);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Load dashboard counts
  useEffect(() => {
    const loadCounts = async () => {
      try {
        setStatsLoading(true);
        if (!token) return; // counts endpoint requires admin auth
        const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || 'https://travel-backend-psi.vercel.app';
        const res = await fetch(`${API_BASE}/dashboard/counts`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setStats(data.data);
        }
      } finally {
        setStatsLoading(false);
      }
    };
    loadCounts();
  }, [token]);

  useEffect(() => {
    if (heroRef.current && !isLoading) {
      gsap.fromTo(
        heroRef.current.querySelectorAll('.animate-on-scroll'),
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power3.out" }
      );
    }
  }, [isLoading]);

  const statsData: Array<{ title: string; value: number | string; change: string; changeType: 'positive' | 'negative' | 'neutral'; icon: 'users' | 'map' | 'camera' | 'document' | 'clipboard' | 'banknotes'; color: 'blue' | 'green' | 'purple' | 'orange' | 'indigo' | 'emerald' }>= [
    {
      title: 'Total Users',
      value: stats.users,
      change: '+12%',
      changeType: 'positive' as const,
      icon: 'users',
      color: 'blue' as const
    },
    {
      title: 'Total Tours',
      value: stats.tours,
      change: '+5%',
      changeType: 'positive' as const,
      icon: 'map',
      color: 'green' as const
    },
    {
      title: 'Gallery Items',
      value: stats.gallery,
      change: '+8%',
      changeType: 'positive' as const,
      icon: 'camera',
      color: 'purple' as const
    },
    {
      title: 'Blog Posts',
      value: stats.blogs,
      change: '+3%',
      changeType: 'positive' as const,
      icon: 'document',
      color: 'orange' as const
    },
    {
      title: 'Total Bookings',
      value: stats.bookings,
      change: '+15%',
      changeType: 'positive' as const,
      icon: 'clipboard',
      color: 'indigo' as const
    }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Stats Grid (spans 2 cols on lg) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Flexbox with wrapping */}
              <div className="flex flex-wrap items-stretch gap-4 md:gap-6">
                {statsData.map((stat, index) => (
                  <div key={index} className="flex-[0_1_260px] max-w-full">
                    <StatsCard {...stat} />
                  </div>
                ))}
                {statsLoading && (
                  <div className="basis-full text-sm text-gray-500">Refreshing stats...</div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => setActiveSection('users')}
                  className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200 text-left"
                >
                  <div className="w-10 h-10 mb-2 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a4 4 0 00-4-4h-3m-4 6H2v-2a4 4 0 014-4h3m6-4a4 4 0 11-8 0 4 4 0 018 0zm6 0a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                  </div>
                  <div className="font-medium text-gray-900">Manage Users</div>
                  <div className="text-sm text-gray-600">View and edit user accounts</div>
                </button>
                <button
                  onClick={() => setActiveSection('tours')}
                  className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors duration-200 text-left"
                >
                  <div className="w-10 h-10 mb-2 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A2 2 0 013 15.382V5a2 2 0 012-2h0a2 2 0 012 2v8l6 3 6-3V5a2 2 0 00-2-2h0"/></svg>
                  </div>
                  <div className="font-medium text-gray-900">Manage Tours</div>
                  <div className="text-sm text-gray-600">Add and edit tour packages</div>
                </button>
                <button
                  onClick={() => setActiveSection('gallery')}
                  className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors duration-200 text-left"
                >
                  <div className="w-10 h-10 mb-2 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7h3l2-3h8l2 3h3v12H3V7zm9 3a4 4 0 100 8 4 4 0 000-8z"/></svg>
                  </div>
                  <div className="font-medium text-gray-900">Manage Gallery</div>
                  <div className="text-sm text-gray-600">Upload and organize images</div>
                </button>
                <button
                  onClick={() => setActiveSection('blog')}
                  className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors duration-200 text-left"
                >
                  <div className="w-10 h-10 mb-2 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </div>
                  <div className="font-medium text-gray-900">Manage Blog</div>
                  <div className="text-sm text-gray-600">Create and edit blog posts</div>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">New user registration: John Doe</p>
                    <p className="text-xs text-gray-500">2 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">Tour "Bali Adventure" was updated</p>
                    <p className="text-xs text-gray-500">15 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">New gallery image uploaded</p>
                    <p className="text-xs text-gray-500">1 hour ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">Blog post "Travel Tips" published</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'users':
        return <UserManagement />;
      case 'tours':
        return <ToursManagement />;
      case 'bookings':
        return <TourBookingsManagement />;
      case 'gallery':
        return <GalleryManagement />;
      case 'blog':
        return <BlogManagement />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout activeSection={activeSection} onSectionChange={setActiveSection}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div 
          ref={heroRef}
          className="bg-white border-b border-gray-200 px-6 py-8"
        >
          <div className="max-w-7xl mx-auto">
            <div className="animate-on-scroll">
              <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {renderContent()}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
