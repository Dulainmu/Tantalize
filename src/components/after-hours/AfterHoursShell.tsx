"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import CheckerStripe from "@/components/after-hours/CheckerStripe";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const COLUMN_COUNT = 6;

export default function AfterHoursShell({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const holdMs = reduceMotion ? 700 : 2100;

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return Math.min(100, prev + Math.random() * 22);
      });
    }, 90);

    const timer = setTimeout(() => {
      setProgress(100);
      setTimeout(() => setLoading(false), 250);
    }, holdMs);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [reduceMotion]);

  return (
    <>
      <AnimatePresence>
        {loading && (
          <motion.div className="fixed inset-0 z-[9999] overflow-hidden bg-black">
            {/* Exit curtain: vertical columns peel upward in sequence */}
            <div className="absolute inset-0 flex">
              {Array.from({ length: COLUMN_COUNT }).map((_, i) => (
                <motion.div
                  key={i}
                  className="h-full flex-1 bg-[#060409]"
                  exit={{ y: "-101%" }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.055,
                    ease: [0.7, 0, 0.3, 1],
                  }}
                />
              ))}
            </div>

            <motion.div
              className="ah-grid-bg pointer-events-none absolute inset-0 opacity-60"
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
            />
            <motion.div exit={{ opacity: 0, transition: { duration: 0.15 } }}>
              <div className="ah-glitch-edge ah-glitch-edge-l" />
              <div className="ah-glitch-edge ah-glitch-edge-r" />
            </motion.div>

            <motion.div
              className="relative z-10 flex h-full flex-col items-center justify-center gap-8 px-6"
              exit={{ opacity: 0, transition: { duration: 0.18 } }}
            >
              <div className="flex flex-col items-center gap-6 sm:flex-row sm:gap-8">
                <motion.div
                  initial={{ opacity: 0, x: -24, filter: "blur(8px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
                >
                  <Image
                    src="/Tanata Logo.webp"
                    alt="Tantalize"
                    width={110}
                    height={110}
                    priority
                    className="h-16 w-16 object-contain opacity-90 sm:h-24 sm:w-24"
                  />
                </motion.div>

                <motion.span
                  aria-hidden
                  className="hidden text-3xl font-thin text-white/25 sm:block"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.35, ease: EASE }}
                >
                  ×
                </motion.span>

                <motion.div
                  className="ah-loader-flicker"
                  initial={{ opacity: 0, scale: 1.14, filter: "blur(10px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  transition={{ duration: 0.55, delay: 0.3, ease: EASE }}
                >
                  <Image
                    src="/after-hours/after-hours-logo.webp"
                    alt="After Hours"
                    width={1904}
                    height={924}
                    priority
                    className="h-auto w-[250px] drop-shadow-[0_0_35px_rgba(140,70,255,0.4)] sm:w-[360px]"
                  />
                </motion.div>
              </div>

              <motion.div
                className="w-56 sm:w-72"
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.5, delay: 0.55, ease: EASE }}
              >
                <CheckerStripe />
              </motion.div>

              <motion.div
                className="flex flex-col items-center gap-3"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.7, ease: EASE }}
              >
                <p
                  className="text-[11px] tracking-[0.35em] text-white/50"
                  style={{ fontFamily: "var(--font-ah-mono), monospace" }}
                >
                  ONE STAGE. ENDLESS TALENT.
                </p>

                <div className="relative h-0.5 w-44 overflow-hidden rounded-full bg-white/10 sm:w-56">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 via-purple-500 to-blue-500"
                    initial={{ width: "0%" }}
                    animate={{ width: `${Math.min(progress, 100)}%` }}
                    transition={{ width: { duration: 0.2, ease: "easeOut" } }}
                  />
                </div>

                <p
                  className="text-[10px] tabular-nums text-white/30"
                  style={{ fontFamily: "var(--font-ah-mono), monospace" }}
                >
                  {Math.floor(Math.min(progress, 100))}%
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className={loading ? "pointer-events-none opacity-0" : "opacity-100"}
        style={{ transition: "opacity 0.4s ease-in-out" }}
      >
        {children}
      </div>
    </>
  );
}
