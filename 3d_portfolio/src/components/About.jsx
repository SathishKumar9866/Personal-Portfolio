import { motion } from "framer-motion";
import { profile, projects } from "../constants";
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
 *  - **They were claims on a page that promises evidence.** The lede promises
 *    "results reported as measured, including the ones that came back
 *    negative" (it was the headline's own second sentence until 2026-09-14);
 *    the cards said "Turning raw data into decisions"
 *    and "built to generalize past the demo", which is true of every ML
 *    engineer who has ever written a portfolio. The actual evidence — shipped
 *    systems, with diagrams of how they work — was 3,000px further down.
 *  - **They cost ~700px** between the lede and Experience, which is the section
 *    a recruiter opens this page to read.
 *
 * Breadth is still on the page. It is in Stack, where it is specific, and in
 * Work, where it is demonstrated.
 */
/**
 * What the work does, and the project that proves each one.
 *
 * The claim is editorial; the PROOF is the project's own `outcome` string,
 * resolved by name at module load. Nothing here is typed twice: rename a
 * project in `constants` and the row disappears rather than printing a proof
 * that no longer exists, which is the house rule — absent beats invented.
 */
const PRINCIPLES = [
  { claim: "It runs where the data already is", name: "federated-yolov8-object-detection" },
  { claim: "It shows the source it used", name: "ai-due-diligence-copilot" },
  { claim: "You can try it in a minute, with no account", name: "pb-card-deck" },
]
  .map((p) => ({ ...p, project: projects.find((x) => x.name === p.name) }))
  .filter((p) => p.project);

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
    {/* Three columns from `lg`, two below it, one on a phone.
        
        The scene is 1425px wide and this block used to be capped at `max-w-5xl`
        — so the section that opens the page left roughly 40% of its own stage
        empty, which reads as an unfinished layout rather than as air. The
        availability card moves to its own column at the width where there is
        room for it, and the measure of the prose is unchanged: it is the
        COLUMN that got narrower, not the line length. */}
    <div className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-8 sm:gap-10 md:grid-cols-[minmax(0,240px)_minmax(0,1fr)] lg:grid-cols-[minmax(0,260px)_minmax(0,1fr)_minmax(0,23rem)] md:items-start">
      <motion.div variants={fadeIn("right", "spring", 0.1, 0.7)} className="max-w-[260px]">
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
          than the title.
        </motion.p>

        {/* Three things the work does, each with the thing that proves it.
            
            This replaces two sentences. "The work tends to run offline, ground
            its answers in real sources, and be easy to try in a minute" said
            exactly what these three rows say — but said it as a promise, in a
            section whose neighbours are all evidence. Every proof below is a
            project's own `outcome` string, quoted, and the reader can go and
            look at it.
            
            The other sentence was "Calm, disciplined, focused on what I can
            control." It is the one line on the page that nothing can check, and
            it is on about half the portfolios on the internet. */}
        <motion.ul variants={fadeIn("", "", 0.15, 1)} className="list-none space-y-6 max-w-[40rem]">
          {PRINCIPLES.map(({ claim, project }) => (
            <li key={claim}>
              <p className="flex items-baseline gap-3 font-sans font-medium text-white-100 text-[calc(clamp(1.02rem,1.3vw,1.18rem)*var(--type-scale,1))] leading-snug">
                <span aria-hidden="true" className="relative top-[-0.3em] h-px w-5 shrink-0 bg-accent/70" />
                {claim}
              </p>
              <p className="mt-1.5 pl-8 font-sans text-secondary text-body leading-[1.55]">
                {project.outcome}
              </p>
              <a
                href="#work"
                className="mt-1 ml-8 inline-block font-mono text-label text-faint hover:text-accent transition-colors"
              >
                {project.name} ↓
              </a>
            </li>
          ))}
        </motion.ul>

      </motion.div>

      {/* Its own column from `lg`, still stacked under the prose below that.
          The card is the one thing in this section a recruiter is looking for,
          and in the stacked layout it sat 900px down the page. */}
      <motion.div variants={fadeIn("up", "spring", 0.2, 0.7)} className="md:col-span-2 lg:col-span-1">
        <Availability />
      </motion.div>
    </div>
  </>
);

export default SectionWrapper(About, "about");
