import type {
  LocalizedText,
  PromptTemplate,
} from "./types";

export const COMMON_PROMPT_BLOCKS = {
  evidence: {
    zh: `1. 论文事实以当前 .tex、可视核查的 PDF、当前 .bib 为准；联网只核验背景、术语、缺口、相关工作与 venue，不能替代论文材料推断方法、设置、数据或结果。
2. 不补造数据集、指标、实验设置、模块、公式、统计、结果、提升或失败案例。TeX、PDF、图表与正文冲突时，记录位置与风险；采用证据最直接的低风险表述，无法判断则弱化结论。
3. 保持 claim 与证据同强度：不把相关性写成因果、局部观察写成普适规律或推断写成已证实机制；比较语言应具体、克制、可核验。
4. 最终稿不得残留 TODO、TBD、虚构 cite key、未解释占位符或待补伪正文。`,
    en: `1. Ground manuscript facts in the current .tex, visually inspectable PDF, and current .bib. Use web research only to verify background, terminology, gaps, related work, and venue information—not to infer methods, settings, data, or results.
2. Invent no datasets, metrics, experimental settings, modules, equations, statistics, results, gains, or failure cases. When TeX, PDF, visuals, and prose conflict, record the location and risk; use the most directly supported low-risk wording and qualify an unresolved claim.
3. Match claim strength to evidence: do not turn correlation into causation, a local observation into a general law, or inference into a confirmed mechanism. Keep comparisons concrete, restrained, and verifiable.
4. Leave no TODO, TBD, invented cite key, unexplained placeholder, or pseudo-prose in the final manuscript.`,
  },
  manuscriptProtection: {
    zh: `1. 沿用当前文档类、宏包、作者块、参考文献样式、自定义命令、单双栏、图像路径和编译体系；只对已确认的编译、语法、重复 label 或失效引用做最小修复并记录。
2. 尽量保留 label、ref、cite、公式编号和算法标识；移动内容时同步维护交叉引用。
3. 保留所有承担证据作用的现有图表。除独立框架图步骤要求的、完全基于论文事实生成的 PNG 外，不生成或替换图片。
4. 交付完整、连续、可编辑的英文 .tex；中文分析与修改说明只进入中文报告。`,
    en: `1. Preserve the document class, packages, author block, bibliography style, custom commands, column layout, image paths, and build system. Make and report only confirmed minimal repairs to compilation, syntax, duplicate labels, or broken references.
2. Preserve labels, refs, cites, equation numbers, and algorithm identifiers where possible; maintain cross-references when content moves.
3. Retain every existing visual that carries evidence. Generate or replace no image except the manuscript-grounded PNG required by the separate framework-figure step.
4. Deliver a complete, continuous, editable English .tex; keep Chinese analysis and revision notes in the Chinese report.`,
  },
  identityGovernance: {
    zh: `默认保留原标题、方法全称与论文品牌缩写。只有当前配置允许，且现有名称存在误导、越界或明显不自然时，才在中文报告中提出少量候选；自动化流程不得静默写入候选。任何标题或品牌变化都必须由作者明确选择，并记录 high-risk diff（原值、候选、依据、风险与授权状态）。科学主线可以随新证据修正，但每次变化都要记录原因和影响，不得因单轮判断永久冻结。`,
    en: `Preserve the current title, full method name, and paper-brand acronym by default. Only when the configuration allows it and the current identity is misleading, overbroad, or clearly unnatural may the Chinese report propose a small candidate set; automation must never apply a candidate silently. Any title or brand change requires explicit author selection and a high-risk diff recording the original, candidate, evidence, risk, and authorization status. The scientific throughline may be revised when later evidence warrants it, but every change must record its reason and impact rather than becoming permanently frozen after one round.`,
  },
  cohesiveRevision: {
    zh: `1. 不做“原文 + 修补句”：先确定允许范围内最小的完整论证单元，再整体融合问题、claim、证据、解释、边界与过渡。
2. 保留准确有力的原表达；只重组确有断裂、冲突或重复的位置，使修改后像一次成稿。
3. 精修不扩大范围、不改变事实与 claim、不补造证据，也不触碰本轮明确保护的内容。`,
    en: `1. Do not produce “old prose plus a patch.” Identify the smallest complete argumentative unit in scope, then integrate its problem, claim, evidence, interpretation, boundary, and transition.
2. Preserve accurate, effective original expression. Recompose only genuine breaks, conflicts, or repetition so the result reads as one coherent draft.
3. Refinement does not expand scope, change facts or claims, fabricate evidence, or touch content protected in this round.`,
  },
  pdfReview: {
    zh: `完整阅读 PDF，并用页面截图或等价视觉方式检查所有框架图、机制图、实验图、案例图、表格与公式版式。对图检查模块、箭头、输入输出、图例、caption 和正文引用；对表检查行列含义、指标方向、标记、单位、均值/标准差和正文数字。若 TeX 与 PDF 不一致，在报告中给出页码、编号和冲突内容。`,
    en: `Read the complete PDF and visually inspect every framework diagram, mechanism figure, result plot, case figure, table, and rendered equation using page images or an equivalent visual method. For figures, check components, arrows, inputs, outputs, legends, captions, and prose references. For tables, check row and column meanings, metric direction, emphasis marks, units, mean/standard deviation notation, and numbers cited in prose. Report page numbers, identifiers, and exact conflicts whenever TeX and PDF disagree.`,
  },
  citationAndWeb: {
    zh: `1. 保留当前 .bib 的全部条目；最终每个 cite key 都必须存在于本轮交付的完整当前文献库，不能只交付增量。
2. 技术事实优先核验原论文、官方论文页、出版社、DBLP、Crossref 或作者公开版本；优先近三年直接相关工作，同时保留必要奠基文献。
3. 仅追加已核验、非重复且确实支撑论点的条目。新增或修正都在报告中记录支持的 claim、位置、理由与元数据来源；不确定字段留空而非猜测。`,
    en: `1. Preserve every current .bib entry. Every final cite key must exist in the complete current BibTeX library delivered for this round, never a delta-only file.
2. Verify technical facts through original papers, official proceedings or publisher pages, DBLP, Crossref, or author versions. Prioritize directly relevant work from the last three years while retaining necessary foundations.
3. Add only verified, non-duplicate sources that support a real claim. Record each addition or correction, its claim and location, rationale, and metadata source; omit uncertain fields rather than guessing.`,
  },
} satisfies Record<string, LocalizedText>;

export const PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    id: "scientific-positioning",
    sourceFile: "Round_1_Scientific_Positioning_and_Structure.md",
    number: 1,
    profile: "manuscript",
    title: {
      zh: "科学定位与结构重构",
      en: "Scientific Positioning & Structure",
    },
    purpose: {
      zh: "审计科学定位，在默认保留论文身份的前提下建立主线、术语体系、Claim–Evidence Map 和章节分工。",
      en: "Audit the scientific position and, while preserving the paper identity by default, establish the throughline, terminology, claim–evidence map, and section responsibilities.",
    },
    role: {
      zh: "你是一名熟悉计算机科学顶级会议与高水平期刊评审的资深研究者。本轮在保留原稿有效论证和优质表达的基础上，完成科学定位与宏观结构的深度精修。",
      en: "You are a senior researcher familiar with leading computer-science conferences and journals. Deeply refine the scientific position and macro structure while preserving sound arguments and strong original expression.",
    },
    inputs: {
      zh: `- 当前最新完整 .tex
- 与其一致的 PDF
- 当前完整 .bib
- 仅在没有完整 PDF 时：支撑正文证据所必需的图像文件`,
      en: `- The current latest complete .tex
- Its matching PDF
- The current complete .bib
- Only when no complete PDF exists: image files necessary to recover manuscript evidence`,
    },
    scope: {
      zh: "允许重排章节和段落、合并重复内容、重写章节开头与主题句、重构贡献、调整 Method 与 Experiments 的分工并建立必要的 Discussion。不得改变模板或添加材料不支持的机制与实验。",
      en: "You may reorder sections and paragraphs, merge repetition, rewrite section openings and topic sentences, rebuild the contribution statement, clarify the division between Method and Experiments, and create a necessary Discussion. Do not change the template or add unsupported mechanisms or experiments.",
    },
    styleBranches: {
      conference: {
        zh: "会议论文采用高密度、claim-first 的写法。需要第三层标题时使用 paragraph；只为独立科学单元设置标题，普通论述保持连续。Related Work 使用三个单段小节；Method 不单设 Overview；Discussion 由模型按证据选择 3–5 个主题小节，Limitations 约 100 词。",
        en: "Conference prose is compact and claim-first. Use paragraph when a third heading level is genuinely needed, and otherwise keep exposition continuous. Related Work uses three one-paragraph subsections; Method has no standalone Overview; the model selects three to five evidence-driven Discussion topics, followed by an approximately 100-word Limitations subsection.",
      },
      journal: {
        zh: "期刊论文采用累积式、解释充分的写法。目录层级默认止于 subsubsection，叙述功能使用主题句与过渡表达。Related Work 使用三个双段小节；Method 单设两段 Overview，篇幅可参考 80 词并按内容调整；Discussion 由模型按证据选择 3–5 个主题小节。",
        en: "Journal prose is cumulative and sufficiently explanatory. Stop the heading hierarchy at subsubsection by default and express discourse functions through topic sentences and transitions. Related Work uses three two-paragraph subsections; Method has a two-paragraph Overview using 80 words only as an optional reference; the model selects three to five evidence-driven Discussion topics.",
      },
    },
    tasks: [
      {
        heading: {
          zh: "A. 建立 Scientific Positioning Contract",
          en: "A. Build the Scientific Positioning Contract",
        },
        body: {
          zh: `明确 Task、Scientific problem、Current gap、Core idea、Computational realization、2–4 个 Primary claims、每个 claim 的证据以及适用边界。
核心思想必须能脱离模块名成立；不得把普通组件直接包装成科学贡献。`,
          en: `Define the Task, Scientific problem, Current gap, Core idea, Computational realization, two to four Primary claims, evidence for each claim, and scope boundaries.
The core idea must remain meaningful without component names. Do not relabel ordinary modules as scientific contributions.`,
        },
      },
      {
        heading: {
          zh: "B. 审计标题与论文品牌缩写",
          en: "B. Audit the Title and Paper Brand Acronym",
        },
        body: {
          zh: "默认保留原标题、方法全称和原缩写，并核查其准确性、自然度与冲突风险。只有当前配置允许且确有误导、越界或明显不自然时，才在中文报告中给出少量候选；不得自动写入 TeX。任何变化都必须由作者明确选择，并附 high-risk diff。",
          en: "Preserve the current title, full method name, and acronym by default, while auditing accuracy, naturalness, and conflict risk. Only when the configuration permits and the identity is misleading, overbroad, or clearly unnatural may the Chinese report offer a small candidate set. Never apply it to TeX automatically. Any change requires explicit author selection and a high-risk diff.",
        },
      },
      {
        heading: {
          zh: "C. 统一术语体系",
          en: "C. Standardize the Terminology System",
        },
        body: {
          zh: "以现有方法全称与论文品牌缩写为默认基准，统一问题、表示、模块、分支、查询、损失、训练/推理、数据集、指标和实验类型的 canonical term；列出禁用变体与必须区分的相近概念。",
          en: "Use the existing full method name and paper brand acronym as the default identity, then define canonical terms for the problem, representations, components, branches, queries, losses, training/inference, datasets, metrics, and experiment types. List prohibited variants and nearby concepts that must remain distinct.",
        },
      },
      {
        heading: {
          zh: "D. 重构章节功能与论证顺序",
          en: "D. Rebuild Section Functions and Argument Order",
        },
        body: {
          zh: "让 Abstract 概括证据链；Introduction 依次建立背景与缺口、今天仍未解决的挑战、回应这些挑战的核心思想和贡献；Related Work 按范式与权衡综合；Method 与 Experiments 保留全部核心机制、协议和发现，并只为实质科学单元设置标题；Discussion 以 3–5 个证据驱动主题解释机制、范围与局限；Conclusion 收束问题、证据和边界。",
          en: "Make the Abstract summarize the evidence chain; let the Introduction move from background and gap to challenges still unresolved today, then to the core idea that answers them and the contributions; synthesize Related Work by paradigms and trade-offs; preserve all core mechanisms, protocols, and findings in Method and Experiments while using headings only for substantive scientific units; use three to five evidence-driven Discussion topics; and close the problem, evidence, and boundaries in Conclusion.",
        },
      },
      {
        heading: {
          zh: "E. 重构图表角色与章节接口",
          en: "E. Rebuild Visual Roles and Section Interfaces",
        },
        body: {
          zh: "为每张框架图、机制图、主结果表、消融表和案例图指定所支持的核心思想或 claim。优化 caption 与正文解释，使图表被解释而不只是被提到；不得重绘或替换文件。",
          en: "Assign every framework figure, mechanism figure, main-results table, ablation table, and case visual to the core idea or claim it supports. Improve captions and prose so each visual is explained rather than merely mentioned. Do not redraw or replace files.",
        },
      },
      {
        heading: {
          zh: "F. 核验定位并完成宏观重构",
          en: "F. Verify the Position and Perform the Macro Reconstruction",
        },
        body: {
          zh: "联网核验研究缺口、最近邻工作和贡献冲突风险。在保留原稿有效论证与优质表达的基础上完成全稿宏观重构；语言可暂不追求最终精修，但主线、结构、术语和论证顺序必须清晰。",
          en: "Use web research to verify the gap, nearest-neighbor work, and contribution-overlap risks. Reconstruct the manuscript at the macro level while preserving sound arguments and strong original expression. Sentence-level polish may wait, but the throughline, architecture, terminology, and evidence order must be clear.",
        },
      },
    ],
    deliverables: {
      zh: `生成完整英文 .tex、中文报告和完整当前 BibTeX 文献库。中文报告至少包含：Scientific Positioning Contract、标题与论文品牌审计（如有候选则附 high-risk diff 和未授权状态）、一句话主旨与痛点、旧/新主线对照、贡献分层、Claim–Evidence Map、术语表、章节功能与可选篇幅建议表、图表角色、结构操作清单、联网核验、文献记录和下一步交接摘要。`,
      en: `Create a complete English .tex, a Chinese report, and a complete current BibTeX library. The report must include the Scientific Positioning Contract; title and paper-brand audit, with a high-risk diff and unauthorized status for any candidate; one-sentence thesis and pain point; old/new throughline comparison; contribution hierarchy; Claim–Evidence Map; terminology table; section functions and budgets; visual roles; structural operations; web verification; bibliography changes; and a self-contained handoff.`,
    },
    fileNames: {
      zh: `<base_name>_round_1_scientific_structure.tex
<base_name>_round_1_report_zh.md
<base_name>_round_1_references.bib`,
      en: `<base_name>_round_1_scientific_structure.tex
<base_name>_round_1_report_zh.md
<base_name>_round_1_references.bib`,
    },
    finalChecks: {
      zh: `- 全文围绕一个科学问题和核心思想组织。
- 每个主要 claim 都有证据位置和边界。
- 默认保留原标题与原缩写；任何候选均未被静默写入，并附 high-risk diff。
- 术语、章节功能与图表角色已稳定。
- Method 与 Experiments 的核心内容未因篇幅建议或结构整理而压缩。
- 未改变模板，未添加无证据内容。
- 已按当前论文风格与附录配置执行。`,
      en: `- The manuscript is organized around one scientific problem and core idea.
- Every primary claim has an evidence location and boundary.
- The original title and acronym were preserved by default; no candidate was silently applied, and every candidate has a high-risk diff.
- Terminology, section functions, and visual roles are stable.
- Core Method and Experiments content was not compressed to satisfy a length suggestion or structural cleanup.
- The template was preserved and no unsupported content was added.
- The current paper style and appendix configuration were followed.`,
    },
  },
  {
    id: "method-experiments",
    sourceFile: "Round_2_Method_and_Experiments_Reconstruction.md",
    number: 2,
    profile: "manuscript",
    title: {
      zh: "方法与实验深度重构",
      en: "Method & Experiments Reconstruction",
    },
    purpose: {
      zh: "让方法、公式、图示与实验形成严格的 Claim–Evidence Chain。",
      en: "Align methods, equations, visuals, and experiments into a rigorous claim–evidence chain.",
    },
    role: {
      zh: "你是一名熟悉当前论文具体 CS 子领域的方法研究者与实验审稿人。以第一步稳定的科学主线为前提，深度重构 Method 与 Experiments。",
      en: "You are a methods researcher and experimental reviewer familiar with the manuscript's CS subfield. Treat the Step 1 scientific throughline as stable and deeply reconstruct Method and Experiments.",
    },
    inputs: {
      zh: `- 最新完整 .tex，优先为第一步输出
- 对应完整 PDF
- 当前完整 .bib`,
      en: `- The newest complete .tex, preferably the Step 1 output
- Its complete matching PDF
- The current complete .bib`,
    },
    scope: {
      zh: "Method 与 Experiments 允许大幅重构。其他章节只为术语、事实与交叉引用一致性做最小同步。没有证据的实现或实验信息必须删除或标记为作者需确认。",
      en: "Method and Experiments may be substantially reconstructed. Make only minimal terminology, fact, and cross-reference updates elsewhere. Remove unsupported implementation or experimental details from the manuscript and flag them for author confirmation.",
    },
    styleBranches: {
      conference: {
        zh: "会议论文采用高密度、claim-first 的写法。目录层级使用 section → subsection → paragraph，但只为独立科学单元设置标题；Method 不单设 Overview，在合适位置自然引出总体框架。实验设置依次覆盖 Datasets、Evaluation Metrics、Experimental Configuration 和 Baselines，不要求四者机械成为标题。",
        en: "Conference prose is compact and claim-first. The available hierarchy is section → subsection → paragraph, but headings are reserved for substantive scientific units. Method has no standalone Overview and introduces the framework where it serves the argument. Experimental setup covers Datasets, Evaluation Metrics, Experimental Configuration, and Baselines in order without mechanically turning all four into headings.",
      },
      journal: {
        zh: "期刊论文采用累积式、解释充分的写法。目录层级默认止于 subsubsection；其下使用主题句、过渡和自然段。Method 单设两段 Overview，总词数可参考 80 词并按内容调整，解释科学逻辑但不复述框架图。实验设置依次覆盖 Datasets、Evaluation Metrics、Experimental Configuration 和 Baselines，只在内容确实构成独立单元时设置 subsubsection。",
        en: "Journal prose is cumulative and sufficiently explanatory. Stop the hierarchy at subsubsection by default and use topic sentences and transitions below it. Method has a two-paragraph Overview using 80 words only as an optional reference and explaining scientific logic without narrating the figure. Experimental setup covers Datasets, Evaluation Metrics, Experimental Configuration, and Baselines in order, using subsubsections only for genuinely independent units.",
      },
    },
    tasks: [
      {
        heading: {
          zh: "A. 重构 Method 逻辑",
          en: "A. Reconstruct the Method Logic",
        },
        body: {
          zh: `Method 围绕“问题为什么难 → 为什么需要当前机制 → 机制如何回应问题 → 适用边界”形成融合性的科学故事，而不是说明书或组件清单。按论文类型处理 Overview，再进入核心机制、目标、训练与推理；每个机制自然融合动机、计算构造、接口、作用与边界。保留全部核心方法内容，只合并重复表达，并避免为每个模块或叙述功能新增标题。`,
          en: `Method must not read like a manual, code document, or procedural checklist. Build an integrated scientific story around why the problem is difficult, why existing designs fall short, why the mechanism is needed, how it addresses the problem, and where it applies; do not force every sentence to state a why.
Follow the current paper type's Overview rule before moving through core mechanisms, objectives, training, and inference. Integrate motivation, construction, interfaces, function, and boundaries naturally. Preserve all core Method content, merge only genuine repetition, and do not create a heading for every component or discourse function.`,
        },
      },
      {
        heading: {
          zh: "B. 审计公式、算法与现有图表接口",
          en: "B. Audit Equations, Algorithms, and Existing Visual Interfaces",
        },
        body: {
          zh: "确保符号在使用前定义，公式有前置动机和后续解释，下标、维度、归一化、mask 和损失权重一致，关键公式被正文引用。同步核对现有框架图与机制图的输入、输出、组件、箭头、训练/推理路径和术语，但本步不生成或替换图片；方法逻辑和前后叙事稳定后，由独立的框架图步骤统一重构。",
          en: "Define notation before use; motivate equations before they appear and explain their role afterward; verify indices, dimensions, normalization, masks, and loss weights; and cite every key equation in prose. Audit the inputs, outputs, components, arrows, training/inference paths, and terminology of existing framework and mechanism figures, but do not generate or replace an image in this step. The separate framework-figure step handles reconstruction after the Method logic and surrounding narrative are stable.",
        },
      },
      {
        heading: {
          zh: "C. 建立 Experiment Question–Evidence Matrix",
          en: "C. Build the Experiment Question–Evidence Matrix",
        },
        body: {
          zh: "在中文报告中，为每项实验写明要回答的问题、使用的数据与设置、指标、比较对象、图表证据、所支持的 claim、证据强度和不能推出的结论。矩阵只用于规划与审计，其列名不得成为 TeX 中重复的小标题或句首标签。实验顺序从总体有效性进入机制、边界与解释。",
          en: "In the Chinese report, record the question, data and setup, metric, comparison, visual evidence, supported claim, evidence strength, and conclusions that cannot be drawn for every experiment. Use the matrix only for planning and audit; never turn its column labels into repeated TeX headings or sentence prefixes. Order experiments from overall effectiveness to mechanisms, boundaries, and interpretation.",
        },
      },
      {
        heading: {
          zh: "D. 重写实验设置、主结果与证据驱动分析",
          en: "D. Rewrite Setup, Main Results, and Evidence-driven Analyses",
        },
        body: {
          zh: `以 Datasets and Experimental Setup 开始，依次覆盖 Datasets、Evaluation Metrics、Experimental Configuration（服务器/硬件、超参数等）和 Baselines；这些是内容功能，不要求逐项成为标题。Evaluation Metrics 说明指标定义、方向、尺度、聚合方式及其与任务目标的关系。随后是 Main Results，其他分析按真实证据安排，不绑定固定序号。
保留全部实验协议、核心结果、不利结果和解释空间。每个实验单元用连续段落交代问题、决定性证据、合理解释、与 claim 的关系和边界；标题只命名真实实验、变量或现象，不把 Question、Observation、Interpretation 等叙述功能升级为标题，也不逐格朗读数字。`,
          en: `Begin with Datasets and Experimental Setup, covering Datasets, Evaluation Metrics, Experimental Configuration (including servers/hardware and hyperparameters), and Baselines in that order. These are content functions, not mandatory headings. Define metric direction, scale, aggregation, and relation to the task objective. Follow with Main Results and order all further analyses by the available evidence rather than fixed positions.
Preserve every protocol, core result, unfavorable result, and necessary interpretive context. Each experiment unit uses continuous prose to establish its question, decisive evidence, warranted interpretation, relation to the claim, and boundary. Headings name genuine experiments, variables, or phenomena—not discourse functions such as Question, Observation, or Interpretation—and prose does not narrate cells one by one.`,
        },
      },
      {
        heading: {
          zh: "E. 核验数字、统计与相关工作",
          en: "E. Verify Numbers, Statistics, and Related Work",
        },
        body: {
          zh: "核对图表、正文、caption 和摘要中的数值、指标方向、单位、均值/标准差及显著性表述。联网核验最相关基线、数据集来源、评价协议和近邻机制；把核验通过且不重复的新条目追加到完整当前 BibTeX，并在报告中记录。",
          en: "Cross-check values, metric direction, units, mean/standard-deviation notation, and significance language across visuals, prose, captions, and abstract. Verify the closest baselines, dataset sources, evaluation protocols, and neighboring mechanisms on the web. Append verified, non-duplicate entries to the complete current BibTeX library and record them in the report.",
        },
      },
    ],
    deliverables: {
      zh: "生成完整英文 .tex、中文报告和完整当前 BibTeX 文献库。报告包含 Method 逻辑图谱、旧/新小节对照、公式符号审计、现有图表与正文接口审计、Experiment Question–Evidence Matrix、实验顺序说明、数字风险、弱化主张、联网核验、新增或修正文献记录、修改清单、作者需确认项和下一轮交接摘要。",
      en: "Create a complete English .tex, a Chinese report, and a complete current BibTeX library. The report must include the Method logic map, old/new subsection comparison, equation and notation audit, existing-visual-to-prose interface audit, Experiment Question–Evidence Matrix, experiment-order rationale, numeric risks, qualified claims, web verification, added or corrected bibliography records, revision log, author-confirmation items, and the next-round handoff.",
    },
    fileNames: {
      zh: `<base_name>_round_2_method_experiments.tex
<base_name>_round_2_report_zh.md
<base_name>_round_2_references.bib`,
      en: `<base_name>_round_2_method_experiments.tex
<base_name>_round_2_report_zh.md
<base_name>_round_2_references.bib`,
    },
    finalChecks: {
      zh: `- Method 与 Experiments 完成实质重构而非同义词替换。
- 所有方法、公式、设置和数字均有当前材料依据。
- 核心方法内容、实验协议与重要发现未被压缩或删除。
- 标题层级只对应实质科学单元，未把论文写成标准文档式清单。
- 现有图、表和公式已视觉核对并与正文对齐。
- 本步未提前生成或替换总体框架图。
- Results 不逐项朗读表格，也不提前承担 Discussion 功能。
- 其他章节只做必要同步。`,
      en: `- Method and Experiments were substantively reconstructed, not synonym-swapped.
- Every method, equation, setting, and number is grounded in current materials.
- Core Method content, experimental protocols, and important findings were neither compressed nor deleted.
- Headings correspond only to substantive scientific units rather than document-style inventory items.
- Existing figures, tables, and equations were visually checked and aligned with prose.
- This step did not prematurely generate or replace the overall framework figure.
- Results neither narrates tables cell by cell nor absorbs the role of Discussion.
- Other sections received only necessary synchronization.`,
    },
  },
  {
    id: "narrative-reconstruction",
    sourceFile: "Round_3_Narrative_Sections_Reconstruction.md",
    number: 3,
    profile: "manuscript",
    title: {
      zh: "前后叙事深度精修",
      en: "Deep Narrative Refinement",
    },
    purpose: {
      zh: "以方法、实验和证据为基准，深度精修摘要、引言、相关工作、讨论与结论，同时保留原稿中准确有力的表达。",
      en: "Deeply refine the abstract, introduction, related work, discussion, and conclusion against the methods, experiments, and evidence while preserving accurate, effective original expression.",
    },
    role: {
      zh: "你是一名熟悉计算机科学会议与期刊写作的资深研究者。以 Method、Experiments、图表和可靠引用为事实基准，对前后叙事做深度精修；保留原稿中准确、有辨识度且与新主线一致的好表达。",
      en: "You are a senior researcher experienced in computer-science conference and journal writing. Use Method, Experiments, visuals, and reliable citations as the fact base, deeply refine the narrative sections, and preserve original wording that is accurate, distinctive, and aligned with the scientific throughline.",
    },
    inputs: {
      zh: `- 最新完整 .tex，优先为第二步输出
- 与其一致的 PDF
- 当前完整 .bib`,
      en: `- The newest complete .tex, preferably the Step 2 output
- Its matching PDF
- The current complete .bib`,
    },
    scope: {
      zh: "允许重组 Abstract、Introduction、Related Work、Discussion 和 Conclusion 的段落与证据顺序，但默认采用深度精修而非清空重写。标题、方法全称与缩写遵循保留优先和 high-risk diff 规则。Method 与 Experiments 只做必要一致性同步，不压缩核心内容。不得改变模板。",
      en: "You may reorganize paragraphs and evidence within Abstract, Introduction, Related Work, Discussion, and Conclusion, but default to deep refinement rather than blank-slate rewriting. The title, full method name, and acronym follow preserve-first and high-risk-diff governance. Synchronize Method and Experiments only as needed for consistency and never compress their core content. Preserve the template.",
    },
    styleBranches: {
      conference: {
        zh: "会议论文采用高密度、claim-first 的叙事。Related Work 使用三个单段小节；Discussion 由模型按证据选择 3–5 个主题小节，并用约 100 词的 Limitations 收束；讨论不重复结果、不引用实验图表，结果数字最多三个。",
        en: "Conference narrative is compact and claim-first. Related Work uses three one-paragraph subsections. The model selects three to five evidence-driven Discussion topics followed by an approximately 100-word Limitations subsection; Discussion does not repeat Results, cite experimental visuals, or use more than three result values.",
      },
      journal: {
        zh: "期刊论文采用累积式、解释充分的叙事。Related Work 使用三个双段小节；Discussion 由模型按证据选择 3–5 个主题小节，解释机制、适用范围、局限与未来方向，不重复结果或引用实验图表。",
        en: "Journal narrative is cumulative and sufficiently explanatory. Related Work uses three two-paragraph subsections. The model selects three to five evidence-driven Discussion topics covering mechanism, scope, limitations, and future directions without repeating Results or citing experimental visuals.",
      },
    },
    tasks: [
      {
        heading: {
          zh: "A. 建立事实底稿与保留清单",
          en: "A. Build the Fact Base and Preservation List",
        },
        body: {
          zh: "从全文抽取任务、问题、核心思想、机制、证据和边界，同时标记原稿中准确、清晰、有辨识度且值得保留的句子与表达。记录当前 Title、方法全称与论文品牌缩写；除非已有作者授权的 high-risk diff，不得替换。",
          en: "Extract the task, problem, core idea, mechanisms, evidence, and boundaries from the manuscript, while marking original sentences and expressions that are accurate, clear, distinctive, and worth preserving. Record the current Title, full method name, and paper brand acronym; do not replace them without an author-authorized high-risk diff.",
        },
      },
      {
        heading: {
          zh: "B. 深度精修 Abstract",
          en: "B. Deeply Refine the Abstract",
        },
        body: {
          zh: "使用一个连续段落完成背景与缺口、方法桥接、核心思想与必要机制、关键实验发现及受证据支持的意义。不得使用引用、公式、脚注或编号；缩写保持克制，不堆叠正文级专有名词，Results 建议只保留 2–4 个最有代表性的结果数字。",
          en: "Use one continuous paragraph to cover background and gap, a method bridge, the core idea and necessary mechanisms, key experimental findings, and evidence-supported implications. Use no citations, equations, footnotes, or numbering. Keep acronyms sparse, avoid body-level terminology stacks, and preferably retain only two to four representative result values.",
        },
      },
      {
        heading: {
          zh: "C. 深度精修 Introduction 与 Related Work",
          en: "C. Deeply Refine Introduction and Related Work",
        },
        body: {
          zh: `Introduction 使用五个核心段落：P1 进入任务与现实约束；P2 综合相关路线并形成缺口；P3 明确今天仍未解决、且真正决定设计的挑战；P4 回答 P3，给出核心思想、总体机制和设计直觉；P5 用贡献句收束，每条默认以 We 开头并对应真实机制与证据。是否增加独立的论文结构导航句由当前配置决定。P3 只定义未解问题，P4 只解释本文如何回应，避免重复。
Related Work 恰好三个小节，并按当前论文类型使用单段或双段结构；按研究范式、训练信号、结构假设、效率或泛化权衡综合。每个小节最后用建议控制在 18 词以内、且不使用 “we” 或本文方法名的总结句收束；必要时可按内容调整。先在报告中规划主题和现有 BibTeX key，再写入 TeX；不得逐篇流水账。`,
          en: `Use five core Introduction paragraphs: P1 enters the task and practical constraints; P2 synthesizes related lines into the gap; P3 states the unresolved challenges that still determine the design today; P4 answers P3 with the core idea, overall mechanism, and design intuition; P5 closes with contribution sentences, each beginning with We by default and aligned with a real mechanism and evidence. Add a separate paper-roadmap sentence only when the current configuration enables it. P3 defines the unresolved problem; P4 explains this paper's response, so they must not repeat each other.
Related Work has exactly three subsections and follows the current paper type's one- or two-paragraph rule. Synthesize paradigms, training signals, structural assumptions, efficiency, or generalization trade-offs. End each subsection with a synthesis sentence that preferably stays within 18 words but may adjust to the content and uses neither “we” nor the method name. Plan themes and existing BibTeX keys in the report before drafting; do not narrate papers one by one.`,
        },
      },
      {
        heading: {
          zh: "D. 深度精修 Discussion 与 Conclusion",
          en: "D. Deeply Refine Discussion and Conclusion",
        },
        body: {
          zh: "Discussion 按现有证据组织 3–5 个主题小节，区分直接证据、合理推断和未验证机制，承担综合解释而不是重复实验结果；不引用 Experiments 中的表格或图片，结果数字原则上不写且最多三个。Conclusion 用两个功能明确的段落收束问题、思想、证据、意义与边界，不引入新主张。",
          en: "Organize Discussion into three to five evidence-driven topic subsections that distinguish direct evidence, reasonable inference, and untested mechanisms, providing synthesis rather than repeating Results. Do not cite experimental tables or figures; preferably use no result values and never more than three. Use two functionally distinct Conclusion paragraphs to close the problem, idea, evidence, implications, and boundaries without new claims.",
        },
      },
      {
        heading: {
          zh: "E. 做全局术语、引用和事实对齐",
          en: "E. Align Global Terminology, Citations, and Facts",
        },
        body: {
          zh: "检查叙事章节是否与当前标题、Method、Experiments、图表、贡献点及术语体系一致。联网核验 Introduction 与 Related Work 的研究缺口；把核验通过且不重复的新条目追加到完整当前 BibTeX，并记录变更。",
          en: "Verify that narrative sections align with the current title, Method, Experiments, visuals, contributions, and terminology. Use web research to verify the Introduction and Related Work gap; append verified non-duplicate entries to the complete current BibTeX and record each change.",
        },
      },
    ],
    deliverables: {
      zh: "生成完整英文 .tex、中文报告和完整当前 BibTeX 文献库。报告包含事实底稿、原稿高价值表达保留清单、标题与品牌治理状态、Abstract/Introduction 功能表、贡献对照、Related Work 文献簇、Discussion 证据边界、术语对齐、联网核验、文献变化、精修清单和下一步交接摘要。",
      en: "Create a complete English .tex, a Chinese report, and a complete current BibTeX library. The report includes the fact base, preservation list for high-value original expression, title/brand governance state, Abstract and Introduction function maps, contribution comparison, Related Work citation clusters, Discussion evidence boundaries, terminology alignment, web verification, bibliography changes, refinement log, and next-step handoff.",
    },
    fileNames: {
      zh: `<base_name>_round_3_narrative_reconstruction.tex
<base_name>_round_3_report_zh.md
<base_name>_round_3_references.bib`,
      en: `<base_name>_round_3_narrative_reconstruction.tex
<base_name>_round_3_report_zh.md
<base_name>_round_3_references.bib`,
    },
    finalChecks: {
      zh: `- 标题与论文品牌遵循保留优先；任何变化均有作者授权和 high-risk diff。
- 前后叙事完成深度精修，并保留原稿中准确有力的表达。
- 新叙事与 Method、Experiments 和图表事实一致。
- 引用 key 全部存在于当前 .bib。
- 未无必要改写 Method 与 Experiments。
- 全文符合当前风格与附录配置。`,
      en: `- The title and paper brand follow preserve-first governance; every change has author authorization and a high-risk diff.
- The narrative sections received deep refinement while preserving accurate, effective original expression.
- The new narrative matches Method, Experiments, and visual evidence.
- Every citation key exists in the current .bib.
- Method and Experiments were not unnecessarily rewritten.
- The manuscript follows the current style and appendix configuration.`,
    },
  },
  {
    id: "framework-figure",
    sourceFile: "Round_4_Framework_Figure_Reconstruction.md",
    number: 4,
    contentKind: "framework-figure",
    profile: "manuscript",
    showStyleDirective: false,
    showAppendixConfiguration: false,
    showLengthBudget: false,
    title: {
      zh: "重构方法总览框架图",
      en: "Reconstruct the Method Overview Figure",
    },
    purpose: {
      zh: "在方法与前后叙事稳定后，只重构一张论文 Overview 总体框架图。",
      en: "Reconstruct only the paper’s overall Method Overview figure after the Method and surrounding narrative are stable.",
    },
    role: {
      zh: "你是一名熟悉 CS 论文方法总览图的信息设计者。",
      en: "You are an information designer specializing in Method Overview figures for CS papers.",
    },
    inputs: {
      zh: "最新完整 .tex 与其编译 PDF。",
      en: "The latest complete .tex and its compiled PDF.",
    },
    scope: {
      zh: "只重构论文的总体方法框架图，不生成引言图或局部技术细节图。",
      en: "Reconstruct only the paper’s overall method framework figure, not an Introduction figure or a local technical-detail figure.",
    },
    tasks: [],
    deliverables: {
      zh: "生成一张可直接下载的总体框架图 PNG。",
      en: "Generate one downloadable overall-framework PNG.",
    },
    fileNames: {
      zh: "<base_name>_round_4_framework_reconstruction.png",
      en: "<base_name>_round_4_framework_reconstruction.png",
    },
    finalChecks: {
      zh: "术语、结构、箭头语义、所选画布比例与缩小后可读性均已核对。",
      en: "Terminology, structure, arrow semantics, the selected canvas ratio, and reduced-size legibility have all been checked.",
    },
  },
  {
    id: "final-refinement",
    sourceFile: "Round_5_Full_Manuscript_Refinement_and_Audit.md",
    number: 5,
    profile: "manuscript",
    showStyleDirective: false,
    showAppendixConfiguration: false,
    showLengthBudget: false,
    title: {
      zh: "全文精修与投稿级终审",
      en: "Full-manuscript Refinement & Final Audit",
    },
    purpose: {
      zh: "统一语言、术语、数字与 Claim 强度，并以原稿为基线完成质量回归终审。",
      en: "Align language, terminology, numbers, and claim strength, then complete a source-aware quality-regression audit.",
    },
    role: {
      zh: "你是一名严格的 CS 终稿编辑、方法审稿人、实验审计者和 LaTeX 质量检查者。本步以最新稿为主要对象、以重构前原稿为质量基线，进行精修、微调和投稿级终审。",
      en: "You are a strict CS final editor, method reviewer, experiment auditor, and LaTeX quality checker. Treat the latest manuscript as the working draft and the pre-reconstruction manuscript as the quality baseline for refinement, local adjustment, and final audit.",
    },
    inputs: {
      zh: `- 最新完整 .tex，优先为第三步输出
- 与其一致的 PDF
- 当前完整 .bib
- 第四步重构的总体框架图 PNG
- 重构前的原始 .tex 与原始 PDF，用于质量回归对照`,
      en: `- The newest complete .tex, preferably the Step 3 output
- Its matching PDF
- The current complete .bib
- The overall-framework PNG reconstructed in Step 4
- The original pre-reconstruction .tex and PDF for quality-regression comparison`,
    },
    scope: {
      zh: "允许句子级与局部段落级精修、去除真实重复、改善过渡并校准 claim。默认不再大幅重构；每项修改都应融合进完整段落，而不是叠加补丁。严重事实或数字错误必须修正并标为重大修正。",
      en: "Refine sentences and local paragraphs, remove genuine redundancy, improve transitions, and calibrate claims. Avoid another broad reconstruction by default, and integrate every change into coherent prose rather than layering patches. Correct serious factual or numeric errors and mark them as major revisions.",
    },
    tasks: [
      {
        heading: {
          zh: "A. 全文语言与段落精修",
          en: "A. Refine Language and Paragraphs",
        },
        body: {
          zh: "逐句检查语法、冠词、单复数、主谓一致、时态、语态、句长、从句、主题句、逻辑连接、重复句首、模糊指代、口语、名词堆叠和宣传性表达。每段只承担一个主要功能，优先使用清晰主动语态与无生命主语。",
          en: "Check grammar, articles, number agreement, subject–verb agreement, tense, voice, sentence length, clause depth, topic sentences, logical links, repetitive openings, vague references, colloquialisms, noun stacking, and promotional wording. Give each paragraph one primary function and prefer clear active constructions and inanimate subjects.",
        },
      },
      {
        heading: {
          zh: "B. 术语、缩写与符号治理",
          en: "B. Govern Terminology, Acronyms, and Notation",
        },
        body: {
          zh: "建立最终 Terminology Consistency Table，落实 canonical term、既定论文品牌缩写、首次定义、禁用变体、冗余缩写和必须区分的概念。检查标题、摘要、正文、图、表、caption、公式和算法是否完全一致。",
          en: "Create the final Terminology Consistency Table covering canonical terms, the current author-approved paper-brand acronym, first definitions, prohibited variants, redundant acronyms, and concepts that must remain distinct. Verify consistency across title, abstract, prose, figures, tables, captions, equations, and algorithms.",
        },
      },
      {
        heading: {
          zh: "C. 跨章节冗余与功能审计",
          en: "C. Audit Cross-section Redundancy and Function",
        },
        body: {
          zh: "检查 Abstract/Introduction、Introduction/Related Work、Method Overview/核心机制、Results/Discussion、Abstract/Conclusion 的复制与功能越界。输出 Cross-Section Redundancy Matrix，并说明删除、合并或保留原因。",
          en: "Audit duplication and functional leakage across Abstract/Introduction, Introduction/Related Work, Method Overview/core mechanisms, Results/Discussion, and Abstract/Conclusion. Return a Cross-Section Redundancy Matrix with reasons for deletion, merging, or retention.",
        },
      },
      {
        heading: {
          zh: "D. Claim–Evidence、数字与统计终审",
          en: "D. Finalize Claim–Evidence, Numeric, and Statistical Audits",
        },
        body: {
          zh: `审计标题、摘要、贡献、Results、Discussion 和 Conclusion 的每个主要 claim：类型、证据位置、充分性、所需限定和泛化/因果风险。
逐项核对正文、图表和摘要中的数字、绝对/相对提升、指标方向、均值/标准差、运行次数、best/second-best、数据规模、效率单位和显著性。不得自行补算无法确认的值。`,
          en: `Audit every major claim in the title, abstract, contributions, Results, Discussion, and Conclusion: type, evidence location, sufficiency, required qualification, and generalization/causality risk.
Cross-check numbers, absolute/relative gains, metric direction, means/standard deviations, run counts, best/second-best marks, dataset sizes, efficiency units, and significance language across prose, visuals, and abstract. Do not recompute values that cannot be verified.`,
        },
      },
      {
        heading: {
          zh: "E. 引用、LaTeX 与模拟审稿人攻击测试",
          en: "E. Audit Citations and LaTeX, Then Run a Reviewer Attack Test",
        },
        body: {
          zh: `逐一核对 citation key 与语义支持，删除 citation dumping；检查所有图表、公式和算法引用、label/ref、caption、自定义命令、路径、占位符和编译警告。环境支持时实际编译，否则不得声称成功。
以严格审稿人视角攻击新意、差异、机制必要性、实验覆盖、公平比较、参数选择、结论边界和局限诚实度。无法通过文字解决的实验缺口必须保留为风险。`,
          en: `Validate every citation key and its semantic support, and remove citation dumping. Check all visual, equation, and algorithm references, labels/refs, captions, custom commands, paths, placeholders, and compilation warnings. Compile when the environment supports it; otherwise do not claim success.
Attack novelty, differentiation, mechanism necessity, experiment coverage, fair comparison, parameter selection, conclusion scope, and honest limitations from a strict reviewer's perspective. Keep experimental gaps that prose cannot solve as explicit risks.`,
        },
      },
      {
        heading: {
          zh: "F. 原稿质量回归门",
          en: "F. Source-aware Quality Regression Gate",
        },
        body: {
          zh: "逐节对照重构前原稿与当前稿，检查是否丢失高价值表达或实验发现、结果解释是否被过度压缩、标题是否更准确且有辨识度、第四轮新框架图是否比旧图更清楚地表达科学主线。只对确认退化的位置做局部融合式修复；保持术语、语气与写作手法一致，并在报告中记录保留、恢复和不恢复的理由。",
          en: "Compare the current manuscript with the pre-reconstruction source section by section. Check for lost high-value expression or experimental findings, overcompressed result interpretation, whether the title remains accurate and distinctive, and whether the new framework figure communicates the scientific throughline more clearly than the old one. Repair only confirmed regressions through localized cohesive edits, preserve terminology and authorial style, and report what was retained, restored, or intentionally not restored.",
        },
      },
    ],
    deliverables: {
      zh: "生成完整英文 .tex、中文终审报告和完整最终 BibTeX 文献库。报告包含重大修正、术语与缩写、跨章节冗余、Claim–Evidence、数字与统计、引用与 LaTeX、审稿人攻击测试、原稿质量回归表、不可通过文字解决的风险、修改清单和投稿目标检索交接摘要。",
      en: "Create a complete English .tex, a Chinese final-audit report, and a complete final BibTeX library. The report includes major revisions; terminology and acronyms; cross-section redundancy; Claim–Evidence, numeric/statistical, citation, and LaTeX audits; reviewer attack test; source-aware quality-regression table; risks prose cannot solve; revision log; and submission-targeting handoff.",
    },
    fileNames: {
      zh: `<base_name>_round_5_final_refinement.tex
<base_name>_round_5_report_zh.md
<base_name>_round_5_references.bib`,
      en: `<base_name>_round_5_final_refinement.tex
<base_name>_round_5_report_zh.md
<base_name>_round_5_references.bib`,
    },
    finalChecks: {
      zh: `- 全文完成实质精修而非拼写检查。
- 术语、缩写、符号、数字、引用和 Claim 强度逐项核验。
- Results 与 Discussion、Abstract 与 Conclusion 不再重复。
- 已与原稿逐节对照，高价值表达、实验发现和必要结果解释未发生无声退化。
- 新框架图相对旧图的科学表达增益已核验；若未改善，已明确记录。
- 未改变模板，所有修复均为局部融合式精修。
- 无法用文字解决的风险已诚实保留。`,
      en: `- The manuscript received substantive refinement, not a spelling-only pass.
- Terminology, acronyms, notation, numbers, citations, and claim strength were individually verified.
- Results/Discussion and Abstract/Conclusion no longer duplicate one another.
- Section-by-section comparison found no silent loss of high-value expression, experimental findings, or necessary result interpretation.
- The new framework figure's scientific communication was compared with the old one and any lack of improvement is recorded.
- The template was preserved and every repair remained localized and cohesive.
- Risks that prose cannot solve remain explicitly documented.`,
    },
  },
  {
    id: "venue-targeting",
    sourceFile: "Submission_Strategy_and_Verification.md",
    number: 1,
    profile: "targeting",
    title: {
      zh: "投稿目标检索与官网核验",
      en: "Venue Targeting & Official Verification",
    },
    purpose: {
      zh: "基于终稿建立候选投稿池，用当前官网信息评估匹配度、规则和风险。",
      en: "Build a submission candidate pool from the final manuscript and verify fit, rules, and risks against current official sources.",
    },
    role: {
      zh: "你是一名熟悉计算机科学会议与期刊投稿、官方规则核验和编辑筛稿逻辑的学术投稿顾问。本轮只做目标检索、核验、评分与投稿顺序，不套模板、不改格式、不重写论文。",
      en: "You are an academic submission adviser experienced in computer-science conferences and journals, official-rule verification, and editorial screening. This round performs targeting, verification, scoring, and submission ordering only. Do not apply templates, change formatting, or rewrite the manuscript.",
    },
    inputs: {
      zh: `- 论文重构最终 .tex
- 与其一致的最终 PDF
- 当前完整 .bib
- 可选：论文重构终审报告
- 可选：目标分区/等级、地区或出版社偏好、OA/APC 上限、截稿时间、页数与投稿周期等约束`,
      en: `- The final reconstructed .tex
- Its matching final PDF
- The current complete .bib
- Optional: the final reconstruction audit report
- Optional: target tier/ranking, regional or publisher preferences, OA/APC ceiling, deadlines, length constraints, and submission-timeline preferences`,
    },
    scope: {
      zh: "所有可能变化的 venue 信息必须联网核验并记录日期。优先官方主页、Aims and Scope/Call for Papers、作者指南、投稿系统、出版社、官方索引与费用页面。第三方页面只能辅助，不能替代官方或权威来源。论文文件只读；结果直接在当前对话中返回，不生成文件。",
      en: "Verify every time-sensitive venue fact online and record the verification date. Prefer official venue pages, Aims and Scope/Call for Papers, author guides, submission systems, publishers, authoritative indexes, and official fee pages. Third-party pages may assist but never replace official or authoritative sources. Treat manuscript files as read-only and return the result directly in the current conversation without generating files.",
    },
    styleBranches: {
      conference: {
        zh: `当前目标为会议。核验候选会议/track 的主题范围、论文类型、匿名与双盲规则、正文页数或字数、参考文献与附录/补充材料政策、双重投稿、伦理与可复现要求、投稿入口、时区、关键日期及当前届次状态。
优先官方 Call for Papers、作者指南和会议组织方页面；历史录取率只能在官方或可核验来源明确提供时记录。不得把旧届规则当作当前届规则。`,
        en: `The current target is a conference. Verify scope and track, paper type, anonymity and double-blind rules, main-text page or word limits, references and appendix/supplement policy, dual-submission rules, ethics and reproducibility requirements, submission portal, time zone, key dates, and current-edition status.
Prioritize the official Call for Papers, author guide, and organizer pages. Record historical acceptance rates only when an official or verifiable source provides them. Never treat a previous edition's rules as current.`,
      },
      journal: {
        zh: `当前目标为期刊。核验期刊全名、出版社、Aims and Scope、当前可投稿状态、文章类型、SCIE/SSCI/ESCI 等收录、可核验的 JCR 年份/类别/分区与 Journal Impact Factor、OA 模式、APC 与币种、篇幅/图表/摘要/参考文献要求、附加文件、投稿入口和数据政策。
不得把 CiteScore、SJR、Scopus 分区写成 JCR Journal Impact Factor 或 JCR 分区，也不得混写中科院分区。若要求综述文章，只能以当前官网 Author Guidelines 或 Article Types 页面明确接受 Review/Survey 为依据，不能仅凭历史上发表过综述推断。审稿周期、出版频率或接收率只有官网明确提供时才记录。`,
        en: `The current target is a journal. Verify full title, publisher, Aims and Scope, current submission status, article type, SCIE/SSCI/ESCI indexing, verifiable JCR year/category/quartile and Journal Impact Factor, OA model, APC and currency, length/figure/abstract/reference requirements, additional files, submission portal, and data policies.
Never present CiteScore, SJR, or Scopus quartiles as the JCR Journal Impact Factor or JCR quartile, and never mix CAS rankings with JCR. If review articles are required, rely only on a current official Author Guidelines or Article Types page that explicitly accepts Review/Survey submissions; prior publication of a review is not sufficient evidence. Record review time, publication frequency, or acceptance rate only when the official site explicitly provides it.`,
      },
    },
    tasks: [
      {
        heading: {
          zh: "A. 建立 Manuscript–Venue Profile",
          en: "A. Build the Manuscript–Venue Profile",
        },
        body: {
          zh: "从终稿提取领域、子领域、任务、数据形态、方法范式、贡献类型、理论/方法/系统/应用属性、目标读者、图表与参考文献规模、补充材料、证据强度、主要卖点和最可能的 desk-reject/triage 风险。不得为了匹配 venue 重新定义论文主线。",
          en: "Extract field, subfield, task, data modality, method paradigm, contribution type, theoretical/method/system/application character, audience, visual and reference scale, supplementary material, evidence strength, strongest selling point, and likely desk-reject/triage risks. Do not redefine the scientific throughline to fit a venue.",
        },
      },
      {
        heading: {
          zh: "B. 先建立候选池，再逐项核验",
          en: "B. Build a Candidate Pool, Then Verify It",
        },
        body: {
          zh: "建立 10–15 个候选，逐项核验名称、官方链接、范围匹配、当前是否正常接收投稿、文章/track 类型、当前收录或等级信息、篇幅与附录政策、费用、额外材料、投稿入口和所有影响投稿的规则。每个当前事实都附官方或权威来源；无法核验就明确写“未核验”。已停刊、仅保留历史页面、转投专用或当前无法正常投稿的 venue 不得进入推荐梯队。MDPI、Hindawi 和 Frontiers 是用户明确排除项，其旗下期刊不得进入候选池、评分或推荐梯队，只在排除记录中注明“用户排除”，不得作无依据的泛化质量定性。",
          en: "Build a pool of 10–15 candidates. For each, verify name, official link, scope fit, whether it is active and currently accepting normal submissions, article/track type, current indexing or ranking information, length and appendix policy, fees, additional materials, submission portal, and every rule that affects submission. Cite an official or authoritative source for each current fact and mark anything unresolved as 'Not verified.' Do not recommend venues that have ceased publication, retain only an archive page, accept transfer-only submissions, or are otherwise not open for normal submission. MDPI, Hindawi, and Frontiers are explicit user exclusions: do not place their journals in the pool, scoring, or recommendation tiers. Record them only as 'excluded by user' without unsupported general quality claims.",
        },
      },
      {
        heading: {
          zh: "C. 评分匹配度与风险",
          en: "C. Score Fit and Risk",
        },
        body: {
          zh: "使用 100 分模型：主题范围 30、贡献类型 20、证据成熟度 15、目标等级/分区 15、篇幅和材料兼容 10、费用/时间约束 5、拒稿或竞争风险 5。逐项给出理由，不能把名气或分区直接等同于匹配度。",
          en: "Use a 100-point model: topical scope 30, contribution type 20, evidence maturity 15, target tier/quartile 15, length and material compatibility 10, fee/timeline constraints 5, and rejection or competition risk 5. Explain every score. Do not equate prestige or quartile directly with fit.",
        },
      },
      {
        heading: {
          zh: "D. 形成投稿梯队与转投路径",
          en: "D. Build Submission Tiers and Transfer Paths",
        },
        body: {
          zh: "给出首选 3 个、稳妥备选 3 个、不建议但容易误选的 2–4 个、唯一首推及理由。为首选逐一分析范围、创新性、实验、篇幅、规则与写作风险，并给出投稿前最后核验事项和被拒后的顺序化转投路径。",
          en: "Return three first-choice venues, three safer alternatives, two to four tempting but unsuitable venues, and one top recommendation with rationale. For each first choice, analyze scope, novelty, evidence, length, policy, and writing risks, then provide final pre-submission checks and an ordered transfer path after rejection.",
        },
      },
      {
        heading: {
          zh: "E. 保持论文文件只读",
          en: "E. Keep Manuscript Files Read-only",
        },
        body: {
          zh: "不得复制、归档、重命名或改写输入论文，也不得生成 .tex、.md 或其他下载文件。若发现明确错误，只在当前对话的中文结果中提出。",
          en: "Do not copy, archive, rename, or rewrite the input manuscript, and do not generate .tex, .md, or other downloadable files. Report confirmed errors only in the Chinese result returned in the current conversation.",
        },
      },
    ],
    deliverables: {
      zh: "直接在当前对话中给出完整中文检索结果，不生成或下载 .tex、.md 或其他文件。结果包含核验日期、约束/假设、Manuscript–Venue Profile、候选池、来源、排除过程、评分、首选/备选/不建议、唯一首推、逐项风险、规则摘要、投稿顺序、转投路径、未核验信息，以及未改稿、未生成文件的声明。",
      en: "Return the complete Chinese targeting result directly in the current conversation; do not generate or download any .tex, .md, or other file. Include the verification date, constraints/assumptions, Manuscript–Venue Profile, candidate pool, sources, exclusion process, scores, first choices, alternatives, unsuitable venues, one top recommendation, itemized risks, policy summary, submission order, transfer path, unverified information, and statements that the manuscript was unchanged and no file was generated.",
    },
    finalChecks: {
      zh: `- 已完整读取终稿并建立真实论文画像。
- 当前 venue 信息均有官方或权威来源与核验日期。
- 未混淆不同索引、分区、届次或历史规则。
- 未声称无法核验的费用、录取率或审稿周期。
- 已给出首选、备选、排除、风险和转投路径。
- 未更换模板、未修改正文、未生成文件。`,
      en: `- The final manuscript was read completely and profiled accurately.
- Every current venue fact has an official or authoritative source and verification date.
- Indexes, quartiles, editions, and historical rules were not conflated.
- No unverified fee, acceptance rate, or review time was claimed.
- First choices, alternatives, exclusions, risks, and transfer paths were provided.
- The template and manuscript prose were not changed, and no file was generated.`,
    },
  },
];

export const RECONSTRUCTION_PROMPTS = PROMPT_TEMPLATES.filter(
  (template) => template.profile === "manuscript",
);

export const SUBMISSION_PROMPT_TEMPLATE = PROMPT_TEMPLATES.find(
  (template) => template.profile === "targeting",
)!;
