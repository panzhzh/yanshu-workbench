// app/ideas/config.ts
var IDEA_DIRECTION_IDS = [
  "general-cs",
  "ai-ml",
  "nlp",
  "computer-vision",
  "data-mining",
  "systems",
  "software-engineering",
  "security",
  "hci",
  "robotics",
  "theory",
  "custom"
];
var IDEA_DIRECTIONS = {
  "general-cs": {
    label: { zh: "\u8BA1\u7B97\u673A\u79D1\u5B66\uFF08\u5F00\u653E\uFF09", en: "Computer Science \u2014 Open" },
    prompt: {
      zh: "\u8BA1\u7B97\u673A\u79D1\u5B66\uFF1B\u6839\u636E\u7528\u6237\u7ED9\u51FA\u7684\u5177\u4F53\u5174\u8DA3\u8FDB\u4E00\u6B65\u6536\u7A84\uFF0C\u4E0D\u8DE8\u5230\u975E CS \u5B66\u79D1",
      en: "Computer science; narrow the scope from the user's stated interests and do not drift into non-CS disciplines"
    }
  },
  "ai-ml": {
    label: { zh: "\u4EBA\u5DE5\u667A\u80FD\u4E0E\u673A\u5668\u5B66\u4E60", en: "AI & Machine Learning" },
    prompt: {
      zh: "\u4EBA\u5DE5\u667A\u80FD\u4E0E\u673A\u5668\u5B66\u4E60",
      en: "artificial intelligence and machine learning"
    }
  },
  nlp: {
    label: { zh: "\u81EA\u7136\u8BED\u8A00\u5904\u7406", en: "Natural Language Processing" },
    prompt: {
      zh: "\u81EA\u7136\u8BED\u8A00\u5904\u7406",
      en: "natural language processing"
    }
  },
  "computer-vision": {
    label: { zh: "\u8BA1\u7B97\u673A\u89C6\u89C9", en: "Computer Vision" },
    prompt: {
      zh: "\u8BA1\u7B97\u673A\u89C6\u89C9",
      en: "computer vision"
    }
  },
  "data-mining": {
    label: { zh: "\u6570\u636E\u6316\u6398\u4E0E\u6570\u636E\u5E93", en: "Data Mining & Databases" },
    prompt: {
      zh: "\u6570\u636E\u6316\u6398\u3001\u77E5\u8BC6\u53D1\u73B0\u4E0E\u6570\u636E\u5E93",
      en: "data mining, knowledge discovery, and databases"
    }
  },
  systems: {
    label: { zh: "\u8BA1\u7B97\u673A\u7CFB\u7EDF\u4E0E\u7F51\u7EDC", en: "Systems & Networking" },
    prompt: {
      zh: "\u8BA1\u7B97\u673A\u7CFB\u7EDF\u3001\u5206\u5E03\u5F0F\u7CFB\u7EDF\u4E0E\u7F51\u7EDC",
      en: "computer systems, distributed systems, and networking"
    }
  },
  "software-engineering": {
    label: { zh: "\u8F6F\u4EF6\u5DE5\u7A0B", en: "Software Engineering" },
    prompt: {
      zh: "\u8F6F\u4EF6\u5DE5\u7A0B\u4E0E\u7A0B\u5E8F\u5206\u6790",
      en: "software engineering and program analysis"
    }
  },
  security: {
    label: { zh: "\u5B89\u5168\u4E0E\u9690\u79C1", en: "Security & Privacy" },
    prompt: {
      zh: "\u8BA1\u7B97\u673A\u5B89\u5168\u3001\u9690\u79C1\u4E0E\u53EF\u4FE1\u8BA1\u7B97",
      en: "computer security, privacy, and trustworthy computing"
    }
  },
  hci: {
    label: { zh: "\u4EBA\u673A\u4EA4\u4E92", en: "Human\u2013Computer Interaction" },
    prompt: {
      zh: "\u4EBA\u673A\u4EA4\u4E92\u4E0E\u8BA1\u7B97\u673A\u652F\u6301\u7684\u534F\u4F5C",
      en: "human\u2013computer interaction and computer-supported collaboration"
    }
  },
  robotics: {
    label: { zh: "\u673A\u5668\u4EBA\u4E0E\u5177\u8EAB\u667A\u80FD", en: "Robotics & Embodied AI" },
    prompt: {
      zh: "\u673A\u5668\u4EBA\u3001\u5177\u8EAB\u667A\u80FD\u4E0E\u81EA\u4E3B\u7CFB\u7EDF",
      en: "robotics, embodied intelligence, and autonomous systems"
    }
  },
  theory: {
    label: { zh: "\u7406\u8BBA\u8BA1\u7B97\u673A\u79D1\u5B66", en: "Theoretical Computer Science" },
    prompt: {
      zh: "\u7406\u8BBA\u8BA1\u7B97\u673A\u79D1\u5B66\u4E0E\u7B97\u6CD5",
      en: "theoretical computer science and algorithms"
    }
  },
  custom: {
    label: { zh: "\u81EA\u5B9A\u4E49\u65B9\u5411", en: "Custom Direction" },
    prompt: {
      zh: "\u4EE5\u7528\u6237\u586B\u5199\u7684\u81EA\u5B9A\u4E49 CS \u65B9\u5411\u4E3A\u51C6",
      en: "use the custom CS direction supplied by the user"
    }
  }
};
var IDEA_COUNT_OPTIONS = [2, 3, 5, 8];
var NOVELTY_POSTURE_IDS = [
  "grounded",
  "balanced",
  "frontier"
];
var NOVELTY_POSTURES = {
  grounded: {
    label: { zh: "\u7A33\u5065\u589E\u91CF", en: "Grounded" },
    prompt: {
      zh: "\u4F18\u5148\u53EF\u6267\u884C\u4E14\u6709\u6E05\u695A\u8BC1\u636E\u7F3A\u53E3\u7684\u7A33\u5065\u589E\u91CF\u8D21\u732E\uFF0C\u4F46\u4E0D\u5F97\u628A\u5FAE\u5C0F\u6539\u52A8\u5305\u88C5\u6210\u65B0 Idea",
      en: "favor executable, evidence-backed incremental contributions without dressing minor variations up as new ideas"
    }
  },
  balanced: {
    label: { zh: "\u5E73\u8861\u63A2\u7D22", en: "Balanced" },
    prompt: {
      zh: "\u5728\u65B0\u9896\u6027\u3001\u79D1\u5B66\u610F\u4E49\u4E0E\u53EF\u6267\u884C\u6027\u4E4B\u95F4\u4FDD\u6301\u5E73\u8861",
      en: "balance novelty, scientific significance, and executability"
    }
  },
  frontier: {
    label: { zh: "\u9AD8\u98CE\u9669\u524D\u6CBF", en: "Frontier" },
    prompt: {
      zh: "\u5141\u8BB8\u63D0\u51FA\u9AD8\u98CE\u9669\u3001\u9AD8\u6F5C\u529B\u65B9\u5411\uFF0C\u4F46\u5FC5\u987B\u660E\u786E\u672A\u7ECF\u9A8C\u8BC1\u7684\u5173\u952E\u5047\u8BBE\u3001\u8D44\u6E90\u4EE3\u4EF7\u4E0E\u6700\u5FEB\u5426\u8BC1\u8DEF\u5F84",
      en: "allow high-risk, high-upside directions only when their unverified assumptions, resource costs, and fastest falsification paths are explicit"
    }
  }
};
var REFINEMENT_FREEDOMS = {
  preserve: {
    label: { zh: "\u4FDD\u7559\u6838\u5FC3", en: "Preserve Core" },
    description: {
      zh: "\u4FDD\u7559\u7814\u7A76\u95EE\u9898\u4E0E\u6838\u5FC3\u673A\u5236\uFF0C\u53EA\u4F18\u5316\u8303\u56F4\u3001\u8BBA\u8BC1\u548C\u9A8C\u8BC1\u65B9\u6848\u3002",
      en: "Keep the question and core mechanism; refine scope, argument, and validation."
    },
    prompt: {
      zh: "\u4FDD\u7559\u539F Idea \u7684\u6838\u5FC3\u7814\u7A76\u95EE\u9898\u548C\u6838\u5FC3\u673A\u5236\uFF1B\u53EA\u5141\u8BB8\u4F18\u5316\u8303\u56F4\u3001\u5047\u8BBE\u3001\u5B9A\u4F4D\u548C\u9A8C\u8BC1\u8BBE\u8BA1",
      en: "preserve the idea's core research question and mechanism; refine only its scope, hypothesis, positioning, and validation design"
    }
  },
  reframe: {
    label: { zh: "\u5141\u8BB8\u91CD\u6784", en: "Allow Reframing" },
    description: {
      zh: "\u4FDD\u7559\u6700\u6709\u4EF7\u503C\u7684\u6D1E\u5BDF\uFF0C\u5141\u8BB8\u91CD\u5199\u95EE\u9898\u3001\u673A\u5236\u6216\u5B9E\u9A8C\u4E3B\u7EBF\u3002",
      en: "Keep the strongest insight while allowing the question, mechanism, or experiment story to change."
    },
    prompt: {
      zh: "\u4FDD\u7559\u6700\u6709\u4EF7\u503C\u4E14\u6709\u8BC1\u636E\u652F\u6491\u7684\u6D1E\u5BDF\uFF1B\u5141\u8BB8\u6574\u4F53\u91CD\u6784\u7814\u7A76\u95EE\u9898\u3001\u673A\u5236\u3001\u6570\u636E\u6216\u5B9E\u9A8C\u4E3B\u7EBF",
      en: "retain the most valuable evidence-supported insight while allowing an integrated reframing of the question, mechanism, data, or experimental throughline"
    }
  },
  pivot: {
    label: { zh: "\u5141\u8BB8\u8F6C\u5411", en: "Allow Pivot" },
    description: {
      zh: "\u5F53\u539F Idea \u4E0D\u6210\u7ACB\u65F6\uFF0C\u53EF\u63D0\u51FA\u66F4\u503C\u5F97\u6267\u884C\u7684\u76F8\u90BB\u65B9\u5411\u3002",
      en: "When the original idea fails, propose a more defensible adjacent direction."
    },
    prompt: {
      zh: "\u5F53\u539F Idea \u7684\u6838\u5FC3\u547D\u9898\u4E0D\u6210\u7ACB\u6216\u4E0D\u503C\u5F97\u6295\u5165\u65F6\uFF0C\u5141\u8BB8\u8F6C\u5411\u76F8\u90BB\u4F46\u66F4\u53EF\u8FA9\u62A4\u7684\u7814\u7A76\u65B9\u5411\uFF1B\u5FC5\u987B\u6E05\u695A\u8BF4\u660E\u8F6C\u5411\u539F\u56E0\u548C\u4FDD\u7559\u4E86\u4EC0\u4E48",
      en: "when the core proposition is unsound or not worth pursuing, allow a pivot to a more defensible adjacent direction and state exactly why the pivot is needed and what is retained"
    }
  }
};
var BASE_IDEA_PREFERENCES = {
  directionId: "general-cs",
  focus: "",
  seed: "",
  dataset: "",
  recentYears: 5,
  topConferences: true,
  topJournals: true,
  customVenues: "",
  pursueSota: false,
  resourceConstraints: "",
  ideaCount: 5,
  noveltyPosture: "balanced",
  refinementFreedom: "preserve",
  additionalCriteria: ""
};
var DEFAULT_IDEA_PREFERENCES_BY_MODE = {
  discovery: {
    ...BASE_IDEA_PREFERENCES,
    recentYears: 2,
    ideaCount: 2
  },
  evaluation: {
    ...BASE_IDEA_PREFERENCES
  }
};
function getDefaultIdeaPreferences(mode) {
  return { ...DEFAULT_IDEA_PREFERENCES_BY_MODE[mode] };
}
function clean(value) {
  return value.trim();
}
function optionalValue(value, language, fallbackZh, fallbackEn) {
  return clean(value) || (language === "zh" ? fallbackZh : fallbackEn);
}
function directionValue(preferences, language) {
  const base = IDEA_DIRECTIONS[preferences.directionId].prompt[language];
  const focus = clean(preferences.focus);
  return focus ? `${base}\uFF1B${focus}` : base;
}
function venueValue(preferences, language) {
  const scopes = [];
  if (preferences.topConferences) {
    scopes.push(language === "zh" ? "\u5F53\u524D\u5B50\u9886\u57DF\u516C\u8BA4\u9876\u4F1A" : "established top conferences in the subfield");
  }
  if (preferences.topJournals) {
    scopes.push(language === "zh" ? "\u5F53\u524D\u5B50\u9886\u57DF\u516C\u8BA4\u9876\u520A" : "established top journals in the subfield");
  }
  if (clean(preferences.customVenues)) {
    scopes.push(
      language === "zh" ? `\u7528\u6237\u6307\u5B9A venue\uFF1A${clean(preferences.customVenues)}` : `user-specified venues: ${clean(preferences.customVenues)}`
    );
  }
  return scopes.join(language === "zh" ? "\uFF1B" : "; ") || (language === "zh" ? "\u4E0D\u9650\u5B9A venue\uFF0C\u4F46\u5FC5\u987B\u4F18\u5148\u53EF\u9760\u7684\u4E00\u624B\u5B66\u672F\u6765\u6E90" : "no venue restriction, but prioritize reliable primary scholarly sources");
}
function discoveryPrompt(preferences, language) {
  const direction = directionValue(preferences, language);
  const dataset = optionalValue(
    preferences.dataset,
    language,
    "\u672A\u6307\u5B9A\uFF1B\u6839\u636E\u4EFB\u52A1\u8BC1\u636E\u63A8\u8350\uFF0C\u4E0D\u5F97\u4E3A\u4E86\u8FC1\u5C31\u73B0\u6210 benchmark \u53CD\u5411\u865A\u6784\u95EE\u9898",
    "not specified; recommend from task evidence and never invent a problem merely to fit an available benchmark"
  );
  const seed = optionalValue(
    preferences.seed,
    language,
    "\u672A\u63D0\u4F9B\uFF1B\u4ECE\u5DF2\u914D\u7F6E\u65B9\u5411\u5F00\u5C55\u8BC1\u636E\u9A71\u52A8\u68C0\u7D22",
    "not supplied; begin evidence-grounded search from the configured direction"
  );
  const resources = optionalValue(
    preferences.resourceConstraints,
    language,
    "\u672A\u6307\u5B9A\uFF1B\u6309\u666E\u901A\u9AD8\u6821 CS \u7814\u7A76\u56E2\u961F\u53EF\u83B7\u5F97\u7684\u8D44\u6E90\u8FDB\u884C\u4FDD\u5B88\u4F30\u8BA1\uFF0C\u5E76\u663E\u5F0F\u6807\u6CE8\u5047\u8BBE",
    "not specified; make conservative assumptions for an ordinary academic CS team and label them explicitly"
  );
  const criteria = optionalValue(
    preferences.additionalCriteria,
    language,
    "\u65E0\u989D\u5916\u7EA6\u675F",
    "none"
  );
  const venues = venueValue(preferences, language);
  const novelty = NOVELTY_POSTURES[preferences.noveltyPosture].prompt[language];
  if (language === "zh") {
    return `# \u4E3A\u8BA1\u7B97\u673A\u79D1\u5B66\u7814\u7A76\u53D1\u73B0\u53EF\u9A8C\u8BC1\u7684 Idea

\u4F60\u662F\u4E00\u540D\u4E25\u8C28\u7684 CS \u7814\u7A76\u7B56\u7565\u4E13\u5BB6\u3002\u4F60\u7684\u4EFB\u52A1\u4E0D\u662F\u51ED\u5173\u952E\u8BCD\u201C\u8111\u66B4\u201D\uFF0C\u800C\u662F\u5148\u5EFA\u7ACB\u53EF\u6838\u9A8C\u7684\u8FD1\u671F\u7814\u7A76\u56FE\u666F\uFF0C\u518D\u63D0\u51FA\u503C\u5F97\u6295\u5165\u5B9E\u9A8C\u7684\u5019\u9009 Idea\u3002\u6240\u6709\u65B0\u9896\u6027\u3001SOTA \u4E0E\u6587\u732E\u5224\u65AD\u5FC5\u987B\u7531\u771F\u5B9E\u6765\u6E90\u652F\u6491\u3002

## \u5F53\u524D\u914D\u7F6E
- \u7814\u7A76\u65B9\u5411\uFF1A${direction}
- \u95EE\u9898\u7EBF\u7D22\uFF1A${seed}
- \u6570\u636E\u96C6\u6216\u6570\u636E\u6761\u4EF6\uFF1A${dataset}
- \u6587\u732E\u65F6\u95F4\u7A97\uFF1A\u4EE5\u6267\u884C\u5F53\u5929\u4E3A\u57FA\u51C6\uFF0C\u91CD\u70B9\u68C0\u7D22\u8FD1 ${preferences.recentYears} \u5E74
- venue \u8303\u56F4\uFF1A${venues}
- SOTA \u76EE\u6807\uFF1A${preferences.pursueSota ? "\u662F\uFF1B\u5FC5\u987B\u5B9A\u4E49\u660E\u786E\u6570\u636E\u96C6\u3001\u6307\u6807\u3001\u5F3A\u57FA\u7EBF\u4E0E\u53EF\u6838\u9A8C\u76EE\u6807\uFF0C\u4E0D\u63A5\u53D7\u53EA\u8FFD\u6C42\u65E0\u89E3\u91CA\u7684\u5FAE\u5C0F\u6DA8\u70B9" : "\u5426\uFF1B\u4E0D\u5F97\u56E0\u4E0D\u8FFD\u6C42\u6392\u884C\u699C\u7B2C\u4E00\u800C\u964D\u4F4E\u5BF9\u8D21\u732E\u6E05\u6670\u5EA6\u7684\u8981\u6C42"}
- \u8D44\u6E90\u4E0E\u6267\u884C\u8FB9\u754C\uFF1A${resources}
- \u63A2\u7D22\u5E45\u5EA6\uFF1A${novelty}
- \u6700\u7EC8\u5019\u9009\u6570\u91CF\uFF1A${preferences.ideaCount}
- \u8865\u5145\u7EA6\u675F\uFF1A${criteria}

## \u68C0\u7D22\u4E0E\u8BC1\u636E\u89C4\u5219
1. \u5148\u786E\u8BA4\u6267\u884C\u5F53\u5929\u65E5\u671F\uFF0C\u5E76\u56F4\u7ED5\u4EFB\u52A1\u3001\u5047\u8BBE\u3001\u65B9\u6CD5\u3001\u6570\u636E\u96C6\u3001\u6307\u6807\u548C\u5931\u8D25\u73B0\u8C61\u8BBE\u8BA1\u591A\u7EC4\u68C0\u7D22\u5F0F\u3002\u91CD\u70B9\u68C0\u7D22\u8FD1 ${preferences.recentYears} \u5E74\u8BBA\u6587\uFF1B\u53EA\u6709\u4E0D\u53EF\u66FF\u4EE3\u7684\u5960\u57FA\u5DE5\u4F5C\u624D\u53EF\u8D85\u51FA\u7A97\u53E3\u5E76\u5355\u72EC\u6807\u8BB0\u3002
2. \u201C\u9876\u4F1A/\u9876\u520A\u201D\u5FC5\u987B\u6309\u5F53\u524D\u5B50\u9886\u57DF\u8BC6\u522B\u5E76\u7B80\u8981\u8BF4\u660E\u9009\u62E9\u4F9D\u636E\uFF0C\u4E0D\u5F97\u628A\u4EFB\u610F venue \u81EA\u79F0\u4E3A\u9876\u7EA7\u3002\u9ED8\u8BA4\u4F18\u5148\u68C0\u7D22\u4E0E\u5F53\u524D\u95EE\u9898\u76F4\u63A5\u76F8\u5173\u7684\u516C\u8BA4\u9876\u4F1A\u8BBA\u6587\uFF0C\u518D\u4EE5\u9876\u520A\u548C\u5FC5\u8981\u7684\u5960\u57FA\u5DE5\u4F5C\u8865\u8DB3\u8BC1\u636E\uFF1B\u4F18\u5148\u4F7F\u7528\u5B98\u65B9 proceedings\u3001OpenReview\u3001\u51FA\u7248\u793E\u9875\u9762\u3001arXiv \u539F\u6587\u3001\u9879\u76EE\u4E3B\u9875\u548C\u5B98\u65B9\u4EE3\u7801\u4ED3\u5E93\u3002
3. \u6BCF\u7BC7\u5B9E\u8D28\u6027\u76F8\u5173\u5DE5\u4F5C\u987B\u6838\u9A8C\u6807\u9898\u3001\u4F5C\u8005\u3001\u5E74\u4EFD\u3001venue \u548C\u7A33\u5B9A\u94FE\u63A5\u3002\u65E0\u6CD5\u6838\u9A8C\u7684\u4FE1\u606F\u4E0D\u5F97\u8865\u5199\uFF1B\u9884\u5370\u672C\u4E0E\u6B63\u5F0F\u53D1\u8868\u7248\u672C\u987B\u533A\u5206\u3002
4. \u4E0D\u5F97\u628A\u201C\u6CA1\u6709\u641C\u5230\u201D\u5199\u6210\u201C\u4ECE\u672A\u6709\u4EBA\u7814\u7A76\u201D\u3002\u53EA\u80FD\u62A5\u544A\u5728\u660E\u786E\u68C0\u7D22\u8303\u56F4\u5185\u672A\u53D1\u73B0\u9AD8\u5EA6\u91CD\u5408\u5DE5\u4F5C\uFF0C\u5E76\u5217\u51FA\u68C0\u7D22\u8FB9\u754C\u4E0E\u4E0D\u786E\u5B9A\u6027\u3002
5. \u82E5\u6307\u5B9A\u516C\u5F00\u6570\u636E\u96C6\uFF0C\u6838\u9A8C\u5176\u5B98\u65B9\u6765\u6E90\u3001\u8BB8\u53EF\u6216\u8BBF\u95EE\u6761\u4EF6\u3001\u4EFB\u52A1\u5B9A\u4E49\u3001\u5212\u5206\u3001\u5E38\u7528\u6307\u6807\u3001\u6CC4\u6F0F\u98CE\u9669\u548C\u5F53\u524D\u5F3A\u57FA\u7EBF\u3002\u82E5\u662F\u79C1\u6709\u6216\u672A\u516C\u5F00\u6570\u636E\uFF0C\u53EA\u628A\u7528\u6237\u63D0\u4F9B\u7684\u4FE1\u606F\u89C6\u4E3A\u6761\u4EF6\uFF0C\u4E0D\u4F2A\u9020\u5916\u90E8\u4E8B\u5B9E\u3002
6. \u4E0D\u5F97\u53D1\u660E\u5B9E\u9A8C\u7ED3\u679C\u3001SOTA \u6570\u5B57\u3001\u6570\u636E\u89C4\u6A21\u3001\u4EE3\u7801\u53EF\u7528\u6027\u6216\u8BBA\u6587\u7ED3\u8BBA\u3002\u5F15\u7528\u6570\u91CF\u4E0D\u7B49\u4E8E\u8BC1\u636E\u8D28\u91CF\u3002

## \u5DE5\u4F5C\u6D41\u7A0B
1. \u5EFA\u7ACB\u7814\u7A76\u56FE\u666F\uFF1A\u5F52\u7EB3\u5DF2\u89E3\u51B3\u95EE\u9898\u3001\u4ECD\u7136\u6210\u7ACB\u7684\u74F6\u9888\u3001\u5F7C\u6B64\u77DB\u76FE\u7684\u53D1\u73B0\u3001\u672A\u7ECF\u68C0\u9A8C\u7684\u5E38\u89C1\u5047\u8BBE\uFF0C\u4EE5\u53CA\u6570\u636E\u3001\u6307\u6807\u3001\u6CDB\u5316\u3001\u6548\u7387\u3001\u9C81\u68D2\u6027\u3001\u590D\u73B0\u6216\u771F\u5B9E\u90E8\u7F72\u4E2D\u7684\u7F3A\u53E3\u3002
2. \u4ECE\u591A\u79CD\u8D21\u732E\u5F62\u6001\u53D1\u6563\u5185\u90E8\u5019\u9009\u6C60\uFF0C\u5305\u62EC\u4F46\u4E0D\u9650\u4E8E\u65B0\u95EE\u9898\u3001\u65B0\u673A\u5236\u3001\u65B0\u6D4B\u91CF\u6216\u6307\u6807\u3001\u65B0\u6570\u636E/\u4EFB\u52A1\u3001\u7A33\u5065\u6027\u4E0E\u8FB9\u754C\u5206\u6790\u3001\u7CFB\u7EDF\u6743\u8861\u3001\u590D\u73B0\u4E0E\u6709\u4EF7\u503C\u7684\u8D1F\u7ED3\u679C\uFF1B\u53EA\u4FDD\u7559\u9002\u5408\u5F53\u524D\u65B9\u5411\u548C\u8D44\u6E90\u7684\u7C7B\u578B\u3002
3. \u5408\u5E76\u53EA\u662F\u6362\u672F\u8BED\u3001\u6362\u6A21\u578B\u6216\u6362\u6570\u636E\u96C6\u7684\u91CD\u590D\u5019\u9009\u3002\u5BF9\u5269\u4F59\u5019\u9009\u9010\u4E00\u68C0\u7D22\u6700\u63A5\u8FD1\u7684\u5DE5\u4F5C\uFF0C\u6BD4\u8F83\u95EE\u9898\u3001\u5047\u8BBE\u3001\u673A\u5236\u3001\u6570\u636E\u3001\u8BC4\u4EF7\u548C\u9884\u671F\u8D21\u732E\uFF0C\u800C\u4E0D\u662F\u53EA\u6BD4\u8F83\u6807\u9898\u5173\u952E\u8BCD\u3002
4. \u5BF9\u6BCF\u4E2A\u5019\u9009\u6267\u884C\u6700\u5FEB\u5426\u8BC1\u6D4B\u8BD5\uFF1A\u6307\u51FA\u6700\u53EF\u80FD\u8BA9\u9879\u76EE\u5931\u8D25\u7684\u5355\u4E00\u5047\u8BBE\uFF0C\u4EE5\u53CA\u4E00\u5468\u5185\u6216\u6700\u5C0F\u9884\u7B97\u4E0B\u80FD\u591F\u68C0\u9A8C\u5B83\u7684\u5B9E\u9A8C\u3002
5. \u7EFC\u5408\u8BC1\u636E\u540E\u53EA\u8F93\u51FA ${preferences.ideaCount} \u4E2A\u771F\u6B63\u4E0D\u540C\u7684\u5019\u9009\uFF0C\u5E76\u7ED9\u51FA\u660E\u786E\u6392\u5E8F\u3002\u4E0D\u5F97\u4E3A\u4E86\u51D1\u6570\u4FDD\u7559\u8BC1\u636E\u8584\u5F31 Idea\u3002

## \u6BCF\u4E2A\u5019\u9009 Idea \u7684\u6700\u4F4E\u5408\u540C
- \u6682\u5B9A\u6807\u9898\u4E0E\u4E00\u53E5\u8BDD\u6838\u5FC3\u6D1E\u5BDF\uFF1B
- \u4ECA\u5929\u4ECD\u5B58\u5728\u7684\u5177\u4F53\u95EE\u9898\uFF0C\u4EE5\u53CA\u8FD1\u671F\u8BC1\u636E\u5982\u4F55\u652F\u6301\u8FD9\u4E00\u5224\u65AD\uFF1B
- \u53EF\u8BC1\u4F2A\u7684\u7814\u7A76\u95EE\u9898\u6216\u5047\u8BBE\uFF1B
- \u65B9\u6CD5\u6216\u7814\u7A76\u8BBE\u8BA1\u7684\u6838\u5FC3\u673A\u5236\uFF0C\u4E0D\u5199\u6210\u7A7A\u6CDB\u6A21\u5757\u7EC4\u5408\uFF1B
- \u5EFA\u8BAE\u6570\u636E\u96C6\u3001\u6307\u6807\u3001\u5F3A\u57FA\u7EBF\u548C\u6700\u5C0F\u51B3\u5B9A\u6027\u5B9E\u9A8C\uFF1B
- \u4E0E 2\u20134 \u7BC7\u6700\u63A5\u8FD1\u5DE5\u4F5C\u7684\u9010\u9879\u5DEE\u5F02\uFF0C\u4EE5\u53CA\u53EF\u80FD\u88AB\u5224\u5B9A\u201C\u4E0D\u65B0\u201D\u7684\u4F4D\u7F6E\uFF1B
- \u9884\u671F\u8D21\u732E\u7C7B\u578B\uFF1B${preferences.pursueSota ? "\u660E\u786E SOTA \u6210\u529F\u6761\u4EF6\u548C\u5373\u4F7F\u672A\u8FBE\u5230 SOTA \u4ECD\u53EF\u6210\u7ACB\u7684\u79D1\u5B66\u4EF7\u503C" : "\u660E\u786E\u4E0D\u4F9D\u8D56 SOTA \u7684\u79D1\u5B66\u4EF7\u503C\uFF0C\u4E0D\u5F97\u6697\u793A\u672A\u7ECF\u9A8C\u8BC1\u7684\u6027\u80FD\u9886\u5148"}\uFF1B
- \u6240\u9700\u6570\u636E\u3001\u8BA1\u7B97\u3001\u65F6\u95F4\u4E0E\u6280\u80FD\uFF0C\u6700\u5927\u6267\u884C\u98CE\u9669\u3001\u4F26\u7406\u6216\u8BB8\u53EF\u98CE\u9669\uFF1B
- 1\u20135 \u5206\u7684\u6E05\u6670\u5EA6\u3001\u65B0\u9896\u6027\u3001\u79D1\u5B66\u610F\u4E49\u3001\u6709\u6548\u6027\u3001\u53EF\u884C\u6027\u3001\u65F6\u673A\u4E0E\u8BC1\u636E\u5C31\u7EEA\u5EA6\uFF1B\u6BCF\u9879\u7ED9\u4E00\u53E5\u4F9D\u636E\u548C\u7F6E\u4FE1\u5EA6\uFF0C\u4E0D\u7528\u5E73\u5747\u5206\u63A9\u76D6\u81F4\u547D\u95EE\u9898\u3002

## \u6392\u5E8F\u4E0E\u63A8\u8350
\u7ED9\u51FA\u5019\u9009\u6BD4\u8F83\u8868\uFF0C\u5E76\u9009\u62E9\u4E00\u4E2A\u201C\u6700\u503C\u5F97\u5148\u9A8C\u8BC1\u201D\u7684 Idea\u3002\u63A8\u8350\u7406\u7531\u5FC5\u987B\u540C\u65F6\u8003\u8651\u79D1\u5B66\u4EF7\u503C\u3001\u8FD1\u90BB\u7ADE\u4E89\u3001\u8D44\u6E90\u5339\u914D\u548C\u6700\u5FEB\u5426\u8BC1\u6210\u672C\u3002\u968F\u540E\u7ED9\u51FA\u7B2C\u4E00\u5468\u884C\u52A8\u6E05\u5355\u3001\u505C\u6B62\u6761\u4EF6\uFF0C\u4EE5\u53CA\u9700\u8981\u6301\u7EED\u76D1\u6D4B\u7684\u5173\u952E\u8BCD\u3001\u7814\u7A76\u56E2\u961F\u6216 venue\u3002

## \u8F93\u51FA\u6587\u4EF6
\u521B\u5EFA\u4E24\u4EFD\u8BED\u4E49\u4E00\u81F4\u3001\u53EF\u76F4\u63A5\u4E0B\u8F7D\u7684 Markdown \u6587\u4EF6\uFF0C\u4E0D\u8981\u53EA\u5728\u804A\u5929\u4E2D\u7ED9\u6458\u8981\uFF1A
1. \`<topic_slug>_idea_discovery_zh.md\`
2. \`<topic_slug>_idea_discovery_en.md\`

\u4E24\u4EFD\u6587\u4EF6\u5747\u5305\u542B\uFF1A\u914D\u7F6E\u5FEB\u7167\u3001\u68C0\u7D22\u534F\u8BAE\u4E0E\u8986\u76D6\u8303\u56F4\u3001\u7814\u7A76\u673A\u4F1A\u56FE\u8C31\u3001\u5019\u9009 Idea \u5B8C\u6574\u5408\u540C\u3001\u8FD1\u90BB\u5DE5\u4F5C\u6BD4\u8F83\u3001\u8BC4\u5206\u4E0E\u4E0D\u786E\u5B9A\u6027\u3001\u6700\u7EC8\u63A8\u8350\u3001\u7B2C\u4E00\u5468\u9A8C\u8BC1\u8BA1\u5212\u548C\u5E26\u7A33\u5B9A\u94FE\u63A5\u7684\u53C2\u8003\u6587\u732E\u3002\u82F1\u6587\u7248\u5E94\u4E3A\u81EA\u7136\u5B66\u672F\u82F1\u8BED\uFF0C\u4E0D\u505A\u9010\u53E5\u673A\u5668\u5F0F\u7FFB\u8BD1\u3002

\u4E0D\u5F97\u751F\u6210 \`.tex\`\u3001PDF\u3001DOCX\u3001BibTeX \u6216\u865A\u6784\u9644\u4EF6\u3002\u82E5\u5173\u952E\u4FE1\u606F\u4E0D\u8DB3\uFF0C\u5728\u62A5\u544A\u4E2D\u660E\u786E\u5047\u8BBE\u4E0E\u5F85\u6838\u9A8C\u9879\uFF0C\u4F46\u4ECD\u5B8C\u6210\u5728\u5F53\u524D\u8BC1\u636E\u4E0B\u80FD\u591F\u5B8C\u6210\u7684\u5206\u6790\u3002`;
  }
  return `# Discover Verifiable Computer Science Research Ideas

You are a rigorous CS research strategist. Do not brainstorm from keywords. Build a verifiable picture of the recent field first, then propose ideas worth experimental investment. Every novelty, SOTA, and literature judgment must be grounded in authentic sources.

## Configuration
- Research direction: ${direction}
- Problem seed: ${seed}
- Dataset or data condition: ${dataset}
- Literature window: focus on the most recent ${preferences.recentYears} years as of the execution date
- Venue scope: ${venues}
- SOTA objective: ${preferences.pursueSota ? "required; define the dataset, metric, strongest baselines, and a verifiable target, and reject unexplained marginal leaderboard chasing" : "not required; contribution clarity remains mandatory even without a leaderboard-first objective"}
- Resources and execution limits: ${resources}
- Exploration posture: ${novelty}
- Final candidate count: ${preferences.ideaCount}
- Additional constraints: ${criteria}

## Search and evidence rules
1. Establish the actual execution date. Design multiple queries around the task, assumptions, methods, datasets, metrics, and failure phenomena. Focus on the most recent ${preferences.recentYears} years; label indispensable older foundational work separately.
2. Identify major conferences and journals for the selected subfield and briefly justify the choice. Never call an arbitrary venue \u201Ctop.\u201D By default, search established top-conference papers directly related to the problem first, then use top journals and indispensable foundational work to complete the evidence. Prefer official proceedings, OpenReview, publisher pages, original arXiv records, project pages, and official code repositories.
3. Verify the title, authors, year, venue, and stable link for every materially relevant paper. Do not fill missing metadata. Distinguish preprints from formally published versions.
4. Never turn \u201Cnot found\u201D into \u201Cnever studied.\u201D Report only that no close match was found within a documented search scope, and state the coverage limits and uncertainty.
5. For a named public dataset, verify its official source, license or access conditions, task definition, split, common metrics, leakage risks, and current strong baselines. Treat private or unpublished data only as a user-supplied condition.
6. Never invent results, SOTA values, dataset sizes, code availability, or paper conclusions. Citation volume is not evidence quality.

## Workflow
1. Map the landscape: established solutions, bottlenecks that still hold, conflicting findings, untested common assumptions, and gaps in data, metrics, generalization, efficiency, robustness, reproducibility, or deployment.
2. Build a larger internal pool across contribution types\u2014new problem, mechanism, measurement or metric, dataset or task, robustness and boundary analysis, systems trade-off, replication, or valuable negative result\u2014keeping only types that fit the configured scope and resources.
3. Merge candidates that merely rename a component, swap a model, or change a dataset. For every remaining candidate, retrieve the nearest work and compare the problem, assumptions, mechanism, data, evaluation, and contribution rather than title keywords.
4. Apply a fastest-falsification test: identify the single assumption most likely to kill each project and the experiment that could test it within one week or the smallest practical budget.
5. Return only ${preferences.ideaCount} substantively distinct candidates after evidence review. Do not keep weak ideas merely to satisfy the count.

## Minimum contract for each idea
- Working title and one-sentence nugget;
- The concrete problem that still exists today and recent evidence for it;
- A falsifiable research question or hypothesis;
- The core mechanism or research design, not a generic stack of modules;
- Recommended datasets, metrics, strong baselines, and minimum decisive experiment;
- Point-by-point differentiation from 2\u20134 nearest papers and where reviewers may still judge it non-novel;
- Contribution type; ${preferences.pursueSota ? "a precise SOTA success condition plus scientific value that can survive a non-SOTA outcome" : "scientific value independent of SOTA, with no unsupported claim of performance leadership"};
- Data, compute, time, and skill needs; main execution, ethical, and licensing risks;
- 1\u20135 ratings for clarity, novelty, significance, validity, feasibility, timing, and evidence readiness, each with a one-sentence rationale and confidence. Never let an average conceal a fatal weakness.

## Ranking and recommendation
Provide a comparison table and select one idea as \u201Cbest to test first.\u201D The recommendation must jointly consider scientific value, nearest competition, resource fit, and falsification cost. Give a first-week action list, stop conditions, and a watch list of queries, groups, or venues.

## Output files
Create two semantically aligned, directly downloadable Markdown files rather than only a chat summary:
1. \`<topic_slug>_idea_discovery_zh.md\`
2. \`<topic_slug>_idea_discovery_en.md\`

Both files must contain the configuration snapshot, search protocol and coverage, opportunity map, complete idea contracts, nearest-work comparisons, ratings and uncertainty, final recommendation, first-week validation plan, and references with stable links. Write the Chinese version naturally and the English version in natural academic English; do not translate sentence by sentence mechanically.

Do not create TeX, PDF, DOCX, BibTeX, or invented attachments. If critical information is missing, state assumptions and verification needs in the reports while completing everything the available evidence supports.`;
}
function evaluationPrompt(preferences, language) {
  const direction = directionValue(preferences, language);
  const dataset = optionalValue(
    preferences.dataset,
    language,
    "\u4EE5 Idea \u539F\u6587\u4E3A\u51C6\uFF1B\u82E5\u672A\u6307\u5B9A\uFF0C\u53EA\u63D0\u51FA\u7ECF\u8FC7\u6765\u6E90\u6838\u9A8C\u7684\u5019\u9009\uFF0C\u4E0D\u64C5\u81EA\u9501\u5B9A\u6570\u636E\u96C6",
    "use the idea as supplied; if unspecified, propose only source-verified candidates and do not silently lock in a dataset"
  );
  const idea = optionalValue(
    preferences.seed,
    language,
    "\u8BF7\u8BFB\u53D6\u540C\u4E00\u5BF9\u8BDD\u4E2D\u63D0\u4F9B\u7684 Idea \u63CF\u8FF0\u6216 Markdown \u6587\u4EF6\uFF1B\u82E5\u4ECD\u4E0D\u5B58\u5728\uFF0C\u53EA\u8BE2\u95EE\u4E00\u6B21\u5E76\u7B49\u5F85\uFF0C\u4E0D\u5F97\u51ED\u7A7A\u8865\u9020",
    "read the idea description or Markdown file supplied in the same conversation; if none exists, ask once and wait rather than inventing one"
  );
  const resources = optionalValue(
    preferences.resourceConstraints,
    language,
    "\u672A\u6307\u5B9A\uFF1B\u6309\u666E\u901A\u9AD8\u6821 CS \u7814\u7A76\u56E2\u961F\u53EF\u83B7\u5F97\u7684\u8D44\u6E90\u8FDB\u884C\u4FDD\u5B88\u4F30\u8BA1\uFF0C\u5E76\u663E\u5F0F\u6807\u6CE8\u5047\u8BBE",
    "not specified; make conservative assumptions for an ordinary academic CS team and label them explicitly"
  );
  const criteria = optionalValue(
    preferences.additionalCriteria,
    language,
    "\u65E0\u989D\u5916\u6807\u51C6",
    "none"
  );
  const venues = venueValue(preferences, language);
  const freedom = REFINEMENT_FREEDOMS[preferences.refinementFreedom].prompt[language];
  if (language === "zh") {
    return `# \u8BC4\u4F30\u5E76\u4F18\u5316\u4E00\u4E2A\u8BA1\u7B97\u673A\u79D1\u5B66\u7814\u7A76 Idea

\u4F60\u662F\u4E00\u540D\u4E25\u683C\u4F46\u5EFA\u8BBE\u6027\u7684 CS \u9886\u57DF\u4E13\u5BB6\u3001\u5BA1\u7A3F\u4EBA\u548C\u5B9E\u9A8C\u8D1F\u8D23\u4EBA\u3002\u5148\u628A\u7528\u6237\u7684 Idea \u8FD8\u539F\u6210\u53EF\u68C0\u9A8C\u7684\u7814\u7A76\u5408\u540C\uFF0C\u518D\u7528\u771F\u5B9E\u6587\u732E\u3001\u4EE3\u7801\u3001\u6570\u636E\u548C\u8D44\u6E90\u6761\u4EF6\u8FDB\u884C\u538B\u529B\u6D4B\u8BD5\u3002\u4E0D\u8981\u56E0\u4E3A\u63AA\u8F9E\u6D41\u7545\u800C\u9AD8\u4F30 Idea\uFF0C\u4E5F\u4E0D\u8981\u7528\u6CDB\u6CDB\u6279\u8BC4\u4EE3\u66FF\u8BC1\u636E\u3002

## \u5F53\u524D\u914D\u7F6E
- \u7814\u7A76\u65B9\u5411\uFF1A${direction}
- \u5F85\u8BC4\u4F30 Idea\uFF1A${idea}
- \u6570\u636E\u96C6\u6216\u6570\u636E\u6761\u4EF6\uFF1A${dataset}
- \u6587\u732E\u65F6\u95F4\u7A97\uFF1A\u4EE5\u6267\u884C\u5F53\u5929\u4E3A\u57FA\u51C6\uFF0C\u91CD\u70B9\u68C0\u7D22\u8FD1 ${preferences.recentYears} \u5E74
- venue \u8303\u56F4\uFF1A${venues}
- SOTA \u76EE\u6807\uFF1A${preferences.pursueSota ? "\u662F\uFF1B\u4F18\u5316\u7A3F\u5FC5\u987B\u7ED9\u51FA\u53EF\u6838\u9A8C\u7684\u76EE\u6807\u6570\u636E\u96C6\u3001\u6307\u6807\u548C\u5F3A\u57FA\u7EBF\uFF0C\u540C\u65F6\u907F\u514D\u53EA\u9760\u5FAE\u5C0F\u6DA8\u70B9\u6210\u7ACB" : "\u5426\uFF1B\u7528\u79D1\u5B66\u610F\u4E49\u800C\u975E\u6392\u884C\u699C\u7B2C\u4E00\u5224\u65AD\u4EF7\u503C"}
- \u8D44\u6E90\u4E0E\u6267\u884C\u8FB9\u754C\uFF1A${resources}
- \u4F18\u5316\u81EA\u7531\u5EA6\uFF1A${freedom}
- \u8865\u5145\u8BC4\u4F30\u6807\u51C6\uFF1A${criteria}

## \u8BC1\u636E\u89C4\u5219
1. \u786E\u8BA4\u6267\u884C\u5F53\u5929\u65E5\u671F\uFF0C\u5E76\u56F4\u7ED5 Idea \u7684\u95EE\u9898\u3001claim\u3001\u673A\u5236\u3001\u6570\u636E\u3001\u6307\u6807\u3001baseline \u548C\u5931\u8D25\u6761\u4EF6\u8BBE\u8BA1\u68C0\u7D22\u3002\u91CD\u70B9\u8986\u76D6\u8FD1 ${preferences.recentYears} \u5E74\uFF0C\u5FC5\u8981\u7684\u5960\u57FA\u5DE5\u4F5C\u5355\u72EC\u5217\u51FA\u3002
2. \u4F18\u5148\u4F7F\u7528\u5B98\u65B9 proceedings\u3001OpenReview\u3001\u51FA\u7248\u793E\u9875\u9762\u3001\u539F\u59CB arXiv \u8BB0\u5F55\u3001\u9879\u76EE\u4E3B\u9875\u3001\u6570\u636E\u96C6\u4E3B\u9875\u548C\u5B98\u65B9\u4EE3\u7801\u4ED3\u5E93\u3002\u9010\u9879\u6838\u9A8C\u6807\u9898\u3001\u4F5C\u8005\u3001\u5E74\u4EFD\u3001venue\u3001\u7248\u672C\u548C\u7A33\u5B9A\u94FE\u63A5\u3002
3. \u81F3\u5C11\u68C0\u7D22\u6700\u63A5\u8FD1\u7684\u76F4\u63A5\u7ADE\u4E89\u5DE5\u4F5C\uFF0C\u800C\u4E0D\u662F\u53EA\u627E\u540C\u4E3B\u9898\u8BBA\u6587\u3002\u6BD4\u8F83\u95EE\u9898\u5B9A\u4E49\u3001\u5173\u952E\u5047\u8BBE\u3001\u6280\u672F\u673A\u5236\u3001\u6570\u636E\u3001\u8BC4\u4EF7\u534F\u8BAE\u3001\u8BC1\u636E\u4E0E\u8D21\u732E\u8FB9\u754C\u3002
4. \u4E0D\u5F97\u628A\u68C0\u7D22\u4E0D\u5230\u7B49\u540C\u4E8E\u7EDD\u5BF9\u65B0\u9896\uFF0C\u4E0D\u5F97\u53D1\u660E\u8BBA\u6587\u7ED3\u8BBA\u3001\u5B9E\u9A8C\u6570\u5B57\u3001SOTA\u3001\u6570\u636E\u89C4\u6A21\u3001\u8BB8\u53EF\u6216\u4EE3\u7801\u72B6\u6001\u3002\u5C06\u4E8B\u5B9E\u3001\u4F5C\u8005\u4E3B\u5F20\u548C\u4F60\u7684\u63A8\u65AD\u660E\u786E\u5206\u5F00\u3002
5. \u82E5\u6307\u5B9A\u6570\u636E\u96C6\uFF0C\u6838\u9A8C\u6765\u6E90\u3001\u8BBF\u95EE/\u8BB8\u53EF\u3001\u5212\u5206\u3001\u6307\u6807\u3001\u6CC4\u6F0F\u98CE\u9669\u3001\u9971\u548C\u5EA6\u548C\u5F53\u524D\u5F3A\u57FA\u7EBF\uFF1B\u82E5\u4E3A\u79C1\u6709\u6570\u636E\uFF0C\u53EA\u80FD\u4F9D\u636E\u7528\u6237\u63D0\u4F9B\u7684\u4FE1\u606F\u8BC4\u4F30\u3002

## \u7B2C\u4E00\u9636\u6BB5\uFF1A\u62BD\u53D6 Idea \u5408\u540C
\u7528\u6700\u5F3A\u3001\u6700\u5177\u4F53\u4E14\u4E0D\u66FF\u4F5C\u8005\u8865\u9020\u4E8B\u5B9E\u7684\u65B9\u5F0F\u91CD\u8FF0\uFF1A
- \u4ECA\u5929\u4ECD\u5B58\u5728\u7684\u7814\u7A76\u95EE\u9898\uFF1B
- \u4E00\u53E5\u8BDD\u6838\u5FC3\u6D1E\u5BDF\uFF1B
- \u53EF\u8BC1\u4F2A\u7684\u4E3B\u8981\u5047\u8BBE\u4E0E\u9884\u671F claim\uFF1B
- \u673A\u5236\u6216\u7814\u7A76\u8BBE\u8BA1\uFF1B
- \u6570\u636E\u3001\u6307\u6807\u3001baseline \u4E0E\u6700\u5C0F\u51B3\u5B9A\u6027\u5B9E\u9A8C\uFF1B
- \u4F9D\u8D56\u6761\u4EF6\u3001\u9884\u671F\u8D21\u732E\u7C7B\u578B\u548C\u660E\u786E\u4E0D\u58F0\u79F0\u7684\u5185\u5BB9\u3002

\u6807\u51FA\u539F Idea \u4E2D\u7F3A\u5931\u3001\u542B\u6DF7\u6216\u76F8\u4E92\u51B2\u7A81\u7684\u5B57\u6BB5\u3002\u4E0D\u8981\u7ACB\u5373\u4FEE\u6539\uFF0C\u5148\u786E\u4FDD\u8BC4\u4F30\u5BF9\u8C61\u51C6\u786E\u3002

## \u7B2C\u4E8C\u9636\u6BB5\uFF1A\u591A\u8BC1\u636E\u538B\u529B\u6D4B\u8BD5
\u5206\u522B\u4ECE\u9886\u57DF\u4E13\u5BB6\u3001\u6000\u7591\u578B\u5BA1\u7A3F\u4EBA\u548C\u5B9E\u9A8C\u8D1F\u8D23\u4EBA\u89C6\u89D2\u68C0\u67E5\uFF0C\u4F46\u6700\u7EC8\u5F62\u6210\u4E00\u4EFD\u7EDF\u4E00\u5224\u65AD\uFF1A
1. \u6E05\u6670\u5EA6\uFF1A\u95EE\u9898\u3001\u5047\u8BBE\u3001\u673A\u5236\u548C\u6210\u529F\u6761\u4EF6\u662F\u5426\u53EF\u64CD\u4F5C\uFF1B
2. \u65B0\u9896\u6027\uFF1A\u4E0E\u6700\u8FD1\u90BB\u5DE5\u4F5C\u7684\u5B9E\u8D28\u5DEE\u5F02\u662F\u5426\u6210\u7ACB\uFF0C\u662F\u5426\u53EA\u662F\u6362\u6A21\u578B\u3001\u6362\u6570\u636E\u96C6\u6216\u91CD\u65B0\u547D\u540D\uFF1B
3. \u79D1\u5B66\u610F\u4E49\uFF1A\u5373\u4F7F\u7ED3\u679C\u4E0D\u7406\u60F3\uFF0C\u662F\u5426\u4ECD\u80FD\u4EA7\u751F\u53EF\u89E3\u91CA\u3001\u53EF\u7D2F\u79EF\u7684\u77E5\u8BC6\uFF1B
4. \u6709\u6548\u6027\uFF1A\u673A\u5236\u4E0E\u5047\u8BBE\u662F\u5426\u4E00\u81F4\uFF0C\u6307\u6807\u662F\u5426\u771F\u7684\u6D4B\u91CF\u76EE\u6807\uFF0C\u56E0\u679C\u6216\u6CDB\u5316\u8868\u8FF0\u662F\u5426\u8D8A\u754C\uFF1B
5. \u53EF\u884C\u6027\uFF1A\u6570\u636E\u3001\u7B97\u529B\u3001\u65F6\u95F4\u3001\u5DE5\u7A0B\u3001\u6807\u6CE8\u3001\u4F26\u7406\u548C\u8BB8\u53EF\u662F\u5426\u5339\u914D\uFF1B
6. \u7ADE\u4E89\u4E0E\u65F6\u673A\uFF1A\u9886\u57DF\u662F\u5426\u62E5\u6324\u3001\u5BB9\u6613\u88AB\u62A2\u5148\uFF0C\u7528\u6237\u7684\u6BD4\u8F83\u4F18\u52BF\u662F\u4EC0\u4E48\uFF1B
7. \u8BC1\u636E\u4E0E\u590D\u73B0\u5C31\u7EEA\u5EA6\uFF1A\u5F3A baseline\u3001\u5F00\u6E90\u5B9E\u73B0\u3001\u8BC4\u4EF7\u534F\u8BAE\u548C\u6700\u5C0F\u5B9E\u9A8C\u662F\u5426\u53EF\u83B7\u5F97\uFF1B
8. SOTA \u4F9D\u8D56\uFF1A${preferences.pursueSota ? "SOTA \u76EE\u6807\u662F\u5426\u7CBE\u786E\u5B9A\u4E49\uFF0C\u8FBE\u5230\u5B83\u662F\u5426\u8DB3\u4EE5\u6784\u6210\u8D21\u732E\uFF0C\u672A\u8FBE\u5230\u65F6 Idea \u662F\u5426\u4ECD\u6709\u79D1\u5B66\u4EF7\u503C" : "Idea \u662F\u5426\u9519\u8BEF\u5730\u4F9D\u8D56\u6F5C\u5728\u6027\u80FD\u63D0\u5347\uFF1B\u82E5\u4E0D\u8FFD\u6C42 SOTA\uFF0C\u66FF\u4EE3\u4EF7\u503C\u662F\u5426\u8DB3\u591F\u6E05\u695A"}\u3002

\u4E3A\u6BCF\u9879\u7ED9\u51FA 1\u20135 \u5206\u3001\u8BC1\u636E\u3001\u7F6E\u4FE1\u5EA6\u548C\u95EE\u9898\u7B49\u7EA7\uFF08\u81F4\u547D / \u91CD\u5927\u4F46\u53EF\u4FEE\u590D / \u6B21\u8981\uFF09\u3002\u4E0D\u8981\u7528\u5E73\u5747\u5206\u62B5\u6D88\u81F4\u547D\u7F3A\u9677\u3002\u589E\u52A0\u4E00\u5F20\u6700\u8FD1\u90BB\u6BD4\u8F83\u8868\uFF0C\u5E76\u660E\u786E\u6700\u5F3A\u53CD\u5BF9\u610F\u89C1\u548C\u80FD\u591F\u63A8\u7FFB\u5B83\u7684\u8BC1\u636E\u3002

## \u7B2C\u4E09\u9636\u6BB5\uFF1A\u878D\u5408\u5F0F\u4F18\u5316
\u7981\u6B62\u8865\u4E01\u5F0F\u4F18\u5316\uFF1A\u4E0D\u8981\u4FDD\u7559\u6709\u7F3A\u9677\u7684\u539F Idea\uFF0C\u518D\u8FFD\u52A0\u9650\u5B9A\u8BCD\u3001\u989D\u5916\u6A21\u5757\u3001\u66F4\u591A\u6570\u636E\u96C6\u6216\u4E00\u4E32\u514D\u8D23\u58F0\u660E\u8FDB\u884C\u8865\u6551\u3002\u5148\u8BC6\u522B\u6700\u5C0F\u5B8C\u6574\u7814\u7A76\u547D\u9898\uFF0C\u518D\u6574\u4F53\u91CD\u7EC4\u95EE\u9898\u3001\u5047\u8BBE\u3001\u673A\u5236\u3001\u8BC4\u4EF7\u4E0E\u8D21\u732E\uFF0C\u4F7F\u4F18\u5316\u7A3F\u50CF\u4E00\u6B21\u6210\u5F62\u7684\u7814\u7A76\u8BBE\u8BA1\u3002

\u4F18\u5316\u8FB9\u754C\uFF1A${freedom}\u3002\u4E0D\u5F97\u865A\u6784\u6570\u636E\u3001\u7ED3\u679C\u3001\u8D44\u6E90\u6216\u6587\u732E\u3002\u6BCF\u9879\u6539\u53D8\u90FD\u8981\u5BF9\u5E94\u5DF2\u8BC6\u522B\u7684\u95EE\u9898\uFF1B\u5220\u9664\u6CA1\u6709\u72EC\u7ACB\u529F\u80FD\u7684\u590D\u6742\u5EA6\u3002

\u8F93\u51FA\uFF1A
- \u4FDD\u7559\u5185\u5BB9\u3001\u5220\u9664\u5185\u5BB9\u548C\u6539\u53D8\u5185\u5BB9\u53CA\u5176\u7406\u7531\uFF1B
- \u4E00\u4EFD\u5B8C\u6574\u3001\u81EA\u6D3D\u3001\u53EF\u76F4\u63A5\u8BA8\u8BBA\u7684\u4F18\u5316\u7248 Idea \u5408\u540C\uFF1B
- \u6700\u5C0F\u51B3\u5B9A\u6027\u5B9E\u9A8C\u3001\u7B2C\u4E00\u5468\u8BA1\u5212\u3001\u91CF\u5316\u6216\u53EF\u89C2\u5BDF\u7684\u6210\u529F/\u505C\u6B62\u6761\u4EF6\uFF1B
- \u82E5\u5B58\u5728\u4E24\u6761\u90FD\u5408\u7406\u4F46\u4E92\u65A5\u7684\u8DEF\u7EBF\uFF0C\u53EA\u4FDD\u7559\u63A8\u8350\u8DEF\u7EBF\uFF0C\u628A\u53E6\u4E00\u6761\u5217\u4E3A\u5907\u9009\uFF0C\u4E0D\u5F97\u62FC\u6210\u81C3\u80BF\u65B9\u6848\u3002

## \u6700\u7EC8\u51B3\u7B56
\u53EA\u7ED9\u4E00\u4E2A\u4E3B\u51B3\u7B56\uFF1APursue\u3001Refine\u3001Pivot\u3001Park \u6216 Stop\u3002\u8BF4\u660E\u6700\u5173\u952E\u4F9D\u636E\u3001\u5269\u4F59\u6700\u5927\u4E0D\u786E\u5B9A\u6027\u548C\u4E0B\u4E00\u9879\u884C\u52A8\u3002Park \u5FC5\u987B\u5199\u660E\u91CD\u65B0\u8003\u8651\u7684\u89E6\u53D1\u6761\u4EF6\uFF1BPivot \u6216 Stop \u5FC5\u987B\u8BF4\u660E\u539F Idea \u4E3A\u4EC0\u4E48\u4E0D\u503C\u5F97\u7EE7\u7EED\u6295\u5165\u3002

## \u8F93\u51FA\u6587\u4EF6
\u521B\u5EFA\u4E24\u4EFD\u8BED\u4E49\u4E00\u81F4\u3001\u53EF\u76F4\u63A5\u4E0B\u8F7D\u7684 Markdown \u6587\u4EF6\uFF1A
1. \`<topic_slug>_idea_evaluation_zh.md\`
2. \`<topic_slug>_idea_evaluation_en.md\`

\u4E24\u4EFD\u6587\u4EF6\u5747\u5305\u542B\uFF1A\u914D\u7F6E\u5FEB\u7167\u3001Idea \u5408\u540C\u3001\u68C0\u7D22\u534F\u8BAE\u4E0E\u8986\u76D6\u8303\u56F4\u3001\u6700\u8FD1\u90BB\u6BD4\u8F83\u3001\u591A\u7EF4\u8BC4\u4F30\u3001\u81F4\u547D\u4E0E\u53EF\u4FEE\u590D\u95EE\u9898\u3001\u4F18\u5316\u53D8\u66F4\u3001\u5B8C\u6574\u4F18\u5316\u7248 Idea\u3001\u6700\u5C0F\u9A8C\u8BC1\u8BA1\u5212\u3001\u6700\u7EC8\u51B3\u7B56\u548C\u5E26\u7A33\u5B9A\u94FE\u63A5\u7684\u53C2\u8003\u6587\u732E\u3002\u82F1\u6587\u7248\u4F7F\u7528\u81EA\u7136\u5B66\u672F\u82F1\u8BED\uFF0C\u4E0D\u505A\u673A\u68B0\u9010\u53E5\u7FFB\u8BD1\u3002

\u4E0D\u5F97\u751F\u6210 \`.tex\`\u3001PDF\u3001DOCX\u3001BibTeX \u6216\u865A\u6784\u9644\u4EF6\u3002\u9664\u975E\u5F85\u8BC4\u4F30 Idea \u5B8C\u5168\u7F3A\u5931\uFF0C\u5426\u5219\u4E0D\u8981\u4EE5\u8FFD\u95EE\u4EE3\u66FF\u5206\u6790\uFF1B\u4FE1\u606F\u4E0D\u8DB3\u5904\u5E94\u660E\u786E\u5047\u8BBE\u3001\u964D\u4F4E\u7F6E\u4FE1\u5EA6\u5E76\u7ED9\u51FA\u6838\u9A8C\u65B9\u6CD5\u3002`;
  }
  return `# Evaluate and Refine a Computer Science Research Idea

You are a strict but constructive CS domain expert, reviewer, and experimental lead. First recover the user's idea as a testable research contract, then stress-test it against authentic literature, code, data, and resource constraints. Do not mistake fluent wording for a strong idea, and do not replace evidence with generic criticism.

## Configuration
- Research direction: ${direction}
- Idea to evaluate: ${idea}
- Dataset or data condition: ${dataset}
- Literature window: focus on the most recent ${preferences.recentYears} years as of the execution date
- Venue scope: ${venues}
- SOTA objective: ${preferences.pursueSota ? "required; the optimized idea must specify a verifiable dataset, metric, and strong baselines without depending on an unexplained marginal gain" : "not required; judge value by scientific contribution rather than leaderboard rank"}
- Resources and execution limits: ${resources}
- Optimization freedom: ${freedom}
- Additional evaluation criteria: ${criteria}

## Evidence rules
1. Establish the execution date and search around the idea's problem, claims, mechanism, data, metrics, baselines, and failure conditions. Focus on the most recent ${preferences.recentYears} years and list indispensable foundational work separately.
2. Prefer official proceedings, OpenReview, publisher pages, original arXiv records, project pages, dataset pages, and official repositories. Verify title, authors, year, venue, version, and stable link.
3. Retrieve the nearest direct competitors, not merely papers sharing the topic. Compare problem definition, assumptions, mechanism, data, evaluation protocol, evidence, and contribution boundary.
4. Never equate an unsuccessful search with absolute novelty. Never invent conclusions, results, SOTA values, dataset sizes, licenses, or code status. Separate source facts, author claims, and your inferences.
5. For a named dataset, verify provenance, access or license, split, metrics, leakage risk, saturation, and current strong baselines. Evaluate private data only from user-supplied facts.

## Stage 1 \u2014 Extract the idea contract
Restate the idea in its strongest specific form without inventing facts:
- The concrete problem that still exists today;
- One-sentence nugget;
- Falsifiable main hypothesis and expected claims;
- Mechanism or research design;
- Data, metrics, baselines, and minimum decisive experiment;
- Dependencies, contribution type, and explicit non-claims.

Mark missing, ambiguous, or contradictory fields. Do not optimize yet; first make the evaluation target accurate.

## Stage 2 \u2014 Multi-evidence stress test
Inspect the idea through the lenses of a domain expert, skeptical reviewer, and experimental lead, then synthesize one judgment:
1. Clarity: are the problem, hypothesis, mechanism, and success condition operational?
2. Novelty: does the substantive difference from nearest work survive, or is this a model swap, dataset swap, or renaming?
3. Significance: can the work produce interpretable, cumulative knowledge even if the expected result is weak?
4. Validity: do mechanism and hypothesis align, do metrics measure the intended construct, and do causal or generalization claims stay bounded?
5. Feasibility: do data, compute, time, engineering, annotation, ethics, and licensing fit?
6. Competition and timing: how crowded is the space, how likely is scooping, and what comparative advantage exists?
7. Evidence and reproducibility readiness: are strong baselines, implementations, protocols, and a minimum experiment available?
8. SOTA dependence: ${preferences.pursueSota ? "is the target precise, would reaching it constitute a contribution, and would the idea retain value if it misses?" : "does the idea secretly depend on hoped-for performance, and is its non-SOTA value explicit enough?"}

For every dimension, provide a 1\u20135 rating, evidence, confidence, and severity (fatal / major but repairable / minor). Never let an average cancel a fatal flaw. Add a nearest-work comparison table, the strongest objection, and the evidence that could defeat that objection.

## Stage 3 \u2014 Cohesive optimization
Do not optimize by patching. Never keep a broken idea and compensate by appending qualifiers, extra modules, more datasets, or a list of disclaimers. Identify the smallest complete research proposition, then recompose the problem, hypothesis, mechanism, evaluation, and contribution so the optimized idea reads as one coherent research design.

Optimization boundary: ${freedom}. Never invent data, results, resources, or literature. Every change must resolve an identified weakness; remove complexity with no independent function.

Return:
- What is retained, removed, and changed, with reasons;
- One complete, self-consistent optimized idea contract ready for discussion;
- The minimum decisive experiment, first-week plan, and measurable or observable success and stop conditions;
- If two routes are valid but mutually exclusive, recommend one and list the other as an alternative rather than merging them into a bloated design.

## Final decision
Give exactly one primary decision: Pursue, Refine, Pivot, Park, or Stop. State the decisive reason, largest remaining uncertainty, and next action. Park requires explicit revisit triggers; Pivot or Stop requires a clear account of why the original idea is no longer worth the investment.

## Output files
Create two semantically aligned, directly downloadable Markdown files:
1. \`<topic_slug>_idea_evaluation_zh.md\`
2. \`<topic_slug>_idea_evaluation_en.md\`

Both files must contain the configuration snapshot, extracted idea contract, search protocol and coverage, nearest-work comparison, multidimensional evaluation, fatal and repairable weaknesses, optimization changes, complete optimized idea, minimum validation plan, final decision, and references with stable links. Write the Chinese version naturally and the English version in natural academic English rather than translating sentence by sentence.

Do not create TeX, PDF, DOCX, BibTeX, or invented attachments. Unless the idea itself is entirely missing, do not replace analysis with follow-up questions; state assumptions, lower confidence, and provide verification steps where information is incomplete.`;
}
function buildIdeaPrompt(mode, preferences, language) {
  return mode === "discovery" ? discoveryPrompt(preferences, language) : evaluationPrompt(preferences, language);
}

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

// app/draft/config.ts
var ARXIV_STYLE_REPOSITORY = "https://github.com/kourgeorge/arxiv-style";
var DRAFT_TEMPLATES = {
  arxiv: {
    label: "arXiv",
    group: "preprint"
  },
  neurips: {
    label: "NeurIPS",
    group: "conference",
    searchHint: "NeurIPS official author instructions and style files"
  },
  icml: {
    label: "ICML",
    group: "conference",
    searchHint: "ICML official author instructions and LaTeX template"
  },
  iclr: {
    label: "ICLR",
    group: "conference",
    searchHint: "ICLR official author guide and LaTeX style"
  },
  cvpr: {
    label: "CVPR",
    group: "conference",
    searchHint: "CVPR official author guidelines and author kit"
  },
  iccv: {
    label: "ICCV",
    group: "conference",
    searchHint: "ICCV official author guidelines and author kit"
  },
  eccv: {
    label: "ECCV",
    group: "conference",
    searchHint: "ECCV official author guidelines and template"
  },
  acl: {
    label: "ACL",
    group: "conference",
    searchHint: "ACL official style files and author guidelines"
  },
  emnlp: {
    label: "EMNLP",
    group: "conference",
    searchHint: "EMNLP official style files and author guidelines"
  },
  aaai: {
    label: "AAAI",
    group: "conference",
    searchHint: "AAAI official author kit and LaTeX template"
  },
  kdd: {
    label: "KDD",
    group: "conference",
    searchHint: "ACM KDD official call for papers and ACM template"
  },
  "acm-mm": {
    label: "ACM Multimedia",
    group: "conference",
    searchHint: "ACM Multimedia official call for papers and ACM template"
  },
  custom: {
    label: "\u81EA\u5B9A\u4E49\u9876\u4F1A / Custom venue",
    group: "custom"
  }
};
var DRAFT_TEMPLATE_IDS = Object.keys(
  DRAFT_TEMPLATES
);
var DEFAULT_DRAFT_TEMPLATE_ID = "arxiv";
function selectedVenue(templateId, customVenue) {
  if (templateId !== "custom") return DRAFT_TEMPLATES[templateId].label;
  return customVenue.trim() || "the custom top-tier CS conference named by the user";
}
function buildDraftPromptContent(templateId, customVenue, language, captionWordRange) {
  const venue = selectedVenue(templateId, customVenue);
  const template = DRAFT_TEMPLATES[templateId];
  const isArxiv = templateId === "arxiv";
  const searchHint = template.group === "conference" ? template.searchHint : void 0;
  const captionGuidance = buildCaptionLengthGuidance(
    captionWordRange,
    language
  );
  if (language === "zh") {
    const templateDirective2 = isArxiv ? `\u76EE\u6807\u4E3A arXiv \u9884\u5370\u672C\u3002\u4F7F\u7528 ${ARXIV_STYLE_REPOSITORY} \u5F53\u524D\u4ED3\u5E93\u4E2D\u7684 \`template.tex\` \u4E0E \`arxiv.sty\` \u4F5C\u4E3A\u9ED8\u8BA4\u6392\u7248\u57FA\u7840\uFF1B\u8BB0\u5F55\u4ED3\u5E93 URL \u4E0E\u53D6\u5F97\u65E5\u671F\uFF0C\u4E0D\u628A\u8BE5\u7B2C\u4E09\u65B9 MIT \u5F00\u6E90\u6837\u5F0F\u63CF\u8FF0\u6210 arXiv \u5B98\u65B9\u8981\u6C42\uFF0C\u4E5F\u4E0D\u8981\u4FEE\u6539\u6837\u5F0F\u6587\u4EF6\u6765\u6324\u538B\u7BC7\u5E45\u3002` : `\u76EE\u6807\u4E3A ${venue}\u3002\u5F00\u59CB\u5199\u4F5C\u524D\u5FC5\u987B\u8054\u7F51\u641C\u7D22 ${searchHint ?? `${venue} \u5B98\u65B9\u4F5C\u8005\u6307\u5357\u4E0E LaTeX \u6A21\u677F`}\uFF0C\u53EA\u4ECE\u4F1A\u8BAE\u5B98\u7F51\u3001\u5B98\u65B9 author kit \u6216\u4F1A\u8BAE\u7EC4\u7EC7\u65B9\u7EF4\u62A4\u7684\u4ED3\u5E93\u53D6\u5F97\u5F53\u524D\u5C4A\u6216\u6700\u8FD1\u4E00\u4E2A\u660E\u786E\u5F00\u653E\u5C4A\u6B21\u7684\u6700\u65B0\u5B98\u65B9 TeX \u6A21\u677F\u3002\u8BB0\u5F55 venue\u3001\u5C4A\u6B21/\u5E74\u4EFD\u3001\u6A21\u677F\u7248\u672C\u3001\u6838\u9A8C\u65E5\u671F\u548C\u5B98\u65B9 URL\uFF1B\u4E0D\u5F97\u6CBF\u7528\u65E7\u5C4A\u6A21\u677F\u6216\u975E\u5B98\u65B9\u955C\u50CF\u3002\u82E5\u5F53\u524D\u5B98\u65B9\u6A21\u677F\u786E\u5B9E\u65E0\u6CD5\u53D6\u5F97\uFF0C\u900F\u660E\u8BF4\u660E\u540E\u4E34\u65F6\u4F7F\u7528 ${ARXIV_STYLE_REPOSITORY} \u4F5C\u4E3A\u201C\u9884\u5370\u672C\u56DE\u9000\u201D\uFF0C\u5E76\u660E\u786E\u4EA7\u7269\u5C1A\u4E0D\u7B26\u5408 ${venue} \u6295\u7A3F\u683C\u5F0F\u3002`;
    return `# \u57FA\u4E8E\u5B9E\u9A8C\u6750\u6599\u751F\u6210\u5B8C\u6574 CS \u8BBA\u6587\u521D\u7A3F

## \u4F60\u7684\u89D2\u8272
\u4F60\u662F\u4E25\u8C28\u7684 CS \u8BBA\u6587\u4F5C\u8005\u3001\u8BC1\u636E\u5BA1\u8BA1\u5458\u548C LaTeX \u5DE5\u7A0B\u5E08\u3002\u82E5\u5F53\u524D\u73AF\u5883\u53EF\u7528\uFF0C\u9F13\u52B1\u4F7F\u7528 \`$research-paper-writing\` \u8F85\u52A9\u7EC4\u7EC7\u8BBA\u8BC1\u3001\u5B66\u672F\u884C\u6587\u548C\u8D28\u91CF\u81EA\u68C0\uFF1B\u672C Prompt \u7684\u8BC1\u636E\u8FB9\u754C\u3001\u76EE\u6807\u6A21\u677F\u3001\u7528\u6237\u914D\u7F6E\u4E0E\u4EA4\u4ED8\u534F\u8BAE\u59CB\u7EC8\u4F18\u5148\u3002\u82E5\u8BE5 Skill \u4E0D\u53EF\u7528\uFF0C\u76F4\u63A5\u6309\u672C Prompt \u5B8C\u6210\u3002\u4F60\u7684\u4EFB\u52A1\u662F\u628A\u5DF2\u5B8C\u6210\u5B9E\u9A8C\u53CA\u5176\u771F\u5B9E\u6750\u6599\u8F6C\u5316\u4E3A\u4E00\u4EFD\u5B8C\u6574\u82F1\u6587\u521D\u7A3F\uFF0C\u800C\u4E0D\u662F\u8865\u9020\u4E00\u7BC7\u201C\u770B\u8D77\u6765\u5B8C\u6574\u201D\u7684\u8BBA\u6587\u3002

## \u672C\u8F6E\u8F93\u5165
\u8BF7\u5B8C\u6574\u8BFB\u53D6\u6211\u5728\u540C\u4E00\u5BF9\u8BDD\u4E2D\u4E0A\u4F20\u7684\u5168\u90E8\u6750\u6599\uFF0C\u5305\u62EC\u4F46\u4E0D\u9650\u4E8E\uFF1A
- \u5B9E\u9A8C\u7ED3\u679C\u3001\u8868\u683C\u3001\u7EDF\u8BA1\u8F93\u51FA\u3001\u65E5\u5FD7\u4E0E\u539F\u59CB\u5206\u6790\uFF1B
- \u65B9\u6CD5\u8BBE\u8BA1\u3001\u516C\u5F0F\u3001\u7B97\u6CD5\u3001\u5B9E\u73B0\u8BF4\u660E\u3001\u4EE3\u7801\u6216 README\uFF1B
- \u6570\u636E\u96C6\u3001baseline\u3001\u670D\u52A1\u5668\u3001\u8D85\u53C2\u6570\u4E0E\u8BC4\u4F30\u534F\u8BAE\uFF1B
- \u5DF2\u6709\u56FE\u7247\u3001caption\u3001\u8865\u5145\u6750\u6599\u3001\u7814\u7A76\u7B14\u8BB0\u6216\u5C40\u90E8\u8349\u7A3F\uFF1B
- \u771F\u5B9E\u4E14\u53EF\u6838\u9A8C\u7684 BibTeX \u6216\u53C2\u8003\u6587\u732E\u6E05\u5355\u3002

\u6750\u6599\u4E4B\u95F4\u51B2\u7A81\u65F6\uFF0C\u4EE5\u53EF\u8FFD\u6EAF\u7684\u539F\u59CB\u5B9E\u9A8C\u8BC1\u636E\u548C\u4EE3\u7801\u5B9A\u4E49\u4E3A\u51C6\uFF0C\u5E76\u5728\u4EA4\u4ED8\u8BF4\u660E\u4E2D\u8BB0\u5F55\u51B2\u7A81\u3002\u4E0D\u5F97\u9759\u9ED8\u9009\u62E9\u5BF9\u53D9\u4E8B\u66F4\u6709\u5229\u7684\u7248\u672C\u3002

## \u76EE\u6807\u6A21\u677F
${templateDirective2}

\u6A21\u677F\u89C4\u5219\u53EF\u80FD\u53D8\u5316\u3002\u4E0D\u5F97\u786C\u7F16\u7801\u5F80\u5E74\u9875\u6570\u3001\u533F\u540D\u89C4\u5219\u6216\u63D0\u4EA4\u8981\u6C42\uFF1B\u5FC5\u987B\u4EE5\u672C\u6B21\u6838\u9A8C\u5230\u7684\u5B98\u65B9\u6700\u65B0\u9875\u9762\u4E3A\u51C6\u3002\u6A21\u677F\u7C7B\u6587\u4EF6\u3001\u7248\u6743\u5757\u3001\u9875\u8FB9\u8DDD\u3001\u5B57\u53F7\u548C\u533F\u540D\u8BBE\u7F6E\u4E0D\u5F97\u4E3A\u5BB9\u7EB3\u5185\u5BB9\u800C\u79C1\u81EA\u4FEE\u6539\u3002

## Caption \u5199\u4F5C
${captionGuidance}

## \u5199\u4F5C\u4EFB\u52A1
1. \u5728\u5185\u90E8\u5EFA\u7ACB Evidence Ledger\uFF0C\u5C06\u6BCF\u9879\u6838\u5FC3 claim \u5BF9\u9F50\u5230\u65B9\u6CD5\u5B9A\u4E49\u3001\u8868\u683C\u3001\u56FE\u7247\u3001\u7EDF\u8BA1\u7ED3\u679C\u6216\u771F\u5B9E\u5F15\u7528\u3002\u4E0D\u8981\u628A\u8FD9\u4EFD\u5185\u90E8\u6E05\u5355\u5F53\u4F5C\u6B63\u6587\u8F93\u51FA\u3002
2. \u4ECE\u8BC1\u636E\u4E2D\u786E\u5B9A\u4E00\u4E2A\u6E05\u695A\u3001\u53EF\u8FA9\u62A4\u7684\u79D1\u5B66\u5B9A\u4F4D\uFF0C\u5E76\u7ED9\u51FA\u786E\u5B9A\u7684\u82F1\u6587\u6807\u9898\u548C 4\u20137 \u4E2A\u5B57\u6BCD\u7684\u8BBA\u6587\u54C1\u724C\u7F29\u5199\u3002\u6807\u9898\u3001\u6458\u8981\u3001\u5F15\u8A00\u3001\u65B9\u6CD5\u3001\u5B9E\u9A8C\u3001\u8BA8\u8BBA\u548C\u7ED3\u8BBA\u5FC5\u987B\u56F4\u7ED5\u540C\u4E00\u4E3B\u7EBF\u3002
3. \u76F4\u63A5\u64B0\u5199\u5B8C\u6574\u82F1\u6587\u8BBA\u6587\u521D\u7A3F\u3002\u7AE0\u8282\u6309\u76EE\u6807\u6A21\u677F\u548C\u8BBA\u6587\u5B9E\u9645\u5185\u5BB9\u7EC4\u7EC7\uFF1B\u65B9\u6CD5\u7AE0\u8282\u8981\u89E3\u91CA\u8BBE\u8BA1\u4E3A\u4F55\u6210\u7ACB\u5E76\u5F62\u6210\u8FDE\u8D2F\u53D9\u4E8B\uFF0C\u4E0D\u8981\u5199\u6210\u7EC4\u4EF6\u8BF4\u660E\u4E66\u3002Experiments and Results \u7684\u7B2C\u4E00\u4E2A\u5C0F\u8282\u4E3A Datasets and Experimental Setup\uFF0C\u5E76\u6309\u76EE\u6807\u6A21\u677F\u5141\u8BB8\u7684\u4E0B\u4E00\u5C42\u6807\u9898\u4F9D\u6B21\u7EC4\u7EC7 Datasets\u3001Evaluation Metrics\u3001Experimental Configuration \u548C Baselines\uFF1BEvaluation Metrics \u72EC\u7ACB\u8BF4\u660E\u6307\u6807\u5B9A\u4E49\u3001\u65B9\u5411\u3001\u5355\u4F4D\u6216\u5C3A\u5EA6\u3001\u805A\u5408\u65B9\u5F0F\u53CA\u5176\u4E0E\u4EFB\u52A1\u76EE\u6807\u7684\u5BF9\u5E94\u5173\u7CFB\u3002\u5B9E\u9A8C\u5FC5\u987B\u5B8C\u6574\u5448\u73B0\u5DF2\u6709\u8BBE\u7F6E\u4E0E\u8BC1\u636E\uFF0C\u4E0D\u5F97\u5220\u51CF\u4E0D\u5229\u7ED3\u679C\uFF0C\u4E5F\u4E0D\u5F97\u628A Discussion \u5199\u6210 Results \u7684\u590D\u8FF0\u3002
4. Abstract \u53EA\u9648\u8FF0\u6B63\u6587\u80FD\u652F\u6301\u7684\u5185\u5BB9\uFF1BIntroduction \u8BF4\u660E\u4ECA\u5929\u4ECD\u5B58\u5728\u7684\u5177\u4F53\u95EE\u9898\u3001\u6838\u5FC3\u6D1E\u5BDF\u548C\u53EF\u9A8C\u8BC1\u8D21\u732E\uFF1BRelated Work \u7528\u771F\u5B9E\u5F15\u7528\u5EFA\u7ACB\u5DEE\u5F02\u5316\u5B9A\u4F4D\uFF1BDiscussion \u5206\u6790\u673A\u5236\u3001\u8FB9\u754C\u548C\u5C40\u9650\u3002
5. \u53EA\u4F7F\u7528\u4E0A\u4F20\u6216\u7ECF\u8FC7\u53EF\u9760\u6765\u6E90\u9010\u9879\u6838\u9A8C\u7684\u6587\u732E\u3002\u4E0D\u5F97\u865A\u6784\u4F5C\u8005\u3001\u6807\u9898\u3001venue\u3001\u5E74\u4EFD\u3001DOI\u3001BibTeX key \u6216\u5F15\u7528\u5173\u7CFB\uFF1B\u7F3A\u5931\u4F46\u5FC5\u8981\u7684\u5F15\u7528\u7528\u6E05\u695A\u7684 \`TODO[citation: ...]\` \u6807\u8BB0\u3002
6. \u4E0D\u5F97\u53D1\u660E\u5B9E\u9A8C\u6570\u5B57\u3001\u6570\u636E\u96C6\u3001baseline\u3001\u6D88\u878D\u3001\u663E\u8457\u6027\u3001\u590D\u6742\u5EA6\u3001\u786C\u4EF6\u3001\u8D85\u53C2\u6570\u3001\u7528\u6237\u7814\u7A76\u6216\u7ED3\u8BBA\u3002\u8BC1\u636E\u7F3A\u53E3\u4F7F\u7528\u7CBE\u786E TODO\uFF0C\u8BF4\u660E\u7F3A\u4EC0\u4E48\u4EE5\u53CA\u5B83\u5F71\u54CD\u54EA\u9879 claim\uFF0C\u4E0D\u5F97\u7528\u542B\u7CCA\u5360\u4F4D\u53E5\u63A9\u76D6\u3002
7. \u56FE\u8868\u4E0E\u6B63\u6587\u4EA4\u53C9\u5F15\u7528\u3001\u672F\u8BED\u3001\u7F29\u5199\u3001\u53D8\u91CF\u3001\u6570\u5B57\u3001\u5355\u4F4D\u548C\u5927\u5C0F\u5199\u5FC5\u987B\u4E00\u81F4\u3002\u6240\u6709\u8868\u683C\u6570\u5B57\u5E94\u80FD\u56DE\u6EAF\u5230\u8F93\u5165\u8BC1\u636E\u3002

## \u4EA4\u4ED8\u4E0E\u7F16\u8BD1
\u751F\u6210\u4E00\u4E2A\u53EF\u4E0B\u8F7D\u7684\u5B8C\u6574 LaTeX \u5DE5\u7A0B\uFF0C\u81F3\u5C11\u5305\u542B\uFF1A
- \`main.tex\`\uFF08\u7BC7\u5E45\u8F83\u957F\u65F6\u53EF\u62C6\u5206\u6E05\u695A\u547D\u540D\u7684 section \u6587\u4EF6\uFF09\uFF1B
- \`references.bib\`\uFF1B
- \u76EE\u6807\u6A21\u677F\u6240\u9700\u4E14\u6765\u6E90\u660E\u786E\u7684\u7C7B\u6587\u4EF6/\u6837\u5F0F\u6587\u4EF6\uFF1B
- \`figures/\` \u4E2D\u7684\u5DF2\u6709\u56FE\u6216\u5F85\u8865\u56FE\u6E05\u5355\uFF0C\u4E0D\u5F97\u4F2A\u9020\u56FE\u7247\uFF1B
- \`TEMPLATE_SOURCE.md\`\uFF0C\u8BB0\u5F55\u6A21\u677F\u540D\u79F0\u3001\u5C4A\u6B21/\u5E74\u4EFD\u3001\u6765\u6E90 URL\u3001\u53D6\u5F97\u65E5\u671F\u3001\u662F\u5426\u4E3A\u5B98\u65B9\u6A21\u677F\u53CA\u4EFB\u4F55\u56DE\u9000\uFF1B
- \u6210\u529F\u7F16\u8BD1\u7684 PDF \u548C\u5305\u542B\u5168\u90E8\u6E90\u6587\u4EF6\u7684\u538B\u7F29\u5305\u3002

\u5B9E\u9645\u8FD0\u884C LaTeX \u7F16\u8BD1\uFF0C\u4FEE\u590D\u7F3A\u5305\u3001\u5F15\u7528\u3001\u4EA4\u53C9\u5F15\u7528\u3001\u6D6E\u52A8\u4F53\u3001BibTeX/Biber \u548C\u7F16\u7801\u9519\u8BEF\uFF1B\u4E0D\u5F97\u901A\u8FC7\u5220\u9664\u79D1\u5B66\u5185\u5BB9\u201C\u4FEE\u590D\u201D\u6784\u5EFA\u3002\u6700\u7EC8\u76F4\u63A5\u7ED9\u51FA\u53EF\u4E0B\u8F7D\u6587\u4EF6\uFF0C\u5E76\u7528\u7B80\u77ED\u4E2D\u6587\u8BF4\u660E\uFF1A\u5B8C\u6210\u5185\u5BB9\u3001\u4ECD\u5B58\u5728\u7684 TODO\u3001\u8BC1\u636E\u51B2\u7A81\u3001\u6A21\u677F\u6765\u6E90\u548C\u7F16\u8BD1\u72B6\u6001\u3002

## \u8F93\u51FA\u524D\u81EA\u68C0
- \u6BCF\u4E2A\u6838\u5FC3 claim \u5747\u6709\u8F93\u5165\u8BC1\u636E\u6216\u660E\u786E TODO\uFF0C\u6CA1\u6709\u8865\u9020\u7ED3\u679C\u4E0E\u5F15\u7528\u3002
- \u6807\u9898\u3001\u6458\u8981\u3001\u8D21\u732E\u3001\u65B9\u6CD5\u3001\u5B9E\u9A8C\u548C\u7ED3\u8BBA\u53D9\u4E8B\u4E00\u81F4\u3002
- \u5B9E\u9A8C\u8BBE\u7F6E\u3001\u5BF9\u6BD4\u3001\u6570\u5B57\u3001\u56FE\u8868\u548C\u9650\u5236\u5FE0\u5B9E\u4E8E\u539F\u59CB\u6750\u6599\u3002
- \u4F7F\u7528\u7684\u662F\u672C\u6B21\u6838\u9A8C\u7684\u76EE\u6807\u6A21\u677F\uFF0C\u672A\u79C1\u6539\u6837\u5F0F\u89C4\u5219\u3002
- \u5DE5\u7A0B\u53EF\u4ECE\u5E72\u51C0\u73AF\u5883\u7F16\u8BD1\uFF0CPDF\u3001\u5F15\u7528\u548C\u4EA4\u53C9\u5F15\u7528\u65E0\u9519\u8BEF\u3002

\u73B0\u5728\u5B8C\u6574\u8BFB\u53D6\u6750\u6599\u5E76\u76F4\u63A5\u751F\u6210\u6700\u7EC8\u521D\u7A3F\u5DE5\u7A0B\uFF1B\u4E0D\u8981\u5148\u7ED9\u63D0\u7EB2\u3001\u5199\u4F5C\u8BA1\u5212\u6216\u7B49\u5F85\u6211\u9010\u8282\u786E\u8BA4\u3002`;
  }
  const templateDirective = isArxiv ? `The target is an arXiv preprint. Use the current \`template.tex\` and \`arxiv.sty\` from ${ARXIV_STYLE_REPOSITORY} as the default typesetting base. Record the repository URL and retrieval date, do not describe this third-party MIT-licensed style as an official arXiv requirement, and do not alter the style file to squeeze content.` : `The target is ${venue}. Before writing, browse for ${searchHint ?? `${venue} official author instructions and LaTeX template`}. Obtain the latest official TeX template for the current or nearest explicitly open edition only from the conference website, official author kit, or organizer-maintained repository. Record the venue, edition/year, template version, verification date, and official URL. Never reuse an older edition or unofficial mirror when a current official source exists. If the official template genuinely cannot be obtained, disclose that limitation and temporarily use ${ARXIV_STYLE_REPOSITORY} as a \u201Cpreprint fallback,\u201D explicitly stating that the output is not yet ${venue}-compliant.`;
  return `# Generate a Complete CS Paper Draft from Experimental Evidence

## Your role
Act as a rigorous CS paper author, evidence auditor, and LaTeX engineer. When available, use \`$research-paper-writing\` to support argument organization, academic prose, and quality review; the evidence boundaries, target template, user configuration, and delivery protocol in this prompt always take precedence. If that skill is unavailable, continue directly from this prompt. Convert completed experiments and authentic research materials into a complete English draft\u2014never manufacture a paper that merely looks complete.

## Inputs
Read every file uploaded in this conversation, including as applicable:
- experimental results, tables, statistical outputs, logs, and raw analyses;
- method designs, equations, algorithms, implementation notes, code, or README files;
- datasets, baselines, servers, hyperparameters, and evaluation protocols;
- existing figures, captions, supplementary materials, notes, or partial drafts;
- authentic, verifiable BibTeX or a reference list.

When sources conflict, prefer traceable raw experimental evidence and code-defined behavior, and record the conflict in the handoff. Never silently choose the version that creates a stronger story.

## Target template
${templateDirective}

Template rules change over time. Do not hardcode a previous year's page limit, anonymity policy, or submission rule. Follow the latest official page verified in this run. Never alter class/style files, copyright blocks, margins, type sizes, or anonymity settings to force content to fit.

## Caption Writing
${captionGuidance}

## Drafting tasks
1. Internally build an Evidence Ledger that maps every core claim to a method definition, table, figure, statistic, or authentic citation. Do not emit this internal ledger as manuscript prose.
2. Derive one clear and defensible scientific position from the evidence, then commit to an English paper title and a 4\u20137-letter paper brand acronym. Keep the title, abstract, introduction, method, experiments, discussion, and conclusion on one throughline.
3. Write the complete English manuscript directly. Organize sections according to the target template and the paper's actual needs. Explain why the method's design works through an integrated narrative rather than a component manual. Make Datasets and Experimental Setup the first Experiments and Results subsection, then use the next heading level permitted by the target template for Datasets, Evaluation Metrics, Experimental Configuration, and Baselines in that order. Evaluation Metrics independently defines every metric, its direction, unit or scale, aggregation, and relation to the task objective. Preserve all existing experimental evidence, including unfavorable results, and do not make Discussion a repetition of Results.
4. Keep the Abstract evidence-bounded; make the Introduction state the specific problem that still exists today, the core insight, and verifiable contributions; use authentic citations in Related Work to establish differentiated positioning; analyze mechanisms, boundaries, and limitations in Discussion.
5. Use only references supplied by the user or individually verified against reliable sources. Never invent authors, titles, venues, years, DOIs, BibTeX keys, or citation relationships. Mark a necessary missing source as \`TODO[citation: ...]\`.
6. Never invent experimental numbers, datasets, baselines, ablations, significance tests, complexity, hardware, hyperparameters, user studies, or conclusions. Use precise TODOs that state what evidence is missing and which claim it affects.
7. Keep terminology, acronyms, variables, numbers, units, capitalization, and all figure/table cross-references consistent. Every table value must trace back to input evidence.

## Deliverables and compilation
Create a downloadable, complete LaTeX project containing at least:
- \`main.tex\` (split into clearly named section files only when scale warrants it);
- \`references.bib\`;
- provenance-backed class/style files required by the target template;
- a \`figures/\` directory containing supplied figures or a missing-figure manifest\u2014never fabricated images;
- \`TEMPLATE_SOURCE.md\` recording template name, edition/year, source URL, retrieval date, official status, and any fallback;
- a successfully compiled PDF and an archive containing all source files.

Run the LaTeX build and fix package, bibliography, cross-reference, float, BibTeX/Biber, and encoding errors. Never \u201Cfix\u201D a build by deleting scientific content. Return the downloadable files directly, followed by a concise Chinese handoff covering completed work, remaining TODOs, evidence conflicts, template provenance, and compilation status.

## Final audit
- Every core claim has input evidence or a precise TODO; no result or citation was fabricated.
- Title, abstract, contributions, method, experiments, and conclusion tell one consistent story.
- Setup, comparisons, numbers, figures, tables, and limitations faithfully represent the source materials.
- The template was verified in this run and its style rules were not privately modified.
- The project compiles cleanly, with working bibliography and cross-references.

Read all materials now and generate the final draft project directly. Do not first provide an outline or writing plan, and do not wait for section-by-section approval.`;
}
function buildDraftPrompt(templateId, customVenue, language, captionWordRange = CAPTION_LENGTH_POLICY.defaultRange) {
  return buildDraftPromptContent(
    templateId,
    customVenue,
    language,
    normalizeCaptionWordRange(captionWordRange)
  );
}

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

\u8BF7\u5148\u601D\u8003\u4E0E\u672C\u8BBA\u6587\u4E3B\u9898\u6700\u63A5\u8FD1\u7684\u9876\u4F1A\u6216\u9876\u520A\u8BBA\u6587\u4E2D\u201C${figureTypeLabel}\u201D\u7684\u6784\u56FE\u3001\u4FE1\u606F\u5C42\u7EA7\u548C\u89C6\u89C9\u8BED\u6CD5\uFF0C\u5E76\u5438\u6536\u5176\u901A\u7528\u8868\u8FBE\u65B9\u6CD5\u3002

${hasReferenceImage ? "\u5982\u6709\u53E6\u884C\u63D0\u4F9B\u7684\u56FE\u7247\uFF0C\u9ED8\u8BA4\u4EC5\u4F5C\u4E3A\u89C6\u89C9\u6837\u5F0F\u53C2\u8003\uFF1A\u6982\u62EC\u5176\u6784\u56FE\u3001\u914D\u8272\u3001\u7EBF\u6761\u3001\u5B57\u4F53\u4E0E\u6574\u4F53\u89C6\u89C9\u8BED\u8A00\uFF0C\u5E76\u5728\u4E0E\u5F53\u524D\u89C6\u89C9\u914D\u7F6E\u517C\u5BB9\u65F6\u501F\u9274\uFF1B\u53EA\u6709\u5F53\u6211\u660E\u786E\u6807\u6CE8\u67D0\u5F20\u56FE\u7247\u4E3A\u201C\u7ED8\u56FE\u8349\u7A3F\u201D\u65F6\uFF0C\u624D\u53EF\u5C06\u5176\u5185\u90E8\u7ED3\u6784\u4F5C\u4E3A\u5185\u5BB9\u7EBF\u7D22\uFF0C\u5E76\u4ECD\u987B\u4F9D\u636E\u8BBA\u6587\u6750\u6599\u9010\u9879\u6838\u9A8C\u3002\n\n" : ""}\u5B8C\u6574\u9605\u8BFB\u6750\u6599\u540E\u518D\u8BBE\u8BA1\u3002\u4EE5 \`.tex\` \u4E3A\u65B9\u6CD5\u540D\u3001\u6A21\u5757\u540D\u3001\u7F29\u5199\u3001\u6570\u5B66\u7B26\u53F7\u548C\u7ED3\u6784\u7684\u4E3B\u8981\u4F9D\u636E\uFF0C\u4EE5 \`.pdf\` \u7406\u89E3\u4E0A\u4E0B\u6587\u548C\u73B0\u6709\u56FE\u8868\u3002\u56FE\u4E2D\u672F\u8BED\u5FC5\u987B\u4E0E\u8BBA\u6587\u9010\u5B57\u7B26\u4E00\u81F4\uFF0C\u53EA\u5448\u73B0\u8BBA\u6587\u8BC1\u636E\u652F\u6301\u7684\u5173\u7CFB\u3002

\u5148\u786E\u5B9A\u8FD9\u5F20\u56FE\u7684\u552F\u4E00\u4E3B\u65E8\u548C\u4E3B\u8981\u9605\u8BFB\u8DEF\u5F84\uFF0C\u518D\u9009\u62E9\u6700\u7B26\u5408\u8BBA\u6587\u5BF9\u8C61\u7684\u89C6\u89C9\u8868\u8FBE\uFF0C\u4F8B\u5982 token\u3001matrix\u3001graph\u3001feature map\u3001state\u3001timeline\u3001coordinate frame \u6216\u4EE3\u8868\u6027\u6837\u4F8B\u3002\u4E0D\u8981\u628A\u6574\u5F20\u56FE\u753B\u6210\u6587\u5B57\u5361\u7247\uFF1B\u6807\u7B7E\u4F7F\u7528\u7B80\u77ED\u82F1\u6587\uFF0C\u4FDD\u8BC1\u7F29\u5C0F\u5230\u8BBA\u6587\u5C3A\u5BF8\u540E\u4ECD\u6E05\u695A\uFF0C\u5E76\u8BA9\u753B\u9762\u7D27\u51D1\u800C\u4E0D\u8FC7\u5EA6\u62E5\u6324\u3002`,
  en: (figureTypeLabel, hasReferenceImage) => `You are a scientific-figure specialist for computer-science papers. I will provide the paper's \`.tex\` and, when available, its \`.pdf\`.${hasReferenceImage ? " I will also supply reference images or an explicitly labeled figure draft." : ""}

First consider the composition, information hierarchy, and visual grammar of \u201C${figureTypeLabel}\u201D figures in leading conference or journal papers closest to this paper's topic, and draw on their general presentation patterns.

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
    return `\u6267\u884C\u65B9\u5F0F\uFF1A\u76F4\u63A5\u7ED8\u56FE\u3002\u8BF7\u5145\u5206\u601D\u8003\u8BBA\u6587\u5185\u5BB9\u3001\u4FE1\u606F\u5C42\u7EA7\u3001\u6784\u56FE\u4E0E\u89C6\u89C9\u7EC6\u8282\uFF0C\u518D\u7ED8\u5236\u4E00\u5F20\u6587\u5B57\u6E05\u6670\u3001\u9002\u5408\u8BBA\u6587\u6392\u7248\u7684\u8D85\u9AD8\u6E05\u79D1\u7814\u914D\u56FE\u3002${outputFileName ? ` \u6700\u7EC8\u56FE\u7247\u4FDD\u5B58\u4E3A \`${outputFileName}\`\u3002` : ""}`;
  }
  return `Execution mode: draw directly. Think through the paper content, information hierarchy, composition, and visual details as thoroughly as needed, then render an ultra-high-resolution scientific figure with legible text for publication.${outputFileName ? ` Save it as \`${outputFileName}\`.` : ""}`;
}
function buildPromptFirstProtocol(language, outputFileName) {
  if (language === "zh") {
    return `\u6267\u884C\u65B9\u5F0F\uFF1A\u5148\u770B Prompt\uFF0C\u672C\u8F6E\u4E0D\u8981\u751F\u6210\u56FE\u7247\u3002\u53EA\u8F93\u51FA\uFF1A

FINAL IMAGE PROMPT
\u5728\u4E00\u4E2A \`text\` \u4EE3\u7801\u5757\u4E2D\u7ED9\u51FA\u5B8C\u6574\u82F1\u6587\u751F\u56FE Prompt\uFF0C\u53EA\u9700\u4F9D\u6B21\u5199\u6E05\uFF1A\u56FE\u7684\u4E3B\u65E8\u4E0E\u6784\u56FE\u3001\u79D1\u5B66\u5BF9\u8C61\u4E0E\u4FE1\u606F\u6D41\u3001\u7CBE\u786E\u6807\u7B7E\u3001\u89C6\u89C9\u8BBE\u7F6E\u3002\u4E0D\u8981\u8F93\u51FA\u63A8\u7406\u8FC7\u7A0B\u6216\u5907\u9009\u65B9\u6848\u3002

\u7136\u540E\u505C\u6B62\uFF0C\u7B49\u5F85\u6211\u8F93\u5165\u201C\u5F00\u59CB\u7ED8\u56FE\u201D\u3002\u6536\u5230\u540E\u8BF7\u5145\u5206\u601D\u8003\u8BBA\u6587\u5185\u5BB9\u3001\u4FE1\u606F\u5C42\u7EA7\u3001\u6784\u56FE\u4E0E\u89C6\u89C9\u7EC6\u8282\uFF0C\u518D\u4F9D\u636E\u8FD9\u4EFD Prompt \u7ED8\u5236\u4E00\u5F20\u6587\u5B57\u6E05\u6670\u3001\u9002\u5408\u8BBA\u6587\u6392\u7248\u7684\u8D85\u9AD8\u6E05\u79D1\u7814\u914D\u56FE\u3002${outputFileName ? ` \u6700\u7EC8\u56FE\u7247\u4FDD\u5B58\u4E3A \`${outputFileName}\`\u3002` : ""}`;
  }
  return `Execution mode: prompt first. Do not generate an image in this response. Output only:

FINAL IMAGE PROMPT
Provide one complete English image-generation prompt in a \`text\` code block. Cover only the visual thesis and composition, scientific objects and flow, exact labels, and visual settings. Do not expose reasoning or alternatives.

Then stop and wait for \u201CStart drawing\u201D or \u201C\u5F00\u59CB\u7ED8\u56FE\u201D. After that instruction, think through the paper content, information hierarchy, composition, and visual details as thoroughly as needed, then use this prompt to render an ultra-high-resolution scientific figure with legible text for publication.${outputFileName ? ` Save it as \`${outputFileName}\`.` : ""}`;
}
var OUTPUT_PROTOCOL = {
  zh: ({
    executionMode,
    outputFileName
  }) => executionMode === "direct" ? buildDirectProtocol("zh", outputFileName) : buildPromptFirstProtocol("zh", outputFileName),
  en: ({
    executionMode,
    outputFileName
  }) => executionMode === "direct" ? buildDirectProtocol("en", outputFileName) : buildPromptFirstProtocol("en", outputFileName)
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
      outputFileName: options.outputFileName
    })
  ].join("\n\n");
}

// app/figures/toolsConfig.ts
var text = (zh, en) => ({ zh, en });
function scalar(values, id) {
  return String(values[id] ?? "").trim();
}
function enabled(values, id) {
  return values[id] === true;
}
function selected(values, id) {
  return Array.isArray(values[id]) ? values[id] : [];
}
function rangeValue(values, id, fallback) {
  const value = values[id];
  return Array.isArray(value) && value.length === 2 && value.every((item) => typeof item === "number") ? [value[0], value[1]] : fallback;
}
function labelFor(value, labels, language) {
  return labels[value]?.[language] ?? value;
}
function labelsFor(values, id, labels, language) {
  return selected(values, id).map((value) => labelFor(value, labels, language)).join(language === "zh" ? "\u3001" : ", ");
}
function sharedCopy(seed) {
  return {
    zh: {
      ...seed.zh,
      reset: "\u6062\u590D\u9ED8\u8BA4\u914D\u7F6E",
      resetHint: "\u6062\u590D\u672C\u9875\u63A8\u8350\u914D\u7F6E",
      switchPromptLanguage: "\u5207\u6362 Prompt \u8BED\u8A00",
      copy: "\u590D\u5236",
      copied: "\u5DF2\u590D\u5236",
      expand: "\u5C55\u5F00",
      collapse: "\u6536\u8D77",
      clipboardError: "\u590D\u5236\u5931\u8D25\uFF0C\u8BF7\u5C55\u5F00\u540E\u624B\u52A8\u9009\u62E9\u6587\u672C\u3002",
      on: "\u5F00\u542F",
      off: "\u5173\u95ED"
    },
    en: {
      ...seed.en,
      reset: "Restore defaults",
      resetHint: "Restore the recommended configuration for this page",
      switchPromptLanguage: "Switch prompt language",
      copy: "Copy",
      copied: "Copied",
      expand: "Expand",
      collapse: "Collapse",
      clipboardError: "Copy failed. Expand the prompt and select the text manually.",
      on: "On",
      off: "Off"
    }
  };
}
var PLOT_GOALS = {
  comparison: text("\u65B9\u6CD5\u6BD4\u8F83", "Method comparison"),
  trend: text("\u8D8B\u52BF\u4E0E\u6536\u655B", "Trend or convergence"),
  distribution: text("\u5206\u5E03\u4E0E\u7A33\u5065\u6027", "Distribution or robustness"),
  relationship: text("\u53D8\u91CF\u5173\u7CFB", "Variable relationship"),
  ablation: text("\u6D88\u878D\u4E0E\u654F\u611F\u6027", "Ablation or sensitivity")
};
var DATA_STATES = {
  raw: text("\u9010\u6B21\u5B9E\u9A8C\u539F\u59CB\u6570\u636E", "Run-level raw data"),
  summary: text("\u6C47\u603B\u7EDF\u8BA1\u4E0E\u6837\u672C\u91CF", "Summary statistics and sample sizes"),
  table: text("\u8BBA\u6587\u8868\u683C\u6216\u5DF2\u6709\u56FE", "Paper table or existing plot")
};
var UNCERTAINTY_POLICIES = {
  infer: text("\u6309\u5B9E\u9A8C\u8BBE\u8BA1\u5224\u65AD", "Infer from the experimental design"),
  confidence: text("\u7F6E\u4FE1\u533A\u95F4", "Confidence intervals"),
  variation: text("\u6807\u51C6\u5DEE\u6216\u6807\u51C6\u8BEF", "Standard deviation or standard error"),
  none: text("\u4E0D\u9002\u7528", "Not applicable")
};
var STATISTICAL_LAYERS = {
  points: text("\u663E\u793A\u72EC\u7ACB\u91CD\u590D\u70B9", "Show independent replicate points"),
  interval: text("\u663E\u793A\u4E0D\u786E\u5B9A\u6027\u533A\u95F4", "Show uncertainty intervals"),
  effect: text("\u62A5\u544A\u6548\u5E94\u91CF", "Report effect size"),
  test: text("\u663E\u8457\u6027\u68C0\u9A8C", "Significance testing")
};
var MULTIPLICITY_POLICIES = {
  holm: text("Holm", "Holm"),
  bh: text("Benjamini\u2013Hochberg", "Benjamini\u2013Hochberg"),
  bonferroni: text("Bonferroni", "Bonferroni"),
  justify: text("\u7531\u5206\u6790\u8BBE\u8BA1\u5224\u65AD\u5E76\u8BF4\u660E", "Choose from the design and justify")
};
var PLOT_OUTPUTS = {
  code: text("\u53EF\u590D\u73B0\u7ED8\u56FE\u4EE3\u7801", "Reproducible plotting code"),
  pdf: text("\u77E2\u91CF PDF", "Vector PDF"),
  svg: text("SVG", "SVG"),
  png: text("\u9AD8\u6E05 PNG", "High-resolution PNG"),
  data: text("\u6D3E\u751F\u6570\u636E\u8868", "Derived data table")
};
var PLOT_PALETTES = {
  "tol-vibrant": text("Tol \u9C9C\u660E \xB7 \u84DD\u6A59", "Tol Vibrant \xB7 blue\u2013orange"),
  "tol-bright": text(
    "Tol \u660E\u4EAE \xB7 \u84DD\u7EA2\u7EFF\u9EC4",
    "Tol Bright \xB7 blue\u2013red\u2013green\u2013yellow"
  ),
  "tol-muted": text(
    "Tol \u67D4\u548C \xB7 \u975B\u73AB\u7470\u9752\u6C99",
    "Tol Muted \xB7 indigo\u2013rose\u2013teal\u2013sand"
  ),
  grayscale: text("\u7070\u5EA6\u4F18\u5148", "Grayscale-first"),
  venue: text("\u6CBF\u7528\u8BBA\u6587\u73B0\u6709\u914D\u8272", "Match the manuscript palette")
};
var PLOT_PALETTE_COLORS = {
  "tol-vibrant": FIGURE_COLOR_PALETTES["tol-vibrant"].colors,
  "tol-bright": FIGURE_COLOR_PALETTES["tol-bright"].colors,
  "tol-muted": FIGURE_COLOR_PALETTES["tol-muted"].colors,
  grayscale: ["#111111", "#666666", "#A6A6A6", "#D9D9D9"],
  venue: null
};
var PLOT_WIDTHS = {
  single: text("\u5355\u680F", "Single column"),
  double: text("\u53CC\u680F", "Double column"),
  auto: text("\u7531\u6570\u636E\u5BC6\u5EA6\u5224\u65AD", "Infer from data density")
};
var PANEL_POLICIES = {
  single: text("\u5355\u56FE", "Single panel"),
  facets: text("\u5C0F\u591A\u56FE", "Faceted panels"),
  auto: text("\u7531\u6BD4\u8F83\u4EFB\u52A1\u5224\u65AD", "Infer from the comparison task")
};
var EXPERIMENTAL_PLOTS_WORKBENCH = {
  id: "experimental-plots-workbench",
  activePage: "experimental-plots",
  copy: sharedCopy({
    zh: {
      eyebrow: "EXPERIMENTAL PLOTS",
      title: "\u5B9E\u9A8C\u7ED8\u56FE",
      subtitle: "\u4ECE\u771F\u5B9E\u5B9E\u9A8C\u6570\u636E\u751F\u6210\u53EF\u590D\u73B0\u3001\u7EDF\u8BA1\u542B\u4E49\u6E05\u695A\u4E14\u9002\u5408\u8BBA\u6587\u7248\u9762\u7684\u56FE\uFF0C\u800C\u4E0D\u662F\u8BA9\u751F\u56FE\u6A21\u578B\u753B\u4E00\u5F20\u76F8\u4F3C\u56FE\u7247\u3002",
      preset: "\u6570\u636E\u9A71\u52A8 \xB7 \u7EDF\u8BA1\u900F\u660E \xB7 \u4EE3\u7801\u53EF\u590D\u73B0",
      inputTitle: "\u51C6\u5907\u6750\u6599",
      inputItems: [
        "CSV / Excel / JSON \u6216\u7EDF\u8BA1\u7ED3\u679C",
        "\u6307\u6807\u5B9A\u4E49\u4E0E\u6BD4\u8F83\u95EE\u9898",
        "\u72EC\u7ACB\u91CD\u590D\u3001\u968F\u673A\u79CD\u5B50\u4E0E\u6837\u672C\u91CF",
        "\u76EE\u6807\u8BBA\u6587\u6A21\u677F\u6216\u73B0\u6709\u914D\u8272\uFF08\u53EF\u9009\uFF09"
      ],
      inputHint: "\u4F18\u5148\u63D0\u4F9B\u9010\u6B21\u5B9E\u9A8C\u6570\u636E\uFF1B\u53EA\u6709\u6C47\u603B\u503C\u65F6\uFF0C\u8BF7\u540C\u65F6\u63D0\u4F9B\u6837\u672C\u91CF\u4E0E\u8BEF\u5DEE\u542B\u4E49\u3002",
      promptTitle: "\u5B9E\u9A8C\u7ED8\u56FE Prompt",
      promptPurpose: "\u9009\u62E9\u6B63\u786E\u56FE\u578B\uFF0C\u4FDD\u7559\u7EDF\u8BA1\u8BED\u4E49\uFF0C\u5E76\u4EA4\u4ED8\u53EF\u590D\u73B0\u4EE3\u7801\u4E0E\u51FA\u7248\u7EA7\u6587\u4EF6\u3002"
    },
    en: {
      eyebrow: "EXPERIMENTAL PLOTS",
      title: "Experimental plots",
      subtitle: "Turn authentic experimental data into reproducible, statistically explicit, publication-ready plots\u2014not look-alike generated images.",
      preset: "Data-led \xB7 statistically transparent \xB7 reproducible",
      inputTitle: "Prepare materials",
      inputItems: [
        "CSV, Excel, JSON, or statistical outputs",
        "Metric definitions and comparison question",
        "Independent runs, random seeds, and sample sizes",
        "Target template or existing palette (optional)"
      ],
      inputHint: "Run-level data is preferred. If only summaries exist, include sample sizes and define every error quantity.",
      promptTitle: "Experimental plotting prompt",
      promptPurpose: "Choose the right plot, preserve statistical meaning, and deliver reproducible code plus publication assets."
    }
  }),
  controls: [
    {
      id: "plotGoal",
      kind: "segmented",
      label: text("\u5206\u6790\u4EFB\u52A1", "Analysis task"),
      description: text(
        "\u5148\u786E\u5B9A\u56FE\u8981\u56DE\u7B54\u7684\u79D1\u5B66\u95EE\u9898\uFF0C\u800C\u4E0D\u662F\u5148\u9009\u56FE\u5F62\u3002",
        "Start from the scientific question rather than a chart type."
      ),
      defaultValue: "comparison",
      options: Object.entries(PLOT_GOALS).map(([value, label]) => ({
        value,
        label
      })),
      span: "full"
    },
    {
      id: "dataState",
      kind: "select",
      label: text("\u53EF\u7528\u6570\u636E", "Available data"),
      description: text(
        "\u6570\u636E\u7C92\u5EA6\u51B3\u5B9A\u53EF\u4EE5\u8BA1\u7B97\u54EA\u4E9B\u7EDF\u8BA1\u91CF\u3002",
        "Data granularity determines which statistics are defensible."
      ),
      defaultValue: "raw",
      options: Object.entries(DATA_STATES).map(([value, label]) => ({
        value,
        label
      }))
    },
    {
      id: "encourageAdvancedCharts",
      kind: "toggle",
      label: text("\u9F13\u52B1\u975E\u57FA\u7840\u56FE\u578B", "Encourage richer chart types"),
      description: text(
        "\u5F53\u5206\u5E03\u3001\u5173\u7CFB\u6216\u4E0D\u786E\u5B9A\u6027\u9700\u8981\u65F6\uFF0C\u5141\u8BB8\u9009\u62E9\u6BD4\u67F1\u72B6\u56FE\u6216\u6298\u7EBF\u56FE\u66F4\u5408\u9002\u7684\u56FE\u578B\uFF1B\u4E0D\u4E3A\u65B0\u5947\u800C\u590D\u6742\u5316\u3002",
        "Allow a richer chart than bars or lines when distribution, relationships, or uncertainty require it; never add complexity for novelty."
      ),
      defaultValue: true,
      enabledLabel: text("\u6309\u6570\u636E\u9F13\u52B1", "Encourage when justified"),
      disabledLabel: text("\u4F18\u5148\u57FA\u7840\u56FE\u578B", "Prefer basic charts")
    },
    {
      id: "uncertainty",
      kind: "select",
      label: text("\u4E0D\u786E\u5B9A\u6027\u8868\u8FBE", "Uncertainty"),
      description: text(
        "\u8BEF\u5DEE\u6761\u5FC5\u987B\u5BF9\u5E94\u660E\u786E\u7684\u91CD\u590D\u5355\u4F4D\u548C\u4F30\u8BA1\u91CF\u3002",
        "Every error bar must have a defined replicate unit and estimator."
      ),
      defaultValue: "infer",
      options: Object.entries(UNCERTAINTY_POLICIES).map(([value, label]) => ({
        value,
        label
      }))
    },
    {
      id: "statistics",
      kind: "multi",
      label: text("\u7EDF\u8BA1\u4FE1\u606F\u5C42", "Statistical layers"),
      description: text(
        "\u53EA\u5C55\u793A\u6570\u636E\u771F\u6B63\u652F\u6301\u7684\u4FE1\u606F\u3002",
        "Show only layers supported by the supplied data."
      ),
      defaultValue: ["points", "interval", "effect"],
      options: Object.entries(STATISTICAL_LAYERS).map(([value, label]) => ({
        value,
        label
      })),
      span: "full"
    },
    {
      id: "multiplicity",
      kind: "select",
      label: text("\u591A\u91CD\u6BD4\u8F83\u6821\u6B63", "Multiplicity correction"),
      description: text(
        "\u5B58\u5728\u591A\u6B21\u663E\u8457\u6027\u68C0\u9A8C\u65F6\u518D\u4F7F\u7528\u3002",
        "Apply only when multiple significance tests are performed."
      ),
      defaultValue: "holm",
      options: Object.entries(MULTIPLICITY_POLICIES).map(([value, label]) => ({
        value,
        label
      })),
      visibleWhen: (values) => selected(values, "statistics").includes("test")
    },
    {
      id: "allowComposite",
      kind: "toggle",
      label: text("\u652F\u6301\u7EC4\u5408\u56FE", "Allow composite figures"),
      description: text(
        "\u53EA\u5728\u591A\u4E2A\u5B50\u56FE\u5171\u540C\u56DE\u7B54\u540C\u4E00\u79D1\u5B66\u95EE\u9898\u65F6\u7EC4\u5408\u3002",
        "Combine panels only when they jointly answer one scientific question."
      ),
      defaultValue: true,
      enabledLabel: text("\u5141\u8BB8\u7EC4\u5408", "Composite allowed"),
      disabledLabel: text("\u4EC5\u5355\u56FE", "Single panel only")
    },
    {
      id: "panelCount",
      kind: "range",
      label: text("\u5B50\u56FE\u6570\u91CF", "Subpanel count"),
      description: text(
        "\u9ED8\u8BA4 1\u20133\uFF1B\u4F7F\u7528\u6700\u5C11\u4E14\u8DB3\u4EE5\u5B8C\u6210\u6BD4\u8F83\u7684\u5B50\u56FE\u3002",
        "Default 1\u20133; use the fewest panels sufficient for the comparison."
      ),
      defaultValue: [1, 3],
      min: 1,
      max: 8,
      step: 1,
      suffix: text("\u4E2A", "panels"),
      visibleWhen: (values) => enabled(values, "allowComposite")
    },
    {
      id: "panels",
      kind: "select",
      label: text("\u9762\u677F\u7EC4\u7EC7", "Panel structure"),
      description: text(
        "\u907F\u514D\u628A\u5C3A\u5EA6\u6216\u8BED\u4E49\u4E0D\u540C\u7684\u7ED3\u679C\u5F3A\u585E\u8FDB\u540C\u4E00\u5750\u6807\u7CFB\u3002",
        "Do not force results with different scales or semantics onto one axis."
      ),
      defaultValue: "auto",
      options: Object.entries(PANEL_POLICIES).map(([value, label]) => ({
        value,
        label
      })),
      visibleWhen: (values) => enabled(values, "allowComposite")
    },
    {
      id: "width",
      kind: "segmented",
      label: text("\u7248\u9762\u5BBD\u5EA6", "Layout width"),
      description: text(
        "\u6309\u6700\u7EC8\u8BBA\u6587\u7248\u9762\u8BBE\u8BA1\u5B57\u53F7\u3001\u7EBF\u5BBD\u548C\u56FE\u4F8B\u3002",
        "Size typography, lines, and legends for the final paper layout."
      ),
      defaultValue: "auto",
      options: Object.entries(PLOT_WIDTHS).map(([value, label]) => ({
        value,
        label
      })),
      span: "full"
    },
    {
      id: "palette",
      kind: "select",
      label: text("\u989C\u8272\u7B56\u7565", "Color strategy"),
      description: text(
        "\u989C\u8272\u53EA\u7F16\u7801\u7A33\u5B9A\u8BED\u4E49\uFF0C\u5E76\u4FDD\u8BC1\u6253\u5370\u548C\u5E38\u89C1\u8272\u89C9\u5DEE\u5F02\u4E0B\u53EF\u8FA8\u3002",
        "Use color for stable semantics and preserve print and color-vision legibility."
      ),
      defaultValue: "tol-vibrant",
      options: Object.entries(PLOT_PALETTES).map(([value, label]) => ({
        value,
        label
      }))
    },
    {
      id: "outputs",
      kind: "multi",
      label: text("\u4EA4\u4ED8\u6587\u4EF6", "Deliverables"),
      description: text(
        "\u4EE3\u7801\u662F\u9ED8\u8BA4\u6838\u5FC3\u4EA7\u7269\uFF1B\u56FE\u50CF\u6587\u4EF6\u7531\u540C\u4E00\u4EE3\u7801\u751F\u6210\u3002",
        "Code is the primary artifact; every figure file must be generated from it."
      ),
      defaultValue: ["code", "pdf", "png", "data"],
      minSelected: 1,
      options: Object.entries(PLOT_OUTPUTS).map(([value, label]) => ({
        value,
        label
      })),
      span: "full"
    },
    {
      id: "captionWordRange",
      kind: "range",
      label: text("Caption \u5EFA\u8BAE\u957F\u5EA6", "Suggested caption length"),
      description: text(
        "\u9ED8\u8BA4 10\u201340 words\uFF1B\u4E3A\u4FDD\u8BC1\u81EA\u5305\u542B\u6027\uFF0C\u5FC5\u8981\u65F6\u5141\u8BB8\u8D85\u51FA\u3002",
        "Defaults to 10\u201340 words and may be exceeded when self-containment requires it."
      ),
      defaultValue: CAPTION_LENGTH_POLICY.defaultRange,
      min: CAPTION_LENGTH_POLICY.min,
      max: CAPTION_LENGTH_POLICY.max,
      step: CAPTION_LENGTH_POLICY.step,
      suffix: text("words", "words")
    },
    {
      id: "custom",
      kind: "textarea",
      label: text("\u8865\u5145\u8981\u6C42", "Additional requirements"),
      description: text(
        "\u4F8B\u5982\u6307\u5B9A\u6307\u6807\u987A\u5E8F\u3001\u54C1\u724C\u989C\u8272\u6216\u5FC5\u987B\u4FDD\u7559\u7684\u57FA\u7EBF\u3002",
        "For example, metric order, an existing palette, or baselines that must remain."
      ),
      defaultValue: "",
      placeholder: text(
        "\u53EF\u7559\u7A7A\uFF1B\u4E0D\u8981\u5728\u8FD9\u91CC\u7C98\u8D34\u6570\u636E\u3002",
        "Optional; do not paste the dataset here."
      ),
      span: "full"
    }
  ],
  updateValues(current, id, value) {
    const next = { ...current, [id]: value };
    if (id === "uncertainty" && value === "none") {
      next.statistics = selected(next, "statistics").filter(
        (item) => item !== "interval" && item !== "test"
      );
    }
    if (id === "dataState" && value === "table") {
      next.statistics = selected(next, "statistics").filter(
        (item) => item !== "points" && item !== "test"
      );
    }
    if (id === "statistics") {
      const layers = selected(next, "statistics");
      if ((layers.includes("interval") || layers.includes("test")) && scalar(next, "uncertainty") === "none") {
        next.uncertainty = "infer";
      }
    }
    if (id === "allowComposite" && value === false) {
      next.panels = "single";
    }
    if (id === "allowComposite" && value === true && scalar(current, "panels") === "single") {
      next.panels = "auto";
    }
    return next;
  },
  buildPrompt(values, language) {
    const goal = labelFor(scalar(values, "plotGoal"), PLOT_GOALS, language);
    const dataState = labelFor(
      scalar(values, "dataState"),
      DATA_STATES,
      language
    );
    const uncertainty = labelFor(
      scalar(values, "uncertainty"),
      UNCERTAINTY_POLICIES,
      language
    );
    const statistics = labelsFor(values, "statistics", STATISTICAL_LAYERS, language) || (language === "zh" ? "\u4E0D\u989D\u5916\u5C55\u793A" : "none");
    const outputs = labelsFor(
      values,
      "outputs",
      PLOT_OUTPUTS,
      language
    );
    const custom = scalar(values, "custom") || (language === "zh" ? "\u65E0" : "None");
    const captionGuidance = buildCaptionLengthGuidance(
      rangeValue(
        values,
        "captionWordRange",
        CAPTION_LENGTH_POLICY.defaultRange
      ),
      language
    );
    const multiplicity = selected(values, "statistics").includes("test") ? labelFor(
      scalar(values, "multiplicity"),
      MULTIPLICITY_POLICIES,
      language
    ) : language === "zh" ? "\u4E0D\u8FDB\u884C\u663E\u8457\u6027\u68C0\u9A8C" : "no significance testing";
    const includesCode = selected(values, "outputs").includes("code");
    const allowComposite = enabled(values, "allowComposite");
    const [panelMin, panelMax] = rangeValue(
      values,
      "panelCount",
      [1, 3]
    );
    const paletteId = scalar(values, "palette");
    const paletteColors = PLOT_PALETTE_COLORS[paletteId];
    const palette = `${labelFor(
      paletteId,
      PLOT_PALETTES,
      language
    )}${paletteColors ? ` (${paletteColors.join(", ")})` : language === "zh" ? "\uFF08\u4ECE\u8BBA\u6587\u4E2D\u6838\u9A8C\u5E76\u4FDD\u6301\u8BED\u4E49\u4E00\u81F4\uFF09" : " (verify from the manuscript and preserve its semantics)"}`;
    const panelPolicy = allowComposite ? language === "zh" ? `\u5141\u8BB8\u7EC4\u5408\u56FE\uFF0C\u4F7F\u7528 ${panelMin}\u2013${panelMax} \u4E2A\u5B50\u56FE\uFF1B${labelFor(scalar(values, "panels"), PANEL_POLICIES, language)}` : `composite allowed with ${panelMin}\u2013${panelMax} subpanels; ${labelFor(scalar(values, "panels"), PANEL_POLICIES, language)}` : language === "zh" ? "\u4EC5\u5355\u56FE\uFF0C\u4E0D\u751F\u6210\u7EC4\u5408\u56FE" : "single panel only; do not create a composite";
    const chartPolicy = enabled(values, "encourageAdvancedCharts") ? language === "zh" ? "\u5F53\u6570\u636E\u8BED\u4E49\u786E\u5B9E\u66F4\u9002\u5408\u65F6\uFF0C\u9F13\u52B1\u4F7F\u7528\u8D85\u8D8A\u57FA\u7840\u67F1\u72B6\u56FE/\u6298\u7EBF\u56FE\u7684\u56FE\u578B\uFF0C\u4F46\u4E0D\u4E3A\u65B0\u5947\u589E\u52A0\u590D\u6742\u5EA6" : "consider richer alternatives to basic bars or lines when the data semantics justify them, without adding novelty-driven complexity" : language === "zh" ? "\u4F18\u5148\u4F7F\u7528\u6E05\u695A\u7684\u57FA\u7840\u56FE\u578B\uFF0C\u9664\u975E\u5B83\u4EEC\u4F1A\u906E\u853D\u5173\u952E\u5206\u5E03\u6216\u5173\u7CFB" : "prefer clear basic chart types unless they would hide a material distribution or relationship";
    if (language === "zh") {
      return `# \u751F\u6210\u53EF\u590D\u73B0\u7684\u8BBA\u6587\u5B9E\u9A8C\u56FE

\u8BF7\u8BFB\u53D6\u6211\u63D0\u4F9B\u7684\u6570\u636E\u3001\u6307\u6807\u5B9A\u4E49\u3001\u5B9E\u9A8C\u534F\u8BAE\u4E0E\u8BBA\u6587\u4E0A\u4E0B\u6587\u3002\u4F60\u662F\u79D1\u7814\u6570\u636E\u53EF\u89C6\u5316\u4E0E\u7EDF\u8BA1\u5206\u6790\u4E13\u5BB6\uFF1B\u672C\u4EFB\u52A1\u4F7F\u7528\u4EE3\u7801\u7ED8\u56FE\uFF0C\u4E0D\u4F7F\u7528\u751F\u56FE\u6A21\u578B\u3002\u82E5\u5F53\u524D\u73AF\u5883\u53EF\u7528\uFF0C\u9F13\u52B1\u4F7F\u7528 \`$nature-figure\` \u8F85\u52A9\u56FE\u578B\u9009\u62E9\u3001\u4EE3\u7801\u7ED8\u5236\u548C\u51FA\u7248\u7EA7\u6838\u9A8C\uFF1B\u672C\u9875\u914D\u7F6E\u4E0E\u6570\u636E\u8BC1\u636E\u59CB\u7EC8\u4F18\u5148\uFF0CSkill \u7684\u9ED8\u8BA4\u503C\u4E0D\u5F97\u8986\u76D6\u989C\u8272\u3001\u5B50\u56FE\u6570\u91CF\u3001\u7EDF\u8BA1\u8BED\u4E49\u6216\u4EA4\u4ED8\u683C\u5F0F\u3002\u82E5\u8BE5 Skill \u4E0D\u53EF\u7528\uFF0C\u76F4\u63A5\u6309\u672C Prompt \u7EE7\u7EED\u3002

## \u914D\u7F6E
- \u5206\u6790\u4EFB\u52A1\uFF1A${goal}
- \u6570\u636E\u72B6\u6001\uFF1A${dataState}
- \u4E0D\u786E\u5B9A\u6027\uFF1A${uncertainty}
- \u7EDF\u8BA1\u4FE1\u606F\uFF1A${statistics}
- \u591A\u91CD\u6BD4\u8F83\uFF1A${multiplicity}
- \u56FE\u578B\u7B56\u7565\uFF1A${chartPolicy}
- \u9762\u677F\u7EC4\u7EC7\uFF1A${panelPolicy}
- \u7248\u9762\u5BBD\u5EA6\uFF1A${labelFor(scalar(values, "width"), PLOT_WIDTHS, language)}
- \u989C\u8272\uFF1A${palette}
- Caption \u5EFA\u8BAE\uFF1A${captionGuidance}
- \u4EA4\u4ED8\uFF1A${outputs}
- \u8865\u5145\u8981\u6C42\uFF1A${custom}

\u5148\u6838\u5BF9\u5217\u3001\u5355\u4F4D\u3001\u91CD\u590D\u5355\u4F4D\u3001\u7F3A\u5931\u503C\u4E0E\u6307\u6807\u65B9\u5411\uFF0C\u518D\u9009\u62E9\u6700\u80FD\u56DE\u7B54\u7814\u7A76\u95EE\u9898\u7684\u56FE\u578B\u3002\u4E0D\u5F97\u8865\u9020\u6570\u636E\u3001\u628A\u4E0D\u72EC\u7ACB\u7684 seed \u6216\u6837\u672C\u4F2A\u88C5\u6210\u72EC\u7ACB\u91CD\u590D\u3001\u7528\u53CC\u8F74\u5236\u9020\u8D8B\u52BF\uFF0C\u6216\u7528\u663E\u8457\u6027\u66FF\u4EE3\u6548\u5E94\u91CF\uFF1B\u5E94\u660E\u786E\u771F\u6B63\u7684\u91CD\u590D\u5355\u4F4D\u3002\u8BEF\u5DEE\u3001\u533A\u95F4\u548C\u68C0\u9A8C\u5FC5\u987B\u5199\u660E\u5B9A\u4E49\u3001\u6837\u672C\u91CF\u4E0E\u8BA1\u7B97\u65B9\u5F0F\uFF1B\u6570\u636E\u4E0D\u8DB3\u65F6\u4FDD\u7559\u7F3A\u53E3\u5E76\u8BF4\u660E\u4E0D\u80FD\u652F\u6301\u7684\u7ED3\u8BBA\u3002

\u4F7F\u7528\u786E\u5B9A\u6027\u4EE3\u7801\u751F\u6210\u56FE\u7247\uFF0C\u56FA\u5B9A\u73AF\u5883\u4E0E\u968F\u673A\u6027\uFF0C\u4FDD\u6301\u65B9\u6CD5\u989C\u8272\u8DE8\u9762\u677F\u4E00\u81F4\uFF0C\u5E76\u6309\u6700\u7EC8\u680F\u5BBD\u68C0\u67E5\u7F29\u5C0F\u540E\u7684\u5B57\u53F7\u3001\u7EBF\u578B\u3001\u6807\u8BB0\u548C\u56FE\u4F8B\u3002${includesCode ? "\u4EA4\u4ED8\u53EF\u590D\u73B0\u811A\u672C\u53CA\u8FD0\u884C\u8BF4\u660E\uFF1B" : "\u4EE3\u7801\u53EA\u4F5C\u4E3A\u751F\u6210\u8FC7\u7A0B\uFF0C\u4E0D\u989D\u5916\u4EA4\u4ED8\u6E90\u6587\u4EF6\uFF0C\u4F46\u9700\u8BB0\u5F55\u8F6F\u4EF6\u3001\u7248\u672C\u548C\u5173\u952E\u53C2\u6570\uFF1B"}\u53EA\u4EA4\u4ED8\u6240\u9009\u6587\u4EF6\u4E0E\u6240\u9700\u6D3E\u751F\u6570\u636E\u3002caption \u53EA\u8BF4\u660E\u56FE\u5C55\u793A\u4EC0\u4E48\u548C\u7EDF\u8BA1\u91CF\u5982\u4F55\u8BA1\u7B97\uFF0C\u4E0D\u8D8A\u8FC7\u6570\u636E\u4F5C\u7ED3\u8BBA\u3002`;
    }
    return `# Produce a Reproducible Experimental Plot

Read the supplied data, metric definitions, protocol, and manuscript context. Act as a scientific visualization and statistical analysis expert. This is a code-based plotting task; do not use an image-generation model. When available, use \`$nature-figure\` to support chart selection, code generation, and publication-level QA. The configuration and data evidence in this prompt take precedence: never let skill defaults override the palette, subpanel count, statistical semantics, or deliverables. If that skill is unavailable, continue directly from this prompt.

## Configuration
- Analysis task: ${goal}
- Data state: ${dataState}
- Uncertainty: ${uncertainty}
- Statistical layers: ${statistics}
- Multiplicity: ${multiplicity}
- Chart policy: ${chartPolicy}
- Panel structure: ${panelPolicy}
- Layout width: ${labelFor(scalar(values, "width"), PLOT_WIDTHS, language)}
- Color: ${palette}
- Caption guidance: ${captionGuidance}
- Deliverables: ${outputs}
- Additional requirements: ${custom}

Audit columns, units, replicate units, missing values, and metric direction before choosing the plot that best answers the research question. Never invent data, treat non-independent seeds or samples as independent replicates, manufacture trends with dual axes, or substitute significance for effect size; define the actual replicate unit. Define every error quantity, interval, test, sample size, and computation; when the data are insufficient, preserve the gap and state which inference is unsupported.

Generate the figure with deterministic code and pinned dependencies and randomness. Keep method colors stable across panels and inspect typography, line styles, markers, and legends at final publication width. ${includesCode ? "Deliver the reproducible script and run instructions; " : "Use code as the generation process without delivering source, but record software, versions, and key parameters; "}return only the selected assets and required derived data. The caption should explain what is shown and how statistics were computed without claiming more than the data support.`;
  }
};
function getDefaultExperimentalPlotValues() {
  return Object.fromEntries(
    EXPERIMENTAL_PLOTS_WORKBENCH.controls.map((control) => [
      control.id,
      Array.isArray(control.defaultValue) ? [...control.defaultValue] : control.defaultValue
    ])
  );
}
function normalizeExperimentalPlotValues(input = {}) {
  const values = getDefaultExperimentalPlotValues();
  const controls = EXPERIMENTAL_PLOTS_WORKBENCH.controls;
  for (const control of controls) {
    const value = input[control.id];
    if (value === void 0) continue;
    if (control.kind === "toggle") {
      if (typeof value === "boolean") values[control.id] = value;
      continue;
    }
    if (control.kind === "number") {
      const numeric = Number(value);
      if (Number.isFinite(numeric)) {
        values[control.id] = Math.min(
          control.max,
          Math.max(control.min, numeric)
        );
      }
      continue;
    }
    if (control.kind === "range") {
      if (Array.isArray(value) && value.length === 2) {
        const left = Math.min(
          control.max,
          Math.max(control.min, Number(value[0]))
        );
        const right = Math.min(
          control.max,
          Math.max(control.min, Number(value[1]))
        );
        if (Number.isFinite(left) && Number.isFinite(right)) {
          values[control.id] = [
            Math.min(left, right),
            Math.max(left, right)
          ];
        }
      }
      continue;
    }
    if (control.kind === "multi") {
      if (Array.isArray(value)) {
        const allowed = new Set(
          control.options.map((option) => option.value)
        );
        const next = value.map(String).filter((item) => allowed.has(item));
        if (next.length >= (control.minSelected ?? 0)) {
          values[control.id] = next;
        }
      }
      continue;
    }
    if (control.kind === "select" || control.kind === "segmented") {
      const next = String(value);
      if (control.options.some((option) => option.value === next)) {
        values[control.id] = next;
      }
      continue;
    }
    if (control.kind === "text" || control.kind === "textarea") {
      values[control.id] = String(value);
    }
  }
  if (scalar(values, "uncertainty") === "none") {
    values.statistics = selected(values, "statistics").filter(
      (item) => item !== "interval" && item !== "test"
    );
  }
  if (scalar(values, "dataState") === "table") {
    values.statistics = selected(values, "statistics").filter(
      (item) => item !== "points" && item !== "test"
    );
  }
  if (!enabled(values, "allowComposite")) {
    values.panels = "single";
  }
  return values;
}
function buildExperimentalPlotPrompt(input, language) {
  const values = normalizeExperimentalPlotValues(input);
  return EXPERIMENTAL_PLOTS_WORKBENCH.buildPrompt(values, language);
}
var TABLE_PURPOSES = {
  main: text("\u4E3B\u7ED3\u679C\u6BD4\u8F83", "Main comparison"),
  ablation: text("\u6D88\u878D\u7814\u7A76", "Ablation study"),
  efficiency: text("\u6548\u7387\u4E0E\u8D44\u6E90", "Efficiency and resources"),
  dataset: text("\u6570\u636E\u96C6\u4E0E\u7EDF\u8BA1", "Dataset and statistics"),
  setup: text("\u5B9E\u9A8C\u914D\u7F6E", "Experimental setup")
};
var TABLE_INPUTS = {
  raw: text("\u539F\u59CB\u7ED3\u679C\u6587\u4EF6", "Raw result files"),
  existing: text("\u5DF2\u6709\u8868\u683C", "Existing table"),
  mixed: text("\u539F\u59CB\u7ED3\u679C + \u5DF2\u6709\u8868\u683C", "Raw results plus existing table")
};
var METRIC_DIRECTIONS = {
  explicit: text("\u6309\u6211\u63D0\u4F9B\u7684\u65B9\u5411", "Use supplied directions"),
  infer: text("\u7531\u6307\u6807\u5B9A\u4E49\u6838\u9A8C", "Verify from metric definitions"),
  none: text("\u4E0D\u6392\u540D", "No ranking")
};
var EMPHASIS_POLICIES = {
  bestSecond: text("\u6700\u4F73\u7C97\u4F53\u3001\u6B21\u4F73\u4E0B\u5212\u7EBF", "Bold best, underline second-best"),
  best: text("\u4EC5\u7A81\u51FA\u6700\u4F73", "Emphasize best only"),
  none: text("\u4E0D\u7A81\u51FA", "No emphasis")
};
var TABLE_WIDTHS = {
  single: text("\u5355\u680F", "Single column"),
  double: text("\u53CC\u680F", "Double column"),
  landscape: text("\u6A2A\u5411\u9644\u5F55\u9875", "Landscape appendix page"),
  auto: text("\u7531\u5217\u8BED\u4E49\u5224\u65AD", "Infer from column semantics")
};
var TABLE_DENSITIES = {
  compact: text("\u7D27\u51D1", "Compact"),
  balanced: text("\u5E73\u8861", "Balanced"),
  readable: text("\u53EF\u8BFB\u6027\u4F18\u5148", "Readability-first")
};
var TABLE_OUTPUTS = {
  latex: text("LaTeX", "LaTeX"),
  markdown: text("Markdown \u9884\u89C8", "Markdown preview"),
  csv: text("\u6838\u5BF9\u7528 CSV", "Verification CSV")
};
var PAPER_TABLES_WORKBENCH = {
  id: "paper-tables-workbench",
  activePage: "paper-tables",
  copy: sharedCopy({
    zh: {
      eyebrow: "PAPER TABLES",
      title: "\u8BBA\u6587\u8868\u683C",
      subtitle: "\u628A\u771F\u5B9E\u7ED3\u679C\u6574\u7406\u4E3A\u5217\u8BED\u4E49\u6E05\u695A\u3001\u6392\u540D\u6B63\u786E\u4E14\u80FD\u5728\u76EE\u6807\u680F\u5BBD\u4E2D\u9605\u8BFB\u7684\u8BBA\u6587\u8868\u683C\u3002",
      preset: "\u6570\u5B57\u5FE0\u5B9E \xB7 \u8BED\u4E49\u6E05\u695A \xB7 \u7248\u9762\u53EF\u8BFB",
      inputTitle: "\u51C6\u5907\u6750\u6599",
      inputItems: [
        "\u539F\u59CB\u7ED3\u679C\u6216\u5DF2\u6709\u8868\u683C",
        "\u6307\u6807\u5B9A\u4E49\u3001\u5355\u4F4D\u4E0E\u65B9\u5411",
        "\u65B9\u6CD5\u5206\u7EC4\u4E0E\u6BD4\u8F83\u534F\u8BAE",
        "\u76EE\u6807\u6A21\u677F\u6216\u680F\u5BBD"
      ],
      inputHint: "\u8BF7\u4FDD\u7559\u5B8C\u6574\u7CBE\u5EA6\u548C\u5B9E\u9A8C\u6807\u8BC6\uFF1B\u6A21\u578B\u4F1A\u5728\u6838\u5BF9\u540E\u51B3\u5B9A\u5C55\u793A\u7CBE\u5EA6\u3002",
      promptTitle: "\u8BBA\u6587\u8868\u683C Prompt",
      promptPurpose: "\u91CD\u7EC4\u5217\u4E0E\u5206\u7EC4\uFF0C\u4F46\u7EDD\u4E0D\u4E3A\u4E86\u7248\u9762\u6216\u6392\u540D\u6539\u52A8\u5B9E\u9A8C\u6570\u5B57\u3002"
    },
    en: {
      eyebrow: "PAPER TABLES",
      title: "Paper tables",
      subtitle: "Turn authentic results into semantically clear, correctly ranked tables that remain legible at the target width.",
      preset: "Faithful values \xB7 clear semantics \xB7 readable layout",
      inputTitle: "Prepare materials",
      inputItems: [
        "Raw results or an existing table",
        "Metric definitions, units, and directions",
        "Method groups and comparison protocol",
        "Target template or column width"
      ],
      inputHint: "Preserve full precision and experiment identifiers; display precision is chosen only after verification.",
      promptTitle: "Paper table prompt",
      promptPurpose: "Reorganize columns and groups without changing experimental values for layout or ranking."
    }
  }),
  controls: [
    {
      id: "purpose",
      kind: "segmented",
      label: text("\u8868\u683C\u7528\u9014", "Table purpose"),
      description: text(
        "\u7528\u9014\u51B3\u5B9A\u5217\u987A\u5E8F\u3001\u5206\u7EC4\u4E0E caption \u7684\u4FE1\u606F\u91CD\u70B9\u3002",
        "Purpose determines column order, grouping, and caption emphasis."
      ),
      defaultValue: "main",
      options: Object.entries(TABLE_PURPOSES).map(([value, label]) => ({
        value,
        label
      })),
      span: "full"
    },
    {
      id: "inputState",
      kind: "select",
      label: text("\u8F93\u5165\u72B6\u6001", "Input state"),
      description: text(
        "\u539F\u59CB\u7ED3\u679C\u4F18\u5148\uFF1B\u5DF2\u6709\u8868\u683C\u9700\u56DE\u6EAF\u6570\u5B57\u6765\u6E90\u3002",
        "Prefer raw results; trace every existing cell to its source."
      ),
      defaultValue: "mixed",
      options: Object.entries(TABLE_INPUTS).map(([value, label]) => ({
        value,
        label
      }))
    },
    {
      id: "metricDirection",
      kind: "select",
      label: text("\u6307\u6807\u65B9\u5411", "Metric direction"),
      description: text(
        "\u6700\u4F73/\u6B21\u4F73\u5FC5\u987B\u6309\u6BCF\u4E00\u5217\u7684\u771F\u5B9E\u65B9\u5411\u8BA1\u7B97\u3002",
        "Best and second-best must follow the true direction of each metric."
      ),
      defaultValue: "infer",
      options: Object.entries(METRIC_DIRECTIONS).map(([value, label]) => ({
        value,
        label
      }))
    },
    {
      id: "showUncertainty",
      kind: "toggle",
      label: text("\u5C55\u793A\u4E0D\u786E\u5B9A\u6027", "Show uncertainty"),
      description: text(
        "\u4EC5\u5728\u91CD\u590D\u5355\u4F4D\u548C\u8BEF\u5DEE\u5B9A\u4E49\u53EF\u6838\u9A8C\u65F6\u5C55\u793A\u3002",
        "Show only when replicate units and error definitions are verifiable."
      ),
      defaultValue: true,
      enabledLabel: text("\u5747\u503C\u4E0E\u8BEF\u5DEE", "Mean and error"),
      disabledLabel: text("\u4EC5\u70B9\u4F30\u8BA1", "Point estimates only")
    },
    {
      id: "emphasis",
      kind: "select",
      label: text("\u6392\u540D\u5F3A\u8C03", "Ranking emphasis"),
      description: text(
        "\u6392\u540D\u53EA\u5728\u534F\u8BAE\u3001\u6570\u636E\u96C6\u548C\u6307\u6807\u53EF\u76F4\u63A5\u6BD4\u8F83\u65F6\u4F7F\u7528\u3002",
        "Rank only values that share a directly comparable protocol, dataset, and metric."
      ),
      defaultValue: "bestSecond",
      options: Object.entries(EMPHASIS_POLICIES).map(([value, label]) => ({
        value,
        label
      })),
      visibleWhen: (values) => scalar(values, "metricDirection") !== "none"
    },
    {
      id: "width",
      kind: "segmented",
      label: text("\u76EE\u6807\u5BBD\u5EA6", "Target width"),
      description: text(
        "\u4F18\u5148\u91CD\u7EC4\u4FE1\u606F\uFF0C\u4E0D\u4F7F\u7528\u4E0D\u53EF\u8BFB\u7684\u6574\u4F53\u7F29\u653E\u3002",
        "Reorganize information before resorting to unreadable scaling."
      ),
      defaultValue: "auto",
      options: Object.entries(TABLE_WIDTHS).map(([value, label]) => ({
        value,
        label
      })),
      span: "full"
    },
    {
      id: "density",
      kind: "select",
      label: text("\u4FE1\u606F\u5BC6\u5EA6", "Information density"),
      description: text(
        "\u6309\u6B63\u6587\u89D2\u8272\u5E73\u8861\u5B8C\u6574\u6027\u4E0E\u6D4F\u89C8\u6548\u7387\u3002",
        "Balance completeness and scanability for the table's manuscript role."
      ),
      defaultValue: "balanced",
      options: Object.entries(TABLE_DENSITIES).map(([value, label]) => ({
        value,
        label
      }))
    },
    {
      id: "groupMethods",
      kind: "toggle",
      label: text("\u65B9\u6CD5\u5206\u7EC4", "Method grouping"),
      description: text(
        "\u4EC5\u6309\u771F\u5B9E\u7C7B\u522B\u5206\u7EC4\uFF0C\u4F8B\u5982\u76D1\u7763\u4FE1\u53F7\u6216\u5916\u90E8\u8D44\u6E90\u3002",
        "Group only by meaningful categories such as supervision or external resources."
      ),
      defaultValue: true,
      enabledLabel: text("\u4FDD\u7559\u8BED\u4E49\u5206\u7EC4", "Use semantic groups"),
      disabledLabel: text("\u5355\u4E00\u5217\u8868", "Single list")
    },
    {
      id: "outputs",
      kind: "multi",
      label: text("\u4EA4\u4ED8\u683C\u5F0F", "Output formats"),
      description: text(
        "LaTeX \u4E3A\u4E3B\uFF0CCSV \u7528\u4E8E\u9010\u683C\u590D\u6838\u3002",
        "LaTeX is primary; CSV supports cell-by-cell verification."
      ),
      defaultValue: ["latex", "markdown", "csv"],
      minSelected: 1,
      options: Object.entries(TABLE_OUTPUTS).map(([value, label]) => ({
        value,
        label
      })),
      span: "full"
    },
    {
      id: "captionWordRange",
      kind: "range",
      label: text("Caption \u5EFA\u8BAE\u957F\u5EA6", "Suggested caption length"),
      description: text(
        "\u9ED8\u8BA4 10\u201340 words\uFF1B\u4E3A\u4FDD\u8BC1\u81EA\u5305\u542B\u6027\uFF0C\u5FC5\u8981\u65F6\u5141\u8BB8\u8D85\u51FA\u3002",
        "Defaults to 10\u201340 words and may be exceeded when self-containment requires it."
      ),
      defaultValue: CAPTION_LENGTH_POLICY.defaultRange,
      min: CAPTION_LENGTH_POLICY.min,
      max: CAPTION_LENGTH_POLICY.max,
      step: CAPTION_LENGTH_POLICY.step,
      suffix: text("words", "words")
    },
    {
      id: "custom",
      kind: "textarea",
      label: text("\u8865\u5145\u8981\u6C42", "Additional requirements"),
      description: text(
        "\u4F8B\u5982\u56FA\u5B9A\u884C\u987A\u5E8F\u3001\u5FC5\u987B\u4FDD\u7559\u7684\u5217\u6216\u6A21\u677F\u7981\u7528\u5B8F\u5305\u3002",
        "For example, a fixed row order, required columns, or packages forbidden by the template."
      ),
      defaultValue: "",
      placeholder: text("\u53EF\u7559\u7A7A", "Optional"),
      span: "full"
    }
  ],
  updateValues(current, id, value) {
    const next = { ...current, [id]: value };
    if (id === "metricDirection" && value === "none") {
      next.emphasis = "none";
    }
    if (id === "metricDirection" && value !== "none" && scalar(current, "emphasis") === "none") {
      next.emphasis = "bestSecond";
    }
    return next;
  },
  buildPrompt(values, language) {
    const purpose = labelFor(
      scalar(values, "purpose"),
      TABLE_PURPOSES,
      language
    );
    const custom = scalar(values, "custom") || (language === "zh" ? "\u65E0" : "None");
    const metricDirection = scalar(values, "metricDirection");
    const emphasis = metricDirection === "none" ? "none" : scalar(values, "emphasis");
    const includesLatex = selected(values, "outputs").includes("latex");
    const captionGuidance = buildCaptionLengthGuidance(
      rangeValue(
        values,
        "captionWordRange",
        CAPTION_LENGTH_POLICY.defaultRange
      ),
      language
    );
    if (language === "zh") {
      return `# \u751F\u6210\u5FE0\u5B9E\u4E14\u53EF\u8BFB\u7684\u8BBA\u6587\u8868\u683C

\u8BF7\u8BFB\u53D6\u6211\u63D0\u4F9B\u7684\u7ED3\u679C\u6587\u4EF6\u3001\u73B0\u6709\u8868\u683C\u3001\u6307\u6807\u5B9A\u4E49\u548C\u8BBA\u6587\u4E0A\u4E0B\u6587\u3002\u4F60\u7684\u4EFB\u52A1\u662F\u6574\u7406\u4E00\u5F20${purpose}\u8868\u683C\uFF0C\u4E0D\u662F\u6539\u5199\u5B9E\u9A8C\u7ED3\u679C\u3002

## \u914D\u7F6E
- \u8F93\u5165\uFF1A${labelFor(scalar(values, "inputState"), TABLE_INPUTS, language)}
- \u6307\u6807\u65B9\u5411\uFF1A${labelFor(metricDirection, METRIC_DIRECTIONS, language)}
- \u4E0D\u786E\u5B9A\u6027\uFF1A${enabled(values, "showUncertainty") ? "\u5C55\u793A\uFF0C\u4F46\u5FC5\u987B\u6838\u9A8C\u8BEF\u5DEE\u5B9A\u4E49\u4E0E\u91CD\u590D\u5355\u4F4D" : "\u53EA\u5C55\u793A\u70B9\u4F30\u8BA1"}
- \u6392\u540D\u5F3A\u8C03\uFF1A${labelFor(emphasis, EMPHASIS_POLICIES, language)}
- \u5BBD\u5EA6\uFF1A${labelFor(scalar(values, "width"), TABLE_WIDTHS, language)}
- \u5BC6\u5EA6\uFF1A${labelFor(scalar(values, "density"), TABLE_DENSITIES, language)}
- \u65B9\u6CD5\u5206\u7EC4\uFF1A${enabled(values, "groupMethods") ? "\u6309\u771F\u5B9E\u8BED\u4E49\u5206\u7EC4" : "\u5355\u4E00\u5217\u8868"}
- Caption \u5EFA\u8BAE\uFF1A${captionGuidance}
- \u4EA4\u4ED8\uFF1A${labelsFor(values, "outputs", TABLE_OUTPUTS, language)}
- \u8865\u5145\u8981\u6C42\uFF1A${custom}

\u5EFA\u7ACB\u9010\u683C\u6570\u636E\u6838\u5BF9\u8868\uFF0C\u786E\u8BA4\u6765\u6E90\u3001\u6307\u6807\u65B9\u5411\u3001\u5355\u4F4D\u3001\u5C3A\u5EA6\u3001\u6837\u672C\u91CF\u3001\u8BEF\u5DEE\u542B\u4E49\u548C\u53EF\u6BD4\u8303\u56F4\u3002\u4E0D\u5F97\u6539\u53D8\u6570\u503C\u3001\u7B26\u53F7\u6216\u7CBE\u5EA6\u6765\u5236\u9020\u6392\u540D\uFF1B\u7F3A\u5931\u503C\u3001\u672A\u8FD0\u884C\u548C\u4E0D\u9002\u7528\u5FC5\u987B\u533A\u5206\u3002${metricDirection === "none" ? "\u672C\u8868\u4E0D\u505A\u65B9\u6CD5\u6392\u540D\u6216\u6700\u4F73\u503C\u5F3A\u8C03\u3002" : "\u6700\u4F73/\u6B21\u4F73\u53EA\u5728\u540C\u4E00\u534F\u8BAE\u5185\u9010\u5217\u8BA1\u7B97\uFF0Cties \u4F7F\u7528\u4E00\u81F4\u89C4\u5219\u3002"}

\u7528\u6E05\u695A\u7684\u5206\u7EC4\u8868\u5934\u3001\u5355\u4F4D\u4E0E\u65B9\u5411\u6807\u8BB0\u7EC4\u7EC7\u5217\u3002\u4F18\u5148\u5220\u53BB\u91CD\u590D\u6807\u7B7E\u3001\u62C6\u5206\u8BED\u4E49\u4E0D\u540C\u7684\u9762\u677F\u6216\u79FB\u81F3\u9644\u5F55\uFF0C\u4E0D\u8981\u9760\u7F29\u5C0F\u5B57\u4F53\u6216\u538B\u6241\u95F4\u8DDD\u585E\u5165\u680F\u5BBD\u3002${includesLatex ? "LaTeX \u5E94\u517C\u5BB9\u76EE\u6807\u6A21\u677F\uFF0C\u5E76\u53EA\u4F7F\u7528\u5FC5\u8981\u5B8F\u5305\u3002" : "\u672A\u9009\u62E9 LaTeX\uFF0C\u4E0D\u8F93\u51FA LaTeX \u4EE3\u7801\u6216\u6A21\u677F\u4F9D\u8D56\u3002"}\u53EA\u4EA4\u4ED8\u6240\u9009\u683C\u5F0F\u3001\u7B80\u6D01 caption\u3001\u9010\u683C\u6838\u5BF9\u7ED3\u679C\u4EE5\u53CA\u4EFB\u4F55\u65E0\u6CD5\u6838\u9A8C\u7684\u5355\u5143\u683C\uFF1Bcaption \u4E0D\u91CD\u590D\u6240\u6709\u6570\u5B57\uFF0C\u4E5F\u4E0D\u5F15\u5165\u8868\u4E2D\u6CA1\u6709\u7684 claim\u3002`;
    }
    return `# Produce a Faithful, Readable Paper Table

Read the supplied result files, existing tables, metric definitions, and manuscript context. Create a ${purpose.toLowerCase()} table; do not rewrite the experimental record.

## Configuration
- Input: ${labelFor(scalar(values, "inputState"), TABLE_INPUTS, language)}
- Metric direction: ${labelFor(metricDirection, METRIC_DIRECTIONS, language)}
- Uncertainty: ${enabled(values, "showUncertainty") ? "show only after verifying the error definition and replicate unit" : "point estimates only"}
- Ranking emphasis: ${labelFor(emphasis, EMPHASIS_POLICIES, language)}
- Width: ${labelFor(scalar(values, "width"), TABLE_WIDTHS, language)}
- Density: ${labelFor(scalar(values, "density"), TABLE_DENSITIES, language)}
- Method grouping: ${enabled(values, "groupMethods") ? "meaningful semantic groups" : "one list"}
- Caption guidance: ${captionGuidance}
- Deliverables: ${labelsFor(values, "outputs", TABLE_OUTPUTS, language)}
- Additional requirements: ${custom}

Build a cell-level verification ledger covering source, direction, unit, scale, sample size, error meaning, and comparability. Never change values, signs, or precision to manufacture a ranking. Distinguish missing, not run, and not applicable. ${metricDirection === "none" ? "Do not rank methods or emphasize best values in this table." : "Compute best and second-best per column only within a common protocol, with a consistent tie rule."}

Use clear grouped headers, units, and direction marks. Remove duplicate labels, split semantically different panels, or move secondary detail to an appendix before shrinking typography or spacing. ${includesLatex ? "Keep LaTeX compatible with the target template and use only necessary packages." : "LaTeX is not selected, so return no LaTeX code or template dependency."} Return only the selected formats, a concise caption, cell-level checks, and every unverifiable cell. The caption should not restate all values or add unsupported claims.`;
  }
};
var AUDIT_MODES = {
  audit: text("\u4EC5\u5BA1\u8BA1", "Audit only"),
  repair: text("\u5BA1\u8BA1\u5E76\u5B89\u5168\u4FEE\u590D", "Audit and safely repair")
};
var AUDIT_SCOPES = {
  data: text("\u56FE\u8868\u4E0E\u539F\u59CB\u6570\u636E", "Figures/tables versus source data"),
  manuscript: text("\u6B63\u6587\u5F15\u7528\u4E0E\u7ED3\u8BBA", "Manuscript references and claims"),
  semantics: text("\u672F\u8BED\u3001\u5355\u4F4D\u4E0E\u56FE\u4F8B", "Terms, units, and legends"),
  statistics: text("\u7EDF\u8BA1\u8868\u8FBE", "Statistical reporting"),
  accessibility: text("\u53EF\u8BFB\u6027\u4E0E\u65E0\u969C\u788D", "Legibility and accessibility"),
  layout: text("\u7248\u9762\u4E0E\u6D6E\u52A8\u4F53", "Layout and floats"),
  provenance: text("\u6765\u6E90\u4E0E\u53EF\u590D\u73B0\u6027", "Provenance and reproducibility")
};
var AUDIT_SOURCES = {
  complete: text("\u6E90\u6570\u636E + \u6E90\u7801 + PDF", "Source data, code, and PDF"),
  manuscript: text("TeX + PDF", "TeX and PDF"),
  rendered: text("\u4EC5 PDF / \u56FE\u7247", "PDF or rendered assets only")
};
var REPAIR_TARGETS = {
  source: text("\u4FEE\u6539\u6E90\u6587\u4EF6\u5E76\u91CD\u65B0\u751F\u6210", "Repair source and regenerate"),
  report: text("\u53EA\u7ED9\u7CBE\u786E\u8865\u4E01\u5EFA\u8BAE", "Return exact patch instructions only")
};
var FIGURE_TABLE_AUDIT_WORKBENCH = {
  id: "figure-table-audit-workbench",
  activePage: "figure-table-audit",
  copy: sharedCopy({
    zh: {
      eyebrow: "FIGURE & TABLE AUDIT",
      title: "\u56FE\u8868\u5BA1\u8BA1",
      subtitle: "\u9010\u9879\u6838\u5BF9\u6570\u636E\u3001\u6B63\u6587\u3001caption\u3001\u7EDF\u8BA1\u542B\u4E49\u548C\u7248\u9762\uFF1B\u5B89\u5168\u4FEE\u590D\u65F6\u53EA\u6539\u786E\u5B9A\u9519\u8BEF\u3002",
      preset: "\u8BC1\u636E\u5B9A\u4F4D \xB7 \u6700\u5C0F\u4FEE\u590D \xB7 \u53EF\u56DE\u6EAF\u5DEE\u5F02",
      inputTitle: "\u51C6\u5907\u6750\u6599",
      inputItems: [
        "\u8BBA\u6587 TeX \u4E0E\u7F16\u8BD1 PDF",
        "\u56FE\u8868\u6E90\u6587\u4EF6\u4E0E\u751F\u6210\u4EE3\u7801",
        "\u539F\u59CB\u6570\u636E\u6216\u7ED3\u679C\u8868",
        "\u76EE\u6807 venue \u89C4\u5219\uFF08\u53EF\u9009\uFF09"
      ],
      inputHint: "\u6750\u6599\u4E0D\u5B8C\u6574\u65F6\u4ECD\u53EF\u5BA1\u8BA1\uFF0C\u4F46\u5FC5\u987B\u628A\u201C\u65E0\u6CD5\u6838\u9A8C\u201D\u4E0E\u201C\u786E\u8BA4\u9519\u8BEF\u201D\u5206\u5F00\u3002",
      promptTitle: "\u56FE\u8868\u5BA1\u8BA1 Prompt",
      promptPurpose: "\u627E\u51FA\u771F\u5B9E\u9519\u8BEF\u4E0E\u8868\u8FBE\u98CE\u9669\uFF1B\u4FEE\u590D\u4E0D\u6269\u5199\u3001\u4E0D\u91CD\u7ED8\u65E0\u5173\u5185\u5BB9\u3002"
    },
    en: {
      eyebrow: "FIGURE & TABLE AUDIT",
      title: "Figure and table audit",
      subtitle: "Cross-check data, prose, captions, statistics, and layout; in repair mode, change confirmed errors only.",
      preset: "Evidence-located \xB7 minimal repair \xB7 traceable diff",
      inputTitle: "Prepare materials",
      inputItems: [
        "Manuscript TeX and compiled PDF",
        "Figure/table sources and generation code",
        "Raw data or result sheets",
        "Target venue rules (optional)"
      ],
      inputHint: "Incomplete material can still be audited, but unverifiable items must remain distinct from confirmed errors.",
      promptTitle: "Figure and table audit prompt",
      promptPurpose: "Find real errors and communication risks without expanding or redesigning unrelated content."
    }
  }),
  controls: [
    {
      id: "mode",
      kind: "segmented",
      label: text("\u6267\u884C\u6A21\u5F0F", "Mode"),
      description: text(
        "\u5B89\u5168\u4FEE\u590D\u4E25\u683C\u9650\u5236\u4FEE\u6539\u8303\u56F4\u3002",
        "Safe repair strictly limits the change surface."
      ),
      defaultValue: "audit",
      options: Object.entries(AUDIT_MODES).map(([value, label]) => ({
        value,
        label
      })),
      span: "full"
    },
    {
      id: "sourceLevel",
      kind: "select",
      label: text("\u53EF\u7528\u6750\u6599", "Available sources"),
      description: text(
        "\u51B3\u5B9A\u54EA\u4E9B\u95EE\u9898\u80FD\u88AB\u786E\u5B9A\u6027\u6838\u9A8C\u3002",
        "Determines which checks can be conclusive."
      ),
      defaultValue: "complete",
      options: Object.entries(AUDIT_SOURCES).map(([value, label]) => ({
        value,
        label
      }))
    },
    {
      id: "scopes",
      kind: "multi",
      label: text("\u5BA1\u8BA1\u8303\u56F4", "Audit scope"),
      description: text(
        "\u53EF\u4E00\u6B21\u5B8C\u6210\u591A\u9879\uFF0C\u4F46\u6BCF\u9879\u72EC\u7ACB\u62A5\u544A\u8BC1\u636E\u3002",
        "Audit multiple areas in one run while reporting evidence separately."
      ),
      defaultValue: [
        "data",
        "manuscript",
        "semantics",
        "statistics",
        "accessibility"
      ],
      minSelected: 1,
      options: Object.entries(AUDIT_SCOPES).map(([value, label]) => ({
        value,
        label
      })),
      span: "full"
    },
    {
      id: "checkOrphans",
      kind: "toggle",
      label: text("\u5B64\u513F\u56FE\u8868", "Orphaned visuals"),
      description: text(
        "\u68C0\u67E5\u672A\u88AB\u6B63\u6587\u5F15\u7528\u3001\u5F15\u7528\u4E0D\u5B58\u5728\u6216\u7F16\u53F7\u9519\u4F4D\u7684\u56FE\u8868\u3002",
        "Check unreferenced visuals, missing targets, and numbering drift."
      ),
      defaultValue: true,
      enabledLabel: text("\u68C0\u67E5", "Check"),
      disabledLabel: text("\u4E0D\u68C0\u67E5", "Skip")
    },
    {
      id: "venueCompliance",
      kind: "toggle",
      label: text("\u76EE\u6807\u89C4\u5219", "Venue compliance"),
      description: text(
        "\u8054\u7F51\u6838\u9A8C\u5F53\u524D\u5B98\u65B9\u56FE\u8868\u3001\u533F\u540D\u4E0E\u8865\u5145\u6750\u6599\u89C4\u5219\u3002",
        "Verify current official rules for visuals, anonymity, and supplements."
      ),
      defaultValue: false,
      enabledLabel: text("\u8054\u7F51\u6838\u9A8C", "Verify online"),
      disabledLabel: text("\u4E0D\u6838\u9A8C", "Skip")
    },
    {
      id: "venue",
      kind: "text",
      label: text("\u76EE\u6807 venue", "Target venue"),
      description: text(
        "\u586B\u5199\u4F1A\u8BAE/\u671F\u520A\u5168\u79F0\u53CA\u5C4A\u6B21\u3002",
        "Provide the full venue name and edition."
      ),
      defaultValue: "",
      placeholder: text("\u4F8B\u5982\uFF1ANeurIPS 2026", "For example: NeurIPS 2026"),
      visibleWhen: (values) => enabled(values, "venueCompliance")
    },
    {
      id: "repairTarget",
      kind: "select",
      label: text("\u4FEE\u590D\u4EA4\u4ED8", "Repair deliverable"),
      description: text(
        "\u4F18\u5148\u4FEE\u6539\u53EF\u8FFD\u6EAF\u6E90\u6587\u4EF6\uFF0C\u4E0D\u76F4\u63A5\u6D82\u6539\u6E32\u67D3\u56FE\u3002",
        "Prefer traceable source changes over editing rendered pixels."
      ),
      defaultValue: "source",
      options: Object.entries(REPAIR_TARGETS).map(([value, label]) => ({
        value,
        label
      })),
      visibleWhen: (values) => scalar(values, "mode") === "repair"
    },
    {
      id: "custom",
      kind: "textarea",
      label: text("\u8865\u5145\u91CD\u70B9", "Additional focus"),
      description: text(
        "\u4F8B\u5982\u91CD\u70B9\u68C0\u67E5\u67D0\u5F20\u4E3B\u7ED3\u679C\u8868\u6216\u67D0\u4E2A\u7EDF\u8BA1\u5B9A\u4E49\u3002",
        "For example, prioritize a main-results table or a statistical definition."
      ),
      defaultValue: "",
      placeholder: text("\u53EF\u7559\u7A7A", "Optional"),
      span: "full"
    }
  ],
  updateValues(current, id, value) {
    const next = { ...current, [id]: value };
    if (id === "sourceLevel" && value === "rendered") {
      next.repairTarget = "report";
    }
    return next;
  },
  buildPrompt(values, language) {
    const repair = scalar(values, "mode") === "repair";
    const sourceLevel = scalar(values, "sourceLevel");
    const requestedRepairTarget = scalar(values, "repairTarget");
    const sourceRepair = repair && sourceLevel !== "rendered" && requestedRepairTarget === "source";
    const venue = scalar(values, "venue");
    const scopes = selected(values, "scopes");
    const custom = scalar(values, "custom") || (language === "zh" ? "\u65E0" : "None");
    const scopeInstructions = {
      zh: [
        scopes.includes("data") ? "\u6838\u5BF9\u6E90\u6570\u636E\u4E0E\u56FE\u8868\u4E2D\u7684\u6570\u503C\u3001\u5355\u4F4D\u3001\u65B9\u5411\u548C\u805A\u5408\uFF1B\u6CA1\u6709\u6E90\u6570\u636E\u65F6\u6807\u4E3A\u65E0\u6CD5\u6838\u9A8C" : "",
        scopes.includes("manuscript") ? "\u6838\u5BF9 caption\u3001\u6B63\u6587\u5F15\u7528\u4E0E claim \u662F\u5426\u51C6\u786E\u5BF9\u5E94\u56FE\u8868\u8BC1\u636E" : "",
        scopes.includes("semantics") ? "\u6838\u5BF9\u672F\u8BED\u3001\u7B26\u53F7\u3001\u5355\u4F4D\u3001\u56FE\u4F8B\u4E0E\u8DE8\u56FE\u8868\u989C\u8272\u8BED\u4E49" : "",
        scopes.includes("statistics") ? "\u6838\u5BF9\u91CD\u590D\u5355\u4F4D\u3001\u8BEF\u5DEE\u5B9A\u4E49\u3001\u6837\u672C\u91CF\u3001\u68C0\u9A8C\u4E0E\u663E\u8457\u6027\u8868\u8FBE" : "",
        scopes.includes("accessibility") ? "\u68C0\u67E5\u7F29\u5C0F\u540E\u7684\u5B57\u53F7\u3001\u989C\u8272\u533A\u5206\u3001\u56FE\u4F8B\u548C\u5E38\u89C1\u8272\u89C9\u5DEE\u5F02\u4E0B\u53EF\u8BFB\u6027" : "",
        scopes.includes("layout") ? "\u68C0\u67E5\u680F\u5BBD\u3001\u6D6E\u52A8\u4F53\u4F4D\u7F6E\u3001\u5206\u9875\u548C caption \u5360\u7528" : "",
        scopes.includes("provenance") ? "\u8FFD\u8E2A\u751F\u6210\u4EE3\u7801\u3001\u7248\u672C\u3001\u8F93\u5165\u6587\u4EF6\u4E0E\u53EF\u91CD\u590D\u751F\u6210\u8DEF\u5F84" : ""
      ].filter(Boolean).join("\uFF1B"),
      en: [
        scopes.includes("data") ? "trace values, units, direction, and aggregation from source data to visuals, marking them unverifiable when data are absent" : "",
        scopes.includes("manuscript") ? "check captions, prose references, and claims against visual evidence" : "",
        scopes.includes("semantics") ? "check terminology, symbols, units, legends, and cross-visual color semantics" : "",
        scopes.includes("statistics") ? "check replicate units, error definitions, sample sizes, tests, and significance reporting" : "",
        scopes.includes("accessibility") ? "check final-size typography, color distinctions, legends, and common color-vision differences" : "",
        scopes.includes("layout") ? "check column width, float placement, page breaks, and caption footprint" : "",
        scopes.includes("provenance") ? "trace generation code, versions, input files, and the reproducible regeneration path" : ""
      ].filter(Boolean).join("; ")
    };
    const repairInstruction = sourceRepair ? {
      zh: "\u4FEE\u6539\u53EF\u8FFD\u6EAF\u6E90\u6587\u4EF6\u5E76\u91CD\u65B0\u751F\u6210\u53D7\u5F71\u54CD\u56FE\u8868\u3002\u53EA\u6539\u5DF2\u786E\u8BA4\u9519\u8BEF\u53CA\u5176\u76F4\u63A5\u4F9D\u8D56\uFF1B\u5176\u4F59\u6587\u5B57\u3001\u6570\u5B57\u3001\u7248\u5F0F\u3001\u56FE\u8868\u548C\u4EE3\u7801\u4FDD\u6301\u4E0D\u53D8\u3002\u82E5\u6B63\u786E\u4FEE\u590D\u5FC5\u7136\u6539\u53D8\u79D1\u5B66\u7ED3\u8BBA\u3001\u5927\u8303\u56F4\u7ED3\u6784\u6216\u975E\u5C40\u90E8\u7248\u5F0F\uFF0C\u505C\u6B62\u81EA\u52A8\u4FEE\u6539\u5E76\u628A\u5B83\u5347\u7EA7\u4E3A high-risk \u51B3\u7B56\u3002\u4EA4\u4ED8\u9010\u9879 diff \u4E0E\u9A8C\u8BC1\u7ED3\u679C\u3002",
      en: "Repair traceable source files and regenerate affected assets. Change only confirmed errors and their direct dependencies; preserve all other prose, values, layout, visuals, and code. If a correct fix necessarily changes a scientific conclusion, broad structure, or nonlocal layout, stop automatic repair and escalate it as a high-risk decision. Return an itemized diff and validation result."
    } : {
      zh: "\u4E0D\u4FEE\u6539\u4EFB\u4F55\u6587\u4EF6\uFF0C\u53EA\u7ED9\u5B9A\u4F4D\u5230\u6E90\u6587\u4EF6/\u9875\u7801/\u56FE\u8868\u7F16\u53F7\u7684\u7CBE\u786E\u4FEE\u590D\u5EFA\u8BAE\u4E0E\u9A8C\u8BC1\u6B65\u9AA4\uFF1B\u4EC5\u6709\u6E32\u67D3\u6587\u4EF6\u65F6\u7981\u6B62\u6D82\u6539\u50CF\u7D20\u6216\u58F0\u79F0\u5DF2\u7ECF\u4FEE\u590D\u3002",
      en: "Modify no file. Return exact remediation and validation steps located to source file, page, and visual ID. When only rendered assets exist, do not edit pixels or claim that a repair was completed."
    };
    if (language === "zh") {
      return `# \u5BA1\u8BA1\u8BBA\u6587\u56FE\u8868${repair ? "\u5E76\u5B89\u5168\u4FEE\u590D" : ""}

\u8BF7\u5B8C\u6574\u8BFB\u53D6\u63D0\u4F9B\u7684\u8BBA\u6587\u3001\u56FE\u8868\u6E90\u6587\u4EF6\u3001\u751F\u6210\u4EE3\u7801\u4E0E\u6570\u636E\u3002\u9010\u9879\u5BA1\u8BA1\uFF1A${labelsFor(values, "scopes", AUDIT_SCOPES, language)}${enabled(values, "checkOrphans") ? "\uFF0C\u5E76\u68C0\u67E5\u5B64\u513F\u56FE\u8868\u3001\u65AD\u88C2\u5F15\u7528\u548C\u7F16\u53F7\u9519\u4F4D" : ""}\u3002

- \u6750\u6599\u5C42\u7EA7\uFF1A${labelFor(scalar(values, "sourceLevel"), AUDIT_SOURCES, language)}
- \u5B98\u65B9\u89C4\u5219\uFF1A${enabled(values, "venueCompliance") ? `\u8054\u7F51\u6838\u9A8C ${venue || "\u7528\u6237\u6307\u5B9A venue"} \u5F53\u524D\u5B98\u65B9\u9875\u9762\uFF0C\u8BB0\u5F55\u5C4A\u6B21\u3001\u6838\u9A8C\u65E5\u671F\u4E0E URL` : "\u4E0D\u4F5C\u4E3A\u672C\u8F6E\u8303\u56F4"}
- \u8865\u5145\u91CD\u70B9\uFF1A${custom}

\u628A\u53D1\u73B0\u5206\u4E3A\u201C\u786E\u8BA4\u9519\u8BEF\u3001\u8F83\u9AD8\u98CE\u9669\u3001\u6539\u8FDB\u5EFA\u8BAE\u3001\u6750\u6599\u4E0D\u8DB3\u65E0\u6CD5\u6838\u9A8C\u201D\uFF0C\u5E76\u4E3A\u6BCF\u9879\u7ED9\u51FA\u6587\u4EF6/\u9875\u7801/\u56FE\u8868\u7F16\u53F7\u3001\u8BC1\u636E\u3001\u5F71\u54CD\u4E0E\u6700\u5C0F\u5904\u7406\u65B9\u5F0F\u3002\u672C\u8F6E\u53EA\u6267\u884C\u6240\u9009\u8303\u56F4\uFF1A${scopeInstructions.zh || "\u65E0\u6709\u6548\u8303\u56F4"}\u3002${enabled(values, "checkOrphans") ? "\u53E6\u68C0\u67E5\u5B64\u513F\u56FE\u8868\u3001\u65AD\u88C2\u5F15\u7528\u548C\u7F16\u53F7\u9519\u4F4D\u3002" : ""}\u4E0D\u5F97\u628A\u5BA1\u7F8E\u504F\u597D\u5199\u6210\u9519\u8BEF\u3002

${repair ? repairInstruction.zh : "\u53EA\u8F93\u51FA\u7ED3\u6784\u5316\u5BA1\u8BA1\u62A5\u544A\uFF0C\u4E0D\u4FEE\u6539\u4EFB\u4F55\u6587\u4EF6\u3002"}

\u672A\u77E5\u9879\u4FDD\u6301\u672A\u77E5\uFF0C\u4E0D\u63A8\u6D4B\u7F3A\u5931\u6570\u636E\uFF0C\u4E5F\u4E0D\u865A\u6784\u91CD\u65B0\u8BA1\u7B97\u7ED3\u679C\u3002`;
    }
    return `# Audit Paper Figures and Tables${repair ? " and Repair Them Safely" : ""}

Read the manuscript, visual sources, generation code, and data in full. Audit: ${labelsFor(values, "scopes", AUDIT_SCOPES, language)}${enabled(values, "checkOrphans") ? ", including orphaned visuals, broken references, and numbering drift" : ""}.

- Source level: ${labelFor(scalar(values, "sourceLevel"), AUDIT_SOURCES, language)}
- Official rules: ${enabled(values, "venueCompliance") ? `browse and verify the current official ${venue || "target venue"} pages, recording the edition, access date, and URLs` : "out of scope"}
- Additional focus: ${custom}

Classify every finding as confirmed error, material risk, optional improvement, or unverifiable due to missing evidence. Give the file/page/visual ID, evidence, impact, and smallest remedy. Perform only the selected scope: ${scopeInstructions.en || "no valid scope"}. ${enabled(values, "checkOrphans") ? "Also check orphaned visuals, broken references, and numbering drift." : ""} Never report an aesthetic preference as an error.

${repair ? repairInstruction.en : "Return a structured audit report only and do not modify any file."}

Keep unknowns unknown; never infer missing data or fabricate recomputed results.`;
  }
};

// app/writing/diagnosis/config.ts
var text2 = (zh, en) => ({ zh, en });
function scalar2(values, id) {
  return String(values[id] ?? "").trim();
}
function enabled2(values, id) {
  return values[id] === true;
}
function selected2(values, id) {
  return Array.isArray(values[id]) ? values[id] : [];
}
function rangeValue2(values, id, fallback) {
  const value = values[id];
  return Array.isArray(value) && value.length === 2 ? [Number(value[0]), Number(value[1])] : fallback;
}
function sharedCopy2(seed) {
  return {
    zh: {
      ...seed.zh,
      reset: "\u6062\u590D\u9ED8\u8BA4\u914D\u7F6E",
      resetHint: "\u6062\u590D\u5168\u6587\u3001\u6807\u51C6\u8BCA\u65AD\u548C\u4EC5\u8F93\u51FA\u62A5\u544A\u3002",
      switchPromptLanguage: "\u5207\u6362 Prompt \u8BED\u8A00",
      copy: "\u590D\u5236",
      copied: "\u5DF2\u590D\u5236",
      expand: "\u5C55\u5F00",
      collapse: "\u6536\u8D77",
      clipboardError: "\u590D\u5236\u5931\u8D25\uFF0C\u8BF7\u5C55\u5F00\u540E\u624B\u52A8\u9009\u62E9\u6587\u672C\u3002",
      on: "\u5F00\u542F",
      off: "\u5173\u95ED"
    },
    en: {
      ...seed.en,
      reset: "Restore defaults",
      resetHint: "Restore whole-manuscript scope, standard depth, and report-only mode.",
      switchPromptLanguage: "Switch prompt language",
      copy: "Copy",
      copied: "Copied",
      expand: "Expand",
      collapse: "Collapse",
      clipboardError: "Copy failed. Expand the prompt and select the text manually.",
      on: "On",
      off: "Off"
    }
  };
}
var DIAGNOSIS_SCOPES = {
  whole: text2("\u5168\u6587", "Whole manuscript"),
  selected: text2("\u9009\u5B9A\u5185\u5BB9", "Selected sections")
};
var MANUSCRIPT_SECTIONS = {
  abstract: text2("Abstract", "Abstract"),
  introduction: text2("Introduction", "Introduction"),
  "related-work": text2("Related Work", "Related Work"),
  method: text2("Method", "Method"),
  "experiments-results": text2(
    "Experiments & Results",
    "Experiments & Results"
  ),
  discussion: text2("Discussion & Limitations", "Discussion & Limitations"),
  conclusion: text2("Conclusion", "Conclusion"),
  "captions-notes": text2("Captions\u3001Notes \u4E0E\u811A\u6CE8", "Captions, notes, and footnotes"),
  equations: text2("\u516C\u5F0F\u53CA\u5176\u8BF4\u660E\u6587\u5B57", "Equations and surrounding prose")
};
var DIAGNOSIS_DEPTHS = {
  focused: {
    label: text2("\u805A\u7126", "Focused"),
    prompt: text2(
      "\u53EA\u62A5\u544A\u53CD\u590D\u51FA\u73B0\u6216\u660E\u663E\u5F71\u54CD\u7406\u89E3\u7684\u4E3B\u8981\u4E60\u60EF",
      "report only recurring or clearly consequential habits"
    )
  },
  standard: {
    label: text2("\u6807\u51C6", "Standard"),
    prompt: text2(
      "\u8986\u76D6\u4E3B\u8981\u4E0E\u4E2D\u7B49\u95EE\u9898\uFF0C\u5FFD\u7565\u65E0\u5173\u7D27\u8981\u7684\u4E2A\u4EBA\u504F\u597D",
      "cover major and moderate issues while ignoring inconsequential preferences"
    )
  },
  deep: {
    label: text2("\u6DF1\u5165", "Deep"),
    prompt: text2(
      "\u540C\u65F6\u68C0\u67E5\u5C40\u90E8\u9605\u8BFB\u963B\u529B\uFF0C\u4F46\u4E0D\u9000\u5316\u4E3A\u9010\u8BCD\u8BED\u6CD5\u6311\u9519",
      "include local reading friction without degenerating into word-by-word copyediting"
    )
  }
};
var READER_PROFILES = {
  infer: {
    label: text2("\u6839\u636E\u8BBA\u6587\u5224\u65AD", "Infer from the manuscript"),
    prompt: text2(
      "\u6839\u636E\u8BBA\u6587\u4E3B\u9898\u3001\u76EE\u6807\u8BFB\u8005\u548C\u73B0\u6709\u5199\u6CD5\u5224\u65AD",
      "infer from the topic, intended readership, and current manuscript"
    )
  },
  specialist: {
    label: text2("\u9886\u57DF\u4E13\u5BB6", "Specialists"),
    prompt: text2(
      "\u9762\u5411\u719F\u6089\u8BE5\u5B50\u9886\u57DF\u672F\u8BED\u4E0E\u5E38\u89C1\u65B9\u6CD5\u7684\u4E13\u5BB6",
      "specialists familiar with the subfield's terminology and standard methods"
    )
  },
  mixed: {
    label: text2("\u6DF7\u5408\u8BFB\u8005", "Mixed technical audience"),
    prompt: text2(
      "\u540C\u65F6\u670D\u52A1\u5B50\u9886\u57DF\u4E13\u5BB6\u548C\u76F8\u90BB\u65B9\u5411\u7814\u7A76\u8005",
      "both subfield specialists and researchers from adjacent areas"
    )
  },
  broad: {
    label: text2("\u5E7F\u6CDB\u79D1\u7814\u8BFB\u8005", "Broad research audience"),
    prompt: text2(
      "\u51CF\u5C11\u4E0D\u5FC5\u8981\u7684\u4E13\u4E1A\u8D1F\u62C5\uFF0C\u4F46\u4FDD\u7559\u79D1\u5B66\u7CBE\u5EA6",
      "reduce avoidable specialist burden while preserving scientific precision"
    )
  }
};
var DIAGNOSIS_DIMENSIONS = {
  "argument-flow": {
    label: text2("\u4E3B\u7EBF\u4E0E\u7AE0\u8282\u529F\u80FD", "Argument flow and section function"),
    prompt: text2(
      "\u68C0\u67E5\u6838\u5FC3\u4E3B\u7EBF\u80FD\u5426\u8D2F\u7A7F\u6807\u9898\u3001\u6458\u8981\u3001\u5F15\u8A00\u3001\u6B63\u6587\u548C\u7ED3\u8BBA\uFF1B\u68C0\u67E5\u7AE0\u8282\u804C\u8D23\u3001\u6BB5\u843D\u843D\u70B9\u3001old-to-new \u4FE1\u606F\u6D41\u4EE5\u53CA\u5931\u7126\u3001\u5012\u5E8F\u6216\u7EAF\u5BFC\u822A\u5185\u5BB9",
      "check whether one central line survives across title, abstract, introduction, body, and conclusion; inspect section roles, paragraph landing points, old-to-new flow, drift, inversion, and empty navigation"
    )
  },
  "citation-practice": {
    label: text2("\u5F15\u7528\u8986\u76D6\u4E0E\u653E\u7F6E", "Citation coverage and placement"),
    prompt: text2(
      "\u6807\u51FA\u5BF9\u9886\u57DF\u4E8B\u5B9E\u3001\u73B0\u72B6\u3001\u6BD4\u8F83\u3001\u7F3A\u53E3\u6216\u4ED6\u4EBA\u5DE5\u4F5C\u7684\u9AD8\u7F6E\u4FE1\u5EA6\u7F3A\u5F15\u6587\u4F4D\u7F6E\uFF1B\u68C0\u67E5\u5F15\u7528\u662F\u5426\u7D27\u8D34\u6240\u652F\u6301\u7684 claim\uFF0C\u5E76\u533A\u5206\u6587\u732E\u4E8B\u5B9E\u3001\u4F5C\u8005\u63A8\u65AD\u548C\u672C\u6587\u53D1\u73B0",
      "flag high-confidence missing citations for field facts, current practice, comparisons, gaps, or prior work; check that citations attach to the exact claim and distinguish source facts, author inference, and this paper's findings"
    )
  },
  "paragraph-craft": {
    label: text2("\u6BB5\u843D\u4E0E\u53E5\u95F4\u63A8\u8FDB", "Paragraph and sentence progression"),
    prompt: text2(
      "\u68C0\u67E5\u6BCF\u6BB5\u662F\u5426\u53EA\u627F\u62C5\u4E00\u4E2A\u4E3B\u8981\u529F\u80FD\uFF0C\u5E76\u5F62\u6210\u8BED\u5883\u6216\u95EE\u9898\u3001\u5C55\u5F00\u3001\u843D\u70B9\u6216\u8FC7\u6E21\uFF1B\u68C0\u67E5 topic position\u3001stress position\u3001\u6307\u4EE3\u3001\u4E3B\u8C13\u8DDD\u79BB\u4E0E\u53E5\u95F4\u8854\u63A5",
      "check that each paragraph performs one main job and moves from context or question through development to a takeaway or transition; inspect topic and stress positions, references, subject-verb distance, and sentence linkage"
    )
  },
  "display-writing": {
    label: text2("\u56FE\u8868 Caption \u4E0E Note", "Figure, table, caption, and note writing"),
    prompt: text2(
      "\u68C0\u67E5 caption \u662F\u5426\u81EA\u8DB3\u4F46\u7B80\u6D01\u3001\u662F\u5426\u4EA4\u4EE3\u9762\u677F\u548C\u5FC5\u8981\u7EDF\u8BA1\u8BED\u4E49\uFF1B\u8BC6\u522B\u628A\u65B9\u6CD5\u3001\u7ED3\u679C\u89E3\u91CA\u3001\u516C\u5F0F\u63A8\u5BFC\u6216\u6B63\u6587\u8BBA\u8BC1\u585E\u8FDB caption\u3001note \u6216\u811A\u6CE8\uFF0C\u4EE5\u53CA\u6B63\u6587\u4E0E\u56FE\u8868\u7684\u91CD\u590D",
      "check whether captions are concise yet self-contained and explain panels plus essential statistical semantics; identify methods, interpretation, derivations, or main-text arguments displaced into captions, notes, or footnotes, and duplication between prose and displays"
    )
  },
  "results-writing": {
    label: text2("\u7ED3\u679C\u6BB5\u843D\u4E0E Finding", "Results prose and findings"),
    prompt: text2(
      "\u68C0\u67E5\u7ED3\u679C\u6BB5\u843D\u662F\u5426\u8BF4\u660E\u95EE\u9898\u6216\u6BD4\u8F83\u76EE\u7684\u3001\u5173\u952E finding\u3001\u5FC5\u8981\u8BC1\u636E\u548C take-away\uFF1B\u8BC6\u522B\u9010\u683C\u590D\u8FF0\u56FE\u8868\u3001\u5806\u780C\u6570\u5B57\u6216\u6CA1\u6709\u6309\u4E3B\u7ED3\u679C\u4E0E\u6B21\u8981\u7ED3\u679C\u5206\u914D\u7BC7\u5E45",
      "check whether results paragraphs state the question or comparison purpose, key finding, necessary evidence, and take-away; identify cell-by-cell display narration, number dumping, and failure to allocate prose by result importance"
    )
  },
  "mathematical-writing": {
    label: text2("\u516C\u5F0F\u4E0E\u6570\u5B66\u53D9\u8FF0", "Equations and mathematical exposition"),
    prompt: text2(
      "\u68C0\u67E5\u516C\u5F0F\u662F\u5426\u878D\u5165\u53E5\u5B50\u3001\u7528\u9014\u662F\u5426\u5148\u88AB\u5EFA\u7ACB\u3001\u7B26\u53F7\u662F\u5426\u53CA\u65F6\u5B9A\u4E49\u3001\u516C\u5F0F\u524D\u540E\u662F\u5426\u89E3\u91CA\u5176\u79D1\u5B66\u542B\u4E49\uFF1B\u8BC6\u522B\u5B64\u7ACB\u516C\u5F0F\u3001\u7B26\u53F7\u5806\u53E0\u3001\u6B63\u6587\u673A\u68B0\u590D\u8FF0\u548C note \u4E2D\u7684\u5197\u957F\u63A8\u5BFC",
      "check whether equations participate in sentences, have a stated purpose, define symbols when needed, and receive scientific interpretation; identify orphan equations, notation piles, mechanical prose restatement, and long derivations hidden in notes"
    )
  },
  "language-precision": {
    label: text2("\u7CBE\u786E\u3001\u514B\u5236\u4E0E\u8BFB\u8005\u8D1F\u62C5", "Precision, restraint, and reader burden"),
    prompt: text2(
      "\u68C0\u67E5\u672F\u8BED\u4E0E\u7F29\u5199\u8D1F\u62C5\u3001\u540D\u8BCD\u4E32\u3001\u6A21\u7CCA\u4E3B\u8BED\u6216\u6307\u4EE3\u3001\u8FC7\u5EA6\u65AD\u8A00\u6216\u8FC7\u5EA6\u5F31\u5316\u3001\u7A7A\u6CDB\u5F62\u5BB9\u8BCD\u548C\u4E0D\u5FC5\u8981\u7684\u590D\u6742\u53E5\uFF1B\u4E3B\u52A8\u8BED\u6001\u3001\u88AB\u52A8\u8BED\u6001\u3001we/our \u4E0E\u5192\u53F7\u53EA\u6309\u8BED\u5883\u5224\u65AD\uFF0C\u4E0D\u8BBE\u673A\u68B0\u7981\u4EE4",
      "check jargon and acronym burden, noun stacks, vague subjects or antecedents, overclaiming or over-hedging, empty modifiers, and needless sentence complexity; judge active or passive voice, we/our, and colons contextually rather than by blanket rules"
    )
  },
  "redundancy-navigation": {
    label: text2("\u91CD\u590D\u3001\u6807\u9898\u4E0E\u673A\u68B0\u5316\u8868\u8FBE", "Redundancy, headings, and mechanical prose"),
    prompt: text2(
      "\u68C0\u67E5\u8DE8\u7AE0\u8282\u91CD\u590D claim \u6216\u5B9A\u4E49\u3001\u6A21\u677F\u5316\u94FA\u57AB\u4E0E\u603B\u7ED3\u3001\u6CDB\u5316\u6807\u9898\u3001\u8FC7\u5BC6\u5C42\u7EA7\u548C\u5197\u957F\u5BFC\u822A\u53E5\uFF1B\u533A\u5206\u5FC5\u8981\u56DE\u6263\u4E0E\u65E0\u65B0\u589E\u4EF7\u503C\u7684\u91CD\u590D",
      "check repeated claims or definitions across sections, formulaic setup and recap, generic headings, over-dense hierarchy, and verbose navigation; distinguish useful callbacks from repetition that adds no value"
    )
  }
};
var DIAGNOSIS_ACTIONS = {
  report: text2("\u53EA\u8BCA\u65AD\u5E76\u7ED9\u51FA\u6307\u6B63", "Diagnosis and guidance only"),
  repair: text2("\u8BCA\u65AD\u5E76\u5B89\u5168\u4FEE\u590D", "Diagnose and safely repair")
};
function optionEntries(values) {
  return Object.entries(values).map(([value, label]) => ({ value, label }));
}
function labelsFor2(values, id, labels, language) {
  return selected2(values, id).map((value) => {
    const item = labels[value];
    if (!item) return value;
    return "label" in item ? item.label[language] : item[language];
  }).join(language === "zh" ? "\u3001" : ", ");
}
function selectedDimensionInstructions(values, language) {
  return selected2(values, "dimensions").map((id) => DIAGNOSIS_DIMENSIONS[id]?.prompt[language]).filter(Boolean).map((instruction) => `- ${instruction}`).join("\n");
}
var WRITING_DIAGNOSIS_WORKBENCH = {
  id: "writing-diagnosis",
  activePage: "writing-diagnosis",
  copy: sharedCopy2({
    zh: {
      eyebrow: "ACADEMIC WRITING DIAGNOSIS",
      title: "\u5B66\u672F\u5199\u4F5C\u8BCA\u65AD",
      subtitle: "\u53D1\u73B0\u4F5C\u8005\u81EA\u5DF1\u6700\u96BE\u5BDF\u89C9\u7684\u5199\u4F5C\u624B\u6CD5\u4E0E\u957F\u671F\u4E60\u60EF\u95EE\u9898\uFF0C\u800C\u4E0D\u662F\u91CD\u65B0\u8BC4\u5BA1\u8BBA\u6587\u7684\u521B\u65B0\u6027\u548C\u5B9E\u9A8C\u3002",
      preset: "\u5168\u6587\u7406\u89E3 \xB7 \u5177\u4F53\u5B9A\u4F4D \xB7 \u53EF\u6267\u884C\u6307\u6B63",
      inputTitle: "\u8BCA\u65AD\u6750\u6599",
      inputItems: [
        "\u4E3B\u7A3F .tex\uFF08\u5FC5\u9700\uFF09",
        "\u6700\u65B0\u7F16\u8BD1 PDF\uFF08\u5EFA\u8BAE\uFF09",
        ".bib\uFF08\u5EFA\u8BAE\uFF09",
        "\u76EE\u6807 venue \u6307\u5357\uFF08\u53EF\u9009\uFF09"
      ],
      inputHint: "\u65E0\u9700\u4E0A\u4F20 figures \u6216\u5B9E\u9A8C\u6E90\u6570\u636E\u3002\u672C\u9875\u8BCA\u65AD\u5199\u4F5C\u8868\u73B0\uFF1B\u79D1\u5B66\u6B63\u786E\u6027\u3001\u6570\u636E\u4E00\u81F4\u6027\u548C BibTeX \u771F\u4F2A\u5C5E\u4E8E\u5176\u4ED6\u4E13\u9879\u5BA1\u8BA1\u3002",
      promptTitle: "\u5B66\u672F\u5199\u4F5C\u8BCA\u65AD Prompt",
      promptPurpose: "\u4ECE\u5168\u6587\u3001\u6BB5\u843D\u548C\u53E5\u5B50\u4E09\u4E2A\u5C3A\u5EA6\u5B9A\u4F4D\u53CD\u590D\u51FA\u73B0\u7684\u5199\u4F5C\u5F31\u70B9\uFF0C\u5E76\u89E3\u91CA\u5982\u4F55\u6539\u8FDB\u3002"
    },
    en: {
      eyebrow: "ACADEMIC WRITING DIAGNOSIS",
      title: "Academic writing diagnosis",
      subtitle: "Expose recurring writing techniques and habits that authors rarely notice themselves\u2014without re-reviewing novelty or experiments.",
      preset: "Whole-text reading \xB7 precise locations \xB7 actionable guidance",
      inputTitle: "Diagnostic materials",
      inputItems: [
        "Main .tex (required)",
        "Latest compiled PDF (recommended)",
        ".bib (recommended)",
        "Target-venue guidance (optional)"
      ],
      inputHint: "Figures and raw experimental data are unnecessary. This page diagnoses writing; scientific correctness, data consistency, and BibTeX authenticity belong to separate audits.",
      promptTitle: "Academic writing diagnosis prompt",
      promptPurpose: "Locate recurring writing weaknesses at manuscript, paragraph, and sentence scale, then explain how to improve them."
    }
  }),
  controls: [
    {
      id: "scope",
      kind: "segmented",
      label: text2("\u8BCA\u65AD\u8303\u56F4", "Diagnostic scope"),
      description: text2(
        "\u5168\u6587\u6700\u6709\u5229\u4E8E\u53D1\u73B0\u8DE8\u7AE0\u8282\u91CD\u590D\u548C\u53D9\u4E8B\u65AD\u88C2\u3002",
        "Whole-manuscript reading best exposes repetition and narrative breaks."
      ),
      defaultValue: "whole",
      options: optionEntries(DIAGNOSIS_SCOPES),
      span: "full"
    },
    {
      id: "sections",
      kind: "multi",
      label: text2("\u9009\u62E9\u5185\u5BB9", "Select sections"),
      description: text2(
        "\u81F3\u5C11\u9009\u62E9\u4E00\u9879\uFF1Bcaption\u3001note \u548C\u516C\u5F0F\u53EF\u72EC\u7ACB\u8BCA\u65AD\u3002",
        "Select at least one item; captions, notes, and equations can be diagnosed independently."
      ),
      defaultValue: ["introduction"],
      minSelected: 1,
      options: optionEntries(MANUSCRIPT_SECTIONS),
      visibleWhen: (values) => scalar2(values, "scope") === "selected",
      span: "full"
    },
    {
      id: "depth",
      kind: "segmented",
      label: text2("\u8BCA\u65AD\u6DF1\u5EA6", "Diagnostic depth"),
      description: text2(
        "\u9ED8\u8BA4\u5173\u6CE8\u4F1A\u5F71\u54CD\u9605\u8BFB\u3001\u8BBA\u8BC1\u6216\u5BA1\u7A3F\u5224\u65AD\u7684\u95EE\u9898\u3002",
        "The default focuses on issues that affect reading, argument, or reviewer judgment."
      ),
      defaultValue: "standard",
      options: Object.entries(DIAGNOSIS_DEPTHS).map(([value, item]) => ({
        value,
        label: item.label
      })),
      span: "full"
    },
    {
      id: "audience",
      kind: "select",
      label: text2("\u76EE\u6807\u8BFB\u8005", "Intended readers"),
      description: text2(
        "\u8BFB\u8005\u80CC\u666F\u51B3\u5B9A\u672F\u8BED\u89E3\u91CA\u548C\u6280\u672F\u7EC6\u8282\u7684\u5408\u7406\u5BC6\u5EA6\u3002",
        "Reader background determines the appropriate density of terminology and detail."
      ),
      defaultValue: "infer",
      options: Object.entries(READER_PROFILES).map(([value, item]) => ({
        value,
        label: item.label
      }))
    },
    {
      id: "dimensions",
      kind: "multi",
      label: text2("\u8BCA\u65AD\u7EF4\u5EA6", "Diagnostic dimensions"),
      description: text2(
        "\u5141\u8BB8\u7EC4\u5408\u68C0\u67E5\uFF1B\u6700\u7EC8\u6309\u53CD\u590D\u51FA\u73B0\u7684\u4E60\u60EF\u5F52\u5E76\uFF0C\u4E0D\u6309\u6E05\u5355\u673A\u68B0\u62A5\u9519\u3002",
        "Combine dimensions freely; findings are grouped by recurring habit rather than emitted as checklist noise."
      ),
      defaultValue: Object.keys(DIAGNOSIS_DIMENSIONS),
      minSelected: 1,
      options: Object.entries(DIAGNOSIS_DIMENSIONS).map(
        ([value, item]) => ({
          value,
          label: item.label
        })
      ),
      span: "full"
    },
    {
      id: "browseCitations",
      kind: "toggle",
      label: text2("\u4E3A\u7F3A\u5F15\u6587\u4F4D\u7F6E\u68C0\u7D22\u5019\u9009\u6587\u732E", "Search candidate sources for citation gaps"),
      description: text2(
        "\u53EA\u5904\u7406\u9AD8\u7F6E\u4FE1\u5EA6\u7F3A\u53E3\uFF1B\u65B0\u589E\u6765\u6E90\u5FC5\u987B\u6838\u9A8C\u5E76\u5355\u72EC\u7ED9\u51FA BibTeX\uFF0C\u4E0D\u81EA\u52A8\u63D2\u5165\u6B63\u6587\u3002",
        "Only address high-confidence gaps. Verify new sources, return BibTeX separately, and never insert them silently."
      ),
      defaultValue: false,
      enabledLabel: text2("\u8054\u7F51\u68C0\u7D22\u5019\u9009", "Search verified candidates"),
      disabledLabel: text2("\u53EA\u5B9A\u4F4D\u7F3A\u53E3", "Locate gaps only"),
      visibleWhen: (values) => selected2(values, "dimensions").includes("citation-practice")
    },
    {
      id: "action",
      kind: "segmented",
      label: text2("\u5904\u7406\u65B9\u5F0F", "Action"),
      description: text2(
        "\u9ED8\u8BA4\u53EA\u7ED9\u51FA\u8BCA\u65AD\uFF0C\u5148\u8BA9\u4F5C\u8005\u770B\u6E05\u81EA\u5DF1\u7684\u5199\u4F5C\u4E60\u60EF\u3002",
        "The default reports the diagnosis so the author can see recurring habits before revision."
      ),
      defaultValue: "report",
      options: optionEntries(DIAGNOSIS_ACTIONS),
      span: "full"
    },
    {
      id: "preserveStrengths",
      kind: "toggle",
      label: text2("\u6807\u8BB0\u5E76\u4FDD\u62A4\u539F\u7A3F\u4E2D\u7684\u597D\u8868\u8FBE", "Identify and preserve strong writing"),
      description: text2(
        "\u907F\u514D\u4E3A\u4E86\u7EDF\u4E00\u98CE\u683C\u800C\u6539\u574F\u5DF2\u7ECF\u6E05\u695A\u3001\u51C6\u786E\u4E14\u6709\u8FA8\u8BC6\u5EA6\u7684\u6587\u5B57\u3002",
        "Prevent clear, accurate, distinctive prose from being flattened for stylistic uniformity."
      ),
      defaultValue: true,
      enabledLabel: text2("\u4FDD\u62A4\u597D\u8868\u8FBE", "Preserve strengths"),
      disabledLabel: text2("\u4E0D\u5355\u72EC\u6807\u8BB0", "Do not mark separately")
    },
    {
      id: "captionWordRange",
      kind: "range",
      label: text2("Caption \u5EFA\u8BAE\u957F\u5EA6", "Suggested caption length"),
      description: text2(
        "\u4EC5\u5728\u5B89\u5168\u4FEE\u590D\u786E\u9700\u6539\u5199 Caption \u65F6\u4F7F\u7528\uFF1B\u9ED8\u8BA4 10\u201340 words\uFF0C\u5FC5\u8981\u65F6\u5141\u8BB8\u8D85\u51FA\uFF0C\u957F\u5EA6\u672C\u8EAB\u4E0D\u6784\u6210\u9519\u8BEF\u3002",
        "Use only when a safe repair genuinely rewrites a caption. The default 10\u201340-word range is flexible, and length alone is never an error."
      ),
      defaultValue: CAPTION_LENGTH_POLICY.defaultRange,
      min: CAPTION_LENGTH_POLICY.min,
      max: CAPTION_LENGTH_POLICY.max,
      step: CAPTION_LENGTH_POLICY.step,
      suffix: text2("words", "words")
    },
    {
      id: "custom",
      kind: "textarea",
      label: text2("\u8865\u5145\u5173\u6CE8\u70B9", "Additional focus"),
      description: text2(
        "\u4F8B\u5982\u7279\u522B\u68C0\u67E5 caption\u3001\u516C\u5F0F\u8BF4\u660E\u6216\u67D0\u4F4D\u4F5C\u8005\u53CD\u590D\u51FA\u73B0\u7684\u4E60\u60EF\u3002",
        "For example, focus on captions, equation exposition, or a recurring author habit."
      ),
      defaultValue: "",
      placeholder: text2(
        "\u53EF\u7559\u7A7A\uFF1B\u4E0D\u8981\u5728\u8FD9\u91CC\u7C98\u8D34\u8BBA\u6587\u5168\u6587\u3002",
        "Optional; do not paste the manuscript here."
      ),
      span: "full"
    }
  ],
  buildPrompt(values, language) {
    const scope = scalar2(values, "scope") === "whole" ? DIAGNOSIS_SCOPES.whole[language] : labelsFor2(values, "sections", MANUSCRIPT_SECTIONS, language);
    const depthId = scalar2(values, "depth");
    const audienceId = scalar2(values, "audience");
    const depth = DIAGNOSIS_DEPTHS[depthId]?.prompt[language] ?? depthId;
    const audience = READER_PROFILES[audienceId]?.prompt[language] ?? audienceId;
    const dimensions = labelsFor2(
      values,
      "dimensions",
      DIAGNOSIS_DIMENSIONS,
      language
    );
    const dimensionInstructions = selectedDimensionInstructions(
      values,
      language
    );
    const repair = scalar2(values, "action") === "repair";
    const browse = enabled2(values, "browseCitations") && selected2(values, "dimensions").includes("citation-practice");
    const preserve = enabled2(values, "preserveStrengths");
    const captionGuidance = buildCaptionLengthGuidance(
      rangeValue2(
        values,
        "captionWordRange",
        CAPTION_LENGTH_POLICY.defaultRange
      ),
      language
    );
    const custom = scalar2(values, "custom") || (language === "zh" ? "\u65E0" : "None");
    if (language === "zh") {
      return `# \u5B66\u672F\u5199\u4F5C\u8BCA\u65AD

\u5B8C\u6574\u9605\u8BFB\u4E3B\u7A3F \`.tex\`\uFF0C\u5E76\u7ED3\u5408\u6700\u65B0 \`.pdf\` \u5224\u65AD\u771F\u5B9E\u9605\u8BFB\u6548\u679C\uFF1B\`.bib\` \u53EA\u7528\u4E8E\u7406\u89E3\u73B0\u6709\u5F15\u7528\u8FB9\u754C\u3002\u672C\u4EFB\u52A1\u8BCA\u65AD\u5199\u4F5C\u624B\u6CD5\u548C\u53CD\u590D\u51FA\u73B0\u7684\u5199\u4F5C\u4E60\u60EF\uFF0C\u4E0D\u8BC4\u4EF7 Idea \u521B\u65B0\u6027\u3001\u5B9E\u9A8C\u8BBE\u8BA1\u3001\u6570\u636E\u81EA\u6D3D\u3001BibTeX \u771F\u4F2A\u3001\u6295\u7A3F\u683C\u5F0F\u3001\u6284\u88AD\u6216 AI \u751F\u6210\u6982\u7387\u3002

\u8BF7\u7406\u89E3\u8FD9\u4E9B\u89C4\u5219\u5E0C\u671B\u4FDD\u62A4\u7684\u5199\u4F5C\u76EE\u6807\uFF0C\u5E76\u8FD0\u7528\u4F60\u7684\u4E13\u4E1A\u5224\u65AD\u5B8C\u6210\u6BD4\u673A\u68B0\u5957\u7528\u6E05\u5355\u66F4\u51C6\u786E\u7684\u8BCA\u65AD\uFF1B\u4EFB\u4F55\u7075\u6D3B\u5904\u7406\u4ECD\u987B\u9075\u5B88\u8BC1\u636E\u8FB9\u754C\u3002

## \u672C\u6B21\u914D\u7F6E
- \u8303\u56F4\uFF1A${scope}
- \u76EE\u6807\u8BFB\u8005\uFF1A${audience}
- \u6DF1\u5EA6\uFF1A${depth}
- \u7EF4\u5EA6\uFF1A${dimensions}
- \u5904\u7406\uFF1A${DIAGNOSIS_ACTIONS[repair ? "repair" : "report"].zh}
- \u5F15\u6587\u5019\u9009\uFF1A${browse ? "\u8054\u7F51\u6838\u67E5\u9AD8\u7F6E\u4FE1\u5EA6\u7F3A\u53E3\uFF0C\u7ED9\u51FA\u771F\u5B9E\u6765\u6E90\u4E0E\u53EF\u7528 BibTeX\uFF1B\u4E0D\u81EA\u52A8\u63D2\u5165" : "\u53EA\u5B9A\u4F4D\u5199\u4F5C\u5C42\u9762\u7684\u7F3A\u5F15\u6587\u4F4D\u7F6E"}
- \u4FDD\u62A4\u597D\u8868\u8FBE\uFF1A${preserve ? "\u662F" : "\u4E0D\u5355\u72EC\u6807\u8BB0"}
- Caption \u5EFA\u8BAE\uFF1A${captionGuidance} \u4EC5\u5728\u5B89\u5168\u4FEE\u590D\u786E\u9700\u6539\u5199 Caption \u65F6\u91C7\u7528\uFF0C\u4E0D\u80FD\u636E\u6B64\u5355\u72EC\u5224\u9519\u3002
- \u8865\u5145\u5173\u6CE8\uFF1A${custom}

\u5148\u5728\u5185\u90E8\u5EFA\u7ACB\u5168\u6587\u4E3B\u7EBF\u548C section-function map\uFF0C\u518D\u6309\u201C\u5168\u6587\u4E0E\u7AE0\u8282 \u2192 \u6BB5\u843D\u4E0E\u56FE\u8868 \u2192 \u53E5\u5B50\u4E0E\u516C\u5F0F\u201D\u4E09\u4E2A\u5C3A\u5EA6\u8BCA\u65AD\u3002\u5C0A\u91CD\u4E0D\u540C\u7AE0\u8282\u7684\u771F\u5B9E\u529F\u80FD\uFF1AAbstract \u8BB2\u5B8C\u6574\u6545\u4E8B\uFF1BIntroduction \u5EFA\u7ACB\u95EE\u9898\u3001\u52A8\u673A\u3001\u7F3A\u53E3\u3001\u65B9\u6848\u4E0E\u8D21\u732E\uFF1BRelated Work \u505A\u7EFC\u5408\u4E0E\u5B9A\u4F4D\uFF1BMethod \u89E3\u91CA\u8BBE\u8BA1\u903B\u8F91\uFF1BExperiments & Results \u7528\u8BC1\u636E\u5F62\u6210 finding\uFF1BDiscussion \u89E3\u91CA\u610F\u4E49\u800C\u4E0D\u662F\u91CD\u64AD\u7ED3\u679C\uFF1BConclusion \u4E0D\u5F15\u5165\u65B0\u8BC1\u636E\u3002

${dimensionInstructions}

\u4E0D\u8981\u7528\u5B57\u6570\u3001\u53E5\u957F\u6216 caption \u957F\u5EA6\u5355\u72EC\u5224\u9519\u3002\u5224\u65AD\u67D0\u6BB5\u6587\u5B57\u662F\u5426\u5360\u9519\u4F4D\u7F6E\u3001\u91CD\u590D\u5DF2\u6709\u8F7D\u4F53\u3001\u589E\u52A0\u8BFB\u8005\u8D1F\u62C5\u6216\u6CA1\u6709\u63A8\u8FDB\u8BBA\u8BC1\uFF1B\u533A\u5206\u5FC5\u8981\u56DE\u6263\u4E0E\u673A\u68B0\u91CD\u590D\u3002\u7F3A\u5F15\u6587\u53EA\u62A5\u544A\u9AD8\u7F6E\u4FE1\u5EA6\u4F4D\u7F6E\uFF0C\u672C\u6587\u81EA\u5DF1\u7684\u7ED3\u679C\u3001\u8D21\u732E\u6216\u57FA\u4E8E\u5DF2\u5448\u73B0\u8BC1\u636E\u7684\u603B\u7ED3\u4E0D\u5E94\u88AB\u8BEF\u5224\u4E3A\u5FC5\u987B\u5F15\u7528\u3002\u4E0D\u8981\u4E3A\u4E86\u663E\u5F97\u201C\u66F4\u5B66\u672F\u201D\u800C\u589E\u52A0\u672F\u8BED\u3001\u88AB\u52A8\u8BED\u6001\u3001we/our\u3001\u5192\u53F7\u6216\u6A21\u677F\u5316\u8FDE\u63A5\u8BCD\u3002

## \u8F93\u51FA
1. \u7528\u4E00\u6BB5\u8BDD\u7ED9\u51FA\u5168\u6587\u5199\u4F5C\u753B\u50CF\uFF0C\u5E76\u5217\u51FA\u6700\u5F71\u54CD\u9605\u8BFB\u7684 3\u20135 \u4E2A\u53CD\u590D\u4E60\u60EF\u3002
2. \u6309\u4E60\u60EF\u5F52\u5E76\u95EE\u9898\uFF0C\u800C\u4E0D\u662F\u9010\u53E5\u5806\u6E05\u5355\u3002\u6BCF\u9879\u7ED9\u51FA\u4E25\u91CD\u5EA6\u3001\u51FA\u73B0\u9891\u7387\u3001\u7CBE\u786E\u6587\u4EF6\u4E0E\u884C\u53F7\u3001\u6700\u77ED\u5FC5\u8981\u539F\u6587\u3001\u8BFB\u8005\u4E3A\u4F55\u53D7\u963B\u3001\u4FEE\u590D\u539F\u5219\u548C\u4E00\u4E2A\u4E0D\u8865\u9020\u4E8B\u5B9E\u7684\u5C40\u90E8\u793A\u4F8B\u3002\u6CA1\u6709\u95EE\u9898\u7684\u7EF4\u5EA6\u4E0D\u51D1\u6570\u3002
3. \u7ED9\u51FA section-function map\uFF0C\u8BF4\u660E\u5404\u7AE0\u8282\u5DF2\u7ECF\u5B8C\u6210\u7684\u529F\u80FD\u3001\u7F3A\u5931\u7684\u529F\u80FD\u548C\u4E0D\u5C5E\u4E8E\u8BE5\u7AE0\u8282\u7684\u5185\u5BB9\u3002
4. \u7ED9\u51FA\u6309\u6536\u76CA\u6392\u5E8F\u7684\u4FEE\u6539\u987A\u5E8F\u3002${preserve ? "\u53E6\u5217 3\u20135 \u4E2A\u5E94\u4FDD\u7559\u7684\u597D\u8868\u8FBE\u6216\u6709\u6548\u5199\u6CD5\u3002" : ""}
${browse ? "5. \u5BF9\u9AD8\u7F6E\u4FE1\u5EA6\u7F3A\u5F15\u6587\u4F4D\u7F6E\uFF0C\u5355\u72EC\u5217\u51FA\u7ECF\u8FC7\u5B98\u7F51\u3001\u51FA\u7248\u793E\u6216\u8BBA\u6587\u539F\u6587\u6838\u9A8C\u7684\u5019\u9009\u6765\u6E90\u3001\u5EFA\u8BAE\u652F\u6301\u7684 claim\u3001URL/DOI \u548C\u5B8C\u6574 BibTeX\uFF1B\u627E\u4E0D\u5230\u5C31\u660E\u786E\u4FDD\u7559\u7F3A\u53E3\u3002" : ""}

${repair ? "\u540C\u65F6\u4EA4\u4ED8 `writing_diagnosis.md`\u3001\u4FEE\u8BA2\u540E\u7684\u5B8C\u6574 `.tex` \u548C high-risk diff\u3002\u53EA\u4FEE\u590D\u62A5\u544A\u4E2D\u6709\u5145\u5206\u628A\u63E1\u7684\u5199\u4F5C\u95EE\u9898\uFF1B\u4FEE\u6539\u6700\u5C0F\u4F46\u5B8C\u6574\u7684\u8BED\u4E49\u5355\u5143\uFF0C\u4E0D\u5728\u6BB5\u672B\u8FFD\u52A0\u8865\u4E01\u53E5\u3002\u9664\u4FEE\u590D\u6240\u5FC5\u9700\u7684\u5C40\u90E8\u7EC4\u7EC7\u5916\uFF0C\u4E0D\u6539\u53D8\u79D1\u5B66 claim\u3001\u6570\u5B57\u3001\u5B9E\u9A8C\u3001\u516C\u5F0F\u5185\u5BB9\u3001\u5F15\u7528\u96C6\u5408\u3001\u56FE\u8868\u5185\u5BB9\u6216\u7AE0\u8282\u987A\u5E8F\uFF1B\u4E0D\u786E\u5B9A\u9879\u53EA\u62A5\u544A\u3002" : "\u53EA\u4EA4\u4ED8 `writing_diagnosis.md`\uFF0C\u4E0D\u8981\u4FEE\u6539\u8BBA\u6587\u6587\u4EF6\u3002"}`;
    }
    return `# Academic Writing Diagnosis

Read the main \`.tex\` in full and use the latest \`.pdf\` to assess the actual reading experience; use the \`.bib\` only to understand the existing citation boundary. Diagnose writing technique and recurring author habits. Do not assess idea novelty, experimental design, data consistency, BibTeX authenticity, venue formatting, plagiarism, or AI-generation probability.

Understand the writing goals behind these rules and use expert judgment to produce a more accurate diagnosis than mechanical checklist application, while remaining within the evidence boundary.

## Configuration
- Scope: ${scope}
- Intended readers: ${audience}
- Depth: ${depth}
- Dimensions: ${dimensions}
- Action: ${DIAGNOSIS_ACTIONS[repair ? "repair" : "report"].en}
- Citation candidates: ${browse ? "browse high-confidence gaps, verify authentic sources, return usable BibTeX, and never insert them silently" : "locate writing-level citation gaps only"}
- Preserve strong prose: ${preserve ? "yes" : "do not mark separately"}
- Caption guidance: ${captionGuidance} Apply it only when a safe repair genuinely rewrites a caption; never diagnose an error from this range alone.
- Additional focus: ${custom}

First build an internal central-argument and section-function map. Diagnose at three scales: manuscript and section, paragraph and display item, then sentence and equation. Respect section functions: the Abstract tells a complete story; the Introduction establishes problem, motivation, gap, solution, and contributions; Related Work synthesizes and positions; Method explains design logic; Experiments & Results turns evidence into findings; Discussion interprets rather than replays results; Conclusion introduces no new evidence.

${dimensionInstructions}

Do not declare an error from word count, sentence length, or caption length alone. Judge whether prose is misplaced, duplicates another information carrier, burdens the reader, or fails to advance the argument. Distinguish purposeful callbacks from mechanical repetition. Report only high-confidence citation gaps; this paper's own results, contributions, and evidence-grounded summaries do not automatically need citations. Never add terminology, passive voice, we/our, colons, or formulaic transitions merely to sound academic.

## Output
1. Give a one-paragraph writing profile and the 3\u20135 recurring habits with the greatest reader cost.
2. Group findings by habit rather than dumping sentence-level flags. For each, report severity, frequency, exact file and line, the shortest necessary excerpt, reader cost, repair principle, and one local example that invents no fact. Do not manufacture findings for clean dimensions.
3. Provide a section-function map showing fulfilled functions, missing functions, and content that belongs elsewhere.
4. Rank revisions by expected benefit. ${preserve ? "Also list 3\u20135 strong passages or effective techniques that should be preserved." : ""}
${browse ? "5. For high-confidence citation gaps, separately list sources verified against official pages, publisher records, or the original paper, the claim each source could support, URL/DOI, and complete BibTeX. Preserve the gap when no suitable source is verified." : ""}

${repair ? "Also deliver `writing_diagnosis.md`, a complete revised `.tex`, and a high-risk diff. Repair only well-supported writing problems from the report. Edit the smallest coherent semantic unit and never append patch sentences. Except for local organization required by the repair, do not change scientific claims, numbers, experiments, equation content, citation sets, display content, or section order. Report uncertain items without changing them." : "Deliver `writing_diagnosis.md` only and do not modify manuscript files."}`;
  }
};
function getDefaultWritingDiagnosisValues() {
  return Object.fromEntries(
    WRITING_DIAGNOSIS_WORKBENCH.controls.map((control) => [
      control.id,
      Array.isArray(control.defaultValue) ? [...control.defaultValue] : control.defaultValue
    ])
  );
}
function normalizeWritingDiagnosisValues(input = {}) {
  const values = getDefaultWritingDiagnosisValues();
  const controls = WRITING_DIAGNOSIS_WORKBENCH.controls;
  for (const control of controls) {
    const value = input[control.id];
    if (value === void 0) continue;
    if (control.kind === "toggle") {
      if (typeof value === "boolean") values[control.id] = value;
      continue;
    }
    if (control.kind === "range") {
      if (!Array.isArray(value) || value.length !== 2) continue;
      const left = Math.min(
        control.max,
        Math.max(control.min, Number(value[0]))
      );
      const right = Math.min(
        control.max,
        Math.max(control.min, Number(value[1]))
      );
      if (Number.isFinite(left) && Number.isFinite(right)) {
        values[control.id] = [
          Math.min(left, right),
          Math.max(left, right)
        ];
      }
      continue;
    }
    if (control.kind === "multi") {
      if (!Array.isArray(value)) continue;
      const allowed = new Set(
        control.options.map((option) => option.value)
      );
      const next = value.map(String).filter((item) => allowed.has(item));
      if (next.length >= (control.minSelected ?? 0)) {
        values[control.id] = next;
      }
      continue;
    }
    if (control.kind === "select" || control.kind === "segmented") {
      const next = String(value);
      if (control.options.some((option) => option.value === next)) {
        values[control.id] = next;
      }
      continue;
    }
    if (control.kind === "text" || control.kind === "textarea") {
      values[control.id] = String(value);
    }
  }
  if (!selected2(values, "dimensions").includes("citation-practice")) {
    values.browseCitations = false;
  }
  return values;
}
function buildWritingDiagnosisPrompt(input, language) {
  const values = normalizeWritingDiagnosisValues(input);
  return WRITING_DIAGNOSIS_WORKBENCH.buildPrompt(values, language);
}

// content/workflows/skillWorkflows.ts
var SKILL_WORKFLOW_VERSION = "2026.07.30";
var YANSHU_SKILL_CATALOG = [
  {
    id: "idea-discovery",
    index: "01",
    skillName: "Idea Discovery",
    websitePath: "/ideas/discovery",
    title: { zh: "\u67E5\u627E\u7814\u7A76 Idea", en: "Discover a research idea" },
    description: {
      zh: "\u914D\u7F6E\u65B9\u5411\u3001\u8FD1\u5E74\u6587\u732E\u3001\u6570\u636E\u548C\u8D44\u6E90\u8FB9\u754C\uFF0C\u81EA\u52A8\u68C0\u7D22\u3001\u53BB\u91CD\u5E76\u7ED9\u51FA\u6700\u5C0F\u9A8C\u8BC1\u5B9E\u9A8C\u3002",
      en: "Configure the field, recent literature, data, and resource limits, then search, deduplicate, and define a minimum decisive test."
    },
    command: {
      zh: "\u4F7F\u7528 $idea-discovery \u5728\u5F53\u524D\u5DE5\u4F5C\u533A\u67E5\u627E\u7814\u7A76 Idea\u3002",
      en: "Use $idea-discovery to find research ideas in the current workspace."
    },
    input: {
      zh: "\u65B9\u5411\u6216\u95EE\u9898\u7EBF\u7D22\uFF1B\u4E5F\u53EF\u4ECE\u7A7A\u767D\u5F00\u59CB",
      en: "A field or problem seed, or start from scratch"
    },
    output: {
      zh: "\u4E2D\u82F1\u6587 Idea Markdown",
      en: "Chinese and English idea Markdown"
    }
  },
  {
    id: "paper-drafting",
    index: "02",
    skillName: "Paper Drafting",
    websitePath: "/draft",
    title: { zh: "\u64B0\u5199\u8BBA\u6587\u521D\u7A3F", en: "Draft a complete paper" },
    description: {
      zh: "\u8BFB\u53D6\u5DF2\u5B8C\u6210\u7684\u5B9E\u9A8C\u3001\u4EE3\u7801\u3001\u56FE\u8868\u548C\u5F15\u7528\uFF0C\u751F\u6210\u53EF\u7F16\u8BD1\u3001\u53EF\u7EE7\u7EED\u4FEE\u6539\u7684 LaTeX \u521D\u7A3F\u3002",
      en: "Read completed experiments, code, figures, and references, then produce a compilable LaTeX draft that remains editable."
    },
    command: {
      zh: "\u4F7F\u7528 $paper-drafting \u6839\u636E\u8FD9\u4E2A\u5B9E\u9A8C\u76EE\u5F55\u64B0\u5199\u8BBA\u6587\u521D\u7A3F\u3002",
      en: "Use $paper-drafting to draft a paper from this experiment directory."
    },
    input: {
      zh: "\u5B9E\u9A8C\u76EE\u5F55\u3001\u7ED3\u679C\u3001\u4EE3\u7801\u3001\u56FE\u8868\u4E0E BibTeX",
      en: "Experiment directory, results, code, figures, and BibTeX"
    },
    output: {
      zh: "\u5B8C\u6574 LaTeX \u5DE5\u7A0B\u4E0E\u7F16\u8BD1 PDF",
      en: "Complete LaTeX project and compiled PDF"
    }
  },
  {
    id: "writing-diagnosis",
    index: "03",
    skillName: "Writing Diagnosis",
    websitePath: "/writing/diagnosis",
    title: { zh: "\u8BCA\u65AD\u5B66\u672F\u5199\u4F5C", en: "Diagnose academic writing" },
    description: {
      zh: "\u4ECE\u5168\u6587\u3001\u6BB5\u843D\u548C\u53E5\u5B50\u4E09\u4E2A\u5C3A\u5EA6\u53D1\u73B0\u53CD\u590D\u51FA\u73B0\u7684\u5199\u4F5C\u624B\u6CD5\u4E0E\u4E60\u60EF\u95EE\u9898\uFF0C\u5E76\u7ED9\u51FA\u5177\u4F53\u6307\u6B63\u3002",
      en: "Identify recurring writing-technique and habit problems at manuscript, paragraph, and sentence scale, then provide actionable guidance."
    },
    command: {
      zh: "\u4F7F\u7528 $writing-diagnosis \u8BCA\u65AD\u8FD9\u4E2A\u8BBA\u6587\u76EE\u5F55\u4E2D\u7684\u5B66\u672F\u5199\u4F5C\u95EE\u9898\u3002",
      en: "Use $writing-diagnosis to diagnose academic writing problems in this manuscript directory."
    },
    input: {
      zh: "\u4E3B\u7A3F TeX\u3001\u5EFA\u8BAE\u63D0\u4F9B PDF \u4E0E BibTeX",
      en: "Main TeX, with PDF and BibTeX recommended"
    },
    output: {
      zh: "\u5199\u4F5C\u8BCA\u65AD\u62A5\u544A\u4E0E\u53EF\u9009\u5B89\u5168\u4FEE\u8BA2\u7A3F",
      en: "Writing diagnosis report and optional safe revision"
    }
  },
  {
    id: "paper-reconstruction",
    index: "04",
    skillName: "Paper Reconstruction",
    websitePath: "/reconstruction",
    title: { zh: "\u91CD\u6784\u73B0\u6709\u8BBA\u6587", en: "Reconstruct an existing paper" },
    description: {
      zh: "\u901A\u8FC7\u53EF\u6062\u590D\u7684\u4E94\u8F6E\u5DE5\u4F5C\u6D41\u91CD\u6784\u79D1\u5B66\u5B9A\u4F4D\u3001\u7ED3\u6784\u3001\u65B9\u6CD5\u5B9E\u9A8C\u53D9\u4E8B\u548C\u65B9\u6CD5\u603B\u89C8\u56FE\u3002",
      en: "Use a resumable five-round workflow to rebuild positioning, structure, method and experiment narrative, and the method overview figure."
    },
    command: {
      zh: "\u4F7F\u7528 $paper-reconstruction \u91CD\u6784\u8FD9\u4E2A\u8BBA\u6587\u76EE\u5F55\u3002",
      en: "Use $paper-reconstruction to reconstruct this paper directory."
    },
    input: {
      zh: "TeX\u3001BibTeX\u3001PDF \u4E0E\u53EF\u9009 figures",
      en: "TeX, BibTeX, PDF, and optional figures"
    },
    output: {
      zh: "\u4E94\u8F6E\u7248\u672C\u3001\u6846\u67B6\u56FE\u4E0E\u6700\u7EC8\u53EF\u7F16\u8BD1\u8BBA\u6587",
      en: "Five versioned rounds, a framework figure, and the final compilable paper"
    }
  },
  {
    id: "scientific-figure",
    index: "05",
    skillName: "Scientific Figure",
    websitePath: "/figures",
    title: { zh: "\u7ED8\u5236\u79D1\u7814\u914D\u56FE", en: "Create a scientific figure" },
    description: {
      zh: "\u4ECE\u8BBA\u6587\u8BC1\u636E\u4E2D\u9009\u62E9\u4E00\u79CD\u56FE\u578B\uFF0C\u914D\u7F6E\u753B\u5E03\u3001\u914D\u8272\u548C\u6587\u5B57\u89C4\u5219\uFF0C\u53EA\u751F\u6210\u4E00\u5F20\u9AD8\u6E05\u79D1\u7814\u914D\u56FE\u3002",
      en: "Choose one figure role from the paper evidence, configure canvas, palette, and typography, and generate one high-resolution scientific figure."
    },
    command: {
      zh: "\u4F7F\u7528 $scientific-figure \u4E3A\u8FD9\u4E2A\u8BBA\u6587\u76EE\u5F55\u7ED8\u5236\u4E00\u5F20\u79D1\u7814\u914D\u56FE\u3002",
      en: "Use $scientific-figure to create one research figure for this paper directory."
    },
    input: {
      zh: "\u8BBA\u6587 TeX\u3001\u53EF\u9009 PDF\uFF0C\u4EE5\u53CA\u6309\u914D\u7F6E\u63D0\u4F9B\u7684\u53C2\u8003\u56FE",
      en: "Paper TeX, optional PDF, and a reference image only when configured"
    },
    output: {
      zh: "\u4E00\u5F20\u9AD8\u6E05 PNG \u4E0E\u914D\u7F6E\u5FEB\u7167",
      en: "One high-resolution PNG and its configuration snapshot"
    }
  },
  {
    id: "experimental-plotting",
    index: "06",
    skillName: "Experimental Plotting",
    websitePath: "/figures/plots",
    title: { zh: "\u7ED8\u5236\u5B9E\u9A8C\u56FE", en: "Create an experimental plot" },
    description: {
      zh: "\u4ECE\u771F\u5B9E\u5B9E\u9A8C\u6570\u636E\u751F\u6210\u7EDF\u8BA1\u8BED\u4E49\u6E05\u695A\u3001\u53EF\u590D\u73B0\u4E14\u7B26\u5408\u8BBA\u6587\u7248\u9762\u7684\u4EE3\u7801\u7ED8\u56FE\u3002",
      en: "Generate reproducible, statistically explicit publication plots from authentic experimental data."
    },
    command: {
      zh: "\u4F7F\u7528 $experimental-plotting \u6839\u636E\u8FD9\u4E2A\u5B9E\u9A8C\u76EE\u5F55\u7ED8\u5236\u8BBA\u6587\u5B9E\u9A8C\u56FE\u3002",
      en: "Use $experimental-plotting to create a paper plot from this experiment directory."
    },
    input: {
      zh: "\u539F\u59CB\u7ED3\u679C\u3001\u6307\u6807\u5B9A\u4E49\u3001\u7EDF\u8BA1\u534F\u8BAE\u4E0E\u8BBA\u6587\u4E0A\u4E0B\u6587",
      en: "Raw results, metric definitions, statistical protocol, and manuscript context"
    },
    output: {
      zh: "\u53EF\u590D\u73B0\u4EE3\u7801\u3001\u51FA\u7248\u7EA7\u56FE\u4EF6\u4E0E\u6D3E\u751F\u6570\u636E",
      en: "Reproducible code, publication assets, and derived data"
    }
  }
];
var CONFIGURATION_UI_COPY = {
  zh: {
    brand: "\u7814\u672F\u53F0 \xB7 YanShu",
    local: "\u672C\u5730\u914D\u7F6E",
    project: "\u5F53\u524D\u5DE5\u4F5C\u533A",
    reset: "\u6062\u590D\u9ED8\u8BA4",
    promptLanguage: "Prompt \u8BED\u8A00",
    promptTitle: "\u6267\u884C Prompt",
    promptHint: "\u53F3\u4FA7 Prompt \u4E0E\u5B98\u7F51\u4F7F\u7528\u540C\u4E00\u4EFD\u914D\u7F6E\u6E90\u3002",
    copy: "\u590D\u5236 Prompt",
    copied: "\u5DF2\u590D\u5236",
    exit: "\u9000\u51FA",
    start: "\u5168\u81EA\u52A8\u5F00\u59CB",
    starting: "\u6B63\u5728\u786E\u8BA4\u2026",
    ready: "\u786E\u8BA4\u540E YanShu \u5C06\u8FD4\u56DE Codex \u5E76\u76F4\u63A5\u6267\u884C\uFF1B\u4E0D\u4F1A\u518D\u6B21\u9010\u9879\u8BE2\u95EE\u914D\u7F6E\u3002",
    loading: "\u6B63\u5728\u8F7D\u5165\u5DE5\u4F5C\u6D41\u2026",
    loadFailed: "\u5DE5\u4F5C\u6D41\u8F7D\u5165\u5931\u8D25\u3002",
    submitFailed: "\u914D\u7F6E\u672A\u80FD\u63D0\u4EA4\uFF0C\u8BF7\u68C0\u67E5\u5F53\u524D\u8BBE\u7F6E\u3002",
    cancelled: "\u5DF2\u9000\u51FA\uFF1B\u6CA1\u6709\u521B\u5EFA\u8FD0\u884C\u76EE\u5F55\u6216\u53D1\u9001\u6750\u6599\u3002",
    confirmed: "\u914D\u7F6E\u5DF2\u786E\u8BA4\uFF0C\u53EF\u4EE5\u5173\u95ED\u6B64\u9875\u9762\u3002"
  },
  en: {
    brand: "YanShu Workbench",
    local: "Local configuration",
    project: "Current workspace",
    reset: "Reset",
    promptLanguage: "Prompt language",
    promptTitle: "Execution prompt",
    promptHint: "This prompt uses the same configuration source as the website.",
    copy: "Copy prompt",
    copied: "Copied",
    exit: "Exit",
    start: "Start full automation",
    starting: "Confirming\u2026",
    ready: "After confirmation, YanShu returns to Codex and runs directly without asking each setting again.",
    loading: "Loading workflow\u2026",
    loadFailed: "The workflow could not be loaded.",
    submitFailed: "The configuration could not be submitted. Review the current settings.",
    cancelled: "Exited without creating a run or sending materials.",
    confirmed: "Configuration confirmed. You may close this page."
  }
};
function localized(zh, en) {
  return { zh, en };
}
function choice(value, label, description) {
  return { value, label, description };
}
var ideaDefaults = getDefaultIdeaPreferences("discovery");
var IDEA_DISCOVERY_MODEL = {
  id: "idea-discovery",
  version: SKILL_WORKFLOW_VERSION,
  skillId: "idea-discovery",
  websitePath: "/ideas/discovery",
  title: localized("Idea \u67E5\u627E", "Idea Discovery"),
  eyebrow: "YANSHU \xB7 IDEA DISCOVERY",
  description: localized(
    "\u4ECE\u8FD1\u671F\u53EF\u4FE1\u6587\u732E\u3001\u771F\u5B9E\u6570\u636E\u6761\u4EF6\u548C\u8D44\u6E90\u8FB9\u754C\u4E2D\u53D1\u73B0\u53EF\u9A8C\u8BC1\u7684\u7814\u7A76\u673A\u4F1A\u3002",
    "Find verifiable research opportunities from recent trustworthy literature, real data conditions, and resource limits."
  ),
  materialTitle: localized("\u53EF\u9009\u6750\u6599", "Optional materials"),
  materialItems: {
    zh: ["\u95EE\u9898\u7EBF\u7D22", "\u76F8\u5173\u8BBA\u6587", "\u6570\u636E\u96C6\u8BF4\u660E"],
    en: ["Problem seed", "Related papers", "Dataset notes"]
  },
  materialHint: localized(
    "\u6CA1\u6709\u73B0\u6210\u6750\u6599\u4E5F\u53EF\u4EE5\u5F00\u59CB\uFF1B\u6267\u884C\u65F6\u4F1A\u8054\u7F51\u68C0\u7D22\u5E76\u62A5\u544A\u641C\u7D22\u8986\u76D6\u8303\u56F4\u3002",
    "You may start without attachments; execution searches the web and reports its coverage."
  ),
  output: localized(
    "\u751F\u6210\u8BED\u4E49\u4E00\u81F4\u7684\u4E2D\u6587\u4E0E\u82F1\u6587 Markdown\uFF0C\u4E0D\u751F\u6210 TeX\u3002",
    "Create semantically aligned Chinese and English Markdown files, not TeX."
  ),
  sections: [
    {
      id: "scope",
      index: "01",
      title: localized("\u7814\u7A76\u8303\u56F4", "Research scope"),
      description: localized(
        "\u7ED9\u51FA\u65B9\u5411\u6216\u95EE\u9898\u7EBF\u7D22\uFF1B\u7559\u7A7A\u65F6\u4ECE\u6240\u9009\u65B9\u5411\u5F00\u59CB\u3002",
        "Provide a field or problem seed, or start from the selected field."
      )
    },
    {
      id: "evidence",
      index: "02",
      title: localized("\u6587\u732E\u4E0E\u6570\u636E", "Literature and data"),
      description: localized(
        "\u9650\u5B9A\u65F6\u95F4\u7A97\u3001\u4E3B\u8981 venue \u4E0E\u53EF\u7528\u6570\u636E\u3002",
        "Set the time window, major venues, and available data."
      )
    },
    {
      id: "decision",
      index: "03",
      title: localized("\u751F\u6210\u4E0E\u5224\u65AD", "Generation and judgment"),
      description: localized(
        "\u63A7\u5236\u5019\u9009\u6570\u91CF\u3001\u63A2\u7D22\u5E45\u5EA6\u548C\u73B0\u5B9E\u8D44\u6E90\u8FB9\u754C\u3002",
        "Control candidate count, exploration posture, and practical resource limits."
      )
    },
    {
      id: "writing",
      index: "02",
      title: localized("\u5199\u4F5C\u5EFA\u8BAE", "Writing guidance"),
      description: localized(
        "\u63A7\u5236 Caption \u7684\u5EFA\u8BAE\u957F\u5EA6\uFF1B\u8BE5\u8303\u56F4\u4E0D\u662F\u786C\u6027\u9A8C\u6536\u6761\u4EF6\u3002",
        "Configure advisory caption length; the range is never a hard acceptance condition."
      )
    }
  ],
  fields: [
    {
      id: "directionId",
      sectionId: "scope",
      type: "select",
      label: localized("\u65B9\u5411", "Direction"),
      choices: IDEA_DIRECTION_IDS.map(
        (id) => choice(id, IDEA_DIRECTIONS[id].label)
      )
    },
    {
      id: "focus",
      sectionId: "scope",
      type: "text",
      label: localized("\u5177\u4F53\u65B9\u5411\u6216\u95EE\u9898", "Specific focus or problem"),
      placeholder: localized(
        "\u4F8B\u5982\uFF1A\u68C0\u7D22\u589E\u5F3A\u751F\u6210\u4E2D\u7684\u957F\u671F\u77E5\u8BC6\u66F4\u65B0",
        "e.g. continual knowledge updates in retrieval-augmented generation"
      )
    },
    {
      id: "seed",
      sectionId: "scope",
      type: "textarea",
      label: localized("\u95EE\u9898\u7EBF\u7D22", "Problem seed"),
      placeholder: localized(
        "\u53EF\u4EE5\u7559\u7A7A\uFF0C\u8BA9\u6A21\u578B\u4ECE\u65B9\u5411\u4E0E\u8FD1\u671F\u6587\u732E\u5F00\u59CB\u68C0\u7D22\u3002",
        "Leave blank to start from the field and recent literature."
      )
    },
    {
      id: "recentYears",
      sectionId: "evidence",
      type: "number",
      label: localized("\u91CD\u70B9\u68C0\u7D22\u8FD1 N \u5E74", "Prioritize the recent N years"),
      min: 1,
      max: 20,
      step: 1
    },
    {
      id: "topConferences",
      sectionId: "evidence",
      type: "boolean",
      label: localized("\u4F18\u5148\u9876\u4F1A", "Prioritize top conferences"),
      description: localized(
        "\u9ED8\u8BA4\u5F00\u542F\uFF0C\u5E76\u8981\u6C42\u8BF4\u660E\u5F53\u524D\u5B50\u9886\u57DF\u7684 venue \u9009\u62E9\u4F9D\u636E\u3002",
        "Enabled by default; explain the venue choices for the subfield."
      )
    },
    {
      id: "topJournals",
      sectionId: "evidence",
      type: "boolean",
      label: localized("\u540C\u65F6\u68C0\u7D22\u9876\u520A", "Also search top journals")
    },
    {
      id: "customVenues",
      sectionId: "evidence",
      type: "text",
      label: localized("\u6307\u5B9A venue\uFF08\u53EF\u9009\uFF09", "Named venues (optional)"),
      placeholder: localized("\u4F8B\u5982\uFF1AACL, EMNLP, TACL", "e.g. ACL, EMNLP, TACL")
    },
    {
      id: "dataset",
      sectionId: "evidence",
      type: "text",
      label: localized("\u6570\u636E\u96C6\u6216\u6570\u636E\u6761\u4EF6\uFF08\u53EF\u9009\uFF09", "Dataset or data condition (optional)"),
      placeholder: localized(
        "\u516C\u5F00\u6570\u636E\u96C6\u3001\u79C1\u6709\u6570\u636E\u6761\u4EF6\uFF0C\u6216\u8BA9\u6A21\u578B\u6839\u636E\u8BC1\u636E\u63A8\u8350",
        "A public dataset, a private-data condition, or ask for evidence-based recommendations"
      )
    },
    {
      id: "ideaCount",
      sectionId: "decision",
      type: "choice",
      label: localized("\u5019\u9009 Idea \u6570\u91CF", "Candidate idea count"),
      choices: IDEA_COUNT_OPTIONS.map(
        (count) => choice(count, localized(`${count} \u4E2A`, `${count}`))
      )
    },
    {
      id: "noveltyPosture",
      sectionId: "decision",
      type: "choice",
      label: localized("\u63A2\u7D22\u5E45\u5EA6", "Exploration posture"),
      choices: NOVELTY_POSTURE_IDS.map(
        (id) => choice(id, NOVELTY_POSTURES[id].label)
      )
    },
    {
      id: "pursueSota",
      sectionId: "decision",
      type: "boolean",
      label: localized("\u628A SOTA \u4F5C\u4E3A\u5FC5\u8981\u76EE\u6807", "Require a SOTA target"),
      description: localized(
        "\u5173\u95ED\u65F6\u4ECD\u8981\u6C42\u6E05\u695A\u8D21\u732E\uFF0C\u4F46\u4E0D\u628A\u6392\u884C\u699C\u63D0\u5347\u5F53\u4F5C\u552F\u4E00\u4EF7\u503C\u3002",
        "When off, require a clear contribution without treating leaderboard gains as the only value."
      )
    },
    {
      id: "resourceConstraints",
      sectionId: "decision",
      type: "textarea",
      label: localized("\u8D44\u6E90\u4E0E\u6267\u884C\u8FB9\u754C\uFF08\u53EF\u9009\uFF09", "Resources and execution limits (optional)"),
      placeholder: localized(
        "\u4F8B\u5982\uFF1A\u5355\u5F20 24GB GPU\u30018 \u5468\u3001\u4E0D\u80FD\u91C7\u96C6\u65B0\u6570\u636E",
        "e.g. one 24GB GPU, eight weeks, no new data collection"
      )
    },
    {
      id: "additionalCriteria",
      sectionId: "decision",
      type: "textarea",
      label: localized("\u8865\u5145\u7EA6\u675F\uFF08\u53EF\u9009\uFF09", "Additional constraints (optional)")
    }
  ],
  defaults: { ...ideaDefaults }
};
var PAPER_DRAFTING_MODEL = {
  id: "paper-drafting",
  version: SKILL_WORKFLOW_VERSION,
  skillId: "paper-drafting",
  websitePath: "/draft",
  title: localized("\u8BBA\u6587\u521D\u7A3F", "Paper Drafting"),
  eyebrow: "YANSHU \xB7 PAPER DRAFTING",
  description: localized(
    "\u628A\u5DF2\u5B8C\u6210\u7684\u5B9E\u9A8C\u3001\u65B9\u6CD5\u3001\u56FE\u8868\u548C\u771F\u5B9E\u5F15\u7528\u8F6C\u5316\u4E3A\u5B8C\u6574\u3001\u53EF\u7F16\u8BD1\u7684\u82F1\u6587 LaTeX \u521D\u7A3F\u3002",
    "Turn completed experiments, methods, figures, and authentic references into a complete, compilable English LaTeX draft."
  ),
  materialTitle: localized("\u9700\u8981\u6750\u6599", "Required materials"),
  materialItems: {
    zh: ["\u5B9E\u9A8C\u7ED3\u679C\u4E0E\u4EE3\u7801", "\u65B9\u6CD5\u8BF4\u660E\u4E0E\u56FE\u8868", "\u771F\u5B9E BibTeX \u6216\u6587\u732E\u6E05\u5355"],
    en: ["Experimental results and code", "Method notes and figures", "Authentic BibTeX or reference list"]
  },
  materialHint: localized(
    "YanShu \u53EA\u4ECE\u786E\u8BA4\u7684\u5DE5\u4F5C\u533A\u9009\u62E9\u6750\u6599\uFF1B\u8BC1\u636E\u4E0D\u8DB3\u5904\u4FDD\u7559\u7CBE\u786E TODO\uFF0C\u4E0D\u8865\u9020\u7ED3\u679C\u3002",
    "YanShu selects materials only from the confirmed workspace and leaves precise TODOs instead of inventing missing evidence."
  ),
  output: localized(
    "\u5B8C\u6574 LaTeX \u5DE5\u7A0B\u3001\u6A21\u677F\u6765\u6E90\u8BB0\u5F55\u3001\u7F16\u8BD1 PDF \u4E0E\u538B\u7F29\u5305\u3002",
    "A complete LaTeX project, template provenance, compiled PDF, and archive."
  ),
  sections: [
    {
      id: "template",
      index: "01",
      title: localized("\u76EE\u6807\u6A21\u677F", "Target template"),
      description: localized(
        "arXiv \u4F7F\u7528\u6307\u5B9A\u5F00\u6E90\u6837\u5F0F\uFF1B\u4F1A\u8BAE\u6A21\u677F\u5728\u6267\u884C\u65F6\u4ECE\u5F53\u5C4A\u5B98\u7F51\u6838\u9A8C\u3002",
        "Use the specified open-source arXiv style or verify the current official conference template during execution."
      )
    }
  ],
  fields: [
    {
      id: "templateId",
      sectionId: "template",
      type: "select",
      label: localized("\u6A21\u677F", "Template"),
      choices: DRAFT_TEMPLATE_IDS.map(
        (id) => choice(id, localized(DRAFT_TEMPLATES[id].label, DRAFT_TEMPLATES[id].label))
      )
    },
    {
      id: "customVenue",
      sectionId: "template",
      type: "text",
      label: localized("\u4F1A\u8BAE\u540D\u79F0", "Venue name"),
      placeholder: localized("\u4F8B\u5982\uFF1ASIGIR", "e.g. SIGIR"),
      visibleWhen: { fieldId: "templateId", equals: "custom" }
    },
    {
      id: "captionWordRange",
      sectionId: "writing",
      type: "range",
      label: localized("Caption \u5EFA\u8BAE\u957F\u5EA6", "Suggested caption length"),
      description: localized(
        "\u9ED8\u8BA4 10\u201340 words\uFF1B\u4E3A\u4FDD\u8BC1\u81EA\u5305\u542B\u6027\uFF0C\u5FC5\u8981\u65F6\u5141\u8BB8\u8D85\u51FA\u3002",
        "Defaults to 10\u201340 words and may be exceeded when self-containment requires it."
      ),
      min: CAPTION_LENGTH_POLICY.min,
      max: CAPTION_LENGTH_POLICY.max,
      step: CAPTION_LENGTH_POLICY.step
    }
  ],
  defaults: {
    templateId: DEFAULT_DRAFT_TEMPLATE_ID,
    customVenue: "",
    captionWordRange: CAPTION_LENGTH_POLICY.defaultRange
  }
};
var figureDefaults = { ...DEFAULT_FIGURE_PREFERENCES };
var SCIENTIFIC_FIGURE_MODEL = {
  id: "scientific-figure",
  version: SKILL_WORKFLOW_VERSION,
  skillId: "scientific-figure",
  websitePath: "/figures",
  title: localized("\u79D1\u7814\u914D\u56FE", "Scientific Figure"),
  eyebrow: "YANSHU \xB7 SCIENTIFIC FIGURE",
  description: localized(
    "\u5148\u7406\u89E3\u8BBA\u6587\u4E0E\u540C\u7C7B\u8BBA\u6587\u56FE\u7247\uFF0C\u518D\u6309\u7167\u5F53\u524D\u56FE\u578B\u548C\u89C6\u89C9\u914D\u7F6E\u751F\u6210\u4E00\u5F20\u9AD8\u6E05\u79D1\u7814\u914D\u56FE\u3002",
    "Understand the paper and comparable published figures, then generate one high-resolution scientific figure from the selected role and visual settings."
  ),
  materialTitle: localized("\u9700\u8981\u6750\u6599", "Required materials"),
  materialItems: {
    zh: ["\u8BBA\u6587\u4E3B TeX", "\u53EF\u9009\u7F16\u8BD1 PDF", "\u5F00\u542F\u201C\u63D0\u4F9B\u53C2\u8003\u56FE\u201D\u540E\u624D\u9700\u8981\u56FE\u7247"],
    en: ["Main paper TeX", "Optional compiled PDF", "An image only when \u201CReference supplied\u201D is enabled"]
  },
  materialHint: localized(
    "\u53C2\u8003\u56FE\u9ED8\u8BA4\u5173\u95ED\u3002\u5F00\u542F\u540E\uFF0C\u666E\u901A\u56FE\u7247\u53EA\u7528\u4E8E\u89C6\u89C9\u6837\u5F0F\uFF1B\u660E\u786E\u6807\u6CE8\u4E3A\u201C\u7ED8\u56FE\u8349\u7A3F\u201D\u65F6\u624D\u53EF\u628A\u7ED3\u6784\u4F5C\u4E3A\u7EBF\u7D22\uFF0C\u5E76\u987B\u7528\u8BBA\u6587\u6838\u9A8C\u3002",
    "Reference images are off by default. When enabled, ordinary images supply visual style only; structure becomes a cue only for an explicitly labeled figure draft verified against the paper."
  ),
  output: localized(
    "\u53EA\u751F\u6210\u4E00\u5F20\u9AD8\u6E05 PNG\uFF0C\u5E76\u4FDD\u5B58\u914D\u7F6E\u4E0E\u6700\u7EC8\u82F1\u6587\u751F\u56FE Prompt\u3002",
    "Generate one high-resolution PNG and save its configuration and final English image prompt."
  ),
  sections: [
    {
      id: "purpose",
      index: "01",
      title: localized("\u56FE\u7684\u804C\u8D23", "Figure role"),
      description: localized(
        "\u4E00\u6B21\u53EA\u5B8C\u6210\u4E00\u79CD\u56FE\u578B\uFF0C\u9ED8\u8BA4\u65B9\u6CD5\u603B\u89C8\u56FE\u3002",
        "Complete one figure role at a time; Method Overview is the default."
      )
    },
    {
      id: "canvas",
      index: "02",
      title: localized("\u753B\u5E03\u4E0E\u6267\u884C", "Canvas and execution"),
      description: localized(
        "\u9009\u62E9\u6BD4\u4F8B\u4EE5\u53CA\u76F4\u63A5\u7ED8\u56FE\u6216\u5148\u67E5\u770B\u82F1\u6587\u751F\u56FE Prompt\u3002",
        "Choose the canvas ratio and whether to draw directly or review the English image prompt first."
      )
    },
    {
      id: "visual",
      index: "03",
      title: localized("\u89C6\u89C9\u7EA6\u675F", "Visual controls"),
      description: localized(
        "\u63A7\u5236\u79D1\u7814\u914D\u8272\u3001\u5B57\u4F53\u3001\u7EBF\u6761\u3001\u5F3A\u8C03\u8272\u8303\u56F4\u4E0E\u5BB9\u5668\u5E95\u8272\u3002",
        "Control the research palette, typeface, lines, accent range, and container fills."
      )
    }
  ],
  fields: [
    {
      id: "promptId",
      sectionId: "purpose",
      type: "select",
      label: localized("\u56FE\u578B", "Figure type"),
      choices: FIGURE_PROMPT_ORDER.map(
        (id) => choice(id, FIGURE_PROMPTS[id].label, FIGURE_PROMPTS[id].purpose)
      )
    },
    {
      id: "executionMode",
      sectionId: "canvas",
      type: "choice",
      label: localized("\u6267\u884C\u65B9\u5F0F", "Execution"),
      choices: [
        choice(
          "direct",
          localized("\u76F4\u63A5\u7ED8\u56FE", "Draw directly"),
          localized(
            "\u5145\u5206\u63A8\u6572\u8BBA\u6587\u5185\u5BB9\u3001\u6784\u56FE\u4E0E\u89C6\u89C9\u7EC6\u8282\u540E\u76F4\u63A5\u751F\u6210\u56FE\u7247\u3002",
            "Generate the image directly after carefully considering the paper, composition, and visual details."
          )
        ),
        choice(
          "prompt-first",
          localized("\u5148\u770B\u82F1\u6587 Prompt", "Review prompt first"),
          localized(
            "\u5148\u5C55\u793A\u82F1\u6587\u751F\u56FE Prompt\uFF0C\u7B49\u5F85\u201C\u5F00\u59CB\u7ED8\u56FE\u201D\u3002",
            "Show the English image prompt and wait for \u201CStart drawing\u201D."
          )
        )
      ]
    },
    {
      id: "hasReferenceImage",
      sectionId: "canvas",
      type: "boolean",
      label: localized("\u662F\u5426\u63D0\u4F9B\u53C2\u8003\u56FE", "Reference image"),
      description: localized(
        "\u9ED8\u8BA4\u5173\u95ED\uFF1B\u5F00\u542F\u540E\u624D\u628A\u53C2\u8003\u56FE\u89C4\u5219\u5199\u5165 Prompt \u5E76\u7EB3\u5165\u6750\u6599\u3002",
        "Off by default; enable it to add reference-image guidance to the prompt and materials."
      )
    },
    {
      id: "aspectRatioId",
      sectionId: "canvas",
      type: "select",
      label: localized("\u753B\u5E03\u6BD4\u4F8B", "Canvas ratio"),
      choices: FIGURE_ASPECT_RATIO_IDS.map(
        (id) => choice(
          id,
          FIGURE_ASPECT_RATIOS[id].label,
          FIGURE_ASPECT_RATIOS[id].shortDescription
        )
      )
    },
    {
      id: "customAspectWidth",
      sectionId: "canvas",
      type: "number",
      label: localized("\u81EA\u5B9A\u4E49\u5BBD", "Custom width"),
      min: 1,
      max: 100,
      step: 1,
      visibleWhen: { fieldId: "aspectRatioId", equals: "custom" }
    },
    {
      id: "customAspectHeight",
      sectionId: "canvas",
      type: "number",
      label: localized("\u81EA\u5B9A\u4E49\u9AD8", "Custom height"),
      min: 1,
      max: 100,
      step: 1,
      visibleWhen: { fieldId: "aspectRatioId", equals: "custom" }
    },
    {
      id: "paletteId",
      sectionId: "visual",
      type: "select",
      label: localized("\u8272\u7CFB", "Color palette"),
      choices: FIGURE_COLOR_PALETTE_IDS.map(
        (id) => choice(id, FIGURE_COLOR_PALETTES[id].label)
      )
    },
    {
      id: "fontFamilyId",
      sectionId: "visual",
      type: "select",
      label: localized("\u5168\u56FE\u5B57\u4F53", "Global typeface"),
      choices: FIGURE_FONT_FAMILY_IDS.map(
        (id) => choice(
          id,
          localized(
            FIGURE_FONT_FAMILIES[id].label,
            FIGURE_FONT_FAMILIES[id].label
          )
        )
      )
    },
    {
      id: "lineColorMode",
      sectionId: "visual",
      type: "choice",
      label: localized("\u7EBF\u6761\u989C\u8272", "Line colors"),
      choices: [
        choice("neutral", localized("\u7EDF\u4E00\u6DF1\u8272", "One dark color")),
        choice("semantic", localized("\u6309\u8BED\u4E49\u533A\u5206", "Semantic colors"))
      ]
    },
    {
      id: "accentColorMin",
      sectionId: "visual",
      type: "number",
      label: localized("\u5F3A\u8C03\u8272\u6700\u5C11", "Minimum accents"),
      min: 1,
      max: 4,
      step: 1
    },
    {
      id: "accentColorMax",
      sectionId: "visual",
      type: "number",
      label: localized("\u5F3A\u8C03\u8272\u6700\u591A", "Maximum accents"),
      min: 1,
      max: 4,
      step: 1
    },
    {
      id: "allowLightIllustrations",
      sectionId: "visual",
      type: "boolean",
      label: localized("\u5141\u8BB8\u8BBA\u6587\u5BF9\u8C61\u56FE\u5F62", "Allow paper-specific forms"),
      description: localized(
        "\u5141\u8BB8\u4E0E\u8BBA\u6587\u5BF9\u8C61\u76F4\u63A5\u5BF9\u5E94\u7684\u7B80\u5316\u79D1\u5B66\u56FE\u5F62\uFF0C\u4E0D\u4F7F\u7528\u8425\u9500\u63D2\u753B\u3002",
        "Allow simplified scientific forms tied directly to the paper, not marketing illustration."
      )
    },
    {
      id: "cardFillPolicyId",
      sectionId: "visual",
      type: "select",
      label: localized("\u5BB9\u5668\u5361\u7247\u5E95\u8272", "Container fills"),
      choices: FIGURE_CARD_FILL_POLICY_IDS.map(
        (id) => choice(
          id,
          FIGURE_CARD_FILL_POLICIES[id].label,
          FIGURE_CARD_FILL_POLICIES[id].shortDescription
        )
      )
    },
    {
      id: "fontSizeLevels",
      sectionId: "visual",
      type: "choice",
      label: localized("\u5B57\u53F7\u5C42\u7EA7", "Type-size levels"),
      choices: [
        choice(2, localized("2 \u7EA7", "2 levels")),
        choice(3, localized("3 \u7EA7", "3 levels"))
      ]
    },
    {
      id: "includeLargeTitle",
      sectionId: "visual",
      type: "boolean",
      label: localized("\u56FE\u5185\u5927\u6807\u9898", "Large in-figure title")
    }
  ],
  defaults: { ...figureDefaults }
};
var EXPERIMENTAL_PLOT_SECTIONS = [
  {
    id: "question",
    index: "01",
    title: localized("\u6570\u636E\u4E0E\u95EE\u9898", "Data and question"),
    description: localized(
      "\u4ECE\u771F\u5B9E\u6570\u636E\u72B6\u6001\u548C\u79D1\u5B66\u95EE\u9898\u51FA\u53D1\u9009\u62E9\u56FE\u578B\u3002",
      "Choose the visual form from the scientific question and actual data state."
    )
  },
  {
    id: "statistics",
    index: "02",
    title: localized("\u7EDF\u8BA1\u8BED\u4E49", "Statistical semantics"),
    description: localized(
      "\u660E\u786E\u91CD\u590D\u5355\u4F4D\u3001\u4E0D\u786E\u5B9A\u6027\u3001\u6548\u5E94\u91CF\u548C\u68C0\u9A8C\u3002",
      "Define replicate units, uncertainty, effect sizes, and tests."
    )
  },
  {
    id: "visual",
    index: "03",
    title: localized("\u56FE\u578B\u4E0E\u7248\u9762", "Chart and layout"),
    description: localized(
      "\u63A7\u5236\u7EC4\u5408\u56FE\u3001\u5B50\u56FE\u6570\u91CF\u3001\u680F\u5BBD\u4E0E\u7CBE\u786E\u914D\u8272\u3002",
      "Control composites, subpanel count, publication width, and exact colors."
    )
  },
  {
    id: "delivery",
    index: "04",
    title: localized("\u4EA4\u4ED8", "Delivery"),
    description: localized(
      "\u9009\u62E9\u4EE3\u7801\u3001\u56FE\u7247\u4E0E\u6D3E\u751F\u6570\u636E\u4EA7\u7269\u3002",
      "Select code, image, and derived-data artifacts."
    )
  }
];
var EXPERIMENTAL_PLOT_FIELD_SECTIONS = {
  plotGoal: "question",
  dataState: "question",
  encourageAdvancedCharts: "question",
  uncertainty: "statistics",
  statistics: "statistics",
  multiplicity: "statistics",
  allowComposite: "visual",
  panelCount: "visual",
  panels: "visual",
  width: "visual",
  palette: "visual",
  outputs: "delivery",
  custom: "delivery"
};
function configurableWorkbenchField(control, sectionId) {
  const base = {
    id: control.id,
    sectionId,
    label: control.label,
    description: control.description
  };
  if (control.kind === "toggle") {
    return { ...base, type: "boolean" };
  }
  if (control.kind === "number") {
    return {
      ...base,
      type: "number",
      min: control.min,
      max: control.max,
      step: control.step
    };
  }
  if (control.kind === "range") {
    return {
      ...base,
      type: "range",
      min: control.min,
      max: control.max,
      step: control.step
    };
  }
  if (control.kind === "multi") {
    return {
      ...base,
      type: "multi",
      minSelected: control.minSelected,
      choices: control.options.map(
        (option) => choice(option.value, option.label, option.description)
      )
    };
  }
  if (control.kind === "select" || control.kind === "segmented") {
    return {
      ...base,
      type: control.kind === "segmented" ? "choice" : "select",
      choices: control.options.map(
        (option) => choice(option.value, option.label, option.description)
      )
    };
  }
  if (control.kind === "text" || control.kind === "textarea") {
    return {
      ...base,
      type: control.kind,
      placeholder: control.placeholder
    };
  }
  throw new Error(`Unsupported configurable workflow field: ${control.id}`);
}
function experimentalPlotWorkflowField(control) {
  return configurableWorkbenchField(
    control,
    EXPERIMENTAL_PLOT_FIELD_SECTIONS[control.id] ?? "delivery"
  );
}
var EXPERIMENTAL_PLOTTING_MODEL = {
  id: "experimental-plotting",
  version: SKILL_WORKFLOW_VERSION,
  skillId: "experimental-plotting",
  websitePath: "/figures/plots",
  title: localized("\u5B9E\u9A8C\u7ED8\u56FE", "Experimental Plotting"),
  eyebrow: "YANSHU \xB7 EXPERIMENTAL PLOTTING",
  description: localized(
    "\u628A\u771F\u5B9E\u5B9E\u9A8C\u6570\u636E\u8F6C\u5316\u4E3A\u7EDF\u8BA1\u900F\u660E\u3001\u4EE3\u7801\u53EF\u590D\u73B0\u7684\u51FA\u7248\u7EA7\u8BBA\u6587\u56FE\u3002",
    "Turn authentic experimental data into statistically transparent, code-reproducible publication plots."
  ),
  materialTitle: localized("\u9700\u8981\u6750\u6599", "Required materials"),
  materialItems: {
    zh: ["CSV / Excel / JSON \u6216\u7EDF\u8BA1\u7ED3\u679C", "\u6307\u6807\u5B9A\u4E49\u4E0E\u5B9E\u9A8C\u534F\u8BAE", "\u8BBA\u6587\u4E0A\u4E0B\u6587\u6216\u76EE\u6807\u6A21\u677F"],
    en: ["CSV, Excel, JSON, or statistical outputs", "Metric definitions and experimental protocol", "Manuscript context or target template"]
  },
  materialHint: localized(
    "\u4F18\u5148\u63D0\u4F9B\u9010\u6B21\u5B9E\u9A8C\u6570\u636E\uFF1B\u53EA\u6709\u6C47\u603B\u503C\u65F6\u540C\u65F6\u63D0\u4F9B\u6837\u672C\u91CF\u4E0E\u8BEF\u5DEE\u5B9A\u4E49\u3002",
    "Prefer run-level data. When only summaries exist, include sample sizes and error definitions."
  ),
  output: localized(
    "\u53EF\u590D\u73B0\u7ED8\u56FE\u4EE3\u7801\u3001\u6240\u9009\u51FA\u7248\u7EA7\u56FE\u4EF6\u3001caption \u4E0E\u5FC5\u8981\u6D3E\u751F\u6570\u636E\u3002",
    "Reproducible plotting code, selected publication assets, a caption, and required derived data."
  ),
  sections: EXPERIMENTAL_PLOT_SECTIONS,
  fields: EXPERIMENTAL_PLOTS_WORKBENCH.controls.map(
    experimentalPlotWorkflowField
  ),
  defaults: {
    ...getDefaultExperimentalPlotValues()
  }
};
var WRITING_DIAGNOSIS_SECTIONS = [
  {
    id: "scope",
    index: "01",
    title: localized("\u6750\u6599\u4E0E\u8303\u56F4", "Materials and scope"),
    description: localized(
      "\u9009\u62E9\u5168\u6587\u6216\u9700\u8981\u8BCA\u65AD\u7684\u5177\u4F53\u7AE0\u8282\u4E0E\u6587\u5B57\u8F7D\u4F53\u3002",
      "Choose the whole manuscript or specific sections and text carriers."
    )
  },
  {
    id: "reader",
    index: "02",
    title: localized("\u8BFB\u8005\u4E0E\u6DF1\u5EA6", "Readers and depth"),
    description: localized(
      "\u6839\u636E\u76EE\u6807\u8BFB\u8005\u63A7\u5236\u672F\u8BED\u8D1F\u62C5\u548C\u8BCA\u65AD\u9897\u7C92\u5EA6\u3002",
      "Set terminology burden and diagnostic granularity for the intended readers."
    )
  },
  {
    id: "dimensions",
    index: "03",
    title: localized("\u8BCA\u65AD\u7EF4\u5EA6", "Diagnostic dimensions"),
    description: localized(
      "\u7EC4\u5408\u68C0\u67E5\u53D9\u4E8B\u3001\u5F15\u7528\u3001\u6BB5\u843D\u3001\u56FE\u8868\u3001\u7ED3\u679C\u3001\u516C\u5F0F\u4E0E\u8BED\u8A00\u4E60\u60EF\u3002",
      "Combine narrative, citation, paragraph, display, results, equation, and language checks."
    )
  },
  {
    id: "delivery",
    index: "04",
    title: localized("\u6307\u6B63\u4E0E\u4EA4\u4ED8", "Guidance and delivery"),
    description: localized(
      "\u9009\u62E9\u4EC5\u62A5\u544A\u6216\u5B89\u5168\u4FEE\u590D\uFF0C\u5E76\u4FDD\u62A4\u539F\u7A3F\u4E2D\u7684\u597D\u8868\u8FBE\u3002",
      "Choose report-only or safe repair while preserving strong existing prose."
    )
  }
];
var WRITING_DIAGNOSIS_FIELD_SECTIONS = {
  scope: "scope",
  sections: "scope",
  depth: "reader",
  audience: "reader",
  dimensions: "dimensions",
  browseCitations: "dimensions",
  action: "delivery",
  preserveStrengths: "delivery",
  custom: "delivery"
};
function writingDiagnosisWorkflowField(control) {
  const field = configurableWorkbenchField(
    control,
    WRITING_DIAGNOSIS_FIELD_SECTIONS[control.id] ?? "delivery"
  );
  if (control.id === "sections") {
    field.visibleWhen = { fieldId: "scope", equals: "selected" };
  }
  if (control.id === "browseCitations") {
    field.visibleWhen = {
      fieldId: "dimensions",
      includes: "citation-practice"
    };
  }
  return field;
}
var WRITING_DIAGNOSIS_MODEL = {
  id: "writing-diagnosis",
  version: SKILL_WORKFLOW_VERSION,
  skillId: "writing-diagnosis",
  websitePath: "/writing/diagnosis",
  title: localized("\u5B66\u672F\u5199\u4F5C\u8BCA\u65AD", "Academic Writing Diagnosis"),
  eyebrow: "YANSHU \xB7 ACADEMIC WRITING DIAGNOSIS",
  description: localized(
    "\u4ECE\u5168\u6587\u3001\u6BB5\u843D\u548C\u53E5\u5B50\u4E09\u4E2A\u5C3A\u5EA6\u53D1\u73B0\u4F5C\u8005\u96BE\u4EE5\u81EA\u5BDF\u7684\u5199\u4F5C\u624B\u6CD5\u4E0E\u4E60\u60EF\u95EE\u9898\u3002",
    "Expose hard-to-notice writing-technique and habit problems at manuscript, paragraph, and sentence scale."
  ),
  materialTitle: localized("\u9700\u8981\u6750\u6599", "Required materials"),
  materialItems: {
    zh: ["\u4E3B\u7A3F .tex", "\u6700\u65B0\u7F16\u8BD1 PDF\uFF08\u5EFA\u8BAE\uFF09", ".bib\uFF08\u5EFA\u8BAE\uFF09", "\u76EE\u6807 venue \u6307\u5357\uFF08\u53EF\u9009\uFF09"],
    en: ["Main .tex", "Latest compiled PDF (recommended)", ".bib (recommended)", "Target-venue guidance (optional)"]
  },
  materialHint: localized(
    "\u65E0\u9700 figures \u6216\u5B9E\u9A8C\u6E90\u6570\u636E\uFF1B\u672C\u5DE5\u4F5C\u6D41\u53EA\u8BCA\u65AD\u5199\u4F5C\uFF0C\u4E0D\u91CD\u65B0\u8BC4\u5BA1\u79D1\u5B66\u8D21\u732E\u3002",
    "Figures and raw experimental data are unnecessary; this workflow diagnoses writing rather than re-reviewing the science."
  ),
  output: localized(
    "\u5199\u4F5C\u8BCA\u65AD Markdown\uFF0C\u4EE5\u53CA\u9009\u62E9\u5B89\u5168\u4FEE\u590D\u65F6\u7684\u5B8C\u6574\u4FEE\u8BA2 TeX \u4E0E high-risk diff\u3002",
    "A writing-diagnosis Markdown report plus a complete revised TeX and high-risk diff when safe repair is selected."
  ),
  sections: WRITING_DIAGNOSIS_SECTIONS,
  fields: WRITING_DIAGNOSIS_WORKBENCH.controls.map(
    writingDiagnosisWorkflowField
  ),
  defaults: {
    ...getDefaultWritingDiagnosisValues()
  }
};
var CONFIGURABLE_MODELS = {
  "idea-discovery": IDEA_DISCOVERY_MODEL,
  "paper-drafting": PAPER_DRAFTING_MODEL,
  "writing-diagnosis": WRITING_DIAGNOSIS_MODEL,
  "scientific-figure": SCIENTIFIC_FIGURE_MODEL,
  "experimental-plotting": EXPERIMENTAL_PLOTTING_MODEL
};
var CONFIGURABLE_SKILL_WORKFLOW_IDS = Object.keys(
  CONFIGURABLE_MODELS
);
function textValue(value, fallback = "") {
  return typeof value === "string" ? value : fallback;
}
function booleanValue(value, fallback) {
  return typeof value === "boolean" ? value : fallback;
}
function numberValue(value, fallback, min, max) {
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, Math.round(parsed)));
}
function allowedValue(value, allowed, fallback) {
  return allowed.includes(value) ? value : fallback;
}
function normalizeIdeaPreferences(input) {
  const defaults = DEFAULT_IDEA_PREFERENCES_BY_MODE.discovery;
  return {
    ...defaults,
    directionId: allowedValue(
      input.directionId,
      IDEA_DIRECTION_IDS,
      defaults.directionId
    ),
    focus: textValue(input.focus),
    seed: textValue(input.seed),
    dataset: textValue(input.dataset),
    recentYears: numberValue(input.recentYears, defaults.recentYears, 1, 20),
    topConferences: booleanValue(
      input.topConferences,
      defaults.topConferences
    ),
    topJournals: booleanValue(input.topJournals, defaults.topJournals),
    customVenues: textValue(input.customVenues),
    pursueSota: booleanValue(input.pursueSota, defaults.pursueSota),
    resourceConstraints: textValue(input.resourceConstraints),
    ideaCount: allowedValue(
      input.ideaCount,
      IDEA_COUNT_OPTIONS,
      defaults.ideaCount
    ),
    noveltyPosture: allowedValue(
      input.noveltyPosture,
      NOVELTY_POSTURE_IDS,
      defaults.noveltyPosture
    ),
    additionalCriteria: textValue(input.additionalCriteria)
  };
}
function normalizeDraftPreferences(input) {
  return {
    templateId: allowedValue(
      input.templateId,
      DRAFT_TEMPLATE_IDS,
      DEFAULT_DRAFT_TEMPLATE_ID
    ),
    customVenue: textValue(input.customVenue),
    captionWordRange: normalizeCaptionWordRange(
      input.captionWordRange
    )
  };
}
function normalizeFigurePreferences(input) {
  const defaults = DEFAULT_FIGURE_PREFERENCES;
  const rawAccentMin = numberValue(
    input.accentColorMin,
    defaults.accentColorMin,
    1,
    4
  );
  const rawAccentMax = numberValue(
    input.accentColorMax,
    defaults.accentColorMax,
    1,
    4
  );
  return {
    promptId: allowedValue(
      input.promptId,
      FIGURE_PROMPT_ORDER,
      defaults.promptId
    ),
    executionMode: allowedValue(
      input.executionMode,
      ["direct", "prompt-first"],
      defaults.executionMode
    ),
    hasReferenceImage: booleanValue(
      input.hasReferenceImage,
      defaults.hasReferenceImage
    ),
    aspectRatioId: allowedValue(
      input.aspectRatioId,
      FIGURE_ASPECT_RATIO_IDS,
      defaults.aspectRatioId
    ),
    customAspectWidth: numberValue(
      input.customAspectWidth,
      defaults.customAspectWidth,
      1,
      100
    ),
    customAspectHeight: numberValue(
      input.customAspectHeight,
      defaults.customAspectHeight,
      1,
      100
    ),
    paletteId: allowedValue(
      input.paletteId,
      FIGURE_COLOR_PALETTE_IDS,
      defaults.paletteId
    ),
    fontFamilyId: allowedValue(
      input.fontFamilyId,
      FIGURE_FONT_FAMILY_IDS,
      defaults.fontFamilyId
    ),
    lineColorMode: allowedValue(
      input.lineColorMode,
      ["neutral", "semantic"],
      defaults.lineColorMode
    ),
    accentColorMin: Math.min(rawAccentMin, rawAccentMax),
    accentColorMax: Math.max(rawAccentMin, rawAccentMax),
    allowLightIllustrations: booleanValue(
      input.allowLightIllustrations,
      defaults.allowLightIllustrations
    ),
    cardFillPolicyId: allowedValue(
      input.cardFillPolicyId,
      FIGURE_CARD_FILL_POLICY_IDS,
      defaults.cardFillPolicyId
    ),
    fontSizeLevels: allowedValue(
      input.fontSizeLevels,
      [2, 3],
      defaults.fontSizeLevels
    ),
    includeLargeTitle: booleanValue(
      input.includeLargeTitle,
      defaults.includeLargeTitle
    )
  };
}
function getSkillWorkflowConfigurationModel(workflowId) {
  const model = CONFIGURABLE_MODELS[workflowId];
  if (!model) {
    throw new Error(`Unknown YanShu skill workflow: ${workflowId}`);
  }
  return model;
}
function normalizeSkillWorkflowPreferences(workflowId, input = {}) {
  if (workflowId === "idea-discovery") {
    return normalizeIdeaPreferences(input);
  }
  if (workflowId === "paper-drafting") {
    return normalizeDraftPreferences(input);
  }
  if (workflowId === "writing-diagnosis") {
    return normalizeWritingDiagnosisValues(input);
  }
  if (workflowId === "experimental-plotting") {
    return normalizeExperimentalPlotValues(input);
  }
  return normalizeFigurePreferences(input);
}
function buildSkillWorkflowConfiguration(workflowId, input = {}, promptLanguage = "zh") {
  const model = getSkillWorkflowConfigurationModel(workflowId);
  const preferences = normalizeSkillWorkflowPreferences(workflowId, input);
  let prompt;
  let selection;
  if (workflowId === "idea-discovery") {
    const ideaPreferences = preferences;
    prompt = buildIdeaPrompt("discovery", ideaPreferences, promptLanguage);
    selection = {
      directionId: ideaPreferences.directionId,
      recentYears: ideaPreferences.recentYears,
      ideaCount: ideaPreferences.ideaCount,
      noveltyPosture: ideaPreferences.noveltyPosture
    };
  } else if (workflowId === "paper-drafting") {
    const draftPreferences = preferences;
    prompt = buildDraftPrompt(
      draftPreferences.templateId,
      draftPreferences.customVenue,
      promptLanguage,
      draftPreferences.captionWordRange
    );
    selection = {
      templateId: draftPreferences.templateId,
      customVenue: draftPreferences.customVenue,
      captionWordRange: draftPreferences.captionWordRange
    };
  } else if (workflowId === "writing-diagnosis") {
    const diagnosisPreferences = preferences;
    prompt = buildWritingDiagnosisPrompt(
      diagnosisPreferences,
      promptLanguage
    );
    selection = {
      scope: diagnosisPreferences.scope,
      depth: diagnosisPreferences.depth,
      dimensions: diagnosisPreferences.dimensions,
      action: diagnosisPreferences.action
    };
  } else if (workflowId === "experimental-plotting") {
    const plotPreferences = preferences;
    prompt = buildExperimentalPlotPrompt(
      plotPreferences,
      promptLanguage
    );
    selection = {
      plotGoal: plotPreferences.plotGoal,
      allowComposite: plotPreferences.allowComposite,
      panelCount: plotPreferences.panelCount,
      palette: plotPreferences.palette
    };
  } else {
    const figurePreferences = preferences;
    prompt = buildFigurePrompt(
      figurePreferences.promptId,
      figurePreferences,
      promptLanguage
    );
    selection = {
      promptId: figurePreferences.promptId,
      hasReferenceImage: figurePreferences.hasReferenceImage,
      aspectRatio: getFigureAspectRatio(figurePreferences),
      accentColors: getFigureAccentColorRange(figurePreferences).label,
      paletteId: figurePreferences.paletteId
    };
  }
  return {
    schemaVersion: 1,
    workflowId,
    workflowVersion: model.version,
    websitePath: model.websitePath,
    promptLanguage,
    preferences,
    prompt,
    selection
  };
}
export {
  CONFIGURABLE_SKILL_WORKFLOW_IDS,
  CONFIGURATION_UI_COPY,
  SKILL_WORKFLOW_VERSION,
  YANSHU_SKILL_CATALOG,
  buildSkillWorkflowConfiguration,
  getSkillWorkflowConfigurationModel,
  normalizeSkillWorkflowPreferences
};
