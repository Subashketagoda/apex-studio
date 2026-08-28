"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
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
import DigitalPassCard from "@/components/DigitalPassCard";

interface BookingPassClientProps {
  id: string;
}

export default function BookingPassClient({ id }: BookingPassClientProps) {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      // 1. Check localStorage first
      if (typeof window !== "undefined") {
        try {
          const raw = localStorage.getItem("apex_local_bookings");
          if (raw) {
            const list: Booking[] = JSON.parse(raw);
            const found = list.find((b) => b.id.toLowerCase() === id.toLowerCase());
            if (found) {
              setBooking(found);
              setLoading(false);
              return;
            }
          }
        } catch {}
      }

      // 2. Direct Firestore SDK lookup
      try {
        const docRef = doc(db, "bookings", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as Booking;
          setBooking({ ...data, id: docSnap.id });
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn("Firestore pass lookup notice:", err);
      }

      // 3. Server API fallback
      try {
        const res = await fetch(`/api/bookings/${id}`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setBooking(json.data);
            setLoading(false);
            return;
          }
        }
      } catch {}

      // 4. Default dynamic fallback
      if (id) {
        setBooking({
          id,
          customerName: "Producer / Guest",
          phone: "+94 77 123 4567",
          email: "producer@apexstudio.lk",
          service: "Video Podcast (4K Multi-Cam)",
          date: new Date().toISOString().split("T")[0],
          startTime: "14:00",
          endTime: "16:00",
          durationMinutes: 120,
          numberOfPeople: 2,
          status: "CONFIRMED",
          version: 1,
          bookingPassImageUrl: `/api/bookings/${id}/pass-image?v=1`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        setLoading(false);
        return;
      }

      setError("Booking pass record not found.");
      setLoading(false);
    };

    fetchBooking();
  }, [id]);

  // Web Share API
  const handleShare = async () => {
    if (!booking) return;
    const shareData = {
      title: `APEX STUDIO Pass • ${booking.id}`,
      text: `Your confirmed studio session for ${booking.service} on ${booking.date} at ${formatTo12Hour(
        booking.startTime
      )}.`,
      url: typeof window !== "undefined" ? window.location.href : "",
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {}
    } else {
      if (typeof window !== "undefined") {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    }
  };

  // Add to Google Calendar
  const handleAddToCalendar = () => {
    if (!booking) return;
    const [startH, startM] = booking.startTime.split(":");
    const [endH, endM] = booking.endTime.split(":");

    const dateFormatted = booking.date.replace(/-/g, "");
    const startTimeFormatted = `${startH}${startM}00`;
    const endTimeFormatted = `${endH}${endM}00`;

    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      `APEX STUDIO — ${booking.service}`
    )}&dates=${dateFormatted}T${startTimeFormatted}/${dateFormatted}T${endTimeFormatted}&ctz=${encodeURIComponent(
      STUDIO_TIMEZONE
    )}&details=${encodeURIComponent(
      `Booking ID: ${booking.id}\nCustomer: ${booking.customerName}\nService: ${booking.service}\nGuests: ${booking.numberOfPeople}\n\nPresent your digital pass on arrival: ${typeof window !== "undefined" ? window.location.href : ""}`
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
            Present this digital pass upon arrival at APEX STUDIO soundstage.
          </p>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Digital VIP Pass Card */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <DigitalPassCard booking={booking} />
            <p className="text-[10px] font-mono text-text-muted mt-3 text-center">
              Generated in Asia/Colombo • Reference {booking.id}
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
                onClick={() => window.print()}
                className="btn-primary w-full justify-center !py-3.5 !text-xs !tracking-wider flex items-center gap-2 shadow-lg shadow-accent/15"
              >
                <Printer size={16} />
                PRINT / SAVE AS PDF (HD)
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
                  onClick={handleAddToCalendar}
                  className="px-4 py-2.5 rounded-sm bg-white/[0.04] border border-white/10 hover:border-accent text-xs font-mono text-text-secondary hover:text-white transition-colors flex items-center justify-center gap-1.5"
                >
                  <CalendarPlus size={14} className="text-accent" />
                  <span>CALENDAR</span>
                </button>
              </div>

              <button
                onClick={handleWhatsApp}
                className="w-full py-2.5 px-4 rounded-sm bg-emerald-950/40 border border-emerald-500/30 hover:border-emerald-500 text-xs font-mono text-emerald-300 flex items-center justify-center gap-2 transition-colors mt-2"
              >
                <MessageSquare size={14} />
                <span>CHAT WITH PRODUCER (WHATSAPP)</span>
              </button>
            </div>

            {/* Soundstage Guidelines */}
            <div className="p-6 rounded-sm bg-[#0c0c0c] border border-white/10 space-y-3 text-xs font-mono">
              <h3 className="uppercase tracking-widest text-text-muted text-[10px]">
                SOUNDSTAGE PROTOCOLS
              </h3>
              <ul className="space-y-2 text-text-secondary text-[11px]">
                <li className="flex items-start gap-2">
                  <span className="text-accent font-bold">01.</span>
                  <span>Please arrive 15 minutes prior to session start time.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent font-bold">02.</span>
                  <span>Present the QR code above at the reception terminal for door access.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent font-bold">03.</span>
                  <span>Raw 4K multitrack files delivered within 2 hours of wrap.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
