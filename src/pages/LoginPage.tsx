import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiLogIn } from 'react-icons/fi';
import Swal from 'sweetalert2';
import { useAuth } from '../contexts/AuthContext';
import Menu from './homepage/components/Menu.jsx';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Get the intended destination or default to home
  const from = location.state?.from?.pathname || '/';
  // Menu controls matching homepage
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);


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
    const controller = new AbortController();

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
        signal: controller.signal
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
    } catch (error: any) {
      if (error?.name === 'AbortError') return;
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
    <div className="relative min-h-screen bg-[#F8F8F8] overflow-hidden">
      {/* Homepage-style navbar */}
      <nav className="fixed top-0 left-0 right-0 z-[1000] p-8 px-12 flex items-center justify-between bg-transparent">
        <div className="flex items-center gap-6">
          <button onClick={toggleMenu} className="flex items-center gap-3 bg-none border-none text-white text-sm tracking-wider cursor-pointer transition-opacity duration-300 hover:opacity-80">
            <span className="flex flex-col gap-[3px]">
              <span className="w-[18px] h-[2px] bg-white" />
              <span className="w-[18px] h-[2px] bg-white" />
              <span className="w-[18px] h-[2px] bg-white" />
            </span>
            MENU
          </button>
          <div className="w-px h-5 bg-white/30" />
        </div>
        <div className="absolute left-1/2 -translate-x-1/2">
          <img 
            src="/Logo.webp"
            alt="Awasi Logo"
            className="h-24 w-56"
          />
        </div>
      </nav>

      {/* Background hero with overlay */}
      <section className="relative w-full h-screen flex items-center justify-center px-6 py-16">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full">
          <img 
            src="https://res.cloudinary.com/dfoetpdk9/image/upload/v1761725155/jv9whk3yedaxg53sx1wo.jpg" 
            alt="Background" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="absolute inset-0 bg-black/55"></div>
        <div className="relative z-10 w-full max-w-[520px] mx-auto bg-white rounded-[10px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] p-6 sm:p-9 mt-16">
          <h1 className="font-['Playfair_Display'] text-[clamp(1.75rem,4vw,2.25rem)] font-normal text-[#2c2c2c] text-center mb-4">Welcome Back</h1>
          <p className="font-['Inter'] text-sm text-[#666] text-center mb-6">Log in to manage your tailor-made journeys</p>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">{error}</div>
            )}

            <div className="flex flex-col">
              <label className="font-['Inter'] text-[0.85rem] text-[#666] tracking-[0.06em] mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                placeholder="you@example.com"
                className="border-none border-b border-[#ddd] py-3 px-1 font-['Inter'] text-base outline-none bg-transparent focus:border-b-[#2c2c2c]"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="font-['Inter'] text-[0.85rem] text-[#666] tracking-[0.06em] mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                placeholder="••••••••"
                className="border-none border-b border-[#ddd] py-3 px-1 font-['Inter'] text-base outline-none bg-transparent focus:border-b-[#2c2c2c]"
                required
              />
            </div>

            <div className="mt-2 text-right">
              <a href="#" className="font-['Inter'] text-sm text-[#2c2c2c] hover:opacity-80">Forgot password?</a>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-4 px-6 text-sm font-semibold rounded-lg text-white bg-[#2c2c2c] hover:bg-[#1f1f1f] focus:outline-none focus:ring-2 focus:ring-[#2c2c2c]/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-4">
                  <FiLogIn className="h-5 w-5 text-white/80" />
                </span>
                {loading ? 'Signing in...' : 'Login'}
              </button>
            </div>

            <div className="text-center mt-6">
              <span className="px-4 text-[#666] text-sm">New here?</span>
              <div className="mt-3">
                <Link to="/signup" className="group inline-flex items-center px-6 py-3 border border-[#2c2c2c] rounded-lg text-[#2c2c2c] hover:bg-[#2c2c2c] hover:text-white transition-colors duration-200">
                  <span className="transition-colors group-hover:text-white">Create account</span>
                </Link>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* Homepage Menu */}
      <Menu isOpen={isMenuOpen} onClose={closeMenu} />
    </div>
  );
};

export default Login;