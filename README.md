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

YanShu 同时提供插件执行层：每个 `$子技能` 都从网站同一份数据中解析 Prompt，并在当前 Codex 或 CLI 任务直接读取材料、生成真实产物、编译和核验。插件不会自动打开配置网页、内部 JSON 或额外聊天。

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

3. YanShu 只确认真正有歧义的材料。已在请求中说明的偏好会直接采用，未说明项使用官网默认值；只有会实质改变结果且无法推断时，才合并成一次简短询问。随后在当前任务直接执行。

首页也提供相同的动态三步演示和十个核心工作流的可复制启动语。

## 一个 YanShu，多项科研工作流

`YanShu` 是总品牌和总插件，不等同于某一个具体任务。插件包含多个可独立触发的子 Skill；输入 `$skill-name` 即可精确调用：

| 层级 | 当前名称 | `$` 调用 | 作用 |
| --- | --- | --- | --- |
| 总入口 | **YanShu** | — | 安装、发现和协调科研工作流 |
| 选题 | **Idea Discovery** | `$idea-discovery` | 近期文献检索、候选去重、风险判断与最小验证实验 |
| 写作 | **Paper Drafting** | `$paper-drafting` | 从完成的实验材料生成可编译 LaTeX 初稿 |
| 写作 | **Citation Audit** | `$citation-audit` | 核验 Claim–引用关系、补足真实缺口并检查 BibTeX |
| 重构 | **Paper Reconstruction** | `$paper-reconstruction` | 单次全文重构、四个内部步骤与原稿质量回归 |
| 绘图 | **Scientific Figure** | `$scientific-figure` | 从论文证据生成一张高清科研示意图 |
| 矢量化 | **Image to SVG** | `$image-to-svg` | 将一张位图按原尺寸与构图重建为 Calibri 文字、可编辑且经过回渲染核验的 SVG |
| 图表 | **Experimental Plotting** | `$experimental-plotting` | 从真实实验数据生成可复现的出版级代码图 |
| 审校 | **Peer Review** | `$peer-review` | 独立检查贡献、方法、证据、结论边界和可复现性 |
| 审校 | **Revision Planning** | `$revision-planning` | 合并审稿意见并形成优先级、实验决策与修改顺序 |
| 审校 | **Revision Audit** | `$revision-audit` | 逐条核验回复信或 rebuttal 与实际修改是否闭环 |

插件清单、Skill 文件和内部标识统一使用英文，便于公开分发；与用户的问答语言以及 Prompt 输出语言仍可选择中文或英文。

## 当前工作台

| 模块 | 适用阶段 | 当前能力 |
| --- | --- | --- |
| [Idea 查找](https://yanshu-workbench.pages.dev/ideas/discovery/) | 尚未确定选题 | 默认优先检索近 2 年顶会论文并生成 2 个候选；支持自定义时间窗、venue、数据集、SOTA 目标和资源边界，最终输出中英文 Markdown |
| [Idea 评估与优化](https://yanshu-workbench.pages.dev/ideas/evaluation/) | 已有初步 Idea | 从新颖性、意义、有效性、可行性、竞争时机与复现条件进行压力测试；默认保留核心问题与机制并融合优化 |
| [全文初稿](https://yanshu-workbench.pages.dev/draft/) | 实验已经完成 | 从证据材料生成完整、可编译的英文 LaTeX 初稿；arXiv 默认样式或当届顶会官方模板 |
| [引文核查与补充](https://yanshu-workbench.pages.dev/writing/citations/) | 引言或相关工作引用需要核验 | 默认重点检查 Introduction 与 Related Work，区分作者自身 Claim 与外部 Claim；支持目标 venue、35–40 篇参考量、近三年占比、预印本与来源质量配置 |
| [写作精修](https://yanshu-workbench.pages.dev/writing/polishing/) | 完成稿需要投稿前语言精修 | 聚焦冗余、机械化表达、防御性写作、术语与语言专业度，保持研究逻辑、整体结构和作者声音 |
| [全文重构](https://yanshu-workbench.pages.dev/reconstruction/) | 已有论文或初稿 | 可选常用 CCF A/B 会议、期刊或自定义目标；一个 Prompt 连续完成科学定位、方法实验、前后叙事与原稿质量回归，只交付最终 TeX、BibTeX 和中文说明 |
| [章节精修](https://yanshu-workbench.pages.dev/reconstruction/refinement/) | 需要精修单章或合并实验叙事 | 按 Abstract、Introduction、Related Work、Method、Experiments & Results、Discussion、Conclusion 分别生成章节专用 Prompt |
| [专项审计](https://yanshu-workbench.pages.dev/reconstruction/audit/) | 论文接近终稿 | 可组合审计术语、引用与 BibTeX、数据、图表、Claim–证据、符号、可复现性和跨章节重复 |
| [分章节写作](https://yanshu-workbench.pages.dev/writing/sections/) | 从提纲或局部证据撰写章节 | 根据章节功能显示专用配置，覆盖贡献列表、引用核验、Method Overview、伪代码、图表对应段落和 Discussion 主题 |
| [TeX 模板迁移](https://yanshu-workbench.pages.dev/reconstruction/conversion/) | 更换投稿模板 | 下载并核验目标 venue 最新官方 LaTeX 模板，在不修改论文内容的前提下完成可编译迁移与一致性验收 |
| [实验方案设计](https://yanshu-workbench.pages.dev/experiments/design/) | 实验尚未完整落地 | 从研究问题、资源和证据边界生成主实验、对照、消融、稳健性和停止条件 |
| [Baseline 与复现](https://yanshu-workbench.pages.dev/experiments/baselines/) | 需要选择公平对照并复现 | 优先核验官方论文与仓库，明确同协议重跑、可比性、公平调参和失败记录 |
| [实验代码](https://yanshu-workbench.pages.dev/experiments/code/) | 需要实现可运行实验 | 按仓库环境、实现范围、配置与测试要求生成代码任务，保留可追溯日志和运行入口 |
| [结果分析](https://yanshu-workbench.pages.dev/experiments/results/) | 已有表格、日志或统计结果 | 区分观察、解释与推测，按主结果、消融、效率、稳健性和失败案例组织证据 |
| [可复现性](https://yanshu-workbench.pages.dev/experiments/reproducibility/) | 准备交付代码与实验材料 | 检查环境、随机性、数据、命令、产物和独立复现路径，生成可验证清单 |
| [科学示意图](https://yanshu-workbench.pages.dev/figures/) | 需要论文插图 | 方法总览图默认，并提供引言、任务定义、核心机制、流程、系统与专业图型；参考图默认关闭，开启后才把视觉样式参考规则写入 Prompt |
| [图片转 SVG](https://yanshu-workbench.pages.dev/figures/image-to-svg/) | 需要把位图转换为可编辑矢量文件 | 按原图尺寸、构图、层级和颜色进行 1:1 视觉复刻；文字固定为 Calibri，默认纯矢量并通过回渲染差异反复校验 |
| [实验绘图](https://yanshu-workbench.pages.dev/figures/plots/) | 需要从数据生成统计图 | 以真实数据和绘图代码为核心，配置统计表达、组合图与 1–3 个默认子图、精确科研配色、图型策略和导出格式，不调用生图模型 |
| [论文表格](https://yanshu-workbench.pages.dev/figures/tables/) | 需要整理结果或对比表 | 逐格核对数值与单位，配置表格职责、排序、高亮、显著性和单栏/双栏可读性 |
| [图表审计](https://yanshu-workbench.pages.dev/figures/audit/) | 图表接近交付 | 联合检查数据、caption、正文引用、标签、可读性和一致性；安全修复只触及已确认错误及其直接依赖 |
| [投稿定位](https://yanshu-workbench.pages.dev/submission/) | 论文接近终稿 | 先判断论文类别，再按 OA、APC、IF、综述文章、分区和收录等条件动态筛选；默认排除 MDPI、Hindawi 与 Frontiers，也可关闭该排除条件 |
| [投稿前终检](https://yanshu-workbench.pages.dev/submission/check/) | 即将提交 | 以目标 venue 最新官方规则为准，检查格式、匿名、材料、伦理、可复现性和阻塞项 |
| [投稿材料](https://yanshu-workbench.pages.dev/submission/materials/) | 需要准备附加材料 | 仅生成所选 cover letter、highlights、声明等材料；作者元数据缺失时保留明确占位，不得补造 |
| [审稿](https://yanshu-workbench.pages.dev/submission/review/) | 投稿前独立评估 | 不区分会议与期刊，从贡献、方法、证据、结论边界、表达和可复现性生成分级审稿报告，不修改论文 |
| [返修规划](https://yanshu-workbench.pages.dev/submission/revision/) | 收到审稿意见后 | 拆分并合并多位 reviewer 意见，完成 P0/P1/P2 与 A/B/C/D 分类，规划最小实验、风险和修改顺序；不提前写回复信 |
| [返修稿审查](https://yanshu-workbench.pages.dev/submission/revision-audit/) | 完成回复与修改后 | 逐条核查 reviewer concern、回复主张、修改稿与 diff，区分期刊返修和会议 rebuttal |
| YanShu 插件 | 需要直接执行 | 十个核心子 Skill 均使用官网同源配置和 Prompt，并在当前 Codex/CLI 任务执行；不自动打开网页、JSON 或额外 Chat |

## 设计原则

- **配置驱动**：数字、结构与规则集中维护，不把产品逻辑散落在界面里。
- **一项 Prompt，一项任务**：降低一次对话承担多个目标造成的遗漏与混乱。
- **证据优先**：不得补造实验、引用、方法细节、投稿信息或图中术语。
- **模板可追溯**：顶会模板必须在执行时从当届官网或官方 author kit 核验。
- **中英文独立**：界面语言与 Prompt 语言分别建模，不依赖运行时机器翻译。
- **克制可读**：服务长文本阅读、快速配置和复制，不采用营销页或普通 SaaS 后台视觉。
- **轻量交付优先**：Skill 默认在当前任务处理，只保留真正产物并在聊天中给出概要，不为留痕生成无用文件。
- **源稿保护**：需要写文件的流程使用新目录或新文件名；原始论文、实验数据和已有运行保持只读。

## 安装 YanShu 插件

仓库中的 [`plugins/yanshu-workbench`](./plugins/yanshu-workbench/) 是 YanShu 插件。当前提供十个独立子 Skill：

| Skill | 启动语示例 |
| --- | --- |
| **Idea Discovery** | `使用 $idea-discovery 在当前工作区查找研究 Idea。` |
| **Paper Drafting** | `使用 $paper-drafting 根据这个实验目录撰写论文初稿。` |
| **Citation Audit** | `使用 $citation-audit 核查并补充这个论文目录中的引文。` |
| **Paper Reconstruction** | `使用 $paper-reconstruction 重构这个论文目录。` |
| **Scientific Figure** | `使用 $scientific-figure 为这个论文目录绘制一张科研配图。` |
| **Image to SVG** | `使用 $image-to-svg 将这张图片 1:1 复刻为 SVG。` |
| **Experimental Plotting** | `使用 $experimental-plotting 根据这个实验目录绘制论文实验图。` |
| **Peer Review** | `使用 $peer-review 审稿这个论文目录。` |
| **Revision Planning** | `使用 $revision-planning 整理这些审稿意见并制定返修计划。` |
| **Revision Audit** | `使用 $revision-audit 审查这份返修稿和回复信。` |

安装：

```bash
codex plugin marketplace add panzhzh/yanshu-workbench --ref main
codex plugin add yanshu-workbench@yanshu-workbench
```

更新：

```bash
codex plugin marketplace upgrade yanshu-workbench
codex plugin add yanshu-workbench@yanshu-workbench
```

安装或更新后新建一个 Codex 任务以载入最新 Skill。每次调用会先静默完成版本握手，再通过 `workflow-resolve` 从网站同源运行时解析完整 Prompt。解析结果只在内部读取，不会打开配置页、JSON 文件、浏览器或额外 Chat；当前任务就是执行器。

Idea Discovery 的中英文 Markdown、Paper Drafting 的 LaTeX/PDF、Scientific Figure 的 PNG、Image to SVG 的可编辑 SVG 和 Experimental Plotting 的代码与图件属于真实交付。Peer Review、Revision Planning 与 Revision Audit 默认直接在聊天中返回结果。Paper Reconstruction 在新目录中只保存三项最终文件，不建立 Round 目录或中间稿：

```text
<base_name>_restructured.tex
<base_name>_restructured.bib
<base_name>_restructuring_report_zh.md
```

Paper Drafting 与 Experimental Plotting 可选使用两个外部增强 Skill。首次缺失时，YanShu 只询问一次，并且只安装 `research-paper-writing` 与 `nature-figure` 两个明确子目录，不安装完整第三方仓库。Scientific Figure 不使用它们。

安装时可选择授权 GitHub 支持操作。若宿主已经提供专用、幂等的 Star 能力，YanShu 只确保公开仓库 `panzhzh/yanshu-workbench` 已被收藏一次，永不调用 Unstar；缺少授权或用户拒绝都不会阻塞科研流程。

网站配置与插件运行时通过 `npm run plugin:check` 做逐字节同步检查。网站适合调整并复制 Prompt；插件适合直接读取本地材料和完成产物闭环。


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
│   └── yanshu-workbench/      # YanShu 插件、十个子 Skill 与官网同源运行时
└── site/
    ├── app/
    │   ├── draft/              # 论文初稿配置与 Prompt
    │   ├── ideas/              # Idea 查找、评估与优化
    │   ├── writing/            # 分章节写作、引文核查与写作精修
    │   ├── reconstruction/     # 全文重构、精修、审计与 TeX 模板迁移
    │   ├── experiments/        # 实验设计、复现、代码、分析与可复现性
    │   ├── figures/            # 科研示意图、图片转 SVG、实验图、表格与图表审计
    │   ├── submission/         # 投稿定位、终检、材料、审稿与返修
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
- [x] 全文重构、章节精修、专项审计、分章节写作与 TeX 模板迁移
- [x] 实验设计、Baseline 复现、实验代码、结果分析与可复现性
- [x] 科学示意图、图片转 SVG、实验绘图、论文表格与图表审计
- [x] 投稿定位、投稿前终检、投稿材料、审稿、返修规划与返修稿审查
- [x] 单任务、四个内部步骤的论文重构与原稿质量回归
- [x] 十个核心子 Skill 使用网站同源配置；初稿与实验绘图支持可选外部增强
- [x] 所有子 Skill 在当前 Codex/CLI 任务直接执行，不打开本地配置页或内部 JSON
- [ ] 为更多专项工作台补充直接执行的子 Skill
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
| [PLOS · Ten simple rules for structuring papers](https://doi.org/10.1371/journal.pcbi.1005619) | CC BY | 写作精修中的全文主线、章节功能、段落落点与结果叙事 |
| [MIT EECS Communication Lab · Introduction / Results](https://mitcommlab.mit.edu/eecs/commkit/journal-or-conference-paper/) | 公开写作指南 | Introduction 的问题—动机—方案—贡献，以及 Results 的 rationale—finding—transition |
| [Nature Portfolio · How to write your paper](https://www.nature.com/nature-portfolio/for-authors/write) | 作者指南 | 术语负担、复杂句、可读性和冗长 figure legends 的诊断依据 |
| [IEEE · Editing Mathematics](https://journals.ieeeauthorcenter.ieee.org/wp-content/uploads/sites/7/Editing-Mathematics.pdf) | 作者指南 | 公式作为句子组成部分、公式标点与数学叙述的诊断依据 |
| [University of Manchester · Academic Phrasebank](https://www.phrasebank.manchester.ac.uk/) | 公开写作资源 | 文献综合、谨慎表达、比较、结果报告与章节语言功能 |

---

<div align="center">
  <sub>YanShu · Research methods and interactive tools for CS researchers.</sub>
</div>
