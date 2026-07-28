"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

interface ModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  dangerous?: boolean;
  children?: React.ReactNode;
}

export default function Modal({
  visible,
  title,
  message,
  confirmLabel = "CONFIRM",
  cancelLabel = "CANCEL",
  onConfirm,
  onCancel,
  dangerous = false,
  children,
}: ModalProps) {
  const accentColor = dangerous ? "#f87171" : "#fbbf24";
  const glow = dangerous ? "rgba(248,113,113,0.18)" : "rgba(251,191,36,0.15)";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[250] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 cursor-pointer"
            style={{
              background: "var(--color-overlay)",
              backdropFilter: "blur(20px) saturate(180%)",
              WebkitBackdropFilter: "blur(20px) saturate(180%)",
            }}
            onClick={onCancel}
          />

          {/* Ambient glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at 50% 50%, ${glow} 0%, transparent 65%)`,
            }}
          />

          {/* Modal card */}
          <motion.div
            className="relative w-full max-w-sm overflow-hidden"
            style={{
              background: "var(--color-surface)",
              backdropFilter: "blur(48px) saturate(200%)",
              WebkitBackdropFilter: "blur(48px) saturate(200%)",
              border: `1px solid ${accentColor}30`,
              borderRadius: "20px",
              boxShadow: `
                0 24px 64px rgba(0,0,0,0.7),
                0 0 0 1px rgba(255,255,255,0.04) inset,
                0 4px 32px ${glow}
              `,
            }}
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: -10 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            onClick={e => e.stopPropagation()}
          >
            {/* Top shine */}
            <div
              className="absolute top-0 left-6 right-6 h-px pointer-events-none"
              style={{ background: `linear-gradient(90deg, transparent, ${accentColor}50, transparent)` }}
            />
            {/* Inner glass shine */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 60%)",
                borderRadius: "inherit",
              }}
            />

            {/* Content */}
            <div className="relative z-10 p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: `${accentColor}12`, border: `1px solid ${accentColor}25` }}
                  >
                    <AlertTriangle size={18} style={{ color: accentColor }} />
                  </div>
                  <h3
                    className="font-mono text-xs font-bold uppercase tracking-[0.15em]"
                    style={{ color: accentColor }}
                  >
                    {title}
                  </h3>
                </div>
                <button
                  onClick={onCancel}
                  className="text-text-secondary hover:text-text-primary transition-colors shrink-0 ml-2"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Message */}
              {message && (
                <p className="text-sm text-text-secondary leading-relaxed mb-6 font-sans">
                  {message}
                </p>
              )}

              {children && (
                <div className="mb-6">
                  {children}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={onCancel}
                  className="flex-1 py-2.5 px-4 text-xs font-mono font-bold uppercase tracking-widest rounded-xl transition-all duration-200"
                  style={{
                    background: "transparent",
                    border: "1px solid var(--color-border)",
                    color: "var(--color-text-secondary)",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = "var(--color-border)";
                    e.currentTarget.style.color = "var(--color-text-primary)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "var(--color-text-secondary)";
                  }}
                >
                  {cancelLabel}
                </button>
                <button
                  onClick={onConfirm}
                  className="flex-1 py-2.5 px-4 text-xs font-mono font-bold uppercase tracking-widest rounded-xl transition-all duration-200"
                  style={{
                    background: `${accentColor}16`,
                    border: `1px solid ${accentColor}35`,
                    color: accentColor,
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = `${accentColor}28`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = `${accentColor}16`;
                  }}
                >
                  {confirmLabel}
                </button>
              </div>
            </div>

            {/* Bottom glow */}
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-px"
              style={{ background: `linear-gradient(90deg, transparent, ${accentColor}35, transparent)` }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
