"use client";

import Link from "next/link";
import { Terminal, Lock, ChevronDown, User } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { profile, logout } = useAuth();
  const pathname = usePathname();

  const isSuperUser = profile?.role === 'super_admin' || !process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] h-16 glass border-b border-white/5 flex items-center px-6 md:px-12 justify-between">
      {/* Left: Branding */}
      <Link href="/" className="flex items-center gap-2 group">
        <div className="p-1.5 bg-accent-cyan/10 rounded-none border border-accent-cyan/20 group-hover:border-accent-cyan/50 transition-colors">
          <Terminal className="text-accent-cyan" size={18} />
        </div>
        <span className="font-mono font-bold tracking-tighter text-text-primary uppercase text-sm">
          IS_ARWAN.DEV
        </span>
      </Link>

      {/* Center: Links */}
      <div className="hidden md:flex items-center gap-8">
        <NavLink href="/#experience" label="EXPERIENCE_STREAMS" active={pathname === '/#experience'} />
        <NavLink href="/#showcase" label="PROJECT_VAULT" active={pathname === '/#showcase'} />
      </div>

      {/* Right: Status & Dashboard */}
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-black/40 border border-white/5">
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="w-1.5 h-1.5 rounded-full bg-accent-cyan shadow-[0_0_8px_rgba(0,242,255,0.6)]"
          />
          <span className="text-[9px] font-mono text-accent-cyan font-bold tracking-[0.2em] uppercase">SYS_ONLINE</span>
        </div>

        <div className="h-4 w-px bg-white/10 hidden sm:block" />

        <div className="flex items-center gap-4">
          <div className="relative group">
            <button className="font-mono text-[10px] font-bold tracking-widest text-text-secondary hover:text-accent-cyan uppercase transition-colors flex items-center gap-1">
              Console
              <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
            </button>
            <div className="absolute right-0 mt-6 w-48 py-2 bg-black/90 backdrop-blur-md border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 flex flex-col z-50">
              <Link href="/dashboard" className="px-4 py-2 text-xs font-mono text-text-secondary hover:text-accent-cyan hover:bg-white/5 transition-colors">
                Dashboard
              </Link>
              {isSuperUser && (
                <Link href="/dashboard/users" className="px-4 py-2 text-xs font-mono text-text-secondary hover:text-accent-purple hover:bg-white/5 transition-colors">
                  Users
                </Link>
              )}
              {isSuperUser && (
                <Link href="/dashboard/cms" className="px-4 py-2 text-xs font-mono text-text-secondary hover:text-accent-purple hover:bg-white/5 transition-colors">
                  CMS
                </Link>
              )}
            </div>
          </div>

          <div className="h-4 w-px bg-white/10" />

          {profile ? (
            <div className="relative group">
              <button className="flex items-center gap-2 focus:outline-none">
                {profile.photoURL ? (
                  <img src={profile.photoURL} alt="Profile" className="w-8 h-8 rounded-full border border-white/10 group-hover:border-accent-cyan transition-colors object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/10 group-hover:border-accent-cyan transition-colors">
                    <User size={16} className="text-text-secondary group-hover:text-accent-cyan transition-colors" />
                  </div>
                )}
              </button>
              <div className="absolute right-0 mt-2 w-48 py-2 bg-black/90 backdrop-blur-md border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 flex flex-col z-50">
                <div className="px-4 py-2 border-b border-white/5 mb-1 text-xs text-text-secondary truncate">
                  {profile.email}
                </div>
                <Link href="/profile" className="px-4 py-2 text-xs font-mono text-text-secondary hover:text-accent-cyan hover:bg-white/5 transition-colors">
                  My Profile
                </Link>
                <button onClick={() => logout()} className="w-full text-left px-4 py-2 text-xs font-mono text-text-secondary hover:text-red-400 hover:bg-white/5 transition-colors">
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              className={`p-2 hover:bg-white/5 transition-colors group ${pathname === '/login' ? 'text-accent-cyan' : 'text-text-secondary'}`}
              title="SECURE_ACCESS"
            >
              <Lock size={18} className="group-hover:scale-110 transition-transform" />
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, label, active }: { href: string, label: string, active: boolean }) {
  return (
    <Link
      href={href}
      className={`font-mono text-[10px] font-bold tracking-widest transition-all hover:text-accent-cyan relative group ${active ? 'text-accent-cyan' : 'text-text-secondary'}`}
    >
      {label}
      <span className={`absolute -bottom-1 left-0 h-[1px] bg-accent-cyan transition-all duration-300 ${active ? 'w-full' : 'w-0 group-hover:w-full'}`} />
    </Link>
  );
}
