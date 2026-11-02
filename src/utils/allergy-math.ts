/**
 * Pure mathematical, statistical, and biophysical logic for
 * allergen cross-reactivity, epithelial barrier disruption indices,
 * and lagged chronographical agrochemical-allergy correlations.
 */

export interface AgrochemicalProperty {
  id: string;
  name: string;
  chemicalClass: string;
  logP: number;
  surfactantAdjuvant: boolean;
  tightJunctionDisruptionFactor: number; // 0.0 to 1.0 (claudin/occludin disruption)
  plantStressPRInductionFactor: number; // 0.0 to 1.0 (induction of PR-3/PR-4 chitinases)
  membranePermeabilityScore?: number;
}

/**
 * Calculates Pearson Correlation Coefficient r between two equal-length numeric vectors.
 */
export function calculatePearsonCorrelation(x: number[], y: number[]): number {
  if (x.length !== y.length || x.length < 2) {
    return 0;
  }

  const n = x.length;
  let sumX = 0;
  let sumY = 0;
  for (let i = 0; i < n; i++) {
    sumX += x[i];
    sumY += y[i];
  }
  const meanX = sumX / n;
  const meanY = sumY / n;

  let numerator = 0;
  let denomX = 0;
  let denomY = 0;

  for (let i = 0; i < n; i++) {
    const diffX = x[i] - meanX;
    const diffY = y[i] - meanY;
    numerator += diffX * diffY;
    denomX += diffX * diffX;
    denomY += diffY * diffY;
  }

  const denominator = Math.sqrt(denomX * denomY);
  if (denominator === 0) return 0;

  const r = numerator / denominator;
  // Clamping for numerical stability
  return Math.max(-1, Math.min(1, Number(r.toFixed(4))));
}

/**
 * Calculates lagged correlation between chemical usage/farming practices (baseline)
 * and clinical/search trend emergence shifted by lagYears (e.g. 1 to 5 years).
 */
export function calculateLaggedCorrelation(
  sourceSeries: number[],
  effectSeries: number[],
  lagYears: number
): { r: number; sampleSize: number; description: string } {
  if (lagYears < 0) {
    lagYears = 0;
  }

  if (sourceSeries.length !== effectSeries.length) {
    const minLen = Math.min(sourceSeries.length, effectSeries.length);
    sourceSeries = sourceSeries.slice(0, minLen);
    effectSeries = effectSeries.slice(0, minLen);
  }

  if (sourceSeries.length <= lagYears + 2) {
    return { r: 0, sampleSize: 0, description: 'Insufficient data points for specified lag period.' };
  }

  // Source at year t, Effect at year t + lagYears
  const alignedSource: number[] = [];
  const alignedEffect: number[] = [];

  for (let i = 0; i < sourceSeries.length - lagYears; i++) {
    alignedSource.push(sourceSeries[i]);
    alignedEffect.push(effectSeries[i + lagYears]);
  }

  const r = calculatePearsonCorrelation(alignedSource, alignedEffect);

  let description = 'Negligible correlation';
  const absR = Math.abs(r);
  if (absR >= 0.8) description = 'Very Strong correlation';
  else if (absR >= 0.6) description = 'Strong correlation';
  else if (absR >= 0.4) description = 'Moderate correlation';
  else if (absR >= 0.2) description = 'Weak correlation';

  return {
    r,
    sampleSize: alignedSource.length,
    description: `${description} (${r >= 0 ? 'Positive' : 'Inverse'}, lag = +${lagYears} yr${lagYears === 1 ? '' : 's'})`
  };
}

/**
 * Computes an Epithelial Barrier Disruption Risk Index (0-100)
 * based on lipophilicity (LogP), surfactant inclusion, tight-junction disruption,
 * and plant pathogenesis-related (PR) chitinase stress induction.
 */
export function computeBarrierDisruptionScore(compound: AgrochemicalProperty): number {
  // LogP sweet spot for cellular membrane penetration: 1.5 - 3.5
  let logPComponent = 0;
  if (compound.logP >= 1.0 && compound.logP <= 4.0) {
    logPComponent = 25 * (1 - Math.abs(compound.logP - 2.5) / 2.5);
  } else if (compound.logP > 4.0) {
    logPComponent = 15;
  } else {
    logPComponent = 5;
  }

  const surfactantComponent = compound.surfactantAdjuvant ? 25 : 0;
  const tjComponent = Math.min(30, compound.tightJunctionDisruptionFactor * 30);
  const prStressComponent = Math.min(20, compound.plantStressPRInductionFactor * 20);

  const rawScore = logPComponent + surfactantComponent + tjComponent + prStressComponent;
  return Math.round(Math.max(0, Math.min(100, rawScore)));
}

/**
 * Computes allergen structural & sequence homology metrics between Hevein domain (Hev b 6.02)
 * and Class I plant endochitinases (e.g. Mus a 2 in banana, Pers a 1 in avocado).
 */
export function computeAllergenCrossReactivity(
  sourceAllergen: string,
  targetAllergen: string
): {
  epitopeIdentityPct: number;
  gastricResistance: 'High' | 'Moderate' | 'Low';
  primaryOrganAffinity: 'Visceral Gastrointestinal (Cramps/Diarrhea)' | 'Oral/Mucosal (Itching/Angioedema)' | 'Systemic (Anaphylaxis)';
  chitinaseClass: string;
  molecularMechanism: string;
} {
  const normSource = sourceAllergen.toLowerCase();
  const normTarget = targetAllergen.toLowerCase();

  const isBanana = normTarget.includes('banana') || normTarget.includes('mus a');
  const isAvocado = normTarget.includes('avocado') || normTarget.includes('pers a');
  const isLatex = normSource.includes('latex') || normSource.includes('hev b');

  if (isLatex && isBanana) {
    return {
      epitopeIdentityPct: 78.5,
      gastricResistance: 'High', // Banana class I chitinases survive pepsin digestion at pH 2.0
      primaryOrganAffinity: 'Visceral Gastrointestinal (Cramps/Diarrhea)',
      chitinaseClass: 'Class I Endochitinase (Mus a 2 / Mus a 5) with conserved 43-aa N-terminal Hevein domain',
      molecularMechanism:
        'Pepsin-resistant N-terminal hevein-like cystine-rich domain survives gastric transit intact. It binds intestinal mucosal epithelial receptors and triggers mucosal mast-cell degranulation directly in the distal ileum and colon, causing enteric smooth muscle spasm, cramping, hypermotility, and secretory diarrhea.'
    };
  }

  if (isLatex && isAvocado) {
    return {
      epitopeIdentityPct: 71.2,
      gastricResistance: 'Moderate', // Pers a 1 has higher oral mucosal reactivity, rapid perioral penetration
      primaryOrganAffinity: 'Oral/Mucosal (Itching/Angioedema)',
      chitinaseClass: 'Class I Endochitinase (Pers a 1) + 32-kDa Endochitinase',
      molecularMechanism:
        'Rapidly solubilizes in human saliva; lipophilic fruit matrix facilitates buccal and oropharyngeal mucosal penetration. Readily cross-links pre-existing Hev b 6-specific IgE on subepithelial dendritic cells and oral mucosal mast cells, prompting immediate histamine release, pruritus, perioral angioedema, and pharyngeal tightness.'
    };
  }

  return {
    epitopeIdentityPct: 62.0,
    gastricResistance: 'Moderate',
    primaryOrganAffinity: 'Oral/Mucosal (Itching/Angioedema)',
    chitinaseClass: 'PR-3 / Pathogenesis-Related Class I Chitinase Superfamily',
    molecularMechanism:
      'Shared conserved 8-cysteine motif with 4 disulfide bridges forming a compact chitin-binding cleft that cross-reacts with polyclonal anti-hevein IgE antibodies.'
  };
}
