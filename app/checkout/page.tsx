import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout-form";

export const metadata: Metadata = { title: "Règlement" };

export default function Page() {
  return <CheckoutForm />;
}
