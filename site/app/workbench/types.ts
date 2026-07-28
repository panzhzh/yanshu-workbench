import type { Language } from "../config";
import type { ActivePage } from "../navigation";

export type LocalizedText = Record<Language, string>;
export type NumberRange = readonly [number, number];
export type WorkbenchValue =
  | string
  | number
  | boolean
  | readonly string[]
  | NumberRange;
export type WorkbenchValues = Record<string, WorkbenchValue>;

export interface WorkbenchOption {
  value: string;
  label: LocalizedText;
  description?: LocalizedText;
}

interface BaseControl {
  id: string;
  label: LocalizedText;
  description: LocalizedText;
  hint?: LocalizedText;
  span?: "half" | "full";
  visibleWhen?: (values: WorkbenchValues) => boolean;
}

export interface SelectControl extends BaseControl {
  kind: "select" | "segmented";
  defaultValue: string;
  options: readonly WorkbenchOption[];
}

export interface ToggleControl extends BaseControl {
  kind: "toggle";
  defaultValue: boolean;
  enabledLabel?: LocalizedText;
  disabledLabel?: LocalizedText;
}

export interface NumberControl extends BaseControl {
  kind: "number";
  defaultValue: number;
  min: number;
  max: number;
  step?: number;
  suffix?: LocalizedText;
}

export interface RangeControl extends BaseControl {
  kind: "range";
  defaultValue: NumberRange;
  min: number;
  max: number;
  step?: number;
  suffix?: LocalizedText;
}

export interface TextControl extends BaseControl {
  kind: "text" | "textarea";
  defaultValue: string;
  placeholder?: LocalizedText;
}

export interface MultiControl extends BaseControl {
  kind: "multi";
  defaultValue: readonly string[];
  minSelected?: number;
  options: readonly WorkbenchOption[];
}

export type WorkbenchControl =
  | SelectControl
  | ToggleControl
  | NumberControl
  | RangeControl
  | TextControl
  | MultiControl;

export interface WorkbenchCopy {
  eyebrow: string;
  title: string;
  subtitle: string;
  preset: string;
  reset: string;
  resetHint: string;
  inputTitle: string;
  inputItems: readonly string[];
  inputHint: string;
  promptTitle: string;
  promptPurpose: string;
  switchPromptLanguage: string;
  copy: string;
  copied: string;
  expand: string;
  collapse: string;
  clipboardError: string;
  on: string;
  off: string;
}

export interface WorkbenchDefinition {
  id: string;
  activePage: ActivePage;
  copy: Record<Language, WorkbenchCopy>;
  controls: readonly WorkbenchControl[];
  updateValues?: (
    current: Readonly<WorkbenchValues>,
    id: string,
    value: WorkbenchValue,
  ) => WorkbenchValues;
  buildPrompt: (
    values: Readonly<WorkbenchValues>,
    language: Language,
  ) => string;
}
