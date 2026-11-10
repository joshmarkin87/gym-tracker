import Link from "next/link";
import { Container } from "@/components/Container";
import { LotCheckForm } from "@/components/LotCheckForm";
import { LotCard } from "@/components/LotCard";
import { ArrowIcon } from "@/components/icons";
import { Vial } from "@/components/Vial";
import { StatusGlyph } from "@/components/StatusBadge";
import { mg, pct } from "@/lib/format";
import { getLots, getProduct, lotCounts } from "@/lib/data";
import { BRAND_NAME, BRAND_TAGLINE, COUNTRY, RESPONSE_COMMITMENT, SAMPLES_PER_LOT, SPEC } from "@/site.config";

const STEPS = [
  { title: "A batch arrives", body: "One shipment gets one lot code. It goes into quarantine, not onto the shelf." },
  { title: "3 vials pulled at random", body: "From different trays and different points in the run. Never samples the supplier picked." },
  { title: "Tested one by one", body: "Each vial goes to an independent lab, coded and blind, and is tested on its own. No pooled averages." },
  { title: "All results published", body: "All three numbers, the range, and the lab's full unedited report go up here. Pass or fail." },
  { title: "Then it goes on sale", body: "Only if every vial passes. Not one vial is sold before the results are public." },
];

export default function Home() {
  const codes = getLots().map((l) => l.code);
  const recent = getLots().slice(0, 3);
  const counts = lotCounts();
  const all = getLots();
  const featured = all.find((l) => l.status === "For sale" && l.results);
  const featuredProduct = featured ? getProduct(featured.product)! : null;

  const COMPARE: [string, string, string][] = [
    ["Vials tested per lot", "Often one, sometimes none", `${SAMPLES_PER_LOT}, each tested on its own`],
    ["Who picks the samples", "The supplier, or nobody says", "We do, at random, from stock we sell"],
    ["What gets published", "One certificate, reused for months", "Every vial's numbers for every lot"],
    ["Failed lots", "Never mentioned", "Published and kept forever"],
    ["When it goes on sale", "As soon as it arrives", "Only after results are public"],
    ["If your own test disagrees", "No stated policy", "Refund, test cost repaid, public recall"],
    ["Checking a vial", "Email the seller and wait", "Lot code or QR on every label"],
  ];

  return (
    <>
      <section className="grid-field border-b border-line">
        <Container className="grid gap-10 py-12 sm:py-20 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-12">
          <div className="min-w-0">
            <p className="eyebrow mb-4">Research peptides, tested in public</p>
            <h1 className="headline text-[2.5rem] font-semibold leading-[1.04] tracking-[-0.04em] sm:text-[3.75rem]">
              Every lot tested. Every result published. Including the failures.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted">
              A vial labelled 10&nbsp;mg was independently tested and held 0.84&nbsp;mg. Every seller in this industry says
              &ldquo;third-party tested&rdquo;. We would rather show you: three vials from every lot, tested
              individually, every number published before a single vial is sold.
            </p>
            <p className="mt-6 tagline text-2xl font-semibold tracking-tight text-accent">{BRAND_TAGLINE}</p>
          </div>
          <div className="halo min-w-0">
          <div className="glass rounded-3xl border border-ink/10 p-5 sm:p-7">
            <LotCheckForm codes={codes} />
            {featured && featuredProduct && (
              <Link href={`/lot/${featured.code}`} className="group mt-6 flex items-center gap-4 border-t border-line pt-5">
                <Vial name={featuredProduct.name} size={featuredProduct.nominalSize} lotCode={featured.code} prefix={featuredProduct.lotPrefix} className="vial-float h-40 sm:h-48" />
                <div className="min-w-0 flex-1">
                  <p className="label">Latest lot to pass</p>
                  <p className="lot-code mt-1 text-lg font-semibold group-hover:text-accent">{featured.code}</p>
                  <ul className="mt-3 space-y-1.5">
                    {featured.results!.samples.map((v) => (
                      <li key={v.id} className="num flex items-center gap-2 rounded-lg border border-line bg-paper px-2.5 py-1.5 text-sm">
                        <span className="text-muted">Vial {v.id}</span>
                        <span className="ml-auto font-semibold">{mg(v.netContentMg)} mg</span>
                        <span className="text-muted">{pct(v.purityPct)}%</span>
                        <span className="text-pass"><StatusGlyph kind="pass" /></span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-accent">
                    Open the full report <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none" />
                  </p>
                </div>
              </Link>
            )}
          </div>
          </div>
        </Container>
      </section>

      <section aria-label="The record so far" className="border-b border-line bg-card">
        <Container className="py-8">
          <dl className="grid grid-cols-2 gap-x-4 gap-y-6 text-center sm:grid-cols-4">
            <div><dt className="label">Lots received</dt><dd className="num stat mt-1 text-4xl font-medium sm:text-5xl">{counts.total}</dd></div>
            <div><dt className="label">Vials sent to the lab</dt><dd className="num stat mt-1 text-4xl font-medium sm:text-5xl">{counts.total * SAMPLES_PER_LOT}</dd></div>
            <div><dt className="label">Results published</dt><dd className="num stat mt-1 text-4xl font-medium sm:text-5xl">{counts.tested}</dd></div>
            <div><dt className="label">Failed, never sold</dt><dd className="num mt-1 text-4xl font-medium text-fail sm:text-5xl">{counts.failed}</dd></div>
          </dl>
          <p className="mt-5 text-center text-sm text-muted">
            Other sellers show a perfect record. Ours shows the failures too, because a test that never fails anything
            isn&apos;t testing much.
          </p>
        </Container>
      </section>

      <section aria-labelledby="latest" className="py-14">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 id="latest" className="text-2xl font-semibold tracking-tight sm:text-[1.75rem]">Latest results</h2>
              <p className="mt-1 text-muted">The three most recent lots to arrive, straight from The Record. Failed lots included.</p>
            </div>
            <Link href="/record" className="inline-flex items-center gap-1 font-semibold text-accent hover:underline">
              Every lot, ever <ArrowIcon />
            </Link>
          </div>
          <ul className="mt-6 grid gap-4 md:grid-cols-3">
            {recent.map((lot) => (
              <li key={lot.code}>
                <LotCard lot={lot} product={getProduct(lot.product)!} />
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section aria-labelledby="how" className="border-y border-line bg-card py-14">
        <Container>
          <h2 id="how" className="text-2xl font-semibold tracking-tight sm:text-[1.75rem]">How it works</h2>
          <ol className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {STEPS.map((s, i) => (
              <li key={s.title} className="rounded-2xl border border-line bg-paper p-4">
                <span className="flex items-center gap-2">
                  <span className="num flex h-7 items-center justify-center rounded-md border border-accent/25 bg-accent-soft px-2 text-xs font-medium text-accent-dark">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span aria-hidden="true" className="h-px flex-1 bg-gradient-to-r from-accent/30 to-transparent" />
                </span>
                <p className="mt-4 font-semibold tracking-tight">{s.title}</p>
                <p className="mt-1 text-sm text-muted">{s.body}</p>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-muted">
            A lot passes only if every vial shows confirmed identity, net content between {SPEC.netContentMinPct}% and{" "}
            {SPEC.netContentMaxPct}% of the label, and purity of at least {SPEC.purityMinPct}%.{" "}
            <Link href="/protocol" className="font-semibold text-accent underline underline-offset-2">
              Read the full protocol
            </Link>
          </p>
        </Container>
      </section>

      <section aria-labelledby="compare" className="py-14">
        <Container>
          <h2 id="compare" className="text-2xl font-semibold tracking-tight sm:text-[1.75rem]">&ldquo;Third-party tested&rdquo; can mean almost anything</h2>
          <p className="mt-1 max-w-2xl text-muted">Here is what it usually means in this industry, next to what it means here.</p>
          <div className="surface mt-6 overflow-hidden rounded-2xl border border-line bg-card">
            <table className="w-full text-left text-sm sm:text-base">
              <thead>
                <tr className="border-b border-line">
                  <th scope="col" className="label px-4 py-3 sm:px-6"><span className="sr-only">Question</span></th>
                  <th scope="col" className="label px-3 py-3 sm:px-6">A typical seller</th>
                  <th scope="col" className="label bg-accent-soft px-3 py-3 !text-accent sm:px-6">{BRAND_NAME}</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE.map(([q, them, us]) => (
                  <tr key={q} className="border-b border-line last:border-0">
                    <th scope="row" className="px-4 py-3.5 align-top font-semibold sm:px-6">{q}</th>
                    <td className="px-3 py-3.5 align-top text-muted sm:px-6">{them}</td>
                    <td className="bg-accent-soft px-3 py-3.5 align-top font-medium sm:px-6">
                      <span className="mr-1.5 text-pass"><StatusGlyph kind="pass" className="h-3.5 w-3.5 align-[-0.12em]" /></span>
                      {us}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </section>

      <section aria-label="Service" className="border-y border-line bg-card py-10">
        <Container>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Ships from " + COUNTRY, "Packed and sent from inside the country. No customs surprises for Canadian labs."],
              ["A reply in one business day", RESPONSE_COMMITMENT],
              ["Lot code on every label", "With a QR code that opens that lot's results on your phone."],
              ["Test it yourself", "If your own lab's result materially fails our spec, we refund you and pay for the test."],
            ].map(([t, b]) => (
              <li key={t} className="flex gap-3">
                <span aria-hidden="true" className="led mt-2 text-accent" />
                <div>
                  <p className="font-semibold tracking-tight">{t}</p>
                  <p className="mt-1 text-sm text-muted">{b}</p>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section aria-labelledby="home-faq" className="py-14">
        <Container className="max-w-3xl">
          <h2 id="home-faq" className="text-2xl font-semibold tracking-tight sm:text-[1.75rem]">The questions we&apos;d ask us</h2>
          <div className="mt-6 space-y-3">
            {[
              ["Do you test every vial?", "No. Nobody can: testing uses up the vial. We test three random vials from every lot, one by one, and publish all three results before anything is sold. Our guarantee covers the vial in your hands."],
              ["What happens when a lot fails?", "It is never sold. It is destroyed or returned to the supplier, and its results stay on The Record for good."],
              ["How do I know the certificate matches my vial?", "The lot code on your label is the address of its results page. Scan the QR code or type the code. If the code isn't on The Record, the vial may not be ours, and we want to hear about it."],
            ].map(([q, a]) => (
              <details key={q} className="surface group rounded-2xl border border-line bg-card">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-semibold tracking-tight [&::-webkit-details-marker]:hidden">
                  {q}
                  <span aria-hidden="true" className="text-xl text-accent transition-transform group-open:rotate-45 motion-reduce:transform-none">+</span>
                </summary>
                <p className="px-5 pb-5 text-muted">{a}</p>
              </details>
            ))}
          </div>
          <Link href="/faq" className="mt-5 inline-flex items-center gap-1 font-semibold text-accent hover:underline">
            All questions and answers <ArrowIcon />
          </Link>
        </Container>
      </section>

      <section aria-labelledby="proof" className="border-t border-line py-14">
        <Container>
          <h2 id="proof" className="text-2xl font-semibold tracking-tight sm:text-[1.75rem]">The parts other sellers leave out</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              {
                href: "/record",
                title: "The Record",
                body: "Every lot we have ever received, in order, with its results and what happened to it. Failed lots stay up forever. Nothing is ever removed.",
              },
              {
                href: "/guarantee",
                title: "Test it yourself",
                body: "Send a vial from any published lot to a lab you choose. If it materially fails our published spec, you get a full refund, your testing cost back, and we recall the lot in public.",
              },
              {
                href: "/faq",
                title: "Straight answers",
                body: "Do we test every vial? No. Nobody can, because testing destroys the vial. Here's what we do instead, and the guarantee that covers the vial in your hands.",
              },
            ].map((c) => (
              <Link key={c.href} href={c.href} className="surface group flex flex-col rounded-2xl border border-line bg-card p-6 hover:border-accent/40">
                <p className="flex items-center justify-between gap-3 text-lg font-semibold tracking-tight group-hover:text-accent">
                  {c.title}
                  <ArrowIcon className="h-4 w-4 text-accent transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none" />
                </p>
                <p className="mt-2 text-muted">{c.body}</p>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
