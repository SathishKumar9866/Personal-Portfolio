import { profile } from "@/data/resume";
import { TerminalCard } from "@/components/ui/TerminalCard";

// The profile rendered as a filesystem - a distinctive, on-theme "this person
// is an engineer" element. Top-level entries jump to the matching section.

type Node = {
  name: string;
  href?: string;
  external?: boolean;
  dir?: boolean;
  children?: string[];
};

const tree: Node[] = [
  { name: "about.md", href: "#about" },
  {
    name: "experience/",
    href: "#experience",
    dir: true,
    children: [
      "advancesoft.ai",
      "integer-it.ml",
      "siu-research.py",
      "dotin.tf",
    ],
  },
  {
    name: "projects/",
    href: "#projects",
    dir: true,
    children: [
      "retail-knowledge-graph",
      "pickleball-vision-llm",
      "federated-av",
    ],
  },
  { name: "skills.json", href: "#skills" },
  { name: "open-source/", href: "#repositories", dir: true },
  { name: "resume.pdf", href: profile.resume, external: true },
  { name: "contact.sh", href: `mailto:${profile.email}` },
];

const Row = ({ node, last }: { node: Node; last: boolean }) => {
  const connector = last ? "└──" : "├──";
  const label = (
    <span className={node.dir ? "text-accent" : "text-fg/80"}>{node.name}</span>
  );
  return (
    <>
      <div className="flex items-center gap-2 whitespace-pre">
        <span className="text-muted/60">{connector}</span>
        {node.href ? (
          <a
            href={node.href}
            {...(node.external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className="transition-colors hover:text-accent"
          >
            {label}
          </a>
        ) : (
          label
        )}
      </div>
      {node.children?.map((child, i) => {
        const childLast = i === node.children!.length - 1;
        return (
          <div
            key={child}
            className="flex items-center gap-2 whitespace-pre text-muted"
          >
            <span className="text-muted/60">
              {last ? "    " : "│   "}
              {childLast ? "└──" : "├──"}
            </span>
            {child}
          </div>
        );
      })}
    </>
  );
};

export const FileTree = () => {
  return (
    <TerminalCard
      title="~/sathish-kumar"
      className="bg-panel/60 font-mono text-sm"
    >
      <div className="overflow-x-auto p-4 leading-6">
        <div className="text-accent">.</div>
        {tree.map((node, i) => (
          <Row key={node.name} node={node} last={i === tree.length - 1} />
        ))}
      </div>
    </TerminalCard>
  );
};
