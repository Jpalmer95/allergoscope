import React from 'react';
import {
  Activity,
  BookOpen,
  Dna,
  FlaskConical,
  Github,
  Info,
  Layers,
  MapPin,
  Menu,
  Sparkles,
  ShieldCheck,
  X,
} from 'lucide-react';

export type TabKey =
  | 'mechanism'
  | 'agrochemicals'
  | 'chronography'
  | 'reversal'
  | 'literature'
  | 'hypothesis';

interface NavMeta {
  key: TabKey;
  label: string;
  short: string;
  icon: React.ReactNode;
  hint: string;
}

export const NAV_GROUPS: { label: string; items: NavMeta[] }[] = [
  {
    label: 'Explore',
    items: [
      {
        key: 'mechanism',
        label: 'Mechanisms',
        short: 'Molecular & clinical',
        icon: <Dna className="h-4 w-4" />,
        hint: 'Hevein-domain cross-reactivity and symptom divergence',
      },
      {
        key: 'agrochemicals',
        label: 'Agrochemicals',
        short: 'Exposure cross-reference',
        icon: <FlaskConical className="h-4 w-4" />,
        hint: 'Post-harvest agents, barrier and PR-protein hypotheses',
      },
      {
        key: 'chronography',
        label: 'Chronography',
        short: 'Lagged correlation',
        icon: <MapPin className="h-4 w-4" />,
        hint: '1990-2026 agricultural shifts vs allergic disease',
      },
    ],
  },
  {
    label: 'Evidence',
    items: [
      {
        key: 'literature',
        label: 'Literature',
        short: 'PubMed scout',
        icon: <BookOpen className="h-4 w-4" />,
        hint: 'Live NCBI search plus verified landmark papers',
      },
      {
        key: 'reversal',
        label: 'Reversal',
        short: 'Desensitisation & biologics',
        icon: <ShieldCheck className="h-4 w-4" />,
        hint: 'What the trials actually showed',
      },
    ],
  },
  {
    label: 'Compose',
    items: [
      {
        key: 'hypothesis',
        label: 'Hypothesis studio',
        short: 'Build a falsifiable brief',
        icon: <Sparkles className="h-4 w-4" />,
        hint: 'Food x exposure x symptom, with evidence status',
      },
    ],
  },
];

export const TAB_META: Record<TabKey, NavMeta> = Object.fromEntries(
  NAV_GROUPS.flatMap((g) => g.items).map((i) => [i.key, i]),
) as Record<TabKey, NavMeta>;

export const TAB_GROUP: Record<TabKey, string> = Object.fromEntries(
  NAV_GROUPS.flatMap((g) => g.items.map((i) => [i.key, g.label])),
) as Record<TabKey, string>;

const QUICK_TRY: { id: string; label: string }[] = [
  { id: 'banana', label: 'Banana' },
  { id: 'avocado', label: 'Avocado' },
  { id: '1-mcp', label: '1-MCP' },
  { id: 'azoxystrobin', label: 'Azoxystrobin' },
  { id: 'poea', label: 'POEA' },
  { id: 'omalizumab', label: 'Omalizumab' },
];

const REPO_URL = 'https://github.com/Jpalmer95/allergoscope';

export const Sidebar: React.FC<{
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  onSelectQuickExample: (id: string) => void;
  onClose?: () => void;
}> = ({ activeTab, onTabChange, onSelectQuickExample, onClose }) => {
  return (
    <aside className="flex h-full w-[274px] flex-col border-r border-white/5 bg-[#0b1020] text-slate-300">
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 pb-5 pt-6">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-indigo-950/60">
          <Activity className="h-[18px] w-[18px] text-white" strokeWidth={2.4} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[15px] font-semibold leading-tight tracking-tight text-white">
            AllergoScope
          </div>
          <div className="mt-0.5 text-[11px] leading-tight text-slate-500">
            Latex-fruit research workbench
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-white lg:hidden"
            aria-label="Close navigation"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 pb-4" aria-label="Sections">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="mb-5">
            <div className="px-2.5 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/30">
              {group.label}
            </div>
            {group.items.map((item) => (
              <button
                key={item.key}
                onClick={() => {
                  onTabChange(item.key);
                  onClose?.();
                }}
                aria-current={activeTab === item.key ? 'true' : 'false'}
                className="nav-item"
              >
                <span className={activeTab === item.key ? 'text-white' : 'text-slate-500'}>
                  {item.icon}
                </span>
                <span className="flex-1 truncate">{item.label}</span>
                <span className="nav-dot" />
              </button>
            ))}
          </div>
        ))}

        {/* Quick try */}
        <div className="px-2.5 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/30">
          Quick try
        </div>
        <div className="flex flex-wrap gap-1.5 px-1.5">
          {QUICK_TRY.map((ex) => (
            <button
              key={ex.id}
              onClick={() => {
                onSelectQuickExample(ex.id);
                onClose?.();
              }}
              className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-slate-300 transition-colors hover:border-white/20 hover:bg-white/10 hover:text-white"
            >
              {ex.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Legend + disclaimer */}
      <div className="border-t border-white/[0.06] px-4 py-3.5">
        <div className="flex items-center gap-3 text-[10.5px] font-medium text-slate-400">
          <span className="inline-flex items-center gap-1.5">
            <i className="h-[6px] w-[6px] rounded-sm bg-emerald-400" /> Cited
          </span>
          <span className="inline-flex items-center gap-1.5">
            <i className="h-[6px] w-[6px] rounded-sm bg-amber-400" /> Modelled
          </span>
          <span className="inline-flex items-center gap-1.5">
            <i className="h-[6px] w-[6px] rounded-sm bg-violet-400" /> Hypothesis
          </span>
        </div>
        <p className="mt-2 text-[10.5px] leading-relaxed text-slate-500">
          Research &amp; education only. Not medical advice. Epinephrine first if you suspect
          anaphylaxis.
        </p>
        <a
          href={REPO_URL}
          target="_blank"
          rel="noreferrer"
          className="mt-2.5 inline-flex items-center gap-1.5 text-[10.5px] font-medium text-slate-400 transition-colors hover:text-white"
        >
          <Github className="h-3 w-3" /> Source &amp; corrections
        </a>
      </div>
    </aside>
  );
};

export const TopBar: React.FC<{
  activeTab: TabKey;
  onOpenNav: () => void;
  onToggleProvenance: () => void;
  provenanceOpen: boolean;
}> = ({ activeTab, onOpenNav, onToggleProvenance, provenanceOpen }) => {
  const meta = TAB_META[activeTab];
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--line)] bg-white/80 backdrop-blur-xl">
      <div className="flex h-[58px] items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button
          onClick={onOpenNav}
          className="btn btn-ghost !min-h-9 !px-2.5 lg:hidden"
          aria-label="Open navigation"
        >
          <Menu className="h-4 w-4" />
        </button>

        <div className="min-w-0">
          <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
            AllergoScope <span className="text-slate-300">/</span> {TAB_GROUP[activeTab]}
          </div>
          <div className="truncate text-[13.5px] font-semibold tracking-tight text-slate-900">
            {meta.short}
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <span className="hidden items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10.5px] font-semibold text-amber-800 xl:inline-flex">
            <Info className="h-3 w-3" /> Not medical advice
          </span>
          <button
            onClick={onToggleProvenance}
            className={`btn btn-ghost !min-h-9 ${provenanceOpen ? '!border-blue-200 !bg-blue-50 !text-blue-700' : ''}`}
            aria-expanded={provenanceOpen}
            aria-controls="provenance-panel"
          >
            <Layers className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Data provenance</span>
          </button>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="btn btn-ghost !min-h-9 !px-2.5"
            aria-label="GitHub repository"
          >
            <Github className="h-4 w-4" />
          </a>
        </div>
      </div>
    </header>
  );
};

export const MobileDrawer: React.FC<{
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ open, onClose, children }) =>
  open ? (
    <div className="fixed inset-0 z-50 flex lg:hidden">
      <div
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative z-10 h-full shadow-2xl">{children}</div>
    </div>
  ) : null;
