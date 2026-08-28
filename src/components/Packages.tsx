"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Check, ArrowRight, Sparkles, Star } from "lucide-react";

const packages = [
  {
    name: "ESSENTIAL",
    badge: "Audio Foundation",
    tagline: "Pure acoustic voice recording for episodic podcasts and voiceovers.",
    features: [
      "Acoustically isolated soundstage suite",
      "Up to 4 RØDE PodMic dynamic broadcast microphones",
      "RØDECaster Pro II high-resolution multi-track recording",
      "On-site audio technician throughout session",
      "Immediate raw WAV multi-track stems delivery",
    ],
    recommended: false,
  },
  {
    name: "VIDEO PODCAST",
    badge: "Most Popular",
    tagline: "The industry standard: 4K multi-camera visuals plus broadcast audio.",
    features: [
      "Everything in Essential, plus:",
      "3x Sony Cinema 4K camera setup (Host + Guest + Wide)",
      "Double-diffused softbox lighting & customized RGB rim lights",
      "Live hardware camera switching via ATEM Mini Pro",
      "Full synchronized ProRes 4K video files & ISO tracks",
      "3x viral 9:16 vertical short-form teaser cutdowns",
    ],
    recommended: true,
  },
  {
    name: "PREMIUM PRODUCTION",
    badge: "Full Service Flagship",
    tagline: "Complete turnkey production from recording to distribution-ready masters.",
    features: [
      "Everything in Video Podcast, plus:",
      "Complete multi-camera full episode edit & color grading",
      "Comprehensive audio mastering to Spotify/Apple LUFS standards",
      "5x custom captioned vertical reels with motion hooks",
      "High-converting YouTube thumbnail design",
      "48-hour priority post-production turnaround",
    ],
    recommended: false,
  },
  {
    name: "CUSTOM",
    badge: "Bespoke Production",
    tagline: "Tailored studio build, brand sets, livestreams, and commercial series.",
    features: [
      "Dedicated multi-day studio block reservations",
      "Custom branded set construction & background staging",
      "Direct low-latency live streaming to multiple platforms",
      "Executive teleprompter & remote guest call-in feeds",
      "Full dedicated production crew & director on-site",
    ],
    recommended: false,
  },
];

export default function Packages() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const handleBooking = () => {
    const el = document.querySelector("#booking");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="packages" ref={ref} className="section-padding relative bg-[#050505] overflow-hidden">
      {/* Background Ambient Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] pointer-events-none opacity-10"
        style={{
          background: "radial-gradient(circle, #38bdf8 0%, transparent 70%)",
          filter: "blur(120px)",
        }}
      />

      <div className="max-w-[1440px] mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              <Sparkles size={13} className="text-accent" />
              <span
                className="text-[10px] sm:text-[11px] font-mono tracking-[0.3em] text-accent uppercase font-semibold"
                style={{ fontFamily: "var(--font-body)" }}
              >
                // STUDIO TIERS
              </span>
            </div>

            <h2
              className="text-4xl sm:text-6xl lg:text-7xl font-heading font-black tracking-tight text-white"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              STUDIO <span className="text-gradient">PACKAGES</span>
            </h2>
          </div>

          <p className="text-text-secondary text-sm sm:text-base max-w-md font-light leading-relaxed">
            Transparent studio packages scaled for indie podcasters, brand shows, and high-frequency media creators.
          </p>
        </div>

        {/* Stacked Luxury Packages Layout */}
        <div className="space-y-6">
          {packages.map((pkg, idx) => {
            return (
              <motion.div
                key={pkg.name}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className={`relative p-8 sm:p-10 rounded-sm border transition-all duration-500 ${
                  pkg.recommended
                    ? "bg-[#111111] border-accent/60 shadow-2xl shadow-accent/[0.08]"
                    : "bg-[#0c0c0c] border-white/[0.08] hover:border-white/20"
                }`}
              >
                {/* Top Recommended Glow Tag */}
                {pkg.recommended && (
                  <div className="absolute -top-3 left-8 sm:left-10">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm bg-accent text-black font-heading font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-accent/30">
                      <Star size={11} fill="currentColor" /> {pkg.badge}
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  {/* Left Info */}
                  <div className="lg:col-span-4 space-y-2">
                    {!pkg.recommended && (
                      <span className="text-[10px] font-mono uppercase tracking-widest text-accent font-semibold block mb-1">
                        {pkg.badge}
                      </span>
                    )}

                    <h3
                      className="text-2xl sm:text-4xl font-heading font-extrabold text-white tracking-tight"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {pkg.name}
                    </h3>

                    <p className="text-xs sm:text-sm text-text-secondary font-light leading-relaxed pt-1">
                      {pkg.tagline}
                    </p>
                  </div>

                  {/* Middle Features */}
                  <div className="lg:col-span-5 border-t lg:border-t-0 lg:border-l border-white/[0.06] pt-6 lg:pt-0 lg:pl-8">
                    <ul className="space-y-2.5">
                      {pkg.features.map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-text-secondary">
                          <Check size={15} className="text-accent flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Right CTA */}
                  <div className="lg:col-span-3 flex lg:justify-end items-center border-t lg:border-t-0 border-white/[0.06] pt-6 lg:pt-0">
                    <button
                      onClick={handleBooking}
                      className={`w-full lg:w-auto ${
                        pkg.recommended
                          ? "btn-primary !py-3.5 !px-7"
                          : "btn-outline !py-3.5 !px-7"
                      }`}
                    >
                      <span>GET A QUOTE</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
