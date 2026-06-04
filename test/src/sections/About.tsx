import { UserRound } from "lucide-react";
import { Section } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { CodeCard } from "@/components/CodeCard";
import { Highlight } from "@/components/ui/Highlight";
import { profile } from "@/data/resume";

const facts = [
  { label: "role", value: "ML Engineer · MLOps · GenAI" },
  { label: "experience", value: "6 yrs in production AI" },
  { label: "education", value: "M.S. CS, SIU" },
  { label: "location", value: profile.location },
  // Only shows up once profile.workAuthorization is filled in.
  ...(profile.workAuthorization
    ? [{ label: "work auth", value: profile.workAuthorization }]
    : []),
];

export const AboutSection = () => {
  return (
    <Section
      id="about"
      eyebrow="04 / About"
      title="A bit about me"
      description="Who I am and the kind of work I do."
      icon={<UserRound />}
    >
      <Reveal
        delay={0.05}
        className="mt-10 grid max-w-5xl grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-16"
      >
        <div className="flex min-w-0 flex-col gap-5">
          <div className="flex flex-col gap-5 text-base leading-relaxed text-muted md:text-lg">
            <p>
              ML engineer with{" "}
              <Highlight>six years of experience</Highlight> taking AI systems
              from raw data to a deployed, monitored model{" "}
              <Highlight>in production</Highlight> - lately LLM and RAG on Neo4j
              knowledge graphs, with the MLOps that keeps them reliable.
            </p>
            <p>
              I like <Highlight>owning the hard calls</Highlight>: the
              architecture, the build-vs-buy trade-offs, and what is actually
              worth shipping. I lead by bringing people along - turning fuzzy
              problems into a plan the team can execute, reviewing code, and
              mentoring engineers - and I stay accountable for what ships, not
              just what is written.
            </p>
            <p>
              Outside work I build side projects on{" "}
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline-offset-4 hover:underline"
              >
                GitHub
              </a>{" "}
              and play a fair amount of pickleball.
            </p>
          </div>

          <dl className="flex flex-wrap gap-x-6 gap-y-3 pt-2">
            {facts.map((fact) => (
              <div key={fact.label}>
                <dt className="font-mono text-xs text-accent">{fact.label}</dt>
                <dd className="mt-0.5 text-sm text-fg">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <CodeCard />
      </Reveal>
    </Section>
  );
};
