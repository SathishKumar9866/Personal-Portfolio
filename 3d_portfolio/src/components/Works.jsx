import { Tilt } from "react-tilt";
import { motion } from "framer-motion";
import { styles } from "../styles";
import { projects } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";
import { SectionWrapper } from "../hoc";

const ProjectCard = ({
  index,
  name,
  description,
  tags,
  gradient,
  source_code_link,
  live_link,
}) => (
  <motion.div variants={fadeIn("up", "spring", index * 0.2, 0.75)}>
    <Tilt
      options={{ max: 25, scale: 1, speed: 400 }}
      className="bg-tertiary p-5 rounded-2xl sm:w-[360px] w-full shadow-card"
    >
      <div
        className={`relative w-full h-[180px] rounded-2xl bg-gradient-to-br ${gradient} flex items-end p-4`}
      >
        <span className="text-primary font-black text-[20px] break-words leading-tight">
          {name}
        </span>
      </div>

      <div className="mt-5">
        <p className="text-secondary text-[14px] leading-[22px]">
          {description}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {tags.map((t) => (
          <span key={t.name} className={`text-[13px] ${t.color}`}>
            #{t.name}
          </span>
        ))}
      </div>

      <div className="mt-5 flex gap-4 text-[13px]">
        <a
          href={source_code_link}
          target="_blank"
          rel="noreferrer"
          className="text-blue hover:underline"
        >
          repo
        </a>
        {live_link && (
          <a
            href={live_link}
            target="_blank"
            rel="noreferrer"
            className="text-green hover:underline"
          >
            live site
          </a>
        )}
      </div>
    </Tilt>
  </motion.div>
);

const Works = () => (
  <>
    <motion.div variants={textVariant()}>
      <p className={styles.sectionSubText}>My work</p>
      <h2 className={styles.sectionHeadText}>Projects.</h2>
    </motion.div>

    <div className="w-full flex">
      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        className="mt-3 text-secondary text-[17px] max-w-3xl leading-[30px]"
      >
        Six projects across RAG, computer vision, and shipped products. Each
        links to its source, and one is live.
      </motion.p>
    </div>

    <div className="mt-20 flex flex-wrap gap-7">
      {projects.map((p, i) => (
        <ProjectCard key={p.name} index={i} {...p} />
      ))}
    </div>
  </>
);

export default SectionWrapper(Works, "work");
