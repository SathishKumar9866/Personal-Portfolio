import { useEffect, useState } from "react";
import { styles } from "../styles";
import { navLinks } from "../constants";

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

        <ul className="list-none hidden sm:flex flex-row gap-9">
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

        <div className="sm:hidden flex flex-1 justify-end items-center">
          <button
            onClick={() => setToggle(!toggle)}
            className="text-white-100 text-[22px] leading-none px-2 py-1"
            aria-label={toggle ? "Close menu" : "Open menu"}
            aria-expanded={toggle}
          >
            {toggle ? "✕" : "☰"}
          </button>
          <div
            className={`${
              !toggle ? "hidden" : "flex"
            } menu-panel p-5 absolute top-14 right-4 min-w-[160px] z-10 rounded-xl`}
          >
            <ul className="list-none flex flex-col gap-3 w-full">
              {navLinks.map((n) => (
                <li key={n.id}>
                  <a
                    href={`#${n.id}`}
                    className={`font-mono text-[13px] uppercase tracking-[0.12em] ${
                      active === n.id ? "text-accent" : "text-white-100"
                    }`}
                    onClick={() => {
                      setToggle(false);
                      setActive(n.id);
                    }}
                  >
                    {n.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
