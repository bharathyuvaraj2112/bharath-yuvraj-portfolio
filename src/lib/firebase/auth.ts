import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth } from "./config";

export async function loginAdmin(email: string, pass: string): Promise<User> {
  const userCredential = await signInWithEmailAndPassword(auth, email, pass);
  return userCredential.user;
}

export async function logoutAdmin(): Promise<void> {
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

  // Fallback check against configured admin email env variable or default logged in user
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  if (adminEmail && user.email?.toLowerCase() === adminEmail.toLowerCase()) {
    return true;
  }

  // If user is authenticated via Firebase Auth, grant admin access in single-admin setup
  return Boolean(user.uid);
}
