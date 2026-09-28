"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart";
import type { Product } from "@/lib/products";
import { SHIP_PROMISE } from "@/lib/products";

export function AddToCart({ product }: { product: Product }) {
  const { addItem, openDrawer, stockLeft, nextSerial, ready } = useCart();
  const [variantId, setVariantId] = useState<string | undefined>();
  const [qty, setQty] = useState(1);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedLeft = product.variants
    ? variantId
      ? stockLeft(product.slug, variantId)
      : null
    : stockLeft(product.slug);
  const max = selectedLeft ?? 1;
  const serial = nextSerial(product.slug);

  if (!ready) {
    return <p className="muted">Le stock se précise…</p>;
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setError(null);
        setMessage(null);
        if (product.variants && !variantId) {
          setError("Choisissez une taille avant d’ajouter au panier.");
          return;
        }
        const result = addItem(product.slug, qty, variantId);
        if (!result.ok) {
          setError(result.message ?? "Ajout impossible.");
          return;
        }
        setMessage(result.message ?? "Ajouté au panier.");
        openDrawer();
      }}
    >
      {product.variants ? (
        <fieldset className="choice">
          <legend>Taille</legend>
          <div className="sizes">
            {product.variants.map((variant) => {
              const left = stockLeft(product.slug, variant.id);
              return (
                <button
                  key={variant.id}
                  type="button"
                  className="btn btn-ghost"
                  aria-pressed={variantId === variant.id}
                  disabled={left <= 0}
                  onClick={() => {
                    setVariantId(variant.id);
                    setError(null);
                    setQty(1);
                  }}
                >
                  {variant.label}
                  <span className="sr-only">{left > 0 ? `, ${left} en stock` : ", épuisée"}</span>
                </button>
              );
            })}
          </div>
          <p className="muted">
            {variantId
              ? selectedLeft && selectedLeft > 0
                ? `${selectedLeft} en stock · taille ${product.variants.find((item) => item.id === variantId)?.label}`
                : "Cette taille est épuisée."
              : "S/M et L : le stock est indiqué pour chaque taille."}
          </p>
        </fieldset>
      ) : (
        <p className="muted">{selectedLeft && selectedLeft > 0 ? `${selectedLeft} en stock` : "Épuisé"}</p>
      )}

      {product.limited && serial ? (
        <p className="muted">
          {serial <= product.limited
            ? `Prochain exemplaire : n° ${String(serial).padStart(2, "0")} / ${product.limited}.`
            : "La série est close."}
        </p>
      ) : null}

      <p className="muted">{SHIP_PROMISE}</p>

      <div className="qty" style={{ marginTop: "0.8rem" }}>
        <button
          type="button"
          aria-label="Diminuer la quantité"
          onClick={() => setQty((value) => Math.max(1, value - 1))}
        >
          −
        </button>
        <label className="sr-only" htmlFor={`qte-${product.slug}`}>
          Quantité
        </label>
        <input
          id={`qte-${product.slug}`}
          inputMode="numeric"
          value={qty}
          onChange={(event) => {
            const next = Number(event.target.value);
            if (!Number.isFinite(next)) return;
            setQty(Math.max(1, Math.min(max || 1, Math.floor(next))));
          }}
        />
        <button
          type="button"
          aria-label="Augmenter la quantité"
          onClick={() => setQty((value) => Math.min(max || 1, value + 1))}
          disabled={selectedLeft !== null && qty >= selectedLeft}
        >
          +
        </button>
      </div>

      {error ? (
        <p className="alert alert-err" role="alert">
          {error}
        </p>
      ) : null}
      {message ? (
        <p className="alert alert-ok" role="status">
          {message}
        </p>
      ) : null}

      <div className="btn-row">
        <button className="btn" type="submit" disabled={selectedLeft === 0}>
          {selectedLeft === 0 ? "Épuisé" : "Ajouter au panier"}
        </button>
      </div>
    </form>
  );
}
