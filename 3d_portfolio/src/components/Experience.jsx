import { motion } from "framer-motion";
import { styles } from "../styles";
import { experience, education } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";
import { SectionWrapper } from "../hoc";
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
    <span className="font-mono text-label uppercase tracking-label text-faint tabular-nums">
      {[from, to].filter(Boolean).join(": ")}
    </span>
  );
};

/** Renders its children and nothing else. Not `Fragment`: that accepts only
 *  `key` and `children`, so passing it the `label` below logs a React warning. */
const Passthrough = ({ children }) => children;

const Role = ({ role, index, trackIndex = null }) => {
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
    className="relative pl-8 sm:pl-10 pb-10 last:pb-0"
  >
    {/* the rail, and this role's marker on it */}
    <span
      aria-hidden="true"
      className="absolute left-[5px] top-2 bottom-0 w-px bg-line"
    />
    <span
      aria-hidden="true"
      className={`absolute left-0 top-1.5 h-[11px] w-[11px] rounded-full border-2 ${
        role.current
          ? "border-accent bg-accent"
          : "border-line-strong bg-primary"
      }`}
    />

    {/* Title and employer read as one block on the left; the dates sit right,
        right-aligned, so a reader scanning "when" never has to pick the dates
        out of the middle of a sentence. */}
    <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-x-8">
      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="font-display font-semibold text-[calc(clamp(1.05rem,1.4vw,1.25rem)*var(--type-scale,1))] leading-tight text-white-100">
            {role.title}
          </h3>
          {role.current && (
            <span className="font-mono text-label uppercase tracking-label text-live border border-live/50 rounded px-1.5 py-0.5">
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
    {role.points?.length > 0 && (
      <ul className="mt-3 list-none max-w-[34rem] space-y-2">
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
      <p className="mt-3 font-sans text-secondary text-prose leading-[1.6] max-w-[34rem]">
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

const Experience = () => (
  <>
    <motion.div variants={textVariant()}>
      <p className={styles.sectionSubText}>Where I&apos;ve worked</p>
      <h2 className={styles.sectionHeadText}>Experience.</h2>
    </motion.div>

    {/* A motion.div, not a div. Framer propagates variants down the motion
        tree, so a plain wrapper between the section's animated parent and this
        list cuts the chain: the `show` state never arrived and the whole roles
        column rendered at opacity 0. The variant moves up here with it. */}
    <motion.div
      variants={fadeIn("", "", 0.1, 1)}
      className="mt-10 rail:grid rail:grid-cols-[minmax(0,42rem)_minmax(0,1fr)] rail:gap-10 rail:items-start"
    >
      <ol className="list-none max-w-2xl">
        {experience.map((role, i) => (
          <Role key={`${role.company}-${role.title}`} role={role} index={i} trackIndex={i} />
        ))}
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
          <h3 className="font-mono text-label uppercase tracking-label text-accent-ink">
            Education
          </h3>
        </Reveal>
        <ol className="mt-6 list-none max-w-2xl">
          {education.map((item, i) => (
            <Study key={`${item.school}-${item.degree}`} item={item} index={i} />
          ))}
        </ol>
      </>
    )}
  </>
);

export default SectionWrapper(Experience, "experience");
