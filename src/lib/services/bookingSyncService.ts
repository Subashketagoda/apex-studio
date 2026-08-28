import { Booking, SyncStatus } from "@/lib/types/booking";
import { bookingRepository } from "@/lib/repository/bookingRepository";
import { googleCalendarService } from "@/lib/services/googleCalendarService";
import {
  discordNotificationService,
  NotificationType,
} from "@/lib/services/discordNotificationService";

export class BookingSyncService {
  /**
   * Detects modified fields between current and previous booking states
   */
  private detectChangedFields(current: Booking, previous?: Booking): string[] {
    if (!previous) return ["New Booking Created"];

    const changes: string[] = [];
    if (current.date !== previous.date) changes.push("Date");
    if (current.startTime !== previous.startTime) changes.push("Start Time");
    if (current.endTime !== previous.endTime) changes.push("End Time");
    if (current.durationMinutes !== previous.durationMinutes) changes.push("Duration");
    if (current.service !== previous.service) changes.push("Service");
    if (current.customerName !== previous.customerName) changes.push("Customer Name");
    if (current.phone !== previous.phone) changes.push("Phone");
    if (current.email !== previous.email) changes.push("Email");
    if (current.numberOfPeople !== previous.numberOfPeople) changes.push("Number of Guests");
    if (current.notes !== previous.notes) changes.push("Show Notes");
    if (current.status !== previous.status) changes.push(`Status (${previous.status} → ${current.status})`);

    return changes;
  }

  /**
   * Determines the primary notification archetype for Discord
   */
  private determineNotificationType(
    current: Booking,
    previous?: Booking
  ): NotificationType {
    if (!previous) return "NEW_BOOKING";

    if (current.status === "CANCELLED" && previous.status !== "CANCELLED") {
      return "CANCELLED";
    }

    if (current.status === "COMPLETED" && previous.status !== "COMPLETED") {
      return "COMPLETED";
    }

    if (current.status === "CONFIRMED" && previous.status === "PENDING") {
      return "CONFIRMED";
    }

    if (current.date !== previous.date || current.startTime !== previous.startTime) {
      return "RESCHEDULED";
    }

    return "UPDATED";
  }

  /**
   * Centralized real-time sync function:
   * 1. Detects changes
   * 2. Synchronizes Google Calendar
   * 3. Dispatches a single consolidated Discord notification
   * 4. Updates sync audit statuses in the database
   */
  public async syncBookingChanges(
    currentBooking: Booking,
    previousBooking?: Booking
  ): Promise<Booking> {
    const changedFields = this.detectChangedFields(currentBooking, previousBooking);
    const notificationType = this.determineNotificationType(currentBooking, previousBooking);

    let gcalStatus: SyncStatus = "PENDING";
    let discordStatus: SyncStatus = "PENDING";
    let syncErrorMsg: string | undefined = undefined;
    let eventId = currentBooking.googleCalendarEventId;

    // --- 1. GOOGLE CALENDAR SYNCHRONIZATION ---
    try {
      if (currentBooking.status === "CANCELLED") {
        if (eventId) {
          const deleted = await googleCalendarService.deleteEvent(eventId);
          gcalStatus = deleted ? "SYNCED" : "FAILED";
        } else {
          gcalStatus = "SYNCED";
        }
      } else {
        if (eventId) {
          // Update existing Google Calendar event
          const updated = await googleCalendarService.updateEvent(eventId, currentBooking);
          gcalStatus = updated ? "SYNCED" : "FAILED";
        } else {
          // Create new Google Calendar event
          const newEventId = await googleCalendarService.createEvent(currentBooking);
          if (newEventId) {
            eventId = newEventId;
            gcalStatus = "SYNCED";
          } else {
            gcalStatus = "FAILED";
          }
        }
      }
    } catch (err: any) {
      console.error(`[Sync Engine] Google Calendar sync failed for ${currentBooking.id}:`, err);
      gcalStatus = "FAILED";
      syncErrorMsg = err?.message || "Google Calendar sync exception";
    }

    // --- 2. DISCORD SYNCHRONIZATION ---
    try {
      const discordSent = await discordNotificationService.sendNotification(
        notificationType,
        currentBooking,
        {
          previousBooking,
          changedFields,
        }
      );
      discordStatus = discordSent ? "SYNCED" : "FAILED";
    } catch (err: any) {
      console.error(`[Sync Engine] Discord webhook sync failed for ${currentBooking.id}:`, err);
      discordStatus = "FAILED";
      syncErrorMsg = syncErrorMsg ? `${syncErrorMsg}; Discord sync exception` : "Discord sync exception";
    }

    // --- 3. AUDIT & PERSISTENCE ---
    const updatedBookingRecord: Booking = {
      ...currentBooking,
      googleCalendarEventId: eventId,
      googleCalendarSyncStatus: gcalStatus,
      discordSyncStatus: discordStatus,
      lastSyncedAt: new Date().toISOString(),
      syncError: syncErrorMsg,
      updatedAt: new Date().toISOString(),
    };

    // Update in persistent database
    await bookingRepository.update(updatedBookingRecord);

    console.log(
      `[Sync Engine] Booking ${currentBooking.id} synced: Event=${notificationType}, GCal=${gcalStatus}, Discord=${discordStatus}`
    );

    return updatedBookingRecord;
  }

  /**
   * Retries synchronization for a failed booking record
   */
  public async retrySync(bookingId: string): Promise<Booking | null> {
    const booking = await bookingRepository.getById(bookingId);
    if (!booking) return null;

    return this.syncBookingChanges(booking, undefined);
  }
}

export const bookingSyncService = new BookingSyncService();
