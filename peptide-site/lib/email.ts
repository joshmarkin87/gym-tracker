/**
 * Email sending is STUBBED in this build. Messages are composed with the brand
 * name and written to the server log instead of being sent. To go live, replace
 * the body of `sendEmail` with a call to your email provider.
 */
import { BRAND_NAME, BRAND_TAGLINE, RESPONSE_COMMITMENT, SITE_URL, SUPPORT_EMAIL } from "@/site.config";

type Email = { to: string; subject: string; text: string };

export async function sendEmail(email: Email): Promise<void> {
  // TODO(launch): send through a real provider.
  console.log(`[email stub] To: ${email.to}\nSubject: ${email.subject}\n\n${email.text}\n`);
}

const signature = `\n\n${BRAND_NAME}\n${BRAND_TAGLINE}\n${SITE_URL}`;

export function waitlistConfirmation(to: string, productName: string, lotCode: string | null) {
  const lotLine = lotCode
    ? `You're on the waitlist for lot ${lotCode}. You can check its full results at any time: ${SITE_URL}/lot/${lotCode}`
    : `You're on the waitlist for the next lot of ${productName}. We'll email you when its results are published.`;
  return {
    to,
    subject: `${BRAND_NAME}: you're on the waitlist for ${productName}`,
    text: `${lotLine}\n\nWe will email you once when ordering opens. Nothing else, and we never share your address.${signature}`,
  };
}

export function contactReceipt(to: string) {
  return {
    to,
    subject: `${BRAND_NAME}: we have your message`,
    text: `Thanks for writing. ${RESPONSE_COMMITMENT}\n\nIf it's urgent, reply to this email or write to ${SUPPORT_EMAIL}.${signature}`,
  };
}
