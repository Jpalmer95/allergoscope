import React, { useState } from 'react';
import {
  FOOD_ALLERGENS,
  AGROCHEMICALS,
  REVERSAL_THERAPIES
} from '../data/scientific-data';
import { buildSynthesis } from '../utils/synthesis';
import {
  Sparkles,
  Loader2,
  FileText,
  Copy,
  Check,
  Download,
  AlertCircle,
  FlaskConical,
  Dna,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

interface Props {
  initialFood?: string;
  initialChemical?: string;
}

export const HypothesisStudioView: React.FC<Props> = ({
  initialFood = 'Banana',
  initialChemical = 'Azoxystrobin',
}) => {
  const [selectedFood, setSelectedFood] = useState<string>(initialFood);
  const [selectedChemical, setSelectedChemical] = useState<string>(initialChemical);
  const [selectedSymptom, setSelectedSymptom] = useState<string>('Visceral Enteric Cramps & Secretory Diarrhea');
  const [selectedReversal, setSelectedReversal] = useState<string>('Omalizumab (Anti-IgE) + Multi-Food Rush OIT');
  const [customNotes, setCustomNotes] = useState<string>(
    'Investigating why adults tolerate foods for decades before experiencing sudden acute reactivity following post-harvest agrochemical exposure and 1-MCP ripening delays.'
  );

  const [synthesisOutput, setSynthesisOutput] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [engine, setEngine] = useState<string | null>(null);

  const handleSynthesize = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    const payload = {
      food: selectedFood,
      chemical: selectedChemical,
      symptomPattern: selectedSymptom,
      hypothesis: customNotes,
    };

    try {
      // Prefer the server route (may layer a language model on top). On a static
      // host this request fails and the local rule engine answers instead.
      const res = await fetch('/api/ai/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch(() => null);

      const data = res && res.ok ? await res.json().catch(() => null) : null;
      if (data?.synthesis) {
        setSynthesisOutput(data.synthesis);
        setEngine(data.model || 'server engine');
      } else {
        const local = buildSynthesis(payload);
        setSynthesisOutput(local.synthesis);
        setEngine(local.model);
      }
    } catch (err: any) {
      console.error(err);
      const local = buildSynthesis(payload);
      setSynthesisOutput(local.synthesis);
      setEngine(local.model);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (synthesisOutput) {
      navigator.clipboard.writeText(synthesisOutput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (synthesisOutput) {
      const blob = new Blob([synthesisOutput], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `AllergoScope_Hypothesis_${selectedFood}_${selectedChemical.replace(/\s+/g, '_')}.md`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Context */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200 mb-2">
          <Sparkles className="w-3.5 h-3.5 mr-1" />
          Translational Research & Environmental Trigger Formulation
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Hypothesis Studio &amp; Biomechanistic Reasoning
        </h2>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl">
          Turn a personal observation into a falsifiable brief: pick a food, an agrochemical exposure and a symptom pattern, and the engine lays out what the literature establishes, what it merely suggests, and which experiment would settle it.
        </p>
      </div>

      {/* Interactive Formulation Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Hypothesis Configuration Controls (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center">
            <FlaskConical className="w-4 h-4 mr-1.5 text-blue-600" /> Research Parameters
          </h3>

          {/* 1. Target Food */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              1. Target Food / Endochitinase Source:
            </label>
            <select
              value={selectedFood}
              onChange={(e) => setSelectedFood(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {FOOD_ALLERGENS.map((f) => (
                <option key={f.id} value={f.name}>
                  {f.name} ({f.scientificName} - {f.category})
                </option>
              ))}
            </select>
          </div>

          {/* 2. Agrochemical Treatment */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              2. Agrochemical / Environmental Agent:
            </label>
            <select
              value={selectedChemical}
              onChange={(e) => setSelectedChemical(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {AGROCHEMICALS.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name} ({c.applicationPhase})
                </option>
              ))}
            </select>
          </div>

          {/* 3. Symptom Pattern */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              3. Clinical Symptom Phenotype:
            </label>
            <select
              value={selectedSymptom}
              onChange={(e) => setSelectedSymptom(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="Visceral Enteric Cramps & Secretory Diarrhea">
                Visceral Enteric Cramps & Secretory Diarrhea (Banana phenotype)
              </option>
              <option value="Oral Pruritus, Labial Angioedema & Throat Tightness">
                Oral Pruritus, Labial Angioedema & Throat Tightness (Avocado phenotype)
              </option>
              <option value="Systemic Cardiovascular Anaphylaxis & Dyspnea">
                Systemic Cardiovascular Anaphylaxis & Dyspnea (Latex/Chestnut phenotype)
              </option>
              <option value="Mixed Oral Allergy Syndrome + Eosinophilic Esophagitis Flare">
                Mixed Oral Allergy Syndrome + Eosinophilic Esophagitis Flare
              </option>
            </select>
          </div>

          {/* 4. Candidate Reversal Strategy */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              4. Candidate Reversal Intervention:
            </label>
            <select
              value={selectedReversal}
              onChange={(e) => setSelectedReversal(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {REVERSAL_THERAPIES.map((r) => (
                <option key={r.id} value={r.name}>
                  {r.name} ({r.category})
                </option>
              ))}
            </select>
          </div>

          {/* 5. Custom Inquiry / Context */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              5. Specific Working Hypothesis / Research Question:
            </label>
            <textarea
              rows={3}
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              placeholder="Detail your inquiry into delayed environmental triggers, barrier disruption, or desensitization protocols..."
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Action Button */}
          <button
            onClick={handleSynthesize}
            disabled={isLoading}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-lg flex items-center justify-center shadow-xs transition-all disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Synthesizing Molecular Evaluation...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" /> Synthesize Biochemical Hypothesis
              </>
            )}
          </button>
        </div>

        {/* Right Column: AI Output & Scientific Brief Pane (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-purple-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Biomedical Synthesis &amp; Mechanistic Evaluation
                </h3>
                {engine && (
                  <span className="ml-2 text-[10px] font-mono text-slate-400">engine: {engine}</span>
                )}
              </div>

              {synthesisOutput && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCopy}
                    className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 text-xs flex items-center transition-colors"
                    title="Copy Markdown"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                  <button
                    onClick={handleDownload}
                    className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 text-xs flex items-center transition-colors"
                    title="Download Report"
                  >
                    <Download className="w-3.5 h-3.5 mr-1" />
                    <span>Download</span>
                  </button>
                </div>
              )}
            </div>

            {errorMsg && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center">
                <AlertCircle className="w-4 h-4 mr-2 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Content Output */}
            {synthesisOutput ? (
              <div className="mt-4 text-xs text-slate-700 space-y-3 leading-relaxed max-h-[580px] overflow-y-auto pr-2">
                <div className="whitespace-pre-line font-sans prose prose-sm max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-700">
                  {synthesisOutput}
                </div>
              </div>
            ) : (
              <div className="mt-12 text-center text-slate-400 space-y-3 py-10">
                <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-semibold text-slate-700">Ready to Synthesize</h4>
                <p className="text-xs max-w-md mx-auto text-slate-500">
                  Configure your parameters on the left and click <strong>Synthesize Biochemical Hypothesis</strong> to evaluate molecular homology, barrier permeation indices, and multi-year lag correlations.
                </p>
              </div>
            )}
          </div>

          {/* Scientific Disclaimer */}
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
            Research and education only - not medical advice or a diagnosis. The agrochemical multipliers are modelled estimates, not measurements. See an allergist for component-resolved testing and treatment.
          </div>
        </div>
      </div>
    </div>
  );
};
