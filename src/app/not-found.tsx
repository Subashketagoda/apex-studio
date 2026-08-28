"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Radio, ArrowLeft, Loader2, Sparkles } from "lucide-react";
import BookingPassClient from "@/components/BookingPassClient";
import AdminVerifyClient from "@/components/admin/AdminVerifyClient";

export default function NotFound() {
  const [dynamicType, setDynamicType] = useState<"pass" | "verify" | "404" | "loading">("loading");
  const [dynamicId, setDynamicId] = useState<string>("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const path = window.location.pathname;

    // Check if URL is a dynamic booking pass link (e.g. /apex-studio/booking/pass/APX-2026-795286)
    const passMatch = path.match(/\/booking\/pass\/([A-Za-z0-9\-_]+)/i);
    if (passMatch && passMatch[1]) {
      setDynamicId(passMatch[1]);
      setDynamicType("pass");
      return;
    }

    // Check if URL is a dynamic verify link (e.g. /apex-studio/booking/verify/APX-2026-795286)
    const verifyMatch = path.match(/\/booking\/verify\/([A-Za-z0-9\-_]+)/i);
    if (verifyMatch && verifyMatch[1]) {
      setDynamicId(verifyMatch[1]);
      setDynamicType("verify");
      return;
    }

    // Otherwise show standard 404
    setDynamicType("404");
  }, []);

  if (dynamicType === "loading") {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-text-primary">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-accent" size={32} />
          <p className="font-mono text-xs text-text-muted tracking-widest uppercase">
            RETRIEVING SOUNDSTAGE RECORD...
          </p>
        </div>
      </div>
    );
  }

  if (dynamicType === "pass" && dynamicId) {
    return <BookingPassClient id={dynamicId} />;
  }

  if (dynamicType === "verify" && dynamicId) {
    return (
      <div className="min-h-screen bg-[#050505] text-text-primary p-6">
        <AdminVerifyClient />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-text-primary flex items-center justify-center p-6 selection:bg-accent selection:text-black">
      <div className="max-w-md w-full p-8 rounded-sm bg-[#0c0c0c] border border-white/10 text-center relative overflow-hidden shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent flex items-center justify-center mx-auto mb-4 text-accent">
          <Radio size={28} />
        </div>

        <span className="text-[10px] font-mono uppercase text-accent tracking-widest block mb-2">
          // 404 NOT FOUND //
        </span>

        <h1 className="text-2xl sm:text-3xl font-heading font-black text-white mb-2">
          SIGNAL LOST
        </h1>

        <p className="text-xs font-mono text-text-secondary leading-relaxed mb-6">
          The requested soundstage page or booking record does not exist on the network.
        </p>

        <Link
          href="/"
          className="btn-primary w-full justify-center !text-xs !py-3 flex items-center gap-2"
        >
          <ArrowLeft size={14} /> Back to Apex Studio
        </Link>
      </div>
    </div>
  );
}
