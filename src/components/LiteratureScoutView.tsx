import React, { useState, useEffect } from 'react';
import {
  LANDMARK_LITERATURE,
} from '../data/scientific-data';
import { searchPubMed } from '../utils/pubmed';
import {
  Search,
  BookOpen,
  ExternalLink,
  Loader2,
  Bookmark,
  Layers,
  Sparkles,
  Info,
  Calendar,
  Tag
} from 'lucide-react';

interface Props {
  initialSearchQuery?: string;
}

export const LiteratureScoutView: React.FC<Props> = ({ initialSearchQuery = '' }) => {
  const [searchTerm, setSearchTerm] = useState<string>(initialSearchQuery || 'latex fruit syndrome chitinase');
  const [liveResults, setLiveResults] = useState<any[]>([]);
  const [transport, setTransport] = useState<'proxy' | 'ncbi-direct' | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchError, setSearchError] = useState<string | null>(null);

  const quickSearches = [
    { label: 'Latex-Fruit Chitinases', query: 'latex fruit syndrome chitinase' },
    { label: 'Mus a 2 Banana Digestion', query: 'banana chitinase gastric pepsin' },
    { label: 'Pers a 1 Avocado Mucosa', query: 'pers a 1 avocado oral allergy' },
    { label: 'Epithelial Barrier Hypothesis', query: 'epithelial barrier hypothesis akdis' },
    { label: '1-MCP Chitinase Stress', query: '1-methylcyclopropene chitinase stress' },
    { label: 'Omalizumab OUtMATCH', query: 'omalizumab outmatch food allergy trial' },
  ];

  const handleSearchPubMed = async (queryToRun: string) => {
    if (!queryToRun.trim()) return;
    setIsLoading(true);
    setSearchError(null);

    try {
      const { results, via } = await searchPubMed(queryToRun, 6);
      setLiveResults(results);
      setTransport(via);
      if (results.length === 0) {
        setSearchError('NCBI returned no records for that query. Showing the curated landmark set below.');
      }
    } catch (err: any) {
      console.warn('PubMed proxy error:', err);
      setSearchError(err.message || 'PubMed API error. Viewing curated landmark studies.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialSearchQuery) {
      setSearchTerm(initialSearchQuery);
      handleSearchPubMed(initialSearchQuery);
    }
  }, [initialSearchQuery]);

  const filteredLandmark =
    activeCategory === 'all'
      ? LANDMARK_LITERATURE
      : LANDMARK_LITERATURE.filter((item) => item.category === activeCategory);

  return (
    <div className="space-y-6">
      {/* Search Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 mb-2">
              <BookOpen className="w-3.5 h-3.5 mr-1" />
              NCBI PubMed & Europe PMC Biomedical Literature Scout
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Peer-Reviewed Literature, Clinical Trials & Mechanistic Citations
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl">
              Query the world&apos;s authoritative biomedical repository directly via NCBI E-utilities. Verify clinical trials on food allergy reversal, chitinase enzyme thermodynamics, and toxicological barrier studies.
            </p>
          </div>
        </div>

        {/* Live Search Input Form */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearchPubMed(searchTerm);
            }}
            className="flex flex-col sm:flex-row gap-2"
          >
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search PubMed (e.g., 'mus a 2 gastric', 'hevein cross reactivity', 'azoxystrobin barrier')..."
                className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg flex items-center justify-center transition-colors disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Querying NCBI...
                </>
              ) : (
                'Search Live PubMed'
              )}
            </button>
          </form>

          {/* Quick-Search Topic Chips */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-medium mr-1 flex items-center">
              <Sparkles className="w-3 h-3 mr-1 text-amber-500" /> Suggested Topics:
            </span>
            {quickSearches.map((qs, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSearchTerm(qs.query);
                  handleSearchPubMed(qs.query);
                }}
                className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 rounded-md transition-colors"
              >
                {qs.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Live PubMed Query Results Pane (if available) */}
      {liveResults.length > 0 && (
        <div className="bg-blue-50/40 border border-blue-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-blue-950 flex items-center">
              <Search className="w-4 h-4 mr-1.5 text-blue-600" />
              Live NCBI PubMed Search Results for &quot;{searchTerm}&quot;
            </h3>
            <span className="text-xs font-mono font-bold text-blue-700 bg-white px-2 py-0.5 rounded border border-blue-200">
              {liveResults.length} Articles Retrieved
              {transport && (
                <span className="ml-2 text-[10px] font-normal text-slate-500">
                  via {transport === 'proxy' ? 'server proxy' : 'NCBI E-utilities (direct)'}
                </span>
              )}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {liveResults.map((art) => (
              <div key={art.pmid} className="bg-white p-4 rounded-xl border border-blue-200/80 shadow-xs space-y-2">
                <div className="flex items-start justify-between text-xs text-slate-500">
                  <span className="font-mono font-semibold text-blue-700">PMID: {art.pmid}</span>
                  <span>{art.pubdate}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                  {art.title}
                </h4>
                <div className="text-xs text-slate-600 truncate">
                  Authors: {art.authors?.join(', ') || 'N/A'}
                </div>
                <div className="text-xs font-semibold text-slate-700 italic">
                  {art.source}
                </div>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  {art.doi && (
                    <span className="font-mono text-[11px] text-slate-500 truncate max-w-[200px]">
                      DOI: {art.doi}
                    </span>
                  )}
                  <a
                    href={art.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    View on PubMed <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {searchError && (
        <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-lg flex items-center">
          <Info className="w-4 h-4 mr-2 shrink-0" />
          <span>{searchError}</span>
        </div>
      )}

      {/* Curated Landmark Peer-Reviewed Studies */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center">
              <Bookmark className="w-5 h-5 mr-2 text-indigo-600" />
              Landmark Foundations & Key Primary Literature
            </h3>
            <p className="text-xs text-slate-500">
              Curated pivotal studies. Each PMID and DOI was verified against NCBI E-utilities; every card links to the actual record.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1.5">
            {['all', 'Latex-Fruit Syndrome', 'Epithelial Barrier Hypothesis', 'Agrochemical Adjuvants', 'Allergy Reversal Therapies'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors ${
                  activeCategory === cat
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat === 'all' ? 'All Curated Papers' : cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredLandmark.map((paper) => (
            <div
              key={paper.pmid}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3 hover:border-blue-300 transition-all"
            >
              <div className="flex items-start justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  {paper.category}
                </span>
                <span className="text-xs font-mono font-bold text-slate-500">
                  PMID: {paper.pmid}
                </span>
              </div>

              <h4 className="text-sm font-bold text-slate-900 leading-snug">
                {paper.title}
              </h4>

              <div className="text-xs text-slate-600 flex items-center space-x-2">
                <span>{paper.authors.slice(0, 3).join(', ')}{paper.authors.length > 3 ? ' et al.' : ''}</span>
                <span>•</span>
                <span className="font-semibold text-slate-800">{paper.journal} ({paper.year})</span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200/80">
                &quot;{paper.abstractSnippet}&quot;
              </p>

              {/* MeSH Terms */}
              <div className="flex flex-wrap gap-1">
                {paper.meshTerms.map((mesh, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded font-mono"
                  >
                    #{mesh}
                  </span>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono text-[11px]">
                  DOI: {paper.doi}
                </span>
                <a
                  href={`https://pubmed.ncbi.nlm.nih.gov/${paper.pmid}/`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold"
                >
                  Read on PubMed <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
