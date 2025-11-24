"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Calendar, MapPin } from "lucide-react";

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
    image: "/schedule/acoustic-night.webp",
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
    image: "/schedule/auditions.webp",
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
    image: "/schedule/workshops.webp",
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
    image: "/schedule/press-conference.webp",
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
    image: "/schedule/grand-finale.webp",
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
    shadow: "shadow-amber-500/20",
  },
  {
    widthClass: "md:min-w-[600px]",
    offsetClass: "md:mt-12",
    accent: "from-[#FF6F61] via-[#FF4081] to-[#C2185B]",
    shadow: "shadow-rose-500/20",
  },
  {
    widthClass: "md:min-w-[480px]",
    offsetClass: "md:-mt-14",
    accent: "from-[#29B6F6] via-[#7C4DFF] to-[#F06292]",
    shadow: "shadow-blue-500/20",
  },
  {
    widthClass: "md:min-w-[560px]",
    offsetClass: "md:mt-10",
    accent: "from-[#FFB300] via-[#FF7043] to-[#8E24AA]",
    shadow: "shadow-orange-500/20",
  },
  {
    widthClass: "md:min-w-[640px]",
    offsetClass: "md:-mt-8",
    accent: "from-[#EF6C00] via-[#D81B60] to-[#4527A0]",
    shadow: "shadow-purple-500/20",
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
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        const cards = gsap.utils.toArray<HTMLElement>(".timeline-card");
        cards.forEach((card) => {
          gsap.fromTo(
            card,
            { opacity: 0.6, scale: 0.95, filter: "grayscale(50%)" },
            {
              opacity: 1,
              scale: 1,
              filter: "grayscale(0%)",
              duration: 0.8,
              ease: "power2.out",
              scrollTrigger: {
                trigger: card,
                containerAnimation: scrollTween,
                start: "left center+=200",
                end: "right center-=200",
                toggleActions: "play reverse play reverse",
              },
            },
          );
        });

        const dots = gsap.utils.toArray<HTMLElement>(".chapter-dot");
        dots.forEach((dot) => {
          gsap.fromTo(
            dot,
            { scale: 0, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.6,
              ease: "back.out(1.7)",
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
            { opacity: 0, y: 50, scale: 0.95 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: {
                trigger: chapter,
                start: "top 85%",
                end: "top 50%",
                scrub: 1,
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
      className="relative flex min-h-screen w-full items-center overflow-hidden px-4 py-20 sm:px-6 sm:py-24 md:py-0"
      style={{ minHeight: "100vh" }}
    >
      {/* Dynamic Background */}
      <div
        className="pointer-events-none absolute inset-0 -z-20"
        style={{
          background:
            "linear-gradient(160deg, #0b0f22 0%, #11173b 45%, #090b1c 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 12% 14%, rgba(255,189,46,0.15) 0, transparent 45%), radial-gradient(circle at 90% 64%, rgba(130,99,255,0.15) 0, transparent 55%), radial-gradient(circle at 52% 90%, rgba(255,120,180,0.12) 0, transparent 48%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.07]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />

      <div className="mx-auto flex h-full w-full max-w-[1400px] flex-col justify-center">
        <div
          ref={containerRef}
          className="relative mt-12 flex flex-col gap-12 md:mt-20 md:h-[calc(100vh-10rem)] md:gap-0 md:overflow-hidden"
        >
          {/* Progress Line (Desktop) */}
          <span className="pointer-events-none absolute left-0 top-[7.5rem] hidden h-[1px] w-full bg-white/10 md:block" />
          <span
            ref={progressRef}
            className="pointer-events-none absolute left-0 top-[7.5rem] hidden h-[2px] w-full origin-left scale-x-0 bg-gradient-to-r from-[#FFD700] via-[#FF6F61] to-[#7C4DFF] shadow-[0_0_15px_rgba(255,215,0,0.5)] md:block"
          />

          <div
            ref={trackRef}
            className="timeline-track flex flex-col gap-8 md:absolute md:left-0 md:top-0 md:flex-row md:h-full md:w-max md:items-center md:gap-12 lg:gap-16"
          >
            {scheduleChapters.map((chapter, index) => {
              const layout = layoutConfigs[index % layoutConfigs.length];
              return (
                <article
                  key={chapter.id}
                  id={chapter.id}
                  className={`schedule-chapter relative flex min-h-[380px] w-full flex-col items-stretch md:min-h-[65vh] md:min-w-[50vw] md:max-w-[650px] ${layout.widthClass} ${layout.offsetClass}`}
                >
                  {/* Timeline Dot */}
                  <span
                    className={`chapter-dot pointer-events-none absolute -top-8 left-1/2 hidden h-5 w-5 -translate-x-1/2 rounded-full bg-gradient-to-br ${layout.accent} shadow-[0_0_0_8px_rgba(255,255,255,0.05),0_0_20px_rgba(255,215,0,0.4)] md:block`}
                  />

                  {/* Card */}
                  <div className={`timeline-card group relative flex h-full flex-col justify-between overflow-hidden rounded-[2rem] border border-white/10 bg-[#161a32]/40 backdrop-blur-md transition-all duration-500 hover:border-white/20 hover:shadow-2xl ${layout.shadow} md:px-10 md:py-12 px-6 py-8`}>

                    {/* Background Image with Gradient Overlay */}
                    <div
                      className="timeline-card-media absolute inset-0 -z-10 bg-cover bg-center opacity-60 transition-transform duration-700 ease-out group-hover:scale-110"
                      style={{
                        backgroundImage: chapter.image
                          ? `linear-gradient(135deg, rgba(8,10,26,0.95), rgba(35,20,55,0.7)), url(${chapter.image})`
                          : `linear-gradient(135deg, rgba(8,10,26,0.95), rgba(35,20,55,0.7))`,
                      }}
                    />

                    {/* Content */}
                    <div className="timeline-card-content relative z-10 flex flex-col gap-6">
                      <div className="flex items-center justify-between border-b border-white/10 pb-4">
                        <span className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-[#FFD700]">
                          <span className="text-2xl filter drop-shadow-lg">{chapter.emoji}</span>
                          {chapter.subtitle}
                        </span>
                        <span className="hidden text-[0.6rem] font-bold tracking-[0.3em] text-white/40 md:inline-flex">
                          PHASE {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>

                      <div>
                        <h3 className="mb-3 font-display text-3xl font-bold leading-tight text-white md:text-5xl">
                          {chapter.title}
                        </h3>
                        <p className="text-sm leading-relaxed text-white/80 md:text-base">
                          {chapter.description}
                        </p>
                      </div>
                    </div>

                    {/* Footer Info */}
                    <div className="relative z-10 mt-8 flex flex-col gap-4 border-t border-white/10 pt-6">
                      <div className="flex flex-wrap gap-y-3 gap-x-6 text-xs font-medium uppercase tracking-wider text-white/70">
                        <span className="inline-flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-[#FF6F61]" />
                          {chapter.date}
                        </span>
                        <span className="inline-flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-[#29B6F6]" />
                          {chapter.location}
                        </span>
                      </div>

                      {chapter.cta && (
                        <div className="pt-2">
                          <Link
                            href={chapter.cta.href}
                            className="group/btn inline-flex items-center gap-3 rounded-full bg-white/10 px-6 py-3 text-sm font-bold uppercase tracking-widest text-white backdrop-blur-sm transition-all duration-300 hover:bg-white hover:text-black"
                          >
                            <span>{chapter.cta.label}</span>
                            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                          </Link>
                        </div>
                      )}
                    </div>
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
