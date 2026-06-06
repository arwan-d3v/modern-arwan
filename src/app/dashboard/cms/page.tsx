"use client";

import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { WorkExperience, ShowcaseProject, SkillMatrix } from "@/types";
import RoleGuard from "@/components/RoleGuard";
import { Plus, Trash2, Save, X, Briefcase, Layout, Cpu } from "lucide-react";

export default function CMSPage() {
  const [activeTab, setActiveTab] = useState<'experience' | 'projects' | 'skills'>('experience');

  return (
    <RoleGuard allowedRoles={['SUPER_USER']}>
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-text-primary uppercase">System_CMS</h1>
            <p className="text-text-secondary font-mono text-xs mt-1 uppercase tracking-widest">
              Centralized Content Management for Portfolio Data
            </p>
            {/* MANUAL ROLE ELEVATION INSTRUCTIONS:
                To elevate your role to SUPER_USER, go to the Firestore console,
                find your user document in the 'users' collection (ID matches your UID),
                and update the 'role' field to 'SUPER_USER'.
            */}
          </div>

          <div className="flex bg-surface rounded-lg p-1 border border-surface">
            <TabButton
              active={activeTab === 'experience'}
              onClick={() => setActiveTab('experience')}
              icon={<Briefcase size={14} />}
              label="Work"
            />
            <TabButton
              active={activeTab === 'projects'}
              onClick={() => setActiveTab('projects')}
              icon={<Layout size={14} />}
              label="Projects"
            />
            <TabButton
              active={activeTab === 'skills'}
              onClick={() => setActiveTab('skills')}
              icon={<Cpu size={14} />}
              label="Skills"
            />
          </div>
        </div>

        <div className="glass p-8 rounded-2xl min-h-[500px]">
          {activeTab === 'experience' && <ExperienceCMS />}
          {activeTab === 'projects' && <ProjectsCMS />}
          {activeTab === 'skills' && <SkillsCMS />}
        </div>
      </div>
    </RoleGuard>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all font-mono text-[10px] font-bold uppercase tracking-widest ${
        active
          ? 'bg-accent-cyan text-black shadow-[0_0_15px_rgba(0,242,255,0.3)]'
          : 'text-text-secondary hover:text-text-primary'
      }`}
    >
      {icon}
      {label}
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
    dates: '',
    description: ''
  });

  const fetchData = async () => {
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) return;
    const q = query(collection(db, "work_experience"));
    const querySnapshot = await getDocs(q);
    setItems(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WorkExperience)));
  };

  useEffect(() => { fetchData(); }, []);

  const handleAdd = async () => {
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) return;
    await addDoc(collection(db, "work_experience"), newItem);
    setIsAdding(false);
    setNewItem({ type: 'formal', title: '', company: '', dates: '', description: '' });
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) return;
    await deleteDoc(doc(db, "work_experience", id));
    fetchData();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-mono text-sm font-bold text-accent-cyan tracking-widest uppercase underline decoration-accent-cyan/30 underline-offset-8">
          Work_Experience_Ledger
        </h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-text-primary px-3 py-1.5 rounded-lg border border-surface transition-colors font-mono text-[10px] font-bold"
        >
          {isAdding ? <X size={14} /> : <Plus size={14} />}
          {isAdding ? 'CANCEL_ENTRY' : 'ADD_NEW_ENTRY'}
        </button>
      </div>

      {isAdding && (
        <div className="bg-black/40 border border-accent-cyan/20 p-6 rounded-xl space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput label="Job Title" value={newItem.title} onChange={v => setNewItem({...newItem, title: v})} />
            <FormInput label="Company" value={newItem.company} onChange={v => setNewItem({...newItem, company: v})} />
            <FormInput label="Dates" value={newItem.dates} onChange={v => setNewItem({...newItem, dates: v})} />
            <div className="space-y-1.5">
              <label className="block font-mono text-[10px] text-text-secondary uppercase">Type</label>
              <select
                value={newItem.type}
                onChange={e => setNewItem({...newItem, type: e.target.value as 'formal' | 'freelance'})}
                className="w-full bg-surface border border-surface rounded-lg py-2 px-3 text-sm focus:border-accent-cyan/50 outline-none"
              >
                <option value="formal">FORMAL</option>
                <option value="freelance">FREELANCE</option>
              </select>
            </div>
          </div>
          <FormTextarea label="Description" value={newItem.description} onChange={v => setNewItem({...newItem, description: v})} />
          <button
            onClick={handleAdd}
            className="w-full bg-accent-cyan hover:bg-accent-cyan/90 text-black font-bold py-2 rounded-lg font-mono text-xs tracking-widest flex items-center justify-center gap-2"
          >
            <Save size={16} />
            COMMIT_TO_FIRESTORE
          </button>
        </div>
      )}

      <div className="space-y-4">
        {items.length === 0 && <p className="text-text-secondary font-mono text-xs italic">No entries found. System standby.</p>}
        {items.map(item => (
          <div key={item.id} className="flex justify-between items-start p-4 bg-white/5 rounded-xl border border-surface hover:border-surface-hover group">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-accent-cyan font-bold">{item.title}</span>
                <span className="text-[10px] px-2 py-0.5 bg-white/5 rounded font-mono text-text-secondary uppercase">{item.type}</span>
              </div>
              <p className="text-sm font-bold text-text-primary">{item.company}</p>
              <p className="text-xs text-text-secondary font-mono">{item.dates}</p>
            </div>
            <button
              onClick={() => item.id && handleDelete(item.id)}
              className="p-2 text-text-secondary hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
            >
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
    live_link: ''
  });
  const [techInput, setTechInput] = useState('');

  const fetchData = async () => {
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) return;
    const q = query(collection(db, "showcase_projects"));
    const querySnapshot = await getDocs(q);
    setItems(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ShowcaseProject)));
  };

  useEffect(() => { fetchData(); }, []);

  const handleAdd = async () => {
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) return;
    await addDoc(collection(db, "showcase_projects"), newItem);
    setIsAdding(false);
    setNewItem({ title: '', tech_stack: [], description: '', image_url: '', live_link: '' });
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
        <h2 className="font-mono text-sm font-bold text-accent-purple tracking-widest uppercase underline decoration-accent-purple/30 underline-offset-8">
          Project_Showcase_Vault
        </h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-text-primary px-3 py-1.5 rounded-lg border border-surface transition-colors font-mono text-[10px] font-bold"
        >
          {isAdding ? <X size={14} /> : <Plus size={14} />}
          {isAdding ? 'CANCEL_ENTRY' : 'ADD_NEW_ENTRY'}
        </button>
      </div>

      {isAdding && (
        <div className="bg-black/40 border border-accent-purple/20 p-6 rounded-xl space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput label="Project Title" value={newItem.title} onChange={v => setNewItem({...newItem, title: v})} />
            <FormInput label="Image URL" value={newItem.image_url} onChange={v => setNewItem({...newItem, image_url: v})} />
            <FormInput label="Live Link" value={newItem.live_link} onChange={v => setNewItem({...newItem, live_link: v})} />
            <div className="space-y-1.5">
              <label className="block font-mono text-[10px] text-text-secondary uppercase">Tech Stack (comma separated)</label>
              <input
                type="text"
                value={techInput}
                onChange={e => {
                  setTechInput(e.target.value);
                  setNewItem({...newItem, tech_stack: e.target.value.split(',').map(s => s.trim())});
                }}
                className="w-full bg-surface border border-surface rounded-lg py-2 px-3 text-sm focus:border-accent-purple/50 outline-none"
              />
            </div>
          </div>
          <FormTextarea label="Description" value={newItem.description} onChange={v => setNewItem({...newItem, description: v})} />
          <button
            onClick={handleAdd}
            className="w-full bg-accent-purple hover:bg-accent-purple/90 text-white font-bold py-2 rounded-lg font-mono text-xs tracking-widest flex items-center justify-center gap-2"
          >
            <Save size={16} />
            COMMIT_TO_FIRESTORE
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map(item => (
          <div key={item.id} className="p-4 bg-white/5 rounded-xl border border-surface group flex justify-between">
            <div>
              <h3 className="font-bold text-text-primary">{item.title}</h3>
              <p className="text-xs text-text-secondary mt-1">{item.description}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {item.tech_stack.map(tag => (
                  <span key={tag} className="px-2 py-0.5 bg-accent-purple/10 text-accent-purple text-[8px] font-mono rounded border border-accent-purple/20 uppercase font-bold">{tag}</span>
                ))}
              </div>
            </div>
            <button
              onClick={() => item.id && handleDelete(item.id)}
              className="p-2 text-text-secondary hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
            >
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
    skills: []
  });
  const [skillInput, setSkillInput] = useState('');

  const fetchData = async () => {
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) return;
    const q = query(collection(db, "skills_matrix"));
    const querySnapshot = await getDocs(q);
    setItems(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SkillMatrix)));
  };

  useEffect(() => { fetchData(); }, []);

  const handleAdd = async () => {
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) return;
    await addDoc(collection(db, "skills_matrix"), newItem);
    setIsAdding(false);
    setNewItem({ category: '', skills: [] });
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
        <h2 className="font-mono text-sm font-bold text-accent-cyan tracking-widest uppercase underline decoration-accent-cyan/30 underline-offset-8">
          Technical_Skills_Matrix
        </h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-text-primary px-3 py-1.5 rounded-lg border border-surface transition-colors font-mono text-[10px] font-bold"
        >
          {isAdding ? <X size={14} /> : <Plus size={14} />}
          {isAdding ? 'CANCEL_ENTRY' : 'ADD_NEW_ENTRY'}
        </button>
      </div>

      {isAdding && (
        <div className="bg-black/40 border border-accent-cyan/20 p-6 rounded-xl space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <FormInput label="Category" value={newItem.category} onChange={v => setNewItem({...newItem, category: v})} />
          <div className="space-y-1.5">
            <label className="block font-mono text-[10px] text-text-secondary uppercase">Skills (comma separated)</label>
            <input
              type="text"
              value={skillInput}
              onChange={e => {
                setSkillInput(e.target.value);
                setNewItem({...newItem, skills: e.target.value.split(',').map(s => s.trim())});
              }}
              className="w-full bg-surface border border-surface rounded-lg py-2 px-3 text-sm focus:border-accent-cyan/50 outline-none"
            />
          </div>
          <button
            onClick={handleAdd}
            className="w-full bg-accent-cyan hover:bg-accent-cyan/90 text-black font-bold py-2 rounded-lg font-mono text-xs tracking-widest flex items-center justify-center gap-2"
          >
            <Save size={16} />
            COMMIT_TO_FIRESTORE
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map(item => (
          <div key={item.id} className="p-4 bg-white/5 rounded-xl border border-surface group flex justify-between">
            <div>
              <h3 className="font-mono text-[10px] font-bold text-accent-cyan uppercase tracking-wider">{item.category}</h3>
              <ul className="mt-2 space-y-1">
                {item.skills.map(skill => (
                  <li key={skill} className="text-xs text-text-secondary font-mono">• {skill}</li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => item.id && handleDelete(item.id)}
              className="p-2 text-text-secondary hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
            >
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
      <label className="block font-mono text-[10px] text-text-secondary uppercase">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-surface border border-surface rounded-lg py-2 px-3 text-sm focus:border-accent-cyan/50 outline-none"
      />
    </div>
  );
}

function FormTextarea({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) {
  return (
    <div className="space-y-1.5">
      <label className="block font-mono text-[10px] text-text-secondary uppercase">{label}</label>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={4}
        className="w-full bg-surface border border-surface rounded-lg py-2 px-3 text-sm focus:border-accent-cyan/50 outline-none resize-none"
      />
    </div>
  );
}
