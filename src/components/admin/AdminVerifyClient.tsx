"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Search,
  QrCode,
  Calendar,
  Clock,
  User,
  Users,
  Radio,
  Sparkles,
  ArrowLeft,
  ExternalLink,
  Camera,
} from "lucide-react";
import { useAdminBookings } from "@/context/AdminBookingsContext";
import { formatTo12Hour, STUDIO_TIMEZONE } from "@/lib/constants";
import CameraQRScanner from "@/components/admin/CameraQRScanner";

export default function AdminVerifyClient() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get("id") || "";
  const initialVersion = searchParams.get("v");

  const { bookings, loading } = useAdminBookings();

  const [searchId, setSearchId] = useState(initialId);
  const [activeQuery, setActiveQuery] = useState(initialId);
  const [cameraActive, setCameraActive] = useState(false);

  useEffect(() => {
    if (initialId) {
      setSearchId(initialId);
      setActiveQuery(initialId);
    }
  }, [initialId]);

  const handleVerify = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchId.trim()) return;
    const cleanId = searchId.trim().replace(/^.*\/booking\/verify\//, "").replace(/\?.*$/, "");
    setActiveQuery(cleanId);
  };

  const handleCameraScan = (decodedText: string) => {
    setCameraActive(false);
    // Parse decoded text (could be full URL or direct ID)
    const match = decodedText.match(/\/booking\/verify\/([A-Za-z0-9\-_]+)/i) || decodedText.match(/(APX-[A-Za-z0-9\-_]+)/i);
    const cleanId = match ? match[1] : decodedText.trim();
    setSearchId(cleanId);
    setActiveQuery(cleanId);
  };

  const booking = bookings.find((b) => b.id.toLowerCase() === activeQuery.trim().toLowerCase());

  // Determine pass integrity
  let verificationStatus: "VERIFIED" | "OUTDATED" | "CANCELLED" | "NOT_FOUND" | "IDLE" = "IDLE";
  if (activeQuery.trim()) {
    if (!booking) {
      verificationStatus = "NOT_FOUND";
    } else if (booking.status === "CANCELLED") {
      verificationStatus = "CANCELLED";
    } else if (initialVersion && Number(initialVersion) < (booking.version || 1)) {
      verificationStatus = "OUTDATED";
    } else {
      verificationStatus = "VERIFIED";
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="text-center space-y-2 pb-4 border-b border-white/[0.06]">
        <div className="w-12 h-12 rounded-full bg-accent/10 border border-accent flex items-center justify-center mx-auto text-accent shadow-[0_0_20px_rgba(56,189,248,0.25)]">
          <QrCode size={24} />
        </div>
        <h1 className="text-2xl font-heading font-black tracking-tight text-white">
          SOUNDSTAGE DOOR ACCESS CONTROL
        </h1>
        <p className="text-xs font-mono text-text-muted">
          Scan guest VIP QR pass or enter Booking Reference ID for door check-in.
        </p>
      </div>

      {/* Camera Scanner Toggle / Viewfinder */}
      {cameraActive ? (
        <CameraQRScanner
          onScanSuccess={handleCameraScan}
          onClose={() => setCameraActive(false)}
        />
      ) : (
        <button
          type="button"
          onClick={() => setCameraActive(true)}
          className="btn-primary w-full justify-center !py-3.5 !text-xs !tracking-wider flex items-center gap-2 shadow-lg shadow-accent/25"
        >
          <Camera size={16} />
          <span>OPEN CAMERA QR SCANNER</span>
        </button>
      )}

      {/* Manual ID / URL Scan Input */}
      <form onSubmit={handleVerify} className="p-4 rounded-sm bg-[#0c0c0c] border border-white/[0.08] shadow-lg flex gap-2">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Enter APX-XXXX or Paste QR URL..."
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/10 rounded-sm pl-10 pr-3 py-3 text-xs sm:text-sm text-white font-mono placeholder:text-text-muted focus:border-accent focus:outline-none"
          />
        </div>
        <button type="submit" className="btn-primary !text-xs !py-3 !px-5 whitespace-nowrap">
          VERIFY ID
        </button>
      </form>

      {/* Verification Results Display */}
      {activeQuery && (
        <div className="animate-in fade-in zoom-in-95 duration-200">
          {verificationStatus === "VERIFIED" && booking && (
            <div className="p-6 rounded-sm bg-[#0c0c0c] border border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.15)] space-y-6">
              <div className="flex items-center gap-3 border-b border-emerald-500/20 pb-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-emerald-400">
                  <CheckCircle size={28} />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-widest block">
                    ACCESS GRANTED
                  </span>
                  <h2 className="text-xl font-heading font-black text-white">
                    BOOKING VERIFIED ✓
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                <div className="p-3 rounded bg-white/[0.02] border border-white/[0.04]">
                  <span className="text-[10px] text-text-muted uppercase block">Booking ID</span>
                  <span className="text-white font-bold text-sm">{booking.id}</span>
                </div>

                <div className="p-3 rounded bg-white/[0.02] border border-white/[0.04]">
                  <span className="text-[10px] text-text-muted uppercase block">Pass Version</span>
                  <span className="text-accent font-bold">Revision v{booking.version || 1}</span>
                </div>

                <div className="p-3 rounded bg-white/[0.02] border border-white/[0.04]">
                  <span className="text-[10px] text-text-muted uppercase block">Guest / Host</span>
                  <span className="text-white font-bold">{booking.customerName}</span>
                </div>

                <div className="p-3 rounded bg-white/[0.02] border border-white/[0.04]">
                  <span className="text-[10px] text-text-muted uppercase block">Guests Count</span>
                  <span className="text-white">{booking.numberOfPeople} People</span>
                </div>

                <div className="p-3 rounded bg-white/[0.02] border border-white/[0.04] col-span-2">
                  <span className="text-[10px] text-text-muted uppercase block">Scheduled Date &amp; Time</span>
                  <span className="text-white font-bold">
                    {booking.date} • {formatTo12Hour(booking.startTime)} – {formatTo12Hour(booking.endTime)} ({STUDIO_TIMEZONE})
                  </span>
                </div>

                <div className="p-3 rounded bg-white/[0.02] border border-white/[0.04] col-span-2">
                  <span className="text-[10px] text-text-muted uppercase block">Production Package</span>
                  <span className="text-accent font-bold">{booking.service}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-white/[0.06]">
                <Link
                  href={`/admin/bookings/${booking.id}`}
                  className="btn-primary flex-1 justify-center !text-xs !py-2.5"
                >
                  Open Full Booking Inspector →
                </Link>
                <Link
                  href={`/booking/pass/${booking.id}`}
                  target="_blank"
                  className="px-4 py-2.5 rounded bg-white/[0.04] border border-white/10 hover:border-accent text-xs font-mono text-text-secondary hover:text-white"
                >
                  Digital Pass ↗
                </Link>
              </div>
            </div>
          )}

          {verificationStatus === "OUTDATED" && booking && (
            <div className="p-6 rounded-sm bg-[#0c0c0c] border border-amber-500/40 shadow-[0_0_30px_rgba(245,158,11,0.15)] space-y-4">
              <div className="flex items-center gap-3 border-b border-amber-500/20 pb-4">
                <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500 flex items-center justify-center text-amber-400">
                  <AlertTriangle size={28} />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-widest block">
                    REVISION MISMATCH
                  </span>
                  <h2 className="text-xl font-heading font-black text-white">
                    ⚠️ BOOKING PASS OUTDATED
                  </h2>
                </div>
              </div>

              <p className="text-xs font-mono text-text-secondary leading-relaxed">
                The scanned pass was issued for an earlier revision. The booking has since been rescheduled or modified.
              </p>

              <div className="p-3 rounded bg-amber-500/10 border border-amber-500/30 text-xs font-mono text-amber-200">
                Current active revision is <strong>v{booking.version || 1}</strong> (Scheduled for {booking.date} at {formatTo12Hour(booking.startTime)}).
              </div>

              <Link
                href={`/admin/bookings/${booking.id}`}
                className="btn-primary w-full justify-center !text-xs !py-2.5 block text-center"
              >
                Inspect Updated Booking →
              </Link>
            </div>
          )}

          {verificationStatus === "CANCELLED" && (
            <div className="p-6 rounded-sm bg-[#0c0c0c] border border-rose-500/40 shadow-[0_0_30px_rgba(244,63,94,0.15)] space-y-4">
              <div className="flex items-center gap-3 border-b border-rose-500/20 pb-4">
                <div className="w-12 h-12 rounded-full bg-rose-500/20 border border-rose-500 flex items-center justify-center text-rose-400">
                  <XCircle size={28} />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-rose-400 font-bold uppercase tracking-widest block">
                    ACCESS DENIED
                  </span>
                  <h2 className="text-xl font-heading font-black text-white">
                    ❌ BOOKING CANCELLED
                  </h2>
                </div>
              </div>
              <p className="text-xs font-mono text-rose-300">
                This reservation was previously cancelled. Studio entry is not permitted.
              </p>
            </div>
          )}

          {verificationStatus === "NOT_FOUND" && (
            <div className="p-6 rounded-sm bg-[#0c0c0c] border border-white/15 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto text-text-muted">
                ✕
              </div>
              <h2 className="text-lg font-heading font-bold text-white">
                ❌ BOOKING NOT FOUND
              </h2>
              <p className="text-xs font-mono text-text-muted">
                No reservation matches &quot;{activeQuery}&quot;. Please verify the Reference ID on the customer receipt.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
