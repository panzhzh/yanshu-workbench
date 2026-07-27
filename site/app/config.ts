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
    defaultMode: "none" as "none" | "target",
    defaultUnlimitedCoreSections: true,
    unlimitedSectionIds: WORD_COUNT_POLICY.unlimitedCoreSectionIds,
    visualWordEquivalent: WORD_COUNT_POLICY.visualWordEquivalent,
    min: 2000,
    max: 20000,
    step: 100,
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
          zh: "允许附录，但不能只为命中建议字数而转移内容。正文已经清楚、完整且结构紧凑时无需附录；只有材料本身确属补充内容、放入正文会削弱主线时才移入。附录不计入正文建议字数。",
          en: "An appendix is allowed, but never move content merely to hit a suggested length. Omit it when the main text is clear, complete, and focused; move material only when it is genuinely supplementary and would weaken the throughline in the main text. The appendix is excluded from suggested main-text length.",
        },
        disabled: {
          zh: "不使用附录。关键方法、实验细节与局限应完整保留在正文；必要时可以偏离建议篇幅，不得为凑字数删除核心内容。",
          en: "No appendix. Keep essential method details, experimental evidence, and limitations complete in the main text; deviate from suggested lengths when necessary rather than deleting core content.",
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
        zh: "第三层使用 paragraph 而非 subsubsection；建议引言约 480 词、讨论与局限约占 10%、结论约 200 词，Method 不单设 Overview。",
        en: "Use paragraph rather than subsubsection for third-level headings; suggested references are about 480 words for Introduction, 10% for Discussion & Limitations, and 200 words for Conclusion, with no standalone Method Overview.",
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
            en: "Three subsections with one ordinary paragraph each, focused on positioning-essential literature.",
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
          zh: "允许附录，但不能只为命中建议字数而转移内容。正文已经清楚、完整且结构紧凑时无需附录；只有材料本身确属补充内容，且移动后不影响复现、结论判断与科学主线时才移入。附录不计入正文建议字数。",
          en: "An appendix is allowed, but never move content merely to hit a suggested length. Omit it when the main text is clear, complete, and focused; move material only when it is genuinely supplementary and reproducibility, claim assessment, and the scientific throughline remain intact. The appendix is excluded from suggested main-text length.",
        },
        disabled: {
          zh: "默认不设附录。研究背景、方法细节、稳健性分析和局限应整合进正文。",
          en: "No appendix by default. Integrate research context, methodological detail, robustness checks, and limitations into the main text.",
        },
      },
      structureNote: {
        zh: "目录层级通常止于 subsubsection，但只有内容充足且科学上独立时才增加标题。Method 单设双段 Overview，建议控制在 80 词左右。",
        en: "Usually stop at subsubsection, but add a heading only for a scientifically distinct unit with enough substance. Use a standalone two-paragraph Method Overview, with about 80 words as an optional reference.",
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
        zh: "采用累积论证型期刊写法：给予研究脉络、机制理由、证据边界和综合讨论充分空间，并用清楚过渡连接段落。目录通常止于 subsubsection，但只为内容充足且科学上独立的单元增加标题；局部动机和逐图解释留在正文。Method 单设两个普通段落的 Overview，建议约 80 词且不复述框架图；不压缩核心 Method 或 Experiments and Results。",
        en: "Use a cumulative journal style with sufficient space for positioning, mechanism rationale, evidence boundaries, and synthesis, connected by clear paragraph transitions. Usually stop at subsubsection, but create a heading only for a scientifically distinct unit with enough substance; keep local motivation and per-visual interpretation in prose. Give Method a standalone two-paragraph Overview, using about 80 words as an optional reference without narrating the framework figure, and do not compress core Method or Experiments & Results content.",
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
    subtitle: "选择论文类型、可选篇幅建议与附录规则，再使用五步 Prompt 完成深度精修。",
    generalPreset: "通用产品预设 · 非 venue 官方要求",
    language: "网站语言",
    chinese: "中文",
    english: "English",
    paperStyle: "论文风格",
    targetWords: "建议正文参考值",
    targetWordsHint:
      "开启后显示可选章节建议；可根据论文内容采纳、调整或忽略。附录不计入正文，每张表格或图片按 200 词估算。",
    wordLimitOn: "启用篇幅建议",
    wordLimitOff: "默认不设篇幅建议",
    noWordLimitHint:
      "默认状态。关闭后不显示章节建议，五步 Prompt 也不包含正文总数或章节篇幅数字。",
    introNavigation: "Introduction 章节导航段",
    introNavigationOn: "保留约 65 词导航段",
    introNavigationOff: "不写章节导航段",
    introNavigationHint:
      "会议默认关闭，期刊默认开启；启用时约 65 词、单独成段且不计入 Introduction 建议字数。",
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
    chatProStrategy: "Pro 对话策略",
    chatProFirstTurnOnly: "每轮首次使用 Pro，后续使用 Extra High",
    chatProForceAll: "强制所有对话使用 Pro",
    chatProFirstTurnHint:
      "推荐。Pro 通常耗时较长；每轮首次有效提交使用 Pro，同轮继续、纠正和补交自动切换为 Extra High。",
    chatProForceAllHint:
      "强制全部 Pro 会显著延长五轮流程，尤其是续写、纠正与产物补交。",
    chatPollingInterval: "结果检查间隔",
    chatPollingAuto:
      "按实际档位自动采用：Medium / High 1 分钟，Extra High 3 分钟，Pro 5 分钟；无法识别时按 1 分钟。",
    chatRuntimePolicy:
      "不锁定 GPT 型号名称；插件每轮读取 ChatGPT 当前可见选项。发生回退时先明确提示，名称无法判断时选择最强可用档位。",
    exportAutomation: "导出桌面配置",
    exportedAutomation: "配置已下载",
    exportAutomationHint:
      "下载当前论文类型、篇幅建议、章节、附录、框架图、ChatGPT 推理偏好和 Prompt 语言设置，供 YanShu 插件直接读取。",
    resetDefaults: "恢复默认配置",
    resetHint:
      "重置论文类型、篇幅建议、附录、框架图、ChatGPT 推理偏好和章节建议；保留当前语言。",
    plannerTitle: "正文与章节篇幅建议",
    plannerBody:
      "所有数值仅供参考，可按论文内容接受、调整或忽略；方法和实验默认不设置建议范围。",
    targetTotal: "建议正文参考值",
    unlimitedMainText: "不设正文总建议",
    limitedSectionsTotal: "有建议章节合计",
    unlimitedCoreSections: "方法和实验不设置建议字数",
    unlimitedCoreSectionsHint: "开启后不提供正文总建议，仅为其他章节生成可选参考范围。",
    unlimitedSection: "无建议",
    visualCountingRule:
      `建议估算规则：每张表格或图片按 ${WORD_COUNT_POLICY.visualWordEquivalent} 词计入所在章节及正文参考值。`,
    resetAllocation: "按比例重算",
    presetAllocation: "预设比例",
    customAllocation: "自定义分配",
    budget: "建议字数",
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
    promptTarget: "正文篇幅建议",
    promptAppendix: "附录",
    promptSections: "章节建议",
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
      "Choose the paper type, optional length guidance, appendix rule, and overview layout, then deeply refine the manuscript with five prompts.",
    generalPreset: "General product preset · not an official venue rule",
    language: "Site language",
    chinese: "中文",
    english: "English",
    paperStyle: "Paper style",
    targetWords: "Suggested main-text reference",
    targetWordsHint:
      "When enabled, optional section suggestions appear; accept, adjust, or ignore them according to the paper. The appendix is excluded, and each table or figure is estimated as 200 words.",
    wordLimitOn: "Enable length guidance",
    wordLimitOff: "No length guidance by default",
    noWordLimitHint:
      "This is the default. Section suggestions are hidden, and all five prompts omit main-text and section-length numbers.",
    introNavigation: "Introduction roadmap paragraph",
    introNavigationOn: "Include an ≈65-word roadmap",
    introNavigationOff: "No roadmap paragraph",
    introNavigationHint:
      "Off by default for conferences and on for journals; when enabled, it is a separate ≈65-word paragraph excluded from the suggested Introduction length.",
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
    chatProStrategy: "Pro interaction policy",
    chatProFirstTurnOnly:
      "Pro for the first interaction of each round; Extra High afterward",
    chatProForceAll: "Force Pro for every interaction",
    chatProFirstTurnHint:
      "Recommended. Pro can take much longer: use it for the first effective submission of each round, then switch continuations, corrections, and artifact follow-ups to Extra High.",
    chatProForceAllHint:
      "Forcing Pro throughout can substantially extend the five-round workflow, especially during continuations, corrections, and artifact follow-ups.",
    chatPollingInterval: "Result-check interval",
    chatPollingAuto:
      "Resolved from the level actually selected: Medium / High 1 minute, Extra High 3 minutes, and Pro 5 minutes; unknown labels use 1 minute.",
    chatRuntimePolicy:
      "GPT model names are never pinned. The plugin inspects the options currently visible in ChatGPT for every round, announces any fallback, and chooses the strongest available level when labels cannot be interpreted.",
    exportAutomation: "Export desktop config",
    exportedAutomation: "Config downloaded",
    exportAutomationHint:
      "Download the current paper type, optional length guidance, section, appendix, framework-figure, ChatGPT reasoning preference, and prompt-language settings for the YanShu plugin.",
    resetDefaults: "Restore defaults",
    resetHint:
      "Resets paper type, length guidance, appendix, framework figure, ChatGPT reasoning preference, and section suggestions while keeping the current language.",
    plannerTitle: "Main-text and section length guidance",
    plannerBody:
      "Every value is optional guidance that may be accepted, adjusted, or ignored according to the paper; Method and Experiments receive no suggestion by default.",
    targetTotal: "Suggested main-text reference",
    unlimitedMainText: "No main-text suggestion",
    limitedSectionsTotal: "Sections with guidance",
    unlimitedCoreSections: "No suggested length for Method or Experiments",
    unlimitedCoreSectionsHint:
      "When enabled, no main-text total is suggested and only the other sections receive optional reference ranges.",
    unlimitedSection: "No suggestion",
    visualCountingRule:
      `Guidance estimate: each table or figure counts as ${WORD_COUNT_POLICY.visualWordEquivalent} words toward its section and the suggested main-text reference.`,
    resetAllocation: "Recalculate by ratio",
    presetAllocation: "Preset ratios",
    customAllocation: "Custom allocation",
    budget: "Suggested words",
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
    promptTarget: "Main-text length guidance",
    promptAppendix: "Appendix",
    promptSections: "Section suggestions",
    promptTask: "Task for this round",
    promptOutput: "Required output",
    promptBoundary:
      "Boundary: do not invent facts, citations, data, or venue rules. Mark anything that cannot be verified.",
    github: "GitHub repository",
    clipboardError: "Copy failed. Expand the card and select the text manually.",
  },
} as const;
