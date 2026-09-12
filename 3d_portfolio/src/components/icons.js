/**
 * Owns, the brand glyph paths and the one list of off-site destinations.
 * Does not own: how they are laid out: SocialIcons draws the row in the
 * Contact section, ContactRail draws the left-edge dock. Both read from here so a
 * changed address or a new profile is edited once.
 *
 * Inline SVG rather than an icon package: four marks, and brand paths do not
 * change.
 */
import { contact } from "../constants";

export const ICON_PATHS = {
  github:
    "M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.08 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 016 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.62-5.49 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12.01 12.01 0 0024 12.5C24 5.87 18.63.5 12 .5z",
  linkedin:
    "M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 110-4.13 2.06 2.06 0 010 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z",
  substack:
    "M22.54 8.24H1.46V5.41h21.08v2.83zM1.46 10.81V24L12 18.11 22.54 24V10.81H1.46zM22.54 0H1.46v2.84h21.08V0z",
  email:
    "M2 5a2 2 0 012-2h16a2 2 0 012 2v14a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm2 .9v.3l8 5 8-5v-.3H4zm16 2.66l-7.47 4.67a1 1 0 01-1.06 0L4 8.56V19h16V8.56z",
};

// Ordered as a reader scans: code, network, writing, then the direct line.
// An entry with no href is dropped rather than shipped as a dead link.
export const socialLinks = () =>
  [
    { k: "github", label: "GitHub", href: `https://github.com/${contact.github}` },
    { k: "linkedin", label: "LinkedIn", href: `https://www.linkedin.com/${contact.linkedin}` },
    { k: "substack", label: "Substack", href: contact.substack },
    { k: "email", label: "Email", href: `mailto:${contact.email}` },
  ].filter((l) => l.href);
