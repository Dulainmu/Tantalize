"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Calendar, MapPin, Music, Sparkles, Mic2, Newspaper, Star } from "lucide-react";

type Chapter = {
  id: string;
  icon: React.ElementType;
  title: string;
  subtitle: string;
  description: string;
  date: string;
  location: string;
  image?: string;
  cta?: {
    label: string;
    href: string;
  };
};

const scheduleChapters: Chapter[] = [
  {
    id: "acoustic-night",
    icon: Music,
    title: "Acoustic Night",
    subtitle: "Opening Showcase",
    description:
      "A serene evening spotlighting unplugged artistry and the voices that kick-start the Tantalize journey.",
    date: "September 20, 2024",
    location: "Rise Up Colombo",
    image: "/schedule/acoustic-night.webp",
  },
  {
    id: "auditions",
    icon: Sparkles,
    title: "Auditions",
    subtitle: "Talent Hunt",
    description:
      "Singing, Band, and Instrumental auditions at APIIT Foundation School (Nov 8). Dancing auditions at Nelung Arts Center (Nov 9).",
    date: "November 08 & 09, 2024",
    location: "APIIT Foundation School & Nelung Arts Center",
    image: "/schedule/auditions.webp",
  },
  {
    id: "workshops",
    icon: Mic2,
    title: "Mentorship Workshops",
    subtitle: "Skill Elevation",
    description:
      "Stagecraft, choreography, music direction, and media coaching guided by industry mentors and alumni.",
    date: "December 06, 2024",
    location: "APIIT City Campus",
    image: "/schedule/workshops.webp",
  },
  {
    id: "press",
    icon: Newspaper,
    title: "Press Conference",
    subtitle: "Spotlight Moment",
    description:
      "Sponsors, media, and partners meet the finalists as we unveil production reveals and collabs.",
    date: "December 13, 2024",
    location: "APIIT Business School, Braybrooke Pl Main Auditorium",
    image: "/schedule/press-conference.webp",
  },
  {
    id: "finale",
    icon: Star,
    title: "Grand Finale",
    subtitle: "The Spectacle",
    description:
      "Nelum Pokuna Outdoor Arena transforms into Sri Lanka’s biggest student night with 2000+ fans, guest stars, and cinematic production.",
    date: "June 07, 2025",
    location: "Nelum Pokuna Outdoor Arena",
    image: "/schedule/grand-finale.webp",
    cta: {
      label: "Unlock Tickets",
      href: "#tickets",
    },
  },
];

export default function ScheduleTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      id="schedule"
      className="relative w-full py-24 sm:py-32 overflow-hidden"
    >
      {/* Dynamic Background */}
      <div className="absolute inset-0 -z-20 bg-[#0A0E27]" />
      <div
        className="absolute inset-0 -z-10 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 0%, rgba(255, 215, 0, 0.15) 0%, transparent 50%), radial-gradient(circle at 0% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20 sm:mb-32"
        >
          <span className="text-gold-500 text-sm font-bold tracking-[0.3em] uppercase mb-4 block">
            The Journey
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white font-display mb-6">
            Event Schedule
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Follow the path from auditions to the grand stage. Witness the evolution of talent.
          </p>
        </motion.div>

        {/* Timeline Container */}
        <div ref={containerRef} className="relative">
          {/* Central Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-white/10 -translate-x-1/2">
            <motion.div
              style={{ height: lineHeight }}
              className="absolute top-0 left-0 w-full bg-gradient-to-b from-gold-500 via-purple-500 to-gold-500 shadow-[0_0_15px_rgba(255,215,0,0.5)]"
            />
          </div>

          {/* Chapters */}
          <div className="space-y-16 sm:space-y-24 md:space-y-32">
            {scheduleChapters.map((chapter, index) => (
              <TimelineCard key={chapter.id} chapter={chapter} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TimelineCard({ chapter, index }: { chapter: Chapter; index: number }) {
  const isEven = index % 2 === 0;
  const Icon = chapter.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      className={`relative flex flex-col md:flex-row gap-8 md:gap-0 ${isEven ? "md:flex-row-reverse" : ""
        }`}
    >
      {/* Timeline Dot */}
      <div className="absolute left-4 md:left-1/2 top-0 md:top-8 w-4 h-4 rounded-full bg-[#0A0E27] border-2 border-gold-500 -translate-x-1/2 z-10 shadow-[0_0_10px_rgba(255,215,0,0.5)]">
        <div className="absolute inset-0 rounded-full bg-gold-500 animate-ping opacity-20" />
      </div>

      {/* Content Side */}
      <div className="w-full md:w-1/2 pl-14 sm:pl-16 md:pl-0 md:px-16">
        <div className="group relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm p-6 sm:p-8 hover:border-gold-500/30 transition-all duration-500 hover:shadow-[0_0_30px_rgba(0,0,0,0.3)]">
          {/* Hover Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-gold-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Card Header */}
          <div className="relative z-10 flex items-center justify-between mb-6">
            <span className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-gold-500">
              <Icon className="w-5 h-5 text-gold-500 filter drop-shadow-lg" />
              {chapter.subtitle}
            </span>
            <span className="text-[0.6rem] font-bold tracking-[0.3em] text-white/20">
              PHASE {String(index + 1).padStart(2, "0")}
            </span>
          </div>

          {/* Title & Description */}
          <div className="relative z-10 mb-8">
            <h3 className="text-2xl sm:text-3xl font-bold text-white font-display mb-3 group-hover:text-gold-200 transition-colors">
              {chapter.title}
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              {chapter.description}
            </p>
          </div>

          {/* Footer Info */}
          <div className="relative z-10 flex flex-wrap gap-y-3 gap-x-6 text-xs font-medium uppercase tracking-wider text-gray-500 border-t border-white/10 pt-6">
            <span className="inline-flex items-center gap-2 group-hover:text-gray-300 transition-colors">
              <Calendar className="h-4 w-4 text-gold-500" />
              {chapter.date}
            </span>
            <span className="inline-flex items-center gap-2 group-hover:text-gray-300 transition-colors">
              <MapPin className="h-4 w-4 text-purple-400" />
              {chapter.location}
            </span>
          </div>

          {/* CTA Button */}
          {chapter.cta && (
            <div className="relative z-10 mt-6 pt-2">
              <Link
                href={chapter.cta.href}
                className="inline-flex items-center gap-2 text-sm font-bold text-gold-500 hover:text-white transition-colors uppercase tracking-widest group/btn"
              >
                {chapter.cta.label}
                <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Empty Side for Layout Balance */}
      <div className="hidden md:block w-1/2" />
    </motion.div>
  );
}
