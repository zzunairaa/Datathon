const FORBIDDEN=["INSERT","DELETE","DROP","CLEAR","LOAD","CREATE","MOVE","COPY","ADD","WITH","SERVICE","CONSTRUCT","DESCRIBE"];
const ALLOWED=new Set(["semanticField","signType","dominantHandshape","nondominantHandshape","nondominantHandConfigurationStatus","selectedFingerConfiguration","thumbPosition","pathMovement","majorLocation","minorLocation","numberOfSelectedFingers","indexSelected","middleSelected","ringSelected","pinkySelected","thumbSelected","repeatedMovement","contact","frequency","nonSignerIconicity","phonologicalComplexity","neighborhoodDensity"]);
export function validateSparql(query:string){
  if(!/\bSELECT\b/i.test(query)) throw new Error("Only SELECT queries are allowed.");
  for(const k of FORBIDDEN) if(new RegExp(`\\b${k}\\b`,`i`).test(query)) throw new Error(`Forbidden SPARQL operation: ${k}`);
  const used=[...query.matchAll(/\baslkg:([A-Za-z0-9_]+)/g)].map(m=>m[1]);
  for(const p of used) if(p!=="SignLexicalEntry"&&p!=="SignForm"&&!ALLOWED.has(p)) throw new Error(`Unknown ASL-KG term generated: aslkg:${p}`);
  return true;
}
