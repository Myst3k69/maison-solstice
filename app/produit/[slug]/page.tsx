import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCart } from "@/components/add-to-cart";
import { Gallery } from "@/components/gallery";
import { ProductCard } from "@/components/product-card";
import { formatPrice } from "@/lib/money";
import { getProduct, getRecipient, products, relatedProducts } from "@/lib/products";

type Params = { slug: string };

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Objet introuvable" };
  return { title: product.name, description: product.pitch };
}

export default async function ProductPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  const related = relatedProducts(product.slug);

  return (
    <main id="contenu" className="shell">
      <article className="product">
        <Gallery images={product.images} />
        <div className="buy">
          <p className="crumbs">
            <Link href="/">Accueil</Link>
            <span aria-hidden="true">/</span>
            <Link href="/boutique">Boutique</Link>
            <span aria-hidden="true">/</span>
            <span>{product.name}</span>
          </p>
          <p className="eyebrow" style={{ marginTop: "0.8rem" }}>
            {product.eyebrow}
          </p>
          <h1>{product.name}</h1>
          <p className="price-lg">{formatPrice(product.price)}</p>
          <p style={{ margin: "0.7rem 0 1rem" }}>{product.pitch}</p>
          <p className="muted">
            Pour{" "}
            {product.recipients
              .map((id) => getRecipient(id)?.label)
              .filter(Boolean)
              .join(", ")}
            .
          </p>
          <AddToCart product={product} />
          <div className="prose">
            {product.description.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>
          <dl className="specs">
            {product.details.map((detail) => (
              <div key={detail.label}>
                <dt>{detail.label}</dt>
                <dd>{detail.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </article>

      {related.length > 0 ? (
        <section className="section">
          <h2>Dans la même nuit</h2>
          <div className="catalog" style={{ marginTop: "1rem" }}>
            {related.map((item) => (
              <ProductCard key={item.slug} product={item} level="h3" />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
