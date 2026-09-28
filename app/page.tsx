import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { formatPrice } from "@/lib/money";
import { getProduct, products, recipients } from "@/lib/products";

export default function HomePage() {
  const featured = products.filter((product) => product.featured);
  const edition = getProduct("la-nuit-la-plus-longue");
  if (!edition) return null;

  return (
    <main id="contenu">
      <section className="shell hero">
        <div className="hero-copy">
          <p className="eyebrow">Paris · nuit du 21 décembre 2026</p>
          <h1>
            Le cadeau <em>utile</em> de la nuit la plus longue.
          </h1>
          <hr className="filet" />
          <p className="lede" style={{ marginTop: "1rem" }}>
            Ce qui sert vraiment entre le 24 et le matin du 25 : recevoir, écrire, dormir, prendre le train,
            tenir un appartement sans sapin.
          </p>
          <div className="btn-row">
            <Link className="btn" href="/boutique">
              Entrer dans la boutique
            </Link>
            <Link className="btn btn-ghost" href="/la-maison">
              Lire le manifeste
            </Link>
          </div>
        </div>
        <figure className="hero-figure">
          <Image
            src="/images/hero-nuit.png"
            alt="Table après le dîner : bougie dans un verre fumé, coupe-papier de laiton, masque de soie marine et coffret de bois, devant une fenêtre de nuit."
            fill
            priority
            sizes="(min-width: 980px) 48vw, 100vw"
          />
          <figcaption className="hero-caption">Capsule Noël 2026 · dix objets</figcaption>
        </figure>
      </section>

      <section className="shell section">
        <p className="eyebrow">Manifeste, en bref</p>
        <div className="manifest" style={{ marginTop: "1rem" }}>
          <article>
            <strong>Pas la féerie.</strong>
            <p>
              Nous ne vendons pas le ruban, ni le rouge, ni le vert. La nuit la plus longue a déjà assez de bruit.
              Ce qui reste utile tient dans une main.
            </p>
          </article>
          <article>
            <strong>Recevoir.</strong>
            <p>Une bougie pour le silence d’après, un carnet pour les allergies, des allumettes qui arrivent jusqu’à la mèche.</p>
          </article>
          <article>
            <strong>Entre 32 et 180 €.</strong>
            <p>Assez beau pour être offert, assez précis pour servir encore en janvier. Vingt-quatre éditions, pas une de plus.</p>
          </article>
        </div>
      </section>

      <section className="shell section" style={{ paddingTop: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "end" }}>
          <h2>Pièces phares</h2>
          <Link href="/boutique">Toute la boutique</Link>
        </div>
        <div className="feature-grid">
          {featured.map((product, index) => (
            <ProductCard key={product.slug} product={product} level={index === 0 ? "h3" : "h3"} />
          ))}
        </div>
      </section>

      <section className="band-cream">
        <div className="shell section">
          <p className="eyebrow">Pour qui</p>
          <h2 style={{ marginTop: "0.4rem" }}>Six façons d’offrir juste.</h2>
          <div className="recipient-list">
            {recipients.map((recipient, index) => (
              <Link key={recipient.id} href={`/guide/${recipient.id}`}>
                <em className="eyebrow" style={{ fontStyle: "normal" }}>
                  0{index + 1}
                </em>
                <span>{recipient.label}</span>
                <small>{recipient.line}</small>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="shell section edition">
        <div>
          <p className="edition-num">24</p>
          <p className="eyebrow">Exemplaires</p>
        </div>
        <div className="edition-media">
          <Image
            src={edition.images[0].src}
            alt={edition.images[0].alt}
            fill
            sizes="(min-width: 900px) 40vw, 100vw"
          />
        </div>
        <div>
          <p className="eyebrow">Édition limitée</p>
          <h2 style={{ margin: "0.4rem 0 0.7rem" }}>{edition.name}</h2>
          <p className="lede">{edition.pitch} {formatPrice(edition.price)}.</p>
          <div className="btn-row">
            <Link className="btn" href={`/produit/${edition.slug}`}>
              Voir l’édition
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
