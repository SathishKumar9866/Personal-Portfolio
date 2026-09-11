import { useEffect, useState } from "react";
import { contact, navLinks } from "../constants";
import { ICON_PATHS, socialLinks } from "./icons";
import useActiveSection from "../hooks/useActiveSection";

/**
 * Owns: the right-edge dock — where you are, where you can go, and how to reach
 * him. One dock rather than three floating controls competing for the same edge.
 *
 * Section markers on top: a dot per section, filled for the one you are in,
 * label sliding out on hover or keyboard focus. Contact icons below a divider,
 * and they step aside while the Contact section is on screen, so the same four
 * links are never visible twice at once.
 *
 * Hidden below sm, where an edge dock sits on the content and fights the
 * back-to-top button.
 */
const Label = ({ children }) => (
  <span className="pointer-events-none absolute right-full mr-2 whitespace-nowrap rounded-md border border-line bg-primary px-2.5 py-1 font-mono text-[11px] text-secondary opacity-0 translate-x-1 transition duration-200 group-hover:opacity-100 group-hover:translate-x-0 group-focus-visible:opacity-100 group-focus-visible:translate-x-0">
    {children}
  </span>
);

const cell =
  "group relative flex h-11 w-11 items-center justify-center rounded-xl border border-line-strong bg-primary/85 backdrop-blur-sm text-secondary transition-colors hover:text-accent hover:border-accent focus-visible:text-accent";

const SideRail = () => {
  const active = useActiveSection();
  const [atContact, setAtContact] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const section = document.getElementById("contact")?.closest("section");
    if (!section) return;
    const io = new IntersectionObserver(([e]) => setAtContact(e.isIntersecting), {
      threshold: 0,
    });
    io.observe(section);
    return () => io.disconnect();
  }, []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contact.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      window.location.href = `mailto:${contact.email}`;
    }
  };

  const go = (id) => (e) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "start",
    });
  };

  return (
    <div className="hidden sm:flex fixed right-4 top-1/2 z-40 -translate-y-1/2 flex-col items-center gap-4">
      <nav aria-label="Sections" className="flex flex-col items-center gap-1">
        {navLinks.map((n) => {
          const on = active === n.id;
          return (
            <a
              key={n.id}
              href={`#${n.id}`}
              onClick={go(n.id)}
              aria-label={n.title}
              aria-current={on ? "true" : undefined}
              className="group relative flex h-7 w-11 items-center justify-center"
            >
              <Label>{n.title}</Label>
              <span
                aria-hidden="true"
                className={`rounded-full transition-all duration-300 ${
                  on
                    ? "h-2.5 w-2.5 bg-accent"
                    : "h-1.5 w-1.5 bg-line-strong group-hover:bg-accent"
                }`}
              />
            </a>
          );
        })}
      </nav>

      <span aria-hidden="true" className="h-px w-6 bg-line" />

      <div
        className={`flex flex-col gap-2 transition duration-300 ${
          atContact ? "invisible translate-x-6 opacity-0" : "visible opacity-100"
        }`}
      >
        {socialLinks()
          .filter((l) => l.k !== "email")
          .map((l) => (
            <a
              key={l.k}
              href={l.href}
              target="_blank"
              rel="noreferrer"
              aria-label={l.label}
              className={cell}
            >
              <Label>{l.label}</Label>
              <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d={ICON_PATHS[l.k]} />
              </svg>
            </a>
          ))}

        <button onClick={copyEmail} aria-label="Copy email address" className={cell}>
          <Label>{copied ? "Copied ✓" : "Copy email"}</Label>
          <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d={ICON_PATHS.email} />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SideRail;
