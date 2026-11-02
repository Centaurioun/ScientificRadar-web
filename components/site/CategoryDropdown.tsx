"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronDown, ArrowRight } from "lucide-react";
import { PublicCategory } from "@/lib/content/types";

interface PrimaryNavigationProps {
  categories: PublicCategory[];
  activeCategorySlug?: string;
}

export default function PrimaryNavigation({
  categories,
  activeCategorySlug,
}: PrimaryNavigationProps) {
  const [openCategoryId, setOpenCategoryId] = useState<string | null>(null);
  const navRef = useRef<HTMLElement | null>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const closeMenu = useCallback((restoreFocusToId?: string) => {
    setOpenCategoryId(null);
    if (restoreFocusToId && buttonRefs.current[restoreFocusToId]) {
      buttonRefs.current[restoreFocusToId]?.focus();
    }
  }, []);

  useEffect(() => {
    if (!openCategoryId) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu(openCategoryId);
      }
    };

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      if (
        navRef.current &&
        event.target instanceof Node &&
        !navRef.current.contains(event.target)
      ) {
        setOpenCategoryId(null);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, [openCategoryId, closeMenu]);

  return (
    <nav
      ref={navRef}
      aria-label="Primary scientific disciplines"
      className="hidden lg:block border-t border-[var(--sr-rule)] bg-[var(--sr-paper)]"
    >
      <div className="site-container">
        <ul className="flex items-center justify-center flex-wrap gap-x-1 xl:gap-x-3 py-1.5">
          {categories.map((category) => {
            const isOpen = openCategoryId === category.id;
            const isActive = activeCategorySlug === category.slug;
            const dropdownId = `cat-submenu-${category.slug}`;

            return (
              <li
                key={category.id}
                className="relative flex items-center"
                onBlur={(e) => {
                  if (
                    isOpen &&
                    !e.currentTarget.contains(e.relatedTarget as Node | null)
                  ) {
                    setOpenCategoryId(null);
                  }
                }}
              >
                <div className="flex items-center rounded-sm">
                  {/* 1. Separate accessible category anchor */}
                  <Link
                    href={`/topics/${category.slug}`}
                    onClick={() => setOpenCategoryId(null)}
                    className={`px-2.5 py-2 text-[13.5px] font-medium tracking-tight transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sr-accent)] ${
                      isActive
                        ? "text-[var(--sr-accent)] font-semibold underline decoration-2 underline-offset-8"
                        : "text-[var(--sr-ink)] hover:text-[var(--sr-accent)]"
                    }`}
                  >
                    {category.name}
                  </Link>

                  {/* 2. Separate adjacent chevron disclosure button */}
                  <button
                    ref={(el) => {
                      buttonRefs.current[category.id] = el;
                    }}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={dropdownId}
                    aria-label={`${category.name} subcategories`}
                    onClick={() =>
                      setOpenCategoryId((prev) =>
                        prev === category.id ? null : category.id
                      )
                    }
                    className={`p-1.5 mr-1 rounded-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sr-accent)] ${
                      isOpen
                        ? "bg-[var(--sr-surface)] text-[var(--sr-accent)]"
                        : "text-[var(--sr-muted)] hover:text-[var(--sr-ink)] hover:bg-[var(--sr-surface)]"
                    }`}
                  >
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-150 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                </div>

                {/* Subcategory Disclosure Panel */}
                {isOpen && (
                  <div
                    id={dropdownId}
                    role="region"
                    aria-label={`${category.name} subdisciplines`}
                    className="absolute left-0 top-full mt-1 w-80 bg-white border border-[var(--sr-rule)] shadow-lg rounded-sm p-4 z-50"
                  >
                    <div className="pb-2.5 mb-2.5 border-b border-[var(--sr-rule)]">
                      <p className="text-xs font-medium text-[var(--sr-muted)] leading-relaxed">
                        {category.shortDescription}
                      </p>
                    </div>
                    <ul className="space-y-1.5">
                      {category.subcategories.map((sub) => (
                        <li key={sub.id}>
                          <Link
                            href={`/topics/${category.slug}?sub=${sub.slug}`}
                            onClick={() => setOpenCategoryId(null)}
                            className="block p-2 rounded-sm hover:bg-[var(--sr-surface)] transition-colors group focus-visible:outline-2 focus-visible:outline-[var(--sr-accent)]"
                          >
                            <div className="text-sm font-medium text-[var(--sr-ink)] group-hover:text-[var(--sr-accent)]">
                              {sub.name}
                            </div>
                            <div className="text-xs text-[var(--sr-muted)] mt-0.5 line-clamp-1">
                              {sub.description}
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 pt-2.5 border-t border-[var(--sr-rule)]">
                      <Link
                        href={`/topics/${category.slug}`}
                        onClick={() => setOpenCategoryId(null)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--sr-accent)] hover:text-[var(--sr-accent-hover)] focus-visible:outline-2 focus-visible:outline-[var(--sr-accent)]"
                      >
                        <span>Explore all {category.name}</span>
                        <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
