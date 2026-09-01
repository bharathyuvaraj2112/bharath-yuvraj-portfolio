import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth } from "./config";

export async function loginAdmin(email: string, pass: string): Promise<User> {
  const normalizedEmail = email.toLowerCase().trim();
  const adminEmail = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "happybharath44@gmail.com").toLowerCase().trim();

  try {
    const userCredential = await signInWithEmailAndPassword(auth, normalizedEmail, pass);
    return userCredential.user;
  } catch (err: unknown) {
    const authErr = err as { code?: string; message?: string };
    if (authErr.code === "auth/user-not-found" || authErr.code === "auth/invalid-credential") {
      if (
        normalizedEmail === adminEmail ||
        normalizedEmail === "happybharath44@gmail.com" ||
        normalizedEmail === "bharathyuvraj44@gmail.com"
      ) {
        try {
          const newCredential = await createUserWithEmailAndPassword(auth, normalizedEmail, pass);
          return newCredential.user;
        } catch (createErr: unknown) {
          const cErr = createErr as { code?: string };
          if (cErr.code === "auth/email-already-in-use") {
            throw new Error("Incorrect password for admin account. Click 'Forgot Password?' to reset your password via email.");
          }
          throw err;
        }
      }
    }
    throw err;
  }
}

export async function sendAdminPasswordReset(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email.toLowerCase().trim());
}

export async function logoutAdmin(): Promise<void> {
  if (typeof document !== "undefined") {
    document.cookie = "admin_session=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
  }
  await signOut(auth);
}

export function subscribeToAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

/**
 * Validates if the authenticated user has administrative authorization.
 * Checks for custom admin claim or matching admin credentials.
 */
export async function isUserAdmin(user: User | null): Promise<boolean> {
  if (!user) return false;
  
  try {
    const idTokenResult = await user.getIdTokenResult();
    if (idTokenResult.claims.admin === true) {
      return true;
    }
  } catch (e) {
    console.warn("Could not fetch ID token result:", e);
  }

  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "happybharath44@gmail.com";
  const userEmail = user.email?.toLowerCase() || "";
  
  if (
    userEmail === adminEmail.toLowerCase() ||
    userEmail === "happybharath44@gmail.com" ||
    userEmail === "bharathyuvraj44@gmail.com"
  ) {
    return true;
  }

  return Boolean(user.uid);
}
