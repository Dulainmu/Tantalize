"use client";

// Legacy Timeline – Cinematic showcase of past Tantalize years
// - Dark gradient background with subtle gold particles
// - Interactive horizontal timeline (2017 → 2024 per provided data)
// - Dynamic content card fades/slides when switching years
// - Fully responsive with scrollable timeline on mobile

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
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

      {/* Hero header (banner) */}
      <div className="relative w-full min-h-screen overflow-hidden">
        <motion.img
          src="/2024_Crowd.JPG"
          alt="Crowd celebrating during the 2024 Tantalize edition"
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
          decoding="async"
          initial={{ scale: 1.08, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          style={{ willChange: 'transform' }}
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/35 to-black/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
        {/* Animated light beams overlay */}
        <div className="legacy-hero-beams" aria-hidden />
        <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col items-center justify-center px-6 text-center">
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

          {/* Year selector over the banner */}
          <div
            role="tablist"
            aria-label="Tantalize Legacy Years"
            className="no-scrollbar mt-6 flex w-full items-center justify-center gap-3 overflow-x-auto pb-2 md:gap-4"
          >
            {years.map((y) => {
              const active = y === selectedYear;
              return (
                <button
                  key={y}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSelectedYear(y)}
                  className={`inline-flex shrink-0 items-center justify-center rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD700]/70 md:px-5 md:py-2.5 ${
                    active
                      ? "border-[#FFD700]/70 bg-[#FFD700] text-[#0A0E27] shadow-[0_0_22px_rgba(255,215,0,0.5)]"
                      : "border-white/20 bg-white/10 text-white/85 hover:border-[#FFD700]/50 hover:bg-[#FFD700]/15 hover:text-white"
                  }`}
                >
                  {y}
                </button>
              );
            })}
          </div>

          {/* Condensed current year info over the banner */}
          {/* Static summary card (no crossfade/hover lift) */}
          <div
            className="group relative mt-8 mx-auto w-[min(92%,_1100px)] overflow-hidden rounded-3xl border border-white/10 bg-white/10 p-7 backdrop-blur-xl md:p-8 lg:p-10"
          >
              {/* sheen + corner ornaments for premium feel */}
              <span className="gold-sheen" aria-hidden />
              <span className="corner-ornament corner-ornament--tl" aria-hidden />
              <span className="corner-ornament corner-ornament--br" aria-hidden />
              <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-[minmax(0,1.4fr)_minmax(260px,1fr)]">
                <div className="w-full">
                  <h3 className="text-center text-2xl font-semibold text-white md:text-left md:text-3xl">{current.title}</h3>
                  <p className="mt-3 text-center text-base leading-relaxed text-white/85 md:text-left md:text-lg">
                    {current.description}
                  </p>
                  <div className="mt-4 flex justify-center md:justify-start">
                    <button className="inline-flex items-center justify-center rounded-full border border-[#FFD700]/50 bg-[#FFD700]/10 px-6 py-2.5 text-sm font-semibold text-[#FFD700] transition-colors hover:bg-[#FFD700]/20">
                      Watch Recap
                    </button>
                  </div>
                </div>
                <div className="grid w-full grid-cols-2 gap-3 md:w-auto md:min-w-[260px] md:justify-self-end">
                  {["Image 1", "Image 2"].map((label) => (
                    <div
                      key={label}
                      className="relative h-20 md:h-24 overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-[#0A0E27] to-[#111536]"
                    >
                      <div className="absolute inset-0 grid place-items-center text-center">
                        <span className="text-[11px] text-white/70">{label}</span>
                      </div>
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,215,0,0.08),_transparent_65%)]" />
                    </div>
                  ))}
                </div>
              </div>
          </div>
        </div>
      </div>

      {/* Detail card removed to avoid duplication; summary lives on banner */}
    </section>
  );
}
