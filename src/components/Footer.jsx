import { profile } from "../data/portfolio.js";

export default function Footer() {
  return (
    <footer className="site-footer">
      <p>&copy; 2026 {profile.name}. All rights reserved.</p>
    </footer>
  );
}
