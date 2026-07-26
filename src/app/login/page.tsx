"use client";

import { useState } from "react";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Lock, Mail, LogIn, RefreshCw, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useAsyncState } from "@/hooks/useAsyncState";
import { useToast } from "@/context/ToastContext";
import FadeIn from "@/components/FadeIn";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const toast = useToast();
  
  const authState = useAsyncState({
    successDuration: 1000,
    onSuccess: () => {
      toast.success("AUTH_SUCCESS", "Clearance granted. Establishing secure connection...");
      setTimeout(() => router.push("/dashboard"), 800);
    },
    onError: (msg) => {
      toast.error("AUTH_FAILED", msg);
    }
  });

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (authState.isBusy) return;
    
    await authState.execute(async () => {
      await signInWithEmailAndPassword(auth, email, password);
    });
  };

  const handleGoogleLogin = async () => {
    if (authState.isBusy) return;
    const provider = new GoogleAuthProvider();
    
    await authState.execute(async () => {
      await signInWithPopup(auth, provider);
    });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-cyan/5 blur-[120px] rounded-full pointer-events-none animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-purple/5 blur-[120px] rounded-full pointer-events-none animate-float" style={{ animationDelay: "1s" }} />

      <FadeIn delay={0.1} className="w-full max-w-md relative z-10">
        <div className="glass p-10 rounded-2xl relative overflow-hidden group">
          {/* Top Edge Highlight */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-cyan/30 to-transparent" />
          
          <div className="text-center mb-8 relative">
            <FadeIn delay={0.2} direction="down">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-surface border border-surface mb-6 group-hover:border-accent-cyan/30 transition-colors">
                <Lock className="text-accent-cyan" size={32} />
              </div>
              <h1 className="text-3xl font-bold tracking-tight mb-2">SECURE_ACCESS</h1>
              <p className="text-text-secondary font-mono text-sm uppercase tracking-widest">Identify yourself to proceed</p>
            </FadeIn>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <FadeIn delay={0.3} direction="none">
              <div className="space-y-2">
                <div className="relative group/input">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within/input:text-accent-cyan transition-colors" size={18} />
                  <input
                    type="email"
                    placeholder="EMAIL_ADDRESS"
                    className="w-full dark:bg-black/40 bg-white/60 border border-surface rounded-xl py-3 pl-12 pr-4 outline-none focus:border-accent-cyan/50 transition-colors font-mono text-sm disabled:opacity-50 text-text-primary placeholder:text-text-secondary"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={authState.isBusy || authState.isSuccess}
                  />
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.4} direction="none">
              <div className="space-y-2">
                <div className="relative group/input">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within/input:text-accent-cyan transition-colors" size={18} />
                  <input
                    type="password"
                    placeholder="ACCESS_KEY"
                    className="w-full dark:bg-black/40 bg-white/60 border border-surface rounded-xl py-3 pl-12 pr-4 outline-none focus:border-accent-cyan/50 transition-colors font-mono text-sm disabled:opacity-50 text-text-primary placeholder:text-text-secondary"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={authState.isBusy || authState.isSuccess}
                  />
                </div>
              </div>
            </FadeIn>

            {/* Error Message with Shake Animation */}
            {authState.isError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-mono p-3 rounded-lg animate-shake flex items-center justify-center text-center">
                {authState.error}
              </div>
            )}

            <FadeIn delay={0.5} direction="up">
              <button
                type="submit"
                disabled={authState.isBusy || authState.isSuccess}
                className="w-full relative overflow-hidden bg-accent-cyan hover:bg-accent-cyan/90 dark:text-black text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] disabled:active:scale-100 disabled:opacity-70 disabled:cursor-not-allowed group/btn"
              >
                {/* Button shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-shimmer" />
                
                {authState.isBusy ? (
                  <>
                    <RefreshCw size={18} className="animate-spin-slow" />
                    AUTHORIZING...
                  </>
                ) : authState.isSuccess ? (
                  <>
                    <CheckCircle2 size={18} />
                    ACCESS_GRANTED
                  </>
                ) : (
                  <>
                    <LogIn size={18} />
                    AUTHORIZE
                  </>
                )}
              </button>
            </FadeIn>
          </form>

          <FadeIn delay={0.6} direction="up">
            <div className="flex items-center gap-4 my-6">
              <div className="h-px flex-1 bg-surface" />
              <span className="text-[10px] font-mono text-text-secondary">OR_CONNECT_VIA</span>
              <div className="h-px flex-1 bg-surface" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleGoogleLogin}
                disabled={authState.isBusy || authState.isSuccess}
                className="glass dark:hover:bg-white/5 hover:bg-black/5 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors font-mono text-[10px] font-bold disabled:opacity-50 disabled:cursor-not-allowed border-accent-cyan/10 hover:border-accent-cyan/30 text-text-primary"
              >
                GOOGLE
              </button>
              <button className="glass dark:hover:bg-white/5 hover:bg-black/5 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors font-mono text-[10px] font-bold opacity-50 cursor-not-allowed text-text-primary">
                GITHUB
              </button>
            </div>
          </FadeIn>

          <FadeIn delay={0.7} direction="none" className="text-center mt-8">
            <Link href="/" className="text-[10px] font-mono text-text-secondary hover:text-accent-cyan transition-colors tracking-widest">
              RETURN_TO_BASE_STATION
            </Link>
          </FadeIn>
        </div>
      </FadeIn>
    </div>
  );
}
