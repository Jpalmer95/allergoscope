# AGENTS.md — AllergoScope

Read `MASTER_PLAN.md` first. This repo is a public-facing health-research tool; correctness rules
beat feature rules every time.

## Hard rules

1. **Never add a citation you have not verified.** Check the PMID/DOI against NCBI E-utilities and
   confirm the returned title matches the claim. Hallucinated PMIDs were the original defect of this
   dataset (5 of 6 wrong) and are the fastest way to damage the project's credibility.
2. **Label provenance.** Every datum is `cited`, `modelled`, or `hypothesis`. If you add data to
   `src/data/`, add its provenance entry in `src/data/provenance.ts` and surface the label in the UI.
3. **No asserted direction where the literature is unsettled.** Ethylene induces class I chitinases
   (Sánchez-Monge 2000), so whether 1-MCP raises or lowers allergen load is open. State it as a
   predicition, never as a multiplier.
4. **Keep medical disclaimers intact** in the footer, the provenance banner and the Hypothesis
   Studio. Adding a health claim without a disclaimer is a bug.
5. **Never present modelled series as epidemiology.** `CHRONOGRAPHICAL_DATA` is illustrative until
   Phase 2 replaces it with ingested series.

## Stack & commands

- React 19 + Vite 8 + Tailwind 4, TypeScript strict-ish (`npm run lint` = `tsc --noEmit`).
- `npm run dev` — Express + Vite middleware on :3000 (works with `GEMINI_API_KEY` in `.env`).
- `npm run build` — static build to `dist/`; GitHub Pages workflow sets `GITHUB_PAGES=true`.
- `npm test` — `node --test` over `src/utils/*.test.ts`.
- Static hosting means no backend: browser calls to NCBI/PubChem are CORS-permitted. If you add a
  server-only endpoint, add a client fallback in `src/utils/` or the hosted site breaks silently.

## Architecture

```
src/data/scientific-data.ts   curated dataset (foods, agrochemicals, chronography, therapies, citations)
src/data/provenance.ts        evidence-status labels, disclaimers, open questions
src/utils/pubmed.ts           proxy-first, NCBI-direct-fallback search
src/utils/synthesis.ts        deterministic hypothesis brief (shared by server + static build)
src/utils/allergy-math.ts     lagged correlation, barrier score, cross-reactivity scoring
src/components/*View.tsx      six tab views
server.ts                     optional Express host: PubMed proxy, PubChem proxy, synthesis route
```

Keep data out of components. If a claim lives in JSX, it cannot be audited or labelled.

## Style

Plain, cautious scientific prose. No hype adjectives, no "revolutionary", no implied cure. Short
sentences. Explicit uncertainty is a feature.
