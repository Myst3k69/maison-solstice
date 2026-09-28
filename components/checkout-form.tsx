"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CartSummary } from "@/components/cart-lines";
import { PromoField } from "@/components/promo-field";
import { useCart } from "@/lib/cart";
import {
  COUNTRIES,
  emptyCheckout,
  formatCardNumber,
  formatExpiry,
  validateCheckout,
  type CheckoutFields,
  type ShippingMethod,
} from "@/lib/checkout";
import { formatMoney } from "@/lib/money";
import { SHIPPING_EXPRESS, getProduct, shippingCents, variantOf } from "@/lib/products";

const FIELD_ORDER: (keyof CheckoutFields)[] = [
  "firstName",
  "lastName",
  "email",
  "phone",
  "address",
  "postalCode",
  "city",
  "country",
  "shippingMethod",
  "cardName",
  "cardNumber",
  "expiry",
  "cvc",
];

export function CheckoutForm() {
  const router = useRouter();
  const { ready, lines, subtotalCents, placeOrder } = useCart();
  const [fields, setFields] = useState<CheckoutFields>(emptyCheckout);
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutFields, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  if (!ready) {
    return (
      <main id="contenu" className="shell">
        <p className="muted" style={{ padding: "2rem 0" }}>
          Le panier revient…
        </p>
      </main>
    );
  }

  if (lines.length === 0) {
    return (
      <main id="contenu" className="shell">
        <div className="empty">
          <p className="eyebrow">Règlement</p>
          <h1>Le panier est vide.</h1>
          <p className="muted">Ajoutez un objet avant de renseigner une adresse.</p>
          <div className="btn-row">
            <Link className="btn" href="/boutique">
              Retour à la boutique
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const standard = shippingCents("standard", subtotalCents);
  const express = SHIPPING_EXPRESS * 100;
  const chosen = fields.shippingMethod === "express" || fields.shippingMethod === "standard" ? fields.shippingMethod : null;

  function update<K extends keyof CheckoutFields>(key: K, value: CheckoutFields[K]) {
    setFields((current) => ({ ...current, [key]: value }));
  }

  return (
    <main id="contenu" className="shell checkout">
      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          const nextErrors = validateCheckout(fields);
          setErrors(nextErrors);
          const first = FIELD_ORDER.find((key) => nextErrors[key]);
          if (first) {
            setFormError("Quelques champs empêchent encore le règlement.");
            const node = document.getElementById(`field-${first}`);
            node?.focus();
            return;
          }
          setFormError(null);
          setPending(true);
          const result = placeOrder({
            shippingMethod: fields.shippingMethod as ShippingMethod,
            customer: {
              firstName: fields.firstName.trim(),
              lastName: fields.lastName.trim(),
              email: fields.email.trim(),
              phone: fields.phone.trim(),
              address: fields.address.trim(),
              postalCode: fields.postalCode.trim(),
              city: fields.city.trim(),
              country: fields.country,
            },
          });
          if (!result.ok) {
            setPending(false);
            setFormError(result.message);
            return;
          }
          router.push(`/confirmation/${result.id}`);
        }}
      >
        <header className="page-head">
          <p className="eyebrow">Règlement</p>
          <h1>Vos coordonnées</h1>
          <p className="lede">Paiement simulé. Les champs sont vérifiés, rien n’est débité.</p>
        </header>

        {formError ? (
          <p className="alert alert-err" role="alert">
            {formError}
          </p>
        ) : null}

        <div className="fields">
          <div className="split">
            <Field label="Prénom" name="firstName" value={fields.firstName} error={errors.firstName} autoComplete="given-name" onChange={(value) => update("firstName", value)} />
            <Field label="Nom" name="lastName" value={fields.lastName} error={errors.lastName} autoComplete="family-name" onChange={(value) => update("lastName", value)} />
          </div>
          <Field label="E-mail" name="email" type="email" value={fields.email} error={errors.email} autoComplete="email" onChange={(value) => update("email", value)} />
          <Field label="Téléphone" name="phone" type="tel" value={fields.phone} error={errors.phone} autoComplete="tel" onChange={(value) => update("phone", value)} />
          <Field label="Adresse" name="address" value={fields.address} error={errors.address} autoComplete="street-address" onChange={(value) => update("address", value)} />
          <div className="split">
            <Field label="Code postal" name="postalCode" value={fields.postalCode} error={errors.postalCode} autoComplete="postal-code" onChange={(value) => update("postalCode", value)} />
            <Field label="Ville" name="city" value={fields.city} error={errors.city} autoComplete="address-level2" onChange={(value) => update("city", value)} />
          </div>
          <div className={`field${errors.country ? " invalid" : ""}`}>
            <label htmlFor="field-country">Pays</label>
            <select
              id="field-country"
              value={fields.country}
              autoComplete="country-name"
              aria-invalid={Boolean(errors.country)}
              aria-describedby={errors.country ? "err-country" : undefined}
              onChange={(event) => update("country", event.target.value)}
            >
              {COUNTRIES.map((country) => (
                <option key={country}>{country}</option>
              ))}
            </select>
            {errors.country ? (
              <p id="err-country" className="field-error">
                {errors.country}
              </p>
            ) : null}
          </div>

          <fieldset className={`choice${errors.shippingMethod ? " invalid" : ""}`}>
            <legend id="livraison-legende">Livraison</legend>
            <label>
              <input
                id="field-shippingMethod"
                type="radio"
                name="shippingMethod"
                value="standard"
                checked={fields.shippingMethod === "standard"}
                onChange={() => update("shippingMethod", "standard")}
              />
              <span>Standard, 3 à 5 jours</span>
              <strong>{standard === 0 ? "Offerte" : formatMoney(standard)}</strong>
            </label>
            <label>
              <input
                type="radio"
                name="shippingMethod"
                value="express"
                checked={fields.shippingMethod === "express"}
                onChange={() => update("shippingMethod", "express")}
              />
              <span>Express, lendemain avant 18 h</span>
              <strong>{formatMoney(express)}</strong>
            </label>
            {errors.shippingMethod ? <p className="field-error">{errors.shippingMethod}</p> : null}
            <p className="muted">Dès 120 € d’articles, avant remise, la livraison standard est offerte. L’express reste à 14 €.</p>
          </fieldset>

          <h2 className="serif" style={{ fontSize: "2rem", fontWeight: 460, marginTop: "0.6rem" }}>
            Paiement simulé
          </h2>
          <p className="muted">
            Pour l’essai : 4242 4242 4242 4242, une date future, trois chiffres. Aucun prestataire n’est contacté.
          </p>
          <Field label="Nom sur la carte" name="cardName" value={fields.cardName} error={errors.cardName} autoComplete="cc-name" onChange={(value) => update("cardName", value)} />
          <Field
            label="Numéro de carte"
            name="cardNumber"
            inputMode="numeric"
            autoComplete="cc-number"
            value={fields.cardNumber}
            error={errors.cardNumber}
            onChange={(value) => update("cardNumber", formatCardNumber(value))}
          />
          <div className="split">
            <Field
              label="Expiration"
              name="expiry"
              placeholder="MM/AA"
              autoComplete="cc-exp"
              value={fields.expiry}
              error={errors.expiry}
              onChange={(value) => update("expiry", formatExpiry(value))}
            />
            <Field
              label="Cryptogramme"
              name="cvc"
              inputMode="numeric"
              autoComplete="cc-csc"
              value={fields.cvc}
              error={errors.cvc}
              onChange={(value) => update("cvc", value.replace(/\D/g, "").slice(0, 3))}
            />
          </div>
          <button className="btn" type="submit" disabled={pending}>
            {pending ? "Validation…" : "Confirmer la commande"}
          </button>
        </div>
      </form>

      <aside className="summary" aria-label="Récapitulatif">
        <h2 className="serif" style={{ fontSize: "2rem", fontWeight: 460 }}>
          Votre sélection
        </h2>
        <ul style={{ listStyle: "none", padding: 0, margin: "0.8rem 0" }}>
          {lines.map((line) => {
            const product = getProduct(line.slug);
            const variant = product ? variantOf(product, line.variantId) : undefined;
            return (
              <li key={`${line.slug}-${line.variantId ?? ""}`} className="sum-row">
                <span>
                  {line.qty} × {product?.name}
                  {variant ? ` · ${variant.label}` : ""}
                </span>
              </li>
            );
          })}
        </ul>
        <PromoField />
        <CartSummary shippingCents={chosen ? shippingCents(chosen, subtotalCents) : undefined} />
        {!chosen ? <p className="muted">Le total s’affichera une fois la livraison choisie.</p> : null}
        <p style={{ marginTop: "0.8rem" }}>
          <Link href="/panier">Modifier le panier</Link>
        </p>
      </aside>
    </main>
  );
}

function Field({
  label,
  name,
  value,
  error,
  onChange,
  type = "text",
  autoComplete,
  inputMode,
  placeholder,
}: {
  label: string;
  name: keyof CheckoutFields;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  type?: string;
  autoComplete?: string;
  inputMode?: "numeric" | "text";
  placeholder?: string;
}) {
  const errorId = `err-${name}`;
  return (
    <div className={`field${error ? " invalid" : ""}`}>
      <label htmlFor={`field-${name}`}>{label}</label>
      <input
        id={`field-${name}`}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        onChange={(event) => onChange(event.target.value)}
      />
      {error ? (
        <p id={errorId} className="field-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
