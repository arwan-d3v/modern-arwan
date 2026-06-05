"use client";

import Link from "next/link";
import { Terminal, Lock, Activity } from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass h-16 flex items-center px-6 md:px-12 justify-between">
      {/* Left: Branding */}
      <Link href="/" className="flex items-center gap-2 group">
        <Terminal className="text-accent-cyan group-hover:scale-110 transition-transform" size={24} />
        <span className="font-mono font-bold tracking-tighter text-text-primary">
          SYS_ARCHITECT
        </span>
      </Link>

      {/* Center: Links */}
      <div className="hidden md:flex items-center gap-8">
        <Link href="/#experience" className="text-sm font-medium text-text-secondary hover:text-accent-cyan transition-colors">
          EXPERIENCE
        </Link>
        <Link href="/#showcase" className="text-sm font-medium text-text-secondary hover:text-accent-cyan transition-colors">
          SHOWCASE
        </Link>
      </div>

      {/* Right: Status & Dashboard */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/20 border border-accent-cyan/20">
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-2 h-2 rounded-full bg-accent-cyan shadow-[0_0_8px_rgba(0,242,255,0.6)]"
          />
          <span className="text-[10px] font-mono text-accent-cyan font-bold tracking-widest">SYS_ONLINE</span>
        </div>

        <Link href="/dashboard" className="p-2 hover:bg-white/5 rounded-lg transition-colors text-text-secondary hover:text-text-primary">
          <Activity size={20} />
        </Link>

        <Link href="/login" className="p-2 hover:bg-white/5 rounded-lg transition-colors text-text-secondary hover:text-text-primary">
          <Lock size={20} />
        </Link>
      </div>
    </nav>
  );
}
