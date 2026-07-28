"use client";

import Link from "next/link";
import { Terminal, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-accent-cyan/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-accent-purple/10 blur-[100px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass p-12 max-w-lg w-full flex flex-col items-center text-center border-accent-cyan/20"
      >
        <div className="relative mb-8">
          <ShieldAlert size={64} className="text-accent-cyan animate-pulse" />
          <div className="absolute inset-0 bg-accent-cyan blur-2xl opacity-20" />
        </div>

        <h1 className="text-6xl font-black font-mono tracking-tighter mb-4 text-white drop-shadow-[0_0_15px_rgba(0,242,255,0.3)]">
          404
        </h1>
        
        <h2 className="text-xl font-mono uppercase tracking-widest text-text-secondary mb-6 border-b border-surface pb-4 w-full">
          NODE_NOT_FOUND
        </h2>

        <p className="text-text-primary mb-10 leading-relaxed font-mono text-sm">
          The requested trajectory does not exist in the current system state. The data fragment might have been relocated, corrupted, or access is restricted.
        </p>

        <Link 
          href="/" 
          className="flex items-center gap-3 px-8 py-4 bg-accent-cyan text-background font-mono font-bold uppercase tracking-widest hover:bg-white transition-colors group relative overflow-hidden"
        >
          <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          <Terminal size={18} className="relative z-10" />
          <span className="relative z-10">Return to Root</span>
        </Link>
      </motion.div>
    </div>
  );
}
