import { db } from '@/lib/firebaseAdmin';
import { notFound } from 'next/navigation';
import { UserProfile } from '@/types';

export const revalidate = 60; // revalidate every 60 seconds

export default async function PublicProfilePage({ params }: { params: { username: string } }) {
  const { username } = params;

  // We need to find the user by username. Since we don't have a direct index yet, 
  // we fetch all users and find the match (in production, use a dedicated username map/index)
  const usersRef = db.ref('users');
  const snapshot = await usersRef.once('value');
  
  if (!snapshot.exists()) {
    notFound();
  }

  let matchedUser: UserProfile | null = null;
  const users = snapshot.val();
  
  for (const key in users) {
    const user = users[key] as UserProfile;
    // Map displayName to a URL-friendly username, or use uid
    const userSlug = user.displayName?.toLowerCase().replace(/\s+/g, '-') || user.uid;
    if (userSlug === username.toLowerCase()) {
      matchedUser = user;
      break;
    }
  }

  if (!matchedUser) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-2xl mx-auto border border-white/10 p-8 rounded-lg bg-white/5 backdrop-blur">
        <div className="flex items-center gap-6 mb-8">
          {matchedUser.photoURL ? (
            <img src={matchedUser.photoURL} alt={matchedUser.displayName || 'Profile'} className="w-24 h-24 rounded-full border border-accent-cyan/50 shadow-[0_0_15px_rgba(0,242,255,0.3)]" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center text-3xl">
              {matchedUser.displayName?.charAt(0) || '?'}
            </div>
          )}
          <div>
            <h1 className="text-4xl font-bold text-accent-cyan mb-2">{matchedUser.displayName || 'Anonymous User'}</h1>
            <p className="text-white/60">{matchedUser.email}</p>
            <span className="inline-block mt-2 px-3 py-1 bg-white/10 rounded-full text-xs text-white/80">
              Role: {matchedUser.role}
            </span>
          </div>
        </div>

        <div className="space-y-6">
          <section className="border-t border-white/10 pt-6">
            <h2 className="text-2xl font-mono text-white/80 mb-4">About</h2>
            <p className="text-white/60">This is the public profile page for {matchedUser.displayName}. More portfolio features coming soon.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
