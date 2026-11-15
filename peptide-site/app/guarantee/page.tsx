import type { Metadata } from "next";
import Link from "next/link";
import { Container, PageHeader } from "@/components/Container";
import { SPEC, SUPPORT_EMAIL } from "@/site.config";

export const metadata: Metadata = {
  title: "The Guarantee",
  description: "Test any vial at a lab you choose. If it materially fails our published spec, full refund, testing cost reimbursed, public recall.",
};

const STEPS = [
  {
    title: "Pick a lab",
    body: "Any independent analytical laboratory you choose. It does not need to be ours or one we suggest. Ask it to test identity, net content and purity, the same three things we publish.",
  },
  {
    title: "Send it an unopened vial",
    body: "The vial must be from a published lot, bought from us, still sealed, and stored as the label says. Keep your order number and a photo of the label showing the lot code.",
  },
  {
    title: "Send us the report",
    body: `Email the lab's full report, your order number and the lot code to ${SUPPORT_EMAIL}, or use the contact form. We confirm we have it within one business day.`,
  },
  {
    title: "We compare it to the published spec",
    body: `If your vial materially fails the spec (identity not confirmed, net content outside ${SPEC.netContentMinPct}-${SPEC.netContentMaxPct}% of label, or purity below ${SPEC.purityMinPct}%), the guarantee applies. We tell you our decision within 5 business days, in writing.`,
  },
  {
    title: "You're paid back, and the lot is recalled in public",
    body: "We refund the full purchase price of your order and reimburse what you paid the lab, on receipt of its invoice. The lot is marked as recalled on its page and on The Record, with your result published next to ours (with your permission, and without your name).",
  },
];

export default function Guarantee() {
  return (
    <>
      <PageHeader eyebrow="The Guarantee" title="Test it yourself. If it fails, we pay.">
        Any customer may send a vial from a published lot to an independent lab of their choosing. If it materially fails
        our published specification, we refund your full purchase, reimburse your testing cost, and publicly recall the lot.
      </PageHeader>
      <Container className="max-w-3xl py-10">
        <h2 className="text-xl font-semibold">Exactly what to do</h2>
        <ol className="mt-5 space-y-4">
          {STEPS.map((s, i) => (
            <li key={s.title} className="flex gap-4 surface rounded-2xl border border-line bg-card p-5">
              <span className="num flex h-7 shrink-0 items-center justify-center rounded-md border border-accent/25 bg-accent-soft px-2 text-xs font-medium text-accent-dark">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <p className="font-semibold">{s.title}</p>
                <p className="mt-1 text-muted">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="prose-page mt-10">
          <h2>What &ldquo;materially fails&rdquo; means</h2>
          <p>
            It means your lab&apos;s result is outside the same thresholds we hold ourselves to, by more than the normal
            measurement uncertainty your lab states on its report. We don&apos;t argue about rounding. If the answer is
            close, we send one of our sealed retain vials from the same lot to a lab for a tie-break, at our cost, and
            publish that too.
          </p>
          <h2>Why we offer this</h2>
          <p>
            We can&apos;t test the vial in your hand without destroying it. You can. This guarantee means the number on
            our lot page is a promise we&apos;re willing to pay for if it&apos;s wrong, not just a claim.
          </p>
          <h2>The fine print, which is short</h2>
          <ul>
            <li>Covers vials bought directly from us, from a lot with published results.</li>
            <li>One vial per claim is enough. You don&apos;t need to test your whole order.</li>
            <li>Claims are open for 12 months from delivery.</li>
            <li>The vial must be unopened and stored as labelled, so the result reflects the product and not its handling.</li>
            <li>The refund covers the whole order, not just the vial tested.</li>
          </ul>
          <p>
            Questions before you test? <Link href="/contact">Ask us</Link>. We&apos;ll answer within one business day.
          </p>
        </div>
      </Container>
    </>
  );
}
