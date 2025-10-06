import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { FiFacebook, FiInstagram, FiTwitter } from 'react-icons/fi';

const Footer = () => {
  const footerRef = useRef<HTMLElement>(null);
  const columnsRef = useRef<HTMLDivElement>(null);
  const animated = useRef(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (!footerRef.current || animated.current) return;
  
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
  
          const columns = Array.from(columnsRef.current?.children || []);
  
          if (columns.length > 0) {
            gsap.to(columnsRef.current, {
              opacity: 1,
              duration: 0.3,
              onComplete: () => {
                gsap.fromTo(
                  columns,
                  { y: 50, opacity: 0 },
                  {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.15,
                    ease: "power3.out",
                    onComplete: () => {
                      observer.disconnect();
                    },
                  }
                );
              },
            });
          }
        }
      },
      { threshold: 0.2 }
    );
  
    observer.observe(footerRef.current);
  
    return () => observer.disconnect();
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your newsletter subscription logic here
    console.log('Subscribing email:', email);
    setEmail('');
  };

  return (
    <footer ref={footerRef} className="bg-[#2b2b2b] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div 
          ref={columnsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start opacity-0"
        >
          {/* Left Column - Contact Info */}
          <div className="text-center md:text-left space-y-6">
            <div>
              <p className="text-gray-300 text-lg mb-2">Phone 1300 303 343</p>
            </div>
            
            <div>
              <p className="text-gray-300 text-lg">hello@thecompany.com</p>
            </div>
            
            {/* Social Icons */}
            <div className="flex justify-center md:justify-start space-x-6 pt-4">
              <a 
                href="#" 
                className="text-gray-400 hover:text-white transition-colors duration-300"
                aria-label="Facebook"
              >
                <FiFacebook className="w-6 h-6" />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-white transition-colors duration-300"
                aria-label="Instagram"
              >
                <FiInstagram className="w-6 h-6" />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-white transition-colors duration-300"
                aria-label="Twitter"
              >
                <FiTwitter className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Center Column - Logo */}
          <div className="flex flex-col items-center justify-center">
            <div className="mb-6">
              <div className="w-56 h-56 rounded-full border-4 border-white flex items-center justify-center p-6" style={{ backgroundColor: '#3f7670' }}>
                <img 
                  src="/Logo1.png" 
                  alt="Travel Beyond Tours Logo" 
                  className="w-40 h-40 object-contain"
                />
              </div>
            </div>
            <p className="text-gray-300 text-base uppercase tracking-[0.3em]">Naturally Curious</p>
          </div>

          {/* Right Column - Empty for symmetry */}
          <div className="text-center md:text-right space-y-4">
            {/* Empty space for balanced layout */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;