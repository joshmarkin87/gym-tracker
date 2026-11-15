import type { Metadata } from "next";
import Link from "next/link";
import { Container, PageHeader } from "@/components/Container";
import { CartView } from "@/components/CartView";
import { LAUNCH_MODE, RUO_NOTICE } from "@/site.config";

export const metadata: Metadata = { title: "Cart" };

export default function CartPage() {
  return (
    <>
      <PageHeader title="Cart" />
      <Container className="max-w-3xl py-10">
        {LAUNCH_MODE === "live" ? (
          <CartView ruo={RUO_NOTICE} />
        ) : (
          <div className="surface rounded-2xl border border-line bg-card p-6">
            <p className="text-lg font-semibold">Ordering hasn&apos;t opened yet.</p>
            <p className="mt-2 text-muted">
              Every result is already public. To be told when you can order, join the waitlist for a lot from its{" "}
              <Link href="/shop" className="text-accent underline">product page</Link>.
            </p>
            <p role="note" className="mt-5 rounded-lg border border-ink/15 bg-paper px-4 py-3 text-sm font-semibold">{RUO_NOTICE}</p>
          </div>
        )}
      </Container>
    </>
  );
}
