import ArrowUpRightIcon from "@/assets/icons/arrow-up-right.svg";
import GithubIcon from "@/assets/icons/github.svg";
import { FolderGit2 } from "lucide-react";
import { Section } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { MetricTag } from "@/components/ui/Tag";
import { TechStack } from "@/components/ui/TechStack";
import { projects } from "@/data/projects";

export const ProjectsSection = () => {
  return (
    <Section
      id="projects"
      eyebrow="02 / Selected Work"
      title="Projects"
      description="A few systems I've taken from raw data to a deployed model or RAG application."
      icon={<FolderGit2 />}
    >
      <div className="mt-12 flex max-w-3xl flex-col gap-5">
        {projects.map((project, i) => (
          <Reveal
            key={project.title}
            delay={i * 0.06}
            className="group rounded-lg border border-line bg-panel p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/60 hover:shadow-lg hover:shadow-accent/5 md:p-7"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold">{project.title}</h3>
                <p className="mt-1 font-mono text-xs text-muted">
                  {project.context}
                </p>
              </div>
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${project.title} on GitHub`}
                  className="inline-flex items-center gap-1 whitespace-nowrap font-mono text-xs text-muted transition-colors group-hover:text-accent [&_svg:last-child]:transition-transform group-hover:[&_svg:last-child]:translate-x-0.5"
                >
                  <GithubIcon className="size-4" />
                  code
                  <ArrowUpRightIcon className="size-3.5" />
                </a>
              )}
            </div>

            {project.metrics && project.metrics.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {project.metrics.map((metric) => (
                  <MetricTag key={metric}>{metric}</MetricTag>
                ))}
              </div>
            )}

            <ul className="mt-4 flex flex-col gap-2">
              {project.points.map((point) => (
                <li
                  key={point}
                  className="relative pl-4 text-sm leading-relaxed text-muted before:absolute before:left-0 before:text-accent before:content-['-']"
                >
                  {point}
                </li>
              ))}
            </ul>

            <div className="mt-5">
              <TechStack items={project.stack} />
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
};
