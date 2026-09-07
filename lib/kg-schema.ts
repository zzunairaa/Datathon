export const KG_SCHEMA = `
PREFIX ontolex: <http://www.w3.org/ns/lemon/ontolex#>
PREFIX lime: <http://www.w3.org/ns/lemon/lime#>
PREFIX vartrans: <http://www.w3.org/ns/lemon/vartrans#>
PREFIX lexinfo: <http://www.lexinfo.net/ontology/3.0/lexinfo#>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX dct: <http://purl.org/dc/terms/>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
PREFIX aslkg: <https://w3id.org/asl-lex-kg/ontology#>
PREFIX data: <https://w3id.org/asl-lex-kg/resource/>

CORE GRAPH
?entry a aslkg:SignLexicalEntry ; dct:identifier ?entryId ; ontolex:evokes ?lemmaConcept ; ontolex:lexicalForm ?form .
?lemmaConcept a ontolex:LexicalConcept ; dct:identifier ?lemma .

ENGLISH TRANSLATION
?entry vartrans:translatableAs ?englishEntry .
?englishEntry ontolex:lexicalForm ?englishForm .
?englishForm ontolex:writtenRep ?translation .

LEXICAL / SEMANTIC
?entry lexinfo:partOfSpeech ?pos .
?entry aslkg:semanticField ?fieldResource .
?fieldResource a aslkg:SemanticField ; skos:prefLabel ?semanticField .

FORM / PHONOLOGY
?form a aslkg:SignForm .
?form aslkg:signType ?signTypeResource . ?signTypeResource skos:prefLabel ?signType .
?form aslkg:dominantHandshape ?handshapeResource . ?handshapeResource skos:prefLabel ?dominantHandshape ; skos:notation ?handshapeNotation .
?form aslkg:nondominantHandshape ?nondominantHandshapeResource . ?nondominantHandshapeResource skos:prefLabel ?nondominantHandshape .
?form aslkg:selectedFingerConfiguration ?selectedFingerResource . ?selectedFingerResource skos:notation ?selectedFingers .
?form aslkg:numberOfSelectedFingers ?numberSelected .
?form aslkg:indexSelected ?indexSelected ; aslkg:middleSelected ?middleSelected ; aslkg:ringSelected ?ringSelected ; aslkg:pinkySelected ?pinkySelected ; aslkg:thumbSelected ?thumbSelected .
?form aslkg:thumbPosition ?thumbPositionResource . ?thumbPositionResource skos:prefLabel ?thumbPosition .
?form aslkg:pathMovement ?movementResource . ?movementResource skos:prefLabel ?pathMovement .
?form aslkg:repeatedMovement ?repeatedMovement .
?form aslkg:majorLocation ?majorLocationResource . ?majorLocationResource skos:prefLabel ?majorLocation .
?form aslkg:minorLocation ?minorLocationResource . ?minorLocationResource skos:prefLabel ?minorLocation .
?form aslkg:contact ?contact .
?form aslkg:phonologicalComplexity ?complexity .
?form aslkg:neighborhoodDensity ?neighborhoodDensity .

NUMERIC ENTRY DATA
?entry aslkg:frequency ?frequency .
?entry aslkg:nonSignerIconicity ?iconicity .

MULTIMEDIA
?entry foaf:page ?page .
?handshapeResource foaf:depiction ?image .

CRITICAL DISTINCTIONS
- Entry ID = dct:identifier on aslkg:SignLexicalEntry.
- Lemma ID = dct:identifier on the ontolex:LexicalConcept reached by ontolex:evokes.
- Translation = writtenRep of the English lexical form reached via vartrans:translatableAs.
- Semantic/phonological categories are SKOS resources; retrieve/match their skos:prefLabel or skos:notation.
- ASL phonology is on the resource reached through ontolex:lexicalForm. Never use ontolex:canonicalForm.

KNOWN SEMANTIC FIELD LABELS
Animal, Attribute, Emotion, Event, Food, Locative, Number, People, Place.

KNOWN MAJOR LOCATIONS
Body, Hand, Head, Neutral.

Examples of sign types in this 50-entry graph include One Handed and Symmetrical Or Alternating. Always match actual labels through skos:prefLabel.
`;
