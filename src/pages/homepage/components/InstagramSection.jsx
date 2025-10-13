
const InstagramSection = () => {
  return (
    <section className="w-full bg-[#f5f5f0] p-0">
      <div className="max-w-full mx-auto p-0">
        <div className="bg-[#f5f5f0] py-12 text-center m-0">
          <h2 className="font-['Playfair_Display'] text-[clamp(1.8rem,3.5vw,2.5rem)] font-normal text-[#2c2c2c] tracking-tight leading-[1.2] m-0">
            Follow us on Instagram @travelbeyondbrand
          </h2>
        </div>
        
        <div className="flex gap-0 w-full h-auto">
          <div className="relative flex-1 aspect-square overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-[1.02]">
            <video 
              className="w-full h-full object-cover block bg-black"
              autoPlay
              muted
              loop
              playsInline
            >
              <source src="https://videos.ctfassets.net/hz1mviiqoqof/2KhyAHGxQo1vWzFocY2T2i/42a6420c740bac2d267a56f028fd8d9c/filmCollectionGalleryCard3.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          
          <div className="relative flex-1 aspect-square overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-[1.02]">
            <img 
              src="https://images.ctfassets.net/hz1mviiqoqof/38LQEYTjOmLC8PQEyLZ8Tp/b030f502a486738e443c0b49a2730434/film13.png"
              alt="Awasi Experience"
              className="w-full h-full object-cover block"
            />
          </div>
          
          <div className="relative flex-1 aspect-square overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-[1.02]">
            <img 
              src="https://images.ctfassets.net/hz1mviiqoqof/5gC6xOjJCRkr1PL14WNxsI/de82f96cdd3ebb8e418e0e2ccfbf31f5/film14.png"
              alt="Awasi Experience"
              className="w-full h-full object-cover block"
            />
          </div>
          
          <div className="relative flex-1 aspect-square overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-[1.02]">
            <img 
              src="https://images.ctfassets.net/hz1mviiqoqof/8vsHZ5nMPKFiScsVU7Gkh/c0477c9f869bca0ecb0d5494d5a90903/film15.png"
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

