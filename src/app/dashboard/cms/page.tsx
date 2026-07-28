"use client";
import Image from "next/image";

import { useState, useEffect, useCallback } from "react";
import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  writeBatch
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { WorkExperience, ShowcaseProject, SkillMatrix } from "@/types";
import {
  Plus,
  Trash2,
  Save,
  X,
  Briefcase,
  Layout,
  Terminal,
  Database,
  AlertTriangle,
  CheckCircle2,
  Info,
  Loader2,
  GripVertical,
  ListPlus,
  UploadCloud
} from "lucide-react";
import RoleGuard from "@/components/RoleGuard";
import { Reorder } from "framer-motion";
import ExperienceCMS from "@/components/cms/ExperienceCMS";
import ProjectsCMS from "@/components/cms/ProjectsCMS";
import SkillsCMS from "@/components/cms/SkillsCMS";
import BlogCMS from "@/components/cms/BlogCMS";
import { NotificationBanner, NotificationType } from "@/components/cms/CMSHelpers";




export default function CMSPage() {
  const [activeTab, setActiveTab] = useState<'EXPERIENCE' | 'PROJECTS' | 'SKILLS' | 'BLOG'>('EXPERIENCE');
  const [notification, setNotification] = useState<NotificationType | null>(null);

  const showNotification = useCallback((type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  }, []);

  return (
    <RoleGuard allowedRoles={['super_admin']}>
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-8 relative">
        {notification && <NotificationBanner notification={notification} onClose={() => setNotification(null)} />}
        
        <header>
          <h1 className="text-3xl font-bold tracking-tighter uppercase text-text-primary">SYSTEM_CMS</h1>
          <p className="text-text-secondary font-mono text-[10px] uppercase tracking-[0.2em] mt-1">
            Central Data Management // Node: CRUD_MASTER
          </p>
        </header>

        <div className="flex gap-2 border-b border-surface">
          <TabButton active={activeTab === 'EXPERIENCE'} onClick={() => setActiveTab('EXPERIENCE')} icon={<Briefcase size={14}/>} label="EXPERIENCE" />
          <TabButton active={activeTab === 'PROJECTS'} onClick={() => setActiveTab('PROJECTS')} icon={<Layout size={14}/>} label="PROJECTS" />
          <TabButton active={activeTab === 'SKILLS'} onClick={() => setActiveTab('SKILLS')} icon={<Terminal size={14}/>} label="SKILLS" />
          <TabButton active={activeTab === 'BLOG'} onClick={() => setActiveTab('BLOG')} icon={<Layout size={14}/>} label="BLOG_LOGS" />
        </div>

        <div className="pt-4">
          {activeTab === 'EXPERIENCE' && <ExperienceCMS showNotification={showNotification} />}
          {activeTab === 'PROJECTS' && <ProjectsCMS showNotification={showNotification} />}
          {activeTab === 'SKILLS' && <SkillsCMS showNotification={showNotification} />}
          {activeTab === 'BLOG' && <BlogCMS showNotification={showNotification} />}
        </div>
      </div>
    </RoleGuard>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 font-mono text-[10px] font-bold tracking-widest flex items-center gap-2 transition-all border-b-2 ${active ? 'border-accent-cyan text-accent-cyan' : 'border-transparent text-text-secondary hover:text-text-primary'}`}
    >
      {icon} {label}
    </button>
  );
}
