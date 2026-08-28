"use client";

import { use, useEffect, useState } from "react";
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

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function BookingVerifyPage({ params }: PageProps) {
  const { id } = use(params);
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
      })
    );

    const fetchBooking = async () => {
      try {
        const res = await fetch(`/api/bookings/${id}`);
        const json = await res.json();
        if (json.success && json.data) {
          setBooking(json.data);
        } else {
          setError(json.error || "Booking credential not found.");
        }
      } catch (err) {
        console.error("Verification query error:", err);
        setError("Failed to query verification service.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-text-primary p-6">
        <Loader2 size={36} className="text-accent animate-spin mb-4" />
        <span className="text-xs font-mono tracking-widest text-text-muted">
          VERIFYING STUDIO CREDENTIAL...
        </span>
      </div>
    );
  }

  // Determine Verification Outcome
  const currentVersion = booking?.version || 1;
  const isOutdated = booking && scannedVersion !== null && scannedVersion < currentVersion;
  const isCancelled = booking?.status === "CANCELLED";
  const isConfirmed = booking?.status === "CONFIRMED" && !isOutdated;
  const isPending = booking?.status === "PENDING" && !isOutdated;

  return (
    <div className="min-h-screen bg-[#050505] text-text-primary flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-md w-full p-8 rounded-sm bg-[#0c0c0c] border border-white/10 shadow-2xl space-y-6">
        {/* Verification Status Card */}
        {booking && isConfirmed && (
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center mx-auto text-emerald-400 shadow-[0_0_25px_rgba(34,197,94,0.35)] animate-pulse">
              <CheckCircle2 size={36} />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-emerald-400 block font-bold">
                APEX STUDIO • SOUNDSTAGE ACCESS
              </span>
              <h1 className="text-2xl font-heading font-black text-white tracking-wider mt-1">
                BOOKING VERIFIED ✓
              </h1>
              <span className="text-xs font-mono text-emerald-300">
                Authorized VIP Session Pass (v{currentVersion})
              </span>
            </div>
          </div>
        )}

        {booking && isOutdated && (
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-amber-500/10 border-2 border-amber-500 flex items-center justify-center mx-auto text-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.35)]">
              <AlertTriangle size={36} />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-amber-400 block font-bold">
                SECURITY NOTICE
              </span>
              <h1 className="text-2xl font-heading font-black text-amber-400 tracking-wider mt-1">
                BOOKING PASS OUTDATED ⚠️
              </h1>
              <p className="text-xs font-mono text-text-secondary mt-1">
                Scanned version (v{scannedVersion}) has been superseded. Current active revision is (v{currentVersion}).
              </p>
            </div>
          </div>
        )}

        {booking && isCancelled && (
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-rose-500/10 border-2 border-rose-500 flex items-center justify-center mx-auto text-rose-400 shadow-[0_0_25px_rgba(239,68,68,0.35)]">
              <XCircle size={36} />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-rose-400 block font-bold">
                RESERVATION STATUS
              </span>
              <h1 className="text-2xl font-heading font-black text-rose-400 tracking-wider mt-1">
                BOOKING CANCELLED ✕
              </h1>
              <span className="text-xs font-mono text-text-muted">
                This studio slot is no longer reserved.
              </span>
            </div>
          </div>
        )}

        {booking && isPending && (
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-amber-500/10 border-2 border-amber-500/40 flex items-center justify-center mx-auto text-amber-300">
              <RefreshCw size={36} className="animate-spin" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-amber-400 block font-bold">
                PENDING APPROVAL
              </span>
              <h1 className="text-2xl font-heading font-black text-white tracking-wider mt-1">
                BOOKING PENDING ⏳
              </h1>
              <span className="text-xs font-mono text-text-secondary">
                Awaiting producer confirmation.
              </span>
            </div>
          </div>
        )}

        {(!booking || error) && (
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-rose-500/10 border-2 border-rose-500 flex items-center justify-center mx-auto text-rose-400">
              <XCircle size={36} />
            </div>
            <h1 className="text-xl font-heading font-bold text-white tracking-wider">
              INVALID BOOKING PASS
            </h1>
            <p className="text-xs font-mono text-text-muted">
              {error || "No matching studio reservation found."}
            </p>
          </div>
        )}

        {/* Current Active Session Details (Privacy-protected) */}
        {booking && (
          <div className="p-4 rounded-sm bg-white/[0.02] border border-white/[0.08] space-y-3 text-xs font-mono">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
              <span className="text-text-muted">BOOKING ID</span>
              <span className="text-accent font-bold">{booking.id}</span>
            </div>

            <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
              <span className="text-text-muted">SERVICE</span>
              <span className="text-white font-semibold text-right">{booking.service}</span>
            </div>

            <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
              <span className="text-text-muted">ACTIVE DATE</span>
              <span className="text-white">📅 {booking.date}</span>
            </div>

            <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
              <span className="text-text-muted">ACTIVE TIME</span>
              <span className="text-white">
                ⏰ {formatTo12Hour(booking.startTime)} – {formatTo12Hour(booking.endTime)}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
              <span className="text-text-muted">GUESTS</span>
              <span className="text-white">{booking.numberOfPeople} Person(s)</span>
            </div>

            <div className="flex items-center justify-between pt-1 text-[11px] text-text-muted">
              <span>SCAN TIMESTAMP</span>
              <span>{verifyTime} (Asia/Colombo)</span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-2 pt-2">
          {booking && (
            <Link
              href={`/booking/pass/${booking.id}`}
              className="btn-primary w-full justify-center !py-3 !text-xs"
            >
              <Ticket size={14} />
              <span>OPEN FULL DIGITAL PASS</span>
            </Link>
          )}

          <Link
            href="/"
            className="w-full px-4 py-2.5 rounded-sm bg-white/[0.03] border border-white/10 hover:border-accent text-xs font-mono text-text-secondary hover:text-white flex items-center justify-center gap-2 transition-colors"
          >
            <ArrowLeft size={13} />
            <span>Apex Studio Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
