import { ReactNode } from "react";
import { Network, Activity, Rocket } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { CountUp } from "@/components/CountUp";

// A compact "what I do" strip directly under the hero - three scannable value
// props for a recruiter. Contact itself lives in the header rail + footer, so
// this slot earns its place with signal instead of a generic CTA.
const items: { Icon: typeof Network; title: ReactNode; desc: string }[] = [
  {
    Icon: Network,
    title: "RAG + knowledge graphs",
    desc: "LLM apps grounded in Neo4j graphs and vector search.",
  },
  {
    Icon: Activity,
    title: "MLOps that lasts",
    desc: "Pipelines, deployment, and drift monitoring in production.",
  },
  {
    Icon: Rocket,
    title: (
      <>
        <CountUp to={6} /> years shipping ML
      </>
    ),
    desc: "Raw data to deployed, monitored models on AWS and Azure.",
  },
];

export const ContactSection = () => {
  return (
    <section id="focus" className="scroll-anchor pb-8 lg:pb-12">
      <div className="container">
        <h2 className="sr-only">What I focus on</h2>
        <Reveal className="grid grid-cols-1 gap-6 rounded-lg border border-line bg-panel p-6 sm:grid-cols-3 md:p-8">
          {items.map(({ Icon, title, desc }, i) => (
            <div key={i} className="flex flex-col gap-2">
              <Icon className="size-5 text-accent" aria-hidden="true" />
              <p className="text-sm font-semibold">{title}</p>
              <p className="text-sm leading-relaxed text-muted">{desc}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
};
