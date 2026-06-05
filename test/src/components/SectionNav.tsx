"use client";

import { useEffect, useState } from "react";

// Left-edge vertical section rail. Subtle dots (peripheral, low eye-strain);
// labels reveal on hover. Active dot tracks the section in view (scroll-spy).
// Hidden below lg and for reduced-motion-agnostic users it still works (CSS).
const SECTIONS = [
  { id: "home", label: "Home" },
  { id: "focus", label: "Focus" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "about", label: "About" },
  { id: "repositories", label: "Open Source" },
];

export const SectionNav = () => {
  const [active, setActive] = useState("home");

  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => el !== null
    );
    if (els.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // The section whose top is nearest the upper third of the viewport wins.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Section navigation"
      className="fixed left-3 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 lg:flex"
    >
      {SECTIONS.map((s) => {
        const isActive = active === s.id;
        return (
          <a
            key={s.id}
            href={`#${s.id}`}
            aria-label={s.label}
            aria-current={isActive ? "true" : undefined}
            className="group/nav flex items-center gap-2"
          >
            <span
              className={`size-2 rounded-full transition-all duration-300 ${
                isActive
                  ? "scale-125 bg-accent"
                  : "bg-line group-hover/nav:bg-muted"
              }`}
            />
            <span
              className={`pointer-events-none whitespace-nowrap rounded-md border border-line bg-panel px-2 py-0.5 font-mono text-[11px] opacity-0 shadow-sm transition-opacity duration-200 group-hover/nav:opacity-100 ${
                isActive ? "text-accent" : "text-muted"
              }`}
            >
              {s.label}
            </span>
          </a>
        );
      })}
    </nav>
  );
};
