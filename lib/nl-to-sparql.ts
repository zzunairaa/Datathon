import Groq from "groq-sdk";
import { KG_SCHEMA } from "./kg-schema";

const PREFIXES = `PREFIX ontolex: <http://www.w3.org/ns/lemon/ontolex#>\nPREFIX vartrans: <http://www.w3.org/ns/lemon/vartrans#>\nPREFIX lexinfo: <http://www.lexinfo.net/ontology/3.0/lexinfo#>\nPREFIX skos: <http://www.w3.org/2004/02/skos/core#>\nPREFIX dct: <http://purl.org/dc/terms/>\nPREFIX foaf: <http://xmlns.com/foaf/0.1/>\nPREFIX aslkg: <https://w3id.org/asl-lex-kg/ontology#>`;

const EXAMPLES = `
Q: Show all Animal signs.
A: ${PREFIXES}\nSELECT ?entry ?entryId WHERE { ?entry a aslkg:SignLexicalEntry ; dct:identifier ?entryId ; aslkg:semanticField ?field . ?field skos:prefLabel ?fieldLabel . FILTER(LCASE(STR(?fieldLabel)) = "animal") } ORDER BY ?entryId

Q: Which one-handed signs are articulated at the head?
A: ${PREFIXES}\nSELECT ?entry ?entryId WHERE { ?entry a aslkg:SignLexicalEntry ; dct:identifier ?entryId ; ontolex:lexicalForm ?form . ?form aslkg:signType ?st ; aslkg:majorLocation ?loc . ?st skos:prefLabel "One Handed"@en . ?loc skos:prefLabel "Head"@en . } ORDER BY ?entryId

Q: Which signs share the lemma wrong?
A: ${PREFIXES}\nSELECT ?entry ?entryId WHERE { ?concept a ontolex:LexicalConcept ; dct:identifier ?lemma . ?entry a aslkg:SignLexicalEntry ; ontolex:evokes ?concept ; dct:identifier ?entryId . FILTER(LCASE(STR(?lemma)) = "wrong") } ORDER BY ?entryId

Q: Find signs whose English translation is wrong.
A: ${PREFIXES}\nSELECT ?entry ?entryId ?translation WHERE { ?entry a aslkg:SignLexicalEntry ; dct:identifier ?entryId ; vartrans:translatableAs ?englishEntry . ?englishEntry ontolex:lexicalForm ?englishForm . ?englishForm ontolex:writtenRep ?translation . FILTER(LCASE(STR(?translation)) = "wrong") } ORDER BY ?entryId

Q: Which signs do not have a path movement?
A: ${PREFIXES}\nSELECT ?entry ?entryId WHERE { ?entry a aslkg:SignLexicalEntry ; dct:identifier ?entryId ; ontolex:lexicalForm ?form . FILTER NOT EXISTS { ?form aslkg:pathMovement ?movement . } } ORDER BY ?entryId

Q: Show signs with frequency at least 5.
A: ${PREFIXES}\nSELECT ?entry ?entryId ?frequency WHERE { ?entry a aslkg:SignLexicalEntry ; dct:identifier ?entryId ; aslkg:frequency ?frequency . FILTER(?frequency >= 5.0) } ORDER BY DESC(?frequency)
`;

function clean(text:string){ return text.replace(/```sparql/gi,"").replace(/```/g,"").trim(); }

export async function naturalLanguageToSparql(question:string){
  if(!process.env.GROQ_API_KEY) return fallbackSparql(question);
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  const completion = await groq.chat.completions.create({
    model:"openai/gpt-oss-20b", temperature:0,
    messages:[
      {role:"system",content:`You are a schema-grounded NL-to-SPARQL translator for one ASL-LEX OntoLex-Lemon knowledge graph. Return ONLY executable SPARQL SELECT. Never answer the question yourself. Use ONLY the supplied classes/properties. Never invent shortcut predicates such as aslkg:entryID, aslkg:lemmaID, aslkg:translation, aslkg:handshape or aslkg:location. Entry ID is dct:identifier on the entry. Lemma is dct:identifier on the LexicalConcept reached by ontolex:evokes. English translation is reached via vartrans:translatableAs -> ontolex:lexicalForm -> ontolex:writtenRep. ASL forms use ontolex:lexicalForm, NEVER canonicalForm. Semantic fields, sign types, handshapes, movements and locations are resources and must be matched through skos:prefLabel/skos:notation. Use OPTIONAL for requested fields that may be absent. Missing data uses FILTER NOT EXISTS. Numeric constraints use FILTER. Boolean values are true/false literals. Never generate INSERT, DELETE, DROP, CLEAR, LOAD, CREATE, MOVE, COPY, ADD, WITH, SERVICE, CONSTRUCT or DESCRIBE.\n\nSCHEMA:\n${KG_SCHEMA}\n\nFEW-SHOT EXAMPLES:\n${EXAMPLES}`},
      {role:"user",content:`Translate this natural-language question into SPARQL:\n${question}`}
    ]
  });
  const raw=completion.choices[0]?.message?.content||"";
  if(!raw) throw new Error("The NL-to-SPARQL model returned an empty response.");
  return clean(raw);
}

export function fallbackSparql(question:string){
  const q=question.toLowerCase();
  const patterns:string[]=["?entry a aslkg:SignLexicalEntry ; dct:identifier ?entryId ; ontolex:lexicalForm ?form ."];
  const filters:string[]=[];
  const fields=new Set(["?entry","?entryId"]);
  const semantic=["animal","attribute","emotion","event","food","locative","number","people","place"].find(x=>q.includes(x));
  if(semantic){ patterns.push("?entry aslkg:semanticField ?field . ?field skos:prefLabel ?fieldLabel ."); filters.push(`FILTER(LCASE(STR(?fieldLabel)) = "${semantic}")`); }
  if(q.includes("one-handed")||q.includes("one handed")){patterns.push('?form aslkg:signType ?st . ?st skos:prefLabel "One Handed"@en .');}
  for(const loc of ["head","body","hand","neutral"]){if(q.includes(loc)){patterns.push(`?form aslkg:majorLocation ?loc . ?loc skos:prefLabel "${loc[0].toUpperCase()+loc.slice(1)}"@en .`);break;}}
  const lemma=q.match(/lemma\s+["']?([a-z0-9_ -]+)/i); if(lemma){patterns.push("?entry ontolex:evokes ?concept . ?concept dct:identifier ?lemma .");filters.push(`FILTER(LCASE(STR(?lemma)) = "${lemma[1].trim().split(/\s+/)[0].toLowerCase()}")`);fields.add("?lemma");}
  if(q.includes("translation")){patterns.push("OPTIONAL { ?entry vartrans:translatableAs ?englishEntry . ?englishEntry ontolex:lexicalForm ?englishForm . ?englishForm ontolex:writtenRep ?translation . }");fields.add("?translation");}
  if(q.includes("handshape")){patterns.push("OPTIONAL { ?form aslkg:dominantHandshape ?hs . ?hs skos:prefLabel ?dominantHandshape . }");fields.add("?dominantHandshape");}
  if(q.includes("movement")){patterns.push("OPTIONAL { ?form aslkg:pathMovement ?pm . ?pm skos:prefLabel ?pathMovement . }");fields.add("?pathMovement");}
  if(q.includes("page")||q.includes("visual")||q.includes("video")){patterns.push("OPTIONAL { ?entry foaf:page ?page . }");fields.add("?page");}
  return `${PREFIXES}\n\nSELECT ${[...fields].join(" ")} WHERE {\n  ${patterns.join("\n  ")}\n  ${filters.join("\n  ")}\n}\nORDER BY ?entryId`;
}
