// Short, plain-language blurbs shown as a tooltip when hovering a tech chip.
// Keyed by normalized label (lowercased, alphanumerics only). Anything not
// listed simply shows no tooltip - recruiters already know the common tools.
const info: Record<string, string> = {
  // ML / GenAI
  pytorch: "Deep-learning framework for building and training neural networks.",
  scikitlearn: "Classic ML library - regression, classification, clustering.",
  xgboost: "Gradient-boosted trees; strong on tabular data.",
  huggingface: "Hub + libraries for transformer models and datasets.",
  opencv: "Computer-vision library for image and video processing.",
  nlp: "Natural Language Processing - understanding and generating text.",
  computervision: "Extracting information from images and video.",
  langchain: "Framework for building LLM apps and pipelines.",
  langgraph: "Graph-based orchestration for stateful LLM agents.",
  crewai: "Framework for coordinating multiple cooperating AI agents.",
  rag: "Retrieval-Augmented Generation - grounding LLM answers in your data.",
  pinecone: "Managed vector database for similarity search.",
  faiss: "Library for fast vector similarity search.",
  neo4j: "Graph database for connected, relationship-rich data.",
  // MLOps
  mlflow: "Tracks experiments, models, and deployments.",
  weightsbiases: "Experiment tracking and model monitoring.",
  docker: "Containers that package apps to run anywhere.",
  kubernetes: "Orchestrates containers at scale.",
  airflow: "Schedules and orchestrates data/ML pipelines.",
  dbt: "Transforms data in the warehouse with SQL + tests.",
  terraform: "Infrastructure as code across cloud providers.",
  githubactions: "CI/CD automation built into GitHub.",
  jenkins: "Automation server for CI/CD pipelines.",
  // Data
  python: "Primary language for ML, data, and backend work.",
  pyspark: "Python API for distributed Spark data processing.",
  postgresql: "Robust open-source relational database.",
  mongodb: "Document (NoSQL) database.",
  snowflake: "Cloud data warehouse for analytics at scale.",
  kafka: "Distributed streaming platform for real-time data.",
  fastapi: "High-performance Python API framework.",
  flask: "Lightweight Python web framework.",
  databricks: "Unified analytics + ML platform on Spark.",
  bigquery: "Google Cloud's serverless data warehouse.",
  // Observability / security
  prometheus: "Metrics collection and alerting.",
  grafana: "Dashboards for metrics and logs.",
  opentelemetry: "Vendor-neutral tracing, metrics, and logs.",
};

const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

export const getTechInfo = (name: string): string | undefined =>
  info[normalize(name)];
