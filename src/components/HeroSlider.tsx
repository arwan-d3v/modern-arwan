"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, FileText, LayoutDashboard, Globe } from "lucide-react";
import Image from "next/image";

const slides = [
  {
    id: 1,
    title: "ATS CV Builder",
    subtitle: "Smart resume builder with real-time preview, ATS optimization, and intelligent page breaks.",
    image: "/images/hero-cv-builder.png",
    icon: <FileText size={20} className="text-accent-cyan" />,
    accent: "cyan",
    tag: "TOOL_CV_CONSTRUCTOR",
    gradient: "from-accent-cyan/30 via-black/60 to-black/90"
  },
  {
    id: 2,
    title: "Command Center",
    subtitle: "Real-time system dashboard with VPS metrics, live terminal logs, and RBAC access control.",
    image: "/images/hero-dashboard.png",
    icon: <LayoutDashboard size={20} className="text-emerald-400" />,
    accent: "emerald",
    tag: "TOOL_COMMAND_CENTER",
    gradient: "from-emerald-500/30 via-black/60 to-black/90"
  },
  {
    id: 3,
    title: "Portfolio Vault",
    subtitle: "Dynamic project showcase, skill matrix, and professional experience — all CMS-driven.",
    image: "/images/hero-portfolio.png",
    icon: <Globe size={20} className="text-accent-purple" />,
    accent: "purple",
    tag: "TOOL_PORTFOLIO",
    gradient: "from-accent-purple/30 via-black/60 to-black/90"
  }
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [current]);

  const nextSlide = () => {
    setDirection(1);
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <div className="relative w-full h-[300px] md:h-[420px] overflow-hidden border border-white/10 group mb-12">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = Math.abs(offset.x) * velocity.x;
            if (swipe < -10000) {
              nextSlide();
            } else if (swipe > 10000) {
              prevSlide();
            }
          }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <Image
            src={slides[current].image}
            alt={slides[current].title}
            fill
            className="object-cover object-top opacity-70 group-hover:opacity-80 transition-opacity duration-700 scale-105 group-hover:scale-100"
            style={{ transition: 'opacity 0.7s, transform 0.7s' }}
            unoptimized
          />
          {/* Gradient Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-t ${slides[current].gradient}`} />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10">
            {/* Tag */}
            <div className="flex items-center gap-2 mb-3">
              {slides[current].icon}
              <span className="font-mono text-[10px] font-bold tracking-[0.3em] uppercase text-white/60">
                {slides[current].tag}
              </span>
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-white tracking-tight mb-2">
              {slides[current].title}
            </h2>
            <p className="text-sm text-gray-300 font-mono max-w-xl leading-relaxed">
              {slides[current].subtitle}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 border border-white/10 text-white hover:bg-white/10 hover:border-accent-cyan transition-colors opacity-0 group-hover:opacity-100 z-10"
        aria-label="Previous Slide"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 border border-white/10 text-white hover:bg-white/10 hover:border-accent-cyan transition-colors opacity-0 group-hover:opacity-100 z-10"
        aria-label="Next Slide"
      >
        <ChevronRight size={24} />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > current ? 1 : -1);
              setCurrent(index);
            }}
            className={`h-1 transition-all duration-300 ${
              index === current ? "bg-accent-cyan w-8" : "bg-white/30 hover:bg-white/50 w-2"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
