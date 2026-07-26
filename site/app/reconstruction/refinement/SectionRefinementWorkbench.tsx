"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import PromptResizeHandle from "../../PromptResizeHandle";
import SiteNavigation from "../../SiteNavigation";
import { PRODUCT_CONFIG, type Language } from "../../config";
import {
  buildSectionRefinementPrompt,
  CITATION_MODES,
  CITATION_MODE_IDS,
  createSectionPreferences,
  DEFAULT_SECTION_REFINEMENT_PREFERENCES,
  DISCUSSION_SCOPES,
  DISCUSSION_SCOPE_IDS,
  EXPERIMENTAL_FOCUSES,
  EXPERIMENTAL_FOCUS_IDS,
  getLengthProfile,
  getRefinementScopeLabel,
  REFINEMENT_COPY,
  REFINEMENT_SECTIONS,
  REFINEMENT_SECTION_IDS,
  REWRITE_DEPTHS,
  REWRITE_DEPTH_IDS,
  scopeIncludesDiscussion,
  scopeSupportsCitations,
  scopeUsesVisualEvidence,
  scopeUsesWeToggle,
  type CitationModeId,
  type DiscussionScopeId,
  type ExperimentalFocusId,
  type MethodOverviewMode,
  type ParagraphsPerVisual,
  type RefinementSectionId,
  type RelatedWorkParagraphs,
  type RewriteDepthId,
  type SectionRefinementPreferences,
} from "./config";

type NumericPreferenceKey =
  | "sectionMinWords"
  | "sectionMaxWords"
  | "paragraphMinWords"
  | "paragraphMaxWords"
  | "sentenceMinWords"
  | "sentenceMaxWords"
  | "abstractResultNumbersMin"
  | "abstractResultNumbersMax"
  | "abstractKeywordCountMin"
  | "abstractKeywordCountMax"
  | "abstractKeywordWordsMin"
  | "abstractKeywordWordsMax"
  | "introductionCitationMin"
  | "introductionCitationMax"
  | "relatedCitationMin"
  | "relatedCitationMax"
  | "visualParagraphMinWords"
  | "visualParagraphMaxWords"
  | "keyNumbersPerParagraphMin"
  | "keyNumbersPerParagraphMax";

type SingleNumericPreferenceKey =
  | "introductionMaxCitationsPerSentence"
  | "introductionContributionCount"
  | "introductionContributionWords"
  | "relatedMaxCitationsPerSentence"
  | "discussionMaxSpecificNumbers"
  | "methodOverviewMaxWords"
  | "methodOverviewParagraphs"
  | "methodPseudocodeMaxLines";

type TogglePreferenceKey =
  | "introductionContributionStartsWithWe"
  | "methodIncludePseudocode"
  | "methodIncludeComplexityAnalysis"
  | "allowVisualReorder"
  | "allowVisualDeletion"
  | "allowVisualAppendixMove";

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

export default function SectionRefinementWorkbench() {
  const [uiLanguage, setUiLanguage] = useState<Language>(
    PRODUCT_CONFIG.defaultLanguage,
  );
  const [promptLanguage, setPromptLanguage] = useState<Language>(
    PRODUCT_CONFIG.defaultPromptLanguage,
  );
  const [preferences, setPreferences] =
    useState<SectionRefinementPreferences>({
      ...DEFAULT_SECTION_REFINEMENT_PREFERENCES,
    });
  const [expanded, setExpanded] = useState(true);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copy = REFINEMENT_COPY[uiLanguage];
  const activeSection = REFINEMENT_SECTIONS[preferences.sectionId];
  const showDiscussionOrganization =
    preferences.sectionId === "discussion";
  const showLimitationMode = scopeIncludesDiscussion(preferences);
  const showVisualEvidence = scopeUsesVisualEvidence(preferences);
  const showCitationMode = scopeSupportsCitations(preferences);
  const showWeToggle = scopeUsesWeToggle(preferences);
  const promptScope = getRefinementScopeLabel(preferences, promptLanguage);
  const visibleScope = getRefinementScopeLabel(preferences, uiLanguage);
  const prompt = useMemo(
    () => buildSectionRefinementPrompt(preferences, promptLanguage),
    [preferences, promptLanguage],
  );
  const promptNextLanguage =
    promptLanguage === "zh" ? "English" : "中文";
  const contractControlIndex = showDiscussionOrganization ? "03" : "02";
  const lengthControlIndex = showDiscussionOrganization ? "04" : "03";
  const expressionControlIndex = showDiscussionOrganization ? "05" : "04";

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

  function clearCopyState() {
    setCopied(false);
    setCopyError(false);
  }

  function updatePreference<K extends keyof SectionRefinementPreferences>(
    key: K,
    value: SectionRefinementPreferences[K],
  ) {
    setPreferences((current) => ({ ...current, [key]: value }));
    clearCopyState();
  }

  function selectSection(sectionId: RefinementSectionId) {
    setPreferences(createSectionPreferences(sectionId));
    clearCopyState();
  }

  function selectDiscussionScope(
    discussionScope: DiscussionScopeId,
  ) {
    setPreferences((current) => {
      const profile = getLengthProfile(
        current.sectionId,
        discussionScope,
        current.experimentalFocus,
      );
      return {
        ...current,
        discussionScope,
        limitationMode: "separate",
        sectionLengthMode: profile.mode,
        sectionMinWords: profile.section[0],
        sectionMaxWords: profile.section[1],
        paragraphMinWords: profile.paragraph[0],
        paragraphMaxWords: profile.paragraph[1],
        sentenceMinWords: profile.sentence[0],
        sentenceMaxWords: profile.sentence[1],
      };
    });
    clearCopyState();
  }

  function selectExperimentalFocus(
    experimentalFocus: ExperimentalFocusId,
  ) {
    setPreferences((current) => {
      const profile = getLengthProfile(
        current.sectionId,
        current.discussionScope,
        experimentalFocus,
      );
      return {
        ...current,
        experimentalFocus,
        sectionLengthMode: profile.mode,
        sectionMinWords: profile.section[0],
        sectionMaxWords: profile.section[1],
        paragraphMinWords: profile.paragraph[0],
        paragraphMaxWords: profile.paragraph[1],
        sentenceMinWords: profile.sentence[0],
        sentenceMaxWords: profile.sentence[1],
      };
    });
    clearCopyState();
  }

  function updateRange(
    minimumKey: NumericPreferenceKey,
    maximumKey: NumericPreferenceKey,
    rawValue: number,
    side: "minimum" | "maximum",
    floor = 0,
  ) {
    if (!Number.isFinite(rawValue)) return;
    const value = Math.max(floor, Math.round(rawValue));
    setPreferences((current) => {
      const minimum = current[minimumKey];
      const maximum = current[maximumKey];
      if (side === "minimum") {
        return {
          ...current,
          [minimumKey]: value,
          [maximumKey]: Math.max(value, maximum),
        };
      }
      return {
        ...current,
        [minimumKey]: Math.min(minimum, value),
        [maximumKey]: value,
      };
    });
    clearCopyState();
  }

  function updateSingleNumber(
    key: SingleNumericPreferenceKey,
    rawValue: number,
    floor = 0,
  ) {
    if (!Number.isFinite(rawValue)) return;
    updatePreference(key, Math.max(floor, Math.round(rawValue)));
  }

  function resetDefaults() {
    setPreferences(createSectionPreferences(preferences.sectionId));
    setPromptLanguage(PRODUCT_CONFIG.defaultPromptLanguage);
    clearCopyState();
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

  function renderRange(
    label: string,
    minimumKey: NumericPreferenceKey,
    maximumKey: NumericPreferenceKey,
    step: number,
    unit: string = copy.words,
    floor = 0,
  ) {
    return (
      <div className="refinement-range-row">
        <strong>{label}</strong>
        <label>
          <span>{copy.minimum}</span>
          <input
            type="number"
            min={floor}
            step={step}
            value={preferences[minimumKey]}
            onChange={(event) =>
              updateRange(
                minimumKey,
                maximumKey,
                event.target.valueAsNumber,
                "minimum",
                floor,
              )
            }
          />
        </label>
        <span aria-hidden="true">–</span>
        <label>
          <span>{copy.maximum}</span>
          <input
            type="number"
            min={floor}
            step={step}
            value={preferences[maximumKey]}
            onChange={(event) =>
              updateRange(
                minimumKey,
                maximumKey,
                event.target.valueAsNumber,
                "maximum",
                floor,
              )
            }
          />
        </label>
        <small>{unit}</small>
      </div>
    );
  }

  function renderSingleNumber(
    label: string,
    key: SingleNumericPreferenceKey,
    unit: string,
    floor = 0,
  ) {
    return (
      <label className="refinement-number-field">
        <span>{label}</span>
        <span>
          <input
            type="number"
            min={floor}
            step="1"
            value={preferences[key]}
            onChange={(event) =>
              updateSingleNumber(key, event.target.valueAsNumber, floor)
            }
          />
          <small>{unit}</small>
        </span>
      </label>
    );
  }

  function renderSpecializedToggle(
    label: string,
    key: TogglePreferenceKey,
  ) {
    const active = preferences[key];
    return (
      <button
        type="button"
        role="switch"
        aria-checked={active}
        className={active ? "active" : ""}
        onClick={() => updatePreference(key, !active)}
      >
        <span>
          <strong>{label}</strong>
          <small>{active ? copy.on : copy.off}</small>
        </span>
        <i aria-hidden="true">
          <b />
        </i>
      </button>
    );
  }

  function renderSectionContract() {
    if (preferences.sectionId === "abstract") {
      return (
        <>
          <div className="refinement-range-list">
            {renderRange(
              copy.abstractNumbers,
              "abstractResultNumbersMin",
              "abstractResultNumbersMax",
              1,
              copy.values,
            )}
            {renderRange(
              copy.abstractKeywords,
              "abstractKeywordCountMin",
              "abstractKeywordCountMax",
              1,
              copy.values,
              1,
            )}
            {renderRange(
              copy.abstractKeywordWords,
              "abstractKeywordWordsMin",
              "abstractKeywordWordsMax",
              1,
              copy.words,
              1,
            )}
          </div>
          <p className="refinement-specific-note">
            {copy.abstractNumbersHint}
          </p>
          <p className="refinement-specific-note">
            {copy.abstractKeywordsHint}
          </p>
        </>
      );
    }

    if (preferences.sectionId === "introduction") {
      return (
        <>
          <div className="refinement-specific-grid">
            <div className="refinement-range-list">
              {renderRange(
                copy.introductionCitations,
                "introductionCitationMin",
                "introductionCitationMax",
                1,
                copy.papers,
                1,
              )}
            </div>
            {renderSingleNumber(
              copy.maxCitationsPerSentence,
              "introductionMaxCitationsPerSentence",
              copy.papers,
              1,
            )}
          </div>
          <div className="refinement-specific-grid">
            {renderSingleNumber(
              copy.contributionCount,
              "introductionContributionCount",
              copy.values,
              1,
            )}
            {renderSingleNumber(
              copy.contributionWords,
              "introductionContributionWords",
              copy.words,
              1,
            )}
          </div>
          <div className="refinement-language-switches single">
            {renderSpecializedToggle(
              copy.contributionStartsWithWe,
              "introductionContributionStartsWithWe",
            )}
          </div>
          <div className="refinement-contract-note">
            <strong>{copy.contributionRule}</strong>
            <p>{copy.contributionRuleText}</p>
          </div>
          <small>{copy.citationCountHint}</small>
        </>
      );
    }

    if (preferences.sectionId === "related-work") {
      return (
        <>
          <div className="refinement-specialized-heading">
            <strong>{copy.relatedParagraphs}</strong>
            <div
              className="refinement-segmented"
              role="radiogroup"
              aria-label={copy.relatedParagraphs}
            >
              {([1, 2] as RelatedWorkParagraphs[]).map((count) => (
                <button
                  type="button"
                  role="radio"
                  aria-checked={
                    preferences.relatedParagraphsPerSubsection === count
                  }
                  className={
                    preferences.relatedParagraphsPerSubsection === count
                      ? "active"
                      : ""
                  }
                  key={count}
                  onClick={() => {
                    setPreferences((current) => ({
                      ...current,
                      relatedParagraphsPerSubsection: count,
                      paragraphMinWords: count === 1 ? 110 : 65,
                      paragraphMaxWords: count === 1 ? 170 : 95,
                    }));
                    clearCopyState();
                  }}
                >
                  {count === 1 ? copy.oneParagraph : copy.twoParagraphs}
                </button>
              ))}
            </div>
          </div>
          <div className="refinement-specific-grid">
            <div className="refinement-range-list">
              {renderRange(
                copy.relatedCitations,
                "relatedCitationMin",
                "relatedCitationMax",
                1,
                copy.papers,
                1,
              )}
            </div>
            {renderSingleNumber(
              copy.maxCitationsPerSentence,
              "relatedMaxCitationsPerSentence",
              copy.papers,
              1,
            )}
          </div>
          <div className="refinement-contract-note">
            <p>{copy.relatedRuleText}</p>
          </div>
          <small>{copy.citationCountHint}</small>
        </>
      );
    }

    if (preferences.sectionId === "method") {
      return (
        <>
          <div className="refinement-specialized-heading">
            <strong>{copy.methodOverview}</strong>
            <div
              className="refinement-segmented"
              role="radiogroup"
              aria-label={copy.methodOverview}
            >
              {(
                [
                  "preserve",
                  "standalone",
                  "integrated",
                ] as MethodOverviewMode[]
              ).map((mode) => (
                <button
                  type="button"
                  role="radio"
                  aria-checked={preferences.methodOverviewMode === mode}
                  className={
                    preferences.methodOverviewMode === mode ? "active" : ""
                  }
                  key={mode}
                  onClick={() => updatePreference("methodOverviewMode", mode)}
                >
                  {mode === "preserve"
                    ? copy.overviewPreserve
                    : mode === "standalone"
                      ? copy.overviewStandalone
                      : copy.overviewIntegrated}
                </button>
              ))}
            </div>
          </div>

          {preferences.methodOverviewMode === "standalone" && (
            <div className="refinement-specific-grid">
              {renderSingleNumber(
                copy.overviewWords,
                "methodOverviewMaxWords",
                copy.words,
                1,
              )}
              {renderSingleNumber(
                copy.overviewParagraphs,
                "methodOverviewParagraphs",
                copy.values,
                1,
              )}
            </div>
          )}

          <div className="refinement-language-switches">
            {renderSpecializedToggle(
              copy.includePseudocode,
              "methodIncludePseudocode",
            )}
            {renderSpecializedToggle(
              copy.includeComplexity,
              "methodIncludeComplexityAnalysis",
            )}
          </div>

          {preferences.methodIncludePseudocode && (
            <div className="refinement-specific-grid refinement-method-line-limit">
              {renderSingleNumber(
                copy.pseudocodeLines,
                "methodPseudocodeMaxLines",
                copy.lines,
                1,
              )}
            </div>
          )}

          <div className="refinement-contract-note">
            <strong>{copy.methodStructure}</strong>
            <p>{copy.methodRuleText}</p>
          </div>
          <small>{copy.methodStructureHint}</small>
        </>
      );
    }

    if (preferences.sectionId === "conclusion") {
      return (
        <div className="refinement-contract-note">
          <p>{copy.conclusionRuleText}</p>
        </div>
      );
    }

    return (
      <>
        {preferences.sectionId === "experiments-results" && (
          <>
            <div
              className="refinement-organization-options refinement-focus-options"
              role="radiogroup"
              aria-label={copy.experimentalFocus}
            >
              {EXPERIMENTAL_FOCUS_IDS.map((focusId) => {
                const option = EXPERIMENTAL_FOCUSES[focusId];
                const active = preferences.experimentalFocus === focusId;
                return (
                  <button
                    type="button"
                    role="radio"
                    aria-checked={active}
                    className={active ? "active" : ""}
                    key={focusId}
                    onClick={() => selectExperimentalFocus(focusId)}
                  >
                    <strong>{option.label[uiLanguage]}</strong>
                    <small>{option.description[uiLanguage]}</small>
                  </button>
                );
              })}
            </div>
            <small>{copy.experimentalFocusHint}</small>
          </>
        )}

        {showVisualEvidence && (
          <>
            <div className="refinement-specialized-heading">
              <strong>{copy.visualParagraphs}</strong>
              <div
                className="refinement-segmented"
                role="radiogroup"
                aria-label={copy.visualParagraphs}
              >
                {([1, 2] as ParagraphsPerVisual[]).map((count) => (
                  <button
                    type="button"
                    role="radio"
                    aria-checked={
                      preferences.visualParagraphsPerItem === count
                    }
                    className={
                      preferences.visualParagraphsPerItem === count
                        ? "active"
                        : ""
                    }
                    key={count}
                    onClick={() =>
                      updatePreference("visualParagraphsPerItem", count)
                    }
                  >
                    {count === 1 ? copy.oneParagraph : copy.twoParagraphs}
                  </button>
                ))}
              </div>
            </div>
            <div className="refinement-range-list">
              {renderRange(
                copy.visualParagraphLength,
                "visualParagraphMinWords",
                "visualParagraphMaxWords",
                5,
              )}
              {renderRange(
                copy.keyNumbersPerParagraph,
                "keyNumbersPerParagraphMin",
                "keyNumbersPerParagraphMax",
                1,
                copy.values,
              )}
            </div>
            <p className="refinement-specific-note">
              {copy.visualRuleText}
            </p>
            <div className="refinement-contract-note refinement-visual-operations-label">
              <strong>{copy.visualOperations}</strong>
            </div>
            <div className="refinement-language-switches refinement-visual-operation-switches">
              {renderSpecializedToggle(
                copy.allowVisualReorder,
                "allowVisualReorder",
              )}
              {renderSpecializedToggle(
                copy.allowVisualDeletion,
                "allowVisualDeletion",
              )}
              {renderSpecializedToggle(
                copy.allowVisualAppendixMove,
                "allowVisualAppendixMove",
              )}
            </div>
            <small>{copy.visualOperationsHint}</small>
          </>
        )}

        {showLimitationMode && (
          <div
            className={`refinement-discussion-specific ${
              showVisualEvidence ? "with-divider" : ""
            }`}
          >
            {renderSingleNumber(
              copy.discussionNumbers,
              "discussionMaxSpecificNumbers",
              copy.values,
            )}
            <p className="refinement-specific-note">
              {copy.discussionRuleText}
            </p>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="site-shell">
      <SiteNavigation
        language={uiLanguage}
        activePage="refinement"
        mobileMenuOpen={mobileMenuOpen}
        onLanguageChange={(language) => {
          setUiLanguage(language);
          clearCopyState();
        }}
        onMenuToggle={() => setMobileMenuOpen((open) => !open)}
        onMenuClose={() => setMobileMenuOpen(false)}
      />

      <main className="site-main" id="main-content">
        <section className="config-section refinement-config-section">
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
              title={copy.resetHint}
              onClick={resetDefaults}
            >
              <span aria-hidden="true">↺</span>
              {copy.reset}
            </button>
          </div>

          <div className="refinement-material-strip">
            <div>
              <span className="control-index" aria-hidden="true">
                IN
              </span>
              <strong>{copy.materials}</strong>
            </div>
            <div className="refinement-material-items">
              {copy.materialItems.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
            <p>{copy.materialsHint}</p>
          </div>

          <div className="refinement-control-grid">
            <fieldset className="refinement-control-card refinement-target-card">
              <legend>
                <span className="control-index">01</span>
                {copy.targetSection}
              </legend>
              <div
                className="refinement-section-options"
                role="radiogroup"
                aria-label={copy.targetSection}
              >
                {REFINEMENT_SECTION_IDS.map((sectionId) => {
                  const section = REFINEMENT_SECTIONS[sectionId];
                  const active = preferences.sectionId === sectionId;
                  return (
                    <button
                      type="button"
                      role="radio"
                      aria-checked={active}
                      className={active ? "active" : ""}
                      key={sectionId}
                      onClick={() => selectSection(sectionId)}
                    >
                      <i aria-hidden="true" />
                      <span>
                        <strong>{section.shortLabel[uiLanguage]}</strong>
                        <small>{section.purpose[uiLanguage]}</small>
                      </span>
                    </button>
                  );
                })}
              </div>
              <small>{copy.targetSectionHint}</small>
            </fieldset>

            {showDiscussionOrganization && (
              <fieldset className="refinement-control-card refinement-organization-card">
                <legend>
                  <span className="control-index">02</span>
                  {copy.organization}
                </legend>
                <div
                  className="refinement-organization-options refinement-discussion-options"
                  role="radiogroup"
                  aria-label={copy.organization}
                >
                  {DISCUSSION_SCOPE_IDS.map((scopeId) => {
                    const option = DISCUSSION_SCOPES[scopeId];
                    const active =
                      preferences.discussionScope === scopeId;
                    return (
                      <button
                        type="button"
                        role="radio"
                        aria-checked={active}
                        className={active ? "active" : ""}
                        key={scopeId}
                        onClick={() =>
                          selectDiscussionScope(scopeId)
                        }
                      >
                        <strong>{option.label[uiLanguage]}</strong>
                        <small>{option.description[uiLanguage]}</small>
                      </button>
                    );
                  })}
                </div>

                {showLimitationMode && (
                  <div className="refinement-limitation-row">
                    <div>
                      <strong>{copy.limitation}</strong>
                      <small>{copy.limitationHint}</small>
                    </div>
                    <div
                      className="refinement-segmented"
                      role="radiogroup"
                      aria-label={copy.limitation}
                    >
                      <button
                        type="button"
                        role="radio"
                        aria-checked={preferences.limitationMode === "separate"}
                        className={
                          preferences.limitationMode === "separate"
                            ? "active"
                            : ""
                        }
                        onClick={() =>
                          updatePreference("limitationMode", "separate")
                        }
                      >
                        {copy.limitationSeparate}
                      </button>
                      <button
                        type="button"
                        role="radio"
                        aria-checked={preferences.limitationMode === "merged"}
                        className={
                          preferences.limitationMode === "merged"
                            ? "active"
                            : ""
                        }
                        onClick={() =>
                          updatePreference("limitationMode", "merged")
                        }
                      >
                        {copy.limitationMerged}
                      </button>
                    </div>
                  </div>
                )}
                <small>{copy.organizationHint}</small>
              </fieldset>
            )}

            <fieldset className="refinement-control-card refinement-specific-card">
              <legend>
                <span className="control-index">{contractControlIndex}</span>
                {copy.sectionContract}
              </legend>
              <p className="refinement-contract-summary">
                {activeSection.contractSummary[uiLanguage]}
              </p>
              {renderSectionContract()}
            </fieldset>

            <fieldset className="refinement-control-card refinement-length-card">
              <legend>
                <span className="control-index">{lengthControlIndex}</span>
                {copy.length}
              </legend>

              <div className="refinement-length-mode">
                <strong>{copy.sectionLength}</strong>
                <div
                  className="refinement-segmented"
                  role="radiogroup"
                  aria-label={copy.sectionLength}
                >
                  <button
                    type="button"
                    role="radio"
                    aria-checked={
                      preferences.sectionLengthMode === "preserve"
                    }
                    className={
                      preferences.sectionLengthMode === "preserve"
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      updatePreference("sectionLengthMode", "preserve")
                    }
                  >
                    {copy.preserveLength}
                  </button>
                  <button
                    type="button"
                    role="radio"
                    aria-checked={
                      preferences.sectionLengthMode === "custom"
                    }
                    className={
                      preferences.sectionLengthMode === "custom"
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      updatePreference("sectionLengthMode", "custom")
                    }
                  >
                    {copy.customLength}
                  </button>
                </div>
              </div>

              <div className="refinement-range-list">
                {preferences.sectionLengthMode === "custom" &&
                  renderRange(
                    copy.sectionLength,
                    "sectionMinWords",
                    "sectionMaxWords",
                    10,
                    copy.words,
                    1,
                  )}
                {preferences.sectionId !== "abstract" &&
                  renderRange(
                    copy.paragraphLength,
                    "paragraphMinWords",
                    "paragraphMaxWords",
                    5,
                    copy.words,
                    1,
                  )}
                {renderRange(
                  copy.sentenceLength,
                  "sentenceMinWords",
                  "sentenceMaxWords",
                  1,
                  copy.words,
                  1,
                )}
              </div>
              <small>{copy.lengthHint}</small>
            </fieldset>

            <fieldset className="refinement-control-card refinement-expression-card">
              <legend>
                <span className="control-index">{expressionControlIndex}</span>
                {copy.expression}
              </legend>

              <div className="refinement-expression-grid">
                <label>
                  <span>{copy.rewriteDepth}</span>
                  <select
                    value={preferences.rewriteDepth}
                    onChange={(event) =>
                      updatePreference(
                        "rewriteDepth",
                        event.target.value as RewriteDepthId,
                      )
                    }
                  >
                    {REWRITE_DEPTH_IDS.map((depthId) => (
                      <option value={depthId} key={depthId}>
                        {REWRITE_DEPTHS[depthId].label[uiLanguage]}
                      </option>
                    ))}
                  </select>
                  <small>
                    {
                      REWRITE_DEPTHS[preferences.rewriteDepth].description[
                        uiLanguage
                      ]
                    }
                  </small>
                </label>

                {showCitationMode && (
                  <label>
                    <span>{copy.citationMode}</span>
                    <select
                      value={preferences.citationMode}
                      onChange={(event) =>
                        updatePreference(
                          "citationMode",
                          event.target.value as CitationModeId,
                        )
                      }
                    >
                      {CITATION_MODE_IDS.map((modeId) => (
                        <option value={modeId} key={modeId}>
                          {CITATION_MODES[modeId].label[uiLanguage]}
                        </option>
                      ))}
                    </select>
                    <small>
                      {
                        CITATION_MODES[preferences.citationMode].description[
                          uiLanguage
                        ]
                      }
                    </small>
                  </label>
                )}
              </div>

              <div
                className={`refinement-language-switches ${
                  showWeToggle ? "" : "single"
                }`}
              >
                <button
                  type="button"
                  role="switch"
                  aria-checked={preferences.allowColon}
                  className={preferences.allowColon ? "active" : ""}
                  onClick={() =>
                    updatePreference("allowColon", !preferences.allowColon)
                  }
                >
                  <span>
                    <strong>{copy.allowColon}</strong>
                    <small>
                      {preferences.allowColon
                        ? copy.enabled
                        : copy.disabled}
                    </small>
                  </span>
                  <i aria-hidden="true">
                    <b />
                  </i>
                </button>

                {showWeToggle && (
                  <button
                    type="button"
                    role="switch"
                    aria-checked={preferences.allowWe}
                    className={preferences.allowWe ? "active" : ""}
                    onClick={() =>
                      updatePreference("allowWe", !preferences.allowWe)
                    }
                  >
                    <span>
                      <strong>{copy.allowWe}</strong>
                      <small>
                        {preferences.allowWe ? copy.enabled : copy.disabled}
                      </small>
                    </span>
                    <i aria-hidden="true">
                      <b />
                    </i>
                  </button>
                )}
              </div>
              <small>{copy.expressionHint}</small>
            </fieldset>
          </div>
        </section>

        <PromptResizeHandle language={uiLanguage} />

        <section className="content-section prompt-rail refinement-prompt-section">
          {copyError && (
            <p className="copy-error" role="alert">
              {copy.clipboardError}
            </p>
          )}

          <article className={`prompt-card ${expanded ? "expanded" : ""}`}>
            <div className="prompt-card-main">
              <div className="prompt-card-header">
                <div>
                  <h3>{promptScope}</h3>
                  <p>{copy.promptPurpose}</p>
                  {visibleScope !== activeSection.label[uiLanguage] && (
                    <small className="refinement-expanded-scope">
                      {visibleScope}
                    </small>
                  )}
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
                      clearCopyState();
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
                    aria-controls="section-refinement-prompt"
                    onClick={() => setExpanded((current) => !current)}
                  >
                    {expanded ? copy.collapse : copy.expand}
                    <span aria-hidden="true">{expanded ? "−" : "+"}</span>
                  </button>
                </div>
              </div>
              {expanded && (
                <pre
                  className="prompt-content"
                  id="section-refinement-prompt"
                >
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
