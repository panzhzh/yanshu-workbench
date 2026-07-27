import type { Language } from "../config";

type LocalizedPromptBlock = Record<Language, string>;

export const EXTENDED_FIGURE_TYPE_ADAPTERS = {
  "task-definition": {
    zh: `本次绘制任务定义图：准确说明研究对象、可观察输入、目标输出、实体关系与任务边界。

从 Problem Formulation、Task Definition 或 Method 的正式定义中取证。选择最合适的实例映射、实体关系、集合映射或状态—动作结构，让读者无需了解实现细节就能复述任务。`,
    en: `Create a Task Definition figure that precisely explains the research objects, observable inputs, target outputs, entity relations, and task boundary.

Use the formal definitions in Problem Formulation, Task Definition, or Method. Choose the clearest representative mapping, entity-relation view, set mapping, or state-action structure so readers can restate the task without knowing the implementation.`,
  },
  "training-inference": {
    zh: `本次绘制训练–推理图：区分训练专属、推理专属和两者共享的部分，并说明数据、参数或状态怎样传递。

优先使用上下双轨或共享中心结构；明确监督信号、参数更新与部署时真实保留的路径。只有论文确实存在循环或反馈时才画回路。`,
    en: `Create a Training–Inference figure that separates training-only, inference-only, and shared elements while tracing data, parameters, or state across both phases.

Prefer parallel lanes or a shared-center structure. Make supervision, parameter updates, and the actual deployment path explicit. Show a loop only when the paper truly defines one.`,
  },
  "algorithm-protocol": {
    zh: `本次绘制算法／协议图：呈现初始化、观察、决策、更新、反馈与停止条件。

根据论文选择状态机、循环流程、时序图或交互协议。突出改变状态的关键决策和终止逻辑；普通连续步骤可合并，参与方与消息方向必须明确。`,
    en: `Create an Algorithm / Protocol figure that shows initialization, observation, decision, update, feedback, and termination.

Choose a state machine, iterative flow, sequence diagram, or interaction protocol according to the paper. Emphasize state-changing decisions and stopping logic; merge routine adjacent steps, and make actors and message directions unambiguous.`,
  },
  "data-construction": {
    zh: `本次绘制数据构建图：追踪数据来源、筛选或清洗、转换、标注、质量控制和最终样本结构。

让读者能判断每一步改变了什么，以及哪些步骤会筛除或分流数据。用代表性数据对象或样例辅助理解；只有论文提供数字时才显示数量。`,
    en: `Create a Data Construction figure that traces provenance, filtering or cleaning, transformation, annotation, quality control, and the final sample structure.

Make clear what each stage changes and where data is filtered or branched. Use representative data objects or examples when helpful, and show counts only when the paper provides them.`,
  },
  "system-deployment": {
    zh: `本次绘制系统／部署图：说明运行实体、部署边界、离线准备、在线服务和通信关系。

优先采用带边界的系统拓扑或离线／在线双区结构。清楚区分存储、计算、客户端、服务端与外部系统，并标明关键消息或数据流向。`,
    en: `Create a System / Deployment figure that explains runtime entities, deployment boundaries, offline preparation, online serving, and communication.

Prefer a bounded system topology or an offline/online split. Clearly distinguish storage, computation, clients, servers, and external systems, and label the important message or data directions.`,
  },
  "theory-concept": {
    zh: `本次绘制理论／概念关系图：准确表达形式对象之间的包含、依赖、等价、分解、约束或推导关系。

从定义、命题或定理中选择最合适的集合关系、依赖图、推导链或概念格。视觉编码必须与关系类型一致；不要把相关性画成因果关系。`,
    en: `Create a Theory / Concept Relations figure that accurately represents inclusion, dependency, equivalence, decomposition, constraint, or derivation among formal objects.

Choose a set relation, dependency graph, derivation chain, or concept lattice from the paper's definitions, propositions, or theorems. Match visual encoding to the actual relation type and never turn association into causality.`,
  },
  "geometry-coordinate": {
    zh: `本次绘制几何／坐标关系图：展示坐标系、空间实体、已知与未知变换、投影关系以及估计目标。

使用清楚的坐标框架、几何对象、视锥或投影路径。区分参考系并保持箭头方向、下标和变换记号与论文一致；只画理解目标所需的几何元素。`,
    en: `Create a Geometry / Coordinate figure that shows coordinate frames, spatial entities, known and unknown transforms, projection relations, and the estimation target.

Use clean coordinate frames, geometric objects, frusta, or projection paths. Distinguish reference frames and preserve the paper's arrow directions, subscripts, and transform notation. Draw only the geometry needed to understand the target.`,
  },
  "survey-taxonomy": {
    zh: `本次绘制综述／分类体系图：组织论文采用的分类轴、主要类别、交叉关系和由正文支持的研究空白。

根据真实分类结构选择树、二维矩阵、分层版图或多轴地图。类别重叠时必须如实表达，不要强行画成互斥树；代表性方法名只用于帮助定位。`,
    en: `Create a Survey / Taxonomy figure that organizes the paper's classification axes, principal categories, overlaps, and evidence-backed gaps.

Choose a tree, two-dimensional matrix, layered landscape, or multi-axis map according to the actual taxonomy. Represent overlapping categories honestly instead of forcing an exclusive tree; use representative method names only as anchors.`,
  },
} as const satisfies Record<string, LocalizedPromptBlock>;
