import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { styles } from "../styles";
import { navLinks } from "../constants";
import ThemeToggle from "./ThemeToggle";
import FontSizeToggle from "./FontSizeToggle";
import { ICON_PATHS, socialLinks } from "./icons";
import useActiveSection from "../hooks/useActiveSection";

const prefersReduced = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// The palette accepts Meta OR Ctrl, but the button said "⌘K" on every platform,
// so Windows and Linux visitors were shown a key they do not have.
const isMac = /Mac|iPhone|iPad/.test(
  navigator.userAgentData?.platform || navigator.platform || ""
);
const SHORTCUT = isMac ? "⌘K" : "Ctrl K";

const Navbar = () => {
  const active = useActiveSection();
  const [toggle, setToggle] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const navRef = useRef(null);

  // Hide on the way down, return on the way up. The bar is 77px of a fixed
  // viewport: about 9% of a phone screen, held open the whole time someone is
  // reading a very long page. Four guards, because a naive version of this is
  // worse than not doing it:
  //   1. a movement threshold, so a 2px jitter cannot toggle it
  //   2. never hidden near the top, where there is nothing to reclaim
  //   3. never hidden while the mobile menu is open, that IS the nav
  //   4. never hidden while focus is inside it, which would strand a keyboard
  //      user on a control they cannot see
  useEffect(() => {
    let last = window.scrollY;
    let raf = 0;
    // Guard 5, and the one that matters most in practice: never hide the bar on
    // a phone. Reclaiming 77px is a good trade on a desktop, where the section
    // rail, the contact rail and the command palette all still offer a way
    // around, and where a wheel flick brings the bar straight back. On a phone
    // none of those exist (both rails are gated at 1024px, the palette wants a
    // keyboard) so this bar IS the navigation, and hiding it means the only
    // route to any other section is off screen for as long as the reader is
    // moving down the page. Measured: it took about 120px of deliberate upward
    // scroll plus a 300ms transition to get it back, which is not something a
    // reader should have to discover.
    const canHide = window.matchMedia("(min-width: 768px)");
    const read = () => {
      raf = 0;
      const y = window.scrollY;
      const delta = y - last;
      setScrolled(y > 24);
      if (Math.abs(delta) > 6) {
        const focusInside = navRef.current?.contains(document.activeElement);
        setHidden(canHide.matches && delta > 0 && y > 160 && !focusInside);
        last = y;
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Guard 3: an open menu always shows its own bar.
  useEffect(() => {
    if (toggle) setHidden(false);
  }, [toggle]);

  // The menu is a modal dialog, so it behaves like one: Escape closes it, the
  // page behind it does not scroll, and focus returns to the control that
  // opened it rather than to the top of the document.
  useEffect(() => {
    if (!toggle) return;
    const opener = document.activeElement;
    const onKey = (e) => e.key === "Escape" && setToggle(false);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      if (opener instanceof HTMLElement) opener.focus();
    };
  }, [toggle]);

  return (
    <nav
      ref={navRef}
      // Focus anywhere inside brings it straight back, so tabbing never lands on
      // a control that is off-screen.
      onFocusCapture={() => setHidden(false)}
      className={`${styles.paddingX} w-full flex items-center py-4 fixed top-0 z-40 transition-[transform,background-color,border-color] duration-300 ${
        hidden ? "-translate-y-full" : "translate-y-0"
      } ${scrolled ? "glass border-b border-line/60" : "bg-transparent"}`}
    >
      <div className="w-full flex justify-between items-center max-w-7xl mx-auto">
        <a
          href="#"
          className="flex items-center gap-3 min-h-11"
          onClick={(e) => {
            // Without preventDefault the browser also navigates to "#", which
            // pushes a history entry and can jump-cut the smooth scroll.
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: prefersReduced() ? "auto" : "smooth" });
          }}
        >
          <span className="w-8 h-8 rounded-md bg-accent flex items-center justify-center text-black-100 font-display font-bold text-[15px]">
            S
          </span>
          <p className="text-white-100 font-mono text-data tracking-tight flex items-center">
            Sathish
            <span className="md:inline hidden text-faint">&nbsp;· AI Engineer</span>
          </p>
        </a>

        <div className="hidden md:flex items-center gap-8">
          <ul className="list-none flex flex-row gap-9">
            {navLinks.map((n) => (
              <li key={n.id}>
                <a
                  href={`#${n.id}`}
                  className={`relative font-mono text-nav uppercase tracking-[0.12em] transition-colors ${
                    active === n.id ? "text-accent-ink" : "text-secondary hover:text-white-100"
                  }`}
                >
                  {n.title}
                  <span
                    className={`absolute -bottom-1.5 left-0 h-px bg-accent transition-all duration-300 ${
                      active === n.id ? "w-full" : "w-0"
                    }`}
                  />
                </a>
              </li>
            ))}
          </ul>
          <button
            onClick={() => window.dispatchEvent(new Event("open-command"))}
            className="font-mono text-label text-faint border border-line-strong rounded px-2 py-1 hover:border-accent hover:text-accent transition-colors"
            aria-label={`${SHORTCUT}: open command palette`}
          >
            {SHORTCUT}
          </button>
          <FontSizeToggle />
          <ThemeToggle />
        </div>

        <div className="md:hidden flex flex-1 justify-end items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setToggle(!toggle)}
            className="relative z-50 text-white-100 text-[22px] leading-none w-11 h-11 grid place-items-center"
            aria-label={toggle ? "Close menu" : "Open menu"}
            aria-expanded={toggle}
            aria-controls="mobile-menu"
          >
            {toggle ? "✕" : "☰"}
          </button>
        </div>

        {createPortal(
          <AnimatePresence>
            {toggle && (
              <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              id="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              className="fixed inset-0 z-50 md:hidden bg-primary backdrop-blur-md flex flex-col justify-center px-8 py-24 overflow-y-auto"
            >
              <button
                onClick={() => setToggle(false)}
                aria-label="Close menu"
                className="absolute top-5 right-5 w-11 h-11 grid place-items-center rounded-md border border-line-strong text-white-100 hover:border-accent hover:text-accent transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>

              <ul className="list-none flex flex-col gap-6">
                {navLinks.map((n, idx) => (
                  <motion.li
                    key={n.id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + idx * 0.06 }}
                  >
                    <a
                      href={`#${n.id}`}
                      className={`font-display text-[clamp(1.75rem,9vw,2.35rem)] leading-none flex items-center min-h-11 ${
                        active === n.id ? "text-accent-ink" : "text-white-100"
                      }`}
                      onClick={() => {
                        setToggle(false);
                      }}
                    >
                      {n.title}
                    </a>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-10 pt-8 border-t border-line">
                <p className="font-mono text-label uppercase tracking-label text-faint">
                  Reach me
                </p>
                <ul className="mt-4 flex flex-wrap gap-3 list-none">
                  {socialLinks().map((l) => (
                    <li key={l.k}>
                      <a
                        href={l.href}
                        // Every one of these leaves the site, so every one opens
                        // in a new tab: a recruiter who taps GitHub should still
                        // have the CV behind them when they come back.
                        target={l.k === "email" ? undefined : "_blank"}
                        rel="noreferrer"
                        onClick={() => setToggle(false)}
                        className="inline-flex items-center gap-2 rounded-lg border border-line-strong px-4 min-h-11 font-mono text-chip text-secondary hover:border-accent hover:text-accent-ink transition-colors"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                          <path d={ICON_PATHS[l.k]} />
                        </svg>
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 flex items-center gap-3">
                <FontSizeToggle />
                <button
                  onClick={() => {
                    setToggle(false);
                    window.dispatchEvent(new Event("open-command"));
                  }}
                  className="font-mono text-nav text-faint border border-line-strong rounded px-3 min-h-11 flex items-center"
                >
                  {SHORTCUT} · quick actions
                </button>
              </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
      </div>
    </nav>
  );
};

export default Navbar;
