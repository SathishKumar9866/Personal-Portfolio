/* ---------------------------------------------------------------------------
   PLAIN ENGLISH.

   The Roles section: four jobs as cards that STACK. Scroll, and each card stops
   under the navbar while the next slides up over it, like dealing a hand.

   That is `position: sticky` and nothing else — no scroll listener moves the
   cards. The two hooks below handle the two things sticky cannot decide by
   itself:

     useDeckFits     — is the tallest card shorter than the room it has? If not,
                       a pinned card would hide its own bottom (measured: 192px
                       of text unreachable on a short laptop screen), so the
                       whole effect turns itself off and it becomes a plain list.

     useCoveredCards — which cards are buried? Those dim their text, so the card
                       being read is the only bright one and the half-sentence
                       peeking out from underneath reads as "a card behind"
                       rather than as broken text.

   Walked through slowly: docs/LEARNING-NOTES.md, sections 4 and 8.
--------------------------------------------------------------------------- */
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { experience, education } from "../constants";
import { fadeIn } from "../utils/motion";
import { SectionWrapper } from "../hoc";
import SectionHead from "./SectionHead";
import Reveal from "./Reveal";
import TagTerm from "./TagTerm";
import CareerTrack from "./CareerTrack";
import MobileCollapse from "./MobileCollapse";

/** "2024-03" -> "Mar 2024". Returns null for null, so callers can omit cleanly. */
const month = (iso) => {
  if (!iso) return null;
  const [y, m] = iso.split("-");
  const d = new Date(Number(y), Number(m) - 1, 1);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
};

/**
 * A range renders only what exists. No dates at all renders nothing rather than
 * a placeholder, the house rule is that unverified content does not ship.
 */
const Range = ({ start, end, current }) => {
  const from = month(start);
  const to = current ? "Present" : month(end);
  // A lone "Present" says nothing the `current` pill has not already said. But a
  // lone end date is meaningful on its own, that is a graduation.
  if (!from && !to) return null;
  if (!from && to === "Present") return null;
  return (
    <span className="font-sans text-[12px] font-medium uppercase tracking-[0.09em] text-faint tabular-nums">
      {[from, to].filter(Boolean).join(": ")}
    </span>
  );
};

/** Renders its children and nothing else. Not `Fragment`: that accepts only
 *  `key` and `children`, so passing it the `label` below logs a React warning. */
const Passthrough = ({ children }) => children;

const Role = ({ role, index, trackIndex = null, stage = null, className = "", style }) => {
  // Is there anything behind the disclosure at all? Education entries have a
  // degree, a school and a date and nothing else, so for them the answer is no
  // and the control must not be drawn.
  const hasDetail =
    role.points?.length > 0 || Boolean(role.summary) || role.stack?.length > 0;
  const Detail = hasDetail ? MobileCollapse : Passthrough;

  return (
  <Reveal
    as="li"
    delay={index * 0.08}
    // Only set for jobs. The margin diagram keys off this, and education
    // renders through this same component: sharing the numbering pointed the
    // diagram at the wrong entry.
    {...(trackIndex === null ? {} : { "data-role-index": trackIndex })}
    className={className}
    style={style}
  >
    {/* An <article>, and the card, so the sticky <li> stays a bare positioning
        box. Putting the padding and the fill on the sticky element itself makes
        its own height the thing that sticks, and a card taller than the
        viewport then never releases. */}
    <article className="role-card rounded-2xl p-5 sm:p-7" data-current={role.current ? "true" : "false"}>
    {/* Title and employer read as one block on the left; the dates sit right,
        right-aligned, so a reader scanning "when" never has to pick the dates
        out of the middle of a sentence. */}
    <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-x-8">
      <div className="min-w-0">
        {/* The stage numeral, the same device Stack uses for its six groups.
            It is what carries order now that the timeline rail is gone: a deck
            of cards has no visible sequence of its own. */}
        {stage !== null && (
          <span aria-hidden="true" className="block font-mono text-label text-faint mb-1.5">
            {String(stage).padStart(2, "0")}
          </span>
        )}
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="font-display font-semibold text-[calc(clamp(1.05rem,1.4vw,1.25rem)*var(--type-scale,1))] leading-tight text-white-100">
            {role.title}
          </h3>
          {role.current && (
            <span className="font-sans text-[12px] font-medium uppercase tracking-[0.09em] text-live border border-live/50 rounded px-1.5 py-0.5">
              current
            </span>
          )}
        </div>
        <p className="mt-1 font-mono text-data text-secondary">
          {role.company}
          {role.location && <span className="text-faint"> · {role.location}</span>}
        </p>
      </div>

      <div className="shrink-0 sm:text-right sm:pt-0.5">
        <Range start={role.start} end={role.end} current={role.current} />
      </div>
    </div>

    <Detail label="What I did">
    {/* Justified from md up, ragged-right below it. Justification needs roughly
        sixty characters to distribute space without showing the seams; at the
        ~40 a phone gives it, the browser stretches word gaps until the lines
        visibly comb, and auto-hyphenation starts breaking "product" into
        "prod-uct" to cope. Every line then ends flush hard against the right
        edge, which reads as text running into the edge rather than as a tidy
        column. The academic audience this was asked for reads on a desktop,
        which is where it still applies. */}
    {/* No measure cap on the list. `max-w-[34rem]` was written when a role was
        a timeline row in a 672px column with no padding of its own; inside a
        padded card it stopped the bullets 71px short of where the date line and
        the tool chips end, so one card had three different right edges and the
        chips read as overhanging the paragraph. The card's own width is the
        measure now, and every row in it shares it. */}
    {role.points?.length > 0 && (
      <ul className="mt-3 list-none space-y-2">
        {role.points.map((point) => (
          <li key={point} className="relative pl-5 font-sans text-secondary text-prose leading-[1.6] md:text-justify md:hyphens-auto">
            {/* A rule, not a bullet glyph: the timeline already owns the round
                marks in this section, and a second kind of dot competes. */}
            <span
              aria-hidden="true"
              className="absolute left-0 top-[0.7em] h-px w-2.5 bg-line-strong"
            />
            {point}
          </li>
        ))}
      </ul>
    )}

    {!role.points?.length && role.summary && (
      <p className="mt-3 font-sans text-secondary text-prose leading-[1.6]">
        {role.summary}
      </p>
    )}

    {role.stack?.length > 0 && (
      <div className="mt-3 flex flex-wrap gap-2">
        {role.stack.map((t) => (
          <TagTerm key={t} name={t} plain />
        ))}
      </div>
    )}
    </Detail>
    </article>
  </Reveal>
  );
};

/**
 * Education uses the same timeline as roles, a degree is a dated entry with an
 * institution, which is structurally identical to a job. It lives inside this
 * section rather than getting its own, so that an empty list leaves no empty
 * section and no nav item pointing at nothing.
 */
const Study = ({ item, index }) => (
  <Role
    index={index}
    role={{
      title: item.degree,
      company: item.school,
      location: item.location,
      start: item.start,
      end: item.end,
      current: item.current,
      summary: item.summary,
      points: item.points,
      stack: item.focus ?? [],
    }}
  />
);

// Derived, never typed: four because `experience` has four entries, 2020
// because that is the earliest `start` in it. A hand-written "4 employers" is a
// number that goes wrong the next time a role is added.
//
// The eyebrow counts EMPLOYERS, not roles, since the heading became "Roles":
// "4 roles · since 2020" over a heading reading Roles is the section saying its
// own name twice and telling the reader nothing new. Employers is a different
// fact — four jobs at four places rather than four titles at two.
const ROLES = experience.filter((e) => e.title);
const FIRST_YEAR = ROLES.map((e) => e.start)
  .filter(Boolean)
  .sort()[0]
  ?.slice(0, 4);
const EMPLOYERS = new Set(ROLES.map((r) => r.company)).size;
const ROLES_META = `${EMPLOYERS} employers${FIRST_YEAR ? ` · since ${FIRST_YEAR}` : ""}`;

/**
 * Does the deck fit?
 *
 * A pinned card taller than the room under the navbar hides its own bottom: it
 * holds the top of the screen while the reader scrolls past, so the cut-off
 * part never comes into view at all. Measured at 1280x620 with the reader's
 * text control at 140%, the tallest role card is 686px against 524px of room
 * and 192px of its bullets were unreachable.
 *
 * Measured, not guessed, and for the stated house reason: the text-size control
 * changes a card's height without changing anything a media query can see. Same
 * rule the hero's code band follows.
 */
const useDeckFits = (listRef) => {
  const [fits, setFits] = useState(true);
  const offset = useRef(96); // last known sticky offset, in px

  useEffect(() => {
    const list = listRef.current;
    if (!list) return undefined;

    const measure = () => {
      const cards = [...list.querySelectorAll("[data-role-index]")];
      if (!cards.length) return;
      // While pinned, the resolved `top` IS the offset, so it cannot drift from
      // `--role-top` in the stylesheet. When unpinned there is nothing to read,
      // and the last value stands.
      const top = parseFloat(getComputedStyle(cards[0]).top);
      if (Number.isFinite(top)) offset.current = top;
      const tallest = Math.max(...cards.map((c) => c.getBoundingClientRect().height));
      const room = window.innerHeight - offset.current - 24;
      // 32px of hysteresis, or a card sitting exactly on the threshold toggles
      // the whole section's layout on every resize tick.
      setFits((was) => (was ? tallest <= room : tallest <= room - 32));
    };

    measure();
    // A ResizeObserver on the list catches the text-size control, a font
    // swapping in, and a wrap changing a card's height — none of which fire a
    // resize event.
    const ro = new ResizeObserver(measure);
    ro.observe(list);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [listRef]);

  return fits;
};

/**
 * Marks a card as covered once the next one has slid over it.
 *
 * WHY THIS IS NEEDED. A sticky deck always slices the card underneath: the
 * incoming card's top edge travels up across the outgoing card's text, so for
 * most of the transition the reader sees half a sentence cut by a horizontal
 * line. Nothing about the geometry can avoid that. What fixes it is making the
 * sliced card visibly NOT the one being read — dimmed and a touch smaller, so
 * the half-line reads as a card behind rather than as broken text.
 *
 * It also answers the second complaint: with three near-identical cards on
 * screen at once, nothing said which one was current. Now only one is at full
 * strength.
 *
 * Four `getBoundingClientRect` calls, coalesced into a frame. The scroll
 * handler itself does nothing but request one — measuring inside the scroll
 * event is what makes this pattern expensive, and the repo already had to fix
 * that once in the hero's canvas.
 */
const useCoveredCards = (listRef) => {
  useEffect(() => {
    const list = listRef.current;
    if (!list) return undefined;

    let queued = false;
    const apply = () => {
      queued = false;
      const cards = [...list.querySelectorAll("[data-role-index]")];
      // READ everything first, then WRITE. Interleaved, this loop wrote
      // `dataset.covered` on one card and then measured the next, which
      // invalidates style and forces a synchronous layout on every iteration:
      // measured at 29.8fps with every frame over 20ms and a 50ms worst case
      // while scrolling through the deck. Batched, the same scroll holds 60.
      const tops = cards.map((c) => c.getBoundingClientRect().top);
      const heights = cards.map((c) => c.offsetHeight);
      cards.forEach((card, i) => {
        // Covered when the next card has climbed more than halfway up this
        // one's face: at that point it is painting over the content, not
        // merely sitting below it.
        const covered = i + 1 < cards.length && tops[i + 1] - tops[i] < heights[i] * 0.55;
        const want = covered ? "true" : "false";
        // Writing the same value still invalidates style in some engines.
        if (card.dataset.covered !== want) card.dataset.covered = want;
      });
    };
    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [listRef]);
};

const Experience = () => {
  const listRef = useRef(null);
  const fits = useDeckFits(listRef);
  useCoveredCards(listRef);

  return (
  <>
    <SectionHead title="Roles" meta={ROLES_META} />

    {/* A motion.div, not a div. Framer propagates variants down the motion
        tree, so a plain wrapper between the section's animated parent and this
        list cuts the chain: the `show` state never arrived and the whole roles
        column rendered at opacity 0. The variant moves up here with it. */}
    <motion.div
      variants={fadeIn("", "", 0.1, 1)}
      className="mt-10 rail:grid rail:grid-cols-[minmax(0,42rem)_minmax(0,1fr)] rail:gap-10 rail:items-start"
    >
      {/* The deck. `z-index` ascends so a later card covers an earlier one, and
          `top` descends 10px per card so the ones already read keep an edge on
          screen. Both are inline because both are per-index: a Tailwind class
          per position would be four classes that must stay in sync with an
          array length. */}
      <ol ref={listRef} className="list-none max-w-2xl">
        {experience.map((role, i) => (
          <Role
            key={`${role.company}-${role.title}`}
            role={role}
            index={i}
            trackIndex={i}
            stage={i + 1}
            // 16px between pinned tops, not 10: at 10 the deck's edges read as
            // one thick border rather than as four cards. pb-9 gives each card
            // room to be read before the next one starts arriving.
            className={`${fits ? "role-sticky" : ""} pb-9 last:pb-0`}
            style={{ top: `calc(var(--role-top) + ${i * 16}px)`, zIndex: 10 + i }}
          />
        ))}
        {/* The stack needs somewhere to end. Without trailing room the last
            card unsticks the instant the list box ends, which lands the reader
            in Education while the last role is still mid-sentence. */}
        {/* Run-out room for the stack, and only when there is a stack: without
            the deck it is 18vh of empty page before Education. */}
        {fits && <li aria-hidden="true" className="hidden sm:block h-[18vh]" />}
      </ol>

      {/* The margin. Sticky, so the diagram stays level with the role being
          read rather than scrolling away from the thing it describes. */}
      <div className="hidden rail:block sticky top-32">
        <CareerTrack glyphs={experience.map((r) => r.glyph)} />
      </div>
    </motion.div>

    {education.length > 0 && (
      <>
        <Reveal className="mt-16">
          <h3 className="font-sans text-[12px] font-medium uppercase tracking-[0.09em] text-accent-ink">
            Education
          </h3>
        </Reveal>
        {/* Education is the same card and deliberately not sticky. Two dated
            entries with no detail behind them do not need the reader pinned to
            them one at a time; they need to be legible and then done. */}
        <ol className="mt-6 list-none max-w-2xl space-y-4">
          {education.map((item, i) => (
            <Study key={`${item.school}-${item.degree}`} item={item} index={i} />
          ))}
        </ol>
      </>
    )}
  </>
  );
};

export default SectionWrapper(Experience, "roles");
