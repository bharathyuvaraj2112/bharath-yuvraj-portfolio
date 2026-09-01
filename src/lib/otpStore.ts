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

export function setOtp(email: string, otp: string, ttlMs: number = 300000) {
  const normalized = email.toLowerCase().trim();
  otpStore.set(normalized, {
    otp,
    expiresAt: Date.now() + ttlMs,
  });
}

export function verifyOtp(email: string, otp: string): { valid: boolean; error?: string } {
  const normalized = email.toLowerCase().trim();
  const entry = otpStore.get(normalized);
  if (!entry) {
    return { valid: false, error: "No active verification code found. Please request a new code." };
  }
  if (Date.now() > entry.expiresAt) {
    otpStore.delete(normalized);
    return { valid: false, error: "Verification code has expired. Please request a new code." };
  }
  if (entry.otp !== otp.trim()) {
    return { valid: false, error: "Incorrect 6-digit verification code. Please check your email." };
  }
  otpStore.delete(normalized);
  return { valid: true };
}
