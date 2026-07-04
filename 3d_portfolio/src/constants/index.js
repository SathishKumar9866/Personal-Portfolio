const GH = "https://github.com/SathishKumarAI";

export const contact = {
  email: "sathishkumar786.ml@gmail.com",
  availability: "Open to ML / AI engineering roles",
  timezone: "IST · UTC+5:30",
  socials: [
    { k: "github", v: "SathishKumarAI", href: "https://github.com/SathishKumarAI" },
    { k: "linkedin", v: "in/SathishKumarAI", href: "https://www.linkedin.com/in/SathishKumarAI" },
    { k: "email", v: "sathishkumar786.ml@gmail.com", href: "mailto:sathishkumar786.ml@gmail.com" },
  ],
};

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

export const navLinks = [
  { id: "about", title: "About" },
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
    items: ["pandas", "NumPy", "scikit-learn", "evaluation", "exploratory analysis"],
  },
  {
    title: "LLM / RAG",
    note: "Grounded answers with citations, offline-first.",
    items: ["LangChain", "LangGraph", "Ollama", "Claude", "Pinecone", "embeddings"],
  },
  {
    title: "Computer vision",
    note: "Detection and tracking on real footage.",
    items: ["YOLOv8", "OpenCV", "detection & tracking", "federated learning", "PyTorch"],
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
    cover: "embeddings",
    outcome: "Production RAG on AWS with a measured retrieval loop and GitOps deploys.",
    stages: ["ingest", "embed", "retrieve", "generate"],
    description:
      "Production RAG on AWS with a measured retrieval loop and a GitOps deploy path. Built to be evaluated and shipped, not demoed.",
    tags: [
      { name: "RAG", color: "text-mauve" },
      { name: "MLOps", color: "text-blue" },
      { name: "Kubernetes", color: "text-green" },
    ],
    gradient: "from-[#cba6f7] to-[#89b4fa]",
    source_code_link: `${GH}/rag-pipeline-langchain`,
    live_link: null,
  },
  {
    name: "ai-due-diligence-copilot",
    cover: "citation",
    outcome: "Document Q&A that cites the exact source passage behind every answer.",
    stages: ["docs", "index", "ask", "cite"],
    description:
      "Document Q&A that cites the exact source passage behind every answer. Runs free and offline first; one env var swaps in a hosted model.",
    tags: [
      { name: "LLM", color: "text-mauve" },
      { name: "RAG", color: "text-blue" },
      { name: "FastAPI", color: "text-green" },
    ],
    gradient: "from-[#89b4fa] to-[#74c7ec]",
    source_code_link: `${GH}/ai-due-diligence-copilot`,
    live_link: null,
  },
  {
    name: "federated-yolov8-object-detection",
    cover: "federated",
    outcome: "YOLOv8 detection trained federated — raw data never leaves the client.",
    stages: ["clients", "local train", "aggregate", "detect"],
    description:
      "Object detection trained across distributed clients with federated learning, so the raw data never leaves the client that owns it.",
    tags: [
      { name: "Vision", color: "text-mauve" },
      { name: "Federated", color: "text-blue" },
      { name: "PyTorch", color: "text-green" },
    ],
    gradient: "from-[#a6e3a1] to-[#89b4fa]",
    source_code_link: `${GH}/federated-yolov8-object-detection`,
    live_link: null,
  },
  {
    name: "instagram-reels-extractor",
    cover: "frames",
    outcome: "Turns video into structured, searchable text via transcript, OCR, and vision.",
    stages: ["video", "transcribe", "index", "search"],
    description:
      "Turns video into structured, searchable text through transcript, OCR, and vision, then renders a clean document with local semantic search.",
    tags: [
      { name: "AppliedML", color: "text-mauve" },
      { name: "Multimodal", color: "text-blue" },
      { name: "Python", color: "text-green" },
    ],
    gradient: "from-[#fab387] to-[#cba6f7]",
    source_code_link: `${GH}/instagram-reels-extractor`,
    live_link: null,
  },
  {
    name: "pickleball-vision-llm",
    cover: "tracking",
    outcome: "Detection + tracking over match footage, split into modular layers.",
    stages: ["video", "vision", "api", "ui"],
    description:
      "A full detection and tracking pipeline over match footage, split into modular vision, ML, API, and frontend layers.",
    tags: [
      { name: "Vision", color: "text-mauve" },
      { name: "OpenCV", color: "text-blue" },
      { name: "Docker", color: "text-green" },
    ],
    gradient: "from-[#74c7ec] to-[#cba6f7]",
    source_code_link: `${GH}/pickleball-vision-llm`,
    live_link: null,
  },
  {
    name: "pickleball-shuffle",
    cover: "scorecard",
    outcome: "Live mobile-first scorekeeper — no login, works offline after first load.",
    stages: ["load", "cache", "play", "score"],
    description:
      "A live, mobile-first web app: draw a twist card mid-match and keep score, with no login and no signal needed after first load.",
    tags: [
      { name: "Product", color: "text-mauve" },
      { name: "Live", color: "text-green" },
      { name: "React", color: "text-blue" },
    ],
    gradient: "from-[#a6e3a1] to-[#fab387]",
    source_code_link: `${GH}/pickleball-shuffle`,
    live_link: "https://pb-card-deck.vercel.app/",
  },
];
