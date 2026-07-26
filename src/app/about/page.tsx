"use client";

import { motion } from "framer-motion";
import { Terminal, Code, Cpu, Globe } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 pb-12 px-6 md:px-12 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full"
      >
        <h1 className="text-4xl md:text-5xl font-bold font-mono text-accent-cyan mb-8 uppercase tracking-tighter">
          &gt; ABOUT_ME
        </h1>
        
        <div className="glass p-8 rounded-xl border border-white/10 mb-12">
          <p className="text-lg text-text-primary mb-6 leading-relaxed">
            I am a highly driven full-stack engineer and UI/UX enthusiast. 
            My mission is to craft digital experiences that are not only robust and scalable 
            but also visually captivating. I believe that code is poetry and interface design is art.
          </p>
          <p className="text-lg text-text-secondary leading-relaxed">
            With a background in both front-end micro-animations and back-end system architecture, 
            I bridge the gap between design and technical execution.
          </p>
        </div>

        <h2 className="text-2xl font-mono text-white mb-6 uppercase tracking-widest border-b border-white/10 pb-4">
          Core Principles
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PrincipleCard 
            icon={<Code size={32} className="text-accent-cyan" />}
            title="Clean Architecture"
            desc="Maintainable, testable, and loosely coupled codebases."
          />
          <PrincipleCard 
            icon={<Terminal size={32} className="text-accent-purple" />}
            title="System Automation"
            desc="Automating the mundane to focus on the complex."
          />
          <PrincipleCard 
            icon={<Globe size={32} className="text-emerald-400" />}
            title="Global Accessibility"
            desc="Building products that everyone can use, regardless of ability."
          />
          <PrincipleCard 
            icon={<Cpu size={32} className="text-rose-400" />}
            title="High Performance"
            desc="Optimizing for speed, minimal bundle sizes, and low latency."
          />
        </div>
      </motion.div>
    </div>
  );
}

function PrincipleCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="glass p-6 rounded-lg border border-white/5 hover:border-white/20 transition-all group"
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-text-secondary">{desc}</p>
    </motion.div>
  );
}
