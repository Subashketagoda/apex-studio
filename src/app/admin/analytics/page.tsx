"use client";

import React, { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Calendar,
  Layers,
  Flame,
  Radio,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { useAdminBookings } from "@/context/AdminBookingsContext";

export default function AdminAnalyticsPage() {
  const { bookings, loading } = useAdminBookings();
  const [range, setRange] = useState<"7d" | "30d" | "90d" | "all">("30d");

  // Filter bookings based on date range
  const now = new Date();
  const filtered = bookings.filter((b) => {
    if (range === "all") return true;
    const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;
    const diffTime = Math.abs(now.getTime() - new Date(b.createdAt).getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= days;
  });

  // Aggregations
  const total = filtered.length;
  const confirmed = filtered.filter((b) => b.status === "CONFIRMED").length;
  const cancelled = filtered.filter((b) => b.status === "CANCELLED").length;
  const completed = filtered.filter((b) => b.status === "COMPLETED").length;
  const pending = filtered.filter((b) => b.status === "PENDING").length;

  // Service breakdown
  const serviceCounts: Record<string, number> = {};
  filtered.forEach((b) => {
    serviceCounts[b.service] = (serviceCounts[b.service] || 0) + 1;
  });

  // Time slot distribution
  const hourCounts: Record<string, number> = {};
  filtered.forEach((b) => {
    const hour = b.startTime.split(":")[0] + ":00";
    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
        <div>
          <span className="text-[10px] font-mono text-accent uppercase tracking-widest block mb-1">
            INTELLIGENCE &amp; PERFORMANCE
          </span>
          <h1 className="text-2xl sm:text-3xl font-heading font-black tracking-tight text-white flex items-center gap-3">
            STUDIO ANALYTICS
          </h1>
        </div>

        {/* Range Selector */}
        <div className="flex items-center gap-1 bg-white/[0.03] border border-white/10 p-0.5 rounded-sm font-mono text-xs">
          {(["7d", "30d", "90d", "all"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 rounded-sm uppercase tracking-wider transition-all ${
                range === r
                  ? "bg-accent text-black font-bold shadow-md"
                  : "text-text-secondary hover:text-white"
              }`}
            >
              {r === "all" ? "All Time" : `Last ${r}`}
            </button>
          ))}
        </div>
      </div>

      {/* Top Aggregation Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-sm bg-[#0c0c0c] border border-white/[0.08]">
          <span className="text-[10px] font-mono uppercase text-text-muted block mb-1">
            Total Sessions
          </span>
          <span className="text-3xl font-heading font-bold text-white block">{total}</span>
          <span className="text-[10px] font-mono text-text-secondary">Across active period</span>
        </div>

        <div className="p-5 rounded-sm bg-[#0c0c0c] border border-emerald-500/30">
          <span className="text-[10px] font-mono uppercase text-emerald-400 block mb-1">
            Confirmed Rate
          </span>
          <span className="text-3xl font-heading font-bold text-emerald-400 block">
            {total > 0 ? Math.round(((confirmed + completed) / total) * 100) : 0}%
          </span>
          <span className="text-[10px] font-mono text-emerald-300/80">
            {confirmed + completed} confirmed sessions
          </span>
        </div>

        <div className="p-5 rounded-sm bg-[#0c0c0c] border border-amber-500/30">
          <span className="text-[10px] font-mono uppercase text-amber-400 block mb-1">
            Pending Review
          </span>
          <span className="text-3xl font-heading font-bold text-amber-400 block">{pending}</span>
          <span className="text-[10px] font-mono text-amber-300/80">Needs confirmation</span>
        </div>

        <div className="p-5 rounded-sm bg-[#0c0c0c] border border-rose-500/30">
          <span className="text-[10px] font-mono uppercase text-rose-400 block mb-1">
            Cancellation Rate
          </span>
          <span className="text-3xl font-heading font-bold text-rose-400 block">
            {total > 0 ? Math.round((cancelled / total) * 100) : 0}%
          </span>
          <span className="text-[10px] font-mono text-rose-300/80">{cancelled} cancellations</span>
        </div>
      </div>

      {/* Grid: Service Breakdown + Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Service Popularity Breakdown */}
        <div className="p-6 rounded-sm bg-[#0c0c0c] border border-white/[0.08] shadow-xl space-y-4">
          <h2 className="text-sm font-heading font-bold text-white tracking-wider flex items-center gap-2">
            <Layers size={16} className="text-accent" /> SESSIONS BY PRODUCTION SERVICE
          </h2>

          <div className="space-y-3 font-mono text-xs">
            {Object.keys(serviceCounts).length === 0 ? (
              <p className="text-text-muted py-6 text-center">No service data in range.</p>
            ) : (
              Object.entries(serviceCounts).map(([svc, count]) => {
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;

                return (
                  <div key={svc} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-white font-medium">{svc}</span>
                      <span className="text-accent font-bold">
                        {count} ({pct}%)
                      </span>
                    </div>
                    <div className="h-2 w-full bg-white/[0.04] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Status Distribution */}
        <div className="p-6 rounded-sm bg-[#0c0c0c] border border-white/[0.08] shadow-xl space-y-4">
          <h2 className="text-sm font-heading font-bold text-white tracking-wider flex items-center gap-2">
            <PieChart size={16} className="text-accent" /> STATUS RESOLUTION BREAKDOWN
          </h2>

          <div className="space-y-3 font-mono text-xs">
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-emerald-300">CONFIRMED</span>
                <span className="text-emerald-400 font-bold">{confirmed}</span>
              </div>
              <div className="h-2 w-full bg-white/[0.04] rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all duration-500"
                  style={{ width: `${total > 0 ? (confirmed / total) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-amber-300">PENDING</span>
                <span className="text-amber-400 font-bold">{pending}</span>
              </div>
              <div className="h-2 w-full bg-white/[0.04] rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 transition-all duration-500"
                  style={{ width: `${total > 0 ? (pending / total) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-rose-300">CANCELLED</span>
                <span className="text-rose-400 font-bold">{cancelled}</span>
              </div>
              <div className="h-2 w-full bg-white/[0.04] rounded-full overflow-hidden">
                <div
                  className="h-full bg-rose-500 transition-all duration-500"
                  style={{ width: `${total > 0 ? (cancelled / total) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-text-muted">COMPLETED</span>
                <span className="text-white font-bold">{completed}</span>
              </div>
              <div className="h-2 w-full bg-white/[0.04] rounded-full overflow-hidden">
                <div
                  className="h-full bg-white/40 transition-all duration-500"
                  style={{ width: `${total > 0 ? (completed / total) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
