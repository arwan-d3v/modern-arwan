import FadeIn from "@/components/FadeIn";
import { Server, Zap, Shield, Terminal } from "lucide-react";
import ExperienceSection from "@/components/ExperienceSection";
import ShowcaseSection from "@/components/ShowcaseSection";
import HeroSlider from "@/components/HeroSlider";

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  delay?: number;
}

const StatCard = ({ label, value, icon, delay = 0 }: StatCardProps) => (
  <FadeIn delay={delay} className="glass p-6 rounded-none flex flex-col gap-4 border-accent-cyan/10">
    <div className="text-accent-cyan">{icon}</div>
    <div>
      <div className="text-3xl font-mono font-bold text-text-primary tracking-tighter">{value}</div>
      <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-text-secondary font-bold">{label}</div>
    </div>
  </FadeIn>
);

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 space-y-32">
      {/* Hero Section */}
      <section className="min-h-[70vh] flex flex-col justify-center relative">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-accent-cyan/5 blur-[120px] rounded-full pointer-events-none" />

        <FadeIn>
          <div className="flex items-center gap-2 mb-6">
             <div className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />
             <span className="font-mono text-[10px] font-bold text-accent-cyan tracking-[0.3em] uppercase">SYSTEM_ARCHITECT_ACTIVE</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-bold tracking-tighter mb-8 bg-gradient-to-b from-text-primary to-text-secondary bg-clip-text text-transparent">
            System Architecture & <br />
            <span className="text-accent-cyan">Infrastructure</span>
          </h1>
        </FadeIn>

        <FadeIn delay={0.2}>
          <HeroSlider />
        </FadeIn>

        <FadeIn delay={0.4}>
          <p className="text-lg md:text-xl text-text-secondary max-w-2xl leading-relaxed mt-8 mb-12 font-medium">
            Building resilient algorithmic trading systems, automated data pipelines,
            and scalable network infrastructures. Focused on performance, security, and high-frequency execution.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            icon={<Zap size={24} />}
            label="Active Trading Bots"
            value="03"
            delay={0.4}
          />
          <StatCard
            icon={<Server size={24} />}
            label="Network Edge Nodes"
            value="07"
            delay={0.5}
          />
          <StatCard
            icon={<Shield size={24} />}
            label="System Uptime"
            value="99.9%"
            delay={0.6}
          />
        </div>
      </section>

      {/* Experience Section */}
      <ExperienceSection />

      {/* Showcase Section */}
      <ShowcaseSection />

      {/* Footer */}
      <footer className="pt-20 pb-10 border-t border-surface flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-2">
          <Terminal className="text-accent-cyan" size={20} />
          <span className="font-mono font-bold tracking-tighter text-sm uppercase">SYS_ARCHITECT // 2024</span>
        </div>
        <div className="flex gap-12">
          {["GITHUB", "LINKEDIN", "TWITTER"].map(link => (
            <a key={link} href="#" className="text-[10px] font-mono font-bold tracking-[0.3em] text-text-secondary hover:text-accent-cyan transition-colors">{link}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}
