"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ReactNode } from "react";
import { Users, Mic2, Trophy, Speaker } from "lucide-react";
import CheckerStripe from "@/components/after-hours/CheckerStripe";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const FACTS: { icon: ReactNode; text: string }[] = [
  { icon: <Users size={16} />, text: "Open to students from every university in Sri Lanka" },
  { icon: <Mic2 size={16} />, text: "Solo, duo/group, band, or dance — any category" },
  { icon: <Trophy size={16} />, text: "Winners advance to the Tantalize 2026 grand finale" },
  { icon: <Speaker size={16} />, text: "Drum set & sound system provided on the day" },
];

export default function RegisterSidebar({ children }: { children: ReactNode }) {
  return (
    <motion.aside
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE }}
      className="lg:sticky lg:top-10 lg:self-start"
    >
      <Link
        href="/after-hours"
        className="text-xs tracking-[0.2em] text-white/40 transition-colors hover:text-white/70"
        style={{ fontFamily: "var(--font-ah-mono), monospace" }}
      >
        ← BACK TO AFTER HOURS
      </Link>

      {children}

      <div className="mt-8 hidden lg:block">
        <CheckerStripe className="max-w-[220px]" />
        <ul className="mt-6 flex flex-col gap-4">
          {FACTS.map((fact, i) => (
            <motion.li
              key={fact.text}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.08, ease: EASE }}
              className="flex items-start gap-3 text-sm text-white/60"
            >
              <span className="mt-0.5 text-fuchsia-400">{fact.icon}</span>
              {fact.text}
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.aside>
  );
}
