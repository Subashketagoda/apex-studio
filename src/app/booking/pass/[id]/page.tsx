"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import {
  Download,
  Share2,
  CalendarPlus,
  MessageSquare,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Calendar,
  Users,
  ShieldCheck,
  Printer,
  Sparkles,
  Loader2,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";
import { Booking } from "@/lib/types/booking";
import { formatTo12Hour, STUDIO_TIMEZONE } from "@/lib/constants";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function BookingPassPage({ params }: PageProps) {
  const { id } = use(params);

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await fetch(`/api/bookings/${id}`);
        const json = await res.json();
        if (json.success && json.data) {
          setBooking(json.data);
        } else {
          setError(json.error || "Booking not found.");
        }
      } catch (err) {
        console.error("Pass fetch error:", err);
        setError("Failed to load booking pass.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  // Direct PNG Download
  const handleDownload = () => {
    if (!booking) return;
    const downloadUrl = `/api/bookings/${booking.id}/pass-image?download=true&v=${booking.version || 1}`;
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = `APEX-STUDIO-BOOKING-${booking.id}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Web Share API
  const handleShare = async () => {
    if (!booking) return;
    const passUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `APEX STUDIO VIP Pass — ${booking.id}`,
          text: `My VIP Studio Booking Pass for ${booking.service} at APEX STUDIO.`,
          url: passUrl,
        });
        return;
      } catch (err) {
        // Fallback to clipboard if share was cancelled or failed
      }
    }

    // Fallback: Copy link
    try {
      await navigator.clipboard.writeText(passUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      handleDownload();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-text-primary p-6">
        <Loader2 size={36} className="text-accent animate-spin mb-4" />
        <span className="text-xs font-mono tracking-widest text-text-muted">
          RENDERING DIGITAL VIP PASS...
        </span>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 text-text-primary">
        <div className="max-w-md w-full p-8 rounded-sm bg-[#0c0c0c] border border-white/10 text-center">
          <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto mb-4 text-rose-400">
            ✕
          </div>
          <h2 className="text-xl font-heading font-bold mb-2">PASS NOT FOUND</h2>
          <p className="text-xs text-text-secondary mb-6 font-mono">
            {error || "The requested booking record does not exist or has been removed."}
          </p>
          <Link href="/" className="btn-primary w-full justify-center !text-xs">
            Return to Apex Studio
          </Link>
        </div>
      </div>
    );
  }

  const passImageUrl = `/api/bookings/${booking.id}/pass-image?v=${booking.version || 1}`;
  const verifyUrl = `/booking/verify/${booking.id}?v=${booking.version || 1}`;

  return (
    <div className="min-h-screen bg-[#050505] text-text-primary py-8 sm:py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Top Navigation & Status Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono text-text-muted hover:text-accent transition-colors"
          >
            <ArrowLeft size={14} />
            <span>APEX STUDIO HOME</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono uppercase bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 px-3 py-1 rounded-sm flex items-center gap-1.5 shadow-[0_0_12px_rgba(34,197,94,0.2)]">
              <CheckCircle2 size={12} className="text-emerald-400" />
              {booking.status} • PASS ACTIVE (v{booking.version || 1})
            </span>
          </div>
        </div>

        {/* Action Controls Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* 1. Download PNG Button */}
          <button
            onClick={handleDownload}
            className="btn-primary !py-3 !px-4 !text-xs justify-center group shadow-lg shadow-accent/15"
          >
            <Download size={14} className="group-hover:-translate-y-0.5 transition-transform" />
            <span>DOWNLOAD PNG</span>
          </button>

          {/* 2. Share Pass Button */}
          <button
            onClick={handleShare}
            className="px-4 py-3 rounded-sm bg-white/[0.04] border border-white/10 hover:border-accent text-xs font-mono text-white flex items-center justify-center gap-2 transition-colors"
          >
            {copied ? <Check size={14} className="text-emerald-400" /> : <Share2 size={14} className="text-accent" />}
            <span>{copied ? "LINK COPIED!" : "SHARE PASS"}</span>
          </button>

          {/* 3. Print / Save PDF */}
          <button
            onClick={handlePrint}
            className="px-4 py-3 rounded-sm bg-white/[0.04] border border-white/10 hover:border-accent text-xs font-mono text-white flex items-center justify-center gap-2 transition-colors"
          >
            <Printer size={14} className="text-accent" />
            <span>PRINT / PDF</span>
          </button>

          {/* 4. WhatsApp Chat */}
          <a
            href={`https://wa.me/94771234567?text=${encodeURIComponent(
              `Hi Apex Studio, I have confirmed my booking: ${booking.id} for ${booking.service} on ${booking.date} at ${booking.startTime}.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-3 rounded-sm bg-white/[0.04] border border-white/10 hover:border-emerald-500/50 text-xs font-mono text-white flex items-center justify-center gap-2 transition-colors"
          >
            <MessageSquare size={14} className="text-emerald-400" />
            <span>PRODUCER CHAT</span>
          </a>
        </div>

        {/* Main High-Resolution Pass Display */}
        <div className="flex flex-col items-center">
          <div className="w-full max-w-xl rounded-md overflow-hidden border border-accent/40 shadow-[0_0_50px_rgba(56,189,248,0.15)] bg-[#0c0c0c] relative">
            {!imageLoaded && (
              <div className="aspect-[1200/1800] w-full flex flex-col items-center justify-center bg-[#0c0c0c] text-accent animate-pulse">
                <Loader2 size={32} className="animate-spin mb-3" />
                <span className="text-xs font-mono">Rendering High-Res Pass...</span>
              </div>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={passImageUrl}
              alt={`Apex Studio Booking Pass ${booking.id}`}
              className={`w-full h-auto object-contain transition-opacity duration-300 ${
                imageLoaded ? "opacity-100" : "opacity-0 absolute inset-0"
              }`}
              onLoad={() => setImageLoaded(true)}
            />
          </div>

          <p className="text-[11px] font-mono text-text-muted mt-4 text-center">
            Tip: You can screenshot or download this pass to present the QR code directly at reception.
          </p>
        </div>

        {/* Key Session Details Card */}
        <div className="p-6 rounded-sm bg-[#0c0c0c] border border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <span className="text-xs font-mono text-accent uppercase tracking-wider font-semibold">
              // SOUNDSTAGE RESERVATION SUMMARY
            </span>
            <Link
              href={verifyUrl}
              target="_blank"
              className="text-xs font-mono text-text-muted hover:text-accent flex items-center gap-1"
            >
              <span>Test Scanner</span>
              <ExternalLink size={11} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
            <div className="space-y-1">
              <span className="text-text-muted uppercase text-[10px] block">Customer Name</span>
              <span className="text-white font-bold">{booking.customerName}</span>
            </div>

            <div className="space-y-1">
              <span className="text-text-muted uppercase text-[10px] block">Service Package</span>
              <span className="text-accent">{booking.service}</span>
            </div>

            <div className="space-y-1">
              <span className="text-text-muted uppercase text-[10px] block">Scheduled Date</span>
              <span className="text-white">📅 {booking.date}</span>
            </div>

            <div className="space-y-1">
              <span className="text-text-muted uppercase text-[10px] block">Session Slot</span>
              <span className="text-white">
                ⏰ {formatTo12Hour(booking.startTime)} – {formatTo12Hour(booking.endTime)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
