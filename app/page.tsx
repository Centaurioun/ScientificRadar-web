import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import SiteHeader from "@/components/site/SiteHeader";
import Footer from "@/components/site/Footer";
import LeadStory from "@/components/editorial/LeadStory";
import EditorialCard from "@/components/editorial/EditorialCard";
import NewsletterDemo from "@/components/editorial/NewsletterDemo";
import {
  contentRepository,
  formatPublicationDate,
  getCategoryName,
} from "@/lib/content/repository";
import { HeroVariantOption } from "@/lib/design/tokens";

interface HomePageProps {
  searchParams: Promise<{ hero?: string }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const resolvedParams = await searchParams;
  const heroVariant: HeroVariantOption =
    resolvedParams.hero === "standard" ? "standard" : "compact";

  const allArticles = await contentRepository.listPublicArticles();
  const categories = await contentRepository.getCategories();

  const leadArticle =
    allArticles.find((a) => a.featuredRank === 1) ?? allArticles[0];
  const leadAuthors = await contentRepository.getAuthorsByIds(
    leadArticle.authorIds
  );

  const secondaryFeatures = allArticles
    .filter((a) => a.id !== leadArticle.id)
    .slice(0, 6);

  const mostReadDemoList = [...allArticles]
    .filter((a) => typeof a.mostReadDemoRank === "number")
    .sort((a, b) => (a.mostReadDemoRank ?? 99) - (b.mostReadDemoRank ?? 99))
    .slice(0, 5);

  const chemistryAndBioSpotlight = allArticles.filter(
    (a) =>
      (a.categorySlug === "chemistry" ||
        a.categorySlug === "biology" ||
        a.categorySlug === "medicine-health") &&
      a.id !== leadArticle.id
  );

  const earthAndPhysicsSpotlight = allArticles.filter(
    (a) =>
      a.categorySlug === "earth-climate" ||
      a.categorySlug === "physics" ||
      a.categorySlug === "technology"
  );

  return (
    <>
      <SiteHeader />

      <main id="main-content" className="flex-1">
        {/* Accessible Page-Level H1 Utility Strip + Hero Variant Switcher */}
        <div className="border-b border-[var(--sr-rule-subtle)] bg-[var(--sr-surface)]/60">
          <div className="site-container py-2 flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--sr-muted)]">
            <h1 className="font-medium text-[var(--sr-ink-secondary)]">
              ScientificRadar — Independent Science Magazine &amp; Long-Form
              Research Explainers
            </h1>
            <div className="flex items-center gap-2">
              <span>Hero Layout:</span>
              <Link
                href="/?hero=standard"
                className={`px-2 py-0.5 rounded-sm transition-colors ${
                  heroVariant === "standard"
                    ? "bg-[var(--sr-accent)] text-white font-semibold"
                    : "hover:text-[var(--sr-ink)]"
                }`}
              >
                Standard Cover
              </Link>
              <Link
                href="/?hero=compact"
                className={`px-2 py-0.5 rounded-sm transition-colors ${
                  heroVariant === "compact"
                    ? "bg-[var(--sr-accent)] text-white font-semibold"
                    : "hover:text-[var(--sr-ink)]"
                }`}
              >
                Compact Cover
              </Link>
            </div>
          </div>
        </div>

        {/* 1. Lead Editorial Feature Hero (Knowable-inspired balanced scale) */}
        <LeadStory
          article={leadArticle}
          authors={leadAuthors}
          variant={heroVariant}
        />

        {/* 2. Latest Science Stories + Editors' Picks / Most Read (Demo Ranking) */}
        <section
          aria-labelledby="latest-stories-heading"
          className="site-container py-12 md:py-16 border-b border-[var(--sr-rule)]"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* 3-Column Editorial Grid (Spans 8 columns on large screens, 3 cols below) */}
            <div className="lg:col-span-8">
              <div className="flex items-baseline justify-between mb-6 pb-2 border-b border-[var(--sr-rule)]">
                <h2
                  id="latest-stories-heading"
                  className="font-editorial text-xl sm:text-2xl font-bold text-[var(--sr-ink)]"
                >
                  Latest Science Stories
                </h2>
                <Link
                  href="/topics"
                  className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-[var(--sr-accent)] hover:underline"
                >
                  <span>All Disciplines</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {secondaryFeatures.map((article) => (
                  <EditorialCard key={article.id} article={article} />
                ))}
              </div>
            </div>

            {/* Editors' Picks / Most Read Demo Rail (Spans 4 columns) */}
            <aside
              aria-labelledby="most-read-heading"
              className="lg:col-span-4 lg:pl-8 lg:border-l border-[var(--sr-rule)]"
            >
              <div className="pb-2 mb-5 border-b border-[var(--sr-rule)] flex items-baseline justify-between gap-2">
                <h2
                  id="most-read-heading"
                  className="font-editorial text-lg sm:text-xl font-bold text-[var(--sr-ink)]"
                >
                  Editors’ Picks &amp; Most Read
                </h2>
                <span className="text-[11px] font-medium uppercase tracking-wider text-[var(--sr-muted)]">
                  Curated Demo Order
                </span>
              </div>

              <ol className="divide-y divide-[var(--sr-rule-subtle)]">
                {mostReadDemoList.map((item, idx) => (
                  <li key={item.id} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex items-start gap-3.5">
                      <span className="font-mono text-lg font-bold text-[var(--sr-accent)] tabular-nums leading-none mt-0.5">
                        0{idx + 1}
                      </span>
                      <div className="space-y-1 min-w-0">
                        <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--sr-accent)]">
                          {getCategoryName(item.categorySlug)}
                        </div>
                        <h3 className="font-editorial text-base font-bold text-[var(--sr-ink)] leading-snug">
                          <Link
                            href={`/article/${item.slug}`}
                            className="hover:text-[var(--sr-accent)] transition-colors"
                          >
                            {item.title}
                          </Link>
                        </h3>
                        <div className="text-xs text-[var(--sr-muted)]">
                          <time dateTime={item.publishedAt}>
                            {formatPublicationDate(item.publishedAt)}
                          </time>
                          <span aria-hidden="true"> · </span>
                          <span>{item.readingTimeMinutes} min read</span>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>

              {/* Quick Reading Width Comparison Callout for Owner Review */}
              <div className="mt-8 p-4 rounded-sm bg-[var(--sr-surface)] border border-[var(--sr-rule)] space-y-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-[var(--sr-accent)]">
                  Typography &amp; Measure Evaluation
                </div>
                <p className="text-xs text-[var(--sr-ink-secondary)] leading-relaxed">
                  Compare the long-form reading column at{" "}
                  <strong>700px (Owner Default)</strong> and{" "}
                  <strong>600px (Compact Comparison)</strong> on our two anchor
                  feature articles:
                </p>
                <div className="pt-1 flex flex-wrap gap-2">
                  <Link
                    href="/article/spider-silk-hierarchical-protein-mechanics?measure=700"
                    className="px-2.5 py-1.5 text-xs font-semibold bg-white border border-[var(--sr-rule)] rounded-sm text-[var(--sr-ink)] hover:border-[var(--sr-accent)] hover:text-[var(--sr-accent)]"
                  >
                    Spider Silk (700px)
                  </Link>
                  <Link
                    href="/article/spider-silk-hierarchical-protein-mechanics?measure=600"
                    className="px-2.5 py-1.5 text-xs font-semibold bg-white border border-[var(--sr-rule)] rounded-sm text-[var(--sr-ink)] hover:border-[var(--sr-accent)] hover:text-[var(--sr-accent)]"
                  >
                    Spider Silk (600px)
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </section>

        {/* 3. Thematic Spotlight I: Molecular Life & Bioinorganic Chemistry */}
        <section
          aria-labelledby="spotlight-life-heading"
          className="site-container py-12 md:py-16 border-b border-[var(--sr-rule)]"
        >
          <div className="flex items-baseline justify-between flex-wrap gap-2 mb-8">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-[var(--sr-accent)]">
                Thematic Spotlight
              </div>
              <h2
                id="spotlight-life-heading"
                className="font-editorial text-2xl sm:text-3xl font-bold text-[var(--sr-ink)] mt-1"
              >
                Molecular Life, Chemistry &amp; Therapeutics
              </h2>
            </div>
            <Link
              href="/topics/chemistry"
              className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-[var(--sr-accent)] hover:underline"
            >
              <span>Explore Chemistry &amp; Biology</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {chemistryAndBioSpotlight.slice(0, 3).map((article) => (
              <EditorialCard key={article.id} article={article} />
            ))}
          </div>
        </section>

        {/* 4. Thematic Spotlight II: Earth, Geodesy & Quantum Systems */}
        <section
          aria-labelledby="spotlight-earth-heading"
          className="site-container py-12 md:py-16 border-b border-[var(--sr-rule)]"
        >
          <div className="flex items-baseline justify-between flex-wrap gap-2 mb-8">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-[var(--sr-accent)]">
                Planetary &amp; Physical Systems
              </div>
              <h2
                id="spotlight-earth-heading"
                className="font-editorial text-2xl sm:text-3xl font-bold text-[var(--sr-ink)] mt-1"
              >
                Earth Geodesy, Paleoclimate &amp; Quantum Matter
              </h2>
            </div>
            <Link
              href="/topics/earth-climate"
              className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-[var(--sr-accent)] hover:underline"
            >
              <span>Explore Earth &amp; Physics</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {earthAndPhysicsSpotlight.slice(0, 3).map((article) => (
              <EditorialCard key={article.id} article={article} />
            ))}
          </div>
        </section>

        {/* 5. Scientific Visual Explainers & Diagram Gallery (Honest Multimedia Module) */}
        <section
          aria-labelledby="diagrams-gallery-heading"
          className="site-container py-12 md:py-16 border-b border-[var(--sr-rule)]"
        >
          <div className="flex items-baseline justify-between flex-wrap gap-2 mb-6">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-[var(--sr-accent)]">
                Scientific Diagrams &amp; Visual Explainers
              </div>
              <h2
                id="diagrams-gallery-heading"
                className="font-editorial text-2xl sm:text-3xl font-bold text-[var(--sr-ink)] mt-1"
              >
                Inside the Figures: Original Vector Schematics
              </h2>
            </div>
            <span className="text-xs text-[var(--sr-muted)]">
              Same-Origin Licensed SVG Illustrations (CC0 Demo Archive)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {allArticles.slice(0, 3).map((art) =>
              art.hero ? (
                <div
                  key={art.id}
                  className="p-4 rounded-sm bg-[var(--sr-surface)] border border-[var(--sr-rule)] flex flex-col justify-between"
                >
                  <div>
                    <Link
                      href={`/article/${art.slug}`}
                      className="block overflow-hidden rounded-sm border border-[var(--sr-rule)] bg-[#102028] mb-3"
                    >
                      <div className="relative aspect-[16/10] w-full">
                        <Image
                          src={art.hero.src}
                          alt={art.hero.alt}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </Link>
                    <h3 className="font-editorial text-base font-bold text-[var(--sr-ink)] leading-snug">
                      <Link
                        href={`/article/${art.slug}`}
                        className="hover:text-[var(--sr-accent)]"
                      >
                        {art.title}
                      </Link>
                    </h3>
                    <p className="mt-1.5 text-xs text-[var(--sr-ink-secondary)] leading-relaxed line-clamp-3">
                      {art.hero.caption}
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-[var(--sr-rule)] text-[11px] text-[var(--sr-muted)]">
                    {art.hero.credit}
                  </div>
                </div>
              ) : null
            )}
          </div>
        </section>

        {/* 6. Explore by Discipline Strip */}
        <section
          aria-labelledby="disciplines-strip-heading"
          className="site-container py-12"
        >
          <h2
            id="disciplines-strip-heading"
            className="font-editorial text-xl font-bold text-[var(--sr-ink)] mb-6"
          >
            Browse by Scientific Discipline
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/topics/${cat.slug}`}
                className="p-4 rounded-sm bg-white border border-[var(--sr-rule)] hover:border-[var(--sr-accent)] transition-colors group flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-editorial text-base font-bold text-[var(--sr-ink)] group-hover:text-[var(--sr-accent)]">
                    {cat.name}
                  </h3>
                  <p className="mt-1 text-xs text-[var(--sr-muted)] leading-relaxed">
                    {cat.shortDescription}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-[var(--sr-rule-subtle)] text-[11px] font-semibold text-[var(--sr-accent)] flex items-center justify-between">
                  <span>{cat.subcategories.length} subdisciplines</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 7. Newsletter Demo Invitation */}
        <NewsletterDemo />
      </main>

      <Footer />
    </>
  );
}
