import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Swal from 'sweetalert2';
import Modal from '../Modal';
import { FiEdit, FiTrash2, FiEye, FiSearch, FiPlus, FiBook, FiUser, FiCalendar, FiClock, FiUpload, FiX, FiCheckCircle, FiFileText, FiArchive, FiGlobe, FiMapPin, FiInfo, FiUsers, FiActivity, FiCoffee, FiCamera } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import imageCompression from 'browser-image-compression';

interface BlogPost {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  isFeatured: boolean;
  status: 'published' | 'draft' | 'archived';
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  featuredImage: string;
  readTime: string;
  slug: string;
}

const BlogManagement = () => {
  const { token } = useAuth();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingPost, setLoadingPost] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState<Partial<BlogPost>>({});
  const [newTag, setNewTag] = useState('');
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const postsRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);

  // API Base URL
  const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'https://travel-backend-psi.vercel.app';

  // API Functions
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/blogs`);
      const data = await response.json();
      
      if (data.success) {
        setBlogPosts(data.data.blogs);
        setError(null);
      } else {
        setError(data.message || 'Failed to fetch blogs');
      }
    } catch (err) {
      setError('Failed to connect to server');
      console.error('Error fetching blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    if (!token) {
      throw new Error('No authentication token available');
    }

    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_BASE_URL}/upload/image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    const data = await response.json();
    if (data.success) {
      return data.data.imageUrl;
    } else {
      throw new Error(data.message || 'Failed to upload image');
    }
  };

  const createBlog = async (blogData: Partial<BlogPost>) => {
    if (!token) {
      throw new Error('No authentication token available');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/blogs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(blogData)
      });

      const data = await response.json();
      if (data.success) {
        await fetchBlogs(); // Refresh the list
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to create blog');
      }
    } catch (err) {
      console.error('Error creating blog:', err);
      throw err;
    }
  };

  const updateBlog = async (id: string, blogData: Partial<BlogPost>) => {
    if (!token) {
      throw new Error('No authentication token available');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(blogData)
      });

      const data = await response.json();
      if (data.success) {
        await fetchBlogs(); // Refresh the list
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to update blog');
      }
    } catch (err) {
      console.error('Error updating blog:', err);
      throw err;
    }
  };

  const deleteBlog = async (id: string) => {
    if (!token) {
      throw new Error('No authentication token available');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        await fetchBlogs(); // Refresh the list
        return true;
      } else {
        throw new Error(data.message || 'Failed to delete blog');
      }
    } catch (err) {
      console.error('Error deleting blog:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    if (postsRef.current && blogPosts.length > 0) {
      gsap.fromTo(
        postsRef.current.querySelectorAll('.blog-post'),
        { y: 20, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.1, ease: "power3.out" }
      );
    }
  }, [blogPosts]);

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || post.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleEditPost = async (post: BlogPost) => {
    setLoadingPost(true);
    try {
      // Fetch the full blog post data including content
      const response = await fetch(`${API_BASE_URL}/blogs/${post._id}`);
      const data = await response.json();
      
      if (data.success) {
        const fullPost = data.data;
        setSelectedPost(fullPost);
        setFormData(fullPost);
        setIsEditMode(true);
        setIsModalOpen(true);
      } else {
        console.error('Failed to fetch full blog post:', data.message);
        // Fallback to the partial data
        setSelectedPost(post);
        setFormData(post);
        setIsEditMode(true);
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error('Error fetching full blog post:', error);
      // Fallback to the partial data
      setSelectedPost(post);
      setFormData(post);
      setIsEditMode(true);
      setIsModalOpen(true);
    } finally {
      setLoadingPost(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        await deleteBlog(postId);
        Swal.fire({
          title: 'Success!',
          text: 'Blog post deleted successfully',
          icon: 'success',
          timer: 2000
        });
      } catch (error) {
        Swal.fire({
          title: 'Error!',
          text: error instanceof Error ? error.message : 'Failed to delete blog post',
          icon: 'error'
        });
      }
    }
  };

  const handleViewPost = async (post: BlogPost) => {
    setLoadingPost(true);
    try {
      // Fetch the full blog post data including content
      const response = await fetch(`${API_BASE_URL}/blogs/${post._id}`);
      const data = await response.json();
      
      if (data.success) {
        const fullPost = data.data;
        setSelectedPost(fullPost);
        setIsEditMode(false);
        setIsModalOpen(true);
      } else {
        console.error('Failed to fetch full blog post:', data.message);
        // Fallback to the partial data
        setSelectedPost(post);
        setIsEditMode(false);
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error('Error fetching full blog post:', error);
      // Fallback to the partial data
      setSelectedPost(post);
      setIsEditMode(false);
      setIsModalOpen(true);
    } finally {
      setLoadingPost(false);
    }
  };

  const handleAddPost = () => {
    setSelectedPost(null);
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      author: 'Admin',
      category: 'destinations',
      tags: [],
      isFeatured: false,
      status: 'draft',
      readTime: '5 min read',
      featuredImage: ''
    });
    setUploadedImage(null);
    setImagePreview(null);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        // Show loading dialog
        Swal.fire({
          title: 'Processing Image...',
          text: 'Compressing image for upload',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        try {
          let processedFile = file;
          
          // Compress if larger than 8MB
          if (file.size > 8 * 1024 * 1024) {
            console.log(`Compressing ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
            
            const compressionOptions = {
              maxSizeMB: 8, // Max size 8MB (leave room for Cloudinary's 10MB limit)
              maxWidthOrHeight: 2048, // Max dimension
              useWebWorker: true,
              fileType: 'image/jpeg' as const
            };
            
            processedFile = await imageCompression(file, compressionOptions);
            console.log(`Compressed to ${(processedFile.size / 1024 / 1024).toFixed(2)}MB`);
          }
          
          setUploadedImage(processedFile);
          const reader = new FileReader();
          reader.onload = (e) => {
            setImagePreview(e.target?.result as string);
            Swal.close();
          };
          reader.readAsDataURL(processedFile);
          // Clear the URL input when a new image is selected
          setFormData({ ...formData, featuredImage: '' });
        } catch (err) {
          console.error('Error processing image:', err);
          Swal.fire({
            icon: 'error',
            title: 'Image Processing Failed',
            text: 'Failed to process image. Please try a smaller file or use a URL instead.'
          });
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Invalid File',
          text: 'Please select a valid image file'
        });
      }
    }
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    setImagePreview(null);
    setFormData({ ...formData, featuredImage: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImageUploadToServer = async (file: File): Promise<string> => {
    setIsUploading(true);
    
    // Show upload progress
    Swal.fire({
      title: 'Uploading Image...',
      text: 'Please wait while we upload your image',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    
    try {
      const imageUrl = await uploadImage(file);
      Swal.close();
      return imageUrl;
    } catch (error: any) {
      console.error('Image upload failed:', error);
      Swal.close();
      
      // Better error message for file size issues
      if (error.message && error.message.includes('File size too large')) {
        throw new Error('Image file is too large. Please select a smaller image or try again.');
      }
      
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSavePost = async () => {
    if (isEditMode) {
      try {
        let featuredImage = formData.featuredImage || '';
        
        // Handle image upload if a new image was selected
        if (uploadedImage) {
          featuredImage = await handleImageUploadToServer(uploadedImage);
        }

        const blogData = {
          ...formData,
          featuredImage
        };

        if (selectedPost) {
          // Update existing post
          await updateBlog(selectedPost._id, blogData);
          Swal.fire({
            title: 'Success!',
            text: 'Blog post updated successfully',
            icon: 'success',
            timer: 2000
          });
        } else {
          // Create new post
          await createBlog(blogData);
          Swal.fire({
            title: 'Success!',
            text: 'Blog post created successfully',
            icon: 'success',
            timer: 2000
          });
        }

        setIsModalOpen(false);
        setSelectedPost(null);
        setFormData({});
        setUploadedImage(null);
        setImagePreview(null);
        setIsUploading(false);
      } catch (error) {
        Swal.fire({
          title: 'Error!',
          text: error instanceof Error ? error.message : 'Failed to save blog post',
          icon: 'error'
        });
        setIsUploading(false);
      }
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && formData.tags) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()]
      });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    if (formData.tags) {
      setFormData({
        ...formData,
        tags: formData.tags.filter(tag => tag !== tagToRemove)
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      published: 'bg-green-100 text-green-800',
      draft: 'bg-yellow-100 text-yellow-800',
      archived: 'bg-gray-100 text-gray-800'
    };
    return statusClasses[status as keyof typeof statusClasses] || statusClasses.draft;
  };

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'destinations', label: 'Destinations' },
    { value: 'tips', label: 'Travel Tips' },
    { value: 'culture', label: 'Culture' },
    { value: 'adventure', label: 'Adventure' },
    { value: 'food', label: 'Food & Drink' },
    { value: 'photography', label: 'Photography' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Blog Management</h2>
          <p className="text-gray-600">Manage blog posts and content</p>
        </div>
        <button
          onClick={handleAddPost}
          className="mt-4 sm:mt-0 bg-[#3f7670] text-white px-4 py-2 rounded-lg hover:bg-[#2d5550] transition-colors duration-200 flex items-center space-x-2"
        >
          <FiPlus className="w-4 h-4" />
          <span>New Post</span>
        </button>
      </div>

      {/* Enhanced Filters */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl shadow-sm border border-emerald-100 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <FiBook className="w-5 h-5 text-emerald-600" />
          <h3 className="text-lg font-semibold text-gray-800">Filter Blog Posts</h3>
        </div>
        
        <div className="space-y-4">
          {/* Enhanced Search - Full Width */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Search Posts</label>
            <div className="relative group">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-400 w-5 h-5 group-focus-within:text-emerald-600 transition-colors" />
              <input
                type="text"
                placeholder="Search by title, author, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white shadow-sm transition-all duration-200 hover:border-emerald-300"
              />
            </div>
          </div>

          {/* Status and Category Filters - Same Line */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Enhanced Status Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Post Status</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowStatusMenu(prev => !prev)}
                  className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl bg-white shadow-sm flex items-center justify-between hover:border-emerald-300 focus:ring-2 focus:ring-emerald-500"
                >
                  <span className="flex items-center space-x-2 text-gray-700">
                    {statusFilter === 'all' && <FiGlobe className="w-4 h-4 text-emerald-600" />}
                    {statusFilter === 'published' && <FiCheckCircle className="w-4 h-4 text-emerald-600" />}
                    {statusFilter === 'draft' && <FiFileText className="w-4 h-4 text-emerald-600" />}
                    {statusFilter === 'archived' && <FiArchive className="w-4 h-4 text-emerald-600" />}
                    <span className="capitalize">{statusFilter === 'all' ? 'All Posts' : `${statusFilter} Posts`}</span>
                  </span>
                  <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showStatusMenu && (
                  <div className="absolute z-10 mt-2 w-full bg-white border border-emerald-100 rounded-xl shadow-lg overflow-hidden">
                    {[
                      { value: 'all', label: 'All Posts', icon: <FiGlobe className="w-4 h-4 text-emerald-600" /> },
                      { value: 'published', label: 'Published Posts', icon: <FiCheckCircle className="w-4 h-4 text-emerald-600" /> },
                      { value: 'draft', label: 'Draft Posts', icon: <FiFileText className="w-4 h-4 text-emerald-600" /> },
                      { value: 'archived', label: 'Archived Posts', icon: <FiArchive className="w-4 h-4 text-emerald-600" /> }
                    ].map(item => (
                      <button
                        key={item.value}
                        onClick={() => { setStatusFilter(item.value); setShowStatusMenu(false); }}
                        className={`w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-emerald-50 ${statusFilter === item.value ? 'bg-emerald-50' : ''}`}
                      >
                        <span className="flex items-center space-x-2 text-gray-700">
                          {item.icon}
                          <span>{item.label}</span>
                        </span>
                        {statusFilter === item.value && <FiCheckCircle className="w-4 h-4 text-emerald-600" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Category Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Post Category</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowCategoryMenu(prev => !prev)}
                  className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl bg-white shadow-sm flex items-center justify-between hover:border-emerald-300 focus:ring-2 focus:ring-emerald-500"
                >
                  <span className="flex items-center space-x-2 text-gray-700 capitalize">
                    {categoryFilter === 'all' && <FiGlobe className="w-4 h-4 text-emerald-600" />}
                    {categoryFilter === 'destinations' && <FiMapPin className="w-4 h-4 text-emerald-600" />}
                    {categoryFilter === 'tips' && <FiInfo className="w-4 h-4 text-emerald-600" />}
                    {categoryFilter === 'culture' && <FiUsers className="w-4 h-4 text-emerald-600" />}
                    {categoryFilter === 'adventure' && <FiActivity className="w-4 h-4 text-emerald-600" />}
                    {categoryFilter === 'food' && <FiCoffee className="w-4 h-4 text-emerald-600" />}
                    {categoryFilter === 'photography' && <FiCamera className="w-4 h-4 text-emerald-600" />}
                    <span>{categoryFilter === 'all' ? 'All Categories' : categories.find(c => c.value === categoryFilter)?.label || categoryFilter}</span>
                  </span>
                  <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showCategoryMenu && (
                  <div className="absolute z-10 mt-2 w-full bg-white border border-emerald-100 rounded-xl shadow-lg overflow-hidden">
                    {[
                      { value: 'all', label: 'All Categories', icon: <FiGlobe className="w-4 h-4 text-emerald-600" /> },
                      { value: 'destinations', label: 'Destinations', icon: <FiMapPin className="w-4 h-4 text-emerald-600" /> },
                      { value: 'tips', label: 'Travel Tips', icon: <FiInfo className="w-4 h-4 text-emerald-600" /> },
                      { value: 'culture', label: 'Culture', icon: <FiUsers className="w-4 h-4 text-emerald-600" /> },
                      { value: 'adventure', label: 'Adventure', icon: <FiActivity className="w-4 h-4 text-emerald-600" /> },
                      { value: 'food', label: 'Food & Drink', icon: <FiCoffee className="w-4 h-4 text-emerald-600" /> },
                      { value: 'photography', label: 'Photography', icon: <FiCamera className="w-4 h-4 text-emerald-600" /> }
                    ].map(item => (
                      <button
                        key={item.value}
                        onClick={() => { setCategoryFilter(item.value); setShowCategoryMenu(false); }}
                        className={`w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-emerald-50 ${categoryFilter === item.value ? 'bg-emerald-50' : ''}`}
                      >
                        <span className="flex items-center space-x-2 text-gray-700">
                          {item.icon}
                          <span>{item.label}</span>
                        </span>
                        {categoryFilter === item.value && <FiCheckCircle className="w-4 h-4 text-emerald-600" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Filter Summary */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
              <span>{filteredPosts.length} posts found</span>
            </span>
            {(searchQuery || statusFilter !== 'all' || categoryFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setCategoryFilter('all');
                }}
                className="text-emerald-600 hover:text-emerald-800 font-medium transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <div className="text-red-600 mr-2">⚠️</div>
            <div>
              <h3 className="text-red-800 font-medium">Error loading blogs</h3>
              <p className="text-red-600 text-sm">{error}</p>
              <button
                onClick={fetchBlogs}
                className="mt-2 text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Blog Posts Grid */}
      {!loading && !error && (
        <div ref={postsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <div key={post._id} className="blog-post bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 group">
              <div className="relative">
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                {post.isFeatured && (
                  <div className="absolute top-3 left-3 bg-[#3f7670] text-white px-2 py-1 rounded text-xs font-medium">
                    Featured
                  </div>
                )}
                <div className="absolute top-3 right-3 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => handleViewPost(post)}
                    disabled={loadingPost}
                    className="p-1 bg-white/90 backdrop-blur-sm rounded text-gray-600 hover:text-[#3f7670] disabled:opacity-50"
                    title="View"
                  >
                    {loadingPost ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#3f7670]"></div>
                    ) : (
                      <FiEye className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => handleEditPost(post)}
                    disabled={loadingPost}
                    className="p-1 bg-white/90 backdrop-blur-sm rounded text-gray-600 hover:text-[#3f7670] disabled:opacity-50"
                    title="Edit"
                  >
                    {loadingPost ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#3f7670]"></div>
                    ) : (
                      <FiEdit className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDeletePost(post._id)}
                    className="p-1 bg-white/90 backdrop-blur-sm rounded text-gray-600 hover:text-red-600"
                    title="Delete"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{post.title}</h3>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(post.status)}`}>
                  {post.status}
                </span>
              </div>
              
              <p className="text-gray-600 text-sm mb-3 line-clamp-3">{post.excerpt}</p>
              
              <div className="flex items-center text-xs text-gray-500 mb-3 space-x-4">
                <div className="flex items-center">
                  <FiUser className="w-3 h-3 mr-1" />
                  {post.author}
                </div>
                <div className="flex items-center">
                  <FiClock className="w-3 h-3 mr-1" />
                  {post.readTime}
                </div>
                <div className="flex items-center">
                  <FiCalendar className="w-3 h-3 mr-1" />
                  {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Draft'}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 capitalize">{post.category}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">
                    {post.publishedAt ? 'Published' : 'Created'} {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              {post.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {post.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                      {tag}
                    </span>
                  ))}
                  {post.tags.length > 3 && (
                    <span className="text-xs text-gray-500">+{post.tags.length - 3} more</span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        </div>
      )}

      {/* Blog Post Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditMode ? (selectedPost ? 'Edit Post' : 'New Post') : 'Post Details'}
        size="xl"
      >
        <div className="p-6">
          {isEditMode ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3f7670] focus:border-[#3f7670]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Author</label>
                  <input
                    type="text"
                    value={formData.author || ''}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3f7670] focus:border-[#3f7670]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={formData.category || 'destinations'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3f7670] focus:border-[#3f7670]"
                  >
                    {categories.slice(1).map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={formData.status || 'draft'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as BlogPost['status'] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3f7670] focus:border-[#3f7670]"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Read Time</label>
                  <input
                    type="text"
                    value={formData.readTime || ''}
                    onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3f7670] focus:border-[#3f7670]"
                  />
                </div>
                {/* Image Upload Section */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Blog Image</label>
                  
                  {/* Image Preview */}
                  {(imagePreview || formData.featuredImage) && (
                    <div className="mb-4">
                      <div className="relative inline-block">
                        <img
                          src={imagePreview || formData.featuredImage}
                          alt="Preview"
                          className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <FiX className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Upload Area */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-emerald-400 transition-colors">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    
                    {!imagePreview && !formData.featuredImage ? (
                      <div>
                        <FiUpload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-2">Upload blog image</p>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                        >
                          Choose Image
                        </button>
                        <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    ) : (
                      <div>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Change Image
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Fallback URL Input */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Or enter image URL</label>
                    <input
                      type="url"
                      value={formData.featuredImage || ''}
                      onChange={(e) => {
                        setFormData({ ...formData, featuredImage: e.target.value });
                        // Clear uploaded image when URL is manually entered
                        if (e.target.value) {
                          setUploadedImage(null);
                          setImagePreview(null);
                        }
                      }}
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
                <textarea
                  value={formData.excerpt || ''}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3f7670] focus:border-[#3f7670]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                <textarea
                  value={formData.content || ''}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3f7670] focus:border-[#3f7670]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.tags?.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-teal-50 text-[#2d5550]"
                    >
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 text-[#3f7670] hover:text-[#2d5550]"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3f7670] focus:border-[#3f7670]"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  />
                  <button
                    onClick={handleAddTag}
                    className="px-4 py-2 bg-[#3f7670] text-white rounded-lg hover:bg-[#2d5550] transition-colors duration-200"
                  >
                    Add
                  </button>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured || false}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="rounded border-gray-300 text-[#3f7670] focus:ring-[#3f7670]"
                  />
                  <span className="ml-2 text-sm text-gray-700">Featured Post</span>
                </label>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePost}
                  disabled={isUploading}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isUploading && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  )}
                  <span>{isUploading ? 'Uploading...' : (selectedPost ? 'Update' : 'Create') + ' Post'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {selectedPost && (
                <>
                  <div className="flex items-start space-x-4">
                    <img
                      src={selectedPost.featuredImage}
                      alt={selectedPost.title}
                      className="w-32 h-32 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{selectedPost.title}</h3>
                      <p className="text-gray-600 mb-3">{selectedPost.excerpt}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <FiUser className="w-4 h-4 mr-1" />
                          {selectedPost.author}
                        </span>
                        <span className="flex items-center">
                          <FiClock className="w-4 h-4 mr-1" />
                          {selectedPost.readTime}
                        </span>
                        <span className="flex items-center">
                          <FiCalendar className="w-4 h-4 mr-1" />
                          {selectedPost.publishedAt ? new Date(selectedPost.publishedAt).toLocaleDateString() : 'Draft'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Category</label>
                      <p className="text-sm text-gray-900 capitalize">{selectedPost.category}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status</label>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(selectedPost.status)}`}>
                        {selectedPost.status}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Featured</label>
                      <p className="text-sm text-gray-900">{selectedPost.isFeatured ? 'Yes' : 'No'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Slug</label>
                      <p className="text-sm text-gray-900 font-mono">{selectedPost.slug}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                    <div className="text-sm text-gray-900 bg-gray-50 p-4 rounded-lg max-h-60 overflow-y-auto whitespace-pre-wrap">
                      {selectedPost.content}
                    </div>
                  </div>
                  
                  {selectedPost.tags.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                      <div className="flex flex-wrap gap-2">
                        {selectedPost.tags.map((tag, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default BlogManagement;
