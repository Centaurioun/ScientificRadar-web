/**
 * ScientificRadar Web — Public Content Model & Future Studio Adapter Contract
 * Matches Blueprint v2.1 §5, §12.5, and §12.6.
 */

export type EditorialType =
  | "news"
  | "feature"
  | "explainer"
  | "research-digest";

export type PublicationStatus = "demo" | "draft" | "published";

export type SupportedLocale = "en" | "tr";

export interface PublicSource {
  id: string;
  label: string;
  title: string;
  authors?: string;
  publication?: string;
  year?: string;
  href?: string;
  /**
   * Authentic DOI only when referencing a real foundational concept or explicitly null
   * for illustrative demonstration records. Never fabricate synthetic DOIs as real.
   */
  doi?: string;
  isIllustrativeDemo: boolean;
  note?: string;
}

export interface PublicMedia {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  caption: string;
  credit: string;
  rightsVerified: boolean;
  license: string;
}

export interface PublicAuthor {
  id: string;
  name: string;
  role: string;
  credentialsNote: string;
  bio: string;
  isDemoPersona: boolean;
}

export interface PublicSubcategory {
  id: string;
  slug: string;
  name: string;
  description: string;
}

export interface PublicCategory {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  subcategories: PublicSubcategory[];
}

export interface ScientificTableData {
  id: string;
  caption: string;
  headers: string[];
  rows: string[][];
  footnote?: string;
}

export type ArticleBlock =
  | {
      type: "paragraph";
      id: string;
      text: string;
      dropCap?: boolean;
      citations?: string[]; // References PublicSource.id
    }
  | {
      type: "heading";
      id: string;
      level: 2 | 3;
      text: string;
    }
  | {
      type: "figure";
      id: string;
      media: PublicMedia;
      layout: "column" | "wide";
      figureNumber: string;
    }
  | {
      type: "quote";
      id: string;
      quote: string;
      attribution?: string;
    }
  | {
      type: "math";
      id: string;
      tex: string;
      label: string;
      explanation: string;
      variables?: { symbol: string; meaning: string }[];
    }
  | {
      type: "table";
      id: string;
      table: ScientificTableData;
    }
  | {
      type: "key-takeaways";
      id: string;
      title: string;
      items: string[];
    };

export interface PublicArticle {
  id: string;
  slug: string;
  locale: SupportedLocale;
  editorialType: EditorialType;
  status: PublicationStatus;
  title: string;
  dek: string;
  summary: string;
  categorySlug: string;
  subcategorySlugs: string[];
  tagSlugs: string[];
  authorIds: string[];
  publishedAt: string;
  updatedAt?: string;
  readingTimeMinutes: number;
  featuredRank?: number;
  mostReadDemoRank?: number;
  hero?: PublicMedia;
  /**
   * Structured semantic blocks for Stage A demonstration articles.
   */
  blocks: ArticleBlock[];
  /**
   * Optional pre-sanitized canonical HTML snapshot for future ScientificRadar Studio
   * publishing adapter compatibility (Stage C).
   */
  bodyHtml?: string;
  sources: PublicSource[];
  relatedIds: string[];
  seo?: {
    title?: string;
    description?: string;
    noindex?: boolean;
  };
}

export interface PublishedContentRepository {
  listPublicArticles(options?: {
    categorySlug?: string;
    subcategorySlug?: string;
    tagSlug?: string;
    query?: string;
    editorialType?: EditorialType;
    limit?: number;
  }): Promise<PublicArticle[]>;
  getPublicArticle(slug: string): Promise<PublicArticle | null>;
  getCategories(): Promise<PublicCategory[]>;
  getCategoryBySlug(slug: string): Promise<PublicCategory | null>;
  getAuthorsByIds(ids: string[]): Promise<PublicAuthor[]>;
  getRelatedArticles(article: PublicArticle, limit?: number): Promise<PublicArticle[]>;
}
