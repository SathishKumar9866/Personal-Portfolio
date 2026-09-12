import { useEffect, useState } from "react";

/**
 * Owns: hiding secondary detail behind a disclosure on a phone, and getting out
 * of the way entirely on a larger screen.
 *
 * Why. Measured on the deployed site at phone width, the page ran 14,494px:
 * about fourteen screens, of which Work alone was 3,998 and Experience 2,564.
 * Reaching the contact details meant scrolling past everything. The headline of
 * every card still shows; what collapses is the paragraph under it.
 *
 * Native `<details>` rather than a state toggle: it is keyboard operable, it is
 * announced correctly, it is findable by in-page search in browsers that expand
 * matches, and it costs no JavaScript to open.
 *
 * The breakpoint is read in JS rather than with a `md:` class because CSS can
 * change how an element looks and not what element it is. A `<details>` with no
 * `open` attribute hides its content at every width, and there is no CSS that
 * un-collapses it on desktop, so the desktop path has to be a different tree.
 *
 * `md` (768px) matches the Stack and Work grids, so the disclosure disappears at
 * exactly the width the layout stops being one column.
 */

const QUERY = "(max-width: 767px)";

export const useNarrow = () => {
  const [narrow, setNarrow] = useState(
    () => typeof window !== "undefined" && window.matchMedia(QUERY).matches
  );
  useEffect(() => {
    const m = window.matchMedia(QUERY);
    const on = () => setNarrow(m.matches);
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, []);
  return narrow;
};

const MobileCollapse = ({ label = "Details", children }) => {
  const narrow = useNarrow();
  if (!narrow) return children;
  return (
    <details className="group mt-3">
      <summary
        className="flex items-center gap-2 min-h-11 cursor-pointer list-none font-sans text-[12px] font-medium uppercase tracking-[0.09em] text-accent-ink marker:hidden [&::-webkit-details-marker]:hidden"
      >
        <svg
          width="11"
          height="11"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          aria-hidden="true"
          className="transition-transform duration-200 group-open:rotate-90"
        >
          <path d="M9 5l7 7-7 7" />
        </svg>
        {label}
      </summary>
      {children}
    </details>
  );
};

export default MobileCollapse;
