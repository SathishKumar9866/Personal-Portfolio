import { useEffect, useRef, useState } from "react";
import { glossary } from "../constants";

// a tech tag; if it has a plain-English definition, tapping reveals it + a link
const TagTerm = ({ name }) => {
  const g = glossary[name];
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, [open]);

  if (!g) {
    return (
      <span className="font-mono text-[11px] text-secondary px-2 py-0.5 rounded border border-line">
        {name}
      </span>
    );
  }
  const learnMore = g.link || `https://www.google.com/search?q=${encodeURIComponent(name)}`;
  return (
    <span ref={ref} className="relative inline-block">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={`font-mono text-[11px] px-2 py-0.5 rounded border border-dashed transition-colors ${
          open ? "border-accent text-accent" : "border-line text-secondary hover:border-accent hover:text-accent"
        }`}
      >
        {name}
        <span className="text-faint"> ?</span>
      </button>
      {open && (
        <span className="absolute z-30 left-0 top-full mt-1.5 w-60 rounded-lg border border-line bg-primary shadow-card p-3 font-sans text-[12.5px] text-secondary leading-snug block">
          <b className="text-white-100">{name}</b> — {g.def}
          <a
            href={learnMore}
            target="_blank"
            rel="noreferrer"
            onClick={() => setOpen(false)}
            className="mt-2 block font-mono text-[11px] text-accent hover:underline"
          >
            Learn more ↗
          </a>
        </span>
      )}
    </span>
  );
};

export default TagTerm;
