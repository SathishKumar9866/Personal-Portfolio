import { useEffect, useRef, useState } from "react";
import { glossary } from "../constants";

/**
 * Owns: one technology chip, and the plain-English definition behind it.
 *
 * Two chips, two jobs:
 *  - In Stack the chip TEACHES, so the definition opens on hover as well as on
 *    click. A reader scanning tools should not have to guess that a chip is
 *    clickable to find out what it means.
 *  - On project and experience cards (`plain`) the chip STATES. There the
 *    expanded name is a native tooltip, so a definition panel never opens inside
 *    a tilting card or competes with the card's own links.
 *
 * Whether a definition exists is signalled by a dotted underline on the word —
 * the long-standing convention — not a dashed box and a "?" on every chip.
 */
const CHIP =
  "font-mono text-[11px] px-2 rounded border transition-colors " +
  // Touch first: 44x44 minimum on phones, back to the dense rhythm from sm up.
  "inline-flex items-center justify-center min-h-11 min-w-11 py-0 " +
  "sm:min-h-0 sm:min-w-0 sm:py-0.5 sm:inline";

const TagTerm = ({ name, plain = false }) => {
  const entry = glossary[name];
  const g = plain ? null : entry;
  const [open, setOpen] = useState(false);
  const [pinned, setPinned] = useState(false);
  const ref = useRef(null);
  const closeTimer = useRef(null);

  useEffect(() => {
    if (!open) return;
    const close = () => {
      setOpen(false);
      setPinned(false);
    };
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) close();
    };
    const onKey = (e) => e.key === "Escape" && close();
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  // Plain chip: states a fact. The expanded name — "Retrieval-Augmented
  // Generation" behind "RAG" — is still available, on hover, without opening
  // anything that could cover the card.
  if (!g) {
    const hint = entry?.full ?? entry?.def ?? undefined;
    return (
      <span className={`${CHIP} border-line text-secondary`} title={hint}>
        {name}
      </span>
    );
  }

  const show = () => {
    clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const hide = () => {
    if (pinned) return;
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };

  return (
    <span
      ref={ref}
      className="relative inline-block"
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      <button
        onClick={() => {
          setPinned((p) => !p);
          setOpen(true);
        }}
        onFocus={show}
        onBlur={hide}
        aria-expanded={open}
        aria-label={`${name} — what is this?`}
        className={`${CHIP} ${
          open
            ? "border-accent text-accent-ink"
            : "border-line-strong text-secondary hover:border-accent hover:text-accent-ink"
        }`}
      >
        <span className="border-b border-dotted border-current pb-px">{name}</span>
      </button>

      {open && (
        <span
          role="tooltip"
          className="absolute z-30 left-1/2 -translate-x-1/2 top-full mt-1.5 w-[min(17rem,calc(100vw-2rem))] rounded-lg border border-line bg-primary shadow-card p-3 font-sans text-[12.5px] text-secondary leading-snug block text-left normal-case tracking-normal"
        >
          <b className="text-white-100">{name}</b>
          {g.full && g.full !== name && (
            <span className="block font-mono text-[11px] text-faint mt-0.5">
              {g.full}
            </span>
          )}
          <span className="block mt-1.5">{g.def}</span>
          {g.link && (
            <a
              href={g.link}
              target="_blank"
              rel="noreferrer"
              onClick={() => {
                setOpen(false);
                setPinned(false);
              }}
              className="mt-2 block font-mono text-[11px] text-accent-ink hover:underline"
            >
              Learn more ↗
            </a>
          )}
        </span>
      )}
    </span>
  );
};

export default TagTerm;
