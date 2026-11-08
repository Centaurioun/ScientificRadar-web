# Bennu A final UX QA — 2026-11-07

## Scope and authority

Applied the owner decisions in [BENNU_READER_OWNER_UX_DECISIONS_2026-11-07.md](BENNU_READER_OWNER_UX_DECISIONS_2026-11-07.md) (blob SHA: `7b76f05895dbe91363718348b057ab7f023b3f53`) to the unpublished Framer page **Dust from Dying Stars, Preserved in Bennu** (`/bennu-presolar-stardust`, node `W1F5b_kMS`). The Framer preview remains unpublished and no-index. No Web/Studio application code, production, PR merge, or publish action was used.

## Implemented in Framer A

- Figure dialog closes on backdrop click only; the image and caption are inside the dialog boundary. Close Figure, body scroll lock, initial focus and focus restoration are implemented.
- Citation and Return to Text links use the reduced-motion-aware scroll helper and preserve individual citation IDs/hash targets.
- Added Left / Justified prose alignment, default Left; the Justified control is hidden at mobile widths and the prose is forced Left there. Headings, figure captions and references are outside the alignment selector.
- Isotope concept is in the desktop right rail and inline at narrower breakpoints; CSS hides the alternate placement to avoid duplicate visible/accessible content.
- Retained 17px phone default and 15/17/19px size controls. Existing Scientific + teal Radar wordmark and non-linked category/Feature labels are retained.
- Mobile TOC navigation defers scroll until the menu-close commit via a layout effect, avoiding the prior same-event `setMenu(false)` / `scrollIntoView()` race.
- Added a presolar-grains Knowledge Link trigger for popup QA; Escape and Close restore focus to the trigger.

Framer code write diagnostics were empty. This is not a replacement for browser accessibility or DOM metric verification.

## Brave preview evidence

Preview page: [Framer A preview](https://framer.com/projects/Scientific-Radar--boKLyC3EXgf7Nhs9yoC7-3fySI?node=W1F5b_kMS&view=preview)

- [Before: existing A full-page screenshot](https://framerusercontent.com/screenshots/on-demand/45365096-82b7-45dc-a66b-b48cb8b99e33.jpg)
- [After: updated A full-page screenshot](https://framerusercontent.com/screenshots/on-demand/8706b452-41f3-44db-970c-b1c4fa6add17.jpg)

The Framer screenshot endpoint returned a 1200px-wide page image regardless of requested viewport dimensions. Separate Brave viewport captures were inspected during the preview session; the short phone viewports were 320×568 and 390×667.

## QA outcomes

| Check | Result | Evidence / limits |
|---|---|---|
| 320×568 visual layout, title/figure fit, no visible horizontal spill | PASS (visual only) | Brave preview screenshot inspection; no root `scrollWidth/clientWidth` DOM measurement available |
| 390×667 visual layout and 17px default | PASS (visual only) | Default text-size control selected; no visible horizontal spill |
| 810px tablet layout and concept inline placement | PASS (visual only) | Narrow TOC and single inline concept observed |
| 1200px desktop layout and right-rail concept | PASS (visual only) | Single active preview concept in right rail; Left selected by default |
| Alignment control | PASS | At 1200px Left → Justified → Left selected; prose-only selector |
| 15/17/19px size controls | PASS | 390px Smaller → Larger → Default selected; default restored |
| Figure backdrop click | PASS | Modal closed when dark backdrop clicked |
| Figure/caption interior click | PASS | Modal remained open after image click |
| Close Figure and focus restore | PASS | Button closed dialog; focus returned to Open Figure 1 trigger |
| Modal Escape and focus trap | BLOCKED | In Brave, Escape closed the Framer Preview overlay itself before component-level handling could be confirmed; focus trap Tab sequence not independently verified |
| Knowledge Link open, Escape/Close and focus return | PASS | Popup opened; Escape and Close returned focus to “presolar grains” trigger |
| Mobile TOC post-close scroll/focus | PASS | At 320px, selected section collapsed the menu and placed/focused its heading after layout |
| `[1]` citation and separate returns | PASS | Brave URL/hash changed to `#ref-1`; Return to Text separately returned focus/hash to `#cite-1a`, `#cite-1b`, and `#cite-1c` |
| `[2]` correction citation and return | PASS | Brave URL/hash changed to `#ref-2`; return restored `#cite-2a` |
| Smooth-motion behavior and reduced-motion override | BLOCKED | Hash/focus targets verified; animation timing and OS reduced-motion mode were not observable through the available Brave control surface |
| Root overflow/clipping numeric measurement | BLOCKED | No page DOM evaluation interface available in this session; only visual spill inspection was performed |
| DOI destinations | PARTIAL | DOI URLs and accessible link names verified in the accessibility tree; external navigation was not activated |

## Hold point

A has the approved UX changes and the interaction checks above, but the owner-required modal Escape/focus-trap behavior, reduced-motion runtime behavior, and numeric root overflow measurement remain unverified. Do not replicate to B/C or describe A as fully QA-complete until these BLOCKED items are tested in a browser runtime that can address the preview iframe without the Framer host intercepting Escape.

## Scope note

The new screenshot documents the updated A design only. B/C and the collection have not been modified in this QA pass. The real Web wordmark change remains a separate future, owner-authorized small PR; no application code change is included here.
