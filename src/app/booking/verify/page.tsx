"use client";

import { Suspense } from "react";
import AdminVerifyClient from "@/components/admin/AdminVerifyClient";

export default function BookingVerifyStaticPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#050505] flex items-center justify-center text-accent font-mono text-xs tracking-widest uppercase">
          INITIALIZING QR VERIFICATION SCANNER...
        </div>
      }
    >
      <div className="min-h-screen bg-[#050505] text-text-primary p-6">
        <AdminVerifyClient />
      </div>
    </Suspense>
  );
}
