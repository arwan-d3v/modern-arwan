"use client";

import React, { useEffect, useState } from "react";
import { Server, Zap, Shield } from "lucide-react";
import FadeIn from "@/components/FadeIn";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface StatCardProps {
  label: string;
  value: string | number;
  suffix?: string;
  icon: React.ReactNode;
  delay?: number;
}

const StatCard = ({ label, value, suffix = "", icon, delay = 0 }: StatCardProps) => (
  <FadeIn delay={delay} className="glass glass-hover p-6 rounded-none flex flex-col gap-4 border-accent-cyan/10">
    <div className="text-accent-cyan">{icon}</div>
    <div>
      <div className="text-3xl font-mono font-bold text-text-primary tracking-tighter">
        {value}{suffix}
      </div>
      <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-text-secondary font-bold">{label}</div>
    </div>
  </FadeIn>
);

export default function DynamicStats() {
  const [stats, setStats] = useState({
    templates: 0,
    users: 0,
    atsPassRate: 0
  });

  useEffect(() => {
    // Attempt to fetch real stats from Firestore if available
    let unsubscribe = () => {};
    
    if (process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
      unsubscribe = onSnapshot(doc(db, "system", "metrics"), (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          if (data.cvTemplatesCount !== undefined) {
             setStats({
               templates: data.cvTemplatesCount || 12,
               users: data.activeUsersCount || 1205,
               atsPassRate: data.atsPassRate || 98
             });
             return;
          }
        }
      });
    }

    // Fallback animation if no real data is found yet
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      // easeOutExpo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      setStats(prev => {
        // Only animate if they are still 0 (meaning firestore didn't overwrite yet)
        if (prev.templates === 0 || prev.templates <= 12) {
            return {
              templates: Math.floor(12 * ease),
              users: Math.floor(1205 * ease),
              atsPassRate: Math.floor(98 * ease)
            };
        }
        return prev;
      });

      if (currentStep >= steps) clearInterval(timer);
    }, interval);

    return () => {
      clearInterval(timer);
      unsubscribe();
    };
  }, []);

  // Format users with 'k' if over 1000
  const formattedUsers = stats.users >= 1000 ? (stats.users / 1000).toFixed(1) : stats.users;
  const userSuffix = stats.users >= 1000 ? "k" : "";

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard
        icon={<Zap size={24} />}
        label="CV Templates"
        value={stats.templates}
        suffix="+"
        delay={0.4}
      />
      <StatCard
        icon={<Server size={24} />}
        label="Active Users"
        value={formattedUsers}
        suffix={userSuffix}
        delay={0.5}
      />
      <StatCard
        icon={<Shield size={24} />}
        label="ATS Pass Rate"
        value={stats.atsPassRate}
        suffix="%"
        delay={0.6}
      />
    </div>
  );
}
