"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function DarkModeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-[52px] h-[26px] bg-white/5 rounded-full" />;
  }

  const isDark = theme === "dark";
  const toggleTheme = () => setTheme(isDark ? "light" : "dark");

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="relative flex items-center w-[52px] h-[26px] rounded-full p-1 transition-colors duration-500 glass-hover overflow-hidden"
      style={{
        backgroundColor: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
        borderColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"
      }}
    >
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="flex items-center justify-center w-[20px] h-[20px] rounded-full shadow-md z-10"
        style={{
          backgroundColor: isDark ? "#00F2FF" : "#F8FAFC",
        }}
        initial={false}
        animate={{
          x: isDark ? 24 : 0,
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <AnimateIcon isDark={isDark} />
        </AnimatePresence>
      </motion.div>

      {/* Background glowing layer */}
      <motion.div 
        className="absolute inset-0 rounded-full opacity-30 pointer-events-none"
        animate={{
          background: isDark 
            ? "linear-gradient(90deg, rgba(0,242,255,0.2) 0%, rgba(138,43,226,0.1) 100%)" 
            : "linear-gradient(90deg, rgba(8,145,178,0.2) 0%, rgba(124,58,237,0.1) 100%)"
        }}
      />
    </button>
  );
}

function AnimateIcon({ isDark }: { isDark: boolean }) {
  return (
    <motion.div
      initial={{ rotate: -90, opacity: 0 }}
      animate={{ rotate: 0, opacity: 1 }}
      exit={{ rotate: 90, opacity: 0 }}
      transition={{ duration: 0.3 }}
      key={isDark ? "dark" : "light"}
      className="flex items-center justify-center"
    >
      {isDark ? (
        <Moon size={12} className="text-background" strokeWidth={3} />
      ) : (
        <Sun size={12} className="text-text-primary" strokeWidth={3} />
      )}
    </motion.div>
  );
}
