"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function RegisterHeader({ children }: { children: ReactNode }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE }}
      className="relative px-6 pt-14 pb-10 sm:px-10"
    >
      {children}
    </motion.section>
  );
}
