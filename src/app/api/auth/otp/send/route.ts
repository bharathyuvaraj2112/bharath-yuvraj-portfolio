import { NextResponse } from "next/server";
import { generateOtp } from "@/lib/otpStore";
import { sendOtpEmail } from "@/lib/nodemailer";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email address is required." }, { status: 400 });
    }

    // Generate 6-digit OTP and HMAC signed token (valid for 5 minutes)
    const { otp, token } = generateOtp(email, 5 * 60 * 1000);

    // Send email via Nodemailer
    const emailSent = await sendOtpEmail(email, otp);

    if (!emailSent) {
      return NextResponse.json(
        { error: "Failed to send 2FA verification email. Please check your internet connection or email setting." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      token,
      message: `A 6-digit security code has been sent to ${email}`,
    });
  } catch (err: unknown) {
    console.error("Error in OTP send route:", err);
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
