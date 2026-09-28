"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useCart } from "@/lib/cart";
import { CartLines, CartSummary } from "@/components/cart-lines";
import { PromoField } from "@/components/promo-field";

export function CartDrawer() {
  const { drawerOpen, closeDrawer, lines } = useCart();
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!drawerOpen) return;
    const root = panelRef.current;
    const previous = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusables = () =>
      Array.from(root?.querySelectorAll<HTMLElement>("a, button, input, select, textarea") ?? []);
    window.setTimeout(() => focusables()[0]?.focus(), 0);
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeDrawer();
        return;
      }
      if (event.key !== "Tab" || !root) return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
      previous?.focus();
    };
  }, [drawerOpen, closeDrawer]);

  if (!drawerOpen) return null;

  return (
    <div className="drawer-root">
      <button type="button" className="drawer-backdrop" aria-label="Fermer le panier" onClick={closeDrawer} />
      <aside className="drawer" role="dialog" aria-modal="true" aria-labelledby="panier-titre" ref={panelRef}>
        <header>
          <h2 id="panier-titre">Panier</h2>
          <button type="button" className="icon-btn" onClick={closeDrawer}>
            Fermer
          </button>
        </header>
        <div className="drawer-body">
          <CartLines />
        </div>
        {lines.length > 0 ? (
          <div>
            <PromoField />
            <CartSummary />
            <div className="btn-row">
              <Link className="btn btn-ghost" href="/panier" onClick={closeDrawer}>
                Voir le panier
              </Link>
              <Link className="btn" href="/checkout" onClick={closeDrawer}>
                Commander
              </Link>
            </div>
          </div>
        ) : null}
      </aside>
    </div>
  );
}
