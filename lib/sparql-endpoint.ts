import { SignResult } from "./types";

function value(binding:any,name:string){return binding?.[name]?.value ?? null;}
export async function executeSparqlEndpoint(sparql:string):Promise<SignResult[]>{
  const endpoint=process.env.SPARQL_ENDPOINT_URL;
  if(!endpoint) throw new Error("SPARQL_ENDPOINT_URL is not configured.");
  const response=await fetch(endpoint,{method:"POST",headers:{"Content-Type":"application/sparql-query","Accept":"application/sparql-results+json"},body:sparql,cache:"no-store"});
  if(!response.ok) throw new Error(`SPARQL endpoint returned ${response.status}: ${await response.text()}`);
  const json=await response.json();
  return (json.results?.bindings??[]).map((b:any)=>({
    entryID:value(b,"entryId") ?? value(b,"id") ?? value(b,"entry")?.split("/").pop() ?? "result",
    lemmaID:value(b,"lemma"), translation:value(b,"translation"), lexicalClass:value(b,"pos"), semanticField:value(b,"semanticField") ?? value(b,"fieldLabel") ?? value(b,"field"),
    signType:value(b,"signType"), handshape:value(b,"dominantHandshape") ?? value(b,"handshape"), movement:value(b,"pathMovement") ?? value(b,"movement"), location:value(b,"majorLocation") ?? value(b,"location"),
    minorLocation:value(b,"minorLocation"), frequency:value(b,"frequency") ? Number(value(b,"frequency")) : null, iconicity:value(b,"iconicity") ? Number(value(b,"iconicity")) : null,
    complexity:value(b,"complexity") ? Number(value(b,"complexity")) : null, neighborhoodDensity:value(b,"neighborhoodDensity") ? Number(value(b,"neighborhoodDensity")) : null,
    handshapeImage:value(b,"image"), aslLexURL:value(b,"page") ?? value(b,"url")
  }));
}
