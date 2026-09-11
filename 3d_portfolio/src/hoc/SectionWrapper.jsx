import { motion } from "framer-motion";
import { styles } from "../styles";
import { staggerContainer } from "../utils/motion";

const SectionWrapper = (Component, idName) =>
  function HOC() {
    return (
      <motion.section
        variants={staggerContainer()}
        initial="hidden"
        whileInView="show"
        // `amount` is a raw IntersectionObserver threshold, and intersectionRatio
        // is capped at viewportHeight/elementHeight. Projects is ~3800px tall, so
        // on a 844px phone the ratio maxes at 0.22 and a 0.25 threshold NEVER
        // fires — the whole section stayed at opacity 0. "some" is threshold 0.
        viewport={{ once: true, amount: "some" }}
        className={`${styles.padding} max-w-7xl mx-auto relative z-0 isolate`}
      >
        <span className="hash-span" id={idName}>
          &nbsp;
        </span>
        <Component />
      </motion.section>
    );
  };

export default SectionWrapper;
