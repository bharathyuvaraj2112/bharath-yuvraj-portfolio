import nodemailer from "nodemailer";

const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
const smtpPort = parseInt(process.env.SMTP_PORT || "465", 10);
const smtpUser = process.env.SMTP_USER || "happybharath44@gmail.com";
const smtpPass = process.env.SMTP_PASS || "lybaqxkeolitxsye";

export const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: true, // 465 uses SSL
  auth: {
    user: smtpUser,
    pass: smtpPass,
  },
});

export async function sendOtpEmail(toEmail: string, otpCode: string): Promise<boolean> {
  const mailOptions = {
    from: `"Portfolio Admin Auth" <${smtpUser}>`,
    to: toEmail,
    subject: `🔐 ${otpCode} - Your Admin Login Verification Code`,
    html: `
      <div style="background-color: #09090b; color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 32px; border-radius: 24px; max-width: 480px; margin: 0 auto; border: 1px solid #27272a;">
        <div style="text-align: center; margin-bottom: 24px;">
          <div style="display: inline-block; background: #ffffff; color: #000000; font-weight: bold; width: 44px; height: 44px; line-height: 44px; border-radius: 14px; font-size: 20px;">
            ⚡
          </div>
          <h2 style="color: #ffffff; margin-top: 16px; margin-bottom: 4px; font-size: 20px; font-weight: 800;">Portfolio Admin Verification</h2>
          <p style="color: #a1a1aa; font-size: 13px; font-family: monospace; margin: 0;">Two-Factor Authentication Required</p>
        </div>

        <div style="background-color: #18181b; border: 1px solid #3f3f46; border-radius: 16px; padding: 24px; text-align: center; margin-bottom: 24px;">
          <span style="color: #a1a1aa; font-size: 11px; font-family: monospace; text-transform: uppercase; tracking: 1px; display: block; margin-bottom: 8px;">Your 6-Digit Security Code</span>
          <div style="font-family: monospace; font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #ffffff; background: #000000; padding: 12px 20px; border-radius: 12px; display: inline-block; border: 1px solid #52525b;">
            ${otpCode}
          </div>
          <p style="color: #a1a1aa; font-size: 12px; font-family: monospace; margin-top: 16px; margin-bottom: 0;">⏰ Valid for 5 minutes. Do not share this code.</p>
        </div>

        <p style="color: #71717a; font-size: 12px; line-height: 1.5; margin: 0; text-align: center;">
          If you did not request this login verification code, please ignore this email or check your admin security settings immediately.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Nodemailer OTP dispatch error:", error);
    return false;
  }
}
