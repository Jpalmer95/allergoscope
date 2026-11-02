import React, { useState, useMemo } from 'react';
import {
  AGROCHEMICALS,
  FOOD_ALLERGENS,
  type Agrochemical,
  type FoodAllergen,
} from '../data/scientific-data';
import { computeBarrierDisruptionScore } from '../utils/allergy-math';
import {
  Search,
  Filter,
  ExternalLink,
  ShieldAlert,
  AlertTriangle,
  Zap,
  Info,
  ChevronRight,
  FlaskConical,
  Sparkles,
  BookOpen
} from 'lucide-react';

interface Props {
  onSearchLiterature: (query: string) => void;
  onSelectIngredientForHypothesis?: (food: string, chem: string) => void;
}

export const AgrochemicalDatabaseView: React.FC<Props> = ({
  onSearchLiterature,
  onSelectIngredientForHypothesis,
}) => {
  const [selectedIngredient, setSelectedIngredient] = useState<string>('all');
  const [selectedPhase, setSelectedPhase] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedChemical, setSelectedChemical] = useState<Agrochemical | null>(AGROCHEMICALS[0]);

  // Filtered chemicals
  const filteredChemicals = useMemo(() => {
    return AGROCHEMICALS.filter((chem) => {
      // Filter by crop/ingredient
      if (selectedIngredient !== 'all') {
        const matchesCrop = chem.targetCrops.some((crop) =>
          crop.toLowerCase().includes(selectedIngredient.toLowerCase())
        );
        if (!matchesCrop) return false;
      }

      // Filter by application phase
      if (selectedPhase !== 'all' && chem.applicationPhase !== selectedPhase) {
        return false;
      }

      // Text search
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const inName = chem.name.toLowerCase().includes(q);
        const inTrade = chem.tradeNames.some((t) => t.toLowerCase().includes(q));
        const inClass = chem.chemicalClass.toLowerCase().includes(q);
        const inTarget = chem.primaryTargetPest.toLowerCase().includes(q);
        return inName || inTrade || inClass || inTarget;
      }

      return true;
    });
  }, [selectedIngredient, selectedPhase, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header and Context */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-2">
              <FlaskConical className="w-3.5 h-3.5 mr-1" />
              Agricultural Chemicals & Food Cross-Reference
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Agrochemical Usage, Post-Harvest Sprays & Epithelial Permeability
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl">
              Cross-reference fruit ingredients against agricultural chemical registries (fungicides, post-harvest ripening arresters, surfactant adjuvants, and fruit waxes). Investigate how agrochemical exposure degrades mucosal tight junctions and stimulates plants to hyper-express defensive endochitinases.
            </p>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center gap-3">
          {/* Ingredient Pills */}
          <div className="flex items-center flex-wrap gap-1.5">
            <span className="text-xs font-semibold text-slate-500 mr-1">Food Ingredient:</span>
            <button
              onClick={() => setSelectedIngredient('all')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                selectedIngredient === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Foods
            </button>
            {FOOD_ALLERGENS.map((food) => (
              <button
                key={food.id}
                onClick={() => setSelectedIngredient(food.name)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  selectedIngredient === food.name
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-700'
                }`}
              >
                {food.name}
              </button>
            ))}
          </div>

          <div className="w-px h-6 bg-slate-200 hidden lg:block mx-1" />

          {/* Application Phase Selector */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-slate-500">Application:</span>
            <select
              value={selectedPhase}
              onChange={(e) => setSelectedPhase(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Phases</option>
              <option value="Post-Harvest Dip/Spray">Post-Harvest Dip/Spray</option>
              <option value="Storage Ripening Inhibitor">Storage Ripening Inhibitor</option>
              <option value="Adjuvant Surfactant">Adjuvant Surfactant</option>
              <option value="Pre-Harvest Foliar">Pre-Harvest Foliar</option>
            </select>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search chemical, trade name, class, or pest..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg pl-8 pr-3 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Main Grid: Chemicals List & Deep Inspector Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Chemical Cards List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>Showing {filteredChemicals.length} compounds</span>
            <span>Sorted by relevance</span>
          </div>

          <div className="space-y-3 max-h-[750px] overflow-y-auto pr-1">
            {filteredChemicals.map((chem) => {
              const isSelected = selectedChemical?.id === chem.id;
              const riskScore = computeBarrierDisruptionScore({
                id: chem.id,
                name: chem.name,
                chemicalClass: chem.chemicalClass,
                logP: chem.logP,
                surfactantAdjuvant: chem.applicationPhase === 'Adjuvant Surfactant',
                tightJunctionDisruptionFactor:
                  chem.epithelialPermeabilityImpact.tightJunctionDisruption === 'Severe'
                    ? 0.9
                    : chem.epithelialPermeabilityImpact.tightJunctionDisruption === 'Moderate'
                    ? 0.5
                    : 0.2,
                plantStressPRInductionFactor: Math.min(1.0, chem.plantPRStressInduction.chitinaseUpregulationPct / 400),
              });

              return (
                <div
                  key={chem.id}
                  onClick={() => setSelectedChemical(chem)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-50/70 border-blue-500 shadow-sm ring-1 ring-blue-500'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {chem.applicationPhase}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">CID: {chem.pubchemCid}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 mt-1">{chem.name}</h4>
                      <p className="text-xs text-slate-500 truncate max-w-[280px]">
                        Trade: {chem.tradeNames.join(', ')}
                      </p>
                    </div>

                    {/* Risk Score Pill */}
                    <div className="text-right">
                      <div
                        className={`text-xs font-bold px-2 py-0.5 rounded-full inline-block ${
                          riskScore >= 75
                            ? 'bg-red-100 text-red-700 border border-red-200'
                            : riskScore >= 50
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        Risk {riskScore}/100
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Barrier Index</div>
                    </div>
                  </div>

                  {/* Crops Tag Bar */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {chem.targetCrops.map((crop, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-700 rounded-sm font-medium"
                      >
                        {crop}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}

            {filteredChemicals.length === 0 && (
              <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-slate-500 text-sm">
                No chemical compounds match the selected filter criteria.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Deep Chemical & Biological Inspector Pane (7 cols) */}
        {selectedChemical && (
          <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
            {/* Header with PubChem 2D Structure */}
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-800">
                    {selectedChemical.chemicalClass}
                  </span>
                  <span className="text-xs font-mono text-slate-500">
                    Formula: {selectedChemical.formula}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mt-1">{selectedChemical.name}</h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Primary Commercial Trade Names: <strong>{selectedChemical.tradeNames.join(', ')}</strong>
                </p>
                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-mono">
                    MW: {selectedChemical.molecularWeight} g/mol
                  </span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-mono">
                    LogP: {selectedChemical.logP}
                  </span>
                  <a
                    href={`https://pubchem.ncbi.nlm.nih.gov/compound/${selectedChemical.pubchemCid}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                  >
                    PubChem Entry <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </div>
              </div>

              {/* 2D Chemical Structure Rendered via PubChem PUG REST API */}
              <div className="w-28 h-28 bg-slate-50 rounded-lg border border-slate-200 p-1 flex items-center justify-center shrink-0">
                <img
                  src={`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${selectedChemical.pubchemCid}/PNG?image_size=180x180`}
                  alt={`${selectedChemical.name} 2D Structure`}
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => {
                    // Fallback in case of network issue
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
            </div>

            {/* Mechanism of Action */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center">
                <Info className="w-3.5 h-3.5 mr-1 text-blue-600" /> Agricultural Mechanism & Target
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
                {selectedChemical.mechanismOfAction}
              </p>
            </div>

            {/* Dual Biological Pressures: Barrier Disruption & Plant Stress PR Induction */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Box 1: Epithelial Barrier Permeability */}
              <div className="p-4 rounded-xl border border-red-200 bg-red-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-red-900 uppercase tracking-wider flex items-center">
                    <ShieldAlert className="w-4 h-4 mr-1 text-red-600" /> Epithelial Barrier Impact
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800">
                    {selectedChemical.epithelialPermeabilityImpact.tightJunctionDisruption}
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {selectedChemical.epithelialPermeabilityImpact.description}
                </p>
                <div className="pt-2 border-t border-red-200/60 text-xs">
                  <div className="text-[11px] font-semibold text-slate-700">Affected Tight Junction Proteins:</div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedChemical.epithelialPermeabilityImpact.affectedProteins.map((p, idx) => (
                      <span key={idx} className="bg-white/80 border border-red-200 text-red-800 text-[10px] px-1.5 py-0.5 rounded font-mono">
                        {p}
                      </span>
                    ))}
                  </div>
                  <div className="text-[11px] font-semibold text-slate-700 mt-2">Triggered Epithelial Alarmins:</div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedChemical.epithelialPermeabilityImpact.alarminInduction.map((a, idx) => (
                      <span key={idx} className="bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Box 2: Plant Stress Chitinase Induction */}
              <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center">
                    <Zap className="w-4 h-4 mr-1 text-amber-600" /> Plant PR-Defense Induction (hypothesis)
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 font-mono">
                    modelled +{selectedChemical.plantPRStressInduction.chitinaseUpregulationPct}%
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {selectedChemical.plantPRStressInduction.description}
                </p>
                <div className="pt-2 border-t border-amber-200/60 text-xs text-slate-600">
                  <div className="text-[11px] font-semibold text-slate-700">Significance for Allergic Patients:</div>
                  <p className="mt-1">
                    Chemical and handling stress can shift plant defence-protein expression, and ethylene treatment has been shown to <strong>induce class I chitinases</strong> in one food plant (Sanchez-Monge et al., JACI 2000). Whether any given agrochemical raises or lowers the chitinase dose per bite of banana or avocado <strong>has not been measured</strong> - the percentages on this page are modelled estimates used to rank hypotheses, not assay results.
                  </p>
                </div>
              </div>
            </div>

            {/* Regulatory Timeline & Policy Shifts */}
            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-2">
              <div className="font-bold text-slate-900 flex items-center justify-between">
                <span>Regulatory Status & Global Market Transition</span>
                <span className="font-mono text-slate-500">Major Shift: ~{selectedChemical.regulatoryStatus.historicalShiftYear}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600">
                <div>
                  <strong>EPA (United States):</strong> {selectedChemical.regulatoryStatus.epaStatus}
                </div>
                <div>
                  <strong>EFSA (European Union):</strong> {selectedChemical.regulatoryStatus.euMrlStatus}
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => onSearchLiterature(`${selectedChemical.name} epithelial barrier food allergy`)}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg flex items-center transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
                Search PubMed for {selectedChemical.name} Studies
              </button>

              {onSelectIngredientForHypothesis && (
                <button
                  onClick={() =>
                    onSelectIngredientForHypothesis(
                      selectedChemical.targetCrops[0] || 'Banana',
                      selectedChemical.name
                    )
                  }
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                  Synthesize Research Hypothesis in AI Studio
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
