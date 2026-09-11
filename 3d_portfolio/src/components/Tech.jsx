import { motion } from "framer-motion";
import { styles } from "../styles";
import { stackGroups, TERM_HINT } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";
import { SectionWrapper } from "../hoc";
import TagTerm from "./TagTerm";

const Tech = () => (
  <>
    <motion.div variants={textVariant()}>
      <p className={styles.sectionSubText}>What I use</p>
      <h2 className={styles.sectionHeadText}>Stack.</h2>
    </motion.div>

    <motion.p
      variants={fadeIn("", "", 0.1, 1)}
      className="mt-4 font-sans text-secondary text-[17px] max-w-2xl leading-[1.6]"
    >
      Not a badge collection — this is what I actually reach for, grouped by where
      it sits on the path from raw data to a running product. I pick tools that
      are boring in production: measurable, reproducible, and easy to hand off.
      <span className="mt-3 block font-mono text-[12px] text-faint">{TERM_HINT}</span>
    </motion.p>

    <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-4">
      {stackGroups.map((g, i) => (
        <motion.div
          key={g.title}
          variants={fadeIn("up", "spring", i * 0.08, 0.5)}
          className="bg-tertiary rounded-2xl p-4 sm:p-6 border border-line hover:border-accent/50 transition-colors"
        >
          <h3 className="text-accent-ink font-mono text-[12px] uppercase tracking-label mb-1">
            {g.title}
          </h3>
          {g.note && (
            <p className="font-serif text-secondary text-[13px] leading-snug mb-4">{g.note}</p>
          )}
          <div className="flex flex-wrap gap-2">
            {g.items.map((it) => (
              <TagTerm key={it} name={it} />
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  </>
);

export default SectionWrapper(Tech, "stack");
