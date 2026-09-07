# ASL Knowledge Explorer

### 🏆 Winning Project — 6th Summer Datathon on Linguistic Linked Open Data (SD-LLOD-26)

**ASL Knowledge Explorer** is a multimodal Linguistic Linked Open Data (LLOD) prototype for exploring American Sign Language (ASL) lexical, semantic, phonological, psycholinguistic, and multimedia information through natural-language questions.

The project represents sign-language lexical data as an **RDF knowledge graph using OntoLex-Lemon** and provides a natural-language interface that generates **schema-grounded SPARQL**. It was developed during the **6th Summer Datathon on Linguistic Linked Open Data (SD-LLOD-26)**, held from **August 30 to September 4, 2026** at **Villa Cagnola, Gazzada Schianno, Italy**, and was selected as a **winning project**.

**Team:** Fashad Ahmed Siddique · Zunaira Hasnain · Oreoluwa Babatunde · Luana Nova · Nuveyba Ekinci

**Project:** *Building a Multimodal Linked Data Framework for Sign Language Lexicons*

**Event:** [6th Summer Datathon on Linguistic Linked Open Data (SD-LLOD-26)](https://datathon2026.fcsh.unl.pt/)

---

## Overview

ASL Knowledge Explorer demonstrates how sign-language dictionaries and lexical resources can be transformed into **multimodal Linguistic Linked Open Data** and explored without requiring users to know SPARQL.

The application follows the pipeline:

**Natural Language → NL-to-SPARQL → Knowledge Graph → Linked Results**

Users can ask questions such as:

- `Show me Food signs`
- `Which one-handed signs are articulated at the head?`
- `Which signs share the lemma wrong?`
- `Show Animal signs articulated at the head and their handshapes`
- `Which signs do not have a path movement?`
- `Show signs with frequency at least 5`

The current pilot contains **50 curated ASL signs** and integrates lexical, semantic, phonological, psycholinguistic, and multimodal information.

---

## Knowledge Graph

The ASL data is represented as an RDF knowledge graph using **OntoLex-Lemon**, **SKOS**, and related Semantic Web vocabularies. Lexical entries are connected to canonical forms, concepts, semantic fields, phonological properties, psycholinguistic measures, and multimedia references.

<p align="center">
  <img src="<img width="1600" height="1272" alt="image" src="https://github.com/user-attachments/assets/0f673f75-198b-4da7-aa2b-e8ff3f0bd00f" />
" alt="ASL Knowledge Explorer RDF Knowledge Graph" width="900"/>
</p>

<p align="center"><em>Visualization of a portion of the ASL Knowledge Explorer RDF knowledge graph.</em></p>

The graph supports relationships across several linguistic dimensions:

- **Lexical:** lexical entries, lemmas, translations, lexical class
- **Semantic:** concepts and semantic fields
- **Phonological:** sign type, handshape, selected fingers, thumb position, movement, location, and contact
- **Psycholinguistic:** frequency, iconicity, phonological complexity, and neighborhood density
- **Multimodal:** handshape images and external ASL-LEX visualization references

---

## Features

- Natural-language querying of an ASL knowledge graph
- Schema-grounded **NL → SPARQL** generation
- **GPT-OSS-20B via Groq** for LLM-based query generation
- Read-only SPARQL validation before execution
- RDF modeling based on **OntoLex-Lemon**
- Semantic and lexical retrieval
- Phonological querying across handshape, movement, location, contact, and sign type
- Psycholinguistic querying using frequency, iconicity, complexity, and neighborhood density
- Multimodal references to handshape images and ASL-LEX visualization pages
- Optional execution against a live SPARQL endpoint
- Local querying over the curated real 50-sign dataset when an endpoint is not configured
- Generated SPARQL viewer for transparency and debugging
- Linked result cards for matching ASL signs

---

## Technology Stack

- **Next.js 15**
- **React 19**
- **TypeScript**
- **Groq SDK**
- **GPT-OSS-20B**
- **RDF / Turtle**
- **SPARQL**
- **OntoLex-Lemon**
- **SKOS**
- **Linguistic Linked Open Data (LLOD)**
- **GraphDB / SPARQL-compatible RDF stores**

---

## Project Structure

```text
Datathon/
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
│   ├── kg-schema.ts
│   ├── nl-to-sparql.ts
│   ├── query-real-data.ts
│   ├── real-data.ts
│   ├── sparql-endpoint.ts
│   ├── types.ts
│   └── validate-sparql.ts
│
├── Resources/
│   ├── KG.jpeg
│   └── SIGN LANGUAGE MODELLING & LINKING GROUP.pdf
│
├── .env.example
├── .gitignore
├── README.md
├── package.json
├── package-lock.json
└── tsconfig.json
```

---

## Data and RDF Model

The repository includes a curated **50-sign ASL pilot dataset**, its RDF/Turtle representation, and competency SPARQL queries.

| File | Description |
|---|---|
| `data/ASLLEX_dataset_50.csv` | Curated 50-sign pilot dataset |
| `data/asllex_50_revised_ontolex_model.ttl` | RDF/Turtle knowledge graph modeled with OntoLex-Lemon |
| `data/asllex_50_revised_queries.sparql` | Example and competency SPARQL queries |

The model represents information including:

- Entry and lemma identifiers
- Dominant and nondominant translations
- Lexical class
- Semantic field
- Sign type
- Handshape
- Selected fingers
- Thumb position
- Path movement
- Repeated movement
- Major and minor location
- Contact
- Frequency
- Iconicity
- Phonological complexity
- Neighborhood density
- Multimedia references

Semantic and phonological categories are represented as reusable RDF resources rather than only as flat string values.

---

## System Architecture

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
     ├──── SPARQL_ENDPOINT_URL configured ────► RDF Knowledge Graph
     │                                               │
     │                                               ▼
     │                                            Results
     │
     └──── No endpoint ───────────────────────► Local 50-Sign Dataset
                                                     │
                                                     ▼
                                                  Results
```

The application supports three configurations:

1. **Local dataset mode** — uses the supplied real 50-sign dataset with the schema-aware fallback query generator.
2. **LLM + local dataset** — GPT-OSS generates SPARQL while matching result cards are retrieved from the local 50-sign dataset.
3. **LLM + live RDF knowledge graph** — generated SPARQL is validated and executed directly against a configured RDF/SPARQL endpoint.

---

## NL-to-SPARQL

The language model is not asked to generate arbitrary SPARQL. Generation is grounded in the actual knowledge-graph schema defined in:

```text
lib/kg-schema.ts
```

The prompt and few-shot examples are implemented in:

```text
lib/nl-to-sparql.ts
```

They cover query families including:

- Semantic retrieval
- Phonological retrieval
- Combined semantic + phonological constraints
- Lemma lookup
- Translation lookup
- Missing-property queries
- Numerical thresholds
- Psycholinguistic constraints
- Neighborhood analysis
- Multimodal retrieval

Before execution, generated SPARQL is checked by:

```text
lib/validate-sparql.ts
```

---

## Example

Natural-language question:

```text
Which one-handed signs are articulated at the head?
```

Example generated query:

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

The matching ASL signs are returned to the interface and displayed as result cards.

---

## Getting Started

### Prerequisites

- Node.js 18+ (current LTS recommended)
- npm

### Install dependencies

```bash
npm install
```

### Run locally

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

The application can run using the supplied local dataset without requiring an API key.

---

## Enable LLM-Based NL → SPARQL

Create `.env.local` from the example environment file.

On macOS/Linux:

```bash
cp .env.example .env.local
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

Add your Groq API key:

```env
GROQ_API_KEY=your_groq_api_key
```

Restart the development server.

When configured, the application uses **`openai/gpt-oss-20b` through Groq** for natural-language-to-SPARQL generation.

> Never commit `.env.local` or expose API credentials publicly.

---

## Connect the RDF Knowledge Graph

To execute generated SPARQL directly against the RDF knowledge graph, load:

```text
data/asllex_50_revised_ontolex_model.ttl
```

into a SPARQL-compatible RDF store such as **GraphDB** or **Apache Jena Fuseki**.

Then add the query endpoint to `.env.local`:

```env
SPARQL_ENDPOINT_URL=your_sparql_query_endpoint
```

A complete configuration can look like:

```env
GROQ_API_KEY=your_groq_api_key
SPARQL_ENDPOINT_URL=your_sparql_query_endpoint
```

When `SPARQL_ENDPOINT_URL` is configured, generated SPARQL is executed directly against the live RDF knowledge graph.

---

## API

### `POST /api/ask`

Example request:

```json
{
  "question": "Show me Food signs"
}
```

The response includes:

- Original natural-language question
- Generated SPARQL
- Number of matching signs
- Matching result records
- Current execution mode
- Execution note

---

## Multimodal LLOD

A central goal of the project is to move beyond a conventional lexical table by representing multiple dimensions of sign-language information as linked data.

```text
Lexical Information
        ↓
Semantic Concepts
        ↓
Phonological Form
        ↓
Psycholinguistic Measures
        ↓
Multimedia References
```

This enables cross-dimensional queries such as retrieving signs from a semantic category while simultaneously filtering by articulation location, handshape, movement, contact, frequency, or iconicity.

---

## Datathon

### 🏆 Winning Project — SD-LLOD-26

ASL Knowledge Explorer was developed during the **6th Summer Datathon on Linguistic Linked Open Data (SD-LLOD-26)**, held from **August 30 to September 4, 2026** at **Villa Cagnola, Gazzada Schianno, Italy**.

The datathon brings together researchers and students working with Linguistic Linked Open Data, Semantic Web technologies, natural language processing, and linguistic data science.

### Team

- **Fashad Ahmed Siddique**
- **Zunaira Hasnain**
- **Oreoluwa Babatunde**
- **Luana Nova**
- **Nuveyba Ekinci**

### Mentors

- **Jorge Gracia del Río**
- **Christian Chiarcos**
- **Blerina Spahiu**

---

## Data Attribution

The pilot dataset is derived from **ASL-LEX** resources and is used for research and datathon prototyping.

Multimedia references are represented as external references rather than redistributed ASL-LEX videos. Users of this repository should consult the original ASL-LEX resource and its licensing and usage conditions before redistributing source data or multimedia material.

---

## Future Work

- Scale beyond the 50-sign pilot
- Link additional sign-language lexical resources
- Add richer multimedia annotations
- Link to external multilingual lexical and conceptual resources
- Deploy a public SPARQL endpoint
- Evaluate NL-to-SPARQL accuracy systematically
- Improve complex cross-modal linguistic querying
- Extend the framework to additional sign languages

---

## Acknowledgements

We thank the organizers and mentors of the **6th Summer Datathon on Linguistic Linked Open Data (SD-LLOD-26)** for their guidance and support during the development of this project.

---

## Build for Production

```bash
npm run build
npm start
```

---

**ASL Knowledge Explorer** · OntoLex-Lemon · RDF · SPARQL · LLOD · Multimodal Sign Language Data
