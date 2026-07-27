"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import SiteNavigation from "../SiteNavigation";
import PromptResizeHandle from "../PromptResizeHandle";
import {
  PRODUCT_CONFIG,
  type Language,
} from "../config";
import { buildPrompt } from "../../content/prompts/buildPrompt";
import { SUBMISSION_PROMPT_TEMPLATE } from "../../content/prompts/templates";
import type {
  CasZone,
  CitationIndex,
  JcrQuartile,
  PreferenceMode,
  SubmissionPreferences,
} from "../../content/prompts/types";
import {
  CAS_ZONES,
  CITATION_INDEXES,
  DEFAULT_SUBMISSION_PREFERENCES,
  JCR_QUARTILES,
  SUBMISSION_COPY,
} from "./config";

async function writeClipboard(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  textarea.remove();
  if (!copied) throw new Error("Clipboard unavailable");
}

interface ModeControlProps {
  label: string;
  value: PreferenceMode;
  labels: {
    any: string;
    yes: string;
    no: string;
  };
  onChange: (value: PreferenceMode) => void;
}

function ModeControl({
  label,
  value,
  labels,
  onChange,
}: ModeControlProps) {
  const options: PreferenceMode[] = ["any", "yes", "no"];

  return (
    <div className="filter-options" role="radiogroup" aria-label={label}>
      {options.map((option) => (
        <button
          type="button"
          role="radio"
          aria-checked={value === option}
          className={value === option ? "active" : ""}
          key={option}
          onClick={() => onChange(option)}
        >
          {labels[option]}
        </button>
      ))}
    </div>
  );
}

function toggleValue<T extends string>(values: T[], value: T) {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}

export default function SubmissionStrategy() {
  const [uiLanguage, setUiLanguage] = useState<Language>(
    PRODUCT_CONFIG.defaultLanguage,
  );
  const [promptLanguage, setPromptLanguage] = useState<Language>(
    PRODUCT_CONFIG.defaultPromptLanguage,
  );
  const [preferences, setPreferences] = useState<SubmissionPreferences>(
    DEFAULT_SUBMISSION_PREFERENCES,
  );
  const [expanded, setExpanded] = useState(true);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copy = SUBMISSION_COPY[uiLanguage];
  const journalStyle = PRODUCT_CONFIG.paperStyles.journal;
  const prompt = useMemo(
    () =>
      buildPrompt(SUBMISSION_PROMPT_TEMPLATE, {
        language: promptLanguage,
        styleId: "journal",
        styleLabel: journalStyle.label[promptLanguage],
        styleDirective: journalStyle.promptDirective[promptLanguage],
        hasWordLimit: false,
        unlimitedCoreSections: false,
        includeSectionNavigationSentence: false,
        allowTitleBrandCandidates: false,
        targetWords: journalStyle.defaultTargetWords,
        sectionBudgets: [],
        includeAppendix: false,
        appendixLabel: "",
        appendixDirective: "",
        submissionPreferences: preferences,
      }),
    [journalStyle, preferences, promptLanguage],
  );

  useEffect(() => {
    document.documentElement.lang = uiLanguage === "zh" ? "zh-CN" : "en";
    document.body.dataset.language = uiLanguage;
  }, [uiLanguage]);

  useEffect(
    () => () => {
      if (copyTimer.current) clearTimeout(copyTimer.current);
    },
    [],
  );

  function updatePreference<K extends keyof SubmissionPreferences>(
    key: K,
    value: SubmissionPreferences[K],
  ) {
    setPreferences((current) => ({ ...current, [key]: value }));
    setCopied(false);
  }

  function updateApcMinimum(rawValue: number) {
    if (!Number.isFinite(rawValue)) return;
    const value = Math.max(0, Math.round(rawValue));
    setPreferences((current) => ({
      ...current,
      apcMin: value,
      apcMax: Math.max(value, current.apcMax),
    }));
    setCopied(false);
  }

  function updateApcMaximum(rawValue: number) {
    if (!Number.isFinite(rawValue)) return;
    const value = Math.max(0, Math.round(rawValue));
    setPreferences((current) => ({
      ...current,
      apcMin: Math.min(current.apcMin, value),
      apcMax: value,
    }));
    setCopied(false);
  }

  function updateImpactFactorMinimum(rawValue: number) {
    if (!Number.isFinite(rawValue)) return;
    const value = Math.max(0, Math.round(rawValue * 10) / 10);
    setPreferences((current) => ({
      ...current,
      impactFactorMin: value,
      impactFactorMax: Math.max(value, current.impactFactorMax),
    }));
    setCopied(false);
  }

  function updateImpactFactorMaximum(rawValue: number) {
    if (!Number.isFinite(rawValue)) return;
    const value = Math.max(0, Math.round(rawValue * 10) / 10);
    setPreferences((current) => ({
      ...current,
      impactFactorMin: Math.min(current.impactFactorMin, value),
      impactFactorMax: value,
    }));
    setCopied(false);
  }

  function resetFilters() {
    setPreferences({ ...DEFAULT_SUBMISSION_PREFERENCES });
    setCopied(false);
    setCopyError(false);
  }

  async function copyPrompt() {
    try {
      await writeClipboard(prompt);
      setCopyError(false);
      setCopied(true);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
      setCopyError(true);
    }
  }

  const promptNextLanguage =
    promptLanguage === "zh" ? "English" : "中文";

  return (
    <div className="site-shell">
      <SiteNavigation
        language={uiLanguage}
        activePage="submission"
        mobileMenuOpen={mobileMenuOpen}
        onLanguageChange={(language) => {
          setUiLanguage(language);
          setCopied(false);
        }}
        onMenuToggle={() => setMobileMenuOpen((open) => !open)}
        onMenuClose={() => setMobileMenuOpen(false)}
      />

      <main className="site-main" id="main-content">
        <section className="config-section submission-config-section">
          <div className="section-kicker">
            <span>{copy.eyebrow}</span>
            <span className="rule" />
            <span>{copy.preset}</span>
          </div>

          <div className="config-heading">
            <div>
              <h1>{copy.title}</h1>
              <p>{copy.subtitle}</p>
            </div>
            <button
              className="text-button reset-button"
              type="button"
              onClick={resetFilters}
              title={copy.resetHint}
            >
              <span aria-hidden="true">↺</span>
              {copy.reset}
            </button>
          </div>

          <div className="submission-filter-grid">
            <fieldset className="submission-filter-card compact-filter">
              <legend>
                <span className="control-index">01</span>
                {copy.openAccess}
              </legend>
              <ModeControl
                label={copy.openAccess}
                value={preferences.openAccess}
                labels={copy}
                onChange={(value) =>
                  updatePreference("openAccess", value)
                }
              />
              <small>{copy.openAccessHint}</small>
            </fieldset>

            <fieldset
              className={`submission-filter-card apc-filter ${
                preferences.apc === "yes" ? "has-range" : ""
              }`}
            >
              <legend>
                <span className="control-index">02</span>
                {copy.apc}
              </legend>
              <ModeControl
                label={copy.apc}
                value={preferences.apc}
                labels={copy}
                onChange={(value) => updatePreference("apc", value)}
              />
              {preferences.apc === "yes" ? (
                <div className="apc-range" aria-label={copy.apcRange}>
                  <label>
                    <span>{copy.currency}</span>
                    <select
                      value={preferences.apcCurrency}
                      onChange={(event) =>
                        updatePreference(
                          "apcCurrency",
                          event.target
                            .value as SubmissionPreferences["apcCurrency"],
                        )
                      }
                    >
                      <option value="USD">USD</option>
                      <option value="CNY">CNY</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                    </select>
                  </label>
                  <label>
                    <span>{copy.minimum}</span>
                    <input
                      type="number"
                      min="0"
                      step="100"
                      value={preferences.apcMin}
                      onChange={(event) =>
                        updateApcMinimum(event.target.valueAsNumber)
                      }
                    />
                  </label>
                  <span aria-hidden="true">—</span>
                  <label>
                    <span>{copy.maximum}</span>
                    <input
                      type="number"
                      min="0"
                      step="100"
                      value={preferences.apcMax}
                      onChange={(event) =>
                        updateApcMaximum(event.target.valueAsNumber)
                      }
                    />
                  </label>
                </div>
              ) : (
                <small>{copy.apcHint}</small>
              )}
            </fieldset>

            <fieldset
              className={`submission-filter-card if-filter ${
                preferences.useImpactFactorRange ? "has-range" : ""
              }`}
            >
              <legend>
                <span className="control-index">03</span>
                {copy.impactFactor}
              </legend>
              <button
                className={`figure-rule-switch ${
                  preferences.useImpactFactorRange ? "active" : ""
                }`}
                type="button"
                role="switch"
                aria-label={copy.impactFactorToggle}
                aria-checked={preferences.useImpactFactorRange}
                onClick={() =>
                  updatePreference(
                    "useImpactFactorRange",
                    !preferences.useImpactFactorRange,
                  )
                }
              >
                <span className="switch-track" aria-hidden="true">
                  <span />
                </span>
                {preferences.useImpactFactorRange
                  ? copy.impactFactorOn
                  : copy.impactFactorOff}
              </button>
              {preferences.useImpactFactorRange ? (
                <div className="apc-range if-range">
                  <label>
                    <span>{copy.minimum}</span>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={preferences.impactFactorMin}
                      onChange={(event) =>
                        updateImpactFactorMinimum(event.target.valueAsNumber)
                      }
                    />
                  </label>
                  <span aria-hidden="true">—</span>
                  <label>
                    <span>{copy.maximum}</span>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={preferences.impactFactorMax}
                      onChange={(event) =>
                        updateImpactFactorMaximum(event.target.valueAsNumber)
                      }
                    />
                  </label>
                </div>
              ) : null}
              <small>{copy.impactFactorHint}</small>
            </fieldset>

            <fieldset className="submission-filter-card compact-filter">
              <legend>
                <span className="control-index">04</span>
                {copy.reviewArticles}
              </legend>
              <button
                className={`figure-rule-switch ${
                  preferences.requireReviewArticles ? "active" : ""
                }`}
                type="button"
                role="switch"
                aria-checked={preferences.requireReviewArticles}
                onClick={() =>
                  updatePreference(
                    "requireReviewArticles",
                    !preferences.requireReviewArticles,
                  )
                }
              >
                <span className="switch-track" aria-hidden="true">
                  <span />
                </span>
                {preferences.requireReviewArticles
                  ? copy.reviewArticlesOn
                  : copy.reviewArticlesOff}
              </button>
              <small>{copy.reviewArticlesHint}</small>
            </fieldset>

            <fieldset className="submission-filter-card">
              <legend>
                <span className="control-index">05</span>
                {copy.jcr}
              </legend>
              <div className="filter-chip-list">
                {JCR_QUARTILES.map((quartile) => (
                  <button
                    type="button"
                    aria-pressed={preferences.jcrQuartiles.includes(
                      quartile,
                    )}
                    className={
                      preferences.jcrQuartiles.includes(quartile)
                        ? "active"
                        : ""
                    }
                    key={quartile}
                    onClick={() =>
                      updatePreference(
                        "jcrQuartiles",
                        toggleValue<JcrQuartile>(
                          preferences.jcrQuartiles,
                          quartile,
                        ),
                      )
                    }
                  >
                    {quartile}
                  </button>
                ))}
              </div>
              <small>{copy.jcrHint}</small>
            </fieldset>

            <fieldset className="submission-filter-card">
              <legend>
                <span className="control-index">06</span>
                {copy.cas}
              </legend>
              <div className="filter-chip-list">
                {CAS_ZONES.map((zone) => (
                  <button
                    type="button"
                    aria-pressed={preferences.casZones.includes(zone)}
                    className={
                      preferences.casZones.includes(zone) ? "active" : ""
                    }
                    key={zone}
                    onClick={() =>
                      updatePreference(
                        "casZones",
                        toggleValue<CasZone>(
                          preferences.casZones,
                          zone,
                        ),
                      )
                    }
                  >
                    {uiLanguage === "zh"
                      ? `${zone}${copy.zone}`
                      : `${copy.zone} ${zone}`}
                  </button>
                ))}
              </div>
              <small>{copy.casHint}</small>
            </fieldset>

            <fieldset className="submission-filter-card index-filter">
              <legend>
                <span className="control-index">07</span>
                {copy.indexes}
              </legend>
              <div className="filter-chip-list index-chip-list">
                {CITATION_INDEXES.map((index) => (
                  <button
                    type="button"
                    aria-pressed={preferences.citationIndexes.includes(
                      index,
                    )}
                    className={
                      preferences.citationIndexes.includes(index)
                        ? "active"
                        : ""
                    }
                    key={index}
                    onClick={() =>
                      updatePreference(
                        "citationIndexes",
                        toggleValue<CitationIndex>(
                          preferences.citationIndexes,
                          index,
                        ),
                      )
                    }
                  >
                    {index}
                  </button>
                ))}
              </div>
              <small>{copy.indexesHint}</small>
            </fieldset>
          </div>
        </section>

        <PromptResizeHandle language={uiLanguage} />

        <section className="content-section prompt-rail submission-prompt-section">
          {copyError && (
            <p className="copy-error" role="alert">
              {copy.clipboardError}
            </p>
          )}

          <article className={`prompt-card ${expanded ? "expanded" : ""}`}>
            <div className="prompt-card-main">
              <div className="prompt-card-header">
                <div>
                  <h3>
                    {SUBMISSION_PROMPT_TEMPLATE.title[promptLanguage]}
                  </h3>
                  <p>
                    {SUBMISSION_PROMPT_TEMPLATE.purpose[promptLanguage]}
                  </p>
                </div>
                <div className="prompt-card-actions">
                  <button
                    className="prompt-language-button"
                    type="button"
                    aria-label={`${copy.switchPromptLanguage}：${promptNextLanguage}`}
                    onClick={() => {
                      setPromptLanguage((language) =>
                        language === "zh" ? "en" : "zh",
                      );
                      setCopied(false);
                    }}
                  >
                    {promptNextLanguage}
                  </button>
                  <button
                    className={`copy-button ${copied ? "copied" : ""}`}
                    type="button"
                    onClick={copyPrompt}
                  >
                    <span aria-hidden="true">{copied ? "✓" : "⧉"}</span>
                    {copied ? copy.copied : copy.copy}
                  </button>
                  <button
                    className="expand-button"
                    type="button"
                    aria-expanded={expanded}
                    aria-controls="submission-prompt"
                    onClick={() => setExpanded((current) => !current)}
                  >
                    {expanded ? copy.collapse : copy.expand}
                    <span aria-hidden="true">{expanded ? "−" : "+"}</span>
                  </button>
                </div>
              </div>
              {expanded && (
                <pre className="prompt-content" id="submission-prompt">
                  {prompt}
                </pre>
              )}
            </div>
          </article>

          <span className="sr-only" role="status" aria-live="polite">
            {copied ? copy.copied : ""}
          </span>
        </section>

        <footer className="site-footer">
          <span>
            {PRODUCT_CONFIG.productName} · {PRODUCT_CONFIG.productNameEn}
          </span>
          <span>{copy.preset}</span>
        </footer>
      </main>
    </div>
  );
}
