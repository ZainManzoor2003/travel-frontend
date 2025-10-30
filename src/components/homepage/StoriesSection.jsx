import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useLanguage } from "../../contexts/LanguageContext"

export default function StoriesSection() {
  const { t } = useLanguage()
  const [featuredBlogs, setFeaturedBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch all blogs and filter for featured ones
  useEffect(() => {
    const controller = new AbortController()
    const fetchFeaturedBlogs = async () => {
      try {
        setLoading(true)
        setError(null)
        const API_BASE = (import.meta && import.meta.env && import.meta.env.VITE_API_BASE_URL) || 'https://travel-backend-psi.vercel.app'
        const res = await fetch(`${API_BASE}/blogs?status=published`, { signal: controller.signal })
        if (!res.ok) throw new Error(`Failed to load blogs (${res.status})`)
        const json = await res.json()
        const allBlogs = (json && json.data && json.data.blogs) || []
        // Filter for featured blogs on the frontend
        const featured = allBlogs.filter(blog => blog.isFeatured === true)
        setFeaturedBlogs(featured)
      } catch (e) {
        if (e && e.name === 'AbortError') return
        setError(e?.message || 'Failed to load blogs')
      } finally {
        setLoading(false)
      }
    }
    fetchFeaturedBlogs()
    return () => controller.abort()
  }, [])
  return (
    <section className="w-full py-16 pb-20" style={{ backgroundColor: '#ffe020' }}>
      <div className="max-w-[1400px] mx-auto px-12">
        <h2 className="font-['Playfair_Display'] font-normal text-[clamp(2.25rem,4.5vw,3.75rem)] text-black mb-8">
          {t('Explore more stories')}
        </h2>

        <ul className="list-none m-0 mb-10 p-0 border-t border-[#cfcfcf]">
          {loading && (
            <li className="py-7 text-center text-[#666] font-['Inter']">
              {t('Loading stories...')}
            </li>
          )}
          {error && (
            <li className="py-7 text-center text-red-600 font-['Inter']">
              {error}
            </li>
          )}
          {!loading && !error && featuredBlogs.length === 0 && (
            <li className="py-7 text-center text-[#666] font-['Inter']">
              {t('No featured stories available')}
            </li>
          )}
          {!loading && !error && featuredBlogs.map((blog) => (
            <li key={blog._id} className="grid grid-cols-[1fr_auto] items-center py-7 border-b border-[#cfcfcf]">
              <Link
                to={`/blog/${blog._id}`}
                className="no-underline text-black font-['Playfair_Display'] text-[clamp(1.25rem,2.2vw,1.75rem)] transition-colors duration-[250ms] hover:text-[#00c3a1]"
              >
                {blog.title}
              </Link>
              <span className="text-[#666] font-['Inter'] text-[0.95rem]">
                {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </li>
          ))}
        </ul>
          <Link to="/blog" className="mt-10 bg-black text-white border border-black rounded-lg py-[0.9rem] px-[1.2rem] font-['Inter'] font-semibold tracking-wider cursor-pointer transition-all duration-[250ms] hover:bg-[#00c3a1] hover:border-[#00c3a1]">
            {t('SEE OUR BLOG')}
          </Link>
      </div>
    </section>
  )
}

