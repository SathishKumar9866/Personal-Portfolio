import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BackToTop = () => {
  const [past, setPast] = useState(false);

  useEffect(() => {
    const on = () => setPast(window.scrollY > window.innerHeight);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  // It used to hide itself once the footer appeared, to avoid painting a scrim
  // over the colophon. That removed the control from exactly the place a reader
  // who has reached the end looks for it. The footer reserves space for it
  // instead, at every width.
  const show = past;

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          onClick={() =>
            window.scrollTo({
              top: 0,
              // An explicit behavior beats the CSS reduced-motion reset, and
              // this is a multi-thousand-pixel scroll.
              behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
                ? "auto"
                : "smooth",
            })
          }
          aria-label="Back to top"
          className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full border border-line-strong bg-tertiary/90 backdrop-blur text-white-100 hover:border-accent hover:text-accent transition-colors flex items-center justify-center font-mono"
        >
          ↑
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default BackToTop;
