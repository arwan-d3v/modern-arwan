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
    // Development Fallback — Real Arwan Data
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
      setExperiences([
        {
          id: "1",
          type: "formal",
          title: "Field Network & FMS Technician",
          company: "PT. Multi Kontrol Nusantara",
          location: "East Kalimantan",
          dates: "Jan 2024 – Present",
          description: "Lead field network deployments and conduct extensive site surveys for mobile wireless access points, ensuring seamless coverage for critical software components such as MineCare, Drill Provision, and Dispatch across active mining pits.\n\nProvide expert remote and onsite support to troubleshoot complex connectivity issues across Wi-Fi, VHF/UHF two-way radios, and hybrid network configurations.\n\nStrictly adhere to HSE procedures during installation and maintenance, maintaining active safety clearances including LOTO and Working at Heights.",
          order: 1
        },
        {
          id: "2",
          type: "freelance",
          title: "Data Annotator",
          company: "Appen",
          location: "Remote",
          dates: "Jul 2022 – Oct 2025",
          description: "Performed high-quality data annotation and labeling tasks to support AI/ML model training. Maintained precision and consistency across large datasets within strict quality control guidelines.",
          order: 2
        },
        {
          id: "3",
          type: "formal",
          title: "Maintenance Planner & IT Support",
          company: "PT. Budhi Wiguna Prima",
          location: "Sangatta, East Kalimantan",
          dates: "Aug 2018 – Dec 2023",
          description: "Developed and managed end-to-end maintenance schedules for a fleet of 96 heavy equipment units with 16 mechanical personnel. Coordinated warehouse operations to ensure rapid deployment of critical parts.\n\nProvided comprehensive technical support for field operations, troubleshooting hardware, software, and basic network issues to minimize downtime.",
          order: 3
        },
        {
          id: "4",
          type: "formal",
          title: "Mechanical Technician",
          company: "PT. THIESS CONTRACTOR INDONESIA",
          location: "Remote Mining Sites",
          dates: "Oct 2017 – Apr 2018",
          description: "Conducted preventive maintenance and troubleshooting on heavy machinery, including excavators, dewatering pump sets, and rotary drilling equipment across remote mining sites.\n\nCollaborated with field operations teams to ensure all mechanical assets were fully operational and strictly compliant with rigorous mining health and safety standards.",
          order: 4
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
