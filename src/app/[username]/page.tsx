import { db, admin } from '@/lib/firebaseAdmin';
import { getFirestore } from 'firebase-admin/firestore';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';
import { UserProfile, WorkExperience, ShowcaseProject, SkillMatrix } from '@/types';
import FadeIn from '@/components/FadeIn';
import { Briefcase, Layout as LayoutIcon, Terminal, ExternalLink, Calendar, MapPin, Database } from 'lucide-react';

export const revalidate = 60; // revalidate every 60 seconds

export async function generateMetadata({ params }: { params: { username: string } }): Promise<Metadata> {
  const { username } = params;
  let matchedUser: UserProfile | null = null;
  const usersRef = db.ref('users');
  
  const snapshot = await usersRef.orderByChild('username').equalTo(username.toLowerCase()).once('value');
  if (snapshot.exists()) {
    const users = snapshot.val();
    const userKey = Object.keys(users)[0];
    matchedUser = users[userKey] as UserProfile;
  } else {
    const allSnapshot = await usersRef.once('value');
    if (allSnapshot.exists()) {
      const allUsers = allSnapshot.val();
      for (const key in allUsers) {
        const user = allUsers[key] as UserProfile;
        const userSlug = user.displayName?.toLowerCase().replace(/[^a-z0-9]/g, '-') || user.uid;
        if (userSlug === username.toLowerCase()) {
          matchedUser = user;
          break;
        }
      }
    }
  }

  if (!matchedUser) {
    return { title: 'User Not Found | Is Arwan DEV' };
  }

  return {
    title: `${matchedUser.displayName} - Portfolio`,
    description: `View ${matchedUser.displayName}'s portfolio, technical matrix, and experience timeline.`,
    openGraph: {
      title: `${matchedUser.displayName} - Portfolio`,
      description: `View ${matchedUser.displayName}'s portfolio, technical matrix, and experience timeline.`,
      images: matchedUser.photoURL ? [matchedUser.photoURL] : [`/api/og?title=${encodeURIComponent(matchedUser.displayName + " Portfolio")}`],
    },
  };
}

export default async function PublicProfilePage({ params }: { params: { username: string } }) {
  const { username } = params;

  let matchedUser: UserProfile | null = null;
  const usersRef = db.ref('users');
  
  // Optimized lookup by indexed field
  const snapshot = await usersRef.orderByChild('username').equalTo(username.toLowerCase()).once('value');
  
  if (snapshot.exists()) {
    const users = snapshot.val();
    const userKey = Object.keys(users)[0];
    matchedUser = users[userKey] as UserProfile;
  } else {
    // Fallback full scan for legacy users without 'username' field
    const allSnapshot = await usersRef.once('value');
    if (allSnapshot.exists()) {
      const allUsers = allSnapshot.val();
      for (const key in allUsers) {
        const user = allUsers[key] as UserProfile;
        const userSlug = user.displayName?.toLowerCase().replace(/[^a-z0-9]/g, '-') || user.uid;
        if (userSlug === username.toLowerCase()) {
          matchedUser = user;
          break;
        }
      }
    }
  }

  if (!matchedUser) {
    notFound();
  }

  // Fetch Global Portfolio Data (Since the app is currently single-tenant for portfolio data)
  const firestoreDb = getFirestore(admin.app());
  
  // Fetch Experience
  const expSnapshot = await firestoreDb.collection('work_experiences').orderBy('order', 'asc').get();
  const experiences = expSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WorkExperience));

  // Fetch Projects
  const projSnapshot = await firestoreDb.collection('showcase_projects').orderBy('order', 'asc').get();
  const projects = projSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ShowcaseProject));

  // Fetch Skills
  const skillsSnapshot = await firestoreDb.collection('skills_matrix').orderBy('order', 'asc').get();
  const skillsMatrix = skillsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SkillMatrix));

  return (
    <div className="min-h-screen bg-background text-foreground pt-32 pb-24 px-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-accent-cyan/10 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-accent-purple/10 rounded-full blur-[100px] translate-y-1/2 pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-16 relative z-10">
        
        {/* Profile Header */}
        <FadeIn delay={0.1}>
          <div className="glass p-8 md:p-12 flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-cyan/10 rounded-bl-full blur-2xl transition-all group-hover:bg-accent-cyan/20" />
            
            <div className="relative shrink-0">
              {matchedUser.photoURL ? (
                <Image src={matchedUser.photoURL} alt={matchedUser.displayName || 'Profile'} width={128} height={128} className="w-32 h-32 rounded-sm border border-accent-cyan/50 shadow-[0_0_15px_rgba(0,242,255,0.3)] object-cover" unoptimized />
              ) : (
                <div className="w-32 h-32 rounded-sm border border-accent-cyan/30 bg-surface/50 flex items-center justify-center text-4xl font-mono text-accent-cyan shadow-[0_0_15px_rgba(0,242,255,0.1)]">
                  {matchedUser.displayName?.charAt(0) || '?'}
                </div>
              )}
              {/* Decorative brackets */}
              <div className="absolute -top-2 -left-2 w-4 h-4 border-t border-l border-accent-cyan" />
              <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b border-r border-accent-cyan" />
            </div>
            
            <div className="text-center md:text-left flex-1 space-y-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold font-mono tracking-tighter uppercase text-white mb-2">{matchedUser.displayName || 'Anonymous User'}</h1>
                <p className="font-mono text-xs text-accent-cyan uppercase tracking-[0.3em] font-bold">
                   System_Operative // Class: {matchedUser.role === 'super_admin' ? 'ROOT' : 'USER'}
                </p>
              </div>
              <p className="text-text-secondary leading-relaxed max-w-2xl text-sm md:text-base">
                Welcome to the digital portfolio. Showcasing technical expertise, project architecture, and professional timeline.
              </p>
              
              <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-4 border-t border-white/5">
                <div className="flex items-center gap-2 text-xs font-mono text-text-secondary uppercase">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Status: Online
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-text-secondary uppercase">
                  <span className="text-accent-purple">ID:</span> {matchedUser.uid.substring(0, 8)}
                </div>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Technical Matrix */}
        {skillsMatrix.length > 0 && (
          <FadeIn delay={0.2} className="space-y-6">
            <h2 className="text-xl font-bold font-mono text-accent-cyan uppercase tracking-widest flex items-center gap-3">
              <Terminal size={20} />
              <span className="border-b border-accent-cyan/30 pb-1">Technical_Matrix</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {skillsMatrix.map(matrix => (
                <div key={matrix.id} className="glass p-5 hover:border-accent-cyan/30 transition-colors">
                  <h3 className="font-mono text-xs font-bold text-accent-purple uppercase tracking-widest mb-4">{matrix.category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {matrix.skills.map(skill => (
                      <span key={skill} className="px-2 py-1 bg-white/5 border border-white/10 text-[10px] font-mono text-text-secondary uppercase font-bold tracking-tighter">{skill}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        )}

        {/* Experience Timeline */}
        {experiences.length > 0 && (
          <FadeIn delay={0.3} className="space-y-6">
            <h2 className="text-xl font-bold font-mono text-accent-cyan uppercase tracking-widest flex items-center gap-3">
              <Briefcase size={20} />
              <span className="border-b border-accent-cyan/30 pb-1">Experience_Timeline</span>
            </h2>
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-4 md:before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-surface before:to-transparent">
              {experiences.map((exp, index) => (
                <div key={exp.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full border border-accent-cyan bg-background shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_10px_rgba(0,242,255,0.2)] z-10">
                    <div className="w-2 h-2 rounded-full bg-accent-cyan" />
                  </div>
                  
                  <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-5 glass group-hover:border-accent-cyan/40 transition-colors ml-4 md:ml-0">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-text-primary uppercase tracking-tight">{exp.title}</h3>
                      <span className="text-[10px] font-mono text-accent-purple border border-accent-purple/30 bg-accent-purple/10 px-2 py-0.5 font-bold uppercase">{exp.type}</span>
                    </div>
                    <div className="text-sm font-bold text-text-secondary mb-3">{exp.company}</div>
                    
                    <div className="flex flex-wrap gap-4 text-[10px] font-mono text-text-secondary uppercase mb-4 opacity-80">
                      <div className="flex items-center gap-1"><Calendar size={12}/> {exp.dates}</div>
                      <div className="flex items-center gap-1"><MapPin size={12}/> {exp.location}</div>
                    </div>
                    
                    {exp.description && (
                      <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-line">{exp.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        )}

        {/* Project Vault */}
        {projects.length > 0 && (
          <FadeIn delay={0.4} className="space-y-6">
            <h2 className="text-xl font-bold font-mono text-accent-cyan uppercase tracking-widest flex items-center gap-3">
              <LayoutIcon size={20} />
              <span className="border-b border-accent-cyan/30 pb-1">Project_Vault</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map(proj => (
                <div key={proj.id} className="glass group overflow-hidden flex flex-col hover:border-accent-cyan/40 transition-colors">
                  <div className="h-48 bg-surface/30 relative border-b border-white/5 overflow-hidden">
                    {proj.image_url ? (
                      <Image src={proj.image_url} alt={proj.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100" unoptimized />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Database size={32} className="text-surface" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
                  </div>
                  
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="font-bold text-lg uppercase tracking-tight mb-2 text-white">{proj.title}</h3>
                    <p className="text-sm text-text-secondary mb-6 flex-1 line-clamp-3">{proj.description}</p>
                    
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {proj.tech_stack?.map(tech => (
                          <span key={tech} className="text-[9px] font-mono font-bold text-accent-cyan bg-accent-cyan/10 border border-accent-cyan/20 px-2 py-0.5 uppercase tracking-tighter">{tech}</span>
                        ))}
                      </div>
                      
                      <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                        {proj.live_link && (
                          <a href={proj.live_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs font-mono font-bold text-white hover:text-accent-cyan transition-colors uppercase tracking-widest">
                            <ExternalLink size={14} /> LIVE_DEPLOY
                          </a>
                        )}
                        {proj.github_link && (
                          <a href={proj.github_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs font-mono font-bold text-text-secondary hover:text-white transition-colors uppercase tracking-widest">
                            <Terminal size={14} /> SOURCE_CODE
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        )}

      </div>
    </div>
  );
}
