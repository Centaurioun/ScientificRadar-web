import React from "react";
import Link from "next/link";
import { DEMO_CATEGORIES } from "@/lib/content/fixtures";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--sr-rule)] bg-[var(--sr-surface)] text-[var(--sr-ink)] mt-20">
      <div className="site-container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-10 border-b border-[var(--sr-rule)]">
          {/* Publication Identity & Mission */}
          <div className="md:col-span-5 space-y-3">
            <Link
              href="/"
              className="font-editorial text-2xl font-bold tracking-tight text-[var(--sr-ink)]"
            >
              ScientificRadar
            </Link>
            <p className="text-sm text-[var(--sr-muted)] leading-relaxed max-w-md">
              An independent scientific publication dedicated to in-depth
              long-form journalism, mechanistic explainers, and transparent
              research digests across the physical, life, and earth sciences.
            </p>
            <p className="text-xs text-[var(--sr-muted)] pt-1">
              Typography set in Merriweather &amp; Inter · Built for comfortable
              long-form scientific reading and verifiable source attribution.
            </p>
          </div>

          {/* Disciplines */}
          <div className="md:col-span-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--sr-ink)] mb-3">
              Scientific Disciplines
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-sm">
              {DEMO_CATEGORIES.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/topics/${category.slug}`}
                    className="text-[var(--sr-muted)] hover:text-[var(--sr-accent)] transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Reader Navigation & Standards */}
          <div className="md:col-span-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--sr-ink)] mb-3">
              Publication &amp; Standards
            </h2>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-[var(--sr-muted)] hover:text-[var(--sr-accent)] transition-colors"
                >
                  About ScientificRadar
                </Link>
              </li>
              <li>
                <Link
                  href="/topics"
                  className="text-[var(--sr-muted)] hover:text-[var(--sr-accent)] transition-colors"
                >
                  Topics &amp; Taxonomy Directory
                </Link>
              </li>
              <li>
                <Link
                  href="/search"
                  className="text-[var(--sr-muted)] hover:text-[var(--sr-accent)] transition-colors"
                >
                  Search Archive
                </Link>
              </li>
              <li>
                <Link
                  href="/article/spider-silk-hierarchical-protein-mechanics?measure=700"
                  className="text-[var(--sr-muted)] hover:text-[var(--sr-accent)] transition-colors"
                >
                  Reading Width: 700px vs 600px
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal & Transparent Stage A Notice */}
        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[var(--sr-muted)]">
          <div>
            © 2026 ScientificRadar. All original
            demonstration articles and scientific diagrams are illustrative
            Stage A fixtures.
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span>Stage A Standalone Reader Architecture</span>
            <span aria-hidden="true">·</span>
            <span>robots: noindex, nofollow</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
