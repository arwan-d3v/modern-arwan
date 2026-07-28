"use client";

import React from "react";
import FadeIn from "@/components/FadeIn";
import { FileText, Mail, Layout, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  delay: number;
}

const FeatureCard = ({ icon, title, description, features, delay }: FeatureCardProps) => (
  <FadeIn delay={delay} className="glass p-8 rounded-none border-accent-cyan/10 hover:border-accent-cyan/30 transition-all group flex flex-col h-full relative overflow-hidden">
    <div className="absolute top-0 right-0 p-8 opacity-5 text-accent-cyan group-hover:scale-110 group-hover:opacity-10 transition-all duration-500 pointer-events-none">
      {icon}
    </div>
    
    <div className="text-accent-cyan mb-6">{icon}</div>
    <h3 className="text-xl font-bold font-mono tracking-tighter text-text-primary mb-3 uppercase">{title}</h3>
    <p className="text-sm text-text-secondary leading-relaxed mb-8 flex-grow">{description}</p>
    
    <ul className="space-y-3 mt-auto">
      {features.map((feature, i) => (
        <li key={i} className="flex items-start gap-2 text-xs font-mono text-text-secondary">
          <CheckCircle2 size={14} className="text-accent-cyan shrink-0 mt-0.5" />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
  </FadeIn>
);

export default function FeaturesOverview() {
  return (
    <section className="py-24 relative">
      <div className="mb-16 text-center max-w-2xl mx-auto">
        <FadeIn>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4 uppercase text-text-primary">
            Platform <span className="text-accent-cyan">Capabilities</span>
          </h2>
          <p className="text-text-secondary font-mono text-sm">
            Everything you need to build a compelling professional narrative.
          </p>
        </FadeIn>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FeatureCard
          icon={<FileText size={32} />}
          title="CV Builder"
          description="Create ATS-optimized resumes that actually pass automated screening systems. Built with algorithms that understand what recruiters look for."
          features={[
            "Real-time split-screen preview",
            "Export to clean, parseable PDF",
            "ATS compatibility checker",
            "Professional templates"
          ]}
          delay={0.1}
        />
        
        <FeatureCard
          icon={<Mail size={32} />}
          title="Cover Letters"
          description="Generate tailored cover letters that highlight your unique value proposition. Seamlessly integrates with your existing CV data."
          features={[
            "Data synchronization with CV",
            "Customizable tone and style",
            "Company-specific targeting",
            "One-click generation"
          ]}
          delay={0.2}
        />

        <FeatureCard
          icon={<Layout size={32} />}
          title="Public Portfolio"
          description="Your personal command center on the web. Showcase projects, skills, and experience with a unique cyberpunk aesthetic."
          features={[
            "Dynamic Open Graph images",
            "SEO optimized automatically",
            "Project & skill matrix display",
            "Fast, server-rendered pages"
          ]}
          delay={0.3}
        />
      </div>
      
      <FadeIn delay={0.4} className="mt-12 text-center">
         <Link href="/tools/cv-builder" className="inline-flex items-center gap-2 px-6 py-3 glass border border-accent-cyan/20 hover:border-accent-cyan text-xs font-mono font-bold uppercase tracking-widest transition-colors">
            Explore All Features
         </Link>
      </FadeIn>
    </section>
  );
}
