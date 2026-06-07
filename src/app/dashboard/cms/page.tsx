"use client";
import Image from "next/image";

import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  query,
  orderBy
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
  Database
} from "lucide-react";
import RoleGuard from "@/components/RoleGuard";

export default function CMSPage() {
  const [activeTab, setActiveTab] = useState<'EXPERIENCE' | 'PROJECTS' | 'SKILLS'>('EXPERIENCE');

  return (
    <RoleGuard allowedRoles={['SUPER_USER']}>
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
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
        </div>

        <div className="pt-4">
          {activeTab === 'EXPERIENCE' && <ExperienceCMS />}
          {activeTab === 'PROJECTS' && <ProjectsCMS />}
          {activeTab === 'SKILLS' && <SkillsCMS />}
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

// --- CMS Components ---

function ExperienceCMS() {
  const [items, setItems] = useState<WorkExperience[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState<WorkExperience>({
    type: 'formal',
    title: '',
    company: '',
    location: '',
    dates: '',
    description: '',
    order: 0
  });

  const fetchData = async () => {
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) return;
    const q = query(collection(db, "work_experiences"), orderBy("order", "asc"));
    const querySnapshot = await getDocs(q);
    setItems(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WorkExperience)));
  };

  useEffect(() => { fetchData(); }, []);

  const handleAdd = async () => {
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) return;
    await addDoc(collection(db, "work_experiences"), { ...newItem, order: items.length });
    setIsAdding(false);
    setNewItem({ type: 'formal', title: '', company: '', location: '', dates: '', description: '', order: 0 });
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) return;
    await deleteDoc(doc(db, "work_experiences", id));
    fetchData();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-mono text-xs font-bold text-accent-cyan tracking-widest uppercase">Experience_Streams</h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 glass px-4 py-2 hover:bg-white/5 transition-colors font-mono text-[10px] font-bold uppercase"
        >
          {isAdding ? <X size={14} /> : <Plus size={14} />}
          {isAdding ? 'CANCEL_ENTRY' : 'NEW_STREAM'}
        </button>
      </div>

      {isAdding && (
        <div className="glass p-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-1.5">
               <label className="block font-mono text-[10px] text-text-secondary uppercase font-bold">Protocol Type</label>
               <select
                 value={newItem.type}
                 onChange={e => setNewItem({...newItem, type: e.target.value as any})}
                 className="w-full bg-surface border border-surface rounded-none py-2 px-3 text-sm focus:border-accent-cyan/50 outline-none text-text-primary"
               >
                 <option value="formal">FORMAL_SECURE</option>
                 <option value="freelance">FREELANCE_OPERATIVE</option>
               </select>
             </div>
             <FormInput label="Title" value={newItem.title} onChange={v => setNewItem({...newItem, title: v})} />
             <FormInput label="Company" value={newItem.company} onChange={v => setNewItem({...newItem, company: v})} />
             <FormInput label="Location" value={newItem.location} onChange={v => setNewItem({...newItem, location: v})} />
             <FormInput label="Timeline" value={newItem.dates} onChange={v => setNewItem({...newItem, dates: v})} />
          </div>
          <FormTextarea label="Description" value={newItem.description} onChange={v => setNewItem({...newItem, description: v})} />
          <button onClick={handleAdd} className="w-full bg-accent-cyan text-black font-bold py-3 font-mono text-xs tracking-widest flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
            <Save size={16} /> COMMIT_STREAM
          </button>
        </div>
      )}

      <div className="space-y-4">
        {items.map(item => (
          <div key={item.id} className="p-4 glass group flex justify-between items-center hover:border-accent-cyan/30 transition-colors">
            <div>
              <div className="flex items-center gap-3">
                 <span className="text-[10px] font-mono text-accent-cyan bg-accent-cyan/5 px-2 py-0.5 border border-accent-cyan/20 font-bold">{item.type.toUpperCase()}</span>
                 <h3 className="font-bold text-text-primary">{item.title} {" // "} {item.company}</h3>
              </div>
              <p className="text-[10px] text-text-secondary mt-1 font-mono uppercase tracking-tighter">{item.dates} | {item.location}</p>
            </div>
            <button onClick={() => item.id && handleDelete(item.id)} className="p-2 text-text-secondary hover:text-red-500 transition-all opacity-0 group-hover:opacity-100">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectsCMS() {
  const [items, setItems] = useState<ShowcaseProject[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState<ShowcaseProject>({
    title: '',
    tech_stack: [],
    description: '',
    image_url: '',
    live_link: '',
    github_link: '',
    technical_brief: { integrity: 'VERIFIED', encryption: 'AES-256', access: 'RESTRICTED' },
    order: 0
  });
  const [techInput, setTechInput] = useState('');

  const fetchData = async () => {
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) return;
    const q = query(collection(db, "showcase_projects"), orderBy("order", "asc"));
    const querySnapshot = await getDocs(q);
    setItems(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ShowcaseProject)));
  };

  useEffect(() => { fetchData(); }, []);

  const handleAdd = async () => {
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) return;
    await addDoc(collection(db, "showcase_projects"), { ...newItem, order: items.length });
    setIsAdding(false);
    setNewItem({ title: '', tech_stack: [], description: '', image_url: '', live_link: '', technical_brief: { integrity: 'VERIFIED', encryption: 'AES-256', access: 'RESTRICTED' }, order: 0 });
    setTechInput('');
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) return;
    await deleteDoc(doc(db, "showcase_projects", id));
    fetchData();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-mono text-xs font-bold text-accent-purple tracking-widest uppercase">Project_Vault</h2>
        <button onClick={() => setIsAdding(!isAdding)} className="flex items-center gap-2 glass px-4 py-2 hover:bg-white/5 transition-colors font-mono text-[10px] font-bold uppercase">
          {isAdding ? <X size={14} /> : <Plus size={14} />}
          {isAdding ? 'CLOSE_VAULT' : 'OPEN_ENTRY'}
        </button>
      </div>

      {isAdding && (
        <div className="glass p-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="grid grid-cols-2 gap-4">
             <FormInput label="Project Title" value={newItem.title} onChange={v => setNewItem({...newItem, title: v})} />
             <FormInput label="Image URL" value={newItem.image_url} onChange={v => setNewItem({...newItem, image_url: v})} />
             <FormInput label="Live Link" value={newItem.live_link} onChange={v => setNewItem({...newItem, live_link: v})} />
             <FormInput label="GitHub Link" value={newItem.github_link || ''} onChange={v => setNewItem({...newItem, github_link: v})} />
             <div className="space-y-1.5">
               <label className="block font-mono text-[10px] text-text-secondary uppercase font-bold">Tech Stack (comma separated)</label>
               <input
                 type="text"
                 value={techInput}
                 onChange={e => {
                   setTechInput(e.target.value);
                   setNewItem({...newItem, tech_stack: e.target.value.split(',').map(s => s.trim())});
                 }}
                 className="w-full bg-surface border border-surface rounded-none py-2 px-3 text-sm focus:border-accent-purple/50 outline-none text-text-primary"
               />
             </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
             <FormInput label="Brief: Integrity" value={newItem.technical_brief?.integrity || ''} onChange={v => setNewItem({...newItem, technical_brief: {...newItem.technical_brief!, integrity: v}})} />
             <FormInput label="Brief: Encryption" value={newItem.technical_brief?.encryption || ''} onChange={v => setNewItem({...newItem, technical_brief: {...newItem.technical_brief!, encryption: v}})} />
             <FormInput label="Brief: Access" value={newItem.technical_brief?.access || ''} onChange={v => setNewItem({...newItem, technical_brief: {...newItem.technical_brief!, access: v}})} />
          </div>
          <FormTextarea label="Description" value={newItem.description} onChange={v => setNewItem({...newItem, description: v})} />
          <button onClick={handleAdd} className="w-full bg-accent-purple text-white font-bold py-3 font-mono text-xs tracking-widest flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
            <Save size={16} /> COMMENCE_VAULTING
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map(item => (
          <div key={item.id} className="p-4 glass group flex justify-between items-center hover:border-accent-purple/30 transition-colors">
            <div className="flex gap-4">
               <div className="w-20 h-20 bg-black/40 border border-surface flex items-center justify-center overflow-hidden">
                  {item.image_url ? (
                    <Image src={item.image_url} alt={item.title} className="w-full h-full object-cover" width={80} height={80} unoptimized />
                  ) : (
                    <Database size={24} className="text-surface" />
                  )}
               </div>
               <div>
                  <h3 className="font-bold text-text-primary text-sm uppercase tracking-tight">{item.title}</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {item.tech_stack.map(tag => (
                      <span key={tag} className="px-1.5 py-0.5 bg-accent-purple/10 text-accent-purple text-[8px] font-mono border border-accent-purple/20 uppercase font-bold tracking-tighter">{tag}</span>
                    ))}
                  </div>
               </div>
            </div>
            <button onClick={() => item.id && handleDelete(item.id)} className="p-2 text-text-secondary hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function SkillsCMS() {
  const [items, setItems] = useState<SkillMatrix[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState<SkillMatrix>({
    category: '',
    skills: [],
    order: 0
  });
  const [skillInput, setSkillInput] = useState('');

  const fetchData = async () => {
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) return;
    const q = query(collection(db, "skills_matrix"), orderBy("order", "asc"));
    const querySnapshot = await getDocs(q);
    setItems(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SkillMatrix)));
  };

  useEffect(() => { fetchData(); }, []);

  const handleAdd = async () => {
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) return;
    await addDoc(collection(db, "skills_matrix"), { ...newItem, order: items.length });
    setIsAdding(false);
    setNewItem({ category: '', skills: [], order: 0 });
    setSkillInput('');
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) return;
    await deleteDoc(doc(db, "skills_matrix", id));
    fetchData();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-mono text-xs font-bold text-accent-cyan tracking-widest uppercase">Technical_Matrix</h2>
        <button onClick={() => setIsAdding(!isAdding)} className="flex items-center gap-2 glass px-4 py-2 hover:bg-white/5 transition-colors font-mono text-[10px] font-bold uppercase">
          {isAdding ? <X size={14} /> : <Plus size={14} />}
          {isAdding ? 'CLOSE_MATRIX' : 'ADD_SKILL_SET'}
        </button>
      </div>

      {isAdding && (
        <div className="glass p-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <FormInput label="Category (e.g. INFRASTRUCTURE)" value={newItem.category} onChange={v => setNewItem({...newItem, category: v})} />
          <div className="space-y-1.5">
            <label className="block font-mono text-[10px] text-text-secondary uppercase font-bold">Skills (comma separated)</label>
            <input
              type="text"
              value={skillInput}
              onChange={e => {
                setSkillInput(e.target.value);
                setNewItem({...newItem, skills: e.target.value.split(',').map(s => s.trim())});
              }}
              className="w-full bg-surface border border-surface rounded-none py-2 px-3 text-sm focus:border-accent-cyan/50 outline-none text-text-primary"
            />
          </div>
          <button onClick={handleAdd} className="w-full bg-accent-cyan text-black font-bold py-3 font-mono text-xs tracking-widest flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
            <Save size={16} /> COMMENCE_INTEGRATION
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map(item => (
          <div key={item.id} className="p-4 glass group flex justify-between hover:border-accent-cyan/30 transition-colors">
            <div>
              <h3 className="font-mono text-[10px] font-bold text-accent-cyan uppercase tracking-widest">{item.category}</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {item.skills.map(skill => (
                  <span key={skill} className="text-[10px] text-text-secondary font-mono bg-white/5 px-2 py-0.5 border border-white/5 uppercase font-bold tracking-tighter">{skill}</span>
                ))}
              </div>
            </div>
            <button onClick={() => item.id && handleDelete(item.id)} className="p-2 text-text-secondary hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- UI Helpers ---

function FormInput({ label, value, onChange, type = "text" }: { label: string, value: string, onChange: (v: string) => void, type?: string }) {
  return (
    <div className="space-y-1.5">
      <label className="block font-mono text-[10px] text-text-secondary uppercase font-bold">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-surface border border-surface rounded-none py-2 px-3 text-sm focus:border-accent-cyan/50 outline-none text-text-primary"
      />
    </div>
  );
}

function FormTextarea({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) {
  return (
    <div className="space-y-1.5">
      <label className="block font-mono text-[10px] text-text-secondary uppercase font-bold">{label}</label>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={4}
        className="w-full bg-surface border border-surface rounded-none py-2 px-3 text-sm focus:border-accent-cyan/50 outline-none resize-none text-text-primary"
      />
    </div>
  );
}
