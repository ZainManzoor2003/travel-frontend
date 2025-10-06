import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import MainLayout from '../layouts/MainLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import ProtectedRoute from '../components/ProtectedRoute';

// Lazy load all pages
const LandingPage = lazy(() => import('../pages/LandingPage'));
const AboutPage = lazy(() => import('../pages/AboutPage'));
const ContactPage = lazy(() => import('../pages/ContactPage'));
const BlogPage = lazy(() => import('../pages/BlogPage'));
const BlogDetailPage = lazy(() => import('../pages/BlogDetailPage'));
const GalleryPage = lazy(() => import('../pages/GalleryPage'));
const PaymentPage = lazy(() => import('../pages/PaymentPage'));
const PackagesPage = lazy(() => import('../pages/PackagesPage'));
const TourDetailPage = lazy(() => import('../pages/TourDetailPage'));
const SignUpPage = lazy(() => import('../pages/SignupPage'));
const LoginPage = lazy(() => import('../pages/LoginPage'));
const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const UserDashboard = lazy(() => import('../pages/UserDashboard'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <LandingPage />
          </Suspense>
        ),
      },
      {
        path: 'about',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <AboutPage />
          </Suspense>
        ),
      },
      {
        path: 'contact',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <ContactPage />
          </Suspense>
        ),
      },
      {
        path: 'blog',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <BlogPage />
          </Suspense>
        ),
      },
      {
        path: 'blog/:id',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <BlogDetailPage />
          </Suspense>
        ),
      },
      {
        path: 'gallery',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <GalleryPage />
          </Suspense>
        ),
      },
      {
        path: 'payment',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <PaymentPage />
          </Suspense>
        ),
      },
      {
        path: 'packages',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <PackagesPage />
          </Suspense>
        ),
      },
      {
        path: 'tour/:id',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <TourDetailPage />
          </Suspense>
        ),
      },
      {
        path: 'my-dashboard',
        element: (
          <ProtectedRoute requireAdmin={false}>
            <Suspense fallback={<LoadingSpinner />}>
              <UserDashboard />
            </Suspense>
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: '/login',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    path: '/signup',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <SignUpPage />
      </Suspense>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute requireAdmin={true}>
        <Suspense fallback={<LoadingSpinner />}>
          <DashboardPage />
        </Suspense>
      </ProtectedRoute>
    ),
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
