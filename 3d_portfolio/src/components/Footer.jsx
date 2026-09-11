import { navLinks } from "../constants";
import LiveClock from "./LiveClock";

const BUILD = "2026.07";

const Footer = () => (
  <footer className="relative z-10 border-t border-line bg-primary">
    <div className="max-w-7xl mx-auto px-6 sm:px-16 py-14 grid gap-10 sm:grid-cols-[2fr_1fr]">
      <div>
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-md bg-accent flex items-center justify-center text-white font-display font-bold text-[15px]">
            S
          </span>
          <span className="font-mono text-[14px] text-white-100">sathish · ml/ai engineer</span>
        </div>
        <p className="mt-4 font-serif text-secondary text-[14px] leading-[1.6] max-w-xs">
          Data to AI, end to end. Built and maintained by hand.
        </p>
      </div>

      <nav aria-label="Footer">
        <p className="font-mono text-[11px] uppercase tracking-label text-faint mb-3">Sections</p>
        <ul className="flex flex-col gap-2">
          {navLinks.map((n) => (
            <li key={n.id}>
              <a href={`#${n.id}`} className="font-mono text-[13px] text-secondary hover:text-accent transition-colors">
                {n.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>

    <div className="border-t border-line">
      <div className="max-w-7xl mx-auto px-6 sm:px-16 py-5 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between font-mono text-[11px] text-faint">
        <span className="flex flex-wrap items-center gap-x-2">
          © 2026 Sathish Kumar <span className="text-line">·</span> <LiveClock />
        </span>
        <span>
          Type: Bricolage Grotesque · Newsreader · JetBrains Mono ·{" "}
          <span className="text-secondary">build {BUILD}</span>
        </span>
      </div>
    </div>
  </footer>
);

export default Footer;
