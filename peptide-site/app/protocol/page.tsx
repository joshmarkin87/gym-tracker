import type { Metadata } from "next";
import Link from "next/link";
import { Container, PageHeader } from "@/components/Container";
import { RETAINS_PER_LOT, SAMPLES_PER_LOT, SPEC } from "@/site.config";

export const metadata: Metadata = {
  title: "Our Protocol",
  description: "How every lot is sampled, tested, published and only then sold. Published pass thresholds included.",
};

export default function Protocol() {
  return (
    <>
      <PageHeader eyebrow="Our Protocol" title="What happens to every lot, in plain language">
        This is the whole system. If we ever change it, the change and the date go at the bottom of this page.
      </PageHeader>
      <Container className="max-w-3xl py-10">
        <div className="prose-page">
          <h2>1. One shipment, one lot code</h2>
          <p>
            Every shipment we receive from a supplier is one lot. It gets one lot code, like{" "}
            <span className="lot-code">RET-2026-001</span>: the product, the year, and a running number. That code goes
            on every vial label from that shipment, next to a QR code that opens the lot&apos;s page on this site. The lot
            is added to <Link href="/record">The Record</Link> the day it arrives, marked &ldquo;In testing&rdquo;.
          </p>

          <h2>2. {SAMPLES_PER_LOT} vials pulled at random, by us</h2>
          <p>We pull {SAMPLES_PER_LOT} vials at random from the stock we will actually sell:</p>
          <ul>
            <li>from different trays or boxes, and from different points in the production run;</li>
            <li>never from samples the supplier sends or chooses;</li>
            <li>after the shipment is in our hands, so nobody upstream knows which vials will be tested.</li>
          </ul>

          <h2>3. Sent to an independent lab, blind</h2>
          <p>
            The {SAMPLES_PER_LOT} vials go to an independent third-party laboratory. They are labelled with codes only, so
            the lab tests them without knowing which supplier or lot they came from, or what result we&apos;d like to
            see. The lab has no stake in our sales.
          </p>

          <h2>4. Tested one vial at a time</h2>
          <p>
            Each vial is tested on its own for three things: <strong>identity</strong> (is the compound on the label the
            compound in the vial), <strong>net content</strong> (how many milligrams are actually in the vial), and{" "}
            <strong>purity</strong> (what share of the material is the labelled compound).
          </p>
          <p>
            We never pool vials into one average. An average can hide a bad vial: one vial at 6&nbsp;mg and two at
            12&nbsp;mg average out to a perfect-looking 10&nbsp;mg. Three separate results show the spread between vials,
            so you can see how consistent the lot is.
          </p>

          <h2 id="thresholds">5. Published pass thresholds</h2>
          <p>A lot passes only if <strong>every one</strong> of the {SAMPLES_PER_LOT} vials meets all three:</p>
          <div className="not-prose my-4 overflow-hidden surface rounded-xl border border-line bg-card">
            <table className="w-full text-left">
              <caption className="sr-only">Pass thresholds</caption>
              <thead className="bg-paper text-sm text-muted">
                <tr><th scope="col" className="px-4 py-2">Test</th><th scope="col" className="px-4 py-2">To pass</th></tr>
              </thead>
              <tbody>
                <tr className="border-t border-line"><th scope="row" className="px-4 py-3 font-semibold">Identity</th><td className="px-4 py-3">Confirmed: the labelled compound is detected</td></tr>
                <tr className="border-t border-line"><th scope="row" className="px-4 py-3 font-semibold">Net content</th><td className="px-4 py-3">{SPEC.netContentMinPct}% to {SPEC.netContentMaxPct}% of the label claim (9.0 to 11.0 mg for a 10 mg vial)</td></tr>
                <tr className="border-t border-line"><th scope="row" className="px-4 py-3 font-semibold">Purity</th><td className="px-4 py-3">At or above {SPEC.purityMinPct}%</td></tr>
              </tbody>
            </table>
          </div>
          <p>
            If any single vial misses any single threshold, the whole lot fails. The website itself enforces this: a
            lot whose results miss the spec cannot be marked for sale.
          </p>

          <h2>6. Results published, then and only then sold</h2>
          <p>
            All three results, the range, the lab&apos;s name, the analysis date and the lab&apos;s full, unedited report go
            on the lot&apos;s page. Only after that does a passing lot go on sale. Nothing is sold while a lot is in
            testing, and nothing is sold on the strength of an earlier lot&apos;s results.
          </p>

          <h2>7. When a lot fails</h2>
          <p>
            It is destroyed or returned to the supplier, and its page says FAILED in plain words, with its results, the
            report, and what happened to the stock. It stays on The Record permanently. We publish failures because a
            testing program that never fails anything isn&apos;t testing much.
          </p>

          <h2>8. {RETAINS_PER_LOT} sealed retain vials kept</h2>
          <p>
            From every lot we keep {RETAINS_PER_LOT} sealed, unopened vials in storage. If a question about a lot ever comes
            up, including a claim under <Link href="/guarantee">our guarantee</Link>, we can send a retain to a lab for a
            fresh test.
          </p>

          <h2>9. Quarterly mystery re-buys</h2>
          <p>
            Once a quarter, someone buys our own product anonymously through this website, like any customer. That
            retail vial, packed and shipped the normal way, is sent to the lab and its result is published on the lot&apos;s
            page. This checks the whole chain, not just the vials we pulled ourselves.
          </p>

          <h2>10. A second lab, a few times a year</h2>
          <p>
            A few times a year we send vials from the same lot to a second, unrelated laboratory, and publish both
            reports side by side. If two independent labs agree, that tells you more than either one alone. If they
            disagree, you&apos;ll see that too.
          </p>

          <h2>What this protocol cannot do</h2>
          <p>
            Testing destroys the vial, so nobody can test the exact vial you receive and still sell it to you. Three
            random vials per lot tell you a lot about the lot, but not everything about every vial. That gap is why the{" "}
            <Link href="/guarantee">guarantee</Link> exists: you can test your own vial, at a lab you choose, and we cover
            it if it fails.
          </p>

          <h2>Changes to this protocol</h2>
          <p>None yet. Any future change will be listed here with its date and the reason.</p>
        </div>
      </Container>
    </>
  );
}
