import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
/**
 * Databricks-clean type: Barlow for everything, JetBrains Mono for labels/data.
 *
 * LATIN AND LATIN-EXT ONLY. The bare `400.css` entry points pull every subset
 * Google publishes — Vietnamese among them — so four Barlow files were being
 * built and deployed for a site written entirely in English. A reader never
 * downloaded them (`unicode-range` sees to that), which is exactly why nobody
 * noticed: it is deploy weight, not transfer weight.
 *
 * Measured before changing anything: all six fonts a reader DOES fetch finish
 * at 137ms against a first paint at 152ms, and layout shift is 0. There is no
 * swap flash here and nothing to preload — the fonts are not the problem they
 * looked like from the file listing.
 *
 * Newsreader and JetBrains Mono stay on their full entry points: the variable
 * packages expose no per-subset CSS, and hand-writing @font-face for them would
 * trade a real risk for no reader-facing gain.
 *
 * LATIN-EXT IS DELIBERATELY ABSENT, and the reason is a trap worth knowing.
 * Importing it added four @font-face rules that no character on this page needs
 * — and Chrome then downloaded all four anyway, 55kB of them. The page contains
 * `→` (U+2192) and `↗` (U+2197), which the latin subset does not cover; when a
 * glyph is missing from the first matching face the browser tries the NEXT face
 * in the family before giving up, so latin-ext was fetched, searched, found
 * wanting, and discarded. Offering a subset you do not need is not free.
 *
 * If content ever carries ā, ł or ș, this is the line to change — and the
 * arrows will still cost a fallback lookup.
 */
import "@fontsource/barlow/latin-400.css";
import "@fontsource/barlow/latin-500.css";
import "@fontsource/barlow/latin-600.css";
import "@fontsource/barlow/latin-700.css";
import "@fontsource-variable/newsreader";
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
