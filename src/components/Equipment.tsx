"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Sparkles, Radio, Video, Sliders, Cpu, Sun, Layers } from "lucide-react";
import Image from "next/image";

const gearList = [
  {
    name: "RØDE PodMic",
    category: "Broadcast Microphone",
    spec: "Dynamic Cardioid • Integrated Pop Shield • Solid Brass Body",
    description: "Broadcast-grade dynamic microphone tailored for speech with balanced acoustic clarity and zero plosive distortion.",
    src: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=900&auto=format&fit=crop",
    Icon: Radio,
  },
  {
    name: "RØDECaster Pro II",
    category: "Integrated Audio Studio",
    spec: "Revolution Preamps™ • APHEX® DSP • Multi-Track USB/SD",
    description: "All-in-one audio production powerhouse with ultra-low noise preamps and studio-grade processing for up to 4 simultaneous hosts.",
    src: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=900&auto=format&fit=crop",
    Icon: Sliders,
  },
  {
    name: "Sony ZV-E10 Rig",
    category: "4K Multi-Cam Cinema",
    spec: "APS-C Exmor Sensor • Real-time Eye AF • 4K HDR Over-sampling",
    description: "Cinema mirrorless cameras matched with fast prime lenses delivering clean skin tones, high dynamic range, and natural bokeh.",
    src: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=900&auto=format&fit=crop",
    Icon: Video,
  },
  {
    name: "ATEM Mini Pro",
    category: "Hardware Live Switcher",
    spec: "Hardware Multi-View • Direct RTMP • Live Audio Mixer",
    description: "Broadcast production switcher for real-time camera switching, graphics overlays, and low-latency multi-platform streaming.",
    src: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=900&auto=format&fit=crop",
    Icon: Cpu,
  },
  {
    name: "Studio Key Lighting",
    category: "Continuous Bi-Color Lighting",
    spec: "CRI 96+ • 2700K–6500K • DMX Controlled",
    description: "High-output studio fixtures providing color-accurate, cinema-grade illumination tailored to each guest.",
    src: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=900&auto=format&fit=crop",
    Icon: Sun,
  },
  {
    name: "Parabolic Softboxes",
    category: "Acoustic Diffusion & Light",
    spec: "Double-diffused Soft Glow • Deep Parabolic Profile",
    description: "Large studio softbox diffusers creating flattering, wrap-around lighting that eliminates harsh shadows and glare.",
    src: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=900&auto=format&fit=crop",
    Icon: Layers,
  },
];

export default function Equipment() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="equipment" ref={ref} className="section-padding relative bg-[#070707] overflow-hidden">
      {/* Background Ambient Glow */}
      <div
        className="absolute top-1/3 right-0 w-[500px] h-[500px] pointer-events-none opacity-10"
        style={{
          background: "radial-gradient(circle, #38bdf8 0%, transparent 70%)",
          filter: "blur(100px)",
        }}
      />

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
                // HARDWARE SPECIFICATIONS
              </span>
            </div>

            <h2
              className="text-4xl sm:text-6xl lg:text-7xl font-heading font-black tracking-tight text-white leading-[1.05]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              THE TOOLS <br />
              <span className="text-gradient">BEHIND THE STORY.</span>
            </h2>
          </div>

          <p className="text-text-secondary text-sm sm:text-base max-w-md font-light leading-relaxed">
            Only real, industry-standard equipment. Precision hardware calibrated for flawless acoustic fidelity and 4K cinema visuals.
          </p>
        </div>

        {/* Apple-Style Product Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gearList.map((item, idx) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: idx * 0.08 }}
              className="group relative bg-[#101010] border border-white/[0.07] hover:border-accent/40 rounded-sm overflow-hidden flex flex-col justify-between transition-all duration-500 hover:shadow-2xl hover:shadow-accent/[0.04]"
            >
              {/* Product Visual Container */}
              <div className="relative aspect-[16/11] w-full overflow-hidden bg-[#0c0c0c]">
                <Image
                  src={item.src}
                  alt={item.name}
                  fill
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108 brightness-[0.75] contrast-[1.2] group-hover:brightness-95"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#101010] via-transparent to-transparent opacity-90" />

                {/* Category Pill */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="text-[10px] font-mono tracking-widest uppercase px-2.5 py-1 rounded-sm bg-black/75 backdrop-blur-md border border-white/10 text-accent font-semibold">
                    {item.category}
                  </span>
                </div>

                {/* Hardware Icon */}
                <div className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/75 backdrop-blur-md border border-white/10 flex items-center justify-center text-text-secondary group-hover:text-accent group-hover:border-accent/40 transition-colors">
                  <item.Icon size={14} />
                </div>
              </div>

              {/* Glass Information Panel */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                <div>
                  <h3
                    className="text-xl sm:text-2xl font-heading font-bold text-white group-hover:text-accent transition-colors duration-300 mb-1"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {item.name}
                  </h3>

                  <p className="text-[11px] font-mono text-accent/80 tracking-wide mb-3 font-medium">
                    {item.spec}
                  </p>

                  <p className="text-xs sm:text-sm text-text-secondary font-light leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Bottom Verification Strip */}
                <div className="mt-6 pt-4 border-t border-white/[0.05] flex items-center justify-between font-mono text-[10px]">
                  <span className="text-text-muted uppercase tracking-wider">Apex Calibrated</span>
                  <span className="text-accent font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" /> IN STUDIO
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
