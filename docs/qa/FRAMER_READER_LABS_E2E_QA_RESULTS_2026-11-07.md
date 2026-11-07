# Framer Reader Labs — bağımsız E2E QA sonuçları

**Tarih:** 2026-11-07
**Durum:** Kısmi doğrulama; genel E2E kabulü verilmedi.
**Kapsam:** PR #50’deki özgün 36 kabul kriterini aynı ID ve anlamla eşleştirir.
**Ortam:** Kimliği doğrulanmış Brave oturumu; Framer’ın kendi Preview iframe’i; Playwright locator/klavye etkileşimleri ve DOM ölçümleri.

## Test edilen doğru Framer hedefleri

Orijinal mission’daki proje kimliği `boKLyC3EXgf7Nhs9yoC7` ve proje yolu `Scientific-Radar--boKLyC3EXgf7Nhs9yoC7-3fySI` olarak doğrulandı. Canlı sekmede bu tam proje yolu ve aşağıdaki dört node görüldü. Preview iframe belge/alan adı `project-boklyc3exgf7nhs9yoc7.framercanvas.com`; bu ad kanonik proje ID’sinin küçük harfle normalize edilmiş tabanıyla eşleşiyor. Bu, farklı bir projeye gidildiğine dair kanıt değil.

| Laboratuvar | Node ID | Doğru preview URL |
|---|---|---|
| Scientific Figure Lab V6 | `OFNHTB3Jx` | `https://framer.com/projects/Scientific-Radar--boKLyC3EXgf7Nhs9yoC7-3fySI?node=OFNHTB3Jx&view=preview` |
| Citation Interaction Lab V2 | `sHFu4J1jX` | `https://framer.com/projects/Scientific-Radar--boKLyC3EXgf7Nhs9yoC7-3fySI?node=sHFu4J1jX&view=preview` |
| Mobile Reading Stress Lab V2 | `EOyWe1e9E` | `https://framer.com/projects/Scientific-Radar--boKLyC3EXgf7Nhs9yoC7-3fySI?node=EOyWe1e9E&view=preview` |
| Integrated Article Reader Lab V1 | `L0EEZeigV` | `https://framer.com/projects/Scientific-Radar--boKLyC3EXgf7Nhs9yoC7-3fySI?node=L0EEZeigV&view=preview` |

**Önceki rapor düzeltmesi:** PR #51’in ilk sürümünde URL’lerde yanlış `ScientificRadar--bokly6P8O8uMQLPqRMSv-4IZ` yolu yazılmıştı. Bu rapor doğru kanonik yolu kullanır. Doğru Framer sekmesinde her dört node’un testi yapıldı; URL yazım hatası rapor metnindeydi. Her prototipin iframe belge URL’sini ayrı ayrı yeniden kaydetmiş bir artefakt yoktur; proje/host eşleşmesi gözlenen canlı sekme ve önceki salt okunur Framer katalog/ağaç incelemesine dayanır.

## Kanıt ve durum ölçütü

- **PASS:** Özgün kriterin tamamı doğrudan test edildi ve karşılandı.
- **FAIL:** Özgün kriterin karşılanmadığı, yeniden üretilebilir bir test gözlemi var.
- **BLOCKED:** Kriterin bir bölümü çalıştırıldıysa da kabul kapsamının tamamı için yeterli kanıt yok.

Framer Preview içinde 1200, 810, 390 ve 320 CSS px genişlikleri kullanıldı. Ölçümler iframe’in `innerWidth` / `documentElement.clientWidth` değerlerinden alındı; dış tarayıcı genişliğiyle karıştırılmadı. Aşağıdaki kayıtlar gerçek etkileşim/DOM ölçümleridir; CI testi değildir. Ekran görüntüsü canlı oturumda görüntülendi, ancak bu tarayıcı köprüsü yerel screenshot veya Playwright trace dışa aktarmadı. `:hover`/pointer hareketi için BetterTouchTool fare taşıma denemeleri iframe’de gerçek `:hover` durumu oluşturmadı; touch emülasyonu ve Playwright pointer/drag API’si bulunmadığından bu kontroller çalıştırılamadı. DOM’a sentetik olay gönderilmedi.

## Özgün 36 kabul kriteriyle bire bir sonuçlar

### F — Scientific Figure Lab

| ID ve özgün kapsam | Durum | Viewport | Kanıt / eksik doğrulama |
|---|---|---:|---|
| **F01 / P0** — Figure Lab ilk açılışta görünür; kullanıcı isteyene kadar inspector kapalı | **PASS** | 1200 | Doğru Figure node’unda sayfa ve figür render oldu; başlangıçta inspector/dialog sayısı 0, `Expand & inspect` kontrolü bulundu. |
| **F02 / P0** — Bir erişilebilir modal açılır; arka plan kaymaz; Close ve Escape kapatır; odak tetikleyiciye döner | **PASS** | 320 | Bir `role=dialog` açıldı; `body` overflow kilidi gözlendi; Close ve Escape ile kapandı; kapandıktan sonra odak `Expand & inspect` düğmesine döndü. Tab sıralaması dialog içinde kaldı. |
| **F03 / P0** — Slider, +, −, Reset 75–300% sınırlarında; görünen değer eşleşir; Reset 100% | **PASS** | 320 | Slider `min=75`, `max=300`, `step=25`; Home=75%, End=300%, Reset=100%; + ile 100→125%, − ile 125→100% gözlendi. |
| **F04 / P0** — I/II/III veya 1/2/3 seçimi 390/320’de doğru durumu/metni seçer ve bölgeyi stage içinde gerçekten ortalar | **BLOCKED** | 390, 320 | I/II/III düğmeleri ilgili metni değiştirdi ve stage `scrollLeft` değerleri önceki ölçümde 390’da 0/185/370, 320’de 0/210/420 idi. Ancak seçili görsel alt bölgenin stage merkezine göre hedef geometrisi ölçülmedi; her bölge için ekran görüntüsü/merkez farkı ve 1/2/3 klavye kısayolu kanıtı yok. Kaydırma ofseti tek başına merkezlenmeyi kanıtlamaz. |
| **F05 / P1** — Zoom sonrası fare drag pan; touch scroll; sürükleme ardından aynı bölge seçilince yeniden merkezleme | **BLOCKED** | 320, 390 | Pointer move/drag ve gerçek touch girdisi mevcut köprüyle üretilemedi. Bu nedenle pan, touch scroll ve sürükleme sonrası yeniden merkezleme sınanmadı. |
| **F06 / P1** — Caption toggle attribution/provenance’i korur; image alt ve illustrative-asset uyarısı bulunur | **BLOCKED** | 390 | Açık metinde `FIG-SR-2026-01`, “Original ScientificRadar illustrative demo”, “CC0-labelled asset” ve yayın öncesi bilimsel doğrulama uyarısı görüldü; anlamlı image alt metni vardı. Caption düğmesi kapatılıp açıldı; ancak kapalı/açık iki durumda caption ve attribution alanlarının birlikte görünürlük koşulu için yeterince hedefli assert/artefakt alınmadı. |
| **F07 / P1** — Tab/Shift+Tab odak modal dışına çıkmaz; dark theme’de görünür odak; desktop ve mobile | **BLOCKED** | 320, 1200 | 320’de Tab ile dialog içindeki 11 kontrol arasında döngü, Escape ve odak iadesi gözlendi. Citation [1] keyboard odağındayken 3 px `rgb(18,104,112)` outline ölçüldü. Shift+Tab sınırı, modalda desktop/mobile tam dolaşım ve dark-theme kontrast/legibility tamamlanmadı. |
| **F08 / P1** — Dört genişlikte sayfa taşması/üst üste binme yok; izinli pan yalnızca figürde | **BLOCKED** | 1200, 810, 390, 320 | Sayfa `scrollWidth=clientWidth` ve body genişliği eşit ölçüldü. Kontrol çakışması bütün breakpoint’lerde ölçülmedi; figür içi pan ve sayfa scroll’undan ayrımı F05’in engeli nedeniyle doğrulanmadı. |

### C — Citation Interaction Lab

| ID ve özgün kapsam | Durum | Viewport | Kanıt / eksik doğrulama |
|---|---|---:|---|
| **C01 / P0** — Desktop hover [1]/[2]/[3] ilgili kaynak kartını açar; mouseleave kapatır; focus çalmaz | **BLOCKED** | 1200 | Hover/mouseleave girdisi üretilemedi; kartın içeriği, kapanışı ve focus etkisi test edilmedi. |
| **C02 / P0** — Click numaralı citation’ı eşleşen kayda götürür/vurgular; click tooltip/modal açmaz | **PASS** | 320 | [1]/[2]/[3] tıklamaları `#sr-lab-reference-0..2` hedeflerine götürdü; hedeflerde outline ve teal/light arka plan vardı; tıklama dialog açmadı. |
| **C03 / P0** — Touch/mobile tap hover gerektirmeden bibliography’ye gider | **BLOCKED** | 320, 390 | Playwright click ile mobil genişlikte citation jump görüldü; bu gerçek touch/tap girdisi değildir. Touch davranışı ayrıca kanıtlanmadı. |
| **C04 / P1** — “Back to article citation” doğru önceki okuma noktasına döner; focus öngörülebilir | **FAIL** | 390 | Tekrar üretim: Citation preview 390 px’te başlangıç `scrollY=0`; [1] tıklaması bibliography’ye götürdü; “Back to article citation” sonrasında aktif element doğru [1] düğmesi ve görünür 3 px outline oldu, fakat sayfa `scrollY=251` ölçüldü. Odak hedefi doğru, önceki viewport konumu aynı değil; önceki okuma konumunun tam iadesi karşılanmadı. |
| **C05 / P1** — Hover üst/alt/sol/sağ kenarda kırpılmaz/taşmaz; Escape tooltip’i kapatır | **BLOCKED** | 320, 390, 1200 | Hover/mouse konumu ve tooltip Escape senaryosu çalıştırılamadı. |
| **C06 / P0** — Demo uyarısı açık; DOI/iddia uydurma yok; generic portal alıntılanan çalışma gibi sunulmaz | **PASS** | 320 | Prototype notu referansların illustrative demo fixture olduğunu ve DOI uydurulmadığını belirtiyor; kayıtlar “DOI not recorded” gösterdi; incelenen DOM’da dış bağlantı bulunmadı. |
| **C07 / P1** — Citation keyboard focus kaynak bilgisini gösterir; blur tooltip’i kapatır, klavyeyi kilitlemez | **BLOCKED** | 390 | Citation [1] gerçek klavye odağı aldı; görünür outline ölçüldü; `role=tooltip` sayısı 0 idi. Hover koşulu test edilemediğinden focus/blur tooltip davranışının kabulü tamamlanmadı. |

### T — Mobile Reading Stress Lab

| ID ve özgün kapsam | Durum | Viewport | Kanıt / eksik doğrulama |
|---|---|---:|---|
| **T01 / P0** — 390 ve 320’de Row focus varsayılan; beş malzeme × beş fixture değeri ve tam birimler | **PASS** | 390, 320 | İki genişlikte varsayılan görünüm Row focus idi. Her malzeme için beş definition okundu. Sıra: yoğunluk, Young modülü, ultimate stress, fracture strain, toughness. Dragline: `1.31 g·cm⁻³, 10.5 GPa, 1.25 GPa, 28.0 %, 165 MJ·m⁻³`; Flagelliform: `1.30, 0.003, 0.50, 240.0 %, 150`; Bombyx: `1.34, 7.0, 0.60, 18.5 %, 70`; Kevlar: `1.44, 130.0, 3.60, 2.7 %, 50`; Carbon Steel: `7.85, 200.0, 1.50, 1.8 %, 12` (her satırdaki birimler aynı sütun sırasına göre). Her iki genişlikte seçici üzerinden beş malzeme sırayla seçildi. |
| **T02 / P0** — Tüm viewport’larda matrix erişilebilir; yatay scroll matrix içinde; ad sütunu sticky; body taşmaz | **BLOCKED** | 1200, 810, 390, 320 | 320’de matrix scroller 284 px viewport / 980 px content; ilk sütun başlığı sticky idi ve belge genişliği 320 kaldı. Dört genişlikte belge taşması görülmedi; ancak matrix’in kendi kaydırması/sticky davranışı her genişlikte doğrudan test edilmedi. |
| **T03 / P0** — 320’de ilk sütun adları sıkı biçimde sarılır; numeric sütun görünür; tablo semantiği ilişkileri doğru | **BLOCKED** | 320 | İlk başlık sticky, sonraki numeric başlık x=174–301 px aralığında görünür ve başlık/satır hücreleri semantik table/columnheader/row olarak okunur. Ad hücrelerinin dar genişlikte gerçekten wrap ettiği ayrı ölçülmedi. |
| **T04 / P1** — Desktop iki görünümü çalıştırır; geçiş veri uydurmaz/kaybettirmez | **BLOCKED** | 810, 1200 | 810 px’te Matrix, 390/320’de Row focus varsayılanı görüldü ve her iki görünüm seçilebilir. Desktop’ta iki görünüm arasında tüm verilerin değişmeden kaldığını karşılaştıran tam assert yapılmadı. |
| **T05 / P0** — Equation tek modal açar; değişkenler/formül 320/390’de okunur; Escape/Close çalışır; odak tetikleyiciye döner | **BLOCKED** | 320, 390 | 320’de tek dialog, tam ifade, değişken açıklaması ve örnek değer uyarısı; Escape sonrası `Inspect equation` odak iadesi gözlendi. 390 px’te modal okunurluğu ile Close düğmesi davranışı ayrıca doğrulanmadı. |
| **T06 / P1** — Klavye table switch, selector, scrollable table ve equation inspector’ı çalıştırır | **BLOCKED** | 320 | Modal Escape/odak iadesi görüldü; switch, selector, tablo içi yatay kaydırma ve equation tetikleyicisinin yalnız klavyeyle uçtan uca dolaşımı tamamlanmadı. |
| **T07 / P0** — Sayılar illustrative, deneysel sonuç gibi sunulmaz; birimler sessizce değişmez | **PASS** | 320, 390 | “Illustrative benchmarks”, development fixture ve ölçülmüş/verified dataset olmadığı açıklaması görünür. T01’de ölçülen sayılar ve birimler 320/390’de aynı fixture ile eşleşti. |
| **T08 / P1** — Uzun adlar, math yatay kayması, 320 px, büyütülmüş/large text | **BLOCKED** | 320 | 320’de denklem yerel genişliği 256 px / client 254 px; document width 320 idi. Uzun material adı kırılımı ve zoom/large-text ayarı denenmedi. |

### I — Integrated Article Reader Lab

| ID ve özgün kapsam | Durum | Viewport | Kanıt / eksik doğrulama |
|---|---|---:|---|
| **I01 / P0** — Citation, figure ve table/equation aileleri birlikte; 1200/810/390/320 makale genişliği bozulmaz | **PASS** | 1200, 810, 390, 320 | Dört genişlikte integrated sayfa yüklendi; sayfa/body genişliği viewport’a eşitti, yatay document overflow ölçülmedi. Üç etkileşim ailesi preview DOM’unda mevcuttu. |
| **I02 / P0** — Figure/equation tek overlay durumu; aynı anda iki modal yok; body scroll kilidi/iadesi | **PASS** | 320 | Figure açıkken equation tetikleme ikinci dialog oluşturmadı; figure kapandıktan sonra equation tek dialog olarak açıldı. Modal açık/kapalı body overflow `hidden`/`visible` olarak gözlendi. |
| **I03 / P0** — Başka inspector aç/kapa sonrası desktop hover ve tüm cihazlarda click-to-reference | **BLOCKED** | 320, 1200 | Citation click bibliography hedefini vurguladı; ancak başka inspector sonrası hover ve tüm cihazlarda tekrarlı click akışı doğrulanmadı. |
| **I04 / P0** — Mobile Row focus varsayılan; Matrix isteğe bağlı; sayısal kaynak değer/birimleri aynı | **BLOCKED** | 320, 390 | Mobile Row focus varsayılanı, Matrix seçilebilirliği ve örnek satır değerleri görüldü; tüm beş malzemenin entegre okuyucuda her iki görünümde parity assert’i yapılmadı. |
| **I05 / P0** — Viewport değişince stage içinde doğru region merkezlenir; her modal Escape ve focus restore | **BLOCKED** | 1200→320 | Figure dialog 1200’de açıldı; region III seçildi; açık modal 320 px’e yeniden boyutlandırıldı; Escape sonrası dialog kapandı, body overflow normale döndü, odak `Inspect figure` tetikleyicisine geldi. Equation dialog 320 px’te açılıp Close ile kapatıldı; odak `Inspect equation` tetikleyicisine döndü. Fakat resize sonrası seçili görsel bölgenin geometrik merkezlendiği ispatlanmadı; bu nedenle tam kriter PASS değil. |
| **I06 / P1** — Her modal kapanınca klavye/pointer focus kendi tetikleyicisine döner | **PASS** | 320 | Figure Escape sonrası aktif düğme `Inspect figure`; equation Close sonrası aktif düğme `Inspect equation` olarak DOM’dan ölçüldü. |
| **I07 / P1** — 320’de gizli/hapsolmuş aksiyon kontrolü ve body yatay scroll’u yok | **BLOCKED** | 320 | Body/document genişliği 320 idi ve sıra ile figure/equation/citation kullanıldı. Gizli aksiyon kontrolleri ile tam keyboard order/touch erişimi incelenmedi. |
| **I08 / P0** — Provenance, DOI uydurmama, istenmeyen dış link yok, demo ile bilimsel doğrulama ayrımı | **PASS** | 320 | Figure alt/provenance metni illustrative demo ve yayın öncesi doğrulama uyarısını içerdi; citation demo uyarısı ve “DOI not recorded” bulundu; incelenen preview DOM’unda istenmeyen dış referans bağlantısı yoktu. |

### X — Cross-cutting

| ID ve özgün kapsam | Durum | Viewport | Kanıt / eksik doğrulama |
|---|---|---:|---|
| **X01 / P0** — Framer Preview’de doğru prototip; generic Denzel/başka hedefse INVALID | **PASS** | tümü | Dört node ID, özgün missiyondaki `Scientific-Radar--boKLyC3EXgf7Nhs9yoC7-3fySI` proje yolu altında açıldı. Citation iframe belgesi `project-boklyc3exgf7nhs9yoc7.framercanvas.com` idi ve içerik Citation Lab idi; generic yayınlanmış Denzel sayfası değildi. Önceki rapordaki URL metin hatası yukarıda düzeltildi. |
| **X02 / P0** — Erişilebilirlik: adlandırılmış semantic buttons, görünür focus, Escape, trap/restore, hedef boyutu, modal stacking | **BLOCKED** | 320, 390, 1200 | Birçok düğme erişilebilir ada sahip; modal kapanışları/odak dönüşü ve citation focus outline gözlendi. Bununla birlikte tüm lab/breakpoint’lerde hedef boyutu, Shift+Tab/focus trap ve dark-theme kontrolü tamamlanmadı; touch da test edilemedi. |
| **X03 / P1** — Anahtar durum ekran görüntüleri ve hata trace/video; log ve gerçek viewport ölçüleri | **BLOCKED** | tümü | Viewport ve DOM ölçümleri kaydedildi. Canlı screenshot görüntülendi; kalıcı screenshot, trace/video ve başarısız koşul trace’i dışa aktarılamadığından PR’ye artefakt eklenmedi. |
| **X04 / P0** — DNS/domain, Framer publish, app migration, ücretli servis ve auth dosyası yok | **PASS** | uygulanamaz | Framer/API kontrolleri salt okunurdu; app kodu, DNS, yayın, bağımlılık/ücret ve auth dosyalarına değişiklik yok. PR rapor amaçlıdır ve hiçbir PR birleştirilmedi. |
| **X05 / P1** — Mevcut `ArticleReader.tsx` ve `ScientificFigure.tsx` ile prototip kıyaslaması; entegrasyon ayrı onaya tabi | **PASS** | salt okunur kaynak kıyası | Mevcut `ArticleReader.tsx` citation’ları içerik kimliğine bağlı `#cite-${srcId}` → `#ref-${srcId}` içi anchor’larla kurar; `CitationList.tsx` kontrollü kaynak/illustrative kayıtlarını ve yalnız varsa portal bağlantısını gösterir. `ScientificFigure.tsx` Next Image alt metni, caption, credit ve lisansı render eder; prototype’a özgü yakınlaştırma/region inspector’ı yoktur. Framer Figure ve Citation prototipleri bu etkileşimleri deneysel olarak ekler; bu gözlem taşımayı veya uygulama parity’sini onaylamaz. Kaynak kıyası salt okuma yapıldı. |

**Dağılım:** 14 PASS, 1 FAIL, 21 BLOCKED. Buradaki PASS sayısı PR #51’in önceki 24 PASS’inden düşük; özgün kriter kapsamı ve inceleme yorumundaki ID eşlemesi esas alındı. Kısmi alt gözlemler ilgili kriteri PASS yapmak için kullanılmadı.

## C04 hedefli regresyon — eski FAIL ve yeni sonuç

PR #51’in son C04 düzeltme yorumu, güncellenmiş Citation V3 ve Integrated Reader V2 prototiplerinde önceki `scrollX/scrollY` değerini saklayıp geri yükleme ve odağı aynı citation düğmesine verme davranışını tanımlıyor. Aşağıdaki testler kimliği doğrulanmış Brave oturumunda, gerçek Framer Preview iframe’inde, iframe içi `innerWidth`, `scrollX/scrollY`, citation bounding box’ı ve `document.activeElement` okunarak yürütüldü. Her dönüşten sonra 0.9–1.1 saniye beklenerek animasyon sonu ölçüldü.

Önceki rapordaki C04 **FAIL** (390 px, başlangıç `scrollY=0`, dönüş `251`; doğru citation odaklı) tarihsel sonuç olarak korunmuştur. Bu yeni regresyon turu da **FAIL**: odak test edilen durumların hepsinde doğru citation düğmesine döndü, fakat konum her seferinde 2 px sınırını aştı.

| Prototip / node | Genişlik | Citation | Başlangıç `(x,y)` | Bibliyografyaya gidiş `(x,y)` | Dönüş `(x,y)` | `Δy` | Odak | Sonuç |
|---|---:|---:|---:|---:|---:|---:|---|---|
| Citation Interaction Lab V3 / `sHFu4J1jX` | 390 | [1] | `(0,0)` | `(0,1076.5)` | `(0,244.5)` | `+244.5` | Aynı [1] düğmesi | FAIL |
| Citation Interaction Lab V3 / `sHFu4J1jX` | 320 | [1] | `(0,0)` | `(0,1281)` | `(0,367)` | `+367` | Aynı [1] düğmesi | FAIL |
| Citation Interaction Lab V3 / `sHFu4J1jX` | 390 | [2] | `(0,550)` | `(0,1163)` | `(0,505)` | `−45` | Aynı [2] düğmesi | FAIL |
| Citation Interaction Lab V3 / `sHFu4J1jX` | 390 | [3] | `(0,505)` | kaynak listesine | `(0,505)` | `0` | Aynı [3] düğmesi | PASS (bu durum) |
| Citation Interaction Lab V3 / `sHFu4J1jX` | 320 | [2] | `(0,652)` | kaynak listesine | `(0,652)` | `0` | Aynı [2] düğmesi | PASS (bu durum) |
| Citation Interaction Lab V3 / `sHFu4J1jX` | 320 | [3] | `(0,652)` | kaynak listesine | `(0,652)` | `0` | Aynı [3] düğmesi | PASS (bu durum) |
| Integrated Article Reader Lab V2 / `L0EEZeigV` | 390 | [1], Figure ve Equation aç/kapatıldıktan sonra; temiz üst konum | `(0,0)` | `(0,2657)` | `(0,253)` | `+253` | Aynı [1] düğmesi | FAIL |
| Integrated Article Reader Lab V2 / `L0EEZeigV` | 390 | [3], panellerden sonra; başlangıç 253 | `(0,253)` | `(0,2735)` | `(0,422)` | `+169` | Aynı [3] düğmesi | FAIL |
| Integrated Article Reader Lab V2 / `L0EEZeigV` | 320 | [1], başlangıç 461 | `(0,461)` | `(0,3214)` | `(0,362)` | `−99` | Aynı [1] düğmesi | FAIL |
| Integrated Article Reader Lab V2 / `L0EEZeigV` | 320 | [3], başlangıç 362 | `(0,362)` | `(0,3365)` | `(0,559)` | `+197` | Aynı [3] düğmesi | FAIL |

Integrated Reader 390 px’te Figure (`⤢ Inspect figure`) ve Equation panelleri açılıp kapatıldı; ikisinde de dialog kapandı ve odak ilgili açıcı düğmeye döndü. Citation testleri bu etkileşimlerden sonra aynı sayfa oturumunda yapıldı. 320 px’te bu regresyon turunda panel aç/kapat adımları tamamlanmadı; dolayısıyla 320 px panel-sonrası alt kapsamı **doğrulanmadı**. Başlangıçta sıfır konumla ölçülen citation regresyonları Citation V3 [1] ve Integrated Reader [1] (390 px) idi. Reader 320 px’in iki citation ölçümü panel-sonrası sıfır olmayan başlangıçlardan alındı; sıfır başlangıç koşulu için PASS/FAIL kanıtı sayılmamalıdır.

Bu tablo sınırlı regresyon örneklerini gösterir, C04 kabul kriterini PASS yapmaz. Özellikle sıfır başlangıçtan sonra odak iadesi sayfayı sıfırdan uzağa taşıyor; nonzero durumlarda da V3 [2] ve Integrated Reader örneklerinde dönüş sapması tekrarlanıyor. Preview içindeki iframe `window` scroll değerleri ölçüldü; gerçek cihaz touch/hover/drag veya erişilebilirlik kapsamı bu testte sınanmadı. Genel dağılım ve diğer 21 BLOCKED sınıflandırması değiştirilmedi.

## Framer canvas uyarısı — bağımsız bulgu

Doğru proje/node URL’lerinde her dört lab’ın Preview başlık ve içeriği yüklendi. Aynı Framer editor DOM snapshot’ında canvas/sandbox ağaçlarında ayrıca `Error in local-module:<component>:default` ve `Component file does not exist.` metinleri tekrarlandı. Bu turdaki snapshot örnekleri:

| Node | Canvas fallback’ında geçen code component ID | Snapshot’taki fallback metin sayısı |
|---|---|---:|
| Figure `OFNHTB3Jx` | `codeFile/aSqGzef:default` | 3 |
| Citation `sHFu4J1jX` | `codeFile/QJHlUlg:default` | 1 |
| Stress `EOyWe1e9E` | `codeFile/JAsq_aM:default` | 4 |
| Integrated `L0EEZeigV` | `codeFile/FdV5_zr:default` | 4 |

Bu sayılar erişilebilir snapshot’taki tekrar eden canvas/iframe metinleridir; ayrı kullanıcı uyarısı veya dört ayrı arıza sayımı olarak yorumlanmamalıdır. Citation’da hata satırı 1.2 saniyelik bekleme sonrası görünür oldu; dolayısıyla ilk hızlı örneklerdeki yokluk, hatanın kalıcı yokluğunu göstermiyordu. Preview içerikleri render olurken gizli canvas/sandbox fallback’ının görünmesi, sorunu yalnızca Figure/Stress’e özgü olmaktan çıkarıp dört code component’in Framer editor canvas temsiline yayıyor.

Önceki salt okunur Framer API kontrolünde dört component yolu katalogda kayıtlıydı; sayfa instance referansları doğru ID’lerdeydi ve kaynak dosyaları mevcut/non-empty idi: Figure `vUv8dh1KM` → `codeFile/aSqGzef` (`OlQyxTyxG`), Citation `ECqnR2aW8` → `codeFile/QJHlUlg` (`aYMuzhqNs`), Stress `W1EtvXZUF` → `codeFile/JAsq_aM` (`Mq0iRVpEq`), Integrated `Ex_EXdPAt` → `codeFile/FdV5_zr` (`iAJneml6h`). Ağaç değişikliği sayısı `changedNodeCount: 0` idi. Bu bulgular literal proje dosyası yokluğu iddiasını çürütür, fakat Framer canvas fallback hatasını çözmez. Kök neden ve kullanıcıya etkisi açık kalır; cache/registry/editor-state yalnız hipotezdir. Dosya silme/yeniden yaratma veya tasarım değişikliği yapılmadı.

## Sonuç ve sınır

Doğru Framer projesinde çekirdek click tabanlı etkileşimlerin bir kısmı ve responsive genişlikler gözlendi. Citation dönüşü C04’te test kapsamındaki önceki scroll konumuna dönmediği için bir FAIL kaydedildi. Hover/touch/drag, tüm accessibility kapıları, F04/I05 gerçek geometrik merkezleme ve kalıcı screenshot/trace kanıtları hâlâ tamamlanmadı. Sonuç **kısmi QA**’dır; Web’e taşıma veya yayın kararı değildir.
