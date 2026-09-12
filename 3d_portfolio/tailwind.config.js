/** @type {import('tailwindcss').Config} */
const c = (v) => `rgb(var(${v}) / <alpha-value>)`;

export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      // Tokens resolve to CSS variables so light/dark swap with one class on <html>.
      colors: {
        primary: c("--c-primary"), // page ground
        tertiary: c("--c-tertiary"), // raised panel / alt section
        surface: c("--c-surface"), // card / control
        line: c("--c-line"), // hairline
        secondary: c("--c-secondary"), // muted text
        faint: c("--c-faint"), // faintest text
        "white-100": c("--c-text"), // primary text (navy in light, off-white in dark)
        "black-100": c("--c-strong"),
        "black-200": c("--c-strong"),
        accent: c("--c-accent"), // Databricks lava red: fills only
        "accent-ink": c("--c-accent-ink"), // the same red, legible as small text
        "line-strong": c("--c-line-strong"), // boundary of an interactive control
        canvas: c("--c-canvas"), // project cover ground, theme-invariant
        "canvas-ink": c("--c-canvas-ink"),
        live: c("--c-live"),
        archive: c("--c-archive"),
        // Stack category dots: scan aid, one per stackGroups entry.
        "cat-data": c("--c-cat-data"),
        "cat-science": c("--c-cat-science"),
        "cat-llm": c("--c-cat-llm"),
        "cat-vision": c("--c-cat-vision"),
        "cat-mlops": c("--c-cat-mlops"),
        "cat-backend": c("--c-cat-backend"),
        // Filled chip for a group's primary tools.
        "chip-solid": c("--c-chip-solid"),
        "chip-solid-ink": c("--c-chip-solid-ink"),
      },
      fontFamily: {
        // Databricks-clean sans (Barlow) + mono for data/labels
        display: ['"Barlow"', "system-ui", "sans-serif"],
        sans: ['"Barlow"', "system-ui", "sans-serif"],
        // Reading face. Prose only, the sans and mono carry the brand.
        serif: ['"Newsreader Variable"', "Newsreader", "Georgia", "serif"],
        mono: ['"JetBrains Mono Variable"', "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      // A recruiter reads this page as a document, on a laptop, in about thirty
      // seconds. It was typeset as a dashboard: an audit found 220 of 273 text
      // elements rendering at 13px or smaller, and every fact one of them
      // actually needs, employer, dates, project name, repo link, was in the
      // 11-13px band. These are named for the job they do rather than for their
      // size, so the scale stays auditable in this one file instead of drifting
      // back across sixty-odd arbitrary literals.
      //
      // The line heights here are defaults; an explicit `leading-*` on the
      // element still wins, because Tailwind emits fontSize before lineHeight.
      fontSize: {
        micro: ["11px", { lineHeight: "1.4" }], // stamps sitting ON artwork, nothing else
        label: ["12px", { lineHeight: "1.45" }], // uppercase tracked eyebrows, field names
        nav: ["13px", { lineHeight: "1.4" }], // nav items and section eyebrows
        chip: ["13px", { lineHeight: "1.4" }], // technology chips
        data: ["14px", { lineHeight: "1.5" }], // mono facts: employers, dates, URLs, repos
        body: ["15px", { lineHeight: "1.6" }], // prose inside a card, narrow measure
        prose: ["16px", { lineHeight: "1.65" }], // prose at full measure
        lede: ["18px", { lineHeight: "1.7" }], // section intros
      },
      spacing: {
        u1: "4px", u2: "8px", u3: "12px", u4: "16px",
        u6: "24px", u8: "32px", u12: "48px", u16: "64px", u24: "96px",
      },
      boxShadow: {
        // Tokenised, the literal navy was invisible on the dark ground.
        card: "0 1px 2px rgb(var(--c-strong) / 0.06), 0 12px 32px -16px rgb(var(--c-strong) / 0.28)",
        glow: "0 0 0 1px rgb(var(--c-accent) / 0.3)",
      },
      screens: { xs: "450px", rail: "1024px" },
      letterSpacing: { label: "0.18em" },
    },
  },
  plugins: [],
};
