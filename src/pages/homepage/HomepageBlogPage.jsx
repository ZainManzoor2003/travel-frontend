import { useState, useEffect } from 'react'
import BlogCard from './components/BlogCard'
import Menu from './components/Menu'
import Footer from './components/Footer'
import LoadingSpinner from '../../components/LoadingSpinner'
import { Link } from 'react-router-dom'

const HomepageBlogPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  const [blogPosts, setBlogPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    const load = async () => {
      try {
        setLoading(true)
        setError(null)
        const API_BASE = (import.meta && import.meta.env && import.meta.env.VITE_API_BASE_URL) || 'https://travel-backend-psi.vercel.app'
        const blogsRes = await fetch(`${API_BASE}/blogs?status=published`, { signal: controller.signal })
        if (!blogsRes.ok) throw new Error(`Failed to load blogs (${blogsRes.status})`)
        const blogsJson = await blogsRes.json()
        const blogsList = (blogsJson && blogsJson.data && blogsJson.data.blogs) || []
        const uiBlogs = blogsList.map(blog => ({
          id: blog._id,
          title: blog.title,
          location: ((blog.category || 'Blog') + '').toUpperCase(),
          date: new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
          description: blog.excerpt,
          image: blog.featuredImage,
          readMoreLink: `/blog/${blog._id}`
        }))
        setBlogPosts(uiBlogs)
      } catch (e) {
        if (e && e.name === 'AbortError') return
        setError(e?.message || 'Failed to load blogs')
      } finally {
        setLoading(false)
      }
    }
    load()
    return () => controller.abort()
  }, [])

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#ffe020' }}>
      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 z-[1000] p-8 px-12 flex items-center justify-between bg-transparent">
        <div className="flex items-center gap-6">
          <button 
            className="flex items-center gap-3 bg-none border-none text-white font-sans text-sm font-normal tracking-wider cursor-pointer transition-opacity duration-300 hover:opacity-80" 
            onClick={toggleMenu}
          >
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
            src="/Logo.webp"
            alt="Awasi Logo"
            className="mt-2 h-24 w-56"
          />
        </div>
        
      </nav>

      {/* Hero Section */}
      <section className="w-full h-screen flex items-center flex-wrap relative">
        <div className="w-full h-full flex md:flex-col lg:flex-row-reverse">
          {/* Image Section */}
          <div className="relative overflow-hidden md:w-full md:h-[60%] lg:w-[50%] lg:h-full">
            <img 
              src="https://res.cloudinary.com/dfoetpdk9/image/upload/v1761725025/crl6xobnhficpscbj3an.jpg"
              alt="Nature exploration"
              className="w-full h-full object-cover block"
              onError={(e) => {
                e.target.src = 'https://picsum.photos/800/600?random=nature'
                e.target.onerror = null
              }}
            />
          </div>
          
          {/* Text Section Below Image */}
          <div className="flex flex-col justify-center items-center p-8 sm:p-16 relative 
          md:w-full md:h-[40%] lg:w-[50%] lg:h-full" style={{ backgroundColor: '#000000' }}>
            <h1 className="font-['Playfair_Display'] text-[clamp(2.5rem,6vw,4rem)] font-normal text-[#F5F5DC] mb-6 tracking-tight leading-[1.1] text-center">
              Travel Beyond Tours
            </h1>
            <p className="font-['Playfair_Display'] text-lg font-normal text-[#F5F5DC] leading-[1.6] max-w-[600px] opacity-90 text-center">
              At Travel Beyond Tours, we believe that Nature and Art are deeply intertwined. They are both valuable, fragile and essential for human beings.
            </p>
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-60">
              <svg viewBox="0 0 200 100" className="w-[120px] h-[60px]">
                <path d="M20 80 Q30 70 40 75 Q50 80 60 75 Q70 70 80 75 Q90 80 100 75 Q110 70 120 75 Q130 80 140 75 Q150 70 160 75 Q170 80 180 75" 
                      fill="none" stroke="#8B7355" strokeWidth="2"/>
                <circle cx="35" cy="72" r="3" fill="#8B7355"/>
                <circle cx="65" cy="72" r="3" fill="#8B7355"/>
                <circle cx="95" cy="72" r="3" fill="#8B7355"/>
              </svg>
            </div>
          </div>
        </div>
      </section>
      
      <div className="py-8 sm:py-12 lg:py-16" style={{ backgroundColor: '#ffe020' }}>
        <div className="text-center mb-8 sm:mb-12 lg:mb-16 px-4 sm:px-8">
          <h2 className="font-['Playfair_Display'] text-[clamp(2rem,4vw,3.5rem)] font-normal text-[#333] mb-3 sm:mb-4 tracking-tight leading-[1.2]">
            Travel Beyond Stories
          </h2>
          <p className="font-['Inter'] text-base sm:text-lg font-normal text-[#666] max-w-[600px] mx-auto leading-[1.6]">
            Discover the world through our immersive experiences
          </p>
        </div>
        
        <div className="max-w-[1300px] mx-auto px-4 sm:px-6 flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8">
          {loading && (
            <div className="w-full flex justify-center items-center py-12 sm:py-16">
              <LoadingSpinner />
            </div>
          )}
          {error && (
            <div className="w-full text-center font-['Inter'] text-sm text-red-600 py-6 sm:py-8">{error}</div>
          )}
          {!loading && !error && blogPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </div>

      {/* Menu Component */}
      <Menu isOpen={isMenuOpen} onClose={closeMenu} />
      <Footer/>
    </div>
  )
}

export default HomepageBlogPage

