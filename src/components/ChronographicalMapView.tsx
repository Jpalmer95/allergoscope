import React, { useState, useEffect, useMemo } from 'react';
import {
  CHRONOGRAPHICAL_DATA,
  type ChronographicalYearData,
} from '../data/scientific-data';
import { calculateLaggedCorrelation } from '../utils/allergy-math';
import { PageHeader } from './Chrome';
import {
  Play,
  Pause,
  RotateCcw,
  Sliders,
  TrendingUp,
  MapPin,
  Calendar,
  Layers,
  Info,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface Props {
  onSearchLiterature: (query: string) => void;
  onNavigateToHypothesis?: () => void;
}

export const ChronographicalMapView: React.FC<Props> = ({
  onSearchLiterature,
  onNavigateToHypothesis,
}) => {
  const [selectedYear, setSelectedYear] = useState<number>(2012);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [lagYears, setLagYears] = useState<number>(3); // 1-5 year delay
  const [selectedRegion, setSelectedRegion] = useState<string>('All Regions');

  // Available regions
  const regions = [
    'All Regions',
    'United States',
    'Mexico (Avocado Corridor)',
    'Central America (Banana Belt)',
    'European Union',
  ];

  // Playback loop for timeline
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setSelectedYear((prev) => {
          if (prev >= 2026) {
            setIsPlaying(false);
            return 2026;
          }
          return prev + 1;
        });
      }, 1200);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  // Extract timeseries for correlation
  const { chemicalSeries, searchSeries, correlationResult } = useMemo(() => {
    const years = CHRONOGRAPHICAL_DATA.map((d) => d.year);
    const chemData = CHRONOGRAPHICAL_DATA.map((d) => d.agrochemicalUsageIndex);
    const searchData = CHRONOGRAPHICAL_DATA.map((d) => d.googleSearchIndex);

    const corr = calculateLaggedCorrelation(chemData, searchData, lagYears);

    return {
      years,
      chemicalSeries: chemData,
      searchSeries: searchData,
      correlationResult: corr,
    };
  }, [lagYears]);

  // Current year milestone
  const currentMilestone =
    CHRONOGRAPHICAL_DATA.find((d) => d.year === selectedYear) ||
    CHRONOGRAPHICAL_DATA[CHRONOGRAPHICAL_DATA.length - 1];

  // Chart dimensions
  const chartHeight = 220;
  const chartWidth = 720;
  const padding = { top: 20, right: 30, bottom: 40, left: 45 };

  // Generate SVG path for series
  const generatePath = (data: number[], offsetShift = 0) => {
    const n = data.length;
    const xStep = (chartWidth - padding.left - padding.right) / (n - 1);

    const points = data.map((val, idx) => {
      // Offset x for lag if needed
      const effectiveIdx = idx;
      const x = padding.left + effectiveIdx * xStep;
      // val is 0-100
      const y = chartHeight - padding.bottom - (val / 100) * (chartHeight - padding.top - padding.bottom);
      return `${x},${y}`;
    });

    return `M ${points.join(' L ')}`;
  };

  const chemicalPath = generatePath(chemicalSeries);
  const searchPath = generatePath(searchSeries);

  // Selected year index and x coordinate
  const selectedIndex = CHRONOGRAPHICAL_DATA.findIndex((d) => d.year === selectedYear);
  const selectedX =
    selectedIndex >= 0
      ? padding.left + (selectedIndex / (CHRONOGRAPHICAL_DATA.length - 1)) * (chartWidth - padding.left - padding.right)
      : padding.left;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Chronography · illustrative data"
        tone="indigo"
        icon={<TrendingUp className="h-3 w-3" />}
        title="Do agricultural shifts lead allergic disease by one to five years?"
        lead="Modern farming transitions — 1-MCP ripening retardation, systemic strobilurins, wax coatings, NAFTA trade corridors — mapped against lagged allergic-disease signals. The series here are hand-curated example values; use the slider to see how a lagged correlation behaves, then substitute real trade, residue and clinic data."
      />

      {/* Lag control + readout */}
      <div className="card mb-6 overflow-hidden">
        <div className="grid gap-px bg-[var(--line)] sm:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
          <div className="bg-white p-5">
            <div className="flex items-center justify-between">
              <span className="eyebrow flex items-center gap-1.5">
                <Sliders className="h-3 w-3" /> Lag window
              </span>
              <span className="num rounded-md border border-indigo-200 bg-indigo-50 px-2 py-0.5 font-mono text-[12px] font-bold text-indigo-700">
                +{lagYears} yr
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={5}
              step={1}
              value={lagYears}
              aria-label="Lag window in years"
              onChange={(e) => setLagYears(Number(e.target.value))}
              className="mt-3 h-1.5 w-full cursor-pointer rounded-full bg-slate-200 accent-indigo-600"
            />
            <div className="num mt-1.5 flex justify-between font-mono text-[9.5px] text-slate-400">
              {[0, 1, 2, 3, 4, 5].map((y) => (
                <span key={y}>{y}</span>
              ))}
            </div>
          </div>

          <div className="bg-white p-5">
            <div className="flex items-baseline gap-2">
              <span className="eyebrow">Pearson r · illustrative</span>
              <span
                className={`num ml-auto rounded-md px-2 py-0.5 font-mono text-[15px] font-bold ${
                  correlationResult.r >= 0.8
                    ? 'bg-emerald-50 text-emerald-700'
                    : correlationResult.r >= 0.5
                      ? 'bg-blue-50 text-blue-700'
                      : 'bg-amber-50 text-amber-700'
                }`}
              >
                {correlationResult.r.toFixed(3)}
              </span>
            </div>
            <p className="mt-1.5 text-[11.5px] leading-relaxed text-slate-500">
              {correlationResult.description} (N = {correlationResult.sampleSize} annual observations).
            </p>
            <p className="mt-1 text-[10.5px] leading-relaxed text-amber-700">
              Computed on hand-set example indices — this demonstrates the method, not an
              epidemiological finding.
            </p>
          </div>
        </div>
      </div>

      {/* Dual Interactive Canvas: Global Agricultural Corridor Map & Chronographical Dual Graph */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Geographic Map View (5 cols) */}
        <div className="lg:col-span-5 card p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center">
                <MapPin className="w-4 h-4 mr-1 text-red-500" />
                Global Agricultural Export Corridors & Consumption Epicenters
              </h3>
              <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                Year: {selectedYear}
              </span>
            </div>

            {/* Corridor schematic */}
            <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0b1020] p-3 text-white">
              <svg viewBox="0 0 500 300" className="h-auto w-full" role="img" aria-label="Agricultural export corridors feeding United States and European Union consumption markets">
                <defs>
                  <linearGradient id="corridorA" x1="0" y1="1" x2="1" y2="0">
                    <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.85" />
                  </linearGradient>
                  <linearGradient id="corridorB" x1="0" y1="1" x2="1" y2="0">
                    <stop offset="0%" stopColor="#34d399" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#34d399" stopOpacity="0.85" />
                  </linearGradient>
                  <radialGradient id="nodeGlow">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* graticule */}
                {[60, 120, 180, 240].map((y) => (
                  <line key={`h${y}`} x1="16" y1={y} x2="484" y2={y} stroke="#ffffff" strokeOpacity="0.04" />
                ))}
                {[100, 200, 300, 400].map((x) => (
                  <line key={`v${x}`} x1={x} y1="16" x2={x} y2="284" stroke="#ffffff" strokeOpacity="0.04" />
                ))}

                {/* abstract landmasses */}
                <g fill="#ffffff" fillOpacity="0.055" stroke="#ffffff" strokeOpacity="0.1" strokeWidth="1">
                  <path d="M96 62c34-18 92-16 118 6 20 17 10 40-16 46-30 7-58 2-78-12-16-11-32-30-24-40Z" />
                  <path d="M150 128c14 4 24 16 22 30-2 18-14 34-26 44-10 9-20 4-20-10 1-22 8-44 14-58 3-8 6-8 10-6Z" />
                  <path d="M214 156c30 2 52 26 54 54 2 26-18 52-42 54-22 2-38-22-38-50 0-28 6-56 26-58Z" />
                  <path d="M330 52c30-8 66-2 78 18 10 17-2 38-26 44-26 7-54 2-66-14-11-15-4-42 14-48Z" />
                  <path d="M362 132c16-4 30 4 32 18 2 12-10 22-26 22-16 0-28-8-28-20 0-10 8-18 22-20Z" />
                </g>

                {/* corridors */}
                <path d="M172 176C168 150 158 122 152 106" fill="none" stroke="url(#corridorA)" strokeWidth="1.6" strokeDasharray="5 4" />
                <path d="M250 196C232 176 206 156 186 146" fill="none" stroke="url(#corridorB)" strokeWidth="1.6" strokeDasharray="5 4" />
                <path d="M176 78C240 54 300 62 344 84" fill="none" stroke="#7f8cff" strokeWidth="1.2" strokeOpacity="0.45" strokeDasharray="3 5" />

                {/* nodes */}
                {[
                  { x: 176, y: 78, label: 'USA', sub: 'consumption', color: '#7f8cff', region: 'United States' },
                  { x: 344, y: 84, label: 'EU', sub: 'MRL regime', color: '#a78bfa', region: 'European Union' },
                  { x: 172, y: 176, label: 'Banana belt', sub: 'CA / EC / CO', color: '#fbbf24', region: 'Central America (Banana Belt)' },
                  { x: 250, y: 196, label: 'Michoacán', sub: 'avocado', color: '#34d399', region: 'Mexico (Avocado Corridor)' },
                ].map((n) => {
                  const isActive = selectedRegion === n.region;
                  return (
                    <g
                      key={n.label}
                      className="cursor-pointer"
                      onClick={() => setSelectedRegion(n.region)}
                      role="button"
                      aria-label={`Select ${n.label}`}
                    >
                      <circle cx={n.x} cy={n.y} r={isActive ? 17 : 13} fill="url(#nodeGlow)" opacity={isActive ? 0.9 : 0.5} />
                      <circle cx={n.x} cy={n.y} r={isActive ? 5.5 : 4} fill={n.color} stroke="#0b1020" strokeWidth="1.5" />
                      <text x={n.x + 12} y={n.y - 3} fill="#e8ecf7" fontSize="9.5" fontWeight="600">
                        {n.label}
                      </text>
                      <text x={n.x + 12} y={n.y + 8} fill="#7d879e" fontSize="8" fontFamily="var(--font-mono)">
                        {n.sub}
                      </text>
                    </g>
                  );
                })}

                <text x="18" y="292" fill="#5b6480" fontSize="8" fontFamily="var(--font-mono)">
                  schematic, not to scale
                </text>
              </svg>
            </div>
          </div>

          {/* Selected Region Summary */}
          <div className="mt-4 p-3 card-sunk text-xs">
            <div className="flex items-center justify-between font-bold text-slate-800">
              <span>Selected Corridor: {selectedRegion}</span>
              <span className="text-blue-600 font-mono">Status @ {selectedYear}</span>
            </div>
            <p className="text-slate-600 mt-1 leading-relaxed">
              {selectedRegion === 'Mexico (Avocado Corridor)'
                ? 'Michoacán & Jalisco export zones underwent dramatic modernization following the 1997 NAFTA transition, deploying 1-MCP gas chambers, thiabendazole/morpholine gloss waxes, and post-harvest antifungal baths to enable 3,000-mile refrigerated transit.'
                : selectedRegion === 'Central America (Banana Belt)'
                ? 'Costa Rica, Ecuador, and Colombia maintain intensive weekly aerial spraying regimes for Black Sigatoka, paired with packing plant crown treatments (TBZ and azoxystrobin) to prevent transit crown rot.'
                : selectedRegion === 'European Union'
                ? 'European Food Safety Authority (EFSA) maintains lower MRLs and banned POEA surfactant adjuvants in 2016, driving differing epidemiological curves compared to North America.'
                : 'United States represents the primary consumption market. Following the 1992 OSHA glove mandate, silent latex sensitization peaked, colliding in the 2000s-2010s with chemically treated fruit imports.'}
            </p>
          </div>
        </div>

        {/* Right Column: Interactive Dual Chronographical Graph & Scrubber (7 cols) */}
        <div className="lg:col-span-7 card p-5 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center">
                  <Layers className="w-4 h-4 mr-1.5 text-blue-600" />
                  Dual-Axis Chronographical Time Series (1990 - 2026)
                </h3>
                <p className="text-xs text-slate-500">
                  Comparing Chemical Practice Shift vs. Google Search / Clinical Allergy Surges
                </p>
              </div>

              {/* Legend */}
              <div className="flex items-center space-x-3 text-xs">
                <span className="flex items-center">
                  <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-blue-600"></span>
                  <span className="text-slate-700 font-medium">Agrochemical Adoption (modelled index)</span>
                </span>
                <span className="flex items-center">
                  <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-rose-500"></span>
                  <span className="text-slate-700 font-medium">Allergy Search / Clinical Index (modelled)</span>
                </span>
              </div>
            </div>

            {/* Interactive SVG Chart */}
            <div className="relative rounded-2xl border border-[var(--line)] bg-[var(--surface-sunk)] p-2">
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="w-full h-auto cursor-crosshair select-none"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  const ratio = (clickX - (padding.left / chartWidth) * rect.width) / (((chartWidth - padding.left - padding.right) / chartWidth) * rect.width);
                  const clampedRatio = Math.max(0, Math.min(1, ratio));
                  const newYear = Math.round(1990 + clampedRatio * (2026 - 1990));
                  setSelectedYear(newYear);
                }}
              >
                <defs>
                  <linearGradient id="chemArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4a4ee0" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="#4a4ee0" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="effectArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.16" />
                    <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Horizontal Gridlines */}
                {[0, 25, 50, 75, 100].map((level) => {
                  const y = chartHeight - padding.bottom - (level / 100) * (chartHeight - padding.top - padding.bottom);
                  return (
                    <g key={level}>
                      <line
                        x1={padding.left}
                        y1={y}
                        x2={chartWidth - padding.right}
                        y2={y}
                        className="grid-line"
                        strokeWidth="1"
                      />
                      <text
                        x={padding.left - 8}
                        y={y + 3}
                        className="axis-label"
                        textAnchor="end"
                      >
                        {level}
                      </text>
                    </g>
                  );
                })}

                {/* X-axis years */}
                {[1990, 1995, 2000, 2005, 2010, 2015, 2020, 2025].map((yr) => {
                  const idx = yr - 1990;
                  const x = padding.left + (idx / 36) * (chartWidth - padding.left - padding.right);
                  return (
                    <text
                      key={yr}
                      x={x}
                      y={chartHeight - 12}
                      className="axis-label"
                      fontSize="10"
                      textAnchor="middle"
                    >
                      {yr}
                    </text>
                  );
                })}

                {/* Series fills */}
                <path
                  d={`${chemicalPath} L ${padding.left + (chemicalSeries.length - 1) * ((chartWidth - padding.left - padding.right) / (chemicalSeries.length - 1))},${chartHeight - padding.bottom} L ${padding.left},${chartHeight - padding.bottom} Z`}
                  fill="url(#chemArea)"
                />
                <path
                  d={`${searchPath} L ${padding.left + (searchSeries.length - 1) * ((chartWidth - padding.left - padding.right) / (searchSeries.length - 1))},${chartHeight - padding.bottom} L ${padding.left},${chartHeight - padding.bottom} Z`}
                  fill="url(#effectArea)"
                />

                {/* Series 1: Agrochemical Intensity (Blue) */}
                <path
                  d={chemicalPath}
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="2"
                  strokeLinecap="round"
                />

                {/* Series 2: Allergic Symptoms / Google Trends (Rose/Red) */}
                <path
                  d={searchPath}
                  fill="none"
                  stroke="#F43F5E"
                  strokeWidth="2"
                  strokeLinecap="round"
                />

                {/* Active Year Vertical Scrubber Cursor */}
                <line
                  x1={selectedX}
                  y1={padding.top}
                  x2={selectedX}
                  y2={chartHeight - padding.bottom}
                  stroke="#0F172A"
                  strokeWidth="1.5"
                  strokeDasharray="4 2"
                />
                <circle cx={selectedX} cy={chartHeight - padding.bottom} r="4" fill="#0F172A" />

                {/* Data point circles for selected year */}
                {selectedIndex >= 0 && (
                  <>
                    <circle
                      cx={selectedX}
                      cy={chartHeight - padding.bottom - (chemicalSeries[selectedIndex] / 100) * (chartHeight - padding.top - padding.bottom)}
                      r="5"
                      fill="#2563EB"
                      stroke="#FFFFFF"
                      strokeWidth="2"
                    />
                    <circle
                      cx={selectedX}
                      cy={chartHeight - padding.bottom - (searchSeries[selectedIndex] / 100) * (chartHeight - padding.top - padding.bottom)}
                      r="5"
                      fill="#F43F5E"
                      stroke="#FFFFFF"
                      strokeWidth="2"
                    />
                  </>
                )}
              </svg>
            </div>
          </div>

          {/* Interactive Timeline Controls & Playback */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors"
                title={isPlaying ? 'Pause Timeline' : 'Play Timeline (1990-2026)'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>
              <button
                onClick={() => {
                  setIsPlaying(false);
                  setSelectedYear(1990);
                }}
                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                title="Reset to 1990"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <div className="ml-2 font-mono font-bold text-lg text-slate-900">
                {selectedYear}
              </div>
            </div>

            {/* Slider */}
            <div className="flex-1 max-w-sm px-2">
              <input
                type="range"
                min={1990}
                max={2026}
                value={selectedYear}
                onChange={(e) => {
                  setIsPlaying(false);
                  setSelectedYear(Number(e.target.value));
                }}
                className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Selected-year milestone */}
      <div className="card relative overflow-hidden">
        <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-blue-500 to-indigo-600" />
        <div className="p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="num font-mono text-[26px] font-bold leading-none tracking-tight text-slate-900">
                {currentMilestone.year}
              </span>
              <span className="chip !cursor-default">{currentMilestone.region}</span>
            </div>
            <div className="num flex items-center gap-4 font-mono text-[10.5px] text-slate-500">
              <span>
                agrochemical index{' '}
                <b className="font-semibold text-blue-700">{currentMilestone.agrochemicalUsageIndex}</b>
              </span>
              <span>
                allergy index{' '}
                <b className="font-semibold text-rose-600">{currentMilestone.googleSearchIndex}</b>
              </span>
            </div>
          </div>

          <p className="mt-3 max-w-3xl text-[13.5px] font-medium leading-relaxed text-slate-800">
            {currentMilestone.historicalMilestone}
          </p>

          <div className="mt-4 grid gap-3 border-t border-[var(--line)] pt-4 sm:grid-cols-2">
            <div>
              <div className="eyebrow">Dominant chemical regime</div>
              <div className="mt-1 text-[11.5px] leading-relaxed text-slate-600">
                {currentMilestone.keyPesticideDominance}
              </div>
            </div>
            <div>
              <div className="eyebrow">Cold chain / storage</div>
              <div className="mt-1 text-[11.5px] leading-relaxed text-slate-600">
                {currentMilestone.postHarvestTech}
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--line)] pt-4">
            <button
              onClick={() => onSearchLiterature(`${currentMilestone.keyPesticideDominance} allergy`)}
              className="btn btn-ghost"
            >
              Search PubMed for this regime
              <ExternalLink className="h-3.5 w-3.5" />
            </button>

            {onNavigateToHypothesis && (
              <button onClick={onNavigateToHypothesis} className="btn btn-primary">
                <Sparkles className="h-3.5 w-3.5" />
                Test this correlation
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
