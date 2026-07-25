// content/prompts/wordCountPolicy.ts
var WORD_COUNT_POLICY = {
  unlimitedCoreSectionIds: ["method", "experiments-results"],
  visualWordEquivalent: 200
};

// app/config.ts
var PRODUCT_CONFIG = {
  productName: "\u7814\u672F\u53F0",
  productNameEn: "YanShu Workbench",
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
        zh: "\u5C42\u7EA7\u91C7\u7528 section \u2192 subsection \u2192 paragraph\uFF1BRelated Work \u6BCF\u5C0F\u8282\u5355\u6BB5\uFF0CMethod \u4E0D\u5355\u8BBE Overview\u3002",
        en: "Use section \u2192 subsection \u2192 paragraph; keep one paragraph per Related Work subsection and no standalone Method Overview."
      },
      emphasisNote: {
        zh: "\u4F18\u5148\u4FDD\u8BC1\u8D21\u732E\u8FA8\u8BC6\u5EA6\u3001\u57FA\u7EBF\u516C\u5E73\u6027\u3001\u6D88\u878D\u5B9E\u9A8C\u548C\u53EF\u590D\u73B0\u7EC6\u8282\u3002",
        en: "Prioritize contribution clarity, fair baselines, ablations, and reproducibility details."
      },
      plannerSummary: {
        zh: "section \u2192 subsection \u2192 paragraph\uFF1B\u5F15\u8A00 480 \u8BCD\uFF0C\u8BA8\u8BBA\u4E0E\u5C40\u9650\u5360 10%\uFF0C\u7ED3\u8BBA 200 \u8BCD\uFF0CMethod \u4E0D\u5355\u8BBE Overview\u3002",
        en: "section \u2192 subsection \u2192 paragraph; 480-word Introduction, 10% Discussion & Limitations, 200-word Conclusion, and no standalone Method Overview."
      },
      promptDirective: {
        zh: "\u91C7\u7528\u7D27\u51D1\u7684\u95EE\u9898\u2014\u65B9\u6CD5\u2014\u8BC1\u636E\u95ED\u73AF\u548C section \u2192 subsection \u2192 paragraph \u5C42\u7EA7\uFF1BRelated Work \u6BCF\u4E2A\u5C0F\u8282\u53EA\u5199\u4E00\u4E2A\u666E\u901A\u6BB5\u843D\uFF0CMethod \u4E0D\u5355\u8BBE Overview\uFF0C\u5E76\u4F18\u5148\u4FDD\u8BC1\u5FC5\u8981\u673A\u5236\u3001\u516C\u5E73\u6BD4\u8F83\u3001\u5173\u952E\u6D88\u878D\u548C\u53EF\u590D\u73B0\u4FE1\u606F\u3002",
        en: "Use a compact problem\u2013method\u2013evidence loop and section \u2192 subsection \u2192 paragraph hierarchy; write one ordinary paragraph per Related Work subsection, omit a standalone Method Overview, and prioritize necessary mechanisms, fair comparisons, decisive ablations, and reproducibility."
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
        zh: "\u5C42\u7EA7\u91C7\u7528 section \u2192 subsection \u2192 subsubsection \u2192 paragraph\uFF1BMethod \u5355\u8BBE\u4E0D\u8D85\u8FC7 80 \u8BCD\u7684\u53CC\u6BB5 Overview\u3002",
        en: "Use section \u2192 subsection \u2192 subsubsection \u2192 paragraph, with a standalone two-paragraph Method Overview capped at 80 words."
      },
      emphasisNote: {
        zh: "\u4F18\u5148\u4FDD\u8BC1\u7406\u8BBA\u4E0E\u7ECF\u9A8C\u8BBA\u8BC1\u7684\u5B8C\u6574\u6027\u3001\u65B9\u6CD5\u900F\u660E\u5EA6\u548C\u5BF9\u65E2\u6709\u7814\u7A76\u7684\u7D2F\u79EF\u8D21\u732E\u3002",
        en: "Prioritize complete theoretical and empirical argumentation, methodological transparency, and cumulative contribution."
      },
      plannerSummary: {
        zh: "section \u2192 subsection \u2192 subsubsection \u2192 paragraph\uFF1B\u4FDD\u7559\u53CC\u6BB5 Overview\uFF0C\u5E76\u6269\u5C55\u6587\u732E\u5B9A\u4F4D\u3001\u65B9\u6CD5\u7EC6\u8282\u4E0E\u8BA8\u8BBA\u3002",
        en: "section \u2192 subsection \u2192 subsubsection \u2192 paragraph; retain a two-paragraph Overview and deepen positioning, methods, and discussion."
      },
      promptDirective: {
        zh: "\u91C7\u7528 section \u2192 subsection \u2192 subsubsection \u2192 paragraph \u5C42\u7EA7\u548C\u66F4\u5B8C\u6574\u7684\u7D2F\u79EF\u8BBA\u8BC1\uFF1BMethod \u5355\u8BBE\u4E24\u4E2A\u666E\u901A\u6BB5\u843D\u4E14\u4E0D\u8D85\u8FC7 80 \u8BCD\u7684 Overview\uFF0C\u4E0D\u590D\u8FF0\u6846\u67B6\u56FE\uFF0C\u5E76\u6269\u5C55\u7814\u7A76\u5B9A\u4F4D\u3001\u65B9\u6CD5\u900F\u660E\u5EA6\u3001\u7A33\u5065\u6027\u4E0E\u72EC\u7ACB\u8BA8\u8BBA\u3002",
        en: "Use a section \u2192 subsection \u2192 subsubsection \u2192 paragraph hierarchy and a fuller cumulative argument; give Method a standalone two-paragraph Overview capped at 80 words without narrating the framework figure, and deepen positioning, transparency, robustness, and discussion."
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
    navHome: "\u9996\u9875",
    navDraft: "\u8BBA\u6587\u521D\u7A3F",
    navReconstruction: "\u8BBA\u6587\u91CD\u6784",
    navFigures: "\u79D1\u7814\u7ED8\u56FE",
    navSubmission: "\u6295\u7A3F\u7B56\u7565",
    navAbout: "\u5173\u4E8E\u7814\u672F\u53F0",
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
    targetWordsHint: "\u5F00\u542F\u540E\u663E\u793A 05\uFF1B\u9644\u5F55\u4E0D\u8BA1\u5165\u6B63\u6587\uFF0C\u6BCF\u5F20\u8868\u683C\u6216\u56FE\u7247\u6309 200 \u8BCD\u8BA1\u5165\u3002",
    wordLimitOn: "\u9650\u5236\u6B63\u6587\u5B57\u6570",
    wordLimitOff: "\u65E0\u7279\u6B8A\u89C4\u5B9A",
    noWordLimitHint: "\u5173\u95ED\u540E\u4E0D\u663E\u793A 05\uFF0C\u4E94\u6B65 Prompt \u4E5F\u4E0D\u5305\u542B\u6B63\u6587\u603B\u6570\u6216\u7AE0\u8282\u9884\u7B97\u3002",
    words: "\u8BCD",
    appendix: "\u9644\u5F55\u8BBE\u7F6E",
    appendixOn: "\u5141\u8BB8\u9644\u5F55",
    appendixOff: "\u4E0D\u542B\u9644\u5F55",
    frameworkFigure: "\u603B\u4F53\u6846\u67B6\u56FE",
    frameworkPlacement: "\u8BBA\u6587\u5360\u680F",
    frameworkRatio: "\u753B\u5E03\u6BD4\u4F8B",
    frameworkCustomWidth: "\u5BBD",
    frameworkCustomHeight: "\u9AD8",
    frameworkFixedRules: "\u5176\u4F59\u89C4\u5219\u56FA\u5B9A\uFF1A\u6781\u7B80\u8BBA\u6587\u7EBF\u7A3F\uFF1BTol \u9C9C\u660E\u8272\u7CFB\uFF0C\u7531 GPT \u6309\u8BED\u4E49\u9009\u62E9 2\u20134 \u4E2A\u5F3A\u8C03\u8272\uFF1BCalibri\uFF1B\u7EAF\u767D\u753B\u5E03\u4E0E\u7EAF\u767D\u6A21\u5757\u5361\u7247\uFF1B\u4E24\u7EA7\u5B57\u53F7\uFF1B\u65E0\u5927\u6807\u9898\uFF1B\u6DF1\u8272\u4E2D\u6027\u7EBF\u4E3A\u9ED8\u8BA4\uFF0C\u5FC5\u8981\u65F6\u6309\u8BED\u4E49\u7740\u8272\uFF1B\u8F7B\u63D2\u56FE\u4E0E\u56FE\u6807\u6309\u9700\u4F7F\u7528\u3002",
    exportAutomation: "\u5BFC\u51FA\u684C\u9762\u914D\u7F6E",
    exportedAutomation: "\u914D\u7F6E\u5DF2\u4E0B\u8F7D",
    exportAutomationHint: "\u4E0B\u8F7D\u5F53\u524D\u8BBA\u6587\u7C7B\u578B\u3001\u5B57\u6570\u3001\u7AE0\u8282\u3001\u9644\u5F55\u3001\u6846\u67B6\u56FE\u548C Prompt \u8BED\u8A00\u8BBE\u7F6E\uFF0C\u4F9B\u7814\u672F\u53F0\u63D2\u4EF6\u76F4\u63A5\u8BFB\u53D6\u3002",
    resetDefaults: "\u6062\u590D\u9ED8\u8BA4\u914D\u7F6E",
    resetHint: "\u91CD\u7F6E\u8BBA\u6587\u7C7B\u578B\u3001\u6B63\u6587\u5B57\u6570\u6A21\u5F0F\u3001\u9644\u5F55\u3001\u6846\u67B6\u56FE\u548C\u7AE0\u8282\u9884\u7B97\uFF1B\u4FDD\u7559\u5F53\u524D\u8BED\u8A00\u3002",
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
    workflowEyebrow: "RECONSTRUCTION WORKFLOW",
    workflowTitle: "\u4E94\u6B65\u91CD\u6784\u5DE5\u4F5C\u6D41",
    workflowBody: "\u4E94\u4EFD\u771F\u5B9E\u6A21\u677F\u5DF2\u6574\u7406\u4E3A\u53EF\u914D\u7F6E Prompt\uFF1B\u7B2C\u56DB\u6B65\u590D\u7528\u79D1\u7814\u7ED8\u56FE\u89C4\u5219\uFF0C\u53EA\u91CD\u6784\u65B9\u6CD5\u603B\u89C8\u6846\u67B6\u56FE\u3002",
    placeholder: "\u771F\u5B9E Prompt",
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
    navHome: "Home",
    navDraft: "Paper draft",
    navReconstruction: "Paper reconstruction",
    navFigures: "Research figures",
    navSubmission: "Submission strategy",
    navAbout: "About YanShu",
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
    targetWordsHint: "When enabled, section 05 appears. The appendix is excluded; each table or figure counts as 200 words.",
    wordLimitOn: "Apply a word limit",
    wordLimitOff: "No special limit",
    noWordLimitHint: "When disabled, section 05 is hidden and all five prompts omit the main-text total and section budgets.",
    words: "words",
    appendix: "Appendix",
    appendixOn: "Appendix allowed",
    appendixOff: "No appendix",
    frameworkFigure: "Overall framework figure",
    frameworkPlacement: "Paper placement",
    frameworkRatio: "Canvas ratio",
    frameworkCustomWidth: "Width",
    frameworkCustomHeight: "Height",
    frameworkFixedRules: "All other rules are fixed: minimal paper linework; Tol Vibrant palette with 2\u20134 accents selected by GPT by semantics; Calibri; pure-white canvas and module cards; two type-size levels; no large title; dark-neutral lines by default with semantic color only when needed; light illustrations and icons when useful.",
    exportAutomation: "Export desktop config",
    exportedAutomation: "Config downloaded",
    exportAutomationHint: "Download the current paper type, length, section, appendix, framework-figure, and prompt-language settings for the YanShu plugin.",
    resetDefaults: "Restore defaults",
    resetHint: "Resets paper type, length mode, appendix, framework figure, and section budgets while keeping the current language.",
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
    workflowEyebrow: "RECONSTRUCTION WORKFLOW",
    workflowTitle: "Five-step reconstruction workflow",
    workflowBody: "Five source templates are production prompts. Step 4 reuses the research-figure rules and reconstructs only the Method Overview figure.",
    placeholder: "Live prompt",
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

// app/figures/config.ts
var RECONSTRUCTION_OVERVIEW_FIGURE_PREFERENCES = {
  promptId: "method-overview",
  placementId: "double-column",
  aspectRatioId: "landscape-16-9",
  customAspectWidth: 16,
  customAspectHeight: 9,
  styleId: "conference-minimal",
  paletteId: "tol-vibrant",
  fontFamilyId: "calibri",
  lineColorMode: "semantic",
  accentColorRangeId: "2-4",
  allowLightIllustrations: true,
  useCardFills: false,
  fontSizeLevels: 2,
  includeLargeTitle: false
};
var FIGURE_PLACEMENTS = {
  "single-column": {
    label: {
      zh: "\u5355\u680F",
      en: "Single column"
    },
    shortDescription: {
      zh: "\u53CC\u680F\u8BBA\u6587\u4E2D\u7684\u4E00\u680F",
      en: "One column in a two-column paper"
    },
    directive: {
      zh: "\u6309\u53CC\u680F\u8BBA\u6587\u4E2D\u7684\u5355\u680F\u5BBD\u5EA6\u8BBE\u8BA1\u3002\u6784\u56FE\u5FC5\u987B\u7D27\u51D1\uFF0C\u7F29\u653E\u5230\u6700\u7EC8\u5355\u680F\u5BBD\u5EA6\u540E\uFF0C\u6700\u5C0F\u6587\u5B57\u3001\u7EC6\u7EBF\u548C\u7BAD\u5934\u4ECD\u987B\u6E05\u695A\u53EF\u8FA8\u3002",
      en: "Design for the width of one column in a two-column paper. Keep the composition compact, and ensure the smallest text, thin lines, and arrows remain clear at final single-column size."
    }
  },
  "double-column": {
    label: {
      zh: "\u8DE8\u53CC\u680F",
      en: "Span both columns"
    },
    shortDescription: {
      zh: "\u6A2A\u8DE8\u53CC\u680F\u7684\u901A\u680F\u56FE",
      en: "Full-width figure across both columns"
    },
    directive: {
      zh: "\u6309\u53CC\u680F\u8BBA\u6587\u4E2D\u6A2A\u8DE8\u4E24\u680F\u7684\u901A\u680F\u5BBD\u5EA6\u8BBE\u8BA1\u3002\u4F18\u5148\u5229\u7528\u6A2A\u5411\u7A7A\u95F4\u7EC4\u7EC7\u4E3B\u8DEF\u5F84\uFF0C\u7F29\u653E\u5230\u6700\u7EC8\u901A\u680F\u5BBD\u5EA6\u540E\uFF0C\u6240\u6709\u6587\u5B57\u3001\u7EC6\u7EBF\u548C\u7BAD\u5934\u4ECD\u987B\u6E05\u695A\u53EF\u8FA8\u3002",
      en: "Design for a full-width figure spanning both columns of a two-column paper. Use the horizontal space for the main reading path, and ensure all text, thin lines, and arrows remain clear at final double-column size."
    }
  }
};
var FIGURE_PLACEMENT_IDS = Object.keys(
  FIGURE_PLACEMENTS
);
var FIGURE_ASPECT_RATIOS = {
  "landscape-4-3": {
    label: {
      zh: "\u6A2A\u7248 4:3",
      en: "Landscape 4:3"
    },
    ratio: "4:3",
    shortDescription: {
      zh: "\u7D27\u51D1\u3001\u5747\u8861\uFF0C\u9002\u5408\u5F15\u8A00\u56FE",
      en: "Compact and balanced; suited to introductions"
    },
    directive: {
      zh: "\u753B\u5E03\u56FA\u5B9A\u4E3A\u6A2A\u7248 4:3\uFF0C\u6309\u8FD9\u4E00\u6BD4\u4F8B\u4ECE\u4E00\u5F00\u59CB\u7EC4\u7EC7\u5185\u5BB9\uFF0C\u4E0D\u5F97\u5148\u751F\u6210\u5176\u4ED6\u6BD4\u4F8B\u518D\u88C1\u5207\u3002",
      en: "Use a fixed landscape 4:3 canvas and compose for that ratio from the start; do not generate another ratio and crop afterward."
    }
  },
  "portrait-3-4": {
    label: {
      zh: "\u7AD6\u7248 3:4",
      en: "Portrait 3:4"
    },
    ratio: "3:4",
    shortDescription: {
      zh: "\u9002\u5408\u7EB5\u5411\u5C42\u7EA7\u4E0E\u4E0A\u4E0B\u5173\u7CFB",
      en: "Suited to vertical hierarchy and top-down relations"
    },
    directive: {
      zh: "\u753B\u5E03\u56FA\u5B9A\u4E3A\u7AD6\u7248 3:4\uFF0C\u53EA\u5728\u5185\u5BB9\u672C\u8EAB\u9002\u5408\u7EB5\u5411\u5C42\u7EA7\u6216\u4E0A\u4E0B\u9605\u8BFB\u65F6\u91C7\u7528\uFF1B\u4E0D\u5F97\u65CB\u8F6C\u6587\u5B57\uFF0C\u4E5F\u4E0D\u5F97\u5148\u751F\u6210\u5176\u4ED6\u6BD4\u4F8B\u518D\u88C1\u5207\u3002",
      en: "Use a fixed portrait 3:4 canvas only when the content naturally supports a vertical hierarchy or top-down reading path. Do not rotate text or generate another ratio and crop afterward."
    }
  },
  "landscape-16-9": {
    label: {
      zh: "\u6A2A\u7248 16:9",
      en: "Landscape 16:9"
    },
    ratio: "16:9",
    shortDescription: {
      zh: "\u9002\u5408\u65B9\u6CD5\u603B\u89C8\u4E0E\u5B8C\u6574\u6A2A\u5411\u6D41\u7A0B",
      en: "Suited to method overviews and complete horizontal flows"
    },
    directive: {
      zh: "\u753B\u5E03\u56FA\u5B9A\u4E3A\u6A2A\u7248 16:9\uFF0C\u5229\u7528\u6A2A\u5411\u7A7A\u95F4\u5EFA\u7ACB\u4E00\u6761\u6E05\u695A\u4E3B\u8DEF\u5F84\uFF0C\u51CF\u5C11\u7EB5\u5411\u5806\u53E0\uFF1B\u4E0D\u5F97\u5148\u751F\u6210\u5176\u4ED6\u6BD4\u4F8B\u518D\u88C1\u5207\u3002",
      en: "Use a fixed landscape 16:9 canvas, using the horizontal space for one clear main path while minimizing vertical stacking. Do not generate another ratio and crop afterward."
    }
  },
  "portrait-9-16": {
    label: {
      zh: "\u7AD6\u7248 9:16",
      en: "Portrait 9:16"
    },
    ratio: "9:16",
    shortDescription: {
      zh: "\u9002\u5408\u8F83\u6DF1\u7684\u7EB5\u5411\u6D41\u7A0B\uFF0C\u6CE8\u610F\u7248\u9762\u9AD8\u5EA6",
      en: "Suited to deep vertical flows; watch page height"
    },
    directive: {
      zh: "\u753B\u5E03\u56FA\u5B9A\u4E3A\u7AD6\u7248 9:16\uFF0C\u53EA\u5728\u8F83\u6DF1\u7684\u7EB5\u5411\u6D41\u7A0B\u786E\u6709\u5FC5\u8981\u65F6\u91C7\u7528\uFF0C\u5E76\u4E25\u683C\u63A7\u5236\u603B\u9AD8\u5EA6\u548C\u6807\u7B7E\u6570\u91CF\uFF1B\u4E0D\u5F97\u65CB\u8F6C\u6587\u5B57\uFF0C\u4E5F\u4E0D\u5F97\u5148\u751F\u6210\u5176\u4ED6\u6BD4\u4F8B\u518D\u88C1\u5207\u3002",
      en: "Use a fixed portrait 9:16 canvas only when a deep vertical flow genuinely requires it, and tightly control overall height and label count. Do not rotate text or generate another ratio and crop afterward."
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
    },
    directive: {
      zh: "\u753B\u5E03\u56FA\u5B9A\u4E3A\u5F53\u524D\u8BBE\u7F6E\u7684\u81EA\u5B9A\u4E49\u5BBD\u9AD8\u6BD4\uFF0C\u4ECE\u4E00\u5F00\u59CB\u6309\u8BE5\u6BD4\u4F8B\u7EC4\u7EC7\u5185\u5BB9\uFF0C\u4E0D\u5F97\u5148\u751F\u6210\u5176\u4ED6\u6BD4\u4F8B\u518D\u88C1\u5207\u3002",
      en: "Use the current custom width-to-height ratio as the fixed canvas. Compose for it from the start; do not generate another ratio and crop afterward."
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
var FIGURE_STYLES = {
  "conference-minimal": {
    label: {
      zh: "\u6781\u7B80\u8BBA\u6587\u7EBF\u7A3F",
      en: "Minimal paper linework"
    },
    shortDescription: {
      zh: "\u7EAF\u767D\u5E95 \xB7 \u7EC6\u7EBF \xB7 \u65E0\u88C5\u9970",
      en: "Pure white \xB7 thin lines \xB7 no decoration"
    },
    directive: {
      zh: "\u4F7F\u7528\u7EAF\u767D\u753B\u5E03\u3001\u7EC6\u800C\u53EF\u5370\u5237\u7684\u7ED3\u6784\u7EBF\u3001\u77E9\u5F62\u6216\u8F7B\u5706\u89D2\u6A21\u5757\uFF0C\u4EE5\u5BF9\u9F50\u3001\u7559\u767D\u548C\u6E05\u695A\u7684\u4FE1\u606F\u6D41\u5EFA\u7ACB\u5C42\u7EA7\uFF1B\u4E0D\u4F7F\u7528\u6E10\u53D8\u3001\u9634\u5F71\u30013D\u3001\u7EB9\u7406\u6216\u88C5\u9970\u6027 AI \u89C6\u89C9\u3002",
      en: "Use a pure-white canvas, thin but print-safe structural lines, and rectangular or subtly rounded modules. Build hierarchy through alignment, whitespace, and clear information flow; do not use gradients, shadows, 3D, textures, or decorative AI aesthetics."
    }
  },
  "illustrated-technical": {
    label: {
      zh: "\u8F7B\u63D2\u56FE\u6280\u672F\u56FE",
      en: "Light illustrated technical"
    },
    shortDescription: {
      zh: "\u6280\u672F\u56FE\u9AA8\u67B6 \xB7 \u53EF\u7528\u8F7B\u5361\u901A\u63D2\u56FE",
      en: "Technical structure \xB7 light illustrative elements"
    },
    directive: {
      zh: "\u4FDD\u6301\u7EAF\u767D\u753B\u5E03\u3001\u7EC6\u7ED3\u6784\u7EBF\u3001\u660E\u786E\u7684\u6A21\u5757\u5206\u7EC4\u548C\u4E00\u81F4\u7684\u7BAD\u5934\u8BED\u4E49\uFF1B\u4EE5\u7ED3\u6784\u5316\u6280\u672F\u56FE\u4E3A\u9AA8\u67B6\uFF0C\u5728\u5F53\u524D\u89C6\u89C9\u7EA6\u675F\u5141\u8BB8\u65F6\u52A0\u5165\u514B\u5236\u7684\u8F7B\u5361\u901A\u6280\u672F\u63D2\u56FE\u3001\u56FE\u6807\u4E0E\u7565\u5706\u6DA6\u5B57\u4F53\uFF0C\u4E0D\u5F97\u505A\u6210\u6F2B\u753B\u3001\u5409\u7965\u7269\u6216\u8425\u9500\u63D2\u753B\u3002",
      en: "Keep a pure-white canvas, thin structural lines, clear module grouping, and consistent arrow semantics. Use a structured technical diagram as the foundation; when allowed by the active visual controls, add restrained light-cartoon technical illustrations, icons, and subtly rounded type without becoming comic-like, mascot-driven, or promotional."
    }
  }
};
var FIGURE_STYLE_IDS = Object.keys(
  FIGURE_STYLES
);
var FIGURE_ACCENT_COLOR_RANGES = {
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
    label: { zh: "Tol \u660E\u4EAE \xB7 \u84DD\u7EA2\u7EFF\u9EC4", en: "Tol Bright \xB7 blue\u2013red\u2013green\u2013yellow" },
    colors: ["#4477AA", "#EE6677", "#228833", "#CCBB44"]
  },
  "tol-muted": {
    label: { zh: "Tol \u67D4\u548C \xB7 \u975B\u73AB\u7470\u9752\u6C99", en: "Tol Muted \xB7 indigo\u2013rose\u2013teal\u2013sand" },
    colors: ["#332288", "#CC6677", "#44AA99", "#DDCC77"]
  }
};
var FIGURE_COLOR_PALETTE_IDS = Object.keys(
  FIGURE_COLOR_PALETTES
);
var FIGURE_FONT_FAMILIES = {
  "times-new-roman": {
    label: "Times New Roman",
    directive: {
      zh: "\u5168\u56FE\u7EDF\u4E00\u4F7F\u7528 Times New Roman\uFF0C\u4E0D\u6DF7\u7528\u5176\u4ED6\u5B57\u4F53\u3002",
      en: "Use Times New Roman throughout the figure and do not mix typefaces."
    }
  },
  arial: {
    label: "Arial",
    directive: {
      zh: "\u5168\u56FE\u7EDF\u4E00\u4F7F\u7528 Arial\uFF0C\u4E0D\u6DF7\u7528\u5176\u4ED6\u5B57\u4F53\u3002",
      en: "Use Arial throughout the figure and do not mix typefaces."
    }
  },
  calibri: {
    label: "Calibri",
    directive: {
      zh: "\u5168\u56FE\u7EDF\u4E00\u4F7F\u7528 Calibri\uFF0C\u4E0D\u6DF7\u7528\u5176\u4ED6\u5B57\u4F53\u3002",
      en: "Use Calibri throughout the figure and do not mix typefaces."
    }
  },
  helvetica: {
    label: "Helvetica",
    directive: {
      zh: "\u5168\u56FE\u7EDF\u4E00\u4F7F\u7528 Helvetica\uFF0C\u4E0D\u6DF7\u7528\u5176\u4ED6\u5B57\u4F53\u3002",
      en: "Use Helvetica throughout the figure and do not mix typefaces."
    }
  },
  "comic-sans": {
    label: "Comic Sans MS",
    directive: {
      zh: "\u5168\u56FE\u7EDF\u4E00\u4F7F\u7528 Comic Sans MS\uFF08\u4E0D\u53EF\u7528\u65F6\u4F7F\u7528 Comic Neue\uFF09\uFF0C\u53EA\u7528\u4E8E\u8F7B\u91CF\u79D1\u7814\u6F2B\u753B\u6216\u793A\u610F\u56FE\u6C14\u8D28\uFF0C\u4ECD\u987B\u514B\u5236\u3001\u6E05\u6670\u4E14\u6613\u5370\u5237\uFF0C\u4E0D\u6DF7\u7528\u5176\u4ED6\u5B57\u4F53\u3002",
      en: "Use Comic Sans MS throughout the figure (Comic Neue only as a fallback) for a restrained scientific-cartoon or schematic character. Keep it clear and print-safe, and do not mix typefaces."
    }
  }
};
var FIGURE_FONT_FAMILY_IDS = Object.keys(
  FIGURE_FONT_FAMILIES
);
var FIGURE_PROMPTS = {
  introduction: {
    number: "01",
    label: {
      zh: "\u5F15\u8A00\u56FE",
      en: "Introduction figure"
    },
    tag: {
      zh: "\u95EE\u9898\u4E0E\u610F\u4E49",
      en: "Problem & significance"
    },
    purpose: {
      zh: "\u8BA9\u8BFB\u8005\u8FC5\u901F\u7406\u89E3\u95EE\u9898\u4E3A\u4F55\u91CD\u8981\u3001\u4ECA\u5929\u4ECD\u5361\u5728\u54EA\u91CC\uFF0C\u4EE5\u53CA\u672C\u6587\u5E26\u6765\u4EC0\u4E48\u6838\u5FC3\u6D1E\u5BDF\u3002",
      en: "Show why the problem matters, what still blocks progress today, and the paper\u2019s core insight."
    },
    heading: {
      zh: "\u4E3A CS \u8BBA\u6587\u751F\u6210\u4E00\u5F20\u5F15\u8A00\u56FE",
      en: "Generate One Introduction Figure for a CS Paper"
    },
    objective: {
      zh: "\u8FD9\u5F20\u56FE\u4F4D\u4E8E Introduction\uFF0C\u7528\u89C6\u89C9\u8BBA\u8BC1\u5F15\u51FA\u7814\u7A76\u95EE\u9898\u4E0E\u5FC5\u8981\u6027\u3002\u5B83\u4E0D\u662F\u65B9\u6CD5\u6D41\u7A0B\u56FE\uFF0C\u4E5F\u4E0D\u662F\u628A\u5168\u6587\u538B\u7F29\u6210\u4E00\u5F20 graphical abstract\u3002",
      en: "This figure belongs in the Introduction and visually establishes the research problem and its significance. It is neither a method pipeline nor a graphical abstract that compresses the whole paper."
    },
    successCriterion: {
      zh: "\u7B2C\u4E00\u6B21\u63A5\u89E6\u8BE5\u4E3B\u9898\u7684 CS \u8BFB\u8005\u5E94\u80FD\u5728 10\u201315 \u79D2\u5185\u8BF4\u6E05\uFF1A\u7814\u7A76\u573A\u666F\u662F\u4EC0\u4E48\u3001\u4ECA\u5929\u4ECD\u5B58\u5728\u4EC0\u4E48\u5173\u952E\u969C\u788D\u3001\u4E3A\u4EC0\u4E48\u503C\u5F97\u89E3\u51B3\uFF0C\u4EE5\u53CA\u672C\u6587\u6838\u5FC3\u6D1E\u5BDF\u53EF\u80FD\u6539\u53D8\u4EC0\u4E48\u3002",
      en: "Within 10\u201315 seconds, a CS reader new to the topic should be able to state the setting, the key obstacle that still exists today, why it matters, and what the paper\u2019s core insight is intended to change."
    },
    designRules: {
      zh: [
        "\u4ECE\u8BBA\u6587\u4E2D\u63D0\u53D6\u4E00\u4E2A\u552F\u4E00\u7684\u89C6\u89C9\u4E3B\u65E8\uFF1B\u4F18\u5148\u5448\u73B0\u4EFB\u52A1\u6216\u5E94\u7528\u573A\u666F\u3001\u4ECA\u5929\u4ECD\u5B58\u5728\u7684\u5173\u952E\u969C\u788D\u3001\u969C\u788D\u9020\u6210\u7684\u76F4\u63A5\u540E\u679C\u3001\u672C\u6587\u6838\u5FC3\u6D1E\u5BDF\u53CA\u5176\u9884\u671F\u4F5C\u7528\u3002",
        "\u9009\u62E9\u6700\u9002\u5408\u8BBA\u6587\u8BC1\u636E\u7684\u5355\u4E00\u9605\u8BFB\u8DEF\u5F84\u3002\u53EA\u6709\u5728\u5185\u5BB9\u786E\u5B9E\u9002\u5408\u65F6\u624D\u91C7\u7528\u201C\u573A\u666F \u2192 \u969C\u788D \u2192 \u540E\u679C \u2192 \u6838\u5FC3\u6D1E\u5BDF\u201D\u7684\u7ED3\u6784\uFF0C\u4E0D\u8981\u673A\u68B0\u5957\u6A21\u677F\u3002",
        "\u628A\u73B0\u6709\u65B9\u6CD5\u7684\u4E0D\u8DB3\u8868\u8FBE\u4E3A\u5F53\u524D\u4ECD\u672A\u89E3\u51B3\u7684\u5177\u4F53\u77DB\u76FE\uFF0C\u4E0D\u4F7F\u7528\u7A7A\u6CDB\u7684\u201C\u6027\u80FD\u6709\u9650\u201D\u201C\u4ECD\u5177\u6311\u6218\u201D\u7B49\u5360\u4F4D\u8868\u8FF0\u3002",
        "\u672C\u6587\u65B9\u6CD5\u53EA\u51FA\u73B0\u5230\u6838\u5FC3\u6D1E\u5BDF\u6216\u6982\u5FF5\u6027\u6539\u53D8\u8FD9\u4E00\u5C42\uFF0C\u4E0D\u5C55\u5F00\u6A21\u5757\u3001\u8BAD\u7EC3\u6B65\u9AA4\u6216\u5B9E\u73B0\u6D41\u6C34\u7EBF\u3002",
        "\u56FE\u4E2D\u6587\u5B57\u53EA\u4FDD\u7559\u8BFB\u8005\u7406\u89E3\u95EE\u9898\u4E0E\u610F\u4E49\u6240\u5FC5\u9700\u7684\u77ED\u6807\u7B7E\uFF1B\u9ED8\u8BA4\u4E0D\u653E\u5B9E\u9A8C\u6570\u5B57\uFF0C\u786E\u6709\u5FC5\u8981\u65F6\u4E5F\u53EA\u80FD\u4F7F\u7528\u8BBA\u6587\u660E\u786E\u652F\u6301\u7684\u6781\u5C11\u91CF\u5173\u952E\u6570\u5B57\u3002"
      ],
      en: [
        "Extract one visual take-home message from the paper. Prioritize the task or application setting, the key obstacle that still exists today, its immediate consequence, the paper\u2019s core insight, and the change that insight is intended to enable.",
        "Choose one reading path that fits the paper\u2019s evidence. Use a setting \u2192 obstacle \u2192 consequence \u2192 core insight structure only when it is genuinely suitable; do not force a template.",
        "State the limitation of current approaches as a concrete present-day tension, not a placeholder such as \u201Climited performance\u201D or \u201Cstill challenging.\u201D",
        "Show the proposed work only at the level of its core insight or conceptual change; do not unfold modules, training steps, or an implementation pipeline.",
        "Keep only the short labels needed to understand the problem and its significance. Omit experimental numbers by default; if one is indispensable, use only a very small number explicitly supported by the paper."
      ]
    },
    exclusions: {
      zh: [
        "\u4E0D\u5F97\u52A0\u5165\u5B8C\u6574\u65B9\u6CD5\u67B6\u6784\u3001\u6A21\u5757\u6E05\u5355\u3001\u8BAD\u7EC3/\u63A8\u7406\u6D41\u7A0B\u3001\u516C\u5F0F\u3001\u8D85\u53C2\u6570\u3001\u6D88\u878D\u5B9E\u9A8C\u6216\u8868\u683C\u4E0E\u56FE\u7247\u7F16\u53F7\u3002",
        "\u4E0D\u5F97\u7528\u7ED3\u679C\u699C\u5355\u6216\u5BC6\u96C6\u6570\u5B57\u66FF\u4EE3\u7814\u7A76\u52A8\u673A\uFF0C\u4E5F\u4E0D\u5F97\u628A\u8BBA\u6587\u7684\u6240\u6709\u8D21\u732E\u540C\u65F6\u585E\u8FDB\u4E00\u5F20\u56FE\u3002",
        "\u4E0D\u5F97\u5938\u5927\u5F71\u54CD\u3001\u8865\u9020\u56E0\u679C\u5173\u7CFB\uFF0C\u6216\u627F\u8BFA\u8BBA\u6587\u8BC1\u636E\u6CA1\u6709\u652F\u6301\u7684\u6539\u8FDB\u3002"
      ],
      en: [
        "Do not include the full architecture, a module inventory, training or inference flow, equations, hyperparameters, ablations, or table and figure references.",
        "Do not replace research motivation with a leaderboard or dense numbers, and do not squeeze every contribution into the figure.",
        "Do not exaggerate impact, invent causal relationships, or promise improvements unsupported by the paper."
      ]
    }
  },
  "method-overview": {
    number: "02",
    label: {
      zh: "\u65B9\u6CD5\u603B\u89C8\u56FE",
      en: "Method overview"
    },
    tag: {
      zh: "\u6574\u4F53\u5FC3\u667A\u5730\u56FE",
      en: "System mental model"
    },
    purpose: {
      zh: "\u5728\u8BFB\u8005\u8FDB\u5165\u65B9\u6CD5\u7EC6\u8282\u524D\uFF0C\u5EFA\u7ACB\u8F93\u5165\u3001\u6838\u5FC3\u9636\u6BB5\u3001\u4FE1\u606F\u6D41\u4E0E\u8F93\u51FA\u7684\u6574\u4F53\u5FC3\u667A\u5730\u56FE\u3002",
      en: "Give readers a stable mental model of inputs, major stages, information flow, and outputs before method details."
    },
    heading: {
      zh: "\u4E3A CS \u8BBA\u6587\u751F\u6210\u4E00\u5F20\u65B9\u6CD5\u603B\u89C8\u56FE",
      en: "Generate One Method Overview Figure for a CS Paper"
    },
    objective: {
      zh: "\u8FD9\u5F20\u56FE\u662F\u8BBA\u6587\u65B9\u6CD5\u7684\u603B\u4F53\u6846\u67B6\u56FE\u3002\u5B83\u56DE\u7B54\u201C\u6574\u4E2A\u65B9\u6CD5\u5982\u4F55\u7EC4\u7EC7\u5E76\u8FD0\u8F6C\u201D\uFF0C\u4E0D\u8D1F\u8D23\u91CD\u65B0\u8BBA\u8BC1\u7814\u7A76\u610F\u4E49\uFF0C\u4E5F\u4E0D\u5C55\u5F00\u67D0\u4E2A\u5C40\u90E8\u673A\u5236\u3002",
      en: "This is the paper\u2019s overall framework figure. It answers how the method is organized and operates as a whole; it does not re-argue the motivation or unpack a local mechanism."
    },
    successCriterion: {
      zh: "\u8BFB\u8005\u770B\u56FE\u540E\u5E94\u80FD\u6CBF\u4E00\u6761\u660E\u786E\u8DEF\u5F84\u8BF4\u6E05\uFF1A\u8F93\u5165\u662F\u4EC0\u4E48\u3001\u4E3B\u8981\u9636\u6BB5\u6216\u7EC4\u4EF6\u5982\u4F55\u8FDE\u63A5\u3001\u5173\u952E\u4FE1\u606F\u5982\u4F55\u6D41\u52A8\u3001\u6700\u7EC8\u8F93\u51FA\u662F\u4EC0\u4E48\uFF0C\u5E76\u80FD\u5E26\u7740\u8FD9\u4E2A\u5FC3\u667A\u5730\u56FE\u9605\u8BFB Method\u3002",
      en: "After viewing the figure, a reader should be able to follow one clear path through the inputs, major stages or components, essential information flow, and outputs, then use that mental model while reading the Method section."
    },
    designRules: {
      zh: [
        "\u4ECE .tex \u4E2D\u786E\u8BA4\u6B63\u5F0F\u5B9A\u4E49\u7684\u8F93\u5165\u3001\u8F93\u51FA\u3001\u4E3B\u8981\u7EC4\u4EF6\u4E0E\u63A5\u53E3\uFF1B\u6BCF\u4E2A\u4E3B\u8981\u7EC4\u4EF6\u53EA\u51FA\u73B0\u4E00\u6B21\uFF0C\u5E76\u7528\u5C42\u7EA7\u3001\u5206\u7EC4\u548C\u7BAD\u5934\u8868\u8FBE\u5173\u7CFB\u3002",
        "\u4F18\u5148\u5448\u73B0\u51B3\u5B9A\u6574\u4F53\u7406\u89E3\u7684\u4E3B\u8DEF\u5F84\u3002\u4EC5\u5F53\u8BBA\u6587\u786E\u5B9E\u4F9D\u8D56\u5206\u652F\u3001\u5171\u4EAB\u53C2\u6570\u3001\u5FAA\u73AF\u3001\u8DE8\u9636\u6BB5\u53CD\u9988\u6216\u591A\u6A21\u6001\u4EA4\u4E92\u65F6\uFF0C\u624D\u663E\u793A\u8FD9\u4E9B\u7ED3\u6784\u3002",
        "\u53EA\u6709\u5728\u8BAD\u7EC3\u4E0E\u63A8\u7406\u7684\u5DEE\u5F02\u5F71\u54CD\u65B9\u6CD5\u7406\u89E3\u65F6\u624D\u660E\u786E\u533A\u5206\u4E24\u8005\uFF1B\u4E0D\u5F97\u4E3A\u4E86\u753B\u9762\u590D\u6742\u800C\u589E\u52A0\u5E76\u884C\u6D41\u7A0B\u3002",
        "\u8BA9\u56FE\u7684\u9605\u8BFB\u987A\u5E8F\u3001\u7BAD\u5934\u65B9\u5411\u548C\u989C\u8272\u8BED\u4E49\u5168\u5C40\u4E00\u81F4\uFF1B\u8F93\u5165\u4E0E\u8F93\u51FA\u5FC5\u987B\u6709\u6E05\u695A\u8FB9\u754C\u3002"
      ],
      en: [
        "Use the .tex to verify formally defined inputs, outputs, major components, and interfaces. Show each major component once and express relationships through hierarchy, grouping, and arrows.",
        "Prioritize the main path needed for system-level understanding. Show branches, shared parameters, loops, cross-stage feedback, or multimodal interaction only when the paper actually depends on them.",
        "Separate training from inference only when that distinction is material to understanding the method; do not add parallel flows merely to make the figure look complex.",
        "Use a consistent reading order, arrow direction, and color semantics throughout. Inputs and outputs must have clear boundaries."
      ]
    },
    exclusions: {
      zh: [
        "\u4E0D\u5F97\u91CD\u590D\u5F15\u8A00\u56FE\u4E2D\u7684\u573A\u666F\u2014\u95EE\u9898\u53D9\u4E8B\uFF0C\u4E5F\u4E0D\u5F97\u52A0\u5165\u5B9E\u9A8C\u7ED3\u679C\u3001\u6027\u80FD\u6570\u5B57\u3001\u6D88\u878D\u7ED3\u8BBA\u6216\u7814\u7A76\u5F71\u54CD\u3002",
        "\u4E0D\u5F97\u585E\u5165\u6BCF\u4E2A\u5B50\u64CD\u4F5C\u3001\u5B8C\u6574\u516C\u5F0F\u3001\u635F\u5931\u9879\u63A8\u5BFC\u3001\u8D85\u53C2\u6570\u3001\u4EE3\u7801\u7EA7\u5B9E\u73B0\u6216\u957F\u6BB5\u8BF4\u660E\u6587\u5B57\u3002",
        "\u4E0D\u5F97\u4E3A\u4E86\u89C6\u89C9\u5BF9\u79F0\u865A\u6784\u6A21\u5757\u3001\u590D\u5236\u540C\u4E00\u7EC4\u4EF6\uFF0C\u6216\u9690\u85CF\u8BBA\u6587\u771F\u5B9E\u5B58\u5728\u7684\u5173\u952E\u4F9D\u8D56\u3002"
      ],
      en: [
        "Do not repeat the setting\u2013problem narrative of the Introduction figure or add results, performance numbers, ablation conclusions, or research impact.",
        "Do not include every sub-operation, full equations, loss derivations, hyperparameters, code-level implementation, or paragraph-like explanations.",
        "Do not invent modules for visual symmetry, duplicate the same component, or hide a real dependency in the paper."
      ]
    }
  },
  "technical-detail": {
    number: "03",
    label: {
      zh: "\u5173\u952E\u6280\u672F\u7EC6\u8282\u56FE",
      en: "Key technical-detail figure"
    },
    tag: {
      zh: "\u552F\u4E00\u5173\u952E\u673A\u5236",
      en: "One key mechanism"
    },
    purpose: {
      zh: "\u81EA\u52A8\u9009\u62E9\u533A\u522B\u4E8E\u603B\u89C8\u3001\u6700\u9700\u8981\u89C6\u89C9\u89E3\u91CA\u7684\u4E00\u9879\u6838\u5FC3\u673A\u5236\uFF0C\u5E76\u53EA\u751F\u6210\u8FD9\u4E00\u5F20\u56FE\u3002",
      en: "Select the single mechanism most in need of visual explanation, distinct from the overview, and generate only that figure."
    },
    heading: {
      zh: "\u4E3A CS \u8BBA\u6587\u751F\u6210\u4E00\u5F20\u5173\u952E\u6280\u672F\u7EC6\u8282\u56FE",
      en: "Generate One Key Technical-Detail Figure for a CS Paper"
    },
    objective: {
      zh: "\u8FD9\u5F20\u56FE\u53EA\u89E3\u91CA\u65B9\u6CD5\u4E2D\u6700\u5173\u952E\u3001\u6700\u96BE\u4EC5\u9760\u6B63\u6587\u6216\u516C\u5F0F\u7406\u89E3\u7684\u4E00\u9879\u5C40\u90E8\u673A\u5236\u3002\u5B83\u5FC5\u987B\u533A\u522B\u4E8E\u65B9\u6CD5\u603B\u89C8\uFF0C\u5E76\u628A\u201C\u8FD9\u4E00\u673A\u5236\u5177\u4F53\u5982\u4F55\u5DE5\u4F5C\u201D\u8BB2\u6E05\u695A\u3002",
      en: "This figure explains exactly one local mechanism that is central to the method and difficult to understand from prose or equations alone. It must be distinct from the overview and make clear how that mechanism actually works."
    },
    successCriterion: {
      zh: "\u8BFB\u8005\u5E94\u80FD\u4ECE\u56FE\u4E2D\u8FFD\u8E2A\u8BE5\u673A\u5236\u7684\u8F93\u5165\u6216\u72B6\u6001\u3001\u5173\u952E\u53D8\u6362\u6216\u4EA4\u4E92\u3001\u4E2D\u95F4\u8868\u793A\u4EE5\u53CA\u8F93\u51FA\u6216\u63A5\u53E3\uFF0C\u540C\u65F6\u4E0D\u4F1A\u8BEF\u4EE5\u4E3A\u8FD9\u662F\u6574\u7BC7\u65B9\u6CD5\u7684\u603B\u89C8\u56FE\u3002",
      en: "A reader should be able to trace the mechanism\u2019s input or state, key transformation or interaction, intermediate representation, and output or interface without mistaking the figure for the full method overview."
    },
    designRules: {
      zh: [
        "\u5148\u6BD4\u8F83\u8BBA\u6587\u4E2D\u7684\u5019\u9009\u673A\u5236\uFF0C\u53EA\u9009\u62E9\u540C\u65F6\u6EE1\u8DB3\u56DB\u9879\u6761\u4EF6\u7684\u4E00\u9879\uFF1A\u5C5E\u4E8E\u6838\u5FC3\u8D21\u732E\uFF1B\u4EC5\u9760\u6587\u5B57\u6216\u516C\u5F0F\u8F83\u96BE\u7406\u89E3\uFF1B\u80FD\u591F\u4E0E Overview \u660E\u786E\u5206\u5DE5\uFF1B\u5728 .tex \u4E0E .pdf \u4E2D\u6709\u5145\u5206\u8BC1\u636E\u3002",
        "\u82E5\u6CA1\u6709\u4EFB\u4F55\u673A\u5236\u540C\u65F6\u6EE1\u8DB3\u56DB\u9879\u6761\u4EF6\uFF0C\u76F4\u63A5\u8BF4\u660E\u8BC1\u636E\u4E0D\u8DB3\u5E76\u505C\u6B62\uFF0C\u4E0D\u5F97\u4E3A\u4E86\u5B8C\u6210\u4EFB\u52A1\u800C\u53D1\u660E\u4E00\u5F20\u6280\u672F\u56FE\u3002",
        "\u56F4\u7ED5\u8FD9\u4E00\u9879\u673A\u5236\u5C55\u793A\u5FC5\u8981\u7684\u8F93\u5165\u6216\u72B6\u6001\u3001\u64CD\u4F5C\u987A\u5E8F\u3001\u5B9E\u4F53\u95F4\u5173\u7CFB\u3001\u4E2D\u95F4\u8868\u793A\u4E0E\u8F93\u51FA\uFF1B\u6BCF\u4E2A\u5143\u7D20\u90FD\u5FC5\u987B\u76F4\u63A5\u670D\u52A1\u4E8E\u673A\u5236\u7406\u89E3\u3002",
        "\u53EA\u5728\u516C\u5F0F\u5BF9\u673A\u5236\u4E0D\u53EF\u66FF\u4EE3\u4E14\u80FD\u4EE5\u8BBA\u6587\u539F\u5F0F\u6E05\u6670\u5448\u73B0\u65F6\u4FDD\u7559\u4E00\u4E2A\u5C40\u90E8\u516C\u5F0F\uFF1B\u5426\u5219\u4F7F\u7528\u51C6\u786E\u7684\u7ED3\u6784\u4E0E\u4FE1\u606F\u6D41\u8868\u8FBE\u3002",
        "\u660E\u786E\u68C0\u67E5\u4E0E\u65B9\u6CD5\u603B\u89C8\u7684\u5DEE\u5F02\uFF1A\u603B\u89C8\u7ED9\u51FA\u7CFB\u7EDF\u4F4D\u7F6E\u4E0E\u63A5\u53E3\uFF0C\u672C\u56FE\u653E\u5927\u5C40\u90E8\u8FD0\u4F5C\uFF1B\u4E0D\u5F97\u91CD\u65B0\u7ED8\u5236\u6574\u6761\u65B9\u6CD5\u6D41\u6C34\u7EBF\u3002"
      ],
      en: [
        "Compare candidate mechanisms and select exactly one that meets all four conditions: central to the contribution, hard to understand from prose or equations alone, clearly separable from the overview, and sufficiently supported by both the .tex and .pdf.",
        "If no mechanism meets all four conditions, state that the evidence is insufficient and stop. Do not invent a technical figure merely to complete the task.",
        "Show only the input or state, operation sequence, entity relationships, intermediate representation, and output needed to understand this mechanism. Every element must serve that explanation.",
        "Include at most one local equation, and only when it is indispensable and can be reproduced exactly from the paper; otherwise use precise structure and information flow.",
        "Explicitly check the division of labor with the Method Overview: the overview establishes system position and interfaces, while this figure magnifies local operation. Do not redraw the full pipeline."
      ]
    },
    exclusions: {
      zh: [
        "\u53EA\u751F\u6210\u4E00\u5F20\u6280\u672F\u7EC6\u8282\u56FE\uFF0C\u4E0D\u5F97\u63D0\u4F9B\u7B2C\u4E8C\u4E2A\u673A\u5236\u3001\u591A\u4E2A\u5907\u9009\u56FE\u3001\u8054\u7CFB\u8868\u6216\u540C\u56FE\u591A\u65B9\u6848\u3002",
        "\u4E0D\u5F97\u91CD\u590D\u5B8C\u6574\u8F93\u5165\u2014\u8F93\u51FA\u6D41\u6C34\u7EBF\uFF0C\u4E5F\u4E0D\u5F97\u6DF7\u5165\u7814\u7A76\u52A8\u673A\u3001\u5B9E\u9A8C\u7ED3\u679C\u3001\u6027\u80FD\u6BD4\u8F83\u6216\u672A\u88AB\u8BBA\u6587\u5B9A\u4E49\u7684\u7C7B\u6BD4\u3002",
        "\u4E0D\u5F97\u7528\u88C5\u9970\u6027\u56FE\u6807\u66FF\u4EE3\u6838\u5FC3\u8BA1\u7B97\u3001\u4EA4\u4E92\u6216\u72B6\u6001\u53D8\u5316\u3002"
      ],
      en: [
        "Generate one technical-detail figure only: no second mechanism, alternative figures, contact sheet, or multiple designs in one image.",
        "Do not repeat the full input-to-output pipeline or mix in motivation, experimental results, performance comparisons, or analogies not defined by the paper.",
        "Do not use decorative icons as substitutes for the core computation, interaction, or state transition."
      ]
    }
  }
};
function buildList(items) {
  return items.map((item) => `- ${item}`).join("\n");
}
function formatPaletteColor(hex) {
  const value = hex.replace("#", "");
  const red = Number.parseInt(value.slice(0, 2), 16);
  const green = Number.parseInt(value.slice(2, 4), 16);
  const blue = Number.parseInt(value.slice(4, 6), 16);
  return `${hex} / RGB(${red}, ${green}, ${blue})`;
}
function buildFigurePrompt(promptId, preferences, language, options = {}) {
  const spec = FIGURE_PROMPTS[promptId];
  const style = FIGURE_STYLES[preferences.styleId];
  const placement = FIGURE_PLACEMENTS[preferences.placementId];
  const aspectRatio = FIGURE_ASPECT_RATIOS[preferences.aspectRatioId];
  const selectedAspectRatio = getFigureAspectRatio(preferences);
  const palette = FIGURE_COLOR_PALETTES[preferences.paletteId];
  const fontFamily = FIGURE_FONT_FAMILIES[preferences.fontFamilyId];
  const accentColorRange = FIGURE_ACCENT_COLOR_RANGES[preferences.accentColorRangeId];
  const activePalette = palette.colors.slice(0, accentColorRange.max).map(formatPaletteColor).join(", ");
  const outputFileRule = options.outputFileName ? language === "zh" ? `\uFF0C\u6587\u4EF6\u540D\u5FC5\u987B\u4E3A \`${options.outputFileName}\`` : ` named \`${options.outputFileName}\`` : "";
  if (language === "zh") {
    const lineColorRule2 = preferences.lineColorMode === "semantic" ? "\u6DF1\u8272\u4E2D\u6027\u7EC6\u7EBF\u662F\u6240\u6709\u8FB9\u6846\u3001\u7BAD\u5934\u548C\u8FDE\u63A5\u7EBF\u7684\u9ED8\u8BA4\u989C\u8272\u3002\u53EA\u5728\u4E0D\u540C\u4FE1\u606F\u6D41\u3001\u5B9E\u4F53\u7C7B\u522B\u6216\u72B6\u6001\u786E\u5B9E\u9700\u8981\u533A\u5206\u65F6\uFF0C\u624D\u4F7F\u7528\u5019\u9009\u5F3A\u8C03\u8272\uFF1B\u76F8\u540C\u8BED\u4E49\u5FC5\u987B\u540C\u8272\uFF0C\u4E0D\u5F97\u4E3A\u4E86\u88C5\u9970\u5236\u9020\u5F69\u8679\u7EBF\u6761\u3002" : "\u6240\u6709\u8FB9\u6846\u3001\u7BAD\u5934\u548C\u8FDE\u63A5\u7EBF\u7EDF\u4E00\u4F7F\u7528\u6DF1\u8272\u4E2D\u6027\u7EC6\u7EBF\uFF0C\u4E0D\u7528\u7EBF\u6761\u989C\u8272\u533A\u5206\u8BED\u4E49\uFF1B\u9700\u8981\u533A\u5206\u65F6\u6539\u7528\u5F62\u72B6\u3001\u7EBF\u578B\u6216\u76F4\u63A5\u6807\u7B7E\u3002";
    const colorRule2 = `\u4F7F\u7528\u201C${palette.label.zh}\u201D\u8272\u7CFB\uFF0C\u5019\u9009\u5F3A\u8C03\u8272\u53CA\u53C2\u8003\u503C\u4F9D\u6B21\u4E3A ${activePalette}\u3002GPT \u5FC5\u987B\u6839\u636E\u771F\u5B9E\u4FE1\u606F\u6D41\u548C\u8BED\u4E49\u5206\u7EC4\uFF0C\u5728 ${accentColorRange.label} \u79CD\u6709\u5F69\u8272\u76F8\u4E2D\u9009\u62E9\u6700\u5C11\u591F\u7528\u7684\u6570\u91CF\uFF1B\u80FD\u7528\u8F83\u5C11\u989C\u8272\u8BF4\u6E05\u65F6\u4E0D\u5F97\u589E\u52A0\u3002\u8FD9\u4E00\u6570\u91CF\u4E0D\u5305\u62EC\u7EAF\u767D\u80CC\u666F\u3001\u9ED1\u8272\u6587\u5B57\u548C\u6DF1\u8272\u4E2D\u6027\u7ED3\u6784\u7EBF\u3002\u989C\u8272\u5E94\u4EE5\u7ED9\u5B9A RGB \u4E3A\u751F\u6210\u53C2\u8003\uFF0C\u4E0D\u5F97\u81EA\u884C\u66FF\u6362\u6216\u589E\u52A0\u8272\u76F8\uFF1B\u4EFB\u4F55\u5173\u952E\u533A\u522B\u90FD\u4E0D\u80FD\u53EA\u4F9D\u8D56\u989C\u8272\u3002`;
    const illustrationRule2 = preferences.allowLightIllustrations ? "\u5141\u8BB8\u514B\u5236\u7684\u8F7B\u5361\u901A\u6280\u672F\u63D2\u56FE\u3001\u8BED\u4E49 icon \u548C\u7565\u5E26\u5706\u6DA6\u611F\u7684\u65E0\u886C\u7EBF\u5B57\u4F53\uFF0C\u4F46\u5B83\u4EEC\u53EA\u80FD\u8868\u793A\u8BBA\u6587\u4E2D\u7684\u771F\u5B9E\u5BF9\u8C61\u6216\u8FC7\u7A0B\uFF0C\u4E0D\u5F97\u4EE3\u66FF\u6838\u5FC3\u673A\u5236\uFF0C\u4E5F\u4E0D\u5F97\u5448\u73B0\u6F2B\u753B\u3001\u5409\u7965\u7269\u3001\u624B\u5199\u4F53\u3001\u6C14\u6CE1\u5B57\u6216\u8425\u9500\u63D2\u753B\u6548\u679C\u3002" : "\u4E0D\u4F7F\u7528\u8F7B\u5361\u901A\u63D2\u56FE\u3001icon\u3001\u62DF\u7269\u5BF9\u8C61\u6216\u88C5\u9970\u5B57\u4F53\uFF1B\u6240\u6709\u5173\u7CFB\u53EA\u7528\u6A21\u5757\u3001\u7EBF\u6761\u3001\u7BAD\u5934\u3001\u7B80\u5355\u51E0\u4F55\u5F62\u72B6\u548C\u5FC5\u8981\u6587\u5B57\u8868\u8FBE\u3002";
    const cardFillRule2 = preferences.useCardFills ? "\u4E3B\u8981\u6A21\u5757\u5361\u7247\u5141\u8BB8\u4F7F\u7528\u53D6\u81EA\u5F3A\u8C03\u8272\u7684\u6781\u6D45\u3001\u4F4E\u9971\u548C\u5E95\u8272\uFF1B\u76F8\u540C\u89D2\u8272\u4F7F\u7528\u76F8\u540C\u5E95\u8272\uFF0C\u6587\u5B57\u59CB\u7EC8\u4E3A\u9ED1\u8272\uFF0C\u4E0D\u4F7F\u7528\u6E10\u53D8\u3001\u9634\u5F71\u6216\u6DF1\u8272\u5361\u7247\u3002" : "\u6240\u6709\u6A21\u5757\u5361\u7247\u4FDD\u6301\u7EAF\u767D\u6216\u900F\u660E\uFF0C\u4E0D\u8BBE\u7F6E\u5E95\u8272\uFF1B\u4EC5\u4F9D\u9760\u7EC6\u8FB9\u6846\u3001\u5BF9\u9F50\u3001\u95F4\u8DDD\u548C\u5206\u7EC4\u6807\u9898\u5EFA\u7ACB\u5C42\u7EA7\u3002";
    const typographyRule2 = preferences.fontSizeLevels === 2 ? "\u5168\u56FE\u4E25\u683C\u53EA\u4F7F\u7528\u4E24\u7EA7\u5B57\u53F7\uFF1A\u6B63\u6587/\u6807\u7B7E\u4E0E\u6807\u9898\uFF1B\u6700\u5927\u5B57\u53F7\u4E0D\u5F97\u8D85\u8FC7\u6700\u5C0F\u5B57\u53F7\u7684 1.25 \u500D\u3002\u4E0D\u5F97\u53E6\u52A0\u5FAE\u578B\u6CE8\u91CA\u3001\u8D85\u5927\u6807\u9898\u6216\u7B2C\u4E09\u79CD\u5B57\u53F7\u3002" : "\u5168\u56FE\u4E25\u683C\u53EA\u4F7F\u7528\u4E09\u7EA7\u5B57\u53F7\uFF1A\u6807\u7B7E\u3001\u5B50\u6807\u9898\u4E0E\u4E3B\u6807\u9898\uFF1B\u6700\u5927\u5B57\u53F7\u4E0D\u5F97\u8D85\u8FC7\u6700\u5C0F\u5B57\u53F7\u7684 1.35 \u500D\u3002\u4E0D\u5F97\u53E6\u52A0\u5FAE\u578B\u6CE8\u91CA\u6216\u5938\u5F20\u8D85\u5927\u6807\u9898\u3002";
    const titleRule2 = preferences.includeLargeTitle ? "\u5141\u8BB8\u4E00\u4E2A 3\u20137 \u4E2A\u82F1\u6587\u5355\u8BCD\u7684\u56FE\u5185\u5927\u6807\u9898\uFF0C\u4F46\u5FC5\u987B\u76F4\u63A5\u4F7F\u7528\u8BBA\u6587\u5DF2\u6709\u672F\u8BED\u4E14\u4E0D\u5F97\u5E26\u6709\u8425\u9500\u63AA\u8F9E\uFF1B\u8BBA\u6587\u5B8C\u6574\u6807\u9898\u3001\u4F5C\u8005\u548C caption \u4E0D\u653E\u5165\u56FE\u7247\u3002" : "\u4E0D\u4F7F\u7528\u56FE\u5185\u5927\u6807\u9898\uFF1B\u53EA\u4FDD\u7559\u5FC5\u8981\u7684 panel \u6807\u9898\u6216\u6B65\u9AA4\u6807\u7B7E\uFF0C\u8BBA\u6587\u6807\u9898\u3001\u4F5C\u8005\u548C caption \u5747\u4E0D\u653E\u5165\u56FE\u7247\u3002";
    return `# ${spec.heading.zh}

## \u76EE\u6807
${spec.objective.zh}

\u6210\u529F\u6807\u51C6\uFF1A${spec.successCriterion.zh}

## \u8F93\u5165\u4E0E\u53D6\u8BC1
\u5728\u540C\u4E00\u5BF9\u8BDD\u4E2D\u63D0\u4F9B\u672C Prompt\u3001\u8BBA\u6587\u4E3B \`.tex\` \u6E90\u6587\u4EF6\u548C\u6700\u65B0\u7F16\u8BD1\u7684 \`.pdf\`\u3002\u5148\u5B8C\u6574\u9605\u8BFB\u4E24\u4EFD\u6750\u6599\uFF1A\u4EE5 \`.tex\` \u4E3A\u672F\u8BED\u3001\u516C\u5F0F\u3001\u7B26\u53F7\u548C\u7ED3\u6784\u4F9D\u636E\uFF0C\u4EE5 \`.pdf\` \u7406\u89E3\u4E0A\u4E0B\u6587\u3001\u7248\u9762\u4E0E\u73B0\u6709\u56FE\u8868\u3002\u82E5\u4E24\u8005\u5B58\u5728\u4F1A\u5F71\u54CD\u7ED8\u56FE\u7684\u51B2\u7A81\uFF0C\u53EA\u63D0\u51FA\u5FC5\u8981\u95EE\u9898\uFF0C\u4E0D\u8981\u731C\u6D4B\u3002

## \u8FD9\u5F20\u56FE\u5FC5\u987B\u5B8C\u6210
${buildList(spec.designRules.zh)}

## \u4E0D\u5F97\u6DF7\u5165
${buildList(spec.exclusions.zh)}

## \u7EDF\u4E00\u89C6\u89C9\u4E0E\u6587\u5B57\u7EA6\u675F
- \u56FE\u4E2D\u6240\u6709\u6587\u5B57\u2014\u2014\u5305\u62EC\u6807\u9898\u3001\u6A21\u5757\u540D\u3001\u7BAD\u5934\u6807\u7B7E\u3001\u56FE\u4F8B\u3001\u7F29\u5199\u548C\u53D8\u91CF\u7B26\u53F7\u2014\u2014\u5FC5\u987B\u4E0E\u8BBA\u6587\u4E2D\u7684\u672F\u8BED\u5B8C\u5168\u4E00\u81F4\uFF0C\u4FDD\u7559\u539F\u6709\u5927\u5C0F\u5199\u3001\u8FDE\u5B57\u7B26\u548C\u7B26\u53F7\u3002\u4E0D\u5F97\u7FFB\u8BD1\u3001\u6539\u5199\u6216\u81EA\u9020\u8FD1\u4E49\u8BCD\uFF1B\u53EA\u80FD\u4F7F\u7528\u8BBA\u6587\u5DF2\u7ECF\u5B9A\u4E49\u7684\u7F29\u5199\u3002
- \u751F\u6210\u524D\u5728\u5185\u90E8\u5EFA\u7ACB\u7CBE\u786E\u6807\u7B7E\u6E05\u5355\uFF0C\u5E76\u9010\u5B57\u7B26\u6838\u5BF9\u51B7\u95E8\u65B9\u6CD5\u540D\u6216\u81EA\u9020\u8BCD\uFF1B\u4E0D\u8981\u5411\u6211\u8F93\u51FA\u8FD9\u4EFD\u6E05\u5355\u3002\u82E5\u6587\u5B57\u653E\u4E0D\u4E0B\uFF0C\u8C03\u6574\u7248\u5F0F\uFF0C\u4E0D\u5F97\u64C5\u81EA\u7F29\u5199\u3002
- \u4E0D\u5F97\u53D1\u660E\u8BBA\u6587\u4E2D\u4E0D\u5B58\u5728\u7684\u6A21\u5757\u3001\u6570\u636E\u6D41\u3001\u516C\u5F0F\u3001\u6307\u6807\u3001\u5B9E\u9A8C\u7ED3\u679C\u6216\u56E0\u679C\u5173\u7CFB\u3002\u8BC1\u636E\u4E0D\u8DB3\u7684\u5185\u5BB9\u5148\u8BE2\u95EE\uFF0C\u4E0D\u8981\u8865\u5168\u3002
- \u8BBA\u6587\u5360\u680F\uFF1A${placement.directive.zh}
- \u753B\u5E03\u6BD4\u4F8B\uFF1A${aspectRatio.directive.zh}
- \u751F\u6210\u524D\u5148\u628A\u56FE\u50CF\u5DE5\u5177\u7684\u6BD4\u4F8B\u9009\u62E9\u5668\u8BBE\u4E3A ${selectedAspectRatio}\uFF1B\u82E5\u5F53\u524D\u754C\u9762\u6CA1\u6709\u8BE5\u9884\u8BBE\u6216\u6BD4\u4F8B\u9009\u62E9\u5668\uFF0C\u4E5F\u5FC5\u987B\u5728\u751F\u6210\u6307\u4EE4\u4E2D\u4E25\u683C\u6267\u884C ${selectedAspectRatio}\uFF08\u5BBD:\u9AD8\uFF09\u3002\u753B\u5E03\u6BD4\u4F8B\u63CF\u8FF0\u7684\u662F\u5BFC\u51FA\u56FE\u7247\u672C\u8EAB\uFF0C\u4E0D\u5F97\u5728\u56FE\u4E2D\u7ED8\u5236\u8BBA\u6587\u680F\u7EBF\u3002
- \u82E5\u76EE\u6807 venue \u7684\u6B63\u5F0F\u6A21\u677F\u53E6\u6709\u5C3A\u5BF8\u8981\u6C42\uFF0C\u4EE5\u6B63\u5F0F\u6A21\u677F\u4E3A\u51C6\uFF0C\u4F46\u5FC5\u987B\u91CD\u65B0\u6392\u7248\u4EE5\u4FDD\u6301\u5F53\u524D\u5360\u680F\u610F\u56FE\uFF0C\u4E0D\u5F97\u76F4\u63A5\u538B\u7F29\u6587\u5B57\u6216\u7EBF\u6761\u3002
- \u89C6\u89C9\u98CE\u683C\uFF1A${style.directive.zh}
- \u7EBF\u6761\u989C\u8272\uFF1A${lineColorRule2}
- \u5F3A\u8C03\u8272\uFF1A${colorRule2}
- \u5168\u56FE\u5B57\u4F53\uFF1A${fontFamily.directive.zh}
- \u8F7B\u63D2\u56FE\u4E0E\u56FE\u6807\uFF1A${illustrationRule2}
- \u6A21\u5757\u5361\u7247\u5E95\u8272\uFF1A${cardFillRule2}
- \u5B57\u53F7\u5C42\u7EA7\uFF1A${typographyRule2}
- \u6240\u6709\u6587\u5B57\u7EDF\u4E00\u4F7F\u7528\u5B9E\u9ED1\u6216\u8FD1\u9ED1\u8272\uFF1B\u7981\u6B62\u6D45\u7070\u8272\u3001\u4F4E\u900F\u660E\u5EA6\u6216\u4F4E\u5BF9\u6BD4\u5EA6\u6587\u5B57\u3002\u6700\u5C0F\u4E00\u7EA7\u5B57\u53F7\u5728\u6700\u7EC8\u76EE\u6807\u680F\u5BBD\u4E0B\u5FC5\u987B\u6E05\u695A\u53EF\u8BFB\uFF0C\u82E5\u653E\u4E0D\u4E0B\u5C31\u5220\u51CF\u6807\u7B7E\u6216\u91CD\u6392\uFF0C\u4E0D\u80FD\u7F29\u6210\u5C0F\u5B57\u3002
- \u5927\u6807\u9898\uFF1A${titleRule2}
- \u6587\u5B57\u77ED\u800C\u6E05\u6670\uFF0C\u4E0D\u5199\u6BB5\u843D\u3002\u4E25\u683C\u670D\u4ECE\u6240\u9009\u753B\u5E03\u6BD4\u4F8B\u4E0E\u76EE\u6807\u680F\u5BBD\uFF0C\u4FDD\u6301\u4E00\u6761\u6E05\u695A\u7684\u9605\u8BFB\u8DEF\u5F84\uFF1B\u907F\u514D\u5782\u76F4\u6587\u5B57\u3001\u4EA4\u53C9\u7BAD\u5934\u548C\u65E0\u610F\u4E49\u7559\u767D\u3002

## \u76F4\u63A5\u751F\u6210
\u6750\u6599\u8DB3\u591F\u65F6\u76F4\u63A5\u751F\u6210\u6700\u7EC8\u56FE\u7247\uFF0C\u4E0D\u5148\u8F93\u51FA\u65B9\u6848\u3001\u6807\u7B7E\u6E05\u5355\u3001\u914D\u8272\u8BF4\u660E\u3001\u5907\u9009\u7248\u672C\uFF0C\u4E5F\u4E0D\u5F81\u6C42\u8BBE\u8BA1\u786E\u8BA4\u3002\u751F\u6210\u65F6\u5728\u5185\u90E8\u9010\u9879\u6838\u5BF9\u672F\u8BED\u3001\u62FC\u5199\u3001\u7ED3\u6784\u3001\u7BAD\u5934\u8BED\u4E49\u548C\u7F29\u5C0F\u540E\u7684\u53EF\u8BFB\u6027\uFF1B\u82E5\u53D1\u73B0\u9519\u8BEF\uFF0C\u53EA\u4FEE\u6B63\u53D7\u5F71\u54CD\u90E8\u5206\uFF0C\u4E0D\u6539\u53D8\u5176\u4F59\u8BBE\u8BA1\u3002

## \u8F93\u51FA
\u751F\u6210\u4E00\u4E2A\u753B\u5E03\u6BD4\u4F8B\u4E25\u683C\u4E3A ${selectedAspectRatio}\u3001\u53EF\u76F4\u63A5\u4E0B\u8F7D\u7684\u9AD8\u5206\u8FA8\u7387 PNG${outputFileRule}\u3002\u4E0D\u8981\u751F\u6210\u8054\u7CFB\u8868\uFF0C\u4E0D\u8981\u6DFB\u52A0\u6C34\u5370\u3001\u4F5C\u8005\u4FE1\u606F\u3001\u8BBA\u6587\u5B8C\u6574\u6807\u9898\u6216\u56FE\u7247 caption\u3002\u56FE\u7247\u4E4B\u540E\u53EA\u9644\u4E00\u884C\u6838\u5BF9\u7ED3\u679C\u3002`;
  }
  const lineColorRule = preferences.lineColorMode === "semantic" ? "Use thin dark-neutral lines by default for every border, arrow, and connector. Use candidate accent colors only when different information flows, entity types, or states genuinely need distinction. Keep identical semantics in the same color and never add rainbow lines for decoration." : "Use one dark neutral color for all borders, arrows, and connectors. Do not distinguish meaning through line color; use shape, line style, or direct labels instead.";
  const colorRule = `Use the \u201C${palette.label.en}\u201D palette with candidate accent colors and references ${activePalette}, in that order. GPT must choose the smallest sufficient number of chromatic accents within the ${accentColorRange.label} range according to the real information flows and semantic groups. This count excludes the pure-white canvas, black text, and dark neutral structural lines. Treat the given RGB values as generation references; do not substitute or add hues, and never rely on color alone for a critical distinction.`;
  const illustrationRule = preferences.allowLightIllustrations ? "Restrained light-cartoon technical illustrations, semantic icons, and subtly rounded sans-serif type are allowed only when they represent real objects or processes in the paper. They must not replace the core mechanism or look comic-like, mascot-driven, handwritten, bubbly, or promotional." : "Do not use light-cartoon illustrations, icons, skeuomorphic objects, or decorative type. Express all relationships with modules, lines, arrows, simple geometry, and necessary text.";
  const cardFillRule = preferences.useCardFills ? "Major module cards may use extremely pale, muted fills derived from the accent colors. Keep identical roles in identical fills, keep all text black, and do not use gradients, shadows, or dark cards." : "Keep every module card pure white or transparent with no fill. Establish hierarchy only through thin borders, alignment, spacing, and group headings.";
  const typographyRule = preferences.fontSizeLevels === 2 ? "Use exactly two type-size levels across the figure: body/labels and headings. The largest size must be no more than 1.25\xD7 the smallest. Do not introduce micro-annotations, an oversized title, or a third size." : "Use exactly three type-size levels across the figure: labels, subheadings, and main headings. The largest size must be no more than 1.35\xD7 the smallest. Do not introduce micro-annotations or an exaggerated oversized title.";
  const titleRule = preferences.includeLargeTitle ? "One large in-figure title of 3\u20137 English words is allowed, but every word must come directly from the paper\u2019s terminology and the title must not sound promotional. Do not place the full paper title, authors, or caption inside the image." : "Do not use a large in-figure title. Retain only necessary panel headings or step labels, and do not place the paper title, authors, or caption inside the image.";
  return `# ${spec.heading.en}

## Objective
${spec.objective.en}

Success criterion: ${spec.successCriterion.en}

## Inputs and evidence
Provide this prompt, the paper\u2019s main \`.tex\` source, and the latest compiled \`.pdf\` in the same conversation. Read both in full: treat the \`.tex\` as authoritative for terminology, equations, symbols, and structure, and use the \`.pdf\` for context, layout, and existing figures. If a conflict would materially affect the figure, ask only the necessary question instead of guessing.

## What this figure must do
${buildList(spec.designRules.en)}

## Do not include
${buildList(spec.exclusions.en)}

## Shared visual and text constraints
- Every piece of in-figure text\u2014including titles, module names, arrow labels, legends, abbreviations, and variable symbols\u2014must exactly match the paper\u2019s terminology, capitalization, hyphenation, and notation. Do not translate, paraphrase, or invent synonyms. Use only abbreviations already defined in the paper.
- Before generation, build an internal exact-label list and check uncommon method names and coined terms character by character; do not output that list. If a label does not fit, revise the layout rather than shortening it.
- Do not invent modules, data flows, equations, metrics, experimental results, or causal relationships that are absent from the paper. Ask before visualizing anything unsupported.
- Paper placement: ${placement.directive.en}
- Canvas ratio: ${aspectRatio.directive.en}
- Before generation, set the image tool\u2019s aspect-ratio picker to ${selectedAspectRatio}. If the current interface does not offer that preset or has no ratio picker, enforce ${selectedAspectRatio} (width:height) directly in the generation instruction. The ratio describes the exported image canvas; do not draw paper column guides inside the figure.
- If the target venue\u2019s official template specifies a different size, follow it and reflow the design while preserving the selected placement intent. Never solve the mismatch by compressing text or lines.
- Visual style: ${style.directive.en}
- Line colors: ${lineColorRule}
- Accent colors: ${colorRule}
- Global typeface: ${fontFamily.directive.en}
- Light illustrations and icons: ${illustrationRule}
- Module card fills: ${cardFillRule}
- Type-size hierarchy: ${typographyRule}
- Use solid black or near-black for every piece of text. Light-gray, low-opacity, and low-contrast text are prohibited. The smallest size must remain clearly legible at the final target column width; if content does not fit, remove labels or reflow the layout rather than shrinking the text.
- Large title: ${titleRule}
- Keep text short and avoid paragraphs. Follow the selected canvas ratio and target column width exactly. Maintain one clear reading path and avoid vertical text, crossing arrows, and meaningless whitespace.

## Generate directly
When the materials are sufficient, generate the final image immediately. Do not first output a plan, label list, palette explanation, alternative design, or confirmation request. During generation, internally audit terminology, spelling, structure, arrow semantics, and reduced-size legibility. If anything is wrong, correct only the affected part while preserving the rest of the design.

## Output
Generate one downloadable high-resolution PNG with an exact ${selectedAspectRatio} canvas${outputFileRule}. Do not create a contact sheet or add watermarks, author information, the full paper title, or the figure caption inside the image. After the image, provide only a one-line audit result.`;
}
function buildFrameworkFigureReconstructionPrompt(language, layout = {
  placementId: RECONSTRUCTION_OVERVIEW_FIGURE_PREFERENCES.placementId,
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
    zh: `1. \u5199\u4F5C\u524D\u63D0\u53D6\u5F53\u524D .bib \u7684\u5168\u90E8 BibTeX key\uFF1B\u6700\u7EC8 TeX \u4E2D\u6BCF\u4E2A cite key \u90FD\u5FC5\u987B\u771F\u5B9E\u5B58\u5728\u3002
2. \u65B0\u68C0\u7D22\u4F46\u5C1A\u672A\u52A0\u5165\u5F53\u524D .bib \u7684\u6587\u732E\u53EA\u80FD\u5199\u5165\u5355\u72EC\u7684\u5EFA\u8BAE BibTeX \u6587\u4EF6\uFF0C\u4E0D\u5F97\u76F4\u63A5\u63D2\u5165 TeX\u3002
3. \u6280\u672F\u4E8B\u5B9E\u4F18\u5148\u6838\u9A8C\u539F\u8BBA\u6587\u3001\u5B98\u65B9\u8BBA\u6587\u9875\u3001\u51FA\u7248\u793E\u9875\u9762\u3001DBLP\u3001Crossref \u6216\u4F5C\u8005\u516C\u5F00\u7248\u672C\u3002
4. \u4F18\u5148\u8FD1\u4E09\u5E74\u76F4\u63A5\u76F8\u5173\u5DE5\u4F5C\uFF0C\u540C\u65F6\u4FDD\u7559\u5FC5\u8981\u7684\u5960\u57FA\u6587\u732E\uFF1B\u4E0D\u5F97\u7528\u4EC5\u5173\u952E\u8BCD\u76F8\u4F3C\u7684\u6587\u732E\u51D1\u6570\u3002
5. \u6BCF\u6761\u65B0\u589E\u5EFA\u8BAE\u8981\u8BF4\u660E\u652F\u6301\u7684\u5177\u4F53\u8BBA\u70B9\u3001\u5EFA\u8BAE\u4F4D\u7F6E\u3001\u4E0E\u73B0\u6709 .bib \u662F\u5426\u91CD\u590D\u53CA\u63A8\u8350\u7406\u7531\u3002
6. \u6838\u9A8C\u6807\u9898\u3001\u4F5C\u8005\u3001\u5E74\u4EFD\u3001venue\u3001DOI \u6216\u5B98\u65B9 URL\uFF1B\u65E0\u6CD5\u786E\u8BA4\u7684\u5B57\u6BB5\u5B81\u7F3A\u6BCB\u6EE5\u3002`,
    en: `1. Extract every BibTeX key from the current .bib before drafting. Every cite key in the final TeX must exist in that file.
2. Newly discovered works that are not yet in the current .bib may appear only in a separate BibTeX suggestions file, never directly in the TeX.
3. Prefer original papers, official proceedings pages, publisher pages, DBLP, Crossref, or author-hosted versions for technical facts.
4. Prioritize directly relevant work from the last three years while retaining necessary foundations. Do not pad the bibliography with keyword-only matches.
5. For each suggested addition, state the exact claim it supports, proposed location, possible duplication with the current .bib, and why it matters.
6. Verify title, authors, year, venue, DOI, or official URL. Omit uncertain fields instead of guessing.`
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
- \u53EF\u9009\uFF1A\u5176\u4ED6\u9644\u4EF6`,
      en: `- The current latest complete .tex
- Its matching PDF
- The current complete .bib
- Optional: other attachments`
    },
    scope: {
      zh: "\u5141\u8BB8\u91CD\u6392\u7AE0\u8282\u548C\u6BB5\u843D\u3001\u5408\u5E76\u91CD\u590D\u5185\u5BB9\u3001\u91CD\u5199\u7AE0\u8282\u5F00\u5934\u4E0E\u4E3B\u9898\u53E5\u3001\u91CD\u6784\u8D21\u732E\u3001\u8C03\u6574 Method \u4E0E Experiments \u7684\u5206\u5DE5\u5E76\u5EFA\u7ACB\u5FC5\u8981\u7684 Discussion\u3002\u4E0D\u5F97\u6539\u53D8\u6A21\u677F\u6216\u6DFB\u52A0\u6750\u6599\u4E0D\u652F\u6301\u7684\u673A\u5236\u4E0E\u5B9E\u9A8C\u3002",
      en: "You may reorder sections and paragraphs, merge repetition, rewrite section openings and topic sentences, rebuild the contribution statement, clarify the division between Method and Experiments, and create a necessary Discussion. Do not change the template or add unsupported mechanisms or experiments."
    },
    styleBranches: {
      conference: {
        zh: "\u4F1A\u8BAE\u8BBA\u6587\uFF1A\u91C7\u7528 section \u2192 subsection \u2192 paragraph\uFF1BRelated Work \u6070\u597D\u4E09\u4E2A\u5355\u6BB5\u5C0F\u8282\uFF1BMethod \u4E0D\u5355\u8BBE Overview\uFF1BDiscussion and Limitations \u7531\u4E09\u4E2A\u8BA8\u8BBA\u5C0F\u8282\u548C\u4E00\u4E2A\u7EA6 100 \u8BCD\u7684 Limitations \u5C0F\u8282\u7EC4\u6210\u3002",
        en: "Conference paper: use section \u2192 subsection \u2192 paragraph; give Related Work exactly three one-paragraph subsections; omit a standalone Method Overview; and structure Discussion and Limitations as three discussion subsections plus an approximately 100-word Limitations subsection."
      },
      journal: {
        zh: "\u671F\u520A\u8BBA\u6587\uFF1A\u91C7\u7528 section \u2192 subsection \u2192 subsubsection \u2192 paragraph\uFF1BRelated Work \u6070\u597D\u4E09\u4E2A\u53CC\u6BB5\u5C0F\u8282\uFF1BMethod \u5355\u8BBE\u6070\u597D\u4E24\u6BB5\u4E14\u4E0D\u8D85\u8FC7 80 \u8BCD\u7684 Overview\uFF0C\u4E0D\u5F97\u590D\u8FF0\u6846\u67B6\u56FE\u3002",
        en: "Journal paper: use section \u2192 subsection \u2192 subsubsection \u2192 paragraph; give Related Work exactly three two-paragraph subsections; and use a standalone, exactly two-paragraph Method Overview capped at 80 words without narrating the framework figure."
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
      zh: `\u751F\u6210\u5B8C\u6574\u82F1\u6587 .tex\u3001\u4E2D\u6587\u62A5\u544A\u548C\u5EFA\u8BAE BibTeX\u3002\u4E2D\u6587\u62A5\u544A\u81F3\u5C11\u5305\u542B\uFF1AScientific Positioning Contract\u3001\u6700\u7EC8\u6807\u9898\u4E0E\u8BBA\u6587\u54C1\u724C\u7F29\u5199\u53CA\u4F9D\u636E\u3001\u4E00\u53E5\u8BDD\u4E3B\u65E8\u4E0E\u75DB\u70B9\u3001\u65E7/\u65B0\u4E3B\u7EBF\u5BF9\u7167\u3001\u8D21\u732E\u5206\u5C42\u3001Claim\u2013Evidence Map\u3001\u6700\u7EC8\u672F\u8BED\u8868\u3001\u7AE0\u8282\u529F\u80FD\u4E0E\u9884\u7B97\u8868\u3001\u56FE\u8868\u89D2\u8272\u3001\u7ED3\u6784\u64CD\u4F5C\u6E05\u5355\u3001\u8054\u7F51\u6838\u9A8C\u3001\u4F5C\u8005\u9700\u786E\u8BA4\u9879\u548C\u4E0B\u4E00\u6B65\u4EA4\u63A5\u6458\u8981\u3002`,
      en: `Create a complete English .tex, a Chinese report, and BibTeX suggestions. The report must include the Scientific Positioning Contract, final title and paper brand acronym with rationale, one-sentence thesis and pain point, old/new throughline comparison, contribution hierarchy, Claim\u2013Evidence Map, final terminology table, section-function and budget table, visual roles, structural operation log, web verification, author-confirmation items, and a self-contained handoff.`
    },
    fileNames: {
      zh: `<base_name>_round_1_scientific_structure.tex
<base_name>_round_1_report_zh.md
<base_name>_round_1_bib_suggestions.bib`,
      en: `<base_name>_round_1_scientific_structure.tex
<base_name>_round_1_report_zh.md
<base_name>_round_1_bib_suggestions.bib`
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
- \u5F53\u524D\u5B8C\u6574 .bib
- \u53EF\u9009\uFF1A\u5176\u4ED6\u9644\u4EF6`,
      en: `- The newest complete .tex, preferably the Step 1 output
- Its complete matching PDF
- The current complete .bib
- Optional: other attachments`
    },
    scope: {
      zh: "Method \u4E0E Experiments \u5141\u8BB8\u5927\u5E45\u91CD\u6784\u3002\u5176\u4ED6\u7AE0\u8282\u53EA\u4E3A\u672F\u8BED\u3001\u4E8B\u5B9E\u4E0E\u4EA4\u53C9\u5F15\u7528\u4E00\u81F4\u6027\u505A\u6700\u5C0F\u540C\u6B65\u3002\u6CA1\u6709\u8BC1\u636E\u7684\u5B9E\u73B0\u6216\u5B9E\u9A8C\u4FE1\u606F\u5FC5\u987B\u5220\u9664\u6216\u6807\u8BB0\u4E3A\u4F5C\u8005\u9700\u786E\u8BA4\u3002",
      en: "Method and Experiments may be substantially reconstructed. Make only minimal terminology, fact, and cross-reference updates elsewhere. Remove unsupported implementation or experimental details from the manuscript and flag them for author confirmation."
    },
    styleBranches: {
      conference: {
        zh: "\u4F1A\u8BAE\u8BBA\u6587\uFF1A\u91C7\u7528 section \u2192 subsection \u2192 paragraph\uFF0C\u4E0D\u5355\u8BBE Overview\uFF1B\u5728\u5408\u9002\u4F4D\u7F6E\u81EA\u7136\u5F15\u51FA\u603B\u4F53\u6846\u67B6\u3002\u5B9E\u9A8C\u8BBE\u7F6E\u5185\u7528 paragraph \u4F9D\u6B21\u7EC4\u7EC7 Datasets\u3001Experimental Configuration \u548C Baselines\u3002",
        en: "Conference paper: use section \u2192 subsection \u2192 paragraph with no standalone Overview; introduce the framework naturally where it serves the story. Inside experimental setup, use paragraph headings for Datasets, Experimental Configuration, and Baselines in that order."
      },
      journal: {
        zh: "\u671F\u520A\u8BBA\u6587\uFF1A\u91C7\u7528 section \u2192 subsection \u2192 subsubsection \u2192 paragraph\uFF1BMethod \u5355\u8BBE\u6070\u597D\u4E24\u6BB5\u3001\u603B\u8BA1\u4E0D\u8D85\u8FC7 80 \u8BCD\u7684 Overview\uFF0C\u89E3\u91CA\u79D1\u5B66\u903B\u8F91\u4F46\u4E0D\u590D\u8FF0\u6846\u67B6\u56FE\u3002\u5B9E\u9A8C\u8BBE\u7F6E\u5185\u7528 subsubsection \u4F9D\u6B21\u7EC4\u7EC7 Datasets\u3001Experimental Configuration \u548C Baselines\u3002",
        en: "Journal paper: use section \u2192 subsection \u2192 subsubsection \u2192 paragraph. Method has a standalone Overview of exactly two paragraphs and at most 80 words that explains scientific logic without narrating the figure. Inside experimental setup, use subsubsections for Datasets, Experimental Configuration, and Baselines in that order."
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
          zh: "\u4E3A\u6BCF\u9879\u5B9E\u9A8C\u5199\u660E\u8981\u56DE\u7B54\u7684\u95EE\u9898\u3001\u4F7F\u7528\u7684\u6570\u636E\u4E0E\u8BBE\u7F6E\u3001\u6307\u6807\u3001\u6BD4\u8F83\u5BF9\u8C61\u3001\u56FE\u8868\u8BC1\u636E\u3001\u6240\u652F\u6301\u7684 claim\u3001\u8BC1\u636E\u5F3A\u5EA6\u548C\u4E0D\u80FD\u63A8\u51FA\u7684\u7ED3\u8BBA\u3002\u5B9E\u9A8C\u987A\u5E8F\u4ECE\u603B\u4F53\u6709\u6548\u6027\u8FDB\u5165\u673A\u5236\u3001\u8FB9\u754C\u4E0E\u89E3\u91CA\u3002",
          en: "For every experiment, record the question, data and setup, metric, comparison, visual evidence, supported claim, evidence strength, and conclusions that cannot be drawn. Order experiments from overall effectiveness to mechanisms, boundaries, and interpretation."
        }
      },
      {
        heading: {
          zh: "D. \u91CD\u5199\u5B9E\u9A8C\u8BBE\u7F6E\u3001\u4E3B\u7ED3\u679C\u4E0E\u8BC1\u636E\u9A71\u52A8\u5206\u6790",
          en: "D. Rewrite Setup, Main Results, and Evidence-driven Analyses"
        },
        body: {
          zh: `\u7B2C\u4E00\u4E2A\u5C0F\u8282\u56FA\u5B9A\u4E3A Datasets and Experimental Setup\uFF0C\u5185\u90E8\u5FC5\u987B\u4F9D\u6B21\u8986\u76D6 Datasets\u3001Experimental Configuration\uFF08\u670D\u52A1\u5668/\u786C\u4EF6\u3001\u8D85\u53C2\u6570\u7B49\uFF09\u548C Baselines\uFF1B\u7B2C\u4E8C\u4E2A\u5C0F\u8282\u56FA\u5B9A\u4E3A Main Results\u3002\u540E\u7EED\u4E0D\u7ED1\u5B9A\u7B2C\u4E09\u6216\u7B2C\u56DB\u7684\u56FA\u5B9A\u5E8F\u53F7\uFF0C\u6309\u771F\u5B9E\u8BC1\u636E\u7EC4\u7EC7 Ablation Studies\u3001\u673A\u5236/\u6548\u7387/\u53C2\u6570\u3001Case Studies and Qualitative Analysis \u7B49\u5206\u6790\u3002
\u7ED3\u679C\u6BB5\u843D\u6309\u201C\u5B9E\u9A8C\u95EE\u9898 \u2192 \u5173\u952E\u89C2\u5BDF \u2192 \u89E3\u91CA \u2192 \u4E0E claim \u7684\u5173\u7CFB \u2192 \u8FB9\u754C\u201D\u5C55\u5F00\uFF0C\u4E0D\u9010\u5355\u5143\u683C\u6717\u8BFB\u3002\u6BCF\u9879\u6D88\u878D\u5FC5\u987B\u5BF9\u5E94\u660E\u786E\u8BBE\u8BA1\u95EE\u9898\uFF0C\u4E0D\u628A\u666E\u901A\u6CE2\u52A8\u5199\u6210\u786E\u5B9A\u673A\u5236\u3002`,
          en: `Fix Datasets and Experimental Setup as the first subsection, with required Datasets, Experimental Configuration (including servers/hardware and hyperparameters), and Baselines units in that order; fix Main Results as the second. Do not reserve fixed third or fourth positions. Order supported Ablation Studies, mechanism/efficiency/parameter analyses, Case Studies and Qualitative Analysis, and other analyses by evidence.
Write each result paragraph as question, key observation, interpretation, relation to a claim, and boundary. Do not narrate every table cell. Tie each ablation to a clear design question and do not present ordinary variation as a confirmed mechanism.`
        }
      },
      {
        heading: {
          zh: "E. \u6838\u9A8C\u6570\u5B57\u3001\u7EDF\u8BA1\u4E0E\u76F8\u5173\u5DE5\u4F5C",
          en: "E. Verify Numbers, Statistics, and Related Work"
        },
        body: {
          zh: "\u6838\u5BF9\u56FE\u8868\u3001\u6B63\u6587\u3001caption \u548C\u6458\u8981\u4E2D\u7684\u6570\u503C\u3001\u6307\u6807\u65B9\u5411\u3001\u5355\u4F4D\u3001\u5747\u503C/\u6807\u51C6\u5DEE\u53CA\u663E\u8457\u6027\u8868\u8FF0\u3002\u8054\u7F51\u6838\u9A8C\u6700\u76F8\u5173\u57FA\u7EBF\u3001\u6570\u636E\u96C6\u6765\u6E90\u3001\u8BC4\u4EF7\u534F\u8BAE\u548C\u8FD1\u90BB\u673A\u5236\uFF1B\u65B0\u6587\u732E\u4ECD\u53EA\u8FDB\u5165\u5EFA\u8BAE BibTeX\u3002",
          en: "Cross-check values, metric direction, units, mean/standard-deviation notation, and significance language across visuals, prose, captions, and abstract. Verify the closest baselines, dataset sources, evaluation protocols, and neighboring mechanisms on the web. New works still go only to BibTeX suggestions."
        }
      }
    ],
    deliverables: {
      zh: "\u751F\u6210\u5B8C\u6574\u82F1\u6587 .tex\u3001\u4E2D\u6587\u62A5\u544A\u548C\u5EFA\u8BAE BibTeX\u3002\u62A5\u544A\u5305\u542B Method \u903B\u8F91\u56FE\u8C31\u3001\u65E7/\u65B0\u5C0F\u8282\u5BF9\u7167\u3001\u516C\u5F0F\u7B26\u53F7\u5BA1\u8BA1\u3001\u73B0\u6709\u56FE\u8868\u4E0E\u6B63\u6587\u63A5\u53E3\u5BA1\u8BA1\u3001Experiment Question\u2013Evidence Matrix\u3001\u5B9E\u9A8C\u987A\u5E8F\u8BF4\u660E\u3001\u6570\u5B57\u98CE\u9669\u3001\u5F31\u5316\u4E3B\u5F20\u3001\u8054\u7F51\u6838\u9A8C\u3001\u4FEE\u6539\u6E05\u5355\u3001\u4F5C\u8005\u9700\u786E\u8BA4\u9879\u548C\u4E0B\u4E00\u8F6E\u4EA4\u63A5\u6458\u8981\u3002",
      en: "Create a complete English .tex, a Chinese report, and BibTeX suggestions. The report must include the Method logic map, old/new subsection comparison, equation and notation audit, existing-visual-to-prose interface audit, Experiment Question\u2013Evidence Matrix, experiment-order rationale, numeric risks, qualified claims, web verification, revision log, author-confirmation items, and the next-round handoff."
    },
    fileNames: {
      zh: `<base_name>_round_2_method_experiments.tex
<base_name>_round_2_report_zh.md
<base_name>_round_2_bib_suggestions.bib`,
      en: `<base_name>_round_2_method_experiments.tex
<base_name>_round_2_report_zh.md
<base_name>_round_2_bib_suggestions.bib`
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
- \u5F53\u524D\u5B8C\u6574 .bib
- \u53EF\u9009\uFF1A\u7B2C\u4E8C\u6B65\u62A5\u544A\u548C\u4F5C\u8005\u786E\u8BA4\u7ED3\u679C`,
      en: `- The newest complete .tex, preferably the Step 2 output
- Its matching PDF
- The current complete .bib
- Optional: the Step 2 report and author confirmations`
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
          zh: "\u68C0\u67E5\u5404\u53D9\u4E8B\u7AE0\u8282\u662F\u5426\u548C\u65E2\u5B9A\u6807\u9898\u3001Method\u3001Experiments\u3001\u56FE\u8868\u3001\u8D21\u732E\u70B9\u53CA\u552F\u4E00\u672F\u8BED\u4F53\u7CFB\u5B8C\u5168\u4E00\u81F4\u3002\u8054\u7F51\u6838\u9A8C Introduction \u4E0E Related Work \u7684\u7814\u7A76\u7F3A\u53E3\uFF1B\u65B0\u589E\u6587\u732E\u53EA\u8FDB\u5165\u5EFA\u8BAE BibTeX\u3002",
          en: "Verify that the narrative sections align completely with the fixed title, Method, Experiments, visuals, contributions, and canonical terminology system. Use web research to verify the gap in Introduction and Related Work. Put newly discovered works only in BibTeX suggestions."
        }
      }
    ],
    deliverables: {
      zh: "\u751F\u6210\u5B8C\u6574\u82F1\u6587 .tex\u3001\u4E2D\u6587\u62A5\u544A\u548C\u5EFA\u8BAE BibTeX\u3002\u62A5\u544A\u5305\u542B\u4E8B\u5B9E\u5E95\u7A3F\u3001\u65E2\u5B9A\u6807\u9898\u4E0E\u8BBA\u6587\u54C1\u724C\u7F29\u5199\u786E\u8BA4\u3001Abstract \u529F\u80FD\u8868\u3001Introduction \u529F\u80FD\u8868\u3001\u8D21\u732E\u5BF9\u7167\u3001Related Work \u4E3B\u9898\u4E0E\u6587\u732E\u7C07\u3001Discussion \u8BC1\u636E/\u63A8\u65AD/\u8FB9\u754C\u8868\u3001Conclusion \u529F\u80FD\u8868\u3001\u672F\u8BED\u5BF9\u9F50\u3001\u8054\u7F51\u6838\u9A8C\u3001\u91CD\u6784\u6E05\u5355\u548C\u4E0B\u4E00\u6B65\u4EA4\u63A5\u6458\u8981\u3002",
      en: "Create a complete English .tex, a Chinese report, and BibTeX suggestions. The report must include the fact base, confirmation of the fixed title and paper brand acronym, Abstract function table, Introduction function table, contribution comparison, Related Work themes and citation clusters, Discussion evidence/inference/boundary table, Conclusion function table, terminology alignment, web verification, reconstruction log, and next-step handoff."
    },
    fileNames: {
      zh: `<base_name>_round_3_narrative_reconstruction.tex
<base_name>_round_3_report_zh.md
<base_name>_round_3_bib_suggestions.bib`,
      en: `<base_name>_round_3_narrative_reconstruction.tex
<base_name>_round_3_report_zh.md
<base_name>_round_3_bib_suggestions.bib`
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
      zh: "\u672F\u8BED\u3001\u7ED3\u6784\u3001\u7BAD\u5934\u8BED\u4E49\u300116:9 \u753B\u5E03\u4E0E\u7F29\u5C0F\u540E\u53EF\u8BFB\u6027\u5747\u5DF2\u6838\u5BF9\u3002",
      en: "Terminology, structure, arrow semantics, the 16:9 canvas, and reduced-size legibility have all been checked."
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
- \u7B2C\u56DB\u6B65\u91CD\u6784\u7684\u603B\u4F53\u6846\u67B6\u56FE PNG
- \u53EF\u9009\uFF1A\u524D\u4E09\u6B65\u62A5\u544A\u3001\u7B2C\u56DB\u6B65\u56FE\u7247\u6838\u5BF9\u7ED3\u679C\u548C\u4F5C\u8005\u786E\u8BA4\u7ED3\u679C`,
      en: `- The newest complete .tex, preferably the Step 3 output
- Its matching PDF
- The current complete .bib
- The overall-framework PNG reconstructed in Step 4
- Optional: reports from Steps 1\u20133, the Step 4 image audit, and author confirmations`
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
      zh: "\u751F\u6210\u5B8C\u6574\u82F1\u6587 .tex\u3001\u4E2D\u6587\u7EC8\u5BA1\u62A5\u544A\u548C\u6700\u7EC8\u5EFA\u8BAE BibTeX\u3002\u62A5\u544A\u5305\u542B\u91CD\u5927\u4FEE\u6B63\u3001\u672F\u8BED\u4E0E\u7F29\u5199\u8868\u3001Cross-Section Redundancy Matrix\u3001Claim\u2013Evidence \u8868\u3001\u6570\u5B57\u4E0E\u7EDF\u8BA1\u5BA1\u8BA1\u3001\u5F15\u7528\u5BA1\u8BA1\u3001\u56FE\u8868\u516C\u5F0F\u7B97\u6CD5\u4E0E LaTeX \u5BA1\u8BA1\u3001\u5BA1\u7A3F\u4EBA\u653B\u51FB\u6D4B\u8BD5\u3001\u4E0D\u53EF\u901A\u8FC7\u6587\u5B57\u89E3\u51B3\u7684\u98CE\u9669\u3001\u4FEE\u6539\u6E05\u5355\u548C\u6295\u7A3F\u76EE\u6807\u68C0\u7D22\u4EA4\u63A5\u6458\u8981\u3002",
      en: "Create a complete English .tex, a Chinese final-audit report, and final BibTeX suggestions. The report must include major revisions, terminology and acronym tables, Cross-Section Redundancy Matrix, Claim\u2013Evidence audit, numeric/statistical audit, citation audit, visual/equation/algorithm/LaTeX audit, reviewer attack test, risks that prose cannot solve, revision log, and the submission-targeting handoff."
    },
    fileNames: {
      zh: `<base_name>_round_5_final_refinement.tex
<base_name>_round_5_report_zh.md
<base_name>_round_5_bib_suggestions.bib`,
      en: `<base_name>_round_5_final_refinement.tex
<base_name>_round_5_report_zh.md
<base_name>_round_5_bib_suggestions.bib`
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
            zh: "- \u4F1A\u8BAE\u8BBA\u6587\u76EE\u5F55\u5C42\u7EA7\u56FA\u5B9A\u4E3A section \u2192 subsection \u2192 paragraph\uFF0C\u4E0D\u4F7F\u7528 subsubsection\uFF1B",
            en: "- Conference-paper hierarchy is section \u2192 subsection \u2192 paragraph; do not use subsubsection;"
          },
          journal: {
            zh: "- \u671F\u520A\u8BBA\u6587\u76EE\u5F55\u5C42\u7EA7\u56FA\u5B9A\u4E3A section \u2192 subsection \u2192 subsubsection \u2192 paragraph\uFF1B",
            en: "- Journal-paper hierarchy is section \u2192 subsection \u2192 subsubsection \u2192 paragraph;"
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
5. \u6BCF\u4E2A\u6838\u5FC3\u673A\u5236\u6309\u201C\u8BBE\u8BA1\u76EE\u7684 \u2192 \u6570\u5B66\u6216\u8BA1\u7B97\u6784\u9020 \u2192 \u4E0E\u5176\u4ED6\u7EC4\u4EF6\u7684\u63A5\u53E3 \u2192 \u8BBE\u8BA1\u76F4\u89C9 \u2192 \u8BAD\u7EC3\u6216\u63A8\u7406\u4E2D\u7684\u4F5C\u7528 \u2192 \u9002\u7528\u8FB9\u754C\u201D\u5C55\u5F00\uFF1B\u4E0D\u5F97\u53EA\u590D\u8FF0\u6267\u884C\u6D41\u7A0B\uFF0C\u4E5F\u4E0D\u5F97\u628A\u5E38\u89C4 backbone\u3001\u6807\u51C6\u6CE8\u610F\u529B\u3001\u5E38\u89C1\u635F\u5931\u6216\u7B80\u5355\u62FC\u63A5\u5305\u88C5\u6210\u72EC\u7ACB\u8D21\u732E\u3002
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
6. \u7ED3\u679C\u6BB5\u843D\u5C3D\u91CF\u5305\u542B\u201C\u5B9E\u9A8C\u95EE\u9898 \u2192 \u5173\u952E\u89C2\u5BDF \u2192 \u89E3\u91CA \u2192 \u4E0E\u6838\u5FC3 claim \u7684\u5173\u7CFB \u2192 \u8FB9\u754C\u6216\u4F8B\u5916\u201D\u3002\u4E0D\u5F97\u91CD\u590D\u5168\u90E8\u6570\u5B57\u3001\u6BCF\u53E5\u90FD\u4EE5 Table/Figure \u5F00\u5934\u3001\u7528 higher is better \u5F0F\u7A7A\u8BDD\u3001\u63D0\u524D\u5199 Discussion \u7684\u666E\u904D\u610F\u4E49\u6216\u7528 significant \u8868\u793A\u666E\u901A\u6570\u503C\u5DEE\u5F02\u3002
7. \u5BF9\u6BCF\u5F20\u5B9E\u9A8C\u56FE\u68C0\u67E5 caption \u662F\u5426\u89E3\u91CA\u53D8\u91CF\u3001\u8BBE\u7F6E\u3001\u5747\u503C\u6216\u8BEF\u5DEE\u5E26\uFF0C\u56FE\u4F8B\u4E0E\u672F\u8BED\u662F\u5426\u4E00\u81F4\uFF0C\u6570\u503C\u662F\u5426\u4E0E\u8868\u683C\u51B2\u7A81\uFF0C\u6B63\u6587\u662F\u5426\u89E3\u91CA\u8D8B\u52BF\uFF0C\u4EE5\u53CA\u89C6\u89C9\u8BC1\u636E\u662F\u5426\u771F\u7684\u652F\u6301 claim\u3002
{{experiments_word_limits}}

### \u4E2D\u6587\u62A5\u544A\u56FA\u5B9A\u6E05\u5355

\u62A5\u544A\u5FC5\u987B\u5305\u542B\uFF1AMethod \u903B\u8F91\u56FE\u8C31\u3001\u65B9\u6CD5\u5C0F\u8282\u91CD\u6784\u5BF9\u7167\u3001\u516C\u5F0F\u4E0E\u7B26\u53F7\u5BA1\u8BA1\u3001\u73B0\u6709\u56FE\u8868\u4E0E\u6B63\u6587\u63A5\u53E3\u5BA1\u8BA1\u3001Experiment Question\u2013Evidence \u8868\u3001\u5B9E\u9A8C\u987A\u5E8F\u8BBE\u8BA1\u3001\u6570\u5B57\u4E0E\u7EDF\u8BA1\u98CE\u9669\u3001\u5220\u9664\u6216\u5F31\u5316\u7684\u673A\u5236\u4E3B\u5F20\u3001\u8054\u7F51\u57FA\u7EBF\u4E0E\u534F\u8BAE\u6838\u9A8C\u3001\u4FEE\u6539\u6E05\u5355\u3001\u4F5C\u8005\u9700\u786E\u8BA4\u9879\u548C\u4E0B\u4E00\u8F6E\u4EA4\u63A5\u6458\u8981\u3002`,
      en: `### Fixed Constraints for Method

1. {{method_document_hierarchy}}
2. Method must not read like a manuscript manual, code document, or procedural checklist. Build an integrated scientific story around why the problem is difficult, why existing designs are insufficient, why each mechanism is needed, how it addresses the problem, and where it applies. Do not force every sentence to state a why; integrate motivation, design, computation, and function naturally at paragraph level.
3. Problem Definition must define the task, inputs, outputs, central constraints, and learning objective. Keep only necessary equations. Define every symbol before or at first use. Retain a notation table only when notation volume warrants it; never add decorative notation.
4. {{method_overview_structure}}
5. Develop each core mechanism in this order: design purpose \u2192 mathematical or computational construction \u2192 interfaces \u2192 intuition \u2192 training or inference role \u2192 applicable boundary. Do not merely describe execution steps or package a standard backbone, ordinary attention, common loss, or simple concatenation as an independent contribution.
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
6. Each results paragraph should contain experiment question \u2192 key observation \u2192 interpretation \u2192 relation to the core claim \u2192 boundary or exception. Do not repeat every number, begin every sentence with Table/Figure, use "higher is better" filler, move broad Discussion claims into Results, or use "significant" for ordinary numerical differences.
7. For every experimental figure, check whether the caption explains variables, settings, means, or error bands; whether legend terminology is consistent; whether values conflict with tables; whether prose interprets the trend; and whether the visual actually supports the claim.
{{experiments_word_limits}}

### Fixed Chinese-report Checklist

The report must contain the Method logic map, old/new Method subsection comparison, equation and notation audit, existing-visual-to-prose interface audit, Experiment Question\u2013Evidence table, experiment-order rationale, numeric/statistical risks, removed or qualified mechanism claims, web verification of baselines and protocols, revision log, author-confirmation items, and next-step handoff.`
    },
    inlineStyleConstraints: [
      {
        marker: "method_document_hierarchy",
        branches: {
          conference: {
            zh: "\u4F1A\u8BAE\u8BBA\u6587\u91C7\u7528 section \u2192 subsection \u2192 paragraph \u5C42\u7EA7\uFF0C\u4E0D\u4F7F\u7528 subsubsection\uFF1B\u65B9\u6CD5\u7EC6\u8282\u6309\u79D1\u5B66\u903B\u8F91\u800C\u975E\u4EE3\u7801\u7C7B\u540D\u7EC4\u7EC7\u3002",
            en: "Conference papers use section \u2192 subsection \u2192 paragraph and do not use subsubsection; organize Method by scientific logic rather than code class names."
          },
          journal: {
            zh: "\u671F\u520A\u8BBA\u6587\u91C7\u7528 section \u2192 subsection \u2192 subsubsection \u2192 paragraph \u5C42\u7EA7\uFF1B\u65B9\u6CD5\u7EC6\u8282\u6309\u79D1\u5B66\u903B\u8F91\u800C\u975E\u4EE3\u7801\u7C7B\u540D\u7EC4\u7EC7\u3002",
            en: "Journal papers use section \u2192 subsection \u2192 subsubsection \u2192 paragraph; organize Method by scientific logic rather than code class names."
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
            zh: "\u5728 \\subsection{Datasets and Experimental Setup} \u5185\u5FC5\u987B\u4F9D\u6B21\u8BBE\u7F6E \\paragraph{Datasets}\u3001\\paragraph{Experimental Configuration} \u548C \\paragraph{Baselines} \u4E09\u4E2A\u5B50\u6807\u9898\uFF1B\u5176\u4ED6 paragraph \u53EA\u6709\u5728\u6750\u6599\u786E\u5B9E\u9700\u8981\u65F6\u624D\u80FD\u6DFB\u52A0\u3002",
            en: "Inside \\subsection{Datasets and Experimental Setup}, include \\paragraph{Datasets}, \\paragraph{Experimental Configuration}, and \\paragraph{Baselines} in that order. Add another paragraph heading only when the materials genuinely require it."
          },
          journal: {
            zh: "\u5728 \\subsection{Datasets and Experimental Setup} \u5185\u5FC5\u987B\u4F9D\u6B21\u8BBE\u7F6E \\subsubsection{Datasets}\u3001\\subsubsection{Experimental Configuration} \u548C \\subsubsection{Baselines}\uFF1B\u5176\u4ED6 subsubsection \u53EA\u6709\u5728\u6750\u6599\u786E\u5B9E\u9700\u8981\u65F6\u624D\u80FD\u6DFB\u52A0\u3002",
            en: "Inside \\subsection{Datasets and Experimental Setup}, include \\subsubsection{Datasets}, \\subsubsection{Experimental Configuration}, and \\subsubsection{Baselines} in that order. Add another subsubsection only when the materials genuinely require it."
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

\u62A5\u544A\u5FC5\u987B\u5305\u542B\uFF1A\u7EC8\u5BA1\u6458\u8981\u4E0E\u91CD\u5927\u4FEE\u6B63\u3001Terminology Consistency Table\u3001\u7F29\u5199\u9996\u6B21\u5B9A\u4E49\u4E0E\u5197\u4F59\u7F29\u5199\u8868\u3001Cross-Section Redundancy Matrix\u3001Claim\u2013Evidence \u8868\u3001\u6570\u5B57\u7EDF\u8BA1\u8868\u3001\u5F15\u7528\u952E\u4E0E\u8BED\u4E49\u652F\u6301\u5BA1\u8BA1\u3001\u56FE\u8868/\u516C\u5F0F/\u7B97\u6CD5/LaTeX \u5BA1\u8BA1\u3001\u5BA1\u7A3F\u4EBA\u653B\u51FB\u6D4B\u8BD5\u3001\u65E0\u6CD5\u901A\u8FC7\u6587\u5B57\u89E3\u51B3\u7684\u98CE\u9669\u3001\u8054\u7F51\u6838\u9A8C\u4E0E\u6700\u7EC8 BibTeX \u5EFA\u8BAE\u3001\u9010\u7AE0\u8282\u4FEE\u6539\u6E05\u5355\u548C\u6295\u7A3F\u76EE\u6807\u68C0\u7D22\u4EA4\u63A5\u6458\u8981\u3002`,
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

The report must contain the final-audit summary and major revisions, Terminology Consistency Table, first-definition and redundant-acronym table, Cross-Section Redundancy Matrix, Claim\u2013Evidence table, numeric/statistical table, citation-key and semantic-support audit, visual/equation/algorithm/LaTeX audit, reviewer attack test, risks prose cannot solve, web verification and final BibTeX suggestions, section-by-section revision log, and the submission-targeting handoff.`
    }
  },
  "venue-targeting": {
    core: {
      zh: `### \u672C\u8F6E\u7EDD\u5BF9\u8FB9\u754C

- \u4E0D\u5F97\u6539\u53D8 documentclass\u3001\u5B8F\u5305\u3001\u4F5C\u8005\u683C\u5F0F\u3001\u53C2\u8003\u6587\u732E\u683C\u5F0F\u3001\u5355\u53CC\u680F\u3001\u56FE\u8868\u6837\u5F0F\u3001\u9875\u8FB9\u8DDD\u6216\u4EFB\u4F55\u6A21\u677F\u5185\u5BB9\uFF1B
- \u4E0D\u5F97\u4E3A\u4E86\u5339\u914D venue \u6539\u5199\u6807\u9898\u3001\u6458\u8981\u3001Introduction\u3001\u7AE0\u8282\u540D\u3001\u53C2\u8003\u6587\u732E\u6216\u6B63\u6587\uFF1B
- \u4E0D\u5F97\u8F6C\u6362\u5230\u51FA\u7248\u793E\u6216\u4F1A\u8BAE\u6A21\u677F\uFF1B
- \u8BBA\u6587\u6587\u4EF6\u53EA\u4F5C\u4E3A\u53EA\u8BFB\u8F93\u5165\uFF1B\u4E0D\u5F97\u590D\u5236\u3001\u5F52\u6863\u3001\u91CD\u547D\u540D\u6216\u751F\u6210\u4EFB\u4F55 .tex\u3001.md \u6216\u5176\u4ED6\u4E0B\u8F7D\u6587\u4EF6\u3002\u53D1\u73B0\u660E\u786E\u9519\u8BEF\u53EA\u5728\u5F53\u524D\u5BF9\u8BDD\u4E2D\u63D0\u51FA\uFF1B
- \u672C\u8F6E\u4E0D\u518D\u751F\u6210\u65B0\u589E BibTeX\uFF0C\u91CD\u70B9\u662F\u76EE\u6807\u7B5B\u9009\u548C\u5B98\u7F51\u6838\u9A8C\u3002

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
- Do not create further BibTeX suggestions. This round focuses on targeting and official verification.

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
    ...template.fileNames ? [labels.fileNames, template.fileNames[language], ""] : [],
    labels.finalChecks,
    template.finalChecks[language]
  ].join("\n");
}

// content/prompts/pluginExport.ts
var RECONSTRUCTION_WORKFLOW_VERSION = "2026.07.3";
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
    placementId: input.frameworkFigure?.placementId ?? RECONSTRUCTION_OVERVIEW_FIGURE_PREFERENCES.placementId,
    aspectRatioId: input.frameworkFigure?.aspectRatioId ?? RECONSTRUCTION_OVERVIEW_FIGURE_PREFERENCES.aspectRatioId,
    customAspectWidth: input.frameworkFigure?.customAspectWidth ?? RECONSTRUCTION_OVERVIEW_FIGURE_PREFERENCES.customAspectWidth,
    customAspectHeight: input.frameworkFigure?.customAspectHeight ?? RECONSTRUCTION_OVERVIEW_FIGURE_PREFERENCES.customAspectHeight
  };
  if (!(frameworkFigure.placementId in FIGURE_PLACEMENTS)) {
    throw new Error(
      `Unsupported framework figure placement: ${String(frameworkFigure.placementId)}.`
    );
  }
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
    frameworkFigure
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
    frameworkFigure
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
      frameworkFigure
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
  RECONSTRUCTION_WORKFLOW_VERSION,
  buildReconstructionWorkflow
};
