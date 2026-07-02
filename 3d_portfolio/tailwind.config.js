/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Catppuccin Mocha
        primary: "#1e1e2e", // base
        secondary: "#a6adc8", // subtext0
        tertiary: "#181825", // mantle
        "black-100": "#11111b", // crust
        "black-200": "#0e0e16",
        "white-100": "#cdd6f4", // text
        mauve: "#cba6f7",
        blue: "#89b4fa",
        green: "#a6e3a1",
        peach: "#fab387",
        surface: "#313244",
      },
      boxShadow: {
        card: "0px 20px 60px -12px rgba(17, 17, 27, 0.7)",
      },
      screens: {
        xs: "450px",
      },
      fontFamily: {
        sans: ["Poppins", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
