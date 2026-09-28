import Link from "next/link";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <strong>Maison Solstice</strong>
          <p className="muted" style={{ marginTop: "0.6rem" }}>
            12, cour du Solstice
            <br />
            75003 Paris
          </p>
        </div>
        <div className="footer-links">
          <Link href="/boutique">Boutique</Link>
          <Link href="/guide">Guide cadeaux</Link>
          <Link href="/la-maison">La maison</Link>
          <Link href="/panier">Panier</Link>
        </div>
        <p className="muted">
          Expédition sous 48 h avant le 20 décembre. Livraison standard offerte dès 120 € d’articles,
          avant remise. Le paiement de cette maison est simulé : aucun débit n’est effectué.
        </p>
      </div>
    </footer>
  );
}
