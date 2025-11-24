'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PARTICLE_COUNT = 25;

type SplashParticle = {
  width: number;
  height: number;
  left: number;
  top: number;
  duration: number;
  delay: number;
};

const seededValue = (index: number, offset: number) => {
  const seed = index * 97 + offset * 23;
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

const splashParticles: SplashParticle[] = Array.from({ length: PARTICLE_COUNT }, (_, index) => {
  const width = seededValue(index, 1) * 3 + 1;
  const height = seededValue(index, 2) * 3 + 1;
  const left = seededValue(index, 3) * 100;
  const top = seededValue(index, 4) * 100;
  const duration = seededValue(index, 5) * 2 + 2;
  const delay = seededValue(index, 6);

  return {
    width,
    height,
    left,
    top,
    duration,
    delay,
  };
});

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const minShowMs = 2500; // Optimized splash time

    // Faster progress animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.random() * 20; // Faster increments
      });
    }, 100); // Faster updates

    const timer = setTimeout(() => {
      setProgress(100);
      setTimeout(() => setIsLoading(false), 300);
    }, minShowMs);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            style={{
              background: 'radial-gradient(ellipse at center, #1a1f3a 0%, #0A0E27 50%, #000000 100%)'
            }}
          >
            {/* Optimized Background Particles - Reduced count */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {splashParticles.map((particle, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full bg-gold-500/20"
                  style={{
                    width: `${particle.width.toFixed(3)}px`,
                    height: `${particle.height.toFixed(3)}px`,
                    left: `${particle.left.toFixed(3)}%`,
                    top: `${particle.top.toFixed(3)}%`,
                  }}
                  initial={{ opacity: 0 }}
                  animate={{
                    y: [0, -30, 0],
                    opacity: [0.2, 0.5, 0.2],
                    scale: [1, 1.3, 1],
                  }}
                  transition={{
                    duration: particle.duration,
                    repeat: Infinity,
                    delay: particle.delay,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>

            {/* Optimized Radial Glow */}
            <div
              className="absolute inset-0 pointer-events-none opacity-40"
              style={{
                background: 'radial-gradient(circle at center, rgba(255, 215, 0, 0.15) 0%, transparent 70%)',
              }}
            />

            <div className="flex flex-col items-center justify-center space-y-8 sm:space-y-10 md:space-y-12 px-6">
              <div className="flex items-center justify-center space-x-4 sm:space-x-6 md:space-x-10">
                {/* Tantalize Logo with Enhanced Glitch Effect */}
                <motion.div
                  className="relative flex-shrink-0"
                  initial={{ opacity: 0, x: -50, scale: 0.8 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.1,
                    ease: "easeOut"
                  }}
                >
                  <div className="glitch-container-enhanced">
                    <img
                      src="/Tanata Logo.webp"
                      alt="Tantalize logo"
                      className="glitch-logo-enhanced"
                      loading="eager"
                      decoding="async"
                    />
                    <img
                      src="/Tanata Logo.webp"
                      aria-hidden
                      className="glitch-logo-enhanced glitch-offset-1"
                      loading="eager"
                      decoding="async"
                    />
                    <img
                      src="/Tanata Logo.webp"
                      aria-hidden
                      className="glitch-logo-enhanced glitch-offset-2"
                      loading="eager"
                      decoding="async"
                    />
                    <img
                      src="/Tanata Logo.webp"
                      aria-hidden
                      className="glitch-logo-enhanced glitch-offset-3"
                      loading="eager"
                      decoding="async"
                    />
                  </div>
                </motion.div>

                {/* Animated Separator */}
                <motion.div
                  className="text-gold-500 text-3xl sm:text-4xl md:text-5xl font-thin relative flex-shrink-0"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  transition={{
                    duration: 0.4,
                    delay: 0.3,
                    ease: "easeOut"
                  }}
                >
                  <span className="text-glow-pulse">/</span>
                </motion.div>

                {/* APIIT Logo with Glitch Effect */}
                <motion.div
                  className="relative flex items-center justify-center flex-shrink-0"
                  initial={{ opacity: 0, x: 50, scale: 0.8 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.1,
                    ease: "easeOut"
                  }}
                >
                  <div className="glitch-container-apiit">
                    <img
                      src="/APIIT-Logo-White.webp"
                      alt="APIIT logo"
                      className="glitch-logo-apiit"
                      loading="eager"
                      decoding="async"
                    />
                    <img
                      src="/APIIT-Logo-White.webp"
                      aria-hidden
                      className="glitch-logo-apiit glitch-offset-apiit-1"
                      loading="eager"
                      decoding="async"
                    />
                    <img
                      src="/APIIT-Logo-White.webp"
                      aria-hidden
                      className="glitch-logo-apiit glitch-offset-apiit-2"
                      loading="eager"
                      decoding="async"
                    />
                    <img
                      src="/APIIT-Logo-White.webp"
                      aria-hidden
                      className="glitch-logo-apiit glitch-offset-apiit-3"
                      loading="eager"
                      decoding="async"
                    />
                  </div>
                </motion.div>
              </div>

              {/* Enhanced Loading Text */}
              <motion.div
                className="flex flex-col items-center space-y-3"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                <div className="text-gold-500 text-xs sm:text-sm tracking-[0.3em] sm:tracking-[0.4em] font-light uppercase opacity-80">
                  {progress < 100 ? 'LOADING EXPERIENCE' : 'READY'}
                  <span className="loading-dots">...</span>
                </div>

                {/* Optimized Progress Bar */}
                <div className="w-40 sm:w-56 md:w-64 h-0.5 bg-primary-900/50 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-gold-500 via-yellow-400 to-gold-500 rounded-full progress-shimmer"
                    initial={{ width: '0%' }}
                    animate={{
                      width: `${Math.min(progress, 100)}%`,
                    }}
                    transition={{
                      width: { duration: 0.2, ease: "easeOut" }
                    }}
                  />
                </div>

                {/* Percentage Counter */}
                <motion.div
                  className="text-gold-500/60 text-xs font-mono tabular-nums"
                  key={Math.floor(progress / 5) * 5}
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: 0.8 }}
                >
                  {Math.floor(progress)}%
                </motion.div>
              </motion.div>

              {/* Tagline */}
              <motion.div
                className="text-center space-y-1.5 hidden sm:block"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                <p className="text-white/70 text-xs sm:text-sm tracking-wide">
                  Sri Lanka&apos;s Premier Cultural & Music Event
                </p>
                <p className="text-gold-500/50 text-xs tracking-widest">
                  2 0 2 5
                </p>
              </motion.div>
            </div>

            {/* Simplified Corner Accents */}
            <div className="absolute top-0 left-0 w-20 sm:w-24 md:w-32 h-20 sm:h-24 md:h-32 border-l border-t border-gold-500/20" />
            <div className="absolute bottom-0 right-0 w-20 sm:w-24 md:w-32 h-20 sm:h-24 md:h-32 border-r border-b border-gold-500/20" />
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className={isLoading ? 'opacity-0 pointer-events-none' : 'opacity-100'}
        style={{ transition: 'opacity 0.4s ease-in-out' }}
      >
        {children}
      </div>
    </>
  );
}


