"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Lock,
  Flame,
  Radio,
  ArrowLeft,
  Mail,
  KeyRound,
  ShieldCheck,
  Loader2,
  Sparkles,
} from "lucide-react";
import { useAdminAuth } from "@/context/AdminAuthContext";

export default function AdminLoginPage() {
  const router = useRouter();
  const { loginWithEmail, loginWithPasscode, isAuthenticated } = useAdminAuth();

  const [authMode, setAuthMode] = useState<"passcode" | "email">("passcode");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // If already authenticated, redirect to /admin
  React.useEffect(() => {
    if (isAuthenticated) {
      router.push("/admin");
    }
  }, [isAuthenticated, router]);

  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = loginWithPasscode(passcode);
    if (res.success) {
      router.push("/admin");
    } else {
      setError(res.error || "Invalid passcode.");
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await loginWithEmail(email, password);
    setLoading(false);

    if (res.success) {
      router.push("/admin");
    } else {
      setError(res.error || "Authentication failed.");
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 sm:p-6 text-text-primary selection:bg-accent selection:text-black">
      <div className="max-w-md w-full p-8 rounded-sm bg-[#0c0c0c] border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.8)] text-center relative overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-accent/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Lock Icon */}
        <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent flex items-center justify-center mx-auto mb-4 text-accent shadow-[0_0_25px_rgba(56,189,248,0.25)]">
          <Lock size={28} />
        </div>

        <h1 className="text-2xl font-heading font-black tracking-tight text-white mb-1">
          PRODUCER DESK ACCESS
        </h1>
        <span className="text-[10px] font-mono uppercase text-accent tracking-widest block mb-6 flex items-center justify-center gap-1">
          <Flame size={12} className="text-amber-400" /> Powered by Firebase Backend
        </span>

        <p className="text-xs text-text-secondary mb-6 font-light leading-relaxed">
          Sign in with administrator credentials to manage live Firestore reservations, Google Calendar synchronizations, and audio soundstage operations.
        </p>

        {/* Auth Mode Switcher */}
        <div className="flex border border-white/10 rounded-sm mb-6 p-0.5 bg-black/50 font-mono text-xs">
          <button
            type="button"
            onClick={() => {
              setAuthMode("passcode");
              setError("");
            }}
            className={`flex-1 py-2 rounded-sm transition-all ${
              authMode === "passcode"
                ? "bg-accent text-black font-bold shadow-md"
                : "text-text-secondary hover:text-white"
            }`}
          >
            Producer Passcode
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode("email");
              setError("");
            }}
            className={`flex-1 py-2 rounded-sm transition-all ${
              authMode === "email"
                ? "bg-accent text-black font-bold shadow-md"
                : "text-text-secondary hover:text-white"
            }`}
          >
            Firebase Auth
          </button>
        </div>

        {/* Passcode Form */}
        {authMode === "passcode" ? (
          <form onSubmit={handlePasscodeSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                required
                placeholder="Enter passcode (default: apexstudio2026)"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-sm px-4 py-3 text-sm text-center text-text-primary focus:border-accent focus:outline-none font-mono placeholder:text-text-muted"
              />
            </div>

            {error && (
              <p className="text-xs text-rose-400 font-mono bg-rose-950/40 border border-rose-500/30 p-2 rounded">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="btn-primary w-full justify-center !py-3.5 !text-xs !tracking-wider shadow-lg shadow-accent/20"
            >
              UNLOCK PRODUCER DESK
            </button>
          </form>
        ) : (
          /* Firebase Email/Password Form */
          <form onSubmit={handleEmailSubmit} className="space-y-3.5 font-mono text-xs text-left">
            <div>
              <label className="block text-text-muted uppercase text-[10px] mb-1">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="email"
                  required
                  placeholder="producer@apexstudio.lk"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-sm pl-9 pr-3 py-2.5 text-white focus:border-accent focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-text-muted uppercase text-[10px] mb-1">
                Admin Password
              </label>
              <div className="relative">
                <KeyRound size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-sm pl-9 pr-3 py-2.5 text-white focus:border-accent focus:outline-none"
                />
              </div>
            </div>

            {error && (
              <p className="text-xs text-rose-400 font-mono bg-rose-950/40 border border-rose-500/30 p-2 rounded">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center !py-3.5 !text-xs !tracking-wider mt-2 shadow-lg shadow-accent/20 flex items-center gap-2"
            >
              {loading && <Loader2 size={14} className="animate-spin" />}
              {loading ? "AUTHENTICATING..." : "LOGIN TO ADMIN"}
            </button>
          </form>
        )}

        <div className="mt-8 pt-4 border-t border-white/[0.06]">
          <Link
            href="/"
            className="text-xs text-text-muted hover:text-accent flex items-center justify-center gap-1 font-mono transition-colors"
          >
            <ArrowLeft size={12} /> Back to Studio Website
          </Link>
        </div>
      </div>
    </div>
  );
}
