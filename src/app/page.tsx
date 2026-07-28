import dynamic from "next/dynamic";
import FadeIn from "@/components/FadeIn";
import { Server, Zap, Shield, Terminal } from "lucide-react";
import WaitlistForm from "@/components/WaitlistForm";

const ExperienceSection = dynamic(() => import("@/components/ExperienceSection"), { ssr: true });
const SkillsSection = dynamic(() => import("@/components/SkillsSection"), { ssr: true });
const ShowcaseSection = dynamic(() => import("@/components/ShowcaseSection"), { ssr: true });
const HeroSlider = dynamic(() => import("@/components/HeroSlider"), { ssr: false });

import DynamicStats from "@/components/DynamicStats";
import FeaturesOverview from "@/components/FeaturesOverview";
import TestimonialSection from "@/components/TestimonialSection";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 space-y-32">
      {/* Hero Section */}
      <section className="min-h-[70vh] flex flex-col justify-center relative">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-accent-cyan/5 blur-[120px] rounded-full pointer-events-none" />

        <FadeIn>
          <div className="flex items-center gap-2 mb-6">
             <div className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />
             <span className="font-mono text-[10px] font-bold text-accent-cyan tracking-[0.3em] uppercase">IS_ARWAN_DEV_ACTIVE</span>
          </div>
          <h1 className="text-4xl md:text-8xl font-bold tracking-tighter mb-8 bg-gradient-to-b from-text-primary to-text-secondary bg-clip-text text-transparent">
            Build a Portfolio <br />
            <span className="text-accent-cyan">That Gets You Hired</span>
          </h1>
        </FadeIn>

        <FadeIn delay={0.2}>
          <HeroSlider />
        </FadeIn>

        <FadeIn delay={0.4}>
          <p className="text-lg md:text-xl text-text-secondary max-w-2xl leading-relaxed mt-8 mb-8 font-medium">
            AI-powered CV Builder, ATS-optimized cover letter generator, and personal portfolio workspace — all in one place.
          </p>
          <div className="flex flex-wrap gap-4 mb-8">
            <a href="/tools/cv-builder" className="px-8 py-4 bg-accent-cyan text-background font-mono font-bold uppercase tracking-widest hover:bg-white transition-colors">
              Get Started Free
            </a>
            <a href="/dashboard" className="px-8 py-4 glass border border-accent-cyan/20 text-text-primary font-mono font-bold uppercase tracking-widest hover:border-accent-cyan transition-colors">
              See Live Demo
            </a>
          </div>
          
          <div className="mt-8">
            <WaitlistForm />
          </div>
        </FadeIn>

        <DynamicStats />
      </section>

      {/* Features Overview */}
      <FeaturesOverview />

      {/* Testimonial Section */}
      <TestimonialSection />

      {/* Experience Section */}
      <ExperienceSection />

      {/* Skills Section */}
      <SkillsSection />

      {/* Showcase Section */}
      <ShowcaseSection />


    </div>
  );
}
