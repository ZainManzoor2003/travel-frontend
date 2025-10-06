import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import BlogCard from '../components/BlogCard';
import SearchBar from '../components/SearchBar';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

type BackendBlog = {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  category: string;
  featuredImage: string;
  status: string;
  isFeatured: boolean;
  readTime: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
};

type UIBlog = {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  featured: boolean;
};

const BlogPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [allBlogs, setAllBlogs] = useState<UIBlog[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<UIBlog[]>([]);
  const [categories, setCategories] = useState<{ value: string; label: string }[]>([
    { value: 'all', label: 'All Posts' }
  ]);
  const [sortBy, setSortBy] = useState('recent');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const sectionRefs = {
    hero: useRef<HTMLDivElement>(null),
    posts: useRef<HTMLDivElement>(null),
  };

  const blogGridRef = useRef<HTMLDivElement>(null);

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

  // Fetch blogs and categories from backend
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || 'https://travel-backend-psi.vercel.app';
        
        // Fetch blogs
        const blogsRes = await fetch(`${API_BASE}/blogs?status=published`);
        if (!blogsRes.ok) throw new Error(`Failed to load blogs (${blogsRes.status})`);
        const blogsJson = await blogsRes.json();
        const blogsList: BackendBlog[] = blogsJson?.data?.blogs || [];
        
        // Fetch categories
        const categoriesRes = await fetch(`${API_BASE}/blogs/categories`);
        if (!categoriesRes.ok) throw new Error(`Failed to load categories (${categoriesRes.status})`);
        const categoriesJson = await categoriesRes.json();
        const categoriesList: string[] = categoriesJson?.data || [];

        // Transform blogs to UI format
        const uiBlogs: UIBlog[] = blogsList.map(blog => ({
          id: blog._id,
          title: blog.title,
          excerpt: blog.excerpt,
          image: blog.featuredImage,
          author: blog.author,
          date: new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          readTime: blog.readTime || '5 min read',
          category: blog.category,
          featured: blog.isFeatured
        }));

        setAllBlogs(uiBlogs);
        setFilteredPosts(uiBlogs);

        // Build categories dynamically
        const uniqueCategories = Array.from(new Set(categoriesList)).filter(Boolean);
        setCategories([
          { value: 'all', label: 'All Posts' },
          ...uniqueCategories.map(cat => ({ 
            value: cat.toLowerCase(), 
            label: cat.charAt(0).toUpperCase() + cat.slice(1) 
          }))
        ]);
      } catch (e: any) {
        setError(e?.message || 'Failed to load blogs');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Enhanced animation for blog cards with ScrollTrigger
  useEffect(() => {
    if (blogGridRef.current) {
      const cards = blogGridRef.current.querySelectorAll('.blog-item');
      
      // Clear any previous animations
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.id === 'blog-cards') {
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
          // For small screens (1 column), alternate up and down
          animationProps = index % 2 === 0 ? { x: 0, y: -60 } : { x: 0, y: 60 };
        }

        // Set initial state
        gsap.set(card, {
          ...animationProps,
          opacity: 0,
          scale: 0.85,
          rotationY: index % 2 === 0 ? -12 : 12,
        });

        // Create ScrollTrigger animation
        ScrollTrigger.create({
          id: 'blog-cards',
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
              ease: "back.out(1.4)",
            });
          }
        });
      });
    }

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.id === 'blog-cards') {
          trigger.kill();
        }
      });
    };
  }, [filteredPosts]);

  useEffect(() => {
    let filtered = allBlogs;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(post => post.category?.toLowerCase() === selectedFilter.toLowerCase());
    }

    // Sort posts
    switch (sortBy) {
      case 'oldest':
        filtered = filtered.slice().reverse();
        break;
      case 'read-time-short':
        filtered = filtered.sort((a, b) => parseInt(a.readTime) - parseInt(b.readTime));
        break;
      case 'read-time-long':
        filtered = filtered.sort((a, b) => parseInt(b.readTime) - parseInt(a.readTime));
        break;
      case 'alphabetical':
        filtered = filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        // Keep original order for 'recent'
        break;
    }

    setFilteredPosts(filtered);
  }, [searchQuery, selectedFilter, sortBy, allBlogs]);

  // Categories are now loaded dynamically from backend

  const sortOptions = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'read-time-short', label: 'Quick Reads' },
    { value: 'read-time-long', label: 'Long Reads' },
    { value: 'alphabetical', label: 'Alphabetical' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section id="yy"
        ref={sectionRefs.hero}
        className="relative pt-32 pb-16 text-white"
        style={{ backgroundColor: '#3f7670' }}
      >
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="animate-on-scroll text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-white">
              Travel Blog
            </h1>
            <p className="animate-on-scroll text-lg sm:text-xl lg:text-2xl text-white max-w-3xl mx-auto leading-relaxed">
              Stories, tips, and insights from our travel experts to inspire your next adventure
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
                placeholder="Search articles, topics, or authors..."
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
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3f7670] focus:border-[#3f7670] text-sm bg-white shadow-sm min-w-[160px]"
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

      {/* Blog Posts Grid */}
      <section ref={sectionRefs.posts} className="py-20 bg-white">
        <div className="max-w-7xl lg:max-w-[85%] lg:max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-blue-500 mx-auto mb-4 animate-spin" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              <p className="text-gray-600">Loading articles...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Unable to load articles</h3>
              <p className="text-gray-600">{error}</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 6.291A7.962 7.962 0 0012 5c-2.34 0-4.29 1.009-5.824 2.709" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <>
              <div className="text-center mb-16">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  {searchQuery ? `Search Results (${filteredPosts.length})` : 'Latest Articles'}
                </h2>
                {searchQuery && (
                  <p className="text-gray-600 text-lg">Showing results for "{searchQuery}"</p>
                )}
              </div>
              
              {/* Enhanced Responsive Grid - Full width on small screens */}
              <div 
                ref={blogGridRef}
                className="flex flex-wrap justify-center gap-3"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 400px))',
                  justifyContent: 'center',
                  alignItems: 'stretch'
                }}
              >
                {filteredPosts.map((post, index) => (
                  <div 
                    key={post.id} 
                    className="blog-item w-full"
                    style={{ 
                      perspective: '1000px',
                      transformStyle: 'preserve-3d',
                      width: '100%',
                      maxWidth: '400px',
                      minWidth: '300px'
                    }}
                  >
                    <BlogCard {...post} />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

    </div>
  );
};

export default BlogPage;