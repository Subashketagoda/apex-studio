"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

const navLinks = [
  { label: "Studio", href: "#studio" },
  { label: "Services", href: "#services" },
  { label: "Equipment", href: "#equipment" },
  { label: "Work", href: "#work" },
  { label: "Packages", href: "#packages" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("studio");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Track active section via IntersectionObserver
  useEffect(() => {
    const sections = navLinks.map((l) => l.href.replace("#", ""));
    const observers: IntersectionObserver[] = [];

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        { threshold: 0.25 }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#050505]/85 backdrop-blur-xl border-b border-white/[0.07] py-3.5 shadow-2xl"
            : "bg-transparent py-6 border-b border-transparent"
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Brand Logo */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("#home");
            }}
            className="group flex items-center gap-2"
          >
            <span
              className="text-base sm:text-lg font-heading font-black tracking-[0.25em] text-white group-hover:text-accent transition-colors duration-300"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              APEX STUDIO
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse shadow-[0_0_8px_#38bdf8]" />
          </a>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 xl:gap-10">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace("#", "");
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className={`text-[11px] tracking-[0.22em] uppercase font-semibold transition-all duration-300 relative py-1 ${
                    isActive
                      ? "text-white"
                      : "text-text-secondary hover:text-white"
                  }`}
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-accent shadow-[0_0_8px_#38bdf8]"
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right Action Button & Mobile Trigger */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleNavClick("#booking")}
              className="hidden sm:inline-flex btn-primary !py-2.5 !px-5 !text-[11px] group"
            >
              <span>BOOK A SESSION</span>
              <ArrowRight
                size={13}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden text-white p-2 hover:text-accent transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-[#050505]/98 backdrop-blur-2xl flex flex-col justify-between p-8 lg:hidden pt-28"
          >
            <div className="flex flex-col gap-6">
              <span className="text-[10px] font-mono tracking-[0.3em] text-accent uppercase">
                // NAVIGATION
              </span>
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="text-2xl sm:text-3xl font-heading font-extrabold text-white hover:text-accent transition-colors tracking-tight flex items-center justify-between border-b border-white/[0.06] pb-3"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  <span>{link.label}</span>
                  <span className="text-xs font-mono text-text-muted">0{i + 1}</span>
                </motion.a>
              ))}
            </div>

            <div className="space-y-4 pt-6">
              <button
                onClick={() => handleNavClick("#booking")}
                className="btn-primary w-full justify-center !py-3.5"
              >
                <span>BOOK A SESSION</span>
                <ArrowRight size={14} />
              </button>

              <div className="flex items-center justify-between text-xs text-text-muted font-mono pt-2">
                <span>Colombo, Sri Lanka</span>
                <Link href="/admin" className="text-accent hover:underline">
                  Producer Desk ⚡
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
