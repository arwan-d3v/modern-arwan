"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { SkillMatrix } from "@/types";
import FadeIn from "./FadeIn";
import { Terminal } from "lucide-react";

export default function SkillsSection() {
  const [skills, setSkills] = useState<SkillMatrix[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
      setSkills([
        {
          id: "1",
          category: "FIELD_OPERATIONS",
          skills: ["HSE & Working at Heights", "LOTO Clearance", "Field Network Installations", "VHF/UHF Radio Systems", "Remote Site Deployment", "Full Pit Access Permit"],
          order: 1
        },
        {
          id: "2",
          category: "NETWORK_INFRASTRUCTURE",
          skills: ["MikroTik Configuration", "Rajant Mesh Networks", "Cisco Networking", "WAP Deployment", "LTE/WAN Topology", "BTS Infrastructure", "Wireshark"],
          order: 2
        },
        {
          id: "3",
          category: "SOFTWARE_DEV",
          skills: ["React", "Next.js", "Node.js", "Python", "Flask", "Firebase", "Supabase", "MQL5/C++", "TypeScript"],
          order: 3
        },
        {
          id: "4",
          category: "FMS_SYSTEMS",
          skills: ["MineCare", "Modular Dispatch", "Provisions Drill", "Fleet Telemetry", "Real-time Monitoring"],
          order: 4
        },
        {
          id: "5",
          category: "PRODUCTIVITY_TOOLS",
          skills: ["CISCO Packet Tracer", "MS Office Suite", "Visio", "Primavera P6", "Git", "GitHub"],
          order: 5
        }
      ]);
      setLoading(false);
      return;
    }

    const q = query(collection(db, "skills_matrix"), orderBy("order", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SkillMatrix));
      setSkills(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return (
    <div className="h-40 flex items-center justify-center font-mono text-[10px] text-accent-cyan animate-pulse uppercase">
      ANALYZING_TECHNICAL_MATRIX...
    </div>
  );

  if (skills.length === 0) return null;

  return (
    <section id="skills" className="space-y-12">
      <FadeIn>
        <div className="flex items-center gap-4">
          <h2 className="text-sm font-mono font-bold tracking-[0.3em] uppercase text-accent-cyan">
            [TECHNICAL_MATRIX]
          </h2>
          <div className="h-px flex-1 bg-surface" />
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.map((skillGroup, index) => (
          <FadeIn key={skillGroup.id || index} delay={index * 0.1}>
            <div className="glass p-6 group hover:border-accent-cyan/30 transition-colors h-full flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <Terminal size={16} className="text-accent-cyan opacity-70 group-hover:opacity-100 transition-opacity" />
                <h3 className="font-mono text-xs font-bold text-text-primary uppercase tracking-widest">
                  {skillGroup.category}
                </h3>
              </div>
              <div className="flex flex-wrap gap-2 mt-auto">
                {skillGroup.skills.map(skill => (
                  <span 
                    key={skill} 
                    className="text-[10px] font-mono font-bold px-2.5 py-1 bg-surface border border-surface text-text-secondary group-hover:text-accent-cyan transition-colors uppercase tracking-tighter"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
