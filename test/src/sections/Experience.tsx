import { Briefcase } from "lucide-react";
import { Section } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { MetricTag } from "@/components/ui/Tag";
import { TechStack } from "@/components/ui/TechStack";
import { experience, profile /*, education */ } from "@/data/resume";

// Kept lean to avoid repeating what the hero / impact strip already state
// (years, current role). Location + education live ONLY here now.
const snapshot = [
  { label: "location", value: profile.location },
  { label: "education", value: "M.S. Computer Science, SIU" },
];

export const ExperienceSection = () => {
  return (
    <Section
      id="experience"
      eyebrow="01 / Career"
      title="Experience"
      description="Six years building and shipping machine learning systems."
      icon={<Briefcase />}
    >
      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_17rem] lg:gap-14">
        <div className="flex flex-col">
          {experience.map((job, i) => (
            <Reveal
              as="div"
              key={job.company + job.period}
              delay={i * 0.05}
              className="relative border-l border-line pb-10 pl-7 last:border-l-transparent last:pb-0"
            >
              <span className="absolute -left-[5px] top-1.5 size-2.5 rounded-full bg-accent" />
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <h3 className="text-lg font-semibold">
                  {job.role}{" "}
                  <span className="font-normal text-muted">
                    · {job.company}
                  </span>
                </h3>
                <span className="whitespace-nowrap font-mono text-xs text-muted">
                  {job.period}
                </span>
              </div>
              <p className="mt-0.5 font-mono text-xs text-muted">
                {job.location}
              </p>
              {job.metrics && job.metrics.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {job.metrics.map((metric) => (
                    <MetricTag key={metric}>{metric}</MetricTag>
                  ))}
                </div>
              )}
              <ul className="mt-3 flex flex-col gap-2">
                {job.points.map((point) => (
                  <li
                    key={point}
                    className="relative pl-4 text-sm leading-relaxed text-muted before:absolute before:left-0 before:text-accent before:content-['-']"
                  >
                    {point}
                  </li>
                ))}
              </ul>
              {job.stack && job.stack.length > 0 && (
                <div className="mt-4">
                  <TechStack items={job.stack} />
                </div>
              )}
            </Reveal>
          ))}
        </div>

        {/* Sticky recruiter snapshot - fills the right column, follows scroll. */}
        <Reveal as="div" x={20} className="hidden lg:block">
          <div className="sticky top-24 flex flex-col gap-4 rounded-lg border border-line bg-panel p-5">
            <p className="font-mono text-xs uppercase tracking-widest text-accent">
              Snapshot
            </p>
            <dl className="flex flex-col gap-3">
              {snapshot.map((item) => (
                <div key={item.label}>
                  <dt className="font-mono text-xs text-muted">{item.label}</dt>
                  <dd className="mt-0.5 text-sm text-fg">{item.value}</dd>
                </div>
              ))}
            </dl>
            <div>
              <p className="mb-2 font-mono text-xs text-muted">core stack</p>
              <TechStack items={["PyTorch", "Neo4j", "LangChain", "Docker", "AWS"]} />
            </div>
          </div>
        </Reveal>

        {/* Education - hidden for now (kept so it can be re-enabled). Also
            uncomment `education` in the import above to restore.
        <h3 className="mt-14 font-mono text-xs uppercase tracking-widest text-accent">
          Education
        </h3>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {education.map((edu, i) => (
            <Reveal
              as="div"
              key={edu.school}
              delay={i * 0.05}
              className="rounded-lg border border-line bg-panel p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/60 hover:shadow-lg hover:shadow-accent/5"
            >
              <div className="flex items-baseline justify-between gap-2">
                <h4 className="font-semibold">{edu.degree}</h4>
                <span className="font-mono text-xs text-muted">{edu.year}</span>
              </div>
              <p className="mt-1 text-sm text-muted">{edu.school}</p>
              <p className="mt-1 font-mono text-xs text-muted">
                {edu.location}
                {edu.detail ? ` · ${edu.detail}` : ""}
              </p>
            </Reveal>
          ))}
        </div>
        */}
      </div>
    </Section>
  );
};
