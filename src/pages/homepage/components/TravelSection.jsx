const TravelSection = () => {
  return (
    <section className="w-full py-8 sm:py-12 lg:py-16" style={{ backgroundColor: '#ffe020' }}>
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 gap-8 sm:gap-12 lg:gap-16 px-4 sm:px-8 lg:px-12 min-h-[60vh]">
        <div className="flex items-center justify-center text-center">
          <div className="max-w-[600px]">
            <h2 className="font-['Playfair_Display'] text-[clamp(2rem,4vw,3rem)] font-normal text-black tracking-tight leading-[1.2] mb-6 sm:mb-8 text-center">
              Combine two or more of our lodges
              <br />
              for the perfect South American
              <br />
              Adventure
            </h2>
            <p className="font-['Inter'] text-base sm:text-lg font-normal text-[#555] leading-[1.6] tracking-[0.01em] mb-4 sm:mb-6 text-center">
              When combining our destinations, enjoy complimentary stays at our favourite hotels in connecting cities, plus benefit from the local know-how from our experts who will help create your tailor-made experience.
            </p>
            <p className="font-['Inter'] text-base sm:text-lg font-normal text-[#555] leading-[1.6] tracking-[0.01em] mb-0 text-center">
              Our rates include a fully hosted experience: private excursions, refined local cuisine, and elegant accommodations come together seamlessly to create meaningful and unforgettable journeys.
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-center py-4 sm:py-6 lg:py-8">
          <div className="relative w-full max-w-[350px] sm:max-w-[400px] h-[400px] sm:h-[450px] lg:h-[500px]">
            <svg className="w-full h-full bg-[#fafafa] border border-[#e0e0e0] rounded-lg" viewBox="0 0 400 600" xmlns="http://www.w3.org/2000/svg">
              {/* Simplified South America outline */}
              <path
                d="M50 100 L80 80 L120 90 L150 70 L180 80 L200 60 L230 70 L260 50 L290 60 L320 40 L350 50 L380 30 L390 60 L395 100 L390 150 L385 200 L380 250 L375 300 L370 350 L365 400 L360 450 L355 500 L350 550 L345 580 L340 590 L320 585 L300 580 L280 575 L260 570 L240 565 L220 560 L200 555 L180 550 L160 545 L140 540 L120 535 L100 530 L80 525 L60 520 L40 515 L20 510 L10 505 L5 500 L0 480 L5 460 L10 440 L15 420 L20 400 L25 380 L30 360 L35 340 L40 320 L45 300 L50 280 L55 260 L60 240 L65 220 L70 200 L75 180 L80 160 L85 140 L90 120 L95 100 Z"
                fill="none"
                stroke="#d0d0d0"
                strokeWidth="1"
              />
              
              {/* Location markers */}
              <circle cx="180" cy="120" r="4" fill="#333" />
              <text x="190" y="125" className="font-['Inter'] text-sm font-normal text-[#333] fill-[#333]">Atacama</text>
              
              <circle cx="220" cy="280" r="4" fill="#333" />
              <text x="230" y="285" className="font-['Inter'] text-sm font-normal text-[#333] fill-[#333]">Mendoza</text>
              
              <circle cx="200" cy="450" r="4" fill="#333" />
              <text x="210" y="455" className="font-['Inter'] text-sm font-normal text-[#333] fill-[#333]">Patagonia</text>
              
              <circle cx="280" cy="320" r="4" fill="#333" />
              <text x="290" y="325" className="font-['Inter'] text-sm font-normal text-[#333] fill-[#333]">Iguazu</text>
              
              <circle cx="320" cy="280" r="4" fill="#333" />
              <text x="330" y="285" className="font-['Inter'] text-sm font-normal text-[#333] fill-[#333]">Santa Catarina</text>
            </svg>
            
            {/* Legend */}
            <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 flex flex-col gap-2 sm:gap-3 bg-white/90 p-2 sm:p-3 lg:p-4 rounded-md backdrop-blur-[10px] border border-black/10">
              <div className="flex items-center gap-2 font-['Inter'] text-xs font-normal text-[#333] uppercase tracking-wider">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                  <path d="M21 16V14L13 9V3.5A1.5 1.5 0 0 0 11.5 2A1.5 1.5 0 0 0 10 3.5V9L2 14V16L10 13.5V19L8 20.5V22L11.5 21L15 22V20.5L13 19V13.5L21 16Z" fill="#333"/>
                </svg>
                <span>AIRPORTS</span>
              </div>
              <div className="flex items-center gap-2 font-['Inter'] text-xs font-normal text-[#333] uppercase tracking-wider">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                  <path d="M21 16V14L13 9V3.5A1.5 1.5 0 0 0 11.5 2A1.5 1.5 0 0 0 10 3.5V9L2 14V16L10 13.5V19L8 20.5V22L11.5 21L15 22V20.5L13 19V13.5L21 16Z" fill="#333"/>
                  <path d="M21 16L18 15" stroke="#333" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span>FLIGHTS & CONNECTIONS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TravelSection;

