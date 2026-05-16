import { techStack } from "../data/portfolio.js";

export default function TechStack() {
  return (
    <section className="snap-section" data-section="tech" aria-labelledby="tech-title">
      <div className="section-inner">
        <h2 className="section-label fade-in-section" id="tech-title">Tech Stack</h2>
        <ul className="tech-stack fade-in-section" aria-label="Technologies">
          {techStack.map((tech) => <li className="tech-item" key={tech}>{tech}</li>)}
        </ul>
      </div>
    </section>
  );
}
