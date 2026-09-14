import { motion, useReducedMotion } from "framer-motion";
import { styles } from "../styles";
import LiveClock from "./LiveClock";
import CodeCompletion from "./CodeCompletion";
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
  // Top-aligned, not centred. Centring a 549px composition in a 900px viewport
  // left 140px of dead space between the navbar and the name, and the matching
  // 136px at the bottom was not dead: the scroll cue lives there. So the slack
  // was only ever visible at the top. An explicit top padding puts the gap
  // where it was chosen rather than where the arithmetic landed.
  return (
    <section className="relative w-full min-h-screen min-h-[100svh] flex items-start pt-28 sm:pt-32" aria-label="Intro">
      {/* Something behind the headline. See `.bloom` in index.css: the page had
          nothing between the type and a flat ground, which is most of why it
          read as older than it is. */}
      <span aria-hidden="true" className="bloom" />

      <motion.div
        variants={container}
        initial={reduced ? false : "hidden"}
        animate="show"
        className={`${styles.paddingX} relative z-10 max-w-7xl mx-auto w-full`}
      >
        <motion.div
          variants={rise}
          className="flex items-center justify-between border-b border-line pb-4 mb-10 sm:mb-14"
        >
          <span className="font-sans text-[13px] font-medium uppercase tracking-[0.09em] text-secondary">
            Sathish Kumar
          </span>
          <LiveClock className="text-label hidden sm:inline" />
        </motion.div>

        <motion.h1
          variants={rise}
          className={`${styles.heroHeadText} max-w-[18ch]`}
        >
          From model development{" "}
          {/* No `whitespace-nowrap` here. It kept the second sentence on one
              line, which held at 100% and overflowed the viewport by 11px once
              the reader's text-size control reached 140%: the span measured
              1314px against a 1440px window and was the only thing on the page
              that overflowed. `max-w-[18ch]` on the h1 already governs where
              this breaks. */}
          <span>
            to{" "}
            <span className="text-accent-ink">
              {/* `real-world` is held together: a line break at the hyphen left
                  "real-" hanging at the end of a line, which reads as a broken
                  word rather than a compound one. One 10-character token, so it
                  cannot be what overflows — measured at 390px and 140%. */}
              <span className="whitespace-nowrap">real-world</span> impact
            </span>
            .
          </span>
        </motion.h1>

        <motion.p
          variants={rise}
          className="mt-7 font-sans text-secondary text-[calc(clamp(1rem,1.6vw,1.3rem)*var(--type-scale,1))] leading-[1.55] max-w-xl"
        >
          AI engineer across the data-to-AI stack. Retrieval that cites the
          passage it used, vision that trains where the data already lives, and
          results reported as measured, including the ones that came back
          negative.
        </motion.p>

        {/* One CTA, not two. "Get in touch" was the fifth route to #contact, navbar, right rail, palette, and "Reach out →" in the status card a
            screen below, which carries context a bare button cannot. A secondary
            button beside a primary splits the click rather than adding a path. */}
        <motion.div variants={rise} className="mt-10 flex flex-wrap items-center gap-4">
          {/* Lands on Experience, not Projects. It pointed at #work, which
              jumped the reader over the entire career history to the project
              grid: the one CTA on the page skipped the section a recruiter
              opens a portfolio to read. From here the page reads in its
              intended order, experience, then stack, then the projects those
              two produced. */}
          <a
            href="#experience"
            className="btn-accent inline-flex items-center gap-2 rounded-2xl px-7 py-3.5 font-sans font-semibold text-[15px] tracking-[-0.01em] text-black-100"
          >
            Start with my experience
          </a>

        </motion.div>

        <motion.div variants={rise} className="mt-5">
          <AvailabilityCompact />
        </motion.div>
      </motion.div>

      {/* The lower slack, below `rail`. The hero is `min-h-screen` and
          top-aligned, so its content ends at 591 of 844 on a phone and the rest
          was empty: the scroll cue that earns that space on a desktop is
          `hidden sm:flex`. Absolute, so it fills what was already there and
          adds no height. */}
      <CodeCompletion />

      <a
        href="#about"
        className="absolute bottom-8 right-6 sm:right-10 z-10 hidden sm:flex flex-col items-center gap-2 group"
        aria-label="Scroll to about"
      >
        <span className="font-mono text-micro tracking-label uppercase text-faint group-hover:text-accent transition-colors">
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
