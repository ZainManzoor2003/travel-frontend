import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import GalleryItem from '../components/GalleryItem';
import Modal from '../components/Modal';
import CountUp from 'react-countup';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

type BackendGalleryItem = {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  tags: string[];
  featured: boolean;
  status: string;
  uploadedBy: string;
  alt: string;
  createdAt: string;
  updatedAt: string;
};

type UIGalleryItem = {
  id: string;
  src: string;
  alt: string;
  title: string;
  category: string;
  aspect: 'wide' | 'tall' | 'square';
};

const GalleryPage = () => {
  const [selectedImage, setSelectedImage] = useState<{src: string, alt: string} | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isStatsVisible, setIsStatsVisible] = useState(false);
  const [allGalleryItems, setAllGalleryItems] = useState<UIGalleryItem[]>([]);
  const [filteredImages, setFilteredImages] = useState<UIGalleryItem[]>([]);
  const [categories, setCategories] = useState<{ value: string; label: string }[]>([
    { value: 'all', label: 'All' }
  ]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalPhotos: 0,
    totalDestinations: 0,
    happyTravelers: 0,
    averageRating: 0
  });
  
  const sectionRefs = {
    hero: useRef<HTMLDivElement>(null),
    gallery: useRef<HTMLDivElement>(null),
    stats: useRef<HTMLDivElement>(null),
  };

  useEffect(() => {
    // Simplified hero animation for better performance
    if (sectionRefs.hero.current) {
      gsap.fromTo(
        sectionRefs.hero.current.querySelectorAll('.animate-on-scroll'),
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out" }
      );
    }

    // Simplified gallery animation for better performance
    if (sectionRefs.gallery.current) {
      const items = sectionRefs.gallery.current.querySelectorAll('.gallery-item');
      
      items.forEach((item, index) => {
        gsap.set(item, {
          opacity: 0,
          y: 20
        });

        ScrollTrigger.create({
          trigger: item,
          start: "top 90%",
          end: "bottom 10%",
          once: true,
          onEnter: () => {
            gsap.to(item, {
              opacity: 1,
              y: 0,
              duration: 0.6,
              delay: index * 0.02,
              ease: "power2.out"
            });
          }
        });
      });
    }

    // Simplified stats animation for better performance
    if (sectionRefs.stats.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsStatsVisible(true);
              gsap.fromTo(
                entry.target.querySelectorAll('.stat-item'),
                { y: 10, opacity: 0 },
                { 
                  y: 0, 
                  opacity: 1, 
                  duration: 0.5, 
                  stagger: 0.1, 
                  ease: "power2.out" 
                }
              );
            }
          });
        },
        { threshold: 0.5 }
      );
      observer.observe(sectionRefs.stats.current);
    }
  }, [activeFilter]);

  // Fetch gallery items and categories from backend
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || 'https://travel-backend-psi.vercel.app';
        
        // Fetch gallery items
        const galleryRes = await fetch(`${API_BASE}/gallery?status=active`);
        if (!galleryRes.ok) throw new Error(`Failed to load gallery (${galleryRes.status})`);
        const galleryJson = await galleryRes.json();
        const galleryList: BackendGalleryItem[] = galleryJson?.data?.galleryItems || [];
        
        // Fetch categories
        const categoriesRes = await fetch(`${API_BASE}/gallery/categories`);
        if (!categoriesRes.ok) throw new Error(`Failed to load categories (${categoriesRes.status})`);
        const categoriesJson = await categoriesRes.json();
        const categoriesList: string[] = categoriesJson?.data || [];

        // Transform gallery items to UI format
        const uiGalleryItems: UIGalleryItem[] = galleryList.map((item, index) => ({
          id: item._id,
          src: item.imageUrl,
          alt: item.alt || item.title,
          title: item.title,
          category: item.category,
          aspect: index % 3 === 0 ? 'wide' : index % 3 === 1 ? 'tall' : 'square'
        }));

        setAllGalleryItems(uiGalleryItems);
        setFilteredImages(uiGalleryItems);

        // Build categories dynamically
        const uniqueCategories = Array.from(new Set(categoriesList)).filter(Boolean);
        setCategories([
          { value: 'all', label: 'All' },
          ...uniqueCategories.map(cat => ({ 
            value: cat.toLowerCase(), 
            label: cat.charAt(0).toUpperCase() + cat.slice(1) 
          }))
        ]);
      } catch (e: any) {
        setError(e?.message || 'Failed to load gallery');
      } finally {
        setLoading(false);
      }
    };

    const fetchStats = async () => {
      try {
        const response = await fetch(`${API_BASE}/gallery/stats`);
        const data = await response.json();
        if (data.success) {
          setStats(data.stats);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    load();
    fetchStats();
  }, []);

  // Filter images based on active filter
  useEffect(() => {
    const filtered = activeFilter === 'all' 
      ? allGalleryItems 
      : allGalleryItems.filter(item => item.category.toLowerCase() === activeFilter.toLowerCase());
    setFilteredImages(filtered);
  }, [activeFilter, allGalleryItems]);

  const handleImageClick = (src: string, alt: string) => {
    setSelectedImage({ src, alt });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  // Handle keyboard events for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  // Gallery data is now loaded dynamically from backend

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section id="yy"
        ref={sectionRefs.hero}
        className="relative pt-40 pb-16 bg-[#3e7670] text-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="animate-on-scroll text-5xl md:text-6xl font-bold mb-6">
              Travel Gallery
            </h1>
            <p className="animate-on-scroll text-xl md:text-2xl text-[#3f7670] max-w-3xl mx-auto">
              Immerse yourself in the beauty of our destinations through stunning photography
            </p>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-12 bg-gray-50 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setActiveFilter(category.value)}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                  activeFilter === category.value
                    ? 'bg-[#3f7670] text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-[#3f7670]/10 hover:text-[#3f7670] shadow-sm'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section with Bento Grid */}
      <section ref={sectionRefs.gallery} className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Explore Our Destinations</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Each image tells a story of adventure, discovery, and unforgettable moments
            </p>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-blue-500 mx-auto mb-4 animate-spin" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              <p className="text-gray-600">Loading gallery...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Unable to load gallery</h3>
              <p className="text-gray-600">{error}</p>
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No images found</h3>
              <p className="text-gray-600">Try selecting a different category</p>
            </div>
          ) : (
            /* Bento Grid Layout */
            <div className="bento-grid">
              {filteredImages.map((image) => (
                <div 
                  key={image.id} 
                  className={`gallery-item ${image.aspect === 'wide' ? 'bento-wide' : image.aspect === 'tall' ? 'bento-tall' : 'bento-square'}`}
                >
                  <GalleryItem
                    {...image}
                    onImageClick={handleImageClick}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section ref={sectionRefs.stats} className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Our Gallery in Numbers</h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Capturing moments and memories from around the world
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 md:gap-12 lg:gap-16 text-center">
            <div className="stat-item flex-1 min-w-[120px] max-w-[160px] sm:max-w-none">
              <div className="text-3xl md:text-4xl font-bold mb-2 text-[#3f7670]">
                {isStatsVisible && <CountUp end={stats.totalPhotos} duration={2} suffix="+" />}
              </div>
              <div className="text-gray-600 text-sm">Stunning Photos</div>
            </div>
            <div className="stat-item flex-1 min-w-[120px] max-w-[160px] sm:max-w-none">
              <div className="text-3xl md:text-4xl font-bold mb-2 text-[#3f7670]">
                {isStatsVisible && <CountUp end={stats.totalDestinations} duration={2} suffix="+" />}
              </div>
              <div className="text-gray-600 text-sm">Destinations</div>
            </div>
            <div className="stat-item flex-1 min-w-[120px] max-w-[160px] sm:max-w-none">
              <div className="text-3xl md:text-4xl font-bold mb-2 text-[#3f7670]">
                {isStatsVisible && <CountUp end={stats.happyTravelers} duration={2} suffix="+" />}
              </div>
              <div className="text-gray-600 text-sm">Happy Travelers</div>
            </div>
            <div className="stat-item flex-1 min-w-[120px] max-w-[160px] sm:max-w-none">
              <div className="text-3xl md:text-4xl font-bold mb-2 text-[#3f7670]">
                {isStatsVisible && <CountUp end={stats.averageRating} duration={2} decimals={1} />}
              </div>
              <div className="text-gray-600 text-sm">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Lightbox Modal */}
      {isModalOpen && selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div 
            className="relative w-full h-full max-w-7xl max-h-[95vh] p-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-6 right-6 z-10 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Image container */}
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              />
            </div>

            {/* Image info overlay */}
            <div className="absolute bottom-6 left-6 right-6 bg-black/60 backdrop-blur-md rounded-xl p-6 text-white">
              <h3 className="text-2xl font-bold mb-2">{selectedImage.alt}</h3>
              <p className="text-gray-200 text-lg opacity-90">
                Click outside or press ESC to close
              </p>
            </div>

            {/* Navigation hints */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-6 transform -translate-y-1/2 opacity-30 hover:opacity-60 transition-opacity duration-300">
                <div className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </div>
              </div>
              <div className="absolute top-1/2 right-6 transform -translate-y-1/2 opacity-30 hover:opacity-60 transition-opacity duration-300">
                <div className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .bento-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          grid-auto-rows: 250px;
          grid-gap: 1rem;
          grid-auto-flow: dense;
        }
        
        .bento-wide {
          grid-column: span 2;
        }
        
        .bento-tall {
          grid-row: span 2;
        }
        
        .bento-square {
          /* Default is 1x1 */
        }
        
        @media (max-width: 640px) {
          .bento-grid {
            grid-template-columns: 1fr;
          }
          
          .bento-wide,
          .bento-tall {
            grid-column: span 1;
            grid-row: span 1;
          }
        }
      `}</style>
    </div>
  );
};

export default GalleryPage;