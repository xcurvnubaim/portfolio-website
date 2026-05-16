export const projectMarkdown = import.meta.glob("../content/projects/*.md", {
  eager: true,
  query: "?raw",
  import: "default"
});
