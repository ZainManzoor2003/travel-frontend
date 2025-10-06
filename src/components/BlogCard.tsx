import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';

interface BlogCardProps {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  author: string;
  date: string;
  readTime: string;
  category?: string;
  featured?: boolean;
  className?: string;
}

const BlogCard = ({ 
  id, 
  title, 
  excerpt, 
  image, 
  author, 
  date, 
  readTime, 
  category = 'Travel',
  featured = false,
  className = ""
}: BlogCardProps) => {
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
        y: -6,
        duration: 0.3,
        ease: "power2.out",
      })
      .to(imageRef.current, {
        scale: 1.08,
        duration: 0.5,
        ease: "power2.out"
      }, 0)
      .to(contentRef.current.querySelectorAll('.animate-content'), {
        y: -3,
        duration: 0.25,
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
        duration: 0.25,
        stagger: 0.03,
        ease: "power2.out"
      }, 0);
    }
  };

  const handleClick = () => {
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        scale: 0.97,
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
      className={`bg-white rounded-xl overflow-hidden transition-all duration-300 group cursor-pointer flex flex-col h-full ${className} ${
        featured 
          ? 'border-2 border-blue-300 shadow-xl' 
          : 'border border-gray-100 shadow-lg'
      } hover:shadow-2xl`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{ willChange: 'transform' }}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <img
          ref={imageRef}
          src={image}
          alt={title}
          className="w-full h-52 object-cover transition-transform duration-500"
          loading="lazy"
          style={{ willChange: 'transform' }}
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Read time badge */}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-gray-700 shadow-sm">
          {readTime}
        </div>
        
        {/* Category badge */}
        <div className="absolute top-4 left-4 bg-teal-600 text-white px-3 py-1 rounded-full text-xs font-medium">
          {category}
        </div>

        {/* Featured badge */}
        {featured && (
          <div className="absolute top-14 left-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
            Featured
          </div>
        )}
      </div>
      
      {/* Content Container */}
      <div ref={contentRef} className="p-6 flex flex-col flex-grow">
        {/* Author and Date */}
        <div className="animate-content flex items-center text-sm text-gray-500 mb-3">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="font-medium">{author}</span>
          </div>
          <span className="mx-3">•</span>
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{date}</span>
          </div>
        </div>
        
        {/* Title */}
        <h3 className="animate-content text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#3f7670] transition-colors duration-300 leading-tight">
          {title}
        </h3>
        
        {/* Excerpt */}
        <p className="animate-content text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed flex-grow">
          {excerpt}
        </p>
        
        {/* Read More Link */}
        <div className="animate-content mt-auto">
          <Link
            to={`/blog/${id}`}
            className="inline-flex items-center text-[#3f7670] hover:text-[#2d5550] font-semibold text-sm transition-all duration-200 group-hover:translate-x-1"
            onClick={(e) => e.stopPropagation()}
          >
            Read Full Article
            <svg className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;