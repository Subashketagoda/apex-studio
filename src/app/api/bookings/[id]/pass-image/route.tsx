import { NextRequest, NextResponse } from "next/server";
import { ImageResponse } from "next/og";
import QRCode from "qrcode";
import { bookingRepository } from "@/lib/repository/bookingRepository";
import { formatTo12Hour, STUDIO_TIMEZONE } from "@/lib/constants";

export const runtime = "nodejs";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const booking = bookingRepository.getById(id);

    if (!booking) {
      return new NextResponse("Booking not found", { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const isDownload = searchParams.get("download") === "true";

    // Format date nicely: e.g. "30 AUGUST 2026"
    let formattedDate = booking.date;
    try {
      const parts = booking.date.split("-");
      if (parts.length === 3) {
        const d = new Date(Date.UTC(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2])));
        formattedDate = d.toLocaleDateString("en-US", {
          day: "2-digit",
          month: "long",
          year: "numeric",
          timeZone: "UTC",
        }).toUpperCase();
      }
    } catch {
      formattedDate = booking.date;
    }

    const timeFormatted = `${formatTo12Hour(booking.startTime)} — ${formatTo12Hour(booking.endTime)}`;
    const passVersion = booking.version || 1;

    // Build absolute URL for QR verification
    const host = request.headers.get("host") || "localhost:3000";
    const protocol = host.startsWith("localhost") ? "http" : "https";
    const verifyUrl = `${protocol}://${host}/booking/verify/${booking.id}?v=${passVersion}`;

    // Generate dynamic QR Code Data URL
    const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
      width: 400,
      margin: 1,
      color: {
        dark: "#050505",
        light: "#ffffff",
      },
    });

    // 1200 x 1800 px High-Res VIP Access Pass
    const imageResponse = new ImageResponse(
      (
        <div
          style={{
            width: "1200px",
            height: "1800px",
            backgroundColor: "#050505",
            backgroundImage: "radial-gradient(circle at 50% 10%, rgba(56, 189, 248, 0.15), transparent 45%), radial-gradient(circle at 85% 85%, rgba(0, 240, 255, 0.08), transparent 40%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "80px 70px",
            color: "#ffffff",
            fontFamily: "sans-serif",
            position: "relative",
          }}
        >
          {/* Subtle Outer Frame Lines */}
          <div
            style={{
              position: "absolute",
              inset: "40px",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              pointerEvents: "none",
              display: "flex",
            }}
          />

          {/* TOP HEADER / BRANDING */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
            }}
          >
            {/* Top Tagline */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor: "#38bdf8",
                  boxShadow: "0 0 16px #38bdf8",
                }}
              />
              <span
                style={{
                  fontSize: "20px",
                  letterSpacing: "0.45em",
                  color: "#38bdf8",
                  fontWeight: 700,
                  textTransform: "uppercase",
                }}
              >
                VIP SOUNDSTAGE ACCESS
              </span>
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor: "#38bdf8",
                  boxShadow: "0 0 16px #38bdf8",
                }}
              />
            </div>

            {/* Main Brand Title */}
            <h1
              style={{
                fontSize: "76px",
                fontWeight: 900,
                letterSpacing: "0.22em",
                margin: "0 0 8px 0",
                color: "#ffffff",
                textAlign: "center",
                textTransform: "uppercase",
              }}
            >
              APEX STUDIO
            </h1>

            <span
              style={{
                fontSize: "22px",
                letterSpacing: "0.4em",
                color: "#94a3b8",
                fontWeight: 600,
                textTransform: "uppercase",
              }}
            >
              PODCAST • VIDEO • MEDIA PRODUCTION
            </span>
          </div>

          {/* CENTER PASS CREDENTIAL CARD */}
          <div
            style={{
              width: "100%",
              backgroundColor: "rgba(18, 18, 18, 0.95)",
              border: "2px solid rgba(56, 189, 248, 0.35)",
              borderRadius: "16px",
              padding: "50px 60px",
              display: "flex",
              flexDirection: "column",
              gap: "36px",
              boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.8)",
              position: "relative",
            }}
          >
            {/* Pass Title & Booking ID Row */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
                paddingBottom: "28px",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <span
                  style={{
                    fontSize: "18px",
                    letterSpacing: "0.25em",
                    color: "#94a3b8",
                    fontWeight: 700,
                    textTransform: "uppercase",
                  }}
                >
                  DIGITAL BOOKING PASS
                </span>
                <span
                  style={{
                    fontSize: "44px",
                    fontWeight: 900,
                    letterSpacing: "0.08em",
                    color: "#38bdf8",
                    fontFamily: "monospace",
                  }}
                >
                  {booking.id}
                </span>
              </div>

              {/* Status Badge */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  backgroundColor: "rgba(34, 197, 94, 0.15)",
                  border: "2px solid #22c55e",
                  borderRadius: "8px",
                  padding: "12px 24px",
                }}
              >
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: "#22c55e",
                    boxShadow: "0 0 12px #22c55e",
                  }}
                />
                <span
                  style={{
                    fontSize: "24px",
                    fontWeight: 800,
                    letterSpacing: "0.15em",
                    color: "#22c55e",
                    textTransform: "uppercase",
                  }}
                >
                  {booking.status} ✓
                </span>
              </div>
            </div>

            {/* Customer & Service Info */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxWidth: "60%" }}>
                <span
                  style={{
                    fontSize: "16px",
                    letterSpacing: "0.2em",
                    color: "#64748b",
                    fontWeight: 700,
                    textTransform: "uppercase",
                  }}
                >
                  GUEST OF HONOR / CREATOR
                </span>
                <span
                  style={{
                    fontSize: "40px",
                    fontWeight: 800,
                    color: "#ffffff",
                    letterSpacing: "0.02em",
                  }}
                >
                  {booking.customerName}
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px", textAlign: "right" }}>
                <span
                  style={{
                    fontSize: "16px",
                    letterSpacing: "0.2em",
                    color: "#64748b",
                    fontWeight: 700,
                    textTransform: "uppercase",
                  }}
                >
                  PRODUCTION SERVICE
                </span>
                <span
                  style={{
                    fontSize: "30px",
                    fontWeight: 700,
                    color: "#38bdf8",
                  }}
                >
                  {booking.service}
                </span>
              </div>
            </div>

            {/* Details Matrix (Date, Time, Duration, Guests) using Flex Rows */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "24px",
                backgroundColor: "rgba(0, 0, 0, 0.45)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "12px",
                padding: "30px 36px",
              }}
            >
              {/* Row 1: Date & Time */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  width: "100%",
                }}
              >
                {/* DATE */}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", width: "48%" }}>
                  <span
                    style={{
                      fontSize: "16px",
                      letterSpacing: "0.2em",
                      color: "#64748b",
                      fontWeight: 700,
                      textTransform: "uppercase",
                    }}
                  >
                    SESSION DATE
                  </span>
                  <span
                    style={{
                      fontSize: "32px",
                      fontWeight: 800,
                      color: "#ffffff",
                    }}
                  >
                    📅 {formattedDate}
                  </span>
                </div>

                {/* TIME */}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", width: "48%" }}>
                  <span
                    style={{
                      fontSize: "16px",
                      letterSpacing: "0.2em",
                      color: "#64748b",
                      fontWeight: 700,
                      textTransform: "uppercase",
                    }}
                  >
                    STUDIO TIME (ASIA/COLOMBO)
                  </span>
                  <span
                    style={{
                      fontSize: "32px",
                      fontWeight: 800,
                      color: "#ffffff",
                    }}
                  >
                    ⏰ {timeFormatted}
                  </span>
                </div>
              </div>

              {/* Row 2: Duration & Guests */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  width: "100%",
                  borderTop: "1px solid rgba(255, 255, 255, 0.06)",
                  paddingTop: "20px",
                }}
              >
                {/* DURATION */}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", width: "48%" }}>
                  <span
                    style={{
                      fontSize: "16px",
                      letterSpacing: "0.2em",
                      color: "#64748b",
                      fontWeight: 700,
                      textTransform: "uppercase",
                    }}
                  >
                    SESSION DURATION
                  </span>
                  <span
                    style={{
                      fontSize: "28px",
                      fontWeight: 800,
                      color: "#38bdf8",
                    }}
                  >
                    ⏳ {booking.durationMinutes} MINUTES ({(booking.durationMinutes / 60).toFixed(1)} HR)
                  </span>
                </div>

                {/* GUESTS */}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", width: "48%" }}>
                  <span
                    style={{
                      fontSize: "16px",
                      letterSpacing: "0.2em",
                      color: "#64748b",
                      fontWeight: 700,
                      textTransform: "uppercase",
                    }}
                  >
                    TOTAL GUESTS
                  </span>
                  <span
                    style={{
                      fontSize: "28px",
                      fontWeight: 800,
                      color: "#ffffff",
                    }}
                  >
                    👥 {booking.numberOfPeople} PERSONS
                  </span>
                </div>
              </div>
            </div>

            {/* Stylized Audio Waveform Graphic */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "8px",
                height: "36px",
                padding: "0 10px",
              }}
            >
              {[25, 45, 80, 55, 30, 95, 60, 40, 75, 100, 70, 45, 85, 35, 90, 60, 30, 75, 50, 95, 40, 80, 60, 35, 90, 50, 30, 70, 45, 85, 60, 30].map((h, i) => (
                <div
                  key={i}
                  style={{
                    width: "8px",
                    height: `${(h * 32) / 100}px`,
                    backgroundColor: i % 4 === 0 ? "#38bdf8" : "rgba(255, 255, 255, 0.25)",
                    borderRadius: "4px",
                  }}
                />
              ))}
            </div>
          </div>

          {/* BOTTOM QR CODE & INSTRUCTIONS */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "48px",
              width: "100%",
              backgroundColor: "rgba(12, 12, 12, 0.9)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "16px",
              padding: "36px 50px",
            }}
          >
            {/* QR Code Container */}
            <div
              style={{
                backgroundColor: "#ffffff",
                padding: "16px",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 35px rgba(56, 189, 248, 0.4)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrDataUrl}
                alt="Verification QR Code"
                width={220}
                height={220}
                style={{ borderRadius: "6px" }}
              />
            </div>

            {/* Instructions */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", flex: 1 }}>
              <span
                style={{
                  fontSize: "28px",
                  fontWeight: 900,
                  letterSpacing: "0.06em",
                  color: "#ffffff",
                  textTransform: "uppercase",
                }}
              >
                PRESENT THIS PASS UPON ARRIVAL
              </span>

              <p
                style={{
                  fontSize: "20px",
                  color: "#94a3b8",
                  lineHeight: "1.4",
                  margin: 0,
                }}
              >
                Scan with any mobile camera at the APEX STUDIO reception desk to verify reservation credential and gain studio access.
              </p>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  marginTop: "6px",
                }}
              >
                <span
                  style={{
                    fontSize: "15px",
                    fontFamily: "monospace",
                    color: "#38bdf8",
                    backgroundColor: "rgba(56, 189, 248, 0.12)",
                    padding: "6px 14px",
                    borderRadius: "6px",
                    border: "1px solid rgba(56, 189, 248, 0.3)",
                  }}
                >
                  VER: v{passVersion} • REVISION ACTIVE
                </span>
                <span
                  style={{
                    fontSize: "15px",
                    fontFamily: "monospace",
                    color: "#64748b",
                  }}
                >
                  COLOMBO 07, SRI LANKA
                </span>
              </div>
            </div>
          </div>

          {/* FOOTER METADATA */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              fontSize: "16px",
              fontFamily: "monospace",
              color: "#64748b",
              borderTop: "1px solid rgba(255, 255, 255, 0.08)",
              paddingTop: "24px",
            }}
          >
            <span>APEX STUDIO • SOUNDSTAGE ACCESS PASS</span>
            <span>TIMEZONE: ASIA/COLOMBO (UTC+05:30)</span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 1800,
      }
    );

    if (isDownload) {
      imageResponse.headers.set(
        "Content-Disposition",
        `attachment; filename="APEX-STUDIO-BOOKING-${booking.id}.png"`
      );
    } else {
      imageResponse.headers.set(
        "Content-Disposition",
        `inline; filename="APEX-STUDIO-BOOKING-${booking.id}.png"`
      );
    }
    imageResponse.headers.set("Cache-Control", "public, max-age=60, s-maxage=60");

    return imageResponse;
  } catch (error) {
    console.error("Pass image generation error:", error);
    return new NextResponse("Failed to generate pass image", { status: 500 });
  }
}
