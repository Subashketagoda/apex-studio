"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Calendar,
  Clock,
  User,
  Users,
  ShieldCheck,
  ArrowLeft,
  Ticket,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { Booking } from "@/lib/types/booking";
import { formatTo12Hour, STUDIO_TIMEZONE } from "@/lib/constants";

interface BookingVerifyClientProps {
  id: string;
}

export default function BookingVerifyClient({ id }: BookingVerifyClientProps) {
  const searchParams = useSearchParams();
  const scannedVersionStr = searchParams.get("v");
  const scannedVersion = scannedVersionStr ? parseInt(scannedVersionStr, 10) : null;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [verifyTime, setVerifyTime] = useState("");

  useEffect(() => {
    // Current timestamp in Asia/Colombo
    setVerifyTime(
      new Date().toLocaleTimeString("en-US", {
        timeZone: STUDIO_TIMEZONE,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      })
    );

    const verifyBooking = async () => {
      try {
        const res = await fetch(`/api/bookings/${id}`);
        const json = await res.json();
        if (json.success && json.data) {
          setBooking(json.data);
        } else {
          setError(json.error || "Booking not found in database.");
        }
      } catch (err) {
        console.error("Verification API error:", err);
        setError("Network error: Could not verify with APEX STUDIO database.");
      } finally {
        setLoading(false);
      }
    };

    verifyBooking();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 text-text-primary">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-accent" size={40} />
          <p className="font-mono text-xs text-text-muted tracking-widest uppercase">
            AUDITING DIGITAL PASS WITH FIRESTORE...
          </p>
        </div>
      </div>
    );
  }

  // Determine pass status logic
  const isCancelled = booking?.status === "CANCELLED";
  const isCurrentVersion =
    scannedVersion === null || (booking && booking.version === scannedVersion);
  const isOutdated = !isCurrentVersion;
  const isVerified = booking && !isCancelled && isCurrentVersion;

  return (
    <div className="min-h-screen bg-[#050505] text-text-primary flex items-center justify-center p-4 sm:p-6 selection:bg-accent selection:text-black">
      <div className="max-w-xl w-full">
        {/* Verification Card */}
        <div
          className={`p-6 sm:p-8 rounded-sm bg-[#0c0c0c] border shadow-2xl transition-all ${
            isVerified
              ? "border-emerald-500/50 shadow-[0_0_50px_rgba(16,185,129,0.15)]"
              : isOutdated
              ? "border-amber-500/50 shadow-[0_0_50px_rgba(245,158,11,0.15)]"
              : "border-rose-500/50 shadow-[0_0_50px_rgba(244,63,94,0.15)]"
          }`}
        >
          {/* Top Logo / Studio Brand */}
          <div className="text-center pb-6 border-b border-white/[0.08] mb-6">
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-text-muted block mb-1">
              APEX STUDIO SOUNDSTAGE VERIFICATION
            </span>
            <h1 className="text-xl font-heading font-black tracking-wider text-white">
              STUDIO PASS AUTHENTICATION
            </h1>
          </div>

          {/* Status Banner */}
          {isVerified && (
            <div className="p-4 rounded-sm bg-emerald-950/40 border border-emerald-500/40 flex items-center gap-3.5 mb-6">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <h2 className="text-sm font-heading font-bold text-emerald-300 tracking-wider">
                  BOOKING VERIFIED &amp; VALID ✓
                </h2>
                <p className="text-[11px] text-emerald-400/80 font-mono">
                  Active session in database • Version {booking.version || 1}
                </p>
              </div>
            </div>
          )}

          {isOutdated && (
            <div className="p-4 rounded-sm bg-amber-950/40 border border-amber-500/40 flex items-center gap-3.5 mb-6">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h2 className="text-sm font-heading font-bold text-amber-300 tracking-wider">
                  ⚠️ BOOKING PASS OUTDATED
                </h2>
                <p className="text-[11px] text-amber-400/80 font-mono">
                  This booking was rescheduled. Scanned version: v{scannedVersion} | Current active version: v
                  {booking?.version}
                </p>
              </div>
            </div>
          )}

          {(isCancelled || error || !booking) && (
            <div className="p-4 rounded-sm bg-rose-950/40 border border-rose-500/40 flex items-center gap-3.5 mb-6">
              <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
                <XCircle size={24} />
              </div>
              <div>
                <h2 className="text-sm font-heading font-bold text-rose-300 tracking-wider">
                  {isCancelled ? "BOOKING CANCELLED / INVALID" : "PASS NOT RECOGNIZED"}
                </h2>
                <p className="text-[11px] text-rose-400/80 font-mono">
                  {isCancelled
                    ? "This reservation has been cancelled in studio records."
                    : error || "No active reservation matching this reference."}
                </p>
              </div>
            </div>
          )}

          {/* Booking Data Grid */}
          {booking && (
            <div className="space-y-3 font-mono text-xs mb-6">
              <div className="flex justify-between items-center py-2 border-b border-white/[0.04]">
                <span className="text-text-muted">Booking Reference</span>
                <span className="text-accent font-bold tracking-wider">{booking.id}</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-white/[0.04]">
                <span className="text-text-muted">Client / Producer</span>
                <span className="text-white font-medium">{booking.customerName}</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-white/[0.04]">
                <span className="text-text-muted">Production Package</span>
                <span className="text-white font-medium">{booking.service}</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-white/[0.04]">
                <span className="text-text-muted">Scheduled Date</span>
                <span className="text-white font-medium">{booking.date}</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-white/[0.04]">
                <span className="text-text-muted">Time &amp; Duration</span>
                <span className="text-white font-medium">
                  {formatTo12Hour(booking.startTime)} – {formatTo12Hour(booking.endTime)} ({booking.durationMinutes}m)
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-white/[0.04]">
                <span className="text-text-muted">Guest Count</span>
                <span className="text-white font-medium">{booking.numberOfPeople} People</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-white/[0.04]">
                <span className="text-text-muted">Studio Status</span>
                <span
                  className={`font-bold uppercase ${
                    booking.status === "CONFIRMED"
                      ? "text-emerald-400"
                      : booking.status === "PENDING"
                      ? "text-amber-400"
                      : "text-rose-400"
                  }`}
                >
                  {booking.status}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-white/[0.04]">
                <span className="text-text-muted">Audit Timestamp</span>
                <span className="text-text-secondary">{verifyTime} (Asia/Colombo)</span>
              </div>
            </div>
          )}

          {/* Action Links */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-white/[0.06]">
            {booking && (
              <Link
                href={`/booking/pass/${booking.id}`}
                className="btn-primary flex-1 justify-center !py-3 !text-xs"
              >
                <Ticket size={14} className="mr-1.5" /> View Digital Pass
              </Link>
            )}

            <Link
              href="/"
              className="px-4 py-3 rounded-sm bg-white/[0.04] border border-white/10 hover:border-accent text-xs font-mono text-text-secondary hover:text-white transition-colors flex items-center justify-center gap-1.5 flex-1"
            >
              <ArrowLeft size={14} /> Back to Studio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
