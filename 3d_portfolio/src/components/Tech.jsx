import { useState } from "react";
import { motion } from "framer-motion";
import { stackGroups, TERM_HINT } from "../constants";
import { fadeIn } from "../utils/motion";
import Reveal from "./Reveal";
import { SectionWrapper } from "../hoc";
import SectionHead from "./SectionHead";
import TagTerm from "./TagTerm";
import TokenStream from "./TokenStream";

// A set, not a sum: several tools appear in more than one group, and counting
// the arrays would claim more than he lists.
const STACK_META = `${stackGroups.length} areas · ${
  new Set(stackGroups.flatMap((g) => g.items)).size
} tools`;

const stageNo = (i) => String(i + 1).padStart(2, "0");

/**
 * Where the pointer is, in card-local percent, written straight to the DOM node
 * as `--mx`/`--my` for the spotlight in `.stack-card::before`.
 *
 * Imperative on purpose. Routing a pointermove through React state would
 * re-render six cards on every mouse pixel for an effect that is pure paint,
 * and the target here is a plain element rather than the motion wrapper around
 * it, so framer-motion never rewrites the style attribute out from under it.
 */
const spot = (e) => {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
  el.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
};

const Tech = () => {
  // Which group the pointer is on, or null. Drives only the rail above the
  // grid: the cards light themselves in CSS, which needs no state at all.
  const [active, setActive] = useState(null);

  return (
    <>
      {/* The token stream lives here and nowhere else: this is the section with
          the LLM / RAG group, so a stream of sub-word pieces illustrates the
          content instead of decorating the page. */}
      <TokenStream />

      <SectionHead title="Stack" meta={STACK_META} />

      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        // Desktop only. On a phone this section is a list of tools and the
        // argument for them is three lines the reader scrolls past to reach it.
        className="hidden md:block mt-4 font-sans text-secondary text-lede max-w-[34rem] leading-[1.7]"
      >
        Not a badge collection: this is what I actually reach for, grouped by
        where it sits on the path from raw data to a running product. I pick
        tools that are boring in production: measurable, reproducible, and easy
        to hand off.
      </motion.p>

      {/* The hint is an instruction about the interface, not part of the
          argument the intro is making, so it gets its own line, its own voice
          (serif italic, the reading face) and a mark. The info glyph is inline
          rather than in icons.js: that module owns brand marks and off-site
          destinations, not one-off affordances. */}
      <motion.p
        variants={fadeIn("", "", 0.18, 1)}
        className="mt-4 flex items-start gap-2 font-serif italic text-faint text-body leading-[1.6] max-w-[32rem]"
      >
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          className="mt-[4px] shrink-0"
        >
          <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 2a8 8 0 110 16 8 8 0 010-16zm-1 3h2v2h-2V7zm0 4h2v6h-2v-6z" />
        </svg>
        {TERM_HINT}
      </motion.p>

      {/* THE PIPELINE RAIL. The intro claims the six groups are ordered along a
          path from raw data to a running product, and until now nothing on the
          page showed it: a 3x2 grid of cards states six categories and throws
          the ordering away. The rail draws the claim.

          It repeats none of the card titles on purpose — six titles above six
          titled cards is the same six words read twice. It carries the two end
          labels, which are the part the cards cannot say, and the six tints,
          which double as the legend for the dots below.

          aria-hidden, and correctly so: it is a picture of an ordering the
          intro paragraph already states in words, and the cards below sit in
          that order in the DOM. A screen reader loses nothing. */}
      <Reveal
        delay={0.1}
        aria-hidden="true"
        className="hidden md:flex items-center gap-3 mt-10 font-mono text-micro text-faint uppercase tracking-[0.14em]"
      >
        <span className="shrink-0">raw data</span>
        <span className="flex flex-1 items-center gap-[3px]">
          {stackGroups.map((g, i) => (
            <span
              key={g.title}
              className="stack-seg h-[3px] flex-1 rounded-full"
              style={{
                background: `rgb(var(${g.tint}))`,
                opacity: active === null ? 0.45 : active === i ? 1 : 0.16,
                transform: active === i ? "scaleY(2.4)" : "scaleY(1)",
              }}
            />
          ))}
        </span>
        <span className="shrink-0">running product</span>
      </Reveal>

      {/* Two shapes, because a phone and a desktop want different things here.
          On a phone this is one block with six labelled rows: six bordered cards
          each carrying a description was most of a screen per card for content
          that is really a list. Cards return at md, where there is room for the
          description to earn its place. Each row and each card still reveals on
          its own viewport entry, so the section animates as the reader arrives
          at it rather than all at once. */}
      <div className="mt-6 sm:mt-8">
        {/* phone: six labelled rows of flowing terms, no card and no chips.
            Boxed, this was thirty-three bordered rectangles about 50px tall — a
            form, not a vocabulary, and most of a screen per group. Bare terms
            carry the same two tiers in weight and colour, and the dotted
            underline still marks what is definable. The wave that used to sit
            above this is gone: at 390px it rendered as struck-through fragments
            in a band of its own and read as a glitch rather than a stream.

            The number on the right was the group's tool count and is now its
            stage number, so a phone and a desktop tell the same story about the
            order. The count was never the interesting number: the tools it
            counts are on the next line.

            The tinted left rule replaces the row divider and the dot. It does
            the same separating job a grey hairline did and, unlike the hairline,
            it carries the category colour down the whole row instead of into one
            8px circle. */}
        <div className="md:hidden flex flex-col gap-5">
          {stackGroups.map((g, i) => (
            <Reveal
              key={g.title}
              delay={i * 0.06}
              y={12}
              className="border-l-2 pl-4"
              style={{ borderColor: `rgb(var(${g.tint}) / 0.8)` }}
            >
              <h3 className="flex items-baseline gap-2">
                <span className="font-display text-[15px] font-semibold text-white-100 tracking-[-0.01em]">
                  {g.title}
                </span>
                {/* Inside the <h3>, unlike the desktop variant below, so
                    without this the group's accessible name is "Data
                    engineering01". Same reason the Roles stage numeral is
                    hidden: it is a position marker, not part of the name. */}
                <span
                  aria-hidden="true"
                  className="stack-index ml-auto font-mono text-micro"
                  style={{ "--cat": `var(${g.tint})` }}
                >
                  {stageNo(i)}
                </span>
              </h3>
              <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0">
                {g.items.map((it) => (
                  <TagTerm key={it} name={it} flow primary={g.primary?.includes(it)} />
                ))}
              </div>
            </Reveal>
          ))}
        </div>

        {/* md and up: the cards, with the descriptions.
            Reveal stays the motion wrapper and the card is a plain child of it,
            so the pointermove handler writes --mx/--my to an element that
            framer-motion is not also writing a style attribute to. */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 items-stretch">
          {stackGroups.map((g, i) => (
            <Reveal
              key={g.title}
              // Delay by column, so a row arrives as a row rather than all six
              // off one event.
              delay={(i % 3) * 0.07}
              className="h-full"
            >
              <div
                className="stack-card glass-card card-lift rounded-2xl p-5 sm:p-6 flex flex-col h-full"
                style={{ "--cat": `var(${g.tint})` }}
                onPointerMove={spot}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
              >
                <div className="flex items-start gap-2.5">
                  <span
                    className={`mt-[7px] h-2 w-2 shrink-0 rounded-full ${g.dot}`}
                    aria-hidden="true"
                  />
                  {/* The heading was 12px uppercase in accent red: a dashboard
                      label for what is the only heading inside the card. At
                      reading size in the display face it is a heading, and the
                      hierarchy inside a card finally runs heading > note > tools
                      instead of three near-equal bands. */}
                  <h3 className="font-display text-[17px] font-semibold text-white-100 tracking-[-0.01em] leading-tight">
                    {g.title}
                  </h3>
                  <span className="stack-index ml-auto shrink-0 font-mono text-[26px] font-medium leading-none -mt-1">
                    {stageNo(i)}
                  </span>
                </div>
                {g.note && (
                  <p className="mt-2.5 font-serif text-secondary text-body leading-[1.5]">
                    {g.note}
                  </p>
                )}
                {/* mt-auto is the whole point: grid already equalises card
                    height, but without it the chip row floats up under a
                    one-line note and two cards in a row disagree by up to
                    34px. */}
                <div className="mt-auto pt-5 flex flex-wrap gap-2">
                  {g.items.map((it) => (
                    <TagTerm key={it} name={it} primary={g.primary?.includes(it)} />
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </>
  );
};

export default SectionWrapper(Tech, "stack");
