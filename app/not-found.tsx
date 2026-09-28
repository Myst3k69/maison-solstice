import Link from "next/link";

export default function NotFound() {
  return (
    <main id="contenu" className="shell">
      <div className="empty">
        <p className="eyebrow">404</p>
        <h1>Cette page s’est éteinte.</h1>
        <p className="muted">L’adresse ne correspond à aucun objet, ni à aucune pièce de la maison.</p>
        <div className="btn-row">
          <Link className="btn" href="/">
            Revenir à l’accueil
          </Link>
          <Link className="btn btn-ghost" href="/boutique">
            Voir la boutique
          </Link>
        </div>
      </div>
    </main>
  );
}
