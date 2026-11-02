import React from "react";
import Link from "next/link";
import Image from "next/image";
import { PublicArticle, PublicAuthor } from "@/lib/content/types";
import {
  formatPublicationDate,
  getCategoryName,
  getEditorialTypeLabel,
} from "@/lib/content/repository";
import { HeroVariantOption } from "@/lib/design/tokens";

interface LeadStoryProps {
  article: PublicArticle;
  authors: PublicAuthor[];
  variant?: HeroVariantOption;
}

export default function LeadStory({
  article,
  authors,
  variant = "standard",
}: LeadStoryProps) {
  const categoryName = getCategoryName(article.categorySlug);
  const typeLabel = getEditorialTypeLabel(article.editorialType);
  const authorNames = authors.map((a) => a.name).join(" & ");

  if (variant === "compact") {
    return (
      <section
        aria-labelledby="lead-story-heading"
        className="site-container py-8 md:py-10 border-b border-[var(--sr-rule)]"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-3.5">
            <div className="flex items-center flex-wrap gap-2 text-xs font-semibold tracking-wider uppercase text-[var(--sr-accent)]">
              <Link
                href={`/topics/${article.categorySlug}`}
                className="hover:underline"
              >
                {categoryName}
              </Link>
              <span aria-hidden="true" className="text-[var(--sr-muted)]">
                ·
              </span>
              <span className="text-[var(--sr-muted)] font-medium">
                {typeLabel}
              </span>
            </div>

            <h2
              id="lead-story-heading"
              className="font-editorial text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[var(--sr-ink)] leading-[1.2] text-balance"
            >
              <Link
                href={`/article/${article.slug}`}
                className="hover:text-[var(--sr-accent)] transition-colors"
              >
                {article.title}
              </Link>
            </h2>

            <p className="text-base text-[var(--sr-ink-secondary)] leading-relaxed max-w-2xl">
              {article.dek}
            </p>

            <div className="pt-1 flex items-center flex-wrap gap-2 text-xs text-[var(--sr-muted)]">
              <span className="font-medium text-[var(--sr-ink)]">
                By {authorNames}
              </span>
              <span aria-hidden="true">·</span>
              <time dateTime={article.publishedAt}>
                {formatPublicationDate(article.publishedAt)}
              </time>
              <span aria-hidden="true">·</span>
              <span>{article.readingTimeMinutes} min read</span>
            </div>
          </div>

          {article.hero && (
            <div className="lg:col-span-5">
              <Link
                href={`/article/${article.slug}`}
                className="block overflow-hidden rounded-sm border border-[var(--sr-rule)] bg-[#10252E]"
              >
                <div className="relative aspect-[16/10] w-full">
                  <Image
                    src={article.hero.src}
                    alt={article.hero.alt}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 42vw"
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </Link>
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="lead-story-heading"
      className="site-container pt-6 pb-10 md:pt-10 md:pb-14 border-b border-[var(--sr-rule)]"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-stretch">
        {/* Visual Lead Column */}
        <div className="lg:col-span-7 flex flex-col">
          {article.hero ? (
            <figure className="flex-1 flex flex-col">
              <Link
                href={`/article/${article.slug}`}
                className="block overflow-hidden rounded-sm border border-[var(--sr-rule)] bg-[#0F1E26] group"
              >
                <div className="relative aspect-[16/10] w-full">
                  <Image
                    src={article.hero.src}
                    alt={article.hero.alt}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    className="object-cover group-hover:scale-[1.01] transition-transform duration-200"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </Link>
              <figcaption className="mt-2.5 text-xs text-[var(--sr-muted)] leading-relaxed flex flex-wrap items-center justify-between gap-2">
                <span>{article.hero.credit}</span>
              </figcaption>
            </figure>
          ) : (
            <div className="aspect-[16/10] w-full rounded-sm border border-[var(--sr-rule)] bg-[var(--sr-surface)] flex items-center justify-center p-6 text-sm text-[var(--sr-muted)]">
              ScientificRadar Lead Feature
            </div>
          )}
        </div>

        {/* Editorial Text Column */}
        <div className="lg:col-span-5 flex flex-col justify-center space-y-4">
          <div className="flex items-center flex-wrap gap-2 text-xs font-semibold tracking-wider uppercase text-[var(--sr-accent)]">
            <Link
              href={`/topics/${article.categorySlug}`}
              className="hover:underline focus-visible:outline-2 focus-visible:outline-[var(--sr-accent)]"
            >
              {categoryName}
            </Link>
            <span aria-hidden="true" className="text-[var(--sr-muted)]">
              ·
            </span>
            <span className="text-[var(--sr-muted)] font-medium">
              Lead {typeLabel}
            </span>
          </div>

          <h2
            id="lead-story-heading"
            className="font-editorial text-2xl sm:text-3xl xl:text-[34px] font-bold tracking-tight text-[var(--sr-ink)] leading-[1.22] text-balance"
          >
            <Link
              href={`/article/${article.slug}`}
              className="hover:text-[var(--sr-accent)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--sr-accent)]"
            >
              {article.title}
            </Link>
          </h2>

          <p className="text-[16px] sm:text-[17px] text-[var(--sr-ink-secondary)] leading-relaxed">
            {article.dek}
          </p>

          <p className="text-sm text-[var(--sr-muted)] leading-relaxed">
            {article.summary}
          </p>

          <div className="pt-2 border-t border-[var(--sr-rule)] flex items-center flex-wrap gap-2 text-xs text-[var(--sr-muted)]">
            <span className="font-medium text-[var(--sr-ink)]">
              By {authorNames}
            </span>
            <span aria-hidden="true">·</span>
            <time dateTime={article.publishedAt}>
              {formatPublicationDate(article.publishedAt)}
            </time>
            <span aria-hidden="true">·</span>
            <span>{article.readingTimeMinutes} min read</span>
          </div>
        </div>
      </div>
    </section>
  );
}
