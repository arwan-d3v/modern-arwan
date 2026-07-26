"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import StatusOverlay from "@/components/ui/StatusOverlay";
import { motion, AnimatePresence } from "framer-motion";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [showChildren, setShowChildren] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Dev bypass
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
      console.warn("Auth bypass active (missing API Key)");
      setTimeout(() => {
        setLoading(false);
        setShowChildren(true);
      }, 800); // brief cinematic delay even in dev
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        // Slight delay for smooth transition feel
        setTimeout(() => {
          setLoading(false);
          setTimeout(() => setShowChildren(true), 100);
        }, 400);
      } else {
        setTimeout(() => {
          setLoading(false);
          router.push("/login");
        }, 600);
      }
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <>
      {/* Full-screen loading overlay */}
      <StatusOverlay
        mode="loading"
        visible={loading}
        title="VERIFYING_ACCESS"
        message="Authenticating your session credentials."
        subtext="SECURE_NODE // TLS_1.3"
      />

      {/* Children with fade-in transition */}
      <AnimatePresence>
        {showChildren && (
          <motion.div
            initial={{ opacity: 0, filter: "blur(4px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
