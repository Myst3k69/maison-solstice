"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { formatMoney } from "@/lib/money";
import { getProduct } from "@/lib/products";

export function CartLines() {
  const { lines, setQty, removeLine, stockLeft } = useCart();

  if (lines.length === 0) {
    return (
      <div className="empty">
        <p className="eyebrow">Panier</p>
        <h2>Rien pour l’instant.</h2>
        <p className="muted" style={{ marginTop: "0.7rem" }}>
          La nuit est encore vide. Choisissez un objet utile, ou laissez le guide décider du destinataire.
        </p>
        <div className="btn-row">
          <Link className="btn" href="/boutique">
            Entrer dans la boutique
          </Link>
          <Link className="btn btn-ghost" href="/guide">
            Guide cadeaux
          </Link>
        </div>
      </div>
    );
  }

  return (
    <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
      {lines.map((line) => {
        const product = getProduct(line.slug);
        if (!product) return null;
        const variant = product.variants?.find((item) => item.id === line.variantId);
        const left = stockLeft(line.slug, line.variantId);
        return (
          <li className="line" key={`${line.slug}-${line.variantId ?? ""}`}>
            <Link href={`/produit/${product.slug}`} className="line-media" tabIndex={-1} aria-hidden="true">
              <Image src={product.images[0].src} alt="" fill sizes="72px" />
            </Link>
            <div>
              <h3>
                <Link href={`/produit/${product.slug}`}>{product.name}</Link>
              </h3>
              {variant ? <p className="muted">Taille {variant.label}</p> : null}
              <p>{formatMoney(product.price * 100 * line.qty)}</p>
              <div className="qty" role="group" aria-label={`Quantité pour ${product.name}`}>
                <button
                  type="button"
                  onClick={() => setQty(line.slug, line.variantId, line.qty - 1)}
                  aria-label={`Diminuer la quantité de ${product.name}`}
                >
                  −
                </button>
                <span aria-live="polite">{line.qty}</span>
                <button
                  type="button"
                  onClick={() => setQty(line.slug, line.variantId, line.qty + 1)}
                  disabled={line.qty >= left}
                  aria-label={`Augmenter la quantité de ${product.name}`}
                >
                  +
                </button>
              </div>
              <button type="button" className="text-btn" onClick={() => removeLine(line.slug, line.variantId)}>
                Retirer
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function CartSummary({ shippingCents }: { shippingCents?: number }) {
  const { lines, subtotalCents, discountCents, goodsCents, promo, standardShippingCents, amountUntilFreeCents } =
    useCart();
  if (lines.length === 0) return null;
  const shipping = shippingCents ?? standardShippingCents;
  const total = goodsCents + (shippingCents === undefined ? 0 : shipping);

  return (
    <div className="totals">
      <div className="sum-row">
        <span>Sous-total</span>
        <span>{formatMoney(subtotalCents)}</span>
      </div>
      {promo ? (
        <div className="sum-row">
          <span>Remise {promo}</span>
          <span>− {formatMoney(discountCents)}</span>
        </div>
      ) : null}
      {shippingCents !== undefined ? (
        <div className="sum-row">
          <span>Livraison</span>
          <span>{shipping === 0 ? "Offerte" : formatMoney(shipping)}</span>
        </div>
      ) : (
        <p className="muted">
          {standardShippingCents === 0
            ? "La livraison standard est offerte."
            : `Plus que ${formatMoney(amountUntilFreeCents)} d’articles pour la livraison standard offerte.`}
        </p>
      )}
      {shippingCents !== undefined ? (
        <div className="sum-row">
          <strong>Total</strong>
          <strong>{formatMoney(total)}</strong>
        </div>
      ) : null}
    </div>
  );
}
