"use client";

import { useEffect, useMemo, useState } from "react";

type Marker = { id: string; label: string };

const SECTIONS: Marker[] = [
  { id: "about", label: "About" },
  { id: "purpose-legacy", label: "Legacy" },
  { id: "lineup", label: "Lineup" },
  { id: "tickets", label: "Tickets" },
  { id: "committee", label: "Committee" },
  { id: "schedule", label: "Schedule" },
  { id: "sponsors", label: "Sponsors" },
  { id: "contact", label: "Contact" },
];

export default function ScrollMarkers() {
  const [active, setActive] = useState<string>(SECTIONS[0].id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -45% 0px",
        threshold: 0.35,
      }
    );

    const nodes = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean) as Element[];
    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, []);

  const onJump = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const markers = useMemo(() => SECTIONS, []);

  return (
    <div className="fixed right-3 md:right-5 top-1/2 -translate-y-1/2 z-40 hidden sm:flex flex-col items-center gap-3">
      {markers.map((m) => {
        const isActive = m.id === active;
        return (
          <button
            key={m.id}
            onClick={() => onJump(m.id)}
            aria-label={m.label}
            aria-current={isActive ? "true" : undefined}
            className={`relative h-3 w-3 rounded-full border transition-all duration-300 ${isActive
                ? "border-[#FFD700]/70 bg-[#FFD700] shadow-[0_0_14px_rgba(255,215,0,0.7)]"
                : "border-white/20 bg-white/10 hover:border-[#FFD700]/50 hover:bg-[#FFD700]/20"
              }`}
          >
            <span className="pointer-events-none absolute -left-1 -right-1 -top-1 -bottom-1 rounded-full" />
          </button>
        );
      })}
    </div>
  );
}

