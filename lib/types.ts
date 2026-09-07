export interface SignResult {
  entryID: string;
  lemmaID?: string | null;
  translation?: string | null;
  lexicalClass?: string | null;
  semanticField?: string | null;
  signType?: string | null;
  handshape?: string | null;
  nondominantHandshape?: string | null;
  selectedFingers?: string | null;
  numberSelected?: number | null;
  indexSelected?: boolean | null;
  middleSelected?: boolean | null;
  ringSelected?: boolean | null;
  pinkySelected?: boolean | null;
  thumbSelected?: boolean | null;
  thumbPosition?: string | null;
  movement?: string | null;
  repeatedMovement?: boolean | null;
  location?: string | null;
  minorLocation?: string | null;
  contact?: boolean | null;
  frequency?: number | null;
  iconicity?: number | null;
  complexity?: number | null;
  neighborhoodDensity?: number | null;
  handshapeImage?: string | null;
  aslLexURL?: string | null;
}

export interface AskResponse {
  question: string;
  sparql: string;
  count: number;
  results: SignResult[];
  mode: string;
  note: string;
}
