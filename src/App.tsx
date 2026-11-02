/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar, type TabKey } from './components/Navbar';
import { MolecularMechanismView } from './components/MolecularMechanismView';
import { AgrochemicalDatabaseView } from './components/AgrochemicalDatabaseView';
import { ChronographicalMapView } from './components/ChronographicalMapView';
import { ReversalTherapiesView } from './components/ReversalTherapiesView';
import { LiteratureScoutView } from './components/LiteratureScoutView';
import { HypothesisStudioView } from './components/HypothesisStudioView';
import { DATA_PROVENANCE, MEDICAL_DISCLAIMER, SCOPE_STATEMENT, STATUS_STYLES } from './data/provenance';
import { Info } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('mechanism');
  const [showProvenance, setShowProvenance] = useState<boolean>(false);
  const [selectedFoodId, setSelectedFoodId] = useState<string>('banana');
  const [literatureQuery, setLiteratureQuery] = useState<string>('latex fruit syndrome chitinase');
  const [hypothesisParams, setHypothesisParams] = useState<{ food: string; chemical: string }>({
    food: 'Banana',
    chemical: 'Azoxystrobin',
  });

  const handleSelectQuickExample = (exampleId: string) => {
    switch (exampleId) {
      case 'banana':
        setSelectedFoodId('banana');
        setActiveTab('mechanism');
        break;
      case 'avocado':
        setSelectedFoodId('avocado');
        setActiveTab('mechanism');
        break;
      case '1-mcp':
        setActiveTab('agrochemicals');
        break;
      case 'azoxystrobin':
        setActiveTab('agrochemicals');
        break;
      case 'poea':
        setActiveTab('agrochemicals');
        break;
      case 'omalizumab':
        setActiveTab('reversal');
        break;
      default:
        setActiveTab('mechanism');
    }
  };

  const handleSearchLiterature = (query: string) => {
    setLiteratureQuery(query);
    setActiveTab('literature');
  };

  const handleSelectForHypothesis = (food: string, chem: string) => {
    setHypothesisParams({ food, chemical: chem });
    setActiveTab('hypothesis');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onSelectQuickExample={handleSelectQuickExample}
      />

      {/* Scope & data provenance banner */}
      <div className="bg-amber-50/70 border-b border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 text-xs text-amber-900">
          <div className="flex items-start sm:items-center justify-between gap-3">
            <p className="flex items-start leading-relaxed">
              <Info className="w-3.5 h-3.5 mr-1.5 mt-0.5 shrink-0" />
              <span>{SCOPE_STATEMENT}</span>
            </p>
            <button
              onClick={() => setShowProvenance((v) => !v)}
              className="shrink-0 font-semibold underline decoration-dotted hover:text-amber-950"
            >
              {showProvenance ? 'Hide data provenance' : 'Data provenance'}
            </button>
          </div>

          {showProvenance && (
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
              {DATA_PROVENANCE.map((d) => (
                <div key={d.id} className="bg-white/80 border border-amber-200 rounded-lg p-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-slate-800">{d.label}</span>
                    <span
                      className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${STATUS_STYLES[d.status].className}`}
                    >
                      {STATUS_STYLES[d.status].label}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-600 leading-relaxed">{d.detail}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'mechanism' && (
          <MolecularMechanismView
            selectedFoodId={selectedFoodId}
            onSelectFood={setSelectedFoodId}
            onNavigateToTab={setActiveTab}
          />
        )}

        {activeTab === 'agrochemicals' && (
          <AgrochemicalDatabaseView
            onSearchLiterature={handleSearchLiterature}
            onSelectIngredientForHypothesis={handleSelectForHypothesis}
          />
        )}

        {activeTab === 'chronography' && (
          <ChronographicalMapView
            onSearchLiterature={handleSearchLiterature}
            onNavigateToHypothesis={() => setActiveTab('hypothesis')}
          />
        )}

        {activeTab === 'reversal' && (
          <ReversalTherapiesView
            onSearchLiterature={handleSearchLiterature}
            onNavigateToHypothesis={() => setActiveTab('hypothesis')}
          />
        )}

        {activeTab === 'literature' && (
          <LiteratureScoutView initialSearchQuery={literatureQuery} />
        )}

        {activeTab === 'hypothesis' && (
          <HypothesisStudioView
            initialFood={hypothesisParams.food}
            initialChemical={hypothesisParams.chemical}
          />
        )}
      </main>

      {/* Scientific Workbench Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-800">AllergoScope</span>
            <span>•</span>
            <span>Biomedical Literature, Agrochemical Cross-Reference & Chronographical Correlation Engine</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:space-x-4">
            <span className="text-slate-400">Live data: NCBI PubMed E-utilities • PubChem PUG REST</span>
            <span className="text-slate-500 max-w-md sm:text-right">{MEDICAL_DISCLAIMER}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
