import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TourCard from '../components/TourCard';
import SearchBar from '../components/SearchBar';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

type BackendTour = {
  _id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  location: string;
  category: string;
  rating: number;
  image: string;
};

type UITour = {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  image: string;
  rating: number;
  location: string;
  category: string;
};

const PackagesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [allTours, setAllTours] = useState<UITour[]>([]);
  const [filteredTours, setFilteredTours] = useState<UITour[]>([]);
  const [categories, setCategories] = useState<{ value: string; label: string }[]>([
    { value: 'all', label: 'All Tours' }
  ]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('popular');
  
  const sectionRefs = {
    hero: useRef<HTMLDivElement>(null),
    tours: useRef<HTMLDivElement>(null),
  };

  const tourGridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Hero animation
    if (sectionRefs.hero.current) {
      gsap.fromTo(
        sectionRefs.hero.current.querySelectorAll('.animate-on-scroll'),
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.3, ease: "power3.out" }
      );
    }
  }, []);

  // Fetch tours from backend
  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || 'https://travel-backend-psi.vercel.app';
        const res = await fetch(`${API_BASE}/tours`, { signal: controller.signal });
        if (!res.ok) throw new Error(`Failed to load tours (${res.status})`);
        const json = await res.json();
        const list: BackendTour[] = json?.data?.tours || [];
        const uiTours: UITour[] = list.map(t => ({
          id: t._id,
          title: t.title,
          description: t.description,
          price: t.price,
          duration: String(t.duration),
          image: t.image,
          rating: Number(t.rating || 0),
          location: t.location,
          category: t.category,
        }));
        setAllTours(uiTours);
        setFilteredTours(uiTours);
        const unique = Array.from(new Set(uiTours.map(t => t.category))).filter(Boolean);
        setCategories([
          { value: 'all', label: 'All Tours' },
          ...unique.map(c => ({ value: c, label: c.charAt(0).toUpperCase() + c.slice(1) }))
        ]);
      } catch (e: any) {
        if (e?.name === 'AbortError') return;
        setError(e?.message || 'Failed to load tours');
      } finally {
        setLoading(false);
      }
    };
    load();
    return () => controller.abort();
  }, []);

  // Enhanced animation for tour cards with ScrollTrigger
  useEffect(() => {
    if (tourGridRef.current) {
      const cards = tourGridRef.current.querySelectorAll('.tour-item');
      
      // Clear any previous animations
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.id === 'tour-cards') {
          trigger.kill();
        }
      });

      cards.forEach((card, index) => {
        // Determine animation direction based on screen size and index
        let animationProps;
        const screenWidth = window.innerWidth;
        
        if (screenWidth >= 1024) { // lg screens and up - 4 columns
          const directions = ['left', 'bottom', 'right', 'top'];
          const direction = directions[index % 4];
          
          switch (direction) {
            case 'left':
              animationProps = { x: -100, y: 0 };
              break;
            case 'right':
              animationProps = { x: 100, y: 0 };
              break;
            case 'top':
              animationProps = { x: 0, y: -100 };
              break;
            case 'bottom':
              animationProps = { x: 0, y: 100 };
              break;
            default:
              animationProps = { x: -100, y: 0 };
          }
        } else if (screenWidth >= 768) { // md screens - 3 columns
          const directions = ['left', 'bottom', 'right'];
          const direction = directions[index % 3];
          
          switch (direction) {
            case 'left':
              animationProps = { x: -80, y: 0 };
              break;
            case 'right':
              animationProps = { x: 80, y: 0 };
              break;
            case 'bottom':
              animationProps = { x: 0, y: 80 };
              break;
            default:
              animationProps = { x: -80, y: 0 };
          }
        } else {
          // For small screens (2 columns), alternate left and right
          animationProps = index % 2 === 0 ? { x: -60, y: 0 } : { x: 60, y: 0 };
        }

        // Set initial state
        gsap.set(card, {
          ...animationProps,
          opacity: 0,
          scale: 0.8,
          rotationY: index % 2 === 0 ? -15 : 15,
        });

        // Create ScrollTrigger animation
        ScrollTrigger.create({
          id: 'tour-cards',
          trigger: card,
          start: 'top 85%',
          end: 'bottom 15%',
          once: true,
          onEnter: () => {
            gsap.to(card, {
              x: 0,
              y: 0,
              opacity: 1,
              scale: 1,
              rotationY: 0,
              duration: 0.8,
              delay: index * 0.1,
              ease: "back.out(1.7)",
            });
          }
        });
      });
    }

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.id === 'tour-cards') {
          trigger.kill();
        }
      });
    };
  }, [filteredTours]);

  useEffect(() => {
    let filtered = allTours;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(tour =>
        tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tour.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tour.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(tour => tour.category === selectedFilter);
    }

    // Sort tours
    switch (sortBy) {
      case 'price-low':
        filtered = filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered = filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered = filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'duration':
        filtered = filtered.sort((a, b) => parseInt(a.duration) - parseInt(b.duration));
        break;
      default:
        // Keep original order for 'popular'
        break;
    }

    setFilteredTours(filtered);
  }, [searchQuery, selectedFilter, sortBy, allTours]);

  const sortOptions = [
    { value: 'popular', label: 'Most Popular' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'duration', label: 'Shortest Duration' }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#ffe020' }}>
      {/* Hero Section */}
      <section 
        ref={sectionRefs.hero}
        className="relative pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-14 lg:pb-16 overflow-hidden"
        style={{ backgroundColor: '#00c3a1' }}
      >
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center">
            {/* Hero Image */}
            <div className="animate-on-scroll mb-8 sm:mb-10 lg:mb-12">
              <img 
                src="/Logo.webp"
                alt="Travel Packages"
                className="mt-2 h-32 sm:mt-3 sm:h-40 lg:mt-4 lg:h-48 w-auto"
              />
            </div>
            
            {/* Hero Text Below Image */}
            <div className="text-center text-white">
              <h1 className="animate-on-scroll text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
                Travel Beyond Tours
              </h1>
              <p className="animate-on-scroll text-base sm:text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto leading-relaxed px-4">
                Discover our carefully curated selection of travel experiences around the world
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 sm:py-10 lg:py-12" style={{ backgroundColor: '#ffe020' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4 sm:space-y-6">
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <SearchBar
                onSearch={setSearchQuery}
                placeholder="Search destinations, activities, or tours..."
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 justify-between items-center">
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2 sm:gap-3 justify-center lg:justify-start w-full lg:w-auto">
                {categories.map((category) => (
                  <button
                    key={category.value}
                    onClick={() => setSelectedFilter(category.value)}
                    className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 transform hover:scale-105 whitespace-nowrap ${
                      selectedFilter === category.value
                        ? 'bg-[#00c3a1] text-white shadow-lg shadow-secondary-200'
                        : 'bg-white text-black hover:bg-secondary-50 hover:text-[#00c3a1] shadow-sm'
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>

              {/* Sort Dropdown */}
              <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full lg:w-auto">
                <label htmlFor="sort" className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">
                  Sort by:
                </label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00c3a1] focus:border-[#00c3a1] text-xs sm:text-sm bg-white shadow-sm w-full sm:min-w-[160px] lg:min-w-[180px]"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tours Grid */}
      <section ref={sectionRefs.tours} className="py-12 sm:py-16 lg:py-20" style={{ backgroundColor: '#ffe020' }}>
        <div className="max-w-7xl lg:max-w-[85%] lg:max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12 sm:py-16">
              <svg className="w-12 h-12 sm:w-16 sm:h-16 text-[#00c3a1] mx-auto mb-4 animate-spin" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              <p className="text-gray-600 text-sm sm:text-base">Loading tours...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 sm:py-16 px-4">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Unable to load tours</h3>
              <p className="text-gray-600 text-sm sm:text-base">{error}</p>
            </div>
          ) : filteredTours.length === 0 ? (
            <div className="text-center py-12 sm:py-16 px-4">
              <svg className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 6.291A7.962 7.962 0 0012 5c-2.34 0-4.29 1.009-5.824 2.709" />
              </svg>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No tours found</h3>
              <p className="text-gray-600 text-sm sm:text-base">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <>
              <div className="text-center mb-12 sm:mb-14 lg:mb-16">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 px-4">
                  {searchQuery ? `Search Results (${filteredTours.length})` : 'Available Tours'}
                </h2>
                {searchQuery && (
                  <p className="text-gray-600 text-base sm:text-lg px-4">Showing results for "{searchQuery}"</p>
                )}
              </div>
              
              {/* Enhanced Responsive Flex Column Layout */}
              <div 
                ref={tourGridRef}
                className="flex flex-col gap-6 sm:gap-8 max-w-4xl mx-auto"
              >
                {filteredTours.map((tour, index) => (
                  <div 
                    key={tour.id} 
                    className="tour-item w-full"
                    style={{ 
                      perspective: '1000px',
                      transformStyle: 'preserve-3d'
                    }}
                  >
                    <TourCard {...tour} />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-18 lg:py-20" style={{ backgroundColor: '#00c3a1' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6">Can't Find What You're Looking For?</h2>
          <p className="text-lg sm:text-xl text-white mb-6 sm:mb-8 leading-relaxed px-4">
            We can create a custom travel package tailored to your specific needs and preferences
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md sm:max-w-none mx-auto">
            <a
              href="/contact"
              className="bg-white text-[#00c3a1] px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg text-center"
            >
              Contact Us
            </a>
            <a
              href="/about"
              className="border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-white hover:text-[#00c3a1] transition-all duration-300 transform hover:scale-105 text-center"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PackagesPage;