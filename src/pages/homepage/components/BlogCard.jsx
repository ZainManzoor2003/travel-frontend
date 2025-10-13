const BlogCard = ({ post }) => {
  return (
    <article className="flex flex-col sm:flex-row bg-white rounded-lg overflow-hidden transition-all duration-300 h-[450px] sm:h-[240px] lg:h-[280px] shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.15)] hover:-translate-y-1 w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(50%-1rem)] max-w-[400px]">
      <div className="relative w-full h-[200px] sm:w-2/5 sm:h-full overflow-hidden flex-shrink-0">
        <img 
          src={post.image} 
          alt={post.title} 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      
      <div className="p-4 sm:p-5 lg:p-6 flex-1 flex flex-col justify-between sm:w-3/5">
        <div className="flex flex-col flex-1">
          <h2 className="font-['Playfair_Display'] text-lg sm:text-xl font-normal text-[#333] leading-[1.3] mb-2 sm:mb-3 tracking-tight line-clamp-2 min-h-[2.6rem] sm:min-h-[2.2rem]">
            {post.title}
          </h2>
          
          <div className="flex items-center gap-2 mb-3 sm:mb-4 font-['Inter'] text-xs font-normal uppercase tracking-wider text-[#666] min-h-[1rem]">
            <span>{post.location}</span>
            <span className="text-[#ccc]">|</span>
            <span>{post.date}</span>
          </div>
          
          <p className="font-['Inter'] text-sm font-normal text-[#333] leading-[1.5] sm:leading-[1.6] mb-4 sm:mb-6 line-clamp-3 flex-1">
            {post.description}
          </p>
        </div>
        
        <a 
          href={post.readMoreLink} 
          className="font-['Inter'] text-xs font-medium text-[#333] no-underline uppercase tracking-wider transition-colors duration-300 self-start hover:text-[#666] mt-auto"
        >
          READ MORE
        </a>
      </div>
    </article>
  )
}

export default BlogCard

