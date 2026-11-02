import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/site/SiteHeader";
import Footer from "@/components/site/Footer";
import { DESIGN_TOKENS, READING_MEASURE_PRESETS } from "@/lib/design/tokens";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  routeType: "about",
  pathname: "/about",
  description:
    "Original mission, editorial typography system, scientific publishing integrity rules, and Stage A standalone reader architecture for ScientificRadar Web.",
});

export default function AboutPage() {
  return (
    <>
      <SiteHeader />

      <main id="main-content" className="flex-1">
        <article className="site-container py-12 md:py-16">
          <div className="max-w-[var(--sr-reading-max)] mx-auto space-y-10">
            <header className="space-y-4 pb-8 border-b border-[var(--sr-rule)]">
              <div className="text-xs font-semibold uppercase tracking-wider text-[var(--sr-accent)]">
                About the Publication · Editorial Charter
              </div>
              <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[var(--sr-ink)] tracking-tight leading-tight">
                Scientific Clarity Without Oversimplification
              </h1>
              <p className="text-base sm:text-lg text-[var(--sr-ink-secondary)] leading-relaxed">
                ScientificRadar is an independent reader-facing publication
                designed for long-form science journalism, mechanistic
                explainers, and rigorous research digests.
              </p>
            </header>

            <section className="space-y-4 font-editorial text-[var(--sr-ink)] leading-[1.72] text-[17px]">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                Editorial Philosophy &amp; Visual Architecture
              </h2>
              <p>
                Modern scientific communication frequently forces readers to
                choose between dense primary literature behind paywalls and
                superficial news summaries stripped of physical mechanism.
                ScientificRadar bridges that divide by pairing narrative
                long-form prose with accurate molecular diagrams, constitutive
                equations, comparative data tables, and transparent source
                attribution.
              </p>
              <p>
                Our visual language draws structural inspiration from the
                editorial organization of <em>Knowable Magazine</em>, the
                generous reading margins of <em>Quanta Magazine</em>, and the
                transparent citation and figure-credit discipline of{" "}
                <em>Nature</em>—executed through an entirely original
                ScientificRadar component architecture, custom SVG vector
                diagrams, and centralized design tokens.
              </p>
            </section>

            {/* Turkish & Multilingual Glyph Support Proof */}
            <section className="p-6 rounded-sm bg-[var(--sr-surface)] border border-[var(--sr-rule)] space-y-3">
              <h2 className="font-editorial text-lg font-bold text-[var(--sr-ink)]">
                Bilingual &amp; Turkish Typography Verification (latin-ext)
              </h2>
              <p className="font-editorial text-sm text-[var(--sr-ink-secondary)] leading-relaxed">
                <strong>Merriweather Variable / Serif Prose:</strong> Çağdaş
                bilimsel yayıncılıkta ışık, kütleçekim dalgaları, Kuzey Anadolu
                Fay Zonu’ndaki sismik boşluklar ve biyoanorganik oksijen
                taşıyıcılarının (ı, İ, ğ, Ğ, ş, Ş, ö, Ö, ü, Ü, ç, Ç) yüksek
                okunabilirlikle sunulması temel tasarım ilkemizdir.
              </p>
              <p className="font-sans text-xs text-[var(--sr-muted)] leading-relaxed">
                <strong>Inter Interface &amp; Metadata:</strong> All navigation
                labels, timestamps, figure captions, and search filters support
                full Turkish and English character sets via same-origin build
                assets.
              </p>
            </section>

            {/* Centralized Design Tokens Table */}
            <section className="space-y-4">
              <h2 className="font-editorial text-xl font-bold text-[var(--sr-ink)]">
                Centralized Design Tokens (Stage A Defaults)
              </h2>
              <div className="overflow-x-auto border border-[var(--sr-rule)] rounded-sm bg-white">
                <table className="w-full text-left border-collapse font-sans text-xs sm:text-sm tabular-nums">
                  <caption className="p-3.5 text-left font-semibold text-[var(--sr-ink)] bg-[var(--sr-surface)] border-b border-[var(--sr-rule)]">
                    Active CSS Custom Properties in app/globals.css &amp;
                    lib/design/tokens.ts
                  </caption>
                  <thead>
                    <tr className="border-b border-[var(--sr-rule)] bg-[var(--sr-paper)]">
                      <th scope="col" className="py-2.5 px-4 font-semibold">
                        Token Name
                      </th>
                      <th scope="col" className="py-2.5 px-4 font-semibold">
                        Default Value
                      </th>
                      <th scope="col" className="py-2.5 px-4 font-semibold">
                        Editorial Role
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--sr-rule-subtle)]">
                    <tr>
                      <td className="py-2 px-4 font-mono">--sr-page-max</td>
                      <td className="py-2 px-4">{DESIGN_TOKENS.layout.pageMax}</td>
                      <td className="py-2 px-4">Outer magazine grid container</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 font-mono">--sr-reading-max</td>
                      <td className="py-2 px-4">
                        {READING_MEASURE_PRESETS["700"].px} (600px &amp; 560px
                        selectable)
                      </td>
                      <td className="py-2 px-4">Long-form serif reading column</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 font-mono">--sr-figure-max</td>
                      <td className="py-2 px-4">{DESIGN_TOKENS.layout.figureMax}</td>
                      <td className="py-2 px-4">Wide scientific figures &amp; tables</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 font-mono">--sr-paper / --sr-ink</td>
                      <td className="py-2 px-4">
                        {DESIGN_TOKENS.colors.paper} / {DESIGN_TOKENS.colors.ink}
                      </td>
                      <td className="py-2 px-4">Archival warm paper &amp; deep ink</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 font-mono">--sr-accent</td>
                      <td className="py-2 px-4">{DESIGN_TOKENS.colors.accent}</td>
                      <td className="py-2 px-4">Restrained scientific teal</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Transparent Stage A Isolation & Honesty Notice */}
            <section className="space-y-3 pt-4 border-t border-[var(--sr-rule)] text-sm text-[var(--sr-ink-secondary)] leading-relaxed">
              <h2 className="font-editorial text-xl font-bold text-[var(--sr-ink)]">
                Stage A Architecture &amp; Data Provenance
              </h2>
              <p>
                <strong>ScientificRadar Web</strong> operates as an independent
                Next.js App Router application completely decoupled from the{" "}
                <em>ScientificRadar Studio</em> editorial CMS. During Stage A,
                all articles, author profiles, and SVG scientific figures are
                served from a strongly typed in-memory demonstration repository
                (<code>lib/content/repository.ts</code>).
              </p>
              <p>
                No synthetic DOIs, unverified peer-review claims, external live
                CMS calls, or third-party copyrighted media are used. Search
                engine indexing is disabled via <code>robots: noindex</code>{" "}
                until future server-authenticated publishing integration is
                authorized.
              </p>
              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  href="/article/spider-silk-hierarchical-protein-mechanics"
                  className="px-4 py-2 bg-[var(--sr-accent)] text-white text-xs font-semibold uppercase tracking-wider rounded-sm"
                >
                  Read Anchor Feature #1 (Spider Silk)
                </Link>
                <Link
                  href="/article/respiratory-pigments-evolutionary-biochemistry"
                  className="px-4 py-2 bg-white border border-[var(--sr-rule)] text-[var(--sr-ink)] text-xs font-semibold uppercase tracking-wider rounded-sm hover:border-[var(--sr-accent)]"
                >
                  Read Anchor Feature #2 (Blood Pigments)
                </Link>
              </div>
            </section>
          </div>
        </article>
      </main>

      <Footer />
    </>
  );
}
