import { useEffect, useLayoutEffect, useRef, useState } from "react";

/**
 * Owns, the code-completion band in the hero's lower slack, below the `rail`
 * breakpoint: a Python binary search being completed, then run, with the array
 * it is searching drawn underneath it.
 * Does not own: the desktop field (NeuralField.jsx) or the token wave
 * (TokenStream.jsx), which belong to the landing view and to Stack.
 *
 * Why it exists. The hero is `min-h-screen` and top-aligned, so on a phone its
 * content ends at 591 of 844 and the rest is empty: measured at 390x844, 253px
 * of hero slack and 331px from the last hero element to the word "Overview".
 * Thirty-nine percent of the screen with nothing in it. The thing that earns
 * that space on a desktop is the scroll cue, and the scroll cue is
 * `hidden sm:flex`, so the space was never designed — it was left over.
 *
 * Why this and not an ornament. The page claims "the evidence it works" and
 * "measured, not estimated". A band that completes a function and then RUNS it
 * on real input is that claim in miniature: the reader watches the guard clause
 * earn its place. The three cases cycle in a fixed order, and two of the three
 * are the ones that break naive implementations:
 *
 *   found   — the target is in the array, the loop converges on it
 *   missing — the target is not there, the loop exhausts and returns -1
 *   empty   — `nums` is empty, and `if not nums` is the only line that runs
 *
 * The values are random every cycle, so it is never the same search twice, but
 * WHICH case comes next is not: an edge case that only shows up by luck is an
 * edge case a reader may never see.
 *
 * Cheap by construction, the same rules as its two siblings:
 *  - no requestAnimationFrame and no canvas. It is a dozen lines of text and
 *    eight boxes, so it is DOM, and it advances on a setTimeout chain at
 *    11 frames a second rather than 60
 *  - the chain only runs while the band is on screen (IntersectionObserver)
 *  - phone only; at `rail` and above it does not render at all, because that is
 *    where NeuralField already owns the landing view
 *  - `prefers-reduced-motion` renders the finished state: the whole function,
 *    the settled array, the result. Nothing moves and nothing is missing
 *  - aria-hidden, like the other two: a screen reader reading a half-typed
 *    function is noise, and none of this is content the page depends on
 */

// Real, runnable Python, not a prop. Indexes into this are the only way the
// runner names a line, so the two never drift: see LINES.
const CODE = [
  "def search(nums, target):",
  "    if not nums:",
  "        return -1",
  "    lo, hi = 0, len(nums) - 1",
  "    while lo <= hi:",
  "        mid = (lo + hi) // 2",
  "        if nums[mid] == target:",
  "            return mid",
  "        if nums[mid] < target:",
  "            lo = mid + 1",
  "        else:",
  "            hi = mid - 1",
  "    return -1",
];

// Named, because `activeLine === 9` in a step list is a number nobody can check
// against the code above it.
const LINES = {
  guard: 1,
  guardReturn: 2,
  init: 3,
  whileTest: 4,
  mid: 5,
  hitTest: 6,
  hitReturn: 7,
  lowTest: 8,
  raiseLo: 9,
  elseBranch: 10,
  lowerHi: 11,
  exhausted: 12,
};

// The first line is the reader's; everything under it is the completion. That
// is what makes it read as a completion rather than as a listing.
const GIVEN = 1;

const CASES = ["found", "missing", "empty"];

/** A sorted array of distinct values, and a target that exercises `kind`. */
const makeCase = (kind) => {
  if (kind === "empty") return { nums: [], target: 1 + Math.floor(Math.random() * 40) };
  const n = 5 + Math.floor(Math.random() * 3); // 5..7 cells, what fits at 360px
  const nums = [];
  let v = 1 + Math.floor(Math.random() * 6);
  for (let i = 0; i < n; i++) {
    nums.push(v);
    v += 2 + Math.floor(Math.random() * 7);
  }
  if (kind === "found") {
    return { nums, target: nums[Math.floor(Math.random() * nums.length)] };
  }
  // Missing: strictly between two neighbours, so it is a plausible miss rather
  // than a value obviously off the end of the array.
  const i = Math.floor(Math.random() * (nums.length - 1));
  return { nums, target: nums[i] + 1 };
};

/**
 * Run the function above and record what it did. The steps ARE the execution,
 * so the highlighted line and the drawn window can never disagree with each
 * other — there is only one traversal.
 */
const trace = ({ nums, target }) => {
  const steps = [];
  const at = (line, state) => steps.push({ line, ...state });

  at(LINES.guard, { lo: null, hi: null, mid: null });
  if (!nums.length) {
    at(LINES.guardReturn, { lo: null, hi: null, mid: null, done: -1 });
    return steps;
  }

  let lo = 0;
  let hi = nums.length - 1;
  at(LINES.init, { lo, hi, mid: null });

  while (lo <= hi) {
    at(LINES.whileTest, { lo, hi, mid: null });
    const mid = Math.floor((lo + hi) / 2);
    at(LINES.mid, { lo, hi, mid });
    if (nums[mid] === target) {
      at(LINES.hitTest, { lo, hi, mid });
      at(LINES.hitReturn, { lo, hi, mid, done: mid });
      return steps;
    }
    if (nums[mid] < target) {
      at(LINES.lowTest, { lo, hi, mid });
      lo = mid + 1;
      at(LINES.raiseLo, { lo, hi, mid });
    } else {
      at(LINES.elseBranch, { lo, hi, mid });
      hi = mid - 1;
      at(LINES.lowerHi, { lo, hi, mid });
    }
  }
  at(LINES.whileTest, { lo, hi, mid: null });
  at(LINES.exhausted, { lo, hi, mid: null, done: -1 });
  return steps;
};

const TYPE_MS = 85;   // one line of the completion
const STEP_MS = 620;  // one step of the run
const HOLD_MS = 1900; // the result, before the next case

const CodeCompletion = () => {
  // Below `rail` only, and it tracks the query rather than reading it once: a
  // tablet rotating across 1024px changes the answer, and both siblings listen
  // for exactly that. Above the breakpoint this renders nothing at all, so the
  // timer chain below never starts.
  const [enabled, setEnabled] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 1023px)").matches
  );
  const boxRef = useRef(null);
  const [frame, setFrame] = useState({ typed: GIVEN, step: null, caseIdx: 0, data: null });
  // Whether the hero's slack can actually hold this. See the layout effect.
  const [fits, setFits] = useState(false);

  useEffect(() => {
    const gate = window.matchMedia("(max-width: 1023px)");
    const sync = () => setEnabled(gate.matches);
    gate.addEventListener("change", sync);
    return () => gate.removeEventListener("change", sync);
  }, []);

  /**
   * The band only appears if the slack is big enough to hold it, and that is
   * measured rather than assumed. Two reasons it cannot be a breakpoint:
   *
   *  - the slack is the hero's height minus its content's, so it depends on the
   *    screen AND on how tall the copy wrapped. At 390x844 it is 253px; at
   *    360x640 it is 49px, and the band drawn there overlapped the lede by
   *    156px
   *  - the reader's text-size control changes the content's height without
   *    changing anything a media query can see
   *
   * So it measures the real gap against its own real height, on mount and
   * whenever either side of that sum changes.
   */
  useLayoutEffect(() => {
    if (!enabled) return;
    const el = boxRef.current;
    const hero = el?.parentElement;
    if (!hero) return;

    const measure = () => {
      // The hero's in-flow child is the copy; this band and the scroll cue are
      // both absolute, so they are not part of what fills the section.
      const flow = [...hero.children].filter(
        (c) => getComputedStyle(c).position !== "absolute" && getComputedStyle(c).position !== "fixed"
      );
      if (!flow.length) return;
      const contentBottom = Math.max(...flow.map((c) => c.getBoundingClientRect().bottom));
      const heroBottom = hero.getBoundingClientRect().bottom;
      const offset = parseFloat(getComputedStyle(el).bottom) || 0;
      // 16px of air between the copy and the band, so "it fits" never means
      // "it touches".
      setFits(heroBottom - offset - contentBottom >= el.offsetHeight + 16);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(hero);
    [...hero.children].forEach((c) => ro.observe(c));
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled || !fits) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let timer = 0;
    let alive = true;
    let onScreen = true;
    let caseIdx = 0;

    const run = () => {
      if (!alive) return;
      const kind = CASES[caseIdx % CASES.length];
      const data = makeCase(kind);
      const steps = trace(data);

      if (reduced) {
        // The finished state: the whole function, the last step, the result.
        setFrame({ typed: CODE.length, step: steps[steps.length - 1], caseIdx, data, kind });
        return;
      }

      let typed = GIVEN;
      let i = 0;

      const tick = () => {
        if (!alive) return;
        // Off screen: hold this frame and check again shortly. Cheaper than
        // tearing the chain down and rebuilding it, and the band is never more
        // than one step stale when the reader comes back.
        if (!onScreen) {
          timer = setTimeout(tick, 400);
          return;
        }
        if (typed < CODE.length) {
          typed += 1;
          setFrame({ typed, step: null, caseIdx, data, kind });
          timer = setTimeout(tick, TYPE_MS);
          return;
        }
        if (i < steps.length) {
          const step = steps[i];
          i += 1;
          setFrame({ typed, step, caseIdx, data, kind });
          timer = setTimeout(tick, step.done !== undefined ? HOLD_MS : STEP_MS);
          return;
        }
        caseIdx += 1;
        run();
      };

      setFrame({ typed, step: null, caseIdx, data, kind });
      timer = setTimeout(tick, TYPE_MS);
    };

    const io = new IntersectionObserver(
      ([e]) => {
        onScreen = e.isIntersecting;
      },
      { threshold: 0 }
    );
    if (boxRef.current) io.observe(boxRef.current);

    run();
    return () => {
      alive = false;
      clearTimeout(timer);
      io.disconnect();
    };
  }, [enabled, fits]);

  if (!enabled) return null;

  const { typed, step, data, kind } = frame;
  const active = step ? step.line : -1;
  const result = step && step.done !== undefined ? step.done : null;

  // The window follows the caret while typing and the active line while
  // running, so the part that matters is always the part on screen.
  const WINDOW = 7;
  const focus = active >= 0 ? active : typed - 1;
  const top = Math.max(0, Math.min(CODE.length - WINDOW, focus - WINDOW + 2));

  return (
    <div
      ref={boxRef}
      aria-hidden="true"
      // In the slack the hero's content does not use, so it costs the page no
      // height. It clears the scroll cue from `sm` up, where the cue exists;
      // below that the cue is hidden and this takes the space it would have
      // had. `overflow-hidden` because the reader's text-size control scales
      // every token in here, and a short phone at 140% must clip rather than
      // push into the headline.
      className={`pointer-events-none absolute inset-x-[clamp(1.25rem,4.5vw,4rem)] bottom-6 sm:bottom-28 z-0 rail:hidden overflow-hidden rounded-xl border border-line bg-tertiary/40 px-3 py-2 transition-opacity duration-300 ${
        fits ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="flex items-center justify-between font-mono text-micro uppercase tracking-label text-faint">
        <span>search.py</span>
        <span className={result === null ? "" : "text-accent-ink"}>
          {result === null
            ? typed < CODE.length
              ? "completing"
              : "running"
            : `${kind} → ${result === -1 ? "-1" : `index ${result}`}`}
        </span>
      </div>

      <pre
        className="mt-1.5 overflow-hidden font-mono text-micro leading-[1.5]"
        style={{ height: `calc(${WINDOW} * 1.5em)` }}
      >
        <code
          className="block transition-transform duration-200"
          style={{ transform: `translateY(-${top * 1.5}em)` }}
        >
          {CODE.map((line, i) => {
            const shown = i < typed;
            const isActive = i === active;
            // The guard is the point of the whole band, so it is tinted even
            // when it is not the line running.
            const isGuard = i === LINES.guard || i === LINES.guardReturn;
            return (
              <span
                key={i}
                className={`block whitespace-pre ${
                  !shown
                    ? "opacity-0"
                    : isActive
                      ? "text-accent-ink"
                      : isGuard
                        ? "text-secondary"
                        : i < GIVEN
                          ? "text-white-100"
                          : "text-faint"
                }`}
              >
                {line}
                {shown && i === typed - 1 && active < 0 && (
                  <span className="text-accent-ink">▌</span>
                )}
              </span>
            );
          })}
        </code>
      </pre>

      {/* The array it is searching. `lo..hi` is the live window, `mid` the cell
          under test, and an empty array draws as the one thing it is: nothing
          for the loop to look at. */}
      <div className="mt-1.5 flex items-center gap-1">
        {data && data.nums.length > 0 ? (
          data.nums.map((v, i) => {
            const inWindow =
              step && step.lo !== null && i >= step.lo && i <= step.hi;
            const isMid = step && step.mid === i;
            const isHit = result !== null && result === i;
            return (
              <span
                key={i}
                className={`flex-1 min-w-0 rounded border py-0.5 text-center font-mono text-micro transition-colors ${
                  isHit
                    ? "border-accent bg-accent text-black-100"
                    : isMid
                      ? "border-accent text-accent-ink"
                      : inWindow
                        ? "border-line-strong text-secondary"
                        : "border-line text-faint opacity-50"
                }`}
              >
                {v}
              </span>
            );
          })
        ) : (
          <span className="flex-1 rounded border border-dashed border-line-strong py-0.5 text-center font-mono text-micro text-faint">
            nums = []
          </span>
        )}
        <span className="shrink-0 pl-1 font-mono text-micro text-faint">
          {data ? `t=${data.target}` : ""}
        </span>
      </div>
    </div>
  );
};

export default CodeCompletion;
