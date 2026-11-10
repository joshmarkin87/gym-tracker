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
      <section className="border-b border-line bg-card">
        <Container className="grid gap-10 py-12 sm:py-16 lg:grid-cols-[1.15fr_1fr] lg:items-center">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-accent">Research peptides, tested in public</p>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              Every lot tested. Every result published. Including the failures.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted">
              A vial labelled 10&nbsp;mg was independently tested and held 0.84&nbsp;mg. Every seller in this industry says
              &ldquo;third-party tested&rdquo;. We would rather show you: three vials from every lot, tested
              individually, every number published before a single vial is sold.
            </p>
            <p className="mt-5 text-2xl font-semibold text-accent">{BRAND_TAGLINE}</p>
          </div>
          <div className="rounded-2xl border border-line bg-paper p-5 shadow-sm sm:p-7">
            <LotCheckForm codes={codes} />
            <dl className="num mt-6 grid grid-cols-3 gap-3 border-t border-line pt-5 text-center">
              <div>
                <dt className="text-xs text-muted">Lots received</dt>
                <dd className="text-2xl font-semibold">{counts.total}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Results published</dt>
                <dd className="text-2xl font-semibold">{counts.tested}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Failed, never sold</dt>
                <dd className="text-2xl font-semibold text-fail">{counts.failed}</dd>
              </div>
            </dl>
          </div>
        </Container>
      </section>

      <section aria-labelledby="latest" className="py-14">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 id="latest" className="text-2xl font-semibold tracking-tight">Latest results</h2>
              <p className="text-muted">The three most recent lots to arrive, straight from The Record. Failed lots included.</p>
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
          <h2 id="how" className="text-2xl font-semibold tracking-tight">How it works</h2>
          <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {STEPS.map((s, i) => (
              <li key={s.title} className="rounded-xl border border-line bg-paper p-4">
                <span className="num flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm font-semibold text-white">
                  {i + 1}
                </span>
                <p className="mt-3 font-semibold">{s.title}</p>
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
          <h2 id="proof" className="text-2xl font-semibold tracking-tight">The parts other sellers leave out</h2>
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
              <Link key={c.href} href={c.href} className="group rounded-2xl border border-line bg-card p-6 hover:border-accent/50 hover:shadow-md">
                <p className="text-lg font-semibold group-hover:text-accent">{c.title}</p>
                <p className="mt-2 text-muted">{c.body}</p>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
