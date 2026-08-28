"use client";

export default function Marquee() {
  const marqueeText = "PODCASTS • VIDEO • CONTENT • STORIES • PRODUCTION • APEX STUDIO • ";

  return (
    <div className="relative w-full overflow-hidden py-6 sm:py-8 border-y border-white/[0.08] bg-[#050505]/90 backdrop-blur-md">
      {/* Side Fade Gradients */}
      <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-40 z-10 bg-gradient-to-r from-[#050505] to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-40 z-10 bg-gradient-to-l from-[#050505] to-transparent pointer-events-none" />

      {/* Infinite Moving Marquee Track */}
      <div className="animate-marquee whitespace-nowrap flex items-center">
        {[...Array(4)].map((_, i) => (
          <span
            key={i}
            className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-black tracking-tight text-white/20 hover:text-accent transition-colors duration-500 mr-8 uppercase select-none"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {marqueeText}
          </span>
        ))}
      </div>
    </div>
  );
}
