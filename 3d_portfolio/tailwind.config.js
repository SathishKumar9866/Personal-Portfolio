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
        accent: c("--c-accent"), // Databricks lava red
        live: c("--c-live"),
        archive: c("--c-archive"),
        // legacy aliases → tokens
        mauve: c("--c-accent"),
        blue: c("--c-archive"),
        green: c("--c-live"),
        peach: c("--c-accent"),
      },
      fontFamily: {
        // Databricks-clean sans (Barlow) + mono for data/labels
        display: ['"Barlow"', "system-ui", "sans-serif"],
        sans: ['"Barlow"', "system-ui", "sans-serif"],
        serif: ['"Barlow"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono Variable"', "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      spacing: {
        u1: "4px", u2: "8px", u3: "12px", u4: "16px",
        u6: "24px", u8: "32px", u12: "48px", u16: "64px", u24: "96px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(27,49,57,0.04), 0 12px 32px -16px rgba(27,49,57,0.14)",
        glow: "0 0 0 1px rgb(var(--c-accent) / 0.3)",
      },
      screens: { xs: "450px" },
      letterSpacing: { label: "0.18em" },
    },
  },
  plugins: [],
};
