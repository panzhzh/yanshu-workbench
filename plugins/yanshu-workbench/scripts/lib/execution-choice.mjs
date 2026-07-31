export const RECONSTRUCTION_EXECUTION_MODES = [
  "visible-chatgpt",
  "codex-host",
];

function appendInputArguments(argumentsList, inputs = {}) {
  for (const [flag, value] of [
    ["--tex", inputs.tex],
    ["--bib", inputs.bib],
    ["--pdf", inputs.pdf],
    ["--figures", inputs.figures],
  ]) {
    if (value) argumentsList.push(flag, value);
  }
}

function configureStartArguments({
  projectRoot,
  inputs,
  uiLanguage,
  executionMode,
}) {
  const argumentsList = [];
  if (projectRoot) argumentsList.push("--project", projectRoot);
  appendInputArguments(argumentsList, inputs);
  argumentsList.push(
    "--ui-language",
    uiLanguage,
    "--execution-mode",
    executionMode,
  );
  return argumentsList;
}

function localizedCopy(uiLanguage) {
  if (uiLanguage === "en") {
    return {
      question:
        "Choose the executor for this reconstruction: Web ChatGPT (usually stronger academic writing; you must already be signed in to ChatGPT and grant the required browser and file/upload permissions), or Current CLI (more convenient and browser-free, but its academic writing may be weaker than Web ChatGPT). Reply with only ‘Web ChatGPT’ or ‘Current CLI’.",
      visibleLabel: "Web ChatGPT",
      visibleDescription:
        "Usually stronger academic writing; requires an active ChatGPT login and authorization for browser control plus required file access/uploads.",
      cliLabel: "Current CLI",
      cliDescription:
        "More convenient and independent of a web session, but academic writing may be weaker than Web ChatGPT.",
    };
  }
  return {
    question:
      "请选择本次论文重构的执行方式：网页 ChatGPT（论文写作能力通常更强；必须已登录 ChatGPT，并授权所需的浏览器控制及文件访问/上传权限），或当前 CLI（启动更便捷且不依赖网页，但论文写作能力通常不如网页端）。请只回复“网页 ChatGPT”或“当前 CLI”。",
    visibleLabel: "网页 ChatGPT",
    visibleDescription:
      "论文写作能力通常更强；必须已登录 ChatGPT，并授权浏览器控制及所需的文件访问/上传权限。",
    cliLabel: "当前 CLI",
    cliDescription:
      "启动更便捷且不依赖网页，但论文写作能力通常不如网页 ChatGPT。",
  };
}

export function buildExecutionModeChoice({
  projectRoot = null,
  inputs = {},
  uiLanguage = "zh",
  runPath = null,
} = {}) {
  const copy = localizedCopy(uiLanguage);
  const paperSelectionPending = !runPath && !projectRoot;
  const nextFor = (executionMode) =>
    runPath
      ? {
          command: "execution-adapter",
          arguments: [
            "--run",
            runPath,
            "--adapter",
            executionMode,
            "--reason",
            "explicit user selection",
          ],
        }
      : {
          command: "configure-start",
          arguments: configureStartArguments({
            projectRoot,
            inputs,
            uiLanguage,
            executionMode,
          }),
        };

  return {
    ok: true,
    status: "execution-mode-required",
    configurationMode: "choice",
    pageOpened: false,
    sessionPath: null,
    projectRoot,
    inputs,
    executionModeChoice: {
      askOnce: true,
      question: copy.question,
      options: [
        {
          id: "visible-chatgpt",
          label: copy.visibleLabel,
          description: copy.visibleDescription,
          requires: [
            "signed-in ChatGPT session",
            "browser-control authorization",
            "required file-access and upload authorization",
          ],
          next: nextFor("visible-chatgpt"),
        },
        {
          id: "codex-host",
          label: copy.cliLabel,
          description: copy.cliDescription,
          requires: [],
          next: nextFor("codex-host"),
        },
      ],
    },
    instruction:
      paperSelectionPending
        ? "Ask executionModeChoice.question exactly once and store the answer. Do not infer the executor from SSH, WSL, DISPLAY, operating system, or browser availability. Then ask for the paper directory and inspect its inputs; do not run configure-start until those paths are known, and include the stored --execution-mode when you do."
        : "Ask executionModeChoice.question exactly once and honor the answer. Do not infer the executor from SSH, WSL, DISPLAY, operating system, or browser availability. Run only the matching option.next command.",
  };
}

export function buildInlineReconstructionConfiguration({
  projectRoot,
  inputs,
  uiLanguage = "zh",
}) {
  const question =
    uiLanguage === "zh"
      ? "请一次回复三项配置：论文类型（会议或期刊）；是否允许单独附录；正文建议字数（不限制，或填写一个具体数字）。例如：期刊；允许附录；不限制。"
      : "Reply once with three settings: paper type (conference or journal); whether a separate appendix is allowed; and suggested main-text words (none, or one number). Example: journal; appendix allowed; none.";
  const initArguments = ["--project", projectRoot];
  appendInputArguments(initArguments, inputs);
  initArguments.push(
    "--style",
    "<conference|journal>",
    "--appendix",
    "<true|false>",
    "--word-limit",
    "<none|positive-number>",
    "--language",
    uiLanguage,
    "--execution-adapter",
    "codex-host",
  );

  return {
    ok: true,
    status: "inline-configuration-required",
    configurationMode: "inline",
    selectedExecutionMode: "codex-host",
    pageOpened: false,
    sessionPath: null,
    projectRoot,
    inputs,
    inlineConfiguration: {
      askOnce: true,
      question,
      fields: [
        {
          id: "style",
          options: ["conference", "journal"],
        },
        {
          id: "appendix",
          options: [true, false],
        },
        {
          id: "wordLimit",
          options: ["none", "positive-number"],
          advisoryOnly: true,
        },
      ],
      defaultsNotAsked: {
        unlimitedMethodAndExperiments: true,
        captionWordRange: [10, 40],
        frameworkFigureRatio: "landscape-2-1",
        promptLanguage: uiLanguage,
        reasoningPreference: "strongest",
      },
    },
    initialization: {
      command: "init",
      arguments: initArguments,
      executionAdapter: "codex-host",
    },
    instruction:
      "Ask inlineConfiguration.question exactly once. Map that single reply into initialization.arguments, run init directly, and continue full automation in the current Codex CLI task. Do not call configure-status, wait for a page, open visible ChatGPT, or launch a nested codex exec/resume process.",
  };
}
