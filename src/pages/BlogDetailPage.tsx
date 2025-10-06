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
  FiEye
} from 'react-icons/fi';
import LoadingSpinner from '../components/LoadingSpinner';

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
  const [blog, setBlog] = useState<Blog | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || 'https://travel-backend-psi.vercel.app';
        const response = await fetch(`${API_BASE}/blogs/${id}`);
        
        if (!response.ok) {
          throw new Error('Blog not found');
        }

        const data = await response.json();
        setBlog(data.data);

        // Fetch related blogs
        if (data.data.category) {
          const relatedResponse = await fetch(`${API_BASE}/blogs?category=${data.data.category}&limit=3`);
          if (relatedResponse.ok) {
            const relatedData = await relatedResponse.json();
            const filtered = relatedData.data.blogs.filter((b: Blog) => b._id !== id).slice(0, 3);
            setRelatedBlogs(filtered);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load blog');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBlog();
    }
  }, [id]);

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

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The blog you are looking for does not exist.'}</p>
          <button
            onClick={() => navigate('/blog')}
            className="inline-flex items-center px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            <FiArrowLeft className="mr-2" />
            Back to Blog
          </button>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div ref={heroRef} className="relative h-[70vh] min-h-[500px] overflow-hidden bg-black">
        <img
          src={blog.featuredImage}
          alt={blog.title}
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 w-full">
            {/* Back Button */}
            <button
              onClick={() => navigate('/blog')}
              className="inline-flex items-center text-white/90 hover:text-white mb-6 transition-colors group"
            >
              <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Blog
            </button>

            {/* Category Badge */}
            <div className="mb-4">
              <span className="inline-block bg-teal-600 text-white px-4 py-1.5 rounded-full text-sm font-medium">
                {blog.category}
              </span>
              {blog.isFeatured && (
                <span className="inline-block ml-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-1.5 rounded-full text-sm font-medium">
                  Featured
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {blog.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-white/80">
              <div className="flex items-center">
                <FiUser className="mr-2" />
                <span>{blog.author}</span>
              </div>
              <div className="flex items-center">
                <FiCalendar className="mr-2" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center">
                <FiClock className="mr-2" />
                <span>{blog.readTime}</span>
              </div>
              <div className="flex items-center">
                <FiEye className="mr-2" />
                <span>{blog.viewCount} views</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Article Content */}
          <div ref={contentRef} className="lg:col-span-2">
            {/* Excerpt */}
            <div className="animate-content bg-teal-50 border-l-4 border-teal-600 p-6 mb-8 rounded-r-lg">
              <p className="text-lg text-gray-700 italic leading-relaxed">
                {blog.excerpt}
              </p>
            </div>

            {/* Main Content */}
            <div className="animate-content prose prose-lg max-w-none">
              <div 
                className="text-gray-700 leading-relaxed space-y-6"
                dangerouslySetInnerHTML={{ 
                  __html: blog.content.replace(/\n/g, '<br/>') 
                }}
              />
            </div>

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="animate-content mt-12 pt-8 border-t border-gray-200">
                <div className="flex items-center flex-wrap gap-3">
                  <FiTag className="text-gray-400" />
                  {blog.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors cursor-pointer"
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
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center">
                    <FiUser className="text-teal-600 text-2xl" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">{blog.author}</h3>
                    <p className="text-sm text-gray-500">Author</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">
                  Passionate traveler and storyteller sharing experiences from around the world.
                </p>
              </div>

              {/* Related Posts */}
              {relatedBlogs.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Related Articles</h3>
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
                            <h4 className="font-semibold text-gray-900 group-hover:text-teal-600 transition-colors line-clamp-2 mb-2">
                              {relatedBlog.title}
                            </h4>
                            <p className="text-sm text-gray-500 flex items-center">
                              <FiClock className="mr-1" />
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
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Category</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="px-4 py-2 bg-teal-50 text-teal-700 rounded-full text-sm font-medium">
                    {blog.category}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPage; 