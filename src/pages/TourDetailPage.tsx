import { useEffect, useRef, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import LoadingSpinner from '../components/LoadingSpinner';
import BookingForm from '../components/BookingForm';
import TourReviews from '../components/TourReviews';
import LazyImage from '../components/LazyImage';

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
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBooked, setIsBooked] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxImageIndex, setLightboxImageIndex] = useState(0);

  const sectionRefs = {
    hero: useRef<HTMLDivElement>(null),
    details: useRef<HTMLDivElement>(null),
    itinerary: useRef<HTMLDivElement>(null),
  };

  // Fetch tour data
  useEffect(() => {
    const fetchTour = async () => {
      if (!id) {
        setError('Tour ID not provided');
        setLoading(false);
        return;
      }

      try {
        const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || 'https://travel-backend-psi.vercel.app';
        const response = await fetch(`${API_BASE}/tours/${id}`);
        const data = await response.json();
        
        if (data.success) {
          setTour(data.data);
          setError(null);
        } else {
          setError(data.message || 'Failed to load tour');
        }
      } catch (err) {
        setError('Failed to load tour details');
        console.error('Error fetching tour:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTour();
  }, [id]);

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

  // Loading state
  if (loading) {
    return <LoadingSpinner />;
  }

  // Error state
  if (error || !tour) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Tour Not Found</h2>
          <p className="text-gray-600 mb-8">{error || 'The requested tour could not be found.'}</p>
          <Link
            to="/packages"
            className="inline-block bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors duration-200"
          >
            Browse All Tours
          </Link>
        </div>
      </div>
    );
  }

  // Booking success state
  if (isBooked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Booking Confirmed!</h2>
          <p className="text-gray-600 mb-8">
            Your tour has been successfully booked. You will receive a confirmation email shortly.
          </p>
          <div className="space-y-4">
            <Link
              to="/payment"
              className="w-full bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors duration-200 inline-block"
            >
              Complete Payment
            </Link>
            <Link
              to="/packages"
              className="w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 inline-block"
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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Image Gallery */}
      <section
        ref={sectionRefs.hero}
        className="relative bg-gradient-to-br from-teal-900 to-teal-700 text-white"
      >
        {/* Image Carousel */}
        <div className="relative h-[calc(100vh-80px)] min-h-[500px] overflow-hidden bg-black mt-20">
          {allImages.length > 0 ? (
            <>
              <LazyImage
                src={allImages[currentImageIndex]}
                alt={tour.title}
                className="w-full h-full object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
              
              {/* Image Navigation */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setCurrentImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1))}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  
                  {/* Image Indicators */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
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
            <div className="w-full h-full bg-gradient-to-br from-teal-600 to-teal-800 flex items-center justify-center">
              <p className="text-white text-xl">No images available</p>
            </div>
          )}
          
          {/* Tour Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
            <div className="max-w-7xl mx-auto">
              <div className="animate-on-scroll">
                {tour.featured && (
                  <span className="inline-block bg-yellow-500 text-yellow-900 px-3 py-1 rounded-full text-sm font-medium mb-3">
                    Featured Tour
                  </span>
                )}
                <h1 className="text-4xl md:text-5xl font-bold mb-3">{tour.title}</h1>
                <div className="flex flex-wrap items-center gap-6 text-lg">
                  <div className="flex items-center">
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {tour.location}
                  </div>
                  <div className="flex items-center">
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {tour.duration}
                  </div>
                  <div className="flex items-center">
                    <svg className="w-6 h-6 mr-2 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {tour.rating.toFixed(1)} Rating
                  </div>
                  <div className="flex items-center capitalize">
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    {tour.difficulty}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section ref={sectionRefs.details} className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Content - Tour Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <div className="animate-on-scroll bg-white rounded-xl shadow-sm p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">About This Tour</h2>
                <p className="text-gray-700 text-lg leading-relaxed">{tour.description}</p>
                <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-teal-50 p-4 rounded-lg">
                    <p className="text-teal-600 font-semibold text-sm">Duration</p>
                    <p className="text-gray-900 text-lg font-bold">{tour.duration}</p>
                  </div>
                  <div className="bg-teal-50 p-4 rounded-lg">
                    <p className="text-teal-600 font-semibold text-sm">Max Group</p>
                    <p className="text-gray-900 text-lg font-bold">{tour.maxParticipants} people</p>
                  </div>
                  <div className="bg-teal-50 p-4 rounded-lg">
                    <p className="text-teal-600 font-semibold text-sm">Category</p>
                    <p className="text-gray-900 text-lg font-bold capitalize">{tour.category}</p>
                  </div>
                </div>
              </div>

              {/* Image Thumbnails */}
              {allImages.length > 1 && (
                <div className="animate-on-scroll bg-white rounded-xl shadow-sm p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Tour Gallery ({allImages.length} Photos)</h2>
                  <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {allImages.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => openLightbox(index)}
                        className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer transition-all bg-gray-100 group ${
                          index === currentImageIndex ? 'ring-4 ring-teal-500' : 'hover:ring-2 hover:ring-teal-300'
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
                <div className="animate-on-scroll bg-white rounded-xl shadow-sm p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Tour Highlights</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tour.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <svg className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* What's Included */}
              {((tour.included && tour.included.length > 0) || (tour.notIncluded && tour.notIncluded.length > 0)) && (
                <div className="animate-on-scroll bg-white rounded-xl shadow-sm p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">What's Included</h2>
                  
                  {tour.included && tour.included.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-green-600 mb-4 flex items-center">
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
                            <span className="text-gray-700 text-sm">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {tour.notIncluded && tour.notIncluded.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-red-600 mb-4 flex items-center">
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
                            <span className="text-gray-700 text-sm">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Itinerary */}
              {tour.itinerary && tour.itinerary.length > 0 && (
                <div ref={sectionRefs.itinerary} className="animate-on-scroll bg-white rounded-xl shadow-sm p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Daily Itinerary</h2>
                  <div className="space-y-6">
                    {tour.itinerary.map((day, index) => (
                      <div key={index} className="border-l-4 border-teal-500 pl-6 pb-6 relative">
                        <div className="absolute -left-3 top-0 w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {index + 1}
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{day.title}</h3>
                        {day.description && (
                          <p className="text-gray-600 mb-3">{day.description}</p>
                        )}
                        {day.points && day.points.length > 0 && (
                          <ul className="space-y-2">
                            {day.points.map((point, pointIndex) => (
                              <li key={pointIndex} className="flex items-start space-x-2">
                                <svg className="w-4 h-4 text-teal-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                                <span className="text-gray-700 text-sm">{point}</span>
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
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-teal-600 mb-2">${tour.price}</div>
                  <div className="text-gray-600">per person</div>
                </div>

                <div className="space-y-4 mb-6 border-t border-b border-gray-200 py-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-medium text-gray-900">{tour.duration}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Location</span>
                    <span className="font-medium text-gray-900">{tour.location}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Max Group</span>
                    <span className="font-medium text-gray-900">{tour.maxParticipants} people</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Difficulty</span>
                    <span className="font-medium text-gray-900 capitalize">{tour.difficulty}</span>
                  </div>
                </div>

                <button
                  onClick={handleBookNow}
                  disabled={tour.status !== 'active'}
                  className="w-full bg-teal-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center mb-4"
                >
                  {tour.status !== 'active' ? 'Not Available' : 'Book Now'}
                </button>

                <div className="text-sm text-gray-500 space-y-2 mt-4">
                  <p className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Free cancellation up to 48h
                  </p>
                  <p className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Instant confirmation
                  </p>
                  <p className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    24/7 customer support
                  </p>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <Link
                    to="/packages"
                    className="text-teal-600 hover:text-teal-700 font-medium flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to All Tours
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <TourReviews tourId={tour._id} />
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
    </div>
  );
};

export default TourDetailPage;

