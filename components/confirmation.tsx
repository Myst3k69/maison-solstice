"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";
import { formatMoney } from "@/lib/money";

export function Confirmation({ orderId }: { orderId: string }) {
  const { ready, getOrder, count } = useCart();
  const order = ready ? getOrder(orderId) : undefined;

  return (
    <main id="contenu" className="shell" data-cart-ready={ready ? "true" : "false"} data-cart-count={count}>
      {!ready ? (
        <p className="muted" style={{ padding: "2rem 0" }}>
          Nous retrouvons votre commande…
        </p>
      ) : null}
      {ready && !order ? (
        <div className="empty">
          <p className="eyebrow">Commande</p>
          <h1>Introuvable sur cet appareil.</h1>
          <p className="muted">
            Le numéro {orderId} n’est pas dans le registre local. Les commandes de cette maison restent dans votre
            navigateur.
          </p>
          <div className="btn-row">
            <Link className="btn" href="/boutique">
              Retour à la boutique
            </Link>
          </div>
        </div>
      ) : null}
      {order ? (
        <div style={{ paddingTop: "1.5rem", maxWidth: "40rem" }}>
          <p className="eyebrow">Commande confirmée</p>
          <p className="confirm-id">{order.id}</p>
          <hr className="filet" />
          <p className="lede" style={{ marginTop: "1rem" }}>
            Merci {order.customer.firstName}. Le paiement est simulé : aucun montant n’a été débité, aucun e-mail
            n’est parti vers {order.customer.email}.
          </p>
          <p className="muted" style={{ marginTop: "0.8rem" }}>
            Livraison {order.shippingMethod === "express" ? "express" : "standard"} · {order.customer.address},{" "}
            {order.customer.postalCode} {order.customer.city}, {order.customer.country}. Expédié sous 48 h avant le
            20 décembre.
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: "1.2rem 0" }}>
            {order.lines.map((line) => (
              <li key={`${line.slug}-${line.variantId ?? ""}`} className="sum-row" style={{ borderTop: "1px solid rgba(200,146,42,0.28)", padding: "0.7rem 0" }}>
                <span>
                  {line.qty} × {line.name}
                  {line.variantLabel ? ` · ${line.variantLabel}` : ""}
                </span>
                <span>{formatMoney(line.unitCents * line.qty)}</span>
              </li>
            ))}
          </ul>
          {order.serials && order.serials.length > 0 ? (
            <p>
              {order.serials.map((serial) =>
                serial.from === serial.to
                  ? `Exemplaire n° ${String(serial.from).padStart(2, "0")} / 24.`
                  : `Exemplaires n° ${String(serial.from).padStart(2, "0")} à ${String(serial.to).padStart(2, "0")} / 24.`,
              )}
            </p>
          ) : null}
          <div className="totals">
            <div className="sum-row">
              <span>Sous-total</span>
              <span>{formatMoney(order.subtotalCents)}</span>
            </div>
            {order.discountCents > 0 ? (
              <div className="sum-row">
                <span>Remise {order.promo}</span>
                <span>− {formatMoney(order.discountCents)}</span>
              </div>
            ) : null}
            <div className="sum-row">
              <span>Livraison</span>
              <span>{order.shippingCents === 0 ? "Offerte" : formatMoney(order.shippingCents)}</span>
            </div>
            <div className="sum-row">
              <strong>Total</strong>
              <strong>{formatMoney(order.totalCents)}</strong>
            </div>
          </div>
          <div className="btn-row">
            <Link className="btn" href="/boutique">
              Retour à la boutique
            </Link>
          </div>
        </div>
      ) : null}
    </main>
  );
}
