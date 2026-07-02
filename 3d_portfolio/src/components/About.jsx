import { Tilt } from "react-tilt";
import { motion } from "framer-motion";
import { styles } from "../styles";
import { services } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";
import { SectionWrapper } from "../hoc";

const ServiceCard = ({ index, title }) => (
  <Tilt className="xs:w-[250px] w-full" options={{ max: 35, scale: 1, speed: 450 }}>
    <motion.div
      variants={fadeIn("right", "spring", index * 0.3, 0.75)}
      className="w-full green-pink-gradient p-[1px] rounded-[20px] shadow-card"
    >
      <div className="bg-tertiary rounded-[20px] py-8 px-6 min-h-[160px] flex justify-center items-center flex-col">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-mauve to-blue text-primary font-black flex items-center justify-center mb-4">
          {String(index + 1).padStart(2, "0")}
        </div>
        <h3 className="text-white-100 text-[18px] font-bold text-center">
          {title}
        </h3>
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
      className="mt-4 text-secondary text-[17px] max-w-3xl leading-[30px]"
    >
      I work across the full data-to-AI stack and care about the problem more
      than the title. The work tends to run offline, ground its answers in real
      sources, and be easy to try in a minute, because that is what makes it
      worth building. Calm, disciplined, focused on what I can control.
    </motion.p>

    <div className="mt-20 flex flex-wrap gap-10">
      {services.map((s, i) => (
        <ServiceCard key={s.title} index={i} title={s.title} />
      ))}
    </div>
  </>
);

export default SectionWrapper(About, "about");
