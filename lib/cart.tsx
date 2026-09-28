"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import {
  FREE_SHIPPING_FROM,
  PROMO_CODE,
  getProduct,
  productStock,
  shippingCents,
  variantOf,
} from "@/lib/products";
import type { ShippingMethod } from "@/lib/checkout";

const STORAGE_KEY = "maison-solstice-v1";

export type CartLine = {
  slug: string;
  variantId?: string;
  qty: number;
};

export type OrderLine = {
  slug: string;
  name: string;
  variantId?: string;
  variantLabel?: string;
  qty: number;
  unitCents: number;
};

export type Order = {
  id: string;
  createdAt: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    postalCode: string;
    city: string;
    country: string;
  };
  shippingMethod: ShippingMethod;
  lines: OrderLine[];
  subtotalCents: number;
  discountCents: number;
  shippingCents: number;
  totalCents: number;
  promo: string | null;
  serials?: { slug: string; from: number; to: number }[];
};

type Persisted = {
  lines: CartLine[];
  promo: string | null;
  orders: Order[];
};

type PromoMessage = { tone: "ok" | "err"; text: string } | null;

type CartContextValue = {
  ready: boolean;
  lines: CartLine[];
  promo: string | null;
  promoMessage: PromoMessage;
  orders: Order[];
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  count: number;
  subtotalCents: number;
  discountCents: number;
  goodsCents: number;
  standardShippingCents: number;
  amountUntilFreeCents: number;
  addItem: (slug: string, qty: number, variantId?: string) => { ok: boolean; message?: string };
  setQty: (slug: string, variantId: string | undefined, qty: number) => void;
  removeLine: (slug: string, variantId: string | undefined) => void;
  applyPromo: (code: string) => void;
  clearPromo: () => void;
  stockLeft: (slug: string, variantId?: string) => number;
  nextSerial: (slug: string) => number | null;
  placeOrder: (input: {
    customer: Order["customer"];
    shippingMethod: ShippingMethod;
  }) => { ok: true; id: string } | { ok: false; message: string };
  getOrder: (id: string) => Order | undefined;
};

const CartContext = createContext<CartContextValue | null>(null);

function sameLine(line: CartLine, slug: string, variantId?: string) {
  return line.slug === slug && (line.variantId ?? "") === (variantId ?? "");
}

function purchasedQty(orders: Order[], slug: string, variantId?: string) {
  return orders.reduce((sum, order) => {
    return (
      sum +
      order.lines
        .filter((line) => line.slug === slug && (line.variantId ?? "") === (variantId ?? ""))
        .reduce((inner, line) => inner + line.qty, 0)
    );
  }, 0);
}

function stockLeftFrom(orders: Order[], slug: string, variantId?: string) {
  const product = getProduct(slug);
  if (!product) return 0;
  if (product.variants && !variantId) {
    return product.variants.reduce(
      (sum, variant) => sum + Math.max(0, variant.stock - purchasedQty(orders, slug, variant.id)),
      0,
    );
  }
  return Math.max(0, productStock(product, variantId) - purchasedQty(orders, slug, variantId));
}

function sanitize(data: Persisted): Persisted {
  const orders = Array.isArray(data.orders) ? data.orders : [];
  const lines = (Array.isArray(data.lines) ? data.lines : []).flatMap((line) => {
    const product = getProduct(line.slug);
    if (!product || !Number.isFinite(line.qty) || line.qty <= 0) return [];
    if (product.variants) {
      if (!variantOf(product, line.variantId)) return [];
    } else if (line.variantId) {
      return [];
    }
    const left = stockLeftFrom(orders, line.slug, line.variantId);
    if (left <= 0) return [];
    return [{ slug: line.slug, variantId: line.variantId, qty: Math.min(Math.floor(line.qty), left) }];
  });
  return {
    lines,
    promo: data.promo === PROMO_CODE ? PROMO_CODE : null,
    orders,
  };
}

function orderId() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  let body = "";
  for (const byte of bytes) body += alphabet[byte % alphabet.length];
  return `MS26-${body}`;
}

function subtotalOf(lines: CartLine[]) {
  return lines.reduce((sum, line) => {
    const product = getProduct(line.slug);
    if (!product) return sum;
    return sum + product.price * 100 * line.qty;
  }, 0);
}

const EMPTY: Persisted = { lines: [], promo: null, orders: [] };
const PROMO_OK: PromoMessage = {
  tone: "ok",
  text: "Code SOLSTICE10 appliqué. Moins dix pour cent sur les articles.",
};

let memory: Persisted = EMPTY;
const listeners = new Set<() => void>();

function loadMemory() {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    memory = raw ? sanitize(JSON.parse(raw) as Persisted) : EMPTY;
  } catch {
    memory = EMPTY;
  }
}

if (typeof window !== "undefined") loadMemory();

function commit(next: Persisted) {
  memory = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memory));
  } catch {
    /* le panier reste en mémoire si le stockage est plein */
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function subscribeReady() {
  return () => {};
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const state = useSyncExternalStore(subscribe, () => memory, () => EMPTY);
  const ready = useSyncExternalStore(subscribeReady, () => true, () => false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notice, setNotice] = useState<PromoMessage>(null);
  const promoMessage = notice ?? (state.promo === PROMO_CODE ? PROMO_OK : null);

  const subtotalCents = subtotalOf(state.lines);
  const discountCents = state.promo === PROMO_CODE ? Math.round(subtotalCents * 0.1) : 0;
  const goodsCents = subtotalCents - discountCents;
  const standardShippingCents = shippingCents("standard", subtotalCents);
  const count = state.lines.reduce((sum, line) => sum + line.qty, 0);
  const amountUntilFreeCents = Math.max(0, FREE_SHIPPING_FROM * 100 - subtotalCents);

  const stockLeft = useCallback(
    (slug: string, variantId?: string) => stockLeftFrom(state.orders, slug, variantId),
    [state.orders],
  );

  const nextSerial = useCallback(
    (slug: string) => {
      const product = getProduct(slug);
      if (!product?.limited) return null;
      return purchasedQty(state.orders, slug) + 1;
    },
    [state.orders],
  );

  const addItem = useCallback((slug: string, qty: number, variantId?: string) => {
    const product = getProduct(slug);
    if (!product) return { ok: false, message: "Cet objet n’est plus au catalogue." };
    if (product.variants && !variantOf(product, variantId)) {
      return { ok: false, message: "Choisissez une taille." };
    }
    const current = memory;
    const safeQty = Math.max(1, Math.floor(qty) || 1);
    const left = stockLeftFrom(current.orders, slug, variantId);
    const existing = current.lines.find((line) => sameLine(line, slug, variantId));
    const inCart = existing?.qty ?? 0;
    const room = left - inCart;
    if (room <= 0) return { ok: false, message: "Il ne reste plus de pièces disponibles." };
    const added = Math.min(safeQty, room);
    const lines = existing
      ? current.lines.map((line) =>
          sameLine(line, slug, variantId) ? { ...line, qty: inCart + added } : line,
        )
      : [...current.lines, { slug, variantId, qty: added }];
    const next = { ...current, lines };
    commit(next);
    if (added < safeQty) return { ok: true, message: `Quantité ajustée : il en reste ${left}.` };
    return { ok: true };
  }, []);

  const setQty = useCallback((slug: string, variantId: string | undefined, qty: number) => {
    const current = memory;
    const left = stockLeftFrom(current.orders, slug, variantId);
    const nextQty = Math.floor(qty);
    const lines = current.lines.flatMap((line) => {
      if (!sameLine(line, slug, variantId)) return [line];
      if (nextQty <= 0) return [];
      return [{ ...line, qty: Math.min(nextQty, left) }];
    });
    const next = { ...current, lines };
    commit(next);
  }, []);

  const removeLine = useCallback((slug: string, variantId: string | undefined) => {
    const current = memory;
    const next = {
      ...current,
      lines: current.lines.filter((line) => !sameLine(line, slug, variantId)),
    };
    commit(next);
  }, []);

  const applyPromo = useCallback((code: string) => {
    const trimmed = code.trim();
    if (!trimmed) {
      setNotice({ tone: "err", text: "Indiquez un code." });
      return;
    }
    if (trimmed.toUpperCase() !== PROMO_CODE) {
      commit({ ...memory, promo: null });
      setNotice({
        tone: "err",
        text: "Ce code ne correspond à aucune offre en cours.",
      });
      return;
    }
    commit({ ...memory, promo: PROMO_CODE });
    setNotice(PROMO_OK);
  }, []);

  const clearPromo = useCallback(() => {
    commit({ ...memory, promo: null });
    setNotice(null);
  }, []);

  const placeOrder = useCallback(
    (input: { customer: Order["customer"]; shippingMethod: ShippingMethod }) => {
      const current = memory;
      if (current.lines.length === 0) return { ok: false as const, message: "Le panier est vide." };
      for (const line of current.lines) {
        const left = stockLeftFrom(current.orders, line.slug, line.variantId);
        if (line.qty > left) {
          return {
            ok: false as const,
            message: "Une pièce n’est plus disponible dans cette quantité. Ajustez le panier.",
          };
        }
      }
      const subtotal = subtotalOf(current.lines);
      const discount = current.promo === PROMO_CODE ? Math.round(subtotal * 0.1) : 0;
      const shipping = shippingCents(input.shippingMethod, subtotal);
      const serials: Order["serials"] = [];
      const lines: OrderLine[] = current.lines.flatMap((line) => {
        const product = getProduct(line.slug);
        if (!product) return [];
        if (product.limited) {
          const from = purchasedQty(current.orders, line.slug) + 1;
          serials.push({ slug: line.slug, from, to: from + line.qty - 1 });
        }
        return [
          {
            slug: line.slug,
            name: product.name,
            variantId: line.variantId,
            variantLabel: variantOf(product, line.variantId)?.label,
            qty: line.qty,
            unitCents: product.price * 100,
          },
        ];
      });
      const id = orderId();
      const order: Order = {
        id,
        createdAt: new Date().toISOString(),
        customer: input.customer,
        shippingMethod: input.shippingMethod,
        lines,
        subtotalCents: subtotal,
        discountCents: discount,
        shippingCents: shipping,
        totalCents: subtotal - discount + shipping,
        promo: current.promo,
        serials,
      };
      const next = { lines: [], promo: null, orders: [...current.orders, order] };
      commit(next);
      setNotice(null);
      return { ok: true as const, id };
    },
    [],
  );

  const getOrder = useCallback(
    (id: string) => state.orders.find((order) => order.id === id),
    [state.orders],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      ready,
      lines: state.lines,
      promo: state.promo,
      promoMessage,
      orders: state.orders,
      drawerOpen,
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
      count,
      subtotalCents,
      discountCents,
      goodsCents,
      standardShippingCents,
      amountUntilFreeCents,
      addItem,
      setQty,
      removeLine,
      applyPromo,
      clearPromo,
      stockLeft,
      nextSerial,
      placeOrder,
      getOrder,
    }),
    [
      ready,
      state.lines,
      state.promo,
      state.orders,
      promoMessage,
      drawerOpen,
      count,
      subtotalCents,
      discountCents,
      goodsCents,
      standardShippingCents,
      amountUntilFreeCents,
      addItem,
      setQty,
      removeLine,
      applyPromo,
      clearPromo,
      stockLeft,
      nextSerial,
      placeOrder,
      getOrder,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart doit être utilisé dans CartProvider");
  return context;
}
