/**
 * Owns, the closing rule under the page, colophon only.
 * Does not own: navigation or contact links. Both sit above it and repeating
 * them here was the duplication this footer used to be made of.
 */
import LiveClock from "./LiveClock";

// One date convention across the site: "Month YYYY", the same shape the
// Experience timeline prints. The old "2026.09" was the only place using
// YYYY.MM, which made it the odd one out on its own page.
const STARTED = "August 2024";
const THIS_VERSION = "September 2026";

const Footer = () => (
  <footer className="relative z-10 border-t border-line bg-primary">
    <div className="max-w-7xl mx-auto px-6 sm:px-16 pt-5 pb-20 sm:py-5 sm:pr-24 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between font-mono text-label text-faint">
      <span className="flex flex-wrap items-center gap-x-2">
        © {new Date().getFullYear()} Sathish Kumar <span className="text-faint">·</span> <LiveClock />
      </span>
      <span className="flex flex-wrap items-center gap-x-2">
        <span>Type: Barlow · Newsreader · JetBrains Mono</span>
        <span aria-hidden="true">·</span>
        <span className="text-secondary">
          Started {STARTED}, this version {THIS_VERSION}
        </span>
      </span>
    </div>
  </footer>
);

export default Footer;
