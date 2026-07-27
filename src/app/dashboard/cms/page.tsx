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

export type NotificationType = { type: 'success' | 'error' | 'info', message: string };

export default function CMSPage() {
  const [activeTab, setActiveTab] = useState<'EXPERIENCE' | 'PROJECTS' | 'SKILLS'>('EXPERIENCE');
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
        </div>

        <div className="pt-4">
          {activeTab === 'EXPERIENCE' && <ExperienceCMS showNotification={showNotification} />}
          {activeTab === 'PROJECTS' && <ProjectsCMS showNotification={showNotification} />}
          {activeTab === 'SKILLS' && <SkillsCMS showNotification={showNotification} />}
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

interface CMSProps {
  showNotification: (type: 'success' | 'error' | 'info', message: string) => void;
}

function ExperienceCMS({ showNotification }: CMSProps) {
  const [items, setItems] = useState<WorkExperience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isBatchMode, setIsBatchMode] = useState(false);
  const [batchInput, setBatchInput] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isOrderDirty, setIsOrderDirty] = useState(false);
  
  const [newItem, setNewItem] = useState<WorkExperience>({
    type: 'formal',
    title: '',
    company: '',
    location: '',
    dates: '',
    description: '',
    order: 0
  });

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
      setIsLoading(false);
      return;
    }
    const q = query(collection(db, "work_experiences"), orderBy("order", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WorkExperience));
      setItems(data);
      setIsOrderDirty(false);
      setIsLoading(false);
    }, (error) => {
      console.error(error);
      showNotification('error', 'SYSTEM_FAILURE: Unable to fetch experience streams.');
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [showNotification]);

  const handleAdd = async () => {
    if (!newItem.title || !newItem.company || !newItem.dates) {
      showNotification('error', 'VALIDATION_ERROR: Title, Company, and Timeline are required.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) return;
      await addDoc(collection(db, "work_experiences"), { ...newItem, order: items.length });
      setIsAdding(false);
      setNewItem({ type: 'formal', title: '', company: '', location: '', dates: '', description: '', order: 0 });
      showNotification('success', 'STREAM_COMMITTED: Experience added to database.');
    } catch (error) {
      console.error(error);
      showNotification('error', 'SYSTEM_FAILURE: Could not commit stream.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBatchAdd = async () => {
    setIsSubmitting(true);
    try {
      const parsed = JSON.parse(batchInput);
      if (!Array.isArray(parsed)) throw new Error("Root must be an array");
      
      if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) return;
      const batch = writeBatch(db);
      
      parsed.forEach((item, index) => {
        const ref = doc(collection(db, "work_experiences"));
        batch.set(ref, { ...item, order: items.length + index });
      });
      
      await batch.commit();
      setIsAdding(false);
      setBatchInput('');
      showNotification('success', 'BATCH_COMMITTED: Multiple streams injected.');
    } catch (error) {
      console.error(error);
      showNotification('error', 'VALIDATION_ERROR: Invalid JSON format.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveOrder = async () => {
    setIsSubmitting(true);
    try {
      if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) return;
      const batch = writeBatch(db);
      items.forEach((item, index) => {
        if (item.id) {
          const ref = doc(db, "work_experiences", item.id);
          batch.update(ref, { order: index });
        }
      });
      await batch.commit();
      setIsOrderDirty(false);
      showNotification('success', 'ORDER_COMMITTED: Sequence updated.');
    } catch (error) {
      console.error(error);
      showNotification('error', 'SYSTEM_FAILURE: Could not commit sequence.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsSubmitting(true);
    try {
      if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) return;
      await deleteDoc(doc(db, "work_experiences", id));
      setDeleteConfirm(null);
      showNotification('success', 'STREAM_PURGED: Experience removed from database.');
    } catch (error) {
      console.error(error);
      showNotification('error', 'SYSTEM_FAILURE: Could not purge stream.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <h2 className="font-mono text-xs font-bold text-accent-cyan tracking-widest uppercase">Experience_Streams</h2>
          {isOrderDirty && (
            <button
              onClick={handleSaveOrder}
              disabled={isSubmitting}
              className="bg-accent-cyan text-black px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest hover:bg-accent-cyan/90 transition-colors animate-pulse"
            >
              COMMIT_ORDER
            </button>
          )}
        </div>
        <div className="flex gap-2">
          {!isAdding ? (
            <>
              <button onClick={() => { setIsAdding(true); setIsBatchMode(false); }} disabled={isLoading || isSubmitting} className="flex items-center gap-2 glass px-3 py-1.5 hover:bg-white/5 transition-colors font-mono text-[10px] font-bold uppercase disabled:opacity-50">
                <Plus size={14} /> NEW_STREAM
              </button>
              <button onClick={() => { setIsAdding(true); setIsBatchMode(true); }} disabled={isLoading || isSubmitting} className="flex items-center gap-2 glass px-3 py-1.5 hover:bg-white/5 transition-colors font-mono text-[10px] font-bold uppercase disabled:opacity-50 text-accent-cyan">
                <ListPlus size={14} /> BATCH_INJECT
              </button>
            </>
          ) : (
            <button onClick={() => setIsAdding(false)} disabled={isLoading || isSubmitting} className="flex items-center gap-2 glass px-4 py-2 hover:bg-white/5 transition-colors font-mono text-[10px] font-bold uppercase disabled:opacity-50">
              <X size={14} /> CANCEL_ENTRY
            </button>
          )}
        </div>
      </div>

      {isAdding && (
        <div className="glass p-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
          {!isBatchMode ? (
            <>
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
                 <FormInput label="Title *" value={newItem.title} onChange={v => setNewItem({...newItem, title: v})} />
                 <FormInput label="Company *" value={newItem.company} onChange={v => setNewItem({...newItem, company: v})} />
                 <FormInput label="Location" value={newItem.location} onChange={v => setNewItem({...newItem, location: v})} />
                 <FormInput label="Timeline *" value={newItem.dates} onChange={v => setNewItem({...newItem, dates: v})} />
              </div>
              <FormTextarea label="Description" value={newItem.description} onChange={v => setNewItem({...newItem, description: v})} />
              <button 
                onClick={handleAdd} 
                disabled={isSubmitting}
                className="w-full bg-accent-cyan text-black font-bold py-3 font-mono text-xs tracking-widest flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70"
              >
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {isSubmitting ? 'COMMITTING...' : 'COMMIT_STREAM'}
              </button>
            </>
          ) : (
            <>
              <FormTextarea label="JSON Payload (Array of Objects)" value={batchInput} onChange={setBatchInput} />
              <button 
                onClick={handleBatchAdd} 
                disabled={isSubmitting || !batchInput}
                className="w-full bg-accent-cyan text-black font-bold py-3 font-mono text-xs tracking-widest flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70"
              >
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />}
                {isSubmitting ? 'INJECTING...' : 'INJECT_PAYLOAD'}
              </button>
            </>
          )}
        </div>
      )}

      {isLoading ? (
        <LoadingState text="FETCHING_STREAMS..." />
      ) : (
        <Reorder.Group axis="y" values={items} onReorder={(newOrder) => { setItems(newOrder); setIsOrderDirty(true); }} className="space-y-4">
          {items.map(item => (
            <Reorder.Item key={item.id} value={item} className="p-4 glass group flex justify-between items-center hover:border-accent-cyan/30 transition-colors bg-[#0a0a0a]">
              <div className="flex items-center gap-4">
                <GripVertical size={16} className="text-text-secondary cursor-grab active:cursor-grabbing opacity-30 group-hover:opacity-100 transition-opacity" />
                <div>
                  <div className="flex items-center gap-3">
                     <span className="text-[10px] font-mono text-accent-cyan bg-accent-cyan/5 px-2 py-0.5 border border-accent-cyan/20 font-bold">{item.type.toUpperCase()}</span>
                     <h3 className="font-bold text-text-primary">{item.title} {" // "} {item.company}</h3>
                  </div>
                  <p className="text-[10px] text-text-secondary mt-1 font-mono uppercase tracking-tighter">{item.dates} | {item.location}</p>
                </div>
              </div>
              
              {deleteConfirm === item.id ? (
                <div className="flex items-center gap-2 bg-red-500/10 px-3 py-1.5 border border-red-500/30">
                  <span className="text-[10px] font-mono text-red-500 font-bold uppercase">Confirm Purge?</span>
                  <button onClick={() => item.id && handleDelete(item.id)} disabled={isSubmitting} className="p-1 hover:text-red-500 text-text-primary transition-all font-mono text-xs">Y</button>
                  <button onClick={() => setDeleteConfirm(null)} disabled={isSubmitting} className="p-1 hover:text-text-primary text-text-secondary transition-all font-mono text-xs">N</button>
                </div>
              ) : (
                <button onClick={() => setDeleteConfirm(item.id || null)} className="p-2 text-text-secondary hover:text-red-500 transition-all opacity-0 group-hover:opacity-100">
                  <Trash2 size={16} />
                </button>
              )}
            </Reorder.Item>
          ))}
          {items.length === 0 && !isAdding && <EmptyState text="NO_STREAMS_FOUND" />}
        </Reorder.Group>
      )}
    </div>
  );
}

function ProjectsCMS({ showNotification }: CMSProps) {
  const [items, setItems] = useState<ShowcaseProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isBatchMode, setIsBatchMode] = useState(false);
  const [batchInput, setBatchInput] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isOrderDirty, setIsOrderDirty] = useState(false);
  
  const [newItem, setNewItem] = useState<ShowcaseProject>({
    title: '',
    tech_stack: [],
    description: '',
    image_url: '',
    live_link: '',
    github_link: '',
    technical_brief: { integrity: 'VERIFIED', encryption: 'AES-256', access: 'RESTRICTED' },
    gallery_urls: [],
    order: 0
  });
  const [techInput, setTechInput] = useState('');
  const [galleryInput, setGalleryInput] = useState('');

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
      setIsLoading(false);
      return;
    }
    const q = query(collection(db, "showcase_projects"), orderBy("order", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ShowcaseProject));
      setItems(data);
      setIsOrderDirty(false);
      setIsLoading(false);
    }, (error) => {
      console.error(error);
      showNotification('error', 'SYSTEM_FAILURE: Unable to access project vault.');
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [showNotification]);

  const handleAdd = async () => {
    if (!newItem.title) {
      showNotification('error', 'VALIDATION_ERROR: Project Title is required.');
      return;
    }
    setIsSubmitting(true);
    try {
      if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) return;
      await addDoc(collection(db, "showcase_projects"), { ...newItem, order: items.length });
      setIsAdding(false);
      setNewItem({ title: '', tech_stack: [], description: '', image_url: '', live_link: '', technical_brief: { integrity: 'VERIFIED', encryption: 'AES-256', access: 'RESTRICTED' }, gallery_urls: [], order: 0 });
      setTechInput('');
      setGalleryInput('');
      showNotification('success', 'VAULT_UPDATED: Project successfully vaulted.');
    } catch (error) {
      console.error(error);
      showNotification('error', 'SYSTEM_FAILURE: Could not vault project.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBatchAdd = async () => {
    setIsSubmitting(true);
    try {
      const parsed = JSON.parse(batchInput);
      if (!Array.isArray(parsed)) throw new Error("Root must be an array");
      
      if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) return;
      const batch = writeBatch(db);
      
      parsed.forEach((item, index) => {
        const ref = doc(collection(db, "showcase_projects"));
        batch.set(ref, { ...item, order: items.length + index });
      });
      
      await batch.commit();
      setIsAdding(false);
      setBatchInput('');
      showNotification('success', 'BATCH_COMMITTED: Multiple projects vaulted.');
    } catch (error) {
      console.error(error);
      showNotification('error', 'VALIDATION_ERROR: Invalid JSON format.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveOrder = async () => {
    setIsSubmitting(true);
    try {
      if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) return;
      const batch = writeBatch(db);
      items.forEach((item, index) => {
        if (item.id) {
          const ref = doc(db, "showcase_projects", item.id);
          batch.update(ref, { order: index });
        }
      });
      await batch.commit();
      setIsOrderDirty(false);
      showNotification('success', 'ORDER_COMMITTED: Vault sequence updated.');
    } catch (error) {
      console.error(error);
      showNotification('error', 'SYSTEM_FAILURE: Could not commit sequence.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsSubmitting(true);
    try {
      if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) return;
      await deleteDoc(doc(db, "showcase_projects", id));
      setDeleteConfirm(null);
      showNotification('success', 'PROJECT_PURGED: Project removed from vault.');
    } catch (error) {
      console.error(error);
      showNotification('error', 'SYSTEM_FAILURE: Could not purge project.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <h2 className="font-mono text-xs font-bold text-accent-purple tracking-widest uppercase">Project_Vault</h2>
          {isOrderDirty && (
            <button
              onClick={handleSaveOrder}
              disabled={isSubmitting}
              className="bg-accent-purple text-white px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest hover:bg-accent-purple/90 transition-colors animate-pulse"
            >
              COMMIT_ORDER
            </button>
          )}
        </div>
        <div className="flex gap-2">
          {!isAdding ? (
            <>
              <button onClick={() => { setIsAdding(true); setIsBatchMode(false); }} disabled={isLoading || isSubmitting} className="flex items-center gap-2 glass px-3 py-1.5 hover:bg-white/5 transition-colors font-mono text-[10px] font-bold uppercase disabled:opacity-50">
                <Plus size={14} /> OPEN_ENTRY
              </button>
              <button onClick={() => { setIsAdding(true); setIsBatchMode(true); }} disabled={isLoading || isSubmitting} className="flex items-center gap-2 glass px-3 py-1.5 hover:bg-white/5 transition-colors font-mono text-[10px] font-bold uppercase disabled:opacity-50 text-accent-purple">
                <ListPlus size={14} /> BATCH_INJECT
              </button>
            </>
          ) : (
            <button onClick={() => setIsAdding(false)} disabled={isLoading || isSubmitting} className="flex items-center gap-2 glass px-4 py-2 hover:bg-white/5 transition-colors font-mono text-[10px] font-bold uppercase disabled:opacity-50">
              <X size={14} /> CLOSE_VAULT
            </button>
          )}
        </div>
      </div>

      {isAdding && (
        <div className="glass p-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
          {!isBatchMode ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                 <FormInput label="Project Title *" value={newItem.title} onChange={v => setNewItem({...newItem, title: v})} />
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
                 <div className="space-y-1.5">
                   <label className="block font-mono text-[10px] text-text-secondary uppercase font-bold">Gallery URLs (comma separated)</label>
                   <input
                     type="text"
                     value={galleryInput}
                     onChange={e => {
                       setGalleryInput(e.target.value);
                       setNewItem({...newItem, gallery_urls: e.target.value.split(',').map(s => s.trim()).filter(Boolean)});
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
              <button 
                onClick={handleAdd} 
                disabled={isSubmitting}
                className="w-full bg-accent-purple text-white font-bold py-3 font-mono text-xs tracking-widest flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70"
              >
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {isSubmitting ? 'VAULTING...' : 'COMMENCE_VAULTING'}
              </button>
            </>
          ) : (
            <>
              <FormTextarea label="JSON Payload (Array of Objects)" value={batchInput} onChange={setBatchInput} />
              <button 
                onClick={handleBatchAdd} 
                disabled={isSubmitting || !batchInput}
                className="w-full bg-accent-purple text-white font-bold py-3 font-mono text-xs tracking-widest flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70"
              >
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />}
                {isSubmitting ? 'INJECTING...' : 'INJECT_PAYLOAD'}
              </button>
            </>
          )}
        </div>
      )}

      {isLoading ? (
        <LoadingState text="ACCESSING_VAULT..." />
      ) : (
        <Reorder.Group axis="y" values={items} onReorder={(newOrder) => { setItems(newOrder); setIsOrderDirty(true); }} className="grid grid-cols-1 gap-4">
          {items.map(item => (
            <Reorder.Item key={item.id} value={item} className="p-4 glass group flex justify-between items-center hover:border-accent-purple/30 transition-colors relative bg-[#0a0a0a]">
              <div className="flex gap-4 items-center">
                 <GripVertical size={16} className="text-text-secondary cursor-grab active:cursor-grabbing opacity-30 group-hover:opacity-100 transition-opacity shrink-0" />
                 <div className="w-20 h-20 bg-black/40 border border-surface flex items-center justify-center overflow-hidden shrink-0">
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
              
              {deleteConfirm === item.id ? (
                <div className="absolute top-2 right-2 flex flex-col gap-1 bg-black/90 p-2 border border-red-500/30 z-10">
                  <span className="text-[10px] font-mono text-red-500 font-bold uppercase mb-1">Confirm Purge?</span>
                  <div className="flex gap-2">
                    <button onClick={() => item.id && handleDelete(item.id)} disabled={isSubmitting} className="flex-1 bg-red-500/20 hover:bg-red-500/40 text-red-500 px-2 py-1 font-mono text-xs border border-red-500/50">Y</button>
                    <button onClick={() => setDeleteConfirm(null)} disabled={isSubmitting} className="flex-1 bg-surface hover:bg-surface/80 text-text-primary px-2 py-1 font-mono text-xs border border-white/10">N</button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setDeleteConfirm(item.id || null)} className="p-2 text-text-secondary hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all self-start shrink-0 z-10 relative">
                  <Trash2 size={16} />
                </button>
              )}
            </Reorder.Item>
          ))}
          {items.length === 0 && !isAdding && <EmptyState text="VAULT_EMPTY" />}
        </Reorder.Group>
      )}
    </div>
  );
}

function SkillsCMS({ showNotification }: CMSProps) {
  const [items, setItems] = useState<SkillMatrix[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isBatchMode, setIsBatchMode] = useState(false);
  const [batchInput, setBatchInput] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isOrderDirty, setIsOrderDirty] = useState(false);
  
  const [newItem, setNewItem] = useState<SkillMatrix>({
    category: '',
    skills: [],
    order: 0
  });
  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
      setIsLoading(false);
      return;
    }
    const q = query(collection(db, "skills_matrix"), orderBy("order", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SkillMatrix));
      setItems(data);
      setIsOrderDirty(false);
      setIsLoading(false);
    }, (error) => {
      console.error(error);
      showNotification('error', 'SYSTEM_FAILURE: Unable to fetch technical matrix.');
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [showNotification]);

  const handleAdd = async () => {
    if (!newItem.category) {
      showNotification('error', 'VALIDATION_ERROR: Category is required.');
      return;
    }
    setIsSubmitting(true);
    try {
      if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) return;
      await addDoc(collection(db, "skills_matrix"), { ...newItem, order: items.length });
      setIsAdding(false);
      setNewItem({ category: '', skills: [], order: 0 });
      setSkillInput('');
      showNotification('success', 'INTEGRATION_COMPLETE: Skill set added.');
    } catch (error) {
      console.error(error);
      showNotification('error', 'SYSTEM_FAILURE: Could not integrate skill set.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBatchAdd = async () => {
    setIsSubmitting(true);
    try {
      const parsed = JSON.parse(batchInput);
      if (!Array.isArray(parsed)) throw new Error("Root must be an array");
      
      if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) return;
      const batch = writeBatch(db);
      
      parsed.forEach((item, index) => {
        const ref = doc(collection(db, "skills_matrix"));
        batch.set(ref, { ...item, order: items.length + index });
      });
      
      await batch.commit();
      setIsAdding(false);
      setBatchInput('');
      showNotification('success', 'BATCH_COMMITTED: Multiple skill sets injected.');
    } catch (error) {
      console.error(error);
      showNotification('error', 'VALIDATION_ERROR: Invalid JSON format.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveOrder = async () => {
    setIsSubmitting(true);
    try {
      if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) return;
      const batch = writeBatch(db);
      items.forEach((item, index) => {
        if (item.id) {
          const ref = doc(db, "skills_matrix", item.id);
          batch.update(ref, { order: index });
        }
      });
      await batch.commit();
      setIsOrderDirty(false);
      showNotification('success', 'ORDER_COMMITTED: Matrix sequence updated.');
    } catch (error) {
      console.error(error);
      showNotification('error', 'SYSTEM_FAILURE: Could not commit sequence.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsSubmitting(true);
    try {
      if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) return;
      await deleteDoc(doc(db, "skills_matrix", id));
      setDeleteConfirm(null);
      showNotification('success', 'SKILL_PURGED: Skill set removed from matrix.');
    } catch (error) {
      console.error(error);
      showNotification('error', 'SYSTEM_FAILURE: Could not purge skill set.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <h2 className="font-mono text-xs font-bold text-accent-cyan tracking-widest uppercase">Technical_Matrix</h2>
          {isOrderDirty && (
            <button
              onClick={handleSaveOrder}
              disabled={isSubmitting}
              className="bg-accent-cyan text-black px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest hover:bg-accent-cyan/90 transition-colors animate-pulse"
            >
              COMMIT_ORDER
            </button>
          )}
        </div>
        <div className="flex gap-2">
          {!isAdding ? (
            <>
              <button onClick={() => { setIsAdding(true); setIsBatchMode(false); }} disabled={isLoading || isSubmitting} className="flex items-center gap-2 glass px-3 py-1.5 hover:bg-white/5 transition-colors font-mono text-[10px] font-bold uppercase disabled:opacity-50">
                <Plus size={14} /> ADD_SKILL_SET
              </button>
              <button onClick={() => { setIsAdding(true); setIsBatchMode(true); }} disabled={isLoading || isSubmitting} className="flex items-center gap-2 glass px-3 py-1.5 hover:bg-white/5 transition-colors font-mono text-[10px] font-bold uppercase disabled:opacity-50 text-accent-cyan">
                <ListPlus size={14} /> BATCH_INJECT
              </button>
            </>
          ) : (
            <button onClick={() => setIsAdding(false)} disabled={isLoading || isSubmitting} className="flex items-center gap-2 glass px-4 py-2 hover:bg-white/5 transition-colors font-mono text-[10px] font-bold uppercase disabled:opacity-50">
              <X size={14} /> CLOSE_MATRIX
            </button>
          )}
        </div>
      </div>

      {isAdding && (
        <div className="glass p-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
          {!isBatchMode ? (
            <>
              <FormInput label="Category (e.g. INFRASTRUCTURE) *" value={newItem.category} onChange={v => setNewItem({...newItem, category: v})} />
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
              <button 
                onClick={handleAdd} 
                disabled={isSubmitting}
                className="w-full bg-accent-cyan text-black font-bold py-3 font-mono text-xs tracking-widest flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70"
              >
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {isSubmitting ? 'INTEGRATING...' : 'COMMENCE_INTEGRATION'}
              </button>
            </>
          ) : (
            <>
              <FormTextarea label="JSON Payload (Array of Objects)" value={batchInput} onChange={setBatchInput} />
              <button 
                onClick={handleBatchAdd} 
                disabled={isSubmitting || !batchInput}
                className="w-full bg-accent-cyan text-black font-bold py-3 font-mono text-xs tracking-widest flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70"
              >
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />}
                {isSubmitting ? 'INJECTING...' : 'INJECT_PAYLOAD'}
              </button>
            </>
          )}
        </div>
      )}

      {isLoading ? (
        <LoadingState text="ANALYZING_MATRIX..." />
      ) : (
        <Reorder.Group axis="y" values={items} onReorder={(newOrder) => { setItems(newOrder); setIsOrderDirty(true); }} className="grid grid-cols-1 gap-4">
          {items.map(item => (
            <Reorder.Item key={item.id} value={item} className="p-4 glass group flex justify-between items-center hover:border-accent-cyan/30 transition-colors bg-[#0a0a0a]">
              <div className="flex items-center gap-4">
                <GripVertical size={16} className="text-text-secondary cursor-grab active:cursor-grabbing opacity-30 group-hover:opacity-100 transition-opacity shrink-0" />
                <div>
                  <h3 className="font-mono text-[10px] font-bold text-accent-cyan uppercase tracking-widest">{item.category}</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {item.skills.map(skill => (
                      <span key={skill} className="text-[10px] text-text-secondary font-mono bg-white/5 px-2 py-0.5 border border-white/5 uppercase font-bold tracking-tighter">{skill}</span>
                    ))}
                  </div>
                </div>
              </div>
              
              {deleteConfirm === item.id ? (
                <div className="flex flex-col gap-1 items-end self-start shrink-0">
                  <span className="text-[8px] font-mono text-red-500 font-bold uppercase">Confirm Purge?</span>
                  <div className="flex gap-1">
                    <button onClick={() => item.id && handleDelete(item.id)} disabled={isSubmitting} className="bg-red-500/20 hover:bg-red-500/40 text-red-500 px-2 py-1 font-mono text-xs border border-red-500/50">Y</button>
                    <button onClick={() => setDeleteConfirm(null)} disabled={isSubmitting} className="bg-surface hover:bg-surface/80 text-text-primary px-2 py-1 font-mono text-xs border border-white/10">N</button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setDeleteConfirm(item.id || null)} className="p-2 text-text-secondary hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all self-start shrink-0">
                  <Trash2 size={16} />
                </button>
              )}
            </Reorder.Item>
          ))}
          {items.length === 0 && !isAdding && <EmptyState text="NO_SKILLS_FOUND" />}
        </Reorder.Group>
      )}
    </div>
  );
}

// --- UI Helpers ---

function NotificationBanner({ notification, onClose }: { notification: NotificationType, onClose: () => void }) {
  const isError = notification.type === 'error';
  const isSuccess = notification.type === 'success';
  
  return (
    <div className={`absolute top-0 left-6 right-6 p-4 border flex justify-between items-start animate-in slide-in-from-top-4 fade-in duration-300 z-50 shadow-2xl backdrop-blur-md ${
      isError ? 'bg-red-500/10 border-red-500/50 text-red-500' : 
      isSuccess ? 'bg-accent-cyan/10 border-accent-cyan/50 text-accent-cyan' : 
      'bg-blue-500/10 border-blue-500/50 text-blue-500'
    }`}>
      <div className="flex gap-3">
        {isError && <AlertTriangle size={18} className="shrink-0 mt-0.5" />}
        {isSuccess && <CheckCircle2 size={18} className="shrink-0 mt-0.5" />}
        {!isError && !isSuccess && <Info size={18} className="shrink-0 mt-0.5" />}
        <div>
          <h4 className="font-mono text-xs font-bold uppercase tracking-widest">
            {isError ? 'SYSTEM_ALERT' : isSuccess ? 'SYSTEM_SUCCESS' : 'SYSTEM_INFO'}
          </h4>
          <p className="font-mono text-[10px] mt-1 opacity-80">{notification.message}</p>
        </div>
      </div>
      <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-sm transition-colors">
        <X size={14} />
      </button>
    </div>
  );
}

function LoadingState({ text }: { text: string }) {
  return (
    <div className="py-12 flex flex-col items-center justify-center gap-4 text-text-secondary">
      <Loader2 size={24} className="animate-spin text-accent-cyan opacity-50" />
      <p className="font-mono text-[10px] uppercase tracking-widest font-bold opacity-50">{text}</p>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="py-12 flex flex-col items-center justify-center border border-dashed border-surface text-text-secondary bg-surface/10">
      <Database size={24} className="opacity-20 mb-3" />
      <p className="font-mono text-[10px] uppercase tracking-widest font-bold opacity-50">{text}</p>
    </div>
  );
}

function FormInput({ label, value, onChange, type = "text" }: { label: string, value: string, onChange: (v: string) => void, type?: string }) {
  return (
    <div className="space-y-1.5">
      <label className="block font-mono text-[10px] text-text-secondary uppercase font-bold">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-surface border border-surface rounded-none py-2 px-3 text-sm focus:border-accent-cyan/50 outline-none text-text-primary transition-colors"
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
        className="w-full bg-surface border border-surface rounded-none py-2 px-3 text-sm focus:border-accent-cyan/50 outline-none resize-none text-text-primary transition-colors"
      />
    </div>
  );
}
