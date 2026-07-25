"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { PRODUCT_CONFIG, type Language } from "../config";
import PromptResizeHandle from "../PromptResizeHandle";
import SiteNavigation from "../SiteNavigation";
import {
  ARXIV_STYLE_REPOSITORY,
  buildDraftPrompt,
  DEFAULT_DRAFT_TEMPLATE_ID,
  DRAFT_COPY,
  DRAFT_TEMPLATE_IDS,
  DRAFT_TEMPLATES,
  type DraftTemplateId,
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

export default function DraftWorkbench() {
  const [uiLanguage, setUiLanguage] = useState<Language>(
    PRODUCT_CONFIG.defaultLanguage,
  );
  const [promptLanguage, setPromptLanguage] = useState<Language>(
    PRODUCT_CONFIG.defaultPromptLanguage,
  );
  const [templateId, setTemplateId] = useState<DraftTemplateId>(
    DEFAULT_DRAFT_TEMPLATE_ID,
  );
  const [customVenue, setCustomVenue] = useState("");
  const [expanded, setExpanded] = useState(true);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copy = DRAFT_COPY[uiLanguage];

  const prompt = useMemo(
    () => buildDraftPrompt(templateId, customVenue, promptLanguage),
    [customVenue, promptLanguage, templateId],
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

  function resetDefaults() {
    setTemplateId(DEFAULT_DRAFT_TEMPLATE_ID);
    setCustomVenue("");
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

  return (
    <div className="site-shell">
      <SiteNavigation
        language={uiLanguage}
        activePage="draft"
        mobileMenuOpen={mobileMenuOpen}
        onLanguageChange={(language) => {
          setUiLanguage(language);
          setCopied(false);
        }}
        onMenuToggle={() => setMobileMenuOpen((open) => !open)}
        onMenuClose={() => setMobileMenuOpen(false)}
      />

      <main className="site-main" id="main-content">
        <section className="config-section draft-config-section">
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

          <div className="draft-input-card">
            <div className="draft-card-heading">
              <span className="control-index">01</span>
              <strong>{copy.inputTitle}</strong>
            </div>
            <div className="draft-input-list">
              {copy.inputItems.map((item) => (
                <span key={item}>
                  <i aria-hidden="true">✓</i>
                  {item}
                </span>
              ))}
            </div>
            <p>{copy.inputHint}</p>
          </div>

          <fieldset className="draft-template-card">
            <legend>
              <span className="control-index">02</span>
              {copy.templateTitle}
            </legend>
            <div className="draft-template-row">
              <label>
                <span className="sr-only">{copy.templateTitle}</span>
                <select
                  value={templateId}
                  onChange={(event) => {
                    setTemplateId(event.target.value as DraftTemplateId);
                    setCopied(false);
                  }}
                >
                  <optgroup label={copy.preprintGroup}>
                    {DRAFT_TEMPLATE_IDS.filter(
                      (id) => DRAFT_TEMPLATES[id].group === "preprint",
                    ).map((id) => (
                      <option value={id} key={id}>
                        {DRAFT_TEMPLATES[id].label}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label={copy.conferenceGroup}>
                    {DRAFT_TEMPLATE_IDS.filter(
                      (id) => DRAFT_TEMPLATES[id].group === "conference",
                    ).map((id) => (
                      <option value={id} key={id}>
                        {DRAFT_TEMPLATES[id].label}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label={copy.customGroup}>
                    <option value="custom">{DRAFT_TEMPLATES.custom.label}</option>
                  </optgroup>
                </select>
              </label>
              {templateId === "custom" && (
                <label className="draft-custom-venue">
                  <span>{copy.customVenue}</span>
                  <input
                    value={customVenue}
                    placeholder={copy.customVenuePlaceholder}
                    onChange={(event) => {
                      setCustomVenue(event.target.value);
                      setCopied(false);
                    }}
                  />
                </label>
              )}
            </div>
            <small>{copy.templateHint}</small>
            {templateId === "arxiv" && (
              <div className="draft-template-source">
                <span>{copy.templateSource}</span>
                <a
                  href={ARXIV_STYLE_REPOSITORY}
                  target="_blank"
                  rel="noreferrer"
                >
                  kourgeorge/arxiv-style
                  <span aria-hidden="true">↗</span>
                </a>
                <small>{copy.templateBoundary}</small>
              </div>
            )}
          </fieldset>
        </section>

        <PromptResizeHandle language={uiLanguage} />

        <section className="content-section prompt-rail draft-prompt-section">
          <div className="section-heading-row workflow-heading">
            <div>
              <p className="eyebrow">{copy.promptEyebrow}</p>
              <h2>{copy.promptTitle}</h2>
            </div>
            <p className="section-intro">{copy.promptBody}</p>
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
                  <h3>
                    {promptLanguage === "zh"
                      ? "基于实验材料生成完整 CS 论文初稿"
                      : "Generate a Complete CS Paper Draft"}
                  </h3>
                  <p>
                    {DRAFT_TEMPLATES[templateId].label} · {copy.preset}
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
                    aria-controls="draft-prompt"
                    onClick={() => setExpanded((current) => !current)}
                  >
                    {expanded ? copy.collapse : copy.expand}
                    <span aria-hidden="true">{expanded ? "−" : "+"}</span>
                  </button>
                </div>
              </div>
              {expanded && (
                <pre className="prompt-content" id="draft-prompt">
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
