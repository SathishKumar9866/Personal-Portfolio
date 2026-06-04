// Decorative "sathish.py" terminal card - GitHub-dark syntax colors.
// Quiet UI elsewhere; the code block is where a little color is allowed.

import { TerminalCard } from "@/components/ui/TerminalCard";

const kw = "text-[#ff7b72]"; // keyword (red)
const fn = "text-[#d2a8ff]"; // function/class (purple)
const str = "text-[#a5d6ff]"; // string (blue)
const num = "text-[#79c0ff]"; // number
const prop = "text-[#7ee787]"; // attribute (green)
const cm = "text-muted"; // comment

export const CodeCard = () => {
  return (
    <TerminalCard
      title="sathish.py"
      className="bg-panel/80 shadow-sm backdrop-blur"
    >
      <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-relaxed">
        <code>
          <span className={kw}>class</span>{" "}
          <span className={fn}>MLEngineer</span>:{"\n"}
          {"    "}name <span className={kw}>=</span>{" "}
          <span className={str}>&quot;Sathish Kumar&quot;</span>
          {"\n"}
          {"    "}focus <span className={kw}>=</span> [
          <span className={str}>&quot;LLM&quot;</span>,{" "}
          <span className={str}>&quot;RAG&quot;</span>,{" "}
          <span className={str}>&quot;MLOps&quot;</span>]{"\n"}
          {"    "}stack <span className={kw}>=</span> [
          <span className={str}>&quot;PyTorch&quot;</span>,{" "}
          <span className={str}>&quot;Neo4j&quot;</span>,{" "}
          <span className={str}>&quot;AWS&quot;</span>]{"\n"}
          {"    "}years <span className={kw}>=</span>{" "}
          <span className={num}>6</span>
          {"\n\n"}
          {"    "}
          <span className={kw}>def</span> <span className={fn}>ship</span>
          (self, model):{"\n"}
          {"        "}
          <span className={cm}># data → trained → deployed → monitored</span>
          {"\n"}
          {"        "}
          <span className={kw}>return</span> deploy(model,{" "}
          <span className={prop}>monitor</span>
          <span className={kw}>=</span>
          <span className={kw}>True</span>)
        </code>
      </pre>
    </TerminalCard>
  );
};
