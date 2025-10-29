import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import TravelSection from '../../components/homepage/TravelSection'
import SustainabilitySection from '../../components/homepage/SustainabilitySection'
import StoriesSection from '../../components/homepage/StoriesSection'
import InstagramSection from '../../components/homepage/InstagramSection'
import Footer from '../../components/homepage/Footer'
import Menu from '../../components/homepage/Menu'

function Homepage() {
  const [isMuted, setIsMuted] = useState(true)
  const [currentHorizontalSection, setCurrentHorizontalSection] = useState(0)
  const [isHorizontalMode, setIsHorizontalMode] = useState(false)
  const [showVideoScroll, setShowVideoScroll] = useState(false)
  const [showTestScroll, setShowTestScroll] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isFirstHorizontalEntry, setIsFirstHorizontalEntry] = useState(true)
  const [featuredTours, setFeaturedTours] = useState([])
  const [toursLoading, setToursLoading] = useState(true)
  const [toursError, setToursError] = useState(null)
  const [isSecondMuted, setIsSecondMuted] = useState(true)
  const transitioningRef = useRef(false)
  const videoRef = useRef(null)
  const secondVideoRef = useRef(null)
  const horizontalContainerRef = useRef(null)
  const contentSectionRef = useRef(null)
  const galleryContainerRef = useRef(null)
  const lastGalleryItemRef = useRef(null)
  const videoScrollRef = useRef(null)
  // Utility: temporarily lock body scroll to avoid stuck state during transitions
  const lockScrollTemporarily = (durationMs) => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const unlock = () => {
      document.body.style.overflow = previousOverflow || ''
    }
    setTimeout(unlock, durationMs)
    return unlock
  }
  // Ensure page always loads from top
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [])

  const touchStartRef = useRef({ x: 0, y: 0 })

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted
      setIsMuted(videoRef.current.muted)
    }
  }

  const toggleSecondMute = () => {
    if (secondVideoRef.current) {
      secondVideoRef.current.muted = !secondVideoRef.current.muted
      setIsSecondMuted(secondVideoRef.current.muted)
    }
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  useEffect(() => {
    let rafId = null
    const handleScroll = () => {
      if (isTransitioning || transitioningRef.current) return
      if (rafId) return
      rafId = requestAnimationFrame(() => {
        rafId = null
      })
      if (contentSectionRef.current) {
        const rect = contentSectionRef.current.getBoundingClientRect()
        const shouldEnter = rect.top <= 0 && rect.bottom > 0
        const contentTop = rect.top + window.scrollY
        const videoTop = videoScrollRef.current ? videoScrollRef.current.getBoundingClientRect().top + window.scrollY : Number.POSITIVE_INFINITY

        if (shouldEnter && !isHorizontalMode) {
          // Enter horizontal mode
          setIsHorizontalMode(true)
          setCurrentHorizontalSection(1)
          // Only reset to left on first entry (scrolling down)
          if (isFirstHorizontalEntry && galleryContainerRef.current) {
            galleryContainerRef.current.scrollLeft = 0
            setIsFirstHorizontalEntry(false)
          }
          // Snap the page so the content section is perfectly aligned
          window.scrollTo({ top: Math.max(0, contentTop), behavior: 'auto' })
        } else if (!shouldEnter && isHorizontalMode) {
          // Exit horizontal mode
          setIsHorizontalMode(false)
          setCurrentHorizontalSection(0)
          setIsFirstHorizontalEntry(true)
        } else if (!isHorizontalMode) {
          // Re-enter horizontal when scrolling up
          const y = window.scrollY
          if (y <= videoTop + 50 && y >= contentTop - 50) {
            setIsHorizontalMode(true)
            setCurrentHorizontalSection(1)
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [isHorizontalMode, isFirstHorizontalEntry, isTransitioning])

  useEffect(() => {
    const handleWheel = (e) => {
      // console.log('handleWheel', e)
      if (isTransitioning || transitioningRef.current) return

      // Scrolling down (right) in horizontal mode
      if (isHorizontalMode && e.deltaY > 0) {
        e.preventDefault()

        if (currentHorizontalSection === 0) {
          // Move to gallery section
          setCurrentHorizontalSection(1)
        } else if (currentHorizontalSection === 1) {
          const galleryContainer = galleryContainerRef.current
          if (galleryContainer) {
            const canScrollRight = galleryContainer.scrollLeft + galleryContainer.clientWidth < galleryContainer.scrollWidth

            if (canScrollRight) {
              // Scroll gallery right smoothly with a guarded transition
              const remainingRight = galleryContainer.scrollWidth - (galleryContainer.scrollLeft + galleryContainer.clientWidth)
              const step = Math.max(1, Math.min(remainingRight, Math.round(galleryContainer.clientWidth * 0.9)))
              transitioningRef.current = true
              setIsTransitioning(true)
              galleryContainer.scrollBy({ left: step, behavior: 'smooth' })
              setTimeout(() => {
                transitioningRef.current = false
                setIsTransitioning(false)
              }, 450)
            } else {
              // Gallery complete, exit horizontal mode
              transitioningRef.current = true
              setIsTransitioning(true)
              setIsHorizontalMode(false)
              setCurrentHorizontalSection(0)
              setIsFirstHorizontalEntry(true)

              const unlock = lockScrollTemporarily(500)
              requestAnimationFrame(() => {
                const section = document.querySelector('.video-scroll-section')
                if (section) {
                  const y = section.getBoundingClientRect().top + window.scrollY
                  window.scrollTo({ top: y + 1, behavior: 'auto' })
                }
                setTimeout(() => {
                  unlock()
                  transitioningRef.current = false
                  setIsTransitioning(false)
                }, 400)
              })
            }
          }
        }
      }
      // Scrolling up (left) in horizontal mode
      else if (isHorizontalMode && e.deltaY < 0) {
        e.preventDefault()

        if (currentHorizontalSection === 1) {
          const galleryContainer = galleryContainerRef.current
          if (galleryContainer) {
            const canScrollLeft = galleryContainer.scrollLeft > 0

            if (canScrollLeft) {
              // Scroll gallery left smoothly with a guarded transition
              const step = Math.max(1, Math.min(galleryContainer.scrollLeft, Math.round(galleryContainer.clientWidth * 0.9)))
              transitioningRef.current = true
              setIsTransitioning(true)
              galleryContainer.scrollBy({ left: -step, behavior: 'smooth' })
              setTimeout(() => {
                transitioningRef.current = false
                setIsTransitioning(false)
              }, 450)
            } else {
              // Back to content section
              setCurrentHorizontalSection(0)
            }
          }
        } else if (currentHorizontalSection === 0) {
          // Exit horizontal mode
          setIsHorizontalMode(false)
          setCurrentHorizontalSection(0)
          setIsFirstHorizontalEntry(true)
        }
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [isHorizontalMode, currentHorizontalSection, isTransitioning, isFirstHorizontalEntry])

  useEffect(() => {
    console.log('isHorizontalMode', isHorizontalMode)
    if (horizontalContainerRef.current && isHorizontalMode) {
      horizontalContainerRef.current.style.transform = `translate3d(-${currentHorizontalSection * 100}vw, 0, 0)`
    }
  }, [currentHorizontalSection, isHorizontalMode])


  useEffect(() => {
    // Keep default body scrolling behavior; only optimize transform usage
    if (horizontalContainerRef.current) {
      horizontalContainerRef.current.style.willChange = isHorizontalMode ? 'transform' : 'auto'
    }
  }, [isHorizontalMode])

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

  // Fetch all tours and filter for featured ones
  useEffect(() => {
    const controller = new AbortController()
    const fetchFeaturedTours = async () => {
      try {
        setToursLoading(true)
        setToursError(null)
        const API_BASE = (import.meta && import.meta.env && import.meta.env.VITE_API_BASE_URL) || 'https://travel-backend-psi.vercel.app'
        const res = await fetch(`${API_BASE}/tours`, { signal: controller.signal })
        if (!res.ok) throw new Error(`Failed to load tours (${res.status})`)
        const json = await res.json()
        const allTours = (json && json.data && json.data.tours) || []
        // Filter for featured tours on the frontend
        const featured = allTours.filter(tour => tour.featured === true)
        setFeaturedTours(featured)
      } catch (e) {
        if (e && e.name === 'AbortError') return
        setToursError(e?.message || 'Failed to load tours')
      } finally {
        setToursLoading(false)
      }
    }
    fetchFeaturedTours()
    return () => controller.abort()
  }, [])

  useEffect(() => {
    const el = contentSectionRef.current
    if (!el) return

    const onTouchStart = (e) => {
      if (!isHorizontalMode) return
      const t = e.touches[0]
      touchStartRef.current = { x: t.clientX, y: t.clientY }
    }

    const onTouchMove = (e) => {
      if (!isHorizontalMode) return
      const t = e.touches[0]
      const dx = t.clientX - touchStartRef.current.x
      const dy = t.clientY - touchStartRef.current.y
      e.preventDefault()
      if (currentHorizontalSection === 0 && dy < -5) {
        setCurrentHorizontalSection(1)
        return
      }
      if (currentHorizontalSection === 1 && galleryContainerRef.current) {
        galleryContainerRef.current.scrollLeft -= dx
        touchStartRef.current.x = t.clientX
        const gc = galleryContainerRef.current
        const atEnd = gc.scrollLeft + gc.clientWidth >= gc.scrollWidth - 2
        if (atEnd && dx < -8) {
          setIsHorizontalMode(false)
          setCurrentHorizontalSection(0)
        }
      }
    }

    el.addEventListener('touchstart', onTouchStart, { passive: false })
    el.addEventListener('touchmove', onTouchMove, { passive: false })
    return () => {
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove)
    }
  }, [isHorizontalMode, currentHorizontalSection])

  // useEffect(() => {
  //   const onKeyDown = (e) => {
  //     if (!isHorizontalMode) return
  //     const forwardKeys = ['ArrowDown', 'PageDown', ' ', 'Spacebar']
  //     const backKeys = ['ArrowUp', 'PageUp']
  //     if (forwardKeys.includes(e.key)) {
  //       e.preventDefault()
  //       if (currentHorizontalSection === 0) {
  //         setCurrentHorizontalSection(1)
  //       } else if (currentHorizontalSection === 1 && galleryContainerRef.current) {
  //         const gc = galleryContainerRef.current
  //         const canScrollRight = gc.scrollLeft + gc.clientWidth < gc.scrollWidth
  //         if (canScrollRight) {
  //           gc.scrollTo({ left: gc.scrollLeft + window.innerWidth, behavior: 'smooth' })
  //         } else {
  //           setIsHorizontalMode(false)
  //           setCurrentHorizontalSection(0)
  //         }
  //       }
  //     } else if (backKeys.includes(e.key)) {
  //       e.preventDefault()
  //       if (currentHorizontalSection === 1 && galleryContainerRef.current) {
  //         const gc = galleryContainerRef.current
  //         if (gc.scrollLeft > 0) {
  //           gc.scrollTo({ left: Math.max(0, gc.scrollLeft - window.innerWidth), behavior: 'smooth' })
  //         } else {
  //           setCurrentHorizontalSection(0)
  //         }
  //       } else if (currentHorizontalSection === 0) {
  //         setIsHorizontalMode(false)
  //       }
  //     }
  //   }
  //   window.addEventListener('keydown', onKeyDown, { passive: false })
  //   return () => window.removeEventListener('keydown', onKeyDown)
  // }, [isHorizontalMode, currentHorizontalSection])

  const repsonsive = `
 
  @media (max-width: 500px) {
   .horizontal-scroll-section{
    display: none;
  }
  }`

  return (
   
    <>
     <style>{repsonsive}</style>
    <div className="w-full font-sans">
      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 z-[1000] p-4 sm:p-6 lg:p-8 px-4 sm:px-8 lg:px-12 flex items-center justify-between bg-transparent">
        <div className="flex items-center gap-3 sm:gap-6">
          <button className="flex items-center gap-2 sm:gap-3 bg-none border-none text-white font-sans text-xs sm:text-sm font-normal tracking-wider cursor-pointer transition-opacity duration-300 hover:opacity-80" onClick={toggleMenu}>
            <span className="flex flex-col gap-[2px] sm:gap-[3px]">
              <span className="w-[16px] sm:w-[18px] h-[2px] bg-white transition-all duration-300"></span>
              <span className="w-[16px] sm:w-[18px] h-[2px] bg-white transition-all duration-300"></span>
              <span className="w-[16px] sm:w-[18px] h-[2px] bg-white transition-all duration-300"></span>
            </span>
            <span className="hidden sm:inline">MENU</span>
          </button>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 mt-2 sm:mt-3 lg:mt-4">
          <img
            src="/Logo.webp"
            alt="Awasi Logo"
            className="mt-2 h-16 w-40 sm:mt-3 sm:h-20 sm:w-48 lg:mt-4 lg:h-24 lg:w-56"
          />
        </div>

      </nav>

      {/* Hero Section */}
      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            muted={isMuted}
            loop
            playsInline
            className="w-full h-full object-cover"
            style={{ pointerEvents: 'none', touchAction: 'pan-y' }}
          >
            <source src="https://res.cloudinary.com/dfoetpdk9/video/upload/v1761721559/ybos0cfk9pfor4mzj4oz.mp4" type='video/mp4' />
            Your browser does not support the video tag.
          </video>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/20 via-black/40 to-black/30 z-[1]"></div>
        </div>

        <div className="relative z-[2] text-center p-4 sm:p-6 lg:p-8">
          <h1 className="font-['Playfair_Display'] text-[clamp(2rem,8vw,4.5rem)] font-normal text-white tracking-tight leading-[1.1] shadow-[0_2px_20px_rgba(0,0,0,0.3)] px-4">
            <span className="!text-[#00c3a1]">The Journey Begins Here</span>
          </h1>
        </div>

        <button className="absolute bottom-4 sm:bottom-6 lg:bottom-8 left-1/2 -translate-x-1/2 z-[3] bg-white/10 border border-white/20 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-white cursor-pointer transition-all duration-300 backdrop-blur-[10px] hover:bg-white/20 hover:border-white/40 hover:scale-110" onClick={toggleMute}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
            <path d="M11 5L6 9H2V15H6L11 19V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M19.07 4.93C20.9441 6.8041 21.9999 9.34784 21.9999 12C21.9999 14.6522 20.9441 17.1959 19.07 19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M15.54 8.46C16.4774 9.39764 17.0039 10.6692 17.0039 12C17.0039 13.3308 16.4774 14.6024 15.54 15.54" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            {isMuted && <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}
          </svg>
        </button>
      </section>

      {/* Content Section - This triggers horizontal scrolling */}
      <section className="horizontal-scroll-section w-full h-screen overflow-hidden relative"
        ref={contentSectionRef}>
        <div
          className="flex w-[200vw] h-full transition-transform duration-[400ms]
           ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
          ref={horizontalContainerRef}
          style={{ willChange: 'transform', backfaceVisibility: 'hidden', transform: 'translateZ(0)' }}
        >
          {/* Horizontal Section 1: Content */}
          <div className="w-screen h-full flex-shrink-0 relative">
            <div className="w-full max-w-[1400px] mx-auto flex  gap-0 min-h-screen">
              <div className="flex items-center justify-start p-8 sm:p-12 lg:p-16 lg:pl-24" style={{ backgroundColor: '#ffe020' }}>
                <div className="max-w-[480px] text-left">
                  <h2 className="font-['Playfair_Display'] text-[clamp(2rem,4vw,3rem)] font-normal text-black tracking-tight leading-[1.2] mb-8">
                    Where Time and Space are Yours to Own
                  </h2>
                  <p className="font-['Inter'] text-lg font-normal text-[#555] leading-[1.6] tracking-[0.01em]">
                    At Awasi, our lodges are designed to feel like the home of an old friend, guiding you through stunning landscapes, native flavors and hidden gems. It's a fusion of friendship, admiration for the place, and personal hospitality that creates a genuine connection with each guest.
                  </p>
                </div>
              </div>
              <div className="flex-1 relative overflow-hidden">
                <img
                  src="https://res.cloudinary.com/dfoetpdk9/image/upload/v1761722827/s3vzbvdng1okdyqee3os.jpg"
                  alt="Awasi Santa Catarina"
                  className="w-full h-full object-cover block"
                />
              </div>
            </div>
          </div>

          {/* Horizontal Section 2: Gallery */}
          <div className="w-screen h-full flex-shrink-0 relative">
            <div className="w-full h-full overflow-hidden relative flex items-center justify-center" style={{ backgroundColor: '#ffe020' }}>
              <div
                className="w-full max-w-[1400px] h-[80%] overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory scrollbar-hide"
                ref={galleryContainerRef}
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', willChange: 'scroll-position', backfaceVisibility: 'hidden', transform: 'translateZ(0)' }}
              >
                <div className="flex h-[100vh] w-[500%] gap-4" style={{ willChange: 'transform', backfaceVisibility: 'hidden', transform: 'translateZ(0)' }}>
                  {/* Single large image on the left
                  <div className="flex-[0_0_20%] h-full relative overflow-hidden snap-start">
                    <img 
                      src="/images/Patagonia (9).jpeg"
                      alt="Awasi Gallery 1"
                      className="w-full h-full object-cover block"
                    />
                  </div> */}

                  {/* Two images in one column */}
                  <div className="flex-[0_0_20%] h-full relative overflow-hidden snap-start">
                    <div className="h-full flex flex-col gap-2">
                      <div className="flex-1 relative overflow-hidden">
                        <img
                          src="https://res.cloudinary.com/dfoetpdk9/image/upload/v1761724771/dk0fqvngscin7fpvbz0b.jpg"
                          alt="Awasi Gallery 2"
                          className="w-full h-full object-cover block"
                        />
                      </div>
                      <div className="flex-1 relative overflow-hidden">
                        <img
                          src="https://res.cloudinary.com/dfoetpdk9/image/upload/v1761724712/axco7ftdtjlcjgs5tliv.jpg"
                          alt="Awasi Gallery 3"
                          className="w-full h-full object-cover block"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Another single large image */}
                  <div className="flex-[0_0_20%] h-full relative overflow-hidden snap-start">
                    <img
                      src="https://res.cloudinary.com/dfoetpdk9/image/upload/v1761724741/sww6q29og65cato6noy3.jpg"
                      alt="Awasi Mendoza"
                      className="w-full h-full object-cover block"
                    />
                  </div>

                  {/* Another two images in one column */}
                  <div className="flex-[0_0_20%] h-full relative overflow-hidden snap-start">
                    <div className="h-full flex flex-col gap-2">
                      <div className="flex-1 relative overflow-hidden">
                        <img
                          src="https://res.cloudinary.com/dfoetpdk9/image/upload/v1761724771/dk0fqvngscin7fpvbz0b.jpg"
                          alt="Awasi Gallery 4"
                          className="w-full h-full object-cover block"
                        />
                      </div>
                      <div className="flex-1 relative overflow-hidden">
                        <img
                          src="https://res.cloudinary.com/dfoetpdk9/image/upload/v1761724793/uayx5dok0ielwgeiiuhu.jpg"
                          alt="Awasi Gallery 5"
                          className="w-full h-full object-cover block"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Final single large image */}
                  <div className="flex-[0_0_20%] h-full relative overflow-hidden snap-start" ref={lastGalleryItemRef}>
                    <img
                      src="https://res.cloudinary.com/dfoetpdk9/image/upload/v1761724821/kljoyritil16oyufepjg.jpg"
                      alt="Awasi Gallery 6"
                      className="w-full h-full object-cover block"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Video Scroll Section - Below the hero and horizontal sections */}
      <section ref={videoScrollRef} className="video-scroll-section w-full h-auto relative overflow-visible bg-transparent" style={{ overscrollBehavior: 'contain' }}>
        <div className="relative w-full h-auto overflow-visible">
          <video ref={secondVideoRef} className="w-full h-auto object-cover" autoPlay muted playsInline loop style={{ pointerEvents: 'none', touchAction: 'pan-y' }}>
            <source src="https://res.cloudinary.com/dfoetpdk9/video/upload/v1761721702/brtzvr2lxjnh49k74bhj.mp4" type='video/mp4' />
            Your browser does not support the video tag.
          </video>
        </div>

        <button className="absolute bottom-4 sm:bottom-6 lg:bottom-8 left-1/2 -translate-x-1/2 z-[3] bg-white/10 border border-white/20 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-white cursor-pointer transition-all duration-300 backdrop-blur-[10px] hover:bg-white/20 hover:border-white/40 hover:scale-110" onClick={toggleSecondMute}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
            <path d="M11 5L6 9H2V15H6L11 19V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M19.07 4.93C20.9441 6.8041 21.9999 9.34784 21.9999 12C21.9999 14.6522 20.9441 17.1959 19.07 19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M15.54 8.46C16.4774 9.39764 17.0039 10.6692 17.0039 12C17.0039 13.3308 16.4774 14.6024 15.54 15.54" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            {isSecondMuted && <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}
          </svg>
        </button>
      </section>

      {/* Bottom Section */}
      <section className="w-full relative" style={{ backgroundColor: '#ffe020' }}>
        <div className="w-full min-h-[60vh] flex items-center justify-center py-8 sm:py-12 lg:py-16">
          <div className="w-full max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 px-4 sm:px-8 lg:px-12">
            <div className="flex flex-col justify-center text-center lg:text-left">
              <h2 className="font-['Playfair_Display'] text-[clamp(2rem,5vw,4rem)] font-normal text-black tracking-tight leading-[1.1] m-0 mb-2">
                A Meaningful Exploration
              </h2>
              <h2 className="font-['Playfair_Display'] text-[clamp(2rem,5vw,4rem)] font-normal text-black tracking-tight leading-[1.1] m-0">
                Centered Around You
              </h2>
            </div>
            <div className="flex items-center justify-center lg:justify-start">
              <p className="font-['Inter'] text-base sm:text-lg font-normal text-[#555] leading-[1.6] tracking-[0.01em] m-0 max-w-[480px] text-center lg:text-left">
                At Awasi, every stay is fully tailor-made. Each room is assigned a private guide and a 4x4 vehicle, allowing guests the freedom to explore at their own pace and according to their individual interests and rhythms. Our personalized approach ensures immersive, flexible experiences designed to connect you with the essence of each unique location.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tour Packages Section */}
      <section className="w-full py-8 sm:py-12 lg:py-16" style={{ backgroundColor: '#00c3a1' }}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="text-center mb-8 sm:mb-10 lg:mb-12">
            <h2 className="font-['Playfair_Display'] text-[clamp(2rem,5vw,3.5rem)] font-normal text-black tracking-tight leading-[1.2] mb-4 px-4">
              Discover Our Destinations
            </h2>
            <p className="font-['Inter'] text-base sm:text-lg font-normal text-[#666] leading-[1.6] max-w-[600px] mx-auto px-4">
              Experience the world's most extraordinary places with our carefully curated collection of luxury lodges
            </p>
          </div>

          <div className="relative flex items-center gap-4 sm:gap-6 lg:gap-8">
            <button className="rounded-full w-12 h-12 flex items-center justify-center cursor-pointer transition-all duration-300 text-black flex-shrink-0 z-10 hover:scale-105" aria-label="Previous destinations" style={{ backgroundColor: '#ffe020', borderColor: '#ffe020', borderWidth: '1px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <div className="flex gap-4 sm:gap-6 lg:gap-8 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide flex-1 px-2 sm:px-4">
              {toursLoading && (
                <div className="flex-[0_0_280px] sm:flex-[0_0_320px] flex items-center justify-center text-[#666] font-['Inter']">
                  Loading destinations...
                </div>
              )}
              {toursError && (
                <div className="flex-[0_0_280px] sm:flex-[0_0_320px] flex items-center justify-center text-red-600 font-['Inter']">
                  {toursError}
                </div>
              )}
              {!toursLoading && !toursError && featuredTours.length === 0 && (
                <div className="flex-[0_0_280px] sm:flex-[0_0_320px] flex items-center justify-center text-[#666] font-['Inter']">
                  No featured destinations available
                </div>
              )}
              {!toursLoading && !toursError && featuredTours.map((tour) => (
                <div key={tour._id} className="flex-[0_0_280px] sm:flex-[0_0_320px] rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-all duration-300 snap-start hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)]" style={{ backgroundColor: '#ffe020' }}>
                  <div className="relative h-60 overflow-hidden">
                    <img
                      src={tour.image || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop'}
                      alt={tour.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute top-4 right-4 bg-secondary-600 text-white py-2 px-4 rounded-[20px] font-['Inter'] text-xs font-semibold tracking-wider uppercase">
                      {tour.location}
                    </div>
                  </div>
                  <div className="p-4 sm:p-6">
                    <h3 className="font-['Playfair_Display'] text-xl sm:text-2xl font-normal text-black mb-3 sm:mb-4 leading-[1.3]">
                      {tour.title}
                    </h3>
                    <div className="flex flex-col gap-3">
                      <Link to={`/tour/${tour._id}`} className="font-['Inter'] text-sm font-medium text-secondary-600 no-underline uppercase tracking-wider transition-colors duration-300 border-b border-transparent pb-[2px] inline-block w-fit hover:text-secondary-700 hover:border-secondary-700">
                        VIEW TOUR DETAILS
                      </Link>
                      <Link to={`/tour/${tour._id}`} className="font-['Inter'] text-sm font-medium text-primary-600 no-underline uppercase tracking-wider transition-colors duration-300 border-b border-transparent pb-[2px] inline-block w-fit hover:text-primary-700 hover:border-primary-700">
                        BOOK THIS TOUR
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button className="rounded-full w-12 h-12 flex items-center justify-center cursor-pointer transition-all duration-300 text-black flex-shrink-0 z-10 hover:scale-105" aria-label="Next destinations" style={{ backgroundColor: '#ffe020', borderColor: '#ffe020', borderWidth: '1px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Travel Section */}
      <TravelSection />

      {/* Sustainability Section */}
      <SustainabilitySection />

      {/* Stories Section */}
      <StoriesSection />

      {/* Instagram Section */}
      <InstagramSection />

      {/* Footer */}
      <Footer />

      {/* Section Indicators - Only show in horizontal mode */}
      {isHorizontalMode && (
        <div className="fixed right-8 top-1/2 -translate-y-1/2 z-[1000] flex flex-col gap-4">
          <div
            className={`w-3 h-3 rounded-full bg-white/30 cursor-pointer transition-all duration-300 border-2 border-white/50 ${currentHorizontalSection === 0 ? 'bg-white scale-[1.2]' : 'hover:bg-white/60 hover:scale-110'}`}
            onClick={() => setCurrentHorizontalSection(0)}
          ></div>
          <div
            className={`w-3 h-3 rounded-full bg-white/30 cursor-pointer transition-all duration-300 border-2 border-white/50 ${currentHorizontalSection === 1 ? 'bg-white scale-[1.2]' : 'hover:bg-white/60 hover:scale-110'}`}
            onClick={() => setCurrentHorizontalSection(1)}
          ></div>
        </div>
      )}

      {/* Menu Component */}
      <Menu isOpen={isMenuOpen} onClose={closeMenu} />
    </div>
    </>
  )
}

export default Homepage

