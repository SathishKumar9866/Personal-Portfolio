/**
 * Owns, the closing rule under the page, colophon only.
 * Does not own: navigation or contact links. Both sit above it and repeating
 * them here was the duplication this footer used to be made of.
 */
import LiveClock from "./LiveClock";

const BUILD = "2026.09";

const Footer = () => (
  <footer className="relative z-10 border-t border-line bg-primary">
    <div className="max-w-7xl mx-auto px-6 sm:px-16 pt-5 pb-20 sm:py-5 sm:pr-24 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between font-mono text-[11px] text-faint">
      <span className="flex flex-wrap items-center gap-x-2">
        © {new Date().getFullYear()} Sathish Kumar <span className="text-line">·</span> <LiveClock />
      </span>
      <span>
        Type: Barlow · Newsreader · JetBrains Mono ·{" "}
        <span className="text-secondary">build {BUILD}</span>
      </span>
    </div>
  </footer>
);

export default Footer;
