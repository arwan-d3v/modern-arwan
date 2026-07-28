import React from 'react';
import { AlertTriangle, CheckCircle2, Info, Loader2, Database, X } from 'lucide-react';
export type NotificationType = { type: 'success' | 'error' | 'info', message: string };

// --- CMS Components ---

export interface CMSProps {
  showNotification: (type: 'success' | 'error' | 'info', message: string) => void;
}

// --- UI Helpers ---

export function NotificationBanner({ notification, onClose }: { notification: NotificationType, onClose: () => void }) {
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

export function LoadingState({ text }: { text: string }) {
  return (
    <div className="py-12 flex flex-col items-center justify-center gap-4 text-text-secondary">
      <Loader2 size={24} className="animate-spin text-accent-cyan opacity-50" />
      <p className="font-mono text-[10px] uppercase tracking-widest font-bold opacity-50">{text}</p>
    </div>
  );
}

export function EmptyState({ text }: { text: string }) {
  return (
    <div className="py-12 flex flex-col items-center justify-center border border-dashed border-surface text-text-secondary bg-surface/10">
      <Database size={24} className="opacity-20 mb-3" />
      <p className="font-mono text-[10px] uppercase tracking-widest font-bold opacity-50">{text}</p>
    </div>
  );
}

export function FormInput({ label, value, onChange, type = "text" }: { label: string, value: string, onChange: (v: string) => void, type?: string }) {
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

export function FormTextarea({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) {
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
