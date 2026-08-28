import { Booking } from "@/lib/types/booking";
import { STUDIO_TIMEZONE, formatTo12Hour } from "@/lib/constants";

interface GCalBusyInterval {
  start: string; // ISO 8601
  end: string;   // ISO 8601
}

class GoogleCalendarService {
  private clientId = process.env.GOOGLE_CLIENT_ID;
  private clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  private refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
  private calendarId = process.env.GOOGLE_CALENDAR_ID || "primary";

  public isConfigured(): boolean {
    return Boolean(this.clientId && this.clientSecret && this.refreshToken);
  }

  /**
   * Retrieves a fresh OAuth 2.0 access token using the stored refresh token
   */
  private async getAccessToken(): Promise<string | null> {
    if (!this.isConfigured()) return null;

    try {
      const response = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: this.clientId!,
          client_secret: this.clientSecret!,
          refresh_token: this.refreshToken!,
          grant_type: "refresh_token",
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Google Calendar token refresh failed:", errorText);
        return null;
      }

      const data = await response.json();
      return data.access_token as string;
    } catch (error) {
      console.error("Error refreshing Google Calendar access token:", error);
      return null;
    }
  }

  /**
   * Queries Google Calendar FreeBusy endpoint for busy intervals on a specific date in Asia/Colombo
   */
  public async getBusyIntervals(dateStr: string): Promise<GCalBusyInterval[]> {
    const accessToken = await this.getAccessToken();
    if (!accessToken) {
      return [];
    }

    try {
      const timeMin = `${dateStr}T00:00:00+05:30`;
      const timeMax = `${dateStr}T23:59:59+05:30`;

      const response = await fetch("https://www.googleapis.com/calendar/v3/freeBusy", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          timeMin,
          timeMax,
          timeZone: STUDIO_TIMEZONE,
          items: [{ id: this.calendarId }],
        }),
      });

      if (!response.ok) {
        console.error("Google Calendar freeBusy query failed:", await response.text());
        return [];
      }

      const data = await response.json();
      const busySlots = data.calendars?.[this.calendarId]?.busy || [];
      return busySlots as GCalBusyInterval[];
    } catch (error) {
      console.error("Failed to query Google Calendar freeBusy:", error);
      return [];
    }
  }

  /**
   * Constructs the standardized summary and description for Google Calendar events
   */
  private buildEventPayload(booking: Booking) {
    const startDateTime = `${booking.date}T${booking.startTime}:00+05:30`;
    const endDateTime = `${booking.date}T${booking.endTime}:00+05:30`;
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    return {
      summary: `APEX STUDIO — ${booking.service} — ${booking.customerName}`,
      description: [
        `APEX STUDIO BOOKING PASS DETAILS`,
        `================================`,
        `Booking ID: ${booking.id}`,
        `Customer: ${booking.customerName}`,
        `Service: ${booking.service}`,
        `Date: ${booking.date}`,
        `Time: ${formatTo12Hour(booking.startTime)} – ${formatTo12Hour(booking.endTime)} (Asia/Colombo)`,
        `Duration: ${booking.durationMinutes} Minutes`,
        `Number of Guests: ${booking.numberOfPeople}`,
        `Phone: ${booking.phone}`,
        `Email: ${booking.email}`,
        `Status: ${booking.status}`,
        booking.notes ? `\nShow Notes / Special Requests:\n${booking.notes}` : "",
        `\nDigital Booking Pass:\n${baseUrl}/booking/pass/${booking.id}`,
        `Verification Link:\n${baseUrl}/booking/verify/${booking.id}`,
      ].join("\n"),
      start: {
        dateTime: startDateTime,
        timeZone: STUDIO_TIMEZONE,
      },
      end: {
        dateTime: endDateTime,
        timeZone: STUDIO_TIMEZONE,
      },
      attendees: [{ email: booking.email, displayName: booking.customerName }],
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 24 * 60 },
          { method: "popup", minutes: 60 },
        ],
      },
    };
  }

  /**
   * Creates a confirmed booking event on Google Calendar
   */
  public async createEvent(booking: Booking): Promise<string | null> {
    const accessToken = await this.getAccessToken();
    if (!accessToken) {
      console.log(`[Google Calendar Mock] Created event for booking: ${booking.id} (${booking.customerName})`);
      return `mock-gcal-${booking.id}`;
    }

    try {
      const eventPayload = this.buildEventPayload(booking);

      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(this.calendarId)}/events`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(eventPayload),
        }
      );

      if (!response.ok) {
        console.error("Failed to insert event into Google Calendar:", await response.text());
        return null;
      }

      const createdEvent = await response.json();
      return createdEvent.id as string;
    } catch (error) {
      console.error("Error creating Google Calendar event:", error);
      return null;
    }
  }

  /**
   * Updates an existing Google Calendar event
   */
  public async updateEvent(eventId: string, booking: Booking): Promise<boolean> {
    const accessToken = await this.getAccessToken();
    if (!accessToken || eventId.startsWith("mock-gcal-")) {
      console.log(`[Google Calendar Mock] Updated event ${eventId} for booking ${booking.id}`);
      return true;
    }

    try {
      const eventPayload = this.buildEventPayload(booking);

      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(this.calendarId)}/events/${encodeURIComponent(eventId)}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(eventPayload),
        }
      );

      return response.ok;
    } catch (error) {
      console.error("Error updating Google Calendar event:", error);
      return false;
    }
  }

  /**
   * Deletes an event from Google Calendar (e.g. on cancellation)
   */
  public async deleteEvent(eventId: string): Promise<boolean> {
    const accessToken = await this.getAccessToken();
    if (!accessToken || eventId.startsWith("mock-gcal-")) {
      console.log(`[Google Calendar Mock] Deleted event ${eventId}`);
      return true;
    }

    try {
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(this.calendarId)}/events/${encodeURIComponent(eventId)}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      return response.ok || response.status === 404;
    } catch (error) {
      console.error("Error deleting Google Calendar event:", error);
      return false;
    }
  }
}

export const googleCalendarService = new GoogleCalendarService();
