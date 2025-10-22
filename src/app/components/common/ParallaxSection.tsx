"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { PropsWithChildren, useRef } from "react";

type Props = PropsWithChildren<{
  strength?: number; // max translate in px
  className?: string;
}>;

export default function ParallaxSection({ strength = 10, className, children }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [strength, -strength]);
  return (
    <motion.div ref={ref} style={{ y, willChange: "transform" }} className={className}>
      {children}
    </motion.div>
  );
}

