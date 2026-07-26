<div align="center">

# 研术台 · YanShu

**面向 CS 研究者的科研方法文档站与交互式工作台**

从实验完成，到论文初稿、结构重构、科研绘图与投稿筛选。
把关键科研任务整理成可配置、可审计、可直接复制的中英文 Prompt。

[![Next.js](https://img.shields.io/badge/Next.js-16-111111?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-087EA4?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare-Pages-F38020?logo=cloudflarepages&logoColor=white)](https://pages.cloudflare.com/)

[在线使用](https://yanshu-workbench.pages.dev/) ·
[论文初稿](https://yanshu-workbench.pages.dev/draft/) ·
[论文重构](https://yanshu-workbench.pages.dev/reconstruction/) ·
[科研绘图](https://yanshu-workbench.pages.dev/figures/) ·
[投稿策略](https://yanshu-workbench.pages.dev/submission/)

</div>

## 为什么做 YanShu

科研写作真正困难的部分，往往不是生成一句英文，而是控制证据边界、叙事结构、篇幅、术语、图表和投稿规则之间的关系。研术台把这些决策显式化：研究者先配置任务，右侧 Prompt 随设置实时更新，再把 Prompt 与论文材料放入自己选择的模型对话中执行。

网站本身不读取、不上传，也不保存论文文件。

YanShu 同时提供可选的插件执行层：让 ChatGPT Chat 负责论文正文，让 Codex 负责本地文件、轮次状态、编译和错误回传。它使用用户可见且已登录的 ChatGPT 会话，不以 Codex 的写作结果替代 Chat。

## 一个 YanShu，多项科研工作流

`YanShu` 是总品牌和总插件，不等同于某一个具体任务。网站可以持续增加工作台，插件则可以在同一个入口下持续增加独立 Workflow：

| 层级 | 当前名称 | 作用 |
| --- | --- | --- |
| 总入口 | **YanShu** | 安装、发现和协调科研工作流 |
| 首个插件工作流 | **Paper Reconstruction** | 五轮论文重构、框架图重构、产物恢复与编译检查 |
| 后续工作流 | 规划中 | 论文初稿、科研绘图、投稿与审稿相关流程 |

插件清单、Skill 文件和内部标识统一使用英文，便于公开分发；与用户的问答语言以及 Prompt 输出语言仍可选择中文或英文。

## 当前工作台

| 模块 | 适用阶段 | 当前能力 |
| --- | --- | --- |
| [论文初稿](https://yanshu-workbench.pages.dev/draft/) | 实验已经完成 | 从证据材料生成完整、可编译的英文 LaTeX 初稿；arXiv 默认样式或当届顶会官方模板 |
| [论文重构](https://yanshu-workbench.pages.dev/reconstruction/) | 已有论文或初稿 | 会议/期刊结构、正文与章节预算、附录规则、方法与实验保护、五步双语 Prompt |
| [科研绘图](https://yanshu-workbench.pages.dev/figures/) | 需要论文插图 | 方法总览图默认，引言图与关键技术细节图可选；先生成结构化英文生图 Prompt，确认后再绘制单图 |
| [投稿策略](https://yanshu-workbench.pages.dev/submission/) | 论文接近终稿 | OA、APC、IF、综述文章、JCR/中科院分区和 SCIE/SSCI/ESCI 动态筛选与官网核验 |
| YanShu 插件 | 需要全链路执行 | 通过 **Paper Reconstruction** 创建可恢复的五轮目录，保存 Chat 会话与产物状态；当前为开发者预览 |

## 设计原则

- **配置驱动**：数字、结构与规则集中维护，不把产品逻辑散落在界面里。
- **一项 Prompt，一项任务**：降低一次对话承担多个目标造成的遗漏与混乱。
- **证据优先**：不得补造实验、引用、方法细节、投稿信息或图中术语。
- **模板可追溯**：顶会模板必须在执行时从当届官网或官方 author kit 核验。
- **中英文独立**：界面语言与 Prompt 语言分别建模，不依赖运行时机器翻译。
- **克制可读**：服务长文本阅读、快速配置和复制，不采用营销页或普通 SaaS 后台视觉。
- **写作与执行分层**：Chat 负责论文写作，Codex 只协调本地材料、状态、编译和错误回传。
- **随时可恢复**：长任务逐轮保存，不因页面关闭、等待超时或应用重启而重复提交。

## 方法参考

科研绘图的“论文语义拆解 → 结构化英文生图 Prompt → 用户确认后绘制”工作流受 [LigphiDonk/academic-figure-generator](https://github.com/LigphiDonk/academic-figure-generator) 启发。参考项目采用 [MIT License](https://github.com/LigphiDonk/academic-figure-generator/blob/main/LICENSE)；YanShu 没有复制其完整模板或品牌视觉，而是将方法重新组织为适配本站图型、画布、配色、字体和可读性选项的两步配置流程。

## 安装 YanShu 插件

仓库中的 [`plugins/yanshu-workbench`](./plugins/yanshu-workbench/) 是 YanShu 插件的开发者预览版。当前包含一个正式命名的工作流：**Paper Reconstruction**。

- 从网站同一份配置源生成五轮 Paper Reconstruction Prompt，其中第四轮复用科研绘图的 Method Overview 规则；
- 自动识别或显式接收 TeX、BibTeX、PDF 与 figures 路径；
- 新建 `yanshu-reconstruction/<run-id>/`，保存每轮 Prompt、产物、日志与状态；
- 记录并恢复每轮 Chat 会话地址、实际模型标签和推理档位；
- 默认使用 ChatGPT 当前可见的最新推理模型与最强档位，也可选择 Medium、High、Extra High 或 Pro；
- 所选档位不可用时，先提示用户，再回退到最接近的较低档位；名称无法判断时选择最强可用档位；
- 为每轮生成严格的文件传输白名单；
- 在 Chat 桥接缺失时停在可恢复状态，而不是让 Codex 代写论文。

完整自动执行还需要可见的 ChatGPT 会话与兼容的浏览器桥接。YanShu 已内置并锁定可见 Chat 控制运行时，用户不需要再安装第二个委派插件；它不会绕过登录、验证码或文件权限，也不要求 OpenAI API Key。

### 当前 GitHub 预览版

在 ChatGPT 桌面应用的 Codex 环境或 Codex CLI 中执行一次：

```bash
codex plugin marketplace add panzhzh/yanshu-workbench --ref main
codex plugin add yanshu-workbench@yanshu-workbench
```

已经安装预览版时，更新并重新载入最新版本：

```bash
codex plugin marketplace upgrade yanshu-workbench
codex plugin add yanshu-workbench@yanshu-workbench
```

当前预览版从 **Codex 任务**启动；普通 Chat 对话本身不会直接加载本地插件。启动后，YanShu 再通过可见桥接把论文写作交给 ChatGPT Chat，这正是“Codex 管文件、Chat 写论文”的分层。

安装后必须**新建一个任务**，这样 Codex 才会载入新 Skill。然后直接说：

```text
Use YanShu → Paper Reconstruction.
```

也可以用中文：

```text
使用 YanShu 的 Paper Reconstruction 重构这个论文目录。
```

YanShu 会先确认论文目录；若目录中有多篇论文，只需选择目标论文一次。TeX、BibTeX、PDF 与 figures 唯一后，它会立即打开一个仅运行在 `127.0.0.1` 的本地配置页，不再询问“全自动还是只输出 Prompt”。论文类型、字数、章节预算、附录、框架图、Prompt 语言与推理偏好都在同一页完成，右侧实时展示可切换语言、展开和复制的五轮 Prompt。点击“全自动开始”后，YanShu 检查 ChatGPT/Chrome 环境并直接执行；若只想手动使用 Prompt，复制后点击“退出”即可，且不会创建重构目录或传输论文文件。

当前 GitHub 技术安装 ID 仍为 `yanshu-workbench`，用户看到的插件名称是 **YanShu**。未来进入 OpenAI 公共插件目录后，安装路径将简化为 **Plugins → 搜索 YanShu → 安装 → 新建任务**。插件的官方安装与使用方式可参考 [OpenAI Plugins 文档](https://learn.chatgpt.com/docs/plugins)。

### 模型与推理档位为什么不写死

模型名称会持续更新，因此网站和 `.yanshu.json` 只保存稳定意图：

```json
{
  "modelPolicy": "latest-visible-reasoning",
  "reasoningPreference": "strongest",
  "fallbackPolicy": "closest-lower-then-strongest"
}
```

运行时以 ChatGPT 真实可见的选择器为准，而不是根据 Plus、Pro 等套餐名称猜测。比如用户选择 Extra High 或 Pro，但页面只显示 Medium 与 High，YanShu 会明确说明并使用 High；若新名称无法可靠分类，则使用选择器中最强的可用档位。

每一轮都会先显式新建独立的空白 Chat，再在该会话中选择推理档位并传入文件，不会修改用户原本打开的聊天。YanShu 优先通过 ChatGPT 可见的文件选择器传入白名单中的 `.tex`、`.bib`、`.pdf` 与图件，并逐张核对附件卡；Windows 文件对象剪贴板粘贴保留为后备路径。文件始终作为真实附件传递，不会被摊平成一段巨型文本。如果 ChatGPT 已接受准确的档位点击、但新版界面暂时无法回读当前标签，YanShu 会将其记录为 `click-acknowledged` 并继续；只有选项未找到、点击失败、新会话未建立或回读明确冲突时才暂停。

## 论文模板策略

论文初稿默认使用 [`kourgeorge/arxiv-style`](https://github.com/kourgeorge/arxiv-style) 作为 arXiv 预印本排版基础。该仓库使用 MIT License，但它是第三方预印本样式，并非 arXiv 官方格式要求。

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
    │   ├── reconstruction/     # 论文重构入口
    │   ├── figures/            # 科研绘图配置与 Prompt
    │   ├── submission/         # 投稿策略筛选与 Prompt
    │   └── ...                 # 首页、全站导航与共用组件
    ├── content/prompts/        # 重构模板、变量模型与字数规则
    ├── public/                 # 站点静态资源
    └── tests/                  # 构建产物与产品约束测试
```

## 接下来

- [x] 简洁首页与顶部导航
- [x] 论文初稿工作台
- [x] 论文重构工作台
- [x] 独立科研绘图 Prompt
- [x] 投稿目标筛选与官网核验 Prompt
- [x] 可恢复的五轮论文重构插件基础
- [ ] 浏览器桥接的一体化安装与首次使用向导
- [ ] 审稿意见分析、Rebuttal 与 Response to Reviewers
- [ ] Camera-ready、匿名与可复现性检查
- [ ] 更细的会议、期刊和出版商配置
- [ ] 关于研术台与方法说明

## 使用边界

站内的篇幅、结构和筛选设置是通用产品预设，不代表任何具体 venue 的官方要求。会议和期刊规则会变化，投稿前必须以目标 venue 最新官网、作者指南和正式模板为准。

发现规则冲突、文案问题或希望增加新的科研场景，欢迎提交 [Issue](https://github.com/panzhzh/yanshu-workbench/issues)。

---

<div align="center">
  <sub>YanShu · Research methods and interactive tools for CS researchers.</sub>
</div>
