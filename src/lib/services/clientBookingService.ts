"use client";

import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { Booking, CreateBookingRequest, TimeSlot } from "@/lib/types/booking";
import {
  STUDIO_OPERATING_HOURS,
  STUDIO_TIMEZONE,
  addMinutesToTime,
  doIntervalsOverlap,
  formatTo12Hour,
  generateBookingId,
} from "@/lib/constants";

/**
 * Robust Client-Side Booking & Availability Service
 * Seamlessly works across both Server-Rendered (Node/Next.js) and Static Host (GitHub Pages) environments.
 */
export async function getClientAvailableSlots(
  dateStr: string,
  durationMinutes: number = 120
): Promise<TimeSlot[]> {
  // 1. Try server API first if available
  try {
    const res = await fetch(
      `/api/bookings/availability?date=${dateStr}&duration=${durationMinutes}`,
      { cache: "no-store" }
    );
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.data?.slots)) {
        return data.data.slots;
      }
    }
  } catch {
    // Fall back to client Firestore calculation below
  }

  // 2. Client-Side calculation directly with Firebase Firestore
  const slots: TimeSlot[] = [];
  const openTime = STUDIO_OPERATING_HOURS.open; // "09:00"
  const closeTime = STUDIO_OPERATING_HOURS.close; // "22:00"
  const interval = STUDIO_OPERATING_HOURS.slotIntervalMinutes || 60;

  // Fetch existing Firestore bookings for this date
  const bookedIntervals: { start: string; end: string }[] = [];
  try {
    const bookingsCol = collection(db, "bookings");
    const q = query(bookingsCol, where("date", "==", dateStr));
    const snapshot = await getDocs(q);
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (data.status !== "CANCELLED") {
        bookedIntervals.push({
          start: data.startTime,
          end: data.endTime || addMinutesToTime(data.startTime, data.durationMinutes || 120),
        });
      }
    });
  } catch (err) {
    console.warn("Firestore client read notice:", err);
  }

  // Current time in Asia/Colombo to disable past slots if booking for today
  let currentDateColombo = "";
  let currentTimeColombo = "";
  try {
    const nowColombo = new Intl.DateTimeFormat("en-CA", {
      timeZone: STUDIO_TIMEZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(new Date());

    const parts = nowColombo.split(", ");
    currentDateColombo = parts[0];
    currentTimeColombo = parts[1] || "";
  } catch {
    currentDateColombo = new Date().toISOString().split("T")[0];
  }

  const isToday = dateStr === currentDateColombo;
  let currentStart = openTime;

  while (true) {
    const currentEnd = addMinutesToTime(currentStart, durationMinutes);

    // If slot extends beyond closing time, break
    if (currentEnd > closeTime) {
      break;
    }

    let available = true;
    let reason: TimeSlot["reason"] = undefined;

    // Past time check
    if (isToday && currentTimeColombo && currentStart <= currentTimeColombo) {
      available = false;
      reason = "PAST_TIME";
    }

    // Overlap with booked intervals
    if (available) {
      const hasConflict = bookedIntervals.some((b) =>
        doIntervalsOverlap(currentStart, currentEnd, b.start, b.end)
      );
      if (hasConflict) {
        available = false;
        reason = "BOOKED";
      }
    }

    slots.push({
      startTime: currentStart,
      endTime: currentEnd,
      displayLabel: `${formatTo12Hour(currentStart)} – ${formatTo12Hour(currentEnd)}`,
      available,
      reason,
    });

    currentStart = addMinutesToTime(currentStart, interval);
  }

  return slots;
}

/**
 * Creates a new booking, attempting REST API first, falling back to direct Firestore creation on static hosts
 */
export async function createClientBooking(
  req: CreateBookingRequest
): Promise<{ success: boolean; data?: Booking; error?: string }> {
  // 1. Try Server API first
  try {
    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        return { success: true, data: json.data };
      }
    }
  } catch {
    // Proceed to Direct Firestore save
  }

  // 2. Direct Firestore fallback (e.g. on GitHub Pages)
  try {
    const bookingId = generateBookingId();
    const durationMinutes = req.durationMinutes || 120;
    const endTime = addMinutesToTime(req.startTime, durationMinutes);

    const newBooking: Booking = {
      id: bookingId,
      customerName: req.customerName.trim(),
      phone: req.phone.trim(),
      email: req.email.trim().toLowerCase(),
      service: req.service || "Video Podcast (4K Multi-Cam)",
      date: req.date,
      startTime: req.startTime,
      endTime,
      durationMinutes,
      numberOfPeople: req.numberOfPeople || 2,
      notes: req.notes?.trim() || "",
      status: "PENDING",
      version: 1,
      bookingPassImageUrl: `/api/bookings/${bookingId}/pass-image?v=1`,
      googleCalendarSyncStatus: "PENDING",
      discordSyncStatus: "PENDING",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save directly in Cloud Firestore
    const docRef = doc(db, "bookings", bookingId);
    await setDoc(docRef, newBooking);

    return { success: true, data: newBooking };
  } catch (err: any) {
    console.error("Firestore direct booking error:", err);
    return {
      success: false,
      error: err?.message || "Failed to finalize studio booking. Please check network connection.",
    };
  }
}
