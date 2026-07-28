"use client";
import React from 'react';

import Link from "next/link";
import { Terminal, Lock, ChevronDown, User, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import DarkModeToggle from "@/components/DarkModeToggle";

export default function Navbar() {
  const { profile, logout } = useAuth();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const isSuperUser = profile?.role === 'super_admin';

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[100] h-16 glass border-b border-surface flex items-center px-6 md:px-12 justify-between">
      {/* Left: Hamburger & Branding */}
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <button className="md:hidden p-2 -ml-2" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <Menu size={20} className="text-text-primary" />
        </button>
        
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-1.5 bg-accent-cyan/10 rounded-none border border-accent-cyan/20 group-hover:border-accent-cyan/50 transition-colors">
            <Terminal className="text-accent-cyan" size={18} />
          </div>
          <span className="font-mono font-bold tracking-tighter text-text-primary uppercase text-sm">
            IS_ARWAN.DEV
          </span>
        </Link>
      </div>

      {/* Center: Links (desktop) */}
      <div className="hidden md:flex items-center gap-4 lg:gap-8">
        <NavLink href="/about" label="ABOUT" active={pathname === '/about'} />
        <NavLink href="/#experience" label="EXPERIENCE" active={pathname === '/#experience'} />
        <NavLink href="/#showcase" label="PROJECTS" active={pathname === '/#showcase'} />
        <NavLink href="/testimonials" label="TESTIMONIALS" active={pathname === '/testimonials'} />
        <NavLink href="/blog" label="LOGS" active={pathname === '/blog'} />
        <NavLink href="/contact" label="CONTACT" active={pathname === '/contact'} />
      </div>

      {/* Right: Status & Dashboard */}
      <div className="flex items-center gap-2 sm:gap-4">
        <DarkModeToggle />
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 dark:bg-black/40 bg-white/40 border border-surface">
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="w-1.5 h-1.5 rounded-full bg-accent-cyan shadow-[0_0_8px_rgba(0,242,255,0.6)]"
          />
          <span className="text-[9px] font-mono text-accent-cyan font-bold tracking-[0.2em] uppercase">SYS_ONLINE</span>
        </div>
        <div className="h-4 w-px bg-surface hidden sm:block" />
        <div className="flex items-center gap-2 md:gap-4">
          <div className="relative group hidden sm:block">
            <button className="font-mono text-[10px] font-bold tracking-widest text-text-secondary hover:text-accent-cyan uppercase transition-colors flex items-center gap-1">
              Console
              <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
            </button>
            <div className="absolute right-0 mt-6 w-48 py-2 bg-background/90 backdrop-blur-md border border-surface opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 flex flex-col z-50">
              <Link href="/dashboard" className="px-4 py-2 text-xs font-mono text-text-secondary hover:text-accent-cyan dark:hover:bg-white/5 hover:bg-black/5 transition-colors">
                Dashboard
              </Link>
              {isSuperUser && (
                <Link href="/dashboard/users" className="px-4 py-2 text-xs font-mono text-text-secondary hover:text-accent-purple dark:hover:bg-white/5 hover:bg-black/5 transition-colors">
                  Users
                </Link>
              )}
              {isSuperUser && (
                <Link href="/dashboard/cms" className="px-4 py-2 text-xs font-mono text-text-secondary hover:text-accent-purple dark:hover:bg-white/5 hover:bg-black/5 transition-colors">
                  CMS
                </Link>
              )}
            </div>
          </div>
          <div className="h-4 w-px bg-surface hidden sm:block" />
          {profile ? (
            <div className="relative group">
              <button className="flex items-center gap-2 focus:outline-none">
                {profile.photoURL ? (
                  <img src={profile.photoURL} alt="Profile" className="w-8 h-8 rounded-full border border-surface group-hover:border-accent-cyan transition-colors object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full dark:bg-white/10 bg-black/5 flex items-center justify-center border border-surface group-hover:border-accent-cyan transition-colors">
                    <User size={16} className="text-text-secondary group-hover:text-accent-cyan transition-colors" />
                  </div>
                )}
              </button>
              <div className="absolute right-0 mt-2 w-48 py-2 bg-background/90 backdrop-blur-md border border-surface opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 flex flex-col z-50">
                <div className="px-4 py-2 border-b border-surface mb-1 text-xs text-text-secondary truncate">
                  {profile.email}
                </div>
                <Link href="/profile" className="px-4 py-2 text-xs font-mono text-text-secondary hover:text-accent-cyan dark:hover:bg-white/5 hover:bg-black/5 transition-colors">
                  My Profile
                </Link>
                <button onClick={() => logout()} className="w-full text-left px-4 py-2 text-xs font-mono text-text-secondary hover:text-red-400 dark:hover:bg-white/5 hover:bg-black/5 transition-colors">
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              className={`p-2 dark:hover:bg-white/5 hover:bg-black/5 transition-colors group ${pathname === '/login' ? 'text-accent-cyan' : 'text-text-secondary'}`}
              title="SECURE_ACCESS"
            >
              <Lock size={18} className="group-hover:scale-110 transition-transform" />
            </Link>
          )}
        </div>
      </div>

      {/* Mobile menu overlay and panel are rendered outside nav to escape backdrop-filter containing block */}
    </nav>

    <AnimatePresence>
      {menuOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/60 z-[105] md:hidden" 
            onClick={() => setMenuOpen(false)} 
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 w-[280px] bg-background border-r border-surface flex flex-col p-6 z-[110] md:hidden shadow-2xl overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-8">
              <span className="font-mono font-bold tracking-tighter text-accent-cyan uppercase text-sm">
                MENU
              </span>
              <button className="p-2 -mr-2 text-text-secondary hover:text-text-primary transition-colors" onClick={() => setMenuOpen(false)} aria-label="Close menu">
                <X size={24} />
              </button>
            </div>
            <div className="flex flex-col gap-6">
              <NavLink href="/about" label="ABOUT" active={pathname === '/about'} onClick={() => setMenuOpen(false)} />
              <NavLink href="/#experience" label="EXPERIENCE" active={pathname === '/#experience'} onClick={() => setMenuOpen(false)} />
              <NavLink href="/#showcase" label="PROJECTS" active={pathname === '/#showcase'} onClick={() => setMenuOpen(false)} />
              <NavLink href="/testimonials" label="TESTIMONIALS" active={pathname === '/testimonials'} onClick={() => setMenuOpen(false)} />
              <NavLink href="/blog" label="LOGS" active={pathname === '/blog'} onClick={() => setMenuOpen(false)} />
              <NavLink href="/contact" label="CONTACT" active={pathname === '/contact'} onClick={() => setMenuOpen(false)} />
            </div>
            {/* Replicate right side links for mobile */}
            <div className="mt-8 pt-8 border-t border-surface flex flex-col gap-6">
              {profile ? (
                <Link href="/profile" onClick={() => setMenuOpen(false)} className="text-sm font-mono text-text-secondary hover:text-accent-cyan">
                  Profile
                </Link>
              ) : (
                <Link href="/login" onClick={() => setMenuOpen(false)} className="text-sm font-mono text-text-secondary hover:text-accent-cyan">
                  Login
                </Link>
              )}
              <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="text-sm font-mono text-text-secondary hover:text-accent-cyan">
                Dashboard
              </Link>
              {isSuperUser && (
                <Link href="/dashboard/users" onClick={() => setMenuOpen(false)} className="text-sm font-mono text-text-secondary hover:text-accent-purple">
                  Users
                </Link>
              )}
              {isSuperUser && (
                <Link href="/dashboard/cms" onClick={() => setMenuOpen(false)} className="text-sm font-mono text-text-secondary hover:text-accent-purple">
                  CMS
                </Link>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
    </>
  );
}

function NavLink({ href, label, active, onClick }: { href: string, label: string, active: boolean, onClick?: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`font-mono text-[10px] font-bold tracking-widest transition-all hover:text-accent-cyan relative group ${active ? 'text-accent-cyan' : 'text-text-secondary'}`}
    >
      {label}
      <span className={`absolute -bottom-1 left-0 h-[1px] bg-accent-cyan transition-all duration-300 ${active ? 'w-full' : 'w-0 group-hover:w-full'}`} />
    </Link>
  );
}
