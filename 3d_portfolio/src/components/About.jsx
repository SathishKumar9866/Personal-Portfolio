import { Tilt } from "react-tilt";
import { motion } from "framer-motion";
import { styles } from "../styles";
import { services } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";
import { SectionWrapper } from "../hoc";

const ServiceCard = ({ index, title, desc }) => (
  <Tilt className="w-full h-full" options={{ max: 8, scale: 1, speed: 450 }}>
    <motion.div
      variants={fadeIn("right", "spring", index * 0.2, 0.6)}
      className="w-full h-full rounded-2xl border border-line bg-tertiary shadow-card hover:border-accent/40 transition-colors"
    >
      <div className="rounded-2xl py-6 px-5 flex flex-col gap-3 h-full">
        <span className="font-mono text-[13px] text-accent">
          {String(index + 1).padStart(2, "0")}
        </span>
        <h3 className="font-display text-white-100 text-[19px] leading-tight">
          {title}
        </h3>
        <p className="font-sans text-secondary text-[14px] leading-[1.5]">{desc}</p>
      </div>
    </motion.div>
  </Tilt>
);

const About = () => (
  <>
    <motion.div variants={textVariant()}>
      <p className={styles.sectionSubText}>Introduction</p>
      <h2 className={styles.sectionHeadText}>Overview.</h2>
    </motion.div>

    <motion.p
      variants={fadeIn("", "", 0.1, 1)}
      className="mt-4 font-serif text-secondary text-[17px] max-w-2xl leading-[1.6]"
    >
      I work across the full data-to-AI stack and care about the problem more
      than the title. The work tends to run offline, ground its answers in real
      sources, and be easy to try in a minute, because that is what makes it
      worth building. Calm, disciplined, focused on what I can control.
    </motion.p>

    <div className="mt-16 grid grid-cols-2 gap-3 sm:gap-6 max-w-3xl">
      {services.map((s, i) => (
        <ServiceCard key={s.title} index={i} title={s.title} desc={s.desc} />
      ))}
    </div>
  </>
);

export default SectionWrapper(About, "about");
