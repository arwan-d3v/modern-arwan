import FadeIn from "@/components/FadeIn";
import { Server, Zap, Shield, Cpu, Code, Globe, ArrowUpRight, Terminal } from "lucide-react";
import Link from "next/link";

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  delay?: number;
}

const StatCard = ({ label, value, icon, delay = 0 }: StatCardProps) => (
  <FadeIn delay={delay} className="glass p-6 rounded-xl flex flex-col gap-4">
    <div className="text-accent-cyan">{icon}</div>
    <div>
      <div className="text-3xl font-mono font-bold text-text-primary">{value}</div>
      <div className="text-xs font-mono uppercase tracking-widest text-text-secondary">{label}</div>
    </div>
  </FadeIn>
);

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 space-y-32">
      {/* Hero Section */}
      <section className="min-h-[60vh] flex flex-col justify-center">
        <FadeIn>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 bg-gradient-to-r from-text-primary to-text-secondary bg-clip-text text-transparent">
            System Architecture & <br />
            <span className="text-accent-cyan">Infrastructure</span>
          </h1>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p className="text-lg md:text-xl text-text-secondary max-w-2xl leading-relaxed mb-10">
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
      <section id="experience" className="scroll-mt-32">
        <FadeIn>
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Professional Engagement</h2>
            <div className="h-px flex-1 bg-surface" />
          </div>
        </FadeIn>

        <div className="space-y-8">
          {[
            {
              role: "Senior Systems Architect",
              company: "Nexus Quant Lab",
              period: "2022 — PRESENT",
              desc: "Lead architect for high-frequency trading infrastructure. Developed low-latency data ingestion pipelines and automated VPS deployment frameworks.",
              tags: ["Infrastructure", "Rust", "Trading Systems"]
            },
            {
              role: "Full-Stack Engineer",
              company: "CyberGrid Solutions",
              period: "2020 — 2022",
              desc: "Engineered real-time monitoring dashboards for distributed network nodes. Optimized database performance for high-throughput telemetry data.",
              tags: ["Next.js", "Go", "Distributed Systems"]
            }
          ].map((exp, i) => (
            <FadeIn key={i} delay={i * 0.1} direction="right">
              <div className="group relative glass p-8 rounded-2xl hover:border-accent-cyan/30 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-text-primary">{exp.role}</h3>
                    <p className="text-accent-cyan font-mono text-sm uppercase tracking-wider">{exp.company}</p>
                  </div>
                  <div className="text-text-secondary font-mono text-sm">{exp.period}</div>
                </div>
                <p className="text-text-secondary mb-6 max-w-3xl leading-relaxed">{exp.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {exp.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-mono text-text-primary uppercase tracking-widest border border-white/5">{tag}</span>
                  ))}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Showcase Section */}
      <section id="showcase" className="scroll-mt-32">
        <FadeIn>
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Technical Ventures</h2>
            <div className="h-px flex-1 bg-surface" />
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              title: "Project: ENIGMA MT5",
              desc: "Autonomous SMC-based trading algorithm for XAUUSD. Integrated with real-time risk management and VPS health monitoring.",
              icon: <Cpu size={40} />,
              link: "#"
            },
            {
              title: "EDGE_NODE MESH",
              desc: "Global network of distributed proxy nodes for low-latency market data scraping and order execution routing.",
              icon: <Globe size={40} />,
              link: "#"
            },
            {
              title: "INFRA_CODE ENGINE",
              desc: "Automated infrastructure deployment scripts for ultra-secure, isolated trading environments across multiple providers.",
              icon: <Code size={40} />,
              link: "#"
            },
            {
              title: "QUANT_LOG VLOG",
              desc: "Technical deep-dives into system architecture, network security, and algorithmic development strategies.",
              icon: <ArrowUpRight size={40} />,
              link: "#"
            }
          ].map((project, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <Link href={project.link} className="group block glass p-8 rounded-2xl hover:bg-surface/80 transition-all">
                <div className="flex items-start justify-between mb-8">
                  <div className="text-accent-cyan opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all">
                    {project.icon}
                  </div>
                  <ArrowUpRight className="text-text-secondary group-hover:text-accent-cyan group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" size={24} />
                </div>
                <h3 className="text-2xl font-bold mb-4">{project.title}</h3>
                <p className="text-text-secondary leading-relaxed">{project.desc}</p>
              </Link>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-20 pb-10 border-t border-surface flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-2">
          <Terminal className="text-accent-cyan" size={20} />
          <span className="font-mono font-bold tracking-tighter text-sm">SYS_ARCHITECT // 2024</span>
        </div>
        <div className="flex gap-8">
          {["GITHUB", "LINKEDIN", "TWITTER"].map(link => (
            <a key={link} href="#" className="text-[10px] font-mono font-bold tracking-[0.2em] text-text-secondary hover:text-accent-cyan transition-colors">{link}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}
