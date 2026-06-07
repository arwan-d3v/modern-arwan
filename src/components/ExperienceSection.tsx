"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { WorkExperience } from "@/types";
import FadeIn from "./FadeIn";
import { Briefcase } from "lucide-react";

export default function ExperienceSection() {
  const [experiences, setExperiences] = useState<WorkExperience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Development Fallback
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
      setExperiences([
        {
          id: "1",
          type: "formal",
          title: "Senior Infrastructure Architect",
          company: "Nexus Labs",
          location: "Singapore",
          dates: "2021 - PRESENT",
          description: "Leading the design of high-frequency trading infrastructure. Implementing sub-10ms latency networks and automated risk mitigation protocols.",
          order: 1
        }
      ]);
      setLoading(false);
      return;
    }

    const q = query(collection(db, "work_experiences"), orderBy("order", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WorkExperience));
      setExperiences(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return (
    <div className="h-40 flex items-center justify-center font-mono text-[10px] text-accent-cyan animate-pulse">
      SYNCING_EXPERIENCE_RECORDS...
    </div>
  );

  return (
    <section id="experience" className="space-y-12">
      <FadeIn>
        <div className="flex items-center gap-4">
          <h2 className="text-sm font-mono font-bold tracking-[0.3em] uppercase text-accent-cyan">
            [EXPERIENCE_STREAMS]
          </h2>
          <div className="h-px flex-1 bg-surface" />
        </div>
      </FadeIn>

      <div className="space-y-12">
        {experiences.map((exp, index) => (
          <FadeIn key={exp.id || index} delay={index * 0.1}>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_3fr] gap-4 md:gap-12 group">
              <div className="font-mono text-xs text-text-secondary uppercase tracking-widest pt-1">
                {exp.dates}
              </div>
              <div className="space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <h3 className="text-xl font-bold text-text-primary group-hover:text-accent-cyan transition-colors">
                    {exp.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs font-mono text-text-secondary">
                    <Briefcase size={14} className="text-accent-purple" />
                    {exp.company} {" // "} {exp.location}
                  </div>
                </div>
                <p className="text-text-secondary leading-relaxed text-sm max-w-2xl whitespace-pre-line">
                  {exp.description}
                </p>
                <div className="flex gap-4 pt-2">
                   <span className="text-[10px] font-mono font-bold text-accent-cyan/60 uppercase">
                     {exp.type === 'formal' ? '// SECURE_PROTOCOL' : '// FREELANCE_OPERATIVE'}
                   </span>
                </div>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
