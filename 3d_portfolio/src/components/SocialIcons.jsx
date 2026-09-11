/**
 * Owns: the clickable icon row inside the Contact section.
 * Does not own: the glyphs or the addresses — both live in icons.js.
 */
import { ICON_PATHS, socialLinks } from "./icons";

const SocialIcons = ({ size = 20, className = "" }) => (
  <ul className={`flex items-center gap-3 list-none ${className}`}>
    {socialLinks().map((l) => (
      <li key={l.k}>
        <a
          href={l.href}
          target={l.k === "email" ? undefined : "_blank"}
          rel="noreferrer"
          aria-label={l.label}
          title={l.label}
          className="flex items-center justify-center rounded-lg border border-line-strong p-2.5 text-secondary hover:text-accent hover:border-accent transition-colors"
        >
          <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d={ICON_PATHS[l.k]} />
          </svg>
        </a>
      </li>
    ))}
  </ul>
);

export default SocialIcons;
