# Framer Reader Labs — Partial E2E QA Follow-up

**Date:** 2026-11-07
**Status:** PARTIAL / NOT E2E PASS
**Source:** Codex outcome pasted into ChatGPT by the owner. **No raw Playwright traces, screenshots, spec output, or test report was supplied with the pasted outcome.** Observations below are attributed to Codex's report; they were not independently rerun by ChatGPT.

Companion test plan: [FRAMER_READER_LABS_E2E_QA_MISSION_2026-11-07.md](./FRAMER_READER_LABS_E2E_QA_MISSION_2026-11-07.md).

## 1. User-supplied Codex report — observed live interactions

| Lab | Reported interaction observations | Remaining gaps |
| --- | --- | --- |
| Scientific Figure Lab, Framer node `OFNHTB3Jx` | Inspector initially closed; button opened a dialog; zoom and Region III selection responded; `scrollLeft=288` reported after region selection; Close dismissed dialog | All regions and centring assertions, keyboard region shortcuts, mouse drag, touch, focus trap/restore, all responsive sizes |
| Citation Interaction Lab, node `sHFu4J1jX` | Citation [2] click scrolled to and highlighted its bibliography record; demo citation showed no DOI recorded | Desktop hover/mouse-leave, viewport-edge positioning, mobile tap, back-to-citation and focus, keyboard tooltip |
| Mobile Reading Stress Lab, node `EOyWe1e9E` | Row focus and Carbon Steel selection responded; equation inspector opened, Escape closed it; fixture table labels and demo warning were visible | All five materials x all five metric values, 320/390 viewport assertions, matrix-local scrolling, fixed column, a11y and focus restoration |
| Integrated Article Reader Lab, node `L0EEZeigV` | Figure dialog opened; attempt to open equation while Figure was active produced no second dialog; after Figure closed, equation dialog opened and Escape closed it; citation click scrolled/highlighted bibliography | Repeat interactions after modal, all viewport sizes, modal focus and body-scroll restoration, table integrity, tooltip hover, region centring |

**Interpretation correction:** The report introduction says two of four prototypes were interactively tested but the detailed body lists partial observations on **all four**. Treat as **four partially sampled labs**, not two completed E2E tests. `scrollLeft=288` alone does not prove exact region centring. Preventing two simultaneous dialogs in a UI where the first modal covers the underlying page is necessary but not exhaustive modal exclusivity validation.

## 2. Canvas warning reported by Codex

Codex reported a **`Component file does not exist`** message in the Framer *editor canvas* for Figure and Stress labs, while their authenticated Preview iframe still loaded and was partially interactive.

### Independent read-only Framer checks performed by ChatGPT

The official Framer MCP returned the following valid files and code-component registrations:

| Project file | Registered component ID | Instance on Desktop page |
| --- | --- | --- |
| `ScientificFigureLab.tsx` | `codeFile/aSqGzef:default` | `vUv8dh1KM` on `OlQyxTyxG` |
| `CitationInteractionLab.tsx` | `codeFile/QJHlUlg:default` | `ECqnR2aW8` on `aYMuzhqNs` |
| `MobileReadingStressLab.tsx` | `codeFile/JAsq_aM:default` | `W1EtvXZUF` on `Mq0iRVpEq` |
| `IntegratedArticleReaderLab.tsx` | `codeFile/FdV5_zr:default` | `Ex_EXdPAt` on `iAJneml6h` |

For each project, its page tree's component instance refers to the same ID as Framer's code component catalogue. Framer API reads returned non-empty TypeScript source for all four files. Fresh `api.tree.screenshot` calls for Figure and Stress Desktop/Phone completed. **These checks refute a literal missing-file conclusion at API level, but do not reproduce, diagnose or resolve the editor-canvas warning.** Possible cache/registry/editor state is a hypothesis, not a confirmed cause.

**Follow-up:** Capture the warning with exact page, browser/Framer version and console logs; reload the Framer editor canvas (without publishing), inspect file path/case, component import/registration, canvas vs preview behaviour, and Framer UI errors. Never delete or recreate a working component merely to suppress an unexplained canvas warning.

## 3. Next Codex mission — remaining high-priority E2E

Use the previous mission's exact 36-case matrix. Prioritise **gates** rather than repeating the successful spot checks:

1. **Environment fidelity:** Use authorized authenticated Framer Preview iframe. Capture iframe selector and actual inner viewport dimensions, including 1200, 810, 390 and 320 px. Do not substitute browser outer window width for preview width.
2. **Figure (P0/P1):** Zoom min/max, three regions and exact scroll-position centring across 390/320; same-region recentering; Esc/Tab/Shift+Tab and focus restore; drag and touch movement; caption and provenance.
3. **Citation (P0):** Hover shows source card; mouse leave hides it; click always jumps to matching bibliography item; mobile tap jumps without hover; return-to-citation, viewport-edge tooltip positioning.
4. **Table and equation (P0):** Verify every material's five values and exact units against the development fixture; inspect 320 px sticky first column and document overflow; equation Escape, focus return, math legibility.
5. **Integrated (P0):** Repeat all three interaction families in sequence within a single page; confirm only one modal; scroll-lock release; correct focus return; source provenance; 320 px no unintended body overflow.
6. **Editor-canvas warning:** Independently reproduce the warning and identify whether it affects only canvas rendering, component registration or runtime. Classify severity based on evidence rather than assumptions.

For every case, record PASS/FAIL/BLOCKED, viewport, actual URL/node, Playwright assertion, screenshot/trace, and exact reproduction steps for failure.

**Local checkout safety:** Codex reported its local `main` and `origin/main` were 42 commits behind the remote repository, and that `.gitignore`, `.agents/`, `.ignore`, `PROJECT.md` and `test-results/` had local changes. Do not reset, clean, stash, or overwrite them. Use a separately named clean worktree based on the newly fetched `origin/main` only with owner-authorized local Codex permissions and without disturbing the existing checkout. A separate isolated test branch is mandatory before committing documentation or testing files.

**Deliverable:** Evidence-based remaining E2E report under `docs/qa/` as a draft PR, preferably with actual Playwright code/tests and captured artefacts where safe. Preserve the existing PR #50 as a documentation handoff. Do **not** modify ScientificRadar production code, merge PRs, publish Framer, change DNS, or introduce paid dependencies. Respond in Turkish.

## 4. Decision

**No promotion to ScientificRadar Web yet.** Current observations support continued testing, not a final implementation decision. Framer project files were inspected **read-only** for this follow-up; app code, DNS and production website were not changed.
