import type {
  Language,
  LocalizedText,
  PaperStyleId,
} from "../content/prompts/types";
import { WORD_COUNT_POLICY } from "../content/prompts/wordCountPolicy";

export type { Language, LocalizedText, PaperStyleId };

export interface SectionDefinition {
  id: string;
  label: LocalizedText;
  shortLabel: LocalizedText;
  description: LocalizedText;
  ratio: number;
}

export interface PaperStylePreset {
  id: PaperStyleId;
  label: LocalizedText;
  shortLabel: LocalizedText;
  description: LocalizedText;
  defaultTargetWords: number;
  defaultAppendix: boolean;
  appendixRule: {
    enabled: LocalizedText;
    disabled: LocalizedText;
  };
  structureNote: LocalizedText;
  emphasisNote: LocalizedText;
  plannerSummary: LocalizedText;
  promptDirective: LocalizedText;
  sections: SectionDefinition[];
}

export const PRODUCT_CONFIG = {
  productName: "研术台",
  productNameEn: "YanShu Workbench",
  defaultLanguage: "zh" as Language,
  defaultPromptLanguage: "zh" as Language,
  defaultPaperStyle: "conference" as PaperStyleId,
  wordCount: {
    defaultMode: "target" as const,
    defaultUnlimitedCoreSections: false,
    unlimitedSectionIds: WORD_COUNT_POLICY.unlimitedCoreSectionIds,
    visualWordEquivalent: WORD_COUNT_POLICY.visualWordEquivalent,
    min: 2000,
    max: 20000,
    step: 100,
  },
  paperStyles: {
    conference: {
      id: "conference",
      label: {
        zh: "会议",
        en: "Conference",
      },
      shortLabel: {
        zh: "会议",
        en: "Conference",
      },
      description: {
        zh: "面向篇幅紧凑、贡献密度高的会议论文，强调问题、方法与实验结论的快速闭环。",
        en: "For compact conference papers with dense contributions and a fast problem–method–evidence loop.",
      },
      defaultTargetWords: 4500,
      defaultAppendix: true,
      appendixRule: {
        enabled: {
          zh: "允许附录，但正文满足当前适用的总量与章节预算时不得使用；仅在受限章节仍超额且逐项确认内容非主线必需后，才可移入附录。附录不计入正文字数且字数不限。",
          en: "Appendix permitted, but do not use it when the main text meets every applicable total and section budget. Move material only when a limited section remains over budget and itemized review confirms it is not essential to the throughline. The appendix is excluded from the main-text count and unlimited.",
        },
        disabled: {
          zh: "不使用附录。关键方法、实验细节与限制必须在正文预算内完成交代。",
          en: "No appendix. Essential method details, experimental evidence, and limitations must fit within the main-text budget.",
        },
      },
      structureNote: {
        zh: "层级采用 section → subsection → paragraph；Related Work 每小节单段，Method 不单设 Overview。",
        en: "Use section → subsection → paragraph; keep one paragraph per Related Work subsection and no standalone Method Overview.",
      },
      emphasisNote: {
        zh: "优先保证贡献辨识度、基线公平性、消融实验和可复现细节。",
        en: "Prioritize contribution clarity, fair baselines, ablations, and reproducibility details.",
      },
      plannerSummary: {
        zh: "section → subsection → paragraph；引言 480 词，讨论与局限占 10%，结论 200 词，Method 不单设 Overview。",
        en: "section → subsection → paragraph; 480-word Introduction, 10% Discussion & Limitations, 200-word Conclusion, and no standalone Method Overview.",
      },
      promptDirective: {
        zh: "采用紧凑的问题—方法—证据闭环和 section → subsection → paragraph 层级；Related Work 每个小节只写一个普通段落，Method 不单设 Overview，并优先保证必要机制、公平比较、关键消融和可复现信息。",
        en: "Use a compact problem–method–evidence loop and section → subsection → paragraph hierarchy; write one ordinary paragraph per Related Work subsection, omit a standalone Method Overview, and prioritize necessary mechanisms, fair comparisons, decisive ablations, and reproducibility.",
      },
      sections: [
        {
          id: "abstract",
          label: { zh: "摘要", en: "Abstract" },
          shortLabel: { zh: "摘要", en: "Abstract" },
          description: {
            zh: "用一个连续段落概括问题、方法、证据和边界。",
            en: "Summarize the problem, method, evidence, and boundary in one continuous paragraph.",
          },
          ratio: 0.04,
        },
        {
          id: "introduction",
          label: { zh: "引言", en: "Introduction" },
          shortLabel: { zh: "引言", en: "Intro" },
          description: {
            zh: "问题背景、研究缺口、核心思路与贡献列表。",
            en: "Problem context, research gap, central idea, and contribution list.",
          },
          ratio: 0.10666666666666667,
        },
        {
          id: "related-work",
          label: { zh: "相关工作", en: "Related Work" },
          shortLabel: { zh: "相关", en: "Related" },
          description: {
            zh: "三个小节，每小节一个普通段落，只保留定位所需脉络。",
            en: "Three subsections with one ordinary paragraph each, limited to positioning-essential literature.",
          },
          ratio: 0.08,
        },
        {
          id: "method",
          label: { zh: "方法", en: "Method" },
          shortLabel: { zh: "方法", en: "Method" },
          description: {
            zh: "形式化问题、方法设计、关键机制与复杂度。",
            en: "Problem formulation, design, key mechanisms, and complexity.",
          },
          ratio: 0.27,
        },
        {
          id: "experiments-results",
          label: { zh: "实验与结果", en: "Experiments & Results" },
          shortLabel: { zh: "实验", en: "Experiments" },
          description: {
            zh: "实验设置、主结果、关键消融、稳健性和误差分析。",
            en: "Experimental setup, main results, decisive ablations, robustness, and error analysis.",
          },
          ratio: 0.35888888888888887,
        },
        {
          id: "discussion",
          label: { zh: "讨论与局限", en: "Discussion & Limitations" },
          shortLabel: { zh: "讨论", en: "Discussion" },
          description: {
            zh: "三个讨论小节加一个约 100 词的局限小节，不复述实验结果。",
            en: "Three discussion subsections plus an approximately 100-word Limitations subsection, without repeating results.",
          },
          ratio: 0.1,
        },
        {
          id: "conclusion",
          label: { zh: "结论", en: "Conclusion" },
          shortLabel: { zh: "结论", en: "Conclusion" },
          description: {
            zh: "回收问题、证据与最重要的可验证结论。",
            en: "Close the loop between the problem, evidence, and the most defensible conclusion.",
          },
          ratio: 0.044444444444444446,
        },
      ],
    },
    journal: {
      id: "journal",
      label: {
        zh: "期刊",
        en: "Journal",
      },
      shortLabel: {
        zh: "期刊",
        en: "Journal",
      },
      description: {
        zh: "面向论证充分、文献定位完整的期刊论文，强调研究脉络、方法细节与讨论深度。",
        en: "For fully argued journal articles with broader positioning, detailed methods, and deeper discussion.",
      },
      defaultTargetWords: 5000,
      defaultAppendix: false,
      appendixRule: {
        enabled: {
          zh: "允许附录，但正文满足当前适用的总量与章节预算时不得使用；只有受限章节仍超额且逐项确认内容不影响复现、结论判断与科学主线时，才可移入附录。附录不计入正文字数且字数不限。",
          en: "Appendix permitted, but do not use it when the main text meets every applicable total and section budget. Move material only when a limited section remains over budget and itemized review confirms that reproducibility, claim assessment, and the scientific throughline remain intact. The appendix is excluded from the main-text count and unlimited.",
        },
        disabled: {
          zh: "默认不设附录。研究背景、方法细节、稳健性分析和局限应整合进正文。",
          en: "No appendix by default. Integrate research context, methodological detail, robustness checks, and limitations into the main text.",
        },
      },
      structureNote: {
        zh: "层级采用 section → subsection → subsubsection → paragraph；Method 单设不超过 80 词的双段 Overview。",
        en: "Use section → subsection → subsubsection → paragraph, with a standalone two-paragraph Method Overview capped at 80 words.",
      },
      emphasisNote: {
        zh: "优先保证理论与经验论证的完整性、方法透明度和对既有研究的累积贡献。",
        en: "Prioritize complete theoretical and empirical argumentation, methodological transparency, and cumulative contribution.",
      },
      plannerSummary: {
        zh: "section → subsection → subsubsection → paragraph；保留双段 Overview，并扩展文献定位、方法细节与讨论。",
        en: "section → subsection → subsubsection → paragraph; retain a two-paragraph Overview and deepen positioning, methods, and discussion.",
      },
      promptDirective: {
        zh: "采用 section → subsection → subsubsection → paragraph 层级和更完整的累积论证；Method 单设两个普通段落且不超过 80 词的 Overview，不复述框架图，并扩展研究定位、方法透明度、稳健性与独立讨论。",
        en: "Use a section → subsection → subsubsection → paragraph hierarchy and a fuller cumulative argument; give Method a standalone two-paragraph Overview capped at 80 words without narrating the framework figure, and deepen positioning, transparency, robustness, and discussion.",
      },
      sections: [
        {
          id: "abstract",
          label: { zh: "摘要", en: "Abstract" },
          shortLabel: { zh: "摘要", en: "Abstract" },
          description: {
            zh: "概括问题范围、方法、主要证据与可推广边界。",
            en: "Summarize the problem scope, method, primary evidence, and generalization boundary.",
          },
          ratio: 0.04,
        },
        {
          id: "introduction",
          label: { zh: "引言", en: "Introduction" },
          shortLabel: { zh: "引言", en: "Intro" },
          description: {
            zh: "问题背景、研究缺口、研究问题与总体贡献。",
            en: "Problem context, research gap, research questions, and overall contribution.",
          },
          ratio: 0.104,
        },
        {
          id: "related-work",
          label: { zh: "相关工作", en: "Related Work" },
          shortLabel: { zh: "相关", en: "Related" },
          description: {
            zh: "系统组织研究脉络、理论连接与差异化定位。",
            en: "Organize the research landscape, theoretical links, and differentiated positioning.",
          },
          ratio: 0.09,
        },
        {
          id: "method",
          label: { zh: "方法", en: "Method" },
          shortLabel: { zh: "方法", en: "Method" },
          description: {
            zh: "完整呈现假设、形式化设计、实现和有效性依据。",
            en: "Present assumptions, formal design, implementation, and validity rationale in full.",
          },
          ratio: 0.3,
        },
        {
          id: "experiments-results",
          label: { zh: "实验与结果", en: "Experiments & Results" },
          shortLabel: { zh: "实验", en: "Experiments" },
          description: {
            zh: "实验设置、主结果、稳健性、消融与补充分析。",
            en: "Experimental setup, main results, robustness, ablations, and supplementary analyses.",
          },
          ratio: 0.33,
        },
        {
          id: "discussion",
          label: { zh: "讨论与局限", en: "Discussion & Limitations" },
          shortLabel: { zh: "讨论", en: "Discussion" },
          description: {
            zh: "解释机制、理论意义、外部效度、局限与未来研究。",
            en: "Mechanisms, theoretical implications, external validity, limitations, and future work.",
          },
          ratio: 0.096,
        },
        {
          id: "conclusion",
          label: { zh: "结论", en: "Conclusion" },
          shortLabel: { zh: "结论", en: "Conclusion" },
          description: {
            zh: "凝练回答研究问题并明确可被证据支持的贡献。",
            en: "Answer the research questions concisely and state only evidence-supported contributions.",
          },
          ratio: 0.04,
        },
      ],
    },
  } satisfies Record<PaperStyleId, PaperStylePreset>,
} as const;

export const UI_COPY = {
  zh: {
    productTagline: "CS 科研方法与交互式工作台",
    version: "首版 · CS",
    mobileMenu: "打开导航",
    closeMenu: "关闭导航",
    resizePromptRail: "拖动调整 Prompt 栏宽度",
    resetPromptRail: "双击恢复为 40%",
    skipToContent: "跳到正文",
    navLabel: "站点导航",
    navDirectory: "导航",
    navHome: "首页",
    navDraft: "论文初稿",
    navReconstruction: "论文重构",
    navFigures: "科研绘图",
    navSubmission: "投稿策略",
    navAbout: "关于研术台",
    comingSoon: "即将推出",
    configEyebrow: "PAPER RECONSTRUCTION",
    title: "论文重构",
    subtitle: "选择论文类型、正文字数限制与附录规则，再使用五步真实 Prompt 完成重构。",
    generalPreset: "通用产品预设 · 非 venue 官方要求",
    language: "网站语言",
    chinese: "中文",
    english: "English",
    paperStyle: "论文风格",
    targetWords: "正文字数限制",
    targetWordsHint:
      "开启后显示 04；附录不计入正文，每张表格或图片按 200 词计入。",
    wordLimitOn: "限制正文字数",
    wordLimitOff: "无特殊规定",
    noWordLimitHint:
      "关闭后不显示 04，五步 Prompt 也不包含正文总数或章节预算。",
    words: "词",
    appendix: "附录设置",
    appendixOn: "允许附录",
    appendixOff: "不含附录",
    exportAutomation: "导出桌面配置",
    exportedAutomation: "配置已下载",
    exportAutomationHint:
      "下载当前论文类型、字数、章节、附录和 Prompt 语言设置，供研术台插件直接读取。",
    resetDefaults: "恢复默认配置",
    resetHint: "重置论文类型、正文字数模式、附录和章节预算；保留当前语言。",
    plannerTitle: "正文与章节预算",
    plannerBody:
      "设置正文与章节预算；可单独取消方法和实验的字数限制。",
    targetTotal: "正文总字数",
    unlimitedMainText: "正文总数不限",
    limitedSectionsTotal: "受限章节合计",
    unlimitedCoreSections: "不限制方法和实验的字数",
    unlimitedCoreSectionsHint: "开启后正文不设总字数，只限制其他章节。",
    unlimitedSection: "不限",
    visualCountingRule:
      `计词规则：每张表格或图片按 ${WORD_COUNT_POLICY.visualWordEquivalent} 词计入所在章节及正文总数。`,
    resetAllocation: "按比例重算",
    presetAllocation: "预设比例",
    customAllocation: "自定义分配",
    budget: "字数预算",
    editAllocation: "编辑章节",
    hideAllocation: "收起",
    workflowEyebrow: "RECONSTRUCTION WORKFLOW",
    workflowTitle: "五步重构工作流",
    workflowBody:
      "五份真实模板已整理为可配置 Prompt；第四步复用科研绘图规则，只重构方法总览框架图。",
    placeholder: "真实 Prompt",
    expand: "展开",
    collapse: "收起",
    copy: "复制",
    copied: "已复制",
    switchPromptLanguage: "切换 Prompt 语言",
    copyAll: "复制全部",
    copiedAll: "已复制全部",
    reconfigure: "重新配置",
    promptConfig: "当前配置",
    promptStyle: "写作模式",
    promptTarget: "正文目标",
    promptAppendix: "附录",
    promptSections: "章节预算",
    promptTask: "本轮任务",
    promptOutput: "输出要求",
    promptBoundary:
      "边界：不要虚构事实、引用、数据或 venue 规则；无法确认的内容必须明确标记。",
    github: "GitHub 项目",
    clipboardError: "复制失败，请展开后手动选择文本。",
  },
  en: {
    productTagline: "Research methods and an interactive CS workbench",
    version: "V1 · CS",
    mobileMenu: "Open navigation",
    closeMenu: "Close navigation",
    resizePromptRail: "Drag to resize the prompt panel",
    resetPromptRail: "Double-click to restore 40%",
    skipToContent: "Skip to content",
    navLabel: "Site navigation",
    navDirectory: "Navigation",
    navHome: "Home",
    navDraft: "Paper draft",
    navReconstruction: "Paper reconstruction",
    navFigures: "Research figures",
    navSubmission: "Submission strategy",
    navAbout: "About YanShu",
    comingSoon: "Coming soon",
    configEyebrow: "PAPER RECONSTRUCTION",
    title: "Paper reconstruction",
    subtitle:
      "Choose the paper type, main-text limit, and appendix rule, then reconstruct the manuscript with four production prompts.",
    generalPreset: "General product preset · not an official venue rule",
    language: "Site language",
    chinese: "中文",
    english: "English",
    paperStyle: "Paper style",
    targetWords: "Main-text word limit",
    targetWordsHint:
      "When enabled, section 04 appears. The appendix is excluded; each table or figure counts as 200 words.",
    wordLimitOn: "Apply a word limit",
    wordLimitOff: "No special limit",
    noWordLimitHint:
      "When disabled, section 04 is hidden and all five prompts omit the main-text total and section budgets.",
    words: "words",
    appendix: "Appendix",
    appendixOn: "Appendix allowed",
    appendixOff: "No appendix",
    exportAutomation: "Export desktop config",
    exportedAutomation: "Config downloaded",
    exportAutomationHint:
      "Download the current paper type, length, section, appendix, and prompt-language settings for the YanShu plugin.",
    resetDefaults: "Restore defaults",
    resetHint: "Resets paper type, length mode, appendix, and section budgets while keeping the current language.",
    plannerTitle: "Main-text and section budgets",
    plannerBody:
      "Set main-text and section budgets, with an independent unlimited mode for Method and Experiments.",
    targetTotal: "Main-text total",
    unlimitedMainText: "No main-text total",
    limitedSectionsTotal: "Limited sections",
    unlimitedCoreSections: "Do not limit Method or Experiments",
    unlimitedCoreSectionsHint:
      "When enabled, there is no main-text total; only the other sections are limited.",
    unlimitedSection: "Unlimited",
    visualCountingRule:
      `Counting rule: each table or figure counts as ${WORD_COUNT_POLICY.visualWordEquivalent} words toward its section and the main-text total.`,
    resetAllocation: "Recalculate by ratio",
    presetAllocation: "Preset ratios",
    customAllocation: "Custom allocation",
    budget: "Word budget",
    editAllocation: "Edit sections",
    hideAllocation: "Collapse",
    workflowEyebrow: "RECONSTRUCTION WORKFLOW",
    workflowTitle: "Five-step reconstruction workflow",
    workflowBody:
      "Five source templates are production prompts. Step 4 reuses the research-figure rules and reconstructs only the Method Overview figure.",
    placeholder: "Live prompt",
    expand: "Expand",
    collapse: "Collapse",
    copy: "Copy",
    copied: "Copied",
    switchPromptLanguage: "Switch prompt language",
    copyAll: "Copy all",
    copiedAll: "All copied",
    reconfigure: "Reconfigure",
    promptConfig: "Current configuration",
    promptStyle: "Writing mode",
    promptTarget: "Main-text target",
    promptAppendix: "Appendix",
    promptSections: "Section budgets",
    promptTask: "Task for this round",
    promptOutput: "Required output",
    promptBoundary:
      "Boundary: do not invent facts, citations, data, or venue rules. Mark anything that cannot be verified.",
    github: "GitHub repository",
    clipboardError: "Copy failed. Expand the card and select the text manually.",
  },
} as const;
