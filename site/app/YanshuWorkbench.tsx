"use client";

import {
  PRODUCT_CONFIG,
  UI_COPY,
  type Language,
  type PaperStyleId,
  type SectionDefinition,
} from "./config";
import SiteNavigation from "./SiteNavigation";
import PromptResizeHandle from "./PromptResizeHandle";
import { buildPrompt } from "../content/prompts/buildPrompt";
import type { CaptionWordRange } from "../content/prompts/captionLength";
import { RECONSTRUCTION_WORKFLOW_VERSION } from "../content/prompts/version";
import {
  getRequestedChatPollingIntervalMs,
  type ChatExecutionPreferences,
  type ChatReasoningPreferenceId,
} from "../content/prompts/chatExecution";
import { RECONSTRUCTION_PROMPTS } from "../content/prompts/templates";
import { CODEX_START_GUIDE } from "./reconstruction/startGuide";
import { useEffect, useMemo, useRef, useState } from "react";

type SectionWords = Record<string, number>;
type PromptLanguages = Record<string, Language>;
type CopyState = string | "all" | null;
type AllocationMode = "preset" | "custom";

const SECTION_COLORS = [
  "#24495f",
  "#3f687b",
  "#5c8290",
  "#7c9ca5",
  "#9aafb3",
  "#728679",
  "#a28f72",
];

const UNLIMITED_CORE_SECTION_IDS = new Set<string>(
  PRODUCT_CONFIG.wordCount.unlimitedSectionIds,
);

function allocateWords(
  target: number,
  sections: readonly SectionDefinition[],
): SectionWords {
  const raw = sections.map((section) => target * section.ratio);
  const allocated = raw.map((value) => Math.floor(value));
  let remaining = target - allocated.reduce((sum, value) => sum + value, 0);

  const remainderOrder = raw
    .map((value, index) => ({ index, remainder: value - allocated[index] }))
    .sort((a, b) => b.remainder - a.remainder);

  let cursor = 0;
  while (remaining > 0) {
    allocated[remainderOrder[cursor % remainderOrder.length].index] += 1;
    remaining -= 1;
    cursor += 1;
  }

  return Object.fromEntries(
    sections.map((section, index) => [section.id, allocated[index]]),
  );
}

function clampTarget(value: number) {
  return Math.min(
    PRODUCT_CONFIG.wordCount.max,
    Math.max(PRODUCT_CONFIG.wordCount.min, Math.round(value)),
  );
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

function formatNumber(value: number, language: Language) {
  return new Intl.NumberFormat(language === "zh" ? "zh-CN" : "en-US").format(
    value,
  );
}

function formatRatio(value: number) {
  const percentage = value * 100;
  return `${percentage.toFixed(1).replace(/\.0$/, "")}%`;
}

export default function YanshuWorkbench() {
  const defaultStyle =
    PRODUCT_CONFIG.paperStyles[PRODUCT_CONFIG.defaultPaperStyle];
  const [uiLanguage, setUiLanguage] = useState<Language>(
    PRODUCT_CONFIG.defaultLanguage,
  );
  const [promptLanguages, setPromptLanguages] = useState<PromptLanguages>(
    () =>
      Object.fromEntries(
        RECONSTRUCTION_PROMPTS.map((round) => [
          round.id,
          PRODUCT_CONFIG.defaultPromptLanguage,
        ]),
      ),
  );
  const [styleId, setStyleId] = useState<PaperStyleId>(
    PRODUCT_CONFIG.defaultPaperStyle,
  );
  const [
    includeSectionNavigationSentence,
    setIncludeSectionNavigationSentence,
  ] = useState(defaultStyle.defaultIncludeSectionNavigationSentence);
  const [targetWords, setTargetWords] = useState(
    defaultStyle.defaultTargetWords,
  );
  const [hasWordLimit, setHasWordLimit] = useState<boolean>(
    PRODUCT_CONFIG.wordCount.defaultMode === "target",
  );
  const [unlimitedCoreSections, setUnlimitedCoreSections] = useState<boolean>(
    PRODUCT_CONFIG.wordCount.defaultUnlimitedCoreSections,
  );
  const [includeAppendix, setIncludeAppendix] = useState<boolean>(
    defaultStyle.defaultAppendix,
  );
  const [captionWordRange, setCaptionWordRange] =
    useState<CaptionWordRange>(
      PRODUCT_CONFIG.captionLength.defaultRange,
    );
  const [chatExecution, setChatExecution] =
    useState<ChatExecutionPreferences>(() => ({
      ...PRODUCT_CONFIG.chatExecution.default,
    }));
  const [sectionWords, setSectionWords] = useState<SectionWords>(() =>
    allocateWords(defaultStyle.defaultTargetWords, defaultStyle.sections),
  );
  const [allocationMode, setAllocationMode] =
    useState<AllocationMode>("preset");
  const [allocationExpanded, setAllocationExpanded] = useState(true);
  const [expandedRounds, setExpandedRounds] = useState<Set<string>>(
    () => new Set([RECONSTRUCTION_PROMPTS[0].id]),
  );
  const [copied, setCopied] = useState<CopyState>(null);
  const [copyError, setCopyError] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const targetInputRef = useRef<HTMLInputElement>(null);

  const copy = UI_COPY[uiLanguage];
  const codexStart = CODEX_START_GUIDE[uiLanguage];
  const style = PRODUCT_CONFIG.paperStyles[styleId];
  const allocatedWords = Object.values(sectionWords).reduce(
    (sum, value) => sum + value,
    0,
  );
  const budgetedSections = unlimitedCoreSections
    ? style.sections.filter(
        (section) => !UNLIMITED_CORE_SECTION_IDS.has(section.id),
      )
    : style.sections;
  const budgetedWords = budgetedSections.reduce(
    (sum, section) => sum + (sectionWords[section.id] ?? 0),
    0,
  );
  const distributionDenominator = Math.max(
    unlimitedCoreSections ? budgetedWords : allocatedWords,
    unlimitedCoreSections ? 1 : targetWords,
    1,
  );
  const chatReasoningPreference =
    PRODUCT_CONFIG.chatExecution.reasoningPreferences[
      chatExecution.reasoningPreference
    ];
  const chatPollingIntervalMs = getRequestedChatPollingIntervalMs(
    chatExecution.reasoningPreference,
  );
  const chatPollingDescription =
    chatExecution.reasoningPreference === "pro" &&
    !chatExecution.forceProForAllTurns
      ? uiLanguage === "zh"
        ? "首次 Pro 每 5 分钟；后续 Extra High 每 3 分钟"
        : "First Pro interaction every 5 minutes; later Extra High interactions every 3 minutes"
      : chatPollingIntervalMs === null
      ? copy.chatPollingAuto
      : uiLanguage === "zh"
        ? `每 ${chatPollingIntervalMs / 60_000} 分钟检查一次`
        : `Check every ${chatPollingIntervalMs / 60_000} ${
            chatPollingIntervalMs === 60_000 ? "minute" : "minutes"
          }`;

  const prompts = useMemo(
    () =>
      RECONSTRUCTION_PROMPTS.map((round) => {
        const language =
          promptLanguages[round.id] ??
          PRODUCT_CONFIG.defaultPromptLanguage;
        return {
          round,
          language,
          text: buildPrompt(round, {
            language,
            styleId,
            styleLabel: style.label[language],
            styleDirective: style.promptDirective[language],
            includeSectionNavigationSentence,
            targetWords,
            hasWordLimit,
            unlimitedCoreSections,
            sectionBudgets: style.sections.map((section) => ({
              id: section.id,
              label: section.label[language],
              words: sectionWords[section.id] ?? 0,
            })),
            includeAppendix,
            appendixLabel: includeAppendix
              ? UI_COPY[language].appendixOn
              : UI_COPY[language].appendixOff,
            appendixDirective: includeAppendix
              ? style.appendixRule.enabled[language]
              : style.appendixRule.disabled[language],
            captionWordRange,
          }),
        };
      }),
    [
      promptLanguages,
      styleId,
      includeSectionNavigationSentence,
      targetWords,
      hasWordLimit,
      unlimitedCoreSections,
      includeAppendix,
      captionWordRange,
      sectionWords,
      style,
    ],
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

  function announceCopied(next: CopyState) {
    setCopyError(false);
    setCopied(next);
    if (copyTimer.current) clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopied(null), 2200);
  }

  async function copyText(text: string, id: CopyState) {
    try {
      await writeClipboard(text);
      announceCopied(id);
    } catch {
      setCopied(null);
      setCopyError(true);
    }
  }

  function changeLanguage(language: Language) {
    setUiLanguage(language);
    setCopied(null);
  }

  function togglePromptLanguage(roundId: string) {
    setPromptLanguages((current) => ({
      ...current,
      [roundId]: current[roundId] === "en" ? "zh" : "en",
    }));
    setCopied(null);
  }

  function changeWordLimitMode(enabled: boolean) {
    setHasWordLimit(enabled);
    setAllocationExpanded(enabled);
    setCopied(null);
  }

  function changeStyle(nextStyleId: PaperStyleId) {
    const nextStyle = PRODUCT_CONFIG.paperStyles[nextStyleId];
    setStyleId(nextStyleId);
    setIncludeSectionNavigationSentence(
      nextStyle.defaultIncludeSectionNavigationSentence,
    );
    setTargetWords(nextStyle.defaultTargetWords);
    setUnlimitedCoreSections(
      PRODUCT_CONFIG.wordCount.defaultUnlimitedCoreSections,
    );
    setIncludeAppendix(nextStyle.defaultAppendix);
    setSectionWords(
      allocateWords(nextStyle.defaultTargetWords, nextStyle.sections),
    );
    setAllocationMode("preset");
    setAllocationExpanded(true);
    setCopied(null);
  }

  function changeTarget(rawValue: number) {
    if (!Number.isFinite(rawValue)) return;
    const nextTarget = clampTarget(rawValue);
    setTargetWords(nextTarget);
    setSectionWords(allocateWords(nextTarget, style.sections));
    setAllocationMode("preset");
    setCopied(null);
  }

  function changeSection(sectionId: string, rawValue: number) {
    if (!Number.isFinite(rawValue)) return;
    const nextSectionWords = {
      ...sectionWords,
      [sectionId]: Math.max(0, Math.round(rawValue)),
    };
    const nextTotal = Object.values(nextSectionWords).reduce(
      (sum, value) => sum + value,
      0,
    );
    setSectionWords(nextSectionWords);
    setTargetWords(nextTotal);
    setAllocationMode("custom");
    setCopied(null);
  }

  function changeCaptionWordRange(
    side: "minimum" | "maximum",
    rawValue: number,
  ) {
    if (!Number.isFinite(rawValue)) return;
    const value = Math.min(
      PRODUCT_CONFIG.captionLength.max,
      Math.max(
        PRODUCT_CONFIG.captionLength.min,
        Math.round(rawValue),
      ),
    );
    setCaptionWordRange(([minimum, maximum]) =>
      side === "minimum"
        ? [Math.min(value, maximum), maximum]
        : [minimum, Math.max(minimum, value)],
    );
    setCopied(null);
  }

  function resetAllocation() {
    if (unlimitedCoreSections) {
      const preset = allocateWords(style.defaultTargetWords, style.sections);
      const nextSectionWords = Object.fromEntries(
        style.sections.map((section) => [
          section.id,
          UNLIMITED_CORE_SECTION_IDS.has(section.id)
            ? (sectionWords[section.id] ?? preset[section.id])
            : preset[section.id],
        ]),
      );
      setSectionWords(nextSectionWords);
      setTargetWords(
        Object.values(nextSectionWords).reduce(
          (sum, value) => sum + value,
          0,
        ),
      );
    } else {
      setSectionWords(allocateWords(targetWords, style.sections));
    }
    setAllocationMode("preset");
    setCopied(null);
  }

  function resetDefaults() {
    const nextStyle =
      PRODUCT_CONFIG.paperStyles[PRODUCT_CONFIG.defaultPaperStyle];
    setStyleId(PRODUCT_CONFIG.defaultPaperStyle);
    setIncludeSectionNavigationSentence(
      nextStyle.defaultIncludeSectionNavigationSentence,
    );
    setTargetWords(nextStyle.defaultTargetWords);
    setHasWordLimit(PRODUCT_CONFIG.wordCount.defaultMode === "target");
    setUnlimitedCoreSections(
      PRODUCT_CONFIG.wordCount.defaultUnlimitedCoreSections,
    );
    setIncludeAppendix(nextStyle.defaultAppendix);
    setCaptionWordRange(PRODUCT_CONFIG.captionLength.defaultRange);
    setChatExecution({ ...PRODUCT_CONFIG.chatExecution.default });
    setSectionWords(
      allocateWords(nextStyle.defaultTargetWords, nextStyle.sections),
    );
    setAllocationMode("preset");
    setAllocationExpanded(true);
    setCopied(null);
  }

  function exportAutomationConfig() {
    try {
      const primaryPromptLanguage =
        promptLanguages[RECONSTRUCTION_PROMPTS[0].id] ??
        PRODUCT_CONFIG.defaultPromptLanguage;
      const payload = {
        schemaVersion: 1,
        source: "yanshu-workbench-web",
        createdAt: new Date().toISOString(),
        workflow: {
          language: primaryPromptLanguage,
          roundLanguages: promptLanguages,
          styleId,
          includeSectionNavigationSentence,
          hasWordLimit,
          unlimitedCoreSections,
          targetWords,
          sectionBudgets: sectionWords,
          includeAppendix,
          captionWordRange,
          chatExecution,
        },
      };
      const blob = new Blob([`${JSON.stringify(payload, null, 2)}\n`], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `yanshu-reconstruction-${styleId}.yanshu.json`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
      announceCopied("config");
    } catch {
      setCopied(null);
      setCopyError(true);
    }
  }

  function toggleRound(id: string) {
    setExpandedRounds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  function focusConfiguration() {
    document
      .getElementById("configuration")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => targetInputRef.current?.focus(), 500);
  }

  return (
    <div
      className="site-shell"
      data-reconstruction-workflow-version={RECONSTRUCTION_WORKFLOW_VERSION}
    >
      <SiteNavigation
        language={uiLanguage}
        activePage="reconstruction"
        mobileMenuOpen={mobileMenuOpen}
        onLanguageChange={changeLanguage}
        onMenuToggle={() => setMobileMenuOpen((open) => !open)}
        onMenuClose={closeMobileMenu}
      />

      <main className="site-main" id="main-content">
        <section className="config-section" id="configuration">
          <div className="section-kicker">
            <span>{copy.configEyebrow}</span>
            <span className="rule" />
            <span>{copy.generalPreset}</span>
          </div>
          <div className="config-heading">
            <div>
              <h1>{copy.title}</h1>
              <p>{copy.subtitle}</p>
            </div>
            <div className="config-heading-actions">
              <button
                className="text-button config-export-button"
                type="button"
                onClick={exportAutomationConfig}
                title={copy.exportAutomationHint}
              >
                <span aria-hidden="true">↓</span>
                {copied === "config"
                  ? copy.exportedAutomation
                  : copy.exportAutomation}
              </button>
              <button
                className="text-button reset-button"
                type="button"
                onClick={resetDefaults}
                title={copy.resetHint}
              >
                <span aria-hidden="true">↺</span>
                {copy.resetDefaults}
              </button>
            </div>
          </div>

          <aside
            className="codex-launch-guide"
            aria-labelledby="codex-launch-title"
          >
            <div className="codex-launch-copy">
              <span>{codexStart.eyebrow}</span>
              <h2 id="codex-launch-title">{codexStart.title}</h2>
              <p>{codexStart.body}</p>
              <ol>
                {codexStart.steps.map((step, index) => (
                  <li key={step}>
                    <small>{String(index + 1).padStart(2, "0")}</small>
                    <strong>{step}</strong>
                  </li>
                ))}
              </ol>
            </div>
            <button
              className={`codex-launch-button ${
                copied === "codex-start" ? "copied" : ""
              }`}
              type="button"
              onClick={() =>
                copyText(codexStart.prompt, "codex-start")
              }
            >
              <span aria-hidden="true">
                {copied === "codex-start" ? "✓" : "⧉"}
              </span>
              {copied === "codex-start"
                ? codexStart.copied
                : codexStart.copy}
            </button>
            <details className="codex-launch-details">
              <summary>{codexStart.preview}</summary>
              <pre>{codexStart.prompt}</pre>
            </details>
          </aside>

          <div className="config-panel">
            <div className="config-control style-control">
              <div className="control-label-row">
                <span className="control-index">01</span>
                <label>{copy.paperStyle}</label>
              </div>
              <div
                className="style-options"
                role="radiogroup"
                aria-label={copy.paperStyle}
              >
                {(
                  Object.keys(PRODUCT_CONFIG.paperStyles) as PaperStyleId[]
                ).map((paperStyleId) => {
                  const paperStyle =
                    PRODUCT_CONFIG.paperStyles[paperStyleId];
                  const active = styleId === paperStyleId;
                  return (
                    <button
                      type="button"
                      role="radio"
                      aria-checked={active}
                      className={active ? "active" : ""}
                      key={paperStyleId}
                      onClick={() => changeStyle(paperStyleId)}
                    >
                      <span>{paperStyle.label[uiLanguage]}</span>
                    </button>
                  );
                })}
              </div>
              <small>{style.description[uiLanguage]}</small>
            </div>

            <div className="config-control intro-navigation-control">
              <div className="control-label-row">
                <span className="control-index">02</span>
                <span>{copy.introNavigation}</span>
              </div>
              <button
                className={`switch-row ${
                  includeSectionNavigationSentence ? "active" : ""
                }`}
                type="button"
                role="switch"
                aria-checked={includeSectionNavigationSentence}
                onClick={() => {
                  setIncludeSectionNavigationSentence((current) => !current);
                  setCopied(null);
                }}
              >
                <span className="switch-track" aria-hidden="true">
                  <span />
                </span>
                <strong>
                  {includeSectionNavigationSentence
                    ? copy.introNavigationOn
                    : copy.introNavigationOff}
                </strong>
              </button>
              <small>{copy.introNavigationHint}</small>
            </div>

            <div className="config-control target-control">
              <div className="control-label-row">
                <span className="control-index">03</span>
                <span>{copy.targetWords}</span>
              </div>
              <button
                className={`switch-row ${hasWordLimit ? "active" : ""}`}
                type="button"
                role="switch"
                aria-checked={hasWordLimit}
                onClick={() => changeWordLimitMode(!hasWordLimit)}
              >
                <span className="switch-track" aria-hidden="true">
                  <span />
                </span>
                <strong>
                  {hasWordLimit ? copy.wordLimitOn : copy.wordLimitOff}
                </strong>
              </button>
              <small>
                {hasWordLimit ? copy.targetWordsHint : copy.noWordLimitHint}
              </small>
            </div>

            <div className="config-control appendix-control">
              <div className="control-label-row">
                <span className="control-index">04</span>
                <span>{copy.appendix}</span>
              </div>
              <button
                className={`switch-row ${includeAppendix ? "active" : ""}`}
                type="button"
                role="switch"
                aria-checked={includeAppendix}
                onClick={() => {
                  setIncludeAppendix((included) => !included);
                  setCopied(null);
                }}
              >
                <span className="switch-track" aria-hidden="true">
                  <span />
                </span>
                <strong>
                  {includeAppendix ? copy.appendixOn : copy.appendixOff}
                </strong>
              </button>
              <small>
                {includeAppendix
                  ? style.appendixRule.enabled[uiLanguage]
                  : style.appendixRule.disabled[uiLanguage]}
              </small>
            </div>

            <fieldset className="config-control caption-length-control">
              <legend className="control-label-row">
                <span className="control-index">05</span>
                <span>{copy.captionLength}</span>
              </legend>
              <div className="framework-custom-ratio caption-word-range">
                <label>
                  <span>{copy.captionLengthMinimum}</span>
                  <input
                    type="number"
                    min={PRODUCT_CONFIG.captionLength.min}
                    max={captionWordRange[1]}
                    step={PRODUCT_CONFIG.captionLength.step}
                    value={captionWordRange[0]}
                    onChange={(event) =>
                      changeCaptionWordRange(
                        "minimum",
                        event.target.valueAsNumber,
                      )
                    }
                  />
                </label>
                <span aria-hidden="true">—</span>
                <label>
                  <span>{copy.captionLengthMaximum}</span>
                  <input
                    type="number"
                    min={captionWordRange[0]}
                    max={PRODUCT_CONFIG.captionLength.max}
                    step={PRODUCT_CONFIG.captionLength.step}
                    value={captionWordRange[1]}
                    onChange={(event) =>
                      changeCaptionWordRange(
                        "maximum",
                        event.target.valueAsNumber,
                      )
                    }
                  />
                </label>
                <strong>words</strong>
              </div>
              <small>{copy.captionLengthHint}</small>
            </fieldset>

            <fieldset className="config-control chat-execution-control">
              <legend className="control-label-row">
                <span className="control-index">06</span>
                <span>{copy.chatExecution}</span>
              </legend>
              <div className="chat-execution-row">
                <div className="chat-model-policy">
                  <span>{copy.chatModelPolicy}</span>
                  <strong>{copy.chatLatestVisibleModel}</strong>
                </div>
                <div className="chat-reasoning-field">
                  <span>{copy.chatReasoningPreference}</span>
                  <div
                    className="chat-reasoning-options"
                    role="radiogroup"
                    aria-label={copy.chatReasoningPreference}
                  >
                    {(
                      Object.keys(
                        PRODUCT_CONFIG.chatExecution.reasoningPreferences,
                      ) as ChatReasoningPreferenceId[]
                    ).map((preferenceId) => {
                      const preference =
                        PRODUCT_CONFIG.chatExecution.reasoningPreferences[
                          preferenceId
                        ];
                      const active =
                        chatExecution.reasoningPreference === preferenceId;
                      return (
                        <button
                          type="button"
                          role="radio"
                          aria-checked={active}
                          className={active ? "active" : ""}
                          key={preferenceId}
                          onClick={() => {
                            setChatExecution((current) => ({
                              ...current,
                              reasoningPreference: preferenceId,
                              forceProForAllTurns:
                                preferenceId === "pro"
                                  ? current.forceProForAllTurns
                                  : false,
                            }));
                            setCopied(null);
                          }}
                        >
                          {preference.label[uiLanguage]}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="chat-polling-policy">
                <span>{copy.chatPollingInterval}</span>
                <strong>{chatPollingDescription}</strong>
              </div>
              {chatExecution.reasoningPreference === "pro" && (
                <div
                  className={`chat-pro-policy ${
                    chatExecution.forceProForAllTurns ? "forced" : ""
                  }`}
                >
                  <button
                    className={`compact-switch ${
                      chatExecution.forceProForAllTurns ? "active" : ""
                    }`}
                    type="button"
                    role="switch"
                    aria-checked={chatExecution.forceProForAllTurns}
                    onClick={() => {
                      setChatExecution((current) => ({
                        ...current,
                        forceProForAllTurns: !current.forceProForAllTurns,
                      }));
                      setCopied(null);
                    }}
                  >
                    <span className="switch-track" aria-hidden="true">
                      <span />
                    </span>
                    <span>
                      <strong>{copy.chatProStrategy}</strong>
                      <small>
                        {chatExecution.forceProForAllTurns
                          ? copy.chatProForceAll
                          : copy.chatProFirstTurnOnly}
                      </small>
                    </span>
                  </button>
                  <p>
                    {chatExecution.forceProForAllTurns
                      ? copy.chatProForceAllHint
                      : copy.chatProFirstTurnHint}
                  </p>
                </div>
              )}
              <small>
                <strong>
                  {chatReasoningPreference.description[uiLanguage]}
                </strong>{" "}
                {copy.chatRuntimePolicy}
              </small>
            </fieldset>
          </div>

          {hasWordLimit && (
            <div
              className={`allocation-control ${allocationExpanded ? "expanded" : ""}`}
              id="allocation"
            >
            <div className="allocation-control-header">
              <div className="allocation-title">
                <span className="control-index">07</span>
                <div>
                  <strong>{copy.plannerTitle}</strong>
                  <span>{copy.plannerBody}</span>
                </div>
              </div>
              <div className="allocation-actions">
                {unlimitedCoreSections ? (
                  <span className="allocation-unlimited-total">
                    <strong>{copy.unlimitedMainText}</strong>
                    <small>
                      {copy.limitedSectionsTotal}{" "}
                      {formatNumber(budgetedWords, uiLanguage)} {copy.words}
                    </small>
                  </span>
                ) : (
                  <label className="allocation-target" htmlFor="target-words">
                    <span>{copy.targetTotal}</span>
                    <span className="number-field">
                      <input
                        ref={targetInputRef}
                        id="target-words"
                        aria-label={copy.targetTotal}
                        type="number"
                        min={PRODUCT_CONFIG.wordCount.min}
                        max={PRODUCT_CONFIG.wordCount.max}
                        step={
                          allocationMode === "custom"
                            ? 1
                            : PRODUCT_CONFIG.wordCount.step
                        }
                        value={targetWords}
                        onChange={(event) =>
                          changeTarget(event.target.valueAsNumber)
                        }
                      />
                      <span>{copy.words}</span>
                    </span>
                  </label>
                )}
                <span className={`allocation-mode-tag ${allocationMode}`}>
                  {allocationMode === "custom"
                    ? copy.customAllocation
                    : copy.presetAllocation}
                </span>
                <button
                  className="text-button"
                  type="button"
                  onClick={resetAllocation}
                >
                  <span aria-hidden="true">↺</span>
                  {copy.resetAllocation}
                </button>
                <button
                  className="allocation-toggle"
                  type="button"
                  aria-expanded={allocationExpanded}
                  aria-controls="allocation-fields"
                  onClick={() => setAllocationExpanded((expanded) => !expanded)}
                >
                  {allocationExpanded
                    ? copy.hideAllocation
                    : copy.editAllocation}
                  <span aria-hidden="true">
                    {allocationExpanded ? "−" : "+"}
                  </span>
                </button>
              </div>
            </div>

            <div className="allocation-policy-row">
              <button
                className={`compact-switch ${
                  unlimitedCoreSections ? "active" : ""
                }`}
                type="button"
                role="switch"
                aria-checked={unlimitedCoreSections}
                onClick={() => {
                  setUnlimitedCoreSections((current) => !current);
                  setAllocationExpanded(true);
                  setCopied(null);
                }}
              >
                <span className="switch-track" aria-hidden="true">
                  <span />
                </span>
                <span>
                  <strong>{copy.unlimitedCoreSections}</strong>
                  <small>{copy.unlimitedCoreSectionsHint}</small>
                </span>
              </button>
              <p>{copy.visualCountingRule}</p>
            </div>

            <p className="allocation-style-line">
              <strong>{style.label[uiLanguage]}</strong>
              <span>{style.plannerSummary[uiLanguage]}</span>
            </p>

            <div className="distribution-bar" aria-hidden="true">
              {budgetedSections.map((section) => {
                const index = style.sections.findIndex(
                  (candidate) => candidate.id === section.id,
                );
                return (
                  <span
                    key={section.id}
                    title={section.label[uiLanguage]}
                    style={{
                      width: `${((sectionWords[section.id] ?? 0) / distributionDenominator) * 100}%`,
                      background:
                        SECTION_COLORS[index % SECTION_COLORS.length],
                    }}
                  />
                );
              })}
              {!unlimitedCoreSections && allocatedWords < targetWords && (
                <span
                  className="distribution-remainder"
                  style={{
                    width: `${((targetWords - allocatedWords) / distributionDenominator) * 100}%`,
                  }}
                />
              )}
            </div>

            {allocationExpanded && (
              <div
                className="allocation-grid"
                id="allocation-fields"
                role="group"
                aria-label={copy.plannerTitle}
              >
                {style.sections.map((section, index) => {
                  const words = sectionWords[section.id] ?? 0;
                  const isUnlimited =
                    unlimitedCoreSections &&
                    UNLIMITED_CORE_SECTION_IDS.has(section.id);
                  const actualRatio =
                    budgetedWords > 0 ? words / budgetedWords : 0;
                  return (
                    <label
                      className={`allocation-item ${
                        isUnlimited ? "is-unlimited" : ""
                      }`}
                      key={section.id}
                    >
                      <span className="allocation-item-name">
                        <span
                          className="section-color"
                          style={{
                            background:
                              SECTION_COLORS[index % SECTION_COLORS.length],
                          }}
                          aria-hidden="true"
                        />
                        <strong>{section.label[uiLanguage]}</strong>
                        {!isUnlimited && (
                          <small>{formatRatio(actualRatio)}</small>
                        )}
                      </span>
                      {isUnlimited ? (
                        <span className="allocation-item-unlimited">
                          {copy.unlimitedSection}
                        </span>
                      ) : (
                        <span className="allocation-item-input">
                          <input
                            type="number"
                            min="0"
                            step="10"
                            value={words}
                            aria-label={`${section.label[uiLanguage]} · ${copy.budget}`}
                            onChange={(event) =>
                              changeSection(
                                section.id,
                                event.target.valueAsNumber,
                              )
                            }
                          />
                          <small>{copy.words}</small>
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>
            )}

              <span className="sr-only" role="status" aria-live="polite">
                {unlimitedCoreSections
                  ? `${copy.unlimitedMainText} · ${copy.unlimitedCoreSections}`
                  : allocationMode === "custom"
                    ? `${copy.customAllocation} · ${formatNumber(targetWords, uiLanguage)} ${copy.words}`
                    : `${copy.presetAllocation} · ${formatNumber(targetWords, uiLanguage)} ${copy.words}`}
              </span>
            </div>
          )}
        </section>

        <PromptResizeHandle language={uiLanguage} />

        <section
          className="workflow-section content-section prompt-rail"
          id="workflow"
        >
          <div className="prompt-rail-toolbar">
            <div>
              <button
                className="secondary-button"
                type="button"
                onClick={focusConfiguration}
              >
                <span aria-hidden="true">↟</span>
                {copy.reconfigure}
              </button>
              <button
                className={`primary-button ${copied === "all" ? "copied" : ""}`}
                type="button"
                onClick={() =>
                  copyText(
                    prompts
                      .map(({ text }) => text)
                      .join("\n\n━━━━━━━━━━━━━━━━━━━━\n\n"),
                    "all",
                  )
                }
              >
                <span aria-hidden="true">{copied === "all" ? "✓" : "⧉"}</span>
                {copied === "all" ? copy.copiedAll : copy.copyAll}
              </button>
            </div>
          </div>

          {copyError && (
            <p className="copy-error" role="alert">
              {copy.clipboardError}
            </p>
          )}

          <div className="prompt-list">
            {prompts.map(({ round, language, text }) => {
              const expanded = expandedRounds.has(round.id);
              const isCopied = copied === round.id;
              const nextPromptLanguage =
                language === "zh" ? "English" : "中文";
              return (
                <article
                  className={`prompt-card ${expanded ? "expanded" : ""}`}
                  key={round.id}
                >
                  <div className="prompt-card-main">
                    <div className="prompt-card-header">
                      <div>
                        <h3>{round.title[language]}</h3>
                        <p>{round.purpose[language]}</p>
                      </div>
                      <div className="prompt-card-actions">
                        <button
                          className="prompt-language-button"
                          type="button"
                          aria-label={`${copy.switchPromptLanguage}：${nextPromptLanguage}`}
                          onClick={() => togglePromptLanguage(round.id)}
                        >
                          {nextPromptLanguage}
                        </button>
                        <button
                          className={`copy-button ${isCopied ? "copied" : ""}`}
                          type="button"
                          onClick={() => copyText(text, round.id)}
                        >
                          <span aria-hidden="true">{isCopied ? "✓" : "⧉"}</span>
                          {isCopied ? copy.copied : copy.copy}
                        </button>
                        <button
                          className="expand-button"
                          type="button"
                          aria-expanded={expanded}
                          aria-controls={`prompt-${round.id}`}
                          onClick={() => toggleRound(round.id)}
                        >
                          {expanded ? copy.collapse : copy.expand}
                          <span aria-hidden="true">{expanded ? "−" : "+"}</span>
                        </button>
                      </div>
                    </div>
                    {expanded && (
                      <pre className="prompt-content" id={`prompt-${round.id}`}>
                        {text}
                      </pre>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
          <span className="sr-only" role="status" aria-live="polite">
            {copied === "all"
              ? copy.copiedAll
              : copied
                ? copy.copied
                : ""}
          </span>
        </section>

        <footer className="site-footer">
          <span>
            {PRODUCT_CONFIG.productName} · {PRODUCT_CONFIG.productNameEn}
          </span>
          <span>{copy.generalPreset}</span>
        </footer>
      </main>
    </div>
  );
}
