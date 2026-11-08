import { DEMO_CATEGORIES } from "./fixtures";
import { filterArticles } from "./repository";
import {
  EditorialType,
  PublicArticle,
  PublicAuthor,
  PublicCategory,
  PublishedContentRepository,
  PublishedSnapshotRecordV1,
  SupportedLocale,
} from "./types";
import {
  adaptSnapshotV1ToPublicArticle,
  validatePublicationSnapshotV1,
} from "./contract-v1";

type FetchLike = typeof fetch;

/**
 * Reads only active, server-authorized snapshots from the Studio's public API.
 * Every request is uncached so withdrawals and revision changes are reflected
 * by articles, search results, related links, and the sitemap on the next read.
 */
export class PublishedSnapshotContentRepository implements PublishedContentRepository {
  private readonly baseUrl: URL | null;
  private readonly fetcher: FetchLike;
  private readonly trustedMediaOrigins: string[];

  constructor(baseUrl: string | null | undefined, fetcher: FetchLike = fetch) {
    this.fetcher = fetcher;
    try {
      const candidate = new URL(baseUrl ?? "");
      if (candidate.protocol === "https:" || candidate.hostname === "localhost" || candidate.hostname === "127.0.0.1" || candidate.hostname === "::1") {
        this.baseUrl = candidate;
        this.trustedMediaOrigins = [candidate.origin];
      } else {
        this.baseUrl = null;
        this.trustedMediaOrigins = [];
      }
    } catch {
      this.baseUrl = null;
      this.trustedMediaOrigins = [];
    }
  }

  private async requestJson(path: string): Promise<unknown | null> {
    if (!this.baseUrl) return null;
    try {
      const url = new URL(path, this.baseUrl);
      const response = await this.fetcher(url, {
        method: "GET",
        headers: { accept: "application/json" },
        cache: "no-store",
      });
      if (!response.ok) return null;
      return await response.json();
    } catch {
      // No fallback to fixture content: upstream failures yield no public data.
      return null;
    }
  }

  private async loadPublicSnapshots(): Promise<PublishedSnapshotRecordV1[]> {
    const payload = await this.requestJson("/api/publications");
    if (!Array.isArray(payload)) return [];

    const snapshots: PublishedSnapshotRecordV1[] = [];
    const seenIds = new Set<string>();
    const seenSlugs = new Set<string>();
    const seenRevisions = new Set<string>();
    for (const candidate of payload) {
      const validation = validatePublicationSnapshotV1(candidate, {
        trustedMediaOrigins: this.trustedMediaOrigins,
      });
      if (!validation.isPubliclyRenderable) continue;
      const snapshot = candidate as PublishedSnapshotRecordV1;
      if (
        snapshot.status !== "published" ||
        seenIds.has(snapshot.articleId) ||
        seenSlugs.has(snapshot.slug) ||
        seenRevisions.has(snapshot.revisionId)
      ) continue;
      seenIds.add(snapshot.articleId);
      seenSlugs.add(snapshot.slug);
      seenRevisions.add(snapshot.revisionId);
      snapshots.push(snapshot);
    }
    const publicArticlesById = new Map(snapshots.map((snapshot) => [snapshot.articleId, snapshot]));
    return snapshots.map((snapshot) => ({
      ...snapshot,
      knowledgeLinks: (snapshot.knowledgeLinks ?? []).filter((link) => {
        if (link.targetType !== "internal") return true;
        if (!link.targetArticleId) return false;
        const target = publicArticlesById.get(link.targetArticleId);
        return Boolean(target && link.targetUrl === `/article/${target.slug}`);
      }),
    }));
  }

  private async loadPublicArticles(): Promise<PublicArticle[]> {
    return (await this.loadPublicSnapshots()).map(adaptSnapshotV1ToPublicArticle);
  }

  async listPublicArticles(options?: {
    categorySlug?: string;
    subcategorySlug?: string;
    tagSlug?: string;
    query?: string;
    editorialType?: EditorialType;
    locale?: SupportedLocale;
    limit?: number;
  }): Promise<PublicArticle[]> {
    const snapshots = await this.loadPublicSnapshots();
    const authors = new Map<string, PublicAuthor>();
    for (const snapshot of snapshots) for (const author of snapshot.authors ?? []) authors.set(author.id, author);
    return filterArticles(snapshots.map(adaptSnapshotV1ToPublicArticle), options, {
      categories: DEMO_CATEGORIES,
      authors: [...authors.values()],
      allowDemoStatus: false,
    });
  }

  async getPublicArticle(slug: string): Promise<PublicArticle | null> {
    const payload = await this.requestJson(`/api/publications/${encodeURIComponent(slug)}`);
    const validation = validatePublicationSnapshotV1(payload, {
      trustedMediaOrigins: this.trustedMediaOrigins,
    });
    if (!validation.isPubliclyRenderable) return null;
    const snapshot = payload as PublishedSnapshotRecordV1;
    if (snapshot.status !== "published" || snapshot.slug !== slug) return null;
    const activeSnapshots = await this.loadPublicSnapshots();
    const active = activeSnapshots.find((item) => item.articleId === snapshot.articleId);
    if (!active || active.revisionId !== snapshot.revisionId || active.slug !== snapshot.slug) return null;
    return adaptSnapshotV1ToPublicArticle(active);
  }

  async getCategories(): Promise<PublicCategory[]> {
    const articles = await this.loadPublicArticles();
    const visibleSlugs = new Set(articles.map((article) => article.categorySlug));
    return DEMO_CATEGORIES.filter((category) => visibleSlugs.has(category.slug));
  }

  async getCategoryBySlug(slug: string): Promise<PublicCategory | null> {
    return (await this.getCategories()).find((category) => category.slug === slug) ?? null;
  }

  private async loadAuthors(): Promise<PublicAuthor[]> {
    const authors = new Map<string, PublicAuthor>();
    for (const snapshot of await this.loadPublicSnapshots()) for (const author of snapshot.authors ?? []) authors.set(author.id, author);
    return [...authors.values()];
  }

  async getAuthorsByIds(ids: string[]): Promise<PublicAuthor[]> {
    const authors = await this.loadAuthors();
    return ids.map((id) => authors.find((author) => author.id === id)).filter((author): author is PublicAuthor => Boolean(author));
  }

  async getRelatedArticles(article: PublicArticle, limit = 3): Promise<PublicArticle[]> {
    const visible = (await this.loadPublicArticles()).filter((candidate) => candidate.id !== article.id);
    const explicit = article.relatedIds
      .map((id) => visible.find((candidate) => candidate.id === id))
      .filter((candidate): candidate is PublicArticle => Boolean(candidate));
    const selected = new Set(explicit.map((candidate) => candidate.id));
    const sameSeries = article.seriesId
      ? visible.filter((candidate) => candidate.seriesId === article.seriesId && !selected.has(candidate.id))
      : [];
    for (const candidate of sameSeries) selected.add(candidate.id);
    const sameCategory = visible.filter((candidate) => candidate.categorySlug === article.categorySlug && !selected.has(candidate.id));
    for (const candidate of sameCategory) selected.add(candidate.id);
    return [...explicit, ...sameSeries, ...sameCategory, ...visible.filter((candidate) => !selected.has(candidate.id))].slice(0, limit);
  }
}

/** Empty fail-closed repository used when adapter configuration is invalid. */
export class UnavailablePublishedContentRepository implements PublishedContentRepository {
  async listPublicArticles(): Promise<PublicArticle[]> { return []; }
  async getPublicArticle(): Promise<PublicArticle | null> { return null; }
  async getCategories(): Promise<PublicCategory[]> { return []; }
  async getCategoryBySlug(): Promise<PublicCategory | null> { return null; }
  async getAuthorsByIds(): Promise<PublicAuthor[]> { return []; }
  async getRelatedArticles(): Promise<PublicArticle[]> { return []; }
}
