import { useEffect, useRef, useState } from "react";
import { glossary } from "../constants";

/**
 * Owns: one technology chip, and the plain-English definition behind it.
 *
 * One chip shape for every term. Whether a definition exists is signalled by a
 * dotted underline on the word itself — the long-standing convention for "there
 * is more behind this" — not by a dashed box and a "?" on every chip. Thirty
 * three chips each carrying its own question mark stopped reading as an
 * affordance and started reading as texture.
 */
const CHIP =
  "font-mono text-[11px] px-2 py-0.5 rounded border transition-colors";

const TagTerm = ({ name, plain = false }) => {
  const g = plain ? null : glossary[name];
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // No definition, or deliberately plain: a chip that does not invite a click it
  // cannot answer.
  if (!g) {
    return <span className={`${CHIP} border-line text-secondary`}>{name}</span>;
  }

  return (
    <span ref={ref} className="relative inline-block">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        // Accessible name leads with the visible text, so voice control can
        // address the chip by what it says (WCAG 2.5.3).
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
        <span className="absolute z-30 left-1/2 -translate-x-1/2 top-full mt-1.5 w-[min(15rem,calc(100vw-2rem))] rounded-lg border border-line bg-primary shadow-card p-3 font-sans text-[12.5px] text-secondary leading-snug block">
          <b className="text-white-100">{name}</b> — {g.def}
          {g.link && (
            <a
              href={g.link}
              target="_blank"
              rel="noreferrer"
              onClick={() => setOpen(false)}
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
