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

const Tech = () => (
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
      Not a badge collection: this is what I actually reach for, grouped by where
      it sits on the path from raw data to a running product. I pick tools that
      are boring in production: measurable, reproducible, and easy to hand off.
    </motion.p>

    {/* The hint is an instruction about the interface, not part of the argument
        the intro is making, so it gets its own line, its own voice (serif
        italic, the reading face) and a mark. The info glyph is inline rather
        than in icons.js: that module owns brand marks and off-site
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

    {/* Two shapes, because a phone and a desktop want different things here.
        On a phone this is one block with six labelled rows: six bordered cards
        each carrying a description was most of a screen per card for content
        that is really a list. Cards return at md, where there is room for the
        description to earn its place. Each row and each card still reveals on
        its own viewport entry, so the section animates as the reader arrives at
        it rather than all at once. */}
    <div className="mt-8 sm:mt-12">
      {/* phone: six labelled rows of flowing terms, no card and no chips.
          Boxed, this was thirty-three bordered rectangles about 50px tall — a
          form, not a vocabulary, and most of a screen per group. Bare terms
          carry the same two tiers in weight and colour, the dotted underline
          still marks what is definable, and the count on the right is the one
          number a reader might want. The wave that used to sit above this is
          gone: at 390px it rendered as struck-through fragments in a band of
          its own and read as a glitch rather than a stream. */}
      <div className="md:hidden divide-y divide-line">
        {stackGroups.map((g, i) => (
          <Reveal key={g.title} delay={i * 0.06} y={12} className="py-5 first:pt-0 last:pb-0">
            <h3 className="flex items-center gap-2 text-accent-ink font-sans text-[12px] font-medium uppercase tracking-[0.09em]">
              <span className={`h-2 w-2 shrink-0 rounded-full ${g.dot}`} aria-hidden="true" />
              {g.title}
              <span className="ml-auto font-mono text-micro text-faint normal-case tracking-normal">
                {g.items.length}
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

      {/* md and up: the cards, with the descriptions */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 items-stretch">
        {stackGroups.map((g, i) => (
          <Reveal
            key={g.title}
            // Delay by column, so a row arrives as a row rather than all six
            // off one event.
            delay={(i % 3) * 0.07}
            className="glass-card card-lift rounded-2xl p-4 sm:p-6 flex flex-col h-full hover:border-accent/50"
          >
            <h3 className="flex items-center gap-2 text-accent-ink font-sans text-[12px] font-medium uppercase tracking-[0.09em]">
              <span className={`h-2 w-2 shrink-0 rounded-full ${g.dot}`} aria-hidden="true" />
              {g.title}
            </h3>
            {g.note && (
              <p className="mt-2 font-serif text-secondary text-body leading-[1.5]">{g.note}</p>
            )}
            {/* mt-auto is the whole point: grid already equalises card height,
                but without it the chip row floats up under a one-line note and
                two cards in a row disagree by up to 34px. */}
            <div className="mt-auto pt-4 flex flex-wrap gap-2">
              {g.items.map((it) => (
                <TagTerm key={it} name={it} primary={g.primary?.includes(it)} />
              ))}
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </>
);

export default SectionWrapper(Tech, "stack");
