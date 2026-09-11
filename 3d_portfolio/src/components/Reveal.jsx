import { motion } from "framer-motion";

/**
 * Owns, the one scroll-reveal used across the page.
 * Does not own: section-level staggering: SectionWrapper already does that.
 *
 * One primitive instead of a `fadeIn(direction, type, delay, duration)` call
 * written differently at every site. The amount is "some" (threshold 0) on
 * purpose: a numeric threshold cannot be satisfied by an element taller than the
 * viewport, which is what left the whole Work section invisible on phones.
 *
 * MotionConfig reducedMotion="user" at the root neutralises the transform for
 * anyone who has asked for less motion; the content still arrives, it simply
 * arrives without travelling.
 */
const EASE = [0.22, 0.61, 0.36, 1];

const Reveal = ({
  children,
  delay = 0,
  y = 18,
  as = "div",
  className = "",
  ...rest
}) => {
  const Tag = motion[as] ?? motion.div;
  return (
    <Tag
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: "some", margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.55, delay, ease: EASE }}
      className={className}
      {...rest}
    >
      {children}
    </Tag>
  );
};

export default Reveal;
