import React, { useState } from 'react';
import {
  REVERSAL_THERAPIES,
  type ReversalTherapy
} from '../data/scientific-data';
import {
  ShieldCheck,
  Zap,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  Dna,
  FileText,
  ExternalLink,
  Layers,
  ArrowRight
} from 'lucide-react';

interface Props {
  onSearchLiterature: (query: string) => void;
  onNavigateToHypothesis?: () => void;
}

export const ReversalTherapiesView: React.FC<Props> = ({
  onSearchLiterature,
  onNavigateToHypothesis,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTherapy, setSelectedTherapy] = useState<ReversalTherapy>(REVERSAL_THERAPIES[0]);

  const categories = [
    { key: 'all', label: 'All Therapeutics' },
    { key: 'Biologic Monoclonal Antibody', label: 'Biologics (Anti-IgE / Anti-IL-4Rα)' },
    { key: 'Accelerated Desensitization', label: 'Rapid Rush Immunotherapy' },
    { key: 'Tolerogenic Nanomedicine', label: 'Tolerogenic Nanomedicine (Tregs)' },
    { key: 'Microbiome & Barrier Restoration', label: 'Gut Barrier & Microbiome Repair' },
  ];

  const filteredTherapies =
    selectedCategory === 'all'
      ? REVERSAL_THERAPIES
      : REVERSAL_THERAPIES.filter((t) => t.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Header Context */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-2">
          <ShieldCheck className="w-3.5 h-3.5 mr-1" />
          Translational Allergy Therapeutics & Rapid Desensitization
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Progressive & Rapid Reversal of Established Food Allergic Sensitization
        </h2>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl">
          From monoclonal antibodies (Omalizumab FDA approval via the 2024 OUtMATCH trial) to rush immunotherapy, synthetic tolerogenic nanoparticles, and tight-junction microbiome repair. Explore how clinicians and researchers are actively reversing adult-acquired food hypersensitivity.
        </p>

        {/* Category Pills */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedCategory === cat.key
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Therapies Selection & Clinical Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Therapy Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          {filteredTherapies.map((therapy) => {
            const isSelected = selectedTherapy.id === therapy.id;
            return (
              <div
                key={therapy.id}
                onClick={() => setSelectedTherapy(therapy)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-blue-50/70 border-blue-500 shadow-sm ring-1 ring-blue-500'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {therapy.category}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 mt-1">{therapy.name}</h4>
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      therapy.timelineToEffect.startsWith('Rapid')
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-blue-100 text-blue-800 border border-blue-200'
                    }`}
                  >
                    {therapy.timelineToEffect.split(':')[0]}
                  </span>
                </div>

                <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                  {therapy.targetMechanism}
                </p>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Trial: {therapy.keyTrialOrCitation.split('|')[0]}</span>
                  <span className="text-blue-600 font-medium flex items-center">
                    Inspect Protocol <ArrowRight className="w-3 h-3 ml-1" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Deep Clinical & Mechanistic Inspector (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex items-start justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-800">
                {selectedTherapy.category}
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-1">{selectedTherapy.name}</h3>
              <div className="flex items-center space-x-2 text-xs text-slate-500 mt-1">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span><strong>Onset & Escalation:</strong> {selectedTherapy.timelineToEffect}</span>
              </div>
            </div>

            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                selectedTherapy.durability.includes('Permanent')
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  : 'bg-amber-100 text-amber-800 border border-amber-200'
              }`}
            >
              {selectedTherapy.durability}
            </span>
          </div>

          {/* Molecular Target Mechanism */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center">
              <Dna className="w-3.5 h-3.5 mr-1 text-blue-600" /> Molecular Target & Immunological Mechanism
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-lg border border-slate-200">
              {selectedTherapy.targetMechanism}
            </p>
          </div>

          {/* Clinical Evidence & Landmark Trials */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center">
              <FileText className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Clinical Trial Evidence & Validation
            </h4>
            <div className="bg-emerald-50/50 p-3.5 rounded-lg border border-emerald-200 text-xs text-slate-700 space-y-2">
              <p className="leading-relaxed">{selectedTherapy.clinicalEvidence}</p>
              <div className="font-mono text-emerald-800 font-bold text-[11px] pt-1">
                Key Reference: {selectedTherapy.keyTrialOrCitation}
              </div>
            </div>
          </div>

          {/* Administration & Protocol */}
          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
            <div className="font-bold text-slate-900">Clinical Administration Protocol</div>
            <p className="text-slate-600 leading-relaxed">{selectedTherapy.dosingOrAdministration}</p>
          </div>

          {/* Rapid vs Progressive Reversal Comparative Takeaway */}
          <div className="p-3.5 bg-blue-50/60 rounded-lg border border-blue-200 text-xs text-blue-950 space-y-1">
            <div className="font-bold flex items-center">
              <Sparkles className="w-3.5 h-3.5 mr-1 text-blue-600" />
              Translational Takeaway for Adult Latex-Fruit Syndrome:
            </div>
            <p className="leading-relaxed">
              Combining <strong>Omalizumab with rush oral or sublingual desensitization</strong> offers the most potent immediate protection against severe banana cramps or avocado angioedema by lowering basophil FcεRI density within weeks, while allowing high-dose antigen exposure to stimulate sustained IgG4 blocking antibodies.
            </p>
          </div>

          {/* Outbound PubMed Search */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => onSearchLiterature(`${selectedTherapy.name} food allergy desensitization`)}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center transition-colors"
            >
              Search PubMed Trials for This Therapy <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
            </button>

            {onNavigateToHypothesis && (
              <button
                onClick={onNavigateToHypothesis}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center transition-colors"
              >
                Synthesize Personalized Reversal Model
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
