import crypto from "crypto";

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

const OTP_SECRET = process.env.OTP_SECRET || process.env.SMTP_PASS || "portfolio_secure_admin_2fa_otp_key_2025";

export interface GeneratedOtp {
  otp: string;
  token: string;
  expiresAt: number;
}

/**
 * Generates a 6-digit OTP code and a cryptographically signed HMAC verification token.
 * This is 100% stateless and reliable across all serverless instances on Vercel without database latency.
 */
export function generateOtp(email: string, ttlMs: number = 5 * 60 * 1000): GeneratedOtp {
  const normalized = email.toLowerCase().trim();
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + ttlMs;

  const dataToSign = `${normalized}:${otp}:${expiresAt}`;
  const hash = crypto.createHmac("sha256", OTP_SECRET).update(dataToSign).digest("hex");
  const token = `${expiresAt}.${hash}`;

  // Keep in memory map as fallback
  otpStore.set(normalized, { otp, expiresAt });

  return { otp, token, expiresAt };
}

/**
 * Backward-compatible helper to store an OTP in memory.
 */
export function setOtp(email: string, otp: string, ttlMs: number = 5 * 60 * 1000): void {
  const normalized = email.toLowerCase().trim();
  otpStore.set(normalized, {
    otp: otp.trim(),
    expiresAt: Date.now() + ttlMs,
  });
}

/**
 * Verifies the 6-digit OTP code.
 * If token is provided, uses instant cryptographic HMAC verification (stateless).
 * Otherwise falls back to memory store verification.
 */
export function verifyOtp(
  email: string,
  otp: string,
  token?: string
): { valid: boolean; error?: string } {
  const normalized = email.toLowerCase().trim();
  const cleanOtp = otp.trim();

  // 1. Primary: Cryptographic HMAC Token Verification (Stateless & instant across any serverless instance)
  if (token && typeof token === "string" && token.includes(".")) {
    const [expiresAtStr, hash] = token.split(".");
    const expiresAt = parseInt(expiresAtStr, 10);

    if (isNaN(expiresAt) || Date.now() > expiresAt) {
      return { valid: false, error: "Verification code has expired. Please request a new code." };
    }

    const expectedData = `${normalized}:${cleanOtp}:${expiresAt}`;
    const expectedHash = crypto.createHmac("sha256", OTP_SECRET).update(expectedData).digest("hex");

    if (hash === expectedHash) {
      otpStore.delete(normalized);
      return { valid: true };
    }

    return { valid: false, error: "Incorrect 6-digit verification code. Please check your email." };
  }

  // 2. Secondary fallback: In-memory store
  const entry = otpStore.get(normalized);
  if (!entry) {
    return { valid: false, error: "No active verification code found. Please request a new code." };
  }

  if (Date.now() > entry.expiresAt) {
    otpStore.delete(normalized);
    return { valid: false, error: "Verification code has expired. Please request a new code." };
  }

  if (entry.otp !== cleanOtp) {
    return { valid: false, error: "Incorrect 6-digit verification code. Please check your email." };
  }

  otpStore.delete(normalized);
  return { valid: true };
}
