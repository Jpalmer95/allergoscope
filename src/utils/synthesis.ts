/**
 * Rule-based hypothesis synthesis.
 *
 * This is deliberately NOT a language model. It assembles a structured brief
 * from the curated dataset plus fixed, cited mechanistic statements, so the
 * output is reproducible, reviewable and cannot hallucinate a citation.
 *
 * Used in two places:
 *   - `server.ts`, as the fallback when no Gemini key is configured
 *   - the static build, where there is no server at all
 */

import { AGROCHEMICALS, FOOD_ALLERGENS } from '../data/scientific-data';

export interface SynthesisInput {
  food: string;
  chemical: string;
  symptomPattern: string;
  hypothesis?: string;
}

export interface SynthesisResult {
  model: string;
  synthesis: string;
}

const CITE = {
  blanco: 'Blanco et al., J Allergy Clin Immunol 1999;103:507-513 (PMID 10069887)',
  diaz: 'Diaz-Perales et al., J Allergy Clin Immunol 1998;102:127-133 (PMID 9679856)',
  posch: 'Posch et al., Clin Exp Allergy 1999;29:916-922 (PMID 10231327)',
  sanchez: 'Sanchez-Monge et al., J Allergy Clin Immunol 2000;106:177-182 (PMID 10887324)',
  gromek: 'Gromek et al., J Clin Med 2024;13:4222 (PMID 39064262)',
  wagner: 'Wagner & Breiteneder, Biochem Soc Trans 2002;30:935-940 (PMID 12440950)',
  akdis: 'Akdis CA, Nat Rev Immunol 2021;21:739-751 (PMID 33846604)',
  fungicide: 'Sanchez-Martin et al., Ecotoxicol Environ Saf 2026 (PMID 42636664)',
  gupta: 'Gupta et al., JAMA Netw Open 2019;2:e185630 (PMID 30646188)',
  outmatch: 'Wood et al., N Engl J Med 2024;390:889-899 (PMID 38407394)',
  andorf: 'Andorf et al., EClinicalMedicine 2019;8:17-26 (PMID 31193674)',
  dellon: 'Dellon et al., N Engl J Med 2022;387:2317-2330 (PMID 36546624)',
  stefka: 'Stefka et al., PNAS 2014;111:13145-13150 (PMID 25157157)',
};

function symptomSection(symptomPattern: string): string {
  const s = symptomPattern.toLowerCase();
  if (s.includes('cramp') || s.includes('diarrh')) {
    return [
      '**Enteric phenotype.** Latex-fruit cross-reactivity is most often reported as oral allergy syndrome, but case series also describe isolated abdominal cramping and diarrhoea after banana or avocado, sometimes without oral symptoms (see the two-case report and review in PMID 39064262).',
      'The mechanistic story is that a pepsin-resistant class I chitinase reaches the distal small bowel and cross-links IgE on mucosal mast cells, releasing histamine and cysteinyl leukotrienes that drive smooth-muscle contraction and secretion. **That chain is plausible but poorly quantified**: gastric survival varies with matrix and assay, and no standardised human dose-response exists.',
      'Differential to keep on the list: non-IgE carbohydrate malabsorption (fructan in banana, sorbitol in avocado), histamine intolerance, and IBS overlap. A symptom diary plus allergist work-up distinguishes these far better than any model.',
    ].join('\n\n');
  }
  if (s.includes('systemic') || s.includes('anaphyla')) {
    return [
      '**Systemic phenotype.** This is the pattern that matters most clinically: latex-sensitised adults with chestnut or avocado reactivity have documented anaphylaxis, and cofactors (exercise, NSAIDs, alcohol, fasting) can turn a tolerated dose into a reaction.',
      'Mechanistically, high-affinity anti-hevein IgE bound to connective-tissue and cardiac mast cells permits rapid systemic mediator release. Severity is driven by epitope affinity, mast-cell burden and cofactor exposure - not only by allergen dose.',
      '**Practical consequence:** any research platform output is irrelevant at the moment of an acute reaction. Epinephrine first, allergist second.',
    ].join('\n\n');
  }
  if (s.includes('eosinophil')) {
    return [
      '**Mixed oral / eosinophilic phenotype.** Eosinophilic oesophagitis is a Th2, alarmin-driven disease that can coexist with food allergy; dupilumab (anti-IL-4Ralpha) produces histologic remission in EoE (PMID 36546624).',
      'The barrier-hypothesis link here is mechanistic overlap rather than proven causation: both EoE and food allergy sit downstream of epithelial leakiness and IL-33/TSLP release (PMID 33846604).',
    ].join('\n\n');
  }
  return [
    '**Oral / mucosal phenotype.** This is the classic latex-fruit presentation: itching and swelling of lips, palate, tongue or throat within minutes of eating raw fruit, driven by class I chitinases carrying the hevein domain (PMID 10069887, 9679856, 10231327).',
    'Heating typically reduces reactivity because these chitinases are heat-labile (PMID 10887324) - which is why cooked banana bread is often tolerated while raw banana is not. This is a useful, low-risk personal test to discuss with an allergist, not something to attempt unsupervised after a severe reaction.',
  ].join('\n\n');
}

export function buildSynthesis(input: SynthesisInput): SynthesisResult {
  const food = FOOD_ALLERGENS.find((f) => f.name.toLowerCase() === input.food.toLowerCase());
  const chem = AGROCHEMICALS.find((c) => c.name.toLowerCase() === input.chemical.toLowerCase());

  const allergenLines = food
    ? food.majorAllergens
        .map(
          (a) =>
            `- **${a.name}** - ${a.proteinClass}, ${a.molecularWeight}, UniProt ${a.uniprotId}. ${a.description}`,
        )
        .join('\n')
    : '- No curated allergen record matched this food; add one to `src/data/scientific-data.ts`.';

  const chemLines = chem
    ? [
        `- **Class / phase:** ${chem.chemicalClass}; ${chem.applicationPhase}.`,
        `- **Registered use:** ${chem.regulatoryStatus.epaStatus}. EU: ${chem.regulatoryStatus.euMrlStatus}.`,
        `- **Mechanism of action:** ${chem.mechanismOfAction}`,
        `- **Barrier claim status:** ${chem.epithelialPermeabilityImpact.tightJunctionDisruption} disruption is a *hypothesis-level* entry in this dataset, modelled from ${chem.epithelialPermeabilityImpact.affectedProteins.join(', ')} biology. It is not a measured result at dietary residue concentrations.`,
      ].join('\n')
    : '- No curated agrochemical record matched this agent.';

  const body = `### Assessment: ${input.food} x ${input.chemical}

> **Scope.** Generated by AllergoScope's rule-based engine from a curated dataset. No language model, no new claims, no invented citations. Research aid only - not medical advice.

**1. Cross-reactive epitope structure (established).**

${allergenLines}

The shared structure is the 43-residue N-terminal **hevein-like domain** of class I chitinases, with eight conserved cysteines forming four disulfide bridges. It is the same epitope as latex Hev b 6.01/6.02, which is why class I - but not class II - chitinases are the relevant cross-reactive allergens (${CITE.diaz}; ${CITE.blanco}; ${CITE.posch}). Prevalence of the syndrome among latex-allergic people is reported anywhere from 4% to 88% depending on diagnostic method and population (${CITE.gromek}); the widely quoted "about 30-50%" comes from earlier reviews (${CITE.wagner}).

**2. Clinical phenotype requested: ${input.symptomPattern}.**

${symptomSection(input.symptomPattern)}

**3. The agrochemical arm - what is and is not established.**

${chemLines}

The general framework is Akdis's **epithelial barrier hypothesis** (${CITE.akdis}): industrial-era exposures damage skin and mucosal barriers, releasing IL-33, TSLP and IL-25, skewing immunity Th2-ward. That hypothesis is well supported as a *framework*. What follows from it for a specific post-harvest fungicide on a specific fruit is **not** established. The nearest direct evidence is a 2026 in-vitro study showing that several agricultural fungicides, azoxystrobin included, alter inflammatory responses in human macrophages and compromise Caco-2 intestinal barrier integrity at 1-50 uM (${CITE.fungicide}) - concentrations far above plausible dietary residues, in a cell line, without an allergen.

**4. Where the interesting test actually is.**

Post-harvest handling demonstrably *can* change allergen load: ethylene treatment induced class I chitinases in a food plant, and heating inactivated them (${CITE.sanchez}). The dataset's assumption that ethylene-*blocking* agents such as 1-MCP raise chitinase content is therefore **untested and directionally uncertain** - blocking ethylene signalling could just as easily lower it. Stating that as a falsifiable prediction is more useful than asserting a multiplier:

> **P1.** Measure class I chitinase (Mus a 2 / Pers a 1) content in paired 1-MCP-treated vs ethylene-ripened fruit, same cultivar, same season. If 1-MCP does not raise it, the agrochemical-amplification branch of this hypothesis loses its cheapest support.

> **P2.** Repeat the fungicide/Caco-2 work at residue-relevant concentrations with and without co-administered allergen, measuring TEER, claudin-1/occludin localisation and IL-33 release.

> **P3.** Fit the lagged correlation against real series (FAOSTAT trade volumes, USGS/EFSA residue monitoring, allergy-clinic case counts, Google Trends), adjusting for the collapse in powdered latex-glove use after the late 1990s - a strong competing explanation for any change in latex sensitisation.

**5. Reversal landscape - and its boundary.**

- Omalizumab monotherapy raised reaction thresholds across multiple foods in OUtMATCH (${CITE.outmatch}) and is FDA-approved for multi-food allergy - for peanut, milk, egg, wheat, cashew, walnut and hazelnut. **Banana, avocado, kiwi and chestnut were not trial foods**, so extrapolation to latex-fruit syndrome is reasoned, not demonstrated.
- Omalizumab-facilitated rapid multi-allergen OIT shortened up-dosing from years to weeks in a phase 2 study (${CITE.andorf}).
- Dupilumab addresses the Th2/alarmin arm and is approved for eosinophilic oesophagitis (${CITE.dellon}).
- Microbiome (${CITE.stefka}) and liver-targeted tolerogenic nanoparticle (PMID 33351586) strategies remain preclinical. Clostridia and nanoparticle tolerance have not been shown in humans with food allergy outside early-phase trials.

**6. Your working note.**

> ${input.hypothesis?.trim() || 'No specific hypothesis supplied.'}

**7. What this brief does not say.** It does not say that ${input.chemical} causes allergy. It does not estimate your personal risk. And it does not replace an allergist who can order component-resolved diagnostics (rMus a 2, rPers a 1, rHev b 6.02) and interpret them against your history.`;

  return { model: 'allergoscope-rule-engine-v3', synthesis: body };
}
