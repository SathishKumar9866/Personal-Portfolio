import { motion } from "framer-motion";
import { styles } from "../styles";
import { textVariant } from "../utils/motion";

/**
 * Owns, how a section announces itself.
 * Does not own: what any section says. Each one passes its own `meta`, computed
 * from its own data, because a number belongs next to the thing it counts.
 *
 * ## Why this exists
 *
 * Five sections opened identically: a mono eyebrow, then the section name with
 * a full stop after it. "WHERE I'VE WORKED / Experience.", "SELECTED WORK /
 * Projects.", "GET IN TOUCH / Contact." Two things were wrong with that.
 *
 * **The eyebrow carried no information.** "Selected work" above "Projects"
 * tells a reader nothing the nav did not already tell them, so five times on
 * the way down the page they read a line that costs attention and returns
 * nothing.
 *
 * **Uniform openings read as generated.** When every section announces itself
 * with the same two-line shape and the same trailing full stop, the page reads
 * as filled-in rather than written, whatever the quality of what follows.
 *
 * So the eyebrow now carries a fact, and the facts are derived, never typed:
 * four roles because `experience` has four, thirty-three tools because that is
 * the size of the set. They cannot go stale, and they are the kind of claim
 * this page is otherwise built on — the hero promises evidence, and this is the
 * cheapest possible instance of it. The shapes differ from each other because
 * the numbers do.
 *
 * The full stop is gone. A one-word heading with a period after it is a house
 * style borrowed from a hundred agency templates; without it the heading is
 * just the heading.
 *
 * `meta` is optional, and About deliberately passes none: the first section
 * sets no pattern for the others to repeat, and there is no honest number to
 * put over an introduction.
 */
const SectionHead = ({ title, meta }) => (
  <motion.div variants={textVariant()}>
    {meta && <p className={styles.sectionSubText}>{meta}</p>}
    <h2 className={styles.sectionHeadText}>{title}</h2>
  </motion.div>
);

export default SectionHead;
