"use client";

// Legacy Timeline – Cinematic showcase of past Tantalize years
// - Dark gradient background with subtle gold particles
// - Interactive horizontal timeline (2017 → 2024 per provided data)
// - Dynamic content card fades/slides when switching years
// - Fully responsive with scrollable timeline on mobile

import { useMemo, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Playfair_Display, Poppins } from "next/font/google";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronRight, Play } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["600"], variable: "--font-playfair" });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-poppins-local" });

// Event data (2017–2024 per requirements)
const legacyEvents = [
  {
    year: 2017,
    title: "Tantalize 2017",
    description:
      "With over 300 applicants and 20 finalists competing across 7 different categories, Tantalize 2017 was a show of brilliance held at the D.S. Senanayake Auditorium. With more than 1,200 people in attendance, the event showcased some of the best youth talent in the country — a truly unforgettable night.",
    images: ["/tantalize2017.webp", "/tantalize2017(1).webp"],
    videoUrl: "https://www.youtube.com/watch?v=D_6SxVwXnbw",
  },
  {
    year: 2018,
    title: "Tantalize 2018",
    description:
      "The 10th edition of Tantalize brought together over 1,300 attendees and featured iconic performances from some of Sri Lanka’s best-loved music artists. It was an emotional and powerful evening, marking a decade of creative excellence.",
    images: ["/Tantalize2018.webp", "/Tantalize2018(1).webp"],
    videoUrl: "https://www.youtube.com/watch?v=4p3LCsWscZI&t=88s",
  },
  {
    year: 2019,
    title: "Tantalize 2019",
    description:
      "The 11th edition gave audiences something new — a special ‘Rewind’ concept, where past winners took the stage once again. It was a nostalgic celebration of talent, bringing back champions to relive their best moments and connect with a fresh audience.",
    images: ["/Tantalize2019.jpg", "/tantalize2019(1).jpg"],
  },
  {
    year: 2022,
    title: "Tantalize 2022",
    description:
      "After a break, Tantalize returned stronger than ever. Held at the iconic Nelum Pokuna Theatre, the 12th edition featured powerful band performances and a vibrant crowd. The energy was unforgettable, making it one of the most talked-about editions yet.",
    images: ["/tantalize2022.webp", "/tantalize2022(1).webp"],
  },
  {
    year: 2023,
    title: "Tantalize 2023",
    description:
      "The 13th edition, also held at Nelum Pokuna, continued the legacy with electrifying performances from top artists and university stars. The bands lit up the night with unmatched energy, leaving the audience in awe.",
    images: ["/tantalize2023.webp", "/tantalize2023(1).webp"],
    videoUrl: "https://www.youtube.com/watch?v=QchhXo-jIpw",
  },
  {
    year: 2024,
    title: "Tantalize 2024",
    description:
      "Tantalize 2024 featured a star-studded lineup including Hana Shafa, Bathiya & Santhush, Yaka Crew, Gayya, Wasthi, Chanuka, and Dilo. It was a celebration of youth talent alongside Sri Lanka’s top icons — a night that solidified Tantalize’s place in the nation’s cultural calendar.",
    images: ["/tantalize2024.webp", "/tantalize2024(1).webp"],
    videoUrl: "/background-video.mp4",
  },
];

export default function LegacyTimeline() {
  const [selectedYear, setSelectedYear] = useState(legacyEvents[legacyEvents.length - 1].year);
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  const current = useMemo(() => legacyEvents.find((e) => e.year === selectedYear) || legacyEvents[legacyEvents.length - 1], [selectedYear]);
  const years = useMemo(() => legacyEvents.map((e) => e.year), []);



  // Scroll active year into view in the timeline
  useEffect(() => {
    if (timelineRef.current) {
      const activeBtn = timelineRef.current.querySelector(`[data-year="${selectedYear}"]`);
      if (activeBtn) {
        // Only scroll if the button is not fully visible
        const containerRect = timelineRef.current.getBoundingClientRect();
        const btnRect = activeBtn.getBoundingClientRect();

        if (btnRect.left < containerRect.left || btnRect.right > containerRect.right) {
          activeBtn.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
        }
      }
    }
  }, [selectedYear]);

  const handleRecapClick = () => {
    if (current.videoUrl) {
      window.open(current.videoUrl, "_blank");
    }
  };

  return (
    <section ref={sectionRef} id="legacy" className="relative overflow-hidden">
      <div ref={contentRef} className="relative min-h-screen">
        {/* Background layers with subtle particles and shimmer lines */}
        <div className="pointer-events-none absolute inset-0">
          {/* Gold particles */}
          {[...Array(18)].map((_, i) => (
            <motion.span
              key={i}
              className="absolute rounded-full bg-[#FFD700]/30"
              style={{
                width: 2 + (i % 2),
                height: 2 + (i % 2),
                left: `${(i * 97) % 100}%`,
                top: `${(i * 53) % 100}%`,
                boxShadow: "0 0 12px rgba(255,215,0,0.5)",
              }}
              initial={{ opacity: 0.2, y: 0 }}
              animate={{ opacity: [0.2, 0.7, 0.2], y: [-6, 6, -6] }}
              transition={{ duration: 6 + i * 0.15, repeat: Infinity, ease: "easeInOut", delay: i * 0.05 }}
              aria-hidden
            />
          ))}
        </div>

        {/* Hero header (banner) */}
        <div className="relative w-full min-h-[85vh] sm:min-h-[90vh] md:min-h-screen overflow-hidden">
          <AnimatePresence mode="popLayout">
            <motion.img
              key={current.year} // Re-animate background on year change
              src="/2024_Crowd.webp" // Keeping static background for consistency
              alt="Crowd celebrating"
              className="absolute inset-0 h-full w-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: 'linear' }}
              style={{ willChange: 'opacity' }}
            />
          </AnimatePresence>
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
          {/* Animated light beams overlay */}
          <div className="legacy-hero-beams" aria-hidden />
          <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col items-center justify-center px-4 sm:px-6 text-center pt-[180px] sm:pt-[200px] md:pt-[220px] pb-8 sm:pb-12 md:pb-0">
            <motion.p
              className="text-xs uppercase tracking-[0.5em] text-[#FFD700]/85"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.35, margin: '-20%' }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              OUR LEGACY
            </motion.p>
            <motion.h2
              className={`${playfair.className} mt-3 text-3xl font-semibold text-white md:text-5xl`}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.35, margin: '-20%' }}
              transition={{ duration: 0.7, ease: 'easeOut', delay: 0.05 }}
            >
              Relive the Years that Made Tantalize Legendary
            </motion.h2>
            <motion.div
              className="legacy-underline mx-auto mt-6 h-px w-48 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent"
              initial={{ scaleX: 0, opacity: 0 }}
              whileInView={{ scaleX: 1, opacity: 1 }}
              viewport={{ once: false, amount: 0.35, margin: '-20%' }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
            />

            {/* Interactive Timeline Slider */}
            <div className="relative w-full max-w-4xl mt-10 sm:mt-12 mb-8">
              {/* Connecting Line */}
              <div className="absolute top-1/2 left-0 w-full h-px bg-white/10 -translate-y-1/2" />

              <div
                ref={timelineRef}
                className="no-scrollbar flex w-full items-center justify-between overflow-x-auto px-4 py-4 scroll-smooth"
              >
                {years.map((y) => {
                  const active = y === selectedYear;
                  return (
                    <button
                      key={y}
                      data-year={y}
                      onClick={() => setSelectedYear(y)}
                      className="group relative flex flex-col items-center justify-center min-w-[80px] sm:min-w-[100px] focus:outline-none"
                    >
                      {/* Timeline Dot */}
                      <div className={`relative z-10 w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all duration-300 ${active
                        ? "bg-[#FFD700] shadow-[0_0_15px_rgba(255,215,0,0.6)] scale-125"
                        : "bg-white/30 group-hover:bg-[#FFD700]/50"
                        }`} />

                      {/* Year Label */}
                      <span className={`mt-3 sm:mt-4 text-xs sm:text-sm font-medium transition-colors duration-300 ${active ? "text-[#FFD700]" : "text-white/50 group-hover:text-white/80"
                        }`}>
                        {y}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content Card with AnimatePresence for smooth transitions */}
            <div className="relative w-[min(90%,_900px)] mx-auto min-h-[300px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedYear}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: "linear" }}
                  className="group relative overflow-visible rounded-2xl sm:rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-5 md:p-6 lg:p-8 backdrop-blur-xl"
                >
                  {/* sheen + corner ornaments for premium feel */}
                  <span className="gold-sheen" aria-hidden />
                  <span className="corner-ornament corner-ornament--tl" aria-hidden />
                  <span className="corner-ornament corner-ornament--br" aria-hidden />

                  <div className="grid grid-cols-1 items-start gap-6 sm:gap-8 lg:grid-cols-[1.2fr_1fr]">
                    <div className="w-full text-left">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/20 text-[#FFD700] text-xs font-bold tracking-wider">
                          {current.year} EDITION
                        </span>
                      </div>
                      <h3 className={`${playfair.className} text-2xl sm:text-3xl font-semibold text-white mb-4`}>
                        {current.title}
                      </h3>
                      <p className="text-sm sm:text-base leading-relaxed text-white/80 mb-6">
                        {current.description}
                      </p>

                      {current.videoUrl && (
                        <button
                          onClick={handleRecapClick}
                          className="group/btn inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FFD700] text-[#0A0E27] font-bold text-sm transition-all hover:bg-[#FFED4E] hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:shadow-[0_0_30px_rgba(255,215,0,0.5)]"
                        >
                          <Play className="w-4 h-4 fill-current" />
                          Watch Recap
                          <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      {current.images?.map((img, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.1 + idx * 0.1 }}
                          className={`relative overflow-hidden rounded-xl border border-white/10 bg-gray-900 ${idx === 0 ? 'aspect-[4/3]' : 'aspect-square mt-8'
                            }`}
                        >
                          <motion.img
                            src={img}
                            alt={`${current.title} highlight ${idx + 1}`}
                            className="absolute inset-0 h-full w-full object-cover"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.5 }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
