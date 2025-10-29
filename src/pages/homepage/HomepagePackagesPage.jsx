import { useState, useEffect } from 'react'
import PackageCard from './components/PackageCard'
import Menu from './components/Menu'
import Footer from './components/Footer'
import LoadingSpinner from '../../components/LoadingSpinner'
import { Link } from 'react-router-dom'

const HomepagePackagesPage = () => {
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

  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch tours using same logic as PackagesPage.tsx
  useEffect(() => {
    const controller = new AbortController()
    const load = async () => {
      try {
        setLoading(true)
        setError(null)
        const API_BASE = (import.meta && import.meta.env && import.meta.env.VITE_API_BASE_URL) || 'https://travel-backend-psi.vercel.app'
        const res = await fetch(`${API_BASE}/tours`, { signal: controller.signal })
        if (!res.ok) throw new Error(`Failed to load tours (${res.status})`)
        const json = await res.json()
        const list = (json && json.data && json.data.tours) || []
        const ui = list.map(t => ({
          id: t._id,
          title: t.title,
          description: t.description,
          price: `$${t.price}`,
          duration: String(t.duration),
          image: t.image,
          rating: Number(t.rating || 0),
          location: t.location,
          category: t.category,
          detailsLink: `/tour/${t._id}`
        }))
        setPackages(ui)
      } catch (e) {
        if (e && e.name === 'AbortError') return
        setError(e?.message || 'Failed to load tours')
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
            src="/logo.webp"
            alt="Awasi Logo"
            className="h-24 w-56 brightness-0 invert"
          />
        </div>
        
      </nav>

      {/* Hero Section */}
      <section className="w-full h-screen flex items-center relative">
      <div className="w-full h-full flex md:flex-col lg:flex-row-reverse">
          {/* Image Section */}
          <div className="relative overflow-hidden md:w-full md:h-[60%] lg:w-[50%] lg:h-full">
            <img 
              src="https://res.cloudinary.com/dfoetpdk9/image/upload/v1761724980/em92hg1426nvgibytt4p.jpg"
              alt="Packages"
              className="w-full h-full object-cover block"
            />
          </div>
          
          {/* Text Section Below Image */}
          <div className="flex flex-col justify-center items-center p-8 sm:p-16 relative 
          md:w-full md:h-[40%] lg:w-[50%] lg:h-full" style={{ backgroundColor: '#000000' }}>
            <h1 className="font-['Playfair_Display'] text-[clamp(2.5rem,6vw,4rem)] font-normal text-[#F5F5DC] mb-6 tracking-tight leading-[1.1] text-center">
              Travel Beyond Tours
            </h1>
            <p className="font-['Playfair_Display'] text-lg font-normal text-[#F5F5DC] leading-[1.6] max-w-[600px] opacity-90 text-center">
              Hand-crafted stays including private guiding, full board, and immersive excursions.
            </p>
          </div>
        </div>
      </section>
      
      <div className="py-8 sm:py-12 lg:py-16" style={{ backgroundColor: '#ffe020' }}>
        <div className="text-center mb-8 sm:mb-12 lg:mb-16 px-4 sm:px-8">
          <h2 className="font-['Playfair_Display'] text-[clamp(2rem,4vw,3.5rem)] font-normal text-black mb-3 sm:mb-4 tracking-tight leading-[1.2]">
            Choose Your Journey
          </h2>
          <p className="font-['Inter'] text-base sm:text-lg font-normal text-[#666] max-w-[600px] mx-auto leading-[1.6]">
            Location, inclusions and nightly price at a glance
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
          {!loading && !error && packages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
      </div>

      {/* Menu Component */}
      <Menu isOpen={isMenuOpen} onClose={closeMenu} />
      <Footer/>
    </div>
  )
}

export default HomepagePackagesPage
