import type {
  LocalizedText,
  PromptTemplate,
} from "./types";

export const COMMON_PROMPT_BLOCKS = {
  evidence: {
    zh: `1. 论文事实只能来自当前 .tex、PDF 中可直接读取的内容、当前 .bib，以及可靠外部来源支持的研究背景。
2. 联网资料只能核验背景、术语、研究缺口、相关工作和 venue 信息，不能替代论文材料推断方法、实验设置、数据或结果。
3. 不得杜撰数据集、划分、指标、随机种子、硬件、超参数、运行次数、显著性、模块、公式、结果、性能提升或失败案例。
4. TeX、PDF、图表或正文数字冲突时，不得自行挑选。记录位置与风险，并采用证据最直接、风险最低的处理；无法判断时删除或弱化结论。
5. 不得把相关性写成因果，把单一设置下的观察写成普适规律，或把未经验证的解释写成既定机制。
6. 禁止宣传性表述。只有证据充分时才使用具体、克制、可核验的比较语言。
7. 最终论文不得遗留 TODO、TBD、虚构引用键、未解释占位符或等待作者补充的伪正文。`,
    en: `1. Manuscript facts may come only from the current .tex, directly inspectable PDF content, the current .bib, and research background supported by reliable external sources.
2. Web research may verify background, terminology, gaps, related work, and venue information. It must not replace manuscript evidence for methods, settings, data, or results.
3. Do not invent datasets, splits, metrics, seeds, hardware, hyperparameters, run counts, significance, modules, equations, results, gains, or failure cases.
4. When TeX, PDF, figures, tables, or prose disagree, do not choose a value arbitrarily. Record the location and risk, then use the most directly supported low-risk treatment. Remove or qualify a claim when the conflict cannot be resolved.
5. Do not turn correlation into causation, a single-setting observation into a general law, or an untested explanation into a confirmed mechanism.
6. Avoid promotional language. Use concrete, restrained, verifiable comparisons only when evidence supports them.
7. The final manuscript must not contain TODO, TBD, invented citation keys, unexplained placeholders, or pseudo-prose awaiting author input.`,
  },
  manuscriptProtection: {
    zh: `1. 沿用当前 .tex 的文档类、宏包、参考文献样式、单双栏、作者信息、自定义命令、图像路径和编译体系。
2. 只有明确编译错误、重复 label、失效引用或语法错误才允许做最小格式修复，并在报告中说明。
3. 尽量保留现有 label、ref、cite、公式编号和算法标签；移动内容时同步维护交叉引用。
4. 不得删除 PDF 中真实存在且承担证据作用的图表。除独立的“重构方法总览框架图”步骤明确要求、且完全基于论文事实生成的 PNG 外，不得生成、虚构或替换图像文件。
5. 最终输出必须是完整、连续、可继续编辑的英文 .tex，而不是 diff、片段或合并建议。
6. 中文分析、问题与修改说明只放在中文报告中，不得混入 TeX。`,
    en: `1. Preserve the current .tex document class, packages, bibliography style, column layout, author block, custom commands, image paths, and compilation system.
2. Make only minimal format repairs for confirmed compilation errors, duplicate labels, broken references, or syntax errors, and document every repair.
3. Preserve labels, refs, cites, equation numbers, and algorithm identifiers where possible. Maintain cross-references whenever content moves.
4. Do not remove figures or tables that exist in the PDF and serve an evidentiary role. Except for the PNG explicitly required by the separate “Reconstruct the Method Overview Figure” step and generated entirely from manuscript facts, do not generate, invent, or replace image files.
5. The final output must be a complete, continuous, editable English .tex file, not a diff, excerpt, or merge instructions.
6. Keep Chinese analysis, open questions, and revision notes in the Chinese report, never inside the TeX.`,
  },
  cohesiveRevision: {
    zh: `1. 禁止补丁式修改：不得保留功能冲突或逻辑断裂的原句，再通过段末补一句、括号补充、免责声明或堆叠转折词进行补救。
2. 先识别当前允许修改范围内的最小完整论证单元——可以是一个句群、一个段落或一个 subsection——再在该单元内整体重组，使问题、claim、证据、解释、边界和过渡自然融合。
3. 修改后的正文应像一次成稿，读者不应看到“原文 + 修补句”的接缝；删除因重组产生的重复、前后冲突和失去功能的过渡。
4. 融合式重写不授权扩大修改范围、改变事实与 claim、补造证据或重写本轮明确冻结的内容；只在获准范围内形成完整、连贯的最终表述。`,
    en: `1. Do not revise by patching. Never retain a functionally conflicting or logically broken sentence and then compensate with an appended sentence, parenthetical qualification, disclaimer, or stack of transition words.
2. Identify the smallest complete argumentative unit allowed by the current scope—a sentence group, paragraph, or subsection—and recompose that unit so the problem, claim, evidence, interpretation, boundary, and transition are integrated naturally.
3. The revision must read as a coherent first-pass final text, with no visible seam between “old prose” and a corrective add-on. Remove repetition, contradictions, and transitions that lose their function after recomposition.
4. Cohesive recomposition does not authorize scope expansion, factual or claim changes, fabricated evidence, or edits to content frozen in this round. Form a complete, continuous final expression only inside the permitted scope.`,
  },
  pdfReview: {
    zh: `完整阅读 PDF，并用页面截图或等价视觉方式检查所有框架图、机制图、实验图、案例图、表格与公式版式。对图检查模块、箭头、输入输出、图例、caption 和正文引用；对表检查行列含义、指标方向、标记、单位、均值/标准差和正文数字。若 TeX 与 PDF 不一致，在报告中给出页码、编号和冲突内容。`,
    en: `Read the complete PDF and visually inspect every framework diagram, mechanism figure, result plot, case figure, table, and rendered equation using page images or an equivalent visual method. For figures, check components, arrows, inputs, outputs, legends, captions, and prose references. For tables, check row and column meanings, metric direction, emphasis marks, units, mean/standard deviation notation, and numbers cited in prose. Report page numbers, identifiers, and exact conflicts whenever TeX and PDF disagree.`,
  },
  citationAndWeb: {
    zh: `1. 写作前提取当前 .bib 的全部 BibTeX key，并完整保留现有条目；最终 TeX 中每个 cite key 都必须真实存在于本轮输出的完整 .bib。
2. 本轮输出的 .bib 必须是一份可直接供下一轮和编译继续使用的完整当前文献库，不得只输出增量建议。仅追加已核验且不重复的新条目；若 TeX 引用新增文献，其准确条目必须同时写入该完整 .bib。
3. 技术事实优先核验原论文、官方论文页、出版社页面、DBLP、Crossref 或作者公开版本。
4. 优先近三年直接相关工作，同时保留必要的奠基文献；不得用仅关键词相似的文献凑数。
5. 每条新增文献都要在报告中说明支持的具体论点、使用位置、与原有 .bib 是否重复及加入理由。
6. 核验标题、作者、年份、venue、DOI 或官方 URL；无法确认的字段宁缺毋滥。除修正已核实的错误外，不得改写现有条目；任何修正都必须在报告中记录。`,
    en: `1. Extract every BibTeX key from the current .bib before drafting and preserve all existing entries. Every cite key in the final TeX must exist in the complete .bib delivered for this round.
2. The delivered .bib must be a complete current library that the next round and compiler can use directly, never a delta-only suggestions file. Append only verified, non-duplicate additions. If the TeX cites a newly found work, include its exact verified entry in that complete .bib.
3. Prefer original papers, official proceedings pages, publisher pages, DBLP, Crossref, or author-hosted versions for technical facts.
4. Prioritize directly relevant work from the last three years while retaining necessary foundations. Do not pad the bibliography with keyword-only matches.
5. For each addition, state in the report the exact claim it supports, where it is used, whether it duplicates the input .bib, and why it was added.
6. Verify title, authors, year, venue, DOI, or official URL. Omit uncertain fields instead of guessing. Do not rewrite existing entries except to correct a verified error, and document every correction in the report.`,
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
      zh: "确定标题与论文品牌缩写，并建立唯一科学主线、术语体系、Claim–Evidence Map 和章节分工。",
      en: "Determine the title and paper brand acronym, then establish one scientific throughline, a stable terminology system, a claim–evidence map, and clear section responsibilities.",
    },
    role: {
      zh: "你是一名熟悉计算机科学顶级会议与高水平期刊评审的资深研究者。本轮是宏观重构轮：把初稿重建为科学问题清晰、术语统一、章节分工合理、证据链完整的论文。",
      en: "You are a senior researcher familiar with leading computer-science conferences and journals. This is the macro-reconstruction round: rebuild the draft around a clear scientific problem, stable terminology, distinct section functions, and a complete evidence chain.",
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
        zh: "会议论文：需要第三层标题时使用 paragraph 而非 subsubsection；paragraph 只命名真实科学单元，普通论述使用连续段落。Related Work 恰好三个单段小节；Method 不单设 Overview；Discussion and Limitations 由三个讨论小节和一个约 100 词的 Limitations 小节组成。",
        en: "Conference paper: when a third-level heading is needed, use paragraph rather than subsubsection; reserve headings for genuine scientific units and develop ordinary exposition as continuous prose. Give Related Work exactly three one-paragraph subsections, omit a standalone Method Overview, and structure Discussion and Limitations as three discussion subsections plus an approximately 100-word Limitations subsection.",
      },
      journal: {
        zh: "期刊论文：目录层级默认止于 subsubsection，其下使用主题句、过渡和自然段，不把叙述功能写成 paragraph 标题。Related Work 恰好三个双段小节；Method 单设恰好两段且不超过 80 词的 Overview，不得复述框架图。",
        en: "Journal paper: stop the heading hierarchy at subsubsection by default, using topic sentences, transitions, and natural paragraphs below it rather than paragraph headings for discourse functions. Give Related Work exactly three two-paragraph subsections and use a standalone, exactly two-paragraph Method Overview capped at 80 words without narrating the framework figure.",
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
          zh: "B. 确定标题与论文品牌缩写",
          en: "B. Determine the Title and Paper Brand Acronym",
        },
        body: {
          zh: "在完整理解论文并稳定科学定位后，直接确定一个最终英文标题和一个 4–7 个字母的论文品牌缩写并写入 TeX。缩写须与方法全称和核心思想自然对应、便于读写与检索，并核查与当前 .bib、最近邻工作及领域常用名称的明显冲突；不提供标题候选。",
          en: "After understanding the full manuscript and stabilizing its scientific position, determine exactly one final English title and one 4–7-letter paper brand acronym, then write both into the TeX. The acronym must map naturally to the full method name and core idea, remain readable and searchable, and be checked for obvious conflicts with the current .bib, nearest-neighbor work, and common names in the field. Do not provide title candidates.",
        },
      },
      {
        heading: {
          zh: "C. 冻结唯一术语体系",
          en: "C. Freeze One Terminology System",
        },
        body: {
          zh: "确定方法全称与上述论文品牌缩写、问题名称、表示、模块、分支、查询、损失、训练/推理、数据集、指标和实验类型的 canonical term；列出禁用变体与必须区分的相近概念。",
          en: "Define canonical terms for the full method name and paper brand acronym, problem, representations, components, branches, queries, losses, training/inference, datasets, metrics, and experiment types. List prohibited variants and nearby concepts that must remain distinct.",
        },
      },
      {
        heading: {
          zh: "D. 重构章节功能与论证顺序",
          en: "D. Rebuild Section Functions and Argument Order",
        },
        body: {
          zh: "让 Abstract 概括完整证据链；Introduction 完成背景、缺口、挑战、方法概览和贡献；Related Work 按研究范式与权衡综合；Method 从问题定义进入核心机制；Experiments 先写数据集与实验设置、再写主结果，后续小节按证据安排消融、机制/效率/参数、案例与定性等分析；Discussion 解释机制、范围与限制且不重复实验结果；Conclusion 收束问题、证据和边界。",
          en: "Make the Abstract summarize the evidence chain; the Introduction establish background, gap, challenges, method overview, and contributions; Related Work synthesize paradigms and trade-offs; Method move from problem definition to core mechanisms; Experiments begin with datasets/setup and main results, then order ablations, mechanism/efficiency/parameter analyses, case studies, and qualitative analyses by evidence; Discussion interpret mechanisms, scope, and limitations without repeating results; and Conclusion close the problem, evidence, and boundaries.",
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
          zh: "F. 核验定位并完成宏观重写",
          en: "F. Verify the Position and Perform the Macro Rewrite",
        },
        body: {
          zh: "联网核验研究缺口、最近邻工作和贡献冲突风险。在当前证据范围内完成全稿宏观重写；语言可暂不追求最终精修，但主线、结构、术语和论证顺序必须稳定。",
          en: "Use web research to verify the gap, nearest-neighbor work, and contribution-overlap risks. Complete the macro rewrite within the available evidence. Sentence-level polish may wait, but the throughline, architecture, terminology, and evidence order must be stable.",
        },
      },
    ],
    deliverables: {
      zh: `生成完整英文 .tex、中文报告和完整当前 BibTeX 文献库。中文报告至少包含：Scientific Positioning Contract、最终标题与论文品牌缩写及依据、一句话主旨与痛点、旧/新主线对照、贡献分层、Claim–Evidence Map、最终术语表、章节功能与预算表、图表角色、结构操作清单、联网核验、新增或修正文献记录、作者需确认项和下一步交接摘要。`,
      en: `Create a complete English .tex, a Chinese report, and a complete current BibTeX library. The report must include the Scientific Positioning Contract, final title and paper brand acronym with rationale, one-sentence thesis and pain point, old/new throughline comparison, contribution hierarchy, Claim–Evidence Map, final terminology table, section-function and budget table, visual roles, structural operation log, web verification, added or corrected bibliography records, author-confirmation items, and a self-contained handoff.`,
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
- 已确定一个最终标题和一个 4–7 个字母的论文品牌缩写。
- 术语、章节功能与图表角色已稳定。
- 未改变模板，未添加无证据内容。
- 已按当前论文风格与附录配置执行。`,
      en: `- The manuscript is organized around one scientific problem and core idea.
- Every primary claim has an evidence location and boundary.
- One final title and one 4–7-letter paper brand acronym have been fixed.
- Terminology, section functions, and visual roles are stable.
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
        zh: "会议论文：需要第三层标题时使用 paragraph 而非 subsubsection；paragraph 只命名真实科学单元，普通论述使用连续段落。Method 不单设 Overview，在合适位置自然引出总体框架；实验设置内用 paragraph 依次组织 Datasets、Evaluation Metrics、Experimental Configuration 和 Baselines。",
        en: "Conference paper: when a third-level heading is needed, use paragraph rather than subsubsection; reserve headings for genuine scientific units and develop ordinary exposition as continuous prose. Use no standalone Method Overview, introduce the framework naturally where it serves the story, and organize Datasets, Evaluation Metrics, Experimental Configuration, and Baselines with paragraph headings inside experimental setup.",
      },
      journal: {
        zh: "期刊论文：目录层级默认止于 subsubsection；其下使用主题句、过渡和自然段，不把 Design Purpose、Question、Observation 等叙述功能写成 paragraph 标题。Method 单设恰好两段、总计不超过 80 词的 Overview，解释科学逻辑但不复述框架图；实验设置内用 subsubsection 依次组织 Datasets、Evaluation Metrics、Experimental Configuration 和 Baselines。",
        en: "Journal paper: stop the heading hierarchy at subsubsection by default; below it, use topic sentences, transitions, and natural paragraphs rather than paragraph headings such as Design Purpose, Question, or Observation. Method has a standalone Overview of exactly two paragraphs and at most 80 words that explains scientific logic without narrating the figure. Inside experimental setup, use subsubsections for Datasets, Evaluation Metrics, Experimental Configuration, and Baselines in that order.",
      },
    },
    tasks: [
      {
        heading: {
          zh: "A. 重构 Method 逻辑",
          en: "A. Reconstruct the Method Logic",
        },
        body: {
          zh: `Method 不得写成说明书、代码文档或操作清单。围绕“问题为什么难 → 现有设计为什么不足 → 为什么需要当前机制 → 机制如何回应问题 → 适用边界”形成融合性的科学故事；不要求每句话机械解释 why。
按当前论文类型规定处理 Overview，再进入核心机制、目标/训练与推理/复杂度；每个机制自然融合设计动机、计算构造、组件接口、作用与边界。`,
          en: `Method must not read like a manual, code document, or procedural checklist. Build an integrated scientific story around why the problem is difficult, why existing designs fall short, why the mechanism is needed, how it addresses the problem, and where it applies; do not force every sentence to state a why.
Follow the current paper type's Overview rule before moving through core mechanisms, objective/training, and inference/complexity. Integrate motivation, construction, interfaces, function, and boundaries naturally for each mechanism.`,
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
          zh: `第一个小节固定为 Datasets and Experimental Setup，内部必须依次覆盖 Datasets、Evaluation Metrics、Experimental Configuration（服务器/硬件、超参数等）和 Baselines。Evaluation Metrics 单独说明每项指标的定义、方向、单位或尺度、聚合方式及其与任务目标的对应关系；第二个小节固定为 Main Results。后续不绑定第三或第四的固定序号，按真实证据组织 Ablation Studies、机制/效率/参数、Case Studies and Qualitative Analysis 等分析。
每个实验小节整体应交代所检验的不确定性、决定性证据、合理解释、与 claim 的关系和证据边界，并根据材料自然分布在连续段落中；小标题命名实验、变量或现象，而不重复 Question、Observation、Interpretation 等叙述功能。不逐单元格朗读。每项消融必须对应明确设计问题，不把普通波动写成确定机制。`,
          en: `Fix Datasets and Experimental Setup as the first subsection, with required Datasets, Evaluation Metrics, Experimental Configuration (including servers/hardware and hyperparameters), and Baselines units in that order. Evaluation Metrics separately defines every metric, its direction, unit or scale, aggregation, and relation to the task objective; fix Main Results as the second subsection. Do not reserve fixed third or fourth positions. Order supported Ablation Studies, mechanism/efficiency/parameter analyses, Case Studies and Qualitative Analysis, and other analyses by evidence.
Across each experiment subsection, establish the uncertainty being tested, decisive evidence, warranted interpretation, relation to the claim, and evidence boundary, distributing these functions naturally across continuous prose. Let headings name experiments, variables, or phenomena rather than repeatedly labeling Question, Observation, or Interpretation. Do not narrate every table cell. Tie each ablation to a clear design question and do not present ordinary variation as a confirmed mechanism.`,
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
- 现有图、表和公式已视觉核对并与正文对齐。
- 本步未提前生成或替换总体框架图。
- Results 不逐项朗读表格，也不提前承担 Discussion 功能。
- 其他章节只做必要同步。`,
      en: `- Method and Experiments were substantively reconstructed, not synonym-swapped.
- Every method, equation, setting, and number is grounded in current materials.
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
      zh: "前后叙事从零重构",
      en: "Narrative Sections from Evidence",
    },
    purpose: {
      zh: "仅以稳定的方法、实验和证据为底稿，从零重写摘要、引言、相关工作、讨论与结论。",
      en: "Rewrite the abstract, introduction, related work, discussion, and conclusion from stable methods, experiments, and evidence.",
    },
    role: {
      zh: "你是一名熟悉计算机科学会议与期刊写作的资深研究者。保持第一步已确定的 Title 不变，把旧 Abstract、Introduction、Related Work、Discussion 和 Conclusion 视为不可复用的措辞，只保留可由 Method、Experiments、图表和可靠引用支持的事实。",
      en: "You are a senior researcher experienced in computer-science conference and journal writing. Preserve the Title fixed in Step 1. Treat the old Abstract, Introduction, Related Work, Discussion, and Conclusion as unusable wording, retaining only facts supported by Method, Experiments, visuals, and reliable citations.",
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
      zh: "允许完全重写 Abstract、Introduction、Related Work、Discussion 和 Conclusion；不得重新生成或改写第一步已确定的 Title 与论文品牌缩写。Method 与 Experiments 原则上冻结，只修复术语、章节引用、图表引用和与新叙事直接冲突的局部句子。不得改变模板。",
      en: "You may completely rewrite Abstract, Introduction, Related Work, Discussion, and Conclusion. Do not regenerate or rewrite the Title or paper brand acronym fixed in Step 1. Treat Method and Experiments as frozen except for terminology, section references, visual references, and local sentences that directly conflict with the new narrative. Preserve the template.",
    },
    styleBranches: {
      conference: {
        zh: "会议论文：Related Work 恰好三个小节且每小节一个普通段落；Discussion and Limitations 先写三个讨论小节，再写一个约 100 词的 Limitations 小节；讨论不重复结果、不引用实验图表，结果数字最多三个。",
        en: "Conference paper: Related Work has exactly three subsections with one ordinary paragraph each. Discussion and Limitations uses three discussion subsections followed by an approximately 100-word Limitations subsection; it does not repeat results or cite experimental visuals and uses at most three result values.",
      },
      journal: {
        zh: "期刊论文：Related Work 恰好三个小节且每小节两个普通段落；Discussion 用三个小节独立解释机制、适用范围、局限与未来方向，同样不重复结果或引用实验图表。",
        en: "Journal paper: Related Work has exactly three subsections with two ordinary paragraphs each. A three-subsection Discussion explains mechanism, scope, limitations, and future directions without repeating results or citing experimental visuals.",
      },
    },
    tasks: [
      {
        heading: {
          zh: "A. 抽取并冻结事实底稿",
          en: "A. Extract and Freeze the Fact Base",
        },
        body: {
          zh: "先从 Method、Experiments、图表和 .bib 抽取可安全复用的任务、问题、核心思想、机制、证据和边界。记录第一步已经确定的 Title、方法全称与论文品牌缩写并保持不变。",
          en: "First extract a safe fact base of task, problem, core idea, mechanisms, evidence, and boundaries from Method, Experiments, visuals, and the .bib. Record and preserve the Title, full method name, and paper brand acronym fixed in Step 1.",
        },
      },
      {
        heading: {
          zh: "B. 从零重写 Abstract",
          en: "B. Rewrite the Abstract from Scratch",
        },
        body: {
          zh: "使用一个连续段落完成背景与缺口、方法桥接、核心思想与必要机制、关键实验发现及受证据支持的意义。不得使用引用、公式、脚注或编号；缩写保持克制，不堆叠正文级专有名词，Results 建议只保留 2–4 个最有代表性的结果数字。",
          en: "Use one continuous paragraph to cover background and gap, a method bridge, the core idea and necessary mechanisms, key experimental findings, and evidence-supported implications. Use no citations, equations, footnotes, or numbering. Keep acronyms sparse, avoid body-level terminology stacks, and preferably retain only two to four representative result values.",
        },
      },
      {
        heading: {
          zh: "C. 从零重写 Introduction 与 Related Work",
          en: "C. Rewrite Introduction and Related Work from Scratch",
        },
        body: {
          zh: `Introduction 依次完成具体任务与现实约束、最相关研究路线与缺口、问题和挑战、方法概览、贡献和论文结构；贡献必须覆盖科学视角、计算实现与实验认识，而非逐模块罗列。
Related Work 恰好三个小节，并按当前论文类型使用单段或双段结构；按研究范式、训练信号、结构假设、效率或泛化权衡综合。每个小节最后用不超过 18 词的无 “we”、无本文方法名总结句收束。先在报告中规划主题和现有 BibTeX key，再写入 TeX；不得逐篇流水账。`,
          en: `Introduction must establish the concrete task and practical constraints, the closest research lines and gap, the problem and challenges, method overview, contributions, and paper organization. Contributions must cover the scientific perspective, computational realization, and experimental insight rather than list modules.
Related Work has exactly three subsections and follows the current paper type's one- or two-paragraph rule. Synthesize paradigms, training signals, structural assumptions, efficiency, or generalization trade-offs. End each subsection with a synthesis sentence of at most 18 words that uses neither “we” nor the method name. Plan themes and existing BibTeX keys in the report before drafting; do not narrate papers one by one.`,
        },
      },
      {
        heading: {
          zh: "D. 从零重写 Discussion 与 Conclusion",
          en: "D. Rewrite Discussion and Conclusion from Scratch",
        },
        body: {
          zh: "Discussion 区分直接证据、合理推断和未验证机制，承担综合解释而不是重复实验结果；不引用 Experiments 中的表格或图片，结果数字原则上不写且最多三个。按当前论文类型组织讨论与局限。Conclusion 用两个功能明确的段落收束问题/思想/证据，再说明意义/边界/未来方向，不引入新主张。",
          en: "Discussion distinguishes direct evidence, reasonable inference, and untested mechanisms and provides synthesis rather than repeating experimental results. Do not cite tables or figures from Experiments; preferably use no result values and never more than three. Follow the current paper type's discussion-and-limitations structure. Use two functionally distinct Conclusion paragraphs: first close the problem, idea, and evidence; then state implications, boundaries, and future directions without new claims.",
        },
      },
      {
        heading: {
          zh: "E. 做全局术语、引用和事实对齐",
          en: "E. Align Global Terminology, Citations, and Facts",
        },
        body: {
          zh: "检查各叙事章节是否和既定标题、Method、Experiments、图表、贡献点及唯一术语体系完全一致。联网核验 Introduction 与 Related Work 的研究缺口；把核验通过且不重复的新条目追加到完整当前 BibTeX，并在报告中记录。",
          en: "Verify that the narrative sections align completely with the fixed title, Method, Experiments, visuals, contributions, and canonical terminology system. Use web research to verify the gap in Introduction and Related Work. Append verified, non-duplicate entries to the complete current BibTeX library and record them in the report.",
        },
      },
    ],
    deliverables: {
      zh: "生成完整英文 .tex、中文报告和完整当前 BibTeX 文献库。报告包含事实底稿、既定标题与论文品牌缩写确认、Abstract 功能表、Introduction 功能表、贡献对照、Related Work 主题与文献簇、Discussion 证据/推断/边界表、Conclusion 功能表、术语对齐、联网核验、新增或修正文献记录、重构清单和下一步交接摘要。",
      en: "Create a complete English .tex, a Chinese report, and a complete current BibTeX library. The report must include the fact base, confirmation of the fixed title and paper brand acronym, Abstract function table, Introduction function table, contribution comparison, Related Work themes and citation clusters, Discussion evidence/inference/boundary table, Conclusion function table, terminology alignment, web verification, added or corrected bibliography records, reconstruction log, and next-step handoff.",
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
      zh: `- 第一步确定的标题与论文品牌缩写保持不变。
- 前后叙事确实从证据底稿重写，而非沿用旧句。
- 新叙事与 Method、Experiments 和图表事实一致。
- 引用 key 全部存在于当前 .bib。
- 未无必要改写 Method 与 Experiments。
- 全文符合当前风格与附录配置。`,
      en: `- The title and paper brand acronym fixed in Step 1 remain unchanged.
- The narrative sections were genuinely rewritten from the evidence base rather than old sentences.
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
      zh: "统一语言、术语、数字与 Claim 强度，并模拟严格审稿人完成终审。",
      en: "Align language, terminology, numbers, and claim strength, then run a strict reviewer-style final audit.",
    },
    role: {
      zh: "你是一名严格的 CS 终稿编辑、方法审稿人、实验审计者和 LaTeX 质量检查者。前四步已经稳定科学主线、正文结构与总体框架图，本步把全文提升到投稿级一致性。",
      en: "You are a strict CS final editor, method reviewer, experiment auditor, and LaTeX quality checker. The scientific throughline, manuscript structure, and overall framework figure are stable after four steps; this step raises the manuscript to submission-level consistency.",
    },
    inputs: {
      zh: `- 最新完整 .tex，优先为第三步输出
- 与其一致的 PDF
- 当前完整 .bib
- 第四步重构的总体框架图 PNG`,
      en: `- The newest complete .tex, preferably the Step 3 output
- Its matching PDF
- The current complete .bib
- The overall-framework PNG reconstructed in Step 4`,
    },
    scope: {
      zh: "允许句子级和局部段落级精修、合并冗余、调整局部顺序、改善过渡、降低过强 claim 和压缩重复。原则上不再改变科学问题、核心思想、方法结构、实验设计与已确定章节功能；严重科学或数字错误必须修正并标为重大修正。",
      en: "You may refine sentences and local paragraphs, merge redundancy, adjust local order, improve transitions, qualify strong claims, and compress repetition. Do not normally change the scientific problem, core idea, method structure, experiment design, or established section functions. Correct serious scientific or numeric errors and mark them as major final-audit revisions.",
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
          en: "Create the final Terminology Consistency Table and enforce canonical terms, the fixed paper brand acronym, first definitions, prohibited variants, redundant acronyms, and concepts that must remain distinct. Verify consistency across title, abstract, prose, figures, tables, captions, equations, and algorithms.",
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
    ],
    deliverables: {
      zh: "生成完整英文 .tex、中文终审报告和完整最终 BibTeX 文献库。报告包含重大修正、术语与缩写表、Cross-Section Redundancy Matrix、Claim–Evidence 表、数字与统计审计、引用审计、图表公式算法与 LaTeX 审计、审稿人攻击测试、不可通过文字解决的风险、新增或修正文献记录、修改清单和投稿目标检索交接摘要。",
      en: "Create a complete English .tex, a Chinese final-audit report, and a complete final BibTeX library. The report must include major revisions, terminology and acronym tables, Cross-Section Redundancy Matrix, Claim–Evidence audit, numeric/statistical audit, citation audit, visual/equation/algorithm/LaTeX audit, reviewer attack test, risks that prose cannot solve, added or corrected bibliography records, revision log, and the submission-targeting handoff.",
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
- 未改变模板和已冻结科学结构。
- 无法用文字解决的风险已诚实保留。`,
      en: `- The manuscript received substantive refinement, not a spelling-only pass.
- Terminology, acronyms, notation, numbers, citations, and claim strength were individually verified.
- Results/Discussion and Abstract/Conclusion no longer duplicate one another.
- The template and frozen scientific structure were preserved.
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
