import { NextRequest, NextResponse } from "next/server";
import { bookingRepository } from "@/lib/repository/bookingRepository";
import { bookingService } from "@/lib/services/bookingService";
import { UpdateBookingRequest } from "@/lib/types/booking";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/bookings/[id]
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const booking = bookingRepository.getById(id);

    if (!booking) {
      return NextResponse.json({ success: false, error: "Booking not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: booking });
  } catch (error) {
    console.error("Get booking API error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch booking." }, { status: 500 });
  }
}

/**
 * PATCH /api/bookings/[id]
 * Supports general updates, status transitions, reschedules, and details modification with real-time sync.
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body: UpdateBookingRequest = await request.json();

    const result = await bookingService.updateBookingDetails(id, body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || "Failed to update booking." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.booking,
      message: "Booking updated and synchronized with Google Calendar and Discord!",
    });
  } catch (error) {
    console.error("Update booking API error:", error);
    return NextResponse.json({ success: false, error: "Failed to update booking." }, { status: 500 });
  }
}
