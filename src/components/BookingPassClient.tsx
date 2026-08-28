"use client";

import { useEffect, useState } from "react";
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

interface BookingPassClientProps {
  id: string;
}

export default function BookingPassClient({ id }: BookingPassClientProps) {
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
    const downloadUrl = `/api/bookings/${id}/pass-image?download=true&v=${booking?.version || 1}`;
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `APEX-STUDIO-BOOKING-${id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Web Share API
  const handleShare = async () => {
    if (!booking) return;
    const shareData = {
      title: `APEX STUDIO Pass • ${booking.id}`,
      text: `Your confirmed studio session for ${booking.service} on ${booking.date} at ${formatTo12Hour(booking.startTime)}.`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      // Fallback: Copy link
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Add to Google Calendar
  const handleAddToCalendar = () => {
    if (!booking) return;
    const [startH, startM] = booking.startTime.split(":");
    const [endH, endM] = booking.endTime.split(":");

    // Build UTC / Asia/Colombo start and end strings
    const dateFormatted = booking.date.replace(/-/g, "");
    const startTimeFormatted = `${startH}${startM}00`;
    const endTimeFormatted = `${endH}${endM}00`;

    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      `APEX STUDIO — ${booking.service}`
    )}&dates=${dateFormatted}T${startTimeFormatted}/${dateFormatted}T${endTimeFormatted}&ctz=${encodeURIComponent(
      STUDIO_TIMEZONE
    )}&details=${encodeURIComponent(
      `Booking ID: ${booking.id}\nCustomer: ${booking.customerName}\nService: ${booking.service}\nGuests: ${booking.numberOfPeople}\n\nPresent your digital pass on arrival: ${window.location.href}`
    )}&location=${encodeURIComponent("APEX STUDIO, 42 Studio Boulevard, Colombo 07, Sri Lanka")}`;

    window.open(gcalUrl, "_blank");
  };

  // Producer WhatsApp Concierge
  const handleWhatsApp = () => {
    if (!booking) return;
    const msg = encodeURIComponent(
      `Hello APEX STUDIO, I have a confirmed booking: *${booking.id}* on *${booking.date}* at *${formatTo12Hour(
        booking.startTime
      )}* for ${booking.service}.`
    );
    window.open(`https://wa.me/94770000000?text=${msg}`, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-text-primary">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-accent" size={36} />
          <p className="font-mono text-xs text-text-muted tracking-wider">RETRIEVING VIP ACCESS PASS...</p>
        </div>
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
          <p className="text-xs text-text-secondary mb-6 font-mono">{error || "Could not retrieve this pass."}</p>
          <Link href="/" className="btn-primary w-full justify-center !text-xs !py-3">
            Return to Apex Studio
          </Link>
        </div>
      </div>
    );
  }

  const passImageUrl = `/api/bookings/${booking.id}/pass-image?v=${booking.version || 1}`;

  return (
    <div className="min-h-screen bg-[#050505] text-text-primary selection:bg-accent selection:text-black py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header navigation */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/[0.08]">
          <Link
            href="/"
            className="text-xs font-mono text-text-muted hover:text-accent flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft size={14} /> Back to Studio
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded flex items-center gap-1">
              <CheckCircle2 size={11} /> {booking.status}
            </span>
            <span className="text-[10px] font-mono text-text-muted bg-white/[0.04] px-2 py-0.5 rounded">
              v{booking.version || 1}
            </span>
          </div>
        </div>

        {/* Hero Header */}
        <div className="text-center mb-10 space-y-2">
          <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-accent flex items-center justify-center gap-1.5">
            <Sparkles size={13} /> OFFICIAL VIP ACCESS PASS
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black tracking-tight text-white">
            YOUR SESSION IS SECURED
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary max-w-lg mx-auto font-light">
            Present this digital or downloaded PNG pass upon arrival at APEX STUDIO soundstage.
          </p>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: 1200x1800 Image Pass Display */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div className="relative w-full max-w-[420px] aspect-[1200/1800] rounded-sm overflow-hidden border border-white/15 bg-gradient-to-b from-[#111111] to-[#080808] shadow-[0_20px_60px_rgba(0,0,0,0.8)] group">
              {/* Image loader spinner */}
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#0c0c0c]">
                  <Loader2 className="animate-spin text-accent" size={28} />
                </div>
              )}

              {/* The rendered 1200x1800 PNG Image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={passImageUrl}
                alt={`APEX STUDIO Pass ${booking.id}`}
                onLoad={() => setImageLoaded(true)}
                className={`w-full h-full object-contain transition-opacity duration-300 ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                }`}
              />

              {/* High-res label badge */}
              <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md px-2 py-1 rounded text-[9px] font-mono text-accent border border-accent/30 tracking-wider">
                1200 × 1800 HD
              </div>
            </div>

            <p className="text-[10px] font-mono text-text-muted mt-3 text-center">
              Generated in Asia/Colombo • Version {booking.version || 1}
            </p>
          </div>

          {/* Right: Quick Actions & Studio Details */}
          <div className="lg:col-span-5 space-y-6">
            {/* Download & Share Actions Card */}
            <div className="p-6 rounded-sm bg-[#0c0c0c] border border-white/10 space-y-3 shadow-xl">
              <h3 className="text-xs font-mono uppercase tracking-widest text-text-muted mb-3">
                PASS ACTIONS &amp; EXPORTS
              </h3>

              <button
                onClick={handleDownload}
                className="btn-primary w-full justify-center !py-3.5 !text-xs !tracking-wider flex items-center gap-2 shadow-lg shadow-accent/15"
              >
                <Download size={16} />
                DOWNLOAD PASS (PNG IMAGE)
              </button>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={handleShare}
                  className="px-4 py-2.5 rounded-sm bg-white/[0.04] border border-white/10 hover:border-accent text-xs font-mono text-text-secondary hover:text-white transition-colors flex items-center justify-center gap-1.5"
                >
                  {copied ? <Check size={14} className="text-emerald-400" /> : <Share2 size={14} />}
                  <span>{copied ? "COPIED!" : "SHARE PASS"}</span>
                </button>

                <button
                  onClick={() => window.print()}
                  className="px-4 py-2.5 rounded-sm bg-white/[0.04] border border-white/10 hover:border-accent text-xs font-mono text-text-secondary hover:text-white transition-colors flex items-center justify-center gap-1.5"
                >
                  <Printer size={14} />
                  <span>PRINT / PDF</span>
                </button>
              </div>

              <div className="pt-2 border-t border-white/[0.06] space-y-2">
                <button
                  onClick={handleAddToCalendar}
                  className="w-full px-4 py-2.5 rounded-sm bg-white/[0.03] border border-white/10 hover:border-accent text-xs font-mono text-text-secondary hover:text-white transition-colors flex items-center justify-center gap-2"
                >
                  <CalendarPlus size={14} className="text-accent" />
                  <span>Add to Google Calendar</span>
                </button>

                <button
                  onClick={handleWhatsApp}
                  className="w-full px-4 py-2.5 rounded-sm bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-xs font-mono text-emerald-300 transition-colors flex items-center justify-center gap-2"
                >
                  <MessageSquare size={14} />
                  <span>Chat with Producer (WhatsApp)</span>
                </button>
              </div>
            </div>

            {/* Session Metadata Card */}
            <div className="p-6 rounded-sm bg-[#0c0c0c] border border-white/10 space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-widest text-text-muted">
                SESSION SPECIFICATIONS
              </h3>

              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center py-1.5 border-b border-white/[0.04]">
                  <span className="text-text-secondary">Booking Reference</span>
                  <span className="text-accent font-bold">{booking.id}</span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-white/[0.04]">
                  <span className="text-text-secondary">Host / Producer</span>
                  <span className="text-white font-medium">{booking.customerName}</span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-white/[0.04]">
                  <span className="text-text-secondary">Production Package</span>
                  <span className="text-white font-medium text-right">{booking.service}</span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-white/[0.04]">
                  <span className="text-text-secondary">Date &amp; Time</span>
                  <span className="text-white font-medium text-right">
                    {booking.date} • {formatTo12Hour(booking.startTime)}
                  </span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-white/[0.04]">
                  <span className="text-text-secondary">Duration</span>
                  <span className="text-white font-medium">{booking.durationMinutes} Minutes</span>
                </div>

                <div className="flex justify-between items-center py-1.5">
                  <span className="text-text-secondary">Guest Count</span>
                  <span className="text-white font-medium">{booking.numberOfPeople} Guests</span>
                </div>
              </div>
            </div>

            {/* Arrival Protocol Instructions */}
            <div className="p-5 rounded-sm bg-white/[0.02] border border-white/[0.06] text-xs font-mono space-y-2">
              <span className="text-[10px] uppercase text-accent font-bold tracking-widest block">
                STUDIO ARRIVAL PROTOCOL
              </span>
              <ul className="space-y-1.5 text-text-secondary list-disc list-inside text-[11px] leading-relaxed">
                <li>Please arrive 15 minutes prior to start time for mic checks.</li>
                <li>Sound engineers will calibrate your levels and monitor mix.</li>
                <li>4K multi-cam ProRes RAW footage delivered within 24 hours.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
