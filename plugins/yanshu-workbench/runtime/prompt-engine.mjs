// content/prompts/chatExecution.ts
var CHAT_MODEL_POLICY = "latest-visible-reasoning";
var CHAT_FALLBACK_POLICY = "closest-lower-then-strongest";
var CHAT_PRO_FOLLOW_UP_PREFERENCE = "extra-high";
var CHAT_REASONING_PREFERENCE_IDS = [
  "strongest",
  "medium",
  "high",
  "extra-high",
  "pro"
];
var CHAT_RESULT_POLLING_POLICY = {
  strategy: "selected-reasoning-capability",
  intervalMsByCapability: {
    medium: 6e4,
    high: 6e4,
    "extra-high": 18e4,
    pro: 3e5
  },
  unknownIntervalMs: 6e4
};
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
      zh: "\u9ED8\u8BA4\u6BCF\u8F6E\u9996\u6B21\u6709\u6548\u5BF9\u8BDD\u4F7F\u7528 Pro\uFF0C\u540E\u7EED\u7EE7\u7EED\u3001\u7EA0\u6B63\u4E0E\u8865\u4EA4\u5207\u6362\u4E3A Extra High\uFF1B\u4E0D\u53EF\u7528\u65F6\u4ECD\u6309\u6700\u63A5\u8FD1\u6863\u4F4D\u56DE\u9000\u3002",
      en: "Use Pro for the first effective interaction of each round by default, then switch continuations, corrections, and resubmissions to Extra High; unavailable levels still fall back to the closest option."
    }
  }
};
var DEFAULT_CHAT_EXECUTION_PREFERENCES = {
  modelPolicy: CHAT_MODEL_POLICY,
  reasoningPreference: "strongest",
  forceProForAllTurns: false,
  fallbackPolicy: CHAT_FALLBACK_POLICY,
  pollingPolicy: CHAT_RESULT_POLLING_POLICY
};

// content/prompts/captionLength.ts
var CAPTION_LENGTH_POLICY = {
  defaultRange: [10, 40],
  min: 1,
  max: 120,
  step: 1
};
function normalizeCaptionWordRange(value) {
  if (!Array.isArray(value) || value.length < 2) {
    return CAPTION_LENGTH_POLICY.defaultRange;
  }
  const parsedMinimum = Number(value[0]);
  const parsedMaximum = Number(value[1]);
  if (!Number.isFinite(parsedMinimum) || !Number.isFinite(parsedMaximum)) {
    return CAPTION_LENGTH_POLICY.defaultRange;
  }
  const first = Math.min(
    CAPTION_LENGTH_POLICY.max,
    Math.max(CAPTION_LENGTH_POLICY.min, Math.round(parsedMinimum))
  );
  const second = Math.min(
    CAPTION_LENGTH_POLICY.max,
    Math.max(CAPTION_LENGTH_POLICY.min, Math.round(parsedMaximum))
  );
  return [Math.min(first, second), Math.max(first, second)];
}
function buildCaptionLengthGuidance(value, language) {
  const [minimum, maximum] = normalizeCaptionWordRange(value);
  return language === "zh" ? `\u6BCF\u6761 Caption \u5EFA\u8BAE\u7EA6 ${minimum}\u2013${maximum} words\u3002\u8BE5\u533A\u95F4\u53EA\u7528\u4E8E\u5E73\u8861\u7B80\u6D01\u4E0E\u81EA\u5305\u542B\u6027\uFF0C\u4E0D\u662F\u786C\u6027\u9650\u5236\uFF1B\u5F53\u8BF4\u660E\u5B50\u56FE\u3001\u5BF9\u8C61\u3001\u6761\u4EF6\u3001\u6307\u6807\u6216\u5FC5\u8981\u7EDF\u8BA1\u8BED\u4E49\u786E\u6709\u9700\u8981\u65F6\u53EF\u4EE5\u8D85\u51FA\uFF0C\u4E5F\u4E0D\u8981\u4E3A\u51D1\u8DB3\u4E0B\u9650\u673A\u68B0\u8865\u5199\u3002` : `Aim for roughly ${minimum}\u2013${maximum} words per caption. This range is advisory, balancing concision with self-containment rather than imposing a hard limit. Exceed it when panels, objects, conditions, metrics, or essential statistical semantics genuinely require more explanation, and never pad a caption merely to reach the lower bound.`;
}

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
    defaultMode: "none",
    defaultUnlimitedCoreSections: true,
    unlimitedSectionIds: WORD_COUNT_POLICY.unlimitedCoreSectionIds,
    visualWordEquivalent: WORD_COUNT_POLICY.visualWordEquivalent,
    min: 2e3,
    max: 2e4,
    step: 100
  },
  captionLength: CAPTION_LENGTH_POLICY,
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
        zh: "\u9AD8\u5BC6\u5EA6\u3001claim-first\uFF1A\u6BB5\u843D\u529F\u80FD\u96C6\u4E2D\u3001\u8FC7\u6E21\u7B80\u77ED\uFF0C\u4F18\u5148\u4FDD\u7559\u6838\u5FC3\u673A\u5236\u4E0E\u51B3\u5B9A\u6027\u8BC1\u636E\u3002",
        en: "Dense and claim-first, with focused paragraphs, short transitions, and priority given to core mechanisms and decisive evidence."
      },
      defaultTargetWords: 4500,
      defaultAppendix: true,
      defaultIncludeSectionNavigationSentence: false,
      appendixRule: {
        enabled: {
          zh: "\u5141\u8BB8\u9644\u5F55\uFF0C\u4F46\u4E0D\u80FD\u53EA\u4E3A\u547D\u4E2D\u5EFA\u8BAE\u5B57\u6570\u800C\u8F6C\u79FB\u5185\u5BB9\u3002\u6B63\u6587\u5DF2\u7ECF\u6E05\u695A\u3001\u5B8C\u6574\u4E14\u7ED3\u6784\u7D27\u51D1\u65F6\u65E0\u9700\u9644\u5F55\uFF1B\u53EA\u6709\u6750\u6599\u672C\u8EAB\u786E\u5C5E\u8865\u5145\u5185\u5BB9\u3001\u653E\u5165\u6B63\u6587\u4F1A\u524A\u5F31\u4E3B\u7EBF\u65F6\u624D\u79FB\u5165\u3002\u9644\u5F55\u4E0D\u8BA1\u5165\u6B63\u6587\u5EFA\u8BAE\u5B57\u6570\u3002",
          en: "An appendix is allowed, but never move content merely to hit a suggested length. Omit it when the main text is clear, complete, and focused; move material only when it is genuinely supplementary and would weaken the throughline in the main text. The appendix is excluded from suggested main-text length."
        },
        disabled: {
          zh: "\u4E0D\u4F7F\u7528\u9644\u5F55\u3002\u5173\u952E\u65B9\u6CD5\u3001\u5B9E\u9A8C\u7EC6\u8282\u4E0E\u5C40\u9650\u5E94\u5B8C\u6574\u4FDD\u7559\u5728\u6B63\u6587\uFF1B\u5FC5\u8981\u65F6\u53EF\u4EE5\u504F\u79BB\u5EFA\u8BAE\u7BC7\u5E45\uFF0C\u4E0D\u5F97\u4E3A\u51D1\u5B57\u6570\u5220\u9664\u6838\u5FC3\u5185\u5BB9\u3002",
          en: "No appendix. Keep essential method details, experimental evidence, and limitations complete in the main text; deviate from suggested lengths when necessary rather than deleting core content."
        }
      },
      structureNote: {
        zh: "\u53EA\u4E3A\u5185\u5BB9\u5145\u8DB3\u4E14\u79D1\u5B66\u4E0A\u72EC\u7ACB\u7684\u5355\u5143\u8BBE\u7F6E\u6807\u9898\uFF1B\u7B2C\u4E09\u5C42\u9700\u8981\u6807\u9898\u65F6\u4F7F\u7528 paragraph\u3002Related Work \u6BCF\u5C0F\u8282\u5355\u6BB5\uFF0CMethod \u4E0D\u5355\u8BBE Overview\u3002",
        en: "Create headings only for scientifically distinct units with enough substance; use paragraph when a third level is genuinely needed. Keep one paragraph per Related Work subsection and no standalone Method Overview."
      },
      emphasisNote: {
        zh: "\u4F18\u5148\u4FDD\u8BC1\u8D21\u732E\u8FA8\u8BC6\u5EA6\u3001\u57FA\u7EBF\u516C\u5E73\u6027\u3001\u6D88\u878D\u5B9E\u9A8C\u548C\u53EF\u590D\u73B0\u7EC6\u8282\u3002",
        en: "Prioritize contribution clarity, fair baselines, ablations, and reproducibility details."
      },
      plannerSummary: {
        zh: "\u7B2C\u4E09\u5C42\u4F7F\u7528 paragraph \u800C\u975E subsubsection\uFF1B\u5EFA\u8BAE\u5F15\u8A00\u7EA6 480 \u8BCD\u3001\u8BA8\u8BBA\u4E0E\u5C40\u9650\u7EA6\u5360 10%\u3001\u7ED3\u8BBA\u7EA6 200 \u8BCD\uFF0CMethod \u4E0D\u5355\u8BBE Overview\u3002",
        en: "Use paragraph rather than subsubsection for third-level headings; suggested references are about 480 words for Introduction, 10% for Discussion & Limitations, and 200 words for Conclusion, with no standalone Method Overview."
      },
      promptDirective: {
        zh: "\u91C7\u7528\u9AD8\u5BC6\u5EA6\u3001claim-first \u7684\u4F1A\u8BAE\u5199\u6CD5\uFF1A\u5C3D\u65E9\u5EFA\u7ACB\u95EE\u9898\u2014\u65B9\u6CD5\u2014\u8BC1\u636E\u95ED\u73AF\uFF0C\u6BCF\u6BB5\u627F\u62C5\u4E00\u4E2A\u4E3B\u8981\u8BBA\u8BC1\u529F\u80FD\uFF0C\u8FC7\u6E21\u7B80\u77ED\u4F46\u81EA\u7136\u3002\u53EA\u4E3A\u5185\u5BB9\u5145\u8DB3\u4E14\u79D1\u5B66\u4E0A\u72EC\u7ACB\u7684\u5355\u5143\u8BBE\u7F6E\u6807\u9898\uFF1B\u666E\u901A\u8BBA\u8FF0\u3001\u5C40\u90E8\u52A8\u673A\u548C\u9010\u56FE\u89E3\u91CA\u4FDD\u7559\u5728\u8FDE\u7EED\u6B63\u6587\u4E2D\u3002Related Work \u6BCF\u5C0F\u8282\u5355\u6BB5\uFF0CMethod \u4E0D\u5355\u8BBE Overview\uFF1B\u4E0D\u4EE5\u538B\u7F29\u6838\u5FC3 Method \u6216 Experiments and Results \u6362\u53D6\u8868\u9762\u7B80\u6D01\u3002",
        en: "Use a dense, claim-first conference style: establish the problem\u2013method\u2013evidence loop early, give each paragraph one main argumentative function, and keep transitions brief but natural. Create a heading only for a scientifically distinct unit with enough substance; keep local motivation and per-visual interpretation in continuous prose. Use one paragraph per Related Work subsection and no standalone Method Overview. Never obtain superficial brevity by compressing core Method or Experiments & Results content."
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
            en: "Three subsections with one ordinary paragraph each, focused on positioning-essential literature."
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
            zh: "\u7531\u8BBA\u6587\u5185\u5BB9\u51B3\u5B9A 3\u20135 \u4E2A\u8BA8\u8BBA\u4E0E\u5C40\u9650\u4E3B\u9898\uFF0C\u4E0D\u590D\u8FF0\u5B9E\u9A8C\u7ED3\u679C\u3002",
            en: "Let the paper determine three to five discussion-and-limitation themes without repeating results."
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
        zh: "\u7D2F\u79EF\u8BBA\u8BC1\u3001\u89E3\u91CA\u5145\u5206\uFF1A\u6269\u5C55\u7814\u7A76\u8109\u7EDC\u3001\u673A\u5236\u7406\u7531\u4E0E\u9002\u7528\u8FB9\u754C\uFF0C\u540C\u65F6\u4FDD\u6301\u514B\u5236\u548C\u8BC1\u636E\u5BC6\u5EA6\u3002",
        en: "Cumulative and explanatory, with fuller positioning, mechanism rationale, and scope boundaries while remaining restrained and evidence-dense."
      },
      defaultTargetWords: 5e3,
      defaultAppendix: false,
      defaultIncludeSectionNavigationSentence: true,
      appendixRule: {
        enabled: {
          zh: "\u5141\u8BB8\u9644\u5F55\uFF0C\u4F46\u4E0D\u80FD\u53EA\u4E3A\u547D\u4E2D\u5EFA\u8BAE\u5B57\u6570\u800C\u8F6C\u79FB\u5185\u5BB9\u3002\u6B63\u6587\u5DF2\u7ECF\u6E05\u695A\u3001\u5B8C\u6574\u4E14\u7ED3\u6784\u7D27\u51D1\u65F6\u65E0\u9700\u9644\u5F55\uFF1B\u53EA\u6709\u6750\u6599\u672C\u8EAB\u786E\u5C5E\u8865\u5145\u5185\u5BB9\uFF0C\u4E14\u79FB\u52A8\u540E\u4E0D\u5F71\u54CD\u590D\u73B0\u3001\u7ED3\u8BBA\u5224\u65AD\u4E0E\u79D1\u5B66\u4E3B\u7EBF\u65F6\u624D\u79FB\u5165\u3002\u9644\u5F55\u4E0D\u8BA1\u5165\u6B63\u6587\u5EFA\u8BAE\u5B57\u6570\u3002",
          en: "An appendix is allowed, but never move content merely to hit a suggested length. Omit it when the main text is clear, complete, and focused; move material only when it is genuinely supplementary and reproducibility, claim assessment, and the scientific throughline remain intact. The appendix is excluded from suggested main-text length."
        },
        disabled: {
          zh: "\u9ED8\u8BA4\u4E0D\u8BBE\u9644\u5F55\u3002\u7814\u7A76\u80CC\u666F\u3001\u65B9\u6CD5\u7EC6\u8282\u3001\u7A33\u5065\u6027\u5206\u6790\u548C\u5C40\u9650\u5E94\u6574\u5408\u8FDB\u6B63\u6587\u3002",
          en: "No appendix by default. Integrate research context, methodological detail, robustness checks, and limitations into the main text."
        }
      },
      structureNote: {
        zh: "\u76EE\u5F55\u5C42\u7EA7\u901A\u5E38\u6B62\u4E8E subsubsection\uFF0C\u4F46\u53EA\u6709\u5185\u5BB9\u5145\u8DB3\u4E14\u79D1\u5B66\u4E0A\u72EC\u7ACB\u65F6\u624D\u589E\u52A0\u6807\u9898\u3002Method \u5355\u8BBE\u53CC\u6BB5 Overview\uFF0C\u5EFA\u8BAE\u63A7\u5236\u5728 80 \u8BCD\u5DE6\u53F3\u3002",
        en: "Usually stop at subsubsection, but add a heading only for a scientifically distinct unit with enough substance. Use a standalone two-paragraph Method Overview, with about 80 words as an optional reference."
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
        zh: "\u91C7\u7528\u7D2F\u79EF\u8BBA\u8BC1\u578B\u671F\u520A\u5199\u6CD5\uFF1A\u7ED9\u4E88\u7814\u7A76\u8109\u7EDC\u3001\u673A\u5236\u7406\u7531\u3001\u8BC1\u636E\u8FB9\u754C\u548C\u7EFC\u5408\u8BA8\u8BBA\u5145\u5206\u7A7A\u95F4\uFF0C\u5E76\u7528\u6E05\u695A\u8FC7\u6E21\u8FDE\u63A5\u6BB5\u843D\u3002\u76EE\u5F55\u901A\u5E38\u6B62\u4E8E subsubsection\uFF0C\u4F46\u53EA\u4E3A\u5185\u5BB9\u5145\u8DB3\u4E14\u79D1\u5B66\u4E0A\u72EC\u7ACB\u7684\u5355\u5143\u589E\u52A0\u6807\u9898\uFF1B\u5C40\u90E8\u52A8\u673A\u548C\u9010\u56FE\u89E3\u91CA\u7559\u5728\u6B63\u6587\u3002Method \u5355\u8BBE\u4E24\u4E2A\u666E\u901A\u6BB5\u843D\u7684 Overview\uFF0C\u5EFA\u8BAE\u7EA6 80 \u8BCD\u4E14\u4E0D\u590D\u8FF0\u6846\u67B6\u56FE\uFF1B\u4E0D\u538B\u7F29\u6838\u5FC3 Method \u6216 Experiments and Results\u3002",
        en: "Use a cumulative journal style with sufficient space for positioning, mechanism rationale, evidence boundaries, and synthesis, connected by clear paragraph transitions. Usually stop at subsubsection, but create a heading only for a scientifically distinct unit with enough substance; keep local motivation and per-visual interpretation in prose. Give Method a standalone two-paragraph Overview, using about 80 words as an optional reference without narrating the framework figure, and do not compress core Method or Experiments & Results content."
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
    subtitle: "\u9009\u62E9\u8BBA\u6587\u7C7B\u578B\u3001\u53EF\u9009\u7BC7\u5E45\u5EFA\u8BAE\u4E0E\u9644\u5F55\u89C4\u5219\uFF0C\u518D\u4F7F\u7528\u4E94\u6B65 Prompt \u5B8C\u6210\u6DF1\u5EA6\u7CBE\u4FEE\u3002",
    generalPreset: "\u901A\u7528\u4EA7\u54C1\u9884\u8BBE \xB7 \u975E venue \u5B98\u65B9\u8981\u6C42",
    language: "\u7F51\u7AD9\u8BED\u8A00",
    chinese: "\u4E2D\u6587",
    english: "English",
    paperStyle: "\u8BBA\u6587\u98CE\u683C",
    targetWords: "\u5EFA\u8BAE\u6B63\u6587\u53C2\u8003\u503C",
    targetWordsHint: "\u5F00\u542F\u540E\u663E\u793A\u53EF\u9009\u7AE0\u8282\u5EFA\u8BAE\uFF1B\u53EF\u6839\u636E\u8BBA\u6587\u5185\u5BB9\u91C7\u7EB3\u3001\u8C03\u6574\u6216\u5FFD\u7565\u3002\u9644\u5F55\u4E0D\u8BA1\u5165\u6B63\u6587\uFF0C\u6BCF\u5F20\u8868\u683C\u6216\u56FE\u7247\u6309 200 \u8BCD\u4F30\u7B97\u3002",
    wordLimitOn: "\u542F\u7528\u7BC7\u5E45\u5EFA\u8BAE",
    wordLimitOff: "\u9ED8\u8BA4\u4E0D\u8BBE\u7BC7\u5E45\u5EFA\u8BAE",
    noWordLimitHint: "\u9ED8\u8BA4\u72B6\u6001\u3002\u5173\u95ED\u540E\u4E0D\u663E\u793A\u7AE0\u8282\u5EFA\u8BAE\uFF0C\u4E94\u6B65 Prompt \u4E5F\u4E0D\u5305\u542B\u6B63\u6587\u603B\u6570\u6216\u7AE0\u8282\u7BC7\u5E45\u6570\u5B57\u3002",
    introNavigation: "Introduction \u7AE0\u8282\u5BFC\u822A\u6BB5",
    introNavigationOn: "\u4FDD\u7559\u7EA6 65 \u8BCD\u5BFC\u822A\u6BB5",
    introNavigationOff: "\u4E0D\u5199\u7AE0\u8282\u5BFC\u822A\u6BB5",
    introNavigationHint: "\u4F1A\u8BAE\u9ED8\u8BA4\u5173\u95ED\uFF0C\u671F\u520A\u9ED8\u8BA4\u5F00\u542F\uFF1B\u542F\u7528\u65F6\u7EA6 65 \u8BCD\u3001\u5355\u72EC\u6210\u6BB5\u4E14\u4E0D\u8BA1\u5165 Introduction \u5EFA\u8BAE\u5B57\u6570\u3002",
    words: "\u8BCD",
    appendix: "\u9644\u5F55\u8BBE\u7F6E",
    appendixOn: "\u5141\u8BB8\u9644\u5F55",
    appendixOff: "\u4E0D\u542B\u9644\u5F55",
    captionLength: "Caption \u5EFA\u8BAE\u957F\u5EA6",
    captionLengthMinimum: "\u6700\u5C11",
    captionLengthMaximum: "\u6700\u591A",
    captionLengthHint: "\u9ED8\u8BA4 10\u201340 words\uFF0C\u4EC5\u7528\u4E8E\u5E73\u8861\u7B80\u6D01\u4E0E\u81EA\u5305\u542B\u6027\uFF1B\u5FC5\u8981\u65F6\u5141\u8BB8\u8D85\u51FA\uFF0C\u4E0D\u4F1A\u4F5C\u4E3A\u9A8C\u6536\u6216\u62A5\u9519\u6761\u4EF6\u3002",
    frameworkFigure: "\u603B\u4F53\u6846\u67B6\u56FE",
    frameworkRatio: "\u753B\u5E03\u6BD4\u4F8B",
    frameworkCustomWidth: "\u5BBD",
    frameworkCustomHeight: "\u9AD8",
    frameworkFixedRules: "\u5176\u4F59\u89C4\u5219\u91C7\u7528\u65B9\u6CD5\u603B\u89C8\u63A8\u8350\u914D\u7F6E\uFF1A\u7EAF\u767D\u753B\u5E03\uFF1BTol \u9C9C\u660E\u8272\u7CFB\uFF0C\u6309\u8BED\u4E49\u4ECE 2\u20134 \u79CD\u5F3A\u8C03\u8272\u4E2D\u9009\u62E9\u6700\u5C11\u591F\u7528\u6570\u91CF\uFF1BCalibri\uFF1B\u5173\u952E\u533A\u57DF\u6781\u6D45\u5E95\u8272\uFF1B\u4E09\u7EA7\u5B57\u53F7\uFF1B\u65E0\u5927\u6807\u9898\uFF1B\u6DF1\u8272\u4E2D\u6027\u7EBF\uFF1B\u53EF\u6309\u9700\u4F7F\u7528\u4E0E\u8BBA\u6587\u5BF9\u8C61\u76F4\u63A5\u5BF9\u5E94\u7684\u7B80\u5316\u79D1\u5B66\u56FE\u5F62\uFF0C\u4E0D\u4F7F\u7528\u4EBA\u7269\u6F2B\u753B\u3001\u5409\u7965\u7269\u6216\u8425\u9500\u63D2\u753B\u3002",
    chatExecution: "ChatGPT \u6267\u884C",
    chatModelPolicy: "\u6A21\u578B\u7B56\u7565",
    chatLatestVisibleModel: "\u6700\u65B0\u53EF\u7528\u63A8\u7406\u6A21\u578B",
    chatReasoningPreference: "\u63A8\u7406\u7B49\u7EA7",
    chatProStrategy: "Pro \u5BF9\u8BDD\u7B56\u7565",
    chatProFirstTurnOnly: "\u6BCF\u8F6E\u9996\u6B21\u4F7F\u7528 Pro\uFF0C\u540E\u7EED\u4F7F\u7528 Extra High",
    chatProForceAll: "\u5F3A\u5236\u6240\u6709\u5BF9\u8BDD\u4F7F\u7528 Pro",
    chatProFirstTurnHint: "\u63A8\u8350\u3002Pro \u901A\u5E38\u8017\u65F6\u8F83\u957F\uFF1B\u6BCF\u8F6E\u9996\u6B21\u6709\u6548\u63D0\u4EA4\u4F7F\u7528 Pro\uFF0C\u540C\u8F6E\u7EE7\u7EED\u3001\u7EA0\u6B63\u548C\u8865\u4EA4\u81EA\u52A8\u5207\u6362\u4E3A Extra High\u3002",
    chatProForceAllHint: "\u5F3A\u5236\u5168\u90E8 Pro \u4F1A\u663E\u8457\u5EF6\u957F\u4E94\u8F6E\u6D41\u7A0B\uFF0C\u5C24\u5176\u662F\u7EED\u5199\u3001\u7EA0\u6B63\u4E0E\u4EA7\u7269\u8865\u4EA4\u3002",
    chatPollingInterval: "\u7ED3\u679C\u68C0\u67E5\u95F4\u9694",
    chatPollingAuto: "\u6309\u5B9E\u9645\u6863\u4F4D\u81EA\u52A8\u91C7\u7528\uFF1AMedium / High 1 \u5206\u949F\uFF0CExtra High 3 \u5206\u949F\uFF0CPro 5 \u5206\u949F\uFF1B\u65E0\u6CD5\u8BC6\u522B\u65F6\u6309 1 \u5206\u949F\u3002",
    chatRuntimePolicy: "\u4E0D\u9501\u5B9A GPT \u578B\u53F7\u540D\u79F0\uFF1B\u63D2\u4EF6\u6BCF\u8F6E\u8BFB\u53D6 ChatGPT \u5F53\u524D\u53EF\u89C1\u9009\u9879\u3002\u53D1\u751F\u56DE\u9000\u65F6\u5148\u660E\u786E\u63D0\u793A\uFF0C\u540D\u79F0\u65E0\u6CD5\u5224\u65AD\u65F6\u9009\u62E9\u6700\u5F3A\u53EF\u7528\u6863\u4F4D\u3002",
    exportAutomation: "\u5BFC\u51FA\u684C\u9762\u914D\u7F6E",
    exportedAutomation: "\u914D\u7F6E\u5DF2\u4E0B\u8F7D",
    exportAutomationHint: "\u4E0B\u8F7D\u5F53\u524D\u8BBA\u6587\u7C7B\u578B\u3001\u7BC7\u5E45\u5EFA\u8BAE\u3001\u7AE0\u8282\u3001\u9644\u5F55\u3001Caption \u5EFA\u8BAE\u3001\u6846\u67B6\u56FE\u3001ChatGPT \u63A8\u7406\u504F\u597D\u548C Prompt \u8BED\u8A00\u8BBE\u7F6E\uFF0C\u4F9B YanShu \u63D2\u4EF6\u76F4\u63A5\u8BFB\u53D6\u3002",
    resetDefaults: "\u6062\u590D\u9ED8\u8BA4\u914D\u7F6E",
    resetHint: "\u91CD\u7F6E\u8BBA\u6587\u7C7B\u578B\u3001\u7BC7\u5E45\u5EFA\u8BAE\u3001\u9644\u5F55\u3001Caption \u5EFA\u8BAE\u3001\u6846\u67B6\u56FE\u3001ChatGPT \u63A8\u7406\u504F\u597D\u548C\u7AE0\u8282\u5EFA\u8BAE\uFF1B\u4FDD\u7559\u5F53\u524D\u8BED\u8A00\u3002",
    plannerTitle: "\u6B63\u6587\u4E0E\u7AE0\u8282\u7BC7\u5E45\u5EFA\u8BAE",
    plannerBody: "\u6240\u6709\u6570\u503C\u4EC5\u4F9B\u53C2\u8003\uFF0C\u53EF\u6309\u8BBA\u6587\u5185\u5BB9\u63A5\u53D7\u3001\u8C03\u6574\u6216\u5FFD\u7565\uFF1B\u65B9\u6CD5\u548C\u5B9E\u9A8C\u9ED8\u8BA4\u4E0D\u8BBE\u7F6E\u5EFA\u8BAE\u8303\u56F4\u3002",
    targetTotal: "\u5EFA\u8BAE\u6B63\u6587\u53C2\u8003\u503C",
    unlimitedMainText: "\u4E0D\u8BBE\u6B63\u6587\u603B\u5EFA\u8BAE",
    limitedSectionsTotal: "\u6709\u5EFA\u8BAE\u7AE0\u8282\u5408\u8BA1",
    unlimitedCoreSections: "\u65B9\u6CD5\u548C\u5B9E\u9A8C\u4E0D\u8BBE\u7F6E\u5EFA\u8BAE\u5B57\u6570",
    unlimitedCoreSectionsHint: "\u5F00\u542F\u540E\u4E0D\u63D0\u4F9B\u6B63\u6587\u603B\u5EFA\u8BAE\uFF0C\u4EC5\u4E3A\u5176\u4ED6\u7AE0\u8282\u751F\u6210\u53EF\u9009\u53C2\u8003\u8303\u56F4\u3002",
    unlimitedSection: "\u65E0\u5EFA\u8BAE",
    visualCountingRule: `\u5EFA\u8BAE\u4F30\u7B97\u89C4\u5219\uFF1A\u6BCF\u5F20\u8868\u683C\u6216\u56FE\u7247\u6309 ${WORD_COUNT_POLICY.visualWordEquivalent} \u8BCD\u8BA1\u5165\u6240\u5728\u7AE0\u8282\u53CA\u6B63\u6587\u53C2\u8003\u503C\u3002`,
    resetAllocation: "\u6309\u6BD4\u4F8B\u91CD\u7B97",
    presetAllocation: "\u9884\u8BBE\u6BD4\u4F8B",
    customAllocation: "\u81EA\u5B9A\u4E49\u5206\u914D",
    budget: "\u5EFA\u8BAE\u5B57\u6570",
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
    promptTarget: "\u6B63\u6587\u7BC7\u5E45\u5EFA\u8BAE",
    promptAppendix: "\u9644\u5F55",
    promptSections: "\u7AE0\u8282\u5EFA\u8BAE",
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
    subtitle: "Choose the paper type, optional length guidance, appendix rule, and overview layout, then deeply refine the manuscript with five prompts.",
    generalPreset: "General product preset \xB7 not an official venue rule",
    language: "Site language",
    chinese: "\u4E2D\u6587",
    english: "English",
    paperStyle: "Paper style",
    targetWords: "Suggested main-text reference",
    targetWordsHint: "When enabled, optional section suggestions appear; accept, adjust, or ignore them according to the paper. The appendix is excluded, and each table or figure is estimated as 200 words.",
    wordLimitOn: "Enable length guidance",
    wordLimitOff: "No length guidance by default",
    noWordLimitHint: "This is the default. Section suggestions are hidden, and all five prompts omit main-text and section-length numbers.",
    introNavigation: "Introduction roadmap paragraph",
    introNavigationOn: "Include an \u224865-word roadmap",
    introNavigationOff: "No roadmap paragraph",
    introNavigationHint: "Off by default for conferences and on for journals; when enabled, it is a separate \u224865-word paragraph excluded from the suggested Introduction length.",
    words: "words",
    appendix: "Appendix",
    appendixOn: "Appendix allowed",
    appendixOff: "No appendix",
    captionLength: "Suggested caption length",
    captionLengthMinimum: "Minimum",
    captionLengthMaximum: "Maximum",
    captionLengthHint: "The default is 10\u201340 words. It balances concision and self-containment, may be exceeded when necessary, and is never an acceptance or error condition.",
    frameworkFigure: "Overall framework figure",
    frameworkRatio: "Canvas ratio",
    frameworkCustomWidth: "Width",
    frameworkCustomHeight: "Height",
    frameworkFixedRules: "All other controls use the Method Overview recommendation: a pure-white canvas; Tol Vibrant with the smallest sufficient set from a 2\u20134 accent range; Calibri; extremely pale fills for key regions; three type-size levels; no large title; dark-neutral lines; restrained paper-specific scientific forms when useful, with no character cartoons, mascots, or marketing illustration.",
    chatExecution: "ChatGPT execution",
    chatModelPolicy: "Model policy",
    chatLatestVisibleModel: "Latest available reasoning model",
    chatReasoningPreference: "Reasoning level",
    chatProStrategy: "Pro interaction policy",
    chatProFirstTurnOnly: "Pro for the first interaction of each round; Extra High afterward",
    chatProForceAll: "Force Pro for every interaction",
    chatProFirstTurnHint: "Recommended. Pro can take much longer: use it for the first effective submission of each round, then switch continuations, corrections, and artifact follow-ups to Extra High.",
    chatProForceAllHint: "Forcing Pro throughout can substantially extend the five-round workflow, especially during continuations, corrections, and artifact follow-ups.",
    chatPollingInterval: "Result-check interval",
    chatPollingAuto: "Resolved from the level actually selected: Medium / High 1 minute, Extra High 3 minutes, and Pro 5 minutes; unknown labels use 1 minute.",
    chatRuntimePolicy: "GPT model names are never pinned. The plugin inspects the options currently visible in ChatGPT for every round, announces any fallback, and chooses the strongest available level when labels cannot be interpreted.",
    exportAutomation: "Export desktop config",
    exportedAutomation: "Config downloaded",
    exportAutomationHint: "Download the current paper type, optional length guidance, section, appendix, caption guidance, framework-figure, ChatGPT reasoning preference, and prompt-language settings for the YanShu plugin.",
    resetDefaults: "Restore defaults",
    resetHint: "Resets paper type, length guidance, appendix, caption guidance, framework figure, ChatGPT reasoning preference, and section suggestions while keeping the current language.",
    plannerTitle: "Main-text and section length guidance",
    plannerBody: "Every value is optional guidance that may be accepted, adjusted, or ignored according to the paper; Method and Experiments receive no suggestion by default.",
    targetTotal: "Suggested main-text reference",
    unlimitedMainText: "No main-text suggestion",
    limitedSectionsTotal: "Sections with guidance",
    unlimitedCoreSections: "No suggested length for Method or Experiments",
    unlimitedCoreSectionsHint: "When enabled, no main-text total is suggested and only the other sections receive optional reference ranges.",
    unlimitedSection: "No suggestion",
    visualCountingRule: `Guidance estimate: each table or figure counts as ${WORD_COUNT_POLICY.visualWordEquivalent} words toward its section and the suggested main-text reference.`,
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
    promptBoundary: "Boundary: do not invent facts, citations, data, or venue rules. Mark anything that cannot be verified.",
    github: "GitHub repository",
    clipboardError: "Copy failed. Expand the card and select the text manually."
  }
};

// app/figures/extendedFigureAdapters.ts
var EXTENDED_FIGURE_TYPE_ADAPTERS = {
  "task-definition": {
    zh: `\u672C\u6B21\u7ED8\u5236\u4EFB\u52A1\u5B9A\u4E49\u56FE\uFF1A\u51C6\u786E\u8BF4\u660E\u7814\u7A76\u5BF9\u8C61\u3001\u53EF\u89C2\u5BDF\u8F93\u5165\u3001\u76EE\u6807\u8F93\u51FA\u3001\u5B9E\u4F53\u5173\u7CFB\u4E0E\u4EFB\u52A1\u8FB9\u754C\u3002

\u4ECE Problem Formulation\u3001Task Definition \u6216 Method \u7684\u6B63\u5F0F\u5B9A\u4E49\u4E2D\u53D6\u8BC1\u3002\u9009\u62E9\u6700\u5408\u9002\u7684\u5B9E\u4F8B\u6620\u5C04\u3001\u5B9E\u4F53\u5173\u7CFB\u3001\u96C6\u5408\u6620\u5C04\u6216\u72B6\u6001\u2014\u52A8\u4F5C\u7ED3\u6784\uFF0C\u8BA9\u8BFB\u8005\u65E0\u9700\u4E86\u89E3\u5B9E\u73B0\u7EC6\u8282\u5C31\u80FD\u590D\u8FF0\u4EFB\u52A1\u3002`,
    en: `Create a Task Definition figure that precisely explains the research objects, observable inputs, target outputs, entity relations, and task boundary.

Use the formal definitions in Problem Formulation, Task Definition, or Method. Choose the clearest representative mapping, entity-relation view, set mapping, or state-action structure so readers can restate the task without knowing the implementation.`
  },
  "training-inference": {
    zh: `\u672C\u6B21\u7ED8\u5236\u8BAD\u7EC3\u2013\u63A8\u7406\u56FE\uFF1A\u533A\u5206\u8BAD\u7EC3\u4E13\u5C5E\u3001\u63A8\u7406\u4E13\u5C5E\u548C\u4E24\u8005\u5171\u4EAB\u7684\u90E8\u5206\uFF0C\u5E76\u8BF4\u660E\u6570\u636E\u3001\u53C2\u6570\u6216\u72B6\u6001\u600E\u6837\u4F20\u9012\u3002

\u4F18\u5148\u4F7F\u7528\u4E0A\u4E0B\u53CC\u8F68\u6216\u5171\u4EAB\u4E2D\u5FC3\u7ED3\u6784\uFF1B\u660E\u786E\u76D1\u7763\u4FE1\u53F7\u3001\u53C2\u6570\u66F4\u65B0\u4E0E\u90E8\u7F72\u65F6\u771F\u5B9E\u4FDD\u7559\u7684\u8DEF\u5F84\u3002\u53EA\u6709\u8BBA\u6587\u786E\u5B9E\u5B58\u5728\u5FAA\u73AF\u6216\u53CD\u9988\u65F6\u624D\u753B\u56DE\u8DEF\u3002`,
    en: `Create a Training\u2013Inference figure that separates training-only, inference-only, and shared elements while tracing data, parameters, or state across both phases.

Prefer parallel lanes or a shared-center structure. Make supervision, parameter updates, and the actual deployment path explicit. Show a loop only when the paper truly defines one.`
  },
  "algorithm-protocol": {
    zh: `\u672C\u6B21\u7ED8\u5236\u7B97\u6CD5\uFF0F\u534F\u8BAE\u56FE\uFF1A\u5448\u73B0\u521D\u59CB\u5316\u3001\u89C2\u5BDF\u3001\u51B3\u7B56\u3001\u66F4\u65B0\u3001\u53CD\u9988\u4E0E\u505C\u6B62\u6761\u4EF6\u3002

\u6839\u636E\u8BBA\u6587\u9009\u62E9\u72B6\u6001\u673A\u3001\u5FAA\u73AF\u6D41\u7A0B\u3001\u65F6\u5E8F\u56FE\u6216\u4EA4\u4E92\u534F\u8BAE\u3002\u7A81\u51FA\u6539\u53D8\u72B6\u6001\u7684\u5173\u952E\u51B3\u7B56\u548C\u7EC8\u6B62\u903B\u8F91\uFF1B\u666E\u901A\u8FDE\u7EED\u6B65\u9AA4\u53EF\u5408\u5E76\uFF0C\u53C2\u4E0E\u65B9\u4E0E\u6D88\u606F\u65B9\u5411\u5FC5\u987B\u660E\u786E\u3002`,
    en: `Create an Algorithm / Protocol figure that shows initialization, observation, decision, update, feedback, and termination.

Choose a state machine, iterative flow, sequence diagram, or interaction protocol according to the paper. Emphasize state-changing decisions and stopping logic; merge routine adjacent steps, and make actors and message directions unambiguous.`
  },
  "data-construction": {
    zh: `\u672C\u6B21\u7ED8\u5236\u6570\u636E\u6784\u5EFA\u56FE\uFF1A\u8FFD\u8E2A\u6570\u636E\u6765\u6E90\u3001\u7B5B\u9009\u6216\u6E05\u6D17\u3001\u8F6C\u6362\u3001\u6807\u6CE8\u3001\u8D28\u91CF\u63A7\u5236\u548C\u6700\u7EC8\u6837\u672C\u7ED3\u6784\u3002

\u8BA9\u8BFB\u8005\u80FD\u5224\u65AD\u6BCF\u4E00\u6B65\u6539\u53D8\u4E86\u4EC0\u4E48\uFF0C\u4EE5\u53CA\u54EA\u4E9B\u6B65\u9AA4\u4F1A\u7B5B\u9664\u6216\u5206\u6D41\u6570\u636E\u3002\u7528\u4EE3\u8868\u6027\u6570\u636E\u5BF9\u8C61\u6216\u6837\u4F8B\u8F85\u52A9\u7406\u89E3\uFF1B\u53EA\u6709\u8BBA\u6587\u63D0\u4F9B\u6570\u5B57\u65F6\u624D\u663E\u793A\u6570\u91CF\u3002`,
    en: `Create a Data Construction figure that traces provenance, filtering or cleaning, transformation, annotation, quality control, and the final sample structure.

Make clear what each stage changes and where data is filtered or branched. Use representative data objects or examples when helpful, and show counts only when the paper provides them.`
  },
  "system-deployment": {
    zh: `\u672C\u6B21\u7ED8\u5236\u7CFB\u7EDF\uFF0F\u90E8\u7F72\u56FE\uFF1A\u8BF4\u660E\u8FD0\u884C\u5B9E\u4F53\u3001\u90E8\u7F72\u8FB9\u754C\u3001\u79BB\u7EBF\u51C6\u5907\u3001\u5728\u7EBF\u670D\u52A1\u548C\u901A\u4FE1\u5173\u7CFB\u3002

\u4F18\u5148\u91C7\u7528\u5E26\u8FB9\u754C\u7684\u7CFB\u7EDF\u62D3\u6251\u6216\u79BB\u7EBF\uFF0F\u5728\u7EBF\u53CC\u533A\u7ED3\u6784\u3002\u6E05\u695A\u533A\u5206\u5B58\u50A8\u3001\u8BA1\u7B97\u3001\u5BA2\u6237\u7AEF\u3001\u670D\u52A1\u7AEF\u4E0E\u5916\u90E8\u7CFB\u7EDF\uFF0C\u5E76\u6807\u660E\u5173\u952E\u6D88\u606F\u6216\u6570\u636E\u6D41\u5411\u3002`,
    en: `Create a System / Deployment figure that explains runtime entities, deployment boundaries, offline preparation, online serving, and communication.

Prefer a bounded system topology or an offline/online split. Clearly distinguish storage, computation, clients, servers, and external systems, and label the important message or data directions.`
  },
  "theory-concept": {
    zh: `\u672C\u6B21\u7ED8\u5236\u7406\u8BBA\uFF0F\u6982\u5FF5\u5173\u7CFB\u56FE\uFF1A\u51C6\u786E\u8868\u8FBE\u5F62\u5F0F\u5BF9\u8C61\u4E4B\u95F4\u7684\u5305\u542B\u3001\u4F9D\u8D56\u3001\u7B49\u4EF7\u3001\u5206\u89E3\u3001\u7EA6\u675F\u6216\u63A8\u5BFC\u5173\u7CFB\u3002

\u4ECE\u5B9A\u4E49\u3001\u547D\u9898\u6216\u5B9A\u7406\u4E2D\u9009\u62E9\u6700\u5408\u9002\u7684\u96C6\u5408\u5173\u7CFB\u3001\u4F9D\u8D56\u56FE\u3001\u63A8\u5BFC\u94FE\u6216\u6982\u5FF5\u683C\u3002\u89C6\u89C9\u7F16\u7801\u5FC5\u987B\u4E0E\u5173\u7CFB\u7C7B\u578B\u4E00\u81F4\uFF1B\u4E0D\u8981\u628A\u76F8\u5173\u6027\u753B\u6210\u56E0\u679C\u5173\u7CFB\u3002`,
    en: `Create a Theory / Concept Relations figure that accurately represents inclusion, dependency, equivalence, decomposition, constraint, or derivation among formal objects.

Choose a set relation, dependency graph, derivation chain, or concept lattice from the paper's definitions, propositions, or theorems. Match visual encoding to the actual relation type and never turn association into causality.`
  },
  "geometry-coordinate": {
    zh: `\u672C\u6B21\u7ED8\u5236\u51E0\u4F55\uFF0F\u5750\u6807\u5173\u7CFB\u56FE\uFF1A\u5C55\u793A\u5750\u6807\u7CFB\u3001\u7A7A\u95F4\u5B9E\u4F53\u3001\u5DF2\u77E5\u4E0E\u672A\u77E5\u53D8\u6362\u3001\u6295\u5F71\u5173\u7CFB\u4EE5\u53CA\u4F30\u8BA1\u76EE\u6807\u3002

\u4F7F\u7528\u6E05\u695A\u7684\u5750\u6807\u6846\u67B6\u3001\u51E0\u4F55\u5BF9\u8C61\u3001\u89C6\u9525\u6216\u6295\u5F71\u8DEF\u5F84\u3002\u533A\u5206\u53C2\u8003\u7CFB\u5E76\u4FDD\u6301\u7BAD\u5934\u65B9\u5411\u3001\u4E0B\u6807\u548C\u53D8\u6362\u8BB0\u53F7\u4E0E\u8BBA\u6587\u4E00\u81F4\uFF1B\u53EA\u753B\u7406\u89E3\u76EE\u6807\u6240\u9700\u7684\u51E0\u4F55\u5143\u7D20\u3002`,
    en: `Create a Geometry / Coordinate figure that shows coordinate frames, spatial entities, known and unknown transforms, projection relations, and the estimation target.

Use clean coordinate frames, geometric objects, frusta, or projection paths. Distinguish reference frames and preserve the paper's arrow directions, subscripts, and transform notation. Draw only the geometry needed to understand the target.`
  },
  "survey-taxonomy": {
    zh: `\u672C\u6B21\u7ED8\u5236\u7EFC\u8FF0\uFF0F\u5206\u7C7B\u4F53\u7CFB\u56FE\uFF1A\u7EC4\u7EC7\u8BBA\u6587\u91C7\u7528\u7684\u5206\u7C7B\u8F74\u3001\u4E3B\u8981\u7C7B\u522B\u3001\u4EA4\u53C9\u5173\u7CFB\u548C\u7531\u6B63\u6587\u652F\u6301\u7684\u7814\u7A76\u7A7A\u767D\u3002

\u6839\u636E\u771F\u5B9E\u5206\u7C7B\u7ED3\u6784\u9009\u62E9\u6811\u3001\u4E8C\u7EF4\u77E9\u9635\u3001\u5206\u5C42\u7248\u56FE\u6216\u591A\u8F74\u5730\u56FE\u3002\u7C7B\u522B\u91CD\u53E0\u65F6\u5FC5\u987B\u5982\u5B9E\u8868\u8FBE\uFF0C\u4E0D\u8981\u5F3A\u884C\u753B\u6210\u4E92\u65A5\u6811\uFF1B\u4EE3\u8868\u6027\u65B9\u6CD5\u540D\u53EA\u7528\u4E8E\u5E2E\u52A9\u5B9A\u4F4D\u3002`,
    en: `Create a Survey / Taxonomy figure that organizes the paper's classification axes, principal categories, overlaps, and evidence-backed gaps.

Choose a tree, two-dimensional matrix, layered landscape, or multi-axis map according to the actual taxonomy. Represent overlapping categories honestly instead of forcing an exclusive tree; use representative method names only as anchors.`
  }
};

// app/figures/promptArchitecture.ts
var COMMON_BASE = {
  zh: (figureTypeLabel, hasReferenceImage) => `\u4F60\u662F\u4E00\u540D\u9762\u5411\u8BA1\u7B97\u673A\u79D1\u5B66\u8BBA\u6587\u7684\u79D1\u7814\u914D\u56FE\u4E13\u5BB6\u3002\u6211\u4F1A\u63D0\u4F9B\u8BBA\u6587\u7684 \`.tex\` \u548C\u53EF\u9009\u7684 \`.pdf\`\u3002${hasReferenceImage ? "\u6211\u8FD8\u4F1A\u53E6\u884C\u63D0\u4F9B\u53C2\u8003\u56FE\u7247\u6216\u660E\u786E\u6807\u6CE8\u7684\u7ED8\u56FE\u8349\u7A3F\u3002" : ""}

\u5F00\u59CB\u524D\uFF0C\u8BF7\u8054\u7F51\u6838\u67E5\u4E0E\u672C\u8BBA\u6587\u4E3B\u9898\u6700\u63A5\u8FD1\u7684\u9876\u4F1A\u6216\u9876\u520A\u8BBA\u6587\uFF0C\u91CD\u70B9\u89C2\u5BDF\u5176\u4E2D\u4E0E\u672C\u6B21\u4EFB\u52A1\u76F8\u540C\u7684\u201C${figureTypeLabel}\u201D\u3002\u7528 2\u20134 \u70B9\u603B\u7ED3\u53EF\u501F\u9274\u7684\u6784\u56FE\u3001\u4FE1\u606F\u5C42\u7EA7\u548C\u89C6\u89C9\u8BED\u6CD5\uFF1B\u53EA\u5438\u6536\u901A\u7528\u8868\u8FBE\u65B9\u6CD5\uFF0C\u4E0D\u590D\u5236\u5177\u4F53\u5185\u5BB9\u6216\u54C1\u724C\u89C6\u89C9\u3002\u82E5\u5F53\u524D\u65E0\u6CD5\u8054\u7F51\uFF0C\u8BF7\u660E\u786E\u8BF4\u660E\uFF0C\u5E76\u4EC5\u4F9D\u636E\u5DF2\u63D0\u4F9B\u6750\u6599\u7EE7\u7EED\u3002

${hasReferenceImage ? "\u5982\u6709\u53E6\u884C\u63D0\u4F9B\u7684\u56FE\u7247\uFF0C\u9ED8\u8BA4\u4EC5\u4F5C\u4E3A\u89C6\u89C9\u6837\u5F0F\u53C2\u8003\uFF1A\u6982\u62EC\u5176\u6784\u56FE\u3001\u914D\u8272\u3001\u7EBF\u6761\u3001\u5B57\u4F53\u4E0E\u6574\u4F53\u89C6\u89C9\u8BED\u8A00\uFF0C\u5E76\u5728\u4E0E\u5F53\u524D\u89C6\u89C9\u914D\u7F6E\u517C\u5BB9\u65F6\u501F\u9274\uFF1B\u53EA\u6709\u5F53\u6211\u660E\u786E\u6807\u6CE8\u67D0\u5F20\u56FE\u7247\u4E3A\u201C\u7ED8\u56FE\u8349\u7A3F\u201D\u65F6\uFF0C\u624D\u53EF\u5C06\u5176\u5185\u90E8\u7ED3\u6784\u4F5C\u4E3A\u5185\u5BB9\u7EBF\u7D22\uFF0C\u5E76\u4ECD\u987B\u4F9D\u636E\u8BBA\u6587\u6750\u6599\u9010\u9879\u6838\u9A8C\u3002\n\n" : ""}\u5B8C\u6574\u9605\u8BFB\u6750\u6599\u540E\u518D\u8BBE\u8BA1\u3002\u4EE5 \`.tex\` \u4E3A\u65B9\u6CD5\u540D\u3001\u6A21\u5757\u540D\u3001\u7F29\u5199\u3001\u6570\u5B66\u7B26\u53F7\u548C\u7ED3\u6784\u7684\u4E3B\u8981\u4F9D\u636E\uFF0C\u4EE5 \`.pdf\` \u7406\u89E3\u4E0A\u4E0B\u6587\u548C\u73B0\u6709\u56FE\u8868\u3002\u56FE\u4E2D\u672F\u8BED\u5FC5\u987B\u4E0E\u8BBA\u6587\u9010\u5B57\u7B26\u4E00\u81F4\uFF0C\u53EA\u5448\u73B0\u8BBA\u6587\u8BC1\u636E\u652F\u6301\u7684\u5173\u7CFB\u3002

\u5148\u786E\u5B9A\u8FD9\u5F20\u56FE\u7684\u552F\u4E00\u4E3B\u65E8\u548C\u4E3B\u8981\u9605\u8BFB\u8DEF\u5F84\uFF0C\u518D\u9009\u62E9\u6700\u7B26\u5408\u8BBA\u6587\u5BF9\u8C61\u7684\u89C6\u89C9\u8868\u8FBE\uFF0C\u4F8B\u5982 token\u3001matrix\u3001graph\u3001feature map\u3001state\u3001timeline\u3001coordinate frame \u6216\u4EE3\u8868\u6027\u6837\u4F8B\u3002\u4E0D\u8981\u628A\u6574\u5F20\u56FE\u753B\u6210\u6587\u5B57\u5361\u7247\uFF1B\u6807\u7B7E\u4F7F\u7528\u7B80\u77ED\u82F1\u6587\uFF0C\u4FDD\u8BC1\u7F29\u5C0F\u5230\u8BBA\u6587\u5C3A\u5BF8\u540E\u4ECD\u6E05\u695A\uFF0C\u5E76\u8BA9\u753B\u9762\u7D27\u51D1\u800C\u4E0D\u8FC7\u5EA6\u62E5\u6324\u3002`,
  en: (figureTypeLabel, hasReferenceImage) => `You are a scientific-figure specialist for computer-science papers. I will provide the paper's \`.tex\` and, when available, its \`.pdf\`.${hasReferenceImage ? " I will also supply reference images or an explicitly labeled figure draft." : ""}

Before designing, browse leading conference or journal papers closest to this paper's topic and inspect figures serving the same \u201C${figureTypeLabel}\u201D role. Summarize 2\u20134 transferable observations about composition, information hierarchy, and visual grammar. Borrow only general presentation patterns, never specific content or brand styling. If browsing is unavailable, say so and continue only from the supplied materials.

${hasReferenceImage ? "Treat any separately supplied image only as a visual-style reference by default: summarize its composition, palette, line work, typography, and overall visual language, and borrow compatible elements within the current visual configuration. Only when I explicitly label an image as a \u201Cfigure draft\u201D may its internal structure be used as a content cue, and every such cue must still be verified against the paper.\n\n" : ""}Read the materials before designing. Treat the \`.tex\` as the primary source for method names, module names, abbreviations, mathematical symbols, and structure; use the \`.pdf\` for context and existing figures. Every term in the image must match the paper exactly, and every relationship must be supported by the paper.

Choose one visual thesis and one main reading path, then use visual objects that fit the paper\u2014such as tokens, matrices, graphs, feature maps, states, timelines, coordinate frames, or representative examples. Do not reduce the figure to text boxes. Use short English labels, keep it legible at paper size, and compose a compact but uncrowded canvas.`
};
var CORE_FIGURE_TYPE_ADAPTERS = {
  introduction: {
    zh: `\u672C\u6B21\u7ED8\u5236\u5F15\u8A00\u56FE\uFF1A\u8BA9\u8BFB\u8005\u76F4\u89C2\u770B\u5230\u7814\u7A76\u573A\u666F\u3001\u5F53\u524D\u4ECD\u5B58\u5728\u7684\u5173\u952E\u95EE\u9898\uFF0C\u4EE5\u53CA\u672C\u6587\u5E26\u6765\u7684\u65B0\u89C2\u5BDF\u6216\u89E3\u51B3\u539F\u5219\u3002

\u56F4\u7ED5\u4E00\u7EC4\u6E05\u695A\u7684\u201C\u73B0\u72B6\uFF0F\u5931\u8D25\u60C5\u5F62 \u2192 \u95EE\u9898\u672C\u8D28 \u2192 \u672C\u6587\u8F6C\u53D8\u201D\u7EC4\u7EC7\u753B\u9762\u3002\u4F18\u5148\u4F7F\u7528\u4EE3\u8868\u6027\u573A\u666F\u6216\u5BF9\u6BD4\u5173\u7CFB\uFF0C\u4E0D\u5C55\u5F00\u5B8C\u6574\u65B9\u6CD5\u6D41\u6C34\u7EBF\uFF0C\u4E5F\u4E0D\u653E\u5B9E\u9A8C\u7ED3\u679C\u3002`,
    en: `Create an Introduction figure that makes the research setting, the key problem that still exists today, and the paper's new observation or solution principle immediately clear.

Organize the image around one readable \u201Ccurrent situation or failure \u2192 underlying problem \u2192 paper's shift\u201D story. Prefer representative scenes or a meaningful comparison. Do not expand the full method pipeline or include experimental results.`
  },
  "method-overview": {
    zh: `\u672C\u6B21\u7ED8\u5236\u65B9\u6CD5\u603B\u89C8\u56FE\uFF1A\u56DE\u7B54\u8F93\u5165\u662F\u4EC0\u4E48\u3001\u4E3B\u8981\u9636\u6BB5\u6216\u7EC4\u4EF6\u5982\u4F55\u534F\u4F5C\u3001\u4FE1\u606F\u600E\u6837\u6D41\u52A8\uFF0C\u4EE5\u53CA\u8F93\u51FA\u662F\u4EC0\u4E48\u3002

\u5148\u6839\u636E\u8BBA\u6587\u5224\u65AD\u5B83\u66F4\u9002\u5408 pipeline\u3001\u5206\u5C42\u67B6\u6784\u3001\u53CC\u6D41\u4EA4\u4E92\u3001\u8FED\u4EE3\u73AF\u3001\u5171\u4EAB\u9AA8\u5E72\u6216\u5176\u4ED6\u771F\u5B9E\u7ED3\u6784\u3002\u53EA\u4FDD\u7559\u4E00\u6761\u4E3B\u8981\u9605\u8BFB\u8DEF\u5F84\uFF1B\u8BA9\u5165\u53E3\u3001\u8F93\u51FA\u548C\u8BBA\u6587\u4E2D\u6709\u8BC1\u636E\u652F\u6301\u7684 novel module \u6210\u4E3A\u4E09\u4E2A\u6E05\u695A\u7684\u89C6\u89C9\u951A\u70B9\uFF0C\u5176\u4E2D novel module \u83B7\u5F97\u6700\u660E\u786E\u7684\u89C6\u89C9\u5F3A\u8C03\u3002\u901A\u7528\u7EC4\u4EF6\u5F31\u5316\uFF0C\u5BB9\u5668\u5D4C\u5957\u4E0D\u8D85\u8FC7\u4E24\u5C42\u3002`,
    en: `Create a Method Overview figure that answers what enters the method, how the main stages or components work together, how information moves, and what is produced.

Infer the truthful visual form from the paper: a pipeline, layered architecture, dual-stream interaction, iterative loop, shared backbone, or another real structure. Keep one main reading path with three clear anchors: entry, output, and the paper-supported novel module. Give the novel module the clearest visual emphasis, de-emphasize routine components, and keep container nesting to at most two levels.`
  },
  "technical-detail": {
    zh: `\u672C\u6B21\u7ED8\u5236\u6838\u5FC3\u673A\u5236\u7EC6\u8282\u56FE\uFF1A\u4ECE\u8BBA\u6587\u4E2D\u9009\u62E9\u4E00\u4E2A\u533A\u522B\u4E8E\u65B9\u6CD5\u603B\u89C8\u3001\u6700\u503C\u5F97\u5355\u72EC\u89E3\u91CA\u7684\u521B\u65B0\u673A\u5236\u3002

\u805A\u7126\u8BE5\u673A\u5236\u7684\u5C40\u90E8\u8F93\u5165\u3001\u4E2D\u95F4\u8868\u793A\u3001\u5173\u952E\u64CD\u4F5C\u548C\u5C40\u90E8\u8F93\u51FA\u3002\u628A\u6700\u96BE\u4EC5\u9760\u4E00\u53E5\u8BDD\u89E3\u91CA\u7684\u53D8\u6362\u6216\u4EA4\u4E92\u753B\u6E05\u695A\uFF1B\u53EA\u8865\u5145\u7406\u89E3\u8BE5\u673A\u5236\u6240\u5FC5\u9700\u7684\u516C\u5F0F\u6216\u7B26\u53F7\uFF0C\u4E0D\u91CD\u590D\u6574\u7BC7\u65B9\u6CD5\u6D41\u7A0B\u3002`,
    en: `Create a Core Mechanism Detail figure for the single most important novel mechanism that deserves explanation beyond the Method Overview.

Focus on its local input, intermediate representation, decisive operation, and local output. Visualize the transformation or interaction that prose alone cannot explain well. Include only the equations or symbols needed to understand this mechanism, and do not repeat the full method pipeline.`
  }
};
var FIGURE_TYPE_ADAPTERS = {
  ...CORE_FIGURE_TYPE_ADAPTERS,
  ...EXTENDED_FIGURE_TYPE_ADAPTERS
};
function buildDirectProtocol(language, outputFileName) {
  if (language === "zh") {
    return `\u6267\u884C\u65B9\u5F0F\uFF1A\u76F4\u63A5\u7ED8\u56FE\u3002\u8BF7\u5145\u5206\u601D\u8003\u8BBA\u6587\u5185\u5BB9\u3001\u4FE1\u606F\u5C42\u7EA7\u3001\u6784\u56FE\u4E0E\u89C6\u89C9\u7EC6\u8282\uFF0C\u518D\u7ED8\u5236\u4E00\u5F20\u6587\u5B57\u6E05\u6670\u3001\u7EC6\u8282\u9510\u5229\u3001\u9002\u5408\u8BBA\u6587\u6392\u7248\u7684\u8D85\u9AD8\u6E05\u79D1\u7814\u914D\u56FE\u3002\u751F\u6210\u540E\u6838\u5BF9\u672F\u8BED\u3001\u7BAD\u5934\u65B9\u5411\u3001\u7ED3\u6784\u5173\u7CFB\u548C\u7F29\u5C0F\u540E\u7684\u53EF\u8BFB\u6027\u3002${outputFileName ? ` \u6700\u7EC8\u56FE\u7247\u4FDD\u5B58\u4E3A \`${outputFileName}\`\u3002` : ""}`;
  }
  return `Execution mode: draw directly. Think through the paper content, information hierarchy, composition, and visual details as thoroughly as needed, then render an ultra-high-resolution scientific figure with crisp details and legible text for publication. After generation, verify terminology, arrow directions, structural relationships, and legibility at paper size.${outputFileName ? ` Save it as \`${outputFileName}\`.` : ""}`;
}
function buildPromptFirstProtocol(language, hasReferenceImage, outputFileName) {
  if (language === "zh") {
    return `\u6267\u884C\u65B9\u5F0F\uFF1A\u5148\u770B Prompt\uFF0C\u672C\u8F6E\u4E0D\u8981\u751F\u6210\u56FE\u7247\u3002\u53EA\u8F93\u51FA\u4E24\u90E8\u5206\uFF1A

REFERENCE STYLE SUMMARY
\u7528 2\u20134 \u70B9\u6982\u62EC\u540C\u7C7B\u9876\u4F1A\u6216\u9876\u520A\u56FE\u7247${hasReferenceImage ? "\u4EE5\u53CA\u6240\u63D0\u4F9B\u53C2\u8003\u56FE" : ""}\u4E2D\u53EF\u501F\u9274\u7684\u89C6\u89C9\u65B9\u6CD5\u3002

FINAL IMAGE PROMPT
\u5728\u4E00\u4E2A \`text\` \u4EE3\u7801\u5757\u4E2D\u7ED9\u51FA\u5B8C\u6574\u82F1\u6587\u751F\u56FE Prompt\uFF0C\u53EA\u9700\u4F9D\u6B21\u5199\u6E05\uFF1A\u56FE\u7684\u4E3B\u65E8\u4E0E\u6784\u56FE\u3001\u79D1\u5B66\u5BF9\u8C61\u4E0E\u4FE1\u606F\u6D41\u3001\u7CBE\u786E\u6807\u7B7E\u3001\u89C6\u89C9\u8BBE\u7F6E\u3002\u4E0D\u8981\u8F93\u51FA\u63A8\u7406\u8FC7\u7A0B\u6216\u5907\u9009\u65B9\u6848\u3002

\u7136\u540E\u505C\u6B62\uFF0C\u7B49\u5F85\u6211\u8F93\u5165\u201C\u5F00\u59CB\u7ED8\u56FE\u201D\u3002\u6536\u5230\u540E\u8BF7\u5145\u5206\u601D\u8003\u8BBA\u6587\u5185\u5BB9\u3001\u4FE1\u606F\u5C42\u7EA7\u3001\u6784\u56FE\u4E0E\u89C6\u89C9\u7EC6\u8282\uFF0C\u518D\u4F9D\u636E\u8FD9\u4EFD Prompt \u7ED8\u5236\u4E00\u5F20\u6587\u5B57\u6E05\u6670\u3001\u7EC6\u8282\u9510\u5229\u3001\u9002\u5408\u8BBA\u6587\u6392\u7248\u7684\u8D85\u9AD8\u6E05\u79D1\u7814\u914D\u56FE\uFF0C\u5E76\u6838\u5BF9\u672F\u8BED\u3001\u7ED3\u6784\u3001\u7BAD\u5934\u548C\u53EF\u8BFB\u6027\u3002${outputFileName ? ` \u6700\u7EC8\u56FE\u7247\u4FDD\u5B58\u4E3A \`${outputFileName}\`\u3002` : ""}`;
  }
  return `Execution mode: prompt first. Do not generate an image in this response. Output only:

REFERENCE STYLE SUMMARY
Give 2\u20134 transferable observations from comparable figures in leading conference or journal papers${hasReferenceImage ? " and the supplied reference images" : ""}.

FINAL IMAGE PROMPT
Provide one complete English image-generation prompt in a \`text\` code block. Cover only the visual thesis and composition, scientific objects and flow, exact labels, and visual settings. Do not expose reasoning or alternatives.

Then stop and wait for \u201CStart drawing\u201D or \u201C\u5F00\u59CB\u7ED8\u56FE\u201D. After that instruction, think through the paper content, information hierarchy, composition, and visual details as thoroughly as needed, then use this prompt to render an ultra-high-resolution scientific figure with crisp details and legible text for publication; verify terminology, structure, arrows, and legibility.${outputFileName ? ` Save it as \`${outputFileName}\`.` : ""}`;
}
var OUTPUT_PROTOCOL = {
  zh: ({
    executionMode,
    hasReferenceImage,
    outputFileName
  }) => executionMode === "direct" ? buildDirectProtocol("zh", outputFileName) : buildPromptFirstProtocol("zh", hasReferenceImage, outputFileName),
  en: ({
    executionMode,
    hasReferenceImage,
    outputFileName
  }) => executionMode === "direct" ? buildDirectProtocol("en", outputFileName) : buildPromptFirstProtocol("en", hasReferenceImage, outputFileName)
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
    executionMode: "direct",
    hasReferenceImage: false,
    aspectRatioId: "landscape-16-9",
    customAspectWidth: 16,
    customAspectHeight: 9,
    paletteId: "tol-vibrant",
    fontFamilyId: "calibri",
    lineColorMode: "semantic",
    accentColorMin: 2,
    accentColorMax: 4,
    allowLightIllustrations: true,
    cardFillPolicyId: "semantic-regions",
    fontSizeLevels: 3,
    includeLargeTitle: false
  },
  "task-definition": {
    promptId: "task-definition",
    executionMode: "direct",
    hasReferenceImage: false,
    aspectRatioId: "landscape-3-2",
    customAspectWidth: 3,
    customAspectHeight: 2,
    paletteId: "tol-vibrant",
    fontFamilyId: "calibri",
    lineColorMode: "semantic",
    accentColorMin: 2,
    accentColorMax: 4,
    allowLightIllustrations: true,
    cardFillPolicyId: "semantic-regions",
    fontSizeLevels: 3,
    includeLargeTitle: false
  },
  "method-overview": {
    promptId: "method-overview",
    executionMode: "direct",
    hasReferenceImage: false,
    aspectRatioId: "landscape-2-1",
    customAspectWidth: 2,
    customAspectHeight: 1,
    paletteId: "tol-vibrant",
    fontFamilyId: "calibri",
    lineColorMode: "neutral",
    accentColorMin: 2,
    accentColorMax: 4,
    allowLightIllustrations: true,
    cardFillPolicyId: "key-regions",
    fontSizeLevels: 3,
    includeLargeTitle: false
  },
  "technical-detail": {
    promptId: "technical-detail",
    executionMode: "direct",
    hasReferenceImage: false,
    aspectRatioId: "landscape-4-3",
    customAspectWidth: 4,
    customAspectHeight: 3,
    paletteId: "tol-vibrant",
    fontFamilyId: "calibri",
    lineColorMode: "neutral",
    accentColorMin: 2,
    accentColorMax: 4,
    allowLightIllustrations: false,
    cardFillPolicyId: "key-regions",
    fontSizeLevels: 3,
    includeLargeTitle: false
  },
  "training-inference": {
    promptId: "training-inference",
    executionMode: "direct",
    hasReferenceImage: false,
    aspectRatioId: "landscape-2-1",
    customAspectWidth: 2,
    customAspectHeight: 1,
    paletteId: "tol-vibrant",
    fontFamilyId: "calibri",
    lineColorMode: "semantic",
    accentColorMin: 2,
    accentColorMax: 4,
    allowLightIllustrations: false,
    cardFillPolicyId: "key-regions",
    fontSizeLevels: 3,
    includeLargeTitle: false
  },
  "algorithm-protocol": {
    promptId: "algorithm-protocol",
    executionMode: "direct",
    hasReferenceImage: false,
    aspectRatioId: "landscape-3-2",
    customAspectWidth: 3,
    customAspectHeight: 2,
    paletteId: "tol-vibrant",
    fontFamilyId: "calibri",
    lineColorMode: "semantic",
    accentColorMin: 2,
    accentColorMax: 4,
    allowLightIllustrations: false,
    cardFillPolicyId: "key-regions",
    fontSizeLevels: 3,
    includeLargeTitle: false
  },
  "data-construction": {
    promptId: "data-construction",
    executionMode: "direct",
    hasReferenceImage: false,
    aspectRatioId: "landscape-2-1",
    customAspectWidth: 2,
    customAspectHeight: 1,
    paletteId: "tol-vibrant",
    fontFamilyId: "calibri",
    lineColorMode: "semantic",
    accentColorMin: 2,
    accentColorMax: 4,
    allowLightIllustrations: true,
    cardFillPolicyId: "semantic-regions",
    fontSizeLevels: 3,
    includeLargeTitle: false
  },
  "system-deployment": {
    promptId: "system-deployment",
    executionMode: "direct",
    hasReferenceImage: false,
    aspectRatioId: "landscape-16-9",
    customAspectWidth: 16,
    customAspectHeight: 9,
    paletteId: "tol-bright",
    fontFamilyId: "calibri",
    lineColorMode: "semantic",
    accentColorMin: 2,
    accentColorMax: 4,
    allowLightIllustrations: false,
    cardFillPolicyId: "semantic-regions",
    fontSizeLevels: 3,
    includeLargeTitle: false
  },
  "theory-concept": {
    promptId: "theory-concept",
    executionMode: "direct",
    hasReferenceImage: false,
    aspectRatioId: "landscape-4-3",
    customAspectWidth: 4,
    customAspectHeight: 3,
    paletteId: "tol-muted",
    fontFamilyId: "calibri",
    lineColorMode: "neutral",
    accentColorMin: 2,
    accentColorMax: 4,
    allowLightIllustrations: false,
    cardFillPolicyId: "key-regions",
    fontSizeLevels: 3,
    includeLargeTitle: false
  },
  "geometry-coordinate": {
    promptId: "geometry-coordinate",
    executionMode: "direct",
    hasReferenceImage: false,
    aspectRatioId: "landscape-3-2",
    customAspectWidth: 3,
    customAspectHeight: 2,
    paletteId: "tol-vibrant",
    fontFamilyId: "calibri",
    lineColorMode: "semantic",
    accentColorMin: 2,
    accentColorMax: 4,
    allowLightIllustrations: true,
    cardFillPolicyId: "key-regions",
    fontSizeLevels: 3,
    includeLargeTitle: false
  },
  "survey-taxonomy": {
    promptId: "survey-taxonomy",
    executionMode: "direct",
    hasReferenceImage: false,
    aspectRatioId: "landscape-3-2",
    customAspectWidth: 3,
    customAspectHeight: 2,
    paletteId: "tol-bright",
    fontFamilyId: "calibri",
    lineColorMode: "semantic",
    accentColorMin: 2,
    accentColorMax: 4,
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
var FIGURE_ACCENT_COLOR_COUNT_MIN = 1;
var FIGURE_ACCENT_COLOR_COUNT_MAX = 4;
function normalizeFigureAccentColorCount(value, fallback) {
  const normalized = Number.isFinite(value) ? Math.round(value) : fallback;
  return Math.min(
    FIGURE_ACCENT_COLOR_COUNT_MAX,
    Math.max(FIGURE_ACCENT_COLOR_COUNT_MIN, normalized)
  );
}
function getFigureAccentColorRange(preferences) {
  const requestedMin = normalizeFigureAccentColorCount(
    preferences.accentColorMin,
    2
  );
  const requestedMax = normalizeFigureAccentColorCount(
    preferences.accentColorMax,
    4
  );
  const min = Math.min(requestedMin, requestedMax);
  const max = Math.max(requestedMin, requestedMax);
  return {
    min,
    max,
    label: `${min}\u2013${max}`
  };
}
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
var FIGURE_PROMPTS = {
  introduction: {
    label: {
      zh: "\u5F15\u8A00\u56FE",
      en: "Introduction figure"
    },
    purpose: {
      zh: "\u5448\u73B0\u73B0\u6709\u7406\u89E3\u7684\u5173\u952E\u4E0D\u8DB3\uFF0C\u4EE5\u53CA\u672C\u6587\u5E26\u6765\u7684\u79D1\u5B66\u89C2\u5BDF\u6216\u89E3\u51B3\u539F\u5219\u3002",
      en: "Show the decisive limitation in current understanding and the paper\u2019s new observation or solution principle."
    },
    intent: {
      zh: "\u4E3A\u4EC0\u4E48\u73B0\u6709\u7406\u89E3\u6216\u65B9\u6CD5\u4E0D\u591F\uFF1F",
      en: "Why is the current understanding or method insufficient?"
    }
  },
  "task-definition": {
    label: {
      zh: "\u4EFB\u52A1\u5B9A\u4E49\u56FE",
      en: "Task definition"
    },
    purpose: {
      zh: "\u5F62\u5F0F\u5316\u8BF4\u660E\u7814\u7A76\u5BF9\u8C61\u3001\u8F93\u5165\u8F93\u51FA\u3001\u5B9E\u4F53\u5173\u7CFB\u548C\u4EFB\u52A1\u8FB9\u754C\u3002",
      en: "Formalize the research objects, inputs, outputs, entity relations, and task boundary."
    },
    intent: {
      zh: "\u7814\u7A76\u4EFB\u52A1\u7A76\u7ADF\u662F\u4EC0\u4E48\uFF1F",
      en: "What exactly is the research task?"
    }
  },
  "method-overview": {
    label: {
      zh: "\u65B9\u6CD5\u603B\u89C8\u56FE",
      en: "Method overview"
    },
    purpose: {
      zh: "\u5EFA\u7ACB\u4ECE\u8F93\u5165\u3001\u5171\u4EAB\u8BA1\u7B97\u4E0E\u6838\u5FC3\u9636\u6BB5\u5230\u6B63\u5F0F\u8F93\u51FA\u7684\u6574\u4F53\u5FC3\u667A\u5730\u56FE\u3002",
      en: "Build a system-level map from input and shared computation through the core stages to the formal output."
    },
    intent: {
      zh: "\u6574\u4F53\u65B9\u6CD5\u600E\u6837\u8FD0\u884C\uFF1F",
      en: "How does the overall method run?"
    }
  },
  "technical-detail": {
    label: {
      zh: "\u6838\u5FC3\u673A\u5236\u7EC6\u8282\u56FE",
      en: "Core mechanism detail"
    },
    purpose: {
      zh: "\u5256\u5F00\u5C55\u793A\u4E00\u4E2A\u6700\u5173\u952E\u7684\u65B0\u673A\u5236\u5185\u90E8\u5982\u4F55\u53D8\u6362\u3001\u9009\u62E9\u3001\u4EA4\u4E92\u6216\u66F4\u65B0\u3002",
      en: "Open up one decisive new mechanism to show how it transforms, selects, interacts, or updates internally."
    },
    intent: {
      zh: "\u5C40\u90E8\u6838\u5FC3\u673A\u5236\u600E\u6837\u5DE5\u4F5C\uFF1F",
      en: "How does the local core mechanism work?"
    }
  },
  "training-inference": {
    label: {
      zh: "\u8BAD\u7EC3\u2013\u63A8\u7406\u56FE",
      en: "Training\u2013inference"
    },
    purpose: {
      zh: "\u533A\u5206\u8BAD\u7EC3\u4E13\u5C5E\u3001\u63A8\u7406\u4E13\u5C5E\u4E0E\u5171\u4EAB\u90E8\u5206\uFF0C\u8BF4\u660E\u53C2\u6570\u548C\u4FE1\u606F\u5728\u4E24\u4E2A\u9636\u6BB5\u5982\u4F55\u6D41\u52A8\u3002",
      en: "Separate training-only, inference-only, and shared elements while tracing parameters and information across both phases."
    },
    intent: {
      zh: "\u65B9\u6CD5\u600E\u6837\u8BAD\u7EC3\uFF0C\u53C8\u600E\u6837\u63A8\u7406\uFF1F",
      en: "How is the method trained and then used for inference?"
    }
  },
  "algorithm-protocol": {
    label: {
      zh: "\u7B97\u6CD5\uFF0F\u534F\u8BAE\u56FE",
      en: "Algorithm / protocol"
    },
    purpose: {
      zh: "\u8BF4\u660E\u8FC7\u7A0B\u5982\u4F55\u521D\u59CB\u5316\u3001\u89C2\u5BDF\u3001\u51B3\u7B56\u3001\u66F4\u65B0\u3001\u53CD\u9988\u5E76\u6EE1\u8DB3\u505C\u6B62\u6761\u4EF6\u3002",
      en: "Show how a process initializes, observes, decides, updates, feeds back, and reaches a stopping condition."
    },
    intent: {
      zh: "\u8FC7\u7A0B\u600E\u6837\u8FED\u4EE3\u3001\u51B3\u7B56\u4E0E\u505C\u6B62\uFF1F",
      en: "How does the process iterate, decide, and stop?"
    }
  },
  "data-construction": {
    label: {
      zh: "\u6570\u636E\u6784\u5EFA\u56FE",
      en: "Data construction"
    },
    purpose: {
      zh: "\u5448\u73B0\u6570\u636E\u6765\u6E90\u3001\u6E05\u6D17\u8F6C\u6362\u3001\u6807\u6CE8\u534F\u4F5C\u3001\u8D28\u91CF\u63A7\u5236\u548C\u6700\u7EC8\u6837\u672C\u7ED3\u6784\u3002",
      en: "Trace data provenance, cleaning and transformation, annotation, quality control, and the final sample schema."
    },
    intent: {
      zh: "\u6570\u636E\u4ECE\u54EA\u91CC\u6765\u3001\u600E\u6837\u6784\u5EFA\uFF1F",
      en: "Where does the data come from and how is it constructed?"
    }
  },
  "system-deployment": {
    label: {
      zh: "\u7CFB\u7EDF\uFF0F\u90E8\u7F72\u56FE",
      en: "System / deployment"
    },
    purpose: {
      zh: "\u8868\u8FBE\u8FD0\u884C\u5B9E\u4F53\u3001\u90E8\u7F72\u8FB9\u754C\u3001\u901A\u4FE1\u8BED\u4E49\uFF0C\u4EE5\u53CA\u79BB\u7EBF\u51C6\u5907\u548C\u5728\u7EBF\u670D\u52A1\u7684\u5206\u79BB\u3002",
      en: "Map runtime entities, deployment boundaries, communication semantics, and the separation of offline preparation from online serving."
    },
    intent: {
      zh: "\u7CFB\u7EDF\u5728\u54EA\u91CC\u8FD0\u884C\u3001\u600E\u6837\u901A\u4FE1\uFF1F",
      en: "Where does the system run and how does it communicate?"
    }
  },
  "theory-concept": {
    label: {
      zh: "\u7406\u8BBA\uFF0F\u6982\u5FF5\u5173\u7CFB\u56FE",
      en: "Theory / concept relations"
    },
    purpose: {
      zh: "\u51C6\u786E\u8868\u8FBE\u5F62\u5F0F\u5BF9\u8C61\u4E4B\u95F4\u7684\u5305\u542B\u3001\u4F9D\u8D56\u3001\u7B49\u4EF7\u3001\u5206\u89E3\u3001\u7EA6\u675F\u6216\u63A8\u5BFC\u5173\u7CFB\u3002",
      en: "Represent inclusion, dependency, equivalence, decomposition, constraint, or derivation among formal objects."
    },
    intent: {
      zh: "\u5F62\u5F0F\u5BF9\u8C61\u4E0E\u6982\u5FF5\u4E4B\u95F4\u662F\u4EC0\u4E48\u5173\u7CFB\uFF1F",
      en: "How are the formal objects and concepts related?"
    }
  },
  "geometry-coordinate": {
    label: {
      zh: "\u51E0\u4F55\uFF0F\u5750\u6807\u5173\u7CFB\u56FE",
      en: "Geometry / coordinates"
    },
    purpose: {
      zh: "\u51C6\u786E\u5C55\u793A\u5750\u6807\u7CFB\u3001\u7A7A\u95F4\u5B9E\u4F53\u3001\u5DF2\u77E5\u4E0E\u672A\u77E5\u53D8\u6362\u3001\u6295\u5F71\u5173\u7CFB\u548C\u4F30\u8BA1\u76EE\u6807\u3002",
      en: "Show coordinate frames, spatial entities, known and unknown transforms, projections, and the estimation target."
    },
    intent: {
      zh: "\u7A7A\u95F4\u3001\u5750\u6807\u4E0E\u53D8\u6362\u5173\u7CFB\u662F\u4EC0\u4E48\uFF1F",
      en: "What are the spatial, coordinate, and transformation relations?"
    }
  },
  "survey-taxonomy": {
    label: {
      zh: "\u7EFC\u8FF0\uFF0F\u5206\u7C7B\u4F53\u7CFB\u56FE",
      en: "Survey / taxonomy"
    },
    purpose: {
      zh: "\u7EC4\u7EC7\u7EFC\u8FF0\u4E2D\u7684\u5206\u7C7B\u8F74\u3001\u7C7B\u522B\u5173\u7CFB\u3001\u7814\u7A76\u8DEF\u7EBF\u548C\u7531\u6B63\u6587\u652F\u6301\u7684\u7248\u56FE\u7A7A\u767D\u3002",
      en: "Organize survey dimensions, category relations, research paths, and evidence-backed gaps in the landscape."
    },
    intent: {
      zh: "\u6587\u732E\u5E94\u5F53\u5982\u4F55\u5206\u7C7B\u4E0E\u5173\u8054\uFF1F",
      en: "How should the literature be classified and connected?"
    }
  }
};
function buildVisualConfiguration(preferences, language) {
  const selectedAspectRatio = getFigureAspectRatio(preferences);
  const palette = FIGURE_COLOR_PALETTES[preferences.paletteId];
  const fontFamily = FIGURE_FONT_FAMILIES[preferences.fontFamilyId];
  const accentRange = getFigureAccentColorRange(preferences);
  const cardFillPolicy = FIGURE_CARD_FILL_POLICIES[preferences.cardFillPolicyId];
  const candidateColors = palette.colors.slice(0, accentRange.max).join(", ");
  const linePolicy = preferences.lineColorMode === "semantic" ? language === "zh" ? "\u7ED3\u6784\u7EBF\u4EE5\u6DF1\u8272\u4E2D\u6027\u7EBF\u4E3A\u4E3B\uFF0C\u5C11\u91CF\u4FE1\u606F\u6D41\u53EF\u6309\u8BED\u4E49\u7740\u8272" : "mostly dark-neutral structural lines, with semantic colors only for a few information flows" : language === "zh" ? "\u8FB9\u6846\u3001\u7BAD\u5934\u548C\u8FDE\u63A5\u7EBF\u7EDF\u4E00\u4F7F\u7528\u6DF1\u8272\u4E2D\u6027\u7EBF" : "one dark-neutral color for borders, arrows, and connectors";
  const iconPolicy = preferences.allowLightIllustrations ? language === "zh" ? "\u53EF\u4F7F\u7528\u4E0E\u8BBA\u6587\u5BF9\u8C61\u76F4\u63A5\u76F8\u5173\u7684\u8F7B\u91CF\u79D1\u5B66\u56FE\u5F62\u6216\u56FE\u6807" : "paper-specific lightweight scientific forms or icons are allowed" : language === "zh" ? "\u4E0D\u4F7F\u7528\u88C5\u9970\u56FE\u6807\uFF0C\u4F46\u53EF\u4F7F\u7528 matrix\u3001token\u3001graph \u7B49\u79D1\u5B66\u8868\u793A" : "no decorative icons; scientific forms such as matrices, tokens, and graphs remain allowed";
  const typeHierarchy = preferences.fontSizeLevels === 2 ? language === "zh" ? "2 \u7EA7\u5B57\u53F7\uFF0C\u6BD4\u4F8B\u7EA6 1.00 : 1.30" : "2 type-size levels at about 1.00 : 1.30" : language === "zh" ? "3 \u7EA7\u5B57\u53F7\uFF0C\u6BD4\u4F8B\u7EA6 1.00 : 1.22 : 1.50" : "3 type-size levels at about 1.00 : 1.22 : 1.50";
  const titlePolicy = preferences.includeLargeTitle ? language === "zh" ? "\u5141\u8BB8\u4E00\u4E2A\u6765\u81EA\u8BBA\u6587\u672F\u8BED\u7684\u7B80\u77ED\u56FE\u5185\u6807\u9898" : "allow one short in-figure title drawn from the paper terminology" : language === "zh" ? "\u4E0D\u4F7F\u7528\u56FE\u5185\u5927\u6807\u9898" : "no large in-figure title";
  const cardPolicy = language === "zh" ? cardFillPolicy.label.zh : cardFillPolicy.label.en;
  if (language === "zh") {
    return `\u89C6\u89C9\u8BBE\u7F6E\uFF1A${selectedAspectRatio} \u753B\u5E03\uFF0C\u7EAF\u767D\u80CC\u666F\uFF1B\u4ECE ${palette.label.zh}\uFF08${candidateColors}\uFF09\u4E2D\u4F7F\u7528 ${accentRange.label} \u79CD\u5F3A\u8C03\u8272\uFF1B${linePolicy}\uFF1B\u5B57\u4F53 ${fontFamily.label}\uFF0C${typeHierarchy}\uFF0C\u6587\u5B57\u4F7F\u7528\u9ED1\u8272\u6216\u8FD1\u9ED1\u8272\uFF1B\u5BB9\u5668\u5E95\u8272\u91C7\u7528\u201C${cardPolicy}\u201D\uFF1B${iconPolicy}\uFF1B${titlePolicy}\u3002`;
  }
  return `Visual settings: ${selectedAspectRatio} canvas on pure white; use ${accentRange.label} accent colors from ${palette.label.en} (${candidateColors}); ${linePolicy}; ${fontFamily.label}, ${typeHierarchy}, with black or near-black text; container fill policy: ${cardPolicy}; ${iconPolicy}; ${titlePolicy}.`;
}
function buildFigurePrompt(promptId, preferences, language, options = {}) {
  return [
    COMMON_BASE[language](
      FIGURE_PROMPTS[promptId].label[language],
      preferences.hasReferenceImage
    ),
    FIGURE_TYPE_ADAPTERS[promptId][language],
    buildVisualConfiguration(preferences, language),
    OUTPUT_PROTOCOL[language]({
      executionMode: preferences.executionMode,
      hasReferenceImage: preferences.hasReferenceImage,
      outputFileName: options.outputFileName
    })
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
    zh: `1. \u8BBA\u6587\u4E8B\u5B9E\u4EE5\u5F53\u524D .tex\u3001\u53EF\u89C6\u6838\u67E5\u7684 PDF\u3001\u5F53\u524D .bib \u4E3A\u51C6\uFF1B\u8054\u7F51\u53EA\u6838\u9A8C\u80CC\u666F\u3001\u672F\u8BED\u3001\u7F3A\u53E3\u3001\u76F8\u5173\u5DE5\u4F5C\u4E0E venue\uFF0C\u4E0D\u80FD\u66FF\u4EE3\u8BBA\u6587\u6750\u6599\u63A8\u65AD\u65B9\u6CD5\u3001\u8BBE\u7F6E\u3001\u6570\u636E\u6216\u7ED3\u679C\u3002
2. \u4E0D\u8865\u9020\u6570\u636E\u96C6\u3001\u6307\u6807\u3001\u5B9E\u9A8C\u8BBE\u7F6E\u3001\u6A21\u5757\u3001\u516C\u5F0F\u3001\u7EDF\u8BA1\u3001\u7ED3\u679C\u3001\u63D0\u5347\u6216\u5931\u8D25\u6848\u4F8B\u3002TeX\u3001PDF\u3001\u56FE\u8868\u4E0E\u6B63\u6587\u51B2\u7A81\u65F6\uFF0C\u8BB0\u5F55\u4F4D\u7F6E\u4E0E\u98CE\u9669\uFF1B\u91C7\u7528\u8BC1\u636E\u6700\u76F4\u63A5\u7684\u4F4E\u98CE\u9669\u8868\u8FF0\uFF0C\u65E0\u6CD5\u5224\u65AD\u5219\u5F31\u5316\u7ED3\u8BBA\u3002
3. \u4FDD\u6301 claim \u4E0E\u8BC1\u636E\u540C\u5F3A\u5EA6\uFF1A\u4E0D\u628A\u76F8\u5173\u6027\u5199\u6210\u56E0\u679C\u3001\u5C40\u90E8\u89C2\u5BDF\u5199\u6210\u666E\u9002\u89C4\u5F8B\u6216\u63A8\u65AD\u5199\u6210\u5DF2\u8BC1\u5B9E\u673A\u5236\uFF1B\u6BD4\u8F83\u8BED\u8A00\u5E94\u5177\u4F53\u3001\u514B\u5236\u3001\u53EF\u6838\u9A8C\u3002
4. \u6700\u7EC8\u7A3F\u4E0D\u5F97\u6B8B\u7559 TODO\u3001TBD\u3001\u865A\u6784 cite key\u3001\u672A\u89E3\u91CA\u5360\u4F4D\u7B26\u6216\u5F85\u8865\u4F2A\u6B63\u6587\u3002`,
    en: `1. Ground manuscript facts in the current .tex, visually inspectable PDF, and current .bib. Use web research only to verify background, terminology, gaps, related work, and venue information\u2014not to infer methods, settings, data, or results.
2. Invent no datasets, metrics, experimental settings, modules, equations, statistics, results, gains, or failure cases. When TeX, PDF, visuals, and prose conflict, record the location and risk; use the most directly supported low-risk wording and qualify an unresolved claim.
3. Match claim strength to evidence: do not turn correlation into causation, a local observation into a general law, or inference into a confirmed mechanism. Keep comparisons concrete, restrained, and verifiable.
4. Leave no TODO, TBD, invented cite key, unexplained placeholder, or pseudo-prose in the final manuscript.`
  },
  manuscriptProtection: {
    zh: `1. \u6CBF\u7528\u5F53\u524D\u6587\u6863\u7C7B\u3001\u5B8F\u5305\u3001\u4F5C\u8005\u5757\u3001\u53C2\u8003\u6587\u732E\u6837\u5F0F\u3001\u81EA\u5B9A\u4E49\u547D\u4EE4\u3001\u5355\u53CC\u680F\u3001\u56FE\u50CF\u8DEF\u5F84\u548C\u7F16\u8BD1\u4F53\u7CFB\uFF1B\u53EA\u5BF9\u5DF2\u786E\u8BA4\u7684\u7F16\u8BD1\u3001\u8BED\u6CD5\u3001\u91CD\u590D label \u6216\u5931\u6548\u5F15\u7528\u505A\u6700\u5C0F\u4FEE\u590D\u5E76\u8BB0\u5F55\u3002
2. \u5C3D\u91CF\u4FDD\u7559 label\u3001ref\u3001cite\u3001\u516C\u5F0F\u7F16\u53F7\u548C\u7B97\u6CD5\u6807\u8BC6\uFF1B\u79FB\u52A8\u5185\u5BB9\u65F6\u540C\u6B65\u7EF4\u62A4\u4EA4\u53C9\u5F15\u7528\u3002
3. \u4FDD\u7559\u6240\u6709\u627F\u62C5\u8BC1\u636E\u4F5C\u7528\u7684\u73B0\u6709\u56FE\u8868\u3002\u9664\u72EC\u7ACB\u6846\u67B6\u56FE\u6B65\u9AA4\u8981\u6C42\u7684\u3001\u5B8C\u5168\u57FA\u4E8E\u8BBA\u6587\u4E8B\u5B9E\u751F\u6210\u7684 PNG \u5916\uFF0C\u4E0D\u751F\u6210\u6216\u66FF\u6362\u56FE\u7247\u3002
4. \u4EA4\u4ED8\u5B8C\u6574\u3001\u8FDE\u7EED\u3001\u53EF\u7F16\u8F91\u7684\u82F1\u6587 .tex\uFF1B\u4E2D\u6587\u5206\u6790\u4E0E\u4FEE\u6539\u8BF4\u660E\u53EA\u8FDB\u5165\u4E2D\u6587\u62A5\u544A\u3002`,
    en: `1. Preserve the document class, packages, author block, bibliography style, custom commands, column layout, image paths, and build system. Make and report only confirmed minimal repairs to compilation, syntax, duplicate labels, or broken references.
2. Preserve labels, refs, cites, equation numbers, and algorithm identifiers where possible; maintain cross-references when content moves.
3. Retain every existing visual that carries evidence. Generate or replace no image except the manuscript-grounded PNG required by the separate framework-figure step.
4. Deliver a complete, continuous, editable English .tex; keep Chinese analysis and revision notes in the Chinese report.`
  },
  identityGovernance: {
    zh: `\u6838\u67E5\u5F53\u524D\u6807\u9898\u3001\u65B9\u6CD5\u5168\u79F0\u4E0E\u8BBA\u6587\u54C1\u724C\u7F29\u5199\uFF1B\u82E5\u5176\u4ECD\u662F\u6700\u4F18\u65B9\u6848\u5219\u4FDD\u7559\uFF0C\u82E5\u53D8\u66F4\u80FD\u660E\u786E\u63D0\u5347\u51C6\u786E\u6027\u3001\u8FB9\u754C\u6216\u8FA8\u8BC6\u5EA6\uFF0C\u5219\u7531\u6A21\u578B\u5728\u672C\u8F6E\u81EA\u52A8\u9009\u62E9\u5E76\u5E94\u7528\u6700\u4F18\u65B9\u6848\u3002\u6240\u6709\u5B9E\u9645\u53D8\u66F4\u5FC5\u987B\u5728\u4E2D\u6587\u62A5\u544A\u4E2D\u8BB0\u5F55 high-risk diff\uFF08\u539F\u503C\u3001\u6700\u7EC8\u503C\u3001\u4F9D\u636E\u4E0E\u8BC1\u636E\u3001\u98CE\u9669\u53CA\u5F71\u54CD\u4F4D\u7F6E\uFF09\uFF0C\u4E0D\u5F97\u65E0\u58F0\u66FF\u6362\u3002\u79D1\u5B66\u4E3B\u7EBF\u4E5F\u53EF\u968F\u65B0\u8BC1\u636E\u81EA\u52A8\u4FEE\u6B63\uFF0C\u4F46\u6BCF\u6B21\u53D8\u5316\u90FD\u8981\u8BB0\u5F55\u539F\u56E0\u548C\u5F71\u54CD\u3002`,
    en: `Audit the current title, full method name, and paper-brand acronym. Keep them when they remain the strongest option; when a change clearly improves accuracy, scope, or distinctiveness, select and apply the best option automatically as part of this workflow. Record every applied change in the Chinese report as a high-risk diff covering the original and final values, rationale and evidence, risks, and affected locations; never change identity silently. The scientific throughline may also be revised automatically when later evidence warrants it, with every change and impact recorded.`
  },
  cohesiveRevision: {
    zh: `1. \u4E0D\u505A\u201C\u539F\u6587 + \u4FEE\u8865\u53E5\u201D\uFF1A\u5148\u786E\u5B9A\u5141\u8BB8\u8303\u56F4\u5185\u6700\u5C0F\u7684\u5B8C\u6574\u8BBA\u8BC1\u5355\u5143\uFF0C\u518D\u6574\u4F53\u878D\u5408\u95EE\u9898\u3001claim\u3001\u8BC1\u636E\u3001\u89E3\u91CA\u3001\u8FB9\u754C\u4E0E\u8FC7\u6E21\u3002
2. \u4FDD\u7559\u51C6\u786E\u6709\u529B\u7684\u539F\u8868\u8FBE\uFF1B\u53EA\u91CD\u7EC4\u786E\u6709\u65AD\u88C2\u3001\u51B2\u7A81\u6216\u91CD\u590D\u7684\u4F4D\u7F6E\uFF0C\u4F7F\u4FEE\u6539\u540E\u50CF\u4E00\u6B21\u6210\u7A3F\u3002
3. \u7CBE\u4FEE\u4E0D\u6269\u5927\u8303\u56F4\u3001\u4E0D\u6539\u53D8\u4E8B\u5B9E\u4E0E claim\u3001\u4E0D\u8865\u9020\u8BC1\u636E\uFF0C\u4E5F\u4E0D\u89E6\u78B0\u672C\u8F6E\u660E\u786E\u4FDD\u62A4\u7684\u5185\u5BB9\u3002`,
    en: `1. Do not produce \u201Cold prose plus a patch.\u201D Identify the smallest complete argumentative unit in scope, then integrate its problem, claim, evidence, interpretation, boundary, and transition.
2. Preserve accurate, effective original expression. Recompose only genuine breaks, conflicts, or repetition so the result reads as one coherent draft.
3. Refinement does not expand scope, change facts or claims, fabricate evidence, or touch content protected in this round.`
  },
  pdfReview: {
    zh: `\u5B8C\u6574\u9605\u8BFB PDF\uFF0C\u5E76\u7528\u9875\u9762\u622A\u56FE\u6216\u7B49\u4EF7\u89C6\u89C9\u65B9\u5F0F\u68C0\u67E5\u6240\u6709\u6846\u67B6\u56FE\u3001\u673A\u5236\u56FE\u3001\u5B9E\u9A8C\u56FE\u3001\u6848\u4F8B\u56FE\u3001\u8868\u683C\u4E0E\u516C\u5F0F\u7248\u5F0F\u3002\u5BF9\u56FE\u68C0\u67E5\u6A21\u5757\u3001\u7BAD\u5934\u3001\u8F93\u5165\u8F93\u51FA\u3001\u56FE\u4F8B\u3001caption \u548C\u6B63\u6587\u5F15\u7528\uFF1B\u5BF9\u8868\u68C0\u67E5\u884C\u5217\u542B\u4E49\u3001\u6307\u6807\u65B9\u5411\u3001\u6807\u8BB0\u3001\u5355\u4F4D\u3001\u5747\u503C/\u6807\u51C6\u5DEE\u548C\u6B63\u6587\u6570\u5B57\u3002\u82E5 TeX \u4E0E PDF \u4E0D\u4E00\u81F4\uFF0C\u5728\u62A5\u544A\u4E2D\u7ED9\u51FA\u9875\u7801\u3001\u7F16\u53F7\u548C\u51B2\u7A81\u5185\u5BB9\u3002`,
    en: `Read the complete PDF and visually inspect every framework diagram, mechanism figure, result plot, case figure, table, and rendered equation using page images or an equivalent visual method. For figures, check components, arrows, inputs, outputs, legends, captions, and prose references. For tables, check row and column meanings, metric direction, emphasis marks, units, mean/standard deviation notation, and numbers cited in prose. Report page numbers, identifiers, and exact conflicts whenever TeX and PDF disagree.`
  },
  citationAndWeb: {
    zh: `1. \u4FDD\u7559\u5F53\u524D .bib \u7684\u5168\u90E8\u6761\u76EE\uFF1B\u6700\u7EC8\u6BCF\u4E2A cite key \u90FD\u5FC5\u987B\u5B58\u5728\u4E8E\u672C\u8F6E\u4EA4\u4ED8\u7684\u5B8C\u6574\u5F53\u524D\u6587\u732E\u5E93\uFF0C\u4E0D\u80FD\u53EA\u4EA4\u4ED8\u589E\u91CF\u3002
2. \u6280\u672F\u4E8B\u5B9E\u4F18\u5148\u6838\u9A8C\u539F\u8BBA\u6587\u3001\u5B98\u65B9\u8BBA\u6587\u9875\u3001\u51FA\u7248\u793E\u3001DBLP\u3001Crossref \u6216\u4F5C\u8005\u516C\u5F00\u7248\u672C\uFF1B\u4F18\u5148\u8FD1\u4E09\u5E74\u76F4\u63A5\u76F8\u5173\u5DE5\u4F5C\uFF0C\u540C\u65F6\u4FDD\u7559\u5FC5\u8981\u5960\u57FA\u6587\u732E\u3002
3. \u4EC5\u8FFD\u52A0\u5DF2\u6838\u9A8C\u3001\u975E\u91CD\u590D\u4E14\u786E\u5B9E\u652F\u6491\u8BBA\u70B9\u7684\u6761\u76EE\u3002\u65B0\u589E\u6216\u4FEE\u6B63\u90FD\u5728\u62A5\u544A\u4E2D\u8BB0\u5F55\u652F\u6301\u7684 claim\u3001\u4F4D\u7F6E\u3001\u7406\u7531\u4E0E\u5143\u6570\u636E\u6765\u6E90\uFF1B\u4E0D\u786E\u5B9A\u5B57\u6BB5\u7559\u7A7A\u800C\u975E\u731C\u6D4B\u3002`,
    en: `1. Preserve every current .bib entry. Every final cite key must exist in the complete current BibTeX library delivered for this round, never a delta-only file.
2. Verify technical facts through original papers, official proceedings or publisher pages, DBLP, Crossref, or author versions. Prioritize directly relevant work from the last three years while retaining necessary foundations.
3. Add only verified, non-duplicate sources that support a real claim. Record each addition or correction, its claim and location, rationale, and metadata source; omit uncertain fields rather than guessing.`
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
      zh: "\u5BA1\u8BA1\u79D1\u5B66\u5B9A\u4F4D\u4E0E\u8BBA\u6587\u8EAB\u4EFD\uFF0C\u5EFA\u7ACB\u4E3B\u7EBF\u3001\u672F\u8BED\u4F53\u7CFB\u3001Claim\u2013Evidence Map \u548C\u7AE0\u8282\u5206\u5DE5\u3002",
      en: "Audit the scientific position and paper identity, then establish the throughline, terminology, claim\u2013evidence map, and section responsibilities."
    },
    role: {
      zh: "\u4F60\u662F\u4E00\u540D\u719F\u6089\u8BA1\u7B97\u673A\u79D1\u5B66\u9876\u7EA7\u4F1A\u8BAE\u4E0E\u9AD8\u6C34\u5E73\u671F\u520A\u8BC4\u5BA1\u7684\u8D44\u6DF1\u7814\u7A76\u8005\u3002\u672C\u8F6E\u5728\u4FDD\u7559\u539F\u7A3F\u6709\u6548\u8BBA\u8BC1\u548C\u4F18\u8D28\u8868\u8FBE\u7684\u57FA\u7840\u4E0A\uFF0C\u5B8C\u6210\u79D1\u5B66\u5B9A\u4F4D\u4E0E\u5B8F\u89C2\u7ED3\u6784\u7684\u6DF1\u5EA6\u7CBE\u4FEE\u3002",
      en: "You are a senior researcher familiar with leading computer-science conferences and journals. Deeply refine the scientific position and macro structure while preserving sound arguments and strong original expression."
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
        zh: "\u4F1A\u8BAE\u8BBA\u6587\u91C7\u7528\u9AD8\u5BC6\u5EA6\u3001claim-first \u7684\u5199\u6CD5\u3002\u9700\u8981\u7B2C\u4E09\u5C42\u6807\u9898\u65F6\u4F7F\u7528 paragraph\uFF1B\u53EA\u4E3A\u72EC\u7ACB\u79D1\u5B66\u5355\u5143\u8BBE\u7F6E\u6807\u9898\uFF0C\u666E\u901A\u8BBA\u8FF0\u4FDD\u6301\u8FDE\u7EED\u3002Related Work \u4F7F\u7528\u4E09\u4E2A\u5355\u6BB5\u5C0F\u8282\uFF1BMethod \u4E0D\u5355\u8BBE Overview\uFF1BDiscussion \u7531\u6A21\u578B\u6309\u8BC1\u636E\u9009\u62E9 3\u20135 \u4E2A\u4E3B\u9898\u5C0F\u8282\uFF0CLimitations \u7EA6 100 \u8BCD\u3002",
        en: "Conference prose is compact and claim-first. Use paragraph when a third heading level is genuinely needed, and otherwise keep exposition continuous. Related Work uses three one-paragraph subsections; Method has no standalone Overview; the model selects three to five evidence-driven Discussion topics, followed by an approximately 100-word Limitations subsection."
      },
      journal: {
        zh: "\u671F\u520A\u8BBA\u6587\u91C7\u7528\u7D2F\u79EF\u5F0F\u3001\u89E3\u91CA\u5145\u5206\u7684\u5199\u6CD5\u3002\u76EE\u5F55\u5C42\u7EA7\u9ED8\u8BA4\u6B62\u4E8E subsubsection\uFF0C\u53D9\u8FF0\u529F\u80FD\u4F7F\u7528\u4E3B\u9898\u53E5\u4E0E\u8FC7\u6E21\u8868\u8FBE\u3002Related Work \u4F7F\u7528\u4E09\u4E2A\u53CC\u6BB5\u5C0F\u8282\uFF1BMethod \u5355\u8BBE\u4E24\u6BB5 Overview\uFF0C\u7BC7\u5E45\u53EF\u53C2\u8003 80 \u8BCD\u5E76\u6309\u5185\u5BB9\u8C03\u6574\uFF1BDiscussion \u7531\u6A21\u578B\u6309\u8BC1\u636E\u9009\u62E9 3\u20135 \u4E2A\u4E3B\u9898\u5C0F\u8282\u3002",
        en: "Journal prose is cumulative and sufficiently explanatory. Stop the heading hierarchy at subsubsection by default and express discourse functions through topic sentences and transitions. Related Work uses three two-paragraph subsections; Method has a two-paragraph Overview using 80 words only as an optional reference; the model selects three to five evidence-driven Discussion topics."
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
          zh: "B. \u5BA1\u8BA1\u6807\u9898\u4E0E\u8BBA\u6587\u54C1\u724C\u7F29\u5199",
          en: "B. Audit the Title and Paper Brand Acronym"
        },
        body: {
          zh: "\u6838\u67E5\u5F53\u524D\u6807\u9898\u3001\u65B9\u6CD5\u5168\u79F0\u548C\u7F29\u5199\u7684\u51C6\u786E\u6027\u3001\u81EA\u7136\u5EA6\u3001\u68C0\u7D22\u6027\u4E0E\u51B2\u7A81\u98CE\u9669\u3002\u5F53\u524D\u65B9\u6848\u4ECD\u6700\u4F18\u65F6\u4FDD\u7559\uFF1B\u82E5\u66FF\u6362\u80FD\u660E\u786E\u6539\u5584\u8BBA\u6587\u8EAB\u4EFD\uFF0C\u5219\u7531\u6A21\u578B\u81EA\u52A8\u9009\u62E9\u5E76\u5199\u5165\u6700\u4F18\u65B9\u6848\uFF0C\u54C1\u724C\u7F29\u5199\u4F7F\u7528 4\u20137 \u4E2A\u62C9\u4E01\u5B57\u6BCD\uFF1B\u53D8\u66F4\u8BB0\u5F55\u9075\u5FAA\u5168\u5C40\u6807\u9898\u4E0E\u54C1\u724C\u6CBB\u7406\u89C4\u5219\u3002",
          en: "Audit the current title, full method name, and acronym for accuracy, naturalness, searchability, and collision risk. Keep the current identity when it remains strongest; when replacement clearly improves it, automatically select and apply the best option, using four to seven Latin letters for a brand acronym. Follow the global title-and-brand governance rule for change records."
        }
      },
      {
        heading: {
          zh: "C. \u7EDF\u4E00\u672F\u8BED\u4F53\u7CFB",
          en: "C. Standardize the Terminology System"
        },
        body: {
          zh: "\u4EE5\u672C\u8F6E\u5BA1\u8BA1\u540E\u786E\u5B9A\u7684\u65B9\u6CD5\u5168\u79F0\u4E0E\u8BBA\u6587\u54C1\u724C\u7F29\u5199\u4E3A\u552F\u4E00\u57FA\u51C6\uFF0C\u7EDF\u4E00\u95EE\u9898\u3001\u8868\u793A\u3001\u6A21\u5757\u3001\u5206\u652F\u3001\u67E5\u8BE2\u3001\u635F\u5931\u3001\u8BAD\u7EC3/\u63A8\u7406\u3001\u6570\u636E\u96C6\u3001\u6307\u6807\u548C\u5B9E\u9A8C\u7C7B\u578B\u7684 canonical term\uFF1B\u5217\u51FA\u7981\u7528\u53D8\u4F53\u4E0E\u5FC5\u987B\u533A\u5206\u7684\u76F8\u8FD1\u6982\u5FF5\u3002",
          en: "Use the full method name and paper-brand acronym selected by this audit as the single identity, then define canonical terms for the problem, representations, components, branches, queries, losses, training/inference, datasets, metrics, and experiment types. List prohibited variants and nearby concepts that must remain distinct."
        }
      },
      {
        heading: {
          zh: "D. \u91CD\u6784\u7AE0\u8282\u529F\u80FD\u4E0E\u8BBA\u8BC1\u987A\u5E8F",
          en: "D. Rebuild Section Functions and Argument Order"
        },
        body: {
          zh: "\u8BA9 Abstract \u6982\u62EC\u8BC1\u636E\u94FE\uFF1BIntroduction \u4F9D\u6B21\u5EFA\u7ACB\u80CC\u666F\u4E0E\u7F3A\u53E3\u3001\u4ECA\u5929\u4ECD\u672A\u89E3\u51B3\u7684\u6311\u6218\u3001\u56DE\u5E94\u8FD9\u4E9B\u6311\u6218\u7684\u6838\u5FC3\u601D\u60F3\u548C\u8D21\u732E\uFF1BRelated Work \u6309\u8303\u5F0F\u4E0E\u6743\u8861\u7EFC\u5408\uFF1BMethod \u4E0E Experiments \u4FDD\u7559\u5168\u90E8\u6838\u5FC3\u673A\u5236\u3001\u534F\u8BAE\u548C\u53D1\u73B0\uFF0C\u5E76\u53EA\u4E3A\u5B9E\u8D28\u79D1\u5B66\u5355\u5143\u8BBE\u7F6E\u6807\u9898\uFF1BDiscussion \u4EE5 3\u20135 \u4E2A\u8BC1\u636E\u9A71\u52A8\u4E3B\u9898\u89E3\u91CA\u673A\u5236\u3001\u8303\u56F4\u4E0E\u5C40\u9650\uFF1BConclusion \u6536\u675F\u95EE\u9898\u3001\u8BC1\u636E\u548C\u8FB9\u754C\u3002",
          en: "Make the Abstract summarize the evidence chain; let the Introduction move from background and gap to challenges still unresolved today, then to the core idea that answers them and the contributions; synthesize Related Work by paradigms and trade-offs; preserve all core mechanisms, protocols, and findings in Method and Experiments while using headings only for substantive scientific units; use three to five evidence-driven Discussion topics; and close the problem, evidence, and boundaries in Conclusion."
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
          zh: "F. \u6838\u9A8C\u5B9A\u4F4D\u5E76\u5B8C\u6210\u5B8F\u89C2\u91CD\u6784",
          en: "F. Verify the Position and Perform the Macro Reconstruction"
        },
        body: {
          zh: "\u8054\u7F51\u6838\u9A8C\u7814\u7A76\u7F3A\u53E3\u3001\u6700\u8FD1\u90BB\u5DE5\u4F5C\u548C\u8D21\u732E\u51B2\u7A81\u98CE\u9669\u3002\u5728\u4FDD\u7559\u539F\u7A3F\u6709\u6548\u8BBA\u8BC1\u4E0E\u4F18\u8D28\u8868\u8FBE\u7684\u57FA\u7840\u4E0A\u5B8C\u6210\u5168\u7A3F\u5B8F\u89C2\u91CD\u6784\uFF1B\u8BED\u8A00\u53EF\u6682\u4E0D\u8FFD\u6C42\u6700\u7EC8\u7CBE\u4FEE\uFF0C\u4F46\u4E3B\u7EBF\u3001\u7ED3\u6784\u3001\u672F\u8BED\u548C\u8BBA\u8BC1\u987A\u5E8F\u5FC5\u987B\u6E05\u6670\u3002",
          en: "Use web research to verify the gap, nearest-neighbor work, and contribution-overlap risks. Reconstruct the manuscript at the macro level while preserving sound arguments and strong original expression. Sentence-level polish may wait, but the throughline, architecture, terminology, and evidence order must be clear."
        }
      }
    ],
    deliverables: {
      zh: `\u751F\u6210\u5B8C\u6574\u82F1\u6587 .tex\u3001\u4E2D\u6587\u62A5\u544A\u548C\u5B8C\u6574\u5F53\u524D BibTeX \u6587\u732E\u5E93\u3002\u4E2D\u6587\u62A5\u544A\u81F3\u5C11\u5305\u542B\uFF1AScientific Positioning Contract\u3001\u6807\u9898\u4E0E\u8BBA\u6587\u54C1\u724C\u5BA1\u8BA1\u53CA\u6240\u6709\u5DF2\u5E94\u7528 high-risk diff\u3001\u4E00\u53E5\u8BDD\u4E3B\u65E8\u4E0E\u75DB\u70B9\u3001\u65E7/\u65B0\u4E3B\u7EBF\u5BF9\u7167\u3001\u8D21\u732E\u5206\u5C42\u3001Claim\u2013Evidence Map\u3001\u672F\u8BED\u8868\u3001\u7AE0\u8282\u529F\u80FD\u4E0E\u53EF\u9009\u7BC7\u5E45\u5EFA\u8BAE\u8868\u3001\u56FE\u8868\u89D2\u8272\u3001\u7ED3\u6784\u64CD\u4F5C\u6E05\u5355\u3001\u8054\u7F51\u6838\u9A8C\u3001\u6587\u732E\u8BB0\u5F55\u548C\u4E0B\u4E00\u6B65\u4EA4\u63A5\u6458\u8981\u3002`,
      en: `Create a complete English .tex, a Chinese report, and a complete current BibTeX library. The report must include the Scientific Positioning Contract; title and paper-brand audit with every applied high-risk diff; one-sentence thesis and pain point; old/new throughline comparison; contribution hierarchy; Claim\u2013Evidence Map; terminology table; section functions and budgets; visual roles; structural operations; web verification; bibliography changes; and a self-contained handoff.`
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
- \u6807\u9898\u3001\u65B9\u6CD5\u5168\u79F0\u4E0E\u7F29\u5199\u5DF2\u81EA\u52A8\u9009\u62E9\u6700\u4F18\u65B9\u6848\uFF0C\u672A\u53D1\u751F\u65E0\u58F0\u66FF\u6362\u3002
- \u672F\u8BED\u3001\u7AE0\u8282\u529F\u80FD\u4E0E\u56FE\u8868\u89D2\u8272\u5DF2\u7A33\u5B9A\u3002
- Method \u4E0E Experiments \u7684\u6838\u5FC3\u5185\u5BB9\u672A\u56E0\u7BC7\u5E45\u5EFA\u8BAE\u6216\u7ED3\u6784\u6574\u7406\u800C\u538B\u7F29\u3002
- \u672A\u6539\u53D8\u6A21\u677F\uFF0C\u672A\u6DFB\u52A0\u65E0\u8BC1\u636E\u5185\u5BB9\u3002
- \u5DF2\u6309\u5F53\u524D\u8BBA\u6587\u98CE\u683C\u4E0E\u9644\u5F55\u914D\u7F6E\u6267\u884C\u3002`,
      en: `- The manuscript is organized around one scientific problem and core idea.
- Every primary claim has an evidence location and boundary.
- The strongest title, full method name, and acronym were selected automatically, with no silent change.
- Terminology, section functions, and visual roles are stable.
- Core Method and Experiments content was not compressed to satisfy a length suggestion or structural cleanup.
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
      zh: "Method \u4E0E Experiments \u5141\u8BB8\u5927\u5E45\u91CD\u6784\u3002\u5176\u4ED6\u7AE0\u8282\u53EA\u4E3A\u672F\u8BED\u3001\u4E8B\u5B9E\u4E0E\u4EA4\u53C9\u5F15\u7528\u4E00\u81F4\u6027\u505A\u6700\u5C0F\u540C\u6B65\u3002\u6CA1\u6709\u8BC1\u636E\u7684\u5B9E\u73B0\u6216\u5B9E\u9A8C\u4FE1\u606F\u5FC5\u987B\u5220\u9664\u6216\u964D\u7EA7\u4E3A\u8BC1\u636E\u5141\u8BB8\u7684\u8868\u8FF0\uFF0C\u5E76\u5728\u62A5\u544A\u4E2D\u5217\u4E3A\u672A\u6838\u9A8C\u98CE\u9669\u3002",
      en: "Method and Experiments may be substantially reconstructed. Make only minimal terminology, fact, and cross-reference updates elsewhere. Remove unsupported implementation or experimental details, or qualify them to the strongest evidence-supported wording, and record the unresolved risk in the report."
    },
    styleBranches: {
      conference: {
        zh: "\u4F1A\u8BAE\u8BBA\u6587\u91C7\u7528\u9AD8\u5BC6\u5EA6\u3001claim-first \u7684\u5199\u6CD5\u3002\u76EE\u5F55\u5C42\u7EA7\u4F7F\u7528 section \u2192 subsection \u2192 paragraph\uFF0C\u4F46\u53EA\u4E3A\u72EC\u7ACB\u79D1\u5B66\u5355\u5143\u8BBE\u7F6E\u6807\u9898\uFF1BMethod \u4E0D\u5355\u8BBE Overview\uFF0C\u5728\u5408\u9002\u4F4D\u7F6E\u81EA\u7136\u5F15\u51FA\u603B\u4F53\u6846\u67B6\u3002\u5B9E\u9A8C\u8BBE\u7F6E\u4F9D\u6B21\u8986\u76D6 Datasets\u3001Evaluation Metrics\u3001Experimental Configuration \u548C Baselines\uFF0C\u4E0D\u8981\u6C42\u56DB\u8005\u673A\u68B0\u6210\u4E3A\u6807\u9898\u3002",
        en: "Conference prose is compact and claim-first. The available hierarchy is section \u2192 subsection \u2192 paragraph, but headings are reserved for substantive scientific units. Method has no standalone Overview and introduces the framework where it serves the argument. Experimental setup covers Datasets, Evaluation Metrics, Experimental Configuration, and Baselines in order without mechanically turning all four into headings."
      },
      journal: {
        zh: "\u671F\u520A\u8BBA\u6587\u91C7\u7528\u7D2F\u79EF\u5F0F\u3001\u89E3\u91CA\u5145\u5206\u7684\u5199\u6CD5\u3002\u76EE\u5F55\u5C42\u7EA7\u9ED8\u8BA4\u6B62\u4E8E subsubsection\uFF1B\u5176\u4E0B\u4F7F\u7528\u4E3B\u9898\u53E5\u3001\u8FC7\u6E21\u548C\u81EA\u7136\u6BB5\u3002Method \u5355\u8BBE\u4E24\u6BB5 Overview\uFF0C\u603B\u8BCD\u6570\u53EF\u53C2\u8003 80 \u8BCD\u5E76\u6309\u5185\u5BB9\u8C03\u6574\uFF0C\u89E3\u91CA\u79D1\u5B66\u903B\u8F91\u4F46\u4E0D\u590D\u8FF0\u6846\u67B6\u56FE\u3002\u5B9E\u9A8C\u8BBE\u7F6E\u4F9D\u6B21\u8986\u76D6 Datasets\u3001Evaluation Metrics\u3001Experimental Configuration \u548C Baselines\uFF0C\u53EA\u5728\u5185\u5BB9\u786E\u5B9E\u6784\u6210\u72EC\u7ACB\u5355\u5143\u65F6\u8BBE\u7F6E subsubsection\u3002",
        en: "Journal prose is cumulative and sufficiently explanatory. Stop the hierarchy at subsubsection by default and use topic sentences and transitions below it. Method has a two-paragraph Overview using 80 words only as an optional reference and explaining scientific logic without narrating the figure. Experimental setup covers Datasets, Evaluation Metrics, Experimental Configuration, and Baselines in order, using subsubsections only for genuinely independent units."
      }
    },
    tasks: [
      {
        heading: {
          zh: "A. \u91CD\u6784 Method \u903B\u8F91",
          en: "A. Reconstruct the Method Logic"
        },
        body: {
          zh: `Method \u56F4\u7ED5\u201C\u95EE\u9898\u4E3A\u4EC0\u4E48\u96BE \u2192 \u4E3A\u4EC0\u4E48\u9700\u8981\u5F53\u524D\u673A\u5236 \u2192 \u673A\u5236\u5982\u4F55\u56DE\u5E94\u95EE\u9898 \u2192 \u9002\u7528\u8FB9\u754C\u201D\u5F62\u6210\u878D\u5408\u6027\u7684\u79D1\u5B66\u6545\u4E8B\uFF0C\u800C\u4E0D\u662F\u8BF4\u660E\u4E66\u6216\u7EC4\u4EF6\u6E05\u5355\u3002\u6309\u8BBA\u6587\u7C7B\u578B\u5904\u7406 Overview\uFF0C\u518D\u8FDB\u5165\u6838\u5FC3\u673A\u5236\u3001\u76EE\u6807\u3001\u8BAD\u7EC3\u4E0E\u63A8\u7406\uFF1B\u6BCF\u4E2A\u673A\u5236\u81EA\u7136\u878D\u5408\u52A8\u673A\u3001\u8BA1\u7B97\u6784\u9020\u3001\u63A5\u53E3\u3001\u4F5C\u7528\u4E0E\u8FB9\u754C\u3002\u4FDD\u7559\u5168\u90E8\u6838\u5FC3\u65B9\u6CD5\u5185\u5BB9\uFF0C\u53EA\u5408\u5E76\u91CD\u590D\u8868\u8FBE\uFF0C\u5E76\u907F\u514D\u4E3A\u6BCF\u4E2A\u6A21\u5757\u6216\u53D9\u8FF0\u529F\u80FD\u65B0\u589E\u6807\u9898\u3002`,
          en: `Method must not read like a manual, code document, or procedural checklist. Build an integrated scientific story around why the problem is difficult, why existing designs fall short, why the mechanism is needed, how it addresses the problem, and where it applies; do not force every sentence to state a why.
Follow the current paper type's Overview rule before moving through core mechanisms, objectives, training, and inference. Integrate motivation, construction, interfaces, function, and boundaries naturally. Preserve all core Method content, merge only genuine repetition, and do not create a heading for every component or discourse function.`
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
          zh: `\u4EE5 Datasets and Experimental Setup \u5F00\u59CB\uFF0C\u4F9D\u6B21\u8986\u76D6 Datasets\u3001Evaluation Metrics\u3001Experimental Configuration\uFF08\u670D\u52A1\u5668/\u786C\u4EF6\u3001\u8D85\u53C2\u6570\u7B49\uFF09\u548C Baselines\uFF1B\u8FD9\u4E9B\u662F\u5185\u5BB9\u529F\u80FD\uFF0C\u4E0D\u8981\u6C42\u9010\u9879\u6210\u4E3A\u6807\u9898\u3002Evaluation Metrics \u8BF4\u660E\u6307\u6807\u5B9A\u4E49\u3001\u65B9\u5411\u3001\u5C3A\u5EA6\u3001\u805A\u5408\u65B9\u5F0F\u53CA\u5176\u4E0E\u4EFB\u52A1\u76EE\u6807\u7684\u5173\u7CFB\u3002\u968F\u540E\u662F Main Results\uFF0C\u5176\u4ED6\u5206\u6790\u6309\u771F\u5B9E\u8BC1\u636E\u5B89\u6392\uFF0C\u4E0D\u7ED1\u5B9A\u56FA\u5B9A\u5E8F\u53F7\u3002
\u4FDD\u7559\u5168\u90E8\u5B9E\u9A8C\u534F\u8BAE\u3001\u6838\u5FC3\u7ED3\u679C\u3001\u4E0D\u5229\u7ED3\u679C\u548C\u89E3\u91CA\u7A7A\u95F4\u3002\u6BCF\u4E2A\u5B9E\u9A8C\u5355\u5143\u7528\u8FDE\u7EED\u6BB5\u843D\u4EA4\u4EE3\u95EE\u9898\u3001\u51B3\u5B9A\u6027\u8BC1\u636E\u3001\u5408\u7406\u89E3\u91CA\u3001\u4E0E claim \u7684\u5173\u7CFB\u548C\u8FB9\u754C\uFF1B\u6807\u9898\u53EA\u547D\u540D\u771F\u5B9E\u5B9E\u9A8C\u3001\u53D8\u91CF\u6216\u73B0\u8C61\uFF0C\u4E0D\u628A Question\u3001Observation\u3001Interpretation \u7B49\u53D9\u8FF0\u529F\u80FD\u5347\u7EA7\u4E3A\u6807\u9898\uFF0C\u4E5F\u4E0D\u9010\u683C\u6717\u8BFB\u6570\u5B57\u3002`,
          en: `Begin with Datasets and Experimental Setup, covering Datasets, Evaluation Metrics, Experimental Configuration (including servers/hardware and hyperparameters), and Baselines in that order. These are content functions, not mandatory headings. Define metric direction, scale, aggregation, and relation to the task objective. Follow with Main Results and order all further analyses by the available evidence rather than fixed positions.
Preserve every protocol, core result, unfavorable result, and necessary interpretive context. Each experiment unit uses continuous prose to establish its question, decisive evidence, warranted interpretation, relation to the claim, and boundary. Headings name genuine experiments, variables, or phenomena\u2014not discourse functions such as Question, Observation, or Interpretation\u2014and prose does not narrate cells one by one.`
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
      zh: "\u751F\u6210\u5B8C\u6574\u82F1\u6587 .tex\u3001\u4E2D\u6587\u62A5\u544A\u548C\u5B8C\u6574\u5F53\u524D BibTeX \u6587\u732E\u5E93\u3002\u62A5\u544A\u5305\u542B Method \u903B\u8F91\u56FE\u8C31\u3001\u65E7/\u65B0\u5C0F\u8282\u5BF9\u7167\u3001\u516C\u5F0F\u7B26\u53F7\u5BA1\u8BA1\u3001\u73B0\u6709\u56FE\u8868\u4E0E\u6B63\u6587\u63A5\u53E3\u5BA1\u8BA1\u3001Experiment Question\u2013Evidence Matrix\u3001\u5B9E\u9A8C\u987A\u5E8F\u8BF4\u660E\u3001\u6570\u5B57\u98CE\u9669\u3001\u5F31\u5316\u4E3B\u5F20\u3001\u8054\u7F51\u6838\u9A8C\u3001\u65B0\u589E\u6216\u4FEE\u6B63\u6587\u732E\u8BB0\u5F55\u3001\u4FEE\u6539\u6E05\u5355\u3001\u672A\u6838\u9A8C\u98CE\u9669\u548C\u4E0B\u4E00\u8F6E\u4EA4\u63A5\u6458\u8981\u3002",
      en: "Create a complete English .tex, a Chinese report, and a complete current BibTeX library. The report must include the Method logic map, old/new subsection comparison, equation and notation audit, existing-visual-to-prose interface audit, Experiment Question\u2013Evidence Matrix, experiment-order rationale, numeric risks, qualified claims, web verification, added or corrected bibliography records, revision log, unresolved verification risks, and the next-round handoff."
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
- \u6838\u5FC3\u65B9\u6CD5\u5185\u5BB9\u3001\u5B9E\u9A8C\u534F\u8BAE\u4E0E\u91CD\u8981\u53D1\u73B0\u672A\u88AB\u538B\u7F29\u6216\u5220\u9664\u3002
- \u6807\u9898\u5C42\u7EA7\u53EA\u5BF9\u5E94\u5B9E\u8D28\u79D1\u5B66\u5355\u5143\uFF0C\u672A\u628A\u8BBA\u6587\u5199\u6210\u6807\u51C6\u6587\u6863\u5F0F\u6E05\u5355\u3002
- \u73B0\u6709\u56FE\u3001\u8868\u548C\u516C\u5F0F\u5DF2\u89C6\u89C9\u6838\u5BF9\u5E76\u4E0E\u6B63\u6587\u5BF9\u9F50\u3002
- \u672C\u6B65\u672A\u63D0\u524D\u751F\u6210\u6216\u66FF\u6362\u603B\u4F53\u6846\u67B6\u56FE\u3002
- Results \u4E0D\u9010\u9879\u6717\u8BFB\u8868\u683C\uFF0C\u4E5F\u4E0D\u63D0\u524D\u627F\u62C5 Discussion \u529F\u80FD\u3002
- \u5176\u4ED6\u7AE0\u8282\u53EA\u505A\u5FC5\u8981\u540C\u6B65\u3002`,
      en: `- Method and Experiments were substantively reconstructed, not synonym-swapped.
- Every method, equation, setting, and number is grounded in current materials.
- Core Method content, experimental protocols, and important findings were neither compressed nor deleted.
- Headings correspond only to substantive scientific units rather than document-style inventory items.
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
      zh: "\u524D\u540E\u53D9\u4E8B\u6DF1\u5EA6\u7CBE\u4FEE",
      en: "Deep Narrative Refinement"
    },
    purpose: {
      zh: "\u4EE5\u65B9\u6CD5\u3001\u5B9E\u9A8C\u548C\u8BC1\u636E\u4E3A\u57FA\u51C6\uFF0C\u6DF1\u5EA6\u7CBE\u4FEE\u6458\u8981\u3001\u5F15\u8A00\u3001\u76F8\u5173\u5DE5\u4F5C\u3001\u8BA8\u8BBA\u4E0E\u7ED3\u8BBA\uFF0C\u540C\u65F6\u4FDD\u7559\u539F\u7A3F\u4E2D\u51C6\u786E\u6709\u529B\u7684\u8868\u8FBE\u3002",
      en: "Deeply refine the abstract, introduction, related work, discussion, and conclusion against the methods, experiments, and evidence while preserving accurate, effective original expression."
    },
    role: {
      zh: "\u4F60\u662F\u4E00\u540D\u719F\u6089\u8BA1\u7B97\u673A\u79D1\u5B66\u4F1A\u8BAE\u4E0E\u671F\u520A\u5199\u4F5C\u7684\u8D44\u6DF1\u7814\u7A76\u8005\u3002\u4EE5 Method\u3001Experiments\u3001\u56FE\u8868\u548C\u53EF\u9760\u5F15\u7528\u4E3A\u4E8B\u5B9E\u57FA\u51C6\uFF0C\u5BF9\u524D\u540E\u53D9\u4E8B\u505A\u6DF1\u5EA6\u7CBE\u4FEE\uFF1B\u4FDD\u7559\u539F\u7A3F\u4E2D\u51C6\u786E\u3001\u6709\u8FA8\u8BC6\u5EA6\u4E14\u4E0E\u65B0\u4E3B\u7EBF\u4E00\u81F4\u7684\u597D\u8868\u8FBE\u3002",
      en: "You are a senior researcher experienced in computer-science conference and journal writing. Use Method, Experiments, visuals, and reliable citations as the fact base, deeply refine the narrative sections, and preserve original wording that is accurate, distinctive, and aligned with the scientific throughline."
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
      zh: "\u5141\u8BB8\u91CD\u7EC4 Abstract\u3001Introduction\u3001Related Work\u3001Discussion \u548C Conclusion \u7684\u6BB5\u843D\u4E0E\u8BC1\u636E\u987A\u5E8F\uFF0C\u4F46\u9ED8\u8BA4\u91C7\u7528\u6DF1\u5EA6\u7CBE\u4FEE\u800C\u975E\u6E05\u7A7A\u91CD\u5199\u3002Method \u4E0E Experiments \u53EA\u505A\u5FC5\u8981\u4E00\u81F4\u6027\u540C\u6B65\uFF0C\u4E0D\u538B\u7F29\u6838\u5FC3\u5185\u5BB9\u3002\u4E0D\u5F97\u6539\u53D8\u6A21\u677F\u3002",
      en: "You may reorganize paragraphs and evidence within Abstract, Introduction, Related Work, Discussion, and Conclusion, but default to deep refinement rather than blank-slate rewriting. Synchronize Method and Experiments only as needed for consistency and never compress their core content. Preserve the template."
    },
    styleBranches: {
      conference: {
        zh: "\u4F1A\u8BAE\u8BBA\u6587\u91C7\u7528\u9AD8\u5BC6\u5EA6\u3001claim-first \u7684\u53D9\u4E8B\u3002Related Work \u4F7F\u7528\u4E09\u4E2A\u5355\u6BB5\u5C0F\u8282\uFF1BDiscussion \u7531\u6A21\u578B\u6309\u8BC1\u636E\u9009\u62E9 3\u20135 \u4E2A\u4E3B\u9898\u5C0F\u8282\uFF0C\u5E76\u7528\u7EA6 100 \u8BCD\u7684 Limitations \u6536\u675F\uFF1B\u8BA8\u8BBA\u4E0D\u91CD\u590D\u7ED3\u679C\u3001\u4E0D\u5F15\u7528\u5B9E\u9A8C\u56FE\u8868\uFF0C\u7ED3\u679C\u6570\u5B57\u6700\u591A\u4E09\u4E2A\u3002",
        en: "Conference narrative is compact and claim-first. Related Work uses three one-paragraph subsections. The model selects three to five evidence-driven Discussion topics followed by an approximately 100-word Limitations subsection; Discussion does not repeat Results, cite experimental visuals, or use more than three result values."
      },
      journal: {
        zh: "\u671F\u520A\u8BBA\u6587\u91C7\u7528\u7D2F\u79EF\u5F0F\u3001\u89E3\u91CA\u5145\u5206\u7684\u53D9\u4E8B\u3002Related Work \u4F7F\u7528\u4E09\u4E2A\u53CC\u6BB5\u5C0F\u8282\uFF1BDiscussion \u7531\u6A21\u578B\u6309\u8BC1\u636E\u9009\u62E9 3\u20135 \u4E2A\u4E3B\u9898\u5C0F\u8282\uFF0C\u89E3\u91CA\u673A\u5236\u3001\u9002\u7528\u8303\u56F4\u3001\u5C40\u9650\u4E0E\u672A\u6765\u65B9\u5411\uFF0C\u4E0D\u91CD\u590D\u7ED3\u679C\u6216\u5F15\u7528\u5B9E\u9A8C\u56FE\u8868\u3002",
        en: "Journal narrative is cumulative and sufficiently explanatory. Related Work uses three two-paragraph subsections. The model selects three to five evidence-driven Discussion topics covering mechanism, scope, limitations, and future directions without repeating Results or citing experimental visuals."
      }
    },
    tasks: [
      {
        heading: {
          zh: "A. \u5EFA\u7ACB\u4E8B\u5B9E\u5E95\u7A3F\u4E0E\u4FDD\u7559\u6E05\u5355",
          en: "A. Build the Fact Base and Preservation List"
        },
        body: {
          zh: "\u4ECE\u5168\u6587\u62BD\u53D6\u4EFB\u52A1\u3001\u95EE\u9898\u3001\u6838\u5FC3\u601D\u60F3\u3001\u673A\u5236\u3001\u8BC1\u636E\u548C\u8FB9\u754C\uFF0C\u540C\u65F6\u6807\u8BB0\u539F\u7A3F\u4E2D\u51C6\u786E\u3001\u6E05\u6670\u3001\u6709\u8FA8\u8BC6\u5EA6\u4E14\u503C\u5F97\u4FDD\u7559\u7684\u53E5\u5B50\u4E0E\u8868\u8FBE\u3002\u6807\u9898\u3001\u65B9\u6CD5\u5168\u79F0\u4E0E\u8BBA\u6587\u54C1\u724C\u7F29\u5199\u6309\u5168\u5C40\u6CBB\u7406\u89C4\u5219\u540C\u6B65\u5BA1\u8BA1\u3002",
          en: "Extract the task, problem, core idea, mechanisms, evidence, and boundaries from the manuscript, while marking original sentences and expressions that are accurate, clear, distinctive, and worth preserving. Audit the title, full method name, and paper-brand acronym under the global governance rule."
        }
      },
      {
        heading: {
          zh: "B. \u6DF1\u5EA6\u7CBE\u4FEE Abstract",
          en: "B. Deeply Refine the Abstract"
        },
        body: {
          zh: "\u4F7F\u7528\u4E00\u4E2A\u8FDE\u7EED\u6BB5\u843D\u5B8C\u6210\u80CC\u666F\u4E0E\u7F3A\u53E3\u3001\u65B9\u6CD5\u6865\u63A5\u3001\u6838\u5FC3\u601D\u60F3\u4E0E\u5FC5\u8981\u673A\u5236\u3001\u5173\u952E\u5B9E\u9A8C\u53D1\u73B0\u53CA\u53D7\u8BC1\u636E\u652F\u6301\u7684\u610F\u4E49\u3002\u4E0D\u5F97\u4F7F\u7528\u5F15\u7528\u3001\u516C\u5F0F\u3001\u811A\u6CE8\u6216\u7F16\u53F7\uFF1B\u7F29\u5199\u4FDD\u6301\u514B\u5236\uFF0C\u4E0D\u5806\u53E0\u6B63\u6587\u7EA7\u4E13\u6709\u540D\u8BCD\uFF0CResults \u5EFA\u8BAE\u53EA\u4FDD\u7559 2\u20134 \u4E2A\u6700\u6709\u4EE3\u8868\u6027\u7684\u7ED3\u679C\u6570\u5B57\u3002",
          en: "Use one continuous paragraph to cover background and gap, a method bridge, the core idea and necessary mechanisms, key experimental findings, and evidence-supported implications. Use no citations, equations, footnotes, or numbering. Keep acronyms sparse, avoid body-level terminology stacks, and preferably retain only two to four representative result values."
        }
      },
      {
        heading: {
          zh: "C. \u6DF1\u5EA6\u7CBE\u4FEE Introduction \u4E0E Related Work",
          en: "C. Deeply Refine Introduction and Related Work"
        },
        body: {
          zh: `Introduction \u7531 P1\u2013P4 \u56DB\u4E2A\u6838\u5FC3\u53D9\u4E8B\u6BB5\u843D\u548C P5 \u8D21\u732E\u5757\u7EC4\u6210\uFF1AP1 \u8FDB\u5165\u4EFB\u52A1\u4E0E\u73B0\u5B9E\u7EA6\u675F\uFF1BP2 \u7EFC\u5408\u76F8\u5173\u8DEF\u7EBF\u5E76\u5F62\u6210\u7F3A\u53E3\uFF1BP3 \u660E\u786E\u4ECA\u5929\u4ECD\u672A\u89E3\u51B3\u3001\u4E14\u771F\u6B63\u51B3\u5B9A\u8BBE\u8BA1\u7684\u6311\u6218\uFF1BP4 \u56DE\u7B54 P3\uFF0C\u7ED9\u51FA\u6838\u5FC3\u601D\u60F3\u3001\u603B\u4F53\u673A\u5236\u548C\u8BBE\u8BA1\u76F4\u89C9\uFF1BP5 \u5148\u7528 \`This paper makes the following three contributions:\` \u8BF4\u660E\u8D21\u732E\u6570\u91CF\uFF0C\u518D\u4EE5 LaTeX \`itemize\` \u73AF\u5883\u5217\u51FA\u4E09\u6761\u5355\u53E5\u8D21\u732E\uFF0C\u6BCF\u4E2A \`\\item\` \u9ED8\u8BA4\u4EE5 We \u5F00\u5934\u5E76\u5BF9\u5E94\u771F\u5B9E\u673A\u5236\u4E0E\u8BC1\u636E\u3002\u662F\u5426\u589E\u52A0\u7EA6 65 \u8BCD\u7684\u72EC\u7ACB\u7AE0\u8282\u5BFC\u822A\u6BB5\u7531\u5F53\u524D\u914D\u7F6E\u51B3\u5B9A\uFF1B\u542F\u7528\u65F6\uFF0C\u8BE5\u6BB5\u4E0D\u8BA1\u5165 Introduction \u5EFA\u8BAE\u5B57\u6570\u3002P3 \u53EA\u5B9A\u4E49\u672A\u89E3\u95EE\u9898\uFF0CP4 \u53EA\u89E3\u91CA\u672C\u6587\u5982\u4F55\u56DE\u5E94\uFF0C\u907F\u514D\u91CD\u590D\u3002
Related Work \u6070\u597D\u4E09\u4E2A\u5C0F\u8282\uFF0C\u5E76\u6309\u5F53\u524D\u8BBA\u6587\u7C7B\u578B\u4F7F\u7528\u5355\u6BB5\u6216\u53CC\u6BB5\u7ED3\u6784\uFF1B\u6309\u7814\u7A76\u8303\u5F0F\u3001\u8BAD\u7EC3\u4FE1\u53F7\u3001\u7ED3\u6784\u5047\u8BBE\u3001\u6548\u7387\u6216\u6CDB\u5316\u6743\u8861\u7EFC\u5408\u3002\u6BCF\u4E2A\u5C0F\u8282\u6700\u540E\u7528\u5EFA\u8BAE\u63A7\u5236\u5728 18 \u8BCD\u4EE5\u5185\u3001\u4E14\u4E0D\u4F7F\u7528 \u201Cwe\u201D \u6216\u672C\u6587\u65B9\u6CD5\u540D\u7684\u603B\u7ED3\u53E5\u6536\u675F\uFF1B\u5FC5\u8981\u65F6\u53EF\u6309\u5185\u5BB9\u8C03\u6574\u3002\u5148\u5728\u62A5\u544A\u4E2D\u89C4\u5212\u4E3B\u9898\u548C\u73B0\u6709 BibTeX key\uFF0C\u518D\u5199\u5165 TeX\uFF1B\u4E0D\u5F97\u9010\u7BC7\u6D41\u6C34\u8D26\u3002`,
          en: `Structure the Introduction as four core narrative paragraphs, P1\u2013P4, followed by a P5 contribution block. P1 enters the task and practical constraints; P2 synthesizes related lines into the gap; P3 states the unresolved challenges that still determine the design today; and P4 answers P3 with the core idea, overall mechanism, and design intuition. P5 begins with \`This paper makes the following three contributions:\` and then lists three one-sentence contributions in a LaTeX \`itemize\` environment; each \`\\item\` begins with We by default and maps to a real mechanism and evidence. Add a separate \u224865-word paper-roadmap paragraph only when the current configuration enables it, and exclude it from the suggested Introduction word count. P3 defines the unresolved problem; P4 explains this paper's response, so they must not repeat each other.
Related Work has exactly three subsections and follows the current paper type's one- or two-paragraph rule. Synthesize paradigms, training signals, structural assumptions, efficiency, or generalization trade-offs. End each subsection with a synthesis sentence that preferably stays within 18 words but may adjust to the content and uses neither \u201Cwe\u201D nor the method name. Plan themes and existing BibTeX keys in the report before drafting; do not narrate papers one by one.`
        }
      },
      {
        heading: {
          zh: "D. \u6DF1\u5EA6\u7CBE\u4FEE Discussion \u4E0E Conclusion",
          en: "D. Deeply Refine Discussion and Conclusion"
        },
        body: {
          zh: "Discussion \u6309\u73B0\u6709\u8BC1\u636E\u7EC4\u7EC7 3\u20135 \u4E2A\u4E3B\u9898\u5C0F\u8282\uFF0C\u533A\u5206\u76F4\u63A5\u8BC1\u636E\u3001\u5408\u7406\u63A8\u65AD\u548C\u672A\u9A8C\u8BC1\u673A\u5236\uFF0C\u627F\u62C5\u7EFC\u5408\u89E3\u91CA\u800C\u4E0D\u662F\u91CD\u590D\u5B9E\u9A8C\u7ED3\u679C\uFF1B\u4E0D\u5F15\u7528 Experiments \u4E2D\u7684\u8868\u683C\u6216\u56FE\u7247\uFF0C\u7ED3\u679C\u6570\u5B57\u539F\u5219\u4E0A\u4E0D\u5199\u4E14\u6700\u591A\u4E09\u4E2A\u3002Conclusion \u7528\u4E24\u4E2A\u529F\u80FD\u660E\u786E\u7684\u6BB5\u843D\u6536\u675F\u95EE\u9898\u3001\u601D\u60F3\u3001\u8BC1\u636E\u3001\u610F\u4E49\u4E0E\u8FB9\u754C\uFF0C\u4E0D\u5F15\u5165\u65B0\u4E3B\u5F20\u3002",
          en: "Organize Discussion into three to five evidence-driven topic subsections that distinguish direct evidence, reasonable inference, and untested mechanisms, providing synthesis rather than repeating Results. Do not cite experimental tables or figures; preferably use no result values and never more than three. Use two functionally distinct Conclusion paragraphs to close the problem, idea, evidence, implications, and boundaries without new claims."
        }
      },
      {
        heading: {
          zh: "E. \u505A\u5168\u5C40\u672F\u8BED\u3001\u5F15\u7528\u548C\u4E8B\u5B9E\u5BF9\u9F50",
          en: "E. Align Global Terminology, Citations, and Facts"
        },
        body: {
          zh: "\u68C0\u67E5\u53D9\u4E8B\u7AE0\u8282\u662F\u5426\u4E0E\u5F53\u524D\u6807\u9898\u3001Method\u3001Experiments\u3001\u56FE\u8868\u3001\u8D21\u732E\u70B9\u53CA\u672F\u8BED\u4F53\u7CFB\u4E00\u81F4\u3002\u8054\u7F51\u6838\u9A8C Introduction \u4E0E Related Work \u7684\u7814\u7A76\u7F3A\u53E3\uFF1B\u628A\u6838\u9A8C\u901A\u8FC7\u4E14\u4E0D\u91CD\u590D\u7684\u65B0\u6761\u76EE\u8FFD\u52A0\u5230\u5B8C\u6574\u5F53\u524D BibTeX\uFF0C\u5E76\u8BB0\u5F55\u53D8\u66F4\u3002",
          en: "Verify that narrative sections align with the current title, Method, Experiments, visuals, contributions, and terminology. Use web research to verify the Introduction and Related Work gap; append verified non-duplicate entries to the complete current BibTeX and record each change."
        }
      }
    ],
    deliverables: {
      zh: "\u751F\u6210\u5B8C\u6574\u82F1\u6587 .tex\u3001\u4E2D\u6587\u62A5\u544A\u548C\u5B8C\u6574\u5F53\u524D BibTeX \u6587\u732E\u5E93\u3002\u62A5\u544A\u5305\u542B\u4E8B\u5B9E\u5E95\u7A3F\u3001\u539F\u7A3F\u9AD8\u4EF7\u503C\u8868\u8FBE\u4FDD\u7559\u6E05\u5355\u3001\u6807\u9898\u4E0E\u54C1\u724C\u6CBB\u7406\u72B6\u6001\u3001Abstract/Introduction \u529F\u80FD\u8868\u3001\u8D21\u732E\u5BF9\u7167\u3001Related Work \u6587\u732E\u7C07\u3001Discussion \u8BC1\u636E\u8FB9\u754C\u3001\u672F\u8BED\u5BF9\u9F50\u3001\u8054\u7F51\u6838\u9A8C\u3001\u6587\u732E\u53D8\u5316\u3001\u7CBE\u4FEE\u6E05\u5355\u548C\u4E0B\u4E00\u6B65\u4EA4\u63A5\u6458\u8981\u3002",
      en: "Create a complete English .tex, a Chinese report, and a complete current BibTeX library. The report includes the fact base, preservation list for high-value original expression, title/brand governance state, Abstract and Introduction function maps, contribution comparison, Related Work citation clusters, Discussion evidence boundaries, terminology alignment, web verification, bibliography changes, refinement log, and next-step handoff."
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
      zh: `- \u6807\u9898\u4E0E\u8BBA\u6587\u54C1\u724C\u5DF2\u81EA\u52A8\u62E9\u4F18\uFF1B\u4EFB\u4F55\u5B9E\u9645\u53D8\u5316\u5747\u6709 high-risk diff\u3002
- \u524D\u540E\u53D9\u4E8B\u5B8C\u6210\u6DF1\u5EA6\u7CBE\u4FEE\uFF0C\u5E76\u4FDD\u7559\u539F\u7A3F\u4E2D\u51C6\u786E\u6709\u529B\u7684\u8868\u8FBE\u3002
- \u65B0\u53D9\u4E8B\u4E0E Method\u3001Experiments \u548C\u56FE\u8868\u4E8B\u5B9E\u4E00\u81F4\u3002
- \u5F15\u7528 key \u5168\u90E8\u5B58\u5728\u4E8E\u5F53\u524D .bib\u3002
- \u672A\u65E0\u5FC5\u8981\u6539\u5199 Method \u4E0E Experiments\u3002
- \u5168\u6587\u7B26\u5408\u5F53\u524D\u98CE\u683C\u4E0E\u9644\u5F55\u914D\u7F6E\u3002`,
      en: `- The title and paper brand follow automatic best-option selection; every applied change has a high-risk diff.
- The narrative sections received deep refinement while preserving accurate, effective original expression.
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
      zh: "\u7EDF\u4E00\u8BED\u8A00\u3001\u672F\u8BED\u3001\u6570\u5B57\u4E0E Claim \u5F3A\u5EA6\uFF0C\u5E76\u4EE5\u539F\u7A3F\u4E3A\u57FA\u7EBF\u5B8C\u6210\u8D28\u91CF\u56DE\u5F52\u7EC8\u5BA1\u3002",
      en: "Align language, terminology, numbers, and claim strength, then complete a source-aware quality-regression audit."
    },
    role: {
      zh: "\u4F60\u662F\u4E00\u540D\u4E25\u683C\u7684 CS \u7EC8\u7A3F\u7F16\u8F91\u3001\u65B9\u6CD5\u5BA1\u7A3F\u4EBA\u3001\u5B9E\u9A8C\u5BA1\u8BA1\u8005\u548C LaTeX \u8D28\u91CF\u68C0\u67E5\u8005\u3002\u672C\u6B65\u4EE5\u6700\u65B0\u7A3F\u4E3A\u4E3B\u8981\u5BF9\u8C61\u3001\u4EE5\u91CD\u6784\u524D\u539F\u7A3F\u4E3A\u8D28\u91CF\u57FA\u7EBF\uFF0C\u8FDB\u884C\u7CBE\u4FEE\u3001\u5FAE\u8C03\u548C\u6295\u7A3F\u7EA7\u7EC8\u5BA1\u3002",
      en: "You are a strict CS final editor, method reviewer, experiment auditor, and LaTeX quality checker. Treat the latest manuscript as the working draft and the pre-reconstruction manuscript as the quality baseline for refinement, local adjustment, and final audit."
    },
    inputs: {
      zh: `- \u6700\u65B0\u5B8C\u6574 .tex\uFF0C\u4F18\u5148\u4E3A\u7B2C\u4E09\u6B65\u8F93\u51FA
- \u4E0E\u5176\u4E00\u81F4\u7684 PDF
- \u5F53\u524D\u5B8C\u6574 .bib
- \u7B2C\u56DB\u6B65\u91CD\u6784\u7684\u603B\u4F53\u6846\u67B6\u56FE PNG
- \u91CD\u6784\u524D\u7684\u539F\u59CB .tex \u4E0E\u539F\u59CB PDF\uFF0C\u7528\u4E8E\u8D28\u91CF\u56DE\u5F52\u5BF9\u7167`,
      en: `- The newest complete .tex, preferably the Step 3 output
- Its matching PDF
- The current complete .bib
- The overall-framework PNG reconstructed in Step 4
- The original pre-reconstruction .tex and PDF for quality-regression comparison`
    },
    scope: {
      zh: "\u5141\u8BB8\u53E5\u5B50\u7EA7\u4E0E\u5C40\u90E8\u6BB5\u843D\u7EA7\u7CBE\u4FEE\u3001\u53BB\u9664\u771F\u5B9E\u91CD\u590D\u3001\u6539\u5584\u8FC7\u6E21\u5E76\u6821\u51C6 claim\u3002\u9ED8\u8BA4\u4E0D\u518D\u5927\u5E45\u91CD\u6784\uFF1B\u6BCF\u9879\u4FEE\u6539\u90FD\u5E94\u878D\u5408\u8FDB\u5B8C\u6574\u6BB5\u843D\uFF0C\u800C\u4E0D\u662F\u53E0\u52A0\u8865\u4E01\u3002\u4E25\u91CD\u4E8B\u5B9E\u6216\u6570\u5B57\u9519\u8BEF\u5FC5\u987B\u4FEE\u6B63\u5E76\u6807\u4E3A\u91CD\u5927\u4FEE\u6B63\u3002",
      en: "Refine sentences and local paragraphs, remove genuine redundancy, improve transitions, and calibrate claims. Avoid another broad reconstruction by default, and integrate every change into coherent prose rather than layering patches. Correct serious factual or numeric errors and mark them as major revisions."
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
          zh: "\u5EFA\u7ACB\u6700\u7EC8 Terminology Consistency Table\uFF0C\u843D\u5B9E canonical term\u3001\u672C\u6D41\u7A0B\u786E\u5B9A\u7684\u8BBA\u6587\u54C1\u724C\u7F29\u5199\u3001\u9996\u6B21\u5B9A\u4E49\u3001\u7981\u7528\u53D8\u4F53\u3001\u5197\u4F59\u7F29\u5199\u548C\u5FC5\u987B\u533A\u5206\u7684\u6982\u5FF5\u3002\u68C0\u67E5\u6807\u9898\u3001\u6458\u8981\u3001\u6B63\u6587\u3001\u56FE\u3001\u8868\u3001caption\u3001\u516C\u5F0F\u548C\u7B97\u6CD5\u662F\u5426\u5B8C\u5168\u4E00\u81F4\u3002",
          en: "Create the final Terminology Consistency Table covering canonical terms, the paper-brand acronym selected by this workflow, first definitions, prohibited variants, redundant acronyms, and concepts that must remain distinct. Verify consistency across title, abstract, prose, figures, tables, captions, equations, and algorithms."
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
      },
      {
        heading: {
          zh: "F. \u539F\u7A3F\u8D28\u91CF\u56DE\u5F52\u95E8",
          en: "F. Source-aware Quality Regression Gate"
        },
        body: {
          zh: "\u9010\u8282\u5BF9\u7167\u91CD\u6784\u524D\u539F\u7A3F\u4E0E\u5F53\u524D\u7A3F\uFF0C\u68C0\u67E5\u662F\u5426\u4E22\u5931\u9AD8\u4EF7\u503C\u8868\u8FBE\u6216\u5B9E\u9A8C\u53D1\u73B0\u3001\u7ED3\u679C\u89E3\u91CA\u662F\u5426\u88AB\u8FC7\u5EA6\u538B\u7F29\u3001\u6807\u9898\u662F\u5426\u66F4\u51C6\u786E\u4E14\u6709\u8FA8\u8BC6\u5EA6\u3001\u7B2C\u56DB\u8F6E\u65B0\u6846\u67B6\u56FE\u662F\u5426\u6BD4\u65E7\u56FE\u66F4\u6E05\u695A\u5730\u8868\u8FBE\u79D1\u5B66\u4E3B\u7EBF\u3002\u53EA\u5BF9\u786E\u8BA4\u9000\u5316\u7684\u4F4D\u7F6E\u505A\u5C40\u90E8\u878D\u5408\u5F0F\u4FEE\u590D\uFF1B\u4FDD\u6301\u672F\u8BED\u3001\u8BED\u6C14\u4E0E\u5199\u4F5C\u624B\u6CD5\u4E00\u81F4\uFF0C\u5E76\u5728\u62A5\u544A\u4E2D\u8BB0\u5F55\u4FDD\u7559\u3001\u6062\u590D\u548C\u4E0D\u6062\u590D\u7684\u7406\u7531\u3002",
          en: "Compare the current manuscript with the pre-reconstruction source section by section. Check for lost high-value expression or experimental findings, overcompressed result interpretation, whether the title remains accurate and distinctive, and whether the new framework figure communicates the scientific throughline more clearly than the old one. Repair only confirmed regressions through localized cohesive edits, preserve terminology and authorial style, and report what was retained, restored, or intentionally not restored."
        }
      }
    ],
    deliverables: {
      zh: "\u751F\u6210\u5B8C\u6574\u82F1\u6587 .tex\u3001\u4E2D\u6587\u7EC8\u5BA1\u62A5\u544A\u548C\u5B8C\u6574\u6700\u7EC8 BibTeX \u6587\u732E\u5E93\u3002\u62A5\u544A\u5305\u542B\u91CD\u5927\u4FEE\u6B63\u3001\u672F\u8BED\u4E0E\u7F29\u5199\u3001\u8DE8\u7AE0\u8282\u5197\u4F59\u3001Claim\u2013Evidence\u3001\u6570\u5B57\u4E0E\u7EDF\u8BA1\u3001\u5F15\u7528\u4E0E LaTeX\u3001\u5BA1\u7A3F\u4EBA\u653B\u51FB\u6D4B\u8BD5\u3001\u539F\u7A3F\u8D28\u91CF\u56DE\u5F52\u8868\u3001\u4E0D\u53EF\u901A\u8FC7\u6587\u5B57\u89E3\u51B3\u7684\u98CE\u9669\u3001\u4FEE\u6539\u6E05\u5355\u548C\u6295\u7A3F\u76EE\u6807\u68C0\u7D22\u4EA4\u63A5\u6458\u8981\u3002",
      en: "Create a complete English .tex, a Chinese final-audit report, and a complete final BibTeX library. The report includes major revisions; terminology and acronyms; cross-section redundancy; Claim\u2013Evidence, numeric/statistical, citation, and LaTeX audits; reviewer attack test; source-aware quality-regression table; risks prose cannot solve; revision log; and submission-targeting handoff."
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
- \u5DF2\u4E0E\u539F\u7A3F\u9010\u8282\u5BF9\u7167\uFF0C\u9AD8\u4EF7\u503C\u8868\u8FBE\u3001\u5B9E\u9A8C\u53D1\u73B0\u548C\u5FC5\u8981\u7ED3\u679C\u89E3\u91CA\u672A\u53D1\u751F\u65E0\u58F0\u9000\u5316\u3002
- \u65B0\u6846\u67B6\u56FE\u76F8\u5BF9\u65E7\u56FE\u7684\u79D1\u5B66\u8868\u8FBE\u589E\u76CA\u5DF2\u6838\u9A8C\uFF1B\u82E5\u672A\u6539\u5584\uFF0C\u5DF2\u660E\u786E\u8BB0\u5F55\u3002
- \u672A\u6539\u53D8\u6A21\u677F\uFF0C\u6240\u6709\u4FEE\u590D\u5747\u4E3A\u5C40\u90E8\u878D\u5408\u5F0F\u7CBE\u4FEE\u3002
- \u65E0\u6CD5\u7528\u6587\u5B57\u89E3\u51B3\u7684\u98CE\u9669\u5DF2\u8BDA\u5B9E\u4FDD\u7559\u3002`,
      en: `- The manuscript received substantive refinement, not a spelling-only pass.
- Terminology, acronyms, notation, numbers, citations, and claim strength were individually verified.
- Results/Discussion and Abstract/Conclusion no longer duplicate one another.
- Section-by-section comparison found no silent loss of high-value expression, experimental findings, or necessary result interpretation.
- The new framework figure's scientific communication was compared with the old one and any lack of improvement is recorded.
- The template was preserved and every repair remained localized and cohesive.
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
      zh: "\u4F60\u662F\u4E00\u540D\u719F\u6089\u4F1A\u8BAE\u4E0E\u671F\u520A\u6295\u7A3F\u3001\u5B98\u65B9\u89C4\u5219\u6838\u9A8C\u548C\u7F16\u8F91\u7B5B\u7A3F\u903B\u8F91\u7684\u5B66\u672F\u6295\u7A3F\u987E\u95EE\u3002\u672C\u8F6E\u53EA\u505A\u76EE\u6807\u68C0\u7D22\u3001\u6838\u9A8C\u3001\u8BC4\u5206\u4E0E\u6295\u7A3F\u987A\u5E8F\uFF0C\u4E0D\u5957\u6A21\u677F\u3001\u4E0D\u6539\u683C\u5F0F\u3001\u4E0D\u91CD\u5199\u8BBA\u6587\u3002",
      en: "You are an academic submission adviser experienced in conference and journal submissions, official-rule verification, and editorial screening. This round performs targeting, verification, scoring, and submission ordering only. Do not apply templates, change formatting, or rewrite the manuscript."
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
        zh: `\u5F53\u524D\u76EE\u6807\u4E3A\u671F\u520A\u3002\u6838\u9A8C\u671F\u520A\u5168\u540D\u3001\u51FA\u7248\u793E\u3001Aims and Scope\u3001\u5F53\u524D\u53EF\u6295\u7A3F\u72B6\u6001\u3001\u6587\u7AE0\u7C7B\u578B\u3001\u4E0E\u8BBA\u6587\u7C7B\u522B\u548C\u7528\u6237\u6761\u4EF6\u76F8\u5173\u7684\u6743\u5A01\u6536\u5F55\u4F53\u7CFB\uFF08\u5982 SCIE\u3001SSCI\u3001AHCI\u3001ESCI\uFF09\u3001\u53EF\u6838\u9A8C\u7684 JCR \u5E74\u4EFD/\u7C7B\u522B/\u5206\u533A\u4E0E Journal Impact Factor\u3001OA \u6A21\u5F0F\u3001APC \u4E0E\u5E01\u79CD\u3001\u7BC7\u5E45/\u56FE\u8868/\u6458\u8981/\u53C2\u8003\u6587\u732E\u8981\u6C42\u3001\u9644\u52A0\u6587\u4EF6\u3001\u6295\u7A3F\u5165\u53E3\u548C\u6570\u636E\u653F\u7B56\u3002
\u4E0D\u5F97\u628A CiteScore\u3001SJR\u3001Scopus \u5206\u533A\u5199\u6210 JCR Journal Impact Factor \u6216 JCR \u5206\u533A\uFF0C\u4E5F\u4E0D\u5F97\u6DF7\u5199\u4E2D\u79D1\u9662\u5206\u533A\u3002\u67D0\u9879\u7D22\u5F15\u3001\u6307\u6807\u6216\u5206\u533A\u4E0D\u9002\u7528\u4E8E\u8BE5\u5B66\u79D1\u6216\u7A3F\u4EF6\u7C7B\u578B\u65F6\uFF0C\u660E\u786E\u5199\u201C\u4E0D\u9002\u7528\u201D\uFF0C\u4E0D\u80FD\u4E3A\u4E86\u6392\u5E8F\u5F3A\u884C\u5957\u7528\u3002\u82E5\u8981\u6C42\u7EFC\u8FF0\u6587\u7AE0\uFF0C\u53EA\u80FD\u4EE5\u5F53\u524D\u5B98\u7F51 Author Guidelines \u6216 Article Types \u9875\u9762\u660E\u786E\u63A5\u53D7 Review/Survey \u4E3A\u4F9D\u636E\uFF0C\u4E0D\u80FD\u4EC5\u51ED\u5386\u53F2\u4E0A\u53D1\u8868\u8FC7\u7EFC\u8FF0\u63A8\u65AD\u3002\u5BA1\u7A3F\u5468\u671F\u3001\u51FA\u7248\u9891\u7387\u6216\u63A5\u6536\u7387\u53EA\u6709\u5B98\u7F51\u660E\u786E\u63D0\u4F9B\u65F6\u624D\u8BB0\u5F55\u3002`,
        en: `The current target is a journal. Verify full title, publisher, Aims and Scope, current submission status, article type, authoritative indexing systems relevant to the manuscript category and user constraints (such as SCIE, SSCI, AHCI, or ESCI), verifiable JCR year/category/quartile and Journal Impact Factor, OA model, APC and currency, length/figure/abstract/reference requirements, additional files, submission portal, and data policies.
Never present CiteScore, SJR, or Scopus quartiles as the JCR Journal Impact Factor or JCR quartile, and never mix CAS rankings with JCR. Mark an index, metric, or ranking as \u201CNot applicable\u201D when it does not suit the field or manuscript type instead of forcing it into the ranking. If review articles are required, rely only on a current official Author Guidelines or Article Types page that explicitly accepts Review/Survey submissions; prior publication of a review is not sufficient evidence. Record review time, publication frequency, or acceptance rate only when the official site explicitly provides it.`
      }
    },
    tasks: [
      {
        heading: {
          zh: "A. \u5EFA\u7ACB Manuscript\u2013Venue Profile",
          en: "A. Build the Manuscript\u2013Venue Profile"
        },
        body: {
          zh: "\u9996\u5148\u8F93\u51FA\u6070\u597D\u4E00\u53E5\u201C\u8BBA\u6587\u7C7B\u522B\u5224\u65AD\u201D\uFF1A\u6982\u62EC\u4E3B\u8981\u5B66\u79D1\u3001\u7EC6\u5206\u9886\u57DF\u3001\u7814\u7A76\u6216\u7A3F\u4EF6\u7C7B\u578B\u3001\u6838\u5FC3\u8D21\u732E\u5F62\u6001\u548C\u76EE\u6807\u8BFB\u8005\uFF1B\u8DE8\u5B66\u79D1\u8BBA\u6587\u540C\u65F6\u6807\u660E\u4E3B\u6295\u9886\u57DF\u4E0E\u4EA4\u53C9\u9886\u57DF\u3002\u968F\u540E\u63D0\u53D6\u7814\u7A76\u95EE\u9898\u3001\u7814\u7A76\u5BF9\u8C61\u3001\u7814\u7A76\u8BBE\u8BA1\u6216\u65B9\u6CD5\u3001\u8BC1\u636E\u5F62\u6001\u3001\u8D21\u732E\u7C7B\u578B\u3001\u56FE\u8868\u4E0E\u53C2\u8003\u6587\u732E\u89C4\u6A21\u3001\u8865\u5145\u6750\u6599\u3001\u8BC1\u636E\u5F3A\u5EA6\u3001\u4E3B\u8981\u5356\u70B9\u548C\u6700\u53EF\u80FD\u7684 desk-reject/triage \u98CE\u9669\u3002\u4E0D\u5F97\u4E3A\u4E86\u5339\u914D venue \u91CD\u65B0\u5B9A\u4E49\u8BBA\u6587\u4E3B\u7EBF\u3002",
          en: "Begin with exactly one \u201CManuscript category\u201D sentence covering the primary discipline, subfield, study or article type, core contribution form, and intended readership; for interdisciplinary work, identify both the primary submission field and the intersecting field. Then extract the research question, object of study, design or methodology, evidence form, contribution type, visual and reference scale, supplementary material, evidence strength, strongest selling point, and likely desk-reject/triage risks. Do not redefine the scientific throughline to fit a venue."
        }
      },
      {
        heading: {
          zh: "B. \u5148\u5EFA\u7ACB\u5019\u9009\u6C60\uFF0C\u518D\u9010\u9879\u6838\u9A8C",
          en: "B. Build a Candidate Pool, Then Verify It"
        },
        body: {
          zh: "\u5EFA\u7ACB\u4E0E\u9886\u57DF\u89C4\u6A21\u76F8\u79F0\u7684\u5019\u9009\u6C60\uFF0C\u901A\u5E38\u4E3A 8\u201315 \u4E2A\uFF1B\u82E5\u53EF\u4FE1\u4E14\u5F53\u524D\u53EF\u6295\u7A3F\u7684\u76EE\u6807\u66F4\u5C11\uFF0C\u53EF\u4EE5\u7F29\u5C0F\u5019\u9009\u6C60\u5E76\u8BF4\u660E\u539F\u56E0\uFF0C\u4E0D\u5F97\u4E3A\u51D1\u6570\u52A0\u5165\u5F31\u76F8\u5173 venue\u3002\u9010\u9879\u6838\u9A8C\u540D\u79F0\u3001\u5B98\u65B9\u94FE\u63A5\u3001\u8303\u56F4\u5339\u914D\u3001\u5F53\u524D\u662F\u5426\u6B63\u5E38\u63A5\u6536\u6295\u7A3F\u3001\u6587\u7AE0/track \u7C7B\u578B\u3001\u5F53\u524D\u6536\u5F55\u6216\u7B49\u7EA7\u4FE1\u606F\u3001\u7BC7\u5E45\u4E0E\u9644\u5F55\u653F\u7B56\u3001\u8D39\u7528\u3001\u989D\u5916\u6750\u6599\u3001\u6295\u7A3F\u5165\u53E3\u548C\u6240\u6709\u5F71\u54CD\u6295\u7A3F\u7684\u89C4\u5219\u3002\u6BCF\u4E2A\u5F53\u524D\u4E8B\u5B9E\u90FD\u9644\u5B98\u65B9\u6216\u6743\u5A01\u6765\u6E90\uFF1B\u65E0\u6CD5\u6838\u9A8C\u5C31\u660E\u786E\u5199\u201C\u672A\u6838\u9A8C\u201D\u3002\u5DF2\u505C\u520A\u3001\u4EC5\u4FDD\u7559\u5386\u53F2\u9875\u9762\u3001\u8F6C\u6295\u4E13\u7528\u6216\u5F53\u524D\u65E0\u6CD5\u6B63\u5E38\u6295\u7A3F\u7684 venue \u4E0D\u5F97\u8FDB\u5165\u63A8\u8350\u68AF\u961F\u3002MDPI\u3001Hindawi \u548C Frontiers \u662F\u7528\u6237\u660E\u786E\u6392\u9664\u9879\uFF0C\u5176\u65D7\u4E0B\u671F\u520A\u4E0D\u5F97\u8FDB\u5165\u5019\u9009\u6C60\u3001\u8BC4\u5206\u6216\u63A8\u8350\u68AF\u961F\uFF0C\u53EA\u5728\u6392\u9664\u8BB0\u5F55\u4E2D\u6CE8\u660E\u201C\u7528\u6237\u6392\u9664\u201D\uFF0C\u4E0D\u5F97\u4F5C\u65E0\u4F9D\u636E\u7684\u6CDB\u5316\u8D28\u91CF\u5B9A\u6027\u3002",
          en: "Build a candidate pool proportionate to the field, normally eight to fifteen venues. If fewer credible venues are currently open for submission, use a smaller pool and explain why; never add weakly related venues to meet a quota. For each, verify name, official link, scope fit, whether it is active and currently accepting normal submissions, article/track type, current indexing or ranking information, length and appendix policy, fees, additional materials, submission portal, and every rule that affects submission. Cite an official or authoritative source for each current fact and mark anything unresolved as 'Not verified.' Do not recommend venues that have ceased publication, retain only an archive page, accept transfer-only submissions, or are otherwise not open for normal submission. MDPI, Hindawi, and Frontiers are explicit user exclusions: do not place their journals in the pool, scoring, or recommendation tiers. Record them only as 'excluded by user' without unsupported general quality claims."
        }
      },
      {
        heading: {
          zh: "C. \u8BC4\u5206\u5339\u914D\u5EA6\u4E0E\u98CE\u9669",
          en: "C. Score Fit and Risk"
        },
        body: {
          zh: "\u9ED8\u8BA4\u4F7F\u7528 100 \u5206\u6A21\u578B\uFF1A\u4E3B\u9898\u8303\u56F4 30\u3001\u7A3F\u4EF6\u4E0E\u8D21\u732E\u7C7B\u578B 20\u3001\u7814\u7A76\u8BBE\u8BA1\u548C\u8BC1\u636E\u6210\u719F\u5EA6 15\u3001\u76EE\u6807\u7B49\u7EA7/\u5206\u533A 15\u3001\u7BC7\u5E45\u548C\u6750\u6599\u517C\u5BB9 10\u3001\u8D39\u7528/\u65F6\u95F4\u7EA6\u675F 5\u3001\u62D2\u7A3F\u6216\u7ADE\u4E89\u98CE\u9669 5\u3002\u82E5\u67D0\u7EF4\u5EA6\u4E0D\u9002\u5408\u5F53\u524D\u5B66\u79D1\u6216\u7A3F\u4EF6\u7C7B\u578B\uFF0C\u53EF\u8C03\u6574\u8BE5\u7EF4\u5EA6\u5E76\u8BF4\u660E\u7406\u7531\uFF0C\u4F46\u603B\u5206\u4ECD\u4E3A 100\u3002\u9010\u9879\u7ED9\u51FA\u4F9D\u636E\uFF0C\u4E0D\u80FD\u628A\u540D\u6C14\u6216\u5206\u533A\u76F4\u63A5\u7B49\u540C\u4E8E\u5339\u914D\u5EA6\u3002",
          en: "Use this default 100-point model: topical scope 30, manuscript and contribution type 20, research-design and evidence maturity 15, target tier/quartile 15, length and material compatibility 10, fee/timeline constraints 5, and rejection or competition risk 5. If a dimension does not fit the field or article type, adjust it with an explicit rationale while keeping the total at 100. Explain every score and do not equate prestige or quartile directly with fit."
        }
      },
      {
        heading: {
          zh: "D. \u5F62\u6210\u6295\u7A3F\u68AF\u961F\u4E0E\u8F6C\u6295\u8DEF\u5F84",
          en: "D. Build Submission Tiers and Transfer Paths"
        },
        body: {
          zh: "\u7ED9\u51FA\u4E0D\u8D85\u8FC7 3 \u4E2A\u9996\u9009\u3001\u4E0D\u8D85\u8FC7 3 \u4E2A\u7A33\u59A5\u5907\u9009\u3001\u4E0D\u5EFA\u8BAE\u4F46\u5BB9\u6613\u8BEF\u9009\u7684 2\u20134 \u4E2A\uFF0C\u4EE5\u53CA\u552F\u4E00\u9996\u63A8\u548C\u7406\u7531\uFF1B\u53EF\u4FE1\u5019\u9009\u4E0D\u8DB3\u65F6\u4E0D\u5F97\u4E3A\u51D1\u6EE1\u6570\u91CF\u964D\u4F4E\u5339\u914D\u6807\u51C6\u3002\u4E3A\u9996\u9009\u9010\u4E00\u5206\u6790\u8303\u56F4\u3001\u8D21\u732E\u4E0E\u7A3F\u4EF6\u7C7B\u578B\u3001\u7814\u7A76\u8BBE\u8BA1\u548C\u8BC1\u636E\u3001\u7BC7\u5E45\u3001\u89C4\u5219\u4E0E\u8868\u8FBE\u98CE\u9669\uFF0C\u5E76\u7ED9\u51FA\u6295\u7A3F\u524D\u6700\u540E\u6838\u9A8C\u4E8B\u9879\u548C\u88AB\u62D2\u540E\u7684\u987A\u5E8F\u5316\u8F6C\u6295\u8DEF\u5F84\u3002",
          en: "Return up to three first-choice venues, up to three safer alternatives, two to four tempting but unsuitable venues, and one top recommendation with rationale; never lower the fit threshold merely to fill a tier. For each first choice, analyze scope, contribution and article type, research design and evidence, length, policy, and presentation risks, then provide final pre-submission checks and an ordered transfer path after rejection."
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
      zh: "\u76F4\u63A5\u5728\u5F53\u524D\u5BF9\u8BDD\u4E2D\u7ED9\u51FA\u5B8C\u6574\u4E2D\u6587\u68C0\u7D22\u7ED3\u679C\uFF0C\u4E0D\u751F\u6210\u6216\u4E0B\u8F7D .tex\u3001.md \u6216\u5176\u4ED6\u6587\u4EF6\u3002\u7ED3\u679C\u5305\u542B\u4E00\u53E5\u8BBA\u6587\u7C7B\u522B\u5224\u65AD\u3001\u6838\u9A8C\u65E5\u671F\u3001\u7EA6\u675F/\u5047\u8BBE\u3001Manuscript\u2013Venue Profile\u3001\u5019\u9009\u6C60\u3001\u6765\u6E90\u3001\u6392\u9664\u8FC7\u7A0B\u3001\u8BC4\u5206\u3001\u9996\u9009/\u5907\u9009/\u4E0D\u5EFA\u8BAE\u3001\u552F\u4E00\u9996\u63A8\u3001\u9010\u9879\u98CE\u9669\u3001\u89C4\u5219\u6458\u8981\u3001\u6295\u7A3F\u987A\u5E8F\u3001\u8F6C\u6295\u8DEF\u5F84\u3001\u672A\u6838\u9A8C\u4FE1\u606F\uFF0C\u4EE5\u53CA\u672A\u6539\u7A3F\u3001\u672A\u751F\u6210\u6587\u4EF6\u7684\u58F0\u660E\u3002",
      en: "Return the complete Chinese targeting result directly in the current conversation; do not generate or download any .tex, .md, or other file. Include the one-sentence manuscript category, verification date, constraints/assumptions, Manuscript\u2013Venue Profile, candidate pool, sources, exclusion process, scores, first choices, alternatives, unsuitable venues, one top recommendation, itemized risks, policy summary, submission order, transfer path, unverified information, and statements that the manuscript was unchanged and no file was generated."
    },
    finalChecks: {
      zh: `- \u5DF2\u5B8C\u6574\u8BFB\u53D6\u7EC8\u7A3F\u5E76\u5EFA\u7ACB\u771F\u5B9E\u8BBA\u6587\u753B\u50CF\u3002
- \u5DF2\u7528\u4E00\u53E5\u8BDD\u660E\u786E\u8BBA\u6587\u7C7B\u522B\u3001\u4E3B\u6295\u9886\u57DF\u4E0E\u9002\u7528\u7684\u8BC4\u4EF7\u4F53\u7CFB\u3002
- \u5F53\u524D venue \u4FE1\u606F\u5747\u6709\u5B98\u65B9\u6216\u6743\u5A01\u6765\u6E90\u4E0E\u6838\u9A8C\u65E5\u671F\u3002
- \u672A\u6DF7\u6DC6\u4E0D\u540C\u7D22\u5F15\u3001\u5206\u533A\u3001\u5C4A\u6B21\u6216\u5386\u53F2\u89C4\u5219\u3002
- \u672A\u58F0\u79F0\u65E0\u6CD5\u6838\u9A8C\u7684\u8D39\u7528\u3001\u5F55\u53D6\u7387\u6216\u5BA1\u7A3F\u5468\u671F\u3002
- \u5DF2\u7ED9\u51FA\u9996\u9009\u3001\u5907\u9009\u3001\u6392\u9664\u3001\u98CE\u9669\u548C\u8F6C\u6295\u8DEF\u5F84\u3002
- \u672A\u66F4\u6362\u6A21\u677F\u3001\u672A\u4FEE\u6539\u6B63\u6587\u3001\u672A\u751F\u6210\u6587\u4EF6\u3002`,
      en: `- The final manuscript was read completely and profiled accurately.
- The manuscript category, primary submission field, and applicable evaluation systems were stated in one sentence.
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
        zh: "\u5F53\u524D\u914D\u7F6E\u53EA\u5141\u8BB8\u3001\u5E76\u4E0D\u8981\u6C42\u4F7F\u7528\u9644\u5F55\u3002\u4E0D\u5F97\u53EA\u4E3A\u547D\u4E2D\u5EFA\u8BAE\u5B57\u6570\u800C\u79FB\u52A8\u5185\u5BB9\uFF1B\u6B63\u6587\u5DF2\u7ECF\u6E05\u695A\u3001\u5B8C\u6574\u4E14\u7ED3\u6784\u7D27\u51D1\u65F6\u4E0D\u4F7F\u7528\u9644\u5F55\u3002\u53EA\u6709\u6750\u6599\u672C\u8EAB\u786E\u5C5E\u8865\u5145\u5185\u5BB9\u3001\u653E\u5728\u6B63\u6587\u4F1A\u524A\u5F31\u4E3B\u7EBF\u65F6\u624D\u53EF\u8003\u8651\u79FB\u5165\u3002\u9664 {{protected_sections}} \u5916\uFF0C\u4EFB\u4F55\u79FB\u52A8\u90FD\u4E0D\u5F97\u524A\u5F31\u5B9A\u4E49\u5B8C\u6574\u6027\u548C\u8BBA\u8BC1\u95ED\u73AF\uFF0C\u4E14\u6B63\u6587\u5FC5\u987B\u4FDD\u6301\u81EA\u6D3D\u3002",
        en: "The configuration permits but does not require an appendix. Never move content merely to hit a suggested length, and omit the appendix when the main text is clear, complete, and focused. Move material only when it is genuinely supplementary and would weaken the main throughline. Outside {{protected_sections}}, no move may weaken complete definitions or argumentative closure, and the main text must remain self-contained."
      },
      disabled: {
        zh: "\u5F53\u524D\u914D\u7F6E\u672A\u542F\u7528\u9644\u5F55\uFF1A\u4E0D\u5F97\u628A\u4EFB\u4F55\u5185\u5BB9\u8F6C\u79FB\u5230\u9644\u5F55\u3002\u53EF\u4EE5\u5220\u9664\u771F\u5B9E\u91CD\u590D\u5E76\u5408\u5E76\u975E\u6838\u5FC3\u53D9\u8FF0\uFF0C\u4F46\u7BC7\u5E45\u5EFA\u8BAE\u4E0D\u6784\u6210\u5220\u51CF\u6838\u5FC3\u5185\u5BB9\u7684\u7406\u7531\uFF1B\u5FC5\u8981\u65F6\u76F4\u63A5\u504F\u79BB\u5EFA\u8BAE\u5E76\u5728\u62A5\u544A\u4E2D\u8BF4\u660E\u3002",
        en: "The current configuration disables the appendix. Do not move material outside the main text. Remove genuine repetition and consolidate non-core exposition when useful, but never treat length guidance as a reason to delete core content; deviate from the suggestion when necessary and record why."
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

- \u6838\u67E5\u5F53\u524D\u6807\u9898\u3001\u65B9\u6CD5\u5168\u79F0\u548C\u7F29\u5199\u7684\u51C6\u786E\u6027\u3001\u81EA\u7136\u5EA6\u3001\u68C0\u7D22\u6027\u53CA\u4E0E\u6700\u8FD1\u90BB\u5DE5\u4F5C\u7684\u51B2\u7A81\u98CE\u9669\uFF1B
- \u82E5\u5F53\u524D\u8EAB\u4EFD\u4ECD\u662F\u6700\u4F18\u65B9\u6848\u5219\u7EE7\u7EED\u4F7F\u7528\uFF1B\u82E5\u53D8\u66F4\u80FD\u660E\u786E\u6539\u5584\u51C6\u786E\u6027\u3001\u8FB9\u754C\u6216\u8FA8\u8BC6\u5EA6\uFF0C\u76F4\u63A5\u9009\u62E9\u5E76\u5E94\u7528\u6700\u4F18\u6807\u9898\u3001\u65B9\u6CD5\u5168\u79F0\u6216 4\u20137 \u4E2A\u62C9\u4E01\u5B57\u6BCD\u7684\u54C1\u724C\u7F29\u5199\uFF0C\u4E0D\u751F\u6210\u5EF6\u540E\u51B3\u7B56\u7684\u5019\u9009\u96C6\uFF0C\u4E5F\u4E0D\u6682\u505C\u6D41\u7A0B\uFF1B
- \u6309\u5168\u5C40\u6807\u9898\u4E0E\u54C1\u724C\u6CBB\u7406\u89C4\u5219\u8BB0\u5F55\u6BCF\u9879\u5B9E\u9645\u53D8\u66F4\uFF1B\u672A\u53D8\u66F4\u65F6\u4E5F\u8981\u8BB0\u5F55\u5BA1\u8BA1\u7ED3\u8BBA\uFF1B
{{title_word_limits}}

### \u552F\u4E00\u672F\u8BED\u4F53\u7CFB

- \u4EE5\u672C\u8F6E\u5BA1\u8BA1\u540E\u786E\u5B9A\u7684\u65B9\u6CD5\u5168\u79F0\u548C\u8BBA\u6587\u54C1\u724C\u7F29\u5199\u4E3A\u552F\u4E00\u8EAB\u4EFD\uFF1B
- \u7EDF\u4E00\u79D1\u5B66\u95EE\u9898\u3001\u6838\u5FC3\u8868\u793A\u3001\u6A21\u5757\u3001\u5206\u652F\u3001\u67E5\u8BE2\u3001\u635F\u5931\u3001\u8BAD\u7EC3\u548C\u63A8\u7406\u672F\u8BED\uFF1B
- \u7EDF\u4E00\u6570\u636E\u96C6\u3001\u6307\u6807\u3001\u6BD4\u8F83\u8BBE\u7F6E\u548C\u5B9E\u9A8C\u7C7B\u578B\u540D\u79F0\uFF1B
- \u5217\u51FA\u7981\u6B62\u7EE7\u7EED\u4F7F\u7528\u7684\u5197\u4F59\u540C\u4E49\u8BCD\uFF1B
- \u5217\u51FA\u76F8\u8FD1\u4F46\u5FC5\u987B\u533A\u5206\u3001\u4E0D\u80FD\u5408\u5E76\u7684\u6982\u5FF5\u3002

### \u7AE0\u8282\u529F\u80FD\u4E0E\u56FA\u5B9A\u7ED3\u6784

{{scientific_document_hierarchy}}
- Abstract\uFF1A\u5F62\u6210\u4E0E\u4E3B\u7EBF\u4E00\u81F4\u7684\u5DE5\u4F5C\u7248\u672C\uFF0C\u540E\u7EED\u4ECD\u4EE5\u6DF1\u5EA6\u7CBE\u4FEE\u4E3A\u4E3B\uFF1B
{{scientific_introduction_structure}}
{{scientific_related_work_structure}}
{{scientific_method_structure}}
{{scientific_experiment_structure}}
{{scientific_discussion_structure}}
- Conclusion\uFF1A\u6070\u597D\u4E24\u4E2A\u666E\u901A\u6BB5\u843D\uFF1B\u7B2C\u4E00\u6BB5\u6536\u675F\u95EE\u9898\u3001\u6838\u5FC3\u601D\u60F3\u548C\u4E3B\u8981\u53D1\u73B0\uFF0C\u7B2C\u4E8C\u6BB5\u8BF4\u660E\u610F\u4E49\u3001\u8FB9\u754C\u548C\u672A\u6765\u65B9\u5411\u3002

### \u56FE\u8868\u63A5\u53E3\u4E0E\u5B8F\u89C2\u91CD\u5199\u8FB9\u754C

- \u4E3A\u6846\u67B6\u56FE\u3001\u673A\u5236\u56FE\u3001\u4E3B\u7ED3\u679C\u8868\u3001\u6D88\u878D\u8868\u3001\u6548\u7387/\u7A33\u5065\u6027/\u6848\u4F8B\u56FE\u5206\u522B\u6307\u5B9A\u6240\u652F\u6301\u7684\u6838\u5FC3\u601D\u60F3\u3001\u673A\u5236\u3001claim \u6216\u8FB9\u754C\uFF1B
- caption \u548C\u6B63\u6587\u5FC5\u987B\u89E3\u91CA\u56FE\u8868\uFF0C\u800C\u975E\u53EA\u63D0\u5230\u56FE\u8868\uFF1B
- \u5141\u8BB8\u91CD\u6392\u7AE0\u8282\u548C\u6BB5\u843D\u3001\u5408\u5E76\u771F\u5B9E\u91CD\u590D\u3001\u7CBE\u4FEE\u5F00\u5934\u4E0E\u4E3B\u9898\u53E5\u3001\u91CD\u6784\u8D21\u732E\u3001\u8C03\u6574 Method/Experiments \u5206\u5DE5\u5E76\u5EFA\u7ACB\u5FC5\u8981\u7684 Discussion\uFF1B
- Method \u4E0E Experiments \u7684\u6838\u5FC3\u673A\u5236\u3001\u5B9E\u9A8C\u534F\u8BAE\u3001\u4E3B\u7ED3\u679C\u3001\u4E0D\u5229\u7ED3\u679C\u548C\u5FC5\u8981\u89E3\u91CA\u4E0D\u5F97\u56E0\u7BC7\u5E45\u5EFA\u8BAE\u6216\u7ED3\u6784\u6574\u7406\u800C\u538B\u7F29\uFF1B
- \u4E0D\u5F97\u66F4\u6362\u6A21\u677F\uFF0C\u4E0D\u5F97\u7528\u65B0\u6A21\u5757\u6216\u65B0\u5B9E\u9A8C\u586B\u8865\u8BC1\u636E\u7F3A\u53E3\u3002

### \u4E2D\u6587\u62A5\u544A\u56FA\u5B9A\u6E05\u5355

\u62A5\u544A\u5FC5\u987B\u5305\u542B\uFF1AScientific Positioning Contract\u3001\u6807\u9898\u4E0E\u8BBA\u6587\u54C1\u724C\u5BA1\u8BA1\u53CA high-risk diff\uFF08\u5982\u6709\uFF09\u3001\u4E00\u53E5\u8BDD\u8BBA\u6587\u4E3B\u65E8\u3001\u4E00\u53E5\u8BDD\u6838\u5FC3\u75DB\u70B9\u3001\u65E7/\u65B0\u4E3B\u7EBF\u5BF9\u7167\u3001\u8D21\u732E\u5206\u5C42\u3001Claim\u2013Evidence Map\u3001\u672F\u8BED\u8868\u3001\u7AE0\u8282\u529F\u80FD\u8868\u3001\u56FE\u8868\u89D2\u8272\u8868\u3001\u7ED3\u6784\u64CD\u4F5C\u3001\u8054\u7F51\u6838\u9A8C\u3001\u81EA\u52A8\u51B3\u7B56\u4E0E\u672A\u6838\u9A8C\u98CE\u9669\u3001\u4E0B\u4E00\u6B65\u4EA4\u63A5\u6458\u8981\u3002`,
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

The report must contain the Scientific Positioning Contract; title and paper-brand audit with any high-risk diff; one-sentence thesis and pain point; old/new throughline comparison; contribution hierarchy; Claim\u2013Evidence Map; terminology and section-function tables; visual roles; structural operations; web verification; automatic decisions and unresolved risks; and next-step handoff.`
    },
    inlineStyleConstraints: [
      {
        marker: "scientific_document_hierarchy",
        branches: {
          conference: {
            zh: "- \u4F1A\u8BAE\u8BBA\u6587\u91C7\u7528\u9AD8\u5BC6\u5EA6\u3001claim-first \u7684\u5199\u6CD5\uFF1B\u53EF\u7528\u5C42\u7EA7\u4E3A section \u2192 subsection \u2192 paragraph\uFF0C\u4F46\u6807\u9898\u53EA\u5BF9\u5E94\u72EC\u7ACB\u79D1\u5B66\u5355\u5143\uFF0C\u666E\u901A\u8BBA\u8FF0\u4FDD\u6301\u8FDE\u7EED\uFF1B",
            en: "- Conference prose is compact and claim-first. The available hierarchy is section \u2192 subsection \u2192 paragraph, but headings correspond only to independent scientific units and ordinary exposition remains continuous;"
          },
          journal: {
            zh: "- \u671F\u520A\u8BBA\u6587\u91C7\u7528\u7D2F\u79EF\u5F0F\u3001\u89E3\u91CA\u5145\u5206\u7684\u5199\u6CD5\uFF1B\u76EE\u5F55\u5C42\u7EA7\u9ED8\u8BA4\u6B62\u4E8E subsubsection\uFF0C\u5176\u4E0B\u7528\u4E3B\u9898\u53E5\u3001\u8FC7\u6E21\u548C\u81EA\u7136\u6BB5\u7EC4\u7EC7\u8FDE\u7EED\u8BBA\u8BC1\uFF1B",
            en: "- Journal prose is cumulative and sufficiently explanatory. Stop the hierarchy at subsubsection by default and organize lower-level reasoning through topic sentences, transitions, and natural paragraphs;"
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
            zh: "- Method\uFF1A\u4E0D\u5355\u8BBE Overview\uFF0C\u5728\u5408\u9002\u4F4D\u7F6E\u81EA\u7136\u5F15\u51FA\u603B\u4F53\u6846\u67B6\uFF1B\u56F4\u7ED5 why \u878D\u5408\u52A8\u673A\u3001\u8BA1\u7B97\u6784\u9020\u3001\u63A5\u53E3\u4E0E\u8FB9\u754C\u3002\u5C0F\u8282\u6570\u91CF\u7531\u771F\u5B9E\u79D1\u5B66\u5355\u5143\u51B3\u5B9A\uFF0C\u4E0D\u4E3A\u6BCF\u4E2A\u6A21\u5757\u6216\u53D9\u8FF0\u529F\u80FD\u65B0\u589E\u6807\u9898\uFF1B",
            en: "- Method: use no standalone Overview and introduce the framework where it serves the argument. Integrate motivation, computation, interfaces, and boundaries around why. Let genuine scientific units determine subsection count rather than creating a heading per component or discourse function;"
          },
          journal: {
            zh: "- Method\uFF1A\u8BBE\u7F6E\u4E24\u4E2A\u666E\u901A\u6BB5\u843D\u7684\u72EC\u7ACB Overview\uFF0C\u4F46\u4E0D\u9010\u9879\u590D\u8FF0\u6846\u67B6\u56FE\uFF1B\u56F4\u7ED5 why \u878D\u5408\u52A8\u673A\u3001\u8BA1\u7B97\u6784\u9020\u3001\u63A5\u53E3\u4E0E\u8FB9\u754C\u3002\u5C0F\u8282\u6570\u91CF\u7531\u771F\u5B9E\u79D1\u5B66\u5355\u5143\u51B3\u5B9A\uFF0C\u4E0D\u4E3A\u6BCF\u4E2A\u6A21\u5757\u6216\u53D9\u8FF0\u529F\u80FD\u65B0\u589E\u6807\u9898\uFF1B\n{{scientific_overview_word_limits}}",
            en: "- Method: use a two-paragraph standalone Overview without narrating the framework figure item by item. Integrate motivation, computation, interfaces, and boundaries around why. Let genuine scientific units determine subsection count rather than creating a heading per component or discourse function;\n{{scientific_overview_word_limits}}"
          }
        }
      },
      {
        marker: "scientific_experiment_structure",
        branches: {
          conference: {
            zh: "- Experiments and Results\uFF1A\u5148\u5728 Datasets and Experimental Setup \u4E2D\u4F9D\u6B21\u8986\u76D6 Datasets\u3001Evaluation Metrics\u3001Experimental Configuration \u548C Baselines\uFF0C\u518D\u8FDB\u5165 Main Results\uFF1B\u56DB\u9879\u662F\u5185\u5BB9\u529F\u80FD\uFF0C\u4E0D\u8981\u6C42\u673A\u68B0\u6210\u4E3A paragraph\u3002\u540E\u7EED\u5206\u6790\u6309\u8BC1\u636E\u5B89\u6392\uFF0C\u6807\u9898\u53EA\u547D\u540D\u771F\u5B9E\u5B9E\u9A8C\u3001\u53D8\u91CF\u6216\u73B0\u8C61\uFF1B",
            en: "- Experiments and Results: cover Datasets, Evaluation Metrics, Experimental Configuration, and Baselines in order within Datasets and Experimental Setup, then move to Main Results. These are content functions, not mandatory paragraph headings. Order later analyses by evidence and let headings name genuine experiments, variables, or phenomena;"
          },
          journal: {
            zh: "- Experiments and Results\uFF1A\u5148\u5728 Datasets and Experimental Setup \u4E2D\u4F9D\u6B21\u8986\u76D6 Datasets\u3001Evaluation Metrics\u3001Experimental Configuration \u548C Baselines\uFF0C\u518D\u8FDB\u5165 Main Results\uFF1B\u53EA\u5728\u5185\u5BB9\u786E\u5B9E\u6784\u6210\u72EC\u7ACB\u5355\u5143\u65F6\u8BBE\u7F6E subsubsection\u3002\u540E\u7EED\u5206\u6790\u6309\u8BC1\u636E\u5B89\u6392\uFF1B",
            en: "- Experiments and Results: cover Datasets, Evaluation Metrics, Experimental Configuration, and Baselines in order within Datasets and Experimental Setup, then move to Main Results. Use subsubsections only for genuinely independent units and order later analyses by evidence;"
          }
        }
      },
      {
        marker: "scientific_discussion_structure",
        branches: {
          conference: {
            zh: "- Discussion and Limitations\uFF1A\u7531\u6A21\u578B\u6309\u8BC1\u636E\u9009\u62E9 3\u20135 \u4E2A\u627F\u62C5\u7EFC\u5408\u89E3\u91CA\u3001\u9002\u7528\u8303\u56F4\u4E0E\u79D1\u5B66\u610F\u4E49\u7684 discussion subsection\uFF0C\u6700\u540E\u5355\u5217 Limitations\u3002Discussion \u4E0D\u590D\u8FF0\u7ED3\u679C\u3001\u4E0D\u5F15\u7528\u5B9E\u9A8C\u56FE\u8868\uFF0C\u5177\u4F53\u7ED3\u679C\u6570\u5B57\u6700\u591A\u4E09\u4E2A\uFF1B\n{{scientific_limitations_word_limits}}",
            en: "- Discussion and Limitations: let the model select three to five evidence-driven discussion subsections for synthesis, scope, and scientific implications, followed by Limitations. Discussion does not repeat Results or cite experimental visuals and uses at most three result values;\n{{scientific_limitations_word_limits}}"
          },
          journal: {
            zh: "- Discussion\uFF1A\u72EC\u7ACB\u6210\u8282\uFF0C\u7531\u6A21\u578B\u6309\u8BC1\u636E\u9009\u62E9 3\u20135 \u4E2A\u4E3B\u9898\u5C0F\u8282\uFF0C\u8986\u76D6\u673A\u5236\u89E3\u91CA\u3001\u9002\u7528\u8303\u56F4\u3001\u610F\u4E49\u4E0E\u5C40\u9650\uFF1B\u4E0D\u590D\u8FF0\u7ED3\u679C\u3001\u4E0D\u5F15\u7528\u5B9E\u9A8C\u56FE\u8868\uFF0C\u5177\u4F53\u7ED3\u679C\u6570\u5B57\u6700\u591A\u4E09\u4E2A\uFF1B",
            en: "- Discussion: use a standalone section with three to five evidence-driven topic subsections covering mechanism, scope, implications, and limitations. Do not repeat Results or cite experimental visuals, and use at most three result values;"
          }
        }
      }
    ],
    inlinePreferenceConstraints: [
      {
        marker: "scientific_introduction_structure",
        contextKey: "includeSectionNavigationSentence",
        branches: {
          enabled: {
            zh: "- Introduction\uFF1AP1\u2013P4 \u4F7F\u7528\u56DB\u4E2A\u6838\u5FC3\u53D9\u4E8B\u6BB5\u843D\uFF0C\u4F9D\u6B21\u627F\u62C5\u80CC\u666F\u4E0E\u4EFB\u52A1\u3001\u76F8\u5173\u8DEF\u7EBF\u4E0E\u7F3A\u53E3\u3001\u4ECA\u5929\u4ECD\u672A\u89E3\u51B3\u4E14\u51B3\u5B9A\u8BBE\u8BA1\u7684\u6311\u6218\u3001\u672C\u6587\u7684\u6838\u5FC3\u601D\u60F3\u4E0E\u603B\u4F53\u56DE\u5E94\u3002P5 \u5148\u5199\u5F15\u5BFC\u53E5 `This paper makes the following three contributions:`\uFF0C\u518D\u4F7F\u7528 `\\begin{itemize}`\u3001\u4E09\u4E2A `\\item` \u548C `\\end{itemize}` \u7ED9\u51FA\u4E09\u6761\u5355\u53E5\u8D21\u732E\uFF1B\u6BCF\u4E2A\u6761\u76EE\u9ED8\u8BA4\u4EE5 `We` \u5F00\u5934\u5E76\u5BF9\u5E94\u771F\u5B9E\u673A\u5236\u4E0E\u8BC1\u636E\u3002\u8D21\u732E\u5757\u540E\u589E\u52A0\u4E00\u4E2A\u7EA6 65 \u8BCD\u7684\u72EC\u7ACB\u7AE0\u8282\u5BFC\u822A\u6BB5\uFF1B\u8BE5\u6BB5\u53EA\u8BF4\u660E\u8BBA\u6587\u7EC4\u7EC7\u3001\u4E0D\u627F\u8F7D\u65B0\u8BBA\u8BC1\u6216\u5F15\u7528\uFF0C\u4E14\u4E0D\u8BA1\u5165 Introduction \u5EFA\u8BAE\u5B57\u6570\uFF1B",
            en: "- Introduction: use four core narrative paragraphs for background/task, research lines/gap, the challenges that remain unresolved today and determine the design, and this paper's core idea and response. P5 begins with `This paper makes the following three contributions:`, then uses `\\begin{itemize}`, three `\\item` entries, and `\\end{itemize}` for three one-sentence contributions; each item begins with `We` by default and maps to a real mechanism and evidence. Follow the contribution block with a separate paper-roadmap paragraph of about 65 words. It states organization only, carries no new argument or citation, and is excluded from the suggested Introduction word count;"
          },
          disabled: {
            zh: "- Introduction\uFF1AP1\u2013P4 \u4F7F\u7528\u56DB\u4E2A\u6838\u5FC3\u53D9\u4E8B\u6BB5\u843D\uFF0C\u4F9D\u6B21\u627F\u62C5\u80CC\u666F\u4E0E\u4EFB\u52A1\u3001\u76F8\u5173\u8DEF\u7EBF\u4E0E\u7F3A\u53E3\u3001\u4ECA\u5929\u4ECD\u672A\u89E3\u51B3\u4E14\u51B3\u5B9A\u8BBE\u8BA1\u7684\u6311\u6218\u3001\u672C\u6587\u7684\u6838\u5FC3\u601D\u60F3\u4E0E\u603B\u4F53\u56DE\u5E94\u3002P5 \u5148\u5199\u5F15\u5BFC\u53E5 `This paper makes the following three contributions:`\uFF0C\u518D\u4F7F\u7528 `\\begin{itemize}`\u3001\u4E09\u4E2A `\\item` \u548C `\\end{itemize}` \u7ED9\u51FA\u4E09\u6761\u5355\u53E5\u8D21\u732E\uFF1B\u6BCF\u4E2A\u6761\u76EE\u9ED8\u8BA4\u4EE5 `We` \u5F00\u5934\u5E76\u5BF9\u5E94\u771F\u5B9E\u673A\u5236\u4E0E\u8BC1\u636E\u3002\u4E0D\u5199\u7AE0\u8282\u5BFC\u822A\u6BB5\uFF1B",
            en: "- Introduction: use four core narrative paragraphs for background/task, research lines/gap, the challenges that remain unresolved today and determine the design, and this paper's core idea and response. P5 begins with `This paper makes the following three contributions:`, then uses `\\begin{itemize}`, three `\\item` entries, and `\\end{itemize}` for three one-sentence contributions; each item begins with `We` by default and maps to a real mechanism and evidence. Omit the paper-roadmap paragraph;"
          }
        }
      }
    ],
    inlineWordLimits: [
      {
        marker: "title_word_limits",
        standard: {
          zh: "- \u542F\u7528\u7BC7\u5E45\u5EFA\u8BAE\u65F6\uFF0C\u6807\u9898\u53EF\u53C2\u8003 8\u201316 \u4E2A\u82F1\u6587\u5355\u8BCD\uFF1B\u4EE5\u51C6\u786E\u3001\u81EA\u7136\u548C\u6709\u8FA8\u8BC6\u5EA6\u4E3A\u5148\uFF0C\u53EF\u6839\u636E\u8BBA\u6587\u5185\u5BB9\u504F\u79BB\u3002",
          en: "- When length guidance is enabled, use 8\u201316 English words as an optional title reference; accuracy, naturalness, and distinctiveness take priority, and the paper may justify a different length."
        }
      },
      {
        marker: "scientific_overview_word_limits",
        standard: {
          zh: "- \u542F\u7528\u7BC7\u5E45\u5EFA\u8BAE\u65F6\uFF0C\u671F\u520A Method Overview \u5EFA\u8BAE\u7EA6 80 \u8BCD\uFF1B\u82E5\u79D1\u5B66\u903B\u8F91\u9700\u8981\uFF0C\u53EF\u9002\u5EA6\u8C03\u6574\u3002",
          en: "- When length guidance is enabled, about 80 words is suggested for the journal Method Overview; adjust when the scientific logic requires it."
        }
      },
      {
        marker: "scientific_limitations_word_limits",
        standard: {
          zh: "- \u542F\u7528\u7BC7\u5E45\u5EFA\u8BAE\u65F6\uFF0C\u4F1A\u8BAE\u8BBA\u6587\u7684 Limitations subsection \u53EF\u53C2\u8003\u7EA6 100 \u8BCD\uFF0C\u5E76\u6309\u771F\u5B9E\u5C40\u9650\u6570\u91CF\u4E0E\u91CD\u8981\u6027\u8C03\u6574\u3002",
          en: "- When length guidance is enabled, use about 100 words as an optional reference for conference-paper Limitations and adjust to the number and importance of genuine limitations."
        }
      }
    ],
    wordLimitPlacement: "after-budget",
    wordLimit: {
      zh: `### \u672C\u6B65\u9AA4\u7BC7\u5E45\u5EFA\u8BAE\u4E0E\u9644\u5F55\u5206\u6D41

- \u5B8C\u6574\u7406\u89E3\u5F53\u524D\u8BBA\u6587\u540E\uFF0C\u628A\u9875\u9762\u7ED9\u51FA\u7684\u603B\u5B57\u6570\u548C\u7AE0\u8282\u6570\u5B57\u4EC5\u4F5C\u4E3A\u7ED3\u6784\u53C2\u8003\uFF0C\u4E0D\u4F5C\u4E3A\u786C\u4E0A\u9650\u6216\u9A8C\u6536\u6761\u4EF6\uFF1B
- \u82E5\u672C\u6B65\u9AA4\u4E3A\u7406\u987A\u7ED3\u6784\u800C\u9700\u8981\u6269\u5C55\u6B63\u6587\uFF0C\u53EF\u628A\u5EFA\u8BAE\u503C\u4E0A\u6D6E {{temporary_ceiling_percent}}%\uFF08\u7EA6 {{temporary_ceiling_words}} \u8BCD\uFF09\u4F5C\u4E3A\u89C2\u5BDF\u533A\u95F4\uFF1B\u5B83\u4ECD\u662F\u53EF\u9009\u53C2\u8003\uFF0C\u4E0D\u662F\u4E34\u65F6\u4E0A\u9650\uFF1B
- \u5BF9\u660E\u663E\u8D85\u51FA\u5EFA\u8BAE\u4E14\u53EF\u80FD\u5F71\u54CD\u805A\u7126\u5EA6\u7684\u5185\u5BB9\u5EFA\u7ACB\u201C\u4FDD\u7559\u6B63\u6587 / \u79FB\u5165\u9644\u5F55 / \u5220\u9664\u91CD\u590D\u201D\u6E05\u5355\uFF0C\u5E76\u6309\u79D1\u5B66\u5FC5\u8981\u6027\u8BF4\u660E\u4F9D\u636E\uFF1B\u504F\u79BB\u5EFA\u8BAE\u672C\u8EAB\u4E0D\u662F\u9519\u8BEF\uFF1B
- {{appendix_triage_rule}}
- {{protected_sections}} \u662F\u6B63\u6587\u6838\u5FC3\u4FDD\u62A4\u533A\u3002Method \u7684\u95EE\u9898\u5B9A\u4E49\u3001\u5FC5\u8981\u673A\u5236\u3001\u516C\u5F0F\u63A5\u53E3\u548C\u8BAD\u7EC3/\u63A8\u7406\u8BF4\u660E\u4E0D\u5F97\u56E0\u538B\u7F29\u800C\u6B8B\u7F3A\uFF0C\u4E5F\u4E0D\u5F97\u79FB\u5165\u9644\u5F55\uFF1B
- Experiments and Results \u7684\u73B0\u6709\u5185\u5BB9\u4E0D\u5F97\u7CBE\u7B80\u3001\u5220\u9664\u3001\u5F31\u5316\u6216\u79FB\u5165\u9644\u5F55\uFF0C\u5305\u62EC\u5B9E\u9A8C\u8BBE\u7F6E\u3001\u6BD4\u8F83\u534F\u8BAE\u3001\u4E3B\u7ED3\u679C\u3001\u6D88\u878D\u3001\u7A33\u5065\u6027\u3001\u654F\u611F\u6027\u3001\u5B9A\u6027\u7ED3\u679C\u3001\u5931\u8D25\u6848\u4F8B\u548C\u5FC5\u8981\u89E3\u91CA\uFF1B
- Abstract \u4FDD\u6301\u4E3A\u4E34\u65F6\u7248\u672C\uFF1B\u5176\u4ED6\u7AE0\u8282\u4F18\u5148\u5220\u9664\u91CD\u590D\u80CC\u666F\u3001\u504F\u79BB\u4E3B\u7EBF\u7684\u94FA\u9648\u548C\u91CD\u590D\u7ED3\u8BBA\uFF1B
- \u4E2D\u6587\u62A5\u544A\u8BB0\u5F55\u5F53\u524D\u603B\u8BCD\u6570\u3001\u5EFA\u8BAE\u53C2\u8003\u503C\u3001\u9010\u8282\u8BCD\u6570\u3001\u504F\u79BB\u5EFA\u8BAE\u7684\u5FC5\u8981\u7406\u7531\uFF0C\u4EE5\u53CA\u6BCF\u9879\u4FDD\u7559\u3001\u5220\u9664\u91CD\u590D\u6216\u79FB\u5165\u9644\u5F55\u7684\u51B3\u5B9A\uFF1B
- \u540E\u7EED\u6B65\u9AA4\u7EE7\u7EED\u628A\u7BC7\u5E45\u6570\u5B57\u89C6\u4E3A\u53EF\u9009\u5EFA\u8BAE\uFF0C\u5E76\u6309\u5185\u5BB9\u9700\u8981\u91CD\u65B0\u5224\u65AD\u662F\u5426\u91C7\u7EB3\u3002`,
      en: `### Length Guidance and Appendix Triage for This Step

- After understanding the complete manuscript, use the configured total and section numbers only as structural references, never as hard caps or acceptance criteria;
- If restructuring benefits from temporary expansion, a {{temporary_ceiling_percent}}% increase (about {{temporary_ceiling_words}} words) may serve as an observation range. It remains optional guidance, not a temporary ceiling;
- For content far above the suggestion that may weaken focus, create an itemized keep-in-main-text / move-to-appendix / remove-duplication ledger and justify decisions by scientific necessity. Deviation itself is not an error;
- {{appendix_triage_rule}}
- {{protected_sections}} are protected core sections. Do not make Method's problem definition, necessary mechanisms, equation interfaces, or training/inference description incomplete through compression, and do not move them to the appendix;
- Do not condense, delete, weaken, or move any existing Experiments and Results content to the appendix, including settings, comparison protocols, main results, ablations, robustness, sensitivity, qualitative findings, failure cases, and necessary interpretation;
- Keep Abstract temporary. In other sections, remove repeated background, off-throughline exposition, and repeated conclusions first;
- The Chinese report must record the current total, suggested reference, per-section counts, necessary reasons for deviations, and every keep, duplication-removal, or appendix-move decision;
- Later steps continue to treat all length numbers as optional guidance and reassess them against the content.`
    },
    flexibleCoreWordLimit: {
      zh: `### \u4EC5\u4E3A\u975E\u6838\u5FC3\u7AE0\u8282\u63D0\u4F9B\u7BC7\u5E45\u5EFA\u8BAE

- \u6B63\u6587\u4E0D\u8BBE\u603B\u91CF\u5EFA\u8BAE\uFF0C20% \u89C2\u5BDF\u533A\u95F4\u4E0D\u9002\u7528\uFF1B
- Method \u4E0E Experiments and Results \u5FC5\u987B\u6309\u79D1\u5B66\u5B8C\u6574\u6027\u548C\u8BC1\u636E\u9700\u8981\u5145\u5206\u4FDD\u7559\uFF0C\u4E0D\u5F97\u56E0\u7BC7\u5E45\u7CBE\u7B80\u3001\u5220\u9664\u3001\u5F31\u5316\u6216\u79FB\u5165\u9644\u5F55\uFF1B
- {{appendix_triage_rule}}
- \u5176\u4ED6\u7AE0\u8282\u7684\u6570\u5B57\u4E5F\u53EA\u662F\u53EF\u9009\u5EFA\u8BAE\uFF1B\u4E2D\u6587\u62A5\u544A\u8BB0\u5F55\u9010\u8282\u8BCD\u6570\u3001\u8868\u683C\u4E0E\u56FE\u7247\u6298\u7B97\u6570\u3001\u662F\u5426\u91C7\u7EB3\u5EFA\u8BAE\u53CA\u7406\u7531\uFF0C\u4EE5\u53CA\u6BCF\u9879\u4FDD\u7559\u3001\u5220\u9664\u91CD\u590D\u6216\u79FB\u5165\u9644\u5F55\u7684\u51B3\u5B9A\u3002`,
      en: `### Length Guidance Only Outside Method and Experiments

- Because no main-text total is suggested, the 20% observation range does not apply;
- Preserve Method and Experiments & Results as scientific completeness and evidence require; never condense, delete, weaken, or move their content to the appendix merely for length;
- {{appendix_triage_rule}}
- Numbers for all other sections are optional guidance as well. The Chinese report records per-section counts, table/figure equivalents, whether each suggestion was adopted and why, and every keep, duplication-removal, or appendix-move decision.`
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

1. \u5148\u7528 Datasets and Experimental Setup \u5EFA\u7ACB\u53EF\u590D\u73B0\u6761\u4EF6\uFF0C\u518D\u7531 Main Results \u56DE\u7B54\u4E3B\u8981 claim\uFF1B\u540E\u7EED\u5C0F\u8282\u6309\u771F\u5B9E\u8BC1\u636E\u7EC4\u7EC7 Ablation Studies\u3001\u673A\u5236/\u6548\u7387/\u53C2\u6570\u5206\u6790\u3001Case Studies and Qualitative Analysis\u3001\u7A33\u5065\u6027\u3001\u654F\u611F\u6027\u3001\u6CDB\u5316\u6216\u9519\u8BEF\u5206\u6790\u3002
2. {{experiment_setup_structure}}
3. Datasets and Experimental Setup \u6309 Datasets \u2192 Evaluation Metrics \u2192 Experimental Configuration \u2192 Baselines \u8986\u76D6\u56DB\u9879\u529F\u80FD\uFF1B\u5B83\u4EEC\u4E0D\u5FC5\u673A\u68B0\u6210\u4E3A\u56DB\u4E2A\u6807\u9898\u3002\u53EA\u5199\u6750\u6599\u80FD\u591F\u786E\u8BA4\u7684\u6765\u6E90\u3001\u5212\u5206\u3001\u6307\u6807\u3001\u914D\u7F6E\u548C\u516C\u5E73\u6BD4\u8F83\u6761\u4EF6\u3002
4. Main Results \u6309\u201C\u603B\u4F53\u89C2\u5BDF \u2192 \u4E0E\u5F3A\u57FA\u7EBF\u6BD4\u8F83 \u2192 \u8DE8\u6570\u636E\u96C6/\u6307\u6807\u7A33\u5B9A\u6027 \u2192 \u8BC1\u636E\u8FB9\u754C\u201D\u7EC4\u7EC7\uFF0C\u53EA\u9009\u62E9\u5173\u952E\u6570\u5B57\uFF0C\u4E0D\u9010\u5355\u5143\u683C\u6717\u8BFB\u3002
5. \u6BCF\u4E2A\u6D88\u878D\u3001\u66FF\u6362\u6216\u654F\u611F\u6027\u8BBE\u7F6E\u90FD\u5FC5\u987B\u5BF9\u5E94\u660E\u786E\u8BBE\u8BA1\u95EE\u9898\uFF1B\u533A\u5206\u6A21\u5757\u5FC5\u8981\u6027\u3001\u53C2\u6570\u9009\u62E9\u548C\u8BAD\u7EC3\u6280\u5DE7\uFF1B\u6CA1\u6709\u591A\u968F\u673A\u79CD\u5B50\u6216\u7EDF\u8BA1\u652F\u6301\u65F6\u4E0D\u5F97\u628A\u5C0F\u5E45\u6CE2\u52A8\u89E3\u91CA\u6210\u786E\u5B9A\u89C4\u5F8B\u3002
6. \u6BCF\u4E2A\u5B9E\u9A8C\u5C0F\u8282\u7528\u8FDE\u7EED\u6BB5\u843D\u8BF4\u660E\u7814\u7A76\u95EE\u9898\u3001\u51B3\u5B9A\u6027\u8BC1\u636E\u3001\u5408\u7406\u89E3\u91CA\u3001\u4E0E\u6838\u5FC3 claim \u7684\u5173\u7CFB\u548C\u8FB9\u754C\u3002\u6807\u9898\u53EA\u547D\u540D\u771F\u5B9E\u5B9E\u9A8C\u3001\u53D8\u91CF\u6216\u73B0\u8C61\uFF1B\u6839\u636E\u8BC1\u636E\u5BC6\u5EA6\u51B3\u5B9A\u5C42\u7EA7\uFF0C\u4E0D\u4E3A\u6BCF\u5F20\u56FE\u8868\u6216\u53D9\u8FF0\u529F\u80FD\u65B0\u589E\u6807\u9898\u3002
7. \u4FDD\u7559\u5168\u90E8\u5B9E\u9A8C\u8BBE\u7F6E\u3001\u6838\u5FC3\u7ED3\u679C\u3001\u4E0D\u5229\u7ED3\u679C\u548C\u5FC5\u8981\u89E3\u91CA\uFF1B\u53EA\u5220\u9664\u771F\u5B9E\u91CD\u590D\uFF0C\u4E0D\u56E0\u7BC7\u5E45\u5EFA\u8BAE\u538B\u7F29\u8BC1\u636E\u94FE\u3002
8. \u5BF9\u6BCF\u5F20\u5B9E\u9A8C\u56FE\u68C0\u67E5 caption\u3001\u56FE\u4F8B\u3001\u6570\u503C\u4E0E\u6B63\u6587\u89E3\u91CA\u662F\u5426\u4E00\u81F4\uFF0C\u4EE5\u53CA\u89C6\u89C9\u8BC1\u636E\u662F\u5426\u771F\u7684\u652F\u6301 claim\u3002
{{experiments_word_limits}}

### \u4E2D\u6587\u62A5\u544A\u56FA\u5B9A\u6E05\u5355

\u62A5\u544A\u5FC5\u987B\u5305\u542B\uFF1AMethod \u903B\u8F91\u56FE\u8C31\u3001\u65B9\u6CD5\u5C0F\u8282\u91CD\u6784\u5BF9\u7167\u3001\u516C\u5F0F\u4E0E\u7B26\u53F7\u5BA1\u8BA1\u3001\u73B0\u6709\u56FE\u8868\u4E0E\u6B63\u6587\u63A5\u53E3\u5BA1\u8BA1\u3001Experiment Question\u2013Evidence \u8868\u3001\u5B9E\u9A8C\u987A\u5E8F\u8BBE\u8BA1\u3001\u6570\u5B57\u4E0E\u7EDF\u8BA1\u98CE\u9669\u3001\u5220\u9664\u6216\u5F31\u5316\u7684\u673A\u5236\u4E3B\u5F20\u3001\u8054\u7F51\u57FA\u7EBF\u4E0E\u534F\u8BAE\u6838\u9A8C\u3001\u4FEE\u6539\u6E05\u5355\u3001\u672A\u6838\u9A8C\u98CE\u9669\u548C\u4E0B\u4E00\u8F6E\u4EA4\u63A5\u6458\u8981\u3002Question\u2013Evidence \u8868\u662F\u62A5\u544A\u4E2D\u7684\u89C4\u5212\u4E0E\u5BA1\u8BA1\u5DE5\u5177\uFF0C\u5176\u5217\u540D\u4E0D\u5F97\u53D8\u6210 TeX \u4E2D\u91CD\u590D\u7684\u5C0F\u6807\u9898\u6216\u53E5\u9996\u6807\u7B7E\u3002`,
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

1. Establish reproducible conditions in Datasets and Experimental Setup, then let Main Results answer the primary claims. Order later Ablation Studies, mechanism/efficiency/parameter analyses, Case Studies and Qualitative Analysis, robustness, sensitivity, generalization, or error analysis by the available evidence.
2. {{experiment_setup_structure}}
3. Cover Datasets \u2192 Evaluation Metrics \u2192 Experimental Configuration \u2192 Baselines in that order within Datasets and Experimental Setup. They are four content functions, not mandatory headings. Include only verified sources, splits, metrics, configurations, and fairness conditions.
4. Organize Main Results as overall observation \u2192 comparison with strong baselines \u2192 consistency across datasets/metrics \u2192 evidence boundary. Select only decisive numbers and do not narrate every cell.
5. Every removal, replacement, or sensitivity setting must answer a clear design question. Separate component necessity, parameter choice, and training tricks. Without multiple seeds or statistical support, do not turn small variation into a deterministic rule.
6. Use continuous prose in each experiment subsection to establish the research question, decisive evidence, warranted interpretation, relation to the core claim, and boundary. Let headings name genuine experiments, variables, or phenomena; let evidence density determine hierarchy rather than adding a heading for each visual or discourse function.
7. Preserve all settings, core and unfavorable results, and necessary interpretation. Remove only genuine repetition and never compress the evidence chain for a length suggestion.
8. For every experimental figure, verify that caption, legend, values, and prose interpretation agree and that the visual supports the claim.
{{experiments_word_limits}}

### Fixed Chinese-report Checklist

The report must contain the Method logic map, old/new Method subsection comparison, equation and notation audit, existing-visual-to-prose interface audit, Experiment Question\u2013Evidence table, experiment-order rationale, numeric/statistical risks, removed or qualified mechanism claims, web verification of baselines and protocols, revision log, unresolved verification risks, and next-step handoff. Treat the Question\u2013Evidence table as a report-only planning and audit device; never turn its column labels into repeated TeX headings or sentence prefixes.`
    },
    inlineStyleConstraints: [
      {
        marker: "method_document_hierarchy",
        branches: {
          conference: {
            zh: "\u4F1A\u8BAE\u8BBA\u6587\u4F7F\u7528 section \u2192 subsection \u2192 paragraph\uFF1B\u6807\u9898\u53EA\u5BF9\u5E94\u771F\u5B9E\u79D1\u5B66\u5355\u5143\uFF0C\u666E\u901A\u8BBA\u8FF0\u4FDD\u6301\u8FDE\u7EED\u3002\u65B9\u6CD5\u7ED3\u6784\u6309\u79D1\u5B66\u903B\u8F91\u800C\u975E\u4EE3\u7801\u7C7B\u540D\u7EC4\u7EC7\u3002",
            en: "Conference papers use section \u2192 subsection \u2192 paragraph. Headings correspond only to genuine scientific units and ordinary exposition remains continuous. Organize Method by scientific logic rather than code class names."
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
            zh: "\u5728 \\subsection{Datasets and Experimental Setup} \u5185\u4F9D\u6B21\u8986\u76D6 Datasets\u3001Evaluation Metrics\u3001Experimental Configuration \u548C Baselines\u3002\u6839\u636E\u5185\u5BB9\u5BC6\u5EA6\u51B3\u5B9A\u662F\u5426\u4F7F\u7528 paragraph\uFF1B\u4E0D\u5F97\u4E3A\u4E86\u56DB\u9879\u5BF9\u79F0\u800C\u5F3A\u5236\u589E\u52A0\u6807\u9898\u3002",
            en: "Inside \\subsection{Datasets and Experimental Setup}, cover Datasets, Evaluation Metrics, Experimental Configuration, and Baselines in order. Use paragraph headings only when content density warrants them; do not force four symmetric headings."
          },
          journal: {
            zh: "\u5728 \\subsection{Datasets and Experimental Setup} \u5185\u4F9D\u6B21\u8986\u76D6 Datasets\u3001Evaluation Metrics\u3001Experimental Configuration \u548C Baselines\u3002\u53EA\u5728\u5185\u5BB9\u786E\u5B9E\u6784\u6210\u72EC\u7ACB\u79D1\u5B66\u5355\u5143\u65F6\u4F7F\u7528 subsubsection\uFF0C\u907F\u514D\u6807\u51C6\u6587\u6863\u5F0F\u5C42\u7EA7\u3002",
            en: "Inside \\subsection{Datasets and Experimental Setup}, cover Datasets, Evaluation Metrics, Experimental Configuration, and Baselines in order. Use subsubsections only for genuinely independent scientific units and avoid document-style over-structuring."
          }
        }
      }
    ],
    inlineWordLimits: [
      {
        marker: "journal_overview_word_limits",
        standard: {
          zh: "- \u542F\u7528\u7BC7\u5E45\u5EFA\u8BAE\u65F6\uFF0C\u671F\u520A Overview \u4E24\u6BB5\u53EF\u53C2\u8003\u7EA6 80 \u8BCD\uFF0C\u5E76\u6309\u79D1\u5B66\u903B\u8F91\u9700\u8981\u8C03\u6574\u3002",
          en: "- When length guidance is enabled, use about 80 words as an optional reference for the two journal Overview paragraphs and adjust to the scientific logic."
        }
      },
      {
        marker: "method_word_limits",
        standard: {
          zh: `- \u542F\u7528\u7BC7\u5E45\u5EFA\u8BAE\u65F6\uFF0CProblem Definition \u53EF\u53C2\u8003 {{problem_definition_min}}\u2013{{problem_definition_max}} \u8BCD\uFF0CMethod \u53EF\u53C2\u8003\u5F53\u524D\u914D\u7F6E\u8303\u56F4\uFF0C\u82F1\u6587\u53E5\u5B50\u901A\u5E38\u5EFA\u8BAE\u4E0D\u8D85\u8FC7 24 \u8BCD\uFF1B\u5747\u53EF\u6309\u673A\u5236\u5B8C\u6574\u6027\u8C03\u6574\u3002`,
          en: `- When length guidance is enabled, use {{problem_definition_min}}\u2013{{problem_definition_max}} words as an optional reference for Problem Definition and the configured range for Method; English sentences are generally suggested to stay within 24 words. Adjust all of these for mechanism completeness.`
        },
        flexibleCore: {
          zh: `- \u5F53\u524D Method \u4E0D\u8BBE\u8BCD\u6570\u5EFA\u8BAE\uFF1BProblem Definition \u4E0E\u5F53\u524D\u8BBA\u6587\u7C7B\u578B\u89C4\u5B9A\u7684 Overview \u7ED3\u6784\u4ECD\u987B\u6EE1\u8DB3\uFF0C\u82F1\u6587\u53E5\u5B50\u901A\u5E38\u5EFA\u8BAE\u4E0D\u8D85\u8FC7 24 \u8BCD\u3002\u6309\u673A\u5236\u5B8C\u6574\u6027\u5C55\u5F00\u5E76\u5220\u9664\u91CD\u590D\uFF0C\u4E0D\u5F97\u4E3A\u4E86\u6269\u5199\u589E\u52A0\u65E0\u8BC1\u636E\u5185\u5BB9\u3002`,
          en: `- Method has no suggested word range. Problem Definition and the Overview structure defined for the current paper type still apply, while English sentences are generally suggested to stay within 24 words. Develop only what mechanism completeness requires, remove repetition, and never add unsupported material merely to expand the section.`
        }
      },
      {
        marker: "experiments_word_limits",
        standard: {
          zh: `- \u542F\u7528\u7BC7\u5E45\u5EFA\u8BAE\u65F6\uFF0CExperiments and Results \u53EF\u53C2\u8003\u5F53\u524D\u914D\u7F6E\u8303\u56F4\uFF0C\u82F1\u6587\u53E5\u5B50\u901A\u5E38\u5EFA\u8BAE\u4E0D\u8D85\u8FC7 24 \u8BCD\uFF1B\u5E94\u6309\u5B9E\u9A8C\u534F\u8BAE\u548C\u8BC1\u636E\u94FE\u9700\u8981\u8C03\u6574\u3002`,
          en: `- When length guidance is enabled, use the configured range as an optional reference for Experiments and Results; English sentences are generally suggested to stay within 24 words. Adjust to the experimental protocol and evidence chain.`
        },
        flexibleCore: {
          zh: `- \u5F53\u524D Experiments and Results \u4E0D\u8BBE\u8BCD\u6570\u5EFA\u8BAE\uFF0C\u82F1\u6587\u53E5\u5B50\u901A\u5E38\u5EFA\u8BAE\u4E0D\u8D85\u8FC7 24 \u8BCD\u3002\u6309\u5B9E\u9A8C\u534F\u8BAE\u4E0E\u8BC1\u636E\u94FE\u9700\u8981\u5145\u5206\u5C55\u5F00\u5E76\u5220\u9664\u91CD\u590D\uFF0C\u4E0D\u5F97\u56E0\u7BC7\u5E45\u538B\u7F29\u3001\u5220\u9664\u6216\u5F31\u5316\u73B0\u6709\u5B9E\u9A8C\u5185\u5BB9\u3002`,
          en: `- Experiments and Results has no suggested word range, while English sentences are generally suggested to stay within 24 words. Develop the section as fully as its protocols and evidence chain require, remove repetition, and never condense, delete, or weaken existing experimental content merely for length.`
        }
      }
    ]
  },
  "narrative-reconstruction": {
    core: {
      zh: `### \u6DF1\u5EA6\u7CBE\u4FEE\u539F\u5219

- \u5148\u5EFA\u7ACB\u4E8B\u5B9E\u5E95\u7A3F\u4E0E\u539F\u7A3F\u9AD8\u4EF7\u503C\u8868\u8FBE\u4FDD\u7559\u6E05\u5355\uFF1B\u51C6\u786E\u3001\u6E05\u6670\u3001\u6709\u8FA8\u8BC6\u5EA6\u4E14\u4E0E\u8BC1\u636E\u4E00\u81F4\u7684\u539F\u53E5\u5E94\u4FDD\u7559\u6216\u8F7B\u8C03\uFF1B
- \u53EA\u91CD\u7EC4\u5B58\u5728\u903B\u8F91\u65AD\u88C2\u3001\u91CD\u590D\u3001\u8BC1\u636E\u9519\u4F4D\u6216\u8868\u8FBE\u4E0D\u6E05\u7684\u90E8\u5206\uFF0C\u4E0D\u4EE5\u201C\u7115\u65B0\u201D\u4E3A\u76EE\u7684\u6E05\u7A7A\u91CD\u5199\uFF1B
- \u6BCF\u9879\u6539\u52A8\u5FC5\u987B\u878D\u5408\u8FDB\u6BB5\u843D\u8BBA\u8BC1\uFF0C\u4FDD\u6301\u672F\u8BED\u3001\u8BED\u6C14\u548C\u5199\u4F5C\u624B\u6CD5\u4E00\u81F4\u3002

### Abstract \u7684\u56FA\u5B9A\u7ED3\u6784

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

### Introduction \u7684\u6838\u5FC3\u7ED3\u6784

- \u4E0D\u8BBE\u7F6E\u4EFB\u4F55\u5B50\u8282\uFF1BP1\u2013P4 \u4F7F\u7528\u56DB\u4E2A\u8FDE\u7EED\u53D9\u4E8B\u6BB5\u843D\uFF0CP5 \u4E3A\u8D21\u732E\u5757\uFF1B
- P1 \u80CC\u666F\u4E0E\u52A8\u673A\uFF1A\u76F4\u63A5\u8FDB\u5165\u4EFB\u52A1\u3001\u573A\u666F\u548C\u73B0\u5B9E\u7EA6\u675F\uFF0C\u660E\u786E\u8BF4\u660E\u8BE5\u95EE\u9898\u5728\u5F53\u524D\u7814\u7A76\u4E0E\u5B9E\u9645\u73AF\u5883\u4E2D\u4ECD\u7136\u5B58\u5728\uFF0C\u800C\u4E0D\u662F\u53EA\u56DE\u987E\u5386\u53F2\u7F3A\u53E3\uFF1B\u53EF\u4F7F\u7528 6\u201310 \u4E2A\u5F53\u524D .bib key\uFF0C\u6BCF\u53E5\u6700\u591A 3 \u4E2A\uFF1B
- P2 \u6700\u76F8\u5173\u8DEF\u7EBF\u4E0E\u7F3A\u53E3\uFF1A\u6BCF\u6761\u8DEF\u7EBF\u5148\u6982\u62EC\u518D\u8BF4\u660E\u5728\u672C\u6587\u76EE\u6807\u7EF4\u5EA6\u4E0A\u7684\u9650\u5236\uFF0C\u53EF\u4F7F\u7528 4\u20138 \u4E2A\u5F53\u524D key\uFF1B
- P3 \u672A\u89E3\u95EE\u9898\u4E0E\u6311\u6218\uFF1A\u6700\u5C0F\u5145\u5206\u63CF\u8FF0\u8F93\u5165\u3001\u8F93\u51FA\u3001\u7EA6\u675F\u548C\u76EE\u6807\uFF0C\u53EA\u8BF4\u660E\u4ECA\u5929\u4ECD\u672A\u89E3\u51B3\u4E14\u771F\u6B63\u51B3\u5B9A\u8BBE\u8BA1\u7684 2\u20134 \u4E2A\u6311\u6218\uFF1B
- P4 \u672C\u6587\u56DE\u5E94\uFF1A\u76F4\u63A5\u56DE\u7B54 P3\uFF0C\u4ECB\u7ECD\u6838\u5FC3\u601D\u60F3\u3001\u603B\u4F53\u673A\u5236\u4E0E\u8BBE\u8BA1\u76F4\u89C9\uFF1B\u4E0D\u5F97\u518D\u6B21\u6269\u5199\u7F3A\u53E3\u6216\u91CD\u590D\u6311\u6218\uFF1B
- P5 \u8D21\u732E\u4E0E\u610F\u4E49\uFF1A\u5148\u5199\u5F15\u5BFC\u53E5 \`This paper makes the following three contributions:\`\uFF0C\u518D\u4F7F\u7528 \`\\begin{itemize}\`\u3001\u4E09\u4E2A \`\\item\` \u548C \`\\end{itemize}\` \u7ED9\u51FA\u6070\u597D\u4E09\u6761\u5355\u53E5\u8D21\u732E\uFF1B\u6BCF\u4E2A\u6761\u76EE\u9ED8\u8BA4\u4EE5 \`We\` \u5F00\u5934\uFF0C\u5206\u522B\u5BF9\u5E94\u771F\u5B9E\u673A\u5236\u4E0E\u73B0\u6709\u8BC1\u636E\uFF0C\u4E0D\u5199\u5177\u4F53\u7ED3\u679C\u6570\u5B57\u6216 cite\uFF1B
{{narrative_introduction_roadmap}}
- P1\u2013P4 \u53EF\u5F15\u7528\uFF0CP5 \u7684\u5F15\u5BFC\u53E5\u548C\u6761\u76EE\u4E0D\u5F15\u7528\uFF1B\u6240\u6709 key \u5FC5\u987B\u5B58\u5728\u4E8E\u5F53\u524D .bib\u3002
{{introduction_word_limits}}

### Related Work \u7684\u56FA\u5B9A\u7ED3\u6784

- \u76EE\u5F55\u5C42\u7EA7\u56FA\u5B9A\u4E3A section{Related Work} \u2192 \u6070\u597D\u4E09\u4E2A subsection\uFF1B
- \u6BCF\u4E2A subsection \u6807\u9898\u4E3A 3\u20137 \u4E2A\u82F1\u6587\u5355\u8BCD\u5E76\u4F7F\u7528\u6807\u9898\u5F0F\u5927\u5C0F\u5199\uFF1B
{{narrative_related_work_structure}}
- \u7B2C\u4E00\u53E5\u7528\u4E3B\u52A8\u8BED\u6001\u548C\u4E00\u822C\u73B0\u5728\u65F6\u6982\u62EC\u7A33\u5B9A\u89C2\u5BDF\uFF1B
- \u6709\u4E14\u4EC5\u6709\u4E00\u53E5\u7528\u4E00\u822C\u8FC7\u53BB\u65F6\u63CF\u8FF0\u4EE3\u8868\u6027\u4F5C\u8005\u884C\u4E3A\uFF1B
- \u6BCF\u4E2A subsection \u7684\u6700\u540E\u4E00\u53E5\u5EFA\u8BAE\u63A7\u5236\u5728 18 \u8BCD\u4EE5\u5185\u5E76\u53EF\u6309\u5185\u5BB9\u8C03\u6574\uFF0C\u5FC5\u987B\u662F\u5BF9\u672C\u5C0F\u8282\u6587\u732E\u7684\u7EFC\u5408\u5206\u6790\u6216\u603B\u7ED3\uFF1B\u53EA\u6709\u5206\u6790\u81EA\u7136\u652F\u6301\u65F6\u624D\u53EF\u843D\u5230\u672C\u6587\u5B9A\u4F4D\uFF0C\u4F46\u4E0D\u5F97\u51FA\u73B0\u672C\u6587\u65B9\u6CD5\u540D\uFF0C\u4E0D\u5F97\u4F7F\u7528 "we"\uFF1B
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

\u62A5\u544A\u5FC5\u987B\u5305\u542B\uFF1A\u4E8B\u5B9E\u5E95\u7A3F\u3001\u539F\u7A3F\u9AD8\u4EF7\u503C\u8868\u8FBE\u4FDD\u7559\u6E05\u5355\u3001Abstract \u53E5\u5B50\u529F\u80FD\u8868\u3001Introduction \u53D9\u4E8B\u6BB5\u843D\u4E0E\u8D21\u732E\u5757\u529F\u80FD\u8868\u3001\u4E09\u70B9\u8D21\u732E\u65E7/\u65B0\u5BF9\u7167\u3001Related Work \u4E3B\u9898\u4E0E\u6587\u732E\u7C07\u3001Discussion \u7684\u8BC1\u636E/\u63A8\u65AD/\u8FB9\u754C\u8868\u3001Conclusion \u4E24\u6BB5\u529F\u80FD\u8868\u3001\u672F\u8BED\u5BF9\u9F50\u3001\u8054\u7F51\u6838\u9A8C\u3001\u5B9E\u9645\u7CBE\u4FEE\u6E05\u5355\u548C\u4E0B\u4E00\u6B65\u4EA4\u63A5\u6458\u8981\u3002`,
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

- Use no subsection. P1\u2013P4 are four consecutive narrative paragraphs, and P5 is the contribution block;
- P1 Background and motivation: enter the task, setting, and practical constraints directly, and explicitly establish that the problem still exists in today's research and practical landscape rather than merely recounting a historical gap. It may use six to ten current .bib keys, with no more than three per sentence;
- P2 Closest research lines and gap: summarize each line before stating its specific limitation for this paper's objective. It may use four to eight current keys;
- P3 Unresolved problem and challenges: describe inputs, outputs, constraints, and objective minimally, focusing only on two to four challenges that still remain today and genuinely determine the design;
- P4 This paper's response: answer P3 directly with the core idea, overall mechanism, and design intuition; do not expand the gap again or repeat the challenges;
- P5 Contributions and significance: begin with \`This paper makes the following three contributions:\`, then use \`\\begin{itemize}\`, three \`\\item\` entries, and \`\\end{itemize}\` for exactly three one-sentence contributions. Each item begins with \`We\` by default and maps to a real mechanism and existing evidence. Use no specific result value or cite;
{{narrative_introduction_roadmap}}
- P1\u2013P4 may cite; the P5 lead-in and items do not. Every key must exist in the current .bib.
{{introduction_word_limits}}

### Fixed Structure for Related Work

- Fix the hierarchy as section{Related Work} \u2192 exactly three subsections;
- Each subsection title contains three to seven English words in title case;
{{narrative_related_work_structure}}
- The first sentence uses active voice and present tense to summarize a stable observation;
- Exactly one sentence uses simple past tense to describe a representative author action;
- The final sentence of each subsection preferably stays within 18 words but may adjust to the content, and it synthesizes or summarizes that subsection's literature. It may lead naturally to the paper's position only when the analysis warrants it, but must not name the paper's method or use "we";
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

The report must contain the fact base, preservation list for high-value original expression, Abstract sentence-function table, Introduction narrative-paragraph and contribution-block map, old/new three-contribution comparison, Related Work themes and citation clusters, Discussion evidence/inference/boundary table, Conclusion two-paragraph map, terminology alignment, web verification, actual refinement log, and next-step handoff.`
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
            zh: "- \u4F1A\u8BAE\u8BBA\u6587\u7684 Discussion and Limitations \u7531\u6A21\u578B\u6309\u8BC1\u636E\u9009\u62E9 3\u20135 \u4E2A discussion subsection\uFF0C\u627F\u62C5\u7EFC\u5408\u89E3\u91CA\u3001\u9002\u7528\u8303\u56F4\u4E0E\u79D1\u5B66\u610F\u4E49\uFF0C\u6700\u540E\u5355\u5217 Limitations\uFF1B\n{{narrative_limitations_word_limits}}",
            en: "- In a conference paper, let the model select three to five evidence-driven Discussion subsections for synthesis, scope, and scientific implications, followed by a separate Limitations subsection;\n{{narrative_limitations_word_limits}}"
          },
          journal: {
            zh: "- \u671F\u520A\u8BBA\u6587\u7684 Discussion \u7531\u6A21\u578B\u6309\u8BC1\u636E\u9009\u62E9 3\u20135 \u4E2A\u4E3B\u9898\u5C0F\u8282\uFF0C\u8986\u76D6\u673A\u5236\u89E3\u91CA\u3001\u9002\u7528\u8303\u56F4\u3001\u610F\u4E49\u3001\u5C40\u9650\u4E0E\u672A\u6765\u65B9\u5411\uFF1B",
            en: "- In a journal paper, let the model select three to five evidence-driven topic subsections covering mechanism, scope, implications, limitations, and future directions;"
          }
        }
      }
    ],
    inlinePreferenceConstraints: [
      {
        marker: "narrative_introduction_roadmap",
        contextKey: "includeSectionNavigationSentence",
        branches: {
          enabled: {
            zh: "- \u5728 P5 \u540E\u589E\u52A0\u4E00\u4E2A\u7EA6 65 \u8BCD\u7684\u72EC\u7ACB\u7AE0\u8282\u5BFC\u822A\u6BB5\uFF0C\u53EA\u8BF4\u660E\u5404\u7AE0\u8282\u5982\u4F55\u627F\u63A5\uFF0C\u4E0D\u91CD\u590D\u7AE0\u8282\u5185\u5BB9\u3001\u4E0D\u627F\u8F7D\u65B0\u8BBA\u8BC1\uFF0C\u4E5F\u4E0D\u4F7F\u7528 cite\uFF1B\u8BE5\u6BB5\u4E0D\u8BA1\u5165 Introduction \u5EFA\u8BAE\u5B57\u6570\uFF1B",
            en: "- After P5, add a separate paper-roadmap paragraph of about 65 words that only maps how the sections proceed, repeats no section content, carries no new argument, and uses no cite. Exclude this paragraph from the suggested Introduction word count;"
          },
          disabled: {
            zh: "- \u4E0D\u5199\u7AE0\u8282\u5BFC\u822A\u6BB5\uFF1B\u4EE5\u8D21\u732E\u5757\u81EA\u7136\u7ED3\u675F Introduction\uFF1B",
            en: "- Omit the paper-roadmap paragraph and close Introduction naturally with the contribution block;"
          }
        }
      }
    ],
    inlineWordLimits: [
      {
        marker: "abstract_word_limits",
        standard: {
          zh: `- \u542F\u7528\u7BC7\u5E45\u5EFA\u8BAE\u65F6\uFF0CAbstract \u53EF\u53C2\u8003 {{abstract_min}}\u2013{{abstract_max}} \u8BCD\uFF1BBackground \u6BCF\u53E5\u5EFA\u8BAE 16\u201324 \u8BCD\uFF0CBridge 12\u201318 \u8BCD\uFF0CMethod \u6BCF\u53E5 16\u201324 \u8BCD\uFF0CResults \u6BCF\u53E5 14\u201322 \u8BCD\uFF0CImplication 12\u201318 \u8BCD\u3002\u6240\u6709\u533A\u95F4\u5747\u53EF\u6309\u5185\u5BB9\u4E0E\u53EF\u8BFB\u6027\u8C03\u6574\u3002`,
          en: `- When length guidance is enabled, use {{abstract_min}}\u2013{{abstract_max}} words as an optional Abstract reference; suggested sentence ranges are 16\u201324 words for Background, 12\u201318 for Bridge, 16\u201324 for Method, 14\u201322 for Results, and 12\u201318 for Implication. Adjust every range for content and readability.`
        }
      },
      {
        marker: "introduction_word_limits",
        standard: {
          zh: `- \u542F\u7528\u7BC7\u5E45\u5EFA\u8BAE\u65F6\uFF0CIntroduction \u603B\u91CF\u53EF\u53C2\u8003 {{introduction_min}}\u2013{{introduction_max}} \u8BCD\uFF0C\u82F1\u6587\u53E5\u5B50\u901A\u5E38\u5EFA\u8BAE\u4E0D\u8D85\u8FC7 25 \u8BCD\uFF1BP1\u2013P4 \u53EF\u5206\u522B\u53C2\u8003 {{intro_p1_min}}\u2013{{intro_p1_max}}\u3001{{intro_p2_min}}\u2013{{intro_p2_max}}\u3001{{intro_p3_min}}\u2013{{intro_p3_max}}\u3001{{intro_p4_min}}\u2013{{intro_p4_max}} \u8BCD\uFF0CP5 \u8D21\u732E\u5757\u53EF\u53C2\u8003 {{intro_p5_min}}\u2013{{intro_p5_max}} \u8BCD\uFF0C\u6BCF\u4E2A\u8D21\u732E\u6761\u76EE\u5EFA\u8BAE 15\u201325 \u8BCD\u3002\u6240\u6709\u6570\u5B57\u53EF\u6309\u5185\u5BB9\u8C03\u6574\uFF1B\u542F\u7528\u65F6\uFF0C\u72EC\u7ACB\u7684\u7EA6 65 \u8BCD\u7AE0\u8282\u5BFC\u822A\u6BB5\u4E0D\u8BA1\u5165\u4E0A\u8FF0 Introduction \u5EFA\u8BAE\u5B57\u6570\u3002`,
          en: `- When length guidance is enabled, use {{introduction_min}}\u2013{{introduction_max}} words as an optional Introduction reference, with English sentences generally suggested to stay within 25 words. Optional references for P1\u2013P4 are {{intro_p1_min}}\u2013{{intro_p1_max}}, {{intro_p2_min}}\u2013{{intro_p2_max}}, {{intro_p3_min}}\u2013{{intro_p3_max}}, and {{intro_p4_min}}\u2013{{intro_p4_max}} words; the P5 contribution block may use {{intro_p5_min}}\u2013{{intro_p5_max}}, with 15\u201325 words suggested per item. Adjust all numbers to the content. When enabled, the separate \u224865-word roadmap paragraph is excluded from this suggested Introduction count.`
        }
      },
      {
        marker: "related_work_word_limits_conference",
        standard: {
          zh: `- \u542F\u7528\u7BC7\u5E45\u5EFA\u8BAE\u65F6\uFF0CRelated Work \u603B\u91CF\u53EF\u53C2\u8003 {{related_work_min}}\u2013{{related_work_max}} \u8BCD\uFF0C\u6BCF\u4E2A subsection \u7684\u552F\u4E00\u6BB5\u843D\u53EF\u53C2\u8003 {{related_subsection_min}}\u2013{{related_subsection_max}} \u8BCD\uFF0C\u82F1\u6587\u53E5\u5B50\u901A\u5E38\u5EFA\u8BAE\u4E0D\u8D85\u8FC7 22 \u8BCD\uFF1B\u5747\u53EF\u6309\u6587\u732E\u5BC6\u5EA6\u8C03\u6574\u3002`,
          en: `- When length guidance is enabled, use {{related_work_min}}\u2013{{related_work_max}} words as an optional Related Work reference, {{related_subsection_min}}\u2013{{related_subsection_max}} for each subsection's sole paragraph, and generally no more than 22 words per English sentence. Adjust to the literature density.`
        }
      },
      {
        marker: "related_work_word_limits_journal",
        standard: {
          zh: `- \u542F\u7528\u7BC7\u5E45\u5EFA\u8BAE\u65F6\uFF0CRelated Work \u603B\u91CF\u53EF\u53C2\u8003 {{related_work_min}}\u2013{{related_work_max}} \u8BCD\uFF0C\u6BCF\u4E2A subsection \u53EF\u53C2\u8003 {{related_subsection_min}}\u2013{{related_subsection_max}} \u8BCD\uFF0C\u6BCF\u6BB5\u53EF\u53C2\u8003 {{related_paragraph_min}}\u2013{{related_paragraph_max}} \u8BCD\uFF0C\u82F1\u6587\u53E5\u5B50\u901A\u5E38\u5EFA\u8BAE\u4E0D\u8D85\u8FC7 22 \u8BCD\uFF1B\u5747\u53EF\u6309\u6587\u732E\u5BC6\u5EA6\u8C03\u6574\u3002`,
          en: `- When length guidance is enabled, optional references are {{related_work_min}}\u2013{{related_work_max}} words for Related Work, {{related_subsection_min}}\u2013{{related_subsection_max}} per subsection, {{related_paragraph_min}}\u2013{{related_paragraph_max}} per paragraph, and generally no more than 22 words per English sentence. Adjust to the literature density.`
        }
      },
      {
        marker: "narrative_limitations_word_limits",
        standard: {
          zh: "- \u542F\u7528\u7BC7\u5E45\u5EFA\u8BAE\u65F6\uFF0C\u4F1A\u8BAE\u8BBA\u6587\u7684 Limitations subsection \u53EF\u53C2\u8003\u7EA6 100 \u8BCD\uFF0C\u5E76\u6309\u771F\u5B9E\u5C40\u9650\u6570\u91CF\u4E0E\u91CD\u8981\u6027\u8C03\u6574\u3002",
          en: "- When length guidance is enabled, use about 100 words as an optional reference for conference-paper Limitations and adjust to the number and importance of genuine limitations."
        }
      },
      {
        marker: "discussion_conclusion_word_limits",
        standard: {
          zh: `- \u542F\u7528\u7BC7\u5E45\u5EFA\u8BAE\u65F6\uFF0CDiscussion \u603B\u91CF\u53EF\u53C2\u8003 {{discussion_min}}\u2013{{discussion_max}} \u8BCD\uFF1BConclusion \u53EF\u53C2\u8003 {{conclusion_min}}\u2013{{conclusion_max}} \u8BCD\uFF0C\u82F1\u6587\u53E5\u5B50\u901A\u5E38\u5EFA\u8BAE\u4E0D\u8D85\u8FC7 24 \u8BCD\uFF0C\u7B2C\u4E00\u6BB5\u53EF\u53C2\u8003 {{conclusion_p1_min}}\u2013{{conclusion_p1_max}} \u8BCD\uFF0C\u7B2C\u4E8C\u6BB5\u53EF\u53C2\u8003 {{conclusion_p2_min}}\u2013{{conclusion_p2_max}} \u8BCD\u3002\u6240\u6709\u6570\u5B57\u5747\u53EF\u6309\u8BBA\u8BC1\u9700\u8981\u8C03\u6574\u3002`,
          en: `- When length guidance is enabled, use {{discussion_min}}\u2013{{discussion_max}} words as an optional Discussion reference and {{conclusion_min}}\u2013{{conclusion_max}} for Conclusion. English sentences are generally suggested to stay within 24 words; optional paragraph references are {{conclusion_p1_min}}\u2013{{conclusion_p1_max}} and {{conclusion_p2_min}}\u2013{{conclusion_p2_max}} words. Adjust every number to the argument.`
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

### \u539F\u7A3F\u8D28\u91CF\u56DE\u5F52\u95E8

- \u4EE5\u91CD\u6784\u524D\u539F\u59CB .tex\u3001PDF \u548C\u65E7\u6846\u67B6\u56FE\u4E3A\u57FA\u7EBF\uFF0C\u9010\u8282\u6BD4\u8F83\u5F53\u524D\u7A3F\uFF1B
- \u68C0\u67E5\u9AD8\u4EF7\u503C\u53E5\u5B50\u6216\u5B9E\u9A8C\u53D1\u73B0\u662F\u5426\u6D88\u5931\u3001\u7ED3\u679C\u89E3\u91CA\u662F\u5426\u88AB\u8FC7\u5EA6\u538B\u7F29\u3001\u5F53\u524D\u6807\u9898\u662F\u5426\u4ECD\u51C6\u786E\u4E14\u6709\u8FA8\u8BC6\u5EA6\u3001\u65B0\u6846\u67B6\u56FE\u662F\u5426\u66F4\u6E05\u695A\u5730\u8868\u8FBE\u79D1\u5B66\u4E3B\u7EBF\uFF1B
- \u53EA\u4FEE\u590D\u786E\u8BA4\u53D1\u751F\u9000\u5316\u7684\u4F4D\u7F6E\uFF0C\u5E76\u628A\u4FEE\u590D\u878D\u5408\u8FDB\u539F\u6BB5\u843D\uFF1B\u5176\u4ED6\u5185\u5BB9\u4FDD\u6301\u4E0D\u53D8\uFF1B
- \u8F93\u51FA Quality Regression Table\uFF0C\u8BB0\u5F55\u68C0\u67E5\u9879\u3001\u539F\u7A3F\u4EF7\u503C\u3001\u5F53\u524D\u72B6\u6001\u3001\u5904\u7406\u548C\u4F9D\u636E\uFF0C\u540C\u65F6\u6838\u9A8C\u5168\u6587\u672F\u8BED\u4E0E\u5199\u4F5C\u624B\u6CD5\u4E00\u81F4\u3002

### \u4E2D\u6587\u62A5\u544A\u56FA\u5B9A\u6E05\u5355

\u62A5\u544A\u5FC5\u987B\u5305\u542B\uFF1A\u7EC8\u5BA1\u6458\u8981\u4E0E\u91CD\u5927\u4FEE\u6B63\u3001Terminology Consistency Table\u3001Cross-Section Redundancy Matrix\u3001Claim\u2013Evidence \u8868\u3001\u6570\u5B57\u4E0E\u5F15\u7528\u5BA1\u8BA1\u3001\u56FE\u8868/\u516C\u5F0F/\u7B97\u6CD5/LaTeX \u5BA1\u8BA1\u3001\u5BA1\u7A3F\u4EBA\u653B\u51FB\u6D4B\u8BD5\u3001Quality Regression Table\u3001\u65E0\u6CD5\u901A\u8FC7\u6587\u5B57\u89E3\u51B3\u7684\u98CE\u9669\u3001\u9010\u7AE0\u8282\u4FEE\u6539\u6E05\u5355\u548C\u6295\u7A3F\u76EE\u6807\u68C0\u7D22\u4EA4\u63A5\u6458\u8981\u3002`,
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

- Build the final Terminology Consistency Table covering canonical terms, the full method name and paper-brand acronym selected by this workflow, component/representation/query/branch/loss/data/metric terminology, first definitions, prohibited variants, redundant acronyms, and concepts that must remain distinct;
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

### Source-aware Quality Regression Gate

- Use the original pre-reconstruction .tex, PDF, and old framework figure as the baseline for section-by-section comparison;
- Check for lost high-value sentences or experimental findings, overcompressed result interpretation, whether the current title remains accurate and distinctive, and whether the new framework figure communicates the scientific throughline more clearly;
- Repair only confirmed regressions and integrate each repair into its paragraph. Keep all unrelated content unchanged;
- Return a Quality Regression Table recording the check, source value, current state, action, and rationale, while verifying consistent terminology and writing style throughout.

### Fixed Chinese-report Checklist

The report must contain the final-audit summary and major revisions, Terminology Consistency Table, Cross-Section Redundancy Matrix, Claim\u2013Evidence table, numeric and citation audits, visual/equation/algorithm/LaTeX audit, reviewer attack test, Quality Regression Table, risks prose cannot solve, section-by-section revision log, and submission-targeting handoff.`
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

- \u9996\u5148\u7528\u6070\u597D\u4E00\u53E5\u201C\u8BBA\u6587\u7C7B\u522B\u5224\u65AD\u201D\u6982\u62EC\u4E3B\u8981\u5B66\u79D1\u3001\u7EC6\u5206\u9886\u57DF\u3001\u7814\u7A76\u6216\u7A3F\u4EF6\u7C7B\u578B\u3001\u6838\u5FC3\u8D21\u732E\u5F62\u6001\u548C\u76EE\u6807\u8BFB\u8005\uFF1B\u8DE8\u5B66\u79D1\u8BBA\u6587\u540C\u65F6\u6807\u660E\u4E3B\u6295\u9886\u57DF\u4E0E\u4EA4\u53C9\u9886\u57DF\uFF1B
- \u7814\u7A76\u95EE\u9898\u3001\u7814\u7A76\u5BF9\u8C61\u3001\u7814\u7A76\u8BBE\u8BA1\u6216\u65B9\u6CD5\u3001\u8BC1\u636E\u5F62\u6001\u548C\u4E3B\u8981\u8D21\u732E\uFF1B
- \u7406\u8BBA\u3001\u65B9\u6CD5\u3001\u5B9E\u8BC1\u3001\u7CFB\u7EDF\u3001\u5E94\u7528\u3001\u7EFC\u8FF0\u6216\u8DE8\u5B66\u79D1\u5C5E\u6027\uFF1B
- \u76EE\u6807\u8BFB\u8005\u3001\u6B63\u6587\u89C4\u6A21\u3001\u56FE\u8868\u6570\u91CF\u3001\u53C2\u8003\u6587\u732E\u6570\u91CF\u548C\u8865\u5145\u6750\u6599\uFF1B
- \u8BC1\u636E\u5F3A\u5EA6\u3001\u6700\u53EF\u80FD\u7684\u5356\u70B9\u548C\u6700\u53EF\u80FD\u7684 desk-reject/triage \u98CE\u9669\u3002

\u4E0D\u5F97\u4E3A\u4E86\u76EE\u6807\u7B5B\u9009\u91CD\u65B0\u5B9A\u4E49\u8BBA\u6587\u79D1\u5B66\u4E3B\u7EBF\u3002

### \u5019\u9009\u6C60\u4E0E\u6838\u9A8C\u5B57\u6BB5

- \u5EFA\u7ACB\u4E0E\u9886\u57DF\u89C4\u6A21\u76F8\u79F0\u7684\u5019\u9009\u6C60\uFF0C\u901A\u5E38\u4E3A 8\u201315 \u4E2A\uFF1B\u53EF\u4FE1\u4E14\u5F53\u524D\u53EF\u6295\u7A3F\u7684\u76EE\u6807\u66F4\u5C11\u65F6\uFF0C\u53EF\u4EE5\u7F29\u5C0F\u5019\u9009\u6C60\u5E76\u8BF4\u660E\u539F\u56E0\uFF0C\u4E0D\u5F97\u4E3A\u51D1\u6570\u52A0\u5165\u5F31\u76F8\u5173 venue\uFF1B
- MDPI\u3001Hindawi \u548C Frontiers \u662F\u7528\u6237\u660E\u786E\u6392\u9664\u7684\u51FA\u7248\u793E\uFF1A\u5176\u65D7\u4E0B\u671F\u520A\u4E0D\u5F97\u8FDB\u5165\u5019\u9009\u6C60\u3001\u8BC4\u5206\u6216\u63A8\u8350\u68AF\u961F\uFF0C\u53EA\u5728\u6392\u9664\u8BB0\u5F55\u4E2D\u6CE8\u660E\u201C\u7528\u6237\u6392\u9664\u201D\uFF0C\u4E0D\u5F97\u5BF9\u51FA\u7248\u793E\u4F5C\u65E0\u4F9D\u636E\u7684\u6CDB\u5316\u8D28\u91CF\u5B9A\u6027\uFF1B
- \u9010\u9879\u6838\u9A8C\u5168\u540D\u3001\u51FA\u7248\u793E/\u7EC4\u7EC7\u65B9\u3001\u5B98\u7F51\u3001\u8303\u56F4\u5339\u914D\u70B9\u3001\u6587\u7AE0\u6216 track \u7C7B\u578B\u3001\u5F53\u524D\u7D22\u5F15/\u7B49\u7EA7\u3001\u6B63\u6587/\u9875\u6570/\u56FE\u8868/\u6458\u8981/\u53C2\u8003\u6587\u732E\u9650\u5236\u3001\u9644\u5F55\u4E0E\u8865\u5145\u6750\u6599\u3001\u533F\u540D\u653F\u7B56\u3001OA/APC \u6216\u6CE8\u518C\u8D39\u7528\u3001\u9644\u52A0\u6587\u4EF6\u3001\u4F26\u7406/\u6570\u636E/\u53EF\u590D\u73B0\u653F\u7B56\u3001\u6295\u7A3F\u5165\u53E3\u548C\u5173\u952E\u65E5\u671F\uFF1B
- \u53EA\u6709\u6743\u5A01\u6765\u6E90\u652F\u6301\u65F6\u624D\u5199 SCIE\u3001SSCI\u3001AHCI\u3001ESCI\u3001JCR \u5206\u533A\u3001\u4F1A\u8BAE\u7B49\u7EA7\u6216\u5176\u4ED6\u9886\u57DF\u8BC4\u4EF7\uFF1B\u4E0D\u9002\u7528\u4E8E\u5F53\u524D\u5B66\u79D1\u6216\u7A3F\u4EF6\u7C7B\u578B\u7684\u6307\u6807\u660E\u786E\u5199\u201C\u4E0D\u9002\u7528\u201D\uFF1B
- SJR/Scopus \u4FE1\u606F\u5FC5\u987B\u660E\u786E\u6807\u6CE8\uFF0C\u4E0D\u80FD\u5192\u5145 JCR\uFF1B\u4E2D\u79D1\u9662\u5206\u533A\u4E0E JCR \u5FC5\u987B\u5206\u5F00\u5E76\u6807\u6CE8\u5E74\u4EFD\uFF1B
- \u5F53\u524D\u5C4A\u4E0E\u5386\u53F2\u5C4A\u89C4\u5219\u4E0D\u5F97\u6DF7\u7528\u3002

### 100 \u5206\u5339\u914D\u8BC4\u5206

- \u4E3B\u9898\u4E0E\u8303\u56F4\u5339\u914D\uFF1A30\uFF1B
- \u7A3F\u4EF6\u7C7B\u578B\u4E0E\u8D21\u732E\u5F62\u6001\u5339\u914D\uFF1A20\uFF1B
- \u7814\u7A76\u8BBE\u8BA1\u548C\u8BC1\u636E\u6210\u719F\u5EA6\u4E0E venue \u671F\u671B\u5339\u914D\uFF1A15\uFF1B
- \u76EE\u6807\u7B49\u7EA7\u6216\u5206\u533A\u5339\u914D\uFF1A15\uFF1B
- \u957F\u5EA6\u3001\u56FE\u8868\u4E0E\u6750\u6599\u517C\u5BB9\uFF1A10\uFF1B
- OA/APC\u3001\u6CE8\u518C\u8D39\u3001\u622A\u7A3F\u671F\u4E0E\u7528\u6237\u7EA6\u675F\uFF1A5\uFF1B
- desk-reject\u3001triage \u548C\u7ADE\u4E89\u98CE\u9669\uFF1A5\u3002

\u4EE5\u4E0A\u4E3A\u9ED8\u8BA4\u6743\u91CD\u3002\u67D0\u7EF4\u5EA6\u4E0D\u9002\u5408\u5F53\u524D\u5B66\u79D1\u6216\u7A3F\u4EF6\u7C7B\u578B\u65F6\u53EF\u4EE5\u8C03\u6574\u5E76\u8BF4\u660E\u7406\u7531\uFF0C\u4F46\u603B\u5206\u4ECD\u4E3A 100\u3002\u6BCF\u9879\u5FC5\u987B\u7ED9\u51FA\u4F9D\u636E\uFF0C\u4E0D\u80FD\u628A\u540D\u6C14\u3001\u7B49\u7EA7\u6216\u5206\u533A\u76F4\u63A5\u7B49\u540C\u4E8E\u5339\u914D\u5EA6\u3002

### \u6295\u7A3F\u68AF\u961F\u4E0E\u62A5\u544A\u56FA\u5B9A\u6E05\u5355

- \u9996\u9009\u4E0D\u8D85\u8FC7\u4E09\u4E2A\uFF0C\u6309\u6295\u7A3F\u987A\u5E8F\u6392\u5217\uFF1B
- \u7A33\u59A5\u5907\u9009\u4E0D\u8D85\u8FC7\u4E09\u4E2A\uFF1B\u53EF\u4FE1\u5019\u9009\u4E0D\u8DB3\u65F6\u4E0D\u5F97\u4E3A\u51D1\u6EE1\u6570\u91CF\u964D\u4F4E\u5339\u914D\u6807\u51C6\uFF1B
- \u4E0D\u5EFA\u8BAE\u4F46\u5BB9\u6613\u8BEF\u9009\u7684 2\u20134 \u4E2A\uFF0C\u5E76\u8BF4\u660E\u8303\u56F4\u3001\u8D39\u7528\u3001\u6536\u5F55\u3001\u7C7B\u578B\u6216\u65F6\u6548\u98CE\u9669\uFF1B
- \u7ED9\u51FA\u552F\u4E00\u9996\u63A8\u53CA\u5B8C\u6574\u7406\u7531\uFF1B
- \u4E3A\u6BCF\u4E2A\u9996\u9009\u5206\u6790\u8303\u56F4\u3001\u8D21\u732E\u4E0E\u7A3F\u4EF6\u7C7B\u578B\u3001\u7814\u7A76\u8BBE\u8BA1\u4E0E\u8BC1\u636E\u3001\u7BC7\u5E45\u3001\u89C4\u5219\u548C\u8868\u8FBE\u98CE\u9669\uFF1B
- \u7ED9\u51FA\u6295\u7A3F\u524D\u6700\u540E\u6838\u9A8C\u4E8B\u9879\u548C\u62D2\u7A3F\u540E\u7684\u987A\u5E8F\u5316\u8F6C\u6295\u8DEF\u5F84\uFF1B
- \u76F4\u63A5\u5728\u5F53\u524D\u5BF9\u8BDD\u4E2D\u7ED9\u51FA\u5B8C\u6574\u4E2D\u6587\u7ED3\u679C\uFF0C\u4E0D\u751F\u6210\u6587\u4EF6\uFF1B
- \u7ED3\u679C\u5FC5\u987B\u5305\u542B\u4E00\u53E5\u8BBA\u6587\u7C7B\u522B\u5224\u65AD\u3001\u6838\u9A8C\u65E5\u671F\u3001\u7528\u6237\u7EA6\u675F/\u9ED8\u8BA4\u5047\u8BBE\u3001Manuscript\u2013Venue Profile\u3001\u5019\u9009\u6C60\u3001\u6765\u6E90\u3001\u6392\u9664\u8FC7\u7A0B\u3001\u8BC4\u5206\u3001\u68AF\u961F\u3001\u552F\u4E00\u9996\u63A8\u3001\u98CE\u9669\u3001\u653F\u7B56\u6458\u8981\u3001\u8F6C\u6295\u8DEF\u5F84\u3001\u672A\u6838\u9A8C\u4FE1\u606F\u53CA\u201C\u672A\u6539\u6A21\u677F\u3001\u672A\u6539\u6B63\u6587\u3001\u672A\u751F\u6210\u6587\u4EF6\u201D\u58F0\u660E\u3002`,
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

- Begin with exactly one \u201CManuscript category\u201D sentence covering the primary discipline, subfield, study or article type, core contribution form, and intended readership; for interdisciplinary work, identify the primary submission field and intersecting field;
- Research question, object of study, research design or methodology, evidence form, and primary contributions;
- Theoretical, methodological, empirical, system, application, review, or interdisciplinary character;
- Target readership, main-text scale, number of visuals and references, and supplementary material;
- Evidence strength, strongest selling point, and likely desk-reject/triage risk.

Do not redefine the scientific throughline for targeting.

### Candidate-pool and Verification Fields

- Build a candidate pool proportionate to the field, normally eight to fifteen venues. If fewer credible venues are currently open for submission, use a smaller pool and explain why; never add weakly related venues to meet a quota;
- MDPI, Hindawi, and Frontiers are explicit user exclusions. Do not place journals from these publishers in the candidate pool, scoring, or recommendation tiers. Record them only as \u201Cexcluded by user\u201D and do not make unsupported general quality claims about the publishers;
- Verify full name, publisher/organizer, official site, specific scope fit, article or track type, current index/rank, main-text/page/figure/abstract/reference limits, appendix and supplementary policy, anonymity, OA/APC or registration cost, additional files, ethics/data/reproducibility rules, submission portal, and key dates;
- State SCIE, SSCI, AHCI, ESCI, JCR quartiles, conference ranks, or another field-specific evaluation only when an authoritative source supports them. Mark a metric \u201CNot applicable\u201D when it does not suit the field or manuscript type;
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
- The result must contain the one-sentence manuscript category, verification date, user constraints/default assumptions, Manuscript\u2013Venue Profile, candidate pool, sources, exclusion process, scores, tiers, top recommendation, risks, policy summary, transfer path, unverified facts, and a statement that the template and prose were unchanged and no file was generated.`
    }
  }
};

// content/prompts/buildPrompt.ts
var LABELS = {
  zh: {
    role: "## \u4F60\u7684\u89D2\u8272",
    configuration: "## \u5F53\u524D\u914D\u7F6E",
    paperStyle: "\u8BBA\u6587\u7C7B\u578B",
    lengthMode: "\u7BC7\u5E45\u5EFA\u8BAE",
    flexibleCoreMode: "\u4E0D\u8BBE\u6B63\u6587\u603B\u5EFA\u8BAE\uFF1B\u4EC5\u4E3A\u65B9\u6CD5\u548C\u5B9E\u9A8C\u4EE5\u5916\u7684\u7AE0\u8282\u63D0\u4F9B\u53C2\u8003\u8303\u56F4",
    targetType: "\u6295\u7A3F\u7C7B\u578B",
    appendix: "\u9644\u5F55",
    captionLength: "Caption \u5EFA\u8BAE\u957F\u5EA6",
    styleDirective: "\u5199\u4F5C\u4FA7\u91CD",
    introductionRoadmap: "Introduction \u7AE0\u8282\u5BFC\u822A\u6BB5",
    included: "\u4FDD\u7559\u7EA6 65 \u8BCD\u7684\u72EC\u7ACB\u5BFC\u822A\u6BB5",
    omitted: "\u4E0D\u5199\u7AE0\u8282\u5BFC\u822A\u6BB5",
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
    identityGovernance: "## \u6807\u9898\u3001\u54C1\u724C\u4E0E\u79D1\u5B66\u4E3B\u7EBF\u6CBB\u7406",
    cohesiveRevision: "## \u878D\u5408\u5F0F\u7CBE\u4FEE\u89C4\u5219",
    pdfReview: "## PDF \u6DF1\u5EA6\u9605\u8BFB",
    citationAndWeb: "## \u5F15\u7528\u4E0E\u8054\u7F51\u6838\u9A8C",
    scope: "## \u672C\u8F6E\u8FB9\u754C",
    styleBranch: "### \u5F53\u524D\u7C7B\u578B\u7684\u6267\u884C\u91CD\u70B9",
    length: "## \u53EF\u9009\u6B63\u6587\u4E0E\u7AE0\u8282\u7BC7\u5E45\u5EFA\u8BAE",
    mainTextTarget: "\u5EFA\u8BAE\u6B63\u6587\u53C2\u8003\u503C",
    unlimited: "\u4E0D\u8BBE\u5EFA\u8BAE",
    countingScope: `\u5EFA\u8BAE\u4F30\u7B97\u8303\u56F4\u4E3A Abstract \u81F3 Conclusion\u3002\u6807\u9898\u3001\u4F5C\u8005\u4FE1\u606F\u3001\u5173\u952E\u8BCD\u3001\u516C\u5F0F\u3001\u7B97\u6CD5\u3001\u53C2\u8003\u6587\u732E\u3001\u9644\u5F55\u548C\u8865\u5145\u6750\u6599\u4E0D\u8BA1\u5165\uFF1B\u56FE\u6CE8\u4E0E\u8868\u683C\u5355\u5143\u683C\u4E0D\u9010\u8BCD\u7EDF\u8BA1\uFF0C\u6BCF\u5F20\u8868\u683C\u6216\u56FE\u7247\u6309 ${WORD_COUNT_POLICY.visualWordEquivalent} \u8BCD\u8BA1\u5165\u6240\u5728\u7AE0\u8282\u53CA\u6B63\u6587\u53C2\u8003\u503C`,
    sectionBudgets: "\u7AE0\u8282\u5EFA\u8BAE",
    recommendedRange: "\u53EF\u9009\u53C2\u8003\u533A\u95F4",
    lengthInstruction: "\u4EE5\u4E0A\u6570\u503C\u5747\u4E3A\u53EF\u9009\u5199\u4F5C\u5EFA\u8BAE\uFF0C\u4E0D\u662F\u4E0A\u9650\u3001\u6700\u4F4E\u8981\u6C42\u6216\u9A8C\u6536\u6761\u4EF6\u3002\u8BF7\u6839\u636E\u8BBA\u6587\u5185\u5BB9\u3001\u8BC1\u636E\u5BC6\u5EA6\u548C\u76EE\u6807\u7248\u9762\u81EA\u884C\u51B3\u5B9A\u91C7\u7EB3\u3001\u8C03\u6574\u6216\u5FFD\u7565\uFF1B\u82E5\u504F\u79BB\u5EFA\u8BAE\u66F4\u6709\u5229\u4E8E\u79D1\u5B66\u5B8C\u6574\u6027\uFF0C\u53EF\u76F4\u63A5\u504F\u79BB\u5E76\u5728\u62A5\u544A\u4E2D\u7B80\u8981\u8BF4\u660E\uFF0C\u4E0D\u5F97\u4E3A\u547D\u4E2D\u6570\u5B57\u5220\u51CF\u6838\u5FC3\u5185\u5BB9\u3002",
    flexibleLengthInstruction: "\u4EC5\u4E3A\u6807\u6709\u6570\u5B57\u7684\u7AE0\u8282\u63D0\u4F9B\u53EF\u9009\u53C2\u8003\u8303\u56F4\uFF1BMethod \u4E0E Experiments and Results \u4E0D\u8BBE\u7F6E\u7BC7\u5E45\u5EFA\u8BAE\uFF0C\u6309\u79D1\u5B66\u5B8C\u6574\u6027\u548C\u8BC1\u636E\u9700\u8981\u5C55\u5F00\u3002\u6240\u6709\u5EFA\u8BAE\u5747\u53EF\u6839\u636E\u8BBA\u6587\u5185\u5BB9\u8C03\u6574\u6216\u5FFD\u7565\u3002",
    tasks: "## \u672C\u8F6E\u4EFB\u52A1",
    detailedConstraints: "## \u672C\u8F6E\u4E13\u7528\u89C4\u5219",
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
    lengthMode: "Length guidance",
    flexibleCoreMode: "No suggested main-text total; optional ranges only for sections other than Method and Experiments",
    targetType: "Submission type",
    appendix: "Appendix",
    captionLength: "Suggested caption length",
    styleDirective: "Writing emphasis",
    introductionRoadmap: "Introduction roadmap paragraph",
    included: "Include a separate \u224865-word roadmap",
    omitted: "Omit the roadmap paragraph",
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
    identityGovernance: "## Title, Brand, and Scientific-throughline Governance",
    cohesiveRevision: "## Cohesive Refinement Rule",
    pdfReview: "## Deep PDF Review",
    citationAndWeb: "## Citations and Web Verification",
    scope: "## Scope of This Round",
    styleBranch: "### Execution Priorities for the Current Type",
    length: "## Optional Main-text and Section Length Guidance",
    mainTextTarget: "Suggested main-text reference",
    unlimited: "No suggestion",
    countingScope: `Estimate content from Abstract through Conclusion. Exclude the title, authors, keywords, equations, algorithms, references, appendix, and supplementary material. Do not count captions or table cells word by word; estimate each table or figure as ${WORD_COUNT_POLICY.visualWordEquivalent} words toward its section and the suggested main-text reference`,
    sectionBudgets: "Section suggestions",
    recommendedRange: "optional reference range",
    lengthInstruction: "Every number above is optional writing guidance, not a cap, minimum, or acceptance criterion. Accept, adjust, or ignore it according to the paper's content, evidence density, and target layout. Deviate whenever that better preserves scientific completeness, and briefly record the reason instead of deleting core content to hit a number.",
    flexibleLengthInstruction: "Numeric sections receive optional reference ranges only. Method and Experiments & Results receive no length suggestion and should follow scientific completeness and evidence needs. Every suggestion may be adjusted or ignored according to the paper.",
    tasks: "## Tasks for This Round",
    detailedConstraints: "## Round-specific Rules",
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
    ...["scientific-positioning", "narrative-reconstruction"].includes(
      template.id
    ) ? [
      field(
        labels.introductionRoadmap,
        context.includeSectionNavigationSentence ? labels.included : labels.omitted
      )
    ] : [],
    ...context.hasWordLimit && context.unlimitedCoreSections ? [field(labels.lengthMode, labels.flexibleCoreMode)] : [],
    field(
      labels.captionLength,
      buildCaptionLengthGuidance(
        context.captionWordRange,
        context.language
      )
    ),
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
  for (const fragment of constraints.inlinePreferenceConstraints ?? []) {
    const enabled = context[fragment.contextKey];
    core = core.replaceAll(
      `{{${fragment.marker}}}`,
      fragment.branches[enabled ? "enabled" : "disabled"][context.language]
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
  const styleBranch = template.profile === "targeting" ? template.styleBranches?.[context.styleId]?.[language] : void 0;
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
      "",
      labels.identityGovernance,
      common.identityGovernance[language],
      "",
      labels.cohesiveRevision,
      common.cohesiveRevision[language],
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
var RECONSTRUCTION_WORKFLOW_VERSION = "2026.07.30";

// content/prompts/pluginExport.ts
function getReconstructionConfigurationModel() {
  return {
    schemaVersion: 1,
    defaultPaperStyle: PRODUCT_CONFIG.defaultPaperStyle,
    defaultPromptLanguage: PRODUCT_CONFIG.defaultPromptLanguage,
    wordCount: PRODUCT_CONFIG.wordCount,
    captionLength: PRODUCT_CONFIG.captionLength,
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
          defaultIncludeSectionNavigationSentence: style.defaultIncludeSectionNavigationSentence,
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
      ),
      proFollowUpPreference: CHAT_PRO_FOLLOW_UP_PREFERENCE,
      pollingPolicy: CHAT_RESULT_POLLING_POLICY
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
  const hasWordLimit = input.hasWordLimit ?? PRODUCT_CONFIG.wordCount.defaultMode === "target";
  const unlimitedCoreSections = input.unlimitedCoreSections ?? PRODUCT_CONFIG.wordCount.defaultUnlimitedCoreSections;
  const includeSectionNavigationSentence = input.includeSectionNavigationSentence ?? style.defaultIncludeSectionNavigationSentence;
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
          `Section length suggestion "${section.id}" must be a finite number.`
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
        `Section length suggestions total ${sectionTotal}, but the suggested main-text reference is ${targetWords}.`
      );
    }
  }
  const frameworkFigure = {
    aspectRatioId: input.frameworkFigure?.aspectRatioId ?? RECONSTRUCTION_OVERVIEW_FIGURE_PREFERENCES.aspectRatioId,
    customAspectWidth: input.frameworkFigure?.customAspectWidth ?? RECONSTRUCTION_OVERVIEW_FIGURE_PREFERENCES.customAspectWidth,
    customAspectHeight: input.frameworkFigure?.customAspectHeight ?? RECONSTRUCTION_OVERVIEW_FIGURE_PREFERENCES.customAspectHeight
  };
  const captionWordRange = normalizeCaptionWordRange(
    input.captionWordRange
  );
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
  const forceProForAllTurns = input.chatExecution?.forceProForAllTurns ?? DEFAULT_CHAT_EXECUTION_PREFERENCES.forceProForAllTurns;
  if (typeof forceProForAllTurns !== "boolean") {
    throw new Error("forceProForAllTurns must be a boolean.");
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
    forceProForAllTurns,
    fallbackPolicy,
    pollingPolicy: CHAT_RESULT_POLLING_POLICY
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
    includeSectionNavigationSentence,
    targetWords,
    sectionBudgets,
    includeAppendix: input.includeAppendix ?? style.defaultAppendix,
    captionWordRange,
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
    includeSectionNavigationSentence,
    targetWords,
    sectionBudgets,
    includeAppendix,
    captionWordRange,
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
    includeSectionNavigationSentence,
    targetWords,
    sectionBudgets: style.sections.map((section) => ({
      id: section.id,
      label: section.label[promptLanguage],
      words: sectionBudgets[section.id]
    })),
    includeAppendix,
    appendixLabel: promptLanguage === "zh" ? includeAppendix ? "\u5141\u8BB8\u9644\u5F55" : "\u4E0D\u4F7F\u7528\u9644\u5F55" : includeAppendix ? "Appendix allowed" : "No appendix",
    appendixDirective: includeAppendix ? style.appendixRule.enabled[promptLanguage] : style.appendixRule.disabled[promptLanguage],
    captionWordRange,
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
      includeSectionNavigationSentence,
      targetWords,
      sectionBudgets,
      includeAppendix,
      captionWordRange,
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
