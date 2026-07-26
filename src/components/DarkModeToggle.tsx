"use client";

import { useTheme } from "next-themes";
import { Switch } from "@headlessui/react"; // using headlessui for toggle (already dependency?)
import { Moon, Sun } from "lucide-react";

export default function DarkModeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle dark mode"
      className="flex items-center gap-1 text-text-secondary hover:text-accent-cyan transition-colors"
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
