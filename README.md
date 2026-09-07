# ASL Knowledge Explorer — integrated 50-sign build

Ready Next.js prototype for the ASL-LEX LLOD datathon project.

## Included
- The supplied 50-sign CSV (`data/ASLLEX_dataset_50.csv`)
- The supplied OntoLex-Lemon Turtle graph (`data/asllex_50_revised_ontolex_model.ttl`)
- The supplied competency SPARQL queries (`data/asllex_50_revised_queries.sparql`)
- Schema-grounded NL → SPARQL prompt for the actual ASL-KG ontology
- GPT-OSS-20B via Groq when `GROQ_API_KEY` is configured
- Read-only SPARQL validation
- Optional live SPARQL endpoint execution
- Fully working offline fallback using the real 50-sign dataset
- Result cards, ASL-LEX visual links, handshape image links, and generated-SPARQL viewer

## Run
```bash
npm install
npm run dev
```
Open http://localhost:3000

The site works immediately without an API key.

## Enable real LLM NL → SPARQL
Copy `.env.example` to `.env.local` and set:
```env
GROQ_API_KEY=your_key_here
```
Restart `npm run dev`.

## Connect the real RDF graph
When your teammate exposes the Turtle graph via a SPARQL endpoint (Fuseki, Virtuoso, GraphDB, etc.), set:
```env
SPARQL_ENDPOINT_URL=http://localhost:3030/asl/query
```
Then the same `/api/ask` route executes the LLM-generated SPARQL against the live KG instead of the local CSV fallback.

## Architecture
Next.js UI → `/api/ask` → schema-grounded NL→SPARQL → validator → SPARQL endpoint → JSON → UI.

Without a SPARQL endpoint, the final execution step falls back to the supplied real 50-sign CSV so the demo remains usable.

## Files to update if ontology changes
- `lib/kg-schema.ts` — schema grounding
- `lib/nl-to-sparql.ts` — few-shot prompt/examples
- `lib/validate-sparql.ts` — allowed ASL-KG terms

## Important
`.env.local` is ignored by Git. Never commit your Groq API key.
