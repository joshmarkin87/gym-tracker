import type { Metadata } from "next";
import { Container, PageHeader } from "@/components/Container";
import { ContactForm } from "@/components/ContactForm";
import { COUNTRY, RESPONSE_COMMITMENT, SUPPORT_EMAIL } from "@/site.config";

export const metadata: Metadata = { title: "Contact", description: RESPONSE_COMMITMENT };

export default function Contact() {
  return (
    <>
      <PageHeader eyebrow="Contact and customer service" title="Talk to a person">
        {RESPONSE_COMMITMENT} That includes questions about a result, a lot code that doesn&apos;t match, a guarantee claim,
        or a complaint.
      </PageHeader>
      <Container className="grid max-w-5xl gap-8 py-10 lg:grid-cols-[1fr_300px]">
        <ContactForm responseCommitment={RESPONSE_COMMITMENT} />
        <aside className="space-y-5">
          <div className="rounded-2xl border border-line bg-card p-5">
            <p className="font-semibold">Email</p>
            <a href={`mailto:${SUPPORT_EMAIL}`} className="text-accent underline underline-offset-2">{SUPPORT_EMAIL}</a>
          </div>
          <div className="rounded-2xl border border-line bg-card p-5">
            <p className="font-semibold">Our reply commitment</p>
            <p className="mt-1 text-muted">
              Within one business day (Monday to Friday, excluding Canadian statutory holidays). If an answer takes longer
              to find, we&apos;ll tell you that within the day and say when you&apos;ll hear back.
            </p>
          </div>
          <div className="rounded-2xl border border-line bg-card p-5">
            <p className="font-semibold">Where we are</p>
            <p className="mt-1 text-muted">We operate from {COUNTRY}.</p>
          </div>
          <p className="text-sm text-muted">
            We don&apos;t answer questions about using products in people or animals. Everything we sell is for laboratory
            research use only.
          </p>
        </aside>
      </Container>
    </>
  );
}
