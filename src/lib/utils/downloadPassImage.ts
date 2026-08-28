"use client";

import { Booking } from "@/lib/types/booking";
import { formatTo12Hour, STUDIO_TIMEZONE } from "@/lib/constants";

/**
 * Generates and downloads a studio-grade 1200 x 1800 px High-Resolution VIP Pass PNG
 * directly in the browser using HTML5 Canvas. Zero server dependencies.
 */
export async function downloadPassAsPNG(booking: Booking): Promise<void> {
  const width = 1200;
  const height = 1800;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // 1. Background Gradient (Dark Charcoal to Deep Black)
  const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
  bgGrad.addColorStop(0, "#161616");
  bgGrad.addColorStop(0.3, "#0d0d0d");
  bgGrad.addColorStop(1, "#040404");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Cyan Ambient Glow Ring
  const glow = ctx.createRadialGradient(width / 2, 200, 10, width / 2, 200, 450);
  glow.addColorStop(0, "rgba(56, 189, 248, 0.25)");
  glow.addColorStop(0.5, "rgba(56, 189, 248, 0.08)");
  glow.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, 700);

  // 3. Thin Outer Border
  ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
  ctx.lineWidth = 4;
  ctx.strokeRect(40, 40, width - 80, height - 80);

  // Inner Accent Border Line
  ctx.strokeStyle = "rgba(56, 189, 248, 0.4)";
  ctx.lineWidth = 2;
  ctx.strokeRect(52, 52, width - 104, height - 104);

  // 4. Header: APEX STUDIO
  ctx.fillStyle = "#ffffff";
  ctx.font = "900 48px sans-serif";
  ctx.fillText("APEX STUDIO", 90, 150);

  ctx.fillStyle = "#94a3b8";
  ctx.font = "600 20px monospace";
  ctx.fillText("SOUNDSTAGE VIP ACCESS CONTROL", 90, 185);

  // Version Badge (Right)
  ctx.fillStyle = "rgba(56, 189, 248, 0.15)";
  ctx.fillRect(width - 320, 110, 230, 60);
  ctx.strokeStyle = "rgba(56, 189, 248, 0.6)";
  ctx.strokeRect(width - 320, 110, 230, 60);

  ctx.fillStyle = "#38bdf8";
  ctx.font = "bold 24px monospace";
  ctx.fillText(`REVISION v${booking.version || 1}`, width - 295, 148);

  // Header Divider
  ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
  ctx.beginPath();
  ctx.moveTo(90, 230);
  ctx.lineTo(width - 90, 230);
  ctx.stroke();

  // 5. Pass Type Badge
  ctx.fillStyle = "#38bdf8";
  ctx.font = "bold 22px monospace";
  ctx.fillText("✦ OFFICIAL VIP PRODUCTION PASS", 90, 280);

  // Service Name
  ctx.fillStyle = "#ffffff";
  ctx.font = "900 64px sans-serif";
  ctx.fillText(booking.service, 90, 360);

  ctx.fillStyle = "#94a3b8";
  ctx.font = "400 24px monospace";
  ctx.fillText("Colombo 07 Soundstage • 4K Sony Multi-Cam Rig • Multitrack WAV", 90, 410);

  // 6. QR Code Area (Center)
  const qrBoxSize = 520;
  const qrX = (width - qrBoxSize) / 2;
  const qrY = 470;

  // QR Container Background
  ctx.fillStyle = "#0a0a0a";
  ctx.fillRect(qrX, qrY, qrBoxSize, qrBoxSize);
  ctx.strokeStyle = "rgba(56, 189, 248, 0.5)";
  ctx.lineWidth = 3;
  ctx.strokeRect(qrX, qrY, qrBoxSize, qrBoxSize);

  // Load and draw QR Code
  const verifyUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/booking/verify/${booking.id}?v=${booking.version || 1}`
      : `https://subashketagoda.github.io/apex-studio/booking/verify/${booking.id}?v=${booking.version || 1}`;

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(
    verifyUrl
  )}&bgcolor=0a0a0a&color=38bdf8&margin=0`;

  try {
    const qrImg = new Image();
    qrImg.crossOrigin = "anonymous";
    await new Promise<void>((resolve, reject) => {
      qrImg.onload = () => resolve();
      qrImg.onerror = () => reject();
      qrImg.src = qrUrl;
    });
    ctx.drawImage(qrImg, qrX + 20, qrY + 20, qrBoxSize - 40, qrBoxSize - 40);
  } catch {
    // QR fallback box
    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 28px monospace";
    ctx.fillText("SCAN QR AT DOOR", qrX + 120, qrY + 270);
  }

  ctx.fillStyle = "#64748b";
  ctx.font = "600 20px monospace";
  ctx.textAlign = "center";
  ctx.fillText("SCAN TERMINAL TO UNLOCK SOUNDSTAGE ENTRY", width / 2, 1035);
  ctx.textAlign = "left";

  // 7. Details Grid (4 Boxes)
  const gridY = 1080;
  const boxW = 490;
  const boxH = 130;
  const gap = 40;
  const startX = 90;

  // Box 1: Reference ID
  ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
  ctx.fillRect(startX, gridY, boxW, boxH);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
  ctx.strokeRect(startX, gridY, boxW, boxH);

  ctx.fillStyle = "#94a3b8";
  ctx.font = "600 18px monospace";
  ctx.fillText("REFERENCE ID", startX + 25, gridY + 45);
  ctx.fillStyle = "#38bdf8";
  ctx.font = "bold 34px monospace";
  ctx.fillText(booking.id, startX + 25, gridY + 95);

  // Box 2: Host Name
  const box2X = startX + boxW + gap;
  ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
  ctx.fillRect(box2X, gridY, boxW, boxH);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
  ctx.strokeRect(box2X, gridY, boxW, boxH);

  ctx.fillStyle = "#94a3b8";
  ctx.font = "600 18px monospace";
  ctx.fillText("HOST / PRODUCER", box2X + 25, gridY + 45);
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 34px sans-serif";
  ctx.fillText(booking.customerName.slice(0, 20), box2X + 25, gridY + 95);

  // Box 3: Date
  const row2Y = gridY + boxH + 25;
  ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
  ctx.fillRect(startX, row2Y, boxW, boxH);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
  ctx.strokeRect(startX, row2Y, boxW, boxH);

  ctx.fillStyle = "#94a3b8";
  ctx.font = "600 18px monospace";
  ctx.fillText("SCHEDULED DATE", startX + 25, row2Y + 45);
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 34px monospace";
  ctx.fillText(booking.date, startX + 25, row2Y + 95);

  // Box 4: Time
  ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
  ctx.fillRect(box2X, row2Y, boxW, boxH);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
  ctx.strokeRect(box2X, row2Y, boxW, boxH);

  ctx.fillStyle = "#94a3b8";
  ctx.font = "600 18px monospace";
  ctx.fillText(`TIME (${STUDIO_TIMEZONE})`, box2X + 25, row2Y + 45);
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 34px monospace";
  ctx.fillText(
    `${formatTo12Hour(booking.startTime)} – ${formatTo12Hour(booking.endTime)}`,
    box2X + 25,
    row2Y + 95
  );

  // 8. Footer Barcode & Status
  const footerY = 1420;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
  ctx.beginPath();
  ctx.moveTo(90, footerY);
  ctx.lineTo(width - 90, footerY);
  ctx.stroke();

  // Status Indicator
  ctx.fillStyle = "#10b981";
  ctx.beginPath();
  ctx.arc(105, 1470, 10, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#10b981";
  ctx.font = "bold 26px monospace";
  ctx.fillText(`STATUS: ${booking.status}`, 130, 1478);

  ctx.fillStyle = "#94a3b8";
  ctx.font = "400 20px monospace";
  ctx.fillText(`Guests: ${booking.numberOfPeople} People • Duration: ${booking.durationMinutes}m`, 130, 1515);

  // Decorative Barcode Lines
  const barY = 1580;
  ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
  for (let i = 90; i < width - 90; i += 12) {
    const barWidth = (i % 5 === 0) ? 6 : (i % 3 === 0) ? 4 : 2;
    ctx.fillRect(i, barY, barWidth, 60);
  }

  ctx.fillStyle = "#64748b";
  ctx.font = "600 18px monospace";
  ctx.textAlign = "center";
  ctx.fillText(`// APEX STUDIO SOUNDSTAGE PASS • ${booking.id} • ${STUDIO_TIMEZONE} //`, width / 2, 1690);

  // 9. Download Trigger
  const dataUrl = canvas.toDataURL("image/png");
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = `APEX-STUDIO-PASS-${booking.id}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
