import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./style.css"

const AboutPage = () => {
  const sectionRefs = {
    hero: useRef<HTMLDivElement>(null),
    mission: useRef<HTMLDivElement>(null),
    vision: useRef<HTMLDivElement>(null),
    team: useRef<HTMLDivElement>(null),
  };

  useEffect(() => {
    // Hero animation
    if (sectionRefs.hero.current) {
      gsap.fromTo(
        sectionRefs.hero.current.querySelectorAll(".animate-on-scroll"),
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power3.out" }
      );
    }

    // Mission section animation
    if (sectionRefs.mission.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              gsap.fromTo(
                entry.target.querySelectorAll(".animate-on-scroll"),
                { x: -50, opacity: 0 },
                {
                  x: 0,
                  opacity: 1,
                  duration: 0.8,
                  stagger: 0.2,
                  ease: "power3.out",
                }
              );
            }
          });
        },
        { threshold: 0.3 }
      );
      observer.observe(sectionRefs.mission.current);
    }

    // Vision section animation
    if (sectionRefs.vision.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              gsap.fromTo(
                entry.target.querySelectorAll(".animate-on-scroll"),
                { x: 50, opacity: 0 },
                {
                  x: 0,
                  opacity: 1,
                  duration: 0.8,
                  stagger: 0.2,
                  ease: "power3.out",
                }
              );
            }
          });
        },
        { threshold: 0.3 }
      );
      observer.observe(sectionRefs.vision.current);
    }

    // Team section animation
    if (sectionRefs.team.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              gsap.fromTo(
                entry.target.querySelectorAll(".animate-on-scroll"),
                { y: 30, opacity: 0 },
                {
                  y: 0,
                  opacity: 1,
                  duration: 0.6,
                  stagger: 0.1,
                  ease: "power2.out",
                }
              );
            }
          });
        },
        { threshold: 0.2 }
      );
      observer.observe(sectionRefs.team.current);
    }
  }, []);

  const teamMembers = [
    {
      name: "Michael Chen",
      role: "Head of Operations",
      image: "/images/PXL_20241111_192620770.RAW-01.COVER.jpg",
      bio: "Expert in logistics and customer experience",
    },
    {
      name: "Emily Rodriguez",
      role: "Travel Specialist",
      image: "/images/PXL_20241114_144124542.RAW-01.COVER.jpg",
      bio: "Cultural expert and local guide coordinator",
    },
    {
      name: "David Thompson",
      role: "Marketing Director",
      image: "/images/PXL_20241114_160932760.RAW-01.COVER.jpg",
      bio: "Creative storyteller and brand strategist",
    },
    {
      name: "Bob Lash",
      role: "Customer Experience Manager",
      image: "/images/PXL_20241114_190604108.RAW-01.MP.COVER.jpg",
      bio: "Dedicated to ensuring every trip is memorable",
    },
    {
      name: "James Wilson",
      role: "Adventure Guide",
      image: "/images/DSC_4436.JPG",
      bio: "Outdoor enthusiast with 10 years of guiding experience",
    },
    {
      name: "Sarah Johnson",
      role: "CEO & Founder",
      image: "/images/DSC_4854.JPG",
      bio: "Passionate traveler with 15+ years in the industry",
    },
  ];

  const values = [
    {
      title: "Passion",
      description:
        "We're driven by our love for travel and our desire to share the world's beauty with others.",
      icon: (
        <svg
          className="w-8 h-8 text-teal-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      ),
    },
    {
      title: "Excellence",
      description:
        "We strive for the highest standards in every aspect of our service and operations.",
      icon: (
        <svg
          className="w-8 h-8 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      title: "Community",
      description:
        "We believe in building connections and supporting the communities we visit.",
      icon: (
        <svg
          className="w-8 h-8 text-purple-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    },
    {
      title: "Sustainability",
      description:
        "We're committed to responsible tourism that protects our planet for future generations.",
      icon: (
        <svg
          className="w-8 h-8 text-yellow-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section id="yy"
        ref={sectionRefs.hero}
        className="relative py-16 bg-[#3e7670] text-white"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="animate-on-scroll text-4xl md:text-5xl font-bold mb-6">
              About Travel Beyond Tours
            </h1>
            <p className="animate-on-scroll text-lg md:text-xl text-teal-100 max-w-3xl mx-auto leading-relaxed">
              We're passionate about creating extraordinary travel experiences
              that connect you with the world's most beautiful destinations.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <div className="flex items-center">
        <section ref={sectionRefs.mission} className="py-16 bg-white">
          <div className="max-w-5xl  px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-10 items-center">
              <div className="lg:w-1/2">
                <h2 className="animate-on-scroll text-3xl font-bold text-gray-900 mb-6">
                  Our Mission
                </h2>
                <p className="animate-on-scroll text-gray-600 mb-6 leading-relaxed">
                  To make extraordinary travel experiences accessible to
                  everyone by providing carefully curated tours, exceptional
                  service, and authentic cultural connections that create
                  lasting memories.
                </p>
                <p className="animate-on-scroll text-gray-600 leading-relaxed">
                  We believe that travel has the power to transform lives,
                  broaden perspectives, and create meaningful connections
                  between people and places around the world.
                </p>
              </div>
              <div className="animate-on-scroll lg:w-1/2">
                <img
                  src="/images/DSC_2904.JPG"
                  alt="Our mission in action - exploring beautiful destinations"
                  className="rounded-lg shadow-md"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Vision Section */}
        <section ref={sectionRefs.vision} className="py-16 bg-gray-50">
          <div className="max-w-5xl w-full px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-10 items-center">
              <div className="animate-on-scroll lg:w-1/2 order-2 lg:order-1">
                <img
                  src="/images/DSC_4045.JPG"
                  alt="Our vision of sustainable and memorable travel experiences"
                  className="rounded-lg shadow-md"
                />
              </div>
              <div className="lg:w-1/2 order-1 lg:order-2">
                <h2 className="animate-on-scroll text-3xl font-bold text-gray-900 mb-6">
                  Our Vision
                </h2>
                <p className="animate-on-scroll text-gray-600 mb-6 leading-relaxed">
                  To be the world's most trusted travel partner, known for our
                  commitment to sustainable tourism, cultural preservation, and
                  creating positive impact in the communities we visit.
                </p>
                <p className="animate-on-scroll text-gray-600 leading-relaxed">
                  We envision a future where travel brings people together,
                  promotes understanding, and contributes to the preservation of
                  our planet's natural and cultural heritage.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className=" flex items-center sm:flex-nowrap justify-center">
            {values.map((value, index) => (
              <div
                key={index}
                className="text-center p-5 bg-gray-50 rounded-lg"
              >
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                  {value.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="hidden md:!inline-block text-gray-600 text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section ref={sectionRefs.team} className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The passionate people behind your amazing travel experiences
            </p>
          </div>

          <div className="animate-on-scroll">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={30}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 5000 }}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                },
                1024: {
                  slidesPerView: 3,
                },
                1280: {
                  slidesPerView: 4,
                },
              }}
              className="team-swiper pb-12"
            >
              {teamMembers.map((member, index) => (
                <SwiperSlide key={index}>
                  <div className="text-center bg-white p-6 rounded-lg shadow-sm h-full">
                    <div className="relative mb-5">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-28 h-28 rounded-full mx-auto object-cover"
                      />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {member.name}
                    </h3>
                    <p className="text-teal-600 font-medium mb-3">
                      {member.role}
                    </p>
                    <p className="text-gray-600 text-sm">{member.bio}</p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
