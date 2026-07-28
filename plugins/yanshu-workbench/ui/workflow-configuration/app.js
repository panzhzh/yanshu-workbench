const token = new URLSearchParams(window.location.search).get("token");

const elements = {
  brand: document.querySelector("#brand-label"),
  local: document.querySelector("#local-label"),
  title: document.querySelector("#workflow-title"),
  eyebrow: document.querySelector("#workflow-eyebrow"),
  description: document.querySelector("#workflow-description"),
  projectLabel: document.querySelector("#project-label"),
  projectName: document.querySelector("#project-name"),
  materialsTitle: document.querySelector("#materials-title"),
  materialList: document.querySelector("#material-list"),
  materialHint: document.querySelector("#material-hint"),
  form: document.querySelector("#configuration-form"),
  sections: document.querySelector("#configuration-sections"),
  reset: document.querySelector("#reset-button"),
  exit: document.querySelector("#exit-button"),
  confirm: document.querySelector("#confirm-button"),
  submitNote: document.querySelector("#submit-note"),
  submitError: document.querySelector("#submit-error"),
  promptTitle: document.querySelector("#prompt-title"),
  promptLanguageLabel: document.querySelector("#prompt-language-label"),
  promptHint: document.querySelector("#prompt-hint"),
  promptContent: document.querySelector("#prompt-content"),
  output: document.querySelector("#output-description"),
  copy: document.querySelector("#copy-button"),
  completion: document.querySelector("#completion-overlay"),
  completionTitle: document.querySelector("#completion-title"),
};

let bootstrap = null;
let model = null;
let preferences = {};
let promptLanguage = "zh";
let prompt = "";
let uiLanguage = "zh";
let previewSequence = 0;
let previewTimer = null;
let submitting = false;

function localized(value) {
  if (value == null) return "";
  if (typeof value === "string") return value;
  return value[uiLanguage] ?? value.zh ?? value.en ?? "";
}

function copy(key) {
  return bootstrap?.copy?.[uiLanguage]?.[key] ?? key;
}

function apiUrl(pathname) {
  const url = new URL(pathname, window.location.origin);
  url.searchParams.set("token", token);
  return url;
}

async function api(pathname, options = {}) {
  const response = await fetch(apiUrl(pathname), {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });
  const value = await response.json();
  if (!response.ok || value.ok === false) {
    throw new Error(value.error ?? `Request failed (${response.status})`);
  }
  return value;
}

function createElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function fieldIsVisible(field) {
  if (!field.visibleWhen) return true;
  return preferences[field.visibleWhen.fieldId] === field.visibleWhen.equals;
}

function updateVisibleFields() {
  document.querySelectorAll("[data-field-id]").forEach((element) => {
    const field = model.fields.find(
      (item) => item.id === element.dataset.fieldId,
    );
    element.hidden = !field || !fieldIsVisible(field);
  });
}

function updatePreference(field, value) {
  preferences = { ...preferences, [field.id]: value };
  if (field.id === "accentColorMin" || field.id === "accentColorMax") {
    const min = Number(preferences.accentColorMin);
    const max = Number(preferences.accentColorMax);
    if (Number.isFinite(min) && Number.isFinite(max) && min > max) {
      if (field.id === "accentColorMin") {
        preferences.accentColorMax = min;
      } else {
        preferences.accentColorMin = max;
      }
      renderSections();
    }
  }
  updateVisibleFields();
  schedulePreview();
}

function buildTextField(field, wrapper) {
  const inputId = `field-${field.id}`;
  const label = createElement("label", "field-label", localized(field.label));
  label.htmlFor = inputId;
  const input = document.createElement(
    field.type === "textarea" ? "textarea" : "input",
  );
  input.id = inputId;
  input.name = field.id;
  if (field.type !== "textarea") input.type = field.type;
  input.value = preferences[field.id] ?? "";
  if (field.placeholder) input.placeholder = localized(field.placeholder);
  if (field.min !== undefined) input.min = String(field.min);
  if (field.max !== undefined) input.max = String(field.max);
  if (field.step !== undefined) input.step = String(field.step);
  input.addEventListener("input", () => {
    const nextValue =
      field.type === "number" ? Number(input.value) : input.value;
    updatePreference(field, nextValue);
  });
  wrapper.append(label, input);
}

function buildSelectField(field, wrapper) {
  const inputId = `field-${field.id}`;
  const label = createElement("label", "field-label", localized(field.label));
  label.htmlFor = inputId;
  const select = document.createElement("select");
  select.id = inputId;
  select.name = field.id;
  for (const option of field.choices ?? []) {
    const element = document.createElement("option");
    element.value = String(option.value);
    element.textContent = localized(option.label);
    element.selected = preferences[field.id] === option.value;
    select.append(element);
  }
  select.addEventListener("change", () => {
    const option = field.choices.find(
      (item) => String(item.value) === select.value,
    );
    updatePreference(field, option?.value ?? select.value);
  });
  wrapper.append(label, select);
}

function buildChoiceField(field, wrapper) {
  const label = createElement("span", "field-label", localized(field.label));
  const group = createElement("div", "choice-grid");
  group.setAttribute("role", "radiogroup");
  group.setAttribute("aria-label", localized(field.label));
  for (const option of field.choices ?? []) {
    const optionLabel = createElement("label", "choice-card");
    const input = document.createElement("input");
    input.type = "radio";
    input.name = field.id;
    input.value = String(option.value);
    input.checked = preferences[field.id] === option.value;
    const content = createElement("span");
    content.append(createElement("strong", "", localized(option.label)));
    if (option.description) {
      content.append(createElement("small", "", localized(option.description)));
    }
    input.addEventListener("change", () => {
      if (input.checked) updatePreference(field, option.value);
    });
    optionLabel.append(input, content);
    group.append(optionLabel);
  }
  wrapper.append(label, group);
}

function buildBooleanField(field, wrapper) {
  const label = createElement("label", "boolean-field");
  const content = createElement("span");
  content.append(createElement("strong", "", localized(field.label)));
  if (field.description) {
    content.append(createElement("small", "", localized(field.description)));
  }
  const input = document.createElement("input");
  input.type = "checkbox";
  input.name = field.id;
  input.checked = preferences[field.id] === true;
  const visual = createElement("i");
  visual.setAttribute("aria-hidden", "true");
  input.addEventListener("change", () => {
    updatePreference(field, input.checked);
  });
  label.append(content, input, visual);
  wrapper.append(label);
}

function buildField(field) {
  const wrapper = createElement("div", `field field-${field.type}`);
  wrapper.dataset.fieldId = field.id;
  wrapper.hidden = !fieldIsVisible(field);

  if (field.type === "choice") {
    buildChoiceField(field, wrapper);
  } else if (field.type === "boolean") {
    buildBooleanField(field, wrapper);
  } else if (field.type === "select") {
    buildSelectField(field, wrapper);
  } else {
    buildTextField(field, wrapper);
  }
  if (
    field.description &&
    field.type !== "boolean" &&
    field.type !== "choice"
  ) {
    wrapper.append(
      createElement("p", "field-description", localized(field.description)),
    );
  }
  return wrapper;
}

function renderSections() {
  elements.sections.replaceChildren();
  for (const section of model.sections) {
    const sectionElement = createElement("section", "configuration-section");
    const heading = createElement("div", "section-heading");
    heading.append(
      createElement("span", "", section.index),
      createElement("h2", "", localized(section.title)),
      createElement("p", "", localized(section.description)),
    );
    const fields = createElement("div", "field-grid");
    for (const field of model.fields.filter(
      (item) => item.sectionId === section.id,
    )) {
      fields.append(buildField(field));
    }
    sectionElement.append(heading, fields);
    elements.sections.append(sectionElement);
  }
}

function renderMaterials() {
  elements.materialsTitle.textContent = localized(model.materialTitle);
  elements.materialList.replaceChildren();
  for (const item of model.materialItems[uiLanguage]) {
    elements.materialList.append(createElement("li", "", item));
  }
  elements.materialHint.textContent = localized(model.materialHint);
}

function setCopy() {
  document.documentElement.lang = uiLanguage === "zh" ? "zh-CN" : "en";
  elements.brand.textContent = copy("brand");
  elements.local.textContent = copy("local");
  elements.projectLabel.textContent = copy("project");
  elements.reset.textContent = copy("reset");
  elements.exit.textContent = copy("exit");
  elements.confirm.textContent = submitting ? copy("starting") : copy("start");
  elements.submitNote.textContent = copy("ready");
  elements.promptTitle.textContent = copy("promptTitle");
  elements.promptLanguageLabel.textContent = copy("promptLanguage");
  elements.promptHint.textContent = copy("promptHint");
  elements.copy.textContent = copy("copy");
  elements.title.textContent = localized(model.title);
  elements.eyebrow.textContent = model.eyebrow;
  elements.description.textContent = localized(model.description);
  elements.output.textContent = localized(model.output);
  document.querySelectorAll("[data-ui-language]").forEach((button) => {
    button.classList.toggle(
      "active",
      button.dataset.uiLanguage === uiLanguage,
    );
  });
  document.querySelectorAll("[data-prompt-language]").forEach((button) => {
    button.classList.toggle(
      "active",
      button.dataset.promptLanguage === promptLanguage,
    );
  });
}

function renderAll() {
  setCopy();
  renderMaterials();
  renderSections();
  elements.promptContent.textContent = prompt;
  elements.promptContent.lang = promptLanguage === "zh" ? "zh-CN" : "en";
}

async function refreshPreview(sequence) {
  try {
    const result = await api("/api/preview", {
      method: "POST",
      body: JSON.stringify({ preferences, promptLanguage }),
    });
    if (sequence !== previewSequence) return;
    preferences = result.preferences;
    prompt = result.prompt;
    elements.promptContent.textContent = prompt;
    elements.promptContent.lang = promptLanguage === "zh" ? "zh-CN" : "en";
    elements.submitError.textContent = "";
  } catch (error) {
    if (sequence !== previewSequence) return;
    elements.submitError.textContent =
      error instanceof Error ? error.message : copy("loadFailed");
  }
}

function schedulePreview() {
  window.clearTimeout(previewTimer);
  const sequence = ++previewSequence;
  previewTimer = window.setTimeout(() => {
    void refreshPreview(sequence);
  }, 180);
}

async function copyPrompt() {
  try {
    await navigator.clipboard.writeText(prompt);
    elements.copy.textContent = copy("copied");
    window.setTimeout(() => {
      elements.copy.textContent = copy("copy");
    }, 1_400);
  } catch {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(elements.promptContent);
    selection.removeAllRanges();
    selection.addRange(range);
    elements.promptContent.focus();
  }
}

function bindEvents() {
  document.querySelectorAll("[data-ui-language]").forEach((button) => {
    button.addEventListener("click", () => {
      uiLanguage = button.dataset.uiLanguage;
      setCopy();
      renderMaterials();
      renderSections();
    });
  });
  document.querySelectorAll("[data-prompt-language]").forEach((button) => {
    button.addEventListener("click", () => {
      promptLanguage = button.dataset.promptLanguage;
      setCopy();
      schedulePreview();
    });
  });
  elements.reset.addEventListener("click", () => {
    preferences = structuredClone(model.defaults);
    promptLanguage = uiLanguage;
    renderAll();
    schedulePreview();
  });
  elements.copy.addEventListener("click", () => void copyPrompt());
  elements.exit.addEventListener("click", async () => {
    if (submitting) return;
    submitting = true;
    setCopy();
    try {
      await api("/api/cancel", { method: "POST", body: "{}" });
      elements.completionTitle.textContent = copy("cancelled");
      elements.completion.hidden = false;
    } catch (error) {
      submitting = false;
      setCopy();
      elements.submitError.textContent =
        error instanceof Error ? error.message : copy("submitFailed");
    }
  });
  elements.form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (submitting) return;
    submitting = true;
    elements.submitError.textContent = "";
    setCopy();
    try {
      await api("/api/confirm", {
        method: "POST",
        body: JSON.stringify({ preferences, promptLanguage }),
      });
      elements.completionTitle.textContent = copy("confirmed");
      elements.completion.hidden = false;
    } catch (error) {
      submitting = false;
      setCopy();
      elements.submitError.textContent =
        error instanceof Error ? error.message : copy("submitFailed");
    }
  });
}

async function initialize() {
  if (!token) throw new Error("Missing YanShu configuration token.");
  bootstrap = await api("/api/bootstrap");
  model = bootstrap.model;
  uiLanguage = bootstrap.uiLanguage === "en" ? "en" : "zh";
  preferences = structuredClone(bootstrap.initial.preferences);
  promptLanguage = bootstrap.initial.promptLanguage;
  prompt = bootstrap.initial.prompt;
  elements.projectName.textContent = bootstrap.projectName;
  renderAll();
  bindEvents();
}

initialize().catch((error) => {
  elements.title.textContent = "YanShu";
  elements.description.textContent =
    error instanceof Error ? error.message : "Configuration failed.";
  elements.form.hidden = true;
  elements.promptContent.textContent = "";
});
