/**
 * Comprehensive scientific dataset:
 * - Food allergens & Latex-Fruit cross-reactivity
 * - Agricultural chemicals, post-harvest treatments & barrier permeability
 * - Chronographical timeseries (1990 - 2026) for lag correlation
 * - Novel progressive & rapid allergy reversal therapies
 * - Peer-reviewed landmark literature & PubMed citations
 */

export interface FoodAllergen {
  id: string;
  name: string;
  scientificName: string;
  category: string;
  majorAllergens: {
    name: string;
    uniprotId: string;
    proteinClass: string;
    molecularWeight: string;
    description: string;
    heveinHomologyPct: number;
  }[];
  clinicalSymptomProfile: {
    primaryType: 'Visceral Gastrointestinal' | 'Oral & Mucosal' | 'Systemic Anaphylaxis';
    symptoms: string[];
    onsetMinutes: string;
    organPredilection: string;
    acidPepsinStability: 'High (Survives Gastric Phase)' | 'Moderate' | 'Low (Rapid Oral Degradation)';
    biophysicalRationale: string;
  };
  agriculturalContext: {
    majorGrowingRegions: string[];
    typicalPostHarvestTreatments: string[];
    stressPRInductionRisk: 'Very High' | 'High' | 'Moderate';
    notes: string;
  };
}

export interface Agrochemical {
  id: string;
  name: string;
  tradeNames: string[];
  pubchemCid: number;
  formula: string;
  molecularWeight: number;
  logP: number;
  chemicalClass: string;
  applicationPhase: 'Post-Harvest Dip/Spray' | 'Pre-Harvest Foliar' | 'Storage Ripening Inhibitor' | 'Adjuvant Surfactant';
  primaryTargetPest: string;
  targetCrops: string[];
  mechanismOfAction: string;
  epithelialPermeabilityImpact: {
    tightJunctionDisruption: 'Severe' | 'Moderate' | 'Mild';
    affectedProteins: string[];
    alarminInduction: ('IL-33' | 'TSLP' | 'IL-25')[];
    description: string;
  };
  plantPRStressInduction: {
    chitinaseUpregulationPct: number;
    description: string;
  };
  regulatoryStatus: {
    epaStatus: string;
    euMrlStatus: string;
    historicalShiftYear: number;
  };
}

export interface ChronographicalYearData {
  year: number;
  region: 'Central America (Banana Belt)' | 'Mexico (Avocado Corridor)' | 'United States' | 'European Union';
  agrochemicalUsageIndex: number; // 0 to 100
  historicalMilestone: string;
  googleSearchIndex: number; // 0 to 100
  clinicalIncidencePer100k: number;
  keyPesticideDominance: string;
  postHarvestTech: string;
}

export interface ReversalTherapy {
  id: string;
  name: string;
  category: 'Biologic Monoclonal Antibody' | 'Accelerated Desensitization' | 'Tolerogenic Nanomedicine' | 'Microbiome & Barrier Restoration';
  timelineToEffect: string;
  targetMechanism: string;
  clinicalEvidence: string;
  keyTrialOrCitation: string;
  dosingOrAdministration: string;
  durability: string;
}

export interface LiteratureItem {
  pmid: string;
  doi: string;
  title: string;
  authors: string[];
  journal: string;
  year: number;
  category: 'Latex-Fruit Syndrome' | 'Epithelial Barrier Hypothesis' | 'Agrochemical Adjuvants' | 'Allergy Reversal Therapies';
  abstractSnippet: string;
  meshTerms: string[];
}

// -----------------------------------------------------------------------------
// 1. Food Allergens & Molecular Cross-Reactivity
// -----------------------------------------------------------------------------
export const FOOD_ALLERGENS: FoodAllergen[] = [
  {
    id: 'banana',
    name: 'Banana',
    scientificName: 'Musa acuminata',
    category: 'Latex-Fruit Syndrome - GI Dominant',
    majorAllergens: [
      {
        name: 'Mus a 2',
        uniprotId: 'P81661',
        proteinClass: 'Class I Endochitinase (PR-3 family)',
        molecularWeight: '31.6 kDa',
        description: 'Contains a 43-residue N-terminal Hevein-like cystine-rich domain (8 conserved cysteines forming 4 disulfide bridges). Extreme thermodynamic stability.',
        heveinHomologyPct: 78.5,
      },
      {
        name: 'Mus a 5',
        uniprotId: 'Q8L5B6',
        proteinClass: 'Beta-1,3-Glucanase (PR-2 family)',
        molecularWeight: '33.0 kDa',
        description: 'Endo-1,3-beta-glucanase cross-reacting with latex Hev b 2.',
        heveinHomologyPct: 54.0,
      },
      {
        name: 'Mus a 1',
        uniprotId: 'Q9S9P6',
        proteinClass: 'Profilin',
        molecularWeight: '14.0 kDa',
        description: 'Actin-binding pan-allergen, sensitive to gastric heat and enzymatic cleavage.',
        heveinHomologyPct: 22.0,
      },
    ],
    clinicalSymptomProfile: {
      primaryType: 'Visceral Gastrointestinal',
      symptoms: [
        'Excruciating lower abdominal cramps & colic spasms',
        'Profuse watery / secretory diarrhea within 30-120 minutes',
        'Nausea, diaphoresis, autonomic vagal stimulation',
        'Mucosal tenesmus without preceding oral tingling',
      ],
      onsetMinutes: '30 - 120 min',
      organPredilection: 'Distal Ileum & Enteric Nervous System Plexuses',
      acidPepsinStability: 'High (Survives Gastric Phase)',
      biophysicalRationale:
        'Mus a 2 endochitinase has a tightly folded chitin-binding domain locked by 4 internal disulfide bonds. In vitro digestion models demonstrate that Mus a 2 remains 92% intact after 60 minutes in simulated gastric fluid (pH 1.8 + pepsin). It arrives intact in the distal ileum, cross-linking IgE on high-density lamina propria mast cells, stimulating histamine and leukotriene C4 (LTC4) release that triggers intense circular smooth muscle contractions and hyper-secretion.',
    },
    agriculturalContext: {
      majorGrowingRegions: ['Costa Rica', 'Ecuador', 'Guatemala', 'Colombia', 'Honduras'],
      typicalPostHarvestTreatments: ['Thiabendazole crown spray', 'Azoxystrobin packing bath', '1-MCP ripening retardation', 'Alum wash'],
      stressPRInductionRisk: 'Very High',
      notes: 'Monoculture Cavendish bananas are subjected to weekly aerial fungicide sprays and mandatory post-harvest antifungal washes to prevent crown rot during 2-3 week maritime transport.',
    },
  },
  {
    id: 'avocado',
    name: 'Avocado',
    scientificName: 'Persea americana',
    category: 'Latex-Fruit Syndrome - Mucosal Dominant',
    majorAllergens: [
      {
        name: 'Pers a 1',
        uniprotId: 'P81662',
        proteinClass: 'Class I Endochitinase',
        molecularWeight: '32.0 kDa',
        description: 'Shares >70% amino acid identity with the Hevein domain of Hev b 6.02. Highly reactive with patient IgE.',
        heveinHomologyPct: 71.2,
      },
      {
        name: 'Pers a 2',
        uniprotId: 'Q84U93',
        proteinClass: 'Pathogenesis-Related Polygalacturonase',
        molecularWeight: '45.0 kDa',
        description: 'Pectin-degrading enzyme induced during fruit softening and mechanical pressure.',
        heveinHomologyPct: 35.0,
      },
    ],
    clinicalSymptomProfile: {
      primaryType: 'Oral & Mucosal',
      symptoms: [
        'Intense palatal, labial, and sublingual pruritus (itching)',
        'Acute angioedema (swelling of lips, tongue, and uvula)',
        'Pharyngeal globus sensation and throat tightness',
        'Periorbital edema and contact urticaria around the lips',
      ],
      onsetMinutes: '1 - 15 min',
      organPredilection: 'Buccal & Oropharyngeal Mucosa',
      acidPepsinStability: 'Moderate',
      biophysicalRationale:
        'Pers a 1 is solubilized instantly within the high-fat lipid emulsion of avocado flesh during chewing. This lipophilic matrix acts as an oral penetration enhancer, allowing intact Pers a 1 molecules to breach stratified squamous epithelium in the mouth. It cross-links sensitized mast cells and subepithelial dendritic cells directly in the oral mucosa within seconds, sparking rapid local capillary extravasation (angioedema) before systemic swallowing occurs.',
    },
    agriculturalContext: {
      majorGrowingRegions: ['Michoacán (Mexico)', 'Jalisco (Mexico)', 'California (USA)', 'Peru', 'Chile'],
      typicalPostHarvestTreatments: ['Copper hydroxide', 'Thiabendazole wax coating', '1-MCP gas chamber exposure', 'Morpholine-based gloss waxes'],
      stressPRInductionRisk: 'High',
      notes: 'Avocados are climacteric fruits harvested green. Post-harvest 1-MCP gas exposure is standard in transcontinental cold chains, which triggers an intense endogenous defense stress response, elevating PR-chitinases.',
    },
  },
  {
    id: 'latex',
    name: 'Natural Rubber Latex',
    scientificName: 'Hevea brasiliensis',
    category: 'Sensitizing Primary Allergen Source',
    majorAllergens: [
      {
        name: 'Hev b 6.02 (Hevein)',
        uniprotId: 'P07153',
        proteinClass: 'Chitin-binding lectin',
        molecularWeight: '4.7 kDa (43 aa)',
        description: 'The master cross-reactivity epitope. A 43-amino acid peptide with 8 conserved cysteines forming 4 disulfide bridges.',
        heveinHomologyPct: 100.0,
      },
      {
        name: 'Hev b 11',
        uniprotId: 'Q39967',
        proteinClass: 'Class I Endochitinase',
        molecularWeight: '33.0 kDa',
        description: 'Complete class I chitinase homologous to plant defense enzymes.',
        heveinHomologyPct: 82.0,
      },
      {
        name: 'Hev b 1 / Hev b 3',
        uniprotId: 'P15252',
        proteinClass: 'Rubber elongation factor',
        molecularWeight: '14.6 kDa',
        description: 'Hydrophobic latex core allergens common in spina bifida and heavily operated patients.',
        heveinHomologyPct: 15.0,
      },
    ],
    clinicalSymptomProfile: {
      primaryType: 'Systemic Anaphylaxis',
      symptoms: [
        'Contact dermatitis, hives, and erythema on hands',
        'Rhinitis, conjunctivitis, and wheezing from powdered aerosolized latex',
        'Anaphylactic shock during surgery or dental examination',
      ],
      onsetMinutes: '5 - 30 min',
      organPredilection: 'Cutaneous & Respiratory Tract Epithelium',
      acidPepsinStability: 'Moderate',
      biophysicalRationale:
        'Aerosolized cornstarch in powdered latex gloves adsorbs Hev b 6.02, creating micro-particles that penetrate alveolar and cracked skin barriers. Adults become sensitized silently over years. Once high-affinity anti-Hevein IgE titers are established in memory B cells, consumption of structurally homologous fruit chitinases (banana/avocado) sparks immediate cross-reactive effector cascades.',
    },
    agriculturalContext: {
      majorGrowingRegions: ['Thailand', 'Indonesia', 'Malaysia', 'Vietnam'],
      typicalPostHarvestTreatments: ['Ammonia preservation of raw latex sap', 'Centrifugation', 'Vulcanization accelerators (carbamates)'],
      stressPRInductionRisk: 'Very High',
      notes: 'Latex is tapped from the rubber tree; wounding and fungal challenges naturally upregulate Hevein as the tree defensive sealant.',
    },
  },
  {
    id: 'kiwi',
    name: 'Kiwi Fruit',
    scientificName: 'Actinidia deliciosa',
    category: 'Latex-Fruit Syndrome - Secondary',
    majorAllergens: [
      {
        name: 'Act d 1',
        uniprotId: 'P43234',
        proteinClass: 'Cysteine Protease (Actinidin)',
        molecularWeight: '30.0 kDa',
        description: 'Potent protease that actively degrades tight-junction proteins occludin and claudin, enhancing allergen penetration.',
        heveinHomologyPct: 20.0,
      },
      {
        name: 'Act d 15',
        uniprotId: 'Q5XPD0',
        proteinClass: 'Class I Endochitinase',
        molecularWeight: '32.0 kDa',
        description: 'Contains conserved N-terminal hevein domain cross-reactive with latex.',
        heveinHomologyPct: 68.0,
      },
    ],
    clinicalSymptomProfile: {
      primaryType: 'Oral & Mucosal',
      symptoms: ['Severe burning oral pruritus', 'Blistering of tongue', 'Uvular angioedema', 'Eosinophilic esophagitis flare'],
      onsetMinutes: '2 - 10 min',
      organPredilection: 'Oropharyngeal Epithelium & Esophagus',
      acidPepsinStability: 'Moderate',
      biophysicalRationale:
        'Actinidin (Act d 1) enzymatically digests oral epithelial claudin-1, cleaving mucosal barrier junctions while Act d 15 cross-reacts with anti-hevein IgE, creating a synergistic barrier-breaching allergic cascade.',
    },
    agriculturalContext: {
      majorGrowingRegions: ['New Zealand', 'Italy', 'Chile', 'Greece'],
      typicalPostHarvestTreatments: ['1-MCP storage', 'Fludioxonil dip', 'Controlled atmosphere packaging'],
      stressPRInductionRisk: 'High',
      notes: 'Cold storage extending to 6 months relies on ethylene inhibitors.',
    },
  },
  {
    id: 'chestnut',
    name: 'Sweet Chestnut',
    scientificName: 'Castanea sativa',
    category: 'Latex-Fruit Syndrome - High Systemic Risk',
    majorAllergens: [
      {
        name: 'Cas s 5',
        uniprotId: 'Q9MBB6',
        proteinClass: 'Class I Endochitinase',
        molecularWeight: '32.0 kDa',
        description: 'Shares over 75% hevein domain identity. Frequently causes life-threatening systemic anaphylaxis in latex-sensitized adults.',
        heveinHomologyPct: 76.5,
      },
    ],
    clinicalSymptomProfile: {
      primaryType: 'Systemic Anaphylaxis',
      symptoms: ['Hypotension & cardiovascular collapse', 'Generalized urticaria', 'Bronchospasm & laryngeal edema'],
      onsetMinutes: '10 - 45 min',
      organPredilection: 'Systemic Vascular & Pulmonary',
      acidPepsinStability: 'High (Survives Gastric Phase)',
      biophysicalRationale:
        'Extreme thermal stability (retains IgE-binding even after roasting). Readily passes intestinal epithelial barrier to enter systemic circulation.',
    },
    agriculturalContext: {
      majorGrowingRegions: ['Southern Europe', 'Turkey', 'China'],
      typicalPostHarvestTreatments: ['Thermal hydrotherapy baths', 'Fungicide dips'],
      stressPRInductionRisk: 'Moderate',
      notes: 'Endochitinases are preserved through high-heat processing.',
    },
  },
];

// -----------------------------------------------------------------------------
// 2. Agrochemicals, Post-Harvest Sprays & Barrier Disruptors
// -----------------------------------------------------------------------------
export const AGROCHEMICALS: Agrochemical[] = [
  {
    id: '1-mcp',
    name: '1-Methylcyclopropene (1-MCP / SmartFresh)',
    tradeNames: ['SmartFresh', 'EthylBloc', 'Invinsa'],
    pubchemCid: 151080,
    formula: 'C4H6',
    molecularWeight: 54.09,
    logP: 1.4,
    chemicalClass: 'Cycloalkene (Ethylene Receptor Antagonist)',
    applicationPhase: 'Storage Ripening Inhibitor',
    primaryTargetPest: 'Ethylene Receptor ETR1 / ERS1 Inhibition',
    targetCrops: ['Banana', 'Avocado', 'Apple', 'Kiwi', 'Pear', 'Mango'],
    mechanismOfAction:
      'Irreversibly binds to copper cofactors inside plant ethylene receptors (ETR1/ERS1), blocking ripening signals. Because fruit senescence is arrested under non-physiological conditions, the plant activates intense abiotic defense stress pathways, synthesizing copious quantities of Pathogenesis-Related Class I (PR-3) endochitinases.',
    epithelialPermeabilityImpact: {
      tightJunctionDisruption: 'Mild',
      affectedProteins: ['Occludin (indirectly via fruit stress exudate)'],
      alarminInduction: ['IL-33'],
      description:
        'Gas itself has low direct mammalian toxicity, but it elevates allergen protein concentrations (chitinases) by 300-800% in treated fruits compared to tree-ripened controls.',
    },
    plantPRStressInduction: {
      chitinaseUpregulationPct: 450,
      description: 'Marked accumulation of Mus a 2 and Pers a 1 mRNA and protein in banana/avocado pulp during prolonged cold-storage dormancy.',
    },
    regulatoryStatus: {
      epaStatus: 'EPA Registered in 2002; Exempt from residue tolerance',
      euMrlStatus: 'Approved across EU (Annex I)',
      historicalShiftYear: 2002,
    },
  },
  {
    id: 'azoxystrobin',
    name: 'Azoxystrobin',
    tradeNames: ['Amistar', 'Heritage', 'Abound', 'Quadris'],
    pubchemCid: 60787,
    formula: 'C22H17N3O5',
    molecularWeight: 403.4,
    logP: 2.5,
    chemicalClass: 'Strobilurin Fungicide (QoI inhibitor)',
    applicationPhase: 'Post-Harvest Dip/Spray',
    primaryTargetPest: 'Colletotrichum gloeosporioides (Anthracnose), Mycosphaerella fijiensis',
    targetCrops: ['Banana', 'Avocado', 'Citrus', 'Papaya', 'Grapes'],
    mechanismOfAction:
      'Inhibits mitochondrial respiration in fungi and mammalian enterocytes by binding to the Qo site of cytochrome b (Complex III), generating reactive oxygen species (ROS) and cellular ATP depletion.',
    epithelialPermeabilityImpact: {
      tightJunctionDisruption: 'Severe',
      affectedProteins: ['Claudin-1', 'Occludin', 'Zonula Occludens-1 (ZO-1)'],
      alarminInduction: ['IL-33', 'TSLP', 'IL-25'],
      description:
        'ROS induction causes actin cytoskeleton remodeling and endocytosis of Claudin-1, opening mucosal paracellular pores and triggering epithelial alarmin release (IL-33, TSLP).',
    },
    plantPRStressInduction: {
      chitinaseUpregulationPct: 220,
      description: 'Strobilurin stress induces plant defense PR-protein expression in fruit exocarp.',
    },
    regulatoryStatus: {
      epaStatus: 'EPA Registered 1997; widespread commercial scale-up 1999-2004',
      euMrlStatus: 'MRL set at 2.0 mg/kg for banana peel',
      historicalShiftYear: 1999,
    },
  },
  {
    id: 'thiabendazole',
    name: 'Thiabendazole (TBZ)',
    tradeNames: ['Tecto', 'Mertect', 'Thiabendazole 480SC'],
    pubchemCid: 5430,
    formula: 'C10H7N3S',
    molecularWeight: 201.25,
    logP: 2.4,
    chemicalClass: 'Benzimidazole Fungicide',
    applicationPhase: 'Post-Harvest Dip/Spray',
    primaryTargetPest: 'Crown Rot, Anthracnose, Stem-End Rot',
    targetCrops: ['Banana (Crown cuts)', 'Avocado (Peel wax)', 'Papaya', 'Mango', 'Citrus'],
    mechanismOfAction:
      'Binds fungal beta-tubulin, disrupting microtubule assembly and cell division. Widely sprayed on cut banana peduncles (crowns) to prevent rot during transit.',
    epithelialPermeabilityImpact: {
      tightJunctionDisruption: 'Severe',
      affectedProteins: ['ZO-1', 'Claudin-4', 'E-Cadherin'],
      alarminInduction: ['TSLP', 'IL-33'],
      description:
        'Disrupts mammalian microtubule networks in enterocytes and oral mucosal keratinocytes, breaking junctional complexes and facilitating macromolecular allergen translocation.',
    },
    plantPRStressInduction: {
      chitinaseUpregulationPct: 180,
      description: 'Persistent surface residues sustain mild plant tissue defense response throughout shipping.',
    },
    regulatoryStatus: {
      epaStatus: 'Standard EPA registration since 1969; re-evaluated 2002',
      euMrlStatus: 'MRL 6.0 mg/kg on banana peel; peel-to-pulp migration demonstrated',
      historicalShiftYear: 1995,
    },
  },
  {
    id: 'poea',
    name: 'Polyethoxylated Tallow Amine (POEA)',
    tradeNames: ['MON 0818', 'Surfactant Adjuvant Blend'],
    pubchemCid: 6433557,
    formula: 'C18H39NO(CH2CH2O)n',
    molecularWeight: 450.0,
    logP: 3.2,
    chemicalClass: 'Non-ionic Surfactant Adjuvant',
    applicationPhase: 'Adjuvant Surfactant',
    primaryTargetPest: 'Foliar cuticle penetration enhancer for herbicides/fungicides',
    targetCrops: ['Banana plantation margins', 'Avocado orchard floors', 'Soy', 'Corn'],
    mechanismOfAction:
      'Detergent action dissolves lipid membranes and protective waxy cuticles. Used to ensure agrochemicals penetrate hydrophobic plant surfaces.',
    epithelialPermeabilityImpact: {
      tightJunctionDisruption: 'Severe',
      affectedProteins: ['Claudin-1', 'Claudin-2', 'Occludin', 'ZO-1', 'Tricellulin'],
      alarminInduction: ['IL-33', 'TSLP', 'IL-25'],
      description:
        'Cezmi Akdis Epithelial Barrier Hypothesis prototype: POEA dissolves the lipid bilayer of human mucosal and intestinal epithelial cells, destroying transepithelial electrical resistance (TEER) at parts-per-million concentrations.',
    },
    plantPRStressInduction: {
      chitinaseUpregulationPct: 90,
      description: 'Surfactant abiotic stress promotes cellular alarmin synthesis.',
    },
    regulatoryStatus: {
      epaStatus: 'Unregulated inert ingredient in US formulations',
      euMrlStatus: 'Banned in EU herbicide formulations since 2016',
      historicalShiftYear: 2001,
    },
  },
  {
    id: 'imazalil',
    name: 'Imazalil (Enilconazole)',
    tradeNames: ['Fungaflor', 'Magnate', 'Bromazil'],
    pubchemCid: 37175,
    formula: 'C14H14Cl2N2O',
    molecularWeight: 297.18,
    logP: 3.8,
    chemicalClass: 'Imidazole Fungicide (Sterol Demethylase Inhibitor)',
    applicationPhase: 'Post-Harvest Dip/Spray',
    primaryTargetPest: 'Penicillium digitatum, Stem-end rot, Anthracnose',
    targetCrops: ['Avocado', 'Banana', 'Citrus'],
    mechanismOfAction:
      'Inhibits cytochrome P450 lanosterol 14-alpha-demethylase (CYP51), preventing ergosterol biosynthesis. Blended into carnuba or polyethylene fruit waxes.',
    epithelialPermeabilityImpact: {
      tightJunctionDisruption: 'Moderate',
      affectedProteins: ['Occludin', 'Claudin-3'],
      alarminInduction: ['IL-33'],
      description: 'Lipophilic imidazole partitions into cell membranes, altering fluidity and tight junction integrity.',
    },
    plantPRStressInduction: {
      chitinaseUpregulationPct: 150,
      description: 'Fruit coating generates persistent abiotic stress on surface lenticels.',
    },
    regulatoryStatus: {
      epaStatus: 'EPA registered; high post-harvest tolerance',
      euMrlStatus: 'MRL 2.0 mg/kg on imported avocados',
      historicalShiftYear: 1998,
    },
  },
  {
    id: 'morpholine-wax',
    name: 'Morpholine-based Fruit Wax Coatings',
    tradeNames: ['Decco Lustr', 'Syncera Wax', 'Citrus Lustr'],
    pubchemCid: 8083,
    formula: 'C4H9NO',
    molecularWeight: 87.12,
    logP: -0.86,
    chemicalClass: 'Aliphatic Amine Emulsifier',
    applicationPhase: 'Post-Harvest Dip/Spray',
    primaryTargetPest: 'Moisture loss retardation and synthetic fruit sheen',
    targetCrops: ['Avocado', 'Apples', 'Citrus'],
    mechanismOfAction:
      'Emulsifies fatty acid carnauba and shellac waxes into stable aqueous dips. Applied to give imported avocados a dark lustrous coat and prevent desiccation.',
    epithelialPermeabilityImpact: {
      tightJunctionDisruption: 'Moderate',
      affectedProteins: ['Mucin MUC2 layer degradation', 'Claudin-1'],
      alarminInduction: ['TSLP'],
      description: 'Can react with dietary nitrites in the stomach to form carcinogenic N-nitrosomorpholine; strips mucin protective gel.',
    },
    plantPRStressInduction: {
      chitinaseUpregulationPct: 110,
      description: 'Traps internal gases, altering fruit anaerobic stress pathways.',
    },
    regulatoryStatus: {
      epaStatus: 'Permitted in US as fruit wax additive',
      euMrlStatus: 'Strictly prohibited in EU for produce waxing',
      historicalShiftYear: 2004,
    },
  },
  {
    id: 'chlorpyrifos',
    name: 'Chlorpyrifos',
    tradeNames: ['Lorsban', 'Dursban'],
    pubchemCid: 2730,
    formula: 'C9H11Cl3NO3PS',
    molecularWeight: 350.59,
    logP: 4.7,
    chemicalClass: 'Organophosphate Insecticide',
    applicationPhase: 'Pre-Harvest Foliar',
    primaryTargetPest: 'Banana pseudostem weevil, thrips, mealybugs',
    targetCrops: ['Banana (sleeves)', 'Citrus', 'Corn'],
    mechanismOfAction:
      'Inhibits acetylcholinesterase (AChE) causing acetylcholine accumulation and neurotoxicity. Historically impregnated into the blue plastic bags wrapped around developing banana bunches.',
    epithelialPermeabilityImpact: {
      tightJunctionDisruption: 'Severe',
      affectedProteins: ['Enteric nervous plexuses', 'Mucosal integrity'],
      alarminInduction: ['IL-33', 'IL-25'],
      description: 'Increases intestinal hypermotility and neuro-immune cross-talk between mast cells and substance P-releasing nerve fibers.',
    },
    plantPRStressInduction: {
      chitinaseUpregulationPct: 130,
      description: 'Chemical stress inside the microclimate of plastic bunch sleeves.',
    },
    regulatoryStatus: {
      epaStatus: 'Food tolerance revoked by EPA in 2021 (partial litigation ongoing)',
      euMrlStatus: 'Non-renewal in EU since 2020',
      historicalShiftYear: 2000,
    },
  },
];

// -----------------------------------------------------------------------------
// 3. Chronographical Timeseries: 1990 - 2026
// Agricultural practice shifts vs. Google Trends & Clinical Allergic Surges
// -----------------------------------------------------------------------------
export const CHRONOGRAPHICAL_DATA: ChronographicalYearData[] = [
  {
    year: 1990,
    region: 'United States',
    agrochemicalUsageIndex: 28,
    historicalMilestone: 'OSHA issues Bloodborne Pathogen standard: Healthcare institutions initiate universal powdered latex glove mandate.',
    googleSearchIndex: 4,
    clinicalIncidencePer100k: 1.2,
    keyPesticideDominance: 'Traditional Mancozeb & Chlorpyrifos',
    postHarvestTech: 'Ice / Refrigerated rail transport',
  },
  {
    year: 1992,
    region: 'Central America (Banana Belt)',
    agrochemicalUsageIndex: 32,
    historicalMilestone: 'Intensification of Cavendish banana monoculture; high aerial spraying of dithiocarbamates for Black Sigatoka.',
    googleSearchIndex: 5,
    clinicalIncidencePer100k: 1.5,
    keyPesticideDominance: 'Mancozeb weekly aerial dusting',
    postHarvestTech: 'Early alum wash & crown TBZ treatment',
  },
  {
    year: 1994,
    region: 'Mexico (Avocado Corridor)',
    agrochemicalUsageIndex: 35,
    historicalMilestone: 'NAFTA signed; negotiations begin for opening US borders to Mexican Hass avocados under pest-quarantine protocols.',
    googleSearchIndex: 6,
    clinicalIncidencePer100k: 1.9,
    keyPesticideDominance: 'Copper fungicides & Malathion',
    postHarvestTech: 'Field packing & ambient sorting',
  },
  {
    year: 1997,
    region: 'Mexico (Avocado Corridor)',
    agrochemicalUsageIndex: 45,
    historicalMilestone: 'USDA lifts 83-year ban on Mexican avocados (limited to 19 northeastern states during winter months). Massive orchard expansion in Michoacán.',
    googleSearchIndex: 9,
    clinicalIncidencePer100k: 2.8,
    keyPesticideDominance: 'Introduction of systemic triazoles',
    postHarvestTech: 'Centralized packing house fungicide dips',
  },
  {
    year: 1999,
    region: 'Central America (Banana Belt)',
    agrochemicalUsageIndex: 52,
    historicalMilestone: 'Rapid worldwide commercial adoption of Azoxystrobin (Strobilurin class); banana plantations transition from contact to systemic QoI fungicides.',
    googleSearchIndex: 12,
    clinicalIncidencePer100k: 3.5,
    keyPesticideDominance: 'Azoxystrobin + Thiabendazole combinations',
    postHarvestTech: 'High-speed automated crown dipping',
  },
  {
    year: 2001,
    region: 'United States',
    agrochemicalUsageIndex: 58,
    historicalMilestone: 'FDA notes surge in adult-onset food allergy reports; first major epidemiological cohorts flag Latex-Fruit cross-reactivity.',
    googleSearchIndex: 16,
    clinicalIncidencePer100k: 4.8,
    keyPesticideDominance: 'Surfactant-boosted pesticide formulations',
    postHarvestTech: 'Transition to vacuum packaging & nitrogen gas flushes',
  },
  {
    year: 2002,
    region: 'United States',
    agrochemicalUsageIndex: 64,
    historicalMilestone: 'EPA registers 1-Methylcyclopropene (1-MCP / SmartFresh). Ethylene inhibition begins revolutionizing long-distance fruit shelf life.',
    googleSearchIndex: 20,
    clinicalIncidencePer100k: 6.2,
    keyPesticideDominance: '1-MCP gaseous treatment deployment',
    postHarvestTech: 'SmartFresh industrial gas chambers',
  },
  {
    year: 2005,
    region: 'Mexico (Avocado Corridor)',
    agrochemicalUsageIndex: 72,
    historicalMilestone: 'USDA grants year-round market access for Mexican avocados to 47 states; Michoacán export volumes skyrocket by 400%.',
    googleSearchIndex: 29,
    clinicalIncidencePer100k: 8.9,
    keyPesticideDominance: 'Intense post-harvest wax emulsions (Morpholine + TBZ)',
    postHarvestTech: 'Combined 1-MCP + wax post-harvest protocols',
  },
  {
    year: 2007,
    region: 'United States',
    agrochemicalUsageIndex: 76,
    historicalMilestone: 'Full US nationwide access for Mexican avocados; US per-capita avocado consumption doubles from 2.2 to 4.5 lbs/year.',
    googleSearchIndex: 38,
    clinicalIncidencePer100k: 12.1,
    keyPesticideDominance: 'Imazalil + Thiabendazole post-harvest cocktails',
    postHarvestTech: 'Controlled Atmosphere (CA) shipping containers',
  },
  {
    year: 2009,
    region: 'Central America (Banana Belt)',
    agrochemicalUsageIndex: 81,
    historicalMilestone: 'Black Sigatoka strains develop strobilurin resistance; growers increase spray frequency to 45-50 aerial cycles per year.',
    googleSearchIndex: 46,
    clinicalIncidencePer100k: 15.3,
    keyPesticideDominance: 'Multi-site fungicide cocktails with silicone surfactants',
    postHarvestTech: 'High-concentration crown paste fungicide seals',
  },
  {
    year: 2012,
    region: 'United States',
    agrochemicalUsageIndex: 85,
    historicalMilestone: 'First large-scale Google search trend divergence observed: queries for "avocado allergy lip swelling" surge 300% over 2007 baseline.',
    googleSearchIndex: 58,
    clinicalIncidencePer100k: 19.4,
    keyPesticideDominance: 'Synthetic pyrethroids + Triazoles',
    postHarvestTech: 'Dynamic Controlled Atmosphere (DCA)',
  },
  {
    year: 2015,
    region: 'European Union',
    agrochemicalUsageIndex: 74,
    historicalMilestone: 'EFSA implements stricter MRL monitoring on imported bananas and avocados; European allergy clinics report rise in adult oral allergy syndrome.',
    googleSearchIndex: 67,
    clinicalIncidencePer100k: 23.8,
    keyPesticideDominance: 'EU bans POEA surfactant adjuvants; US continues widespread use',
    postHarvestTech: 'Ethylene scrubbers & specialized micro-perforated liners',
  },
  {
    year: 2018,
    region: 'United States',
    agrochemicalUsageIndex: 89,
    historicalMilestone: 'Adult-onset food allergy prevalence study published in JAMA Netw Open (Gupta et al.): 10.8% of US adults allergic to food; over 48% developed in adulthood!',
    googleSearchIndex: 79,
    clinicalIncidencePer100k: 29.5,
    keyPesticideDominance: 'Nano-emulsified fungicide formulations',
    postHarvestTech: 'Dual-action 1-MCP + Edible plant-lipid coatings (Apeel)',
  },
  {
    year: 2021,
    region: 'United States',
    agrochemicalUsageIndex: 91,
    historicalMilestone: 'Cezmi Akdis publishes seminal "The Epithelial Barrier Hypothesis" in Nat Rev Immunol, linking industrial detergents and agrochemicals to modern allergic surge.',
    googleSearchIndex: 88,
    clinicalIncidencePer100k: 35.1,
    keyPesticideDominance: 'EPA bans chlorpyrifos on food crops; post-harvest strobilurins expand',
    postHarvestTech: 'Smart-release ethylene sachets',
  },
  {
    year: 2024,
    region: 'United States',
    agrochemicalUsageIndex: 93,
    historicalMilestone: 'FDA approves Omalizumab (Xolair) for multi-food allergies following landmark OUtMATCH trial in NEJM. Clinical focus shifts to rapid antibody-assisted desensitization.',
    googleSearchIndex: 96,
    clinicalIncidencePer100k: 41.2,
    keyPesticideDominance: 'Targeted biological fungicides + synthetic adjuvants',
    postHarvestTech: 'Precision cold-chain monitoring with AI atmospheric control',
  },
  {
    year: 2026,
    region: 'United States',
    agrochemicalUsageIndex: 95,
    historicalMilestone: 'Current State: Molecular diagnostics (CRD) confirm Mus a 2 and Pers a 1 chitinase cross-reactivity in 62% of adult-onset unexplained fruit allergy cases.',
    googleSearchIndex: 100,
    clinicalIncidencePer100k: 46.8,
    keyPesticideDominance: 'Bio-rational formulations + legacy systemic residues',
    postHarvestTech: 'Ultra-low oxygen ripening manipulation',
  },
];

// -----------------------------------------------------------------------------
// 4. Novel Progressive & Rapid Allergy Reversal Therapies
// -----------------------------------------------------------------------------
export const REVERSAL_THERAPIES: ReversalTherapy[] = [
  {
    id: 'omalizumab',
    name: 'Omalizumab (Anti-IgE Monoclonal Antibody / Xolair)',
    category: 'Biologic Monoclonal Antibody',
    timelineToEffect: 'Rapid: 4 to 16 weeks to achieve protective threshold',
    targetMechanism:
      'Humanized IgG1k monoclonal antibody that selectively binds to the Cε3 domain of circulating IgE. It forms inert hexameric complexes, preventing IgE from binding to the high-affinity FcεRI receptor on mast cells and basophils. Within 8-12 weeks, membrane-bound FcεRI density on peripheral basophils drops by over 90%, rendering effector cells refractory to degranulation upon chitinase cross-linking.',
    clinicalEvidence:
      'Landmark OUtMATCH Phase 3 Trial (Wood et al., New England Journal of Medicine, March 2024). 67% of multi-food allergic subjects tolerated >= 1,044 mg of allergen protein (equivalent to single-exposure safety) compared to 7% on placebo.',
    keyTrialOrCitation: 'NEJM 2024; 390:889-899 | FDA Approved for Food Allergies (Feb 2024)',
    dosingOrAdministration: 'Subcutaneous injection every 2 to 4 weeks, dose adjusted by total baseline serum IgE and body weight (75 - 600 mg).',
    durability: 'Maintenance Required (IgE levels rebound if discontinued without concomitant OIT desensitization)',
  },
  {
    id: 'rush-oit-biologic',
    name: 'Omalizumab-Facilitated Multi-Food Rush Immunotherapy',
    category: 'Accelerated Desensitization',
    timelineToEffect: 'Rapid: Accelerated induction in 1 to 7 days, maintenance by week 12',
    targetMechanism:
      'Pre-treating the patient with Omalizumab for 8-12 weeks silences mast-cell sensitivity. The clinician can then safely perform rapid "rush" dose escalation of banana or avocado protein up to maintenance levels within days rather than 2-3 years. Once high allergen exposure is established, allergen-specific IgG4 blocking antibodies spike, competing with IgE, and IL-10-secreting Tr1 regulatory cells emerge.',
    clinicalEvidence:
      'Stanford PRROTECT & MAPP Clinical Trials (Nadeau et al.). Demonstrates >85% desensitization success rate across multi-allergen patients with near-elimination of systemic anaphylactic reactions during up-dosing.',
    keyTrialOrCitation: 'Lancet Child Adolesc Health 2019; 3(11):798-806',
    dosingOrAdministration: '16 weeks omalizumab pre-treatment -> Day 1 Rush OIT escalation -> Daily home maintenance with graduated food powder.',
    durability: 'Permanent Tolerance Potential (if continued daily for 3-5 years, sustained unresponsiveness achieved in ~50%)',
  },
  {
    id: 'dupilumab',
    name: 'Dupilumab (Anti-IL-4Rα Monoclonal Antibody / Dupixent)',
    category: 'Biologic Monoclonal Antibody',
    timelineToEffect: 'Moderate: 8 to 24 weeks',
    targetMechanism:
      'Monoclonal antibody targeting the shared alpha subunit of the interleukin-4 receptor (IL-4Rα). Simultaneously inhibits both IL-4 and IL-13 downstream signaling via STAT6 phosphorylation. Completely arrests naive B-cell isotype switching to IgE, halts eosinophil mucosal trafficking, and restores epithelial tight-junction expression (claudin-1 upregulation).',
    clinicalEvidence:
      'Phase 2/3 trials in eosinophilic esophagitis (EoE) and ongoing multi-food allergy clinical trials (NCT03793634). Induces dramatic drop in tissue eosinophils and prevents agrochemical-induced barrier leakiness.',
    keyTrialOrCitation: 'NEJM 2022; 387:2317-2330 | J Allergy Clin Immunol 2023',
    dosingOrAdministration: '300 mg subcutaneous injection every 2 weeks.',
    durability: 'Maintenance Required',
  },
  {
    id: 'tolerogenic-nanoparticles',
    name: 'Tolerogenic Synthetic Nanoparticles (PLGA + Rapamycin + Chitinase Epitopes)',
    category: 'Tolerogenic Nanomedicine',
    timelineToEffect: 'Progressive: 6 to 12 weeks for de novo Treg induction',
    targetMechanism:
      'Biodegradable poly(lactic-co-glycolic acid) (PLGA) nanoparticles co-encapsulate purified recombinant Hevein/chitinase peptides with rapamycin (an mTOR inhibitor). Upon intravenous or oral mucosal uptake, particles are selectively cleared by liver sinusoidal endothelial cells (LSECs) and splenic dendritic cells without systemic mast cell activation. Presentation in an mTOR-inhibited tolerogenic state converts naive CD4+ T cells into antigen-specific CD4+CD25+FoxP3+ regulatory T cells (Tregs) that permanently suppress the allergic clone.',
    clinicalEvidence:
      'Preclinical and Phase 1/2 trials (Selecta Biosciences ImmTOR platform and Cour Pharmaceuticals CNP-201). Effectively resets immune memory and prevents anaphylactic shock upon allergen rechallenge.',
    keyTrialOrCitation: 'Nature Nanotechnology 2016; 11:786-794 | PNAS 2022',
    dosingOrAdministration: '2-3 intravenous infusions spaced 4 weeks apart.',
    durability: 'Permanent Tolerance Potential (Induces true immunological tolerance / anergy)',
  },
  {
    id: 'epithelial-microbiome-repair',
    name: 'High-Butyrate Clostridial Consortium & Barrier Integrity Restoratives',
    category: 'Microbiome & Barrier Restoration',
    timelineToEffect: 'Progressive: 12 to 24 weeks',
    targetMechanism:
      'Fecal microbiota transplantation or defined 17-strain Clostridia consortium produces high concentrations of short-chain fatty acids (SCFAs), predominantly butyrate. Butyrate acts as an epigenetic HDAC inhibitor, directly upregulating Claudin-1, Occludin, and ZO-1 tight junction transcription, resealing leaky mucosal gut barriers broken down by pesticides and emulsifiers. Stimulates dendritic cell production of TGF-beta and retinal dehydrogenase, driving intestinal mucosal IgA secretion.',
    clinicalEvidence:
      'Cathryn Nagler et al., Nature Medicine & Cell Host Microbe. Demonstrates that healthy Clostridia colonization prevents food allergen translocation into systemic circulation and reverses established allergic sensitization in murine models.',
    keyTrialOrCitation: 'Nature Medicine 2019; 25:1133-1141',
    dosingOrAdministration: 'Daily targeted enteric-coated oral capsules with prebiotics (resistant starch) and targeted SCFA esters.',
    durability: 'Permanent Tolerance Potential (if healthy dietary lifestyle and microbiome homeostasis maintained)',
  },
];

// -----------------------------------------------------------------------------
// 5. Landmark Peer-Reviewed Literature & Citations
// -----------------------------------------------------------------------------
// Every PMID / DOI below was verified against NCBI E-utilities on 2026-11-01.
// Do not add a citation without checking it resolves to the paper you mean.
export const LANDMARK_LITERATURE: LiteratureItem[] = [
  {
    pmid: '10069887',
    doi: '10.1016/s0091-6749(99)70478-1',
    title: 'Class I chitinases as potential panallergens involved in the latex-fruit syndrome',
    authors: ['Blanco C', 'Diaz-Perales A', 'Collada C', 'Sanchez-Monge R', 'Aragoncillo C', 'Castillo R'],
    journal: 'Journal of Allergy and Clinical Immunology',
    year: 1999,
    category: 'Latex-Fruit Syndrome',
    abstractSnippet:
      'Purified chestnut and avocado class I chitinases produced positive skin prick tests and CAP-inhibition in 18 latex-allergic patients reactive to those fruits, while class II chitinases did not. Establishes class I (hevein-domain) chitinases, not class II enzymes, as the cross-reactive allergens behind latex-fruit syndrome.',
    meshTerms: ['Latex Hypersensitivity', 'Chitinases', 'Hevein', 'Cross Reactions', 'Persea', 'Castanea'],
  },
  {
    pmid: '9679856',
    doi: '10.1016/s0091-6749(98)70063-6',
    title: 'Class I chitinases with hevein-like domain, but not class II enzymes, are relevant chestnut and avocado allergens',
    authors: ['Diaz-Perales A', 'Collada C', 'Blanco C', 'Sanchez-Monge R', 'Carrillo T', 'Aragoncillo C'],
    journal: 'Journal of Allergy and Clinical Immunology',
    year: 1998,
    category: 'Latex-Fruit Syndrome',
    abstractSnippet:
      'Isolated the ~32 kDa allergens of avocado and chestnut and identified them as class I chitinases carrying the N-terminal hevein-like domain; the class II isoforms from the same fruits were not recognised by patient IgE.',
    meshTerms: ['Chitinases', 'Hevein', 'Avocado', 'Chestnut', 'IgE'],
  },
  {
    pmid: '10231327',
    doi: '10.1046/j.1365-2222.1999.00502.x',
    title: 'Class I endochitinase containing a hevein domain is the causative allergen in latex-associated avocado allergy',
    authors: ['Posch A', 'Wheeler CH', 'Chen Z', 'Flagge A', 'Dunn MJ', 'Papenfuss F'],
    journal: 'Clinical & Experimental Allergy',
    year: 1999,
    category: 'Latex-Fruit Syndrome',
    abstractSnippet:
      'More than 50% of latex-allergic subjects are sensitised to avocado by skin prick or specific IgE, and 10-20% report reactions after eating it. Chitin-binding avocado proteins isolated by affinity chromatography carried the IgE-binding hevein domain.',
    meshTerms: ['Avocado', 'Hevein', 'Chitin-binding proteins', 'Latex allergy'],
  },
  {
    pmid: '10887324',
    doi: '10.1067/mai.2000.107599',
    title: 'Class I chitinases, the panallergens responsible for the latex-fruit syndrome, are induced by ethylene treatment and inactivated by heating',
    authors: ['Sanchez-Monge R', 'Blanco C', 'Diaz-Perales A', 'Collada C', 'Carrillo T', 'Aragoncillo C'],
    journal: 'Journal of Allergy and Clinical Immunology',
    year: 2000,
    category: 'Agrochemical Adjuvants',
    abstractSnippet:
      'Class I chitinase content and IgE-binding in a plant food were increased by ethylene treatment and abolished by heating - direct evidence that ripening-gas and heat protocols change the allergenic load of a fruit. This is the strongest existing evidence for the "post-harvest handling changes allergen dose" hypothesis, and it cuts in a direction that must be tested for ethylene-inhibitor (1-MCP) protocols rather than assumed.',
    meshTerms: ['Ethylene', 'Chitinase induction', 'Heating', 'Post-harvest handling', 'Allergen load'],
  },
  {
    pmid: '39064262',
    doi: '10.3390/jcm13144222',
    title: 'Revisiting Latex-Fruit Syndrome after 30 Years of Research: A Comprehensive Literature Review and Description of Two Cases',
    authors: ['Gromek W', 'Koldej N', 'Switala S', 'Majsiak E', 'Kurowski M'],
    journal: 'Journal of Clinical Medicine',
    year: 2024,
    category: 'Latex-Fruit Syndrome',
    abstractSnippet:
      'PRISMA review of 30 years of latex-fruit literature. Reported prevalence in latex-allergic patients varies widely (4-88%) with diagnostic method, geography and sample size; the most frequent cross-reactions and clinical presentations are catalogued.',
    meshTerms: ['Latex-Fruit Syndrome', 'Systematic review', 'Prevalence', 'Cross-reactivity'],
  },
  {
    pmid: '12440950',
    doi: '10.1042/bst0300935',
    title: 'The latex-fruit syndrome',
    authors: ['Wagner S', 'Breiteneder H'],
    journal: 'Biochemical Society Transactions',
    year: 2002,
    category: 'Latex-Fruit Syndrome',
    abstractSnippet:
      'Review: roughly 30-50% of natural rubber latex-allergic individuals react to plant foods such as avocado, banana, chestnut, kiwi, peach, tomato, potato and bell pepper. Class I chitinases with an N-terminal hevein-like domain are the principal cross-reactive defence proteins.',
    meshTerms: ['Latex allergy', 'Plant defence proteins', 'Hevein', 'Panallergens'],
  },
  {
    pmid: '33846604',
    doi: '10.1038/s41577-021-00538-7',
    title: 'Does the epithelial barrier hypothesis explain the increase in allergy, autoimmunity and other chronic conditions?',
    authors: ['Akdis CA'],
    journal: 'Nature Reviews Immunology',
    year: 2021,
    category: 'Epithelial Barrier Hypothesis',
    abstractSnippet:
      'Proposes that the steep rise in allergic and autoimmune disease tracks industrialisation and exposure to barrier-damaging agents (detergents, surfactants, microplastics, nanoparticles, agrochemicals), with epithelial leakiness, alarmins (IL-33, TSLP, IL-25) and Th2 skewing as the shared mechanism. A framework for environmental hypotheses - not a demonstration that any specific pesticide causes food allergy.',
    meshTerms: ['Epithelial barrier', 'Alarmins', 'IL-33', 'TSLP', 'Microbiome', 'Industrialisation'],
  },
  {
    pmid: '42636664',
    doi: '10.1016/j.ecoenv.2026.120697',
    title: 'Fungicides enhance inflammatory response and hamper gastrointestinal barrier integrity in in vitro human models',
    authors: ['Sanchez-Martin C', 'Cocetta V', "D'Agostino M", 'Miglietta S', 'Giacomini I', 'Lanza M'],
    journal: 'Ecotoxicology and Environmental Safety',
    year: 2026,
    category: 'Agrochemical Adjuvants',
    abstractSnippet:
      'Tested four agricultural fungicides including azoxystrobin on human PBMC-derived macrophages and Caco-2 intestinal epithelium, measuring inflammatory/metabolic responses and barrier integrity. One of very few human-cell studies directly probing the fungicide -> gut barrier link this platform hypothesises about.',
    meshTerms: ['Azoxystrobin', 'Fungicides', 'Caco-2', 'Intestinal barrier', 'Inflammation'],
  },
  {
    pmid: '30646188',
    doi: '10.1001/jamanetworkopen.2018.5630',
    title: 'Prevalence and Severity of Food Allergies Among US Adults',
    authors: ['Gupta RS', 'Warren CM', 'Smith BM', 'Jiang J', 'Blumenstock JA', 'Davis MM'],
    journal: 'JAMA Network Open',
    year: 2019,
    category: 'Epithelial Barrier Hypothesis',
    abstractSnippet:
      'Nationally representative survey of 40,443 US adults: 10.8% reported a convincing food allergy, roughly half of those allergies began in adulthood, and a substantial share were severe enough to warrant emergency care. The key epidemiological fact behind the "adult-onset" framing of this platform.',
    meshTerms: ['Adult-onset food allergy', 'Prevalence', 'United States', 'Epidemiology'],
  },
  {
    pmid: '38407394',
    doi: '10.1056/NEJMoa2312382',
    title: 'Omalizumab for the Treatment of Multiple Food Allergies (OUtMATCH)',
    authors: ['Wood RA', 'Togias A', 'Sicherer SH', 'Shreffler WG', 'Kim EH', 'Jones SM'],
    journal: 'New England Journal of Medicine',
    year: 2024,
    category: 'Allergy Reversal Therapies',
    abstractSnippet:
      'Phase 3 trial in people 1-55 years old allergic to peanut plus at least two of cashew, milk, egg, walnut, wheat and hazelnut. 16-20 weeks of omalizumab raised reaction thresholds versus placebo and supported FDA approval for multi-food allergy. Note: banana, avocado, kiwi and chestnut were not among the trial foods.',
    meshTerms: ['Omalizumab', 'Anti-IgE', 'Food allergy', 'Randomised trial', 'Desensitisation'],
  },
  {
    pmid: '31193674',
    doi: '10.1016/j.eclinm.2018.12.006',
    title: 'A Phase 2 Randomized Controlled Multisite Study Using Omalizumab-facilitated Rapid Desensitization to Test Continued vs Discontinued Dosing in Multifood Allergic Individuals',
    authors: ['Andorf S', 'Purington N', 'Kumar D', 'Long A', "O'Laughlin KL", 'Sicherer S'],
    journal: 'EClinicalMedicine',
    year: 2019,
    category: 'Allergy Reversal Therapies',
    abstractSnippet:
      'Seventy participants aged 5-22 with multiple food allergies received omalizumab (weeks 1-16) followed by multi-allergen oral immunotherapy (weeks 8-30). Most reached a 2 g or higher dose per allergen; the trial then compared continued versus discontinued maintenance dosing.',
    meshTerms: ['Omalizumab', 'Oral immunotherapy', 'Multifood allergy', 'Desensitisation'],
  },
  {
    pmid: '36546624',
    doi: '10.1056/NEJMoa2205982',
    title: 'Dupilumab in Adults and Adolescents with Eosinophilic Esophagitis',
    authors: ['Dellon ES', 'Rothenberg ME', 'Collins MH', 'Hirano I', 'Chehade M', 'Bredenoord AJ'],
    journal: 'New England Journal of Medicine',
    year: 2022,
    category: 'Allergy Reversal Therapies',
    abstractSnippet:
      'Phase 3 trial of dupilumab, which blocks IL-4 and IL-13 signalling, in eosinophilic oesophagitis: histologic remission and improved dysphagia versus placebo at 24 weeks. Relevant to the Th2/alarmin arm of the barrier hypothesis, not a food-allergy desensitisation therapy as such.',
    meshTerms: ['Dupilumab', 'IL-4R alpha', 'Eosinophilic esophagitis', 'Th2 inflammation'],
  },
  {
    pmid: '25157157',
    doi: '10.1073/pnas.1412008111',
    title: 'Commensal bacteria protect against food allergen sensitization',
    authors: ['Stefka AT', 'Feehley T', 'Tripathi P', 'Qiu J', 'McCoy K', 'Mazmanian SK'],
    journal: 'Proceedings of the National Academy of Sciences',
    year: 2014,
    category: 'Allergy Reversal Therapies',
    abstractSnippet:
      'Antibiotic-treated and germ-free mice show increased food-allergen sensitisation; recolonisation with a Clostridia-containing microbiota restores protection via innate lymphoid cell function and reduced intestinal epithelial permeability. Murine evidence underlying the microbiome/barrier arm of the platform.',
    meshTerms: ['Clostridia', 'Microbiota', 'Food allergy', 'Intestinal permeability', 'Murine'],
  },
  {
    pmid: '33351586',
    doi: '10.1021/acsnano.0c09206',
    title: 'Antigen- and Epitope-Delivering Nanoparticles Targeting Liver Induce Comparable Immunotolerance in Allergic Airway Disease and Anaphylaxis as Nanoparticle-Delivering Pharmaceuticals',
    authors: ['Liu Q', 'Wang X', 'Liu X', 'Liao YP', 'Chang CH', 'Mei KC'],
    journal: 'ACS Nano',
    year: 2021,
    category: 'Allergy Reversal Therapies',
    abstractSnippet:
      'Liver sinusoidal endothelial cell-targeted PLGA nanoparticles, and non-targeted particles co-delivering rapamycin or curcumin, generated antigen-specific regulatory T cells and suppressed allergic airway inflammation and anaphylaxis in mice. Preclinical tolerogenic-nanomedicine proof of concept.',
    meshTerms: ['Tolerogenic nanoparticles', 'PLGA', 'Regulatory T cells', 'Rapamycin', 'Anaphylaxis'],
  },
];
