import { NextResponse } from "next/server";
import { append, EMAIL_RE } from "@/lib/store";
import { contactReceipt, sendEmail } from "@/lib/email";

const TOPICS = ["Order or shipping", "A lot or a test result", "The guarantee", "Something else"];

export async function POST(req: Request) {
  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }
  if (body.website) return NextResponse.json({ ok: true });

  const name = String(body.name ?? "").trim().slice(0, 200);
  const email = String(body.email ?? "").trim().toLowerCase();
  const topic = TOPICS.includes(body.topic) ? body.topic : "Something else";
  const lot = String(body.lot ?? "").trim().toUpperCase().slice(0, 40);
  const message = String(body.message ?? "").trim().slice(0, 5000);

  if (!EMAIL_RE.test(email)) return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  if (message.length < 5) return NextResponse.json({ error: "Please write a message." }, { status: 400 });

  await append("contact", { name, email, topic, lot, message });
  await sendEmail(contactReceipt(email));
  return NextResponse.json({ ok: true });
}
