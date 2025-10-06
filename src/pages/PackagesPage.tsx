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
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || 'https://travel-backend-psi.vercel.app';
        const res = await fetch(`${API_BASE}/tours`);
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
        setError(e?.message || 'Failed to load tours');
      } finally {
        setLoading(false);
      }
    };
    load();
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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        ref={sectionRefs.hero}
        className="relative pt-32 pb-16 text-white overflow-hidden"
        style={{ backgroundColor: '#3f7670' }}
      >
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="animate-on-scroll text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-white">
              Travel Packages
            </h1>
            <p className="animate-on-scroll text-lg sm:text-xl lg:text-2xl text-white max-w-3xl mx-auto leading-relaxed">
              Discover our carefully curated selection of travel experiences around the world
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <SearchBar
                onSearch={setSearchQuery}
                placeholder="Search destinations, activities, or tours..."
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col lg:flex-row gap-6 justify-between items-center">
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                {categories.map((category) => (
                  <button
                    key={category.value}
                    onClick={() => setSelectedFilter(category.value)}
                    className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                      selectedFilter === category.value
                        ? 'bg-[#3f7670] text-white shadow-lg shadow-teal-200'
                        : 'bg-white text-gray-700 hover:bg-teal-50 hover:text-[#3f7670] shadow-sm'
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center space-x-3">
                <label htmlFor="sort" className="text-sm font-medium text-gray-700 whitespace-nowrap">
                  Sort by:
                </label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3f7670] focus:border-[#3f7670] text-sm bg-white shadow-sm min-w-[180px]"
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
      <section ref={sectionRefs.tours} className="py-20 bg-white">
        <div className="max-w-7xl lg:max-w-[85%] lg:max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-[#3f7670] mx-auto mb-4 animate-spin" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              <p className="text-gray-600">Loading tours...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Unable to load tours</h3>
              <p className="text-gray-600">{error}</p>
            </div>
          ) : filteredTours.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 6.291A7.962 7.962 0 0012 5c-2.34 0-4.29 1.009-5.824 2.709" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No tours found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <>
              <div className="text-center mb-16">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  {searchQuery ? `Search Results (${filteredTours.length})` : 'Available Tours'}
                </h2>
                {searchQuery && (
                  <p className="text-gray-600 text-lg">Showing results for "{searchQuery}"</p>
                )}
              </div>
              
              {/* Enhanced Responsive Grid - Fixed Layout */}
              <div 
                ref={tourGridRef}
                className="flex flex-wrap justify-center gap-3"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 400px))',
                  justifyContent: 'center',
                  alignItems: 'stretch'
                }}
              >
                {filteredTours.map((tour, index) => (
                  <div 
                    key={tour.id} 
                    className="tour-item"
                    style={{ 
                      perspective: '1000px',
                      transformStyle: 'preserve-3d',
                      width: '100%',
                      maxWidth: '400px',
                      minWidth: '300px'
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
      <section className="py-20" style={{ backgroundColor: '#3f7670' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">Can't Find What You're Looking For?</h2>
          <p className="text-xl text-white mb-8 leading-relaxed">
            We can create a custom travel package tailored to your specific needs and preferences
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-white text-[#3f7670] px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Contact Us
            </a>
            <a
              href="/about"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-[#3f7670] transition-all duration-300 transform hover:scale-105"
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