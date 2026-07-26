import type { Language } from "../config";

type LocalizedPromptBlock = Record<Language, string>;

export const EXTENDED_FIGURE_TYPE_ADAPTERS = {
  "task-definition": {
    zh: `# Figure-Type Adapter — Task and Problem Formulation Figure

本次只设计任务定义图。

## 图的职责

这张图必须让读者在不进入方法实现的情况下准确理解：

1. 论文处理的基本对象、样本或环境是什么；
2. 模型能够观察到什么输入；
3. 需要预测、生成、检索、控制或恢复什么输出；
4. 输入、实体、关系、标签、状态或动作之间如何组织；
5. 论文正式定义的任务边界和约束是什么。

它不是引言动机图，也不是方法架构图。

## 证据范围

优先读取：

- Problem Formulation；
- Task Definition；
- Preliminaries；
- Dataset 或 Annotation Schema 中与标签定义有关的内容；
- Method 开头对输入输出的正式说明。

Abstract 和 Introduction 只能用于理解背景，不能代替正式任务定义。

## 推荐视觉语法

根据论文真实任务选择一种主要结构：

- representative instance → structured input → structured output；
- entities and relations；
- observation → latent target → required prediction；
- source modality → aligned objects → output schema；
- state → action → transition；
- query → candidate evidence → target answer；
- nested labels or hierarchical output；
- coordinate frames and target variables。

优先使用一个代表性样例、关系图、结构化 tuple、输出 schema 或输入输出映射。

不要使用通用的 Input → Model → Output 三个空框。

## 内容预算

默认限制为：

- 2–4 个主要区域；
- 6–10 个主要视觉对象；
- 8–14 个可见标签；
- 0–2 个正式定义或公式；
- 4–8 条关键关系；
- 最多一个代表性样例。

## 必须呈现

优先保留：

- 正式输入；
- 正式输出；
- 核心实体；
- 输出结构；
- 标签或关系方向；
- 已知量、未知量或约束；
- 一个能帮助读者理解任务的代表性映射。

## 不得呈现

- 现有方法的失败故事；
- 本文方法模块；
- backbone、encoder、loss 或训练阶段；
- 实验结果和数据统计；
- baseline；
- 不属于任务定义的实现细节。

最终英文制图 Prompt 控制在约 450–750 个英文词。`,
    en: `# Figure-Type Adapter — Task and Problem Formulation Figure

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

- representative instance → structured input → structured output;
- entities and relations;
- observation → latent target → required prediction;
- source modality → aligned objects → output schema;
- state → action → transition;
- query → candidate evidence → target answer;
- nested labels or hierarchical output;
- coordinate frames and target variables.

Prefer one representative instance, relation graph, structured tuple, output schema, or input–output mapping.

Do not use three empty boxes labeled Input → Model → Output.

## Content budget

Default limits:

- 2–4 principal regions;
- 6–10 principal visual objects;
- 8–14 visible labels;
- 0–2 formal definitions or equations;
- 4–8 key relations;
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

Keep the final English image-generation prompt to approximately 450–750 words.`,
  },
  "training-inference": {
    zh: `# Figure-Type Adapter — Training and Inference Figure

本次只设计训练–推理关系图。

## 图的职责

这张图必须清楚说明：

1. 训练阶段接收哪些数据、标签或辅助信号；
2. 哪些组件或分支仅在训练时存在；
3. 哪些参数或表示在训练与推理之间共享；
4. 哪些组件在训练后被冻结、删除或保留；
5. 推理阶段的真实输入、计算路径和输出是什么。

它不是完整方法总览图，不需要重新绘制所有模块内部结构。

## 证据范围

优先读取：

- Training Objective；
- Optimization；
- Inference；
- Implementation Details 中与阶段差异有关的部分；
- Method 中明确标记 training-only、inference-only、frozen 或 shared 的内容。

不得根据常见训练范式推测不存在的 teacher、loss、pseudo-label 或冻结过程。

## 推荐视觉语法

优先采用：

- 上方 training lane、下方 inference lane；
- 左侧共享模块、右侧阶段专属分支；
- 一个共享计算 rail 连接两个阶段；
- training-only supervision 以明确的辅助连接表示；
- 从 trained parameters 到 inference path 的冻结或继承关系。

不要把整个方法在上下两条轨道完整复制两遍。

共享模块只绘制一次，并通过 shared、reused 或 frozen connection 表达复用。

## 内容预算

默认限制为：

- 2 条主轨道；
- 6–12 个主要视觉对象；
- 10–16 个可见标签；
- 0–2 个核心 loss 或训练目标；
- 6–10 条关键连接；
- training-only 分支不超过总面积的 30%。

## 视觉语义

必须明确区分：

- trainable；
- frozen；
- training-only；
- inference-only；
- shared；
- discarded after training。

这些区别不能只依赖颜色，还应通过位置、边界、线型或直接标签表达。

## 不得呈现

- 全部 Method 细节；
- 每个 loss 的完整推导；
- 优化器、学习率和 epoch；
- 实验表现；
- 训练曲线；
- 与训练–推理差异无关的辅助模块。

最终英文制图 Prompt 控制在约 500–850 个英文词。`,
    en: `# Figure-Type Adapter — Training and Inference Figure

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
- 6–12 principal visual objects;
- 10–16 visible labels;
- 0–2 core losses or training objectives;
- 6–10 key connections;
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
- auxiliary modules unrelated to the training–inference difference.

Keep the final English image-generation prompt to approximately 500–850 words.`,
  },
  "algorithm-protocol": {
    zh: `# Figure-Type Adapter — Algorithm, Decision, or Protocol Figure

本次只设计算法、决策或协议过程图。

## 图的职责

这张图必须说明一个过程如何执行：

1. 初始状态、输入或声明条件是什么；
2. 每一步能够观察什么；
3. 执行什么决策、更新或变换；
4. 新状态如何反馈到下一步；
5. 何时停止、接受、拒绝、冻结或输出；
6. offline preparation 与 online execution 是否存在边界。

它不是神经网络架构图，也不是代码流程图。

## 首先识别过程类型

根据论文真实结构选择：

- iterative update；
- sequential decision；
- declare–select–freeze–evaluate protocol；
- propose–verify–revise；
- retrieve–rank–decide；
- observe–act–transition；
- initialize–optimize–terminate；
- calibrate–evaluate–correct；
- planning–execution–feedback。

只选择一个主过程。

## 推荐视觉语法

优先使用：

- 初始状态；
- 一组关键状态快照；
- 一个 update 或 decision 核心；
- 一条真实反馈回路；
- 一个 stopping or acceptance boundary；
- 一个最终输出。

只有真实循环才绘制 loop。不得为了视觉复杂性添加反馈箭头。

对于 protocol 类论文，应强调阶段边界、数据隔离、冻结时刻和比较关系，而不是把它画成 learned model。

## 内容预算

默认限制为：

- 3–6 个核心阶段；
- 7–12 个主要视觉对象；
- 10–16 个可见标签；
- 1–3 个更新、约束或停止公式；
- 最多一个主循环；
- 6–12 条关键连接。

## 必须呈现

- state 或 process input；
- update / decision；
- observation or evidence；
- stopping or transition condition；
- output；
- 必要的 offline / online 边界。

## 不得呈现

- 逐行伪代码；
- 所有 if–else；
- 每一个中间变量；
- 代码函数名；
- 超参数；
- 实验性能；
- 不存在的训练过程；
- 将不同 comparator 或 variant 误画成连续执行阶段。

最终英文制图 Prompt 控制在约 550–900 个英文词。`,
    en: `# Figure-Type Adapter — Algorithm, Decision, or Protocol Figure

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
- declare–select–freeze–evaluate protocol;
- propose–verify–revise;
- retrieve–rank–decide;
- observe–act–transition;
- initialize–optimize–terminate;
- calibrate–evaluate–correct;
- planning–execution–feedback.

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

- 3–6 core stages;
- 7–12 principal visual objects;
- 10–16 visible labels;
- 1–3 update, constraint, or stopping equations;
- at most one principal loop;
- 6–12 key connections.

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
- every if–else branch;
- every intermediate variable;
- code function names;
- hyperparameters;
- experimental performance;
- a training process that does not exist;
- different comparators or variants misrepresented as consecutive execution stages.

Keep the final English image-generation prompt to approximately 550–900 words.`,
  },
  "data-construction": {
    zh: `# Figure-Type Adapter — Data Construction and Annotation Figure

本次只设计数据构建、标注或数据治理流程图。

## 图的职责

这张图必须说明：

1. 原始数据来自哪些真实来源；
2. 数据经历哪些筛选、清洗、切分或转换；
3. 标签、伪标签或结构化标注如何产生；
4. 人工与自动步骤如何配合；
5. 质量控制、冲突处理和去重如何进行；
6. 最终形成什么样的数据单位、标签结构或发布版本。

它不是数据统计图，也不是实验设置图。

## 推荐视觉语法

根据真实流程选择：

- source provenance → filtering funnel → annotation → quality control → release；
- multiple sources → normalization → alignment → merge；
- automatic proposal → human review → adjudication；
- raw multimodal item → synchronized components → structured sample；
- weak label → verification → accepted / rejected branches。

使用数据血缘、漏斗、分支、汇合、质量门和最终 schema 表达。

## 内容预算

默认限制为：

- 4–6 个主要阶段；
- 8–14 个视觉对象；
- 10–18 个可见标签；
- 0–1 个必要规则公式；
- 8–12 条关键连接。

只有样本数量本身构成数据定义或版本边界时，才允许展示少量确定数量。不得展示实验性能数字。

## 必须区分

- raw source；
- automatic processing；
- human annotation；
- quality control；
- final sample；
- train / validation / test split，只有其划分过程属于数据贡献时才展示。

## 不得呈现

- 模型性能；
- 数据分布柱状图；
- 类别比例图；
- 训练代码；
- 不属于构建过程的模型架构；
- 未在论文中说明的数据来源；
- 将人工步骤伪装成完全自动过程。

最终英文制图 Prompt 控制在约 500–850 个英文词。`,
    en: `# Figure-Type Adapter — Data Construction and Annotation Figure

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

- source provenance → filtering funnel → annotation → quality control → release;
- multiple sources → normalization → alignment → merge;
- automatic proposal → human review → adjudication;
- raw multimodal item → synchronized components → structured sample;
- weak label → verification → accepted / rejected branches.

Use data lineage, funnels, branches, merges, quality gates, and a final schema.

## Content budget

Default limits:

- 4–6 principal stages;
- 8–14 visual objects;
- 10–18 visible labels;
- 0–1 necessary rule equation;
- 8–12 key connections.

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

Keep the final English image-generation prompt to approximately 500–850 words.`,
  },
  "system-deployment": {
    zh: `# Figure-Type Adapter — System and Deployment Architecture Figure

本次只设计系统或部署架构图。

## 图的职责

这张图必须说明：

1. 系统包含哪些运行实体；
2. 它们位于设备端、边缘端、服务器端、云端或外部服务中的哪里；
3. 不同组件发送、接收或存储什么信息；
4. offline 与 online 过程如何分离；
5. 哪些边界涉及隐私、权限、缓存、数据库、工具或外部 API；
6. 用户请求如何形成最终响应或决策。

它不是方法内部算子图，也不是产品宣传图。

## 推荐视觉语法

优先使用：

- horizontal or vertical swimlanes；
- client / edge / server / external-service zones；
- agent / tool / memory / environment interactions；
- offline preparation lane and online serving lane；
- request flow and response flow；
- shared service or storage boundary。

区域必须由真实部署边界定义，而不是为了画面整齐随意分组。

## 内容预算

默认限制为：

- 3–5 个运行区域；
- 8–14 个主要组件；
- 12–18 个可见标签；
- 8–14 条消息或控制连接；
- 0–1 个必要接口 schema。

## 连接语义

每条重要连接应明确属于：

- request；
- data；
- control；
- model update；
- retrieval；
- storage read/write；
- response。

不要把所有连接都画成没有语义的同一种数据箭头。

## 不得呈现

- 与部署无关的完整算法内部细节；
- 具体实验吞吐量和延迟；
- 未实现的服务；
- 营销式云、机器人或用户插画；
- 无来源的网络连接；
- 将 offline training 错画成 online serving。

最终英文制图 Prompt 控制在约 550–900 个英文词。`,
    en: `# Figure-Type Adapter — System and Deployment Architecture Figure

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

- 3–5 runtime regions;
- 8–14 principal components;
- 12–18 visible labels;
- 8–14 message or control connections;
- 0–1 necessary interface schema.

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

Keep the final English image-generation prompt to approximately 550–900 words.`,
  },
  "theory-concept": {
    zh: `# Figure-Type Adapter — Theoretical and Conceptual Relation Figure

本次只设计理论、形式化定义或概念关系图。

## 图的职责

这张图必须帮助读者理解：

1. 论文定义了哪些核心对象；
2. 对象之间存在什么包含、偏序、依赖、等价、分解或约束关系；
3. 哪些假设支持哪些命题；
4. 哪个量能够从另一个量恢复或推导；
5. 哪些概念相似但不能混同；
6. 论文核心结论在形式体系中的位置是什么。

它不是算法执行流程，也不是 Method pipeline。

## 推荐视觉语法

根据论文真实结构选择：

- nested sets；
- partial order；
- dependency DAG；
- assumption → proposition → consequence；
- decomposition identity；
- commutative diagram；
- paired concepts with a separating condition；
- hierarchy of admissible classes；
- relation graph。

不要因为阅读习惯强行使用左到右流水线。

## 内容预算

默认限制为：

- 2–5 个概念区域；
- 6–12 个核心对象；
- 8–16 个可见标签；
- 1–3 个正式公式；
- 5–10 条理论关系。

若标签或公式更多，标记为 HYBRID OR VECTOR RECOMMENDED。

## 关系标签

必须准确区分：

- subset；
- implication；
- equivalence；
- recoverability；
- decomposition；
- condition；
- comparison；
- causal relation。

没有论文证据时不得把普通关联画成因果关系。

## 不得呈现

- 证明全文；
- 长篇 theorem 文字；
- 方法内部实现；
- 实验结果；
- 数值例子，除非它是理解定义不可缺少的反例；
- 将集合包含画成时间执行顺序。

最终英文制图 Prompt 控制在约 450–800 个英文词。`,
    en: `# Figure-Type Adapter — Theoretical and Conceptual Relation Figure

Design only a Theoretical, Formal-Definition, or Conceptual-Relation figure in this task.

## Figure responsibility

The figure must help the reader understand:

1. which core objects the paper defines;
2. which inclusion, partial-order, dependency, equivalence, decomposition, or constraint relations connect them;
3. which assumptions support which propositions;
4. which quantity can be recovered or derived from another;
5. which concepts appear similar but must remain distinct;
6. where the paper’s core conclusion sits in the formal system.

This is neither an algorithm-execution process nor a Method pipeline.

## Recommended visual grammar

Select the structure supported by the paper:

- nested sets;
- partial order;
- dependency DAG;
- assumption → proposition → consequence;
- decomposition identity;
- commutative diagram;
- paired concepts with a separating condition;
- hierarchy of admissible classes;
- relation graph.

Do not force a left-to-right pipeline merely because it is familiar.

## Content budget

Default limits:

- 2–5 conceptual regions;
- 6–12 core objects;
- 8–16 visible labels;
- 1–3 formal equations;
- 5–10 theoretical relations.

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

Keep the final English image-generation prompt to approximately 450–800 words.`,
  },
  "geometry-coordinate": {
    zh: `# Figure-Type Adapter — Geometry and Coordinate-System Figure

本次只设计几何、坐标系或空间关系图。

## 图的职责

这张图必须准确说明：

1. 存在哪些坐标系、传感器或空间实体；
2. 每个量在哪个坐标系中表达；
3. 已知变换和未知变换分别是什么；
4. 点、射线、图像平面、视锥或点云如何对应；
5. 投影、反投影、刚体变换或误差如何形成；
6. 方法最终估计或校正什么几何量。

它不是普通框图。

## 证据范围

优先读取：

- Problem Formulation；
- Coordinate Convention；
- Calibration Setup；
- Geometry；
- Method 中正式定义外参、内参、投影和方向的部分。

若论文没有明确说明 T_AB 与 T_BA 的方向，且方向会改变图义，只提出一个必要问题，不能自行推断。

## 推荐视觉语法

优先使用：

- labeled coordinate axes；
- camera frustum；
- image plane；
- LiDAR or 3D point set；
- rigid-transform arrow；
- projection rays；
- source and target frames；
- initial misalignment and corrected alignment；
- local zoom-in of projected correspondence。

几何对象必须承担主要表达，文字卡片只能作为辅助。

## 内容预算

默认限制为：

- 2–4 个空间区域；
- 6–12 个几何对象；
- 8–15 个可见标签；
- 1–3 个关键变换或投影公式；
- 5–10 条几何关系。

## 必须保证

- 坐标轴方向一致；
- transformation source and target 清楚；
- known / unknown 明确；
- camera、LiDAR、world 或 BEV 坐标不混淆；
- 投影关系和估计目标可追踪；
- 不用透视效果掩盖几何方向。

## 不得呈现

- 无证据的真实传感器外观；
- 与论文不一致的安装位置；
- 错误的变换方向；
- 无意义的 3D 装饰；
- 实验误差数字；
- 定性投影结果；
- 将训练网络结构塞入几何设置图。

最终英文制图 Prompt 控制在约 500–850 个英文词。`,
    en: `# Figure-Type Adapter — Geometry and Coordinate-System Figure

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

If the paper does not establish the direction of T_AB versus T_BA and that direction changes the figure’s meaning, ask one indispensable clarification question rather than inferring it.

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

- 2–4 spatial regions;
- 6–12 geometric objects;
- 8–15 visible labels;
- 1–3 key transformation or projection equations;
- 5–10 geometric relations.

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

Keep the final English image-generation prompt to approximately 500–850 words.`,
  },
  "survey-taxonomy": {
    zh: `# Figure-Type Adapter — Survey Taxonomy and Research-Landscape Figure

本次只设计综述分类体系或研究版图图。

## 图的职责

这张图必须说明：

1. 文献按照哪些核心维度组织；
2. 每个维度下有哪些互斥或可重叠类别；
3. 不同研究路线如何关联；
4. 哪些轴是方法角色、证据来源、决策位置、监督形式或输出类型；
5. 当前研究版图中有哪些明确空白或连接不足。

它不是 PRISMA 流程图，也不是论文数量统计图。

## 证据范围

以综述正文中正式采用的 taxonomy、coding framework、role definition 和 inclusion scope 为准。

不得根据一般领域知识增加论文未采用的分类轴。

## 推荐视觉语法

根据分类结构选择：

- hierarchical taxonomy tree；
- two-axis matrix；
- layered research landscape；
- role → mechanism → output hierarchy；
- orthogonal dimension map；
- small number of intersecting category bands。

如果分类轴彼此正交，优先使用二维矩阵，不要强行画成树。

如果类别允许重叠，必须通过交叉区域、并行标签或多轴结构表达，不能伪装成互斥分支。

## 内容预算

默认限制为：

- 2–4 个分类轴；
- 8–16 个主要类别；
- 12–22 个可见标签；
- 最多 6 个代表性方法名称；
- 0–1 个形式定义；
- 不展示论文数量，除非数量本身是该图的核心目的。

当标签超过 18 个时，默认标记为 VECTOR RECOMMENDED。

## 不得呈现

- 主结果比较；
- 各方法性能；
- PRISMA 数量流程；
- 过长论文列表；
- 未在综述编码体系中使用的分类；
- 将重叠类别错误画成互斥树；
- 用大小或颜色暗示优劣，除非正文明确支持。

最终英文制图 Prompt 控制在约 500–850 个英文词。`,
    en: `# Figure-Type Adapter — Survey Taxonomy and Research-Landscape Figure

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
- role → mechanism → output hierarchy;
- orthogonal-dimension map;
- a small number of intersecting category bands.

If classification axes are orthogonal, prefer a two-dimensional matrix rather than forcing a tree.

If categories overlap, express this through intersections, parallel labels, or a multi-axis structure. Never disguise overlapping categories as mutually exclusive branches.

## Content budget

Default limits:

- 2–4 classification axes;
- 8–16 principal categories;
- 12–22 visible labels;
- at most 6 representative method names;
- 0–1 formal definition;
- no paper counts unless the count itself is the figure’s primary purpose.

When more than 18 labels are necessary, mark the design VECTOR RECOMMENDED by default.

## Excluded content

Do not include:

- primary-results comparisons;
- method performance;
- a PRISMA count flow;
- an excessively long paper list;
- categories absent from the review’s coding framework;
- overlapping categories misrepresented as an exclusive tree;
- size or color implying superiority unless the manuscript explicitly supports it.

Keep the final English image-generation prompt to approximately 500–850 words.`,
  },
} as const satisfies Record<string, LocalizedPromptBlock>;
