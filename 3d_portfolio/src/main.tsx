import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// Databricks-clean type: Barlow for everything, JetBrains Mono for labels/data
import "@fontsource/barlow/400.css";
import "@fontsource/barlow/500.css";
import "@fontsource/barlow/600.css";
import "@fontsource/barlow/700.css";
import "@fontsource-variable/jetbrains-mono";
import App from "./App.tsx";
import "./index.css";

// a wink for the devs who open the console
console.log(
  "%c↳ built by hand. %chttps://github.com/SathishKumarAI",
  "color:#FF3621;font-family:monospace;font-weight:bold",
  "color:#5A686D;font-family:monospace"
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
