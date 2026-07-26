"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ShieldAlert,
  Loader2,
  Clock,
  RefreshCw,
  X,
} from "lucide-react";

export type OverlayMode = "loading" | "success" | "warning" | "error" | "fail" | "waiting";

interface StatusOverlayProps {
  mode: OverlayMode;
  title?: string;
  message?: string;
  visible: boolean;
  // For warning/confirm mode
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  countdownSec?: number; // auto-cancel countdown
  // For error/fail mode
  onRetry?: () => void;
  // For loading mode
  subtext?: string;
}

// ─── Config per mode ──────────────────────────────────────────────────────────

const modeConfig = {
  loading: {
    icon: null, // animated custom
    color: "#00f2ff",
    glow: "rgba(0,242,255,0.15)",
    ringGlow: "rgba(0,242,255,0.3)",
    bg: "rgba(0,242,255,0.03)",
    defaultTitle: "INITIALIZING...",
    defaultMessage: "Please wait while the system processes your request.",
  },
  success: {
    icon: <CheckCircle2 size={48} strokeWidth={1.5} />,
    color: "#34d399",
    glow: "rgba(52,211,153,0.15)",
    ringGlow: "rgba(52,211,153,0.3)",
    bg: "rgba(52,211,153,0.03)",
    defaultTitle: "OPERATION SUCCESSFUL",
    defaultMessage: "Your request has been completed successfully.",
  },
  warning: {
    icon: <AlertTriangle size={48} strokeWidth={1.5} />,
    color: "#fbbf24",
    glow: "rgba(251,191,36,0.15)",
    ringGlow: "rgba(251,191,36,0.3)",
    bg: "rgba(251,191,36,0.03)",
    defaultTitle: "CONFIRM ACTION",
    defaultMessage: "This action may have irreversible consequences.",
  },
  error: {
    icon: <XCircle size={48} strokeWidth={1.5} />,
    color: "#f87171",
    glow: "rgba(248,113,113,0.15)",
    ringGlow: "rgba(248,113,113,0.3)",
    bg: "rgba(248,113,113,0.03)",
    defaultTitle: "ACCESS DENIED",
    defaultMessage: "You do not have permission to view this resource.",
  },
  fail: {
    icon: <ShieldAlert size={48} strokeWidth={1.5} />,
    color: "#fb923c",
    glow: "rgba(251,146,60,0.15)",
    ringGlow: "rgba(251,146,60,0.3)",
    bg: "rgba(251,146,60,0.03)",
    defaultTitle: "OPERATION FAILED",
    defaultMessage: "An unexpected error occurred. Please try again.",
  },
  waiting: {
    icon: <Clock size={48} strokeWidth={1.5} />,
    color: "#a78bfa",
    glow: "rgba(167,139,250,0.15)",
    ringGlow: "rgba(167,139,250,0.3)",
    bg: "rgba(167,139,250,0.03)",
    defaultTitle: "PROCESSING...",
    defaultMessage: "Background operation in progress.",
  },
};

// ─── Liquid Glass Backdrop ────────────────────────────────────────────────────

function LiquidGlassBackdrop({ color, bg }: { color: string; bg: string }) {
  return (
    <>
      {/* Multi-layer blur backdrop */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          background: "rgba(6,6,8,0.75)",
          backdropFilter: "blur(32px) saturate(200%)",
          WebkitBackdropFilter: "blur(32px) saturate(200%)",
        }}
      />
      {/* Ambient glow orbs */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div
          className="absolute top-1/4 left-1/4 w-[40vw] h-[40vh] rounded-full blur-[100px]"
          style={{ background: `${color}18` }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-[30vw] h-[30vh] rounded-full blur-[120px]"
          style={{ background: `${color}10` }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 50% 50%, ${bg} 0%, transparent 70%)`,
          }}
        />
      </motion.div>
      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />
    </>
  );
}

// ─── Loading Icon ─────────────────────────────────────────────────────────────

function LoadingIcon({ color }: { color: string }) {
  return (
    <div className="relative w-20 h-20 flex items-center justify-center">
      {/* Outer rotating ring */}
      <motion.div
        className="absolute inset-0 rounded-full border-2"
        style={{ borderColor: `${color}30`, borderTopColor: color }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
      />
      {/* Inner counter-rotating ring */}
      <motion.div
        className="absolute inset-3 rounded-full border-2"
        style={{ borderColor: `${color}20`, borderBottomColor: color }}
        animate={{ rotate: -360 }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
      />
      {/* Center pulse dot */}
      <motion.div
        className="w-3 h-3 rounded-full"
        style={{ background: color, boxShadow: `0 0 16px ${color}` }}
        animate={{ scale: [1, 1.4, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Scanning line */}
      <motion.div
        className="absolute inset-0 rounded-full overflow-hidden"
      >
        <motion.div
          className="absolute left-0 right-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
          animate={{ top: ["0%", "100%", "0%"] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </div>
  );
}

// ─── Typewriter Text ──────────────────────────────────────────────────────────

function TypewriterText({ text, color }: { text: string; color: string }) {
  const [displayed, setDisplayed] = useState("");
  const i = useRef(0);

  useEffect(() => {
    i.current = 0;
    setDisplayed("");
    const interval = setInterval(() => {
      if (i.current < text.length) {
        setDisplayed(text.slice(0, i.current + 1));
        i.current++;
      } else {
        clearInterval(interval);
      }
    }, 35);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <span>
      {displayed}
      <motion.span
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.7, repeat: Infinity }}
        style={{ color }}
      >_</motion.span>
    </span>
  );
}

// ─── Glass Card ───────────────────────────────────────────────────────────────

function GlassCard({
  color,
  glow,
  ringGlow,
  children,
}: {
  color: string;
  glow: string;
  ringGlow: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88, y: 24 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -16 }}
      transition={{ type: "spring", stiffness: 300, damping: 28, delay: 0.1 }}
      className="relative w-full max-w-md mx-4 overflow-hidden"
      style={{
        background: "rgba(14,14,16,0.72)",
        backdropFilter: "blur(40px) saturate(200%)",
        WebkitBackdropFilter: "blur(40px) saturate(200%)",
        border: `1px solid ${ringGlow}`,
        borderRadius: "24px",
        boxShadow: `
          0 32px 80px rgba(0,0,0,0.6),
          0 0 0 1px rgba(255,255,255,0.05) inset,
          0 4px 40px ${glow},
          0 0 80px ${glow}
        `,
      }}
    >
      {/* Inner glass shine */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.01) 50%, transparent 100%)",
          borderRadius: "inherit",
        }}
      />
      {/* Top accent line */}
      <div
        className="absolute top-0 left-8 right-8 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${color}60, transparent)` }}
      />
      {children}
    </motion.div>
  );
}

// ─── Main Overlay ─────────────────────────────────────────────────────────────

export default function StatusOverlay({
  mode,
  title,
  message,
  visible,
  onConfirm,
  onCancel,
  confirmLabel = "CONFIRM",
  cancelLabel = "CANCEL",
  countdownSec,
  onRetry,
  subtext,
}: StatusOverlayProps) {
  const cfg = modeConfig[mode];
  const displayTitle = title ?? cfg.defaultTitle;
  const displayMsg = message ?? cfg.defaultMessage;

  const [countdown, setCountdown] = useState(countdownSec ?? 0);

  useEffect(() => {
    if (!visible || !countdownSec) return;
    setCountdown(countdownSec);
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          onCancel?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [visible, countdownSec, onCancel]);

  return (
    <AnimatePresence mode="wait">
      {visible && (
        <motion.div
          key={`overlay-${mode}`}
          className="fixed inset-0 z-[300] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* Liquid glass backdrop */}
          <LiquidGlassBackdrop color={cfg.color} bg={cfg.bg} />

          {/* Card */}
          <GlassCard color={cfg.color} glow={cfg.glow} ringGlow={cfg.ringGlow}>
            <div className="relative z-10 p-8 flex flex-col items-center text-center gap-6">

              {/* Close button (for warning/error with cancel) */}
              {(onCancel && mode !== "loading") && (
                <button
                  onClick={onCancel}
                  className="absolute top-4 right-4 text-white/30 hover:text-white/70 transition-colors"
                >
                  <X size={18} />
                </button>
              )}

              {/* Icon */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.2 }}
                style={{ color: cfg.color, filter: `drop-shadow(0 0 20px ${cfg.color}60)` }}
              >
                {mode === "loading" ? (
                  <LoadingIcon color={cfg.color} />
                ) : (
                  <motion.div
                    animate={
                      mode === "success" ? { scale: [1, 1.15, 1] } :
                      mode === "warning" ? { rotate: [0, -3, 3, -3, 0] } :
                      mode === "error" || mode === "fail" ? { x: [0, -4, 4, -4, 0] } :
                      {}
                    }
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    {cfg.icon}
                  </motion.div>
                )}
              </motion.div>

              {/* Title */}
              <div className="space-y-2">
                <motion.h2
                  className="font-mono text-base font-bold uppercase tracking-[0.2em]"
                  style={{ color: cfg.color }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {mode === "loading" ? (
                    <TypewriterText text={displayTitle} color={cfg.color} />
                  ) : (
                    displayTitle
                  )}
                </motion.h2>
                <motion.p
                  className="text-sm text-white/55 leading-relaxed font-sans max-w-xs"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {displayMsg}
                </motion.p>
                {subtext && (
                  <motion.p
                    className="text-xs font-mono text-white/30 tracking-widest uppercase mt-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    {subtext}
                  </motion.p>
                )}
              </div>

              {/* Actions */}
              {mode === "warning" && (onConfirm || onCancel) && (
                <motion.div
                  className="flex gap-3 w-full"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <button
                    onClick={onCancel}
                    className="flex-1 py-2.5 px-4 text-xs font-mono font-bold uppercase tracking-widest transition-all rounded-xl"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "rgba(255,255,255,0.5)",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                      e.currentTarget.style.color = "rgba(255,255,255,0.8)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                      e.currentTarget.style.color = "rgba(255,255,255,0.5)";
                    }}
                  >
                    {cancelLabel}
                    {countdownSec && countdown > 0 ? ` (${countdown}s)` : ""}
                  </button>
                  <button
                    onClick={onConfirm}
                    className="flex-1 py-2.5 px-4 text-xs font-mono font-bold uppercase tracking-widest rounded-xl transition-all"
                    style={{
                      background: `${cfg.color}18`,
                      border: `1px solid ${cfg.color}40`,
                      color: cfg.color,
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = `${cfg.color}30`;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = `${cfg.color}18`;
                    }}
                  >
                    {confirmLabel}
                  </button>
                </motion.div>
              )}

              {/* Retry for error/fail */}
              {(mode === "error" || mode === "fail") && onRetry && (
                <motion.button
                  onClick={onRetry}
                  className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest px-6 py-2.5 rounded-xl transition-all"
                  style={{
                    background: `${cfg.color}15`,
                    border: `1px solid ${cfg.color}35`,
                    color: cfg.color,
                  }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <RefreshCw size={14} className="animate-spin-slow" />
                  RETRY
                </motion.button>
              )}

              {/* Error dismiss */}
              {(mode === "error" || mode === "fail") && onCancel && !onRetry && (
                <motion.button
                  onClick={onCancel}
                  className="text-xs font-mono uppercase tracking-widest text-white/40 hover:text-white/70 transition-colors"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  DISMISS
                </motion.button>
              )}
            </div>

            {/* Bottom glow accent */}
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-px"
              style={{ background: `linear-gradient(90deg, transparent, ${cfg.color}40, transparent)` }}
            />
          </GlassCard>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
