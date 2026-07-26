// content/prompts/chatExecution.ts
var CHAT_MODEL_POLICY = "latest-visible-reasoning";
var CHAT_FALLBACK_POLICY = "closest-lower-then-strongest";
var CHAT_REASONING_PREFERENCE_IDS = [
  "strongest",
  "medium",
  "high",
  "extra-high",
  "pro"
];
var CHAT_REASONING_PREFERENCES = {
  strongest: {
    id: "strongest",
    label: {
      zh: "\u81EA\u52A8\u6700\u5F3A",
      en: "Auto strongest"
    },
    shortLabel: {
      zh: "\u6700\u5F3A\u53EF\u7528",
      en: "Strongest available"
    },
    description: {
      zh: "\u9ED8\u8BA4\u4F7F\u7528\u5F53\u524D\u8D26\u53F7\u53EF\u89C1\u7684\u6700\u5F3A\u63A8\u7406\u6863\u4F4D\u3002",
      en: "Use the strongest reasoning level currently visible for this account."
    }
  },
  medium: {
    id: "medium",
    label: {
      zh: "Medium",
      en: "Medium"
    },
    shortLabel: {
      zh: "Medium",
      en: "Medium"
    },
    description: {
      zh: "\u4F18\u5148\u5339\u914D Medium \u6216\u542B\u4E49\u6700\u63A5\u8FD1\u7684\u5E38\u89C4\u63A8\u7406\u6863\u4F4D\u3002",
      en: "Prefer Medium or the closest equivalent standard-reasoning level."
    }
  },
  high: {
    id: "high",
    label: {
      zh: "High",
      en: "High"
    },
    shortLabel: {
      zh: "High",
      en: "High"
    },
    description: {
      zh: "\u4F18\u5148\u5339\u914D High\uFF1B\u4E0D\u53EF\u7528\u65F6\u56DE\u9000\u5230 Medium\u3002",
      en: "Prefer High and fall back to Medium when High is unavailable."
    }
  },
  "extra-high": {
    id: "extra-high",
    label: {
      zh: "Extra High",
      en: "Extra High"
    },
    shortLabel: {
      zh: "Extra High",
      en: "Extra High"
    },
    description: {
      zh: "\u4F18\u5148\u5339\u914D Extra High\uFF08xhigh\uFF09\uFF1B\u4E0D\u53EF\u7528\u65F6\u4F9D\u6B21\u56DE\u9000\u5230 High\u3001Medium\u3002",
      en: "Prefer Extra High (xhigh), then fall back to High and Medium."
    }
  },
  pro: {
    id: "pro",
    label: {
      zh: "Pro",
      en: "Pro"
    },
    shortLabel: {
      zh: "Pro",
      en: "Pro"
    },
    description: {
      zh: "\u4F18\u5148\u4F7F\u7528\u6700\u5F3A Pro \u6863\u4F4D\uFF1B\u4E0D\u53EF\u7528\u65F6\u4F9D\u6B21\u56DE\u9000\u5230 Extra High\u3001High\u3001Medium\u3002",
      en: "Prefer the strongest Pro level, then fall back to Extra High, High, and Medium."
    }
  }
};
var DEFAULT_CHAT_EXECUTION_PREFERENCES = {
  modelPolicy: CHAT_MODEL_POLICY,
  reasoningPreference: "strongest",
  fallbackPolicy: CHAT_FALLBACK_POLICY
};

// content/prompts/wordCountPolicy.ts
var WORD_COUNT_POLICY = {
  unlimitedCoreSectionIds: ["method", "experiments-results"],
  visualWordEquivalent: 200
};

// app/config.ts
var PRODUCT_CONFIG = {
  productName: "\u7814\u672F\u53F0",
  productNameEn: "YanShu",
  defaultLanguage: "zh",
  defaultPromptLanguage: "zh",
  defaultPaperStyle: "conference",
  wordCount: {
    defaultMode: "target",
    defaultUnlimitedCoreSections: false,
    unlimitedSectionIds: WORD_COUNT_POLICY.unlimitedCoreSectionIds,
    visualWordEquivalent: WORD_COUNT_POLICY.visualWordEquivalent,
    min: 2e3,
    max: 2e4,
    step: 100
  },
  chatExecution: {
    default: DEFAULT_CHAT_EXECUTION_PREFERENCES,
    reasoningPreferences: CHAT_REASONING_PREFERENCES
  },
  paperStyles: {
    conference: {
      id: "conference",
      label: {
        zh: "\u4F1A\u8BAE",
        en: "Conference"
      },
      shortLabel: {
        zh: "\u4F1A\u8BAE",
        en: "Conference"
      },
      description: {
        zh: "\u9762\u5411\u7BC7\u5E45\u7D27\u51D1\u3001\u8D21\u732E\u5BC6\u5EA6\u9AD8\u7684\u4F1A\u8BAE\u8BBA\u6587\uFF0C\u5F3A\u8C03\u95EE\u9898\u3001\u65B9\u6CD5\u4E0E\u5B9E\u9A8C\u7ED3\u8BBA\u7684\u5FEB\u901F\u95ED\u73AF\u3002",
        en: "For compact conference papers with dense contributions and a fast problem\u2013method\u2013evidence loop."
      },
      defaultTargetWords: 4500,
      defaultAppendix: true,
      appendixRule: {
        enabled: {
          zh: "\u5141\u8BB8\u9644\u5F55\uFF0C\u4F46\u6B63\u6587\u6EE1\u8DB3\u5F53\u524D\u9002\u7528\u7684\u603B\u91CF\u4E0E\u7AE0\u8282\u9884\u7B97\u65F6\u4E0D\u5F97\u4F7F\u7528\uFF1B\u4EC5\u5728\u53D7\u9650\u7AE0\u8282\u4ECD\u8D85\u989D\u4E14\u9010\u9879\u786E\u8BA4\u5185\u5BB9\u975E\u4E3B\u7EBF\u5FC5\u9700\u540E\uFF0C\u624D\u53EF\u79FB\u5165\u9644\u5F55\u3002\u9644\u5F55\u4E0D\u8BA1\u5165\u6B63\u6587\u5B57\u6570\u4E14\u5B57\u6570\u4E0D\u9650\u3002",
          en: "Appendix permitted, but do not use it when the main text meets every applicable total and section budget. Move material only when a limited section remains over budget and itemized review confirms it is not essential to the throughline. The appendix is excluded from the main-text count and unlimited."
        },
        disabled: {
          zh: "\u4E0D\u4F7F\u7528\u9644\u5F55\u3002\u5173\u952E\u65B9\u6CD5\u3001\u5B9E\u9A8C\u7EC6\u8282\u4E0E\u9650\u5236\u5FC5\u987B\u5728\u6B63\u6587\u9884\u7B97\u5185\u5B8C\u6210\u4EA4\u4EE3\u3002",
          en: "No appendix. Essential method details, experimental evidence, and limitations must fit within the main-text budget."
        }
      },
      structureNote: {
        zh: "\u76EE\u5F55\u7B2C\u4E09\u5C42\u91C7\u7528 paragraph \u800C\u975E subsubsection\uFF1Bparagraph \u6807\u9898\u53EA\u547D\u540D\u771F\u5B9E\u79D1\u5B66\u5355\u5143\uFF0C\u666E\u901A\u8BBA\u8FF0\u4F7F\u7528\u8FDE\u7EED\u6BB5\u843D\u3002Related Work \u6BCF\u5C0F\u8282\u5355\u6BB5\uFF0CMethod \u4E0D\u5355\u8BBE Overview\u3002",
        en: "Use paragraph rather than subsubsection for third-level headings, reserving headings for genuine scientific units and writing ordinary exposition as continuous prose. Keep one paragraph per Related Work subsection and no standalone Method Overview."
      },
      emphasisNote: {
        zh: "\u4F18\u5148\u4FDD\u8BC1\u8D21\u732E\u8FA8\u8BC6\u5EA6\u3001\u57FA\u7EBF\u516C\u5E73\u6027\u3001\u6D88\u878D\u5B9E\u9A8C\u548C\u53EF\u590D\u73B0\u7EC6\u8282\u3002",
        en: "Prioritize contribution clarity, fair baselines, ablations, and reproducibility details."
      },
      plannerSummary: {
        zh: "\u7B2C\u4E09\u5C42\u4F7F\u7528 paragraph \u800C\u975E subsubsection\uFF1B\u5F15\u8A00 480 \u8BCD\uFF0C\u8BA8\u8BBA\u4E0E\u5C40\u9650\u5360 10%\uFF0C\u7ED3\u8BBA 200 \u8BCD\uFF0CMethod \u4E0D\u5355\u8BBE Overview\u3002",
        en: "Use paragraph rather than subsubsection for third-level headings; 480-word Introduction, 10% Discussion & Limitations, 200-word Conclusion, and no standalone Method Overview."
      },
      promptDirective: {
        zh: "\u91C7\u7528\u7D27\u51D1\u7684\u95EE\u9898\u2014\u65B9\u6CD5\u2014\u8BC1\u636E\u95ED\u73AF\uFF1B\u9700\u8981\u7B2C\u4E09\u5C42\u6807\u9898\u65F6\u4F7F\u7528 paragraph \u800C\u975E subsubsection\uFF0C\u5E76\u8BA9\u6807\u9898\u547D\u540D\u79D1\u5B66\u5185\u5BB9\u800C\u4E0D\u662F Question\u3001Observation \u7B49\u53D9\u8FF0\u529F\u80FD\u3002\u666E\u901A\u8BBA\u8FF0\u4EE5\u81EA\u7136\u8FDE\u7EED\u6BB5\u843D\u5C55\u5F00\u3002Related Work \u6BCF\u4E2A\u5C0F\u8282\u53EA\u5199\u4E00\u4E2A\u666E\u901A\u6BB5\u843D\uFF0CMethod \u4E0D\u5355\u8BBE Overview\uFF0C\u5E76\u4F18\u5148\u4FDD\u8BC1\u5FC5\u8981\u673A\u5236\u3001\u516C\u5E73\u6BD4\u8F83\u3001\u5173\u952E\u6D88\u878D\u548C\u53EF\u590D\u73B0\u4FE1\u606F\u3002",
        en: "Use a compact problem\u2013method\u2013evidence loop. When a third-level heading is needed, use paragraph rather than subsubsection and name scientific content rather than discourse functions such as Question or Observation. Develop ordinary exposition as natural continuous prose. Keep one ordinary paragraph per Related Work subsection, omit a standalone Method Overview, and prioritize necessary mechanisms, fair comparisons, decisive ablations, and reproducibility."
      },
      sections: [
        {
          id: "abstract",
          label: { zh: "\u6458\u8981", en: "Abstract" },
          shortLabel: { zh: "\u6458\u8981", en: "Abstract" },
          description: {
            zh: "\u7528\u4E00\u4E2A\u8FDE\u7EED\u6BB5\u843D\u6982\u62EC\u95EE\u9898\u3001\u65B9\u6CD5\u3001\u8BC1\u636E\u548C\u8FB9\u754C\u3002",
            en: "Summarize the problem, method, evidence, and boundary in one continuous paragraph."
          },
          ratio: 0.04
        },
        {
          id: "introduction",
          label: { zh: "\u5F15\u8A00", en: "Introduction" },
          shortLabel: { zh: "\u5F15\u8A00", en: "Intro" },
          description: {
            zh: "\u95EE\u9898\u80CC\u666F\u3001\u7814\u7A76\u7F3A\u53E3\u3001\u6838\u5FC3\u601D\u8DEF\u4E0E\u8D21\u732E\u5217\u8868\u3002",
            en: "Problem context, research gap, central idea, and contribution list."
          },
          ratio: 0.10666666666666667
        },
        {
          id: "related-work",
          label: { zh: "\u76F8\u5173\u5DE5\u4F5C", en: "Related Work" },
          shortLabel: { zh: "\u76F8\u5173", en: "Related" },
          description: {
            zh: "\u4E09\u4E2A\u5C0F\u8282\uFF0C\u6BCF\u5C0F\u8282\u4E00\u4E2A\u666E\u901A\u6BB5\u843D\uFF0C\u53EA\u4FDD\u7559\u5B9A\u4F4D\u6240\u9700\u8109\u7EDC\u3002",
            en: "Three subsections with one ordinary paragraph each, limited to positioning-essential literature."
          },
          ratio: 0.08
        },
        {
          id: "method",
          label: { zh: "\u65B9\u6CD5", en: "Method" },
          shortLabel: { zh: "\u65B9\u6CD5", en: "Method" },
          description: {
            zh: "\u5F62\u5F0F\u5316\u95EE\u9898\u3001\u65B9\u6CD5\u8BBE\u8BA1\u3001\u5173\u952E\u673A\u5236\u4E0E\u590D\u6742\u5EA6\u3002",
            en: "Problem formulation, design, key mechanisms, and complexity."
          },
          ratio: 0.27
        },
        {
          id: "experiments-results",
          label: { zh: "\u5B9E\u9A8C\u4E0E\u7ED3\u679C", en: "Experiments & Results" },
          shortLabel: { zh: "\u5B9E\u9A8C", en: "Experiments" },
          description: {
            zh: "\u5B9E\u9A8C\u8BBE\u7F6E\u3001\u4E3B\u7ED3\u679C\u3001\u5173\u952E\u6D88\u878D\u3001\u7A33\u5065\u6027\u548C\u8BEF\u5DEE\u5206\u6790\u3002",
            en: "Experimental setup, main results, decisive ablations, robustness, and error analysis."
          },
          ratio: 0.35888888888888887
        },
        {
          id: "discussion",
          label: { zh: "\u8BA8\u8BBA\u4E0E\u5C40\u9650", en: "Discussion & Limitations" },
          shortLabel: { zh: "\u8BA8\u8BBA", en: "Discussion" },
          description: {
            zh: "\u4E09\u4E2A\u8BA8\u8BBA\u5C0F\u8282\u52A0\u4E00\u4E2A\u7EA6 100 \u8BCD\u7684\u5C40\u9650\u5C0F\u8282\uFF0C\u4E0D\u590D\u8FF0\u5B9E\u9A8C\u7ED3\u679C\u3002",
            en: "Three discussion subsections plus an approximately 100-word Limitations subsection, without repeating results."
          },
          ratio: 0.1
        },
        {
          id: "conclusion",
          label: { zh: "\u7ED3\u8BBA", en: "Conclusion" },
          shortLabel: { zh: "\u7ED3\u8BBA", en: "Conclusion" },
          description: {
            zh: "\u56DE\u6536\u95EE\u9898\u3001\u8BC1\u636E\u4E0E\u6700\u91CD\u8981\u7684\u53EF\u9A8C\u8BC1\u7ED3\u8BBA\u3002",
            en: "Close the loop between the problem, evidence, and the most defensible conclusion."
          },
          ratio: 0.044444444444444446
        }
      ]
    },
    journal: {
      id: "journal",
      label: {
        zh: "\u671F\u520A",
        en: "Journal"
      },
      shortLabel: {
        zh: "\u671F\u520A",
        en: "Journal"
      },
      description: {
        zh: "\u9762\u5411\u8BBA\u8BC1\u5145\u5206\u3001\u6587\u732E\u5B9A\u4F4D\u5B8C\u6574\u7684\u671F\u520A\u8BBA\u6587\uFF0C\u5F3A\u8C03\u7814\u7A76\u8109\u7EDC\u3001\u65B9\u6CD5\u7EC6\u8282\u4E0E\u8BA8\u8BBA\u6DF1\u5EA6\u3002",
        en: "For fully argued journal articles with broader positioning, detailed methods, and deeper discussion."
      },
      defaultTargetWords: 5e3,
      defaultAppendix: false,
      appendixRule: {
        enabled: {
          zh: "\u5141\u8BB8\u9644\u5F55\uFF0C\u4F46\u6B63\u6587\u6EE1\u8DB3\u5F53\u524D\u9002\u7528\u7684\u603B\u91CF\u4E0E\u7AE0\u8282\u9884\u7B97\u65F6\u4E0D\u5F97\u4F7F\u7528\uFF1B\u53EA\u6709\u53D7\u9650\u7AE0\u8282\u4ECD\u8D85\u989D\u4E14\u9010\u9879\u786E\u8BA4\u5185\u5BB9\u4E0D\u5F71\u54CD\u590D\u73B0\u3001\u7ED3\u8BBA\u5224\u65AD\u4E0E\u79D1\u5B66\u4E3B\u7EBF\u65F6\uFF0C\u624D\u53EF\u79FB\u5165\u9644\u5F55\u3002\u9644\u5F55\u4E0D\u8BA1\u5165\u6B63\u6587\u5B57\u6570\u4E14\u5B57\u6570\u4E0D\u9650\u3002",
          en: "Appendix permitted, but do not use it when the main text meets every applicable total and section budget. Move material only when a limited section remains over budget and itemized review confirms that reproducibility, claim assessment, and the scientific throughline remain intact. The appendix is excluded from the main-text count and unlimited."
        },
        disabled: {
          zh: "\u9ED8\u8BA4\u4E0D\u8BBE\u9644\u5F55\u3002\u7814\u7A76\u80CC\u666F\u3001\u65B9\u6CD5\u7EC6\u8282\u3001\u7A33\u5065\u6027\u5206\u6790\u548C\u5C40\u9650\u5E94\u6574\u5408\u8FDB\u6B63\u6587\u3002",
          en: "No appendix by default. Integrate research context, methodological detail, robustness checks, and limitations into the main text."
        }
      },
      structureNote: {
        zh: "\u76EE\u5F55\u5C42\u7EA7\u9ED8\u8BA4\u6B62\u4E8E subsubsection\uFF0C\u4E0D\u4F7F\u7528 paragraph \u6807\u9898\uFF1B\u666E\u901A\u6BB5\u843D\u4F9D\u9760\u4E3B\u9898\u53E5\u4E0E\u8FC7\u6E21\u5F62\u6210\u8FDE\u7EED\u8BBA\u8BC1\u3002Method \u5355\u8BBE\u4E0D\u8D85\u8FC7 80 \u8BCD\u7684\u53CC\u6BB5 Overview\u3002",
        en: "Stop the heading hierarchy at subsubsection by default and develop ordinary paragraphs through topic sentences and transitions rather than paragraph headings. Use a standalone two-paragraph Method Overview capped at 80 words."
      },
      emphasisNote: {
        zh: "\u4F18\u5148\u4FDD\u8BC1\u7406\u8BBA\u4E0E\u7ECF\u9A8C\u8BBA\u8BC1\u7684\u5B8C\u6574\u6027\u3001\u65B9\u6CD5\u900F\u660E\u5EA6\u548C\u5BF9\u65E2\u6709\u7814\u7A76\u7684\u7D2F\u79EF\u8D21\u732E\u3002",
        en: "Prioritize complete theoretical and empirical argumentation, methodological transparency, and cumulative contribution."
      },
      plannerSummary: {
        zh: "\u76EE\u5F55\u5C42\u7EA7\u9ED8\u8BA4\u6B62\u4E8E subsubsection\uFF1B\u4FDD\u7559\u53CC\u6BB5 Overview\uFF0C\u5E76\u6269\u5C55\u6587\u732E\u5B9A\u4F4D\u3001\u65B9\u6CD5\u7EC6\u8282\u4E0E\u8BA8\u8BBA\u3002",
        en: "Stop the heading hierarchy at subsubsection by default; retain a two-paragraph Overview and deepen positioning, methods, and discussion."
      },
      promptDirective: {
        zh: "\u91C7\u7528\u66F4\u5B8C\u6574\u7684\u7D2F\u79EF\u8BBA\u8BC1\uFF0C\u76EE\u5F55\u5C42\u7EA7\u9ED8\u8BA4\u6B62\u4E8E subsubsection\uFF1B\u5176\u4E0B\u7528\u4E3B\u9898\u53E5\u3001\u8FC7\u6E21\u548C\u81EA\u7136\u6BB5\u7EC4\u7EC7\u5185\u5BB9\uFF0C\u4E0D\u628A Question\u3001Observation\u3001Design Purpose \u7B49\u53D9\u8FF0\u529F\u80FD\u5199\u6210 paragraph \u6807\u9898\u3002Method \u5355\u8BBE\u4E24\u4E2A\u666E\u901A\u6BB5\u843D\u4E14\u4E0D\u8D85\u8FC7 80 \u8BCD\u7684 Overview\uFF0C\u4E0D\u590D\u8FF0\u6846\u67B6\u56FE\uFF0C\u5E76\u6269\u5C55\u7814\u7A76\u5B9A\u4F4D\u3001\u65B9\u6CD5\u900F\u660E\u5EA6\u3001\u7A33\u5065\u6027\u4E0E\u72EC\u7ACB\u8BA8\u8BBA\u3002",
        en: "Use a fuller cumulative argument and stop the heading hierarchy at subsubsection by default. Organize lower-level content with topic sentences, transitions, and natural prose instead of paragraph headings labeled by discourse functions such as Question, Observation, or Design Purpose. Give Method a standalone two-paragraph Overview capped at 80 words without narrating the framework figure, and deepen positioning, transparency, robustness, and discussion."
      },
      sections: [
        {
          id: "abstract",
          label: { zh: "\u6458\u8981", en: "Abstract" },
          shortLabel: { zh: "\u6458\u8981", en: "Abstract" },
          description: {
            zh: "\u6982\u62EC\u95EE\u9898\u8303\u56F4\u3001\u65B9\u6CD5\u3001\u4E3B\u8981\u8BC1\u636E\u4E0E\u53EF\u63A8\u5E7F\u8FB9\u754C\u3002",
            en: "Summarize the problem scope, method, primary evidence, and generalization boundary."
          },
          ratio: 0.04
        },
        {
          id: "introduction",
          label: { zh: "\u5F15\u8A00", en: "Introduction" },
          shortLabel: { zh: "\u5F15\u8A00", en: "Intro" },
          description: {
            zh: "\u95EE\u9898\u80CC\u666F\u3001\u7814\u7A76\u7F3A\u53E3\u3001\u7814\u7A76\u95EE\u9898\u4E0E\u603B\u4F53\u8D21\u732E\u3002",
            en: "Problem context, research gap, research questions, and overall contribution."
          },
          ratio: 0.104
        },
        {
          id: "related-work",
          label: { zh: "\u76F8\u5173\u5DE5\u4F5C", en: "Related Work" },
          shortLabel: { zh: "\u76F8\u5173", en: "Related" },
          description: {
            zh: "\u7CFB\u7EDF\u7EC4\u7EC7\u7814\u7A76\u8109\u7EDC\u3001\u7406\u8BBA\u8FDE\u63A5\u4E0E\u5DEE\u5F02\u5316\u5B9A\u4F4D\u3002",
            en: "Organize the research landscape, theoretical links, and differentiated positioning."
          },
          ratio: 0.09
        },
        {
          id: "method",
          label: { zh: "\u65B9\u6CD5", en: "Method" },
          shortLabel: { zh: "\u65B9\u6CD5", en: "Method" },
          description: {
            zh: "\u5B8C\u6574\u5448\u73B0\u5047\u8BBE\u3001\u5F62\u5F0F\u5316\u8BBE\u8BA1\u3001\u5B9E\u73B0\u548C\u6709\u6548\u6027\u4F9D\u636E\u3002",
            en: "Present assumptions, formal design, implementation, and validity rationale in full."
          },
          ratio: 0.3
        },
        {
          id: "experiments-results",
          label: { zh: "\u5B9E\u9A8C\u4E0E\u7ED3\u679C", en: "Experiments & Results" },
          shortLabel: { zh: "\u5B9E\u9A8C", en: "Experiments" },
          description: {
            zh: "\u5B9E\u9A8C\u8BBE\u7F6E\u3001\u4E3B\u7ED3\u679C\u3001\u7A33\u5065\u6027\u3001\u6D88\u878D\u4E0E\u8865\u5145\u5206\u6790\u3002",
            en: "Experimental setup, main results, robustness, ablations, and supplementary analyses."
          },
          ratio: 0.33
        },
        {
          id: "discussion",
          label: { zh: "\u8BA8\u8BBA\u4E0E\u5C40\u9650", en: "Discussion & Limitations" },
          shortLabel: { zh: "\u8BA8\u8BBA", en: "Discussion" },
          description: {
            zh: "\u89E3\u91CA\u673A\u5236\u3001\u7406\u8BBA\u610F\u4E49\u3001\u5916\u90E8\u6548\u5EA6\u3001\u5C40\u9650\u4E0E\u672A\u6765\u7814\u7A76\u3002",
            en: "Mechanisms, theoretical implications, external validity, limitations, and future work."
          },
          ratio: 0.096
        },
        {
          id: "conclusion",
          label: { zh: "\u7ED3\u8BBA", en: "Conclusion" },
          shortLabel: { zh: "\u7ED3\u8BBA", en: "Conclusion" },
          description: {
            zh: "\u51DD\u7EC3\u56DE\u7B54\u7814\u7A76\u95EE\u9898\u5E76\u660E\u786E\u53EF\u88AB\u8BC1\u636E\u652F\u6301\u7684\u8D21\u732E\u3002",
            en: "Answer the research questions concisely and state only evidence-supported contributions."
          },
          ratio: 0.04
        }
      ]
    }
  }
};
var UI_COPY = {
  zh: {
    productTagline: "CS \u79D1\u7814\u65B9\u6CD5\u4E0E\u4EA4\u4E92\u5F0F\u5DE5\u4F5C\u53F0",
    version: "\u9996\u7248 \xB7 CS",
    mobileMenu: "\u6253\u5F00\u5BFC\u822A",
    closeMenu: "\u5173\u95ED\u5BFC\u822A",
    resizePromptRail: "\u62D6\u52A8\u8C03\u6574 Prompt \u680F\u5BBD\u5EA6",
    resetPromptRail: "\u53CC\u51FB\u6062\u590D\u4E3A 40%",
    skipToContent: "\u8DF3\u5230\u6B63\u6587",
    navLabel: "\u7AD9\u70B9\u5BFC\u822A",
    navDirectory: "\u5BFC\u822A",
    comingSoon: "\u5373\u5C06\u63A8\u51FA",
    configEyebrow: "PAPER RECONSTRUCTION",
    title: "\u8BBA\u6587\u91CD\u6784",
    subtitle: "\u9009\u62E9\u8BBA\u6587\u7C7B\u578B\u3001\u6B63\u6587\u5B57\u6570\u9650\u5236\u4E0E\u9644\u5F55\u89C4\u5219\uFF0C\u518D\u4F7F\u7528\u4E94\u6B65\u771F\u5B9E Prompt \u5B8C\u6210\u91CD\u6784\u3002",
    generalPreset: "\u901A\u7528\u4EA7\u54C1\u9884\u8BBE \xB7 \u975E venue \u5B98\u65B9\u8981\u6C42",
    language: "\u7F51\u7AD9\u8BED\u8A00",
    chinese: "\u4E2D\u6587",
    english: "English",
    paperStyle: "\u8BBA\u6587\u98CE\u683C",
    targetWords: "\u6B63\u6587\u5B57\u6570\u9650\u5236",
    targetWordsHint: "\u5F00\u542F\u540E\u663E\u793A 06\uFF1B\u9644\u5F55\u4E0D\u8BA1\u5165\u6B63\u6587\uFF0C\u6BCF\u5F20\u8868\u683C\u6216\u56FE\u7247\u6309 200 \u8BCD\u8BA1\u5165\u3002",
    wordLimitOn: "\u9650\u5236\u6B63\u6587\u5B57\u6570",
    wordLimitOff: "\u65E0\u7279\u6B8A\u89C4\u5B9A",
    noWordLimitHint: "\u5173\u95ED\u540E\u4E0D\u663E\u793A 06\uFF0C\u4E94\u6B65 Prompt \u4E5F\u4E0D\u5305\u542B\u6B63\u6587\u603B\u6570\u6216\u7AE0\u8282\u9884\u7B97\u3002",
    words: "\u8BCD",
    appendix: "\u9644\u5F55\u8BBE\u7F6E",
    appendixOn: "\u5141\u8BB8\u9644\u5F55",
    appendixOff: "\u4E0D\u542B\u9644\u5F55",
    frameworkFigure: "\u603B\u4F53\u6846\u67B6\u56FE",
    frameworkRatio: "\u753B\u5E03\u6BD4\u4F8B",
    frameworkCustomWidth: "\u5BBD",
    frameworkCustomHeight: "\u9AD8",
    frameworkFixedRules: "\u5176\u4F59\u89C4\u5219\u91C7\u7528\u65B9\u6CD5\u603B\u89C8\u63A8\u8350\u914D\u7F6E\uFF1A\u7EAF\u767D\u753B\u5E03\uFF1BTol \u9C9C\u660E\u8272\u7CFB\uFF0C2\u20133 \u4E2A\u5F3A\u8C03\u8272\u4E3A\u4E0A\u9650\u4E14\u53D6\u6700\u5C11\u591F\u7528\u6570\u91CF\uFF1BCalibri\uFF1B\u5173\u952E\u533A\u57DF\u6781\u6D45\u5E95\u8272\uFF1B\u4E09\u7EA7\u5B57\u53F7\uFF1B\u65E0\u5927\u6807\u9898\uFF1B\u6DF1\u8272\u4E2D\u6027\u7EBF\uFF1B\u53EF\u6309\u9700\u4F7F\u7528\u4E0E\u8BBA\u6587\u5BF9\u8C61\u76F4\u63A5\u5BF9\u5E94\u7684\u7B80\u5316\u79D1\u5B66\u56FE\u5F62\uFF0C\u4E0D\u4F7F\u7528\u4EBA\u7269\u6F2B\u753B\u3001\u5409\u7965\u7269\u6216\u8425\u9500\u63D2\u753B\u3002",
    chatExecution: "ChatGPT \u6267\u884C",
    chatModelPolicy: "\u6A21\u578B\u7B56\u7565",
    chatLatestVisibleModel: "\u6700\u65B0\u53EF\u7528\u63A8\u7406\u6A21\u578B",
    chatReasoningPreference: "\u63A8\u7406\u7B49\u7EA7",
    chatRuntimePolicy: "\u4E0D\u9501\u5B9A GPT \u578B\u53F7\u540D\u79F0\uFF1B\u63D2\u4EF6\u6BCF\u8F6E\u8BFB\u53D6 ChatGPT \u5F53\u524D\u53EF\u89C1\u9009\u9879\u3002\u53D1\u751F\u56DE\u9000\u65F6\u5148\u660E\u786E\u63D0\u793A\uFF0C\u540D\u79F0\u65E0\u6CD5\u5224\u65AD\u65F6\u9009\u62E9\u6700\u5F3A\u53EF\u7528\u6863\u4F4D\u3002",
    exportAutomation: "\u5BFC\u51FA\u684C\u9762\u914D\u7F6E",
    exportedAutomation: "\u914D\u7F6E\u5DF2\u4E0B\u8F7D",
    exportAutomationHint: "\u4E0B\u8F7D\u5F53\u524D\u8BBA\u6587\u7C7B\u578B\u3001\u5B57\u6570\u3001\u7AE0\u8282\u3001\u9644\u5F55\u3001\u6846\u67B6\u56FE\u3001ChatGPT \u63A8\u7406\u504F\u597D\u548C Prompt \u8BED\u8A00\u8BBE\u7F6E\uFF0C\u4F9B YanShu \u63D2\u4EF6\u76F4\u63A5\u8BFB\u53D6\u3002",
    resetDefaults: "\u6062\u590D\u9ED8\u8BA4\u914D\u7F6E",
    resetHint: "\u91CD\u7F6E\u8BBA\u6587\u7C7B\u578B\u3001\u6B63\u6587\u5B57\u6570\u6A21\u5F0F\u3001\u9644\u5F55\u3001\u6846\u67B6\u56FE\u3001ChatGPT \u63A8\u7406\u504F\u597D\u548C\u7AE0\u8282\u9884\u7B97\uFF1B\u4FDD\u7559\u5F53\u524D\u8BED\u8A00\u3002",
    plannerTitle: "\u6B63\u6587\u4E0E\u7AE0\u8282\u9884\u7B97",
    plannerBody: "\u8BBE\u7F6E\u6B63\u6587\u4E0E\u7AE0\u8282\u9884\u7B97\uFF1B\u53EF\u5355\u72EC\u53D6\u6D88\u65B9\u6CD5\u548C\u5B9E\u9A8C\u7684\u5B57\u6570\u9650\u5236\u3002",
    targetTotal: "\u6B63\u6587\u603B\u5B57\u6570",
    unlimitedMainText: "\u6B63\u6587\u603B\u6570\u4E0D\u9650",
    limitedSectionsTotal: "\u53D7\u9650\u7AE0\u8282\u5408\u8BA1",
    unlimitedCoreSections: "\u4E0D\u9650\u5236\u65B9\u6CD5\u548C\u5B9E\u9A8C\u7684\u5B57\u6570",
    unlimitedCoreSectionsHint: "\u5F00\u542F\u540E\u6B63\u6587\u4E0D\u8BBE\u603B\u5B57\u6570\uFF0C\u53EA\u9650\u5236\u5176\u4ED6\u7AE0\u8282\u3002",
    unlimitedSection: "\u4E0D\u9650",
    visualCountingRule: `\u8BA1\u8BCD\u89C4\u5219\uFF1A\u6BCF\u5F20\u8868\u683C\u6216\u56FE\u7247\u6309 ${WORD_COUNT_POLICY.visualWordEquivalent} \u8BCD\u8BA1\u5165\u6240\u5728\u7AE0\u8282\u53CA\u6B63\u6587\u603B\u6570\u3002`,
    resetAllocation: "\u6309\u6BD4\u4F8B\u91CD\u7B97",
    presetAllocation: "\u9884\u8BBE\u6BD4\u4F8B",
    customAllocation: "\u81EA\u5B9A\u4E49\u5206\u914D",
    budget: "\u5B57\u6570\u9884\u7B97",
    editAllocation: "\u7F16\u8F91\u7AE0\u8282",
    hideAllocation: "\u6536\u8D77",
    expand: "\u5C55\u5F00",
    collapse: "\u6536\u8D77",
    copy: "\u590D\u5236",
    copied: "\u5DF2\u590D\u5236",
    switchPromptLanguage: "\u5207\u6362 Prompt \u8BED\u8A00",
    copyAll: "\u590D\u5236\u5168\u90E8",
    copiedAll: "\u5DF2\u590D\u5236\u5168\u90E8",
    reconfigure: "\u91CD\u65B0\u914D\u7F6E",
    promptConfig: "\u5F53\u524D\u914D\u7F6E",
    promptStyle: "\u5199\u4F5C\u6A21\u5F0F",
    promptTarget: "\u6B63\u6587\u76EE\u6807",
    promptAppendix: "\u9644\u5F55",
    promptSections: "\u7AE0\u8282\u9884\u7B97",
    promptTask: "\u672C\u8F6E\u4EFB\u52A1",
    promptOutput: "\u8F93\u51FA\u8981\u6C42",
    promptBoundary: "\u8FB9\u754C\uFF1A\u4E0D\u8981\u865A\u6784\u4E8B\u5B9E\u3001\u5F15\u7528\u3001\u6570\u636E\u6216 venue \u89C4\u5219\uFF1B\u65E0\u6CD5\u786E\u8BA4\u7684\u5185\u5BB9\u5FC5\u987B\u660E\u786E\u6807\u8BB0\u3002",
    github: "GitHub \u9879\u76EE",
    clipboardError: "\u590D\u5236\u5931\u8D25\uFF0C\u8BF7\u5C55\u5F00\u540E\u624B\u52A8\u9009\u62E9\u6587\u672C\u3002"
  },
  en: {
    productTagline: "Research methods and an interactive CS workbench",
    version: "V1 \xB7 CS",
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
    subtitle: "Choose the paper type, main-text limit, appendix rule, and overview layout, then reconstruct the manuscript with five production prompts.",
    generalPreset: "General product preset \xB7 not an official venue rule",
    language: "Site language",
    chinese: "\u4E2D\u6587",
    english: "English",
    paperStyle: "Paper style",
    targetWords: "Main-text word limit",
    targetWordsHint: "When enabled, section 06 appears. The appendix is excluded; each table or figure counts as 200 words.",
    wordLimitOn: "Apply a word limit",
    wordLimitOff: "No special limit",
    noWordLimitHint: "When disabled, section 06 is hidden and all five prompts omit the main-text total and section budgets.",
    words: "words",
    appendix: "Appendix",
    appendixOn: "Appendix allowed",
    appendixOff: "No appendix",
    frameworkFigure: "Overall framework figure",
    frameworkRatio: "Canvas ratio",
    frameworkCustomWidth: "Width",
    frameworkCustomHeight: "Height",
    frameworkFixedRules: "All other controls use the Method Overview recommendation: a pure-white canvas; Tol Vibrant with at most 2\u20133 accents and the smallest sufficient number; Calibri; extremely pale fills for key regions; three type-size levels; no large title; dark-neutral lines; restrained paper-specific scientific forms when useful, with no character cartoons, mascots, or marketing illustration.",
    chatExecution: "ChatGPT execution",
    chatModelPolicy: "Model policy",
    chatLatestVisibleModel: "Latest available reasoning model",
    chatReasoningPreference: "Reasoning level",
    chatRuntimePolicy: "GPT model names are never pinned. The plugin inspects the options currently visible in ChatGPT for every round, announces any fallback, and chooses the strongest available level when labels cannot be interpreted.",
    exportAutomation: "Export desktop config",
    exportedAutomation: "Config downloaded",
    exportAutomationHint: "Download the current paper type, length, section, appendix, framework-figure, ChatGPT reasoning preference, and prompt-language settings for the YanShu plugin.",
    resetDefaults: "Restore defaults",
    resetHint: "Resets paper type, length mode, appendix, framework figure, ChatGPT reasoning preference, and section budgets while keeping the current language.",
    plannerTitle: "Main-text and section budgets",
    plannerBody: "Set main-text and section budgets, with an independent unlimited mode for Method and Experiments.",
    targetTotal: "Main-text total",
    unlimitedMainText: "No main-text total",
    limitedSectionsTotal: "Limited sections",
    unlimitedCoreSections: "Do not limit Method or Experiments",
    unlimitedCoreSectionsHint: "When enabled, there is no main-text total; only the other sections are limited.",
    unlimitedSection: "Unlimited",
    visualCountingRule: `Counting rule: each table or figure counts as ${WORD_COUNT_POLICY.visualWordEquivalent} words toward its section and the main-text total.`,
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
    promptBoundary: "Boundary: do not invent facts, citations, data, or venue rules. Mark anything that cannot be verified.",
    github: "GitHub repository",
    clipboardError: "Copy failed. Expand the card and select the text manually."
  }
};

// app/figures/extendedFigureAdapters.ts
var EXTENDED_FIGURE_TYPE_ADAPTERS = {
  "task-definition": {
    zh: `# Figure-Type Adapter \u2014 Task and Problem Formulation Figure

\u672C\u6B21\u53EA\u8BBE\u8BA1\u4EFB\u52A1\u5B9A\u4E49\u56FE\u3002

## \u56FE\u7684\u804C\u8D23

\u8FD9\u5F20\u56FE\u5FC5\u987B\u8BA9\u8BFB\u8005\u5728\u4E0D\u8FDB\u5165\u65B9\u6CD5\u5B9E\u73B0\u7684\u60C5\u51B5\u4E0B\u51C6\u786E\u7406\u89E3\uFF1A

1. \u8BBA\u6587\u5904\u7406\u7684\u57FA\u672C\u5BF9\u8C61\u3001\u6837\u672C\u6216\u73AF\u5883\u662F\u4EC0\u4E48\uFF1B
2. \u6A21\u578B\u80FD\u591F\u89C2\u5BDF\u5230\u4EC0\u4E48\u8F93\u5165\uFF1B
3. \u9700\u8981\u9884\u6D4B\u3001\u751F\u6210\u3001\u68C0\u7D22\u3001\u63A7\u5236\u6216\u6062\u590D\u4EC0\u4E48\u8F93\u51FA\uFF1B
4. \u8F93\u5165\u3001\u5B9E\u4F53\u3001\u5173\u7CFB\u3001\u6807\u7B7E\u3001\u72B6\u6001\u6216\u52A8\u4F5C\u4E4B\u95F4\u5982\u4F55\u7EC4\u7EC7\uFF1B
5. \u8BBA\u6587\u6B63\u5F0F\u5B9A\u4E49\u7684\u4EFB\u52A1\u8FB9\u754C\u548C\u7EA6\u675F\u662F\u4EC0\u4E48\u3002

\u5B83\u4E0D\u662F\u5F15\u8A00\u52A8\u673A\u56FE\uFF0C\u4E5F\u4E0D\u662F\u65B9\u6CD5\u67B6\u6784\u56FE\u3002

## \u8BC1\u636E\u8303\u56F4

\u4F18\u5148\u8BFB\u53D6\uFF1A

- Problem Formulation\uFF1B
- Task Definition\uFF1B
- Preliminaries\uFF1B
- Dataset \u6216 Annotation Schema \u4E2D\u4E0E\u6807\u7B7E\u5B9A\u4E49\u6709\u5173\u7684\u5185\u5BB9\uFF1B
- Method \u5F00\u5934\u5BF9\u8F93\u5165\u8F93\u51FA\u7684\u6B63\u5F0F\u8BF4\u660E\u3002

Abstract \u548C Introduction \u53EA\u80FD\u7528\u4E8E\u7406\u89E3\u80CC\u666F\uFF0C\u4E0D\u80FD\u4EE3\u66FF\u6B63\u5F0F\u4EFB\u52A1\u5B9A\u4E49\u3002

## \u63A8\u8350\u89C6\u89C9\u8BED\u6CD5

\u6839\u636E\u8BBA\u6587\u771F\u5B9E\u4EFB\u52A1\u9009\u62E9\u4E00\u79CD\u4E3B\u8981\u7ED3\u6784\uFF1A

- representative instance \u2192 structured input \u2192 structured output\uFF1B
- entities and relations\uFF1B
- observation \u2192 latent target \u2192 required prediction\uFF1B
- source modality \u2192 aligned objects \u2192 output schema\uFF1B
- state \u2192 action \u2192 transition\uFF1B
- query \u2192 candidate evidence \u2192 target answer\uFF1B
- nested labels or hierarchical output\uFF1B
- coordinate frames and target variables\u3002

\u4F18\u5148\u4F7F\u7528\u4E00\u4E2A\u4EE3\u8868\u6027\u6837\u4F8B\u3001\u5173\u7CFB\u56FE\u3001\u7ED3\u6784\u5316 tuple\u3001\u8F93\u51FA schema \u6216\u8F93\u5165\u8F93\u51FA\u6620\u5C04\u3002

\u4E0D\u8981\u4F7F\u7528\u901A\u7528\u7684 Input \u2192 Model \u2192 Output \u4E09\u4E2A\u7A7A\u6846\u3002

## \u5185\u5BB9\u9884\u7B97

\u9ED8\u8BA4\u9650\u5236\u4E3A\uFF1A

- 2\u20134 \u4E2A\u4E3B\u8981\u533A\u57DF\uFF1B
- 6\u201310 \u4E2A\u4E3B\u8981\u89C6\u89C9\u5BF9\u8C61\uFF1B
- 8\u201314 \u4E2A\u53EF\u89C1\u6807\u7B7E\uFF1B
- 0\u20132 \u4E2A\u6B63\u5F0F\u5B9A\u4E49\u6216\u516C\u5F0F\uFF1B
- 4\u20138 \u6761\u5173\u952E\u5173\u7CFB\uFF1B
- \u6700\u591A\u4E00\u4E2A\u4EE3\u8868\u6027\u6837\u4F8B\u3002

## \u5FC5\u987B\u5448\u73B0

\u4F18\u5148\u4FDD\u7559\uFF1A

- \u6B63\u5F0F\u8F93\u5165\uFF1B
- \u6B63\u5F0F\u8F93\u51FA\uFF1B
- \u6838\u5FC3\u5B9E\u4F53\uFF1B
- \u8F93\u51FA\u7ED3\u6784\uFF1B
- \u6807\u7B7E\u6216\u5173\u7CFB\u65B9\u5411\uFF1B
- \u5DF2\u77E5\u91CF\u3001\u672A\u77E5\u91CF\u6216\u7EA6\u675F\uFF1B
- \u4E00\u4E2A\u80FD\u5E2E\u52A9\u8BFB\u8005\u7406\u89E3\u4EFB\u52A1\u7684\u4EE3\u8868\u6027\u6620\u5C04\u3002

## \u4E0D\u5F97\u5448\u73B0

- \u73B0\u6709\u65B9\u6CD5\u7684\u5931\u8D25\u6545\u4E8B\uFF1B
- \u672C\u6587\u65B9\u6CD5\u6A21\u5757\uFF1B
- backbone\u3001encoder\u3001loss \u6216\u8BAD\u7EC3\u9636\u6BB5\uFF1B
- \u5B9E\u9A8C\u7ED3\u679C\u548C\u6570\u636E\u7EDF\u8BA1\uFF1B
- baseline\uFF1B
- \u4E0D\u5C5E\u4E8E\u4EFB\u52A1\u5B9A\u4E49\u7684\u5B9E\u73B0\u7EC6\u8282\u3002

\u6700\u7EC8\u82F1\u6587\u5236\u56FE Prompt \u63A7\u5236\u5728\u7EA6 450\u2013750 \u4E2A\u82F1\u6587\u8BCD\u3002`,
    en: `# Figure-Type Adapter \u2014 Task and Problem Formulation Figure

Design only a Task and Problem Formulation figure in this task.

## Figure responsibility

Without entering method implementation, the figure must let the reader understand precisely:

1. what fundamental objects, samples, or environment the paper studies;
2. what inputs the model can observe;
3. what output must be predicted, generated, retrieved, controlled, or recovered;
4. how inputs, entities, relations, labels, states, or actions are organized;
5. what task boundary and constraints the paper formally defines.

This is neither an Introduction motivation figure nor a method architecture.

## Evidence scope

Prioritize:

- Problem Formulation;
- Task Definition;
- Preliminaries;
- label definitions in the Dataset or Annotation Schema;
- formal input and output definitions at the start of the Method.

Use the Abstract and Introduction for context only; they cannot replace the formal task definition.

## Recommended visual grammar

Select one primary structure that matches the actual task:

- representative instance \u2192 structured input \u2192 structured output;
- entities and relations;
- observation \u2192 latent target \u2192 required prediction;
- source modality \u2192 aligned objects \u2192 output schema;
- state \u2192 action \u2192 transition;
- query \u2192 candidate evidence \u2192 target answer;
- nested labels or hierarchical output;
- coordinate frames and target variables.

Prefer one representative instance, relation graph, structured tuple, output schema, or input\u2013output mapping.

Do not use three empty boxes labeled Input \u2192 Model \u2192 Output.

## Content budget

Default limits:

- 2\u20134 principal regions;
- 6\u201310 principal visual objects;
- 8\u201314 visible labels;
- 0\u20132 formal definitions or equations;
- 4\u20138 key relations;
- at most one representative instance.

## Required content

Prioritize:

- formal input;
- formal output;
- core entities;
- output structure;
- label or relation direction;
- known quantities, unknown quantities, or constraints;
- one representative mapping that materially clarifies the task.

## Excluded content

Do not include:

- a failure story about existing methods;
- modules from the proposed method;
- a backbone, encoder, loss, or training stages;
- experimental results or dataset statistics;
- baselines;
- implementation details outside the task definition.

Keep the final English image-generation prompt to approximately 450\u2013750 words.`
  },
  "training-inference": {
    zh: `# Figure-Type Adapter \u2014 Training and Inference Figure

\u672C\u6B21\u53EA\u8BBE\u8BA1\u8BAD\u7EC3\u2013\u63A8\u7406\u5173\u7CFB\u56FE\u3002

## \u56FE\u7684\u804C\u8D23

\u8FD9\u5F20\u56FE\u5FC5\u987B\u6E05\u695A\u8BF4\u660E\uFF1A

1. \u8BAD\u7EC3\u9636\u6BB5\u63A5\u6536\u54EA\u4E9B\u6570\u636E\u3001\u6807\u7B7E\u6216\u8F85\u52A9\u4FE1\u53F7\uFF1B
2. \u54EA\u4E9B\u7EC4\u4EF6\u6216\u5206\u652F\u4EC5\u5728\u8BAD\u7EC3\u65F6\u5B58\u5728\uFF1B
3. \u54EA\u4E9B\u53C2\u6570\u6216\u8868\u793A\u5728\u8BAD\u7EC3\u4E0E\u63A8\u7406\u4E4B\u95F4\u5171\u4EAB\uFF1B
4. \u54EA\u4E9B\u7EC4\u4EF6\u5728\u8BAD\u7EC3\u540E\u88AB\u51BB\u7ED3\u3001\u5220\u9664\u6216\u4FDD\u7559\uFF1B
5. \u63A8\u7406\u9636\u6BB5\u7684\u771F\u5B9E\u8F93\u5165\u3001\u8BA1\u7B97\u8DEF\u5F84\u548C\u8F93\u51FA\u662F\u4EC0\u4E48\u3002

\u5B83\u4E0D\u662F\u5B8C\u6574\u65B9\u6CD5\u603B\u89C8\u56FE\uFF0C\u4E0D\u9700\u8981\u91CD\u65B0\u7ED8\u5236\u6240\u6709\u6A21\u5757\u5185\u90E8\u7ED3\u6784\u3002

## \u8BC1\u636E\u8303\u56F4

\u4F18\u5148\u8BFB\u53D6\uFF1A

- Training Objective\uFF1B
- Optimization\uFF1B
- Inference\uFF1B
- Implementation Details \u4E2D\u4E0E\u9636\u6BB5\u5DEE\u5F02\u6709\u5173\u7684\u90E8\u5206\uFF1B
- Method \u4E2D\u660E\u786E\u6807\u8BB0 training-only\u3001inference-only\u3001frozen \u6216 shared \u7684\u5185\u5BB9\u3002

\u4E0D\u5F97\u6839\u636E\u5E38\u89C1\u8BAD\u7EC3\u8303\u5F0F\u63A8\u6D4B\u4E0D\u5B58\u5728\u7684 teacher\u3001loss\u3001pseudo-label \u6216\u51BB\u7ED3\u8FC7\u7A0B\u3002

## \u63A8\u8350\u89C6\u89C9\u8BED\u6CD5

\u4F18\u5148\u91C7\u7528\uFF1A

- \u4E0A\u65B9 training lane\u3001\u4E0B\u65B9 inference lane\uFF1B
- \u5DE6\u4FA7\u5171\u4EAB\u6A21\u5757\u3001\u53F3\u4FA7\u9636\u6BB5\u4E13\u5C5E\u5206\u652F\uFF1B
- \u4E00\u4E2A\u5171\u4EAB\u8BA1\u7B97 rail \u8FDE\u63A5\u4E24\u4E2A\u9636\u6BB5\uFF1B
- training-only supervision \u4EE5\u660E\u786E\u7684\u8F85\u52A9\u8FDE\u63A5\u8868\u793A\uFF1B
- \u4ECE trained parameters \u5230 inference path \u7684\u51BB\u7ED3\u6216\u7EE7\u627F\u5173\u7CFB\u3002

\u4E0D\u8981\u628A\u6574\u4E2A\u65B9\u6CD5\u5728\u4E0A\u4E0B\u4E24\u6761\u8F68\u9053\u5B8C\u6574\u590D\u5236\u4E24\u904D\u3002

\u5171\u4EAB\u6A21\u5757\u53EA\u7ED8\u5236\u4E00\u6B21\uFF0C\u5E76\u901A\u8FC7 shared\u3001reused \u6216 frozen connection \u8868\u8FBE\u590D\u7528\u3002

## \u5185\u5BB9\u9884\u7B97

\u9ED8\u8BA4\u9650\u5236\u4E3A\uFF1A

- 2 \u6761\u4E3B\u8F68\u9053\uFF1B
- 6\u201312 \u4E2A\u4E3B\u8981\u89C6\u89C9\u5BF9\u8C61\uFF1B
- 10\u201316 \u4E2A\u53EF\u89C1\u6807\u7B7E\uFF1B
- 0\u20132 \u4E2A\u6838\u5FC3 loss \u6216\u8BAD\u7EC3\u76EE\u6807\uFF1B
- 6\u201310 \u6761\u5173\u952E\u8FDE\u63A5\uFF1B
- training-only \u5206\u652F\u4E0D\u8D85\u8FC7\u603B\u9762\u79EF\u7684 30%\u3002

## \u89C6\u89C9\u8BED\u4E49

\u5FC5\u987B\u660E\u786E\u533A\u5206\uFF1A

- trainable\uFF1B
- frozen\uFF1B
- training-only\uFF1B
- inference-only\uFF1B
- shared\uFF1B
- discarded after training\u3002

\u8FD9\u4E9B\u533A\u522B\u4E0D\u80FD\u53EA\u4F9D\u8D56\u989C\u8272\uFF0C\u8FD8\u5E94\u901A\u8FC7\u4F4D\u7F6E\u3001\u8FB9\u754C\u3001\u7EBF\u578B\u6216\u76F4\u63A5\u6807\u7B7E\u8868\u8FBE\u3002

## \u4E0D\u5F97\u5448\u73B0

- \u5168\u90E8 Method \u7EC6\u8282\uFF1B
- \u6BCF\u4E2A loss \u7684\u5B8C\u6574\u63A8\u5BFC\uFF1B
- \u4F18\u5316\u5668\u3001\u5B66\u4E60\u7387\u548C epoch\uFF1B
- \u5B9E\u9A8C\u8868\u73B0\uFF1B
- \u8BAD\u7EC3\u66F2\u7EBF\uFF1B
- \u4E0E\u8BAD\u7EC3\u2013\u63A8\u7406\u5DEE\u5F02\u65E0\u5173\u7684\u8F85\u52A9\u6A21\u5757\u3002

\u6700\u7EC8\u82F1\u6587\u5236\u56FE Prompt \u63A7\u5236\u5728\u7EA6 500\u2013850 \u4E2A\u82F1\u6587\u8BCD\u3002`,
    en: `# Figure-Type Adapter \u2014 Training and Inference Figure

Design only a Training and Inference relationship figure in this task.

## Figure responsibility

The figure must make clear:

1. which data, labels, or auxiliary signals enter training;
2. which components or branches exist only during training;
3. which parameters or representations are shared between training and inference;
4. which components are frozen, discarded, or retained after training;
5. the real input, computation path, and output used during inference.

This is not a complete Method Overview and does not need to redraw the internal structure of every module.

## Evidence scope

Prioritize:

- Training Objective;
- Optimization;
- Inference;
- phase-specific information in Implementation Details;
- content explicitly marked training-only, inference-only, frozen, or shared in the Method.

Do not infer a teacher, loss, pseudo-label process, or freezing step merely because it is common in similar work.

## Recommended visual grammar

Prefer:

- a training lane above and an inference lane below;
- shared modules on one side and phase-specific branches on the other;
- one shared-computation rail connecting both phases;
- explicit auxiliary connections for training-only supervision;
- a freezing or inheritance relation from trained parameters to the inference path.

Do not duplicate the entire method once in each lane.

Draw a shared module once and express reuse with a shared, reused, or frozen connection.

## Content budget

Default limits:

- 2 principal lanes;
- 6\u201312 principal visual objects;
- 10\u201316 visible labels;
- 0\u20132 core losses or training objectives;
- 6\u201310 key connections;
- training-only branches occupying no more than 30% of the canvas.

## Visual semantics

Clearly distinguish:

- trainable;
- frozen;
- training-only;
- inference-only;
- shared;
- discarded after training.

Do not rely on color alone. Also use position, boundaries, line styles, or direct labels.

## Excluded content

Do not include:

- every Method detail;
- a complete derivation of every loss;
- optimizer, learning rate, or epoch settings;
- experimental performance;
- training curves;
- auxiliary modules unrelated to the training\u2013inference difference.

Keep the final English image-generation prompt to approximately 500\u2013850 words.`
  },
  "algorithm-protocol": {
    zh: `# Figure-Type Adapter \u2014 Algorithm, Decision, or Protocol Figure

\u672C\u6B21\u53EA\u8BBE\u8BA1\u7B97\u6CD5\u3001\u51B3\u7B56\u6216\u534F\u8BAE\u8FC7\u7A0B\u56FE\u3002

## \u56FE\u7684\u804C\u8D23

\u8FD9\u5F20\u56FE\u5FC5\u987B\u8BF4\u660E\u4E00\u4E2A\u8FC7\u7A0B\u5982\u4F55\u6267\u884C\uFF1A

1. \u521D\u59CB\u72B6\u6001\u3001\u8F93\u5165\u6216\u58F0\u660E\u6761\u4EF6\u662F\u4EC0\u4E48\uFF1B
2. \u6BCF\u4E00\u6B65\u80FD\u591F\u89C2\u5BDF\u4EC0\u4E48\uFF1B
3. \u6267\u884C\u4EC0\u4E48\u51B3\u7B56\u3001\u66F4\u65B0\u6216\u53D8\u6362\uFF1B
4. \u65B0\u72B6\u6001\u5982\u4F55\u53CD\u9988\u5230\u4E0B\u4E00\u6B65\uFF1B
5. \u4F55\u65F6\u505C\u6B62\u3001\u63A5\u53D7\u3001\u62D2\u7EDD\u3001\u51BB\u7ED3\u6216\u8F93\u51FA\uFF1B
6. offline preparation \u4E0E online execution \u662F\u5426\u5B58\u5728\u8FB9\u754C\u3002

\u5B83\u4E0D\u662F\u795E\u7ECF\u7F51\u7EDC\u67B6\u6784\u56FE\uFF0C\u4E5F\u4E0D\u662F\u4EE3\u7801\u6D41\u7A0B\u56FE\u3002

## \u9996\u5148\u8BC6\u522B\u8FC7\u7A0B\u7C7B\u578B

\u6839\u636E\u8BBA\u6587\u771F\u5B9E\u7ED3\u6784\u9009\u62E9\uFF1A

- iterative update\uFF1B
- sequential decision\uFF1B
- declare\u2013select\u2013freeze\u2013evaluate protocol\uFF1B
- propose\u2013verify\u2013revise\uFF1B
- retrieve\u2013rank\u2013decide\uFF1B
- observe\u2013act\u2013transition\uFF1B
- initialize\u2013optimize\u2013terminate\uFF1B
- calibrate\u2013evaluate\u2013correct\uFF1B
- planning\u2013execution\u2013feedback\u3002

\u53EA\u9009\u62E9\u4E00\u4E2A\u4E3B\u8FC7\u7A0B\u3002

## \u63A8\u8350\u89C6\u89C9\u8BED\u6CD5

\u4F18\u5148\u4F7F\u7528\uFF1A

- \u521D\u59CB\u72B6\u6001\uFF1B
- \u4E00\u7EC4\u5173\u952E\u72B6\u6001\u5FEB\u7167\uFF1B
- \u4E00\u4E2A update \u6216 decision \u6838\u5FC3\uFF1B
- \u4E00\u6761\u771F\u5B9E\u53CD\u9988\u56DE\u8DEF\uFF1B
- \u4E00\u4E2A stopping or acceptance boundary\uFF1B
- \u4E00\u4E2A\u6700\u7EC8\u8F93\u51FA\u3002

\u53EA\u6709\u771F\u5B9E\u5FAA\u73AF\u624D\u7ED8\u5236 loop\u3002\u4E0D\u5F97\u4E3A\u4E86\u89C6\u89C9\u590D\u6742\u6027\u6DFB\u52A0\u53CD\u9988\u7BAD\u5934\u3002

\u5BF9\u4E8E protocol \u7C7B\u8BBA\u6587\uFF0C\u5E94\u5F3A\u8C03\u9636\u6BB5\u8FB9\u754C\u3001\u6570\u636E\u9694\u79BB\u3001\u51BB\u7ED3\u65F6\u523B\u548C\u6BD4\u8F83\u5173\u7CFB\uFF0C\u800C\u4E0D\u662F\u628A\u5B83\u753B\u6210 learned model\u3002

## \u5185\u5BB9\u9884\u7B97

\u9ED8\u8BA4\u9650\u5236\u4E3A\uFF1A

- 3\u20136 \u4E2A\u6838\u5FC3\u9636\u6BB5\uFF1B
- 7\u201312 \u4E2A\u4E3B\u8981\u89C6\u89C9\u5BF9\u8C61\uFF1B
- 10\u201316 \u4E2A\u53EF\u89C1\u6807\u7B7E\uFF1B
- 1\u20133 \u4E2A\u66F4\u65B0\u3001\u7EA6\u675F\u6216\u505C\u6B62\u516C\u5F0F\uFF1B
- \u6700\u591A\u4E00\u4E2A\u4E3B\u5FAA\u73AF\uFF1B
- 6\u201312 \u6761\u5173\u952E\u8FDE\u63A5\u3002

## \u5FC5\u987B\u5448\u73B0

- state \u6216 process input\uFF1B
- update / decision\uFF1B
- observation or evidence\uFF1B
- stopping or transition condition\uFF1B
- output\uFF1B
- \u5FC5\u8981\u7684 offline / online \u8FB9\u754C\u3002

## \u4E0D\u5F97\u5448\u73B0

- \u9010\u884C\u4F2A\u4EE3\u7801\uFF1B
- \u6240\u6709 if\u2013else\uFF1B
- \u6BCF\u4E00\u4E2A\u4E2D\u95F4\u53D8\u91CF\uFF1B
- \u4EE3\u7801\u51FD\u6570\u540D\uFF1B
- \u8D85\u53C2\u6570\uFF1B
- \u5B9E\u9A8C\u6027\u80FD\uFF1B
- \u4E0D\u5B58\u5728\u7684\u8BAD\u7EC3\u8FC7\u7A0B\uFF1B
- \u5C06\u4E0D\u540C comparator \u6216 variant \u8BEF\u753B\u6210\u8FDE\u7EED\u6267\u884C\u9636\u6BB5\u3002

\u6700\u7EC8\u82F1\u6587\u5236\u56FE Prompt \u63A7\u5236\u5728\u7EA6 550\u2013900 \u4E2A\u82F1\u6587\u8BCD\u3002`,
    en: `# Figure-Type Adapter \u2014 Algorithm, Decision, or Protocol Figure

Design only an Algorithm, Decision, or Protocol process figure in this task.

## Figure responsibility

The figure must explain how one process executes:

1. its initial state, input, or declared condition;
2. what can be observed at each step;
3. what decision, update, or transformation is performed;
4. how the new state feeds the next step;
5. when the process stops, accepts, rejects, freezes, or emits an output;
6. whether an offline-preparation boundary and an online-execution boundary exist.

This is neither a neural-network architecture nor a code flowchart.

## Identify the process type first

Choose the structure supported by the paper:

- iterative update;
- sequential decision;
- declare\u2013select\u2013freeze\u2013evaluate protocol;
- propose\u2013verify\u2013revise;
- retrieve\u2013rank\u2013decide;
- observe\u2013act\u2013transition;
- initialize\u2013optimize\u2013terminate;
- calibrate\u2013evaluate\u2013correct;
- planning\u2013execution\u2013feedback.

Choose exactly one principal process.

## Recommended visual grammar

Prefer:

- an initial state;
- a small set of decisive state snapshots;
- one update or decision core;
- one real feedback loop;
- one stopping or acceptance boundary;
- one final output.

Draw a loop only when the paper contains a real loop. Never add feedback arrows merely to increase visual complexity.

For a protocol paper, emphasize phase boundaries, data isolation, freezing points, and comparison relations instead of depicting a learned model.

## Content budget

Default limits:

- 3\u20136 core stages;
- 7\u201312 principal visual objects;
- 10\u201316 visible labels;
- 1\u20133 update, constraint, or stopping equations;
- at most one principal loop;
- 6\u201312 key connections.

## Required content

Include:

- state or process input;
- update or decision;
- observation or evidence;
- stopping or transition condition;
- output;
- necessary offline and online boundaries.

## Excluded content

Do not include:

- line-by-line pseudocode;
- every if\u2013else branch;
- every intermediate variable;
- code function names;
- hyperparameters;
- experimental performance;
- a training process that does not exist;
- different comparators or variants misrepresented as consecutive execution stages.

Keep the final English image-generation prompt to approximately 550\u2013900 words.`
  },
  "data-construction": {
    zh: `# Figure-Type Adapter \u2014 Data Construction and Annotation Figure

\u672C\u6B21\u53EA\u8BBE\u8BA1\u6570\u636E\u6784\u5EFA\u3001\u6807\u6CE8\u6216\u6570\u636E\u6CBB\u7406\u6D41\u7A0B\u56FE\u3002

## \u56FE\u7684\u804C\u8D23

\u8FD9\u5F20\u56FE\u5FC5\u987B\u8BF4\u660E\uFF1A

1. \u539F\u59CB\u6570\u636E\u6765\u81EA\u54EA\u4E9B\u771F\u5B9E\u6765\u6E90\uFF1B
2. \u6570\u636E\u7ECF\u5386\u54EA\u4E9B\u7B5B\u9009\u3001\u6E05\u6D17\u3001\u5207\u5206\u6216\u8F6C\u6362\uFF1B
3. \u6807\u7B7E\u3001\u4F2A\u6807\u7B7E\u6216\u7ED3\u6784\u5316\u6807\u6CE8\u5982\u4F55\u4EA7\u751F\uFF1B
4. \u4EBA\u5DE5\u4E0E\u81EA\u52A8\u6B65\u9AA4\u5982\u4F55\u914D\u5408\uFF1B
5. \u8D28\u91CF\u63A7\u5236\u3001\u51B2\u7A81\u5904\u7406\u548C\u53BB\u91CD\u5982\u4F55\u8FDB\u884C\uFF1B
6. \u6700\u7EC8\u5F62\u6210\u4EC0\u4E48\u6837\u7684\u6570\u636E\u5355\u4F4D\u3001\u6807\u7B7E\u7ED3\u6784\u6216\u53D1\u5E03\u7248\u672C\u3002

\u5B83\u4E0D\u662F\u6570\u636E\u7EDF\u8BA1\u56FE\uFF0C\u4E5F\u4E0D\u662F\u5B9E\u9A8C\u8BBE\u7F6E\u56FE\u3002

## \u63A8\u8350\u89C6\u89C9\u8BED\u6CD5

\u6839\u636E\u771F\u5B9E\u6D41\u7A0B\u9009\u62E9\uFF1A

- source provenance \u2192 filtering funnel \u2192 annotation \u2192 quality control \u2192 release\uFF1B
- multiple sources \u2192 normalization \u2192 alignment \u2192 merge\uFF1B
- automatic proposal \u2192 human review \u2192 adjudication\uFF1B
- raw multimodal item \u2192 synchronized components \u2192 structured sample\uFF1B
- weak label \u2192 verification \u2192 accepted / rejected branches\u3002

\u4F7F\u7528\u6570\u636E\u8840\u7F18\u3001\u6F0F\u6597\u3001\u5206\u652F\u3001\u6C47\u5408\u3001\u8D28\u91CF\u95E8\u548C\u6700\u7EC8 schema \u8868\u8FBE\u3002

## \u5185\u5BB9\u9884\u7B97

\u9ED8\u8BA4\u9650\u5236\u4E3A\uFF1A

- 4\u20136 \u4E2A\u4E3B\u8981\u9636\u6BB5\uFF1B
- 8\u201314 \u4E2A\u89C6\u89C9\u5BF9\u8C61\uFF1B
- 10\u201318 \u4E2A\u53EF\u89C1\u6807\u7B7E\uFF1B
- 0\u20131 \u4E2A\u5FC5\u8981\u89C4\u5219\u516C\u5F0F\uFF1B
- 8\u201312 \u6761\u5173\u952E\u8FDE\u63A5\u3002

\u53EA\u6709\u6837\u672C\u6570\u91CF\u672C\u8EAB\u6784\u6210\u6570\u636E\u5B9A\u4E49\u6216\u7248\u672C\u8FB9\u754C\u65F6\uFF0C\u624D\u5141\u8BB8\u5C55\u793A\u5C11\u91CF\u786E\u5B9A\u6570\u91CF\u3002\u4E0D\u5F97\u5C55\u793A\u5B9E\u9A8C\u6027\u80FD\u6570\u5B57\u3002

## \u5FC5\u987B\u533A\u5206

- raw source\uFF1B
- automatic processing\uFF1B
- human annotation\uFF1B
- quality control\uFF1B
- final sample\uFF1B
- train / validation / test split\uFF0C\u53EA\u6709\u5176\u5212\u5206\u8FC7\u7A0B\u5C5E\u4E8E\u6570\u636E\u8D21\u732E\u65F6\u624D\u5C55\u793A\u3002

## \u4E0D\u5F97\u5448\u73B0

- \u6A21\u578B\u6027\u80FD\uFF1B
- \u6570\u636E\u5206\u5E03\u67F1\u72B6\u56FE\uFF1B
- \u7C7B\u522B\u6BD4\u4F8B\u56FE\uFF1B
- \u8BAD\u7EC3\u4EE3\u7801\uFF1B
- \u4E0D\u5C5E\u4E8E\u6784\u5EFA\u8FC7\u7A0B\u7684\u6A21\u578B\u67B6\u6784\uFF1B
- \u672A\u5728\u8BBA\u6587\u4E2D\u8BF4\u660E\u7684\u6570\u636E\u6765\u6E90\uFF1B
- \u5C06\u4EBA\u5DE5\u6B65\u9AA4\u4F2A\u88C5\u6210\u5B8C\u5168\u81EA\u52A8\u8FC7\u7A0B\u3002

\u6700\u7EC8\u82F1\u6587\u5236\u56FE Prompt \u63A7\u5236\u5728\u7EA6 500\u2013850 \u4E2A\u82F1\u6587\u8BCD\u3002`,
    en: `# Figure-Type Adapter \u2014 Data Construction and Annotation Figure

Design only a Data Construction, Annotation, or Data-Governance process figure in this task.

## Figure responsibility

The figure must explain:

1. the real provenance of the raw data;
2. the filtering, cleaning, splitting, or transformation steps;
3. how labels, pseudo-labels, or structured annotations are produced;
4. how human and automatic steps cooperate;
5. how quality control, conflict resolution, and deduplication work;
6. the resulting data unit, label structure, or released version.

This is neither a data-statistics plot nor an experimental-setup figure.

## Recommended visual grammar

Select a structure matching the real process:

- source provenance \u2192 filtering funnel \u2192 annotation \u2192 quality control \u2192 release;
- multiple sources \u2192 normalization \u2192 alignment \u2192 merge;
- automatic proposal \u2192 human review \u2192 adjudication;
- raw multimodal item \u2192 synchronized components \u2192 structured sample;
- weak label \u2192 verification \u2192 accepted / rejected branches.

Use data lineage, funnels, branches, merges, quality gates, and a final schema.

## Content budget

Default limits:

- 4\u20136 principal stages;
- 8\u201314 visual objects;
- 10\u201318 visible labels;
- 0\u20131 necessary rule equation;
- 8\u201312 key connections.

Show a small number of exact sample counts only when the count itself defines the dataset or a version boundary. Never show experimental performance numbers.

## Required distinctions

Clearly distinguish:

- raw source;
- automatic processing;
- human annotation;
- quality control;
- final sample;
- train / validation / test split only when the split procedure is itself a data contribution.

## Excluded content

Do not include:

- model performance;
- data-distribution bar charts;
- class-proportion charts;
- training code;
- a model architecture unrelated to construction;
- data sources not documented by the paper;
- a human step misrepresented as fully automatic.

Keep the final English image-generation prompt to approximately 500\u2013850 words.`
  },
  "system-deployment": {
    zh: `# Figure-Type Adapter \u2014 System and Deployment Architecture Figure

\u672C\u6B21\u53EA\u8BBE\u8BA1\u7CFB\u7EDF\u6216\u90E8\u7F72\u67B6\u6784\u56FE\u3002

## \u56FE\u7684\u804C\u8D23

\u8FD9\u5F20\u56FE\u5FC5\u987B\u8BF4\u660E\uFF1A

1. \u7CFB\u7EDF\u5305\u542B\u54EA\u4E9B\u8FD0\u884C\u5B9E\u4F53\uFF1B
2. \u5B83\u4EEC\u4F4D\u4E8E\u8BBE\u5907\u7AEF\u3001\u8FB9\u7F18\u7AEF\u3001\u670D\u52A1\u5668\u7AEF\u3001\u4E91\u7AEF\u6216\u5916\u90E8\u670D\u52A1\u4E2D\u7684\u54EA\u91CC\uFF1B
3. \u4E0D\u540C\u7EC4\u4EF6\u53D1\u9001\u3001\u63A5\u6536\u6216\u5B58\u50A8\u4EC0\u4E48\u4FE1\u606F\uFF1B
4. offline \u4E0E online \u8FC7\u7A0B\u5982\u4F55\u5206\u79BB\uFF1B
5. \u54EA\u4E9B\u8FB9\u754C\u6D89\u53CA\u9690\u79C1\u3001\u6743\u9650\u3001\u7F13\u5B58\u3001\u6570\u636E\u5E93\u3001\u5DE5\u5177\u6216\u5916\u90E8 API\uFF1B
6. \u7528\u6237\u8BF7\u6C42\u5982\u4F55\u5F62\u6210\u6700\u7EC8\u54CD\u5E94\u6216\u51B3\u7B56\u3002

\u5B83\u4E0D\u662F\u65B9\u6CD5\u5185\u90E8\u7B97\u5B50\u56FE\uFF0C\u4E5F\u4E0D\u662F\u4EA7\u54C1\u5BA3\u4F20\u56FE\u3002

## \u63A8\u8350\u89C6\u89C9\u8BED\u6CD5

\u4F18\u5148\u4F7F\u7528\uFF1A

- horizontal or vertical swimlanes\uFF1B
- client / edge / server / external-service zones\uFF1B
- agent / tool / memory / environment interactions\uFF1B
- offline preparation lane and online serving lane\uFF1B
- request flow and response flow\uFF1B
- shared service or storage boundary\u3002

\u533A\u57DF\u5FC5\u987B\u7531\u771F\u5B9E\u90E8\u7F72\u8FB9\u754C\u5B9A\u4E49\uFF0C\u800C\u4E0D\u662F\u4E3A\u4E86\u753B\u9762\u6574\u9F50\u968F\u610F\u5206\u7EC4\u3002

## \u5185\u5BB9\u9884\u7B97

\u9ED8\u8BA4\u9650\u5236\u4E3A\uFF1A

- 3\u20135 \u4E2A\u8FD0\u884C\u533A\u57DF\uFF1B
- 8\u201314 \u4E2A\u4E3B\u8981\u7EC4\u4EF6\uFF1B
- 12\u201318 \u4E2A\u53EF\u89C1\u6807\u7B7E\uFF1B
- 8\u201314 \u6761\u6D88\u606F\u6216\u63A7\u5236\u8FDE\u63A5\uFF1B
- 0\u20131 \u4E2A\u5FC5\u8981\u63A5\u53E3 schema\u3002

## \u8FDE\u63A5\u8BED\u4E49

\u6BCF\u6761\u91CD\u8981\u8FDE\u63A5\u5E94\u660E\u786E\u5C5E\u4E8E\uFF1A

- request\uFF1B
- data\uFF1B
- control\uFF1B
- model update\uFF1B
- retrieval\uFF1B
- storage read/write\uFF1B
- response\u3002

\u4E0D\u8981\u628A\u6240\u6709\u8FDE\u63A5\u90FD\u753B\u6210\u6CA1\u6709\u8BED\u4E49\u7684\u540C\u4E00\u79CD\u6570\u636E\u7BAD\u5934\u3002

## \u4E0D\u5F97\u5448\u73B0

- \u4E0E\u90E8\u7F72\u65E0\u5173\u7684\u5B8C\u6574\u7B97\u6CD5\u5185\u90E8\u7EC6\u8282\uFF1B
- \u5177\u4F53\u5B9E\u9A8C\u541E\u5410\u91CF\u548C\u5EF6\u8FDF\uFF1B
- \u672A\u5B9E\u73B0\u7684\u670D\u52A1\uFF1B
- \u8425\u9500\u5F0F\u4E91\u3001\u673A\u5668\u4EBA\u6216\u7528\u6237\u63D2\u753B\uFF1B
- \u65E0\u6765\u6E90\u7684\u7F51\u7EDC\u8FDE\u63A5\uFF1B
- \u5C06 offline training \u9519\u753B\u6210 online serving\u3002

\u6700\u7EC8\u82F1\u6587\u5236\u56FE Prompt \u63A7\u5236\u5728\u7EA6 550\u2013900 \u4E2A\u82F1\u6587\u8BCD\u3002`,
    en: `# Figure-Type Adapter \u2014 System and Deployment Architecture Figure

Design only a System or Deployment Architecture figure in this task.

## Figure responsibility

The figure must explain:

1. which runtime entities belong to the system;
2. whether each entity runs on a device, edge node, server, cloud service, or external service;
3. what information each component sends, receives, or stores;
4. how offline and online processes are separated;
5. which boundaries involve privacy, permission, cache, database, tools, or external APIs;
6. how a user request becomes the final response or decision.

This is neither an internal operator diagram nor a product-marketing illustration.

## Recommended visual grammar

Prefer:

- horizontal or vertical swimlanes;
- client / edge / server / external-service zones;
- agent / tool / memory / environment interactions;
- an offline-preparation lane and an online-serving lane;
- request flow and response flow;
- a shared-service or storage boundary.

Define regions by real deployment boundaries, never by arbitrary visual grouping.

## Content budget

Default limits:

- 3\u20135 runtime regions;
- 8\u201314 principal components;
- 12\u201318 visible labels;
- 8\u201314 message or control connections;
- 0\u20131 necessary interface schema.

## Connection semantics

Classify every important connection as one of:

- request;
- data;
- control;
- model update;
- retrieval;
- storage read/write;
- response.

Do not render every connection as the same unlabeled data arrow.

## Excluded content

Do not include:

- full internal algorithm details unrelated to deployment;
- experimental throughput or latency;
- services that were not implemented;
- marketing-style clouds, robots, or user illustrations;
- network links without a documented source;
- offline training misrepresented as online serving.

Keep the final English image-generation prompt to approximately 550\u2013900 words.`
  },
  "theory-concept": {
    zh: `# Figure-Type Adapter \u2014 Theoretical and Conceptual Relation Figure

\u672C\u6B21\u53EA\u8BBE\u8BA1\u7406\u8BBA\u3001\u5F62\u5F0F\u5316\u5B9A\u4E49\u6216\u6982\u5FF5\u5173\u7CFB\u56FE\u3002

## \u56FE\u7684\u804C\u8D23

\u8FD9\u5F20\u56FE\u5FC5\u987B\u5E2E\u52A9\u8BFB\u8005\u7406\u89E3\uFF1A

1. \u8BBA\u6587\u5B9A\u4E49\u4E86\u54EA\u4E9B\u6838\u5FC3\u5BF9\u8C61\uFF1B
2. \u5BF9\u8C61\u4E4B\u95F4\u5B58\u5728\u4EC0\u4E48\u5305\u542B\u3001\u504F\u5E8F\u3001\u4F9D\u8D56\u3001\u7B49\u4EF7\u3001\u5206\u89E3\u6216\u7EA6\u675F\u5173\u7CFB\uFF1B
3. \u54EA\u4E9B\u5047\u8BBE\u652F\u6301\u54EA\u4E9B\u547D\u9898\uFF1B
4. \u54EA\u4E2A\u91CF\u80FD\u591F\u4ECE\u53E6\u4E00\u4E2A\u91CF\u6062\u590D\u6216\u63A8\u5BFC\uFF1B
5. \u54EA\u4E9B\u6982\u5FF5\u76F8\u4F3C\u4F46\u4E0D\u80FD\u6DF7\u540C\uFF1B
6. \u8BBA\u6587\u6838\u5FC3\u7ED3\u8BBA\u5728\u5F62\u5F0F\u4F53\u7CFB\u4E2D\u7684\u4F4D\u7F6E\u662F\u4EC0\u4E48\u3002

\u5B83\u4E0D\u662F\u7B97\u6CD5\u6267\u884C\u6D41\u7A0B\uFF0C\u4E5F\u4E0D\u662F Method pipeline\u3002

## \u63A8\u8350\u89C6\u89C9\u8BED\u6CD5

\u6839\u636E\u8BBA\u6587\u771F\u5B9E\u7ED3\u6784\u9009\u62E9\uFF1A

- nested sets\uFF1B
- partial order\uFF1B
- dependency DAG\uFF1B
- assumption \u2192 proposition \u2192 consequence\uFF1B
- decomposition identity\uFF1B
- commutative diagram\uFF1B
- paired concepts with a separating condition\uFF1B
- hierarchy of admissible classes\uFF1B
- relation graph\u3002

\u4E0D\u8981\u56E0\u4E3A\u9605\u8BFB\u4E60\u60EF\u5F3A\u884C\u4F7F\u7528\u5DE6\u5230\u53F3\u6D41\u6C34\u7EBF\u3002

## \u5185\u5BB9\u9884\u7B97

\u9ED8\u8BA4\u9650\u5236\u4E3A\uFF1A

- 2\u20135 \u4E2A\u6982\u5FF5\u533A\u57DF\uFF1B
- 6\u201312 \u4E2A\u6838\u5FC3\u5BF9\u8C61\uFF1B
- 8\u201316 \u4E2A\u53EF\u89C1\u6807\u7B7E\uFF1B
- 1\u20133 \u4E2A\u6B63\u5F0F\u516C\u5F0F\uFF1B
- 5\u201310 \u6761\u7406\u8BBA\u5173\u7CFB\u3002

\u82E5\u6807\u7B7E\u6216\u516C\u5F0F\u66F4\u591A\uFF0C\u6807\u8BB0\u4E3A HYBRID OR VECTOR RECOMMENDED\u3002

## \u5173\u7CFB\u6807\u7B7E

\u5FC5\u987B\u51C6\u786E\u533A\u5206\uFF1A

- subset\uFF1B
- implication\uFF1B
- equivalence\uFF1B
- recoverability\uFF1B
- decomposition\uFF1B
- condition\uFF1B
- comparison\uFF1B
- causal relation\u3002

\u6CA1\u6709\u8BBA\u6587\u8BC1\u636E\u65F6\u4E0D\u5F97\u628A\u666E\u901A\u5173\u8054\u753B\u6210\u56E0\u679C\u5173\u7CFB\u3002

## \u4E0D\u5F97\u5448\u73B0

- \u8BC1\u660E\u5168\u6587\uFF1B
- \u957F\u7BC7 theorem \u6587\u5B57\uFF1B
- \u65B9\u6CD5\u5185\u90E8\u5B9E\u73B0\uFF1B
- \u5B9E\u9A8C\u7ED3\u679C\uFF1B
- \u6570\u503C\u4F8B\u5B50\uFF0C\u9664\u975E\u5B83\u662F\u7406\u89E3\u5B9A\u4E49\u4E0D\u53EF\u7F3A\u5C11\u7684\u53CD\u4F8B\uFF1B
- \u5C06\u96C6\u5408\u5305\u542B\u753B\u6210\u65F6\u95F4\u6267\u884C\u987A\u5E8F\u3002

\u6700\u7EC8\u82F1\u6587\u5236\u56FE Prompt \u63A7\u5236\u5728\u7EA6 450\u2013800 \u4E2A\u82F1\u6587\u8BCD\u3002`,
    en: `# Figure-Type Adapter \u2014 Theoretical and Conceptual Relation Figure

Design only a Theoretical, Formal-Definition, or Conceptual-Relation figure in this task.

## Figure responsibility

The figure must help the reader understand:

1. which core objects the paper defines;
2. which inclusion, partial-order, dependency, equivalence, decomposition, or constraint relations connect them;
3. which assumptions support which propositions;
4. which quantity can be recovered or derived from another;
5. which concepts appear similar but must remain distinct;
6. where the paper\u2019s core conclusion sits in the formal system.

This is neither an algorithm-execution process nor a Method pipeline.

## Recommended visual grammar

Select the structure supported by the paper:

- nested sets;
- partial order;
- dependency DAG;
- assumption \u2192 proposition \u2192 consequence;
- decomposition identity;
- commutative diagram;
- paired concepts with a separating condition;
- hierarchy of admissible classes;
- relation graph.

Do not force a left-to-right pipeline merely because it is familiar.

## Content budget

Default limits:

- 2\u20135 conceptual regions;
- 6\u201312 core objects;
- 8\u201316 visible labels;
- 1\u20133 formal equations;
- 5\u201310 theoretical relations.

If more labels or equations are unavoidable, explicitly mark the design HYBRID OR VECTOR RECOMMENDED.

## Relation labels

Accurately distinguish:

- subset;
- implication;
- equivalence;
- recoverability;
- decomposition;
- condition;
- comparison;
- causal relation.

Never turn a general association into a causal relation without evidence from the paper.

## Excluded content

Do not include:

- a full proof;
- long theorem prose;
- internal method implementation;
- experimental results;
- a numerical example unless it is an indispensable counterexample for understanding the definition;
- set inclusion depicted as temporal execution order.

Keep the final English image-generation prompt to approximately 450\u2013800 words.`
  },
  "geometry-coordinate": {
    zh: `# Figure-Type Adapter \u2014 Geometry and Coordinate-System Figure

\u672C\u6B21\u53EA\u8BBE\u8BA1\u51E0\u4F55\u3001\u5750\u6807\u7CFB\u6216\u7A7A\u95F4\u5173\u7CFB\u56FE\u3002

## \u56FE\u7684\u804C\u8D23

\u8FD9\u5F20\u56FE\u5FC5\u987B\u51C6\u786E\u8BF4\u660E\uFF1A

1. \u5B58\u5728\u54EA\u4E9B\u5750\u6807\u7CFB\u3001\u4F20\u611F\u5668\u6216\u7A7A\u95F4\u5B9E\u4F53\uFF1B
2. \u6BCF\u4E2A\u91CF\u5728\u54EA\u4E2A\u5750\u6807\u7CFB\u4E2D\u8868\u8FBE\uFF1B
3. \u5DF2\u77E5\u53D8\u6362\u548C\u672A\u77E5\u53D8\u6362\u5206\u522B\u662F\u4EC0\u4E48\uFF1B
4. \u70B9\u3001\u5C04\u7EBF\u3001\u56FE\u50CF\u5E73\u9762\u3001\u89C6\u9525\u6216\u70B9\u4E91\u5982\u4F55\u5BF9\u5E94\uFF1B
5. \u6295\u5F71\u3001\u53CD\u6295\u5F71\u3001\u521A\u4F53\u53D8\u6362\u6216\u8BEF\u5DEE\u5982\u4F55\u5F62\u6210\uFF1B
6. \u65B9\u6CD5\u6700\u7EC8\u4F30\u8BA1\u6216\u6821\u6B63\u4EC0\u4E48\u51E0\u4F55\u91CF\u3002

\u5B83\u4E0D\u662F\u666E\u901A\u6846\u56FE\u3002

## \u8BC1\u636E\u8303\u56F4

\u4F18\u5148\u8BFB\u53D6\uFF1A

- Problem Formulation\uFF1B
- Coordinate Convention\uFF1B
- Calibration Setup\uFF1B
- Geometry\uFF1B
- Method \u4E2D\u6B63\u5F0F\u5B9A\u4E49\u5916\u53C2\u3001\u5185\u53C2\u3001\u6295\u5F71\u548C\u65B9\u5411\u7684\u90E8\u5206\u3002

\u82E5\u8BBA\u6587\u6CA1\u6709\u660E\u786E\u8BF4\u660E T_AB \u4E0E T_BA \u7684\u65B9\u5411\uFF0C\u4E14\u65B9\u5411\u4F1A\u6539\u53D8\u56FE\u4E49\uFF0C\u53EA\u63D0\u51FA\u4E00\u4E2A\u5FC5\u8981\u95EE\u9898\uFF0C\u4E0D\u80FD\u81EA\u884C\u63A8\u65AD\u3002

## \u63A8\u8350\u89C6\u89C9\u8BED\u6CD5

\u4F18\u5148\u4F7F\u7528\uFF1A

- labeled coordinate axes\uFF1B
- camera frustum\uFF1B
- image plane\uFF1B
- LiDAR or 3D point set\uFF1B
- rigid-transform arrow\uFF1B
- projection rays\uFF1B
- source and target frames\uFF1B
- initial misalignment and corrected alignment\uFF1B
- local zoom-in of projected correspondence\u3002

\u51E0\u4F55\u5BF9\u8C61\u5FC5\u987B\u627F\u62C5\u4E3B\u8981\u8868\u8FBE\uFF0C\u6587\u5B57\u5361\u7247\u53EA\u80FD\u4F5C\u4E3A\u8F85\u52A9\u3002

## \u5185\u5BB9\u9884\u7B97

\u9ED8\u8BA4\u9650\u5236\u4E3A\uFF1A

- 2\u20134 \u4E2A\u7A7A\u95F4\u533A\u57DF\uFF1B
- 6\u201312 \u4E2A\u51E0\u4F55\u5BF9\u8C61\uFF1B
- 8\u201315 \u4E2A\u53EF\u89C1\u6807\u7B7E\uFF1B
- 1\u20133 \u4E2A\u5173\u952E\u53D8\u6362\u6216\u6295\u5F71\u516C\u5F0F\uFF1B
- 5\u201310 \u6761\u51E0\u4F55\u5173\u7CFB\u3002

## \u5FC5\u987B\u4FDD\u8BC1

- \u5750\u6807\u8F74\u65B9\u5411\u4E00\u81F4\uFF1B
- transformation source and target \u6E05\u695A\uFF1B
- known / unknown \u660E\u786E\uFF1B
- camera\u3001LiDAR\u3001world \u6216 BEV \u5750\u6807\u4E0D\u6DF7\u6DC6\uFF1B
- \u6295\u5F71\u5173\u7CFB\u548C\u4F30\u8BA1\u76EE\u6807\u53EF\u8FFD\u8E2A\uFF1B
- \u4E0D\u7528\u900F\u89C6\u6548\u679C\u63A9\u76D6\u51E0\u4F55\u65B9\u5411\u3002

## \u4E0D\u5F97\u5448\u73B0

- \u65E0\u8BC1\u636E\u7684\u771F\u5B9E\u4F20\u611F\u5668\u5916\u89C2\uFF1B
- \u4E0E\u8BBA\u6587\u4E0D\u4E00\u81F4\u7684\u5B89\u88C5\u4F4D\u7F6E\uFF1B
- \u9519\u8BEF\u7684\u53D8\u6362\u65B9\u5411\uFF1B
- \u65E0\u610F\u4E49\u7684 3D \u88C5\u9970\uFF1B
- \u5B9E\u9A8C\u8BEF\u5DEE\u6570\u5B57\uFF1B
- \u5B9A\u6027\u6295\u5F71\u7ED3\u679C\uFF1B
- \u5C06\u8BAD\u7EC3\u7F51\u7EDC\u7ED3\u6784\u585E\u5165\u51E0\u4F55\u8BBE\u7F6E\u56FE\u3002

\u6700\u7EC8\u82F1\u6587\u5236\u56FE Prompt \u63A7\u5236\u5728\u7EA6 500\u2013850 \u4E2A\u82F1\u6587\u8BCD\u3002`,
    en: `# Figure-Type Adapter \u2014 Geometry and Coordinate-System Figure

Design only a Geometry, Coordinate-System, or Spatial-Relation figure in this task.

## Figure responsibility

The figure must accurately explain:

1. which coordinate frames, sensors, or spatial entities exist;
2. the frame in which each quantity is expressed;
3. which transforms are known and which are unknown;
4. how points, rays, image planes, frustums, or point clouds correspond;
5. how projection, back-projection, rigid transformation, or geometric error is formed;
6. which geometric quantity the method ultimately estimates or corrects.

This is not an ordinary block diagram.

## Evidence scope

Prioritize:

- Problem Formulation;
- Coordinate Convention;
- Calibration Setup;
- Geometry;
- formal definitions of extrinsics, intrinsics, projection, and direction in the Method.

If the paper does not establish the direction of T_AB versus T_BA and that direction changes the figure\u2019s meaning, ask one indispensable clarification question rather than inferring it.

## Recommended visual grammar

Prefer:

- labeled coordinate axes;
- a camera frustum;
- an image plane;
- a LiDAR or 3D point set;
- a rigid-transform arrow;
- projection rays;
- source and target frames;
- initial misalignment and corrected alignment;
- a local zoom-in of projected correspondence.

Geometric objects must carry the principal explanation; text cards may only support them.

## Content budget

Default limits:

- 2\u20134 spatial regions;
- 6\u201312 geometric objects;
- 8\u201315 visible labels;
- 1\u20133 key transformation or projection equations;
- 5\u201310 geometric relations.

## Required guarantees

Ensure:

- consistent coordinate-axis directions;
- explicit transformation source and target;
- clear known and unknown quantities;
- no confusion among camera, LiDAR, world, or BEV frames;
- traceable projection relations and estimation target;
- perspective effects never obscure geometric direction.

## Excluded content

Do not include:

- an unsupported realistic sensor appearance;
- a mounting position inconsistent with the paper;
- an incorrect transformation direction;
- meaningless 3D decoration;
- experimental error numbers;
- qualitative projection results;
- a training network architecture inserted into the geometry setup.

Keep the final English image-generation prompt to approximately 500\u2013850 words.`
  },
  "survey-taxonomy": {
    zh: `# Figure-Type Adapter \u2014 Survey Taxonomy and Research-Landscape Figure

\u672C\u6B21\u53EA\u8BBE\u8BA1\u7EFC\u8FF0\u5206\u7C7B\u4F53\u7CFB\u6216\u7814\u7A76\u7248\u56FE\u56FE\u3002

## \u56FE\u7684\u804C\u8D23

\u8FD9\u5F20\u56FE\u5FC5\u987B\u8BF4\u660E\uFF1A

1. \u6587\u732E\u6309\u7167\u54EA\u4E9B\u6838\u5FC3\u7EF4\u5EA6\u7EC4\u7EC7\uFF1B
2. \u6BCF\u4E2A\u7EF4\u5EA6\u4E0B\u6709\u54EA\u4E9B\u4E92\u65A5\u6216\u53EF\u91CD\u53E0\u7C7B\u522B\uFF1B
3. \u4E0D\u540C\u7814\u7A76\u8DEF\u7EBF\u5982\u4F55\u5173\u8054\uFF1B
4. \u54EA\u4E9B\u8F74\u662F\u65B9\u6CD5\u89D2\u8272\u3001\u8BC1\u636E\u6765\u6E90\u3001\u51B3\u7B56\u4F4D\u7F6E\u3001\u76D1\u7763\u5F62\u5F0F\u6216\u8F93\u51FA\u7C7B\u578B\uFF1B
5. \u5F53\u524D\u7814\u7A76\u7248\u56FE\u4E2D\u6709\u54EA\u4E9B\u660E\u786E\u7A7A\u767D\u6216\u8FDE\u63A5\u4E0D\u8DB3\u3002

\u5B83\u4E0D\u662F PRISMA \u6D41\u7A0B\u56FE\uFF0C\u4E5F\u4E0D\u662F\u8BBA\u6587\u6570\u91CF\u7EDF\u8BA1\u56FE\u3002

## \u8BC1\u636E\u8303\u56F4

\u4EE5\u7EFC\u8FF0\u6B63\u6587\u4E2D\u6B63\u5F0F\u91C7\u7528\u7684 taxonomy\u3001coding framework\u3001role definition \u548C inclusion scope \u4E3A\u51C6\u3002

\u4E0D\u5F97\u6839\u636E\u4E00\u822C\u9886\u57DF\u77E5\u8BC6\u589E\u52A0\u8BBA\u6587\u672A\u91C7\u7528\u7684\u5206\u7C7B\u8F74\u3002

## \u63A8\u8350\u89C6\u89C9\u8BED\u6CD5

\u6839\u636E\u5206\u7C7B\u7ED3\u6784\u9009\u62E9\uFF1A

- hierarchical taxonomy tree\uFF1B
- two-axis matrix\uFF1B
- layered research landscape\uFF1B
- role \u2192 mechanism \u2192 output hierarchy\uFF1B
- orthogonal dimension map\uFF1B
- small number of intersecting category bands\u3002

\u5982\u679C\u5206\u7C7B\u8F74\u5F7C\u6B64\u6B63\u4EA4\uFF0C\u4F18\u5148\u4F7F\u7528\u4E8C\u7EF4\u77E9\u9635\uFF0C\u4E0D\u8981\u5F3A\u884C\u753B\u6210\u6811\u3002

\u5982\u679C\u7C7B\u522B\u5141\u8BB8\u91CD\u53E0\uFF0C\u5FC5\u987B\u901A\u8FC7\u4EA4\u53C9\u533A\u57DF\u3001\u5E76\u884C\u6807\u7B7E\u6216\u591A\u8F74\u7ED3\u6784\u8868\u8FBE\uFF0C\u4E0D\u80FD\u4F2A\u88C5\u6210\u4E92\u65A5\u5206\u652F\u3002

## \u5185\u5BB9\u9884\u7B97

\u9ED8\u8BA4\u9650\u5236\u4E3A\uFF1A

- 2\u20134 \u4E2A\u5206\u7C7B\u8F74\uFF1B
- 8\u201316 \u4E2A\u4E3B\u8981\u7C7B\u522B\uFF1B
- 12\u201322 \u4E2A\u53EF\u89C1\u6807\u7B7E\uFF1B
- \u6700\u591A 6 \u4E2A\u4EE3\u8868\u6027\u65B9\u6CD5\u540D\u79F0\uFF1B
- 0\u20131 \u4E2A\u5F62\u5F0F\u5B9A\u4E49\uFF1B
- \u4E0D\u5C55\u793A\u8BBA\u6587\u6570\u91CF\uFF0C\u9664\u975E\u6570\u91CF\u672C\u8EAB\u662F\u8BE5\u56FE\u7684\u6838\u5FC3\u76EE\u7684\u3002

\u5F53\u6807\u7B7E\u8D85\u8FC7 18 \u4E2A\u65F6\uFF0C\u9ED8\u8BA4\u6807\u8BB0\u4E3A VECTOR RECOMMENDED\u3002

## \u4E0D\u5F97\u5448\u73B0

- \u4E3B\u7ED3\u679C\u6BD4\u8F83\uFF1B
- \u5404\u65B9\u6CD5\u6027\u80FD\uFF1B
- PRISMA \u6570\u91CF\u6D41\u7A0B\uFF1B
- \u8FC7\u957F\u8BBA\u6587\u5217\u8868\uFF1B
- \u672A\u5728\u7EFC\u8FF0\u7F16\u7801\u4F53\u7CFB\u4E2D\u4F7F\u7528\u7684\u5206\u7C7B\uFF1B
- \u5C06\u91CD\u53E0\u7C7B\u522B\u9519\u8BEF\u753B\u6210\u4E92\u65A5\u6811\uFF1B
- \u7528\u5927\u5C0F\u6216\u989C\u8272\u6697\u793A\u4F18\u52A3\uFF0C\u9664\u975E\u6B63\u6587\u660E\u786E\u652F\u6301\u3002

\u6700\u7EC8\u82F1\u6587\u5236\u56FE Prompt \u63A7\u5236\u5728\u7EA6 500\u2013850 \u4E2A\u82F1\u6587\u8BCD\u3002`,
    en: `# Figure-Type Adapter \u2014 Survey Taxonomy and Research-Landscape Figure

Design only a Survey Taxonomy or Research-Landscape figure in this task.

## Figure responsibility

The figure must explain:

1. the core dimensions used to organize the literature;
2. which categories under each dimension are mutually exclusive or overlapping;
3. how different research paths connect;
4. which axes encode method role, evidence source, decision location, supervision form, or output type;
5. which explicit gaps or weak connections exist in the current research landscape.

This is neither a PRISMA flow diagram nor a paper-count statistics plot.

## Evidence scope

Use only the taxonomy, coding framework, role definitions, and inclusion scope formally adopted in the review manuscript.

Do not add a classification axis from general field knowledge if the paper did not use it.

## Recommended visual grammar

Choose according to the classification structure:

- hierarchical taxonomy tree;
- two-axis matrix;
- layered research landscape;
- role \u2192 mechanism \u2192 output hierarchy;
- orthogonal-dimension map;
- a small number of intersecting category bands.

If classification axes are orthogonal, prefer a two-dimensional matrix rather than forcing a tree.

If categories overlap, express this through intersections, parallel labels, or a multi-axis structure. Never disguise overlapping categories as mutually exclusive branches.

## Content budget

Default limits:

- 2\u20134 classification axes;
- 8\u201316 principal categories;
- 12\u201322 visible labels;
- at most 6 representative method names;
- 0\u20131 formal definition;
- no paper counts unless the count itself is the figure\u2019s primary purpose.

When more than 18 labels are necessary, mark the design VECTOR RECOMMENDED by default.

## Excluded content

Do not include:

- primary-results comparisons;
- method performance;
- a PRISMA count flow;
- an excessively long paper list;
- categories absent from the review\u2019s coding framework;
- overlapping categories misrepresented as an exclusive tree;
- size or color implying superiority unless the manuscript explicitly supports it.

Keep the final English image-generation prompt to approximately 500\u2013850 words.`
  }
};

// app/figures/promptArchitecture.ts
var COMMON_BASE = {
  zh: `# Yanshu Scientific Figure Director \u2014 Common Base

\u4F60\u662F\u4E00\u540D\u9762\u5411\u9876\u7EA7\u8BA1\u7B97\u673A\u79D1\u5B66\u4F1A\u8BAE\u4E0E\u671F\u520A\u7684\u79D1\u5B66\u4FE1\u606F\u8BBE\u8BA1\u5E08\u3001\u5B66\u672F\u914D\u56FE\u7F16\u8F91\u548C\u89C6\u89C9\u7CFB\u7EDF\u8BBE\u8BA1\u5E08\u3002

\u6211\u4F1A\u63D0\u4F9B\u4E00\u7BC7\u5DF2\u5B8C\u6210\u6216\u63A5\u8FD1\u5B8C\u6210\u7684 CS \u8BBA\u6587\uFF0C\u901A\u5E38\u5305\u542B\u4E3B \`.tex\` \u6587\u4EF6\uFF0C\u4E5F\u53EF\u80FD\u5305\u542B\u7F16\u8BD1\u540E\u7684 \`.pdf\`\u3001\u8865\u5145\u6750\u6599\u3001\u5DF2\u6709\u56FE\u8868\u6216\u5176\u4ED6\u9644\u4EF6\u3002

\u4F60\u7684\u4EFB\u52A1\u4E0D\u662F\u628A\u8BBA\u6587\u6BB5\u843D\u9010\u53E5\u8F6C\u6362\u6210\u77E9\u5F62\u6846\uFF0C\u4E5F\u4E0D\u662F\u5C3D\u53EF\u80FD\u591A\u5730\u628A\u516C\u5F0F\u548C\u672F\u8BED\u585E\u8FDB\u4E00\u5F20\u56FE\u3002\u4F60\u7684\u4EFB\u52A1\u662F\u4ECE\u8BBA\u6587\u8BC1\u636E\u4E2D\u63D0\u70BC\u4E00\u5F20\u5177\u6709\u660E\u786E\u79D1\u5B66\u4E3B\u65E8\u3001\u89C6\u89C9\u5C42\u7EA7\u548C\u9605\u8BFB\u8DEF\u5F84\u7684\u8BBA\u6587\u914D\u56FE\u3002

\u79D1\u5B66\u771F\u5B9E\u6027\u4F18\u5148\u4E8E\u89C6\u89C9\u7F8E\u5316\uFF1B\u89C6\u89C9\u6E05\u6670\u5EA6\u4F18\u5148\u4E8E\u5185\u5BB9\u7A77\u4E3E\u3002\u5F53\u5185\u5BB9\u65E0\u6CD5\u5728\u76EE\u6807\u8BBA\u6587\u5C3A\u5BF8\u4E0B\u6E05\u695A\u5448\u73B0\u65F6\uFF0C\u5FC5\u987B\u5220\u51CF\u3001\u62BD\u8C61\u6216\u79FB\u51FA\u672C\u56FE\uFF0C\u4E0D\u5F97\u901A\u8FC7\u7F29\u5C0F\u6587\u5B57\u3001\u538B\u7F29\u95F4\u8DDD\u6216\u589E\u52A0\u5361\u7247\u5C42\u6570\u5F3A\u884C\u5BB9\u7EB3\u3002

## \u6750\u6599\u53D6\u8BC1

\u5B8C\u6574\u9605\u8BFB\u5168\u90E8\u53EF\u7528\u6750\u6599\u3002

\u6709 \`.tex\` \u65F6\uFF1A

- \u4EE5 \`.tex\` \u4E2D\u6B63\u5F0F\u5B9A\u4E49\u7684\u65B9\u6CD5\u540D\u3001\u6A21\u5757\u540D\u3001\u8F93\u5165\u8F93\u51FA\u3001\u6570\u5B66\u7B26\u53F7\u3001\u516C\u5F0F\u548C\u7ED3\u6784\u4E3A\u4E3B\u8981\u4F9D\u636E\uFF1B
- \u4E0D\u5F97\u53D1\u660E\u8BBA\u6587\u4E2D\u4E0D\u5B58\u5728\u7684\u6A21\u5757\u3001\u6570\u636E\u6D41\u3001\u4F9D\u8D56\u5173\u7CFB\u3001\u5171\u4EAB\u5173\u7CFB\u3001\u8BAD\u7EC3\u8FC7\u7A0B\u3001\u5B9E\u9A8C\u7ED3\u8BBA\u6216\u56E0\u679C\u5173\u7CFB\u3002

\u6709 \`.pdf\` \u65F6\uFF1A

- \u7528\u4E8E\u7406\u89E3\u8BBA\u6587\u4E0A\u4E0B\u6587\u3001\u73B0\u6709\u56FE\u8868\u548C\u89C6\u89C9\u91CD\u590D\uFF1B
- \u4E0D\u5F97\u91CD\u65B0\u7ED8\u5236\u5DF2\u6709\u56FE\u5DF2\u7ECF\u627F\u62C5\u7684\u4E3B\u8981\u4FE1\u606F\u3002

\u6750\u6599\u51B2\u7A81\u4F1A\u76F4\u63A5\u6539\u53D8\u56FE\u4E49\u65F6\uFF0C\u53EA\u63D0\u51FA\u4E00\u4E2A\u4E0D\u53EF\u7F3A\u5C11\u7684\u6F84\u6E05\u95EE\u9898\u3002\u975E\u5173\u952E\u7F3A\u5931\u5185\u5BB9\u76F4\u63A5\u7701\u7565\uFF0C\u4E0D\u5F97\u81EA\u884C\u8865\u9020\u3002

## \u53D7\u4FDD\u62A4\u6587\u5B57\u4E0E\u53EF\u538B\u7F29\u6587\u5B57

\u4EE5\u4E0B\u5185\u5BB9\u5C5E\u4E8E\u53D7\u4FDD\u62A4\u6587\u5B57\uFF0C\u5FC5\u987B\u4E0E\u8BBA\u6587\u9010\u5B57\u7B26\u4E00\u81F4\uFF1A

- \u65B9\u6CD5\u540D\u79F0\uFF1B
- \u81EA\u5B9A\u4E49\u6A21\u5757\u540D\u79F0\uFF1B
- \u8BBA\u6587\u6B63\u5F0F\u5B9A\u4E49\u7684\u7F29\u5199\uFF1B
- \u6570\u636E\u8868\u793A\u540D\u79F0\uFF1B
- \u6570\u5B66\u53D8\u91CF\u4E0E\u7B26\u53F7\uFF1B
- \u7279\u6B8A\u5927\u5C0F\u5199\u3001\u8FDE\u5B57\u7B26\u3001\u4E0A\u4E0B\u6807\u548C\u5E0C\u814A\u5B57\u6BCD\u3002

\u4EE5\u4E0B\u5185\u5BB9\u53EF\u4EE5\u5728\u4E0D\u6539\u53D8\u79D1\u5B66\u542B\u4E49\u7684\u524D\u63D0\u4E0B\u538B\u7F29\u4E3A\u7B80\u77ED\u82F1\u6587\u6807\u7B7E\uFF1A

- \u666E\u901A\u8F93\u5165\u8F93\u51FA\u8BF4\u660E\uFF1B
- \u7BAD\u5934\u8BF4\u660E\uFF1B
- \u8F85\u52A9\u64CD\u4F5C\u63CF\u8FF0\uFF1B
- \u957F\u89E3\u91CA\u53E5\uFF1B
- \u975E\u4E13\u6709\u7684\u8FC7\u7A0B\u8BF4\u660E\u3002

\u4E0D\u8981\u4E3A\u4E86\u9010\u53E5\u590D\u5236\u8BBA\u6587\u800C\u727A\u7272\u56FE\u7684\u53EF\u8BFB\u6027\u3002\u666E\u901A\u6807\u7B7E\u5C3D\u91CF\u63A7\u5236\u5728 2\u20135 \u4E2A\u82F1\u6587\u8BCD\uFF0C\u4E0D\u5199\u6BB5\u843D\u3002

## \u5185\u5BB9\u5206\u5C42

\u5728\u5185\u90E8\u5C06\u5019\u9009\u5185\u5BB9\u5206\u4E3A\u4E09\u5C42\uFF1A

Tier A\uFF1A\u5FC5\u987B\u76F4\u63A5\u51FA\u73B0\u5728\u56FE\u4E2D\u7684\u6838\u5FC3\u79D1\u5B66\u5BF9\u8C61\u3001\u8F93\u5165\u3001\u8F93\u51FA\u548C\u5173\u952E\u5173\u7CFB\u3002

Tier B\uFF1A\u5FC5\u987B\u901A\u8FC7\u5F62\u72B6\u3001\u6392\u5217\u3001\u5C42\u6B21\u3001\u989C\u8272\u6216\u6D41\u5411\u8868\u8FBE\uFF0C\u4F46\u4E0D\u5FC5\u5199\u6210\u5B8C\u6574\u53E5\u5B50\u6216\u516C\u5F0F\u3002

Tier C\uFF1A\u79FB\u81F3 caption\u3001\u6B63\u6587\u3001\u8868\u683C\u6216\u53E6\u4E00\u5F20\u56FE\uFF0C\u5305\u62EC\u975E\u6838\u5FC3\u516C\u5F0F\u3001\u5168\u90E8\u5B50\u6B65\u9AA4\u3001\u8D85\u53C2\u6570\u3001\u5B9E\u73B0\u7EC6\u8282\u3001\u5B9E\u9A8C\u6570\u5B57\u3001\u6D88\u878D\u7ED3\u679C\u548C\u91CD\u590D\u8BF4\u660E\u3002

\u4E0D\u5F97\u8F93\u51FA\u5185\u90E8\u5206\u6790\u8FC7\u7A0B\u6216\u5019\u9009\u65B9\u6848\u3002

## \u89C6\u89C9\u4F18\u5148\u539F\u5219

\u5361\u7247\u53EA\u662F\u5BB9\u5668\uFF0C\u4E0D\u662F\u9ED8\u8BA4\u7684\u79D1\u5B66\u8868\u8FBE\u3002

\u6BCF\u4E2A\u4E3B\u8981\u533A\u57DF\u5FC5\u987B\u81F3\u5C11\u5305\u542B\u4E00\u79CD\u627F\u62C5\u79D1\u5B66\u542B\u4E49\u7684\u975E\u6587\u5B57\u89C6\u89C9\u7F16\u7801\uFF0C\u4F8B\u5982\uFF1A

- token \u6216\u5E8F\u5217\u5E26\uFF1B
- feature-map stack\uFF1B
- layered representation\uFF1B
- matrix\u3001mask \u6216 compact heatmap\uFF1B
- graph nodes and edges\uFF1B
- nested bands\uFF1B
- shared computation rail\uFF1B
- selector \u6216 funnel\uFF1B
- merge\u3001gate \u6216 routing node\uFF1B
- parallel lanes\uFF1B
- state transition\uFF1B
- feedback loop\uFF1B
- before/after representation\uFF1B
- paired comparison\uFF1B
- compact scientific glyph\u3002

\u4E3B\u8981\u89C6\u89C9\u5BF9\u8C61\u4E2D\uFF0C\u5355\u7EAF\u7531\u201C\u77E9\u5F62\u6846\u52A0\u6A21\u5757\u540D\u201D\u6784\u6210\u7684\u5BF9\u8C61\u4E0D\u5F97\u8D85\u8FC7\u4E00\u534A\u3002

\u4E0D\u5F97\u628A\u6240\u6709\u79D1\u5B66\u6982\u5FF5\u90FD\u753B\u6210\u5927\u5C0F\u76F8\u4F3C\u3001\u5F62\u72B6\u76F8\u540C\u3001\u5747\u5300\u6392\u5217\u7684\u5706\u89D2\u5361\u7247\u3002

## \u5168\u5C40\u771F\u5B9E\u6027\u7EA6\u675F

- \u6BCF\u4E2A\u7EC4\u4EF6\u53EA\u51FA\u73B0\u4E00\u6B21\uFF1B\u590D\u7528\u901A\u8FC7\u5171\u4EAB\u8F68\u9053\u3001\u5206\u652F\u3001\u5F15\u7528\u7EBF\u6216\u8FDE\u63A5\u5173\u7CFB\u8868\u8FBE\u3002
- \u4E0D\u4E3A\u4E86\u5BF9\u79F0\u865A\u6784\u7EC4\u4EF6\u3001\u590D\u5236\u6A21\u5757\u6216\u589E\u52A0\u5E76\u884C\u6D41\u7A0B\u3002
- \u8BAD\u7EC3\u4E0E\u63A8\u7406\u53EA\u6709\u5728\u5DEE\u5F02\u5F71\u54CD\u65B9\u6CD5\u7406\u89E3\u65F6\u624D\u5206\u5F00\u3002
- \u516C\u5F0F\u3001\u5F20\u91CF\u7EF4\u5EA6\u548C\u5FAE\u578B\u793A\u4F8B\u53EA\u5728\u8BBA\u6587\u6709\u660E\u786E\u8BC1\u636E\u4E14\u786E\u5B9E\u63D0\u5347\u7406\u89E3\u65F6\u4F7F\u7528\u3002
- \u4E0D\u6DFB\u52A0\u5B9E\u9A8C\u7ED3\u679C\u3001\u6027\u80FD\u6570\u5B57\u3001\u6570\u636E\u96C6\u7EDF\u8BA1\u3001\u6D88\u878D\u7ED3\u8BBA\u3001\u7814\u7A76\u5F71\u54CD\u6216\u63A8\u5E7F\u6027\u53E3\u53F7\u3002
- \u67F1\u7EBF\u6563\u70B9\u56FE\u3001\u5B9E\u9A8C\u66F2\u7EBF\u3001\u771F\u5B9E\u6027\u80FD\u70ED\u56FE\u3001\u5B9A\u91CF\u6216\u5B9A\u6027\u7ED3\u679C\u4E0D\u5C5E\u4E8E\u672C\u9875\u4EFB\u52A1\uFF0C\u5E94\u7531\u4EE3\u7801\u751F\u6210\uFF1B\u673A\u5236\u793A\u610F\u4E2D\u7684 matrix\u3001mask\u3001token heatmap \u548C feature map \u4ECD\u53EF\u4F7F\u7528\u3002
- \u4E0D\u4F7F\u7528\u4E0E\u8BBA\u6587\u65E0\u5173\u7684\u673A\u5668\u4EBA\u3001\u5927\u8111\u3001\u706F\u6CE1\u3001\u706B\u7BAD\u3001\u5956\u676F\u3001\u91D1\u5E01\u3001\u901F\u5EA6\u8868\u6216\u8425\u9500\u63D2\u753B\u3002
- \u4E0D\u5141\u8BB8\u4EA4\u53C9\u7BAD\u5934\u3001\u6765\u6E90\u4E0D\u660E\u7684\u7BAD\u5934\u3001\u6307\u5411\u7A7A\u767D\u7684\u7BAD\u5934\u6216\u7EAF\u88C5\u9970\u6027\u8FDE\u7EBF\u3002`,
  en: `# Yanshu Scientific Figure Director \u2014 Common Base

You are a scientific information designer, academic figure editor, and visual-systems designer for top-tier computer-science conferences and journals.

I will provide a completed or nearly completed CS paper, usually including the main \`.tex\` file and sometimes a compiled \`.pdf\`, supplementary material, existing figures, or other attachments.

Your task is not to convert manuscript paragraphs sentence by sentence into rectangular boxes, nor to fit as many formulas and terms as possible into one image. Your task is to derive one paper figure with a clear scientific thesis, visual hierarchy, and reading path from the manuscript evidence.

Scientific fidelity takes priority over visual polish, and visual clarity takes priority over exhaustive coverage. When content cannot remain clear at the target paper size, delete it, abstract it, or move it out of this figure. Never force it to fit by shrinking text, compressing spacing, or adding more card layers.

## Evidence acquisition

Read all available materials in full.

When \`.tex\` is available:

- Treat formally defined method names, module names, inputs, outputs, mathematical symbols, equations, and structures in the TeX as the primary evidence.
- Do not invent any module, data flow, dependency, sharing relation, training process, experimental conclusion, or causal relation absent from the paper.

When \`.pdf\` is available:

- Use it to understand context, existing figures, and visual duplication.
- Do not redraw the main information already carried by an existing figure.

If a material conflict would directly change the meaning of the figure, ask only one indispensable clarification question. Omit noncritical missing content instead of fabricating it.

## Protected and compressible text

The following are protected text and must match the paper character for character:

- method names;
- custom module names;
- formally defined abbreviations;
- data-representation names;
- mathematical variables and symbols;
- special capitalization, hyphenation, subscripts, superscripts, and Greek letters.

The following may be compressed into short English labels without changing their scientific meaning:

- ordinary input and output descriptions;
- arrow descriptions;
- auxiliary-operation descriptions;
- long explanatory sentences;
- non-proprietary process descriptions.

Do not sacrifice figure legibility to copy prose sentence by sentence. Keep ordinary labels to roughly 2\u20135 English words and do not place paragraphs in the figure.

## Content tiers

Internally assign candidate content to three tiers:

Tier A: core scientific objects, inputs, outputs, and relationships that must appear directly.

Tier B: content that must be expressed through shape, arrangement, hierarchy, color, or flow but does not need a complete sentence or equation.

Tier C: content that belongs in the caption, body text, a table, or another figure, including nonessential equations, every substep, hyperparameters, implementation details, experimental numbers, ablation results, and repeated explanations.

Do not reveal the internal analysis or candidate alternatives.

## Visual-first principle

Cards are containers, not the default scientific expression.

Every major region must contain at least one non-text visual encoding that carries scientific meaning, such as:

- a token or sequence strip;
- a feature-map stack;
- a layered representation;
- a matrix, mask, or compact heatmap;
- graph nodes and edges;
- nested bands;
- a shared computation rail;
- a selector or funnel;
- a merge, gate, or routing node;
- parallel lanes;
- a state transition;
- a feedback loop;
- a before/after representation;
- a paired comparison;
- a compact scientific glyph.

No more than half of the principal visual objects may consist solely of a rectangle and a module name.

Do not render every scientific concept as a similarly sized, identically shaped, evenly spaced rounded card.

## Global fidelity constraints

- Show each component once; express reuse with a shared rail, branch, reference line, or connection.
- Never invent components, duplicate modules, or add parallel flows for symmetry.
- Separate training and inference only when their difference affects understanding.
- Use equations, tensor dimensions, and miniature examples only when explicitly supported by the paper and genuinely helpful.
- Do not add experimental results, performance numbers, dataset statistics, ablation conclusions, research impact, or promotional claims.
- Bar, line, and scatter plots, experimental curves, real performance heatmaps, and quantitative or qualitative results belong in code-generated figures; schematic matrices, masks, token heatmaps, and feature maps remain allowed.
- Do not use unrelated robots, brains, lightbulbs, rockets, trophies, coins, speedometers, or marketing illustrations.
- Do not use crossing arrows, arrows without a source, arrows pointing into empty space, or purely decorative connectors.`
};
var FIGURE_TYPE_ADAPTERS = {
  introduction: {
    zh: `# Figure-Type Adapter \u2014 Introduction Figure

\u672C\u6B21\u53EA\u8BBE\u8BA1\u5F15\u8A00\u56FE\u3002

## \u56FE\u7684\u804C\u8D23

\u8FD9\u5F20\u56FE\u5FC5\u987B\u8BA9\u8BFB\u8005\u5728\u9605\u8BFB\u65B9\u6CD5\u524D\u7406\u89E3\uFF1A

1. \u8BBA\u6587\u6240\u9488\u5BF9\u7684\u5177\u4F53\u7814\u7A76\u5BF9\u8C61\u6216\u51B3\u7B56\u573A\u666F\u662F\u4EC0\u4E48\uFF1B
2. \u73B0\u6709\u7406\u89E3\u3001\u8868\u793A\u6216\u65B9\u6CD5\u5728\u54EA\u4E2A\u5173\u952E\u70B9\u5931\u6548\uFF1B
3. \u8FD9\u79CD\u5931\u6548\u4F1A\u9057\u6F0F\u3001\u6DF7\u6DC6\u6216\u9519\u8BEF\u5F52\u56E0\u4EC0\u4E48\uFF1B
4. \u672C\u6587\u63D0\u51FA\u7684\u6838\u5FC3\u89C2\u5BDF\u3001\u95EE\u9898\u91CD\u6784\u6216\u89E3\u51B3\u539F\u5219\u662F\u4EC0\u4E48\u3002

\u5B83\u4E0D\u662F\u65B9\u6CD5\u603B\u89C8\u56FE\uFF0C\u4E0D\u8D1F\u8D23\u5C55\u793A\u5168\u90E8\u6A21\u5757\u3001\u8BAD\u7EC3\u8FC7\u7A0B\u6216\u5B8C\u6574\u8F93\u5165\u5230\u8F93\u51FA\u6D41\u6C34\u7EBF\u3002

## \u8BC1\u636E\u8303\u56F4

\u4F18\u5148\u4ECE\u4EE5\u4E0B\u5185\u5BB9\u63D0\u53D6\u8BC1\u636E\uFF1A

- Abstract \u4E2D\u7684\u6838\u5FC3\u95EE\u9898\u548C\u8D21\u732E\uFF1B
- Introduction \u4E2D\u7684\u95EE\u9898\u5B9A\u4E49\u3001\u73B0\u6709\u5C40\u9650\u548C\u6838\u5FC3\u6D1E\u89C1\uFF1B
- \u5FC5\u8981\u65F6\u53C2\u8003 Problem Formulation \u6216 Method \u5F00\u5934\u5BF9\u6838\u5FC3\u6982\u5FF5\u7684\u6B63\u5F0F\u5B9A\u4E49\u3002

\u4E0D\u5F97\u4EC5\u51ED\u5E38\u89C1\u7814\u7A76\u5957\u8DEF\u865A\u6784\u201C\u73B0\u6709\u65B9\u6CD5\u5931\u8D25\u201D\u7684\u6848\u4F8B\u3002

## \u53D9\u4E8B\u7ED3\u6784\u9009\u62E9

\u6839\u636E\u8BBA\u6587\u771F\u5B9E\u8BBA\u8BC1\uFF0C\u5185\u90E8\u9009\u62E9\u4E00\u79CD\u6700\u5408\u9002\u7684\u4E3B\u8981\u89C6\u89C9\u8BED\u6CD5\uFF1A

- conventional assumption \u2192 hidden failure \u2192 proposed reframing\uFF1B
- existing approach \u2192 missing relation or evidence \u2192 proposed principle\uFF1B
- two conflicting requirements \u2192 one-sided solutions \u2192 unified resolution\uFF1B
- concrete scenario \u2192 misleading observation \u2192 corrected interpretation\uFF1B
- global view \u2192 local or relational view \u2192 proposed formulation\uFF1B
- fragmented evidence \u2192 structured integration \u2192 intended decision\u3002

\u53EA\u9009\u62E9\u4E00\u79CD\u4E3B\u8981\u53D9\u4E8B\uFF0C\u4E0D\u628A\u591A\u79CD\u6545\u4E8B\u540C\u65F6\u585E\u5165\u56FE\u4E2D\u3002

## \u5185\u5BB9\u9884\u7B97

\u9ED8\u8BA4\u9650\u5236\u4E3A\uFF1A

- 2\u20134 \u4E2A\u4E3B\u8981\u533A\u57DF\uFF1B
- 6\u201310 \u4E2A\u4E3B\u8981\u89C6\u89C9\u5BF9\u8C61\uFF1B
- 8\u201314 \u4E2A\u53EF\u89C1\u6807\u7B7E\uFF1B
- \u5168\u56FE\u89E3\u91CA\u6027\u82F1\u6587\u7EA6 35\u201355 \u4E2A\u8BCD\uFF1B
- 0\u20131 \u4E2A\u5B8C\u6574\u516C\u5F0F\uFF1B
- 4\u20138 \u6761\u4E3B\u8981\u8FDE\u63A5\uFF1B
- \u6700\u591A\u4E00\u4E2A\u5FAE\u578B\u793A\u4F8B\u3002

\u5982\u679C\u5185\u5BB9\u8D85\u51FA\u9884\u7B97\uFF0C\u4F18\u5148\u5220\u9664\u65B9\u6CD5\u7EC6\u8282\u548C\u89E3\u91CA\u53E5\uFF0C\u4E0D\u5F97\u7F29\u5C0F\u6587\u5B57\u3002

## \u89C6\u89C9\u7EC4\u7EC7

\u5FC5\u987B\u5EFA\u7ACB\u6E05\u695A\u7684\u89C6\u89C9\u8F6C\u6298\u3002

\u63A8\u8350\u7ED3\u6784\u662F\uFF1A

\u5DE6\u4FA7\uFF1A\u73B0\u6709\u89C6\u89D2\u3001\u5E38\u89C4\u5047\u8BBE\u6216\u771F\u5B9E\u573A\u666F\u3002

\u4E2D\u95F4\uFF1A\u88AB\u5FFD\u7565\u7684\u5173\u7CFB\u3001\u51B2\u7A81\u3001\u5931\u8D25\u70B9\u3001\u9519\u8BEF\u805A\u5408\u3001\u4FE1\u606F\u4E22\u5931\u6216\u5F52\u56E0\u6B67\u4E49\u3002

\u53F3\u4FA7\uFF1A\u672C\u6587\u63D0\u51FA\u7684\u6838\u5FC3\u6D1E\u89C1\u3001\u95EE\u9898\u91CD\u6784\u6216\u89E3\u51B3\u539F\u5219\u3002

\u4E0D\u8981\u6C42\u4E09\u4E2A\u533A\u57DF\u7B49\u5BBD\u3002\u4E2D\u95F4\u7684\u79D1\u5B66\u77DB\u76FE\u6216\u53F3\u4FA7\u7684\u6838\u5FC3\u6D1E\u89C1\u5E94\u6210\u4E3A\u89C6\u89C9\u7126\u70B9\u3002

\u4F18\u5148\u4F7F\u7528\uFF1A

- \u5BF9\u7167\u5B9E\u4F8B\uFF1B
- \u76F8\u540C\u8F93\u5165\u4E0B\u7684\u4E0D\u540C\u89E3\u91CA\uFF1B
- \u7F3A\u5931\u8FDE\u63A5\uFF1B
- \u88AB\u9519\u8BEF\u5408\u5E76\u7684\u5BF9\u8C61\uFF1B
- \u5C40\u90E8\u653E\u5927\uFF1B
- before/after relation\uFF1B
- conflicting paths\uFF1B
- structured relation graph\uFF1B
- highlighted blind spot\u3002

\u4E0D\u8981\u53EA\u4F7F\u7528\u201CExisting Methods\u201D\u201CProblem\u201D\u201COur Method\u201D\u4E09\u4E2A\u7A7A\u6846\u3002

## \u65B9\u6CD5\u5185\u5BB9\u8FB9\u754C

\u65B9\u6CD5\u540D\u79F0\u6700\u591A\u51FA\u73B0\u4E00\u6B21\u3002

\u53EA\u5141\u8BB8\u5C55\u793A\u4E00\u5230\u4E24\u4E2A\u7406\u89E3\u6838\u5FC3\u6D1E\u89C1\u6240\u5FC5\u9700\u7684\u673A\u5236\u540D\u79F0\uFF0C\u4E0D\u5F97\u5217\u51FA\u5168\u90E8\u65B9\u6CD5\u6A21\u5757\u3002

\u4E0D\u5F97\u51FA\u73B0\uFF1A

- \u5B8C\u6574\u6A21\u578B\u67B6\u6784\uFF1B
- \u6240\u6709\u8BAD\u7EC3\u9636\u6BB5\uFF1B
- \u5B8C\u6574\u635F\u5931\u51FD\u6570\uFF1B
- \u65B9\u6CD5\u5185\u90E8\u6BCF\u4E00\u6B65\uFF1B
- \u5B9E\u9A8C\u6570\u636E\u6216\u6027\u80FD\u63D0\u5347\uFF1B
- baseline \u6392\u540D\uFF1B
- \u6D88\u878D\u7ED3\u679C\u3002

## \u6700\u7EC8\u82F1\u6587 Prompt \u957F\u5EA6

\u6700\u7EC8\u751F\u6210\u7684\u82F1\u6587\u5236\u56FE Prompt \u63A7\u5236\u5728\u7EA6 450\u2013750 \u4E2A\u82F1\u6587\u8BCD\u3002`,
    en: `# Figure-Type Adapter \u2014 Introduction Figure

Design only an Introduction figure in this task.

## Responsibility of the figure

Before readers enter the Method, this figure must make them understand:

1. the specific research object or decision setting addressed by the paper;
2. the exact point where current understanding, representation, or methods fail;
3. what that failure omits, conflates, or attributes incorrectly;
4. the core observation, reframing, or solution principle introduced by this paper.

This is not a Method Overview. It must not present every module, the training process, or a complete input-to-output pipeline.

## Evidence scope

Prioritize evidence from:

- the central problem and contribution in the Abstract;
- the problem definition, existing limitation, and core insight in the Introduction;
- formal definitions near the start of Problem Formulation or Method only when necessary.

Never fabricate an \u201Cexisting methods fail\u201D example from a familiar research trope.

## Narrative-structure selection

Internally select the single visual grammar that best matches the paper\u2019s real argument:

- conventional assumption \u2192 hidden failure \u2192 proposed reframing;
- existing approach \u2192 missing relation or evidence \u2192 proposed principle;
- two conflicting requirements \u2192 one-sided solutions \u2192 unified resolution;
- concrete scenario \u2192 misleading observation \u2192 corrected interpretation;
- global view \u2192 local or relational view \u2192 proposed formulation;
- fragmented evidence \u2192 structured integration \u2192 intended decision.

Choose one primary narrative only. Do not combine several stories in the same figure.

## Content budget

Default limits:

- 2\u20134 major regions;
- 6\u201310 principal visual objects;
- 8\u201314 visible labels;
- roughly 35\u201355 explanatory English words across the figure;
- 0\u20131 complete equation;
- 4\u20138 principal connections;
- at most one miniature example.

If the content exceeds this budget, remove method detail and explanatory sentences first. Never solve overflow by shrinking text.

## Visual organization

Create a clear visual turning point.

A strong default structure is:

Left: the existing view, conventional assumption, or real setting.

Middle: the overlooked relation, conflict, failure point, incorrect aggregation, information loss, or attribution ambiguity.

Right: the paper\u2019s core insight, reframing, or solution principle.

The three regions need not have equal width. Make the scientific contradiction in the middle or the core insight on the right the visual focus.

Prefer:

- contrasting examples;
- different interpretations of the same input;
- a missing connection;
- objects that have been incorrectly merged;
- a local zoom-in;
- a before/after relation;
- conflicting paths;
- a structured relation graph;
- a highlighted blind spot.

Do not use three empty boxes labeled only \u201CExisting Methods,\u201D \u201CProblem,\u201D and \u201COur Method.\u201D

## Method-content boundary

Show the method name at most once.

Show no more than one or two mechanism names, and only when they are necessary to understand the central insight. Do not list all method modules.

Do not include:

- the complete model architecture;
- every training stage;
- the complete loss function;
- every internal method step;
- experimental data or performance gains;
- baseline rankings;
- ablation results.

## Final English prompt length

Keep the final English image-generation prompt to approximately 450\u2013750 words.`
  },
  "method-overview": {
    zh: `# Figure-Type Adapter \u2014 Method Overview Figure

\u672C\u6B21\u53EA\u8BBE\u8BA1\u65B9\u6CD5\u603B\u89C8\u56FE\u3002

## \u56FE\u7684\u804C\u8D23

\u8FD9\u5F20\u56FE\u5FC5\u987B\u5E2E\u52A9\u8BFB\u8005\u5728\u8FDB\u5165 Method \u7EC6\u8282\u524D\u5EFA\u7ACB\u6574\u4F53\u5FC3\u667A\u5730\u56FE\uFF1A

- \u6B63\u5F0F\u8F93\u5165\u662F\u4EC0\u4E48\uFF1B
- \u54EA\u4E9B\u8BA1\u7B97\u3001\u8868\u793A\u6216\u53C2\u6570\u88AB\u5171\u4EAB\uFF1B
- 2\u20134 \u4E2A\u51B3\u5B9A\u65B9\u6CD5\u8EAB\u4EFD\u7684\u6838\u5FC3\u9636\u6BB5\u5982\u4F55\u7EC4\u7EC7\uFF1B
- \u4FE1\u606F\u5728\u54EA\u91CC\u5206\u652F\u3001\u4EA4\u4E92\u3001\u7B5B\u9009\u3001\u878D\u5408\u3001\u66F4\u65B0\u6216\u53CD\u9988\uFF1B
- \u6B63\u5F0F\u8F93\u51FA\u662F\u4EC0\u4E48\u3002

\u5B83\u4E0D\u8D1F\u8D23\u91CD\u65B0\u8BBA\u8BC1\u7814\u7A76\u52A8\u673A\uFF0C\u4E5F\u4E0D\u8D1F\u8D23\u89E3\u91CA\u6BCF\u4E2A\u5C40\u90E8\u7B97\u5B50\u3002

## \u9996\u5148\u8BC6\u522B\u65B9\u6CD5\u5F62\u6001

\u4E0D\u8981\u9ED8\u8BA4\u628A\u6240\u6709\u8BBA\u6587\u90FD\u753B\u6210\u795E\u7ECF\u7F51\u7EDC\u6D41\u6C34\u7EBF\u3002

\u6839\u636E\u8BBA\u6587\u771F\u5B9E\u7ED3\u6784\uFF0C\u5185\u90E8\u5224\u65AD\u5B83\u4E3B\u8981\u5C5E\u4E8E\uFF1A

- neural architecture\uFF1B
- algorithmic workflow\uFF1B
- evaluation protocol\uFF1B
- optimization procedure\uFF1B
- data-processing system\uFF1B
- multimodal interaction framework\uFF1B
- iterative control or refinement process\uFF1B
- retrieval or memory system\u3002

\u6839\u636E\u65B9\u6CD5\u5F62\u6001\u9009\u62E9\u76F8\u5E94\u89C6\u89C9\u8BED\u6CD5\u3002

\u4F8B\u5982\uFF1A

- architecture\uFF1Ashared backbone\u3001branches\u3001fusion\u3001prediction\uFF1B
- protocol\uFF1Adeclare\u3001select\u3001freeze\u3001evaluate \u7B49\u9636\u6BB5\u4E0E\u63A7\u5236\u8FB9\u754C\uFF1B
- iterative method\uFF1Astate\u3001update\u3001feedback\u3001termination\uFF1B
- multimodal method\uFF1Aparallel streams\u3001alignment\u3001interaction\u3001fusion\uFF1B
- retrieval system\uFF1Aquery\u3001retriever\u3001evidence pool\u3001reranking\u3001decision\uFF1B
- optimization procedure\uFF1Avariables\u3001constraints\u3001update steps\u3001solution\u3002

\u4E0D\u5F97\u628A evaluation protocol \u4F2A\u88C5\u6210 learned neural architecture\u3002

## \u5185\u5BB9\u9884\u7B97

\u9ED8\u8BA4\u9650\u5236\u4E3A\uFF1A

- 3\u20135 \u4E2A\u4E3B\u8981\u533A\u57DF\uFF1B
- 8\u201312 \u4E2A\u4E3B\u8981\u89C6\u89C9\u5BF9\u8C61\uFF1B
- 12\u201318 \u4E2A\u53EF\u89C1\u6807\u7B7E\uFF1B
- \u5168\u56FE\u89E3\u91CA\u6027\u82F1\u6587\u7EA6 45\u201370 \u4E2A\u8BCD\uFF1B
- 0\u20132 \u4E2A\u5B8C\u6574\u516C\u5F0F\uFF1B
- 6\u201312 \u6761\u4E3B\u8981\u7BAD\u5934\uFF1B
- \u5361\u7247\u5D4C\u5957\u6DF1\u5EA6\u6700\u591A\u4E24\u5C42\uFF1B
- \u6B21\u8981\u652F\u7EBF\u5360\u753B\u5E03\u9762\u79EF\u4E0D\u8D85\u8FC7 20%\u3002

\u8D85\u51FA\u9884\u7B97\u65F6\uFF0C\u6309\u4EE5\u4E0B\u987A\u5E8F\u5904\u7406\uFF1A

1. \u5220\u9664\u89E3\u91CA\u6027\u53E5\u5B50\uFF1B
2. \u7528\u89C6\u89C9\u5BF9\u8C61\u4EE3\u66FF\u516C\u5F0F\u6216\u63CF\u8FF0\uFF1B
3. \u5C06\u5B50\u6B65\u9AA4\u5408\u5E76\u4E3A\u4E00\u4E2A\u7ED3\u6784\u5316\u8868\u793A\uFF1B
4. \u5C06\u5C40\u90E8\u673A\u5236\u79FB\u5230\u6838\u5FC3\u673A\u5236\u7EC6\u8282\u56FE\uFF1B
5. \u5220\u9664\u4E0D\u5F71\u54CD\u6574\u4F53\u5FC3\u667A\u6A21\u578B\u7684\u8BAD\u7EC3\u7EC6\u8282\u3002

## \u5FC5\u987B\u5448\u73B0\u7684\u5185\u5BB9

\u56FE\u4E2D\u4F18\u5148\u4FDD\u7559\uFF1A

1. \u8F93\u5165\u8FB9\u754C\uFF1B
2. \u57FA\u7840\u8868\u793A\u6216\u5171\u4EAB\u8BA1\u7B97\uFF1B
3. \u51B3\u5B9A\u65B9\u6CD5\u8EAB\u4EFD\u7684\u6838\u5FC3\u6A21\u5757\uFF1B
4. \u771F\u5B9E\u5B58\u5728\u7684\u5206\u652F\u3001\u5171\u4EAB\u3001\u4EA4\u4E92\u3001\u878D\u5408\u6216\u5FAA\u73AF\uFF1B
5. \u8F93\u51FA\u8FB9\u754C\u3002

\u53EA\u6709\u5728\u786E\u5B9E\u5F71\u54CD\u7406\u89E3\u65F6\u624D\u5C55\u793A\uFF1A

- training \u4E0E inference \u5DEE\u5F02\uFF1B
- shared parameters\uFF1B
- cross-layer interaction\uFF1B
- query-conditioned processing\uFF1B
- multimodal alignment\uFF1B
- external memory\uFF1B
- iterative refinement\uFF1B
- controller feedback\uFF1B
- auxiliary training branch\u3002

\u5982\u679C\u635F\u5931\u51FD\u6570\u53EA\u7528\u4E8E\u8BAD\u7EC3\uFF0C\u4E14\u4E0D\u662F\u8BBA\u6587\u6700\u6838\u5FC3\u8D21\u732E\uFF0C\u5E94\u4F5C\u4E3A\u5F88\u5C0F\u7684 training-only \u652F\u8DEF\u6216\u5B8C\u5168\u79FB\u51FA\uFF0C\u800C\u4E0D\u662F\u5360\u636E\u4E3B\u8DEF\u5F84\u3002

## \u6784\u56FE\u539F\u5219

\u5EFA\u7ACB\u4E00\u6761\u552F\u4E00\u7684\u4E3B\u8981\u9605\u8BFB\u8DEF\u5F84\u3002

\u56FE\u4E2D\u5FC5\u987B\u5177\u6709\uFF1A

- \u4E00\u4E2A\u660E\u786E\u89C6\u89C9\u5165\u53E3\uFF1B
- \u4E00\u4E2A\u89C6\u89C9\u7126\u70B9\uFF1B
- \u4E00\u4E2A\u6E05\u695A\u8F93\u51FA\uFF1B
- \u4E3B\u8DEF\u5F84\u4E0E\u6B21\u8981\u652F\u8DEF\u7684\u660E\u663E\u5C42\u7EA7\u3002

\u4E0D\u8981\u8BA9\u6240\u6709\u6A21\u5757\u7B49\u5BBD\u3001\u7B49\u9AD8\u6216\u5747\u5300\u5206\u683C\u3002

\u65B9\u6CD5\u6700\u5177\u521B\u65B0\u6027\u7684\u6A21\u5757\u5E94\u83B7\u5F97\u66F4\u5927\u9762\u79EF\u6216\u66F4\u4E30\u5BCC\u7684\u5185\u90E8\u7ED3\u6784\uFF1B\u901A\u7528 encoder\u3001backbone\u3001classifier \u6216 predictor \u5E94\u5F31\u5316\u3002

\u6BCF\u4E2A\u6838\u5FC3\u6A21\u5757\u5FC5\u987B\u5305\u542B\u81F3\u5C11\u4E00\u79CD\u771F\u5B9E\u79D1\u5B66\u7ED3\u6784\uFF0C\u4F8B\u5982\uFF1A

- \u8F93\u5165 token \u6216 feature stack\uFF1B
- multi-scale branches\uFF1B
- layer stack\uFF1B
- query vector\uFF1B
- mask\uFF1B
- gate\uFF1B
- selector\uFF1B
- cross-modal links\uFF1B
- fusion node\uFF1B
- memory slots\uFF1B
- iterative state\uFF1B
- output schema\u3002

\u4E0D\u5F97\u53EA\u753B\u4E00\u4E2A\u5199\u6709\u6A21\u5757\u540D\u79F0\u7684\u7A7A\u6846\u3002

## \u5185\u5BB9\u8FB9\u754C

\u4E0D\u5F97\u653E\u5165\uFF1A

- Introduction \u4E2D\u7684\u95EE\u9898\u573A\u666F\uFF1B
- related work \u5BF9\u6BD4\uFF1B
- \u5B9E\u9A8C\u7ED3\u679C\uFF1B
- \u6027\u80FD\u6570\u5B57\uFF1B
- baseline \u540D\u79F0\uFF1B
- \u6D88\u878D\uFF1B
- \u5168\u90E8\u635F\u5931\u9879\uFF1B
- \u5168\u90E8\u8D85\u53C2\u6570\uFF1B
- \u4EE3\u7801\u7EA7\u5B9E\u73B0\uFF1B
- \u6BCF\u4E2A tensor \u7684\u6240\u6709\u7EF4\u5EA6\uFF1B
- \u7814\u7A76\u5F71\u54CD\u6216\u90E8\u7F72\u7ED3\u8BBA\u3002

## \u6700\u7EC8\u82F1\u6587 Prompt \u957F\u5EA6

\u6700\u7EC8\u751F\u6210\u7684\u82F1\u6587\u5236\u56FE Prompt \u63A7\u5236\u5728\u7EA6 600\u20131000 \u4E2A\u82F1\u6587\u8BCD\u3002`,
    en: `# Figure-Type Adapter \u2014 Method Overview Figure

Design only a Method Overview figure in this task.

## Responsibility of the figure

Before readers enter the Method details, this figure must establish a system-level mental map:

- the formal input;
- which computation, representation, or parameters are shared;
- how the 2\u20134 identity-defining stages are organized;
- where information branches, interacts, is selected, fuses, updates, or feeds back;
- the formal output.

It must not reargue the research motivation or explain every local operator.

## Identify the method form first

Do not depict every paper as a neural-network pipeline by default.

Infer the method\u2019s primary form from its real structure:

- neural architecture;
- algorithmic workflow;
- evaluation protocol;
- optimization procedure;
- data-processing system;
- multimodal interaction framework;
- iterative control or refinement process;
- retrieval or memory system.

Select the visual grammar that matches that form.

For example:

- architecture: shared backbone, branches, fusion, prediction;
- protocol: stages such as declare, select, freeze, and evaluate, plus control boundaries;
- iterative method: state, update, feedback, termination;
- multimodal method: parallel streams, alignment, interaction, fusion;
- retrieval system: query, retriever, evidence pool, reranking, decision;
- optimization procedure: variables, constraints, update steps, solution.

Never disguise an evaluation protocol as a learned neural architecture.

## Content budget

Default limits:

- 3\u20135 major regions;
- 8\u201312 principal visual objects;
- 12\u201318 visible labels;
- roughly 45\u201370 explanatory English words across the figure;
- 0\u20132 complete equations;
- 6\u201312 principal arrows;
- at most two levels of card nesting;
- no more than 20% of the canvas for secondary branches.

When the content exceeds the budget, resolve it in this order:

1. remove explanatory sentences;
2. replace equations or descriptions with visual objects;
3. merge substeps into one structured representation;
4. move local mechanisms to a Core Mechanism Detail figure;
5. remove training detail that does not affect the system-level mental model.

## Required content

Prioritize:

1. the input boundary;
2. the base representation or shared computation;
3. the core modules that define the method\u2019s identity;
4. real branches, sharing, interaction, fusion, or loops;
5. the output boundary.

Show the following only when they materially affect understanding:

- training versus inference differences;
- shared parameters;
- cross-layer interaction;
- query-conditioned processing;
- multimodal alignment;
- external memory;
- iterative refinement;
- controller feedback;
- an auxiliary training branch.

If a loss function exists only for training and is not the paper\u2019s central contribution, place it in a very small training-only branch or omit it. Never let it occupy the main path.

## Composition principles

Establish one primary reading path.

The figure must have:

- one clear visual entry;
- one visual focus;
- one clear output;
- an obvious hierarchy between the main path and secondary branches.

Do not make every module equal in width and height or divide the figure into uniform cells.

Give the most innovative module more area or a richer internal structure. Visually subordinate generic encoders, backbones, classifiers, and predictors.

Every core module must contain at least one real scientific structure, such as:

- input tokens or a feature stack;
- multi-scale branches;
- a layer stack;
- a query vector;
- a mask;
- a gate;
- a selector;
- cross-modal links;
- a fusion node;
- memory slots;
- an iterative state;
- an output schema.

Do not use an empty box containing only a module name.

## Content boundary

Do not include:

- the problem scenario from the Introduction;
- related-work comparisons;
- experimental results;
- performance numbers;
- baseline names;
- ablations;
- every loss term;
- every hyperparameter;
- code-level implementation;
- every dimension of every tensor;
- research-impact or deployment conclusions.

## Final English prompt length

Keep the final English image-generation prompt to approximately 600\u20131000 words.`
  },
  "technical-detail": {
    zh: `# Figure-Type Adapter \u2014 Core Mechanism Detail Figure

\u672C\u6B21\u53EA\u8BBE\u8BA1\u4E00\u5F20\u6838\u5FC3\u673A\u5236\u7EC6\u8282\u56FE\u3002

## \u56FE\u7684\u804C\u8D23

\u8FD9\u5F20\u56FE\u5FC5\u987B\u89E3\u91CA\u8BBA\u6587\u4E2D\u4E00\u4E2A\u6700\u9700\u8981\u89C6\u89C9\u8BF4\u660E\u7684\u6838\u5FC3\u673A\u5236\uFF1A

- \u5B83\u63A5\u6536\u4EC0\u4E48\u8F93\u5165\uFF1B
- \u5185\u90E8\u8868\u793A\u5982\u4F55\u53D8\u5316\uFF1B
- \u54EA\u4E9B\u64CD\u4F5C\u6309\u4EC0\u4E48\u987A\u5E8F\u53D1\u751F\uFF1B
- \u4FE1\u606F\u5728\u54EA\u91CC\u9009\u62E9\u3001\u5BF9\u9F50\u3001\u805A\u5408\u3001\u95E8\u63A7\u3001\u66F4\u65B0\u6216\u4EA4\u4E92\uFF1B
- \u5B83\u4EA7\u751F\u4EC0\u4E48\u5C40\u90E8\u8F93\u51FA\uFF1B
- \u8BE5\u8F93\u51FA\u5982\u4F55\u63A5\u56DE\u6574\u4F53\u65B9\u6CD5\u3002

\u5B83\u4E0D\u662F\u7B2C\u4E8C\u5F20\u65B9\u6CD5\u603B\u89C8\u56FE\uFF0C\u4E5F\u4E0D\u662F\u516C\u5F0F\u6C47\u603B\u56FE\u3002

## \u81EA\u52A8\u9009\u62E9\u673A\u5236

\u4ECE\u8BBA\u6587\u7684\u8D21\u732E\u9648\u8FF0\u3001Method \u7ED3\u6784\u548C\u6D88\u878D\u8BBE\u8BA1\u4E2D\uFF0C\u81EA\u52A8\u9009\u62E9\u4E00\u4E2A\u6700\u5408\u9002\u7684\u673A\u5236\u3002

\u4F18\u5148\u9009\u62E9\u540C\u65F6\u6EE1\u8DB3\u4EE5\u4E0B\u6761\u4EF6\u7684\u90E8\u5206\uFF1A

1. \u662F\u8BBA\u6587\u4E3B\u8981\u521B\u65B0\u4E4B\u4E00\uFF1B
2. \u4EC5\u9760\u6A21\u5757\u540D\u79F0\u96BE\u4EE5\u7406\u89E3\uFF1B
3. \u5177\u6709\u53EF\u4EE5\u89C6\u89C9\u5316\u7684\u5185\u90E8\u72B6\u6001\u3001\u8868\u793A\u6216\u64CD\u4F5C\uFF1B
4. \u5BF9\u540E\u7EED\u65B9\u6CD5\u6216\u8F93\u51FA\u6709\u660E\u786E\u4F5C\u7528\uFF1B
5. \u4E0E\u65B9\u6CD5\u603B\u89C8\u56FE\u76F8\u6BD4\u80FD\u591F\u63D0\u4F9B\u65B0\u7684\u7406\u89E3\u3002

\u4E0D\u8981\u4EC5\u56E0\u4E3A\u67D0\u4E00\u8282\u516C\u5F0F\u6700\u591A\u3001\u7BC7\u5E45\u6700\u957F\u6216\u540D\u79F0\u6700\u590D\u6742\u5C31\u9009\u62E9\u5B83\u3002

\u5F53\u8BBA\u6587\u5305\u542B\u591A\u4E2A\u6838\u5FC3\u6A21\u5757\u65F6\uFF0C\u53EA\u9009\u62E9\u5176\u4E2D\u4E00\u4E2A\u6700\u9700\u8981\u89C6\u89C9\u89E3\u91CA\u7684\u673A\u5236\u3002\u5176\u4ED6\u6A21\u5757\u4EC5\u4F5C\u4E3A\u8F93\u5165\u6216\u8F93\u51FA\u63A5\u53E3\u51FA\u73B0\uFF0C\u4E0D\u5F97\u5E76\u5217\u5C55\u5F00\u3002

## \u673A\u5236\u7C7B\u578B

\u6839\u636E\u8BBA\u6587\u5185\u5BB9\uFF0C\u5185\u90E8\u9009\u62E9\u4E00\u79CD\u4E3B\u8981\u89C6\u89C9\u8BED\u6CD5\uFF1A

- exploded operator anatomy\uFF1B
- tensor or representation transformation\uFF1B
- multi-scale processing\uFF1B
- cross-layer aggregation\uFF1B
- query-conditioned selection\uFF1B
- attention or gating mechanism\uFF1B
- graph message passing\uFF1B
- cross-modal alignment\uFF1B
- memory read/write\uFF1B
- iterative state update\uFF1B
- geometric transformation\uFF1B
- objective decomposition\uFF1B
- controller decision and stopping rule\u3002

\u4E0D\u5F97\u5F3A\u884C\u4F7F\u7528\u901A\u7528\u5DE6\u5230\u53F3\u6A21\u5757\u6D41\u6C34\u7EBF\u3002

## \u5185\u5BB9\u9884\u7B97

\u9ED8\u8BA4\u9650\u5236\u4E3A\uFF1A

- 2\u20134 \u4E2A\u4E3B\u8981\u533A\u57DF\uFF1B
- 6\u201310 \u4E2A\u4E3B\u8981\u89C6\u89C9\u5BF9\u8C61\uFF1B
- 8\u201316 \u4E2A\u53EF\u89C1\u6807\u7B7E\uFF1B
- \u5168\u56FE\u89E3\u91CA\u6027\u82F1\u6587\u7EA6 45\u201380 \u4E2A\u8BCD\uFF1B
- 1\u20133 \u4E2A\u6838\u5FC3\u516C\u5F0F\uFF1B
- 6\u201312 \u6761\u4E3B\u8981\u8FDE\u63A5\uFF1B
- \u6700\u591A\u4E00\u4E2A\u5C40\u90E8\u793A\u4F8B\u6216\u4EE3\u8868\u6027\u8F93\u5165\u3002

\u5982\u679C\u516C\u5F0F\u8D85\u8FC7\u4E09\u4E2A\uFF0C\u5E94\u4FDD\u7559\u5B9A\u4E49\u6838\u5FC3\u64CD\u4F5C\u7684\u516C\u5F0F\uFF0C\u5176\u4F59\u6539\u4E3A\u64CD\u4F5C\u540D\u79F0\u6216\u89C6\u89C9\u5173\u7CFB\u3002

## \u5FC5\u987B\u5448\u73B0\u7684\u5185\u5BB9

\u4F18\u5148\u5C55\u793A\uFF1A

1. \u673A\u5236\u7684\u5C40\u90E8\u8F93\u5165\uFF1B
2. \u5173\u952E\u4E2D\u95F4\u8868\u793A\uFF1B
3. \u6838\u5FC3\u64CD\u4F5C\uFF1B
4. \u9009\u62E9\u3001\u4EA4\u4E92\u3001\u805A\u5408\u3001\u66F4\u65B0\u6216\u7EA6\u675F\u5173\u7CFB\uFF1B
5. \u5C40\u90E8\u8F93\u51FA\uFF1B
6. \u4E0E\u6574\u4F53\u65B9\u6CD5\u7684\u4E00\u4E2A\u7B80\u6D01\u63A5\u53E3\u3002

\u53EF\u4EE5\u5728\u8BBA\u6587\u660E\u786E\u652F\u6301\u4E14\u786E\u6709\u5E2E\u52A9\u65F6\u5C55\u793A\uFF1A

- \u5F20\u91CF\u7EF4\u5EA6\uFF1B
- layer index\uFF1B
- token index\uFF1B
- mask\uFF1B
- attention weights\uFF1B
- gate values\uFF1B
- spatial coordinates\uFF1B
- state variables\uFF1B
- before/after representation\uFF1B
- one-step update\uFF1B
- symbolic micro-example\u3002

\u6240\u6709\u7EF4\u5EA6\u3001\u7B26\u53F7\u548C\u64CD\u4F5C\u5FC5\u987B\u6765\u81EA\u8BBA\u6587\uFF0C\u4E0D\u5F97\u6839\u636E\u5E38\u89C1\u6A21\u578B\u81EA\u884C\u63A8\u65AD\u3002

## \u89C6\u89C9\u8981\u6C42

\u8FD9\u5F20\u56FE\u5E94\u6BD4\u65B9\u6CD5\u603B\u89C8\u56FE\u66F4\u63A5\u8FD1\u201C\u673A\u5236\u5256\u9762\u56FE\u201D\u3002

\u6838\u5FC3\u7B97\u5B50\u6216\u4EA4\u4E92\u533A\u57DF\u5E94\u6210\u4E3A\u89C6\u89C9\u4E2D\u5FC3\uFF0C\u5E76\u83B7\u5F97\u6700\u5927\u7684\u7A7A\u95F4\u3002

\u4F18\u5148\u4F7F\u7528\uFF1A

- \u5206\u89E3\u540E\u7684\u8F93\u5165\u8868\u793A\uFF1B
- \u591A\u5206\u652F\u5904\u7406\uFF1B
- \u5185\u90E8\u5BF9\u9F50\u7EBF\uFF1B
- gating or selection marks\uFF1B
- matrix or heatmap\uFF1B
- token highlighting\uFF1B
- layer stack\uFF1B
- intermediate state snapshots\uFF1B
- merge or update equation\uFF1B
- local zoom-in inset\u3002

\u4E0D\u8981\u5C06\u6BCF\u4E2A\u516C\u5F0F\u5355\u72EC\u653E\u5165\u4E00\u4E2A\u5927\u5361\u7247\u3002

\u516C\u5F0F\u5FC5\u987B\u4E0E\u5BF9\u5E94\u7684\u89C6\u89C9\u5BF9\u8C61\u7D27\u90BB\uFF0C\u5E76\u80FD\u591F\u660E\u786E\u770B\u51FA\u516C\u5F0F\u4E2D\u7684\u53D8\u91CF\u6765\u81EA\u54EA\u91CC\u3001\u8F93\u51FA\u5230\u54EA\u91CC\u3002

## \u5185\u5BB9\u8FB9\u754C

\u4E0D\u5F97\u653E\u5165\uFF1A

- \u6574\u7BC7\u8BBA\u6587\u7684\u5B8C\u6574\u8F93\u5165\u5230\u8F93\u51FA\u6D41\u7A0B\uFF1B
- Introduction \u52A8\u673A\uFF1B
- \u6240\u6709\u65B9\u6CD5\u6A21\u5757\uFF1B
- \u5168\u90E8\u8BAD\u7EC3\u635F\u5931\uFF1B
- \u5B9E\u9A8C\u7ED3\u679C\uFF1B
- \u6027\u80FD\u6570\u5B57\uFF1B
- baseline \u5BF9\u6BD4\uFF1B
- \u6D88\u878D\u7ED3\u8BBA\uFF1B
- \u8D85\u53C2\u6570\uFF1B
- \u4EE3\u7801\u5B9E\u73B0\uFF1B
- \u4E0E\u6240\u9009\u673A\u5236\u65E0\u5173\u7684\u5206\u652F\u3002

## \u6700\u7EC8\u82F1\u6587 Prompt \u957F\u5EA6

\u6700\u7EC8\u751F\u6210\u7684\u82F1\u6587\u5236\u56FE Prompt \u63A7\u5236\u5728\u7EA6 500\u2013900 \u4E2A\u82F1\u6587\u8BCD\u3002`,
    en: `# Figure-Type Adapter \u2014 Core Mechanism Detail Figure

Design exactly one Core Mechanism Detail figure in this task.

## Responsibility of the figure

This figure must explain the single mechanism in the paper that most needs visual treatment:

- what input it receives;
- how its internal representation changes;
- which operations occur and in what order;
- where information is selected, aligned, aggregated, gated, updated, or made to interact;
- what local output it produces;
- how that output reconnects to the overall method.

This is neither a second Method Overview nor an equation collection.

## Automatic mechanism selection

Select the most suitable mechanism from the contribution statements, Method structure, and ablation design.

Prioritize a part that satisfies all of the following:

1. it is one of the paper\u2019s principal innovations;
2. its module name alone is insufficient for understanding;
3. it has internal states, representations, or operations that can be visualized;
4. it has a clear effect on later processing or output;
5. it provides new understanding beyond the Method Overview.

Do not select a section merely because it has the most equations, the greatest length, or the most complicated name.

When the paper contains several core modules, select only the one that most needs visual explanation. Show every other module only as an input or output interface and do not expand it in parallel.

## Mechanism type

Internally choose one primary visual grammar that matches the manuscript:

- exploded operator anatomy;
- tensor or representation transformation;
- multi-scale processing;
- cross-layer aggregation;
- query-conditioned selection;
- attention or gating mechanism;
- graph message passing;
- cross-modal alignment;
- memory read/write;
- iterative state update;
- geometric transformation;
- objective decomposition;
- controller decision and stopping rule.

Do not force a generic left-to-right module pipeline.

## Content budget

Default limits:

- 2\u20134 major regions;
- 6\u201310 principal visual objects;
- 8\u201316 visible labels;
- roughly 45\u201380 explanatory English words across the figure;
- 1\u20133 core equations;
- 6\u201312 principal connections;
- at most one local example or representative input.

If more than three equations are candidates, retain only those that define the core operation. Replace the others with operation names or visual relationships.

## Required content

Prioritize:

1. the mechanism\u2019s local input;
2. important intermediate representations;
3. the core operation;
4. selection, interaction, aggregation, update, or constraint relations;
5. the local output;
6. one concise interface back to the overall method.

When explicitly supported by the paper and genuinely helpful, you may show:

- tensor dimensions;
- a layer index;
- a token index;
- a mask;
- attention weights;
- gate values;
- spatial coordinates;
- state variables;
- a before/after representation;
- a one-step update;
- a symbolic micro-example.

Every dimension, symbol, and operation must come from the paper. Never infer them from a familiar model.

## Visual requirements

Treat this figure as a mechanism cross-section rather than another overview.

Make the core operator or interaction region the visual center and give it the most space.

Prefer:

- decomposed input representations;
- multi-branch processing;
- internal alignment lines;
- gating or selection marks;
- a matrix or heatmap;
- token highlighting;
- a layer stack;
- intermediate-state snapshots;
- a merge or update equation;
- a local zoom-in inset.

Do not place every equation in its own large card.

Place each equation immediately beside its corresponding visual object, making the origin and destination of every variable visually clear.

## Content boundary

Do not include:

- the paper\u2019s complete input-to-output flow;
- Introduction motivation;
- every method module;
- every training loss;
- experimental results;
- performance numbers;
- baseline comparisons;
- ablation conclusions;
- hyperparameters;
- code implementation;
- branches unrelated to the selected mechanism.

## Final English prompt length

Keep the final English image-generation prompt to approximately 500\u2013900 words.`
  },
  ...EXTENDED_FIGURE_TYPE_ADAPTERS
};
var OUTPUT_PROTOCOL = {
  zh: (outputFileName) => `# Output and Two-Step Execution Protocol

## Step 1 \u2014 Generate the English image prompt

\u672C\u8F6E\u4E0D\u8981\u751F\u6210\u56FE\u7247\u3002

\u5148\u5728\u5185\u90E8\u5B8C\u6210\u6750\u6599\u53D6\u8BC1\u3001\u5185\u5BB9\u538B\u7F29\u3001\u89C6\u89C9\u8BED\u6CD5\u9009\u62E9\u3001\u5E03\u5C40\u8BBE\u8BA1\u3001\u7CBE\u786E\u6807\u7B7E\u6838\u5BF9\u548C\u5185\u5BB9\u9884\u7B97\u68C0\u67E5\u3002

\u4E0D\u5F97\u900F\u9732\u63A8\u7406\u8FC7\u7A0B\u3001\u88AB\u820D\u5F03\u7684\u65B9\u6848\u3001\u8BC1\u636E\u8868\u6216\u4E2D\u95F4\u8349\u7A3F\u3002

\u53EA\u8F93\u51FA\uFF1A

FINAL IMAGE PROMPT

\u968F\u540E\u5728\u4E00\u4E2A \`text\` \u4EE3\u7801\u5757\u4E2D\u7ED9\u51FA\u4E00\u4EFD\u5B8C\u6574\u82F1\u6587 Prompt\u3002

\u82F1\u6587 Prompt \u5FC5\u987B\u81EA\u5305\u542B\uFF0C\u4E0D\u5F97\u4F7F\u7528 \`[Module A]\`\u3001\`TBD\`\u3001\u201Crefer to the paper\u201D\u6216\u201Cuse the settings above\u201D\u7B49\u5360\u4F4D\u8868\u8FBE\u3002

\u4E25\u683C\u4F7F\u7528\u4EE5\u4E0B\u4E03\u4E2A\u6807\u9898\u5E76\u4FDD\u6301\u987A\u5E8F\uFF1A

1. VISUAL THESIS
2. COMPOSITION
3. SCIENTIFIC VISUAL OBJECTS
4. FLOW AND RELATIONSHIPS
5. STYLE SPECIFICATION
6. EXACT TEXT AND MATH
7. NEGATIVE CONSTRAINTS

\u8981\u6C42\uFF1A

- \u53EA\u5305\u542B\u7531\u8BBA\u6587\u8BC1\u636E\u652F\u6301\u4E14\u5C5E\u4E8E\u5F53\u524D\u56FE\u578B\u7684\u5185\u5BB9\u3002
- \u9075\u5B88\u5F53\u524D\u56FE\u578B\u7684\u5185\u5BB9\u9884\u7B97\u3002
- \u4E0D\u8981\u5728\u591A\u4E2A\u90E8\u5206\u91CD\u590D\u540C\u4E00\u6761\u5E03\u5C40\u6216\u8FDE\u63A5\u6307\u4EE4\u3002
- \u666E\u901A\u76F8\u90BB\u6D41\u5411\u53EA\u63CF\u8FF0\u4E00\u6B21\uFF1B\u53EA\u679A\u4E3E\u5177\u6709\u79D1\u5B66\u610F\u4E49\u7684\u5206\u652F\u3001\u5408\u5E76\u3001\u5171\u4EAB\u3001\u5FAA\u73AF\u3001\u53CD\u9988\u6216\u6210\u5BF9\u6BD4\u8F83\u3002
- SCIENTIFIC VISUAL OBJECTS \u5FC5\u987B\u89C4\u5B9A\u975E\u6587\u5B57\u79D1\u5B66\u8868\u793A\uFF0C\u4E0D\u80FD\u53EA\u6709\u5361\u7247\u548C\u6807\u7B7E\u3002
- EXACT TEXT AND MATH \u53EA\u5305\u542B\u6700\u7EC8\u786E\u5B9E\u4F1A\u51FA\u73B0\u5728\u56FE\u4E2D\u7684\u53D7\u4FDD\u62A4\u6807\u7B7E\u4E0E\u83B7\u51C6\u516C\u5F0F\u3002
- NEGATIVE CONSTRAINTS \u6700\u591A\u5305\u542B\u516B\u6761\u9AD8\u98CE\u9669\u7981\u6B62\u9879\u3002
- \u4E0D\u5305\u542B\u5F15\u7528\u3001\u6E90\u6587\u4EF6\u540D\u3001\u8BBA\u6587\u5143\u6570\u636E\u3001\u4F5C\u8005\u3001caption \u6216\u5185\u90E8\u6838\u67E5\u8BF4\u660E\u3002
- \u81EA\u7136\u8BED\u8A00 Prompt \u4E2D\u4E0D\u6307\u5B9A\u50CF\u7D20\u5206\u8FA8\u7387\uFF1B\u53EA\u4F7F\u7528\u6240\u9009\u5BBD\u9AD8\u6BD4\u5E76\u8981\u6C42\u9AD8\u5206\u8FA8\u7387\u8F93\u51FA\u3002
- \u4E0D\u5F97\u9759\u9ED8\u6539\u53D8\u4EFB\u4F55\u7528\u6237\u9009\u62E9\u7684\u89C6\u89C9\u8BBE\u7F6E\u3002

\u4EE3\u7801\u5757\u540E\u53EA\u5199\uFF1A

\u8BE6\u7EC6\u82F1\u6587\u5236\u56FE Prompt \u5DF2\u51C6\u5907\u597D\u3002\u8F93\u5165\u201C\u5F00\u59CB\u7ED8\u56FE\u201D\u751F\u6210\u8FD9\u5F20\u56FE\uFF1B\u5982\u9700\u8C03\u6574\uFF0C\u8BF7\u76F4\u63A5\u8BF4\u660E\u4FEE\u6539\u9879\u3002

\u7136\u540E\u505C\u6B62\u3002

## Step 2 \u2014 Generate after confirmation

\u53EA\u6709\u7528\u6237\u8F93\u5165\u201C\u5F00\u59CB\u7ED8\u56FE\u201D\u3001\`Start drawing\` \u6216\u660E\u786E\u540C\u4E49\u6307\u4EE4\u540E\uFF1A

- \u4F7F\u7528\u6700\u8FD1\u4E00\u6B21\u786E\u8BA4\u7684\u5B8C\u6574\u82F1\u6587 Prompt\uFF1B
- \u53EA\u751F\u6210\u4E00\u5F20\u6700\u7EC8\u56FE\u7247\uFF1B
- \u4F7F\u7528\u6240\u9009\u5BBD\u9AD8\u6BD4\uFF1B
- \u4E0D\u63D0\u4F9B\u5907\u9009\u65B9\u6848\u6216\u989D\u5916\u8BBE\u8BA1\u5EFA\u8BAE\uFF1B
- \u4E0D\u6DFB\u52A0\u8BBA\u6587\u6807\u9898\u3001\u4F5C\u8005\u3001caption\u3001\u6C34\u5370\u6216\u65E0\u8BC1\u636E\u5185\u5BB9\u3002${outputFileName ? `
- \u6700\u7EC8\u56FE\u50CF\u5FC5\u987B\u4FDD\u5B58\u4E3A \`${outputFileName}\`\u3002` : ""}

\u751F\u6210\u540E\u5728\u5185\u90E8\u6838\u5BF9\uFF1A

- \u65B9\u6CD5\u540D\u4E0E\u6A21\u5757\u540D\u662F\u5426\u7CBE\u786E\uFF1B
- \u5927\u5C0F\u5199\u3001\u8FDE\u5B57\u7B26\u3001\u4E0A\u4E0B\u6807\u3001\u4E0A\u6807\u548C\u7B26\u53F7\u662F\u5426\u7CBE\u786E\uFF1B
- \u8F93\u5165\u4E0E\u8F93\u51FA\u8FB9\u754C\u662F\u5426\u6B63\u786E\uFF1B
- \u6BCF\u6761\u91CD\u8981\u7BAD\u5934\u7684\u6765\u6E90\u3001\u76EE\u6807\u4E0E\u65B9\u5411\u662F\u5426\u6B63\u786E\uFF1B
- \u662F\u5426\u5B58\u5728\u91CD\u590D\u6A21\u5757\uFF1B
- \u8BED\u4E49\u989C\u8272\u662F\u5426\u4E00\u81F4\uFF1B
- \u6700\u7EC8\u8BBA\u6587\u5C3A\u5BF8\u4E0B\u662F\u5426\u53EF\u8BFB\uFF1B
- \u662F\u5426\u7B26\u5408\u5F53\u524D\u56FE\u578B\u7684\u5185\u5BB9\u9884\u7B97\uFF1B
- \u662F\u5426\u9000\u5316\u4E3A\u4E00\u7EC4\u6587\u5B57\u5BC6\u96C6\u7684\u6846\u3002

\u5982\u679C\u4E3B\u8981\u533A\u57DF\u4ECD\u51E0\u4E4E\u5B8C\u5168\u7531\u6587\u5B57\u5361\u7247\u6784\u6210\uFF0C\u5FC5\u987B\u91CD\u65B0\u8BBE\u8BA1\u53D7\u5F71\u54CD\u7684\u79D1\u5B66\u89C6\u89C9\u8868\u793A\uFF0C\u4E0D\u5F97\u63A5\u53D7\u5F53\u524D\u7ED3\u679C\u3002`,
  en: (outputFileName) => `# Output and Two-Step Execution Protocol

## Step 1 \u2014 Generate the English image prompt

Do not generate an image in the current response.

First complete the evidence extraction, content compression, visual-grammar selection, layout design, exact-label verification, and content-budget check internally.

Do not reveal reasoning, discarded alternatives, evidence tables, or intermediate drafts.

Output only:

FINAL IMAGE PROMPT

followed by one complete English prompt inside a \`text\` code block.

The English prompt must be self-contained and must not use placeholders such as \`[Module A]\`, \`TBD\`, \u201Crefer to the paper,\u201D or \u201Cuse the settings above.\u201D

Organize it using exactly these headings:

1. VISUAL THESIS
2. COMPOSITION
3. SCIENTIFIC VISUAL OBJECTS
4. FLOW AND RELATIONSHIPS
5. STYLE SPECIFICATION
6. EXACT TEXT AND MATH
7. NEGATIVE CONSTRAINTS

Requirements:

- Include only paper-supported content assigned to the current figure.
- Follow the figure-type-specific content budget.
- Do not repeat the same layout or connection instruction across multiple sections.
- Describe ordinary adjacent flow once; enumerate only scientifically important branches, merges, sharing, loops, feedback, or paired comparisons.
- The SCIENTIFIC VISUAL OBJECTS section must specify non-text visual representations, not only cards and labels.
- The EXACT TEXT AND MATH section must contain only the protected labels and permitted formulas that will actually appear in the image.
- NEGATIVE CONSTRAINTS may contain no more than eight high-risk prohibitions.
- Do not include citations, source filenames, paper metadata, authors, caption text, or internal verification notes.
- Do not specify a pixel resolution in the natural-language prompt; use the selected aspect ratio and request a high-resolution output.
- Do not silently change any user-selected visual setting.

After the code block, write only:

\u8BE6\u7EC6\u82F1\u6587\u5236\u56FE Prompt \u5DF2\u51C6\u5907\u597D\u3002\u8F93\u5165\u201C\u5F00\u59CB\u7ED8\u56FE\u201D\u751F\u6210\u8FD9\u5F20\u56FE\uFF1B\u5982\u9700\u8C03\u6574\uFF0C\u8BF7\u76F4\u63A5\u8BF4\u660E\u4FEE\u6539\u9879\u3002

Then stop.

## Step 2 \u2014 Generate after confirmation

Only after the user enters \u201C\u5F00\u59CB\u7ED8\u56FE\u201D, \u201CStart drawing\u201D, or an unambiguous equivalent instruction:

- use the most recently confirmed complete English prompt;
- generate exactly one final image;
- use the selected aspect ratio;
- do not provide alternatives or additional design proposals;
- do not add the paper title, authors, caption, watermark, or unsupported content.${outputFileName ? `
- save the final image as \`${outputFileName}\`.` : ""}

After generation, verify internally:

- exact method and module names;
- capitalization, hyphenation, subscripts, superscripts, and symbols;
- input and output boundaries;
- source, target, and direction of every important arrow;
- absence of duplicated modules;
- consistency of semantic colors;
- legibility at final paper size;
- compliance with the figure-type content budget;
- whether the result has degenerated into a collection of text-heavy boxes.

If the major regions are still composed almost entirely of text cards, redesign the affected visual representations rather than accepting the result.`
};

// app/figures/config.ts
var FIGURE_PROMPT_ORDER = [
  "introduction",
  "task-definition",
  "method-overview",
  "technical-detail",
  "training-inference",
  "algorithm-protocol",
  "data-construction",
  "system-deployment",
  "theory-concept",
  "geometry-coordinate",
  "survey-taxonomy"
];
var FIGURE_TYPE_RECOMMENDATIONS = {
  introduction: {
    promptId: "introduction",
    aspectRatioId: "landscape-16-9",
    customAspectWidth: 16,
    customAspectHeight: 9,
    paletteId: "tol-vibrant",
    fontFamilyId: "calibri",
    lineColorMode: "semantic",
    accentColorRangeId: "2-3",
    allowLightIllustrations: true,
    cardFillPolicyId: "semantic-regions",
    fontSizeLevels: 3,
    includeLargeTitle: false
  },
  "task-definition": {
    promptId: "task-definition",
    aspectRatioId: "landscape-3-2",
    customAspectWidth: 3,
    customAspectHeight: 2,
    paletteId: "tol-vibrant",
    fontFamilyId: "calibri",
    lineColorMode: "semantic",
    accentColorRangeId: "2-3",
    allowLightIllustrations: true,
    cardFillPolicyId: "semantic-regions",
    fontSizeLevels: 3,
    includeLargeTitle: false
  },
  "method-overview": {
    promptId: "method-overview",
    aspectRatioId: "landscape-2-1",
    customAspectWidth: 2,
    customAspectHeight: 1,
    paletteId: "tol-vibrant",
    fontFamilyId: "calibri",
    lineColorMode: "neutral",
    accentColorRangeId: "2-3",
    allowLightIllustrations: true,
    cardFillPolicyId: "key-regions",
    fontSizeLevels: 3,
    includeLargeTitle: false
  },
  "technical-detail": {
    promptId: "technical-detail",
    aspectRatioId: "landscape-4-3",
    customAspectWidth: 4,
    customAspectHeight: 3,
    paletteId: "tol-vibrant",
    fontFamilyId: "calibri",
    lineColorMode: "neutral",
    accentColorRangeId: "1-2",
    allowLightIllustrations: false,
    cardFillPolicyId: "key-regions",
    fontSizeLevels: 3,
    includeLargeTitle: false
  },
  "training-inference": {
    promptId: "training-inference",
    aspectRatioId: "landscape-2-1",
    customAspectWidth: 2,
    customAspectHeight: 1,
    paletteId: "tol-vibrant",
    fontFamilyId: "calibri",
    lineColorMode: "semantic",
    accentColorRangeId: "2-3",
    allowLightIllustrations: false,
    cardFillPolicyId: "key-regions",
    fontSizeLevels: 3,
    includeLargeTitle: false
  },
  "algorithm-protocol": {
    promptId: "algorithm-protocol",
    aspectRatioId: "landscape-3-2",
    customAspectWidth: 3,
    customAspectHeight: 2,
    paletteId: "tol-vibrant",
    fontFamilyId: "calibri",
    lineColorMode: "semantic",
    accentColorRangeId: "2-3",
    allowLightIllustrations: false,
    cardFillPolicyId: "key-regions",
    fontSizeLevels: 3,
    includeLargeTitle: false
  },
  "data-construction": {
    promptId: "data-construction",
    aspectRatioId: "landscape-2-1",
    customAspectWidth: 2,
    customAspectHeight: 1,
    paletteId: "tol-vibrant",
    fontFamilyId: "calibri",
    lineColorMode: "semantic",
    accentColorRangeId: "2-3",
    allowLightIllustrations: true,
    cardFillPolicyId: "semantic-regions",
    fontSizeLevels: 3,
    includeLargeTitle: false
  },
  "system-deployment": {
    promptId: "system-deployment",
    aspectRatioId: "landscape-16-9",
    customAspectWidth: 16,
    customAspectHeight: 9,
    paletteId: "tol-bright",
    fontFamilyId: "calibri",
    lineColorMode: "semantic",
    accentColorRangeId: "2-4",
    allowLightIllustrations: false,
    cardFillPolicyId: "semantic-regions",
    fontSizeLevels: 3,
    includeLargeTitle: false
  },
  "theory-concept": {
    promptId: "theory-concept",
    aspectRatioId: "landscape-4-3",
    customAspectWidth: 4,
    customAspectHeight: 3,
    paletteId: "tol-muted",
    fontFamilyId: "calibri",
    lineColorMode: "neutral",
    accentColorRangeId: "1-2",
    allowLightIllustrations: false,
    cardFillPolicyId: "key-regions",
    fontSizeLevels: 3,
    includeLargeTitle: false
  },
  "geometry-coordinate": {
    promptId: "geometry-coordinate",
    aspectRatioId: "landscape-3-2",
    customAspectWidth: 3,
    customAspectHeight: 2,
    paletteId: "tol-vibrant",
    fontFamilyId: "calibri",
    lineColorMode: "semantic",
    accentColorRangeId: "2-3",
    allowLightIllustrations: true,
    cardFillPolicyId: "key-regions",
    fontSizeLevels: 3,
    includeLargeTitle: false
  },
  "survey-taxonomy": {
    promptId: "survey-taxonomy",
    aspectRatioId: "landscape-3-2",
    customAspectWidth: 3,
    customAspectHeight: 2,
    paletteId: "tol-bright",
    fontFamilyId: "calibri",
    lineColorMode: "semantic",
    accentColorRangeId: "2-4",
    allowLightIllustrations: false,
    cardFillPolicyId: "semantic-regions",
    fontSizeLevels: 3,
    includeLargeTitle: false
  }
};
var FIGURE_DEFAULT_LAYOUT = Object.fromEntries(
  FIGURE_PROMPT_ORDER.map((promptId) => [
    promptId,
    {
      aspectRatioId: FIGURE_TYPE_RECOMMENDATIONS[promptId].aspectRatioId
    }
  ])
);
var DEFAULT_FIGURE_PREFERENCES = {
  ...FIGURE_TYPE_RECOMMENDATIONS["method-overview"]
};
var RECONSTRUCTION_OVERVIEW_FIGURE_PREFERENCES = {
  ...FIGURE_TYPE_RECOMMENDATIONS["method-overview"]
};
var FIGURE_ASPECT_RATIOS = {
  "landscape-4-3": {
    label: {
      zh: "\u6A2A\u7248 4:3",
      en: "Landscape 4:3"
    },
    ratio: "4:3",
    shortDescription: {
      zh: "\u7D27\u51D1\u5BF9\u7167\u4E0E\u5C40\u90E8\u673A\u5236",
      en: "Compact comparisons and local mechanisms"
    }
  },
  "landscape-3-2": {
    label: {
      zh: "\u6A2A\u7248 3:2",
      en: "Landscape 3:2"
    },
    ratio: "3:2",
    shortDescription: {
      zh: "\u5E73\u8861\u6A2A\u5411\u6D41\u7A0B\u4E0E\u673A\u5236\u5C42\u7EA7",
      en: "Balances horizontal flow and mechanism depth"
    }
  },
  "landscape-16-9": {
    label: {
      zh: "\u6A2A\u7248 16:9",
      en: "Landscape 16:9"
    },
    ratio: "16:9",
    shortDescription: {
      zh: "\u5F15\u8A00\u53D9\u4E8B\u4E0E\u6A2A\u5411\u8F6C\u6298",
      en: "Introduction narratives and horizontal transitions"
    }
  },
  "landscape-2-1": {
    label: {
      zh: "\u8D85\u5BBD 2:1",
      en: "Ultra-wide 2:1"
    },
    ratio: "2:1",
    shortDescription: {
      zh: "\u8D85\u5BBD\u65B9\u6CD5\u603B\u89C8\u9996\u9009",
      en: "Preferred for ultra-wide method overviews"
    }
  },
  "portrait-3-4": {
    label: {
      zh: "\u7AD6\u7248 3:4",
      en: "Portrait 3:4"
    },
    ratio: "3:4",
    shortDescription: {
      zh: "\u7EB5\u5411\u5C42\u7EA7\u4E0E\u673A\u5236\u5256\u9762",
      en: "Vertical hierarchy and mechanism anatomy"
    }
  },
  "portrait-9-16": {
    label: {
      zh: "\u7AD6\u7248 9:16",
      en: "Portrait 9:16"
    },
    ratio: "9:16",
    shortDescription: {
      zh: "\u8F83\u6DF1\u7EB5\u5411\u6D41\u7A0B\uFF0C\u614E\u7528",
      en: "Deep vertical flows; use sparingly"
    }
  },
  custom: {
    label: {
      zh: "\u81EA\u5B9A\u4E49",
      en: "Custom"
    },
    ratio: null,
    shortDescription: {
      zh: "\u8F93\u5165\u4EFB\u610F\u5BBD\u9AD8\u6BD4\u4F8B",
      en: "Enter any width-to-height ratio"
    }
  }
};
var FIGURE_ASPECT_RATIO_IDS = Object.keys(
  FIGURE_ASPECT_RATIOS
);
function greatestCommonDivisor(left, right) {
  let a = Math.max(1, Math.round(Math.abs(left)));
  let b = Math.max(1, Math.round(Math.abs(right)));
  while (b !== 0) {
    [a, b] = [b, a % b];
  }
  return a;
}
function getFigureAspectRatio(preferences) {
  const presetRatio = FIGURE_ASPECT_RATIOS[preferences.aspectRatioId].ratio;
  if (presetRatio) return presetRatio;
  const width = Math.max(1, Math.round(preferences.customAspectWidth));
  const height = Math.max(1, Math.round(preferences.customAspectHeight));
  const divisor = greatestCommonDivisor(width, height);
  return `${width / divisor}:${height / divisor}`;
}
var FIGURE_ACCENT_COLOR_RANGES = {
  "1-2": {
    min: 1,
    max: 2,
    label: "1\u20132"
  },
  "2-3": {
    min: 2,
    max: 3,
    label: "2\u20133"
  },
  "2-4": {
    min: 2,
    max: 4,
    label: "2\u20134"
  },
  "3-4": {
    min: 3,
    max: 4,
    label: "3\u20134"
  }
};
var FIGURE_ACCENT_COLOR_RANGE_IDS = Object.keys(
  FIGURE_ACCENT_COLOR_RANGES
);
var FIGURE_COLOR_PALETTES = {
  "tol-vibrant": {
    label: { zh: "Tol \u9C9C\u660E \xB7 \u84DD\u6A59", en: "Tol Vibrant \xB7 blue\u2013orange" },
    colors: ["#0077BB", "#EE7733", "#009988", "#CC3311"]
  },
  "tol-bright": {
    label: {
      zh: "Tol \u660E\u4EAE \xB7 \u84DD\u7EA2\u7EFF\u9EC4",
      en: "Tol Bright \xB7 blue\u2013red\u2013green\u2013yellow"
    },
    colors: ["#4477AA", "#EE6677", "#228833", "#CCBB44"]
  },
  "tol-muted": {
    label: {
      zh: "Tol \u67D4\u548C \xB7 \u975B\u73AB\u7470\u9752\u6C99",
      en: "Tol Muted \xB7 indigo\u2013rose\u2013teal\u2013sand"
    },
    colors: ["#332288", "#CC6677", "#44AA99", "#DDCC77"]
  }
};
var FIGURE_COLOR_PALETTE_IDS = Object.keys(
  FIGURE_COLOR_PALETTES
);
var FIGURE_FONT_FAMILIES = {
  "times-new-roman": {
    label: "Times New Roman"
  },
  arial: {
    label: "Arial"
  },
  calibri: {
    label: "Calibri"
  },
  helvetica: {
    label: "Helvetica"
  },
  "comic-sans": {
    label: "Comic Sans MS"
  }
};
var FIGURE_FONT_FAMILY_IDS = Object.keys(
  FIGURE_FONT_FAMILIES
);
var FIGURE_CARD_FILL_POLICIES = {
  white: {
    label: {
      zh: "\u5168\u90E8\u7EAF\u767D",
      en: "All white"
    },
    shortDescription: {
      zh: "\u5BB9\u5668\u53EA\u7528\u8FB9\u6846\u3001\u5BF9\u9F50\u548C\u7559\u767D\u5206\u7EC4\u3002",
      en: "Group containers only with borders, alignment, and whitespace."
    },
    compiledValue: "Keep every container card pure white; organize containers with borders, alignment, spacing, and group headings"
  },
  "key-regions": {
    label: {
      zh: "\u5173\u952E\u533A\u57DF\u6D45\u5E95",
      en: "Pale key regions"
    },
    shortDescription: {
      zh: "\u53EA\u4E3A\u89C6\u89C9\u7126\u70B9\u4F7F\u7528\u6781\u6D45\u8BED\u4E49\u5E95\u8272\u3002",
      en: "Use extremely pale semantic tints only at the visual focus."
    },
    compiledValue: "Use extremely pale semantic tints only for key regions, intermediate states, or the core operator; keep all other container cards white"
  },
  "semantic-regions": {
    label: {
      zh: "\u6309\u8BED\u4E49\u533A\u57DF\u6D45\u5E95",
      en: "Pale semantic regions"
    },
    shortDescription: {
      zh: "\u4EE5\u6781\u6D45\u5E95\u8272\u533A\u5206\u5C11\u91CF\u771F\u5B9E\u8BED\u4E49\u533A\u57DF\u3002",
      en: "Separate a few real semantic regions with extremely pale tints."
    },
    compiledValue: "Use extremely pale tints to distinguish a small number of real semantic regions; keep identical roles consistent and ordinary containers white"
  }
};
var FIGURE_CARD_FILL_POLICY_IDS = Object.keys(
  FIGURE_CARD_FILL_POLICIES
);
function buildVisualConfiguration(preferences) {
  const selectedAspectRatio = getFigureAspectRatio(preferences);
  const palette = FIGURE_COLOR_PALETTES[preferences.paletteId];
  const fontFamily = FIGURE_FONT_FAMILIES[preferences.fontFamilyId];
  const accentRange = FIGURE_ACCENT_COLOR_RANGES[preferences.accentColorRangeId];
  const cardFillPolicy = FIGURE_CARD_FILL_POLICIES[preferences.cardFillPolicyId];
  const candidateColors = palette.colors.slice(0, accentRange.max).join(", ");
  const linePolicy = preferences.lineColorMode === "semantic" ? "Dark-neutral structural lines by default; accent-colored lines only for a small number of clearly defined information streams" : "One dark-neutral color for borders, arrows, and connectors; distinguish semantics with shape, line style, or direct labels";
  const iconPolicy = preferences.allowLightIllustrations ? "Allow restrained, paper-specific scientific forms and semantic icons; no character cartoons, mascots, or promotional imagery" : "No decorative or pictorial icons; scientific representations such as tokens, matrices, masks, graphs, feature maps, gates, selectors, traces, and state diagrams remain allowed";
  const typeHierarchy = preferences.fontSizeLevels === 2 ? "Two levels at 1.00 : 1.30 for labels/body and headings" : "Three levels at 1.00 : 1.22 : 1.50 for labels, subheadings, and main headings";
  const titlePolicy = preferences.includeLargeTitle ? "Allow one short in-figure title using only terminology from the paper" : "No large in-figure title; retain only necessary panel headings, stage labels, or mechanism names";
  return `# User-Selected Visual Configuration

Treat the following settings as the authoritative rendering configuration for this figure.

- Export aspect ratio: ${selectedAspectRatio}
- Canvas background: pure white
- Accent palette: ${palette.label.en}; candidate accents ${candidateColors}
- Preferred prose typeface: ${fontFamily.label}
- Structural line policy: ${linePolicy}
- Allowed accent-color range: ${accentRange.label}; this is a maximum semantic budget, not a target
- Technical illustrations and icons: ${iconPolicy}
- Container-card fill policy: ${cardFillPolicy.compiledValue}
- Type hierarchy: ${typeHierarchy}
- Large in-figure title: ${titlePolicy}

Interpret these settings as follows:

1. The aspect ratio is a hard layout constraint. Compose directly for this ratio and do not describe a different ratio elsewhere.

2. The allowed accent-color range is a maximum semantic budget, not a requirement to use every available color. Use the smallest sufficient number.

3. \u201CNo icons\u201D forbids decorative or pictorial icons, but it does not forbid scientific visual representations such as token stacks, matrices, masks, graphs, feature maps, nested bands, gates, selectors, traces, or state diagrams.

4. \u201CPure-white cards\u201D applies to container cards. It does not require every scientific object, representation band, token, matrix cell, or semantic marker to be white.

5. When pale card fills are enabled, use only extremely light semantic tints. Never use gradients, shadows, dark cards, glow, glass effects, or 3D.

6. Use the selected prose typeface for ordinary labels. Mathematical expressions may use a compatible clean mathematical typeface when necessary to preserve correct notation.

7. Structural lines should normally remain dark neutral. When semantic line differentiation is enabled, use colored lines only for a small number of clearly defined information streams; do not create rainbow arrows.

8. When a large in-figure title is disabled, retain only necessary panel headings, stage labels, or mechanism names.

9. Every label must remain legible at the selected canvas ratio. Remove or reflow secondary content rather than shrinking it into microtext.`;
}
function buildFigurePrompt(promptId, preferences, language, options = {}) {
  return [
    COMMON_BASE[language],
    FIGURE_TYPE_ADAPTERS[promptId][language],
    buildVisualConfiguration(preferences),
    OUTPUT_PROTOCOL[language](options.outputFileName)
  ].join("\n\n");
}
function buildFrameworkFigureReconstructionPrompt(language, layout = {
  aspectRatioId: RECONSTRUCTION_OVERVIEW_FIGURE_PREFERENCES.aspectRatioId,
  customAspectWidth: RECONSTRUCTION_OVERVIEW_FIGURE_PREFERENCES.customAspectWidth,
  customAspectHeight: RECONSTRUCTION_OVERVIEW_FIGURE_PREFERENCES.customAspectHeight
}) {
  return buildFigurePrompt(
    "method-overview",
    {
      ...RECONSTRUCTION_OVERVIEW_FIGURE_PREFERENCES,
      ...layout
    },
    language,
    {
      outputFileName: "<base_name>_round_4_framework_reconstruction.png"
    }
  );
}

// content/prompts/templates.ts
var COMMON_PROMPT_BLOCKS = {
  evidence: {
    zh: `1. \u8BBA\u6587\u4E8B\u5B9E\u53EA\u80FD\u6765\u81EA\u5F53\u524D .tex\u3001PDF \u4E2D\u53EF\u76F4\u63A5\u8BFB\u53D6\u7684\u5185\u5BB9\u3001\u5F53\u524D .bib\uFF0C\u4EE5\u53CA\u53EF\u9760\u5916\u90E8\u6765\u6E90\u652F\u6301\u7684\u7814\u7A76\u80CC\u666F\u3002
2. \u8054\u7F51\u8D44\u6599\u53EA\u80FD\u6838\u9A8C\u80CC\u666F\u3001\u672F\u8BED\u3001\u7814\u7A76\u7F3A\u53E3\u3001\u76F8\u5173\u5DE5\u4F5C\u548C venue \u4FE1\u606F\uFF0C\u4E0D\u80FD\u66FF\u4EE3\u8BBA\u6587\u6750\u6599\u63A8\u65AD\u65B9\u6CD5\u3001\u5B9E\u9A8C\u8BBE\u7F6E\u3001\u6570\u636E\u6216\u7ED3\u679C\u3002
3. \u4E0D\u5F97\u675C\u64B0\u6570\u636E\u96C6\u3001\u5212\u5206\u3001\u6307\u6807\u3001\u968F\u673A\u79CD\u5B50\u3001\u786C\u4EF6\u3001\u8D85\u53C2\u6570\u3001\u8FD0\u884C\u6B21\u6570\u3001\u663E\u8457\u6027\u3001\u6A21\u5757\u3001\u516C\u5F0F\u3001\u7ED3\u679C\u3001\u6027\u80FD\u63D0\u5347\u6216\u5931\u8D25\u6848\u4F8B\u3002
4. TeX\u3001PDF\u3001\u56FE\u8868\u6216\u6B63\u6587\u6570\u5B57\u51B2\u7A81\u65F6\uFF0C\u4E0D\u5F97\u81EA\u884C\u6311\u9009\u3002\u8BB0\u5F55\u4F4D\u7F6E\u4E0E\u98CE\u9669\uFF0C\u5E76\u91C7\u7528\u8BC1\u636E\u6700\u76F4\u63A5\u3001\u98CE\u9669\u6700\u4F4E\u7684\u5904\u7406\uFF1B\u65E0\u6CD5\u5224\u65AD\u65F6\u5220\u9664\u6216\u5F31\u5316\u7ED3\u8BBA\u3002
5. \u4E0D\u5F97\u628A\u76F8\u5173\u6027\u5199\u6210\u56E0\u679C\uFF0C\u628A\u5355\u4E00\u8BBE\u7F6E\u4E0B\u7684\u89C2\u5BDF\u5199\u6210\u666E\u9002\u89C4\u5F8B\uFF0C\u6216\u628A\u672A\u7ECF\u9A8C\u8BC1\u7684\u89E3\u91CA\u5199\u6210\u65E2\u5B9A\u673A\u5236\u3002
6. \u7981\u6B62\u5BA3\u4F20\u6027\u8868\u8FF0\u3002\u53EA\u6709\u8BC1\u636E\u5145\u5206\u65F6\u624D\u4F7F\u7528\u5177\u4F53\u3001\u514B\u5236\u3001\u53EF\u6838\u9A8C\u7684\u6BD4\u8F83\u8BED\u8A00\u3002
7. \u6700\u7EC8\u8BBA\u6587\u4E0D\u5F97\u9057\u7559 TODO\u3001TBD\u3001\u865A\u6784\u5F15\u7528\u952E\u3001\u672A\u89E3\u91CA\u5360\u4F4D\u7B26\u6216\u7B49\u5F85\u4F5C\u8005\u8865\u5145\u7684\u4F2A\u6B63\u6587\u3002`,
    en: `1. Manuscript facts may come only from the current .tex, directly inspectable PDF content, the current .bib, and research background supported by reliable external sources.
2. Web research may verify background, terminology, gaps, related work, and venue information. It must not replace manuscript evidence for methods, settings, data, or results.
3. Do not invent datasets, splits, metrics, seeds, hardware, hyperparameters, run counts, significance, modules, equations, results, gains, or failure cases.
4. When TeX, PDF, figures, tables, or prose disagree, do not choose a value arbitrarily. Record the location and risk, then use the most directly supported low-risk treatment. Remove or qualify a claim when the conflict cannot be resolved.
5. Do not turn correlation into causation, a single-setting observation into a general law, or an untested explanation into a confirmed mechanism.
6. Avoid promotional language. Use concrete, restrained, verifiable comparisons only when evidence supports them.
7. The final manuscript must not contain TODO, TBD, invented citation keys, unexplained placeholders, or pseudo-prose awaiting author input.`
  },
  manuscriptProtection: {
    zh: `1. \u6CBF\u7528\u5F53\u524D .tex \u7684\u6587\u6863\u7C7B\u3001\u5B8F\u5305\u3001\u53C2\u8003\u6587\u732E\u6837\u5F0F\u3001\u5355\u53CC\u680F\u3001\u4F5C\u8005\u4FE1\u606F\u3001\u81EA\u5B9A\u4E49\u547D\u4EE4\u3001\u56FE\u50CF\u8DEF\u5F84\u548C\u7F16\u8BD1\u4F53\u7CFB\u3002
2. \u53EA\u6709\u660E\u786E\u7F16\u8BD1\u9519\u8BEF\u3001\u91CD\u590D label\u3001\u5931\u6548\u5F15\u7528\u6216\u8BED\u6CD5\u9519\u8BEF\u624D\u5141\u8BB8\u505A\u6700\u5C0F\u683C\u5F0F\u4FEE\u590D\uFF0C\u5E76\u5728\u62A5\u544A\u4E2D\u8BF4\u660E\u3002
3. \u5C3D\u91CF\u4FDD\u7559\u73B0\u6709 label\u3001ref\u3001cite\u3001\u516C\u5F0F\u7F16\u53F7\u548C\u7B97\u6CD5\u6807\u7B7E\uFF1B\u79FB\u52A8\u5185\u5BB9\u65F6\u540C\u6B65\u7EF4\u62A4\u4EA4\u53C9\u5F15\u7528\u3002
4. \u4E0D\u5F97\u5220\u9664 PDF \u4E2D\u771F\u5B9E\u5B58\u5728\u4E14\u627F\u62C5\u8BC1\u636E\u4F5C\u7528\u7684\u56FE\u8868\u3002\u9664\u72EC\u7ACB\u7684\u201C\u91CD\u6784\u65B9\u6CD5\u603B\u89C8\u6846\u67B6\u56FE\u201D\u6B65\u9AA4\u660E\u786E\u8981\u6C42\u3001\u4E14\u5B8C\u5168\u57FA\u4E8E\u8BBA\u6587\u4E8B\u5B9E\u751F\u6210\u7684 PNG \u5916\uFF0C\u4E0D\u5F97\u751F\u6210\u3001\u865A\u6784\u6216\u66FF\u6362\u56FE\u50CF\u6587\u4EF6\u3002
5. \u6700\u7EC8\u8F93\u51FA\u5FC5\u987B\u662F\u5B8C\u6574\u3001\u8FDE\u7EED\u3001\u53EF\u7EE7\u7EED\u7F16\u8F91\u7684\u82F1\u6587 .tex\uFF0C\u800C\u4E0D\u662F diff\u3001\u7247\u6BB5\u6216\u5408\u5E76\u5EFA\u8BAE\u3002
6. \u4E2D\u6587\u5206\u6790\u3001\u95EE\u9898\u4E0E\u4FEE\u6539\u8BF4\u660E\u53EA\u653E\u5728\u4E2D\u6587\u62A5\u544A\u4E2D\uFF0C\u4E0D\u5F97\u6DF7\u5165 TeX\u3002`,
    en: `1. Preserve the current .tex document class, packages, bibliography style, column layout, author block, custom commands, image paths, and compilation system.
2. Make only minimal format repairs for confirmed compilation errors, duplicate labels, broken references, or syntax errors, and document every repair.
3. Preserve labels, refs, cites, equation numbers, and algorithm identifiers where possible. Maintain cross-references whenever content moves.
4. Do not remove figures or tables that exist in the PDF and serve an evidentiary role. Except for the PNG explicitly required by the separate \u201CReconstruct the Method Overview Figure\u201D step and generated entirely from manuscript facts, do not generate, invent, or replace image files.
5. The final output must be a complete, continuous, editable English .tex file, not a diff, excerpt, or merge instructions.
6. Keep Chinese analysis, open questions, and revision notes in the Chinese report, never inside the TeX.`
  },
  pdfReview: {
    zh: `\u5B8C\u6574\u9605\u8BFB PDF\uFF0C\u5E76\u7528\u9875\u9762\u622A\u56FE\u6216\u7B49\u4EF7\u89C6\u89C9\u65B9\u5F0F\u68C0\u67E5\u6240\u6709\u6846\u67B6\u56FE\u3001\u673A\u5236\u56FE\u3001\u5B9E\u9A8C\u56FE\u3001\u6848\u4F8B\u56FE\u3001\u8868\u683C\u4E0E\u516C\u5F0F\u7248\u5F0F\u3002\u5BF9\u56FE\u68C0\u67E5\u6A21\u5757\u3001\u7BAD\u5934\u3001\u8F93\u5165\u8F93\u51FA\u3001\u56FE\u4F8B\u3001caption \u548C\u6B63\u6587\u5F15\u7528\uFF1B\u5BF9\u8868\u68C0\u67E5\u884C\u5217\u542B\u4E49\u3001\u6307\u6807\u65B9\u5411\u3001\u6807\u8BB0\u3001\u5355\u4F4D\u3001\u5747\u503C/\u6807\u51C6\u5DEE\u548C\u6B63\u6587\u6570\u5B57\u3002\u82E5 TeX \u4E0E PDF \u4E0D\u4E00\u81F4\uFF0C\u5728\u62A5\u544A\u4E2D\u7ED9\u51FA\u9875\u7801\u3001\u7F16\u53F7\u548C\u51B2\u7A81\u5185\u5BB9\u3002`,
    en: `Read the complete PDF and visually inspect every framework diagram, mechanism figure, result plot, case figure, table, and rendered equation using page images or an equivalent visual method. For figures, check components, arrows, inputs, outputs, legends, captions, and prose references. For tables, check row and column meanings, metric direction, emphasis marks, units, mean/standard deviation notation, and numbers cited in prose. Report page numbers, identifiers, and exact conflicts whenever TeX and PDF disagree.`
  },
  citationAndWeb: {
    zh: `1. \u5199\u4F5C\u524D\u63D0\u53D6\u5F53\u524D .bib \u7684\u5168\u90E8 BibTeX key\uFF0C\u5E76\u5B8C\u6574\u4FDD\u7559\u73B0\u6709\u6761\u76EE\uFF1B\u6700\u7EC8 TeX \u4E2D\u6BCF\u4E2A cite key \u90FD\u5FC5\u987B\u771F\u5B9E\u5B58\u5728\u4E8E\u672C\u8F6E\u8F93\u51FA\u7684\u5B8C\u6574 .bib\u3002
2. \u672C\u8F6E\u8F93\u51FA\u7684 .bib \u5FC5\u987B\u662F\u4E00\u4EFD\u53EF\u76F4\u63A5\u4F9B\u4E0B\u4E00\u8F6E\u548C\u7F16\u8BD1\u7EE7\u7EED\u4F7F\u7528\u7684\u5B8C\u6574\u5F53\u524D\u6587\u732E\u5E93\uFF0C\u4E0D\u5F97\u53EA\u8F93\u51FA\u589E\u91CF\u5EFA\u8BAE\u3002\u4EC5\u8FFD\u52A0\u5DF2\u6838\u9A8C\u4E14\u4E0D\u91CD\u590D\u7684\u65B0\u6761\u76EE\uFF1B\u82E5 TeX \u5F15\u7528\u65B0\u589E\u6587\u732E\uFF0C\u5176\u51C6\u786E\u6761\u76EE\u5FC5\u987B\u540C\u65F6\u5199\u5165\u8BE5\u5B8C\u6574 .bib\u3002
3. \u6280\u672F\u4E8B\u5B9E\u4F18\u5148\u6838\u9A8C\u539F\u8BBA\u6587\u3001\u5B98\u65B9\u8BBA\u6587\u9875\u3001\u51FA\u7248\u793E\u9875\u9762\u3001DBLP\u3001Crossref \u6216\u4F5C\u8005\u516C\u5F00\u7248\u672C\u3002
4. \u4F18\u5148\u8FD1\u4E09\u5E74\u76F4\u63A5\u76F8\u5173\u5DE5\u4F5C\uFF0C\u540C\u65F6\u4FDD\u7559\u5FC5\u8981\u7684\u5960\u57FA\u6587\u732E\uFF1B\u4E0D\u5F97\u7528\u4EC5\u5173\u952E\u8BCD\u76F8\u4F3C\u7684\u6587\u732E\u51D1\u6570\u3002
5. \u6BCF\u6761\u65B0\u589E\u6587\u732E\u90FD\u8981\u5728\u62A5\u544A\u4E2D\u8BF4\u660E\u652F\u6301\u7684\u5177\u4F53\u8BBA\u70B9\u3001\u4F7F\u7528\u4F4D\u7F6E\u3001\u4E0E\u539F\u6709 .bib \u662F\u5426\u91CD\u590D\u53CA\u52A0\u5165\u7406\u7531\u3002
6. \u6838\u9A8C\u6807\u9898\u3001\u4F5C\u8005\u3001\u5E74\u4EFD\u3001venue\u3001DOI \u6216\u5B98\u65B9 URL\uFF1B\u65E0\u6CD5\u786E\u8BA4\u7684\u5B57\u6BB5\u5B81\u7F3A\u6BCB\u6EE5\u3002\u9664\u4FEE\u6B63\u5DF2\u6838\u5B9E\u7684\u9519\u8BEF\u5916\uFF0C\u4E0D\u5F97\u6539\u5199\u73B0\u6709\u6761\u76EE\uFF1B\u4EFB\u4F55\u4FEE\u6B63\u90FD\u5FC5\u987B\u5728\u62A5\u544A\u4E2D\u8BB0\u5F55\u3002`,
    en: `1. Extract every BibTeX key from the current .bib before drafting and preserve all existing entries. Every cite key in the final TeX must exist in the complete .bib delivered for this round.
2. The delivered .bib must be a complete current library that the next round and compiler can use directly, never a delta-only suggestions file. Append only verified, non-duplicate additions. If the TeX cites a newly found work, include its exact verified entry in that complete .bib.
3. Prefer original papers, official proceedings pages, publisher pages, DBLP, Crossref, or author-hosted versions for technical facts.
4. Prioritize directly relevant work from the last three years while retaining necessary foundations. Do not pad the bibliography with keyword-only matches.
5. For each addition, state in the report the exact claim it supports, where it is used, whether it duplicates the input .bib, and why it was added.
6. Verify title, authors, year, venue, DOI, or official URL. Omit uncertain fields instead of guessing. Do not rewrite existing entries except to correct a verified error, and document every correction in the report.`
  }
};
var PROMPT_TEMPLATES = [
  {
    id: "scientific-positioning",
    sourceFile: "Round_1_Scientific_Positioning_and_Structure.md",
    number: 1,
    profile: "manuscript",
    title: {
      zh: "\u79D1\u5B66\u5B9A\u4F4D\u4E0E\u7ED3\u6784\u91CD\u6784",
      en: "Scientific Positioning & Structure"
    },
    purpose: {
      zh: "\u786E\u5B9A\u6807\u9898\u4E0E\u8BBA\u6587\u54C1\u724C\u7F29\u5199\uFF0C\u5E76\u5EFA\u7ACB\u552F\u4E00\u79D1\u5B66\u4E3B\u7EBF\u3001\u672F\u8BED\u4F53\u7CFB\u3001Claim\u2013Evidence Map \u548C\u7AE0\u8282\u5206\u5DE5\u3002",
      en: "Determine the title and paper brand acronym, then establish one scientific throughline, a stable terminology system, a claim\u2013evidence map, and clear section responsibilities."
    },
    role: {
      zh: "\u4F60\u662F\u4E00\u540D\u719F\u6089\u8BA1\u7B97\u673A\u79D1\u5B66\u9876\u7EA7\u4F1A\u8BAE\u4E0E\u9AD8\u6C34\u5E73\u671F\u520A\u8BC4\u5BA1\u7684\u8D44\u6DF1\u7814\u7A76\u8005\u3002\u672C\u8F6E\u662F\u5B8F\u89C2\u91CD\u6784\u8F6E\uFF1A\u628A\u521D\u7A3F\u91CD\u5EFA\u4E3A\u79D1\u5B66\u95EE\u9898\u6E05\u6670\u3001\u672F\u8BED\u7EDF\u4E00\u3001\u7AE0\u8282\u5206\u5DE5\u5408\u7406\u3001\u8BC1\u636E\u94FE\u5B8C\u6574\u7684\u8BBA\u6587\u3002",
      en: "You are a senior researcher familiar with leading computer-science conferences and journals. This is the macro-reconstruction round: rebuild the draft around a clear scientific problem, stable terminology, distinct section functions, and a complete evidence chain."
    },
    inputs: {
      zh: `- \u5F53\u524D\u6700\u65B0\u5B8C\u6574 .tex
- \u4E0E\u5176\u4E00\u81F4\u7684 PDF
- \u5F53\u524D\u5B8C\u6574 .bib
- \u4EC5\u5728\u6CA1\u6709\u5B8C\u6574 PDF \u65F6\uFF1A\u652F\u6491\u6B63\u6587\u8BC1\u636E\u6240\u5FC5\u9700\u7684\u56FE\u50CF\u6587\u4EF6`,
      en: `- The current latest complete .tex
- Its matching PDF
- The current complete .bib
- Only when no complete PDF exists: image files necessary to recover manuscript evidence`
    },
    scope: {
      zh: "\u5141\u8BB8\u91CD\u6392\u7AE0\u8282\u548C\u6BB5\u843D\u3001\u5408\u5E76\u91CD\u590D\u5185\u5BB9\u3001\u91CD\u5199\u7AE0\u8282\u5F00\u5934\u4E0E\u4E3B\u9898\u53E5\u3001\u91CD\u6784\u8D21\u732E\u3001\u8C03\u6574 Method \u4E0E Experiments \u7684\u5206\u5DE5\u5E76\u5EFA\u7ACB\u5FC5\u8981\u7684 Discussion\u3002\u4E0D\u5F97\u6539\u53D8\u6A21\u677F\u6216\u6DFB\u52A0\u6750\u6599\u4E0D\u652F\u6301\u7684\u673A\u5236\u4E0E\u5B9E\u9A8C\u3002",
      en: "You may reorder sections and paragraphs, merge repetition, rewrite section openings and topic sentences, rebuild the contribution statement, clarify the division between Method and Experiments, and create a necessary Discussion. Do not change the template or add unsupported mechanisms or experiments."
    },
    styleBranches: {
      conference: {
        zh: "\u4F1A\u8BAE\u8BBA\u6587\uFF1A\u9700\u8981\u7B2C\u4E09\u5C42\u6807\u9898\u65F6\u4F7F\u7528 paragraph \u800C\u975E subsubsection\uFF1Bparagraph \u53EA\u547D\u540D\u771F\u5B9E\u79D1\u5B66\u5355\u5143\uFF0C\u666E\u901A\u8BBA\u8FF0\u4F7F\u7528\u8FDE\u7EED\u6BB5\u843D\u3002Related Work \u6070\u597D\u4E09\u4E2A\u5355\u6BB5\u5C0F\u8282\uFF1BMethod \u4E0D\u5355\u8BBE Overview\uFF1BDiscussion and Limitations \u7531\u4E09\u4E2A\u8BA8\u8BBA\u5C0F\u8282\u548C\u4E00\u4E2A\u7EA6 100 \u8BCD\u7684 Limitations \u5C0F\u8282\u7EC4\u6210\u3002",
        en: "Conference paper: when a third-level heading is needed, use paragraph rather than subsubsection; reserve headings for genuine scientific units and develop ordinary exposition as continuous prose. Give Related Work exactly three one-paragraph subsections, omit a standalone Method Overview, and structure Discussion and Limitations as three discussion subsections plus an approximately 100-word Limitations subsection."
      },
      journal: {
        zh: "\u671F\u520A\u8BBA\u6587\uFF1A\u76EE\u5F55\u5C42\u7EA7\u9ED8\u8BA4\u6B62\u4E8E subsubsection\uFF0C\u5176\u4E0B\u4F7F\u7528\u4E3B\u9898\u53E5\u3001\u8FC7\u6E21\u548C\u81EA\u7136\u6BB5\uFF0C\u4E0D\u628A\u53D9\u8FF0\u529F\u80FD\u5199\u6210 paragraph \u6807\u9898\u3002Related Work \u6070\u597D\u4E09\u4E2A\u53CC\u6BB5\u5C0F\u8282\uFF1BMethod \u5355\u8BBE\u6070\u597D\u4E24\u6BB5\u4E14\u4E0D\u8D85\u8FC7 80 \u8BCD\u7684 Overview\uFF0C\u4E0D\u5F97\u590D\u8FF0\u6846\u67B6\u56FE\u3002",
        en: "Journal paper: stop the heading hierarchy at subsubsection by default, using topic sentences, transitions, and natural paragraphs below it rather than paragraph headings for discourse functions. Give Related Work exactly three two-paragraph subsections and use a standalone, exactly two-paragraph Method Overview capped at 80 words without narrating the framework figure."
      }
    },
    tasks: [
      {
        heading: {
          zh: "A. \u5EFA\u7ACB Scientific Positioning Contract",
          en: "A. Build the Scientific Positioning Contract"
        },
        body: {
          zh: `\u660E\u786E Task\u3001Scientific problem\u3001Current gap\u3001Core idea\u3001Computational realization\u30012\u20134 \u4E2A Primary claims\u3001\u6BCF\u4E2A claim \u7684\u8BC1\u636E\u4EE5\u53CA\u9002\u7528\u8FB9\u754C\u3002
\u6838\u5FC3\u601D\u60F3\u5FC5\u987B\u80FD\u8131\u79BB\u6A21\u5757\u540D\u6210\u7ACB\uFF1B\u4E0D\u5F97\u628A\u666E\u901A\u7EC4\u4EF6\u76F4\u63A5\u5305\u88C5\u6210\u79D1\u5B66\u8D21\u732E\u3002`,
          en: `Define the Task, Scientific problem, Current gap, Core idea, Computational realization, two to four Primary claims, evidence for each claim, and scope boundaries.
The core idea must remain meaningful without component names. Do not relabel ordinary modules as scientific contributions.`
        }
      },
      {
        heading: {
          zh: "B. \u786E\u5B9A\u6807\u9898\u4E0E\u8BBA\u6587\u54C1\u724C\u7F29\u5199",
          en: "B. Determine the Title and Paper Brand Acronym"
        },
        body: {
          zh: "\u5728\u5B8C\u6574\u7406\u89E3\u8BBA\u6587\u5E76\u7A33\u5B9A\u79D1\u5B66\u5B9A\u4F4D\u540E\uFF0C\u76F4\u63A5\u786E\u5B9A\u4E00\u4E2A\u6700\u7EC8\u82F1\u6587\u6807\u9898\u548C\u4E00\u4E2A 4\u20137 \u4E2A\u5B57\u6BCD\u7684\u8BBA\u6587\u54C1\u724C\u7F29\u5199\u5E76\u5199\u5165 TeX\u3002\u7F29\u5199\u987B\u4E0E\u65B9\u6CD5\u5168\u79F0\u548C\u6838\u5FC3\u601D\u60F3\u81EA\u7136\u5BF9\u5E94\u3001\u4FBF\u4E8E\u8BFB\u5199\u4E0E\u68C0\u7D22\uFF0C\u5E76\u6838\u67E5\u4E0E\u5F53\u524D .bib\u3001\u6700\u8FD1\u90BB\u5DE5\u4F5C\u53CA\u9886\u57DF\u5E38\u7528\u540D\u79F0\u7684\u660E\u663E\u51B2\u7A81\uFF1B\u4E0D\u63D0\u4F9B\u6807\u9898\u5019\u9009\u3002",
          en: "After understanding the full manuscript and stabilizing its scientific position, determine exactly one final English title and one 4\u20137-letter paper brand acronym, then write both into the TeX. The acronym must map naturally to the full method name and core idea, remain readable and searchable, and be checked for obvious conflicts with the current .bib, nearest-neighbor work, and common names in the field. Do not provide title candidates."
        }
      },
      {
        heading: {
          zh: "C. \u51BB\u7ED3\u552F\u4E00\u672F\u8BED\u4F53\u7CFB",
          en: "C. Freeze One Terminology System"
        },
        body: {
          zh: "\u786E\u5B9A\u65B9\u6CD5\u5168\u79F0\u4E0E\u4E0A\u8FF0\u8BBA\u6587\u54C1\u724C\u7F29\u5199\u3001\u95EE\u9898\u540D\u79F0\u3001\u8868\u793A\u3001\u6A21\u5757\u3001\u5206\u652F\u3001\u67E5\u8BE2\u3001\u635F\u5931\u3001\u8BAD\u7EC3/\u63A8\u7406\u3001\u6570\u636E\u96C6\u3001\u6307\u6807\u548C\u5B9E\u9A8C\u7C7B\u578B\u7684 canonical term\uFF1B\u5217\u51FA\u7981\u7528\u53D8\u4F53\u4E0E\u5FC5\u987B\u533A\u5206\u7684\u76F8\u8FD1\u6982\u5FF5\u3002",
          en: "Define canonical terms for the full method name and paper brand acronym, problem, representations, components, branches, queries, losses, training/inference, datasets, metrics, and experiment types. List prohibited variants and nearby concepts that must remain distinct."
        }
      },
      {
        heading: {
          zh: "D. \u91CD\u6784\u7AE0\u8282\u529F\u80FD\u4E0E\u8BBA\u8BC1\u987A\u5E8F",
          en: "D. Rebuild Section Functions and Argument Order"
        },
        body: {
          zh: "\u8BA9 Abstract \u6982\u62EC\u5B8C\u6574\u8BC1\u636E\u94FE\uFF1BIntroduction \u5B8C\u6210\u80CC\u666F\u3001\u7F3A\u53E3\u3001\u6311\u6218\u3001\u65B9\u6CD5\u6982\u89C8\u548C\u8D21\u732E\uFF1BRelated Work \u6309\u7814\u7A76\u8303\u5F0F\u4E0E\u6743\u8861\u7EFC\u5408\uFF1BMethod \u4ECE\u95EE\u9898\u5B9A\u4E49\u8FDB\u5165\u6838\u5FC3\u673A\u5236\uFF1BExperiments \u5148\u5199\u6570\u636E\u96C6\u4E0E\u5B9E\u9A8C\u8BBE\u7F6E\u3001\u518D\u5199\u4E3B\u7ED3\u679C\uFF0C\u540E\u7EED\u5C0F\u8282\u6309\u8BC1\u636E\u5B89\u6392\u6D88\u878D\u3001\u673A\u5236/\u6548\u7387/\u53C2\u6570\u3001\u6848\u4F8B\u4E0E\u5B9A\u6027\u7B49\u5206\u6790\uFF1BDiscussion \u89E3\u91CA\u673A\u5236\u3001\u8303\u56F4\u4E0E\u9650\u5236\u4E14\u4E0D\u91CD\u590D\u5B9E\u9A8C\u7ED3\u679C\uFF1BConclusion \u6536\u675F\u95EE\u9898\u3001\u8BC1\u636E\u548C\u8FB9\u754C\u3002",
          en: "Make the Abstract summarize the evidence chain; the Introduction establish background, gap, challenges, method overview, and contributions; Related Work synthesize paradigms and trade-offs; Method move from problem definition to core mechanisms; Experiments begin with datasets/setup and main results, then order ablations, mechanism/efficiency/parameter analyses, case studies, and qualitative analyses by evidence; Discussion interpret mechanisms, scope, and limitations without repeating results; and Conclusion close the problem, evidence, and boundaries."
        }
      },
      {
        heading: {
          zh: "E. \u91CD\u6784\u56FE\u8868\u89D2\u8272\u4E0E\u7AE0\u8282\u63A5\u53E3",
          en: "E. Rebuild Visual Roles and Section Interfaces"
        },
        body: {
          zh: "\u4E3A\u6BCF\u5F20\u6846\u67B6\u56FE\u3001\u673A\u5236\u56FE\u3001\u4E3B\u7ED3\u679C\u8868\u3001\u6D88\u878D\u8868\u548C\u6848\u4F8B\u56FE\u6307\u5B9A\u6240\u652F\u6301\u7684\u6838\u5FC3\u601D\u60F3\u6216 claim\u3002\u4F18\u5316 caption \u4E0E\u6B63\u6587\u89E3\u91CA\uFF0C\u4F7F\u56FE\u8868\u88AB\u89E3\u91CA\u800C\u4E0D\u53EA\u662F\u88AB\u63D0\u5230\uFF1B\u4E0D\u5F97\u91CD\u7ED8\u6216\u66FF\u6362\u6587\u4EF6\u3002",
          en: "Assign every framework figure, mechanism figure, main-results table, ablation table, and case visual to the core idea or claim it supports. Improve captions and prose so each visual is explained rather than merely mentioned. Do not redraw or replace files."
        }
      },
      {
        heading: {
          zh: "F. \u6838\u9A8C\u5B9A\u4F4D\u5E76\u5B8C\u6210\u5B8F\u89C2\u91CD\u5199",
          en: "F. Verify the Position and Perform the Macro Rewrite"
        },
        body: {
          zh: "\u8054\u7F51\u6838\u9A8C\u7814\u7A76\u7F3A\u53E3\u3001\u6700\u8FD1\u90BB\u5DE5\u4F5C\u548C\u8D21\u732E\u51B2\u7A81\u98CE\u9669\u3002\u5728\u5F53\u524D\u8BC1\u636E\u8303\u56F4\u5185\u5B8C\u6210\u5168\u7A3F\u5B8F\u89C2\u91CD\u5199\uFF1B\u8BED\u8A00\u53EF\u6682\u4E0D\u8FFD\u6C42\u6700\u7EC8\u7CBE\u4FEE\uFF0C\u4F46\u4E3B\u7EBF\u3001\u7ED3\u6784\u3001\u672F\u8BED\u548C\u8BBA\u8BC1\u987A\u5E8F\u5FC5\u987B\u7A33\u5B9A\u3002",
          en: "Use web research to verify the gap, nearest-neighbor work, and contribution-overlap risks. Complete the macro rewrite within the available evidence. Sentence-level polish may wait, but the throughline, architecture, terminology, and evidence order must be stable."
        }
      }
    ],
    deliverables: {
      zh: `\u751F\u6210\u5B8C\u6574\u82F1\u6587 .tex\u3001\u4E2D\u6587\u62A5\u544A\u548C\u5B8C\u6574\u5F53\u524D BibTeX \u6587\u732E\u5E93\u3002\u4E2D\u6587\u62A5\u544A\u81F3\u5C11\u5305\u542B\uFF1AScientific Positioning Contract\u3001\u6700\u7EC8\u6807\u9898\u4E0E\u8BBA\u6587\u54C1\u724C\u7F29\u5199\u53CA\u4F9D\u636E\u3001\u4E00\u53E5\u8BDD\u4E3B\u65E8\u4E0E\u75DB\u70B9\u3001\u65E7/\u65B0\u4E3B\u7EBF\u5BF9\u7167\u3001\u8D21\u732E\u5206\u5C42\u3001Claim\u2013Evidence Map\u3001\u6700\u7EC8\u672F\u8BED\u8868\u3001\u7AE0\u8282\u529F\u80FD\u4E0E\u9884\u7B97\u8868\u3001\u56FE\u8868\u89D2\u8272\u3001\u7ED3\u6784\u64CD\u4F5C\u6E05\u5355\u3001\u8054\u7F51\u6838\u9A8C\u3001\u65B0\u589E\u6216\u4FEE\u6B63\u6587\u732E\u8BB0\u5F55\u3001\u4F5C\u8005\u9700\u786E\u8BA4\u9879\u548C\u4E0B\u4E00\u6B65\u4EA4\u63A5\u6458\u8981\u3002`,
      en: `Create a complete English .tex, a Chinese report, and a complete current BibTeX library. The report must include the Scientific Positioning Contract, final title and paper brand acronym with rationale, one-sentence thesis and pain point, old/new throughline comparison, contribution hierarchy, Claim\u2013Evidence Map, final terminology table, section-function and budget table, visual roles, structural operation log, web verification, added or corrected bibliography records, author-confirmation items, and a self-contained handoff.`
    },
    fileNames: {
      zh: `<base_name>_round_1_scientific_structure.tex
<base_name>_round_1_report_zh.md
<base_name>_round_1_references.bib`,
      en: `<base_name>_round_1_scientific_structure.tex
<base_name>_round_1_report_zh.md
<base_name>_round_1_references.bib`
    },
    finalChecks: {
      zh: `- \u5168\u6587\u56F4\u7ED5\u4E00\u4E2A\u79D1\u5B66\u95EE\u9898\u548C\u6838\u5FC3\u601D\u60F3\u7EC4\u7EC7\u3002
- \u6BCF\u4E2A\u4E3B\u8981 claim \u90FD\u6709\u8BC1\u636E\u4F4D\u7F6E\u548C\u8FB9\u754C\u3002
- \u5DF2\u786E\u5B9A\u4E00\u4E2A\u6700\u7EC8\u6807\u9898\u548C\u4E00\u4E2A 4\u20137 \u4E2A\u5B57\u6BCD\u7684\u8BBA\u6587\u54C1\u724C\u7F29\u5199\u3002
- \u672F\u8BED\u3001\u7AE0\u8282\u529F\u80FD\u4E0E\u56FE\u8868\u89D2\u8272\u5DF2\u7A33\u5B9A\u3002
- \u672A\u6539\u53D8\u6A21\u677F\uFF0C\u672A\u6DFB\u52A0\u65E0\u8BC1\u636E\u5185\u5BB9\u3002
- \u5DF2\u6309\u5F53\u524D\u8BBA\u6587\u98CE\u683C\u4E0E\u9644\u5F55\u914D\u7F6E\u6267\u884C\u3002`,
      en: `- The manuscript is organized around one scientific problem and core idea.
- Every primary claim has an evidence location and boundary.
- One final title and one 4\u20137-letter paper brand acronym have been fixed.
- Terminology, section functions, and visual roles are stable.
- The template was preserved and no unsupported content was added.
- The current paper style and appendix configuration were followed.`
    }
  },
  {
    id: "method-experiments",
    sourceFile: "Round_2_Method_and_Experiments_Reconstruction.md",
    number: 2,
    profile: "manuscript",
    title: {
      zh: "\u65B9\u6CD5\u4E0E\u5B9E\u9A8C\u6DF1\u5EA6\u91CD\u6784",
      en: "Method & Experiments Reconstruction"
    },
    purpose: {
      zh: "\u8BA9\u65B9\u6CD5\u3001\u516C\u5F0F\u3001\u56FE\u793A\u4E0E\u5B9E\u9A8C\u5F62\u6210\u4E25\u683C\u7684 Claim\u2013Evidence Chain\u3002",
      en: "Align methods, equations, visuals, and experiments into a rigorous claim\u2013evidence chain."
    },
    role: {
      zh: "\u4F60\u662F\u4E00\u540D\u719F\u6089\u5F53\u524D\u8BBA\u6587\u5177\u4F53 CS \u5B50\u9886\u57DF\u7684\u65B9\u6CD5\u7814\u7A76\u8005\u4E0E\u5B9E\u9A8C\u5BA1\u7A3F\u4EBA\u3002\u4EE5\u7B2C\u4E00\u6B65\u7A33\u5B9A\u7684\u79D1\u5B66\u4E3B\u7EBF\u4E3A\u524D\u63D0\uFF0C\u6DF1\u5EA6\u91CD\u6784 Method \u4E0E Experiments\u3002",
      en: "You are a methods researcher and experimental reviewer familiar with the manuscript's CS subfield. Treat the Step 1 scientific throughline as stable and deeply reconstruct Method and Experiments."
    },
    inputs: {
      zh: `- \u6700\u65B0\u5B8C\u6574 .tex\uFF0C\u4F18\u5148\u4E3A\u7B2C\u4E00\u6B65\u8F93\u51FA
- \u5BF9\u5E94\u5B8C\u6574 PDF
- \u5F53\u524D\u5B8C\u6574 .bib`,
      en: `- The newest complete .tex, preferably the Step 1 output
- Its complete matching PDF
- The current complete .bib`
    },
    scope: {
      zh: "Method \u4E0E Experiments \u5141\u8BB8\u5927\u5E45\u91CD\u6784\u3002\u5176\u4ED6\u7AE0\u8282\u53EA\u4E3A\u672F\u8BED\u3001\u4E8B\u5B9E\u4E0E\u4EA4\u53C9\u5F15\u7528\u4E00\u81F4\u6027\u505A\u6700\u5C0F\u540C\u6B65\u3002\u6CA1\u6709\u8BC1\u636E\u7684\u5B9E\u73B0\u6216\u5B9E\u9A8C\u4FE1\u606F\u5FC5\u987B\u5220\u9664\u6216\u6807\u8BB0\u4E3A\u4F5C\u8005\u9700\u786E\u8BA4\u3002",
      en: "Method and Experiments may be substantially reconstructed. Make only minimal terminology, fact, and cross-reference updates elsewhere. Remove unsupported implementation or experimental details from the manuscript and flag them for author confirmation."
    },
    styleBranches: {
      conference: {
        zh: "\u4F1A\u8BAE\u8BBA\u6587\uFF1A\u9700\u8981\u7B2C\u4E09\u5C42\u6807\u9898\u65F6\u4F7F\u7528 paragraph \u800C\u975E subsubsection\uFF1Bparagraph \u53EA\u547D\u540D\u771F\u5B9E\u79D1\u5B66\u5355\u5143\uFF0C\u666E\u901A\u8BBA\u8FF0\u4F7F\u7528\u8FDE\u7EED\u6BB5\u843D\u3002Method \u4E0D\u5355\u8BBE Overview\uFF0C\u5728\u5408\u9002\u4F4D\u7F6E\u81EA\u7136\u5F15\u51FA\u603B\u4F53\u6846\u67B6\uFF1B\u5B9E\u9A8C\u8BBE\u7F6E\u5185\u7528 paragraph \u4F9D\u6B21\u7EC4\u7EC7 Datasets\u3001Experimental Configuration \u548C Baselines\u3002",
        en: "Conference paper: when a third-level heading is needed, use paragraph rather than subsubsection; reserve headings for genuine scientific units and develop ordinary exposition as continuous prose. Use no standalone Method Overview, introduce the framework naturally where it serves the story, and organize Datasets, Experimental Configuration, and Baselines with paragraph headings inside experimental setup."
      },
      journal: {
        zh: "\u671F\u520A\u8BBA\u6587\uFF1A\u76EE\u5F55\u5C42\u7EA7\u9ED8\u8BA4\u6B62\u4E8E subsubsection\uFF1B\u5176\u4E0B\u4F7F\u7528\u4E3B\u9898\u53E5\u3001\u8FC7\u6E21\u548C\u81EA\u7136\u6BB5\uFF0C\u4E0D\u628A Design Purpose\u3001Question\u3001Observation \u7B49\u53D9\u8FF0\u529F\u80FD\u5199\u6210 paragraph \u6807\u9898\u3002Method \u5355\u8BBE\u6070\u597D\u4E24\u6BB5\u3001\u603B\u8BA1\u4E0D\u8D85\u8FC7 80 \u8BCD\u7684 Overview\uFF0C\u89E3\u91CA\u79D1\u5B66\u903B\u8F91\u4F46\u4E0D\u590D\u8FF0\u6846\u67B6\u56FE\uFF1B\u5B9E\u9A8C\u8BBE\u7F6E\u5185\u7528 subsubsection \u4F9D\u6B21\u7EC4\u7EC7 Datasets\u3001Experimental Configuration \u548C Baselines\u3002",
        en: "Journal paper: stop the heading hierarchy at subsubsection by default; below it, use topic sentences, transitions, and natural paragraphs rather than paragraph headings such as Design Purpose, Question, or Observation. Method has a standalone Overview of exactly two paragraphs and at most 80 words that explains scientific logic without narrating the figure. Inside experimental setup, use subsubsections for Datasets, Experimental Configuration, and Baselines in that order."
      }
    },
    tasks: [
      {
        heading: {
          zh: "A. \u91CD\u6784 Method \u903B\u8F91",
          en: "A. Reconstruct the Method Logic"
        },
        body: {
          zh: `Method \u4E0D\u5F97\u5199\u6210\u8BF4\u660E\u4E66\u3001\u4EE3\u7801\u6587\u6863\u6216\u64CD\u4F5C\u6E05\u5355\u3002\u56F4\u7ED5\u201C\u95EE\u9898\u4E3A\u4EC0\u4E48\u96BE \u2192 \u73B0\u6709\u8BBE\u8BA1\u4E3A\u4EC0\u4E48\u4E0D\u8DB3 \u2192 \u4E3A\u4EC0\u4E48\u9700\u8981\u5F53\u524D\u673A\u5236 \u2192 \u673A\u5236\u5982\u4F55\u56DE\u5E94\u95EE\u9898 \u2192 \u9002\u7528\u8FB9\u754C\u201D\u5F62\u6210\u878D\u5408\u6027\u7684\u79D1\u5B66\u6545\u4E8B\uFF1B\u4E0D\u8981\u6C42\u6BCF\u53E5\u8BDD\u673A\u68B0\u89E3\u91CA why\u3002
\u6309\u5F53\u524D\u8BBA\u6587\u7C7B\u578B\u89C4\u5B9A\u5904\u7406 Overview\uFF0C\u518D\u8FDB\u5165\u6838\u5FC3\u673A\u5236\u3001\u76EE\u6807/\u8BAD\u7EC3\u4E0E\u63A8\u7406/\u590D\u6742\u5EA6\uFF1B\u6BCF\u4E2A\u673A\u5236\u81EA\u7136\u878D\u5408\u8BBE\u8BA1\u52A8\u673A\u3001\u8BA1\u7B97\u6784\u9020\u3001\u7EC4\u4EF6\u63A5\u53E3\u3001\u4F5C\u7528\u4E0E\u8FB9\u754C\u3002`,
          en: `Method must not read like a manual, code document, or procedural checklist. Build an integrated scientific story around why the problem is difficult, why existing designs fall short, why the mechanism is needed, how it addresses the problem, and where it applies; do not force every sentence to state a why.
Follow the current paper type's Overview rule before moving through core mechanisms, objective/training, and inference/complexity. Integrate motivation, construction, interfaces, function, and boundaries naturally for each mechanism.`
        }
      },
      {
        heading: {
          zh: "B. \u5BA1\u8BA1\u516C\u5F0F\u3001\u7B97\u6CD5\u4E0E\u73B0\u6709\u56FE\u8868\u63A5\u53E3",
          en: "B. Audit Equations, Algorithms, and Existing Visual Interfaces"
        },
        body: {
          zh: "\u786E\u4FDD\u7B26\u53F7\u5728\u4F7F\u7528\u524D\u5B9A\u4E49\uFF0C\u516C\u5F0F\u6709\u524D\u7F6E\u52A8\u673A\u548C\u540E\u7EED\u89E3\u91CA\uFF0C\u4E0B\u6807\u3001\u7EF4\u5EA6\u3001\u5F52\u4E00\u5316\u3001mask \u548C\u635F\u5931\u6743\u91CD\u4E00\u81F4\uFF0C\u5173\u952E\u516C\u5F0F\u88AB\u6B63\u6587\u5F15\u7528\u3002\u540C\u6B65\u6838\u5BF9\u73B0\u6709\u6846\u67B6\u56FE\u4E0E\u673A\u5236\u56FE\u7684\u8F93\u5165\u3001\u8F93\u51FA\u3001\u7EC4\u4EF6\u3001\u7BAD\u5934\u3001\u8BAD\u7EC3/\u63A8\u7406\u8DEF\u5F84\u548C\u672F\u8BED\uFF0C\u4F46\u672C\u6B65\u4E0D\u751F\u6210\u6216\u66FF\u6362\u56FE\u7247\uFF1B\u65B9\u6CD5\u903B\u8F91\u548C\u524D\u540E\u53D9\u4E8B\u7A33\u5B9A\u540E\uFF0C\u7531\u72EC\u7ACB\u7684\u6846\u67B6\u56FE\u6B65\u9AA4\u7EDF\u4E00\u91CD\u6784\u3002",
          en: "Define notation before use; motivate equations before they appear and explain their role afterward; verify indices, dimensions, normalization, masks, and loss weights; and cite every key equation in prose. Audit the inputs, outputs, components, arrows, training/inference paths, and terminology of existing framework and mechanism figures, but do not generate or replace an image in this step. The separate framework-figure step handles reconstruction after the Method logic and surrounding narrative are stable."
        }
      },
      {
        heading: {
          zh: "C. \u5EFA\u7ACB Experiment Question\u2013Evidence Matrix",
          en: "C. Build the Experiment Question\u2013Evidence Matrix"
        },
        body: {
          zh: "\u5728\u4E2D\u6587\u62A5\u544A\u4E2D\uFF0C\u4E3A\u6BCF\u9879\u5B9E\u9A8C\u5199\u660E\u8981\u56DE\u7B54\u7684\u95EE\u9898\u3001\u4F7F\u7528\u7684\u6570\u636E\u4E0E\u8BBE\u7F6E\u3001\u6307\u6807\u3001\u6BD4\u8F83\u5BF9\u8C61\u3001\u56FE\u8868\u8BC1\u636E\u3001\u6240\u652F\u6301\u7684 claim\u3001\u8BC1\u636E\u5F3A\u5EA6\u548C\u4E0D\u80FD\u63A8\u51FA\u7684\u7ED3\u8BBA\u3002\u77E9\u9635\u53EA\u7528\u4E8E\u89C4\u5212\u4E0E\u5BA1\u8BA1\uFF0C\u5176\u5217\u540D\u4E0D\u5F97\u6210\u4E3A TeX \u4E2D\u91CD\u590D\u7684\u5C0F\u6807\u9898\u6216\u53E5\u9996\u6807\u7B7E\u3002\u5B9E\u9A8C\u987A\u5E8F\u4ECE\u603B\u4F53\u6709\u6548\u6027\u8FDB\u5165\u673A\u5236\u3001\u8FB9\u754C\u4E0E\u89E3\u91CA\u3002",
          en: "In the Chinese report, record the question, data and setup, metric, comparison, visual evidence, supported claim, evidence strength, and conclusions that cannot be drawn for every experiment. Use the matrix only for planning and audit; never turn its column labels into repeated TeX headings or sentence prefixes. Order experiments from overall effectiveness to mechanisms, boundaries, and interpretation."
        }
      },
      {
        heading: {
          zh: "D. \u91CD\u5199\u5B9E\u9A8C\u8BBE\u7F6E\u3001\u4E3B\u7ED3\u679C\u4E0E\u8BC1\u636E\u9A71\u52A8\u5206\u6790",
          en: "D. Rewrite Setup, Main Results, and Evidence-driven Analyses"
        },
        body: {
          zh: `\u7B2C\u4E00\u4E2A\u5C0F\u8282\u56FA\u5B9A\u4E3A Datasets and Experimental Setup\uFF0C\u5185\u90E8\u5FC5\u987B\u4F9D\u6B21\u8986\u76D6 Datasets\u3001Experimental Configuration\uFF08\u670D\u52A1\u5668/\u786C\u4EF6\u3001\u8D85\u53C2\u6570\u7B49\uFF09\u548C Baselines\uFF1B\u7B2C\u4E8C\u4E2A\u5C0F\u8282\u56FA\u5B9A\u4E3A Main Results\u3002\u540E\u7EED\u4E0D\u7ED1\u5B9A\u7B2C\u4E09\u6216\u7B2C\u56DB\u7684\u56FA\u5B9A\u5E8F\u53F7\uFF0C\u6309\u771F\u5B9E\u8BC1\u636E\u7EC4\u7EC7 Ablation Studies\u3001\u673A\u5236/\u6548\u7387/\u53C2\u6570\u3001Case Studies and Qualitative Analysis \u7B49\u5206\u6790\u3002
\u6BCF\u4E2A\u5B9E\u9A8C\u5C0F\u8282\u6574\u4F53\u5E94\u4EA4\u4EE3\u6240\u68C0\u9A8C\u7684\u4E0D\u786E\u5B9A\u6027\u3001\u51B3\u5B9A\u6027\u8BC1\u636E\u3001\u5408\u7406\u89E3\u91CA\u3001\u4E0E claim \u7684\u5173\u7CFB\u548C\u8BC1\u636E\u8FB9\u754C\uFF0C\u5E76\u6839\u636E\u6750\u6599\u81EA\u7136\u5206\u5E03\u5728\u8FDE\u7EED\u6BB5\u843D\u4E2D\uFF1B\u5C0F\u6807\u9898\u547D\u540D\u5B9E\u9A8C\u3001\u53D8\u91CF\u6216\u73B0\u8C61\uFF0C\u800C\u4E0D\u91CD\u590D Question\u3001Observation\u3001Interpretation \u7B49\u53D9\u8FF0\u529F\u80FD\u3002\u4E0D\u9010\u5355\u5143\u683C\u6717\u8BFB\u3002\u6BCF\u9879\u6D88\u878D\u5FC5\u987B\u5BF9\u5E94\u660E\u786E\u8BBE\u8BA1\u95EE\u9898\uFF0C\u4E0D\u628A\u666E\u901A\u6CE2\u52A8\u5199\u6210\u786E\u5B9A\u673A\u5236\u3002`,
          en: `Fix Datasets and Experimental Setup as the first subsection, with required Datasets, Experimental Configuration (including servers/hardware and hyperparameters), and Baselines units in that order; fix Main Results as the second. Do not reserve fixed third or fourth positions. Order supported Ablation Studies, mechanism/efficiency/parameter analyses, Case Studies and Qualitative Analysis, and other analyses by evidence.
Across each experiment subsection, establish the uncertainty being tested, decisive evidence, warranted interpretation, relation to the claim, and evidence boundary, distributing these functions naturally across continuous prose. Let headings name experiments, variables, or phenomena rather than repeatedly labeling Question, Observation, or Interpretation. Do not narrate every table cell. Tie each ablation to a clear design question and do not present ordinary variation as a confirmed mechanism.`
        }
      },
      {
        heading: {
          zh: "E. \u6838\u9A8C\u6570\u5B57\u3001\u7EDF\u8BA1\u4E0E\u76F8\u5173\u5DE5\u4F5C",
          en: "E. Verify Numbers, Statistics, and Related Work"
        },
        body: {
          zh: "\u6838\u5BF9\u56FE\u8868\u3001\u6B63\u6587\u3001caption \u548C\u6458\u8981\u4E2D\u7684\u6570\u503C\u3001\u6307\u6807\u65B9\u5411\u3001\u5355\u4F4D\u3001\u5747\u503C/\u6807\u51C6\u5DEE\u53CA\u663E\u8457\u6027\u8868\u8FF0\u3002\u8054\u7F51\u6838\u9A8C\u6700\u76F8\u5173\u57FA\u7EBF\u3001\u6570\u636E\u96C6\u6765\u6E90\u3001\u8BC4\u4EF7\u534F\u8BAE\u548C\u8FD1\u90BB\u673A\u5236\uFF1B\u628A\u6838\u9A8C\u901A\u8FC7\u4E14\u4E0D\u91CD\u590D\u7684\u65B0\u6761\u76EE\u8FFD\u52A0\u5230\u5B8C\u6574\u5F53\u524D BibTeX\uFF0C\u5E76\u5728\u62A5\u544A\u4E2D\u8BB0\u5F55\u3002",
          en: "Cross-check values, metric direction, units, mean/standard-deviation notation, and significance language across visuals, prose, captions, and abstract. Verify the closest baselines, dataset sources, evaluation protocols, and neighboring mechanisms on the web. Append verified, non-duplicate entries to the complete current BibTeX library and record them in the report."
        }
      }
    ],
    deliverables: {
      zh: "\u751F\u6210\u5B8C\u6574\u82F1\u6587 .tex\u3001\u4E2D\u6587\u62A5\u544A\u548C\u5B8C\u6574\u5F53\u524D BibTeX \u6587\u732E\u5E93\u3002\u62A5\u544A\u5305\u542B Method \u903B\u8F91\u56FE\u8C31\u3001\u65E7/\u65B0\u5C0F\u8282\u5BF9\u7167\u3001\u516C\u5F0F\u7B26\u53F7\u5BA1\u8BA1\u3001\u73B0\u6709\u56FE\u8868\u4E0E\u6B63\u6587\u63A5\u53E3\u5BA1\u8BA1\u3001Experiment Question\u2013Evidence Matrix\u3001\u5B9E\u9A8C\u987A\u5E8F\u8BF4\u660E\u3001\u6570\u5B57\u98CE\u9669\u3001\u5F31\u5316\u4E3B\u5F20\u3001\u8054\u7F51\u6838\u9A8C\u3001\u65B0\u589E\u6216\u4FEE\u6B63\u6587\u732E\u8BB0\u5F55\u3001\u4FEE\u6539\u6E05\u5355\u3001\u4F5C\u8005\u9700\u786E\u8BA4\u9879\u548C\u4E0B\u4E00\u8F6E\u4EA4\u63A5\u6458\u8981\u3002",
      en: "Create a complete English .tex, a Chinese report, and a complete current BibTeX library. The report must include the Method logic map, old/new subsection comparison, equation and notation audit, existing-visual-to-prose interface audit, Experiment Question\u2013Evidence Matrix, experiment-order rationale, numeric risks, qualified claims, web verification, added or corrected bibliography records, revision log, author-confirmation items, and the next-round handoff."
    },
    fileNames: {
      zh: `<base_name>_round_2_method_experiments.tex
<base_name>_round_2_report_zh.md
<base_name>_round_2_references.bib`,
      en: `<base_name>_round_2_method_experiments.tex
<base_name>_round_2_report_zh.md
<base_name>_round_2_references.bib`
    },
    finalChecks: {
      zh: `- Method \u4E0E Experiments \u5B8C\u6210\u5B9E\u8D28\u91CD\u6784\u800C\u975E\u540C\u4E49\u8BCD\u66FF\u6362\u3002
- \u6240\u6709\u65B9\u6CD5\u3001\u516C\u5F0F\u3001\u8BBE\u7F6E\u548C\u6570\u5B57\u5747\u6709\u5F53\u524D\u6750\u6599\u4F9D\u636E\u3002
- \u73B0\u6709\u56FE\u3001\u8868\u548C\u516C\u5F0F\u5DF2\u89C6\u89C9\u6838\u5BF9\u5E76\u4E0E\u6B63\u6587\u5BF9\u9F50\u3002
- \u672C\u6B65\u672A\u63D0\u524D\u751F\u6210\u6216\u66FF\u6362\u603B\u4F53\u6846\u67B6\u56FE\u3002
- Results \u4E0D\u9010\u9879\u6717\u8BFB\u8868\u683C\uFF0C\u4E5F\u4E0D\u63D0\u524D\u627F\u62C5 Discussion \u529F\u80FD\u3002
- \u5176\u4ED6\u7AE0\u8282\u53EA\u505A\u5FC5\u8981\u540C\u6B65\u3002`,
      en: `- Method and Experiments were substantively reconstructed, not synonym-swapped.
- Every method, equation, setting, and number is grounded in current materials.
- Existing figures, tables, and equations were visually checked and aligned with prose.
- This step did not prematurely generate or replace the overall framework figure.
- Results neither narrates tables cell by cell nor absorbs the role of Discussion.
- Other sections received only necessary synchronization.`
    }
  },
  {
    id: "narrative-reconstruction",
    sourceFile: "Round_3_Narrative_Sections_Reconstruction.md",
    number: 3,
    profile: "manuscript",
    title: {
      zh: "\u524D\u540E\u53D9\u4E8B\u4ECE\u96F6\u91CD\u6784",
      en: "Narrative Sections from Evidence"
    },
    purpose: {
      zh: "\u4EC5\u4EE5\u7A33\u5B9A\u7684\u65B9\u6CD5\u3001\u5B9E\u9A8C\u548C\u8BC1\u636E\u4E3A\u5E95\u7A3F\uFF0C\u4ECE\u96F6\u91CD\u5199\u6458\u8981\u3001\u5F15\u8A00\u3001\u76F8\u5173\u5DE5\u4F5C\u3001\u8BA8\u8BBA\u4E0E\u7ED3\u8BBA\u3002",
      en: "Rewrite the abstract, introduction, related work, discussion, and conclusion from stable methods, experiments, and evidence."
    },
    role: {
      zh: "\u4F60\u662F\u4E00\u540D\u719F\u6089\u8BA1\u7B97\u673A\u79D1\u5B66\u4F1A\u8BAE\u4E0E\u671F\u520A\u5199\u4F5C\u7684\u8D44\u6DF1\u7814\u7A76\u8005\u3002\u4FDD\u6301\u7B2C\u4E00\u6B65\u5DF2\u786E\u5B9A\u7684 Title \u4E0D\u53D8\uFF0C\u628A\u65E7 Abstract\u3001Introduction\u3001Related Work\u3001Discussion \u548C Conclusion \u89C6\u4E3A\u4E0D\u53EF\u590D\u7528\u7684\u63AA\u8F9E\uFF0C\u53EA\u4FDD\u7559\u53EF\u7531 Method\u3001Experiments\u3001\u56FE\u8868\u548C\u53EF\u9760\u5F15\u7528\u652F\u6301\u7684\u4E8B\u5B9E\u3002",
      en: "You are a senior researcher experienced in computer-science conference and journal writing. Preserve the Title fixed in Step 1. Treat the old Abstract, Introduction, Related Work, Discussion, and Conclusion as unusable wording, retaining only facts supported by Method, Experiments, visuals, and reliable citations."
    },
    inputs: {
      zh: `- \u6700\u65B0\u5B8C\u6574 .tex\uFF0C\u4F18\u5148\u4E3A\u7B2C\u4E8C\u6B65\u8F93\u51FA
- \u4E0E\u5176\u4E00\u81F4\u7684 PDF
- \u5F53\u524D\u5B8C\u6574 .bib`,
      en: `- The newest complete .tex, preferably the Step 2 output
- Its matching PDF
- The current complete .bib`
    },
    scope: {
      zh: "\u5141\u8BB8\u5B8C\u5168\u91CD\u5199 Abstract\u3001Introduction\u3001Related Work\u3001Discussion \u548C Conclusion\uFF1B\u4E0D\u5F97\u91CD\u65B0\u751F\u6210\u6216\u6539\u5199\u7B2C\u4E00\u6B65\u5DF2\u786E\u5B9A\u7684 Title \u4E0E\u8BBA\u6587\u54C1\u724C\u7F29\u5199\u3002Method \u4E0E Experiments \u539F\u5219\u4E0A\u51BB\u7ED3\uFF0C\u53EA\u4FEE\u590D\u672F\u8BED\u3001\u7AE0\u8282\u5F15\u7528\u3001\u56FE\u8868\u5F15\u7528\u548C\u4E0E\u65B0\u53D9\u4E8B\u76F4\u63A5\u51B2\u7A81\u7684\u5C40\u90E8\u53E5\u5B50\u3002\u4E0D\u5F97\u6539\u53D8\u6A21\u677F\u3002",
      en: "You may completely rewrite Abstract, Introduction, Related Work, Discussion, and Conclusion. Do not regenerate or rewrite the Title or paper brand acronym fixed in Step 1. Treat Method and Experiments as frozen except for terminology, section references, visual references, and local sentences that directly conflict with the new narrative. Preserve the template."
    },
    styleBranches: {
      conference: {
        zh: "\u4F1A\u8BAE\u8BBA\u6587\uFF1ARelated Work \u6070\u597D\u4E09\u4E2A\u5C0F\u8282\u4E14\u6BCF\u5C0F\u8282\u4E00\u4E2A\u666E\u901A\u6BB5\u843D\uFF1BDiscussion and Limitations \u5148\u5199\u4E09\u4E2A\u8BA8\u8BBA\u5C0F\u8282\uFF0C\u518D\u5199\u4E00\u4E2A\u7EA6 100 \u8BCD\u7684 Limitations \u5C0F\u8282\uFF1B\u8BA8\u8BBA\u4E0D\u91CD\u590D\u7ED3\u679C\u3001\u4E0D\u5F15\u7528\u5B9E\u9A8C\u56FE\u8868\uFF0C\u7ED3\u679C\u6570\u5B57\u6700\u591A\u4E09\u4E2A\u3002",
        en: "Conference paper: Related Work has exactly three subsections with one ordinary paragraph each. Discussion and Limitations uses three discussion subsections followed by an approximately 100-word Limitations subsection; it does not repeat results or cite experimental visuals and uses at most three result values."
      },
      journal: {
        zh: "\u671F\u520A\u8BBA\u6587\uFF1ARelated Work \u6070\u597D\u4E09\u4E2A\u5C0F\u8282\u4E14\u6BCF\u5C0F\u8282\u4E24\u4E2A\u666E\u901A\u6BB5\u843D\uFF1BDiscussion \u7528\u4E09\u4E2A\u5C0F\u8282\u72EC\u7ACB\u89E3\u91CA\u673A\u5236\u3001\u9002\u7528\u8303\u56F4\u3001\u5C40\u9650\u4E0E\u672A\u6765\u65B9\u5411\uFF0C\u540C\u6837\u4E0D\u91CD\u590D\u7ED3\u679C\u6216\u5F15\u7528\u5B9E\u9A8C\u56FE\u8868\u3002",
        en: "Journal paper: Related Work has exactly three subsections with two ordinary paragraphs each. A three-subsection Discussion explains mechanism, scope, limitations, and future directions without repeating results or citing experimental visuals."
      }
    },
    tasks: [
      {
        heading: {
          zh: "A. \u62BD\u53D6\u5E76\u51BB\u7ED3\u4E8B\u5B9E\u5E95\u7A3F",
          en: "A. Extract and Freeze the Fact Base"
        },
        body: {
          zh: "\u5148\u4ECE Method\u3001Experiments\u3001\u56FE\u8868\u548C .bib \u62BD\u53D6\u53EF\u5B89\u5168\u590D\u7528\u7684\u4EFB\u52A1\u3001\u95EE\u9898\u3001\u6838\u5FC3\u601D\u60F3\u3001\u673A\u5236\u3001\u8BC1\u636E\u548C\u8FB9\u754C\u3002\u8BB0\u5F55\u7B2C\u4E00\u6B65\u5DF2\u7ECF\u786E\u5B9A\u7684 Title\u3001\u65B9\u6CD5\u5168\u79F0\u4E0E\u8BBA\u6587\u54C1\u724C\u7F29\u5199\u5E76\u4FDD\u6301\u4E0D\u53D8\u3002",
          en: "First extract a safe fact base of task, problem, core idea, mechanisms, evidence, and boundaries from Method, Experiments, visuals, and the .bib. Record and preserve the Title, full method name, and paper brand acronym fixed in Step 1."
        }
      },
      {
        heading: {
          zh: "B. \u4ECE\u96F6\u91CD\u5199 Abstract",
          en: "B. Rewrite the Abstract from Scratch"
        },
        body: {
          zh: "\u4F7F\u7528\u4E00\u4E2A\u8FDE\u7EED\u6BB5\u843D\u5B8C\u6210\u80CC\u666F\u4E0E\u7F3A\u53E3\u3001\u65B9\u6CD5\u6865\u63A5\u3001\u6838\u5FC3\u601D\u60F3\u4E0E\u5FC5\u8981\u673A\u5236\u3001\u5173\u952E\u5B9E\u9A8C\u53D1\u73B0\u53CA\u53D7\u8BC1\u636E\u652F\u6301\u7684\u610F\u4E49\u3002\u4E0D\u5F97\u4F7F\u7528\u5F15\u7528\u3001\u516C\u5F0F\u3001\u811A\u6CE8\u6216\u7F16\u53F7\uFF1B\u7F29\u5199\u4FDD\u6301\u514B\u5236\uFF0C\u4E0D\u5806\u53E0\u6B63\u6587\u7EA7\u4E13\u6709\u540D\u8BCD\uFF0CResults \u5EFA\u8BAE\u53EA\u4FDD\u7559 2\u20134 \u4E2A\u6700\u6709\u4EE3\u8868\u6027\u7684\u7ED3\u679C\u6570\u5B57\u3002",
          en: "Use one continuous paragraph to cover background and gap, a method bridge, the core idea and necessary mechanisms, key experimental findings, and evidence-supported implications. Use no citations, equations, footnotes, or numbering. Keep acronyms sparse, avoid body-level terminology stacks, and preferably retain only two to four representative result values."
        }
      },
      {
        heading: {
          zh: "C. \u4ECE\u96F6\u91CD\u5199 Introduction \u4E0E Related Work",
          en: "C. Rewrite Introduction and Related Work from Scratch"
        },
        body: {
          zh: `Introduction \u4F9D\u6B21\u5B8C\u6210\u5177\u4F53\u4EFB\u52A1\u4E0E\u73B0\u5B9E\u7EA6\u675F\u3001\u6700\u76F8\u5173\u7814\u7A76\u8DEF\u7EBF\u4E0E\u7F3A\u53E3\u3001\u95EE\u9898\u548C\u6311\u6218\u3001\u65B9\u6CD5\u6982\u89C8\u3001\u8D21\u732E\u548C\u8BBA\u6587\u7ED3\u6784\uFF1B\u8D21\u732E\u5FC5\u987B\u8986\u76D6\u79D1\u5B66\u89C6\u89D2\u3001\u8BA1\u7B97\u5B9E\u73B0\u4E0E\u5B9E\u9A8C\u8BA4\u8BC6\uFF0C\u800C\u975E\u9010\u6A21\u5757\u7F57\u5217\u3002
Related Work \u6070\u597D\u4E09\u4E2A\u5C0F\u8282\uFF0C\u5E76\u6309\u5F53\u524D\u8BBA\u6587\u7C7B\u578B\u4F7F\u7528\u5355\u6BB5\u6216\u53CC\u6BB5\u7ED3\u6784\uFF1B\u6309\u7814\u7A76\u8303\u5F0F\u3001\u8BAD\u7EC3\u4FE1\u53F7\u3001\u7ED3\u6784\u5047\u8BBE\u3001\u6548\u7387\u6216\u6CDB\u5316\u6743\u8861\u7EFC\u5408\u3002\u6BCF\u4E2A\u5C0F\u8282\u6700\u540E\u7528\u4E0D\u8D85\u8FC7 18 \u8BCD\u7684\u65E0 \u201Cwe\u201D\u3001\u65E0\u672C\u6587\u65B9\u6CD5\u540D\u603B\u7ED3\u53E5\u6536\u675F\u3002\u5148\u5728\u62A5\u544A\u4E2D\u89C4\u5212\u4E3B\u9898\u548C\u73B0\u6709 BibTeX key\uFF0C\u518D\u5199\u5165 TeX\uFF1B\u4E0D\u5F97\u9010\u7BC7\u6D41\u6C34\u8D26\u3002`,
          en: `Introduction must establish the concrete task and practical constraints, the closest research lines and gap, the problem and challenges, method overview, contributions, and paper organization. Contributions must cover the scientific perspective, computational realization, and experimental insight rather than list modules.
Related Work has exactly three subsections and follows the current paper type's one- or two-paragraph rule. Synthesize paradigms, training signals, structural assumptions, efficiency, or generalization trade-offs. End each subsection with a synthesis sentence of at most 18 words that uses neither \u201Cwe\u201D nor the method name. Plan themes and existing BibTeX keys in the report before drafting; do not narrate papers one by one.`
        }
      },
      {
        heading: {
          zh: "D. \u4ECE\u96F6\u91CD\u5199 Discussion \u4E0E Conclusion",
          en: "D. Rewrite Discussion and Conclusion from Scratch"
        },
        body: {
          zh: "Discussion \u533A\u5206\u76F4\u63A5\u8BC1\u636E\u3001\u5408\u7406\u63A8\u65AD\u548C\u672A\u9A8C\u8BC1\u673A\u5236\uFF0C\u627F\u62C5\u7EFC\u5408\u89E3\u91CA\u800C\u4E0D\u662F\u91CD\u590D\u5B9E\u9A8C\u7ED3\u679C\uFF1B\u4E0D\u5F15\u7528 Experiments \u4E2D\u7684\u8868\u683C\u6216\u56FE\u7247\uFF0C\u7ED3\u679C\u6570\u5B57\u539F\u5219\u4E0A\u4E0D\u5199\u4E14\u6700\u591A\u4E09\u4E2A\u3002\u6309\u5F53\u524D\u8BBA\u6587\u7C7B\u578B\u7EC4\u7EC7\u8BA8\u8BBA\u4E0E\u5C40\u9650\u3002Conclusion \u7528\u4E24\u4E2A\u529F\u80FD\u660E\u786E\u7684\u6BB5\u843D\u6536\u675F\u95EE\u9898/\u601D\u60F3/\u8BC1\u636E\uFF0C\u518D\u8BF4\u660E\u610F\u4E49/\u8FB9\u754C/\u672A\u6765\u65B9\u5411\uFF0C\u4E0D\u5F15\u5165\u65B0\u4E3B\u5F20\u3002",
          en: "Discussion distinguishes direct evidence, reasonable inference, and untested mechanisms and provides synthesis rather than repeating experimental results. Do not cite tables or figures from Experiments; preferably use no result values and never more than three. Follow the current paper type's discussion-and-limitations structure. Use two functionally distinct Conclusion paragraphs: first close the problem, idea, and evidence; then state implications, boundaries, and future directions without new claims."
        }
      },
      {
        heading: {
          zh: "E. \u505A\u5168\u5C40\u672F\u8BED\u3001\u5F15\u7528\u548C\u4E8B\u5B9E\u5BF9\u9F50",
          en: "E. Align Global Terminology, Citations, and Facts"
        },
        body: {
          zh: "\u68C0\u67E5\u5404\u53D9\u4E8B\u7AE0\u8282\u662F\u5426\u548C\u65E2\u5B9A\u6807\u9898\u3001Method\u3001Experiments\u3001\u56FE\u8868\u3001\u8D21\u732E\u70B9\u53CA\u552F\u4E00\u672F\u8BED\u4F53\u7CFB\u5B8C\u5168\u4E00\u81F4\u3002\u8054\u7F51\u6838\u9A8C Introduction \u4E0E Related Work \u7684\u7814\u7A76\u7F3A\u53E3\uFF1B\u628A\u6838\u9A8C\u901A\u8FC7\u4E14\u4E0D\u91CD\u590D\u7684\u65B0\u6761\u76EE\u8FFD\u52A0\u5230\u5B8C\u6574\u5F53\u524D BibTeX\uFF0C\u5E76\u5728\u62A5\u544A\u4E2D\u8BB0\u5F55\u3002",
          en: "Verify that the narrative sections align completely with the fixed title, Method, Experiments, visuals, contributions, and canonical terminology system. Use web research to verify the gap in Introduction and Related Work. Append verified, non-duplicate entries to the complete current BibTeX library and record them in the report."
        }
      }
    ],
    deliverables: {
      zh: "\u751F\u6210\u5B8C\u6574\u82F1\u6587 .tex\u3001\u4E2D\u6587\u62A5\u544A\u548C\u5B8C\u6574\u5F53\u524D BibTeX \u6587\u732E\u5E93\u3002\u62A5\u544A\u5305\u542B\u4E8B\u5B9E\u5E95\u7A3F\u3001\u65E2\u5B9A\u6807\u9898\u4E0E\u8BBA\u6587\u54C1\u724C\u7F29\u5199\u786E\u8BA4\u3001Abstract \u529F\u80FD\u8868\u3001Introduction \u529F\u80FD\u8868\u3001\u8D21\u732E\u5BF9\u7167\u3001Related Work \u4E3B\u9898\u4E0E\u6587\u732E\u7C07\u3001Discussion \u8BC1\u636E/\u63A8\u65AD/\u8FB9\u754C\u8868\u3001Conclusion \u529F\u80FD\u8868\u3001\u672F\u8BED\u5BF9\u9F50\u3001\u8054\u7F51\u6838\u9A8C\u3001\u65B0\u589E\u6216\u4FEE\u6B63\u6587\u732E\u8BB0\u5F55\u3001\u91CD\u6784\u6E05\u5355\u548C\u4E0B\u4E00\u6B65\u4EA4\u63A5\u6458\u8981\u3002",
      en: "Create a complete English .tex, a Chinese report, and a complete current BibTeX library. The report must include the fact base, confirmation of the fixed title and paper brand acronym, Abstract function table, Introduction function table, contribution comparison, Related Work themes and citation clusters, Discussion evidence/inference/boundary table, Conclusion function table, terminology alignment, web verification, added or corrected bibliography records, reconstruction log, and next-step handoff."
    },
    fileNames: {
      zh: `<base_name>_round_3_narrative_reconstruction.tex
<base_name>_round_3_report_zh.md
<base_name>_round_3_references.bib`,
      en: `<base_name>_round_3_narrative_reconstruction.tex
<base_name>_round_3_report_zh.md
<base_name>_round_3_references.bib`
    },
    finalChecks: {
      zh: `- \u7B2C\u4E00\u6B65\u786E\u5B9A\u7684\u6807\u9898\u4E0E\u8BBA\u6587\u54C1\u724C\u7F29\u5199\u4FDD\u6301\u4E0D\u53D8\u3002
- \u524D\u540E\u53D9\u4E8B\u786E\u5B9E\u4ECE\u8BC1\u636E\u5E95\u7A3F\u91CD\u5199\uFF0C\u800C\u975E\u6CBF\u7528\u65E7\u53E5\u3002
- \u65B0\u53D9\u4E8B\u4E0E Method\u3001Experiments \u548C\u56FE\u8868\u4E8B\u5B9E\u4E00\u81F4\u3002
- \u5F15\u7528 key \u5168\u90E8\u5B58\u5728\u4E8E\u5F53\u524D .bib\u3002
- \u672A\u65E0\u5FC5\u8981\u6539\u5199 Method \u4E0E Experiments\u3002
- \u5168\u6587\u7B26\u5408\u5F53\u524D\u98CE\u683C\u4E0E\u9644\u5F55\u914D\u7F6E\u3002`,
      en: `- The title and paper brand acronym fixed in Step 1 remain unchanged.
- The narrative sections were genuinely rewritten from the evidence base rather than old sentences.
- The new narrative matches Method, Experiments, and visual evidence.
- Every citation key exists in the current .bib.
- Method and Experiments were not unnecessarily rewritten.
- The manuscript follows the current style and appendix configuration.`
    }
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
      zh: "\u91CD\u6784\u65B9\u6CD5\u603B\u89C8\u6846\u67B6\u56FE",
      en: "Reconstruct the Method Overview Figure"
    },
    purpose: {
      zh: "\u5728\u65B9\u6CD5\u4E0E\u524D\u540E\u53D9\u4E8B\u7A33\u5B9A\u540E\uFF0C\u53EA\u91CD\u6784\u4E00\u5F20\u8BBA\u6587 Overview \u603B\u4F53\u6846\u67B6\u56FE\u3002",
      en: "Reconstruct only the paper\u2019s overall Method Overview figure after the Method and surrounding narrative are stable."
    },
    role: {
      zh: "\u4F60\u662F\u4E00\u540D\u719F\u6089 CS \u8BBA\u6587\u65B9\u6CD5\u603B\u89C8\u56FE\u7684\u4FE1\u606F\u8BBE\u8BA1\u8005\u3002",
      en: "You are an information designer specializing in Method Overview figures for CS papers."
    },
    inputs: {
      zh: "\u6700\u65B0\u5B8C\u6574 .tex \u4E0E\u5176\u7F16\u8BD1 PDF\u3002",
      en: "The latest complete .tex and its compiled PDF."
    },
    scope: {
      zh: "\u53EA\u91CD\u6784\u8BBA\u6587\u7684\u603B\u4F53\u65B9\u6CD5\u6846\u67B6\u56FE\uFF0C\u4E0D\u751F\u6210\u5F15\u8A00\u56FE\u6216\u5C40\u90E8\u6280\u672F\u7EC6\u8282\u56FE\u3002",
      en: "Reconstruct only the paper\u2019s overall method framework figure, not an Introduction figure or a local technical-detail figure."
    },
    tasks: [],
    deliverables: {
      zh: "\u751F\u6210\u4E00\u5F20\u53EF\u76F4\u63A5\u4E0B\u8F7D\u7684\u603B\u4F53\u6846\u67B6\u56FE PNG\u3002",
      en: "Generate one downloadable overall-framework PNG."
    },
    fileNames: {
      zh: "<base_name>_round_4_framework_reconstruction.png",
      en: "<base_name>_round_4_framework_reconstruction.png"
    },
    finalChecks: {
      zh: "\u672F\u8BED\u3001\u7ED3\u6784\u3001\u7BAD\u5934\u8BED\u4E49\u3001\u6240\u9009\u753B\u5E03\u6BD4\u4F8B\u4E0E\u7F29\u5C0F\u540E\u53EF\u8BFB\u6027\u5747\u5DF2\u6838\u5BF9\u3002",
      en: "Terminology, structure, arrow semantics, the selected canvas ratio, and reduced-size legibility have all been checked."
    }
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
      zh: "\u5168\u6587\u7CBE\u4FEE\u4E0E\u6295\u7A3F\u7EA7\u7EC8\u5BA1",
      en: "Full-manuscript Refinement & Final Audit"
    },
    purpose: {
      zh: "\u7EDF\u4E00\u8BED\u8A00\u3001\u672F\u8BED\u3001\u6570\u5B57\u4E0E Claim \u5F3A\u5EA6\uFF0C\u5E76\u6A21\u62DF\u4E25\u683C\u5BA1\u7A3F\u4EBA\u5B8C\u6210\u7EC8\u5BA1\u3002",
      en: "Align language, terminology, numbers, and claim strength, then run a strict reviewer-style final audit."
    },
    role: {
      zh: "\u4F60\u662F\u4E00\u540D\u4E25\u683C\u7684 CS \u7EC8\u7A3F\u7F16\u8F91\u3001\u65B9\u6CD5\u5BA1\u7A3F\u4EBA\u3001\u5B9E\u9A8C\u5BA1\u8BA1\u8005\u548C LaTeX \u8D28\u91CF\u68C0\u67E5\u8005\u3002\u524D\u56DB\u6B65\u5DF2\u7ECF\u7A33\u5B9A\u79D1\u5B66\u4E3B\u7EBF\u3001\u6B63\u6587\u7ED3\u6784\u4E0E\u603B\u4F53\u6846\u67B6\u56FE\uFF0C\u672C\u6B65\u628A\u5168\u6587\u63D0\u5347\u5230\u6295\u7A3F\u7EA7\u4E00\u81F4\u6027\u3002",
      en: "You are a strict CS final editor, method reviewer, experiment auditor, and LaTeX quality checker. The scientific throughline, manuscript structure, and overall framework figure are stable after four steps; this step raises the manuscript to submission-level consistency."
    },
    inputs: {
      zh: `- \u6700\u65B0\u5B8C\u6574 .tex\uFF0C\u4F18\u5148\u4E3A\u7B2C\u4E09\u6B65\u8F93\u51FA
- \u4E0E\u5176\u4E00\u81F4\u7684 PDF
- \u5F53\u524D\u5B8C\u6574 .bib
- \u7B2C\u56DB\u6B65\u91CD\u6784\u7684\u603B\u4F53\u6846\u67B6\u56FE PNG`,
      en: `- The newest complete .tex, preferably the Step 3 output
- Its matching PDF
- The current complete .bib
- The overall-framework PNG reconstructed in Step 4`
    },
    scope: {
      zh: "\u5141\u8BB8\u53E5\u5B50\u7EA7\u548C\u5C40\u90E8\u6BB5\u843D\u7EA7\u7CBE\u4FEE\u3001\u5408\u5E76\u5197\u4F59\u3001\u8C03\u6574\u5C40\u90E8\u987A\u5E8F\u3001\u6539\u5584\u8FC7\u6E21\u3001\u964D\u4F4E\u8FC7\u5F3A claim \u548C\u538B\u7F29\u91CD\u590D\u3002\u539F\u5219\u4E0A\u4E0D\u518D\u6539\u53D8\u79D1\u5B66\u95EE\u9898\u3001\u6838\u5FC3\u601D\u60F3\u3001\u65B9\u6CD5\u7ED3\u6784\u3001\u5B9E\u9A8C\u8BBE\u8BA1\u4E0E\u5DF2\u786E\u5B9A\u7AE0\u8282\u529F\u80FD\uFF1B\u4E25\u91CD\u79D1\u5B66\u6216\u6570\u5B57\u9519\u8BEF\u5FC5\u987B\u4FEE\u6B63\u5E76\u6807\u4E3A\u91CD\u5927\u4FEE\u6B63\u3002",
      en: "You may refine sentences and local paragraphs, merge redundancy, adjust local order, improve transitions, qualify strong claims, and compress repetition. Do not normally change the scientific problem, core idea, method structure, experiment design, or established section functions. Correct serious scientific or numeric errors and mark them as major final-audit revisions."
    },
    tasks: [
      {
        heading: {
          zh: "A. \u5168\u6587\u8BED\u8A00\u4E0E\u6BB5\u843D\u7CBE\u4FEE",
          en: "A. Refine Language and Paragraphs"
        },
        body: {
          zh: "\u9010\u53E5\u68C0\u67E5\u8BED\u6CD5\u3001\u51A0\u8BCD\u3001\u5355\u590D\u6570\u3001\u4E3B\u8C13\u4E00\u81F4\u3001\u65F6\u6001\u3001\u8BED\u6001\u3001\u53E5\u957F\u3001\u4ECE\u53E5\u3001\u4E3B\u9898\u53E5\u3001\u903B\u8F91\u8FDE\u63A5\u3001\u91CD\u590D\u53E5\u9996\u3001\u6A21\u7CCA\u6307\u4EE3\u3001\u53E3\u8BED\u3001\u540D\u8BCD\u5806\u53E0\u548C\u5BA3\u4F20\u6027\u8868\u8FBE\u3002\u6BCF\u6BB5\u53EA\u627F\u62C5\u4E00\u4E2A\u4E3B\u8981\u529F\u80FD\uFF0C\u4F18\u5148\u4F7F\u7528\u6E05\u6670\u4E3B\u52A8\u8BED\u6001\u4E0E\u65E0\u751F\u547D\u4E3B\u8BED\u3002",
          en: "Check grammar, articles, number agreement, subject\u2013verb agreement, tense, voice, sentence length, clause depth, topic sentences, logical links, repetitive openings, vague references, colloquialisms, noun stacking, and promotional wording. Give each paragraph one primary function and prefer clear active constructions and inanimate subjects."
        }
      },
      {
        heading: {
          zh: "B. \u672F\u8BED\u3001\u7F29\u5199\u4E0E\u7B26\u53F7\u6CBB\u7406",
          en: "B. Govern Terminology, Acronyms, and Notation"
        },
        body: {
          zh: "\u5EFA\u7ACB\u6700\u7EC8 Terminology Consistency Table\uFF0C\u843D\u5B9E canonical term\u3001\u65E2\u5B9A\u8BBA\u6587\u54C1\u724C\u7F29\u5199\u3001\u9996\u6B21\u5B9A\u4E49\u3001\u7981\u7528\u53D8\u4F53\u3001\u5197\u4F59\u7F29\u5199\u548C\u5FC5\u987B\u533A\u5206\u7684\u6982\u5FF5\u3002\u68C0\u67E5\u6807\u9898\u3001\u6458\u8981\u3001\u6B63\u6587\u3001\u56FE\u3001\u8868\u3001caption\u3001\u516C\u5F0F\u548C\u7B97\u6CD5\u662F\u5426\u5B8C\u5168\u4E00\u81F4\u3002",
          en: "Create the final Terminology Consistency Table and enforce canonical terms, the fixed paper brand acronym, first definitions, prohibited variants, redundant acronyms, and concepts that must remain distinct. Verify consistency across title, abstract, prose, figures, tables, captions, equations, and algorithms."
        }
      },
      {
        heading: {
          zh: "C. \u8DE8\u7AE0\u8282\u5197\u4F59\u4E0E\u529F\u80FD\u5BA1\u8BA1",
          en: "C. Audit Cross-section Redundancy and Function"
        },
        body: {
          zh: "\u68C0\u67E5 Abstract/Introduction\u3001Introduction/Related Work\u3001Method Overview/\u6838\u5FC3\u673A\u5236\u3001Results/Discussion\u3001Abstract/Conclusion \u7684\u590D\u5236\u4E0E\u529F\u80FD\u8D8A\u754C\u3002\u8F93\u51FA Cross-Section Redundancy Matrix\uFF0C\u5E76\u8BF4\u660E\u5220\u9664\u3001\u5408\u5E76\u6216\u4FDD\u7559\u539F\u56E0\u3002",
          en: "Audit duplication and functional leakage across Abstract/Introduction, Introduction/Related Work, Method Overview/core mechanisms, Results/Discussion, and Abstract/Conclusion. Return a Cross-Section Redundancy Matrix with reasons for deletion, merging, or retention."
        }
      },
      {
        heading: {
          zh: "D. Claim\u2013Evidence\u3001\u6570\u5B57\u4E0E\u7EDF\u8BA1\u7EC8\u5BA1",
          en: "D. Finalize Claim\u2013Evidence, Numeric, and Statistical Audits"
        },
        body: {
          zh: `\u5BA1\u8BA1\u6807\u9898\u3001\u6458\u8981\u3001\u8D21\u732E\u3001Results\u3001Discussion \u548C Conclusion \u7684\u6BCF\u4E2A\u4E3B\u8981 claim\uFF1A\u7C7B\u578B\u3001\u8BC1\u636E\u4F4D\u7F6E\u3001\u5145\u5206\u6027\u3001\u6240\u9700\u9650\u5B9A\u548C\u6CDB\u5316/\u56E0\u679C\u98CE\u9669\u3002
\u9010\u9879\u6838\u5BF9\u6B63\u6587\u3001\u56FE\u8868\u548C\u6458\u8981\u4E2D\u7684\u6570\u5B57\u3001\u7EDD\u5BF9/\u76F8\u5BF9\u63D0\u5347\u3001\u6307\u6807\u65B9\u5411\u3001\u5747\u503C/\u6807\u51C6\u5DEE\u3001\u8FD0\u884C\u6B21\u6570\u3001best/second-best\u3001\u6570\u636E\u89C4\u6A21\u3001\u6548\u7387\u5355\u4F4D\u548C\u663E\u8457\u6027\u3002\u4E0D\u5F97\u81EA\u884C\u8865\u7B97\u65E0\u6CD5\u786E\u8BA4\u7684\u503C\u3002`,
          en: `Audit every major claim in the title, abstract, contributions, Results, Discussion, and Conclusion: type, evidence location, sufficiency, required qualification, and generalization/causality risk.
Cross-check numbers, absolute/relative gains, metric direction, means/standard deviations, run counts, best/second-best marks, dataset sizes, efficiency units, and significance language across prose, visuals, and abstract. Do not recompute values that cannot be verified.`
        }
      },
      {
        heading: {
          zh: "E. \u5F15\u7528\u3001LaTeX \u4E0E\u6A21\u62DF\u5BA1\u7A3F\u4EBA\u653B\u51FB\u6D4B\u8BD5",
          en: "E. Audit Citations and LaTeX, Then Run a Reviewer Attack Test"
        },
        body: {
          zh: `\u9010\u4E00\u6838\u5BF9 citation key \u4E0E\u8BED\u4E49\u652F\u6301\uFF0C\u5220\u9664 citation dumping\uFF1B\u68C0\u67E5\u6240\u6709\u56FE\u8868\u3001\u516C\u5F0F\u548C\u7B97\u6CD5\u5F15\u7528\u3001label/ref\u3001caption\u3001\u81EA\u5B9A\u4E49\u547D\u4EE4\u3001\u8DEF\u5F84\u3001\u5360\u4F4D\u7B26\u548C\u7F16\u8BD1\u8B66\u544A\u3002\u73AF\u5883\u652F\u6301\u65F6\u5B9E\u9645\u7F16\u8BD1\uFF0C\u5426\u5219\u4E0D\u5F97\u58F0\u79F0\u6210\u529F\u3002
\u4EE5\u4E25\u683C\u5BA1\u7A3F\u4EBA\u89C6\u89D2\u653B\u51FB\u65B0\u610F\u3001\u5DEE\u5F02\u3001\u673A\u5236\u5FC5\u8981\u6027\u3001\u5B9E\u9A8C\u8986\u76D6\u3001\u516C\u5E73\u6BD4\u8F83\u3001\u53C2\u6570\u9009\u62E9\u3001\u7ED3\u8BBA\u8FB9\u754C\u548C\u5C40\u9650\u8BDA\u5B9E\u5EA6\u3002\u65E0\u6CD5\u901A\u8FC7\u6587\u5B57\u89E3\u51B3\u7684\u5B9E\u9A8C\u7F3A\u53E3\u5FC5\u987B\u4FDD\u7559\u4E3A\u98CE\u9669\u3002`,
          en: `Validate every citation key and its semantic support, and remove citation dumping. Check all visual, equation, and algorithm references, labels/refs, captions, custom commands, paths, placeholders, and compilation warnings. Compile when the environment supports it; otherwise do not claim success.
Attack novelty, differentiation, mechanism necessity, experiment coverage, fair comparison, parameter selection, conclusion scope, and honest limitations from a strict reviewer's perspective. Keep experimental gaps that prose cannot solve as explicit risks.`
        }
      }
    ],
    deliverables: {
      zh: "\u751F\u6210\u5B8C\u6574\u82F1\u6587 .tex\u3001\u4E2D\u6587\u7EC8\u5BA1\u62A5\u544A\u548C\u5B8C\u6574\u6700\u7EC8 BibTeX \u6587\u732E\u5E93\u3002\u62A5\u544A\u5305\u542B\u91CD\u5927\u4FEE\u6B63\u3001\u672F\u8BED\u4E0E\u7F29\u5199\u8868\u3001Cross-Section Redundancy Matrix\u3001Claim\u2013Evidence \u8868\u3001\u6570\u5B57\u4E0E\u7EDF\u8BA1\u5BA1\u8BA1\u3001\u5F15\u7528\u5BA1\u8BA1\u3001\u56FE\u8868\u516C\u5F0F\u7B97\u6CD5\u4E0E LaTeX \u5BA1\u8BA1\u3001\u5BA1\u7A3F\u4EBA\u653B\u51FB\u6D4B\u8BD5\u3001\u4E0D\u53EF\u901A\u8FC7\u6587\u5B57\u89E3\u51B3\u7684\u98CE\u9669\u3001\u65B0\u589E\u6216\u4FEE\u6B63\u6587\u732E\u8BB0\u5F55\u3001\u4FEE\u6539\u6E05\u5355\u548C\u6295\u7A3F\u76EE\u6807\u68C0\u7D22\u4EA4\u63A5\u6458\u8981\u3002",
      en: "Create a complete English .tex, a Chinese final-audit report, and a complete final BibTeX library. The report must include major revisions, terminology and acronym tables, Cross-Section Redundancy Matrix, Claim\u2013Evidence audit, numeric/statistical audit, citation audit, visual/equation/algorithm/LaTeX audit, reviewer attack test, risks that prose cannot solve, added or corrected bibliography records, revision log, and the submission-targeting handoff."
    },
    fileNames: {
      zh: `<base_name>_round_5_final_refinement.tex
<base_name>_round_5_report_zh.md
<base_name>_round_5_references.bib`,
      en: `<base_name>_round_5_final_refinement.tex
<base_name>_round_5_report_zh.md
<base_name>_round_5_references.bib`
    },
    finalChecks: {
      zh: `- \u5168\u6587\u5B8C\u6210\u5B9E\u8D28\u7CBE\u4FEE\u800C\u975E\u62FC\u5199\u68C0\u67E5\u3002
- \u672F\u8BED\u3001\u7F29\u5199\u3001\u7B26\u53F7\u3001\u6570\u5B57\u3001\u5F15\u7528\u548C Claim \u5F3A\u5EA6\u9010\u9879\u6838\u9A8C\u3002
- Results \u4E0E Discussion\u3001Abstract \u4E0E Conclusion \u4E0D\u518D\u91CD\u590D\u3002
- \u672A\u6539\u53D8\u6A21\u677F\u548C\u5DF2\u51BB\u7ED3\u79D1\u5B66\u7ED3\u6784\u3002
- \u65E0\u6CD5\u7528\u6587\u5B57\u89E3\u51B3\u7684\u98CE\u9669\u5DF2\u8BDA\u5B9E\u4FDD\u7559\u3002`,
      en: `- The manuscript received substantive refinement, not a spelling-only pass.
- Terminology, acronyms, notation, numbers, citations, and claim strength were individually verified.
- Results/Discussion and Abstract/Conclusion no longer duplicate one another.
- The template and frozen scientific structure were preserved.
- Risks that prose cannot solve remain explicitly documented.`
    }
  },
  {
    id: "venue-targeting",
    sourceFile: "Submission_Strategy_and_Verification.md",
    number: 1,
    profile: "targeting",
    title: {
      zh: "\u6295\u7A3F\u76EE\u6807\u68C0\u7D22\u4E0E\u5B98\u7F51\u6838\u9A8C",
      en: "Venue Targeting & Official Verification"
    },
    purpose: {
      zh: "\u57FA\u4E8E\u7EC8\u7A3F\u5EFA\u7ACB\u5019\u9009\u6295\u7A3F\u6C60\uFF0C\u7528\u5F53\u524D\u5B98\u7F51\u4FE1\u606F\u8BC4\u4F30\u5339\u914D\u5EA6\u3001\u89C4\u5219\u548C\u98CE\u9669\u3002",
      en: "Build a submission candidate pool from the final manuscript and verify fit, rules, and risks against current official sources."
    },
    role: {
      zh: "\u4F60\u662F\u4E00\u540D\u719F\u6089\u8BA1\u7B97\u673A\u79D1\u5B66\u4F1A\u8BAE\u4E0E\u671F\u520A\u6295\u7A3F\u3001\u5B98\u65B9\u89C4\u5219\u6838\u9A8C\u548C\u7F16\u8F91\u7B5B\u7A3F\u903B\u8F91\u7684\u5B66\u672F\u6295\u7A3F\u987E\u95EE\u3002\u672C\u8F6E\u53EA\u505A\u76EE\u6807\u68C0\u7D22\u3001\u6838\u9A8C\u3001\u8BC4\u5206\u4E0E\u6295\u7A3F\u987A\u5E8F\uFF0C\u4E0D\u5957\u6A21\u677F\u3001\u4E0D\u6539\u683C\u5F0F\u3001\u4E0D\u91CD\u5199\u8BBA\u6587\u3002",
      en: "You are an academic submission adviser experienced in computer-science conferences and journals, official-rule verification, and editorial screening. This round performs targeting, verification, scoring, and submission ordering only. Do not apply templates, change formatting, or rewrite the manuscript."
    },
    inputs: {
      zh: `- \u8BBA\u6587\u91CD\u6784\u6700\u7EC8 .tex
- \u4E0E\u5176\u4E00\u81F4\u7684\u6700\u7EC8 PDF
- \u5F53\u524D\u5B8C\u6574 .bib
- \u53EF\u9009\uFF1A\u8BBA\u6587\u91CD\u6784\u7EC8\u5BA1\u62A5\u544A
- \u53EF\u9009\uFF1A\u76EE\u6807\u5206\u533A/\u7B49\u7EA7\u3001\u5730\u533A\u6216\u51FA\u7248\u793E\u504F\u597D\u3001OA/APC \u4E0A\u9650\u3001\u622A\u7A3F\u65F6\u95F4\u3001\u9875\u6570\u4E0E\u6295\u7A3F\u5468\u671F\u7B49\u7EA6\u675F`,
      en: `- The final reconstructed .tex
- Its matching final PDF
- The current complete .bib
- Optional: the final reconstruction audit report
- Optional: target tier/ranking, regional or publisher preferences, OA/APC ceiling, deadlines, length constraints, and submission-timeline preferences`
    },
    scope: {
      zh: "\u6240\u6709\u53EF\u80FD\u53D8\u5316\u7684 venue \u4FE1\u606F\u5FC5\u987B\u8054\u7F51\u6838\u9A8C\u5E76\u8BB0\u5F55\u65E5\u671F\u3002\u4F18\u5148\u5B98\u65B9\u4E3B\u9875\u3001Aims and Scope/Call for Papers\u3001\u4F5C\u8005\u6307\u5357\u3001\u6295\u7A3F\u7CFB\u7EDF\u3001\u51FA\u7248\u793E\u3001\u5B98\u65B9\u7D22\u5F15\u4E0E\u8D39\u7528\u9875\u9762\u3002\u7B2C\u4E09\u65B9\u9875\u9762\u53EA\u80FD\u8F85\u52A9\uFF0C\u4E0D\u80FD\u66FF\u4EE3\u5B98\u65B9\u6216\u6743\u5A01\u6765\u6E90\u3002\u8BBA\u6587\u6587\u4EF6\u53EA\u8BFB\uFF1B\u7ED3\u679C\u76F4\u63A5\u5728\u5F53\u524D\u5BF9\u8BDD\u4E2D\u8FD4\u56DE\uFF0C\u4E0D\u751F\u6210\u6587\u4EF6\u3002",
      en: "Verify every time-sensitive venue fact online and record the verification date. Prefer official venue pages, Aims and Scope/Call for Papers, author guides, submission systems, publishers, authoritative indexes, and official fee pages. Third-party pages may assist but never replace official or authoritative sources. Treat manuscript files as read-only and return the result directly in the current conversation without generating files."
    },
    styleBranches: {
      conference: {
        zh: `\u5F53\u524D\u76EE\u6807\u4E3A\u4F1A\u8BAE\u3002\u6838\u9A8C\u5019\u9009\u4F1A\u8BAE/track \u7684\u4E3B\u9898\u8303\u56F4\u3001\u8BBA\u6587\u7C7B\u578B\u3001\u533F\u540D\u4E0E\u53CC\u76F2\u89C4\u5219\u3001\u6B63\u6587\u9875\u6570\u6216\u5B57\u6570\u3001\u53C2\u8003\u6587\u732E\u4E0E\u9644\u5F55/\u8865\u5145\u6750\u6599\u653F\u7B56\u3001\u53CC\u91CD\u6295\u7A3F\u3001\u4F26\u7406\u4E0E\u53EF\u590D\u73B0\u8981\u6C42\u3001\u6295\u7A3F\u5165\u53E3\u3001\u65F6\u533A\u3001\u5173\u952E\u65E5\u671F\u53CA\u5F53\u524D\u5C4A\u6B21\u72B6\u6001\u3002
\u4F18\u5148\u5B98\u65B9 Call for Papers\u3001\u4F5C\u8005\u6307\u5357\u548C\u4F1A\u8BAE\u7EC4\u7EC7\u65B9\u9875\u9762\uFF1B\u5386\u53F2\u5F55\u53D6\u7387\u53EA\u80FD\u5728\u5B98\u65B9\u6216\u53EF\u6838\u9A8C\u6765\u6E90\u660E\u786E\u63D0\u4F9B\u65F6\u8BB0\u5F55\u3002\u4E0D\u5F97\u628A\u65E7\u5C4A\u89C4\u5219\u5F53\u4F5C\u5F53\u524D\u5C4A\u89C4\u5219\u3002`,
        en: `The current target is a conference. Verify scope and track, paper type, anonymity and double-blind rules, main-text page or word limits, references and appendix/supplement policy, dual-submission rules, ethics and reproducibility requirements, submission portal, time zone, key dates, and current-edition status.
Prioritize the official Call for Papers, author guide, and organizer pages. Record historical acceptance rates only when an official or verifiable source provides them. Never treat a previous edition's rules as current.`
      },
      journal: {
        zh: `\u5F53\u524D\u76EE\u6807\u4E3A\u671F\u520A\u3002\u6838\u9A8C\u671F\u520A\u5168\u540D\u3001\u51FA\u7248\u793E\u3001Aims and Scope\u3001\u5F53\u524D\u53EF\u6295\u7A3F\u72B6\u6001\u3001\u6587\u7AE0\u7C7B\u578B\u3001SCIE/SSCI/ESCI \u7B49\u6536\u5F55\u3001\u53EF\u6838\u9A8C\u7684 JCR \u5E74\u4EFD/\u7C7B\u522B/\u5206\u533A\u4E0E Journal Impact Factor\u3001OA \u6A21\u5F0F\u3001APC \u4E0E\u5E01\u79CD\u3001\u7BC7\u5E45/\u56FE\u8868/\u6458\u8981/\u53C2\u8003\u6587\u732E\u8981\u6C42\u3001\u9644\u52A0\u6587\u4EF6\u3001\u6295\u7A3F\u5165\u53E3\u548C\u6570\u636E\u653F\u7B56\u3002
\u4E0D\u5F97\u628A CiteScore\u3001SJR\u3001Scopus \u5206\u533A\u5199\u6210 JCR Journal Impact Factor \u6216 JCR \u5206\u533A\uFF0C\u4E5F\u4E0D\u5F97\u6DF7\u5199\u4E2D\u79D1\u9662\u5206\u533A\u3002\u82E5\u8981\u6C42\u7EFC\u8FF0\u6587\u7AE0\uFF0C\u53EA\u80FD\u4EE5\u5F53\u524D\u5B98\u7F51 Author Guidelines \u6216 Article Types \u9875\u9762\u660E\u786E\u63A5\u53D7 Review/Survey \u4E3A\u4F9D\u636E\uFF0C\u4E0D\u80FD\u4EC5\u51ED\u5386\u53F2\u4E0A\u53D1\u8868\u8FC7\u7EFC\u8FF0\u63A8\u65AD\u3002\u5BA1\u7A3F\u5468\u671F\u3001\u51FA\u7248\u9891\u7387\u6216\u63A5\u6536\u7387\u53EA\u6709\u5B98\u7F51\u660E\u786E\u63D0\u4F9B\u65F6\u624D\u8BB0\u5F55\u3002`,
        en: `The current target is a journal. Verify full title, publisher, Aims and Scope, current submission status, article type, SCIE/SSCI/ESCI indexing, verifiable JCR year/category/quartile and Journal Impact Factor, OA model, APC and currency, length/figure/abstract/reference requirements, additional files, submission portal, and data policies.
Never present CiteScore, SJR, or Scopus quartiles as the JCR Journal Impact Factor or JCR quartile, and never mix CAS rankings with JCR. If review articles are required, rely only on a current official Author Guidelines or Article Types page that explicitly accepts Review/Survey submissions; prior publication of a review is not sufficient evidence. Record review time, publication frequency, or acceptance rate only when the official site explicitly provides it.`
      }
    },
    tasks: [
      {
        heading: {
          zh: "A. \u5EFA\u7ACB Manuscript\u2013Venue Profile",
          en: "A. Build the Manuscript\u2013Venue Profile"
        },
        body: {
          zh: "\u4ECE\u7EC8\u7A3F\u63D0\u53D6\u9886\u57DF\u3001\u5B50\u9886\u57DF\u3001\u4EFB\u52A1\u3001\u6570\u636E\u5F62\u6001\u3001\u65B9\u6CD5\u8303\u5F0F\u3001\u8D21\u732E\u7C7B\u578B\u3001\u7406\u8BBA/\u65B9\u6CD5/\u7CFB\u7EDF/\u5E94\u7528\u5C5E\u6027\u3001\u76EE\u6807\u8BFB\u8005\u3001\u56FE\u8868\u4E0E\u53C2\u8003\u6587\u732E\u89C4\u6A21\u3001\u8865\u5145\u6750\u6599\u3001\u8BC1\u636E\u5F3A\u5EA6\u3001\u4E3B\u8981\u5356\u70B9\u548C\u6700\u53EF\u80FD\u7684 desk-reject/triage \u98CE\u9669\u3002\u4E0D\u5F97\u4E3A\u4E86\u5339\u914D venue \u91CD\u65B0\u5B9A\u4E49\u8BBA\u6587\u4E3B\u7EBF\u3002",
          en: "Extract field, subfield, task, data modality, method paradigm, contribution type, theoretical/method/system/application character, audience, visual and reference scale, supplementary material, evidence strength, strongest selling point, and likely desk-reject/triage risks. Do not redefine the scientific throughline to fit a venue."
        }
      },
      {
        heading: {
          zh: "B. \u5148\u5EFA\u7ACB\u5019\u9009\u6C60\uFF0C\u518D\u9010\u9879\u6838\u9A8C",
          en: "B. Build a Candidate Pool, Then Verify It"
        },
        body: {
          zh: "\u5EFA\u7ACB 10\u201315 \u4E2A\u5019\u9009\uFF0C\u9010\u9879\u6838\u9A8C\u540D\u79F0\u3001\u5B98\u65B9\u94FE\u63A5\u3001\u8303\u56F4\u5339\u914D\u3001\u5F53\u524D\u662F\u5426\u6B63\u5E38\u63A5\u6536\u6295\u7A3F\u3001\u6587\u7AE0/track \u7C7B\u578B\u3001\u5F53\u524D\u6536\u5F55\u6216\u7B49\u7EA7\u4FE1\u606F\u3001\u7BC7\u5E45\u4E0E\u9644\u5F55\u653F\u7B56\u3001\u8D39\u7528\u3001\u989D\u5916\u6750\u6599\u3001\u6295\u7A3F\u5165\u53E3\u548C\u6240\u6709\u5F71\u54CD\u6295\u7A3F\u7684\u89C4\u5219\u3002\u6BCF\u4E2A\u5F53\u524D\u4E8B\u5B9E\u90FD\u9644\u5B98\u65B9\u6216\u6743\u5A01\u6765\u6E90\uFF1B\u65E0\u6CD5\u6838\u9A8C\u5C31\u660E\u786E\u5199\u201C\u672A\u6838\u9A8C\u201D\u3002\u5DF2\u505C\u520A\u3001\u4EC5\u4FDD\u7559\u5386\u53F2\u9875\u9762\u3001\u8F6C\u6295\u4E13\u7528\u6216\u5F53\u524D\u65E0\u6CD5\u6B63\u5E38\u6295\u7A3F\u7684 venue \u4E0D\u5F97\u8FDB\u5165\u63A8\u8350\u68AF\u961F\u3002MDPI\u3001Hindawi \u548C Frontiers \u662F\u7528\u6237\u660E\u786E\u6392\u9664\u9879\uFF0C\u5176\u65D7\u4E0B\u671F\u520A\u4E0D\u5F97\u8FDB\u5165\u5019\u9009\u6C60\u3001\u8BC4\u5206\u6216\u63A8\u8350\u68AF\u961F\uFF0C\u53EA\u5728\u6392\u9664\u8BB0\u5F55\u4E2D\u6CE8\u660E\u201C\u7528\u6237\u6392\u9664\u201D\uFF0C\u4E0D\u5F97\u4F5C\u65E0\u4F9D\u636E\u7684\u6CDB\u5316\u8D28\u91CF\u5B9A\u6027\u3002",
          en: "Build a pool of 10\u201315 candidates. For each, verify name, official link, scope fit, whether it is active and currently accepting normal submissions, article/track type, current indexing or ranking information, length and appendix policy, fees, additional materials, submission portal, and every rule that affects submission. Cite an official or authoritative source for each current fact and mark anything unresolved as 'Not verified.' Do not recommend venues that have ceased publication, retain only an archive page, accept transfer-only submissions, or are otherwise not open for normal submission. MDPI, Hindawi, and Frontiers are explicit user exclusions: do not place their journals in the pool, scoring, or recommendation tiers. Record them only as 'excluded by user' without unsupported general quality claims."
        }
      },
      {
        heading: {
          zh: "C. \u8BC4\u5206\u5339\u914D\u5EA6\u4E0E\u98CE\u9669",
          en: "C. Score Fit and Risk"
        },
        body: {
          zh: "\u4F7F\u7528 100 \u5206\u6A21\u578B\uFF1A\u4E3B\u9898\u8303\u56F4 30\u3001\u8D21\u732E\u7C7B\u578B 20\u3001\u8BC1\u636E\u6210\u719F\u5EA6 15\u3001\u76EE\u6807\u7B49\u7EA7/\u5206\u533A 15\u3001\u7BC7\u5E45\u548C\u6750\u6599\u517C\u5BB9 10\u3001\u8D39\u7528/\u65F6\u95F4\u7EA6\u675F 5\u3001\u62D2\u7A3F\u6216\u7ADE\u4E89\u98CE\u9669 5\u3002\u9010\u9879\u7ED9\u51FA\u7406\u7531\uFF0C\u4E0D\u80FD\u628A\u540D\u6C14\u6216\u5206\u533A\u76F4\u63A5\u7B49\u540C\u4E8E\u5339\u914D\u5EA6\u3002",
          en: "Use a 100-point model: topical scope 30, contribution type 20, evidence maturity 15, target tier/quartile 15, length and material compatibility 10, fee/timeline constraints 5, and rejection or competition risk 5. Explain every score. Do not equate prestige or quartile directly with fit."
        }
      },
      {
        heading: {
          zh: "D. \u5F62\u6210\u6295\u7A3F\u68AF\u961F\u4E0E\u8F6C\u6295\u8DEF\u5F84",
          en: "D. Build Submission Tiers and Transfer Paths"
        },
        body: {
          zh: "\u7ED9\u51FA\u9996\u9009 3 \u4E2A\u3001\u7A33\u59A5\u5907\u9009 3 \u4E2A\u3001\u4E0D\u5EFA\u8BAE\u4F46\u5BB9\u6613\u8BEF\u9009\u7684 2\u20134 \u4E2A\u3001\u552F\u4E00\u9996\u63A8\u53CA\u7406\u7531\u3002\u4E3A\u9996\u9009\u9010\u4E00\u5206\u6790\u8303\u56F4\u3001\u521B\u65B0\u6027\u3001\u5B9E\u9A8C\u3001\u7BC7\u5E45\u3001\u89C4\u5219\u4E0E\u5199\u4F5C\u98CE\u9669\uFF0C\u5E76\u7ED9\u51FA\u6295\u7A3F\u524D\u6700\u540E\u6838\u9A8C\u4E8B\u9879\u548C\u88AB\u62D2\u540E\u7684\u987A\u5E8F\u5316\u8F6C\u6295\u8DEF\u5F84\u3002",
          en: "Return three first-choice venues, three safer alternatives, two to four tempting but unsuitable venues, and one top recommendation with rationale. For each first choice, analyze scope, novelty, evidence, length, policy, and writing risks, then provide final pre-submission checks and an ordered transfer path after rejection."
        }
      },
      {
        heading: {
          zh: "E. \u4FDD\u6301\u8BBA\u6587\u6587\u4EF6\u53EA\u8BFB",
          en: "E. Keep Manuscript Files Read-only"
        },
        body: {
          zh: "\u4E0D\u5F97\u590D\u5236\u3001\u5F52\u6863\u3001\u91CD\u547D\u540D\u6216\u6539\u5199\u8F93\u5165\u8BBA\u6587\uFF0C\u4E5F\u4E0D\u5F97\u751F\u6210 .tex\u3001.md \u6216\u5176\u4ED6\u4E0B\u8F7D\u6587\u4EF6\u3002\u82E5\u53D1\u73B0\u660E\u786E\u9519\u8BEF\uFF0C\u53EA\u5728\u5F53\u524D\u5BF9\u8BDD\u7684\u4E2D\u6587\u7ED3\u679C\u4E2D\u63D0\u51FA\u3002",
          en: "Do not copy, archive, rename, or rewrite the input manuscript, and do not generate .tex, .md, or other downloadable files. Report confirmed errors only in the Chinese result returned in the current conversation."
        }
      }
    ],
    deliverables: {
      zh: "\u76F4\u63A5\u5728\u5F53\u524D\u5BF9\u8BDD\u4E2D\u7ED9\u51FA\u5B8C\u6574\u4E2D\u6587\u68C0\u7D22\u7ED3\u679C\uFF0C\u4E0D\u751F\u6210\u6216\u4E0B\u8F7D .tex\u3001.md \u6216\u5176\u4ED6\u6587\u4EF6\u3002\u7ED3\u679C\u5305\u542B\u6838\u9A8C\u65E5\u671F\u3001\u7EA6\u675F/\u5047\u8BBE\u3001Manuscript\u2013Venue Profile\u3001\u5019\u9009\u6C60\u3001\u6765\u6E90\u3001\u6392\u9664\u8FC7\u7A0B\u3001\u8BC4\u5206\u3001\u9996\u9009/\u5907\u9009/\u4E0D\u5EFA\u8BAE\u3001\u552F\u4E00\u9996\u63A8\u3001\u9010\u9879\u98CE\u9669\u3001\u89C4\u5219\u6458\u8981\u3001\u6295\u7A3F\u987A\u5E8F\u3001\u8F6C\u6295\u8DEF\u5F84\u3001\u672A\u6838\u9A8C\u4FE1\u606F\uFF0C\u4EE5\u53CA\u672A\u6539\u7A3F\u3001\u672A\u751F\u6210\u6587\u4EF6\u7684\u58F0\u660E\u3002",
      en: "Return the complete Chinese targeting result directly in the current conversation; do not generate or download any .tex, .md, or other file. Include the verification date, constraints/assumptions, Manuscript\u2013Venue Profile, candidate pool, sources, exclusion process, scores, first choices, alternatives, unsuitable venues, one top recommendation, itemized risks, policy summary, submission order, transfer path, unverified information, and statements that the manuscript was unchanged and no file was generated."
    },
    finalChecks: {
      zh: `- \u5DF2\u5B8C\u6574\u8BFB\u53D6\u7EC8\u7A3F\u5E76\u5EFA\u7ACB\u771F\u5B9E\u8BBA\u6587\u753B\u50CF\u3002
- \u5F53\u524D venue \u4FE1\u606F\u5747\u6709\u5B98\u65B9\u6216\u6743\u5A01\u6765\u6E90\u4E0E\u6838\u9A8C\u65E5\u671F\u3002
- \u672A\u6DF7\u6DC6\u4E0D\u540C\u7D22\u5F15\u3001\u5206\u533A\u3001\u5C4A\u6B21\u6216\u5386\u53F2\u89C4\u5219\u3002
- \u672A\u58F0\u79F0\u65E0\u6CD5\u6838\u9A8C\u7684\u8D39\u7528\u3001\u5F55\u53D6\u7387\u6216\u5BA1\u7A3F\u5468\u671F\u3002
- \u5DF2\u7ED9\u51FA\u9996\u9009\u3001\u5907\u9009\u3001\u6392\u9664\u3001\u98CE\u9669\u548C\u8F6C\u6295\u8DEF\u5F84\u3002
- \u672A\u66F4\u6362\u6A21\u677F\u3001\u672A\u4FEE\u6539\u6B63\u6587\u3001\u672A\u751F\u6210\u6587\u4EF6\u3002`,
      en: `- The final manuscript was read completely and profiled accurately.
- Every current venue fact has an official or authoritative source and verification date.
- Indexes, quartiles, editions, and historical rules were not conflated.
- No unverified fee, acceptance rate, or review time was claimed.
- First choices, alternatives, exclusions, risks, and transfer paths were provided.
- The template and manuscript prose were not changed, and no file was generated.`
    }
  }
];
var RECONSTRUCTION_PROMPTS = PROMPT_TEMPLATES.filter(
  (template) => template.profile === "manuscript"
);
var SUBMISSION_PROMPT_TEMPLATE = PROMPT_TEMPLATES.find(
  (template) => template.profile === "targeting"
);

// content/prompts/constraints.ts
var PROMPT_STEP_POLICIES = {
  "scientific-positioning": {
    temporaryMainTextCeilingMultiplier: 1.2,
    protectedSectionIds: ["method", "experiments-results"],
    appendixTriage: {
      enabled: {
        zh: "\u5F53\u524D\u914D\u7F6E\u53EA\u5141\u8BB8\u3001\u5E76\u4E0D\u8981\u6C42\u4F7F\u7528\u9644\u5F55\u3002\u82E5\u6B63\u6587\u80FD\u591F\u6EE1\u8DB3\u5F53\u524D\u9002\u7528\u7684\u603B\u91CF\u4E0E\u7AE0\u8282\u9884\u7B97\uFF0C\u4E0D\u5F97\u4F7F\u7528\u9644\u5F55\uFF1B\u53EA\u6709\u53D7\u9650\u7AE0\u8282\u4ECD\u8D85\u989D\uFF0C\u4E14\u9010\u9879\u5206\u6790\u786E\u8BA4\u5185\u5BB9\u5E76\u975E\u79D1\u5B66\u4E3B\u7EBF\u6240\u5FC5\u9700\u65F6\uFF0C\u624D\u53EF\u8003\u8651\u79FB\u5165\u9644\u5F55\u3002\u9664 {{protected_sections}} \u5916\uFF0C\u79FB\u52A8\u4EFB\u4F55\u5185\u5BB9\u90FD\u4E0D\u5F97\u524A\u5F31\u5B9A\u4E49\u5B8C\u6574\u6027\u548C\u8BBA\u8BC1\u95ED\u73AF\uFF0C\u4E14\u6B63\u6587\u5FC5\u987B\u4FDD\u6301\u81EA\u6D3D\u3002",
        en: "The current configuration permits but does not require an appendix. Do not use one when the main text satisfies every applicable total and section budget. Consider moving material only when a limited section remains over budget and itemized review confirms that it is not essential to the scientific throughline. Outside {{protected_sections}}, no move may weaken complete definitions or argumentative closure, and the main text must remain self-contained."
      },
      disabled: {
        zh: "\u5F53\u524D\u914D\u7F6E\u672A\u542F\u7528\u9644\u5F55\uFF1A\u4E0D\u5F97\u628A\u4EFB\u4F55\u5185\u5BB9\u8F6C\u79FB\u5230\u9644\u5F55\u3002\u53D7\u9650\u7AE0\u8282\u8D85\u989D\u65F6\uFF0C\u5E94\u5220\u9664\u91CD\u590D\u3001\u5408\u5E76\u975E\u6838\u5FC3\u53D9\u8FF0\u6216\u5728\u62A5\u544A\u4E2D\u767B\u8BB0\u98CE\u9669\uFF0C\u5E76\u9075\u5B88\u5F53\u524D\u9002\u7528\u7684\u7AE0\u8282\u9884\u7B97\uFF1B\u82E5\u5F53\u524D\u6A21\u5F0F\u53E6\u6709\u603B\u91CF\u6216\u4E34\u65F6\u4E0A\u9650\uFF0C\u4E5F\u5FC5\u987B\u9075\u5B88\u3002",
        en: "The current configuration disables the appendix. Do not move material outside the main text. When a limited section is over budget, remove repetition, consolidate non-core exposition, or record the risk, while respecting every applicable section budget and any total or temporary ceiling defined by the current mode."
      }
    }
  }
};
var SOURCE_BUDGET_REFERENCE = {
  total: 5e3,
  totalRange: [4850, 5150],
  sections: {
    abstract: { target: 200, range: [190, 220] },
    introduction: { target: 520, range: [500, 560] },
    "related-work": { target: 450, range: [420, 480] },
    method: { target: 1500, range: [1450, 1600] },
    "experiments-results": { target: 1650, range: [1570, 1730] },
    discussion: { target: 480, range: [440, 520] },
    conclusion: { target: 200, range: [180, 220] }
  }
};
var PROMPT_DETAILED_CONSTRAINTS = {
  "scientific-positioning": {
    core: {
      zh: `### Scientific Positioning Contract \u5FC5\u987B\u9010\u9879\u56DE\u7B54

1. Task\uFF1A\u5177\u4F53\u4EFB\u52A1\u3001\u8F93\u5165\u3001\u8F93\u51FA\u548C\u9002\u7528\u8FB9\u754C\uFF1B
2. Scientific problem\uFF1A\u771F\u6B63\u9700\u8981\u89E3\u51B3\u7684\u79D1\u5B66\u95EE\u9898\uFF0C\u800C\u4E0D\u662F\u6A21\u5757\u540D\uFF1B
3. Current gap\uFF1A\u8FD1\u5E74\u5DE5\u4F5C\u4ECD\u672A\u89E3\u51B3\u4E14\u672C\u6587\u5B9E\u9645\u9488\u5BF9\u7684\u7F3A\u53E3\uFF1B
4. Core idea\uFF1A\u4E00\u53E5\u80FD\u8131\u79BB\u6A21\u5757\u540D\u79F0\u4ECD\u7136\u6210\u7ACB\u7684\u6838\u5FC3\u601D\u60F3\uFF1B
5. Computational realization\uFF1A\u5B9E\u73B0\u6838\u5FC3\u601D\u60F3\u7684\u8BA1\u7B97\u673A\u5236\uFF1B
6. Primary claims\uFF1A\u6700\u7EC8\u6700\u591A\u4FDD\u7559 2\u20134 \u4E2A\u53EF\u7531\u8BC1\u636E\u652F\u6301\u7684\u4E3B\u8981 claim\uFF1B
7. Evidence\uFF1A\u6BCF\u4E2A claim \u5BF9\u5E94\u7684\u8868\u3001\u56FE\u3001\u5B9E\u9A8C\u6216\u5206\u6790\uFF1B
8. Boundaries\uFF1A\u4E0D\u80FD\u63A8\u5E7F\u7684\u6761\u4EF6\uFF0C\u4EE5\u53CA\u53EA\u80FD\u5199\u6210\u89C2\u5BDF\u6216\u63A8\u65AD\u7684\u7ED3\u8BBA\u3002

### \u8BBA\u6587\u6807\u9898\u4E0E\u54C1\u724C\u7F29\u5199

- \u5728\u5B8C\u6210\u5168\u6587\u7406\u89E3\u4E0E\u79D1\u5B66\u5B9A\u4F4D\u540E\uFF0C\u76F4\u63A5\u786E\u5B9A\u4E00\u4E2A\u6700\u7EC8\u82F1\u6587\u6807\u9898\u5E76\u5199\u5165 TeX\uFF0C\u4E0D\u63D0\u4F9B\u5019\u9009\u6807\u9898\uFF1B
- \u6807\u9898\u4F7F\u7528\u6807\u9898\u5F0F\u5927\u5C0F\u5199\uFF0C\u6700\u591A\u4E00\u4E2A\u5192\u53F7\uFF0C\u4E0D\u4EE5\u53E5\u53F7\u7ED3\u5C3E\uFF1B\u51C6\u786E\u8868\u8FBE\u4EFB\u52A1\u3001\u6838\u5FC3\u601D\u60F3\u548C\u9002\u7528\u8303\u56F4\uFF0C\u4E0D\u4F7F\u7528\u65E0\u8BC1\u636E\u7684\u6027\u80FD\u3001\u4F18\u5148\u6027\u6216\u5BA3\u4F20\u6027\u4E3B\u5F20\uFF1B
- \u9664\u975E\u8BBA\u6587\u8303\u56F4\u786E\u5B9E\u4F9D\u8D56\u67D0\u4E2A\u6570\u636E\u96C6\uFF0C\u5426\u5219\u6807\u9898\u4E0D\u5199\u6570\u636E\u96C6\u540D\u79F0\uFF1B
- \u76F4\u63A5\u786E\u5B9A\u4E00\u4E2A 4\u20137 \u4E2A\u62C9\u4E01\u5B57\u6BCD\u7684\u8BBA\u6587\u54C1\u724C\u7F29\u5199\uFF0C\u5E76\u4E0E\u65B9\u6CD5\u5168\u79F0\u3001\u6838\u5FC3\u601D\u60F3\u81EA\u7136\u5BF9\u5E94\uFF1B\u4F18\u5148\u53EF\u8BFB\u3001\u53EF\u53D1\u97F3\u3001\u6613\u68C0\u7D22\uFF0C\u4E0D\u5F97\u4E3A\u51D1\u5B57\u6BCD\u5F3A\u9020\u53CD\u5411\u7F29\u5199\uFF1B
- \u6838\u67E5\u8BE5\u7F29\u5199\u662F\u5426\u4E0E\u5F53\u524D .bib\u3001\u6700\u8FD1\u90BB\u5DE5\u4F5C\u6216\u672C\u9886\u57DF\u5E38\u89C1\u65B9\u6CD5\u660E\u663E\u51B2\u7A81\uFF1B\u4E00\u7ECF\u786E\u5B9A\uFF0C\u5168\u6587\u53EA\u4F7F\u7528\u8FD9\u4E00\u54C1\u724C\u7F29\u5199\u3002
{{title_word_limits}}

### \u552F\u4E00\u672F\u8BED\u4F53\u7CFB

- \u51BB\u7ED3\u65B9\u6CD5\u5168\u79F0\u548C\u4E0A\u8FF0\u8BBA\u6587\u54C1\u724C\u7F29\u5199\uFF1B
- \u51BB\u7ED3\u79D1\u5B66\u95EE\u9898\u540D\u79F0\u53CA\u6838\u5FC3\u8868\u793A\u3001\u6A21\u5757\u3001\u5206\u652F\u3001\u67E5\u8BE2\u3001\u635F\u5931\u3001\u8BAD\u7EC3\u548C\u63A8\u7406\u672F\u8BED\uFF1B
- \u51BB\u7ED3\u6570\u636E\u96C6\u3001\u6307\u6807\u3001\u6BD4\u8F83\u8BBE\u7F6E\u548C\u5B9E\u9A8C\u7C7B\u578B\u540D\u79F0\uFF1B
- \u5217\u51FA\u7981\u6B62\u7EE7\u7EED\u4F7F\u7528\u7684\u5197\u4F59\u540C\u4E49\u8BCD\uFF1B
- \u5217\u51FA\u76F8\u8FD1\u4F46\u5FC5\u987B\u533A\u5206\u3001\u4E0D\u80FD\u5408\u5E76\u7684\u6982\u5FF5\u3002

### \u7AE0\u8282\u529F\u80FD\u4E0E\u56FA\u5B9A\u7ED3\u6784

{{scientific_document_hierarchy}}
- Abstract\uFF1A\u672C\u8F6E\u53EA\u5F62\u6210\u4E0E\u4E3B\u7EBF\u4E00\u81F4\u7684\u4E34\u65F6\u7248\u672C\uFF0C\u7B2C\u4E09\u6B65\u5C06\u4ECE\u96F6\u91CD\u5199\uFF1B
- Introduction\uFF1A\u6070\u597D\u516D\u4E2A\u8FDE\u7EED\u6BB5\u843D\uFF0CP1\u2013P6 \u4F9D\u6B21\u627F\u62C5\u80CC\u666F\u4E0E\u4EFB\u52A1\u3001\u76F8\u5173\u8DEF\u7EBF\u4E0E\u7F3A\u53E3\u3001\u95EE\u9898\u4E0E\u6311\u6218\u3001\u65B9\u6CD5\u6982\u89C8\u3001\u4E09\u70B9\u8D21\u732E\u3001\u8BBA\u6587\u7ED3\u6784\uFF1B\u4E0D\u5F97\u6539\u6210\u4E03\u6BB5\u6216\u516B\u6BB5\uFF1B
{{scientific_related_work_structure}}
{{scientific_method_structure}}
{{scientific_experiment_structure}}
{{scientific_discussion_structure}}
- Conclusion\uFF1A\u6070\u597D\u4E24\u4E2A\u666E\u901A\u6BB5\u843D\uFF1B\u7B2C\u4E00\u6BB5\u6536\u675F\u95EE\u9898\u3001\u6838\u5FC3\u601D\u60F3\u548C\u4E3B\u8981\u53D1\u73B0\uFF0C\u7B2C\u4E8C\u6BB5\u8BF4\u660E\u610F\u4E49\u3001\u8FB9\u754C\u548C\u672A\u6765\u65B9\u5411\u3002

### \u56FE\u8868\u63A5\u53E3\u4E0E\u5B8F\u89C2\u91CD\u5199\u8FB9\u754C

- \u4E3A\u6846\u67B6\u56FE\u3001\u673A\u5236\u56FE\u3001\u4E3B\u7ED3\u679C\u8868\u3001\u6D88\u878D\u8868\u3001\u6548\u7387/\u7A33\u5065\u6027/\u6848\u4F8B\u56FE\u5206\u522B\u6307\u5B9A\u6240\u652F\u6301\u7684\u6838\u5FC3\u601D\u60F3\u3001\u673A\u5236\u3001claim \u6216\u8FB9\u754C\uFF1B
- caption \u548C\u6B63\u6587\u5FC5\u987B\u89E3\u91CA\u56FE\u8868\uFF0C\u800C\u975E\u53EA\u63D0\u5230\u56FE\u8868\uFF1B
- \u5141\u8BB8\u91CD\u6392\u7AE0\u8282\u548C\u6BB5\u843D\u3001\u5408\u5E76\u91CD\u590D\u5C0F\u8282\u3001\u5220\u9664\u504F\u79BB\u4E3B\u7EBF\u5185\u5BB9\u3001\u91CD\u5199\u5F00\u5934\u4E0E\u4E3B\u9898\u53E5\u3001\u91CD\u6784\u8D21\u732E\u3001\u8C03\u6574 Method/Experiments \u5206\u5DE5\u5E76\u5EFA\u7ACB\u72EC\u7ACB Discussion\uFF1B
- \u4E0D\u5F97\u66F4\u6362\u6A21\u677F\uFF0C\u4E0D\u5F97\u7528\u65B0\u6A21\u5757\u6216\u65B0\u5B9E\u9A8C\u586B\u8865\u8BC1\u636E\u7F3A\u53E3\u3002

### \u4E2D\u6587\u62A5\u544A\u56FA\u5B9A\u6E05\u5355

\u62A5\u544A\u5FC5\u987B\u5305\u542B\uFF1AScientific Positioning Contract\u3001\u6700\u7EC8\u6807\u9898\u4E0E\u8BBA\u6587\u54C1\u724C\u7F29\u5199\u53CA\u5176\u4F9D\u636E\u3001\u4E00\u53E5\u8BDD\u8BBA\u6587\u4E3B\u65E8\u3001\u4E00\u53E5\u8BDD\u6838\u5FC3\u75DB\u70B9\u3001\u65E7/\u65B0\u4E3B\u7EBF\u5BF9\u7167\u3001\u8D21\u732E\u5206\u5C42\u3001Claim\u2013Evidence Map\u3001\u6700\u7EC8\u672F\u8BED\u8868\u3001\u7AE0\u8282\u529F\u80FD\u8868\u3001\u56FE\u8868\u89D2\u8272\u8868\u3001\u5220\u9664/\u5408\u5E76/\u79FB\u52A8/\u65B0\u589E\u6E05\u5355\u3001\u8054\u7F51\u6838\u9A8C\u3001\u4F5C\u8005\u9700\u786E\u8BA4\u9879\u548C\u4E0B\u4E00\u6B65\u4EA4\u63A5\u6458\u8981\u3002`,
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
- Determine one 4\u20137-letter paper brand acronym that maps naturally to the full method name and core idea. Prefer a readable, pronounceable, searchable form and never force a backronym merely to fit desired letters;
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
- Introduction: exactly six consecutive paragraphs. P1\u2013P6 cover background/task, research lines/gap, problem/challenges, method overview, three contributions, and paper organization. Do not create seven or eight paragraphs;
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

The report must contain the Scientific Positioning Contract, the final title and paper brand acronym with rationale, one-sentence thesis, one-sentence core pain point, old/new throughline comparison, contribution hierarchy, Claim\u2013Evidence Map, final terminology table, section-function table, visual-role table, deletion/merge/move/addition log, web verification, author-confirmation items, and next-step handoff.`
    },
    inlineStyleConstraints: [
      {
        marker: "scientific_document_hierarchy",
        branches: {
          conference: {
            zh: "- \u4F1A\u8BAE\u8BBA\u6587\u9700\u8981\u7B2C\u4E09\u5C42\u6807\u9898\u65F6\u4F7F\u7528 paragraph \u800C\u975E subsubsection\uFF1Bparagraph \u6807\u9898\u53EA\u547D\u540D\u771F\u5B9E\u79D1\u5B66\u5BF9\u8C61\u3001\u673A\u5236\u3001\u5B9E\u9A8C\u8BBE\u7F6E\u6216\u5206\u6790\u4E3B\u9898\uFF0C\u666E\u901A\u8BBA\u8FF0\u4EE5\u4E3B\u9898\u53E5\u3001\u8FC7\u6E21\u548C\u8FDE\u7EED\u6BB5\u843D\u5C55\u5F00\uFF1B",
            en: "- In a conference paper, use paragraph rather than subsubsection when a third-level heading is genuinely needed. Let paragraph headings name scientific objects, mechanisms, experimental settings, or analysis themes, while ordinary exposition develops through topic sentences, transitions, and continuous prose;"
          },
          journal: {
            zh: "- \u671F\u520A\u8BBA\u6587\u76EE\u5F55\u5C42\u7EA7\u9ED8\u8BA4\u6B62\u4E8E subsubsection\uFF1B\u5176\u4E0B\u7528\u4E3B\u9898\u53E5\u3001\u8FC7\u6E21\u548C\u81EA\u7136\u6BB5\u7EC4\u7EC7\u8FDE\u7EED\u8BBA\u8BC1\uFF0C\u4E0D\u628A Question\u3001Observation\u3001Design Purpose\u3001Scope \u7B49\u53D9\u8FF0\u529F\u80FD\u5347\u7EA7\u4E3A paragraph \u6807\u9898\uFF1B",
            en: "- In a journal paper, stop the heading hierarchy at subsubsection by default. Below it, build a continuous argument with topic sentences, transitions, and natural paragraphs rather than promoting discourse functions such as Question, Observation, Design Purpose, or Scope into paragraph headings;"
          }
        }
      },
      {
        marker: "scientific_related_work_structure",
        branches: {
          conference: {
            zh: "- Related Work\uFF1A\u6070\u597D\u4E09\u4E2A subsection\uFF0C\u6BCF\u4E2A\u5C0F\u8282\u6070\u597D\u4E00\u4E2A\u666E\u901A\u6BB5\u843D\uFF1B\u6309\u7814\u7A76\u8303\u5F0F\u3001\u5047\u8BBE\u6216\u5173\u952E\u6743\u8861\u7EFC\u5408\u7EC4\u7EC7\uFF0C\u7981\u6B62\u9010\u7BC7\u6D41\u6C34\u8D26\uFF1B",
            en: "- Related Work: exactly three subsections with exactly one ordinary paragraph each. Synthesize paradigms, assumptions, or key trade-offs; do not narrate papers serially;"
          },
          journal: {
            zh: "- Related Work\uFF1A\u6070\u597D\u4E09\u4E2A subsection\uFF0C\u6BCF\u4E2A\u5C0F\u8282\u6070\u597D\u4E24\u4E2A\u666E\u901A\u6BB5\u843D\uFF1B\u6309\u7814\u7A76\u8303\u5F0F\u3001\u5047\u8BBE\u6216\u5173\u952E\u6743\u8861\u7EFC\u5408\u7EC4\u7EC7\uFF0C\u7981\u6B62\u9010\u7BC7\u6D41\u6C34\u8D26\uFF1B",
            en: "- Related Work: exactly three subsections with exactly two ordinary paragraphs each. Synthesize paradigms, assumptions, or key trade-offs; do not narrate papers serially;"
          }
        }
      },
      {
        marker: "scientific_method_structure",
        branches: {
          conference: {
            zh: "- Method\uFF1A\u901A\u5E38\u5F62\u6210 5\u20136 \u4E2A\u63A5\u53E3\u6E05\u6670\u7684 subsection\uFF0C\u5305\u542B Problem Definition\u30012\u20133 \u4E2A\u6838\u5FC3\u673A\u5236\u4EE5\u53CA\u76EE\u6807/\u8BAD\u7EC3/\u63A8\u7406/\u590D\u6742\u5EA6\u8BF4\u660E\uFF1B\u4E0D\u5355\u8BBE Overview subsection\uFF0C\u5E94\u5728\u6700\u5408\u9002\u7684\u4F4D\u7F6E\u81EA\u7136\u5F15\u51FA\u603B\u4F53\u6846\u67B6\uFF1B\u4E0D\u5F97\u5199\u6210\u8BF4\u660E\u4E66\uFF0C\u800C\u8981\u56F4\u7ED5 why \u5F62\u6210\u878D\u5408\u6027\u7684\u79D1\u5B66\u6545\u4E8B\uFF0C\u4E0D\u8981\u6C42\u6BCF\u53E5\u8BDD\u673A\u68B0\u89E3\u91CA why\uFF1B\u4E0D\u5F97\u589E\u52A0\u65E0\u8BC1\u636E\u516C\u5F0F\u3001\u6A21\u5757\u6216\u7B97\u6CD5\uFF1B",
            en: "- Method: normally five to six clearly interfaced subsections covering Problem Definition, two to three core mechanisms, and objective/training/inference/complexity. Do not create a standalone Overview subsection; introduce the overall framework naturally where it best serves the argument. Build an integrated scientific story around why rather than a manual, without forcing every sentence to state a why. Add no unsupported equation, component, or algorithm;"
          },
          journal: {
            zh: "- Method\uFF1A\u901A\u5E38\u5F62\u6210 5\u20136 \u4E2A\u63A5\u53E3\u6E05\u6670\u7684 subsection\uFF0C\u5305\u542B Problem Definition\u3001\u72EC\u7ACB Overview\u30012\u20133 \u4E2A\u6838\u5FC3\u673A\u5236\u4EE5\u53CA\u76EE\u6807/\u8BAD\u7EC3/\u63A8\u7406/\u590D\u6742\u5EA6\u8BF4\u660E\uFF1BOverview \u6070\u597D\u4E24\u4E2A\u666E\u901A\u6BB5\u843D\uFF0C\u4E0D\u5F97\u9010\u9879\u590D\u8FF0\u6846\u67B6\u56FE\uFF1B\u4E0D\u5F97\u5199\u6210\u8BF4\u660E\u4E66\uFF0C\u800C\u8981\u56F4\u7ED5 why \u5F62\u6210\u878D\u5408\u6027\u7684\u79D1\u5B66\u6545\u4E8B\uFF0C\u4E0D\u8981\u6C42\u6BCF\u53E5\u8BDD\u673A\u68B0\u89E3\u91CA why\uFF1B\u4E0D\u5F97\u589E\u52A0\u65E0\u8BC1\u636E\u516C\u5F0F\u3001\u6A21\u5757\u6216\u7B97\u6CD5\uFF1B\n{{scientific_overview_word_limits}}",
            en: "- Method: normally five to six clearly interfaced subsections covering Problem Definition, a standalone Overview, two to three core mechanisms, and objective/training/inference/complexity. Overview contains exactly two ordinary paragraphs and must not narrate the framework figure item by item. Build an integrated scientific story around why rather than a manual, without forcing every sentence to state a why. Add no unsupported equation, component, or algorithm;\n{{scientific_overview_word_limits}}"
          }
        }
      },
      {
        marker: "scientific_experiment_structure",
        branches: {
          conference: {
            zh: "- Experiments and Results\uFF1A\u7B2C\u4E00\u5C0F\u8282\u5FC5\u987B\u4E3A Datasets and Experimental Setup\uFF0C\u5E76\u4F9D\u6B21\u4EE5 paragraph \u8BBE\u7F6E Datasets\u3001Experimental Configuration \u548C Baselines\uFF1B\u7B2C\u4E8C\u5C0F\u8282\u5FC5\u987B\u4E3A Main Results\u3002\u540E\u7EED\u5C0F\u8282\u4E0D\u7ED1\u5B9A\u56FA\u5B9A\u5E8F\u53F7\uFF0C\u6309\u771F\u5B9E\u8BC1\u636E\u5B89\u6392 Ablation Studies\u3001\u673A\u5236/\u6548\u7387/\u53C2\u6570\u3001Case Studies and Qualitative Analysis\u3001\u7A33\u5065\u6027\u3001\u654F\u611F\u6027\u3001\u6CDB\u5316\u6216\u9519\u8BEF\u5206\u6790\uFF1B",
            en: "- Experiments and Results: the first subsection must be Datasets and Experimental Setup, containing Datasets, Experimental Configuration, and Baselines as paragraph headings in that order; the second must be Main Results. Do not bind later subsections to fixed positions; order supported Ablation Studies, mechanism/efficiency/parameter analyses, Case Studies and Qualitative Analysis, robustness, sensitivity, generalization, or error analysis by evidence;"
          },
          journal: {
            zh: "- Experiments and Results\uFF1A\u7B2C\u4E00\u5C0F\u8282\u5FC5\u987B\u4E3A Datasets and Experimental Setup\uFF0C\u5E76\u4F9D\u6B21\u4EE5 subsubsection \u8BBE\u7F6E Datasets\u3001Experimental Configuration \u548C Baselines\uFF1B\u7B2C\u4E8C\u5C0F\u8282\u5FC5\u987B\u4E3A Main Results\u3002\u540E\u7EED\u5C0F\u8282\u4E0D\u7ED1\u5B9A\u56FA\u5B9A\u5E8F\u53F7\uFF0C\u6309\u771F\u5B9E\u8BC1\u636E\u5B89\u6392 Ablation Studies\u3001\u673A\u5236/\u6548\u7387/\u53C2\u6570\u3001Case Studies and Qualitative Analysis\u3001\u7A33\u5065\u6027\u3001\u654F\u611F\u6027\u3001\u6CDB\u5316\u6216\u9519\u8BEF\u5206\u6790\uFF1B",
            en: "- Experiments and Results: the first subsection must be Datasets and Experimental Setup, containing Datasets, Experimental Configuration, and Baselines as subsubsections in that order; the second must be Main Results. Do not bind later subsections to fixed positions; order supported Ablation Studies, mechanism/efficiency/parameter analyses, Case Studies and Qualitative Analysis, robustness, sensitivity, generalization, or error analysis by evidence;"
          }
        }
      },
      {
        marker: "scientific_discussion_structure",
        branches: {
          conference: {
            zh: "- Discussion and Limitations\uFF1A\u5148\u5B89\u6392\u4E09\u4E2A\u627F\u62C5\u7EFC\u5408\u89E3\u91CA\u3001\u9002\u7528\u8303\u56F4\u4E0E\u79D1\u5B66\u610F\u4E49\u7684 discussion subsection\uFF0C\u6700\u540E\u5355\u5217\u4E00\u4E2A Limitations subsection\u3002\u4E0D\u5F97\u590D\u8FF0\u5B9E\u9A8C\u7ED3\u679C\uFF0C\u4E0D\u5F15\u7528 Experiments \u4E2D\u7684\u8868\u683C\u6216\u56FE\u7247\uFF1B\u5177\u4F53\u7ED3\u679C\u6570\u5B57\u6700\u591A\u4FDD\u7559\u4E09\u4E2A\uFF0C\u4E0D\u5199\u6570\u5B57\u4E5F\u53EF\u4EE5\uFF1B\n{{scientific_limitations_word_limits}}",
            en: "- Discussion and Limitations: use three discussion subsections for synthesis, scope, and scientific implications, followed by a separate Limitations subsection. Do not repeat experimental results or cite tables or figures from Experiments; retain at most three specific result values, and using none is acceptable;\n{{scientific_limitations_word_limits}}"
          },
          journal: {
            zh: "- Discussion\uFF1A\u72EC\u7ACB\u6210\u8282\u5E76\u6070\u597D\u5305\u542B Mechanistic Interpretation\u3001Scope and Implications\u3001Limitations and Future Directions \u4E09\u4E2A subsection\uFF1B\u4E0D\u5F97\u590D\u8FF0\u5B9E\u9A8C\u7ED3\u679C\uFF0C\u4E0D\u5F15\u7528 Experiments \u4E2D\u7684\u8868\u683C\u6216\u56FE\u7247\uFF1B\u5177\u4F53\u7ED3\u679C\u6570\u5B57\u6700\u591A\u4FDD\u7559\u4E09\u4E2A\uFF0C\u4E0D\u5199\u6570\u5B57\u4E5F\u53EF\u4EE5\uFF1B",
            en: "- Discussion: a standalone section with exactly three subsections\u2014Mechanistic Interpretation, Scope and Implications, and Limitations and Future Directions. Do not repeat experimental results or cite tables or figures from Experiments; retain at most three specific result values, and using none is acceptable;"
          }
        }
      }
    ],
    inlineWordLimits: [
      {
        marker: "title_word_limits",
        standard: {
          zh: "- \u542F\u7528\u5B57\u6570\u9650\u5236\u65F6\uFF0C\u6807\u9898\u63A7\u5236\u5728 8\u201316 \u4E2A\u82F1\u6587\u5355\u8BCD\u3002",
          en: "- When a word limit is enabled, keep the title between 8 and 16 English words."
        }
      },
      {
        marker: "scientific_overview_word_limits",
        standard: {
          zh: "- \u542F\u7528\u5B57\u6570\u9650\u5236\u65F6\uFF0C\u671F\u520A Method \u7684 Overview \u603B\u8BA1\u4E0D\u8D85\u8FC7 80 \u8BCD\u3002",
          en: "- When a word limit is enabled, cap the journal Method Overview at 80 words in total."
        }
      },
      {
        marker: "scientific_limitations_word_limits",
        standard: {
          zh: "- \u542F\u7528\u5B57\u6570\u9650\u5236\u65F6\uFF0C\u4F1A\u8BAE\u8BBA\u6587\u7684 Limitations subsection \u7EA6 100 \u8BCD\u3002",
          en: "- When a word limit is enabled, keep the conference-paper Limitations subsection at approximately 100 words."
        }
      }
    ],
    wordLimitPlacement: "after-budget",
    wordLimit: {
      zh: `### \u672C\u6B65\u9AA4\u4E34\u65F6\u4E0A\u9650\u4E0E\u9644\u5F55\u5206\u6D41\u89C4\u5219

- \u5B8C\u6574\u7406\u89E3\u5F53\u524D\u8BBA\u6587\u540E\uFF0C\u628A\u6B63\u6587\u91CD\u6784\u5230\u4E0E\u5F53\u524D\u76EE\u6807\u603B\u5B57\u6570\u548C\u7AE0\u8282\u9884\u7B97\u5927\u4F53\u4E00\u81F4\uFF1B
- \u5F53\u524D\u6B63\u5F0F\u76EE\u6807\u4E0D\u53D8\u3002\u672C\u6B65\u9AA4\u5141\u8BB8\u6B63\u6587\u4E34\u65F6\u4E0A\u6D6E {{temporary_ceiling_percent}}%\uFF0C\u4E34\u65F6\u4E0A\u9650\u4E3A {{temporary_ceiling_words}} \u8BCD\uFF1B\u8BE5\u4E0A\u9650\u4E0D\u662F\u65B0\u7684\u76EE\u6807\u5B57\u6570\uFF1B
- \u5BF9\u8D85\u51FA\u6B63\u5F0F\u76EE\u6807\u7684\u5185\u5BB9\u9010\u9879\u5EFA\u7ACB\u201C\u4FDD\u7559\u6B63\u6587 / \u79FB\u5165\u9644\u5F55 / \u5220\u9664\u91CD\u590D\u201D\u6E05\u5355\uFF0C\u5E76\u8BF4\u660E\u4F9D\u636E\uFF1B
- {{appendix_triage_rule}}
- {{protected_sections}} \u662F\u6B63\u6587\u6838\u5FC3\u4FDD\u62A4\u533A\u3002Method \u7684\u95EE\u9898\u5B9A\u4E49\u3001\u5FC5\u8981\u673A\u5236\u3001\u516C\u5F0F\u63A5\u53E3\u548C\u8BAD\u7EC3/\u63A8\u7406\u8BF4\u660E\u4E0D\u5F97\u56E0\u538B\u7F29\u800C\u6B8B\u7F3A\uFF0C\u4E5F\u4E0D\u5F97\u79FB\u5165\u9644\u5F55\uFF1B
- Experiments and Results \u7684\u73B0\u6709\u5185\u5BB9\u4E0D\u5F97\u7CBE\u7B80\u3001\u5220\u9664\u3001\u5F31\u5316\u6216\u79FB\u5165\u9644\u5F55\uFF0C\u5305\u62EC\u5B9E\u9A8C\u8BBE\u7F6E\u3001\u6BD4\u8F83\u534F\u8BAE\u3001\u4E3B\u7ED3\u679C\u3001\u6D88\u878D\u3001\u7A33\u5065\u6027\u3001\u654F\u611F\u6027\u3001\u5B9A\u6027\u7ED3\u679C\u3001\u5931\u8D25\u6848\u4F8B\u548C\u5FC5\u8981\u89E3\u91CA\uFF1B
- Abstract \u4FDD\u6301\u4E3A\u4E34\u65F6\u7248\u672C\uFF1B\u5176\u4ED6\u7AE0\u8282\u4F18\u5148\u5220\u9664\u91CD\u590D\u80CC\u666F\u3001\u504F\u79BB\u4E3B\u7EBF\u7684\u94FA\u9648\u548C\u91CD\u590D\u7ED3\u8BBA\uFF1B
- \u4E2D\u6587\u62A5\u544A\u5FC5\u987B\u8BB0\u5F55\u5F53\u524D\u603B\u8BCD\u6570\u3001\u6B63\u5F0F\u76EE\u6807\u3001\u4E34\u65F6\u4E0A\u9650\u3001\u9010\u8282\u8BCD\u6570\uFF0C\u4EE5\u53CA\u6BCF\u9879\u4FDD\u7559\u3001\u5220\u9664\u91CD\u590D\u6216\u79FB\u5165\u9644\u5F55\u7684\u51B3\u5B9A\uFF1B
- \u540E\u7EED\u6B65\u9AA4\u4ECD\u4EE5\u5F53\u524D\u6B63\u5F0F\u76EE\u6807\u548C\u7AE0\u8282\u9884\u7B97\u4E3A\u6700\u7EC8\u7EA6\u675F\uFF0C\u4E0D\u5F97\u628A\u672C\u6B65\u9AA4\u7684\u4E34\u65F6\u4E0A\u9650\u5F53\u4F5C\u6C38\u4E45\u7BC7\u5E45\u3002`,
      en: `### Temporary Ceiling and Appendix-triage Rules for This Step

- After understanding the complete manuscript, reconstruct the main text so that its total and sections broadly align with the current configured budgets;
- The formal target remains unchanged. This step permits a temporary increase of {{temporary_ceiling_percent}}%, producing a temporary ceiling of {{temporary_ceiling_words}} words; this ceiling is not a new target;
- Create an itemized keep-in-main-text / move-to-appendix / remove-duplication ledger for every item above the formal target and justify each decision;
- {{appendix_triage_rule}}
- {{protected_sections}} are protected core sections. Do not make Method's problem definition, necessary mechanisms, equation interfaces, or training/inference description incomplete through compression, and do not move them to the appendix;
- Do not condense, delete, weaken, or move any existing Experiments and Results content to the appendix, including settings, comparison protocols, main results, ablations, robustness, sensitivity, qualitative findings, failure cases, and necessary interpretation;
- Keep Abstract temporary. In other sections, remove repeated background, off-throughline exposition, and repeated conclusions first;
- The Chinese report must record the current total, formal target, temporary ceiling, per-section counts, and every keep, duplication-removal, or appendix-move decision;
- Later steps must return to the current formal target and section budgets. Never treat this temporary ceiling as a permanent length allowance.`
    },
    flexibleCoreWordLimit: {
      zh: `### \u65B9\u6CD5\u4E0E\u5B9E\u9A8C\u4E0D\u9650\u5B57\u6570\u6A21\u5F0F

- \u56E0\u6B63\u6587\u6CA1\u6709\u603B\u91CF\u4E0A\u9650\uFF0C20% \u4E34\u65F6\u4E0A\u6D6E\u89C4\u5219\u4E0D\u9002\u7528\uFF1B
- Method \u4E0E Experiments and Results \u5FC5\u987B\u6309\u79D1\u5B66\u5B8C\u6574\u6027\u548C\u8BC1\u636E\u9700\u8981\u5145\u5206\u4FDD\u7559\uFF0C\u4E0D\u5F97\u56E0\u7BC7\u5E45\u7CBE\u7B80\u3001\u5220\u9664\u3001\u5F31\u5316\u6216\u79FB\u5165\u9644\u5F55\uFF1B
- {{appendix_triage_rule}}
- \u4E2D\u6587\u62A5\u544A\u8BB0\u5F55\u9010\u8282\u8BCD\u6570\u3001\u8868\u683C\u4E0E\u56FE\u7247\u6298\u7B97\u6570\u3001\u53D7\u9650\u7AE0\u8282\u662F\u5426\u5408\u89C4\uFF0C\u4EE5\u53CA\u6BCF\u9879\u4FDD\u7559\u3001\u5220\u9664\u91CD\u590D\u6216\u79FB\u5165\u9644\u5F55\u7684\u51B3\u5B9A\u3002`,
      en: `### Unlimited Method and Experiments Mode

- Because there is no main-text cap, the temporary 20% allowance does not apply;
- Preserve Method and Experiments & Results as scientific completeness and evidence require; never condense, delete, weaken, or move their content to the appendix merely for length;
- {{appendix_triage_rule}}
- The Chinese report must record per-section counts, table/figure equivalents, compliance of every limited section, and every keep, duplication-removal, or appendix-move decision.`
    }
  },
  "method-experiments": {
    core: {
      zh: `### Method \u7684\u56FA\u5B9A\u7ED3\u6784\u7EA6\u675F

1. {{method_document_hierarchy}}
2. Method \u4E0D\u5F97\u5199\u6210\u8BBA\u6587\u8BF4\u660E\u4E66\u3001\u4EE3\u7801\u6587\u6863\u6216\u9010\u6B65\u64CD\u4F5C\u6E05\u5355\u3002\u53D9\u8FF0\u5E94\u56F4\u7ED5\u201C\u95EE\u9898\u4E3A\u4EC0\u4E48\u96BE \u2192 \u73B0\u6709\u8BBE\u8BA1\u4E3A\u4EC0\u4E48\u4E0D\u8DB3 \u2192 \u4E3A\u4EC0\u4E48\u9700\u8981\u5F53\u524D\u673A\u5236 \u2192 \u673A\u5236\u5982\u4F55\u56DE\u5E94\u95EE\u9898 \u2192 \u9002\u7528\u8FB9\u754C\u201D\u5F62\u6210\u878D\u5408\u6027\u7684\u79D1\u5B66\u6545\u4E8B\uFF1B\u4E0D\u8981\u6C42\u6BCF\u53E5\u8BDD\u90FD\u673A\u68B0\u56DE\u7B54 why\uFF0C\u800C\u8981\u8BA9\u52A8\u673A\u3001\u8BBE\u8BA1\u3001\u8BA1\u7B97\u8FC7\u7A0B\u548C\u4F5C\u7528\u5728\u6BB5\u843D\u5C42\u9762\u81EA\u7136\u8854\u63A5\u3002
3. Problem Definition \u5FC5\u987B\u5B9A\u4E49\u4EFB\u52A1\u3001\u8F93\u5165\u3001\u8F93\u51FA\u3001\u6838\u5FC3\u7EA6\u675F\u548C\u5B66\u4E60\u76EE\u6807\uFF1B\u53EA\u4FDD\u7559\u5FC5\u8981\u516C\u5F0F\uFF1B\u6BCF\u4E2A\u7B26\u53F7\u5728\u9996\u6B21\u4F7F\u7528\u524D\u6216\u540C\u53E5\u5B9A\u4E49\uFF1B\u7B26\u53F7\u8DB3\u591F\u591A\u65F6\u53EF\u4FDD\u7559 notation table\uFF0C\u4E0D\u5F97\u4E3A\u5F62\u5F0F\u611F\u6DFB\u52A0\u88C5\u9970\u6027\u7B26\u53F7\u3002
4. {{method_overview_structure}}
5. \u6BCF\u4E2A\u6838\u5FC3\u673A\u5236\u90FD\u5E94\u8BA9\u8BFB\u8005\u7406\u89E3\u5176\u5FC5\u8981\u6027\u3001\u8BA1\u7B97\u6784\u9020\u3001\u7EC4\u4EF6\u63A5\u53E3\u3001\u8BBE\u8BA1\u76F4\u89C9\u3001\u8BAD\u7EC3\u6216\u63A8\u7406\u4F5C\u7528\u53CA\u9002\u7528\u8FB9\u754C\uFF0C\u4F46\u987A\u5E8F\u3001\u7BC7\u5E45\u548C\u7EC4\u5408\u65B9\u5F0F\u7531\u8BE5\u673A\u5236\u7684\u79D1\u5B66\u903B\u8F91\u51B3\u5B9A\u3002\u7528\u8FDE\u7EED\u6BB5\u843D\u628A\u8FD9\u4E9B\u529F\u80FD\u878D\u5408\u8D77\u6765\uFF0C\u6807\u9898\u53EA\u547D\u540D\u673A\u5236\u6216\u79D1\u5B66\u5185\u5BB9\uFF0C\u4E0D\u628A\u4E0A\u8FF0\u529F\u80FD\u62C6\u6210\u91CD\u590D\u7684\u56FA\u5B9A\u69FD\u4F4D\uFF1B\u4E0D\u5F97\u53EA\u590D\u8FF0\u6267\u884C\u6D41\u7A0B\uFF0C\u4E5F\u4E0D\u5F97\u628A\u5E38\u89C4 backbone\u3001\u6807\u51C6\u6CE8\u610F\u529B\u3001\u5E38\u89C1\u635F\u5931\u6216\u7B80\u5355\u62FC\u63A5\u5305\u88C5\u6210\u72EC\u7ACB\u8D21\u732E\u3002
6. \u516C\u5F0F\u5FC5\u987B\u5148\u89E3\u91CA\u540E\u51FA\u73B0\uFF0C\u51FA\u73B0\u540E\u8BF4\u660E\u4F5C\u7528\u53CA\u4E0E\u6574\u4F53\u76EE\u6807\u7684\u5173\u7CFB\uFF1B\u5173\u952E\u516C\u5F0F\u81F3\u5C11\u88AB\u6B63\u6587\u5F15\u7528\u4E00\u6B21\uFF1B\u68C0\u67E5\u4E0A\u4E0B\u6807\u3001\u7EF4\u5EA6\u3001\u6C42\u548C\u8303\u56F4\u3001\u5F52\u4E00\u5316\u3001mask\u3001\u635F\u5931\u6743\u91CD\u548C\u4F18\u5316\u76EE\u6807\uFF1B\u53EA\u6709\u6750\u6599\u652F\u6301\u65F6\u624D\u4FDD\u7559\u7B97\u6CD5\u6216\u590D\u6742\u5EA6\uFF0C\u8BAD\u7EC3\u4E0E\u63A8\u7406\u6709\u5DEE\u5F02\u65F6\u5FC5\u987B\u660E\u786E\u533A\u5206\u3002
7. \u8BED\u8A00\u4F18\u5148\u4E00\u822C\u73B0\u5728\u65F6\u3001\u4E3B\u52A8\u8BED\u6001\u548C\u65E0\u751F\u547D\u4E3B\u8BED\uFF1B\u5168\u7AE0 we \u6700\u591A\u51FA\u73B0\u4E09\u6B21\u3002
8. \u6838\u5BF9\u73B0\u6709\u6846\u67B6\u56FE\u4E0E\u673A\u5236\u56FE\u7684\u8F93\u5165\u3001\u8F93\u51FA\u3001\u6A21\u5757\u3001\u7BAD\u5934\u3001\u8BAD\u7EC3/\u63A8\u7406\u8DEF\u5F84\u548C\u672F\u8BED\u662F\u5426\u4E0E\u91CD\u6784\u540E\u7684 Method \u4E00\u81F4\uFF1B\u672C\u6B65\u4E0D\u751F\u6210\u6216\u66FF\u6362\u603B\u4F53\u6846\u67B6\u56FE\uFF0C\u7EDF\u4E00\u4EA4\u7531\u540E\u7EED\u72EC\u7ACB\u6B65\u9AA4\u5904\u7406\u3002
{{method_word_limits}}

### Experiments \u7684\u56FA\u5B9A\u7ED3\u6784\u7EA6\u675F

1. \u7B2C\u4E00\u4E2A subsection \u5FC5\u987B\u4E3A Datasets and Experimental Setup\uFF0C\u7B2C\u4E8C\u4E2A\u5FC5\u987B\u4E3A Main Results\uFF1B\u540E\u7EED\u5C0F\u8282\u4E0D\u7ED1\u5B9A\u7B2C\u4E09\u6216\u7B2C\u56DB\u7684\u56FA\u5B9A\u5E8F\u53F7\uFF0C\u5E94\u6839\u636E\u8BC1\u636E\u7EC4\u7EC7 Ablation Studies\u3001\u673A\u5236/\u6548\u7387/\u53C2\u6570\u5206\u6790\u3001Case Studies and Qualitative Analysis\u3001\u7A33\u5065\u6027\u3001\u654F\u611F\u6027\u3001\u6CDB\u5316\u6216\u9519\u8BEF\u5206\u6790\u3002Ablation Studies \u5E94\u5728\u6750\u6599\u652F\u6301\u65F6\u4FDD\u7559\uFF1B\u6CA1\u6709\u771F\u5B9E\u6848\u4F8B\u6216\u6D88\u878D\u8BC1\u636E\u65F6\u4E0D\u5F97\u865A\u6784\uFF0C\u5E76\u987B\u5728\u62A5\u544A\u4E2D\u767B\u8BB0\u7F3A\u53E3\u3002
2. {{experiment_setup_structure}}
3. Datasets and Experimental Setup \u5FC5\u987B\u8986\u76D6\u6570\u636E\u6765\u6E90\u3001\u5212\u5206\u3001\u89C4\u6A21\u3001\u4EFB\u52A1\u8F93\u5165\u8F93\u51FA\u3001\u6307\u6807\u53CA\u65B9\u5411\u3001\u57FA\u7EBF\u5BB6\u65CF\u3001\u516C\u5E73\u6BD4\u8F83\u539F\u5219\uFF0C\u4EE5\u53CA\u6750\u6599\u80FD\u591F\u786E\u8BA4\u7684\u5B9E\u73B0\u7EC6\u8282\u3001\u968F\u673A\u79CD\u5B50\u3001\u8FD0\u884C\u6B21\u6570\u3001\u65E9\u505C\u3001\u670D\u52A1\u5668/\u786C\u4EF6\u548C\u8D85\u53C2\u6570\u3002\u4E0D\u5F97\u9ED8\u8BA4\u5199\u5165\u7EDF\u8BA1\u663E\u8457\u6027\u6216\u672A\u8BC1\u5B9E\u7684\u516C\u5E73\u6761\u4EF6\u3002
4. Main Results \u6309\u201C\u603B\u4F53\u89C2\u5BDF \u2192 \u4E0E\u5F3A\u57FA\u7EBF\u6BD4\u8F83 \u2192 \u8DE8\u6570\u636E\u96C6/\u6307\u6807\u7A33\u5B9A\u6027 \u2192 \u8BC1\u636E\u8FB9\u754C\u201D\u7EC4\u7EC7\uFF0C\u53EA\u9009\u62E9\u5173\u952E\u6570\u5B57\uFF0C\u4E0D\u9010\u5355\u5143\u683C\u6717\u8BFB\u3002
5. \u6BCF\u4E2A\u6D88\u878D\u3001\u66FF\u6362\u6216\u654F\u611F\u6027\u8BBE\u7F6E\u90FD\u5FC5\u987B\u5BF9\u5E94\u660E\u786E\u8BBE\u8BA1\u95EE\u9898\uFF1B\u533A\u5206\u6A21\u5757\u5FC5\u8981\u6027\u3001\u53C2\u6570\u9009\u62E9\u548C\u8BAD\u7EC3\u6280\u5DE7\uFF1B\u6CA1\u6709\u591A\u968F\u673A\u79CD\u5B50\u6216\u7EDF\u8BA1\u652F\u6301\u65F6\u4E0D\u5F97\u628A\u5C0F\u5E45\u6CE2\u52A8\u89E3\u91CA\u6210\u786E\u5B9A\u89C4\u5F8B\u3002
6. \u6BCF\u4E2A\u5B9E\u9A8C\u5C0F\u8282\u6574\u4F53\u5E94\u8BA9\u8BFB\u8005\u660E\u767D\u672C\u8282\u68C0\u9A8C\u7684\u4E0D\u786E\u5B9A\u6027\u3001\u51B3\u5B9A\u6027\u8BC1\u636E\u3001\u5408\u7406\u89E3\u91CA\u3001\u4E0E\u6838\u5FC3 claim \u7684\u5173\u7CFB\u4EE5\u53CA\u8FB9\u754C\u6216\u4F8B\u5916\u3002\u6839\u636E\u8BC1\u636E\u628A\u8FD9\u4E9B\u529F\u80FD\u81EA\u7136\u5206\u5E03\u5728\u8FDE\u7EED\u6BB5\u843D\u4E2D\uFF0C\u4E0D\u8981\u6C42\u6BCF\u6BB5\u91CD\u590D\u540C\u4E00\u987A\u5E8F\uFF1B\u5C0F\u6807\u9898\u5E94\u547D\u540D\u5B9E\u9A8C\u3001\u53D8\u91CF\u6216\u73B0\u8C61\uFF0C\u800C\u4E0D\u662F Question\u3001Observation\u3001Interpretation \u7B49\u53D9\u8FF0\u529F\u80FD\u3002\u4E0D\u5F97\u91CD\u590D\u5168\u90E8\u6570\u5B57\u3001\u6BCF\u53E5\u90FD\u4EE5 Table/Figure \u5F00\u5934\u3001\u7528 higher is better \u5F0F\u7A7A\u8BDD\u3001\u63D0\u524D\u5199 Discussion \u7684\u666E\u904D\u610F\u4E49\u6216\u7528 significant \u8868\u793A\u666E\u901A\u6570\u503C\u5DEE\u5F02\u3002
7. \u5BF9\u6BCF\u5F20\u5B9E\u9A8C\u56FE\u68C0\u67E5 caption \u662F\u5426\u89E3\u91CA\u53D8\u91CF\u3001\u8BBE\u7F6E\u3001\u5747\u503C\u6216\u8BEF\u5DEE\u5E26\uFF0C\u56FE\u4F8B\u4E0E\u672F\u8BED\u662F\u5426\u4E00\u81F4\uFF0C\u6570\u503C\u662F\u5426\u4E0E\u8868\u683C\u51B2\u7A81\uFF0C\u6B63\u6587\u662F\u5426\u89E3\u91CA\u8D8B\u52BF\uFF0C\u4EE5\u53CA\u89C6\u89C9\u8BC1\u636E\u662F\u5426\u771F\u7684\u652F\u6301 claim\u3002
{{experiments_word_limits}}

### \u4E2D\u6587\u62A5\u544A\u56FA\u5B9A\u6E05\u5355

\u62A5\u544A\u5FC5\u987B\u5305\u542B\uFF1AMethod \u903B\u8F91\u56FE\u8C31\u3001\u65B9\u6CD5\u5C0F\u8282\u91CD\u6784\u5BF9\u7167\u3001\u516C\u5F0F\u4E0E\u7B26\u53F7\u5BA1\u8BA1\u3001\u73B0\u6709\u56FE\u8868\u4E0E\u6B63\u6587\u63A5\u53E3\u5BA1\u8BA1\u3001Experiment Question\u2013Evidence \u8868\u3001\u5B9E\u9A8C\u987A\u5E8F\u8BBE\u8BA1\u3001\u6570\u5B57\u4E0E\u7EDF\u8BA1\u98CE\u9669\u3001\u5220\u9664\u6216\u5F31\u5316\u7684\u673A\u5236\u4E3B\u5F20\u3001\u8054\u7F51\u57FA\u7EBF\u4E0E\u534F\u8BAE\u6838\u9A8C\u3001\u4FEE\u6539\u6E05\u5355\u3001\u4F5C\u8005\u9700\u786E\u8BA4\u9879\u548C\u4E0B\u4E00\u8F6E\u4EA4\u63A5\u6458\u8981\u3002Question\u2013Evidence \u8868\u662F\u62A5\u544A\u4E2D\u7684\u89C4\u5212\u4E0E\u5BA1\u8BA1\u5DE5\u5177\uFF0C\u5176\u5217\u540D\u4E0D\u5F97\u53D8\u6210 TeX \u4E2D\u91CD\u590D\u7684\u5C0F\u6807\u9898\u6216\u53E5\u9996\u6807\u7B7E\u3002`,
      en: `### Fixed Constraints for Method

1. {{method_document_hierarchy}}
2. Method must not read like a manuscript manual, code document, or procedural checklist. Build an integrated scientific story around why the problem is difficult, why existing designs are insufficient, why each mechanism is needed, how it addresses the problem, and where it applies. Do not force every sentence to state a why; integrate motivation, design, computation, and function naturally at paragraph level.
3. Problem Definition must define the task, inputs, outputs, central constraints, and learning objective. Keep only necessary equations. Define every symbol before or at first use. Retain a notation table only when notation volume warrants it; never add decorative notation.
4. {{method_overview_structure}}
5. Make each core mechanism intelligible in terms of its necessity, computational construction, interfaces, design intuition, training or inference role, and applicable boundary, but let the mechanism's scientific logic determine their order, emphasis, and grouping. Integrate these functions into continuous prose, and let headings name mechanisms or scientific content rather than repeated template slots. Do not merely describe execution steps or package a standard backbone, ordinary attention, common loss, or simple concatenation as an independent contribution.
6. Motivate equations before they appear and explain their role and relation to the overall objective afterward. Cite each key equation at least once. Check indices, dimensions, summation ranges, normalization, masks, loss weights, and optimization objectives. Retain algorithms or complexity only when supported, and distinguish training from inference whenever they differ.
7. Prefer present tense, active voice, and inanimate subjects. Use "we" no more than three times in the entire section.
8. Audit whether the inputs, outputs, components, arrows, training/inference paths, and terminology of existing framework and mechanism figures still match the reconstructed Method. Do not generate or replace the overall framework figure in this step; the separate later step handles it.
{{method_word_limits}}

### Fixed Constraints for Experiments

1. The first subsection must be Datasets and Experimental Setup and the second Main Results. Do not bind later content to fixed third or fourth positions; order supported Ablation Studies, mechanism/efficiency/parameter analyses, Case Studies and Qualitative Analysis, robustness, sensitivity, generalization, or error analysis by evidence. Retain Ablation Studies when the materials support it. Never invent case or ablation evidence; record a missing evidence type as a gap.
2. {{experiment_setup_structure}}
3. Datasets and Experimental Setup must cover data sources, splits, sizes, task inputs/outputs, metric directions, baseline families, fair-comparison principles, and only confirmed implementation details, random seeds, run counts, early stopping, servers/hardware, and hyperparameters. Do not assume significance tests or unverified fairness conditions.
4. Organize Main Results as overall observation \u2192 comparison with strong baselines \u2192 consistency across datasets/metrics \u2192 evidence boundary. Select only decisive numbers and do not narrate every cell.
5. Every removal, replacement, or sensitivity setting must answer a clear design question. Separate component necessity, parameter choice, and training tricks. Without multiple seeds or statistical support, do not turn small variation into a deterministic rule.
6. Across each experiment subsection, make clear the uncertainty being tested, decisive evidence, warranted interpretation, relation to the core claim, and boundary or exception. Distribute these functions naturally across continuous prose rather than repeating one sequence in every paragraph. Let headings name experiments, variables, or phenomena rather than discourse functions such as Question, Observation, or Interpretation. Do not repeat every number, begin every sentence with Table/Figure, use "higher is better" filler, move broad Discussion claims into Results, or use "significant" for ordinary numerical differences.
7. For every experimental figure, check whether the caption explains variables, settings, means, or error bands; whether legend terminology is consistent; whether values conflict with tables; whether prose interprets the trend; and whether the visual actually supports the claim.
{{experiments_word_limits}}

### Fixed Chinese-report Checklist

The report must contain the Method logic map, old/new Method subsection comparison, equation and notation audit, existing-visual-to-prose interface audit, Experiment Question\u2013Evidence table, experiment-order rationale, numeric/statistical risks, removed or qualified mechanism claims, web verification of baselines and protocols, revision log, author-confirmation items, and next-step handoff. Treat the Question\u2013Evidence table as a report-only planning and audit device; never turn its column labels into repeated TeX headings or sentence prefixes.`
    },
    inlineStyleConstraints: [
      {
        marker: "method_document_hierarchy",
        branches: {
          conference: {
            zh: "\u4F1A\u8BAE\u8BBA\u6587\u9700\u8981\u7B2C\u4E09\u5C42\u6807\u9898\u65F6\u4F7F\u7528 paragraph \u800C\u975E subsubsection\uFF1Bparagraph \u6807\u9898\u53EA\u547D\u540D\u771F\u5B9E\u79D1\u5B66\u5355\u5143\uFF0C\u666E\u901A\u8BBA\u8FF0\u4EE5\u8FDE\u7EED\u6BB5\u843D\u5C55\u5F00\u3002\u65B9\u6CD5\u7ED3\u6784\u6309\u79D1\u5B66\u903B\u8F91\u800C\u975E\u4EE3\u7801\u7C7B\u540D\u7EC4\u7EC7\u3002",
            en: "In a conference paper, use paragraph rather than subsubsection when a third-level heading is genuinely needed. Reserve paragraph headings for named scientific units and develop ordinary exposition as continuous prose. Organize Method by scientific logic rather than code class names."
          },
          journal: {
            zh: "\u671F\u520A\u8BBA\u6587\u76EE\u5F55\u5C42\u7EA7\u9ED8\u8BA4\u6B62\u4E8E subsubsection\uFF1B\u5176\u4E0B\u4EE5\u4E3B\u9898\u53E5\u3001\u8FC7\u6E21\u548C\u81EA\u7136\u6BB5\u5F62\u6210\u8FDE\u7EED\u8BBA\u8BC1\uFF0C\u4E0D\u628A\u53D9\u8FF0\u529F\u80FD\u5199\u6210 paragraph \u6807\u9898\u3002\u65B9\u6CD5\u7ED3\u6784\u6309\u79D1\u5B66\u903B\u8F91\u800C\u975E\u4EE3\u7801\u7C7B\u540D\u7EC4\u7EC7\u3002",
            en: "In a journal paper, stop the heading hierarchy at subsubsection by default. Below it, use topic sentences, transitions, and natural paragraphs to form a continuous argument rather than paragraph headings for discourse functions. Organize Method by scientific logic rather than code class names."
          }
        }
      },
      {
        marker: "method_overview_structure",
        branches: {
          conference: {
            zh: "\u4F1A\u8BAE\u8BBA\u6587\u4E0D\u5F97\u5355\u8BBE Overview subsection\uFF1B\u5E94\u5728 Problem Definition \u4E4B\u540E\u6216\u7B2C\u4E00\u4E2A\u6838\u5FC3\u673A\u5236\u4E4B\u524D\u7684\u6700\u5408\u9002\u4F4D\u7F6E\u81EA\u7136\u5F15\u51FA\u603B\u4F53\u6846\u67B6\uFF0C\u5B8C\u6210\u95EE\u9898\u5230\u65B9\u6848\u7684\u6620\u5C04\u4E0E\u5FC5\u8981\u63A5\u53E3\u8BF4\u660E\uFF0C\u4E0D\u5F97\u9010\u9879\u590D\u8FF0\u6846\u67B6\u56FE\u3002",
            en: "Conference papers must not create a standalone Overview subsection. Introduce the overall framework naturally after Problem Definition or before the first core mechanism, wherever it best maps the problem to the solution and clarifies necessary interfaces. Do not narrate the framework figure item by item."
          },
          journal: {
            zh: "\u671F\u520A\u8BBA\u6587\u5FC5\u987B\u5355\u8BBE Overview subsection\uFF0C\u6070\u597D\u4E24\u4E2A\u666E\u901A\u6BB5\u843D\uFF1A\u7B2C\u4E00\u6BB5\u5B8C\u6210\u95EE\u9898\u5230\u65B9\u6848\u7684\u9AD8\u5C42\u6620\u5C04\uFF0C\u7B2C\u4E8C\u6BB5\u8BF4\u660E\u7EC4\u4EF6\u63A5\u53E3\u3001\u4FE1\u606F\u6D41\u53CA\u8BAD\u7EC3/\u63A8\u7406\u8DEF\u5F84\u3002\u4E24\u6BB5\u90FD\u53EA\u89E3\u91CA\u6846\u67B6\u7684\u79D1\u5B66\u903B\u8F91\u548C\u8BBE\u8BA1\u53D6\u820D\uFF0C\u4E0D\u5F97\u6309\u56FE\u4E2D\u5143\u7D20\u987A\u5E8F\u590D\u8FF0\u56FE\u7247\u3002\n{{journal_overview_word_limits}}",
            en: "Journal papers must use a standalone Overview subsection with exactly two ordinary paragraphs. Paragraph 1 maps the problem to the solution at a high level; Paragraph 2 explains component interfaces, information flow, and training/inference paths. Explain only scientific logic and design trade-offs; do not retell the figure in visual order.\n{{journal_overview_word_limits}}"
          }
        }
      },
      {
        marker: "experiment_setup_structure",
        branches: {
          conference: {
            zh: "\u5728 \\subsection{Datasets and Experimental Setup} \u5185\u4F9D\u6B21\u8BBE\u7F6E \\paragraph{Datasets}\u3001\\paragraph{Experimental Configuration} \u548C \\paragraph{Baselines} \u4E09\u4E2A\u627F\u62C5\u771F\u5B9E\u5185\u5BB9\u5206\u7C7B\u7684\u6807\u9898\uFF1B\u5176\u4ED6\u5185\u5BB9\u4F18\u5148\u5E76\u5165\u8FDE\u7EED\u6B63\u6587\uFF0C\u53EA\u6709\u51FA\u73B0\u65B0\u7684\u3001\u53EF\u547D\u540D\u7684\u79D1\u5B66\u5355\u5143\u65F6\u624D\u589E\u52A0 paragraph\u3002",
            en: "Inside \\subsection{Datasets and Experimental Setup}, use \\paragraph{Datasets}, \\paragraph{Experimental Configuration}, and \\paragraph{Baselines} in that order as genuine content categories. Integrate other material into continuous prose unless it forms a distinct, nameable scientific unit that warrants another paragraph heading."
          },
          journal: {
            zh: "\u5728 \\subsection{Datasets and Experimental Setup} \u5185\u4F9D\u6B21\u8BBE\u7F6E \\subsubsection{Datasets}\u3001\\subsubsection{Experimental Configuration} \u548C \\subsubsection{Baselines}\uFF1B\u6BCF\u4E2A subsubsection \u5185\u4EE5\u8FDE\u7EED\u6B63\u6587\u7EC4\u7EC7\u5185\u5BB9\uFF0C\u53EA\u6709\u51FA\u73B0\u65B0\u7684\u3001\u53EF\u547D\u540D\u7684\u79D1\u5B66\u5355\u5143\u65F6\u624D\u589E\u52A0\u540C\u7EA7\u6807\u9898\u3002",
            en: "Inside \\subsection{Datasets and Experimental Setup}, use \\subsubsection{Datasets}, \\subsubsection{Experimental Configuration}, and \\subsubsection{Baselines} in that order. Develop each subsubsection as continuous prose and add another peer heading only for a distinct, nameable scientific unit."
          }
        }
      }
    ],
    inlineWordLimits: [
      {
        marker: "journal_overview_word_limits",
        standard: {
          zh: "- \u542F\u7528\u5B57\u6570\u9650\u5236\u65F6\uFF0C\u671F\u520A Overview \u4E24\u6BB5\u5408\u8BA1\u4E0D\u8D85\u8FC7 80 \u8BCD\u3002",
          en: "- When a word limit is enabled, cap the two journal Overview paragraphs at 80 words in total."
        }
      },
      {
        marker: "method_word_limits",
        standard: {
          zh: `- \u542F\u7528\u5B57\u6570\u9650\u5236\u65F6\uFF0CProblem Definition \u4E3A {{problem_definition_min}}\u2013{{problem_definition_max}} \u8BCD\uFF1BMethod \u603B\u91CF\u843D\u5728\u5F53\u524D\u914D\u7F6E\u8303\u56F4\u5185\uFF0C\u6BCF\u4E2A\u82F1\u6587\u53E5\u5B50\u4E0D\u8D85\u8FC7 24 \u8BCD\u3002`,
          en: `- When a word limit is enabled, Problem Definition contains {{problem_definition_min}}\u2013{{problem_definition_max}} words; Method stays within its configured range, and no English sentence exceeds 24 words.`
        },
        flexibleCore: {
          zh: `- \u5F53\u524D Method \u4E0D\u8BBE\u8BCD\u6570\u8303\u56F4\uFF1BProblem Definition \u4E0E\u5F53\u524D\u8BBA\u6587\u7C7B\u578B\u89C4\u5B9A\u7684 Overview \u7ED3\u6784\u4ECD\u987B\u6EE1\u8DB3\uFF0C\u6BCF\u4E2A\u82F1\u6587\u53E5\u5B50\u4E0D\u8D85\u8FC7 24 \u8BCD\u3002\u6309\u673A\u5236\u5B8C\u6574\u6027\u5C55\u5F00\u5E76\u5220\u9664\u91CD\u590D\uFF0C\u4E0D\u5F97\u4E3A\u4E86\u6269\u5199\u589E\u52A0\u65E0\u8BC1\u636E\u5185\u5BB9\u3002`,
          en: `- Method currently has no word range. Problem Definition and the Overview structure defined for the current paper type still apply, and no English sentence exceeds 24 words. Develop only what mechanism completeness requires, remove repetition, and never add unsupported material merely to expand the section.`
        }
      },
      {
        marker: "experiments_word_limits",
        standard: {
          zh: `- \u542F\u7528\u5B57\u6570\u9650\u5236\u65F6\uFF0CExperiments and Results \u603B\u91CF\u843D\u5728\u5F53\u524D\u914D\u7F6E\u8303\u56F4\u5185\uFF0C\u6BCF\u4E2A\u82F1\u6587\u53E5\u5B50\u4E0D\u8D85\u8FC7 24 \u8BCD\u3002`,
          en: `- When a word limit is enabled, Experiments and Results stays within its configured range, and no English sentence exceeds 24 words.`
        },
        flexibleCore: {
          zh: `- \u5F53\u524D Experiments and Results \u4E0D\u8BBE\u8BCD\u6570\u8303\u56F4\uFF0C\u6BCF\u4E2A\u82F1\u6587\u53E5\u5B50\u4ECD\u4E0D\u8D85\u8FC7 24 \u8BCD\u3002\u6309\u5B9E\u9A8C\u534F\u8BAE\u4E0E\u8BC1\u636E\u94FE\u9700\u8981\u5145\u5206\u5C55\u5F00\u5E76\u5220\u9664\u91CD\u590D\uFF0C\u4E0D\u5F97\u56E0\u7BC7\u5E45\u538B\u7F29\u3001\u5220\u9664\u6216\u5F31\u5316\u73B0\u6709\u5B9E\u9A8C\u5185\u5BB9\u3002`,
          en: `- Experiments and Results currently has no word range, while each English sentence remains at most 24 words. Develop the section as fully as its protocols and evidence chain require, remove repetition, and never condense, delete, or weaken existing experimental content merely for length.`
        }
      }
    ]
  },
  "narrative-reconstruction": {
    core: {
      zh: `### Abstract \u7684\u56FA\u5B9A\u7ED3\u6784

- \u5FC5\u987B\u662F\u4E00\u4E2A\u8FDE\u7EED\u82F1\u6587\u6BB5\u843D\uFF0C\u4E0D\u542B\u5F15\u7528\u3001\u516C\u5F0F\u3001\u811A\u6CE8\u3001\u7F16\u53F7\u6216\u6362\u884C\uFF1B
- Background\uFF1A1\u20132 \u53E5\uFF0C\u5177\u4F53\u8BF4\u660E\u4EFB\u52A1\u3001\u573A\u666F\u548C\u5F53\u524D\u9650\u5236\uFF1B
- Bridge\uFF1A\u6070\u597D 1 \u53E5\uFF0C\u56FA\u5B9A\u4EE5 "To address these challenges, we ..." \u5F00\u5934\uFF0C\u5E76\u9996\u6B21\u5F15\u5165\u201C\u65B9\u6CD5\u5168\u79F0\uFF08\u8BBA\u6587\u54C1\u724C\u7F29\u5199\uFF09\u201D\uFF1B
- Method\uFF1A3\u20134 \u53E5\uFF0C\u4E3B\u8981\u4F7F\u7528\u4E00\u822C\u73B0\u5728\u65F6\u548C\u88AB\u52A8\u8BED\u6001\uFF0C\u4ECE\u6838\u5FC3\u601D\u60F3\u5230\u5B9E\u73B0\u673A\u5236\u5C55\u5F00\uFF1B
- Results\uFF1A2\u20133 \u53E5\uFF0C\u4E3B\u52A8\u8BED\u6001\u548C\u4E00\u822C\u73B0\u5728\u65F6\uFF1B\u7B2C\u4E00\u53E5\u6781\u7B80\u8BF4\u660E\u5B9E\u9A8C\u8303\u56F4\uFF0C\u540E\u7EED\u53EA\u5199\u88AB\u8868\u683C\u652F\u6301\u7684\u5173\u952E\u53D1\u73B0\uFF1B\u5EFA\u8BAE\u53EA\u4FDD\u7559 2\u20134 \u4E2A\u6700\u6709\u4EE3\u8868\u6027\u7684\u7ED3\u679C\u6570\u5B57\uFF0C\u8BC1\u636E\u4E0D\u8DB3\u65F6\u4E0D\u51D1\u6570\uFF0C\u8D85\u8FC7 4 \u4E2A\u987B\u6709\u4E0D\u53EF\u66FF\u4EE3\u7684\u7406\u7531\uFF0C\u907F\u514D\u6570\u5B57\u5BC6\u5EA6\u8FC7\u9AD8\uFF1B
- Implication\uFF1A\u6070\u597D 1 \u53E5\uFF0C\u53EA\u8BF4\u660E\u8BC1\u636E\u652F\u6301\u7684\u610F\u4E49\u548C\u8303\u56F4\uFF1B
- \u6458\u8981\u5E94\u5C3D\u91CF\u5C11\u7528\u7F29\u5199\u3002\u672C\u6587\u65B9\u6CD5\u7F29\u5199\u53EF\u6B63\u5E38\u4F7F\u7528\uFF1B\u5176\u4ED6\u672F\u8BED\u53EA\u6709\u5728\u6458\u8981\u5185\u786E\u9700\u591A\u6B21\u51FA\u73B0\u65F6\u624D\u5B9A\u4E49\u7F29\u5199\uFF0C\u5E76\u5728\u9996\u6B21\u51FA\u73B0\u65F6\u7ED9\u51FA\u5168\u79F0\u3002\u6570\u636E\u96C6\u7B49\u516C\u8BA4\u4E13\u540D\u53EF\u4F7F\u7528\u6807\u51C6\u7F29\u5199\uFF1B\u4E0D\u5F97\u4E3A\u53EA\u51FA\u73B0\u4E00\u6B21\u7684\u672F\u8BED\u521B\u5EFA\u7F29\u5199\uFF1B
- \u53EA\u4FDD\u7559\u7406\u89E3\u95EE\u9898\u3001\u65B9\u6CD5\u548C\u8BC1\u636E\u6240\u5FC5\u9700\u7684\u672F\u8BED\uFF1B\u4E0D\u5F97\u5806\u53E0\u6A21\u5757\u540D\u3001\u635F\u5931\u540D\u3001\u53D8\u91CF\u540D\u3001\u5B9E\u9A8C\u8BBE\u7F6E\u540D\u7B49\u6B63\u6587\u7EA7\u4E13\u6709\u540D\u8BCD\uFF1B
- Keywords \u884C\u53EF\u4F7F\u7528\u672C\u6587\u65B9\u6CD5\u7F29\u5199\uFF0C\u5E76\u5305\u542B 3\u20135 \u4E2A\u9AD8\u4FE1\u606F\u91CF\u82F1\u6587\u672F\u8BED\u3002
{{abstract_word_limits}}

### Introduction \u7684\u56FA\u5B9A\u516D\u6BB5\u7ED3\u6784

- \u4E0D\u8BBE\u7F6E\u4EFB\u4F55\u5B50\u8282\uFF0C\u6070\u597D\u516D\u4E2A\u8FDE\u7EED\u6BB5\u843D\uFF0C\u4E0D\u5F97\u6539\u6210\u4E03\u6BB5\u6216\u516B\u6BB5\uFF1B
- P1 \u80CC\u666F\u4E0E\u52A8\u673A\uFF1A\u76F4\u63A5\u8FDB\u5165\u4EFB\u52A1\u3001\u573A\u666F\u548C\u73B0\u5B9E\u7EA6\u675F\uFF0C\u660E\u786E\u8BF4\u660E\u8BE5\u95EE\u9898\u5728\u5F53\u524D\u7814\u7A76\u4E0E\u5B9E\u9645\u73AF\u5883\u4E2D\u4ECD\u7136\u5B58\u5728\uFF0C\u800C\u4E0D\u662F\u53EA\u56DE\u987E\u5386\u53F2\u7F3A\u53E3\uFF1B\u53EF\u4F7F\u7528 6\u201310 \u4E2A\u5F53\u524D .bib key\uFF0C\u6BCF\u53E5\u6700\u591A 3 \u4E2A\uFF1B
- P2 \u6700\u76F8\u5173\u8DEF\u7EBF\u4E0E\u7F3A\u53E3\uFF1A\u6BCF\u6761\u8DEF\u7EBF\u5148\u6982\u62EC\u518D\u8BF4\u660E\u5728\u672C\u6587\u76EE\u6807\u7EF4\u5EA6\u4E0A\u7684\u9650\u5236\uFF0C\u53EF\u4F7F\u7528 4\u20138 \u4E2A\u5F53\u524D key\uFF1B
- P3 \u95EE\u9898\u8BBE\u5B9A\u4E0E\u6311\u6218\uFF1A\u6700\u5C0F\u5145\u5206\u63CF\u8FF0\u8F93\u5165\u3001\u8F93\u51FA\u3001\u7EA6\u675F\u548C\u76EE\u6807\uFF0C\u4E0D\u4F7F\u7528\u516C\u5F0F\uFF0C\u660E\u786E 2\u20134 \u4E2A\u4E0E P1/P2 \u5BF9\u9F50\u7684\u6311\u6218\uFF0C\u53EF\u9009 3\u20136 \u4E2A key\uFF1B
- P4 \u65B9\u6CD5\u6982\u89C8\u4E0E\u8BBE\u8BA1\u76F4\u89C9\uFF1A\u7B2C\u4E00\u53E5\u5FC5\u987B\u4EE5 "To ..." \u5F00\u5934\u5E76\u9996\u6B21\u5F15\u5165\u65B9\u6CD5\u5168\u79F0\u4E0E\u65E2\u5B9A\u8BBA\u6587\u54C1\u724C\u7F29\u5199\uFF1B\u4ECE\u6838\u5FC3\u601D\u60F3\u5230 2\u20133 \u4E2A\u5FC5\u8981\u673A\u5236\uFF0C\u6BCF\u4E2A\u673A\u5236\u5BF9\u5E94 P3 \u6311\u6218\uFF0C\u53EF\u4F7F\u7528 0\u20134 \u4E2A key\uFF1B
- P5 \u8D21\u732E\u4E0E\u610F\u4E49\uFF1AIntroduction \u4E2D\u552F\u4E00\u5141\u8BB8\u4F7F\u7528\u6761\u76EE\u7684\u6BB5\u843D\uFF0C\u6070\u597D\u4E09\u70B9\uFF1B\u5206\u522B\u8986\u76D6\u79D1\u5B66\u95EE\u9898\u6216\u5EFA\u6A21\u89C6\u89D2\u3001\u8BA1\u7B97\u673A\u5236\u6216\u5173\u952E\u6027\u8D28\u3001\u5B9E\u9A8C\u53D1\u73B0\u6216\u53EF\u63A8\u5E7F\u8BA4\u8BC6\uFF1B\u4E0D\u5199\u5177\u4F53\u6570\u503C\uFF0C\u4E0D\u4F7F\u7528 cite\uFF0C\u4E0D\u5F97\u628A\u4E09\u4E2A\u666E\u901A\u6A21\u5757\u5206\u522B\u5305\u88C5\u6210\u4E09\u9879\u8D21\u732E\uFF1B
- P6 \u8BBA\u6587\u7ED3\u6784\uFF1A\u4F7F\u7528\u73B0\u6709 Section ref\uFF0C\u53EA\u8BF4\u660E\u7EC4\u7EC7\uFF0C\u4E0D\u91CD\u590D\u7AE0\u8282\u5185\u5BB9\uFF0C\u4E0D\u4F7F\u7528 cite\uFF1B
- Introduction \u4E2D we \u6700\u591A\u51FA\u73B0\u516D\u6B21\uFF1BP1\u2013P4 \u53EF\u5F15\u7528\uFF0CP5\u2013P6 \u7981\u6B62\u5F15\u7528\uFF1B\u6240\u6709 key \u5FC5\u987B\u5B58\u5728\u4E8E\u5F53\u524D .bib\u3002
{{introduction_word_limits}}

### Related Work \u7684\u56FA\u5B9A\u7ED3\u6784

- \u76EE\u5F55\u5C42\u7EA7\u56FA\u5B9A\u4E3A section{Related Work} \u2192 \u6070\u597D\u4E09\u4E2A subsection\uFF1B
- \u6BCF\u4E2A subsection \u6807\u9898\u4E3A 3\u20137 \u4E2A\u82F1\u6587\u5355\u8BCD\u5E76\u4F7F\u7528\u6807\u9898\u5F0F\u5927\u5C0F\u5199\uFF1B
{{narrative_related_work_structure}}
- \u7B2C\u4E00\u53E5\u7528\u4E3B\u52A8\u8BED\u6001\u548C\u4E00\u822C\u73B0\u5728\u65F6\u6982\u62EC\u7A33\u5B9A\u89C2\u5BDF\uFF1B
- \u6709\u4E14\u4EC5\u6709\u4E00\u53E5\u7528\u4E00\u822C\u8FC7\u53BB\u65F6\u63CF\u8FF0\u4EE3\u8868\u6027\u4F5C\u8005\u884C\u4E3A\uFF1B
- \u6BCF\u4E2A subsection \u7684\u6700\u540E\u4E00\u53E5\u4E0D\u8D85\u8FC7 18 \u8BCD\uFF0C\u5FC5\u987B\u662F\u5BF9\u672C\u5C0F\u8282\u6587\u732E\u7684\u7EFC\u5408\u5206\u6790\u6216\u603B\u7ED3\uFF1B\u53EA\u6709\u5206\u6790\u81EA\u7136\u652F\u6301\u65F6\u624D\u53EF\u843D\u5230\u672C\u6587\u5B9A\u4F4D\uFF0C\u4F46\u4E0D\u5F97\u51FA\u73B0\u672C\u6587\u65B9\u6CD5\u540D\uFF0C\u4E0D\u5F97\u4F7F\u7528 "we"\uFF1B
- \u6309\u7814\u7A76\u8303\u5F0F\u3001\u8BAD\u7EC3\u4FE1\u53F7\u3001\u7ED3\u6784\u5047\u8BBE\u3001\u6548\u7387\u6216\u6CDB\u5316\u6743\u8861\u7EFC\u5408\uFF0C\u7981\u6B62\u9010\u7BC7\u4E32\u8BB2\uFF1B
- \u6574\u8282\u5EFA\u8BAE\u4F7F\u7528 15\u201325 \u4E2A\u771F\u5B9E BibTeX key\uFF0C\u81F3\u5C11 60% \u4F18\u5148\u6765\u81EA\u8FD1\u4E09\u5E74\uFF1B\u66F4\u65E9\u5DE5\u4F5C\u53EA\u7528\u4E8E\u4EFB\u52A1\u5B9A\u4E49\u6216\u5960\u57FA\u80CC\u666F\uFF1B\u6BCF\u53E5\u6700\u591A 3 \u4E2A key\uFF1B\u9664\u4E0A\u8FF0\u5C0F\u8282\u672B\u53E5\u5916\uFF0C\u5168\u6587 we \u6700\u591A\u4E09\u6B21\uFF1B
- \u6B63\u5F0F\u91CD\u5199\u524D\u5148\u5728\u62A5\u544A\u4E2D\u7ED9\u51FA\u4E09\u4E2A\u5C0F\u8282\u4E3B\u9898\u3001\u9009\u62E9\u7406\u7531\u548C\u8BA1\u5212\u4F7F\u7528\u7684\u73B0\u6709 key\u3002

### Discussion \u4E0E Conclusion \u7684\u56FA\u5B9A\u7ED3\u6784

{{narrative_discussion_structure}}
- Discussion \u5FC5\u987B\u533A\u5206\u76F4\u63A5\u8BC1\u636E\u3001\u5408\u7406\u63A8\u65AD\u548C\u672A\u9A8C\u8BC1\u673A\u5236\uFF0C\u627F\u62C5\u7EFC\u5408\u5206\u6790\u800C\u4E0D\u662F\u91CD\u590D\u5B9E\u9A8C\u7ED3\u679C\uFF1B\u4E0D\u5F97\u5F15\u7528 Experiments \u4E2D\u7684\u8868\u683C\u6216\u56FE\u7247\u3002\u539F\u5219\u4E0A\u4E0D\u5199\u5177\u4F53\u7ED3\u679C\u6570\u5B57\uFF0C\u786E\u6709\u5206\u6790\u5FC5\u8981\u65F6\u6700\u591A\u4FDD\u7559\u4E09\u4E2A\uFF1B\u6700\u591A\u4F7F\u7528\u56DB\u4E2A cite \u547D\u4EE4\uFF0C\u4E14\u53EA\u80FD\u4F7F\u7528\u5F53\u524D .bib key\uFF1B\u4E0D\u5F97\u5F15\u5165 Method/Experiments \u4E2D\u4E0D\u5B58\u5728\u7684\u65B0\u6A21\u5757\u3001\u5B9E\u9A8C\u6216\u7ED3\u8BBA\uFF1B
- Conclusion \u6070\u597D\u4E24\u4E2A\u666E\u901A\u6BB5\u843D\uFF1B\u7B2C\u4E00\u6BB5\u56DE\u5230\u95EE\u9898\u3001\u6838\u5FC3\u601D\u60F3\u3001\u8BA1\u7B97\u5B9E\u73B0\u548C\u4E3B\u8981\u8BC1\u636E\uFF0C\u7B2C\u4E8C\u6BB5\u8BF4\u660E\u610F\u4E49\u3001\u9002\u7528\u8FB9\u754C\u548C\u672A\u6765\u65B9\u5411\uFF1B
- Conclusion \u4E0D\u4F7F\u7528 cite\uFF0C\u4E0D\u5F15\u5165\u65B0\u4E3B\u5F20\uFF0C\u4E0D\u590D\u523B Abstract \u7684\u53E5\u5F0F\u3002
{{discussion_conclusion_word_limits}}

### \u4E2D\u6587\u62A5\u544A\u56FA\u5B9A\u6E05\u5355

\u62A5\u544A\u5FC5\u987B\u5305\u542B\uFF1A\u4ECE Method/Experiments \u62BD\u53D6\u7684\u4E8B\u5B9E\u5E95\u7A3F\u3001Abstract \u53E5\u5B50\u529F\u80FD\u8868\u3001Introduction P1\u2013P6 \u529F\u80FD\u8868\u3001\u4E09\u70B9\u8D21\u732E\u65E7/\u65B0\u5BF9\u7167\u3001Related Work \u4E3B\u9898\u4E0E\u6587\u732E\u7C07\u3001Discussion \u7684\u8BC1\u636E/\u63A8\u65AD/\u8FB9\u754C\u8868\u3001Conclusion \u4E24\u6BB5\u529F\u80FD\u8868\u3001\u672F\u8BED\u5BF9\u9F50\u3001\u8054\u7F51\u6838\u9A8C\u3001\u5B9E\u9645\u91CD\u6784\u6E05\u5355\u548C\u4E0B\u4E00\u6B65\u4EA4\u63A5\u6458\u8981\u3002`,
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
- Use "we" no more than six times in Introduction. P1\u2013P4 may cite; P5\u2013P6 may not. Every key must exist in the current .bib.
{{introduction_word_limits}}

### Fixed Structure for Related Work

- Fix the hierarchy as section{Related Work} \u2192 exactly three subsections;
- Each subsection title contains three to seven English words in title case;
{{narrative_related_work_structure}}
- The first sentence uses active voice and present tense to summarize a stable observation;
- Exactly one sentence uses simple past tense to describe a representative author action;
- The final sentence of each subsection contains no more than 18 words and synthesizes or summarizes that subsection's literature. It may lead naturally to the paper's position only when the analysis warrants it, but must not name the paper's method or use "we";
- Synthesize paradigms, training signals, structural assumptions, efficiency, or generalization trade-offs. Never narrate papers one by one;
- Recommend 15\u201325 real BibTeX keys across the section, prioritizing at least 60% from the last three years. Use older work only for task definition or foundations, at most three keys per sentence, and "we" no more than three times outside the prohibited subsection-final sentences;
- Before drafting, plan the three subsection themes, rationale, and existing keys in the report.

### Fixed Structure for Discussion and Conclusion

{{narrative_discussion_structure}}
- Discussion must distinguish direct evidence, reasonable inference, and untested mechanisms, and provide synthesis rather than repeat experimental results. Do not cite tables or figures from Experiments. Prefer no specific result values and retain at most three only when analytically necessary; use at most four cite commands from the current .bib; and introduce no component, experiment, or conclusion absent from Method/Experiments;
- Conclusion has exactly two ordinary paragraphs. Paragraph 1 returns to the problem, core idea, computational realization, and primary evidence. Paragraph 2 states significance, applicable boundaries, and future directions;
- Conclusion uses no cite, introduces no new claim, and does not copy Abstract phrasing.
{{discussion_conclusion_word_limits}}

### Fixed Chinese-report Checklist

The report must contain the fact base extracted from Method/Experiments, Abstract sentence-function table, Introduction P1\u2013P6 function table, old/new three-contribution comparison, Related Work themes and citation clusters, Discussion evidence/inference/boundary table, Conclusion two-paragraph function table, terminology alignment, web verification, actual reconstruction log, and next-step handoff.`
    },
    inlineStyleConstraints: [
      {
        marker: "narrative_related_work_structure",
        branches: {
          conference: {
            zh: "- \u4F1A\u8BAE\u8BBA\u6587\u7684\u6BCF\u4E2A subsection \u6070\u597D\u4E00\u4E2A\u666E\u901A\u6BB5\u843D\uFF1B\n{{related_work_word_limits_conference}}",
            en: "- In a conference paper, each subsection contains exactly one ordinary paragraph;\n{{related_work_word_limits_conference}}"
          },
          journal: {
            zh: "- \u671F\u520A\u8BBA\u6587\u7684\u6BCF\u4E2A subsection \u6070\u597D\u4E24\u4E2A\u666E\u901A\u6BB5\u843D\uFF1B\n{{related_work_word_limits_journal}}",
            en: "- In a journal paper, each subsection contains exactly two ordinary paragraphs;\n{{related_work_word_limits_journal}}"
          }
        }
      },
      {
        marker: "narrative_discussion_structure",
        branches: {
          conference: {
            zh: "- \u4F1A\u8BAE\u8BBA\u6587\u7684 Discussion and Limitations \u5148\u8BBE\u7F6E\u4E09\u4E2A\u627F\u62C5\u7EFC\u5408\u89E3\u91CA\u3001\u9002\u7528\u8303\u56F4\u4E0E\u79D1\u5B66\u610F\u4E49\u7684 discussion subsection\uFF0C\u6700\u540E\u5355\u5217\u4E00\u4E2A Limitations subsection\uFF1B\u524D\u4E09\u4E2A\u5C0F\u8282\u5404\u5305\u542B\u4E00\u4E2A\u6216\u4E24\u4E2A\u666E\u901A\u6BB5\u843D\uFF0CLimitations \u805A\u7126\u771F\u5B9E\u8FB9\u754C\u800C\u4E0D\u91CD\u590D\u7ED3\u679C\uFF1B\n{{narrative_limitations_word_limits}}",
            en: "- A conference paper uses three discussion subsections for synthesis, scope, and scientific implications, followed by a separate Limitations subsection. Each of the first three contains one or two ordinary paragraphs; Limitations focuses on real boundaries without repeating results;\n{{narrative_limitations_word_limits}}"
          },
          journal: {
            zh: "- \u671F\u520A\u8BBA\u6587\u7684 Discussion \u6070\u597D\u4E09\u4E2A subsection\uFF1AMechanistic Interpretation\u3001Scope and Implications\u3001Limitations and Future Directions\uFF1B\u6BCF\u4E2A\u5C0F\u8282\u5305\u542B\u4E00\u4E2A\u6216\u4E24\u4E2A\u666E\u901A\u6BB5\u843D\uFF1B",
            en: "- A journal paper's Discussion has exactly three subsections\u2014Mechanistic Interpretation, Scope and Implications, and Limitations and Future Directions\u2014with one or two ordinary paragraphs in each;"
          }
        }
      }
    ],
    inlineWordLimits: [
      {
        marker: "abstract_word_limits",
        standard: {
          zh: `- \u542F\u7528\u5B57\u6570\u9650\u5236\u65F6\uFF0CAbstract \u4E3A {{abstract_min}}\u2013{{abstract_max}} \u8BCD\uFF1BBackground \u6BCF\u53E5 16\u201324 \u8BCD\uFF1BBridge \u4E3A 12\u201318 \u8BCD\uFF1BMethod \u6BCF\u53E5 16\u201324 \u8BCD\uFF1BResults \u6BCF\u53E5 14\u201322 \u8BCD\uFF1BImplication \u4E3A 12\u201318 \u8BCD\u3002`,
          en: `- When a word limit is enabled, Abstract contains {{abstract_min}}\u2013{{abstract_max}} words; each Background sentence contains 16\u201324 words; Bridge contains 12\u201318; each Method sentence 16\u201324; each Results sentence 14\u201322; and Implication 12\u201318.`
        }
      },
      {
        marker: "introduction_word_limits",
        standard: {
          zh: `- \u542F\u7528\u5B57\u6570\u9650\u5236\u65F6\uFF0CIntroduction \u603B\u8BA1 {{introduction_min}}\u2013{{introduction_max}} \u8BCD\uFF0C\u6BCF\u53E5\u4E0D\u8D85\u8FC7 25 \u8BCD\uFF1BP1 \u4E3A {{intro_p1_min}}\u2013{{intro_p1_max}} \u8BCD\uFF0CP2 \u4E3A {{intro_p2_min}}\u2013{{intro_p2_max}} \u8BCD\uFF0CP3 \u4E3A {{intro_p3_min}}\u2013{{intro_p3_max}} \u8BCD\uFF0CP4 \u4E3A {{intro_p4_min}}\u2013{{intro_p4_max}} \u8BCD\uFF0CP5 \u4E3A {{intro_p5_min}}\u2013{{intro_p5_max}} \u8BCD\uFF0CP6 \u4E3A {{intro_p6_min}}\u2013{{intro_p6_max}} \u8BCD\uFF1BP5 \u7684\u4E09\u70B9\u8D21\u732E\u6BCF\u70B9 15\u201325 \u8BCD\u3002`,
          en: `- When a word limit is enabled, Introduction totals {{introduction_min}}\u2013{{introduction_max}} words with no sentence over 25 words. P1 contains {{intro_p1_min}}\u2013{{intro_p1_max}} words; P2 {{intro_p2_min}}\u2013{{intro_p2_max}}; P3 {{intro_p3_min}}\u2013{{intro_p3_max}}; P4 {{intro_p4_min}}\u2013{{intro_p4_max}}; P5 {{intro_p5_min}}\u2013{{intro_p5_max}}; and P6 {{intro_p6_min}}\u2013{{intro_p6_max}}. Each of P5's three contribution items contains 15\u201325 words.`
        }
      },
      {
        marker: "related_work_word_limits_conference",
        standard: {
          zh: `- \u542F\u7528\u5B57\u6570\u9650\u5236\u65F6\uFF0CRelated Work \u603B\u8BA1 {{related_work_min}}\u2013{{related_work_max}} \u8BCD\uFF1B\u6BCF\u4E2A subsection \u7684\u552F\u4E00\u6BB5\u843D\u4E3A {{related_subsection_min}}\u2013{{related_subsection_max}} \u8BCD\uFF0C\u6BCF\u53E5\u4E0D\u8D85\u8FC7 22 \u8BCD\u3002`,
          en: `- When a word limit is enabled, Related Work totals {{related_work_min}}\u2013{{related_work_max}} words; each subsection's sole paragraph contains {{related_subsection_min}}\u2013{{related_subsection_max}} words, and no sentence exceeds 22 words.`
        }
      },
      {
        marker: "related_work_word_limits_journal",
        standard: {
          zh: `- \u542F\u7528\u5B57\u6570\u9650\u5236\u65F6\uFF0CRelated Work \u603B\u8BA1 {{related_work_min}}\u2013{{related_work_max}} \u8BCD\uFF1B\u6BCF\u4E2A subsection \u4E3A {{related_subsection_min}}\u2013{{related_subsection_max}} \u8BCD\uFF0C\u6BCF\u6BB5\u4E3A {{related_paragraph_min}}\u2013{{related_paragraph_max}} \u8BCD\uFF0C\u6BCF\u53E5\u4E0D\u8D85\u8FC7 22 \u8BCD\u3002`,
          en: `- When a word limit is enabled, Related Work totals {{related_work_min}}\u2013{{related_work_max}} words; each subsection contains {{related_subsection_min}}\u2013{{related_subsection_max}} words, each paragraph {{related_paragraph_min}}\u2013{{related_paragraph_max}}, and no sentence exceeds 22 words.`
        }
      },
      {
        marker: "narrative_limitations_word_limits",
        standard: {
          zh: "- \u542F\u7528\u5B57\u6570\u9650\u5236\u65F6\uFF0C\u4F1A\u8BAE\u8BBA\u6587\u7684 Limitations subsection \u7EA6 100 \u8BCD\u3002",
          en: "- When a word limit is enabled, keep the conference-paper Limitations subsection at approximately 100 words."
        }
      },
      {
        marker: "discussion_conclusion_word_limits",
        standard: {
          zh: `- \u542F\u7528\u5B57\u6570\u9650\u5236\u65F6\uFF0CDiscussion \u603B\u8BA1 {{discussion_min}}\u2013{{discussion_max}} \u8BCD\uFF1BConclusion \u603B\u8BA1 {{conclusion_min}}\u2013{{conclusion_max}} \u8BCD\uFF0C\u6BCF\u53E5\u4E0D\u8D85\u8FC7 24 \u8BCD\uFF0C\u7B2C\u4E00\u6BB5\u4E3A {{conclusion_p1_min}}\u2013{{conclusion_p1_max}} \u8BCD\uFF0C\u7B2C\u4E8C\u6BB5\u4E3A {{conclusion_p2_min}}\u2013{{conclusion_p2_max}} \u8BCD\u3002`,
          en: `- When a word limit is enabled, Discussion totals {{discussion_min}}\u2013{{discussion_max}} words. Conclusion totals {{conclusion_min}}\u2013{{conclusion_max}} words with no sentence over 24 words; Paragraph 1 contains {{conclusion_p1_min}}\u2013{{conclusion_p1_max}} words and Paragraph 2 {{conclusion_p2_min}}\u2013{{conclusion_p2_max}}.`
        }
      }
    ]
  },
  "final-refinement": {
    core: {
      zh: `### \u5168\u6587\u8BED\u8A00\u7CBE\u4FEE\u9010\u53E5\u68C0\u67E5

- \u8BED\u6CD5\u3001\u51A0\u8BCD\u3001\u5355\u590D\u6570\u3001\u4E3B\u8C13\u4E00\u81F4\u3001\u65F6\u6001\u548C\u8BED\u6001\uFF1B
- \u53E5\u5B50\u662F\u5426\u8FC7\u957F\u3001\u8FC7\u788E\u6216\u5305\u542B\u591A\u5C42\u4ECE\u53E5\uFF1B
- \u4E3B\u9898\u53E5\u662F\u5426\u660E\u786E\uFF0C\u6BB5\u843D\u662F\u5426\u53EA\u6709\u4E00\u4E2A\u4E3B\u8981\u529F\u80FD\uFF1B
- \u53E5\u95F4\u548C\u6BB5\u95F4\u662F\u5426\u5B58\u5728\u81EA\u7136\u903B\u8F91\u8FDE\u63A5\uFF1B
- \u662F\u5426\u9891\u7E41\u4F7F\u7528\u76F8\u540C\u53E5\u9996\u6216\u673A\u68B0\u5E73\u884C\u7ED3\u6784\uFF1B
- \u662F\u5426\u6EE5\u7528 we\u3001it\u3001this\u3001which \u6216\u6A21\u7CCA\u6307\u4EE3\uFF1B
- \u662F\u5426\u5B58\u5728\u53E3\u8BED\u3001\u5BA3\u4F20\u3001\u7A7A\u6D1E\u8BC4\u4EF7\u6216\u65E0\u6CD5\u6838\u9A8C\u7684\u6CDB\u5316\uFF1B
- \u662F\u5426\u628A\u540D\u8BCD\u5806\u53E0\u6210\u96BE\u4EE5\u9605\u8BFB\u7684\u77ED\u8BED\uFF1B
- \u4F18\u5148\u4F7F\u7528\u4E00\u822C\u73B0\u5728\u65F6\u3001\u4E3B\u52A8\u8BED\u6001\u548C\u65E0\u751F\u547D\u4E3B\u8BED\uFF1B\u53EA\u6709\u660E\u786E\u5386\u53F2\u7814\u7A76\u884C\u4E3A\u624D\u7528\u4E00\u822C\u8FC7\u53BB\u65F6\u3002

### \u672F\u8BED\u3001\u7F29\u5199\u548C\u8DE8\u7AE0\u8282\u529F\u80FD\u6CBB\u7406

- \u5EFA\u7ACB\u6700\u7EC8 Terminology Consistency Table\uFF1Acanonical term\u3001\u65B9\u6CD5\u5168\u79F0\u548C\u65E2\u5B9A\u8BBA\u6587\u54C1\u724C\u7F29\u5199\u3001\u6A21\u5757/\u8868\u793A/\u67E5\u8BE2/\u5206\u652F/\u635F\u5931/\u6570\u636E/\u6307\u6807\u672F\u8BED\u3001\u9996\u6B21\u5B9A\u4E49\u3001\u7981\u7528\u53D8\u4F53\u3001\u5197\u4F59\u7F29\u5199\u548C\u5FC5\u987B\u533A\u5206\u7684\u6982\u5FF5\uFF1B
- \u68C0\u67E5\u6807\u9898\u3001\u6458\u8981\u3001\u6B63\u6587\u3001\u56FE\u3001\u8868\u3001caption\u3001\u516C\u5F0F\u548C\u7B97\u6CD5\u662F\u5426\u5B8C\u5168\u4E00\u81F4\uFF1B
- \u68C0\u67E5 Abstract \u662F\u5426\u590D\u5236 Introduction\uFF0CIntroduction \u662F\u5426\u63D0\u524D\u5C55\u5F00\u8FC7\u591A\u65B9\u6CD5\u6216\u6570\u5B57\uFF0CRelated Work \u662F\u5426\u91CD\u590D Introduction \u6216\u9010\u7BC7\u7F57\u5217\uFF0CMethod Overview \u662F\u5426\u91CD\u590D\u6838\u5FC3\u673A\u5236\uFF0CExperiments \u662F\u5426\u9010\u9879\u6717\u8BFB\u8868\u683C\uFF0CDiscussion \u662F\u5426\u590D\u8FF0 Results\uFF0CConclusion \u662F\u5426\u590D\u5236 Abstract\uFF0C\u4E09\u70B9\u8D21\u732E\u662F\u5426\u4E0E Method/Experiments/Conclusion \u4E00\u81F4\uFF0C\u540C\u4E00\u5C40\u9650\u662F\u5426\u591A\u5904\u91CD\u590D\uFF1B
- \u8F93\u51FA Cross-Section Redundancy Matrix\uFF0C\u8BF4\u660E\u5220\u9664\u3001\u5408\u5E76\u6216\u4FDD\u7559\u539F\u56E0\u3002

### Claim\u2013Evidence \u7EC8\u5BA1

\u5BF9\u6807\u9898\u3001\u6458\u8981\u3001Introduction\u3001\u8D21\u732E\u3001Results\u3001Discussion \u548C Conclusion \u7684\u6BCF\u4E2A\u4E3B\u8981 claim \u6807\u8BB0\uFF1A

- claim \u7C7B\u578B\uFF1A\u4E8B\u5B9E\u3001\u5B9E\u9A8C\u89C2\u5BDF\u3001\u673A\u5236\u89E3\u91CA\u3001\u63A8\u65AD\u6216\u666E\u904D\u6027\u4E3B\u5F20\uFF1B
- \u8BC1\u636E\u4F4D\u7F6E\uFF1A\u8868\u3001\u56FE\u3001\u516C\u5F0F\u3001\u6848\u4F8B\u6216\u5F15\u7528\uFF1B
- \u8BC1\u636E\u662F\u5426\u5145\u5206\uFF1B
- \u662F\u5426\u9700\u8981\u964D\u7EA7\u4E3A suggests\u3001indicates\u3001is consistent with \u7B49\u514B\u5236\u8868\u8FBE\uFF1B
- \u662F\u5426\u5B58\u5728\u5355\u4E00\u8BBE\u7F6E\u6CDB\u5316\u3001\u56E0\u679C\u5316\u3001\u9009\u62E9\u6027\u62A5\u544A\u6216\u516C\u5E73\u6BD4\u8F83\u98CE\u9669\u3002

\u8BC1\u636E\u4E0D\u8DB3\u7684 claim \u5FC5\u987B\u5220\u9664\u3001\u7F29\u5C0F\u6216\u660E\u786E\u9650\u5B9A\u3002

### \u6570\u5B57\u3001\u5F15\u7528\u4E0E LaTeX \u7EC8\u5BA1

- \u6838\u5BF9\u6B63\u6587\u3001\u8868\u683C\u3001\u56FE\u548C\u6458\u8981\u4E2D\u7684\u6240\u6709\u6570\u5B57\uFF0C\u767E\u5206\u6570\u3001\u5C0F\u6570\uFF0C\u7EDD\u5BF9/\u76F8\u5BF9\u63D0\u5347\uFF0C\u5747\u503C/\u6807\u51C6\u5DEE\uFF0C\u968F\u673A\u79CD\u5B50\u548C\u8FD0\u884C\u6B21\u6570\uFF0C\u6307\u6807\u65B9\u5411\uFF0Cbest/second-best\uFF0C\u6570\u636E\u89C4\u6A21\u4E0E\u5212\u5206\uFF0C\u53C2\u6570\u91CF\u3001FLOPs\u3001\u5EF6\u8FDF\u3001\u541E\u5410\u91CF\u3001\u663E\u5B58\u5355\u4F4D\u548C\u663E\u8457\u6027\u672F\u8BED\uFF1B
- \u9010\u4E00\u89E3\u6790 cite key \u5E76\u4E0E .bib \u6821\u9A8C\uFF0C\u68C0\u67E5\u8BED\u4E49\u652F\u6301\uFF0C\u5220\u9664 citation dumping\u3001\u91CD\u590D\u548C\u65E0\u5173\u5F15\u7528\uFF0C\u68C0\u67E5\u8FD1\u4E09\u5E74\u8986\u76D6\u53CA\u6700\u8FD1\u90BB\u5DE5\u4F5C\uFF1B
- \u68C0\u67E5\u6240\u6709\u56FE\u8868\u3001\u516C\u5F0F\u548C\u7B97\u6CD5\u662F\u5426\u88AB\u6B63\u6587\u5F15\u7528\uFF0Clabel \u662F\u5426\u552F\u4E00\u3001ref \u662F\u5426\u6709\u6548\u3001caption \u662F\u5426\u81EA\u5305\u542B\u4E14\u514B\u5236\u3001\u56FE\u4F8B\u4E0E\u7B26\u53F7\u662F\u5426\u89E3\u91CA\u3001\u516C\u5F0F\u7EF4\u5EA6\u4E0E\u7F16\u53F7\u662F\u5426\u4E00\u81F4\u3001\u8868\u683C\u662F\u5426\u6709\u672A\u89E3\u91CA\u5217\u3001\u662F\u5426\u9057\u7559\u5360\u4F4D\u7B26\u6216\u7F16\u8BD1\u8B66\u544A\uFF1B
- \u73AF\u5883\u652F\u6301\u65F6\u5B9E\u9645\u7F16\u8BD1\u5E76\u62A5\u544A\uFF1B\u65E0\u6CD5\u7F16\u8BD1\u65F6\u4E0D\u5F97\u58F0\u79F0\u6210\u529F\u3002

### \u6A21\u62DF\u5BA1\u7A3F\u4EBA\u653B\u51FB\u6D4B\u8BD5

\u9010\u9879\u653B\u51FB\u5E76\u5904\u7406\uFF1A\u79D1\u5B66\u65B0\u610F\u662F\u5426\u53EA\u662F\u6A21\u5757\u62FC\u63A5\u3001\u6838\u5FC3\u601D\u60F3\u662F\u5426\u533A\u522B\u4E8E\u73B0\u6709\u5DE5\u4F5C\u3001\u673A\u5236\u662F\u5426\u6709\u5FC5\u8981\u6027\u89E3\u91CA\u3001\u5B9E\u9A8C\u662F\u5426\u652F\u6301\u5168\u90E8\u8D21\u732E\u3001\u662F\u5426\u7F3A\u5C11\u5173\u952E\u6D88\u878D\u6216\u516C\u5E73\u6BD4\u8F83\u3001\u53C2\u6570\u662F\u5426\u5728\u6D4B\u8BD5\u96C6\u4E0A\u9009\u62E9\u3001\u7ED3\u8BBA\u662F\u5426\u8D85\u51FA\u8BC1\u636E\u3001Discussion/Limitations \u662F\u5426\u8BDA\u5B9E\u3001\u6807\u9898\u548C\u6458\u8981\u662F\u5426\u8FC7\u5EA6\u5305\u88C5\u3002\u65E0\u6CD5\u901A\u8FC7\u6587\u5B57\u4FEE\u590D\u7684\u5B9E\u9A8C\u7F3A\u53E3\u5FC5\u987B\u4FDD\u7559\u5728\u62A5\u544A\u4E2D\u3002

### \u4E2D\u6587\u62A5\u544A\u56FA\u5B9A\u6E05\u5355

\u62A5\u544A\u5FC5\u987B\u5305\u542B\uFF1A\u7EC8\u5BA1\u6458\u8981\u4E0E\u91CD\u5927\u4FEE\u6B63\u3001Terminology Consistency Table\u3001\u7F29\u5199\u9996\u6B21\u5B9A\u4E49\u4E0E\u5197\u4F59\u7F29\u5199\u8868\u3001Cross-Section Redundancy Matrix\u3001Claim\u2013Evidence \u8868\u3001\u6570\u5B57\u7EDF\u8BA1\u8868\u3001\u5F15\u7528\u952E\u4E0E\u8BED\u4E49\u652F\u6301\u5BA1\u8BA1\u3001\u56FE\u8868/\u516C\u5F0F/\u7B97\u6CD5/LaTeX \u5BA1\u8BA1\u3001\u5BA1\u7A3F\u4EBA\u653B\u51FB\u6D4B\u8BD5\u3001\u65E0\u6CD5\u901A\u8FC7\u6587\u5B57\u89E3\u51B3\u7684\u98CE\u9669\u3001\u8054\u7F51\u6838\u9A8C\u4E0E\u5B8C\u6574\u6700\u7EC8 BibTeX \u7684\u65B0\u589E/\u4FEE\u6B63\u8BB0\u5F55\u3001\u9010\u7AE0\u8282\u4FEE\u6539\u6E05\u5355\u548C\u6295\u7A3F\u76EE\u6807\u68C0\u7D22\u4EA4\u63A5\u6458\u8981\u3002`,
      en: `### Sentence-by-sentence Language Checks

- Grammar, articles, singular/plural form, subject\u2013verb agreement, tense, and voice;
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

### Final Claim\u2013Evidence Audit

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

The report must contain the final-audit summary and major revisions, Terminology Consistency Table, first-definition and redundant-acronym table, Cross-Section Redundancy Matrix, Claim\u2013Evidence table, numeric/statistical table, citation-key and semantic-support audit, visual/equation/algorithm/LaTeX audit, reviewer attack test, risks prose cannot solve, web verification and the addition/correction log for the complete final BibTeX library, section-by-section revision log, and the submission-targeting handoff.`
    }
  },
  "venue-targeting": {
    core: {
      zh: `### \u672C\u8F6E\u7EDD\u5BF9\u8FB9\u754C

- \u4E0D\u5F97\u6539\u53D8 documentclass\u3001\u5B8F\u5305\u3001\u4F5C\u8005\u683C\u5F0F\u3001\u53C2\u8003\u6587\u732E\u683C\u5F0F\u3001\u5355\u53CC\u680F\u3001\u56FE\u8868\u6837\u5F0F\u3001\u9875\u8FB9\u8DDD\u6216\u4EFB\u4F55\u6A21\u677F\u5185\u5BB9\uFF1B
- \u4E0D\u5F97\u4E3A\u4E86\u5339\u914D venue \u6539\u5199\u6807\u9898\u3001\u6458\u8981\u3001Introduction\u3001\u7AE0\u8282\u540D\u3001\u53C2\u8003\u6587\u732E\u6216\u6B63\u6587\uFF1B
- \u4E0D\u5F97\u8F6C\u6362\u5230\u51FA\u7248\u793E\u6216\u4F1A\u8BAE\u6A21\u677F\uFF1B
- \u8BBA\u6587\u6587\u4EF6\u53EA\u4F5C\u4E3A\u53EA\u8BFB\u8F93\u5165\uFF1B\u4E0D\u5F97\u590D\u5236\u3001\u5F52\u6863\u3001\u91CD\u547D\u540D\u6216\u751F\u6210\u4EFB\u4F55 .tex\u3001.md \u6216\u5176\u4ED6\u4E0B\u8F7D\u6587\u4EF6\u3002\u53D1\u73B0\u660E\u786E\u9519\u8BEF\u53EA\u5728\u5F53\u524D\u5BF9\u8BDD\u4E2D\u63D0\u51FA\uFF1B
- \u672C\u8F6E\u4E0D\u4FEE\u6539\u6216\u751F\u6210 BibTeX \u6587\u732E\u5E93\uFF0C\u91CD\u70B9\u662F\u76EE\u6807\u7B5B\u9009\u548C\u5B98\u7F51\u6838\u9A8C\u3002

### \u6765\u6E90\u4F18\u5148\u7EA7

1. venue \u5B98\u65B9\u4E3B\u9875\u4E0E\u51FA\u7248\u793E\u9875\u9762\uFF1B
2. \u5B98\u65B9 Aims and Scope \u6216 Call for Papers\uFF1B
3. \u5B98\u65B9 Guide for Authors\u3001Submission Guidelines \u548C\u6295\u7A3F\u7CFB\u7EDF\uFF1B
4. Clarivate Master Journal List/JCR\u3001\u4F1A\u8BAE\u5B98\u65B9\u7EC4\u7EC7\u65B9\u6216\u5176\u4ED6\u5BF9\u5E94\u6743\u5A01\u7D22\u5F15\uFF1B
5. \u5B98\u65B9 Open Access\u3001APC\u3001\u6CE8\u518C\u8D39\u548C\u8865\u5145\u6750\u6599\u653F\u7B56\u9875\uFF1B
6. DOAJ\u3001Scopus Sources \u6216 SCImago \u53EA\u80FD\u4F5C\u4E3A\u8F85\u52A9\uFF0C\u4E0D\u5F97\u66FF\u4EE3\u6743\u5A01\u6536\u5F55\u6216\u7B49\u7EA7\u5224\u65AD\u3002

\u6BCF\u4E2A\u53EF\u80FD\u53D8\u5316\u7684\u4E8B\u5B9E\u5FC5\u987B\u9644\u53EF\u70B9\u51FB\u6765\u6E90\u5E76\u8BB0\u5F55\u6838\u9A8C\u65E5\u671F\u3002\u6CA1\u6709\u5B98\u65B9\u6570\u636E\u5C31\u5199\u201C\u672A\u6838\u9A8C\u201D\uFF0C\u4E0D\u5F97\u731C\u6D4B\u63A5\u6536\u7387\u3001\u5BA1\u7A3F\u5468\u671F\u3001\u8D39\u7528\u6216\u5F53\u524D\u89C4\u5219\u3002

### Manuscript\u2013Venue Profile \u5FC5\u67E5\u5B57\u6BB5

- \u9886\u57DF\u4E0E\u5B50\u9886\u57DF\u3001\u4EFB\u52A1\u3001\u6570\u636E\u5F62\u6001\u3001\u65B9\u6CD5\u8303\u5F0F\u548C\u4E3B\u8981\u8D21\u732E\uFF1B
- \u7406\u8BBA\u3001\u65B9\u6CD5\u3001\u7CFB\u7EDF\u3001\u5E94\u7528\u6216\u8DE8\u5B66\u79D1\u5C5E\u6027\uFF1B
- \u76EE\u6807\u8BFB\u8005\u3001\u6B63\u6587\u89C4\u6A21\u3001\u56FE\u8868\u6570\u91CF\u3001\u53C2\u8003\u6587\u732E\u6570\u91CF\u548C\u8865\u5145\u6750\u6599\uFF1B
- \u8BC1\u636E\u5F3A\u5EA6\u3001\u6700\u53EF\u80FD\u7684\u5356\u70B9\u548C\u6700\u53EF\u80FD\u7684 desk-reject/triage \u98CE\u9669\u3002

\u4E0D\u5F97\u4E3A\u4E86\u76EE\u6807\u7B5B\u9009\u91CD\u65B0\u5B9A\u4E49\u8BBA\u6587\u79D1\u5B66\u4E3B\u7EBF\u3002

### \u5019\u9009\u6C60\u4E0E\u6838\u9A8C\u5B57\u6BB5

- \u5EFA\u7ACB\u4E0D\u5C11\u4E8E 10 \u4E2A\u3001\u6700\u591A 15 \u4E2A\u5019\u9009\uFF1B
- MDPI\u3001Hindawi \u548C Frontiers \u662F\u7528\u6237\u660E\u786E\u6392\u9664\u7684\u51FA\u7248\u793E\uFF1A\u5176\u65D7\u4E0B\u671F\u520A\u4E0D\u5F97\u8FDB\u5165\u5019\u9009\u6C60\u3001\u8BC4\u5206\u6216\u63A8\u8350\u68AF\u961F\uFF0C\u53EA\u5728\u6392\u9664\u8BB0\u5F55\u4E2D\u6CE8\u660E\u201C\u7528\u6237\u6392\u9664\u201D\uFF0C\u4E0D\u5F97\u5BF9\u51FA\u7248\u793E\u4F5C\u65E0\u4F9D\u636E\u7684\u6CDB\u5316\u8D28\u91CF\u5B9A\u6027\uFF1B
- \u9010\u9879\u6838\u9A8C\u5168\u540D\u3001\u51FA\u7248\u793E/\u7EC4\u7EC7\u65B9\u3001\u5B98\u7F51\u3001\u8303\u56F4\u5339\u914D\u70B9\u3001\u6587\u7AE0\u6216 track \u7C7B\u578B\u3001\u5F53\u524D\u7D22\u5F15/\u7B49\u7EA7\u3001\u6B63\u6587/\u9875\u6570/\u56FE\u8868/\u6458\u8981/\u53C2\u8003\u6587\u732E\u9650\u5236\u3001\u9644\u5F55\u4E0E\u8865\u5145\u6750\u6599\u3001\u533F\u540D\u653F\u7B56\u3001OA/APC \u6216\u6CE8\u518C\u8D39\u7528\u3001\u9644\u52A0\u6587\u4EF6\u3001\u4F26\u7406/\u6570\u636E/\u53EF\u590D\u73B0\u653F\u7B56\u3001\u6295\u7A3F\u5165\u53E3\u548C\u5173\u952E\u65E5\u671F\uFF1B
- \u53EA\u6709\u6743\u5A01\u6765\u6E90\u652F\u6301\u65F6\u624D\u5199 SCIE\u3001SSCI\u3001ESCI\u3001JCR \u5206\u533A\u6216\u4F1A\u8BAE\u7B49\u7EA7\uFF1B
- SJR/Scopus \u4FE1\u606F\u5FC5\u987B\u660E\u786E\u6807\u6CE8\uFF0C\u4E0D\u80FD\u5192\u5145 JCR\uFF1B\u4E2D\u79D1\u9662\u5206\u533A\u4E0E JCR \u5FC5\u987B\u5206\u5F00\u5E76\u6807\u6CE8\u5E74\u4EFD\uFF1B
- \u5F53\u524D\u5C4A\u4E0E\u5386\u53F2\u5C4A\u89C4\u5219\u4E0D\u5F97\u6DF7\u7528\u3002

### 100 \u5206\u5339\u914D\u8BC4\u5206

- \u4E3B\u9898\u4E0E\u8303\u56F4\u5339\u914D\uFF1A30\uFF1B
- \u8BBA\u6587\u7C7B\u578B\u4E0E\u65B9\u6CD5\u8D21\u732E\u5339\u914D\uFF1A20\uFF1B
- \u5B9E\u9A8C\u8BC1\u636E\u4E0E venue \u671F\u671B\u5339\u914D\uFF1A15\uFF1B
- \u76EE\u6807\u7B49\u7EA7\u6216\u5206\u533A\u5339\u914D\uFF1A15\uFF1B
- \u957F\u5EA6\u3001\u56FE\u8868\u4E0E\u6750\u6599\u517C\u5BB9\uFF1A10\uFF1B
- OA/APC\u3001\u6CE8\u518C\u8D39\u3001\u622A\u7A3F\u671F\u4E0E\u7528\u6237\u7EA6\u675F\uFF1A5\uFF1B
- desk-reject\u3001triage \u548C\u7ADE\u4E89\u98CE\u9669\uFF1A5\u3002

\u6BCF\u9879\u5FC5\u987B\u7ED9\u51FA\u7406\u7531\uFF0C\u4E0D\u80FD\u628A\u540D\u6C14\u3001\u7B49\u7EA7\u6216\u5206\u533A\u76F4\u63A5\u7B49\u540C\u4E8E\u5339\u914D\u5EA6\u3002

### \u6295\u7A3F\u68AF\u961F\u4E0E\u62A5\u544A\u56FA\u5B9A\u6E05\u5355

- \u9996\u9009\u4E09\u4E2A\uFF0C\u6309\u6295\u7A3F\u987A\u5E8F\u6392\u5217\uFF1B
- \u7A33\u59A5\u5907\u9009\u4E09\u4E2A\uFF1B
- \u4E0D\u5EFA\u8BAE\u4F46\u5BB9\u6613\u8BEF\u9009\u7684 2\u20134 \u4E2A\uFF0C\u5E76\u8BF4\u660E\u8303\u56F4\u3001\u8D39\u7528\u3001\u6536\u5F55\u3001\u7C7B\u578B\u6216\u65F6\u6548\u98CE\u9669\uFF1B
- \u7ED9\u51FA\u552F\u4E00\u9996\u63A8\u53CA\u5B8C\u6574\u7406\u7531\uFF1B
- \u4E3A\u6BCF\u4E2A\u9996\u9009\u5206\u6790\u8303\u56F4\u3001\u521B\u65B0\u6027\u3001\u5B9E\u9A8C\u3001\u7BC7\u5E45\u3001\u89C4\u5219\u548C\u5199\u4F5C\u98CE\u9669\uFF1B
- \u7ED9\u51FA\u6295\u7A3F\u524D\u6700\u540E\u6838\u9A8C\u4E8B\u9879\u548C\u62D2\u7A3F\u540E\u7684\u987A\u5E8F\u5316\u8F6C\u6295\u8DEF\u5F84\uFF1B
- \u76F4\u63A5\u5728\u5F53\u524D\u5BF9\u8BDD\u4E2D\u7ED9\u51FA\u5B8C\u6574\u4E2D\u6587\u7ED3\u679C\uFF0C\u4E0D\u751F\u6210\u6587\u4EF6\uFF1B
- \u7ED3\u679C\u5FC5\u987B\u5305\u542B\u6838\u9A8C\u65E5\u671F\u3001\u7528\u6237\u7EA6\u675F/\u9ED8\u8BA4\u5047\u8BBE\u3001Manuscript\u2013Venue Profile\u3001\u5019\u9009\u6C60\u3001\u6765\u6E90\u3001\u6392\u9664\u8FC7\u7A0B\u3001\u8BC4\u5206\u3001\u68AF\u961F\u3001\u552F\u4E00\u9996\u63A8\u3001\u98CE\u9669\u3001\u653F\u7B56\u6458\u8981\u3001\u8F6C\u6295\u8DEF\u5F84\u3001\u672A\u6838\u9A8C\u4FE1\u606F\u53CA\u201C\u672A\u6539\u6A21\u677F\u3001\u672A\u6539\u6B63\u6587\u3001\u672A\u751F\u6210\u6587\u4EF6\u201D\u58F0\u660E\u3002`,
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

### Required Manuscript\u2013Venue Profile Fields

- Field and subfield, task, data modality, method paradigm, and primary contributions;
- Theoretical, methodological, system, application, or interdisciplinary character;
- Target readership, main-text scale, number of visuals and references, and supplementary material;
- Evidence strength, strongest selling point, and likely desk-reject/triage risk.

Do not redefine the scientific throughline for targeting.

### Candidate-pool and Verification Fields

- Build no fewer than 10 and no more than 15 candidates;
- MDPI, Hindawi, and Frontiers are explicit user exclusions. Do not place journals from these publishers in the candidate pool, scoring, or recommendation tiers. Record them only as \u201Cexcluded by user\u201D and do not make unsupported general quality claims about the publishers;
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
- The result must contain verification date, user constraints/default assumptions, Manuscript\u2013Venue Profile, candidate pool, sources, exclusion process, scores, tiers, top recommendation, risks, policy summary, transfer path, unverified facts, and a statement that the template and prose were unchanged and no file was generated.`
    }
  }
};

// content/prompts/buildPrompt.ts
var LABELS = {
  zh: {
    role: "## \u4F60\u7684\u89D2\u8272",
    configuration: "## \u5F53\u524D\u914D\u7F6E",
    paperStyle: "\u8BBA\u6587\u7C7B\u578B",
    lengthMode: "\u5B57\u6570\u6A21\u5F0F",
    flexibleCoreMode: "\u6B63\u6587\u603B\u6570\u4E0D\u9650\uFF1B\u4EC5\u9650\u5236\u65B9\u6CD5\u548C\u5B9E\u9A8C\u4EE5\u5916\u7684\u7AE0\u8282",
    targetType: "\u6295\u7A3F\u7C7B\u578B",
    appendix: "\u9644\u5F55",
    styleDirective: "\u5199\u4F5C\u4FA7\u91CD",
    openAccess: "\u662F\u5426 OA",
    apc: "\u662F\u5426\u6709 APC",
    apcRange: "APC \u8303\u56F4",
    impactFactor: "\u5F71\u54CD\u56E0\u5B50\uFF08IF\uFF09",
    reviewArticles: "\u7EFC\u8FF0\u6587\u7AE0",
    jcrQuartiles: "JCR \u5206\u533A",
    casZones: "\u4E2D\u79D1\u9662\u5206\u533A",
    citationIndexes: "\u6536\u5F55\u7D22\u5F15",
    excludedPublishers: "\u56FA\u5B9A\u6392\u9664",
    unrestricted: "\u4E0D\u9650",
    yes: "\u662F",
    no: "\u5426",
    submissionFilterInstruction: "\u9664\u201C\u4E0D\u9650\u201D\u5916\uFF0C\u4EE5\u4E0A\u5747\u4E3A\u5019\u9009\u6C60\u7B5B\u9009\u6761\u4EF6\u3002\u5FC5\u987B\u9010\u9879\u901A\u8FC7\u5B98\u7F51\u6216\u6743\u5A01\u6765\u6E90\u6838\u9A8C\uFF1B\u4E0D\u5F97\u731C\u6D4B\uFF0C\u65E0\u6CD5\u6838\u9A8C\u7684\u5019\u9009\u5E94\u660E\u786E\u6807\u8BB0\u5E76\u5355\u72EC\u5217\u51FA\u3002\u5019\u9009\u671F\u520A\u8FD8\u5FC5\u987B\u5904\u4E8E\u6B63\u5E38\u8FD0\u8425\u4E14\u5F53\u524D\u53EF\u6295\u7A3F\u72B6\u6001\uFF1B\u4E0D\u5F97\u628A CiteScore\u3001SJR \u6216\u5176\u4ED6\u6307\u6807\u5192\u5145 JCR Journal Impact Factor\u3002",
    inputs: "## \u672C\u8F6E\u8F93\u5165",
    evidence: "## \u8BC1\u636E\u4E0E\u4E8B\u5B9E\u89C4\u5219",
    manuscriptProtection: "## TeX \u4E0E\u683C\u5F0F\u4FDD\u62A4",
    pdfReview: "## PDF \u6DF1\u5EA6\u9605\u8BFB",
    citationAndWeb: "## \u5F15\u7528\u4E0E\u8054\u7F51\u6838\u9A8C",
    scope: "## \u672C\u8F6E\u8FB9\u754C",
    styleBranch: "### \u5F53\u524D\u7C7B\u578B\u7684\u6267\u884C\u91CD\u70B9",
    length: "## \u6B63\u6587\u4E0E\u7AE0\u8282\u9884\u7B97",
    mainTextTarget: "\u6B63\u6587\u76EE\u6807",
    unlimited: "\u4E0D\u9650",
    countingScope: `\u8BA1\u8BCD\u8303\u56F4\u4E3A Abstract \u81F3 Conclusion\u3002\u6807\u9898\u3001\u4F5C\u8005\u4FE1\u606F\u3001\u5173\u952E\u8BCD\u3001\u516C\u5F0F\u3001\u7B97\u6CD5\u3001\u53C2\u8003\u6587\u732E\u3001\u9644\u5F55\u548C\u8865\u5145\u6750\u6599\u4E0D\u8BA1\u5165\uFF1B\u56FE\u6CE8\u4E0E\u8868\u683C\u5355\u5143\u683C\u4E0D\u9010\u8BCD\u7EDF\u8BA1\uFF0C\u6BCF\u5F20\u8868\u683C\u6216\u56FE\u7247\u6309 ${WORD_COUNT_POLICY.visualWordEquivalent} \u8BCD\u8BA1\u5165\u6240\u5728\u7AE0\u8282\u53CA\u6B63\u6587\u603B\u6570`,
    sectionBudgets: "\u7AE0\u8282\u9884\u7B97",
    recommendedRange: "\u63A8\u8350\u8303\u56F4",
    lengthInstruction: "\u4EE5\u4E0A\u9884\u7B97\u662F\u6B63\u5F0F\u76EE\u6807\u3002\u82E5\u5F53\u524D\u6B65\u9AA4\u53E6\u8BBE\u4E34\u65F6\u4E0A\u9650\uFF0C\u4EE5\u8BE5\u6B65\u9AA4\u7684\u89C4\u5219\u5B8C\u6210\u9636\u6BB5\u6027\u91CD\u6784\uFF0C\u4F46\u540E\u7EED\u4ECD\u987B\u56DE\u5230\u6B63\u5F0F\u76EE\u6807\uFF1B\u4E0D\u5F97\u7528\u5220\u51CF\u5173\u952E\u5B9A\u4E49\u3001\u5B9E\u9A8C\u534F\u8BAE\u6216\u5C40\u9650\u6765\u673A\u68B0\u51D1\u6570\u3002",
    flexibleLengthInstruction: "\u4EC5\u6807\u6709\u6570\u5B57\u9884\u7B97\u7684\u7AE0\u8282\u5FC5\u987B\u8FBE\u6807\uFF1B\u201C\u4E0D\u9650\u201D\u4E0D\u7B49\u4E8E\u4EFB\u610F\u6269\u5199\uFF0CMethod \u4E0E Experiments and Results \u4ECD\u987B\u6309\u79D1\u5B66\u5B8C\u6574\u6027\u4E0E\u8BC1\u636E\u9700\u8981\u5C55\u5F00\u5E76\u5220\u9664\u91CD\u590D\u3002",
    tasks: "## \u672C\u8F6E\u4EFB\u52A1",
    detailedConstraints: "## \u539F\u59CB\u6A21\u677F\u8BE6\u7EC6\u7EA6\u675F",
    deliverables: "## \u8F93\u51FA\u4E0E\u6587\u4EF6\u8981\u6C42",
    targetingDeliverables: "## \u8F93\u51FA\u8981\u6C42",
    fileNames: "### \u6587\u4EF6\u540D",
    deliveryBundle: "### \u5355\u6587\u4EF6\u4EA4\u4ED8\u5305",
    finalChecks: "## \u8F93\u51FA\u524D\u81EA\u68C0",
    words: "\u8BCD"
  },
  en: {
    role: "## Your Role",
    configuration: "## Current Configuration",
    paperStyle: "Paper type",
    lengthMode: "Length mode",
    flexibleCoreMode: "No main-text total; only sections other than Method and Experiments are limited",
    targetType: "Submission type",
    appendix: "Appendix",
    styleDirective: "Writing emphasis",
    openAccess: "OA",
    apc: "APC charged",
    apcRange: "APC range",
    impactFactor: "Impact factor (IF)",
    reviewArticles: "Review articles",
    jcrQuartiles: "JCR quartiles",
    casZones: "CAS zones",
    citationIndexes: "Citation indexes",
    excludedPublishers: "Excluded publishers",
    unrestricted: "Any",
    yes: "Yes",
    no: "No",
    submissionFilterInstruction: "Treat every value other than \u201CAny\u201D as a candidate-pool filter. Verify each item against an official or authoritative source; never guess, and clearly separate candidates whose status cannot be verified. Every candidate journal must also be active and currently accepting submissions. Never present CiteScore, SJR, or another metric as the JCR Journal Impact Factor.",
    inputs: "## Inputs for This Round",
    evidence: "## Evidence and Fact Rules",
    manuscriptProtection: "## TeX and Format Protection",
    pdfReview: "## Deep PDF Review",
    citationAndWeb: "## Citations and Web Verification",
    scope: "## Scope of This Round",
    styleBranch: "### Execution Priorities for the Current Type",
    length: "## Main-text and Section Budgets",
    mainTextTarget: "Main-text target",
    unlimited: "Unlimited",
    countingScope: `Count content from Abstract through Conclusion. Exclude the title, authors, keywords, equations, algorithms, references, appendix, and supplementary material. Do not count captions or table cells word by word; count each table or figure as ${WORD_COUNT_POLICY.visualWordEquivalent} words toward its section and the main-text total`,
    sectionBudgets: "Section budgets",
    recommendedRange: "recommended range",
    lengthInstruction: "These budgets are the formal target. If this step defines a temporary ceiling, follow that step-specific rule for the interim reconstruction and return to the formal target later. Never hit a number by removing essential definitions, experimental protocols, or limitations.",
    flexibleLengthInstruction: "Only sections with numeric budgets must meet a range. \u201CUnlimited\u201D does not permit arbitrary expansion: develop Method and Experiments & Results only as scientific completeness and evidence require, and remove repetition.",
    tasks: "## Tasks for This Round",
    detailedConstraints: "## Detailed Constraints from the Source Template",
    deliverables: "## Output and File Requirements",
    targetingDeliverables: "## Output Requirements",
    fileNames: "### File Names",
    deliveryBundle: "### Single-download Handoff Bundle",
    finalChecks: "## Final Checklist",
    words: "words"
  }
};
function formatNumber(value, language) {
  return new Intl.NumberFormat(language === "zh" ? "zh-CN" : "en-US").format(
    value
  );
}
function buildConfiguration(template, context) {
  const labels = LABELS[context.language];
  const field = (label, value) => context.language === "zh" ? `- ${label}\uFF1A${value}` : `- ${label}: ${value}`;
  if (template.profile === "targeting") {
    const preferences = context.submissionPreferences;
    const modeLabel = (mode) => mode === "any" ? labels.unrestricted : mode === "yes" ? labels.yes : labels.no;
    const selectedOrAny = (values) => values.length > 0 ? values.join(", ") : labels.unrestricted;
    const casZones = preferences?.casZones.map(
      (zone) => context.language === "zh" ? `${zone}\u533A` : `Zone ${zone}`
    ) ?? [];
    return [
      field(labels.targetType, context.styleLabel),
      field(
        labels.openAccess,
        modeLabel(preferences?.openAccess ?? "any")
      ),
      field(labels.apc, modeLabel(preferences?.apc ?? "any")),
      ...preferences?.apc === "yes" ? [
        field(
          labels.apcRange,
          `${preferences.apcCurrency} ${formatNumber(preferences.apcMin, context.language)}\u2013${formatNumber(preferences.apcMax, context.language)}`
        )
      ] : [],
      field(
        labels.impactFactor,
        preferences?.useImpactFactorRange ? `${preferences.impactFactorMin.toFixed(1)}\u2013${preferences.impactFactorMax.toFixed(1)}` : labels.unrestricted
      ),
      field(
        labels.reviewArticles,
        preferences?.requireReviewArticles ? labels.yes : labels.unrestricted
      ),
      field(
        labels.jcrQuartiles,
        selectedOrAny(preferences?.jcrQuartiles ?? [])
      ),
      field(labels.casZones, selectedOrAny(casZones)),
      field(
        labels.citationIndexes,
        selectedOrAny(preferences?.citationIndexes ?? [])
      ),
      field(
        labels.excludedPublishers,
        selectedOrAny(preferences?.excludedPublishers ?? [])
      ),
      "",
      labels.submissionFilterInstruction
    ].join("\n");
  }
  return [
    field(labels.paperStyle, context.styleLabel),
    ...template.showStyleDirective === false ? [] : [field(labels.styleDirective, context.styleDirective)],
    ...context.hasWordLimit && context.unlimitedCoreSections ? [field(labels.lengthMode, labels.flexibleCoreMode)] : [],
    ...template.showAppendixConfiguration === false ? [] : [
      field(labels.appendix, context.appendixLabel),
      context.appendixDirective
    ]
  ].join("\n");
}
function buildLengthBudget(context) {
  if (!context.hasWordLimit) return "";
  const labels = LABELS[context.language];
  const totalRange = context.unlimitedCoreSections ? null : scaleRange(
    context.targetWords,
    SOURCE_BUDGET_REFERENCE.total,
    SOURCE_BUDGET_REFERENCE.totalRange
  );
  const unlimitedSectionIds = new Set(
    WORD_COUNT_POLICY.unlimitedCoreSectionIds
  );
  const budgetLines = context.sectionBudgets.map((section) => {
    if (context.unlimitedCoreSections && unlimitedSectionIds.has(section.id)) {
      return `- ${section.label}: ${labels.unlimited}`;
    }
    const reference = SOURCE_BUDGET_REFERENCE.sections[section.id];
    const range = reference ? scaleRange(section.words, reference.target, reference.range) : [section.words, section.words];
    return `- ${section.label}: ${formatNumber(section.words, context.language)} ${labels.words} (${labels.recommendedRange}: ${formatNumber(range[0], context.language)}\u2013${formatNumber(range[1], context.language)} ${labels.words})`;
  }).join("\n");
  return [
    labels.length,
    "",
    context.unlimitedCoreSections ? `- ${labels.mainTextTarget}: ${labels.unlimited}` : `- ${labels.mainTextTarget}: ${formatNumber(context.targetWords, context.language)} ${labels.words} (${labels.recommendedRange}: ${formatNumber(totalRange[0], context.language)}\u2013${formatNumber(totalRange[1], context.language)} ${labels.words})`,
    `- ${labels.countingScope}`,
    "",
    `### ${labels.sectionBudgets}`,
    budgetLines,
    "",
    context.unlimitedCoreSections ? labels.flexibleLengthInstruction : labels.lengthInstruction
  ].join("\n");
}
function buildDeliveryBundle(template, language) {
  if (template.profile !== "manuscript" || template.contentKind === "framework-figure" || !template.fileNames) {
    return "";
  }
  const bundleName = `<base_name>_round_${template.number}_artifacts.zip`;
  if (language === "zh") {
    return `${LABELS.zh.deliveryBundle}

- \u82E5\u5F53\u524D\u73AF\u5883\u63D0\u4F9B YanShu artifact \u5199\u5165\u5DE5\u5177\uFF0C\u76F4\u63A5\u5206\u522B\u5199\u5165\u5E76\u767B\u8BB0\u4E0A\u8FF0\u4E09\u4E2A\u6587\u4EF6\uFF0C\u4E0D\u518D\u521B\u5EFA\u91CD\u590D\u5F52\u6863\u3002
- \u5426\u5219\uFF0C\u5728\u6700\u7EC8\u56DE\u590D\u4E2D\u521B\u5EFA\u5E76\u9644\u52A0\u4E00\u4E2A\u53EF\u76F4\u63A5\u4E0B\u8F7D\u7684 \`${bundleName}\`\u3002ZIP \u6839\u76EE\u5F55\u5FC5\u987B\u6070\u597D\u5305\u542B\u201C\u6587\u4EF6\u540D\u201D\u4E2D\u5217\u51FA\u7684\u4E09\u4E2A\u5B8C\u6574 UTF-8 \u6587\u4EF6\uFF0C\u4E0D\u8BBE\u5B50\u76EE\u5F55\uFF0C\u4E0D\u52A0\u5165\u989D\u5916\u6587\u4EF6\u3002
- ZIP \u662F\u81EA\u52A8\u5316\u534F\u8C03\u5668\u9996\u9009\u7684\u5355\u6B21\u4E0B\u8F7D\u4EA4\u4ED8\u9762\uFF1B\u5355\u72EC\u6587\u4EF6\u94FE\u63A5\u53EF\u4EE5\u4FDD\u7559\uFF0C\u4F46\u4E0D\u662F\u5FC5\u9700\u3002
- \u4EC5\u5728\u5BF9\u8BDD\u4E2D\u7C98\u8D34\u4EE3\u7801\u5757\u3001\u663E\u793A Canvas/\u6587\u6863\u89C6\u56FE\u6216\u6587\u5B57\u58F0\u79F0\u201C\u6587\u4EF6\u5DF2\u521B\u5EFA\u201D\u90FD\u4E0D\u7B97\u5B8C\u6210\u6587\u4EF6\u4EA4\u4ED8\u3002`;
  }
  return `${LABELS.en.deliveryBundle}

- When YanShu artifact-writing tools are available, write and register the three files separately and do not create a duplicate archive.
- Otherwise, create and attach one directly downloadable \`${bundleName}\` in the final response. The ZIP root must contain exactly the three complete UTF-8 files listed under \u201CFile Names,\u201D with no subdirectories or extra files.
- The ZIP is the automation coordinator's preferred single-download handoff surface. Separate file links may remain available but are optional.
- Pasted code blocks, Canvas/document-only views, or prose claiming that files were created do not constitute file delivery.`;
}
function roundToFive(value) {
  return Math.max(1, Math.round(value / 5) * 5);
}
function scaleRange(current, referenceTarget, referenceRange) {
  return [
    roundToFive(current * referenceRange[0] / referenceTarget),
    roundToFive(current * referenceRange[1] / referenceTarget)
  ];
}
function scaledPair(sectionWords, referenceSectionWords, min, max) {
  return [
    roundToFive(sectionWords * min / referenceSectionWords),
    roundToFive(sectionWords * max / referenceSectionWords)
  ];
}
function buildConstraintTokens(context, templateId) {
  const values = {};
  const sectionWords = Object.fromEntries(
    context.sectionBudgets.map((section) => [section.id, section.words])
  );
  const addPair = (prefix, pair) => {
    values[`${prefix}_min`] = formatNumber(pair[0], context.language);
    values[`${prefix}_max`] = formatNumber(pair[1], context.language);
  };
  for (const [id, reference] of Object.entries(
    SOURCE_BUDGET_REFERENCE.sections
  )) {
    const current = sectionWords[id] ?? reference.target;
    addPair(
      id.replaceAll("-", "_"),
      scaleRange(current, reference.target, reference.range)
    );
  }
  const methodWords = sectionWords.method ?? 1500;
  const introductionWords = sectionWords.introduction ?? 520;
  const relatedWords = sectionWords["related-work"] ?? 450;
  const conclusionWords = sectionWords.conclusion ?? 200;
  addPair(
    "problem_definition",
    scaledPair(methodWords, 1500, 100, 140)
  );
  addPair("intro_p1", scaledPair(introductionWords, 520, 80, 120));
  addPair("intro_p2", scaledPair(introductionWords, 520, 80, 120));
  addPair("intro_p3", scaledPair(introductionWords, 520, 80, 120));
  addPair("intro_p4", scaledPair(introductionWords, 520, 40, 100));
  addPair("intro_p5", scaledPair(introductionWords, 520, 40, 70));
  addPair("intro_p6", scaledPair(introductionWords, 520, 30, 60));
  addPair(
    "related_subsection",
    scaledPair(relatedWords, 450, 140, 160)
  );
  addPair(
    "related_paragraph",
    scaledPair(relatedWords, 450, 65, 85)
  );
  addPair(
    "conclusion_p1",
    scaledPair(conclusionWords, 200, 100, 120)
  );
  addPair(
    "conclusion_p2",
    scaledPair(conclusionWords, 200, 80, 100)
  );
  const stepPolicy = PROMPT_STEP_POLICIES[templateId];
  if (stepPolicy) {
    const increasePercent = Math.round(
      (stepPolicy.temporaryMainTextCeilingMultiplier - 1) * 100
    );
    const temporaryCeiling = Math.round(
      context.targetWords * stepPolicy.temporaryMainTextCeilingMultiplier
    );
    const protectedLabels = context.sectionBudgets.filter(
      (section) => stepPolicy.protectedSectionIds.includes(section.id)
    ).map((section) => section.label);
    const protectedSections = context.language === "zh" ? protectedLabels.join("\u3001") : protectedLabels.join(" and ");
    const appendixTemplate = stepPolicy.appendixTriage[context.includeAppendix ? "enabled" : "disabled"][context.language];
    values.temporary_ceiling_percent = formatNumber(
      increasePercent,
      context.language
    );
    values.temporary_ceiling_words = formatNumber(
      temporaryCeiling,
      context.language
    );
    values.protected_sections = protectedSections;
    values.appendix_triage_rule = appendixTemplate.replaceAll(
      "{{protected_sections}}",
      protectedSections
    );
  }
  return values;
}
function interpolateConstraints(text, context, templateId) {
  const tokens = buildConstraintTokens(context, templateId);
  return text.replace(
    /\{\{([a-z0-9_]+)\}\}/g,
    (match, token) => tokens[token] ?? match
  );
}
function buildDetailedCore(constraints, context, templateId) {
  let core = constraints.core[context.language];
  for (const fragment of constraints.inlineStyleConstraints ?? []) {
    core = core.replaceAll(
      `{{${fragment.marker}}}`,
      fragment.branches[context.styleId][context.language]
    );
  }
  for (const fragment of constraints.inlineWordLimits ?? []) {
    const activeFragment = context.unlimitedCoreSections ? fragment.flexibleCore ?? fragment.standard : fragment.standard;
    const value = context.hasWordLimit ? interpolateConstraints(
      activeFragment[context.language],
      context,
      templateId
    ) : "";
    core = core.replaceAll(`{{${fragment.marker}}}`, value);
  }
  return core.replace(/\n{3,}/g, "\n\n").trim();
}
function buildPrompt(template, context) {
  if (template.contentKind === "framework-figure") {
    return buildFrameworkFigureReconstructionPrompt(
      context.language,
      context.frameworkFigure
    );
  }
  const language = context.language;
  const labels = LABELS[language];
  const common = COMMON_PROMPT_BLOCKS;
  const taskBlocks = template.tasks.flatMap((task) => [
    `### ${task.heading[language]}`,
    task.body[language],
    ""
  ]);
  const styleBranch = template.styleBranches?.[context.styleId]?.[language];
  const lengthBudget = template.profile === "manuscript" && template.showLengthBudget !== false ? buildLengthBudget(context) : "";
  const detailedConstraints = PROMPT_DETAILED_CONSTRAINTS[template.id];
  const detailedCore = detailedConstraints ? buildDetailedCore(detailedConstraints, context, template.id) : "";
  const activeWordLimitConstraints = context.unlimitedCoreSections ? detailedConstraints?.flexibleCoreWordLimit ?? detailedConstraints?.wordLimit : detailedConstraints?.wordLimit;
  const wordLimitConstraints = context.hasWordLimit && activeWordLimitConstraints ? interpolateConstraints(
    activeWordLimitConstraints[language],
    context,
    template.id
  ) : "";
  const wordLimitAfterBudget = detailedConstraints?.wordLimitPlacement === "after-budget";
  const deliveryBundle = buildDeliveryBundle(template, language);
  return [
    labels.role,
    template.role[language],
    "",
    labels.configuration,
    buildConfiguration(template, context),
    "",
    labels.inputs,
    template.inputs[language],
    "",
    labels.evidence,
    common.evidence[language],
    "",
    ...template.profile === "manuscript" ? [
      labels.manuscriptProtection,
      common.manuscriptProtection[language],
      ""
    ] : [],
    labels.pdfReview,
    common.pdfReview[language],
    "",
    ...template.profile === "manuscript" ? [
      labels.citationAndWeb,
      common.citationAndWeb[language],
      ""
    ] : [],
    labels.scope,
    template.scope[language],
    "",
    ...styleBranch ? [labels.styleBranch, styleBranch, ""] : [],
    ...lengthBudget ? [lengthBudget, ""] : [],
    ...wordLimitAfterBudget && wordLimitConstraints ? [wordLimitConstraints, ""] : [],
    labels.tasks,
    ...taskBlocks,
    ...detailedConstraints ? [
      labels.detailedConstraints,
      detailedCore,
      "",
      ...!wordLimitAfterBudget && wordLimitConstraints ? [wordLimitConstraints, ""] : []
    ] : [],
    template.profile === "targeting" ? labels.targetingDeliverables : labels.deliverables,
    template.deliverables[language],
    "",
    ...template.fileNames ? [
      labels.fileNames,
      template.fileNames[language],
      "",
      ...deliveryBundle ? [deliveryBundle, ""] : []
    ] : [],
    labels.finalChecks,
    template.finalChecks[language]
  ].join("\n");
}

// content/prompts/version.ts
var RECONSTRUCTION_WORKFLOW_VERSION = "2026.07.7";

// content/prompts/pluginExport.ts
function getReconstructionConfigurationModel() {
  return {
    schemaVersion: 1,
    defaultPaperStyle: PRODUCT_CONFIG.defaultPaperStyle,
    defaultPromptLanguage: PRODUCT_CONFIG.defaultPromptLanguage,
    wordCount: PRODUCT_CONFIG.wordCount,
    paperStyles: Object.fromEntries(
      Object.entries(PRODUCT_CONFIG.paperStyles).map(([id, style]) => [
        id,
        {
          id: style.id,
          label: style.label,
          shortLabel: style.shortLabel,
          description: style.description,
          plannerSummary: style.plannerSummary,
          defaultTargetWords: style.defaultTargetWords,
          defaultAppendix: style.defaultAppendix,
          sections: style.sections.map((section) => ({
            id: section.id,
            label: section.label,
            shortLabel: section.shortLabel,
            description: section.description,
            ratio: section.ratio
          }))
        }
      ])
    ),
    frameworkFigure: {
      default: RECONSTRUCTION_OVERVIEW_FIGURE_PREFERENCES,
      aspectRatios: FIGURE_ASPECT_RATIO_IDS.map((id) => ({
        id,
        label: FIGURE_ASPECT_RATIOS[id].label,
        ratio: FIGURE_ASPECT_RATIOS[id].ratio,
        description: FIGURE_ASPECT_RATIOS[id].shortDescription
      }))
    },
    chatExecution: {
      default: DEFAULT_CHAT_EXECUTION_PREFERENCES,
      reasoningPreferences: CHAT_REASONING_PREFERENCE_IDS.map(
        (id) => CHAT_REASONING_PREFERENCES[id]
      )
    }
  };
}
function allocateWords(target, sections) {
  const raw = sections.map((section) => target * section.ratio);
  const allocated = raw.map((value) => Math.floor(value));
  let remaining = target - allocated.reduce((sum, value) => sum + value, 0);
  const remainderOrder = raw.map((value, index) => ({ index, remainder: value - allocated[index] })).sort((a, b) => b.remainder - a.remainder);
  for (let cursor = 0; remaining > 0; cursor += 1) {
    allocated[remainderOrder[cursor % remainderOrder.length].index] += 1;
    remaining -= 1;
  }
  return Object.fromEntries(
    sections.map((section, index) => [section.id, allocated[index]])
  );
}
function normalizeInput(input = {}) {
  const language = input.language ?? PRODUCT_CONFIG.defaultPromptLanguage;
  if (language !== "zh" && language !== "en") {
    throw new Error(`Unsupported prompt language: ${String(language)}.`);
  }
  const styleId = input.styleId ?? PRODUCT_CONFIG.defaultPaperStyle;
  if (styleId !== "conference" && styleId !== "journal") {
    throw new Error(`Unsupported paper style: ${String(styleId)}.`);
  }
  const style = PRODUCT_CONFIG.paperStyles[styleId];
  const hasWordLimit = input.hasWordLimit ?? true;
  const unlimitedCoreSections = input.unlimitedCoreSections ?? false;
  if (input.targetWords !== void 0 && !Number.isFinite(input.targetWords)) {
    throw new Error("targetWords must be a finite number.");
  }
  const targetWords = Math.min(
    PRODUCT_CONFIG.wordCount.max,
    Math.max(
      PRODUCT_CONFIG.wordCount.min,
      Math.round(input.targetWords ?? style.defaultTargetWords)
    )
  );
  const allocated = allocateWords(targetWords, style.sections);
  const sectionBudgets = Object.fromEntries(
    style.sections.map((section) => {
      const supplied = input.sectionBudgets?.[section.id];
      if (supplied !== void 0 && !Number.isFinite(supplied)) {
        throw new Error(
          `Section budget "${section.id}" must be a finite number.`
        );
      }
      return [
        section.id,
        supplied === void 0 ? allocated[section.id] : Math.max(0, Math.round(supplied))
      ];
    })
  );
  if (hasWordLimit && !unlimitedCoreSections && input.sectionBudgets) {
    const sectionTotal = Object.values(sectionBudgets).reduce(
      (sum, value) => sum + value,
      0
    );
    if (sectionTotal !== targetWords) {
      throw new Error(
        `Section budgets total ${sectionTotal}, but targetWords is ${targetWords}.`
      );
    }
  }
  const frameworkFigure = {
    aspectRatioId: input.frameworkFigure?.aspectRatioId ?? RECONSTRUCTION_OVERVIEW_FIGURE_PREFERENCES.aspectRatioId,
    customAspectWidth: input.frameworkFigure?.customAspectWidth ?? RECONSTRUCTION_OVERVIEW_FIGURE_PREFERENCES.customAspectWidth,
    customAspectHeight: input.frameworkFigure?.customAspectHeight ?? RECONSTRUCTION_OVERVIEW_FIGURE_PREFERENCES.customAspectHeight
  };
  if (!(frameworkFigure.aspectRatioId in FIGURE_ASPECT_RATIOS)) {
    throw new Error(
      `Unsupported framework figure ratio: ${String(frameworkFigure.aspectRatioId)}.`
    );
  }
  if (!Number.isFinite(frameworkFigure.customAspectWidth) || frameworkFigure.customAspectWidth <= 0 || !Number.isFinite(frameworkFigure.customAspectHeight) || frameworkFigure.customAspectHeight <= 0) {
    throw new Error(
      "Framework figure custom ratio values must be positive finite numbers."
    );
  }
  const modelPolicy = input.chatExecution?.modelPolicy ?? DEFAULT_CHAT_EXECUTION_PREFERENCES.modelPolicy;
  if (modelPolicy !== CHAT_MODEL_POLICY) {
    throw new Error(
      `Unsupported ChatGPT model policy: ${String(modelPolicy)}.`
    );
  }
  const reasoningPreference = input.chatExecution?.reasoningPreference ?? DEFAULT_CHAT_EXECUTION_PREFERENCES.reasoningPreference;
  if (!CHAT_REASONING_PREFERENCE_IDS.includes(
    reasoningPreference
  )) {
    throw new Error(
      `Unsupported ChatGPT reasoning preference: ${String(reasoningPreference)}.`
    );
  }
  const fallbackPolicy = input.chatExecution?.fallbackPolicy ?? DEFAULT_CHAT_EXECUTION_PREFERENCES.fallbackPolicy;
  if (fallbackPolicy !== CHAT_FALLBACK_POLICY) {
    throw new Error(
      `Unsupported ChatGPT fallback policy: ${String(fallbackPolicy)}.`
    );
  }
  const chatExecution = {
    modelPolicy,
    reasoningPreference,
    fallbackPolicy
  };
  return {
    language,
    roundLanguages: Object.fromEntries(
      RECONSTRUCTION_PROMPTS.map((round) => {
        const roundLanguage = input.roundLanguages?.[round.id] ?? language;
        if (roundLanguage !== "zh" && roundLanguage !== "en") {
          throw new Error(
            `Unsupported prompt language for "${round.id}": ${String(roundLanguage)}.`
          );
        }
        return [round.id, roundLanguage];
      })
    ),
    styleId,
    style,
    hasWordLimit,
    unlimitedCoreSections,
    targetWords,
    sectionBudgets,
    includeAppendix: input.includeAppendix ?? style.defaultAppendix,
    frameworkFigure,
    chatExecution
  };
}
function buildReconstructionWorkflow(input = {}) {
  const normalized = normalizeInput(input);
  const {
    language,
    roundLanguages,
    styleId,
    style,
    hasWordLimit,
    unlimitedCoreSections,
    targetWords,
    sectionBudgets,
    includeAppendix,
    frameworkFigure,
    chatExecution
  } = normalized;
  const contextForLanguage = (promptLanguage) => ({
    language: promptLanguage,
    styleId,
    styleLabel: style.label[promptLanguage],
    styleDirective: style.promptDirective[promptLanguage],
    hasWordLimit,
    unlimitedCoreSections,
    targetWords,
    sectionBudgets: style.sections.map((section) => ({
      id: section.id,
      label: section.label[promptLanguage],
      words: sectionBudgets[section.id]
    })),
    includeAppendix,
    appendixLabel: promptLanguage === "zh" ? includeAppendix ? "\u5141\u8BB8\u9644\u5F55" : "\u4E0D\u4F7F\u7528\u9644\u5F55" : includeAppendix ? "Appendix allowed" : "No appendix",
    appendixDirective: includeAppendix ? style.appendixRule.enabled[promptLanguage] : style.appendixRule.disabled[promptLanguage],
    frameworkFigure
  });
  return {
    schemaVersion: 1,
    workflowVersion: RECONSTRUCTION_WORKFLOW_VERSION,
    workflow: "paper-reconstruction",
    config: {
      language,
      roundLanguages,
      styleId,
      hasWordLimit,
      unlimitedCoreSections,
      targetWords,
      sectionBudgets,
      includeAppendix,
      frameworkFigure,
      chatExecution
    },
    rounds: RECONSTRUCTION_PROMPTS.map((round) => {
      const roundLanguage = roundLanguages[round.id];
      return {
        id: round.id,
        number: round.number,
        language: roundLanguage,
        title: round.title[roundLanguage],
        purpose: round.purpose[roundLanguage],
        sourceFile: round.sourceFile,
        prompt: buildPrompt(round, contextForLanguage(roundLanguage))
      };
    })
  };
}
export {
  buildReconstructionWorkflow,
  getReconstructionConfigurationModel
};
