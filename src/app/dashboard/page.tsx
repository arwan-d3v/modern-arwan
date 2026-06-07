"use client";

import { useEffect, useState, useRef } from "react";
import LiveTerminalLog, { TerminalHandle } from "@/components/LiveTerminalLog";
import {
  Server,
  Activity,
  Zap,
  Clock,
  Layout,
  FileText,
  ShieldAlert,
  Database
} from "lucide-react";
import FadeIn from "@/components/FadeIn";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { doc, onSnapshot, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { SystemMetrics } from "@/types";

export default function DashboardPage() {
  const { profile } = useAuth();
  const terminalRef = useRef<TerminalHandle>(null);
  const [metrics, setMetrics] = useState<SystemMetrics>({
    vpsUptime: "14d 22h 11m",
    networkPing: "12ms",
    mt5Status: "ONLINE",
    cpuLoad: 14,
    memoryUsage: 30,
    storageIO: 8,
    updatedAt: Timestamp.now()
  });

  const isSuperUser = profile?.role === 'SUPER_USER' || !process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) return;

    // Real-time listener for system metrics
    const unsubscribe = onSnapshot(doc(db, "system", "metrics"), (doc) => {
      if (doc.exists()) {
        setMetrics(doc.data() as SystemMetrics);
        terminalRef.current?.addLog(`[SYNC] System metrics updated from Firestore`);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter text-text-primary uppercase">COMMAND_CENTER</h1>
          <p className="text-text-secondary font-mono text-[10px] uppercase tracking-[0.2em] mt-1">
            Secure Node: VPS-GLOBAL-01 {" // "} Role: {profile?.role || 'GUEST'} {" // "} Status: <span className="text-accent-cyan">CONNECTED</span>
          </p>
        </div>
        <div className="flex gap-4">
          <div className="glass px-4 py-2 rounded-none flex items-center gap-3 border-accent-cyan/20">
            <Clock size={14} className="text-accent-cyan" />
            <span className="font-mono text-xs">23:44:12 UTC</span>
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
        <div className="glass p-4 rounded-none opacity-40 cursor-not-allowed border-dashed">
           <Database size={20} className="mb-3" />
           <div className="font-mono text-xs font-bold">NETWORK_SCANNER</div>
           <div className="text-[9px] font-mono mt-1">MODULE_LOCKED</div>
        </div>
        <div className="glass p-4 rounded-none opacity-40 cursor-not-allowed border-dashed">
           <ShieldAlert size={20} className="mb-3" />
           <div className="font-mono text-xs font-bold">THREAT_DEFENSE</div>
           <div className="text-[9px] font-mono mt-1">OFFLINE</div>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          icon={<Server size={20} />}
          title="VPS-01 Uptime"
          value={metrics.vpsUptime}
          trend="+0.02%"
        />
        <MetricCard
          icon={<Activity size={20} />}
          title="MikroTik 52ac"
          value={metrics.networkPing}
          status="optimal"
        />
        <MetricCard
          icon={<Zap size={20} />}
          title="MT5 Enigma v3"
          value={metrics.mt5Status}
          status={metrics.mt5Status === 'ONLINE' ? 'online' : 'error'}
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="glass p-6 rounded-none space-y-6">
            <h3 className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-text-secondary border-b border-white/5 pb-4">
              Infrastructure_Health
            </h3>
            <div className="space-y-6">
              <ProgressMetric label="CPU Load" value={metrics.cpuLoad} color="cyan" />
              <ProgressMetric label="Memory Usage" value={metrics.memoryUsage} color="purple" />
              <ProgressMetric label="Storage IO" value={metrics.storageIO} color="cyan" />
            </div>
          </div>

          {profile?.role === 'GUEST' && process.env.NEXT_PUBLIC_FIREBASE_API_KEY && (
            <div className="bg-accent-purple/5 border border-accent-purple/20 p-6 rounded-none flex gap-4">
              <ShieldAlert className="text-accent-purple shrink-0" size={24} />
              <div>
                <p className="text-xs font-bold text-text-primary uppercase tracking-tight">Access Restricted</p>
                <p className="text-[10px] text-text-secondary mt-1 font-mono uppercase leading-relaxed">
                  Your account is flagged as GUEST. Technical CRUD nodes are locked. Contact SUPER_USER for elevation.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 h-[500px]">
          <LiveTerminalLog ref={terminalRef} />
        </div>
      </div>
    </div>
  );
}

function ToolLink({ href, icon, title, desc, accent = "cyan" }: { href: string, icon: React.ReactNode, title: string, desc: string, accent?: "cyan" | "purple" }) {
  const accentClass = accent === "cyan" ? "text-accent-cyan" : "text-accent-purple";
  const hoverClass = accent === "cyan" ? "hover:border-accent-cyan/40 hover:shadow-cyan-glow" : "hover:border-accent-purple/40 hover:shadow-purple-glow";

  return (
    <Link href={href} className={`glass p-4 rounded-none transition-all duration-300 group ${hoverClass}`}>
      <div className={`mb-3 ${accentClass} group-hover:scale-110 transition-transform`}>{icon}</div>
      <div className="font-mono text-xs font-bold tracking-tight uppercase">{title}</div>
      <div className="text-[9px] text-text-secondary font-mono mt-1 uppercase tracking-tighter">{desc}</div>
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
    <FadeIn className="glass p-6 rounded-none group hover:border-accent-cyan/30 transition-all duration-500">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-white/5 rounded-none text-accent-cyan border border-white/5">
          {icon}
        </div>
        {trend && (
          <span className="text-[10px] font-mono font-bold text-green-500">{trend}</span>
        )}
        {status && (
          <div className="flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${status === 'error' ? 'bg-red-500' : 'bg-green-400'} animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.5)]`} />
            <span className="text-[10px] font-mono font-bold text-text-secondary uppercase">{status}</span>
          </div>
        )}
      </div>
      <div className="text-3xl font-mono font-bold mb-1 tracking-tighter text-text-primary">{value}</div>
      <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-text-secondary font-bold">{title}</div>
    </FadeIn>
  );
}

function ProgressMetric({ label, value, color }: { label: string, value: number, color: "cyan" | "purple" }) {
  const colorClass = color === "cyan" ? "bg-accent-cyan shadow-cyan-glow" : "bg-accent-purple shadow-purple-glow";
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-[10px] font-mono font-bold uppercase tracking-widest">
        <span className="text-text-secondary">{label}</span>
        <span className={color === 'cyan' ? 'text-accent-cyan' : 'text-accent-purple'}>{value}%</span>
      </div>
      <div className="h-[2px] w-full bg-white/5 rounded-full overflow-hidden">
        <div
          className={`h-full ${colorClass} transition-all duration-1000 ease-out`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
