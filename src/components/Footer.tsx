"use client";

import { ArrowUp, Sparkles } from "lucide-react";
import Link from "next/link";

const navLinks = [
  { label: "Studio", href: "#studio" },
  { label: "Services", href: "#services" },
  { label: "Equipment", href: "#equipment" },
  { label: "Work", href: "#work" },
  { label: "Packages", href: "#packages" },
  { label: "Booking", href: "#booking" },
  { label: "Contact", href: "#contact" },
];

const socials = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "YouTube", href: "https://youtube.com" },
  { label: "TikTok", href: "https://tiktok.com" },
  { label: "Facebook", href: "https://facebook.com" },
  { label: "Discord", href: "https://discord.com" },
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavClick = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="relative bg-[#050505] border-t border-white/[0.08] pt-20 pb-12 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        {/* Main Footer Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-white/[0.06]">
          {/* Brand Identity Column */}
          <div className="lg:col-span-5 space-y-4">
            <h3
              className="text-2xl sm:text-3xl font-heading font-black tracking-[0.2em] text-white"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              APEX STUDIO
            </h3>

            <p className="text-xs font-mono tracking-[0.3em] uppercase text-accent font-semibold">
              PODCAST • VIDEO • MEDIA
            </p>

            <p className="text-xs sm:text-sm text-text-secondary font-light max-w-sm leading-relaxed pt-2">
              A high-end creative space built for audio, cinema optics, and digital storytelling. Colombo, Sri Lanka.
            </p>
          </div>

          {/* Quick Navigation */}
          <div className="lg:col-span-3 space-y-3">
            <span className="text-[10px] font-mono tracking-[0.25em] text-accent uppercase block font-semibold mb-4">
              // EXPLORE
            </span>
            <ul className="space-y-2.5">
              {navLinks.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(item.href);
                    }}
                    className="text-xs font-mono text-text-secondary hover:text-white transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Channels */}
          <div className="lg:col-span-2 space-y-3">
            <span className="text-[10px] font-mono tracking-[0.25em] text-accent uppercase block font-semibold mb-4">
              // SOCIAL
            </span>
            <ul className="space-y-2.5">
              {socials.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono text-text-secondary hover:text-white transition-colors"
                  >
                    {item.label} &rarr;
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Producer Portal & Timezone */}
          <div className="lg:col-span-2 space-y-4">
            <span className="text-[10px] font-mono tracking-[0.25em] text-accent uppercase block font-semibold mb-4">
              // STUDIO DESK
            </span>
            <p className="text-xs font-mono text-text-secondary">
              Timezone: <br />
              <span className="text-white">Asia/Colombo (UTC+05:30)</span>
            </p>

            <div className="pt-2">
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-white/[0.03] border border-white/10 hover:border-accent text-[11px] font-mono text-text-secondary hover:text-white transition-colors"
              >
                <span>Producer Desk ⚡</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar with BACK TO TOP */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-text-muted">
          <p>© 2026 APEX STUDIO. ALL RIGHTS RESERVED.</p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-text-secondary hover:text-accent transition-colors font-semibold"
          >
            <span>BACK TO TOP</span>
            <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
}
