"use client";

import { useRef, ComponentType, SVGProps } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";

// Inline Custom SVG Brand Icons
function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function YoutubeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </svg>
  );
}

function TiktokIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  );
}

function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function DiscordIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 6h0a14.5 14.5 0 0 0-4-1.25.1.1 0 0 0-.1.05c-.2.35-.4.8-.55 1.2a13.5 13.5 0 0 0-4.7 0c-.15-.4-.35-.85-.55-1.2a.1.1 0 0 0-.1-.05A14.5 14.5 0 0 0 6 6a16 16 0 0 0-3 12.2.1.1 0 0 0 .05.08 14.6 14.6 0 0 0 4.4 2.2.1.1 0 0 0 .1-.05c.35-.45.65-.95.95-1.45a.1.1 0 0 0-.05-.15 9.5 9.5 0 0 1-1.35-.65.1.1 0 0 1 0-.15c.1-.1.2-.15.3-.25a10.5 10.5 0 0 0 9.2 0c.1.1.2.15.3.25a.1.1 0 0 1 0 .15 9.5 9.5 0 0 1-1.35.65.1.1 0 0 0-.05.15c.3.5.6 1 .95 1.45a.1.1 0 0 0 .1.05 14.6 14.6 0 0 0 4.4-2.2.1.1 0 0 0 .05-.08A16 16 0 0 0 18 6zM8.5 14.5c-.8 0-1.5-.75-1.5-1.7s.65-1.7 1.5-1.7 1.5.75 1.5 1.7-.65 1.7-1.5 1.7zm7 0c-.8 0-1.5-.75-1.5-1.7s.65-1.7 1.5-1.7 1.5.75 1.5 1.7-.7 1.7-1.5 1.7z" />
    </svg>
  );
}

interface SocialItem {
  name: string;
  handle: string;
  href: string;
  tag: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
}

const socialPlatforms: SocialItem[] = [
  {
    name: "Instagram",
    handle: "@apexstudio.lk",
    href: "https://instagram.com",
    tag: "Behind The Scenes & Set Stills",
    Icon: InstagramIcon,
  },
  {
    name: "YouTube",
    handle: "Apex Studio Colombo",
    href: "https://youtube.com",
    tag: "4K Full Episodes & Masterclasses",
    Icon: YoutubeIcon,
  },
  {
    name: "TikTok",
    handle: "@apexstudio",
    href: "https://tiktok.com",
    tag: "Viral Clips & Creator Insights",
    Icon: TiktokIcon,
  },
  {
    name: "Facebook",
    handle: "Apex Studio LK",
    href: "https://facebook.com",
    tag: "Studio Updates & Events",
    Icon: FacebookIcon,
  },
  {
    name: "Discord",
    handle: "Apex Creator Community",
    href: "https://discord.com",
    tag: "Private Creator Lounge & Collabs",
    Icon: DiscordIcon,
  },
];

export default function SocialSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="social" ref={ref} className="section-padding relative bg-[#070707] overflow-hidden">
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
                // DIGITAL NETWORK
              </span>
            </div>

            <h2
              className="text-4xl sm:text-6xl lg:text-7xl font-heading font-black tracking-tight text-white"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              FOLLOW THE <span className="text-gradient">WORK.</span>
            </h2>
          </div>

          <p className="text-text-secondary text-sm sm:text-base max-w-md font-light leading-relaxed">
            Catch behind-the-scenes production footage, episode drops, and join our creator network.
          </p>
        </div>

        {/* Social Platforms Row List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {socialPlatforms.map((social, idx) => (
            <motion.a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 25 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: idx * 0.08 }}
              className="group relative p-6 rounded-sm bg-[#101010] border border-white/[0.07] hover:border-accent/40 transition-all duration-400 flex flex-col justify-between hover:shadow-xl hover:shadow-accent/[0.04]"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-10 h-10 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center text-text-secondary group-hover:text-accent group-hover:border-accent/40 transition-colors">
                    <social.Icon width={18} height={18} />
                  </div>
                  <ArrowUpRight
                    size={16}
                    className="text-text-muted group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                  />
                </div>

                <h3
                  className="text-xl font-heading font-bold text-white group-hover:text-accent transition-colors duration-300"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {social.name}
                </h3>
                <span className="text-xs font-mono text-text-muted block mt-0.5">
                  {social.handle}
                </span>
              </div>

              <p className="text-[11px] text-text-secondary font-light mt-6 pt-4 border-t border-white/[0.04] leading-relaxed">
                {social.tag}
              </p>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
