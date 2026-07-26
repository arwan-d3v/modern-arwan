"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    content: "Arwan transformed our legacy system into a blazing fast modern web application. Highly recommended!",
    author: "Jane Doe",
    role: "CTO at TechCorp"
  },
  {
    id: 2,
    content: "An absolute pleasure to work with. The attention to UI detail and micro-animations is next level.",
    author: "John Smith",
    role: "Product Manager at Innovate.io"
  },
  {
    id: 3,
    content: "Delivered our project ahead of schedule with zero compromises on code quality. A true professional.",
    author: "Sarah Connor",
    role: "Founder at Skynet Solutions"
  }
];

export default function TestimonialsPage() {
  return (
    <div className="min-h-screen pt-24 pb-12 px-6 md:px-12 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl w-full"
      >
        <h1 className="text-4xl md:text-5xl font-bold font-mono text-accent-cyan mb-12 uppercase tracking-tighter text-center">
          &gt; CLIENT_TESTIMONIALS
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <motion.div 
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass p-8 rounded-xl border border-white/5 hover:border-accent-cyan/30 transition-all relative overflow-hidden group"
            >
              <Quote className="absolute -top-4 -left-4 w-24 h-24 text-white/5 group-hover:text-accent-cyan/5 transition-colors z-0" />
              <div className="relative z-10">
                <p className="text-text-primary text-lg italic mb-6">&quot;{t.content}&quot;</p>
                <div>
                  <h4 className="text-white font-bold">{t.author}</h4>
                  <p className="text-accent-cyan text-sm">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
