import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { contact, navLinks, themes } from "../constants";
import { ask } from "../utils/answer";
import { readable, socialLinks } from "./icons";

// An explicit `behavior: "smooth"` beats the CSS reduced-motion reset, and these
// are the longest scrolls on the site.
const smooth = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
// `section-jump` tells Navbar this scroll is a jump and not a reading gesture,
// so the bar does not hide itself on the way down. An `<a href="#id">` says the
// same thing by changing the hash; this does not, so it says it out loud.
const go = (id) => () => {
  const el = document.getElementById(id);
  if (!el) return;
  window.dispatchEvent(new Event("section-jump"));
  el.scrollIntoView({ behavior: smooth() });
};
const open = (url) => () => window.open(url, "_blank", "noreferrer");

// The palette does NOT own the theme. ThemeToggle does; writing data-theme here
// too left its useState stale, so the button then needed two clicks and
// announced the wrong mode to a screen reader in between.
// The palette asks for a theme by id; ThemeToggle stays the only writer of the
// attribute. Writing `data-theme` here directly left its useState stale, which
// is how the button came to need two clicks and to announce the wrong mode.
const setTheme = (id) => () =>
  window.dispatchEvent(new CustomEvent("set-theme", { detail: id }));

const copyEmail = async () => {
  try {
    await navigator.clipboard.writeText(contact.email);
  } catch {
    window.location.href = `mailto:${contact.email}`;
  }
};

// Built from the same sources the nav and the icon rows read, so a changed
// handle or a new profile cannot leave the palette pointing somewhere stale.
const ACTIONS = [
  ...navLinks.map((n) => ({ label: `Go to ${n.title}`, hint: "section", run: go(n.id) })),
  // One entry per theme rather than one toggle: with five palettes a toggle
  // cannot say which one it is about to give you, and the palette is exactly
  // where someone who knows what they want goes to ask for it by name.
  ...themes.map((t) => ({ label: `Theme: ${t.label}`, hint: t.scheme, run: setTheme(t.id) })),
  { label: "Copy email", hint: contact.email, run: copyEmail },
  ...socialLinks()
    .filter((l) => l.k !== "email")
    .map((l) => ({ label: `Open ${l.label}`, hint: readable(l.href), run: open(l.href) })),
];

// Typed text is a question if it is long enough to be one. Below three
// characters almost every passage matches, and the answers would reshuffle
// under the typist on every keystroke.
const ASK_MIN = 3;

const CommandPalette = () => {
  const [openState, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [i, setI] = useState(0);
  const inputRef = useRef(null);
  const panelRef = useRef(null);

  // Answers first, commands under them: someone who types a whole question
  // wants the answer, and someone who types "theme" gets a command at the top
  // anyway because a two-word query retrieves nothing.
  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    const commands = (t ? ACTIONS.filter((a) => (a.label + a.hint).toLowerCase().includes(t)) : ACTIONS)
      .map((a) => ({ ...a, kind: "command" }));
    const answers =
      t.length >= ASK_MIN
        ? ask(q).map((a) => ({
            kind: "answer",
            label: a.title,
            hint: a.section,
            passage: a.passage,
            run: go(a.section),
          }))
        : [];
    return [...answers, ...commands];
  }, [q]);

  const firstCommand = results.findIndex((r) => r.kind === "command");
  const hasAnswers = results[0]?.kind === "answer";

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

  const returnFocusRef = useRef(null);

  useEffect(() => {
    if (!openState) return;
    // Remember where focus came from so Escape returns it, instead of dumping
    // focus on <body> and restarting Tab from the top of the document.
    returnFocusRef.current = document.activeElement;
    setQ("");
    setI(0);
    const t = setTimeout(() => inputRef.current?.focus(), 20);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden"; // page scrolled behind the dialog
    return () => {
      clearTimeout(t);
      document.body.style.overflow = prevOverflow;
      returnFocusRef.current?.focus?.();
    };
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

  // Without this, Tab leaves the dialog and lands on nav links that are still
  // focusable and clickable underneath the overlay.
  const onPanelKey = (e) => {
    if (e.key !== "Tab") return;
    const focusables = panelRef.current?.querySelectorAll("input, button");
    if (!focusables?.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
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
            ref={panelRef}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={onPanelKey}
            className="w-full max-w-lg rounded-2xl glass overflow-hidden"
          >
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => { setQ(e.target.value); setI(0); }}
              onKeyDown={onInputKey}
              role="combobox"
              aria-expanded="true"
              aria-controls="cmdk-list"
              aria-activedescendant={results[i] ? `cmdk-opt-${i}` : undefined}
              aria-label="Search commands"
              placeholder="Ask about the work, or type a command…"
              className="w-full bg-transparent border-b border-line-strong px-4 py-3.5 font-mono text-data text-white-100 placeholder:text-faint focus:outline-none"
            />
            <ul id="cmdk-list" role="listbox" aria-label="Commands" className="max-h-[min(60vh,26rem)] overflow-y-auto py-2">
              {results.length === 0 && (
                <li role="option" aria-selected="false" className="px-4 py-3 font-mono text-chip text-faint">
                  Nothing on this page says that. {contact.email} is the way to ask a person.
                </li>
              )}
              {results.map((a, idx) => (
                <Fragment key={a.kind + a.label}>
                  {/* Two lists in one, and the reader has to know which is which:
                      the first block is quoted from the page, the second acts on it. */}
                  {hasAnswers && (idx === 0 || idx === firstCommand) && (
                    <li role="presentation" className="px-4 pt-3 pb-1.5 font-mono text-label text-faint">
                      {idx === 0 ? "From this page, quoted" : "Commands"}
                    </li>
                  )}
                <li role="option" id={`cmdk-opt-${idx}`} aria-selected={i === idx}>
                  <button
                    tabIndex={-1}
                    onMouseEnter={() => setI(idx)}
                    onClick={() => run(idx)}
                    className={`w-full text-left px-4 py-2.5 border-l-2 ${
                      a.kind === "answer" ? "" : "flex items-center justify-between gap-3 font-mono text-data"
                    } ${
                      i === idx
                        ? "border-accent bg-accent/15 text-white-100"
                        : "border-transparent text-white-100"
                    }`}
                  >
                    {/* Selection is carried by the left rule as well as the tint:
                        a 15%-alpha wash is not a sufficient cue on its own. */}
                    {a.kind === "answer" ? (
                      <>
                        {/* The passage is the answer; the line under it is the
                            citation, and it is what makes the passage checkable. */}
                        <span className="block text-body text-white-100">{a.passage}</span>
                        <span className="mt-1 block font-mono text-label text-faint">
                          {/* No "↵ to jump" here: the footer already says what
                              Enter does, and a phone has no Enter to offer. */}
                          {a.label} · {a.hint}
                        </span>
                      </>
                    ) : (
                      <>
                        <span>{a.label}</span>
                        <span className="text-label text-faint">{a.hint}</span>
                      </>
                    )}
                  </button>
                </li>
                </Fragment>
              ))}
            </ul>
            <div className="border-t border-line px-4 py-2 font-mono text-label text-faint flex gap-4">
              <span>↑↓ move</span><span>↵ select</span><span>esc close</span>
              <span className="ml-auto hidden sm:inline">answers are quoted, never generated</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
