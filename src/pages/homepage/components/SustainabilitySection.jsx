import { useState } from 'react'

const slides = [
  {
    id: 1,
    titleLines: ["UN's 17 Goals for", 'Sustainable', 'Development'],
    description:
      'The United Nations Sustainability Development Goals are a blueprint to achieve a better and more sustainable future for all. Education, opportunities, equality and inclusion, applied to hospitality. Read about how Awasi works to meet these standards daily.'
  },
  {
    id: 2,
    titleLines: ['Protecting', 'Local Biodiversity'],
    description:
      'We work to preserve native flora and fauna through careful route planning, guest education and ongoing conservation partnerships.'
  },
  {
    id: 3,
    titleLines: ['Responsible', 'Water Usage'],
    description:
      'Efficient systems and constant monitoring reduce consumption while ensuring guest comfort and safety at all times.'
  },
  {
    id: 4,
    titleLines: ['Community &', 'Cultural Heritage'],
    description:
      'We collaborate with local communities, prioritize fair employment and celebrate cultural traditions respectfully.'
  },
  {
    id: 5,
    titleLines: ['Circular', 'Waste Practices'],
    description:
      'From procurement to recycling, we minimize waste and promote reuse to reduce our environmental footprint.'
  },
  {
    id: 6,
    titleLines: ['Low-Impact', 'Exploration'],
    description:
      'Private excursions are designed to protect fragile ecosystems while providing meaningful, educational experiences.'
  }
]

export default function SustainabilitySection() {
  const [active, setActive] = useState(4)
  const current = slides[active - 1]

  return (
    <section className="relative w-full h-screen overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        aria-hidden="true"
        style={{ 
          backgroundImage: 
          'url(https://res.cloudinary.com/dfoetpdk9/image/upload/v1761722535/xvfxycdxnp6kai6gmqki.jpg)' }}
      />

      <div className="relative z-[1] w-full h-full flex items-end pb-10">
        <div className="bg-[rgba(60,54,51,0.96)] text-white w-full max-w-[460px] ml-11 p-11 px-9 rounded shadow-[0_14px_36px_rgba(0,0,0,0.28)]">
          <h2 className="font-['Playfair_Display'] font-normal tracking-tight leading-[1.15] mb-5">
            {current.titleLines.map((line, idx) => (
              <span key={idx} className="block text-[clamp(2rem,3.2vw,2.8rem)]">{line}</span>
            ))}
          </h2>
          <p className="font-['Inter'] text-base leading-[1.7] text-[#e0ddd9] mb-7">{current.description}</p>

          <div className="flex items-center gap-3" role="tablist" aria-label="Sustainability topics">
            {slides.map((s) => (
              <button
                key={s.id}
                className={`w-[34px] h-[34px] rounded-md bg-transparent border border-white/30 text-white font-['Inter'] text-sm cursor-pointer transition-all duration-[250ms] ease-out hover:-translate-y-px ${
                  active === s.id ? 'bg-white/10 border-white/50' : ''
                }`}
                onClick={() => setActive(s.id)}
                aria-selected={active === s.id}
                aria-label={`Slide ${s.id}`}
              >
                {s.id}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

