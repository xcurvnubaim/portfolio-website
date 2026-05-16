import { navItems, profile } from "../data/portfolio.js";

export default function Header() {
  return (
    <header className="site-header">
      <nav className="site-nav" aria-label="Primary navigation">
        <a className="nav-logo" href="/" aria-label="Go to home">{profile.logo}</a>
        <div className="nav-links">
          {navItems.map((item) => (
            <a key={item.href} href={item.href}>{item.label}</a>
          ))}
        </div>
      </nav>
    </header>
  );
}
