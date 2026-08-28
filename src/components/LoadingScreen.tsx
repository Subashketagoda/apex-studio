"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LoadingScreenProps {
  onComplete?: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const duration = 1400; // 1.4s fast smooth load
    const interval = 15;
    const steps = duration / interval;
    let current = 0;

    const timer = setInterval(() => {
      current += 100 / steps;
      if (current >= 100) {
        current = 100;
        clearInterval(timer);
        setTimeout(() => {
          setIsComplete(true);
          onComplete?.();
        }, 250);
      }
      setProgress(Math.min(current, 100));
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050505] overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.05,
            filter: "blur(12px)",
            clipPath: "inset(0 0 100% 0)",
          }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Subtle Ambient Icy Glow */}
          <div
            className="absolute w-96 h-96 rounded-full pointer-events-none opacity-20"
            style={{
              background: "radial-gradient(circle, rgba(56, 189, 248, 0.25) 0%, transparent 70%)",
              filter: "blur(60px)",
            }}
          />

          {/* Center Brand Titles */}
          <div className="relative z-10 text-center mb-10 flex flex-col items-center">
            <motion.h1
              initial={{ opacity: 0, y: 15, letterSpacing: "0.2em" }}
              animate={{ opacity: 1, y: 0, letterSpacing: "0.35em" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-4xl sm:text-6xl md:text-7xl font-heading font-black text-white leading-none tracking-[0.35em]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              APEX
            </motion.h1>

            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-[11px] sm:text-xs tracking-[0.6em] font-mono text-accent font-medium mt-2 uppercase"
            >
              STUDIO
            </motion.span>
          </div>

          {/* Thin Animated Progress Line */}
          <div className="relative z-10 w-48 sm:w-64">
            <div className="h-[1px] w-full bg-white/[0.08] relative overflow-hidden">
              <motion.div
                className="h-full absolute left-0 top-0 bg-gradient-to-r from-accent-light via-accent to-white shadow-[0_0_10px_#38bdf8]"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Counter Text */}
            <div className="mt-4 flex items-center justify-between font-mono text-[10px] sm:text-xs text-text-muted tracking-widest">
              <span>LOADING</span>
              <span className="text-white font-bold tabular-nums">
                {String(Math.round(progress)).padStart(2, "0")} — 100
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
