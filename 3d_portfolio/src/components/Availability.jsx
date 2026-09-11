import { status } from "../constants";

/**
 * Owns: the employment-status signal — where he is now, and what he is open to.
 * Does not own: contact routes (Contact.jsx, ContactRail.jsx).
 *
 * Two sizes, one source. `compact` is the hero's one-line version; the full
 * version carries the detail a recruiter actually needs — country and work
 * arrangement — which was previously only on LinkedIn.
 *
 * The ping is a CSS animation, so the reduced-motion block in index.css already
 * stops it. The dot itself never animates away: the signal survives with zero
 * motion, because it is information, not decoration.
 */
const Dot = () => (
  <span className="relative grid place-items-center shrink-0 w-2.5 h-2.5">
    <span
      aria-hidden="true"
      className="status-ping absolute inset-0 rounded-full bg-live"
    />
    <span className="relative w-2 h-2 rounded-full bg-live" />
  </span>
);

export const AvailabilityCompact = () => (
  <span className="inline-flex items-center gap-2 font-mono text-[12px] text-live">
    <Dot />
    Open to {status.openTo}
  </span>
);

const Availability = () => (
  <div className="rounded-xl border border-line bg-tertiary p-4 sm:p-5">
    <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-label text-live">
      <Dot />
      Open to work
    </p>

    <dl className="mt-3 grid gap-x-4 gap-y-2 sm:grid-cols-[7rem_1fr] font-mono text-[12px]">
      <dt className="text-faint">Currently</dt>
      <dd className="text-white-100">
        {status.role} · {status.company}
      </dd>

      <dt className="text-faint">Looking for</dt>
      <dd className="text-white-100">{status.openTo}</dd>

      <dt className="text-faint">Where</dt>
      <dd className="text-white-100">{status.where}</dd>
    </dl>
  </div>
);

export default Availability;
