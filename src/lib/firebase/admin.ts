import * as admin from "firebase-admin";

const projectId =
  process.env.FIREBASE_PROJECT_ID ||
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
  "apex-studio-852a4";

const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY
  ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
  : undefined;

const storageBucket =
  process.env.FIREBASE_STORAGE_BUCKET ||
  process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
  "apex-studio-852a4.firebasestorage.app";

export function getFirebaseAdminApp(): admin.app.App {
  if (admin.apps.length > 0 && admin.apps[0]) {
    return admin.apps[0];
  }

  if (clientEmail && privateKey) {
    return admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
      storageBucket,
    });
  }

  // Fallback to default credentials or mock initialization in development
  try {
    return admin.initializeApp({
      projectId,
      storageBucket,
    });
  } catch (err) {
    return admin.apps[0] || admin.initializeApp();
  }
}

export const adminApp = getFirebaseAdminApp();
export const adminDb = admin.firestore(adminApp);
try {
  adminDb.settings({ ignoreUndefinedProperties: true });
} catch {}
export const adminAuth = admin.auth(adminApp);
export const adminStorage = admin.storage(adminApp);
