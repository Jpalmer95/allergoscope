# Contributing

This is an open research notebook, not a product. The best contributions make a claim *more*
precise or *easier* to test.

## Most valuable (in order)

1. **A citation that is wrong.** Wrong PMID, wrong DOI, right paper but wrong claim attached. Open
   an issue with the PMID and what the abstract actually says.
2. **A claim that is overstated.** Point at the sentence and say what the evidence supports instead.
3. **A measurement that would settle an open question** — especially anything on class I chitinase
   content in 1-MCP-treated or fungicide-treated banana/avocado.
4. **Real data** to replace a modelled series: FAOSTAT trade volumes, residue-monitoring summaries
   (USDA PDP, EFSA), clinic case counts, search-trend exports.
5. **Code**: the six views, the maths in `src/utils/allergy-math.ts`, accessibility, mobile layout.

## How to add a citation

```ts
// src/data/scientific-data.ts → LANDMARK_LITERATURE
{
  pmid: '10069887',              // must resolve on pubmed.ncbi.nlm.nih.gov
  doi: '10.1016/s0091-6749(99)70478-1',
  title: '...',                  // must match the PubMed record
  authors: ['Blanco C', ...],
  journal: 'Journal of Allergy and Clinical Immunology',
  year: 1999,
  category: 'Latex-Fruit Syndrome',
  abstractSnippet: '...',        // paraphrase what the abstract actually found
  meshTerms: ['...'],
}
```

Then check it:

```bash
node -e "fetch('https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&retmode=json&id=10069887').then(r=>r.json()).then(d=>console.log(d.result['10069887'].title))"
```

If the title does not match, do not ship it.

## Personal symptom observations

Welcome, with rules:

- Describe patterns, not identities: age band, foods, timing, symptom class, exposure context.
- **No medical advice requests and no dosing advice.** Nobody here will tell you whether to eat
  something.
- Reports are anecdote. They can generate a hypothesis; they can never confirm one.
- If you are in a reaction right now: epinephrine, then emergency services.

## Pull requests

- Branch from `main`, keep the diff scoped, run `npm run lint && npm test && npm run build`.
- Provenance label required for any new datum (`src/data/provenance.ts`).
- Disclaimers stay. If a change makes a health claim more confident, it needs a citation or it
  does not merge.

## License

Contributions are accepted under Apache-2.0.
