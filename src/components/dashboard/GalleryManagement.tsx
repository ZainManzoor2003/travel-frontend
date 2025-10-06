import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Modal from '../Modal';
import { FiEdit, FiTrash2, FiEye, FiSearch, FiPlus, FiImage, FiUpload, FiTag, FiX } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import Swal from 'sweetalert2';
import imageCompression from 'browser-image-compression';

interface GalleryItem {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  tags: string[];
  featured: boolean;
  status: 'active' | 'inactive';
  uploadedAt: string;
  uploadedBy: string;
  alt: string;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

const GalleryManagement = () => {
  const { token } = useAuth();
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingItem, setLoadingItem] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState<Partial<GalleryItem>>({});
  const [newTag, setNewTag] = useState('');
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const galleryRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'https://travel-backend-psi.vercel.app';

  // API Functions
  const fetchGalleryItems = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/gallery`);
      const data = await response.json();
      
      if (data.success) {
        setGalleryItems(data.data.galleryItems || []);
      } else {
        setError(data.message || 'Failed to fetch gallery items');
      }
    } catch (error) {
      console.error('Error fetching gallery items:', error);
      setError('Failed to fetch gallery items');
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    if (!token) {
      throw new Error('No authentication token');
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

  const createGalleryItem = async (galleryData: Partial<GalleryItem>) => {
    if (!token) {
      throw new Error('No authentication token');
    }

    const response = await fetch(`${API_BASE_URL}/gallery`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(galleryData)
    });

    const data = await response.json();
    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.message || 'Failed to create gallery item');
    }
  };

  const updateGalleryItem = async (id: string, galleryData: Partial<GalleryItem>) => {
    if (!token) {
      throw new Error('No authentication token');
    }

    const response = await fetch(`${API_BASE_URL}/gallery/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(galleryData)
    });

    const data = await response.json();
    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.message || 'Failed to update gallery item');
    }
  };

  const deleteGalleryItem = async (id: string) => {
    if (!token) {
      throw new Error('No authentication token');
    }

    const response = await fetch(`${API_BASE_URL}/gallery/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    if (data.success) {
      return true;
    } else {
      throw new Error(data.message || 'Failed to delete gallery item');
    }
  };

  const getGalleryItem = async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/gallery/${id}`);
    const data = await response.json();
    
    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.message || 'Failed to fetch gallery item');
    }
  };

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  useEffect(() => {
    if (galleryRef.current) {
      gsap.fromTo(
        galleryRef.current.querySelectorAll('.gallery-item'),
        { y: 20, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.1, ease: "power3.out" }
      );
    }
  }, [galleryItems]);

  const filteredItems = galleryItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleEditItem = async (item: GalleryItem) => {
    try {
      setLoadingItem(true);
      const fullItem = await getGalleryItem(item._id);
      setSelectedItem(fullItem);
      setFormData(fullItem);
      setIsEditMode(true);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching gallery item:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch gallery item details'
      });
    } finally {
      setLoadingItem(false);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await deleteGalleryItem(itemId);
        setGalleryItems(galleryItems.filter(item => item._id !== itemId));
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Gallery item has been deleted.'
        });
      } catch (error) {
        console.error('Error deleting gallery item:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to delete gallery item'
        });
      }
    }
  };

  const handleViewItem = async (item: GalleryItem) => {
    try {
      setLoadingItem(true);
      const fullItem = await getGalleryItem(item._id);
      setSelectedItem(fullItem);
      setIsEditMode(false);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching gallery item:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch gallery item details'
      });
    } finally {
      setLoadingItem(false);
    }
  };

  const handleAddItem = () => {
    setSelectedItem(null);
    const initialFormData: Partial<GalleryItem> = {
      title: '',
      description: '',
      imageUrl: '',
      category: 'nature',
      tags: [],
      featured: false,
      status: 'active' as GalleryItem['status'],
      uploadedBy: 'Admin',
      alt: ''
    };
    console.log('Initializing form data:', initialFormData);
    setFormData(initialFormData);
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
          setFormData({ ...formData, imageUrl: '' }); // Clear URL when file is selected
          
          const reader = new FileReader();
          reader.onload = (e) => {
            setImagePreview(e.target?.result as string);
            Swal.close();
          };
          reader.readAsDataURL(processedFile);
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
    setFormData({ ...formData, imageUrl: '' }); // Clear URL when image is removed
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
      console.error('Error uploading image:', error);
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

  const handleSaveItem = async () => {
    if (isEditMode) {
      try {
        let imageUrl = formData.imageUrl || '';
        
        // Handle image upload if a new image was selected
        if (uploadedImage) {
          try {
            imageUrl = await handleImageUploadToServer(uploadedImage);
            console.log('Image uploaded successfully:', imageUrl);
          } catch (error) {
            console.error('Image upload failed:', error);
            Swal.fire({
              icon: 'error',
              title: 'Image Upload Failed',
              text: 'Failed to upload image. Please try again or use a URL instead.'
            });
            return;
          }
        }

        const galleryData = {
          title: formData.title,
          description: formData.description,
          imageUrl: imageUrl,
          category: formData.category,
          tags: formData.tags || [],
          featured: formData.featured || false,
          status: formData.status || 'active',
          uploadedBy: formData.uploadedBy || 'Admin',
          alt: formData.alt
        };

        console.log('Sending gallery data:', galleryData);

        // Validate required fields
        if (!galleryData.title || !galleryData.description || !galleryData.imageUrl || !galleryData.category || !galleryData.alt) {
          Swal.fire({
            icon: 'error',
            title: 'Validation Error',
            text: `Please fill in all required fields. Missing: ${
              !galleryData.title ? 'Title ' : ''
            }${!galleryData.description ? 'Description ' : ''
            }${!galleryData.imageUrl ? 'Image ' : ''
            }${!galleryData.category ? 'Category ' : ''
            }${!galleryData.alt ? 'Alt Text' : ''}`
          });
          return;
        }

        if (selectedItem) {
          // Update existing item
          const updatedItem = await updateGalleryItem(selectedItem._id, galleryData);
          setGalleryItems(galleryItems.map(item => 
            item._id === selectedItem._id ? updatedItem : item
          ));
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Gallery item updated successfully.'
          });
        } else {
          // Add new item
          const newItem = await createGalleryItem(galleryData);
          setGalleryItems([newItem, ...galleryItems]);
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Gallery item created successfully.'
          });
        }
      } catch (error) {
        console.error('Error saving gallery item:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to save gallery item. Please try again.';
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: errorMessage
        });
        return;
      }
    }
    setIsModalOpen(false);
    setSelectedItem(null);
    setFormData({});
    setUploadedImage(null);
    setImagePreview(null);
    setIsUploading(false);
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
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800'
    };
    return statusClasses[status as keyof typeof statusClasses] || statusClasses.inactive;
  };

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'nature', label: 'Nature' },
    { value: 'city', label: 'City' },
    { value: 'landmark', label: 'Landmark' },
    { value: 'culture', label: 'Culture' },
    { value: 'adventure', label: 'Adventure' },
    { value: 'food', label: 'Food' },
    { value: 'people', label: 'People' },
    { value: 'architecture', label: 'Architecture' },
    { value: 'wildlife', label: 'Wildlife' },
    { value: 'landscape', label: 'Landscape' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Gallery Management</h2>
          <p className="text-gray-600">Manage images and visual content</p>
        </div>
        <button
          onClick={handleAddItem}
          className="mt-4 sm:mt-0 bg-[#3f7670] text-white px-4 py-2 rounded-lg hover:bg-[#2d5550] transition-colors duration-200 flex items-center space-x-2"
        >
          <FiPlus className="w-4 h-4" />
          <span>Add Image</span>
        </button>
      </div>

      {/* Enhanced Filters */}
      <div className="bg-gradient-to-r from-teal-50 to-teal-100 rounded-xl shadow-sm border border-teal-100 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <FiImage className="w-5 h-5 text-[#3f7670]" />
          <h3 className="text-lg font-semibold text-gray-800">Filter Gallery</h3>
        </div>
        
        <div className="space-y-4">
          {/* Enhanced Search - Full Width */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Search Images</label>
            <div className="relative group">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-400 w-5 h-5 group-focus-within:text-[#3f7670] transition-colors" />
              <input
                type="text"
                placeholder="Search by title, tags, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-teal-200 rounded-xl focus:ring-2 focus:ring-[#3f7670] focus:border-[#3f7670] bg-white shadow-sm transition-all duration-200 hover:border-teal-300"
              />
            </div>
          </div>

          {/* Status and Category Filters - Same Line */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Enhanced Status Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Image Status</label>
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-teal-200 rounded-xl focus:ring-2 focus:ring-[#3f7670] focus:border-[#3f7670] bg-white shadow-sm transition-all duration-200 hover:border-teal-300 appearance-none cursor-pointer"
                >
                  <option value="all">All Images</option>
                  <option value="active">Active Images</option>
                  <option value="inactive">Inactive Images</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Enhanced Category Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Image Category</label>
              <div className="relative">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-teal-200 rounded-xl focus:ring-2 focus:ring-[#3f7670] focus:border-[#3f7670] bg-white shadow-sm transition-all duration-200 hover:border-teal-300 appearance-none cursor-pointer"
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.value === 'all' ? 'All Categories' : 
                       category.value === 'nature' ? 'Nature' :
                       category.value === 'beach' ? 'Beach' :
                       category.value === 'culture' ? 'Culture' :
                       category.value === 'adventure' ? 'Adventure' :
                       category.value === 'urban' ? 'Urban' :
                       category.value === 'food' ? 'Food' : category.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Filter Summary */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 bg-[#3f7670] rounded-full"></span>
              <span>{filteredItems.length} images found</span>
            </span>
            {(searchQuery || statusFilter !== 'all' || categoryFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setCategoryFilter('all');
                }}
                className="text-[#3f7670] hover:text-[#2d5550] font-medium transition-colors"
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3f7670]"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={fetchGalleryItems}
                  className="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gallery Grid */}
      {!loading && !error && (
        <div ref={galleryRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
          <div key={item._id} className="gallery-item bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
            <div className="relative group">
              <img
                src={item.imageUrl}
                alt={item.alt}
                className="w-full h-48 object-cover"
              />
              {item.featured && (
                <div className="absolute top-3 left-3 bg-[#3f7670] text-white px-2 py-1 rounded text-xs font-medium">
                  Featured
                </div>
              )}
              <div className="absolute top-3 right-3 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={() => handleViewItem(item)}
                  className="p-1 bg-white/90 backdrop-blur-sm rounded text-gray-600 hover:text-[#3f7670]"
                  title="View"
                >
                  <FiEye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleEditItem(item)}
                  className="p-1 bg-white/90 backdrop-blur-sm rounded text-gray-600 hover:text-[#3f7670]"
                  title="Edit"
                >
                  <FiEdit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteItem(item._id)}
                  className="p-1 bg-white/90 backdrop-blur-sm rounded text-gray-600 hover:text-red-600"
                  title="Delete"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">{item.title}</h3>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(item.status)}`}>
                  {item.status}
                </span>
              </div>
              
              <p className="text-gray-600 text-xs mb-3 line-clamp-2">{item.description}</p>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="capitalize">{item.category}</span>
                <span>{new Date(item.uploadedAt).toLocaleDateString()}</span>
              </div>
              
              {item.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {item.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                      <FiTag className="w-3 h-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                  {item.tags.length > 3 && (
                    <span className="text-xs text-gray-500">+{item.tags.length - 3} more</span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        </div>
      )}

      {/* Gallery Item Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditMode ? (selectedItem ? 'Edit Image' : 'Add Image') : 'Image Details'}
        size="lg"
      >
        <div className="p-6">
          {loadingItem ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3f7670]"></div>
            </div>
          ) : isEditMode ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title || ''}
                    onChange={(e) => {
                      console.log('Title changed:', e.target.value);
                      setFormData({ ...formData, title: e.target.value });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3f7670] focus:border-[#3f7670]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={formData.category || 'nature'}
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
                {/* Image Upload Section */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gallery Image</label>
                  
                  {/* Image Preview */}
                  {(imagePreview || formData.imageUrl) && (
                    <div className="mb-4">
                      <div className="relative inline-block">
                        <img
                          src={imagePreview || formData.imageUrl}
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
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-teal-400 transition-colors">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    
                    {!imagePreview && !formData.imageUrl ? (
                      <div>
                        <FiUpload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-2">Upload gallery image</p>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="bg-[#3f7670] text-white px-4 py-2 rounded-lg hover:bg-[#2d5550] transition-colors"
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
                      value={formData.imageUrl || ''}
                      onChange={(e) => {
                        setFormData({ ...formData, imageUrl: e.target.value });
                        // Clear image preview and uploaded image when URL is manually entered
                        if (e.target.value) {
                          setImagePreview(null);
                          setUploadedImage(null);
                        }
                      }}
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3f7670] focus:border-[#3f7670]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Alt Text</label>
                  <input
                    type="text"
                    value={formData.alt || ''}
                    onChange={(e) => {
                      console.log('Alt text changed:', e.target.value);
                      setFormData({ ...formData, alt: e.target.value });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3f7670] focus:border-[#3f7670]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={formData.status || 'inactive'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as GalleryItem['status'] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3f7670] focus:border-[#3f7670]"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => {
                    console.log('Description changed:', e.target.value);
                    setFormData({ ...formData, description: e.target.value });
                  }}
                  rows={3}
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
                    checked={formData.featured || false}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded border-gray-300 text-[#3f7670] focus:ring-[#3f7670]"
                  />
                  <span className="ml-2 text-sm text-gray-700">Featured Image</span>
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
                  onClick={handleSaveItem}
                  disabled={isUploading}
                  className="px-4 py-2 bg-[#3f7670] text-white rounded-lg hover:bg-[#2d5550] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isUploading && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  )}
                  <span>{isUploading ? 'Uploading...' : (selectedItem ? 'Update' : 'Add') + ' Image'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {selectedItem && (
                <>
                  <div className="flex items-start space-x-4">
                    <img
                      src={selectedItem.imageUrl}
                      alt={selectedItem.alt}
                      className="w-32 h-32 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{selectedItem.title}</h3>
                      <p className="text-gray-600 mb-3">{selectedItem.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="capitalize">{selectedItem.category}</span>
                        <span>{new Date(selectedItem.uploadedAt).toLocaleDateString()}</span>
                        <span>by {selectedItem.uploadedBy}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status</label>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(selectedItem.status)}`}>
                        {selectedItem.status}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Featured</label>
                      <p className="text-sm text-gray-900">{selectedItem.featured ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                  
                  {selectedItem.tags.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                      <div className="flex flex-wrap gap-2">
                        {selectedItem.tags.map((tag, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                            <FiTag className="w-3 h-3 mr-1" />
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

export default GalleryManagement;
