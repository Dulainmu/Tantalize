"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { PropsWithChildren, useEffect, useRef, useState } from "react";

type Props = PropsWithChildren<{
  strength?: number; // max translate in px
  className?: string;
  disableOnMobile?: boolean;
}>;

export default function ParallaxSection({ strength = 10, className, children, disableOnMobile = true }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const prefersReduced = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (!disableOnMobile) return;
    const mq = window.matchMedia('(max-width: 768px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, [disableOnMobile]);

  const disabled = prefersReduced || (disableOnMobile && isMobile) || strength === 0;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [strength, -strength]);

  if (disabled) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div ref={ref} style={{ y, willChange: "transform" }} className={className}>
      {children}
    </motion.div>
  );
}
