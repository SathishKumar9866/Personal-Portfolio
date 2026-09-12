import { motion } from "framer-motion";
import { styles } from "../styles";
import { stackGroups, TERM_HINT } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";
import Reveal from "./Reveal";
import { SectionWrapper } from "../hoc";
import TagTerm from "./TagTerm";
import TokenStream from "./TokenStream";

const Tech = () => (
  <>
    {/* The token stream lives here and nowhere else: this is the section with
        the LLM / RAG group, so a stream of sub-word pieces illustrates the
        content instead of decorating the page. */}
    <TokenStream />

    <motion.div variants={textVariant()}>
      <p className={styles.sectionSubText}>What I use</p>
      <h2 className={styles.sectionHeadText}>Stack.</h2>
    </motion.div>

    <motion.p
      variants={fadeIn("", "", 0.1, 1)}
      className="mt-4 font-sans text-secondary text-lede max-w-[34rem] leading-[1.7]"
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

    {/* One column under md, two at md, three from lg. Six groups land as 3x2
        rather than 2x3, which is a whole row less scrolling for the same
        content. Two 280px-wide cards on a phone was the old behaviour and it
        wrapped every chip onto its own line. */}
    <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 items-stretch">
      {stackGroups.map((g, i) => (
        <Reveal
          key={g.title}
          // Each card waits for its own viewport entry. The small delay is by
          // column, so a row arrives as a row rather than all six at once.
          delay={(i % 3) * 0.07}
          className="glass-card card-lift rounded-2xl p-4 sm:p-6 flex flex-col h-full hover:border-accent/50"
        >
          <h3 className="flex items-center gap-2 text-accent-ink font-mono text-label uppercase tracking-label">
            <span className={`h-2 w-2 shrink-0 rounded-full ${g.dot}`} aria-hidden="true" />
            {g.title}
          </h3>
          {g.note && (
            <p className="mt-2 font-serif text-secondary text-body leading-[1.5]">{g.note}</p>
          )}
          {/* mt-auto is the whole point: grid already equalises card height, but
              without it the chip row floats up under a one-line note and two
              cards in a row disagree by up to 34px. */}
          <div className="mt-auto pt-4 flex flex-wrap gap-2">
            {g.items.map((it) => (
              <TagTerm key={it} name={it} primary={g.primary?.includes(it)} />
            ))}
          </div>
        </Reveal>
      ))}
    </div>
  </>
);

export default SectionWrapper(Tech, "stack");
