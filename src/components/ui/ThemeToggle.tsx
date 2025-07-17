// components/ThemeToggle.tsx
"use client";

import { useContext } from "react";
import { ThemeContext } from "./ThemeProvider";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle Dark Mode"
      className="fixed top-4 right-4 z-50 p-2 rounded-md bg-zinc-200 dark:bg-zinc-800 hover:animate-pulse-slow transition-colors"
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
