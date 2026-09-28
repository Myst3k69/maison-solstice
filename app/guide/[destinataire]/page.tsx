import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { filterProducts, getRecipient, recipients } from "@/lib/products";

type Params = { destinataire: string };

export function generateStaticParams() {
  return recipients.map((recipient) => ({ destinataire: recipient.id }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { destinataire } = await params;
  const recipient = getRecipient(destinataire);
  if (!recipient) return { title: "Guide" };
  return { title: `Guide · ${recipient.label}`, description: recipient.line };
}

export default async function RecipientGuidePage({ params }: { params: Promise<Params> }) {
  const { destinataire } = await params;
  const recipient = getRecipient(destinataire);
  if (!recipient) notFound();
  const list = filterProducts({ destinataire: recipient.id });

  return (
    <main id="contenu" className="shell">
      <header className="page-head">
        <p className="crumbs">
          <Link href="/guide">Guide cadeaux</Link>
        </p>
        <p className="eyebrow" style={{ marginTop: "0.8rem" }}>
          Destinataire
        </p>
        <h1>{recipient.label}</h1>
        <p className="lede">{recipient.line}</p>
        <hr className="filet" />
      </header>
      <div className="prose" style={{ marginBottom: "1.5rem" }}>
        {recipient.essay.split("\n").map((paragraph) => (
          <p key={paragraph.slice(0, 20)}>{paragraph}</p>
        ))}
      </div>
      <div className="catalog">
        {list.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
      <p style={{ marginTop: "1.5rem" }}>
        <Link href={`/boutique?destinataire=${recipient.id}`}>Voir ce filtre dans la boutique</Link>
      </p>
    </main>
  );
}
