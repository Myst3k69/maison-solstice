export const COUNTRIES = ["France", "Belgique", "Suisse", "Luxembourg"] as const;

export type ShippingMethod = "standard" | "express";

export type CheckoutFields = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  postalCode: string;
  city: string;
  country: string;
  shippingMethod: "" | ShippingMethod;
  cardName: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
};

export const emptyCheckout: CheckoutFields = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  postalCode: "",
  city: "",
  country: "France",
  shippingMethod: "",
  cardName: "",
  cardNumber: "",
  expiry: "",
  cvc: "",
};

export function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

export function luhnOk(num: string) {
  if (!/^\d{16}$/.test(num)) return false;
  let sum = 0;
  let alt = false;
  for (let i = num.length - 1; i >= 0; i -= 1) {
    let n = Number(num[i]);
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}

export function expiryOk(value: string, now = new Date()) {
  const match = value.trim().match(/^(\d{2})\s*\/\s*(\d{2})$/);
  if (!match) return false;
  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);
  if (month < 1 || month > 12) return false;
  const end = new Date(year, month, 0, 23, 59, 59);
  return end >= now;
}

export function formatCardNumber(value: string) {
  const digits = digitsOnly(value).slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

export function formatExpiry(value: string) {
  const digits = digitsOnly(value).slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export function validateCheckout(fields: CheckoutFields) {
  const errors: Partial<Record<keyof CheckoutFields, string>> = {};

  if (fields.firstName.trim().length < 2) {
    errors.firstName = "Indiquez votre prénom.";
  }
  if (fields.lastName.trim().length < 2) {
    errors.lastName = "Indiquez votre nom.";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) {
    errors.email = "Cette adresse e-mail n’est pas valide.";
  }

  const phone = digitsOnly(fields.phone);
  if (phone.length < 10 || phone.length > 15) {
    errors.phone = "Indiquez un numéro de téléphone, indicatif compris si besoin.";
  }
  if (fields.address.trim().length < 5) {
    errors.address = "Indiquez la voie et le numéro.";
  }
  if (fields.city.trim().length < 2) {
    errors.city = "Indiquez la ville.";
  }
  if (!COUNTRIES.includes(fields.country as (typeof COUNTRIES)[number])) {
    errors.country = "Choisissez un pays de livraison.";
  }
  if (fields.country === "France" && !/^\d{5}$/.test(fields.postalCode.trim())) {
    errors.postalCode = "Le code postal français comporte cinq chiffres.";
  } else if (fields.country !== "France" && !/^[A-Za-z0-9 -]{3,10}$/.test(fields.postalCode.trim())) {
    errors.postalCode = "Indiquez un code postal valide.";
  }
  if (fields.shippingMethod !== "standard" && fields.shippingMethod !== "express") {
    errors.shippingMethod = "Choisissez un mode de livraison.";
  }
  if (fields.cardName.trim().length < 3) {
    errors.cardName = "Indiquez le nom figurant sur la carte.";
  }
  if (!luhnOk(digitsOnly(fields.cardNumber))) {
    errors.cardNumber = "Le numéro de carte doit comporter 16 chiffres valides.";
  }
  if (!expiryOk(fields.expiry)) {
    errors.expiry = "Indiquez une date d’expiration future, au format MM/AA.";
  }
  if (!/^\d{3}$/.test(fields.cvc.trim())) {
    errors.cvc = "Le cryptogramme comporte trois chiffres.";
  }

  return errors;
}
