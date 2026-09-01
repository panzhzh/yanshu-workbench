import type { Language } from "../../config";
import type {
  LocalizedText,
  WorkbenchCopy,
  WorkbenchDefinition,
  WorkbenchValues,
} from "../../workbench/types";

const text = (zh: string, en: string): LocalizedText => ({ zh, en });

function scalar(values: Readonly<WorkbenchValues>, id: string) {
  return String(values[id] ?? "").trim();
}

function selected(values: Readonly<WorkbenchValues>, id: string) {
  return Array.isArray(values[id]) ? (values[id] as readonly string[]) : [];
}

const FOCUS_AREAS = {
  redundancy: text("冗余与重复", "Redundancy and repetition"),
  "ai-patterns": text("明显的 AI 写作痕迹", "Obvious AI writing patterns"),
  defensive: text("过于防御性的写作", "Overly defensive writing"),
  terminology: text("术语、符号和命名一致性", "Terminology, notation, and naming consistency"),
  language: text("语言质量", "Language quality"),
  displays: text("图表与 Caption", "Figures, tables, and captions"),
};

function sharedCopy(seed: Record<Language, Pick<WorkbenchCopy, "eyebrow" | "title" | "subtitle" | "preset" | "inputTitle" | "inputItems" | "inputHint" | "promptTitle" | "promptPurpose">>) {
  return {
    zh: {
      ...seed.zh,
      reset: "恢复默认配置",
      resetHint: "恢复全部精修重点。",
      switchPromptLanguage: "切换 Prompt 语言",
      copy: "复制",
      copied: "已复制",
      expand: "展开",
      collapse: "收起",
      clipboardError: "复制失败，请展开后手动选择文本。",
      on: "开启",
      off: "关闭",
    },
    en: {
      ...seed.en,
      reset: "Restore defaults",
      resetHint: "Restore all polishing areas.",
      switchPromptLanguage: "Switch prompt language",
      copy: "Copy",
      copied: "Copied",
      expand: "Expand",
      collapse: "Collapse",
      clipboardError: "Copy failed. Expand the prompt and select it manually.",
      on: "On",
      off: "Off",
    },
  } satisfies Record<Language, WorkbenchCopy>;
}

function chineseFocusSections(focus: readonly string[]) {
  const sections: string[] = [];

  if (focus.includes("redundancy")) {
    sections.push(`### 冗余与重复

重点寻找：

- 同一个观点在不同段落或章节反复表达；
- 同一个概念被多次重新定义；
- Introduction、Method、Experiments 和 Conclusion 中存在明显内容复述；
- 相邻句子表达几乎相同的意思；
- 图表正文、caption 和正文解释之间重复；
- Abstract 与 Introduction / Conclusion 存在不必要的高度重复；
- 已经解释清楚的内容又进行第二次、第三次解释。

对于确实没有信息增量的内容，优先删除、合并或压缩，而不是换一种说法继续保留。`);
  }

  if (focus.includes("ai-patterns")) {
    sections.push(`### 明显的 AI 写作痕迹

重点寻找：

- 句式过度规律、连续使用相似句型；
- 同一类总结句频繁出现；
- “This demonstrates… / This highlights… / It is worth noting that… / Importantly… / Notably…” 等表达使用过多；
- 一段结尾总结一次，下一段开头又重复总结；
- 为显得完整而加入没有实际信息量的过渡句；
- 过度使用三段式、排比式或机械性的学术表达；
- 内容已经明确，却继续补充“换句话说”式解释；
- 明显为了语言流畅而产生的信息重复。

请将这些内容改得更加自然、克制、专业，接近真实论文作者的表达，而不是“AI academic writing”。`);
  }

  if (focus.includes("defensive")) {
    sections.push(`### 过于防御性的写作

检查是否存在不必要的：

- 反复限定研究范围；
- 反复强调 “we do not claim…”；
- 反复强调 “…rather than…”；
- 连续使用 may / might / potentially / arguably 等弱化词；
- 为避免质疑而加入过多解释；
- 同一个 limitation 或 caveat 在多个位置重复出现；
- 对非常直接的实验结果进行过度谨慎的描述。

保留真正必要的学术严谨性，但删除没有必要的防御性表达。不要为了让语言更强势而夸大实验结论或改变论文原本的 claim。`);
  }

  if (focus.includes("terminology")) {
    sections.push(`### 术语、符号和命名一致性

全文检查同一个方法、模块、数据集或指标是否存在多个名称，缩写是否被重复定义，大小写、单复数、连字符和数学符号是否一致，以及图表、公式、Method 和 Experiments 中的术语是否一致。

如果没有必要，不要创造新术语；如果两个术语实际表达同一个概念，尽量统一成一个。`);
  }

  if (focus.includes("language")) {
    sections.push(`### 语言质量

检查 grammar、awkward expressions、overly long sentences、unclear pronoun references、unnecessary passive voice、wordiness、unnatural academic English、paragraph transitions、logical flow、tense consistency、article/preposition errors、punctuation 和 academic tone。

目标不是把论文改成华丽英语，而是做到准确、自然、简洁、专业、容易阅读。如果一句话已经写得很好，不要为了“显示修改”而修改。`);
  }

  if (focus.includes("displays")) {
    sections.push(`### 图表与 caption

检查图表名称、变量名称、legend 与正文术语是否一致，以及图表引用顺序是否合理。LaTeX caption 或正文可以直接修改。

如果问题存在于图片本身的文字、坐标轴、legend、流程图内部文字等无法通过 .tex 修改的内容，不要假装已经修改，而应明确给出：哪张图、哪一部分、当前文字、建议文字和修改原因。`);
  }

  return sections.join("\n\n");
}

function englishFocusSections(focus: readonly string[]) {
  const sections: string[] = [];
  if (focus.includes("redundancy")) sections.push("### Redundancy and repetition\nFind repeated claims across sections, repeated definitions, adjacent paraphrases, duplication among the abstract, introduction, method, experiments, conclusion, prose, and captions, and explanations repeated after they are already clear. Delete, merge, or compress content with no information gain instead of retaining a paraphrase.");
  if (focus.includes("ai-patterns")) sections.push("### Obvious AI writing patterns\nFind overly regular sentence structures, repeated recap sentences, excessive This demonstrates / This highlights / It is worth noting that / Importantly / Notably, empty transitions, formulaic triads, repeated summaries across paragraph boundaries, and fluent-sounding restatements with no information gain. Make the prose natural, restrained, professional, and consistent with real scholarly writing.");
  if (focus.includes("defensive")) sections.push("### Overly defensive writing\nFind repeated scope qualifiers, repeated we do not claim or rather than constructions, clusters of may / might / potentially / arguably, excessive pre-emptive explanation, repeated limitations, and needlessly cautious descriptions of direct results. Preserve warranted rigor, but remove unnecessary defensiveness without strengthening the claims beyond the evidence.");
  if (focus.includes("terminology")) sections.push("### Terminology, notation, and naming consistency\nCheck method, module, dataset, and metric names; repeated abbreviation definitions; capitalization, singular/plural forms, hyphenation, mathematical notation, and terminology across prose, figures, equations, Method, and Experiments. Do not invent terminology; unify terms that denote the same concept.");
  if (focus.includes("language")) sections.push("### Language quality\nCheck grammar, awkward expressions, long sentences, unclear references, unnecessary passive voice, wordiness, unnatural academic English, paragraph transitions, logical flow, tense, articles, prepositions, punctuation, and academic tone. Aim for accurate, natural, concise, professional, readable prose. Leave already strong sentences unchanged.");
  if (focus.includes("displays")) sections.push("### Figures, tables, and captions\nCheck names, variables, legends, terminology, and citation order. Edit LaTeX captions and prose directly. When a problem is embedded in image pixels and cannot be changed through .tex, report the figure, exact location, current wording, proposed wording, and rationale instead of pretending it was edited.");
  return sections.join("\n\n");
}

export const FINAL_POLISHING_WORKBENCH = {
  id: "final-polishing-workbench",
  activePage: "final-polishing",
  copy: sharedCopy({
    zh: {
      eyebrow: "FINAL PRE-SUBMISSION POLISHING",
      title: "投稿前全文精修",
      subtitle: "对已完成论文进行最后一轮全文精修，不改变研究内容、整体结构与技术路线。",
      preset: "保留原稿 · 全文检查 · 完整文件交付",
      inputTitle: "准备材料",
      inputItems: ["完整论文源文件与最新 PDF", "BibTeX、图片和补充材料（如有）", "原有 LaTeX 工程结构"],
      inputHint: "这不是初稿修改或大范围重构。",
      promptTitle: "投稿前全文精修 Prompt",
      promptPurpose: "发现并解决语言、重复、一致性和排版表达问题。",
    },
    en: {
      eyebrow: "FINAL PRE-SUBMISSION POLISHING",
      title: "Final Manuscript Polishing",
      subtitle: "Polish a completed manuscript without changing its research content, overall structure, or technical route.",
      preset: "Preserve the manuscript · full check · complete files",
      inputTitle: "Prepare materials",
      inputItems: ["Complete manuscript source and latest PDF", "BibTeX, figures, and supplement when applicable", "Original LaTeX project structure"],
      inputHint: "This is not first-draft revision or broad reconstruction.",
      promptTitle: "Final-polishing prompt",
      promptPurpose: "Resolve language, repetition, consistency, and presentation issues.",
    },
  }),
  controls: [
    {
      id: "focusAreas",
      kind: "multi",
      label: text("精修重点", "Polishing focus"),
      description: text("选择需要重点检查的内容。", "Select the areas to inspect."),
      defaultValue: Object.keys(FOCUS_AREAS),
      minSelected: 1,
      options: Object.entries(FOCUS_AREAS).map(([value, label]) => ({ value, label })),
      span: "full",
    },
    {
      id: "custom",
      kind: "textarea",
      label: text("特别要求", "Additional requirements"),
      description: text("可填写需要保留的内容或重点章节。", "Optionally identify content to preserve or priority sections."),
      defaultValue: "",
      placeholder: text("可留空", "Optional"),
      span: "full",
    },
  ],
  buildPrompt(values, language) {
    const focus = selected(values, "focusAreas");
    const custom = scalar(values, "custom");

    if (language === "zh") {
      return `# 投稿前最后一轮全文精修

你现在需要对我的论文进行投稿前最后一轮全文精修（final pre-submission polishing）。

请特别注意：这不是初稿修改，也不是大范围重构。论文的研究内容、整体结构、技术路线和主要论证已经基本确定。你的任务是在尽可能保留原文结构、含义、技术细节和作者表达习惯的前提下，发现并解决投稿前仍然存在的语言、逻辑、重复、一致性和排版表达问题。

## 一、先完整理解全文

在开始修改之前，先完整阅读并理解 Abstract、Introduction、Related Work、Method / Methodology、Experiments / Results、Discussion、Conclusion、Appendix / Supplementary Material（如有），以及所有公式、表格、图及其 caption 和 LaTeX 中的 section/subsection、label、ref、cite、术语、缩写和符号。

请先从全文整体逻辑和表达一致性出发判断问题，而不是看到一句话就立即局部改写。

## 二、重点检查以下问题

请逐段检查，同时注意跨章节、跨段落的重复和不一致。

${chineseFocusSections(focus)}

## 三、修改原则

修改优先级为：删除冗余 > 合并重复 > 简化表达 > 局部重写 > 大范围重构。

除非确实存在严重逻辑问题，否则不要重新设计论文结构、大范围移动段落、重写整篇论文、擅自增加实验或 claim、增加没有依据的解释、虚构参考文献、改变公式或技术含义、大量替换术语，或把原本清楚自然的句子机械改成另一种表达。

修改应遵循 minimum necessary intervention：只做能够明确提高投稿质量的修改，并从全文角度保持前后术语、逻辑和整体写作风格一致。${custom ? `\n\n特别要求：${custom}` : ""}

## 四、工作流程

### Step 1：全文诊断

先通读全文并总结最重要的问题，重点说明严重冗余、明显 AI writing patterns、重复定义、过度防御性表达、跨章节重复、术语/符号不一致、图表或 caption 问题以及问题最明显的章节。不要为了找问题而强行找问题。

### Step 2：逐段检查并直接优化

按照原稿顺序逐段检查并直接解决能够安全修改的问题，包括删除无意义重复、合并重复句、简化过长表达、减少 AI 式总结句、删除多余过渡、统一术语、修复语法和指代、改善衔接并减少不必要的 defensive writing，但避免大规模 rewriting。

### Step 3：无法直接修改的问题单独列出

对于图片内部文字、legend、图片公式、无法确认的技术矛盾、需要作者判断的 claim 或需要重新运行实验的数据，按“位置 → 当前问题 → 推荐修改方式 → 修改理由”列出，不要猜测或伪造解决结果。

### Step 4：全文一致性复查

修改后重新从头到尾检查，确认没有产生新的术语不一致，删除后上下文仍然连贯，cross-reference 正常，abbreviation 首次定义没有失效，Figure/Table/Equation 引用正确，contribution 与正文一致，Abstract、Introduction、Experiments、Conclusion 的 claim 一致，并且没有新的重复。

## 五、最终输出

### A. Final polishing report

简洁总结论文是否接近投稿状态、主要问题、删除或合并的重复内容、如何降低明显的 AI writing 痕迹、统一的术语或表达、潜在技术或逻辑问题，以及仍需人工处理的问题。不需要列出每个 grammar correction，只记录重要和具有代表性的修改。

### B. 修改后的完整文件

直接返回修改后的完整 .tex、仅在确实需要修改时返回的 .bib，以及其他被修改的文本文件。尽量保持原有 LaTeX 结构、commands/macros、labels、citations、equations、tables、figures、comments 和文件组织方式。

不要只给修改建议或零散修改片段；我需要能够直接继续编译和投稿的完整修改版文件。

最后再确认：这是一篇已经完成的论文的投稿前最后精修，而不是一次重新写作。所有修改都应服务于减少冗余、消除明显 AI 痕迹、提高一致性、增强可读性和专业度，同时最大程度保留原论文的结构、技术内容和作者声音。`;
    }

    return `# Final Pre-submission Polishing

Perform the final pre-submission polish of my completed manuscript. This is not first-draft revision or broad reconstruction. Preserve the original structure, meaning, technical details, and author voice while resolving remaining language, logic, repetition, consistency, and presentation problems.

Read the entire manuscript first, including every section, appendix or supplement, equation, figure, table, caption, section/subsection, label, ref, cite, term, abbreviation, and symbol. Judge issues from the manuscript-wide logic and consistency rather than rewriting isolated sentences immediately.

## Focus areas

${englishFocusSections(focus)}

Use this priority: delete redundancy > merge repetition > simplify expression > local rewriting > broad reconstruction. Unless a severe logical problem requires it, do not redesign the structure, move paragraphs broadly, rewrite the whole paper, add experiments or claims, add unsupported explanations, invent references, alter equations or technical meaning, replace terminology for style, or rewrite already clear sentences. Apply minimum necessary intervention and preserve manuscript-wide consistency.${custom ? `\n\nAdditional requirements: ${custom}` : ""}

Workflow: (1) read the full manuscript and summarize the most important problems without forcing criticism; (2) inspect and directly improve each paragraph in original order without broad rewriting; (3) separately list image text, uncertain technical contradictions, author-dependent claims, and data requiring reruns as location → problem → recommended change → rationale; and (4) reread the complete revision to verify terminology, continuity, cross-references, abbreviation definitions, figure/table/equation references, contribution and claim consistency, and the absence of newly introduced repetition.

Deliver two parts. A: a concise final polishing report covering submission readiness, representative problems and edits, reduced AI writing patterns, terminology changes, technical or logical risks, and remaining author actions. B: the complete revised .tex, the .bib only if changed, and every other modified text file. Preserve the LaTeX structure, commands, macros, labels, citations, equations, tables, figures, comments, and file organization. Do not return only suggestions or isolated patches; return complete files that can be compiled and submitted.

This is the final polish of an already completed paper, not a rewrite. Every change must reduce redundancy, remove obvious AI writing patterns, improve consistency, readability, and professionalism, and preserve the paper's structure, technical content, and author voice.`;
  },
} satisfies WorkbenchDefinition;
