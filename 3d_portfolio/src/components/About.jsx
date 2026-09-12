import { motion } from "framer-motion";
import { profile } from "../constants";
import { fadeIn } from "../utils/motion";
import { SectionWrapper } from "../hoc";
import SectionHead from "./SectionHead";
import Availability from "./Availability";

/* Portrait slot. Holds its shape whether or not the image exists yet, so
   dropping a file in later changes nothing about the layout. */
const Portrait = () => (
  <div className="w-full aspect-[4/5] rounded-2xl border border-line bg-tertiary overflow-hidden">
    {profile.photo ? (
      <img
        src={profile.photo}
        alt={profile.alt}
        className="w-full h-full object-cover"
        loading="lazy"
      />
    ) : (
      <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-faint">
        <span className="font-display text-[34px] leading-none text-line">S</span>
        <span className="font-sans text-[12px] font-medium uppercase tracking-[0.09em]">
          portrait: to come
        </span>
      </div>
    )}
  </div>
);

/**
 * Owns, the introduction: who he is, in his words, and the fact that he is
 * looking.
 * Does not own: what he can do. That is `Tech.jsx`, and it used to be said
 * twice.
 *
 * There were six capability cards under this, `Data Engineering` through
 * `Software & Full-Stack`. They came out, and the deletion is the point:
 *
 *  - **They restated Stack.** Six cards partitioning his skills six ways, above
 *    six stack groups partitioning the same skills six ways. The reader met the
 *    same taxonomy twice, in different words, 2,000px apart.
 *  - **They were claims on a page that promises evidence.** The hero says "And
 *    the evidence it works"; the cards said "Turning raw data into decisions"
 *    and "built to generalize past the demo", which is true of every ML
 *    engineer who has ever written a portfolio. The actual evidence — shipped
 *    systems, with diagrams of how they work — was 3,000px further down.
 *  - **They cost ~700px** between the lede and Experience, which is the section
 *    a recruiter opens this page to read.
 *
 * Breadth is still on the page. It is in Stack, where it is specific, and in
 * Work, where it is demonstrated.
 */
const About = () => (
  <>
    {/* No meta line, deliberately: the first section sets no pattern for the
        rest to repeat, and there is no honest number to put over an
        introduction. See SectionHead. */}
    <SectionHead title="Overview" />

    {/* Portrait in its own column; the bio and the status block share the
        second, so the status no longer drops below the portrait and leaves a
        step of dead space beside it. */}
    {/* max-w-5xl is the section's one measure. It used to be justified by the
        capability grid below it; the grid is gone and the measure stays,
        because it is what keeps the status card from overshooting the lede. */}
    <div className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-8 sm:gap-10 md:grid-cols-[minmax(0,220px)_minmax(0,1fr)] md:items-start max-w-5xl">
      <motion.div variants={fadeIn("right", "spring", 0.1, 0.7)} className="max-w-[220px]">
        <Portrait />
      </motion.div>

      {/* motion.div, not div: framer propagates variants only through motion
          components, so a plain wrapper here leaves the children stuck in the
          `hidden` variant at opacity 0, the same failure that hid Work. */}
      <motion.div className="flex flex-col gap-7">
        <motion.p
          variants={fadeIn("", "", 0.1, 1)}
          // Widened as a LEDE, not as a longer line. Filling the 892px column at 17px
          // would run ~126 characters a line, roughly 70% past the readable band.
          // Larger type on a wider measure fills the space and keeps ~71 characters.
          className="font-serif text-secondary text-[calc(clamp(1.1rem,1.5vw,1.35rem)*var(--type-scale,1))] max-w-[40rem] leading-[1.65]"
        >
          I work across the full data-to-AI stack and care about the problem more
          than the title. The work tends to run offline, ground its answers in real
          sources, and be easy to try in a minute, because that is what makes it
          worth building. Calm, disciplined, focused on what I can control.
        </motion.p>

        <motion.div variants={fadeIn("up", "spring", 0.2, 0.7)}>
          <Availability />
        </motion.div>
      </motion.div>
    </div>
  </>
);

export default SectionWrapper(About, "about");
