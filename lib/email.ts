import "server-only";
import nodemailer from "nodemailer";

function appUrl() {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

async function sendMail(to: string, subject: string, text: string) {
  const host = process.env.SMTP_HOST;
  if (!host) {
    return { skipped: true };
  }

  const transporter = nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: Number(process.env.SMTP_PORT ?? 587) === 465,
    auth:
      process.env.SMTP_USER && process.env.SMTP_PASSWORD
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }
        : undefined
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM ?? "TRACKDiri <no-reply@example.com>",
    to,
    subject,
    text
  });
  return { skipped: false };
}

export function sendVerificationEmail(to: string, token: string) {
  const link = `${appUrl()}/verify-email?token=${encodeURIComponent(token)}`;
  return sendMail(
    to,
    "Verify your TRACKDiri account",
    `Welcome to TRACKDiri. Verify your account using this time-limited link: ${link}`
  );
}

export function sendPasswordResetEmail(to: string, token: string) {
  const link = `${appUrl()}/reset-password?token=${encodeURIComponent(token)}`;
  return sendMail(
    to,
    "Reset your TRACKDiri password",
    `Reset your TRACKDiri password using this time-limited link: ${link}`
  );
}
