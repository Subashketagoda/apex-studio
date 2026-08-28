"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  RefreshCw,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  Users,
  CheckCircle,
  XCircle,
  Edit3,
  Ticket,
  Download,
  RotateCcw,
  ArrowUpDown,
  Layers,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { useAdminBookings } from "@/context/AdminBookingsContext";
import { Booking, BookingStatus, UpdateBookingRequest, TimeSlot } from "@/lib/types/booking";
import { formatTo12Hour } from "@/lib/constants";

export default function AdminBookingsPage() {
  const {
    bookings,
    loading,
    updateStatus,
    updateDetails,
    reschedule,
    retrySync,
    regeneratePass,
    refreshBookings,
  } = useAdminBookings();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [serviceFilter, setServiceFilter] = useState<string>("ALL");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"NEWEST" | "OLDEST" | "UPCOMING" | "DATE">("NEWEST");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Edit Modal State
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [editForm, setEditForm] = useState<UpdateBookingRequest>({});
  const [editLoading, setEditLoading] = useState(false);

  // Reschedule Modal State
  const [reschedulingBooking, setReschedulingBooking] = useState<Booking | null>(null);
  const [newRescheduleDate, setNewRescheduleDate] = useState("");
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [rescheduleLoading, setRescheduleLoading] = useState(false);

  // Fetch slots for reschedule modal
  React.useEffect(() => {
    if (!reschedulingBooking || !newRescheduleDate) return;

    const fetchSlots = async () => {
      setRescheduleLoading(true);
      try {
        const res = await fetch(
          `/api/bookings/availability?date=${newRescheduleDate}&duration=${reschedulingBooking.durationMinutes}`
        );
        const json = await res.json();
        if (json.success && json.data) {
          setAvailableSlots(json.data.slots || []);
        }
      } catch (err) {
        console.error("Failed to load reschedule slots:", err);
      } finally {
        setRescheduleLoading(false);
      }
    };

    fetchSlots();
  }, [reschedulingBooking, newRescheduleDate]);

  // Filter & Search Logic
  const filteredBookings = bookings
    .filter((b) => {
      // Status filter
      if (statusFilter !== "ALL" && b.status !== statusFilter) return false;
      // Service filter
      if (serviceFilter !== "ALL" && b.service !== serviceFilter) return false;
      // Date filter
      if (dateFilter && b.date !== dateFilter) return false;
      // Text search
      const q = searchTerm.toLowerCase();
      if (
        q &&
        !b.id.toLowerCase().includes(q) &&
        !b.customerName.toLowerCase().includes(q) &&
        !b.phone.toLowerCase().includes(q) &&
        !b.email.toLowerCase().includes(q) &&
        !b.service.toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortOrder === "NEWEST") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortOrder === "OLDEST") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortOrder === "UPCOMING" || sortOrder === "DATE") {
        return a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime);
      }
      return 0;
    });

  // Services list for filter
  const uniqueServices = Array.from(new Set(bookings.map((b) => b.service)));

  // Handlers
  const handleStatusChange = async (id: string, status: BookingStatus) => {
    setActionLoadingId(id);
    await updateStatus(id, status);
    setActionLoadingId(null);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBooking) return;
    setEditLoading(true);
    await updateDetails(editingBooking.id, editForm);
    setEditLoading(false);
    setEditingBooking(null);
  };

  const handleRescheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reschedulingBooking || !selectedSlot) return;
    setActionLoadingId(reschedulingBooking.id);
    await reschedule(reschedulingBooking.id, newRescheduleDate, selectedSlot);
    setActionLoadingId(null);
    setReschedulingBooking(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
        <div>
          <span className="text-[10px] font-mono text-accent uppercase tracking-widest block mb-1">
            DATABASE REGISTRY
          </span>
          <h1 className="text-2xl sm:text-3xl font-heading font-black tracking-tight text-white">
            ALL STUDIO RESERVATIONS
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-text-muted">
            Total: <strong className="text-white">{filteredBookings.length}</strong> records
          </span>
          <button
            onClick={refreshBookings}
            className="px-3 py-1.5 rounded-sm bg-white/[0.04] border border-white/10 hover:border-accent text-xs font-mono text-white flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw size={12} className={loading ? "animate-spin text-accent" : ""} />
            Sync Refresh
          </button>
        </div>
      </div>

      {/* Advanced Filter and Search Bar */}
      <div className="p-4 rounded-sm bg-[#0c0c0c] border border-white/[0.08] space-y-3 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Box */}
          <div className="md:col-span-4 relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search by ID, name, phone, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-sm pl-9 pr-3 py-2 text-xs text-white font-mono placeholder:text-text-muted focus:border-accent focus:outline-none"
            />
          </div>

          {/* Service Dropdown */}
          <div className="md:col-span-3">
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="w-full bg-[#111111] border border-white/10 rounded-sm px-3 py-2 text-xs text-white font-mono focus:border-accent focus:outline-none"
            >
              <option value="ALL">All Services</option>
              {uniqueServices.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Date Filter */}
          <div className="md:col-span-3">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-sm px-3 py-2 text-xs text-white font-mono focus:border-accent focus:outline-none [color-scheme:dark]"
            />
          </div>

          {/* Sort Order */}
          <div className="md:col-span-2">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="w-full bg-[#111111] border border-white/10 rounded-sm px-3 py-2 text-xs text-white font-mono focus:border-accent focus:outline-none"
            >
              <option value="NEWEST">Newest First</option>
              <option value="OLDEST">Oldest First</option>
              <option value="UPCOMING">Upcoming First</option>
              <option value="DATE">By Date</option>
            </select>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-white/[0.04]">
          {["ALL", "PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-sm text-[11px] font-mono uppercase tracking-wider transition-colors ${
                statusFilter === tab
                  ? "bg-accent text-black font-bold"
                  : "bg-white/[0.02] border border-white/[0.06] text-text-secondary hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}

          {(searchTerm || statusFilter !== "ALL" || serviceFilter !== "ALL" || dateFilter) && (
            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("ALL");
                setServiceFilter("ALL");
                setDateFilter("");
              }}
              className="ml-auto text-[11px] font-mono text-text-muted hover:text-accent underline"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Bookings Table */}
      <div className="border border-white/[0.08] rounded-sm bg-[#0c0c0c] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-white/[0.02] border-b border-white/[0.06] text-text-muted uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Booking ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Service</th>
                <th className="py-3 px-4">Date &amp; Time</th>
                <th className="py-3 px-4">Guests</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Sync Telemetry</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-text-muted">
                    No reservations matching the current search criteria.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => {
                  const isBusy = actionLoadingId === b.id;

                  return (
                    <tr key={b.id} className="hover:bg-white/[0.02] transition-colors group">
                      {/* ID + Version */}
                      <td className="py-3.5 px-4 font-bold text-accent">
                        <Link href={`/admin/bookings/${b.id}`} className="hover:underline">
                          {b.id}
                        </Link>
                        <span className="text-[9px] font-mono text-text-muted block">
                          v{b.version || 1}
                        </span>
                      </td>

                      {/* Customer */}
                      <td className="py-3.5 px-4">
                        <span className="text-white font-medium block">{b.customerName}</span>
                        <span className="text-[10px] text-text-muted block">{b.phone}</span>
                      </td>

                      {/* Service */}
                      <td className="py-3.5 px-4 text-text-secondary max-w-[200px] truncate">
                        {b.service}
                      </td>

                      {/* Date & Time */}
                      <td className="py-3.5 px-4 text-text-secondary">
                        <span className="text-white block">{b.date}</span>
                        <span className="text-[10px] text-text-muted block">
                          {formatTo12Hour(b.startTime)} – {formatTo12Hour(b.endTime)} ({b.durationMinutes}m)
                        </span>
                      </td>

                      {/* Guests */}
                      <td className="py-3.5 px-4 text-text-secondary">{b.numberOfPeople}</td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[9px] uppercase px-2 py-0.5 rounded font-bold inline-block ${
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

                      {/* Sync Telemetry */}
                      <td className="py-3.5 px-4 space-y-1">
                        <div className="flex items-center gap-1 text-[9px]">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              b.googleCalendarSyncStatus === "SYNCED"
                                ? "bg-emerald-400"
                                : "bg-rose-400"
                            }`}
                          />
                          <span className="text-text-muted">GCal:</span>
                          <span
                            className={
                              b.googleCalendarSyncStatus === "SYNCED"
                                ? "text-emerald-300"
                                : "text-rose-300 font-bold"
                            }
                          >
                            {b.googleCalendarSyncStatus || "PENDING"}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 text-[9px]">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              b.discordSyncStatus === "SYNCED"
                                ? "bg-emerald-400"
                                : "bg-rose-400"
                            }`}
                          />
                          <span className="text-text-muted">Discord:</span>
                          <span
                            className={
                              b.discordSyncStatus === "SYNCED"
                                ? "text-emerald-300"
                                : "text-rose-300 font-bold"
                            }
                          >
                            {b.discordSyncStatus || "PENDING"}
                          </span>
                        </div>
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/admin/bookings/${b.id}`}
                            className="p-1.5 rounded bg-white/[0.04] border border-white/10 hover:border-accent text-accent"
                            title="Inspect details"
                          >
                            Inspect
                          </Link>

                          {b.status === "PENDING" && (
                            <button
                              disabled={isBusy}
                              onClick={() => handleStatusChange(b.id, "CONFIRMED")}
                              className="px-2 py-1 rounded bg-emerald-500 text-black font-bold text-[10px] hover:bg-emerald-400 transition-colors"
                              title="Confirm booking"
                            >
                              Confirm
                            </button>
                          )}

                          <button
                            onClick={() => {
                              setEditingBooking(b);
                              setEditForm({
                                customerName: b.customerName,
                                phone: b.phone,
                                email: b.email,
                                service: b.service,
                                numberOfPeople: b.numberOfPeople,
                                notes: b.notes || "",
                              });
                            }}
                            className="p-1.5 rounded bg-white/[0.04] border border-white/10 hover:border-accent text-text-secondary hover:text-white"
                            title="Edit details"
                          >
                            <Edit3 size={13} />
                          </button>

                          <button
                            onClick={() => {
                              setReschedulingBooking(b);
                              setNewRescheduleDate(b.date);
                              setSelectedSlot(b.startTime);
                            }}
                            className="p-1.5 rounded bg-white/[0.04] border border-white/10 hover:border-accent text-text-secondary hover:text-white"
                            title="Reschedule session"
                          >
                            <Calendar size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Details Modal */}
      {editingBooking && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setEditingBooking(null)}
        >
          <div
            className="max-w-lg w-full p-6 rounded-sm bg-[#0c0c0c] border border-white/15 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-3 border-b border-white/[0.06] mb-4">
              <div>
                <h3 className="text-base font-heading font-bold text-white">EDIT RESERVATION</h3>
                <span className="text-xs font-mono text-accent">{editingBooking.id}</span>
              </div>
              <button
                onClick={() => setEditingBooking(null)}
                className="text-text-muted hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 font-mono text-xs">
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
                  onClick={() => setEditingBooking(null)}
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
      {reschedulingBooking && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setReschedulingBooking(null)}
        >
          <div
            className="max-w-lg w-full p-6 rounded-sm bg-[#0c0c0c] border border-white/15 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-3 border-b border-white/[0.06] mb-4">
              <div>
                <h3 className="text-base font-heading font-bold text-white">RESCHEDULE SESSION</h3>
                <span className="text-xs font-mono text-accent">{reschedulingBooking.id}</span>
              </div>
              <button
                onClick={() => setReschedulingBooking(null)}
                className="text-text-muted hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRescheduleSubmit} className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-text-muted uppercase text-[10px] mb-1">New Date</label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split("T")[0]}
                  value={newRescheduleDate}
                  onChange={(e) => setNewRescheduleDate(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-sm px-3 py-2 text-white focus:border-accent focus:outline-none [color-scheme:dark]"
                />
              </div>

              <div>
                <label className="block text-text-muted uppercase text-[10px] mb-1">
                  Available Slots (Sri Lanka Time)
                </label>
                {rescheduleLoading ? (
                  <p className="text-accent py-4 text-center">Checking availability...</p>
                ) : availableSlots.length === 0 ? (
                  <p className="text-text-muted py-4 text-center">No slots available on this date.</p>
                ) : (
                  <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto pr-1">
                    {availableSlots.map((s) => (
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
                  onClick={() => setReschedulingBooking(null)}
                  className="px-3 py-2 rounded-sm text-xs text-text-muted hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedSlot}
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
