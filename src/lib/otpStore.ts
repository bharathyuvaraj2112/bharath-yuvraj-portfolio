import { adminDb } from "./firebase/admin";
import { db } from "./firebase/config";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";

interface OtpEntry {
  otp: string;
  expiresAt: number;
}

const globalOtpStore = globalThis as unknown as {
  _otpMap?: Map<string, OtpEntry>;
};

if (!globalOtpStore._otpMap) {
  globalOtpStore._otpMap = new Map<string, OtpEntry>();
}

export const otpStore = globalOtpStore._otpMap;

const OTP_COLLECTION = "admin_otps";

export async function setOtp(email: string, otp: string, ttlMs: number = 300000): Promise<void> {
  const normalized = email.toLowerCase().trim();
  const entry: OtpEntry = {
    otp: otp.trim(),
    expiresAt: Date.now() + ttlMs,
  };

  // 1. Save in local in-memory store
  otpStore.set(normalized, entry);

  // 2. Persist in Firestore for reliable cross-instance / serverless verification
  try {
    if (adminDb) {
      await adminDb.collection(OTP_COLLECTION).doc(normalized).set({
        email: normalized,
        otp: entry.otp,
        expiresAt: entry.expiresAt,
        createdAt: Date.now(),
      });
      return;
    }
  } catch (adminErr) {
    console.warn("Firestore Admin setOtp warning, attempting client firestore fallback:", adminErr);
  }

  try {
    const docRef = doc(db, OTP_COLLECTION, normalized);
    await setDoc(docRef, {
      email: normalized,
      otp: entry.otp,
      expiresAt: entry.expiresAt,
      createdAt: Date.now(),
    });
  } catch (clientErr) {
    console.warn("Firestore Client setOtp fallback warning:", clientErr);
  }
}

export async function verifyOtp(email: string, otp: string): Promise<{ valid: boolean; error?: string }> {
  const normalized = email.toLowerCase().trim();
  const inputOtp = otp.trim();
  let entry: OtpEntry | undefined;

  // 1. Try reading from Firestore Admin
  try {
    if (adminDb) {
      const snap = await adminDb.collection(OTP_COLLECTION).doc(normalized).get();
      if (snap.exists) {
        const data = snap.data() as { otp: string; expiresAt: number };
        if (data?.otp) {
          entry = { otp: String(data.otp).trim(), expiresAt: Number(data.expiresAt) };
        }
      }
    }
  } catch (adminErr) {
    console.warn("Firestore Admin verifyOtp warning:", adminErr);
  }

  // 2. Fallback to Firestore client SDK if not found via Admin
  if (!entry) {
    try {
      const docRef = doc(db, OTP_COLLECTION, normalized);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data() as { otp: string; expiresAt: number };
        if (data?.otp) {
          entry = { otp: String(data.otp).trim(), expiresAt: Number(data.expiresAt) };
        }
      }
    } catch (clientErr) {
      console.warn("Firestore Client verifyOtp warning:", clientErr);
    }
  }

  // 3. Fallback to in-memory map
  if (!entry) {
    entry = otpStore.get(normalized);
  }

  if (!entry) {
    return { valid: false, error: "No active verification code found. Please request a new code." };
  }

  if (Date.now() > entry.expiresAt) {
    await deleteStoredOtp(normalized);
    return { valid: false, error: "Verification code has expired. Please request a new code." };
  }

  if (entry.otp !== inputOtp) {
    return { valid: false, error: "Incorrect 6-digit verification code. Please check your email." };
  }

  // Verification succeeded - clear OTP to prevent reuse
  await deleteStoredOtp(normalized);
  return { valid: true };
}

async function deleteStoredOtp(normalizedEmail: string): Promise<void> {
  otpStore.delete(normalizedEmail);

  try {
    if (adminDb) {
      await adminDb.collection(OTP_COLLECTION).doc(normalizedEmail).delete();
      return;
    }
  } catch (adminErr) {
    console.warn("Firestore Admin deleteStoredOtp warning:", adminErr);
  }

  try {
    const docRef = doc(db, OTP_COLLECTION, normalizedEmail);
    await deleteDoc(docRef);
  } catch (clientErr) {
    console.warn("Firestore Client deleteStoredOtp warning:", clientErr);
  }
}
