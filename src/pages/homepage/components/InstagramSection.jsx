
import React from 'react';

const InstagramSection = () => {
  return (
    <section className="w-full bg-primary-50 p-0">
      <div className="max-w-full mx-auto p-0">
        <div className="bg-primary-50 py-12 text-center m-0">
          <h2 className="font-['Playfair_Display'] text-[clamp(1.8rem,3.5vw,2.5rem)] font-normal text-[#2c2c2c] tracking-tight leading-[1.2] m-0">
            Follow us on Instagram @travelbeyondbrand
          </h2>
        </div>
        
        <div className="flex gap-0 w-full h-auto">
          
          <div className="relative flex-1 aspect-square overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-[1.02]">
            <img 
              src="https://res.cloudinary.com/dfoetpdk9/image/upload/v1761722287/bt9wzoqasfw6fnob3eux.jpg"
              alt="Awasi Experience"
              className="w-full h-full object-cover block"
            />
          </div>
          <div className="relative flex-1 aspect-square overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-[1.02]">
            <img 
              src="https://res.cloudinary.com/dfoetpdk9/image/upload/v1761722386/qohrb67cnyvevyqhqc9a.jpg"
              alt="Awasi Experience"
              className="w-full h-full object-cover block"
            />
          </div>
          
          <div className="relative flex-1 aspect-square overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-[1.02]">
            <img 
              src="https://res.cloudinary.com/dfoetpdk9/image/upload/v1761722424/njvnahiffqilq14gudpy.jpg"
              alt="Awasi Experience"
              className="w-full h-full object-cover block"
            />
          </div>
          
          <div className="relative flex-1 aspect-square overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-[1.02]">
            <img 
              src="https://res.cloudinary.com/dfoetpdk9/image/upload/v1761722455/r6aecqhckkgpd9sarihn.jpg"
              alt="Awasi Experience"
              className="w-full h-full object-cover block"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default InstagramSection

