"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  Search,
  RefreshCw,
  Radio,
  CheckCircle2,
  AlertTriangle,
  Info,
  QrCode,
  LogOut,
  Sparkles,
} from "lucide-react";
import { useAdminBookings } from "@/context/AdminBookingsContext";
import { useAdminAuth } from "@/context/AdminAuthContext";

export default function AdminHeader() {
  const router = useRouter();
  const { logout } = useAdminAuth();
  const {
    loading,
    refreshBookings,
    isRealtimeActive,
    notifications,
    unreadNotificationCount,
    markNotificationsAsRead,
  } = useAdminBookings();

  const [searchCode, setSearchCode] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);

  const handleQuickScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchCode.trim()) return;
    const cleanId = searchCode.trim().replace(/^.*\/booking\/verify\//, "");
    router.push(`/admin/verify?id=${encodeURIComponent(cleanId)}`);
  };

  return (
    <header className="sticky top-0 z-20 border-b border-white/[0.08] bg-[#0c0c0c]/90 backdrop-blur-md px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
      {/* Left: Live Status */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isRealtimeActive ? "bg-emerald-400" : "bg-amber-400"
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                isRealtimeActive ? "bg-emerald-500" : "bg-amber-500"
              }`}
            />
          </span>
          <span className="text-[11px] font-mono font-bold tracking-wider text-white hidden sm:inline">
            APEX STUDIO • SOUNDSTAGE DESK
          </span>
          <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/[0.04] border border-white/10 text-text-muted">
            Asia/Colombo
          </span>
        </div>
      </div>

      {/* Right: Quick Scanner, Refresh, Notifications */}
      <div className="flex items-center gap-2.5">
        {/* Quick ID / Pass Search */}
        <form onSubmit={handleQuickScan} className="relative hidden md:block">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Scan / Find Pass (APX-...)"
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
            className="w-56 bg-white/[0.03] border border-white/10 rounded-sm pl-8 pr-3 py-1.5 text-xs text-white font-mono placeholder:text-text-muted focus:border-accent focus:outline-none"
          />
        </form>

        {/* Refresh Button */}
        <button
          onClick={refreshBookings}
          disabled={loading}
          className="p-2 rounded-sm bg-white/[0.03] border border-white/10 hover:border-accent text-text-muted hover:text-white transition-colors"
          title="Manual refresh"
        >
          <RefreshCw size={14} className={loading ? "animate-spin text-accent" : ""} />
        </button>

        {/* Notification Bell Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              if (!showNotifications) markNotificationsAsRead();
            }}
            className="p-2 rounded-sm bg-white/[0.03] border border-white/10 hover:border-accent text-text-muted hover:text-white transition-colors relative"
            title="Notifications"
          >
            <Bell size={14} />
            {unreadNotificationCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-black font-bold font-mono text-[9px] rounded-full flex items-center justify-center animate-bounce">
                {unreadNotificationCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-sm bg-[#0c0c0c] border border-white/15 shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-3">
                <span className="text-xs font-heading font-bold text-white uppercase tracking-wider">
                  REAL-TIME NOTIFICATIONS
                </span>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-text-muted hover:text-white text-xs"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {notifications.length === 0 ? (
                  <p className="text-xs font-mono text-text-muted text-center py-6">
                    No new activity alerts.
                  </p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className="p-2.5 rounded-sm bg-white/[0.02] border border-white/[0.04] hover:border-accent/40 text-xs font-mono transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-white text-[11px]">{n.title}</span>
                        <span className="text-[9px] text-text-muted">
                          {new Date(n.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <p className="text-text-secondary text-[11px] leading-relaxed">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Mobile Logout Button */}
        <button
          onClick={logout}
          className="md:hidden p-2 rounded-sm border border-rose-500/30 bg-rose-500/10 text-rose-300 text-xs font-mono"
          title="Logout"
        >
          <LogOut size={14} />
        </button>
      </div>
    </header>
  );
}
