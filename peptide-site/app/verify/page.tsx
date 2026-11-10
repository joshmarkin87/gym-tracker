import type { Metadata } from "next";
import Link from "next/link";
import { Container, PageHeader } from "@/components/Container";
import { LotCheckForm } from "@/components/LotCheckForm";
import { getLots } from "@/lib/data";

export const metadata: Metadata = {
  title: "Verify a lot",
  description: "Enter the lot code from your vial label to see all three individual test results and the full lab report.",
};

export default function Verify() {
  const lots = getLots();
  return (
    <>
      <PageHeader eyebrow="Verify a lot" title="See exactly what was in your lot">
        Enter the lot code from your vial label, or scan the QR code next to it. You&apos;ll see the three individual
        results, the range, the status, and the lab&apos;s full unedited report.
      </PageHeader>
      <Container className="max-w-2xl py-10">
        <div className="surface rounded-2xl border border-line bg-card p-5 sm:p-7">
          <LotCheckForm codes={lots.map((l) => l.code)} />
        </div>

        <h2 className="mt-10 text-lg font-semibold">Where to find the lot code</h2>
        <p className="mt-1 text-muted">
          Every vial label carries the product name, the label claim, the lot code (for example{" "}
          <span className="lot-code text-ink">RET-2026-001</span>) and a QR code. The QR code opens the same page this
          search does.
        </p>

        <h2 className="mt-8 text-lg font-semibold">All lot codes</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {lots.map((l) => (
            <li key={l.code}>
              <Link href={`/lot/${l.code}`} className="lot-code inline-block rounded-md border border-line bg-card px-3 py-1.5 text-sm hover:border-accent hover:text-accent">
                {l.code}
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-muted">
          With results and dispositions:{" "}
          <Link href="/record" className="text-accent underline">The Record</Link>.
        </p>
      </Container>
    </>
  );
}
