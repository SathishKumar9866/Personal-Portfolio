import { motion } from "framer-motion";
import { status } from "../constants";

/**
 * Owns: the employment-status signal — that he is looking NOW, what for, and
 * how to start the conversation without scrolling further.
 * Does not own: contact routes (Contact.jsx, ContactRail.jsx).
 *
 * Two sizes, one source. `compact` is the hero's one-line version; the full
 * version carries the detail a recruiter actually needs — employer, country and
 * work arrangement — which was previously only on LinkedIn.
 *
 * This is the one block on the page whose job is to convert, so it is the one
 * place that earns sustained motion: a live dot, a slow specular sweep, and rows
 * that arrive in sequence. Everything else on the page stays still, which is
 * what makes this read as emphasis rather than noise.
 *
 * All of it is CSS animation or framer, both already neutralised by the
 * reduced-motion handling — and the card still states every fact with zero
 * movement, because the facts are the point and the motion is only emphasis.
 */
const Dot = () => (
  <span className="relative grid place-items-center shrink-0 w-2.5 h-2.5">
    <span aria-hidden="true" className="status-ping absolute inset-0 rounded-full bg-live" />
    <span className="relative w-2 h-2 rounded-full bg-live" />
  </span>
);

export const AvailabilityCompact = () => (
  <span className="inline-flex items-center gap-2 font-mono text-[12px] text-live">
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

const Line = ({ label, children }) => (
  <>
    <motion.dt variants={row} className="text-faint">
      {label}
    </motion.dt>
    <motion.dd variants={row} className="text-white-100 whitespace-nowrap">
      {children}
    </motion.dd>
  </>
);

const Availability = () => (
  <motion.div
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, amount: "some" }}
    variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
    className="relative overflow-hidden rounded-xl glass-card p-4 sm:p-5"
  >
    <span aria-hidden="true" className="glass-sweep" />

    <motion.p
      variants={row}
      className="relative flex flex-wrap items-center gap-x-2 gap-y-1 font-mono font-bold text-[11px] uppercase tracking-label text-live"
    >
      <Dot />
      Open to work
      <span className="font-normal text-faint normal-case tracking-normal">· available now</span>
    </motion.p>

    <dl className="relative mt-3 grid gap-x-5 gap-y-2 sm:grid-cols-[5.5rem_1fr] font-mono text-[12px]">
      <Line label="Currently">
        {status.role} · {status.company}
      </Line>
      <Line label="Looking for">{status.openTo}</Line>
      <Line label="Where">{status.where}</Line>
    </dl>

    {/* The block announces that he is looking; this is the step that follows
        from it. Without it the card is a statement with no next action. */}
    <motion.a
      variants={row}
      href="#contact"
      className="group relative mt-4 inline-flex items-center gap-2 rounded-lg border border-live/60 px-3 min-h-11 sm:min-h-10 font-mono text-[12px] text-live transition-colors hover:bg-live/10 hover:border-live"
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

export default Availability;
