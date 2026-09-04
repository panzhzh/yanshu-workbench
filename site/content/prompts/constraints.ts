import type {
  LocalizedText,
  PaperStyleId,
} from "./types";

export interface InlineWordLimitConstraint {
  marker: string;
  standard: LocalizedText;
  flexibleCore?: LocalizedText;
}

export interface InlineStyleConstraint {
  marker: string;
  branches: Record<PaperStyleId, LocalizedText>;
}

export interface InlinePreferenceConstraint {
  marker: string;
  contextKey: "includeSectionNavigationSentence";
  branches: {
    enabled: LocalizedText;
    disabled: LocalizedText;
  };
}

export interface PromptConstraintSet {
  core: LocalizedText;
  inlineStyleConstraints?: InlineStyleConstraint[];
  inlinePreferenceConstraints?: InlinePreferenceConstraint[];
  inlineWordLimits?: InlineWordLimitConstraint[];
  wordLimit?: LocalizedText;
  flexibleCoreWordLimit?: LocalizedText;
  wordLimitPlacement?: "after-budget" | "after-core";
}

interface PromptStepPolicy {
  temporaryMainTextCeilingMultiplier: number;
  protectedSectionIds: readonly string[];
  appendixTriage: {
    enabled: LocalizedText;
    disabled: LocalizedText;
  };
}

export const PROMPT_STEP_POLICIES = {
  "scientific-positioning": {
    temporaryMainTextCeilingMultiplier: 1.2,
    protectedSectionIds: ["method", "experiments-results"],
    appendixTriage: {
      enabled: {
        zh: "当前配置只允许、并不要求使用附录。不得只为命中建议字数而移动内容；正文已经清楚、完整且结构紧凑时不使用附录。只有材料本身确属补充内容、放在正文会削弱主线时才可考虑移入。除 {{protected_sections}} 外，任何移动都不得削弱定义完整性和论证闭环，且正文必须保持自洽。",
        en: "The configuration permits but does not require an appendix. Never move content merely to hit a suggested length, and omit the appendix when the main text is clear, complete, and focused. Move material only when it is genuinely supplementary and would weaken the main throughline. Outside {{protected_sections}}, no move may weaken complete definitions or argumentative closure, and the main text must remain self-contained.",
      },
      disabled: {
        zh: "当前配置未启用附录：不得把任何内容转移到附录。可以删除真实重复并合并非核心叙述，但篇幅建议不构成删减核心内容的理由；必要时直接偏离建议并在报告中说明。",
        en: "The current configuration disables the appendix. Do not move material outside the main text. Remove genuine repetition and consolidate non-core exposition when useful, but never treat length guidance as a reason to delete core content; deviate from the suggestion when necessary and record why.",
      },
    },
  },
  "full-reconstruction": {
    temporaryMainTextCeilingMultiplier: 1.2,
    protectedSectionIds: ["method", "experiments-results"],
    appendixTriage: {
      enabled: {
        zh: "当前配置只允许、并不要求使用附录。不得只为命中建议字数而移动内容；正文已经清楚、完整且结构紧凑时不使用附录。只有材料本身确属补充内容、放在正文会削弱主线时才可考虑移入。除 {{protected_sections}} 外，任何移动都不得削弱定义完整性和论证闭环，且正文必须保持自洽。",
        en: "The configuration permits but does not require an appendix. Never move content merely to hit a suggested length, and omit the appendix when the main text is clear, complete, and focused. Move material only when it is genuinely supplementary and would weaken the main throughline. Outside {{protected_sections}}, no move may weaken complete definitions or argumentative closure, and the main text must remain self-contained.",
      },
      disabled: {
        zh: "当前配置未启用附录：不得把任何内容转移到附录。可以删除真实重复并合并非核心叙述，但篇幅建议不构成删减核心内容的理由；必要时直接偏离建议并在报告中说明。",
        en: "The current configuration disables the appendix. Do not move material outside the main text. Remove genuine repetition and consolidate non-core exposition when useful, but never treat length guidance as a reason to delete core content; deviate from the suggestion when necessary and record why.",
      },
    },
  },
} satisfies Record<string, PromptStepPolicy>;

export const SOURCE_BUDGET_REFERENCE = {
  total: 5000,
  totalRange: [4850, 5150],
  sections: {
    abstract: { target: 200, range: [190, 220] },
    introduction: { target: 520, range: [500, 560] },
    "related-work": { target: 450, range: [420, 480] },
    method: { target: 1500, range: [1450, 1600] },
    "experiments-results": { target: 1650, range: [1570, 1730] },
    discussion: { target: 480, range: [440, 520] },
    conclusion: { target: 200, range: [180, 220] },
  },
} as const;

export const PROMPT_DETAILED_CONSTRAINTS: Record<
  string,
  PromptConstraintSet
> = {
  "scientific-positioning": {
    core: {
      zh: `### Scientific Positioning Contract 必须逐项回答

1. Task：具体任务、输入、输出和适用边界；
2. Scientific problem：真正需要解决的科学问题，而不是模块名；
3. Current gap：近年工作仍未解决且本文实际针对的缺口；
4. Core idea：一句能脱离模块名称仍然成立的核心思想；
5. Computational realization：实现核心思想的计算机制；
6. Primary claims：最终最多保留 2–4 个可由证据支持的主要 claim；
7. Evidence：每个 claim 对应的表、图、实验或分析；
8. Boundaries：不能推广的条件，以及只能写成观察或推断的结论。

### 论文标题与品牌缩写

- 核查当前标题、方法全称和缩写的准确性、自然度、检索性及与最近邻工作的冲突风险；
- 若当前身份仍是最优方案则继续使用；若变更能明确改善准确性、边界或辨识度，直接选择并应用最优标题、方法全称或 4–7 个拉丁字母的品牌缩写，不生成延后决策的候选集，也不暂停流程；
- 按全局标题与品牌治理规则记录每项实际变更；未变更时也要记录审计结论；
{{title_word_limits}}

### 唯一术语体系

- 以本轮审计后确定的方法全称和论文品牌缩写为唯一身份；
- 统一科学问题、核心表示、模块、分支、查询、损失、训练和推理术语；
- 统一数据集、指标、比较设置和实验类型名称；
- 列出禁止继续使用的冗余同义词；
- 列出相近但必须区分、不能合并的概念。

### 章节功能与固定结构

{{scientific_document_hierarchy}}
- Abstract：形成与主线一致的工作版本，后续仍以深度精修为主；
{{scientific_introduction_structure}}
{{scientific_related_work_structure}}
{{scientific_method_structure}}
{{scientific_experiment_structure}}
{{scientific_discussion_structure}}
- Conclusion：恰好两个普通段落；第一段收束问题、核心思想和主要发现，第二段说明意义、边界和未来方向。

### 图表接口与宏观重写边界

- 为框架图、机制图、主结果表、消融表、效率/稳健性/案例图分别指定所支持的核心思想、机制、claim 或边界；
- caption 和正文必须解释图表，而非只提到图表；
- 允许重排章节和段落、合并真实重复、精修开头与主题句、重构贡献、调整 Method/Experiments 分工并建立必要的 Discussion；
- Method 与 Experiments 的核心机制、实验协议、主结果、不利结果和必要解释不得因篇幅建议或结构整理而压缩；
- 不得更换模板，不得用新模块或新实验填补证据缺口。

### 中文报告固定清单

报告必须包含：Scientific Positioning Contract、标题与论文品牌审计及 high-risk diff（如有）、一句话论文主旨、一句话核心痛点、旧/新主线对照、贡献分层、Claim–Evidence Map、术语表、章节功能表、图表角色表、结构操作、联网核验、自动决策与未核验风险，并统一写入最终重构说明。`,
      en: `### The Scientific Positioning Contract Must Answer Every Item

1. Task: the concrete task, inputs, outputs, and applicable boundary;
2. Scientific problem: the real scientific problem rather than a component name;
3. Current gap: what recent work still fails to solve and this paper actually addresses;
4. Core idea: one statement that remains meaningful without component names;
5. Computational realization: mechanisms that implement the core idea;
6. Primary claims: retain at most two to four evidence-supported claims;
7. Evidence: tables, figures, experiments, or analyses supporting each claim;
8. Boundaries: conditions that prevent generalization and conclusions that must remain observations or inferences.

### Paper Title and Brand Acronym

- Audit the current title, full method name, and acronym for accuracy, naturalness, searchability, and collision risk against nearest-neighbor work;
- Keep the current identity when it remains the strongest option. When a change clearly improves accuracy, scope, or distinctiveness, select and apply the best title, full method name, or four-to-seven-letter brand acronym automatically; do not create a deferred candidate set or pause the workflow;
- Record every applied change under the global title-and-brand governance rule, and record the audit conclusion even when nothing changes;
{{title_word_limits}}

### One Terminology System

- Treat the full method name and paper-brand acronym selected by this audit as the single identity;
- Standardize terminology for the scientific problem, representations, components, branches, queries, losses, training, and inference;
- Standardize names for datasets, metrics, comparison settings, and experiment types;
- List redundant synonyms that must no longer appear;
- List nearby concepts that must remain distinct and cannot be merged.

### Section Functions and Fixed Structure

{{scientific_document_hierarchy}}
- Abstract: create a throughline-consistent working version for later deep refinement;
{{scientific_introduction_structure}}
{{scientific_related_work_structure}}
{{scientific_method_structure}}
{{scientific_experiment_structure}}
{{scientific_discussion_structure}}
- Conclusion: exactly two ordinary paragraphs. The first closes the problem, core idea, and main findings; the second states implications, boundaries, and future directions.

### Visual Interfaces and Macro-rewrite Boundary

- Assign framework figures, mechanism figures, main-results tables, ablation tables, and efficiency/robustness/case visuals to the core idea, mechanism, claim, or boundary they support;
- Captions and prose must explain visuals rather than merely mention them;
- You may reorder sections and paragraphs, merge genuine repetition, refine openings and topic sentences, rebuild contributions, revise the Method/Experiments division, and create a necessary Discussion;
- Never compress core mechanisms, experimental protocols, main or unfavorable results, or necessary interpretation merely to satisfy a length suggestion or structural cleanup;
- Do not change the template or fill evidence gaps with new components or experiments.

### Fixed Chinese-report Checklist

The report must contain the Scientific Positioning Contract; title and paper-brand audit with any high-risk diff; one-sentence thesis and pain point; old/new throughline comparison; contribution hierarchy; Claim–Evidence Map; terminology and section-function tables; visual roles; structural operations; web verification; automatic decisions; and unresolved risks, all consolidated in the final reconstruction report.`,
    },
    inlineStyleConstraints: [
      {
        marker: "scientific_document_hierarchy",
        branches: {
          conference: {
            zh: "- 会议论文采用高密度、claim-first 的写法；可用层级为 section → subsection → paragraph，但标题只对应独立科学单元，普通论述保持连续；",
            en: "- Conference prose is compact and claim-first. The available hierarchy is section → subsection → paragraph, but headings correspond only to independent scientific units and ordinary exposition remains continuous;",
          },
          journal: {
            zh: "- 期刊论文采用累积式、解释充分的写法；目录层级默认止于 subsubsection，其下用主题句、过渡和自然段组织连续论证；",
            en: "- Journal prose is cumulative and sufficiently explanatory. Stop the hierarchy at subsubsection by default and organize lower-level reasoning through topic sentences, transitions, and natural paragraphs;",
          },
        },
      },
      {
        marker: "scientific_related_work_structure",
        branches: {
          conference: {
            zh: "- Related Work：恰好三个 subsection，每个小节恰好一个普通段落；按研究范式、假设或关键权衡综合组织，禁止逐篇流水账；",
            en: "- Related Work: exactly three subsections with exactly one ordinary paragraph each. Synthesize paradigms, assumptions, or key trade-offs; do not narrate papers serially;",
          },
          journal: {
            zh: "- Related Work：恰好三个 subsection，每个小节恰好两个普通段落；按研究范式、假设或关键权衡综合组织，禁止逐篇流水账；",
            en: "- Related Work: exactly three subsections with exactly two ordinary paragraphs each. Synthesize paradigms, assumptions, or key trade-offs; do not narrate papers serially;",
          },
        },
      },
      {
        marker: "scientific_method_structure",
        branches: {
          conference: {
            zh: "- Method：不单设 Overview，在合适位置自然引出总体框架；围绕 why 融合动机、计算构造、接口与边界。小节数量由真实科学单元决定，不为每个模块或叙述功能新增标题；",
            en: "- Method: use no standalone Overview and introduce the framework where it serves the argument. Integrate motivation, computation, interfaces, and boundaries around why. Let genuine scientific units determine subsection count rather than creating a heading per component or discourse function;",
          },
          journal: {
            zh: "- Method：设置两个普通段落的独立 Overview，但不逐项复述框架图；围绕 why 融合动机、计算构造、接口与边界。小节数量由真实科学单元决定，不为每个模块或叙述功能新增标题；\n{{scientific_overview_word_limits}}",
            en: "- Method: use a two-paragraph standalone Overview without narrating the framework figure item by item. Integrate motivation, computation, interfaces, and boundaries around why. Let genuine scientific units determine subsection count rather than creating a heading per component or discourse function;\n{{scientific_overview_word_limits}}",
          },
        },
      },
      {
        marker: "scientific_experiment_structure",
        branches: {
          conference: {
            zh: "- Experiments and Results：先在 Datasets and Experimental Setup 中依次覆盖 Datasets、Evaluation Metrics、Experimental Configuration 和 Baselines，再进入 Main Results；四项是内容功能，不要求机械成为 paragraph。后续分析按证据安排，标题只命名真实实验、变量或现象；",
            en: "- Experiments and Results: cover Datasets, Evaluation Metrics, Experimental Configuration, and Baselines in order within Datasets and Experimental Setup, then move to Main Results. These are content functions, not mandatory paragraph headings. Order later analyses by evidence and let headings name genuine experiments, variables, or phenomena;",
          },
          journal: {
            zh: "- Experiments and Results：先在 Datasets and Experimental Setup 中依次覆盖 Datasets、Evaluation Metrics、Experimental Configuration 和 Baselines，再进入 Main Results；只在内容确实构成独立单元时设置 subsubsection。后续分析按证据安排；",
            en: "- Experiments and Results: cover Datasets, Evaluation Metrics, Experimental Configuration, and Baselines in order within Datasets and Experimental Setup, then move to Main Results. Use subsubsections only for genuinely independent units and order later analyses by evidence;",
          },
        },
      },
      {
        marker: "scientific_discussion_structure",
        branches: {
          conference: {
            zh: "- Discussion and Limitations：由模型按证据选择 3–5 个承担综合解释、适用范围与科学意义的 discussion subsection，最后单列 Limitations。Discussion 不复述结果、不引用实验图表，具体结果数字最多三个；\n{{scientific_limitations_word_limits}}",
            en: "- Discussion and Limitations: let the model select three to five evidence-driven discussion subsections for synthesis, scope, and scientific implications, followed by Limitations. Discussion does not repeat Results or cite experimental visuals and uses at most three result values;\n{{scientific_limitations_word_limits}}",
          },
          journal: {
            zh: "- Discussion：独立成节，由模型按证据选择 3–5 个主题小节，覆盖机制解释、适用范围、意义与局限；不复述结果、不引用实验图表，具体结果数字最多三个；",
            en: "- Discussion: use a standalone section with three to five evidence-driven topic subsections covering mechanism, scope, implications, and limitations. Do not repeat Results or cite experimental visuals, and use at most three result values;",
          },
        },
      },
    ],
    inlinePreferenceConstraints: [
      {
        marker: "scientific_introduction_structure",
        contextKey: "includeSectionNavigationSentence",
        branches: {
          enabled: {
            zh: "- Introduction：P1–P4 使用四个核心叙事段落，依次承担背景与任务、相关路线与缺口、今天仍未解决且决定设计的挑战、本文的核心思想与总体回应。P5 先写引导句 `This paper makes the following three contributions:`，再使用 `\\begin{itemize}`、三个 `\\item` 和 `\\end{itemize}` 给出三条单句贡献；每个条目默认以 `We` 开头并对应真实机制与证据。贡献块后增加一个约 65 词的独立章节导航段；该段只说明论文组织、不承载新论证或引用，且不计入 Introduction 建议字数；",
            en: "- Introduction: use four core narrative paragraphs for background/task, research lines/gap, the challenges that remain unresolved today and determine the design, and this paper's core idea and response. P5 begins with `This paper makes the following three contributions:`, then uses `\\begin{itemize}`, three `\\item` entries, and `\\end{itemize}` for three one-sentence contributions; each item begins with `We` by default and maps to a real mechanism and evidence. Follow the contribution block with a separate paper-roadmap paragraph of about 65 words. It states organization only, carries no new argument or citation, and is excluded from the suggested Introduction word count;",
          },
          disabled: {
            zh: "- Introduction：P1–P4 使用四个核心叙事段落，依次承担背景与任务、相关路线与缺口、今天仍未解决且决定设计的挑战、本文的核心思想与总体回应。P5 先写引导句 `This paper makes the following three contributions:`，再使用 `\\begin{itemize}`、三个 `\\item` 和 `\\end{itemize}` 给出三条单句贡献；每个条目默认以 `We` 开头并对应真实机制与证据。不写章节导航段；",
            en: "- Introduction: use four core narrative paragraphs for background/task, research lines/gap, the challenges that remain unresolved today and determine the design, and this paper's core idea and response. P5 begins with `This paper makes the following three contributions:`, then uses `\\begin{itemize}`, three `\\item` entries, and `\\end{itemize}` for three one-sentence contributions; each item begins with `We` by default and maps to a real mechanism and evidence. Omit the paper-roadmap paragraph;",
          },
        },
      },
    ],
    inlineWordLimits: [
      {
        marker: "title_word_limits",
        standard: {
          zh: "- 启用篇幅建议时，标题可参考 8–16 个英文单词；以准确、自然和有辨识度为先，可根据论文内容偏离。",
          en: "- When length guidance is enabled, use 8–16 English words as an optional title reference; accuracy, naturalness, and distinctiveness take priority, and the paper may justify a different length.",
        },
      },
      {
        marker: "scientific_overview_word_limits",
        standard: {
          zh: "- 启用篇幅建议时，期刊 Method Overview 建议约 80 词；若科学逻辑需要，可适度调整。",
          en: "- When length guidance is enabled, about 80 words is suggested for the journal Method Overview; adjust when the scientific logic requires it.",
        },
      },
      {
        marker: "scientific_limitations_word_limits",
        standard: {
          zh: "- 启用篇幅建议时，会议论文的 Limitations subsection 可参考约 100 词，并按真实局限数量与重要性调整。",
          en: "- When length guidance is enabled, use about 100 words as an optional reference for conference-paper Limitations and adjust to the number and importance of genuine limitations.",
        },
      },
    ],
    wordLimitPlacement: "after-budget",
    wordLimit: {
      zh: `### 本步骤篇幅建议与附录分流

- 完整理解当前论文后，把页面给出的总字数和章节数字仅作为结构参考，不作为硬上限或验收条件；
- 若本步骤为理顺结构而需要扩展正文，可把建议值上浮 {{temporary_ceiling_percent}}%（约 {{temporary_ceiling_words}} 词）作为观察区间；它仍是可选参考，不是临时上限；
- 对明显超出建议且可能影响聚焦度的内容建立“保留正文 / 移入附录 / 删除重复”清单，并按科学必要性说明依据；偏离建议本身不是错误；
- {{appendix_triage_rule}}
- {{protected_sections}} 是正文核心保护区。Method 的问题定义、必要机制、公式接口和训练/推理说明不得因压缩而残缺，也不得移入附录；
- Experiments and Results 的现有内容不得精简、删除、弱化或移入附录，包括实验设置、比较协议、主结果、消融、稳健性、敏感性、定性结果、失败案例和必要解释；
- Abstract 保持为临时版本；其他章节优先删除重复背景、偏离主线的铺陈和重复结论；
- 中文报告记录当前总词数、建议参考值、逐节词数、偏离建议的必要理由，以及每项保留、删除重复或移入附录的决定；
- 后续步骤继续把篇幅数字视为可选建议，并按内容需要重新判断是否采纳。`,
      en: `### Length Guidance and Appendix Triage for This Step

- After understanding the complete manuscript, use the configured total and section numbers only as structural references, never as hard caps or acceptance criteria;
- If restructuring benefits from temporary expansion, a {{temporary_ceiling_percent}}% increase (about {{temporary_ceiling_words}} words) may serve as an observation range. It remains optional guidance, not a temporary ceiling;
- For content far above the suggestion that may weaken focus, create an itemized keep-in-main-text / move-to-appendix / remove-duplication ledger and justify decisions by scientific necessity. Deviation itself is not an error;
- {{appendix_triage_rule}}
- {{protected_sections}} are protected core sections. Do not make Method's problem definition, necessary mechanisms, equation interfaces, or training/inference description incomplete through compression, and do not move them to the appendix;
- Do not condense, delete, weaken, or move any existing Experiments and Results content to the appendix, including settings, comparison protocols, main results, ablations, robustness, sensitivity, qualitative findings, failure cases, and necessary interpretation;
- Keep Abstract temporary. In other sections, remove repeated background, off-throughline exposition, and repeated conclusions first;
- The Chinese report must record the current total, suggested reference, per-section counts, necessary reasons for deviations, and every keep, duplication-removal, or appendix-move decision;
- Later steps continue to treat all length numbers as optional guidance and reassess them against the content.`,
    },
    flexibleCoreWordLimit: {
      zh: `### 仅为非核心章节提供篇幅建议

- 正文不设总量建议，20% 观察区间不适用；
- Method 与 Experiments and Results 必须按科学完整性和证据需要充分保留，不得因篇幅精简、删除、弱化或移入附录；
- {{appendix_triage_rule}}
- 其他章节的数字也只是可选建议；中文报告记录逐节词数、表格与图片折算数、是否采纳建议及理由，以及每项保留、删除重复或移入附录的决定。`,
      en: `### Length Guidance Only Outside Method and Experiments

- Because no main-text total is suggested, the 20% observation range does not apply;
- Preserve Method and Experiments & Results as scientific completeness and evidence require; never condense, delete, weaken, or move their content to the appendix merely for length;
- {{appendix_triage_rule}}
- Numbers for all other sections are optional guidance as well. The Chinese report records per-section counts, table/figure equivalents, whether each suggestion was adopted and why, and every keep, duplication-removal, or appendix-move decision.`,
    },
  },
  "method-experiments": {
    core: {
      zh: `### Method 的固定结构约束

1. {{method_document_hierarchy}}
2. Method 不得写成论文说明书、代码文档或逐步操作清单。叙述应围绕“问题为什么难 → 现有设计为什么不足 → 为什么需要当前机制 → 机制如何回应问题 → 适用边界”形成融合性的科学故事；不要求每句话都机械回答 why，而要让动机、设计、计算过程和作用在段落层面自然衔接。
3. Problem Definition 必须定义任务、输入、输出、核心约束和学习目标；只保留必要公式；每个符号在首次使用前或同句定义；符号足够多时可保留 notation table，不得为形式感添加装饰性符号。
4. {{method_overview_structure}}
5. 每个核心机制都应让读者理解其必要性、计算构造、组件接口、设计直觉、训练或推理作用及适用边界，但顺序、篇幅和组合方式由该机制的科学逻辑决定。用连续段落把这些功能融合起来，标题只命名机制或科学内容，不把上述功能拆成重复的固定槽位；不得只复述执行流程，也不得把常规 backbone、标准注意力、常见损失或简单拼接包装成独立贡献。
6. 公式必须先解释后出现，出现后说明作用及与整体目标的关系；关键公式至少被正文引用一次；检查上下标、维度、求和范围、归一化、mask、损失权重和优化目标；只有材料支持时才保留算法或复杂度，训练与推理有差异时必须明确区分。
7. 语言优先一般现在时、主动语态和无生命主语；全章 we 最多出现三次。
8. 核对现有框架图与机制图的输入、输出、模块、箭头、训练/推理路径和术语是否与重构后的 Method 一致；本流程不生成或替换图片，发现冲突时在报告中精确记录。
{{method_word_limits}}

### Experiments 的固定结构约束

1. 先用 Datasets and Experimental Setup 建立可复现条件，再由 Main Results 回答主要 claim；后续小节按真实证据组织 Ablation Studies、机制/效率/参数分析、Case Studies and Qualitative Analysis、稳健性、敏感性、泛化或错误分析。
2. {{experiment_setup_structure}}
3. Datasets and Experimental Setup 按 Datasets → Evaluation Metrics → Experimental Configuration → Baselines 覆盖四项功能；它们不必机械成为四个标题。只写材料能够确认的来源、划分、指标、配置和公平比较条件。
4. Main Results 按“总体观察 → 与强基线比较 → 跨数据集/指标稳定性 → 证据边界”组织，只选择关键数字，不逐单元格朗读。
5. 每个消融、替换或敏感性设置都必须对应明确设计问题；区分模块必要性、参数选择和训练技巧；没有多随机种子或统计支持时不得把小幅波动解释成确定规律。
6. 每个实验小节用连续段落说明研究问题、决定性证据、合理解释、与核心 claim 的关系和边界。标题只命名真实实验、变量或现象；根据证据密度决定层级，不为每张图表或叙述功能新增标题。
7. 保留全部实验设置、核心结果、不利结果和必要解释；只删除真实重复，不因篇幅建议压缩证据链。
8. 对每张实验图检查 caption、图例、数值与正文解释是否一致，以及视觉证据是否真的支持 claim。
{{experiments_word_limits}}

### 中文报告固定清单

报告必须包含：Method 逻辑图谱、方法小节重构对照、公式与符号审计、现有图表与正文接口审计、Experiment Question–Evidence 表、实验顺序设计、数字与统计风险、删除或弱化的机制主张、联网基线与协议核验、修改清单和未核验风险，并统一写入最终重构说明。Question–Evidence 表是报告中的规划与审计工具，其列名不得变成 TeX 中重复的小标题或句首标签。`,
      en: `### Fixed Constraints for Method

1. {{method_document_hierarchy}}
2. Method must not read like a manuscript manual, code document, or procedural checklist. Build an integrated scientific story around why the problem is difficult, why existing designs are insufficient, why each mechanism is needed, how it addresses the problem, and where it applies. Do not force every sentence to state a why; integrate motivation, design, computation, and function naturally at paragraph level.
3. Problem Definition must define the task, inputs, outputs, central constraints, and learning objective. Keep only necessary equations. Define every symbol before or at first use. Retain a notation table only when notation volume warrants it; never add decorative notation.
4. {{method_overview_structure}}
5. Make each core mechanism intelligible in terms of its necessity, computational construction, interfaces, design intuition, training or inference role, and applicable boundary, but let the mechanism's scientific logic determine their order, emphasis, and grouping. Integrate these functions into continuous prose, and let headings name mechanisms or scientific content rather than repeated template slots. Do not merely describe execution steps or package a standard backbone, ordinary attention, common loss, or simple concatenation as an independent contribution.
6. Motivate equations before they appear and explain their role and relation to the overall objective afterward. Cite each key equation at least once. Check indices, dimensions, summation ranges, normalization, masks, loss weights, and optimization objectives. Retain algorithms or complexity only when supported, and distinguish training from inference whenever they differ.
7. Prefer present tense, active voice, and inanimate subjects. Use "we" no more than three times in the entire section.
8. Audit whether the inputs, outputs, components, arrows, training/inference paths, and terminology of existing framework and mechanism figures still match the reconstructed Method. Do not generate or replace images in this workflow; record every conflict precisely in the report.
{{method_word_limits}}

### Fixed Constraints for Experiments

1. Establish reproducible conditions in Datasets and Experimental Setup, then let Main Results answer the primary claims. Order later Ablation Studies, mechanism/efficiency/parameter analyses, Case Studies and Qualitative Analysis, robustness, sensitivity, generalization, or error analysis by the available evidence.
2. {{experiment_setup_structure}}
3. Cover Datasets → Evaluation Metrics → Experimental Configuration → Baselines in that order within Datasets and Experimental Setup. They are four content functions, not mandatory headings. Include only verified sources, splits, metrics, configurations, and fairness conditions.
4. Organize Main Results as overall observation → comparison with strong baselines → consistency across datasets/metrics → evidence boundary. Select only decisive numbers and do not narrate every cell.
5. Every removal, replacement, or sensitivity setting must answer a clear design question. Separate component necessity, parameter choice, and training tricks. Without multiple seeds or statistical support, do not turn small variation into a deterministic rule.
6. Use continuous prose in each experiment subsection to establish the research question, decisive evidence, warranted interpretation, relation to the core claim, and boundary. Let headings name genuine experiments, variables, or phenomena; let evidence density determine hierarchy rather than adding a heading for each visual or discourse function.
7. Preserve all settings, core and unfavorable results, and necessary interpretation. Remove only genuine repetition and never compress the evidence chain for a length suggestion.
8. For every experimental figure, verify that caption, legend, values, and prose interpretation agree and that the visual supports the claim.
{{experiments_word_limits}}

### Fixed Chinese-report Checklist

The report must contain the Method logic map, old/new Method subsection comparison, equation and notation audit, existing-visual-to-prose interface audit, Experiment Question–Evidence table, experiment-order rationale, numeric/statistical risks, removed or qualified mechanism claims, web verification of baselines and protocols, revision log, and unresolved verification risks, all consolidated in the final reconstruction report. Treat the Question–Evidence table as a report-only planning and audit device; never turn its column labels into repeated TeX headings or sentence prefixes.`,
    },
    inlineStyleConstraints: [
      {
        marker: "method_document_hierarchy",
        branches: {
          conference: {
            zh: "会议论文使用 section → subsection → paragraph；标题只对应真实科学单元，普通论述保持连续。方法结构按科学逻辑而非代码类名组织。",
            en: "Conference papers use section → subsection → paragraph. Headings correspond only to genuine scientific units and ordinary exposition remains continuous. Organize Method by scientific logic rather than code class names.",
          },
          journal: {
            zh: "期刊论文目录层级默认止于 subsubsection；其下以主题句、过渡和自然段形成连续论证，不把叙述功能写成 paragraph 标题。方法结构按科学逻辑而非代码类名组织。",
            en: "In a journal paper, stop the heading hierarchy at subsubsection by default. Below it, use topic sentences, transitions, and natural paragraphs to form a continuous argument rather than paragraph headings for discourse functions. Organize Method by scientific logic rather than code class names.",
          },
        },
      },
      {
        marker: "method_overview_structure",
        branches: {
          conference: {
            zh: "会议论文不得单设 Overview subsection；应在 Problem Definition 之后或第一个核心机制之前的最合适位置自然引出总体框架，完成问题到方案的映射与必要接口说明，不得逐项复述框架图。",
            en: "Conference papers must not create a standalone Overview subsection. Introduce the overall framework naturally after Problem Definition or before the first core mechanism, wherever it best maps the problem to the solution and clarifies necessary interfaces. Do not narrate the framework figure item by item.",
          },
          journal: {
            zh: "期刊论文必须单设 Overview subsection，恰好两个普通段落：第一段完成问题到方案的高层映射，第二段说明组件接口、信息流及训练/推理路径。两段都只解释框架的科学逻辑和设计取舍，不得按图中元素顺序复述图片。\n{{journal_overview_word_limits}}",
            en: "Journal papers must use a standalone Overview subsection with exactly two ordinary paragraphs. Paragraph 1 maps the problem to the solution at a high level; Paragraph 2 explains component interfaces, information flow, and training/inference paths. Explain only scientific logic and design trade-offs; do not retell the figure in visual order.\n{{journal_overview_word_limits}}",
          },
        },
      },
      {
        marker: "experiment_setup_structure",
        branches: {
          conference: {
            zh: "在 \\subsection{Datasets and Experimental Setup} 内依次覆盖 Datasets、Evaluation Metrics、Experimental Configuration 和 Baselines。根据内容密度决定是否使用 paragraph；不得为了四项对称而强制增加标题。",
            en: "Inside \\subsection{Datasets and Experimental Setup}, cover Datasets, Evaluation Metrics, Experimental Configuration, and Baselines in order. Use paragraph headings only when content density warrants them; do not force four symmetric headings.",
          },
          journal: {
            zh: "在 \\subsection{Datasets and Experimental Setup} 内依次覆盖 Datasets、Evaluation Metrics、Experimental Configuration 和 Baselines。只在内容确实构成独立科学单元时使用 subsubsection，避免标准文档式层级。",
            en: "Inside \\subsection{Datasets and Experimental Setup}, cover Datasets, Evaluation Metrics, Experimental Configuration, and Baselines in order. Use subsubsections only for genuinely independent scientific units and avoid document-style over-structuring.",
          },
        },
      },
    ],
    inlineWordLimits: [
      {
        marker: "journal_overview_word_limits",
        standard: {
          zh: "- 启用篇幅建议时，期刊 Overview 两段可参考约 80 词，并按科学逻辑需要调整。",
          en: "- When length guidance is enabled, use about 80 words as an optional reference for the two journal Overview paragraphs and adjust to the scientific logic.",
        },
      },
      {
        marker: "method_word_limits",
        standard: {
          zh: `- 启用篇幅建议时，Problem Definition 可参考 {{problem_definition_min}}–{{problem_definition_max}} 词，Method 可参考当前配置范围，英文句子通常建议不超过 24 词；均可按机制完整性调整。`,
          en: `- When length guidance is enabled, use {{problem_definition_min}}–{{problem_definition_max}} words as an optional reference for Problem Definition and the configured range for Method; English sentences are generally suggested to stay within 24 words. Adjust all of these for mechanism completeness.`,
        },
        flexibleCore: {
          zh: `- 当前 Method 不设词数建议；Problem Definition 与当前论文类型规定的 Overview 结构仍须满足，英文句子通常建议不超过 24 词。按机制完整性展开并删除重复，不得为了扩写增加无证据内容。`,
          en: `- Method has no suggested word range. Problem Definition and the Overview structure defined for the current paper type still apply, while English sentences are generally suggested to stay within 24 words. Develop only what mechanism completeness requires, remove repetition, and never add unsupported material merely to expand the section.`,
        },
      },
      {
        marker: "experiments_word_limits",
        standard: {
          zh: `- 启用篇幅建议时，Experiments and Results 可参考当前配置范围，英文句子通常建议不超过 24 词；应按实验协议和证据链需要调整。`,
          en: `- When length guidance is enabled, use the configured range as an optional reference for Experiments and Results; English sentences are generally suggested to stay within 24 words. Adjust to the experimental protocol and evidence chain.`,
        },
        flexibleCore: {
          zh: `- 当前 Experiments and Results 不设词数建议，英文句子通常建议不超过 24 词。按实验协议与证据链需要充分展开并删除重复，不得因篇幅压缩、删除或弱化现有实验内容。`,
          en: `- Experiments and Results has no suggested word range, while English sentences are generally suggested to stay within 24 words. Develop the section as fully as its protocols and evidence chain require, remove repetition, and never condense, delete, or weaken existing experimental content merely for length.`,
        },
      },
    ],
  },
  "narrative-reconstruction": {
    core: {
      zh: `### 深度精修原则

- 先建立事实底稿与原稿高价值表达保留清单；准确、清晰、有辨识度且与证据一致的原句应保留或轻调；
- 只重组存在逻辑断裂、重复、证据错位或表达不清的部分，不以“焕新”为目的清空重写；
- 每项改动必须融合进段落论证，保持术语、语气和写作手法一致。

### Abstract 的固定结构

- 必须是一个连续英文段落，不含引用、公式、脚注、编号或换行；
- Background：1–2 句，具体说明任务、场景和当前限制；
- Bridge：恰好 1 句，固定以 "To address these challenges, we ..." 开头，并首次引入“方法全称（论文品牌缩写）”；
- Method：3–4 句，主要使用一般现在时和被动语态，从核心思想到实现机制展开；
- Results：2–3 句，主动语态和一般现在时；第一句极简说明实验范围，后续只写被表格支持的关键发现；建议只保留 2–4 个最有代表性的结果数字，证据不足时不凑数，超过 4 个须有不可替代的理由，避免数字密度过高；
- Implication：恰好 1 句，只说明证据支持的意义和范围；
- 摘要应尽量少用缩写。本文方法缩写可正常使用；其他术语只有在摘要内确需多次出现时才定义缩写，并在首次出现时给出全称。数据集等公认专名可使用标准缩写；不得为只出现一次的术语创建缩写；
- 只保留理解问题、方法和证据所必需的术语；不得堆叠模块名、损失名、变量名、实验设置名等正文级专有名词；
- Keywords 行可使用本文方法缩写，并包含 3–5 个高信息量英文术语。
{{abstract_word_limits}}

### Introduction 的核心结构

- 不设置任何子节；P1–P4 使用四个连续叙事段落，P5 为贡献块；
- P1 背景与动机：直接进入任务、场景和现实约束，明确说明该问题在当前研究与实际环境中仍然存在，而不是只回顾历史缺口；可使用 6–10 个当前 .bib key，每句最多 3 个；
- P2 最相关路线与缺口：每条路线先概括再说明在本文目标维度上的限制，可使用 4–8 个当前 key；
- P3 未解问题与挑战：最小充分描述输入、输出、约束和目标，只说明今天仍未解决且真正决定设计的 2–4 个挑战；
- P4 本文回应：直接回答 P3，介绍核心思想、总体机制与设计直觉；不得再次扩写缺口或重复挑战；
- P5 贡献与意义：先写引导句 \`This paper makes the following three contributions:\`，再使用 \`\\begin{itemize}\`、三个 \`\\item\` 和 \`\\end{itemize}\` 给出恰好三条单句贡献；每个条目默认以 \`We\` 开头，分别对应真实机制与现有证据，不写具体结果数字或 cite；
{{narrative_introduction_roadmap}}
- P1–P4 可引用，P5 的引导句和条目不引用；所有 key 必须存在于当前 .bib。
{{introduction_word_limits}}

### Related Work 的固定结构

- 目录层级固定为 section{Related Work} → 恰好三个 subsection；
- 每个 subsection 标题为 3–7 个英文单词并使用标题式大小写；
{{narrative_related_work_structure}}
- 第一句用主动语态和一般现在时概括稳定观察；
- 有且仅有一句用一般过去时描述代表性作者行为；
- 每个 subsection 的最后一句建议控制在 18 词以内并可按内容调整，必须是对本小节文献的综合分析或总结；只有分析自然支持时才可落到本文定位，但不得出现本文方法名，不得使用 "we"；
- 按研究范式、训练信号、结构假设、效率或泛化权衡综合，禁止逐篇串讲；
- 整节建议使用 15–25 个真实 BibTeX key，至少 60% 优先来自近三年；更早工作只用于任务定义或奠基背景；每句最多 3 个 key；除上述小节末句外，全文 we 最多三次；
- 正式重写前先在报告中给出三个小节主题、选择理由和计划使用的现有 key。

### Discussion 与 Conclusion 的固定结构

{{narrative_discussion_structure}}
- Discussion 必须区分直接证据、合理推断和未验证机制，承担综合分析而不是重复实验结果；不得引用 Experiments 中的表格或图片。原则上不写具体结果数字，确有分析必要时最多保留三个；最多使用四个 cite 命令，且只能使用当前 .bib key；不得引入 Method/Experiments 中不存在的新模块、实验或结论；
- Conclusion 恰好两个普通段落；第一段回到问题、核心思想、计算实现和主要证据，第二段说明意义、适用边界和未来方向；
- Conclusion 不使用 cite，不引入新主张，不复刻 Abstract 的句式。
{{discussion_conclusion_word_limits}}

### 中文报告固定清单

报告必须包含：事实底稿、原稿高价值表达保留清单、Abstract 句子功能表、Introduction 叙事段落与贡献块功能表、三点贡献旧/新对照、Related Work 主题与文献簇、Discussion 的证据/推断/边界表、Conclusion 两段功能表、术语对齐、联网核验和实际精修清单，并统一写入最终重构说明。`,
      en: `### Deep-refinement Principle

- Build both a fact base and a preservation list for high-value original expression. Retain or lightly edit original sentences that are accurate, clear, distinctive, and evidence-aligned;
- Reorganize only where logic breaks, repetition, evidence misalignment, or unclear expression warrants it. Do not erase prose merely to make it look new;
- Integrate every change into the paragraph's argument while keeping terminology, tone, and writing style consistent.

### Fixed Structure for the Abstract

- Use one continuous English paragraph with no citations, equations, footnotes, numbering, or line breaks;
- Background: one to two sentences that concretely state the task, setting, and current limitation;
- Bridge: exactly one sentence beginning with "To address these challenges, we ..." and introducing the full method name and paper brand acronym for the first time;
- Method: three to four sentences, mainly present tense and passive voice, moving from the core idea to implementation mechanisms;
- Results: two to three active-voice present-tense sentences. The first states the experimental scope minimally; later sentences report only table-supported findings. Prefer two to four representative result values, do not fill a quota when evidence is sparse, and exceed four only when each value is indispensable so that numeric density remains readable;
- Implication: exactly one sentence stating only the evidence-supported meaning and scope;
- Keep acronyms sparse. The method acronym may be used normally; define another acronym only when the term genuinely recurs within the abstract, spelling out its full form at first use. Standard acronyms for established proper names such as datasets may remain. Never introduce an acronym for a term used only once;
- Retain only terminology needed to understand the problem, method, and evidence. Do not stack body-level component names, loss names, variable names, or experimental-setting labels;
- The Keywords line may use the method acronym and must contain three to five high-information English terms.
{{abstract_word_limits}}

### Core Structure for Introduction

- Use no subsection. P1–P4 are four consecutive narrative paragraphs, and P5 is the contribution block;
- P1 Background and motivation: enter the task, setting, and practical constraints directly, and explicitly establish that the problem still exists in today's research and practical landscape rather than merely recounting a historical gap. It may use six to ten current .bib keys, with no more than three per sentence;
- P2 Closest research lines and gap: summarize each line before stating its specific limitation for this paper's objective. It may use four to eight current keys;
- P3 Unresolved problem and challenges: describe inputs, outputs, constraints, and objective minimally, focusing only on two to four challenges that still remain today and genuinely determine the design;
- P4 This paper's response: answer P3 directly with the core idea, overall mechanism, and design intuition; do not expand the gap again or repeat the challenges;
- P5 Contributions and significance: begin with \`This paper makes the following three contributions:\`, then use \`\\begin{itemize}\`, three \`\\item\` entries, and \`\\end{itemize}\` for exactly three one-sentence contributions. Each item begins with \`We\` by default and maps to a real mechanism and existing evidence. Use no specific result value or cite;
{{narrative_introduction_roadmap}}
- P1–P4 may cite; the P5 lead-in and items do not. Every key must exist in the current .bib.
{{introduction_word_limits}}

### Fixed Structure for Related Work

- Fix the hierarchy as section{Related Work} → exactly three subsections;
- Each subsection title contains three to seven English words in title case;
{{narrative_related_work_structure}}
- The first sentence uses active voice and present tense to summarize a stable observation;
- Exactly one sentence uses simple past tense to describe a representative author action;
- The final sentence of each subsection preferably stays within 18 words but may adjust to the content, and it synthesizes or summarizes that subsection's literature. It may lead naturally to the paper's position only when the analysis warrants it, but must not name the paper's method or use "we";
- Synthesize paradigms, training signals, structural assumptions, efficiency, or generalization trade-offs. Never narrate papers one by one;
- Recommend 15–25 real BibTeX keys across the section, prioritizing at least 60% from the last three years. Use older work only for task definition or foundations, at most three keys per sentence, and "we" no more than three times outside the prohibited subsection-final sentences;
- Before drafting, plan the three subsection themes, rationale, and existing keys in the report.

### Fixed Structure for Discussion and Conclusion

{{narrative_discussion_structure}}
- Discussion must distinguish direct evidence, reasonable inference, and untested mechanisms, and provide synthesis rather than repeat experimental results. Do not cite tables or figures from Experiments. Prefer no specific result values and retain at most three only when analytically necessary; use at most four cite commands from the current .bib; and introduce no component, experiment, or conclusion absent from Method/Experiments;
- Conclusion has exactly two ordinary paragraphs. Paragraph 1 returns to the problem, core idea, computational realization, and primary evidence. Paragraph 2 states significance, applicable boundaries, and future directions;
- Conclusion uses no cite, introduces no new claim, and does not copy Abstract phrasing.
{{discussion_conclusion_word_limits}}

### Fixed Chinese-report Checklist

The report must contain the fact base, preservation list for high-value original expression, Abstract sentence-function table, Introduction narrative-paragraph and contribution-block map, old/new three-contribution comparison, Related Work themes and citation clusters, Discussion evidence/inference/boundary table, Conclusion two-paragraph map, terminology alignment, web verification, and the actual refinement log, all consolidated in the final reconstruction report.`,
    },
    inlineStyleConstraints: [
      {
        marker: "narrative_related_work_structure",
        branches: {
          conference: {
            zh: "- 会议论文的每个 subsection 恰好一个普通段落；\n{{related_work_word_limits_conference}}",
            en: "- In a conference paper, each subsection contains exactly one ordinary paragraph;\n{{related_work_word_limits_conference}}",
          },
          journal: {
            zh: "- 期刊论文的每个 subsection 恰好两个普通段落；\n{{related_work_word_limits_journal}}",
            en: "- In a journal paper, each subsection contains exactly two ordinary paragraphs;\n{{related_work_word_limits_journal}}",
          },
        },
      },
      {
        marker: "narrative_discussion_structure",
        branches: {
          conference: {
            zh: "- 会议论文的 Discussion and Limitations 由模型按证据选择 3–5 个 discussion subsection，承担综合解释、适用范围与科学意义，最后单列 Limitations；\n{{narrative_limitations_word_limits}}",
            en: "- In a conference paper, let the model select three to five evidence-driven Discussion subsections for synthesis, scope, and scientific implications, followed by a separate Limitations subsection;\n{{narrative_limitations_word_limits}}",
          },
          journal: {
            zh: "- 期刊论文的 Discussion 由模型按证据选择 3–5 个主题小节，覆盖机制解释、适用范围、意义、局限与未来方向；",
            en: "- In a journal paper, let the model select three to five evidence-driven topic subsections covering mechanism, scope, implications, limitations, and future directions;",
          },
        },
      },
    ],
    inlinePreferenceConstraints: [
      {
        marker: "narrative_introduction_roadmap",
        contextKey: "includeSectionNavigationSentence",
        branches: {
          enabled: {
            zh: "- 在 P5 后增加一个约 65 词的独立章节导航段，只说明各章节如何承接，不重复章节内容、不承载新论证，也不使用 cite；该段不计入 Introduction 建议字数；",
            en: "- After P5, add a separate paper-roadmap paragraph of about 65 words that only maps how the sections proceed, repeats no section content, carries no new argument, and uses no cite. Exclude this paragraph from the suggested Introduction word count;",
          },
          disabled: {
            zh: "- 不写章节导航段；以贡献块自然结束 Introduction；",
            en: "- Omit the paper-roadmap paragraph and close Introduction naturally with the contribution block;",
          },
        },
      },
    ],
    inlineWordLimits: [
      {
        marker: "abstract_word_limits",
        standard: {
          zh: `- 启用篇幅建议时，Abstract 可参考 {{abstract_min}}–{{abstract_max}} 词；Background 每句建议 16–24 词，Bridge 12–18 词，Method 每句 16–24 词，Results 每句 14–22 词，Implication 12–18 词。所有区间均可按内容与可读性调整。`,
          en: `- When length guidance is enabled, use {{abstract_min}}–{{abstract_max}} words as an optional Abstract reference; suggested sentence ranges are 16–24 words for Background, 12–18 for Bridge, 16–24 for Method, 14–22 for Results, and 12–18 for Implication. Adjust every range for content and readability.`,
        },
      },
      {
        marker: "introduction_word_limits",
        standard: {
          zh: `- 启用篇幅建议时，Introduction 总量可参考 {{introduction_min}}–{{introduction_max}} 词，英文句子通常建议不超过 25 词；P1–P4 可分别参考 {{intro_p1_min}}–{{intro_p1_max}}、{{intro_p2_min}}–{{intro_p2_max}}、{{intro_p3_min}}–{{intro_p3_max}}、{{intro_p4_min}}–{{intro_p4_max}} 词，P5 贡献块可参考 {{intro_p5_min}}–{{intro_p5_max}} 词，每个贡献条目建议 15–25 词。所有数字可按内容调整；启用时，独立的约 65 词章节导航段不计入上述 Introduction 建议字数。`,
          en: `- When length guidance is enabled, use {{introduction_min}}–{{introduction_max}} words as an optional Introduction reference, with English sentences generally suggested to stay within 25 words. Optional references for P1–P4 are {{intro_p1_min}}–{{intro_p1_max}}, {{intro_p2_min}}–{{intro_p2_max}}, {{intro_p3_min}}–{{intro_p3_max}}, and {{intro_p4_min}}–{{intro_p4_max}} words; the P5 contribution block may use {{intro_p5_min}}–{{intro_p5_max}}, with 15–25 words suggested per item. Adjust all numbers to the content. When enabled, the separate ≈65-word roadmap paragraph is excluded from this suggested Introduction count.`,
        },
      },
      {
        marker: "related_work_word_limits_conference",
        standard: {
          zh: `- 启用篇幅建议时，Related Work 总量可参考 {{related_work_min}}–{{related_work_max}} 词，每个 subsection 的唯一段落可参考 {{related_subsection_min}}–{{related_subsection_max}} 词，英文句子通常建议不超过 22 词；均可按文献密度调整。`,
          en: `- When length guidance is enabled, use {{related_work_min}}–{{related_work_max}} words as an optional Related Work reference, {{related_subsection_min}}–{{related_subsection_max}} for each subsection's sole paragraph, and generally no more than 22 words per English sentence. Adjust to the literature density.`,
        },
      },
      {
        marker: "related_work_word_limits_journal",
        standard: {
          zh: `- 启用篇幅建议时，Related Work 总量可参考 {{related_work_min}}–{{related_work_max}} 词，每个 subsection 可参考 {{related_subsection_min}}–{{related_subsection_max}} 词，每段可参考 {{related_paragraph_min}}–{{related_paragraph_max}} 词，英文句子通常建议不超过 22 词；均可按文献密度调整。`,
          en: `- When length guidance is enabled, optional references are {{related_work_min}}–{{related_work_max}} words for Related Work, {{related_subsection_min}}–{{related_subsection_max}} per subsection, {{related_paragraph_min}}–{{related_paragraph_max}} per paragraph, and generally no more than 22 words per English sentence. Adjust to the literature density.`,
        },
      },
      {
        marker: "narrative_limitations_word_limits",
        standard: {
          zh: "- 启用篇幅建议时，会议论文的 Limitations subsection 可参考约 100 词，并按真实局限数量与重要性调整。",
          en: "- When length guidance is enabled, use about 100 words as an optional reference for conference-paper Limitations and adjust to the number and importance of genuine limitations.",
        },
      },
      {
        marker: "discussion_conclusion_word_limits",
        standard: {
          zh: `- 启用篇幅建议时，Discussion 总量可参考 {{discussion_min}}–{{discussion_max}} 词；Conclusion 可参考 {{conclusion_min}}–{{conclusion_max}} 词，英文句子通常建议不超过 24 词，第一段可参考 {{conclusion_p1_min}}–{{conclusion_p1_max}} 词，第二段可参考 {{conclusion_p2_min}}–{{conclusion_p2_max}} 词。所有数字均可按论证需要调整。`,
          en: `- When length guidance is enabled, use {{discussion_min}}–{{discussion_max}} words as an optional Discussion reference and {{conclusion_min}}–{{conclusion_max}} for Conclusion. English sentences are generally suggested to stay within 24 words; optional paragraph references are {{conclusion_p1_min}}–{{conclusion_p1_max}} and {{conclusion_p2_min}}–{{conclusion_p2_max}} words. Adjust every number to the argument.`,
        },
      },
    ],
  },
  "venue-targeting": {
    core: {
      zh: `### 本轮绝对边界

- 不得改变 documentclass、宏包、作者格式、参考文献格式、单双栏、图表样式、页边距或任何模板内容；
- 不得为了匹配 venue 改写标题、摘要、Introduction、章节名、参考文献或正文；
- 不得转换到出版社或会议模板；
- 论文文件只作为只读输入；不得复制、归档、重命名或生成任何 .tex、.md 或其他下载文件。发现明确错误只在当前对话中提出；
- 本轮不修改或生成 BibTeX 文献库，重点是目标筛选和官网核验。

### 来源优先级

1. venue 官方主页与出版社页面；
2. 官方 Aims and Scope 或 Call for Papers；
3. 官方 Guide for Authors、Submission Guidelines 和投稿系统；
4. Clarivate Master Journal List/JCR、会议官方组织方或其他对应权威索引；
5. 官方 Open Access、APC、注册费和补充材料政策页；
6. DOAJ、Scopus Sources 或 SCImago 只能作为辅助，不得替代权威收录或等级判断。

每个可能变化的事实必须附可点击来源并记录核验日期。没有官方数据就写“未核验”，不得猜测接收率、审稿周期、费用或当前规则。

### Manuscript–Venue Profile 必查字段

- 首先用恰好一句“论文类别判断”概括主要学科、细分领域、研究或稿件类型、核心贡献形态和目标读者；跨学科论文同时标明主投领域与交叉领域；
- 研究问题、研究对象、研究设计或方法、证据形态和主要贡献；
- 理论、方法、实证、系统、应用、综述或跨学科属性；
- 目标读者、正文规模、图表数量、参考文献数量和补充材料；
- 证据强度、最可能的卖点和最可能的 desk-reject/triage 风险。

不得为了目标筛选重新定义论文科学主线。

### 候选池与核验字段

- 建立与领域规模相称的候选池，通常为 8–15 个；可信且当前可投稿的目标更少时，可以缩小候选池并说明原因，不得为凑数加入弱相关 venue；
{{publisher_exclusion_bullet}}
- 逐项核验全名、出版社/组织方、官网、范围匹配点、文章或 track 类型、当前索引/等级、正文/页数/图表/摘要/参考文献限制、附录与补充材料、匿名政策、OA/APC 或注册费用、附加文件、伦理/数据/可复现政策、投稿入口和关键日期；
- 只有权威来源支持时才写 SCIE、SSCI、AHCI、ESCI、JCR 分区、会议等级或其他领域评价；不适用于当前学科或稿件类型的指标明确写“不适用”；
- SJR/Scopus 信息必须明确标注，不能冒充 JCR；中科院分区与 JCR 必须分开并标注年份；
- 当前届与历史届规则不得混用。

### 100 分匹配评分

- 主题与范围匹配：30；
- 稿件类型与贡献形态匹配：20；
- 研究设计和证据成熟度与 venue 期望匹配：15；
- 目标等级或分区匹配：15；
- 长度、图表与材料兼容：10；
- OA/APC、注册费、截稿期与用户约束：5；
- desk-reject、triage 和竞争风险：5。

以上为默认权重。某维度不适合当前学科或稿件类型时可以调整并说明理由，但总分仍为 100。每项必须给出依据，不能把名气、等级或分区直接等同于匹配度。

### 投稿梯队与报告固定清单

- 首选不超过三个，按投稿顺序排列；
- 稳妥备选不超过三个；可信候选不足时不得为凑满数量降低匹配标准；
- 不建议但容易误选的 2–4 个，并说明范围、费用、收录、类型或时效风险；
- 给出唯一首推及完整理由；
- 为每个首选分析范围、贡献与稿件类型、研究设计与证据、篇幅、规则和表达风险；
- 给出投稿前最后核验事项和拒稿后的顺序化转投路径；
- 直接在当前对话中给出完整中文结果，不生成文件；
- 结果必须包含一句论文类别判断、核验日期、用户约束/默认假设、Manuscript–Venue Profile、候选池、来源、排除过程、评分、梯队、唯一首推、风险、政策摘要、转投路径、未核验信息及“未改模板、未改正文、未生成文件”声明。`,
      en: `### Absolute Boundary for This Round

- Do not change documentclass, packages, author format, bibliography format, columns, visual style, margins, or any template content;
- Do not rewrite title, abstract, Introduction, section names, references, or prose to fit a venue;
- Do not convert the paper to a publisher or conference template;
- Treat manuscript files as read-only inputs. Do not copy, archive, rename, or generate any .tex, .md, or other downloadable file. Report confirmed errors only in the current conversation;
- Do not modify or create a BibTeX library. This round focuses on targeting and official verification.

### Source Priority

1. Official venue and publisher pages;
2. Official Aims and Scope or Call for Papers;
3. Official Guide for Authors, Submission Guidelines, and submission system;
4. Clarivate Master Journal List/JCR, official conference organizers, or the corresponding authoritative index;
5. Official Open Access, APC, registration-fee, and supplementary-material policy pages;
6. DOAJ, Scopus Sources, or SCImago only as secondary aids, never replacements for authoritative indexing or rank evidence.

Every time-sensitive fact must have a clickable source and verification date. Write "Not verified" when official evidence is absent; never guess acceptance rates, review times, fees, or current rules.

### Required Manuscript–Venue Profile Fields

- Begin with exactly one “Manuscript category” sentence covering the primary discipline, subfield, study or article type, core contribution form, and intended readership; for interdisciplinary work, identify the primary submission field and intersecting field;
- Research question, object of study, research design or methodology, evidence form, and primary contributions;
- Theoretical, methodological, empirical, system, application, review, or interdisciplinary character;
- Target readership, main-text scale, number of visuals and references, and supplementary material;
- Evidence strength, strongest selling point, and likely desk-reject/triage risk.

Do not redefine the scientific throughline for targeting.

### Candidate-pool and Verification Fields

- Build a candidate pool proportionate to the field, normally eight to fifteen venues. If fewer credible venues are currently open for submission, use a smaller pool and explain why; never add weakly related venues to meet a quota;
{{publisher_exclusion_bullet}}
- Verify full name, publisher/organizer, official site, specific scope fit, article or track type, current index/rank, main-text/page/figure/abstract/reference limits, appendix and supplementary policy, anonymity, OA/APC or registration cost, additional files, ethics/data/reproducibility rules, submission portal, and key dates;
- State SCIE, SSCI, AHCI, ESCI, JCR quartiles, conference ranks, or another field-specific evaluation only when an authoritative source supports them. Mark a metric “Not applicable” when it does not suit the field or manuscript type;
- Label SJR/Scopus information explicitly and never present it as JCR. Keep CAS and JCR rankings separate with years;
- Never mix current-edition rules with historical editions.

### 100-point Fit Score

- Topical and scope fit: 30;
- Manuscript type and contribution-form fit: 20;
- Research-design and evidence maturity versus venue expectations: 15;
- Target rank or quartile fit: 15;
- Length, figures, and material compatibility: 10;
- OA/APC, registration, deadline, and user constraints: 5;
- Desk-reject, triage, and competition risk: 5.

These are default weights. If a dimension does not fit the field or article type, adjust it with an explicit rationale while keeping the total at 100. Explain every component and do not equate fame, rank, or quartile directly with fit.

### Submission Tiers and Fixed Report Checklist

- Up to three first choices in submission order;
- Up to three safer alternatives; never lower the fit threshold merely to fill a tier;
- Two to four tempting but unsuitable choices, with scope, fee, index, type, or timing risks;
- One top recommendation with complete rationale;
- Scope, contribution and article type, research design and evidence, length, policy, and presentation risks for every first choice;
- Final pre-submission checks and an ordered transfer path after rejection;
- Return the complete Chinese result directly in the current conversation and generate no files;
- The result must contain the one-sentence manuscript category, verification date, user constraints/default assumptions, Manuscript–Venue Profile, candidate pool, sources, exclusion process, scores, tiers, top recommendation, risks, policy summary, transfer path, unverified facts, and a statement that the template and prose were unchanged and no file was generated.`,
    },
  },
};

const reconstructionConstraintSteps = [
  PROMPT_DETAILED_CONSTRAINTS["scientific-positioning"],
  PROMPT_DETAILED_CONSTRAINTS["method-experiments"],
  PROMPT_DETAILED_CONSTRAINTS["narrative-reconstruction"],
] as const;

PROMPT_DETAILED_CONSTRAINTS["full-reconstruction"] = {
  core: {
    zh: `### Step 1 专用规则 · 科学定位与宏观结构

${reconstructionConstraintSteps[0].core.zh}

### Step 2 专用规则 · 方法与实验深度重构

${reconstructionConstraintSteps[1].core.zh}

### Step 3 专用规则 · 前后叙事深度精修

${reconstructionConstraintSteps[2].core.zh}

### Step 4 专用规则 · 原稿质量回归门

- 逐节对照重构前原稿与当前稿，检查是否丢失高价值表达或实验发现、结果解释是否被过度压缩、标题是否更准确且有辨识度；
- 保持术语、语气与写作手法一致，并在报告中记录保留、恢复和不恢复的理由；
- 只对确认退化的位置做融合式修复，不执行模拟审稿、通用语言终审或新的结构重构。`,
    en: `### Step 1 Rules · Scientific Positioning and Macro Structure

${reconstructionConstraintSteps[0].core.en}

### Step 2 Rules · Method and Experiments Reconstruction

${reconstructionConstraintSteps[1].core.en}

### Step 3 Rules · Deep Narrative Refinement

${reconstructionConstraintSteps[2].core.en}

### Step 4 Rules · Source-aware Quality Regression Gate

- Compare the reconstructed manuscript with the original section by section for lost high-value expression or experimental findings, overcompressed result interpretation, and whether the title is more accurate and distinctive;
- Keep terminology, voice, and writing technique consistent, and record why material was retained, restored, or intentionally not restored;
- Repair only confirmed regressions cohesively. Do not conduct a simulated review, a general language audit, or another structural reconstruction.`,
  },
  inlineStyleConstraints: reconstructionConstraintSteps.flatMap(
    (step) => step.inlineStyleConstraints ?? [],
  ),
  inlinePreferenceConstraints: reconstructionConstraintSteps.flatMap(
    (step) => step.inlinePreferenceConstraints ?? [],
  ),
  inlineWordLimits: reconstructionConstraintSteps.flatMap(
    (step) => step.inlineWordLimits ?? [],
  ),
  wordLimit: reconstructionConstraintSteps[0].wordLimit,
  flexibleCoreWordLimit:
    reconstructionConstraintSteps[0].flexibleCoreWordLimit,
  wordLimitPlacement: reconstructionConstraintSteps[0].wordLimitPlacement,
};
