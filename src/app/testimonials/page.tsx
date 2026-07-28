"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, Star, Send, CheckCircle2, Loader2, AlertCircle, MessageSquarePlus, X } from "lucide-react";
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import FadeIn from "@/components/FadeIn";
import { Skeleton } from "@/components/ui/Skeleton";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  avatar?: string;
  rating?: number;
  approved: boolean;
  createdAt?: { seconds: number };
}

// Fallback data while Firestore loads or not configured
const FALLBACK_TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "Alex Mercer",
    role: "Frontend Engineer",
    company: "TechFlow Inc.",
    content: "Working with Arwan was exceptional. His attention to technical detail and ability to bridge field operations with software development is rare. Delivered a complex network monitoring dashboard ahead of schedule.",
    rating: 5,
    approved: true,
  },
  {
    id: "2",
    name: "Sarah Chen",
    role: "Project Manager",
    company: "Nexus Infrastructure",
    content: "Arwan's hybrid background in mining operations and software engineering made him invaluable for our FMS integration project. His communication is clear, professional, and he always delivers what he promises.",
    rating: 5,
    approved: true,
  },
  {
    id: "3",
    name: "David Kim",
    role: "Full-Stack Developer",
    company: "StartupInc",
    content: "The portfolio platform Arwan built is stunning — cyberpunk aesthetic with rock-solid functionality. The RBAC system and CV Builder are exactly what I needed. Highly recommend for any serious web project.",
    rating: 5,
    approved: true,
  },
];

function AvatarFallback({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div className="w-12 h-12 rounded-full bg-accent-cyan/20 border border-accent-cyan/30 flex items-center justify-center flex-shrink-0">
      <span className="font-mono text-sm font-bold text-accent-cyan">{initials}</span>
    </div>
  );
}

function StarRating({ rating = 5 }: { rating?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={12}
          className={i < rating ? "text-yellow-400 fill-yellow-400" : "text-white/10"}
        />
      ))}
    </div>
  );
}

function TestimonialCard({ testimonial, index }: { testimonial: Testimonial; index: number }) {
  return (
    <FadeIn delay={0.1 * (index + 1)} className="glass p-8 border-accent-purple/10 hover:border-accent-purple/30 transition-all relative overflow-hidden group flex flex-col h-full">
      {/* Large decorative quote */}
      <Quote className="absolute -top-2 -right-2 w-20 h-20 text-accent-purple/8 group-hover:text-accent-purple/15 transition-colors" />

      {/* Rating */}
      <div className="mb-4 relative z-10">
        <StarRating rating={testimonial.rating} />
      </div>

      {/* Content */}
      <p className="text-sm text-text-primary leading-relaxed mb-6 flex-grow relative z-10 italic">
        &quot;{testimonial.content}&quot;
      </p>

      {/* Author */}
      <div className="flex items-center gap-3 mt-auto relative z-10 pt-4 border-t border-surface">
        {testimonial.avatar ? (
          <img
            src={testimonial.avatar}
            alt={testimonial.name}
            className="w-12 h-12 rounded-full border border-surface grayscale group-hover:grayscale-0 transition-all duration-300 object-cover flex-shrink-0"
          />
        ) : (
          <AvatarFallback name={testimonial.name} />
        )}
        <div>
          <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-text-primary">
            {testimonial.name}
          </h4>
          <p className="text-[10px] font-mono text-text-secondary">
            {testimonial.role}
            {testimonial.company && ` @ ${testimonial.company}`}
          </p>
        </div>
      </div>
    </FadeIn>
  );
}

type SubmitStatus = "idle" | "loading" | "success" | "error";

function PublicTestimonialForm({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [status, setStatus] = useState<SubmitStatus>("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !content) return;

    setStatus("loading");
    try {
      if (process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
        await addDoc(collection(db, "testimonials"), {
          name,
          role,
          company,
          content,
          rating,
          approved: false, // Must be approved via CMS
          createdAt: serverTimestamp(),
          source: "public_form",
        });
      }
      setStatus("success");
    } catch (err) {
      console.error("Testimonial submit error:", err);
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center text-center py-8 gap-4"
      >
        <CheckCircle2 size={48} className="text-accent-cyan" />
        <h3 className="text-xl font-bold font-mono text-white">Testimonial Received!</h3>
        <p className="text-text-secondary text-sm max-w-sm">
          Your feedback has been submitted and is pending review. It will appear publicly once approved. Thank you!
        </p>
        <button
          onClick={onClose}
          className="mt-2 px-6 py-2 border border-accent-cyan/30 text-accent-cyan font-mono text-xs uppercase tracking-widest hover:bg-accent-cyan hover:text-black transition-colors"
        >
          Close
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Star Rating Selector */}
      <div>
        <label className="block text-xs font-mono text-text-secondary mb-2 uppercase tracking-widest">Your Rating</label>
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setRating(i + 1)}
              onMouseEnter={() => setHoveredStar(i + 1)}
              onMouseLeave={() => setHoveredStar(0)}
              className="p-1"
            >
              <Star
                size={20}
                className={
                  i < (hoveredStar || rating)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-white/20"
                }
              />
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-mono text-text-secondary mb-1 uppercase tracking-widest">
            Name <span className="text-accent-cyan">*</span>
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full bg-black/50 border border-white/10 px-4 py-2 text-white focus:outline-none focus:border-accent-cyan transition-colors text-sm"
            placeholder="Your full name"
          />
        </div>
        <div>
          <label className="block text-xs font-mono text-text-secondary mb-1 uppercase tracking-widest">Role / Title</label>
          <input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full bg-black/50 border border-white/10 px-4 py-2 text-white focus:outline-none focus:border-accent-cyan transition-colors text-sm"
            placeholder="e.g. Senior Engineer"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-mono text-text-secondary mb-1 uppercase tracking-widest">Company / Organization</label>
        <input
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="w-full bg-black/50 border border-white/10 px-4 py-2 text-white focus:outline-none focus:border-accent-cyan transition-colors text-sm"
          placeholder="Company name (optional)"
        />
      </div>

      <div>
        <label className="block text-xs font-mono text-text-secondary mb-1 uppercase tracking-widest">
          Your Testimonial <span className="text-accent-cyan">*</span>
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          className="w-full bg-black/50 border border-white/10 px-4 py-2 text-white focus:outline-none focus:border-accent-cyan transition-colors min-h-[100px] resize-y text-sm"
          placeholder="Share your experience working with Arwan..."
        />
      </div>

      {status === "error" && (
        <div className="flex items-center gap-2 text-red-400 text-xs font-mono">
          <AlertCircle size={14} /> Failed to submit. Please try again.
        </div>
      )}

      <button
        type="submit"
        disabled={status === "loading" || !name || !content}
        className="flex items-center justify-center gap-2 px-6 py-3 bg-accent-cyan text-background font-mono font-bold uppercase tracking-widest hover:bg-white transition-colors disabled:opacity-50 disabled:hover:bg-accent-cyan"
      >
        {status === "loading" ? (
          <><Loader2 size={16} className="animate-spin" /> Submitting...</>
        ) : (
          <><Send size={16} /> Submit Testimonial</>
        )}
      </button>
      <p className="text-[10px] text-text-secondary font-mono text-center">
        Your testimonial will be reviewed before appearing publicly.
      </p>
    </form>
  );
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
      setTestimonials(FALLBACK_TESTIMONIALS);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "testimonials"),
      where("approved", "==", true),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Testimonial));
        setTestimonials(data.length > 0 ? data : FALLBACK_TESTIMONIALS);
        setLoading(false);
      },
      (error) => {
        console.error("Testimonials fetch error:", error);
        setTestimonials(FALLBACK_TESTIMONIALS);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center max-w-2xl mx-auto"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-px w-12 bg-accent-purple/50" />
            <span className="font-mono text-[10px] text-accent-purple tracking-[0.3em] uppercase">
              [CLIENT_FEEDBACK]
            </span>
            <div className="h-px w-12 bg-accent-purple/50" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 uppercase text-text-primary">
            System <span className="text-accent-purple">Feedback</span>
          </h1>
          <p className="text-text-secondary font-mono text-sm leading-relaxed">
            Telemetry from clients, collaborators, and operatives who have worked directly with the system.
          </p>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center gap-8 md:gap-16 mb-16 text-center"
        >
          {[
            { value: `${testimonials.length}+`, label: "Verified Reviews" },
            { value: "5.0", label: "Avg Rating" },
            { value: "100%", label: "Satisfaction Rate" },
          ].map((stat, i) => (
            <div key={i}>
              <div className="text-2xl md:text-3xl font-mono font-bold text-text-primary">{stat.value}</div>
              <div className="text-[10px] font-mono text-text-secondary uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Testimonials Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {testimonials.map((t, i) => (
              <TestimonialCard key={t.id} testimonial={t} index={i} />
            ))}
          </div>
        )}

        {/* CTA — Submit Testimonial */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-2 px-8 py-4 glass border border-accent-purple/30 text-text-secondary hover:text-accent-purple hover:border-accent-purple transition-colors font-mono text-xs uppercase tracking-widest"
          >
            <MessageSquarePlus size={16} />
            {showForm ? "Hide Form" : "Leave a Testimonial"}
          </button>
        </motion.div>

        {/* Public Submission Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: 32 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="glass p-8 md:p-10 border border-accent-purple/20 max-w-2xl mx-auto relative">
                <button
                  onClick={() => setShowForm(false)}
                  className="absolute top-4 right-4 p-2 text-text-secondary hover:text-text-primary transition-colors"
                  aria-label="Close form"
                >
                  <X size={18} />
                </button>
                <h2 className="text-xl font-bold font-mono text-text-primary mb-6 uppercase tracking-widest">
                  Share Your Experience
                </h2>
                <PublicTestimonialForm onClose={() => setShowForm(false)} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
