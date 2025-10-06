import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { useAuth } from '../contexts/AuthContext';
import {
  FiHome,
  FiInfo,
  FiPackage,
  FiImage,
  FiBook,
  FiMail,
  FiUser,
  
  FiLogOut,
  FiX,
  FiMenu
} from 'react-icons/fi';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navbarRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isLoggedIn, logout } = useAuth();

  // API base for prefetching to warm backend and cache
  const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || 'https://travel-backend-psi.vercel.app';

  // Prefetch tours to reduce first navigation latency to /packages
  const prefetchTours = () => {
    try {
      // Avoid spamming: only prefetch once per session
      if ((window as any).__toursPrefetched) return;
      (window as any).__toursPrefetched = true;
      // Use low-priority idle callback if available
      const doFetch = () => {
        fetch(`${API_BASE}/tours`, { credentials: 'include' }).catch(() => {});
        // Preload the JS chunk for the Packages page so navigation is instant
        import('../pages/PackagesPage').catch(() => {});
      };
      // @ts-ignore
      if (window.requestIdleCallback) {
        // @ts-ignore
        window.requestIdleCallback(doFetch, { timeout: 2000 });
      } else {
        setTimeout(doFetch, 0);
      }
    } catch {}
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navbar animation
  useEffect(() => {
    if (navbarRef.current) {
      gsap.fromTo(
        navbarRef.current,
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
      );
    }
  }, []);

  // Mobile menu animation
  useEffect(() => {
    if (isMenuOpen && mobileMenuRef.current) {
      gsap.fromTo(
        mobileMenuRef.current,
        { x: '100%', opacity: 0 },
        { x: 0, opacity: 1, duration: 0.3, ease: "power2.out" }
      );
    } else if (!isMenuOpen && mobileMenuRef.current) {
      gsap.to(mobileMenuRef.current, {
        x: '100%',
        opacity: 0,
        duration: 0.3,
        ease: "power2.in"
      });
    }
  }, [isMenuOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { name: 'Home', path: '/', icon: <FiHome className="mr-2" /> },
    { name: 'About', path: '/about', icon: <FiInfo className="mr-2" /> },
    { name: 'Packages', path: '/packages', icon: <FiPackage className="mr-2" /> },
    { name: 'Gallery', path: '/gallery', icon: <FiImage className="mr-2" /> },
    { name: 'Blog', path: '/blog', icon: <FiBook className="mr-2" /> },
    { name: 'Contact', path: '/contact', icon: <FiMail className="mr-2" /> },
  ];

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate('/');
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <>
      <nav
        ref={navbarRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? 'shadow-lg backdrop-blur-md'
          : ''
          }`}
        style={{ backgroundColor: '#3f7670' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 py-4">
            {/* Logo */}
            <Link to="/" className="flex items-center z-50 pt-2">
              <img  src="/Logo1.png" alt="Travel Beyond Tours Logo" className="h-12 sm:h-14 md:h-16 lg:h-20 w-auto object-contain" />
            </Link>

            {/* Desktop Navigation - This should be visible on larger screens */}

            {/* <div className={isMenuOpen?"hidden":"flex items-center space-x-8"}> */}
            <div className="hidden lg:flex! items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center text-sm font-medium transition-colors duration-200 ${location.pathname === item.path
                    ? 'text-teal-200'
                    : 'text-white hover:text-teal-200'
                    }`}
                  onMouseEnter={item.path === '/packages' ? prefetchTours : undefined}
                  onFocus={item.path === '/packages' ? prefetchTours : undefined}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}

              {/* User authentication section */}
              {isLoggedIn ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center space-x-2 p-2 rounded-full hover:bg-teal-700 transition-colors duration-200"
                  >
                    <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                      <FiUser className="text-teal-600" />
                    </div>
                    <span className="text-sm font-medium text-white">{user?.username || user?.email || 'User'}</span>
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                      {user?.role === 'admin' ? (
                        <Link
                          to="/dashboard"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowDropdown(false)}
                        >
                          Admin Dashboard
                        </Link>
                      ) : (
                        <Link
                          to="/my-dashboard"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowDropdown(false)}
                        >
                          My Dashboard
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <FiLogOut className="mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 focus:ring-2 focus:ring-emerald-300 transition-colors duration-200"
                  >
                    Login
                  </Link>
                </div>
              )}
            </div>


            {/* Mobile menu button - Only visible on smaller screens */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md transition-colors duration-200 text-white"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar - Only visible on smaller screens */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-[#49434391] bg-opacity-50"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Sidebar */}
          <div
            ref={mobileMenuRef}
            className="fixed right-0 top-0 h-full w-80 max-w-sm bg-white shadow-xl"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">T</span>
                  </div>
                  <span className="text-xl font-bold text-gray-900">Travel Beyond Tours</span>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                >
                  <FiX className="h-6 w-6" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="flex-1 px-6 py-6 space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200 ${location.pathname === item.path
                      ? 'text-teal-600 bg-teal-50'
                      : 'text-gray-700 hover:text-teal-600 hover:bg-gray-50'
                      }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Authentication Section */}
              <div className="p-6 border-t border-gray-200 space-y-4">
                {isLoggedIn ? (
                  <>
                    <div className="flex items-center space-x-3 px-4 py-2 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                        <FiUser className="text-teal-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user?.username || user?.email || 'User'}</p>
                      </div>
                    </div>
                    {user?.role === 'admin' ? (
                      <Link
                        to="/dashboard"
                        className="block w-full text-center bg-teal-100 text-teal-700 px-4 py-3 rounded-lg font-medium hover:bg-teal-200 transition-colors duration-200"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    ) : (
                      <Link
                        to="/my-dashboard"
                        className="block w-full text-center bg-teal-100 text-teal-700 px-4 py-3 rounded-lg font-medium hover:bg-teal-200 transition-colors duration-200"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        My Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center justify-center w-full bg-teal-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors duration-200"
                    >
                      <FiLogOut className="mr-2" />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block w-full text-center bg-gray-100 text-gray-700 px-4 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      className="block w-full text-center bg-teal-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;