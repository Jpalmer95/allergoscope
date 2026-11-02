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

            {/* Stylized SVG Map of Key Regions */}
            <div className="relative bg-slate-900 rounded-xl p-4 text-white overflow-hidden min-h-[260px] flex items-center justify-center">
              <svg viewBox="0 0 500 280" className="w-full h-auto max-h-[240px]">
                {/* Landmass outlines - Americas & Europe conceptual geometry */}
                <path
                  d="M 60,40 Q 120,30 180,60 Q 220,90 200,130 Q 160,140 130,130 Q 80,110 60,40 Z"
                  fill="#1E293B"
                  stroke="#334155"
                  strokeWidth="1.5"
                />
                <text x="120" y="80" fill="#94A3B8" fontSize="10" fontWeight="bold">
                  NORTH AMERICA
                </text>

                {/* Central America & Mexico Isthmus */}
                <path
                  d="M 130,130 Q 140,160 160,180 Q 170,170 150,140 Z"
                  fill="#1E293B"
                  stroke="#334155"
                  strokeWidth="1.5"
                />

                {/* South America */}
                <path
                  d="M 160,180 Q 220,190 240,230 Q 220,270 180,270 Q 150,230 160,180 Z"
                  fill="#1E293B"
                  stroke="#334155"
                  strokeWidth="1.5"
                />

                {/* Europe */}
                <path
                  d="M 330,50 Q 400,40 420,90 Q 380,120 340,110 Q 320,80 330,50 Z"
                  fill="#1E293B"
                  stroke="#334155"
                  strokeWidth="1.5"
                />
                <text x="350" y="80" fill="#94A3B8" fontSize="10" fontWeight="bold">
                  EUROPE
                </text>

                {/* Interactive Region 1: Central America Banana Belt */}
                <g
                  className="cursor-pointer transition-transform hover:scale-110"
                  onClick={() => setSelectedRegion('Central America (Banana Belt)')}
                >
                  <circle cx="150" cy="165" r="9" fill="#EAB308" opacity="0.8" />
                  <circle cx="150" cy="165" r="14" fill="#EAB308" opacity="0.3" className="animate-ping" />
                  <text x="165" y="168" fill="#FDE047" fontSize="9" fontWeight="bold">
                    Banana Belt (Cavendish monoculture)
                  </text>
                </g>

                {/* Interactive Region 2: Mexico Avocado Corridor (Michoacán) */}
                <g
                  className="cursor-pointer transition-transform hover:scale-110"
                  onClick={() => setSelectedRegion('Mexico (Avocado Corridor)')}
                >
                  <circle cx="125" cy="140" r="9" fill="#10B981" opacity="0.8" />
                  <circle cx="125" cy="140" r="14" fill="#10B981" opacity="0.3" className="animate-ping" />
                  <text x="65" y="155" fill="#6EE7B7" fontSize="9" fontWeight="bold">
                    Michoacán (Avocado Corridor)
                  </text>
                </g>

                {/* Interactive Region 3: United States Domestic Consumption */}
                <g
                  className="cursor-pointer transition-transform hover:scale-110"
                  onClick={() => setSelectedRegion('United States')}
                >
                  <circle cx="150" cy="95" r="9" fill="#3B82F6" opacity="0.8" />
                  <text x="165" y="98" fill="#93C5FD" fontSize="9" fontWeight="bold">
                    USA (Latex & Food Allergy Surges)
                  </text>
                </g>

                {/* Interactive Region 4: European Union Import Inspection */}
                <g
                  className="cursor-pointer transition-transform hover:scale-110"
                  onClick={() => setSelectedRegion('European Union')}
                >
                  <circle cx="365" cy="90" r="8" fill="#8B5CF6" opacity="0.8" />
                  <text x="380" y="94" fill="#C4B5FD" fontSize="9" fontWeight="bold">
                    EU (MRL Regulation)
                  </text>
                </g>

                {/* Trade Flow Arrows */}
                <path
                  d="M 150,165 Q 160,130 150,105"
                  fill="none"
                  stroke="#EAB308"
                  strokeWidth="2"
                  strokeDasharray="4 2"
                />
                <path
                  d="M 125,140 Q 135,115 145,100"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="2"
                  strokeDasharray="4 2"
                />
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
                  <span className="w-3 h-1 bg-blue-600 rounded mr-1.5"></span>
                  <span className="text-slate-700 font-medium">Agrochemical Adoption (modelled index)</span>
                </span>
                <span className="flex items-center">
                  <span className="w-3 h-1 bg-rose-500 rounded mr-1.5"></span>
                  <span className="text-slate-700 font-medium">Allergy Search / Clinical Index (modelled)</span>
                </span>
              </div>
            </div>

            {/* Interactive SVG Chart */}
            <div className="relative border border-slate-200 rounded-lg p-2 bg-slate-50/50">
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
                        stroke="#E2E8F0"
                        strokeDasharray="3 3"
                      />
                      <text
                        x={padding.left - 8}
                        y={y + 3}
                        fontSize="9"
                        fill="#94A3B8"
                        textAnchor="end"
                        fontFamily="monospace"
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
                      fontSize="10"
                      fill="#64748B"
                      textAnchor="middle"
                      fontFamily="monospace"
                    >
                      {yr}
                    </text>
                  );
                })}

                {/* Series 1: Agrochemical Intensity (Blue) */}
                <path
                  d={chemicalPath}
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Series 2: Allergic Symptoms / Google Trends (Rose/Red) */}
                <path
                  d={searchPath}
                  fill="none"
                  stroke="#F43F5E"
                  strokeWidth="2.5"
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

      {/* Historical Chronographical Milestone Card for Selected Year */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white rounded-xl p-6 shadow-md border border-slate-800">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-3">
          <div className="flex items-center space-x-3">
            <span className="text-2xl font-black text-amber-400 font-mono">
              {currentMilestone.year}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/10 text-slate-200 border border-white/20">
              {currentMilestone.region}
            </span>
          </div>

          <div className="flex items-center space-x-4 text-xs font-mono">
            <div>
              <span className="text-slate-400">Agrochemical Usage Index (modelled): </span>
              <span className="font-bold text-blue-400">{currentMilestone.agrochemicalUsageIndex}/100</span>
            </div>
            <div>
              <span className="text-slate-400">Allergy Search Volume Index (modelled): </span>
              <span className="font-bold text-rose-400">{currentMilestone.googleSearchIndex}/100</span>
            </div>
          </div>
        </div>

        <h4 className="text-base sm:text-lg font-bold text-white mb-2">
          {currentMilestone.historicalMilestone}
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 pt-3 border-t border-slate-800 text-xs text-slate-300">
          <div>
            <strong className="text-slate-100">Dominant Farming / Chemical Regime:</strong> {currentMilestone.keyPesticideDominance}
          </div>
          <div>
            <strong className="text-slate-100">Cold Chain & Storage Technology:</strong> {currentMilestone.postHarvestTech}
          </div>
        </div>

        <div className="mt-4 pt-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <button
            onClick={() => onSearchLiterature(`${currentMilestone.keyPesticideDominance} allergy`)}
            className="inline-flex items-center text-blue-300 hover:text-blue-100 font-medium"
          >
            Search PubMed for {currentMilestone.year} Agricultural Shifts <ExternalLink className="w-3.5 h-3.5 ml-1" />
          </button>

          {onNavigateToHypothesis && (
            <button
              onClick={onNavigateToHypothesis}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium flex items-center transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Test This Correlation in Hypothesis Studio
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
