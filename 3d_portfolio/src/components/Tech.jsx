import { motion } from "framer-motion";
import { styles } from "../styles";
import { stackGroups } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";
import { SectionWrapper } from "../hoc";

const Tech = () => (
  <>
    <motion.div variants={textVariant()}>
      <p className={styles.sectionSubText}>What I use</p>
      <h2 className={styles.sectionHeadText}>Stack.</h2>
    </motion.div>

    <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {stackGroups.map((g, i) => (
        <motion.div
          key={g.title}
          variants={fadeIn("up", "spring", i * 0.1, 0.6)}
          className="bg-tertiary rounded-2xl p-6 border border-line hover:border-accent/50 transition-colors"
        >
          <h3 className="text-accent font-mono text-[12px] uppercase tracking-label mb-1">
            {g.title}
          </h3>
          {g.note && (
            <p className="font-serif text-secondary text-[13px] leading-snug mb-4">{g.note}</p>
          )}
          <div className="flex flex-wrap gap-2">
            {g.items.map((it) => (
              <span
                key={it}
                className="font-mono text-secondary text-[12px] px-3 py-1 rounded-full bg-primary border border-line"
              >
                {it}
              </span>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  </>
);

export default SectionWrapper(Tech, "stack");
