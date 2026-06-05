import { UserRound } from "lucide-react";
import ArrowUpRightIcon from "@/assets/icons/arrow-up-right.svg";
import { Section } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { CodeCard } from "@/components/CodeCard";
import { Highlight } from "@/components/ui/Highlight";
import { LinkButton } from "@/components/ui/LinkButton";
import { profile } from "@/data/resume";

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
              I&apos;ve worked across the ML stack - computer vision, NLP, and
              research, and earlier the infrastructure and CI/CD side - so I see{" "}
              <Highlight>the whole lifecycle</Highlight>, not just the model.
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
                className="link-underline text-accent"
              >
                GitHub
              </a>{" "}
              and play a fair amount of pickleball.
            </p>
          </div>

          <div>
            <LinkButton href={profile.resume} external variant="outline">
              Download résumé
              <ArrowUpRightIcon className="size-4" />
            </LinkButton>
          </div>
        </div>

        <Reveal as="div" x={28} delay={0.1} className="min-w-0">
          <CodeCard />
        </Reveal>
      </Reveal>
    </Section>
  );
};
