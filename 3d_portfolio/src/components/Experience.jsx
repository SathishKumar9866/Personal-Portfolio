import { motion } from "framer-motion";
import { styles } from "../styles";
import { experience } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";
import { SectionWrapper } from "../hoc";
import Reveal from "./Reveal";
import TagTerm from "./TagTerm";

/** "2024-03" -> "Mar 2024". Returns null for null, so callers can omit cleanly. */
const month = (iso) => {
  if (!iso) return null;
  const [y, m] = iso.split("-");
  const d = new Date(Number(y), Number(m) - 1, 1);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
};

/**
 * A range renders only what exists. No dates at all renders nothing rather than
 * a placeholder — the house rule is that unverified content does not ship.
 */
const Range = ({ start, end, current }) => {
  const from = month(start);
  const to = current ? "Present" : month(end);
  // A lone "Present" with no start date says nothing the `current` pill has not
  // already said, so the range renders only once there is a start to anchor it.
  if (!from) return null;
  return (
    <span className="font-mono text-[11px] uppercase tracking-label text-faint tabular-nums">
      {[from, to].filter(Boolean).join(" — ")}
    </span>
  );
};

const Role = ({ role, index }) => (
  <Reveal
    as="li"
    delay={index * 0.08}
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

    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
      <h3 className="font-display font-semibold text-[clamp(1.05rem,1.4vw,1.25rem)] leading-tight text-white-100">
        {role.title}
      </h3>
      {role.current && (
        <span className="font-mono text-[10px] uppercase tracking-label text-live border border-live/50 rounded px-1.5 py-0.5">
          current
        </span>
      )}
    </div>

    <p className="mt-1 font-mono text-[12px] text-secondary">
      {role.company}
      {role.location && <span className="text-faint"> · {role.location}</span>}
    </p>

    <div className="mt-1">
      <Range start={role.start} end={role.end} current={role.current} />
    </div>

    {role.summary && (
      <p className="mt-3 font-sans text-secondary text-[14px] leading-[1.6] max-w-[32rem]">
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
  </Reveal>
);

const Experience = () => (
  <>
    <motion.div variants={textVariant()}>
      <p className={styles.sectionSubText}>Where I&apos;ve worked</p>
      <h2 className={styles.sectionHeadText}>Experience.</h2>
    </motion.div>

    <motion.ol
      variants={fadeIn("", "", 0.1, 1)}
      className="mt-10 list-none max-w-2xl"
    >
      {experience.map((role, i) => (
        <Role key={`${role.company}-${role.title}`} role={role} index={i} />
      ))}
    </motion.ol>
  </>
);

export default SectionWrapper(Experience, "experience");
