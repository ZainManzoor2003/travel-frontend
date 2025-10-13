const PackageCard = ({ pkg }) => {
  return (
    <article className="flex flex-col bg-white rounded-lg overflow-hidden transition-all duration-300 h-full hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(0,0,0,0.1)] w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(50%-1rem)] max-w-[400px]">
      <div className="relative w-full h-[200px] sm:h-[240px] lg:h-[280px] overflow-hidden">
        <img 
          src={pkg.image} 
          alt={pkg.title} 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      
      <div className="p-4 sm:p-6 lg:p-8 flex flex-col flex-1">
        <h2 className="font-['Playfair_Display'] text-xl sm:text-2xl font-normal text-[#333] mb-3 sm:mb-4 tracking-tight">
          {pkg.title}
        </h2>
        
        <div className="flex items-center justify-between gap-2 mb-3 sm:mb-4 lg:mb-5 font-['Inter'] text-xs sm:text-sm font-normal uppercase tracking-wider">
          <span className="text-[#666]">{pkg.location}</span>
          <span className="text-[#2c2c2c] font-semibold">{pkg.price}</span>
        </div>
        
        <p className="font-['Inter'] text-sm sm:text-base font-normal text-[#333] leading-[1.5] sm:leading-[1.6] mb-4 sm:mb-6 lg:mb-7 flex-1">
          {pkg.description}
        </p>
        
        <a 
          href={pkg.detailsLink} 
          className="self-start font-['Inter'] text-xs sm:text-sm font-semibold text-[#2c2c2c] no-underline uppercase tracking-wider border border-[#2c2c2c] py-2 px-3 sm:px-4 rounded transition-all duration-250 hover:bg-[#2c2c2c] hover:text-white"
        >
          DETAILS
        </a>
      </div>
    </article>
  )
}

export default PackageCard
