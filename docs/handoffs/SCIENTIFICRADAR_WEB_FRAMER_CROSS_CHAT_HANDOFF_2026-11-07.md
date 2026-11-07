# ScientificRadar Web + Framer — New Chat / New Agent Complete Handoff
**Snapshot:** 2026-11-07 (Europe/Istanbul)
**Maintainer:** ScientificRadar owner and assisting ChatGPT / Codex agents
**Purpose:** Make a fresh ChatGPT instance continue the exact scientific website design and Framer experimentation project without asking the owner to repeat decisions.
**Document type:** Context transfer, verified status snapshot, next-phase execution contract. **NOT** approval to publish, merge new features, change DNS or introduce paid dependencies.
**Update policy:** Verify mutable GitHub/Framer/CI state afresh before acting; this snapshot is a historic record of 2026-11-07.

---

## 0. READ THIS FIRST — CURRENT EXECUTION POINT

**Where we stopped:** The owner authorized autonomous design experimentation in Framer. ChatGPT **created three new interactive, unpublished ScientificRadar-wide Framer laboratories**, each with two variants; visually inspected and iteratively refined them; and then offered a single Codex handoff prompt. The owner now wants a new ChatGPT conversation that can pick up **at this precise point**.

**New labs, all confirmed present in Framer project:**
1. `Editorial Homepage Lab`, node `lB6PwBvhQ`, variants **A Compact Editorial** and **B Editorial Rhythm**.
2. `Topic Discovery Lab`, node `sNtz29BzD`, variants **A Discipline Directory** and **B Research Explorer**.
3. `Search & Navigation Lab`, node `usIBUa94C`, variants **A Focused Search** and **B Guided Navigation**.

All three pages use the project's **unpublished Framer main branch** and have the 1200/810/390/320 responsive variant frames and `noIndex` metadata. Code-component source was read on 2026-11-07 and exists as:
- `EditorialHomepageLab.tsx` (20,657 chars);
- `TopicDiscoveryLab.tsx` (22,373 chars);
- `SearchNavigationLab.tsx` (28,732 chars).

**What has NOT yet happened:** There is no completed independent Playwright/Brave interaction QA for these **three new** labs, no final owner approval of the six alternative designs, and **no migration of these new three site-wide lab designs to ScientificRadar Web**. All three labs are Framer-only experiments. Do not assume screenshots/Framer code compilation mean end-to-end PASS. Do not start a new broad brainstorm or silently implement them in Web.

**Immediate next step:** Confirm the three lab versions in Framer, then coordinate **targeted independent Codex/Playwright QA** of their six layout modes at four widths. Report findings, fix demonstrated **Framer-only** problems without replacing approved designs, and present owner-review links/comparison. **Only after owner explicitly approves the site-wide designs** prepare a separate Web implementation PR. Do not merge that PR until owner explicitly authorizes merging. The owner asked not to be interrupted with serial, already-answered preference questions.

**Important distinction:** A *previous* feature family (four scientific article-reader labs) **WAS** implemented in Web and owner-authorized PR #52 **WAS MERGED**. Do not redo that work as if it is pending. The **new** homepage/topic/search Framer labs have NOT been merged.

---

## 1. OWNER'S INTENT, COLLABORATION STYLE AND WORKING CONTRACT

### What the owner wants
- Build an **original, scientifically credible, visually sophisticated public science magazine**, ScientificRadar Web, alongside a separate editorial CMS, ScientificRadar Studio.
- Use Framer as a **free/disposable experimental design environment** for UX layouts, interactions and ideas; keep the final public site on the owner-controlled Next.js/React codebase. **No ongoing Framer subscription, license enforcement workaround, runtime embedding or platform lock-in.**
- Evaluate/iterate ideas independently, preferably a **six-cycle iterative-refinement process**. The owner explicitly delegated intermediate design decisions to ChatGPT and said **do not ask for approval after each small improvement**.
- First let ChatGPT build and refine useful Framer concepts; then use Codex as a second reviewer/testing collaborator. Codex can inspect an authorized Brave browser and Framer Preview with Playwright in its **own** environment; ChatGPT and Codex must not claim equivalent tools if those tools are unavailable.
- **Final owner approval before migrating these new Framer site-wide concepts into Web `main`**. Before that: prototype and QA in Framer; optionally draft review documents/PRs only when useful and approved. This is different from the explicitly approved and merged earlier article-reader integration.
- Prefer **short, decisive Turkish updates** with specific results, evidence, and direct links. Avoid giant prompts at every step; provide one clear actionable Codex prompt when needed. Technical names stay in English.
- Ruthless and critical scientific/editorial judgment: challenge weak ideas, unnecessary complexity, fabricated impact claims or design regressions. No sycophantic consensus.
- Do not repeatedly ask the owner questions whose answers are in this handoff. At meaningful final review points ask for *one overall approval*, not repeated micro-approvals.

### Collaboration with Codex through ChatGPT conversation
- The owner provided a link to this source ChatGPT conversation and would like Codex to continue exchanging technical messages there, in effect acting as intermediary. **A ChatGPT conversation URL alone does not guarantee that Codex can read or write the private conversation.** Codex must first check authenticated browser access and actual interaction permissions. If unavailable, Codex should return a concise report in its own session for the owner to paste; never pretend to have posted a message here.
- This handoff is designed to be sufficient **without** loading the original private conversation. Do not copy the private ChatGPT URL or user authentication/session information into public GitHub documentation.
- A Codex prompt for the immediate QA is in Section 13. The owner can give it to Codex; subsequent conversation should be based on the evidence Codex actually returns.

### Authorization / boundaries
- Safe now: inspect GitHub; inspect or refine isolated Framer experimental pages; analyze/compare; prepare QA guidance and screenshots; test interactions.
- NOT authorized now: merge *new site-wide lab* designs into Web `main`, publish Framer site, change DNS/Cloudflare/domain, deploy to production, change Studio, create paid account/service or implement Framer/Unframer payment bypass. Do not delete or rebuild old working labs. No modification of existing owner-local dirty worktrees.
- Do not mistake a Github PR creation for production release. Code merged to `main` is NOT proof that `scientificradar.com` deployment updated.
- For this handoff only: documentation-only branch and draft PR; no application code changes, no Framer changes required.

---

## 2. PROJECT MAP AND SOURCES OF TRUTH

### Repositories
- **Public website:** https://github.com/Centaurioun/ScientificRadar-web
  - Default branch: `main`.
  - Verified `main` HEAD on 2026-11-07: `e7b74cc85bcf6e293e2bac799927783ef9a9aa16`.
  - This is the **squash merge commit for PR #52**.
  - App: Next.js 15 App Router, React 19, TypeScript, Tailwind CSS, KaTeX, DOMPurify; Playwright; current `package.json` declares `@playwright/test` 1.64.1.
- **Editorial CMS:** https://github.com/Centaurioun/scientificradar-studio
  - Separate app, not part of the website's active Framer experiment.
  - Major Tiptap/ProseMirror-style scientific editing, drafts/review/SEO/media/figures/sources capabilities have existed in prototypes. **Do not infer a currently operational Studio-to-Web production publishing API** from these UIs.
  - Studio's IndexedDB/local editorial prototype is NOT the public site's source database.

### Design authority (read before changing branding)
1. **Owner-approved visual baseline:** https://github.com/Centaurioun/ScientificRadar-web/blob/main/docs/design/OWNER_VISUAL_BASELINE_AND_KNOWLEDGE_LINKS.md
2. **Public website design blueprint (Studio repo):** https://github.com/Centaurioun/scientificradar-studio/blob/main/docs/public-website/SCIENTIFICRADAR_PUBLIC_WEBSITE_DESIGN_BLUEPRINT_2026-11-02.md
3. **Website architecture/launch roadmap:** https://github.com/Centaurioun/ScientificRadar-web/blob/main/docs/roadmap/SCIENTIFICRADAR_WEB_MASTER_ROADMAP.md
4. **Current Web code and tests:** always inspect latest `main`, do not blindly rely on dated roadmap commit SHAs.
5. **Framer source and component tree:** primary evidence for experimental designs (see below).

### Approved visual identity / science-integrity constraints
- Warm paper `#FAFAF8`, secondary surface `#F2F1EC`, restrained teal accent (common lab value `#15747b`), dark readable ink. **No arbitrary pure-white / brutalist / flashy rebrand.**
- Merriweather editorial serif and Inter interface sans-serif; calm scientific-magazine rhythm.
- Compact Cover is preferred home hero baseline; oversized permanent billboard hero is not.
- Original scientific SVG figures, accurate caption, attribution/licence, real source relationships. **Do not swap them for generic stock images**; avoid crop/cover that obscures scientific labels in SVGs.
- Reader: good typographic measure and spacing; equations with legible KaTeX inside warm card; tables with units, captions, footnotes; accessible citations and DOI only if authentic.
- Desktop categories should be keyboard/touch accessible; on mobile use meaningful touch navigation; no hover-only access.
- No fake “popular”, “trending”, peer-review claims, invented DOI, user activity numbers, traffic metrics, or scientific measurements.
- Historical README/roadmap may describe proposed features already implemented in `main`. Verify first.

### Current public-facing routes / content
- `/` home; `/topics`; `/topics/[slug]`; `/search`; `/article/[slug]`; `/about`.
- Actual current Web repository has `app/page.tsx`, article/card/layout components, routes and tests.
- Read `lib/content/repository.ts`, `lib/content/fixtures.ts` and `lib/content/types.ts`. The public app currently uses in-memory demonstration articles, with draft/public separation; live Studio publication integration is a future controlled stage.
- The ten demo stories span **7 disciplines / 17 subfield taxonomy entries** and kinds News, Feature, Explainer, Research digest. **These counts characterize this Framer development-fixture snapshot, not a public-archive KPI.**
- Demo article examples: Spider Silk Nanocomposite Fiber; Oxygen Carrier Pigments; North Anatolian Fault Aseismic Creep; Non-Abelian Anyons; Prebiotic Proton Gradients; dCas9 Epigenetic Silencing; Polar Ice Sulfate; Solid-State Battery Interfaces; Memristive Crossbars; Registered Reports.
- Any story title, source, credit, DOI, dates, article-type and category relationship should come from the verified content model rather than made-up data. New Framer experiments currently include curated copies/transcriptions of demo content in their code; **confirm exact metadata with the Web fixtures before production migration**.

---

## 3. IMPORTANT COMPLETED WORK — ARTICLE READER HISTORY (DO NOT REPEAT)

### Four original Framer reader laboratories (exist; not the current work focus)

| Lab | Page node | Framer code file | Path |
| --- | --- | --- | --- |
| Scientific Figure Lab | `OFNHTB3Jx` | `ScientificFigureLab.tsx` | `/figure-lab` |
| Citation Interaction Lab | `sHFu4J1jX` | `CitationInteractionLab.tsx` | `/citation-lab` |
| Mobile Reading Stress Lab | `EOyWe1e9E` | `MobileReadingStressLab.tsx` | `/reading-stress-lab` |
| Integrated Article Reader Lab | `L0EEZeigV` | `IntegratedArticleReaderLab.tsx` | `/integrated-reader-lab` |

These experiments led to the owner-approved behavior:
- Desktop citation **hover** → ephemeral source preview; click/tap → bibliography anchor, not a second click modal; “Back to article citation” returns focus/position.
- Scientific Figure Inspector with zoom, region jump, dragging and Escape/focus behavior.
- Mobile **Row Focus** table with opt-in Data Matrix, values and units preserved.
- KaTeX equation inspection, variable explanations, accessible modal.
- One article-reading flow composing these without multiple competing modal overlays.

### GitHub PR status on 2026-11-07
- **PR #50:** https://github.com/Centaurioun/ScientificRadar-web/pull/50 — **OPEN, DRAFT**, earlier Framer reader QA mission / static preflight / targeted follow-up docs only. **Not merged.**
- **PR #51:** https://github.com/Centaurioun/ScientificRadar-web/pull/51 — **OPEN, DRAFT**, independent partial Framer E2E QA report, not merged.
  - QA context: original 36-case acceptance matrix; hover, true touch/drag, focus and visual evidence gaps persisted.
  - `C04` scroll-to-citation originally marked historical FAIL; controlled visible real-mouse click at 390/320 reproduced correct focus/return to `y=0` with first click read `y=0.5`. Earlier `locator.click()` automatic scroll was a credible false-FAIL confound. **Updated C04 is BLOCKED for remaining [2]/[3]/nonzero/panel-after scenarios**, not globally PASS.
  - QA report may still show stale `14 PASS / 1 FAIL / 21 BLOCKED` summary despite concluding new C04 BLOCKED. **Do not reproduce the inconsistent headline as a current accepted tally**; per-ID re-evaluation would be `14 PASS / 0 FAIL / 22 BLOCKED` if all other statuses remain unchanged; historical FAIL retained as separate evidence.
  - Framer editor canvas fallback `Component file does not exist.` was observed for original four reader labs although Framer API found matching code files/instances and Preview rendered. Root cause **unresolved**; do not delete code components to “fix” without diagnosis.
- **PR #52:** https://github.com/Centaurioun/ScientificRadar-web/pull/52 — **CLOSED / MERGED** with owner's explicit request; squash merge SHA `e7b74cc85bcf6e293e2bac799927783ef9a9aa16`.
  - Integrated Figure Inspector, Citation Interactions, mobile row-focused Scientific Table, Scientific Equation Inspector into existing `ArticleReader`.
  - Relevant current files: `components/editorial/ArticleReader.tsx`, `FigureInspector.tsx`, `CitationInteractions.tsx`, `ScientificTable.tsx`, `ScientificEquation.tsx`, `ScientificFigure.tsx`, `CitationList.tsx`, `app/globals.css`; responsive and integration Playwright tests.
  - Last pre-merge GitHub Actions Quality and responsive checks passed, **90/90 Playwright**. This is evidence of that commit's CI, NOT proof of production deployment or comprehensive Framer QA.
  - No Framer runtime dependency added to Next.js.
- Owner previously agreed this reader integration meaningfully improved scientific reading. Do not ask again whether reader features should be brought into the app; **they already were.**

---

## 4. FRAMER — THE ACTIVE EXPERIMENTAL ENVIRONMENT

**Canonical project ID:** `boKLyC3EXgf7Nhs9yoC7`. The previous editor project path used in all previews:
`https://framer.com/projects/Scientific-Radar--boKLyC3EXgf7Nhs9yoC7-3fySI`

Framer MCP listed the project as “Scientific Radar”; Framer project main branch is active. Seven lab pages were read directly through Framer API on 2026-11-07. New lab paths/pages all have `noIndex=true` and four responsive frame variants.

**Important:** Framer's base old Home / blog/theme pages remain from the user's abandoned **Denzel** template. These are NOT the new design foundation. The original public `invigorated-technology-885071.framer.app` link is an old published template and is NOT evidence the new labs have been published. **Never publish / replace the live Framer site just to test a lab.** Use authenticated editor `view=preview` with exact node ID. Framer is *design lab*, not final production hosting.

### Seven Framer preview URLs (exact)
- Figure: https://framer.com/projects/Scientific-Radar--boKLyC3EXgf7Nhs9yoC7-3fySI?node=OFNHTB3Jx&view=preview
- Citation: https://framer.com/projects/Scientific-Radar--boKLyC3EXgf7Nhs9yoC7-3fySI?node=sHFu4J1jX&view=preview
- Reading Stress: https://framer.com/projects/Scientific-Radar--boKLyC3EXgf7Nhs9yoC7-3fySI?node=EOyWe1e9E&view=preview
- Integrated Reader: https://framer.com/projects/Scientific-Radar--boKLyC3EXgf7Nhs9yoC7-3fySI?node=L0EEZeigV&view=preview
- **Editorial Homepage (NEW):** https://framer.com/projects/Scientific-Radar--boKLyC3EXgf7Nhs9yoC7-3fySI?node=lB6PwBvhQ&view=preview
- **Topic Discovery (NEW):** https://framer.com/projects/Scientific-Radar--boKLyC3EXgf7Nhs9yoC7-3fySI?node=sNtz29BzD&view=preview
- **Search & Navigation (NEW):** https://framer.com/projects/Scientific-Radar--boKLyC3EXgf7Nhs9yoC7-3fySI?node=usIBUa94C&view=preview

### New lab responsive frame IDs (Framer API verified)
| Lab | 1200 desktop | 810 tablet | 390 phone | 320 narrow |
| --- | --- | --- | --- | --- |
| Editorial Homepage | `KvtJmUtDZ` | `ptZKopOdE` | `Tu8fyok7U` | `CY4Mduo4J` |
| Topic Discovery | `fg6N5aOpG` | `nRRab4fEw` | `LXgy3enNg` | `O31vf5EhV` |
| Search & Navigation | `deacj0Q2Q` | `S9bmoSETM` | `f5DHExDy8` | `BO0YPFsiI` |

**Tool use:** For the official connected Framer app, open existing project ID to get a session, then read Framer code/project tree. Prior ChatGPT session handle (may expire in a fresh conversation) was `as1nYM`; do not assume it persists. Framer code files belong to the Framer project, not to the GitHub Web repository. The Framer editor preview may contain nested iframes; Codex must verify the actual `preview-iframe` document/viewport. Under ChatGPT Chat Browser, open tabs can be read-only; do not claim mouse/Playwright controls unless available. In Framer, screenshots are STATIC evidence and compiler diagnostics are not interactive QA.

**Framer/Unframer history:** Previously explored Framer MCP and a third-party `remorses/unframer` repository. The owner explicitly abandoned any attempt to remove its licensing/payment checks. No code extraction or subscription workaround is part of the project. The desired migration path is **manual reimplementation of approved visual/interaction patterns using native Next.js components**, respecting project design/data contracts.

---

## 5. THE THREE NEW SITE-WIDE LABS — DETAILED CURRENT STATE

### 5.1 Editorial Homepage Lab — `EditorialHomepageLab.tsx` / node `lB6PwBvhQ`
- **A: Compact Editorial** — compact two-column science-cover story, disciplined headline/dek/meta, four distinct latest-story cards, editor-curated rail, more archive stories, discipline filters.
- **B: Editorial Rhythm** — asymmetric prominent visual lead, supporting story tiles and editorial card grid; retains ScientificRadar identity rather than copying Knowable.
- Variants toggled **within the same page** by accessible `aria-pressed` buttons; story cards/cover image open demonstrative story-preview dialog.
- Uses 10 source-inspired demo stories and original SVGs; editor selection is **not traffic-derived popularity**.
- Six-pass iteration fixed scientific SVG crop risk by switching to `object-fit: contain`; restored responsive behavior, and **stopped duplicating homepage story grids when a single discipline is selected**, switching to filtered category results and keeping cross-page consistency.
- User has not yet reviewed/selected A versus B. Both intentionally retained.
- Key design risk for future QA: global no-overflow at 320; card text length; story preview focus return/Tab; discipline switch scrolled to filtered section; SVG label legibility; visual prominence of credible source metadata.
- Do **not** automatically inject the whole Framer homepage into Web: compare with `app/page.tsx` and owner Compact Cover baseline.

### 5.2 Topic Discovery Lab — `TopicDiscoveryLab.tsx` / node `sNtz29BzD`
- **A: Discipline Directory** — 7 science discipline cards; description, actual number of demo articles and subfield counts; selecting discipline opens filtered Explorer.
- **B: Research Explorer** — discipline filter, applicable subfield chips, editorial type, search-within-topic, actual count, newest/A–Z, grid/list, honest no-results, per-story preview drawer.
- Uses 17 total subfield entries and the 10 demonstrative source stories. Cross-disciplinary subfield slugs are mapped from fixture context; **confirm real taxonomy/relationships before final import**.
- Six-pass fixes: on 390/320 scientific SVG cards were causing width overflow; added `min-width:0`, constrained card/image sizing, responsive one-column grid; changed misleading **“0 available subfields” when all disciplines selected** to total 17 across disciplines.
- The lab preserves no-results wording (“no matching demonstration stories” ≠ “no research exists”). No fabricated result counts.
- Unfinished QA: real keyboard/touch filters, selector changes, multiple combinations, zero-results path, drawer focus and Escape, dynamic count consistency, responsive overflow and visible diagram labels.
- Should ultimately be reconciled with the actual Web `/topics` and `/topics/[slug]` structure, **not** a new separate site.

### 5.3 Search & Navigation Lab — `SearchNavigationLab.tsx` / node `usIBUa94C`
- **A: Focused Search** — query box, accessible suggestions combobox/listbox, keyboard arrows, `/` or Ctrl/Cmd+K shortcut, submit, actual local result filter, discipline and editorial format chips, sort, zero-results explanation, story preview.
- **B: Guided Navigation** — meaningful discipline paths and story counts; desktop category dropdowns, mobile drawer and discipline navigation; preview then search within chosen field.
- Uses a local 10-story dataset with explicit keyword terms including names like `İsmetpaşa`; *this is not a production search backend*.
- Final refinements: **Enter with no highlighted suggestion submits the typed query** rather than automatically selecting first suggestion; initial suggestion selection `-1`; refined Turkish text/search handling and mobile swipe hint for discipline strip; removed cramped microcopy in 320 header.
- Potential keyboard/a11y risk: independently verify combobox `aria-activedescendant` / listbox behavior, focus restoration, Tab trap, Escape closure, mobile drawer transitions and click-outside; tests must not equate keyboard autofocus with genuine keyboard operability.
- Search query/hits, category and format need fresh DOM assertion; no zero-result metadata, popularity, provenance or scientific claims should be fabricated.
- Ultimate target is `app/search/page.tsx` and shared Header/Nav components, preserving URL-driven SSR search semantics, not dropping existing SEO/noindex controls.

### Shared technical implementation facts
- All new labs are Framer Code Components in TSX with `addPropertyControls` for initial modes.
- Their CSS/React lives inside Framer and uses source-domain SVG diagrams from ScientificRadar Web's `public/images/demo` paths. SVG imagery is illustrative; source attributes and scientific accuracy are not revalidated in these labs.
- Framer static screenshots were taken at 1200, 810, 390 and 320 for default and alternate initial modes. Problems were discovered by screenshot and code inspections and patched. Framer write diagnostics for latest changes were empty. **Do NOT claim real user interaction/E2E pass.**
- Cross-lab editorial identity is shared: warm paper, Merriweather/Inter, restrained teal, original SVGs and source-aware language. No live analytics/CMS.
- Original reader labs and Framer's old template Home were preserved; no Framer publish or DNS change.

---

## 6. BRAINSTORM / SIX-CYCLE REFINE — DECISIONS ALREADY MADE

The owner originally requested a broad ScientificRadar Web brainstorm and six cycles of refinement. Main reasoning:
1. **Inventory/baseline:** current Web already has a compact hero, nav, search, taxonomy, responsive article reader, citation/figure/math/table. Do not rebuild features merely for novelty.
2. **Divergent idea pool:** homepage visual hierarchy, topic navigation, filters, responsive cards, search, metadata context, editorial pathways, dark mode, visual scrollytelling, AI summaries, personalization, etc.
3. **User journey / science reader fit:** choose the steps a new visitor takes to find and read a reliable science story. Prefer less repetition, stronger information scent and clearer article types.
4. **Scientific integrity & a11y:** no unverified traffic rankings/DOI/measurements, no hover-only essential controls, do not crop SVG science labels; 320 px and keyboard must work.
5. **Engineering value and cost:** prefer experiments transferable to existing Next.js components without Framer subscription. Avoid new backend APIs just for a visual prototype.
6. **Convergence / iteration:** select exactly three reusable labs with two alternatives each; refine by inspecting static render, responsive appearance, basic source behavior and design coherence.

Rejected/deferred: dark mode (low priority now); heavy parallax and scrollytelling (perf/a11y cost); infinite scroll and automated personalization (content/architecture mismatch); algorithmic reliability score and auto-generated AI science summaries (scientific integrity risk); standalone Framer-hosted production site (vendor lock-in); rebuilding existing figure/citation/table features; copying older Denzel Home; overbuilding a separate admin panel in Framer.

**Evidence limits:** These are reasoned product choices and visual QA results; the actual real-user click-through, time-to-find, completion rate, INP/LCP/CLS impact and content discoverability improvements are **hypotheses**. No analytics measurement is available to claim numerical uplift.

---

## 7. SITE-WIDE LABS: QA PRIORITY MATRIX FOR NEXT AGENT / CODEX

Run only on the **three NEW labs**; old reader `PR #51` tests are historical background. Use authorized Brave Framer Preview + real Playwright where available, and scope to the **inner iframe's 1200/810/390/320 CSS-pixel viewport**, not the outer window.

### H — Editorial Homepage
- H01: toggling A↔B actually changes page composition without stale cards/duplicate sections.
- H02: 10 fixture identities/titles and category/meta are scientifically faithful; `Editor selection` not presented as quantitative popularity.
- H03: Cover button/card opens ONE preview; Escape/Close returns focus; no focus trapped behind dialog.
- H04: Discipline tab changes filter and gives meaningful visual scroll; page avoids doubled identical article grids.
- H05: SVG labels visible; no horizontal body overflow at 320, 390; 810/1200 grids don't overlap.
- H06: Reduced-motion, keyboard and screen-reader labels; 44 px-ish touchable controls where appropriate.
- H07: A and B side-by-side evidence including legibility, density, hierarchy, repeated stories and mobile comprehension.

### T — Topic Discovery
- T01: Directory counts match actual fixture dataset (7 disciplines / 10 stories).
- T02: Directory card selects right discipline and Research Explorer shows correct results.
- T03: 17 subfield total shown when All; choosing a subfield filters correctly; empty subfields handled honestly.
- T04: category + kind + search + sort all compose correctly; Reset returns to full set.
- T05: Grid/List and 320 px card SVG/labels responsive; no document-level overflow.
- T06: preview drawer accessible, Escape/click-outside focus restore.
- T07: international/Turkish terms, empty result, long titles and keyboard selection.
- T08: comparisons vs existing Web `/topics` and dynamic `/topics/[slug]`; no redundant routes proposed.

### S — Search & Navigation
- S01: A and B variants switch without losing required navigation functionality.
- S02: input typing + Enter with **no highlighted option** searches typed query (no surprise suggestion selection).
- S03: Up/Down/Enter with highlighted suggestions selects expected story; Escape closes; aria-activedescendant consistent.
- S04: `/` and Ctrl/Cmd+K focus input outside editable controls, not steal a key from active text inputs.
- S05: query + discipline + editorial-type chips + sort produce exact counts; clear button works.
- S06: `İsmetpaşa`, `quantum`, `spidroin` and deliberate nonsense query; spelling/diacritics/empty state.
- S07: desktop dropdown, mobile drawer, outside click, Escape, focus trap and return (390/320).
- S08: navigation discipline to filtered results retains meaningful context, does not silently fabricate route.
- S09: responsive no overflow, no duplicate unrelated header/UI chrome, keyboard focus visible and pointer/touch usable.
- S10: compare existing server/query-parameter search and navigation so prototype does not degrade production semantics.

**Evidence format:** case ID; viewport; actual Framer node; pass/fail/blocked; exact DOM assertion; screenshot/trace if tool supports it; reproduction steps; severity and minimal Framer-only remedy. **BLOCKED** is the only truthful status for untestable hover/drag/touch/etc. Do not substitute synthetic DOM mutations for a real user gesture and call it proven. Preserve existing successful styles.

---

## 8. MEASURING VALUE BEFORE WEB INTEGRATION

Candidate product hypotheses, NOT facts:
- Homepage A/B improves editorial hierarchy and reduces obvious repetition; evaluate first-click selection and story differentiation in a controlled task test.
- Topic Directory/Explorer reduces clicks or errors required to find a specified story in a scientific discipline; evaluate task success and steps, no invented baseline.
- Search/Nav helps users find a known article/term on mobile; evaluate exact query result, mistakes, no-results recovery, keyboard time/task success.
- Production Web implementation must measure accessibility, no document horizontal overflow at 320/390, Web Vitals/LCP/CLS/INP, and baseline behavior regression.
- A Framer screenshot is not a scientific or analytics validation. A demo story is not a live scientific news claim.
- Owner makes the ultimate design tradeoff between A and B after seeing comparable screenshots and interaction evidence.

---

## 9. NEXT EXECUTION SEQUENCE (OWNER DOES NOT WANT SERIAL MICRO-QUESTIONS)

**Phase A — Reorient and verify, without code changes**
1. Read this entire handoff; check latest GitHub `main`/open PRs, current Framer seven pages, and design authority docs.
2. Recognize three new labs are *already built*. Do NOT restart a brainstorm or create more generic labs unless a genuine gap is found.
3. Read the three TSX code components and inspect current Preview 1200/810/390/320; retain the six alternative designs.
4. Review independently: is any obvious duplication or severe mobile/keyboard/content error already known? Separate hypothesis from measured failure.

**Phase B — Independent Codex/Playwright QA**
5. Offer the owner the SHORT ready-to-paste Codex prompt in Section 13, if not yet sent. Owner wants Codex to use the original ChatGPT chat URL if possible; ensure the tool can actually post, otherwise use a pasteable report.
6. Run the H/T/S cases with a real authenticated Framer Preview and the best available Playwright capabilities. Focus on critical user interactions and responsive quality rather than exhausting a 100-case theoretical matrix.
7. ChatGPT reviews Codex observations critically. Prefer targeted Framer-only fixes, then check screenshots/behavior again. Do not create a new experimental branch/site for every minor issue.
8. Ensure owner sees A/B comparisons and their trade-offs. Record owner approval/rejections. **No Web implementation before owner approval of the site-wide prototypes.**

**Phase C — Later, only after owner explicitly approves**
9. Inspect Web's latest current source and create a *separate feature branch/PR* integrating approved patterns into **existing** homepage, topic and search/nav. Transfer behavior and design, not Framer runtime/scraped compiled HTML.
10. Keep original design tokens, semantic content, routing, SEO, source provenance, keyboard/touch behavior; avoid duplicating app-level content models or breaking Studio.
11. Run fresh lint/typecheck/unit/build and real browser E2E for 1200/810/390/320. Test navigation with authentic query params and published/draft filtering; check scientific integrity. Fix verified failures.
12. Only if owner requests, merge new PR into `main`; separate production release/hosting/DNS authorization. Never infer deployment from merge.

### Safe local checkout
Earlier Codex runs found dirty user worktree files (`.gitignore`, `.agents/`, `.ignore`, `PROJECT.md`, `test-results/`) and local branch behind remote. The exact ahead/behind count is time-dependent and historical. **Preserve the owner's edits**; do not hard reset, clean, stash, switch branches destructively or overwrite files. Prefer a separate clean worktree based on freshly fetched `origin/main`.

### Suggested development priorities after QA
1. Home editorial rhythm and distinct storytelling layout.
2. Taxonomy/Topic Explorer that improves findability.
3. Search/navigation enhancements preserving current SSR URL behavior.
4. Shared card/metadata UI consistency, if required by chosen variants.
5. Defer knowledge graph/popovers, newsroom pipelines, personalisation, AI-generated summaries and production launch tasks until separately specified.

---

## 10. STATUS LEDGER — WHAT IS CONFIRMED VS NOT CONFIRMED

| Statement | 2026-11-07 status | Evidence / caution |
| --- | --- | --- |
| Web `main` has reader enhancements | **VERIFIED** | `main` SHA equals merged PR #52 `e7b74c...` |
| Web reader CI at PR #52 | **Historical verified PASS** | Quality and 90/90 responsive Playwright before merge; rerun on changed code |
| Public `scientificradar.com` serves those features | **NOT VERIFIED** | No authoritative deployment check in this workflow |
| Three new Framer pages exist | **VERIFIED** | Framer component/tree reads; IDs in Section 4 |
| Each new lab has two alternatives | **VERIFIED in source** | TSX controls and variant labels |
| New labs have four responsive frames | **VERIFIED in Framer tree** | `1200/810/390/320` frames |
| New labs compile and screenshot | **Observed, not end-to-end** | Framer returned empty code diagnostics and static screenshots during last build |
| New labs pass browser E2E | **NOT RUN/NOT VERIFIED** | Next Codex task |
| Owner selected final A/B variants | **NOT YET** | Final overall approval pending |
| New site-wide patterns merged into Web | **NO** | Framer-only |
| Framer old Home is new ScientificRadar homepage | **NO** | Older Denzel-derived template, preserved |
| Framer live publish changed | **NO in previous work** | No publish operation performed |
| Studio publishing API is live | **NOT VERIFIED** | Treat old roadmap claim of demo-only as historical until checked |
| Original four reader Framer canvas fallback resolved | **NO** | `Component file does not exist` issue unresolved; separate from current three new labs |
| PR #50 / #51 | **OPEN/DRAFT** | Context/QA docs only; never merge automatically |
| PR #52 | **MERGED** | Owner explicitly approved merge; no rollback requested |

---

## 11. REFERENCE LINKS AND KNOWN NON-GOALS

- GitHub Web: https://github.com/Centaurioun/ScientificRadar-web
- GitHub Studio: https://github.com/Centaurioun/scientificradar-studio
- Website visual baseline: https://github.com/Centaurioun/ScientificRadar-web/blob/main/docs/design/OWNER_VISUAL_BASELINE_AND_KNOWLEDGE_LINKS.md
- Public Web blueprint: https://github.com/Centaurioun/scientificradar-studio/blob/main/docs/public-website/SCIENTIFICRADAR_PUBLIC_WEBSITE_DESIGN_BLUEPRINT_2026-11-02.md
- Roadmap: https://github.com/Centaurioun/ScientificRadar-web/blob/main/docs/roadmap/SCIENTIFICRADAR_WEB_MASTER_ROADMAP.md
- Reader integration PR: https://github.com/Centaurioun/ScientificRadar-web/pull/52
- Reader QA PRs: https://github.com/Centaurioun/ScientificRadar-web/pull/50 and https://github.com/Centaurioun/ScientificRadar-web/pull/51
- Framer editor project: https://framer.com/projects/Scientific-Radar--boKLyC3EXgf7Nhs9yoC7-3fySI

**No goal now:** publish a separate Framer-hosted ScientificRadar, rewrite Studio, start new monetization/analytics/SEO infrastructure, add real CMS API, pay for Framer hosting/unframer, bypass licensing, fabricate user research, remake old figure/citation labs, change production domain/Cloudflare.

**Historical AGENTS.md mention:** The owner previously discussed placing a “Framer Experimental Design Environment” instruction in `AGENTS.md`. This conversation cannot establish a matching committed root `AGENTS.md` file in either main repository (read returned 404). It may live in an untracked or different workspace. **Do not assume it is currently committed** or overwrite any existing agent instructions; verify exact location if that matters.

---

## 12. SIX-CYCLE QUALITY REVIEW OF THIS HANDOFF (SELF-AUDIT)

This transfer text was intentionally refined in six successive mental/editorial passes:
1. **Inventory extraction:** Identify repo URLs, verified SHA, 7 lab IDs, 3 new paths/code files and previous merged/read-only statuses.
2. **Owner-intent reconstruction:** Preserve autonomous Framer iteration, concise Turkish communication, Codex collaboration and required owner-gated Web integration.
3. **Evidence separation:** Distinguish source presence, screenshot, browser QA, CI and public production deployment; prevent “PASS” overclaims.
4. **Conflict reconciliation:** Clarify PR #52 already merged vs. site-wide labs not merged; C04 original FAIL vs new BLOCKED; Denzel Home vs unpublished labs; old dated roadmap vs latest SHA.
5. **Operational fallback / risk check:** Private ChatGPT URL accessibility; local dirty worktrees; Framer account/iframe; no subscriptions, DNS, rights or fake metadata; handoff must work without source chat.
6. **Cold-start simulation:** A fresh agent can identify exact next task, which URLs to open, what can change, what requires approval, what evidence to collect and what to tell the owner without asking already-answered questions.

**Known limitation:** This self-review is not third-party scientific QA or an actual Codex execution. Any future automation must run independently and report real outcomes.

---

## 13. IMMEDIATE SHORT CODEX PROMPT (OPTIONAL, AFTER CHATGPT ORIENTATION)

> ScientificRadar Web/Framer handoff belgesini tamamen oku. Framer projesi `boKLyC3EXgf7Nhs9yoC7` içindeki **üç yeni site-geneli laboratuvarı** (Homepage `lB6PwBvhQ`; Topic Discovery `sNtz29BzD`; Search/Nav `usIBUa94C`) yetkili Brave Framer Preview + Playwright ile denetle. Her birinin A/B düzenlerini 1200, 810, 390, 320 px’de gerçek click, hover, keyboard, Escape, focus, arama, filtre, drawer ve taşma açısından test et. Demonstrasyon verisinin 10 makale/7 disiplin/17 subfield tutarlılığını incele. Hatalara PASS/FAIL/BLOCKED ve kanıt ver. Bu ChatGPT sohbetine mesaj gönderebiliyorsan kısa teknik bulgularla devam et; erişemiyorsan kendi oturumunda raporla. **Web/Studio kodunu veya main'i değiştirme, Framer yayımlama, PR merge etme.** Türkçe, kısa, somut rapor.

The incoming ChatGPT instance may reuse that prompt or shorten it. The prompt should only be delivered once, after inspecting whether Codex QA has already occurred.

---

## 14. HOW THE NEW CHATGPT SHOULD START

Respond in Turkish, concisely:
- State that the handoff has been read and **the precise current point is three finished-but-not-yet-owner-approved Framer site-wide labs**.
- Mention their A/B alternative names and link to their previews; acknowledge the owner requested no serial questions.
- Say that the previous reader integration PR #52 was merged but **not** the new homepage/topic/search designs.
- Propose *specific next action* (get actual Codex QA evidence or review any results already supplied) and continue without generic onboarding.
- If asked to make changes, inspect current Framer/GitHub first and preserve the existing six variants. Never confuse untested interactive behavior with a passed test.
- Do not invent the user's approval, paid account access, production release, private chat posting or validation outcomes.

**Single-sentence cold-start summary:** “ScientificRadar Web already contains the merged scientific article-reader enhancements; Framer now hosts three additional unpublished, iteratively refined A/B experiments for Homepage, Topics and Search/Nav, and the next phase is independent Codex/Playwright QA followed by the owner's design approval before any Web integration.”
