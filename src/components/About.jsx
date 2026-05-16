import { about } from "../data/portfolio.js";

export default function About() {
  return (
    <section id="about" className="snap-section fade-in-section" data-section="about" aria-labelledby="about-title">
      <div className="section-inner">
        <h2 className="section-label" id="about-title">About</h2>
        <div className="about-text">
          {about.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
      </div>
    </section>
  );
}
