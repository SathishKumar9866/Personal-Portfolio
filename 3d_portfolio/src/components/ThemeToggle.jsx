import { useEffect, useState } from "react";

const Sun = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);
const Moon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
  </svg>
);

const ThemeToggle = () => {
  const [theme, setTheme] = useState(
    () => document.documentElement.getAttribute("data-theme") || "light"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    // Keep mobile browser chrome in step with the page ground.
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme === "dark" ? "#0F2228" : "#FFFFFF");
    try {
      localStorage.setItem("theme", theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  // The command palette asks for a toggle rather than writing the DOM itself,
  // so this component stays the single source of truth for the current theme.
  useEffect(() => {
    const onToggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
    window.addEventListener("toggle-theme", onToggle);
    return () => window.removeEventListener("toggle-theme", onToggle);
  }, []);

  const next = theme === "dark" ? "light" : "dark";
  return (
    <button
      onClick={() => setTheme(next)}
      aria-label={`Switch to ${next} mode`}
      title={`Switch to ${next} mode`}
      className="w-11 h-11 sm:w-9 sm:h-9 grid place-items-center rounded-xl border border-line-strong text-white-100 hover:border-accent hover:text-accent transition-colors"
    >
      {theme === "dark" ? <Sun /> : <Moon />}
    </button>
  );
};

export default ThemeToggle;
