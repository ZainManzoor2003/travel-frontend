import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const LoadingSpinner = () => {
  const spinnerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (spinnerRef.current) {
      gsap.fromTo(
        spinnerRef.current,
        { rotation: 0, opacity: 0 },
        { 
          rotation: 360, 
          opacity: 1, 
          duration: 1, 
          repeat: -1, 
          ease: "power2.inOut" 
        }
      );
    }
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div
          ref={spinnerRef}
          className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4"
        />
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
