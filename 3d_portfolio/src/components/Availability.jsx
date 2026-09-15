import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { status } from "../constants";

/**
 * Owns, the employment-status signal, that he is looking NOW, what for, and
 * how to start the conversation without scrolling further.
 * Does not own: contact routes (Contact.jsx, ContactRail.jsx).
 *
 * Two sizes, one source. `compact` is the hero's one-line version; the full
 * version carries the detail a recruiter actually needs, employer, country and
 * work arrangement, which was previously only on LinkedIn.
 *
 * This is the one block on the page whose job is to convert, so it is the one
 * place that earns sustained motion: a live dot, a slow specular sweep, rows
 * that arrive in sequence, and a rail that fills as the card crosses the
 * screen. Everything else on the page stays still, which is what makes this
 * read as emphasis rather than noise.
 *
 * Reduced motion kills all of it, and that needs saying precisely, because the
 * obvious assumption is wrong. The `@media (prefers-reduced-motion)` block in
 * index.css only zeroes CSS `animation-duration` and `transition-duration`,
 * which covers the ping and the sweep. Framer writes `opacity` and `y` as
 * inline styles from its own rAF loop, so that block never touched them:
 * measured, the three facts still slid 8px and faded under reduced motion.
 * `initial={reduced ? false : "hidden"}` is what actually stops it — the same
 * thing Hero.jsx does — and the rail is pinned full through `useReducedMotion`.
 * The card states every fact with zero movement, because the facts are the
 * point and the motion is only emphasis.
 *
 * ## Why a stack and not a two-column list
 *
 * It used to be a `5.5rem` label column with the value beside it, collapsing to
 * one column below `sm`. Two things were wrong with that on a phone, measured
 * at 390px:
 *
 *  - **Nothing grouped a fact.** `gap-y-2` sat between the label and its value
 *    AND between that value and the next label, so all six rows were 8px apart
 *    and the eye could not tell which value belonged to which label.
 *  - **Values broke mid-phrase**: "AdvanSoft / International, Inc" and
 *    "hybrid or / remote", because a 317px column was asked to hold a sentence.
 *
 * So each fact is now a block: the label, a rule, then its value on its own
 * line or lines. Tight inside a fact, loose between them, which is the spacing
 * that does the grouping. The parts that were one sentence get a line each —
 * role above employer, country above arrangement — so nothing wraps by
 * accident, and what wraps is a choice.
 */
const Dot = () => (
  <span className="relative grid place-items-center shrink-0 w-2.5 h-2.5">
    <span aria-hidden="true" className="status-ping absolute inset-0 rounded-full bg-live" />
    <span className="relative w-2 h-2 rounded-full bg-live" />
  </span>
);

export const AvailabilityCompact = () => (
  <span className="inline-flex items-center gap-2 font-sans text-[15px] font-medium text-live">
    <Dot />
    Open to {status.openTo}
  </span>
);

const row = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.2, 0.65, 0.3, 0.9] },
  },
};

// The rule under a label draws itself left to right as the fact arrives. It is
// the one piece of motion here that is not a fade: a line being drawn reads as
// something being written down, which is what the card is doing.
const rule = {
  hidden: { scaleX: 0 },
  show: {
    scaleX: 1,
    transition: { duration: 0.5, ease: [0.2, 0.65, 0.3, 0.9] },
  },
};

/**
 * One fact. `lines` is the value: the first line carries it, any line after it
 * is the qualifier and is set quieter, so "AI Engineer" leads and the employer
 * supports it rather than competing at the same weight.
 */
const Fact = ({ label, lines }) => (
  <motion.div variants={row} className="min-w-0">
    <dt className="font-sans text-[12px] font-medium uppercase tracking-[0.09em] text-faint">
      {label}
    </dt>
    <motion.span
      aria-hidden="true"
      variants={rule}
      className="block mt-1.5 h-px origin-left bg-line-strong/50"
    />
    <dd className="mt-2 min-w-0">
      {lines.map((line, i) => (
        <p
          key={line}
          className={`font-sans break-words tracking-[-0.01em] ${
            i === 0
              ? "text-[17px] font-medium text-white-100"
              : "mt-0.5 text-[15px] text-secondary"
          }`}
        >
          {line}
        </p>
      ))}
    </dd>
  </motion.div>
);

const Availability = () => {
  const reduced = useReducedMotion();
  const ref = useRef(null);
  // The rail fills as the card crosses the screen. `offset` is the same pair
  // Works.jsx uses for its cover parallax, so the two scroll-linked things on
  // the page are driven the same way.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end center"],
  });
  // Starts part-filled rather than at zero: a rail that is empty until the card
  // is halfway up the screen reads as broken, not as progress.
  const railScale = useTransform(scrollYProgress, [0, 1], reduced ? [1, 1] : [0.12, 1]);

  return (
    <motion.div
      ref={ref}
      // `false`, not "hidden": it renders the children at their target values
      // and runs nothing. See the note about framer and the CSS block above.
      initial={reduced ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, amount: "some" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09 } } }}
      className="relative min-w-0 overflow-hidden rounded-[18px] glass-card p-4 sm:p-5"
    >
      <span aria-hidden="true" className="glass-sweep" />

      <motion.p
        variants={row}
        className="relative flex flex-wrap items-center gap-x-2 gap-y-1 font-sans font-semibold text-[13px] uppercase tracking-[0.1em] text-live"
      >
        <Dot />
        Open to work
        <span className="font-normal text-[13px] text-faint normal-case tracking-normal">· available now</span>
      </motion.p>

      {/* The facts sit inside a rail: a hairline the full height of the list,
          with an accent line scaling up it as the reader scrolls the card past.
          It is the only scroll-linked motion in this block, and it is on the
          margin rather than on the text. */}
      <div className="relative mt-4 pl-4">
        <span aria-hidden="true" className="absolute left-0 inset-y-0 w-px bg-line" />
        <motion.span
          aria-hidden="true"
          style={{ scaleY: railScale }}
          className="absolute left-0 inset-y-0 w-px origin-top bg-live/70"
        />

        {/* 28px between facts against 15px from a label to its value. The
            ratio is the grouping: at gap-5 the two were 20 and 15, close enough
            that the eye read six evenly spaced rows again, which was the
            original complaint. */}
        <dl className="grid gap-7">
          <Fact label="Currently" lines={[status.role, status.company]} />
          {/* `Looking for: {status.openTo}` used to sit here, and the hero pill
              two screens up renders THE SAME FIELD as "Open to AI engineering
              roles" — one fact, printed twice, with this card's own header
              saying "Open to work" above it for a third time. The hero keeps it:
              a recruiter landing cold should read what he wants in the first
              screen, not in a card further down. */}
          <Fact label="Where" lines={[status.country, status.arrangement]} />
        </dl>
      </div>

      {/* The block announces that he is looking; this is the step that follows
          from it. Without it the card is a statement with no next action. */}
      <motion.a
        variants={row}
        href="#contact"
        className="group relative mt-5 inline-flex items-center gap-2 rounded-xl border border-live/60 px-4 min-h-11 sm:min-h-10 font-sans text-[15px] font-medium text-live transition-colors hover:bg-live/10 hover:border-live"
      >
        Reach out
        <span
          aria-hidden="true"
          className="transition-transform duration-200 group-hover:translate-x-0.5"
        >
          →
        </span>
      </motion.a>
    </motion.div>
  );
};

export default Availability;
