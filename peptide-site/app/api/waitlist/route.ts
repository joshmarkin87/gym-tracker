import { NextResponse } from "next/server";
import { getLot, getProduct } from "@/lib/data";
import { append, EMAIL_RE } from "@/lib/store";
import { sendEmail, waitlistConfirmation } from "@/lib/email";

export async function POST(req: Request) {
  let body: { email?: string; product?: string; lot?: string | null; website?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }
  // Honeypot: real people never fill this hidden field.
  if (body.website) return NextResponse.json({ ok: true });

  const email = String(body.email ?? "").trim().toLowerCase();
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  const product = getProduct(String(body.product ?? ""));
  if (!product) return NextResponse.json({ error: "Unknown product." }, { status: 400 });
  const lot = body.lot ? getLot(String(body.lot)) : undefined;
  if (body.lot && (!lot || lot.product !== product.slug)) {
    return NextResponse.json({ error: "Unknown lot." }, { status: 400 });
  }

  await append("waitlist", { email, product: product.slug, lot: lot?.code ?? null, lotStatus: lot?.status ?? null });
  await sendEmail(waitlistConfirmation(email, `${product.name} ${product.nominalSize}`, lot?.code ?? null));
  return NextResponse.json({ ok: true });
}
