import { NextRequest, NextResponse } from "next/server";
import { bookingSyncService } from "@/lib/services/bookingSyncService";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * POST /api/bookings/[id]/sync
 * On-demand retry synchronization with Google Calendar & Discord
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const syncedBooking = await bookingSyncService.retrySync(id);

    if (!syncedBooking) {
      return NextResponse.json(
        { success: false, error: "Booking record not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: syncedBooking,
      message: "Booking synchronization executed.",
    });
  } catch (error: any) {
    console.error("Manual sync API error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Synchronization retry failed." },
      { status: 500 }
    );
  }
}
