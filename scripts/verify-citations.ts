/**
 * Citation integrity check.
 *
 * Reads LANDMARK_LITERATURE, asks NCBI E-utilities what each PMID actually is,
 * and fails when the stored title does not match the PubMed record. This exists
 * because the dataset once shipped six plausible-looking citations of which five
 * pointed at unrelated papers.
 *
 *   npx tsx scripts/verify-citations.ts
 */

import { LANDMARK_LITERATURE } from '../src/data/scientific-data';

const EUTILS = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi';
const TOOL = 'tool=AllergoScope&email=science@allergoscope.local';

const normalise = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9 ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

// Token-set overlap (Jaccard). Cheap and good enough to catch a wrong paper.
function similarity(a: string, b: string): number {
  const A = new Set(normalise(a).split(' ').filter(Boolean));
  const B = new Set(normalise(b).split(' ').filter(Boolean));
  if (A.size === 0 || B.size === 0) return 0;
  let shared = 0;
  for (const t of A) if (B.has(t)) shared += 1;
  return shared / (A.size + B.size - shared);
}

async function main() {
  const ids = LANDMARK_LITERATURE.map((item) => item.pmid);
  const url = `${EUTILS}?db=pubmed&retmode=json&id=${ids.join(',')}&${TOOL}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`E-utilities returned HTTP ${res.status}`);
  const data: any = await res.json();

  const failures: string[] = [];
  const warnings: string[] = [];

  for (const item of LANDMARK_LITERATURE) {
    const record = data?.result?.[item.pmid];

    if (!record || record.error) {
      failures.push(`PMID ${item.pmid} does not resolve (${item.title})`);
      continue;
    }

    const score = similarity(item.title, record.title ?? '');
    const doi =
      (record.articleids ?? []).find((id: any) => id.idtype === 'doi')?.value ?? null;

    if (score < 0.75) {
      failures.push(
        `PMID ${item.pmid} title mismatch (${score.toFixed(2)})\n    stored: ${item.title}\n    pubmed: ${record.title}`,
      );
      continue;
    }

    if (item.doi && doi && normalise(item.doi) !== normalise(doi)) {
      warnings.push(`PMID ${item.pmid} DOI differs: stored ${item.doi}, pubmed ${doi}`);
    }

    const year = String(item.year);
    if (record.pubdate && !String(record.pubdate).includes(year)) {
      warnings.push(`PMID ${item.pmid} year differs: stored ${year}, pubmed ${record.pubdate}`);
    }

    console.log(`ok   ${item.pmid}  ${score.toFixed(2)}  ${record.source} ${record.pubdate}`);
  }

  for (const warning of warnings) console.warn(`warn ${warning}`);
  for (const failure of failures) console.error(`FAIL ${failure}`);

  console.log(`\n${LANDMARK_LITERATURE.length} citations checked, ${failures.length} failed.`);
  if (failures.length > 0) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
