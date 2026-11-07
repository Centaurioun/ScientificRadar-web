# ScientificRadar — Article Reading Experience: Three-Phase Roadmap
**Karar tarihi:** 2026-11-07  
**Durum:** Owner tarafından üç aşamanın kapsamı onaylandı; uygulama ve Web entegrasyonu birbirinden ayrı.  
**Yetki:** Framer'da üç aşamalı prototip; ScientificRadar Web/Studio uygulama kodu, production, DNS ve yayın bu görevde değişmeyecek.  
**Sorumluluk:** Framer tasarım/prototip; Codex gerçek Brave/Playwright doğrulaması; ChatGPT bağımsız teknik/UX değerlendirmesi; Web'e aktarım için ayrı entegrasyon PR'ları ve kabul kapıları.

## 0. Karar özeti ve temel prensipler
ScientificRadar makale okuyucusuna **aynı, bütünleşik makale sayfasında** sırasıyla üç yetenek grubu eklenecek:
- **M1 — Temel okuyucu deneyimi:** Makale türü etiketini belirginleştirme; editör onaylı Summary/Key Takeaways; A−/A/A+ metin boyutu kontrolü; sticky, aktif bölümü izleyen (scrollspy) başlık navigasyonu.
- **M2 — Bilimsel açıklama deneyimi:** Var olan Knowledge Links altyapısının Web adaptasyonu (Studio'nun kürasyonunu yeniden yazmadan), kaynağın/yayın statüsünün doğrulanabilir şeffaflığı, seçilmiş kritik terimler için sade bilgi kutuları.
- **M3 — Derinlemesine öğrenme:** Related Reading'den ayrı editör tarafından sıralanmış 2–5 makalelik isteğe bağlı “Reading Path”; editoryal sıra/amaç, mevcut içerikler için geçerli gerçek bağlantılar, içerik yetersizse gösterme.
**Konsept çizimlerdeki örnek sonuçlar gerçek bilimsel iddia veya doğrulanmış yayın bilgisi değildir.** Yeni özellikler yalnız gerçek, doğrulanmış metadata ile çalışmalıdır.

### Kapsam dışında
Dark Mode sonraki döneme ertelenmiştir. Yoğun parallax/scrollytelling, infinite scroll, otomatik kişiselleştirme, AI-generated summary veya otomatik bilimsel güvenilirlik puanı **yapılmayacak**. Yapay DOI, kaynaksız yayın türü, sahte kullanıcı istatistiği, sahte içerik ve güvenilirlik/öneri puanı gösterilmeyecek. Her makalede her panel zorunlu olmayacak.

## 1. Mevcut Web bileşenlerinin korunacak sözleşmesi
- `app/article/[slug]/page.tsx`: gerçek `contentRepository.getPublicArticle()`, `getAuthorsByIds()`, `getRelatedArticles()`. `ArticleHeader`, `ArticleReader`, `RelatedStories` korunur.
- `components/editorial/ArticleHeader.tsx`: `editorialType` etiketini `getEditorialTypeLabel()` ile zaten gösterir; ayrıca yayının dayandığı özgün çalışmanın **source type** alanıyla karıştırma.
- `components/editorial/ArticleReader.tsx`: masaüstü `xl:` sticky sol TOC ve `ResponsiveArticleToc`; H2 temel başlıkları; `bodyHtml` sanitizer ve blocks fallback; mevcut `key-takeaways` blokları; referans/figür/denklem/tablo; 700/600/560px **sütun genişliği karşılaştırması** (font-size kontrolü değildir). Bunları sıfırdan kopyalamak yerine geliştirme.
- Article figures/captions/citations/KaTeX/tables/footnotes, section IDs, reading width, no horizontal overflow ve canonical article slugs değişmeyecek. Framer'da UI proof yapılacak ama Next.js gerçek uygulama için ayrı React entegrasyon planı hazırlanacak.
- Studio KnowledgeLink records: internal/Wikipedia target, term/URL, editorially approved excerpt/source attribution; Web'de gerçek entegre olduğuna dair varsayım yok.
- Owner-approved warm paper `#FAFAF8`, surface `#F2F1EC`, teal `#15747b`, Merriweather/Inter, compact layout ve orijinal bilimsel SVG tasarımı korunur.

## 2. M1 — Temel okuyucu deneyimi
### 2.1 Makale türü
- News, Feature, Explainer, Research Digest ayrımı tipografik küçük, görünür bir etiketle açık; tek başına “Research Article”/hakemli araştırma iddiasında bulunmuyor.
- Gerçek Web `editorialType` kullanılır. Framer'da gerçek fixture ile gösterilir. Tip üzerinden renk kaosu veya dört ayrı UI kalıbı oluşturma.

### 2.2 Summary
- Başlık/dek sonrasında, makale metninden önce **kısa “Bu makalede” özeti**, tercihen 2–4 kısa editör kontrollü madde. Factual iddialar canonically supportable ve orijinal içerikten izlenebilir.
- `key-takeaways` mevcut ise aynı bilgiyi iki kez gösterme: özetin üstte mi içerik içindeki blokta mı yer alacağı seçilir; birincil aynı madde tekil. İki farklı özet iddiası oluşturma.
- Kaynak eksikse boş alan/otomatik “AI özeti” gösterme. Framer örnekleri açıkça demo/kavramsal.

### 2.3 Font size controls
- A− / A / A+; varsayılan orta, daha küçük/daha büyük 3 seviye. Kontrol `aria-label`, `aria-pressed`, erişilebilir 44px hedeflere uygun.
- Yalnız ana makale prose'unda ölçek; bilimsel SVG, denklemler, tablolar, caption, navigation, header layout bozulmaz. Tipografi basamakları makul (örn. 0.94/1/1.12) ve line-height/paragraph spacing korunur.
- Framer: React state. Web adapter daha sonra tercihi güvenli şekilde saklayabilir; hydration/CLS dikkate alınacak; okuyucu varsayılanı sansasyonel büyüklükte değiştirilmez.
- Font-size ile mevcut 700/600/560px **measure control** farklı özelliktir; dev review UI ile karıştırma.

### 2.4 Sticky TOC/scrollspy
- Desktop `xl` sol rail, ana prose sütunundan bağımsız; aktif H2 vurgulanır, varsa H3 alt bölümler seçici biçimde genişletilebilir. Zaman içinde tek aktif bölge, her başlığın gerçek DOM id'si ve link hedefi var.
- Sticky rail makale boyunca makul kalır; referanslara kadar izleme; sayfanın başında ve sonunda doğru davranır. Kendiliğinden scroll olurken kullanıcı odağı çalınmaz, URL hash keyfi değişmez.
- Başlık linki seçildiğinde ilgili bölüme gider; `prefers-reduced-motion` için anlık kaydırma, diğer durumda kontrollü smooth. Browser Back ve deep link semantiği korunmalı.
- Mobil/tablet: mevcut `ResponsiveArticleToc` açılır menü korunur; sabit sol rail yok. Ekran okuyucu `aria-current=\"location\"` veya eşdeğer erişilebilir current section bilgisi alır.
- H2/H3 başlıkları varsa içerik verisinden (sanitized HTML + blocks) türetilir; H3 yoksa uydurulmaz. H2 mevcut davranış korunur.

### M1 prototip/teslim kabulü
Tek Framer **Article Reading Experience Lab** sayfası üzerinde 320/390/810/1200px, gösterilebilir gerçek fixture, M1 kontrolleri. Etkileşimli A−/A/A+, TOC tıklama+scrollspy, gerçek summary kartı, responsive. Erişilebilir keyboard/focus, no root overflow, no typography clipping, Framer diagnostics=[], mevcut 7 lab korunur. M1 bittiğinde owner'a sunulur; M2 kendiliğinden başlamaz.

## 3. M2 — Bilimsel açıklama deneyimi
### 3.1 Knowledge Link previews
- Web'in mevcut wiki veya Studio bağlı sistemini **ilk önce tam denetle**, varsa yeniden inşa etme. Studio tarafından onaylanmış KnowledgeLink verisi iki hedef: `internal` (öncelikli makale içi), `wikipedia` (onaylanmış Wikipedia HTTPS).
- Popover açılma: desktop hover + keyboard focus, touch tap; Escape ve outside click ile kapanma, focus restoration; uzun kelimeler/kenarlar için akıllı yerleşim. Ekran okuyucu etiketleri anlaşılır.
- Terimlerin eşlemesi DOM text nodes bazında, link/citation/figure/KaTeX/code içine gömülmeden; sanitizer, XSS, güvenilir source attribution korunur.
- Wikipedia'nın otomatik canlı metnini istemci hover'ında indirme; editörce seçilmiş açıklama/snapshot kullan; gerekirse daha sonra güvenli cache API.

### 3.2 Bilimsel kaynak ve yayın şeffaflığı
- Web'in **kendi yayın türü** (News/Feature/Explainer/Research Digest) ile **özgün akademik kaynağın statüsü** (hakemli/preprint/derleme/diğer) bağımsız alanlar. Bilgi kaydı yoksa “bilinmiyor”; verified DOI/URL/actual published/updated/reviewed date dışında iddia yok.
- “Bu yazı neye dayanıyor?” şeklinde makul, açılabilir veya makale sonundaki source card; gösterilmeyen kaynak sayılarını üretme. Veri doğrulama ve attribution zorunlu.

### 3.3 Seçilmiş bilgi kutuları
- Knowledge Link ile aynı tanımı kopyalama. Yalnız kritik 0–2 kavram için editör onayıyla “Neden önemli?”/konuya özgü bağlam içeren panel.
- Wide desktop sağ boşluk varsa *opsiyonel* rail; tablet/mobilde metne yakın in-flow callout. Her bölüm değişiminde otomatik agresif panel değişimi veya çok sayıda sticky öğe yok.
- Merkezi 700px makale okuma kolonunu daraltma; sidebar olmadığı genişliklerde gizleme değil, içeriğin doğru yerde erişilebilir gösterimi.

### M2 kabulü
M1 çalışmayı sürdürür; en az bir onaylı terim + bir dahili makale bağlantısı + bir verified external wiki önizlemesi prototip; bir açıklayıcı bilgi kutusu; sıfır ikili tekrar ve verified source semantics. XSS/keyboard/mobile testleri, attribution ve no fake fact. Owner M2 kabulünde M3 başlar.

## 4. M3 — Derinlemesine öğrenme
- `RelatedStories` varsayılan algoritmik bağlantılar ile **Editorial Reading Path** (bilinçli ve sıralı öğrenme yolu) ayrılır. Uygunsa 2–5 mevcut canonical makale, `slug`, editor-approved order, hedef öğrenme amacı.
- “1 Başlangıç → 2 Mekanizma → 3 Derinleşme” gibi açıklayıcı etiketler; sahte progress tracking, kişiselleştirme, oyunlaştırma yapılmaz.
- Yeterli gerçek bağlantılı içerik yoksa Reading Path gizlenir veya Related Reading korunur. Aynı makale Reading Path ve Related listede tekrar ediyorsa dedupe veya açık UI tercihi.
- Mobil listede okunaklı; masaüstünde makale sonunda bir tek blok. Kaynak doğruluğu, URL geçerliliği ve editorial ownership şart.
### M3 kabulü
M1 + M2 + M3 **aynı Framer sayfasında birlikte** gösterilir; mobil/masaüstünde gereksiz panel yoğunluğu yok, en az iki makaleyi bağlayan demonstrasyon yolu (açıkça örnek), gerçek Web için yalnız veri sözleşmesi taslağı. Owner M3 kabulü sonrası ayrı integration handoff hazırlanır.

## 5. Altı tur iterative refinement — AŞAMA İÇİ VE SONRASI
Six-cycle bağımsız kontrol framework'ü uygulanır; rastgele altı yeni özellik ekleme döngüsü değildir:
1. **D1 Scope check:** Benzer Web bileşeni var mı? Mükerrer işlevleri reddet.
2. **D2 Scientific provenance:** Başlık, özet, yayın statüsü, terim ve URL canonical kaynağa uyuyor mu?
3. **D3 Interaction/a11y:** Pointer/keyboard/touch/focus/scrollspy/focus restoration/reduced-motion.
4. **D4 Responsive/prose integrity:** 320,390,810,1200; 320×568 kısa ekran; prose measure, figures/tables/citations, layout shift, root scroll.
5. **D5 Cost/performance/compatibility:** React+Next.js, dynamic import, hydration, no unnecessary dependencies, CMS editorial workload, URL/SEO.
6. **D6 Integrated critique:** M1+M2+M3 birlikte iken davranışlar çatışıyor mu? Gereksiz öğeleri çıkar, en düşük gerekli kullanıcı etkileşimini koru.
Her döngü belgeyle PASS/FAIL/BLOCKED kaydedilir. Framer preview testleri ile real Web e2e farklı kanıttır; user/owner onayı olmadan publication yok.

## 6. Entegre tek sayfa mimarisi
- Top: `ArticleHeader` = category + editorialType + title/dek + source verified metadata, figure (mevcut).
- Heading sonrası: M1 summary ve A−/A/A+; göreli sakin, ekranı kalabalıklaştırmaz.
- Desktop xl: sol scrollspy TOC / orta 700px prose / sağ **yalnızca gerekli** kaynak/bilgi kutusu; bilgi kutusu boşsa sağ simetri boşluk veya narrow layout. Tablet/mobile: TOC disclosure, info-box inline.
- Prose: M2 KnowledgeLink popovers / seçilmiş editorial information callout; figure/citation/math/tables unaffected.
- Article end: verified sources, editorial reading path (M3 optional), Related Scientific Reading. Modal/popup aynı anda yalnız doğru element için açık.
- Component boundaries suggested: `ReaderSummary`, `ReaderFontControls`, `ArticleScrollspyToc`, `KnowledgeLinkAdapter`, `SourceTransparencyPanel`, `KeyConceptCallout`, `EditorialReadingPath`. Prototype names are tentative; no unnecessary Web code duplication.

## 7. Ölçüm ve release kapıları
### Framer prototip testleri
- No Index, not published, same page across milestones, intact existing labs.
- 320/390/810/1200, short viewport; tab/shift-tab, input, click, scrollspy highlight, aria-current, font zoom, reduced motion, focus, horizontal overflow; headings and footnotes visible.
- Owner usability review for sidebar density, summary value, language/terminology.
### Web integration acceptance (SEPARATE, not authorized yet)
- Preserves source `contentRepository` public-only contract, sanitization, headings/anchors/refs/citations, actual published metadata; no Framer fixture copy as production backend.
- Playwright desktop/mobile automated tests incl deep link/reduced-motion keyboard/no horizontal overflow, article figures, KaTeX, TOC and history; accessibility automated + manual; browser performance LCP/INP/CLS as real benchmarks, no invented gains.
- Phase-scoped PRs behind appropriate review: none to main prior to owner consent. Docs PR is not implementation approval.

## 8. Milestone checklist and current state
- [x] **M0 — Roadmap**: scope, accepted choices, contracts and test gates documented (2026-11-07).
- [ ] **M1 — Framer Basic Reading**: visible prototype + tested summary/font/scrollspy/article type; report and owner return.
- [ ] **M2 — Framer Scientific Explanation**: validated Knowledge Link/verified source information/optional key concept cards; report and owner return.
- [ ] **M3 — Framer Editorial Reading Path**: opt-in ordered related article route, integrated layout; report and owner return.
- [ ] **M4 — Codex + ChatGPT review**: real Brave independently tested across phases + integrated page; six-cycle critique, targeted retouch; owner final review.
- [ ] **M5 — Web adaptation decision**: separate, later code branch/PR only after owner permission.
### Explicit handoff rule
M1 → owner receives report → M2; M2 → owner receives report → M3; M3 → owner receives report → Codex integrated QA. Do not claim done from an unchanged plan.
