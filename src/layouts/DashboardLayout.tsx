import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiHome,
  FiUsers,
  FiMap,
  FiImage,
  FiBook,
  FiCalendar,
  FiLogOut,
  FiMenu,
  FiX
} from 'react-icons/fi';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const DashboardLayout = ({ children, activeSection, onSectionChange }: DashboardLayoutProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: <FiHome className="w-5 h-5" />,
      color: 'blue'
    },
    {
      id: 'users',
      label: 'User Management',
      icon: <FiUsers className="w-5 h-5" />,
      color: 'green'
    },
    {
      id: 'tours',
      label: 'Tours & Packages',
      icon: <FiMap className="w-5 h-5" />,
      color: 'purple'
    },
    {
      id: 'bookings',
      label: 'Tour Bookings',
      icon: <FiCalendar className="w-5 h-5" />,
      color: 'teal'
    },
    {
      id: 'gallery',
      label: 'Gallery Management',
      icon: <FiImage className="w-5 h-5" />,
      color: 'orange'
    },
    {
      id: 'blog',
      label: 'Blog Management',
      icon: <FiBook className="w-5 h-5" />,
      color: 'indigo'
    }
  ];


  const handleLogout = () => {
    localStorage.removeItem('authToken');
    window.location.href = '/';
  };

  const getNavItemClasses = (color: string, isActive: boolean) => {
    const baseClasses = "flex items-center space-x-2 px-3 py-2 rounded-md transition-all duration-200 text-sm font-medium";
    
    if (isActive) {
      return `${baseClasses} bg-white/20 text-white`;
    }

    return `${baseClasses} text-white/80 hover:bg-white/10 hover:text-white`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="shadow-sm" style={{ backgroundColor: '#3f7670' }}>
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 py-4">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <img 
                  src="/Logo1.png" 
                  alt="Travel Beyond Tours Logo" 
                  className="h-12 sm:h-14 md:h-16 lg:h-20 w-auto object-contain"
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex! items-center space-x-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onSectionChange(item.id)}
                  className={getNavItemClasses(item.color, activeSection === item.id)}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
              
              {/* User Info and Logout */}
              <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-white/20">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">A</span>
                </div>
                <div className="hidden lg:block">
                  <p className="text-sm font-medium text-white">Admin User</p>
                  <p className="text-xs text-white/70">admin@travelbeyondtours.com</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-3 py-2 text-white/80 hover:bg-red-600 hover:text-white rounded-md transition-colors duration-200"
                >
                  <FiLogOut className="w-4 h-4" />
                  <span className="hidden lg:inline">Logout</span>
                </button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md text-white/80 hover:text-white hover:bg-white/10"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden border-t border-white/20 py-4">
              <div className="space-y-1">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSectionChange(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      activeSection === item.id
                        ? 'bg-white/20 text-white'
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
                
                {/* Mobile User Section */}
                <div className="pt-4 mt-4 border-t border-white/20">
                  <div className="flex items-center space-x-3 px-4 py-2">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">A</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">Admin User</p>
                      <p className="text-xs text-white/70">admin@travelbeyondtours.com</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-white/80 hover:bg-red-600 hover:text-white rounded-lg transition-colors duration-200"
                  >
                    <FiLogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
