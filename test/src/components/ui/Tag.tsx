import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

/** Mono tech/stack tag. */
export const Tag = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => <span className={twMerge("chip", className)}>{children}</span>;

/** Accent-outlined metric chip (real numbers only). */
export const MetricTag = ({ children }: { children: ReactNode }) => (
  <span className="rounded-md border border-accent/30 px-2 py-1 font-mono text-xs text-accent">
    {children}
  </span>
);
