"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, getDocs, limit, startAfter, DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
}

const fallbackPosts: BlogPost[] = [
  {
    id: "1",
    title: "Building Scalable Architecture with Next.js",
    excerpt: "Learn how to leverage Next.js App Router and server components for blazing fast web applications.",
    date: "2026-07-20",
    readTime: "5 min read",
    category: "Engineering"
  },
  {
    id: "2",
    title: "The Art of Micro-Animations",
    excerpt: "Why subtle motion can drastically improve user experience and perceived performance.",
    date: "2026-07-15",
    readTime: "3 min read",
    category: "Design"
  },
  {
    id: "3",
    title: "Deploying to Vercel like a Pro",
    excerpt: "Best practices, environment variables, and CI/CD pipelines for Next.js apps on Vercel.",
    date: "2026-07-10",
    readTime: "7 min read",
    category: "DevOps"
  }
];

const POSTS_PER_PAGE = 5;

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData, DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = async (isInitial = true) => {
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
      if (isInitial) {
        setPosts(fallbackPosts);
        setHasMore(false);
        setLoading(false);
      }
      return;
    }

    try {
      let q = query(
        collection(db, "blog_posts"), 
        orderBy("date", "desc"),
        limit(POSTS_PER_PAGE)
      );

      if (!isInitial && lastVisible) {
        q = query(
          collection(db, "blog_posts"), 
          orderBy("date", "desc"),
          startAfter(lastVisible),
          limit(POSTS_PER_PAGE)
        );
      }

      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        if (isInitial) setPosts(fallbackPosts);
        setHasMore(false);
      } else {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost));
        setPosts(prev => isInitial ? data : [...prev, ...data]);
        
        // If we got exactly POSTS_PER_PAGE, there might be more
        setHasMore(snapshot.docs.length === POSTS_PER_PAGE);
        setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      if (isInitial) {
        setPosts(fallbackPosts);
        setHasMore(false);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchPosts(true);
  }, []);

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      setLoadingMore(true);
      fetchPosts(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 md:px-12 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full"
      >
        <h1 className="text-4xl md:text-5xl font-bold font-mono text-accent-cyan mb-12 uppercase tracking-tighter text-center">
          &gt; BLOG_POSTS
        </h1>
        
        {loading ? (
          <div className="flex flex-col gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <EmptyState 
            title="No Posts Available" 
            description="There are currently no blog posts to display." 
          />
        ) : (
          <div className="flex flex-col gap-6">
            {posts.map((post, idx) => (
              <Link href={`/blog/${post.id}`} key={post.id}>
                <motion.article 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
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
              </Link>
            ))}
            
            {hasMore && (
              <button 
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="mt-8 mx-auto flex items-center justify-center gap-2 px-6 py-3 glass hover:bg-white/5 border border-accent-cyan/20 hover:border-accent-cyan transition-colors font-mono text-sm uppercase tracking-widest disabled:opacity-50"
              >
                {loadingMore ? <Loader2 size={16} className="animate-spin" /> : null}
                {loadingMore ? "LOADING_DATA..." : "LOAD_MORE_POSTS"}
              </button>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
