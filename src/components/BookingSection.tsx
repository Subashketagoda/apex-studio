"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Phone,
  Mail,
  Users,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Radio,
  ExternalLink,
  Sparkles,
  MessageSquare,
  ShieldCheck,
  CalendarCheck,
  Layers,
  Download,
} from "lucide-react";
import Link from "next/link";
import { Booking, TimeSlot } from "@/lib/types/booking";
import { formatTo12Hour, STUDIO_TIMEZONE } from "@/lib/constants";
import { getClientAvailableSlots, createClientBooking } from "@/lib/services/clientBookingService";
import DigitalPassCard from "@/components/DigitalPassCard";
import { downloadPassAsPNG } from "@/lib/utils/downloadPassImage";

const services = [
  {
    id: "video-podcast",
    name: "Video Podcast (4K Multi-Cam)",
    desc: "3x 4K Sony Cameras + RØDE Dynamic Mics + Studio Key Lighting + Sound Engineer",
    badge: "Most Popular",
  },
  {
    id: "audio-podcast",
    name: "Audio-Only Podcast Recording",
    desc: "Acoustically isolated room + Up to 4 RØDE PodMics + Multitrack WAV delivery",
    badge: "Audio Pure",
  },
  {
    id: "content-batch",
    name: "Short-Form Content Batching",
    desc: "High-speed filming setup for TikToks, Reels, and Shorts with teleprompter",
    badge: "Viral Growth",
  },
  {
    id: "live-stream",
    name: "Live Broadcast & Webcast",
    desc: "Direct multi-platform RTMP streaming with ATEM switcher and real-time audio mix",
    badge: "Broadcast Live",
  },
];

const durations = [
  { label: "1 Hour", value: 60 },
  { label: "2 Hours", value: 120, default: true },
  { label: "3 Hours", value: 180 },
  { label: "4 Hours (Half Day)", value: 240 },
];

export default function BookingSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Flow step: 1 = Service & Duration, 2 = Date & Time Slots, 3 = Host Details, 4 = Confirmation
  const [step, setStep] = useState(1);

  // Form selections
  const [selectedService, setSelectedService] = useState(services[0].name);
  const [duration, setDuration] = useState(120);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<string>("");

  // Slots state
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotsError, setSlotsError] = useState("");

  // Contact info
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [numberOfPeople, setNumberOfPeople] = useState(2);
  const [notes, setNotes] = useState("");

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [downloadingPass, setDownloadingPass] = useState(false);

  // Initialize minimum date to today in YYYY-MM-DD
  const todayStr = new Date().toISOString().split("T")[0];

  useEffect(() => {
    // Default selected date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setSelectedDate(tomorrow.toISOString().split("T")[0]);
  }, []);

  // Fetch real-time available time slots whenever date or duration changes
  useEffect(() => {
    if (!selectedDate) return;

    let isMounted = true;
    const fetchSlots = async () => {
      setLoadingSlots(true);
      setSlotsError("");
      setSelectedSlot("");

      try {
        const availableSlots = await getClientAvailableSlots(selectedDate, duration);
        if (isMounted) {
          if (availableSlots && availableSlots.length > 0) {
            setSlots(availableSlots);
          } else {
            setSlotsError("No soundstage slots available on this date.");
          }
        }
      } catch (err) {
        console.error("Availability query error:", err);
        if (isMounted) {
          setSlotsError("Unable to calculate studio schedule. Please try another date.");
        }
      } finally {
        if (isMounted) setLoadingSlots(false);
      }
    };

    fetchSlots();
    return () => {
      isMounted = false;
    };
  }, [selectedDate, duration]);

  // Handle final submission
  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) return;

    setSubmitting(true);
    setSubmitError("");

    try {
      const result = await createClientBooking({
        customerName,
        phone,
        email,
        service: selectedService,
        date: selectedDate,
        startTime: selectedSlot,
        durationMinutes: duration,
        numberOfPeople,
        notes,
      });

      if (result.success && result.data) {
        setConfirmedBooking(result.data);
        setStep(4);
      } else {
        setSubmitError(
          result.error || "Unable to complete reservation. Please select another slot."
        );
      }
    } catch (err: any) {
      console.error("Booking submission error:", err);
      setSubmitError(err?.message || "Failed to confirm studio reservation. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setConfirmedBooking(null);
    setStep(1);
    setSelectedSlot("");
    setCustomerName("");
    setPhone("");
    setEmail("");
    setNotes("");
    setSubmitError("");
  };

  // Generate Google Calendar Add Link
  const getGoogleCalendarUrl = (booking: Booking) => {
    const startIso = `${booking.date.replace(/-/g, "")}T${booking.startTime.replace(":", "")}00`;
    const endIso = `${booking.date.replace(/-/g, "")}T${booking.endTime.replace(":", "")}00`;
    const title = encodeURIComponent(`Apex Studio: ${booking.service}`);
    const details = encodeURIComponent(
      `Apex Studio Session: ${booking.service}\nBooking Ref: ${booking.id}\nGuests: ${booking.numberOfPeople}\nTimezone: ${STUDIO_TIMEZONE}`
    );
    const location = encodeURIComponent("Apex Studio Soundstage, Colombo, Sri Lanka");

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startIso}/${endIso}&details=${details}&location=${location}&ctz=${STUDIO_TIMEZONE}`;
  };

  return (
    <section id="booking" ref={sectionRef} className="section-padding relative bg-[#050505] overflow-hidden">
      {/* Dynamic Background Ambient Aura */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] pointer-events-none opacity-10"
        style={{
          background: "radial-gradient(circle, #38bdf8 0%, transparent 70%)",
          filter: "blur(120px)",
        }}
      />

      <div className="max-w-[1280px] mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 mb-3 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-md">
            <Radio size={12} className="text-accent animate-pulse" />
            <span
              className="text-[10px] sm:text-[11px] font-mono tracking-[0.25em] text-accent uppercase font-semibold"
              style={{ fontFamily: "var(--font-body)" }}
            >
              LIVE STUDIO CALENDAR • ASIA/COLOMBO
            </span>
          </div>

          <h2
            className="text-4xl sm:text-6xl lg:text-7xl font-heading font-black tracking-tight text-white mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            YOUR NEXT EPISODE <br />
            <span className="text-gradient">STARTS HERE.</span>
          </h2>

          <p className="text-text-secondary text-sm sm:text-base font-light leading-relaxed">
            Real-time studio availability synced with Google Calendar. Select your service, reserve your time slot, and step into the soundstage.
          </p>
        </div>

        {/* Multi-Step Booking Card Container */}
        <div className="max-w-4xl mx-auto bg-[#0d0d0d] border border-white/[0.09] rounded-sm p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          {/* Top Progress Tracker */}
          {step < 4 && (
            <div className="mb-8 border-b border-white/[0.06] pb-6">
              <div className="flex items-center justify-between font-mono text-[11px]">
                <span className={step >= 1 ? "text-accent font-bold" : "text-text-muted"}>
                  01 / SERVICE &amp; DURATION
                </span>
                <span className={step >= 2 ? "text-accent font-bold" : "text-text-muted"}>
                  02 / DATE &amp; SLOTS
                </span>
                <span className={step >= 3 ? "text-accent font-bold" : "text-text-muted"}>
                  03 / HOST DETAILS
                </span>
              </div>
              <div className="h-[2px] w-full bg-white/[0.06] mt-3 relative overflow-hidden">
                <div
                  className="h-full bg-accent shadow-[0_0_8px_#38bdf8] transition-all duration-500"
                  style={{ width: `${((step - 1) / 2) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* STEP 1: SERVICE & DURATION */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-8"
            >
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-text-secondary mb-4">
                  Select Production Service
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {services.map((srv) => (
                    <div
                      key={srv.id}
                      onClick={() => setSelectedService(srv.name)}
                      className={`p-5 rounded-sm border cursor-pointer transition-all duration-300 ${
                        selectedService === srv.name
                          ? "bg-[#141414] border-accent shadow-lg shadow-accent/[0.06]"
                          : "bg-white/[0.02] border-white/[0.06] hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-accent font-semibold px-2 py-0.5 rounded bg-black/60 border border-accent/30">
                          {srv.badge}
                        </span>
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            selectedService === srv.name
                              ? "border-accent bg-accent"
                              : "border-white/20"
                          }`}
                        >
                          {selectedService === srv.name && (
                            <div className="w-1.5 h-1.5 rounded-full bg-black" />
                          )}
                        </div>
                      </div>
                      <h4
                        className="text-base font-heading font-bold text-white mb-1"
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        {srv.name}
                      </h4>
                      <p className="text-xs text-text-secondary font-light leading-relaxed">
                        {srv.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-text-secondary mb-4">
                  Select Session Duration
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {durations.map((d) => (
                    <button
                      key={d.value}
                      type="button"
                      onClick={() => setDuration(d.value)}
                      className={`p-3.5 rounded-sm border text-xs font-mono text-center transition-all ${
                        duration === d.value
                          ? "bg-accent text-black font-bold border-accent shadow-md shadow-accent/20"
                          : "bg-white/[0.02] border-white/[0.06] text-text-secondary hover:text-white hover:border-white/20"
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="btn-primary group !py-3 !px-7 !text-xs"
                >
                  <span>CHECK AVAILABILITY</span>
                  <ArrowRight
                    size={14}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: DATE & AVAILABLE TIME SLOTS */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-6"
            >
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-text-secondary mb-2">
                  Select Studio Date
                </label>
                <input
                  type="date"
                  min={todayStr}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full sm:w-72 bg-white/[0.03] border border-white/10 rounded-sm px-4 py-3 text-sm text-text-primary focus:border-accent focus:outline-none [color-scheme:dark]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-xs font-mono uppercase tracking-widest text-text-secondary">
                    Available Time Slots (Sri Lanka Time)
                  </label>
                  <span className="text-[11px] font-mono text-accent">
                    {slots.filter((s) => s.available).length} slots open
                  </span>
                </div>

                {loadingSlots ? (
                  <div className="py-12 text-center text-xs font-mono text-accent animate-pulse">
                    Checking Google Calendar availability in Asia/Colombo...
                  </div>
                ) : slotsError ? (
                  <div className="p-4 bg-rose-950/30 border border-rose-500/20 text-rose-300 text-xs font-mono rounded">
                    {slotsError}
                  </div>
                ) : slots.length === 0 ? (
                  <div className="p-8 text-center bg-white/[0.02] border border-white/[0.06] rounded-sm text-xs text-text-muted">
                    No available time slots on this date. Please select another day.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 max-h-64 overflow-y-auto pr-1">
                    {slots.map((s) => (
                      <button
                        key={s.startTime}
                        type="button"
                        disabled={!s.available}
                        onClick={() => setSelectedSlot(s.startTime)}
                        className={`p-3 rounded-sm border text-xs font-mono text-left transition-all ${
                          !s.available
                            ? "opacity-30 border-transparent bg-black/40 cursor-not-allowed text-text-muted"
                            : selectedSlot === s.startTime
                            ? "bg-accent text-black font-bold border-accent shadow-md shadow-accent/20"
                            : "bg-white/[0.02] border-white/[0.08] text-white hover:border-accent"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{formatTo12Hour(s.startTime)}</span>
                          {s.available && selectedSlot === s.startTime && (
                            <CheckCircle2 size={12} className="text-black" />
                          )}
                        </div>
                        <span className="text-[10px] block opacity-80 mt-0.5">
                          {duration} mins
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="btn-outline !py-3 !px-5 !text-xs"
                >
                  <ArrowLeft size={13} />
                  <span>BACK</span>
                </button>

                <button
                  type="button"
                  disabled={!selectedSlot}
                  onClick={() => setStep(3)}
                  className="btn-primary group !py-3 !px-7 !text-xs disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span>ENTER DETAILS</span>
                  <ArrowRight
                    size={14}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: HOST DETAILS & SUBMIT */}
          {step === 3 && (
            <motion.form
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              onSubmit={handleSubmitBooking}
              className="space-y-6"
            >
              {/* Summary Strip */}
              <div className="p-4 rounded-sm bg-[#141414] border border-white/[0.08] flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-white/90">
                <span className="text-accent font-bold">{selectedService}</span>
                <span>{selectedDate}</span>
                <span>
                  {formatTo12Hour(selectedSlot)} ({duration}m)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-text-secondary mb-1">
                    Host / Creator Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kasun Fernando"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-sm px-4 py-2.5 text-xs text-text-primary focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-text-secondary mb-1">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+94 77 123 4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-sm px-4 py-2.5 text-xs text-text-primary focus:border-accent focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-text-secondary mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="creator@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-sm px-4 py-2.5 text-xs text-text-primary focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-text-secondary mb-1">
                    Number of Guests / Hosts
                  </label>
                  <select
                    value={numberOfPeople}
                    onChange={(e) => setNumberOfPeople(Number(e.target.value))}
                    className="w-full bg-[#111111] border border-white/10 rounded-sm px-4 py-2.5 text-xs text-text-primary focus:border-accent focus:outline-none"
                  >
                    <option value={1}>1 Person (Solo Show)</option>
                    <option value={2}>2 People (Host + Guest)</option>
                    <option value={3}>3 People</option>
                    <option value={4}>4 People (Panel Setup)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-text-secondary mb-1">
                  Show Notes / Special Requests
                </label>
                <textarea
                  rows={3}
                  placeholder="Tell us about your episode topic, required camera angles, or graphics..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-sm p-3 text-xs text-text-primary focus:border-accent focus:outline-none resize-none"
                />
              </div>

              {submitError && (
                <div className="p-3.5 bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs font-mono rounded flex items-center gap-2">
                  <AlertCircle size={14} className="flex-shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="btn-outline !py-3 !px-5 !text-xs"
                >
                  <ArrowLeft size={13} />
                  <span>BACK</span>
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary !py-3 !px-8 !text-xs disabled:opacity-50"
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <Radio size={14} className="animate-spin text-black" />
                      RESERVING WITH CALENDAR...
                    </span>
                  ) : (
                    <span>CONFIRM &amp; BOOK SESSION →</span>
                  )}
                </button>
              </div>
            </motion.form>
          )}

          {/* STEP 4: CINEMATIC CONFIRMATION SCREEN */}
          {step === 4 && confirmedBooking && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-center py-6 space-y-6"
            >
              {/* Subtle Success Badge */}
              <div className="w-16 h-16 rounded-full bg-accent/15 border border-accent flex items-center justify-center mx-auto text-accent shadow-xl shadow-accent/20">
                <CheckCircle2 size={32} />
              </div>

              <div>
                <span className="text-xs font-mono tracking-[0.3em] uppercase text-accent font-semibold block mb-1">
                  // RESERVATION CONFIRMED
                </span>
                <h3
                  className="text-3xl sm:text-5xl font-heading font-black text-white"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  YOU&apos;RE BOOKED.
                </h3>
                <p className="text-xs sm:text-sm text-text-secondary mt-1 font-light">
                  Your session has been successfully reserved.
                </p>
              </div>

              {/* Status Checklist */}
              <div className="flex flex-wrap items-center justify-center gap-3 font-mono text-xs text-emerald-400">
                <span className="flex items-center gap-1.5 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1 rounded">
                  <CheckCircle2 size={13} /> Google Calendar Added
                </span>
                <span className="flex items-center gap-1.5 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1 rounded">
                  <CheckCircle2 size={13} /> Booking Confirmed
                </span>
                <span className="flex items-center gap-1.5 bg-accent/15 border border-accent/40 px-3 py-1 rounded text-accent">
                  <Sparkles size={13} /> Booking Pass Ready
                </span>
              </div>

              {/* Embedded Live Digital VIP Pass */}
              <div className="flex flex-col items-center justify-center py-2 space-y-3">
                <DigitalPassCard booking={confirmedBooking} />

                {/* Direct High-Resolution 1200x1800 PNG Download Button */}
                <button
                  type="button"
                  disabled={downloadingPass}
                  onClick={async () => {
                    setDownloadingPass(true);
                    try {
                      await downloadPassAsPNG(confirmedBooking);
                    } catch (err) {
                      console.error("Pass download error:", err);
                    } finally {
                      setDownloadingPass(false);
                    }
                  }}
                  className="btn-primary w-full max-w-[380px] justify-center !py-3.5 !text-xs !tracking-wider flex items-center gap-2 shadow-lg shadow-accent/25"
                >
                  <Download size={15} />
                  <span>
                    {downloadingPass ? "GENERATING 1200x1800 HD PASS..." : "DOWNLOAD PASS (PNG IMAGE)"}
                  </span>
                </button>
              </div>

              {/* Secondary Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Link
                  href={`/booking/pass/${confirmedBooking.id}`}
                  className="px-5 py-3 rounded-sm bg-white/[0.04] border border-white/10 hover:border-accent text-xs font-mono text-white flex items-center justify-center gap-1.5 transition-colors w-full sm:w-auto"
                >
                  <Sparkles size={14} className="text-accent" />
                  <span>FULL PASS PAGE</span>
                  <ArrowRight size={14} />
                </Link>

                <a
                  href={getGoogleCalendarUrl(confirmedBooking)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-sm bg-white/[0.04] border border-white/10 hover:border-accent text-xs font-mono text-white flex items-center justify-center gap-1.5 transition-colors w-full sm:w-auto"
                >
                  <CalendarCheck size={14} className="text-accent" />
                  <span>ADD TO CALENDAR</span>
                </a>

                <a
                  href={`https://wa.me/94770000000?text=Hi%20Apex%20Studio,%20here%20is%20my%20confirmed%20booking%20pass%20${confirmedBooking.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-sm bg-white/[0.04] border border-white/10 hover:border-accent text-xs font-mono text-white flex items-center justify-center gap-1.5 transition-colors w-full sm:w-auto"
                >
                  <MessageSquare size={14} className="text-emerald-400" />
                  <span>PRODUCER CHAT</span>
                </a>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleReset}
                  className="text-xs font-mono text-text-muted hover:text-white transition-colors"
                >
                  ← Book Another Session
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
