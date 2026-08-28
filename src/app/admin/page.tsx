"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  Search,
  Filter,
  Shield,
  Radio,
  Phone,
  Mail,
  User,
  Users,
  Send,
  Lock,
  ArrowLeft,
  CalendarCheck,
  AlertTriangle,
  Loader2,
  ExternalLink,
  Ticket,
  QrCode,
  Sparkles,
  Edit3,
  CheckCircle2,
  RotateCcw,
  Download,
  Flame,
  KeyRound,
  ArrowRight,
  TrendingUp,
  Layers,
  Activity,
} from "lucide-react";
import { useAdminBookings } from "@/context/AdminBookingsContext";
import { Booking, BookingStatus } from "@/lib/types/booking";
import { formatTo12Hour, STUDIO_TIMEZONE } from "@/lib/constants";

export default function AdminDashboardPage() {
  const {
    bookings,
    loading,
    isRealtimeActive,
    updateStatus,
    retrySync,
    regeneratePass,
  } = useAdminBookings();

  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Compute live metrics from real Firestore data
  const todayStr = new Date().toISOString().split("T")[0];
  const totalCount = bookings.length;
  const pendingCount = bookings.filter((b) => b.status === "PENDING").length;
  const confirmedCount = bookings.filter((b) => b.status === "CONFIRMED").length;
  const cancelledCount = bookings.filter((b) => b.status === "CANCELLED").length;
  const completedCount = bookings.filter((b) => b.status === "COMPLETED").length;

  const todayBookings = bookings
    .filter((b) => b.date === todayStr && b.status !== "CANCELLED")
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const upcomingBookings = bookings.filter(
    (b) => b.date > todayStr && b.status !== "CANCELLED"
  ).length;

  // Integration telemetry calculation
  const failedGCalSyncs = bookings.filter((b) => b.googleCalendarSyncStatus === "FAILED").length;
  const failedDiscordSyncs = bookings.filter((b) => b.discordSyncStatus === "FAILED").length;

  // Find next upcoming session today
  const currentHourMinute = new Date().toLocaleTimeString("en-GB", {
    timeZone: STUDIO_TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const nextSessionToday = todayBookings.find((b) => b.startTime >= currentHourMinute) || todayBookings[0];

  const handleQuickStatus = async (id: string, status: BookingStatus) => {
    setActionLoadingId(id);
    await updateStatus(id, status);
    setActionLoadingId(null);
  };

  const handleQuickRetry = async (id: string) => {
    setActionLoadingId(id);
    await retrySync(id);
    setActionLoadingId(null);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner & Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
        <div>
          <span className="text-[10px] font-mono text-accent uppercase tracking-widest flex items-center gap-1.5 mb-1">
            <Radio size={10} className="animate-pulse text-emerald-400" />
            SOUNDSTAGE MASTER CONTROL
          </span>
          <h1 className="text-2xl sm:text-3xl font-heading font-black tracking-tight text-white">
            STUDIO OPERATIONS OVERVIEW
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/verify"
            className="btn-primary !text-xs !py-2.5 !px-4 flex items-center gap-1.5 shadow-md shadow-accent/20"
          >
            <QrCode size={14} /> Quick QR Scan
          </Link>
          <Link
            href="/admin/calendar"
            className="px-4 py-2.5 rounded-sm bg-white/[0.04] border border-white/10 hover:border-accent text-xs font-mono text-white transition-colors flex items-center gap-1.5"
          >
            <Calendar size={14} className="text-accent" /> Calendar Grid
          </Link>
        </div>
      </div>

      {/* 4 Primary Key Performance Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Bookings */}
        <div className="p-5 rounded-sm bg-[#0c0c0c] border border-white/[0.08] shadow-md relative overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-mono uppercase text-text-muted">Today&#39;s Sessions</span>
            <Calendar className="text-accent" size={16} />
          </div>
          <span className="text-3xl font-heading font-bold text-white block mb-1">
            {todayBookings.length}
          </span>
          <span className="text-[10px] font-mono text-text-secondary">
            {todayBookings.length === 0 ? "No sessions today" : `${todayBookings.length} scheduled soundstages`}
          </span>
        </div>

        {/* Pending Approvals */}
        <div className="p-5 rounded-sm bg-[#0c0c0c] border border-amber-500/30 shadow-md relative overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">Pending Review</span>
            <AlertTriangle className="text-amber-400" size={16} />
          </div>
          <span className="text-3xl font-heading font-bold text-amber-400 block mb-1">
            {pendingCount}
          </span>
          <span className="text-[10px] font-mono text-amber-300/80">
            {pendingCount > 0 ? "Requires producer action" : "All sessions verified"}
          </span>
        </div>

        {/* Upcoming Bookings */}
        <div className="p-5 rounded-sm bg-[#0c0c0c] border border-white/[0.08] shadow-md relative overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-mono uppercase text-text-muted">Upcoming Pipeline</span>
            <TrendingUp className="text-accent" size={16} />
          </div>
          <span className="text-3xl font-heading font-bold text-white block mb-1">
            {upcomingBookings}
          </span>
          <span className="text-[10px] font-mono text-text-secondary">Future studio dates booked</span>
        </div>

        {/* Total Lifetime Bookings */}
        <div className="p-5 rounded-sm bg-[#0c0c0c] border border-white/[0.08] shadow-md relative overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-mono uppercase text-text-muted">Total Database</span>
            <Layers className="text-accent" size={16} />
          </div>
          <span className="text-3xl font-heading font-bold text-white block mb-1">
            {totalCount}
          </span>
          <div className="flex items-center gap-2 text-[10px] font-mono text-text-muted">
            <span className="text-emerald-400">{confirmedCount} confirmed</span>
            <span>•</span>
            <span className="text-rose-400">{cancelledCount} cancelled</span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Section: Today's Timeline + Sync Telemetry Monitors */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 7 Cols: Today's Live Schedule Timeline */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-heading font-bold text-white tracking-wider flex items-center gap-2">
              <Clock size={16} className="text-accent" /> TODAY&#39;S SOUNDSTAGE SCHEDULE ({todayStr})
            </h2>
            <span className="text-[10px] font-mono text-accent bg-accent/10 border border-accent/30 px-2 py-0.5 rounded">
              Timezone: Sri Lanka (+05:30)
            </span>
          </div>

          <div className="p-6 rounded-sm bg-[#0c0c0c] border border-white/[0.08] shadow-xl">
            {loading ? (
              <div className="py-12 text-center text-xs font-mono text-text-muted flex flex-col items-center justify-center">
                <Loader2 size={24} className="animate-spin text-accent mb-2" />
                Retrieving today&#39;s schedule...
              </div>
            ) : todayBookings.length === 0 ? (
              <div className="py-10 text-center text-text-muted font-mono text-xs">
                <Calendar size={32} className="mx-auto mb-2 opacity-30 text-accent" />
                No sessions booked for today. Soundstages are currently open.
              </div>
            ) : (
              <div className="space-y-4 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/[0.08]">
                {todayBookings.map((b) => {
                  const isNext = nextSessionToday?.id === b.id;

                  return (
                    <div
                      key={b.id}
                      className={`relative pl-8 transition-all ${
                        isNext ? "scale-[1.01]" : ""
                      }`}
                    >
                      {/* Timeline Node */}
                      <span
                        className={`absolute left-2 top-2 w-3.5 h-3.5 rounded-full border-2 transform -translate-x-1/2 ${
                          b.status === "CONFIRMED"
                            ? "bg-emerald-500 border-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                            : b.status === "PENDING"
                            ? "bg-amber-500 border-amber-300 animate-ping"
                            : "bg-white/20 border-white/40"
                        }`}
                      />

                      <div
                        className={`p-4 rounded-sm border transition-all ${
                          isNext
                            ? "bg-accent/[0.06] border-accent/50 shadow-lg shadow-accent/10"
                            : "bg-white/[0.02] border-white/[0.06] hover:border-white/15"
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-accent">
                              {formatTo12Hour(b.startTime)} – {formatTo12Hour(b.endTime)}
                            </span>
                            {isNext && (
                              <span className="text-[9px] font-mono uppercase bg-accent text-black font-bold px-1.5 py-0.5 rounded">
                                NEXT UPCOMING
                              </span>
                            )}
                          </div>

                          <span
                            className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                              b.status === "CONFIRMED"
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                                : b.status === "PENDING"
                                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                                : "bg-white/10 text-white"
                            }`}
                          >
                            {b.status}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-heading font-bold text-white">
                              {b.customerName}
                            </p>
                            <p className="text-[11px] font-mono text-text-secondary">
                              {b.service} • {b.numberOfPeople} Guests
                            </p>
                          </div>

                          <Link
                            href={`/admin/bookings/${b.id}`}
                            className="text-[11px] font-mono text-accent hover:underline flex items-center gap-1"
                          >
                            Details <ArrowRight size={12} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right 5 Cols: Integration Telemetry & Quick Action Hub */}
        <div className="lg:col-span-5 space-y-6">
          {/* Integration Sync Monitor Cards */}
          <div className="space-y-3">
            <h2 className="text-sm font-heading font-bold text-white tracking-wider flex items-center gap-2">
              <Activity size={16} className="text-accent" /> REAL-TIME INTEGRATION MONITORS
            </h2>

            {/* Google Calendar Card */}
            <div className="p-4 rounded-sm bg-[#0c0c0c] border border-white/[0.08] flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-xs font-heading font-bold text-white">GOOGLE CALENDAR</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                    CONNECTED
                  </span>
                </div>
                <p className="text-[10px] font-mono text-text-muted">
                  Locking slots in Asia/Colombo • {failedGCalSyncs} sync failures
                </p>
              </div>

              {failedGCalSyncs > 0 && (
                <span className="text-[10px] font-mono text-rose-400 bg-rose-950/60 border border-rose-500/40 px-2 py-1 rounded">
                  ⚠️ {failedGCalSyncs} Errors
                </span>
              )}
            </div>

            {/* Discord Webhook Card */}
            <div className="p-4 rounded-sm bg-[#0c0c0c] border border-white/[0.08] flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-xs font-heading font-bold text-white">DISCORD NOTIFICATIONS</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                    ONLINE
                  </span>
                </div>
                <p className="text-[10px] font-mono text-text-muted">
                  Instant embeds with VIP pass links • {failedDiscordSyncs} failed
                </p>
              </div>

              {failedDiscordSyncs > 0 && (
                <span className="text-[10px] font-mono text-rose-400 bg-rose-950/60 border border-rose-500/40 px-2 py-1 rounded">
                  ⚠️ {failedDiscordSyncs} Errors
                </span>
              )}
            </div>
          </div>

          {/* Quick Actions Shortcuts */}
          <div className="p-5 rounded-sm bg-[#0c0c0c] border border-white/[0.08] space-y-3">
            <span className="text-[10px] font-mono uppercase text-text-muted tracking-widest block mb-2">
              PRODUCER OPERATIONS
            </span>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <Link
                href="/admin/bookings"
                className="p-3 rounded-sm bg-white/[0.03] border border-white/10 hover:border-accent text-white flex flex-col gap-1 transition-colors"
              >
                <Layers size={16} className="text-accent" />
                <span className="font-bold">All Bookings</span>
                <span className="text-[10px] text-text-muted">Filter &amp; manage</span>
              </Link>

              <Link
                href="/admin/passes"
                className="p-3 rounded-sm bg-white/[0.03] border border-white/10 hover:border-accent text-white flex flex-col gap-1 transition-colors"
              >
                <Ticket size={16} className="text-accent" />
                <span className="font-bold">Passes Vault</span>
                <span className="text-[10px] text-text-muted">1200x1800 HD PNGs</span>
              </Link>

              <Link
                href="/admin/verify"
                className="p-3 rounded-sm bg-white/[0.03] border border-white/10 hover:border-accent text-white flex flex-col gap-1 transition-colors"
              >
                <QrCode size={16} className="text-accent" />
                <span className="font-bold">QR Door Scanner</span>
                <span className="text-[10px] text-text-muted">Check-in guests</span>
              </Link>

              <Link
                href="/admin/analytics"
                className="p-3 rounded-sm bg-white/[0.03] border border-white/10 hover:border-accent text-white flex flex-col gap-1 transition-colors"
              >
                <TrendingUp size={16} className="text-accent" />
                <span className="font-bold">Studio Analytics</span>
                <span className="text-[10px] text-text-muted">Pipeline charts</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Reservations Table */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-heading font-bold text-white tracking-wider flex items-center gap-2">
            <Layers size={16} className="text-accent" /> RECENT RESERVATIONS
          </h2>
          <Link
            href="/admin/bookings"
            className="text-xs font-mono text-accent hover:underline flex items-center gap-1"
          >
            View all {totalCount} bookings →
          </Link>
        </div>

        <div className="border border-white/[0.08] rounded-sm bg-[#0c0c0c] overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-white/[0.02] border-b border-white/[0.06] text-text-muted uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Booking ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Service</th>
                <th className="py-3 px-4">Date &amp; Time</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Sync</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {bookings.slice(0, 5).map((b) => (
                <tr key={b.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-4 font-bold text-accent">{b.id}</td>
                  <td className="py-3 px-4 text-white">{b.customerName}</td>
                  <td className="py-3 px-4 text-text-secondary">{b.service}</td>
                  <td className="py-3 px-4 text-text-muted">
                    {b.date} • {formatTo12Hour(b.startTime)}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[9px] uppercase px-2 py-0.5 rounded font-bold ${
                        b.status === "CONFIRMED"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                          : b.status === "PENDING"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse"
                          : b.status === "CANCELLED"
                          ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                          : "bg-white/10 text-white"
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded ${
                        b.googleCalendarSyncStatus === "SYNCED"
                          ? "text-emerald-300 bg-emerald-950/60"
                          : "text-amber-300 bg-amber-950/60"
                      }`}
                    >
                      GCal: {b.googleCalendarSyncStatus || "PENDING"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      href={`/admin/bookings/${b.id}`}
                      className="px-2.5 py-1 rounded bg-white/[0.04] border border-white/10 hover:border-accent text-accent transition-colors"
                    >
                      Inspect →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
