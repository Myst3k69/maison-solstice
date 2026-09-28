"use client";

import { useId, useState } from "react";
import { useCart } from "@/lib/cart";

export function PromoField() {
  const { promo, promoMessage, applyPromo, clearPromo } = useCart();
  const [value, setValue] = useState("");
  const fieldId = useId();

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        applyPromo(value);
      }}
    >
      <div className="promo">
        <label className="sr-only" htmlFor={fieldId}>
          Code promotionnel
        </label>
        <input
          id={fieldId}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Code"
          autoComplete="off"
        />
        <button className="btn btn-ghost" type="submit">
          Appliquer
        </button>
      </div>
      {promoMessage ? (
        <p className={promoMessage.tone === "ok" ? "alert alert-ok" : "alert alert-err"} role="status">
          {promoMessage.text}
        </p>
      ) : null}
      {promo ? (
        <button type="button" className="text-btn" onClick={clearPromo}>
          Retirer {promo}
        </button>
      ) : null}
    </form>
  );
}
