import { NextRequest, NextResponse } from "next/server";
import { bookingService } from "@/lib/services/bookingService";
import { bookingRepository } from "@/lib/repository/bookingRepository";
import { CreateBookingRequest } from "@/lib/types/booking";

export const dynamic = "force-static";

/**
 * GET /api/bookings
 * Returns all bookings ordered by creation date
 */
export async function GET() {
  try {
    const bookings = bookingRepository.getAll();
    return NextResponse.json({ success: true, data: bookings });
  } catch (error) {
    console.error("Fetch bookings API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve bookings." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/bookings
 * Creates a new studio booking, creates GCal event, and notifies Discord
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreateBookingRequest;

    // Sanitize & validate
    if (!body.customerName || !body.phone || !body.email || !body.date || !body.startTime) {
      return NextResponse.json(
        { success: false, error: "Missing required booking details." },
        { status: 400 }
      );
    }

    const result = await bookingService.createBooking(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || "Unable to complete booking." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: result.booking,
        message: `Booking ${result.booking?.id} created successfully!`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create booking API error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred while processing your booking." },
      { status: 500 }
    );
  }
}
