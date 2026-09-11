import { useEffect, useState } from "react";
import { contact } from "../constants";
import { ICON_PATHS, socialLinks } from "./icons";

/**
 * Owns: the LEFT-edge contact dock — reach him from anywhere on the page.
 * Does not own: section navigation, which lives on the right (SideRail.jsx), or
 * the Contact section itself.
 *
 * Left and right carry different jobs on purpose: where you can GO is on the
 * right with the scroll position, how you REACH HIM is on the left. Putting both
 * on one edge made a single column of nine controls.
 *
 * It steps aside while the Contact section is on screen, so the same four links
 * are never visible twice at once. Hidden below the `rail` breakpoint (1400px),
 * which is where the page actually has margin for an edge dock — below it the
 * dock measured 4px from the text at every width.
 */
const Label = ({ children }) => (
  // Opens to the RIGHT — this dock is on the left edge, so a label sliding left
  // would run off the viewport.
  <span className="pointer-events-none absolute left-full ml-2 whitespace-nowrap rounded-md border border-line bg-primary px-2.5 py-1 font-mono text-[11px] text-secondary opacity-0 -translate-x-1 transition duration-200 group-hover:opacity-100 group-hover:translate-x-0 group-focus-visible:opacity-100 group-focus-visible:translate-x-0">
    {children}
  </span>
);

const cell =
  "group relative flex h-11 w-11 items-center justify-center rounded-xl border border-line-strong bg-primary/85 backdrop-blur-sm text-secondary transition-colors hover:text-accent hover:border-accent focus-visible:text-accent";

const ContactRail = () => {
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

  return (
    <nav
      aria-label="Contact shortcuts"
      className={`hidden rail:flex fixed left-4 top-1/2 z-40 -translate-y-1/2 flex-col gap-2 transition duration-300 ${
        atContact ? "invisible -translate-x-6 opacity-0" : "visible opacity-100"
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

      <span aria-live="polite" className="sr-only">
        {copied ? "Email address copied to clipboard" : ""}
      </span>
    </nav>
  );
};

export default ContactRail;
