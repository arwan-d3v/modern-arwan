import { admin } from '@/lib/firebaseAdmin';
import { getFirestore } from 'firebase-admin/firestore';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';

interface BlogPost {
  id: string;
  title: string;
  content?: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
}

export const revalidate = 60; // revalidate every 60 seconds

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const firestoreDb = getFirestore(admin.app());
  const docRef = firestoreDb.collection('blog_posts').doc(params.id);
  const docSnap = await docRef.get();

  if (!docSnap.exists) {
    return { title: 'Post Not Found | System Logs' };
  }

  const post = docSnap.data() as BlogPost;

  return {
    title: `${post.title} - System Logs`,
    description: post.excerpt,
    openGraph: {
      title: `${post.title} - System Logs`,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: ['Is Arwan'],
      images: [`/api/og?title=${encodeURIComponent(post.title)}`],
    },
  };
}

export default async function BlogPostPage({ params }: { params: { id: string } }) {
  const firestoreDb = getFirestore(admin.app());
  const docRef = firestoreDb.collection('blog_posts').doc(params.id);
  const docSnap = await docRef.get();

  if (!docSnap.exists) {
    notFound();
  }

  const post = { id: docSnap.id, ...docSnap.data() } as BlogPost;

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 md:px-12 flex flex-col items-center">
      <div className="max-w-4xl w-full">
        <Link href="/blog" className="inline-flex items-center gap-2 text-text-secondary hover:text-accent-cyan transition-colors mb-8 font-mono text-sm uppercase tracking-widest">
          <ArrowLeft size={16} /> Back to Logs
        </Link>
        
        <article className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center gap-4 text-xs font-mono text-text-secondary mb-6">
            <span className="text-accent-purple bg-accent-purple/10 px-2 py-1 rounded">{post.category}</span>
            <span className="flex items-center gap-1"><Calendar size={12} /> {post.date}</span>
            <span className="flex items-center gap-1"><Clock size={12} /> {post.readTime}</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold font-mono text-white mb-8 tracking-tighter">
            {post.title}
          </h1>
          
          <div className="glass p-8 rounded-xl border border-white/5 prose prose-invert prose-p:leading-relaxed prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10 max-w-none">
            <ReactMarkdown>
              {post.content || post.excerpt}
            </ReactMarkdown>
          </div>
        </article>
      </div>
    </div>
  );
}
