import fs from "fs";
import path from "path";
import { Booking } from "@/lib/types/booking";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "bookings.json");

// In-memory fallback if file system access fails in edge environments
let memoryStore: Booking[] = [];
let isInitialized = false;

function ensureDataDirectory(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      // Seed with initial realistic bookings for demonstration
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

function loadBookings(): Booking[] {
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

function saveBookings(bookings: Booking[]): void {
  memoryStore = bookings;
  try {
    ensureDataDirectory();
    fs.writeFileSync(DATA_FILE, JSON.stringify(bookings, null, 2), "utf-8");
  } catch (error) {
    console.warn("Could not write bookings file, kept in memory:", error);
  }
}

export const bookingRepository = {
  getAll(): Booking[] {
    return loadBookings().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getById(id: string): Booking | null {
    const all = loadBookings();
    return all.find((b) => b.id.toLowerCase() === id.toLowerCase()) || null;
  },

  getByDate(date: string): Booking[] {
    const all = loadBookings();
    return all.filter((b) => b.date === date && b.status !== "CANCELLED");
  },

  create(booking: Booking): Booking {
    const all = loadBookings();
    all.push(booking);
    saveBookings(all);
    return booking;
  },

  update(idOrBooking: string | Booking, updates?: Partial<Booking>): Booking | null {
    const all = loadBookings();
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
    saveBookings(all);
    return updated;
  },

  delete(id: string): boolean {
    const all = loadBookings();
    const filtered = all.filter((b) => b.id.toLowerCase() !== id.toLowerCase());
    if (filtered.length === all.length) return false;
    saveBookings(filtered);
    return true;
  },
};
