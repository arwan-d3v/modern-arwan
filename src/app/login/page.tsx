"use client";

import { useState } from "react";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Lock, Mail, LogIn } from "lucide-react";
import Link from "next/link";
import { FirebaseError } from "firebase/app";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err) {
      if (err instanceof FirebaseError) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push("/dashboard");
    } catch (err) {
      if (err instanceof FirebaseError) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8 glass p-10 rounded-2xl relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent-cyan/10 blur-[80px] rounded-full" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-accent-purple/10 blur-[80px] rounded-full" />

        <div className="text-center relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-surface border border-surface mb-6">
            <Lock className="text-accent-cyan" size={32} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">SECURE_ACCESS</h1>
          <p className="text-text-secondary font-mono text-sm uppercase tracking-widest">Identify yourself to proceed</p>
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-4 relative z-10">
          <div className="space-y-2">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
              <input
                type="email"
                placeholder="EMAIL_ADDRESS"
                className="w-full bg-black/40 border border-surface rounded-xl py-3 pl-12 pr-4 outline-none focus:border-accent-cyan/50 transition-colors font-mono text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
              <input
                type="password"
                placeholder="ACCESS_KEY"
                className="w-full bg-black/40 border border-surface rounded-xl py-3 pl-12 pr-4 outline-none focus:border-accent-cyan/50 transition-colors font-mono text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-mono p-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-accent-cyan hover:bg-accent-cyan/90 text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all transform active:scale-[0.98]"
          >
            <LogIn size={18} />
            AUTHORIZE
          </button>
        </form>

        <div className="relative z-10">
          <div className="flex items-center gap-4 my-6">
            <div className="h-px flex-1 bg-surface" />
            <span className="text-[10px] font-mono text-text-secondary">OR_CONNECT_VIA</span>
            <div className="h-px flex-1 bg-surface" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleGoogleLogin}
              className="glass hover:bg-white/5 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors font-mono text-[10px] font-bold"
            >
              GOOGLE
            </button>
            <button className="glass hover:bg-white/5 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors font-mono text-[10px] font-bold opacity-50 cursor-not-allowed">
              GITHUB
            </button>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link href="/" className="text-[10px] font-mono text-text-secondary hover:text-accent-cyan transition-colors tracking-widest">
            RETURN_TO_BASE_STATION
          </Link>
        </div>
      </div>
    </div>
  );
}
