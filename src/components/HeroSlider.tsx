"use client";

import { useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import Image from "next/image";

export default function HeroSlider() {
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);

  useEffect(() => {
    if (containerRef.current) {
      x.set(containerRef.current.offsetWidth / 2);
    }
  }, [x]);

  const clipPathPremium = useTransform(x, (value) => `inset(0 0 0 ${value}px)`);
  const clipPathStandard = useTransform(x, (value) => `inset(0 calc(100% - ${value}px) 0 0)`);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[400px] md:h-[600px] rounded-xl overflow-hidden border border-white/10 select-none my-12 bg-black shadow-2xl"
    >
      {/* Container A: Standard (Grayscale, Dull, "Buluk") */}
      <motion.div 
        className="absolute inset-0 flex flex-col justify-end p-8 pointer-events-none"
        style={{ clipPath: clipPathStandard }}
      >
        <div className="absolute inset-0 grayscale-[100%] contrast-[0.8] brightness-[0.5] sepia-[30%] blur-[2px]">
          <Image 
            src="/images/modern_dashboard_ui.png" 
            alt="Basic Resume UI" 
            fill 
            className="object-cover object-top"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        <div className="relative z-10 max-w-xl">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-400 mb-2">Standard Resume</h2>
          <p className="text-md text-gray-500 font-mono">
            Dull presentation. Basic formatting. Hard to read. No visual hierarchy.
          </p>
        </div>
      </motion.div>

      {/* Container B: Premium (Colorful, Classy, High Saturation) */}
      <motion.div 
        className="absolute inset-0 flex flex-col justify-end p-8 pointer-events-none"
        style={{ clipPath: clipPathPremium }}
      >
        <div className="absolute inset-0 contrast-[1.1] saturate-[1.5] brightness-[1.1]">
          <Image 
            src="/images/modern_dashboard_ui.png" 
            alt="Premium Resume UI" 
            fill 
            className="object-cover object-top"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-accent-cyan/10 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent-cyan/20 via-transparent to-transparent mix-blend-overlay" />
        <div className="relative z-10 max-w-xl">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-2 drop-shadow-[0_0_15px_rgba(0,242,255,0.8)]">
            Premium Experience
          </h2>
          <p className="text-md text-gray-200 font-sans font-light">
            Vibrant aesthetics. Neon accents. Glassmorphism UI. Instant professional impact.
          </p>
        </div>
      </motion.div>

      {/* Handle */}
      <motion.div
        className="absolute top-0 bottom-0 w-1 bg-accent-cyan cursor-col-resize shadow-[0_0_20px_rgba(0,242,255,1)] z-10 flex justify-center items-center group -ml-0.5"
        style={{ x }}
        drag="x"
        dragConstraints={containerRef}
        dragElastic={0}
        dragMomentum={false}
      >
        <div className="w-8 h-12 bg-black border border-accent-cyan rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(0,242,255,0.8)] group-hover:scale-110 transition-transform">
          <div className="flex gap-1">
            <div className="w-0.5 h-4 bg-accent-cyan" />
            <div className="w-0.5 h-4 bg-accent-cyan" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
