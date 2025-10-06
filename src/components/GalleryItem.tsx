import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import LazyImage from './LazyImage';

interface GalleryItemProps {
  id: string;
  src: string;
  alt: string;
  title?: string;
  category?: string;
  onImageClick: (src: string, alt: string) => void;
}

const GalleryItem = ({ id, src, alt, title, category, onImageClick }: GalleryItemProps) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (itemRef.current && isLoaded) {
      gsap.fromTo(
        itemRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: "power2.out" }
      );
    }
  }, [isLoaded]);

  return (
    <div
      ref={itemRef}
      className="relative group cursor-pointer overflow-hidden rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 h-full bg-gray-200 hover:scale-105"
      onClick={() => onImageClick(src, alt)}
    >
      <LazyImage
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        onLoad={() => setIsLoaded(true)}
        onError={() => console.log(`Failed to load image: ${src}`)}
        loading="lazy"
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
          <div className="bg-white rounded-full p-3 shadow-lg">
            <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Info overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {title && (
          <h3 className="text-white font-semibold text-sm mb-1">{title}</h3>
        )}
        {category && (
          <div className="flex items-center">
            <span className="inline-block px-2 py-1 bg-teal-600 text-white text-xs rounded-full capitalize">
              {category}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryItem;