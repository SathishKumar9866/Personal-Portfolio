import { motion, useReducedMotion } from "framer-motion";
import { styles } from "../styles";
import LiveClock from "./LiveClock";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.08 } },
};
const rise = {
  hidden: { y: 16, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.2, 0.65, 0.3, 0.9] } },
};

// quiet motion detail — a drifting signal contour in the brand red
const SignalLine = ({ reduced }) => (
  <div
    className="pointer-events-none absolute inset-x-0 bottom-[10vh] z-0 overflow-hidden opacity-60"
    aria-hidden="true"
  >
    <svg
      className={reduced ? "" : "hero-signal"}
      width="180%"
      height="140"
      viewBox="0 0 2400 140"
      preserveAspectRatio="none"
      fill="none"
    >
      <path
        d="M0 90 C 120 90 140 40 260 40 S 400 120 520 120 620 30 720 30 860 100 980 100 1080 45 1200 45 1340 115 1460 115 1560 35 1680 35 1820 95 1940 95 2040 50 2160 50 2300 100 2400 100"
        stroke="#FF3621"
        strokeWidth="1.5"
        strokeOpacity="0.35"
      />
    </svg>
  </div>
);

const Hero = () => {
  const reduced = useReducedMotion();
  return (
    <section className="relative w-full min-h-screen flex items-center" aria-label="Intro">
      <SignalLine reduced={reduced} />

      <motion.div
        variants={container}
        initial={reduced ? false : "hidden"}
        animate="show"
        className={`${styles.paddingX} relative z-10 max-w-7xl mx-auto w-full`}
      >
        <motion.div
          variants={rise}
          className="flex items-center justify-between border-b border-line pb-4 mb-10 sm:mb-14 font-mono text-[11px] uppercase tracking-label"
        >
          <span className="text-secondary">Sathish Kumar</span>
          <LiveClock className="text-[11px] hidden sm:inline" />
        </motion.div>

        <motion.h1
          variants={rise}
          className={`${styles.heroHeadText} max-w-[18ch]`}
        >
          I&apos;m Sathish. I turn data and models into things people{" "}
          <span className="text-accent">actually use</span>.
        </motion.h1>

        <motion.p
          variants={rise}
          className="mt-7 font-sans text-secondary text-[clamp(1rem,1.6vw,1.3rem)] leading-[1.55] max-w-xl"
        >
          An ML / AI engineer across the full data-to-AI stack — RAG, computer
          vision, and products shipped offline-first, cited, and evaluated. I care
          about the problem more than the title.
        </motion.p>

        <motion.div variants={rise} className="mt-10 flex flex-wrap items-center gap-4">
          <a
            href="#work"
            className="inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3 font-sans font-semibold text-[15px] text-white hover:brightness-95 transition"
          >
            See my work
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-md border border-line px-6 py-3 font-sans font-semibold text-[15px] text-white-100 hover:border-accent hover:text-accent transition-colors"
          >
            Get in touch
          </a>
          <span className="inline-flex items-center gap-2 font-mono text-[12px] text-live ml-1">
            <span className="w-2 h-2 rounded-full bg-live" />
            Open to roles
          </span>
        </motion.div>
      </motion.div>

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
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeIn" }}
          />
        </span>
      </a>
    </section>
  );
};

export default Hero;
