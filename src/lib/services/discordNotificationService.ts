import { Booking } from "@/lib/types/booking";
import { formatTo12Hour } from "@/lib/constants";

export type NotificationType =
  | "NEW_BOOKING"
  | "CONFIRMED"
  | "RESCHEDULED"
  | "UPDATED"
  | "CANCELLED"
  | "COMPLETED";

export interface SyncNotificationOptions {
  previousBooking?: Booking;
  changedFields?: string[];
}

interface DiscordEmbedField {
  name: string;
  value: string;
  inline?: boolean;
}

class DiscordNotificationService {
  private webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  public isConfigured(): boolean {
    return Boolean(this.webhookUrl && this.webhookUrl.startsWith("https://discord.com/api/webhooks/"));
  }

  /**
   * Dispatches a single consolidated Discord notification for any studio booking mutation
   */
  public async sendNotification(
    type: NotificationType,
    booking: Booking,
    options?: SyncNotificationOptions
  ): Promise<boolean> {
    const timeFormatted = `${formatTo12Hour(booking.startTime)} – ${formatTo12Hour(booking.endTime)} (Asia/Colombo)`;
    const durationHours = (booking.durationMinutes / 60).toFixed(1).replace(".0", "");

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const passUrl = `${baseUrl}/booking/pass/${booking.id}`;

    let title = "";
    let color = 0x38bdf8; // Icy Blue
    const fields: DiscordEmbedField[] = [];

    switch (type) {
      case "NEW_BOOKING":
        title = "🎙️ NEW APEX STUDIO BOOKING";
        color = 0x38bdf8; // Icy Blue
        fields.push(
          { name: "Booking ID", value: `\`${booking.id}\``, inline: true },
          { name: "Customer", value: `**${booking.customerName}**`, inline: true },
          { name: "Service", value: booking.service, inline: true },
          { name: "Date", value: `📅 ${booking.date}`, inline: true },
          { name: "Time", value: `⏰ ${timeFormatted}`, inline: true },
          { name: "Duration", value: `⏳ ${durationHours} hr (${booking.durationMinutes} mins)`, inline: true },
          { name: "Guests", value: `👥 ${booking.numberOfPeople} Person(s)`, inline: true },
          { name: "Status", value: `\`${booking.status}\``, inline: true },
          { name: "Contact", value: `📞 ${booking.phone} • ✉️ ${booking.email}`, inline: false }
        );
        break;

      case "CONFIRMED":
        title = "✅ BOOKING CONFIRMED";
        color = 0x22c55e; // Emerald Green
        fields.push(
          { name: "Booking ID", value: `\`${booking.id}\``, inline: true },
          { name: "Customer", value: `**${booking.customerName}**`, inline: true },
          { name: "Service", value: booking.service, inline: true },
          { name: "Date", value: `📅 ${booking.date}`, inline: true },
          { name: "Time", value: `⏰ ${timeFormatted}`, inline: true },
          { name: "Status", value: `\`${booking.status}\``, inline: true }
        );
        break;

      case "RESCHEDULED": {
        title = "🔄 BOOKING RESCHEDULED";
        color = 0x06b6d4; // Cyan Blue
        const prev = options?.previousBooking;
        const oldTime = prev ? `${formatTo12Hour(prev.startTime)} – ${formatTo12Hour(prev.endTime)}` : "Previous Slot";
        const oldDate = prev ? prev.date : "Previous Date";

        fields.push(
          { name: "Booking ID", value: `\`${booking.id}\``, inline: true },
          { name: "Customer", value: `**${booking.customerName}**`, inline: true },
          { name: "Service", value: booking.service, inline: true },
          { name: "OLD SCHEDULE", value: `📅 ${oldDate}\n⏰ ${oldTime}`, inline: true },
          { name: "NEW SCHEDULE", value: `📅 **${booking.date}**\n⏰ **${timeFormatted}**`, inline: true },
          { name: "Status", value: `\`${booking.status}\``, inline: true }
        );
        break;
      }

      case "UPDATED": {
        title = "📝 BOOKING UPDATED";
        color = 0xf59e0b; // Amber / Gold
        const changedList = options?.changedFields && options.changedFields.length > 0
          ? options.changedFields.join(", ")
          : "Session Specifications";

        fields.push(
          { name: "Booking ID", value: `\`${booking.id}\``, inline: true },
          { name: "Customer", value: `**${booking.customerName}**`, inline: true },
          { name: "Modified Fields", value: `\`${changedList}\``, inline: false },
          { name: "Updated Service", value: booking.service, inline: true },
          { name: "Updated Date", value: `📅 ${booking.date}`, inline: true },
          { name: "Updated Time", value: `⏰ ${timeFormatted}`, inline: true },
          { name: "Duration", value: `⏳ ${durationHours} hr (${booking.durationMinutes}m)`, inline: true },
          { name: "Guests", value: `👥 ${booking.numberOfPeople}`, inline: true },
          { name: "Status", value: `\`${booking.status}\``, inline: true }
        );
        break;
      }

      case "CANCELLED":
        title = "❌ BOOKING CANCELLED";
        color = 0xef4444; // Crimson Red
        fields.push(
          { name: "Booking ID", value: `\`${booking.id}\``, inline: true },
          { name: "Customer", value: `**${booking.customerName}**`, inline: true },
          { name: "Service", value: booking.service, inline: true },
          { name: "Date", value: `📅 ${booking.date}`, inline: true },
          { name: "Time", value: `⏰ ${timeFormatted}`, inline: true },
          { name: "Status", value: `\`CANCELLED\``, inline: true }
        );
        break;

      case "COMPLETED":
        title = "🏁 BOOKING COMPLETED";
        color = 0x8b5cf6; // Purple
        fields.push(
          { name: "Booking ID", value: `\`${booking.id}\``, inline: true },
          { name: "Customer", value: `**${booking.customerName}**`, inline: true },
          { name: "Service", value: booking.service, inline: true },
          { name: "Date", value: `📅 ${booking.date}`, inline: true },
          { name: "Time", value: `⏰ ${timeFormatted}`, inline: true },
          { name: "Status", value: `\`COMPLETED\``, inline: true }
        );
        break;
    }

    if (booking.notes && type !== "CANCELLED" && type !== "COMPLETED") {
      fields.push({ name: "Show Notes / Special Requests", value: booking.notes, inline: false });
    }

    // Always include Booking Pass CTA link
    fields.push({
      name: "BOOKING PASS",
      value: `[🎟️ Open Digital Pass](${passUrl})`,
      inline: false,
    });

    const embedPayload = {
      username: "Apex Studio Dispatch",
      avatar_url: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=200&auto=format&fit=crop",
      embeds: [
        {
          title,
          description: `Apex Studio booking record \`${booking.id}\` synchronization update.`,
          color,
          fields,
          footer: {
            text: "Apex Studio • Colombo, Sri Lanka (Asia/Colombo)",
            icon_url: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=100&auto=format&fit=crop",
          },
          timestamp: new Date().toISOString(),
        },
      ],
    };

    if (!this.isConfigured()) {
      console.log(`[Discord Webhook Mock] Sent ${type} notification for ${booking.id} (${booking.customerName})`);
      return true;
    }

    try {
      const response = await fetch(this.webhookUrl!, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(embedPayload),
      });

      if (!response.ok) {
        console.error("Discord webhook dispatch failed:", await response.text());
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error dispatching Discord webhook notification:", error);
      return false;
    }
  }
}

export const discordNotificationService = new DiscordNotificationService();
