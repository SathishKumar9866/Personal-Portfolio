"use client";

import { motion } from "framer-motion";

/** The trailing rule line in a section eyebrow - draws out (scaleX) on reveal. */
export const RuleLine = () => (
  <motion.span
    aria-hidden="true"
    className="h-px flex-1 origin-left bg-line"
    initial={{ scaleX: 0 }}
    whileInView={{ scaleX: 1 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.6, ease: "easeOut" }}
  />
);
