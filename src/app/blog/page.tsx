"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight } from "lucide-react";

const posts = [
  {
    id: 1,
    title: "Building Scalable Architecture with Next.js",
    excerpt: "Learn how to leverage Next.js App Router and server components for blazing fast web applications.",
    date: "2026-07-20",
    readTime: "5 min read",
    category: "Engineering"
  },
  {
    id: 2,
    title: "The Art of Micro-Animations",
    excerpt: "Why subtle motion can drastically improve user experience and perceived performance.",
    date: "2026-07-15",
    readTime: "3 min read",
    category: "Design"
  },
  {
    id: 3,
    title: "Deploying to Vercel like a Pro",
    excerpt: "Best practices, environment variables, and CI/CD pipelines for Next.js apps on Vercel.",
    date: "2026-07-10",
    readTime: "7 min read",
    category: "DevOps"
  }
];

export default function BlogPage() {
  return (
    <div className="min-h-screen pt-24 pb-12 px-6 md:px-12 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full"
      >
        <h1 className="text-4xl md:text-5xl font-bold font-mono text-accent-cyan mb-12 uppercase tracking-tighter text-center">
          &gt; SYSTEM_LOGS
        </h1>
        
        <div className="flex flex-col gap-6">
          {posts.map((post, idx) => (
            <motion.article 
              key={post.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass p-6 rounded-xl border border-white/5 hover:border-accent-cyan/30 transition-all group flex flex-col cursor-pointer"
            >
              <div className="flex items-center gap-4 text-xs font-mono text-text-secondary mb-3">
                <span className="text-accent-purple bg-accent-purple/10 px-2 py-1 rounded">{post.category}</span>
                <span className="flex items-center gap-1"><Calendar size={12} /> {post.date}</span>
                <span className="flex items-center gap-1"><Clock size={12} /> {post.readTime}</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-accent-cyan transition-colors">
                {post.title}
              </h2>
              <p className="text-text-primary mb-4">
                {post.excerpt}
              </p>
              <div className="mt-auto self-start text-accent-cyan font-mono text-sm flex items-center gap-2 font-bold uppercase tracking-widest">
                Read More <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
              </div>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
