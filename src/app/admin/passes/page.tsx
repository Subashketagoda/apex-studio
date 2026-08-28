"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Ticket,
  Download,
  RefreshCw,
  Search,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Layers,
  Sparkles,
} from "lucide-react";
import { useAdminBookings } from "@/context/AdminBookingsContext";
import { formatTo12Hour } from "@/lib/constants";
import { downloadPassAsPNG } from "@/lib/utils/downloadPassImage";
import DigitalPassCard from "@/components/DigitalPassCard";

export default function AdminPassesPage() {
  const { bookings, loading, regeneratePass, refreshBookings } = useAdminBookings();

  const [searchTerm, setSearchTerm] = useState("");
  const [regenLoadingId, setRegenLoadingId] = useState<string | null>(null);

  const filteredPasses = bookings.filter((b) => {
    const q = searchTerm.toLowerCase();
    return (
      !q ||
      b.id.toLowerCase().includes(q) ||
      b.customerName.toLowerCase().includes(q) ||
      b.service.toLowerCase().includes(q)
    );
  });

  const handleRegen = async (id: string) => {
    setRegenLoadingId(id);
    await regeneratePass(id);
    setRegenLoadingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
        <div>
          <span className="text-[10px] font-mono text-accent uppercase tracking-widest block mb-1">
            VIP ACCESS CREDENTIALS
          </span>
          <h1 className="text-2xl sm:text-3xl font-heading font-black tracking-tight text-white flex items-center gap-3">
            DIGITAL PASSES VAULT
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-text-muted">
            <strong className="text-white">{bookings.length}</strong> active passes in storage
          </span>
          <button
            onClick={refreshBookings}
            className="px-3 py-1.5 rounded-sm bg-white/[0.04] border border-white/10 hover:border-accent text-xs font-mono text-white flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw size={12} className={loading ? "animate-spin text-accent" : ""} />
            Sync
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-sm bg-[#0c0c0c] border border-white/[0.08] shadow-lg">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search passes by Booking ID, customer name, service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/10 rounded-sm pl-9 pr-3 py-2 text-xs text-white font-mono placeholder:text-text-muted focus:border-accent focus:outline-none"
          />
        </div>
      </div>

      {/* Passes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPasses.map((b) => {
          const passImageUrl = `/api/bookings/${b.id}/pass-image?v=${b.version || 1}`;
          const isRegen = regenLoadingId === b.id;

          return (
            <div
              key={b.id}
              className="p-5 rounded-sm bg-[#0c0c0c] border border-white/[0.08] hover:border-white/20 transition-all flex flex-col justify-between space-y-4 shadow-xl group"
            >
              {/* Top Meta */}
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-heading font-black text-white">{b.id}</span>
                    <span className="text-[10px] font-mono text-accent bg-accent/10 border border-accent/30 px-1.5 py-0.5 rounded font-bold">
                      REVISION v{b.version || 1}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-white font-medium mt-0.5">{b.customerName}</p>
                </div>

                <span
                  className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                    b.status === "CONFIRMED"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                      : b.status === "PENDING"
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                      : "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                  }`}
                >
                  {b.status}
                </span>
              </div>

              {/* Pass Thumbnail Container */}
              <div className="flex justify-center overflow-hidden py-1">
                <DigitalPassCard booking={b} className="!max-w-[280px]" />
              </div>

              {/* Session Specs */}
              <div className="space-y-1 font-mono text-[11px] text-text-secondary border-t border-white/[0.04] pt-3">
                <div className="flex justify-between">
                  <span className="text-text-muted">Package:</span>
                  <span className="text-white truncate max-w-[160px]">{b.service}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Date &amp; Time:</span>
                  <span className="text-white">
                    {b.date} • {formatTo12Hour(b.startTime)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => downloadPassAsPNG(b)}
                  className="btn-primary w-full justify-center !py-2.5 !text-xs flex items-center gap-1.5"
                >
                  <Download size={13} /> DOWNLOAD HD PASS (PNG)
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href={`/booking/pass/${b.id}`}
                    target="_blank"
                    className="py-1.5 px-2 rounded bg-white/[0.03] border border-white/10 hover:border-accent text-[11px] font-mono text-text-secondary hover:text-white text-center flex items-center justify-center gap-1"
                  >
                    <ExternalLink size={11} /> Open Pass
                  </Link>

                  <button
                    disabled={isRegen}
                    onClick={() => handleRegen(b.id)}
                    className="py-1.5 px-2 rounded bg-white/[0.03] border border-white/10 hover:border-accent text-[11px] font-mono text-accent text-center flex items-center justify-center gap-1"
                    title="Generate new pass revision"
                  >
                    <RefreshCw size={11} className={isRegen ? "animate-spin" : ""} />
                    {isRegen ? "Regenerating..." : "Regen Pass"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
