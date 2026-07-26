"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { RECONSTRUCTION_WORKFLOW_VERSION } from "../content/prompts/version";
import { PRODUCT_CONFIG, type Language } from "./config";
import SiteNavigation from "./SiteNavigation";

const HOME_COPY = {
  zh: {
    eyebrow: "CS RESEARCH WORKBENCH",
    title: "从实验完成，到论文可投稿。",
    subtitle:
      "把论文初稿、可恢复的五轮重构、科研绘图与投稿筛选，组织成清楚、可配置、可审计的科研任务。",
    startDraft: "生成论文初稿",
    reconstruct: "重构现有论文",
    releaseEyebrow: "PAPER RECONSTRUCTION",
    releaseStatus: "全流程已验证",
    releaseTitle: "五轮重构，现在可以从断点继续。",
    releaseBody:
      "官网配置、插件执行与每轮交付使用同一套 Prompt 规则。每一轮只接收上一轮的必要成果，并把可继续使用的完整论文资产交给下一轮。",
    releaseAction: "查看五轮重构工作台",
    releasePoints: [
      {
        title: "同一份 Prompt",
        description: "官网与插件逐字节同步；旧运行继续使用已保存快照。",
      },
      {
        title: "最小材料链",
        description: "按轮传递 TeX、完整 Bib 与 PDF，不重复上传已渲染配图。",
      },
      {
        title: "一次交接",
        description: "优先直接写入；回退时只需下载一个经过校验的 ZIP。",
      },
    ],
    modulesEyebrow: "AVAILABLE WORKBENCHES",
    modulesTitle: "选择当前最需要完成的一步",
    modulesBody:
      "每个工作台只负责一个明确阶段；配置实时写入 Prompt，长流程则保存轮次、材料与交付状态。",
    available: "已开放",
    open: "进入工作台",
    modules: [
      {
        index: "01",
        title: "论文初稿",
        description:
          "实验完成后，基于证据材料生成可编译的英文 LaTeX 初稿。",
        href: "/draft",
        meta: "arXiv 默认 · 顶会官方模板",
      },
      {
        index: "02",
        title: "论文重构",
        description:
          "用可恢复的五轮流程重建科学定位、结构、方法、实验、叙事与框架图。",
        href: "/reconstruction",
        meta: "官网同源 Prompt · 断点恢复",
      },
      {
        index: "03",
        title: "科研绘图",
        description:
          "从论文中生成引言图、方法总览或一张核心机制细节图。",
        href: "/figures",
        meta: "单图任务 · 精确术语",
      },
      {
        index: "04",
        title: "投稿策略",
        description:
          "建立期刊候选池，并核验范围、分区、收录、费用与文章类型。",
        href: "/submission",
        meta: "官网核验 · 动态筛选",
      },
    ],
    flowEyebrow: "HOW IT WORKS",
    flowTitle: "Prompt 与执行分层，规则始终一致",
    flow: ["准备证据", "配置边界", "选择复制或自动执行", "逐轮保存与恢复"],
    boundary:
      "论文文件始终在你选择的模型对话与本地工作区中处理。研术台不把产品预设冒充任何 venue 的官方规则；投稿前始终以最新官网为准。",
  },
  en: {
    eyebrow: "CS RESEARCH WORKBENCH",
    title: "From completed experiments to a submission-ready paper.",
    subtitle:
      "Turn drafting, resumable five-round reconstruction, research figures, and venue targeting into focused, configurable, auditable research tasks.",
    startDraft: "Generate a paper draft",
    reconstruct: "Reconstruct an existing paper",
    releaseEyebrow: "PAPER RECONSTRUCTION",
    releaseStatus: "End-to-end verified",
    releaseTitle: "Five rounds, now resumable from every checkpoint.",
    releaseBody:
      "Website configuration, plugin execution, and round handoffs now use the same prompt rules. Each round receives only the necessary outputs from the previous round and passes forward a complete, usable manuscript state.",
    releaseAction: "Open the five-round workbench",
    releasePoints: [
      {
        title: "One prompt source",
        description:
          "Website and plugin stay byte-identical; existing runs retain their saved snapshots.",
      },
      {
        title: "Minimal material chain",
        description:
          "Pass TeX, the complete Bib, and PDF by round without re-uploading rendered figures.",
      },
      {
        title: "One handoff",
        description:
          "Write artifacts directly when possible, or fall back to one validated ZIP.",
      },
    ],
    modulesEyebrow: "AVAILABLE WORKBENCHES",
    modulesTitle: "Choose the step that matters now",
    modulesBody:
      "Each workbench owns one clear stage. Settings update the prompt in real time, while long workflows preserve rounds, materials, and delivery state.",
    available: "Available",
    open: "Open workbench",
    modules: [
      {
        index: "01",
        title: "Paper draft",
        description:
          "Turn completed experiments and evidence into a compilable English LaTeX draft.",
        href: "/draft",
        meta: "arXiv default · official venue templates",
      },
      {
        index: "02",
        title: "Paper reconstruction",
        description:
          "Use a resumable five-round workflow to rebuild positioning, structure, methods, experiments, narrative, and the framework figure.",
        href: "/reconstruction",
        meta: "Website-synced prompts · resumable",
      },
      {
        index: "03",
        title: "Research figures",
        description:
          "Generate an Introduction figure, Method Overview, or one decisive Core Mechanism Detail figure.",
        href: "/figures",
        meta: "One image · exact terminology",
      },
      {
        index: "04",
        title: "Submission strategy",
        description:
          "Build and verify a journal pool by scope, rankings, indexing, fees, and article type.",
        href: "/submission",
        meta: "Official verification · live filters",
      },
    ],
    flowEyebrow: "HOW IT WORKS",
    flowTitle: "Separate prompting from execution, keep one rule set",
    flow: [
      "Prepare evidence",
      "Set constraints",
      "Choose copy or automatic execution",
      "Save and resume each round",
    ],
    boundary:
      "Paper files remain in the model conversation and local workspace you choose. YanShu provides general research workflows, never venue rules disguised as product presets. Always verify the latest official requirements before submission.",
  },
} as const;

export default function HomePage() {
  const [language, setLanguage] = useState<Language>(
    PRODUCT_CONFIG.defaultLanguage,
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const copy = HOME_COPY[language];

  useEffect(() => {
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
    document.body.dataset.language = language;
  }, [language]);

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
          <p className="eyebrow">{copy.eyebrow}</p>
          <h1>{copy.title}</h1>
          <p className="home-hero-copy">{copy.subtitle}</p>
          <div className="home-hero-actions">
            <Link className="primary-button" href="/draft">
              {copy.startDraft}
              <span aria-hidden="true">→</span>
            </Link>
            <Link className="home-secondary-link" href="/reconstruction">
              {copy.reconstruct}
            </Link>
          </div>
          <div className="home-notation" aria-hidden="true">
            <span>evidence</span>
            <i>→</i>
            <span>structure</span>
            <i>→</i>
            <span>manuscript</span>
          </div>
        </section>

        <section className="home-release" aria-labelledby="release-title">
          <div className="home-release-heading">
            <div>
              <p className="eyebrow">{copy.releaseEyebrow}</p>
              <div className="home-release-version">
                <span>Workflow {RECONSTRUCTION_WORKFLOW_VERSION}</span>
                <small>{copy.releaseStatus}</small>
              </div>
              <h2 id="release-title">{copy.releaseTitle}</h2>
            </div>
            <div className="home-release-intro">
              <p>{copy.releaseBody}</p>
              <Link href="/reconstruction">
                {copy.releaseAction}
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
          <div className="home-release-grid">
            {copy.releasePoints.map((point, index) => (
              <article key={point.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{point.title}</h3>
                <p>{point.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="home-modules">
          <div className="home-section-heading">
            <div>
              <p className="eyebrow">{copy.modulesEyebrow}</p>
              <h2>{copy.modulesTitle}</h2>
            </div>
            <p>{copy.modulesBody}</p>
          </div>
          <div className="home-module-grid">
            {copy.modules.map((module) => (
              <Link className="home-module-card" href={module.href} key={module.href}>
                <div className="home-module-meta">
                  <span>{module.index}</span>
                  <small>{copy.available}</small>
                </div>
                <h3>{module.title}</h3>
                <p>{module.description}</p>
                <div>
                  <small>{module.meta}</small>
                  <strong>
                    {copy.open}
                    <span aria-hidden="true">↗</span>
                  </strong>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="home-flow">
          <div>
            <p className="eyebrow">{copy.flowEyebrow}</p>
            <h2>{copy.flowTitle}</h2>
          </div>
          <ol>
            {copy.flow.map((step, index) => (
              <li key={step}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{step}</strong>
              </li>
            ))}
          </ol>
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
