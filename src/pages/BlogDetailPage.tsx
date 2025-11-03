import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  FiArrowLeft, 
  FiUser, 
  FiCalendar, 
  FiClock, 
  FiTag, 
  FiEye,
  FiMenu
} from 'react-icons/fi';
import LoadingSpinner from '../components/LoadingSpinner';
import Menu from '../components/homepage/Menu';
import { useLanguage } from '../contexts/LanguageContext';
import { API_BASE } from '../config/api';

gsap.registerPlugin(ScrollTrigger);

interface Blog {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  category: string;
  tags: string[];
  featuredImage: string;
  status: string;
  isFeatured: boolean;
  readTime: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
}

const BlogDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const controller = new AbortController();
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE}/blogs/${id}?lang=${language}`, { signal: controller.signal });
        
        if (!response.ok) {
          throw new Error('Blog not found');
        }

        const data = await response.json();
        setBlog(data.data);

        // Fetch related blogs
        if (data.data.category) {
          const relatedResponse = await fetch(`${API_BASE}/blogs?category=${data.data.category}&lang=${language}&limit=3`, { signal: controller.signal });
          if (relatedResponse.ok) {
            const relatedData = await relatedResponse.json();
            const filtered = relatedData.data.blogs.filter((b: Blog) => b._id !== id).slice(0, 3);
            setRelatedBlogs(filtered);
          }
        }
      } catch (err: any) {
        if (err?.name === 'AbortError') return;
        setError(err instanceof Error ? err.message : 'Failed to load blog');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBlog();
    }
    return () => controller.abort();
  }, [id, language]);

  useEffect(() => {
    if (!loading && blog) {
      // Hero animation
      if (heroRef.current) {
        gsap.fromTo(
          heroRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
        );
      }

      // Content animation
      if (contentRef.current) {
        gsap.fromTo(
          contentRef.current.querySelectorAll('.animate-content'),
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: contentRef.current,
              start: 'top 80%',
            },
          }
        );
      }

      // Sidebar animation
      if (sidebarRef.current) {
        gsap.fromTo(
          sidebarRef.current,
          { opacity: 0, x: 30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sidebarRef.current,
              start: 'top 80%',
            },
          }
        );
      }
    }
  }, [loading, blog]);

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

  // Show loader while loading OR if no blog data yet
  if (loading || !blog) {
    return <LoadingSpinner />;
  }

  // Only redirect if there's an actual error after loading is complete
  if (error) {
    navigate('/blog');
    return null;
  }

  const formattedDate = new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="w-full font-sans bg-[#f8f8f8] min-h-screen">
      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 z-[1000] p-8 px-12 flex items-center justify-between bg-transparent">
        <div className="flex items-center gap-6">
          <button className="flex items-center gap-3 bg-none border-none text-white font-sans text-sm font-normal tracking-wider cursor-pointer transition-opacity duration-300 hover:opacity-80" onClick={toggleMenu}>
            <span className="flex flex-col gap-[3px]">
              <span className="w-[18px] h-[2px] bg-white transition-all duration-300"></span>
              <span className="w-[18px] h-[2px] bg-white transition-all duration-300"></span>
              <span className="w-[18px] h-[2px] bg-white transition-all duration-300"></span>
            </span>
            MENU
          </button>
          <div className="w-px h-5 bg-white/30"></div>
        </div>
        
        <div className="absolute left-1/2 -translate-x-1/2">
          <img 
            src="https://res.cloudinary.com/dfoetpdk9/image/upload/v1761734208/bokihocgfonmikokouz6.jpg"
            alt="Travel Beyond Logo"
            className="h-24 w-56"
          />
        </div>
        
        <div className="flex items-center">
          <button 
            onClick={() => navigate('/blog')}
            className="bg-white/10 border border-white/30 text-white font-sans text-sm font-normal tracking-wider py-3 px-6 cursor-pointer transition-all duration-300 backdrop-blur-[10px] hover:bg-white/20 hover:border-white/50"
          >
            BACK TO BLOG
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden">
          <img
            src={blog.featuredImage}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/20 via-black/40 to-black/30 z-[1]"></div>
        </div>
        
        <div className="relative z-[2] text-center p-8 max-w-6xl mx-auto">
          {/* Category Badge */}
          <div className="mb-6">
            <span className="inline-block bg-white/20 border border-white/30 text-white px-6 py-2 rounded-full text-sm font-medium backdrop-blur-[10px]">
              {blog.category}
            </span>
            {blog.isFeatured && (
              <span className="inline-block ml-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-full text-sm font-medium">
                Featured
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="font-['Playfair_Display'] text-[clamp(2.5rem,6vw,4.5rem)] font-normal text-white tracking-tight leading-[1.1] shadow-[0_2px_20px_rgba(0,0,0,0.3)] mb-8">
            {blog.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-white/90 font-['Inter'] text-sm">
            <div className="flex items-center gap-2">
              <FiUser className="w-4 h-4" />
              <span>{blog.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <FiCalendar className="w-4 h-4" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <FiClock className="w-4 h-4" />
              <span>{blog.readTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <FiEye className="w-4 h-4" />
              <span>{blog.viewCount} views</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="w-full bg-[#f8f8f8] py-16">
        <div className="max-w-[1400px] mx-auto px-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Article Content */}
            <div ref={contentRef} className="lg:col-span-2">
              {/* Excerpt */}
              <div className="bg-white border-l-4 border-[#2c2c2c] p-8 mb-12 rounded-r-lg shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
                <p className="font-['Inter'] text-xl font-normal text-[#555] italic leading-[1.6] tracking-[0.01em]">
                  {blog.excerpt}
                </p>
              </div>

              {/* Main Content */}
              <div className="prose prose-lg max-w-none">
                <div 
                  className="font-['Inter'] text-[#555] leading-[1.6] tracking-[0.01em] space-y-6"
                  dangerouslySetInnerHTML={{ 
                    __html: blog.content.replace(/\n/g, '<br/>') 
                  }}
                />
              </div>

              {/* Tags */}
              {blog.tags && blog.tags.length > 0 && (
                <div className="mt-16 pt-8 border-t border-[#e0e0e0]">
                  <div className="flex items-center flex-wrap gap-3">
                    <FiTag className="text-[#666] w-5 h-5" />
                    {blog.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-white text-[#666] rounded-full text-sm hover:bg-[#f5f5f5] transition-colors cursor-pointer font-['Inter']"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div ref={sidebarRef} className="lg:col-span-1">
              <div className="sticky top-24 space-y-8">
                {/* Author Card */}
                <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-8 border border-[#f0f0f0]">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-[#f5f5f5] rounded-full flex items-center justify-center">
                      <FiUser className="text-[#666] text-2xl" />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-['Inter'] text-lg font-semibold text-[#2c2c2c]">{blog.author}</h3>
                      <p className="font-['Inter'] text-sm text-[#666]">Author</p>
                    </div>
                  </div>
                  <p className="font-['Inter'] text-[#555] text-sm leading-[1.6]">
                    Passionate traveler and storyteller sharing experiences from around the world.
                  </p>
                </div>

                {/* Related Posts */}
                {relatedBlogs.length > 0 && (
                  <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-8 border border-[#f0f0f0]">
                    <h3 className="font-['Playfair_Display'] text-xl font-normal text-[#2c2c2c] tracking-tight mb-6">Related Articles</h3>
                    <div className="space-y-6">
                      {relatedBlogs.map((relatedBlog) => (
                        <Link
                          key={relatedBlog._id}
                          to={`/blog/${relatedBlog._id}`}
                          className="block group"
                        >
                          <div className="flex gap-4">
                            <img
                              src={relatedBlog.featuredImage}
                              alt={relatedBlog.title}
                              className="w-24 h-24 object-cover rounded-lg group-hover:opacity-75 transition-opacity"
                            />
                            <div className="flex-1">
                              <h4 className="font-['Inter'] font-semibold text-[#2c2c2c] group-hover:text-[#666] transition-colors line-clamp-2 mb-2">
                                {relatedBlog.title}
                              </h4>
                              <p className="font-['Inter'] text-sm text-[#666] flex items-center">
                                <FiClock className="mr-1 w-4 h-4" />
                                {relatedBlog.readTime}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Categories */}
                <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-8 border border-[#f0f0f0]">
                  <h3 className="font-['Playfair_Display'] text-xl font-normal text-[#2c2c2c] tracking-tight mb-4">Category</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-4 py-2 bg-[#f5f5f5] text-[#2c2c2c] rounded-full text-sm font-medium font-['Inter']">
                      {blog.category}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Component */}
      <Menu isOpen={isMenuOpen} onClose={closeMenu} />
    </div>
  );
};

export default BlogDetailPage; 