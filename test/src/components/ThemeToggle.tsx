"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import SunIcon from "@/assets/icons/sun.svg";
import MoonIcon from "@/assets/icons/moon.svg";
import MonitorIcon from "@/assets/icons/monitor.svg";

const options = [
  { value: "light", label: "Light", Icon: SunIcon },
  { value: "system", label: "System", Icon: MonitorIcon },
  { value: "dark", label: "Dark", Icon: MoonIcon },
] as const;

export const ThemeToggle = ({ vertical = false }: { vertical?: boolean }) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch - theme is only known on the client.
  useEffect(() => setMounted(true), []);

  return (
    <div
      role="radiogroup"
      aria-label="Color theme"
      aria-orientation={vertical ? "vertical" : "horizontal"}
      className={
        "inline-flex items-center gap-0.5 rounded-full border border-line p-0.5 " +
        (vertical ? "flex-col" : "")
      }
    >
      {options.map(({ value, label, Icon }) => {
        const active = mounted && theme === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={label}
            title={label}
            onClick={() => setTheme(value)}
            className={
              "rounded-full p-1.5 transition-colors " +
              (active ? "bg-fg/10 text-accent" : "text-muted hover:text-fg")
            }
          >
            <Icon className="size-4" />
          </button>
        );
      })}
    </div>
  );
};
