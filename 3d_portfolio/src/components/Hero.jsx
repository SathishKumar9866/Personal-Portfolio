import { lazy, Suspense } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { styles } from "../styles";

// three.js only loads when the hero mounts, kept out of the initial bundle
const ComputersCanvas = lazy(() => import("./canvas/Computers"));

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.15 } },
};
const rise = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.7, ease: [0.2, 0.65, 0.3, 0.9] } },
};

const Hero = () => {
  const reduced = useReducedMotion();
  return (
    <section className="relative w-full h-screen mx-auto" aria-label="Intro">
      <Suspense fallback={null}>
        <ComputersCanvas />
      </Suspense>

      <motion.div
        variants={container}
        initial={reduced ? false : "hidden"}
        animate="show"
        className={`${styles.paddingX} absolute inset-0 top-[18vh] max-w-7xl mx-auto flex flex-row items-start gap-5 z-10 pointer-events-none`}
      >
        <div className="flex flex-col items-center mt-3">
          <div className="w-3 h-3 rounded-full bg-accent shadow-glow" />
          <div className="w-px sm:h-72 h-40 accent-rail" />
        </div>

        <div className="max-w-2xl">
          <motion.p variants={rise} className={`${styles.sectionSubText} mb-4`}>
            Data → model → interface
          </motion.p>
          <motion.h1 variants={rise} className={styles.heroHeadText}>
            Hi, I&apos;m <span className="text-accent">Sathish</span>.
          </motion.h1>
          <motion.p variants={rise} className={`${styles.heroSubText} mt-6 max-w-xl`}>
            I take a real problem — from the data and the model to a working
            interface — and ship something a person can actually use.
          </motion.p>
        </div>
      </motion.div>

      {/* on-brand scroll cue, not the template mouse-dot */}
      <a
        href="#about"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 group"
        aria-label="Scroll to about"
      >
        <span className="font-mono text-[10px] tracking-label uppercase text-faint group-hover:text-accent transition-colors">
          scroll
        </span>
        <span className="relative block w-px h-10 bg-line overflow-hidden">
          <motion.span
            className="absolute inset-x-0 top-0 h-4 bg-accent"
            animate={reduced ? {} : { y: [-16, 40] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeIn" }}
          />
        </span>
      </a>
    </section>
  );
};

export default Hero;
