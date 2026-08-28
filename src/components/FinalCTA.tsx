"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";

export default function FinalCTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const handleBooking = () => {
    const el = document.querySelector("#booking");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={ref}
      className="relative py-28 sm:py-40 bg-[#050505] overflow-hidden flex items-center justify-center text-center border-t border-white/[0.08]"
    >
      {/* Background Atmosphere Image with Ambient Lighting */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <Image
          src="https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=2000&auto=format&fit=crop"
          alt="Apex Studio Stage"
          fill
          className="object-cover object-center filter grayscale brightness-50"
        />
        <div className="grain-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]" />
      </div>

      {/* Center Icy Flare Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] pointer-events-none opacity-20"
        style={{
          background: "radial-gradient(circle, rgba(56, 189, 248, 0.3) 0%, transparent 70%)",
          filter: "blur(100px)",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08]"
        >
          <Sparkles size={13} className="text-accent" />
          <span
            className="text-[10px] sm:text-[11px] font-mono tracking-[0.3em] text-accent uppercase font-semibold"
            style={{ fontFamily: "var(--font-body)" }}
          >
            // START YOUR PRODUCTION
          </span>
        </motion.div>

        {/* Massive Typography */}
        <div className="space-y-1 mb-8">
          <div className="overflow-hidden">
            <motion.h2
              initial={{ y: 90, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-heading font-black tracking-tighter leading-none text-white"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              GOT A STORY
            </motion.h2>
          </div>

          <div className="overflow-hidden">
            <motion.h2
              initial={{ y: 90, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-heading font-black tracking-tighter leading-none text-gradient"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              TO TELL?
            </motion.h2>
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="text-text-secondary text-base sm:text-xl max-w-xl mx-auto mb-10 font-light leading-relaxed"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Let&apos;s turn your idea into something worth watching.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.65 }}
        >
          <button
            onClick={handleBooking}
            className="btn-primary group !py-4 !px-9 !text-sm"
          >
            <span>BOOK YOUR SESSION</span>
            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
