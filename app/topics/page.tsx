import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SiteHeader from "@/components/site/SiteHeader";
import Footer from "@/components/site/Footer";
import EditorialCard from "@/components/editorial/EditorialCard";
import { contentRepository } from "@/lib/content/repository";

export const metadata: Metadata = {
  title: "Topics & Scientific Disciplines Directory",
  description:
    "Explore ScientificRadar articles across Physics, Biology, Medicine & Health, Chemistry, Technology, Earth & Climate, and Society & Research.",
  robots: { index: false, follow: false },
};

export default async function TopicsDirectoryPage() {
  const [categories, allArticles] = await Promise.all([
    contentRepository.getCategories(),
    contentRepository.listPublicArticles(),
  ]);

  return (
    <>
      <SiteHeader />

      <main id="main-content" className="flex-1">
        <header className="border-b border-[var(--sr-rule)] bg-[var(--sr-surface)]/60 py-10 md:py-14">
          <div className="site-container max-w-4xl text-center space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-[var(--sr-accent)]">
              ScientificRadar Taxonomy
            </div>
            <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[var(--sr-ink)] tracking-tight">
              Scientific Disciplines &amp; Topics
            </h1>
            <p className="text-base text-[var(--sr-ink-secondary)] leading-relaxed max-w-2xl mx-auto">
              Browse long-form features, explainers, and research digests
              organized by core scientific discipline and specialized research
              subfields.
            </p>
          </div>
        </header>

        <div className="site-container py-12 space-y-16">
          {categories.map((category) => {
            const categoryArticles = allArticles.filter(
              (a) => a.categorySlug === category.slug
            );

            return (
              <section
                key={category.id}
                aria-labelledby={`topic-heading-${category.slug}`}
                className="pb-12 border-b border-[var(--sr-rule)] last:border-b-0"
              >
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                  <div>
                    <h2
                      id={`topic-heading-${category.slug}`}
                      className="font-editorial text-2xl font-bold text-[var(--sr-ink)]"
                    >
                      <Link
                        href={`/topics/${category.slug}`}
                        className="hover:text-[var(--sr-accent)] transition-colors"
                      >
                        {category.name}
                      </Link>
                    </h2>
                    <p className="text-sm text-[var(--sr-muted)] mt-1 max-w-2xl">
                      {category.description}
                    </p>
                  </div>

                  <Link
                    href={`/topics/${category.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--sr-accent)] hover:underline shrink-0"
                  >
                    <span>
                      View {category.name} ({categoryArticles.length})
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </Link>
                </div>

                {/* Subcategory Quick Links */}
                <div className="flex items-center flex-wrap gap-2 mb-8 text-xs">
                  <span className="font-semibold uppercase tracking-wider text-[var(--sr-muted)] mr-1">
                    Subfields:
                  </span>
                  {category.subcategories.map((sub, idx) => (
                    <React.Fragment key={sub.id}>
                      {idx > 0 && (
                        <span
                          aria-hidden="true"
                          className="text-[var(--sr-muted)]"
                        >
                          ·
                        </span>
                      )}
                      <Link
                        href={`/topics/${category.slug}?sub=${sub.slug}`}
                        className="font-medium text-[var(--sr-ink-secondary)] hover:text-[var(--sr-accent)] hover:underline"
                      >
                        {sub.name}
                      </Link>
                    </React.Fragment>
                  ))}
                </div>

                {/* Preview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {categoryArticles.map((article) => (
                    <EditorialCard key={article.id} article={article} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </main>

      <Footer />
    </>
  );
}
