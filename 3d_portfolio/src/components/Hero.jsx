import { motion, useReducedMotion } from "framer-motion";
import { styles } from "../styles";
import LiveClock from "./LiveClock";
import { AvailabilityCompact } from "./Availability";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.08 } },
};
const rise = {
  hidden: { y: 16, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.2, 0.65, 0.3, 0.9] } },
};

const Hero = () => {
  const reduced = useReducedMotion();
  return (
    <section className="relative w-full min-h-screen min-h-[100svh] flex items-center pt-20" aria-label="Intro">

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
          I ship the model{" "}
          <span className="whitespace-nowrap">
            &mdash; and the{" "}
            <span className="text-accent">evidence it works</span>.
          </span>
        </motion.h1>

        <motion.p
          variants={rise}
          className="mt-7 font-sans text-secondary text-[clamp(1rem,1.6vw,1.3rem)] leading-[1.55] max-w-xl"
        >
          ML / AI engineer across the data-to-AI stack. Retrieval that cites the
          passage it used, vision that trains where the data already lives, and
          results reported as measured &mdash; including the ones that came back
          negative.
        </motion.p>

        {/* One CTA, not two. "Get in touch" was the fifth route to #contact —
            navbar, right rail, palette, and "Reach out →" in the status card a
            screen below, which carries context a bare button cannot. A secondary
            button beside a primary splits the click rather than adding a path. */}
        <motion.div variants={rise} className="mt-10 flex flex-wrap items-center gap-4">
          <a
            href="#work"
            className="inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3 font-sans font-semibold text-[15px] text-black-100 hover:brightness-95 transition"
          >
            See my work
          </a>

        </motion.div>

        <motion.div variants={rise} className="mt-5">
          <AvailabilityCompact />
        </motion.div>
      </motion.div>

      <a
        href="#about"
        className="absolute bottom-8 right-6 sm:right-10 z-10 hidden sm:flex flex-col items-center gap-2 group"
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
