import { realSigns } from "./real-data";
import { SignResult } from "./types";

export function queryRealData(question:string):SignResult[]{
  const q=question.toLowerCase(); let rows=[...realSigns];
  const semantic=["animal","attribute","emotion","event","food","locative","number","people","place"].find(x=>q.includes(x));
  if(semantic) rows=rows.filter(s=>s.semanticField?.toLowerCase()===semantic);
  if(q.includes("one-handed")||q.includes("one handed")) rows=rows.filter(s=>s.signType?.toLowerCase()==="one handed");
  if(q.includes("symmetrical")) rows=rows.filter(s=>s.signType?.toLowerCase().includes("symmetrical"));
  for(const loc of ["head","body","hand","neutral"]){if(q.includes(loc)){rows=rows.filter(s=>s.location?.toLowerCase()===loc);break;}}
  const lemma=q.match(/lemma\s+["']?([a-z0-9_]+)/i); if(lemma) rows=rows.filter(s=>s.lemmaID?.toLowerCase()===lemma[1].toLowerCase());
  const entry=q.match(/(?:sign|entry)\s+["']?([a-z0-9_]+)/i); if(entry&&!semantic&&!q.includes("signs")) {const id=entry[1].toLowerCase();const hit=rows.filter(s=>s.entryID.toLowerCase()===id);if(hit.length)rows=hit;}
  const hs=q.match(/handshape\s+["']?([a-z0-9_]+)/i); if(hs) rows=rows.filter(s=>s.handshape?.toLowerCase()===hs[1].toLowerCase());
  const movement=["straight","curved","z-shaped"].find(x=>q.includes(x)); if(movement) rows=rows.filter(s=>s.movement?.toLowerCase()===movement);
  if(q.includes("no path movement")||q.includes("without path movement")||q.includes("do not have a path movement")) rows=rows.filter(s=>!s.movement);
  if(q.includes("contact")) rows=rows.filter(s=>s.contact===true);
  if(q.includes("repeated movement")) rows=rows.filter(s=>s.repeatedMovement===true);
  const freq=q.match(/frequency\s+(?:greater than or equal to|at least|>=)\s*([0-9.]+)/i); if(freq) rows=rows.filter(s=>(s.frequency??-Infinity)>=Number(freq[1]));
  return rows;
}
