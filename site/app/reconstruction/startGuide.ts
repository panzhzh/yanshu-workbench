import type { Language } from "../config";

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
    body: "复制一次即可：Codex 会安装或更新 YanShu，确认论文目录与一组精简配置，然后在当前任务中完成重构。",
    steps: ["发送给 Codex", "确认论文目录", "一次配置并开始"],
    preview: "查看将复制的说明",
    copy: "复制给 Codex",
    copied: "已复制",
    prompt: `请安装或更新 YanShu 插件，并启动 Paper Reconstruction。

插件仓库：https://github.com/panzhzh/yanshu-workbench
请先检查插件安装状态：若尚未添加插件源，将 \`panzhzh/yanshu-workbench\` 的 \`main\` 分支添加为 marketplace；若已添加，则升级到最新 \`main\`。随后安装或重新载入 \`yanshu-workbench@yanshu-workbench\`。这些操作请由 Codex 完成，不要让我手动输入终端命令。

安装完成后，请新建一个 Codex 任务以载入最新插件，并在新任务中调用 YanShu 的 $paper-reconstruction。默认在当前 Codex/CLI 任务直接执行，不打开网页、本地配置页、JSON 文件或新的聊天。

询问我的论文目录；若目录中有多篇论文，只让我选择一次。确认唯一的 TeX、BibTeX、PDF 与可选 figures 后，不要随机选择论文。

只在这些值尚未给出时，一次性询问：会议或期刊、是否允许附录、正文建议字数是不限制还是具体数字。随后用一个完整 Prompt 在当前任务中依次执行四个内部 Step，只输出 \`<base_name>_restructured.tex\`、\`<base_name>_restructured.bib\` 和一份中文重构说明；不生成中间轮次文件，不重构方法总览图，也不要递归启动新的 codex exec 或 resume 进程。

论文源文件保持只读，最终文件使用新文件名。执行前先读取 YanShu 当前版本的官网同源 Prompt；完成后编译并核对引用、图片路径和交叉引用。`,
  },
  en: {
    eyebrow: "YANSHU FOR CODEX",
    title: "Start in Codex",
    body:
      "Copy once: Codex installs or updates YanShu, confirms the paper directory and one compact configuration, then reconstructs it in the current task.",
    steps: [
      "Send to Codex",
      "Confirm the paper directory",
      "Configure once and start",
    ],
    preview: "View the copied instruction",
    copy: "Copy for Codex",
    copied: "Copied",
    prompt: `Install or update the YanShu plugin and start Paper Reconstruction.

Repository: https://github.com/panzhzh/yanshu-workbench
Inspect the plugin installation state first. If the marketplace source is missing, add the \`main\` branch of \`panzhzh/yanshu-workbench\`; otherwise upgrade it to the latest \`main\`. Then install or reload \`yanshu-workbench@yanshu-workbench\`. Codex must perform these operations instead of asking me to type terminal commands.

After installation, create a new Codex task so the latest plugin is loaded, then invoke YanShu's $paper-reconstruction in that task. Execute directly in the current Codex/CLI task by default. Do not open a website, local configuration page, JSON file, or another chat.

Ask me for the paper directory. If it contains multiple papers, ask me to choose only once. Once the TeX, BibTeX, PDF, and optional figures are unambiguous, never select a paper at random.

Only when the values are missing, ask once for conference or journal, appendix allowance, and unlimited or numeric suggested main-text words. Then use one complete Prompt to execute four internal Steps in the current task. Output only \`<base_name>_restructured.tex\`, \`<base_name>_restructured.bib\`, and one Chinese reconstruction report. Create no intermediate round files, do not reconstruct a Method Overview figure, and do not recursively launch another codex exec/resume process.

Keep the source manuscript read-only and use new filenames for final outputs. Before execution, load YanShu's current website-sourced Prompt. Compile afterward and verify citations, image paths, and cross-references.`,
  },
} satisfies Record<Language, CodexStartGuide>;
