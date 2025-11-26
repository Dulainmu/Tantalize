'use client';

import { useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const ThreeDAbout = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: 'top top',
                end: '+=300%',
                pin: true,
                scrub: 1,
            },
        });

        // Intro -> Mission
        tl.to('.about-bg-intro', { opacity: 0, duration: 1 })
            .to('.about-bg-mission', { opacity: 1, duration: 1 }, '<')
            .to('.about-intro', { opacity: 0, y: -50, duration: 1 }, '<')
            .fromTo('.about-mission', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1 }, '-=0.5')

            // Mission -> Cause
            .to('.about-bg-mission', { opacity: 0, duration: 1, delay: 1 })
            .to('.about-bg-cause', { opacity: 1, duration: 1, delay: 1 }, '<')
            .to('.about-mission', { opacity: 0, y: -50, duration: 1 }, '<')
            .fromTo('.about-cause', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1 }, '-=0.5');

    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="relative z-20 h-screen w-full overflow-hidden bg-primary-950">
            {/* Background Images */}
            <div className="absolute inset-0 z-0">
                <div className="about-bg-intro absolute inset-0 opacity-100">
                    <Image
                        src="/tantalize2024.webp"
                        alt="Tantalize 2024"
                        fill
                        className="object-cover opacity-40"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-primary-950/80 via-primary-950/60 to-primary-950/80" />
                </div>
                <div className="about-bg-mission absolute inset-0 opacity-0">
                    <Image
                        src="/2024_Crowd.webp"
                        alt="Tantalize Crowd"
                        fill
                        className="object-cover opacity-40"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-primary-950/80 via-primary-950/60 to-primary-950/80" />
                </div>
                <div className="about-bg-cause absolute inset-0 opacity-0">
                    <Image
                        src="/tantalize2022.webp"
                        alt="Tantalize 2022"
                        fill
                        className="object-cover opacity-40"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-primary-950/80 via-primary-950/60 to-primary-950/80" />
                </div>
            </div>

            {/* Content Overlay */}
            <div className="relative z-10 flex h-full items-center justify-center px-4 sm:px-6">
                <div className="max-w-4xl mx-auto text-center">

                    {/* Intro Slide */}
                    <div className="about-intro absolute inset-0 flex flex-col items-center justify-center p-6">
                        <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold text-gold-500 mb-8 drop-shadow-2xl">
                            About Tantalize
                        </h2>
                        <p className="text-lg sm:text-xl md:text-2xl text-gray-200 max-w-3xl leading-relaxed drop-shadow-lg">
                            Celebrating 15 years of creative brilliance. Since 2008, Tantalize has evolved from a talent search into a cultural phenomenon that unites passion and purpose.
                        </p>
                    </div>

                    {/* Mission Slide */}
                    <div className="about-mission absolute inset-0 flex flex-col items-center justify-center p-6 opacity-0 translate-y-12">
                        <div className="bg-black/60 backdrop-blur-md p-8 sm:p-12 rounded-3xl border border-gold-500/20 shadow-2xl max-w-3xl">
                            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 flex items-center justify-center gap-4">
                                <span className="text-gold-500">🎯</span> Our Mission
                            </h3>
                            <p className="text-lg sm:text-xl text-gray-200 leading-relaxed mb-6">
                                More than entertainment, we are an <span className="text-gold-400 font-bold">Impact Movement</span>.
                            </p>
                            <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
                                Proceeds from Tantalize 2025 empower underprivileged communities through educational development. We believe access to quality education shapes a brighter future for all.
                            </p>
                        </div>
                    </div>

                    {/* Cause Slide */}
                    <div className="about-cause absolute inset-0 flex flex-col items-center justify-center p-6 opacity-0 translate-y-12">
                        <div className="bg-black/60 backdrop-blur-md p-8 sm:p-12 rounded-3xl border border-gold-500/20 shadow-2xl max-w-3xl">
                            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 flex items-center justify-center gap-4">
                                <span className="text-gold-500">🤝</span> The Cause
                            </h3>
                            <p className="text-lg sm:text-xl text-gray-200 leading-relaxed mb-6">
                                Developing rural schools, one ticket at a time.
                            </p>
                            <p className="text-base sm:text-lg text-gray-300 leading-relaxed mb-8">
                                With your support, we provide essential learning tools—books, stationery, and equipment—to schools in need, empowering students to dream bigger.
                            </p>
                            <p className="text-xl sm:text-2xl font-display font-bold text-gold-500">
                                &ldquo;A celebration of talent with a purpose&rdquo;
                            </p>
                        </div>
                    </div>

                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 animate-bounce">
                <span className="text-sm uppercase tracking-widest">Scroll to Explore</span>
            </div>
        </section>
    );
};

export default ThreeDAbout;
