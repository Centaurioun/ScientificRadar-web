/**
 * ScientificRadar Web — Text Normalization & Canonical HTML Sanitizer Contract
 * Preserves scientific markup semantics (sub, sup, math/data-tex, data-citation-source-id,
 * tables with thead/tbody/th/td/caption) while stripping any unsafe script/event attributes.
 */

/**
 * Normalizes strings for case-insensitive and diacritic-tolerant search while
 * properly handling Turkish characters (ı, İ, ğ, Ğ, ş, Ş, ö, Ö, ü, Ü, ç, Ç).
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

const DISALLOWED_TAGS_REGEX =
  /<\/?(?:script|iframe|object|embed|form|input|button|style|link|meta|base|svg|math)[^>]*>/gi;

const EVENT_HANDLER_ATTR_REGEX = /\s+on[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi;
const JAVASCRIPT_PROTOCOL_REGEX =
  /(href|src)\s*=\s*(?:"\s*javascript:[^"]*"|'\s*javascript:[^']*')/gi;

/**
 * Sanitizes canonical bodyHtml from future Studio published snapshots.
 * Also enforces single-H1 page discipline by demoting any accidental <h1> inside
 * bodyHtml to <h2>.
 */
export function sanitizeCanonicalBodyHtml(rawHtml: string): string {
  if (!rawHtml) return "";

  return rawHtml
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(DISALLOWED_TAGS_REGEX, "")
    .replace(EVENT_HANDLER_ATTR_REGEX, "")
    .replace(JAVASCRIPT_PROTOCOL_REGEX, '$1="#"')
    .replace(/<h1(\b[^>]*)>/gi, "<h2$1>")
    .replace(/<\/h1>/gi, "</h2>");
}
