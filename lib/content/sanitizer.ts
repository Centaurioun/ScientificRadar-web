import DOMPurify from "isomorphic-dompurify";

/**
 * Diacritic-tolerant public search for English and Turkish editorial content.
 */
export function normalizeSearchText(input: string): string {
  if (!input) return "";
  return input
    .trim()
    .replace(/İ/g, "i")
    .replace(/I/g, "ı")
    .toLocaleLowerCase("tr-TR")
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

// This boundary protects *published* Studio bodyHtml from HTML/script injection.
// Do not replace it with regex matching or treat content HTML as already trusted.
const ALLOWED_TAGS = [
  "a", "blockquote", "br", "caption", "code", "del", "div", "em",
  "figcaption", "figure", "h1", "h2", "h3", "h4", "hr", "img",
  "li", "ol", "p", "pre", "s", "small", "span", "strong",
  "sub", "sup", "table", "tbody", "td", "tfoot", "th", "thead",
  "tr", "u", "ul",
];

const ALLOWED_ATTR = [
  "alt", "colspan", "height", "href", "id", "rel", "rowspan",
  "scope", "src", "start", "target", "title", "value", "width",
  "data-knowledge-term", "data-text-align", "data-math-tex",
  "data-math-display", "data-citation-source-id", "data-media-id",
  "data-figure-layout", "data-figure-credit", "data-figure-licence",
  "data-figure-source-url",
];

const PER_TAG_ATTRS: Record<string, ReadonlySet<string>> = {
  a: new Set(["href", "rel", "target", "data-knowledge-term"]),
  caption: new Set(["data-text-align"]),
  div: new Set(["data-text-align", "data-math-tex", "data-math-display"]),
  figure: new Set([
    "data-media-id", "data-figure-layout", "data-figure-credit",
    "data-figure-licence", "data-figure-source-url",
  ]),
  h1: new Set(["data-text-align"]),
  h2: new Set(["data-text-align"]),
  h3: new Set(["data-text-align"]),
  h4: new Set(["data-text-align"]),
  img: new Set(["alt", "height", "src", "width"]),
  li: new Set(["value"]),
  ol: new Set(["start"]),
  p: new Set(["data-text-align"]),
  span: new Set(["data-math-tex", "data-math-display"]),
  sup: new Set(["data-citation-source-id"]),
  td: new Set(["colspan", "rowspan", "data-text-align"]),
  th: new Set(["colspan", "rowspan", "scope", "data-text-align"]),
};

const ENTITY_ID = /^[A-Za-z0-9_.:-]{1,128}$/;
const HTML_ID = /^[A-Za-z][A-Za-z0-9_:.-]{0,127}$/;
const REL_TOKENS = new Set([
  "author", "bookmark", "external", "help", "license", "next",
  "nofollow", "noopener", "noreferrer", "prev", "search", "sponsored",
  "tag", "ugc",
]);

function safeHref(value: string): boolean {
  const href = value.trim();
  if (!href || href.startsWith("//") || href.startsWith("/\\")) return false;
  if (href.startsWith("#") || href.startsWith("/") || href.startsWith("./")) return true;
  try {
    const url = new URL(href);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function safeSrc(value: string, trustedSources: ReadonlySet<string>): boolean {
  const src = value.trim();
  if (src.startsWith("/") && !src.startsWith("//") && !src.startsWith("/\\")) {
    return true;
  }
  return trustedSources.has(src);
}

/**
 * Parser-based sanitizer for article bodyHtml.
 *
 * All attributes are filtered on their specific tag, even after DOMPurify.
 * An image is limited to same-origin local paths unless it appears in an
 * explicit, separately verified list of published media asset URLs.
 * React must receive only this sanitized output, not raw draft HTML.
 */
export function sanitizeCanonicalBodyHtml(
  rawHtml: string,
  trustedImageSources: ReadonlySet<string> = new Set<string>()
): string {
  if (!rawHtml) return "";

  const fragment = DOMPurify.sanitize(rawHtml, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
    ALLOW_ARIA_ATTR: false,
    ALLOW_UNKNOWN_PROTOCOLS: false,
    RETURN_DOM_FRAGMENT: true,
  }) as DocumentFragment;

  for (const element of Array.from(fragment.querySelectorAll("*"))) {
    const tag = element.localName.toLowerCase();
    for (const attr of Array.from(element.attributes)) {
      const name = attr.name.toLowerCase();
      const value = attr.value;
      const permitted = name === "id" || name === "title" || Boolean(PER_TAG_ATTRS[tag]?.has(name));
      const valid =
        permitted &&
        (name !== "href" || safeHref(value)) &&
        (name !== "src" || safeSrc(value, trustedImageSources)) &&
        (name !== "id" || HTML_ID.test(value)) &&
        (name !== "target" || value === "_blank" || value === "_self") &&
        (name !== "data-text-align" || ["left", "center", "right", "justify"].includes(value)) &&
        (name !== "data-math-display" || ["inline", "block"].includes(value)) &&
        (name !== "data-math-tex" || (value.trim().length > 0 && value.length <= 2000)) &&
        (name !== "data-citation-source-id" || ENTITY_ID.test(value)) &&
        (name !== "data-media-id" || ENTITY_ID.test(value)) &&
        (name !== "data-knowledge-term" || (value.trim().length > 0 && value.length <= 200)) &&
        (name !== "data-figure-layout" || ["locked", "auto", "manual", "wide", "column"].includes(value)) &&
        (name !== "data-figure-credit" || value.length <= 500) &&
        (name !== "data-figure-licence" || value.length <= 500) &&
        (name !== "data-figure-source-url" || (!value.trim() || safeHref(value)));
      if (!valid) element.removeAttribute(attr.name);
    }

    if (tag === "a") {
      const rel = (element.getAttribute("rel") || "")
        .toLowerCase()
        .split(/\s+/)
        .filter((token) => REL_TOKENS.has(token));
      if (element.getAttribute("target") === "_blank") {
        rel.push("noopener", "noreferrer");
      }
      const unique = [...new Set(rel)];
      if (unique.length) element.setAttribute("rel", unique.join(" "));
      else element.removeAttribute("rel");
    }

    // A genuine article H1 is always the page title, not inner user HTML.
    if (tag === "h1") {
      const replacement = element.ownerDocument.createElement("h2");
      for (const attr of Array.from(element.attributes)) {
        replacement.setAttribute(attr.name, attr.value);
      }
      while (element.firstChild) replacement.appendChild(element.firstChild);
      element.replaceWith(replacement);
    }
  }

  const root = fragment.ownerDocument.createElement("div");
  root.appendChild(fragment);
  return root.innerHTML;
}
