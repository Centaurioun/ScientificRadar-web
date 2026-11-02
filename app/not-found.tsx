import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/site/SiteHeader";
import Footer from "@/components/site/Footer";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  routeType: "not-found",
  pathname: "/404",
});

export default function NotFound() {
  return (
    <>
      <SiteHeader />

      <main id="main-content" className="flex-1 flex items-center justify-center py-20">
        <div className="site-container max-w-xl text-center space-y-5 p-8 rounded-sm bg-[var(--sr-surface)] border border-[var(--sr-rule)]">
          <div className="font-mono text-xs font-semibold uppercase tracking-widest text-[var(--sr-accent)]">
            HTTP 404 · Route or Article Not Found
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[var(--sr-ink)]">
            This page is not in the ScientificRadar archive
          </h1>
          <p className="text-sm sm:text-base text-[var(--sr-ink-secondary)] leading-relaxed">
            The requested article slug or topic URL does not match any published
            or demonstration record. Unpublished drafts and unknown routes are
            strictly excluded from public rendering.
          </p>
          <div className="pt-3 flex items-center justify-center flex-wrap gap-3">
            <Link
              href="/"
              className="px-5 py-2.5 bg-[var(--sr-accent)] hover:bg-[var(--sr-accent-hover)] text-white text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors"
            >
              Return to Homepage
            </Link>
            <Link
              href="/topics"
              className="px-5 py-2.5 bg-white border border-[var(--sr-rule)] hover:border-[var(--sr-ink)] text-[var(--sr-ink)] text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors"
            >
              Browse Topics Directory
            </Link>
            <Link
              href="/search"
              className="px-5 py-2.5 bg-white border border-[var(--sr-rule)] hover:border-[var(--sr-ink)] text-[var(--sr-ink)] text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors"
            >
              Search Archive
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
