"use client";

import React, { useRef } from "react";
import {
  Radio,
  Flame,
  QrCode,
  Sparkles,
  Calendar,
  Clock,
  User,
  Users,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { Booking } from "@/lib/types/booking";
import { formatTo12Hour, STUDIO_TIMEZONE } from "@/lib/constants";

interface DigitalPassCardProps {
  booking: Booking;
  className?: string;
  showDownloadBtn?: boolean;
}

export default function DigitalPassCard({
  booking,
  className = "",
}: DigitalPassCardProps) {
  const passRef = useRef<HTMLDivElement>(null);

  // Generate QR verification URL
  const verifyUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/booking/verify/${booking.id}?v=${booking.version || 1}`
      : `https://subashketagoda.github.io/apex-studio/booking/verify/${booking.id}?v=${booking.version || 1}`;

  // QR Code image using reliable public QR SVG API
  const qrCodeApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
    verifyUrl
  )}&bgcolor=0c0c0c&color=38bdf8&margin=0`;

  return (
    <div
      ref={passRef}
      className={`relative w-full max-w-[380px] aspect-[1200/1800] rounded-sm overflow-hidden border border-white/20 bg-gradient-to-b from-[#141414] via-[#0c0c0c] to-[#050505] p-6 text-white flex flex-col justify-between shadow-[0_25px_60px_rgba(0,0,0,0.9)] select-none ${className}`}
    >
      {/* Top Ambient Glow */}
      <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 bg-accent/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Studio Header */}
      <div className="relative z-10 space-y-2 border-b border-white/10 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-sm bg-accent/15 border border-accent flex items-center justify-center text-accent shadow-[0_0_15px_rgba(56,189,248,0.4)]">
              <Radio size={14} className="animate-pulse" />
            </div>
            <div>
              <span className="text-xs font-heading font-black tracking-widest text-white block">
                APEX STUDIO
              </span>
              <span className="text-[8px] font-mono text-text-muted tracking-widest uppercase block">
                SOUNDSTAGE ACCESS
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[9px] font-mono text-accent bg-accent/10 border border-accent/30 px-2 py-0.5 rounded font-bold block">
              REVISION v{booking.version || 1}
            </span>
          </div>
        </div>
      </div>

      {/* Pass Title & Service */}
      <div className="relative z-10 my-2 space-y-1">
        <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-accent flex items-center gap-1">
          <Sparkles size={10} /> VIP PRODUCTION PASS
        </span>
        <h3 className="text-base sm:text-lg font-heading font-black text-white leading-tight">
          {booking.service}
        </h3>
        <p className="text-[10px] font-mono text-text-secondary">
          Colombo 07 Soundstage • 4K Sony Multi-Cam Rig
        </p>
      </div>

      {/* Center QR Code Box */}
      <div className="relative z-10 my-auto flex flex-col items-center">
        <div className="p-3.5 rounded-sm bg-[#0c0c0c] border border-white/15 shadow-2xl relative group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={qrCodeApiUrl}
            alt={`QR Code ${booking.id}`}
            className="w-36 h-36 sm:w-40 sm:h-40 object-contain rounded-xs"
          />
          <div className="absolute inset-0 border border-accent/40 rounded-sm pointer-events-none animate-pulse" />
        </div>
        <span className="text-[9px] font-mono text-text-muted mt-2 tracking-widest uppercase">
          SCAN FOR DOOR ENTRY
        </span>
      </div>

      {/* Session Details Matrix */}
      <div className="relative z-10 space-y-2 border-t border-b border-white/10 py-3 font-mono text-xs">
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white/[0.03] border border-white/[0.06] p-2 rounded-sm">
            <span className="text-[8px] text-text-muted uppercase block">REFERENCE ID</span>
            <span className="text-accent font-bold text-xs">{booking.id}</span>
          </div>

          <div className="bg-white/[0.03] border border-white/[0.06] p-2 rounded-sm">
            <span className="text-[8px] text-text-muted uppercase block">HOST / PRODUCER</span>
            <span className="text-white font-bold text-xs truncate block">{booking.customerName}</span>
          </div>

          <div className="bg-white/[0.03] border border-white/[0.06] p-2 rounded-sm">
            <span className="text-[8px] text-text-muted uppercase block">DATE</span>
            <span className="text-white text-xs">{booking.date}</span>
          </div>

          <div className="bg-white/[0.03] border border-white/[0.06] p-2 rounded-sm">
            <span className="text-[8px] text-text-muted uppercase block">TIME ({STUDIO_TIMEZONE})</span>
            <span className="text-white text-xs">{formatTo12Hour(booking.startTime)}</span>
          </div>
        </div>
      </div>

      {/* Bottom Barcode / Audio Waveform Footer */}
      <div className="relative z-10 pt-2 flex items-center justify-between font-mono text-[9px] text-text-muted">
        <div className="flex items-center gap-1 text-emerald-400">
          <CheckCircle2 size={11} />
          <span className="font-bold uppercase tracking-wider">{booking.status}</span>
        </div>
        <div className="tracking-[0.2em] uppercase text-text-muted">
          // APEX-VERIFIED //
        </div>
      </div>
    </div>
  );
}
