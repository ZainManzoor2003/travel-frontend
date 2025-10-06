import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiUser, FiLogIn } from 'react-icons/fi';
import Swal from 'sweetalert2';
import TextField from '../components/TextField';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  // Clear error when user starts typing
  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (error) setError('');
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (error) setError('');
  };

  const handleUsernameChange = (value: string) => {
    setUsername(value);
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

    // Username validation (optional but if provided, should be valid)
    if (username.trim() && username.trim().length < 2) {
      setError('Username must be at least 2 characters long if provided');
      Swal.fire({
        icon: 'warning',
        title: 'Username Too Short',
        text: 'Username must be at least 2 characters long if provided.',
        confirmButtonText: 'OK',
        confirmButtonColor: '#F59E0B'
      });
      return;
    }

    setLoading(true);

    try {
      const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || 'https://travel-backend-psi.vercel.app';
      const response = await fetch(`${API_BASE}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Show success message with SweetAlert
        await Swal.fire({
          icon: 'success',
          title: 'Account Created!',
          text: 'Your account has been created successfully. Please login to continue.',
          confirmButtonText: 'Go to Login',
          confirmButtonColor: '#3B82F6'
        });
        
        // Navigate to login page
        navigate('/login');
      } else {
        setError(data.message || 'Signup failed');
        
        // Show server error with SweetAlert
        Swal.fire({
          icon: 'error',
          title: 'Signup Failed',
          text: data.message || 'An error occurred during signup. Please try again.',
          confirmButtonText: 'Try Again',
          confirmButtonColor: '#EF4444'
        });
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError('Network error. Please try again.');
      
      // Show error with SweetAlert
      Swal.fire({
        icon: 'error',
        title: 'Signup Failed',
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
            <pattern id="travel-pattern-signup" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="30" cy="30" r="2" fill="#3f7670"/>
              <path d="M15,15 L45,45 M45,15 L15,45" stroke="#3f7670" strokeWidth="1" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#travel-pattern-signup)"/>
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
              Start Your Journey!
            </h2>
            <p className="mt-2 text-teal-100 text-sm">
              Join thousands of travelers exploring the world
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
              label="Username (Optional)"
              type="text"
              value={username}
              onChange={handleUsernameChange}
              startIcon={<FiUser />}
              placeholder="Enter your username (optional)"
            />
            
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
              placeholder="Enter your password (min 6 characters)"
            />

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
                    Creating your account...
                  </div>
                ) : (
                  'Create your account'
                )}
              </button>
            </div>
            
            <div className="text-center mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">Already have an account?</span>
                </div>
              </div>
              
              <div className="mt-4">
                <Link 
                  to="/login" 
                  className="group font-semibold text-teal-600 hover:text-teal-500 transition-colors duration-200 inline-flex items-center px-6 py-3 border border-teal-300 rounded-xl hover:border-teal-400 hover:bg-teal-50 transition-all duration-200"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Sign in to your account
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


export default Signup;