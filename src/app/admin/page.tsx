"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
} from "lucide-react";
import Link from "next/link";
import { Booking, BookingStatus, TimeSlot, UpdateBookingRequest } from "@/lib/types/booking";
import { formatTo12Hour, STUDIO_TIMEZONE } from "@/lib/constants";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [authError, setAuthError] = useState("");

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Quick Verification Tool
  const [quickVerifyId, setQuickVerifyId] = useState("");

  // Edit Details Modal State
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [editForm, setEditForm] = useState<UpdateBookingRequest>({});
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");

  // Reschedule Modal State
  const [rescheduleBooking, setRescheduleBooking] = useState<Booking | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleSlots, setRescheduleSlots] = useState<TimeSlot[]>([]);
  const [selectedRescheduleSlot, setSelectedRescheduleSlot] = useState<string>("");
  const [rescheduleLoading, setRescheduleLoading] = useState(false);
  const [rescheduleError, setRescheduleError] = useState("");

  // Check saved session auth
  useEffect(() => {
    const saved = localStorage.getItem("apex_admin_auth");
    if (saved === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === "apexstudio2026" || passcode === "admin") {
      setIsAuthenticated(true);
      localStorage.setItem("apex_admin_auth", "true");
      setAuthError("");
    } else {
      setAuthError("Incorrect producer passcode. Try 'apexstudio2026'");
    }
  };

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/bookings");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setBookings(json.data);
      }
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchBookings();
    }
  }, [isAuthenticated, fetchBookings]);

  // Status Change Handler with centralized sync
  const handleStatusChange = async (id: string, newStatus: BookingStatus) => {
    setActionLoadingId(id);
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setBookings((prev) => prev.map((b) => (b.id === id ? json.data : b)));
      }
    } catch (err) {
      console.error("Status update error:", err);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Trigger manual sync retry
  const handleRetrySync = async (id: string) => {
    setActionLoadingId(id);
    try {
      const res = await fetch(`/api/bookings/${id}/sync`, {
        method: "POST",
      });
      const json = await res.json();
      if (json.success && json.data) {
        setBookings((prev) => prev.map((b) => (b.id === id ? json.data : b)));
      }
    } catch (err) {
      console.error("Retry sync error:", err);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Open Edit Details Modal
  const openEditModal = (b: Booking) => {
    setEditingBooking(b);
    setEditForm({
      customerName: b.customerName,
      phone: b.phone,
      email: b.email,
      service: b.service,
      numberOfPeople: b.numberOfPeople,
      notes: b.notes || "",
    });
    setEditError("");
  };

  // Submit Edit Details
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBooking) return;

    setEditLoading(true);
    setEditError("");

    try {
      const res = await fetch(`/api/bookings/${editingBooking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setBookings((prev) => prev.map((b) => (b.id === editingBooking.id ? json.data : b)));
        setEditingBooking(null);
      } else {
        setEditError(json.error || "Failed to update session details.");
      }
    } catch (err) {
      console.error("Edit details error:", err);
      setEditError("Network error occurred.");
    } finally {
      setEditLoading(false);
    }
  };

  // Open Reschedule Modal
  const openRescheduleModal = (b: Booking) => {
    setRescheduleBooking(b);
    setRescheduleDate(b.date);
    setSelectedRescheduleSlot(b.startTime);
    setRescheduleError("");
  };

  // Fetch slots for reschedule
  useEffect(() => {
    if (!rescheduleBooking || !rescheduleDate) return;

    const fetchSlots = async () => {
      setRescheduleLoading(true);
      try {
        const res = await fetch(
          `/api/bookings/availability?date=${rescheduleDate}&duration=${rescheduleBooking.durationMinutes}`
        );
        const json = await res.json();
        if (json.success && json.data) {
          setRescheduleSlots(json.data.slots || []);
        }
      } catch (err) {
        console.error("Reschedule slots fetch error:", err);
      } finally {
        setRescheduleLoading(false);
      }
    };

    fetchSlots();
  }, [rescheduleBooking, rescheduleDate]);

  // Execute Reschedule
  const handleRescheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleBooking || !selectedRescheduleSlot) return;

    setActionLoadingId(rescheduleBooking.id);
    setRescheduleError("");

    try {
      const res = await fetch(`/api/bookings/${rescheduleBooking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: rescheduleDate,
          startTime: selectedRescheduleSlot,
          status: "CONFIRMED",
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setBookings((prev) => prev.map((b) => (b.id === rescheduleBooking.id ? json.data : b)));
        setRescheduleBooking(null);
      } else {
        setRescheduleError(json.error || "Reschedule failed.");
      }
    } catch (err) {
      console.error("Reschedule error:", err);
      setRescheduleError("Network error occurred.");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Metrics computation
  const totalCount = bookings.length;
  const pendingCount = bookings.filter((b) => b.status === "PENDING").length;
  const confirmedCount = bookings.filter((b) => b.status === "CONFIRMED").length;
  const todayStr = new Date().toISOString().split("T")[0];
  const todayCount = bookings.filter((b) => b.date === todayStr && b.status !== "CANCELLED").length;

  // Filtered list
  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = statusFilter === "ALL" || b.status === statusFilter;
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      !q ||
      b.customerName.toLowerCase().includes(q) ||
      b.id.toLowerCase().includes(q) ||
      b.phone.toLowerCase().includes(q) ||
      b.email.toLowerCase().includes(q) ||
      b.service.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  // Passcode Lock Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 text-text-primary">
        <div className="max-w-md w-full p-8 rounded-sm bg-[#0c0c0c] border border-white/10 shadow-2xl text-center">
          <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent flex items-center justify-center mx-auto mb-6 text-accent">
            <Lock size={28} />
          </div>

          <h2 className="text-2xl font-heading font-bold mb-2">STUDIO PRODUCER PORTAL</h2>
          <p className="text-xs text-text-secondary mb-6 font-light">
            Enter authorized producer passcode to access live Google Calendar, Discord dispatch, and real-time pass controls.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Enter passcode (default: apexstudio2026)"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-sm px-4 py-3 text-sm text-center text-text-primary focus:border-accent focus:outline-none"
            />

            {authError && <p className="text-xs text-rose-400 font-mono">{authError}</p>}

            <button type="submit" className="btn-primary w-full justify-center !py-3 !text-xs">
              UNLOCK ADMIN PORTAL
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-white/[0.06]">
            <Link href="/" className="text-xs text-text-muted hover:text-accent flex items-center justify-center gap-1">
              <ArrowLeft size={12} /> Back to Studio Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-text-primary">
      {/* Admin Top Navigation */}
      <header className="border-b border-white/[0.08] bg-[#0c0c0c]/90 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="w-8 h-8 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center text-text-secondary hover:text-accent transition-colors"
            >
              <ArrowLeft size={16} />
            </Link>
            <div>
              <h1 className="text-lg font-heading font-bold tracking-wider">APEX STUDIO • PRODUCER DESK</h1>
              <span className="text-[10px] font-mono text-accent flex items-center gap-1">
                <Radio size={10} className="animate-pulse" /> REAL-TIME GCAL &amp; DISCORD SYNC ACTIVE
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Verification Scanner Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (quickVerifyId.trim()) {
                  const cleaned = quickVerifyId.trim().replace(/^.*\/booking\/verify\//, "");
                  window.open(`/booking/verify/${cleaned}`, "_blank");
                }
              }}
              className="hidden md:flex items-center gap-1.5"
            >
              <input
                type="text"
                placeholder="Scan / Enter Pass ID (APX-...)"
                value={quickVerifyId}
                onChange={(e) => setQuickVerifyId(e.target.value)}
                className="bg-white/[0.04] border border-white/10 rounded-sm px-3 py-1.5 text-xs font-mono w-56 text-text-primary focus:border-accent focus:outline-none"
              />
              <button
                type="submit"
                disabled={!quickVerifyId.trim()}
                className="px-3 py-1.5 rounded-sm bg-accent text-black font-bold text-xs font-mono hover:bg-accent-light transition-colors disabled:opacity-40"
              >
                Verify Pass 🔍
              </button>
            </form>

            <button
              onClick={fetchBookings}
              disabled={loading}
              className="px-3.5 py-1.5 rounded-sm bg-white/[0.04] border border-white/10 text-xs font-mono text-text-secondary hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw size={12} className={loading ? "animate-spin text-accent" : ""} />
              Refresh
            </button>

            <button
              onClick={() => {
                localStorage.removeItem("apex_admin_auth");
                setIsAuthenticated(false);
              }}
              className="px-3.5 py-1.5 rounded-sm border border-rose-500/30 bg-rose-500/10 text-rose-300 text-xs font-mono hover:bg-rose-500/20 transition-colors"
            >
              Lock Desk
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 py-8">
        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-5 rounded-sm bg-[#0c0c0c] border border-white/[0.06] shadow-md">
            <span className="text-[10px] font-mono uppercase text-text-muted block mb-1">Total Reservations</span>
            <span className="text-2xl sm:text-3xl font-heading font-bold text-white">{totalCount}</span>
          </div>

          <div className="p-5 rounded-sm bg-[#0c0c0c] border border-amber-500/20 shadow-md">
            <span className="text-[10px] font-mono uppercase text-amber-400 block mb-1">Pending Approval</span>
            <span className="text-2xl sm:text-3xl font-heading font-bold text-amber-400">{pendingCount}</span>
          </div>

          <div className="p-5 rounded-sm bg-[#0c0c0c] border border-emerald-500/20 shadow-md">
            <span className="text-[10px] font-mono uppercase text-emerald-400 block mb-1">Confirmed Sessions</span>
            <span className="text-2xl sm:text-3xl font-heading font-bold text-emerald-400">{confirmedCount}</span>
          </div>

          <div className="p-5 rounded-sm bg-[#0c0c0c] border border-accent/20 shadow-md">
            <span className="text-[10px] font-mono uppercase text-accent block mb-1">Scheduled Today</span>
            <span className="text-2xl sm:text-3xl font-heading font-bold text-accent">{todayCount}</span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 rounded-sm bg-[#0c0c0c] border border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search by customer, ID, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-sm pl-9 pr-4 py-2 text-xs text-text-primary focus:border-accent focus:outline-none"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
            {["ALL", "PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"].map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1.5 rounded-sm text-[11px] font-mono uppercase tracking-wider transition-colors whitespace-nowrap ${
                  statusFilter === tab
                    ? "bg-accent text-black font-bold"
                    : "bg-white/[0.03] border border-white/[0.06] text-text-secondary hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="py-20 text-center text-text-muted flex flex-col items-center justify-center">
            <Loader2 size={32} className="text-accent animate-spin mb-3" />
            <span className="text-xs font-mono">Syncing studio repository...</span>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="p-12 text-center border border-white/[0.06] rounded-sm bg-[#0c0c0c]">
            <Calendar size={36} className="text-text-muted mx-auto mb-3 opacity-40" />
            <h3 className="text-base font-heading font-semibold text-white mb-1">No Bookings Found</h3>
            <p className="text-xs text-text-secondary">Try clearing your search query or status filter.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((b) => {
              const isActionLoading = actionLoadingId === b.id;
              const hasSyncFailure = b.googleCalendarSyncStatus === "FAILED" || b.discordSyncStatus === "FAILED";

              return (
                <div
                  key={b.id}
                  className={`p-6 rounded-sm bg-[#0c0c0c] border transition-all ${
                    b.status === "PENDING"
                      ? "border-amber-500/40 bg-amber-950/[0.04]"
                      : b.status === "CONFIRMED"
                      ? "border-emerald-500/30"
                      : b.status === "CANCELLED"
                      ? "border-rose-500/20 opacity-60"
                      : "border-white/[0.06]"
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    {/* Left: Info */}
                    <div className="space-y-2 max-w-2xl">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="text-xs font-mono font-bold text-accent bg-black/60 px-2.5 py-0.5 rounded border border-accent/30">
                          {b.id}
                        </span>

                        <span className="text-[10px] font-mono text-text-muted bg-white/[0.04] px-1.5 py-0.5 rounded border border-white/10">
                          v{b.version || 1}
                        </span>

                        <span
                          className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
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

                        <span className="text-xs font-heading font-semibold text-white/90">{b.service}</span>

                        {/* Real-Time Sync Indicators */}
                        <div className="flex items-center gap-1.5 ml-auto sm:ml-0 font-mono text-[9px]">
                          <span
                            className={`px-1.5 py-0.5 rounded ${
                              b.googleCalendarSyncStatus === "SYNCED"
                                ? "bg-emerald-950/60 text-emerald-300 border border-emerald-500/30"
                                : b.googleCalendarSyncStatus === "FAILED"
                                ? "bg-rose-950/60 text-rose-300 border border-rose-500/30"
                                : "bg-white/5 text-text-muted"
                            }`}
                          >
                            GCal: {b.googleCalendarSyncStatus || "PENDING"}
                          </span>

                          <span
                            className={`px-1.5 py-0.5 rounded ${
                              b.discordSyncStatus === "SYNCED"
                                ? "bg-emerald-950/60 text-emerald-300 border border-emerald-500/30"
                                : b.discordSyncStatus === "FAILED"
                                ? "bg-rose-950/60 text-rose-300 border border-rose-500/30"
                                : "bg-white/5 text-text-muted"
                            }`}
                          >
                            Discord: {b.discordSyncStatus || "PENDING"}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-text-secondary font-mono">
                        <span className="flex items-center gap-1 text-white font-semibold">
                          <User size={13} className="text-accent" /> {b.customerName}
                        </span>
                        <a href={`tel:${b.phone}`} className="flex items-center gap-1 hover:text-accent">
                          <Phone size={13} className="text-accent" /> {b.phone}
                        </a>
                        <a href={`mailto:${b.email}`} className="flex items-center gap-1 hover:text-accent">
                          <Mail size={13} className="text-accent" /> {b.email}
                        </a>
                        <span className="flex items-center gap-1">
                          <Users size={13} className="text-accent" /> {b.numberOfPeople} Guests
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-white/80 pt-1">
                        <span className="flex items-center gap-1 bg-white/[0.04] px-2.5 py-1 rounded border border-white/10">
                          <Calendar size={13} className="text-accent" /> {b.date}
                        </span>
                        <span className="flex items-center gap-1 bg-white/[0.04] px-2.5 py-1 rounded border border-white/10">
                          <Clock size={13} className="text-accent" /> {formatTo12Hour(b.startTime)} –{" "}
                          {formatTo12Hour(b.endTime)} ({b.durationMinutes}m)
                        </span>
                      </div>

                      {b.notes && (
                        <p className="text-xs text-text-muted italic bg-black/40 p-2 rounded border border-white/[0.04] mt-2">
                          &ldquo;{b.notes}&rdquo;
                        </p>
                      )}
                    </div>

                    {/* Right: Actions */}
                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
                        {/* View Booking Pass Button */}
                      <Link
                        href={`/booking/pass/${b.id}`}
                        target="_blank"
                        className="px-3 py-2 rounded-sm bg-white/[0.04] border border-white/10 hover:border-accent text-xs font-mono text-text-secondary hover:text-white transition-colors flex items-center gap-1.5"
                      >
                        <Ticket size={13} className="text-accent" />
                        <span>Pass</span>
                      </Link>

                      {/* Download PNG Pass Button */}
                      <a
                        href={`/api/bookings/${b.id}/pass-image?download=true&v=${b.version || 1}`}
                        download={`APEX-STUDIO-BOOKING-${b.id}.png`}
                        className="px-3 py-2 rounded-sm bg-white/[0.04] border border-white/10 hover:border-accent text-xs font-mono text-text-secondary hover:text-white transition-colors flex items-center gap-1.5"
                        title="Download 1200x1800 PNG Pass"
                      >
                        <Download size={13} className="text-accent" />
                        <span>PNG</span>
                      </a>

                      {/* Regenerate Pass Button */}
                      <button
                        disabled={isActionLoading}
                        onClick={async () => {
                          setActionLoadingId(b.id);
                          try {
                            const res = await fetch(`/api/bookings/${b.id}/regenerate-pass`, { method: "POST" });
                            const json = await res.json();
                            if (json.success && json.data) {
                              setBookings((prev) => prev.map((item) => (item.id === b.id ? json.data : item)));
                            }
                          } catch (err) {
                            console.error("Pass regeneration error:", err);
                          } finally {
                            setActionLoadingId(null);
                          }
                        }}
                        className="px-3 py-2 rounded-sm bg-white/[0.04] border border-white/10 hover:border-accent text-xs font-mono text-text-secondary hover:text-white transition-colors flex items-center gap-1.5"
                        title="Regenerate pass with new version"
                      >
                        <RefreshCw size={13} className="text-accent" />
                        <span>Regen</span>
                      </button>

                      {/* Edit Details Button */}
                      <button
                        onClick={() => openEditModal(b)}
                        className="px-3 py-2 rounded-sm bg-white/[0.04] border border-white/10 hover:border-accent text-xs font-mono text-text-secondary hover:text-white transition-colors flex items-center gap-1.5"
                      >
                        <Edit3 size={13} className="text-accent" />
                        <span>Edit</span>
                      </button>

                      {/* Retry Sync Button if needed */}
                      {hasSyncFailure && (
                        <button
                          disabled={isActionLoading}
                          onClick={() => handleRetrySync(b.id)}
                          className="px-3 py-2 rounded-sm bg-amber-500/10 border border-amber-500/40 text-amber-300 text-xs font-mono hover:bg-amber-500/20 transition-colors flex items-center gap-1.5"
                        >
                          <RotateCcw size={12} />
                          <span>Retry Sync</span>
                        </button>
                      )}

                      {b.status === "PENDING" && (
                        <button
                          disabled={isActionLoading}
                          onClick={() => handleStatusChange(b.id, "CONFIRMED")}
                          className="px-4 py-2 rounded-sm bg-emerald-500 text-black text-xs font-semibold hover:bg-emerald-400 transition-colors flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
                        >
                          <CheckCircle size={14} />
                          Confirm &amp; Sync
                        </button>
                      )}

                      {b.status !== "CANCELLED" && (
                        <button
                          disabled={isActionLoading}
                          onClick={() => openRescheduleModal(b)}
                          className="px-3.5 py-2 rounded-sm bg-white/[0.04] border border-white/10 hover:border-accent text-xs font-medium text-text-secondary hover:text-white transition-colors flex items-center gap-1.5"
                        >
                          <RefreshCw size={13} />
                          Reschedule
                        </button>
                      )}

                      {b.status !== "CANCELLED" && (
                        <button
                          disabled={isActionLoading}
                          onClick={() => handleStatusChange(b.id, "CANCELLED")}
                          className="px-3.5 py-2 rounded-sm bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 text-rose-300 text-xs font-medium transition-colors flex items-center gap-1.5"
                        >
                          <XCircle size={13} />
                          Cancel
                        </button>
                      )}

                      {b.status === "CONFIRMED" && (
                        <button
                          disabled={isActionLoading}
                          onClick={() => handleStatusChange(b.id, "COMPLETED")}
                          className="px-3.5 py-2 rounded-sm bg-white/[0.04] border border-white/10 text-xs font-medium text-text-muted hover:text-white transition-colors"
                        >
                          Complete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Edit Details Modal */}
      <AnimatePresence>
        {editingBooking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setEditingBooking(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="max-w-lg w-full p-6 sm:p-8 rounded-sm bg-[#0c0c0c] border border-white/10 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4 border-b border-white/[0.06] pb-3">
                <div>
                  <h3 className="text-lg font-heading font-bold text-white">EDIT BOOKING DETAILS</h3>
                  <span className="text-xs font-mono text-accent">
                    {editingBooking.id} • Real-Time GCal &amp; Discord Sync
                  </span>
                </div>
                <button
                  onClick={() => setEditingBooking(null)}
                  className="text-text-muted hover:text-white text-sm"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-4 text-xs font-mono">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-text-secondary uppercase mb-1">Customer Name</label>
                    <input
                      type="text"
                      required
                      value={editForm.customerName || ""}
                      onChange={(e) => setEditForm({ ...editForm, customerName: e.target.value })}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-sm px-3 py-2 text-white focus:border-accent focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-text-secondary uppercase mb-1">Phone / WhatsApp</label>
                    <input
                      type="tel"
                      required
                      value={editForm.phone || ""}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-sm px-3 py-2 text-white focus:border-accent focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-text-secondary uppercase mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={editForm.email || ""}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-sm px-3 py-2 text-white focus:border-accent focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-text-secondary uppercase mb-1">Number of Guests</label>
                    <select
                      value={editForm.numberOfPeople || 2}
                      onChange={(e) => setEditForm({ ...editForm, numberOfPeople: Number(e.target.value) })}
                      className="w-full bg-[#111111] border border-white/10 rounded-sm px-3 py-2 text-white focus:border-accent focus:outline-none"
                    >
                      <option value={1}>1 Person</option>
                      <option value={2}>2 People</option>
                      <option value={3}>3 People</option>
                      <option value={4}>4 People</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-text-secondary uppercase mb-1">Production Service</label>
                  <input
                    type="text"
                    required
                    value={editForm.service || ""}
                    onChange={(e) => setEditForm({ ...editForm, service: e.target.value })}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-sm px-3 py-2 text-white focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-text-secondary uppercase mb-1">Show Notes / Special Requests</label>
                  <textarea
                    rows={3}
                    value={editForm.notes || ""}
                    onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-sm p-3 text-white focus:border-accent focus:outline-none resize-none"
                  />
                </div>

                {editError && (
                  <p className="text-xs text-rose-400 font-mono bg-rose-950/40 p-2 rounded">{editError}</p>
                )}

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.06]">
                  <button
                    type="button"
                    onClick={() => setEditingBooking(null)}
                    className="px-4 py-2 rounded-sm text-xs text-text-muted hover:text-white"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={editLoading}
                    className="btn-primary !text-xs !py-2.5 !px-5"
                  >
                    {editLoading ? "SAVING & SYNCING..." : "SAVE & SYNC TO GCAL & DISCORD"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reschedule Modal */}
      <AnimatePresence>
        {rescheduleBooking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setRescheduleBooking(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="max-w-lg w-full p-6 sm:p-8 rounded-sm bg-[#0c0c0c] border border-white/10 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4 border-b border-white/[0.06] pb-3">
                <div>
                  <h3 className="text-lg font-heading font-bold text-white">RESCHEDULE SESSION</h3>
                  <span className="text-xs font-mono text-accent">
                    {rescheduleBooking.id} • {rescheduleBooking.customerName}
                  </span>
                </div>
                <button
                  onClick={() => setRescheduleBooking(null)}
                  className="text-text-muted hover:text-white text-sm"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleRescheduleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-text-secondary mb-1">
                    Select New Date
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split("T")[0]}
                    value={rescheduleDate}
                    onChange={(e) => setRescheduleDate(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-sm px-4 py-2.5 text-xs text-text-primary focus:border-accent focus:outline-none [color-scheme:dark]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-text-secondary mb-1">
                    Available Time Slots (Sri Lanka Time)
                  </label>
                  {rescheduleLoading ? (
                    <div className="py-6 text-center text-xs text-accent animate-pulse font-mono">
                      Checking Google Calendar availability...
                    </div>
                  ) : rescheduleSlots.length === 0 ? (
                    <div className="p-4 text-center text-xs text-text-muted bg-white/[0.02] border border-white/[0.06]">
                      No available slots on this date.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
                      {rescheduleSlots.map((s) => (
                        <button
                          key={s.startTime}
                          type="button"
                          disabled={!s.available}
                          onClick={() => setSelectedRescheduleSlot(s.startTime)}
                          className={`p-2.5 rounded-sm text-xs font-mono text-left border transition-all ${
                            !s.available
                              ? "opacity-30 border-transparent bg-black/40 cursor-not-allowed"
                              : selectedRescheduleSlot === s.startTime
                              ? "bg-accent text-black font-bold border-accent"
                              : "bg-white/[0.03] border-white/10 text-white hover:border-accent"
                          }`}
                        >
                          <span>{formatTo12Hour(s.startTime)}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {rescheduleError && (
                  <p className="text-xs text-rose-400 font-mono bg-rose-950/40 p-2 rounded">{rescheduleError}</p>
                )}

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.06]">
                  <button
                    type="button"
                    onClick={() => setRescheduleBooking(null)}
                    className="px-4 py-2 rounded-sm text-xs text-text-muted hover:text-white"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={!selectedRescheduleSlot || rescheduleLoading}
                    className="btn-primary !text-xs !py-2.5 !px-5"
                  >
                    CONFIRM RESCHEDULE &amp; NOTIFY
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
