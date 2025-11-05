"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Chapter = {
  id: string;
  emoji: string;
  title: string;
  subtitle: string;
  description: string;
  date: string;
  location: string;
  image?: string;
  gradient: string;
  cta?: {
    label: string;
    href: string;
  };
};

const scheduleChapters: Chapter[] = [
  {
    id: "acoustic-night",
    emoji: "🎶",
    title: "Acoustic Night",
    subtitle: "Opening Showcase",
    description:
      "A serene evening spotlighting unplugged artistry and the voices that kick-start the Tantalize journey.",
    date: "February 08, 2025",
    location: "APIIT Main Atrium",
    image: "/schedule/acoustic-night.jpg",
    gradient: "from-[#0F172A] via-[#111c38] to-[#05070f]",
  },
  {
    id: "auditions",
    emoji: "💫",
    title: "Nationwide Auditions",
    subtitle: "Talent Hunt",
    description:
      "University-wide auditions where performers battle for the spotlight and a place in the finale roster.",
    date: "March 01 – March 15, 2025",
    location: "Regional Hubs & APIIT Studio",
    image: "/schedule/auditions.jpg",
    gradient: "from-[#170b2c] via-[#2a0f3f] to-[#05030a]",
  },
  {
    id: "workshops",
    emoji: "🎭",
    title: "Mentorship Workshops",
    subtitle: "Skill Elevation",
    description:
      "Stagecraft, choreography, music direction, and media coaching guided by industry mentors and alumni.",
    date: "April 05 – April 20, 2025",
    location: "APIIT Creative Labs",
    image: "/schedule/workshops.jpg",
    gradient: "from-[#0b1e21] via-[#123641] to-[#051013]",
  },
  {
    id: "press",
    emoji: "📰",
    title: "Press Conference",
    subtitle: "Spotlight Moment",
    description:
      "Sponsors, media, and partners meet the finalists as we unveil production reveals and collabs.",
    date: "May 10, 2025",
    location: "Cinnamon Lakeside — Ebony Ballroom",
    image: "/schedule/press-conference.jpg",
    gradient: "from-[#211407] via-[#3a220d] to-[#080502]",
  },
  {
    id: "finale",
    emoji: "🌟",
    title: "Grand Finale",
    subtitle: "The Spectacle",
    description:
      "Nelum Pokuna Outdoor Arena transforms into Sri Lanka’s biggest student night with 2000+ fans, guest stars, and cinematic production.",
    date: "June 07, 2025",
    location: "Nelum Pokuna Outdoor Arena",
    image: "/schedule/grand-finale.jpg",
    gradient: "from-[#140808] via-[#351010] to-[#060202]",
    cta: {
      label: "Unlock Tickets",
      href: "#tickets",
    },
  },
];

const layoutConfigs = [
  {
    widthClass: "md:min-w-[520px]",
    offsetClass: "md:mt-0",
    accent: "from-[#FFD700] via-[#FF8A65] to-[#7C4DFF]",
  },
  {
    widthClass: "md:min-w-[600px]",
    offsetClass: "md:mt-12",
    accent: "from-[#FF6F61] via-[#FF4081] to-[#C2185B]",
  },
  {
    widthClass: "md:min-w-[480px]",
    offsetClass: "md:-mt-14",
    accent: "from-[#29B6F6] via-[#7C4DFF] to-[#F06292]",
  },
  {
    widthClass: "md:min-w-[560px]",
    offsetClass: "md:mt-10",
    accent: "from-[#FFB300] via-[#FF7043] to-[#8E24AA]",
  },
  {
    widthClass: "md:min-w-[640px]",
    offsetClass: "md:-mt-8",
    accent: "from-[#EF6C00] via-[#D81B60] to-[#4527A0]",
  },
];

export default function ScheduleTimeline() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const track = trackRef.current;
        const container = containerRef.current;

        if (!track || !container) {
          return;
        }

        const getScrollAmount = () =>
          Math.max(0, track.scrollWidth - container.offsetWidth);

        const scrollTween = gsap.to(track, {
          x: () => -getScrollAmount(),
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top top",
            end: () => `+=${getScrollAmount()}`,
            scrub: true,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        const cards = gsap.utils.toArray<HTMLElement>(".timeline-card");
        cards.forEach((card) => {
          gsap.fromTo(
            card,
            { opacity: 0.35, scale: 0.92 },
            {
              opacity: 1,
              scale: 1,
              duration: 0.6,
              ease: "power2.out",
              scrollTrigger: {
                trigger: card,
                containerAnimation: scrollTween,
                start: "left center",
                end: "right center",
                toggleActions: "play reverse play reverse",
              },
            },
          );
        });

        const dots = gsap.utils.toArray<HTMLElement>(".chapter-dot");
        dots.forEach((dot) => {
          gsap.fromTo(
            dot,
            { scale: 0.6, opacity: 0.4 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.4,
              ease: "power2.out",
              scrollTrigger: {
                trigger: dot.parentElement,
                containerAnimation: scrollTween,
                start: "left center",
                end: "right center",
                toggleActions: "play reverse play reverse",
              },
            },
          );
        });

        if (progressRef.current) {
          gsap.fromTo(
            progressRef.current,
            { scaleX: 0 },
            {
              scaleX: 1,
              ease: "none",
              scrollTrigger: {
                containerAnimation: scrollTween,
                trigger: track,
                start: "left left",
                end: "right right",
                scrub: true,
              },
            },
          );
        }

        return () => {
          scrollTween.kill();
        };
      });

      mm.add("(max-width: 767px)", () => {
        const chapters = gsap.utils.toArray<HTMLElement>(".schedule-chapter");

        chapters.forEach((chapter) => {
          const card = chapter.querySelector<HTMLElement>(".timeline-card");
          if (!card) return;

          gsap.fromTo(
            card,
            { opacity: 0, y: 80 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power2.out",
              scrollTrigger: {
                trigger: chapter,
                start: "top 85%",
                end: "top 45%",
                scrub: true,
              },
            },
          );
        });
      });

      return () => mm.revert();
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="schedule"
      className="relative flex min-h-screen w-full items-center overflow-hidden px-6 py-20 sm:py-24 md:py-0"
      style={{ minHeight: "100vh" }}
    >
      <div
        className="pointer-events-none absolute inset-0 -z-20"
        style={{
          background:
            "linear-gradient(160deg, #0b0f22 0%, #11173b 45%, #090b1c 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-25"
        style={{
          backgroundImage:
            "radial-gradient(circle at 12% 14%, rgba(255,189,46,0.28) 0, transparent 45%), radial-gradient(circle at 90% 64%, rgba(130,99,255,0.28) 0, transparent 55%), radial-gradient(circle at 52% 90%, rgba(255,120,180,0.22) 0, transparent 48%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-10"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='520' height='520' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M-40 260 C160 210 320 310 520 260 M-40 400 C200 360 320 420 520 400' stroke='%2319224b' stroke-width='1' fill='none'/%3E%3C/svg%3E\")",
          backgroundSize: "420px 420px",
        }}
      />

      <div className="mx-auto flex h-full max-w-7xl flex-col justify-center">
        <div
          ref={containerRef}
          className="relative mt-16 flex flex-col gap-16 md:mt-20 md:h-[calc(100vh-12rem)] md:gap-0 md:overflow-hidden"
        >
          <span className="pointer-events-none absolute left-0 top-[7.5rem] hidden h-[2px] w-full bg-white/15 md:block" />
          <span
            ref={progressRef}
            className="pointer-events-none absolute left-0 top-[7.5rem] hidden h-[2px] w-full origin-left scale-x-0 bg-gradient-to-r from-[#FFD700] via-[#FF6F61] to-[#7C4DFF] md:block"
          />

          <div
            ref={trackRef}
            className="timeline-track flex flex-col gap-12 md:absolute md:left-0 md:top-0 md:flex-row md:h-full md:w-max md:items-center md:gap-16"
          >
            {scheduleChapters.map((chapter, index) => {
              const layout = layoutConfigs[index % layoutConfigs.length];
              return (
                <article
                  key={chapter.id}
                  id={chapter.id}
                  className={`schedule-chapter relative flex min-h-[320px] min-w-[85vw] flex-col items-stretch md:min-h-[70vh] md:min-w-[52vw] md:max-w-[700px] ${layout.widthClass} ${layout.offsetClass}`}
                >
                  <span
                    className={`chapter-dot pointer-events-none absolute -top-8 left-1/2 hidden h-4 w-4 -translate-x-1/2 rounded-full bg-gradient-to-br ${layout.accent} shadow-[0_0_0_12px_rgba(255,215,0,0.16)] md:block`}
                  />
                  <div className="timeline-card group relative flex h-full flex-col justify-between overflow-hidden rounded-[34px] border border-white/16 bg-[#161a32]/90 px-7 py-10 shadow-[0_60px_140px_-60px_rgba(0,0,0,0.6)] transition-transform duration-500 ease-out md:px-14 md:py-16">
                    <div
                      className="timeline-card-media absolute inset-0 -z-10 bg-cover bg-center opacity-80 transition-transform duration-700 ease-out group-hover:scale-105"
                      style={{
                        backgroundImage: chapter.image
                          ? `linear-gradient(120deg, rgba(8,10,26,0.92), rgba(35,20,55,0.55)), url(${chapter.image})`
                          : `linear-gradient(120deg, rgba(8,10,26,0.92), rgba(35,20,55,0.55))`,
                      }}
                    />
                    <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#0d1026]/75 via-[#1a1232]/55 to-[#0b0c1d]/85" aria-hidden />

                    <div className="timeline-card-content relative z-10 flex flex-col gap-6">
                      <div className="flex items-center justify-between text-xs uppercase tracking-[0.35em] text-[#FFD700]/75">
                        <span className="inline-flex items-center gap-3">
                          <span className="text-xl">{chapter.emoji}</span>
                          {chapter.subtitle}
                        </span>
                        <span className="hidden text-[0.5rem] tracking-[0.4em] text-white/60 md:inline-flex">
                          Step {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>

                      <h3 className="font-display text-3xl text-white md:text-4xl">
                        {chapter.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-white/70 md:text-base">
                        {chapter.description}
                      </p>
                    </div>

                    <div className="relative z-10 flex flex-wrap gap-3 text-[0.6rem] uppercase tracking-[0.3em] text-white/60 md:items-center md:justify-between">
                      <span className="inline-flex items-center gap-2">
                        <span className="block h-[2px] w-6 rounded-full bg-gradient-to-r from-[#FFD700] to-[#FF6F61]" />
                        {chapter.date}
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <span className="block h-[2px] w-6 rounded-full bg-gradient-to-r from-[#7C4DFF] to-[#29B6F6]" />
                        {chapter.location}
                      </span>
                    </div>

                    {chapter.cta && (
                      <div className="relative z-10 pt-4">
                        <Link
                          href={chapter.cta.href}
                          className="inline-flex items-center gap-3 rounded-full border border-[#FF6F61]/50 bg-white/5 px-6 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-white transition-all duration-300 hover:border-[#FF6F61] hover:bg-white/10"
                        >
                          <span>{chapter.cta.label}</span>
                          <span className="text-[#FFD700]">→</span>
                        </Link>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
