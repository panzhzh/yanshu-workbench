<div align="center">

# 研术台 · YanShu

**面向 CS 研究者的科研方法文档站与交互式工作台**

从研究选题、实验设计与复现，到论文写作、结构重构、科研图表与投稿审校。
把关键科研任务整理成可配置、可审计、可直接复制的中英文 Prompt。

[![Next.js](https://img.shields.io/badge/Next.js-16-111111?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-087EA4?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare-Pages-F38020?logo=cloudflarepages&logoColor=white)](https://pages.cloudflare.com/)

[在线使用](https://yanshu-workbench.pages.dev/) ·
[Idea 查找](https://yanshu-workbench.pages.dev/ideas/discovery/) ·
[Idea 评估](https://yanshu-workbench.pages.dev/ideas/evaluation/) ·
[全文初稿](https://yanshu-workbench.pages.dev/draft/) ·
[全文重构](https://yanshu-workbench.pages.dev/reconstruction/) ·
[科学示意图](https://yanshu-workbench.pages.dev/figures/) ·
[投稿定位](https://yanshu-workbench.pages.dev/submission/)

</div>

## 唯一公开部署

YanShu 的唯一公开生产地址是 **Cloudflare Pages**：
[https://yanshu-workbench.pages.dev/](https://yanshu-workbench.pages.dev/)。
GitHub `main` 是网站源码的唯一事实来源。ChatGPT Sites 中保存的版本号、
预览站或 `*.chatgpt.site` 地址不属于本项目的发布流程，也不得作为线上地址写入
代码、文档或交接信息。

## 为什么做 YanShu

科研写作真正困难的部分，往往不是生成一句英文，而是控制证据边界、叙事结构、篇幅、术语、图表和投稿规则之间的关系。研术台把这些决策显式化：研究者先配置任务，右侧 Prompt 随设置实时更新，再把 Prompt 与论文材料放入自己选择的模型对话中执行。

网站本身不读取、不上传，也不保存论文文件。

YanShu 同时提供可选的插件执行层：让 ChatGPT Chat 负责论文正文，让 Codex 负责本地文件、轮次状态、编译和错误回传。它使用用户可见且已登录的 ChatGPT 会话，不以 Codex 的写作结果替代 Chat。

## 三步开始

1. 在 Codex 中安装 YanShu：

   ```bash
   codex plugin marketplace add panzhzh/yanshu-workbench --ref main
   codex plugin add yanshu-workbench@yanshu-workbench
   ```

2. 安装或更新后新建一个 Codex 任务，用一句自然语言说明工作流与目录，例如：

   ```text
   使用 $paper-drafting 根据这个实验目录撰写论文初稿。
   ```

3. YanShu 会确认工作区并自动打开仅在本机运行的配置页。所有选项与完整 Prompt
   都在这一页完成；点击“全自动开始”后直接执行，不再在聊天中逐项确认。若只想
   手动使用，复制右侧 Prompt 后退出即可。

首页也提供相同的动态三步演示和八个核心工作流的可复制启动语。

## 一个 YanShu，多项科研工作流

`YanShu` 是总品牌和总插件，不等同于某一个具体任务。插件包含多个可独立触发的子 Skill；输入 `$skill-name` 即可精确调用：

| 层级 | 当前名称 | `$` 调用 | 作用 |
| --- | --- | --- | --- |
| 总入口 | **YanShu** | — | 安装、发现和协调科研工作流 |
| 选题 | **Idea Discovery** | `$idea-discovery` | 近期文献检索、候选去重、风险判断与最小验证实验 |
| 写作 | **Paper Drafting** | `$paper-drafting` | 从完成的实验材料生成可编译 LaTeX 初稿 |
| 写作 | **Writing Diagnosis** | `$writing-diagnosis` | 诊断全文反复出现的写作手法与习惯问题 |
| 重构 | **Paper Reconstruction** | `$paper-reconstruction` | 五轮论文重构、框架图重构、产物恢复与编译检查 |
| 绘图 | **Scientific Figure** | `$scientific-figure` | 从论文证据生成一张高清科研示意图 |
| 图表 | **Experimental Plotting** | `$experimental-plotting` | 从真实实验数据生成可复现的出版级代码图 |
| 审校 | **Peer Review** | `$peer-review` | 独立检查贡献、方法、证据、结论边界和可复现性 |
| 审校 | **Revision Planning** | `$revision-planning` | 合并审稿意见并形成优先级、实验决策与修改顺序 |

插件清单、Skill 文件和内部标识统一使用英文，便于公开分发；与用户的问答语言以及 Prompt 输出语言仍可选择中文或英文。

## 当前工作台

| 模块 | 适用阶段 | 当前能力 |
| --- | --- | --- |
| [Idea 查找](https://yanshu-workbench.pages.dev/ideas/discovery/) | 尚未确定选题 | 默认优先检索近 2 年顶会论文并生成 2 个候选；支持自定义时间窗、venue、数据集、SOTA 目标和资源边界，最终输出中英文 Markdown |
| [Idea 评估与优化](https://yanshu-workbench.pages.dev/ideas/evaluation/) | 已有初步 Idea | 从新颖性、意义、有效性、可行性、竞争时机与复现条件进行压力测试；默认保留核心问题与机制并融合优化 |
| [全文初稿](https://yanshu-workbench.pages.dev/draft/) | 实验已经完成 | 从证据材料生成完整、可编译的英文 LaTeX 初稿；arXiv 默认样式或当届顶会官方模板 |
| [学术写作诊断](https://yanshu-workbench.pages.dev/writing/diagnosis/) | 已有论文但难以发现写作习惯问题 | 从全文、段落和句子三个尺度组合检查主线、引用覆盖、段落推进、caption/note、结果复述、公式叙述、读者负担与重复；默认只输出诊断报告 |
| [全文重构](https://yanshu-workbench.pages.dev/reconstruction/) | 已有论文或初稿 | 会议/期刊结构、正文与章节预算、附录规则、方法与实验保护、五步双语 Prompt |
| [章节精修](https://yanshu-workbench.pages.dev/reconstruction/refinement/) | 需要精修单章或合并实验叙事 | 按 Abstract、Introduction、Related Work、Method、Experiments & Results、Discussion、Conclusion 分别生成章节专用 Prompt |
| [专项审计](https://yanshu-workbench.pages.dev/reconstruction/audit/) | 论文接近终稿 | 可组合审计术语、引用与 BibTeX、数据、图表、Claim–证据、符号、可复现性和跨章节重复 |
| [分章节写作](https://yanshu-workbench.pages.dev/writing/sections/) | 从提纲或局部证据撰写章节 | 根据章节功能显示专用配置，覆盖贡献列表、引用核验、Method Overview、伪代码、图表对应段落和 Discussion 主题 |
| [版本转换](https://yanshu-workbench.pages.dev/reconstruction/conversion/) | 会议、期刊、预印本或投稿版本迁移 | 核验目标规则后处理扩写、压缩、匿名、附录、模板和图表迁移，并输出高风险差异 |
| [实验方案设计](https://yanshu-workbench.pages.dev/experiments/design/) | 实验尚未完整落地 | 从研究问题、资源和证据边界生成主实验、对照、消融、稳健性和停止条件 |
| [Baseline 与复现](https://yanshu-workbench.pages.dev/experiments/baselines/) | 需要选择公平对照并复现 | 优先核验官方论文与仓库，明确同协议重跑、可比性、公平调参和失败记录 |
| [实验代码](https://yanshu-workbench.pages.dev/experiments/code/) | 需要实现可运行实验 | 按仓库环境、实现范围、配置与测试要求生成代码任务，保留可追溯日志和运行入口 |
| [结果分析](https://yanshu-workbench.pages.dev/experiments/results/) | 已有表格、日志或统计结果 | 区分观察、解释与推测，按主结果、消融、效率、稳健性和失败案例组织证据 |
| [可复现性](https://yanshu-workbench.pages.dev/experiments/reproducibility/) | 准备交付代码与实验材料 | 检查环境、随机性、数据、命令、产物和独立复现路径，生成可验证清单 |
| [科学示意图](https://yanshu-workbench.pages.dev/figures/) | 需要论文插图 | 方法总览图默认，并提供引言、任务定义、核心机制、流程、系统与专业图型；参考图默认关闭，开启后才把视觉样式参考规则写入 Prompt |
| [实验绘图](https://yanshu-workbench.pages.dev/figures/plots/) | 需要从数据生成统计图 | 以真实数据和绘图代码为核心，配置统计表达、组合图与 1–3 个默认子图、精确科研配色、图型策略和导出格式，不调用生图模型 |
| [论文表格](https://yanshu-workbench.pages.dev/figures/tables/) | 需要整理结果或对比表 | 逐格核对数值与单位，配置表格职责、排序、高亮、显著性和单栏/双栏可读性 |
| [图表审计](https://yanshu-workbench.pages.dev/figures/audit/) | 图表接近交付 | 联合检查数据、caption、正文引用、标签、可读性和一致性；安全修复只触及已确认错误及其直接依赖 |
| [投稿定位](https://yanshu-workbench.pages.dev/submission/) | 论文接近终稿 | 先判断论文类别，再按 OA、APC、IF、综述文章、分区和收录等条件动态筛选；默认排除 MDPI、Hindawi 与 Frontiers，也可关闭该排除条件 |
| [投稿前终检](https://yanshu-workbench.pages.dev/submission/check/) | 即将提交 | 以目标 venue 最新官方规则为准，检查格式、匿名、材料、伦理、可复现性和阻塞项 |
| [投稿材料](https://yanshu-workbench.pages.dev/submission/materials/) | 需要准备附加材料 | 仅生成所选 cover letter、highlights、声明等材料；作者元数据缺失时保留明确占位，不得补造 |
| [审稿](https://yanshu-workbench.pages.dev/submission/review/) | 投稿前独立评估 | 不区分会议与期刊，从贡献、方法、证据、结论边界、表达和可复现性生成分级审稿报告，不修改论文 |
| [返修规划](https://yanshu-workbench.pages.dev/submission/revision/) | 收到审稿意见后 | 拆分并合并多位 reviewer 意见，完成 P0/P1/P2 与 A/B/C/D 分类，规划最小实验、风险和修改顺序；不提前写回复信 |
| YanShu 插件 | 需要全链路执行 | 八个核心子 Skill 均使用官网同源配置和 Prompt，再协调可见 ChatGPT 与本地产物；当前为开发者预览 |

## 设计原则

- **配置驱动**：数字、结构与规则集中维护，不把产品逻辑散落在界面里。
- **一项 Prompt，一项任务**：降低一次对话承担多个目标造成的遗漏与混乱。
- **证据优先**：不得补造实验、引用、方法细节、投稿信息或图中术语。
- **模板可追溯**：顶会模板必须在执行时从当届官网或官方 author kit 核验。
- **中英文独立**：界面语言与 Prompt 语言分别建模，不依赖运行时机器翻译。
- **克制可读**：服务长文本阅读、快速配置和复制，不采用营销页或普通 SaaS 后台视觉。
- **写作与执行分层**：Chat 负责论文写作，Codex 只协调本地材料、状态、编译和错误回传。
- **随时可恢复**：长任务逐轮保存，不因页面关闭、等待超时或应用重启而重复提交。

## 安装 YanShu 插件

仓库中的 [`plugins/yanshu-workbench`](./plugins/yanshu-workbench/) 是 YanShu 插件的开发者预览版。当前包含六个正式命名的核心工作流：

| Skill | 启动语示例 |
| --- | --- |
| **Idea Discovery** | `使用 $idea-discovery 在当前工作区查找研究 Idea。` |
| **Paper Drafting** | `使用 $paper-drafting 根据这个实验目录撰写论文初稿。` |
| **Writing Diagnosis** | `使用 $writing-diagnosis 诊断这个论文目录中的学术写作问题。` |
| **Paper Reconstruction** | `使用 $paper-reconstruction 重构这个论文目录。` |
| **Scientific Figure** | `使用 $scientific-figure 为这个论文目录绘制一张科研配图。` |
| **Experimental Plotting** | `使用 $experimental-plotting 根据这个实验目录绘制论文实验图。` |

Idea Discovery、Paper Drafting、Writing Diagnosis、Scientific Figure 与 Experimental Plotting 的本地配置运行时由网站对应
页面的 TypeScript 配置和 Prompt 构建器自动生成；Paper Reconstruction 继续由
`site/content/prompts` 生成。`npm run plugin:check` 会逐字节检查两套运行时，
任何网站与 Skill 不同步的提交都无法通过发布检查。

- 从网站同一份配置源生成五轮 Paper Reconstruction Prompt，其中第四轮复用科研绘图的 Method Overview 规则；
- 自动识别或显式接收 TeX、BibTeX、PDF 与 figures 路径；
- 新建 `yanshu-reconstruction/<run-id>/`，保存每轮 Prompt、产物、日志与状态；
- 记录并恢复每轮 Chat 会话地址、实际模型标签和推理档位；
- 默认使用 ChatGPT 当前可见的最新推理模型与最强档位，也可选择 Medium、High、Extra High 或 Pro；选择 Pro 时默认每轮首次有效对话使用 Pro，后续继续、纠正和补交自动切换为 Extra High，也可显式强制全部 Pro；
- 所选档位不可用时，先提示用户，再回退到最接近的较低档位；名称无法判断时选择最强可用档位；
- 内置受控的 YanShu Paper Workspace MCP：ChatGPT 可以按需读取 Prompt、TeX、BibTeX、图表证据和 PDF 页面，而不是每轮重新上传整套文件；
- 从 TeX 建立图表证据索引，并将 PNG/JPEG/WebP/SVG 原图、PDF 页面、PDF/EPS 图件作为真实图像返回给模型；实验数字不得只凭文件名或 caption 推断；
- 将 ChatGPT 产出的 TeX、BibTeX 与报告版本化写入当前轮次，隔离编译 LaTeX，并把 PDF 和错误日志直接交给同一对话修正；
- 为每轮生成最小充分文件白名单：Round 2/3 只接收上一轮 TeX、完整当前 BibTeX 与 PDF，Round 4 只接收最新 TeX/PDF，Round 5 再加入 Round 4 PNG，不累积历史报告与已渲染图件；
- 附件保底模式将每轮三个文本产物打成一个可校验 ZIP，一次下载后自动导入，避免逐个处理 TeX/BibTeX 文档实体；
- 新运行会核对官网与已安装 Prompt 工作流版本，旧插件不得启动新运行；已开始的运行继续使用初始化快照，保证可恢复与可复现；
- 在 Chat 桥接缺失时停在可恢复状态，而不是让 Codex 代写论文。

Paper Drafting 与 Experimental Plotting 可选使用两个外部增强 Skill。首次发现缺失时，YanShu 只询问一次，并只允许安装两个固定子目录：`research-paper-writing` 用于论文初稿的论证组织与写作自检，`nature-figure` 用于实验数据的代码绘图与成图核验；不会安装任一完整仓库。研术台配置、证据边界与交付协议始终优先。Scientific Figure 不使用这两个外部 Skill，继续由研术台 Prompt 与可见 ChatGPT 生图链路独立完成。

完整自动执行还需要可见的 ChatGPT 会话与兼容的浏览器桥接。YanShu 已内置并锁定可见 Chat 控制运行时以及本地 MCP 工作区，用户不需要再安装第二个文件插件。外部网页 ChatGPT 若要直接调用本地 MCP，仍需一次性连接经过认证的 HTTPS MCP 端点或受支持的安全隧道；单纯的 `127.0.0.1` 地址无法被网页端访问。没有该连接时，真实文件附件链路继续作为保底。

### 当前 GitHub 预览版

在 ChatGPT 桌面应用的 Codex 环境或 Codex CLI 中执行一次：

```bash
codex plugin marketplace add panzhzh/yanshu-workbench --ref main
codex plugin add yanshu-workbench@yanshu-workbench
```

安装页会把可选的 GitHub 连接与 YanShu 的其他依赖授权集中展示。用户只需在这里决定一次；授权后，所有 YanShu 工作流复用同一连接。首次使用时，YanShu 通过 GitHub 专用的幂等写入接口确保公开仓库 `panzhzh/yanshu-workbench` 已被 Star，并在本机记录回执：已 Star 的仓库不会被取消，YanShu 永远不会调用 Unstar，也不会为此读取无关仓库。跳过或拒绝 GitHub 连接不会阻塞科研流程，YanShu 也不会在后续运行中反复询问。

连接登录与 Codex 的操作审批是两个层次。YanShu 可以合并安装时的连接授权并避免自身重复请求，但不会擅自修改用户的全局审批策略；若宿主仍要求确认一次外部写入，以用户在 Codex 中选择的权限模式为准。

已经安装预览版时，更新并重新载入最新版本：

```bash
codex plugin marketplace upgrade yanshu-workbench
codex plugin add yanshu-workbench@yanshu-workbench
```

当前预览版从 **Codex 任务**启动；普通 Chat 对话本身不会直接加载本地插件。启动后，YanShu 再通过可见桥接把论文写作交给 ChatGPT Chat，这正是“Codex 管文件、Chat 写论文”的分层。

安装后必须**新建一个任务**，这样 Codex 才会载入新 Skills。然后直接说出任一工作流，例如：

```text
Use $paper-drafting to draft a paper from this experiment directory.
```

也可以用中文：

```text
使用 $idea-discovery 在当前工作区查找研究 Idea。
使用 $paper-drafting 根据这个实验目录撰写论文初稿。
使用 $writing-diagnosis 诊断这个论文目录中的学术写作问题。
使用 $paper-reconstruction 重构这个论文目录。
使用 $scientific-figure 为这个论文目录绘制一张科研配图。
使用 $experimental-plotting 根据这个实验目录绘制论文实验图。
```

所有核心 Skill 都先确认工作区，再立即打开一个仅运行在 `127.0.0.1` 的本地配置页，
不在聊天中逐项收集设置。Idea、初稿和绘图页实时展示各自唯一的执行 Prompt；
全文重构页展示五轮 Prompt。点击“全自动开始”后直接执行；若只想手动使用，
复制后点击“退出”即可，且不会创建运行目录或传输论文文件。

当前 GitHub 技术安装 ID 仍为 `yanshu-workbench`，用户看到的插件名称是 **YanShu**。未来进入 OpenAI 公共插件目录后，安装路径将简化为 **Plugins → 搜索 YanShu → 安装 → 新建任务**。插件的官方安装与使用方式可参考 [OpenAI Plugins 文档](https://learn.chatgpt.com/docs/plugins)。

### 模型与推理档位为什么不写死

模型名称会持续更新，因此网站和 `.yanshu.json` 只保存稳定意图：

```json
{
  "modelPolicy": "latest-visible-reasoning",
  "reasoningPreference": "strongest",
  "forceProForAllTurns": false,
  "fallbackPolicy": "closest-lower-then-strongest"
}
```

运行时以 ChatGPT 真实可见的选择器为准，而不是根据 Plus、Pro 等套餐名称猜测。比如用户选择 Extra High 或 Pro，但页面只显示 Medium 与 High，YanShu 会明确说明并使用 High；若新名称无法可靠分类，则使用选择器中最强的可用档位。

Pro 通常耗时更久。默认策略是在每轮首次有效提交时使用 Pro，同一轮的续写、纠正与产物补交使用 Extra High；配置页可开启“强制全部 Pro”，并会明确提示五轮流程可能显著延长。

每一轮都会先显式新建独立的空白 Chat，再在该会话中选择推理档位，不会修改用户原本打开的聊天。连接 MCP 时，新对话只接收一个很短的运行标识，随后自行读取本轮 Prompt、最新源码和上一轮产物；写入、编译与 PDF 页面复核也通过 MCP 完成。没有 MCP 连接时，YanShu 才通过 ChatGPT 可见的文件选择器传入最小白名单；已有 PDF 时不再重复上传其中已渲染的原始图件。每个文本轮次交付完整 TeX、报告和可直接延续的完整当前 BibTeX，优先以一个严格校验的 ZIP 单次下载并导入；Windows 文件对象剪贴板粘贴与逐文件下载仅作为后备路径。如果 ChatGPT 已接受准确的档位点击、但新版界面暂时无法回读当前标签，YanShu 会将其记录为 `click-acknowledged` 并继续；只有选项未找到、点击失败、新会话未建立或回读明确冲突时才暂停。

## 论文模板策略

论文初稿默认使用第三方 MIT 开源 arXiv 预印本样式作为排版基础；它不是 arXiv 官方格式要求，具体来源统一列在文末参考表中。

选择 NeurIPS、ICML、ICLR、CVPR、ICCV、ECCV、ACL、EMNLP、AAAI、KDD 或 ACM Multimedia 时，Prompt 不硬编码往年规则，而是要求模型先检索当前届官网、作者指南或官方维护的模板仓库，并记录年份、版本、核验日期和来源。

## 本地运行

需要 Node.js 22。

```bash
cd site
nvm use 22
npm install
npm run dev
```

打开 `http://localhost:3000`。

## 质量检查

```bash
cd site
nvm use 22
npm run lint
npm test
npm run build:pages
```

测试会检查正式构建产物、主要页面的服务端渲染结果，以及字数、附录、模板、投稿筛选和绘图 Prompt 的关键约束。

## 项目结构

```text
yanshu-workbench/
├── README.md
├── plugins/
│   └── yanshu-workbench/      # YanShu 插件、Paper Reconstruction 与 Chat 委派边界
└── site/
    ├── app/
    │   ├── draft/              # 论文初稿配置与 Prompt
    │   ├── ideas/              # Idea 查找、评估与优化
    │   ├── writing/            # 分章节写作
    │   ├── reconstruction/     # 全文重构、精修、审计与版本转换
    │   ├── experiments/        # 实验设计、复现、代码、分析与可复现性
    │   ├── figures/            # 科研示意图、实验图、表格与图表审计
    │   ├── submission/         # 投稿定位、终检、材料、审稿与返修规划
    │   └── workbench/          # 配置式工作台共用组件
    ├── content/prompts/        # 重构模板、变量模型与字数规则
    ├── content/workflows/      # 网站与核心 Skills 共用的工作流目录与配置导出
    ├── public/                 # 站点静态资源
    └── tests/                  # 构建产物与产品约束测试
```

## 接下来

- [x] 简洁首页与顶部导航
- [x] Idea 查找、评估与优化工作台
- [x] 论文初稿工作台
- [x] 全文重构、章节精修、专项审计、分章节写作与版本转换
- [x] 实验设计、Baseline 复现、实验代码、结果分析与可复现性
- [x] 科学示意图、实验绘图、论文表格与图表审计
- [x] 投稿定位、投稿前终检、投稿材料、审稿与返修规划
- [x] 可恢复的五轮论文重构插件基础
- [x] 八个核心子 Skill 使用网站同源配置；初稿与实验绘图支持可选外部增强
- [ ] 浏览器桥接的一体化安装与首次使用向导
- [ ] 为更多专项工作台补充可恢复的全链路插件执行
- [ ] 更细的会议、期刊和出版商配置
- [ ] 面向真实项目的端到端回归样例

## 使用边界

站内的篇幅、结构和筛选设置是通用产品预设，不代表任何具体 venue 的官方要求。会议和期刊规则会变化，投稿前必须以目标 venue 最新官网、作者指南和正式模板为准。

发现规则冲突、文案问题或希望增加新的科研场景，欢迎提交 [Issue](https://github.com/panzhzh/yanshu-workbench/issues)。

## 开源参考与致谢

下表统一列出 YanShu 借鉴、可选调用或随插件分发的开源项目与公开方法指南。YanShu 只吸收适用的方法、接口或许可材料，不复制项目品牌视觉；各工作台的配置、Prompt 与输出协议均由本项目维护。

| 项目或指南 | 类型 / 许可证 | 在 YanShu 中的用途 |
| --- | --- | --- |
| [Master-cai/Research-Paper-Writing-Skills](https://github.com/Master-cai/Research-Paper-Writing-Skills) | MIT | 可选安装单个 `research-paper-writing` 子 Skill，增强论文初稿的论证组织、学术行文与自检 |
| [Yuan1z0825/nature-skills](https://github.com/Yuan1z0825/nature-skills) | Apache-2.0 | 可选安装单个 `nature-figure` 子 Skill，仅增强实验数据的代码绘图与出版级核验 |
| [LigphiDonk/academic-figure-generator](https://github.com/LigphiDonk/academic-figure-generator) | MIT | 科研示意图的信息拆解与结构化生图 Prompt 思路 |
| [NoviScl/AI-Researcher](https://github.com/NoviScl/AI-Researcher) | MIT | Idea 检索、去重、排序与新颖性过滤思路 |
| [zjunlp/InnoEval](https://github.com/zjunlp/InnoEval) | MIT | Idea 的多来源取证与多维评估思路 |
| [andrehuang/research-companion](https://github.com/andrehuang/research-companion) | MIT | 最快否证、竞争时机与研究决策思路 |
| [allenai/codescientist](https://github.com/allenai/codescientist) | Apache-2.0 | 可实施性判断与最小验证实验思路 |
| [kourgeorge/arxiv-style](https://github.com/kourgeorge/arxiv-style) | MIT | 论文初稿的默认第三方 arXiv 预印本排版基础 |
| [Descanonge/tol_colors](https://github.com/Descanonge/tol_colors) | BSD-3-Clause | 科研示意图与实验绘图的 Paul Tol HEX 配色候选 |
| [adamallcock/codex-chatgpt-control](https://github.com/adamallcock/codex-chatgpt-control) | MIT | 插件中固定版本的可见 ChatGPT 会话控制运行时；详见第三方声明 |
| [PLOS · Ten simple rules for structuring papers](https://doi.org/10.1371/journal.pcbi.1005619) | CC BY | 学术写作诊断中的全文主线、章节功能、段落落点与结果叙事 |
| [MIT EECS Communication Lab · Introduction / Results](https://mitcommlab.mit.edu/eecs/commkit/journal-or-conference-paper/) | 公开写作指南 | Introduction 的问题—动机—方案—贡献，以及 Results 的 rationale—finding—transition |
| [Nature Portfolio · How to write your paper](https://www.nature.com/nature-portfolio/for-authors/write) | 作者指南 | 术语负担、复杂句、可读性和冗长 figure legends 的诊断依据 |
| [IEEE · Editing Mathematics](https://journals.ieeeauthorcenter.ieee.org/wp-content/uploads/sites/7/Editing-Mathematics.pdf) | 作者指南 | 公式作为句子组成部分、公式标点与数学叙述的诊断依据 |
| [University of Manchester · Academic Phrasebank](https://www.phrasebank.manchester.ac.uk/) | 公开写作资源 | 文献综合、谨慎表达、比较、结果报告与章节语言功能 |

---

<div align="center">
  <sub>YanShu · Research methods and interactive tools for CS researchers.</sub>
</div>
