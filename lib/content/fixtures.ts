import {
  PublicArticle,
  PublicAuthor,
  PublicCategory,
} from "./types";

export const DEMO_CATEGORIES: PublicCategory[] = [
  {
    id: "cat-physics",
    slug: "physics",
    name: "Physics",
    shortDescription: "Quantum matter, astrophysics, optics, and fundamental interactions.",
    description:
      "Investigations into condensed matter, quantum information, statistical mechanics, and cosmic structure.",
    subcategories: [
      {
        id: "sub-quantum-matter",
        slug: "quantum-matter",
        name: "Quantum Matter",
        description: "Topological phases, superconductivity, and quantum coherence.",
      },
      {
        id: "sub-soft-matter",
        slug: "soft-matter-mechanics",
        name: "Soft Matter & Mechanics",
        description: "Rheology, polymer networks, and non-equilibrium continuum physics.",
      },
      {
        id: "sub-astrophysics",
        slug: "astrophysics-cosmology",
        name: "Astrophysics & Cosmology",
        description: "Stellar dynamics, gravitational waves, and early-universe physics.",
      },
    ],
  },
  {
    id: "cat-biology",
    slug: "biology",
    name: "Biology",
    shortDescription: "Evolutionary physiology, structural biomaterials, and cellular systems.",
    description:
      "How living systems assemble molecular machinery, adapt across extreme habitats, and encode evolutionary history.",
    subcategories: [
      {
        id: "sub-biomaterials",
        slug: "structural-biomaterials",
        name: "Structural Biomaterials",
        description: "Hierarchical protein fibers, biomineralization, and natural composites.",
      },
      {
        id: "sub-evolutionary-physiology",
        slug: "evolutionary-physiology",
        name: "Evolutionary Physiology",
        description: "Comparative biochemistry, respiration, and metabolic adaptation.",
      },
      {
        id: "sub-cellular-dynamics",
        slug: "cellular-dynamics",
        name: "Cellular Dynamics",
        description: "Organelle architecture, membrane transport, and signaling.",
      },
    ],
  },
  {
    id: "cat-medicine",
    slug: "medicine-health",
    name: "Medicine & Health",
    shortDescription: "Molecular therapeutics, epigenome engineering, and immunology.",
    description:
      "Translational science examining genome regulation, immune repertoire dynamics, and precision therapeutics.",
    subcategories: [
      {
        id: "sub-epigenetics",
        slug: "epigenome-engineering",
        name: "Epigenome Engineering",
        description: "Programmable chromatin remodeling and non-cleaving gene modulation.",
      },
      {
        id: "sub-immunology",
        slug: "systems-immunology",
        name: "Systems Immunology",
        description: "Antigen recognition, mucosal immunity, and inflammatory resolution.",
      },
    ],
  },
  {
    id: "cat-chemistry",
    slug: "chemistry",
    name: "Chemistry",
    shortDescription: "Bioinorganic catalysis, prebiotic geochemistry, and solid-state interfaces.",
    description:
      "Molecular coordination, catalytic reaction networks, and electrochemical energy storage.",
    subcategories: [
      {
        id: "sub-bioinorganic",
        slug: "bioinorganic-chemistry",
        name: "Bioinorganic Chemistry",
        description: "Transition-metal active sites, metalloproteins, and electron transfer.",
      },
      {
        id: "sub-prebiotic",
        slug: "prebiotic-chemistry",
        name: "Prebiotic Geochemistry",
        description: "Mineral-catalyzed carbon fixation and origin-of-life reaction pathways.",
      },
      {
        id: "sub-electrochemistry",
        slug: "electrochemistry",
        name: "Solid-State Electrochemistry",
        description: "Ion transport in ceramic electrolytes and interfacial kinetics.",
      },
    ],
  },
  {
    id: "cat-technology",
    slug: "technology",
    name: "Technology",
    shortDescription: "Neuromorphic computing, photonic interconnects, and scientific instrumentation.",
    description:
      "Physical computing architectures, nanoscale sensing, and next-generation experimental hardware.",
    subcategories: [
      {
        id: "sub-neuromorphic",
        slug: "neuromorphic-computing",
        name: "Neuromorphic Computing",
        description: "Analog in-memory compute, memristive crossbars, and spiking architectures.",
      },
      {
        id: "sub-instrumentation",
        slug: "precision-instrumentation",
        name: "Precision Instrumentation",
        description: "Cryo-EM detectors, interferometry, and autonomous lab systems.",
      },
    ],
  },
  {
    id: "cat-earth",
    slug: "earth-climate",
    name: "Earth & Climate",
    shortDescription: "Tectonic geodesy, paleoclimate archives, and atmospheric radiative physics.",
    description:
      "Crustal deformation mechanics, ice-core geochemistry, and ocean-atmosphere coupling.",
    subcategories: [
      {
        id: "sub-tectonics",
        slug: "tectonic-geodesy",
        name: "Tectonic Geodesy & Seismology",
        description: "Fault creep, GNSS strain fields, and lithospheric mechanics.",
      },
      {
        id: "sub-paleoclimate",
        slug: "paleoclimate-stratigraphy",
        name: "Paleoclimate & Stratigraphy",
        description: "Ice cores, isotopic proxies, and stratospheric aerosol forcing.",
      },
    ],
  },
  {
    id: "cat-society",
    slug: "society-research",
    name: "Society & Research",
    shortDescription: "Metascience, computational reproducibility, and research methodology.",
    description:
      "Epistemology of empirical science, open verification pipelines, and institutional publishing standards.",
    subcategories: [
      {
        id: "sub-metascience",
        slug: "metascience-reproducibility",
        name: "Metascience & Reproducibility",
        description: "Registered reports, statistical power, and deterministic workflows.",
      },
      {
        id: "sub-policy",
        slug: "science-infrastructure",
        name: "Research Infrastructure",
        description: "Open data repositories, archival longevity, and peer-review models.",
      },
    ],
  },
];

export const DEMO_AUTHORS: PublicAuthor[] = [
  {
    id: "auth-elena-vance",
    name: "Dr. Elena Rostova-Vance",
    role: "Senior Biophysics & Materials Writer (Illustrative Demo Persona)",
    credentialsNote:
      "Illustrative ScientificRadar editorial contributor profile created for Stage A architecture evaluation.",
    bio: "Covers hierarchical biomaterials, polymer rheology, and structural biology. All articles attributed to this profile in Stage A are original synthetic demonstration texts.",
    isDemoPersona: true,
  },
  {
    id: "auth-kerem-aydin",
    name: "Dr. Kerem Aydın",
    role: "Earth Sciences & Geodesy Editor (Illustrative Demo Persona)",
    credentialsNote:
      "Illustrative ScientificRadar bilingual contributor profile testing Turkish and English typography.",
    bio: "Specializes in crustal deformation, GNSS velocity fields, and paleoclimate stratigraphy across the Eastern Mediterranean and Anatolian tectonic regimes.",
    isDemoPersona: true,
  },
  {
    id: "auth-claire-lin",
    name: "Claire H. Lin",
    role: "Chemical & Molecular Sciences Correspondent (Illustrative Demo Persona)",
    credentialsNote:
      "Illustrative ScientificRadar contributor profile for comparative biochemistry and catalysis.",
    bio: "Writes explainers and research digests on bioinorganic coordination chemistry, prebiotic reaction networks, and solid-state energy storage.",
    isDemoPersona: true,
  },
  {
    id: "auth-marcus-chen",
    name: "Marcus T. Thorne",
    role: "Quantum & Computational Systems Editor (Illustrative Demo Persona)",
    credentialsNote:
      "Illustrative ScientificRadar contributor profile for condensed matter and metascience.",
    bio: "Focuses on topological quantum computation, analog neuromorphic hardware, and computational reproducibility standards.",
    isDemoPersona: true,
  },
];

export const DEMO_ARTICLES: PublicArticle[] = [
  // ============================================================================
  // ARTICLE 1: LONG-FORM FEATURE (>1100 words, Spider Silk Hierarchical Mechanics)
  // ============================================================================
  {
    id: "art-spider-silk-01",
    slug: "spider-silk-hierarchical-protein-mechanics",
    locale: "en",
    editorialType: "feature",
    status: "demo",
    title:
      "How Spiders Spin Liquid Protein Dope Into a Toughened Nanocomposite Fiber",
    dek: "Inside a tapering microfluidic duct barely wider than a human hair, acidification and elongational shear transform globular spidroin micelles into interlocking beta-sheet nanocrystals.",
    summary:
      "Orb-weaving spiders store highly concentrated protein solutions for months without premature clumping, then convert them in milliseconds into solid dragline fibers tougher than high-tensile steel and Kevlar.",
    categorySlug: "biology",
    subcategorySlugs: ["structural-biomaterials", "soft-matter-mechanics"],
    tagSlugs: ["biomaterials", "protein-folding", "rheology", "nanocomposites"],
    authorIds: ["auth-elena-vance"],
    publishedAt: "2026-10-28",
    updatedAt: "2026-11-01",
    readingTimeMinutes: 9,
    featuredRank: 1,
    mostReadDemoRank: 1,
    hero: {
      id: "media-silk-hero",
      src: "/images/demo/spider-silk-hierarchy.svg",
      alt: "Three-stage schematic of spidroin protein self-assembly from liquid micelles in the ampullate gland through the hyperbolic tapering duct into a semi-crystalline solid fiber.",
      width: 1200,
      height: 750,
      caption:
        "Across a millimeter-scale spinning duct, a drop in pH from 7.6 to 5.0 combined with ion exchange and hydrodynamic shear aligns repetitive spidroin chains into antiparallel beta-sheet nanocrystals embedded in an extensible glycine-rich matrix.",
      credit:
        "Original ScientificRadar Diagram (FIG-SR-2026-01) · CC0 Illustrative Demo Asset",
      rightsVerified: true,
      license: "CC0 1.0 Public Domain Dedication (Original Demo Vector)",
    },
    blocks: [
      {
        type: "paragraph",
        id: "silk-p1",
        dropCap: true,
        text: "When an orb-weaving spider drops from a branch on a single strand of major ampullate dragline silk, its lifeline must solve two seemingly contradictory mechanical problems at once. The filament—typically four to six micrometers in diameter—must possess sufficient tensile strength to support many times the animal's body mass without snapping, yet it must also absorb kinetic energy without catapulting the spider back into the air like an undamped rubber band. Synthetic materials rarely reconcile these demands: aramid fibers such as Kevlar achieve high fracture strength at the cost of brittle, low-strain failure, whereas elastomers stretch hundreds of percent before yielding at modest loads.",
        citations: ["src-silk-1", "src-silk-2"],
      },
      {
        type: "paragraph",
        id: "silk-p2",
        text: "Natural dragline silk bridges this divide through hierarchical architecture spanning four orders of magnitude in length. Even more remarkable than the solid fiber's toughness is the manufacturing puzzle solved inside the spider's abdomen. In the sac of the major ampullate gland, silk proteins—known as spidroins—are stored at concentrations approaching 30 to 50 percent by weight. In a laboratory beaker, nearly any globular or fibrous protein held at that density quickly misfolds into an irreversible amyloid hydrogel. Yet the spider maintains its liquid 'spinning dope' in a stable, low-viscosity state for weeks, only triggering solidification on demand within milliseconds as the solution traverses an S-shaped tapering duct.",
        citations: ["src-silk-2"],
      },
      {
        type: "key-takeaways",
        id: "silk-takeaways",
        title: "Key Biophysical Mechanisms (Illustrative Demo Synthesis)",
        items: [
          "Storage stability: Terminal domains (NT and CT) cap amphiphilic spidroin chains into 100–200 nm micellar assemblies at neutral pH (7.6) and elevated sodium chloride levels.",
          "Microfluidic trigger: Epithelial proton pumps acidify the tapering duct toward pH 5.0 while exchanging chaotropic Na⁺/Cl⁻ ions for kosmotropic K⁺ and phosphate ions.",
          "Nanocomposite toughness: Antiparallel poly-alanine beta-sheet nanocrystals (2–5 nm) act as high-strength physical crosslinks inside a semi-amorphous glycine-rich network.",
        ],
      },
      {
        type: "heading",
        id: "silk-h2-storage",
        level: 2,
        text: "The Micellar Storage Paradox in the Ampullate Sac",
      },
      {
        type: "paragraph",
        id: "silk-p3",
        text: "A typical major ampullate spidroin (MaSp1 or MaSp2) is a giant block copolymer consisting of a long, highly repetitive core flanked by compact, evolutionarily conserved non-repetitive terminal domains at the amino (NT) and carboxyl (CT) ends. The central core alternates between hydrophobic poly-alanine blocks—typically six to ten consecutive alanine residues—and hydrophilic glycine-rich motifs such as GGX or GPGXX. Left exposed to water, the poly-alanine tracts strongly favor hydrogen-bonded beta-sheet aggregation.",
        citations: ["src-silk-1"],
      },
      {
        type: "paragraph",
        id: "silk-p4",
        text: "To prevent premature fibrillation inside the gland reservoir, spiders rely on a dual chemical lock. At pH 7.6 and roughly 150 to 200 millimolar sodium chloride, the amino-terminal (NT) domain adopts a monomeric, highly soluble five-helix bundle conformation, while the carboxyl-terminal (CT) domain forms a stable parallel dimer. Together, these hydrophilic caps sequester the repetitive hydrophobic core inside spherical micelles measuring 100 to 200 nanometers across. Within each micelle, hydrated glycine-rich segments cushion the poly-alanine tracts, keeping the concentrated dope behaving as a shear-thinning viscoelastic liquid rather than a clogged solid.",
        citations: ["src-silk-2", "src-silk-3"],
      },
      {
        type: "quote",
        id: "silk-q1",
        quote:
          "The spider does not spin from a dilute solution by evaporating solvent after extrusion; instead, it pre-organizes a liquid-crystalline protein phase whose terminal switches are primed to lock under mild acidification and elongational flow.",
        attribution: "Illustrative biophysical synthesis · ScientificRadar Demo Archive",
      },
      {
        type: "heading",
        id: "silk-h2-duct",
        level: 2,
        text: "Acidification and Shear Inside the Hyperbolic Tapering Duct",
      },
      {
        type: "paragraph",
        id: "silk-p5",
        text: "As the liquid dope leaves the storage ampulla and enters the spinning duct, the channel cross-section narrows along a smooth hyperbolic profile. This geometry is not accidental: a hyperbolic contraction generates a nearly constant elongational strain rate along the centerline while minimizing wall turbulence. Simultaneously, vacuolar-type H⁺-ATPase proton pumps lining the duct epithelium drive the lumen pH steadily downward from 7.6 to approximately 5.0 near the spinneret valve.",
        citations: ["src-silk-3"],
      },
      {
        type: "paragraph",
        id: "silk-p6",
        text: "This proton gradient flips two molecular switches in sequence. First, protonation of specific glutamate and aspartate side chains on the NT domain triggers its rapid dimerization around pH 6.4, linking individual spidroin dimers end-to-end into infinite supramolecular chains. Second, as sodium and chloride ions are actively reabsorbed and replaced by potassium, sulfate, and phosphate ions—which sit higher on the Hofmeister series—water molecules are stripped away from the hydrophobic poly-alanine backbones. Under elongational shear, the unshielded poly-alanine segments align parallel to the draw axis and zip together into dense antiparallel beta-sheet nanocrystals.",
        citations: ["src-silk-3", "src-silk-4"],
      },
      {
        type: "math",
        id: "silk-math-1",
        label: "Eq. 1 · Work of Fracture (Volumetric Toughness)",
        tex: "U_T = \\int_{0}^{\\varepsilon_f} \\sigma(\\varepsilon)\\, d\\varepsilon \\approx 165\\text{ MJ}\\cdot\\text{m}^{-3}",
        explanation:
          "Volumetric toughness (UT) is defined by the integral of engineering stress σ over engineering strain ε up to the fracture strain εf. Because dragline silk combines a high initial modulus (~10–12 GPa) with post-yield strain hardening up to εf ≈ 0.30, the area beneath its stress–strain curve exceeds both brittle high-strength fibers and soft elastomers.",
        variables: [
          { symbol: "U_T", meaning: "Volumetric energy absorption prior to rupture (MJ·m⁻³)" },
          { symbol: "σ(ε)", meaning: "Instantaneous tensile stress as a function of strain (GPa)" },
          { symbol: "ε_f", meaning: "Ultimate engineering strain at fiber failure (dimensionless)" },
        ],
      },
      {
        type: "figure",
        id: "silk-fig-wide",
        figureNumber: "Figure 1",
        layout: "wide",
        media: {
          id: "media-silk-stress",
          src: "/images/demo/spider-silk-stress-strain.svg",
          alt: "Comparative engineering stress-strain plot showing Kevlar 49, high-tensile steel, major ampullate dragline silk, Bombyx mori silkworm silk, and flagelliform capture spiral silk.",
          width: 1200,
          height: 680,
          caption:
            "Comparative constitutive behavior of structural fibers. While Kevlar 49 reaches higher peak stress (3.6 GPa), its failure at 2.7% strain limits total energy absorption. Major ampullate dragline silk exhibits a distinct yield knee around 2% strain followed by progressive stiffening as amorphous chains tauten between beta-sheet nanocrystals.",
          credit:
            "Original ScientificRadar Figure (FIG-SR-2026-01B) · Illustrative Demo Data compiled from public biomaterial literature benchmarks",
          rightsVerified: true,
          license: "CC0 1.0 Public Domain Dedication",
        },
      },
      {
        type: "heading",
        id: "silk-h2-nanocrystals",
        level: 2,
        text: "Why Two-Nanometer Crystals Outperform Larger Grains",
      },
      {
        type: "paragraph",
        id: "silk-p7",
        text: "A critical insight from atomistic simulations and X-ray fiber diffraction is that the beta-sheet crystals in natural dragline silk are strictly confined to thicknesses of two to five nanometers. In bulk crystalline materials, deformation occurs via dislocation glide or brittle crack nucleation at stress concentrators, causing strength to degrade as crystal dimensions grow. When a beta-sheet nanocrystal is confined below a critical length scale of roughly three nanometers, however, hydrogen bonds across the entire beta-strand cooperative array share applied shear loads almost uniformly.",
        citations: ["src-silk-4"],
      },
      {
        type: "heading",
        id: "silk-h3-stick-slip",
        level: 3,
        text: "Sacrificial Hydrogen Bonds and Stick-Slip Energy Dissipation",
      },
      {
        type: "paragraph",
        id: "silk-p8",
        text: "Meanwhile, the surrounding amorphous matrix—comprising 3₁-helical glycine-rich chains and beta-turn spirals—functions as an entropic spring network filled with sacrificial hydrogen bonds. When a flying insect strikes an orb web, initial kinetic energy breaks weak inter-chain hydrogen bonds in the semi-amorphous domains, allowing chains to uncoil and slide without severing covalent polypeptide backbones. Only after the amorphous network approaches full extension do the rigid poly-alanine nanocrystals bear the peak tensile load, preventing catastrophic rupture.",
        citations: ["src-silk-1", "src-silk-4"],
      },
      {
        type: "table",
        id: "silk-table-1",
        table: {
          id: "tbl-fiber-mechanics",
          caption:
            "Table 1 · Illustrative comparison of mechanical properties across natural and synthetic structural fibers (Representative benchmark intervals).",
          headers: [
            "Material System",
            "Density (g·cm⁻³)",
            "Young's Modulus E (GPa)",
            "Ultimate Stress σ_max (GPa)",
            "Fracture Strain ε_f (%)",
            "Toughness U_T (MJ·m⁻³)",
          ],
          rows: [
            [
              "Major Ampullate Dragline Silk",
              "1.31",
              "10.5",
              "1.25",
              "28.0",
              "165",
            ],
            [
              "Flagelliform Capture Spiral Silk",
              "1.30",
              "0.003",
              "0.50",
              "240.0",
              "150",
            ],
            [
              "Bombyx mori Cocoon Silk",
              "1.34",
              "7.0",
              "0.60",
              "18.5",
              "70",
            ],
            [
              "Kevlar 49 Aramid Fiber",
              "1.44",
              "130.0",
              "3.60",
              "2.7",
              "50",
            ],
            [
              "High-Tensile Carbon Steel",
              "7.85",
              "200.0",
              "1.50",
              "1.8",
              "12",
            ],
          ],
          footnote:
            "Note: Values represent illustrative order-of-magnitude literature benchmarks for educational demonstration in Stage A; natural silk metrics vary significantly with spinning speed, relative humidity, and taxonomic lineage.",
        },
      },
      {
        type: "paragraph",
        id: "silk-p9",
        text: "Replicating this entire sequence in biomimetic microfluidic spinning rigs remains a central goal of sustainable materials engineering. Early recombinant spider silks spun via wet coagulation baths often suffered from large, poorly aligned beta-sheet aggregates because they bypassed the native NT/CT pH switch and hyperbolic shear profile. By combining full-length terminal domains with Biomimetic Ion-Exchange Microfluidics, researchers are steadily narrowing the gap between synthetic protein filaments and the natural dragline fibers perfected over 380 million years of arachnid evolution.",
        citations: ["src-silk-2", "src-silk-3"],
      },
    ],
    sources: [
      {
        id: "src-silk-1",
        label: "1",
        title:
          "Hierarchical nanocomposite mechanics and sacrificial hydrogen bonding in major ampullate spidroin networks (Illustrative Demo Synthesis)",
        authors: "ScientificRadar Demo Literature Archive",
        publication: "Illustrative Biomaterials Reference Series",
        year: "2026",
        href: "https://www.rcsb.org/",
        isIllustrativeDemo: true,
        note: "Demo citation entry pointing to RCSB Protein Data Bank portal; no synthetic DOI claimed.",
      },
      {
        id: "src-silk-2",
        label: "2",
        title:
          "Terminal domain pH-gating and micellar stabilization of concentrated spidroin dope prior to extrusion (Illustrative Demo Record)",
        authors: "ScientificRadar Structural Biology Fixture",
        publication: "Stage A Reader Verification Corpus",
        year: "2026",
        href: "https://www.ncbi.nlm.nih.gov/pmc/",
        isIllustrativeDemo: true,
        note: "Illustrative reference demonstrating citation back-links and safe external link attributes.",
      },
      {
        id: "src-silk-3",
        label: "3",
        title:
          "Elongational rheology and Hofmeister ion exchange across hyperbolic tapering ducts (Illustrative Demo Record)",
        authors: "ScientificRadar Soft Matter Fixture",
        publication: "Stage A Reader Verification Corpus",
        year: "2025",
        isIllustrativeDemo: true,
        note: "Demonstrates conservative non-linked reference presentation when external URL is omitted.",
      },
      {
        id: "src-silk-4",
        label: "4",
        title:
          "Size-dependent shear cooperativity in confined 2–5 nm antiparallel poly-alanine beta-sheet nanocrystals (Illustrative Demo Record)",
        authors: "ScientificRadar Computational Mechanics Fixture",
        publication: "Stage A Reader Verification Corpus",
        year: "2025",
        isIllustrativeDemo: true,
      },
    ],
    relatedIds: [
      "art-blood-pigments-02",
      "art-prebiotic-vents-05",
      "art-solid-state-battery-08",
    ],
  },

  // ============================================================================
  // ARTICLE 2: LONG-FORM EXPLAINER (>1100 words, Respiratory Pigments & Blood Colors)
  // ============================================================================
  {
    id: "art-blood-pigments-02",
    slug: "respiratory-pigments-evolutionary-biochemistry",
    locale: "en",
    editorialType: "explainer",
    status: "demo",
    title:
      "Crimson, Azure, Emerald, and Violet: How Evolution Engineered Four Distinct Oxygen Carriers",
    dek: "Vertebrate blood owes its scarlet hue to iron-porphyrin rings, but octopuses, marine tubeworms, and brachiopods solve the physics of oxygen transport with copper clusters, formyl-hemes, and non-heme diiron bridges.",
    summary:
      "A comparative bioinorganic tour of the four major respiratory metalloproteins—hemoglobin, hemocyanin, chlorocruorin, and hemerythrin—and how metal coordination geometry shapes both color and allosteric oxygen affinity.",
    categorySlug: "chemistry",
    subcategorySlugs: ["bioinorganic-chemistry", "evolutionary-physiology"],
    tagSlugs: ["metalloproteins", "biochemistry", "evolution", "spectroscopy"],
    authorIds: ["auth-claire-lin", "auth-elena-vance"],
    publishedAt: "2026-10-24",
    updatedAt: "2026-10-30",
    readingTimeMinutes: 10,
    featuredRank: 2,
    mostReadDemoRank: 2,
    hero: {
      id: "media-blood-hero",
      src: "/images/demo/animal-blood-pigments.svg",
      alt: "Four-panel bioinorganic comparison diagram showing the active-site coordination chemistry and oxygenated colors of Hemoglobin (red), Hemocyanin (blue), Chlorocruorin (green), and Hemerythrin (violet).",
      width: 1200,
      height: 750,
      caption:
        "Ligand-to-metal charge transfer transitions determine the visible absorption spectrum of each respiratory pigment. Changing either the transition metal (Fe²⁺ vs. Cu⁺) or the surrounding organic macrocycle shifts blood color across the visible spectrum.",
      credit:
        "Original ScientificRadar Diagram (FIG-SR-2026-02) · CC0 Illustrative Demo Asset",
      rightsVerified: true,
      license: "CC0 1.0 Public Domain Dedication (Original Demo Vector)",
    },
    blocks: [
      {
        type: "paragraph",
        id: "blood-p1",
        dropCap: true,
        text: "Because molecular dioxygen (O₂) is nonpolar, poorly soluble in aqueous plasma, and kinetically sluggish to react in its triplet ground state, any animal larger than a few millimeters cannot rely on passive diffusion alone to fuel aerobic metabolism. At 20 °C, a liter of seawater or blood plasma equilibrated with air dissolves scarcely six milliliters of oxygen. Packaging transition-metal coordination complexes into circulating respiratory proteins boosts that oxygen-carrying capacity thirty- to fifty-fold.",
        citations: ["src-blood-1"],
      },
      {
        type: "paragraph",
        id: "blood-p2",
        text: "Yet evolution did not converge on a single universal molecule for reversible oxygen binding. Across animal phyla, natural selection independently fashioned four major families of respiratory metalloproteins, each built around iron or copper ions held in distinct electronic environments. As a consequence of quantum-mechanical charge-transfer transitions between the bound oxygen ligand and the metal d-orbitals, animal blood and hemolymph appear crimson red in vertebrates, deep azure blue in cephalopods and horseshoe crabs, emerald green in feather-duster polychaete worms, and violet-rose in marine sipunculids and brachiopods.",
        citations: ["src-blood-1", "src-blood-2"],
      },
      {
        type: "key-takeaways",
        id: "blood-takeaways",
        title: "Comparative Bioinorganic Summary (Illustrative Demo Synthesis)",
        items: [
          "Hemoglobin (Scarlet Red): Coordinates one ferrous ion (Fe²⁺) inside a planar protoporphyrin IX ring; binds O₂ end-on as a superoxide-like ferric complex.",
          "Hemocyanin (Azure Blue): Uses a pair of copper ions (Cu⁺/Cu²⁺) coordinated directly by six histidine side chains without a porphyrin ring, bridging O₂ as peroxide (O₂²⁻).",
          "Chlorocruorin (Emerald Green): Replaces a single vinyl group on the heme macrocycle with an electron-withdrawing formyl (−CHO) group, shifting the Soret band into the red-green dichromatic window.",
          "Hemerythrin (Violet-Rose): Binds O₂ across a non-heme diiron (Fe²⁺–Fe²⁺) center linked by a μ-oxo bridge, transferring a proton to form a bound hydroperoxo ligand.",
        ],
      },
      {
        type: "heading",
        id: "blood-h2-hemoglobin",
        level: 2,
        text: "1. Hemoglobin: Porphyrin Delocalization and the Spin-State Tug-of-War",
      },
      {
        type: "paragraph",
        id: "blood-p3",
        text: "In vertebrate erythrocytes, hemoglobin is assembled as a heterotetramer (α₂β₂) in which each subunit cradles an iron-containing heme b prosthetic group. In deoxygenated venous blood, the five-coordinate ferrous ion (Fe²⁺) sits in a high-spin state with an ionic radius slightly too large to fit snugly inside the central cavity of the porphyrin ring, doming roughly 0.4 angstroms out of the tetrapyrrole plane toward the proximal histidine residue. This electronic configuration absorbs broadly across the green-yellow spectrum, giving deoxygenated blood a dark burgundy-purple cast.",
        citations: ["src-blood-1"],
      },
      {
        type: "paragraph",
        id: "blood-p4",
        text: "When O₂ binds to the vacant sixth coordination site, electron density transfers from the iron d-orbitals into the antibonding π* orbitals of the oxygen molecule. The iron atom transitions to a smaller low-spin configuration and snaps into the plane of the porphyrin macrocycle, pulling the proximal histidine and its attached F-helix along with it. That sub-angstrom mechanical tug propagates across the subunit interfaces to trigger the tense-to-relaxed (T → R) allosteric transition, while shifting the π → π* Soret and Q absorption bands to produce brilliant arterial scarlet.",
        citations: ["src-blood-2"],
      },
      {
        type: "heading",
        id: "blood-h2-hemocyanin",
        level: 2,
        text: "2. Hemocyanin: Cold-Water Copper Multimers in Octopuses and Arthropods",
      },
      {
        type: "paragraph",
        id: "blood-p5",
        text: "In mollusks and many arthropods, oxygen transport relies not on iron porphyrins packed inside red blood cells, but on giant extracellular copper proteins—hemocyanins—dissolved directly in the hemolymph. A single active site contains two copper(I) ions (CuA and CuB), each coordinated by three conserved histidine imidazoles. Because copper(I) has a completely filled 3d¹⁰ electron shell, deoxygenated hemocyanin cannot undergo d–d electronic transitions and is completely colorless.",
        citations: ["src-blood-2", "src-blood-3"],
      },
      {
        type: "paragraph",
        id: "blood-p6",
        text: "Upon encountering oxygen, both Cu⁺ centers donate an electron to reduce O₂ into a bridging peroxide dianion (μ-η²:η²-O₂²⁻) held in a planar side-on butterfly geometry between two oxidized Cu²⁺ (3d⁹) ions. This peroxide-to-copper ligand-to-metal charge transfer absorbs strongly near 345 nanometers and 570–600 nanometers (in the orange-red region), transmitting rich azure blue light. In Antarctic octopods inhabiting sub-zero Southern Ocean waters, where high blood viscosity would cripple cellular circulation, extracellular hemocyanin multimers tune their subunit expression to maintain oxygen offloading at near-freezing temperatures.",
        citations: ["src-blood-3"],
      },
      {
        type: "figure",
        id: "blood-fig-wide",
        figureNumber: "Figure 1",
        layout: "wide",
        media: {
          id: "media-blood-curves",
          src: "/images/demo/oxygen-affinity-curves.svg",
          alt: "Oxygen equilibrium dissociation curves plotting fractional saturation Y against oxygen partial pressure pO2 for hemerythrin, vertebrate hemoglobin, cephalopod hemocyanin, and annelid chlorocruorin.",
          width: 1200,
          height: 660,
          caption:
            "Oxygen dissociation isotherms illustrating how cooperativity (Hill coefficient nH) and half-saturation pressure (P50) diverge across respiratory pigments. Monomeric or weakly cooperative hemerythrins act as high-affinity oxygen storage reservoirs in hypoxic marine sediments, whereas highly cooperative hemocyanins and hemoglobins exhibit steep sigmoidal offloading curves.",
          credit:
            "Original ScientificRadar Figure (FIG-SR-2026-02B) · Illustrative Demo Data",
          rightsVerified: true,
          license: "CC0 1.0 Public Domain Dedication",
        },
      },
      {
        type: "math",
        id: "blood-math-1",
        label: "Eq. 1 · Fractional Oxygen Saturation (Hill Cooperative Isotherm)",
        tex: "Y = \\frac{(p\\text{O}_2)^{n_H}}{(P_{50})^{n_H} + (p\\text{O}_2)^{n_H}}",
        explanation:
          "Fractional saturation Y measures the proportion of metal active sites occupied by dioxygen at partial pressure pO2. A Hill coefficient nH > 1 indicates positive allosteric cooperativity, allowing steep oxygen delivery across narrow physiological pressure gradients.",
        variables: [
          { symbol: "Y", meaning: "Fractional saturation of respiratory binding sites (0 to 1)" },
          { symbol: "pO₂", meaning: "Ambient oxygen partial pressure (mmHg)" },
          { symbol: "P₅₀", meaning: "Partial pressure at which 50% of active sites are oxygenated" },
          { symbol: "n_H", meaning: "Hill cooperativity coefficient (dimensionless)" },
        ],
      },
      {
        type: "heading",
        id: "blood-h2-chlorocruorin",
        level: 2,
        text: "3. Chlorocruorin and Hemerythrin: Subtle Chemical Shifts with Dramatic Optical Consequences",
      },
      {
        type: "paragraph",
        id: "blood-p7",
        text: "Four families of marine polychaete worms—including feather-duster sabellids—circulate chlorocruorin, a giant extracellular complex of up to 144 globin chains arranged in a hexagonal bilayer. Structurally, its prosthetic group (chlorocruoroheme) differs from standard heme b by only a single substituent at position C3 of the porphyrin ring: an electron-withdrawing formyl (−CHO) group replaces a vinyl (−CH=CH₂) group. That minor peripheral substitution perturbs the π-electron conjugation enough to shift the Soret band toward longer wavelengths, making dilute solutions appear vivid green while concentrated arterial vessels flash dichromatic brownish-red.",
        citations: ["src-blood-1", "src-blood-4"],
      },
      {
        type: "paragraph",
        id: "blood-p8",
        text: "Finally, peanut worms (Sipuncula), priapulids, and lampshells (Brachiopoda) utilize hemerythrin—a misleadingly named protein that contains no heme ring at all. Instead, two ferrous ions are anchored directly to glutamate, aspartate, and histidine side chains inside a four-alpha-helix bundle and bridged by a hydroxyl group (Fe²⁺–OH–Fe²⁺). Dioxygen binds to one iron atom and abstracts the bridge proton, oxidizing both metals to Fe³⁺ and creating a μ-oxo-bridged hydroperoxo complex (Fe³⁺–O–Fe³⁺–OOH⁻) whose oxo-to-iron charge transfer glows violet-pink.",
        citations: ["src-blood-4"],
      },
      {
        type: "table",
        id: "blood-table-1",
        table: {
          id: "tbl-pigment-comparison",
          caption:
            "Table 1 · Structural and spectroscopic comparison of the four major animal respiratory metalloproteins (Illustrative Demo Synthesis).",
          headers: [
            "Pigment Family",
            "Active Metal Site",
            "Stoichiometry (Metal : O₂)",
            "Deoxy Color",
            "Oxy Color",
            "Cellular Localization",
          ],
          rows: [
            [
              "Hemoglobin",
              "Heme Fe²⁺ (Porphyrin)",
              "1 Fe : 1 O₂",
              "Dark Purplish-Red",
              "Scarlet Red",
              "Intracellular (RBCs) or Extracellular",
            ],
            [
              "Hemocyanin",
              "Dicopper CuA–CuB (6 His)",
              "2 Cu : 1 O₂",
              "Colorless (3d¹⁰)",
              "Azure Blue",
              "Extracellular multimers in hemolymph",
            ],
            [
              "Chlorocruorin",
              "Formyl-Heme Fe²⁺",
              "1 Fe : 1 O₂",
              "Pale Green",
              "Emerald Green / Dichroic Red",
              "Extracellular ~3.6 MDa hexagonal complex",
            ],
            [
              "Hemerythrin",
              "Non-Heme Diiron (μ-oxo)",
              "2 Fe : 1 O₂",
              "Colorless",
              "Violet-Pink",
              "Intracellular (coelomocytes / hemerythrocytes)",
            ],
          ],
          footnote:
            "Note: Compiled as an original educational synthesis for ScientificRadar Web Stage A verification.",
        },
      },
    ],
    sources: [
      {
        id: "src-blood-1",
        label: "1",
        title:
          "Electronic structure and ligand-to-metal charge transfer in comparative oxygen-transport metalloproteins (Illustrative Demo Synthesis)",
        authors: "ScientificRadar Bioinorganic Chemistry Fixture",
        publication: "Stage A Reader Verification Corpus",
        year: "2026",
        href: "https://www.rcsb.org/",
        isIllustrativeDemo: true,
        note: "Demo citation entry; no fabricated DOI.",
      },
      {
        id: "src-blood-2",
        label: "2",
        title:
          "Allosteric cooperativity and temperature compensation in cephalopod hemocyanins (Illustrative Demo Record)",
        authors: "ScientificRadar Marine Physiology Fixture",
        publication: "Stage A Reader Verification Corpus",
        year: "2025",
        isIllustrativeDemo: true,
      },
      {
        id: "src-blood-3",
        label: "3",
        title:
          "Side-on μ-η²:η²-peroxo dicopper coordination geometry in arthropod and mollusk hemocyanins (Illustrative Demo Record)",
        authors: "ScientificRadar Spectroscopy Fixture",
        publication: "Stage A Reader Verification Corpus",
        year: "2025",
        isIllustrativeDemo: true,
      },
      {
        id: "src-blood-4",
        label: "4",
        title:
          "Proton-coupled electron transfer at non-heme diiron centers in marine sipunculid hemerythrin (Illustrative Demo Record)",
        authors: "ScientificRadar Evolutionary Biochemistry Fixture",
        publication: "Stage A Reader Verification Corpus",
        year: "2025",
        isIllustrativeDemo: true,
      },
    ],
    relatedIds: [
      "art-spider-silk-01",
      "art-prebiotic-vents-05",
      "art-crispr-epigenome-06",
    ],
  },

  // ============================================================================
  // ARTICLE 3: BILINGUAL / TURKISH CHARACTER STRESS LONG-READ (Anatolian Tectonics)
  // ============================================================================
  {
    id: "art-anatolian-fault-03",
    slug: "north-anatolian-fault-aseismic-creep-geodesy",
    locale: "tr",
    editorialType: "research-digest",
    status: "demo",
    title:
      "Kuzey Anadolu Fay Zonu'nda Asismik Kayma, Kabuksal Deformasyon ve Sismik Boşlukların Jeodezik Analizi",
    dek: "Yüksek çözünürlüklü GNSS hız vektörleri ve InSAR interferogramları, İsmetpaşa segmentindeki yüzeysel krip rejimi ile Marmara çukurluklarındaki kilitli asperiteler arasındaki mekanik geçişi aydınlatıyor.",
    summary:
      "Bilingual/Turkish typography verification article (ı, İ, ğ, Ğ, ş, Ş, ö, Ö, ü, Ü, ç, Ç): Examining how space geodesy quantifies the 24 mm/year westward extrusion of the Anatolian microplate and distinguishes aseismic creep from locked fault patches.",
    categorySlug: "earth-climate",
    subcategorySlugs: ["tectonic-geodesy"],
    tagSlugs: ["seismology", "geodesy", "tectonics", "turkish-typography"],
    authorIds: ["auth-kerem-aydin"],
    publishedAt: "2026-10-21",
    updatedAt: "2026-10-29",
    readingTimeMinutes: 8,
    featuredRank: 3,
    mostReadDemoRank: 3,
    hero: {
      id: "media-anatolia-hero",
      src: "/images/demo/anatolian-tectonic-gps.svg",
      alt: "Kuzey Anadolu Fay Zonu boyunca GNSS hız vektörlerini, İsmetpaşa asismik krip bölgesini ve Marmara sismik boşluğunu gösteren tektonik jeodezi şeması.",
      width: 1200,
      height: 750,
      caption:
        "Sabit Avrasya referans çerçevesine göre Anadolu blokunun saat yönünün tersine rotasyonel hız alanı. Doğu Anadolu'daki sıkışma rejiminden Ege açılma sistemine doğru yıllık kayma hızları 18 mm/yıl'dan 26 mm/yıl'a yükselmektedir.",
      credit:
        "Özgün ScientificRadar Şeması (FIG-SR-2026-03) · CC0 Örnekleme Verisi",
      rightsVerified: true,
      license: "CC0 1.0 Public Domain Dedication",
    },
    blocks: [
      {
        type: "paragraph",
        id: "naf-p1",
        dropCap: true,
        text: "Doğu Akdeniz ve Anadolu-Ege tektonik rejimi, kıtasal litosferin aktif deformasyonunu incelemek için dünyadaki en önemli doğal laboratuvarlardan biridir. Arap levhasının Avrasya'ya doğru kuzey yönlü yakınsaması ve Helenik yitim zonundaki geriye çekilme (slab rollback) kuvvetleri, Anadolu mikrolevhasını sağ-yanal doğrultu atımlı Kuzey Anadolu Fay Zonu (KAFZ) boyunca yılda yaklaşık 22 ila 25 milimetre hızla batıya doğru hareket etmeye zorlar. Bu makale, ScientificRadar Web okuyucu arayüzünde Türkçe tipografi gliflerinin (ı, İ, ğ, Ğ, ş, Ş, ö, Ö, ü, Ü, ç, Ç) Merriweather ve Inter yazı tiplerindeki optik uyumunu doğrulamak amacıyla hazırlanmış özgün bir bilimsel örneklemedir.",
        citations: ["src-naf-1"],
      },
      {
        type: "heading",
        id: "naf-h2-creep",
        level: 2,
        text: "Kilitli Asperiteler ile Asismik Krip Rejimi Arasındaki Sürtünme Dengesi",
      },
      {
        type: "paragraph",
        id: "naf-p2",
        text: "Doğrultu atımlı bir fay düzlemi boyunca biriken elastik gerinim enerjisi her segmentte aynı davranışla boşalmaz. Hız-zayıflamalı (velocity-weakening) sürtünme katsayısına sahip kuvars-feldspat ağırlıklı sismojenik kabuk derinliklerinde (3–15 km) fay yüzeyleri yüzyıllar boyunca kilitli kalır. Buna karşılık, talk, serpantin ve smektit gibi fillosilikat minerallerince zengin ezik zonlarda hız-güçlenmeli (velocity-strengthening) reoloji baskın hale gelerek fayın deprem üretmeksizin milimetrik hızlarla sürekli kaymasına—yani asismik kripe—olanak tanır.",
        citations: ["src-naf-1", "src-naf-2"],
      },
      {
        type: "math",
        id: "naf-math-1",
        label: "Denklem 1 · Yarı-Sonsuz Elastik Uzayda Doğrultu Atımlı Fay Hız Profili (Savage–Burford Modeli)",
        tex: "v(x) = \\frac{V_0}{\\pi} \\arctan\\left(\\frac{x}{D}\\right)",
        explanation:
          "Fay izine dik doğrultudaki (x) yüzeysel hız dağılımı v(x), derindeki uzun dönemli tektonik kayma hızı V0 ve kilitlenme derinliği D ile belirlenir. Kilitlenme derinliği küçüldükçe fay izi üzerindeki hız gradyanı dikleşir.",
        variables: [
          { symbol: "v(x)", meaning: "Fay izine x uzaklıktaki istasyonun faya paralel hızı (mm/yıl)" },
          { symbol: "V_0", meaning: "Uzun dönemli blok kayma hızı (~24 mm/yıl)" },
          { symbol: "D", meaning: "Sismojenik kilitlenme derinliği (km)" },
        ],
      },
      {
        type: "table",
        id: "naf-table-1",
        table: {
          id: "tbl-naf-segments",
          caption:
            "Tablo 1 · Kuzey Anadolu Fay Zonu temsilî segmentlerinin jeodezik parametre karşılaştırması (Örnekleme Verisi).",
          headers: [
            "Fay Segmenti",
            "Blok Kayma Hızı V₀ (mm/yıl)",
            "Kilitlenme Derinliği D (km)",
            "Yüzeysel Krip Hızı (mm/yıl)",
            "Mekanik Rejim",
          ],
          rows: [
            [
              "Erzincan–Refahiye Segmenti",
              "20.5",
              "14.0",
              "0.0",
              "Tam kilitli sismojenik kabuk",
            ],
            [
              "İsmetpaşa–Gerede Geçiş Zonu",
              "23.2",
              "6.5",
              "8.5",
              "Sığ asismik krip + derin kilitlenme",
            ],
            [
              "İzmit–Sapanca Segmenti",
              "24.8",
              "13.5",
              "1.2",
              "Kırılma sonrası viskoelastik gevşeme",
            ],
            [
              "Marmara Merkez Çukurluğu",
              "25.4",
              "15.0",
              "0.0",
              "Yüksek gerinim birikimli sismik boşluk",
            ],
          ],
          footnote:
            "Not: Bu tablo Stage A tipografi, tablo kaydırma (overflow-x) ve sayısal hizalama (tabular-nums) doğrulaması için oluşturulmuş temsili eğitim verisidir.",
        },
      },
    ],
    sources: [
      {
        id: "src-naf-1",
        label: "1",
        title:
          "Anadolu mikrolevhasının GNSS hız alanı ve doğrultu atımlı gerinim birikimi (Temsilî Demo Kaynağı)",
        authors: "ScientificRadar Yerbilimleri Demo Arşivi",
        publication: "Stage A Türkçe Tipografi Doğrulama Serisi",
        year: "2026",
        isIllustrativeDemo: true,
      },
      {
        id: "src-naf-2",
        label: "2",
        title:
          "İsmetpaşa segmentinde InSAR zaman serileriyle gözlenen yüzeysel asismik kayma (Temsilî Demo Kaynağı)",
        authors: "ScientificRadar Jeodezi Demo Arşivi",
        publication: "Stage A Türkçe Tipografi Doğrulama Serisi",
        year: "2025",
        isIllustrativeDemo: true,
      },
    ],
    relatedIds: ["art-paleoclimate-aerosols-07", "art-spider-silk-01"],
  },

  // ============================================================================
  // ARTICLE 4: PHYSICS — Quantum Topological Braiding
  // ============================================================================
  {
    id: "art-quantum-braiding-04",
    slug: "non-abelian-anyons-topological-quantum-braiding",
    locale: "en",
    editorialType: "feature",
    status: "demo",
    title:
      "Braiding Worldlines in Two Dimensions: How Non-Abelian Anyons Store Quantum Memory in Knots",
    dek: "Unlike three-dimensional bosons and fermions, quasiparticles confined to two-dimensional electron gases can remember the exact topological sequence in which they were exchanged.",
    summary:
      "An exploration of fractional quantum Hall interferometers, Majorana zero modes, and why topological protection shields quantum gates from local thermal decoherence.",
    categorySlug: "physics",
    subcategorySlugs: ["quantum-matter"],
    tagSlugs: ["quantum-computing", "condensed-matter", "topology"],
    authorIds: ["auth-marcus-chen"],
    publishedAt: "2026-10-18",
    readingTimeMinutes: 7,
    mostReadDemoRank: 4,
    hero: {
      id: "media-quantum-hero",
      src: "/images/demo/quantum-topological-braiding.svg",
      alt: "Spacetime worldline braiding trajectories of four non-Abelian quasiparticles between two two-dimensional superconducting lattice planes.",
      width: 1200,
      height: 750,
      caption:
        "In (2+1)-dimensional spacetime, adiabatic exchange of non-Abelian quasiparticles applies a unitary matrix rotation to the degenerate ground-state manifold that depends solely on braid topology.",
      credit:
        "Original ScientificRadar Diagram (FIG-SR-2026-04) · CC0 Illustrative Demo Asset",
      rightsVerified: true,
      license: "CC0 1.0 Public Domain Dedication",
    },
    blocks: [
      {
        type: "paragraph",
        id: "qm-p1",
        dropCap: true,
        text: "In three-dimensional space, exchanging two identical particles twice is topologically equivalent to leaving them untouched: any closed path traced by one particle around another can be continuously shrunk to a point. Consequently, quantum wavefunctions in three dimensions must be either symmetric (bosons) or antisymmetric (fermions) under particle exchange. When electrons are confined to an atomically thin two-dimensional plane under intense magnetic fields, however, particle trajectories in (2+1)-dimensional spacetime form knotted worldlines that cannot cross through one another without closing the energy gap.",
        citations: ["src-qm-1"],
      },
      {
        type: "heading",
        id: "qm-h2-unitary",
        level: 2,
        text: "Unitary Gates from Non-Commuting Braid Matrices",
      },
      {
        type: "paragraph",
        id: "qm-p2",
        text: "For non-Abelian anyons, a degenerate ground-state subspace spans multiple quantum states for a fixed set of quasiparticle positions. Adiabatically braiding quasiparticle γ₁ around γ₂ executes a non-trivial unitary matrix transformation on that state vector. Because local environmental noise—such as a stray phonon or fluctuating electric dipole—cannot alter the global winding number of the braid without exciting quasiparticles across the bulk energy gap Δ, topological quantum memory is intrinsically hardware-protected against local decoherence.",
        citations: ["src-qm-1"],
      },
    ],
    sources: [
      {
        id: "src-qm-1",
        label: "1",
        title:
          "Non-Abelian braid statistics and interferometric phase shifts in two-dimensional quantum fluids (Illustrative Demo Synthesis)",
        authors: "ScientificRadar Condensed Matter Fixture",
        publication: "Stage A Reader Verification Corpus",
        year: "2026",
        isIllustrativeDemo: true,
      },
    ],
    relatedIds: ["art-neuromorphic-crossbar-09", "art-spider-silk-01"],
  },

  // ============================================================================
  // ARTICLE 5: CHEMISTRY / BIOLOGY — Prebiotic Hydrothermal Vents
  // ============================================================================
  {
    id: "art-prebiotic-vents-05",
    slug: "alkaline-hydrothermal-vents-prebiotic-carbon-fixation",
    locale: "en",
    editorialType: "explainer",
    status: "demo",
    title:
      "Proton Gradients Before Genes: How Deep-Sea Iron-Sulfide Chimneys May Have Driven Prebiotic Carbon Fixation",
    dek: "Long before lipid membranes or ATP synthase evolved, microporous mackinawite mineral barriers separated alkaline serpentinization fluids from an acidic Hadean ocean.",
    summary:
      "How natural chemiosmotic disequilibrium across iron-nickel-sulfide hydrothermal walls lowers the thermodynamic barrier connecting dissolved CO2 and H2 to formate, acetate, and pyruvate.",
    categorySlug: "chemistry",
    subcategorySlugs: ["prebiotic-chemistry", "bioinorganic-chemistry"],
    tagSlugs: ["origins-of-life", "geochemistry", "catalysis", "metabolism"],
    authorIds: ["auth-claire-lin"],
    publishedAt: "2026-10-14",
    readingTimeMinutes: 6,
    mostReadDemoRank: 5,
    hero: {
      id: "media-vent-hero",
      src: "/images/demo/deep-sea-hydrothermal-vent.svg",
      alt: "Schematic of an iron-nickel-sulfide hydrothermal chimney barrier separating pH 10 alkaline vent fluid from pH 6 Hadean ocean water.",
      width: 1200,
      height: 750,
      caption:
        "A natural pH gradient of 3 to 4 units across semiconducting Fe(Ni)S mineral walls establishes an electrochemical potential analogous to the proton-motive force of modern autotrophic cells.",
      credit:
        "Original ScientificRadar Diagram (FIG-SR-2026-05) · CC0 Illustrative Demo Asset",
      rightsVerified: true,
      license: "CC0 1.0 Public Domain Dedication",
    },
    blocks: [
      {
        type: "paragraph",
        id: "vent-p1",
        dropCap: true,
        text: "The Wood–Ljungdahl acetyl-CoA pathway is the only known carbon-fixation route that simultaneously synthesizes organic building blocks and conserves metabolic energy as ATP. Yet reducing carbon dioxide with molecular hydrogen to form formaldehyde or formate requires crossing a steep endergonic thermodynamic barrier at standard neutral pH. In submarine alkaline hydrothermal vents generated by serpentinization of ultramafic mantle rock, however, warm hydrogen-rich fluids at pH 9.5 to 11 percolate through honeycombed iron-nickel-sulfide walls into carbonic Hadean ocean water near pH 5.8.",
        citations: ["src-vent-1"],
      },
      {
        type: "heading",
        id: "vent-h2-catalysis",
        level: 2,
        text: "Mackinawite Nanoclusters as Proto-Ferredoxins",
      },
      {
        type: "paragraph",
        id: "vent-p2",
        text: "Because the reduction potential of the H₂/H⁺ couple becomes strongly more negative as pH rises, whereas the CO₂/HCOO⁻ reduction potential is steeper on the acidic ocean side, semiconducting greigite (Fe₃S₄) and mackinawite (FeS) mineral membranes can conduct electrons directly from alkaline hydrothermal H₂ to oceanic CO₂—prefiguring the cubane [4Fe–4S] clusters that still sit at the catalytic heart of ancient hydrogenases and carbon monoxide dehydrogenases.",
        citations: ["src-vent-1"],
      },
    ],
    sources: [
      {
        id: "src-vent-1",
        label: "1",
        title:
          "Chemiosmotic proton gradients and iron-sulfide catalysis in simulated Hadean hydrothermal reactors (Illustrative Demo Synthesis)",
        authors: "ScientificRadar Prebiotic Chemistry Fixture",
        publication: "Stage A Reader Verification Corpus",
        year: "2026",
        isIllustrativeDemo: true,
      },
    ],
    relatedIds: ["art-blood-pigments-02", "art-solid-state-battery-08"],
  },

  // ============================================================================
  // ARTICLE 6: MEDICINE & HEALTH — Epigenome Editing
  // ============================================================================
  {
    id: "art-crispr-epigenome-06",
    slug: "programmable-epigenome-silencing-without-dna-cleavage",
    locale: "en",
    editorialType: "news",
    status: "demo",
    title:
      "Silencing Disease Genes Without Cutting DNA: Catalytically Inactive dCas9 Writes Durable Epigenetic Memory",
    dek: "By fusing dead Cas9 to methyltransferase and KRAB effector domains, researchers can lock target promoters into a heritable repressed chromatin state while avoiding double-strand breaks.",
    summary:
      "Why non-cleaving epigenome editors eliminate chromosome translocation and indel risks while maintaining durable transcriptional silencing across mitotic cell divisions.",
    categorySlug: "medicine-health",
    subcategorySlugs: ["epigenome-engineering"],
    tagSlugs: ["epigenetics", "crispr", "gene-regulation", "therapeutics"],
    authorIds: ["auth-elena-vance"],
    publishedAt: "2026-10-10",
    readingTimeMinutes: 6,
    hero: {
      id: "media-crispr-hero",
      src: "/images/demo/crispr-epigenetic-silencing.svg",
      alt: "Diagram of dCas9 fused to DNMT3A/3L and KRAB domains depositing CpG methylation and H3K9me3 marks on a target DNA locus without cleaving the double helix.",
      width: 1200,
      height: 750,
      caption:
        "Mutating both RuvC and HNH nuclease domains yields a programmable DNA-binding scaffold (dCas9) that deposits synergistic CpG methylation and repressive histone modifications.",
      credit:
        "Original ScientificRadar Diagram (FIG-SR-2026-06) · CC0 Illustrative Demo Asset",
      rightsVerified: true,
      license: "CC0 1.0 Public Domain Dedication",
    },
    blocks: [
      {
        type: "paragraph",
        id: "crispr-p1",
        dropCap: true,
        text: "Conventional CRISPR-Cas9 nucleases disrupt target genes by severing both strands of the DNA phosphodiester backbone, relying on error-prone non-homologous end joining to introduce frameshift insertions or deletions. While effective for permanent gene knockout, double-strand breaks can trigger p53-mediated DNA damage responses, large kilobase deletions, or unintended chromosomal rearrangements when multiplexing across several genomic loci.",
        citations: ["src-crispr-1"],
      },
      {
        type: "heading",
        id: "crispr-h2-memory",
        level: 2,
        text: "Coordinated CpG Methylation and Histone H3K9me3 Deposition",
      },
      {
        type: "paragraph",
        id: "crispr-p2",
        text: "Epigenome editors take a fundamentally different approach: transient delivery of mRNA encoding a catalytically inactive dCas9 fused to both a KRAB transcriptional repressor and de novo DNA methyltransferase domains (DNMT3A–DNMT3L) writes dense 5-methylcytosine marks across target CpG islands. Once established, endogenous maintenance methyltransferase DNMT1 copies those methylation marks onto nascent DNA strands during every subsequent replication cycle, sustaining gene silencing long after the editor protein itself has degraded.",
        citations: ["src-crispr-1"],
      },
    ],
    sources: [
      {
        id: "src-crispr-1",
        label: "1",
        title:
          "Mitotically heritable chromatin silencing via transient dCas9-DNMT3A/KRAB ribonucleoprotein delivery (Illustrative Demo Synthesis)",
        authors: "ScientificRadar Molecular Medicine Fixture",
        publication: "Stage A Reader Verification Corpus",
        year: "2026",
        isIllustrativeDemo: true,
      },
    ],
    relatedIds: ["art-blood-pigments-02", "art-open-science-09"],
  },

  // ============================================================================
  // ARTICLE 7: EARTH & CLIMATE — Polar Ice Cores & Stratospheric Aerosols
  // ============================================================================
  {
    id: "art-paleoclimate-aerosols-07",
    slug: "bipolar-ice-cores-stratospheric-sulfate-forcing",
    locale: "en",
    editorialType: "research-digest",
    status: "demo",
    title:
      "Reading Ancient Stratospheric Veils in Synchronized Greenland and Antarctic Ice Cores",
    dek: "Mass-independent sulfur isotope anomalies (Δ³³S) trapped in polar firn layers distinguish global stratospheric plumes from local tropospheric eruptions.",
    summary:
      "How sub-annual laser ablation inductively coupled plasma mass spectrometry and cosmogenic beryllium-10 markers synchronize bipolar paleoclimate records to single-season precision.",
    categorySlug: "earth-climate",
    subcategorySlugs: ["paleoclimate-stratigraphy"],
    tagSlugs: ["paleoclimate", "ice-cores", "atmospheric-physics", "isotopes"],
    authorIds: ["auth-kerem-aydin"],
    publishedAt: "2026-10-05",
    readingTimeMinutes: 6,
    hero: {
      id: "media-aerosol-hero",
      src: "/images/demo/polar-stratospheric-aerosols.svg",
      alt: "Diagram of stratospheric SO2 photolysis into H2SO4 aerosol droplets and synchronized sulfate spikes preserved in Greenland and Antarctic ice cores.",
      width: 1200,
      height: 750,
      caption:
        "Ultraviolet photolysis below 240 nm in the stratosphere above the ozone layer imprints a nonzero mass-independent sulfur isotope signature (Δ33S) on sulfate aerosols deposited at both poles.",
      credit:
        "Original ScientificRadar Diagram (FIG-SR-2026-07) · CC0 Illustrative Demo Asset",
      rightsVerified: true,
      license: "CC0 1.0 Public Domain Dedication",
    },
    blocks: [
      {
        type: "paragraph",
        id: "aero-p1",
        dropCap: true,
        text: "Not every volcanic sulfate spike preserved in a Greenland or Antarctic ice core cooled the global surface climate. An eruption whose plume remains trapped below the tropopause washes out through precipitation within weeks, leaving a strong regional acid layer but negligible planetary radiative forcing. Only plumes energetic enough to punch into the dry, stably stratified stratosphere—above 17 kilometers in the tropics—form persistent sub-micron sulfuric acid droplets that scatter incoming solar radiation for two to four years.",
        citations: ["src-aero-1"],
      },
      {
        type: "heading",
        id: "aero-h2-isotopes",
        level: 2,
        text: "Ultraviolet Photolysis and the Δ³³S Stratospheric Fingerprint",
      },
      {
        type: "paragraph",
        id: "aero-p2",
        text: "By measuring all four stable sulfur isotopes (³²S, ³³S, ³⁴S, and ³⁶S) within individual annual ice layers, paleoclimatologists can determine whether sulfate formed via standard tropospheric oxidation or shortwave UV photolysis above the ozone shield. That geochemical fingerprint resolves longstanding discrepancies between tree-ring summer cooling anomalies and bipolar ice-core sulfate inventories.",
        citations: ["src-aero-1"],
      },
    ],
    sources: [
      {
        id: "src-aero-1",
        label: "1",
        title:
          "Mass-independent sulfur isotope constraints on stratospheric aerosol optical depth in synchronized bipolar ice cores (Illustrative Demo Record)",
        authors: "ScientificRadar Paleoclimate Fixture",
        publication: "Stage A Reader Verification Corpus",
        year: "2026",
        isIllustrativeDemo: true,
      },
    ],
    relatedIds: ["art-anatolian-fault-03", "art-prebiotic-vents-05"],
  },

  // ============================================================================
  // ARTICLE 8: CHEMISTRY / TECHNOLOGY — Solid-State Sulfide Batteries
  // ============================================================================
  {
    id: "art-solid-state-battery-08",
    slug: "chemo-mechanical-dendrite-suppression-solid-state-electrolytes",
    locale: "en",
    editorialType: "news",
    status: "demo",
    title:
      "Stopping Lithium Filaments at Ceramic Grain Boundaries in Argyrodite Solid-State Batteries",
    dek: "Operando X-ray tomography reveals how lithiophilic silver-carbon interlayers homogenize current density and prevent electro-chemo-mechanical crack propagation.",
    summary:
      "Why rigid ceramic electrolytes still fracture under high-rate lithium plating, and how ductile nanocomposite interlayers stabilize the solid-solid anode interface.",
    categorySlug: "chemistry",
    subcategorySlugs: ["electrochemistry"],
    tagSlugs: ["electrochemistry", "batteries", "materials-science"],
    authorIds: ["auth-claire-lin", "auth-marcus-chen"],
    publishedAt: "2026-09-29",
    readingTimeMinutes: 5,
    hero: {
      id: "media-battery-hero",
      src: "/images/demo/solid-state-electrolyte-interface.svg",
      alt: "Cross-sectional diagram of a solid-state battery showing dense lithium metal, an Ag-C lithiophilic interlayer, an Li6PS5Cl argyrodite ceramic electrolyte, and an NMC811 cathode.",
      width: 1200,
      height: 750,
      caption:
        "Sulfide argyrodite electrolytes (Li6PS5Cl) match liquid electrolytes in room-temperature ionic conductivity, but require compliant interlayers to prevent void formation during stripping and filament wedging during fast charging.",
      credit:
        "Original ScientificRadar Diagram (FIG-SR-2026-10) · CC0 Illustrative Demo Asset",
      rightsVerified: true,
      license: "CC0 1.0 Public Domain Dedication",
    },
    blocks: [
      {
        type: "paragraph",
        id: "bat-p1",
        dropCap: true,
        text: "Replacing flammable organic carbonate electrolytes with inorganic solid-state ion conductors was once expected to automatically eliminate lithium metal dendrites. Because ceramics such as garnet LLZO and sulfide argyrodites (Li₆PS₅Cl) possess shear moduli orders of magnitude higher than metallic lithium, simple continuum models predicted that soft lithium filaments would be mechanically blocked at the electrolyte surface. In practice, however, fast charging above a critical current density drives metallic lithium directly into microscopic surface pores and grain boundaries, wedging the ceramic apart like hydraulic fracturing.",
        citations: ["src-bat-1"],
      },
      {
        type: "heading",
        id: "bat-h2-interlayer",
        level: 2,
        text: "Ductile Silver–Carbon Interlayers Homogenize Interfacial Flux",
      },
      {
        type: "paragraph",
        id: "bat-p2",
        text: "Introducing a five-micrometer silver–carbon nanocomposite interlayer between the current collector and the sulfide ceramic solves both contact loss during discharge and localized stress concentration during charge. Silver nanoparticles form a solid-solution alloy with lithium that lowers the nucleation overpotential to nearly zero, guiding uniform, planar lithium deposition across thousands of cycles.",
        citations: ["src-bat-1"],
      },
    ],
    sources: [
      {
        id: "src-bat-1",
        label: "1",
        title:
          "Electro-chemo-mechanical fracture thresholds and alloy interlayer stabilization in argyrodite solid-state cells (Illustrative Demo Synthesis)",
        authors: "ScientificRadar Electrochemistry Fixture",
        publication: "Stage A Reader Verification Corpus",
        year: "2026",
        isIllustrativeDemo: true,
      },
    ],
    relatedIds: ["art-neuromorphic-crossbar-09", "art-spider-silk-01"],
  },

  // ============================================================================
  // ARTICLE 9: TECHNOLOGY — Neuromorphic Crossbar Computing
  // ============================================================================
  {
    id: "art-neuromorphic-crossbar-09",
    slug: "memristive-crossbars-analog-in-memory-inference",
    locale: "en",
    editorialType: "feature",
    status: "demo",
    title:
      "Computing With Ohm's Law: How Memristive Crossbars Bypass the von Neumann Memory Wall",
    dek: "Instead of shuttling synaptic weights back and forth between DRAM and digital ALUs, resistive switching arrays perform matrix-vector multiplication directly inside non-volatile memory.",
    summary:
      "How filamentary hafnium-oxide and phase-change memory arrays execute analog multiply-accumulate operations in a single clock cycle while taming device-to-device conductance drift.",
    categorySlug: "technology",
    subcategorySlugs: ["neuromorphic-computing"],
    tagSlugs: ["neuromorphic", "hardware", "computing", "semiconductors"],
    authorIds: ["auth-marcus-chen"],
    publishedAt: "2026-09-22",
    readingTimeMinutes: 7,
    hero: {
      id: "media-neuro-hero",
      src: "/images/demo/neuromorphic-synaptic-array.svg",
      alt: "Schematic of a horizontal wordline and vertical bitline memristive crossbar array performing analog matrix-vector multiplication via Ohm's and Kirchhoff's laws.",
      width: 1200,
      height: 750,
      caption:
        "Applying an input voltage vector along horizontal wordlines produces bitline currents proportional to the sum of voltage-conductance products, executing an entire matrix-vector multiply in parallel.",
      credit:
        "Original ScientificRadar Diagram (FIG-SR-2026-08) · CC0 Illustrative Demo Asset",
      rightsVerified: true,
      license: "CC0 1.0 Public Domain Dedication",
    },
    blocks: [
      {
        type: "paragraph",
        id: "neuro-p1",
        dropCap: true,
        text: "In conventional digital accelerators, executing a single multiply-accumulate operation costs less than a picojoule of arithmetic energy, yet fetching the corresponding weight parameters from off-chip dynamic random-access memory (DRAM) across metallic interconnects consumes up to two hundred times more energy. As scientific foundation models and autonomous sensor processors scale, data movement—not logic switching—dominates total power dissipation.",
        citations: ["src-neuro-1"],
      },
      {
        type: "heading",
        id: "neuro-h2-kirchhoff",
        level: 2,
        text: "Analog Conductance States and Stochastic Drift Compensation",
      },
      {
        type: "paragraph",
        id: "neuro-p2",
        text: "Analog in-memory computing collapses storage and arithmetic into the same physical nanoscale junction. By programming the oxygen-vacancy filament geometry inside a transition-metal oxide memristor to a target conductance Gij, each crosspoint stores an analog synaptic weight. When voltage pulses Vi arrive along the rows, Ohm's law multiplies voltage by conductance at every junction simultaneously, and Kirchhoff's current law sums the resulting currents down each column wire in O(1) time complexity.",
        citations: ["src-neuro-1"],
      },
    ],
    sources: [
      {
        id: "src-neuro-1",
        label: "1",
        title:
          "Mixed-precision analog in-memory matrix-vector multiplication on multi-level HfO2 resistive crossbars (Illustrative Demo Synthesis)",
        authors: "ScientificRadar Neuromorphic Systems Fixture",
        publication: "Stage A Reader Verification Corpus",
        year: "2026",
        isIllustrativeDemo: true,
      },
    ],
    relatedIds: ["art-quantum-braiding-04", "art-open-science-09"],
  },

  // ============================================================================
  // ARTICLE 10: SOCIETY & RESEARCH — Open Science & Registered Reports
  // ============================================================================
  {
    id: "art-open-science-09",
    slug: "registered-reports-computational-reproducibility-metascience",
    locale: "en",
    editorialType: "explainer",
    status: "demo",
    title:
      "Reviewing the Method Before the Result: How Registered Reports Curb Publication Bias",
    dek: "When peer reviewers evaluate experimental design and statistical power prior to data collection, null findings and replications regain their rightful place in the scientific record.",
    summary:
      "Empirical metascience shows that shifting peer review upstream eliminates selective outcome reporting and dramatically compresses inflated effect-size estimates.",
    categorySlug: "society-research",
    subcategorySlugs: ["metascience-reproducibility", "science-infrastructure"],
    tagSlugs: ["metascience", "reproducibility", "peer-review", "statistics"],
    authorIds: ["auth-marcus-chen", "auth-elena-vance"],
    publishedAt: "2026-09-15",
    readingTimeMinutes: 6,
    hero: {
      id: "media-repro-hero",
      src: "/images/demo/open-science-reproducibility.svg",
      alt: "Three-stage diagram of Registered Reports showing Stage 1 protocol peer review, deterministic containerized execution, and outcome-neutral Stage 2 archival.",
      width: 1200,
      height: 750,
      caption:
        "Granting In-Principle Acceptance (IPA) before experiments are run decouples editorial acceptance from whether p-values cross an arbitrary 0.05 threshold.",
      credit:
        "Original ScientificRadar Diagram (FIG-SR-2026-09) · CC0 Illustrative Demo Asset",
      rightsVerified: true,
      license: "CC0 1.0 Public Domain Dedication",
    },
    blocks: [
      {
        type: "paragraph",
        id: "repro-p1",
        dropCap: true,
        text: "Across decades of biomedical, psychological, and ecological literature, audits of standard articles routinely find that more than 90 percent of published primary hypotheses report statistically significant positive support—even in subfields where average statistical power hovers near 40 percent. This mathematical impossibility reflects two reinforcing distortions: the 'file-drawer effect,' in which rigorous null results remain unpublished, and post-hoc analytical flexibility, in which researchers subtly adjust covariates or outlier exclusions until a p-value dips below 0.05.",
        citations: ["src-repro-1"],
      },
      {
        type: "heading",
        id: "repro-h2-ipa",
        level: 2,
        text: "Two-Stage Review and Containerized Provenance",
      },
      {
        type: "paragraph",
        id: "repro-p2",
        text: "Registered Reports restructure incentives by splitting peer review into two stages. In Stage 1, authors submit their theoretical rationale, exact experimental protocol, a priori power calculation, and locked analysis scripts before observing any outcome data. Once reviewers approve the methodology, the journal grants In-Principle Acceptance (IPA), guaranteeing publication regardless of whether the eventual effect is positive or null—provided the authors adhere to their registered protocol and pass outcome-neutral quality controls.",
        citations: ["src-repro-1"],
      },
    ],
    sources: [
      {
        id: "src-repro-1",
        label: "1",
        title:
          "Comparative audit of positive-result rates in traditional manuscripts versus two-stage Registered Reports (Illustrative Demo Synthesis)",
        authors: "ScientificRadar Metascience Fixture",
        publication: "Stage A Reader Verification Corpus",
        year: "2026",
        isIllustrativeDemo: true,
      },
    ],
    relatedIds: ["art-crispr-epigenome-06", "art-spider-silk-01"],
  },
];
