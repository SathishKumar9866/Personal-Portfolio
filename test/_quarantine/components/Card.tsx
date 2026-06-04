import { twMerge } from "tailwind-merge";
import { ComponentPropsWithoutRef } from "react";

export const Card = ({
  className,
  children,
  ...other
}: ComponentPropsWithoutRef<"div">) => {
  return (
    <div
      className={twMerge(
        "bg-panel border border-line rounded-lg p-6 transition-colors",
        className
      )}
      {...other}
    >
      {children}
    </div>
  );
};
