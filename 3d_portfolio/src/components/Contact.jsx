import { motion } from "framer-motion";
import { styles } from "../styles";
import { fadeIn, textVariant } from "../utils/motion";
import { SectionWrapper } from "../hoc";

const links = [
  {
    k: "email",
    v: "sathishkumar786.ml@gmail.com",
    href: "mailto:sathishkumar786.ml@gmail.com",
  },
  {
    k: "linkedin",
    v: "in/SathishKumarAI",
    href: "https://www.linkedin.com/in/SathishKumarAI",
  },
  { k: "github", v: "SathishKumarAI", href: "https://github.com/SathishKumarAI" },
];

const Contact = () => (
  <div className="max-w-3xl">
    <motion.div variants={textVariant()}>
      <p className={styles.sectionSubText}>Get in touch</p>
      <h2 className={styles.sectionHeadText}>Contact.</h2>
    </motion.div>

    <motion.p
      variants={fadeIn("", "", 0.1, 1)}
      className="mt-4 text-secondary text-[17px] leading-[30px]"
    >
      Open to data engineering, data science, ML, and AI engineering roles, and
      to any domain. If something here is useful to you, reach out.
    </motion.p>

    <motion.div
      variants={fadeIn("up", "spring", 0.2, 0.8)}
      className="mt-10 flex flex-col gap-4"
    >
      {links.map((l) => (
        <a
          key={l.k}
          href={l.href}
          target="_blank"
          rel="noreferrer"
          className="group flex items-center gap-3 text-white-100 text-[18px]"
        >
          <span className="font-mono text-[13px] text-secondary w-20">
            {l.k}
          </span>
          <span className="group-hover:text-mauve transition-colors border-b border-surface group-hover:border-mauve pb-1">
            {l.v}
          </span>
        </a>
      ))}
    </motion.div>
  </div>
);

export default SectionWrapper(Contact, "contact");
