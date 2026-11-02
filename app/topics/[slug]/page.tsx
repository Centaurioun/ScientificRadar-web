import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/site/SiteHeader";
import Footer from "@/components/site/Footer";
import EditorialCard from "@/components/editorial/EditorialCard";
import { contentRepository } from "@/lib/content/repository";
import { buildPageMetadata } from "@/lib/seo/metadata";

interface TopicSlugPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sub?: string }>;
}

export async function generateStaticParams() {
  const categories = await contentRepository.getCategories();
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: TopicSlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await contentRepository.getCategoryBySlug(slug);
  if (!category) {
    return buildPageMetadata({
      routeType: "not-found",
      pathname: `/topics/${slug}`,
      title: "Topic Not Found",
    });
  }
  return buildPageMetadata({
    routeType: "topic-landing",
    pathname: `/topics/${category.slug}`,
    category,
  });
}

export default async function TopicLandingPage({
  params,
  searchParams,
}: TopicSlugPageProps) {
  const { slug } = await params;
  const resolvedQuery = await searchParams;
  const activeSubSlug = resolvedQuery.sub;

  const category = await contentRepository.getCategoryBySlug(slug);
  if (!category) {
    notFound();
  }

  const articles = await contentRepository.listPublicArticles({
    categorySlug: category.slug,
    subcategorySlug: activeSubSlug,
  });

  const allCategoryArticles = await contentRepository.listPublicArticles({
    categorySlug: category.slug,
  });

  return (
    <>
      <SiteHeader activeCategorySlug={category.slug} />

      <main id="main-content" className="flex-1">
        <header className="border-b border-[var(--sr-rule)] bg-[var(--sr-surface)]/60 py-10 md:py-14">
          <div className="site-container space-y-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-[var(--sr-accent)]">
              <Link href="/topics" className="hover:underline">
                Disciplines
              </Link>
              <span aria-hidden="true" className="mx-1.5 text-[var(--sr-muted)]">
                /
              </span>
              <span>{category.name}</span>
            </div>

            <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[var(--sr-ink)] tracking-tight">
              {category.name}
            </h1>

            <p className="text-base text-[var(--sr-ink-secondary)] leading-relaxed max-w-2xl">
              {category.description}
            </p>

            {/* Interactive Subcategory Filter Controls */}
            <div
              role="navigation"
              aria-label={`Filter ${category.name} by subdiscipline`}
              className="pt-3 flex items-center flex-wrap gap-2"
            >
              <Link
                href={`/topics/${category.slug}`}
                className={`px-3 py-1.5 text-xs font-medium rounded-sm border transition-colors whitespace-nowrap shrink-0 ${
                  !activeSubSlug
                    ? "bg-[var(--sr-ink)] text-white border-[var(--sr-ink)]"
                    : "bg-white text-[var(--sr-ink-secondary)] border-[var(--sr-rule)] hover:border-[var(--sr-ink)]"
                }`}
              >
                All {category.name} ({allCategoryArticles.length})
              </Link>
              {category.subcategories.map((sub) => {
                const isSelected = activeSubSlug === sub.slug;
                return (
                  <Link
                    key={sub.id}
                    href={`/topics/${category.slug}?sub=${sub.slug}`}
                    className={`px-3 py-1.5 text-xs font-medium rounded-sm border transition-colors whitespace-nowrap shrink-0 ${
                      isSelected
                        ? "bg-[var(--sr-accent)] text-white border-[var(--sr-accent)]"
                        : "bg-white text-[var(--sr-ink-secondary)] border-[var(--sr-rule)] hover:border-[var(--sr-accent)]"
                    }`}
                  >
                    {sub.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </header>

        <section
          aria-label={`${category.name} stories`}
          className="site-container py-12"
        >
          {articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <EditorialCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-sm bg-[var(--sr-surface)] border border-[var(--sr-rule)] text-center space-y-3 max-w-xl mx-auto">
              <h2 className="font-editorial text-lg font-bold text-[var(--sr-ink)]">
                No demo stories currently assigned to this subfield filter
              </h2>
              <p className="text-sm text-[var(--sr-muted)]">
                View all stories in {category.name} or browse the full topic
                directory.
              </p>
              <div className="pt-2">
                <Link
                  href={`/topics/${category.slug}`}
                  className="inline-block px-4 py-2 bg-[var(--sr-accent)] text-white text-xs font-semibold uppercase tracking-wider rounded-sm"
                >
                  Show All {category.name} Stories
                </Link>
              </div>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}
