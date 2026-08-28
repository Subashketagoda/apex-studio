"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";

const servicesList = [
  {
    num: "01",
    title: "PODCAST RECORDING",
    category: "Acoustic Audio Suite",
    deliverables: "Multi-Track WAV • Up to 4 Dynamic Mics • Sound Engineer on-site",
    description: "Broadcast-quality voice capture in our acoustically treated room with isolated multi-track output and live monitoring.",
    image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=1600&auto=format&fit=crop",
  },
  {
    num: "02",
    title: "VIDEO PODCAST",
    category: "4K Multi-Camera Rig",
    deliverables: "Sony Cinema 4K • Multi-Angle ISO • Color Graded Profiles",
    description: "Full multi-camera video podcast production with cinema optics, soft studio key lighting, and synchronized timecode.",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1600&auto=format&fit=crop",
  },
  {
    num: "03",
    title: "CONTENT CREATION",
    category: "Viral Short-Form Engine",
    deliverables: "9:16 Vertical Cutdowns • Dynamic Subtitles • Hooks & B-Roll",
    description: "Transform 60-minute podcast recordings into high-converting TikToks, Instagram Reels, and YouTube Shorts.",
    image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=1600&auto=format&fit=crop",
  },
  {
    num: "04",
    title: "LIVE STREAMING",
    category: "Real-Time Broadcast",
    deliverables: "Multi-Platform RTMP • ATEM Live Switching • Lower Thirds",
    description: "Simulcast live podcast episodes and product launches directly to YouTube, Twitch, and LinkedIn with zero latency.",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1600&auto=format&fit=crop",
  },
  {
    num: "05",
    title: "AUDIO PRODUCTION",
    category: "Mastering & Cleanup",
    deliverables: "LUFS Spotify Standard • De-Essing • Multiband Compression",
    description: "Complete post-production audio engineering to ensure your podcast sounds crystal clear on AirPods, cars, and home speakers.",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1600&auto=format&fit=crop",
  },
  {
    num: "06",
    title: "VIDEO EDITING",
    category: "Full Episode Assembly",
    deliverables: "Dynamic Multicam Cut • Motion Graphics • 48-Hour Turnaround",
    description: "Precision video post-production including camera switching, sound effects, thumbnail design, and show notes.",
    image: "https://images.unsplash.com/photo-1520523839898-5071282543e1?q=80&w=1600&auto=format&fit=crop",
  },
];

export default function Services() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const handleBooking = () => {
    const el = document.querySelector("#booking");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="services" ref={ref} className="section-padding relative bg-[#050505] overflow-hidden">
      {/* Dynamic Background Image Reveal on Row Hover */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <AnimatePresence>
          {hoveredIdx !== null && (
            <motion.div
              key={servicesList[hoveredIdx].image}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 0.16, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative w-full h-full"
            >
              <Image
                src={servicesList[hoveredIdx].image}
                alt={servicesList[hoveredIdx].title}
                fill
                className="object-cover object-center filter grayscale brightness-75"
              />
            </motion.div>
          )}
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#050505]/70 to-[#050505]" />
      </div>

      <div className="max-w-[1440px] mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              <Sparkles size={13} className="text-accent" />
              <span
                className="text-[10px] sm:text-[11px] font-mono tracking-[0.3em] text-accent uppercase font-semibold"
                style={{ fontFamily: "var(--font-body)" }}
              >
                // PRODUCTION CAPABILITIES
              </span>
            </div>

            <h2
              className="text-4xl sm:text-6xl lg:text-7xl font-heading font-black tracking-tight text-white"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              WHAT WE <span className="text-gradient">DO</span>
            </h2>
          </div>

          <p className="text-text-secondary text-sm sm:text-base max-w-md font-light leading-relaxed">
            High-end audio, video, and digital media production tailored for founders, creators, and media organizations.
          </p>
        </div>

        {/* Editorial Horizontal Rows */}
        <div className="border-t border-white/[0.08]">
          {servicesList.map((service, idx) => {
            const isHovered = hoveredIdx === idx;
            return (
              <motion.div
                key={service.num}
                initial={{ opacity: 0, y: 25 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: idx * 0.06 }}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                onClick={handleBooking}
                className={`group relative border-b border-white/[0.08] cursor-pointer transition-all duration-500 overflow-hidden ${
                  isHovered ? "bg-[#111111]/80 py-10 sm:py-12" : "py-8 sm:py-9"
                }`}
              >
                {/* Thin Icy Glow Border on Hover */}
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1 bg-accent shadow-[0_0_12px_#38bdf8] transition-opacity duration-300 ${
                    isHovered ? "opacity-100" : "opacity-0"
                  }`}
                />

                <div className="px-4 sm:px-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  {/* Left: Number + Title */}
                  <div className="flex items-baseline gap-6 sm:gap-10">
                    <span
                      className={`text-sm sm:text-base font-mono font-bold transition-colors duration-300 ${
                        isHovered ? "text-accent" : "text-text-muted"
                      }`}
                    >
                      {service.num} /
                    </span>

                    <div>
                      <h3
                        className={`text-2xl sm:text-4xl md:text-5xl font-heading font-extrabold tracking-tight transition-all duration-300 ${
                          isHovered
                            ? "text-white translate-x-2"
                            : "text-text-secondary group-hover:text-white"
                        }`}
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        {service.title}
                      </h3>

                      <span className="text-xs font-mono text-accent/80 mt-1 block">
                        {service.category}
                      </span>
                    </div>
                  </div>

                  {/* Right: Deliverables + Arrow */}
                  <div className="flex items-center justify-between md:justify-end gap-6 sm:gap-10">
                    <span
                      className={`text-xs font-mono tracking-wide hidden lg:inline-block transition-colors duration-300 ${
                        isHovered ? "text-text-secondary" : "text-text-muted"
                      }`}
                    >
                      {service.deliverables}
                    </span>

                    <div
                      className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-300 ${
                        isHovered
                          ? "border-accent bg-accent text-black shadow-lg shadow-accent/20 scale-110"
                          : "border-white/10 text-text-secondary group-hover:border-white/30 group-hover:text-white"
                      }`}
                    >
                      <ArrowRight
                        size={18}
                        className={`transition-transform duration-300 ${
                          isHovered ? "translate-x-1" : ""
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Expanded Description on Hover */}
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-4 sm:px-8 mt-4 pt-4 border-t border-white/[0.04] max-w-3xl"
                  >
                    <p className="text-xs sm:text-sm text-text-secondary font-light leading-relaxed">
                      {service.description}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
