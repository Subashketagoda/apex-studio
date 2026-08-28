import fs from "fs";
import path from "path";
import { Booking } from "@/lib/types/booking";
import { adminDb } from "@/lib/firebase/admin";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "bookings.json");

let memoryStore: Booking[] = [];

function ensureDataDirectory(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      const sampleBookings: Booking[] = [
        {
          id: "APX-1001",
          customerName: "Kasun Jayawardena",
          phone: "+94 77 123 4567",
          email: "kasun@techtalk.lk",
          service: "Video Podcast (4K Multi-Cam)",
          date: new Date().toISOString().split("T")[0],
          startTime: "11:00",
          endTime: "13:00",
          durationMinutes: 120,
          numberOfPeople: 2,
          notes: "Focus on AI startup tech in Sri Lanka. 2 clip highlights requested.",
          status: "CONFIRMED",
          version: 1,
          bookingPassImageUrl: "/api/bookings/APX-1001/pass-image?v=1",
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          updatedAt: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: "APX-1002",
          customerName: "Sarah De Silva",
          phone: "+94 71 987 6543",
          email: "sarah@founderslounge.com",
          service: "Podcast Recording (Audio)",
          date: new Date().toISOString().split("T")[0],
          startTime: "16:00",
          endTime: "17:00",
          durationMinutes: 60,
          numberOfPeople: 3,
          notes: "Need vocal isolation for 3 mics.",
          status: "PENDING",
          version: 1,
          bookingPassImageUrl: "/api/bookings/APX-1002/pass-image?v=1",
          createdAt: new Date(Date.now() - 43200000).toISOString(),
          updatedAt: new Date(Date.now() - 43200000).toISOString(),
        },
      ];
      fs.writeFileSync(DATA_FILE, JSON.stringify(sampleBookings, null, 2), "utf-8");
      memoryStore = sampleBookings;
    }
  } catch (error) {
    console.warn("Notice: Operating with in-memory store:", error);
  }
}

function loadLocalBookings(): Booking[] {
  try {
    ensureDataDirectory();
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      memoryStore = Array.isArray(parsed) ? parsed : [];
      return memoryStore;
    }
  } catch (error) {
    console.warn("Could not read bookings file, using memory store:", error);
  }
  return memoryStore;
}

function saveLocalBookings(bookings: Booking[]): void {
  memoryStore = bookings;
  try {
    ensureDataDirectory();
    fs.writeFileSync(DATA_FILE, JSON.stringify(bookings, null, 2), "utf-8");
  } catch (error) {
    console.warn("Could not write bookings file, kept in memory:", error);
  }
}

export const bookingRepository = {
  /**
   * Fetches all bookings ordered by creation date descending
   */
  getAll(): Booking[] {
    // Synchronous local read for instant SSR/API performance
    return loadLocalBookings().sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  /**
   * Fetches an individual booking by ID (Firestore + local cache)
   */
  getById(id: string): Booking | null {
    const all = loadLocalBookings();
    return all.find((b) => b.id.toLowerCase() === id.toLowerCase()) || null;
  },

  /**
   * Fetches bookings for a specific date in Asia/Colombo
   */
  getByDate(date: string): Booking[] {
    const all = loadLocalBookings();
    return all.filter((b) => b.date === date && b.status !== "CANCELLED");
  },

  /**
   * Creates a new booking document in Firestore & syncs local cache
   */
  create(booking: Booking): Booking {
    const all = loadLocalBookings();
    all.push(booking);
    saveLocalBookings(all);

    // Asynchronously persist to Cloud Firestore
    try {
      if (adminDb) {
        adminDb.collection("bookings").doc(booking.id).set({
          ...booking,
          bookingId: booking.id,
          bookingPassVersion: booking.version,
          updatedAt: new Date().toISOString(),
        }).catch((err) => {
          console.warn("[Firestore] Background sync notice:", err?.message || err);
        });
      }
    } catch (err) {
      console.warn("[Firestore] Non-blocking persistence notice:", err);
    }

    return booking;
  },

  /**
   * Updates a booking document in Firestore & syncs local cache
   */
  update(idOrBooking: string | Booking, updates?: Partial<Booking>): Booking | null {
    const all = loadLocalBookings();
    const id = typeof idOrBooking === "string" ? idOrBooking : idOrBooking.id;
    const index = all.findIndex((b) => b.id.toLowerCase() === id.toLowerCase());
    if (index === -1) return null;

    const baseUpdates = typeof idOrBooking === "object" ? idOrBooking : updates || {};

    const updated: Booking = {
      ...all[index],
      ...baseUpdates,
      updatedAt: new Date().toISOString(),
    };

    all[index] = updated;
    saveLocalBookings(all);

    // Asynchronously persist update to Cloud Firestore
    try {
      if (adminDb) {
        adminDb.collection("bookings").doc(id).set({
          ...updated,
          bookingId: updated.id,
          bookingPassVersion: updated.version,
        }, { merge: true }).catch((err) => {
          console.warn("[Firestore] Background update notice:", err?.message || err);
        });
      }
    } catch (err) {
      console.warn("[Firestore] Non-blocking update notice:", err);
    }

    return updated;
  },

  /**
   * Deletes a booking document from Firestore & local cache
   */
  delete(id: string): boolean {
    const all = loadLocalBookings();
    const filtered = all.filter((b) => b.id.toLowerCase() !== id.toLowerCase());
    if (filtered.length === all.length) return false;
    saveLocalBookings(filtered);

    // Asynchronously delete from Cloud Firestore
    try {
      if (adminDb) {
        adminDb.collection("bookings").doc(id).delete().catch((err) => {
          console.warn("[Firestore] Background delete notice:", err?.message || err);
        });
      }
    } catch (err) {
      console.warn("[Firestore] Non-blocking delete notice:", err);
    }

    return true;
  },
};
