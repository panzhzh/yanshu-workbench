"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { withPromptJudgmentDirective } from "../../content/prompts/promptAgency";
import { PRODUCT_CONFIG, type Language } from "../config";
import PromptResizeHandle from "../PromptResizeHandle";
import SiteNavigation from "../SiteNavigation";
import type {
  MultiControl,
  NumberRange,
  WorkbenchControl,
  WorkbenchDefinition,
  WorkbenchValue,
  WorkbenchValues,
} from "./types";

async function writeClipboard(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  const previouslyFocused = document.activeElement;
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  textarea.remove();
  if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
  if (!copied) throw new Error("Clipboard unavailable");
}

function defaultValues(controls: readonly WorkbenchControl[]) {
  return Object.fromEntries(
    controls.map((control) => [control.id, control.defaultValue]),
  ) as WorkbenchValues;
}

function normalizedNumber(raw: string, minimum: number, maximum: number) {
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) return minimum;
  return Math.min(maximum, Math.max(minimum, parsed));
}

function ControlField({
  control,
  language,
  value,
  onChange,
  onMultiToggle,
  copy,
}: {
  control: WorkbenchControl;
  language: Language;
  value: WorkbenchValue;
  onChange: (value: WorkbenchValue) => void;
  onMultiToggle: (control: MultiControl, option: string) => void;
  copy: { on: string; off: string };
}) {
  const inputId = `workbench-control-${control.id}`;
  const legendId = `${inputId}-label`;
  const descriptionId = `${inputId}-description`;
  const suffix =
    "suffix" in control && control.suffix
      ? control.suffix[language]
      : undefined;

  return (
    <fieldset
      className={`universal-control-card universal-control-${control.kind} ${
        control.span === "full" ? "full" : ""
      }`}
    >
      <legend id={legendId}>{control.label[language]}</legend>
      <p id={descriptionId}>{control.description[language]}</p>

      {(control.kind === "segmented" || control.kind === "select") &&
        (control.kind === "segmented" ? (
          <div
            className="universal-segmented"
            role="radiogroup"
            aria-labelledby={legendId}
            aria-describedby={descriptionId}
          >
            {control.options.map((option) => (
              <button
                type="button"
                role="radio"
                aria-checked={value === option.value}
                tabIndex={value === option.value ? 0 : -1}
                className={value === option.value ? "active" : ""}
                key={option.value}
                onClick={() => onChange(option.value)}
                onKeyDown={(event) => {
                  if (
                    ![
                      "ArrowLeft",
                      "ArrowRight",
                      "ArrowUp",
                      "ArrowDown",
                      "Home",
                      "End",
                    ].includes(event.key)
                  ) {
                    return;
                  }
                  event.preventDefault();
                  const radios = Array.from(
                    event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>(
                      '[role="radio"]',
                    ) ?? [],
                  );
                  const currentIndex = radios.indexOf(event.currentTarget);
                  const nextIndex =
                    event.key === "Home"
                      ? 0
                      : event.key === "End"
                        ? radios.length - 1
                        : (currentIndex +
                            (["ArrowRight", "ArrowDown"].includes(event.key)
                              ? 1
                              : -1) +
                            radios.length) %
                          radios.length;
                  radios[nextIndex]?.focus();
                  radios[nextIndex]?.click();
                }}
              >
                <strong>{option.label[language]}</strong>
                {option.description && (
                  <small>{option.description[language]}</small>
                )}
              </button>
            ))}
          </div>
        ) : (
          <label className="universal-select" htmlFor={inputId}>
            <span className="sr-only">{control.label[language]}</span>
            <select
              id={inputId}
              aria-describedby={descriptionId}
              value={String(value)}
              onChange={(event) => onChange(event.target.value)}
            >
              {control.options.map((option) => (
                <option value={option.value} key={option.value}>
                  {option.label[language]}
                </option>
              ))}
            </select>
            {control.options.find((option) => option.value === value)
              ?.description && (
              <small>
                {
                  control.options.find((option) => option.value === value)
                    ?.description?.[language]
                }
              </small>
            )}
          </label>
        ))}

      {control.kind === "toggle" && (
        <button
          className={`universal-toggle ${value === true ? "active" : ""}`}
          type="button"
          role="switch"
          aria-checked={value === true}
          aria-labelledby={legendId}
          aria-describedby={descriptionId}
          onClick={() => onChange(value !== true)}
        >
          <span className="switch-track" aria-hidden="true">
            <span />
          </span>
          <strong>
            {value === true
              ? control.enabledLabel?.[language] ?? copy.on
              : control.disabledLabel?.[language] ?? copy.off}
          </strong>
        </button>
      )}

      {control.kind === "number" && (
        <label className="universal-number">
          <input
            id={inputId}
            aria-labelledby={legendId}
            aria-describedby={descriptionId}
            type="number"
            min={control.min}
            max={control.max}
            step={control.step ?? 1}
            value={Number(value)}
            onChange={(event) =>
              onChange(
                normalizedNumber(
                  event.target.value,
                  control.min,
                  control.max,
                ),
              )
            }
          />
          {suffix && <span>{suffix}</span>}
        </label>
      )}

      {control.kind === "range" && (
        <div className="universal-range">
          <label>
            <span className="sr-only">{control.label[language]}</span>
            <input
              aria-label={`${control.label[language]} ${
                language === "zh" ? "最小值" : "minimum"
              }`}
              aria-describedby={descriptionId}
              type="number"
              min={control.min}
              max={control.max}
              step={control.step ?? 1}
              value={(value as NumberRange)[0]}
              onChange={(event) => {
                const current = value as NumberRange;
                const next = normalizedNumber(
                  event.target.value,
                  control.min,
                  current[1],
                );
                onChange([next, current[1]] as NumberRange);
              }}
            />
          </label>
          <span aria-hidden="true">—</span>
          <label>
            <span className="sr-only">{control.label[language]}</span>
            <input
              aria-label={`${control.label[language]} ${
                language === "zh" ? "最大值" : "maximum"
              }`}
              aria-describedby={descriptionId}
              type="number"
              min={control.min}
              max={control.max}
              step={control.step ?? 1}
              value={(value as NumberRange)[1]}
              onChange={(event) => {
                const current = value as NumberRange;
                const next = normalizedNumber(
                  event.target.value,
                  current[0],
                  control.max,
                );
                onChange([current[0], next] as NumberRange);
              }}
            />
          </label>
          {suffix && <small>{suffix}</small>}
        </div>
      )}

      {(control.kind === "text" || control.kind === "textarea") &&
        (control.kind === "textarea" ? (
          <textarea
            id={inputId}
            aria-labelledby={legendId}
            aria-describedby={descriptionId}
            className="universal-textarea"
            rows={4}
            value={String(value)}
            placeholder={control.placeholder?.[language]}
            onChange={(event) => onChange(event.target.value)}
          />
        ) : (
          <input
            id={inputId}
            aria-labelledby={legendId}
            aria-describedby={descriptionId}
            className="universal-text-input"
            value={String(value)}
            placeholder={control.placeholder?.[language]}
            onChange={(event) => onChange(event.target.value)}
          />
        ))}

      {control.kind === "multi" && (
        <div className="universal-multi">
          {control.options.map((option) => {
            const selected = (value as readonly string[]).includes(option.value);
            return (
              <button
                type="button"
                className={selected ? "active" : ""}
                aria-pressed={selected}
                key={option.value}
                onClick={() => onMultiToggle(control, option.value)}
              >
                <span aria-hidden="true">{selected ? "✓" : "+"}</span>
                <span>
                  <strong>{option.label[language]}</strong>
                  {option.description && (
                    <small>{option.description[language]}</small>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {control.hint && (
        <small className="universal-control-hint">
          {control.hint[language]}
        </small>
      )}
    </fieldset>
  );
}

export default function ConfigurablePromptWorkbench({
  definition,
}: {
  definition: WorkbenchDefinition;
}) {
  const [uiLanguage, setUiLanguage] = useState<Language>(
    PRODUCT_CONFIG.defaultLanguage,
  );
  const [promptLanguage, setPromptLanguage] = useState<Language>(
    PRODUCT_CONFIG.defaultPromptLanguage,
  );
  const [values, setValues] = useState<WorkbenchValues>(() =>
    defaultValues(definition.controls),
  );
  const [expanded, setExpanded] = useState(true);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pageCopy = definition.copy[uiLanguage];
  const promptNextLanguage = promptLanguage === "zh" ? "English" : "中文";
  const prompt = useMemo(
    () =>
      withPromptJudgmentDirective(
        definition.buildPrompt(values, promptLanguage),
        promptLanguage,
      ),
    [definition, promptLanguage, values],
  );
  const visibleControls = useMemo(
    () =>
      definition.controls.filter(
        (control) => !control.visibleWhen || control.visibleWhen(values),
      ),
    [definition.controls, values],
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

  function updateValue(id: string, value: WorkbenchValue) {
    setValues((current) =>
      definition.updateValues
        ? definition.updateValues(current, id, value)
        : { ...current, [id]: value },
    );
    setCopied(false);
    setCopyError(false);
  }

  function toggleMulti(control: MultiControl, option: string) {
    const current = values[control.id] as readonly string[];
    if (current.includes(option)) {
      if (current.length <= (control.minSelected ?? 0)) return;
      updateValue(
        control.id,
        current.filter((item) => item !== option),
      );
      return;
    }
    updateValue(control.id, [...current, option]);
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
        activePage={definition.activePage}
        mobileMenuOpen={mobileMenuOpen}
        onLanguageChange={(language) => {
          setUiLanguage(language);
          setCopied(false);
        }}
        onMenuToggle={() => setMobileMenuOpen((open) => !open)}
        onMenuClose={() => setMobileMenuOpen(false)}
      />

      <main className="site-main universal-workbench" id="main-content">
        <section className="config-section universal-config-section">
          <div className="section-kicker">
            <span>{pageCopy.eyebrow}</span>
            <span className="rule" />
            <span>{pageCopy.preset}</span>
          </div>
          <div className="config-heading">
            <div>
              <h1>{pageCopy.title}</h1>
              <p>{pageCopy.subtitle}</p>
            </div>
            <button
              className="text-button reset-button"
              type="button"
              title={pageCopy.resetHint}
              onClick={() => {
                setValues(defaultValues(definition.controls));
                setCopied(false);
                setCopyError(false);
              }}
            >
              <span aria-hidden="true">↺</span>
              {pageCopy.reset}
            </button>
          </div>

          <section className="universal-input-strip">
            <div>
              <span className="control-index">01</span>
              <strong>{pageCopy.inputTitle}</strong>
            </div>
            <div className="universal-input-items">
              {pageCopy.inputItems.map((item) => (
                <span key={item}>
                  <i aria-hidden="true">✓</i>
                  {item}
                </span>
              ))}
            </div>
            <p>{pageCopy.inputHint}</p>
          </section>

          <div className="universal-control-grid">
            {visibleControls.map((control, index) => {
              return (
                <div
                  className={`universal-control-wrap ${
                    control.span === "full" ? "full" : ""
                  }`}
                  key={control.id}
                >
                  <span className="control-index">
                    {String(index + 2).padStart(2, "0")}
                  </span>
                  <ControlField
                    control={control}
                    language={uiLanguage}
                    value={values[control.id]}
                    onChange={(value) => updateValue(control.id, value)}
                    onMultiToggle={toggleMulti}
                    copy={{ on: pageCopy.on, off: pageCopy.off }}
                  />
                </div>
              );
            })}
          </div>
        </section>

        <PromptResizeHandle
          language={uiLanguage}
          controls={`${definition.id}-prompt-rail`}
        />

        <section
          className="content-section prompt-rail universal-prompt-section"
          id={`${definition.id}-prompt-rail`}
        >
          {copyError && (
            <p className="copy-error" role="alert">
              {pageCopy.clipboardError}
            </p>
          )}
          <article className={`prompt-card ${expanded ? "expanded" : ""}`}>
            <div className="prompt-card-main">
              <div className="prompt-card-header">
                <div>
                  <h3>{pageCopy.promptTitle}</h3>
                  <p>{pageCopy.promptPurpose}</p>
                </div>
                <div className="prompt-card-actions">
                  <button
                    className="prompt-language-button"
                    type="button"
                    aria-label={`${pageCopy.switchPromptLanguage}：${promptNextLanguage}`}
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
                    {copied ? pageCopy.copied : pageCopy.copy}
                  </button>
                  <button
                    className="expand-button"
                    type="button"
                    aria-expanded={expanded}
                    aria-controls={`${definition.id}-prompt`}
                    onClick={() => setExpanded((current) => !current)}
                  >
                    {expanded ? pageCopy.collapse : pageCopy.expand}
                    <span aria-hidden="true">{expanded ? "−" : "+"}</span>
                  </button>
                </div>
              </div>
              {expanded && (
                <pre
                  className="prompt-content"
                  id={`${definition.id}-prompt`}
                  lang={promptLanguage === "zh" ? "zh-CN" : "en"}
                >
                  {prompt}
                </pre>
              )}
            </div>
          </article>
          <span className="sr-only" role="status" aria-live="polite">
            {copied ? pageCopy.copied : ""}
          </span>
        </section>

        <footer className="site-footer">
          <span>
            {PRODUCT_CONFIG.productName} · {PRODUCT_CONFIG.productNameEn}
          </span>
          <span>{pageCopy.preset}</span>
        </footer>
      </main>
    </div>
  );
}
