import { techStack } from "../data/portfolio.js";

export default function TechStack() {
  return (
    <section aria-labelledby="tech-title">
      <h2 className="section-label fade-in-section" id="tech-title">Tech Stack</h2>
      <ul className="tech-stack fade-in-section" aria-label="Technologies">
        {techStack.map((tech) => <li className="tech-item" key={tech}>{tech}</li>)}
      </ul>
    </section>
  );
}
