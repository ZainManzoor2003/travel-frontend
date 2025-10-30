import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiLogIn } from 'react-icons/fi';
import Swal from 'sweetalert2';
import { useAuth } from '../contexts/AuthContext';
import Menu from '../components/homepage/Menu';
import LanguageSelector from '../components/LanguageSelector';
import { useLanguage } from '../contexts/LanguageContext';

const Signup = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Homepage-like menu controls
  const toggleMenu = () => setIsMenuOpen((p) => !p);
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
    const controller = new AbortController();

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
        signal: controller.signal
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
    } catch (error: any) {
      if (error?.name === 'AbortError') return;
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
            {t('Menu')}
          </button>
          <div className="w-px h-5 bg-white/30" />
          <LanguageSelector />
        </div>
        <div className="absolute left-1/2 -translate-x-1/2">
          <img 
            src="/Logo.webp"
            alt="Awasi Logo"
            className="h-24 w-56"
          />
        </div>
      </nav>

      {/* Signup hero with overlay */}
      <section className="relative w-full flex items-center justify-center px-6 py-16">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full">
          <img 
            src="https://res.cloudinary.com/dfoetpdk9/image/upload/v1761725188/gqvfr7yaxnbxhe34dwcy.jpg" 
            alt="Background" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="absolute inset-0 bg-black/55"></div>
        <div className="relative z-10 w-full max-w-[520px] mx-auto bg-white rounded-[10px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] p-6 sm:p-9 mt-16">
          <h1 className="font-['Playfair_Display'] text-[clamp(1.75rem,4vw,2.25rem)] font-normal text-[#2c2c2c] text-center mb-4">{t('Create Account')}</h1>
          <p className="font-['Inter'] text-sm text-[#666] text-center mb-6">{t('Start crafting your fully tailor‑made experience')}</p>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}
            <div className="flex flex-col">
              <label className="font-['Inter'] text-[0.85rem] text-[#666] tracking-[0.06em] mb-1">{t('Username (Optional)')}</label>
              <input 
                type="text"
                value={username}
                onChange={(e) => handleUsernameChange(e.target.value)}
                placeholder={t('Enter your username (optional)')}
                className="border-none border-b border-[#ddd] py-3 px-1 font-['Inter'] text-base outline-none bg-transparent focus:border-b-[#2c2c2c]"
              />
            </div>

            <div className="flex flex-col">
              <label className="font-['Inter'] text-[0.85rem] text-[#666] tracking-[0.06em] mb-1">{t('Email address')}</label>
              <input 
                type="email"
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                placeholder={t('Enter your email address')}
                className="border-none border-b border-[#ddd] py-3 px-1 font-['Inter'] text-base outline-none bg-transparent focus:border-b-[#2c2c2c]"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="font-['Inter'] text-[0.85rem] text-[#666] tracking-[0.06em] mb-1">{t('Password')}</label>
              <input 
                type="password"
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                placeholder={t('Enter your password (min 6 characters)')}
                className="border-none border-b border-[#ddd] py-3 px-1 font-['Inter'] text-base outline-none bg-transparent focus:border-b-[#2c2c2c]"
                required
              />
            </div>

            <div className="mt-8">
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-4 px-6 text-sm font-semibold rounded-lg text-white bg-[#2c2c2c] hover:bg-[#1f1f1f] focus:outline-none focus:ring-2 focus:ring-[#2c2c2c]/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-4">
                  <FiLogIn className="h-5 w-5 text-white/80" />
                </span>
                {loading ? t('Creating your account...') : t('Create your account')}
              </button>
            </div>
            
            <div className="text-center mt-6">
              <span className="px-4 text-[#666] text-sm">{t('Already have an account?')}</span>
              
              <div className="mt-4">
                <Link 
                  to="/login" 
                  className="group font-semibold text-[#2c2c2c] hover:text-white transition-colors duration-200 inline-flex items-center px-6 py-3 border border-[#2c2c2c] rounded-lg hover:bg-[#2c2c2c]"
                >
                  <svg className="w-4 h-4 mr-2 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="transition-colors group-hover:text-white">{t('Sign in to your account')}</span>
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </Link>
              </div>
            </div>
          </form>
          </div>
      </section>

      <Menu isOpen={isMenuOpen} onClose={closeMenu} />
    </div>
  );
};


export default Signup;