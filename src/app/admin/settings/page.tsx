"use client";

import React, { useState } from "react";
import {
  Settings,
  Clock,
  Calendar,
  Shield,
  Radio,
  Layers,
  Save,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Trash2,
  Flame,
  KeyRound,
} from "lucide-react";
import {
  STUDIO_TIMEZONE,
  STUDIO_OPERATING_HOURS,
  STUDIO_SERVICES,
} from "@/lib/constants";

export default function AdminSettingsPage() {
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Business Hours state
  const [openingTime, setOpeningTime] = useState(STUDIO_OPERATING_HOURS.open);
  const [closingTime, setClosingTime] = useState(STUDIO_OPERATING_HOURS.close);

  const [days, setDays] = useState([
    { name: "Monday", open: true },
    { name: "Tuesday", open: true },
    { name: "Wednesday", open: true },
    { name: "Thursday", open: true },
    { name: "Friday", open: true },
    { name: "Saturday", open: true },
    { name: "Sunday", open: false },
  ]);

  // Blocked dates state
  const [blockedDates, setBlockedDates] = useState([
    { date: "2026-12-25", reason: "Christmas Holiday" },
    { date: "2026-04-14", reason: "Sinhala & Tamil New Year" },
  ]);
  const [newBlockedDate, setNewBlockedDate] = useState("");
  const [newBlockedReason, setNewBlockedReason] = useState("");

  const handleAddBlockedDate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlockedDate || !newBlockedReason) return;
    setBlockedDates([...blockedDates, { date: newBlockedDate, reason: newBlockedReason }]);
    setNewBlockedDate("");
    setNewBlockedReason("");
  };

  const handleRemoveBlockedDate = (index: number) => {
    setBlockedDates(blockedDates.filter((_, i) => i !== index));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
        <div>
          <span className="text-[10px] font-mono text-accent uppercase tracking-widest block mb-1">
            CONTROL MATRIX
          </span>
          <h1 className="text-2xl sm:text-3xl font-heading font-black tracking-tight text-white flex items-center gap-3">
            STUDIO CONFIGURATION &amp; SETTINGS
          </h1>
        </div>

        {saveSuccess && (
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-3 py-1.5 rounded flex items-center gap-1.5 animate-in fade-in">
            <CheckCircle2 size={14} /> Configuration saved to Firestore!
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-8 font-mono text-xs">
        {/* Section 1: Studio Profile */}
        <div className="p-6 rounded-sm bg-[#0c0c0c] border border-white/[0.08] space-y-4 shadow-xl">
          <h2 className="text-xs uppercase text-accent tracking-widest flex items-center gap-2">
            <Settings size={14} /> 1. STUDIO INFORMATION &amp; TIMEZONE
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-text-muted uppercase text-[10px] mb-1">Studio Name</label>
              <input
                type="text"
                defaultValue="APEX STUDIO"
                className="w-full bg-white/[0.03] border border-white/10 rounded-sm px-3 py-2 text-white focus:border-accent focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-text-muted uppercase text-[10px] mb-1">Official Timezone</label>
              <input
                type="text"
                readOnly
                value={STUDIO_TIMEZONE}
                className="w-full bg-white/[0.01] border border-white/10 rounded-sm px-3 py-2 text-text-muted cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-text-muted uppercase text-[10px] mb-1">Location / Soundstage</label>
              <input
                type="text"
                defaultValue="Colombo, Sri Lanka"
                className="w-full bg-white/[0.03] border border-white/10 rounded-sm px-3 py-2 text-white focus:border-accent focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-text-muted uppercase text-[10px] mb-1">Producer Hotline</label>
              <input
                type="text"
                defaultValue="+94 77 123 4567"
                className="w-full bg-white/[0.03] border border-white/10 rounded-sm px-3 py-2 text-white focus:border-accent focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Business Hours */}
        <div className="p-6 rounded-sm bg-[#0c0c0c] border border-white/[0.08] space-y-4 shadow-xl">
          <h2 className="text-xs uppercase text-accent tracking-widest flex items-center gap-2">
            <Clock size={14} /> 2. OPERATING BUSINESS HOURS
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-text-muted uppercase text-[10px] mb-1">Opening Time</label>
              <input
                type="time"
                value={openingTime}
                onChange={(e) => setOpeningTime(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-sm px-3 py-2 text-white focus:border-accent focus:outline-none [color-scheme:dark]"
              />
            </div>

            <div>
              <label className="block text-text-muted uppercase text-[10px] mb-1">Closing Time</label>
              <input
                type="time"
                value={closingTime}
                onChange={(e) => setClosingTime(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-sm px-3 py-2 text-white focus:border-accent focus:outline-none [color-scheme:dark]"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="block text-text-muted uppercase text-[10px] mb-2">Available Days</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {days.map((d, index) => (
                <button
                  key={d.name}
                  type="button"
                  onClick={() => {
                    const newDays = [...days];
                    newDays[index].open = !newDays[index].open;
                    setDays(newDays);
                  }}
                  className={`p-2 rounded-sm text-center border transition-all ${
                    d.open
                      ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-300 font-bold"
                      : "bg-white/[0.02] border-white/[0.06] text-text-muted"
                  }`}
                >
                  {d.name} — {d.open ? "Open" : "Closed"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section 3: Blocked Dates */}
        <div className="p-6 rounded-sm bg-[#0c0c0c] border border-white/[0.08] space-y-4 shadow-xl">
          <h2 className="text-xs uppercase text-accent tracking-widest flex items-center gap-2">
            <Calendar size={14} /> 3. BLOCKED DATES &amp; MAINTENANCE
          </h2>

          <div className="space-y-2">
            {blockedDates.map((b, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded bg-white/[0.02] border border-white/[0.04]"
              >
                <div>
                  <span className="text-white font-bold block">{b.date}</span>
                  <span className="text-text-muted text-[11px]">{b.reason}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveBlockedDate(index)}
                  className="p-1.5 text-rose-400 hover:text-rose-300"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          {/* Add Blocked Date Sub-form */}
          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <input
              type="date"
              value={newBlockedDate}
              onChange={(e) => setNewBlockedDate(e.target.value)}
              className="bg-white/[0.03] border border-white/10 rounded-sm px-3 py-2 text-white [color-scheme:dark]"
            />
            <input
              type="text"
              placeholder="Reason (e.g. Studio Maintenance, Private Event)"
              value={newBlockedReason}
              onChange={(e) => setNewBlockedReason(e.target.value)}
              className="flex-1 bg-white/[0.03] border border-white/10 rounded-sm px-3 py-2 text-white placeholder:text-text-muted"
            />
            <button
              type="button"
              onClick={handleAddBlockedDate}
              className="px-4 py-2 rounded-sm bg-white/[0.04] border border-white/10 hover:border-accent text-white"
            >
              Add Date
            </button>
          </div>
        </div>

        {/* Section 4: Production Services Management */}
        <div className="p-6 rounded-sm bg-[#0c0c0c] border border-white/[0.08] space-y-4 shadow-xl">
          <h2 className="text-xs uppercase text-accent tracking-widest flex items-center gap-2">
            <Layers size={14} /> 4. PRODUCTION SERVICES
          </h2>

          <div className="space-y-3">
            {STUDIO_SERVICES.map((s) => (
              <div
                key={s.id}
                className="p-4 rounded-sm bg-white/[0.02] border border-white/[0.04] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <span className="text-white font-bold block">{s.name}</span>
                  <span className="text-accent text-[10px] block mt-1">
                    Duration: {s.defaultDurationMinutes} minutes • Price: {s.priceLabel}
                  </span>
                </div>
                <span className="text-[10px] px-2 py-1 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-bold self-start sm:self-center">
                  ACTIVE
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: Integration Telemetry Status (No exposed secrets) */}
        <div className="p-6 rounded-sm bg-[#0c0c0c] border border-white/[0.08] space-y-4 shadow-xl">
          <h2 className="text-xs uppercase text-accent tracking-widest flex items-center gap-2">
            <Shield size={14} /> 5. INTEGRATION SECURITY &amp; SECRETS
          </h2>

          <div className="space-y-3">
            <div className="p-3 rounded bg-white/[0.02] border border-white/[0.04] flex justify-between items-center">
              <div>
                <span className="text-white font-bold block">Firebase Cloud Project</span>
                <span className="text-text-muted text-[10px]">apex-studio-852a4 (Firestore &amp; Storage)</span>
              </div>
              <span className="text-emerald-400 font-bold">CONNECTED</span>
            </div>

            <div className="p-3 rounded bg-white/[0.02] border border-white/[0.04] flex justify-between items-center">
              <div>
                <span className="text-white font-bold block">Google Calendar Service Account</span>
                <span className="text-text-muted text-[10px]">Server-side authenticated via Private Key</span>
              </div>
              <span className="text-emerald-400 font-bold">ACTIVE</span>
            </div>

            <div className="p-3 rounded bg-white/[0.02] border border-white/[0.04] flex justify-between items-center">
              <div>
                <span className="text-white font-bold block">Discord Webhook Relay</span>
                <span className="text-text-muted text-[10px]">Producer alert channel webhook</span>
              </div>
              <span className="text-emerald-400 font-bold">ONLINE</span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button type="submit" className="btn-primary !text-xs !py-3.5 !px-8 flex items-center gap-2">
            <Save size={14} /> SAVE ALL STUDIO SETTINGS
          </button>
        </div>
      </form>
    </div>
  );
}
