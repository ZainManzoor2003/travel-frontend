
const Footer = () => {
  return (
    <footer className="w-full bg-[#4a423e] text-white py-8 sm:py-12 px-0 pb-6 sm:pb-8">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* Top Section */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6 lg:gap-0 mb-8 sm:mb-12 pb-6 sm:pb-8 border-b border-[rgba(245,245,240,0.2)]">
          <div className="flex-1 w-full lg:w-auto">
            <div className="flex items-center justify-center lg:justify-start gap-2 cursor-pointer transition-opacity duration-300 hover:opacity-80">
              <span className="font-['Playfair_Display'] text-lg sm:text-xl font-normal text-white">Destinations</span>
              <div className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center bg-white/10 rounded-full transition-all duration-300 hover:bg-white/20">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-4 sm:h-4">
                  <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
          
          <div className="flex-1 w-full lg:w-auto flex justify-center">
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2 sm:gap-4 lg:gap-2">
              <a href="#" className="font-['Inter'] text-xs sm:text-sm font-medium text-white no-underline tracking-wider transition-opacity duration-300 hover:opacity-80 text-center lg:text-center">
                CONTACT US
              </a>
              <a href="#" className="font-['Inter'] text-xs sm:text-sm font-medium text-white no-underline tracking-wider transition-opacity duration-300 hover:opacity-80 text-center lg:text-center">
                CAREERS
              </a>
            </div>
          </div>
          
          <div className="flex-1 w-full lg:w-auto flex justify-center lg:justify-end">
            <div className="relative flex items-center w-full max-w-[280px] lg:max-w-none">
              <input 
                type="text" 
                placeholder="LET'S STAY IN TOUCH" 
                className="bg-transparent border border-[#f5f5f0] text-[#f5f5f0] py-2 sm:py-3 px-3 sm:px-4 pr-10 sm:pr-12 font-['Inter'] text-xs sm:text-sm font-normal tracking-wider w-full min-w-[180px] sm:min-w-[200px] outline-none transition-colors duration-300 placeholder:text-[#f5f5f0] placeholder:opacity-80 focus:border-[rgba(245,245,240,0.6)]"
              />
              <div className="absolute right-2 sm:right-3 w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center bg-white/10 rounded cursor-pointer transition-all duration-300 hover:bg-white/20">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-4 sm:h-4">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="flex flex-col lg:flex-row justify-between items-center lg:items-end gap-8 lg:gap-8">
          <div className="flex-1 w-full lg:w-auto">
            <div className="flex flex-col gap-3 sm:gap-4 text-center lg:text-left">
              <h3 className="font-['Inter'] text-xs sm:text-sm font-semibold text-white tracking-[0.1em] m-0">Travel Beyond BRAND</h3>
              
              <div className="flex flex-col gap-1">
                <p className="font-['Inter'] text-xs sm:text-sm font-normal text-white m-0">INFO@Travel Beyond.COM</p>
                <p className="font-['Inter'] text-xs sm:text-sm font-normal text-white m-0">+(56-2) 2233-9641</p>
              </div>
              
              <div className="flex gap-3 sm:gap-4 mt-2 justify-center lg:justify-start">
                <a href="#" className="text-white transition-opacity duration-300 flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 hover:opacity-80" aria-label="Instagram">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-5 sm:h-5">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="currentColor" strokeWidth="2"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" stroke="currentColor" strokeWidth="2"/>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </a>
                <a href="#" className="text-white transition-opacity duration-300 flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 hover:opacity-80" aria-label="LinkedIn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-5 sm:h-5">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" stroke="currentColor" strokeWidth="2"/>
                    <rect x="2" y="9" width="4" height="12" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="4" cy="4" r="2" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </a>
                <a href="#" className="text-white transition-opacity duration-300 flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 hover:opacity-80" aria-label="Spotify">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-5 sm:h-5">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 14.36c-.2.32-.63.42-.95.22-2.58-1.58-5.83-1.93-9.64-1.06-.38.08-.76-.18-.84-.56-.08-.38.18-.76.56-.84 4.2-.95 7.8-.55 10.7 1.23.33.2.43.63.22.95z" fill="currentColor"/>
                  </svg>
                </a>
              </div>
              
              <a href="https://Travel Beyond.com/contact/" className="font-['Inter'] text-xs text-white no-underline opacity-80 transition-opacity duration-300 mt-2 hover:opacity-100 break-all">
                https://Travel Beyond.com/contact/
              </a>
            </div>
          </div>
          
          <div className="flex-1 w-full lg:w-auto flex justify-center items-center order-first lg:order-none mb-4 lg:mb-0">
            <div className="text-center">
              <span className="font-['Playfair_Display'] text-3xl sm:text-4xl lg:text-5xl font-normal text-white tracking-tight leading-none">
                Travel Beyond
              </span>
            </div>
          </div>
          
          <div className="flex-1 w-full lg:w-auto flex justify-center lg:justify-end items-center lg:items-end">
            <div className="flex flex-col items-center gap-2">
              <div className="text-white flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-6 sm:h-6">
                  <path d="M12 2L8 6L12 10L16 6L12 2Z" fill="currentColor"/>
                  <path d="M12 10L8 14L12 18L16 14L12 10Z" fill="currentColor"/>
                  <path d="M12 18L8 22L12 24L16 22L12 18Z" fill="currentColor"/>
                </svg>
              </div>
              <div className="flex flex-col items-center gap-[2px]">
                <span className="font-['Inter'] text-[10px] sm:text-xs font-medium text-white tracking-[0.1em] leading-none">RELAIS</span>
                <span className="font-['Inter'] text-[8px] sm:text-[0.625rem] font-medium text-white tracking-[0.1em] leading-none">& CHATEAUX</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

