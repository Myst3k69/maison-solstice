import type { Metadata } from "next";
import { Confirmation } from "@/components/confirmation";

export const metadata: Metadata = { title: "Commande confirmée" };

export default async function Page({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  return <Confirmation orderId={orderId} />;
}
