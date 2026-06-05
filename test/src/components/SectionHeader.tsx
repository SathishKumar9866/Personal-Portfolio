import { ReactNode } from "react";
import { RuleLine } from "@/components/ui/RuleLine";

export const SectionHeader = ({
  title,
  eyebrow,
  description,
  icon,
}: {
  title: string;
  eyebrow: string;
  description?: string;
  icon?: ReactNode;
}) => {
  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3">
        {icon ? (
          <span className="text-accent [&_svg]:size-4" aria-hidden="true">
            {icon}
          </span>
        ) : null}
        <p className="eyebrow whitespace-nowrap">{eyebrow}</p>
        <RuleLine />
      </div>
      <h2 className="mt-4 text-[clamp(1.75rem,3vw,2.25rem)] font-semibold tracking-tight">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 text-base leading-relaxed text-muted md:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
};
