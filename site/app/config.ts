import type {
  Language,
  LocalizedText,
  PaperStyleId,
} from "../content/prompts/types";
import {
  CHAT_REASONING_PREFERENCES,
  DEFAULT_CHAT_EXECUTION_PREFERENCES,
} from "../content/prompts/chatExecution";
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
  defaultIncludeSectionNavigationSentence: boolean;
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
  productNameEn: "YanShu",
  defaultLanguage: "zh" as Language,
  defaultPromptLanguage: "zh" as Language,
  defaultPaperStyle: "conference" as PaperStyleId,
  wordCount: {
    defaultMode: "target" as const,
    defaultUnlimitedCoreSections: true,
    unlimitedSectionIds: WORD_COUNT_POLICY.unlimitedCoreSectionIds,
    visualWordEquivalent: WORD_COUNT_POLICY.visualWordEquivalent,
    min: 2000,
    max: 20000,
    step: 100,
  },
  titleBrand: {
    defaultAllowCandidates: false,
  },
  chatExecution: {
    default: DEFAULT_CHAT_EXECUTION_PREFERENCES,
    reasoningPreferences: CHAT_REASONING_PREFERENCES,
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
        zh: "高密度、claim-first：段落功能集中、过渡简短，优先保留核心机制与决定性证据。",
        en: "Dense and claim-first, with focused paragraphs, short transitions, and priority given to core mechanisms and decisive evidence.",
      },
      defaultTargetWords: 4500,
      defaultAppendix: true,
      defaultIncludeSectionNavigationSentence: false,
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
        zh: "只为内容充足且科学上独立的单元设置标题；第三层需要标题时使用 paragraph。Related Work 每小节单段，Method 不单设 Overview。",
        en: "Create headings only for scientifically distinct units with enough substance; use paragraph when a third level is genuinely needed. Keep one paragraph per Related Work subsection and no standalone Method Overview.",
      },
      emphasisNote: {
        zh: "优先保证贡献辨识度、基线公平性、消融实验和可复现细节。",
        en: "Prioritize contribution clarity, fair baselines, ablations, and reproducibility details.",
      },
      plannerSummary: {
        zh: "第三层使用 paragraph 而非 subsubsection；引言 480 词，讨论与局限占 10%，结论 200 词，Method 不单设 Overview。",
        en: "Use paragraph rather than subsubsection for third-level headings; 480-word Introduction, 10% Discussion & Limitations, 200-word Conclusion, and no standalone Method Overview.",
      },
      promptDirective: {
        zh: "采用高密度、claim-first 的会议写法：尽早建立问题—方法—证据闭环，每段承担一个主要论证功能，过渡简短但自然。只为内容充足且科学上独立的单元设置标题；普通论述、局部动机和逐图解释保留在连续正文中。Related Work 每小节单段，Method 不单设 Overview；不以压缩核心 Method 或 Experiments and Results 换取表面简洁。",
        en: "Use a dense, claim-first conference style: establish the problem–method–evidence loop early, give each paragraph one main argumentative function, and keep transitions brief but natural. Create a heading only for a scientifically distinct unit with enough substance; keep local motivation and per-visual interpretation in continuous prose. Use one paragraph per Related Work subsection and no standalone Method Overview. Never obtain superficial brevity by compressing core Method or Experiments & Results content.",
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
            zh: "由论文内容决定 3–5 个讨论与局限主题，不复述实验结果。",
            en: "Let the paper determine three to five discussion-and-limitation themes without repeating results.",
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
        zh: "累积论证、解释充分：扩展研究脉络、机制理由与适用边界，同时保持克制和证据密度。",
        en: "Cumulative and explanatory, with fuller positioning, mechanism rationale, and scope boundaries while remaining restrained and evidence-dense.",
      },
      defaultTargetWords: 5000,
      defaultAppendix: false,
      defaultIncludeSectionNavigationSentence: true,
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
        zh: "目录层级通常止于 subsubsection，但只有内容充足且科学上独立时才增加标题。Method 单设不超过 80 词的双段 Overview。",
        en: "Usually stop at subsubsection, but add a heading only for a scientifically distinct unit with enough substance. Use a standalone two-paragraph Method Overview capped at 80 words.",
      },
      emphasisNote: {
        zh: "优先保证理论与经验论证的完整性、方法透明度和对既有研究的累积贡献。",
        en: "Prioritize complete theoretical and empirical argumentation, methodological transparency, and cumulative contribution.",
      },
      plannerSummary: {
        zh: "目录层级默认止于 subsubsection；保留双段 Overview，并扩展文献定位、方法细节与讨论。",
        en: "Stop the heading hierarchy at subsubsection by default; retain a two-paragraph Overview and deepen positioning, methods, and discussion.",
      },
      promptDirective: {
        zh: "采用累积论证型期刊写法：给予研究脉络、机制理由、证据边界和综合讨论充分空间，并用清楚过渡连接段落。目录通常止于 subsubsection，但只为内容充足且科学上独立的单元增加标题；局部动机和逐图解释留在正文。Method 单设两个普通段落且不超过 80 词的 Overview，不复述框架图；不压缩核心 Method 或 Experiments and Results。",
        en: "Use a cumulative journal style with sufficient space for positioning, mechanism rationale, evidence boundaries, and synthesis, connected by clear paragraph transitions. Usually stop at subsubsection, but create a heading only for a scientifically distinct unit with enough substance; keep local motivation and per-visual interpretation in prose. Give Method a standalone two-paragraph Overview capped at 80 words without narrating the framework figure, and do not compress core Method or Experiments & Results content.",
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
    comingSoon: "即将推出",
    configEyebrow: "PAPER RECONSTRUCTION",
    title: "论文重构",
    subtitle: "选择论文类型、建议正文篇幅与附录规则，再使用五步 Prompt 完成深度精修。",
    generalPreset: "通用产品预设 · 非 venue 官方要求",
    language: "网站语言",
    chinese: "中文",
    english: "English",
    paperStyle: "论文风格",
    targetWords: "建议正文字数",
    targetWordsHint:
      "开启后显示建议章节预算；附录不计入正文，每张表格或图片按 200 词折算。",
    wordLimitOn: "提供建议字数",
    wordLimitOff: "不设篇幅建议",
    noWordLimitHint:
      "关闭后不显示章节预算，五步 Prompt 也不包含正文总数或章节篇幅建议。",
    introNavigation: "Introduction 纯章节导航句",
    introNavigationOn: "保留一条简洁导航句",
    introNavigationOff: "不写纯章节导航句",
    introNavigationHint:
      "会议默认关闭，期刊默认开启；只说明章节组织，不重复各节内容。",
    titleBrandCandidates: "标题与品牌候选",
    titleBrandCandidatesOn: "允许在报告中提出候选",
    titleBrandCandidatesOff: "默认保留原标题与缩写",
    titleBrandCandidatesHint:
      "候选不会被自动写入论文；任何变更都必须由作者明确选择，并生成 high-risk diff。",
    words: "词",
    appendix: "附录设置",
    appendixOn: "允许附录",
    appendixOff: "不含附录",
    frameworkFigure: "总体框架图",
    frameworkRatio: "画布比例",
    frameworkCustomWidth: "宽",
    frameworkCustomHeight: "高",
    frameworkFixedRules:
      "其余规则采用方法总览推荐配置：纯白画布；Tol 鲜明色系，按语义从 2–4 种强调色中选择最少够用数量；Calibri；关键区域极浅底色；三级字号；无大标题；深色中性线；可按需使用与论文对象直接对应的简化科学图形，不使用人物漫画、吉祥物或营销插画。",
    chatExecution: "ChatGPT 执行",
    chatModelPolicy: "模型策略",
    chatLatestVisibleModel: "最新可用推理模型",
    chatReasoningPreference: "推理等级",
    chatPollingInterval: "结果检查间隔",
    chatPollingAuto:
      "按实际档位自动采用：Medium / High 1 分钟，Extra High 3 分钟，Pro 5 分钟；无法识别时按 1 分钟。",
    chatRuntimePolicy:
      "不锁定 GPT 型号名称；插件每轮读取 ChatGPT 当前可见选项。发生回退时先明确提示，名称无法判断时选择最强可用档位。",
    exportAutomation: "导出桌面配置",
    exportedAutomation: "配置已下载",
    exportAutomationHint:
      "下载当前论文类型、字数、章节、附录、框架图、ChatGPT 推理偏好和 Prompt 语言设置，供 YanShu 插件直接读取。",
    resetDefaults: "恢复默认配置",
    resetHint:
      "重置论文类型、正文字数模式、附录、框架图、ChatGPT 推理偏好和章节预算；保留当前语言。",
    plannerTitle: "建议正文与章节预算",
    plannerBody:
      "设置建议篇幅；方法和实验默认不设字数范围。",
    targetTotal: "建议正文总字数",
    unlimitedMainText: "正文总数不限",
    limitedSectionsTotal: "受限章节合计",
    unlimitedCoreSections: "不限制方法和实验的字数",
    unlimitedCoreSectionsHint: "开启后正文不设总数，仅为其他章节提供建议范围。",
    unlimitedSection: "不限",
    visualCountingRule:
      `计词规则：每张表格或图片按 ${WORD_COUNT_POLICY.visualWordEquivalent} 词计入所在章节及正文总数。`,
    resetAllocation: "按比例重算",
    presetAllocation: "预设比例",
    customAllocation: "自定义分配",
    budget: "字数预算",
    editAllocation: "编辑章节",
    hideAllocation: "收起",
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
    comingSoon: "Coming soon",
    configEyebrow: "PAPER RECONSTRUCTION",
    title: "Paper reconstruction",
    subtitle:
      "Choose the paper type, suggested main-text length, appendix rule, and overview layout, then deeply refine the manuscript with five prompts.",
    generalPreset: "General product preset · not an official venue rule",
    language: "Site language",
    chinese: "中文",
    english: "English",
    paperStyle: "Paper style",
    targetWords: "Suggested main-text length",
    targetWordsHint:
      "When enabled, suggested section budgets appear. The appendix is excluded; each table or figure counts as 200 words.",
    wordLimitOn: "Provide a length target",
    wordLimitOff: "No length recommendation",
    noWordLimitHint:
      "When disabled, section budgets are hidden and all five prompts omit main-text and section-length recommendations.",
    introNavigation: "Pure Introduction roadmap sentence",
    introNavigationOn: "Include one concise roadmap sentence",
    introNavigationOff: "No pure roadmap sentence",
    introNavigationHint:
      "Off by default for conferences and on for journals; it states organization only and does not summarize sections.",
    titleBrandCandidates: "Title and brand candidates",
    titleBrandCandidatesOn: "Allow candidates in the report",
    titleBrandCandidatesOff: "Preserve the current title and acronym",
    titleBrandCandidatesHint:
      "Candidates are never applied automatically. Any change requires explicit author selection and a high-risk diff.",
    words: "words",
    appendix: "Appendix",
    appendixOn: "Appendix allowed",
    appendixOff: "No appendix",
    frameworkFigure: "Overall framework figure",
    frameworkRatio: "Canvas ratio",
    frameworkCustomWidth: "Width",
    frameworkCustomHeight: "Height",
    frameworkFixedRules:
      "All other controls use the Method Overview recommendation: a pure-white canvas; Tol Vibrant with the smallest sufficient set from a 2–4 accent range; Calibri; extremely pale fills for key regions; three type-size levels; no large title; dark-neutral lines; restrained paper-specific scientific forms when useful, with no character cartoons, mascots, or marketing illustration.",
    chatExecution: "ChatGPT execution",
    chatModelPolicy: "Model policy",
    chatLatestVisibleModel: "Latest available reasoning model",
    chatReasoningPreference: "Reasoning level",
    chatPollingInterval: "Result-check interval",
    chatPollingAuto:
      "Resolved from the level actually selected: Medium / High 1 minute, Extra High 3 minutes, and Pro 5 minutes; unknown labels use 1 minute.",
    chatRuntimePolicy:
      "GPT model names are never pinned. The plugin inspects the options currently visible in ChatGPT for every round, announces any fallback, and chooses the strongest available level when labels cannot be interpreted.",
    exportAutomation: "Export desktop config",
    exportedAutomation: "Config downloaded",
    exportAutomationHint:
      "Download the current paper type, length, section, appendix, framework-figure, ChatGPT reasoning preference, and prompt-language settings for the YanShu plugin.",
    resetDefaults: "Restore defaults",
    resetHint:
      "Resets paper type, length mode, appendix, framework figure, ChatGPT reasoning preference, and section budgets while keeping the current language.",
    plannerTitle: "Suggested main-text and section lengths",
    plannerBody:
      "Set suggested lengths; Method and Experiments are unlimited by default.",
    targetTotal: "Suggested main-text total",
    unlimitedMainText: "No main-text total",
    limitedSectionsTotal: "Limited sections",
    unlimitedCoreSections: "Do not limit Method or Experiments",
    unlimitedCoreSectionsHint:
      "When enabled, there is no main-text total and only the other sections receive suggested ranges.",
    unlimitedSection: "Unlimited",
    visualCountingRule:
      `Counting rule: each table or figure counts as ${WORD_COUNT_POLICY.visualWordEquivalent} words toward its section and the main-text total.`,
    resetAllocation: "Recalculate by ratio",
    presetAllocation: "Preset ratios",
    customAllocation: "Custom allocation",
    budget: "Word budget",
    editAllocation: "Edit sections",
    hideAllocation: "Collapse",
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
