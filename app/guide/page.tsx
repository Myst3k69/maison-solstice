import type { Metadata } from "next";
import Link from "next/link";
import { recipients } from "@/lib/products";

export const metadata: Metadata = {
  title: "Guide cadeaux",
  description: "Choisir selon la personne : l’hôte, l’invité, le duo, l’appartement, le voyageur, le difficile à contenter.",
};

export default function GuidePage() {
  return (
    <main id="contenu">
      <header className="shell page-head">
        <p className="eyebrow">Guide cadeaux</p>
        <h1>À qui va la nuit.</h1>
        <p className="lede">
          Six destinataires, pas de « pour elle / pour lui ». On offre un usage : recevoir, dormir, partir, rester.
        </p>
      </header>
      <section className="band-cream">
        <div className="shell section">
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
    </main>
  );
}
