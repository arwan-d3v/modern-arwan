"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  className?: string;
  staggerChildren?: number;
  duration?: number;
}

export default function FadeIn({
  children,
  delay = 0,
  direction = "up",
  className = "",
  staggerChildren,
  duration = 0.6
}: FadeInProps) {
  const directions = {
    up: { y: 30, x: 0 },
    down: { y: -30, x: 0 },
    left: { x: 30, y: 0 },
    right: { x: -30, y: 0 },
    none: { x: 0, y: 0 }
  };

  const initial = {
    opacity: 0,
    y: directions[direction].y,
    x: directions[direction].x,
    filter: "blur(4px)",
  };

  const animate = {
    opacity: 1,
    y: 0,
    x: 0,
    filter: "blur(0px)",
  };

  return (
    <motion.div
      initial={initial}
      whileInView={animate}
      viewport={{ once: true, margin: "-10%" }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number], // cinematic ease out
        staggerChildren: staggerChildren
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
