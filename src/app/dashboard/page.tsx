"use client";

import LiveTerminalLog from "@/components/LiveTerminalLog";
import {
  Server,
  Activity,
  Cpu,
  ShieldCheck,
  Globe,
  TrendingUp,
  Clock,
  Zap
} from "lucide-react";
import FadeIn from "@/components/FadeIn";

interface SystemMetrics {
  vpsUptime: string;
  networkPing: string;
  mt5Status: "ONLINE" | "OFFLINE" | "ERROR";
  activeScripts: number;
  cpuLoad: string;
  memUsage: string;
}

const metrics: SystemMetrics = {
  vpsUptime: "14d 22h 11m",
  networkPing: "12ms",
  mt5Status: "ONLINE",
  activeScripts: 4,
  cpuLoad: "14%",
  memUsage: "1.2GB / 4GB"
};

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-text-primary">COMMAND_CENTER</h1>
          <p className="text-text-secondary font-mono text-xs uppercase tracking-widest mt-1">
            Secure Node: VPS-GLOBAL-01 // User: Admin
          </p>
        </div>
        <div className="flex gap-4">
          <div className="glass px-4 py-2 rounded-lg flex items-center gap-3">
            <Clock size={16} className="text-accent-cyan" />
            <span className="font-mono text-sm">23:44:12 UTC</span>
          </div>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          icon={<Server size={20} />}
          title="VPS Uptime"
          value={metrics.vpsUptime}
          trend="+0.02%"
        />
        <MetricCard
          icon={<Activity size={20} />}
          title="Network Ping"
          value={metrics.networkPing}
          status="optimal"
        />
        <MetricCard
          icon={<Zap size={20} />}
          title="MT5 Bot Status"
          value={metrics.mt5Status}
          status="online"
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Columns - Detailed Metrics */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass p-6 rounded-2xl space-y-6">
            <h3 className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-text-secondary border-b border-surface pb-4">
              Infrastructure Health
            </h3>
            <div className="space-y-4">
              <ProgressMetric label="CPU Load" value={14} color="cyan" />
              <ProgressMetric label="Memory Usage" value={30} color="purple" />
              <ProgressMetric label="Storage IO" value={8} color="cyan" />
            </div>
          </div>

          <div className="glass p-6 rounded-2xl">
            <h3 className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-text-secondary border-b border-surface pb-4 mb-4">
              Active Trading Scripts
            </h3>
            <div className="space-y-3">
              {["ENIGMA_GOLD_V3", "LIQUIDITY_SWEEP", "HFT_ARBITRAGE"].map((script) => (
                <div key={script} className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-surface">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="font-mono text-[10px] font-bold">{script}</span>
                  </div>
                  <TrendingUp size={14} className="text-green-500" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Columns - Live Terminal */}
        <div className="lg:col-span-2 h-[500px]">
          <LiveTerminalLog />
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon, title, value, trend, status }: {
  icon: React.ReactNode,
  title: string,
  value: string,
  trend?: string,
  status?: "online" | "optimal" | "error"
}) {
  return (
    <FadeIn className="glass p-6 rounded-2xl group hover:border-accent-cyan/30 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-accent-cyan/10 rounded-lg text-accent-cyan">
          {icon}
        </div>
        {trend && (
          <span className="text-[10px] font-mono font-bold text-green-500">{trend}</span>
        )}
        {status && (
          <div className="flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${status === 'error' ? 'bg-red-500' : 'bg-green-500'} animate-pulse`} />
            <span className="text-[10px] font-mono font-bold text-text-secondary uppercase">{status}</span>
          </div>
        )}
      </div>
      <div className="text-2xl font-mono font-bold mb-1 tracking-tight">{value}</div>
      <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-text-secondary">{title}</div>
    </FadeIn>
  );
}

function ProgressMetric({ label, value, color }: { label: string, value: number, color: "cyan" | "purple" }) {
  const colorClass = color === "cyan" ? "bg-accent-cyan" : "bg-accent-purple";
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-[10px] font-mono font-bold uppercase">
        <span className="text-text-secondary">{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-1 w-full bg-surface rounded-full overflow-hidden">
        <div
          className={`h-full ${colorClass} transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(0,242,255,0.4)]`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
