"use client";

import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export default function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const { profile, loading } = useAuth();
  const router = useRouter();

  // BYPASS AUTH FOR DEVELOPMENT IF API KEY IS MISSING
  const isDevBypass = !process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

  useEffect(() => {
    if (!loading && !isDevBypass) {
      if (!profile) {
        router.push("/login");
      } else if (!allowedRoles.includes(profile.role as UserRole)) {
        router.push("/dashboard");
      }
    }
  }, [profile, loading, router, allowedRoles, isDevBypass]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-accent-cyan/20 border-t-accent-cyan rounded-full animate-spin" />
          <p className="font-mono text-accent-cyan text-sm animate-pulse">VERIFYING_PERMISSIONS...</p>
        </div>
      </div>
    );
  }

  if (isDevBypass) return <>{children}</>;

  if (profile && allowedRoles.includes(profile.role as UserRole)) {
    return <>{children}</>;
  }

  return null;
}
