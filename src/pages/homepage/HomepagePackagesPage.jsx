import { useState, useEffect } from 'react'
import PackageCard from '../../components/homepage/PackageCard'
import Menu from '../../components/homepage/Menu'
import Footer from '../../components/homepage/Footer'
import LoadingSpinner from '../../components/LoadingSpinner'
import { Link } from 'react-router-dom'
import LanguageSelector from '../../components/LanguageSelector'
import { useLanguage } from '../../contexts/LanguageContext'
import { API_BASE } from '../../config/api'
import LoadingOverlay from '../../components/LoadingOverlay'

const HomepagePackagesPage = () => {
  const { t, language } = useLanguage()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  // Debug: Log language changes
  useEffect(() => {
    console.log('🔵 [HomepagePackagesPage] Language changed to:', language)
  }, [language])

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

  // Fetch tours using same logic as PackagesPage.tsx - refetch when language changes
  useEffect(() => {
    const controller = new AbortController()
    const load = async () => {
      try {
        setLoading(true)
        setError(null)
        const url = `${API_BASE}/tours?lang=${language}`
        console.log('🌐 [HomepagePackagesPage] Fetching tours with URL:', url, 'Current language:', language)
        const res = await fetch(url, { signal: controller.signal })
        if (!res.ok) throw new Error(`Failed to load tours (${res.status})`)
        const json = await res.json()
        console.log('📥 [HomepagePackagesPage] Received tours data:', json?.data?.tours?.length, 'tours')
        if (json?.data?.tours?.length > 0) {
          const firstTour = json.data.tours[0]
          console.log('📋 [HomepagePackagesPage] First tour FULL DATA:', JSON.stringify(firstTour, null, 2))
          console.log('📋 [HomepagePackagesPage] First tour title:', firstTour.title)
          console.log('📋 [HomepagePackagesPage] First tour description:', firstTour.description?.substring(0, 50))
          // Check if Spanish fields are still in the response (should be removed by backend)
          if (firstTour.title_es) {
            console.log('⚠️ [HomepagePackagesPage] WARNING: title_es still present in response! Backend not transforming.')
          }
        }
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
  }, [language])

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: '#ffe020' }}>
      <LoadingOverlay show={loading} label={t('Loading blogs...')} />
      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 z-[1000] py-6 md:py-8 lg:py-10 px-6 md:px-12 lg:px-16 flex items-center justify-between" style={{ backgroundColor: '#ffe020' }}>
        <div className="flex items-center gap-6">
          <button 
            className="flex items-center gap-3 bg-none border-none text-black font-sans text-sm font-normal tracking-wider cursor-pointer transition-opacity duration-300 hover:opacity-80" 
            onClick={toggleMenu}
          >
            <span className="flex flex-col gap-[3px]">
              <span className="w-[18px] h-[2px] bg-black transition-all duration-300"></span>
              <span className="w-[18px] h-[2px] bg-black transition-all duration-300"></span>
              <span className="w-[18px] h-[2px] bg-black transition-all duration-300"></span>
            </span>
            {t('Menu')}
          </button>
        </div>
        <div className="absolute left-1/2 -translate-x-1/2">
          <img 
            src="/Logo.webp"
            alt="Awasi Logo"
            className="mt-1 h-11 w-auto sm:h-14 md:h-18 lg:h-22"
          />
        </div>
        
        <div className="flex items-center gap-4">{!isMenuOpen && <LanguageSelector />}</div>
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
              {t('Travel Beyond Tours')}
            </h1>
            <p className="font-['Playfair_Display'] text-lg font-normal text-[#F5F5DC] leading-[1.6] max-w-[600px] opacity-90 text-center">
              {t('Homepage Packages Hero Sub')}
            </p>
          </div>
        </div>
      </section>
      
      <div className="py-8 sm:py-12 lg:py-16" style={{ backgroundColor: '#ffe020' }}>
        <div className="text-center mb-8 sm:mb-12 lg:mb-16 px-4 sm:px-8">
          <h2 className="font-['Playfair_Display'] text-[clamp(2rem,4vw,3.5rem)] font-normal text-black mb-3 sm:mb-4 tracking-tight leading-[1.2]">
            {t('Choose Your Journey')}
          </h2>
          <p className="font-['Inter'] text-base sm:text-lg font-normal text-[#666] max-w-[600px] mx-auto leading-[1.6]">
            {t('Location, inclusions and nightly price at a glance')}
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
