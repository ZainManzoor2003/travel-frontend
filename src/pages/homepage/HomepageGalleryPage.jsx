import { useEffect, useState } from 'react'
import Menu from '../../components/homepage/Menu'
import Footer from '../../components/homepage/Footer'
import { Link } from 'react-router-dom'
import LanguageSelector from '../../components/LanguageSelector'
import { useLanguage } from '../../contexts/LanguageContext'

const HomepageGalleryPage = () => {
  const { t } = useLanguage()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [galleryItems, setGalleryItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const closeMenu = () => setIsMenuOpen(false)

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isMenuOpen])

  useEffect(() => {
    const controller = new AbortController()
    const load = async () => {
      try {
        setLoading(true)
        setError(null)
        const API_BASE = (import.meta && import.meta.env && import.meta.env.VITE_API_BASE_URL) || 'https://travel-backend-psi.vercel.app'
        const galleryRes = await fetch(`${API_BASE}/gallery?status=active`, { signal: controller.signal })
        if (!galleryRes.ok) throw new Error(`Failed to load gallery (${galleryRes.status})`)
        const galleryJson = await galleryRes.json()
        const list = (galleryJson && galleryJson.data && galleryJson.data.galleryItems) || []
        const ui = list.map((item, index) => ({
          id: item._id,
          src: item.imageUrl,
          alt: item.alt || item.title || 'Gallery image',
          title: item.title,
          category: item.category,
          aspect: index % 3 === 0 ? 'wide' : index % 3 === 1 ? 'tall' : 'square'
        }))
        setGalleryItems(ui)
      } catch (e) {
        if (e && e.name === 'AbortError') return
        setError(e?.message || 'Failed to load gallery')
      } finally {
        setLoading(false)
      }
    }
    load()
    return () => controller.abort()
  }, [])

  return (
    <div className="w-full min-h-screen" style={{ backgroundColor: '#ffe020' }}>
      {/** Helper accessors to prefer gallery items over placeholders */}
      {(() => null)()}
      {/* Convenience helpers */}
      {/** We cannot define functions inside JSX easily; use variables */}
      {/** Indices mapping: 0 hero, 1 waterfall, 2-3 first split, 4-5 second split, 6-8 three-row, 9 repeat, 10-11 final split */}
      {/** Using inline ternaries for src/alt picks */}
      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 z-[1000] p-8 px-12 flex items-center justify-between bg-transparent">
        <div className="flex items-center gap-6">
          <button 
            className="flex items-center gap-3 bg-none border-none text-white font-sans text-sm tracking-wider cursor-pointer transition-opacity duration-300 hover:opacity-80"
            onClick={toggleMenu}
          >
            <span className="flex flex-col gap-[3px]">
              <span className="w-[18px] h-[2px] bg-white" />
              <span className="w-[18px] h-[2px] bg-white" />
              <span className="w-[18px] h-[2px] bg-white" />
            </span>
            {t('Menu')}
          </button>
          <div className="w-px h-5 bg-white/30" />
        </div>
        <div className="absolute left-1/2 -translate-x-1/2">
          <img 
            src="/Logo.webp"
            alt="Awasi Logo"
            className="mt-2 h-24 w-56"
          />
        </div>
        <div className="flex items-center gap-4">{!isMenuOpen && <LanguageSelector />}</div>
      </nav>

      {/* Full Width Hero Image with overlay text - gallery[0] */}
      {galleryItems[0] && (
        <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
          <img
            src={galleryItems[0].src}
            alt={galleryItems[0].alt}
            className="absolute inset-0 w-full h-full object-cover z-[1]"
          />
          <div className="relative z-[2] text-center p-8 max-w-[800px]">
            <h1 className="font-['Playfair_Display'] text-[clamp(2rem,5vw,4rem)] font-normal text-white leading-[1.2] drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)] m-0">
              {t('Discover Timeless Landscapes')}
            </h1>
          </div>
        </section>
      )}

      {/* Full Width Waterfall Section - gallery[1] */}
      {galleryItems[1] && (
        <section className="relative w-full h-screen overflow-hidden">
          <img
            src={galleryItems[1].src}
            alt={galleryItems[1].alt}
            className="w-full h-full object-cover block"
          />
        </section>
      )}

      {/* Split Section - Two Images (left then right aligned) */}
      {(galleryItems[2] && galleryItems[3]) && (
        <section className="w-full min-h-screen flex items-center py-16" style={{ backgroundColor: '#ffe020' }}>
          <div className="w-full max-w-[1400px] mx-auto grid grid-cols-1 gap-16 items-center justify-items-start px-12">
            {/* gallery[2] */}
            <div className="relative overflow-hidden rounded-lg shadow-[0_8px_25px_rgba(0,0,0,0.1)] justify-self-start w-[70%]">
              <img
                src={galleryItems[2].src}
                alt={galleryItems[2].alt}
                className="w-full h-[600px] object-cover transition-transform duration-300 hover:scale-[1.02]"
              />
            </div>
            {/* gallery[3] */}
            <div className="relative overflow-hidden rounded-lg shadow-[0_8px_25px_rgba(0,0,0,0.1)] justify-self-end ml-auto w-[70%]">
              <img
                src={galleryItems[3].src}
                alt={galleryItems[3].alt}
                className="w-full h-[600px] object-cover transition-transform duration-300 hover:scale-[1.02]"
              />
            </div>
          </div>
        </section>
      )}

      {/* Split Section - Two Images second pair */}
      {(galleryItems[4] && galleryItems[5]) && (
        <section className="w-full min-h-screen flex items-center py-16" style={{ backgroundColor: '#ffe020' }}>
          <div className="w-full max-w-[1400px] mx-auto grid grid-cols-1 gap-16 items-center justify-items-start px-12">
            {/* gallery[4] */}
            <div className="relative overflow-hidden rounded-lg shadow-[0_8px_25px_rgba(0,0,0,0.1)] justify-self-start w-[70%]">
              <img
                src={galleryItems[4].src}
                alt={galleryItems[4].alt}
                className="w-full h-[600px] object-cover transition-transform duration-300 hover:scale-[1.02]"
              />
            </div>
            {/* gallery[5] */}
            <div className="relative overflow-hidden rounded-lg shadow-[0_8px_25px_rgba(0,0,0,0.1)] justify-self-end ml-auto w-[70%]">
              <img
                src={galleryItems[5].src}
                alt={galleryItems[5].alt}
                className="w-full h-[600px] object-cover transition-transform duration-300 hover:scale-[1.02]"
              />
            </div>
          </div>
        </section>
      )}

      {/* Three Images Row */}
      <section className="w-full py-16" style={{ backgroundColor: '#ffe020' }}>
        <div className="max-w-[1400px] mx-auto grid grid-cols-3 gap-8 px-12">
          {loading && (
            <div className="col-span-3 text-center font-['Inter'] text-sm text-[#666]">{t('Loading gallery...')}</div>
          )}
          {error && (
            <div className="col-span-3 text-center font-['Inter'] text-sm text-red-600">{error}</div>
          )}
          {!loading && !error && (galleryItems.slice(6,9).length === 3) && galleryItems.slice(6,9).map((img, idx) => (
            <div key={img.id || idx} className="relative overflow-hidden rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-[500px] object-cover transition-transform duration-300 hover:scale-[1.05]"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Repeat Pattern - Full Width */}
      {/* Repeat Pattern - Full Width - gallery[9] */}
      {galleryItems[9] && (
        <section className="relative w-full h-screen overflow-hidden">
          <img
            src={galleryItems[9].src}
            alt={galleryItems[9].alt}
            className="w-full h-full object-cover block"
          />
        </section>
      )}

      {/* Final Split Section */}
      {(galleryItems[10] && galleryItems[11]) && (
        <section className="w-full min-h-screen flex items-center py-16" style={{ backgroundColor: '#ffe020' }}>
          <div className="w-full max-w-[1400px] mx-auto grid grid-cols-1 gap-16 items-center justify-items-start px-12">
            {/* gallery[10] */}
            <div className="relative overflow-hidden rounded-lg shadow-[0_8px_25px_rgba(0,0,0,0.1)] justify-self-start w-[70%]">
              <img
                src={galleryItems[10].src}
                alt={galleryItems[10].alt}
                className="w-full h-[600px] object-cover transition-transform duration-300 hover:scale-[1.02]"
              />
            </div>
            {/* gallery[11] */}
            <div className="relative overflow-hidden rounded-lg shadow-[0_8px_25px_rgba(0,0,0,0.1)] justify-self-end ml-auto w-[70%]">
              <img
                src={galleryItems[11].src}
                alt={galleryItems[11].alt}
                className="w-full h-[600px] object-cover transition-transform duration-300 hover:scale-[1.02]"
              />
            </div>
          </div>
        </section>
      )}

      <Footer />
      <Menu isOpen={isMenuOpen} onClose={closeMenu} />
    </div>
  )
}

export default HomepageGalleryPage


