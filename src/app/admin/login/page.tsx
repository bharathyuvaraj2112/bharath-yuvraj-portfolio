"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { sendAdminPasswordReset } from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Terminal, Lock, Mail, Eye, EyeOff, ArrowLeft, ShieldAlert, KeyRound, CheckCircle2, RotateCcw, HelpCircle } from "lucide-react";

export default function AdminLoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState<"credentials" | "otp" | "forgot-password">("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpToken, setOtpToken] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const isSubmittingRef = useRef(false);
  const isResendingRef = useRef(false);

  // Clear admin_session cookie on login page load so fresh email/password + OTP is always required
  useEffect(() => {
    document.cookie = "admin_session=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
  }, []);

  // Step 1: Validate Email & Password, then request 2FA OTP
  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingRef.current || loading) return;

    isSubmittingRef.current = true;
    setError(null);
    setInfoMessage(null);
    setLoading(true);

    try {
      // 1. Authenticate with Firebase Auth
      await login(email, password);

      // 2. Trigger Nodemailer OTP dispatch from server
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      let data: { error?: string; token?: string; message?: string } = {};
      try {
        data = await res.json();
      } catch {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Server error (${res.status}). Failed to dispatch verification code.`);
      }

      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to dispatch 2FA verification code.");
      }

      if (data.token) {
        setOtpToken(data.token);
      }
      setInfoMessage(data.message || `A 6-digit verification code has been sent to ${email}`);
      setOtp("");
      setStep("otp");
    } catch (err: unknown) {
      console.error("Login step 1 error:", err);
      const authErr = err as { code?: string; message?: string };
      if (authErr.code === "auth/invalid-credential" || authErr.code === "auth/user-not-found" || authErr.code === "auth/wrong-password") {
        setError("Invalid email or password. Only authorized administrators can log in.");
      } else if (err instanceof TypeError && err.message.includes("fetch")) {
        setError("Server connection issue. Please check your internet and try again.");
      } else {
        setError(authErr.message || "Failed to authenticate. Please check your credentials.");
      }
    } finally {
      setLoading(false);
      isSubmittingRef.current = false;
    }
  };

  // Step 2: Verify 6-digit OTP and complete Admin Login
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingRef.current || loading) return;

    setError(null);
    setInfoMessage(null);

    const cleanOtp = otp.trim();
    if (!cleanOtp || cleanOtp.length !== 6) {
      setError("Please enter the complete 6-digit verification code.");
      return;
    }

    isSubmittingRef.current = true;
    setLoading(true);

    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          otp: cleanOtp,
          token: otpToken,
        }),
      });

      let data: { error?: string; message?: string } = {};
      try {
        data = await res.json();
      } catch {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Server error (${res.status}). Failed to verify code.`);
      }

      if (!res.ok || data.error) {
        throw new Error(data.error || "Invalid or expired verification code.");
      }

      // Establish admin session cookie
      document.cookie = "admin_session=true; path=/; max-age=86400; SameSite=Lax";
      router.push("/admin/dashboard");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "2FA verification failed.";
      setError(msg);
    } finally {
      setLoading(false);
      isSubmittingRef.current = false;
    }
  };

  // Handle Forgot Password Request
  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingRef.current || loading) return;

    setError(null);
    setInfoMessage(null);

    if (!email) {
      setError("Please enter your admin email address.");
      return;
    }

    isSubmittingRef.current = true;
    setLoading(true);

    try {
      await sendAdminPasswordReset(email.trim().toLowerCase());
      setInfoMessage(`A password reset link has been dispatched to ${email}. Check your inbox.`);
    } catch (err: unknown) {
      console.error("Forgot password error:", err);
      const authErr = err as { message?: string };
      setError(authErr.message || "Failed to send password reset email. Please verify the email address.");
    } finally {
      setLoading(false);
      isSubmittingRef.current = false;
    }
  };

  // Resend OTP Code
  const handleResendOtp = async () => {
    if (isResendingRef.current || resending || loading) return;

    isResendingRef.current = true;
    setError(null);
    setInfoMessage(null);
    setResending(true);

    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      let data: { error?: string; token?: string; message?: string } = {};
      try {
        data = await res.json();
      } catch {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Server error (${res.status}). Failed to resend code.`);
      }

      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to resend verification code.");
      }

      if (data.token) {
        setOtpToken(data.token);
      }
      setOtp("");
      setInfoMessage("A new 6-digit code has been dispatched to your email.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to resend code.";
      setError(msg);
    } finally {
      setResending(false);
      isResendingRef.current = false;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 selection:bg-white selection:text-black">
      <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl p-8 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-white text-black flex items-center justify-center mx-auto shadow-md">
            {step === "credentials" ? (
              <Terminal className="w-6 h-6" />
            ) : step === "otp" ? (
              <KeyRound className="w-6 h-6" />
            ) : (
              <HelpCircle className="w-6 h-6" />
            )}
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            {step === "credentials"
              ? "Portfolio Admin Login"
              : step === "otp"
              ? "Two-Factor Authentication"
              : "Reset Admin Password"}
          </h1>
          <p className="text-xs font-mono text-zinc-400">
            {step === "credentials"
              ? "Authorized administrator access console."
              : step === "otp"
              ? `Enter the 6-digit code sent to ${email}`
              : "We will send a password reset link to your email."}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-mono flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Success / Info Alert */}
        {infoMessage && (
          <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-mono flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>{infoMessage}</span>
          </div>
        )}

        {/* Step 1: Credentials Form */}
        {step === "credentials" && (
          <form onSubmit={handleCredentialsSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-2">
                Admin Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="happybharath44@gmail.com"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-zinc-600 transition-all font-mono"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-mono font-semibold text-zinc-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setStep("forgot-password");
                    setError(null);
                    setInfoMessage(null);
                  }}
                  className="text-xs font-mono text-zinc-400 hover:text-white transition-colors underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-zinc-600 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-500 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-white text-black font-bold text-sm shadow-md hover:bg-zinc-200 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? "Authenticating & Dispatching 2FA..." : "Continue to 2FA Verification"}
            </button>
          </form>
        )}

        {/* Step 2: 2FA OTP Form */}
        {step === "otp" && (
          <form onSubmit={handleOtpSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-2 text-center">
                Enter 6-Digit Email Verification Code
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  maxLength={6}
                  autoFocus
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="123456"
                  className="w-full py-3.5 text-center tracking-[0.5em] text-2xl font-mono font-extrabold rounded-2xl bg-zinc-900 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-white transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full py-3.5 rounded-2xl bg-white text-black font-bold text-sm shadow-md hover:bg-zinc-200 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? "Verifying Code..." : "Verify Code & Access Dashboard"}
            </button>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => {
                  setStep("credentials");
                  setError(null);
                  setInfoMessage(null);
                }}
                className="text-xs font-mono text-zinc-400 hover:text-white transition-colors"
              >
                ← Back to Password Login
              </button>

              <button
                type="button"
                disabled={resending}
                onClick={handleResendOtp}
                className="text-xs font-mono text-zinc-400 hover:text-white transition-colors flex items-center gap-1 disabled:opacity-50"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{resending ? "Sending..." : "Resend Code"}</span>
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Forgot Password Form */}
        {step === "forgot-password" && (
          <form onSubmit={handleForgotPasswordSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-2">
                Admin Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="happybharath44@gmail.com"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-zinc-600 transition-all font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !email}
              className="w-full py-3.5 rounded-2xl bg-white text-black font-bold text-sm shadow-md hover:bg-zinc-200 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? "Dispatching Reset Link..." : "Send Password Reset Link"}
            </button>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => {
                  setStep("credentials");
                  setError(null);
                  setInfoMessage(null);
                }}
                className="text-xs font-mono text-zinc-400 hover:text-white transition-colors"
              >
                ← Return to Login Console
              </button>
            </div>
          </form>
        )}

        {/* Return to Public Website */}
        <div className="pt-4 border-t border-zinc-800 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public Portfolio</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
