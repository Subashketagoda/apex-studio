"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { X, Maximize2, Sparkles, Radio } from "lucide-react";
import Image from "next/image";

const galleryShots = [
  {
    id: "01",
    title: "THE MAIN SET",
    caption: "Acoustic custom wooden table with quad boom arms & dimmable warm ambient light.",
    src: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1800&auto=format&fit=crop",
    layout: "lg:col-span-8 lg:row-span-2 aspect-[16/10]",
  },
  {
    id: "02",
    title: "AUDIO CONTROL",
    caption: "Isolated hardware preamps, DSP multi-track mixing, and live sound engineering.",
    src: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop",
    layout: "lg:col-span-4 aspect-[4/3] lg:aspect-auto",
  },
  {
    id: "03",
    title: "CAMERA SETUP",
    caption: "4K Sony cinema sensors paired with prime optics for ultra-clean bokeh.",
    src: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200&auto=format&fit=crop",
    layout: "lg:col-span-4 aspect-[4/3] lg:aspect-auto",
  },
  {
    id: "04",
    title: "STUDIO LIGHTING",
    caption: "Double-diffused softboxes and color-customizable background illumination.",
    src: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1800&auto=format&fit=crop",
    layout: "lg:col-span-6 aspect-[16/9]",
  },
  {
    id: "05",
    title: "CREATOR SUITE",
    caption: "Comfortable hospitality lounge designed for guests, producers, and crew.",
    src: "https://images.unsplash.com/photo-1520523839898-5071282543e1?q=80&w=1800&auto=format&fit=crop",
    layout: "lg:col-span-6 aspect-[16/9]",
  },
];

export default function StudioGallery() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [selectedShot, setSelectedShot] = useState<typeof galleryShots[0] | null>(null);

  return (
    <>
      <section id="studio" ref={ref} className="section-padding relative bg-[#050505] overflow-hidden">
        <div className="max-w-[1440px] mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 mb-3">
                <Sparkles size={13} className="text-accent" />
                <span
                  className="text-[10px] sm:text-[11px] font-mono tracking-[0.3em] text-accent uppercase font-semibold"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  // THE SOUNDSTAGE &amp; INTERIORS
                </span>
              </div>

              <h2
                className="text-4xl sm:text-6xl lg:text-7xl font-heading font-black tracking-tight text-white"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                STUDIO <span className="text-gradient">GALLERY</span>
              </h2>
            </div>

            <p className="text-text-secondary text-sm sm:text-base max-w-md font-light leading-relaxed">
              Step inside our acoustically isolated broadcast suites and multi-camera soundstage.
            </p>
          </div>

          {/* Asymmetrical Overlapping Gallery Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
            {galleryShots.map((shot, idx) => (
              <motion.div
                key={shot.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: idx * 0.08 }}
                onClick={() => setSelectedShot(shot)}
                className={`${shot.layout} group relative rounded-sm overflow-hidden bg-[#101010] border border-white/[0.07] hover:border-accent/40 cursor-pointer transition-all duration-500 shadow-2xl`}
              >
                {/* Photo Element */}
                <Image
                  src={shot.src}
                  alt={shot.title}
                  fill
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 brightness-[0.8] contrast-[1.15] group-hover:brightness-100"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/10 opacity-75 group-hover:opacity-60 transition-opacity duration-500" />

                {/* Top Caption Pill */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="text-[10px] font-mono tracking-widest uppercase px-2.5 py-1 rounded-sm bg-black/75 backdrop-blur-md border border-white/10 text-white font-semibold flex items-center gap-1.5">
                    <span className="text-accent">{shot.id} /</span> {shot.title}
                  </span>
                </div>

                {/* Hover Expand Button */}
                <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-8 h-8 rounded-full bg-black/80 backdrop-blur-md border border-accent/40 text-accent flex items-center justify-center">
                    <Maximize2 size={13} />
                  </div>
                </div>

                {/* Bottom Caption */}
                <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                  <p className="text-xs sm:text-sm text-text-secondary line-clamp-2 font-light leading-relaxed group-hover:text-white transition-colors duration-300">
                    {shot.caption}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {selectedShot && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-10"
            onClick={() => setSelectedShot(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-w-5xl w-full bg-[#101010] border border-white/10 rounded-sm overflow-hidden flex flex-col shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Icon */}
              <button
                onClick={() => setSelectedShot(null)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/70 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:text-accent hover:border-accent transition-colors"
                aria-label="Close image"
              >
                <X size={18} />
              </button>

              <div className="relative w-full aspect-video min-h-[300px]">
                <Image
                  src={selectedShot.src}
                  alt={selectedShot.title}
                  fill
                  className="object-cover object-center"
                  sizes="100vw"
                  priority
                />
              </div>

              <div className="p-6 bg-[#101010] border-t border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-mono text-accent font-semibold block mb-1">
                    {selectedShot.id} / APEX STUDIO SOUNDSTAGE
                  </span>
                  <h3 className="text-xl font-heading font-bold text-white">
                    {selectedShot.title}
                  </h3>
                  <p className="text-xs text-text-secondary mt-1 font-light">
                    {selectedShot.caption}
                  </p>
                </div>

                <a
                  href="#booking"
                  onClick={() => setSelectedShot(null)}
                  className="btn-primary !py-2.5 !px-5 !text-xs whitespace-nowrap self-start sm:self-auto"
                >
                  BOOK THIS SET
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
