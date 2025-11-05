"use client";

import { motion } from "framer-motion";

type Props = {
  offset: { x: number; y: number };
  count?: number;
};

// Lightweight, reactive hero particles that drift subtly with mouse movement
export default function HeroParticles({ offset, count = 28 }: Props) {
  // Build a deterministic field so it doesn't reshuffle on rerenders
  const seeds = Array.from({ length: count }, (_, i) => i);

  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
      {seeds.map((i) => {
        // Spread across the canvas using simple hash-like math
        const left = ((i * 37) % 100) + (i % 2 ? 2 : -2); // slight offset
        const top = ((i * 19) % 100);
        const size = (i % 3) + 2; // 2–4px
        const strength = 0.6 + (i % 5) * 0.15; // different follow strengths
        return (
          <motion.span
            key={i}
            className="spark"
            style={{ left: `${left}%`, top: `${top}%`, width: size, height: size }}
            animate={{
              x: offset.x * strength,
              y: offset.y * strength,
              opacity: [0.35, 0.9, 0.35],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.03 }}
          />
        );
      })}
    </div>
  );
}

