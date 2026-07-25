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

export interface PromptConstraintSet {
  core: LocalizedText;
  inlineStyleConstraints?: InlineStyleConstraint[];
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
        zh: "当前配置只允许、并不要求使用附录。若正文能够满足当前适用的总量与章节预算，不得使用附录；只有受限章节仍超额，且逐项分析确认内容并非科学主线所必需时，才可考虑移入附录。除 {{protected_sections}} 外，移动任何内容都不得削弱定义完整性和论证闭环，且正文必须保持自洽。",
        en: "The current configuration permits but does not require an appendix. Do not use one when the main text satisfies every applicable total and section budget. Consider moving material only when a limited section remains over budget and itemized review confirms that it is not essential to the scientific throughline. Outside {{protected_sections}}, no move may weaken complete definitions or argumentative closure, and the main text must remain self-contained.",
      },
      disabled: {
        zh: "当前配置未启用附录：不得把任何内容转移到附录。受限章节超额时，应删除重复、合并非核心叙述或在报告中登记风险，并遵守当前适用的章节预算；若当前模式另有总量或临时上限，也必须遵守。",
        en: "The current configuration disables the appendix. Do not move material outside the main text. When a limited section is over budget, remove repetition, consolidate non-core exposition, or record the risk, while respecting every applicable section budget and any total or temporary ceiling defined by the current mode.",
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

- 在完成全文理解与科学定位后，直接确定一个最终英文标题并写入 TeX，不提供候选标题；
- 标题使用标题式大小写，最多一个冒号，不以句号结尾；准确表达任务、核心思想和适用范围，不使用无证据的性能、优先性或宣传性主张；
- 除非论文范围确实依赖某个数据集，否则标题不写数据集名称；
- 直接确定一个 4–7 个拉丁字母的论文品牌缩写，并与方法全称、核心思想自然对应；优先可读、可发音、易检索，不得为凑字母强造反向缩写；
- 核查该缩写是否与当前 .bib、最近邻工作或本领域常见方法明显冲突；一经确定，全文只使用这一品牌缩写。
{{title_word_limits}}

### 唯一术语体系

- 冻结方法全称和上述论文品牌缩写；
- 冻结科学问题名称及核心表示、模块、分支、查询、损失、训练和推理术语；
- 冻结数据集、指标、比较设置和实验类型名称；
- 列出禁止继续使用的冗余同义词；
- 列出相近但必须区分、不能合并的概念。

### 章节功能与固定结构

{{scientific_document_hierarchy}}
- Abstract：本轮只形成与主线一致的临时版本，第三步将从零重写；
- Introduction：恰好六个连续段落，P1–P6 依次承担背景与任务、相关路线与缺口、问题与挑战、方法概览、三点贡献、论文结构；不得改成七段或八段；
{{scientific_related_work_structure}}
{{scientific_method_structure}}
{{scientific_experiment_structure}}
{{scientific_discussion_structure}}
- Conclusion：恰好两个普通段落；第一段收束问题、核心思想和主要发现，第二段说明意义、边界和未来方向。

### 图表接口与宏观重写边界

- 为框架图、机制图、主结果表、消融表、效率/稳健性/案例图分别指定所支持的核心思想、机制、claim 或边界；
- caption 和正文必须解释图表，而非只提到图表；
- 允许重排章节和段落、合并重复小节、删除偏离主线内容、重写开头与主题句、重构贡献、调整 Method/Experiments 分工并建立独立 Discussion；
- 不得更换模板，不得用新模块或新实验填补证据缺口。

### 中文报告固定清单

报告必须包含：Scientific Positioning Contract、最终标题与论文品牌缩写及其依据、一句话论文主旨、一句话核心痛点、旧/新主线对照、贡献分层、Claim–Evidence Map、最终术语表、章节功能表、图表角色表、删除/合并/移动/新增清单、联网核验、作者需确认项和下一步交接摘要。`,
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

- After understanding the complete manuscript and fixing its scientific position, determine exactly one final English title and write it into the TeX; do not return title candidates;
- Use title case, at most one colon, and no final period. State the task, core idea, and applicable scope accurately without unsupported performance, priority, or promotional claims;
- Do not name a dataset unless the manuscript's scope genuinely depends on it;
- Determine one 4–7-letter paper brand acronym that maps naturally to the full method name and core idea. Prefer a readable, pronounceable, searchable form and never force a backronym merely to fit desired letters;
- Check for obvious conflicts with the current .bib, nearest-neighbor work, and common method names in the field. Once selected, use only this brand acronym throughout.
{{title_word_limits}}

### One Terminology System

- Freeze the full method name and the paper brand acronym defined above;
- Freeze the scientific-problem name and terminology for representations, components, branches, queries, losses, training, and inference;
- Freeze names for datasets, metrics, comparison settings, and experiment types;
- List redundant synonyms that must no longer appear;
- List nearby concepts that must remain distinct and cannot be merged.

### Section Functions and Fixed Structure

{{scientific_document_hierarchy}}
- Abstract: create only a throughline-consistent temporary version; Step 3 rewrites it from scratch;
- Introduction: exactly six consecutive paragraphs. P1–P6 cover background/task, research lines/gap, problem/challenges, method overview, three contributions, and paper organization. Do not create seven or eight paragraphs;
{{scientific_related_work_structure}}
{{scientific_method_structure}}
{{scientific_experiment_structure}}
{{scientific_discussion_structure}}
- Conclusion: exactly two ordinary paragraphs. The first closes the problem, core idea, and main findings; the second states implications, boundaries, and future directions.

### Visual Interfaces and Macro-rewrite Boundary

- Assign framework figures, mechanism figures, main-results tables, ablation tables, and efficiency/robustness/case visuals to the core idea, mechanism, claim, or boundary they support;
- Captions and prose must explain visuals rather than merely mention them;
- You may reorder sections and paragraphs, merge repeated subsections, delete off-throughline content, rewrite openings and topic sentences, rebuild contributions, revise the Method/Experiments division, and create a standalone Discussion;
- Do not change the template or fill evidence gaps with new components or experiments.

### Fixed Chinese-report Checklist

The report must contain the Scientific Positioning Contract, the final title and paper brand acronym with rationale, one-sentence thesis, one-sentence core pain point, old/new throughline comparison, contribution hierarchy, Claim–Evidence Map, final terminology table, section-function table, visual-role table, deletion/merge/move/addition log, web verification, author-confirmation items, and next-step handoff.`,
    },
    inlineStyleConstraints: [
      {
        marker: "scientific_document_hierarchy",
        branches: {
          conference: {
            zh: "- 会议论文目录层级固定为 section → subsection → paragraph，不使用 subsubsection；",
            en: "- Conference-paper hierarchy is section → subsection → paragraph; do not use subsubsection;",
          },
          journal: {
            zh: "- 期刊论文目录层级固定为 section → subsection → subsubsection → paragraph；",
            en: "- Journal-paper hierarchy is section → subsection → subsubsection → paragraph;",
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
            zh: "- Method：通常形成 5–6 个接口清晰的 subsection，包含 Problem Definition、2–3 个核心机制以及目标/训练/推理/复杂度说明；不单设 Overview subsection，应在最合适的位置自然引出总体框架；不得写成说明书，而要围绕 why 形成融合性的科学故事，不要求每句话机械解释 why；不得增加无证据公式、模块或算法；",
            en: "- Method: normally five to six clearly interfaced subsections covering Problem Definition, two to three core mechanisms, and objective/training/inference/complexity. Do not create a standalone Overview subsection; introduce the overall framework naturally where it best serves the argument. Build an integrated scientific story around why rather than a manual, without forcing every sentence to state a why. Add no unsupported equation, component, or algorithm;",
          },
          journal: {
            zh: "- Method：通常形成 5–6 个接口清晰的 subsection，包含 Problem Definition、独立 Overview、2–3 个核心机制以及目标/训练/推理/复杂度说明；Overview 恰好两个普通段落，不得逐项复述框架图；不得写成说明书，而要围绕 why 形成融合性的科学故事，不要求每句话机械解释 why；不得增加无证据公式、模块或算法；\n{{scientific_overview_word_limits}}",
            en: "- Method: normally five to six clearly interfaced subsections covering Problem Definition, a standalone Overview, two to three core mechanisms, and objective/training/inference/complexity. Overview contains exactly two ordinary paragraphs and must not narrate the framework figure item by item. Build an integrated scientific story around why rather than a manual, without forcing every sentence to state a why. Add no unsupported equation, component, or algorithm;\n{{scientific_overview_word_limits}}",
          },
        },
      },
      {
        marker: "scientific_experiment_structure",
        branches: {
          conference: {
            zh: "- Experiments and Results：第一小节必须为 Datasets and Experimental Setup，并依次以 paragraph 设置 Datasets、Experimental Configuration 和 Baselines；第二小节必须为 Main Results。后续小节不绑定固定序号，按真实证据安排 Ablation Studies、机制/效率/参数、Case Studies and Qualitative Analysis、稳健性、敏感性、泛化或错误分析；",
            en: "- Experiments and Results: the first subsection must be Datasets and Experimental Setup, containing Datasets, Experimental Configuration, and Baselines as paragraph headings in that order; the second must be Main Results. Do not bind later subsections to fixed positions; order supported Ablation Studies, mechanism/efficiency/parameter analyses, Case Studies and Qualitative Analysis, robustness, sensitivity, generalization, or error analysis by evidence;",
          },
          journal: {
            zh: "- Experiments and Results：第一小节必须为 Datasets and Experimental Setup，并依次以 subsubsection 设置 Datasets、Experimental Configuration 和 Baselines；第二小节必须为 Main Results。后续小节不绑定固定序号，按真实证据安排 Ablation Studies、机制/效率/参数、Case Studies and Qualitative Analysis、稳健性、敏感性、泛化或错误分析；",
            en: "- Experiments and Results: the first subsection must be Datasets and Experimental Setup, containing Datasets, Experimental Configuration, and Baselines as subsubsections in that order; the second must be Main Results. Do not bind later subsections to fixed positions; order supported Ablation Studies, mechanism/efficiency/parameter analyses, Case Studies and Qualitative Analysis, robustness, sensitivity, generalization, or error analysis by evidence;",
          },
        },
      },
      {
        marker: "scientific_discussion_structure",
        branches: {
          conference: {
            zh: "- Discussion and Limitations：先安排三个承担综合解释、适用范围与科学意义的 discussion subsection，最后单列一个 Limitations subsection。不得复述实验结果，不引用 Experiments 中的表格或图片；具体结果数字最多保留三个，不写数字也可以；\n{{scientific_limitations_word_limits}}",
            en: "- Discussion and Limitations: use three discussion subsections for synthesis, scope, and scientific implications, followed by a separate Limitations subsection. Do not repeat experimental results or cite tables or figures from Experiments; retain at most three specific result values, and using none is acceptable;\n{{scientific_limitations_word_limits}}",
          },
          journal: {
            zh: "- Discussion：独立成节并恰好包含 Mechanistic Interpretation、Scope and Implications、Limitations and Future Directions 三个 subsection；不得复述实验结果，不引用 Experiments 中的表格或图片；具体结果数字最多保留三个，不写数字也可以；",
            en: "- Discussion: a standalone section with exactly three subsections—Mechanistic Interpretation, Scope and Implications, and Limitations and Future Directions. Do not repeat experimental results or cite tables or figures from Experiments; retain at most three specific result values, and using none is acceptable;",
          },
        },
      },
    ],
    inlineWordLimits: [
      {
        marker: "title_word_limits",
        standard: {
          zh: "- 启用字数限制时，标题控制在 8–16 个英文单词。",
          en: "- When a word limit is enabled, keep the title between 8 and 16 English words.",
        },
      },
      {
        marker: "scientific_overview_word_limits",
        standard: {
          zh: "- 启用字数限制时，期刊 Method 的 Overview 总计不超过 80 词。",
          en: "- When a word limit is enabled, cap the journal Method Overview at 80 words in total.",
        },
      },
      {
        marker: "scientific_limitations_word_limits",
        standard: {
          zh: "- 启用字数限制时，会议论文的 Limitations subsection 约 100 词。",
          en: "- When a word limit is enabled, keep the conference-paper Limitations subsection at approximately 100 words.",
        },
      },
    ],
    wordLimitPlacement: "after-budget",
    wordLimit: {
      zh: `### 本步骤临时上限与附录分流规则

- 完整理解当前论文后，把正文重构到与当前目标总字数和章节预算大体一致；
- 当前正式目标不变。本步骤允许正文临时上浮 {{temporary_ceiling_percent}}%，临时上限为 {{temporary_ceiling_words}} 词；该上限不是新的目标字数；
- 对超出正式目标的内容逐项建立“保留正文 / 移入附录 / 删除重复”清单，并说明依据；
- {{appendix_triage_rule}}
- {{protected_sections}} 是正文核心保护区。Method 的问题定义、必要机制、公式接口和训练/推理说明不得因压缩而残缺，也不得移入附录；
- Experiments and Results 的现有内容不得精简、删除、弱化或移入附录，包括实验设置、比较协议、主结果、消融、稳健性、敏感性、定性结果、失败案例和必要解释；
- Abstract 保持为临时版本；其他章节优先删除重复背景、偏离主线的铺陈和重复结论；
- 中文报告必须记录当前总词数、正式目标、临时上限、逐节词数，以及每项保留、删除重复或移入附录的决定；
- 后续步骤仍以当前正式目标和章节预算为最终约束，不得把本步骤的临时上限当作永久篇幅。`,
      en: `### Temporary Ceiling and Appendix-triage Rules for This Step

- After understanding the complete manuscript, reconstruct the main text so that its total and sections broadly align with the current configured budgets;
- The formal target remains unchanged. This step permits a temporary increase of {{temporary_ceiling_percent}}%, producing a temporary ceiling of {{temporary_ceiling_words}} words; this ceiling is not a new target;
- Create an itemized keep-in-main-text / move-to-appendix / remove-duplication ledger for every item above the formal target and justify each decision;
- {{appendix_triage_rule}}
- {{protected_sections}} are protected core sections. Do not make Method's problem definition, necessary mechanisms, equation interfaces, or training/inference description incomplete through compression, and do not move them to the appendix;
- Do not condense, delete, weaken, or move any existing Experiments and Results content to the appendix, including settings, comparison protocols, main results, ablations, robustness, sensitivity, qualitative findings, failure cases, and necessary interpretation;
- Keep Abstract temporary. In other sections, remove repeated background, off-throughline exposition, and repeated conclusions first;
- The Chinese report must record the current total, formal target, temporary ceiling, per-section counts, and every keep, duplication-removal, or appendix-move decision;
- Later steps must return to the current formal target and section budgets. Never treat this temporary ceiling as a permanent length allowance.`,
    },
    flexibleCoreWordLimit: {
      zh: `### 方法与实验不限字数模式

- 因正文没有总量上限，20% 临时上浮规则不适用；
- Method 与 Experiments and Results 必须按科学完整性和证据需要充分保留，不得因篇幅精简、删除、弱化或移入附录；
- {{appendix_triage_rule}}
- 中文报告记录逐节词数、表格与图片折算数、受限章节是否合规，以及每项保留、删除重复或移入附录的决定。`,
      en: `### Unlimited Method and Experiments Mode

- Because there is no main-text cap, the temporary 20% allowance does not apply;
- Preserve Method and Experiments & Results as scientific completeness and evidence require; never condense, delete, weaken, or move their content to the appendix merely for length;
- {{appendix_triage_rule}}
- The Chinese report must record per-section counts, table/figure equivalents, compliance of every limited section, and every keep, duplication-removal, or appendix-move decision.`,
    },
  },
  "method-experiments": {
    core: {
      zh: `### Method 的固定结构约束

1. {{method_document_hierarchy}}
2. Method 不得写成论文说明书、代码文档或逐步操作清单。叙述应围绕“问题为什么难 → 现有设计为什么不足 → 为什么需要当前机制 → 机制如何回应问题 → 适用边界”形成融合性的科学故事；不要求每句话都机械回答 why，而要让动机、设计、计算过程和作用在段落层面自然衔接。
3. Problem Definition 必须定义任务、输入、输出、核心约束和学习目标；只保留必要公式；每个符号在首次使用前或同句定义；符号足够多时可保留 notation table，不得为形式感添加装饰性符号。
4. {{method_overview_structure}}
5. 每个核心机制按“设计目的 → 数学或计算构造 → 与其他组件的接口 → 设计直觉 → 训练或推理中的作用 → 适用边界”展开；不得只复述执行流程，也不得把常规 backbone、标准注意力、常见损失或简单拼接包装成独立贡献。
6. 公式必须先解释后出现，出现后说明作用及与整体目标的关系；关键公式至少被正文引用一次；检查上下标、维度、求和范围、归一化、mask、损失权重和优化目标；只有材料支持时才保留算法或复杂度，训练与推理有差异时必须明确区分。
7. 语言优先一般现在时、主动语态和无生命主语；全章 we 最多出现三次。
8. 核对现有框架图与机制图的输入、输出、模块、箭头、训练/推理路径和术语是否与重构后的 Method 一致；本步不生成或替换总体框架图，统一交由后续独立步骤处理。
{{method_word_limits}}

### Experiments 的固定结构约束

1. 第一个 subsection 必须为 Datasets and Experimental Setup，第二个必须为 Main Results；后续小节不绑定第三或第四的固定序号，应根据证据组织 Ablation Studies、机制/效率/参数分析、Case Studies and Qualitative Analysis、稳健性、敏感性、泛化或错误分析。Ablation Studies 应在材料支持时保留；没有真实案例或消融证据时不得虚构，并须在报告中登记缺口。
2. {{experiment_setup_structure}}
3. Datasets and Experimental Setup 必须覆盖数据来源、划分、规模、任务输入输出、指标及方向、基线家族、公平比较原则，以及材料能够确认的实现细节、随机种子、运行次数、早停、服务器/硬件和超参数。不得默认写入统计显著性或未证实的公平条件。
4. Main Results 按“总体观察 → 与强基线比较 → 跨数据集/指标稳定性 → 证据边界”组织，只选择关键数字，不逐单元格朗读。
5. 每个消融、替换或敏感性设置都必须对应明确设计问题；区分模块必要性、参数选择和训练技巧；没有多随机种子或统计支持时不得把小幅波动解释成确定规律。
6. 结果段落尽量包含“实验问题 → 关键观察 → 解释 → 与核心 claim 的关系 → 边界或例外”。不得重复全部数字、每句都以 Table/Figure 开头、用 higher is better 式空话、提前写 Discussion 的普遍意义或用 significant 表示普通数值差异。
7. 对每张实验图检查 caption 是否解释变量、设置、均值或误差带，图例与术语是否一致，数值是否与表格冲突，正文是否解释趋势，以及视觉证据是否真的支持 claim。
{{experiments_word_limits}}

### 中文报告固定清单

报告必须包含：Method 逻辑图谱、方法小节重构对照、公式与符号审计、现有图表与正文接口审计、Experiment Question–Evidence 表、实验顺序设计、数字与统计风险、删除或弱化的机制主张、联网基线与协议核验、修改清单、作者需确认项和下一轮交接摘要。`,
      en: `### Fixed Constraints for Method

1. {{method_document_hierarchy}}
2. Method must not read like a manuscript manual, code document, or procedural checklist. Build an integrated scientific story around why the problem is difficult, why existing designs are insufficient, why each mechanism is needed, how it addresses the problem, and where it applies. Do not force every sentence to state a why; integrate motivation, design, computation, and function naturally at paragraph level.
3. Problem Definition must define the task, inputs, outputs, central constraints, and learning objective. Keep only necessary equations. Define every symbol before or at first use. Retain a notation table only when notation volume warrants it; never add decorative notation.
4. {{method_overview_structure}}
5. Develop each core mechanism in this order: design purpose → mathematical or computational construction → interfaces → intuition → training or inference role → applicable boundary. Do not merely describe execution steps or package a standard backbone, ordinary attention, common loss, or simple concatenation as an independent contribution.
6. Motivate equations before they appear and explain their role and relation to the overall objective afterward. Cite each key equation at least once. Check indices, dimensions, summation ranges, normalization, masks, loss weights, and optimization objectives. Retain algorithms or complexity only when supported, and distinguish training from inference whenever they differ.
7. Prefer present tense, active voice, and inanimate subjects. Use "we" no more than three times in the entire section.
8. Audit whether the inputs, outputs, components, arrows, training/inference paths, and terminology of existing framework and mechanism figures still match the reconstructed Method. Do not generate or replace the overall framework figure in this step; the separate later step handles it.
{{method_word_limits}}

### Fixed Constraints for Experiments

1. The first subsection must be Datasets and Experimental Setup and the second Main Results. Do not bind later content to fixed third or fourth positions; order supported Ablation Studies, mechanism/efficiency/parameter analyses, Case Studies and Qualitative Analysis, robustness, sensitivity, generalization, or error analysis by evidence. Retain Ablation Studies when the materials support it. Never invent case or ablation evidence; record a missing evidence type as a gap.
2. {{experiment_setup_structure}}
3. Datasets and Experimental Setup must cover data sources, splits, sizes, task inputs/outputs, metric directions, baseline families, fair-comparison principles, and only confirmed implementation details, random seeds, run counts, early stopping, servers/hardware, and hyperparameters. Do not assume significance tests or unverified fairness conditions.
4. Organize Main Results as overall observation → comparison with strong baselines → consistency across datasets/metrics → evidence boundary. Select only decisive numbers and do not narrate every cell.
5. Every removal, replacement, or sensitivity setting must answer a clear design question. Separate component necessity, parameter choice, and training tricks. Without multiple seeds or statistical support, do not turn small variation into a deterministic rule.
6. Each results paragraph should contain experiment question → key observation → interpretation → relation to the core claim → boundary or exception. Do not repeat every number, begin every sentence with Table/Figure, use "higher is better" filler, move broad Discussion claims into Results, or use "significant" for ordinary numerical differences.
7. For every experimental figure, check whether the caption explains variables, settings, means, or error bands; whether legend terminology is consistent; whether values conflict with tables; whether prose interprets the trend; and whether the visual actually supports the claim.
{{experiments_word_limits}}

### Fixed Chinese-report Checklist

The report must contain the Method logic map, old/new Method subsection comparison, equation and notation audit, existing-visual-to-prose interface audit, Experiment Question–Evidence table, experiment-order rationale, numeric/statistical risks, removed or qualified mechanism claims, web verification of baselines and protocols, revision log, author-confirmation items, and next-step handoff.`,
    },
    inlineStyleConstraints: [
      {
        marker: "method_document_hierarchy",
        branches: {
          conference: {
            zh: "会议论文采用 section → subsection → paragraph 层级，不使用 subsubsection；方法细节按科学逻辑而非代码类名组织。",
            en: "Conference papers use section → subsection → paragraph and do not use subsubsection; organize Method by scientific logic rather than code class names.",
          },
          journal: {
            zh: "期刊论文采用 section → subsection → subsubsection → paragraph 层级；方法细节按科学逻辑而非代码类名组织。",
            en: "Journal papers use section → subsection → subsubsection → paragraph; organize Method by scientific logic rather than code class names.",
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
            zh: "在 \\subsection{Datasets and Experimental Setup} 内必须依次设置 \\paragraph{Datasets}、\\paragraph{Experimental Configuration} 和 \\paragraph{Baselines} 三个子标题；其他 paragraph 只有在材料确实需要时才能添加。",
            en: "Inside \\subsection{Datasets and Experimental Setup}, include \\paragraph{Datasets}, \\paragraph{Experimental Configuration}, and \\paragraph{Baselines} in that order. Add another paragraph heading only when the materials genuinely require it.",
          },
          journal: {
            zh: "在 \\subsection{Datasets and Experimental Setup} 内必须依次设置 \\subsubsection{Datasets}、\\subsubsection{Experimental Configuration} 和 \\subsubsection{Baselines}；其他 subsubsection 只有在材料确实需要时才能添加。",
            en: "Inside \\subsection{Datasets and Experimental Setup}, include \\subsubsection{Datasets}, \\subsubsection{Experimental Configuration}, and \\subsubsection{Baselines} in that order. Add another subsubsection only when the materials genuinely require it.",
          },
        },
      },
    ],
    inlineWordLimits: [
      {
        marker: "journal_overview_word_limits",
        standard: {
          zh: "- 启用字数限制时，期刊 Overview 两段合计不超过 80 词。",
          en: "- When a word limit is enabled, cap the two journal Overview paragraphs at 80 words in total.",
        },
      },
      {
        marker: "method_word_limits",
        standard: {
          zh: `- 启用字数限制时，Problem Definition 为 {{problem_definition_min}}–{{problem_definition_max}} 词；Method 总量落在当前配置范围内，每个英文句子不超过 24 词。`,
          en: `- When a word limit is enabled, Problem Definition contains {{problem_definition_min}}–{{problem_definition_max}} words; Method stays within its configured range, and no English sentence exceeds 24 words.`,
        },
        flexibleCore: {
          zh: `- 当前 Method 不设词数范围；Problem Definition 与当前论文类型规定的 Overview 结构仍须满足，每个英文句子不超过 24 词。按机制完整性展开并删除重复，不得为了扩写增加无证据内容。`,
          en: `- Method currently has no word range. Problem Definition and the Overview structure defined for the current paper type still apply, and no English sentence exceeds 24 words. Develop only what mechanism completeness requires, remove repetition, and never add unsupported material merely to expand the section.`,
        },
      },
      {
        marker: "experiments_word_limits",
        standard: {
          zh: `- 启用字数限制时，Experiments and Results 总量落在当前配置范围内，每个英文句子不超过 24 词。`,
          en: `- When a word limit is enabled, Experiments and Results stays within its configured range, and no English sentence exceeds 24 words.`,
        },
        flexibleCore: {
          zh: `- 当前 Experiments and Results 不设词数范围，每个英文句子仍不超过 24 词。按实验协议与证据链需要充分展开并删除重复，不得因篇幅压缩、删除或弱化现有实验内容。`,
          en: `- Experiments and Results currently has no word range, while each English sentence remains at most 24 words. Develop the section as fully as its protocols and evidence chain require, remove repetition, and never condense, delete, or weaken existing experimental content merely for length.`,
        },
      },
    ],
  },
  "narrative-reconstruction": {
    core: {
      zh: `### Abstract 的固定结构

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

### Introduction 的固定六段结构

- 不设置任何子节，恰好六个连续段落，不得改成七段或八段；
- P1 背景与动机：直接进入任务、场景和现实约束，明确说明该问题在当前研究与实际环境中仍然存在，而不是只回顾历史缺口；可使用 6–10 个当前 .bib key，每句最多 3 个；
- P2 最相关路线与缺口：每条路线先概括再说明在本文目标维度上的限制，可使用 4–8 个当前 key；
- P3 问题设定与挑战：最小充分描述输入、输出、约束和目标，不使用公式，明确 2–4 个与 P1/P2 对齐的挑战，可选 3–6 个 key；
- P4 方法概览与设计直觉：第一句必须以 "To ..." 开头并首次引入方法全称与既定论文品牌缩写；从核心思想到 2–3 个必要机制，每个机制对应 P3 挑战，可使用 0–4 个 key；
- P5 贡献与意义：Introduction 中唯一允许使用条目的段落，恰好三点；分别覆盖科学问题或建模视角、计算机制或关键性质、实验发现或可推广认识；不写具体数值，不使用 cite，不得把三个普通模块分别包装成三项贡献；
- P6 论文结构：使用现有 Section ref，只说明组织，不重复章节内容，不使用 cite；
- Introduction 中 we 最多出现六次；P1–P4 可引用，P5–P6 禁止引用；所有 key 必须存在于当前 .bib。
{{introduction_word_limits}}

### Related Work 的固定结构

- 目录层级固定为 section{Related Work} → 恰好三个 subsection；
- 每个 subsection 标题为 3–7 个英文单词并使用标题式大小写；
{{narrative_related_work_structure}}
- 第一句用主动语态和一般现在时概括稳定观察；
- 有且仅有一句用一般过去时描述代表性作者行为；
- 每个 subsection 的最后一句不超过 18 词，必须是对本小节文献的综合分析或总结；只有分析自然支持时才可落到本文定位，但不得出现本文方法名，不得使用 "we"；
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

报告必须包含：从 Method/Experiments 抽取的事实底稿、Abstract 句子功能表、Introduction P1–P6 功能表、三点贡献旧/新对照、Related Work 主题与文献簇、Discussion 的证据/推断/边界表、Conclusion 两段功能表、术语对齐、联网核验、实际重构清单和下一步交接摘要。`,
      en: `### Fixed Structure for the Abstract

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

### Fixed Six-paragraph Structure for Introduction

- Use no subsection and exactly six consecutive paragraphs; never seven or eight;
- P1 Background and motivation: enter the task, setting, and practical constraints directly, and explicitly establish that the problem still exists in today's research and practical landscape rather than merely recounting a historical gap. It may use six to ten current .bib keys, with no more than three per sentence;
- P2 Closest research lines and gap: summarize each line before stating its specific limitation for this paper's objective. It may use four to eight current keys;
- P3 Problem setup and challenges: describe inputs, outputs, constraints, and objective minimally without equations; define two to four challenges aligned with P1/P2; optionally use three to six keys;
- P4 Method overview and intuition: the first sentence must begin with "To ..." and introduce the full method name and fixed paper brand acronym for the first time; move from the core idea to two or three necessary mechanisms, each answering a P3 challenge; use zero to four keys;
- P5 Contributions and significance: the only Introduction paragraph that may use a list, with exactly three items covering the scientific problem/modeling view, computational mechanism/key property, and experimental finding/generalizable insight. Use no specific result value or cite, and do not relabel three ordinary modules as three contributions;
- P6 Paper organization: use existing Section refs, describe organization only, repeat no section content, and use no cite;
- Use "we" no more than six times in Introduction. P1–P4 may cite; P5–P6 may not. Every key must exist in the current .bib.
{{introduction_word_limits}}

### Fixed Structure for Related Work

- Fix the hierarchy as section{Related Work} → exactly three subsections;
- Each subsection title contains three to seven English words in title case;
{{narrative_related_work_structure}}
- The first sentence uses active voice and present tense to summarize a stable observation;
- Exactly one sentence uses simple past tense to describe a representative author action;
- The final sentence of each subsection contains no more than 18 words and synthesizes or summarizes that subsection's literature. It may lead naturally to the paper's position only when the analysis warrants it, but must not name the paper's method or use "we";
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

The report must contain the fact base extracted from Method/Experiments, Abstract sentence-function table, Introduction P1–P6 function table, old/new three-contribution comparison, Related Work themes and citation clusters, Discussion evidence/inference/boundary table, Conclusion two-paragraph function table, terminology alignment, web verification, actual reconstruction log, and next-step handoff.`,
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
            zh: "- 会议论文的 Discussion and Limitations 先设置三个承担综合解释、适用范围与科学意义的 discussion subsection，最后单列一个 Limitations subsection；前三个小节各包含一个或两个普通段落，Limitations 聚焦真实边界而不重复结果；\n{{narrative_limitations_word_limits}}",
            en: "- A conference paper uses three discussion subsections for synthesis, scope, and scientific implications, followed by a separate Limitations subsection. Each of the first three contains one or two ordinary paragraphs; Limitations focuses on real boundaries without repeating results;\n{{narrative_limitations_word_limits}}",
          },
          journal: {
            zh: "- 期刊论文的 Discussion 恰好三个 subsection：Mechanistic Interpretation、Scope and Implications、Limitations and Future Directions；每个小节包含一个或两个普通段落；",
            en: "- A journal paper's Discussion has exactly three subsections—Mechanistic Interpretation, Scope and Implications, and Limitations and Future Directions—with one or two ordinary paragraphs in each;",
          },
        },
      },
    ],
    inlineWordLimits: [
      {
        marker: "abstract_word_limits",
        standard: {
          zh: `- 启用字数限制时，Abstract 为 {{abstract_min}}–{{abstract_max}} 词；Background 每句 16–24 词；Bridge 为 12–18 词；Method 每句 16–24 词；Results 每句 14–22 词；Implication 为 12–18 词。`,
          en: `- When a word limit is enabled, Abstract contains {{abstract_min}}–{{abstract_max}} words; each Background sentence contains 16–24 words; Bridge contains 12–18; each Method sentence 16–24; each Results sentence 14–22; and Implication 12–18.`,
        },
      },
      {
        marker: "introduction_word_limits",
        standard: {
          zh: `- 启用字数限制时，Introduction 总计 {{introduction_min}}–{{introduction_max}} 词，每句不超过 25 词；P1 为 {{intro_p1_min}}–{{intro_p1_max}} 词，P2 为 {{intro_p2_min}}–{{intro_p2_max}} 词，P3 为 {{intro_p3_min}}–{{intro_p3_max}} 词，P4 为 {{intro_p4_min}}–{{intro_p4_max}} 词，P5 为 {{intro_p5_min}}–{{intro_p5_max}} 词，P6 为 {{intro_p6_min}}–{{intro_p6_max}} 词；P5 的三点贡献每点 15–25 词。`,
          en: `- When a word limit is enabled, Introduction totals {{introduction_min}}–{{introduction_max}} words with no sentence over 25 words. P1 contains {{intro_p1_min}}–{{intro_p1_max}} words; P2 {{intro_p2_min}}–{{intro_p2_max}}; P3 {{intro_p3_min}}–{{intro_p3_max}}; P4 {{intro_p4_min}}–{{intro_p4_max}}; P5 {{intro_p5_min}}–{{intro_p5_max}}; and P6 {{intro_p6_min}}–{{intro_p6_max}}. Each of P5's three contribution items contains 15–25 words.`,
        },
      },
      {
        marker: "related_work_word_limits_conference",
        standard: {
          zh: `- 启用字数限制时，Related Work 总计 {{related_work_min}}–{{related_work_max}} 词；每个 subsection 的唯一段落为 {{related_subsection_min}}–{{related_subsection_max}} 词，每句不超过 22 词。`,
          en: `- When a word limit is enabled, Related Work totals {{related_work_min}}–{{related_work_max}} words; each subsection's sole paragraph contains {{related_subsection_min}}–{{related_subsection_max}} words, and no sentence exceeds 22 words.`,
        },
      },
      {
        marker: "related_work_word_limits_journal",
        standard: {
          zh: `- 启用字数限制时，Related Work 总计 {{related_work_min}}–{{related_work_max}} 词；每个 subsection 为 {{related_subsection_min}}–{{related_subsection_max}} 词，每段为 {{related_paragraph_min}}–{{related_paragraph_max}} 词，每句不超过 22 词。`,
          en: `- When a word limit is enabled, Related Work totals {{related_work_min}}–{{related_work_max}} words; each subsection contains {{related_subsection_min}}–{{related_subsection_max}} words, each paragraph {{related_paragraph_min}}–{{related_paragraph_max}}, and no sentence exceeds 22 words.`,
        },
      },
      {
        marker: "narrative_limitations_word_limits",
        standard: {
          zh: "- 启用字数限制时，会议论文的 Limitations subsection 约 100 词。",
          en: "- When a word limit is enabled, keep the conference-paper Limitations subsection at approximately 100 words.",
        },
      },
      {
        marker: "discussion_conclusion_word_limits",
        standard: {
          zh: `- 启用字数限制时，Discussion 总计 {{discussion_min}}–{{discussion_max}} 词；Conclusion 总计 {{conclusion_min}}–{{conclusion_max}} 词，每句不超过 24 词，第一段为 {{conclusion_p1_min}}–{{conclusion_p1_max}} 词，第二段为 {{conclusion_p2_min}}–{{conclusion_p2_max}} 词。`,
          en: `- When a word limit is enabled, Discussion totals {{discussion_min}}–{{discussion_max}} words. Conclusion totals {{conclusion_min}}–{{conclusion_max}} words with no sentence over 24 words; Paragraph 1 contains {{conclusion_p1_min}}–{{conclusion_p1_max}} words and Paragraph 2 {{conclusion_p2_min}}–{{conclusion_p2_max}}.`,
        },
      },
    ],
  },
  "final-refinement": {
    core: {
      zh: `### 全文语言精修逐句检查

- 语法、冠词、单复数、主谓一致、时态和语态；
- 句子是否过长、过碎或包含多层从句；
- 主题句是否明确，段落是否只有一个主要功能；
- 句间和段间是否存在自然逻辑连接；
- 是否频繁使用相同句首或机械平行结构；
- 是否滥用 we、it、this、which 或模糊指代；
- 是否存在口语、宣传、空洞评价或无法核验的泛化；
- 是否把名词堆叠成难以阅读的短语；
- 优先使用一般现在时、主动语态和无生命主语；只有明确历史研究行为才用一般过去时。

### 术语、缩写和跨章节功能治理

- 建立最终 Terminology Consistency Table：canonical term、方法全称和既定论文品牌缩写、模块/表示/查询/分支/损失/数据/指标术语、首次定义、禁用变体、冗余缩写和必须区分的概念；
- 检查标题、摘要、正文、图、表、caption、公式和算法是否完全一致；
- 检查 Abstract 是否复制 Introduction，Introduction 是否提前展开过多方法或数字，Related Work 是否重复 Introduction 或逐篇罗列，Method Overview 是否重复核心机制，Experiments 是否逐项朗读表格，Discussion 是否复述 Results，Conclusion 是否复制 Abstract，三点贡献是否与 Method/Experiments/Conclusion 一致，同一局限是否多处重复；
- 输出 Cross-Section Redundancy Matrix，说明删除、合并或保留原因。

### Claim–Evidence 终审

对标题、摘要、Introduction、贡献、Results、Discussion 和 Conclusion 的每个主要 claim 标记：

- claim 类型：事实、实验观察、机制解释、推断或普遍性主张；
- 证据位置：表、图、公式、案例或引用；
- 证据是否充分；
- 是否需要降级为 suggests、indicates、is consistent with 等克制表达；
- 是否存在单一设置泛化、因果化、选择性报告或公平比较风险。

证据不足的 claim 必须删除、缩小或明确限定。

### 数字、引用与 LaTeX 终审

- 核对正文、表格、图和摘要中的所有数字，百分数、小数，绝对/相对提升，均值/标准差，随机种子和运行次数，指标方向，best/second-best，数据规模与划分，参数量、FLOPs、延迟、吞吐量、显存单位和显著性术语；
- 逐一解析 cite key 并与 .bib 校验，检查语义支持，删除 citation dumping、重复和无关引用，检查近三年覆盖及最近邻工作；
- 检查所有图表、公式和算法是否被正文引用，label 是否唯一、ref 是否有效、caption 是否自包含且克制、图例与符号是否解释、公式维度与编号是否一致、表格是否有未解释列、是否遗留占位符或编译警告；
- 环境支持时实际编译并报告；无法编译时不得声称成功。

### 模拟审稿人攻击测试

逐项攻击并处理：科学新意是否只是模块拼接、核心思想是否区别于现有工作、机制是否有必要性解释、实验是否支持全部贡献、是否缺少关键消融或公平比较、参数是否在测试集上选择、结论是否超出证据、Discussion/Limitations 是否诚实、标题和摘要是否过度包装。无法通过文字修复的实验缺口必须保留在报告中。

### 中文报告固定清单

报告必须包含：终审摘要与重大修正、Terminology Consistency Table、缩写首次定义与冗余缩写表、Cross-Section Redundancy Matrix、Claim–Evidence 表、数字统计表、引用键与语义支持审计、图表/公式/算法/LaTeX 审计、审稿人攻击测试、无法通过文字解决的风险、联网核验与最终 BibTeX 建议、逐章节修改清单和投稿目标检索交接摘要。`,
      en: `### Sentence-by-sentence Language Checks

- Grammar, articles, singular/plural form, subject–verb agreement, tense, and voice;
- Sentences that are too long, too fragmented, or contain excessive clause depth;
- Clear topic sentences and one primary function per paragraph;
- Natural logical links between sentences and paragraphs;
- Repetitive sentence openings or mechanical parallelism;
- Overuse of we, it, this, which, or vague references;
- Colloquial, promotional, empty evaluative, or unverifiable generalizing language;
- Unreadable noun stacks;
- Prefer present tense, active voice, and inanimate subjects. Use past tense only for explicit historical research actions.

### Terminology, Acronym, and Cross-section Function Governance

- Build the final Terminology Consistency Table covering canonical terms, the full method name and fixed paper brand acronym, component/representation/query/branch/loss/data/metric terminology, first definitions, prohibited variants, redundant acronyms, and concepts that must remain distinct;
- Check complete consistency across title, abstract, prose, figures, tables, captions, equations, and algorithms;
- Check whether Abstract copies Introduction; Introduction reveals excessive method detail or numbers; Related Work repeats Introduction or narrates papers; Method Overview repeats mechanism subsections; Experiments reads tables cell by cell; Discussion repeats Results; Conclusion copies Abstract; the three contributions align with Method/Experiments/Conclusion; and the same limitation appears repeatedly;
- Return a Cross-Section Redundancy Matrix explaining every deletion, merge, or retention.

### Final Claim–Evidence Audit

For every major claim in title, abstract, Introduction, contributions, Results, Discussion, and Conclusion, label:

- Claim type: fact, experimental observation, mechanistic explanation, inference, or generality claim;
- Evidence location: table, figure, equation, case, or citation;
- Evidence sufficiency;
- Whether it must be downgraded to suggests, indicates, is consistent with, or another restrained form;
- Risks of single-setting generalization, causality, selective reporting, or unfair comparison.

Delete, narrow, or explicitly qualify any under-supported claim.

### Final Numeric, Citation, and LaTeX Audit

- Cross-check every number in prose, tables, figures, and abstract; percentages and decimals; absolute/relative gains; means/standard deviations; seeds and run counts; metric directions; best/second-best marks; dataset sizes and splits; parameter counts, FLOPs, latency, throughput, memory units; and significance terminology;
- Resolve every cite key against the .bib, check semantic support, remove citation dumping, duplication, and irrelevance, and inspect recent-work and nearest-neighbor coverage;
- Check that every figure, table, equation, and algorithm is cited; labels are unique; refs work; captions are self-contained and restrained; legends and symbols are explained; equation dimensions and numbering agree; table columns are explained; and no placeholder or compilation warning remains;
- Compile and report the result when supported. Never claim successful compilation when compilation was unavailable.

### Simulated Reviewer Attack Test

Attack and address whether the novelty is only module assembly, the core idea is distinguished from prior work, mechanisms have necessity arguments, experiments support every contribution, decisive ablations or fair comparisons are missing, parameters were chosen on test data, conclusions exceed evidence, Discussion/Limitations are honest, and title/abstract overpackage the work. Keep experimental gaps that prose cannot repair in the report.

### Fixed Chinese-report Checklist

The report must contain the final-audit summary and major revisions, Terminology Consistency Table, first-definition and redundant-acronym table, Cross-Section Redundancy Matrix, Claim–Evidence table, numeric/statistical table, citation-key and semantic-support audit, visual/equation/algorithm/LaTeX audit, reviewer attack test, risks prose cannot solve, web verification and final BibTeX suggestions, section-by-section revision log, and the submission-targeting handoff.`,
    },
  },
  "venue-targeting": {
    core: {
      zh: `### 本轮绝对边界

- 不得改变 documentclass、宏包、作者格式、参考文献格式、单双栏、图表样式、页边距或任何模板内容；
- 不得为了匹配 venue 改写标题、摘要、Introduction、章节名、参考文献或正文；
- 不得转换到出版社或会议模板；
- 论文文件只作为只读输入；不得复制、归档、重命名或生成任何 .tex、.md 或其他下载文件。发现明确错误只在当前对话中提出；
- 本轮不再生成新增 BibTeX，重点是目标筛选和官网核验。

### 来源优先级

1. venue 官方主页与出版社页面；
2. 官方 Aims and Scope 或 Call for Papers；
3. 官方 Guide for Authors、Submission Guidelines 和投稿系统；
4. Clarivate Master Journal List/JCR、会议官方组织方或其他对应权威索引；
5. 官方 Open Access、APC、注册费和补充材料政策页；
6. DOAJ、Scopus Sources 或 SCImago 只能作为辅助，不得替代权威收录或等级判断。

每个可能变化的事实必须附可点击来源并记录核验日期。没有官方数据就写“未核验”，不得猜测接收率、审稿周期、费用或当前规则。

### Manuscript–Venue Profile 必查字段

- 领域与子领域、任务、数据形态、方法范式和主要贡献；
- 理论、方法、系统、应用或跨学科属性；
- 目标读者、正文规模、图表数量、参考文献数量和补充材料；
- 证据强度、最可能的卖点和最可能的 desk-reject/triage 风险。

不得为了目标筛选重新定义论文科学主线。

### 候选池与核验字段

- 建立不少于 10 个、最多 15 个候选；
- MDPI、Hindawi 和 Frontiers 是用户明确排除的出版社：其旗下期刊不得进入候选池、评分或推荐梯队，只在排除记录中注明“用户排除”，不得对出版社作无依据的泛化质量定性；
- 逐项核验全名、出版社/组织方、官网、范围匹配点、文章或 track 类型、当前索引/等级、正文/页数/图表/摘要/参考文献限制、附录与补充材料、匿名政策、OA/APC 或注册费用、附加文件、伦理/数据/可复现政策、投稿入口和关键日期；
- 只有权威来源支持时才写 SCIE、SSCI、ESCI、JCR 分区或会议等级；
- SJR/Scopus 信息必须明确标注，不能冒充 JCR；中科院分区与 JCR 必须分开并标注年份；
- 当前届与历史届规则不得混用。

### 100 分匹配评分

- 主题与范围匹配：30；
- 论文类型与方法贡献匹配：20；
- 实验证据与 venue 期望匹配：15；
- 目标等级或分区匹配：15；
- 长度、图表与材料兼容：10；
- OA/APC、注册费、截稿期与用户约束：5；
- desk-reject、triage 和竞争风险：5。

每项必须给出理由，不能把名气、等级或分区直接等同于匹配度。

### 投稿梯队与报告固定清单

- 首选三个，按投稿顺序排列；
- 稳妥备选三个；
- 不建议但容易误选的 2–4 个，并说明范围、费用、收录、类型或时效风险；
- 给出唯一首推及完整理由；
- 为每个首选分析范围、创新性、实验、篇幅、规则和写作风险；
- 给出投稿前最后核验事项和拒稿后的顺序化转投路径；
- 直接在当前对话中给出完整中文结果，不生成文件；
- 结果必须包含核验日期、用户约束/默认假设、Manuscript–Venue Profile、候选池、来源、排除过程、评分、梯队、唯一首推、风险、政策摘要、转投路径、未核验信息及“未改模板、未改正文、未生成文件”声明。`,
      en: `### Absolute Boundary for This Round

- Do not change documentclass, packages, author format, bibliography format, columns, visual style, margins, or any template content;
- Do not rewrite title, abstract, Introduction, section names, references, or prose to fit a venue;
- Do not convert the paper to a publisher or conference template;
- Treat manuscript files as read-only inputs. Do not copy, archive, rename, or generate any .tex, .md, or other downloadable file. Report confirmed errors only in the current conversation;
- Do not create further BibTeX suggestions. This round focuses on targeting and official verification.

### Source Priority

1. Official venue and publisher pages;
2. Official Aims and Scope or Call for Papers;
3. Official Guide for Authors, Submission Guidelines, and submission system;
4. Clarivate Master Journal List/JCR, official conference organizers, or the corresponding authoritative index;
5. Official Open Access, APC, registration-fee, and supplementary-material policy pages;
6. DOAJ, Scopus Sources, or SCImago only as secondary aids, never replacements for authoritative indexing or rank evidence.

Every time-sensitive fact must have a clickable source and verification date. Write "Not verified" when official evidence is absent; never guess acceptance rates, review times, fees, or current rules.

### Required Manuscript–Venue Profile Fields

- Field and subfield, task, data modality, method paradigm, and primary contributions;
- Theoretical, methodological, system, application, or interdisciplinary character;
- Target readership, main-text scale, number of visuals and references, and supplementary material;
- Evidence strength, strongest selling point, and likely desk-reject/triage risk.

Do not redefine the scientific throughline for targeting.

### Candidate-pool and Verification Fields

- Build no fewer than 10 and no more than 15 candidates;
- MDPI, Hindawi, and Frontiers are explicit user exclusions. Do not place journals from these publishers in the candidate pool, scoring, or recommendation tiers. Record them only as “excluded by user” and do not make unsupported general quality claims about the publishers;
- Verify full name, publisher/organizer, official site, specific scope fit, article or track type, current index/rank, main-text/page/figure/abstract/reference limits, appendix and supplementary policy, anonymity, OA/APC or registration cost, additional files, ethics/data/reproducibility rules, submission portal, and key dates;
- State SCIE, SSCI, ESCI, JCR quartiles, or conference ranks only when an authoritative source supports them;
- Label SJR/Scopus information explicitly and never present it as JCR. Keep CAS and JCR rankings separate with years;
- Never mix current-edition rules with historical editions.

### 100-point Fit Score

- Topical and scope fit: 30;
- Paper type and methodological contribution fit: 20;
- Experimental evidence versus venue expectations: 15;
- Target rank or quartile fit: 15;
- Length, figures, and material compatibility: 10;
- OA/APC, registration, deadline, and user constraints: 5;
- Desk-reject, triage, and competition risk: 5.

Explain every component. Do not equate fame, rank, or quartile directly with fit.

### Submission Tiers and Fixed Report Checklist

- Three first choices in submission order;
- Three safer alternatives;
- Two to four tempting but unsuitable choices, with scope, fee, index, type, or timing risks;
- One top recommendation with complete rationale;
- Scope, novelty, experiment, length, policy, and writing risks for every first choice;
- Final pre-submission checks and an ordered transfer path after rejection;
- Return the complete Chinese result directly in the current conversation and generate no files;
- The result must contain verification date, user constraints/default assumptions, Manuscript–Venue Profile, candidate pool, sources, exclusion process, scores, tiers, top recommendation, risks, policy summary, transfer path, unverified facts, and a statement that the template and prose were unchanged and no file was generated.`,
    },
  },
};
