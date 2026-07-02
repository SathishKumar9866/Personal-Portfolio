const GH = "https://github.com/SathishKumarAI";

export const navLinks = [
  { id: "about", title: "About" },
  { id: "work", title: "Work" },
  { id: "contact", title: "Contact" },
];

// Focus areas across the data-to-AI stack
export const services = [
  { title: "Data Engineering" },
  { title: "Data Science" },
  { title: "Machine Learning" },
  { title: "AI Engineering" },
];

// Grouped stack, six areas across the data-to-AI path.
export const stackGroups = [
  {
    title: "Data engineering",
    items: ["PySpark", "ETL pipelines", "PostgreSQL", "DynamoDB", "S3", "SQL"],
  },
  {
    title: "Data science",
    items: ["pandas", "NumPy", "scikit-learn", "evaluation", "exploratory analysis"],
  },
  {
    title: "LLM / RAG",
    items: ["LangChain", "LangGraph", "Ollama", "Claude", "Pinecone", "embeddings"],
  },
  {
    title: "Computer vision",
    items: ["YOLOv8", "OpenCV", "detection & tracking", "federated learning", "PyTorch"],
  },
  {
    title: "MLOps & infra",
    items: ["MLflow", "Docker", "GitHub Actions", "Kubernetes", "Helm"],
  },
  {
    title: "Backend & apps",
    items: ["Python", "FastAPI", "Next.js", "React", "TypeScript", "Tauri"],
  },
];

export const projects = [
  {
    name: "rag-pipeline-langchain",
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
    live_link: "https://www.pickleballshuffle.com/",
  },
];
