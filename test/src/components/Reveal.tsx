"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ElementType, ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** vertical offset to animate from (px) */
  y?: number;
  /** horizontal offset to animate from (px) - for directional reveals */
  x?: number;
  /** scale on hover (framer-motion owns transform, so CSS hover:scale is
   *  ignored on this element - use this instead). e.g. 1.2 = +20% */
  hoverScale?: number;
  as?: "div" | "li" | "span";
};

/**
 * Fade + slide content in once it scrolls into view (from below by default,
 * or from a side when `x` is set). Honours prefers-reduced-motion.
 */
export const Reveal = ({
  children,
  className,
  delay = 0,
  y = 16,
  x = 0,
  hoverScale,
  as = "div",
}: RevealProps) => {
  const reduce = useReducedMotion();

  if (reduce) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  const MotionTag = motion[as] as ElementType;
  const hover =
    hoverScale != null
      ? {
          whileHover: { scale: hoverScale, zIndex: 10 },
          transition: { type: "spring", stiffness: 300, damping: 22 },
        }
      : {};

  return (
    <MotionTag
      // data-reveal lets a <noscript> rule force content visible when JS is
      // off/blocked - otherwise framer-motion's SSR `opacity:0` leaves the
      // page blank below the header. See layout.tsx noscript fallback.
      data-reveal=""
      className={className}
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      {...hover}
    >
      {children}
    </MotionTag>
  );
};
