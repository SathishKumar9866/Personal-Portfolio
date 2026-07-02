import { motion } from "framer-motion";
import { styles } from "../styles";
import { ComputersCanvas } from "./canvas";

const Hero = () => (
  <section className="relative w-full h-screen mx-auto">
    <div
      className={`${styles.paddingX} absolute inset-0 top-[120px] max-w-7xl mx-auto flex flex-row items-start gap-5 z-10`}
    >
      <div className="flex flex-col justify-center items-center mt-5">
        <div className="w-5 h-5 rounded-full bg-mauve" />
        <div className="w-1 sm:h-80 h-40 violet-gradient" />
      </div>

      <div>
        <p className={`${styles.sectionSubText} text-mauve`}>
          Data to AI, end to end
        </p>
        <h1 className={styles.heroHeadText}>
          Hi, I&apos;m <span className="text-mauve">Sathish</span>
        </h1>
        <p className={`${styles.heroSubText} mt-2 max-w-xl`}>
          I take a real problem from the data and the model to a working
          interface, and ship something a person can actually use.
        </p>
      </div>
    </div>

    <ComputersCanvas />

    <div className="absolute xs:bottom-10 bottom-32 w-full flex justify-center items-center z-10">
      <a href="#about">
        <div className="w-[35px] h-[64px] rounded-3xl border-4 border-secondary flex justify-center items-start p-2">
          <motion.div
            animate={{ y: [0, 24, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop" }}
            className="w-3 h-3 rounded-full bg-secondary mb-1"
          />
        </div>
      </a>
    </div>
  </section>
);

export default Hero;
