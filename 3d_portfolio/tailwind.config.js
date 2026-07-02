/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // "Instrument" — cool-slate neutrals, a single warm amber signal.
        primary: "#0E1116", // ground (cool near-black, faint blue bias)
        tertiary: "#151A21", // raised panel
        surface: "#1E252E", // card / control
        line: "#2A323D", // hairline
        secondary: "#9AA3AF", // muted text (cool grey)
        faint: "#5D6675", // faintest text / marks
        "white-100": "#E8E4D9", // primary text (warm bone)
        "black-100": "#0A0D11",
        "black-200": "#07090C",
        accent: "#E3A44C", // sodium amber — the one signal, one hue
        live: "#4F9A8E", // status semantic (teal), not the accent
        archive: "#7C93A6", // status semantic (steel)
        // legacy aliases remapped onto the new system so old classNames stay coherent
        mauve: "#E3A44C",
        blue: "#7C93A6",
        green: "#4F9A8E",
        peach: "#E3A44C",
      },
      fontFamily: {
        // distinctive, self-hosted pairing — no Inter / Poppins / Space Grotesk
        display: ['"Bricolage Grotesque Variable"', "Georgia", "serif"],
        serif: ['"Newsreader"', "Georgia", "serif"],
        mono: ['"JetBrains Mono Variable"', "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
        sans: ['"Newsreader"', "Georgia", "serif"],
      },
      // 4px spatial base, documented scale
      spacing: {
        u1: "4px", u2: "8px", u3: "12px", u4: "16px",
        u6: "24px", u8: "32px", u12: "48px", u16: "64px", u24: "96px",
      },
      boxShadow: {
        // layered, tinted, soft — not a default box-shadow
        card: "0 1px 0 0 rgba(232,228,217,0.04) inset, 0 24px 60px -20px rgba(7,9,12,0.85), 0 4px 12px -6px rgba(7,9,12,0.6)",
        glow: "0 0 0 1px rgba(227,164,76,0.25), 0 12px 40px -12px rgba(227,164,76,0.28)",
      },
      screens: { xs: "450px" },
      letterSpacing: { label: "0.2em" },
    },
  },
  plugins: [],
};
