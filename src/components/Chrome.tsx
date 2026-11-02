import React from 'react';
import { DATA_PROVENANCE, OPEN_QUESTIONS, STATUS_STYLES } from '../data/provenance';
import { FlaskConical, ShieldCheck, Sigma, X } from 'lucide-react';

const STATUS_ICON = {
  cited: <ShieldCheck className="h-3.5 w-3.5" />,
  modelled: <Sigma className="h-3.5 w-3.5" />,
  hypothesis: <FlaskConical className="h-3.5 w-3.5" />,
} as const;

export const ProvenancePanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <section
      id="provenance-panel"
      className="card animate-rise mb-6 overflow-hidden"
      aria-label="Data provenance"
    >
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[var(--line)] px-5 py-4 sm:px-6">
        <div>
          <div className="eyebrow">Data provenance</div>
          <h2 className="mt-1 text-[15px] font-semibold tracking-tight text-slate-900">
            Three tiers of information, kept visually separate
          </h2>
          <p className="mt-1 max-w-2xl text-[12.5px] leading-relaxed text-slate-500">
            A research aid is only useful if you can tell a measurement from a placeholder. Every
            dataset below declares which one it is.
          </p>
        </div>
        <button onClick={onClose} className="btn btn-ghost !min-h-8 !px-2" aria-label="Hide provenance">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="grid gap-px bg-[var(--line)] sm:grid-cols-2 lg:grid-cols-3">
        {DATA_PROVENANCE.map((d) => {
          const style = STATUS_STYLES[d.status];
          return (
            <div key={d.id} className="bg-white p-5">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-[12.5px] font-semibold text-slate-900">{d.label}</h3>
                <span
                  className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${
                    d.status === 'cited'
                      ? 'status-cited'
                      : d.status === 'modelled'
                        ? 'status-modelled'
                        : 'status-hypothesis'
                  }`}
                >
                  {STATUS_ICON[d.status]}
                  {style.label}
                </span>
              </div>
              <p className="mt-1.5 text-[11.5px] leading-relaxed text-slate-500">{d.detail}</p>
            </div>
          );
        })}
      </div>

      <div className="border-t border-[var(--line)] bg-[var(--surface-sunk)] px-5 py-4 sm:px-6">
        <div className="eyebrow mb-2">Open questions this platform is built around</div>
        <ol className="space-y-2">
          {OPEN_QUESTIONS.map((q, i) => (
            <li key={q.question} className="flex gap-2 text-[11.5px] leading-relaxed text-slate-600">
              <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded bg-white font-mono text-[9px] font-bold text-slate-500 ring-1 ring-[var(--line)]">
                {i + 1}
              </span>
              <span>
                <strong className="font-semibold text-slate-800">{q.question}</strong> {q.why}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export const PageHeader: React.FC<{
  eyebrow: string;
  title: string;
  lead?: string;
  tone?: 'blue' | 'emerald' | 'indigo' | 'violet' | 'amber';
  icon?: React.ReactNode;
  actions?: React.ReactNode;
}> = ({ eyebrow, title, lead, tone = 'blue', icon, actions }) => {
  const tones: Record<string, string> = {
    blue: 'text-blue-700 bg-blue-50 border-blue-200',
    emerald: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    indigo: 'text-indigo-700 bg-indigo-50 border-indigo-200',
    violet: 'text-violet-700 bg-violet-50 border-violet-200',
    amber: 'text-amber-800 bg-amber-50 border-amber-200',
  };

  return (
    <div className="mb-6 flex flex-col gap-4 border-b border-[var(--line)] pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10.5px] font-semibold ${tones[tone]}`}
        >
          {icon}
          {eyebrow}
        </span>
        <h1 className="mt-3 max-w-3xl text-[26px] font-semibold leading-[1.15] tracking-[-0.03em] text-slate-900 sm:text-[30px]">
          {title}
        </h1>
        {lead && (
          <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-slate-500">{lead}</p>
        )}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
};
