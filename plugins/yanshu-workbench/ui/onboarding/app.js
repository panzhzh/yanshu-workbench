const COPY = {
  zh: {
    eyebrow: "FULL-AUTOMATION SETUP",
    title: "一次配置，随后自动执行",
    subtitle:
      "在这里完成全部重构选项。点击确认后，YanShu 将检查 ChatGPT 与 Chrome 权限并开始五轮工作，不再逐项询问。",
    selectedPaper: "已确认论文",
    loading: "正在载入本地配置模型…",
    paperType: "论文类型",
    paperTypeHint: "会议与期刊会使用不同的结构、篇幅侧重和写作规则。",
    lengthTitle: "正文与章节预算",
    lengthHint: "正文不包含附录；每张表格或图片按 200 词计入正文预算。",
    useWordLimit: "限制正文字数",
    useWordLimitHint: "关闭后，不向五轮 Prompt 注入任何正文或章节字数限制。",
    targetWords: "目标正文字数",
    targetWordsHint: "修改后，章节预算会按当前论文类型重新计算。",
    words: "词",
    unlimitedCore: "方法与实验不受字数限制",
    unlimitedCoreHint:
      "启用后不限制正文总数，只限制方法与实验之外的章节。",
    sectionBudgets: "章节预算",
    sectionBudgetsHint: "默认展开，可直接修改；受限模式下总和必须一致。",
    unlimited: "不限",
    budgetMatch: "预算一致",
    budgetMismatch: "章节总和与目标正文字数不一致。",
    appendixTitle: "附录",
    appendixHint: "附录不计入正文字数且字数不限。",
    allowAppendix: "允许附录",
    allowAppendixHint:
      "正文能满足规则时不使用附录；只有非主线内容确有必要时才移入。",
    figureTitle: "总体框架图",
    figureHint:
      "固定采用极简论文线稿、蓝橙配色、Calibri、两级字号和无大标题。",
    placement: "论文占栏",
    aspectRatio: "画布比例",
    ratioWidth: "宽",
    ratioHeight: "高",
    executionTitle: "Prompt 与 ChatGPT",
    executionHint:
      "模型名称不写死；YanShu 会读取当前账号真实可见的推理档位。",
    promptLanguage: "Prompt 语言",
    reasoning: "推理偏好",
    summaryEyebrow: "READY TO START",
    summaryTitle: "本次配置",
    localOnly: "仅在本机处理",
    localOnlyHint:
      "论文路径和设置只在 127.0.0.1 页面与本次 YanShu 会话之间传递，不发送到研术台网站。",
    confirm: "确认并开始全自动",
    confirmHint:
      "此按钮就是启动确认。点击后不会再重复询问这些配置。",
    confirmedEyebrow: "CONFIGURATION CONFIRMED",
    confirmedTitle: "配置已确认",
    confirmedBody:
      "YanShu 正在返回 Codex 检查 ChatGPT 与 Chrome 权限并启动工作。你可以关闭这个页面。",
    errorTitle: "配置页无法继续",
    submitFailed: "配置未能提交，请检查下面的提示后重试。",
    submitting: "正在确认…",
    summaryPaperType: "论文类型",
    summaryLength: "正文限制",
    summaryAppendix: "附录",
    summaryFigure: "框架图",
    summaryLanguage: "Prompt",
    summaryReasoning: "推理",
    noLimit: "不限制",
    limitedCore: "方法与实验不限",
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
      "Set every reconstruction option here. After confirmation, YanShu checks ChatGPT and Chrome permissions and starts all five rounds without asking each option again.",
    selectedPaper: "Confirmed paper",
    loading: "Loading the local configuration model…",
    paperType: "Paper type",
    paperTypeHint:
      "Conference and journal papers use different structures, length emphases, and writing rules.",
    lengthTitle: "Main text and section budgets",
    lengthHint:
      "The main text excludes the appendix; each table or figure counts as 200 words.",
    useWordLimit: "Limit main-text length",
    useWordLimitHint:
      "When disabled, no main-text or section word constraints enter the five prompts.",
    targetWords: "Target main-text words",
    targetWordsHint:
      "Changing this value recalculates section budgets for the paper type.",
    words: "words",
    unlimitedCore: "Do not limit Method or Experiments",
    unlimitedCoreHint:
      "Removes the main-text total and limits only sections outside Method and Experiments.",
    sectionBudgets: "Section budgets",
    sectionBudgetsHint:
      "Open by default and editable; constrained totals must match.",
    unlimited: "Unlimited",
    budgetMatch: "Budgets match",
    budgetMismatch:
      "The section total does not match the target main-text length.",
    appendixTitle: "Appendix",
    appendixHint:
      "The appendix is excluded from the main-text count and has no word limit.",
    allowAppendix: "Allow an appendix",
    allowAppendixHint:
      "Do not use it when the main text fits; move only genuinely non-core material when necessary.",
    figureTitle: "Overall framework figure",
    figureHint:
      "Uses minimal paper linework, a blue–orange palette, Calibri, two type levels, and no large title.",
    placement: "Paper placement",
    aspectRatio: "Canvas ratio",
    ratioWidth: "Width",
    ratioHeight: "Height",
    executionTitle: "Prompts and ChatGPT",
    executionHint:
      "Model names are not pinned; YanShu reads the reasoning levels actually visible to the account.",
    promptLanguage: "Prompt language",
    reasoning: "Reasoning preference",
    summaryEyebrow: "READY TO START",
    summaryTitle: "Run configuration",
    localOnly: "Processed locally",
    localOnlyHint:
      "Paper paths and settings pass only between this 127.0.0.1 page and the current YanShu session; they are not sent to the YanShu website.",
    confirm: "Confirm and start automation",
    confirmHint:
      "This button is the start authorization. These settings will not be asked again.",
    confirmedEyebrow: "CONFIGURATION CONFIRMED",
    confirmedTitle: "Configuration confirmed",
    confirmedBody:
      "YanShu is returning to Codex to check ChatGPT and Chrome permissions and start the workflow. You may close this page.",
    errorTitle: "The setup page cannot continue",
    submitFailed:
      "The configuration could not be submitted. Review the message below and retry.",
    submitting: "Confirming…",
    summaryPaperType: "Paper type",
    summaryLength: "Main text",
    summaryAppendix: "Appendix",
    summaryFigure: "Framework figure",
    summaryLanguage: "Prompt",
    summaryReasoning: "Reasoning",
    noLimit: "No limit",
    limitedCore: "Method and Experiments unlimited",
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
  fatalError: document.querySelector("#fatal-error"),
  fatalErrorMessage: document.querySelector("#fatal-error-message"),
  paperTitle: document.querySelector("#paper-title"),
  paperPath: document.querySelector("#paper-path"),
  inputList: document.querySelector("#input-list"),
  styleOptions: document.querySelector("#style-options"),
  wordLimitToggle: document.querySelector("#word-limit-toggle"),
  wordLimitPanel: document.querySelector("#word-limit-panel"),
  targetWords: document.querySelector("#target-words"),
  unlimitedCoreToggle: document.querySelector("#unlimited-core-toggle"),
  budgetGrid: document.querySelector("#budget-grid"),
  budgetTotal: document.querySelector("#budget-total"),
  budgetError: document.querySelector("#budget-error"),
  appendixToggle: document.querySelector("#appendix-toggle"),
  placementOptions: document.querySelector("#placement-options"),
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
  summary: document.querySelector("#configuration-summary"),
  confirmButton: document.querySelector("#confirm-button"),
  submitError: document.querySelector("#submit-error"),
};

const token = new URL(window.location.href).searchParams.get("token");
let bootstrap = null;
let model = null;
let workflow = null;
let uiLanguage = "zh";
let submitting = false;

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
          workflow.sectionBudgets = allocateWords(
            workflow.targetWords,
            style.sections,
          );
          render();
        },
      }),
    );
  });
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

function renderPlacement() {
  elements.placementOptions.replaceChildren();
  model.frameworkFigure.placements.forEach((placement) => {
    elements.placementOptions.append(
      createChoice({
        id: placement.id,
        title: localize(placement.label),
        description: localize(placement.description),
        active: workflow.frameworkFigure.placementId === placement.id,
        onClick: () => {
          workflow.frameworkFigure.placementId = placement.id;
          renderPlacement();
          renderSummary();
        },
      }),
    );
  });
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

function summaryRows() {
  const style = activeStyle();
  const placement = model.frameworkFigure.placements.find(
    (item) => item.id === workflow.frameworkFigure.placementId,
  );
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
      copy("summaryFigure"),
      `${localize(placement?.label)} · ${ratioSummary()}`,
    ],
    [
      copy("summaryLanguage"),
      workflow.language === "zh" ? "中文" : "English",
    ],
    [copy("summaryReasoning"), localize(reasoning?.label)],
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
  renderPlacement();
  renderRatios();
  renderExecution();
  renderSummary();
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
  const roundLanguages = Object.fromEntries(
    Object.keys(workflow.roundLanguages ?? {}).map((id) => [
      id,
      workflow.language,
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
    workflow.hasWordLimit = elements.wordLimitToggle.checked;
    if (!workflow.hasWordLimit) workflow.unlimitedCoreSections = false;
    renderWordLimit();
    renderSummary();
  });
  elements.targetWords.addEventListener("input", () => {
    const next = Number(elements.targetWords.value);
    if (!Number.isFinite(next)) return;
    workflow.targetWords = next;
    workflow.sectionBudgets = allocateWords(next, activeStyle().sections);
    renderBudgets();
    renderSummary();
  });
  elements.unlimitedCoreToggle.addEventListener("change", () => {
    workflow.unlimitedCoreSections =
      elements.unlimitedCoreToggle.checked;
    renderBudgets();
    renderSummary();
  });
  elements.appendixToggle.addEventListener("change", () => {
    workflow.includeAppendix = elements.appendixToggle.checked;
    renderSummary();
  });
  elements.ratioWidth.addEventListener("input", () => {
    workflow.frameworkFigure.customAspectWidth = Number(
      elements.ratioWidth.value,
    );
    renderSummary();
  });
  elements.ratioHeight.addEventListener("input", () => {
    workflow.frameworkFigure.customAspectHeight = Number(
      elements.ratioHeight.value,
    );
    renderSummary();
  });
  elements.promptLanguageOptions
    .querySelectorAll("[data-prompt-language]")
    .forEach((button) => {
      button.addEventListener("click", () => {
        workflow.language = button.dataset.promptLanguage;
        renderExecution();
        renderSummary();
      });
    });
  elements.reasoningSelect.addEventListener("change", () => {
    workflow.chatExecution.reasoningPreference =
      elements.reasoningSelect.value;
    renderExecution();
    renderSummary();
  });
  elements.form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (submitting) return;
    elements.submitError.textContent = "";
    try {
      const value = validatedWorkflow();
      submitting = true;
      elements.confirmButton.disabled = true;
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
      elements.confirmButton.querySelector("span").textContent =
        copy("confirm");
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
