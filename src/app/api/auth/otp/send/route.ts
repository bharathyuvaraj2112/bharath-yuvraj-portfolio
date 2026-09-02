import { NextResponse } from "next/server";
import { setOtp } from "@/lib/otpStore";
import { sendOtpEmail } from "@/lib/nodemailer";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email address is required." }, { status: 400 });
    }

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Save in persistent server OTP store (valid for 5 minutes)
    await setOtp(email, otpCode, 5 * 60 * 1000);

    // Send email via Nodemailer
    const emailSent = await sendOtpEmail(email, otpCode);

    if (!emailSent) {
      return NextResponse.json(
        { error: "Failed to send 2FA verification email. Please check your internet connection or email setting." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `A 6-digit security code has been sent to ${email}`,
    });
  } catch (err: unknown) {
    console.error("Error in OTP send route:", err);
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
