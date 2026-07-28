"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { User, Shield, Mail, Camera } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function Profile() {
  const { profile, user } = useAuth();
  const [avatar, setAvatar] = useState<string>('');

  useEffect(() => {
    if (profile?.photoURL) {
      setAvatar(profile.photoURL);
    }
  }, [profile]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatar(url);
    }
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'super_admin': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'family': return 'bg-accent-cyan/20 text-accent-cyan border-accent-cyan/30';
      case 'pro': return 'bg-accent-purple/20 text-accent-purple border-accent-purple/30';
      case 'student': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-white/10 text-text-secondary border-white/10';
    }
  };

  if (!profile) {
    return (
      <ProtectedRoute>
        <div className="max-w-xl mx-auto px-6 py-20 text-center">
          <p className="text-text-secondary font-mono text-sm">Loading profile...</p>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="max-w-xl mx-auto px-6 py-12 space-y-8 mt-16 md:mt-24">
        <header>
          <h1 className="text-3xl font-bold tracking-tighter uppercase text-text-primary">USER_PROFILE</h1>
          <p className="text-text-secondary font-mono text-[10px] uppercase tracking-[0.2em] mt-1">
            Account Information // Read Only
          </p>
        </header>

        {/* Avatar */}
        <div className="glass p-6 flex items-center gap-6">
          <div className="relative group">
            {avatar ? (
              <Image src={avatar} alt="Avatar" width={80} height={80} className="w-20 h-20 rounded-full border-2 border-surface object-cover" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-surface flex items-center justify-center border-2 border-surface">
                <User size={32} className="text-text-secondary" />
              </div>
            )}
            <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <Camera size={20} className="text-white" />
              <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            </label>
          </div>
          <div>
            <div className="text-lg font-bold text-text-primary">{profile.displayName || 'Anonymous'}</div>
            <div className="text-text-secondary font-mono text-xs">{profile.email}</div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="space-y-4">
          <div className="glass p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail size={16} className="text-accent-cyan" />
              <span className="font-mono text-xs uppercase text-text-secondary">Email</span>
            </div>
            <span className="text-sm text-text-primary">{profile.email || 'N/A'}</span>
          </div>

          <div className="glass p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield size={16} className="text-accent-purple" />
              <span className="font-mono text-xs uppercase text-text-secondary">Role</span>
            </div>
            <span className={`px-3 py-1 text-xs font-mono font-bold uppercase border ${getRoleBadgeClass(profile.role)}`}>
              {profile.role.replace('_', ' ')}
            </span>
          </div>

          <div className="glass p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <User size={16} className="text-text-secondary" />
              <span className="font-mono text-xs uppercase text-text-secondary">UID</span>
            </div>
            <span className="text-xs text-text-secondary font-mono truncate max-w-[200px]">{profile.uid}</span>
          </div>
        </div>

        <p className="text-[10px] font-mono text-text-secondary text-center uppercase tracking-widest">
          Role changes are managed by Super Admin only.
        </p>
      </div>
    </ProtectedRoute>
  );
}
