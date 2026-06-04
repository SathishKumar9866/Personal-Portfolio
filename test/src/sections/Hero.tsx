import ArrowDownIcon from "@/assets/icons/arrow-down.svg";
import ArrowUpRightIcon from "@/assets/icons/arrow-up-right.svg";
import { Reveal } from "@/components/Reveal";
import { LinkButton } from "@/components/ui/LinkButton";
import { NeuralBackground } from "@/components/NeuralBackground";
import { Typewriter } from "@/components/Typewriter";
import { FileTree } from "@/components/FileTree";
import { Highlight } from "@/components/ui/Highlight";
import { profile, currentRole } from "@/data/resume";

export const HeroSection = () => {
  return (
    <section
      id="home"
      className="scroll-anchor relative overflow-hidden pb-16 pt-24 md:pb-20 md:pt-24 lg:flex lg:min-h-[100svh] lg:items-center lg:py-24"
    >
      {/* Decorative ML background: neural field over a faint data grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
      >
        <div className="bg-grid absolute inset-0 opacity-60" />
        <NeuralBackground className="absolute inset-0 h-full w-full opacity-70" />
      </div>

      <div className="container">
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-10">
          <div className="min-w-0 max-w-2xl">
            <Reveal>
              <p className="eyebrow">Hi, I&apos;m</p>
            </Reveal>

            <Reveal delay={0.05}>
              <h1 className="mt-3 text-[clamp(2.75rem,6vw,4.5rem)] font-semibold leading-[1.05] tracking-tight">
                {profile.name}.
              </h1>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="mt-3 text-[clamp(1.5rem,3.5vw,2rem)] font-medium text-muted">
                I build{" "}
                <Typewriter
                  className="text-fg"
                  phrases={[
                    "LLM & RAG systems",
                    "Neo4j knowledge graphs",
                    "MLOps pipelines",
                    "production AI",
                  ]}
                />
              </p>
            </Reveal>

            <Reveal delay={0.15}>
              <p className="mt-6 text-base leading-relaxed text-muted md:text-lg">
                Machine learning engineer with{" "}
                <Highlight>six years of experience</Highlight> - lately focused
                on <Highlight>LLM and RAG</Highlight> applications backed by
                knowledge graphs, plus the <Highlight>MLOps</Highlight> that
                keeps them reliable: pipelines, deployment, and drift
                monitoring.
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="mt-6 flex flex-col gap-x-5 gap-y-2 font-mono text-sm text-muted sm:flex-row sm:items-center">
                <span className="inline-flex items-center gap-2">
                  <span className="relative flex size-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping-slow rounded-full bg-accent opacity-75" />
                    <span className="relative inline-flex size-2.5 rounded-full bg-accent" />
                  </span>
                  Open to ML / GenAI roles
                </span>
                {currentRole ? (
                  <span className="text-muted">
                    Currently {currentRole.role} @ {currentRole.company}
                  </span>
                ) : null}
              </div>
            </Reveal>

            <Reveal delay={0.25}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <LinkButton href="#experience">
                  View my experience
                  <ArrowDownIcon className="size-4" />
                </LinkButton>
                <LinkButton href={profile.resume} external variant="outline">
                  Download résumé
                  <ArrowUpRightIcon className="size-4" />
                </LinkButton>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.15} className="hidden min-w-0 lg:block">
            <FileTree />
          </Reveal>
        </div>
      </div>
    </section>
  );
};
