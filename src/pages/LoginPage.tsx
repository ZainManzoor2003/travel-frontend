import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';
import Swal from 'sweetalert2';
import TextField from '../components/TextField';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Get the intended destination or default to home
  const from = location.state?.from?.pathname || '/';

  // Clear error when user starts typing
  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (error) setError('');
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Frontend validation
    if (!email.trim()) {
      setError('Email is required');
      Swal.fire({
        icon: 'warning',
        title: 'Email Required',
        text: 'Please enter your email address.',
        confirmButtonText: 'OK',
        confirmButtonColor: '#F59E0B'
      });
      return;
    }

    if (!password.trim()) {
      setError('Password is required');
      Swal.fire({
        icon: 'warning',
        title: 'Password Required',
        text: 'Please enter your password.',
        confirmButtonText: 'OK',
        confirmButtonColor: '#F59E0B'
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Email',
        text: 'Please enter a valid email address.',
        confirmButtonText: 'OK',
        confirmButtonColor: '#F59E0B'
      });
      return;
    }

    // Password length validation
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      Swal.fire({
        icon: 'warning',
        title: 'Password Too Short',
        text: 'Password must be at least 6 characters long.',
        confirmButtonText: 'OK',
        confirmButtonColor: '#F59E0B'
      });
      return;
    }

    setLoading(true);

    try {
      const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || 'https://travel-backend-psi.vercel.app';
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Use AuthContext to store user data
        login(data.data.user, data.data.token);
        
        // Show success message with SweetAlert
        await Swal.fire({
          icon: 'success',
          title: 'Login Successful!',
          text: `Welcome back, ${data.data.user.username || data.data.user.email}!`,
          confirmButtonText: 'Continue',
          confirmButtonColor: '#3B82F6',
          timer: 2000,
          timerProgressBar: true
        });
        
        // Navigate to intended destination or home page
        navigate(from, { replace: true });
      } else {
        setError(data.message || 'Login failed');
        
        // Show server error with SweetAlert
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: data.message || 'Invalid email or password. Please try again.',
          confirmButtonText: 'Try Again',
          confirmButtonColor: '#EF4444'
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please try again.');
      
      // Show error with SweetAlert
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: 'Network error. Please check your connection and try again.',
        confirmButtonText: 'Try Again',
        confirmButtonColor: '#EF4444'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-teal-100 relative overflow-hidden">
      <Navbar />
      
      <div className="flex items-center justify-center p-4 pt-24 min-h-screen">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-100 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
      </div>

      {/* Travel-themed background pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="travel-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="30" cy="30" r="2" fill="#3f7670"/>
              <path d="M15,15 L45,45 M45,15 L15,45" stroke="#3f7670" strokeWidth="1" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#travel-pattern)"/>
        </svg>
      </div>

      <div className="relative w-full max-w-md mx-auto z-10">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-teal-100 overflow-hidden">
          {/* Header with travel theme */}
          <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-8 py-6 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm p-3">
                <img src="/Logo1.png" alt="Travel Beyond Tours Logo" className="w-20 h-20 object-contain" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white">
              Welcome Back, Explorer!
            </h2>
            <p className="mt-2 text-teal-100 text-sm">
              Continue your journey with us
            </p>
          </div>

          <div className="p-8">
          
          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <TextField
              label="Email address"
              type="email"
              value={email}
              onChange={handleEmailChange}
              required
              startIcon={<FiMail />}
              placeholder="Enter your email address"
            />
            
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              required
              startIcon={<FiLock />}
              placeholder="Enter your password"
            />

            <div className="flex justify-end mt-2">
              <div className="text-sm">
                <a href="#" className="font-medium text-teal-600 hover:text-teal-500 transition-colors duration-200">
                  Forgot password?
                </a>
              </div>
            </div>

            <div className="mt-8">
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-4 px-6 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-4">
                  <FiLogIn className="h-5 w-5 text-teal-200 group-hover:text-teal-100 transition-colors" />
                </span>
                {loading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </div>
                ) : (
                  'Sign in to your account'
                )}
              </button>
            </div>
            
            <div className="text-center mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">New to our platform?</span>
                </div>
              </div>
              
              <div className="mt-4">
                <Link 
                  to="/signup" 
                  className="group font-semibold text-teal-600 hover:text-teal-500 transition-colors duration-200 inline-flex items-center px-6 py-3 border border-teal-300 rounded-xl hover:border-teal-400 hover:bg-teal-50 transition-all duration-200"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Create your account
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </Link>
              </div>
            </div>
          </form>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Login;