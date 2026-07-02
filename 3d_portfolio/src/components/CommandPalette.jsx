import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { contact } from "../constants";

const go = (id) => () => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
const open = (url) => () => window.open(url, "_blank", "noreferrer");

const ACTIONS = [
  { label: "Go to About", hint: "section", run: go("about") },
  { label: "Go to Work", hint: "section", run: go("work") },
  { label: "Go to Contact", hint: "section", run: go("contact") },
  { label: "Copy email", hint: contact.email, run: () => navigator.clipboard?.writeText(contact.email) },
  { label: "Open GitHub", hint: "SathishKumarAI", run: open("https://github.com/SathishKumarAI") },
  { label: "Open LinkedIn", hint: "in/SathishKumarAI", run: open("https://www.linkedin.com/in/SathishKumarAI") },
];

const CommandPalette = () => {
  const [openState, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [i, setI] = useState(0);
  const inputRef = useRef(null);

  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    return t ? ACTIONS.filter((a) => (a.label + a.hint).toLowerCase().includes(t)) : ACTIONS;
  }, [q]);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    const openEvt = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-command", openEvt);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-command", openEvt);
    };
  }, []);

  useEffect(() => {
    if (openState) {
      setQ("");
      setI(0);
      setTimeout(() => inputRef.current?.focus(), 20);
    }
  }, [openState]);

  const run = (idx) => {
    const a = results[idx];
    if (!a) return;
    setOpen(false);
    a.run();
  };

  const onInputKey = (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setI((n) => Math.min(n + 1, results.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setI((n) => Math.max(n - 1, 0)); }
    else if (e.key === "Enter") { e.preventDefault(); run(i); }
  };

  return (
    <AnimatePresence>
      {openState && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-start justify-center pt-[18vh] px-4 bg-black-200/70 backdrop-blur-sm"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
        >
          <motion.div
            initial={{ y: -12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -12, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-xl border border-line bg-tertiary shadow-card overflow-hidden"
          >
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => { setQ(e.target.value); setI(0); }}
              onKeyDown={onInputKey}
              placeholder="Type a command…"
              className="w-full bg-transparent border-b border-line px-4 py-3.5 font-mono text-[14px] text-white-100 placeholder:text-faint focus:outline-none"
            />
            <ul className="max-h-72 overflow-y-auto py-2">
              {results.length === 0 && (
                <li className="px-4 py-3 font-mono text-[13px] text-faint">No matches</li>
              )}
              {results.map((a, idx) => (
                <li key={a.label}>
                  <button
                    onMouseEnter={() => setI(idx)}
                    onClick={() => run(idx)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-left font-mono text-[13px] ${
                      i === idx ? "bg-accent/15 text-accent" : "text-white-100"
                    }`}
                  >
                    <span>{a.label}</span>
                    <span className="text-[11px] text-faint">{a.hint}</span>
                  </button>
                </li>
              ))}
            </ul>
            <div className="border-t border-line px-4 py-2 font-mono text-[10px] text-faint flex gap-4">
              <span>↑↓ move</span><span>↵ select</span><span>esc close</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
