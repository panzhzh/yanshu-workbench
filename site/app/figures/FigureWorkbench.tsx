"use client";

import { useEffect, useRef, useState } from "react";
import SiteNavigation from "../SiteNavigation";
import PromptResizeHandle from "../PromptResizeHandle";
import { PRODUCT_CONFIG, type Language } from "../config";
import {
  buildFigurePrompt,
  DEFAULT_FIGURE_PREFERENCES,
  FIGURE_ASPECT_RATIO_IDS,
  FIGURE_ASPECT_RATIOS,
  FIGURE_COLOR_PALETTE_IDS,
  FIGURE_COLOR_PALETTES,
  FIGURE_COPY,
  FIGURE_DEFAULT_LAYOUT,
  FIGURE_PLACEMENT_IDS,
  FIGURE_PLACEMENTS,
  FIGURE_FONT_FAMILIES,
  FIGURE_FONT_FAMILY_IDS,
  FIGURE_PROMPT_ORDER,
  FIGURE_PROMPTS,
  FIGURE_STYLE_DEFAULTS,
  FIGURE_STYLE_IDS,
  FIGURE_STYLES,
  getFigureAspectRatio,
  type FigurePreferences,
  type FigurePromptId,
} from "./config";

type PromptLanguages = Record<FigurePromptId, Language>;
type PromptExpansion = Record<FigurePromptId, boolean>;

const DEFAULT_PROMPT_LANGUAGES: PromptLanguages = {
  introduction: PRODUCT_CONFIG.defaultPromptLanguage,
  "method-overview": PRODUCT_CONFIG.defaultPromptLanguage,
  "technical-detail": PRODUCT_CONFIG.defaultPromptLanguage,
};

const DEFAULT_PROMPT_EXPANSION: PromptExpansion = {
  introduction: true,
  "method-overview": true,
  "technical-detail": true,
};

const ACCENT_COLOR_COUNTS = [1, 2, 3] as const;
const FONT_SIZE_LEVELS = [2, 3] as const;

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
  const [preferences, setPreferences] = useState<FigurePreferences>({
    ...DEFAULT_FIGURE_PREFERENCES,
  });
  const [expandedPrompts, setExpandedPrompts] = useState<PromptExpansion>({
    ...DEFAULT_PROMPT_EXPANSION,
  });
  const [copiedPrompt, setCopiedPrompt] = useState<FigurePromptId | null>(null);
  const [copyError, setCopyError] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copy = FIGURE_COPY[uiLanguage];
  const activePromptId = preferences.promptId;
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
  const selectedPlacement = FIGURE_PLACEMENTS[preferences.placementId];
  const selectedAspectRatio =
    FIGURE_ASPECT_RATIOS[preferences.aspectRatioId];
  const selectedAspectRatioValue = getFigureAspectRatio(preferences);
  const selectedStyle = FIGURE_STYLES[preferences.styleId];
  const selectedPalette = FIGURE_COLOR_PALETTES[preferences.paletteId];
  const selectedFont = FIGURE_FONT_FAMILIES[preferences.fontFamilyId];
  const visualSummary =
    uiLanguage === "zh"
      ? `${selectedPalette.label.zh} · ${selectedFont.label} · ${preferences.fontSizeLevels} 级字号`
      : `${selectedPalette.label.en} · ${selectedFont.label} · ${
          preferences.accentColorCount
        } accent color${
          preferences.accentColorCount === 1 ? "" : "s"
        }`;

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
    setPreferences(update);
    setCopiedPrompt(null);
    setCopyError(false);
  }

  function selectFigurePrompt(promptId: FigurePromptId) {
    updatePreferences((current) => {
      if (current.promptId === promptId) return current;
      return {
        ...current,
        promptId,
        ...FIGURE_DEFAULT_LAYOUT[promptId],
      };
    });
  }

  function selectFigureStyle(styleId: FigurePreferences["styleId"]) {
    updatePreferences((current) => ({
      ...current,
      styleId,
      ...FIGURE_STYLE_DEFAULTS[styleId],
    }));
  }

  function resetDefaults() {
    setPreferences({ ...DEFAULT_FIGURE_PREFERENCES });
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
      preferences,
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

          <div className="figure-config-grid">
            <fieldset className="figure-control-card figure-task-control">
              <legend>
                <span className="control-index">02</span>
                {copy.figureTasks}
              </legend>
              <div
                className="figure-task-list"
                role="radiogroup"
                aria-label={copy.figureTasks}
              >
                {FIGURE_PROMPT_ORDER.map((promptId) => {
                  const promptSpec = FIGURE_PROMPTS[promptId];
                  const active = preferences.promptId === promptId;

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
                })}
              </div>
              <small>{copy.figureTasksHint}</small>
            </fieldset>

            <fieldset className="figure-control-card figure-canvas-control">
              <legend>
                <span className="control-index">03</span>
                {copy.canvas}
              </legend>
              <div className="figure-layout-groups">
                <div className="figure-layout-group">
                  <p>{copy.paperPlacement}</p>
                  <div
                    className="figure-placement-options"
                    role="radiogroup"
                    aria-label={copy.paperPlacement}
                  >
                    {FIGURE_PLACEMENT_IDS.map((placementId) => {
                      const placement = FIGURE_PLACEMENTS[placementId];
                      const active = preferences.placementId === placementId;
                      const recommended =
                        FIGURE_DEFAULT_LAYOUT[preferences.promptId]
                          .placementId === placementId;

                      return (
                        <button
                          type="button"
                          role="radio"
                          aria-checked={active}
                          className={active ? "active" : ""}
                          key={placementId}
                          onClick={() =>
                            updatePreferences((current) => ({
                              ...current,
                              placementId,
                            }))
                          }
                        >
                          <span
                            className={`figure-placement-sample ${placementId}`}
                            aria-hidden="true"
                          >
                            <i />
                            <i />
                          </span>
                          <span>
                            <span className="figure-option-heading">
                              <strong>{placement.label[uiLanguage]}</strong>
                              {recommended && <em>{copy.recommended}</em>}
                            </span>
                            <small>
                              {placement.shortDescription[uiLanguage]}
                            </small>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

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

            <fieldset className="figure-control-card figure-style-control">
              <legend>
                <span className="control-index">04</span>
                {copy.visualStyle}
              </legend>
              <div className="figure-style-options">
                {FIGURE_STYLE_IDS.map((styleId) => {
                  const style = FIGURE_STYLES[styleId];
                  const active = preferences.styleId === styleId;
                  return (
                    <button
                      type="button"
                      role="radio"
                      aria-checked={active}
                      className={active ? "active" : ""}
                      key={styleId}
                      onClick={() => selectFigureStyle(styleId)}
                    >
                      <span
                        className={`figure-style-sample ${styleId}`}
                        aria-hidden="true"
                      >
                        <i />
                        <i />
                        <i />
                        <b />
                        <b />
                      </span>
                      <span>
                        <strong>{style.label[uiLanguage]}</strong>
                        <small>{style.shortDescription[uiLanguage]}</small>
                      </span>
                    </button>
                  );
                })}
              </div>
              <small>{copy.visualStyleHint}</small>
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
                    className="figure-compact-options figure-color-options"
                    role="radiogroup"
                    aria-label={copy.accentColors}
                  >
                    {ACCENT_COLOR_COUNTS.map((accentColorCount) => (
                      <button
                        type="button"
                        role="radio"
                        aria-checked={
                          preferences.accentColorCount === accentColorCount
                        }
                        className={
                          preferences.accentColorCount === accentColorCount
                            ? "active"
                            : ""
                        }
                        key={accentColorCount}
                        onClick={() =>
                          updatePreferences((current) => ({
                            ...current,
                            accentColorCount,
                          }))
                        }
                      >
                        <span className="figure-color-dots" aria-hidden="true">
                          {Array.from(
                            { length: accentColorCount },
                            (_, index) => (
                              <i key={index} />
                            ),
                          )}
                        </span>
                        {accentColorCount}
                      </button>
                    ))}
                  </div>
                  <small>{copy.visualRulesHint}</small>
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
                  <button
                    className={`figure-rule-switch ${
                      preferences.useCardFills ? "active" : ""
                    }`}
                    type="button"
                    role="switch"
                    aria-checked={preferences.useCardFills}
                    onClick={() =>
                      updatePreferences((current) => ({
                        ...current,
                        useCardFills: !current.useCardFills,
                      }))
                    }
                  >
                    <span className="switch-track" aria-hidden="true">
                      <span />
                    </span>
                    {preferences.useCardFills
                      ? copy.cardFillsOn
                      : copy.cardFillsOff}
                  </button>
                  <small>
                    {preferences.useCardFills
                      ? copy.cardFillsOnHint
                      : copy.cardFillsOffHint}
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
          <div className="section-heading-row workflow-heading">
            <div>
              <p className="eyebrow">{copy.promptEyebrow}</p>
              <h2>{copy.promptTitle}</h2>
            </div>
            <p className="section-intro">{copy.promptBody}</p>
          </div>

          <div className="figure-prompt-summary">
            <span>
              <small>{copy.currentPrompt}</small>
              <strong>{activePromptSpec.label[uiLanguage]}</strong>
            </span>
            <span>
              <small>{copy.selectedCanvas}</small>
              <strong>
                {selectedPlacement.label[uiLanguage]} ·{" "}
                {selectedAspectRatio.label[uiLanguage]}{" "}
                {preferences.aspectRatioId === "custom"
                  ? selectedAspectRatioValue
                  : ""}
              </strong>
            </span>
            <span>
              <small>{copy.selectedStyle}</small>
              <strong>{selectedStyle.label[uiLanguage]}</strong>
            </span>
            <span>
              <small>{copy.visualSummary}</small>
              <strong>{visualSummary}</strong>
            </span>
          </div>

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
              <div className="prompt-number" aria-hidden="true">
                <span>{activePromptSpec.number}</span>
                <i />
              </div>
              <div className="prompt-card-main">
                <div className="prompt-card-header">
                  <div>
                    <span className="placeholder-tag">
                      {activePromptSpec.tag[uiLanguage]} ·{" "}
                      {selectedPlacement.label[uiLanguage]} ·{" "}
                      {selectedAspectRatioValue}
                    </span>
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
