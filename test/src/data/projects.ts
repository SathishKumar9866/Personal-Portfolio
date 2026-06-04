// Featured projects. Edit here - no JSX changes needed.
// `metrics` is optional: drop in REAL numbers (latency, scale, accuracy, cost) when you have them.
// Leave it empty rather than inventing figures.

export type Project = {
  title: string;
  context: string;
  stack: string[];
  points: string[];
  metrics?: string[]; // e.g. ["~5M graph entities", "p95 < 200ms"]
  link?: string;
};

export const projects: Project[] = [
  {
    title: "Retail Knowledge Graph + RAG Platform",
    context: "AdvanceSoft International",
    stack: ["Neo4j", "Azure", "Databricks", "LangChain", "Python"],
    points: [
      "Modeled retail product and catalog data as a Neo4j knowledge graph used as one source for analytics, ML features, and RAG.",
      "Built the ingestion and cleanup pipelines (Azure Data Factory + Spark) feeding the graph.",
      "Used Graph Data Science and embedding similarity for RAG search and Q&A.",
    ],
    metrics: [],
  },
  {
    title: "Pickleball Vision LLM",
    context: "Personal project",
    stack: ["Python", "Computer Vision", "LLM", "PyTorch"],
    points: [
      "Computer-vision pipeline that analyses match footage for shot and play insights.",
      "Detection output feeds an LLM layer that produces natural-language summaries.",
    ],
    metrics: [],
    link: "https://github.com/SathishKumarAI/Pickleball-Vision-LLM",
  },
  {
    title: "Federated Learning for Autonomous Vehicles",
    context: "Research",
    stack: ["PyTorch", "YOLOv5", "Flower", "BDD100K"],
    points: [
      "Federated object-detection setup with Flower and YOLOv5 on the BDD100K driving dataset.",
      "Training kept aggregating even when edge nodes dropped out; runs were fully repeatable.",
    ],
    metrics: [],
    link: "https://github.com/SathishKumarAI/FL_AV",
  },
];
