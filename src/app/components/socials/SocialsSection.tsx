'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Instagram, Facebook, Music } from 'lucide-react';

const socialCards = [
    {
        id: 1,
        image: '/tantalize2017.webp', // Placeholder
        rotate: -21,
        x: -30,
        y: 7.3,
        scale: 0.7756,
        zIndex: 1
    },
    {
        id: 2,
        image: '/Tantalize2018.webp', // Placeholder
        rotate: -14,
        x: -22,
        y: 4,
        scale: 0.8498,
        zIndex: 2
    },
    {
        id: 3,
        image: '/Tantalize2019.jpg', // Placeholder
        rotate: -7,
        x: -11,
        y: 1.3,
        scale: 0.9346,
        zIndex: 3
    },
    {
        id: 4,
        image: '/tantalize2022.webp', // Placeholder
        rotate: 0,
        x: 0,
        y: 0,
        scale: 1,
        zIndex: 10
    },
    {
        id: 5,
        image: '/tantalize2023.webp', // Placeholder
        rotate: 7,
        x: 11,
        y: 1.3,
        scale: 0.9346,
        zIndex: 3
    },
    {
        id: 6,
        image: '/tantalize2024.webp', // Placeholder
        rotate: 14,
        x: 22,
        y: 4,
        scale: 0.8498,
        zIndex: 2
    },
    {
        id: 7,
        image: '/2024_Crowd.webp', // Placeholder
        rotate: 21,
        x: 30,
        y: 7.3,
        scale: 0.7756,
        zIndex: 1
    }
];

export default function SocialsSection() {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        <section className="relative py-24 sm:py-32 overflow-hidden bg-primary-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">

                {/* Header */}
                <div className="text-center mb-20 sm:mb-32">
                    <motion.h2
                        className="text-4xl sm:text-6xl md:text-8xl lg:text-6xl 2xl:text-8xl font-bold uppercase tracking-tighter leading-none"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <span className="block text-white mb-2">What&apos;s Up</span>
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 font-serif italic">
                            On Socials
                        </span>
                    </motion.h2>
                </div>

                {/* Fan Layout Container */}
                <div className="relative h-[400px] sm:h-[500px] md:h-[600px] flex items-center justify-center mb-20 perspective-[2000px]">
                    <div className="relative w-full h-full flex items-center justify-center scale-[0.55] sm:scale-75 md:scale-100 lg:scale-75 2xl:scale-100 origin-center">
                        {socialCards.map((card, index) => {
                            // Calculate dynamic offset based on hover
                            let xOffset = 0;
                            if (hoveredIndex !== null) {
                                if (index < hoveredIndex) xOffset = -60; // Push left
                                if (index > hoveredIndex) xOffset = 60;  // Push right
                            }

                            const isHovered = hoveredIndex === index;

                            return (
                                <motion.div
                                    key={card.id}
                                    className="absolute w-40 sm:w-52 md:w-64 aspect-[9/16] rounded-2xl overflow-hidden border-4 border-white/5 shadow-2xl"
                                    initial={{
                                        opacity: 0,
                                        x: 0,
                                        y: 200,
                                        rotate: 0,
                                        scale: 0.8,
                                        zIndex: card.zIndex
                                    }}
                                    whileInView={{
                                        opacity: 1,
                                        x: `calc(${card.x}rem + ${xOffset}px)`,
                                        y: `${card.y}rem`,
                                        rotate: card.rotate,
                                        scale: card.scale,
                                        zIndex: card.zIndex
                                    }}
                                    animate={{
                                        x: `calc(${card.x}rem + ${xOffset}px)`,
                                        y: isHovered ? -40 : `${card.y}rem`,
                                        rotate: isHovered ? 0 : card.rotate,
                                        scale: isHovered ? 1.1 : card.scale,
                                        zIndex: isHovered ? 100 : card.zIndex,
                                    }}
                                    transition={{
                                        duration: 0.5,
                                        ease: "backOut"
                                    }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    onMouseEnter={() => setHoveredIndex(index)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                >
                                    <Image
                                        src={card.image}
                                        alt="Social post"
                                        fill
                                        className="object-cover transition-transform duration-500 hover:scale-110"
                                        sizes="(max-width: 768px) 50vw, 33vw"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                        <div className="transform translate-y-4 hover:translate-y-0 transition-transform duration-300">
                                            <Instagram className="w-8 h-8 text-[#FFD700] mb-2" />
                                            <p className="text-white text-sm font-medium">View on Instagram</p>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Footer / Links */}
                <div className="text-center">
                    <p className="text-sm uppercase tracking-[0.3em] text-gray-400 mb-8">
                        Follow Tantalize on social media
                    </p>
                    <div className="flex flex-wrap justify-center gap-8 sm:gap-12 lg:gap-8 2xl:gap-12">
                        {[
                            { name: 'Instagram', icon: Instagram, url: 'https://www.instagram.com/tantalizeofficial/' },
                            { name: 'Facebook', icon: Facebook, url: 'https://www.facebook.com/TantalizeOfficial/' },
                            { name: 'TikTok', icon: Music, url: 'https://www.tiktok.com/@tantalizeofficial' }
                        ].map((social) => (
                            <a
                                key={social.name}
                                href={social.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-2 text-white hover:text-gold-500 transition-colors"
                            >
                                <social.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                                <span className="text-lg sm:text-xl font-bold uppercase tracking-wider relative overflow-hidden">
                                    {social.name}
                                    <span className="absolute bottom-0 left-0 w-full h-px bg-gold-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                                </span>
                            </a>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}
