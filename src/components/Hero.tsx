"use client";

import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, Radio, Sparkles } from "lucide-react";
import Image from "next/image";

export default function Hero() {
  const handleScroll = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden pt-28 pb-16"
    >
      {/* Studio Atmosphere Photography & Looping Lighting Stage */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 8, ease: "easeOut" }}
          className="relative w-full h-full"
        >
          <Image
            src="https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=2070&auto=format&fit=crop"
            alt="Apex Studio - Cinema Broadcast Studio"
            fill
            priority
            className="object-cover object-center brightness-[0.22] contrast-[1.25] filter"
            sizes="100vw"
          />
        </motion.div>

        {/* Electric / Icy Blue Studio Light Glows */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 20%, rgba(56, 189, 248, 0.12) 0%, transparent 60%), radial-gradient(circle at 80% 30%, rgba(0, 240, 255, 0.08) 0%, transparent 40%), radial-gradient(ellipse at 50% 100%, #050505 0%, transparent 70%)",
          }}
        />

        {/* Film Grain Texture */}
        <div className="grain-overlay" />

        {/* Deep Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-[#050505]/80" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center max-w-6xl mx-auto px-6 flex flex-col items-center">
        {/* Top Studio Label */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-md shadow-2xl">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent shadow-[0_0_8px_#38bdf8]"></span>
            </span>
            <span
              className="text-[10px] sm:text-[11px] font-mono tracking-[0.25em] text-accent font-semibold uppercase"
              style={{ fontFamily: "var(--font-body)" }}
            >
              APEX STUDIO / PODCAST &amp; MEDIA PRODUCTION
            </span>
          </div>
        </motion.div>

        {/* Massive Kinetic Typography */}
        <div className="space-y-0 sm:space-y-1 mb-8">
          <div className="overflow-hidden">
            <motion.h1
              initial={{ y: 90, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-heading font-black tracking-tighter leading-[0.9] text-white"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              CREATE
            </motion.h1>
          </div>

          <div className="overflow-hidden">
            <motion.h1
              initial={{ y: 90, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.38, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-heading font-black tracking-tighter leading-[0.9] text-gradient"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              WITHOUT
            </motion.h1>
          </div>

          <div className="overflow-hidden">
            <motion.h1
              initial={{ y: 90, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-heading font-black tracking-tighter leading-[0.9] text-white"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              LIMITS.
            </motion.h1>
          </div>
        </div>

        {/* Editorial Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="text-text-secondary text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-light"
          style={{ fontFamily: "var(--font-body)" }}
        >
          A professional creative space built for podcasts, video content,
          interviews, live productions and stories that deserve to be heard.
        </motion.p>

        {/* Dual Primary Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-14"
        >
          <button
            onClick={() => handleScroll("#booking")}
            className="btn-primary group w-full sm:w-auto text-center"
          >
            <span>BOOK A SESSION</span>
            <ArrowRight
              size={15}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </button>

          <button
            onClick={() => handleScroll("#studio")}
            className="btn-outline group w-full sm:w-auto text-center"
          >
            <span>EXPLORE THE STUDIO</span>
            <ChevronDown
              size={15}
              className="transition-transform duration-300 group-hover:translate-y-1"
            />
          </button>
        </motion.div>

        {/* Bottom Production Pillars */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 font-mono text-[10px] sm:text-xs text-text-muted uppercase tracking-[0.25em]"
        >
          <span className="px-3 py-1 rounded bg-white/[0.02] border border-white/[0.06]">PODCASTS</span>
          <span className="text-white/20">&bull;</span>
          <span className="px-3 py-1 rounded bg-white/[0.02] border border-white/[0.06]">VIDEO</span>
          <span className="text-white/20">&bull;</span>
          <span className="px-3 py-1 rounded bg-white/[0.02] border border-white/[0.06]">LIVE</span>
          <span className="text-white/20">&bull;</span>
          <span className="px-3 py-1 rounded bg-white/[0.02] border border-white/[0.06]">CONTENT</span>
        </motion.div>
      </div>
    </section>
  );
}
