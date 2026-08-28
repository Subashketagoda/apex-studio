export const STUDIO_TIMEZONE = "Asia/Colombo";

export const STUDIO_OPERATING_HOURS = {
  open: "09:00", // 9:00 AM
  close: "22:00", // 10:00 PM
  slotIntervalMinutes: 60, // Slot increments
};

export const STUDIO_SERVICES = [
  {
    id: "podcast-audio",
    name: "Podcast Recording (Audio)",
    defaultDurationMinutes: 60,
    priceLabel: "Custom Estimate",
  },
  {
    id: "video-podcast",
    name: "Video Podcast (4K Multi-Cam)",
    defaultDurationMinutes: 120,
    priceLabel: "Custom Estimate",
  },
  {
    id: "content-creation",
    name: "Content Creation & Repurposing",
    defaultDurationMinutes: 180,
    priceLabel: "Custom Estimate",
  },
  {
    id: "live-streaming",
    name: "Live Streaming & Event Broadcast",
    defaultDurationMinutes: 180,
    priceLabel: "Custom Estimate",
  },
  {
    id: "audio-production",
    name: "Audio Production & Mastering",
    defaultDurationMinutes: 60,
    priceLabel: "Custom Estimate",
  },
  {
    id: "video-editing",
    name: "Full-Service Video Editing",
    defaultDurationMinutes: 120,
    priceLabel: "Custom Estimate",
  },
  {
    id: "custom-package",
    name: "Custom Package / Studio Buyout",
    defaultDurationMinutes: 240,
    priceLabel: "Custom Estimate",
  },
];

/**
 * Converts 24-hour time "14:30" to 12-hour display "02:30 PM"
 */
export function formatTo12Hour(time24: string): string {
  const [hourStr, minStr] = time24.split(":");
  let hour = parseInt(hourStr, 10);
  const min = minStr || "00";
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12;
  hour = hour ? hour : 12;
  const formattedHour = hour < 10 ? `0${hour}` : `${hour}`;
  return `${formattedHour}:${min} ${ampm}`;
}

/**
 * Adds minutes to a 24-hour time string (e.g. "14:00" + 120 mins -> "16:00")
 */
export function addMinutesToTime(time24: string, minutesToAdd: number): string {
  const [hourStr, minStr] = time24.split(":");
  const totalMins = parseInt(hourStr, 10) * 60 + parseInt(minStr, 10) + minutesToAdd;
  const newHours = Math.floor(totalMins / 60);
  const newMins = totalMins % 60;
  return `${String(newHours).padStart(2, "0")}:${String(newMins).padStart(2, "0")}`;
}

/**
 * Checks if two time intervals overlap
 */
export function doIntervalsOverlap(
  startA: string,
  endA: string,
  startB: string,
  endB: string
): boolean {
  return startA < endB && endA > startB;
}

/**
 * Generates an APEX booking reference ID like "APX-2026-749210"
 */
export function generateBookingId(): string {
  const num = Math.floor(100000 + Math.random() * 900000);
  return `APX-2026-${num}`;
}
