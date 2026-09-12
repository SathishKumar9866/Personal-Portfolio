import { useEffect, useState } from "react";

/**
 * Owns: the reader's own text-size control, and the persistence behind it.
 * Does not own: any size itself. Every type token in tailwind.config.js is
 * `calc(<rem> * var(--type-scale))`, so this writes one number and the whole
 * page follows.
 *
 * Why a var and not the root font-size: scaling `html { font-size }` would also
 * scale every rem-based padding, margin and max-width, and `max-w-7xl` at 140%
 * is wider than the viewport. Text is what a reader wants bigger; the layout is
 * not.
 *
 * Why it exists at all: browser zoom does the same job, and a meaningful share
 * of readers do not know that, or are on a trackpad where ctrl-scroll is
 * awkward. A visible control costs one button and asks nothing of them.
 */

// Four steps. 100 to 140 is the range where this page still holds its layout;
// past that the two-column grids want to be one column and that is a different
// design, not a bigger font.
const STEPS = [1, 1.12, 1.25, 1.4];
const KEY = "type-scale";

const read = () => {
  try {
    const i = STEPS.indexOf(Number(localStorage.getItem(KEY)));
    return i === -1 ? 0 : i;
  } catch {
    return 0;
  }
};

const Glyph = ({ sign }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    {/* An "A" rather than a magnifier: this changes type size, not zoom. */}
    <path d="M5 19 L10.5 6 L13.5 6 L19 19 M7.6 14.5 H16.4" />
    {sign === "+" && <path d="M20.5 5.5v5M18 8h5" />}
    {sign === "-" && <path d="M18 8h5" />}
  </svg>
);

const FontSizeToggle = () => {
  const [step, setStep] = useState(read);

  useEffect(() => {
    document.documentElement.style.setProperty("--type-scale", String(STEPS[step]));
    try {
      localStorage.setItem(KEY, String(STEPS[step]));
    } catch {
      /* ignore */
    }
  }, [step]);

  const pct = Math.round(STEPS[step] * 100);
  const atMin = step === 0;
  const atMax = step === STEPS.length - 1;

  const btn =
    "w-11 h-11 sm:w-9 sm:h-9 grid place-items-center border border-line-strong text-white-100 " +
    "transition-colors hover:border-accent hover:text-accent " +
    "disabled:opacity-40 disabled:hover:border-line-strong disabled:hover:text-white-100 disabled:cursor-not-allowed";

  return (
    <div className="flex items-center" role="group" aria-label="Text size">
      <button
        type="button"
        onClick={() => setStep((s) => Math.max(0, s - 1))}
        disabled={atMin}
        aria-label="Decrease text size"
        title="Decrease text size"
        className={`${btn} rounded-l-xl -mr-px`}
      >
        <Glyph sign="-" />
      </button>
      <button
        type="button"
        onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
        disabled={atMax}
        aria-label="Increase text size"
        title="Increase text size"
        className={`${btn} rounded-r-xl`}
      >
        <Glyph sign="+" />
      </button>
      {/* Announced, not drawn: the size change is its own visual feedback, but a
          screen-reader user gets nothing from that. */}
      <span aria-live="polite" className="sr-only">
        Text size {pct} percent
      </span>
    </div>
  );
};

export default FontSizeToggle;
