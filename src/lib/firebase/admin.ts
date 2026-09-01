import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

let adminApp!: App;

const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "bharath-yuvraj-portfolio";
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL || "firebase-adminsdk-fbsvc@bharath-yuvraj-portfolio.iam.gserviceaccount.com";
const rawPrivateKey = process.env.FIREBASE_PRIVATE_KEY || "";

function formatPrivateKey(key: string): string | undefined {
  if (!key) return undefined;
  let formatted = key.trim();
  if ((formatted.startsWith('"') && formatted.endsWith('"')) || (formatted.startsWith("'") && formatted.endsWith("'"))) {
    formatted = formatted.slice(1, -1);
  }
  formatted = formatted.replace(/\\n/g, "\n").replace(/\r\n/g, "\n");
  if (!formatted.includes("\n") && formatted.includes("-----BEGIN PRIVATE KEY-----")) {
    const header = "-----BEGIN PRIVATE KEY-----";
    const footer = "-----END PRIVATE KEY-----";
    const body = formatted.replace(header, "").replace(footer, "").trim().replace(/\s+/g, "");
    const lines = body.match(/.{1,64}/g) || [];
    formatted = `${header}\n${lines.join("\n")}\n${footer}`;
  }
  return formatted;
}

const privateKey = formatPrivateKey(rawPrivateKey);

if (!getApps().length) {
  let appInitialized = false;
  if (projectId && clientEmail && privateKey) {
    try {
      adminApp = initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
      appInitialized = true;
    } catch (err) {
      console.warn("Failed to initialize Firebase Admin with cert, falling back to basic app config:", err);
    }
  }

  if (!appInitialized) {
    adminApp = initializeApp({ projectId });
  }
} else {
  adminApp = getApps()[0];
}

export const adminAuth = getAuth(adminApp);
export const adminDb = getFirestore(adminApp);
