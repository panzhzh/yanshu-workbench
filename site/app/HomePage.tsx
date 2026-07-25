"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PRODUCT_CONFIG, type Language } from "./config";
import SiteNavigation from "./SiteNavigation";

const HOME_COPY = {
  zh: {
    eyebrow: "CS RESEARCH WORKBENCH",
    title: "从实验完成，到论文可投稿。",
    subtitle:
      "把论文初稿、结构重构、科研绘图与投稿筛选拆成清楚、可配置、可直接复制的科研任务。",
    startDraft: "生成论文初稿",
    reconstruct: "重构现有论文",
    modulesEyebrow: "AVAILABLE WORKBENCHES",
    modulesTitle: "选择当前最需要完成的一步",
    modulesBody:
      "每个工作台只负责一个明确阶段；配置会实时写入右侧 Prompt，论文材料仍在你选择的模型对话中处理。",
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
          "重建标题、科学定位、章节叙事与字数预算，再完成投稿级精修。",
        href: "/reconstruction",
        meta: "会议 / 期刊 · 五步 Prompt",
      },
      {
        index: "03",
        title: "科研绘图",
        description:
          "从论文中生成引言图、方法总览或最关键的一张技术细节图。",
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
    flowTitle: "一条克制的工作路径",
    flow: ["准备证据", "配置边界", "复制 Prompt", "在模型中执行"],
    boundary:
      "研术台提供通用科研工作流，不把产品预设冒充任何 venue 的官方规则；投稿前始终以最新官网为准。",
  },
  en: {
    eyebrow: "CS RESEARCH WORKBENCH",
    title: "From completed experiments to a submission-ready paper.",
    subtitle:
      "Turn drafting, reconstruction, research figures, and venue targeting into focused, configurable, copy-ready research tasks.",
    startDraft: "Generate a paper draft",
    reconstruct: "Reconstruct an existing paper",
    modulesEyebrow: "AVAILABLE WORKBENCHES",
    modulesTitle: "Choose the step that matters now",
    modulesBody:
      "Each workbench owns one clear stage. Your settings update the prompt in real time, while paper files remain in the model conversation you choose.",
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
          "Rebuild title, scientific positioning, section narrative, and budgets before final refinement.",
        href: "/reconstruction",
        meta: "Conference / journal · five prompts",
      },
      {
        index: "03",
        title: "Research figures",
        description:
          "Generate an Introduction figure, Method Overview, or one decisive technical-detail figure.",
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
    flowTitle: "One restrained path",
    flow: ["Prepare evidence", "Set constraints", "Copy the prompt", "Run it in your model"],
    boundary:
      "YanShu provides general research workflows, never venue rules disguised as product presets. Always verify the latest official requirements before submission.",
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
