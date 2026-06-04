// Brand logos for tech stacks / skills, sourced locally from `simple-icons`
// (inline SVG path + brand color - no network, no dead-image risk). Anything
// without a brand logo (AWS/Azure are removed from simple-icons for brand
// reasons; "LLM"/"NLP"/"RAG"/datasets aren't brands) falls back to a plain
// text chip in <TechStack>.
import {
  siPython,
  siPytorch,
  siNeo4j,
  siLangchain,
  siLanggraph,
  siCrewai,
  siDatabricks,
  siUltralytics,
  siFlower,
  siApachespark,
  siOpencv,
  siGooglecloud,
  siDocker,
  siKubernetes,
  siScikitlearn,
  siHuggingface,
  siMlflow,
  siApacheairflow,
  siTerraform,
  siGithubactions,
  siJenkins,
  siSnowflake,
  siApachekafka,
  siFastapi,
  siFlask,
  siPrometheus,
  siGrafana,
  siPostgresql,
  siMysql,
  siMongodb,
  siOpentelemetry,
} from "simple-icons";

type SimpleIcon = { title: string; hex: string; path: string };

// Keyed by a normalized tech label (lowercased, alphanumerics only).
const map: Record<string, SimpleIcon> = {
  // ML / GenAI
  python: siPython,
  pytorch: siPytorch,
  scikitlearn: siScikitlearn,
  huggingface: siHuggingface,
  opencv: siOpencv,
  langchain: siLangchain,
  langgraph: siLanggraph,
  crewai: siCrewai,
  neo4j: siNeo4j,
  yolov5: siUltralytics,
  flower: siFlower,
  // MLOps / CI-CD
  mlflow: siMlflow,
  docker: siDocker,
  kubernetes: siKubernetes,
  airflow: siApacheairflow,
  terraform: siTerraform,
  githubactions: siGithubactions,
  jenkins: siJenkins,
  // Cloud / data
  databricks: siDatabricks,
  gcp: siGooglecloud,
  spark: siApachespark,
  pyspark: siApachespark,
  postgresql: siPostgresql,
  mysql: siMysql,
  mongodb: siMongodb,
  snowflake: siSnowflake,
  kafka: siApachekafka,
  fastapi: siFastapi,
  flask: siFlask,
  // Observability
  prometheus: siPrometheus,
  grafana: siGrafana,
  opentelemetry: siOpentelemetry,
};

const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

export const getTechIcon = (name: string): SimpleIcon | null => {
  const n = normalize(name);
  if (map[n]) return map[n];
  // GCP products (e.g. "GCP Vertex AI", "BigQuery") → Google Cloud logo.
  if (n.startsWith("gcp") || n.startsWith("googlecloud") || n === "bigquery")
    return siGooglecloud;
  return null;
};

// AWS and Azure were removed from simple-icons (brand restrictions), so their
// products get a brand-colored cloud glyph instead of a (wrong) logo.
export const getCloudColor = (name: string): string | null => {
  const n = normalize(name);
  if (n.startsWith("aws") || n.startsWith("amazon")) return "#FF9900";
  if (n.startsWith("azure")) return "#0078D4";
  return null;
};
