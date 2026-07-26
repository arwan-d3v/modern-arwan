"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Send, CheckCircle, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";

type FormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export default function ContactPage() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSuccess(true);
    reset();
    
    // Reset success state after a while
    setTimeout(() => setIsSuccess(false), 5000);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 md:px-12 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-12"
      >
        <div>
          <h1 className="text-4xl md:text-5xl font-bold font-mono text-accent-cyan mb-6 uppercase tracking-tighter">
            &gt; SECURE_COMM
          </h1>
          <p className="text-text-secondary text-lg mb-8">
            Establish a direct connection. Whether it&apos;s a project inquiry, technical discussion, or just a friendly hello.
          </p>
          
          <div className="space-y-6 text-text-primary">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/5 rounded-full border border-white/10">
                <Mail className="text-accent-cyan" />
              </div>
              <div>
                <h4 className="font-bold text-sm uppercase tracking-widest text-text-secondary">Email Relay</h4>
                <p className="font-mono">hello@isarwan.dev</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/5 rounded-full border border-white/10">
                <MapPin className="text-accent-purple" />
              </div>
              <div>
                <h4 className="font-bold text-sm uppercase tracking-widest text-text-secondary">Location</h4>
                <p className="font-mono">Earth, Milky Way</p>
              </div>
            </div>
          </div>
        </div>

        <div className="glass p-8 rounded-xl border border-white/10 relative overflow-hidden">
          {isSuccess ? (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute inset-0 bg-background/90 backdrop-blur-md flex flex-col items-center justify-center z-10 p-8 text-center"
            >
              <CheckCircle size={64} className="text-emerald-400 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Message Sent</h3>
              <p className="text-text-secondary">Your transmission has been successfully delivered to the mainframe.</p>
            </motion.div>
          ) : null}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-mono text-text-secondary mb-1 uppercase tracking-widest">Identifier</label>
              <input 
                {...register("name", { required: "Name is required" })} 
                className="w-full bg-black/50 border border-white/10 rounded px-4 py-2 text-white focus:outline-none focus:border-accent-cyan transition-colors"
                placeholder="John Doe"
              />
              {errors.name && <span className="text-red-400 text-xs mt-1 block">{errors.name.message}</span>}
            </div>

            <div>
              <label className="block text-xs font-mono text-text-secondary mb-1 uppercase tracking-widest">Comm Link (Email)</label>
              <input 
                {...register("email", { 
                  required: "Email is required",
                  pattern: { value: /^\S+@\S+$/i, message: "Invalid email" }
                })} 
                className="w-full bg-black/50 border border-white/10 rounded px-4 py-2 text-white focus:outline-none focus:border-accent-cyan transition-colors"
                placeholder="john@example.com"
              />
              {errors.email && <span className="text-red-400 text-xs mt-1 block">{errors.email.message}</span>}
            </div>

            <div>
              <label className="block text-xs font-mono text-text-secondary mb-1 uppercase tracking-widest">Subject</label>
              <input 
                {...register("subject", { required: "Subject is required" })} 
                className="w-full bg-black/50 border border-white/10 rounded px-4 py-2 text-white focus:outline-none focus:border-accent-cyan transition-colors"
                placeholder="Project Inquiry"
              />
              {errors.subject && <span className="text-red-400 text-xs mt-1 block">{errors.subject.message}</span>}
            </div>

            <div>
              <label className="block text-xs font-mono text-text-secondary mb-1 uppercase tracking-widest">Transmission Payload</label>
              <textarea 
                {...register("message", { required: "Message is required" })} 
                className="w-full bg-black/50 border border-white/10 rounded px-4 py-2 text-white focus:outline-none focus:border-accent-cyan transition-colors min-h-[120px] resize-y"
                placeholder="Enter your message here..."
              />
              {errors.message && <span className="text-red-400 text-xs mt-1 block">{errors.message.message}</span>}
            </div>

            <Button type="submit" variant="primary" disabled={isSubmitting} className="mt-2 w-full gap-2">
              {isSubmitting ? "Transmitting..." : "Send Message"} <Send size={16} />
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
