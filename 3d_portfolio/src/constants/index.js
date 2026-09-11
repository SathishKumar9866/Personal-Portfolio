const GH = "https://github.com/SathishKumarAI";

export const contact = {
  email: "sathishkumar786.ml@gmail.com",
  github: "SathishKumarAI",
  linkedin: "in/SathishKumarAI",
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
  RAG: { def: "Retrieval-Augmented Generation — the AI looks things up in real documents before answering, so it cites sources instead of guessing.", link: "https://en.wikipedia.org/wiki/Retrieval-augmented_generation" },
  LLM: { def: "Large Language Model — the kind of AI (like ChatGPT) that understands and writes text.", link: "https://en.wikipedia.org/wiki/Large_language_model" },
  MLOps: { def: "The tooling and process to ship, monitor, and update ML models reliably — DevOps, but for models.", link: "https://en.wikipedia.org/wiki/MLOps" },
  Kubernetes: { def: "An industry-standard system that runs and scales apps across many servers automatically.", link: "https://kubernetes.io/" },
  FastAPI: { def: "A fast Python framework for building web APIs — the backend that serves the model.", link: "https://fastapi.tiangolo.com/" },
  Vision: { def: "Computer vision — teaching software to understand images and video.", link: "https://en.wikipedia.org/wiki/Computer_vision" },
  Federated: { def: "Federated learning — training a model across many devices without their raw data ever leaving them (privacy-preserving).", link: "https://en.wikipedia.org/wiki/Federated_learning" },
  PyTorch: { def: "A popular open-source library for building and training neural networks.", link: "https://pytorch.org/" },
  OpenCV: { def: "A widely-used library for processing images and video.", link: "https://opencv.org/" },
  Docker: { def: "Packages an app with everything it needs so it runs the same anywhere.", link: "https://www.docker.com/" },
  React: { def: "A popular library for building interactive web interfaces.", link: "https://react.dev/" },
  AppliedML: { def: "Applied machine learning — using ML to solve a real, practical problem.", link: "https://en.wikipedia.org/wiki/Machine_learning" },
  Multimodal: { def: "Works across several data types at once — e.g. video, audio, and text together.", link: "https://huggingface.co/tasks" },
  Python: { def: "The main programming language for data and AI work.", link: "https://www.python.org/" },
  Product: { def: "A finished, usable app — not a prototype.", link: null },
  Live: { def: "Deployed and running in the real world right now.", link: null },
  // stack tools
  PySpark: { def: "Python for Apache Spark — processing very large datasets across many machines.", link: "https://spark.apache.org/docs/latest/api/python/" },
  "ETL pipelines": { def: "Extract, Transform, Load — the plumbing that moves and cleans data between systems.", link: "https://en.wikipedia.org/wiki/Extract,_transform,_load" },
  PostgreSQL: { def: "A powerful open-source relational database.", link: "https://www.postgresql.org/" },
  DynamoDB: { def: "Amazon's fully-managed NoSQL database for fast, large-scale apps.", link: "https://aws.amazon.com/dynamodb/" },
  S3: { def: "Amazon's cloud object storage — where files and data live.", link: "https://aws.amazon.com/s3/" },
  SQL: { def: "The standard language for querying databases.", link: "https://en.wikipedia.org/wiki/SQL" },
  pandas: { def: "The go-to Python library for working with tables of data.", link: "https://pandas.pydata.org/" },
  NumPy: { def: "The core Python library for fast numerical computing.", link: "https://numpy.org/" },
  "scikit-learn": { def: "The standard Python library for classical machine learning.", link: "https://scikit-learn.org/" },
  evaluation: { def: "Measuring how good a model actually is, with real metrics — not vibes.", link: "https://huggingface.co/docs/evaluate/index" },
  "exploratory analysis": { def: "Digging through data first to understand what's there before modelling.", link: "https://en.wikipedia.org/wiki/Exploratory_data_analysis" },
  LangChain: { def: "A framework for building apps around large language models.", link: "https://www.langchain.com/" },
  LangGraph: { def: "A framework for building AI agents as controllable, stateful graphs.", link: "https://www.langchain.com/langgraph" },
  Ollama: { def: "Runs open large language models locally on your own machine.", link: "https://ollama.com/" },
  Claude: { def: "Anthropic's family of AI assistants (large language models).", link: "https://www.anthropic.com/claude" },
  Pinecone: { def: "A vector database — stores embeddings for fast similarity search (powers RAG).", link: "https://www.pinecone.io/" },
  embeddings: { def: "Turning text or images into numbers that capture meaning, so similar things sit close together.", link: "https://huggingface.co/blog/getting-started-with-embeddings" },
  YOLOv8: { def: "A fast, popular real-time object-detection model.", link: "https://docs.ultralytics.com/" },
  "detection & tracking": { def: "Finding objects in each frame and following them across a video.", link: "https://en.wikipedia.org/wiki/Object_detection" },
  "federated learning": { def: "Training a model across many devices without their raw data ever leaving them.", link: "https://en.wikipedia.org/wiki/Federated_learning" },
  MLflow: { def: "Tracks ML experiments and manages model versions.", link: "https://mlflow.org/" },
  "GitHub Actions": { def: "Automation that builds, tests, and deploys code on every change (CI/CD).", link: "https://github.com/features/actions" },
  Helm: { def: "A package manager for deploying apps onto Kubernetes.", link: "https://helm.sh/" },
  "Next.js": { def: "A popular React framework for building fast, production web apps.", link: "https://nextjs.org/" },
  TypeScript: { def: "JavaScript with types — catches bugs before the code runs.", link: "https://www.typescriptlang.org/" },
  Tauri: { def: "Builds small, fast desktop apps from web code.", link: "https://tauri.app/" },
};

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
      "Document Q&A that cites the exact source passage behind every answer. Runs free and offline first; one env var swaps in a hosted model.",
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
      "Object detection trained across distributed clients with federated learning, so the raw data never leaves the client that owns it.",
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
      "Turns video into structured, searchable text through transcript, OCR, and vision, then renders a clean document with local semantic search.",
    tags: ["AppliedML", "Multimodal", "Python"],
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
      "A live, mobile-first web app: draw a twist card mid-match and keep score, with no login and no signal needed after first load.",
    tags: ["Product", "Live", "React"],
    source_code_link: `${GH}/pb-card-deck`,
    live_link: "https://pb-card-deck.vercel.app/",
  },
];
