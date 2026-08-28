export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";

export type SyncStatus = "PENDING" | "SYNCED" | "FAILED";

export interface Booking {
  id: string; // e.g. "APX-2026-894125"
  customerName: string;
  phone: string;
  email: string;
  service: string;
  date: string; // YYYY-MM-DD in Asia/Colombo
  startTime: string; // HH:mm e.g. "14:00"
  endTime: string; // HH:mm e.g. "16:00"
  durationMinutes: number; // e.g. 120 (2 hours)
  numberOfPeople: number;
  notes?: string;
  status: BookingStatus;
  
  // Real-Time Synchronization & Pass Versioning
  version: number; // Increments on reschedule or update (1, 2, 3...)
  bookingPassImageUrl?: string; // High-res 1200x1800 PNG pass URL
  googleCalendarEventId?: string;
  googleCalendarSyncStatus?: SyncStatus;
  discordSyncStatus?: SyncStatus;
  lastSyncedAt?: string; // ISO String
  syncError?: string;

  createdAt: string; // ISO String
  updatedAt: string; // ISO String
}

export interface TimeSlot {
  startTime: string; // "14:00"
  endTime: string; // "16:00"
  displayLabel: string; // "02:00 PM – 04:00 PM"
  available: boolean;
  reason?: "BOOKED" | "STUDIO_CLOSED" | "PAST_TIME" | "MAINTENANCE";
}

export interface CreateBookingRequest {
  customerName: string;
  phone: string;
  email: string;
  service: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  durationMinutes?: number;
  numberOfPeople?: number;
  notes?: string;
}

export interface UpdateBookingRequest {
  customerName?: string;
  phone?: string;
  email?: string;
  service?: string;
  date?: string;
  startTime?: string;
  durationMinutes?: number;
  numberOfPeople?: number;
  notes?: string;
  status?: BookingStatus;
}

export interface AvailabilityQuery {
  date: string; // YYYY-MM-DD
  service?: string;
  durationMinutes?: number;
}

export interface AvailabilityResponse {
  date: string;
  timezone: string; // "Asia/Colombo"
  durationMinutes: number;
  slots: TimeSlot[];
  operatingHours: {
    open: string;
    close: string;
  };
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
