"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

/** Counts 0 → `to` once, when scrolled into view. Reduced-motion shows `to`. */
export const CountUp = ({
  to,
  duration = 900,
}: {
  to: number;
  duration?: number;
}) => {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  // Start at the final value so SSR / no-JS / crawlers read the real number
  // (not "0 years"); the client animates 0 -> to once it scrolls into view.
  const [value, setValue] = useState(to);

  useEffect(() => {
    if (reduce || !inView) return;
    let raf = 0;
    let start: number | null = null;
    setValue(0);
    const tick = (t: number) => {
      if (start === null) start = t;
      const p = Math.min((t - start) / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(eased * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, to, duration]);

  return <span ref={ref}>{value}</span>;
};
