<img width="1600" height="1272" alt="ONTOSIGN — ASL Knowledge Explorer" src="https://github.com/user-attachments/assets/7e148421-92f2-4bd0-a6a8-04b2820aeed8" />

# ASL Knowledge Explorer

**ASL Knowledge Explorer** is a multimodal Linguistic Linked Open Data (LLOD) prototype for exploring American Sign Language (ASL) lexical, semantic, phonological, psycholinguistic, and multimedia information through natural-language questions.

The application converts a user's natural-language question into **schema-grounded SPARQL**, validates the generated query, and retrieves matching signs either from a configured RDF/SPARQL endpoint or from the included 50-sign ASL-LEX pilot dataset.

> Developed as part of the **SD-LLOD-26 Datathon** project: *Building a Multimodal Linked Data Framework for Sign Language Lexicons*.

## Overview

The project demonstrates how sign-language lexical resources can be represented as linked data using **RDF** and **OntoLex-Lemon**, while remaining accessible to users who do not know SPARQL.

Example questions include:

- `Show me Food signs`
- `Which one-handed signs are articulated at the head?`
- `Which signs share the lemma wrong?`
- `Show Animal signs articulated at the head and their handshapes`
- `Which signs do not have a path movement?`
- `Show signs with frequency at least 5`

The interface follows the pipeline:

**Natural Language → NL-to-SPARQL → Knowledge Graph → Linked Results**

## Features

- Natural-language querying of an ASL knowledge graph
- Schema-grounded **NL → SPARQL** generation
- **GPT-OSS-20B via Groq** for LLM-based query generation
- Read-only SPARQL validation before execution
- OntoLex-Lemon-based RDF representation
- Lexical and semantic querying
- Phonological querying, including handshape, movement, location, contact, and sign type
- Psycholinguistic querying, including frequency, iconicity, complexity, and neighborhood density
- Multimodal links to ASL-LEX visualization pages and handshape images
- Optional execution against a live SPARQL endpoint
- Offline/local fallback using the supplied real 50-sign dataset
- Generated SPARQL viewer for transparency and debugging
- Result cards for exploring matching signs

## Technology Stack

- **Next.js 15**
- **React 19**
- **TypeScript**
- **Groq SDK**
- **GPT-OSS-20B**
- **RDF**
- **SPARQL**
- **OntoLex-Lemon**
- **SKOS**
- **Linguistic Linked Open Data (LLOD)**

## Project Structure

```text
asl-knowledge-explorer/
├── app/
│   ├── api/
│   │   └── ask/
│   │       └── route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── ResultCard.tsx
│   ├── SearchBox.tsx
│   └── SparqlViewer.tsx
│
├── data/
│   ├── ASLLEX_dataset_50.csv
│   ├── asllex_50_revised_ontolex_model.ttl
│   └── asllex_50_revised_queries.sparql
│
├── lib/
│   ├── demo-query.ts
│   ├── dummy-data.ts
│   ├── kg-schema.ts
│   ├── nl-to-sparql.ts
│   ├── query-real-data.ts
│   ├── real-data.ts
│   ├── sparql-endpoint.ts
│   ├── types.ts
│   └── validate-sparql.ts
│
├── .env.example
├── package.json
└── README.md
```

## Data and Knowledge Graph

The prototype contains a curated **50-sign ASL dataset** together with its RDF representation and competency queries.

### Included resources

| File | Description |
|---|---|
| `data/ASLLEX_dataset_50.csv` | Curated 50-sign pilot dataset |
| `data/asllex_50_revised_ontolex_model.ttl` | RDF/Turtle knowledge graph modeled with OntoLex-Lemon |
| `data/asllex_50_revised_queries.sparql` | Example and competency SPARQL queries |

The model represents information such as:

- lexical entries and lemma concepts
- English translations
- lexical class / part of speech
- semantic fields
- sign type
- dominant and nondominant handshape
- selected fingers
- thumb position
- path movement
- repeated movement
- major and minor location
- contact
- frequency
- iconicity
- phonological complexity
- neighborhood density
- multimedia references

Semantic and phonological categories are represented as reusable resources and queried through labels or notations rather than being treated only as plain strings.

## Architecture

```text
User Question
     │
     ▼
Next.js Interface
     │
     ▼
POST /api/ask
     │
     ▼
Schema-Grounded NL → SPARQL
     │
     ▼
Read-Only SPARQL Validation
     │
     ├──────────── SPARQL_ENDPOINT_URL configured ────────────┐
     │                                                        ▼
     │                                                RDF Knowledge Graph
     │                                                        │
     │                                                        ▼
     └──── no endpoint ──► Local 50-Sign Data Fallback ◄── Results
                              │
                              ▼
                         Result Cards
```

The application therefore supports multiple operating modes:

1. **Offline demo** — no API key or SPARQL endpoint is required.
2. **LLM + local data** — Groq generates SPARQL, while result cards are retrieved from the local 50-sign dataset.
3. **Live RDF knowledge graph** — generated SPARQL is executed against the configured SPARQL endpoint.

## Getting Started

### Prerequisites

Install:

- Node.js 18+ (a current LTS release is recommended)
- npm

### 1. Install dependencies

```bash
npm install
```

### 2. Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

The application can run immediately without an API key.

## Enable LLM-Based NL → SPARQL

Copy the example environment file:

```bash
cp .env.example .env.local
```

On Windows, you can create `.env.local` manually or run:

```powershell
Copy-Item .env.example .env.local
```

Add your Groq API key:

```env
GROQ_API_KEY=your_groq_api_key
```

Restart the development server:

```bash
npm run dev
```

When this variable is configured, the application uses **`openai/gpt-oss-20b` through Groq** to translate natural-language questions into SPARQL.

> Never commit `.env.local` or expose your API key publicly.

## Connect a Live SPARQL Endpoint

The included Turtle graph can be loaded into an RDF store such as **GraphDB**, **Apache Jena Fuseki**, or another SPARQL-compatible platform.

Set the query endpoint in `.env.local`:

```env
SPARQL_ENDPOINT_URL=http://localhost:3030/asl/query
```

For a local GraphDB repository, use the appropriate SPARQL endpoint URL for your repository.

When `SPARQL_ENDPOINT_URL` is configured, `/api/ask` executes the generated SPARQL against the live RDF graph instead of using the local CSV result layer.

A complete configuration can therefore look like:

```env
GROQ_API_KEY=your_groq_api_key
SPARQL_ENDPOINT_URL=your_sparql_query_endpoint
```

## NL-to-SPARQL Design

The LLM is not asked to generate arbitrary SPARQL. Its prompt is grounded in the actual ASL knowledge-graph schema defined in:

```text
lib/kg-schema.ts
```

Few-shot examples in:

```text
lib/nl-to-sparql.ts
```

demonstrate several query families, including:

- semantic retrieval
- phonological retrieval
- combined semantic + phonological constraints
- lemma lookup
- English translation lookup
- missing-property queries
- numerical thresholds
- psycholinguistic constraints
- neighborhood analysis
- multimodal retrieval

The generated query is subsequently checked by `lib/validate-sparql.ts` before execution.

## Example Query

Natural-language input:

```text
Which one-handed signs are articulated at the head?
```

The system generates a SPARQL query based on the ASL-KG ontology, for example:

```sparql
PREFIX ontolex: <http://www.w3.org/ns/lemon/ontolex#>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX dct: <http://purl.org/dc/terms/>
PREFIX aslkg: <https://w3id.org/asl-lex-kg/ontology#>

SELECT ?entry ?entryId
WHERE {
  ?entry a aslkg:SignLexicalEntry ;
         dct:identifier ?entryId ;
         ontolex:lexicalForm ?form .

  ?form aslkg:signType ?signTypeResource ;
        aslkg:majorLocation ?locationResource .

  ?signTypeResource skos:prefLabel "One Handed"@en .
  ?locationResource skos:prefLabel "Head"@en .
}
ORDER BY ?entryId
```

The matching signs are then displayed as linked result cards in the interface.

## API

### `POST /api/ask`

Request:

```json
{
  "question": "Show me Food signs"
}
```

The response contains:

- original question
- generated SPARQL
- result count
- matching sign records
- current execution mode
- execution note

## Build for Production

```bash
npm run build
npm start
```

## Updating the Knowledge Graph

If the ontology or RDF model changes, review these files to keep the application aligned with the graph:

- `lib/kg-schema.ts` — ontology/schema grounding supplied to the LLM
- `lib/nl-to-sparql.ts` — prompt and few-shot query examples
- `lib/validate-sparql.ts` — SPARQL safety and allowed graph terms
- `data/asllex_50_revised_ontolex_model.ttl` — RDF/Turtle graph
- `data/asllex_50_revised_queries.sparql` — competency queries

## Multimodal LLOD

The project goes beyond a conventional lexical table by connecting sign-language entries with multiple dimensions of information.

The RDF graph combines:

**Lexical information** → **semantic concepts** → **phonological form** → **psycholinguistic measures** → **multimedia references**

This enables queries that cross these dimensions, such as retrieving signs from a semantic category while simultaneously filtering by articulation, handshape, movement, frequency, or iconicity.

## Data Attribution

The pilot dataset is derived from **ASL-LEX** resources and is used here for research and datathon prototyping. Multimedia references are represented as external links rather than redistributed ASL-LEX videos.

Users of this repository should consult the original ASL-LEX resource and its licensing/usage conditions before redistributing source data or multimedia material.

## Research Context

This prototype was created for the project:

**Building a Multimodal Linked Data Framework for Sign Language Lexicons**

The broader goal is to investigate how sign-language dictionaries and annotated lexical resources can be represented as **multimodal Linguistic Linked Open Data**, allowing structured semantic and phonological exploration through RDF and SPARQL while providing a natural-language interface for non-SPARQL users.

## Future Work

Potential extensions include:

- scaling from the 50-sign pilot to a larger sign-language lexicon
- linking additional sign-language lexical resources
- richer multimedia annotations
- external semantic links to multilingual lexical/conceptual resources
- direct deployment with a public SPARQL endpoint
- improved NL-to-SPARQL evaluation and error analysis
- support for more complex cross-modal and linguistic queries
- extension to additional sign languages

## Acknowledgements

Developed for the **SD-LLOD-26 Datathon** with guidance from the project mentors:

- Andon Tchechmedjiev
- Armando Stellato
- Blerina Spahiu

## Authors

**Zunaira Hasnain** and project collaborators.

---

**ASL Knowledge Explorer** · OntoLex-Lemon · RDF · SPARQL · LLOD · Multimodal Sign Language Data
