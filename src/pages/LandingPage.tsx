import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import LazyImage from '../components/LazyImage';
import CountUp from 'react-countup';
import TourCard from '../components/TourCard';

// Interface for Tour data structure
interface Tour {
  _id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  location: string;
  image: string;
  rating: number;
  category: string;
  featured: boolean;
  status: string;
}

// Interface for Gallery Item (currently unused but kept for future use)
// interface GalleryItem {
//   _id: string;
//   title: string;
//   imageUrl: string;
//   category: string;
// }

const LandingPage = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const destinationsRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const galleryPreviewRef = useRef<HTMLDivElement>(null);
  const [isStatsVisible, setIsStatsVisible] = useState(false);
  
  // State for dynamic tours
  const [featuredTours, setFeaturedTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for gallery preview (currently unused but kept for future use)
  // const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);

  // Background slideshow images from public/images
  const heroImages = [
    '/images/DSC_2904.JPG',
    '/images/DSC_4045.JPG',
    '/images/DSC_4436.JPG',
    '/images/DSC_4854.JPG',
    '/images/PXL_20241111_192620770.RAW-01.COVER.jpg',
    '/images/PXL_20241114_144124542.RAW-01.COVER.jpg',
    '/images/PXL_20241114_160932760.RAW-01.COVER.jpg',
    '/images/PXL_20241114_190604108.RAW-01.MP.COVER.jpg',
  ];
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [previousHeroIndex, setPreviousHeroIndex] = useState<number | null>(null);

  // Cycle hero images with blur crossfade
  useEffect(() => {
    const intervalMs = 5000; // time each image stays visible
    const timer = setInterval(() => {
      setPreviousHeroIndex(() => {
        // previous becomes the current before we advance
        return currentHeroIndex;
      });
      setCurrentHeroIndex((idx) => (idx + 1) % heroImages.length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [currentHeroIndex, heroImages.length]);

  // Preload images to avoid flashes
  useEffect(() => {
    heroImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'https://travel-backend-psi.vercel.app';

  // Function to fetch featured tours from backend
  const fetchFeaturedTours = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch tours with featured=true
      const response = await fetch(`${API_BASE_URL}/tours?featured=true`);
      const data = await response.json();
      
      if (data.success) {
        // Take top 4 featured
        const featuredToursData = (data.data.tours || []).slice(0, 4);
        
        setFeaturedTours(featuredToursData);
      } else {
        setError(data.message || 'Failed to fetch tours');
      }
    } catch (err) {
      setError('Failed to fetch tours. Please try again later.');
      console.error('Error fetching tours:', err);
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch gallery items for preview (currently unused but kept for future use)
  // const fetchGalleryPreview = async () => {
  //   try {
  //     const response = await fetch(`${API_BASE_URL}/gallery?status=active&limit=8`);
  //     const data = await response.json();
      
  //     if (data.success) {
  //       setGalleryItems((data.data.galleryItems || []).slice(0, 8));
  //     }
  //   } catch (err) {
  //     console.error('Error fetching gallery:', err);
  //   }
  // };

  useEffect(() => {
    // Fetch featured tours on component mount
    fetchFeaturedTours();
    // fetchGalleryPreview(); // Commented out as gallery preview is not currently used
  }, []);


  // Eyes follow cursor effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const leftPupil = document.getElementById('left-pupil');
      const rightPupil = document.getElementById('right-pupil');

      if (leftPupil && rightPupil) {
        const leftEye = leftPupil.parentElement;
        const rightEye = rightPupil.parentElement;

        if (leftEye && rightEye) {
          // Calculate for left eye
          const leftRect = leftEye.getBoundingClientRect();
          const leftEyeX = leftRect.left + leftRect.width / 2;
          const leftEyeY = leftRect.top + leftRect.height / 2;
          
          const leftAngle = Math.atan2(e.clientY - leftEyeY, e.clientX - leftEyeX);
          const leftDistance = Math.min(30, Math.hypot(e.clientX - leftEyeX, e.clientY - leftEyeY) / 10);
          
          const leftPupilX = Math.cos(leftAngle) * leftDistance;
          const leftPupilY = Math.sin(leftAngle) * leftDistance;
          
          leftPupil.style.transform = `translate(${leftPupilX}px, ${leftPupilY}px)`;

          // Calculate for right eye
          const rightRect = rightEye.getBoundingClientRect();
          const rightEyeX = rightRect.left + rightRect.width / 2;
          const rightEyeY = rightRect.top + rightRect.height / 2;
          
          const rightAngle = Math.atan2(e.clientY - rightEyeY, e.clientX - rightEyeX);
          const rightDistance = Math.min(30, Math.hypot(e.clientX - rightEyeX, e.clientY - rightEyeY) / 10);
          
          const rightPupilX = Math.cos(rightAngle) * rightDistance;
          const rightPupilY = Math.sin(rightAngle) * rightDistance;
          
          rightPupil.style.transform = `translate(${rightPupilX}px, ${rightPupilY}px)`;
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    // Hero animation - coming from right
    if (heroRef.current) {
      const tl = gsap.timeline();
      tl.fromTo(
        heroRef.current.querySelector('.hero-title'),
        { x: 100, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, ease: "power3.out" }
      )
      .fromTo(
        heroRef.current.querySelector('.hero-subtitle'),
        { x: 80, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
        "-=0.5"
      )
      .fromTo(
        heroRef.current.querySelector('.hero-cta'),
        { x: 60, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
        "-=0.3"
      );
    }

    // Stats animation
    if (statsRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsStatsVisible(true);
              gsap.fromTo(
                entry.target.querySelectorAll('.stat-item'),
                { y: 20, opacity: 0 },
                { 
                  y: 0, 
                  opacity: 1, 
                  duration: 0.8, 
                  stagger: 0.15, 
                  ease: "power3.out" 
                }
              );
            }
          });
        },
        { threshold: 0.3 }
      );
      observer.observe(statsRef.current);
    }

    // Cards stagger animation
    if (cardsRef.current) {
      const cardsObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              gsap.fromTo(
                entry.target.querySelectorAll('.tour-card'),
                { y: 30, opacity: 0 },
                { 
                  y: 0, 
                  opacity: 1, 
                  duration: 0.8, 
                  stagger: 0.15, 
                  ease: "power3.out" 
                }
              );
            }
          });
        },
        { threshold: 0.2 }
      );
      cardsObserver.observe(cardsRef.current);
    }

    // Destinations animation
    if (destinationsRef.current) {
      const destObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              gsap.fromTo(
                entry.target.querySelectorAll('.destination-card'),
                { scale: 0.8, opacity: 0 },
                { 
                  scale: 1, 
                  opacity: 1, 
                  duration: 0.6, 
                  stagger: 0.1, 
                  ease: "back.out(1.7)" 
                }
              );
            }
          });
        },
        { threshold: 0.2 }
      );
      destObserver.observe(destinationsRef.current);
    }

    // Services animation
    if (servicesRef.current) {
      const servicesObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              gsap.fromTo(
                entry.target.querySelectorAll('.service-item'),
                { y: 20, opacity: 0 },
                { 
                  y: 0, 
                  opacity: 1, 
                  duration: 0.6, 
                  stagger: 0.1, 
                  ease: "power3.out" 
                }
              );
            }
          });
        },
        { threshold: 0.2 }
      );
      servicesObserver.observe(servicesRef.current);
    }

    // Gallery preview animation
    if (galleryPreviewRef.current) {
      const galleryObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              gsap.fromTo(
                entry.target.querySelectorAll('.gallery-preview-item'),
                { scale: 0.9, opacity: 0 },
                { 
                  scale: 1, 
                  opacity: 1, 
                  duration: 0.5, 
                  stagger: 0.08, 
                  ease: "power3.out" 
                }
              );
            }
          });
        },
        { threshold: 0.1 }
      );
      galleryObserver.observe(galleryPreviewRef.current);
    }
  }, []);


  return (
    <div  className="min-h-screen">
      {/* Hero Section */}


      <section 
        ref={heroRef}
        className="relative h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden"
      >
        {/* Background Slideshow */}
        <div className="absolute inset-0">
          {heroImages.map((src, index) => {
            const isActive = index === currentHeroIndex;
            const isPrevious = previousHeroIndex === index;
            return (
              <img
                key={src}
                src={src}
                alt="Travel destination"
                className={[
                  'absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-out',
                  isActive ? 'opacity-100 blur-0' : isPrevious ? 'opacity-0 blur-sm' : 'opacity-0 blur-0',
                ].join(' ')}
              />
            );
                    })}
          {/* readability overlays: subtle blue + vertical gradient */}
                     <div className="absolute inset-0 pointer-events-none">
             <div className="absolute inset-0 bg-teal-900/25" />
             <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/35 via-transparent to-emerald-900/35" />
           </div>
          </div>
          
        {/* Content */}
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="hero-title text-4xl md:text-6xl font-bold mb-6 leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
            Discover Your
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-300 mt-2">
              Next Adventure
            </span>
          </h1>
          <p className="hero-subtitle text-lg md:text-xl mb-8 text-teal-100 max-w-2xl mx-auto leading-relaxed drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)]">
            Explore breathtaking destinations, create unforgettable memories, and experience the world like never before.
          </p>
          <div className="hero-cta flex flex-wrap gap-4 justify-center">
            <Link
              to="/packages"
              className="bg-teal-500 text-white hover:bg-teal-600 px-6 py-3 rounded-md text-base font-medium transition-all duration-200 shadow-sm hover:shadow-md focus:ring-2 focus:ring-emerald-300"
            >
              Explore Tours
            </Link>
            <Link
              to="/gallery"
              className="border border-teal-300/50 text-white hover:bg-teal-300/10 px-6 py-3 rounded-md text-base font-medium transition-all duration-200 backdrop-blur-sm"
            >
              View Gallery
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Stats Section - Moved before Featured Tours */}
      <section ref={statsRef} className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Why Choose Us</h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Trusted by travelers worldwide for exceptional experiences
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 md:gap-12 lg:gap-16 text-center">
            <div className="stat-item flex-1 min-w-[120px] max-w-[160px] sm:max-w-none">
              <div className="text-3xl md:text-4xl font-bold mb-2 text-teal-600">
                {isStatsVisible && <CountUp end={500} duration={2} suffix="+" />}
              </div>
              <div className="text-gray-600 text-sm">Happy Travelers</div>
            </div>
            <div className="stat-item flex-1 min-w-[120px] max-w-[160px] sm:max-w-none">
              <div className="text-3xl md:text-4xl font-bold mb-2 text-teal-600">
                {isStatsVisible && <CountUp end={50} duration={2} suffix="+" />}
              </div>
              <div className="text-gray-600 text-sm">Destinations</div>
            </div>
            <div className="stat-item flex-1 min-w-[120px] max-w-[160px] sm:max-w-none">
              <div className="text-3xl md:text-4xl font-bold mb-2 text-teal-600">
                {isStatsVisible && <CountUp end={100} duration={2} suffix="+" />}
              </div>
              <div className="text-gray-600 text-sm">Tours Available</div>
            </div>
            <div className="stat-item flex-1 min-w-[120px] max-w-[160px] sm:max-w-none">
              <div className="text-3xl md:text-4xl font-bold mb-2 text-teal-600">
                {isStatsVisible && <CountUp end={4.9} duration={2} decimals={1} />}
              </div>
              <div className="text-gray-600 text-sm">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Destinations Section */}
      <section ref={destinationsRef} className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-indigo-600 font-semibold text-sm uppercase tracking-wide mb-2">Popular Destinations</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Beautiful Places Around The World
            </h2>
          </div>
          
          {/* Bento Grid Layout */}
          <div className="destinations-bento-grid">
            {/* Paris - Large Left Card */}
            <Link to="/packages?location=Paris" className="destination-card paris-card group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
              <img 
                src="/images/DSC_2904.JPG" 
                alt="Paris" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
            </Link>

            {/* Brazil - Top Middle Card */}
            <Link to="/packages?location=Brazil" className="destination-card brazil-card group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
              <img 
                src="/images/DSC_4436.JPG" 
                alt="Brazil" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
            </Link>

            {/* Japan - Bottom Middle Card */}
            <Link to="/packages?location=Japan" className="destination-card japan-card group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
              <img 
                src="/images/DSC_4045.JPG" 
                alt="Japan" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
            </Link>

            {/* London - Large Right Card */}
            <Link to="/packages?location=London" className="destination-card london-card group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
              <img 
                src="/images/DSC_4854.JPG" 
                alt="London" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
            </Link>
          </div>
        </div>

        <style dangerouslySetInnerHTML={{__html: `
          .destinations-bento-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            grid-template-rows: repeat(2, 290px);
            gap: 1rem;
          }

          .paris-card {
            grid-column: 1;
            grid-row: 1 / 3;
          }

          .brazil-card {
            grid-column: 2;
            grid-row: 1;
          }

          .japan-card {
            grid-column: 2;
            grid-row: 2;
          }

          .london-card {
            grid-column: 3;
            grid-row: 1 / 3;
          }

          @media (max-width: 768px) {
            .destinations-bento-grid {
              grid-template-columns: 1fr;
              grid-template-rows: auto;
              gap: 1rem;
            }

            .paris-card,
            .brazil-card,
            .japan-card,
            .london-card {
              grid-column: 1;
              grid-row: auto;
              min-height: 300px;
            }
          }
        `}} />
      </section>

      {/* Featured Tours Section */}
      <section ref={cardsRef} className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Featured Tours</h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Handpicked experiences that showcase the best of each destination
            </p>
          </div>
          
          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading featured tours...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <div className="text-red-600 mb-4">
                <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={fetchFeaturedTours}
                className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors duration-200"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Tours Grid */}
          {!loading && !error && featuredTours.length > 0 && (
            <div className="flex flex-wrap justify-center gap-6 md:gap-8 -mx-2">
              {featuredTours.map((tour) => (
                <div 
                  key={tour._id} 
                  className="tour-card flex-grow-0 flex-shrink-0 basis-full sm:basis-[calc(50%-1rem)] lg:basis-[calc(33.333%-1.5rem)] px-2 mb-6"
                  style={{ maxWidth: '400px' }}
                >
                  <TourCard 
                    id={tour._id}
                    title={tour.title}
                    description={tour.description}
                    price={tour.price}
                    duration={tour.duration}
                    image={tour.image}
                    rating={tour.rating}
                    location={tour.location}
                    className="w-full" 
                  />
                </div>
              ))}
            </div>
          )}

          {/* No Tours State */}
          {!loading && !error && featuredTours.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <p className="text-gray-600 mb-4">No featured tours available at the moment.</p>
              <Link
                to="/packages"
                className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors duration-200 inline-block"
              >
                Browse All Tours
              </Link>
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link
              to="/packages"
              className="inline-flex items-center text-teal-600 hover:text-teal-700 font-medium transition-colors duration-200"
            >
              View All Tours
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Select Offers For Traveling Section */}
      <section ref={servicesRef} className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-teal-600 font-semibold text-sm uppercase tracking-wide mb-2">Popular Services</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Select Offers For Traveling
            </h2>
          </div>
          
          <div className="flex flex-wrap justify-center items-start gap-x-12 gap-y-10 lg:gap-x-16">
            {/* Different Location */}
            <div className="service-item text-center group cursor-pointer flex-shrink-0">
              <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <svg className="w-16 h-16 text-teal-600 group-hover:text-teal-700 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="font-medium text-gray-900 text-sm whitespace-nowrap">Different Location</h3>
            </div>

            {/* Best Travel */}
            <div className="service-item text-center group cursor-pointer flex-shrink-0">
              <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <svg className="w-16 h-16 text-teal-600 group-hover:text-teal-700 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h3 className="font-medium text-gray-900 text-sm whitespace-nowrap">Best Travel</h3>
            </div>

            {/* Food Tours */}
            <div className="service-item text-center group cursor-pointer flex-shrink-0">
              <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <svg className="w-16 h-16 text-teal-600 group-hover:text-teal-700 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  <circle cx="12" cy="12" r="10" strokeWidth={1.5} />
                </svg>
              </div>
              <h3 className="font-medium text-gray-900 text-sm whitespace-nowrap">Food Tours</h3>
            </div>

            {/* Summer Rest */}
            <div className="service-item text-center group cursor-pointer flex-shrink-0">
              <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <svg className="w-16 h-16 text-teal-600 group-hover:text-teal-700 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="font-medium text-gray-900 text-sm whitespace-nowrap">Summer Rest</h3>
            </div>

            {/* Ship Cruises */}
            <div className="service-item text-center group cursor-pointer flex-shrink-0">
              <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <svg className="w-16 h-16 text-teal-600 group-hover:text-teal-700 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </div>
              <h3 className="font-medium text-gray-900 text-sm whitespace-nowrap">Ship Cruises</h3>
            </div>

            {/* Mountain Tours */}
            <div className="service-item text-center group cursor-pointer flex-shrink-0">
              <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <svg className="w-16 h-16 text-teal-600 group-hover:text-teal-700 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3l3.057-3L20 21H2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 14l2-2 2 2" />
                </svg>
              </div>
              <h3 className="font-medium text-gray-900 text-sm whitespace-nowrap">Mountain Tours</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Best Traveler Share A Photo - Slider Section */}
      <section className="py-16 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-teal-600 font-semibold text-sm uppercase tracking-wide mb-2">Our Gallery</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Best Traveler Share A Photo
            </h2>
          </div>
          
          {/* Horizontal Scrolling Gallery */}
          <div className="relative">
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {/* Repeat slider images 3 times for continuous scroll */}
              {[...Array(3)].map((_, repeatIndex) => (
                <>
                  <div 
                    key={`img-1-${repeatIndex}`}
                    className="flex-shrink-0 w-64 h-80 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 snap-center group cursor-pointer relative"
                  >
                    <LazyImage 
                      src="/DSC_4436.JPG" 
                      alt="Travel moment" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-teal-600/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <img src="/Logo1.png" alt="Logo" className="w-32 h-32 object-contain" />
                    </div>
                  </div>
                  <div 
                    key={`img-2-${repeatIndex}`}
                    className="flex-shrink-0 w-64 h-80 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 snap-center group cursor-pointer relative"
                  >
                    <img 
                      src="DSC05987.JPG" 
                      alt="Travel moment" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-teal-600/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <img src="/Logo1.png" alt="Logo" className="w-32 h-32 object-contain" />
                    </div>
                  </div>
                  <div 
                    key={`img-3-${repeatIndex}`}
                    className="flex-shrink-0 w-64 h-80 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 snap-center group cursor-pointer relative"
                  >
                    <img 
                      src="DSC08034.JPG" 
                      alt="Travel moment" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-teal-600/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <img src="/Logo1.png" alt="Logo" className="w-32 h-32 object-contain" />
                    </div>
                  </div>
                  <div 
                    key={`img-4-${repeatIndex}`}
                    className="flex-shrink-0 w-64 h-80 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 snap-center group cursor-pointer relative"
                  >
                    <img 
                      src="DSC08246.JPG" 
                      alt="Travel moment" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-teal-600/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <img src="/Logo1.png" alt="Logo" className="w-32 h-32 object-contain" />
                    </div>
                  </div>
                  <div 
                    key={`img-5-${repeatIndex}`}
                    className="flex-shrink-0 w-64 h-80 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 snap-center group cursor-pointer relative"
                  >
                    <img 
                      src="DSC08340.JPG" 
                      alt="Travel moment" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-teal-600/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <img src="/Logo1.png" alt="Logo" className="w-32 h-32 object-contain" />
                    </div>
                  </div>
                  <div 
                    key={`img-6-${repeatIndex}`}
                    className="flex-shrink-0 w-64 h-80 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 snap-center group cursor-pointer relative"
                  >
                    <img 
                      src="DSC08343.JPG" 
                      alt="Travel moment" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-teal-600/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <img src="/Logo1.png" alt="Logo" className="w-32 h-32 object-contain" />
                    </div>
                  </div>
                  <div 
                    key={`img-7-${repeatIndex}`}
                    className="flex-shrink-0 w-64 h-80 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 snap-center group cursor-pointer relative"
                  >
                    <img 
                      src="PXL_20241114_160932760.RAW-01.COVER.jpg" 
                      alt="Travel moment" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-teal-600/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <img src="/Logo1.png" alt="Logo" className="w-32 h-32 object-contain" />
                    </div>
                  </div>
                  <div 
                    key={`img-8-${repeatIndex}`}
                    className="flex-shrink-0 w-64 h-80 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 snap-center group cursor-pointer relative"
                  >
                    <img 
                      src="PXL_20241114_180127457.RAW-01.COVER.jpg" 
                      alt="Travel moment" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-teal-600/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <img src="/Logo1.png" alt="Logo" className="w-32 h-32 object-contain" />
                    </div>
                  </div>
                  <div 
                    key={`img-9-${repeatIndex}`}
                    className="flex-shrink-0 w-64 h-80 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 snap-center group cursor-pointer relative"
                  >
                    <img 
                      src="PXL_20241115_191636409.RAW-01.COVER.jpg" 
                      alt="Travel moment" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-teal-600/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <img src="/Logo1.png" alt="Logo" className="w-32 h-32 object-contain" />
                    </div>
                  </div>
                  <div 
                    key={`img-10-${repeatIndex}`}
                    className="flex-shrink-0 w-64 h-80 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 snap-center group cursor-pointer relative"
                  >
                    <img 
                      src="PXL_20241116_162838519.RAW-01.MP.COVER.jpg" 
                      alt="Travel moment" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-teal-600/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <img src="/Logo1.png" alt="Logo" className="w-32 h-32 object-contain" />
                    </div>
                  </div>
                  <div 
                    key={`img-11-${repeatIndex}`}
                    className="flex-shrink-0 w-64 h-80 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 snap-center group cursor-pointer relative"
                  >
                    <img 
                      src="PXL_20241120_003035630.RAW-01.COVER.jpg" 
                      alt="Travel moment" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-teal-600/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <img src="/Logo1.png" alt="Logo" className="w-32 h-32 object-contain" />
                    </div>
                  </div>
                  <div 
                    key={`img-12-${repeatIndex}`}
                    className="flex-shrink-0 w-64 h-80 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 snap-center group cursor-pointer relative"
                  >
                    <img 
                      src="PXL_20241121_200449979.RAW-01.COVER-SharpenAI-Focus.jpg" 
                      alt="Travel moment" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-teal-600/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <img src="/Logo1.png" alt="Logo" className="w-32 h-32 object-contain" />
                    </div>
                  </div>
                </>
              ))}
            </div>
          </div>

          <div className="text-center mt-10">
            <Link
              to="/gallery"
              className="inline-flex items-center text-teal-600 hover:text-teal-700 font-medium transition-colors duration-200"
            >
              View Full Gallery
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        <style dangerouslySetInnerHTML={{__html: `
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}} />
      </section>

      {/* Our Blog Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Our Blog
            </h2>
            <p className="text-gray-600 text-lg">
              An insight the incredible experience in the world
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Side - Image with Artistic Effect */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src="/images/DSC_4436.JPG" 
                  alt="Blog featured" 
                  className="w-full h-[400px] object-cover"
                />
                {/* Artistic brush stroke overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 via-transparent to-blue-500/20 mix-blend-overlay"></div>
              </div>
              {/* Decorative background shape */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-teal-200 rounded-full blur-3xl opacity-50 -z-10"></div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-blue-200 rounded-full blur-3xl opacity-50 -z-10"></div>
            </div>

            {/* Right Side - Content */}
            <div className="space-y-6">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900">
                Beautiful Kashmir Let's Travel
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                We are ready to help you build and also realize the room design that you dream of, with our experts and also 
                the best category recommendations from us
              </p>
              <Link
                to="/blog"
                className="inline-flex items-center text-teal-600 hover:text-teal-700 font-semibold text-lg group"
              >
                Read more
                <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Eyes Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center gap-12">
            {/* Left Eye */}
            <div className="relative w-60 h-60 rounded-full flex items-center justify-center shadow-2xl" style={{ backgroundColor: '#3f7670' }}>
              <div 
                id="left-pupil"
                className="w-24 h-24 bg-gray-900 rounded-full transition-all duration-100 ease-out flex items-center justify-center"
              >
                <div className="w-8 h-8 bg-white rounded-full"></div>
              </div>
            </div>

            {/* Right Eye */}
            <div className="relative w-60 h-60 rounded-full flex items-center justify-center shadow-2xl" style={{ backgroundColor: '#3f7670' }}>
              <div 
                id="right-pupil"
                className="w-24 h-24 bg-gray-900 rounded-full transition-all duration-100 ease-out flex items-center justify-center"
              >
                <div className="w-8 h-8 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Infinite Scrolling Text Section */}
      <section className="py-16 overflow-hidden border-t-2 border-b-2" style={{ backgroundColor: '#3f7670', borderColor: '#2f5650' }}>
        <div className="scrolling-text-container">
          <div className="scrolling-text">
            <span className="text-item">TRAVELERS ARE EXPLORERS</span>
            <span className="text-item">DISCOVER THE WORLD</span>
            <span className="text-item">ADVENTURE AWAITS</span>
            <span className="text-item">BEYOND TOURS</span>
            <span className="text-item">EXPLORE WONDERS</span>
            <span className="text-item">CREATE MEMORIES</span>
          </div>
        </div>

        <style dangerouslySetInnerHTML={{__html: `
          .scrolling-text-container {
            width: 100%;
            overflow: hidden;
            position: relative;
          }

          .scrolling-text {
            display: flex;
            white-space: nowrap;
            animation: scroll-left 20s linear infinite;
          }

          .text-item {
            font-size: 7rem;
            font-weight: 300;
            color: #fff;
            padding: 0 4rem;
            display: inline-block;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            line-height: 1;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          }

          @keyframes scroll-left {
            0% {
              transform: translateX(100%);
            }
            100% {
              transform: translateX(-100%);
            }
          }

          @media (max-width: 1024px) {
            .text-item {
              font-size: 5rem;
              padding: 0 3rem;
            }
          }

          @media (max-width: 768px) {
            .text-item {
              font-size: 3rem;
              padding: 0 2rem;
            }
          }

          @media (max-width: 480px) {
            .text-item {
              font-size: 2rem;
              padding: 0 1.5rem;
            }
          }
        `}} />
      </section>

      {/* CEO Message Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 text-red-500 mb-3">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold uppercase tracking-wide">CEO Message</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Direct from the CEO: How our services have helped travelers explore the world
              </h2>
            </div>

            {/* Video Frame */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl mb-6">
              <div className="aspect-video bg-black relative">
                {/* Actual CEO Video */}
                <video 
                  controls
                  className="w-full h-full object-cover"
                >
                  <source src="/CEO.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>

            {/* Description */}
            <div className="text-center">
              <p className="text-gray-700 text-lg leading-relaxed max-w-3xl mx-auto">
                "I'm passionate about connecting travelers to help them create unforgettable memories and experiences, 
                but <span className="font-semibold text-teal-600">travel</span> is the ever-changing landscape we navigate."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Promotional Banner Section */}
      <section className="py-20 bg-gradient-to-r from-teal-500 via-teal-600 to-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="text-white">
              <h2 className="text-5xl md:text-6xl font-bold mb-6">
                DISCOVER
                <span className="block text-3xl md:text-4xl mt-2 text-teal-100">YOUR NEXT ADVENTURE</span>
              </h2>
              <p className="text-xl mb-8 text-teal-50 leading-relaxed">
                Experience the world like never before. Book now and start your journey to discover amazing destinations and create unforgettable memories.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/packages"
                  className="bg-white text-teal-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-teal-50 transition-colors duration-200 shadow-xl hover:shadow-2xl inline-flex items-center"
                >
                  EXPLORE TOURS
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link
                  to="/contact"
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/10 transition-colors duration-200 backdrop-blur-sm"
                >
                  Learn More
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="/images/PXL_20241111_192620770.RAW-01.COVER.jpg" 
                  alt="Discover adventure" 
                  className="w-full h-auto"
                />
                <div className="absolute top-6 right-6 bg-yellow-400 text-gray-900 px-6 py-3 rounded-full font-bold text-xl shadow-lg transform rotate-12">
                  ADVENTURE
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
