"use client";
import Image from "next/image";

import { ShowcaseProject } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Terminal } from "lucide-react";

interface MediaModalProps {
  project: ShowcaseProject;
  isOpen: boolean;
  onClose: () => void;
}

export default function MediaModal({ project, isOpen, onClose }: MediaModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100]"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center p-4 md:p-8 z-[101] pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-5xl bg-surface border border-white/10 rounded-none overflow-hidden pointer-events-auto flex flex-col md:flex-row max-h-[90vh]"
            >
              {/* Image/Media Side */}
              <div className="md:w-3/5 bg-black flex items-center justify-center border-r border-white/5 relative overflow-hidden">
                {project.image_url ? (
                  <Image src={project.image_url} alt={project.title} className="w-full h-full object-cover" width={800} height={600} unoptimized />
                ) : (
                   <div className="flex flex-col items-center gap-4 opacity-20">
                     <Terminal size={80} />
                     <span className="font-mono text-xs">NO_PREVIEW_AVAILABLE</span>
                   </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>

              {/* Content Side */}
              <div className="md:w-2/5 p-8 flex flex-col relative overflow-y-auto">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 text-text-secondary hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>

                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tighter uppercase text-accent-cyan">
                      {project.title}
                    </h2>
                    <div className="flex gap-4 mt-2 font-mono text-[10px] text-text-secondary tracking-[0.2em]">
                       <span>PROJECT_ENTRY_{project.id?.slice(-4) || 'NULL'}</span>
                       <span>{" // "}</span>
                       <span className="text-accent-purple">{project.tech_stack[0]}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-text-secondary text-sm leading-relaxed whitespace-pre-line">
                      {project.description}
                    </p>
                  </div>

                  {project.technical_brief && (
                    <div className="space-y-4 pt-6 border-t border-white/5">
                       <h4 className="font-mono text-[10px] font-bold text-text-primary uppercase tracking-[0.2em]">SYSTEM_TECHNICAL_BRIEF</h4>
                       <div className="grid grid-cols-2 gap-4">
                          <TechnicalBit label="INTEGRITY" value={project.technical_brief.integrity} color="cyan" />
                          <TechnicalBit label="ENCRYPTION" value={project.technical_brief.encryption} color="purple" />
                          <TechnicalBit label="ACCESS" value={project.technical_brief.access} color="cyan" />
                       </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 pt-4">
                    {project.tech_stack.map(tech => (
                      <span key={tech} className="px-2 py-1 bg-black/40 border border-white/5 text-text-secondary text-[9px] font-mono rounded uppercase">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-4 pt-8 mt-auto">
                    {project.live_link && (
                      <a
                        href={project.live_link}
                        target="_blank"
                        className="flex-1 bg-accent-cyan hover:bg-accent-cyan/90 text-black text-xs font-bold py-3 flex items-center justify-center gap-2 font-mono"
                      >
                        <ExternalLink size={14} /> LIVE_DEMO
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

function TechnicalBit({ label, value, color }: { label: string, value: string, color: 'cyan' | 'purple' }) {
  const colorClass = color === 'cyan' ? 'text-accent-cyan' : 'text-accent-purple';
  return (
    <div className="space-y-1">
      <div className="text-[9px] font-mono font-bold text-text-secondary uppercase">{label}</div>
      <div className={`text-[10px] font-mono font-bold uppercase ${colorClass}`}>{value}</div>
    </div>
  );
}
