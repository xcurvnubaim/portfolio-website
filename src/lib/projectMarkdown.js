const projectMarkdownLoaders = import.meta.glob("../content/projects/*.md", {
  query: "?raw",
  import: "default"
});

export function loadProjectMarkdown(markdownPath) {
  const loadMarkdown = projectMarkdownLoaders[markdownPath];

  if (!loadMarkdown) {
    return Promise.resolve("");
  }

  return loadMarkdown();
}
