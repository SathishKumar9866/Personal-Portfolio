import { Tilt } from "react-tilt";
import { motion } from "framer-motion";
import { styles } from "../styles";
import { services, profile } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";
import { SectionWrapper } from "../hoc";
import Availability from "./Availability";

const ServiceCard = ({ index, title, desc }) => (
  <Tilt className="w-full h-full" options={{ max: 8, scale: 1, speed: 450 }}>
    <motion.div
      variants={fadeIn("right", "spring", index * 0.2, 0.6)}
      className="w-full h-full rounded-2xl glass-card hover:border-accent/40 transition-colors"
    >
      <div className="rounded-2xl py-6 px-5 flex flex-col gap-3 h-full">
        <span className="font-mono text-[13px] text-accent-ink">
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

/* Portrait slot. Holds its shape whether or not the image exists yet, so
   dropping a file in later changes nothing about the layout. */
const Portrait = () => (
  <div className="w-full aspect-[4/5] rounded-2xl border border-line bg-tertiary overflow-hidden">
    {profile.photo ? (
      <img
        src={profile.photo}
        alt={profile.alt}
        className="w-full h-full object-cover"
        loading="lazy"
      />
    ) : (
      <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-faint">
        <span className="font-display text-[34px] leading-none text-line">S</span>
        <span className="font-mono text-[10px] uppercase tracking-label">
          portrait — to come
        </span>
      </div>
    )}
  </div>
);

const About = () => (
  <>
    <motion.div variants={textVariant()}>
      <p className={styles.sectionSubText}>Introduction</p>
      <h2 className={styles.sectionHeadText}>Overview.</h2>
    </motion.div>

    {/* Portrait in its own column; the bio and the status block share the
        second, so the status no longer drops below the portrait and leaves a
        step of dead space beside it. */}
    <div className="mt-8 grid gap-8 sm:gap-10 md:grid-cols-[minmax(0,220px)_minmax(0,1fr)] md:items-start">
      <motion.div variants={fadeIn("right", "spring", 0.1, 0.7)} className="max-w-[220px]">
        <Portrait />
      </motion.div>

      {/* motion.div, not div: framer propagates variants only through motion
          components, so a plain wrapper here leaves the children stuck in the
          `hidden` variant at opacity 0 — the same failure that hid Work. */}
      <motion.div className="flex flex-col gap-7">
        <motion.p
          variants={fadeIn("", "", 0.1, 1)}
          className="font-serif text-secondary text-[17px] max-w-[32rem] leading-[1.7]"
        >
          I work across the full data-to-AI stack and care about the problem more
          than the title. The work tends to run offline, ground its answers in real
          sources, and be easy to try in a minute, because that is what makes it
          worth building. Calm, disciplined, focused on what I can control.
        </motion.p>

        <motion.div variants={fadeIn("up", "spring", 0.2, 0.7)} className="max-w-[32rem]">
          <Availability />
        </motion.div>
      </motion.div>
    </div>

    <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 max-w-5xl">
      {services.map((s, i) => (
        <ServiceCard key={s.title} index={i} title={s.title} desc={s.desc} />
      ))}
    </div>
  </>
);

export default SectionWrapper(About, "about");
