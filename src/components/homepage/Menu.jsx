import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { useAuth } from '../../contexts/AuthContext'
import { useLanguage } from '../../contexts/LanguageContext'

const Menu = ({ isOpen, onClose }) => {
  const { user, isLoggedIn } = useAuth()
  const { t } = useLanguage()
  const menuOverlayRef = useRef(null)
  const menuContainerRef = useRef(null)
  const leftPanelRef = useRef(null)
  const rightPanelRef = useRef(null)
  const menuItemsRef = useRef([])
  const topNavRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      // Opening animation
      const tl = gsap.timeline()
      
      tl.fromTo(
        menuOverlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out' }
      )
      
      tl.fromTo(
        leftPanelRef.current,
        { x: -100, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
        '-=0.1'
      )
      
      tl.fromTo(
        rightPanelRef.current,
        { x: 100, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
        '-=0.5'
      )
      
      tl.fromTo(
        topNavRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' },
        '-=0.3'
      )
      
      tl.fromTo(
        menuItemsRef.current,
        { x: -30, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power2.out'
        },
        '-=0.3'
      )
      
      // Bottom section removed
    }
  }, [isOpen])

  const handleClose = () => {
    const tl = gsap.timeline({
      onComplete: onClose
    })
    
    tl.to(menuItemsRef.current, {
      x: -30,
      opacity: 0,
      duration: 0.3,
      stagger: 0.05,
      ease: 'power2.in'
    })
    
    tl.to(
      [leftPanelRef.current, rightPanelRef.current],
      { x: -50, opacity: 0, duration: 0.4, ease: 'power2.in' },
      '-=0.2'
    )
    
    tl.to(menuOverlayRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in'
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-black/95 z-[1000] flex items-center justify-center" ref={menuOverlayRef}>
      <div className="flex w-full h-full max-w-[1400px]" style={{ backgroundColor: '#00c3a1' }} ref={menuContainerRef}>
        {/* Left Panel - Menu Content */}
        <div className="flex-[0_0_40%] p-[60px_80px] flex flex-col justify-between relative" style={{ backgroundColor: '#00c3a1' }} ref={leftPanelRef}>
          {/* Top Navigation */}
          <div className="flex items-center gap-5 mb-20" ref={topNavRef}>
            <button className="flex items-center gap-[15px] bg-none border-none cursor-pointer font-['Arial'] text-sm font-normal text-[#333] transition-opacity duration-300 hover:opacity-70" onClick={handleClose}>
              <span className="text-sm tracking-[1px]">{t('CLOSE')}</span>
              <div className="flex flex-col gap-[3px] w-5 h-4">
                <span className="w-full h-[2px] bg-[#333] transition-all duration-300 rotate-45 translate-x-[6px] translate-y-[6px]"></span>
                <span className="w-full h-[2px] bg-[#333] transition-all duration-300 -rotate-45 translate-x-[6px] -translate-y-[6px]"></span>
              </div>
            </button>
            <div className="w-px h-5 bg-[#ddd]"></div>
          </div>

          {/* Main Menu Items */}
          <div className="flex-1 flex flex-col justify-center gap-0">
            <div className="flex flex-col gap-2 items-start">
              <Link to="/" className="font-['Arial'] text-2xl font-medium text-[#333] no-underline leading-[1.2] transition-all duration-300 relative flex items-center gap-[15px] py-[5px] hover:text-secondary-600 hover:translate-x-[10px] after:content-[''] after:absolute after:bottom-[5px] after:left-0 after:w-0 after:h-[2px] after:bg-secondary-600 after:transition-all after:duration-300 hover:after:w-full" onClick={handleClose} ref={(el) => (menuItemsRef.current[0] = el)}>
                <div className="flex items-center justify-center w-6 h-6 flex-shrink-0">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span>{t('Home')}</span>
              </Link>
              <Link to="/packages" className="font-['Arial'] text-2xl font-medium text-[#333] no-underline leading-[1.2] transition-all duration-300 relative flex items-center gap-[15px] py-[5px] hover:text-secondary-600 hover:translate-x-[10px] after:content-[''] after:absolute after:bottom-[5px] after:left-0 after:w-0 after:h-[2px] after:bg-secondary-600 after:transition-all after:duration-300 hover:after:w-full" onClick={handleClose} ref={(el) => (menuItemsRef.current[1] = el)}>
                <div className="flex items-center justify-center w-6 h-6 flex-shrink-0">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 8C21 7.45 20.55 7 20 7H4C3.45 7 3 7.45 3 8V18C3 19.1 3.9 20 5 20H19C20.1 20 21 19.1 21 18V8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M1 10H23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span>{t('Packages')}</span>
              </Link>
              <Link to="/gallery" className="font-['Arial'] text-2xl font-medium text-[#333] no-underline leading-[1.2] transition-all duration-300 relative flex items-center gap-[15px] py-[5px] hover:text-secondary-600 hover:translate-x-[10px] after:content-[''] after:absolute after:bottom-[5px] after:left-0 after:w-0 after:h-[2px] after:bg-secondary-600 after:transition-all after:duration-300 hover:after:w-full" onClick={handleClose} ref={(el) => (menuItemsRef.current[2] = el)}>
                <div className="flex items-center justify-center w-6 h-6 flex-shrink-0">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="2"/>
                    <polyline points="21,15 16,10 5,21" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <span>{t('Gallery')}</span>
              </Link>
              <Link to="/blog" className="font-['Arial'] text-2xl font-medium text-secondary-600 no-underline leading-[1.2] transition-all duration-300 relative flex items-center gap-[15px] py-[5px] hover:text-secondary-700 hover:translate-x-[10px] after:content-[''] after:absolute after:bottom-[5px] after:left-0 after:w-0 after:h-[2px] after:bg-secondary-600 after:transition-all after:duration-300 hover:after:w-full" onClick={handleClose} ref={(el) => (menuItemsRef.current[3] = el)}>
                <div className="flex items-center justify-center w-6 h-6 flex-shrink-0">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                    <line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" strokeWidth="2"/>
                    <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <span>{t('Blog')}</span>
              </Link>
              <Link to="/contact" className="font-['Arial'] text-2xl font-medium text-[#333] no-underline leading-[1.2] transition-all duration-300 relative flex items-center gap-[15px] py-[5px] hover:text-secondary-600 hover:translate-x-[10px] after:content-[''] after:absolute after:bottom-[5px] after:left-0 after:w-0 after:h-[2px] after:bg-secondary-600 after:transition-all after:duration-300 hover:after:w-full" onClick={handleClose} ref={(el) => (menuItemsRef.current[4] = el)}>
                <div className="flex items-center justify-center w-6 h-6 flex-shrink-0">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2"/>
                    <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <span>{t('Contact')}</span>
              </Link>
              {isLoggedIn && (
                <Link to={user?.role === 'admin' ? '/dashboard' : '/my-dashboard'} className="font-['Arial'] text-2xl font-medium text-[#333] no-underline leading-[1.2] transition-all duration-300 relative flex items-center gap-[15px] py-[5px] hover:text-secondary-600 hover:translate-x-[10px] after:content-[''] after:absolute after:bottom-[5px] after:left-0 after:w-0 after:h-[2px] after:bg-secondary-600 after:transition-all after:duration-300 hover:after:w-full" onClick={handleClose} ref={(el) => (menuItemsRef.current[6] = el)}>
                  <div className="flex items-center justify-center w-6 h-6 flex-shrink-0">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
                      <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
                      <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
                      <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </div>
                  <span>{t('Dashboard')}</span>
                </Link>
              )}
              <Link to="/login" className="font-['Arial'] text-2xl font-medium text-[#333] no-underline leading-[1.2] transition-all duration-300 relative flex items-center gap-[15px] py-[5px] hover:text-secondary-600 hover:translate-x-[10px] after:content-[''] after:absolute after:bottom-[5px] after:left-0 after:w-0 after:h-[2px] after:bg-secondary-600 after:transition-all after:duration-300 hover:after:w-full" onClick={handleClose} ref={(el) => (menuItemsRef.current[isLoggedIn ? 7 : 5] = el)}>
                <div className="flex items-center justify-center w-6 h-6 flex-shrink-0">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 3H19C20.1 3 21 3.9 21 5V19C21 20.1 20.1 21 19 21H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <polyline points="10,17 15,12 10,7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="15" y1="12" x2="3" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span>{t('Login')}</span>
              </Link>
            </div>
            
            <div className="flex flex-col gap-[25px] justify-center items-start mt-5">
            </div>
          </div>

          {/* Bottom Section removed */}
        </div>

        {/* Right Panel - Scenic Image */}
        <div className="flex-[0_0_60%] relative overflow-hidden" ref={rightPanelRef}>
          <div className="w-full h-full relative">
            <img 
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
              alt="Scenic landscape"
              className="w-full h-full object-cover object-center"
            />
          </div>
          
        </div>
      </div>
    </div>
  )
}

export default Menu

