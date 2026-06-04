"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Types/erases through a list of phrases. Honours reduced motion
 * (shows the first phrase statically) and is jsdom-safe.
 */
export const Typewriter = ({
  phrases,
  className,
}: {
  phrases: string[];
  className?: string;
}) => {
  const reduce = useReducedMotion();
  const [text, setText] = useState(phrases[0] ?? "");

  useEffect(() => {
    if (reduce || phrases.length === 0) return;

    let phrase = 0;
    let char = 0;
    let deleting = false;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      const current = phrases[phrase];
      char += deleting ? -1 : 1;
      setText(current.slice(0, char));

      let delay = deleting ? 45 : 80;
      if (!deleting && char === current.length) {
        delay = 1400; // pause at full word
        deleting = true;
      } else if (deleting && char === 0) {
        deleting = false;
        phrase = (phrase + 1) % phrases.length;
        delay = 250;
      }
      timer = setTimeout(tick, delay);
    };

    timer = setTimeout(tick, 600);
    return () => clearTimeout(timer);
  }, [phrases, reduce]);

  return (
    <span className={className}>
      {text}
      {!reduce && (
        <span className="-mb-[2px] ml-0.5 inline-block h-[1em] w-[2px] animate-pulse bg-accent align-baseline" />
      )}
    </span>
  );
};
