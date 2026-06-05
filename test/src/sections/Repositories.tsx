import { Code2 } from "lucide-react";
import GithubIcon from "@/assets/icons/github.svg";
import ArrowUpRightIcon from "@/assets/icons/arrow-up-right.svg";
import StarIcon from "@/assets/icons/star.svg";
import { Section } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { LinkButton } from "@/components/ui/LinkButton";
import {
  featuredRepositories,
  otherRepositories,
  githubUrl,
  reposUpdated,
  type Repo,
} from "@/data/repositories";

const langColor: Record<string, string> = {
  Python: "bg-sky-400",
  TypeScript: "bg-blue-400",
  "Jupyter Notebook": "bg-orange-400",
  Shell: "bg-emerald-400",
  HTML: "bg-red-400",
  Dockerfile: "bg-cyan-400",
  Markdown: "bg-muted",
};

const RepoCard = ({ repo }: { repo: Repo }) => (
  <a
    href={repo.url}
    target="_blank"
    rel="noopener noreferrer"
    className="group relative flex flex-col gap-3 rounded-lg border border-line bg-panel p-5 transition-all duration-200 hover:z-10 hover:scale-[1.03] hover:border-accent/60 hover:shadow-lg hover:shadow-accent/5"
  >
    <div className="flex items-center justify-between">
      <div className="inline-flex min-w-0 items-center gap-2">
        <GithubIcon className="size-4 shrink-0 text-muted" />
        <h3 className="truncate font-mono text-sm font-medium">{repo.name}</h3>
      </div>
      <ArrowUpRightIcon className="size-4 shrink-0 text-muted transition-colors group-hover:text-accent" />
    </div>
    <p className="flex-1 text-sm leading-relaxed text-muted">
      {repo.description}
    </p>
    <div className="flex items-center gap-4 font-mono text-xs text-muted">
      {repo.language && (
        <span className="inline-flex items-center gap-1.5">
          <span
            className={`size-2.5 rounded-full ${
              langColor[repo.language] ?? "bg-muted"
            }`}
          />
          {repo.language}
        </span>
      )}
      {repo.stars > 0 && (
        <span className="inline-flex items-center gap-1">
          <StarIcon className="size-3.5 text-accent" />
          {repo.stars}
        </span>
      )}
    </div>
  </a>
);

export const RepositoriesSection = () => {
  return (
    <Section
      id="repositories"
      eyebrow="05 / Open Source"
      title="From my GitHub"
      icon={<Code2 />}
      description="A few repositories I'm happy to point at - research, tooling, and side projects."
    >
      <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {featuredRepositories.map((repo, i) => (
          <Reveal as="div" key={repo.name} delay={(i % 3) * 0.05}>
            <RepoCard repo={repo} />
          </Reveal>
        ))}
      </div>

      {otherRepositories.length > 0 && (
        <details className="group mt-6">
          <summary className="inline-flex cursor-pointer list-none items-center gap-2 font-mono text-sm text-muted transition-colors hover:text-accent">
            <span className="group-open:hidden">
              Show {otherRepositories.length} more repositories
            </span>
            <span className="hidden group-open:inline">Show fewer</span>
          </summary>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {otherRepositories.map((repo) => (
              <RepoCard key={repo.name} repo={repo} />
            ))}
          </div>
        </details>
      )}

      <div className="mt-10 flex flex-wrap items-center gap-4">
        <LinkButton href={githubUrl} external variant="outline">
          <GithubIcon className="size-4" />
          View all on GitHub
          <ArrowUpRightIcon className="size-4" />
        </LinkButton>
        <span className="font-mono text-xs text-muted">
          updated {reposUpdated}
        </span>
      </div>
    </Section>
  );
};
