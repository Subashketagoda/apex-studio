import { adminStorage } from "@/lib/firebase/admin";

export class PassStorageService {
  /**
   * Uploads a generated PNG Booking Pass to Firebase Storage
   * Path: booking-passes/{bookingId}/pass-v{version}.png
   */
  public async uploadBookingPass(
    bookingId: string,
    version: number,
    imageBuffer: Buffer
  ): Promise<string> {
    const storagePath = `booking-passes/${bookingId}/pass-v${version}.png`;

    try {
      if (process.env.FIREBASE_PRIVATE_KEY) {
        const bucket = adminStorage.bucket();
        const file = bucket.file(storagePath);

        await file.save(imageBuffer, {
          metadata: {
            contentType: "image/png",
            metadata: {
              bookingId,
              version: String(version),
              uploadedAt: new Date().toISOString(),
            },
          },
          resumable: false,
        });

        // Make file public or obtain download URL
        try {
          await file.makePublic();
          return `https://storage.googleapis.com/${bucket.name}/${storagePath}`;
        } catch {
          const [signedUrl] = await file.getSignedUrl({
            action: "read",
            expires: "03-01-2030",
          });
          return signedUrl;
        }
      }
    } catch (error) {
      console.warn(`[Firebase Storage] Remote upload skipped for ${bookingId}, using dynamic generator URL:`, error);
    }

    // Default dynamic route URL
    return `/api/bookings/${bookingId}/pass-image?v=${version}`;
  }
}

export const passStorageService = new PassStorageService();
