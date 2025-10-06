import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';

interface TourCardProps {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  image: string;
  rating: number;
  location: string;
  className?: string;
  pro?: boolean;
}

const TourCard = ({ 
  id, 
  title, 
  description, 
  price, 
  duration, 
  image, 
  rating, 
  location, 
  className = "",
  pro = false 
}: TourCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (cardRef.current) {
      gsap.set(cardRef.current, {
        transformOrigin: 'center center',
      });
    }
  }, []);

  const handleMouseEnter = () => {
    setIsHovered(true);
    
    if (cardRef.current && imageRef.current && contentRef.current) {
      const tl = gsap.timeline();
      
      tl.to(cardRef.current, {
        y: -4,
        duration: 0.3,
        ease: "power2.out",
      })
      .to(imageRef.current, {
        scale: 1.05,
        duration: 0.5,
        ease: "power2.out"
      }, 0)
      .to(contentRef.current.querySelectorAll('.animate-content'), {
        y: -2,
        duration: 0.2,
        stagger: 0.05,
        ease: "power2.out"
      }, 0.1);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    
    if (cardRef.current && imageRef.current && contentRef.current) {
      const tl = gsap.timeline();
      
      tl.to(cardRef.current, {
        y: 0,
        duration: 0.3,
        ease: "power2.out",
      })
      .to(imageRef.current, {
        scale: 1,
        duration: 0.5,
        ease: "power2.out"
      }, 0)
      .to(contentRef.current.querySelectorAll('.animate-content'), {
        y: 0,
        duration: 0.2,
        stagger: 0.03,
        ease: "power2.out"
      }, 0);
    }
  };

  const handleClick = () => {
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        scale: 0.98,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut"
      });
    }
  };

  return (
    <div
      ref={cardRef}
      className={`bg-white rounded-lg overflow-hidden transition-all duration-300 group cursor-pointer flex flex-col h-full ${className} ${pro ? 'border-2 border-blue-300 shadow-lg' : 'border border-gray-100 shadow'}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{ willChange: 'transform' }}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden bg-gray-100">
        <img
          ref={imageRef}
          src={image}
          alt={title}
          className="w-full h-48 object-contain transition-transform duration-500"
          loading="lazy"
          style={{ willChange: 'transform' }}
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Duration badge */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium text-gray-700">
          {duration}
        </div>
        
        {/* Rating badge */}
        <div className="absolute top-3 left-3 flex items-center space-x-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs">
          <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="font-medium text-gray-700">{rating}</span>
        </div>

        {/* Pro badge */}
        {pro && (
          <div className="absolute top-12 left-3 bg-teal-600 text-white px-2 py-1 rounded text-xs font-medium">
            PRO
          </div>
        )}
      </div>
      
      {/* Content Container */}
      <div ref={contentRef} className="p-4 flex flex-col flex-grow">
        {/* Location */}
        <div className="animate-content flex items-center text-xs text-gray-500 mb-2">
          <svg className="w-3 h-3 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="truncate">{location}</span>
        </div>
        
        {/* Title */}
        <h3 className="animate-content text-lg font-semibold text-gray-900 mb-2 line-clamp-1 group-hover:text-teal-600 transition-colors duration-300">
          {title}
        </h3>
        
        {/* Description */}
        <p className="animate-content text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed flex-grow">
          {description}
        </p>
        
        {/* Price and CTA */}
        <div className="animate-content flex items-center justify-between mt-auto">
          <div className="text-lg font-bold text-teal-600">
            ${price}
            <span className="text-xs font-normal text-gray-500 ml-1">/person</span>
          </div>
          
          <Link
            to={`/tour/${id}`}
            className="bg-teal-600 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-teal-700 transition-colors duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TourCard;