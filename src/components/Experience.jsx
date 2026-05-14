import { experience } from "../data/portfolio.js";

export default function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-title">
      <h2 className="section-label fade-in-section" id="experience-title">Experience</h2>
      <div className="experience-list">
        {experience.map((item) => (
          <article className="experience-item" key={`${item.role}-${item.company}`}>
            <div className="experience-header">
              <div>
                <p className="experience-date">{item.date}</p>
                <h3 className="experience-role">{item.role}</h3>
              </div>
              <p className="experience-company">{item.company}</p>
            </div>
            <p className="experience-desc">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
