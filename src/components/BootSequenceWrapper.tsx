"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import VMBootScreen from "./VMBootScreen";

export default function BootSequenceWrapper({ children }: { children: React.ReactNode }) {
  const [isBootComplete, setIsBootComplete] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      {isMounted && (
        <AnimatePresence>
          {!isBootComplete && <VMBootScreen onComplete={() => setIsBootComplete(true)} />}
        </AnimatePresence>
      )}
      
      {/* 
        We use opacity to hide the content while booting so that SEO/crawlers still see the DOM,
        but users don't see a flash of the landing page before the boot screen appears.
      */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isBootComplete ? 1 : 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className={!isBootComplete ? "pointer-events-none h-screen overflow-hidden" : ""}
      >
        {children}
      </motion.div>
    </>
  );
}
