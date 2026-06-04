import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

/**
 * Shared "terminal window" chrome - rounded panel, three traffic-light dots
 * and a mono title bar. Used by CodeCard (`sathish.py`) and FileTree
 * (`~/sathish-kumar`) so the window styling lives in one place.
 */
export const TerminalCard = ({
  title,
  className,
  children,
}: {
  title: string;
  className?: string;
  children: ReactNode;
}) => {
  return (
    <div
      className={twMerge(
        "min-w-0 overflow-hidden rounded-lg border border-line",
        className
      )}
    >
      <div className="flex items-center gap-1.5 border-b border-line px-4 py-2.5">
        <span className="size-3 rounded-full bg-[#ff5f56]" />
        <span className="size-3 rounded-full bg-[#ffbd2e]" />
        <span className="size-3 rounded-full bg-[#27c93f]" />
        <span className="ml-2 font-mono text-xs text-muted">{title}</span>
      </div>
      {children}
    </div>
  );
};
