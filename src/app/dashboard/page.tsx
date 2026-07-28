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
  Mail,
  Lock,
  ShieldAlert,
  Database
} from "lucide-react";
import FadeIn from "@/components/FadeIn";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { doc, onSnapshot, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { SystemMetrics } from "@/types";
import { useToast } from "@/context/ToastContext";

export default function DashboardPage() {
  const { profile } = useAuth();
  const terminalRef = useRef<TerminalHandle>(null);
  const toast = useToast();
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    if (profile) {
      const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
      if (!hasSeenWelcome) {
        setShowWelcome(true);
      }
    }
  }, [profile]);

  const closeWelcome = () => {
    localStorage.setItem('hasSeenWelcome', 'true');
    setShowWelcome(false);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour12: false, timeZone: 'UTC' }) + ' UTC');
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const isSuperUser = profile?.role === 'super_admin';

  useEffect(() => {
    // Fake initialization delay for cinematic effect
    const initTimer = setTimeout(() => {
      setIsInitializing(false);
      toast.info("SYSTEM_READY", "Dashboard telemetry online and streaming.");
    }, 1200);

    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
      setTimeout(() => {
        setMetrics({
          vpsUptime: "14d 22h 11m",
          networkPing: "12ms",
          mt5Status: "ONLINE",
          cpuLoad: 14,
          memoryUsage: 30,
          storageIO: 8,
          updatedAt: Timestamp.now()
        });
      }, 1500);
      return () => clearTimeout(initTimer);
    }

    const unsubscribe = onSnapshot(doc(db, "system", "metrics"), (doc) => {
      if (doc.exists()) {
        setMetrics(doc.data() as SystemMetrics);
        terminalRef.current?.addLog(`[SYNC] System metrics updated from Firestore`);
      }
    });

    return () => {
      clearTimeout(initTimer);
      unsubscribe();
    };
  }, [toast]);

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 space-y-8 relative">
      {/* Welcome Onboarding Modal */}
      {showWelcome && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <FadeIn className="glass p-8 max-w-md w-full rounded-xl border border-accent-cyan/30 relative shadow-[0_0_30px_rgba(0,242,255,0.1)]">
            <h2 className="text-2xl font-mono font-bold text-white mb-2">Welcome to the System</h2>
            <p className="text-text-secondary text-sm leading-relaxed mb-6">
              Your profile has been successfully initialized. You are currently logged in as a 
              <span className="text-accent-cyan font-mono uppercase ml-1">{profile?.role || 'guest'}</span>. 
              Explore the CV Builder and Dashboard telemetry.
            </p>
            <button 
              onClick={closeWelcome}
              className="w-full py-3 bg-accent-cyan text-background font-mono font-bold uppercase tracking-widest hover:bg-white transition-colors"
            >
              Initialize Workspace
            </button>
          </FadeIn>
        </div>
      )}

      {/* Header */}
      <FadeIn delay={0.1} direction="down" className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter text-text-primary uppercase">COMMAND_CENTER</h1>
          <p className="text-text-secondary font-mono text-[10px] uppercase tracking-[0.2em] mt-1">
            Secure Node: VPS-GLOBAL-01 {" // "} Role: [ {(profile?.role || 'GUEST').toUpperCase().replace('_', ' ')} ] {" // "} Status: <span className="text-accent-cyan">CONNECTED</span>
          </p>
        </div>
        <div className="flex gap-4">
          <div className="glass px-4 py-2 rounded-none flex items-center gap-3 border-accent-cyan/20">
            <Clock size={14} className="text-accent-cyan" />
            <span className="font-mono text-xs">{currentTime || '00:00:00 UTC'}</span>
          </div>
        </div>
      </FadeIn>

      {/* Navigation Tools */}
      <FadeIn delay={0.2} staggerChildren={0.08} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ToolLink
          href="/tools/cv-builder"
          icon={<FileText size={20} />}
          title="CV_CONSTRUCTOR"
          desc="ATS-Optimized Resumes"
        />
        <ToolLink
          href="/tools/cover-letter"
          icon={<Mail size={20} />}
          title="CL_CONSTRUCTOR"
          desc="ATS Cover Letters"
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

        {/* Network Scanner */}
        <div className="relative overflow-hidden group">
          <div className="glass p-4 rounded-none h-full border-accent-cyan/20">
             <Database size={20} className="mb-3 text-accent-cyan group-hover:scale-110 transition-transform" />
             <div className="font-mono text-xs font-bold uppercase">NETWORK_SCANNER</div>
             {profile?.role === 'family' || profile?.role === 'super_admin' ? (
                <div className="mt-2">
                  <div className="text-[9px] font-mono text-accent-cyan animate-pulse">STATUS: SCANNING...</div>
                  <div className="w-full bg-white/5 h-1 mt-2 relative overflow-hidden">
                    <div className="absolute top-0 bottom-0 w-1/3 bg-accent-cyan shadow-[0_0_10px_#00F2FF] animate-[slide_2s_ease-in-out_infinite]" />
                  </div>
                </div>
             ) : (
                <div className="text-[9px] font-mono mt-1 text-text-secondary">MODULE_LOCKED</div>
             )}
          </div>
          {profile?.role === 'guest' && (
            <div className="absolute inset-0 bg-red-900/40 backdrop-blur-sm border border-red-500/50 flex flex-col items-center justify-center z-10 transition-opacity">
               <ShieldAlert size={16} className="text-red-500 mb-1" />
               <span className="font-mono text-[9px] font-bold text-red-500 uppercase tracking-widest text-center px-2">LOCKED - GUEST RESTRICTED</span>
            </div>
          )}
        </div>

        {/* Threat Defense */}
        {(
          <div className="relative overflow-hidden group">
            <div className="glass p-4 rounded-none h-full border-accent-purple/20">
               <ShieldAlert size={20} className="mb-3 text-accent-purple group-hover:scale-110 transition-transform" />
               <div className="font-mono text-xs font-bold uppercase">THREAT_DEFENSE</div>
               {profile?.role === 'family' || profile?.role === 'super_admin' ? (
                  <div className="mt-2">
                    <div className="text-[9px] font-mono text-accent-purple animate-pulse">STATUS: MONITORING...</div>
                    <div className="flex gap-1 mt-2">
                      {[1,2,3].map(i => (
                        <div key={i} className={`h-1.5 w-1.5 rounded-full bg-accent-purple shadow-[0_0_8px_#8A2BE2] animate-ping`} style={{animationDelay: `${i * 0.2}s`}} />
                      ))}
                    </div>
                  </div>
               ) : (
                  <div className="text-[9px] font-mono mt-1 text-text-secondary">OFFLINE</div>
               )}
            </div>
            {profile?.role === 'guest' && (
              <div className="absolute inset-0 bg-red-900/40 backdrop-blur-sm border border-red-500/50 flex flex-col items-center justify-center z-10 transition-opacity">
                 <Lock size={16} className="text-red-500 mb-1" />
                 <span className="font-mono text-[9px] font-bold text-red-500 uppercase tracking-widest text-center px-2">LOCKED - GUEST RESTRICTED</span>
              </div>
            )}
          </div>
        )}
      </FadeIn>

      {/* Top Metrics Row */}
      <FadeIn delay={0.4} staggerChildren={0.1} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          icon={<Server size={20} />}
          title="VPS-01 Uptime"
          value={metrics?.vpsUptime}
          trend="+0.02%"
          loading={isInitializing || !metrics}
        />
        <MetricCard
          icon={<Activity size={20} />}
          title="MikroTik 52ac"
          value={metrics?.networkPing}
          status="optimal"
          loading={isInitializing || !metrics}
        />
        <MetricCard
          icon={<Zap size={20} />}
          title="MT5 Enigma v3"
          value={metrics?.mt5Status}
          status={metrics?.mt5Status === 'ONLINE' ? 'online' : 'error'}
          loading={isInitializing || !metrics}
        />
      </FadeIn>

      {/* Main Grid */}
      <FadeIn delay={0.6} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="glass p-6 rounded-none space-y-6">
            <h3 className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-text-secondary border-b border-white/5 pb-4">
              Infrastructure_Health
            </h3>
            <div className="space-y-6">
              <ProgressMetric label="CPU Load" value={metrics?.cpuLoad} color="cyan" loading={isInitializing || !metrics} />
              <ProgressMetric label="Memory Usage" value={metrics?.memoryUsage} color="purple" loading={isInitializing || !metrics} />
              <ProgressMetric label="Storage IO" value={metrics?.storageIO} color="cyan" loading={isInitializing || !metrics} />
            </div>
          </div>

          {profile?.role === 'guest' && process.env.NEXT_PUBLIC_FIREBASE_API_KEY && (
            <div className="bg-accent-purple/5 border border-accent-purple/20 p-6 rounded-none flex gap-4">
              <ShieldAlert className="text-accent-purple shrink-0 animate-pulse" size={24} />
              <div>
                <p className="text-xs font-bold text-text-primary uppercase tracking-tight">Access Restricted</p>
                <p className="text-[10px] text-text-secondary mt-1 font-mono uppercase leading-relaxed">
                  Your account is flagged as GUEST. Technical CRUD nodes are locked. Contact SUPER_USER for elevation.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 h-[300px] sm:h-[400px] lg:h-[500px]">
          <LiveTerminalLog ref={terminalRef} />
        </div>
      </FadeIn>
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

function MetricCard({ icon, title, value, trend, status, loading }: {
  icon: React.ReactNode,
  title: string,
  value?: string,
  trend?: string,
  status?: "online" | "optimal" | "error",
  loading?: boolean
}) {
  return (
    <div className="glass p-6 rounded-none group hover:border-accent-cyan/30 transition-all duration-500 relative overflow-hidden">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-white/5 rounded-none text-accent-cyan border border-white/5">
          {icon}
        </div>
        {!loading && trend && (
          <span className="text-[10px] font-mono font-bold text-green-500 animate-slide-down">{trend}</span>
        )}
        {!loading && status && (
          <div className="flex items-center gap-1.5 animate-slide-down">
            <div className={`w-1.5 h-1.5 rounded-full ${status === 'error' ? 'bg-red-500' : 'bg-green-400'} animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.5)]`} />
            <span className="text-[10px] font-mono font-bold text-text-secondary uppercase">{status}</span>
          </div>
        )}
      </div>
      
      {loading ? (
        <div className="h-9 bg-white/5 rounded w-1/2 mb-1 animate-pulse" />
      ) : (
        <div className="text-3xl font-mono font-bold mb-1 tracking-tighter text-text-primary animate-slide-down">{value}</div>
      )}
      
      <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-text-secondary font-bold">{title}</div>
      
      {/* Loading shimmer overlay */}
      {loading && (
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
      )}
    </div>
  );
}

function ProgressMetric({ label, value, color, loading }: { label: string, value?: number, color: "cyan" | "purple", loading?: boolean }) {
  const colorClass = color === "cyan" ? "bg-accent-cyan shadow-cyan-glow" : "bg-accent-purple shadow-purple-glow";
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-[10px] font-mono font-bold uppercase tracking-widest">
        <span className="text-text-secondary">{label}</span>
        {loading ? (
          <div className="h-3 w-8 bg-white/10 rounded animate-pulse" />
        ) : (
          <span className={color === 'cyan' ? 'text-accent-cyan' : 'text-accent-purple'}>{value}%</span>
        )}
      </div>
      <div className="h-[2px] w-full bg-white/5 rounded-full overflow-hidden relative">
        <div
          className={`h-full ${colorClass} transition-all duration-1000 ease-out`}
          style={{ width: loading ? '0%' : `${value}%` }}
        />
        {loading && (
          <div className="absolute inset-0 bg-white/20 animate-pulse" />
        )}
      </div>
    </div>
  );
}
