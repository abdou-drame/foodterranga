import Link from 'next/link';

export default function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <Link href="/" className="header-logo">
          🍛 Terranga<span>Food</span>
        </Link>
        <nav className="header-nav">
          <Link href="/">Restaurants</Link>
          {/* Nouveau lien vers la page de suivi */}
          <Link href="/mes-commandes">
            Mes commandes
          </Link>
        </nav>
      </div>
    </header>
  );
}