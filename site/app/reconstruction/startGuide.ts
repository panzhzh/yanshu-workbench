import type { Language } from "../config";
import { PROMPT_JUDGMENT_DIRECTIVE } from "../../content/prompts/promptAgency";

type CodexStartGuide = {
  eyebrow: string;
  title: string;
  body: string;
  steps: readonly string[];
  preview: string;
  copy: string;
  copied: string;
  prompt: string;
};

export const CODEX_START_GUIDE = {
  zh: {
    eyebrow: "YANSHU FOR CODEX",
    title: "在 Codex 中启动",
    body: "复制一次即可：Codex 会安装或更新 YanShu，再询问论文目录并打开本地配置页。",
    steps: ["发送给 Codex", "选择论文目录", "配置后自动开始"],
    preview: "查看将复制的说明",
    copy: "复制给 Codex",
    copied: "已复制",
    prompt: `${PROMPT_JUDGMENT_DIRECTIVE.zh}

请安装或更新 YanShu 插件，并启动 Paper Reconstruction。

插件仓库：https://github.com/panzhzh/yanshu-workbench
请先检查当前环境：若尚未添加插件源，将 \`panzhzh/yanshu-workbench\` 的 \`main\` 分支添加为 marketplace；若已添加，则升级到最新 \`main\`。随后安装或重新载入 \`yanshu-workbench@yanshu-workbench\`。这些操作请由 Codex 完成，不要让我手动输入终端命令。

安装完成后，请新建一个 Codex 任务以载入最新插件，并在新任务中调用 YanShu 的 Paper Reconstruction。先询问我的论文目录；若目录中有多篇论文，只让我选择一次。确认唯一的 TeX、BibTeX、PDF 与 figures 后，立即打开 YanShu 本地配置页，不要在聊天中逐项询问配置，也不要随机选择论文。

若检测到唯一的未完成 yanshu-reconstruction 运行，直接从断点继续；若有多个，只让我选择一次；否则创建新运行。配置确认后开始五轮重构。`,
  },
  en: {
    eyebrow: "YANSHU FOR CODEX",
    title: "Start in Codex",
    body:
      "Copy once: Codex installs or updates YanShu, asks for the paper directory, and opens the local configuration page.",
    steps: [
      "Send to Codex",
      "Choose the paper directory",
      "Configure and start",
    ],
    preview: "View the copied instruction",
    copy: "Copy for Codex",
    copied: "Copied",
    prompt: `${PROMPT_JUDGMENT_DIRECTIVE.en}

Install or update the YanShu plugin and start Paper Reconstruction.

Repository: https://github.com/panzhzh/yanshu-workbench
Inspect the current environment first. If the marketplace source is missing, add the \`main\` branch of \`panzhzh/yanshu-workbench\`; otherwise upgrade it to the latest \`main\`. Then install or reload \`yanshu-workbench@yanshu-workbench\`. Codex must perform these operations instead of asking me to type terminal commands.

After installation, create a new Codex task so the latest plugin is loaded, then invoke YanShu's Paper Reconstruction in that task. Ask me for the paper directory first. If it contains multiple papers, ask me to choose only once. Once the TeX, BibTeX, PDF, and figures are unambiguous, open YanShu's local configuration page immediately. Do not collect configuration choices one by one in chat, and never select a paper at random.

If exactly one unfinished yanshu-reconstruction run exists, resume it from its checkpoint. If several exist, ask me to choose once; otherwise create a new run. Start the five-round reconstruction after configuration is confirmed.`,
  },
} satisfies Record<Language, CodexStartGuide>;
