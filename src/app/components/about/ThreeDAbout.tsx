'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Target, HeartHandshake } from 'lucide-react';

const ThreeDAbout = () => {
    return (
        <section id="about" className="relative min-h-screen w-full overflow-hidden bg-primary-950 py-24 sm:py-32">
            {/* Background Image with Cinematic Blend */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/tantalize2024.webp"
                    alt="Tantalize 2024"
                    fill
                    className="object-cover opacity-20"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-primary-950 via-primary-950/90 to-primary-950" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold-500/5 via-transparent to-transparent opacity-50" />
            </div>

            {/* Content Container */}
            <div className="relative z-10 container mx-auto px-4 sm:px-6">
                <div className="max-w-7xl mx-auto space-y-20 sm:space-y-32">

                    {/* Intro Section */}
                    <motion.div
                        className="text-center max-w-4xl mx-auto relative"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        {/* Decorative Element */}
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent via-gold-500/50 to-transparent" />

                        <h2 className="text-5xl sm:text-6xl md:text-8xl font-bold text-gold-500 mb-8 drop-shadow-2xl font-display tracking-tight">
                            About Tantalize
                        </h2>
                        <div className="w-24 h-1 bg-gold-500 mx-auto mb-8 rounded-full opacity-80" />
                        <p className="text-lg sm:text-xl md:text-2xl text-gray-300 leading-relaxed font-light">
                            Celebrating <span className="text-gold-400 font-medium">15 years</span> of creative brilliance. Since 2008, Tantalize has evolved from a talent search into a cultural phenomenon that unites passion and purpose.
                        </p>
                    </motion.div>

                    {/* Mission & Cause Grid */}
                    <div className="grid md:grid-cols-2 gap-8 lg:gap-16">

                        {/* Mission Card */}
                        <motion.div
                            className="group relative bg-white/5 backdrop-blur-xl p-8 sm:p-12 rounded-[2rem] border border-white/10 hover:border-gold-500/30 transition-all duration-500 hover:bg-white/10 hover:shadow-[0_0_40px_-10px_rgba(255,215,0,0.1)]"
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-gold-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2rem]" />

                            <div className="relative z-10">
                                <div className="w-16 h-16 rounded-2xl bg-gold-500/10 flex items-center justify-center mb-8 border border-gold-500/20 group-hover:scale-110 transition-transform duration-500">
                                    <Target className="w-8 h-8 text-gold-500" />
                                </div>

                                <h3 className="text-3xl sm:text-4xl font-bold text-white mb-6 font-display">
                                    Our Mission
                                </h3>

                                <div className="space-y-6 text-gray-300 leading-relaxed text-lg font-light">
                                    <p>
                                        More than entertainment, we are an <span className="text-gold-400 font-medium">Impact Movement</span>.
                                    </p>
                                    <p>
                                        Proceeds from Tantalize 2025 empower underprivileged communities through educational development. We believe access to quality education shapes a brighter future for all.
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Cause Card */}
                        <motion.div
                            className="group relative bg-white/5 backdrop-blur-xl p-8 sm:p-12 rounded-[2rem] border border-white/10 hover:border-gold-500/30 transition-all duration-500 hover:bg-white/10 hover:shadow-[0_0_40px_-10px_rgba(255,215,0,0.1)]"
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-gold-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2rem]" />

                            <div className="relative z-10">
                                <div className="w-16 h-16 rounded-2xl bg-gold-500/10 flex items-center justify-center mb-8 border border-gold-500/20 group-hover:scale-110 transition-transform duration-500">
                                    <HeartHandshake className="w-8 h-8 text-gold-500" />
                                </div>

                                <h3 className="text-3xl sm:text-4xl font-bold text-white mb-6 font-display">
                                    The Cause
                                </h3>

                                <div className="space-y-6 text-gray-300 leading-relaxed text-lg font-light">
                                    <p>
                                        Developing rural schools, one ticket at a time.
                                    </p>
                                    <p>
                                        With your support, we provide essential learning tools—books, stationery, and equipment—to schools in need, empowering students to dream bigger.
                                    </p>
                                    <div className="pt-4 border-t border-white/10">
                                        <p className="text-xl font-display italic text-gold-500">
                                            &ldquo;A celebration of talent with a purpose&rdquo;
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                    </div>

                </div>
            </div>
        </section>
    );
};

export default ThreeDAbout;
