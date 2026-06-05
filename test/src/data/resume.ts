// Real resume data for Sathish Kumar.
// Source: resume-automation/resume-automation/src/*.tex

export type Job = {
  company: string;
  role: string;
  period: string;
  location: string;
  points: string[];
  metrics?: string[]; // optional: real impact numbers, filled in when available
  stack?: string[]; // key tools for this role → rendered as logo chips
};

export const experience: Job[] = [
  {
    company: "AdvanceSoft International",
    role: "AI Engineer",
    period: "Dec 2024 - Present",
    location: "USA",
    points: [
      "Built a Neo4j retail knowledge graph on Azure - ingestion and cleanup pipelines (Data Factory + Databricks/Spark) feed it, while Graph Data Science and embedding similarity power RAG search, analytics, and ML features from a single source.",
    ],
    stack: ["Neo4j", "Azure", "Databricks", "LangChain", "PySpark", "Python"],
  },
  {
    company: "Integer IT Solutions",
    role: "Machine Learning Engineer",
    period: "May 2024 - Dec 2024",
    location: "USA",
    points: [
      "Shipped NLP models (sentiment, entity, intent) end-to-end on Azure ML and MLflow - served behind FastAPI on AKS with retraining and drift checks, feeding Azure Synapse and Power BI dashboards.",
    ],
    stack: ["Python", "Azure", "MLflow", "Docker", "Kubernetes", "FastAPI"],
  },
  {
    company: "Southern Illinois University",
    role: "Research Engineer",
    period: "Jan 2022 - Dec 2023",
    location: "Carbondale, IL",
    points: [
      "Built predictive and computer-vision models (Scikit-learn, XGBoost, PyTorch, CNNs, YOLOv5) on research data, including federated training across separate private datasets without moving the data.",
    ],
    stack: ["PyTorch", "Scikit-learn", "XGBoost", "OpenCV", "YOLOv5", "Flower"],
  },
  {
    company: "DotIn Solutions",
    role: "Software Engineer",
    period: "Jan 2020 - Dec 2021",
    location: "India",
    points: [
      "Provisioned AWS infrastructure (EC2, RDS, S3, VPC, IAM) with Terraform and Ansible, and built Jenkins CI/CD (SonarQube + PyTest) deploying Dockerized services to EKS with blue-green and canary rollouts.",
    ],
    stack: ["AWS", "Terraform", "Jenkins", "Docker", "Kubernetes"],
  },
];

export type Education = {
  school: string;
  degree: string;
  detail?: string;
  location: string;
  year: string;
};

export const education: Education[] = [
  {
    school: "Southern Illinois University",
    degree: "M.S. Computer Science",
    location: "Carbondale, IL",
    year: "2024",
  },
  {
    school: "Anurag Group of Institutions",
    degree: "B.Tech Computer Science",
    location: "Hyderabad, India",
    year: "2021",
  },
];

export type SkillGroup = {
  category: string;
  items: string[];
};

export const skills: SkillGroup[] = [
  {
    category: "Machine Learning & GenAI",
    items: [
      "PyTorch",
      "Scikit-learn",
      "XGBoost",
      "Hugging Face",
      "OpenCV",
      "NLP",
      "Computer Vision",
      "LangChain",
      "LangGraph",
      "CrewAI",
      "RAG",
      "Pinecone",
      "FAISS",
      "Neo4j",
    ],
  },
  {
    category: "MLOps & CI/CD",
    items: [
      "MLflow",
      "Weights & Biases",
      "Docker",
      "Kubernetes",
      "Airflow",
      "GitHub Actions",
      "Jenkins",
    ],
  },
  {
    category: "Cloud & Infrastructure",
    items: [
      "AWS SageMaker",
      "AWS Bedrock",
      "AWS (EC2 · S3 · Lambda · Glue)",
      "Azure ML",
      "Azure Data Factory",
      "Azure Synapse · AKS",
      "GCP Vertex AI",
      "BigQuery",
      "Databricks",
      "Terraform",
    ],
  },
  {
    category: "Data Engineering",
    items: [
      "Python",
      "PySpark",
      "SQL / PL-SQL",
      "dbt",
      "PostgreSQL",
      "MySQL",
      "MongoDB",
      "Snowflake",
      "Kafka",
      "FastAPI",
      "Flask",
    ],
  },
  {
    category: "Observability & Security",
    items: [
      "Prometheus",
      "Grafana",
      "CloudWatch",
      "OpenTelemetry",
      "IAM",
      "OAuth 2.0",
      "Secrets Manager",
      "RBAC",
    ],
  },
];

export const profile = {
  name: "Sathish Kumar",
  title: "Machine Learning Engineer",
  tagline: "MLOps · GenAI · RAG",
  email: "sathishkumar.p9875@gmail.com",
  github: "https://github.com/SathishKumarAI",
  linkedin: "https://www.linkedin.com/in/SathishKumarAI",
  resume: "/Sathish_Kumar_Resume.pdf",
  location: "United States",
  // Update once deployed (or set NEXT_PUBLIC_SITE_URL). Used for canonical URL, OG tags, sitemap.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://sathish-kumar.vercel.app",
  // Recruiters look for this on US ML roles. Fill in e.g. "U.S. Citizen",
  // "Green Card", "H-1B", "F-1 OPT - no sponsorship needed". Left blank = hidden.
  workAuthorization: "",
};

// Current role, derived from the most recent experience entry.
export const currentRole = experience[0]
  ? { role: experience[0].role, company: experience[0].company }
  : null;
