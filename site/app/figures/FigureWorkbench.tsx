"use client";

import { useEffect, useRef, useState } from "react";
import SiteNavigation from "../SiteNavigation";
import PromptResizeHandle from "../PromptResizeHandle";
import { PRODUCT_CONFIG, type Language } from "../config";
import {
  buildFigurePrompt,
  DEFAULT_FIGURE_PREFERENCES,
  FIGURE_ACCENT_COLOR_COUNT_MAX,
  FIGURE_ACCENT_COLOR_COUNT_MIN,
  FIGURE_ASPECT_RATIO_IDS,
  FIGURE_ASPECT_RATIOS,
  FIGURE_CARD_FILL_POLICIES,
  FIGURE_CARD_FILL_POLICY_IDS,
  FIGURE_COLOR_PALETTE_IDS,
  FIGURE_COLOR_PALETTES,
  FIGURE_COPY,
  FIGURE_DEFAULT_LAYOUT,
  FIGURE_FONT_FAMILIES,
  FIGURE_FONT_FAMILY_IDS,
  FIGURE_PROMPT_GROUP_ORDER,
  FIGURE_PROMPT_GROUPS,
  FIGURE_PROMPT_ORDER,
  FIGURE_PROMPTS,
  FIGURE_TYPE_RECOMMENDATIONS,
  getFigureAccentColorRange,
  getFigureAspectRatio,
  normalizeFigureAccentColorCount,
  type FigurePreferences,
  type FigurePromptId,
} from "./config";

type PromptLanguages = Record<FigurePromptId, Language>;
type PromptExpansion = Record<FigurePromptId, boolean>;
type FigurePreferenceMap = Record<FigurePromptId, FigurePreferences>;

const DEFAULT_PROMPT_LANGUAGES: PromptLanguages = {
  ...Object.fromEntries(
    FIGURE_PROMPT_ORDER.map((promptId) => [
      promptId,
      PRODUCT_CONFIG.defaultPromptLanguage,
    ]),
  ),
} as PromptLanguages;

const DEFAULT_PROMPT_EXPANSION: PromptExpansion = {
  ...Object.fromEntries(
    FIGURE_PROMPT_ORDER.map((promptId) => [promptId, true]),
  ),
} as PromptExpansion;

const FONT_SIZE_LEVELS = [2, 3] as const;

function createRecommendedPreferences(): FigurePreferenceMap {
  return Object.fromEntries(
    FIGURE_PROMPT_ORDER.map((promptId) => [
      promptId,
      { ...FIGURE_TYPE_RECOMMENDATIONS[promptId] },
    ]),
  ) as FigurePreferenceMap;
}

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

export default function FigureWorkbench() {
  const [uiLanguage, setUiLanguage] = useState<Language>(
    PRODUCT_CONFIG.defaultLanguage,
  );
  const [promptLanguages, setPromptLanguages] = useState<PromptLanguages>({
    ...DEFAULT_PROMPT_LANGUAGES,
  });
  const [activePromptId, setActivePromptId] = useState<FigurePromptId>(
    DEFAULT_FIGURE_PREFERENCES.promptId,
  );
  const [preferencesByPrompt, setPreferencesByPrompt] =
    useState<FigurePreferenceMap>(createRecommendedPreferences);
  const [expandedPrompts, setExpandedPrompts] = useState<PromptExpansion>({
    ...DEFAULT_PROMPT_EXPANSION,
  });
  const [copiedPrompt, setCopiedPrompt] = useState<FigurePromptId | null>(null);
  const [copyError, setCopyError] = useState(false);
  const [professionalTypesOpen, setProfessionalTypesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copy = FIGURE_COPY[uiLanguage];
  const preferences = preferencesByPrompt[activePromptId];
  const activePromptSpec = FIGURE_PROMPTS[activePromptId];
  const activePromptLanguage = promptLanguages[activePromptId];
  const activePrompt = buildFigurePrompt(
    activePromptId,
    preferences,
    activePromptLanguage,
  );
  const activePromptExpanded = expandedPrompts[activePromptId];
  const activePromptCopied = copiedPrompt === activePromptId;
  const promptNextLanguage =
    activePromptLanguage === "zh" ? "English" : "中文";
  const promptContentId = `figure-prompt-${activePromptId}`;
  const selectedAspectRatioValue = getFigureAspectRatio(preferences);
  const selectedAccentColorRange =
    getFigureAccentColorRange(preferences);

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

  function updatePreferences(
    update: (current: FigurePreferences) => FigurePreferences,
  ) {
    setPreferencesByPrompt((current) => ({
      ...current,
      [activePromptId]: update(current[activePromptId]),
    }));
    setCopiedPrompt(null);
    setCopyError(false);
  }

  function updateAccentColorMinimum(value: number) {
    if (!Number.isFinite(value)) return;

    updatePreferences((current) => {
      const accentColorMin = normalizeFigureAccentColorCount(
        value,
        current.accentColorMin,
      );
      return {
        ...current,
        accentColorMin,
        accentColorMax: Math.max(
          accentColorMin,
          current.accentColorMax,
        ),
      };
    });
  }

  function updateAccentColorMaximum(value: number) {
    if (!Number.isFinite(value)) return;

    updatePreferences((current) => {
      const accentColorMax = normalizeFigureAccentColorCount(
        value,
        current.accentColorMax,
      );
      return {
        ...current,
        accentColorMin: Math.min(
          current.accentColorMin,
          accentColorMax,
        ),
        accentColorMax,
      };
    });
  }

  function selectFigurePrompt(promptId: FigurePromptId) {
    if (
      FIGURE_PROMPT_GROUPS.professional.promptIds.some(
        (professionalPromptId) => professionalPromptId === promptId,
      )
    ) {
      setProfessionalTypesOpen(true);
    }
    if (activePromptId === promptId) return;
    setActivePromptId(promptId);
    setCopiedPrompt(null);
    setCopyError(false);
  }

  function resetDefaults() {
    setPreferencesByPrompt((current) => ({
      ...current,
      [activePromptId]: {
        ...FIGURE_TYPE_RECOMMENDATIONS[activePromptId],
      },
    }));
    setCopiedPrompt(null);
    setCopyError(false);
  }

  function togglePromptLanguage(promptId: FigurePromptId) {
    setPromptLanguages((current) => ({
      ...current,
      [promptId]: current[promptId] === "zh" ? "en" : "zh",
    }));
    setCopiedPrompt(null);
    setCopyError(false);
  }

  async function copyPrompt(promptId: FigurePromptId) {
    const prompt = buildFigurePrompt(
      promptId,
      preferencesByPrompt[promptId],
      promptLanguages[promptId],
    );

    try {
      await writeClipboard(prompt);
      setCopyError(false);
      setCopiedPrompt(promptId);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopiedPrompt(null), 2200);
    } catch {
      setCopiedPrompt(null);
      setCopyError(true);
    }
  }

  function renderFigureTaskButton(promptId: FigurePromptId) {
    const promptSpec = FIGURE_PROMPTS[promptId];
    const active = activePromptId === promptId;

    return (
      <button
        type="button"
        role="radio"
        aria-checked={active}
        className={active ? "active" : ""}
        key={promptId}
        onClick={() => selectFigurePrompt(promptId)}
      >
        <span className="figure-task-marker" aria-hidden="true">
          <i />
        </span>
        <span>
          <strong>{promptSpec.label[uiLanguage]}</strong>
          <small>{promptSpec.purpose[uiLanguage]}</small>
        </span>
      </button>
    );
  }

  return (
    <div className="site-shell">
      <SiteNavigation
        language={uiLanguage}
        activePage="figures"
        mobileMenuOpen={mobileMenuOpen}
        onLanguageChange={(language) => {
          setUiLanguage(language);
          setCopiedPrompt(null);
        }}
        onMenuToggle={() => setMobileMenuOpen((open) => !open)}
        onMenuClose={() => setMobileMenuOpen(false)}
      />

      <main className="site-main" id="main-content">
        <section className="config-section figure-config-section">
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
              onClick={resetDefaults}
              title={copy.resetHint}
            >
              <span aria-hidden="true">↺</span>
              {copy.reset}
            </button>
          </div>

          <div className="figure-input-strip">
            <div className="figure-control-title">
              <span className="control-index">01</span>
              <strong>{copy.inputTitle}</strong>
            </div>
            <div className="figure-input-files" aria-label={copy.inputTitle}>
              <span>
                <b>.tex</b>
                {copy.inputSource}
              </span>
              <span>
                <b>.pdf</b>
                {copy.inputPdf}
              </span>
            </div>
            <p>{copy.inputHint}</p>
          </div>

          <aside className="figure-scope-boundary">
            <strong>{copy.scopeBoundaryTitle}</strong>
            <p>{copy.scopeBoundaryBody}</p>
          </aside>

          <div className="figure-config-grid">
            <fieldset className="figure-control-card figure-task-control">
              <legend>
                <span className="control-index">02</span>
                {copy.figureTasks}
              </legend>
              <div className="figure-intent-selector">
                <label htmlFor="figure-intent-question">
                  <strong>{copy.intentQuestion}</strong>
                  <small>{copy.intentQuestionHint}</small>
                </label>
                <select
                  id="figure-intent-question"
                  value={activePromptId}
                  onChange={(event) =>
                    selectFigurePrompt(
                      event.target.value as FigurePromptId,
                    )
                  }
                >
                  {FIGURE_PROMPT_ORDER.map((promptId) => (
                    <option value={promptId} key={promptId}>
                      {FIGURE_PROMPTS[promptId].intent[uiLanguage]} —{" "}
                      {FIGURE_PROMPTS[promptId].label[uiLanguage]}
                    </option>
                  ))}
                </select>
              </div>

              <div className="figure-task-groups">
                {FIGURE_PROMPT_GROUP_ORDER.filter(
                  (groupId) => groupId !== "professional",
                ).map((groupId) => {
                  const group = FIGURE_PROMPT_GROUPS[groupId];
                  return (
                    <section className="figure-task-group" key={groupId}>
                      <div className="figure-task-group-heading">
                        <strong>{group.label[uiLanguage]}</strong>
                        <small>{group.description[uiLanguage]}</small>
                      </div>
                      <div
                        className="figure-task-list"
                        role="radiogroup"
                        aria-label={group.label[uiLanguage]}
                      >
                        {group.promptIds.map((promptId) =>
                          renderFigureTaskButton(promptId),
                        )}
                      </div>
                    </section>
                  );
                })}

                <details
                  className="figure-professional-types"
                  open={professionalTypesOpen}
                  onToggle={(event) =>
                    setProfessionalTypesOpen(event.currentTarget.open)
                  }
                >
                  <summary>
                    <span>
                      <strong>
                        {
                          FIGURE_PROMPT_GROUPS.professional.label[
                            uiLanguage
                          ]
                        }
                      </strong>
                      <small>
                        {
                          FIGURE_PROMPT_GROUPS.professional.description[
                            uiLanguage
                          ]
                        }
                      </small>
                    </span>
                    <em>
                      {professionalTypesOpen
                        ? copy.professionalOpenHint
                        : copy.professionalClosedHint}
                    </em>
                  </summary>
                  <div
                    className="figure-task-list"
                    role="radiogroup"
                    aria-label={
                      FIGURE_PROMPT_GROUPS.professional.label[uiLanguage]
                    }
                  >
                    {FIGURE_PROMPT_GROUPS.professional.promptIds.map(
                      (promptId) => renderFigureTaskButton(promptId),
                    )}
                  </div>
                </details>
              </div>
              <small>{copy.figureTasksHint}</small>
            </fieldset>

            <fieldset className="figure-control-card figure-execution-control">
              <legend>
                <span className="control-index">03</span>
                {copy.executionMode}
              </legend>
              <div
                className="figure-execution-options"
                role="radiogroup"
                aria-label={copy.executionMode}
              >
                <button
                  type="button"
                  role="radio"
                  aria-checked={preferences.executionMode === "direct"}
                  className={
                    preferences.executionMode === "direct" ? "active" : ""
                  }
                  onClick={() =>
                    updatePreferences((current) => ({
                      ...current,
                      executionMode: "direct",
                    }))
                  }
                >
                  <strong>{copy.executionDirect}</strong>
                  <small>{copy.executionDirectHint}</small>
                </button>
                <button
                  type="button"
                  role="radio"
                  aria-checked={preferences.executionMode === "prompt-first"}
                  className={
                    preferences.executionMode === "prompt-first"
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    updatePreferences((current) => ({
                      ...current,
                      executionMode: "prompt-first",
                    }))
                  }
                >
                  <strong>{copy.executionPromptFirst}</strong>
                  <small>{copy.executionPromptFirstHint}</small>
                </button>
              </div>
              <small>{copy.executionHint}</small>
            </fieldset>

            <fieldset className="figure-control-card figure-canvas-control">
              <legend>
                <span className="control-index">04</span>
                {copy.canvas}
              </legend>
              <div className="figure-layout-groups">
                <div className="figure-layout-group">
                  <p>{copy.aspectRatio}</p>
                  <div
                    className="figure-canvas-options"
                    role="radiogroup"
                    aria-label={copy.aspectRatio}
                  >
                    {FIGURE_ASPECT_RATIO_IDS.map((aspectRatioId) => {
                      const aspectRatio =
                        FIGURE_ASPECT_RATIOS[aspectRatioId];
                      const active =
                        preferences.aspectRatioId === aspectRatioId;
                      const recommended =
                        FIGURE_DEFAULT_LAYOUT[preferences.promptId]
                          .aspectRatioId === aspectRatioId;

                      return (
                        <button
                          type="button"
                          role="radio"
                          aria-checked={active}
                          className={active ? "active" : ""}
                          key={aspectRatioId}
                          onClick={() =>
                            updatePreferences((current) => ({
                              ...current,
                              aspectRatioId,
                            }))
                          }
                        >
                          <span
                            className={`figure-canvas-sample ${aspectRatioId}`}
                            aria-hidden="true"
                          >
                            <i />
                            <b>
                              {aspectRatio.ratio ?? selectedAspectRatioValue}
                            </b>
                          </span>
                          <span>
                            <span className="figure-option-heading">
                              <strong>
                                {aspectRatio.label[uiLanguage]}
                              </strong>
                              {recommended && <em>{copy.recommended}</em>}
                            </span>
                            <small>
                              {aspectRatio.shortDescription[uiLanguage]}
                            </small>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  {preferences.aspectRatioId === "custom" && (
                    <div className="figure-custom-ratio">
                      <label>
                        <span>{copy.customRatioWidth}</span>
                        <input
                          type="number"
                          min="1"
                          max="100"
                          step="1"
                          inputMode="numeric"
                          value={preferences.customAspectWidth}
                          onChange={(event) =>
                            updatePreferences((current) => ({
                              ...current,
                              aspectRatioId: "custom",
                              customAspectWidth: Math.max(
                                1,
                                Math.min(
                                  100,
                                  Number.parseInt(event.target.value, 10) || 1,
                                ),
                              ),
                            }))
                          }
                        />
                      </label>
                      <span aria-hidden="true">:</span>
                      <label>
                        <span>{copy.customRatioHeight}</span>
                        <input
                          type="number"
                          min="1"
                          max="100"
                          step="1"
                          inputMode="numeric"
                          value={preferences.customAspectHeight}
                          onChange={(event) =>
                            updatePreferences((current) => ({
                              ...current,
                              aspectRatioId: "custom",
                              customAspectHeight: Math.max(
                                1,
                                Math.min(
                                  100,
                                  Number.parseInt(event.target.value, 10) || 1,
                                ),
                              ),
                            }))
                          }
                        />
                      </label>
                      <p>
                        <strong>
                          {copy.customRatioCurrent} {selectedAspectRatioValue}
                        </strong>
                        <small>{copy.customRatioHint}</small>
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <small>{copy.canvasHint}</small>
            </fieldset>

            <fieldset className="figure-control-card figure-visual-rules-control">
              <legend>
                <span className="control-index">05</span>
                {copy.visualRules}
              </legend>
              <div className="figure-visual-rules-grid">
                <div className="figure-visual-rule">
                  <strong>{copy.colorPalette}</strong>
                  <select
                    className="figure-rule-select"
                    value={preferences.paletteId}
                    onChange={(event) =>
                      updatePreferences((current) => ({
                        ...current,
                        paletteId:
                          event.target
                            .value as FigurePreferences["paletteId"],
                      }))
                    }
                    aria-label={copy.colorPalette}
                  >
                    {FIGURE_COLOR_PALETTE_IDS.map((paletteId) => (
                      <option value={paletteId} key={paletteId}>
                        {FIGURE_COLOR_PALETTES[paletteId].label[uiLanguage]}
                      </option>
                    ))}
                  </select>
                  <span className="figure-palette-preview" aria-hidden="true">
                    {FIGURE_COLOR_PALETTES[preferences.paletteId].colors.map(
                      (color) => (
                        <i key={color} style={{ backgroundColor: color }} />
                      ),
                    )}
                  </span>
                  <small>{copy.colorPaletteHint}</small>
                </div>

                <div className="figure-visual-rule">
                  <strong>{copy.fontFamily}</strong>
                  <select
                    className="figure-rule-select"
                    value={preferences.fontFamilyId}
                    onChange={(event) =>
                      updatePreferences((current) => ({
                        ...current,
                        fontFamilyId:
                          event.target
                            .value as FigurePreferences["fontFamilyId"],
                      }))
                    }
                    aria-label={copy.fontFamily}
                  >
                    {FIGURE_FONT_FAMILY_IDS.map((fontFamilyId) => (
                      <option value={fontFamilyId} key={fontFamilyId}>
                        {FIGURE_FONT_FAMILIES[fontFamilyId].label}
                      </option>
                    ))}
                  </select>
                  <small>{copy.fontFamilyHint}</small>
                </div>

                <div className="figure-visual-rule">
                  <strong>{copy.lineColors}</strong>
                  <div
                    className="figure-compact-options"
                    role="radiogroup"
                    aria-label={copy.lineColors}
                  >
                    <button
                      type="button"
                      role="radio"
                      aria-checked={preferences.lineColorMode === "neutral"}
                      className={
                        preferences.lineColorMode === "neutral" ? "active" : ""
                      }
                      onClick={() =>
                        updatePreferences((current) => ({
                          ...current,
                          lineColorMode: "neutral",
                        }))
                      }
                    >
                      {copy.lineColorsNeutral}
                    </button>
                    <button
                      type="button"
                      role="radio"
                      aria-checked={preferences.lineColorMode === "semantic"}
                      className={
                        preferences.lineColorMode === "semantic"
                          ? "active"
                          : ""
                      }
                      onClick={() =>
                        updatePreferences((current) => ({
                          ...current,
                          lineColorMode: "semantic",
                        }))
                      }
                    >
                      {copy.lineColorsSemantic}
                    </button>
                  </div>
                  <small>
                    {preferences.lineColorMode === "semantic"
                      ? copy.lineColorsSemanticHint
                      : copy.lineColorsNeutralHint}
                  </small>
                </div>

                <div className="figure-visual-rule">
                  <strong>{copy.accentColors}</strong>
                  <div
                    className="figure-accent-range"
                    role="group"
                    aria-label={copy.accentColors}
                  >
                    <label>
                      <span>{copy.accentColorMin}</span>
                      <input
                        type="number"
                        min={FIGURE_ACCENT_COLOR_COUNT_MIN}
                        max={FIGURE_ACCENT_COLOR_COUNT_MAX}
                        step={1}
                        inputMode="numeric"
                        value={selectedAccentColorRange.min}
                        onChange={(event) =>
                          updateAccentColorMinimum(
                            event.currentTarget.valueAsNumber,
                          )
                        }
                      />
                    </label>
                    <span aria-hidden="true">–</span>
                    <label>
                      <span>{copy.accentColorMax}</span>
                      <input
                        type="number"
                        min={FIGURE_ACCENT_COLOR_COUNT_MIN}
                        max={FIGURE_ACCENT_COLOR_COUNT_MAX}
                        step={1}
                        inputMode="numeric"
                        value={selectedAccentColorRange.max}
                        onChange={(event) =>
                          updateAccentColorMaximum(
                            event.currentTarget.valueAsNumber,
                          )
                        }
                      />
                    </label>
                  </div>
                  <small>{copy.accentColorsHint}</small>
                </div>

                <div className="figure-visual-rule">
                  <strong>{copy.lightIllustrations}</strong>
                  <button
                    className={`figure-rule-switch ${
                      preferences.allowLightIllustrations ? "active" : ""
                    }`}
                    type="button"
                    role="switch"
                    aria-checked={preferences.allowLightIllustrations}
                    onClick={() =>
                      updatePreferences((current) => ({
                        ...current,
                        allowLightIllustrations:
                          !current.allowLightIllustrations,
                      }))
                    }
                  >
                    <span className="switch-track" aria-hidden="true">
                      <span />
                    </span>
                    {preferences.allowLightIllustrations
                      ? copy.lightIllustrationsOn
                      : copy.lightIllustrationsOff}
                  </button>
                  <small>
                    {preferences.allowLightIllustrations
                      ? copy.lightIllustrationsOnHint
                      : copy.lightIllustrationsOffHint}
                  </small>
                </div>

                <div className="figure-visual-rule">
                  <strong>{copy.cardFills}</strong>
                  <div
                    className="figure-compact-options figure-card-fill-options"
                    role="radiogroup"
                    aria-label={copy.cardFills}
                  >
                    {FIGURE_CARD_FILL_POLICY_IDS.map((cardFillPolicyId) => {
                      const policy =
                        FIGURE_CARD_FILL_POLICIES[cardFillPolicyId];
                      const active =
                        preferences.cardFillPolicyId === cardFillPolicyId;
                      return (
                        <button
                          type="button"
                          role="radio"
                          aria-checked={active}
                          className={active ? "active" : ""}
                          key={cardFillPolicyId}
                          onClick={() =>
                            updatePreferences((current) => ({
                              ...current,
                              cardFillPolicyId,
                            }))
                          }
                        >
                          {policy.label[uiLanguage]}
                        </button>
                      );
                    })}
                  </div>
                  <small>
                    {
                      FIGURE_CARD_FILL_POLICIES[
                        preferences.cardFillPolicyId
                      ].shortDescription[uiLanguage]
                    }
                  </small>
                </div>

                <div className="figure-visual-rule">
                  <strong>{copy.fontSizes}</strong>
                  <div
                    className="figure-compact-options"
                    role="radiogroup"
                    aria-label={copy.fontSizes}
                  >
                    {FONT_SIZE_LEVELS.map((fontSizeLevels) => (
                      <button
                        type="button"
                        role="radio"
                        aria-checked={
                          preferences.fontSizeLevels === fontSizeLevels
                        }
                        className={
                          preferences.fontSizeLevels === fontSizeLevels
                            ? "active"
                            : ""
                        }
                        key={fontSizeLevels}
                        onClick={() =>
                          updatePreferences((current) => ({
                            ...current,
                            fontSizeLevels,
                          }))
                        }
                      >
                        {fontSizeLevels === 2
                          ? copy.fontSizesTwo
                          : copy.fontSizesThree}
                      </button>
                    ))}
                  </div>
                  <small>
                    {preferences.fontSizeLevels === 2
                      ? copy.fontSizesTwoHint
                      : copy.fontSizesThreeHint}
                  </small>
                </div>

                <div className="figure-visual-rule">
                  <strong>{copy.largeTitle}</strong>
                  <button
                    className={`figure-rule-switch ${
                      preferences.includeLargeTitle ? "active" : ""
                    }`}
                    type="button"
                    role="switch"
                    aria-checked={preferences.includeLargeTitle}
                    onClick={() =>
                      updatePreferences((current) => ({
                        ...current,
                        includeLargeTitle: !current.includeLargeTitle,
                      }))
                    }
                  >
                    <span className="switch-track" aria-hidden="true">
                      <span />
                    </span>
                    {preferences.includeLargeTitle
                      ? copy.largeTitleOn
                      : copy.largeTitleOff}
                  </button>
                  <small>
                    {preferences.includeLargeTitle
                      ? copy.largeTitleOnHint
                      : copy.largeTitleOffHint}
                  </small>
                </div>
              </div>
              <p className="figure-contrast-rule">{copy.textContrastRule}</p>
            </fieldset>
          </div>
        </section>

        <PromptResizeHandle language={uiLanguage} />

        <section className="content-section prompt-rail figure-prompt-section">
          {copyError && (
            <p className="copy-error" role="alert">
              {copy.clipboardError}
            </p>
          )}

          <div className="figure-prompt-list">
            <article
              className={`prompt-card ${
                activePromptExpanded ? "expanded" : ""
              }`}
              key={activePromptId}
            >
              <div className="prompt-card-main">
                <div className="prompt-card-header">
                  <div>
                    <h3>{activePromptSpec.label[uiLanguage]}</h3>
                    <p>{activePromptSpec.purpose[uiLanguage]}</p>
                  </div>
                  <div className="prompt-card-actions">
                    <button
                      className="prompt-language-button"
                      type="button"
                      aria-label={`${copy.switchPromptLanguage}：${promptNextLanguage}`}
                      onClick={() => togglePromptLanguage(activePromptId)}
                    >
                      {promptNextLanguage}
                    </button>
                    <button
                      className={`copy-button ${
                        activePromptCopied ? "copied" : ""
                      }`}
                      type="button"
                      onClick={() => copyPrompt(activePromptId)}
                    >
                      <span aria-hidden="true">
                        {activePromptCopied ? "✓" : "⧉"}
                      </span>
                      {activePromptCopied ? copy.copied : copy.copy}
                    </button>
                    <button
                      className="expand-button"
                      type="button"
                      aria-expanded={activePromptExpanded}
                      aria-controls={promptContentId}
                      onClick={() =>
                        setExpandedPrompts((current) => ({
                          ...current,
                          [activePromptId]: !current[activePromptId],
                        }))
                      }
                    >
                      {activePromptExpanded ? copy.collapse : copy.expand}
                      <span aria-hidden="true">
                        {activePromptExpanded ? "−" : "+"}
                      </span>
                    </button>
                  </div>
                </div>
                {activePromptExpanded && (
                  <pre className="prompt-content" id={promptContentId}>
                    {activePrompt}
                  </pre>
                )}
              </div>
            </article>
          </div>

          <span className="sr-only" role="status" aria-live="polite">
            {copiedPrompt
              ? `${FIGURE_PROMPTS[copiedPrompt].label[uiLanguage]} ${copy.copied}`
              : ""}
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
