import { Resend } from 'resend';

const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey ? new Resend(apiKey) : null;
const FROM = process.env.EMAIL_FROM ?? 'PoE2 Marketplace <onboarding@resend.dev>';

/** Send a transactional email. No-ops (logs) when RESEND_API_KEY isn't configured. */
export async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  if (!resend) {
    console.log(`[email skipped — no RESEND_API_KEY] to=${to} subject="${subject}"`);
    return;
  }
  try {
    await resend.emails.send({ from: FROM, to, subject, html });
  } catch (e) {
    console.error('email send failed:', e);
  }
}
