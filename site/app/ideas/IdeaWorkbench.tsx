"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { PRODUCT_CONFIG } from "../config";
import PromptResizeHandle from "../PromptResizeHandle";
import SiteNavigation from "../SiteNavigation";
import { usePersistentWorkbenchLanguages } from "../usePersistentLanguage";
import {
  buildIdeaPrompt,
  getDefaultIdeaPreferences,
  getIdeaCopy,
  IDEA_COUNT_OPTIONS,
  IDEA_DIRECTIONS,
  IDEA_DIRECTION_IDS,
  NOVELTY_POSTURES,
  NOVELTY_POSTURE_IDS,
  REFINEMENT_FREEDOMS,
  REFINEMENT_FREEDOM_IDS,
  type IdeaCount,
  type IdeaDirectionId,
  type IdeaPreferences,
  type IdeaWorkbenchMode,
  type NoveltyPostureId,
  type RefinementFreedomId,
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

export default function IdeaWorkbench({
  mode,
}: {
  mode: IdeaWorkbenchMode;
}) {
  const {
    uiLanguage,
    promptLanguage,
    setPromptLanguage,
    changeSiteLanguage,
  } = usePersistentWorkbenchLanguages();
  const [preferences, setPreferences] = useState<IdeaPreferences>(() =>
    getDefaultIdeaPreferences(mode),
  );
  const [expanded, setExpanded] = useState(true);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copy = getIdeaCopy(mode, uiLanguage);
  const prompt = useMemo(
    () => buildIdeaPrompt(mode, preferences, promptLanguage),
    [mode, preferences, promptLanguage],
  );
  const promptNextLanguage =
    promptLanguage === "zh" ? "English" : "中文";

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

  function updatePreference<K extends keyof IdeaPreferences>(
    key: K,
    value: IdeaPreferences[K],
  ) {
    setPreferences((current) => ({ ...current, [key]: value }));
    setCopied(false);
    setCopyError(false);
  }

  function resetDefaults() {
    setPreferences(getDefaultIdeaPreferences(mode));
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

  const activePage =
    mode === "discovery" ? "idea-discovery" : "idea-evaluation";

  return (
    <div className="site-shell">
      <SiteNavigation
        language={uiLanguage}
        activePage={activePage}
        mobileMenuOpen={mobileMenuOpen}
        onLanguageChange={(language) => {
          changeSiteLanguage(language);
          setCopied(false);
        }}
        onMenuToggle={() => setMobileMenuOpen((open) => !open)}
        onMenuClose={() => setMobileMenuOpen(false)}
      />

      <main className="site-main" id="main-content">
        <section className="config-section idea-config-section">
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

          <div className="idea-material-strip">
            <div>
              <span className="control-index">IN</span>
              <strong>{copy.materialTitle}</strong>
            </div>
            <div className="idea-material-items">
              {copy.materialItems.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
            <p>{copy.materialHint}</p>
          </div>

          <div className="idea-control-grid">
            <fieldset className="idea-control-card idea-scope-card">
              <legend>
                <span className="control-index">01</span>
                {copy.directionTitle}
              </legend>
              <div className="idea-field-grid">
                <label className="idea-field">
                  <span>{copy.direction}</span>
                  <select
                    value={preferences.directionId}
                    onChange={(event) =>
                      updatePreference(
                        "directionId",
                        event.target.value as IdeaDirectionId,
                      )
                    }
                  >
                    {IDEA_DIRECTION_IDS.map((directionId) => (
                      <option value={directionId} key={directionId}>
                        {IDEA_DIRECTIONS[directionId].label[uiLanguage]}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="idea-field idea-field-grow">
                  <span>{copy.focus}</span>
                  <input
                    type="text"
                    value={preferences.focus}
                    placeholder={copy.focusPlaceholder}
                    onChange={(event) =>
                      updatePreference("focus", event.target.value)
                    }
                  />
                </label>
              </div>

              <label className="idea-field idea-textarea-field">
                <span>{copy.seed}</span>
                <textarea
                  rows={3}
                  value={preferences.seed}
                  placeholder={copy.seedPlaceholder}
                  onChange={(event) =>
                    updatePreference("seed", event.target.value)
                  }
                />
              </label>
            </fieldset>

            <fieldset className="idea-control-card idea-evidence-card">
              <legend>
                <span className="control-index">02</span>
                {copy.evidenceTitle}
              </legend>

              <div className="idea-evidence-row">
                <label className="idea-number-field">
                  <span>{copy.recentYears}</span>
                  <span>
                    <input
                      type="number"
                      min={1}
                      max={15}
                      step={1}
                      value={preferences.recentYears}
                      onChange={(event) => {
                        const value = event.target.valueAsNumber;
                        updatePreference(
                          "recentYears",
                          Number.isFinite(value)
                            ? Math.min(15, Math.max(1, Math.round(value)))
                            : getDefaultIdeaPreferences(mode).recentYears,
                        );
                      }}
                    />
                    <small>{copy.years}</small>
                  </span>
                </label>

                <div className="idea-source-options">
                  <span>{copy.sourceScope}</span>
                  <button
                    className={`idea-check-option ${
                      preferences.topConferences ? "active" : ""
                    }`}
                    type="button"
                    role="switch"
                    aria-checked={preferences.topConferences}
                    onClick={() =>
                      updatePreference(
                        "topConferences",
                        !preferences.topConferences,
                      )
                    }
                  >
                    <i aria-hidden="true">
                      {preferences.topConferences ? "✓" : ""}
                    </i>
                    <span>
                      <strong>{copy.topConferences}</strong>
                      <small>{copy.topConferencesHint}</small>
                    </span>
                  </button>
                  <button
                    className={`idea-check-option ${
                      preferences.topJournals ? "active" : ""
                    }`}
                    type="button"
                    role="switch"
                    aria-checked={preferences.topJournals}
                    onClick={() =>
                      updatePreference(
                        "topJournals",
                        !preferences.topJournals,
                      )
                    }
                  >
                    <i aria-hidden="true">
                      {preferences.topJournals ? "✓" : ""}
                    </i>
                    <span>
                      <strong>{copy.topJournals}</strong>
                      <small>{copy.topJournalsHint}</small>
                    </span>
                  </button>
                </div>
              </div>

              <label className="idea-field">
                <span>{copy.customVenues}</span>
                <input
                  type="text"
                  value={preferences.customVenues}
                  placeholder={copy.customVenuesPlaceholder}
                  onChange={(event) =>
                    updatePreference("customVenues", event.target.value)
                  }
                />
              </label>
              <small>{copy.evidenceHint}</small>
            </fieldset>

            <fieldset className="idea-control-card idea-data-card">
              <legend>
                <span className="control-index">03</span>
                {copy.dataTitle}
              </legend>

              <label className="idea-field">
                <span>{copy.dataset}</span>
                <textarea
                  rows={2}
                  value={preferences.dataset}
                  placeholder={copy.datasetPlaceholder}
                  onChange={(event) =>
                    updatePreference("dataset", event.target.value)
                  }
                />
              </label>

              <button
                className={`switch-row idea-sota-switch ${
                  preferences.pursueSota ? "active" : ""
                }`}
                type="button"
                role="switch"
                aria-checked={preferences.pursueSota}
                onClick={() =>
                  updatePreference("pursueSota", !preferences.pursueSota)
                }
              >
                <span className="switch-track" aria-hidden="true">
                  <span />
                </span>
                <span>
                  <strong>{copy.sota}</strong>
                  <small>
                    {preferences.pursueSota ? copy.sotaOn : copy.sotaOff}
                  </small>
                </span>
              </button>
              <p className="idea-inline-hint">{copy.sotaHint}</p>

              <label className="idea-field">
                <span>{copy.resources}</span>
                <textarea
                  rows={2}
                  value={preferences.resourceConstraints}
                  placeholder={copy.resourcesPlaceholder}
                  onChange={(event) =>
                    updatePreference(
                      "resourceConstraints",
                      event.target.value,
                    )
                  }
                />
              </label>
            </fieldset>

            <fieldset className="idea-control-card idea-strategy-card">
              <legend>
                <span className="control-index">04</span>
                {copy.strategyTitle}
              </legend>

              {mode === "discovery" ? (
                <div className="idea-strategy-grid">
                  <div className="idea-segment-group">
                    <strong>{copy.ideaCount}</strong>
                    <div className="refinement-segmented">
                      {IDEA_COUNT_OPTIONS.map((count) => (
                        <button
                          className={
                            preferences.ideaCount === count ? "active" : ""
                          }
                          type="button"
                          key={count}
                          onClick={() =>
                            updatePreference("ideaCount", count as IdeaCount)
                          }
                        >
                          {count}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="idea-segment-group">
                    <strong>{copy.noveltyPosture}</strong>
                    <div className="refinement-segmented">
                      {NOVELTY_POSTURE_IDS.map((postureId) => (
                        <button
                          className={
                            preferences.noveltyPosture === postureId
                              ? "active"
                              : ""
                          }
                          type="button"
                          key={postureId}
                          onClick={() =>
                            updatePreference(
                              "noveltyPosture",
                              postureId as NoveltyPostureId,
                            )
                          }
                        >
                          {NOVELTY_POSTURES[postureId].label[uiLanguage]}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="idea-refinement-options">
                  <strong>{copy.refinementFreedom}</strong>
                  <div>
                    {REFINEMENT_FREEDOM_IDS.map((freedomId) => (
                      <button
                        className={
                          preferences.refinementFreedom === freedomId
                            ? "active"
                            : ""
                        }
                        type="button"
                        key={freedomId}
                        onClick={() =>
                          updatePreference(
                            "refinementFreedom",
                            freedomId as RefinementFreedomId,
                          )
                        }
                      >
                        <i aria-hidden="true" />
                        <span>
                          <strong>
                            {REFINEMENT_FREEDOMS[freedomId].label[uiLanguage]}
                          </strong>
                          <small>
                            {
                              REFINEMENT_FREEDOMS[freedomId].description[
                                uiLanguage
                              ]
                            }
                          </small>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <label className="idea-field idea-additional-field">
                <span>{copy.additionalCriteria}</span>
                <textarea
                  rows={2}
                  value={preferences.additionalCriteria}
                  placeholder={copy.additionalCriteriaPlaceholder}
                  onChange={(event) =>
                    updatePreference(
                      "additionalCriteria",
                      event.target.value,
                    )
                  }
                />
              </label>
              <small>{copy.strategyHint}</small>
            </fieldset>

            <div className="idea-output-card">
              <div>
                <span className="control-index">OUT</span>
                <strong>{copy.outputTitle}</strong>
              </div>
              <span>{copy.outputValue}</span>
              <small>{copy.outputHint}</small>
            </div>
          </div>
        </section>

        <PromptResizeHandle language={uiLanguage} />

        <section className="content-section prompt-rail idea-prompt-section">
          {copyError && (
            <p className="copy-error" role="alert">
              {copy.clipboardError}
            </p>
          )}

          <article className={`prompt-card ${expanded ? "expanded" : ""}`}>
            <div className="prompt-card-main">
              <div className="prompt-card-header">
                <div>
                  <h3>{copy.promptTitle}</h3>
                  <p>{copy.promptDescription}</p>
                </div>
                <div className="prompt-card-actions">
                  <button
                    className="prompt-language-button"
                    type="button"
                    aria-label={`${copy.promptSwitch}：${promptNextLanguage}`}
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
                    aria-controls={`${mode}-idea-prompt`}
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
                  id={`${mode}-idea-prompt`}
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
          <span>{copy.outputValue}</span>
        </footer>
      </main>
    </div>
  );
}
