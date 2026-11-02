import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculatePearsonCorrelation,
  calculateLaggedCorrelation,
  computeBarrierDisruptionScore,
  computeAllergenCrossReactivity,
  type AgrochemicalProperty,
} from './allergy-math.ts';

test('calculatePearsonCorrelation returns 1.0 for perfect positive correlation', () => {
  const x = [10, 20, 30, 40, 50];
  const y = [100, 200, 300, 400, 500];
  const r = calculatePearsonCorrelation(x, y);
  assert.equal(r, 1);
});

test('calculatePearsonCorrelation returns -1.0 for perfect inverse correlation', () => {
  const x = [1, 2, 3, 4, 5];
  const y = [50, 40, 30, 20, 10];
  const r = calculatePearsonCorrelation(x, y);
  assert.equal(r, -1);
});

test('calculateLaggedCorrelation computes correlation with 2-year delay', () => {
  // Chemical shift started in year 0 and ramped up
  const chemicals = [10, 20, 30, 50, 70, 90, 100, 110];
  // Allergy symptoms delayed by 2 years
  const allergies = [5, 5, 12, 22, 31, 52, 71, 93];

  const resultLag2 = calculateLaggedCorrelation(chemicals, allergies, 2);
  assert.ok(resultLag2.r > 0.95, `Expected high correlation with lag 2, got ${resultLag2.r}`);
  assert.equal(resultLag2.sampleSize, 6);
  assert.match(resultLag2.description, /Very Strong correlation/);

  // Negative or excessive lag should handle gracefully
  const resultLagBig = calculateLaggedCorrelation(chemicals, allergies, 10);
  assert.equal(resultLagBig.r, 0);
});

test('computeBarrierDisruptionScore computes 0-100 scale', () => {
  const safeCompound: AgrochemicalProperty = {
    id: 'safe-1',
    name: 'Minimal Surfactant Buffer',
    chemicalClass: 'Biocontrol',
    logP: 0.2,
    surfactantAdjuvant: false,
    tightJunctionDisruptionFactor: 0.05,
    plantStressPRInductionFactor: 0.1,
  };

  const highRiskPesticide: AgrochemicalProperty = {
    id: 'chem-high',
    name: 'Azoxystrobin + POEA Surfactant Formulant',
    chemicalClass: 'Strobilurin + Surfactant',
    logP: 2.5,
    surfactantAdjuvant: true,
    tightJunctionDisruptionFactor: 0.9,
    plantStressPRInductionFactor: 0.85,
  };

  const safeScore = computeBarrierDisruptionScore(safeCompound);
  const highRiskScore = computeBarrierDisruptionScore(highRiskPesticide);

  assert.ok(safeScore < 25, `Expected low score for safe compound, got ${safeScore}`);
  assert.ok(highRiskScore >= 80, `Expected high score for high-risk compound, got ${highRiskScore}`);
});

test('computeAllergenCrossReactivity distinguishes Banana GI vs Avocado Oral symptoms', () => {
  const bananaResult = computeAllergenCrossReactivity('Latex (Hev b 6)', 'Banana (Mus a 2)');
  assert.equal(bananaResult.gastricResistance, 'High');
  assert.match(bananaResult.primaryOrganAffinity, /Visceral Gastrointestinal/);
  assert.ok(bananaResult.epitopeIdentityPct > 70);

  const avocadoResult = computeAllergenCrossReactivity('Latex (Hev b 6)', 'Avocado (Pers a 1)');
  assert.equal(avocadoResult.gastricResistance, 'Moderate');
  assert.match(avocadoResult.primaryOrganAffinity, /Oral\/Mucosal/);
  assert.ok(avocadoResult.epitopeIdentityPct > 70);
});
