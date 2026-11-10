import Link from "next/link";
import { Container } from "@/components/Container";
import { LotCheckForm } from "@/components/LotCheckForm";
import { getLots } from "@/lib/data";

export default function NotFound() {
  return (
    <Container className="max-w-2xl py-16">
      <h1 className="text-3xl font-semibold tracking-tight">We couldn&apos;t find that page</h1>
      <p className="mt-3 text-lg text-muted">
        If you followed a QR code or typed a lot code, check it below. Every lot we have ever received has a page, and
        is listed on <Link href="/record" className="text-accent underline">The Record</Link>.
      </p>
      <div className="mt-8 rounded-2xl border border-line bg-card p-5 sm:p-7">
        <LotCheckForm codes={getLots().map((l) => l.code)} />
      </div>
    </Container>
  );
}
