import { Wrench } from "lucide-react";
import { Section } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { TechStack } from "@/components/ui/TechStack";
import { skills } from "@/data/resume";

export const SkillsSection = () => {
  return (
    <Section
      id="skills"
      eyebrow="03 / Toolbox"
      title="Skills & Tools"
      description="What I reach for to take a model from a notebook to production."
      icon={<Wrench />}
    >
      <div className="mt-12 columns-1 gap-x-10 sm:columns-2 lg:columns-3">
        {skills.map((group, i) => (
          <Reveal
            as="div"
            key={group.category}
            delay={i * 0.05}
            className="mb-8 break-inside-avoid"
          >
            <h3 className="font-mono text-xs uppercase tracking-widest text-accent">
              {group.category}
            </h3>
            <div className="mt-3">
              <TechStack items={group.items} />
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
};
