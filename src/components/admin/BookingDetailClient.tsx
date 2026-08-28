"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  Users,
  CheckCircle,
  XCircle,
  RotateCcw,
  RefreshCw,
  Ticket,
  Download,
  ArrowLeft,
  ShieldCheck,
  Radio,
  ExternalLink,
  Edit3,
  Sparkles,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { useAdminBookings } from "@/context/AdminBookingsContext";
import { formatTo12Hour, STUDIO_TIMEZONE } from "@/lib/constants";
import { BookingStatus, UpdateBookingRequest, TimeSlot } from "@/lib/types/booking";
import { getClientAvailableSlots } from "@/lib/services/clientBookingService";

interface BookingDetailClientProps {
  id: string;
}

export default function BookingDetailClient({ id }: BookingDetailClientProps) {
  const router = useRouter();
  const {
    bookings,
    loading,
    updateStatus,
    updateDetails,
    reschedule,
    retrySync,
    regeneratePass,
  } = useAdminBookings();

  const [actionLoading, setActionLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState<UpdateBookingRequest>({});
  const [editLoading, setEditLoading] = useState(false);

  // Reschedule State
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleSlots, setRescheduleSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [slotsLoading, setSlotsLoading] = useState(false);

  const booking = bookings.find((b) => b.id.toLowerCase() === id.toLowerCase());

  // Fetch slots for reschedule
  React.useEffect(() => {
    if (!showRescheduleModal || !rescheduleDate || !booking) return;

    const fetchSlots = async () => {
      setSlotsLoading(true);
      try {
        const slots = await getClientAvailableSlots(
          rescheduleDate,
          booking.durationMinutes || 120
        );
        setRescheduleSlots(slots || []);
      } catch (err) {
        console.error("Reschedule slots error:", err);
      } finally {
        setSlotsLoading(false);
      }
    };

    fetchSlots();
  }, [showRescheduleModal, rescheduleDate, booking]);

  if (loading) {
    return (
      <div className="py-20 text-center text-text-muted font-mono text-xs flex flex-col items-center justify-center">
        <Loader2 size={32} className="animate-spin text-accent mb-3" />
        AUDITING RESERVATION IN FIRESTORE...
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
          ✕
        </div>
        <h2 className="text-xl font-heading font-bold text-white">RESERVATION NOT FOUND</h2>
        <p className="text-xs font-mono text-text-muted">
          No record found for reference <strong>{id}</strong>.
        </p>
        <Link href="/admin/bookings" className="btn-primary !text-xs !py-2.5 inline-flex">
          ← Back to All Bookings
        </Link>
      </div>
    );
  }

  const passImageUrl = `/api/bookings/${booking.id}/pass-image?v=${booking.version || 1}`;

  const handleStatus = async (status: BookingStatus) => {
    setActionLoading(true);
    await updateStatus(booking.id, status);
    setActionLoading(false);
  };

  const handleRetry = async () => {
    setActionLoading(true);
    await retrySync(booking.id);
    setActionLoading(false);
  };

  const handleRegen = async () => {
    setActionLoading(true);
    await regeneratePass(booking.id);
    setActionLoading(false);
  };

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditLoading(true);
    await updateDetails(booking.id, editForm);
    setEditLoading(false);
    setShowEditModal(false);
  };

  const handleRescheduleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) return;
    setActionLoading(true);
    await reschedule(booking.id, rescheduleDate, selectedSlot);
    setActionLoading(false);
    setShowRescheduleModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/bookings"
            className="p-2 rounded bg-white/[0.03] border border-white/10 hover:border-accent text-text-muted hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-heading font-black tracking-tight text-white">
                {booking.id}
              </h1>
              <span className="text-[10px] font-mono text-text-muted bg-white/[0.04] px-2 py-0.5 rounded border border-white/10">
                v{booking.version || 1}
              </span>
              <span
                className={`text-[9px] uppercase px-2 py-0.5 rounded font-bold ${
                  booking.status === "CONFIRMED"
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                    : booking.status === "PENDING"
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                    : booking.status === "CANCELLED"
                    ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                    : "bg-white/10 text-white"
                }`}
              >
                {booking.status}
              </span>
            </div>
            <p className="text-xs font-mono text-text-muted">
              Created: {new Date(booking.createdAt).toLocaleString([], { timeZone: STUDIO_TIMEZONE })} (Sri Lanka)
            </p>
          </div>
        </div>

        {/* Top Action Bar */}
        <div className="flex flex-wrap items-center gap-2">
          {booking.status === "PENDING" && (
            <button
              disabled={actionLoading}
              onClick={() => handleStatus("CONFIRMED")}
              className="btn-primary !text-xs !py-2 !px-4 flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
            >
              <CheckCircle size={14} /> Confirm &amp; Sync
            </button>
          )}

          <button
            onClick={() => {
              setEditForm({
                customerName: booking.customerName,
                phone: booking.phone,
                email: booking.email,
                service: booking.service,
                numberOfPeople: booking.numberOfPeople,
                notes: booking.notes || "",
              });
              setShowEditModal(true);
            }}
            className="px-3 py-2 rounded-sm bg-white/[0.04] border border-white/10 hover:border-accent text-xs font-mono text-white flex items-center gap-1.5 transition-colors"
          >
            <Edit3 size={13} className="text-accent" /> Edit Info
          </button>

          <button
            onClick={() => {
              setRescheduleDate(booking.date);
              setSelectedSlot(booking.startTime);
              setShowRescheduleModal(true);
            }}
            className="px-3 py-2 rounded-sm bg-white/[0.04] border border-white/10 hover:border-accent text-xs font-mono text-white flex items-center gap-1.5 transition-colors"
          >
            <Calendar size={13} className="text-accent" /> Reschedule
          </button>

          {booking.status !== "CANCELLED" && (
            <button
              disabled={actionLoading}
              onClick={() => handleStatus("CANCELLED")}
              className="px-3 py-2 rounded-sm border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-mono flex items-center gap-1.5 transition-colors"
            >
              <XCircle size={13} /> Cancel
            </button>
          )}

          {booking.status === "CONFIRMED" && (
            <button
              disabled={actionLoading}
              onClick={() => handleStatus("COMPLETED")}
              className="px-3 py-2 rounded-sm bg-white/[0.04] border border-white/10 hover:border-accent text-xs font-mono text-text-muted hover:text-white"
            >
              Mark Completed
            </button>
          )}
        </div>
      </div>

      {/* Grid: Details (Left) + 1200x1800 PNG Pass Preview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 7 Cols: Customer, Session, & Telemetry */}
        <div className="lg:col-span-7 space-y-6">
          {/* Customer Profile Card */}
          <div className="p-6 rounded-sm bg-[#0c0c0c] border border-white/[0.08] space-y-4">
            <h2 className="text-xs font-mono uppercase text-accent tracking-widest flex items-center gap-1.5">
              <User size={14} /> HOST &amp; PRODUCER PROFILE
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
              <div className="p-3 rounded bg-white/[0.02] border border-white/[0.04]">
                <span className="text-[10px] text-text-muted uppercase block mb-1">Host Name</span>
                <span className="text-white font-bold text-sm">{booking.customerName}</span>
              </div>

              <div className="p-3 rounded bg-white/[0.02] border border-white/[0.04]">
                <span className="text-[10px] text-text-muted uppercase block mb-1">Phone / WhatsApp</span>
                <a href={`tel:${booking.phone}`} className="text-accent hover:underline block font-bold">
                  {booking.phone}
                </a>
              </div>

              <div className="p-3 rounded bg-white/[0.02] border border-white/[0.04]">
                <span className="text-[10px] text-text-muted uppercase block mb-1">Email</span>
                <a href={`mailto:${booking.email}`} className="text-accent hover:underline block">
                  {booking.email}
                </a>
              </div>

              <div className="p-3 rounded bg-white/[0.02] border border-white/[0.04]">
                <span className="text-[10px] text-text-muted uppercase block mb-1">Guests</span>
                <span className="text-white">{booking.numberOfPeople} People</span>
              </div>
            </div>
          </div>

          {/* Session Specs Card */}
          <div className="p-6 rounded-sm bg-[#0c0c0c] border border-white/[0.08] space-y-4">
            <h2 className="text-xs font-mono uppercase text-accent tracking-widest flex items-center gap-1.5">
              <Clock size={14} /> SESSION SPECIFICATIONS
            </h2>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center py-2 border-b border-white/[0.04]">
                <span className="text-text-muted">Production Package</span>
                <span className="text-white font-bold">{booking.service}</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-white/[0.04]">
                <span className="text-text-muted">Scheduled Date</span>
                <span className="text-white">{booking.date}</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-white/[0.04]">
                <span className="text-text-muted">Time Slot</span>
                <span className="text-white">
                  {formatTo12Hour(booking.startTime)} – {formatTo12Hour(booking.endTime)}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-white/[0.04]">
                <span className="text-text-muted">Duration</span>
                <span className="text-white">{booking.durationMinutes} Minutes</span>
              </div>

              {booking.notes && (
                <div className="pt-2">
                  <span className="text-[10px] text-text-muted uppercase block mb-1">Show Notes:</span>
                  <p className="p-3 rounded bg-white/[0.02] border border-white/[0.04] text-text-secondary italic">
                    &ldquo;{booking.notes}&rdquo;
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Dual Sync Integration Telemetry */}
          <div className="p-6 rounded-sm bg-[#0c0c0c] border border-white/[0.08] space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-mono uppercase text-accent tracking-widest flex items-center gap-1.5">
                <Radio size={14} className="animate-pulse" /> DUAL SYNC TELEMETRY
              </h2>
              <button
                disabled={actionLoading}
                onClick={handleRetry}
                className="px-3 py-1 rounded bg-white/[0.04] border border-white/10 hover:border-accent text-[11px] font-mono text-accent flex items-center gap-1"
              >
                <RotateCcw size={12} /> Force Sync
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
              <div className="p-3 rounded bg-white/[0.02] border border-white/[0.04] space-y-1">
                <span className="text-[10px] text-text-muted block">Google Calendar</span>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      booking.googleCalendarSyncStatus === "SYNCED" ? "bg-emerald-400" : "bg-rose-400"
                    }`}
                  />
                  <span className="text-white font-bold">
                    {booking.googleCalendarSyncStatus || "PENDING"}
                  </span>
                </div>
                {booking.googleCalendarEventId && (
                  <span className="text-[9px] text-text-muted truncate block">
                    ID: {booking.googleCalendarEventId}
                  </span>
                )}
              </div>

              <div className="p-3 rounded bg-white/[0.02] border border-white/[0.04] space-y-1">
                <span className="text-[10px] text-text-muted block">Discord Notifications</span>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      booking.discordSyncStatus === "SYNCED" ? "bg-emerald-400" : "bg-rose-400"
                    }`}
                  />
                  <span className="text-white font-bold">
                    {booking.discordSyncStatus || "PENDING"}
                  </span>
                </div>
                <span className="text-[9px] text-text-muted block">
                  Last Sync: {booking.lastSyncedAt ? new Date(booking.lastSyncedAt).toLocaleTimeString() : "Never"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 5 Cols: 1200x1800 PNG Pass Preview & Pass Actions */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-mono uppercase text-accent tracking-widest flex items-center gap-1.5">
              <Ticket size={14} /> VIP PASS IMAGE (v{booking.version || 1})
            </h2>
            <button
              disabled={actionLoading}
              onClick={handleRegen}
              className="text-[10px] font-mono text-accent hover:underline flex items-center gap-1"
            >
              <RefreshCw size={11} /> Regen Pass
            </button>
          </div>

          <div className="p-4 rounded-sm bg-[#0c0c0c] border border-white/[0.08] shadow-xl flex flex-col items-center space-y-4">
            {/* 1200x1800 Portrait Pass Container */}
            <div className="relative w-full max-w-[340px] aspect-[1200/1800] rounded-sm overflow-hidden border border-white/15 bg-gradient-to-b from-[#111111] to-[#080808] shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={passImageUrl}
                alt={`APEX STUDIO Pass ${booking.id}`}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Pass Actions */}
            <div className="w-full space-y-2">
              <a
                href={`/api/bookings/${booking.id}/pass-image?download=true&v=${booking.version || 1}`}
                download={`APEX-STUDIO-BOOKING-${booking.id}.png`}
                className="btn-primary w-full justify-center !py-3 !text-xs flex items-center gap-2"
              >
                <Download size={14} /> DOWNLOAD 1200x1800 PNG
              </a>

              <div className="grid grid-cols-2 gap-2">
                <Link
                  href={`/booking/pass/${booking.id}`}
                  target="_blank"
                  className="px-3 py-2 rounded bg-white/[0.04] border border-white/10 hover:border-accent text-xs font-mono text-text-secondary hover:text-white text-center flex items-center justify-center gap-1"
                >
                  <ExternalLink size={12} /> Public Pass
                </Link>

                <Link
                  href={`/booking/verify/${booking.id}`}
                  target="_blank"
                  className="px-3 py-2 rounded bg-white/[0.04] border border-white/10 hover:border-accent text-xs font-mono text-text-secondary hover:text-white text-center flex items-center justify-center gap-1"
                >
                  <ShieldCheck size={12} /> Verify Door
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Details Modal */}
      {showEditModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowEditModal(false)}
        >
          <div
            className="max-w-lg w-full p-6 rounded-sm bg-[#0c0c0c] border border-white/15 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-3 border-b border-white/[0.06] mb-4">
              <h3 className="text-base font-heading font-bold text-white">EDIT BOOKING DETAILS</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-text-muted hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEditSave} className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-text-muted uppercase text-[10px] mb-1">Customer Name</label>
                <input
                  type="text"
                  required
                  value={editForm.customerName || ""}
                  onChange={(e) => setEditForm({ ...editForm, customerName: e.target.value })}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-sm px-3 py-2 text-white focus:border-accent focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-text-muted uppercase text-[10px] mb-1">Phone</label>
                  <input
                    type="tel"
                    required
                    value={editForm.phone || ""}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-sm px-3 py-2 text-white focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-text-muted uppercase text-[10px] mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={editForm.email || ""}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-sm px-3 py-2 text-white focus:border-accent focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-text-muted uppercase text-[10px] mb-1">Service</label>
                  <input
                    type="text"
                    required
                    value={editForm.service || ""}
                    onChange={(e) => setEditForm({ ...editForm, service: e.target.value })}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-sm px-3 py-2 text-white focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-text-muted uppercase text-[10px] mb-1">Guests</label>
                  <input
                    type="number"
                    min={1}
                    max={6}
                    value={editForm.numberOfPeople || 2}
                    onChange={(e) => setEditForm({ ...editForm, numberOfPeople: Number(e.target.value) })}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-sm px-3 py-2 text-white focus:border-accent focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-text-muted uppercase text-[10px] mb-1">Notes</label>
                <textarea
                  rows={2}
                  value={editForm.notes || ""}
                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-sm p-3 text-white focus:border-accent focus:outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-3 py-2 rounded-sm text-xs text-text-muted hover:text-white"
                >
                  Cancel
                </button>
                <button type="submit" disabled={editLoading} className="btn-primary !text-xs !py-2 !px-4">
                  {editLoading ? "Saving..." : "Save & Sync Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {showRescheduleModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowRescheduleModal(false)}
        >
          <div
            className="max-w-lg w-full p-6 rounded-sm bg-[#0c0c0c] border border-white/15 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-3 border-b border-white/[0.06] mb-4">
              <h3 className="text-base font-heading font-bold text-white">RESCHEDULE SESSION</h3>
              <button
                onClick={() => setShowRescheduleModal(false)}
                className="text-text-muted hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRescheduleConfirm} className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-text-muted uppercase text-[10px] mb-1">Select New Date</label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split("T")[0]}
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-sm px-3 py-2 text-white focus:border-accent focus:outline-none [color-scheme:dark]"
                />
              </div>

              <div>
                <label className="block text-text-muted uppercase text-[10px] mb-1">
                  Available Slots (Sri Lanka Time)
                </label>
                {slotsLoading ? (
                  <p className="text-accent py-4 text-center">Checking Google Calendar slots...</p>
                ) : rescheduleSlots.length === 0 ? (
                  <p className="text-text-muted py-4 text-center">No slots available on this date.</p>
                ) : (
                  <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto pr-1">
                    {rescheduleSlots.map((s) => (
                      <button
                        key={s.startTime}
                        type="button"
                        disabled={!s.available}
                        onClick={() => setSelectedSlot(s.startTime)}
                        className={`p-2 rounded-sm text-center border transition-all ${
                          !s.available
                            ? "opacity-30 border-transparent bg-black/40 cursor-not-allowed"
                            : selectedSlot === s.startTime
                            ? "bg-accent text-black font-bold border-accent"
                            : "bg-white/[0.03] border-white/10 text-white hover:border-accent"
                        }`}
                      >
                        {formatTo12Hour(s.startTime)}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => setShowRescheduleModal(false)}
                  className="px-3 py-2 rounded-sm text-xs text-text-muted hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedSlot || actionLoading}
                  className="btn-primary !text-xs !py-2 !px-4"
                >
                  Confirm Reschedule &amp; Sync
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
