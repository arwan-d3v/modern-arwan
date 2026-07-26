"use client";

import React, { createContext, useContext, useCallback, useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  X,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

export type ToastType = "success" | "warning" | "error" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number; // ms, default 4000
}

interface ToastContextType {
  toasts: Toast[];
  toast: (options: Omit<Toast, "id">) => string;
  success: (title: string, message?: string) => string;
  warning: (title: string, message?: string) => string;
  error: (title: string, message?: string) => string;
  info: (title: string, message?: string) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

// ─── Context ─────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: string) => {
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = useCallback((options: Omit<Toast, "id">): string => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const duration = options.duration ?? 4000;
    const newToast: Toast = { ...options, id, duration };

    setToasts(prev => {
      const next = [newToast, ...prev].slice(0, 5); // max 5 toasts
      return next;
    });

    if (duration > 0) {
      const timer = setTimeout(() => dismiss(id), duration);
      timersRef.current.set(id, timer);
    }

    return id;
  }, [dismiss]);

  const success = useCallback((title: string, message?: string) =>
    toast({ type: "success", title, message }), [toast]);

  const warning = useCallback((title: string, message?: string) =>
    toast({ type: "warning", title, message, duration: 6000 }), [toast]);

  const error = useCallback((title: string, message?: string) =>
    toast({ type: "error", title, message, duration: 7000 }), [toast]);

  const info = useCallback((title: string, message?: string) =>
    toast({ type: "info", title, message }), [toast]);

  const dismissAll = useCallback(() => {
    timersRef.current.forEach(timer => clearTimeout(timer));
    timersRef.current.clear();
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, toast, success, warning, error, info, dismiss, dismissAll }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

// ─── Toast Container ──────────────────────────────────────────────────────────

function ToastContainer({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: string) => void }) {
  return (
    <div
      className="fixed right-4 z-[200] flex flex-col gap-3 pointer-events-none"
      style={{ top: "calc(4rem + 12px)" }} // 4rem = navbar height (pt-16)
    >
      <AnimatePresence mode="popLayout">
        {toasts.map(t => (
          <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
}

// ─── Toast Item ───────────────────────────────────────────────────────────────

const toastConfig: Record<ToastType, {
  icon: React.ReactNode;
  barColor: string;
  glowColor: string;
  borderColor: string;
  iconColor: string;
}> = {
  success: {
    icon: <CheckCircle2 size={18} />,
    barColor: "bg-emerald-400",
    glowColor: "rgba(52,211,153,0.15)",
    borderColor: "rgba(52,211,153,0.25)",
    iconColor: "text-emerald-400",
  },
  warning: {
    icon: <AlertTriangle size={18} />,
    barColor: "bg-amber-400",
    glowColor: "rgba(251,191,36,0.15)",
    borderColor: "rgba(251,191,36,0.25)",
    iconColor: "text-amber-400",
  },
  error: {
    icon: <XCircle size={18} />,
    barColor: "bg-red-400",
    glowColor: "rgba(248,113,113,0.15)",
    borderColor: "rgba(248,113,113,0.25)",
    iconColor: "text-red-400",
  },
  info: {
    icon: <Info size={18} />,
    barColor: "bg-[#00f2ff]",
    glowColor: "rgba(0,242,255,0.15)",
    borderColor: "rgba(0,242,255,0.25)",
    iconColor: "text-[#00f2ff]",
  },
};

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  const cfg = toastConfig[toast.type];
  const duration = toast.duration ?? 4000;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 80, scale: 0.92 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60, scale: 0.88 }}
      transition={{ type: "spring", stiffness: 380, damping: 30 }}
      className="pointer-events-auto relative overflow-hidden w-80 max-w-[calc(100vw-2rem)]"
      style={{
        background: "rgba(14, 14, 16, 0.82)",
        backdropFilter: "blur(24px) saturate(180%)",
        WebkitBackdropFilter: "blur(24px) saturate(180%)",
        border: `1px solid ${cfg.borderColor}`,
        borderRadius: "12px",
        boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04) inset, 0 2px 20px ${cfg.glowColor}`,
      }}
    >
      {/* Glass shine */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 60%)",
          borderRadius: "inherit",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex items-start gap-3 p-4">
        <span className={`shrink-0 mt-0.5 ${cfg.iconColor}`}>{cfg.icon}</span>
        <div className="flex-1 min-w-0">
          <p className="font-mono text-xs font-bold text-white uppercase tracking-wide leading-tight">
            {toast.title}
          </p>
          {toast.message && (
            <p className="text-[11px] text-white/60 mt-1 leading-relaxed font-sans">
              {toast.message}
            </p>
          )}
        </div>
        <button
          onClick={() => onDismiss(toast.id)}
          className="shrink-0 text-white/30 hover:text-white/70 transition-colors mt-0.5"
        >
          <X size={14} />
        </button>
      </div>

      {/* Progress drain bar */}
      {duration > 0 && (
        <motion.div
          className={`absolute bottom-0 left-0 h-[2px] ${cfg.barColor}`}
          initial={{ width: "100%" }}
          animate={{ width: "0%" }}
          transition={{ duration: duration / 1000, ease: "linear" }}
          style={{ boxShadow: `0 0 8px ${cfg.glowColor}` }}
        />
      )}
    </motion.div>
  );
}
