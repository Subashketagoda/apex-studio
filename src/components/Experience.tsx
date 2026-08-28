"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, Radio } from "lucide-react";
import Image from "next/image";

const experienceItems = [
  {
    num: "01",
    title: "Professional Audio",
    tag: "Matched RØDE Dynamic Mics",
    desc: "Acoustically tuned isolation suite with ultra-low noise preamps ensuring broadcast-grade voice warmth.",
    image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=1200&auto=format&fit=crop",
  },
  {
    num: "02",
    title: "Multi-Camera Production",
    tag: "4K Cinema Optical Sensors",
    desc: "Sony full-frame cameras configured for multiple synchronized angles with shallow depth-of-field.",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200&auto=format&fit=crop",
  },
  {
    num: "03",
    title: "Studio Lighting",
    tag: "Diffused Softboxes & RGB Accents",
    desc: "Overhead lantern diffusion, rim lighting, and app-controlled background hues to match your brand identity.",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop",
  },
  {
    num: "04",
    title: "Content-Ready Production",
    tag: "Live ISO Multi-Track Capture",
    desc: "Direct multi-track WAV stems and ProRes video files delivered immediately after session wrap.",
    image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1200&auto=format&fit=crop",
  },
  {
    num: "05",
    title: "Professional Editing",
    tag: "Short-Form Reels & 4K Masters",
    desc: "End-to-end post production with dynamic captions, audio mastering, and viral short-form cutdowns.",
    image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=1200&auto=format&fit=crop",
  },
];

export default function Experience() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section id="experience" ref={ref} className="section-padding relative overflow-hidden bg-[#070707]">
      {/* Background Radial Atmosphere */}
      <div
        className="absolute top-1/2 left-0 w-[600px] h-[600px] pointer-events-none opacity-10"
        style={{
          background: "radial-gradient(circle, #38bdf8 0%, transparent 70%)",
          filter: "blur(100px)",
        }}
      />

      <div className="max-w-[1440px] mx-auto relative z-10">
        {/* Section Heading */}
        <div className="mb-14 lg:mb-20">
          <div className="inline-flex items-center gap-2 mb-3">
            <Sparkles size={13} className="text-accent" />
            <span
              className="text-[10px] sm:text-[11px] font-mono tracking-[0.3em] text-accent uppercase font-semibold"
              style={{ fontFamily: "var(--font-body)" }}
            >
              // PRODUCTION ENVIRONMENT
            </span>
          </div>

          <h2
            className="text-4xl sm:text-6xl lg:text-7xl font-heading font-black tracking-tight text-white"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            BUILT FOR <span className="text-gradient">CREATORS.</span>
          </h2>
        </div>

        {/* Split Layout: Interactive Numbered List + Dynamic Photo Frame */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Left Column: Numbered List */}
          <div className="lg:col-span-6 space-y-1">
            {experienceItems.map((item, idx) => {
              const isActive = activeIndex === idx;
              return (
                <div
                  key={item.num}
                  onMouseEnter={() => setActiveIndex(idx)}
                  className={`group relative p-6 rounded-sm border cursor-pointer transition-all duration-400 ${
                    isActive
                      ? "bg-[#111111] border-accent/40 shadow-xl shadow-accent/[0.04]"
                      : "bg-transparent border-white/[0.05] hover:border-white/15"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 sm:gap-6">
                      {/* Number */}
                      <span
                        className={`text-sm sm:text-base font-mono font-bold transition-colors duration-300 ${
                          isActive ? "text-accent" : "text-text-muted group-hover:text-white"
                        }`}
                      >
                        {item.num}
                      </span>

                      <div>
                        <h3
                          className={`text-lg sm:text-2xl font-heading font-bold transition-colors duration-300 mb-1 ${
                            isActive ? "text-white" : "text-text-secondary group-hover:text-white"
                          }`}
                          style={{ fontFamily: "var(--font-heading)" }}
                        >
                          {item.title}
                        </h3>

                        <span className="text-[11px] font-mono text-accent/80 block mb-2 font-medium">
                          {item.tag}
                        </span>

                        <p className="text-xs sm:text-sm text-text-secondary font-light leading-relaxed max-w-md">
                          {item.desc}
                        </p>
                      </div>
                    </div>

                    <ArrowRight
                      size={18}
                      className={`transition-all duration-300 flex-shrink-0 mt-1 ${
                        isActive
                          ? "text-accent translate-x-1"
                          : "text-text-muted/40 group-hover:text-text-muted group-hover:translate-x-0.5"
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Dynamic Photo Frame with Ambient Overlay */}
          <div className="lg:col-span-6 relative aspect-[4/3] sm:aspect-[16/11] w-full rounded-sm overflow-hidden border border-white/10 bg-[#121212] shadow-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={experienceItems[activeIndex].image}
                initial={{ opacity: 0, scale: 1.06 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative w-full h-full"
              >
                <Image
                  src={experienceItems[activeIndex].image}
                  alt={experienceItems[activeIndex].title}
                  fill
                  className="object-cover object-center brightness-[0.8] contrast-[1.15]"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-80" />

                {/* Bottom Frame Badge */}
                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between z-10">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-sm bg-black/70 backdrop-blur-md border border-white/10">
                    <Radio size={12} className="text-accent animate-pulse" />
                    <span className="text-xs font-mono text-white font-medium uppercase">
                      {experienceItems[activeIndex].num} • {experienceItems[activeIndex].title}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono uppercase text-accent tracking-widest bg-black/70 px-2.5 py-1 rounded-sm border border-accent/30">
                    APEX LIVE
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
