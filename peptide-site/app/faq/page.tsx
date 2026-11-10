import type { Metadata } from "next";
import Link from "next/link";
import { Container, PageHeader } from "@/components/Container";
import { RESPONSE_COMMITMENT, SAMPLES_PER_LOT, SPEC } from "@/site.config";

export const metadata: Metadata = { title: "FAQ", description: "Straight answers, including the uncomfortable ones." };

const FAQ: { q: string; a: React.ReactNode }[] = [
  {
    q: "Do you test every vial?",
    a: (
      <>
        <p>
          No. Nobody can. Testing a vial means opening it and using up its contents, so a tested vial can&apos;t be sold.
          Any seller who says every vial is tested is either not telling the truth or not selling the tested vials.
        </p>
        <p>
          What we do instead: from every lot we pull {SAMPLES_PER_LOT} vials at random from sellable stock, have each one
          tested individually by an independent lab, publish all three results, and sell nothing until they&apos;re up (
          <Link href="/protocol">the full protocol</Link>). And because sampling can&apos;t cover your exact vial,{" "}
          <Link href="/guarantee">the guarantee</Link> does: test it at any lab you like, and if it materially fails our
          published spec, we refund you, pay for the test, and recall the lot publicly.
        </p>
      </>
    ),
  },
  {
    q: "What happens when a batch fails?",
    a: (
      <p>
        It is never sold. It&apos;s destroyed or returned to the supplier, its page says FAILED in plain words with all of
        its results and the lab report, and it stays on <Link href="/record">The Record</Link> forever. We don&apos;t
        delete failures, rename them, or quietly re-test until we get a number we like.
      </p>
    ),
  },
  {
    q: "Why do you publish three results instead of one?",
    a: (
      <p>
        One result tells you about one vial. An average of several hides the worst one. Three separate numbers show you
        how much vials in the same lot differ from each other, which is the thing a single certificate can never show.
      </p>
    ),
  },
  {
    q: "What do the pass thresholds mean?",
    a: (
      <p>
        Every tested vial must have its identity confirmed, contain between {SPEC.netContentMinPct}% and{" "}
        {SPEC.netContentMaxPct}% of the amount on the label, and be at least {SPEC.purityMinPct}% pure. For a 10&nbsp;mg
        vial, that means 9.0 to 11.0&nbsp;mg. One vial outside any limit fails the whole lot.
      </p>
    ),
  },
  {
    q: "Which lab does your testing?",
    a: (
      <p>
        An independent third-party laboratory with no stake in our sales. Its name and the analysis date are on every
        lot page, along with its full, unedited report. A few times a year we also send a lot to a second, unrelated lab
        and publish both reports side by side.
      </p>
    ),
  },
  {
    q: "Could the samples be cherry-picked?",
    a: (
      <p>
        That&apos;s the right question to ask anyone. We pull samples ourselves, at random, from the stock we sell, never
        from samples a supplier sends. The lab receives them coded, so it doesn&apos;t know whose they are. Once a quarter
        someone buys our product anonymously, like any customer, and that vial is tested and published too. And you can
        always test your own vial under <Link href="/guarantee">the guarantee</Link>.
      </p>
    ),
  },
  {
    q: "The lot code on my vial isn't on your site. What does that mean?",
    a: (
      <p>
        Every lot we have ever received has a page and is listed on <Link href="/record">The Record</Link>. If your code
        isn&apos;t there, first check for a typo. If it still doesn&apos;t match, the vial may not be from us.{" "}
        <Link href="/contact">Please contact us</Link> with a photo of the label. We&apos;d like to know.
      </p>
    ),
  },
  {
    q: "Can you tell me how to use a product, or what it does?",
    a: (
      <p>
        No. Everything we sell is a laboratory research material, for research use only and not for human consumption.
        We don&apos;t give advice on use, preparation or effects, and our staff won&apos;t answer those questions. What we
        can tell you is exactly what&apos;s in the vial, how we know, and how it should be stored.
      </p>
    ),
  },
  {
    q: "Why can't I buy right now?",
    a: (
      <p>
        Either ordering hasn&apos;t opened yet (you can join the waitlist for a specific lot from its product page), or the
        product has no lot that has passed testing. When a product shows &ldquo;In testing, not for sale&rdquo;, we mean
        it: nothing ships until the results are published.
      </p>
    ),
  },
  {
    q: "How fast do you reply?",
    a: <p>{RESPONSE_COMMITMENT} A real person reads every message. <Link href="/contact">Contact us</Link>.</p>,
  },
];

export default function Faq() {
  return (
    <>
      <PageHeader eyebrow="FAQ" title="Straight answers, including the hard ones" />
      <Container className="max-w-3xl py-10">
        <div className="space-y-3">
          {FAQ.map((f, i) => (
            <details key={f.q} open={i < 2} className="group rounded-2xl border border-line bg-card">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-lg font-semibold [&::-webkit-details-marker]:hidden">
                {f.q}
                <span aria-hidden="true" className="text-accent transition group-open:rotate-45">+</span>
              </summary>
              <div className="prose-page px-5 pb-3 text-ink">{f.a}</div>
            </details>
          ))}
        </div>
      </Container>
    </>
  );
}
