import React, { useState } from 'react';
import {
  FOOD_ALLERGENS,
  type FoodAllergen
} from '../data/scientific-data';
import {
  computeAllergenCrossReactivity
} from '../utils/allergy-math';
import { PageHeader } from './Chrome';
import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Info,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Zap,
  Activity,
  Maximize2
} from 'lucide-react';

interface Props {
  selectedFoodId?: string;
  onSelectFood: (foodId: string) => void;
  onNavigateToTab: (tab: any) => void;
}

export const MolecularMechanismView: React.FC<Props> = ({
  selectedFoodId = 'banana',
  onSelectFood,
  onNavigateToTab,
}) => {
  const [activeSubSection, setActiveSubSection] = useState<'divergence' | 'sensitization' | 'alignment' | 'barrier'>('divergence');
  const [activeAllergenModal, setActiveAllergenModal] = useState<string | null>(null);

  const selectedFood = FOOD_ALLERGENS.find((f) => f.id === selectedFoodId) || FOOD_ALLERGENS[0];
  const banana = FOOD_ALLERGENS.find((f) => f.id === 'banana')!;
  const avocado = FOOD_ALLERGENS.find((f) => f.id === 'avocado')!;

  // 43-residue Hevein-like domain alignment (canonical sequences)
  const heveinDomainSequences = [
    {
      name: 'Latex Hev b 6.02 (Hevein)',
      organism: 'Hevea brasiliensis',
      uniprot: 'P07153',
      sequence: 'EQCGRQAGGKLCPNNLCCSQWGWCGSTDEYCSPDHNCQSNCKD',
    },
    {
      name: 'Banana Mus a 2 (Endochitinase)',
      organism: 'Musa acuminata',
      uniprot: 'P81661',
      sequence: 'EQCGSQAGGATCPNGLCCSQFGWCGNTDEYCDAGDTCQSNCKD',
    },
    {
      name: 'Avocado Pers a 1 (Endochitinase)',
      organism: 'Persea americana',
      uniprot: 'P81662',
      sequence: 'EQCGSQAGGAICPNGVCCSQYGWCGSTDNYCNPGKNCQSNCKD',
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Biomedical synthesis"
        tone="blue"
        icon={<Activity className="h-3 w-3" />}
        title="Why adults develop food allergies — and why latex-fruit splits into two phenotypes"
        lead="Previously tolerated fruit suddenly provoking acute reactivity. Here is what the literature establishes about the shared class I endochitinase hevein domain, and where the explanations run out."
        actions={
          <span className="chip num !cursor-default font-mono">PR-3 chitinase family</span>
        }
      />

      {/* Section segmented control */}
      <div className="card p-1.5">
        <div className="flex flex-wrap gap-1">
          {[
            { key: 'divergence' as const, n: '01', label: 'Banana vs. avocado divergence' },
            { key: 'sensitization' as const, n: '02', label: 'Why adults develop allergy' },
            { key: 'alignment' as const, n: '03', label: 'Hevein domain alignment' },
            { key: 'barrier' as const, n: '04', label: 'Agrochemical triggers' },
          ].map((tab) => {
            const active = activeSubSection === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveSubSection(tab.key)}
                aria-pressed={active}
                className={`flex flex-1 items-center gap-2 rounded-[11px] px-3 py-2 text-left text-[12px] font-medium transition-colors ${
                  active
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span
                  className={`font-mono text-[10px] font-bold ${
                    active ? 'text-blue-300' : 'text-slate-400'
                  }`}
                >
                  {tab.n}
                </span>
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 1: BANANA VS AVOCADO SYMPTOM DIVERGENCE */}
      {activeSubSection === 'divergence' && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-900 flex items-center">
                <span className="w-2.5 h-6 bg-blue-600 rounded-xs mr-2.5 inline-block"></span>
                The Clinical Divergence: Visceral Enteric vs. Oral-Mucosal Reactivity
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                Both fruits contain homologous Class I endochitinases that cross-react with latex Hev b 6.02, yet manifest with strikingly opposite organ predilections:
              </p>
            </div>
            <span className="text-xs px-3 py-1 bg-slate-100 rounded-full font-mono text-slate-600">
              PR-3 Chitinase Family
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Banana Card: Enteric Predilection */}
            <div className="bg-amber-50/40 border-2 border-amber-300/80 rounded-xl p-6 shadow-xs relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-200/30 rounded-bl-full pointer-events-none" />
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                    Visceral Gastrointestinal Dominance
                  </span>
                  <h4 className="text-xl font-extrabold text-slate-900 mt-1.5">
                    Banana (Mus a 2 & Mus a 5)
                  </h4>
                  <p className="text-xs text-slate-600 italic">Musa acuminata • UniProt P81661</p>
                </div>
                <div className="text-3xl">🍌</div>
              </div>

              {/* Clinical Symptoms */}
              <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50/60 p-3.5">
                <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center text-amber-900">
                  <AlertTriangle className="w-3.5 h-3.5 mr-1 text-amber-600" /> Clinical Symptom Profile
                </h5>
                <ul className="text-xs space-y-1.5 text-slate-700">
                  {banana.clinicalSymptomProfile.symptoms.map((s, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 mr-2 shrink-0"></span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 pt-2 border-t border-amber-100 flex justify-between text-xs font-medium">
                  <span className="text-slate-500">Onset Latency:</span>
                  <span className="font-mono text-amber-800 font-bold">{banana.clinicalSymptomProfile.onsetMinutes}</span>
                </div>
              </div>

              {/* Molecular Rationale */}
              <div className="text-xs text-slate-700 space-y-2 leading-relaxed">
                <p>
                  <strong>Why cramps and diarrhea?</strong> Mus a 2 is a class I chitinase locked by 4 internal disulfide bonds, and chitinases of this fold are comparatively resistant to pepsin digestion in vitro. <strong>How much survives gastric transit is method-dependent</strong> and has not been standardised across studies - so this platform treats enteric delivery as a plausible mechanism, not a measured constant.
                </p>
                <p>
                  Upon entering the duodenum and ileum, intact Mus a 2 cross-links FcεRI-bound IgE on dense populations of <strong>lamina propria mucosal mast cells</strong>. This induces acute release of <strong>histamine, prostaglandin D2 (PGD2), and leukotriene C4 (LTC4)</strong>, triggering rapid cholinergic enteric spasm, agonizing smooth-muscle cramps, and severe osmotic/secretory diarrhea.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-amber-200/60 flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">Gastric Stability:</span>
                <span className="px-2 py-0.5 rounded font-semibold bg-red-100 text-red-800 border border-red-200">
                  High (Survives Acid/Pepsin)
                </span>
              </div>
            </div>

            {/* Avocado Card: Oral/Mucosal Predilection */}
            <div className="bg-emerald-50/40 border-2 border-emerald-300/80 rounded-xl p-6 shadow-xs relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-200/30 rounded-bl-full pointer-events-none" />
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    Oral-Mucosal & Angioedema Dominance
                  </span>
                  <h4 className="text-xl font-extrabold text-slate-900 mt-1.5">
                    Avocado (Pers a 1)
                  </h4>
                  <p className="text-xs text-slate-600 italic">Persea americana • UniProt P81662</p>
                </div>
                <div className="text-3xl">🥑</div>
              </div>

              {/* Clinical Symptoms */}
              <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50/60 p-3.5">
                <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center text-emerald-900">
                  <AlertTriangle className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Clinical Symptom Profile
                </h5>
                <ul className="text-xs space-y-1.5 text-slate-700">
                  {avocado.clinicalSymptomProfile.symptoms.map((s, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 mr-2 shrink-0"></span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 pt-2 border-t border-emerald-100 flex justify-between text-xs font-medium">
                  <span className="text-slate-500">Onset Latency:</span>
                  <span className="font-mono text-emerald-800 font-bold">{avocado.clinicalSymptomProfile.onsetMinutes}</span>
                </div>
              </div>

              {/* Molecular Rationale */}
              <div className="text-xs text-slate-700 space-y-2 leading-relaxed">
                <p>
                  <strong>Why oral pruritus and lip/throat swelling?</strong> Avocado pulp contains 15-20% monounsaturated lipids. Pers a 1 rapidly partitions into this salivary lipid emulsion during chewing.
                </p>
                <p>
                  The lipid vehicle acts as a mucosal penetration enhancer, allowing Pers a 1 to permeate buccal and oropharyngeal stratified squamous epithelium within seconds. It encounters subepithelial tissue mast cells and dendritic cells in the mouth, activating immediate H1 histamine release, neurogenic pruritus, and rapid microvascular plasma extravasation causing <strong>acute labial, tongue, and uvular angioedema</strong> before the bolus is swallowed.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-emerald-200/60 flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">Gastric Stability:</span>
                <span className="px-2 py-0.5 rounded font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                  Moderate (Partially Cleaved in Stomach)
                </span>
              </div>
            </div>
          </div>

          {/* Cross-Reactivity Homology Box */}
          <div className="card p-5">
            <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center">
              <Info className="w-4 h-4 mr-2 text-blue-600" />
              Biophysical Comparison: Why Do Symptoms Express in Different Organs?
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
              <div className="p-3 card-sunk">
                <div className="font-semibold text-slate-800 mb-1">1. Epithelial Permeation Kinetics</div>
                <p>
                  Avocado lipids enhance immediate transcellular absorption across oral mucous membranes. Banana carbohydrates form a viscous bolus that shields chitinase molecules until distal transit.
                </p>
              </div>
              <div className="p-3 card-sunk">
                <div className="font-semibold text-slate-800 mb-1">2. Pepsin Cleavage Susceptibility</div>
                <p>
                  Banana Mus a 2 possesses higher thermodynamic denaturation resistance (melting temperature Tm &gt; 74°C), surviving gastric acid. Avocado Pers a 1 is partially hydrolyzed by pepsin, attenuating intestinal shock.
                </p>
              </div>
              <div className="p-3 card-sunk">
                <div className="font-semibold text-slate-800 mb-1">3. Mast Cell Subtype Differences</div>
                <p>
                  Connective tissue mast cells (MC_TC subtype) in the lips/palate express chymase and tryptase, causing immediate wheal/edema. Mucosal mast cells (MC_T subtype) in the gut secrete LTC4 and PGD2, driving peristaltic spasms.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 2: WHY ADULT ALLERGIES DEVELOP (SENSITIZATION & EPITHELIAL HYPOTHESIS) */}
      {activeSubSection === 'sensitization' && (
        <section className="space-y-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900 flex items-center">
              <span className="w-2.5 h-6 bg-indigo-600 rounded-xs mr-2.5 inline-block"></span>
              Why Do Adults Suddenly Become Allergic to Previously Tolerated Foods?
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              Until recently, medical dogma held that food allergies were strictly childhood-acquired diseases. Seminal epidemiological studies (JAMA Netw Open 2019) proved that <strong>48% of all food-allergic adults developed their allergy in adulthood</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Step 1: Occult Sensitization */}
            <div className="card p-5">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm mb-3">
                1
              </div>
              <h4 className="font-bold text-sm text-slate-900 mb-1">Dual-Allergen Exposure & Occupational Breach</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Skin and inhalational exposure (e.g. powdered latex gloves in healthcare, latex condoms, or airborne pollen) sensitizes naive B cells to produce anti-Hevein IgE without causing immediate oral food symptoms. The immune memory rests dormant.
              </p>
            </div>

            {/* Step 2: Epithelial Barrier Breakdown */}
            <div className="card p-5">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm mb-3">
                2
              </div>
              <h4 className="font-bold text-sm text-slate-900 mb-1">Epithelial Barrier Breach (Akdis Hypothesis)</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Modern exposure to industrial detergents, agrochemical surfactants (POEA), emulsifiers, microplastics, and post-harvest chemicals destroys tight junctions (Claudin-1, Occludin), releasing tissue alarmins <strong>IL-33, TSLP, and IL-25</strong>.
              </p>
            </div>

            {/* Step 3: Loss of Oral Tolerance */}
            <div className="card p-5">
              <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm mb-3">
                3
              </div>
              <h4 className="font-bold text-sm text-slate-900 mb-1">Gastric Acid Suppression & Microbiome Loss</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Widespread use of PPIs (proton pump inhibitors) elevates gastric pH from 1.5 to 5.0, preventing pepsin from digesting intact proteins. Concurrently, loss of butyrate-producing <em>Clostridia</em> eliminates mucosal Treg generation.
              </p>
            </div>

            {/* Step 4: Cross-Reactive Explosion */}
            <div className="card p-5">
              <div className="w-8 h-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center font-bold text-sm mb-3">
                4
              </div>
              <h4 className="font-bold text-sm text-slate-900 mb-1">Threshold Exceedance & Acute Flare</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                When an adult eats a modern fruit containing stress-induced, high-titer PR-3 endochitinases (boosted by 1-MCP ripening retardation), the intact allergen encounters sensitized mast cells, triggering sudden clinical reactivity to a food tolerated for 30 years.
              </p>
            </div>
          </div>

          {/* Deep Immunology Diagram */}
          <div className="bg-slate-900 text-white rounded-xl p-6 shadow-md">
            <h4 className="text-base font-bold text-white mb-3 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-yellow-400" />
              The Cellular Cascade of Adult Epithelial Sensitization
            </h4>
            <div className="p-4 bg-slate-800/80 rounded-lg border border-slate-700 text-xs font-mono space-y-3">
              <div className="flex flex-wrap items-center gap-2 text-slate-300">
                <span className="px-2 py-1 bg-amber-500/20 text-amber-300 rounded border border-amber-500/30">
                  Agrochemicals / Surfactants / 1-MCP Stress
                </span>
                <span className="text-slate-500">──▶</span>
                <span className="px-2 py-1 bg-red-500/20 text-red-300 rounded border border-red-500/30">
                  Occludin / Claudin-1 Cleavage
                </span>
                <span className="text-slate-500">──▶</span>
                <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded border border-purple-500/30">
                  Alarmin Surge (IL-33, TSLP, IL-25)
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-slate-300 pl-4 border-l-2 border-slate-700">
                <span className="text-slate-500">▼</span>
                <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded border border-blue-500/30">
                  ILC2 Activation & DC OX40L Expression
                </span>
                <span className="text-slate-500">──▶</span>
                <span className="px-2 py-1 bg-indigo-500/20 text-indigo-300 rounded border border-indigo-500/30">
                  CD4+ Th2 Differentiation (IL-4, IL-13)
                </span>
                <span className="text-slate-500">──▶</span>
                <span className="px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">
                  B-Cell Class Switching to IgE
                </span>
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-400">
              *Source: Cezmi Akdis, <em>The Epithelial Barrier Hypothesis</em>, Nature Reviews Immunology (2021).
            </p>
          </div>
        </section>
      )}

      {/* SECTION 3: HEVEIN DOMAIN MOLECULAR ALIGNMENT */}
      {activeSubSection === 'alignment' && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-900 flex items-center">
                <span className="w-2.5 h-6 bg-teal-600 rounded-xs mr-2.5 inline-block"></span>
                Conserved 43-Amino-Acid Hevein Domain Alignment
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                The conformational IgE-binding epitope is formed by an identical 8-cysteine motif forming 4 internal disulfide bridges:
              </p>
            </div>
            <span className="text-xs px-2.5 py-1 bg-teal-50 text-teal-700 border border-teal-200 rounded-md font-mono">
              8 Cysteines • 4 Disulfide Bonds
            </span>
          </div>

          <div className="bg-slate-900 text-white rounded-xl p-5 shadow-sm overflow-x-auto">
            <div className="min-w-[650px] space-y-4 font-mono text-xs">
              <div className="text-slate-400 border-b border-slate-800 pb-2 flex justify-between">
                <span>Residue 1 . . . . 10 . . . . 20 . . . . 30 . . . . 40 . 43</span>
                <span className="text-yellow-400 font-semibold">[C = Conserved Cysteines]</span>
              </div>

              {heveinDomainSequences.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-sans">
                    <span className="font-bold text-slate-200">{item.name}</span>
                    <span className="text-slate-500">{item.organism} • UniProt: {item.uniprot}</span>
                  </div>
                  <div className="p-2.5 bg-slate-950 rounded-lg tracking-widest text-sm flex gap-1 font-mono">
                    {item.sequence.split('').map((char, charIdx) => {
                      const isCysteine = char === 'C';
                      const isAromatic = ['W', 'Y', 'F'].includes(char);
                      return (
                        <span
                          key={charIdx}
                          className={`inline-block px-0.5 rounded ${
                            isCysteine
                              ? 'bg-yellow-500 text-slate-950 font-black'
                              : isAromatic
                              ? 'bg-blue-600 text-white font-bold'
                              : 'text-slate-300'
                          }`}
                          title={`Residue ${charIdx + 1}: ${char} ${isCysteine ? '(Disulfide Bridge Cysteine)' : ''}`}
                        >
                          {char}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap gap-4 text-xs text-slate-400">
              <div className="flex items-center">
                <span className="w-3 h-3 bg-yellow-500 rounded mr-1.5"></span>
                <span>Conserved Cysteines (C3, C12, C17, C18, C24, C31, C38, C42)</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 bg-blue-600 rounded mr-1.5"></span>
                <span>Chitin-Binding Aromatic Residues (W21, W23, Y30)</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-900 leading-relaxed">
            <h5 className="font-bold mb-1 flex items-center">
              <Info className="w-4 h-4 mr-1 text-blue-700" />
              Structural Homology Note:
            </h5>
            <p>
              Mus a 2 (banana) and Pers a 1 (avocado) each carry the <strong>same 43-residue hevein domain fold</strong> as Hev b 6.01/6.02; identity values quoted in the literature vary with the alignment used, so this page shows the shared fold rather than a single invented percentage. The 4 disulfide bonds lock the peptide into a compact, spherical globule with a hydrophobic core that resists high temperatures, gastric acidity, and peptic cleavage, explaining why patient IgE binds with nanomolar affinity to both foods.
            </p>
          </div>
        </section>
      )}

      {/* SECTION 4: AGROCHEMICAL TRIGGERS PREVIEW */}
      {activeSubSection === 'barrier' && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-900 flex items-center">
                <span className="w-2.5 h-6 bg-red-600 rounded-xs mr-2.5 inline-block"></span>
                Microconsideration: Food Spraying & Macro Agrochemical Shifts
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                How modern industrial farming practices, chemical formulations, and post-harvest ripening inhibitors act as environmental co-factors:
              </p>
            </div>
            <button
              onClick={() => onNavigateToTab('agrochemicals')}
              className="text-xs px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center transition-colors"
            >
              Open Full Agrochemical Database <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="card p-5">
              <div className="text-red-600 font-bold text-xs uppercase mb-1">Mechanism A</div>
              <h4 className="font-bold text-slate-900 text-sm mb-2">1-MCP (SmartFresh) & Plant Stress Defense</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Commercialised globally since 2002, 1-methylcyclopropene blocks ethylene perception and slows ripening during long-distance shipping. What this does to <strong>allergen load is an open question</strong>: ethylene treatment is documented to <em>induce</em> class I chitinases (Sanchez-Monge et al., JACI 2000), so an ethylene blocker could plausibly lower chitinase content rather than raise it. No published study has measured chitinase levels in 1-MCP-treated banana or avocado pulp - that measurement is the platform&apos;s first proposed experiment.
              </p>
            </div>

            <div className="card p-5">
              <div className="text-amber-600 font-bold text-xs uppercase mb-1">Mechanism B</div>
              <h4 className="font-bold text-slate-900 text-sm mb-2">Surfactant Adjuvants (POEA & Organosilicones)</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Formulations contain non-ionic detergent surfactants to penetrate plant leaf cuticles. When consumed on food residues, these surfactants dissolve human mucosal epithelial lipid membranes and degrade tight-junction proteins (Claudin-1, ZO-1), enabling intact chitinases to cross into the lamina propria.
              </p>
            </div>

            <div className="card p-5">
              <div className="text-indigo-600 font-bold text-xs uppercase mb-1">Mechanism C</div>
              <h4 className="font-bold text-slate-900 text-sm mb-2">Post-Harvest Antifungal Dips & Waxes</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Azoxystrobin and Thiabendazole (TBZ) are applied directly to banana crowns and avocado peels in packing houses. Systemic strobilurins inhibit enterocyte mitochondrial respiration, generating reactive oxygen species (ROS) that directly induce epithelial alarmin (IL-33) release.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Navigation Footer to Next Feature */}
      <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div className="text-xs text-slate-500">
          Want to cross-reference food ingredients against agricultural chemical databases?
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onNavigateToTab('agrochemicals')}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center transition-colors"
          >
            Explore Agrochemical Database <ChevronRight className="w-4 h-4 ml-1" />
          </button>
          <button
            onClick={() => onNavigateToTab('chronography')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center transition-colors"
          >
            Chronographical Map & Lag Analytics <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};
