import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { buildSynthesis } from './src/utils/synthesis';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Google GenAI if key is present
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  aiClient = new GoogleGenAI({ apiKey });
}

// -----------------------------------------------------------------------------
// Scientific Literature & PubMed Proxy Route (NCBI E-Utilities)
// -----------------------------------------------------------------------------
app.get('/api/pubmed/search', async (req, res) => {
  try {
    const term = String(req.query.term || 'latex fruit syndrome chitinase');
    const retmax = Math.min(10, Math.max(1, Number(req.query.retmax || 6)));

    // Step 1: ESearch
    const searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(
      term
    )}&sort=pub_date&retmode=json&retmax=${retmax}&tool=AllergoScope&email=science@allergoscope.local`;

    const searchResponse = await fetch(searchUrl, {
      headers: { 'User-Agent': 'AllergoScope/1.0 (scientific research tool)' },
    });

    if (!searchResponse.ok) {
      return res.status(502).json({ error: 'Failed to contact NCBI PubMed E-utilities' });
    }

    const searchData = (await searchResponse.json()) as any;
    const idList: string[] = searchData?.esearchresult?.idlist || [];

    if (idList.length === 0) {
      return res.json({ total: 0, results: [] });
    }

    // Step 2: ESummary
    const summaryUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${idList.join(
      ','
    )}&retmode=json&tool=AllergoScope&email=science@allergoscope.local`;

    const summaryResponse = await fetch(summaryUrl);
    if (!summaryResponse.ok) {
      return res.status(502).json({ error: 'Failed to fetch article summaries' });
    }

    const summaryData = (await summaryResponse.json()) as any;
    const uidResults = summaryData?.result || {};

    const articles = idList
      .map((pmid) => {
        const item = uidResults[pmid];
        if (!item) return null;
        return {
          pmid,
          title: item.title,
          source: item.source,
          pubdate: item.pubdate,
          authors: (item.authors || []).map((a: any) => a.name).slice(0, 5),
          doi: (item.articleids || []).find((id: any) => id.idtype === 'doi')?.value || null,
          url: `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`,
        };
      })
      .filter(Boolean);

    res.json({ total: articles.length, results: articles });
  } catch (error: any) {
    console.error('PubMed search error:', error);
    res.status(500).json({ error: error.message || 'Internal error querying PubMed' });
  }
});

// -----------------------------------------------------------------------------
// PubChem Chemical Properties Proxy
// -----------------------------------------------------------------------------
app.get('/api/pubchem/:cid', async (req, res) => {
  try {
    const cid = req.params.cid;
    if (!/^\d+$/.test(cid)) {
      return res.status(400).json({ error: 'Invalid PubChem CID' });
    }

    const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/property/MolecularFormula,MolecularWeight,CanonicalSMILES,InChIKey,XLogP,TPSA,Complexity/JSON`;
    const upstream = await fetch(url);

    if (!upstream.ok) {
      return res.status(upstream.status).json({ error: 'PubChem lookup failed' });
    }

    const data = await upstream.json();
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'PubChem proxy error' });
  }
});

// -----------------------------------------------------------------------------
// AI Synthesis & Biochemical Reasoning Engine (Server-Side Gemini)
// -----------------------------------------------------------------------------
app.post('/api/ai/synthesize', async (req, res) => {
  const { food = 'Banana', chemical = 'Azoxystrobin', symptomPattern = 'Visceral Enteric Cramps', hypothesis = '' } = req.body;

  // Rule-based fallback shared with the static build (src/utils/synthesis.ts).
  // Keeping one implementation means the hosted site and this server never
  // disagree, and no citation can drift.
  const buildFallback = () => buildSynthesis({ food, chemical, symptomPattern, hypothesis });

  try {
    if (aiClient) {
      const prompt = `You are an immunologist and toxicologist writing a cautious research brief on latex-fruit syndrome (LFS) and post-harvest agrochemical exposure.
Food: ${food}
Chemical: ${chemical}
Clinical symptoms: ${symptomPattern}
Working hypothesis: ${hypothesis || 'Investigating whether post-harvest agrochemical handling changes the allergenic load of fruit.'}

Rules:
1. Separate ESTABLISHED findings from PLAUSIBLE mechanisms from UNTESTED hypotheses, under those three headings.
2. Cite only papers you are certain exist, by author/journal/year/PMID. If unsure, say "citation needed" - never invent a PMID or DOI.
3. State explicitly that class I chitinases with the hevein domain (not class II) mediate LFS cross-reactivity.
4. State that ethylene treatment was shown to INDUCE class I chitinases (Sanchez-Monge, JACI 2000), so whether the ethylene blocker 1-MCP raises or lowers chitinase content is unresolved - do not assert a direction.
5. Note that OUtMATCH (omalizumab) enrolled peanut, milk, egg, wheat, cashew, walnut and hazelnut - not banana, avocado, kiwi or chestnut.
6. End with two or three falsifiable predictions a lab could actually run.
Use clear Markdown headings.`;

      try {
        const response = await aiClient.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });

        if (response.text) {
          return res.json({
            model: 'gemini-2.5-flash',
            synthesis: response.text,
          });
        }
      } catch (geminiError: any) {
        console.warn('Gemini API call failed, using deterministic scientific engine:', geminiError?.message);
      }
    }

    // Rule-based synthesis (no model, no invented citations)
    res.json(buildFallback());
  } catch (error: any) {
    console.error('AI synthesis route error:', error);
    try {
      res.json(buildFallback());
    } catch (fallbackError: any) {
      res.status(500).json({ error: fallbackError.message || 'Synthesis failed' });
    }
  }
});

// -----------------------------------------------------------------------------
// Dev & Production Vite Middleware
// -----------------------------------------------------------------------------
async function setupServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`AllergoScope Server running on http://localhost:${PORT}`);
  });
}

setupServer();
