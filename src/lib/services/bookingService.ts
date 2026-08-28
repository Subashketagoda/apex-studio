import {
  Booking,
  BookingStatus,
  CreateBookingRequest,
  UpdateBookingRequest,
  TimeSlot,
} from "@/lib/types/booking";
import { bookingRepository } from "@/lib/repository/bookingRepository";
import { googleCalendarService } from "@/lib/services/googleCalendarService";
import { bookingSyncService } from "@/lib/services/bookingSyncService";
import {
  STUDIO_OPERATING_HOURS,
  STUDIO_TIMEZONE,
  addMinutesToTime,
  doIntervalsOverlap,
  formatTo12Hour,
  generateBookingId,
} from "@/lib/constants";

class BookingService {
  /**
   * Generates and validates available time slots for a date in Asia/Colombo
   */
  public async getAvailableSlots(dateStr: string, durationMinutes: number = 120): Promise<TimeSlot[]> {
    const slots: TimeSlot[] = [];
    const openTime = STUDIO_OPERATING_HOURS.open; // "09:00"
    const closeTime = STUDIO_OPERATING_HOURS.close; // "22:00"
    const interval = STUDIO_OPERATING_HOURS.slotIntervalMinutes; // 60 mins

    // 1. Fetch existing repository bookings for this date (excluding cancelled)
    const existingBookings = bookingRepository.getByDate(dateStr);

    // 2. Fetch Google Calendar busy intervals
    const gcalBusy = await googleCalendarService.getBusyIntervals(dateStr);

    // 3. Current time in Asia/Colombo to disable past slots if booking for today
    const nowColombo = new Intl.DateTimeFormat("en-CA", {
      timeZone: STUDIO_TIMEZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(new Date());

    const [currentDateColombo, currentTimeColombo] = nowColombo.split(", ");
    const isToday = dateStr === currentDateColombo;

    let currentStart = openTime;

    while (true) {
      const currentEnd = addMinutesToTime(currentStart, durationMinutes);

      // If slot extends beyond studio closing time, stop generating
      if (currentEnd > closeTime) {
        break;
      }

      let available = true;
      let reason: TimeSlot["reason"] = undefined;

      // Check if slot is in the past
      if (isToday && currentStart <= currentTimeColombo) {
        available = false;
        reason = "PAST_TIME";
      }

      // Check conflict with existing local bookings
      if (available) {
        const hasBookingConflict = existingBookings.some((b) =>
          doIntervalsOverlap(currentStart, currentEnd, b.startTime, b.endTime)
        );
        if (hasBookingConflict) {
          available = false;
          reason = "BOOKED";
        }
      }

      // Check conflict with Google Calendar busy periods
      if (available && gcalBusy.length > 0) {
        const hasGcalConflict = gcalBusy.some((interval) => {
          const startGcal = new Intl.DateTimeFormat("en-GB", {
            timeZone: STUDIO_TIMEZONE,
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }).format(new Date(interval.start));

          const endGcal = new Intl.DateTimeFormat("en-GB", {
            timeZone: STUDIO_TIMEZONE,
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }).format(new Date(interval.end));

          return doIntervalsOverlap(currentStart, currentEnd, startGcal, endGcal);
        });

        if (hasGcalConflict) {
          available = false;
          reason = "BOOKED";
        }
      }

      const displayLabel = `${formatTo12Hour(currentStart)} – ${formatTo12Hour(currentEnd)}`;

      slots.push({
        startTime: currentStart,
        endTime: currentEnd,
        displayLabel,
        available,
        reason,
      });

      // Increment by slot interval
      currentStart = addMinutesToTime(currentStart, interval);
    }

    return slots;
  }

  /**
   * Creates a new booking, sets pass version 1, persists it, and triggers centralized dual sync
   */
  public async createBooking(
    req: CreateBookingRequest
  ): Promise<{ success: boolean; booking?: Booking; error?: string }> {
    if (!req.customerName?.trim() || !req.phone?.trim() || !req.email?.trim() || !req.date || !req.startTime) {
      return { success: false, error: "Please provide all required fields." };
    }

    const durationMinutes = req.durationMinutes || 120;
    const endTime = addMinutesToTime(req.startTime, durationMinutes);

    // Conflict Prevention Check
    const existing = bookingRepository.getByDate(req.date);
    const hasConflict = existing.some((b) => doIntervalsOverlap(req.startTime, endTime, b.startTime, b.endTime));

    if (hasConflict) {
      return {
        success: false,
        error: "This time slot is no longer available. Please select another slot.",
      };
    }

    const bookingId = generateBookingId();
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

    // Save to Database
    bookingRepository.create(newBooking);

    // Centralized Dual Synchronization (Google Calendar + Discord)
    const synced = await bookingSyncService.syncBookingChanges(newBooking, undefined);

    return { success: true, booking: synced };
  }

  /**
   * Updates booking details (any fields) with version incrementation, change diff calculation, and dual sync
   */
  public async updateBookingDetails(
    id: string,
    updates: UpdateBookingRequest
  ): Promise<{ success: boolean; booking?: Booking; error?: string }> {
    const previous = bookingRepository.getById(id);
    if (!previous) {
      return { success: false, error: "Booking record not found." };
    }

    const newDate = updates.date || previous.date;
    const newStartTime = updates.startTime || previous.startTime;
    const newDuration = updates.durationMinutes !== undefined ? updates.durationMinutes : previous.durationMinutes;
    const newEndTime = addMinutesToTime(newStartTime, newDuration);

    const isRescheduledOrServiceChanged =
      newDate !== previous.date ||
      newStartTime !== previous.startTime ||
      newDuration !== previous.durationMinutes ||
      (updates.service && updates.service !== previous.service);

    // If date or time changed, verify availability
    if (newDate !== previous.date || newStartTime !== previous.startTime || newDuration !== previous.durationMinutes) {
      const existing = bookingRepository.getByDate(newDate).filter((b) => b.id.toLowerCase() !== id.toLowerCase());
      const hasConflict = existing.some((b) => doIntervalsOverlap(newStartTime, newEndTime, b.startTime, b.endTime));

      if (hasConflict) {
        return {
          success: false,
          error: "The requested time slot conflicts with an existing studio reservation.",
        };
      }
    }

    const nextVersion = isRescheduledOrServiceChanged ? (previous.version || 1) + 1 : (previous.version || 1);

    const updatedEntity: Booking = {
      ...previous,
      customerName: updates.customerName !== undefined ? updates.customerName.trim() : previous.customerName,
      phone: updates.phone !== undefined ? updates.phone.trim() : previous.phone,
      email: updates.email !== undefined ? updates.email.trim().toLowerCase() : previous.email,
      service: updates.service !== undefined ? updates.service : previous.service,
      date: newDate,
      startTime: newStartTime,
      endTime: newEndTime,
      durationMinutes: newDuration,
      numberOfPeople: updates.numberOfPeople !== undefined ? updates.numberOfPeople : previous.numberOfPeople,
      notes: updates.notes !== undefined ? updates.notes.trim() : previous.notes,
      status: updates.status !== undefined ? updates.status : previous.status,
      version: nextVersion,
      bookingPassImageUrl: `/api/bookings/${id}/pass-image?v=${nextVersion}`,
      updatedAt: new Date().toISOString(),
    };

    // Save in Repository
    bookingRepository.update(updatedEntity);

    // Centralized Dual Synchronization
    const synced = await bookingSyncService.syncBookingChanges(updatedEntity, previous);

    return { success: true, booking: synced };
  }

  /**
   * Updates booking status (CONFIRMED, CANCELLED, COMPLETED) and syncs
   */
  public async updateBookingStatus(id: string, status: BookingStatus): Promise<Booking | null> {
    const previous = bookingRepository.getById(id);
    if (!previous) return null;

    const nextVersion = (previous.version || 1) + 1;

    const updated = bookingRepository.update(id, {
      status,
      version: nextVersion,
      bookingPassImageUrl: `/api/bookings/${id}/pass-image?v=${nextVersion}`,
    });
    if (!updated) return null;

    return bookingSyncService.syncBookingChanges(updated, previous);
  }

  /**
   * Reschedules a booking to a new date/time slot, increments version, and syncs
   */
  public async rescheduleBooking(
    id: string,
    newDate: string,
    newStartTime: string
  ): Promise<{ success: boolean; booking?: Booking; error?: string }> {
    return this.updateBookingDetails(id, {
      date: newDate,
      startTime: newStartTime,
      status: "CONFIRMED",
    });
  }

  /**
   * Regenerates a booking pass with a fresh incremental version number
   */
  public async regeneratePass(id: string): Promise<Booking | null> {
    const previous = bookingRepository.getById(id);
    if (!previous) return null;

    const nextVersion = (previous.version || 1) + 1;
    const updated = bookingRepository.update(id, {
      version: nextVersion,
      bookingPassImageUrl: `/api/bookings/${id}/pass-image?v=${nextVersion}`,
    });

    if (!updated) return null;
    return bookingSyncService.syncBookingChanges(updated, previous);
  }
}

export const bookingService = new BookingService();
