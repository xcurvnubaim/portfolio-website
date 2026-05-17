import { useEffect, useMemo, useState } from "react";
import { projects } from "../data/portfolio.js";
import { markdownToHtml } from "../lib/markdown.js";
import { loadProjectMarkdown } from "../lib/projectMarkdown.js";

export default function ProjectDetailPage({ slug }) {
  const project = projects.find((item) => item.slug === slug);
  const [markdown, setMarkdown] = useState("");
  const [status, setStatus] = useState("idle");
  const html = useMemo(() => markdownToHtml(markdown, project?.markdown), [markdown, project?.markdown]);

  useEffect(() => {
    let isCurrent = true;

    if (!project) {
      setMarkdown("");
      setStatus("idle");
      return () => {
        isCurrent = false;
      };
    }

    setMarkdown("");
    setStatus("loading");

    loadProjectMarkdown(project.markdown)
      .then((content) => {
        if (!isCurrent) return;
        setMarkdown(content);
        setStatus("loaded");
      })
      .catch(() => {
        if (!isCurrent) return;
        setMarkdown("");
        setStatus("error");
      });

    return () => {
      isCurrent = false;
    };
  }, [project]);

  if (!project) {
    return (
      <main className="page-shell detail-shell">
        <section className="project-detail-page">
          <a className="back-link" href="/#projects">Back to projects</a>
          <h1 className="detail-title">Project not found</h1>
          <p className="detail-summary">The project page you opened does not exist.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="page-shell detail-shell">
      <article className="project-detail-page">
        <a className="back-link" href="/#projects">Back to projects</a>
        <header className="detail-header">
          <p className="section-label">Projects &amp; Research</p>
          <h1 className="detail-title">{project.title}</h1>
          <p className="detail-summary">{project.description}</p>
          <ul className="project-tags" aria-label="Project technologies">
            {project.tags.map((tag) => <li className="project-tag" key={tag}>{tag}</li>)}
          </ul>
        </header>
        {status === "loading" && (
          <p className="detail-summary">Loading project details...</p>
        )}
        {status === "error" && (
          <p className="detail-summary">Project details could not be loaded.</p>
        )}
        {status === "loaded" && (
          <div className="project-detail markdown-content" dangerouslySetInnerHTML={{ __html: html }} />
        )}
      </article>
    </main>
  );
}
