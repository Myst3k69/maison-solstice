import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/money";
import type { Product } from "@/lib/products";

export function ProductCard({
  product,
  level = "h2",
}: {
  product: Product;
  level?: "h2" | "h3";
}) {
  const Title = level;
  return (
    <article className="card">
      <Link href={`/produit/${product.slug}`} className="card-link">
        <div className="card-media">
          <Image
            src={product.images[0].src}
            alt={product.images[0].alt}
            fill
            sizes="(min-width: 1020px) 30vw, (min-width: 680px) 45vw, 100vw"
          />
        </div>
        <p className="eyebrow">{product.eyebrow}</p>
        <Title>{product.name}</Title>
        <p className="muted">{product.pitch}</p>
        <p className="card-price">{formatPrice(product.price)}</p>
      </Link>
    </article>
  );
}
