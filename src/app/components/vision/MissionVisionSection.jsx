"use client";

// Mission & Vision cinematic section for Tantalize 2025
// - Dark blue to deep indigo gradient background with subtle gold particles
// - Two premium glassmorphism cards with gold gradient borders
// - Staggered Framer Motion animations
// - Responsive: stacked on mobile, side-by-side on desktop

import { motion } from "framer-motion";
import { useState } from "react";
import { Playfair_Display, Poppins } from "next/font/google";

// Typography: Playfair Display for headings, Poppins for body
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["600"], variable: "--font-playfair" });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-poppins-local" });

// Animation presets
const fadeIn = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeInOut" } } };
const fadeUp = (delay = 0) => ({ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeInOut", delay } } });

// Fixed particle field to avoid SSR randomness
const particles = [
  { top: "10%", left: "12%", size: 2 },
  { top: "16%", left: "28%", size: 3 },
  { top: "22%", left: "68%", size: 2 },
  { top: "28%", left: "42%", size: 2 },
  { top: "34%", left: "18%", size: 3 },
  { top: "38%", left: "82%", size: 2 },
  { top: "44%", left: "55%", size: 3 },
  { top: "50%", left: "72%", size: 2 },
  { top: "56%", left: "36%", size: 2 },
  { top: "62%", left: "14%", size: 2 },
  { top: "68%", left: "60%", size: 3 },
  { top: "74%", left: "78%", size: 2 },
  { top: "80%", left: "32%", size: 2 },
  { top: "86%", left: "48%", size: 3 },
];

export default function MissionVisionSection({
  eyebrow,
  heading = "Where Talent Meets Purpose",
  missionTitle = "Our Mission",
  visionTitle = "Our Vision",
} = {}) {
  // spotlight coords for interactive glow
  const [spotMission, setSpotMission] = useState({ x: 140, y: 100 });
  const [spotVision, setSpotVision] = useState({ x: 140, y: 100 });

  const onMove = (e, setSpot) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setSpot({ x, y });
  };

  return (
    <section
      id="mission"
      aria-labelledby="mission-vision-heading"
      className="relative overflow-hidden"
    >
      {/* Cinematic background overlays (no background gradient to keep solid base) */}
      {/* Aurora orbs for depth */}
      <motion.div
        aria-hidden
        className="aurora-orb absolute -top-20 -right-24 h-[420px] w-[420px]"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.5 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="aurora-orb absolute bottom-[-120px] left-[-80px] h-[360px] w-[360px]"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.45 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: "easeInOut", delay: 0.1 }}
      />

      {/* Subtle moving gold particles */}
      <div className="pointer-events-none absolute inset-0">
        {particles.map((p, i) => (
          <motion.span
            key={`p-${i}`}
            className="absolute rounded-full bg-[#FFD700]/30 shadow-[0_0_12px_rgba(255,215,0,0.45)]"
            style={{ top: p.top, left: p.left, width: p.size + 1, height: p.size + 1 }}
            initial={{ opacity: 0.25 }}
            animate={{ y: [0, -10, 0], x: [0, 6, 0], opacity: [0.2, 0.65, 0.2] }}
            transition={{ duration: 6 + i * 0.15, repeat: Infinity, ease: "easeInOut", delay: i * 0.08 }}
            aria-hidden
          />
        ))}
      </div>

      {/* Grain overlay for cinematic texture */}
      <div className="grain-overlay absolute inset-0" aria-hidden />

      {/* Content container */}
      <div className={`relative mx-auto max-w-6xl px-6 py-20 md:py-24 ${poppins.className}`}>
        {/* Header */}
        <motion.header
          className="mx-auto mb-12 max-w-3xl text-center md:mb-16"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeIn}
        >
          {eyebrow && (
            <p className="text-xs uppercase tracking-[0.5em] text-[#FFD700]/80">{eyebrow}</p>
          )}
          <h2 id="mission-vision-heading" className={`${playfair.className} mt-3 text-3xl font-semibold text-white md:text-4xl`}>
            <span className="text-gradient-gold">{heading}</span>
          </h2>
          {/* Animated divider */}
          <motion.div
            className="mx-auto mt-6 h-px w-48 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
          <p className="mx-auto mt-4 max-w-xl text-sm text-white/75">
            Cinematic craftsmanship meets purpose—celebrating youth, culture, and community.
          </p>
        </motion.header>

        {/* Unity line between cards (desktop only) */}
        <div className="relative">
          <div className="pointer-events-none absolute left-1/2 top-6 hidden -translate-x-1/2 md:block">
            <motion.div
              className="h-[calc(100%-3rem)] w-[2px] bg-gradient-to-b from-transparent via-[#FFD700] to-transparent blur-[1px]"
              initial={{ opacity: 0.2 }}
              whileInView={{ opacity: 0.9 }}
              animate={{ opacity: [0.4, 0.9, 0.4] }}
              viewport={{ once: false }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* Spark runner */}
            <span className="spark-runner" aria-hidden />
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 md:gap-8">
            {/* Mission Card */}
            <motion.article
              className="relative rounded-3xl p-[1px]"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeUp(0.1)}
            >
              {/* Gold gradient border */}
              <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-[#FFD700]/55 via-[#FFD700]/25 to-transparent blur-[2px]" aria-hidden />
              <div
                className="group relative flex h-full min-h-[280px] flex-col overflow-hidden rounded-[22px] border border-white/10 bg-white/10 p-7 backdrop-blur-xl transition-transform duration-500 ease-in-out hover:-translate-y-1 hover:border-[#FFD700]/40 hover:shadow-[0_35px_120px_-35px_rgba(255,215,0,0.35)] md:p-8"
                onMouseMove={(e) => onMove(e, setSpotMission)}
              >
                {/* Top accent line */}
                <span className="card-accent" aria-hidden />
                {/* Sheen */}
                <span className="gold-sheen" aria-hidden />
                {/* Corner ornaments */}
                <span className="corner-ornament corner-ornament--tl" aria-hidden />
                <span className="corner-ornament corner-ornament--br" aria-hidden />
                {/* Pulsing gold ring */}
                <span className="gold-ring gold-ring--left" aria-hidden />
                {/* Interactive spotlight */}
                <span
                  className="spotlight-glow"
                  style={{ ["--px"]: `${spotMission.x}px`, ["--py"]: `${spotMission.y}px` }}
                  aria-hidden
                />
                <header className="mb-3 text-center">
                  <h3 className={`${playfair.className} text-2xl font-semibold text-white md:text-3xl`}>{missionTitle}</h3>
                </header>
                <p className="mx-auto max-w-prose text-center text-base leading-relaxed text-white/80">
                  “To celebrate and empower Sri Lankan youth by showcasing their talent on a national platform while giving back to society through education and community-driven causes.”
                </p>
              </div>
            </motion.article>

            {/* Vision Card */}
            <motion.article
              className="relative rounded-3xl p-[1px]"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeUp(0.3)}
            >
              {/* Gold gradient border */}
              <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-[#FFD700]/55 via-[#FFD700]/25 to-transparent blur-[2px]" aria-hidden />
              <div
                className="group relative flex h-full min-h-[280px] flex-col overflow-hidden rounded-[22px] border border-white/10 bg-white/10 p-7 backdrop-blur-xl transition-transform duration-500 ease-in-out hover:-translate-y-1 hover:border-[#FFD700]/40 hover:shadow-[0_35px_120px_-35px_rgba(255,215,0,0.35)] md:p-8"
                onMouseMove={(e) => onMove(e, setSpotVision)}
              >
                {/* Top accent line */}
                <span className="card-accent" aria-hidden />
                {/* Sheen */}
                <span className="gold-sheen" aria-hidden />
                {/* Corner ornaments */}
                <span className="corner-ornament corner-ornament--tl" aria-hidden />
                <span className="corner-ornament corner-ornament--br" aria-hidden />
                {/* Pulsing gold ring */}
                <span className="gold-ring gold-ring--right" aria-hidden />
                {/* Interactive spotlight */}
                <span
                  className="spotlight-glow"
                  style={{ ["--px"]: `${spotVision.x}px`, ["--py"]: `${spotVision.y}px` }}
                  aria-hidden
                />
                <header className="mb-3 text-center">
                  <h3 className={`${playfair.className} text-2xl font-semibold text-white md:text-3xl`}>{visionTitle}</h3>
                </header>
                <p className="mx-auto max-w-prose text-center text-base leading-relaxed text-white/80">
                  “To create a legacy that unites creativity, culture, and compassion — building a future where every stage inspires change.”
                </p>
              </div>
            </motion.article>
          </div>
        </div>

        {/* Footer quote */}
        <motion.footer
          className="mx-auto mt-12 max-w-3xl text-center md:mt-16"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeIn}
        >
          <blockquote className={`${playfair.className} text-xl text-white/85 md:text-2xl`}>
            “Talent is power — purpose gives it direction.”
          </blockquote>
          <p className="mt-2 text-sm uppercase tracking-[0.3em] text-[#FFD700]/80">— Tantalize 2025 Team</p>
        </motion.footer>
      </div>
    </section>
  );
}
