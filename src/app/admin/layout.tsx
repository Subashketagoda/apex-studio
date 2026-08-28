"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { AdminAuthProvider, useAdminAuth } from "@/context/AdminAuthContext";
import { AdminBookingsProvider } from "@/context/AdminBookingsContext";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminMobileNav from "@/components/admin/AdminMobileNav";
import { Loader2 } from "lucide-react";
import AdminLoginPage from "./login/page";

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, loading } = useAdminAuth();

  const isLoginPage = pathname === "/admin/login";

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-text-primary">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-accent" size={36} />
          <p className="font-mono text-xs text-text-muted tracking-widest uppercase">
            AUTHENTICATING PRODUCER DESK...
          </p>
        </div>
      </div>
    );
  }

  // If not authenticated and not on login page, show Login
  if (!isAuthenticated && !isLoginPage) {
    return <AdminLoginPage />;
  }

  if (isLoginPage && isAuthenticated) {
    router.replace("/admin");
    return null;
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#050505] text-text-primary flex flex-col md:flex-row pb-16 md:pb-0">
      {/* Desktop Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <AdminMobileNav />
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminBookingsProvider>
        <AdminLayoutContent>{children}</AdminLayoutContent>
      </AdminBookingsProvider>
    </AdminAuthProvider>
  );
}
