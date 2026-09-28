"use client";

import Link from "next/link";
import { CartLines, CartSummary } from "@/components/cart-lines";
import { PromoField } from "@/components/promo-field";
import { useCart } from "@/lib/cart";

export function CartPage() {
  const { ready, lines } = useCart();

  return (
    <main id="contenu" className="shell" data-cart-ready={ready ? "true" : "false"}>
      <header className="page-head">
        <p className="eyebrow">Panier</p>
        <h1>Ce que vous emportez.</h1>
      </header>
      {!ready ? <p className="muted">Le panier revient…</p> : null}
      {ready ? <CartLines /> : null}
      {ready && lines.length > 0 ? (
        <div style={{ maxWidth: "32rem", marginTop: "1rem" }}>
          <PromoField />
          <CartSummary />
          <div className="btn-row">
            <Link className="btn" href="/checkout">
              Passer au règlement
            </Link>
            <Link className="btn btn-ghost" href="/boutique">
              Continuer
            </Link>
          </div>
        </div>
      ) : null}
    </main>
  );
}
