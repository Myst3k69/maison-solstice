import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import {
  filterProducts,
  priceBands,
  recipients,
  shopHref,
  sorts,
  types,
  type ShopQuery,
} from "@/lib/products";

export const metadata: Metadata = {
  title: "Boutique",
  description: "Les dix objets de la capsule Noël 2026, filtrés par type, destinataire et prix.",
};

type Search = Record<string, string | string[] | undefined>;

function one(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function BoutiquePage({ searchParams }: { searchParams: Promise<Search> }) {
  const raw = await searchParams;
  const query: ShopQuery = {
    type: one(raw.type),
    destinataire: one(raw.destinataire),
    prix: one(raw.prix),
    tri: one(raw.tri),
  };
  const list = filterProducts(query);

  return (
    <main id="contenu" className="shell">
      <header className="page-head">
        <p className="eyebrow">Boutique</p>
        <h1>Dix objets, pas un de plus.</h1>
        <p className="lede">
          Les bougies et le parfum de pièce sont rangés ensemble : ce qui change l’air. La soie et le cachemire
          aussi : ce que l’on porte le 25 au matin.
        </p>
      </header>

      <div className="filters">
        <div className="filter-row">
          <p>Type</p>
          {types.map((type) => {
            const active = query.type === type.id;
            return (
              <Link
                key={type.id}
                className="chip"
                aria-current={active ? "true" : undefined}
                href={shopHref(query, { type: active ? null : type.id })}
              >
                {type.label}
              </Link>
            );
          })}
        </div>
        <div className="filter-row">
          <p>Destinataire</p>
          {recipients.map((recipient) => {
            const active = query.destinataire === recipient.id;
            return (
              <Link
                key={recipient.id}
                className="chip"
                aria-current={active ? "true" : undefined}
                href={shopHref(query, { destinataire: active ? null : recipient.id })}
              >
                {recipient.label}
              </Link>
            );
          })}
        </div>
        <div className="filter-row">
          <p>Prix</p>
          {priceBands.map((band) => {
            const active = query.prix === band.id;
            return (
              <Link
                key={band.id}
                className="chip"
                aria-current={active ? "true" : undefined}
                href={shopHref(query, { prix: active ? null : band.id })}
              >
                {band.label}
              </Link>
            );
          })}
        </div>
        <div className="filter-row">
          <p>Tri</p>
          {sorts.map((sort) => {
            const active = (query.tri ?? "maison") === sort.id;
            return (
              <Link
                key={sort.id}
                className="chip"
                aria-current={active ? "true" : undefined}
                href={shopHref(query, { tri: sort.id === "maison" ? null : sort.id })}
              >
                {sort.label}
              </Link>
            );
          })}
        </div>
      </div>

      <p className="note" style={{ marginBottom: "1rem" }}>
        {list.length} objet{list.length > 1 ? "s" : ""}
        {query.type || query.destinataire || query.prix ? (
          <>
            {" "}
            · <Link href="/boutique">Tout effacer</Link>
          </>
        ) : null}
      </p>

      {list.length === 0 ? (
        <div className="empty">
          <h2>Aucun objet ne répond à ces filtres.</h2>
          <p className="muted">Élargissez le prix, ou changez de destinataire.</p>
          <div className="btn-row">
            <Link className="btn" href="/boutique">
              Voir les dix
            </Link>
          </div>
        </div>
      ) : (
        <div className="catalog">
          {list.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}
