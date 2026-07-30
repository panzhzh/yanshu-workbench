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
import {
  CAPTION_LENGTH_POLICY,
  type CaptionWordRange,
} from "../../content/prompts/captionLength";

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
  const [captionWordRange, setCaptionWordRange] =
    useState<CaptionWordRange>(
      CAPTION_LENGTH_POLICY.defaultRange,
    );
  const [expanded, setExpanded] = useState(true);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copy = DRAFT_COPY[uiLanguage];

  const prompt = useMemo(
    () =>
      buildDraftPrompt(
        templateId,
        customVenue,
        promptLanguage,
        captionWordRange,
      ),
    [captionWordRange, customVenue, promptLanguage, templateId],
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
    setCaptionWordRange(CAPTION_LENGTH_POLICY.defaultRange);
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

  function updateCaptionRange(
    side: "minimum" | "maximum",
    rawValue: number,
  ) {
    if (!Number.isFinite(rawValue)) return;
    const value = Math.min(
      CAPTION_LENGTH_POLICY.max,
      Math.max(CAPTION_LENGTH_POLICY.min, Math.round(rawValue)),
    );
    setCaptionWordRange(([minimum, maximum]) =>
      side === "minimum"
        ? [Math.min(value, maximum), maximum]
        : [minimum, Math.max(minimum, value)],
    );
    setCopied(false);
    setCopyError(false);
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

          <fieldset className="draft-template-card draft-caption-card">
            <legend>
              <span className="control-index">03</span>
              {copy.captionTitle}
            </legend>
            <div className="framework-custom-ratio caption-word-range">
              <label>
                <span>{copy.captionMinimum}</span>
                <input
                  type="number"
                  min={CAPTION_LENGTH_POLICY.min}
                  max={captionWordRange[1]}
                  step={CAPTION_LENGTH_POLICY.step}
                  value={captionWordRange[0]}
                  onChange={(event) =>
                    updateCaptionRange(
                      "minimum",
                      event.target.valueAsNumber,
                    )
                  }
                />
              </label>
              <span aria-hidden="true">—</span>
              <label>
                <span>{copy.captionMaximum}</span>
                <input
                  type="number"
                  min={captionWordRange[0]}
                  max={CAPTION_LENGTH_POLICY.max}
                  step={CAPTION_LENGTH_POLICY.step}
                  value={captionWordRange[1]}
                  onChange={(event) =>
                    updateCaptionRange(
                      "maximum",
                      event.target.valueAsNumber,
                    )
                  }
                />
              </label>
              <strong>words</strong>
            </div>
            <small>{copy.captionHint}</small>
          </fieldset>
        </section>

        <PromptResizeHandle language={uiLanguage} />

        <section className="content-section prompt-rail draft-prompt-section">
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
                    {promptLanguage === "zh"
                      ? "基于实验材料生成完整 CS 论文初稿"
                      : "Generate a Complete CS Paper Draft"}
                  </h3>
                  <p>
                    {promptLanguage === "zh"
                      ? "读取完整实验材料，生成证据一致、可编译并可继续修改的英文 LaTeX 初稿。"
                      : "Turn complete experimental evidence into an evidence-grounded, compilable English LaTeX draft."}
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
