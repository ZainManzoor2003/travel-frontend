import { useState } from 'react'
import { useLanguage } from '../../contexts/LanguageContext'

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
  const { language } = useLanguage()
  const [active, setActive] = useState(4)
  const slidesLocalized = language === 'es' ? [
    { id: 1, titleLines: ['17 objetivos de la ONU para', 'el Desarrollo', 'Sostenible'], description: 'Los Objetivos de Desarrollo Sostenible de la ONU son una hoja de ruta para un futuro mejor y más sostenible. Educación, oportunidades, igualdad e inclusión aplicadas a la hospitalidad.' },
    { id: 2, titleLines: ['Protegiendo', 'la biodiversidad local'], description: 'Preservamos la flora y fauna nativas mediante planificación de rutas, educación a los huéspedes y alianzas de conservación.' },
    { id: 3, titleLines: ['Uso responsable', 'del agua'], description: 'Sistemas eficientes y monitoreo constante reducen el consumo sin comprometer la comodidad ni la seguridad.' },
    { id: 4, titleLines: ['Comunidad y', 'patrimonio cultural'], description: 'Colaboramos con comunidades locales, priorizamos empleo justo y celebramos las tradiciones con respeto.' },
    { id: 5, titleLines: ['Prácticas', 'circulares de residuos'], description: 'Desde la compra hasta el reciclaje, minimizamos residuos y promovemos la reutilización.' },
    { id: 6, titleLines: ['Exploración', 'de bajo impacto'], description: 'Las excursiones privadas protegen ecosistemas frágiles y ofrecen experiencias significativas y educativas.' },
  ] : slides
  const current = slidesLocalized[active - 1]

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
            {slidesLocalized.map((s) => (
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

