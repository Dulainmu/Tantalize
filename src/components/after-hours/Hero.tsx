"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

export default function Hero() {
  return (
    <section className="ah-grid-bg relative overflow-hidden px-6 pt-16 pb-14 sm:px-10 sm:pt-20">
      <div className="ah-grain" />
      <div
        className="ah-blob ah-blob-1 -left-24 -top-24 h-72 w-72 bg-fuchsia-600/25"
        aria-hidden
      />
      <div
        className="ah-blob ah-blob-2 -right-16 top-10 h-80 w-80 bg-blue-600/20"
        aria-hidden
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative"
      >
        <motion.p
          variants={item}
          className="text-xs tracking-[0.25em] text-white/50"
          style={{ fontFamily: "var(--font-ah-mono), monospace" }}
        >
          STUDENT ACTIVITY CLUB, APIIT — PRESENTS
        </motion.p>

        <motion.h1
          variants={item}
          data-text="AFTER HOURS"
          className="ah-glitch mt-4 text-[15vw] font-extrabold uppercase leading-[0.85] tracking-tight sm:text-[9vw] lg:text-[7vw]"
          style={{ fontFamily: "var(--font-ah-display), sans-serif" }}
        >
          AFTER HOURS
        </motion.h1>

        <motion.p variants={item} className="mt-6 max-w-xl text-lg text-white/70 sm:text-xl">
          One stage. Endless talent. Sri Lanka&rsquo;s inter-university talent
          competition — the official qualifying stage for{" "}
          <span className="text-white">Tantalize 2026</span>.
        </motion.p>

        <motion.div variants={item} className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/after-hours/register"
            className="group relative overflow-hidden rounded-sm bg-gradient-to-r from-fuchsia-500 to-blue-500 px-8 py-3.5 text-sm font-semibold uppercase tracking-wide text-white transition-transform hover:scale-[1.03]"
          >
            <span className="relative z-10">Register to Perform</span>
            <span className="absolute inset-0 -translate-x-full bg-white/25 transition-transform duration-500 group-hover:translate-x-0" />
          </Link>
          <a
            href="#about"
            className="rounded-sm border border-white/25 px-8 py-3.5 text-sm font-semibold uppercase tracking-wide text-white/80 transition-colors hover:border-white/60 hover:text-white"
          >
            What is After Hours
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
