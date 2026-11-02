# ScientificRadar Web — Build, Architecture & Six-Cycle Verification Audit (`WEBSITE_BUILD_AUDIT.md`)

**Date:** 2026-11-02  
**Application Name:** ScientificRadar Web (`metadata.json` -> `"ScientificRadar Web"`)  
**Framework & Stack:** Next.js 15.4.9 (App Router, SSR/SSG Enabled) · React 19.2.1 · TypeScript 5.9.3 (`strict: true`) · Tailwind CSS 4.1.11  
**Source Specifications Reviewed:**
1. `SCIENTIFICRADAR_PUBLIC_WEBSITE_DESIGN_BLUEPRINT_2026-11-02.md` (v2.1 — read completely from `/public/assets/aistudio/SCIENTIFICRADAR_PUBLIC_WEBSITE_DESIGN_BLUEPRINT_2026-11-02_65ffc7f1.md`)
2. `GOOGLE_AI_STUDIO_NEW_WEB_APP_MISSION_2026-11-02.md` (v1.1 — read completely from `/public/assets/aistudio/GOOGLE_AI_STUDIO_NEW_WEB_APP_MISSION_2026-11-02_bfdff218.md`)

---

## 0. Attachment & Provenance Disclosure

- **Read Documents:** Both primary Markdown specifications (`Blueprint v2.1` including §15 Codex Phase 2 forensic measurements and `Mission v1.1`) were attached in `/public/assets/aistudio/` and read in full prior to writing code.
- **Screenshot Attachments Status:** No PNG/JPG screenshot files of Knowable Magazine or Quanta Magazine were attached in `/public/assets/aistudio/` in this AI Studio session. In strict compliance with Mission §0 and §12 (*"If images have not been attached in this AI Studio conversation, say so and proceed only from the written spec, explicitly recording the limitation"*), we did not pretend screenshot files were attached and instead built the visual hierarchy directly from the written Blueprint v2.1 specifications and the measured Codex REA telemetry in Blueprint §15.
- **Project Isolation:** This is a brand-new standalone Google AI Studio application (`ScientificRadar Web`). Zero code, IndexedDB schemas, or editor packages (`CKEditor`/`Tiptap`) from `Centaurioun/scientificradar-studio` were imported or modified.

---

## 1. Executed Build, Lint, Test & Browser Verification Commands

| Check | Exact Command | Exit Code | Observed Result |
| --- | --- | --- | --- |
| Unit Tests (`node:test`) | `npx --yes tsx --test lib/content/repository.test.ts` | `0` | **PASS** (7/7 tests passed: fixture inventory >= 8, draft exclusion, Turkish character search `ı İ ğ Ğ ş Ş ö Ö ü Ü ç Ç`, empty query state, zero synthetic DOIs, canonical HTML sanitizer & inner H1 demotion, deterministic date formatting) |
| ESLint & TypeScript Lint | `npm run lint` (`eslint .`) | `0` | **PASS** (0 errors, 0 warnings) |
| Production Next.js Build | `npm run build` (`compile_applet`) | `0` | **PASS** (Next.js App Router SSR/SSG compilation succeeded cleanly) |
| Headless Chromium Browser Verification | `playwright-cli` across `1440×900`, `1024×768`, `390×844`, `320×700` | `0` | **PASS** (0 console errors, 0 warnings, `scrollWidth === innerWidth` across all 4 viewports after Round 1 fixes) |

---

## 2. Font Delivery & Turkish Glyph Verification (`WEB-FONT-01` / `WEB-10`)

- **Configuration:** Configured in `app/layout.tsx` using `next/font/google` (`Merriweather` weights `300, 400, 700, 900` normal/italic -> `--font-editorial`; `Inter` weights `400, 500, 600, 700` -> `--font-interface`) with `subsets: ["latin", "latin-ext"]` and `display: "swap"`.
- **Network Verification (`playwright-cli requests --static`):**
  - Next.js downloaded and self-hosted all WOFF2 font files at build time and served them from the **same origin** (`http://localhost:3000/_next/static/media/*.woff2` returning HTTP `200 OK`, including `027647acf05c7ff8-s.p.woff2`, `1f3fe8c6df3d47c1-s.p.woff2`, `82050c55ac1c8c11-s.p.woff2`, `8e9860b6e62d6359-s.p.woff2`, `d49d832fa01eb618-s.p.woff2`, `e4af272ccee01ff0-s.p.woff2`, `19cfc7226ec3afaa-s.woff2`).
  - **Zero runtime requests** were made to `fonts.googleapis.com` or `fonts.gstatic.com`.
- **Turkish Glyph Verification:** Verified via `/article/north-anatolian-fault-aseismic-creep-geodesy` (*"Kuzey Anadolu Fay Zonu'nda Asismik Kayma, Kabuksal Deformasyon ve Sismik Boşlukların Jeodezik Analizi"*) and `/about` testing `ı, İ, ğ, Ğ, ş, Ş, ö, Ö, ü, Ü, ç, Ç`.
- **Math Typography Independence:** Equations use `.font-math` (`"KaTeX_Main", "Latin Modern Math", "STIX Two Math", "Cambria Math", Georgia, serif`) and preserve raw TeX in `data-tex`, preventing Merriweather from distorting mathematical symbols.

---

## 3. Reading Column Width Comparison: `700px` vs. `600px` (and `560px` Benchmark)

Per the owner's instruction (*"Compare 600px and 700px article reading widths using rendered screenshots. Keep typography, spacing, colors and layout parameters easy to change"*):

| Reading Measure Preset | URL / Selector | Measured `.article-prose` Width (`1440×900`) | Visual & Typographic Assessment | Screenshot Artifact |
| --- | --- | --- | --- | --- |
| **700px (Owner Default)** | `/article/spider-silk-hierarchical-protein-mechanics?measure=700` | `700px` (`scrollWidth: 1440`) | Renders ~68–74 characters per line at `clamp(17px, 1.25vw, 19px)` Merriweather with `1.72` line-height. Feels spacious and authoritative alongside `1100px` breakout figures and scientific tables. | `.aistudio/artifacts/computer_use/article-700px-1440.png` & `prose-comparison-700px-1440.png` |
| **600px (Comparison Variant)** | `/article/spider-silk-hierarchical-protein-mechanics?measure=600` | `600px` (`scrollWidth: 1440`) | Renders ~58–64 characters per line. Increases horizontal margin whitespace between the left outline rail (`220px`) and central text, creating a tighter book-like vertical cadence and stronger visual contrast when `1100px` wide figures break out of the column. | `.aistudio/artifacts/computer_use/article-600px-1440.png` & `prose-comparison-600px-1440.png` |
| **560px (Quanta Reference Benchmark)** | `/article/spider-silk-hierarchical-protein-mechanics?measure=560` | `560px` (`scrollWidth: 1440`) | Included as an interactive third toggle option in `ArticleReader.tsx` matching Blueprint §15.1 (`560px` inner prose width observed on Quanta). | Selectable via header control bar on any article page |

---

## 4. Original Media & Licensing Ledger (`WEB-LIC-01`)

Zero third-party photos, Knowable/Quanta illustrations, or external image hosts (`unsplash`, `picsum`) are used in the application. Every visual asset is an original SVG scientific schematic authored specifically for `ScientificRadar Web` in `/public/images/demo/`:

| Asset Path | Archive ID | Subject | License |
| --- | --- | --- | --- |
| `/images/demo/spider-silk-hierarchy.svg` | `FIG-SR-2026-01` | Spidroin micelle storage, hyperbolic tapering duct acidification, and beta-sheet nanocrystals | CC0 1.0 Public Domain (Original Demo Vector) |
| `/images/demo/spider-silk-stress-strain.svg` | `FIG-SR-2026-01B` | Comparative engineering stress–strain profiles (Dragline silk vs. Kevlar 49 vs. Steel) | CC0 1.0 Public Domain (Original Demo Vector) |
| `/images/demo/animal-blood-pigments.svg` | `FIG-SR-2026-02` | Four-panel bioinorganic coordination of Hemoglobin, Hemocyanin, Chlorocruorin, and Hemerythrin | CC0 1.0 Public Domain (Original Demo Vector) |
| `/images/demo/oxygen-affinity-curves.svg` | `FIG-SR-2026-02B` | Hill cooperative oxygen equilibrium dissociation isotherms ($P_{50}$ and $n_H$) | CC0 1.0 Public Domain (Original Demo Vector) |
| `/images/demo/anatolian-tectonic-gps.svg` | `FIG-SR-2026-03` | North Anatolian Fault Zone GNSS velocity vectors and İsmetpaşa aseismic creep (Turkish labels) | CC0 1.0 Public Domain (Original Demo Vector) |
| `/images/demo/quantum-topological-braiding.svg` | `FIG-SR-2026-04` | Non-Abelian anyon worldline braiding on a 2D superconducting lattice | CC0 1.0 Public Domain (Original Demo Vector) |
| `/images/demo/deep-sea-hydrothermal-vent.svg` | `FIG-SR-2026-05` | Alkaline hydrothermal chimney $\text{Fe(Ni)S}$ proton gradient and $\text{CO}_2$ reduction | CC0 1.0 Public Domain (Original Demo Vector) |
| `/images/demo/crispr-epigenetic-silencing.svg` | `FIG-SR-2026-06` | Catalytically inactive dCas9-DNMT3A/KRAB epigenetic silencing without DNA cleavage | CC0 1.0 Public Domain (Original Demo Vector) |
| `/images/demo/polar-stratospheric-aerosols.svg` | `FIG-SR-2026-07` | Stratospheric sulfate aerosol optical depth and bipolar ice-core $\Delta^{33}\text{S}$ spikes | CC0 1.0 Public Domain (Original Demo Vector) |
| `/images/demo/neuromorphic-synaptic-array.svg` | `FIG-SR-2026-08` | Memristive crossbar array performing analog matrix-vector multiplication | CC0 1.0 Public Domain (Original Demo Vector) |
| `/images/demo/open-science-reproducibility.svg` | `FIG-SR-2026-09` | Two-stage Registered Reports peer review and deterministic reproducibility pipeline | CC0 1.0 Public Domain (Original Demo Vector) |
| `/images/demo/solid-state-electrolyte-interface.svg` | `FIG-SR-2026-10` | Argyrodite $\text{Li}_6\text{PS}_5\text{Cl}$ solid-state electrolyte and $\text{Ag–C}$ interlayer | CC0 1.0 Public Domain (Original Demo Vector) |

---

## 5. End-to-End Acceptance Matrix (`WEB-HOME-01` – `WEB-PUBLISH-01` & `WEB-01` – `WEB-12`)

| Test ID | Requirement | Status | Verified Evidence |
| --- | --- | --- | --- |
| `WEB-HOME-01` / `WEB-01` | Desktop home masthead, hero, 3-col grid, most-read demo rail, spotlights, and footer render from typed fixtures | **PASS** | Verified on `/` at `1440×900` (`home-desktop-1440.png`). Includes standard & compact hero switcher (`/?hero=compact`). |
| `WEB-NAV-01` / `WEB-02` | Category label navigates directly to filtered topic landing page | **PASS** | Clicking `Biology` link navigated directly to `http://localhost:3000/topics/biology`. |
| `WEB-NAV-01` / `WEB-03` | Independent chevron button opens submenu; `Escape` closes and restores focus; outside click closes | **PASS** | Clicking `Physics subcategories` set `aria-expanded="true"` and revealed region (`nav-dropdown-open-1440.png`); pressing `Escape` set `aria-expanded="false"` and returned `document.activeElement` to the chevron button. |
| `WEB-MOB-01` / `WEB-04` | Mobile menu/accordion works at `390px` and `320px` without horizontal overflow | **PASS** | Verified at `390×844` (`scrollWidth: 390 === innerWidth: 390`, `mobile-menu-accordion-390.png`) and `320×700` (`scrollWidth: 320 === innerWidth: 320`). |
| `WEB-ARTICLE-01` / `WEB-05` | Single `H1` per article, readable long-form Merriweather prose, `H2`/`H3` hierarchy, author/date metadata | **PASS** | Verified `document.querySelectorAll('h1').length === 1` on `/article/spider-silk-hierarchical-protein-mechanics`, `/article/respiratory-pigments-evolutionary-biochemistry`, and `/article/north-anatolian-fault-aseismic-creep-geodesy`. |
| `WEB-06` | Captioned figures include accurate demo/original credits; wide figures break out (`1100px`) on desktop and stay fluid on mobile | **PASS** | Lead & wide figures measure `1100px` at `1440×900` and scale fluidly at `390px` and `320px` with zero distortion. |
| `WEB-07` | References are actionable with back-links; never fabricate synthetic DOIs as real | **PASS** | Unit test #5 and DOM inspection confirmed all fixture sources have `isIllustrativeDemo: true` and `doi: undefined`. |
| `WEB-SEARCH-01` / `WEB-08` | Search returns matching stories, supports empty state, and handles Turkish diacritics (`ı, İ, ğ, ş, ö, ü, ç`) | **PASS** | `/search?q=%C4%B0smetpa%C5%9Fa` and `/search?q=ismetpasa` both return `1 story found`; `/search?q=nonexistent_xenobiology_999` renders `data-testid="search-empty-state"`. |
| `WEB-09` | Topic filter, related stories, `/about`, and 404 routes work properly | **PASS** | Verified `/topics`, `/topics/biology`, `/topics/chemistry?sub=bioinorganic-chemistry`, `/about`, and HTTP `404` on `/article/unknown-nonexistent-slug`. |
| `WEB-FONT-01` / `WEB-10` | Merriweather/Inter self-hosted delivery & Turkish character rendering | **PASS** | 7 same-origin `/_next/static/media/*.woff2` requests verified with HTTP `200 OK`; zero external Google Fonts runtime calls. |
| `WEB-TEST-01` / `WEB-11` | Zero HTML/JS console errors across desktop (`1440`), tablet (`1024`), mobile (`390`), and stress (`320`) | **PASS** | Verified in Round 2 after fixing the 1px flex input overflow at `1024×768` and adding `suppressHydrationWarning` to inputs. |
| `WEB-SEO-01` / `WEB-ISOLATE-01` / `WEB-PUBLISH-01` / `WEB-12` | Safe `noindex` demo semantics, standalone app isolation, no live CMS or production services connected | **PASS** | `<meta name="robots" content="noindex, nofollow, nocache">` verified in DOM; newsletter demo validates locally without storing/sending emails. |

---

## 6. Six-Cycle Iterative Refinement Record (Executed on Actual Build)

### Cycle 1 — Visual Design & Editorial Rhythm
- **Inspection:** Evaluated desktop (`1440×900`) and mobile (`390×844`) renders of `/` and `/article/[slug]`.
- **Findings:** Confirmed Knowable-inspired centered `ScientificRadar` masthead, restrained teal accent (`#15747B`) on warm archival paper (`#FAFAF8`), zero-pill unboxed metadata kickers (`BIOLOGY · LEAD FEATURE`), and crisp custom SVG scientific diagrams. Added an interactive `Standard Cover` / `Compact Cover` hero toggle on the homepage (`/?hero=compact`) so the project owner can evaluate both hero proportions.

### Cycle 2 — Information Architecture & Hybrid Navigation
- **Inspection:** Tested all primary routes (`/`, `/article/[slug]`, `/topics`, `/topics/[slug]`, `/search`, `/about`, and `404`), desktop category links vs. adjacent chevron buttons, and mobile drawer accordions.
- **Findings:** Confirmed that clicking a category label navigates directly to `/topics/[slug]`, whereas clicking the adjacent chevron button toggles the subcategory region (`aria-expanded="true"` -> `"false"` on `Escape` with focus returned to the trigger button), avoiding the Quanta reference menu `Escape` limitation noted in Blueprint §15.1.

### Cycle 3 — Scientific Reading Experience & 700px vs. 600px Comparison
- **Inspection:** Tested three complete scientific articles (`spider-silk-hierarchical-protein-mechanics`, `respiratory-pigments-evolutionary-biochemistry`, and `north-anatolian-fault-aseismic-creep-geodesy`) with `H1` -> `H2` -> `H3` hierarchy, inline `[1]` citations (`data-citation-source-id`), equations (`data-tex`), wide `1100px` figures, and comparison tables (`tabular-nums`).
- **Findings:** Implemented an interactive reading width switcher (`700px` | `600px` | `560px`) synchronized with `?measure=700|600|560` and captured side-by-side screenshots (`prose-comparison-700px-1440.png` and `prose-comparison-600px-1440.png`) at identical scroll positions.

### Cycle 4 — Responsive UX, Accessibility & 320px/1024px Overflow Audit
- **Inspection:** Measured `document.documentElement.scrollWidth` vs. `window.innerWidth` across `1440×900`, `1024×768`, `390×844`, and `320×700` without using global `overflow-x: hidden`.
- **Defect Found in Round 1:** At `1024×768`, `scrollWidth` measured `1025px` (`1px` wider than `1024px` viewport). Element bounding-box inspection (`overflowingEls`) pinpointed the `<input className="flex-1 ...">` inside `NewsletterDemo.tsx`'s `lg:col-span-5` flex row, which lacked `min-w-0`.
- **Fix Applied & Verified in Round 2:** Added `min-w-0` to the flex input in `NewsletterDemo.tsx`. Re-tested at `1024×768`: `scrollWidth === 1024` and `innerWidth === 1024` on both homepage and article pages.

### Cycle 5 — Performance, Font Network & Console Cleanliness
- **Inspection:** Checked `playwright-cli requests --static` and `playwright-cli console`.
- **Defects Found in Round 1:**
  1. Next.js logged a development scroll warning because `<header>` had `sticky top-0` as a direct child of `<body>`.
  2. Headless Chromium screenshot caret-hiding (`style="caret-color: transparent"`) triggered a React hydration attribute warning on `<input>` elements during rapid automated navigation.
- **Fixes Applied & Verified in Round 2:** Changed `<header>` to natural document flow (`relative z-40`), added `suppressHydrationWarning` to search and newsletter `<input>` elements, and set deterministic copyright year `2026` in `Footer.tsx`. Re-ran `playwright-cli console`: **0 errors, 0 warnings**.

### Cycle 6 — Adversarial Verification
- **Inspection:** Tested edge cases including:
  - Unpublished draft leak prevention (Unit Test #2: `status: "draft"` records are rejected by `isPubliclyVisibleArticle`).
  - Nested `<h1>` injection and XSS attempt in `sanitizeCanonicalBodyHtml` (Unit Test #6: `<script>` and `onclick` stripped; inner `<h1>` demoted to `<h2>`).
  - Turkish uppercase/lowercase diacritic search (`İsmetpaşa` vs `ismetpasa bosluk`).
  - Zero-result search query (`/search?q=nonexistent_xenobiology_999`).
  - Nonexistent article slug (`/article/unknown-nonexistent-slug` -> HTTP `404` with helpful recovery navigation).

---

## 7. Known Limitations & Next Stage Gates

1. **Reference Screenshots Not Attached in This Chat:** As documented in Section 0, Knowable and Quanta screenshot image files were not uploaded into `/public/assets/aistudio/` in this session; visual hierarchy was implemented from the detailed Blueprint v2.1 text and §15 Codex REA measurements.
2. **Stage A In-Memory Demo Repository:** Content is served from `lib/content/repository.ts` (`InMemoryDemoContentRepository`). Live connection to `ScientificRadar Studio` is intentionally deferred to Stage C per Blueprint §2 and §10.
3. **GitHub Repository Sync (`Centaurioun/scientificradar-web`):** Creating and pushing to a new external GitHub repository requires the owner to trigger Google AI Studio's native GitHub export/sync UI and authorize the target repository name (`Centaurioun/scientificradar-web`). No commit was pushed to `Centaurioun/scientificradar-studio`.
