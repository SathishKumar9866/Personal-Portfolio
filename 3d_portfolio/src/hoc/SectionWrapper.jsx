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
        // fires, the whole section stayed at opacity 0. "some" is threshold 0.
        viewport={{ once: true, amount: "some" }}
        /**
         * The GROUND is full-bleed, the CONTENT is not.
         *
         * `max-w-7xl mx-auto` used to sit on the <section> itself, which meant
         * a section could never paint a background wider than its text. Scenes
         * need the opposite: the colour runs edge to edge and the measure stays
         * where it was. So the section is now the stage and the div inside it is
         * the page.
         *
         * Which scenes are tinted is decided in `index.css` by
         * `main > section:nth-of-type(odd)`, not here — alternation is a
         * property of the sequence, and a component that had to be told its own
         * index would be wrong the moment a section moved.
         */
        className={`scene ${styles.paddingX} py-[clamp(4rem,9vw,8rem)] relative z-0 isolate`}
      >
        <span className="hash-span" id={idName}>
          &nbsp;
        </span>
        <div className="max-w-7xl mx-auto">
          <Component />
        </div>
      </motion.section>
    );
  };

export default SectionWrapper;
