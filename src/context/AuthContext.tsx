"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  User,
  signInWithPopup,
  GoogleAuthProvider,
  signOut
} from "firebase/auth";
import { ref, get, set, child } from "firebase/database";
import { auth, rtdb } from "@/lib/firebase";
import { UserProfile, UserRole } from "@/types";

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);

      if (user) {
        // Fetch or create profile from Realtime Database
        const userRef = ref(rtdb, `users/${user.uid}`);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
          setProfile(snapshot.val() as UserProfile);
        } else {
          // Fallback: if the logged-in email matches the known super-admin address, grant super_admin
          const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@krx.com';
          const role = user.email?.toLowerCase() === adminEmail ? 'super_admin' : 'guest';
          const username = user.displayName ? user.displayName.toLowerCase().replace(/[^a-z0-9]/g, '-') : user.uid;
          const newProfile: UserProfile = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            role,
            username,
            createdAt: Date.now(),
          };
          if (process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
            await set(userRef, newProfile);
          }
          setProfile(newProfile);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });


    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const hasRole = (roles: UserRole[]) => {
    if (!profile) return false;
    return roles.includes(profile.role);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, loginWithGoogle, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
