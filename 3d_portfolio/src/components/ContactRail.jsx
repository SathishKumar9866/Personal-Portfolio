/**
 * Owns: the contact dock pinned to the right edge — persistent, quick access to
 * the same four destinations without scrolling to the bottom.
 * Does not own: the glyphs or addresses (icons.js), or the Contact section
 * itself (Contact.jsx).
 *
 * It hides itself while the Contact section is on screen. That is the whole
 * answer to duplication: the rail and the section never appear together, so the
 * page never shows the same four links twice.
 *
 * Motion is plain CSS transitions, which index.css already neutralises under
 * prefers-reduced-motion — no motion library needed for a slide and a fade.
 */
import { useEffect, useState } from "react";
import { contact } from "../constants";
import { ICON_PATHS, socialLinks } from "./icons";

const Glyph = ({ name }) => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d={ICON_PATHS[name]} />
  </svg>
);

// Slides out to the left of its icon on hover or keyboard focus. The icon alone
// is recognisable; the label is what makes it obviously clickable before anyone
// tries it.
const Label = ({ children }) => (
  <span className="pointer-events-none absolute right-full mr-2 whitespace-nowrap rounded-md border border-line bg-primary px-2.5 py-1 font-mono text-[11px] text-secondary opacity-0 translate-x-1 transition duration-200 group-hover:opacity-100 group-hover:translate-x-0 group-focus-visible:opacity-100 group-focus-visible:translate-x-0">
    {children}
  </span>
);

const cell =
  "group relative flex h-11 w-11 items-center justify-center rounded-xl border border-line-strong bg-primary/85 backdrop-blur-sm text-secondary transition-colors hover:text-accent hover:border-accent focus-visible:text-accent";

const ContactRail = () => {
  const [atContact, setAtContact] = useState(false);
  const [copied, setCopied] = useState(false);

  // Hide while the Contact section is anywhere on screen.
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

  return (
    <nav
      aria-label="Contact shortcuts"
      className={`hidden sm:flex fixed right-4 top-1/2 z-40 -translate-y-1/2 flex-col gap-2 transition duration-300 ${
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
            <Glyph name={l.k} />
          </a>
        ))}

      <button onClick={copyEmail} aria-label="Copy email address" className={cell}>
        <Label>{copied ? "Copied ✓" : "Copy email"}</Label>
        <Glyph name="email" />
      </button>
    </nav>
  );
};

export default ContactRail;
