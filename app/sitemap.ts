import type { MetadataRoute } from "next";
import { contentRepository } from "@/lib/content/repository";
import { buildSitemapEntries } from "@/lib/seo/sitemap-robots";

// Publication and withdrawal state is authoritative in Studio. Rebuild the
// sitemap on each request instead of freezing the active article set at build.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, categories] = await Promise.all([
    contentRepository.listPublicArticles(),
    contentRepository.getCategories(),
  ]);

  return buildSitemapEntries(articles, categories);
}
