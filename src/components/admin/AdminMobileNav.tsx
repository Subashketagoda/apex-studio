"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Layers,
  CalendarDays,
  QrCode,
  Ticket,
} from "lucide-react";

const mobileLinks = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Bookings", href: "/admin/bookings", icon: Layers },
  { name: "Calendar", href: "/admin/calendar", icon: CalendarDays },
  { name: "Verify", href: "/admin/verify", icon: QrCode },
  { name: "Passes", href: "/admin/passes", icon: Ticket },
];

export default function AdminMobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0c0c0c]/95 backdrop-blur-md border-t border-white/[0.08] px-2 py-2 flex items-center justify-around">
      {mobileLinks.map((item) => {
        const Icon = item.icon;
        const isActive =
          pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(item.href));

        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-sm text-[10px] font-mono transition-colors ${
              isActive ? "text-accent font-bold" : "text-text-muted hover:text-white"
            }`}
          >
            <Icon size={18} className={isActive ? "text-accent" : "text-text-muted"} />
            <span>{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
