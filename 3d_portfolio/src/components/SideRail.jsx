import { navLinks } from "../constants";
import useActiveSection from "../hooks/useActiveSection";

/**
 * Owns, the RIGHT-edge section rail: where you are in the page, and one click
 * to anywhere else.
 * Does not own: contact routes, which sit on the left edge (ContactRail.jsx).
 *
 * The two edges carry different jobs: position and navigation on the right,
 * where the scrollbar and the back-to-top button already live; reaching him on
 * the left. Nine controls in one column was the thing to avoid.
 *
 * Hidden below the `rail` breakpoint (1024px), see ContactRail for the
 * measurement behind that number.
 */
const SideRail = () => {
  const active = useActiveSection();

  const go = (id) => (e) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    // Tells Navbar this is a jump, not a reading gesture: see CommandPalette.
    window.dispatchEvent(new Event("section-jump"));
    el.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "start",
    });
  };

  return (
    <nav
      aria-label="Sections"
      className="hidden rail:flex fixed right-2 xl:right-4 top-1/2 z-40 -translate-y-1/2 flex-col items-center gap-1"
    >
      {navLinks.map((n) => {
        const on = active === n.id;
        return (
          <a
            key={n.id}
            href={`#${n.id}`}
            onClick={go(n.id)}
            aria-label={n.title}
            aria-current={on ? "true" : undefined}
            className="group relative flex h-8 w-10 xl:w-11 items-center justify-center"
          >
            <span className="pointer-events-none absolute right-full mr-2 whitespace-nowrap rounded-xl border border-line bg-primary px-2.5 py-1 font-mono text-chip text-secondary opacity-0 translate-x-1 transition duration-200 group-hover:opacity-100 group-hover:translate-x-0 group-focus-visible:opacity-100 group-focus-visible:translate-x-0">
              {n.title}
            </span>
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
  );
};

export default SideRail;
