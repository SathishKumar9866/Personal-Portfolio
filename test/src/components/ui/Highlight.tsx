import { ReactNode } from "react";

/**
 * Subtle accent emphasis for the highest-signal phrases a recruiter scans for
 * (years of experience, "production", key stack). Quiet by design - an accent
 * underline + slightly stronger text, not a loud marker - so it guides the eye
 * without looking gimmicky.
 */
export const Highlight = ({ children }: { children: ReactNode }) => (
  <span className="rounded font-medium text-fg underline decoration-accent/50 decoration-2 underline-offset-2 transition-colors duration-200 hover:bg-accent/10 hover:text-accent hover:decoration-accent">
    {children}
  </span>
);
