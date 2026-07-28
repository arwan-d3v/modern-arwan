import React, { useState, useEffect } from "react";
import { collection, onSnapshot, addDoc, deleteDoc, doc, query, orderBy, writeBatch } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Plus, Trash2, Save, X, Database, Loader2, GripVertical, ListPlus, UploadCloud, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { Reorder } from "framer-motion";
import Image from "next/image";
import { CMSProps, FormInput, FormTextarea, LoadingState, EmptyState } from "./CMSHelpers";
import { ShowcaseProject } from "@/types";
export default function ProjectsCMS({ showNotification }: CMSProps) {
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
              <div className="bg-black/50 p-3 text-[10px] font-mono text-text-secondary border border-white/5 mb-4 rounded-sm">
                <p className="text-accent-purple font-bold mb-1 uppercase tracking-widest">EXPECTED JSON FORMAT:</p>
                <pre className="opacity-70 whitespace-pre-wrap">{`[
  {
    "title": "Project Title",
    "tech_stack": ["React", "Node"],
    "description": "Project details...",
    "image_url": "https://...",
    "live_link": "https://...",
    "github_link": "https://...",
    "gallery_urls": ["img1.png", "img2.png"],
    "technical_brief": { "integrity": "VERIFIED", "encryption": "AES", "access": "RESTRICTED" }
  }
]`}</pre>
              </div>
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
                    <h3 className="font-bold text-text-primary text-sm uppercase tracking-tight">{item.title || 'UNTITLED'}</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {(item.tech_stack || []).map(tag => (
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
