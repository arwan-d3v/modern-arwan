"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Terminal } from "lucide-react";

interface VMBootScreenProps {
  onComplete: () => void;
}

const BOOT_LOGS = [
  "INITIALIZING SECURE KERNEL...",
  "MOUNTING ENCRYPTED VOLUMES...",
  "ESTABLISHING UPLINK TO GLOBAL VPS...",
  "VERIFYING CLEARANCE PROTOCOLS...",
  "LOADING UI ASSETS...",
  "SYSTEM ONLINE"
];

export default function VMBootScreen({ onComplete }: VMBootScreenProps) {
  const [progress, setProgress] = useState(0);
  const [currentLogIndex, setCurrentLogIndex] = useState(0);
  const [shouldSkip, setShouldSkip] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Prevent scrolling while booting
    document.body.style.overflow = "hidden";
    
    // Check cooldown (1 hour = 3600000 ms)
    const lastBoot = localStorage.getItem("last_boot_time");
    const now = Date.now();
    if (lastBoot && (now - parseInt(lastBoot, 10)) < 3600000) {
      setShouldSkip(true);
      setIsInitializing(false);
      document.body.style.overflow = "auto";
      onComplete();
      return;
    }
    
    setIsInitializing(false);
    
    // Total duration: 2500ms
    const startTime = Date.now();
    const duration = 2500;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      let p = Math.floor((elapsed / duration) * 100);
      
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setTimeout(() => {
          localStorage.setItem("last_boot_time", Date.now().toString());
          document.body.style.overflow = "auto";
          onComplete();
        }, 400); // delay before fading out so user sees 100%
      }
      setProgress(p);

      // Map progress to log index
      const logIdx = Math.min(
        Math.floor((p / 100) * BOOT_LOGS.length),
        BOOT_LOGS.length - 1
      );
      setCurrentLogIndex(logIdx);

    }, 30);

    return () => {
      clearInterval(interval);
      document.body.style.overflow = "auto";
    };
  }, [onComplete]);

  // If skipped or hydrating, render nothing (no flicker)
  if (shouldSkip || isInitializing) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[200] bg-background flex flex-col items-center justify-center p-6"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <div className="w-full max-w-md flex flex-col items-center text-center space-y-8">
        {/* Animated Logo / Icon */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        >
          <Terminal size={48} className="text-accent-cyan" />
        </motion.div>

        {/* Status Text */}
        <div className="space-y-2">
          <h1 className="text-xl font-bold tracking-[0.2em] uppercase text-text-primary">
            IS_ARWAN_DEV OS
          </h1>
          <p className="text-xs font-mono tracking-widest text-text-secondary h-4">
            {BOOT_LOGS[currentLogIndex]}
          </p>
        </div>

        {/* Progress Bar Container */}
        <div className="w-full space-y-2">
          <div className="flex justify-between text-[10px] font-mono tracking-widest text-accent-cyan font-bold">
            <span>BOOT_SEQ</span>
            <span>{progress}%</span>
          </div>
          <div className="h-1 w-full bg-white/10 overflow-hidden relative">
            <motion.div 
              className="absolute top-0 bottom-0 left-0 bg-accent-cyan shadow-[0_0_15px_#00F2FF]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
