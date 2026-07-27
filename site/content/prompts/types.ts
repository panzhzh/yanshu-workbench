export type Language = "zh" | "en";
export type PaperStyleId = "conference" | "journal";
export type LocalizedText = Record<Language, string>;
export type PreferenceMode = "any" | "yes" | "no";
export type ApcCurrency = "USD" | "CNY" | "EUR" | "GBP";
export type JcrQuartile = "Q1" | "Q2" | "Q3" | "Q4";
export type CasZone = "1" | "2" | "3" | "4";
export type CitationIndex = "SCIE" | "SSCI" | "AHCI" | "ESCI";

export interface PromptTask {
  heading: LocalizedText;
  body: LocalizedText;
}

export interface PromptTemplate {
  id: string;
  sourceFile: string;
  number: number;
  contentKind?: "standard" | "framework-figure";
  profile: "manuscript" | "targeting";
  title: LocalizedText;
  purpose: LocalizedText;
  role: LocalizedText;
  inputs: LocalizedText;
  scope: LocalizedText;
  tasks: PromptTask[];
  deliverables: LocalizedText;
  fileNames?: LocalizedText;
  finalChecks: LocalizedText;
  styleBranches?: Record<PaperStyleId, LocalizedText>;
  showStyleDirective?: boolean;
  showAppendixConfiguration?: boolean;
  showLengthBudget?: boolean;
}

export interface PromptSectionBudget {
  id: string;
  label: string;
  words: number;
}

export interface SubmissionPreferences {
  openAccess: PreferenceMode;
  apc: PreferenceMode;
  apcCurrency: ApcCurrency;
  apcMin: number;
  apcMax: number;
  useImpactFactorRange: boolean;
  impactFactorMin: number;
  impactFactorMax: number;
  requireReviewArticles: boolean;
  jcrQuartiles: JcrQuartile[];
  casZones: CasZone[];
  citationIndexes: CitationIndex[];
  excludedPublishers: string[];
}

export interface PromptBuildContext {
  language: Language;
  styleId: PaperStyleId;
  styleLabel: string;
  styleDirective: string;
  includeSectionNavigationSentence: boolean;
  hasWordLimit: boolean;
  unlimitedCoreSections: boolean;
  targetWords: number;
  sectionBudgets: PromptSectionBudget[];
  includeAppendix: boolean;
  appendixLabel: string;
  appendixDirective: string;
  frameworkFigure?: FrameworkFigureLayoutPreferences;
  submissionPreferences?: SubmissionPreferences;
}
import type { FrameworkFigureLayoutPreferences } from "../../app/figures/config";
