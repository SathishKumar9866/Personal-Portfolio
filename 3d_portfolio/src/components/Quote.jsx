import { motion } from "framer-motion";

// editorial interstitial pull-quote between sections
const Quote = ({ text, author, align = "left" }) => (
  <motion.figure
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.5 }}
    transition={{ duration: 0.6, ease: [0.2, 0.65, 0.3, 0.9] }}
    className="sm:px-16 px-6 py-14 sm:py-20"
  >
    <div className={`max-w-7xl mx-auto ${align === "right" ? "flex justify-end text-right" : ""}`}>
      <div className="max-w-3xl">
        <span className="block font-display font-bold text-accent text-[42px] leading-none">“</span>
        <blockquote className="mt-1 font-display font-semibold text-white-100 tracking-[-0.01em] leading-[1.15] text-[clamp(1.4rem,3.2vw,2.4rem)]">
          {text}
        </blockquote>
        <figcaption className={`mt-5 font-mono text-[12px] uppercase tracking-label text-accent ${align === "right" ? "" : ""}`}>
          — {author}
        </figcaption>
      </div>
    </div>
  </motion.figure>
);

export default Quote;
