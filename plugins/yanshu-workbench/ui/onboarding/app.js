const COPY = {
  zh: {
    eyebrow: "FULL-AUTOMATION SETUP",
    title: "一次配置，随后自动执行",
    subtitle:
      "在这里完成全部重构选项并实时查看五轮 Prompt。可以直接复制后退出，也可以一键开始全自动工作。",
    selectedPaper: "已确认论文",
    loading: "正在载入本地配置模型…",
    paperType: "论文类型",
    paperTypeHint: "会议与期刊会使用不同的结构、篇幅侧重和写作规则。",
    introductionRoadmap: "Introduction 章节导航段",
    introductionRoadmapHint:
      "会议默认关闭，期刊默认开启；启用时约 65 词、单独成段，且不计入 Introduction 建议字数。",
    introductionRoadmapChoice: "使用独立的论文结构导航段",
    lengthTitle: "正文与章节篇幅建议",
    lengthHint:
      "默认关闭。启用后也只提供可接受、调整或忽略的参考值；正文不包含附录，每张表格或图片按 200 词作建议估算。",
    useWordLimit: "启用篇幅建议",
    useWordLimitHint: "关闭后，不向五轮 Prompt 注入任何正文或章节篇幅建议。",
    targetWords: "建议正文参考值",
    targetWordsHint: "修改后，章节建议会按当前论文类型重新计算。",
    words: "词",
    unlimitedCore: "方法与实验不设置建议字数",
    unlimitedCoreHint:
      "启用后不提供正文总建议，只为方法与实验之外的章节保留可选参考值。",
    sectionBudgets: "章节建议",
    sectionBudgetsHint:
      "默认展开，可直接修改；总和一致只用于保持配置可计算，不表示论文必须命中。",
    unlimited: "无建议",
    budgetMatch: "建议分配一致",
    budgetMismatch: "章节建议总和与正文参考值不一致。",
    appendixTitle: "附录",
    appendixHint: "附录不计入正文字数且字数不限。",
    allowAppendix: "允许附录",
    allowAppendixHint:
      "正文能满足规则时不使用附录；只有非主线内容确有必要时才移入。",
    captionTitle: "Caption 建议长度",
    captionHint:
      "默认 10–40 words，只用于平衡简洁与自包含性；必要时可以超出，不作为验收或报错条件。",
    captionMinimum: "最少",
    captionMaximum: "最多",
    figureTitle: "总体框架图",
    figureHint:
      "默认采用纯白画布、蓝橙配色、Calibri、三级字号和无大标题，并允许按需使用论文对象图形。",
    aspectRatio: "画布比例",
    ratioWidth: "宽",
    ratioHeight: "高",
    executionTitle: "Prompt 与 ChatGPT",
    executionHint:
      "模型名称不写死；YanShu 会读取当前账号真实可见的推理档位。",
    promptLanguage: "Prompt 语言",
    reasoning: "推理偏好",
    forceAllPro: "强制所有对话使用 Pro",
    proFirstTurnHint:
      "默认关闭：每轮首次有效提交使用 Pro，后续继续、纠正和补交自动切换为 Extra High。",
    proForceAllHint:
      "已强制全部 Pro；五轮流程会显著变慢，尤其是续写、纠正与产物补交。",
    resultPolling: "结果检查间隔",
    pollingStrongest:
      "按实际档位自动采用：Medium / High 1 分钟，Extra High 3 分钟，Pro 5 分钟；无法识别时按 1 分钟。",
    summaryEyebrow: "READY TO START",
    summaryTitle: "本次配置",
    localOnly: "仅在本机处理",
    localOnlyHint:
      "论文路径和设置只在 127.0.0.1 页面与本次 YanShu 会话之间传递，不发送到研术台网站。",
    startAutomation: "全自动开始",
    exit: "退出",
    confirmHint:
      "“全自动开始”就是唯一启动确认；“退出”不会创建目录或上传文件。",
    promptEyebrow: "LIVE PROMPTS",
    promptTitle: "五轮 Prompt",
    promptHint:
      "配置变化会实时重建 Prompt。每轮可独立切换中英文、复制和收起。",
    buildingPrompts: "正在生成当前配置的 Prompt…",
    copyAll: "复制全部",
    copiedAll: "已复制全部",
    copy: "复制",
    copied: "已复制",
    collapse: "收起",
    expand: "展开",
    previewFailed: "当前 Prompt 暂时无法生成，请先修正左侧配置。",
    mixedLanguages: "中英独立",
    cancelling: "正在退出…",
    confirmedEyebrow: "CONFIGURATION CONFIRMED",
    confirmedTitle: "配置已确认",
    confirmedBody:
      "YanShu 正在返回 Codex 检查 ChatGPT 与 Chrome 权限并启动工作。你可以关闭这个页面。",
    cancelledEyebrow: "SESSION CLOSED",
    cancelledTitle: "已退出",
    cancelledBody:
      "本次配置会话已关闭，没有创建重构目录，也没有上传论文文件。你可以关闭这个页面。",
    errorTitle: "配置页无法继续",
    submitFailed: "配置未能提交，请检查下面的提示后重试。",
    submitting: "正在确认…",
    summaryPaperType: "论文类型",
    summaryLength: "正文建议",
    summaryAppendix: "附录",
    summaryCaption: "Caption 建议",
    summaryFigure: "框架图",
    summaryLanguage: "Prompt",
    summaryReasoning: "推理",
    summaryPolling: "结果检查",
    noLimit: "不设篇幅建议",
    limitedCore: "仅其他章节有建议",
    allowed: "允许",
    disabled: "不使用",
    fileTex: "TeX",
    fileBib: "BibTeX",
    filePdf: "PDF",
    fileFigures: "Figures",
  },
  en: {
    eyebrow: "FULL-AUTOMATION SETUP",
    title: "Configure once, then run automatically",
    subtitle:
      "Set every reconstruction option and preview all five Prompts here. Copy them and exit, or start the full workflow in one click.",
    selectedPaper: "Confirmed paper",
    loading: "Loading the local configuration model…",
    paperType: "Paper type",
    paperTypeHint:
      "Conference and journal papers use different structures, length emphases, and writing rules.",
    introductionRoadmap: "Introduction roadmap paragraph",
    introductionRoadmapHint:
      "Off by default for conferences and on for journals; when enabled, it is a separate ≈65-word paragraph outside the suggested Introduction length.",
    introductionRoadmapChoice: "Use a separate paper-roadmap paragraph",
    lengthTitle: "Main-text and section length guidance",
    lengthHint:
      "Off by default. When enabled, every value remains an optional reference that may be accepted, adjusted, or ignored. The main text excludes the appendix; each table or figure counts as 200 words for estimation.",
    useWordLimit: "Enable length guidance",
    useWordLimitHint:
      "When disabled, no main-text or section-length suggestions enter the five prompts.",
    targetWords: "Suggested main-text reference",
    targetWordsHint:
      "Changing this value recalculates section suggestions for the paper type.",
    words: "words",
    unlimitedCore: "No suggested length for Method or Experiments",
    unlimitedCoreHint:
      "Removes the main-text suggestion and retains optional references only for sections outside Method and Experiments.",
    sectionBudgets: "Section suggestions",
    sectionBudgetsHint:
      "Open by default and editable. Matching totals keep the configuration computable; they do not require the paper to hit them.",
    unlimited: "No suggestion",
    budgetMatch: "Suggestions match",
    budgetMismatch:
      "The section total does not match the suggested main-text length.",
    appendixTitle: "Appendix",
    appendixHint:
      "The appendix is excluded from the main-text count and has no word limit.",
    allowAppendix: "Allow an appendix",
    allowAppendixHint:
      "Do not use it when the main text fits; move only genuinely non-core material when necessary.",
    captionTitle: "Suggested caption length",
    captionHint:
      "The default is 10–40 words. It is flexible guidance for concision and self-containment, not an acceptance or error condition.",
    captionMinimum: "Minimum",
    captionMaximum: "Maximum",
    figureTitle: "Overall framework figure",
    figureHint:
      "Uses a pure-white canvas, a blue–orange palette, Calibri, three type levels, no large title, and restrained paper-specific scientific forms when useful.",
    aspectRatio: "Canvas ratio",
    ratioWidth: "Width",
    ratioHeight: "Height",
    executionTitle: "Prompts and ChatGPT",
    executionHint:
      "Model names are not pinned; YanShu reads the reasoning levels actually visible to the account.",
    promptLanguage: "Prompt language",
    reasoning: "Reasoning preference",
    forceAllPro: "Force Pro for every interaction",
    proFirstTurnHint:
      "Off by default: use Pro for the first effective submission of each round, then switch continuations, corrections, and artifact follow-ups to Extra High.",
    proForceAllHint:
      "All interactions are forced to Pro. The five-round workflow will take substantially longer, especially for continuations, corrections, and artifact follow-ups.",
    resultPolling: "Result-check interval",
    pollingStrongest:
      "Resolved from the level actually selected: Medium / High 1 minute, Extra High 3 minutes, and Pro 5 minutes; unknown labels use 1 minute.",
    summaryEyebrow: "READY TO START",
    summaryTitle: "Run configuration",
    localOnly: "Processed locally",
    localOnlyHint:
      "Paper paths and settings pass only between this 127.0.0.1 page and the current YanShu session; they are not sent to the YanShu website.",
    startAutomation: "Start full automation",
    exit: "Exit",
    confirmHint:
      "Start is the sole authorization; Exit creates no run and uploads nothing.",
    promptEyebrow: "LIVE PROMPTS",
    promptTitle: "Five-round Prompts",
    promptHint:
      "Prompts rebuild as settings change. Switch each round's language, copy it, or collapse it.",
    buildingPrompts: "Building Prompts for the current configuration…",
    copyAll: "Copy all",
    copiedAll: "All copied",
    copy: "Copy",
    copied: "Copied",
    collapse: "Collapse",
    expand: "Expand",
    previewFailed:
      "The current Prompts cannot be built yet. Correct the configuration on the left.",
    mixedLanguages: "Mixed languages",
    cancelling: "Exiting…",
    confirmedEyebrow: "CONFIGURATION CONFIRMED",
    confirmedTitle: "Configuration confirmed",
    confirmedBody:
      "YanShu is returning to Codex to check ChatGPT and Chrome permissions and start the workflow. You may close this page.",
    cancelledEyebrow: "SESSION CLOSED",
    cancelledTitle: "Exited",
    cancelledBody:
      "This setup session is closed. No reconstruction directory was created and no paper file was uploaded. You may close this page.",
    errorTitle: "The setup page cannot continue",
    submitFailed:
      "The configuration could not be submitted. Review the message below and retry.",
    submitting: "Confirming…",
    summaryPaperType: "Paper type",
    summaryLength: "Main-text suggestion",
    summaryAppendix: "Appendix",
    summaryCaption: "Caption guidance",
    summaryFigure: "Framework figure",
    summaryLanguage: "Prompt",
    summaryReasoning: "Reasoning",
    summaryPolling: "Result checks",
    noLimit: "No length guidance",
    limitedCore: "Guidance for other sections only",
    allowed: "Allowed",
    disabled: "Not used",
    fileTex: "TeX",
    fileBib: "BibTeX",
    filePdf: "PDF",
    fileFigures: "Figures",
  },
};

const elements = {
  form: document.querySelector("#configuration-form"),
  loading: document.querySelector("#loading-state"),
  completion: document.querySelector("#completion-state"),
  cancelled: document.querySelector("#cancelled-state"),
  fatalError: document.querySelector("#fatal-error"),
  fatalErrorMessage: document.querySelector("#fatal-error-message"),
  paperTitle: document.querySelector("#paper-title"),
  paperPath: document.querySelector("#paper-path"),
  inputList: document.querySelector("#input-list"),
  styleOptions: document.querySelector("#style-options"),
  introductionRoadmapToggle: document.querySelector(
    "#introduction-roadmap-toggle",
  ),
  wordLimitToggle: document.querySelector("#word-limit-toggle"),
  wordLimitPanel: document.querySelector("#word-limit-panel"),
  targetWords: document.querySelector("#target-words"),
  unlimitedCoreToggle: document.querySelector("#unlimited-core-toggle"),
  budgetGrid: document.querySelector("#budget-grid"),
  budgetTotal: document.querySelector("#budget-total"),
  budgetError: document.querySelector("#budget-error"),
  appendixToggle: document.querySelector("#appendix-toggle"),
  captionMinWords: document.querySelector("#caption-min-words"),
  captionMaxWords: document.querySelector("#caption-max-words"),
  ratioOptions: document.querySelector("#ratio-options"),
  customRatio: document.querySelector("#custom-ratio"),
  ratioWidth: document.querySelector("#ratio-width"),
  ratioHeight: document.querySelector("#ratio-height"),
  promptLanguageOptions: document.querySelector(
    "#prompt-language-options",
  ),
  reasoningSelect: document.querySelector("#reasoning-select"),
  reasoningDescription: document.querySelector(
    "#reasoning-description",
  ),
  pollingDescription: document.querySelector(
    "#polling-description",
  ),
  forceAllProRow: document.querySelector("#force-all-pro-row"),
  forceAllProToggle: document.querySelector("#force-all-pro-toggle"),
  forceAllProHint: document.querySelector("#force-all-pro-hint"),
  summary: document.querySelector("#configuration-summary"),
  confirmButton: document.querySelector("#confirm-button"),
  exitButton: document.querySelector("#exit-button"),
  copyAllButton: document.querySelector("#copy-all-button"),
  promptStatus: document.querySelector("#prompt-preview-status"),
  promptList: document.querySelector("#prompt-preview-list"),
  submitError: document.querySelector("#submit-error"),
};

const token = new URL(window.location.href).searchParams.get("token");
let bootstrap = null;
let model = null;
let workflow = null;
let uiLanguage = "zh";
let submitting = false;
let previewRounds = [];
let previewTimer = null;
let previewSequence = 0;
let initializedPromptExpansion = false;
const expandedPrompts = new Set();

function copy(key) {
  return COPY[uiLanguage]?.[key] ?? COPY.zh[key] ?? key;
}

function localize(value) {
  if (typeof value === "string") return value;
  return value?.[uiLanguage] ?? value?.zh ?? value?.en ?? "";
}

function apiUrl(pathname) {
  const url = new URL(pathname, window.location.origin);
  url.searchParams.set("token", token ?? "");
  return url.toString();
}

async function api(pathname, options = {}) {
  const response = await fetch(apiUrl(pathname), {
    cache: "no-store",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });
  const body = await response.json();
  if (!response.ok || !body.ok) {
    throw new Error(body.error ?? `Request failed (${response.status}).`);
  }
  return body;
}

function shortPath(value) {
  if (!value) return "";
  return value.replaceAll("\\", "/").split("/").filter(Boolean).at(-1) ?? value;
}

async function copyText(value) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }
  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.append(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  textarea.remove();
  if (!copied) throw new Error("Clipboard is unavailable.");
}

function setPromptStatus(message, loading = false) {
  const spinner = elements.promptStatus.querySelector(".spinner");
  const label = elements.promptStatus.querySelector("span:last-child");
  spinner.hidden = !loading;
  label.textContent = message;
  elements.promptStatus.hidden = false;
}

function currentRoundLanguage(roundId) {
  return workflow.roundLanguages?.[roundId] ?? workflow.language;
}

function renderPromptPreview() {
  elements.promptList.replaceChildren();
  if (!previewRounds.length) {
    elements.copyAllButton.disabled = true;
    return;
  }
  elements.copyAllButton.disabled = false;
  elements.promptStatus.hidden = true;

  previewRounds.forEach((round) => {
    if (!initializedPromptExpansion) expandedPrompts.add(round.id);
    const expanded = expandedPrompts.has(round.id);
    const card = document.createElement("article");
    card.className = "prompt-preview-card";

    const header = document.createElement("div");
    header.className = "prompt-preview-card-header";
    const heading = document.createElement("div");
    const title = document.createElement("h3");
    title.textContent = round.title;
    const purpose = document.createElement("p");
    purpose.textContent = round.purpose;
    heading.append(title, purpose);

    const actions = document.createElement("div");
    actions.className = "prompt-preview-card-actions";
    const languageButton = document.createElement("button");
    languageButton.type = "button";
    languageButton.className = "prompt-action";
    languageButton.textContent =
      currentRoundLanguage(round.id) === "zh" ? "English" : "中文";
    languageButton.addEventListener("click", () => {
      workflow.roundLanguages = {
        ...(workflow.roundLanguages ?? {}),
        [round.id]:
          currentRoundLanguage(round.id) === "zh" ? "en" : "zh",
      };
      renderSummary();
      schedulePromptPreview();
    });

    const copyButton = document.createElement("button");
    copyButton.type = "button";
    copyButton.className = "prompt-action";
    copyButton.textContent = copy("copy");
    copyButton.addEventListener("click", async () => {
      try {
        await copyText(round.prompt);
        copyButton.textContent = copy("copied");
        setTimeout(() => {
          copyButton.textContent = copy("copy");
        }, 1_200);
      } catch (error) {
        elements.submitError.textContent =
          error instanceof Error ? error.message : String(error);
      }
    });

    const collapseButton = document.createElement("button");
    collapseButton.type = "button";
    collapseButton.className = "prompt-action";
    collapseButton.textContent = expanded
      ? copy("collapse")
      : copy("expand");
    collapseButton.addEventListener("click", () => {
      if (expandedPrompts.has(round.id)) expandedPrompts.delete(round.id);
      else expandedPrompts.add(round.id);
      renderPromptPreview();
    });
    actions.append(languageButton, copyButton, collapseButton);
    header.append(heading, actions);
    card.append(header);

    if (expanded) {
      const body = document.createElement("pre");
      body.className = "prompt-preview-body";
      body.textContent = round.prompt;
      card.append(body);
    }
    elements.promptList.append(card);
  });
  initializedPromptExpansion = true;
}

async function refreshPromptPreview(sequence) {
  try {
    const value = validatedWorkflow();
    setPromptStatus(copy("buildingPrompts"), true);
    const response = await api("/api/preview", {
      method: "POST",
      body: JSON.stringify({ workflow: value }),
    });
    if (sequence !== previewSequence) return;
    previewRounds = response.rounds;
    workflow.roundLanguages = response.config.roundLanguages;
    renderPromptPreview();
    renderSummary();
  } catch (error) {
    if (sequence !== previewSequence) return;
    previewRounds = [];
    elements.promptList.replaceChildren();
    const message =
      error instanceof Error && error.message
        ? `${copy("previewFailed")} ${error.message}`
        : copy("previewFailed");
    setPromptStatus(message, false);
    elements.copyAllButton.disabled = true;
  }
}

function schedulePromptPreview() {
  if (!workflow || submitting) return;
  previewSequence += 1;
  const sequence = previewSequence;
  if (previewTimer) clearTimeout(previewTimer);
  previewTimer = setTimeout(() => {
    refreshPromptPreview(sequence);
  }, 180);
}

function allocateWords(target, sections) {
  const raw = sections.map((section) => target * section.ratio);
  const allocated = raw.map((value) => Math.floor(value));
  let remaining = target - allocated.reduce((sum, value) => sum + value, 0);
  const order = raw
    .map((value, index) => ({
      index,
      remainder: value - allocated[index],
    }))
    .sort((left, right) => right.remainder - left.remainder);
  for (let cursor = 0; remaining > 0; cursor += 1) {
    allocated[order[cursor % order.length].index] += 1;
    remaining -= 1;
  }
  return Object.fromEntries(
    sections.map((section, index) => [section.id, allocated[index]]),
  );
}

function activeStyle() {
  return model.paperStyles[workflow.styleId];
}

function setCopy() {
  document.documentElement.lang = uiLanguage === "zh" ? "zh-CN" : "en";
  document.querySelectorAll("[data-copy]").forEach((element) => {
    element.textContent = copy(element.dataset.copy);
  });
  document.querySelectorAll("[data-ui-language]").forEach((button) => {
    button.classList.toggle(
      "active",
      button.dataset.uiLanguage === uiLanguage,
    );
  });
}

function createChoice({ id, title, description, active, onClick }) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `choice-button${active ? " active" : ""}`;
  button.dataset.id = id;
  const strong = document.createElement("strong");
  strong.textContent = title;
  button.append(strong);
  if (description) {
    const small = document.createElement("small");
    small.textContent = description;
    button.append(small);
  }
  button.addEventListener("click", onClick);
  return button;
}

function renderPaper() {
  elements.paperTitle.textContent = bootstrap.project.name;
  elements.paperPath.textContent = bootstrap.project.path;
  elements.inputList.replaceChildren();
  const labels = {
    tex: "fileTex",
    bib: "fileBib",
    pdf: "filePdf",
    figures: "fileFigures",
  };
  Object.entries(labels).forEach(([key, labelKey]) => {
    const item = document.createElement("li");
    if (bootstrap.inputs[key]) item.classList.add("available");
    item.textContent = bootstrap.inputs[key]
      ? `${copy(labelKey)} · ${shortPath(bootstrap.inputs[key])}`
      : `${copy(labelKey)} · —`;
    elements.inputList.append(item);
  });
}

function renderStyles() {
  elements.styleOptions.replaceChildren();
  Object.values(model.paperStyles).forEach((style) => {
    elements.styleOptions.append(
      createChoice({
        id: style.id,
        title: localize(style.label),
        description: localize(style.plannerSummary),
        active: workflow.styleId === style.id,
        onClick: () => {
          if (workflow.styleId === style.id) return;
          workflow.styleId = style.id;
          workflow.targetWords = style.defaultTargetWords;
          workflow.includeAppendix = style.defaultAppendix;
          workflow.includeSectionNavigationSentence =
            style.defaultIncludeSectionNavigationSentence;
          workflow.sectionBudgets = allocateWords(
            workflow.targetWords,
            style.sections,
          );
          render();
        },
      }),
    );
  });
  elements.introductionRoadmapToggle.checked =
    workflow.includeSectionNavigationSentence;
}

function budgetIsUnlimited(sectionId) {
  return (
    workflow.hasWordLimit &&
    workflow.unlimitedCoreSections &&
    model.wordCount.unlimitedSectionIds.includes(sectionId)
  );
}

function budgetValidation() {
  if (!workflow.hasWordLimit || workflow.unlimitedCoreSections) {
    return { valid: true, total: null };
  }
  const total = Object.values(workflow.sectionBudgets).reduce(
    (sum, value) => sum + Number(value || 0),
    0,
  );
  return { valid: total === workflow.targetWords, total };
}

function renderBudgets() {
  const style = activeStyle();
  elements.budgetGrid.replaceChildren();
  style.sections.forEach((section) => {
    const item = document.createElement("label");
    item.className = `budget-item${
      budgetIsUnlimited(section.id) ? " unlimited" : ""
    }`;
    const text = document.createElement("span");
    const name = document.createElement("strong");
    name.textContent = localize(section.label);
    const ratio = document.createElement("small");
    ratio.textContent = `${Math.round(section.ratio * 1000) / 10}%`;
    text.append(name, ratio);
    item.append(text);
    if (budgetIsUnlimited(section.id)) {
      const unlimited = document.createElement("em");
      unlimited.textContent = copy("unlimited");
      item.append(unlimited);
    } else {
      const input = document.createElement("input");
      input.type = "number";
      input.min = "0";
      input.step = "10";
      input.value = String(workflow.sectionBudgets[section.id] ?? 0);
      input.setAttribute(
        "aria-label",
        `${localize(section.label)} ${copy("words")}`,
      );
      input.addEventListener("input", () => {
        workflow.sectionBudgets[section.id] = Math.max(
          0,
          Number(input.value || 0),
        );
        renderBudgetValidation();
        renderSummary();
        schedulePromptPreview();
      });
      item.append(input);
    }
    elements.budgetGrid.append(item);
  });
  renderBudgetValidation();
}

function renderBudgetValidation() {
  const validation = budgetValidation();
  if (!workflow.hasWordLimit) {
    elements.budgetTotal.textContent = "";
    elements.budgetError.textContent = "";
    return;
  }
  if (workflow.unlimitedCoreSections) {
    elements.budgetTotal.textContent = copy("limitedCore");
    elements.budgetTotal.classList.remove("invalid");
    elements.budgetError.textContent = "";
    return;
  }
  elements.budgetTotal.textContent = `${validation.total.toLocaleString()} / ${workflow.targetWords.toLocaleString()} ${copy("words")}`;
  elements.budgetTotal.classList.toggle("invalid", !validation.valid);
  elements.budgetError.textContent = validation.valid
    ? ""
    : copy("budgetMismatch");
}

function renderWordLimit() {
  elements.wordLimitToggle.checked = workflow.hasWordLimit;
  elements.wordLimitPanel.hidden = !workflow.hasWordLimit;
  elements.targetWords.min = String(model.wordCount.min);
  elements.targetWords.max = String(model.wordCount.max);
  elements.targetWords.step = String(model.wordCount.step);
  elements.targetWords.value = String(workflow.targetWords);
  elements.unlimitedCoreToggle.checked =
    workflow.hasWordLimit && workflow.unlimitedCoreSections;
  renderBudgets();
}

function renderAppendix() {
  elements.appendixToggle.checked = workflow.includeAppendix;
}

function renderCaptionLength() {
  const policy = model.captionLength;
  elements.captionMinWords.min = String(policy.min);
  elements.captionMinWords.max = String(workflow.captionWordRange[1]);
  elements.captionMinWords.step = String(policy.step);
  elements.captionMinWords.value = String(workflow.captionWordRange[0]);
  elements.captionMaxWords.min = String(workflow.captionWordRange[0]);
  elements.captionMaxWords.max = String(policy.max);
  elements.captionMaxWords.step = String(policy.step);
  elements.captionMaxWords.value = String(workflow.captionWordRange[1]);
}

function renderRatios() {
  elements.ratioOptions.replaceChildren();
  model.frameworkFigure.aspectRatios.forEach((ratio) => {
    elements.ratioOptions.append(
      createChoice({
        id: ratio.id,
        title: localize(ratio.label),
        description: ratio.ratio ?? localize(ratio.description),
        active: workflow.frameworkFigure.aspectRatioId === ratio.id,
        onClick: () => {
          workflow.frameworkFigure.aspectRatioId = ratio.id;
          renderRatios();
          renderSummary();
          schedulePromptPreview();
        },
      }),
    );
  });
  const custom = workflow.frameworkFigure.aspectRatioId === "custom";
  elements.customRatio.hidden = !custom;
  elements.ratioWidth.value = String(
    workflow.frameworkFigure.customAspectWidth,
  );
  elements.ratioHeight.value = String(
    workflow.frameworkFigure.customAspectHeight,
  );
}

function renderExecution() {
  elements.promptLanguageOptions
    .querySelectorAll("[data-prompt-language]")
    .forEach((button) => {
      button.classList.toggle(
        "active",
        button.dataset.promptLanguage === workflow.language,
      );
    });
  elements.reasoningSelect.replaceChildren();
  model.chatExecution.reasoningPreferences.forEach((preference) => {
    const option = document.createElement("option");
    option.value = preference.id;
    option.textContent = localize(preference.label);
    option.selected =
      workflow.chatExecution.reasoningPreference === preference.id;
    elements.reasoningSelect.append(option);
  });
  const selected = model.chatExecution.reasoningPreferences.find(
    (item) => item.id === workflow.chatExecution.reasoningPreference,
  );
  elements.reasoningDescription.textContent = localize(
    selected?.description,
  );
  elements.pollingDescription.textContent =
    `${copy("resultPolling")} · ${pollingIntervalText(selected?.id)}`;
  const usesPro = selected?.id === "pro";
  elements.forceAllProRow.hidden = !usesPro;
  elements.forceAllProToggle.checked =
    usesPro && workflow.chatExecution.forceProForAllTurns === true;
  elements.forceAllProHint.textContent =
    workflow.chatExecution.forceProForAllTurns === true
      ? copy("proForceAllHint")
      : copy("proFirstTurnHint");
}

function pollingIntervalText(preferenceId) {
  const policy = model.chatExecution.pollingPolicy;
  if (preferenceId === "strongest") return copy("pollingStrongest");
  if (
    preferenceId === "pro" &&
    workflow.chatExecution.forceProForAllTurns !== true
  ) {
    return uiLanguage === "zh"
      ? "首次 Pro 每 5 分钟；后续 Extra High 每 3 分钟"
      : "First Pro interaction every 5 minutes; later Extra High interactions every 3 minutes";
  }
  const intervalMs =
    policy.intervalMsByCapability[preferenceId] ??
    policy.unknownIntervalMs;
  const minutes = intervalMs / 60_000;
  return uiLanguage === "zh"
    ? `每 ${minutes} 分钟检查一次`
    : `Check every ${minutes} ${minutes === 1 ? "minute" : "minutes"}`;
}

function ratioSummary() {
  const ratio = model.frameworkFigure.aspectRatios.find(
    (item) => item.id === workflow.frameworkFigure.aspectRatioId,
  );
  if (ratio?.id === "custom") {
    return `${workflow.frameworkFigure.customAspectWidth}:${workflow.frameworkFigure.customAspectHeight}`;
  }
  return ratio?.ratio ?? localize(ratio?.label);
}

function promptLanguageSummary() {
  const languages = new Set(
    Object.values(workflow.roundLanguages ?? { default: workflow.language }),
  );
  if (languages.size > 1) return copy("mixedLanguages");
  const [language = workflow.language] = languages;
  return language === "zh" ? "中文" : "English";
}

function summaryRows() {
  const style = activeStyle();
  const reasoning = model.chatExecution.reasoningPreferences.find(
    (item) => item.id === workflow.chatExecution.reasoningPreference,
  );
  let length = copy("noLimit");
  if (workflow.hasWordLimit) {
    length = workflow.unlimitedCoreSections
      ? copy("limitedCore")
      : `${workflow.targetWords.toLocaleString()} ${copy("words")}`;
  }
  return [
    [copy("summaryPaperType"), localize(style.label)],
    [copy("summaryLength"), length],
    [
      copy("summaryAppendix"),
      workflow.includeAppendix ? copy("allowed") : copy("disabled"),
    ],
    [
      copy("summaryCaption"),
      `${workflow.captionWordRange[0]}–${workflow.captionWordRange[1]} words`,
    ],
    [
      copy("summaryFigure"),
      ratioSummary(),
    ],
    [copy("summaryLanguage"), promptLanguageSummary()],
    [copy("summaryReasoning"), localize(reasoning?.label)],
    [
      copy("summaryPolling"),
      pollingIntervalText(reasoning?.id),
    ],
  ];
}

function renderSummary() {
  elements.summary.replaceChildren();
  summaryRows().forEach(([label, value]) => {
    const row = document.createElement("div");
    row.className = "summary-row";
    const term = document.createElement("dt");
    term.textContent = label;
    const description = document.createElement("dd");
    description.textContent = value;
    row.append(term, description);
    elements.summary.append(row);
  });
}

function render() {
  setCopy();
  renderPaper();
  renderStyles();
  renderWordLimit();
  renderAppendix();
  renderCaptionLength();
  renderRatios();
  renderExecution();
  renderSummary();
  renderPromptPreview();
  schedulePromptPreview();
}

function validatedWorkflow() {
  if (workflow.hasWordLimit) {
    if (
      !Number.isFinite(workflow.targetWords) ||
      workflow.targetWords < model.wordCount.min ||
      workflow.targetWords > model.wordCount.max
    ) {
      throw new Error(
        `${copy("targetWords")}: ${model.wordCount.min}–${model.wordCount.max}`,
      );
    }
    const validation = budgetValidation();
    if (!validation.valid) throw new Error(copy("budgetMismatch"));
  }
  if (workflow.frameworkFigure.aspectRatioId === "custom") {
    if (
      !Number.isFinite(workflow.frameworkFigure.customAspectWidth) ||
      workflow.frameworkFigure.customAspectWidth <= 0 ||
      !Number.isFinite(workflow.frameworkFigure.customAspectHeight) ||
      workflow.frameworkFigure.customAspectHeight <= 0
    ) {
      throw new Error(`${copy("aspectRatio")}: ${copy("submitFailed")}`);
    }
  }
  if (
    !Array.isArray(workflow.captionWordRange) ||
    workflow.captionWordRange.length < 2 ||
    !Number.isFinite(workflow.captionWordRange[0]) ||
    !Number.isFinite(workflow.captionWordRange[1]) ||
    workflow.captionWordRange[0] < model.captionLength.min ||
    workflow.captionWordRange[1] > model.captionLength.max ||
    workflow.captionWordRange[0] > workflow.captionWordRange[1]
  ) {
    throw new Error(
      `${copy("captionTitle")}: ${model.captionLength.min}–${model.captionLength.max}`,
    );
  }
  const roundLanguages = Object.fromEntries(
    Object.keys(workflow.roundLanguages ?? {}).map((id) => [
      id,
      workflow.roundLanguages?.[id] ?? workflow.language,
    ]),
  );
  return {
    ...workflow,
    unlimitedCoreSections:
      workflow.hasWordLimit && workflow.unlimitedCoreSections,
    roundLanguages,
  };
}

function bindEvents() {
  document.querySelectorAll("[data-ui-language]").forEach((button) => {
    button.addEventListener("click", () => {
      uiLanguage = button.dataset.uiLanguage;
      render();
    });
  });
  elements.wordLimitToggle.addEventListener("change", () => {
    if (elements.wordLimitToggle.checked && !workflow.hasWordLimit) {
      workflow.unlimitedCoreSections = true;
    }
    workflow.hasWordLimit = elements.wordLimitToggle.checked;
    renderWordLimit();
    renderSummary();
    schedulePromptPreview();
  });
  elements.introductionRoadmapToggle.addEventListener("change", () => {
    workflow.includeSectionNavigationSentence =
      elements.introductionRoadmapToggle.checked;
    renderSummary();
    schedulePromptPreview();
  });
  elements.targetWords.addEventListener("input", () => {
    const next = Number(elements.targetWords.value);
    if (!Number.isFinite(next)) return;
    workflow.targetWords = next;
    workflow.sectionBudgets = allocateWords(next, activeStyle().sections);
    renderBudgets();
    renderSummary();
    schedulePromptPreview();
  });
  elements.unlimitedCoreToggle.addEventListener("change", () => {
    workflow.unlimitedCoreSections =
      elements.unlimitedCoreToggle.checked;
    renderBudgets();
    renderSummary();
    schedulePromptPreview();
  });
  elements.appendixToggle.addEventListener("change", () => {
    workflow.includeAppendix = elements.appendixToggle.checked;
    renderSummary();
    schedulePromptPreview();
  });
  elements.captionMinWords.addEventListener("input", () => {
    const next = Number(elements.captionMinWords.value);
    if (!Number.isFinite(next)) return;
    workflow.captionWordRange[0] = Math.min(
      Math.max(model.captionLength.min, next),
      workflow.captionWordRange[1],
    );
    renderCaptionLength();
    renderSummary();
    schedulePromptPreview();
  });
  elements.captionMaxWords.addEventListener("input", () => {
    const next = Number(elements.captionMaxWords.value);
    if (!Number.isFinite(next)) return;
    workflow.captionWordRange[1] = Math.max(
      workflow.captionWordRange[0],
      Math.min(model.captionLength.max, next),
    );
    renderCaptionLength();
    renderSummary();
    schedulePromptPreview();
  });
  elements.ratioWidth.addEventListener("input", () => {
    workflow.frameworkFigure.customAspectWidth = Number(
      elements.ratioWidth.value,
    );
    renderSummary();
    schedulePromptPreview();
  });
  elements.ratioHeight.addEventListener("input", () => {
    workflow.frameworkFigure.customAspectHeight = Number(
      elements.ratioHeight.value,
    );
    renderSummary();
    schedulePromptPreview();
  });
  elements.promptLanguageOptions
    .querySelectorAll("[data-prompt-language]")
    .forEach((button) => {
      button.addEventListener("click", () => {
        workflow.language = button.dataset.promptLanguage;
        workflow.roundLanguages = Object.fromEntries(
          Object.keys(workflow.roundLanguages ?? {}).map((id) => [
            id,
            workflow.language,
          ]),
        );
        renderExecution();
        renderSummary();
        schedulePromptPreview();
      });
    });
  elements.reasoningSelect.addEventListener("change", () => {
    workflow.chatExecution.reasoningPreference =
      elements.reasoningSelect.value;
    if (elements.reasoningSelect.value !== "pro") {
      workflow.chatExecution.forceProForAllTurns = false;
    }
    renderExecution();
    renderSummary();
    schedulePromptPreview();
  });
  elements.forceAllProToggle.addEventListener("change", () => {
    workflow.chatExecution.forceProForAllTurns =
      elements.forceAllProToggle.checked;
    renderExecution();
    renderSummary();
    schedulePromptPreview();
  });
  elements.copyAllButton.addEventListener("click", async () => {
    if (!previewRounds.length) return;
    try {
      await copyText(
        previewRounds.map((round) => round.prompt).join("\n\n---\n\n"),
      );
      elements.copyAllButton.textContent = copy("copiedAll");
      setTimeout(() => {
        elements.copyAllButton.textContent = copy("copyAll");
      }, 1_200);
    } catch (error) {
      elements.submitError.textContent =
        error instanceof Error ? error.message : String(error);
    }
  });
  elements.exitButton.addEventListener("click", async () => {
    if (submitting) return;
    elements.submitError.textContent = "";
    submitting = true;
    elements.confirmButton.disabled = true;
    elements.exitButton.disabled = true;
    elements.exitButton.textContent = copy("cancelling");
    try {
      await api("/api/cancel", {
        method: "POST",
        body: "{}",
      });
      elements.form.hidden = true;
      elements.cancelled.hidden = false;
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      submitting = false;
      elements.confirmButton.disabled = false;
      elements.exitButton.disabled = false;
      elements.exitButton.textContent = copy("exit");
      elements.submitError.textContent =
        error instanceof Error ? error.message : String(error);
    }
  });
  elements.form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (submitting) return;
    elements.submitError.textContent = "";
    try {
      const value = validatedWorkflow();
      submitting = true;
      elements.confirmButton.disabled = true;
      elements.exitButton.disabled = true;
      elements.copyAllButton.disabled = true;
      elements.confirmButton.querySelector("span").textContent =
        copy("submitting");
      await api("/api/confirm", {
        method: "POST",
        body: JSON.stringify({ workflow: value }),
      });
      elements.form.hidden = true;
      elements.completion.hidden = false;
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      elements.submitError.textContent =
        error instanceof Error ? error.message : copy("submitFailed");
      submitting = false;
      elements.confirmButton.disabled = false;
      elements.exitButton.disabled = false;
      elements.copyAllButton.disabled = previewRounds.length === 0;
      elements.confirmButton.querySelector("span").textContent =
        copy("startAutomation");
    }
  });
}

async function initialize() {
  setCopy();
  if (!token) {
    throw new Error("Missing YanShu onboarding token.");
  }
  bootstrap = await api("/api/bootstrap");
  model = bootstrap.model;
  workflow = structuredClone(bootstrap.initialWorkflow);
  workflow.chatExecution.forceProForAllTurns ??= false;
  uiLanguage = bootstrap.uiLanguage === "en" ? "en" : "zh";
  bindEvents();
  render();
  elements.loading.hidden = true;
  elements.form.hidden = false;
}

initialize().catch((error) => {
  elements.loading.hidden = true;
  elements.form.hidden = true;
  elements.fatalError.hidden = false;
  elements.fatalErrorMessage.textContent =
    error instanceof Error ? error.message : String(error);
});
