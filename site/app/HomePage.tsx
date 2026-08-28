"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { YANSHU_SKILL_CATALOG } from "../content/workflows/skillWorkflows";
import { PRODUCT_CONFIG, type Language } from "./config";
import SiteNavigation from "./SiteNavigation";

const INSTALL_COMMAND = `codex plugin marketplace add panzhzh/yanshu-workbench --ref main
codex plugin add yanshu-workbench@yanshu-workbench`;

const HOME_COPY = {
  zh: {
    eyebrow: "CS RESEARCH WORKBENCH",
    title: "从实验完成，到论文可投稿。",
    subtitle:
      "安装一次 YanShu，在新的 Codex 任务中说出你要完成的科研工作。论文重构先由你选择网页 ChatGPT 或当前 CLI，不再根据环境自动判断。",
    primaryAction: "查看 3 步使用方法",
    secondaryAction: "不安装，直接使用网站",
    demoLabel: "真实启动流程",
    demoStatus: "本地工作区 · ChatGPT / Codex CLI",
    demoSteps: ["说出任务", "选择执行器", "配置并执行"],
    demoFrames: [
      {
        label: "01 · CODEX TASK",
        title: "一句话启动",
        lines: [
          "使用 $paper-reconstruction，",
          "重构这个论文目录。",
        ],
        footnote: "无需记住参数，也不会在聊天里逐项问配置。",
      },
      {
        label: "02 · CHOOSE EXECUTOR",
        title: "先选择由谁执行",
        lines: ["网页 ChatGPT　写作能力通常更强", "当前 CLI　启动更便捷"],
        footnote: "网页模式必须先登录并授权；CLI 模式不依赖网页，但写作能力通常较弱。",
      },
      {
        label: "03 · CONFIG & RUN",
        title: "一次配置后直接执行",
        lines: ["读取已确认材料", "保存版本化产物", "编译、核验并返回结果"],
        footnote: "网页模式使用完整配置页；CLI 模式只询问三项核心设置。",
      },
    ],
    guideEyebrow: "QUICK START",
    guideTitle: "第一次使用，只需三步",
    guideBody:
      "首页只说明如何开始。全部功能仍可从顶部导航进入，但不再在这里重复一遍目录。",
    installTitle: "安装 YanShu",
    installBody:
      "在 Codex 中执行一次。更新后的工作流会随插件一起载入。",
    copyInstall: "复制安装命令",
    copied: "已复制",
    newTaskTitle: "新建 Codex 任务",
    newTaskBody:
      "安装或更新后新建任务，输入 $子技能名称并说明目录。",
    exampleCommand:
      "使用 $paper-reconstruction 重构这个论文目录。",
    copyExample: "复制示例",
    configureTitle: "选择执行方式并开始",
    configureBody:
      "先选择网页 ChatGPT 或当前 CLI。网页模式需已登录并授权；CLI 模式更便捷，但论文写作能力通常不如网页端。",
    workflowEyebrow: "START WITH ONE SENTENCE",
    workflowTitle: "九个重要的全链路入口",
    workflowBody:
      "九个独立子 Skill 均支持 $ 调用；论文重构由用户明确选择网页或 CLI 执行。网站与插件共享 Prompt 数据。",
    inputLabel: "准备",
    outputLabel: "得到",
    openWorkbench: "查看配置页",
    copyCommand: "复制启动语",
    copiedCommand: "已复制",
    modesEyebrow: "TWO WAYS TO USE",
    modesTitle: "自动执行，或只复制 Prompt",
    automaticTitle: "安装插件 · 全链路",
    automaticBody:
      "适合需要读取本地材料、长时间运行、下载产物、编译和断点恢复的任务。",
    manualTitle: "直接打开网站 · 手动",
    manualBody:
      "适合先调整 Prompt，或把 Prompt 复制到任意模型中自行执行。网站不读取、不上传论文文件。",
    boundary:
      "YanShu 负责配置、材料边界、状态与验证；执行器由用户选择，不根据设备或环境静默切换。所有 venue 规则仍以最新官网为准。",
    installFailed: "复制失败，请手动选择命令。",
  },
  en: {
    eyebrow: "CS RESEARCH WORKBENCH",
    title: "From completed experiments to a submission-ready paper.",
    subtitle:
      "Install YanShu once, then state the research job in a new Codex task. Paper Reconstruction asks you to choose Web ChatGPT or Current CLI instead of guessing from the environment.",
    primaryAction: "See the three-step guide",
    secondaryAction: "Use the website without installing",
    demoLabel: "Actual launch flow",
    demoStatus: "Local workspace · ChatGPT / Codex CLI",
    demoSteps: ["State the task", "Choose executor", "Configure and run"],
    demoFrames: [
      {
        label: "01 · CODEX TASK",
        title: "Start with one sentence",
        lines: [
          "Use $paper-reconstruction",
          "to reconstruct this paper directory.",
        ],
        footnote:
          "No flags to memorize and no setting-by-setting interview in chat.",
      },
      {
        label: "02 · CHOOSE EXECUTOR",
        title: "Choose who executes",
        lines: [
          "Web ChatGPT　usually stronger writing",
          "Current CLI　more convenient",
        ],
        footnote:
          "Web mode requires login and authorization; CLI is browser-free but may write less strongly.",
      },
      {
        label: "03 · CONFIG & RUN",
        title: "Configure once, then run",
        lines: [
          "Read approved evidence",
          "Save versioned artifacts",
          "Compile, verify, and return",
        ],
        footnote:
          "Web mode uses the full setup page; CLI asks only three core settings.",
      },
    ],
    guideEyebrow: "QUICK START",
    guideTitle: "Your first run takes three steps",
    guideBody:
      "The homepage now explains how to begin. The full capability directory remains in the top navigation instead of being repeated here.",
    installTitle: "Install YanShu",
    installBody:
      "Run these once in Codex. Updated workflows load with the plugin.",
    copyInstall: "Copy install commands",
    copied: "Copied",
    newTaskTitle: "Create a new Codex task",
    newTaskBody:
      "After installing or updating, create a task and invoke a $sub-skill with its directory.",
    exampleCommand:
      "Use $paper-reconstruction to reconstruct this paper directory.",
    copyExample: "Copy example",
    configureTitle: "Choose an executor and start",
    configureBody:
      "Choose Web ChatGPT or Current CLI first. Web mode requires login and authorization; CLI is more convenient but may provide weaker academic writing.",
    workflowEyebrow: "START WITH ONE SENTENCE",
    workflowTitle: "Nine essential end-to-end entry points",
    workflowBody:
      "All eight independent sub-skills support $ invocation; Paper Reconstruction explicitly asks the user to choose Web or CLI execution. Website and plugin share one Prompt source.",
    inputLabel: "Prepare",
    outputLabel: "Receive",
    openWorkbench: "Open configuration",
    copyCommand: "Copy start phrase",
    copiedCommand: "Copied",
    modesEyebrow: "TWO WAYS TO USE",
    modesTitle: "Run automatically or copy only the Prompt",
    automaticTitle: "Install the plugin · end to end",
    automaticBody:
      "Best for local evidence, long-running tasks, downloads, compilation, and resumable progress.",
    manualTitle: "Open the website · manual",
    manualBody:
      "Best for adjusting a Prompt first or running it in any model yourself. The website never reads or uploads paper files.",
    boundary:
      "YanShu owns configuration, evidence boundaries, state, and validation. The user chooses the executor; YanShu never switches silently based on the device or environment. Always verify current venue rules on the official site.",
    installFailed: "Copy failed. Select the commands manually.",
  },
} as const;

export default function HomePage() {
  const [language, setLanguage] = useState<Language>(
    PRODUCT_CONFIG.defaultLanguage,
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoStep, setDemoStep] = useState(0);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const copy = HOME_COPY[language];

  const workflows = useMemo(
    () =>
      YANSHU_SKILL_CATALOG.map((workflow) => ({
        ...workflow,
        title: workflow.title[language],
        description: workflow.description[language],
        command: workflow.command[language],
        input: workflow.input[language],
        output: workflow.output[language],
      })),
    [language],
  );

  useEffect(() => {
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
    document.body.dataset.language = language;
  }, [language]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const timer = window.setInterval(() => {
      setDemoStep((current) => (current + 1) % copy.demoFrames.length);
    }, 4200);
    return () => window.clearInterval(timer);
  }, [copy.demoFrames.length]);

  async function copyText(value: string, key: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(key);
      window.setTimeout(() => setCopiedKey(null), 1500);
    } catch {
      setCopiedKey("error");
      window.setTimeout(() => setCopiedKey(null), 2200);
    }
  }

  return (
    <div className="site-shell">
      <SiteNavigation
        language={language}
        activePage="home"
        mobileMenuOpen={mobileMenuOpen}
        onLanguageChange={setLanguage}
        onMenuToggle={() => setMobileMenuOpen((open) => !open)}
        onMenuClose={() => setMobileMenuOpen(false)}
      />

      <main className="site-main home-site-main" id="main-content">
        <section className="home-hero">
          <div className="home-hero-copy-column">
            <p className="eyebrow">{copy.eyebrow}</p>
            <h1>{copy.title}</h1>
            <p className="home-hero-copy">{copy.subtitle}</p>
            <div className="home-hero-actions">
              <a className="primary-button" href="#quick-start">
                {copy.primaryAction}
                <span aria-hidden="true">↓</span>
              </a>
              <Link className="home-secondary-link" href="/ideas/discovery">
                {copy.secondaryAction}
              </Link>
            </div>
          </div>

          <div className="home-demo" aria-label={copy.demoLabel}>
            <div className="home-demo-bar">
              <div aria-hidden="true">
                <i />
                <i />
                <i />
              </div>
              <span>{copy.demoStatus}</span>
            </div>
            <div className="home-demo-body" aria-live="polite">
              {copy.demoFrames.map((frame, index) => (
                <article
                  className={index === demoStep ? "active" : ""}
                  key={frame.label}
                  aria-hidden={index !== demoStep}
                >
                  <small>{frame.label}</small>
                  <h2>{frame.title}</h2>
                  <div>
                    {frame.lines.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                  <footer>{frame.footnote}</footer>
                </article>
              ))}
            </div>
            <div className="home-demo-controls">
              {copy.demoSteps.map((step, index) => (
                <button
                  type="button"
                  className={index === demoStep ? "active" : ""}
                  aria-pressed={index === demoStep}
                  onClick={() => setDemoStep(index)}
                  key={step}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {step}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section
          className="home-guide"
          id="quick-start"
          aria-labelledby="quick-start-title"
        >
          <div className="home-section-intro">
            <div>
              <p className="eyebrow">{copy.guideEyebrow}</p>
              <h2 id="quick-start-title">{copy.guideTitle}</h2>
            </div>
            <p>{copy.guideBody}</p>
          </div>

          <ol className="home-guide-grid">
            <li>
              <header>
                <span>01</span>
                <h3>{copy.installTitle}</h3>
              </header>
              <p>{copy.installBody}</p>
              <pre>{INSTALL_COMMAND}</pre>
              <button
                type="button"
                onClick={() => void copyText(INSTALL_COMMAND, "install")}
              >
                {copiedKey === "install" ? copy.copied : copy.copyInstall}
              </button>
            </li>
            <li>
              <header>
                <span>02</span>
                <h3>{copy.newTaskTitle}</h3>
              </header>
              <p>{copy.newTaskBody}</p>
              <blockquote>{copy.exampleCommand}</blockquote>
              <button
                type="button"
                onClick={() =>
                  void copyText(copy.exampleCommand, "example")
                }
              >
                {copiedKey === "example" ? copy.copied : copy.copyExample}
              </button>
            </li>
            <li>
              <header>
                <span>03</span>
                <h3>{copy.configureTitle}</h3>
              </header>
              <p>{copy.configureBody}</p>
              <div className="home-config-miniature" aria-hidden="true">
                <span />
                <span />
                <span />
                <strong>{language === "zh" ? "全自动开始" : "Start"}</strong>
              </div>
            </li>
          </ol>
          {copiedKey === "error" ? (
            <p className="home-copy-error" role="alert">
              {copy.installFailed}
            </p>
          ) : null}
        </section>

        <section className="home-skill-starts">
          <div className="home-section-intro">
            <div>
              <p className="eyebrow">{copy.workflowEyebrow}</p>
              <h2>{copy.workflowTitle}</h2>
            </div>
            <p>{copy.workflowBody}</p>
          </div>

          <div className="home-skill-grid">
            {workflows.map((workflow) => (
              <article key={workflow.id}>
                <header>
                  <span>{workflow.index}</span>
                  <small>
                    ${workflow.id} · {workflow.skillName}
                  </small>
                </header>
                <h3>{workflow.title}</h3>
                <p>{workflow.description}</p>
                <dl>
                  <div>
                    <dt>{copy.inputLabel}</dt>
                    <dd>{workflow.input}</dd>
                  </div>
                  <div>
                    <dt>{copy.outputLabel}</dt>
                    <dd>{workflow.output}</dd>
                  </div>
                </dl>
                <blockquote>{workflow.command}</blockquote>
                <footer>
                  <Link href={workflow.websitePath}>
                    {copy.openWorkbench}
                    <span aria-hidden="true">↗</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() =>
                      void copyText(
                        workflow.command,
                        `workflow-${workflow.id}`,
                      )
                    }
                  >
                    {copiedKey === `workflow-${workflow.id}`
                      ? copy.copiedCommand
                      : copy.copyCommand}
                  </button>
                </footer>
              </article>
            ))}
          </div>
        </section>

        <section className="home-use-modes">
          <div>
            <p className="eyebrow">{copy.modesEyebrow}</p>
            <h2>{copy.modesTitle}</h2>
          </div>
          <div className="home-mode-grid">
            <article>
              <span aria-hidden="true">A</span>
              <h3>{copy.automaticTitle}</h3>
              <p>{copy.automaticBody}</p>
            </article>
            <article>
              <span aria-hidden="true">B</span>
              <h3>{copy.manualTitle}</h3>
              <p>{copy.manualBody}</p>
            </article>
          </div>
          <p className="home-boundary">{copy.boundary}</p>
        </section>

        <footer className="site-footer home-footer">
          <span>
            {PRODUCT_CONFIG.productName} · {PRODUCT_CONFIG.productNameEn}
          </span>
          <span>{copy.eyebrow}</span>
        </footer>
      </main>
    </div>
  );
}
