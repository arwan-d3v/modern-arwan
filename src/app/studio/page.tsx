"use client";

import RoleGuard from "@/components/RoleGuard";
import { useAuth } from "@/context/AuthContext";

export default function StudioPage() {
  const { profile } = useAuth();

  return (
    <RoleGuard allowedRoles={['super_admin', 'family']}>
      <div className="min-h-screen bg-background p-8 text-foreground">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8 border-b border-white/10 pb-4">
            <h1 className="text-3xl font-bold text-accent-cyan">Creator Studio</h1>
            <p className="text-white/60 mt-2">Manage your portfolio, CV, and showcase projects.</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 border border-white/10 bg-white/5 rounded-lg hover:border-accent-cyan/50 transition-colors">
              <h2 className="text-xl font-semibold mb-2">Profile Details</h2>
              <p className="text-white/60 text-sm mb-4">Update your display name, photo, and bio.</p>
              <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded text-sm transition-colors">Edit Profile</button>
            </div>

            <div className="p-6 border border-white/10 bg-white/5 rounded-lg hover:border-accent-cyan/50 transition-colors">
              <h2 className="text-xl font-semibold mb-2">Showcase Projects</h2>
              <p className="text-white/60 text-sm mb-4">Manage your project portfolio and links.</p>
              <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded text-sm transition-colors">Manage Projects</button>
            </div>

            <div className="p-6 border border-white/10 bg-white/5 rounded-lg hover:border-accent-cyan/50 transition-colors">
              <h2 className="text-xl font-semibold mb-2">Resume / CV</h2>
              <p className="text-white/60 text-sm mb-4">Update your experiences and skills matrix.</p>
              <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded text-sm transition-colors">Update CV</button>
            </div>

            <div className="p-6 border border-white/10 bg-white/5 rounded-lg hover:border-accent-cyan/50 transition-colors">
              <h2 className="text-xl font-semibold mb-2">Analytics</h2>
              <p className="text-white/60 text-sm mb-4">View profile visits and engagement.</p>
              <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded text-sm transition-colors">View Stats</button>
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
