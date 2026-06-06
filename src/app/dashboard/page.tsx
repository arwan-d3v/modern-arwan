"use client";

import LiveTerminalLog from "@/components/LiveTerminalLog";
import {
  Server,
  Activity,
  Cpu,
  Zap,
  Clock,
  Layout,
  FileText,
  ShieldAlert
} from "lucide-react";
import FadeIn from "@/components/FadeIn";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

interface SystemMetrics {
  vpsUptime: string;
  networkPing: string;
  mt5Status: "ONLINE" | "OFFLINE" | "ERROR";
  activeScripts: number;
}

const metrics: SystemMetrics = {
  vpsUptime: "14d 22h 11m",
  networkPing: "12ms",
  mt5Status: "ONLINE",
  activeScripts: 4,
};

export default function DashboardPage() {
  const { profile } = useAuth();
  const isSuperUser = profile?.role === 'SUPER_USER' || !process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-text-primary uppercase">COMMAND_CENTER</h1>
          <p className="text-text-secondary font-mono text-xs uppercase tracking-widest mt-1">
            Secure Node: VPS-GLOBAL-01 // Role: {profile?.role || 'GUEST'}
          </p>
        </div>
        <div className="flex gap-4">
          <div className="glass px-4 py-2 rounded-lg flex items-center gap-3">
            <Clock size={16} className="text-accent-cyan" />
            <span className="font-mono text-sm">23:44:12 UTC</span>
          </div>
        </div>
      </div>

      {/* Navigation Tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ToolLink
          href="/tools/cv-builder"
          icon={<FileText size={20} />}
          title="CV_CONSTRUCTOR"
          desc="ATS-Optimized Resumes"
        />
        {isSuperUser && (
          <ToolLink
            href="/dashboard/cms"
            icon={<Layout size={20} />}
            title="SYSTEM_CMS"
            desc="Manage Infrastructure Data"
            accent="purple"
          />
        )}
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

          {profile?.role === 'GUEST' && process.env.NEXT_PUBLIC_FIREBASE_API_KEY && (
            <div className="bg-accent-purple/10 border border-accent-purple/20 p-6 rounded-2xl flex gap-4">
              <ShieldAlert className="text-accent-purple shrink-0" size={24} />
              <div>
                <p className="text-xs font-bold text-text-primary uppercase tracking-tight">Access Restricted</p>
                <p className="text-[10px] text-text-secondary mt-1 font-mono uppercase leading-relaxed">
                  Your account is flagged as GUEST. Technical CRUD nodes are locked.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 h-[500px]">
          <LiveTerminalLog />
        </div>
      </div>
    </div>
  );
}

function ToolLink({ href, icon, title, desc, accent = "cyan" }: { href: string, icon: React.ReactNode, title: string, desc: string, accent?: "cyan" | "purple" }) {
  const accentClass = accent === "cyan" ? "text-accent-cyan" : "text-accent-purple";
  return (
    <Link href={href} className="glass p-4 rounded-xl hover:bg-surface/80 transition-all group border-l-4 border-l-transparent hover:border-l-current">
      <div className={`mb-3 ${accentClass} group-hover:scale-110 transition-transform`}>{icon}</div>
      <div className="font-mono text-xs font-bold tracking-tight">{title}</div>
      <div className="text-[9px] text-text-secondary font-mono mt-1 uppercase">{desc}</div>
    </Link>
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
