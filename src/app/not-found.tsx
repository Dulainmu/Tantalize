'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, Music } from 'lucide-react';
import dynamic from 'next/dynamic';

const HeroParticles = dynamic(() => import('./components/common/HeroParticles'), { ssr: false });

export default function NotFound() {
    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-primary-950 text-white px-4">
            {/* Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-900/20 rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03]" />
            </div>

            <HeroParticles offset={{ x: 0, y: 0 }} />

            <motion.div
                className="relative z-10 text-center max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="mb-8 flex justify-center"
                >
                    <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center rounded-full bg-white/5 border border-white/10 backdrop-blur-xl">
                        <Music className="w-10 h-10 sm:w-14 sm:h-14 text-gold-500" />
                        <div className="absolute inset-0 rounded-full border border-gold-500/30 animate-ping opacity-20" />
                    </div>
                </motion.div>

                <h1 className="text-6xl sm:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 mb-6 font-display tracking-tight">
                    404
                </h1>

                <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-4">
                    Lost in the Rhythm?
                </h2>

                <p className="text-gray-400 text-lg mb-10 leading-relaxed">
                    The page you&apos;re looking for seems to have missed a beat. <br className="hidden sm:block" />
                    Let&apos;s get you back to the main stage.
                </p>

                <Link
                    href="/"
                    className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gold-500 text-primary-950 font-bold text-lg transition-all duration-300 hover:bg-gold-400 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,215,0,0.4)]"
                >
                    <Home className="w-5 h-5" />
                    Back to Home
                </Link>
            </motion.div>
        </div>
    );
}
