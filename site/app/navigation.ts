import type { Language } from "./config";

export type ActivePage =
  | "home"
  | "draft"
  | "reconstruction"
  | "figures"
  | "submission";

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
        status: "future",
        keywords: {
          zh: ["选题", "研究问题", "文献缺口", "灵感"],
          en: ["topic", "research question", "literature gap", "ideation"],
        },
      },
      {
        id: "idea-evaluation",
        label: {
          zh: "Idea 评估与优化",
          en: "Idea Evaluation & Refinement",
        },
        status: "future",
        keywords: {
          zh: ["创新性", "可行性", "研究价值", "优化"],
          en: ["novelty", "feasibility", "research value", "refinement"],
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
        status: "future",
        keywords: {
          zh: ["摘要", "引言", "相关工作", "方法", "实验", "讨论"],
          en: ["abstract", "introduction", "related work", "method", "experiments"],
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
          zh: ["论文重构", "结构", "叙事", "五轮工作流"],
          en: ["paper reconstruction", "structure", "narrative", "workflow"],
        },
      },
      {
        id: "section-refinement",
        label: { zh: "章节精修", en: "Section Refinement" },
        status: "future",
        keywords: {
          zh: ["章节修改", "局部重写", "语言精修"],
          en: ["section revision", "local rewrite", "language refinement"],
        },
      },
      {
        id: "targeted-audit",
        label: { zh: "专项审计", en: "Targeted Audits" },
        status: "future",
        keywords: {
          zh: ["证据", "引用", "术语", "数字", "一致性"],
          en: ["evidence", "citations", "terminology", "numbers", "consistency"],
        },
      },
      {
        id: "version-conversion",
        label: { zh: "版本转换", en: "Version Conversion" },
        status: "future",
        keywords: {
          zh: ["会议转期刊", "期刊转会议", "模板", "格式转换"],
          en: ["conference to journal", "journal to conference", "template", "format"],
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
        status: "future",
        keywords: {
          zh: ["研究问题", "实验协议", "变量", "指标"],
          en: ["research question", "protocol", "variables", "metrics"],
        },
      },
      {
        id: "baseline-reproduction",
        label: { zh: "Baseline 与复现", en: "Baselines & Reproduction" },
        status: "future",
        keywords: {
          zh: ["基线", "对比方法", "复现实验"],
          en: ["baseline", "comparison method", "reproduction"],
        },
      },
      {
        id: "experiment-code",
        label: { zh: "实验代码", en: "Experiment Code" },
        status: "future",
        keywords: {
          zh: ["代码实现", "训练", "评估", "脚本"],
          en: ["implementation", "training", "evaluation", "scripts"],
        },
      },
      {
        id: "results-analysis",
        label: { zh: "结果分析", en: "Results Analysis" },
        status: "future",
        keywords: {
          zh: ["统计", "消融", "敏感性", "定性分析"],
          en: ["statistics", "ablation", "sensitivity", "qualitative analysis"],
        },
      },
      {
        id: "reproducibility",
        label: { zh: "可复现性", en: "Reproducibility" },
        status: "future",
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
        status: "future",
        keywords: {
          zh: ["折线图", "柱状图", "散点图", "消融图"],
          en: ["line chart", "bar chart", "scatter plot", "ablation plot"],
        },
      },
      {
        id: "paper-tables",
        label: { zh: "论文表格", en: "Paper Tables" },
        status: "future",
        keywords: {
          zh: ["LaTeX 表格", "结果表", "消融表"],
          en: ["latex table", "results table", "ablation table"],
        },
      },
      {
        id: "figure-table-audit",
        label: { zh: "图表审计", en: "Figure & Table Audit" },
        status: "future",
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
        status: "future",
        keywords: {
          zh: ["终稿检查", "格式", "匿名", "合规"],
          en: ["final check", "format", "anonymity", "compliance"],
        },
      },
      {
        id: "submission-materials",
        label: { zh: "投稿材料", en: "Submission Materials" },
        status: "future",
        keywords: {
          zh: ["Cover Letter", "亮点", "投稿信", "补充材料"],
          en: ["cover letter", "highlights", "supplementary materials"],
        },
      },
      {
        id: "review-revision",
        label: { zh: "审稿与返修", en: "Review & Revision" },
        status: "future",
        keywords: {
          zh: ["审稿意见", "回复信", "返修", "response letter"],
          en: ["review comments", "response letter", "revision", "rebuttal"],
        },
      },
    ],
  },
];
