"use client";

import { useEffect, useRef, useState } from "react";
import SiteNavigation from "../SiteNavigation";
import { PRODUCT_CONFIG, type Language } from "../config";
import {
  buildFigurePrompt,
  DEFAULT_FIGURE_PREFERENCES,
  FIGURE_COPY,
  FIGURE_PROMPT_ORDER,
  FIGURE_PROMPTS,
  FIGURE_STYLE_IDS,
  FIGURE_STYLES,
  isFigurePromptSelected,
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
  introduction: false,
  "method-overview": false,
  "technical-detail": false,
};

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

function togglePromptPreference(
  promptId: FigurePromptId,
  current: FigurePreferences,
): FigurePreferences {
  if (promptId === "introduction") {
    return {
      ...current,
      includeIntroductionFigure: !current.includeIntroductionFigure,
    };
  }
  if (promptId === "method-overview") {
    return {
      ...current,
      includeMethodOverview: !current.includeMethodOverview,
    };
  }
  return {
    ...current,
    includeTechnicalDetailFigure: !current.includeTechnicalDetailFigure,
  };
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
  const selectedPromptIds = FIGURE_PROMPT_ORDER.filter((promptId) =>
    isFigurePromptSelected(promptId, preferences),
  );
  const selectedStyle = FIGURE_STYLES[preferences.styleId];

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

  function toggleFigurePrompt(promptId: FigurePromptId) {
    updatePreferences((current) => {
      const selectedCount = FIGURE_PROMPT_ORDER.filter((id) =>
        isFigurePromptSelected(id, current),
      ).length;

      if (isFigurePromptSelected(promptId, current) && selectedCount === 1) {
        return current;
      }
      return togglePromptPreference(promptId, current);
    });
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
              <div className="figure-task-list">
                {FIGURE_PROMPT_ORDER.map((promptId) => {
                  const promptSpec = FIGURE_PROMPTS[promptId];
                  const active = isFigurePromptSelected(promptId, preferences);

                  return (
                    <button
                      type="button"
                      role="switch"
                      aria-checked={active}
                      className={active ? "active" : ""}
                      key={promptId}
                      onClick={() => toggleFigurePrompt(promptId)}
                    >
                      <span className="figure-task-marker" aria-hidden="true">
                        {active ? "✓" : ""}
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

            <fieldset className="figure-control-card figure-style-control">
              <legend>
                <span className="control-index">03</span>
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
                      onClick={() =>
                        updatePreferences((current) => ({
                          ...current,
                          styleId,
                        }))
                      }
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

            <div className="figure-control-card figure-policy-control">
              <div className="figure-control-title">
                <span className="control-index">04</span>
                <strong>{copy.semanticIcons}</strong>
              </div>
              <button
                className={`switch-row ${
                  preferences.allowSemanticIcons ? "active" : ""
                }`}
                type="button"
                role="switch"
                aria-checked={preferences.allowSemanticIcons}
                onClick={() =>
                  updatePreferences((current) => ({
                    ...current,
                    allowSemanticIcons: !current.allowSemanticIcons,
                  }))
                }
              >
                <span className="switch-track" aria-hidden="true">
                  <span />
                </span>
                <strong>
                  {preferences.allowSemanticIcons
                    ? copy.semanticIconsOn
                    : copy.semanticIconsOff}
                </strong>
              </button>
              <small>
                {preferences.allowSemanticIcons
                  ? copy.semanticIconsOnHint
                  : copy.semanticIconsOffHint}
              </small>
            </div>

            <div className="figure-control-card figure-policy-control">
              <div className="figure-control-title">
                <span className="control-index">05</span>
                <strong>{copy.largeTitle}</strong>
              </div>
              <button
                className={`switch-row ${
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
                <strong>
                  {preferences.includeLargeTitle
                    ? copy.largeTitleOn
                    : copy.largeTitleOff}
                </strong>
              </button>
              <small>
                {preferences.includeLargeTitle
                  ? copy.largeTitleOnHint
                  : copy.largeTitleOffHint}
              </small>
            </div>
          </div>
        </section>

        <section className="content-section figure-prompt-section">
          <div className="section-heading-row workflow-heading">
            <div>
              <p className="eyebrow">{copy.promptEyebrow}</p>
              <h2>{copy.promptTitle}</h2>
            </div>
            <p className="section-intro">{copy.promptBody}</p>
          </div>

          <div className="figure-prompt-summary">
            <span>
              <small>{copy.selectedPrompts}</small>
              <strong>
                {selectedPromptIds.length} {copy.promptUnit}
              </strong>
            </span>
            <span>
              <small>{copy.selectedStyle}</small>
              <strong>{selectedStyle.label[uiLanguage]}</strong>
            </span>
            <span>
              <small>{copy.generationMode}</small>
              <strong>{copy.onePromptOneFigure}</strong>
            </span>
          </div>

          {copyError && (
            <p className="copy-error" role="alert">
              {copy.clipboardError}
            </p>
          )}

          <div className="figure-prompt-list">
            {selectedPromptIds.map((promptId) => {
              const promptSpec = FIGURE_PROMPTS[promptId];
              const promptLanguage = promptLanguages[promptId];
              const prompt = buildFigurePrompt(
                promptId,
                preferences,
                promptLanguage,
              );
              const expanded = expandedPrompts[promptId];
              const copied = copiedPrompt === promptId;
              const promptNextLanguage =
                promptLanguage === "zh" ? "English" : "中文";
              const promptContentId = `figure-prompt-${promptId}`;

              return (
                <article
                  className={`prompt-card ${expanded ? "expanded" : ""}`}
                  key={promptId}
                >
                  <div className="prompt-number" aria-hidden="true">
                    <span>{promptSpec.number}</span>
                    <i />
                  </div>
                  <div className="prompt-card-main">
                    <div className="prompt-card-header">
                      <div>
                        <span className="placeholder-tag">
                          {promptSpec.tag[uiLanguage]} · {copy.independentPrompt}
                        </span>
                        <h3>{promptSpec.label[uiLanguage]}</h3>
                        <p>{promptSpec.purpose[uiLanguage]}</p>
                      </div>
                      <div className="prompt-card-actions">
                        <button
                          className="prompt-language-button"
                          type="button"
                          aria-label={`${copy.switchPromptLanguage}：${promptNextLanguage}`}
                          onClick={() => togglePromptLanguage(promptId)}
                        >
                          {promptNextLanguage}
                        </button>
                        <button
                          className={`copy-button ${copied ? "copied" : ""}`}
                          type="button"
                          onClick={() => copyPrompt(promptId)}
                        >
                          <span aria-hidden="true">{copied ? "✓" : "⧉"}</span>
                          {copied ? copy.copied : copy.copy}
                        </button>
                        <button
                          className="expand-button"
                          type="button"
                          aria-expanded={expanded}
                          aria-controls={promptContentId}
                          onClick={() =>
                            setExpandedPrompts((current) => ({
                              ...current,
                              [promptId]: !current[promptId],
                            }))
                          }
                        >
                          {expanded ? copy.collapse : copy.expand}
                          <span aria-hidden="true">
                            {expanded ? "−" : "+"}
                          </span>
                        </button>
                      </div>
                    </div>
                    {expanded && (
                      <pre className="prompt-content" id={promptContentId}>
                        {prompt}
                      </pre>
                    )}
                  </div>
                </article>
              );
            })}
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
