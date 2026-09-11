/**
 * Owns: the closing section — one invitation, one address, one icon row.
 * Does not own: the addresses (constants/index.js) or the icon marks
 * (SocialIcons.jsx).
 *
 * There is deliberately no form. A form asks a stranger to type into a box and
 * trust it went somewhere; a copyable address and a mail link do the same job
 * with nothing to fail silently.
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { styles } from "../styles";
import { contact } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";
import { SectionWrapper } from "../hoc";
import SocialIcons from "./SocialIcons";

const Contact = () => {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contact.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      window.location.href = `mailto:${contact.email}`;
    }
  };

  return (
    <div className="max-w-3xl">
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>Get in touch</p>
        <h2 className={styles.sectionHeadText}>Contact.</h2>
      </motion.div>

      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        className="mt-4 font-serif text-secondary text-[17px] leading-[1.7] max-w-[32rem]"
      >
        Open to data engineering, data science, ML, and AI engineering roles,
        across any domain. If something here is useful to you, reach out.
      </motion.p>

      <motion.div
        variants={fadeIn("up", "spring", 0.2, 0.7)}
        className="mt-10 rounded-2xl border border-line bg-tertiary p-6 sm:p-8"
      >
        <p className="font-mono text-[11px] uppercase tracking-label text-faint">
          Email
        </p>

        <button
          onClick={copyEmail}
          className="group mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-left"
        >
          <span className="font-display font-bold text-white-100 text-[clamp(1.2rem,3vw,1.9rem)] tracking-[-0.01em] border-b border-line group-hover:border-accent group-hover:text-accent transition-colors">
            {contact.email}
          </span>
          <span className="font-mono text-[11px] text-faint group-hover:text-accent transition-colors">
            {copied ? "copied ✓" : "click to copy"}
          </span>
        </button>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-6">
          <SocialIcons />
          <p className="font-mono text-[11px] text-faint">{contact.timezone}</p>
        </div>
      </motion.div>
    </div>
  );
};

export default SectionWrapper(Contact, "contact");
