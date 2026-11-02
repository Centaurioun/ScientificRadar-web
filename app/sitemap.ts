import type { MetadataRoute } from "next";
import { contentRepository } from "@/lib/content/repository";
import { buildSitemapEntries } from "@/lib/seo/sitemap-robots";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, categories] = await Promise.all([
    contentRepository.listPublicArticles(),
    contentRepository.getCategories(),
  ]);

  return buildSitemapEntries(articles, categories);
}
