import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Modal from '../Modal';
import { FiEdit, FiTrash2, FiEye, FiSearch, FiFilter, FiPlus, FiMapPin, FiClock, FiDollarSign, FiUpload, FiX } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import Swal from 'sweetalert2';
import imageCompression from 'browser-image-compression';

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
  // Optional UI-only fields (no backend/schema required)
  highlights?: string[];
  included?: string[];
  notIncluded?: string[];
  itinerary?: Array<{ title: string; description: string; points: string[] }>;
}

const ToursManagement = () => {
  const { token } = useAuth();
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState<Partial<Tour>>({});
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Local inputs for bullet sections (UI only)
  const [newHighlight, setNewHighlight] = useState('');
  const [newIncluded, setNewIncluded] = useState('');
  const [newNotIncluded, setNewNotIncluded] = useState('');
  const [newItineraryDayTitle, setNewItineraryDayTitle] = useState('');
  const [newItineraryDayDesc, setNewItineraryDayDesc] = useState('');
  const [newItineraryPoint, setNewItineraryPoint] = useState('');
  const [draftItineraryPoints, setDraftItineraryPoints] = useState<string[]>([]);

  const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'https://travel-backend-psi.vercel.app';

  // API functions
  const fetchTours = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/tours`);
      const data = await res.json();
      if (data.success) {
        setTours(data.data.tours || []);
        setError(null);
      } else {
        setError(data.message || 'Failed to fetch tours');
      }
    } catch (e) {
      setError('Failed to fetch tours');
    } finally {
      setLoading(false);
    }
  };

  const getTour = async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/tours/${id}`);
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Failed to fetch tour');
    return data.data as Tour;
  };

  const uploadImage = async (file: File): Promise<string> => {
    if (!token) throw new Error('No authentication token');
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch(`${API_BASE_URL}/upload/image`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Upload failed');
    return data.data.imageUrl as string;
  };

  const createTour = async (tourData: Partial<Tour>) => {
    if (!token) throw new Error('No authentication token');
    const res = await fetch(`${API_BASE_URL}/tours`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(tourData)
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Failed to create tour');
    return data.data as Tour;
  };

  const updateTour = async (id: string, tourData: Partial<Tour>) => {
    if (!token) throw new Error('No authentication token');
    const res = await fetch(`${API_BASE_URL}/tours/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(tourData)
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Failed to update tour');
    return data.data as Tour;
  };

  const deleteTourApi = async (id: string) => {
    if (!token) throw new Error('No authentication token');
    const res = await fetch(`${API_BASE_URL}/tours/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Failed to delete tour');
    return true;
  };

  useEffect(() => {
    fetchTours();
  }, []);

  useEffect(() => {
    if (tableRef.current) {
      gsap.fromTo(
        tableRef.current.querySelectorAll('.tour-row'),
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power3.out" }
      );
    }
  }, [tours]);

  const filteredTours = tours.filter(tour => {
    const matchesSearch = tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tour.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tour.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || tour.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || tour.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleEditTour = async (tour: Tour) => {
    try {
      const full = await getTour(tour._id);
      setSelectedTour(full);
      setFormData({
        ...full,
        highlights: full.highlights || [],
        included: full.included || [],
        notIncluded: full.notIncluded || [],
        itinerary: full.itinerary || [],
        images: full.images || []
      });
      setUploadedImages([]);
      setImagePreviews([]);
      setIsEditMode(true);
      setIsModalOpen(true);
    } catch (e) {
      Swal.fire({ icon: 'error', title: 'Error', text: (e as Error).message });
    }
  };

  const handleDeleteTour = async (tourId: string) => {
    const res = await Swal.fire({
      title: 'Delete tour?',
      text: "This action cannot be undone.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Delete'
    });
    if (!res.isConfirmed) return;
    try {
      await deleteTourApi(tourId);
      setTours(tours.filter(t => t._id !== tourId));
      Swal.fire({ icon: 'success', title: 'Deleted', text: 'Tour deleted successfully' });
    } catch (e) {
      Swal.fire({ icon: 'error', title: 'Error', text: (e as Error).message });
    }
  };

  const handleViewTour = (tour: Tour) => {
    setSelectedTour(tour);
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const handleAddTour = () => {
    setSelectedTour(null);
    setFormData({
      title: '',
      description: '',
      price: 0,
      duration: '',
      location: '',
      category: 'adventure',
      rating: 0,
      image: '',
      images: [],
      status: 'draft',
      featured: false,
      maxParticipants: 10,
      difficulty: 'easy',
      highlights: [],
      included: [],
      notIncluded: [],
      itinerary: []
    });
    setUploadedImages([]);
    setImagePreviews([]);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  // Handlers for bullet/tag inputs (UI only)
  const addHighlight = () => {
    if (!newHighlight.trim()) return;
    setFormData({ ...formData, highlights: [...(formData.highlights || []), newHighlight.trim()] });
    setNewHighlight('');
  };
  const removeHighlight = (value: string) => {
    setFormData({ ...formData, highlights: (formData.highlights || []).filter(h => h !== value) });
  };

  const addIncluded = () => {
    if (!newIncluded.trim()) return;
    setFormData({ ...formData, included: [...(formData.included || []), newIncluded.trim()] });
    setNewIncluded('');
  };
  const removeIncluded = (value: string) => {
    setFormData({ ...formData, included: (formData.included || []).filter(i => i !== value) });
  };

  const addNotIncluded = () => {
    if (!newNotIncluded.trim()) return;
    setFormData({ ...formData, notIncluded: [...(formData.notIncluded || []), newNotIncluded.trim()] });
    setNewNotIncluded('');
  };
  const removeNotIncluded = (value: string) => {
    setFormData({ ...formData, notIncluded: (formData.notIncluded || []).filter(i => i !== value) });
  };

  const addItineraryPointToDraft = () => {
    if (!newItineraryPoint.trim()) return;
    setDraftItineraryPoints([...draftItineraryPoints, newItineraryPoint.trim()]);
    setNewItineraryPoint('');
  };

  const removeItineraryPointFromDraft = (value: string) => {
    setDraftItineraryPoints(draftItineraryPoints.filter(p => p !== value));
  };

  const addItineraryDay = () => {
    if (!newItineraryDayTitle.trim()) return;
    const newDay = {
      title: newItineraryDayTitle.trim(),
      description: newItineraryDayDesc.trim(),
      points: draftItineraryPoints
    };
    setFormData({ ...formData, itinerary: [...(formData.itinerary || []), newDay] });
    setNewItineraryDayTitle('');
    setNewItineraryDayDesc('');
    setDraftItineraryPoints([]);
    setNewItineraryPoint('');
  };

  const removeItineraryDay = (idx: number) => {
    const next = [...(formData.itinerary || [])];
    next.splice(idx, 1);
    setFormData({ ...formData, itinerary: next });
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newFiles: File[] = [];
      const newPreviews: string[] = [];
      
      // Show loading message
      Swal.fire({
        title: 'Processing Images...',
        text: 'Compressing images for upload',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const compressionOptions = {
        maxSizeMB: 8, // Max size 8MB (leave room for Cloudinary's 10MB limit)
        maxWidthOrHeight: 2048, // Max dimension
        useWebWorker: true,
        fileType: 'image/jpeg' as const
      };
      
      try {
        for (const file of Array.from(files)) {
          if (file.type.startsWith('image/')) {
            try {
              // Compress image if it's larger than 8MB
              let processedFile = file;
              if (file.size > 8 * 1024 * 1024) {
                console.log(`Compressing ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
                processedFile = await imageCompression(file, compressionOptions);
                console.log(`Compressed to ${(processedFile.size / 1024 / 1024).toFixed(2)}MB`);
              }
              
              newFiles.push(processedFile);
              
              // Create preview
              const reader = new FileReader();
              await new Promise<void>((resolve) => {
                reader.onload = (e) => {
                  newPreviews.push(e.target?.result as string);
                  resolve();
                };
                reader.readAsDataURL(processedFile);
              });
            } catch (err) {
              console.error('Error processing image:', err);
              Swal.fire({
                icon: 'warning',
                title: 'Image Processing Failed',
                text: `Failed to process ${file.name}. It will be skipped.`
              });
            }
          }
        }
        
        Swal.close();
        
        if (newFiles.length === 0) {
          Swal.fire({
            icon: 'error',
            title: 'No Valid Images',
            text: 'Please select valid image files'
          });
        } else {
          setUploadedImages([...uploadedImages, ...newFiles]);
          setImagePreviews([...imagePreviews, ...newPreviews]);
          
          if (newFiles.length < files.length) {
            Swal.fire({
              icon: 'info',
              title: 'Partial Success',
              text: `${newFiles.length} of ${files.length} images were processed successfully`
            });
          }
        }
      } catch (err) {
        Swal.close();
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to process images. Please try again.'
        });
      }
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = uploadedImages.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setUploadedImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handleRemoveExistingImage = (index: number) => {
    const newImages = (formData.images || []).filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages, image: newImages[0] || '' });
  };

  const simulateImageUpload = async (file: File): Promise<string> => {
    setIsUploading(true);
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a real app, you would upload to a server and get back a URL
    // For now, we'll create a data URL
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSaveTour = async () => {
    if (!isEditMode) return;
    
    setIsUploading(true);
    
    // Upload new images
    const uploadedImageUrls: string[] = [];
    if (uploadedImages.length > 0) {
      try {
        let uploadCount = 0;
        for (const file of uploadedImages) {
          uploadCount++;
          // Show progress
          Swal.fire({
            title: 'Uploading Images...',
            text: `Uploading ${uploadCount} of ${uploadedImages.length}`,
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            }
          });
          
          const url = await uploadImage(file);
          uploadedImageUrls.push(url);
        }
        Swal.close();
      } catch (e) {
        setIsUploading(false);
        Swal.close();
        const errorMessage = (e as Error).message;
        if (errorMessage.includes('File size too large') || errorMessage.includes('size')) {
          Swal.fire({ 
            icon: 'error', 
            title: 'File Too Large', 
            text: 'One or more images are still too large after compression. Please try smaller images or reduce quality.',
            confirmButtonText: 'OK'
          });
        } else {
          Swal.fire({ 
            icon: 'error', 
            title: 'Upload failed', 
            text: errorMessage,
            confirmButtonText: 'OK'
          });
        }
        return;
      }
    }

    // Combine existing images with newly uploaded ones
    const allImages = [...(formData.images || []), ...uploadedImageUrls];
    const mainImage = allImages[0] || formData.image || '';

    const payload = {
      title: formData.title,
      description: formData.description,
      price: formData.price,
      duration: formData.duration,
      location: formData.location,
      category: formData.category,
      rating: formData.rating || 0,
      image: mainImage,
      images: allImages,
      status: (formData.status as Tour['status']) || 'draft',
      featured: formData.featured || false,
      maxParticipants: formData.maxParticipants || 10,
      difficulty: (formData.difficulty as Tour['difficulty']) || 'easy',
      highlights: formData.highlights || [],
      included: formData.included || [],
      notIncluded: formData.notIncluded || [],
      itinerary: formData.itinerary || []
    };

    try {
      if (selectedTour) {
        const updated = await updateTour(selectedTour._id, payload);
        setTours(tours.map(t => (t._id === selectedTour._id ? updated : t)));
        Swal.fire({ icon: 'success', title: 'Updated', text: 'Tour updated successfully' });
      } else {
        const created = await createTour(payload);
        setTours([created, ...tours]);
        Swal.fire({ icon: 'success', title: 'Created', text: 'Tour created successfully' });
      }
      setIsModalOpen(false);
      setSelectedTour(null);
      setFormData({});
      setUploadedImages([]);
      setImagePreviews([]);
      setIsUploading(false);
    } catch (e) {
      setIsUploading(false);
      Swal.fire({ icon: 'error', title: 'Error', text: (e as Error).message });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800',
      draft: 'bg-yellow-100 text-yellow-800'
    };
    return statusClasses[status as keyof typeof statusClasses] || statusClasses.draft;
  };

  const getDifficultyBadge = (difficulty: string) => {
    const difficultyClasses = {
      easy: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      hard: 'bg-red-100 text-red-800'
    };
    return difficultyClasses[difficulty as keyof typeof difficultyClasses] || difficultyClasses.easy;
  };

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'adventure', label: 'Adventure' },
    { value: 'cultural', label: 'Cultural' },
    { value: 'relaxation', label: 'Relaxation' },
    { value: 'nature', label: 'Nature' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Tours & Packages Management</h2>
          <p className="text-gray-600">Manage tour packages and travel experiences</p>
        </div>
        <button
          onClick={handleAddTour}
          className="mt-4 sm:mt-0 bg-[#3f7670] text-white px-4 py-2 rounded-lg hover:bg-[#2d5550] transition-colors duration-200 flex items-center space-x-2"
        >
          <FiPlus className="w-4 h-4" />
          <span>Add Tour</span>
        </button>
      </div>

      {/* Enhanced Filters */}
      <div className="bg-gradient-to-r from-teal-50 to-teal-100 rounded-xl shadow-sm border border-teal-100 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <FiFilter className="w-5 h-5 text-[#3f7670]" />
          <h3 className="text-lg font-semibold text-gray-800">Filter Tours</h3>
        </div>
        
        <div className="space-y-4">
          {/* Enhanced Search - Full Width */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Search Tours</label>
            <div className="relative group">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-400 w-5 h-5 group-focus-within:text-[#3f7670] transition-colors" />
              <input
                type="text"
                placeholder="Search by title, location, or description..."
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
              <label className="block text-sm font-medium text-gray-700">Tour Status</label>
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-teal-200 rounded-xl focus:ring-2 focus:ring-[#3f7670] focus:border-[#3f7670] bg-white shadow-sm transition-all duration-200 hover:border-teal-300 appearance-none cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active Tours</option>
                  <option value="inactive">Inactive Tours</option>
                  <option value="draft">Draft Tours</option>
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
              <label className="block text-sm font-medium text-gray-700">Tour Category</label>
              <div className="relative">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-teal-200 rounded-xl focus:ring-2 focus:ring-[#3f7670] focus:border-[#3f7670] bg-white shadow-sm transition-all duration-200 hover:border-teal-300 appearance-none cursor-pointer"
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.value === 'all' ? 'All Categories' : 
                       category.value === 'adventure' ? 'Adventure' :
                       category.value === 'cultural' ? 'Cultural' :
                       category.value === 'relaxation' ? 'Relaxation' :
                       category.value === 'nature' ? 'Nature' : category.label}
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
              <span>{filteredTours.length} tours found</span>
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

      {/* Tours Grid */}
      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center py-12"><div className="animate-spin h-10 w-10 rounded-full border-b-2 border-[#3f7670]"></div></div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">{error}</div>
      )}

      {!loading && !error && (
      <div ref={tableRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTours.map((tour) => (
          <div key={tour._id} className="tour-row bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
            <div className="relative">
              <img
                src={tour.image}
                alt={tour.title}
                className="w-full h-48 object-cover"
              />
              {tour.featured && (
                <div className="absolute top-3 left-3 bg-[#3f7670] text-white px-2 py-1 rounded text-xs font-medium">
                  Featured
                </div>
              )}
              <div className="absolute top-3 right-3 flex space-x-1">
                <button
                  onClick={() => handleViewTour(tour)}
                  className="p-1 bg-white/90 backdrop-blur-sm rounded text-gray-600 hover:text-[#3f7670]"
                  title="View"
                >
                  <FiEye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleEditTour(tour)}
                  className="p-1 bg-white/90 backdrop-blur-sm rounded text-gray-600 hover:text-[#3f7670]"
                  title="Edit"
                >
                  <FiEdit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteTour(tour._id)}
                  className="p-1 bg-white/90 backdrop-blur-sm rounded text-gray-600 hover:text-red-600"
                  title="Delete"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{tour.title}</h3>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(tour.status)}`}>
                  {tour.status}
                </span>
              </div>
              
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{tour.description}</p>
              
              <div className="flex items-center text-sm text-gray-500 mb-3 space-x-4">
                <div className="flex items-center">
                  <FiMapPin className="w-4 h-4 mr-1" />
                  {tour.location}
                </div>
                <div className="flex items-center">
                  <FiClock className="w-4 h-4 mr-1" />
                  {tour.duration}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-[#3f7670]">${tour.price}</span>
                  <span className="text-sm text-gray-500">/person</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">⭐ {tour.rating}</span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDifficultyBadge(tour.difficulty)}`}>
                    {tour.difficulty}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}

      {/* Tour Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditMode ? (selectedTour ? 'Edit Tour' : 'Add Tour') : 'Tour Details'}
        size="lg"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                  <input
                    type="number"
                    value={formData.price || ''}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3f7670] focus:border-[#3f7670]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                  <input
                    type="text"
                    value={formData.duration || ''}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3f7670] focus:border-[#3f7670]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={formData.location || ''}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3f7670] focus:border-[#3f7670]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={formData.category || 'adventure'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3f7670] focus:border-[#3f7670]"
                  >
                    <option value="adventure">Adventure</option>
                    <option value="cultural">Cultural</option>
                    <option value="relaxation">Relaxation</option>
                    <option value="nature">Nature</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                  <select
                    value={formData.difficulty || 'easy'}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as Tour['difficulty'] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3f7670] focus:border-[#3f7670]"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Participants</label>
                  <input
                    type="number"
                    value={formData.maxParticipants || ''}
                    onChange={(e) => setFormData({ ...formData, maxParticipants: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3f7670] focus:border-[#3f7670]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={formData.status || 'draft'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Tour['status'] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3f7670] focus:border-[#3f7670]"
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3f7670] focus:border-[#3f7670]"
                />
              </div>

              {/* Tour Highlights */}
              <div className="space-y-3">
                <h4 className="text-md font-semibold text-gray-900">Tour Highlights</h4>
                <div className="flex flex-wrap gap-2">
                  {(formData.highlights || []).map((h, idx) => (
                    <span key={idx} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-teal-50 text-[#2d5550]">
                      {h}
                      <button onClick={() => removeHighlight(h)} className="ml-1 text-[#3f7670] hover:text-[#2d5550]">×</button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newHighlight}
                    onChange={(e) => setNewHighlight(e.target.value)}
                    placeholder="Add a highlight bullet"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3f7670] focus:border-[#3f7670]"
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addHighlight())}
                  />
                  <button onClick={addHighlight} className="px-4 py-2 bg-[#3f7670] text-white rounded-lg hover:bg-[#2d5550]">Add</button>
                </div>
              </div>

              {/* What's Included */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="text-md font-semibold text-gray-900">Included</h4>
                  <div className="flex flex-wrap gap-2">
                    {(formData.included || []).map((i, idx) => (
                      <span key={idx} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                        {i}
                        <button onClick={() => removeIncluded(i)} className="ml-1 text-green-600 hover:text-green-800">×</button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newIncluded}
                      onChange={(e) => setNewIncluded(e.target.value)}
                      placeholder="Add an included item"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3f7670] focus:border-[#3f7670]"
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addIncluded())}
                    />
                    <button onClick={addIncluded} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Add</button>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-md font-semibold text-gray-900">Not Included</h4>
                  <div className="flex flex-wrap gap-2">
                    {(formData.notIncluded || []).map((i, idx) => (
                      <span key={idx} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                        {i}
                        <button onClick={() => removeNotIncluded(i)} className="ml-1 text-red-600 hover:text-red-800">×</button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newNotIncluded}
                      onChange={(e) => setNewNotIncluded(e.target.value)}
                      placeholder="Add a not-included item"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3f7670] focus:border-[#3f7670]"
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addNotIncluded())}
                    />
                    <button onClick={addNotIncluded} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Add</button>
                  </div>
                </div>
              </div>

              {/* Daily Itinerary */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-gray-900">Daily Itinerary</h4>
                {/* Existing days preview */}
                {(formData.itinerary || []).length > 0 && (
                  <div className="space-y-3">
                    {(formData.itinerary || []).map((day, idx) => (
                      <div key={idx} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 text-[#3f7670] font-semibold">
                              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-teal-50">{idx + 1}</span>
                              <span>{day.title}</span>
                            </div>
                            {day.description && (
                              <p className="text-sm text-gray-600 mt-1">{day.description}</p>
                            )}
                          </div>
                          <button onClick={() => removeItineraryDay(idx)} className="text-red-600 hover:text-red-800 text-sm">Remove</button>
                        </div>
                        {day.points?.length > 0 && (
                          <ul className="list-disc pl-6 mt-2 text-sm text-gray-700 space-y-1">
                            {day.points.map((p, i) => (<li key={i}>{p}</li>))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Draft new day composer */}
                <div className="border border-dashed border-gray-300 rounded-lg p-4 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Day Title</label>
                      <input
                        type="text"
                        value={newItineraryDayTitle}
                        onChange={(e) => setNewItineraryDayTitle(e.target.value)}
                        placeholder="e.g., Arrival in Bali"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3f7670] focus:border-[#3f7670]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                      <input
                        type="text"
                        value={newItineraryDayDesc}
                        onChange={(e) => setNewItineraryDayDesc(e.target.value)}
                        placeholder="e.g., Welcome dinner and orientation"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3f7670] focus:border-[#3f7670]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Points for this day</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newItineraryPoint}
                        onChange={(e) => setNewItineraryPoint(e.target.value)}
                        placeholder="e.g., Airport pickup"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3f7670] focus:border-[#3f7670]"
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addItineraryPointToDraft())}
                      />
                      <button onClick={addItineraryPointToDraft} className="px-4 py-2 bg-[#3f7670] text-white rounded-lg hover:bg-[#2d5550]">Add Point</button>
                    </div>
                    {draftItineraryPoints.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {draftItineraryPoints.map((p, i) => (
                          <span key={i} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-teal-50 text-[#2d5550]">
                            {p}
                            <button onClick={() => removeItineraryPointFromDraft(p)} className="ml-1 text-[#3f7670] hover:text-[#2d5550]">×</button>
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="pt-2">
                      <button onClick={addItineraryDay} className="px-4 py-2 bg-[#3f7670] text-white rounded-lg hover:bg-[#2d5550]">Add Day</button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Multiple Images Upload Section */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Tour Images (Multiple)</label>
                
                {/* Existing Images Preview */}
                {formData.images && formData.images.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Existing Images:</p>
                    <div className="grid grid-cols-4 gap-3">
                      {formData.images.map((img, index) => (
                        <div key={index} className="relative inline-block">
                          <img
                            src={img}
                            alt={`Tour ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveExistingImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                          >
                            <FiX className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New Images Preview */}
                {imagePreviews.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">New Images to Upload:</p>
                    <div className="grid grid-cols-4 gap-3">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative inline-block">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                          >
                            <FiX className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upload Area */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-teal-400 transition-colors">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  
                  <div>
                    <FiUpload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">Upload multiple tour images</p>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-[#3f7670] text-white px-4 py-2 rounded-lg hover:bg-[#2d5550] transition-colors"
                    >
                      Choose Images
                    </button>
                    <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF - Large images will be automatically compressed</p>
                    <p className="text-xs text-gray-400 mt-1">💡 Tip: Select multiple files at once for faster upload</p>
                  </div>
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
                  <span className="ml-2 text-sm text-gray-700">Featured Tour</span>
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
                  onClick={handleSaveTour}
                  disabled={isUploading}
                  className="px-4 py-2 bg-[#3f7670] text-white rounded-lg hover:bg-[#2d5550] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isUploading && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  )}
                  <span>{isUploading ? 'Uploading...' : (selectedTour ? 'Update' : 'Create') + ' Tour'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {selectedTour && (
                <>
                  <div className="flex items-start space-x-4">
                    <img
                      src={selectedTour.image}
                      alt={selectedTour.title}
                      className="w-24 h-24 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{selectedTour.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <FiMapPin className="w-4 h-4 mr-1" />
                          {selectedTour.location}
                        </span>
                        <span className="flex items-center">
                          <FiClock className="w-4 h-4 mr-1" />
                          {selectedTour.duration}
                        </span>
                        <span className="flex items-center">
                          <FiDollarSign className="w-4 h-4 mr-1" />
                          ${selectedTour.price}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Category</label>
                      <p className="text-sm text-gray-900 capitalize">{selectedTour.category}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Difficulty</label>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDifficultyBadge(selectedTour.difficulty)}`}>
                        {selectedTour.difficulty}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status</label>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(selectedTour.status)}`}>
                        {selectedTour.status}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Max Participants</label>
                      <p className="text-sm text-gray-900">{selectedTour.maxParticipants}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Rating</label>
                      <p className="text-sm text-gray-900">⭐ {selectedTour.rating}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Featured</label>
                      <p className="text-sm text-gray-900">{selectedTour.featured ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <p className="text-sm text-gray-900 mt-1">{selectedTour.description}</p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default ToursManagement;
