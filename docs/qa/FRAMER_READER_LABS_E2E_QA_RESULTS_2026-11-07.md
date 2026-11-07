# Framer Reader Labs E2E QA Results — 2026-11-07

## Scope and method

This report completes the browser-verifiable portion of the follow-up mission for the four unpublished Framer Reader Labs prototypes. The tests ran in the authenticated Brave browser against Framer Preview, using Playwright locators and measurements inside Framer's `iframe[data-testid="preview-iframe"]`. The preview's inner width was explicitly set to 1200, 810, 390, and 320 CSS pixels. These are observations of the live prototype preview, not a CI run or a production deployment.

| Lab | Framer node | Preview URL |
|---|---|---|
| Scientific Figure | `OFNHTB3Jx` | `https://framer.com/projects/ScientificRadar--bokly6P8O8uMQLPqRMSv-4IZ?node=OFNHTB3Jx&view=preview` |
| Citation Interaction | `sHFu4J1jX` | `https://framer.com/projects/ScientificRadar--bokly6P8O8uMQLPqRMSv-4IZ?node=sHFu4J1jX&view=preview` |
| Mobile Reading Stress | `EOyWe1e9E` | `https://framer.com/projects/ScientificRadar--bokly6P8O8uMQLPqRMSv-4IZ?node=EOyWe1e9E&view=preview` |
| Integrated Article Reader | `L0EEZeigV` | `https://framer.com/projects/ScientificRadar--bokly6P8O8uMQLPqRMSv-4IZ?node=L0EEZeigV&view=preview` |

Evidence below records observed Playwright locator results, DOM state, viewport measurements, and dialog/scroll behavior. A screenshot was viewed in the live browser session, but this browser integration did not expose a durable screenshot/trace export path; therefore no screenshot or Playwright trace file is attached. Cases needing pointer movement, hover, drag, touch, or durable visual artifact export are marked BLOCKED instead of inferred PASS. No application source code, Framer project state, publication setting, DNS, or production resource was changed.

Status vocabulary: **PASS** = the stated behavior was directly exercised and met; **FAIL** = a reproducible defect was observed; **BLOCKED** = required interaction/evidence could not be completed with the available browser interface. A partial observation is described under BLOCKED.

## Case results

### Scientific Figure Lab — `OFNHTB3Jx`

| Case | Status | Viewport(s) | Observation / evidence |
|---|---|---|---|
| F01 — preview and figure render | PASS | 1200 | Preview loaded with title “Look closer. Understand more.”, figure image, caption/provenance, and `Expand & inspect` control. Initial inspector count was zero. |
| F02 — open/close inspector | PASS | 320 | Opened one accessible dialog; Escape and Close each dismissed it. Body overflow changed to hidden while open and restored on close; focus returned to `Expand & inspect`. |
| F03 — zoom controls | PASS | 320 | Zoom input exposed min 75, max 300, step 25. Home set 75%, End set 300%, Reset restored 100%; Zoom in changed 100→125 and Zoom out returned 125→100. |
| F04 — region selection/recentering | PASS | 320, 390 | Regions I/II/III changed selected detail text. At 320, stage `scrollLeft` was 0/210/420; at 390 it was 0/185/370. These are measured centering offsets in the local figure stage. |
| F05 — pointer pan/drag | BLOCKED | 320 | Drag/pan could not be exercised: the available Playwright bridge exposes locator click/fill/press and read-only evaluation, but no pointer move/drag API. |
| F06 — image alternative text and source details | PASS | 1200 | Figure image had meaningful alternative text; caption and attribution/source text were present in the initial preview. |
| F07 — keyboard and dark-theme legibility | BLOCKED | 320 | Tab cycled among 11 controls within the inspector; Escape closed it and focus returned to the trigger. Dark-theme contrast/legibility was not objectively evaluated. |
| F08 — responsive layout/overflow | PASS | 1200, 810, 390, 320 | For each viewport, document `scrollWidth` equaled `clientWidth` and the body width matched; no page-level horizontal overflow was measured. |

### Citation Interaction Lab — `sHFu4J1jX`

| Case | Status | Viewport(s) | Observation / evidence |
|---|---|---|---|
| C01 — hover citation tooltip | BLOCKED | 1200 | Hover and mouseleave could not be emitted through the available Playwright bridge. |
| C02 — citation jump to reference | PASS | 320 | Clicking [1], [2], [3] brought `#sr-lab-reference-0..2` into view. Each target had a visible outline and teal/light background; measured target top positions were 540, 554, and 725 px during the interaction sequence. |
| C03 — illustrative reference integrity | PASS | 320 | Page explicitly labels references illustrative; DOI text says “DOI not recorded”. No DOI was invented and no external anchor links were present in the inspected DOM. |
| C04 — return to citation | BLOCKED | 320 | “Back to article citation” was available and click returned focus to [1]; after return, scrollY was 476.5 and citation positions were 415/906. The exact pre-jump position was not captured, so exact restoration remains unverified. |
| C05 — tooltip placement near viewport edge | BLOCKED | 320 | Requires hover/mouse positioning, unavailable in the browser bridge. |
| C06 — citation control activation | PASS | 320 | Citation buttons activated through Playwright click and navigated to the corresponding in-page reference targets without opening another dialog. |
| C07 — keyboard tooltip behavior | BLOCKED | 320 | Keyboard-focused tooltip behavior could not be established with durable, unambiguous evidence in this run; no hover equivalent was available. |

### Mobile Reading Stress Lab — `EOyWe1e9E`

| Case | Status | Viewport(s) | Observation / evidence |
|---|---|---|---|
| T01 — row focus and material values | PASS | 320 | Selected each of five materials and read all five displayed definitions. Dragline silk: `1.31 g·cm⁻³ / 10.5 GPa / 1.25 GPa / 28.0% / 165 MJ·m⁻³`; flagelliform: `1.30 / 0.003 / 0.50 / 240.0% / 150`; Bombyx: `1.34 / 7.0 / 0.60 / 18.5% / 70`; Kevlar: `1.44 / 130.0 / 3.60 / 2.7% / 50`; carbon steel: `7.85 / 200.0 / 1.50 / 1.8% / 12` (same units/order). |
| T02 — matrix narrow-screen behavior | PASS | 320, 390, 810, 1200 | Matrix view was selectable. At 320, document width remained 320 while matrix scroller measured 284 px viewport / 980 px content; the first column header used sticky positioning. No page-level horizontal overflow at the four measured widths. |
| T03 — matrix headers/data alignment | PASS | 320 | First column remained sticky and the next numeric header was visible at x=174–301 px in the 320 px preview; row/column labels and units were rendered. |
| T04 — responsive view selection and values | BLOCKED | 320, 390, 810, 1200 | Fresh loads selected Row focus at 320/390 and Matrix at 810. All five row values were checked at 320, but complete value retention across each view and desktop width was not established. |
| T05 — equation inspector | PASS | 320 | One dialog opened with full expression, variables, and demonstrative-value caveat. Escape closed it and returned focus to `Inspect equation`; body overflow was locked while open. |
| T06 — keyboard operation | BLOCKED | 320 | Dialog focus return/Escape were exercised, but complete keyboard-only traversal of all controls and matrix navigation was not completed. |
| T07 — equation meaning and caveat | PASS | 320 | Expression, variable explanations, and warning that the example value is demonstrative were visible. Displayed metric units matched the row data. |
| T08 — equation overflow/large text | BLOCKED | 320 | At default text size, equation content had a local width of 256 px versus a 254 px client width; document width stayed 320. Large-text/zoom behavior was not tested. |

### Integrated Article Reader Lab — `L0EEZeigV`

| Case | Status | Viewport(s) | Observation / evidence |
|---|---|---|---|
| I01 — responsive page width | PASS | 1200, 810, 390, 320 | Document/body widths matched the preview at all four sizes; no page-level horizontal overflow was measured. Fresh mobile previews selected Row focus; wider 810 px preview selected Matrix. |
| I02 — inspectors and modal isolation | PASS | 320, 1200 | Figure and equation inspectors each opened as a single dialog. Attempting the second while the first was open left one dialog; after dismissal the other could open. Escape closed and body overflow restored. |
| I03 — citation workflow | BLOCKED | 320 | Clicking reference 1 moved to `#integrated-ref-0`, whose background became light teal. Hover interaction and full return workflow were not verified. |
| I04 — integrated material values | PASS | 320 | Row focus was selected on fresh mobile preview and Matrix remained selectable. Sampled row values matched the stress-lab values above; exhaustive cross-view value parity was not completed. |
| I05 — figure region interaction | PASS | 320 | Selecting region III changed detail text and moved local figure stage to `scrollLeft` 424 (content width 744); region offsets were 0/212/424. Escape dismissed the inspector. |
| I06 — equation interaction | PASS | 320 | Equation inspector displayed the expression; Escape dismissed it. The dialog opened after the figure inspector had been closed. |
| I07 — sequential workflow/focus accessibility | BLOCKED | 320 | Figure, equation, and citation actions were exercised sequentially without a trapped dialog or page overflow. Complete focus order and focus-hidden state were not verified. |
| I08 — source/illustrative disclosures | PASS | 320 | Reader displayed demonstrative-data caveats and “DOI not recorded”; no reference destination outside the page was observed. |

### Cross-lab evidence and reporting — X01–X05

| Case | Status | Viewport(s) | Observation / evidence |
|---|---|---|---|
| X01 — exact prototype identity | PASS | all | Each run used its exact Framer node ID and preview URL listed above. |
| X02 — viewport coverage | PASS | 1200, 810, 390, 320 | All four exact preview widths were set and checked for page-level width/overflow in the labs. |
| X03 — screenshots/trace attached | BLOCKED | all | A live screenshot was viewed in the browser UI, but the browser integration did not expose a durable local screenshot or Playwright trace export. No artifact is claimed as attached. |
| X04 — reproducible evidence | PASS | all | Case observations record the specific node, width, action, and measured DOM/scroll/dialog result where applicable. Hover/drag limitations are explicitly marked BLOCKED. |
| X05 — QA-only scope | PASS | n/a | No app code, Framer project tree/file, publish setting, DNS, production deployment, or PR merge was changed. The report is the only intended repository change. |

## Independent investigation: Framer canvas diagnostic

The editor DOM displayed the fallback diagnostic `Error in local-module:codeFile/aSqGzef:default` / `Component file does not exist.` twice, including after editor reload. The preview iframe itself rendered the Figure Lab, and the live editor screenshot showed desktop and tablet canvas frames rendered. Thus the diagnostic was reproduced in the editor DOM, but it did not establish that the preview component was absent or visibly broken.

Read-only Framer project API inspection independently checked component catalog, tree references, and code file contents. The catalog contained `codeFile/aSqGzef:default` and the other three expected code component paths. The tree linked the matching component instances to the expected code IDs and lab pages: Figure `vUv8dh1KM` on `OlQyxTyxG`; Citation `ECqnR2aW8` on `aYMuzhqNs`; Stress `W1EtvXZUF` on `Mq0iRVpEq`; Integrated `Ex_EXdPAt` on `iAJneml6h`. All four component source files were present and nonempty (19,348; 13,276; 17,992; and 31,181 characters respectively); imports were limited to React, react-dom, and Framer. The read-only inspection reported no tree changes (`changedNodeCount: 0`).

The browser console did not show an error specifically identifying `aSqGzef`; an unrelated FeedSpring image-grid request returned HTTP 404 and is not attributed to the canvas diagnostic. Available evidence therefore **contradicts a literal missing-file condition in the current project catalog**, while the editor fallback warning itself remains reproducible. Root cause is unresolved; possible editor registry/cache or editor-state behavior remains only a hypothesis. No component was deleted/recreated and no Framer mutation was attempted.

## Overall disposition

The four preview pages loaded and their core click-driven inspector, citation, responsive, and equation paths were exercised. No reproducible application failure was established in the tested paths. This is **not a complete sign-off**: pointer pan, hover tooltips, dark-theme contrast, some full keyboard workflows, and durable screenshot/trace evidence remain blocked or incomplete. Keep the canvas warning open for Framer-side investigation; do not label it a missing source file based on the evidence gathered here.
