import { about } from "../data/portfolio.js";

export default function About() {
  return (
    <section id="about" className="fade-in-section" aria-labelledby="about-title">
      <h2 className="section-label" id="about-title">About</h2>
      <div className="about-text">
        {about.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </div>
    </section>
  );
}
