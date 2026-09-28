import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { filterProducts, products } from "@/lib/products";

export const metadata: Metadata = { title: "Recherche" };

type Search = Record<string, string | string[] | undefined>;

function one(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<Search> }) {
  const raw = await searchParams;
  const q = one(raw.q)?.trim() ?? "";
  const list = q ? filterProducts({ q }) : [];

  return (
    <main id="contenu" className="shell">
      <header className="page-head">
        <p className="eyebrow">Recherche</p>
        <h1>Par le nom.</h1>
        <form className="search" action="/recherche" role="search" style={{ marginTop: "1rem", maxWidth: "28rem" }}>
          <label className="sr-only" htmlFor="recherche-page">
            Nom de l’objet
          </label>
          <input id="recherche-page" name="q" type="search" defaultValue={q} placeholder="Bougie, masque, train…" />
          <button type="submit">Chercher</button>
        </form>
      </header>
      {!q ? (
        <p className="note">Saisissez le nom, ou une partie. « Cachemire », « vœux », « duo ».</p>
      ) : (
        <p className="note" style={{ marginBottom: "1rem" }}>
          {list.length} résultat{list.length > 1 ? "s" : ""} pour « {q} ».
        </p>
      )}
      {q && list.length === 0 ? (
        <div className="empty">
          <h2>Rien sous ce nom.</h2>
          <p className="muted">La maison n’a que dix objets. Essayez l’un de ceux-ci.</p>
          <ul style={{ paddingLeft: "1.1rem", marginTop: "0.8rem" }}>
            {products.slice(0, 3).map((product) => (
              <li key={product.slug}>
                <Link href={`/produit/${product.slug}`}>{product.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {list.length > 0 ? (
        <div className="catalog">
          {list.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      ) : null}
    </main>
  );
}
