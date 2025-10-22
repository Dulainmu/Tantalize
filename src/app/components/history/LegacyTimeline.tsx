"use client";

// Legacy Timeline – Cinematic showcase of past Tantalize years
// - Dark gradient background with subtle gold particles
// - Interactive horizontal timeline (2017 → 2024 per provided data)
// - Dynamic content card fades/slides when switching years
// - Fully responsive with scrollable timeline on mobile

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Playfair_Display, Poppins } from "next/font/google";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["600"], variable: "--font-playfair" });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-poppins-local" });

// Event data (2017–2024 per requirements)
const legacyEvents = [
  {
    year: 2017,
    title: "Tantalize 2017",
    description:
      "With over 300 applicants and 20 finalists competing across 7 different categories, Tantalize 2017 was a show of brilliance held at the D.S. Senanayake Auditorium. With more than 1,200 people in attendance, the event showcased some of the best youth talent in the country — a truly unforgettable night.",
    images: ["/legacy/2017_1.jpg", "/legacy/2017_2.jpg"],
  },
  {
    year: 2018,
    title: "Tantalize 2018",
    description:
      "The 10th edition of Tantalize brought together over 1,300 attendees and featured iconic performances from some of Sri Lanka’s best-loved music artists. It was an emotional and powerful evening, marking a decade of creative excellence.",
    images: ["/legacy/2018_1.jpg", "/legacy/2018_2.jpg"],
  },
  {
    year: 2019,
    title: "Tantalize 2019",
    description:
      "The 11th edition gave audiences something new — a special ‘Rewind’ concept, where past winners took the stage once again. It was a nostalgic celebration of talent, bringing back champions to relive their best moments and connect with a fresh audience.",
    images: ["/legacy/2019_1.jpg", "/legacy/2019_2.jpg"],
  },
  {
    year: 2022,
    title: "Tantalize 2022",
    description:
      "After a break, Tantalize returned stronger than ever. Held at the iconic Nelum Pokuna Theatre, the 12th edition featured powerful band performances and a vibrant crowd. The energy was unforgettable, making it one of the most talked-about editions yet.",
    images: ["/legacy/2022_1.jpg", "/legacy/2022_2.jpg"],
  },
  {
    year: 2023,
    title: "Tantalize 2023",
    description:
      "The 13th edition, also held at Nelum Pokuna, continued the legacy with electrifying performances from top artists and university stars. The bands lit up the night with unmatched energy, leaving the audience in awe.",
    images: ["/legacy/2023_1.jpg", "/legacy/2023_2.jpg"],
  },
  {
    year: 2024,
    title: "Tantalize 2024",
    description:
      "Tantalize 2024 featured a star-studded lineup including Hana Shafa, Bathiya & Santhush, Yaka Crew, Gayya, Wasthi, Chanuka, and Dilo. It was a celebration of youth talent alongside Sri Lanka’s top icons — a night that solidified Tantalize’s place in the nation’s cultural calendar.",
    images: ["/legacy/2024_1.jpg", "/legacy/2024_2.jpg"],
  },
];

export default function LegacyTimeline() {
  const [selectedYear, setSelectedYear] = useState(legacyEvents[legacyEvents.length - 1].year);

  const current = useMemo(() => legacyEvents.find((e) => e.year === selectedYear) || legacyEvents[legacyEvents.length - 1], [selectedYear]);
  const years = useMemo(() => legacyEvents.map((e) => e.year), []);

  return (
    <section id="legacy" className="relative overflow-hidden">
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

      <div className={`relative mx-auto max-w-6xl px-6 py-20 md:py-24 ${poppins.className}`}>
        {/* Section header */}
        <motion.header
          className="mx-auto mb-12 max-w-3xl text-center md:mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs uppercase tracking-[0.5em] text-[#FFD700]/80">OUR LEGACY</p>
          <h2 className={`${playfair.className} mt-3 text-3xl font-semibold text-white md:text-4xl`}>
            “Relive the Years that Made Tantalize Legendary”
          </h2>
          <motion.div
            className="mx-auto mt-6 h-px w-48 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
        </motion.header>

        {/* Horizontal timeline */}
        <div className="relative mb-10 md:mb-12">
          <div
            role="tablist"
            aria-label="Tantalize Legacy Years"
            className="no-scrollbar relative flex items-center gap-3 overflow-x-auto pb-2 md:justify-center md:gap-4"
          >
            {years.map((y, idx) => {
              const active = y === selectedYear;
              return (
                <div key={y} className="relative flex items-center">
                  <button
                    role="tab"
                    aria-selected={active}
                    onClick={() => setSelectedYear(y)}
                    className={`inline-flex shrink-0 items-center justify-center rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD700]/70 md:px-5 md:py-2.5 ${
                      active
                        ? "border-[#FFD700]/70 bg-[#FFD700] text-[#0A0E27] shadow-[0_0_22px_rgba(255,215,0,0.5)]"
                        : "border-white/15 bg-white/5 text-white/80 hover:border-[#FFD700]/50 hover:bg-[#FFD700]/10 hover:text-white"
                    }`}
                  >
                    {y}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic content card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.year}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_35px_120px_-35px_rgba(255,215,0,0.25)] backdrop-blur-xl md:p-10"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,215,0,0.08),_transparent_60%)]" />
            <div className="relative grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
              <div>
                <h3 className={`${playfair.className} text-2xl font-semibold text-white md:text-3xl`}>
                  {current.title}
                </h3>
                <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/80">{current.description}</p>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button
                    className="inline-flex items-center justify-center rounded-full border border-[#FFD700]/50 bg-[#FFD700]/10 px-5 py-2 text-sm font-semibold text-[#FFD700] transition-colors hover:bg-[#FFD700]/20"
                  >
                    Watch Recap
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                {current.images.slice(0, 3).map((src, i) => (
                  <motion.div
                    key={src}
                    className="relative h-32 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#0A0E27] to-[#111536] md:h-40"
                    whileHover={{ y: -4 }}
                    transition={{ type: "spring", stiffness: 240, damping: 20 }}
                  >
                    {/* Mock image placeholder; replace with next/image if assets exist */}
                    <div className="absolute inset-0 grid place-items-center text-center">
                      <span className="text-xs text-white/60">Image {i + 1}</span>
                    </div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,215,0,0.08),_transparent_65%)]" />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
