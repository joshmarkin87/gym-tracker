import Link from "next/link";
import { Container } from "@/components/Container";
import { LotCheckForm } from "@/components/LotCheckForm";
import { LotCard } from "@/components/LotCard";
import { ArrowIcon } from "@/components/icons";
import { getLots, getProduct, lotCounts } from "@/lib/data";
import { BRAND_TAGLINE, SPEC } from "@/site.config";

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

  return (
    <>
      <section className="grid-field border-b border-line">
        <Container className="grid gap-10 py-12 sm:py-20 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-12">
          <div className="min-w-0">
            <p className="eyebrow mb-4">Research peptides, tested in public</p>
            <h1 className="text-[2.375rem] font-semibold leading-[1.06] tracking-[-0.035em] sm:text-[3.375rem]">
              Every lot tested. Every result published. Including the failures.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted">
              A vial labelled 10&nbsp;mg was independently tested and held 0.84&nbsp;mg. Every seller in this industry says
              &ldquo;third-party tested&rdquo;. We would rather show you: three vials from every lot, tested
              individually, every number published before a single vial is sold.
            </p>
            <p className="mt-6 text-2xl font-semibold tracking-tight text-accent">{BRAND_TAGLINE}</p>
          </div>
          <div className="halo min-w-0">
          <div className="glass rounded-3xl border border-ink/10 p-5 sm:p-7">
            <LotCheckForm codes={codes} />
            <dl className="readout mt-6 grid grid-cols-3 border-t border-line pt-5 text-center">
              <div>
                <dt className="label px-1">Lots received</dt>
                <dd className="num mt-1 text-3xl font-medium">{counts.total}</dd>
              </div>
              <div>
                <dt className="label px-1">Results published</dt>
                <dd className="num mt-1 text-3xl font-medium">{counts.tested}</dd>
              </div>
              <div>
                <dt className="label px-1">Failed, never sold</dt>
                <dd className="num mt-1 text-3xl font-medium text-fail">{counts.failed}</dd>
              </div>
            </dl>
          </div>
          </div>
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

      <section aria-labelledby="how" className="border-y border-line bg-white py-14">
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

      <section aria-labelledby="proof" className="py-14">
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
