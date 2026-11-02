/**
 * Data provenance & scope statements.
 *
 * AllergoScope mixes three very different kinds of information. Keeping them
 * visually separated is the difference between a useful research aid and a
 * source of misinformation for patients.
 *
 *   1. CITED  - facts that trace to a verifiable PMID/DOI (see LANDMARK_LITERATURE)
 *   2. MODELLED - hand-set indices and multipliers used to rank hypotheses
 *   3. HYPOTHESIS - mechanistic stories that are plausible but untested
 *
 * If you add data, label it. Never present category 2 or 3 as category 1.
 */

export const MEDICAL_DISCLAIMER =
  'Research and education only. AllergoScope is not a medical device, does not diagnose, and does not replace an allergist. If you suspect anaphylaxis, use epinephrine and call emergency services.';

export const SCOPE_STATEMENT =
  'AllergoScope is a hypothesis-generation workbench: it organises what the literature does and does not establish about latex-fruit syndrome and post-harvest agrochemical exposure, then helps you state testable predictions. Nothing here is evidence that a pesticide causes food allergy.';

export interface DatasetProvenance {
  id: string;
  label: string;
  status: 'cited' | 'modelled' | 'hypothesis';
  detail: string;
}

export const DATA_PROVENANCE: DatasetProvenance[] = [
  {
    id: 'landmark-literature',
    label: 'Landmark literature',
    status: 'cited',
    detail:
      'Every entry carries a PMID and DOI verified against NCBI E-utilities. Titles, authors and journals match the source record.',
  },
  {
    id: 'allergen-mechanisms',
    label: 'Allergen / epitope profiles',
    status: 'cited',
    detail:
      'Protein identity, family and the hevein-domain cross-reactivity mechanism follow the primary literature (Blanco 1999; Diaz-Perales 1998; Posch 1999). Reported sequence-identity percentages vary by alignment, so treat any single number as an estimate.',
  },
  {
    id: 'clinical-profiles',
    label: 'Symptom phenotypes',
    status: 'cited',
    detail:
      'Oral allergy syndrome is the documented presentation of latex-fruit cross-reactivity. GI-dominant reactions to banana are reported but far less systematically characterised; treat the visceral-cramp pattern as a described case phenotype, not a prevalence estimate.',
  },
  {
    id: 'agrochemical-profiles',
    label: 'Agrochemical barrier / PR-protein entries',
    status: 'hypothesis',
    detail:
      'Registered uses, chemical class and regulatory history are established. The tight-junction disruption tiers and the "+X% chitinase induction" multipliers are modelled placeholders built from in-vitro and plant-defence reasoning - not measurements in banana or avocado at dietary doses.',
  },
  {
    id: 'chronography',
    label: 'Chronographical time series (1990-2026)',
    status: 'modelled',
    detail:
      'The agrochemical-usage, search-volume and incidence indices are hand-curated illustrative values, not FAOSTAT / USGS / Google Trends / claims data. The Pearson r shown is computed on those illustrative values: it demonstrates the lagged-correlation method, it is not an epidemiological finding.',
  },
  {
    id: 'reversal',
    label: 'Reversal therapies',
    status: 'cited',
    detail:
      'Trial results and approvals are cited (OUtMATCH, omalizumab-facilitated multi-OIT, LIBERTY EoE, murine microbiome and nanoparticle work). None of these trials enrolled latex-fruit patients specifically, and preclinical results are labelled as such.',
  },
];

export const PROVENANCE_BY_ID: Record<string, DatasetProvenance> = Object.fromEntries(
  DATA_PROVENANCE.map((d) => [d.id, d]),
);

export const STATUS_STYLES: Record<DatasetProvenance['status'], { label: string; className: string }> = {
  cited: { label: 'Cited', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  modelled: { label: 'Modelled estimate', className: 'bg-amber-50 text-amber-800 border-amber-200' },
  hypothesis: { label: 'Hypothesis', className: 'bg-purple-50 text-purple-700 border-purple-200' },
};

/** First experiments the platform proposes, in dependency order. */
export const OPEN_QUESTIONS: { question: string; why: string }[] = [
  {
    question: 'Does 1-MCP treatment change class I chitinase content in banana or avocado pulp?',
    why: 'Ethylene treatment induces these chitinases (JACI 2000). An ethylene-receptor blocker could therefore cut allergen load instead of raising it - a cheap, decisive experiment that would falsify a core assumption of this platform.',
  },
  {
    question: 'Do dietary-relevant fungicide concentrations impair intestinal barrier integrity in vitro?',
    why: 'The 2026 Caco-2 fungicide study is the closest existing evidence; replicating it at residue-level concentrations rather than 1-50 uM is the missing step.',
  },
  {
    question: 'Do national import volumes of banana/avocado lead allergy-clinic case series by 1-3 years?',
    why: 'Requires real trade, residue-monitoring and clinic data. The current time series only demonstrates the statistical machinery.',
  },
  {
    question: 'How much of the latex-fruit signal is explained by falling latex-glove exposure after 2000?',
    why: 'Powdered-glove withdrawal in the 1990s-2000s is a strong competing explanation for changing latex sensitisation rates and must be modelled as a confounder.',
  },
];
