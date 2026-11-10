import type { Metadata } from "next";
import Link from "next/link";
import { Container, PageHeader } from "@/components/Container";
import { BRAND_NAME, COUNTRY } from "@/site.config";

export const metadata: Metadata = { title: "About" };

export default function About() {
  return (
    <>
      <PageHeader eyebrow="About" title={`Why ${BRAND_NAME} exists`} />
      <Container className="max-w-3xl py-10">
        <p className="mb-8 rounded-xl border border-wait/30 bg-wait-soft px-4 py-3 text-sm text-wait">
          <strong>Placeholder text.</strong> This story is a draft to be replaced with the founder&apos;s own words,
          names and dates before launch.
        </p>
        <div className="prose-page text-lg">
          <p>
            It started with one vial. It was labelled 10&nbsp;mg and came with a certificate that said so. Out of
            curiosity, our founder paid an independent lab to test it. The result: 0.84&nbsp;mg. Less than a tenth of
            what the label claimed.
          </p>
          <p>
            The seller&apos;s certificate wasn&apos;t technically fake. It was real, for a different vial, from a
            different batch, picked by someone who knew it would pass. That&apos;s what &ldquo;third-party tested&rdquo;
            often means in this industry: one good result, posted once, used forever.
          </p>
          <p>
            So he built the company he&apos;d wished he could buy from. Every lot tested before sale. Three vials, not
            one. Every number published, including the ones that make us look bad. A permanent record nobody can tidy up
            later. And a guarantee that lets any customer check our work.
          </p>
          <p>
            We&apos;re a small team in {COUNTRY}. We don&apos;t think you should trust us because we say so. That&apos;s
            the point.
          </p>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/record" className="rounded-lg bg-accent px-5 py-3 font-semibold text-white hover:bg-accent-dark">See The Record</Link>
          <Link href="/protocol" className="rounded-lg border border-line bg-card px-5 py-3 font-semibold hover:bg-paper">Read the protocol</Link>
        </div>
      </Container>
    </>
  );
}
