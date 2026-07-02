import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// self-hosted type system (no external font CDN)
import "@fontsource-variable/bricolage-grotesque";
import "@fontsource-variable/jetbrains-mono";
import "@fontsource/newsreader/400.css";
import "@fontsource/newsreader/500.css";
import "@fontsource/newsreader/400-italic.css";
import App from "./App.tsx";
import "./index.css";

// a wink for the devs who open the console
console.log(
  "%c↳ built by hand. %chttps://github.com/SathishKumarAI",
  "color:#e3a44c;font-family:monospace;font-weight:bold",
  "color:#9aa3af;font-family:monospace"
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
