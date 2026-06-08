"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

export default function HeroSlider() {
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);

  useEffect(() => {
    if (containerRef.current) {
      x.set(containerRef.current.offsetWidth / 2);
    }
  }, [x]);

  const clipPathPremium = useTransform(x, (value) => `inset(0 0 0 ${value}px)`);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden border border-white/10 select-none my-12 bg-black"
    >
      {/* Container A: Standard (Grayscale, Blurred) */}
      <div 
        className="absolute inset-0 flex flex-col justify-center p-8 transition-all pointer-events-none"
        style={{ filter: 'grayscale(100%) blur(3px)' }}
      >
        <div className="absolute inset-0 bg-slate-900 opacity-80" />
        <div className="relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white/70 mb-4">Standard Foundation</h2>
          <p className="text-lg text-white/50 max-w-lg font-mono">
            Monolithic structures. Manual provisioning. High latency overhead. Basic security layers.
          </p>
          <div className="mt-8 flex gap-4">
            <div className="w-16 h-16 border border-white/20 bg-white/5 rounded-lg" />
            <div className="w-16 h-16 border border-white/20 bg-white/5 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Container B: Premium (Original saturation, sharp) */}
      <motion.div 
        className="absolute inset-0 flex flex-col justify-center p-8 bg-[radial-gradient(ellipse_at_right,_var(--tw-gradient-stops))] from-accent-cyan/10 via-slate-900 to-transparent pointer-events-none"
        style={{ clipPath: clipPathPremium }}
      >
        <div className="absolute inset-0 bg-slate-900/40" />
        <div className="relative z-10 pl-8">
          <h2 className="text-4xl md:text-5xl font-bold text-accent-cyan mb-4 drop-shadow-[0_0_15px_rgba(0,242,255,0.5)]">
            Premium SaaS Pipeline
          </h2>
          <p className="text-lg text-white max-w-lg font-mono">
            Microservices edge. Auto-scaling clusters. Zero-trust security. Real-time telemetry.
          </p>
          <div className="mt-8 flex gap-4">
            <div className="w-16 h-16 border border-accent-cyan/50 bg-accent-cyan/20 rounded-lg shadow-[0_0_15px_rgba(0,242,255,0.3)]" />
            <div className="w-16 h-16 border border-purple-500/50 bg-purple-500/20 rounded-lg shadow-[0_0_15px_rgba(168,85,247,0.3)]" />
          </div>
        </div>
      </motion.div>

      {/* Handle */}
      <motion.div
        className="absolute top-0 bottom-0 w-1 bg-accent-cyan cursor-col-resize shadow-[0_0_20px_rgba(0,242,255,1)] z-10 flex justify-center items-center group -ml-0.5"
        style={{ x }}
        drag="x"
        dragConstraints={containerRef}
        dragElastic={0}
        dragMomentum={false}
      >
        <div className="w-8 h-12 bg-black border border-accent-cyan rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(0,242,255,0.8)] group-hover:scale-110 transition-transform">
          <div className="flex gap-1">
            <div className="w-0.5 h-4 bg-accent-cyan" />
            <div className="w-0.5 h-4 bg-accent-cyan" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
