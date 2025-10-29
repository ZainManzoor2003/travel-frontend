import { useEffect, useState } from 'react'
import Menu from './components/Menu'
import Footer from './components/Footer'
import { Link } from 'react-router-dom'

const HomepageContactPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [country, setCountry] = useState('')
  const [heardFrom, setHeardFrom] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitMsg, setSubmitMsg] = useState('')

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const closeMenu = () => setIsMenuOpen(false)

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  return (
    <div className="w-full min-h-screen bg-[#F8F8F8]">
      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 z-[1000] p-8 px-12 flex items-center justify-between bg-transparent">
        <div className="flex items-center gap-6">
          <button 
            className="flex items-center gap-3 bg-none border-none text-white font-sans text-sm font-normal tracking-wider cursor-pointer transition-opacity duration-300 hover:opacity-80" 
            onClick={toggleMenu}
          >
            <span className="flex flex-col gap-[3px]">
              <span className="w-[18px] h-[2px] bg-white transition-all duration-300"></span>
              <span className="w-[18px] h-[2px] bg-white transition-all duration-300"></span>
              <span className="w-[18px] h-[2px] bg-white transition-all duration-300"></span>
            </span>
            MENU
          </button>
          <div className="w-px h-5 bg-white/30"></div>
        </div>
        
        <div className="absolute left-1/2 -translate-x-1/2">
          <img 
            src="/Logo1.png"
            alt="Awasi Logo"
            className="h-24 w-56"
          />
        </div>
        
      </nav>

      {/* Contact Hero Section */}
      <section className="relative w-full min-h-screen flex items-start justify-center pt-32 pb-16 px-6 mb-24">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full">
          <img 
            src="/images/Patagonia (6).jpg" 
            alt="Background" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="absolute inset-0 bg-black/55"></div>
        <div className="relative z-10 w-full max-w-[1100px] bg-white rounded-[10px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] p-12">
          <h1 className="font-['Playfair_Display'] text-[clamp(2rem,4vw,3rem)] font-normal text-[#2c2c2c] text-center m-0 mb-8">
            Contact Us
          </h1>
          <form className="w-full" onSubmit={async (e) => {
            e.preventDefault()
            setSubmitMsg('')
            // Validate all fields
            const errors = []
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            const phoneDigits = (phone || '').replace(/\D/g, '')

            if (!firstName.trim()) errors.push('First name is required')
            if (!lastName.trim()) errors.push('Last name is required')
            if (!email.trim() || !emailRegex.test(email)) errors.push('Valid email is required')
            if (!phoneDigits || phoneDigits.length < 7) errors.push('Valid phone number is required')
            if (!country.trim()) errors.push('Country is required')
            if (!heardFrom.trim()) errors.push('Please tell us how you heard about us')
            // message is optional; if present, minimum length
            if (message && message.trim().length < 5) errors.push('Message should be at least 5 characters')

            if (errors.length) { setSubmitMsg(errors.join(' • ')); return }
            try {
              setSubmitting(true)
              const API_BASE = (import.meta && import.meta.env && import.meta.env.VITE_API_BASE_URL) || 'https://travel-backend-psi.vercel.app'
              const res = await fetch(`${API_BASE}/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  name: `${firstName} ${lastName}`.trim(),
                  email,
                  phone,
                  country,
                  heardFrom,
                  message,
                })
              })
              const json = await res.json()
              if (json?.success) {
                setSubmitMsg('Message sent successfully.')
                setFirstName(''); setLastName(''); setEmail(''); setPhone(''); setCountry(''); setHeardFrom(''); setMessage('')
              } else {
                setSubmitMsg(json?.message || 'Failed to send message.')
              }
            } catch (err) {
              setSubmitMsg('Network error. Please try again.')
            } finally {
              setSubmitting(false)
            }
          }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-7">
              <div className="flex flex-col">
                <label className="font-['Inter'] text-sm tracking-[0.06em] text-[#666] mb-2">
                  First Name*
                </label>
                <input 
                  type="text" 
                  placeholder="Maria" 
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="border-none border-b border-[#ddd] py-[0.85rem] px-1 font-['Inter'] text-base bg-transparent outline-none focus:border-b-[#2c2c2c]"
                />
              </div>
              <div className="flex flex-col">
                <label className="font-['Inter'] text-sm tracking-[0.06em] text-[#666] mb-2">
                  Last Name*
                </label>
                <input 
                  type="text" 
                  placeholder="Cruz" 
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="border-none border-b border-[#ddd] py-[0.85rem] px-1 font-['Inter'] text-base bg-transparent outline-none focus:border-b-[#2c2c2c]"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-7">
              <div className="flex flex-col">
                <label className="font-['Inter'] text-sm tracking-[0.06em] text-[#666] mb-2">
                  Email*
                </label>
                <input 
                  type="email" 
                  placeholder="youremail@gmail.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-none border-b border-[#ddd] py-[0.85rem] px-1 font-['Inter'] text-base bg-transparent outline-none focus:border-b-[#2c2c2c]"
                />
              </div>
              <div className="flex flex-col">
                <label className="font-['Inter'] text-sm tracking-[0.06em] text-[#666] mb-2">
                  Phone Number*
                </label>
                <input 
                  type="tel" 
                  placeholder="+1 000 000 00" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="border-none border-b border-[#ddd] py-[0.85rem] px-1 font-['Inter'] text-base bg-transparent outline-none focus:border-b-[#2c2c2c]"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-7">
              <div className="flex flex-col">
                <label className="font-['Inter'] text-sm tracking-[0.06em] text-[#666] mb-2">
                  Your Country*
                </label>
                <input 
                  type="text" 
                  placeholder="USA" 
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="border-none border-b border-[#ddd] py-[0.85rem] px-1 font-['Inter'] text-base bg-transparent outline-none focus:border-b-[#2c2c2c]"
                />
              </div>
              <div className="flex flex-col">
                <label className="font-['Inter'] text-sm tracking-[0.06em] text-[#666] mb-2">
                  How did you hear about us?*
                </label>
                <input 
                  type="text" 
                  placeholder="Instagram" 
                  value={heardFrom}
                  onChange={(e) => setHeardFrom(e.target.value)}
                  className="border-none border-b border-[#ddd] py-[0.85rem] px-1 font-['Inter'] text-base bg-transparent outline-none focus:border-b-[#2c2c2c]"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-8 mb-7">
              <div className="flex flex-col">
                <label className="font-['Inter'] text-sm tracking-[0.06em] text-[#666] mb-2">
                  Message
                </label>
                <textarea 
                  rows={5} 
                  placeholder="Tell us about your trip..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="border-none border-b border-[#ddd] py-[0.85rem] px-1 font-['Inter'] text-base bg-transparent outline-none focus:border-b-[#2c2c2c] resize-none"
                ></textarea>
              </div>
            </div>
            {submitMsg && (
              <div className="text-right mb-3 font-['Inter'] text-sm text-[#333]">{submitMsg}</div>
            )}
            <div className="text-right mt-2">
              <button 
                type="submit" 
                disabled={submitting}
                className="bg-[#2c2c2c] text-white border-none py-[0.9rem] px-6 rounded cursor-pointer font-['Inter'] text-base hover:bg-[#1a1a1a] transition-colors duration-200 disabled:opacity-50"
              >
                {submitting ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </form>
        </div>
      </section>

      <Footer />
      <Menu isOpen={isMenuOpen} onClose={closeMenu} />
    </div>
  )
}

export default HomepageContactPage
