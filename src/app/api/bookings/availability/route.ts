import { NextRequest, NextResponse } from "next/server";
import { bookingService } from "@/lib/services/bookingService";
import { STUDIO_OPERATING_HOURS, STUDIO_TIMEZONE } from "@/lib/constants";
import { AvailabilityResponse } from "@/lib/types/booking";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get("date");
    const duration = parseInt(searchParams.get("duration") || "120", 10);

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json(
        { success: false, error: "Valid date parameter (YYYY-MM-DD) is required." },
        { status: 400 }
      );
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
