import { useEffect, useRef, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { 
  FiClock, 
  FiMapPin,
  FiStar,
  FiZap,
  FiArrowLeft
} from 'react-icons/fi';
import LoadingSpinner from '../components/LoadingSpinner';
import BookingForm from '../components/BookingForm';
import TourReviews from '../components/TourReviews';
import LazyImage from '../components/LazyImage';
import Menu from '../components/homepage/Menu';
import { useLanguage } from '../contexts/LanguageContext';
import { API_BASE } from '../config/api';

interface Tour {
  _id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  location: string;
  category: string;
  rating: number;
  image: string;
  images?: string[];
  status: 'active' | 'inactive' | 'draft';
  featured: boolean;
  maxParticipants: number;
  difficulty: 'easy' | 'medium' | 'hard';
  createdAt: string;
  updatedAt: string;
  highlights?: string[];
  included?: string[];
  notIncluded?: string[];
  itinerary?: Array<{ title: string; description: string; points: string[] }>;
}

const TourDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBooked, setIsBooked] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxImageIndex, setLightboxImageIndex] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const sectionRefs = {
    hero: useRef<HTMLDivElement>(null),
    details: useRef<HTMLDivElement>(null),
    itinerary: useRef<HTMLDivElement>(null),
  };

  // Fetch tour data - refetch when language changes
  useEffect(() => {
    const controller = new AbortController();
    const fetchTour = async () => {
      if (!id) {
        setError('Tour ID not provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${API_BASE}/tours/${id}?lang=${language}`, { signal: controller.signal });
        
        if (response.status === 404) {
          setError('Tour not found');
          return;
        }
        
        if (!response.ok) {
          setError(`Failed to load tour: ${response.status} ${response.statusText}`);
          return;
        }
        
        const data = await response.json();
        
        // Handle different possible API response formats
        if (data.success) {
          // Format: { success: true, data: { ...tour } }
          setTour(data.data);
          setError(null);
        } else if (data._id) {
          // Format: { _id: "...", title: "...", ... } (direct tour object)
          setTour(data);
          setError(null);
        } else {
          setError(data.message || 'Failed to load tour');
        }
      } catch (err: any) {
        if (err?.name === 'AbortError') return;
        console.error('Error fetching tour:', err);
        setError('Failed to load tour details');
      } finally {
        setLoading(false);
      }
    };

    fetchTour();
    return () => controller.abort();
  }, [id, language]);

  useEffect(() => {
    if (!tour) return;

    // Hero animation
    if (sectionRefs.hero.current) {
      gsap.fromTo(
        sectionRefs.hero.current.querySelectorAll('.animate-on-scroll'),
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power3.out" }
      );
    }

    // Details animation
    if (sectionRefs.details.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              gsap.fromTo(
                entry.target.querySelectorAll('.animate-on-scroll'),
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out" }
              );
            }
          });
        },
        { threshold: 0.3 }
      );
      observer.observe(sectionRefs.details.current);
    }
  }, [tour]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const handleBookNow = () => {
    setShowBookingForm(true);
  };

  const handleBookingSuccess = () => {
    setShowBookingForm(false);
    setIsBooked(true);
  };

  const openLightbox = (index: number) => {
    setLightboxImageIndex(index);
    setIsLightboxOpen(true);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    document.body.style.overflow = 'unset'; // Restore scrolling
  };

  const nextLightboxImage = () => {
    setLightboxImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  const prevLightboxImage = () => {
    setLightboxImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  // Close lightbox on Escape key
  useEffect(() => {
    if (!tour) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isLightboxOpen) {
        closeLightbox();
      }
      if (e.key === 'ArrowRight' && isLightboxOpen) {
        nextLightboxImage();
      }
      if (e.key === 'ArrowLeft' && isLightboxOpen) {
        prevLightboxImage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, tour]);

  // Show loader while loading OR if no tour data yet
  if (loading || !tour) {
    return <LoadingSpinner />;
  }

  // Only show error if loading is complete AND there's an actual error
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f8f8] font-sans">
        <div className="text-center max-w-md mx-auto p-8">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Tour</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => navigate('/packages')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Go to Packages
          </button>
        </div>
      </div>
    );
  }

  // Booking success state
  if (isBooked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f8f8] font-sans">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="font-['Playfair_Display'] text-[clamp(2.5rem,4vw,3.5rem)] font-normal text-[#2c2c2c] tracking-tight leading-[1.2] mb-4">Booking Confirmed!</h2>
          <p className="font-['Inter'] text-lg font-normal text-[#666] leading-[1.6] mb-8">
            Your tour has been successfully booked. You will receive a confirmation email shortly.
          </p>
          <div className="space-y-4">
            <Link
              to="/payment"
              className="w-full text-white px-6 py-3 rounded-lg hover:bg-black transition-colors duration-200 inline-block font-['Inter']" style={{ backgroundColor: '#00c3a1' }}
            >
              Complete Payment
            </Link>
            <Link
              to="/packages"
              className="w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors duration-200 inline-block font-['Inter']" style={{ backgroundColor: '#ffe020' }}
            >
              Browse More Tours
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Get all images (both images array and single image)
  const allImages = tour.images && tour.images.length > 0 ? tour.images : (tour.image ? [tour.image] : []);

  return (
    <div className="w-full font-sans min-h-screen" style={{ backgroundColor: '#ffe020' }}>
      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 z-[1000] py-4 px-6 sm:py-6 sm:px-10 flex items-center justify-between" style={{ backgroundColor: '#ffe020' }}>
        <div className="flex items-center gap-6">
          <button className="flex items-center gap-3 bg-none border-none text-black font-sans text-sm font-normal tracking-wider cursor-pointer transition-opacity duration-300 hover:opacity-80" onClick={toggleMenu}>
            <span className="flex flex-col gap-[3px]">
              <span className="w-[18px] h-[2px] bg-black transition-all duration-300"></span>
              <span className="w-[18px] h-[2px] bg-black transition-all duration-300"></span>
              <span className="w-[18px] h-[2px] bg-black transition-all duration-300"></span>
            </span>
            {useLanguage().t('Menu')}
          </button>
          <div className="w-px h-5 bg-black/20"></div>
        </div>
        
        <div className="absolute left-1/2 -translate-x-1/2 pointer-events-none hidden md:block">
          <img 
            src="/Logo.webp"
            alt="Travel Beyond Logo"
            className="mt-1 h-12 w-auto md:h-14"
          />
        </div>
        
        {/* Back button removed as requested */}
      </nav>

      {/* Hero Section */}
      <section ref={sectionRefs.hero} className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden">
          {allImages.length > 0 ? (
            <>
              <LazyImage
                src={allImages[currentImageIndex]}
                alt={tour.title}
                className="w-full h-full object-cover"
                loading="eager"
              />
              
              {/* Image Navigation */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all z-10"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setCurrentImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1))}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all z-10"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  
                  {/* Image Indicators */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                    {allImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentImageIndex ? 'bg-white w-8' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#2c2c2c] to-[#1a1a1a] flex items-center justify-center">
              <p className="font-['Inter'] text-white text-xl">No images available</p>
            </div>
          )}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/20 via-black/40 to-black/30 z-[1]"></div>
        </div>
        
        <div className="relative z-[2] text-center p-8 max-w-6xl mx-auto">
          {/* Featured Badge */}
          {tour.featured && (
            <div className="mb-6">
              <span className="inline-block bg-yellow-500 text-yellow-900 px-6 py-2 rounded-full text-sm font-medium">
                Featured Tour
              </span>
            </div>
          )}

          {/* Title */}
          <h1 className="font-['Playfair_Display'] text-[clamp(2.5rem,6vw,4.5rem)] font-normal text-white tracking-tight leading-[1.1] shadow-[0_2px_20px_rgba(0,0,0,0.3)] mb-8">
            {tour.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-white/90 font-['Inter'] text-sm">
            <div className="flex items-center gap-2">
              <FiMapPin className="w-4 h-4" />
              <span>{tour.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <FiClock className="w-4 h-4" />
              <span>{tour.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <FiStar className="w-4 h-4 text-yellow-400" />
              <span>{tour.rating.toFixed(1)} Rating</span>
            </div>
            <div className="flex items-center gap-2 capitalize">
              <FiZap className="w-4 h-4" />
              <span>{tour.difficulty}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section ref={sectionRefs.details} className="w-full py-16" style={{ backgroundColor: '#ffe020' }}>
        <div className="max-w-[1400px] mx-auto px-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Left Content - Tour Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <div className="animate-on-scroll bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-8 border border-[#f0f0f0]">
                <h2 className="font-['Playfair_Display'] text-[clamp(2rem,3vw,2.5rem)] font-normal text-[#2c2c2c] tracking-tight leading-[1.2] mb-6">About This Tour</h2>
                <p className="font-['Inter'] text-[#555] text-lg leading-[1.6] tracking-[0.01em] mb-8">{tour.description}</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="p-6 rounded-lg" style={{ backgroundColor: '#00c3a1' }}>
                    <p className="font-['Inter'] text-[#666] font-semibold text-sm mb-2">Duration</p>
                    <p className="font-['Inter'] text-[#2c2c2c] text-lg font-bold">{tour.duration}</p>
                  </div>
                  <div className="p-6 rounded-lg" style={{ backgroundColor: '#00c3a1' }}>
                    <p className="font-['Inter'] text-[#666] font-semibold text-sm mb-2">Max Group</p>
                    <p className="font-['Inter'] text-[#2c2c2c] text-lg font-bold">{tour.maxParticipants} people</p>
                  </div>
                  <div className="p-6 rounded-lg" style={{ backgroundColor: '#00c3a1' }}>
                    <p className="font-['Inter'] text-[#666] font-semibold text-sm mb-2">Category</p>
                    <p className="font-['Inter'] text-[#2c2c2c] text-lg font-bold capitalize">{tour.category}</p>
                  </div>
                </div>
              </div>

              {/* Image Thumbnails */}
              {allImages.length > 1 && (
                <div className="animate-on-scroll bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-8 border border-[#f0f0f0]">
                  <h2 className="font-['Playfair_Display'] text-[clamp(1.5rem,2.5vw,2rem)] font-normal text-[#2c2c2c] tracking-tight leading-[1.2] mb-6">Tour Gallery ({allImages.length} Photos)</h2>
                  <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {allImages.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => openLightbox(index)}
                        className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer transition-all group ${
                          index === currentImageIndex ? 'ring-4 ring-[#2c2c2c]' : 'hover:ring-2 hover:ring-[#666]'
                        }`}
                      >
                        <img
                          src={img}
                          alt={`${tour.title} ${index + 1}`}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200 flex items-center justify-center">
                          <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                          </svg>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Highlights */}
              {tour.highlights && tour.highlights.length > 0 && (
                <div className="animate-on-scroll bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-8 border border-[#f0f0f0]">
                  <h2 className="font-['Playfair_Display'] text-[clamp(1.5rem,2.5vw,2rem)] font-normal text-[#2c2c2c] tracking-tight leading-[1.2] mb-6">Tour Highlights</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tour.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <svg className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="font-['Inter'] text-[#555] leading-[1.6]">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* What's Included */}
              {((tour.included && tour.included.length > 0) || (tour.notIncluded && tour.notIncluded.length > 0)) && (
                <div className="animate-on-scroll bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-8 border border-[#f0f0f0]">
                  <h2 className="font-['Playfair_Display'] text-[clamp(1.5rem,2.5vw,2rem)] font-normal text-[#2c2c2c] tracking-tight leading-[1.2] mb-6">What's Included</h2>
                  
                  {tour.included && tour.included.length > 0 && (
                    <div className="mb-6">
                      <h3 className="font-['Inter'] text-lg font-semibold text-green-600 mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Included
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {tour.included.map((item, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            <svg className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="font-['Inter'] text-[#555] text-sm leading-[1.6]">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {tour.notIncluded && tour.notIncluded.length > 0 && (
                    <div>
                      <h3 className="font-['Inter'] text-lg font-semibold text-red-600 mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Not Included
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {tour.notIncluded.map((item, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            <svg className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <span className="font-['Inter'] text-[#555] text-sm leading-[1.6]">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Itinerary */}
              {tour.itinerary && tour.itinerary.length > 0 && (
                <div ref={sectionRefs.itinerary} className="animate-on-scroll bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-8 border border-[#f0f0f0]">
                  <h2 className="font-['Playfair_Display'] text-[clamp(1.5rem,2.5vw,2rem)] font-normal text-[#2c2c2c] tracking-tight leading-[1.2] mb-6">Daily Itinerary</h2>
                  <div className="space-y-6">
                    {tour.itinerary.map((day, index) => (
                      <div key={index} className="border-l-4 border-[#2c2c2c] pl-6 pb-6 relative">
                        <div className="absolute -left-3 top-0 w-6 h-6 bg-[#2c2c2c] rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {index + 1}
                        </div>
                        <h3 className="font-['Inter'] text-xl font-semibold text-[#2c2c2c] mb-2">{day.title}</h3>
                        {day.description && (
                          <p className="font-['Inter'] text-[#666] mb-3 leading-[1.6]">{day.description}</p>
                        )}
                        {day.points && day.points.length > 0 && (
                          <ul className="space-y-2">
                            {day.points.map((point, pointIndex) => (
                              <li key={pointIndex} className="flex items-start space-x-2">
                                <svg className="w-4 h-4 text-[#2c2c2c] mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                                <span className="font-['Inter'] text-[#555] text-sm leading-[1.6]">{point}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Sidebar - Booking Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-8 sticky top-8 border border-[#f0f0f0]">
                <div className="text-center mb-8">
                  <div className="font-['Inter'] text-4xl font-bold text-[#2c2c2c] mb-2">${tour.price}</div>
                  <div className="font-['Inter'] text-[#666]">per person</div>
                </div>

                <div className="space-y-4 mb-8 border-t border-b border-[#e0e0e0] py-6">
                  <div className="flex justify-between items-center">
                    <span className="font-['Inter'] text-[#666]">Duration</span>
                    <span className="font-['Inter'] font-medium text-[#2c2c2c]">{tour.duration}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-['Inter'] text-[#666]">Location</span>
                    <span className="font-['Inter'] font-medium text-[#2c2c2c]">{tour.location}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-['Inter'] text-[#666]">Max Group</span>
                    <span className="font-['Inter'] font-medium text-[#2c2c2c]">{tour.maxParticipants} people</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-['Inter'] text-[#666]">Difficulty</span>
                    <span className="font-['Inter'] font-medium text-[#2c2c2c] capitalize">{tour.difficulty}</span>
                  </div>
                </div>

                <button
                  onClick={handleBookNow}
                  disabled={tour.status !== 'active'}
                  className="w-full text-white py-4 px-6 rounded-lg font-['Inter'] font-semibold text-lg hover:bg-black disabled:bg-[#ccc] disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center mb-6" style={{ backgroundColor: '#00c3a1' }}
                >
                  {tour.status !== 'active' ? 'Not Available' : 'Book Now'}
                </button>

                <div className="font-['Inter'] text-sm text-[#666] space-y-3 mt-6">
                  <p className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Free cancellation up to 48h
                  </p>
                  <p className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Instant confirmation
                  </p>
                  <p className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    24/7 customer support
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-[#e0e0e0]">
                  <Link
                    to="/packages"
                    className="font-['Inter'] text-[#2c2c2c] hover:text-[#666] font-medium flex items-center justify-center transition-colors duration-200"
                  >
                    <FiArrowLeft className="w-5 h-5 mr-2" />
                    Back to All Tours
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="w-full py-16" style={{ backgroundColor: '#ffe020' }}>
        <div className="max-w-[1400px] mx-auto px-12">
          <TourReviews tourId={tour._id} />
        </div>
      </section>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-50 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-200 group"
            aria-label="Close"
          >
            <svg className="w-6 h-6 group-hover:rotate-90 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Image Counter */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
            {lightboxImageIndex + 1} / {allImages.length}
          </div>

          {/* Previous Button */}
          {allImages.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevLightboxImage();
              }}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-4 rounded-full transition-all duration-200 hover:scale-110"
              aria-label="Previous image"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Next Button */}
          {allImages.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextLightboxImage();
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-4 rounded-full transition-all duration-200 hover:scale-110"
              aria-label="Next image"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Image */}
          <div 
            className="max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={allImages[lightboxImageIndex]}
              alt={`${tour.title} - Image ${lightboxImageIndex + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />
          </div>

          {/* Thumbnail Strip */}
          {allImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 max-w-4xl w-full px-4">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide justify-center">
                {allImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxImageIndex(index);
                    }}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden transition-all ${
                      index === lightboxImageIndex 
                        ? 'ring-4 ring-white scale-110' 
                        : 'ring-2 ring-white/30 hover:ring-white/60 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Keyboard Instructions */}
          <div className="absolute bottom-4 left-4 text-white/60 text-xs">
            Press <kbd className="bg-white/10 px-2 py-1 rounded">ESC</kbd> to close, 
            <kbd className="bg-white/10 px-2 py-1 rounded ml-2">←</kbd> 
            <kbd className="bg-white/10 px-2 py-1 rounded ml-1">→</kbd> to navigate
          </div>
        </div>
      )}

      {/* Booking Form Modal */}
      {showBookingForm && tour && (
        <BookingForm
          tour={tour}
          onClose={() => setShowBookingForm(false)}
          onSuccess={handleBookingSuccess}
        />
      )}

      {/* Menu Component */}
      <Menu isOpen={isMenuOpen} onClose={closeMenu} />
    </div>
  );
};

export default TourDetailPage;

