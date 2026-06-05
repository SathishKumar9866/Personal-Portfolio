// Public repositories for github.com/SathishKumarAI
// Source of truth: GitHub public repos (non-forks). Keep in sync as repos change.

export type Repo = {
  name: string;
  description: string;
  language: string | null;
  stars: number;
  url: string;
};

export const githubUrl = "https://github.com/SathishKumarAI";

export const repositories: Repo[] = [
  {
    name: "RAG",
    description:
      "Retrieval-Augmented Generation experiments - chunking, embeddings and LLM-backed Q&A.",
    language: "Python",
    stars: 1,
    url: "https://github.com/SathishKumarAI/RAG",
  },
  {
    name: "Pickleball-Vision-LLM",
    description:
      "Computer-vision + LLM pipeline analysing pickleball footage for shot and play insights.",
    language: "Python",
    stars: 1,
    url: "https://github.com/SathishKumarAI/Pickleball-Vision-LLM",
  },
  {
    name: "FL_AV",
    description:
      "Federated learning for autonomous vehicles - object detection trained across edge nodes.",
    language: "Jupyter Notebook",
    stars: 0,
    url: "https://github.com/SathishKumarAI/FL_AV",
  },
  {
    name: "Project-Med",
    description: "Applied ML notebooks for a medical / healthcare dataset.",
    language: "Jupyter Notebook",
    stars: 0,
    url: "https://github.com/SathishKumarAI/Project-Med",
  },
  {
    name: "Github_Repo_Gen_template",
    description:
      "Template + script to CRUD GitHub repositories programmatically.",
    language: "Python",
    stars: 1,
    url: "https://github.com/SathishKumarAI/Github_Repo_Gen_template",
  },
  {
    name: "system-design-interview-prep",
    description: "Notes and worked examples for system-design interviews.",
    language: "Python",
    stars: 0,
    url: "https://github.com/SathishKumarAI/system-design-interview-prep",
  },
  {
    name: "pickleball-shuffle",
    description:
      "Pickleball Shuffle - 200 twist cards web app. Draw mid-match, shake up the game.",
    language: "TypeScript",
    stars: 0,
    url: "https://github.com/SathishKumarAI/pickleball-shuffle",
  },
  {
    name: "rocky-dev-setup",
    description:
      "Rocky Linux dev environment auto-installer with mise + chezmoi.",
    language: "Shell",
    stars: 0,
    url: "https://github.com/SathishKumarAI/rocky-dev-setup",
  },
  {
    name: "Dotfiles",
    description: "Personal dotfiles and shell configuration.",
    language: "Shell",
    stars: 0,
    url: "https://github.com/SathishKumarAI/Dotfiles",
  },
  {
    name: "prompts",
    description:
      "A curated collection of generative-AI prompts for research and tooling.",
    language: "Markdown",
    stars: 0,
    url: "https://github.com/SathishKumarAI/prompts",
  },
  {
    name: "Python_DS",
    description: "Data-structures and Python practice work.",
    language: "Python",
    stars: 0,
    url: "https://github.com/SathishKumarAI/Python_DS",
  },
  {
    name: "Project_Lee",
    description: "Front-end project built with HTML/CSS.",
    language: "HTML",
    stars: 0,
    url: "https://github.com/SathishKumarAI/Project_Lee",
  },
  {
    name: "Personal-Portfolio",
    description: "This portfolio website, built with Next.js and Tailwind CSS.",
    language: "TypeScript",
    stars: 0,
    url: "https://github.com/SathishKumarAI/Personal-Portfolio",
  },
  {
    name: "KickStarterFiles",
    description: "Docker-based starter scaffolding for new projects.",
    language: "Dockerfile",
    stars: 0,
    url: "https://github.com/SathishKumarAI/KickStarterFiles",
  },
  {
    name: "SathishKumar",
    description: "GitHub profile repository.",
    language: "Markdown",
    stars: 0,
    url: "https://github.com/SathishKumarAI/SathishKumar",
  },
  {
    name: "loan",
    description: "Early web project - loan application UI.",
    language: "HTML",
    stars: 0,
    url: "https://github.com/SathishKumarAI/loan",
  },
];

// Manual snapshot of GitHub - refresh this when repos change.
export const reposUpdated = "June 2026";

// The strongest few get shown up front; the rest collapse behind "show all".
const featuredNames = new Set([
  "RAG",
  "Pickleball-Vision-LLM",
  "FL_AV",
  "Project-Med",
  "pickleball-shuffle",
  "Personal-Portfolio",
]);

export const featuredRepositories = repositories.filter((r) =>
  featuredNames.has(r.name)
);
export const otherRepositories = repositories.filter(
  (r) => !featuredNames.has(r.name)
);
