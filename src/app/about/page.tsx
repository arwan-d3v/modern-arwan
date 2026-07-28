"use client";

import { motion } from "framer-motion";
import { Terminal, Code, Cpu, Globe, FileText } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 pb-12 px-6 md:px-12 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <h1 className="text-4xl md:text-5xl font-bold font-mono text-accent-cyan uppercase tracking-tighter">
            &gt; SYSTEM_ADMIN_LOG
          </h1>
          <Link 
            href="/tools/cv-builder" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-accent-cyan/30 text-accent-cyan font-mono text-sm font-bold uppercase tracking-widest hover:bg-accent-cyan hover:text-black transition-colors"
          >
            <FileText size={16} /> Build / Download CV
          </Link>
        </div>
        
        <div className="glass p-8 md:p-10 rounded-xl border border-white/10 mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Cpu size={120} />
          </div>
          <div className="relative z-10 space-y-6 text-lg">
            <p className="text-text-primary leading-relaxed">
              My journey didn&apos;t start in a pristine server room. It started in the dirt, oil, and extreme environments of mining pits.
            </p>
            <p className="text-text-secondary leading-relaxed">
              As a vocational graduate in Heavy Equipment Mechanics, my early career was defined by troubleshooting massive excavators and rotary drills. I learned quickly that a single point of failure in a complex mechanical system could halt an entire operation. This foundational experience forged my analytical mindset and deep appreciation for robust, fail-safe architectures.
            </p>
            <p className="text-text-secondary leading-relaxed">
              My journey into technology started with a simple curiosity: &quot;How does this work?&quot; That curiosity quickly turned into a lifelong hobby of tinkering with computers. Technology is a vast, ever-expanding universe, and I&apos;ve always loved learning and improving my skills. Whether it&apos;s optimizing a backend service or polishing a user interface, I approach every project with the mindset of a Full-Stack Engineer who values both performance and aesthetics.
            </p>
            <p className="text-text-primary font-medium leading-relaxed">
              Today, as a Field Network & FMS Technician, I design and deploy critical wireless networks (LTE/WAN) across active mining sites, ensuring heavy equipment and control centers communicate flawlessly. And when I&apos;m not configuring network nodes at heights, I&apos;m building high-performance web applications, algorithmic trading systems, and modern UI/UX experiences.
            </p>
            <p className="text-accent-cyan font-mono text-sm tracking-widest uppercase pt-4">
              [ MECHANIC &gt; IT SUPPORT &gt; NETWORK ENGINEER &gt; FULL-STACK DEVELOPER ]
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-mono text-white mb-6 uppercase tracking-widest border-b border-white/10 pb-4">
          Core Hardware & Software Stack
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PrincipleCard 
            icon={<Cpu size={32} className="text-accent-cyan" />}
            title="Field Operations & Hardware"
            desc="Expert in heavy machinery maintenance, LOTO safety clearances, and remote site hardware deployment."
          />
          <PrincipleCard 
            icon={<Globe size={32} className="text-accent-purple" />}
            title="Network Infrastructure"
            desc="Designing and troubleshooting wired/wireless LAN/WAN/LTE topologies for Fleet Management Systems."
          />
          <PrincipleCard 
            icon={<Code size={32} className="text-emerald-400" />}
            title="Software Engineering"
            desc="Building robust applications and data pipelines using React, Node.js, Python, and Supabase/Firebase."
          />
          <PrincipleCard 
            icon={<Terminal size={32} className="text-rose-400" />}
            title="System Automation"
            desc="Developing trading algorithms (MQL5) and automated monitoring dashboards to minimize downtime."
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
