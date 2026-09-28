import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "La maison",
  description: "Le manifeste de Maison Solstice, capsule de Noël 2026.",
};

export default function HousePage() {
  return (
    <main id="contenu">
      <header className="shell page-head">
        <p className="eyebrow">La maison</p>
        <h1>Utile, et beau quand même.</h1>
        <hr className="filet" />
      </header>
      <div className="shell house">
        <div className="edition-media" style={{ maxWidth: "920px" }}>
          <Image
            src="/images/bougie-3.png"
            alt="Bougie allumée dans un verre fumé, seule devant une fenêtre de nuit."
            fill
            sizes="(min-width: 900px) 70vw, 100vw"
          />
        </div>
        <div className="prose" style={{ maxWidth: "40rem", paddingBottom: "2rem" }}>
          <p>
            Maison Solstice tient une capsule, pas une boutique permanente. Elle s’ouvre pour la nuit la plus longue
            de 2026 — le solstice, puis les soirs qui le suivent — et elle parle à des urbains qui ont entre vingt-huit
            et quarante-cinq ans, qui offrent entre trente et cent quatre-vingts euros, et qui n’ont plus envie d’un
            objet qui ne sert qu’à être déballé.
          </p>
          <p>
            Le critère est simple. Est-ce que cela sert pendant que l’on reçoit, que l’on écrit les vœux, que l’on
            dort mal, que l’on prend le train du 24, que l’on tient un appartement sans sapin ? Si la réponse est un
            discours, l’objet n’entre pas. Si la réponse est un geste, il reste.
          </p>
          <p>
            Les matières sont celles que l’on reconnaît les yeux fermés : cire, verre fumé, vergé, soie marine,
            cachemire, laiton, céramique mate. Les couleurs de la maison sont le brun-noir, la crème, l’or brûlé, la
            braise, le bordeaux. Pas de rouge de vitrine, pas de vert sapin en aplat.
          </p>
          <p>
            L’édition « La nuit la plus longue » est numérotée de 1 à 24. Le reste du catalogue a un stock réel,
            affiché, qui diminue quand une commande est passée sur cet appareil. Tout part sous 48 h si vous commandez
            avant le 20 décembre. La livraison standard est offerte dès 120 € d’articles, avant remise. L’express,
            à 14 €, reste un choix.
          </p>
          <p>
            Cette maison est une démonstration : le paiement est simulé, les champs sont vérifiés, aucun débit n’a
            lieu. Le code SOLSTICE10 retire dix pour cent sur les articles, pas sur le transport.
          </p>
          <p>
            12, cour du Solstice, 75003 Paris. Écrire n’est pas nécessaire. Choisir un destinataire l’est peut-être.
          </p>
          <div className="btn-row">
            <Link className="btn" href="/guide">
              Ouvrir le guide
            </Link>
            <Link className="btn btn-ghost" href="/boutique">
              Voir les objets
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
