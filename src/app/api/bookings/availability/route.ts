import { NextRequest, NextResponse } from "next/server";
import { bookingService } from "@/lib/services/bookingService";
import { STUDIO_OPERATING_HOURS, STUDIO_TIMEZONE } from "@/lib/constants";
import { AvailabilityResponse } from "@/lib/types/booking";

export const dynamic = "force-static";

export async function GET(request?: NextRequest) {
  try {
    let date: string | null = null;
    let duration = 120;

    try {
      if (request?.nextUrl) {
        const searchParams = request.nextUrl.searchParams;
        date = searchParams.get("date");
        duration = parseInt(searchParams.get("duration") || "120", 10);
      }
    } catch {}

    if (!date) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      date = tomorrow.toISOString().split("T")[0];
    }

    const slots = await bookingService.getAvailableSlots(date, duration);

    const responseData: AvailabilityResponse = {
      date,
      timezone: STUDIO_TIMEZONE,
      durationMinutes: duration,
      slots,
      operatingHours: {
        open: STUDIO_OPERATING_HOURS.open,
        close: STUDIO_OPERATING_HOURS.close,
      },
    };

    return NextResponse.json({ success: true, data: responseData });
  } catch (error) {
    console.error("Availability API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve time slot availability." },
      { status: 500 }
    );
  }
}
