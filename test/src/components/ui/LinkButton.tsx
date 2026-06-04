import { ComponentPropsWithoutRef } from "react";
import { twMerge } from "tailwind-merge";

type Variant = "primary" | "outline";

// Subtle motion: lifts on hover, and any trailing icon slides a touch.
const base =
  "group/btn inline-flex items-center justify-center gap-2 h-11 px-5 rounded-md font-medium " +
  "transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 " +
  "[&_svg]:transition-transform [&_svg]:duration-200 hover:[&_svg]:translate-x-0.5";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-canvas hover:opacity-90 hover:shadow-lg hover:shadow-accent/20",
  outline: "border border-line text-fg hover:border-accent hover:text-accent",
};

type LinkButtonProps = ComponentPropsWithoutRef<"a"> & {
  variant?: Variant;
  external?: boolean;
};

export const LinkButton = ({
  variant = "primary",
  external = false,
  className,
  children,
  ...rest
}: LinkButtonProps) => {
  return (
    <a
      className={twMerge(base, variants[variant], className)}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...rest}
    >
      {children}
    </a>
  );
};
