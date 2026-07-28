import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";

interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: ContactPayload & { website?: string } = await req.json();
    const { name, email, subject, message, website } = body;

    // Honeypot check for bots
    if (website) {
      return NextResponse.json({ success: true, message: "Your transmission has been received." });
    }

    // Basic validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    // 1. Save to Firestore via Admin SDK
    let firestoreSaved = false;
    try {
      const adminFirestore = adminDb();
      if (adminFirestore) {
        await adminFirestore.collection("contact_messages").add({
          name,
          email,
          subject,
          message,
          status: "unread",
          createdAt: FieldValue.serverTimestamp(),
          source: "contact_form",
        });
        firestoreSaved = true;
      }
    } catch (firestoreErr) {
      console.error("Firestore save error:", firestoreErr);
      // Continue — don't block email attempt
    }

    // 2. Send email notification (if SMTP is configured)
    let emailSent = false;
    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const notifyEmail = process.env.NOTIFY_EMAIL || smtpUser;

    if (smtpHost && smtpUser && smtpPass && notifyEmail) {
      try {
        const nodemailer = await import("nodemailer");
        const transporter = nodemailer.default.createTransport({
          host: smtpHost,
          port: parseInt(process.env.SMTP_PORT || "587"),
          secure: process.env.SMTP_PORT === "465",
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        });

        await transporter.sendMail({
          from: `"IS_ARWAN.DEV Contact" <${smtpUser}>`,
          to: notifyEmail,
          replyTo: email,
          subject: `[SECURE_COMM] ${subject} — from ${name}`,
          html: `
            <div style="font-family: 'JetBrains Mono', monospace; background: #0a0a0a; color: #ededed; padding: 24px; border: 1px solid #161618; max-width: 600px;">
              <h2 style="color: #00F2FF; font-size: 16px; letter-spacing: 0.3em; text-transform: uppercase; margin-bottom: 24px;">
                ▶ NEW_CONTACT_MESSAGE
              </h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="color: #A0A0A0; font-size: 11px; text-transform: uppercase; padding: 6px 0; width: 100px;">FROM</td>
                  <td style="color: #ededed; font-size: 13px; padding: 6px 0;">${name}</td>
                </tr>
                <tr>
                  <td style="color: #A0A0A0; font-size: 11px; text-transform: uppercase; padding: 6px 0;">EMAIL</td>
                  <td style="color: #00F2FF; font-size: 13px; padding: 6px 0;">${email}</td>
                </tr>
                <tr>
                  <td style="color: #A0A0A0; font-size: 11px; text-transform: uppercase; padding: 6px 0;">SUBJECT</td>
                  <td style="color: #ededed; font-size: 13px; padding: 6px 0;">${subject}</td>
                </tr>
              </table>
              <div style="margin-top: 24px; padding: 16px; background: #161618; border-left: 2px solid #00F2FF;">
                <p style="color: #A0A0A0; font-size: 11px; text-transform: uppercase; margin-bottom: 8px;">MESSAGE_PAYLOAD</p>
                <p style="color: #ededed; font-size: 13px; line-height: 1.8; white-space: pre-wrap;">${message}</p>
              </div>
              <p style="color: #A0A0A0; font-size: 10px; margin-top: 24px; text-align: center;">
                SYS_TIMESTAMP: ${new Date().toISOString()} UTC
              </p>
            </div>
          `,
        });
        emailSent = true;
      } catch (emailErr) {
        console.error("Email send error:", emailErr);
        // Still return success if Firestore worked
      }
    }

    if (!firestoreSaved && !emailSent) {
      return NextResponse.json(
        { error: "Failed to process message. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      firestoreSaved,
      emailSent,
      message: "Your transmission has been received.",
    });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
