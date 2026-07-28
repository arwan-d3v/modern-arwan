import React, { useState, useEffect } from "react";
import { collection, onSnapshot, addDoc, deleteDoc, doc, query, orderBy, writeBatch } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Plus, Trash2, Save, X, Database, Loader2, GripVertical, ListPlus, UploadCloud, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { Reorder } from "framer-motion";
import Image from "next/image";
import { CMSProps, FormInput, FormTextarea, LoadingState, EmptyState } from "./CMSHelpers";
import { WorkExperience } from "@/types";
export default function ExperienceCMS({ showNotification }: CMSProps) {
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
              <div className="bg-black/50 p-3 text-[10px] font-mono text-text-secondary border border-white/5 mb-4 rounded-sm">
                <p className="text-accent-cyan font-bold mb-1 uppercase tracking-widest">EXPECTED JSON FORMAT:</p>
                <pre className="opacity-70 whitespace-pre-wrap">{`[
  {
    "type": "formal" | "freelance",
    "title": "Job Title",
    "company": "Company Name",
    "location": "City, Country",
    "dates": "Jan 2024 - Present",
    "description": "Description text..."
  }
]`}</pre>
              </div>
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
                     <span className="text-[10px] font-mono text-accent-cyan bg-accent-cyan/5 px-2 py-0.5 border border-accent-cyan/20 font-bold">{(item.type || 'unknown').toUpperCase()}</span>
                     <h3 className="font-bold text-text-primary">{item.title || 'UNTITLED'} {" // "} {item.company || 'NO_COMPANY'}</h3>
                  </div>
                  <p className="text-[10px] text-text-secondary mt-1 font-mono uppercase tracking-tighter">{item.dates || 'NO_DATE'} | {item.location || 'NO_LOCATION'}</p>
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
