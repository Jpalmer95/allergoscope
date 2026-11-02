import React from 'react';
import {
  Dna,
  FlaskConical,
  MapPin,
  ShieldCheck,
  BookOpen,
  Sparkles,
  Layers,
  Activity,
  AlertCircle
} from 'lucide-react';

export type TabKey = 'mechanism' | 'agrochemicals' | 'chronography' | 'reversal' | 'literature' | 'hypothesis';

interface NavbarProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  onSelectQuickExample: (exampleId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onTabChange, onSelectQuickExample }) => {
  const tabs: { key: TabKey; label: string; icon: React.ReactNode; badge?: string }[] = [
    { key: 'mechanism', label: 'Molecular & Clinical Mechanisms', icon: <Dna className="w-4 h-4" /> },
    { key: 'agrochemicals', label: 'Agrochemical & Food Cross-Reference', icon: <FlaskConical className="w-4 h-4" /> },
    { key: 'chronography', label: 'Chronographical Map & Lag Analytics', icon: <MapPin className="w-4 h-4" />, badge: '1990-2026' },
    { key: 'reversal', label: 'Reversal & Desensitization', icon: <ShieldCheck className="w-4 h-4" /> },
    { key: 'literature', label: 'PubMed Literature Scout', icon: <BookOpen className="w-4 h-4" /> },
    { key: 'hypothesis', label: 'Hypothesis Studio', icon: <Sparkles className="w-4 h-4" /> },
  ];

  const quickExamples = [
    { id: 'banana', label: 'Banana (Mus a 2: Enteric Cramps)' },
    { id: 'avocado', label: 'Avocado (Pers a 1: Oral Angioedema)' },
    { id: '1-mcp', label: '1-MCP (SmartFresh Ripening Inhibitor)' },
    { id: 'azoxystrobin', label: 'Azoxystrobin (Strobilurin Fungicide)' },
    { id: 'poea', label: 'POEA (Epithelial Surfactant)' },
    { id: 'omalizumab', label: 'Omalizumab (OUtMATCH Reversal)' },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-xs">
      {/* Top Banner / Identity */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-sm">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-900">AllergoScope</h1>
              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                Open research workbench
              </span>
              <span className="hidden sm:inline-flex px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Open source
              </span>
            </div>
            <p className="text-xs text-slate-600">
              Adult-Onset Food Allergies • Latex-Fruit Syndrome • Agrochemical Barrier Disruption • Lagged Chronography
            </p>
          </div>
        </div>

        {/* Quick Example Chips */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-medium text-slate-600 flex items-center mr-1">
            <Layers className="w-3.5 h-3.5 mr-1 text-slate-600" /> Quick-Try:
          </span>
          {quickExamples.map((ex) => (
            <button
              key={ex.id}
              onClick={() => onSelectQuickExample(ex.id)}
              className="text-xs px-2.5 py-1 rounded-full bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-300 transition-colors font-mono"
            >
              {ex.label}
            </button>
          ))}
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-100 flex overflow-x-auto space-x-1 py-1.5 scrollbar-none">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className={`flex items-center space-x-2 px-3.5 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                    isActive ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
};
