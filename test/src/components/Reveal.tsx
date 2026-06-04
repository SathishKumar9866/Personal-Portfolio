"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ElementType, ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** vertical offset to animate from (px) */
  y?: number;
  as?: "div" | "li" | "span";
};

/**
 * Fade + slide content in once it scrolls into view.
 * Honours prefers-reduced-motion by rendering statically.
 */
export const Reveal = ({
  children,
  className,
  delay = 0,
  y = 16,
  as = "div",
}: RevealProps) => {
  const reduce = useReducedMotion();

  if (reduce) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  const MotionTag = motion[as] as ElementType;

  return (
    <MotionTag
      // data-reveal lets a <noscript> rule force content visible when JS is
      // off/blocked - otherwise framer-motion's SSR `opacity:0` leaves the
      // page blank below the header. See layout.tsx noscript fallback.
      data-reveal=""
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
    >
      {children}
    </MotionTag>
  );
};
