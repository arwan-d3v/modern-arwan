"use client";

import React from "react";
import FadeIn from "@/components/FadeIn";
import { Quote } from "lucide-react";
import Link from "next/link";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  avatar: string;
}

const MOCK_TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "Alex Mercer",
    role: "Frontend Engineer",
    company: "TechFlow",
    content: "The ATS-optimized CV builder is a game changer. I generated a new resume and got callbacks from 3 companies within a week. The UI is incredibly slick too.",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d"
  },
  {
    id: "2",
    name: "Sarah Chen",
    role: "Product Designer",
    company: "Nexus UI",
    content: "I love the cyberpunk aesthetic. Using this as my public portfolio makes my work stand out immediately. It's fast, responsive, and unique.",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d"
  },
  {
    id: "3",
    name: "David Kim",
    role: "Full-Stack Dev",
    company: "StartupInc",
    content: "Finally a tool that doesn't just give you generic templates. The focus on what recruiters actually look for is evident. Highly recommended for devs.",
    avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d"
  }
];

export default function TestimonialSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-accent-purple/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="mb-16 text-center max-w-2xl mx-auto relative z-10">
        <FadeIn>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4 uppercase text-text-primary">
            System <span className="text-accent-purple">Feedback</span>
          </h2>
          <p className="text-text-secondary font-mono text-sm">
            Telemetry from active operatives using the platform.
          </p>
        </FadeIn>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        {MOCK_TESTIMONIALS.map((testimonial, i) => (
          <FadeIn key={testimonial.id} delay={0.1 * (i + 1)} className="glass p-8 rounded-none border-accent-purple/10 flex flex-col h-full relative">
            <Quote className="absolute top-6 right-6 text-accent-purple/20" size={48} />
            
            <p className="text-sm text-text-primary leading-relaxed mb-8 flex-grow relative z-10 italic">
              &quot;{testimonial.content}&quot;
            </p>
            
            <div className="flex items-center gap-4 mt-auto">
              <img 
                src={testimonial.avatar} 
                alt={testimonial.name}
                className="w-12 h-12 rounded-full border border-surface grayscale hover:grayscale-0 transition-all duration-300"
              />
              <div>
                <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-text-primary">{testimonial.name}</h4>
                <p className="text-[10px] font-mono text-text-secondary">{testimonial.role} @ {testimonial.company}</p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>

      {/* CTA */}
      <FadeIn delay={0.5} className="text-center mt-10 relative z-10">
        <Link
          href="/testimonials"
          className="inline-flex items-center gap-2 px-6 py-3 glass border border-accent-purple/20 hover:border-accent-purple text-text-secondary hover:text-accent-purple text-xs font-mono font-bold uppercase tracking-widest transition-colors"
        >
          See All Reviews →
        </Link>
      </FadeIn>
    </section>
  );
}
