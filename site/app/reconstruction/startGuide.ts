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
    body: "复制一次即可：Codex 会安装或更新 YanShu，先让你选择网页 ChatGPT 或当前 CLI，再确认论文目录并开始。",
    steps: ["发送给 Codex", "选择执行方式", "选择论文并开始"],
    preview: "查看将复制的说明",
    copy: "复制给 Codex",
    copied: "已复制",
    prompt: `请安装或更新 YanShu 插件，并启动 Paper Reconstruction。

插件仓库：https://github.com/panzhzh/yanshu-workbench
请先检查插件安装状态：若尚未添加插件源，将 \`panzhzh/yanshu-workbench\` 的 \`main\` 分支添加为 marketplace；若已添加，则升级到最新 \`main\`。随后安装或重新载入 \`yanshu-workbench@yanshu-workbench\`。这些操作请由 Codex 完成，不要让我手动输入终端命令。

安装完成后，请新建一个 Codex 任务以载入最新插件，并在新任务中调用 YanShu 的 Paper Reconstruction。第一步先只询问一次本次使用“网页 ChatGPT”还是“当前 CLI”，不要根据 SSH、WSL、DISPLAY、操作系统或浏览器状态自动判断。网页 ChatGPT 的选项请提示：论文写作能力通常更强，但必须已登录 ChatGPT，并授权所需的浏览器控制及文件访问/上传权限。当前 CLI 的选项请提示：启动更便捷且不依赖网页，但论文写作能力通常不如网页端。

记录执行方式后，再询问我的论文目录；若目录中有多篇论文，只让我选择一次。确认唯一的 TeX、BibTeX、PDF 与可选 figures 后，不要随机选择论文。

若我选择网页 ChatGPT，再打开完整本地配置页并等待我确认；若我选择当前 CLI，不要打开或等待页面，只再一次性询问：会议或期刊、是否允许单独附录、正文建议字数是不限制还是具体数字。收到 CLI 配置后，由当前任务连续完成五轮，不要打开 ChatGPT 网页，也不要递归启动新的 codex exec 或 resume 进程。任何模式失败时都不要静默切换执行器。

若检测到唯一的未完成 yanshu-reconstruction 运行，直接从断点继续；若有多个，只让我选择一次；否则创建新运行。配置确认后开始五轮重构。`,
  },
  en: {
    eyebrow: "YANSHU FOR CODEX",
    title: "Start in Codex",
    body:
      "Copy once: Codex installs or updates YanShu, asks you to choose Web ChatGPT or Current CLI, then confirms the paper directory and starts.",
    steps: [
      "Send to Codex",
      "Choose the executor",
      "Choose the paper and start",
    ],
    preview: "View the copied instruction",
    copy: "Copy for Codex",
    copied: "Copied",
    prompt: `Install or update the YanShu plugin and start Paper Reconstruction.

Repository: https://github.com/panzhzh/yanshu-workbench
Inspect the plugin installation state first. If the marketplace source is missing, add the \`main\` branch of \`panzhzh/yanshu-workbench\`; otherwise upgrade it to the latest \`main\`. Then install or reload \`yanshu-workbench@yanshu-workbench\`. Codex must perform these operations instead of asking me to type terminal commands.

After installation, create a new Codex task so the latest plugin is loaded, then invoke YanShu's Paper Reconstruction in that task. First ask once whether to use “Web ChatGPT” or “Current CLI”. Never infer this from SSH, WSL, DISPLAY, operating system, or browser state. Describe Web ChatGPT as usually stronger for academic writing but requiring an active ChatGPT login and authorization for the necessary browser control and file access/uploads. Describe Current CLI as more convenient and browser-free but potentially weaker for academic writing.

After recording the executor, ask me for the paper directory. If it contains multiple papers, ask me to choose only once. Once the TeX, BibTeX, PDF, and optional figures are unambiguous, never select a paper at random.

If I choose Web ChatGPT, then open the complete local setup page and wait for confirmation. If I choose Current CLI, do not open or wait for a page; ask once more for conference or journal, appendix allowance, and unlimited or numeric suggested main-text words. After the CLI configuration reply, use the current task for all five rounds. Do not open visible ChatGPT or recursively launch another codex exec/resume process. Never switch executors silently after a failure.

If exactly one unfinished yanshu-reconstruction run exists, resume it from its checkpoint. If several exist, ask me to choose once; otherwise create a new run. Start the five-round reconstruction after configuration is confirmed.`,
  },
} satisfies Record<Language, CodexStartGuide>;
