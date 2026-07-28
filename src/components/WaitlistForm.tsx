"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Send, CheckCircle2, Loader2, AlertCircle } from "lucide-react";

const waitlistSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

type WaitlistFormValues = z.infer<typeof waitlistSchema>;

export default function WaitlistForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<WaitlistFormValues>({
    resolver: zodResolver(waitlistSchema),
  });

  const onSubmit = async (data: WaitlistFormValues) => {
    try {
      setStatus("loading");
      
      if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
        // Mock success if firebase is not configured
        setTimeout(() => {
          setStatus("success");
          reset();
        }, 1000);
        return;
      }

      await addDoc(collection(db, "waitlist_leads"), {
        email: data.email,
        createdAt: serverTimestamp(),
        source: "landing_page",
      });
      
      setStatus("success");
      reset();
    } catch (err) {
      console.error("Waitlist error:", err);
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="glass p-6 rounded-xl flex flex-col items-center justify-center text-center max-w-md mx-auto animate-slide-down border-accent-cyan/30">
        <CheckCircle2 size={48} className="text-accent-cyan mb-4" />
        <h3 className="text-xl font-bold font-mono text-white mb-2">You&apos;re on the list!</h3>
        <p className="text-text-secondary text-sm">
          We&apos;ll notify you as soon as the Pro features are available. Stay tuned.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="relative flex flex-col gap-2">
        <div className="relative flex w-full items-center">
          <input
            {...register("email")}
            type="email"
            placeholder="Enter your email for early access..."
            className="w-full glass bg-white/5 border border-white/10 rounded-full px-6 py-4 text-white placeholder:text-text-secondary focus:outline-none focus:border-accent-cyan transition-colors"
            disabled={status === "loading"}
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="absolute right-2 p-2 bg-accent-cyan text-background rounded-full hover:bg-white transition-colors disabled:opacity-50 disabled:hover:bg-accent-cyan flex items-center justify-center"
          >
            {status === "loading" ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Send size={20} className="ml-1" />
            )}
          </button>
        </div>
        {errors.email && (
          <p className="text-red-400 text-xs font-mono pl-4 flex items-center gap-1 animate-slide-down">
            <AlertCircle size={12} /> {errors.email.message}
          </p>
        )}
        {status === "error" && (
          <p className="text-red-400 text-xs font-mono pl-4 flex items-center gap-1 animate-slide-down">
            <AlertCircle size={12} /> Something went wrong. Please try again.
          </p>
        )}
      </form>
      <p className="text-center text-[10px] text-text-secondary mt-4 font-mono tracking-widest uppercase">
        No spam. Unsubscribe anytime.
      </p>
    </div>
  );
}
