import type { Language } from "./config";

export type ActivePage =
  | "home"
  | "idea-discovery"
  | "idea-evaluation"
  | "draft"
  | "section-writing"
  | "citation-audit"
  | "writing-polishing"
  | "reconstruction"
  | "refinement"
  | "audit"
  | "version-conversion"
  | "experiment-design"
  | "baseline-reproduction"
  | "experiment-code"
  | "results-analysis"
  | "reproducibility"
  | "figures"
  | "experimental-plots"
  | "paper-tables"
  | "figure-table-audit"
  | "submission"
  | "pre-submission-check"
  | "submission-materials"
  | "peer-review"
  | "revision-planning"
  | "revision-audit";

export type NavigationGroupId =
  | "writing"
  | "reconstruction"
  | "experiments"
  | "figures"
  | "submission";

type LocalizedText = Record<Language, string>;
type LocalizedKeywords = Record<Language, readonly string[]>;

export interface NavigationItem {
  id: string;
  label: LocalizedText;
  status: "available" | "future";
  href?: string;
  activePage?: ActivePage;
  keywords: LocalizedKeywords;
}

export interface NavigationGroup {
  id: NavigationGroupId;
  label: LocalizedText;
  items: readonly NavigationItem[];
}

export const NAVIGATION_COPY = {
  zh: {
    home: "首页",
    search: "搜索",
    searchLabel: "站内搜索",
    searchPlaceholder: "搜索功能或页面",
    searchHint: "输入关键词搜索研术台功能。",
    searchResults: "搜索结果",
    noResults: "没有找到匹配功能",
    clearSearch: "清空搜索",
    available: "进入",
    currentPage: "当前页面",
  },
  en: {
    home: "Home",
    search: "Search",
    searchLabel: "Site search",
    searchPlaceholder: "Search features or pages",
    searchHint: "Enter a keyword to search YanShu features.",
    searchResults: "Search results",
    noResults: "No matching feature found",
    clearSearch: "Clear search",
    available: "Open",
    currentPage: "Current page",
  },
} as const satisfies Record<Language, Record<string, string>>;

export const NAVIGATION_GROUPS: readonly NavigationGroup[] = [
  {
    id: "writing",
    label: {
      zh: "论文写作",
      en: "Paper Writing",
    },
    items: [
      {
        id: "idea-discovery",
        label: { zh: "Idea 查找", en: "Idea Discovery" },
        status: "available",
        href: "/ideas/discovery",
        activePage: "idea-discovery",
        keywords: {
          zh: ["选题", "研究问题", "文献缺口", "灵感", "数据集", "SOTA"],
          en: [
            "topic",
            "research question",
            "literature gap",
            "ideation",
            "dataset",
            "sota",
          ],
        },
      },
      {
        id: "idea-evaluation",
        label: {
          zh: "Idea 评估与优化",
          en: "Idea Evaluation & Refinement",
        },
        status: "available",
        href: "/ideas/evaluation",
        activePage: "idea-evaluation",
        keywords: {
          zh: ["创新性", "可行性", "研究价值", "优化", "近邻论文", "SOTA"],
          en: [
            "novelty",
            "feasibility",
            "research value",
            "refinement",
            "nearest work",
            "sota",
          ],
        },
      },
      {
        id: "full-draft",
        label: { zh: "全文初稿", en: "Full Paper Draft" },
        status: "available",
        href: "/draft",
        activePage: "draft",
        keywords: {
          zh: ["论文初稿", "LaTeX", "实验完成", "全文写作"],
          en: ["paper draft", "latex", "completed experiments", "full writing"],
        },
      },
      {
        id: "section-writing",
        label: { zh: "分章节写作", en: "Section-by-Section Writing" },
        status: "available",
        href: "/writing/sections",
        activePage: "section-writing",
        keywords: {
          zh: ["摘要", "引言", "相关工作", "方法", "实验", "讨论"],
          en: ["abstract", "introduction", "related work", "method", "experiments"],
        },
      },
      {
        id: "citation-audit",
        label: { zh: "引文核查与补充", en: "Citation Review & Support" },
        status: "available",
        href: "/writing/citations",
        activePage: "citation-audit",
        keywords: {
          zh: [
            "引文",
            "引用",
            "BibTeX",
            "缺失文献",
            "近期文献",
            "目标期刊",
          ],
          en: [
            "citation",
            "references",
            "bibtex",
            "missing literature",
            "recent papers",
            "target journal",
          ],
        },
      },
      {
        id: "writing-polishing",
        label: { zh: "写作精修", en: "Writing Polishing" },
        status: "available",
        href: "/writing/polishing",
        activePage: "writing-polishing",
        keywords: {
          zh: ["写作精修", "冗余", "AI 写作痕迹", "防御性写作", "语言润色"],
          en: ["writing polishing", "redundancy", "AI writing patterns", "defensive writing", "copyediting"],
        },
      },
    ],
  },
  {
    id: "reconstruction",
    label: {
      zh: "论文重构",
      en: "Paper Reconstruction",
    },
    items: [
      {
        id: "full-reconstruction",
        label: { zh: "全文重构", en: "Full-Paper Reconstruction" },
        status: "available",
        href: "/reconstruction",
        activePage: "reconstruction",
        keywords: {
          zh: ["论文重构", "结构", "叙事", "一体化工作流"],
          en: ["paper reconstruction", "structure", "narrative", "integrated workflow"],
        },
      },
      {
        id: "section-refinement",
        label: { zh: "章节精修", en: "Section Refinement" },
        status: "available",
        href: "/reconstruction/refinement",
        activePage: "refinement",
        keywords: {
          zh: ["章节修改", "局部重写", "语言精修", "摘要", "讨论"],
          en: [
            "section revision",
            "local rewrite",
            "language refinement",
            "abstract",
            "discussion",
          ],
        },
      },
      {
        id: "targeted-audit",
        label: { zh: "专项审计", en: "Targeted Audits" },
        status: "available",
        href: "/reconstruction/audit",
        activePage: "audit",
        keywords: {
          zh: [
            "证据",
            "引用",
            "BibTeX",
            "术语",
            "数字",
            "图表",
            "一致性",
            "可复现性",
          ],
          en: [
            "evidence",
            "citations",
            "bibtex",
            "terminology",
            "numbers",
            "visuals",
            "consistency",
            "reproducibility",
          ],
        },
      },
      {
        id: "version-conversion",
        label: { zh: "TeX 模板迁移", en: "TeX Template Migration" },
        status: "available",
        href: "/reconstruction/conversion",
        activePage: "version-conversion",
        keywords: {
          zh: ["LaTeX", "官方模板", "格式迁移", "Camera-ready"],
          en: ["latex", "official template", "format migration", "camera-ready"],
        },
      },
    ],
  },
  {
    id: "experiments",
    label: {
      zh: "实验与复现",
      en: "Experiments & Reproducibility",
    },
    items: [
      {
        id: "experiment-design",
        label: { zh: "实验方案设计", en: "Experiment Design" },
        status: "available",
        href: "/experiments/design",
        activePage: "experiment-design",
        keywords: {
          zh: ["研究问题", "实验协议", "变量", "指标"],
          en: ["research question", "protocol", "variables", "metrics"],
        },
      },
      {
        id: "baseline-reproduction",
        label: { zh: "Baseline 与复现", en: "Baselines & Reproduction" },
        status: "available",
        href: "/experiments/baselines",
        activePage: "baseline-reproduction",
        keywords: {
          zh: ["基线", "对比方法", "复现实验"],
          en: ["baseline", "comparison method", "reproduction"],
        },
      },
      {
        id: "experiment-code",
        label: { zh: "实验代码", en: "Experiment Code" },
        status: "available",
        href: "/experiments/code",
        activePage: "experiment-code",
        keywords: {
          zh: ["代码实现", "训练", "评估", "脚本"],
          en: ["implementation", "training", "evaluation", "scripts"],
        },
      },
      {
        id: "results-analysis",
        label: { zh: "结果分析", en: "Results Analysis" },
        status: "available",
        href: "/experiments/results",
        activePage: "results-analysis",
        keywords: {
          zh: ["统计", "消融", "敏感性", "定性分析"],
          en: ["statistics", "ablation", "sensitivity", "qualitative analysis"],
        },
      },
      {
        id: "reproducibility",
        label: { zh: "可复现性", en: "Reproducibility" },
        status: "available",
        href: "/experiments/reproducibility",
        activePage: "reproducibility",
        keywords: {
          zh: ["随机种子", "环境", "数据", "检查清单"],
          en: ["random seed", "environment", "data", "checklist"],
        },
      },
    ],
  },
  {
    id: "figures",
    label: {
      zh: "科研图表",
      en: "Research Figures & Tables",
    },
    items: [
      {
        id: "scientific-schematics",
        label: { zh: "科学示意图", en: "Scientific Schematics" },
        status: "available",
        href: "/figures",
        activePage: "figures",
        keywords: {
          zh: ["科研绘图", "方法总览", "机制图", "框架图"],
          en: ["research figures", "method overview", "mechanism", "framework"],
        },
      },
      {
        id: "experimental-plots",
        label: { zh: "实验绘图", en: "Experimental Plots" },
        status: "available",
        href: "/figures/plots",
        activePage: "experimental-plots",
        keywords: {
          zh: ["折线图", "柱状图", "散点图", "消融图"],
          en: ["line chart", "bar chart", "scatter plot", "ablation plot"],
        },
      },
      {
        id: "paper-tables",
        label: { zh: "论文表格", en: "Paper Tables" },
        status: "available",
        href: "/figures/tables",
        activePage: "paper-tables",
        keywords: {
          zh: ["LaTeX 表格", "结果表", "消融表"],
          en: ["latex table", "results table", "ablation table"],
        },
      },
      {
        id: "figure-table-audit",
        label: { zh: "图表审计", en: "Figure & Table Audit" },
        status: "available",
        href: "/figures/audit",
        activePage: "figure-table-audit",
        keywords: {
          zh: ["图表一致性", "可读性", "术语", "数字核对"],
          en: ["consistency", "legibility", "terminology", "number checking"],
        },
      },
    ],
  },
  {
    id: "submission",
    label: {
      zh: "投稿与审校",
      en: "Submission & Review",
    },
    items: [
      {
        id: "venue-targeting",
        label: { zh: "投稿定位", en: "Venue Targeting" },
        status: "available",
        href: "/submission",
        activePage: "submission",
        keywords: {
          zh: ["期刊推荐", "投稿策略", "分区", "影响因子", "OA"],
          en: ["journal recommendation", "venue strategy", "quartile", "impact factor", "oa"],
        },
      },
      {
        id: "pre-submission-check",
        label: { zh: "投稿前终检", en: "Pre-submission Check" },
        status: "available",
        href: "/submission/check",
        activePage: "pre-submission-check",
        keywords: {
          zh: ["终稿检查", "格式", "匿名", "合规"],
          en: ["final check", "format", "anonymity", "compliance"],
        },
      },
      {
        id: "submission-materials",
        label: { zh: "投稿材料", en: "Submission Materials" },
        status: "available",
        href: "/submission/materials",
        activePage: "submission-materials",
        keywords: {
          zh: ["Cover Letter", "亮点", "投稿信", "补充材料"],
          en: ["cover letter", "highlights", "supplementary materials"],
        },
      },
      {
        id: "peer-review",
        label: { zh: "审稿", en: "Peer Review" },
        status: "available",
        href: "/submission/review",
        activePage: "peer-review",
        keywords: {
          zh: ["同行评审", "审稿", "论文评估", "主要问题", "接收风险"],
          en: ["peer review", "paper review", "major concerns", "readiness"],
        },
      },
      {
        id: "revision-planning",
        label: { zh: "返修规划", en: "Revision Planning" },
        status: "available",
        href: "/submission/revision",
        activePage: "revision-planning",
        keywords: {
          zh: ["审稿意见", "返修", "修改计划", "补实验", "优先级"],
          en: ["review comments", "revision plan", "experiments", "priority"],
        },
      },
      {
        id: "revision-audit",
        label: { zh: "返修稿审查", en: "Revision Audit" },
        status: "available",
        href: "/submission/revision-audit",
        activePage: "revision-audit",
        keywords: {
          zh: ["返修稿", "回复信", "rebuttal", "diff", "逐条核验"],
          en: ["revision audit", "response letter", "rebuttal", "diff", "verification"],
        },
      },
    ],
  },
];
