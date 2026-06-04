import { Cloud, Hexagon } from "lucide-react";
import { getTechIcon, getCloudColor } from "@/data/techIcons";
import { getTechInfo } from "@/data/techInfo";

/**
 * Visual tech-stack row - each technology rendered as a chip with its brand
 * logo (when available) so recruiters can scan the stack at a glance instead
 * of reading text. AWS/Azure (no licensable logo) get a brand-colored cloud
 * glyph; anything else gets a neutral glyph so every item carries an image.
 *
 * Hovering a chip shows a styled, instant tooltip with a one-line description
 * (CSS group-hover - avoids the native `title` delay).
 */
export const TechStack = ({ items }: { items: string[] }) => (
  <ul className="flex flex-wrap gap-2">
    {items.map((item) => {
      const icon = getTechIcon(item);
      const cloud = icon ? null : getCloudColor(item);
      const info = getTechInfo(item);
      return (
        <li
          key={item}
          className="group/chip relative inline-flex items-center gap-1.5 rounded-md border border-line bg-canvas px-2 py-1 font-mono text-xs text-muted transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/60 hover:text-fg"
        >
          {icon ? (
            <svg
              role="img"
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="size-3.5 shrink-0"
              fill={`#${icon.hex}`}
            >
              <path d={icon.path} />
            </svg>
          ) : cloud ? (
            <Cloud
              className="size-3.5 shrink-0"
              style={{ color: cloud }}
              aria-hidden="true"
            />
          ) : (
            <Hexagon
              className="size-3.5 shrink-0 text-muted/70"
              aria-hidden="true"
            />
          )}
          {item}
          {info ? (
            <span
              role="tooltip"
              className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 hidden w-52 -translate-x-1/2 rounded-md border border-line bg-panel px-2.5 py-1.5 font-sans text-[11px] leading-snug text-fg shadow-lg group-hover/chip:block"
            >
              {info}
            </span>
          ) : null}
        </li>
      );
    })}
  </ul>
);
