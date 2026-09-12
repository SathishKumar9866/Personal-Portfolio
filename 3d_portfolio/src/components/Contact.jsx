/**
 * Owns, the closing section, the invitation on the left, every way to reach him
 * on the right.
 * Does not own, the addresses (constants/index.js) or the glyphs (icons.js).
 *
 * There is deliberately no form. A form asks a stranger to type into a box and
 * trust it went somewhere; a copyable address and a mail link do the same job
 * with nothing to fail silently.
 *
 * Every destination shows its URL as READABLE TEXT, not just an icon. A visitor
 * may want to write it down, check where a link goes before following it, or
 * reach him when the target site will not load for them. An icon answers none
 * of those.
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { styles } from "../styles";
import { contact } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";
import { SectionWrapper } from "../hoc";
import { ICON_PATHS, socialLinks } from "./icons";
import Reveal from "./Reveal";

/** github.com/x, the address without the protocol noise. `www.` goes too: it
 *  is four characters of nothing that made the LinkedIn address 317px wide and
 *  pushed the single-row layout past what the card can hold. */
const readable = (href) =>
  href.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

const Glyph = ({ name }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    className="shrink-0"
  >
    <path d={ICON_PATHS[name]} />
  </svg>
);

const CopyButton = ({ value, label }) => {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      window.location.href = `mailto:${contact.email}`;
    }
  };
  return (
    <>
      <button
        onClick={copy}
        aria-label={`Copy ${label}`}
        className={`contact-copy inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-2.5 min-h-11 sm:min-h-9 font-mono text-chip transition-colors ${
          copied
            ? "border-live text-live"
            : "border-line-strong text-secondary hover:border-accent hover:text-accent-ink"
        }`}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          {copied ? (
            <polyline points="20 6 9 17 4 12" />
          ) : (
            <>
              <rect x="9" y="9" width="13" height="13" rx="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </>
          )}
        </svg>
        {copied ? "Copied" : "Copy"}
      </button>
      <span aria-live="polite" className="sr-only">
        {copied ? `${label} copied to clipboard` : ""}
      </span>
    </>
  );
};

const Row = ({ k, label, href }) => {
  const isEmail = k === "email";
  const value = isEmail ? contact.email : readable(href);
  return (
    // Layout lives in index.css, `.contact-row`, because the deciding width is
    // the card's and not the viewport's: it is widest below lg and narrowest
    // just after. A container query splits one row into two lines — label and
    // Copy, then the address across the full width — whenever the row cannot
    // hold all three without breaking an address mid-domain.
    <li className="contact-row py-3 border-b border-line last:border-b-0">
      <span className="contact-label flex items-center gap-2 shrink-0 font-mono text-label uppercase tracking-label text-faint">
        <Glyph name={k} />
        {label}
      </span>

      {/* The address is readable on its own; the link is on top of it, not
          instead of it. External targets open in a new tab so the portfolio
          stays put: see README, "Links". */}
      <a
        href={href}
        target={isEmail ? undefined : "_blank"}
        rel={isEmail ? undefined : "noreferrer"}
        className="contact-addr min-w-0 inline-flex items-center min-h-11 sm:min-h-0 break-all font-mono text-data text-white-100 hover:text-accent-ink transition-colors"
      >
        {value}
        {!isEmail && <span className="text-faint"> ↗</span>}
      </a>

      <CopyButton value={isEmail ? contact.email : href} label={label} />
    </li>
  );
};

const Contact = () => (
  <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-14 lg:items-start">
    <div>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>Get in touch</p>
        <h2 className={styles.sectionHeadText}>Contact.</h2>
      </motion.div>

      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        className="mt-4 font-serif text-secondary text-lede leading-[1.7] max-w-[32rem]"
      >
        Open to data engineering, data science, ML, and AI engineering roles,
        across any domain. If something here is useful to you, reach out.
      </motion.p>

      <motion.p
        variants={fadeIn("", "", 0.15, 1)}
        className="mt-4 font-mono text-chip text-faint"
      >
        {contact.timezone} · usually replies within a day
      </motion.p>
    </div>

    {/* A y-only reveal, not fadeIn("left"). That variant parks the element at
        x: +100 until the section scrolls into view, and this card runs to the
        right edge of the content column: measured at a 700px viewport it sat at
        left 164 inside a cell at left 64 and pushed the document to 721px, so
        the page carried a horizontal scrollbar until the reader reached
        Contact. Clipping it with overflow-x on an ancestor would have hidden
        the symptom and broken the sticky diagram in Experience, because an
        overflow container is also a scroll container and sticky stops working
        inside one. */}
    <Reveal delay={0.15} className="rounded-2xl glass-card p-5 sm:p-7">
      <p className="font-mono text-label uppercase tracking-label text-faint">
        Every way to reach me
      </p>
      <ul className="contact-rows mt-3 list-none">
        {socialLinks().map((l) => (
          <Row key={l.k} k={l.k} label={l.label} href={l.href} />
        ))}
      </ul>
    </Reveal>
  </div>
);

export default SectionWrapper(Contact, "contact");
