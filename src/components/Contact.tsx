"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageSquare,
  Sparkles,
  ArrowUpRight,
  ExternalLink,
} from "lucide-react";

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="contact" ref={ref} className="section-padding relative bg-[#070707] overflow-hidden">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Left Column: Heading & Introduction */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 mb-3">
                <Sparkles size={13} className="text-accent" />
                <span
                  className="text-[10px] sm:text-[11px] font-mono tracking-[0.3em] text-accent uppercase font-semibold"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  // STUDIO HEADQUARTERS
                </span>
              </div>

              <h2
                className="text-4xl sm:text-6xl lg:text-7xl font-heading font-black tracking-tight text-white leading-none"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                LET&apos;S <br />
                <span className="text-gradient">CREATE.</span>
              </h2>
            </div>

            <p className="text-text-secondary text-sm sm:text-base font-light leading-relaxed max-w-md">
              Whether you are recording a solo podcast, hosting a four-person panel, or launching a branded YouTube series, our studio team is ready.
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href="https://wa.me/94770000000?text=Hi%20Apex%20Studio,%20I%20would%20like%20to%20inquire%20about%20a%20podcast%20session."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary !py-3 !px-6 !text-xs justify-center"
              >
                <MessageSquare size={14} className="text-black" />
                <span>CHAT ON WHATSAPP →</span>
              </a>

              <a
                href="https://maps.google.com/?q=Colombo,Sri+Lanka"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline !py-3 !px-6 !text-xs justify-center"
              >
                <MapPin size={14} className="text-accent" />
                <span>OPEN IN GOOGLE MAPS →</span>
              </a>
            </div>
          </div>

          {/* Right Column: Studio Contact Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Location */}
            <div className="p-6 rounded-sm bg-[#101010] border border-white/[0.07] space-y-2">
              <div className="flex items-center gap-2 text-accent text-xs font-mono mb-1">
                <MapPin size={14} />
                <span className="uppercase tracking-widest font-semibold">Studio Location</span>
              </div>
              <h4 className="text-lg font-heading font-bold text-white">Colombo 07</h4>
              <p className="text-xs text-text-secondary font-light leading-relaxed">
                Soundstage Suite 4A, Creative Media Hub, Colombo, Western Province, Sri Lanka.
              </p>
            </div>

            {/* Operating Hours */}
            <div className="p-6 rounded-sm bg-[#101010] border border-white/[0.07] space-y-2">
              <div className="flex items-center gap-2 text-accent text-xs font-mono mb-1">
                <Clock size={14} />
                <span className="uppercase tracking-widest font-semibold">Opening Hours</span>
              </div>
              <h4 className="text-lg font-heading font-bold text-white">09:00 AM – 10:00 PM</h4>
              <p className="text-xs text-text-secondary font-light leading-relaxed">
                Monday through Sunday • Sessions by confirmed reservation • Asia/Colombo (UTC+05:30)
              </p>
            </div>

            {/* Direct Line */}
            <div className="p-6 rounded-sm bg-[#101010] border border-white/[0.07] space-y-2">
              <div className="flex items-center gap-2 text-accent text-xs font-mono mb-1">
                <Phone size={14} />
                <span className="uppercase tracking-widest font-semibold">Direct Phone</span>
              </div>
              <h4 className="text-lg font-heading font-bold text-white">+94 (11) 234-5678</h4>
              <p className="text-xs text-text-secondary font-light leading-relaxed">
                Studio line for scheduling and technical inquiries.
              </p>
            </div>

            {/* Electronic Mail */}
            <div className="p-6 rounded-sm bg-[#101010] border border-white/[0.07] space-y-2">
              <div className="flex items-center gap-2 text-accent text-xs font-mono mb-1">
                <Mail size={14} />
                <span className="uppercase tracking-widest font-semibold">Production Inquiries</span>
              </div>
              <h4 className="text-lg font-heading font-bold text-white">producer@apexstudio.lk</h4>
              <p className="text-xs text-text-secondary font-light leading-relaxed">
                Brand collaborations, custom set builds, and commercial quotes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
