# MASTER_PLAN — AllergoScope

Living plan for the project. Checkboxes are the source of truth for what is done; decisions are
recorded with their reasoning so a later session does not re-litigate them.

**Live:** https://jpalmer95.github.io/allergoscope/ · **Repo:** github.com/Jpalmer95/allergoscope
**License:** Apache-2.0 · **Stack:** React 19 + Vite 8 + Tailwind 4, static build on GitHub Pages,
optional Express server for local/self-host.

## Thesis

1. Latex-fruit syndrome (LFS) is a well-characterised adult-acquired food allergy, mediated by
   class I chitinases carrying the 43-aa hevein domain.
2. Adult-onset food allergy is common (≈48% of food-allergic US adults) and under-explained.
3. Post-harvest handling changes plant defence-protein expression — ethylene treatment is
   *proven* to induce class I chitinases in at least one food plant.
4. **Untested:** whether modern post-harvest regimes (1-MCP, strobilurin dips, wax coatings)
   shift chitinase dose per bite in banana/avocado in either direction, and whether any such
   shift is large enough to matter epidemiologically.
5. Point 4 is the project. Everything else is scaffolding to make point 4 askable and eventually
   answerable.

## Current state (2026-11-01)

- [x] Recover the AI-Studio export into a buildable repo (`npm install` fixed: esbuild peer bumped
      to ^0.28 for Vite 8).
- [x] Six working views: mechanisms, agrochemicals, chronography, reversal, literature, hypothesis.
- [x] **Citations audited.** 5 of 6 original PMIDs resolved to unrelated papers; replaced with 14
      verified records (PMID + DOI checked against E-utilities).
- [x] Remove fabricated numbers presented as measurements ("92% survives gastric fluid",
      "78.5% identity", "300-800% chitinase induction") and replace with evidence-status language.
- [x] Provenance layer: Cited / Modelled / Hypothesis labels, expandable panel, footer disclaimer.
- [x] Static hosting: PubMed via direct E-utilities with proxy fallback; hypothesis synthesis via a
      shared rule engine instead of a server-only route.
- [x] Public repo + GitHub Pages deploy on push to `main`.

## Decisions

- **Static hosting over a server.** GitHub Pages is free, permanent and needs no VPS slot. NCBI and
  PubChem both allow browser CORS, so the two live features keep working without a backend.
- **Rule engine, not an LLM, for the public default.** An LLM can invent a PMID; a deterministic
  template over a curated dataset cannot. A Gemini key still layers on top locally, with a prompt
  that forbids inventing citations and forbids asserting a 1-MCP direction.
- **Label modelled data rather than delete it.** The chronographical widget's value is showing how a
  lagged correlation behaves; deleting it loses the method demo. Keeping it unlabelled would be
  misinformation. So: keep, label, and plan to back it with real series.
- **No claim of causation anywhere.** The site's most defensible output is a list of experiments.

## Roadmap

### Phase 1 — trust (short term)
- [ ] Move all remaining hardcoded claims in components into `scientific-data.ts` with evidence
      status fields, so no prose cites without a record.
- [ ] Add a citation-integrity test: a script that esummarises every PMID in the dataset and fails
      CI when the returned title does not match (`scripts/verify-citations.ts` + `npm run verify`).
- [ ] Add an in-app "corrections" page listing what changed and why (public research hygiene).

### Phase 2 — real data (the substance)
- [ ] Replace `CHRONOGRAPHICAL_DATA` with ingested series: FAOSTAT banana/avocado trade volume,
      USGS NAWQA and EFSA residue-monitoring summaries, Google Trends (manual export), and any
      accessible allergy-clinic or ED-visit counts.
- [ ] Model confounders explicitly: powdered-latex-glove withdrawal after 1992–2000, pollen
      exposure, hygiene/urbanisation indices, diagnostic-coding drift.
- [ ] Publish the analysis notebook next to the app so the r values are reproducible.

### Phase 3 — community hypotheses
- [ ] Structured hypothesis intake (GitHub issue form) with a fixed schema: observation,
      exposure, food, timeline, symptom class, what would falsify it.
- [ ] Per-hypothesis permalink pages with status: open / supported / contradicted / untestable.
- [ ] Moderation policy: no medical advice, no personal identifiers, no product promotion.
- [ ] Provenance-stamped voting so "20 people report this" never reads as evidence.

### Phase 4 — reach
- [ ] Patient-facing one-pager: what LFS is, what to ask an allergist (component-resolved
      diagnostics), what this project does not claim.
- [ ] Clinician/researcher one-pager: the four open questions and the cheapest experiment for each.
- [ ] Custom domain if traction justifies it.

## Open questions (the actual science)

1. Does 1-MCP change class I chitinase content in banana/avocado pulp? (Cheapest decisive test.)
2. Do dietary-relevant fungicide concentrations impair gut barrier integrity in vitro?
3. Do import volumes lead clinic case series by 1–3 years, after confounder adjustment?
4. How much of the LFS signal is explained by latex-glove exposure history alone?
