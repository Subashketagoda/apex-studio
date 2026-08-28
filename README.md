# APEX STUDIO — Podcast & Media Production Studio

A premium, cinematic digital experience and booking management system for **APEX STUDIO**, a high-end podcast, video, and media production house based in Colombo, Sri Lanka.

Designed with a visual aesthetic inspired by **Apple × Netflix × Spotify × Modern Film Studios × Luxury Creative Agencies**.

---

## 🚀 Key Features

### 1. 🎙️ High-End Creative Experience
- **Cinematic Dark Design System**: Obsidian black (`#050505`), charcoal (`#0c0c0c`), icy blue accents (`#38bdf8`), subtle glow, and grain textures.
- **Dynamic Micro-Interactions**: Ambient lighting, interactive gear showcase (RØDE, Sony 4K, ATEM Mini Pro), expandable service rows, video lightbox player, and intelligent custom cursor.
- **Responsive Layout**: Designed for ultra-wide desktop soundstage monitors down to mobile smartphones.

### 2. 📅 Google Calendar Availability & Booking
- Real-time slot availability checked directly via **Google Calendar FreeBusy API**.
- Double-booking prevention locking slots to **Asia/Colombo (UTC+05:30)**.
- Automated creation of Google Calendar events upon reservation.

### 3. 🔄 Real-Time Dual Synchronization Engine (`bookingSyncService`)
- Centralized synchronization layer:
  - **Google Calendar**: Creates, updates, reschedules, or releases events automatically.
  - **Discord Dispatch**: Sends anti-spam consolidated notification embeds (`NEW`, `CONFIRMED`, `RESCHEDULED`, `UPDATED`, `CANCELLED`, `COMPLETED`).
  - **Fault-Tolerant Retries**: Sync status tracking (`SYNCED`, `PENDING`, `FAILED`) with on-demand retry endpoint (`POST /api/bookings/[id]/sync`).

### 4. 🎟️ 1200 × 1800 px High-Res PNG Booking Pass & Versioning
- **Server-Side PNG Generation**: Dedicated endpoint (`GET /api/bookings/[id]/pass-image`) rendering 1200 × 1800 px VIP access pass image.
- **Pass Versioning (`v1, v2...`)**: Automatically increments revision version upon date, time, duration, or service changes.
- **Reception Scanner (`/booking/verify/[id]?v=X`)**: Validates QR code and detects `⚠️ BOOKING PASS OUTDATED` if superseded by a reschedule.
- **Mobile Actions**: Direct PNG download (`APEX-STUDIO-BOOKING-{id}.png`) and native **Web Share API** integration.

### 5. 🎛️ Producer Desk Admin Portal (`/admin`)
- Passcode-protected (`apexstudio2026`).
- Live metrics, search, filtering, and real-time Google Calendar / Discord sync badges.
- **Producer Controls**:
  - `[ Pass 🎫 ]` & `[ PNG 📥 ]`: View and download 1200x1800 PNG pass.
  - `[ Regen 🔄 ]`: Re-issue pass revision.
  - `[ Edit Details ✏️ ]`: Multi-field updates with instant dual sync.
  - `[ Reschedule 🔄 ]` & `[ Cancel ✕ ]` & `[ Complete ✓ ]`.
  - `[ Quick Verify 🔍 ]`: Scanner bar to verify any pass or QR link.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Styling**: Vanilla CSS & TailwindCSS
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **QR Code Engine**: [qrcode](https://github.com/soldair/node-qrcode)
- **Image Generation**: `@vercel/og` / `next/og` (Satori / Resvg)
- **Timezone**: Strict `Asia/Colombo` (UTC+05:30)

---

## ⚙️ Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/Subashketagoda/apex-studio.git
cd apex-studio
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in the configuration parameters:
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Google Calendar Integration (OAuth 2.0)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REFRESH_TOKEN=your_google_refresh_token
GOOGLE_CALENDAR_ID=primary

# Discord Notification Webhook
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm run start
```

---

## 📜 License
Private & Proprietary — © 2026 APEX STUDIO. All Rights Reserved.
