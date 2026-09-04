"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { YANSHU_SKILL_CATALOG } from "../content/workflows/skillWorkflows";
import { PRODUCT_CONFIG } from "./config";
import SiteNavigation from "./SiteNavigation";
import { usePersistentSiteLanguage } from "./usePersistentLanguage";

const INSTALL_COMMAND = `codex plugin marketplace add panzhzh/yanshu-workbench --ref main
codex plugin add yanshu-workbench@yanshu-workbench`;

const HOME_COPY = {
  zh: {
    eyebrow: "CS RESEARCH WORKBENCH",
    title: "从实验完成，到论文可投稿。",
    subtitle:
      "安装一次 YanShu，在 Codex 或 CLI 中说出任务。Skill 会读取与官网相同的 Prompt，并在当前任务直接完成，不再打开配置页或额外聊天。",
    primaryAction: "查看 3 步使用方法",
    secondaryAction: "不安装，直接使用网站",
    demoLabel: "真实启动流程",
    demoStatus: "本地工作区 · Codex / CLI",
    demoSteps: ["说出任务", "确认材料", "直接执行"],
    demoFrames: [
      {
        label: "01 · CODEX TASK",
        title: "一句话启动",
        lines: [
          "使用 $paper-reconstruction，",
          "重构这个论文目录。",
        ],
        footnote: "无需记住参数；未说明的选项直接使用官网默认值。",
      },
      {
        label: "02 · VERIFY MATERIALS",
        title: "只确认真正的输入",
        lines: ["定位论文或实验目录", "核对 TeX、BibTeX、PDF 与结果文件"],
        footnote: "存在多个候选时只询问一次，不随机选择，也不打开内部 JSON。",
      },
      {
        label: "03 · RUN IN PLACE",
        title: "当前任务全链路完成",
        lines: ["内部解析官网同源 Prompt", "生成、编译、核验并返回结果"],
        footnote: "不打开本地网页或新 Chat；只有关键偏好缺失时才合并询问一次。",
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
    configureTitle: "在当前任务直接开始",
    configureBody:
      "Skill 在当前 Codex/CLI 任务直接执行。网站用于查看和调整 Prompt，但插件运行时不会自动打开网站。",
    workflowEyebrow: "START WITH ONE SENTENCE",
    workflowTitle: "十个重要的全链路入口",
    workflowBody:
      "十个独立子 Skill 均支持 $ 调用，并在当前任务直接执行。网站与插件共享 Prompt 数据。",
    inputLabel: "准备",
    outputLabel: "得到",
    openWorkbench: "打开网页工具",
    copyCommand: "复制启动语",
    copiedCommand: "已复制",
    modesEyebrow: "TWO WAYS TO USE",
    modesTitle: "自动执行，或只复制 Prompt",
    automaticTitle: "安装插件 · 全链路",
    automaticBody:
      "适合读取本地材料、生成文件、编译和自动核验；全程留在当前 Codex/CLI 任务。",
    manualTitle: "直接打开网站 · 手动",
    manualBody:
      "适合先调整 Prompt，或把 Prompt 复制到任意模型中自行执行。网站不读取、不上传论文文件。",
    boundary:
      "YanShu 负责 Prompt、材料边界与验证；未指定的选项使用官网默认值，真正影响结果的歧义最多合并询问一次。所有 venue 规则仍以最新官网为准。",
    installFailed: "复制失败，请手动选择命令。",
  },
  en: {
    eyebrow: "CS RESEARCH WORKBENCH",
    title: "From completed experiments to a submission-ready paper.",
    subtitle:
      "Install YanShu once, then state the research job in Codex or a CLI. Each Skill resolves the same Prompt as the website and completes the work in the current task without opening a setup page or extra chat.",
    primaryAction: "See the three-step guide",
    secondaryAction: "Use the website without installing",
    demoLabel: "Actual launch flow",
    demoStatus: "Local workspace · Codex / CLI",
    demoSteps: ["State the task", "Verify materials", "Run directly"],
    demoFrames: [
      {
        label: "01 · CODEX TASK",
        title: "Start with one sentence",
        lines: [
          "Use $paper-reconstruction",
          "to reconstruct this paper directory.",
        ],
        footnote:
          "No flags to memorize; unspecified choices use the website defaults.",
      },
      {
        label: "02 · VERIFY MATERIALS",
        title: "Confirm only real inputs",
        lines: ["Locate the paper or experiment root", "Verify TeX, BibTeX, PDF, and result files"],
        footnote:
          "When several candidates exist, YanShu asks once, never guesses, and never opens internal JSON.",
      },
      {
        label: "03 · RUN IN PLACE",
        title: "Complete the workflow here",
        lines: [
          "Resolve the website-sourced Prompt internally",
          "Generate, compile, verify, and return",
        ],
        footnote:
          "No local page or new Chat; only material preferences are grouped into one question when necessary.",
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
    configureTitle: "Run directly in the current task",
    configureBody:
      "Skills execute directly in the current Codex or CLI task. The website remains available for inspecting and tuning Prompts, but plugin runs do not open it automatically.",
    workflowEyebrow: "START WITH ONE SENTENCE",
    workflowTitle: "Ten essential end-to-end entry points",
    workflowBody:
      "All ten independent sub-skills support $ invocation and execute in the current task. Website and plugin share one Prompt source.",
    inputLabel: "Prepare",
    outputLabel: "Receive",
    openWorkbench: "Open web tool",
    copyCommand: "Copy start phrase",
    copiedCommand: "Copied",
    modesEyebrow: "TWO WAYS TO USE",
    modesTitle: "Run automatically or copy only the Prompt",
    automaticTitle: "Install the plugin · end to end",
    automaticBody:
      "Best for local evidence, generated files, compilation, and automatic verification, all in the current Codex or CLI task.",
    manualTitle: "Open the website · manual",
    manualBody:
      "Best for adjusting a Prompt first or running it in any model yourself. The website never reads or uploads paper files.",
    boundary:
      "YanShu owns its Prompt, evidence boundaries, and validation. Unspecified choices use website defaults, and material ambiguity is grouped into at most one question. Always verify current venue rules on the official site.",
    installFailed: "Copy failed. Select the commands manually.",
  },
} as const;

export default function HomePage() {
  const [language, setLanguage] = usePersistentSiteLanguage();
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
                <strong>{language === "zh" ? "开始执行" : "Run"}</strong>
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
