"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { Sparkles } from "lucide-react";

const wordsRow1 = ["YOUR", "STORY"];
const wordsRow2 = ["DESERVES"];
const wordsRow3 = ["THE", "RIGHT", "STAGE."];

export default function StudioIntro() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const yMove = useTransform(scrollYProgress, [0, 1], [-30, 30]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.98, 1, 0.98]);

  return (
    <section
      id="intro"
      ref={ref}
      className="section-padding flex flex-col items-center justify-center min-h-[80vh] relative overflow-hidden"
    >
      {/* Dynamic Background Mesh */}
      <motion.div
        style={{ y: yMove }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] pointer-events-none opacity-20"
      >
        <div
          className="w-full h-full rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(56, 189, 248, 0.2) 0%, transparent 70%)",
            filter: "blur(90px)",
          }}
        />
      </motion.div>

      <motion.div style={{ scale }} className="max-w-5xl mx-auto text-center relative z-10">
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08]"
        >
          <Sparkles size={13} className="text-accent" />
          <span
            className="text-[10px] sm:text-[11px] font-mono tracking-[0.3em] text-accent uppercase font-semibold"
            style={{ fontFamily: "var(--font-body)" }}
          >
            THE APEX EXPERIENCE
          </span>
        </motion.div>

        {/* Huge Kinetic Heading */}
        <div className="space-y-1 mb-8">
          {/* Row 1 */}
          <div className="flex flex-wrap justify-center gap-x-4 sm:gap-x-6">
            {wordsRow1.map((word, i) => (
              <div key={i} className="overflow-hidden">
                <motion.span
                  initial={{ y: 90, opacity: 0 }}
                  animate={isInView ? { y: 0, opacity: 1 } : {}}
                  transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-block text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-black tracking-tight text-white leading-none"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {word}
                </motion.span>
              </div>
            ))}
          </div>

          {/* Row 2 */}
          <div className="flex flex-wrap justify-center">
            {wordsRow2.map((word, i) => (
              <div key={i} className="overflow-hidden">
                <motion.span
                  initial={{ y: 90, opacity: 0 }}
                  animate={isInView ? { y: 0, opacity: 1 } : {}}
                  transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-block text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-black tracking-tight text-white leading-none"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {word}
                </motion.span>
              </div>
            ))}
          </div>

          {/* Row 3 with Highlight */}
          <div className="flex flex-wrap justify-center gap-x-4 sm:gap-x-6">
            {wordsRow3.map((word, i) => (
              <div key={i} className="overflow-hidden">
                <motion.span
                  initial={{ y: 90, opacity: 0 }}
                  animate={isInView ? { y: 0, opacity: 1 } : {}}
                  transition={{ duration: 0.8, delay: 0.4 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className={`inline-block text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-black tracking-tight leading-none ${
                    word === "STAGE." || word === "RIGHT" ? "text-gradient" : "text-white"
                  }`}
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {word}
                </motion.span>
              </div>
            ))}
          </div>
        </div>

        {/* Editorial Body Paragraph */}
        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-text-secondary text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-light mb-10"
          style={{ fontFamily: "var(--font-body)" }}
        >
          We designed APEX STUDIO as an uncompromised environment where broadcast acoustics,
          cinema optics, and precision lighting meet. For creators who know that presentation is everything.
        </motion.p>

        {/* Thin Icy Accent Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 1, delay: 0.9 }}
          className="w-24 h-[1.5px] bg-gradient-to-r from-transparent via-accent to-transparent mx-auto shadow-[0_0_10px_#38bdf8]"
        />
      </motion.div>
    </section>
  );
}
