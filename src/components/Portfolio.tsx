"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Play, X, Clock, Volume2, Sparkles, Film, Eye } from "lucide-react";
import Image from "next/image";

const categories = ["ALL", "PODCASTS", "INTERVIEWS", "REELS", "YOUTUBE", "LIVE"];

const portfolioWorks = [
  {
    id: 1,
    title: "The Creative Engine — Ep. 42",
    category: "PODCASTS",
    duration: "54:20",
    views: "128K plays",
    src: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=900&auto=format&fit=crop",
    desc: "4K multi-camera video podcast recording with dual host setup and live graphics overlays.",
  },
  {
    id: 2,
    title: "Founders In Focus: Silicon Series",
    category: "INTERVIEWS",
    duration: "1:08:14",
    views: "245K views",
    src: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=900&auto=format&fit=crop",
    desc: "In-depth studio conversation with cinema prime lenses, subtle rim lighting, and acoustic isolation.",
  },
  {
    id: 3,
    title: "Viral Micro-Moments (Batch #12)",
    category: "REELS",
    duration: "0:58",
    views: "1.8M views",
    src: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=900&auto=format&fit=crop",
    desc: "High-retention 9:16 vertical reels featuring dynamic subtitles, color punch, and sound design.",
  },
  {
    id: 4,
    title: "The High-Performance Mindset",
    category: "YOUTUBE",
    duration: "38:40",
    views: "412K views",
    src: "https://images.unsplash.com/photo-1520523839898-5071282543e1?q=80&w=900&auto=format&fit=crop",
    desc: "Full production package including YouTube thumbnail grading, intro animation, and multi-track mastering.",
  },
  {
    id: 5,
    title: "Global Tech Summit Live Stream",
    category: "LIVE",
    duration: "2:30:00",
    views: "64K live",
    src: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=900&auto=format&fit=crop",
    desc: "Low-latency multi-platform broadcast with ATEM hardware switching and live lower thirds.",
  },
  {
    id: 6,
    title: "Frequency & Rhythm — Audio Series",
    category: "PODCASTS",
    duration: "42:15",
    views: "89K plays",
    src: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=900&auto=format&fit=crop",
    desc: "Multi-track audio master and vocal polishing engineered for Spotify & Apple Podcasts.",
  },
];

export default function Portfolio() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [selectedVideo, setSelectedVideo] = useState<typeof portfolioWorks[0] | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const filteredWorks =
    activeCategory === "ALL"
      ? portfolioWorks
      : portfolioWorks.filter((item) => item.category === activeCategory);

  return (
    <>
      <section id="work" ref={ref} className="section-padding relative bg-[#070707] overflow-hidden">
        <div className="max-w-[1440px] mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 mb-3">
                <Film size={13} className="text-accent" />
                <span
                  className="text-[10px] sm:text-[11px] font-mono tracking-[0.3em] text-accent uppercase font-semibold"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  // RECENT PRODUCTIONS
                </span>
              </div>

              <h2
                className="text-4xl sm:text-6xl lg:text-7xl font-heading font-black tracking-tight text-white leading-[1.02]"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                WATCH. <br />
                LISTEN. <br />
                <span className="text-gradient">CREATE.</span>
              </h2>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-sm text-[11px] font-mono uppercase tracking-wider transition-all ${
                    activeCategory === cat
                      ? "bg-accent text-black font-bold shadow-lg shadow-accent/20"
                      : "bg-white/[0.03] border border-white/[0.07] text-text-secondary hover:text-white hover:border-white/20"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Video Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorks.map((work, idx) => (
              <motion.div
                key={work.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: idx * 0.08 }}
                onClick={() => setSelectedVideo(work)}
                data-cursor="PLAY"
                className="group relative bg-[#101010] border border-white/[0.07] hover:border-accent/40 rounded-sm overflow-hidden cursor-pointer flex flex-col justify-between transition-all duration-500 shadow-2xl hover:shadow-accent/[0.05]"
              >
                {/* Video Card Thumbnail Stage */}
                <div className="relative aspect-video w-full overflow-hidden bg-[#0c0c0c]">
                  <Image
                    src={work.src}
                    alt={work.title}
                    fill
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-106 brightness-[0.75] contrast-[1.2] group-hover:brightness-95"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />

                  {/* Gradient Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#101010] via-black/20 to-black/20" />

                  {/* Top Category Badge */}
                  <div className="absolute top-3.5 left-3.5 z-10">
                    <span className="text-[10px] font-mono tracking-widest uppercase px-2.5 py-1 rounded-sm bg-black/75 backdrop-blur-md border border-white/10 text-white font-semibold">
                      {work.category}
                    </span>
                  </div>

                  {/* Duration Badge */}
                  <div className="absolute top-3.5 right-3.5 z-10 flex items-center gap-1 text-[10px] font-mono text-white/90 px-2 py-0.5 rounded bg-black/75 backdrop-blur-md border border-white/10">
                    <Clock size={11} className="text-accent" />
                    <span>{work.duration}</span>
                  </div>

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center bg-black/60 backdrop-blur-md group-hover:scale-110 group-hover:border-accent group-hover:bg-accent/20 transition-all duration-500 shadow-2xl">
                      <Play size={18} className="text-white group-hover:text-accent ml-0.5 transition-colors" fill="currentColor" />
                    </div>
                  </div>
                </div>

                {/* Card Details */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-text-muted mb-2 font-mono">
                      <span>Apex Production</span>
                      <span className="text-accent flex items-center gap-1 text-[11px]">
                        <Eye size={11} /> {work.views}
                      </span>
                    </div>

                    <h3
                      className="text-lg sm:text-xl font-heading font-bold text-white group-hover:text-accent transition-colors duration-300 mb-2"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {work.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-text-secondary font-light line-clamp-2 leading-relaxed">
                      {work.desc}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-white/[0.05] flex items-center justify-between font-mono text-[10px]">
                    <span className="text-accent uppercase tracking-wider group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 font-semibold">
                      WATCH MASTER &rarr;
                    </span>
                    <span className="text-text-muted">4K HDR</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Fullscreen Video Player Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-10"
            onClick={() => setSelectedVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-w-5xl w-full bg-[#101010] border border-white/10 rounded-sm overflow-hidden flex flex-col shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-black/70 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:text-accent transition-colors"
                aria-label="Close video"
              >
                <X size={18} />
              </button>

              {/* Video Player Screen */}
              <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
                <Image
                  src={selectedVideo.src}
                  alt={selectedVideo.title}
                  fill
                  className="object-cover object-center opacity-65 contrast-[1.15]"
                  priority
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40 flex flex-col justify-between p-6">
                  {/* Top Bar */}
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-accent bg-black/70 px-2.5 py-1 rounded border border-accent/30">
                      4K MASTER
                    </span>
                    <span className="text-xs text-white/90 font-medium truncate max-w-md">
                      {selectedVideo.title}
                    </span>
                  </div>

                  {/* Center Play Button */}
                  <div className="self-center">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="w-18 h-18 rounded-full bg-accent/20 border border-accent flex items-center justify-center text-accent hover:scale-110 hover:bg-accent hover:text-black transition-all duration-300 shadow-2xl"
                    >
                      <Play size={24} className="ml-1" fill="currentColor" />
                    </button>
                  </div>

                  {/* Player Controls */}
                  <div className="space-y-2">
                    <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden cursor-pointer">
                      <div className="h-full w-2/5 bg-accent shadow-[0_0_8px_#38bdf8]" />
                    </div>

                    <div className="flex items-center justify-between text-xs text-white/80 font-mono">
                      <span>14:20 / {selectedVideo.duration}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] text-text-muted">Pro Tools Stereo Audio</span>
                        <Volume2 size={15} className="text-accent" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Metadata */}
              <div className="p-6 bg-[#101010] border-t border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-mono text-accent font-semibold block mb-1">
                    {selectedVideo.category} • {selectedVideo.views}
                  </span>
                  <h3 className="text-xl font-heading font-bold text-white">
                    {selectedVideo.title}
                  </h3>
                  <p className="text-xs text-text-secondary mt-1 max-w-2xl font-light">
                    {selectedVideo.desc}
                  </p>
                </div>

                <a
                  href="#booking"
                  onClick={() => setSelectedVideo(null)}
                  className="btn-primary !py-2.5 !px-5 !text-xs whitespace-nowrap self-start sm:self-auto"
                >
                  PRODUCE SIMILAR SHOW
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
