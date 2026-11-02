import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import SiteHeader from "@/components/site/SiteHeader";
import Footer from "@/components/site/Footer";
import EditorialCard from "@/components/editorial/EditorialCard";
import { contentRepository } from "@/lib/content/repository";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export const metadata: Metadata = {
  title: "Search Articles & Scientific Archive",
  description:
    "Search across ScientificRadar demonstration features, explainers, and research digests.",
  robots: { index: false, follow: false },
};

const SUGGESTED_QUERIES = [
  "spider silk",
  "hemocyanin",
  "İsmetpaşa",
  "Marmara boşluğu",
  "dCas9 epigenome",
  "Majorana braiding",
  "hydrothermal",
  "argyrodite",
];

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolved = await searchParams;
  const query = (resolved.q ?? "").trim();

  const matchingArticles = await contentRepository.listPublicArticles(
    query ? { query } : undefined
  );

  return (
    <>
      <SiteHeader />

      <main id="main-content" className="flex-1">
        <section className="border-b border-[var(--sr-rule)] bg-[var(--sr-surface)]/60 py-10 md:py-14">
          <div className="site-container max-w-3xl space-y-5">
            <div className="text-xs font-semibold uppercase tracking-wider text-[var(--sr-accent)]">
              Archive Search
            </div>
            <h1 className="font-editorial text-2xl sm:text-4xl font-bold text-[var(--sr-ink)] tracking-tight">
              Search ScientificRadar
            </h1>

            <form action="/search" method="GET" role="search" className="mt-4">
              <label htmlFor="main-search-input" className="sr-only">
                Search by keyword, topic, author, or Turkish scientific term
              </label>
              <div className="flex flex-col sm:flex-row gap-2.5">
                <div className="relative flex-1">
                  <input
                    id="main-search-input"
                    type="search"
                    name="q"
                    defaultValue={query}
                    suppressHydrationWarning
                    placeholder="Search e.g. 'spider silk', 'hemocyanin', 'İsmetpaşa'..."
                    className="w-full bg-white border border-[var(--sr-rule)] rounded-sm pl-4 pr-10 py-3 text-base text-[var(--sr-ink)] placeholder:text-[var(--sr-muted)] focus:outline-2 focus:outline-[var(--sr-accent)]"
                  />
                  <Search
                    className="w-4 h-4 text-[var(--sr-muted)] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    aria-hidden="true"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-[var(--sr-accent)] hover:bg-[var(--sr-accent-hover)] text-white text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Search Archive
                </button>
              </div>
            </form>

            {/* Quick Suggested Search Terms (Including Turkish diacritics) */}
            <div className="flex items-center flex-wrap gap-x-2.5 gap-y-1.5 text-xs pt-1">
              <span className="font-semibold text-[var(--sr-muted)]">
                Sample terms:
              </span>
              {SUGGESTED_QUERIES.map((term, idx) => (
                <React.Fragment key={term}>
                  {idx > 0 && (
                    <span
                      aria-hidden="true"
                      className="text-[var(--sr-muted)]"
                    >
                      ·
                    </span>
                  )}
                  <Link
                    href={`/search?q=${encodeURIComponent(term)}`}
                    className="font-medium text-[var(--sr-accent)] hover:underline"
                  >
                    {term}
                  </Link>
                </React.Fragment>
              ))}
            </div>
          </div>
        </section>

        <section
          aria-live="polite"
          className="site-container py-12"
        >
          <div className="mb-8 pb-3 border-b border-[var(--sr-rule)] flex items-baseline justify-between flex-wrap gap-2">
            <h2 className="font-editorial text-xl font-bold text-[var(--sr-ink)]">
              {query
                ? `Search results for “${query}”`
                : "All Demonstration Stories"}
            </h2>
            <span
              data-testid="search-results-count"
              className="text-xs font-semibold text-[var(--sr-muted)]"
            >
              {matchingArticles.length}{" "}
              {matchingArticles.length === 1 ? "story" : "stories"} found
            </span>
          </div>

          {matchingArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {matchingArticles.map((article) => (
                <EditorialCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div
              data-testid="search-empty-state"
              className="max-w-xl mx-auto my-8 p-8 rounded-sm bg-[var(--sr-surface)] border border-[var(--sr-rule)] text-center space-y-3"
            >
              <h3 className="font-editorial text-lg font-bold text-[var(--sr-ink)]">
                No matching articles found for “{query}”
              </h3>
              <p className="text-sm text-[var(--sr-muted)] leading-relaxed">
                Our Stage A demonstration repository contains 9 original
                articles across Physics, Biology, Medicine, Chemistry,
                Technology, Earth &amp; Climate, and Metascience. Try searching
                for{" "}
                <Link
                  href="/search?q=spidroin"
                  className="text-[var(--sr-accent)] underline"
                >
                  spidroin
                </Link>
                ,{" "}
                <Link
                  href="/search?q=hemocyanin"
                  className="text-[var(--sr-accent)] underline"
                >
                  hemocyanin
                </Link>
                , or{" "}
                <Link
                  href="/search?q=%C4%B0smetpa%C5%9Fa"
                  className="text-[var(--sr-accent)] underline"
                >
                  İsmetpaşa
                </Link>
                .
              </p>
              <div className="pt-2">
                <Link
                  href="/search"
                  className="inline-block px-4 py-2 bg-[var(--sr-ink)] text-white text-xs font-semibold uppercase tracking-wider rounded-sm"
                >
                  Reset Search Filter
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
