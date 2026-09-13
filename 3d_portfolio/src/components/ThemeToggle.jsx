import { useEffect, useRef, useState } from "react";
import { themes, themeById } from "../constants";

/**
 * Owns, the reading theme: which palette is applied, and the only control that
 * changes it.
 * Does not own: the palettes themselves (`index.css`) or the list of them
 * (`constants/index.js`, `themes`).
 *
 * ## Why this is a menu and not a switch
 *
 * It was a two-state toggle, sun and moon, because there were two palettes.
 * There are five now, and a toggle that cycles five things is a control that
 * tells you nothing about where you are or how many presses are left. A menu
 * shows every option with its name and a line about who it suits, which is the
 * only reason a reader would pick one over another.
 *
 * ## Two axes, not one
 *
 * `data-theme` is the palette. `data-scheme` is light-or-dark, and every
 * structural rule keys off it — the glass shadows, the bloom, the grain — so a
 * new palette declares its scheme once and inherits all of that. Before this,
 * those rules read `:not([data-theme="dark"])`, which is a sentence that stops
 * being true the moment a third palette lands.
 *
 * ## Still the single owner
 *
 * The command palette dispatches `set-theme` with an id rather than writing the
 * DOM, for the same reason it always asked for a toggle: two writers of one
 * attribute is how the button ends up announcing the wrong mode. It still
 * answers `toggle-theme` too, which now means "flip to the other scheme".
 */
/**
 * The palette's own ground and accent, so a reader picks by looking rather than
 * by reading a name they have no referent for.
 *
 * Painted from `theme.bar` and `theme.accent` rather than by setting
 * `data-theme` on this element: the palettes are `:root[data-theme=...]` rules,
 * so a nested element carrying the attribute matches nothing and every swatch
 * came out the colour of the current theme.
 *
 * `block`, because a bare `<span>` is inline and an inline box ignores width —
 * these rendered 2px wide with the height coming from the line box alone.
 */
const Swatch = ({ theme }) => (
  <span
    aria-hidden="true"
    style={{ background: theme.bar }}
    className="relative block h-5 w-5 shrink-0 overflow-hidden rounded-full border border-line-strong"
  >
    <span
      style={{ background: theme.accent }}
      className="absolute inset-x-0 bottom-0 block h-1/2"
    />
  </span>
);

const Check = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const Palette = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="7.5" r="1.4" fill="currentColor" stroke="none" />
    <circle cx="8" cy="13" r="1.4" fill="currentColor" stroke="none" />
    <circle cx="16" cy="13" r="1.4" fill="currentColor" stroke="none" />
  </svg>
);

const ThemeToggle = () => {
  const [theme, setTheme] = useState(
    () => document.documentElement.getAttribute("data-theme") || "light"
  );
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Skips the first run: on mount the attributes already match what the boot
  // script wrote, so there is nothing to fade between, and fading on load would
  // mean every reader watches the page assemble its own colours.
  const mounted = useRef(false);

  useEffect(() => {
    const t = themeById(theme);
    const root = document.documentElement;

    let done;
    if (mounted.current) {
      // See `.theme-switching` in index.css: the transition is switched on for
      // the length of the change and off again straight after.
      root.classList.add("theme-switching");
      done = setTimeout(() => root.classList.remove("theme-switching"), 260);
    }
    mounted.current = true;

    root.setAttribute("data-theme", t.id);
    // The scheme is what every structural rule reads. Setting it here rather
    // than in the CSS means a palette declares it once, in one place.
    root.setAttribute("data-scheme", t.scheme);
    // Keep mobile browser chrome in step with the page ground, or the phone
    // draws a seam across the top.
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", t.bar);
    try {
      localStorage.setItem("theme", t.id);
    } catch {
      /* ignore */
    }
    return () => clearTimeout(done);
  }, [theme]);

  useEffect(() => {
    const onSet = (e) => {
      const id = e.detail;
      if (themes.some((t) => t.id === id)) setTheme(id);
    };
    // Kept for the palette's existing "toggle theme" action and for anything
    // that only wants the other scheme: flip to the default of whichever scheme
    // this one is not.
    const onToggle = () =>
      setTheme((cur) =>
        themeById(cur).scheme === "dark" ? "light" : "dark"
      );
    window.addEventListener("set-theme", onSet);
    window.addEventListener("toggle-theme", onToggle);
    return () => {
      window.removeEventListener("set-theme", onSet);
      window.removeEventListener("toggle-theme", onToggle);
    };
  }, []);

  // A menu closes on Escape and on a click outside it, like every other menu.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDoc);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDoc);
    };
  }, [open]);

  const current = themeById(theme);

  return (
    <span ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Theme: ${current.label}. Choose another`}
        title={`Theme: ${current.label}`}
        className="w-11 h-11 sm:w-9 sm:h-9 grid place-items-center rounded-xl border border-line-strong text-white-100 hover:border-accent hover:text-accent transition-colors"
      >
        <Palette />
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Reading theme"
          className="absolute right-0 top-full z-50 mt-2 w-[17rem] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[18px] glass-card p-1.5"
        >
          {themes.map((t) => {
            const on = t.id === theme;
            return (
              <button
                key={t.id}
                role="menuitemradio"
                aria-checked={on}
                onClick={() => {
                  setTheme(t.id);
                  setOpen(false);
                }}
                className={`flex w-full items-start gap-3 rounded-xl px-2.5 py-2 text-left transition-colors ${
                  on ? "bg-surface" : "hover:bg-surface/70"
                }`}
              >
                {/* shrink-0 on the WRAPPER, not only on the swatch: the
                    wrapper is the flex child, and without it the swatch
                    collapsed to a 2px sliver. */}
                <span className="mt-0.5 shrink-0">
                  <Swatch theme={t} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5 font-sans text-[14px] font-medium text-white-100">
                    {t.label}
                    {on && (
                      <span className="text-accent-ink">
                        <Check />
                      </span>
                    )}
                  </span>
                  <span className="mt-0.5 block font-sans text-[12px] leading-[1.45] text-faint">
                    {t.note}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      )}
    </span>
  );
};

export default ThemeToggle;
