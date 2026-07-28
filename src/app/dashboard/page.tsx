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
  Database,
  Users,
  CreditCard,
  FolderOpen,
  CheckCircle,
  BarChart,
  HardDrive
} from "lucide-react";
import FadeIn from "@/components/FadeIn";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { doc, onSnapshot, collection, getDocs, query, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/context/ToastContext";

export default function DashboardPage() {
  const { profile } = useAuth();
  const terminalRef = useRef<TerminalHandle>(null);
  const { info } = useToast();
  const hasShownSystemReady = useRef(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [showWelcome, setShowWelcome] = useState(false);

  // States for new metrics
  const [adminMetrics, setAdminMetrics] = useState<any>(null);
  const [userMetrics, setUserMetrics] = useState<any>(null);
  const [realUsers, setRealUsers] = useState<any[]>([]);

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
    const initTimer = setTimeout(() => {
      setIsInitializing(false);
      if (!hasShownSystemReady.current) {
        info("SYSTEM_READY", "Dashboard telemetry online and streaming.");
        hasShownSystemReady.current = true;
      }
      
      // Inject initial terminal logs based on role
      if (isSuperUser) {
        terminalRef.current?.addLog(`[SYSTEM] Super Admin clearance verified.`);
        terminalRef.current?.addLog(`[SYNC] Fetching global user metrics...`);
      } else {
        terminalRef.current?.addLog(`[SYSTEM] Workspace initialized for ${profile?.role?.toUpperCase() || 'GUEST'}.`);
        terminalRef.current?.addLog(`[SYNC] Connecting to personal document vault...`);
      }
    }, 1200);

    let activeUsers: any[] = [];

    // Mock Data Fetching (Mixing with real if needed)
    setTimeout(async () => {
      if (isSuperUser) {
        // Try fetching real users for dynamic logs
        try {
          if (process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
             const q = query(collection(db, "users"), limit(10));
             const snapshot = await getDocs(q);
             activeUsers = snapshot.docs.map(d => d.data());
             setRealUsers(activeUsers);
          }
        } catch (error) {
          console.warn("Failed to fetch real users", error);
        }

        setAdminMetrics({
          totalUsers: activeUsers.length > 0 ? 1240 + activeUsers.length : 1248,
          activeSubs: 86,
          mrr: "$4,250",
          serverUptime: "99.98%",
          dbLoad: 42,
          apiTraffic: 78,
          errorRate: 2
        });
        terminalRef.current?.addLog(`[SUCCESS] Global metrics synced successfully.`);
      } else {
        // Mock user data (Profile completion, docs generated)
        setUserMetrics({
          profileCompletion: 85,
          docsGenerated: 4,
          quotaStatus: "OPTIMAL",
          resumeAtsScore: 92,
          coverLetterMatch: 88,
          cloudSync: 15
        });
        terminalRef.current?.addLog(`[SUCCESS] Personal vault synced. All systems green.`);
      }
    }, 2000);

    // Dynamic random logs simulation
    const logInterval = setInterval(() => {
       if (isSuperUser) {
          const randomUser = activeUsers.length > 0 ? activeUsers[Math.floor(Math.random() * activeUsers.length)] : null;
          const userLog = randomUser && randomUser.email 
             ? `[INFO] Active session check: ${randomUser.email} (${randomUser.role})`
             : "[INFO] New user registration: dummy.user@example.com";

          const logs = [
            userLog,
            "[EXEC] Automated backup completed for Database Cluster A",
            "[WARN] High CPU load detected on PDF Render Node 02",
            "[INFO] Subscription upgraded: sarah.w@tech.co -> PRO",
            "[SYNC] Invoicing data synchronized with Stripe Gateway",
            `[AUTH] RBAC validation passed for node /dashboard/cms`
          ];
          terminalRef.current?.addLog(logs[Math.floor(Math.random() * logs.length)]);
       } else {
          const logs = [
            "[INFO] Background ATS keyword analysis running...",
            "[SYNC] Personal template settings verified.",
            "[INFO] Render engine ready for DOCX export.",
            "[EXEC] Checking font sub-setting for active CV...",
            "[INFO] Cloud vault connection ping: 14ms"
          ];
          terminalRef.current?.addLog(logs[Math.floor(Math.random() * logs.length)]);
       }
    }, 6000);

    return () => {
      clearTimeout(initTimer);
      clearInterval(logInterval);
    };
  }, [info, isSuperUser, profile?.role]);

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
        
        {/* Dynamic Tile 1 based on Role */}
        {isSuperUser ? (
          <ToolLink
            href="/dashboard/cms"
            icon={<Layout size={20} />}
            title="SYSTEM_CMS"
            desc="Manage Infrastructure Data"
            accent="purple"
          />
        ) : (
          <ToolLink
            href="/dashboard/documents"
            icon={<FolderOpen size={20} />}
            title="DOCUMENT_VAULT"
            desc="Saved Resumes & Letters"
            accent="purple"
          />
        )}

        {/* Dynamic Tile 2 based on Role */}
        {isSuperUser ? (
          <ToolLink
            href="/dashboard/billing"
            icon={<CreditCard size={20} />}
            title="BILLING_GATEWAY"
            desc="Invoicing & Subscriptions"
            accent="cyan"
          />
        ) : (
          <ToolLink
            href="/dashboard/quota"
            icon={<Database size={20} />}
            title="ACCOUNT_QUOTA"
            desc="Manage Export Limits (Pro)"
            accent="cyan"
          />
        )}
      </FadeIn>

      {/* Top Metrics Row */}
      <FadeIn delay={0.4} staggerChildren={0.1} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isSuperUser ? (
          <>
            <MetricCard icon={<Users size={20} />} title="Total Users" value={adminMetrics?.totalUsers?.toLocaleString()} trend="+12" loading={isInitializing || !adminMetrics} />
            <MetricCard icon={<CheckCircle size={20} />} title="Active Subs" value={adminMetrics?.activeSubs?.toLocaleString()} status="optimal" loading={isInitializing || !adminMetrics} />
            <MetricCard icon={<BarChart size={20} />} title="Monthly Revenue" value={adminMetrics?.mrr} trend="+5.4%" loading={isInitializing || !adminMetrics} />
          </>
        ) : (
          <>
            <MetricCard icon={<CheckCircle size={20} />} title="Profile Completion" value={`${userMetrics?.profileCompletion || 0}%`} trend="Optimal" loading={isInitializing || !userMetrics} />
            <MetricCard icon={<FileText size={20} />} title="Docs Generated" value={userMetrics?.docsGenerated?.toString()} status="optimal" loading={isInitializing || !userMetrics} />
            <MetricCard icon={<Database size={20} />} title="Pro Quota" value={userMetrics?.quotaStatus} status={userMetrics?.quotaStatus === 'OPTIMAL' ? 'online' : 'error'} loading={isInitializing || !userMetrics} />
          </>
        )}
      </FadeIn>

      {/* Main Grid */}
      <FadeIn delay={0.6} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="glass p-6 rounded-none space-y-6">
            <h3 className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-text-secondary border-b border-white/5 pb-4">
              {isSuperUser ? 'Global_Infrastructure' : 'Profile_Analytics'}
            </h3>
            
            {isSuperUser ? (
              <div className="space-y-6">
                <ProgressMetric label="Database Load" value={adminMetrics?.dbLoad} color="cyan" loading={isInitializing || !adminMetrics} />
                <ProgressMetric label="API Traffic" value={adminMetrics?.apiTraffic} color="purple" loading={isInitializing || !adminMetrics} />
                <ProgressMetric label="Error Rate" value={adminMetrics?.errorRate} color="cyan" loading={isInitializing || !adminMetrics} />
              </div>
            ) : (
              <div className="space-y-6">
                <ProgressMetric label="Resume ATS Match" value={userMetrics?.resumeAtsScore} color="cyan" loading={isInitializing || !userMetrics} />
                <ProgressMetric label="CL Quality Score" value={userMetrics?.coverLetterMatch} color="purple" loading={isInitializing || !userMetrics} />
                <ProgressMetric label="Vault Capacity Used" value={userMetrics?.cloudSync} color="cyan" loading={isInitializing || !userMetrics} />
              </div>
            )}
          </div>

          {profile?.role === 'guest' && (
            <div className="bg-accent-purple/5 border border-accent-purple/20 p-6 rounded-none flex gap-4">
              <ShieldAlert className="text-accent-purple shrink-0 animate-pulse" size={24} />
              <div>
                <p className="text-xs font-bold text-text-primary uppercase tracking-tight">Access Restricted</p>
                <p className="text-[10px] text-text-secondary mt-1 font-mono uppercase leading-relaxed">
                  Your account is flagged as GUEST. Pro templates and DOCX exports are locked.
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
    <Link href={href} className={`glass p-4 rounded-none transition-all duration-300 group ${hoverClass} h-full flex flex-col`}>
      <div className={`mb-3 ${accentClass} group-hover:scale-110 transition-transform origin-left`}>{icon}</div>
      <div className="font-mono text-xs font-bold tracking-tight uppercase mt-auto">{title}</div>
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
