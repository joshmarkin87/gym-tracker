import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Container, PageHeader } from "@/components/Container";
import { CartView } from "@/components/CartView";
import { CheckoutStub } from "@/components/CheckoutStub";
import { LAUNCH_MODE, RUO_NOTICE } from "@/site.config";

export const metadata: Metadata = { title: "Checkout", robots: { index: false } };

export default function Checkout() {
  if (LAUNCH_MODE !== "live") redirect("/cart");
  return (
    <>
      <PageHeader title="Checkout" />
      <Container className="max-w-3xl py-10">
        <CartView ruo={RUO_NOTICE} checkout />
        <CheckoutStub />
      </Container>
    </>
  );
}
