import React from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { DEMO_CATEGORIES } from "@/lib/content/fixtures";
import PrimaryNavigation from "./CategoryDropdown";
import MobileMenu from "./MobileMenu";

interface SiteHeaderProps {
  activeCategorySlug?: string;
}

export default function SiteHeader({ activeCategorySlug }: SiteHeaderProps) {
  return (
    <header className="border-b border-[var(--sr-rule)] bg-[var(--sr-paper)] relative z-40">
      {/* Skip Link for WCAG 2.2 AA Keyboard Navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--sr-ink)] focus:text-white focus:text-sm focus:font-medium focus:rounded-sm"
      >
        Skip to main content
      </a>

      {/* Top Masthead Bar */}
      <div className="site-container py-3 md:py-5">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4">
          {/* Left Zone: Mobile Trigger & Utility Links */}
          <div className="flex items-center gap-3 sm:gap-5">
            <MobileMenu
              categories={DEMO_CATEGORIES}
              activeCategorySlug={activeCategorySlug}
            />
            <div className="hidden md:flex items-center gap-5 text-xs font-medium text-[var(--sr-muted)]">
              <Link
                href="/topics"
                className="hover:text-[var(--sr-ink)] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[var(--sr-accent)]"
              >
                Topics Index
              </Link>
              <span aria-hidden="true" className="text-[var(--sr-rule)]">
                ·
              </span>
              <Link
                href="/about"
                className="hover:text-[var(--sr-ink)] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[var(--sr-accent)]"
              >
                About &amp; Standards
              </Link>
            </div>
          </div>

          {/* Center Zone: Original Centered ScientificRadar Publication Wordmark */}
          <div className="text-center">
            <Link
              href="/"
              className="group inline-flex flex-col items-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--sr-accent)]"
            >
              <span className="font-editorial text-2xl sm:text-3xl md:text-[34px] font-bold tracking-tight text-[var(--sr-ink)] group-hover:text-[var(--sr-accent)] transition-colors whitespace-nowrap">
                ScientificRadar
              </span>
              <span className="hidden sm:block text-[11px] font-medium tracking-[0.14em] uppercase text-[var(--sr-muted)] mt-0.5">
                Science Journalism · Explainers · Research Digests
              </span>
            </Link>
          </div>

          {/* Right Zone: Search Control */}
          <div className="flex items-center justify-end gap-2 sm:gap-3">
            <form
              action="/search"
              method="GET"
              role="search"
              aria-label="Site search"
              className="hidden sm:flex items-center relative"
            >
              <label htmlFor="header-search-input" className="sr-only">
                Search ScientificRadar
              </label>
              <input
                id="header-search-input"
                type="search"
                name="q"
                suppressHydrationWarning
                placeholder="Search stories..."
                className="w-36 md:w-48 lg:w-56 bg-white border border-[var(--sr-rule)] rounded-sm pl-3 pr-8 py-1.5 text-xs text-[var(--sr-ink)] placeholder:text-[var(--sr-muted)] focus:outline-2 focus:outline-[var(--sr-accent)] transition-colors"
              />
              <button
                type="submit"
                aria-label="Submit search"
                className="absolute right-1.5 p-1 text-[var(--sr-muted)] hover:text-[var(--sr-accent)] focus-visible:outline-2 focus-visible:outline-[var(--sr-accent)]"
              >
                <Search className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </form>

            <Link
              href="/search"
              aria-label="Search articles"
              className="sm:hidden inline-flex items-center justify-center p-2.5 min-h-[44px] min-w-[44px] text-[var(--sr-ink)] hover:text-[var(--sr-accent)] rounded-sm focus-visible:outline-2 focus-visible:outline-[var(--sr-accent)]"
            >
              <Search className="w-5 h-5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>

      {/* Hybrid Desktop Category Navigation Row */}
      <PrimaryNavigation
        categories={DEMO_CATEGORIES}
        activeCategorySlug={activeCategorySlug}
      />
    </header>
  );
}
