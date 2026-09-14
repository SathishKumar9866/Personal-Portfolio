import { motion, useReducedMotion } from "framer-motion";
import { contact, experience, projects, stackGroups } from "../constants";

/**
 * Owns: the spec band — the four numbers that describe the work, set at the
 * size a car company sets 0–100 times.
 *
 * WHY THIS EXISTS. Every one of these figures was already on the page, set at
 * 12px in a section eyebrow: "4 roles · since 2020", "6 built · 1 live",
 * "6 areas · 33 tools". They are the most compressed true things the site can
 * say about him, and they were the smallest type on it. A campaign page puts
 * its specs where the eye lands first; this is that move, and it needed no new
 * claim to make it.
 *
 * EVERY NUMBER IS DERIVED. Not one is typed. Add a project to `constants` and
 * this band counts it in the same edit; delete a role and it drops. The house
 * rule is that a hand-written figure is a figure that goes wrong the next time
 * the data moves, and this band would be the most expensive place on the page
 * to be wrong.
 *
 * NO COUNT-UP ANIMATION, deliberately. Numbers ticking from zero is the
 * convention on pages whose numbers are the marketing; here the numbers are
 * evidence, and evidence does not need a drumroll. The reveal is the same
 * stagger every other section uses.
 */

const ROLES = experience.filter((e) => e.title);
const FIRST_YEAR = ROLES.map((e) => e.start).filter(Boolean).sort()[0]?.slice(0, 4);
const LIVE = projects.filter((p) => p.live_link).length;
const TOOLS = new Set(stackGroups.flatMap((g) => g.items)).size;

/** Two digits, because a spec sheet pads: 04, not 4. */
const pad = (n) => String(n).padStart(2, "0");

const SPECS = [
  { value: pad(ROLES.length), label: "roles", note: FIRST_YEAR ? `since ${FIRST_YEAR}` : null },
  // "projects", not "systems built": the section is called Projects and the nav
  // is called Projects, and a third name for the same six things is a third
  // thing for a reader to reconcile.
  { value: pad(projects.length), label: "projects", note: `${LIVE} live` },
  { value: pad(TOOLS), label: "tools", note: `${stackGroups.length} areas` },
  // Not a count, and that is the point of the fourth cell: the three numbers
  // say what exists, and this says how to reach the person who made it.
  { value: "CDT", label: contact.timezone, note: "replies within a day" },
];

const rise = {
  hidden: { y: 22, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.65, ease: [0.22, 0.61, 0.36, 1] } },
};

const SpecBand = () => {
  const reduced = useReducedMotion();
  return (
    <motion.section
      aria-label="At a glance"
      variants={{ show: { transition: { staggerChildren: 0.08 } } }}
      initial={reduced ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, amount: "some" }}
      /* No ground or border here: this is the first scene, and
         `main > section:nth-of-type(odd)` in index.css paints every tinted one.
         Two places setting the same background is how they drift apart. */
      className="spec-band w-full px-[clamp(1.25rem,4.5vw,4rem)] py-[clamp(2.5rem,6vw,5rem)]"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4 md:gap-x-10">
        {SPECS.map((s) => (
          <motion.div key={s.label} variants={rise} className="min-w-0">
            {/* `tabular-nums` so 04 and 33 occupy the same width: a spec row
                where the digits shift between cells reads as four separate
                measurements rather than one sheet. */}
            <div className="spec-value font-display font-bold tabular-nums tracking-[-0.03em] leading-[0.88] text-white-100 text-[calc(clamp(3.25rem,9vw,7rem)*var(--type-scale,1))]">
              {s.value}
            </div>
            <div className="mt-3 font-sans text-[13px] font-medium uppercase tracking-[0.1em] text-secondary">
              {s.label}
            </div>
            {s.note && (
              <div className="mt-1 font-mono text-label text-faint">{s.note}</div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default SpecBand;
