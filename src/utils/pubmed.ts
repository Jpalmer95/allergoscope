/**
 * PubMed access that works both on the Express server (dev / self-host) and as a
 * pure static build (GitHub Pages).
 *
 * Strategy: try the first-party proxy at /api/pubmed/search. If it is absent
 * (static hosting returns the SPA index.html or 404), fall back to NCBI
 * E-utilities directly from the browser - E-utilities sends
 * `Access-Control-Allow-Origin: *`, so this is a supported call pattern.
 */

export interface PubMedArticle {
  pmid: string;
  title: string;
  source: string;
  pubdate: string;
  authors: string[];
  doi: string | null;
  url: string;
}

const EUTILS = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils';
const TOOL_PARAMS = 'tool=AllergoScope&email=science@allergoscope.local';

async function fetchJson(url: string, init?: RequestInit, timeoutMs = 12000): Promise<any> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...init, signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    return JSON.parse(text);
  } finally {
    clearTimeout(timer);
  }
}

async function searchViaProxy(term: string, retmax: number): Promise<PubMedArticle[]> {
  const data = await fetchJson(
    `/api/pubmed/search?term=${encodeURIComponent(term)}&retmax=${retmax}`,
  );
  if (!Array.isArray(data?.results)) throw new Error('proxy returned no result array');
  return data.results as PubMedArticle[];
}

async function searchViaNcbi(term: string, retmax: number): Promise<PubMedArticle[]> {
  const search = await fetchJson(
    `${EUTILS}/esearch.fcgi?db=pubmed&term=${encodeURIComponent(term)}&sort=pub_date&retmode=json&retmax=${retmax}&${TOOL_PARAMS}`,
  );
  const idList: string[] = search?.esearchresult?.idlist ?? [];
  if (idList.length === 0) return [];

  const summary = await fetchJson(
    `${EUTILS}/esummary.fcgi?db=pubmed&id=${idList.join(',')}&retmode=json&${TOOL_PARAMS}`,
  );
  const uidResults = summary?.result ?? {};

  return idList
    .map((pmid) => {
      const item = uidResults[pmid];
      if (!item) return null;
      const doi =
        (item.articleids ?? []).find((id: any) => id.idtype === 'doi')?.value ?? null;
      return {
        pmid,
        title: item.title ?? '',
        source: item.source ?? '',
        pubdate: item.pubdate ?? '',
        authors: (item.authors ?? []).map((a: any) => a.name).slice(0, 6),
        doi,
        url: `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`,
      } as PubMedArticle;
    })
    .filter((a): a is PubMedArticle => a !== null);
}

export async function searchPubMed(
  term: string,
  retmax = 6,
): Promise<{ results: PubMedArticle[]; via: 'proxy' | 'ncbi-direct' }> {
  try {
    return { results: await searchViaProxy(term, retmax), via: 'proxy' };
  } catch {
    return { results: await searchViaNcbi(term, retmax), via: 'ncbi-direct' };
  }
}
