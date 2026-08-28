import { NextRequest, NextResponse } from "next/server";
import { bookingService } from "@/lib/services/bookingService";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-static";

export function generateStaticParams() {
  return [{ id: "APX-1001" }, { id: "APX-1002" }];
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const updated = await bookingService.regeneratePass(id);

    if (!updated) {
      return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: updated,
      message: `Booking pass regenerated. New version: v${updated.version}`,
    });
  } catch (error: any) {
    console.error("Pass regeneration error:", error);
    return NextResponse.json({ success: false, error: error?.message || "Failed to regenerate pass" }, { status: 500 });
  }
}
