import { NextResponse } from "next/server";
import { verifyOtp } from "@/lib/otpStore";

export async function POST(req: Request) {
  try {
    const { email, otp, token } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP code are required." }, { status: 400 });
    }

    const result = verifyOtp(email, otp, token);

    if (!result.valid) {
      return NextResponse.json({ error: result.error || "Invalid OTP" }, { status: 400 });
    }

    // OTP verified successfully! Create success response & set admin_session cookie
    const res = NextResponse.json({
      success: true,
      message: "2FA Verification successful!",
    });

    res.cookies.set("admin_session", "true", {
      path: "/",
      maxAge: 86400,
      sameSite: "lax",
      httpOnly: false,
    });

    return res;
  } catch (err: unknown) {
    console.error("Error in OTP verify route:", err);
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
