"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { useCart } from "@/lib/cart";

const links = [
  { href: "/boutique", label: "Boutique" },
  { href: "/guide", label: "Guide cadeaux" },
  { href: "/la-maison", label: "La maison" },
];

export function Header() {
  const path = usePathname();
  const { count, openDrawer, ready } = useCart();
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const menuOpen = menuPath === path;
  const panelRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!menuOpen) return;
    const root = panelRef.current;
    const previous = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusables = () =>
      Array.from(
        root?.querySelectorAll<HTMLElement>("a, button, input, select, textarea") ?? [],
      );
    focusables()[0]?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuPath(null);
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
  }, [menuOpen]);

  function current(href: string) {
    if (href === "/boutique") return path.startsWith("/boutique") || path.startsWith("/produit");
    return path.startsWith(href);
  }

  return (
    <header className="site-header">
      <a className="skip" href="#contenu">
        Aller au contenu
      </a>
      <div className="shell header-inner">
        <button
          type="button"
          className="menu-toggle"
          aria-expanded={menuOpen}
          aria-controls={menuId}
          onClick={() => setMenuPath(path)}
        >
          Menu
        </button>
        <Link href="/" className="wordmark">
          <small>Capsule Noël 2026</small>
          <strong>Maison Solstice</strong>
        </Link>
        <nav className="nav-desktop" aria-label="Principale">
          {links.map((link) => (
            <Link key={link.href} href={link.href} aria-current={current(link.href) ? "page" : undefined}>
              {link.label}
            </Link>
          ))}
        </nav>
        <form className="search" action="/recherche" role="search">
          <label className="sr-only" htmlFor="recherche-header">
            Rechercher un objet par son nom
          </label>
          <input id="recherche-header" name="q" type="search" placeholder="Rechercher un nom" />
          <button type="submit">Chercher</button>
        </form>
        <button type="button" className="icon-btn cart-btn" onClick={openDrawer}>
          Panier
          <span className="cart-count" aria-hidden="true">
            {ready ? count : 0}
          </span>
          <span className="sr-only">, {ready ? count : 0} dans le panier</span>
        </button>
      </div>
      {menuOpen ? (
        <div className="menu-panel" id={menuId} role="dialog" aria-modal="true" aria-label="Menu" ref={panelRef}>
          <div className="menu-top">
            <p className="eyebrow">Navigation</p>
            <button type="button" className="icon-btn" onClick={() => setMenuPath(null)}>
              Fermer
            </button>
          </div>
          <nav aria-label="Mobile">
            <Link href="/">Accueil</Link>
            {links.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
