"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown, Search } from "lucide-react";
import { PublicCategory } from "@/lib/content/types";

interface MobileMenuProps {
  categories: PublicCategory[];
  activeCategorySlug?: string;
}

export default function MobileMenu({
  categories,
  activeCategorySlug,
}: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedCatIds, setExpandedCatIds] = useState<Record<string, boolean>>(
    {}
  );
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    closeBtnRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const toggleSubcategoryAccordion = (categoryId: string) => {
    setExpandedCatIds((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  return (
    <div className="lg:hidden">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={isOpen}
        aria-controls="mobile-navigation-drawer"
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        onClick={() => setIsOpen((prev) => !prev)}
        className="inline-flex items-center gap-1.5 px-2.5 py-2 min-h-[44px] min-w-[44px] text-sm font-medium text-[var(--sr-ink)] hover:text-[var(--sr-accent)] rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sr-accent)]"
      >
        {isOpen ? (
          <X className="w-5 h-5" aria-hidden="true" />
        ) : (
          <Menu className="w-5 h-5" aria-hidden="true" />
        )}
        <span className="text-xs font-semibold tracking-wide uppercase hidden sm:inline">
          Sections
        </span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40"
            aria-hidden="true"
            onClick={() => {
              setIsOpen(false);
              triggerRef.current?.focus();
            }}
          />

          {/* Drawer Content */}
          <div
            id="mobile-navigation-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="ScientificRadar sections and search"
            className="relative z-10 w-full max-w-sm bg-[var(--sr-paper)] border-r border-[var(--sr-rule)] h-full overflow-y-auto p-4 sm:p-6 flex flex-col justify-between shadow-xl"
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[var(--sr-rule)]">
                <Link
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className="font-editorial text-lg font-bold tracking-tight text-[var(--sr-ink)]"
                >
                  ScientificRadar
                </Link>
                <button
                  ref={closeBtnRef}
                  type="button"
                  aria-label="Close menu"
                  onClick={() => {
                    setIsOpen(false);
                    triggerRef.current?.focus();
                  }}
                  className="p-2 min-h-[44px] min-w-[44px] inline-flex items-center justify-center text-[var(--sr-muted)] hover:text-[var(--sr-ink)] rounded-sm focus-visible:outline-2 focus-visible:outline-[var(--sr-accent)]"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>

              {/* Mobile Search Form */}
              <form
                action="/search"
                method="GET"
                onSubmit={() => setIsOpen(false)}
                className="mt-4 mb-5"
              >
                <label htmlFor="mobile-search-input" className="sr-only">
                  Search articles
                </label>
                <div className="relative flex items-center">
                  <input
                    id="mobile-search-input"
                    type="search"
                    name="q"
                    placeholder="Search articles, topics, authors..."
                    className="w-full bg-white border border-[var(--sr-rule)] rounded-sm pl-3 pr-10 py-2.5 text-sm text-[var(--sr-ink)] placeholder:text-[var(--sr-muted)] focus:outline-2 focus:outline-[var(--sr-accent)]"
                  />
                  <button
                    type="submit"
                    aria-label="Submit search"
                    className="absolute right-1 p-2 text-[var(--sr-muted)] hover:text-[var(--sr-accent)]"
                  >
                    <Search className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </form>

              {/* Mobile Accordion Categories */}
              <nav aria-label="Mobile discipline directory">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--sr-muted)] mb-2">
                  Scientific Disciplines
                </div>
                <ul className="divide-y divide-[var(--sr-rule)] border-y border-[var(--sr-rule)]">
                  {categories.map((cat) => {
                    const isExpanded = Boolean(expandedCatIds[cat.id]);
                    const isActive = activeCategorySlug === cat.slug;
                    const panelId = `mobile-sub-${cat.slug}`;

                    return (
                      <li key={cat.id} className="py-1">
                        <div className="flex items-center justify-between">
                          <Link
                            href={`/topics/${cat.slug}`}
                            onClick={() => setIsOpen(false)}
                            className={`flex-1 py-2.5 text-sm font-medium ${
                              isActive
                                ? "text-[var(--sr-accent)] font-semibold"
                                : "text-[var(--sr-ink)]"
                            }`}
                          >
                            {cat.name}
                          </Link>
                          <button
                            type="button"
                            aria-expanded={isExpanded}
                            aria-controls={panelId}
                            aria-label={`Toggle ${cat.name} subcategories`}
                            onClick={() => toggleSubcategoryAccordion(cat.id)}
                            className="p-2.5 min-h-[44px] min-w-[44px] inline-flex items-center justify-center text-[var(--sr-muted)] hover:text-[var(--sr-ink)]"
                          >
                            <ChevronDown
                              className={`w-4 h-4 transition-transform ${
                                isExpanded ? "rotate-180 text-[var(--sr-accent)]" : ""
                              }`}
                              aria-hidden="true"
                            />
                          </button>
                        </div>

                        {isExpanded && (
                          <ul
                            id={panelId}
                            className="pl-3 pb-2.5 space-y-1.5 border-l-2 border-[var(--sr-rule)] ml-1 mb-1"
                          >
                            {cat.subcategories.map((sub) => (
                              <li key={sub.id}>
                                <Link
                                  href={`/topics/${cat.slug}?sub=${sub.slug}`}
                                  onClick={() => setIsOpen(false)}
                                  className="block py-1.5 text-xs font-medium text-[var(--sr-muted)] hover:text-[var(--sr-accent)]"
                                >
                                  {sub.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </nav>

              {/* Secondary links */}
              <div className="mt-5 space-y-2">
                <Link
                  href="/topics"
                  onClick={() => setIsOpen(false)}
                  className="block py-1.5 text-sm font-medium text-[var(--sr-ink)] hover:text-[var(--sr-accent)]"
                >
                  All Topics Directory
                </Link>
                <Link
                  href="/about"
                  onClick={() => setIsOpen(false)}
                  className="block py-1.5 text-sm font-medium text-[var(--sr-ink)] hover:text-[var(--sr-accent)]"
                >
                  About &amp; Editorial Mission
                </Link>
              </div>
            </div>

            <div className="pt-4 mt-6 border-t border-[var(--sr-rule)] text-xs text-[var(--sr-muted)]">
              Independent science journalism, explainers, and research digests.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
