import { marked } from "marked";
import { optimizedImages } from "./generated/optimizedImages.js";

const markdownAssets = import.meta.glob("../content/projects/*.{gif,svg}", {
  eager: true,
  query: "?url",
  import: "default"
});

function escapeAttribute(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function isExternalUrl(value) {
  return /^(https?:)?\/\//.test(value) || value.startsWith("data:");
}

function resolveMarkdownAsset(markdownPath, href) {
  const assetKey = getMarkdownAssetKey(markdownPath, href);

  if (!assetKey) {
    return href;
  }

  return markdownAssets[assetKey] || href;
}

function getMarkdownAssetKey(markdownPath, href) {
  if (!href || href.startsWith("/") || isExternalUrl(href)) {
    return "";
  }

  const markdownDirectory = markdownPath.split("/").slice(0, -1).join("/");
  return `${markdownDirectory}/${href}`.replace(/\/\.\//g, "/");
}

function getOptimizedImage(markdownPath, href) {
  const assetKey = getMarkdownAssetKey(markdownPath, href);

  return assetKey ? optimizedImages[assetKey] : null;
}

function renderImageTag({ src, alt = "", title = "", attributes = "" }) {
  const titleAttribute = title ? ` title="${escapeAttribute(title)}"` : "";

  return `<img src="${escapeAttribute(src)}" alt="${escapeAttribute(alt)}"${titleAttribute}${attributes} loading="lazy" decoding="async" />`;
}

function renderOptimizedPicture(image, imgAttributes = "") {
  const sources = image.sources
    .map((source) => `<source type="${escapeAttribute(source.type)}" srcset="${escapeAttribute(source.srcset)}" sizes="${escapeAttribute(image.sizes)}" />`)
    .join("");
  const dimensions = `${image.width ? ` width="${image.width}"` : ""}${image.height ? ` height="${image.height}"` : ""}`;

  return `<picture>${sources}<img${imgAttributes}${dimensions} src="${escapeAttribute(image.src)}" loading="lazy" decoding="async" /></picture>`;
}

function createRenderer(markdownPath) {
  const renderer = new marked.Renderer();

  renderer.image = (tokenOrHref, title, text) => {
    const token = typeof tokenOrHref === "object"
      ? tokenOrHref
      : { href: tokenOrHref, title, text };
    const optimizedImage = getOptimizedImage(markdownPath, token.href);

    if (optimizedImage) {
      const imgAttributes = ` alt="${escapeAttribute(token.text || "")}"${token.title ? ` title="${escapeAttribute(token.title)}"` : ""}`;

      return `<figure>${renderOptimizedPicture(optimizedImage, imgAttributes)}</figure>`;
    }

    const src = resolveMarkdownAsset(markdownPath, token.href);

    return `<figure>${renderImageTag({ src, alt: token.text || "", title: token.title })}</figure>`;
  };

  renderer.link = (tokenOrHref, title, text) => {
    const token = typeof tokenOrHref === "object"
      ? tokenOrHref
      : { href: tokenOrHref, title, text };
    const href = escapeAttribute(token.href || "");
    const titleAttribute = token.title ? ` title="${escapeAttribute(token.title)}"` : "";
    const isExternal = isExternalUrl(token.href || "");
    const targetAttributes = isExternal ? ' target="_blank" rel="noreferrer"' : "";

    return `<a href="${href}"${titleAttribute}${targetAttributes}>${token.text || href}</a>`;
  };

  return renderer;
}

function enhanceInlineHtmlImages(html, markdownPath) {
  if (typeof document === "undefined") {
    return html;
  }

  const template = document.createElement("template");
  template.innerHTML = html;

  template.content.querySelectorAll("img[src]").forEach((img) => {
    const src = img.getAttribute("src");
    const optimizedImage = getOptimizedImage(markdownPath, src);

    if (!optimizedImage) {
      const resolvedSrc = resolveMarkdownAsset(markdownPath, src);
      img.setAttribute("src", resolvedSrc);
      img.setAttribute("loading", img.getAttribute("loading") || "lazy");
      img.setAttribute("decoding", img.getAttribute("decoding") || "async");
      return;
    }

    const picture = document.createElement("picture");

    optimizedImage.sources.forEach((source) => {
      const sourceElement = document.createElement("source");
      sourceElement.setAttribute("type", source.type);
      sourceElement.setAttribute("srcset", source.srcset);
      sourceElement.setAttribute("sizes", optimizedImage.sizes);
      picture.append(sourceElement);
    });

    img.setAttribute("src", optimizedImage.src);
    img.setAttribute("loading", img.getAttribute("loading") || "lazy");
    img.setAttribute("decoding", img.getAttribute("decoding") || "async");

    if (!img.hasAttribute("width") && optimizedImage.width) {
      img.setAttribute("width", optimizedImage.width);
    }

    if (!img.hasAttribute("height") && optimizedImage.height) {
      img.setAttribute("height", optimizedImage.height);
    }

    img.replaceWith(picture);
    picture.append(img);
  });

  return template.innerHTML;
}

export function markdownToHtml(markdown, markdownPath = "") {
  const html = marked.parse(markdown, {
    async: false,
    gfm: true,
    renderer: createRenderer(markdownPath)
  });

  return enhanceInlineHtmlImages(html, markdownPath);
}
