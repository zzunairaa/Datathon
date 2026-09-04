<img width="1600" height="1272" alt="image" src="https://github.com/user-attachments/assets/7e148421-92f2-4bd0-a6a8-04b2820aeed8" />


# ONTOSIGN — ASL Knowledge Explorer

### Sign Language Accessibility Linked Open Data

**ONTOSIGN** is a Linked Open Data prototype for exploring American Sign Language lexical, semantic, and phonological information.

The project transforms a curated subset of **ASL-LEX 2.0** into an **RDF / OntoLex-Lemon knowledge graph** and provides a web interface where users can ask questions in natural language and translate them into schema-grounded **SPARQL queries**.

Developed for the **SD-LLOD 2026 Datathon**.

---

## What is this project?

ASL-LEX 2.0 contains rich lexical and phonological information about American Sign Language, but the original resource is primarily tabular.

ONTOSIGN explores how this data can instead be represented as an interconnected semantic knowledge graph.

The current prototype contains:

- 50 curated ASL signs
- RDF representation in Turtle
- OntoLex-Lemon lexical modelling
- explicit phonological feature modelling
- semantic-field representation
- SPARQL competency queries
- natural-language → SPARQL translation
- SPARQL safety validation
- optional live RDF endpoint execution
- offline querying over the included dataset
- a Next.js exploration interface

---

## Motivation

ASL-LEX contains rich information such as:

- lexical entries
- English translations
- semantic fields
- handshapes
- selected fingers
- movement
- articulation locations
- frequency
- iconicity
- phonological complexity
- neighborhood density

In a CSV, these values mainly exist as columns.

ONTOSIGN converts them into explicit semantic relationships.

Instead of:

```text
bird | Animal | g | Head | Mouth | ...
```

we can model:

```text
bird
 ├── evokes → bird concept
 ├── semantic field → Animal
 └── lexical form → bird form
                        ├── dominant handshape → G
                        ├── major location → Head
                        ├── minor location → Mouth
                        └── repeated movement → true
```

This makes the data interoperable and allows semantic and phonological properties to be queried together.

---

## Knowledge Graph Model

The core model follows **OntoLex-Lemon**.

```text
LexicalConcept
      ↑
      │ ontolex:evokes
      │
SignLexicalEntry
      │
      │ ontolex:lexicalForm
      ↓
   SignForm
```

The repository defines:

```text
aslkg:SignLexicalEntry
    rdfs:subClassOf ontolex:LexicalEntry

aslkg:SignForm
    rdfs:subClassOf ontolex:Form
```

A sign therefore has a lexical identity, a semantic concept, and a form containing its phonological characteristics.

---

## What is represented in the graph?

The graph contains several kinds of nodes.

### Lexical resources

- `aslkg:SignLexicalEntry`
- `ontolex:LexicalConcept`
- `aslkg:SignForm`

### Semantic resources

- `aslkg:SemanticField`

Examples:

```text
Animal
Emotion
Food
People
Place
Locative
Event
Attribute
Number
```

### Phonological resources

- `aslkg:SignType`
- `aslkg:Handshape`
- `aslkg:SelectedFingerConfiguration`
- `aslkg:ThumbPosition`
- `aslkg:PathMovement`
- `aslkg:MajorLocation`
- `aslkg:MinorLocation`

The graph also contains numeric and boolean features including:

- number of selected fingers
- individual selected-finger flags
- repeated movement
- contact
- phonological complexity
- neighborhood density
- frequency
- non-signer iconicity

---

## Why use a graph?

The RDF model turns repeated values into shared resources.

For example:

```text
                aslkg:Head
                ↑       ↑
                │       │
          majorLocation │
                │       │
            birdForm   duckForm
```

Likewise, several signs may share:

- a handshape
- a location
- a semantic field
- a movement type
- a sign type

The result is an interconnected network rather than 50 isolated rows.

This is what makes graph traversal and SPARQL querying useful.

---

## Example: `bird`

One of the signs included in the current dataset is `bird`.

Its data includes approximately the following structure:

```text
bird
│
├── lemma/concept → bird
├── translation → "bird"
├── lexical class → Noun
├── semantic field → Animal
│
└── lexical form
     ├── sign type → One Handed
     ├── dominant handshape → g
     ├── selected fingers → i
     ├── number selected → 1
     ├── thumb position → Open
     ├── repeated movement → true
     ├── major location → Head
     ├── minor location → Mouth
     ├── contact → true
     ├── phonological complexity → 1
     └── neighborhood density → 1
```

The entry also links back to the corresponding ASL-LEX visualization page and to an external handshape image.

---

## Semantic + Phonological Queries

One goal of the project is to allow properties that normally live in different columns or resources to be queried together.

For example:

> Which ASL signs belong to the semantic field "Animal", and what are their dominant handshapes and major articulation locations?

```sparql
SELECT ?entry ?entryId ?handshape ?location
WHERE {

  ?entry a aslkg:SignLexicalEntry ;
         dct:identifier ?entryId ;
         aslkg:semanticField ?field ;
         ontolex:lexicalForm ?form .

  ?field skos:prefLabel "Animal"@en .

  ?form aslkg:dominantHandshape ?hs ;
        aslkg:majorLocation ?loc .

  ?hs skos:prefLabel ?handshape .
  ?loc skos:prefLabel ?location .
}
ORDER BY ?entryId
```

The graph traversal is essentially:

```text
SemanticField
      ↑
      │ semanticField
      │
LexicalEntry
      │
      │ lexicalForm
      ↓
    SignForm
     ↙     ↘
Handshape  Location
```

---

## Natural Language → SPARQL

The web application allows a user to ask questions such as:

```text
Show me Food signs
```

```text
Which one-handed signs are articulated at the head?
```

```text
Show Animal signs articulated at the head and their handshapes
```

```text
Which signs do not have a path movement?
```

```text
Show signs with frequency at least 5
```

The application follows this pipeline:

```text
User question
      ↓
Schema-grounded prompt
      ↓
NL → SPARQL generation
      ↓
SPARQL validation
      ↓
RDF endpoint / local data
      ↓
Linked result cards
```

---

## LLM Integration

When a `GROQ_API_KEY` is configured, the application uses a Groq-hosted model for natural-language-to-SPARQL generation.

The model is not simply asked to generate arbitrary SPARQL.

It receives the actual ASL-KG schema and explicit constraints describing:

- valid classes
- valid predicates
- where entry IDs are stored
- how lexical concepts are reached
- how English translations are represented
- where phonological information belongs
- which operations are forbidden

This reduces ontology hallucination and keeps generated queries grounded in the project's RDF model.

---

## Schema Grounding

The LLM is given the graph structure defined in:

```text
lib/kg-schema.ts
```

Important modelling rules include:

```text
Entry ID
→ dct:identifier on aslkg:SignLexicalEntry
```

```text
Lemma
→ dct:identifier on the LexicalConcept
→ reached using ontolex:evokes
```

```text
English translation
→ vartrans:translatableAs
→ ontolex:lexicalForm
→ ontolex:writtenRep
```

```text
ASL phonology
→ attached to the SignForm
→ reached using ontolex:lexicalForm
```

The prompt explicitly prevents the model from inventing shortcut predicates such as:

```text
aslkg:entryID
aslkg:translation
aslkg:handshape
aslkg:location
```

when those properties do not exist in the ontology.

---

## SPARQL Safety

Generated queries pass through a validation layer before execution.

The application currently permits only:

```text
SELECT
```

queries.

Potentially destructive or external operations are rejected, including:

```text
INSERT
DELETE
DROP
CLEAR
LOAD
CREATE
MOVE
COPY
ADD
WITH
SERVICE
CONSTRUCT
DESCRIBE
```

The validator also checks generated `aslkg:` terms against the project's known vocabulary.

This means the demo is designed as a **read-only knowledge explorer**.

---

## Two Execution Modes

### 1. Offline / Local Demo

No API keys are required.

The app can use the included 50-sign dataset together with local querying logic.

This means the frontend remains demonstrable even without:

- an LLM API key
- GraphDB
- Fuseki
- Virtuoso
- another SPARQL server

### 2. Live Knowledge Graph

If a SPARQL endpoint is available, configure:

```env
SPARQL_ENDPOINT_URL=http://localhost:7200/repositories/your-repository
```

With a live endpoint, the flow becomes:

```text
Natural Language
      ↓
LLM
      ↓
Generated SPARQL
      ↓
Validator
      ↓
Live RDF Graph
      ↓
Results
```

---

## Technology Stack

### Frontend

- Next.js
- React
- TypeScript

### AI

- Groq SDK
- schema-grounded NL → SPARQL

### Semantic Web

- RDF
- Turtle
- OntoLex-Lemon
- SKOS
- VarTrans
- LexInfo
- Dublin Core Terms
- FOAF
- OWL
- SPARQL

---

## Repository Structure

```text
asl-knowledge-explorer/
│
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
├── tsconfig.json
└── README.md
```

---

## Current Prototype

The current prototype contains **50 ASL signs** and demonstrates:

- transformation of ASL-LEX-style data into RDF
- OntoLex-based lexical modelling
- explicit phonological feature representation
- semantic + phonological SPARQL querying
- graph visualization
- natural-language-to-SPARQL interaction
- query validation
- local and endpoint-backed execution

---

## Future Work

### Scale the graph

Extend from the current **50-sign prototype** to the full **2,723-sign ASL-LEX 2.0 lexicon**.

### Improve ontology alignment

Perform a deeper comparison with earlier sign-language ontologies and determine which concepts or properties should be reused or aligned.

### Sense-level modelling

Refine the distinction between lexical concepts and individual senses.

### Interlink with CILI

Propose and align suitable concepts with the **Collaborative Interlingual Index (CILI)**.

### Multilingual Sign Language WordNet

Connect ASL to **Schulder et al.'s Multilingual Sign Language WordNet**, providing an ASL entry point into the multilingual sign-language Linked Data ecosystem.

### Linguistic Linked Open Data

The long-term goal is to make ASL lexical resources interoperable with the wider **Linguistic Linked Open Data (LLOD)** ecosystem.

---

## References

1. Sevcikova Sehyr, Z., Caselli, N., Cohen-Goldberg, A. M., & Emmorey, K. (2021).  
   **The ASL-LEX 2.0 Project: A Database of Lexical and Phonological Properties for 2,723 Signs in American Sign Language.**

2. Declerck, T. (2022).  
   **Towards a New Ontology for Sign Languages.**

3. Declerck, T., Troelsgård, T., & Olsen, S. (2023).  
   **Towards an RDF Representation of the Infrastructure Consisting in Using Wordnets as a Conceptual Interlingua Between Multilingual Sign Language Datasets.**

4. Schulder, M., Bigeard, S., Kopf, M., Hanke, T., et al. (2024).  
   **Signs and Synonymity: Continuing Development of the Multilingual Sign Language Wordnet.**

5. Kezar, L., Munikote, N., Zeng, Z., Sehyr, Z., Caselli, N., & Thomason, J. (2025).  
   **The American Sign Language Knowledge Graph: Infusing ASL Models with Linguistic Knowledge.**

---

## Team

**Sign Language Modelling & Linking Group**

- Fashad Ahmed Siddique
- Zunaira Hasnain
- Oreoluwa Babatunde
- Luana Nova
- Nuveyba Ekinci

Developed during **SD-LLOD 2026 — Summer Datathon on Linguistic Linked Open Data**.

---

## License

Please refer to the original **ASL-LEX 2.0 licensing and usage conditions** for source data.

Code and ontology licensing for this repository should be specified separately by the project maintainers.

---

## Acknowledgements

This project builds upon:

- ASL-LEX 2.0
- OntoLex-Lemon
- Linguistic Linked Open Data
- prior sign-language RDF and ontology research
- Multilingual Sign Language WordNet

---

## ONTOSIGN

**From ASL lexical data to an interoperable, queryable knowledge graph.**
