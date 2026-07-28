"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Send, CheckCircle, Mail, MapPin, ExternalLink, Code2, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

type FormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
  website?: string;
};

export default function ContactPage() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const onSubmit = async (data: FormData) => {
    setStatus("submitting");
    setErrorMsg("");

    try {
      // 1. Save to Firestore client-side (works even without server SMTP)
      if (process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
        await addDoc(collection(db, "contact_messages"), {
          ...data,
          status: "unread",
          createdAt: serverTimestamp(),
          source: "contact_form",
        });
      }

      // 2. Trigger server-side email notification
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const resData = await res.json();
        // If Firestore already saved, treat as partial success
        if (process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
          setStatus("success");
          reset();
          return;
        }
        throw new Error(resData.error || "Submission failed.");
      }

      setStatus("success");
      reset();
    } catch (err: unknown) {
      console.error("Contact form error:", err);
      setStatus("error");
      setErrorMsg("Unable to send message. Please try again or email directly.");
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 md:px-12 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-12"
      >
        {/* Left — Info */}
        <div>
          <h1 className="text-4xl md:text-5xl font-bold font-mono text-accent-cyan mb-6 uppercase tracking-tighter">
            &gt; SECURE_COMM
          </h1>
          <p className="text-text-secondary text-lg mb-8">
            Establish a direct connection. Whether it&apos;s a project inquiry, technical discussion, or just a friendly hello.
          </p>
          
          <div className="space-y-6 text-text-primary">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/5 border border-white/10">
                <Mail className="text-accent-cyan" />
              </div>
              <div>
                <h4 className="font-bold text-sm uppercase tracking-widest text-text-secondary">Email Relay</h4>
                <a href="mailto:arwanarwan12@gmail.com" className="font-mono hover:text-accent-cyan transition-colors">
                  arwanarwan12@gmail.com
                </a>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/5 border border-white/10">
                <MapPin className="text-accent-purple" />
              </div>
              <div>
                <h4 className="font-bold text-sm uppercase tracking-widest text-text-secondary">Location</h4>
                <p className="font-mono">Sangatta, East Kalimantan — Indonesia</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/5 border border-white/10">
                <ExternalLink className="text-accent-cyan" />
              </div>
              <div>
                <h4 className="font-bold text-sm uppercase tracking-widest text-text-secondary">LinkedIn</h4>
                <a
                  href="https://linkedin.com/in/arwan-d3v"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono hover:text-accent-cyan transition-colors"
                >
                  linkedin.com/in/arwan-d3v
                </a>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/5 border border-white/10">
                <Code2 className="text-text-secondary" />
              </div>
              <div>
                <h4 className="font-bold text-sm uppercase tracking-widest text-text-secondary">GitHub</h4>
                <a
                  href="https://github.com/arwan-d3v"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono hover:text-accent-cyan transition-colors"
                >
                  github.com/arwan-d3v
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right — Form */}
        <div className="glass p-8 border border-white/10 relative overflow-hidden">
          {status === "success" ? (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute inset-0 bg-background/90 backdrop-blur-md flex flex-col items-center justify-center z-10 p-8 text-center"
            >
              <CheckCircle size={64} className="text-accent-cyan mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Transmission Received</h3>
              <p className="text-text-secondary font-mono text-sm">
                Your message has been successfully logged to the mainframe. I&apos;ll respond within 24 hours.
              </p>
              <button
                onClick={() => setStatus("idle")}
                className="mt-6 px-6 py-2 border border-accent-cyan/30 text-accent-cyan font-mono text-xs uppercase tracking-widest hover:bg-accent-cyan hover:text-black transition-colors"
              >
                Send Another
              </button>
            </motion.div>
          ) : null}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-mono text-text-secondary mb-1 uppercase tracking-widest">Identifier</label>
              <input 
                {...register("name", { required: "Name is required" })} 
                className="w-full bg-black/50 border border-white/10 px-4 py-2 text-white focus:outline-none focus:border-accent-cyan transition-colors"
                placeholder="Your Name"
              />
              {errors.name && <span className="text-red-400 text-xs mt-1 block">{errors.name.message}</span>}
            </div>
            
            {/* Honeypot field (hidden from users, visible to bots) */}
            <div className="hidden" aria-hidden="true">
              <input type="text" {...register("website")} tabIndex={-1} autoComplete="off" />
            </div>

            <div>
              <label className="block text-xs font-mono text-text-secondary mb-1 uppercase tracking-widest">Comm Link (Email)</label>
              <input 
                {...register("email", { 
                  required: "Email is required",
                  pattern: { value: /^\S+@\S+$/i, message: "Invalid email" }
                })} 
                className="w-full bg-black/50 border border-white/10 px-4 py-2 text-white focus:outline-none focus:border-accent-cyan transition-colors"
                placeholder="john@example.com"
              />
              {errors.email && <span className="text-red-400 text-xs mt-1 block">{errors.email.message}</span>}
            </div>

            <div>
              <label className="block text-xs font-mono text-text-secondary mb-1 uppercase tracking-widest">Subject</label>
              <input 
                {...register("subject", { required: "Subject is required" })} 
                className="w-full bg-black/50 border border-white/10 px-4 py-2 text-white focus:outline-none focus:border-accent-cyan transition-colors"
                placeholder="Project Inquiry"
              />
              {errors.subject && <span className="text-red-400 text-xs mt-1 block">{errors.subject.message}</span>}
            </div>

            <div>
              <label className="block text-xs font-mono text-text-secondary mb-1 uppercase tracking-widest">Transmission Payload</label>
              <textarea 
                {...register("message", { required: "Message is required" })} 
                className="w-full bg-black/50 border border-white/10 px-4 py-2 text-white focus:outline-none focus:border-accent-cyan transition-colors min-h-[120px] resize-y"
                placeholder="Enter your message here..."
              />
              {errors.message && <span className="text-red-400 text-xs mt-1 block">{errors.message.message}</span>}
            </div>

            {status === "error" && (
              <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono">
                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              disabled={status === "submitting"}
              className="mt-2 w-full gap-2"
            >
              {status === "submitting" ? (
                <><Loader2 size={16} className="animate-spin" /> Transmitting...</>
              ) : (
                <>Send Message <Send size={16} /></>
              )}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
