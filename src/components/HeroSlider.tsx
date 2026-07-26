"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Monitor, Layout, Server, Sparkles } from "lucide-react";

const slides = [
  {
    id: 1,
    title: "Premium UI/UX",
    subtitle: "Modern aesthetics, glassmorphism, and micro-animations designed to captivate.",
    icon: <Sparkles size={48} className="text-accent-cyan mb-4" />,
    color: "from-accent-cyan/20 to-black/80"
  },
  {
    id: 2,
    title: "Frontend Mastery",
    subtitle: "Building responsive, highly interactive web applications using Next.js and React.",
    icon: <Layout size={48} className="text-accent-purple mb-4" />,
    color: "from-accent-purple/20 to-black/80"
  },
  {
    id: 3,
    title: "System Architecture",
    subtitle: "Designing scalable backend services, APIs, and cloud infrastructure.",
    icon: <Server size={48} className="text-emerald-400 mb-4" />,
    color: "from-emerald-400/20 to-black/80"
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
    <div className="relative w-full h-[300px] md:h-[400px] rounded-2xl overflow-hidden glass border border-white/10 group mb-12">
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
          className={`absolute inset-0 flex flex-col items-center justify-center p-8 bg-gradient-to-br ${slides[current].color} backdrop-blur-md`}
        >
          {slides[current].icon}
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 text-center tracking-tight">
            {slides[current].title}
          </h2>
          <p className="text-sm md:text-lg text-gray-300 font-mono text-center max-w-2xl">
            {slides[current].subtitle}
          </p>
        </motion.div>
      </AnimatePresence>

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 border border-white/10 text-white hover:bg-white/10 hover:border-accent-cyan transition-colors opacity-0 group-hover:opacity-100 z-10"
        aria-label="Previous Slide"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 border border-white/10 text-white hover:bg-white/10 hover:border-accent-cyan transition-colors opacity-0 group-hover:opacity-100 z-10"
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
            className={`w-2 h-2 rounded-full transition-all ${
              index === current ? "bg-accent-cyan w-6" : "bg-white/30 hover:bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
