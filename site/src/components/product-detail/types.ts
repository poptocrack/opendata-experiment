export type Milestone = {
  phase: string;
  title: string;
  description: string;
  duration: string;
  deliverables: string[];
};

export type ValidationCheck = {
  check: string;
  how: string;
  successCriteria: string;
};

export type EarlyAdopter = {
  who: string;
  where: string;
  howToReach: string;
};

export type TechStack = {
  frontend: string;
  backend: string;
  database: string;
  hosting: string;
  apis: string[];
  notes: string;
};

export type Risk = {
  risk: string;
  mitigation: string;
};

export type SearchVol = {
  keyword: string;
  monthlyVolume: string;
  difficulty: string;
  intent: string;
};

export type TamSamSom = {
  tam: string;
  sam: string;
  som: string;
  methodology: string;
};

export type CompetitorDeep = {
  name: string;
  url: string;
  pricing: string;
  trafficEstimate: string;
  reviews: string;
  strengths: string;
  weaknesses: string;
};

export type LegalConstraint = {
  topic: string;
  status: string;
  detail: string;
  source: string;
};

export type CacEstimate = {
  channel: string;
  cacEstimate: string;
  conversionRate: string;
  ltv: string;
  ltvCacRatio: string;
};

export type ConfidenceEntry = { level: string; detail: string };
export type ConfidenceLevels = Record<string, ConfidenceEntry>;

export type ParsedProductDetail = {
  milestones: Milestone[];
  validationChecks: ValidationCheck[];
  earlyAdopters: EarlyAdopter[];
  techStack: TechStack | null;
  risks: Risk[];
  searchVolumes: SearchVol[];
  tamSamSom: TamSamSom | null;
  competitorDeeps: CompetitorDeep[];
  legalConstraints: LegalConstraint[];
  cacEstimates: CacEstimate[];
  confidenceLevels: ConfidenceLevels | null;
  viabilityScore: Record<string, number | { score: number; detail?: string }> | null;
};
