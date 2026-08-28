"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  History,
  ShieldAlert,
  Clock,
  User,
  Radio,
  Sparkles,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { useAdminBookings } from "@/context/AdminBookingsContext";
import { STUDIO_TIMEZONE } from "@/lib/constants";

export default function AdminActivityPage() {
  const { activities, bookings } = useAdminBookings();
  const [filterType, setFilterType] = useState<string>("ALL");

  // Fallback if fresh session: synthesize activity from bookings
  const displayActivities =
    activities.length > 0
      ? activities
      : bookings.map((b) => ({
          id: `gen-${b.id}`,
          action: `Booking ${b.status}`,
          bookingId: b.id,
          details: `Session for ${b.customerName} on ${b.date} at ${b.startTime} (${b.service}).`,
          timestamp: b.createdAt,
          admin: "Producer Desk",
          type: "CREATE" as const,
        }));

  const filtered = displayActivities.filter(
    (act) => filterType === "ALL" || act.type === filterType
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
        <div>
          <span className="text-[10px] font-mono text-accent uppercase tracking-widest block mb-1">
            IMMUTABLE PRODUCTION AUDIT LOG
          </span>
          <h1 className="text-2xl sm:text-3xl font-heading font-black tracking-tight text-white flex items-center gap-3">
            ACTIVITY &amp; AUDIT TRAIL
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {["ALL", "STATUS", "RESCHEDULE", "EDIT", "PASS"].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-sm text-[10px] font-mono uppercase tracking-wider transition-all ${
                filterType === t
                  ? "bg-accent text-black font-bold"
                  : "bg-white/[0.03] border border-white/10 text-text-secondary hover:text-white"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Activity Timeline List */}
      <div className="border border-white/[0.08] rounded-sm bg-[#0c0c0c] p-6 shadow-xl space-y-4">
        {filtered.length === 0 ? (
          <p className="text-xs font-mono text-text-muted text-center py-10">
            No activity records matching filter.
          </p>
        ) : (
          <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/[0.06]">
            {filtered.map((act) => (
              <div key={act.id} className="relative pl-8 group">
                {/* Node point */}
                <span className="absolute left-1.5 top-3 w-3 h-3 rounded-full bg-accent/20 border-2 border-accent transform -translate-x-1/2 group-hover:scale-125 transition-transform" />

                <div className="p-4 rounded-sm bg-white/[0.02] border border-white/[0.04] hover:border-white/15 transition-all space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-heading font-bold text-white">
                        {act.action}
                      </span>
                      <Link
                        href={`/admin/bookings/${act.bookingId}`}
                        className="text-[11px] font-mono font-bold text-accent hover:underline"
                      >
                        [{act.bookingId}]
                      </Link>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] font-mono text-text-muted">
                      <span>{act.admin}</span>
                      <span>•</span>
                      <span>
                        {new Date(act.timestamp).toLocaleString([], {
                          timeZone: STUDIO_TIMEZONE,
                        })}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs font-mono text-text-secondary leading-relaxed">
                    {act.details}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
