/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { MolecularMechanismView } from './components/MolecularMechanismView';
import { AgrochemicalDatabaseView } from './components/AgrochemicalDatabaseView';
import { ChronographicalMapView } from './components/ChronographicalMapView';
import { ReversalTherapiesView } from './components/ReversalTherapiesView';
import { LiteratureScoutView } from './components/LiteratureScoutView';
import { HypothesisStudioView } from './components/HypothesisStudioView';
import { MobileDrawer, Sidebar, TAB_META, TopBar, type TabKey } from './components/Shell';
import { PageHeader, ProvenancePanel } from './components/Chrome';
import { MEDICAL_DISCLAIMER, SCOPE_STATEMENT } from './data/provenance';
import { Info, ShieldAlert } from 'lucide-react';

const VALID_TABS: TabKey[] = [
  'mechanism',
  'agrochemicals',
  'chronography',
  'literature',
  'reversal',
  'hypothesis',
];

const tabFromHash = (): TabKey => {
  const raw = window.location.hash.replace(/^#\/?/, '').split('?')[0];
  return (VALID_TABS as string[]).includes(raw) ? (raw as TabKey) : 'mechanism';
};

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>(() => tabFromHash());

  // Deep links: #/chronography etc. so a section can be shared directly.
  useEffect(() => {
    const onHash = () => setActiveTab(tabFromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const goToTab = (tab: TabKey) => {
    setActiveTab(tab);
    if (window.location.hash !== `#/${tab}`) {
      window.history.replaceState(null, '', `#/${tab}`);
    }
  };

  useEffect(() => {
    document.title = `${TAB_META[activeTab].label} · AllergoScope`;
  }, [activeTab]);
  const [showProvenance, setShowProvenance] = useState<boolean>(false);
  const [navOpen, setNavOpen] = useState<boolean>(false);
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
        goToTab('mechanism');
        break;
      case 'avocado':
        setSelectedFoodId('avocado');
        goToTab('mechanism');
        break;
      case '1-mcp':
      case 'azoxystrobin':
      case 'poea':
        goToTab('agrochemicals');
        break;
      case 'omalizumab':
        goToTab('reversal');
        break;
      default:
        goToTab('mechanism');
    }
  };

  const handleSearchLiterature = (query: string) => {
    setLiteratureQuery(query);
    goToTab('literature');
  };

  const handleSelectForHypothesis = (food: string, chem: string) => {
    setHypothesisParams({ food, chemical: chem });
    goToTab('hypothesis');
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div className="min-h-dvh text-slate-800">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:shadow-lg"
      >
        Skip to content
      </a>

      {/* Desktop navigation rail */}
      <div className="fixed inset-y-0 left-0 z-40 hidden lg:block">
        <Sidebar
          activeTab={activeTab}
          onTabChange={(t) => {
            goToTab(t);
            scrollToTop();
          }}
          onSelectQuickExample={handleSelectQuickExample}
        />
      </div>

      {/* Mobile navigation drawer */}
      <MobileDrawer open={navOpen} onClose={() => setNavOpen(false)}>
        <Sidebar
          activeTab={activeTab}
          onTabChange={(t) => {
            goToTab(t);
            scrollToTop();
          }}
          onSelectQuickExample={handleSelectQuickExample}
          onClose={() => setNavOpen(false)}
        />
      </MobileDrawer>

      <div className="lg:pl-[274px]">
        <TopBar
          activeTab={activeTab}
          onOpenNav={() => setNavOpen(true)}
          onToggleProvenance={() => setShowProvenance((v) => !v)}
          provenanceOpen={showProvenance}
        />

        <main
          id="main-content"
          className="mx-auto w-full max-w-[1200px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-9"
        >
          {/* Scope line — always visible, never dismissible */}
          <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-[var(--line)] bg-white/70 px-4 py-3 text-[11.5px] leading-relaxed text-slate-500 backdrop-blur-sm">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-600" />
            <p>
              {SCOPE_STATEMENT}{' '}
              <button
                onClick={() => setShowProvenance((v) => !v)}
                className="font-semibold text-blue-700 underline decoration-blue-300 decoration-dotted underline-offset-2 hover:text-blue-800"
              >
                {showProvenance ? 'Hide the provenance breakdown' : 'See how each dataset is labelled'}
              </button>
            </p>
          </div>

          {showProvenance && <ProvenancePanel onClose={() => setShowProvenance(false)} />}

          <div key={activeTab} className="animate-rise">
            {activeTab === 'mechanism' && (
              <MolecularMechanismView
                selectedFoodId={selectedFoodId}
                onSelectFood={setSelectedFoodId}
                onNavigateToTab={goToTab}
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
                onNavigateToHypothesis={() => goToTab('hypothesis')}
              />
            )}

            {activeTab === 'reversal' && (
              <ReversalTherapiesView
                onSearchLiterature={handleSearchLiterature}
                onNavigateToHypothesis={() => goToTab('hypothesis')}
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
          </div>

          <footer className="mt-12 border-t border-[var(--line)] pt-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="max-w-md">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-semibold tracking-tight text-slate-900">
                    AllergoScope
                  </span>
                  <span className="rounded border border-[var(--line)] bg-white px-1.5 py-0.5 font-mono text-[9.5px] font-medium text-slate-500">
                    Apache-2.0
                  </span>
                </div>
                <p className="mt-1.5 text-[11px] leading-relaxed text-slate-500">
                  {TAB_META[activeTab].hint}. Data: NCBI PubMed E-utilities, PubChem PUG REST,
                  verified primary literature.
                </p>
              </div>

              <div className="flex items-start gap-2 rounded-xl border border-amber-200/70 bg-amber-50/60 px-3.5 py-2.5 sm:max-w-sm">
                <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-700" />
                <p className="text-[10.5px] leading-relaxed text-amber-900">{MEDICAL_DISCLAIMER}</p>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
