"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  User,
  ExternalLink,
  Plus,
  Radio,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { useAdminBookings } from "@/context/AdminBookingsContext";
import { formatTo12Hour, STUDIO_TIMEZONE } from "@/lib/constants";
import { Booking } from "@/lib/types/booking";

export default function AdminCalendarPage() {
  const { bookings, loading } = useAdminBookings();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"MONTH" | "WEEK" | "DAY">("MONTH");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Month calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  const monthNames = [
    "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
    "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER",
  ];

  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToToday = () => setCurrentDate(new Date());

  // Generate calendar grid days
  const calendarDays = [];
  // Padding for days before start of month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push({ dayNumber: null, dateStr: null });
  }
  // Days of current month
  for (let d = 1; d <= daysInMonth; d++) {
    const dStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    calendarDays.push({ dayNumber: d, dateStr: dStr });
  }

  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
        <div>
          <span className="text-[10px] font-mono text-accent uppercase tracking-widest block mb-1">
            VISUAL SOUNDSTAGE SCHEDULER
          </span>
          <h1 className="text-2xl sm:text-3xl font-heading font-black tracking-tight text-white flex items-center gap-3">
            STUDIO CALENDAR
            <span className="text-xs font-mono font-normal text-text-muted bg-white/[0.04] border border-white/10 px-2.5 py-1 rounded">
              {monthNames[month]} {year}
            </span>
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Month Navigation */}
          <div className="flex items-center gap-1 bg-white/[0.03] border border-white/10 p-0.5 rounded-sm">
            <button
              onClick={prevMonth}
              className="p-1.5 rounded hover:bg-white/[0.06] text-text-muted hover:text-white"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={goToToday}
              className="px-2.5 py-1 text-xs font-mono text-text-secondary hover:text-white"
            >
              Today
            </button>
            <button
              onClick={nextMonth}
              className="p-1.5 rounded hover:bg-white/[0.06] text-text-muted hover:text-white"
            >
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Open Google Calendar direct launcher */}
          <a
            href="https://calendar.google.com/calendar"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 rounded-sm bg-white/[0.04] border border-white/10 hover:border-accent text-xs font-mono text-white flex items-center gap-1.5 transition-colors"
          >
            <ExternalLink size={13} className="text-accent" /> Open Google Calendar ↗
          </a>
        </div>
      </div>

      {/* Main Month Grid View */}
      <div className="border border-white/[0.08] rounded-sm bg-[#0c0c0c] p-4 shadow-xl">
        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-1 text-center font-mono text-[11px] font-bold text-text-muted pb-3 border-b border-white/[0.06]">
          <span>SUN</span>
          <span>MON</span>
          <span>TUE</span>
          <span>WED</span>
          <span>THU</span>
          <span>FRI</span>
          <span>SAT</span>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1 pt-2">
          {calendarDays.map((cell, idx) => {
            if (!cell.dayNumber || !cell.dateStr) {
              return <div key={`empty-${idx}`} className="min-h-[100px] bg-white/[0.01] rounded-sm opacity-20" />;
            }

            const isToday = cell.dateStr === todayStr;
            const dayBookings = bookings.filter(
              (b) => b.date === cell.dateStr && b.status !== "CANCELLED"
            );

            return (
              <div
                key={cell.dateStr}
                className={`min-h-[110px] p-2 rounded-sm border transition-all flex flex-col justify-between ${
                  isToday
                    ? "bg-accent/[0.04] border-accent/40 shadow-inner"
                    : "bg-white/[0.02] border-white/[0.04] hover:border-white/15"
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span
                    className={`text-xs font-mono font-bold ${
                      isToday ? "text-accent" : "text-text-muted"
                    }`}
                  >
                    {cell.dayNumber}
                  </span>
                  {dayBookings.length > 0 && (
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/[0.06] text-white">
                      {dayBookings.length}
                    </span>
                  )}
                </div>

                {/* Session Chips inside Day Cell */}
                <div className="space-y-1 overflow-y-auto max-h-[80px]">
                  {dayBookings.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => setSelectedBooking(b)}
                      className={`w-full text-left p-1 rounded text-[10px] font-mono truncate block transition-all ${
                        b.status === "CONFIRMED"
                          ? "bg-emerald-950/60 border border-emerald-500/30 text-emerald-200 hover:border-emerald-400"
                          : b.status === "PENDING"
                          ? "bg-amber-950/60 border border-amber-500/30 text-amber-200 hover:border-amber-400"
                          : "bg-white/5 text-text-secondary"
                      }`}
                      title={`${b.customerName} - ${b.service}`}
                    >
                      <span className="font-bold">{b.startTime}</span> {b.customerName}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Session Preview Drawer / Modal */}
      {selectedBooking && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedBooking(null)}
        >
          <div
            className="max-w-md w-full p-6 rounded-sm bg-[#0c0c0c] border border-white/15 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-3 border-b border-white/[0.06]">
              <div>
                <span className="text-[10px] font-mono text-accent uppercase tracking-widest block">
                  CALENDAR SESSION PREVIEW
                </span>
                <h3 className="text-base font-heading font-bold text-white">
                  {selectedBooking.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="text-text-muted hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between py-1.5 border-b border-white/[0.04]">
                <span className="text-text-muted">Host / Customer</span>
                <span className="text-white font-bold">{selectedBooking.customerName}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-white/[0.04]">
                <span className="text-text-muted">Package</span>
                <span className="text-white">{selectedBooking.service}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-white/[0.04]">
                <span className="text-text-muted">Date &amp; Time</span>
                <span className="text-white font-bold">
                  {selectedBooking.date} • {formatTo12Hour(selectedBooking.startTime)} – {formatTo12Hour(selectedBooking.endTime)}
                </span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-white/[0.04]">
                <span className="text-text-muted">Guests</span>
                <span className="text-white">{selectedBooking.numberOfPeople} People</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-white/[0.04]">
                <span className="text-text-muted">Status</span>
                <span
                  className={`font-bold uppercase ${
                    selectedBooking.status === "CONFIRMED"
                      ? "text-emerald-400"
                      : selectedBooking.status === "PENDING"
                      ? "text-amber-400"
                      : "text-rose-400"
                  }`}
                >
                  {selectedBooking.status}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-white/[0.06]">
              <Link
                href={`/admin/bookings/${selectedBooking.id}`}
                className="btn-primary flex-1 justify-center !py-2.5 !text-xs text-center"
              >
                Full Inspection →
              </Link>
              <Link
                href={`/booking/pass/${selectedBooking.id}`}
                target="_blank"
                className="px-4 py-2.5 rounded bg-white/[0.04] border border-white/10 hover:border-accent text-xs font-mono text-text-secondary hover:text-white"
              >
                Pass ↗
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
