import { projects } from "../data/portfolio.js";
import { ExternalIcon } from "./icons.jsx";

export default function Projects() {
  return (
    <section id="projects" className="snap-section" data-section="projects" aria-labelledby="projects-title">
      <div className="section-inner">
        <h2 className="section-label fade-in-section" id="projects-title">Projects &amp; Research</h2>
        <div className="projects-grid">
          {projects.map((project) => (
            <article className="project-card" key={project.title}>
              <div className="project-header">
                <h3 className="project-title">{project.title}</h3>
                <a href={`/projects/${project.slug}`} rel="noopener noreferrer">
                  <ExternalIcon />
                </a>
              </div>
              <p className="project-desc">{project.description}</p>
              <ul className="project-tags" aria-label="Project technologies">
                {project.tags.map((tag) => <li className="project-tag" key={tag}>{tag}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
