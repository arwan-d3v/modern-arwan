import React, { useState, useEffect } from "react";
import { collection, onSnapshot, addDoc, deleteDoc, doc, query, orderBy, writeBatch } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Plus, Trash2, Save, X, Database, Loader2, GripVertical, ListPlus, UploadCloud, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { Reorder } from "framer-motion";
import Image from "next/image";
import { CMSProps, FormInput, FormTextarea, LoadingState, EmptyState } from "./CMSHelpers";
import { SkillMatrix } from "@/types";
export default function SkillsCMS({ showNotification }: CMSProps) {
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
              <div className="bg-black/50 p-3 text-[10px] font-mono text-text-secondary border border-white/5 mb-4 rounded-sm">
                <p className="text-accent-cyan font-bold mb-1 uppercase tracking-widest">EXPECTED JSON FORMAT:</p>
                <pre className="opacity-70 whitespace-pre-wrap">{`[
  {
    "category": "FRAMEWORKS",
    "skills": ["React", "Next.js", "Vue"]
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
        <LoadingState text="ANALYZING_MATRIX..." />
      ) : (
        <Reorder.Group axis="y" values={items} onReorder={(newOrder) => { setItems(newOrder); setIsOrderDirty(true); }} className="grid grid-cols-1 gap-4">
          {items.map(item => (
            <Reorder.Item key={item.id} value={item} className="p-4 glass group flex justify-between items-center hover:border-accent-cyan/30 transition-colors bg-[#0a0a0a]">
              <div className="flex items-center gap-4">
                <GripVertical size={16} className="text-text-secondary cursor-grab active:cursor-grabbing opacity-30 group-hover:opacity-100 transition-opacity shrink-0" />
                <div>
                  <h3 className="font-mono text-[10px] font-bold text-accent-cyan uppercase tracking-widest">{item.category || 'UNCATEGORIZED'}</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(item.skills || []).map(skill => (
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
