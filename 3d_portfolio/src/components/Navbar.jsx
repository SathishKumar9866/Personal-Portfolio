import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { styles } from "../styles";
import { navLinks } from "../constants";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const [active, setActive] = useState("");
  const [toggle, setToggle] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // scroll-spy: highlight the section currently in view
  useEffect(() => {
    const ids = navLinks.map((n) => n.id);
    const els = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    els.forEach((el) => io.observe(el));
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <nav
      className={`${styles.paddingX} w-full flex items-center py-4 fixed top-0 z-40 transition-colors duration-300 ${
        scrolled ? "bg-primary/85 backdrop-blur-md border-b border-line" : "bg-transparent"
      }`}
    >
      <div className="w-full flex justify-between items-center max-w-7xl mx-auto">
        <a
          href="#"
          className="flex items-center gap-3"
          onClick={() => {
            setActive("");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <span className="w-8 h-8 rounded-md bg-accent flex items-center justify-center text-primary font-display font-bold text-[15px]">
            S
          </span>
          <p className="text-white-100 font-mono text-[14px] tracking-tight flex items-center">
            sathish
            <span className="sm:inline hidden text-faint">&nbsp;· ml/ai engineer</span>
          </p>
        </a>

        <div className="hidden sm:flex items-center gap-8">
          <ul className="list-none flex flex-row gap-9">
            {navLinks.map((n) => (
              <li key={n.id}>
                <a
                  href={`#${n.id}`}
                  onClick={() => setActive(n.id)}
                  className={`relative font-mono text-[13px] uppercase tracking-[0.12em] transition-colors ${
                    active === n.id ? "text-accent" : "text-secondary hover:text-white-100"
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
            className="font-mono text-[11px] text-faint border border-line rounded px-2 py-1 hover:border-accent hover:text-accent transition-colors"
            aria-label="Open command palette"
          >
            ⌘K
          </button>
          <ThemeToggle />
        </div>

        <div className="sm:hidden flex flex-1 justify-end items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setToggle(!toggle)}
            className="relative z-50 text-white-100 text-[22px] leading-none px-2 py-1"
            aria-label={toggle ? "Close menu" : "Open menu"}
            aria-expanded={toggle}
          >
            {toggle ? "✕" : "☰"}
          </button>
        </div>

        <AnimatePresence>
          {toggle && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 sm:hidden bg-primary/95 backdrop-blur-md flex flex-col justify-center px-8"
            >
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
                      className={`font-display text-[40px] leading-none ${
                        active === n.id ? "text-accent" : "text-white-100"
                      }`}
                      onClick={() => {
                        setToggle(false);
                        setActive(n.id);
                      }}
                    >
                      {n.title}
                    </a>
                  </motion.li>
                ))}
              </ul>
              <button
                onClick={() => {
                  setToggle(false);
                  window.dispatchEvent(new Event("open-command"));
                }}
                className="mt-12 self-start font-mono text-[13px] text-faint border border-line rounded px-3 py-2"
              >
                ⌘K · quick actions
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
