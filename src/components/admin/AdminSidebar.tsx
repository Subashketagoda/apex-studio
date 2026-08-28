"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  Ticket,
  QrCode,
  BarChart3,
  History,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Radio,
  Sparkles,
  Layers,
  Flame,
  UserCheck,
} from "lucide-react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { useAdminBookings } from "@/context/AdminBookingsContext";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Bookings", href: "/admin/bookings", icon: Layers },
  { name: "Calendar", href: "/admin/calendar", icon: CalendarDays },
  { name: "Passes Vault", href: "/admin/passes", icon: Ticket },
  { name: "QR Verification", href: "/admin/verify", icon: QrCode },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Audit Log", href: "/admin/activity", icon: History },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAdminAuth();
  const { isRealtimeActive, bookings } = useAdminBookings();
  const [collapsed, setCollapsed] = useState(false);

  const pendingCount = bookings.filter((b) => b.status === "PENDING").length;

  return (
    <aside
      className={`hidden md:flex flex-col border-r border-white/[0.08] bg-[#0c0c0c] transition-all duration-300 z-30 sticky top-0 h-screen ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Top Brand Header */}
      <div className="p-5 border-b border-white/[0.08] flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-sm bg-accent/10 border border-accent flex items-center justify-center text-accent shrink-0 shadow-[0_0_15px_rgba(56,189,248,0.3)]">
            <Radio size={18} className="animate-pulse" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-heading font-black tracking-wider text-white">APEX STUDIO</span>
              <span className="text-[9px] font-mono text-accent uppercase tracking-widest flex items-center gap-1">
                <Flame size={10} className="text-amber-400" /> Producer Desk
              </span>
            </div>
          )}
        </Link>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded bg-white/[0.03] border border-white/10 hover:border-accent text-text-muted hover:text-white transition-colors"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Realtime Telemetry Pill */}
      {!collapsed && (
        <div className="px-5 py-3 border-b border-white/[0.04] bg-white/[0.01]">
          <div className="flex items-center justify-between text-[10px] font-mono">
            <span className="text-text-muted">FIRESTORE SYNC:</span>
            <span
              className={`flex items-center gap-1 font-bold ${
                isRealtimeActive ? "text-emerald-400" : "text-amber-400"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isRealtimeActive ? "bg-emerald-400 animate-ping" : "bg-amber-400"
                }`}
              />
              {isRealtimeActive ? "LIVE ACTIVE" : "CONNECTING"}
            </span>
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(item.href));

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-sm text-xs font-mono transition-all group ${
                isActive
                  ? "bg-accent text-black font-bold shadow-md shadow-accent/20"
                  : "text-text-secondary hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <Icon size={16} className={`shrink-0 ${isActive ? "text-black" : "text-text-muted group-hover:text-accent"}`} />
              {!collapsed && <span>{item.name}</span>}

              {/* Badge for pending bookings */}
              {item.name === "Bookings" && pendingCount > 0 && !collapsed && (
                <span className="ml-auto px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500 text-black animate-pulse">
                  {pendingCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom User Info & Logout */}
      <div className="p-4 border-t border-white/[0.08] bg-[#080808]">
        {!collapsed ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center text-accent">
                <UserCheck size={14} />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-mono font-bold text-white truncate">
                  {user?.email || "Producer Master"}
                </p>
                <p className="text-[9px] font-mono text-text-muted">Administrator</p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <Link
                href="/"
                target="_blank"
                className="flex-1 py-1.5 px-2 rounded-sm bg-white/[0.03] border border-white/10 hover:border-accent text-[10px] font-mono text-center text-text-muted hover:text-white transition-colors"
              >
                Website ↗
              </Link>
              <button
                onClick={logout}
                className="py-1.5 px-2 rounded-sm border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-[10px] font-mono flex items-center justify-center gap-1 transition-colors"
                title="Sign out of Admin Portal"
              >
                <LogOut size={12} />
                Logout
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={logout}
            className="w-full py-2 flex items-center justify-center rounded-sm bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-500/20 transition-colors"
            title="Logout"
          >
            <LogOut size={16} />
          </button>
        )}
      </div>
    </aside>
  );
}
