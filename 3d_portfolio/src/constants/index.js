const GH = "https://github.com/SathishKumarAI";

export const contact = {
  email: "sathishkumar786.ml@gmail.com",
  github: "SathishKumarAI",
  // Canonical slug is lowercase — it appears 72 times in his own saved
  // profile page, and the mixed-case form appears zero times.
  linkedin: "in/sathishkumarai",
  substack: "https://sathishkumarai.substack.com/",
  availability: "Open to roles",
  timezone: "IST · UTC+5:30",
};

// Portrait. Source is HeadShot.jpg at the repo root (1920x2879, kept out of
// git); this is a top-anchored 4:5 crop of it, resized to 600x750 and stripped
// of metadata. Regenerate with:
//   magick HeadShot.jpg -auto-orient -strip -crop 1920x2400+0+0 +repage //     -resize 600x750 -quality 82 -interlace Plane 3d_portfolio/public/headshot.jpg
export const profile = {
  photo: "/headshot.jpg",
  alt: "Sathish Kumar",
};

// Employment status. Verified from the LinkedIn profile header saved
// 2026-09-11: employer, headline, country and the on-site/hybrid/remote
// preference are his own published words, not inferred.
export const status = {
  company: "AdvanSoft International, Inc",
  role: "Machine Learning Engineer",
  openTo: "ML / AI engineering roles",
  where: "United States — on-site, hybrid or remote",
};

// Roles, newest first. `start`/`end` are ISO "YYYY-MM" or null when not yet
// supplied; an entry renders whatever it has and nothing it does not, so a role
// with no dates shows no date range rather than an invented one.
export const experience = [
  {
    company: "AdvanSoft International, Inc",
    title: "AI Engineer",
    location: "United States",
    start: "2024-12",
    end: null,
    current: true,
    summary:
      "Shipped a production RAG application over a Neo4j knowledge graph, with Cypher and embedding similarity driving retrieval for LLM-backed search and Q&A. Built the graph on Azure from retail product and catalog data so analytics, ML features and RAG all read one source of truth, and owned the Data Factory pipelines feeding it.",
    stack: ["Neo4j", "RAG", "Azure", "Databricks", "PySpark", "Python"],
  },
  {
    company: "Integer IT Solutions",
    title: "Machine Learning Engineer",
    location: "United States",
    start: "2024-05",
    end: "2024-12",
    current: false,
    summary:
      "Built Python NLP workflows that classify intent, score sentiment and extract entities from customer-support feedback, automating request triage. Trained and shipped the models with Azure ML and MLflow, served them from FastAPI behind Docker on AKS, and added retraining, drift and evaluation checks so accuracy could not slip unnoticed.",
    stack: ["Azure", "MLflow", "Docker", "Kubernetes", "FastAPI", "Python"],
  },
  {
    company: "Southern Illinois University",
    title: "Research Engineer",
    location: "Carbondale, IL",
    start: "2022-01",
    end: "2023-12",
    current: false,
    summary:
      "Built and compared predictive models on behavioural and cognitive research data, and ran computer-vision work with CNNs and YOLOv5 for object detection. Trialled federated learning to train across separate datasets without moving them, which the project's privacy rules required — the same constraint behind the federated detection project below.",
    stack: ["PyTorch", "scikit-learn", "Federated learning", "OpenCV", "Docker"],
  },
  {
    company: "DotIn Solutions",
    title: "Software Engineer",
    location: "India",
    start: "2020-01",
    end: "2021-12",
    current: false,
    summary:
      "Provisioned AWS infrastructure with Terraform and kept it consistent with Ansible. Built the Jenkins CI/CD pipelines that tested, packaged and deployed containerised apps, and ran them on EKS with Helm using blue-green and canary rollouts. Stood up the monitoring stack — ELK, Grafana, CloudWatch — with alerting.",
    stack: ["S3", "Docker", "Kubernetes", "Helm", "GitHub Actions"],
  },
];

// Degrees, newest first. Same contract as `experience`: `start`/`end` are ISO
// "YYYY-MM" or null, and any field left null simply does not render.
export const education = [
  {
    school: "Southern Illinois University",
    degree: "M.S. Computer Science",
    location: "Carbondale, IL",
    start: null,
    end: "2024-05",
    current: false,
    summary: null,
    focus: [],
  },
  {
    school: "Anurag Group of Institutions",
    degree: "B.Tech Computer Science",
    location: "Hyderabad, India",
    start: null,
    end: "2021-05",
    current: false,
    summary: null,
    focus: [],
  },
];

export const quotes = [
  {
    text: "If you can't explain it simply, you don't understand it well enough.",
    author: "Albert Einstein",
  },
  {
    text: "An equation for me has no meaning unless it expresses a thought of God.",
    author: "Srinivasa Ramanujan",
  },
  {
    text: "Dream is not what you see in sleep; dream is the thing which does not let you sleep.",
    author: "A. P. J. Abdul Kalam",
  },
];

// plain-English definitions + a "learn more" link (curated: Wikipedia for
// concepts, official site for tools, Hugging Face for model/task terms).
// Any term without a link falls back to a Google search of the term.
export const glossary = {
  RAG: { def: "Retrieval-Augmented Generation — the AI looks things up in real documents before answering, so it cites sources instead of guessing.", link: "https://en.wikipedia.org/wiki/Retrieval-augmented_generation", full: "Retrieval-Augmented Generation" },
  LLM: { def: "Large Language Model — the kind of AI (like ChatGPT) that understands and writes text.", link: "https://en.wikipedia.org/wiki/Large_language_model", full: "Large Language Model" },
  MLOps: { def: "The tooling and process to ship, monitor, and update ML models reliably — DevOps, but for models.", link: "https://en.wikipedia.org/wiki/MLOps", full: "Machine Learning Operations" },
  Kubernetes: { def: "An industry-standard system that runs and scales apps across many servers automatically.", link: "https://kubernetes.io/", full: "Kubernetes container orchestration" },
  FastAPI: { def: "A fast Python framework for building web APIs — the backend that serves the model.", link: "https://fastapi.tiangolo.com/", full: "FastAPI web framework" },
  Vision: { def: "Computer vision — teaching software to understand images and video.", link: "https://en.wikipedia.org/wiki/Computer_vision", full: "Computer vision" },
  Federated: { def: "Federated learning — training a model across many devices without their raw data ever leaving them (privacy-preserving).", link: "https://en.wikipedia.org/wiki/Federated_learning", full: "Federated learning" },
  PyTorch: { def: "A popular open-source library for building and training neural networks.", link: "https://pytorch.org/" },
  OpenCV: { def: "A widely-used library for processing images and video.", link: "https://opencv.org/", full: "Open Source Computer Vision Library" },
  Docker: { def: "Packages an app with everything it needs so it runs the same anywhere.", link: "https://www.docker.com/" },
  React: { def: "A popular library for building interactive web interfaces.", link: "https://react.dev/" },
  "Applied ML": { def: "Applied machine learning — using ML to solve a real, practical problem.", link: "https://en.wikipedia.org/wiki/Machine_learning", full: "Applied machine learning" },
  Multimodal: { def: "Works across several data types at once — e.g. video, audio, and text together.", link: "https://huggingface.co/tasks", full: "Multimodal machine learning" },
  Python: { def: "The main programming language for data and AI work.", link: "https://www.python.org/" },
  Product: { def: "A finished, usable app — not a prototype.", link: null },
  Live: { def: "Deployed and running in the real world right now.", link: null },
  // stack tools
  PySpark: { def: "Python for Apache Spark — processing very large datasets across many machines.", link: "https://spark.apache.org/docs/latest/api/python/", full: "Python API for Apache Spark" },
  "ETL pipelines": { def: "Extract, Transform, Load — the plumbing that moves and cleans data between systems.", link: "https://en.wikipedia.org/wiki/Extract,_transform,_load", full: "Extract, Transform, Load" },
  PostgreSQL: { def: "A powerful open-source relational database.", link: "https://www.postgresql.org/" },
  DynamoDB: { def: "Amazon's fully-managed NoSQL database for fast, large-scale apps.", link: "https://aws.amazon.com/dynamodb/", full: "Amazon DynamoDB" },
  S3: { def: "Amazon's cloud object storage — where files and data live.", link: "https://aws.amazon.com/s3/", full: "Amazon Simple Storage Service" },
  SQL: { def: "The standard language for querying databases.", link: "https://en.wikipedia.org/wiki/SQL", full: "Structured Query Language" },
  pandas: { def: "The go-to Python library for working with tables of data.", link: "https://pandas.pydata.org/" },
  NumPy: { def: "The core Python library for fast numerical computing.", link: "https://numpy.org/", full: "Numerical Python" },
  "scikit-learn": { def: "The standard Python library for classical machine learning.", link: "https://scikit-learn.org/" },
  Evaluation: { def: "Measuring how good a model actually is, with real metrics — not vibes.", link: "https://huggingface.co/docs/evaluate/index" },
  "Exploratory analysis": { def: "Digging through data first to understand what's there before modelling.", link: "https://en.wikipedia.org/wiki/Exploratory_data_analysis" },
  LangChain: { def: "A framework for building apps around large language models.", link: "https://www.langchain.com/" },
  LangGraph: { def: "A framework for building AI agents as controllable, stateful graphs.", link: "https://www.langchain.com/langgraph" },
  Ollama: { def: "Runs open large language models locally on your own machine.", link: "https://ollama.com/" },
  Claude: { def: "Anthropic's family of AI assistants (large language models).", link: "https://www.anthropic.com/claude" },
  Pinecone: { def: "A vector database — stores embeddings for fast similarity search (powers RAG).", link: "https://www.pinecone.io/" },
  Embeddings: { def: "Turning text or images into numbers that capture meaning, so similar things sit close together.", link: "https://huggingface.co/blog/getting-started-with-embeddings" },
  YOLOv8: { def: "A fast, popular real-time object-detection model.", link: "https://docs.ultralytics.com/", full: "You Only Look Once, version 8" },
  "Detection & tracking": { def: "Finding objects in each frame and following them across a video.", link: "https://en.wikipedia.org/wiki/Object_detection" },
  "Federated learning": { def: "Training a model across many devices without their raw data ever leaving them.", link: "https://en.wikipedia.org/wiki/Federated_learning" },
  MLflow: { def: "Tracks ML experiments and manages model versions.", link: "https://mlflow.org/", full: "MLflow experiment tracking" },
  "GitHub Actions": { def: "Automation that builds, tests, and deploys code on every change (CI/CD).", link: "https://github.com/features/actions" },
  Helm: { def: "A package manager for deploying apps onto Kubernetes.", link: "https://helm.sh/" },
  "Next.js": { def: "A popular React framework for building fast, production web apps.", link: "https://nextjs.org/" },
  TypeScript: { def: "JavaScript with types — catches bugs before the code runs.", link: "https://www.typescriptlang.org/" },
  Tauri: { def: "Builds small, fast desktop apps from web code.", link: "https://tauri.app/" },
  Neo4j: { def: "A graph database — stores data as nodes and the relationships between them, which makes connected questions cheap to ask.", link: "https://neo4j.com/", full: "Neo4j graph database" },
  Azure: { def: "Microsoft's cloud platform — the servers, storage and managed services an app runs on.", link: "https://azure.microsoft.com/", full: "Microsoft Azure" },
  Databricks: { def: "A platform for large-scale data and ML work, built around Apache Spark.", link: "https://www.databricks.com/", full: "Databricks Lakehouse Platform" },
};

// Said once per section. The affordance used to be announced on every single
// chip, which put 33 question marks on one screen.
export const TERM_HINT = "Dotted terms have a plain-English definition — tap one.";

export const navLinks = [
  { id: "about", title: "About" },
  { id: "experience", title: "Experience" },
  { id: "stack", title: "Stack" },
  { id: "work", title: "Work" },
  { id: "contact", title: "Contact" },
];

// Focus areas across the data-to-AI stack
export const services = [
  {
    title: "Data Engineering",
    desc: "Pipelines that move and shape data reliably — Spark, SQL, and cloud storage the rest of the stack can trust.",
  },
  {
    title: "Data Analytics",
    desc: "Turning warehoused data into the dashboards and answers a business actually acts on — Synapse, Power BI, and SQL against a modelled source of truth.",
  },
  {
    title: "Data Science",
    desc: "Turning raw data into decisions — analysis, evaluation, and models grounded in what the data actually supports.",
  },
  {
    title: "Machine Learning",
    desc: "Training, tuning, and evaluating models — computer vision and beyond — built to generalize past the demo.",
  },
  {
    title: "AI Engineering",
    desc: "Shipping LLM and RAG systems to production: cited, offline-capable, and evaluated like software.",
  },
  {
    title: "Software & Full-Stack",
    desc: "The parts either side of the model: FastAPI and Next.js services, Terraform and Kubernetes underneath, CI/CD that ships them.",
  },
];

// Grouped stack, six areas across the data-to-AI path.
export const stackGroups = [
  {
    title: "Data engineering",
    note: "Moving and shaping data so the rest can trust it.",
    items: ["PySpark", "ETL pipelines", "PostgreSQL", "DynamoDB", "S3", "SQL"],
  },
  {
    title: "Data science",
    note: "Finding what the data actually supports.",
    items: ["pandas", "NumPy", "scikit-learn", "Evaluation", "Exploratory analysis"],
  },
  {
    title: "LLM / RAG",
    note: "Grounded answers with citations, offline-first.",
    items: ["LangChain", "LangGraph", "Ollama", "Claude", "Pinecone", "Embeddings"],
  },
  {
    title: "Computer vision",
    note: "Detection and tracking on real footage.",
    items: ["YOLOv8", "OpenCV", "Detection & tracking", "Federated learning", "PyTorch"],
  },
  {
    title: "MLOps & infra",
    note: "Shipping models like software — reproducible, deployable.",
    items: ["MLflow", "Docker", "GitHub Actions", "Kubernetes", "Helm"],
  },
  {
    title: "Backend & apps",
    note: "The interface a person actually uses.",
    items: ["Python", "FastAPI", "Next.js", "React", "TypeScript", "Tauri"],
  },
];

export const projects = [
  {
    name: "rag-pipeline-langchain",
    cover: "Embeddings",
    outcome: "Production RAG on AWS with a measured retrieval loop and GitOps deploys.",
    stages: ["ingest", "embed", "retrieve", "generate"],
    description:
      "LangChain and LangGraph drive retrieval over a Pinecone store, MLflow tracks every evaluation run, and releases ship through a GitOps path on Kubernetes and Helm.",
    tags: ["RAG", "MLOps", "Kubernetes"],
    source_code_link: `${GH}/rag-pipeline-langchain`,
    live_link: null,
  },
  {
    name: "ai-due-diligence-copilot",
    cover: "citation",
    outcome: "Document Q&A that cites the exact source passage behind every answer.",
    stages: ["docs", "index", "ask", "cite"],
    description:
      "Due-diligence reading over pitch decks, 10-Ks and term sheets. Defaults to a local Ollama model with no account or key; one environment variable switches it to Claude. FastAPI behind a Next.js front end.",
    tags: ["LLM", "RAG", "FastAPI"],
    source_code_link: `${GH}/ai-due-diligence-copilot`,
    live_link: null,
  },
  {
    name: "federated-yolov8-object-detection",
    cover: "federated",
    outcome: "YOLOv8 detection trained federated — raw data never leaves the client.",
    stages: ["clients", "local train", "aggregate", "detect"],
    description:
      "Training is distributed across clients with Flower — only model updates cross the network, never the images. The privacy constraint shapes the architecture rather than sitting on top of it.",
    tags: ["Vision", "Federated", "PyTorch"],
    source_code_link: `${GH}/federated-yolov8-object-detection`,
    live_link: null,
  },
  {
    name: "instagram-reels-extractor",
    cover: "frames",
    outcome: "Turns video into structured, searchable text via transcript, OCR, and vision.",
    stages: ["video", "transcribe", "index", "search"],
    description:
      "Caption, transcript, OCR and structured vision are merged into one document, rendered as a PDF and a linked docs site, with semantic search that runs entirely on your own machine.",
    tags: ["Applied ML", "Multimodal", "Python"],
    source_code_link: `${GH}/instagram-reels-extractor`,
    live_link: null,
  },
  {
    name: "pickleball-vision-llm",
    cover: "tracking",
    outcome: "Detection + tracking over match footage, split into modular layers.",
    stages: ["video", "vision", "api", "ui"],
    description:
      "Four layers that move independently — vision, ML, API, front end — so the detection model can be replaced without touching the interface that shows its output.",
    tags: ["Vision", "OpenCV", "Docker"],
    source_code_link: `${GH}/pickleball-vision-llm`,
    live_link: null,
  },
  {
    name: "pb-card-deck",
    cover: "scorecard",
    outcome: "Live mobile-first scorekeeper — no login, works offline after first load.",
    stages: ["load", "cache", "play", "score"],
    description:
      "A deck of 1,729 twist cards drawn mid-match, alongside side-out scoring. Local-first PWA: no account, no backend, nothing to install.",
    tags: ["Product", "Live", "React"],
    source_code_link: `${GH}/pb-card-deck`,
    live_link: "https://pb-card-deck.vercel.app/",
  },
];
