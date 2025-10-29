import { createBrowserRouter, RouterProvider, Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import ProtectedRoute from '../components/ProtectedRoute';
import LandingPage from '../pages/LandingPage';
import AboutPage from '../pages/AboutPage';
import ContactPage from '../pages/ContactPage';
import BlogPage from '../pages/BlogPage';
import BlogDetailPage from '../pages/BlogDetailPage';
import GalleryPage from '../pages/GalleryPage';
import PaymentPage from '../pages/PaymentPage';
import PackagesPage from '../pages/PackagesPage';
import TourDetailPage from '../pages/TourDetailPage';
import SignUpPage from '../pages/SignupPage';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import UserDashboard from '../pages/UserDashboard';
import Homepage from '../pages/homepage/Homepage.jsx';
import HomepageBlogPage from '../pages/homepage/HomepageBlogPage.jsx';
import HomepagePackagesPage from '../pages/homepage/HomepagePackagesPage.jsx';
import HomepageGalleryPage from '../pages/homepage/HomepageGalleryPage.jsx';
import HomepageContactPage from '../pages/homepage/HomepageContactPage.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Homepage />,
  },
  {
    path: '/blog',
    element: <HomepageBlogPage />,
  },
  {
    path: '/gallery',
    element: <HomepageGalleryPage />,
  },
  {
    path: '/packages',
    element: <HomepagePackagesPage />,
  },
  {
    path: '/contact',
    element: <HomepageContactPage />,
  },
  {
    path: '/blog/:id',
    element: <BlogDetailPage />,
    errorElement: <div className="flex items-center justify-center min-h-screen">Error loading blog post</div>,
  },
  {
    path: '/tour/:id',
    element: <TourDetailPage />,
    errorElement: <div className="flex items-center justify-center min-h-screen">Error loading tour details</div>,
  },
  {
    path: '/my-dashboard',
    element: (
      <ProtectedRoute requireAdmin={false}>
        <UserDashboard />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: 'about',
        element: <AboutPage />,
      },
      {
        path: 'contact',
        element: <ContactPage />,
      },
      {
        path: 'blog',
        element: <BlogPage />,
      },
      {
        path: 'gallery',
        element: <GalleryPage />,
      },
      {
        path: 'payment',
        element: <PaymentPage />,
      },
      {
        path: 'packages',
        element: <PackagesPage />,
      },
    ],
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/signup',
    element: <SignUpPage />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute requireAdmin={true}>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">404 - Page Not Found</h1>
        <p className="text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
        <Link to="/" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
          Go Home
        </Link>
      </div>
    ),
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
