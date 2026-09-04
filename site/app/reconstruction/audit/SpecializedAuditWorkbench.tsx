"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import PromptResizeHandle from "../../PromptResizeHandle";
import SiteNavigation from "../../SiteNavigation";
import { PRODUCT_CONFIG } from "../../config";
import { usePersistentWorkbenchLanguages } from "../../usePersistentLanguage";
import {
  AUDIT_COPY,
  AUDIT_EXECUTION_MODES,
  AUDIT_EXECUTION_MODE_IDS,
  buildSpecializedAuditPrompt,
  DEFAULT_SPECIALIZED_AUDIT_PREFERENCES,
  SPECIALIZED_AUDITS,
  SPECIALIZED_AUDIT_IDS,
  type AuditExecutionMode,
  type SpecializedAuditId,
  type SpecializedAuditPreferences,
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

function createDefaultPreferences(): SpecializedAuditPreferences {
  return {
    ...DEFAULT_SPECIALIZED_AUDIT_PREFERENCES,
    selectedAuditIds: [
      ...DEFAULT_SPECIALIZED_AUDIT_PREFERENCES.selectedAuditIds,
    ],
  };
}

export default function SpecializedAuditWorkbench() {
  const {
    uiLanguage,
    promptLanguage,
    setPromptLanguage,
    changeSiteLanguage,
  } = usePersistentWorkbenchLanguages();
  const [preferences, setPreferences] =
    useState<SpecializedAuditPreferences>(createDefaultPreferences);
  const [expanded, setExpanded] = useState(true);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copy = AUDIT_COPY[uiLanguage];
  const selectedCount = preferences.selectedAuditIds.length;
  const hasSelection = selectedCount > 0;
  const prompt = useMemo(
    () => buildSpecializedAuditPrompt(preferences, promptLanguage),
    [preferences, promptLanguage],
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

  function clearCopyState() {
    setCopied(false);
    setCopyError(false);
  }

  function toggleAudit(auditId: SpecializedAuditId) {
    setPreferences((current) => {
      const selected = current.selectedAuditIds.includes(auditId)
        ? current.selectedAuditIds.filter((id) => id !== auditId)
        : SPECIALIZED_AUDIT_IDS.filter(
            (id) =>
              current.selectedAuditIds.includes(id) || id === auditId,
          );
      return { ...current, selectedAuditIds: selected };
    });
    clearCopyState();
  }

  function selectAllAudits() {
    setPreferences((current) => ({
      ...current,
      selectedAuditIds: [...SPECIALIZED_AUDIT_IDS],
    }));
    clearCopyState();
  }

  function clearAudits() {
    setPreferences((current) => ({
      ...current,
      selectedAuditIds: [],
    }));
    clearCopyState();
  }

  function selectExecutionMode(executionMode: AuditExecutionMode) {
    setPreferences((current) => ({ ...current, executionMode }));
    clearCopyState();
  }

  function resetDefaults() {
    setPreferences(createDefaultPreferences());
    clearCopyState();
  }

  async function copyPrompt() {
    if (!prompt) return;
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

  return (
    <div className="site-shell">
      <SiteNavigation
        language={uiLanguage}
        activePage="audit"
        mobileMenuOpen={mobileMenuOpen}
        onLanguageChange={(language) => {
          changeSiteLanguage(language);
          clearCopyState();
        }}
        onMenuToggle={() => setMobileMenuOpen((open) => !open)}
        onMenuClose={() => setMobileMenuOpen(false)}
      />

      <main className="site-main" id="main-content">
        <section className="config-section refinement-config-section audit-config-section">
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

          <div className="refinement-control-grid audit-control-grid">
            <fieldset className="refinement-control-card audit-selection-card">
              <legend>
                <span className="control-index">01</span>
                {copy.auditSelection}
              </legend>

              <div className="audit-selection-toolbar">
                <span>
                  {copy.selectedCount} <strong>{selectedCount}</strong>{" "}
                  {copy.items}
                </span>
                <div>
                  <button type="button" onClick={selectAllAudits}>
                    {copy.selectAll}
                  </button>
                  <button
                    type="button"
                    onClick={clearAudits}
                    disabled={!hasSelection}
                  >
                    {copy.clear}
                  </button>
                </div>
              </div>

              <div
                className="audit-option-grid"
                role="group"
                aria-label={copy.auditSelection}
              >
                {SPECIALIZED_AUDIT_IDS.map((auditId) => {
                  const audit = SPECIALIZED_AUDITS[auditId];
                  const active =
                    preferences.selectedAuditIds.includes(auditId);
                  return (
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={active}
                      className={active ? "active" : ""}
                      key={auditId}
                      onClick={() => toggleAudit(auditId)}
                    >
                      <span
                        className="audit-option-mark"
                        aria-hidden="true"
                      >
                        {active ? "✓" : ""}
                      </span>
                      <span>
                        <strong>{audit.label[uiLanguage]}</strong>
                        <small>{audit.summary[uiLanguage]}</small>
                      </span>
                      <i aria-hidden="true">{audit.tag}</i>
                    </button>
                  );
                })}
              </div>
              <small>{copy.auditSelectionHint}</small>
            </fieldset>

            <fieldset className="refinement-control-card audit-execution-card">
              <legend>
                <span className="control-index">02</span>
                {copy.execution}
              </legend>
              <div
                className="refinement-organization-options audit-execution-options"
                role="radiogroup"
                aria-label={copy.execution}
              >
                {AUDIT_EXECUTION_MODE_IDS.map((modeId) => {
                  const mode = AUDIT_EXECUTION_MODES[modeId];
                  const active = preferences.executionMode === modeId;
                  return (
                    <button
                      type="button"
                      role="radio"
                      aria-checked={active}
                      className={active ? "active" : ""}
                      key={modeId}
                      onClick={() => selectExecutionMode(modeId)}
                    >
                      <strong>{mode.label[uiLanguage]}</strong>
                      <small>{mode.description[uiLanguage]}</small>
                    </button>
                  );
                })}
              </div>
              <small>{copy.executionHint}</small>
            </fieldset>
          </div>
        </section>

        <PromptResizeHandle language={uiLanguage} />

        <section className="content-section prompt-rail refinement-prompt-section audit-prompt-section">
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
                    {hasSelection
                      ? `${copy.promptTitle} · ${selectedCount} ${copy.items}`
                      : copy.emptyPromptTitle}
                  </h3>
                  <p>
                    {hasSelection
                      ? copy.promptPurpose
                      : copy.emptyPromptPurpose}
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
                      clearCopyState();
                    }}
                  >
                    {promptNextLanguage}
                  </button>
                  <button
                    className={`copy-button ${copied ? "copied" : ""}`}
                    type="button"
                    onClick={copyPrompt}
                    disabled={!hasSelection}
                  >
                    <span aria-hidden="true">{copied ? "✓" : "⧉"}</span>
                    {copied ? copy.copied : copy.copy}
                  </button>
                  <button
                    className="expand-button"
                    type="button"
                    aria-expanded={expanded}
                    aria-controls="specialized-audit-prompt"
                    onClick={() => setExpanded((current) => !current)}
                    disabled={!hasSelection}
                  >
                    {expanded ? copy.collapse : copy.expand}
                    <span aria-hidden="true">{expanded ? "−" : "+"}</span>
                  </button>
                </div>
              </div>
              {expanded && hasSelection && (
                <pre
                  className="prompt-content"
                  id="specialized-audit-prompt"
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
