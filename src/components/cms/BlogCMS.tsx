import React, { useState, useEffect } from "react";
import { collection, onSnapshot, addDoc, deleteDoc, doc, query, orderBy, writeBatch } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Plus, Trash2, Save, X, Database, Loader2, GripVertical, ListPlus, UploadCloud, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { Reorder } from "framer-motion";
import Image from "next/image";
import { CMSProps, FormInput, FormTextarea, LoadingState, EmptyState } from "./CMSHelpers";
export default function BlogCMS({ showNotification }: CMSProps) {
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  
  const [newItem, setNewItem] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'TECH',
    date: new Date().toISOString().split('T')[0],
    readTime: '5 min'
  });

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
      setIsLoading(false);
      return;
    }
    // Blog posts ordered by date descending
    const q = query(collection(db, "blog_posts"), orderBy("date", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setItems(data);
      setIsLoading(false);
    }, (error) => {
      console.error(error);
      showNotification('error', 'SYSTEM_FAILURE: Unable to fetch blog logs.');
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [showNotification]);

  const handleAdd = async () => {
    if (!newItem.title || !newItem.content) {
      showNotification('error', 'VALIDATION_ERROR: Title and Content are required.');
      return;
    }
    setIsSubmitting(true);
    try {
      if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) return;
      await addDoc(collection(db, "blog_posts"), { ...newItem, timestamp: new Date() });
      setIsAdding(false);
      setNewItem({ title: '', excerpt: '', content: '', category: 'TECH', date: new Date().toISOString().split('T')[0], readTime: '5 min' });
      showNotification('success', 'LOG_COMMITTED: Blog post published.');
    } catch (error) {
      console.error(error);
      showNotification('error', 'SYSTEM_FAILURE: Could not publish log.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsSubmitting(true);
    try {
      if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) return;
      await deleteDoc(doc(db, "blog_posts", id));
      setDeleteConfirm(null);
      showNotification('success', 'LOG_PURGED: Blog post removed.');
    } catch (error) {
      console.error(error);
      showNotification('error', 'SYSTEM_FAILURE: Could not purge log.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <h2 className="font-mono text-xs font-bold text-accent-cyan tracking-widest uppercase">Blog_Posts</h2>
        </div>
        <div className="flex gap-2">
          {!isAdding ? (
            <button onClick={() => setIsAdding(true)} disabled={isLoading || isSubmitting} className="flex items-center gap-2 glass px-3 py-1.5 hover:bg-white/5 transition-colors font-mono text-[10px] font-bold uppercase disabled:opacity-50">
              <Plus size={14} /> NEW_LOG_ENTRY
            </button>
          ) : (
            <button onClick={() => setIsAdding(false)} disabled={isLoading || isSubmitting} className="flex items-center gap-2 glass px-4 py-2 hover:bg-white/5 transition-colors font-mono text-[10px] font-bold uppercase disabled:opacity-50">
              <X size={14} /> CANCEL_ENTRY
            </button>
          )}
        </div>
      </div>

      {isAdding && (
        <div className="glass p-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Title *" value={newItem.title} onChange={v => setNewItem({...newItem, title: v})} />
            <FormInput label="Category" value={newItem.category} onChange={v => setNewItem({...newItem, category: v})} />
            <FormInput label="Date (YYYY-MM-DD)" value={newItem.date} onChange={v => setNewItem({...newItem, date: v})} />
            <FormInput label="Read Time (e.g. 5 min)" value={newItem.readTime} onChange={v => setNewItem({...newItem, readTime: v})} />
          </div>
          <FormTextarea label="Excerpt" value={newItem.excerpt} onChange={v => setNewItem({...newItem, excerpt: v})} />
          <FormTextarea label="Content (Markdown supported) *" value={newItem.content} onChange={v => setNewItem({...newItem, content: v})} />
          <button 
            onClick={handleAdd} 
            disabled={isSubmitting}
            className="w-full bg-accent-cyan text-black font-bold py-3 font-mono text-xs tracking-widest flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70"
          >
            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {isSubmitting ? 'COMMITTING...' : 'PUBLISH_LOG'}
          </button>
        </div>
      )}

      {isLoading ? (
        <LoadingState text="FETCHING_LOGS..." />
      ) : (
        <div className="space-y-4">
          {items.map(item => (
            <div key={item.id} className="p-4 glass group flex justify-between items-center hover:border-accent-cyan/30 transition-colors bg-[#0a0a0a]">
              <div className="flex items-center gap-4">
                <div>
                  <div className="flex items-center gap-3">
                     <span className="text-[10px] font-mono text-accent-cyan bg-accent-cyan/5 px-2 py-0.5 border border-accent-cyan/20 font-bold">{item.category}</span>
                     <h3 className="font-bold text-text-primary">{item.title}</h3>
                  </div>
                  <p className="text-[10px] text-text-secondary mt-1 font-mono uppercase tracking-tighter">{item.date} | {item.readTime}</p>
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
            </div>
          ))}
          {items.length === 0 && !isAdding && <EmptyState text="NO_LOGS_FOUND" />}
        </div>
      )}
    </div>
  );
}
