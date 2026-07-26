"use client";

import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import StatusOverlay from "@/components/ui/StatusOverlay";
import { motion, AnimatePresence } from "framer-motion";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export default function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const { profile, loading } = useAuth();
  const router = useRouter();
  const [showChildren, setShowChildren] = useState(false);
  const [showUnauthorized, setShowUnauthorized] = useState(false);

  const isDevBypass = !process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

  useEffect(() => {
    if (loading) return;

    if (isDevBypass) {
      setTimeout(() => setShowChildren(true), 600);
      return;
    }

    if (!profile) {
      setTimeout(() => router.push("/login"), 800);
      return;
    }

    if (allowedRoles.includes(profile.role as UserRole)) {
      setTimeout(() => setShowChildren(true), 500);
    } else {
      setShowUnauthorized(true);
    }
  }, [profile, loading, router, allowedRoles, isDevBypass]);

  const handleRequestElevation = () => {
    setShowUnauthorized(false);
    router.push("/dashboard");
  };

  return (
    <>
      {/* Loading state while auth resolves */}
      <StatusOverlay
        mode="loading"
        visible={loading}
        title="VERIFYING_CLEARANCE_LEVEL"
        message="Checking your role permissions against the access matrix."
        subtext="RBAC_CHECK // NODE_SECURE"
      />

      {/* Unauthorized state */}
      <StatusOverlay
        mode="error"
        visible={!loading && showUnauthorized}
        title="ACCESS_CLEARANCE_DENIED"
        message={`Your account role [${profile?.role?.toUpperCase() ?? "UNKNOWN"}] is not authorized for this module.`}
        onCancel={handleRequestElevation}
        cancelLabel="RETURN_TO_DASHBOARD"
        onRetry={() => {
          setShowUnauthorized(false);
          setTimeout(() => setShowUnauthorized(true), 200);
        }}
      />

      {/* Children with fade-in */}
      <AnimatePresence>
        {showChildren && (
          <motion.div
            initial={{ opacity: 0, y: 8, filter: "blur(3px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
