"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import SiteNavigation from "../SiteNavigation";
import { PRODUCT_CONFIG, type Language } from "../config";
import {
  buildFigurePrompt,
  DEFAULT_FIGURE_PREFERENCES,
  FIGURE_COPY,
  FIGURE_STYLE_IDS,
  FIGURE_STYLES,
  TECHNICAL_FIGURE_COUNTS,
  type FigurePreferences,
  type TechnicalFigureCount,
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

export default function FigureWorkbench() {
  const [uiLanguage, setUiLanguage] = useState<Language>(
    PRODUCT_CONFIG.defaultLanguage,
  );
  const [promptLanguage, setPromptLanguage] = useState<Language>(
    PRODUCT_CONFIG.defaultPromptLanguage,
  );
  const [preferences, setPreferences] = useState<FigurePreferences>({
    ...DEFAULT_FIGURE_PREFERENCES,
  });
  const [expanded, setExpanded] = useState(true);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copy = FIGURE_COPY[uiLanguage];
  const selectedFigureCount =
    Number(preferences.includeIntroductionFigure) +
    Number(preferences.includeMethodOverview) +
    preferences.technicalFigureCount;
  const selectedStyle = FIGURE_STYLES[preferences.styleId];
  const prompt = useMemo(
    () => buildFigurePrompt(preferences, promptLanguage),
    [preferences, promptLanguage],
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

  function updatePreferences(
    update: (current: FigurePreferences) => FigurePreferences,
  ) {
    setPreferences(update);
    setCopied(false);
    setCopyError(false);
  }

  function toggleIntroductionFigure() {
    updatePreferences((current) => {
      if (
        current.includeIntroductionFigure &&
        !current.includeMethodOverview &&
        current.technicalFigureCount === 0
      ) {
        return current;
      }
      return {
        ...current,
        includeIntroductionFigure: !current.includeIntroductionFigure,
      };
    });
  }

  function toggleMethodOverview() {
    updatePreferences((current) => {
      if (
        current.includeMethodOverview &&
        !current.includeIntroductionFigure &&
        current.technicalFigureCount === 0
      ) {
        return current;
      }
      return {
        ...current,
        includeMethodOverview: !current.includeMethodOverview,
      };
    });
  }

  function setTechnicalFigureCount(value: TechnicalFigureCount) {
    updatePreferences((current) => {
      if (
        value === 0 &&
        !current.includeIntroductionFigure &&
        !current.includeMethodOverview
      ) {
        return current;
      }
      return { ...current, technicalFigureCount: value };
    });
  }

  function resetDefaults() {
    setPreferences({ ...DEFAULT_FIGURE_PREFERENCES });
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
        activePage="figures"
        mobileMenuOpen={mobileMenuOpen}
        onLanguageChange={(language) => {
          setUiLanguage(language);
          setCopied(false);
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
                <button
                  type="button"
                  role="switch"
                  aria-checked={preferences.includeIntroductionFigure}
                  className={
                    preferences.includeIntroductionFigure ? "active" : ""
                  }
                  onClick={toggleIntroductionFigure}
                >
                  <span className="figure-task-marker" aria-hidden="true">
                    {preferences.includeIntroductionFigure ? "✓" : ""}
                  </span>
                  <span>
                    <strong>{copy.introductionFigure}</strong>
                    <small>{copy.introductionFigureHint}</small>
                  </span>
                </button>

                <button
                  type="button"
                  role="switch"
                  aria-checked={preferences.includeMethodOverview}
                  className={
                    preferences.includeMethodOverview ? "active" : ""
                  }
                  onClick={toggleMethodOverview}
                >
                  <span className="figure-task-marker" aria-hidden="true">
                    {preferences.includeMethodOverview ? "✓" : ""}
                  </span>
                  <span>
                    <strong>{copy.methodOverview}</strong>
                    <small>{copy.methodOverviewHint}</small>
                  </span>
                </button>

                <div className="technical-count-row">
                  <span>
                    <strong>{copy.technicalFigures}</strong>
                    <small>{copy.technicalFiguresHint}</small>
                  </span>
                  <div
                    className="technical-count-options"
                    role="radiogroup"
                    aria-label={copy.technicalFigures}
                  >
                    {TECHNICAL_FIGURE_COUNTS.map((count) => (
                      <button
                        type="button"
                        role="radio"
                        aria-checked={
                          preferences.technicalFigureCount === count
                        }
                        className={
                          preferences.technicalFigureCount === count
                            ? "active"
                            : ""
                        }
                        key={count}
                        onClick={() => setTechnicalFigureCount(count)}
                      >
                        {count}
                      </button>
                    ))}
                  </div>
                </div>
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
              <small>{copy.selectedFigures}</small>
              <strong>
                {selectedFigureCount} {copy.figuresUnit}
              </strong>
            </span>
            <span>
              <small>{copy.selectedStyle}</small>
              <strong>{selectedStyle.label[uiLanguage]}</strong>
            </span>
            <span>
              <small>{copy.promptLanguage}</small>
              <strong>{promptLanguage === "zh" ? "中文" : "English"}</strong>
            </span>
          </div>

          {copyError && (
            <p className="copy-error" role="alert">
              {copy.clipboardError}
            </p>
          )}

          <article className={`prompt-card ${expanded ? "expanded" : ""}`}>
            <div className="prompt-number" aria-hidden="true">
              <span>01</span>
              <i />
            </div>
            <div className="prompt-card-main">
              <div className="prompt-card-header">
                <div>
                  <span className="placeholder-tag">{copy.livePrompt}</span>
                  <h3>{copy.promptTitle}</h3>
                  <p>{copy.promptBody}</p>
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
                    aria-controls="figure-prompt"
                    onClick={() => setExpanded((current) => !current)}
                  >
                    {expanded ? copy.collapse : copy.expand}
                    <span aria-hidden="true">{expanded ? "−" : "+"}</span>
                  </button>
                </div>
              </div>
              {expanded && (
                <pre className="prompt-content" id="figure-prompt">
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
