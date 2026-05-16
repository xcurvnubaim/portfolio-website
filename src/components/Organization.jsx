import { organizations } from "../data/portfolio.js";

export default function Organization() {
  return (
    <section id="organization" className="snap-section" data-section="organization" aria-labelledby="organization-title">
      <div className="section-inner">
        <h2 className="section-label fade-in-section" id="organization-title">Organization</h2>
        <div className="organization-grid">
          {organizations.map((organization) => (
            <article className="organization-card" key={`${organization.role}-${organization.name}`}>
              <p className="organization-date">{organization.date}</p>
              <div className="organization-header">
                <h3 className="organization-role">{organization.role}</h3>
                <p className="organization-name">{organization.name}</p>
              </div>
              <p className="organization-desc">{organization.description}</p>
              <ul className="project-tags" aria-label="Organization focus areas">
                {organization.tags.map((tag) => <li className="project-tag" key={tag}>{tag}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
