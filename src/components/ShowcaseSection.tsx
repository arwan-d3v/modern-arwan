"use client";
import Image from "next/image";

import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ShowcaseProject } from "@/types";
import FadeIn from "./FadeIn";
import { ExternalLink, Box } from "lucide-react";
import MediaModal from "./MediaModal";
import { Skeleton } from "./ui/Skeleton";
import { EmptyState } from "./ui/EmptyState";

export default function ShowcaseSection() {
  const [projects, setProjects] = useState<ShowcaseProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<ShowcaseProject | null>(null);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
      setProjects([
        {
          id: "p1",
          title: "ENIGMA MT5",
          description: "Autonomous SMC-based trading algorithm for XAUUSD. Integrated with real-time risk management and VPS health monitoring.",
          tech_stack: ["MQL5", "Python", "Rust", "Firebase"],
          image_url: "",
          live_link: "#",
          technical_brief: { integrity: "VERIFIED", encryption: "AES-256", access: "UNRESTRICTED" },
          order: 1
        }
      ]);
      setLoading(false);
      return;
    }

    const q = query(collection(db, "showcase_projects"), orderBy("order", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ShowcaseProject));
      setProjects(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <section id="showcase" className="space-y-12 pb-20">
      <FadeIn>
        <div className="flex items-center gap-4">
          <h2 className="text-sm font-mono font-bold tracking-[0.3em] uppercase text-accent-purple">
            [PROJECT_VAULT]
          </h2>
          <div className="h-px flex-1 bg-surface" />
        </div>
      </FadeIn>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-80 w-full rounded-none" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <EmptyState 
          title="No Projects Yet" 
          description="The showcase vault is currently empty." 
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <FadeIn key={project.id || index} delay={index * 0.1}>
              <ProjectCard project={project} onClick={() => setSelectedProject(project)} />
            </FadeIn>
          ))}
        </div>
      )}

      {selectedProject && (
        <MediaModal
          project={selectedProject}
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  );
}

function ProjectCard({ project, onClick }: { project: ShowcaseProject, onClick: () => void }) {
  const [displayImage, setDisplayImage] = useState<string>('');

  useEffect(() => {
    // Combine main image and gallery urls
    const allImages = [];
    if (project.image_url) allImages.push(project.image_url);
    if (project.gallery_urls && project.gallery_urls.length > 0) {
      allImages.push(...project.gallery_urls);
    }
    
    // Pick a random image on mount
    if (allImages.length > 0) {
      const randomIndex = Math.floor(Math.random() * allImages.length);
      setDisplayImage(allImages[randomIndex]);
    }
  }, [project]);

  return (
    <div
      onClick={onClick}
      className="glass p-6 rounded-none group cursor-pointer glass-purple-hover flex flex-col h-full"
    >
      <div className="aspect-video w-full bg-black/40 overflow-hidden mb-6 border border-surface relative">
        {displayImage ? (
           <Image src={displayImage} alt={project.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" width={600} height={400} />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Box size={48} className="text-surface" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60" />
      </div>

      <div className="space-y-4 flex-1 flex flex-col">
        <div className="flex justify-between items-start">
          <h3 className="text-2xl font-bold tracking-tight text-text-primary uppercase group-hover:text-accent-purple transition-colors">
            {project.title}
          </h3>
          <div className="flex gap-3 text-text-secondary">
            {project.live_link && project.live_link !== '#' && (
              <a
                href={project.live_link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="hover:text-accent-cyan transition-colors p-1 hover:bg-white/5"
                title="View Live Project"
              >
                <ExternalLink size={18} />
              </a>
            )}
          </div>
        </div>

        <p className="text-text-secondary text-sm leading-relaxed line-clamp-3">
          {project.description}
        </p>

        <div className="pt-4 mt-auto">
          <div className="flex flex-wrap gap-2">
            {project.tech_stack.map(tech => (
              <span key={tech} className="text-[10px] font-mono font-bold px-2 py-1 bg-surface border border-surface text-accent-purple uppercase tracking-tighter">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
