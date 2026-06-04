import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { SectionHeader } from "@/components/SectionHeader";
import { Reveal } from "@/components/Reveal";

type SectionProps = {
  id: string;
  eyebrow: string;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
};

/** Standard section shell: anchor + container + animated header. */
export const Section = ({
  id,
  eyebrow,
  title,
  description,
  children,
  className,
  icon,
}: SectionProps) => {
  return (
    <section className={twMerge("py-16 lg:py-20", className)}>
      <div className="container">
        {/* Anchor sits on the heading so nav jumps land on the title, not empty padding. */}
        <div id={id} className="scroll-anchor">
          <Reveal>
            <SectionHeader
              eyebrow={eyebrow}
              title={title}
              description={description}
              icon={icon}
            />
          </Reveal>
        </div>
        {children}
      </div>
    </section>
  );
};
