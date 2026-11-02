# ScientificRadar Web PR #1 — Bağımsız Pre-merge Kabul Denetimi

**Denetim tarihi:** 2 Kasım 2026 (Europe/Istanbul)
**Karar:** **CONDITIONAL ACCEPT** — bu karar yalnızca denetlenen `HEAD_SHA` için geçerlidir.
**PR #1:** https://github.com/Centaurioun/ScientificRadar-web/pull/1 (OPEN, merge edilmedi)
**BASE_SHA:** `41a73b49f69c1310eca819d1ad2cdb1c712da89a`
**HEAD_SHA:** `7fd59800d9305e2b39364e4989d2bf1ecff942bb`

## 1. Executive Summary

PR #1’in güncel remote head’i atamada beklenen SHA ile eşleşti. Candidate üzerinde lint, TypeScript ve 14 unit test başarılı; production build başarılı; candidate’da beş viewport ve beş rota kombinasyonunun 25’i HTTP 200 döndürdü. Üretim tarayıcı testinde KaTeX’ın HTML ve MathML çıktısı görüldü; XSS içerik denemeleri DOMPurify katmanından temiz geçti. Onaylı sıcak kağıt rengi, Merriweather/Inter font stack’leri ve kompakt varsayılan hero kodda korundu; `/?hero=standard` çalışıyor.

**Koşullu kararın nedenleri:** (1) PR dışı ama merge öncesi bilinmesi gereken, iki makale rotasında `1024×768` ve daha dar viewport’larda belge genişliğini `1248px` yapan, görsellerden kaynaklanan mevcut taşma her iki SHA’da da var. Bu PR’ın getirdiği bir regresyon değil; fakat mobil bilimsel okuma deneyimini bozuyor. (2) KaTeX eklenmesi makale rotasının route JS ölçümünü 5.86 KB’den 94.5 KB’ye ve first-load JS’i 120 KB’den 209 KB’ye çıkarmış; yaklaşık 89 KB artışın kabul edilmesi veya küçültülmesi için performans eşiği tanımlı değil. (3) Lockfile olmaması aynı manifest için kurulum grafiğini sabitlemiyor. (4) Geniş klavye/menü ve sanitizer güvenlik kontrolleri bu denetimde tamamlanmadı.

Bu nedenle PR için **P0 veya PR kaynaklı P1 doğrulanmadı**, ancak koşulsuz `ACCEPT` için kanıt ve performans belirsizlikleri kaldı. Mevcut veriye göre merge kararı vermeden önce aşağıdaki koşulların kapatılması önerilir. PR’ın değişmeyen head SHA’sı için bu karar verildi; yeni commit olursa bu sonuç yeni head’e aktarılmaz.

## 2. Repository ve SHA Verification

- Repository: `https://github.com/Centaurioun/ScientificRadar-web`; `origin` bu URL’ye bağlı.
- Ana checkout `main`, HEAD `41a73b49f69c1310eca819d1ad2cdb1c712da89a`; bu baseline, `origin/main` ile assignment baseline’ına eşitti.
- `git fetch origin --prune` sonrasında `origin/main` aynı baseline SHA’da; PR branch `fix/reader-foundation-compact-default-2026-11-02`, SHA `7fd59800d9305e2b39364e4989d2bf1ecff942bb`.
- GitHub PR API’si PR #1’i OPEN, base `main`, current head’i aynı SHA olarak verdi; quality ve GitGuardian check’leri SUCCESS idi. Check’ler browser E2E içermiyor.
- PR diff’i 15 dosya: CI workflow, layout, homepage, ArticleReader, LeadStory, sanitization ve math kodu/testleri, design tokens ve package manifest’i ile iki doküman. Uygulama kaynak kodu değiştirilmedi.
- Baseline ve candidate, ayrı detached git worktree’lerde test edildi. Rapora özel branch `origin/main` üzerinden oluşturuldu.
- Ana checkout’taki mevcut `.gitignore` değişikliği ve `graft/` untracked içeriği korundu.

## 3. Environment ve Dependency Reproducibility

- Node.js `v26.12.1`; npm `11.20.0`.
- Browser: Brave `156.1.98.60` (Playwright `1.64.1` ile). Viewport testlerinde DPR `1`.
- İki worktree’de `npm install --no-audit --no-fund` başarılı oldu; baseline 948, candidate 991 paket bildirdi. Lockfile commit edilmedi. Kurulum manifest aralıkları ve o andaki registry çözümlemesine bağlı, frozen/reproducible kurulum kanıtlanmadı.
- İki kurulumda da `superstatic@10.0.0` Node `20 || 22 || 24` istediği halde Node 26 kullanıldığı için `EBADENGINE` uyarısı görüldü; bu testte build/test bloklamadı.
- Candidate çözümlemesinde Next `15.5.28`, React/React DOM `19.3.1`, KaTeX `0.19.1`, TypeScript `5.9.3`, ESLint `9.39.1`, tsx `4.23.15` gözlendi. Baseline ile candidate sürüm farkları semver çözümlemesinin sonucu; lockfile olmadığı için başka zamanda farklılaşabilir.
- `next.config.ts`, Next.js `15.x` ile `eslint.ignoreDuringBuilds: true` ve `output: "standalone"` kullanıyor. `npm run build` lint’i bilerek atlıyor; bu nedenle ESLint ayrıca çalıştırıldı. `next start` her iki SHA’da da uyarı verdi: standalone output ile desteklenmediği söylendi; buna rağmen server Ready oldu ve HTTP testlerinde sayfalar sunuldu. Bu uyarı mevcut config kaynaklı ve PR’a özgü değil.

## 4. Static Code Review

- `lib/content/sanitizer.ts`: DOMPurify parser tabanlı `ALLOWED_TAGS`/`ALLOWED_ATTR`, tag başına attribute allowlist’i, protokol kontrolleri ve inner `h1` → `h2` dönüşümü kullanıyor. `_blank` linklere `noopener noreferrer` ekleniyor. `data-*` ve `aria-*` genel olarak kapalı; gerekli bilimsel metadata açıkça allowlist’te.
- `safeHref` yalnızca `http:`/`https:`, fragment ve bazı göreli yolları kabul ediyor; `safeSrc` yalnızca root-relative kaynakları veya çağıranın ayrıca verdiği doğrulanmış URL’leri kabul ediyor. `ArticleReader` sanitizasyon çağrısı dış kaynak listesi vermiyor; remote image URL’leri bu çağrıda düşer.
- `components/editorial/ArticleReader.tsx`: sanitizasyondan geçen HTML’i `dangerouslySetInnerHTML` ile basıyor. KaTeX HTML’i ayrı bir renderer tarafından üretildiği ve content TeX’i `trust: false` ile işlendiği için iki raw HTML sınırı vardır; testlerde DOMPurify ve KaTeX’in güven ayarları incelendi.
- `lib/content/math.ts`: `htmlAndMathml`, `trust: false`, `throwOnError: true`, `maxExpand`, `maxSize` ve 4000 karakter sınırı tanımlı. Hatalı veya uzun girdiler `null` döndürür; React metin fallback’i HTML escape eder.
- `app/layout.tsx` KaTeX CSS’i ekliyor. CSS ve fontlar production build’den sunuldu.
- Paket değişiklikleri: `isomorphic-dompurify`, `katex`, `tsx`; lockfile eklenmemiş.
- Candidate article route client bundle’ı önemli ölçüde büyümüştür (bkz. Finding PERF-01).

## 5. Unit, Lint, TypeScript ve Build Results

| SHA | Komut | Exit | Sonuç |
|---|---|---:|---|
| BASE | `npm run lint` | 0 | ESLint tamamlandı |
| BASE | `npx tsc --noEmit` | 0 | TypeScript tamamlandı |
| BASE | `npx --yes tsx --test lib/content/repository.test.ts` | 0 | 7/7 geçti |
| BASE | `npm run build` | 0 | Next production build tamamlandı; lint build’de atlandı |
| CANDIDATE | `npm run lint` | 0 | ESLint tamamlandı |
| CANDIDATE | `npm run typecheck` | 0 | TypeScript tamamlandı |
| CANDIDATE | `npm run test:unit` | 0 | 14/14 geçti (7 repository, 2 sanitizer, 3 math, 2 design) |
| CANDIDATE | `npm run build` | 0 | Next production build tamamlandı; lint build’de atlandı |
| Her iki SHA | `npm install --no-audit --no-fund` | 0 | Başarılı; warning’ler §3’te |

Next.js build loglarında Node 26 altında `module.register()` deprecation warning görüldü. Test çıktısında başarısız case yok. Testlerin sayısı local komut çıktısından alınmıştır; GitHub check’leri ayrı hosted CI kanıtıdır.

## 6. Browser Route ve Viewport Matrix

Candidate production `next start` üzerinde, fontların settle olması beklendikten sonra her route/viewport için `document.documentElement.scrollWidth` ile `window.innerWidth` ölçüldü. Beş viewport: `1440×900`, `1024×768`, `768×1024`, `390×844`, `320×700`.

| Route | 1440×900 | 1024×768 | 768×1024 | 390×844 | 320×700 |
|---|---:|---:|---:|---:|---:|
| `/` | 200, eşit | 200, eşit | 200, eşit | 200, eşit | 200, eşit |
| `/topics` | 200, eşit | 200, eşit | 200, eşit | 200, eşit | 200, eşit |
| `/search?q=hemocyanin` | 200, eşit | 200, eşit | 200, eşit | 200, eşit | 200, eşit |
| `/article/spider-silk-hierarchical-protein-mechanics` | 200, eşit | 200, **1248/1024** | 200, **1248/768** | 200, **1248/390** | 200, **1248/320** |
| `/article/respiratory-pigments-evolutionary-biochemistry` | 200, eşit | 200, **1248/1024** | 200, **1248/768** | 200, **1248/390** | 200, **1248/320** |

25/25 route request’i HTTP 200; sayfa hataları 0; tamamlanmış broken image sayısı 0. DOM’deki resimlerin alt metinleri bulundu. İç sayfa bağlantılarının Next RSC prefetch istekleri `ERR_ABORTED` gösterebildi; bunlar sayfa navigasyonu iptalleriydi ve sayfa runtime error olarak sınıflandırılmadı.

Browser’da ayrıca homepage dört durumu aynı `1440×900` koşulda açıldı: baseline `/` Standard, candidate `/?hero=standard`, baseline `/?hero=compact`, candidate `/` Compact. Candidate Standard override ve Compact varsayılanı beklendiği gibi render edildi. Aynı spider-silk article, baseline/candidate masaüstünde açıldı; candidate’da 600px reading control’ü 600 değerine geçti. Candidate mobile menu düğmesi açıldı ve `aria-expanded=true` oldu.

## 7. Visual Regression Comparisons

Karşılaştırma `Brave 156.1.98.60`, DPR 1, `1440×900`, aynı fixture ve production build koşulunda yapıldı. Screenshot’lar local olarak `/tmp/scirad-pr1-evidence/` altında tutuldu; dosyalar repository’ye eklenmedi:

- `base-standard.png`, `pr-standard.png`
- `base-compact.png`, `pr-compact.png`
- `article-base.png`, `article-pr.png`
- `topics-pr.png`, `search-pr.png`, `article-mobile-pr.png`

Homepage dört yönlü karşılaştırmada **EXPECTED CHANGE**: yalnızca homepage default’u Compact’e geçti; `/?hero=standard` Standard’ı tutuyor. Ana palette `#FAFAF8`, serif/editorial font ve Inter interface font class/stack’leri korundu. Makale için candidate KaTeX dönüşümü matematiğin pixel değişimini beklenen kılıyor. Piksel diff tek karar ölçütü yapılmadı.

`ArticleReader`’da 700/600/560 seçenekleri mevcuttu ve candidate’da 600px seçimi çalıştı. Doğrudan prose wrapper ölçümü 816px döndürdüğünden, ölçüm preset’lerinin tüm breakpoint ve ölçümlerinin beklenen efektif yazı genişliğini verdiği burada bağımsız olarak kanıtlanmadı. Drop cap’ın spider silk fixture’ında pseudo-element boyutu 48px, float `left`, weight 700; baseline ve candidate aynı sonucu verdi. Görselde çakışma görülmedi. Tablet/mobil makale taşması **PRE-EXISTING ISSUE** olarak sınıflandı; PR kaynaklı değişiklik yok.

## 8. KaTeX ve Scientific Rendering

- Candidate production spider silk ve respiratory pigments sayfalarında en az bir `.katex` ve `.katex-mathml` node’u gözlendi. MathML çıktı mevcut, KaTeX CSS yükleniyor; browser console’da hydration hatası görülmedi.
- Unit testler kesir, Greek sembolü/superscript ve invalid/oversized TeX fallback’ini içeriyor; 3 test geçti.
- Article fixture’ında equation card, açıklama alanı ve mevcut callout sınıfları render oldu. Ekran görüntülerinde denklem card görünümü korundu.
- Güvenli synthetic probe’da TeX `\\href{javascript:...}` için `trust:false` kontrol edildi; KaTeX render çıktısında URL benzeri annotation metni bulunabilse de etkin bir link elementinin oluştuğu doğrulanmadı. `trust` seçeneği kapalıdır.
- Browser’da integral, nested expression, invalid TeX, 4000+ karakter girdi ve çok uzun dar ekran denklem senaryoları tek tek çalıştırılmadı. Mathematical meaning’in tüm fixture’larda öncesi/sonrası içerik uzmanı karşılaştırması da tamamlanmadı.

## 9. DOMPurify ve Security Findings

Unit suite’in 2 yeni sanitizer testi geçti. Ek olarak candidate Node process’inde synthetic testler çalıştırıldı; public siteye veya kalıcı içeriğe payload yazılmadı:

- Entity-encoded `javascript:` link ve `onclick` temizlendi.
- Harici/unsafe image kaynakları düşürüldü; `/images/...` kaynakları kaldı.
- SVG, script ve MathML elementleri çıkarıldı.
- `style` ve `class` izin verilmedi; malformed nested markup parser ile normalize edildi.
- HTTPS link, `_blank` için `noopener noreferrer`, tablo semantiği ve source ID gibi izin verilen metaveri korundu.
- Article H1 demotion unit test’i geçiyor.

Bu payload denemeleri browser DOM içine enjekte edilmedi; XSS değerlendirmesi unit/Node sanitizer boundary’sidir, browser injection E2E kanıtı değildir. Özel Mutation XSS, attribute encoding çeşitleri, data URL/IPv6/backslash URL corpus’u ve SSR/client DOM eşdeğerliği kapsamlı fuzz edilmedi. **Confirmed exploitable P0/P1 security issue yok; güvenlik kanıtı kapsamı sınırlı.**

## 10. Accessibility ve Navigation

- Sayfa rotalarında primary H1 gözlendi; candidate article body’de ek H1 oluşmadı.
- Mobile menu düğmesi açıldı ve `aria-expanded=true` oldu.
- Homepage Standard/Compact query varyantları ve article measure düğmesi çalıştı.
- Merriweather ve Inter, production makale rotasında computed font-family’de yer aldı ve `document.fonts.check(...)` true verdi; fallback’a düşme gözlenmedi. Home route check’i test ifadesinin yanlış font shorthand’ı kullandığı için geçersiz kaldı ve home font loading ayrıca teyit edilmedi.
- Klavye Tab/Enter/Space/Escape, dropdown focus restoration, outside click, ekran okuyucu/AX tree, contrast ölçümü, %200 zoom ve not-found/unknown slug davranışı bu çalıştırmada doğrulanmadı. WCAG 2.2 AA uyumu iddia edilmiyor.

## 11. Six-Cycle Refinement Record

### Cycle 1 — Repository ve Baseline Integrity
- **Objective:** Kaynak kimlikleri ve test koşullarını sabitlemek.
- **Evidence:** Fetch sonrası `origin/main` BASE_SHA, PR head HEAD_SHA; iki temiz detached worktree; PR diff ve GitHub check durumu incelendi.
- **Findings:** SHA’lar beklenenlerle aynı. Primary checkout dirty içeriği korundu. Lockfile yok.
- **Contradictions/uncertainty:** GitHub CI başarılı; workflow browser cross-viewport doğrulaması yapmıyor. Lockfile olmaması lokal/CI dependency graph’ini sabitlemiyor.
- **Revised assessment:** CI başarı rozeti tek başına görsel/browser kabulü ispatlamıyor.
- **Remaining gaps:** Aynı Node/npm sürümünde frozen install tekrarı mümkün değil; lockfile bulunmuyor.

### Cycle 2 — Visual Fidelity
- **Objective:** Approved homepage ve editorial özelliklerini eski/yeni karşılaştırmak.
- **Evidence:** Dört homepage varyantı ve iki SHA’daki aynı article masaüstünde Brave ile açıldı; screenshot’lar alındı; token ve computed style incelendi.
- **Findings:** Compact default ve Standard override çalışıyor; onaylı renk/font token’ları korunmuş. Drop cap karşılaştırması eşit. Candidate article math görseli KaTeX’e dönüşmüş.
- **Contradictions/uncertainty:** Dört case homepage ekranları ve article fullpage görüntüsü mevcut; 700/600/560 gerçek prose efektif genişlikleri tam ölçülmedi.
- **Revised assessment:** Homepage değişikliği onaylı tasarımla uyumlu, bir intended change.
- **Remaining gaps:** Her okuma measure breakpoint’inde efektif genişlik teyidi; görsel karşılaştırma mobile screenshot’lar iki SHA’da eşleştirilmedi.

### Cycle 3 — Scientific Rendering
- **Objective:** Matematik, kaynaklar, tablolar, şekiller ve heading yapısını runtime’da incelemek.
- **Evidence:** Candidate production’da iki article; KaTeX/MathML node’ları; figure alt’ları, table içerikleri ve H1 gözlemi; 14 unit test.
- **Findings:** KaTeX HTML+MathML render oldu; equation explanation korunmuş; sanitizer citation metadata allowlist’te; body H1 demotion mevcut.
- **Contradictions/uncertainty:** Test fixture ve unit testler gerçek bibliyografik kaynak doğrulaması değil. Her TeX edge-case browser’da denenmedi.
- **Revised assessment:** Temel matematiksel rendering doğrulandı; geniş TeX uyumluluğu doğrulanmadı.
- **Remaining gaps:** Nested/invalid/oversized TeX browser, table overflow container davranışının ayrıntılı doğrulaması, literatür doğruluğu dış kapsam.

### Cycle 4 — Security ve Accessibility
- **Objective:** HTML trust boundary ve erişilebilir etkileşimlerin güvenliğini sorgulamak.
- **Evidence:** Sanitizer kodu, 2 unit test ve 5 ek synthetic Node payload; mobile menu toggle, heading count.
- **Findings:** XSS temsilleri temizlendi; unsafe image/attribute/SVG/MathML çıkarıldı; `_blank` güvenli rel; mobile toggle çalıştı.
- **Contradictions/uncertainty:** Payload’lar browser injection E2E değil; keyboard focus, AX tree ve contrast denenmedi.
- **Revised assessment:** Temel sanitizer güvenliği için olumlu kanıt var; tüm security/accessibility alanlarına genellenemez.
- **Remaining gaps:** Browser injection harness ve keyboard/focus kapsamı.

### Cycle 5 — Runtime ve Cross-Viewport Reliability
- **Objective:** Dev/prod davranışını ve 5 viewport’ta route’ları karşılaştırmak.
- **Evidence:** BASE/CANDIDATE lint/typecheck/unit/build; iki `next dev` ve iki `next start`; candidate’da 25 stable production route/viewport kaydı.
- **Findings:** Candidate route’ları HTTP 200; console/page errors yok. Candidate makale sayfalarında 1248px yatay genişlik; eşdeğer baseline production kontrolünde aynı taşma doğrulandı. Build ve `next start` standalone uyarısı mevcut config’e bağlı.
- **Contradictions/uncertainty:** Taşma ilk ölçümde yalnız candidate matrix’te görülse de baseline’da ayrıca üretildi; PR diff’i figure CSS’ini değiştirmiyor.
- **Revised assessment:** Responsive P1 sınıfında mevcut defect var fakat PR’dan önce de var; yeni regresyon değil.
- **Remaining gaps:** Görsel kaynaklı taşmanın correction’ı bu audit scope’unda değil; low-end gerçek cihaz/browser testi yok.

### Cycle 6 — Adversarial Final Review
- **Objective:** Kabul yönündeki önceki bulguları çürütmeye çalışmak.
- **Evidence:** Baseline/candidate gerçek production route tekrarları, tam build çıktısı, sanitize probes, PR exact SHA ve generated bundle route boyutları karşılaştırıldı.
- **Findings:** 1248px overflow PR’dan bağımsız ve `ScientificFigure` görsel genişliğine bağlı. Candidate article JS’de ~89 KB artış. Browser E2E’nin hosted CI’da bulunmadığı PR tanımıyla uyumlu.
- **Contradictions/uncertainty:** İlk viewport matrisi DOMContentLoaded sonrasında layout’u erken ölçerek route dışı false-positive üretmişti; sonuçlar networkidle ve font-ready ile tekrarlandı. Stable tekrar yalnız article figure overflow’unu doğruladı. Home console’daki favicon/resource 404 mesajı baseline’da da vardı; PR’a bağlanmadı.
- **Revised assessment:** Tasarım değişikliği temiz, doğrulanan PR regresyonu yok; ancak performans maliyeti ve kapsam limitleri nedeniyle karar koşullu.
- **Remaining gaps:** Tam keyboard/browser security suite, lockfile/frozen CI, candidate-baseline mobile screenshot karşılaştırması ve performans kabul eşiği.

## 12. Findings Register (P0–P3)

### PERF-01 — P2 — Candidate makale JS yükü belirgin büyümüş

- **BASE_SHA:** `41a73b49f69c1310eca819d1ad2cdb1c712da89a`; **HEAD_SHA:** `7fd59800d9305e2b39364e4989d2bf1ecff942bb`.
- **Route/component:** `/article/[slug]`, `components/editorial/ArticleReader.tsx`, `lib/content/math.ts`.
- **Source:** [ArticleReader.tsx](https://github.com/Centaurioun/ScientificRadar-web/blob/7fd59800d9305e2b39364e4989d2bf1ecff942bb/components/editorial/ArticleReader.tsx), [math.ts](https://github.com/Centaurioun/ScientificRadar-web/blob/7fd59800d9305e2b39364e4989d2bf1ecff942bb/lib/content/math.ts).
- **Expected vs actual:** Genel bilimsel TeX doğru gösterilsin; actual Next build route output’unda article JS 5.86 KB → 94.5 KB, First Load JS 120 KB → 209 KB.
- **Reproduction:** Her iki SHA’da `npm run build`; sonrasında candidate route output tablolarını karşılaştırın.
- **Evidence:** `npm run build` BASE/CANDIDATE stdout; `article-base.png`, `article-pr.png`.
- **Classification:** PR-introduced, P2; functionality kırılmadı, kullanıcı etkisi performans ölçümüyle sınırlı ve bu audit’te gerçek cihaz TTI ölçülmedi.
- **Recommended action:** KaTeX client bundle’ını route/feature bazında bölmeyi veya ölçülmüş budget içinde tutmayı değerlendirin; merge öncesi owner bir bundle budget belirlesin veya artışı kabul etsin.

### RESP-01 — P1 (pre-existing; PR regression değil) — Makale görselleri küçük ekranlarda viewport’u aşıyor

- **BASE_SHA / HEAD_SHA:** Yukarıdaki aynı SHA’lar.
- **Route/component:** İki makale fixture’ı; `components/editorial/ScientificFigure.tsx`.
- **Source:** [ScientificFigure.tsx](https://github.com/Centaurioun/ScientificRadar-web/blob/41a73b49f69c1310eca819d1ad2cdb1c712da89a/components/editorial/ScientificFigure.tsx); PR diff’inde bu component değişmiyor.
- **Expected vs actual:** Figure görseli responsively viewport’a sığsın; actual 1200px SVG, soldan 48px başlayıp sağa 1248px’e uzanıyor; document scrollWidth 1248px.
- **Reproduction:** Her iki SHA’da production article route’unu açın; `1440×900`, `1024×768`, `768×1024`, `390×844`, `320×700`’de `document.documentElement.scrollWidth` ve `window.innerWidth` karşılaştırın. 1440’da eşit; dar viewports’ta 1248/viewport.
- **Evidence:** `article-base.png`, `article-pr.png`, stable viewport matrix çıktısı, element bounds: `IMG.w-full.h-auto.block`, width 1200, right 1248.
- **Classification:** Her iki SHA’da var; pre-existing, PR diff kapsamı dışında. Scientific figure’lar ve tablolarda mobil kullanım problemleri mevcut; mevcut design contract’a göre ciddi responsive issue.
- **Recommended action:** Ayrı, açıkça kapsamlandırılmış responsive figure/table düzeltmesi için issue açın; global `overflow-x:hidden` ile saklamayın. PR #1’de görsel component değişikliği olmadığı için bunu PR regression diye saymayın.

### REPRO-01 — P2 — Kurulum graph’i lockfile ile sabit değil

- **BASE_SHA / HEAD_SHA:** Yukarıdaki SHA’lar.
- **Component:** `package.json`, `.github/workflows/web-quality.yml`.
- **Expected vs actual:** CI’da frozen dependency graph; actual package-lock committed değil, setup manifest ranges/npm resolution ile çalışıyor.
- **Reproduction:** Worktree’lerde `npm install --no-audit --no-fund`; 948 vs 991 paket; Node 26 EBADENGINE warning.
- **Evidence:** Install output, `package.json`, workflow.
- **Classification:** PR dependency additions ile test/build kapsamı genişliyor; lockfile eksikliği assignment sırasında repo genelinde var ve PR body tarafından da kabul ediliyor; PR introduced dependency graph risk, P2.
- **Recommended action:** Ayrı takipte lockfile ve frozen `npm ci` CI sağlansın; bu audit sırasında lockfile oluşturulmadı.

## 13. Unverified Scenarios ve Evidence Limits

- Hosted actions green, browser correctness kanıtı değildir; burada gerçek browser doğrulaması yalnız local Brave production ortamında yapıldı.
- Baseline tüm 25 viewport/route hücresinde tekrar test edilmedi; tam candidate matrisi, desktop baseline/candidate homepage four-case ve iki SHA article desktop testleri yapıldı. Taşma için baseline dar ekran karşılaştırması ayrı ve doğrudan yapıldı.
- Dropdown open/Escape/focus restoration/outside click, tab order, Enter/Space, search empty state, unknown slug, external citation behavior ve screen reader AX tree tamamlanmadı.
- Browser XSS injection yerine sanitizer boundary Node testleri uygulandı; CSP/real hosting/edge middleware incelenmedi.
- Browser math testi mevcut fixture denklemlerini doğruladı; invalid/nested/oversized TeX browser runtime’da test edilmedi.
- Görseller, caption ve alt metinler kontrol edildi; yoğun Figure 1 etiketlerinin her cihazda metin çakışması/okunabilirliği uzman görsel denetimiyle tek tek işaretlenmedi.
- Screenshot evidence local geçici dizinde; GitHub PR ek dosyası veya artifact linki yok. Report source linkleri güncel exact HEAD SHA’ya bağlıdır.
- Testler sadece bir Node/Brave sürüm çiftinde, dar kapsamlı fixture içerikleriyle yapıldı. WCAG 2.2 AA, gerçek scientific source accuracy veya real mobile device davranışı iddia edilmiyor.

## 14. Final Decision

# CONDITIONAL ACCEPT

PR #1 için incelenen exact HEAD’de **P0 veya PR-introduced P1 doğrulanmadı**. Lint, TypeScript, 14 unit test, production build ve candidate route/viewport smoke kontrolleri başarılı oldu. Owner-approved homepage tasarımı korundu ve Compact/Standard hero davranışı doğru.

Merge öncesi veya merge kararıyla birlikte aşağıdaki koşullar açıkça ele alınmalı:

1. `PERF-01` için ~89 KB article route JS/first-load artışı owner tarafından kabul edilsin veya bundle eşiğiyle iyileştirilsin.
2. `REPRO-01` için lockfile/frozen install follow-up’ı planlansın; bu durum dependency kurulumunu bugünkü koşullara bağlı kılar.
3. `RESP-01` için ayrı responsive fix takip işi açılsın. Bu issue pre-existing ve PR regression değil; yine de article mobil kullanımında gözlenen ciddi defect’tir.
4. Daha geniş keyboard/focus ve browser sanitizer injection doğrulaması tamamlanmadan tam erişilebilirlik/güvenlik kabulü ileri sürülmesin.

Bu koşullar bir güvenlik onayı veya release approval değildir; rapor yalnızca denetlenen PR #1 source snapshot’ını değerlendirir.

## 15. Recommended Next Actions

1. PR author/owner `PERF-01` etkisini ve lockfile işini açıkça kabul etsin ya da ayrı iş olarak planlasın.
2. `RESP-01` için ayrı candidate hazırlansın; makale figür ve tablolarda 320px–1024px gerçek browser ölçümü/screenshot ile doğrulansın.
3. KaTeX güvenli rendering testlerine browser invalid/oversized/nested TeX senaryoları eklensin; DOMPurify için encoded URL ve malformed markup browser harness’inde çalıştırılsın.
4. Dropdown klavye ve focus restoration, mobile menu keyboard erişimi ve not-found/search empty states için kısa E2E coverage eklensin.
5. Herhangi bir PR head değişirse acceptance audit ilgili yeni SHA’da tekrarlansın.

## Evidence Index

Evidence files (local only, not committed): `/tmp/scirad-pr1-evidence/`

| Evidence ID | Artifact |
|---|---|
| VIS-01 | `base-standard.png`, `pr-standard.png`, `base-compact.png`, `pr-compact.png` |
| VIS-02 | `article-base.png`, `article-pr.png`, `article-mobile-pr.png` |
| VIS-03 | `topics-pr.png`, `search-pr.png` |
| BR-01 | `browser-results.json` — route console/resource observations |
| BR-02 | `viewport-results-stable.json` — 25 candidate route/viewport measurements |
| SEC-01 | Candidate `npm run test:unit`: 14/14; sanitizer-specific synthetic Node probes in terminal session |
| BUILD-01 | BASE/CANDIDATE `npm run build` terminal output, including Next route JS sizes |
| ENV-01 | Install output and versions in §3 |
