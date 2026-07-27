import assert from "node:assert/strict";
import {
  mkdir,
  mkdtemp,
  readFile,
  rm,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { createRequire } from "node:module";
import {
  buildReconstructionWorkflow,
  getReconstructionConfigurationModel,
} from "../runtime/prompt-engine.mjs";
import { importChatGPTControl } from "../vendor/chatgpt-control/import-chatgpt-control.mjs";
import {
  applyChatReasoningSelection,
  autoSelectChatTransferMode,
  inspectFreshChatConfiguration,
  normalizeChatCompletion,
  openFreshChatRound,
  submitPreparedChatRound,
  waitForChatRound,
} from "../scripts/lib/chat-round-protocol.mjs";
import {
  downloadAssistantArtifact,
  normalizeChatArtifactName,
} from "../scripts/lib/chat-artifact-protocol.mjs";
import {
  resolveChatPreference,
  resolveEffectiveChatPreference,
} from "../scripts/lib/chat-preferences.mjs";
import {
  onboardingStatus,
  startOnboardingSession,
} from "../scripts/lib/onboarding-store.mjs";
import {
  artifactBundleSpec,
  importArtifactBundle,
  normalizeDuplicateDownloadName,
} from "../scripts/lib/artifact-bundle.mjs";
import {
  buildFinalManifest,
  countMainTextWords,
  extractBibKeys,
  extractBibliographyStems,
  extractCiteKeys,
  extractGraphics,
  validateRoundConsistency,
} from "../scripts/lib/deliverable-validation.mjs";
import {
  comparePluginVersions,
  resolveCodexExecutable,
} from "../scripts/lib/plugin-update.mjs";
import {
  compareWorkflowVersions,
  inspectPublishedPromptRelease,
} from "../scripts/lib/prompt-release.mjs";
import {
  createRun,
  inspectBibLibraryContinuity,
  loadRun,
  markRound,
  nextRound,
  registerArtifact,
  resolvePaperInputs,
  roundAttachments,
  saveRun,
  summarizeRun,
} from "../scripts/lib/run-store.mjs";

const require = createRequire(import.meta.url);
const nodeLauncher = require("../scripts/node-launcher.cjs");

let zipCrcTable;

function crc32(bytes) {
  if (!zipCrcTable) {
    zipCrcTable = new Uint32Array(256);
    for (let index = 0; index < 256; index += 1) {
      let value = index;
      for (let bit = 0; bit < 8; bit += 1) {
        value =
          value & 1
            ? 0xedb88320 ^ (value >>> 1)
            : value >>> 1;
      }
      zipCrcTable[index] = value >>> 0;
    }
  }
  let value = 0xffffffff;
  for (const byte of bytes) {
    value = zipCrcTable[(value ^ byte) & 0xff] ^ (value >>> 8);
  }
  return (value ^ 0xffffffff) >>> 0;
}

function storedZip(entries) {
  const localRecords = [];
  const centralRecords = [];
  let localOffset = 0;

  for (const [name, text] of Object.entries(entries)) {
    const nameBytes = Buffer.from(name, "utf8");
    const content = Buffer.from(text, "utf8");
    const checksum = crc32(content);
    const local = Buffer.alloc(30 + nameBytes.length + content.length);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0x800, 6);
    local.writeUInt16LE(0, 8);
    local.writeUInt32LE(checksum, 14);
    local.writeUInt32LE(content.length, 18);
    local.writeUInt32LE(content.length, 22);
    local.writeUInt16LE(nameBytes.length, 26);
    nameBytes.copy(local, 30);
    content.copy(local, 30 + nameBytes.length);
    localRecords.push(local);

    const central = Buffer.alloc(46 + nameBytes.length);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(20, 4);
    central.writeUInt16LE(20, 6);
    central.writeUInt16LE(0x800, 8);
    central.writeUInt16LE(0, 10);
    central.writeUInt32LE(checksum, 16);
    central.writeUInt32LE(content.length, 20);
    central.writeUInt32LE(content.length, 24);
    central.writeUInt16LE(nameBytes.length, 28);
    central.writeUInt32LE(localOffset, 42);
    nameBytes.copy(central, 46);
    centralRecords.push(central);
    localOffset += local.length;
  }

  const centralDirectory = Buffer.concat(centralRecords);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(centralRecords.length, 8);
  end.writeUInt16LE(centralRecords.length, 10);
  end.writeUInt32LE(centralDirectory.length, 12);
  end.writeUInt32LE(localOffset, 16);
  return Buffer.concat([...localRecords, centralDirectory, end]);
}

function pngHeader(width, height) {
  const bytes = Buffer.alloc(24);
  Buffer.from("89504e470d0a1a0a", "hex").copy(bytes, 0);
  bytes.writeUInt32BE(width, 16);
  bytes.writeUInt32BE(height, 20);
  return bytes;
}

test("pinned visible Chat bridge bundle loads without external packages", async () => {
  const runtime = await importChatGPTControl({ cacheBust: false });
  assert.equal(typeof runtime.createChatGPT, "function");
});

test("Node launcher resolves a compatible runtime and plugin entry", () => {
  const resolved = nodeLauncher.resolveCompatibleNode();
  assert.ok(resolved.executable);
  assert.ok(resolved.major >= 22);
  assert.match(
    nodeLauncher.resolveEntry("scripts/yanshu.mjs"),
    /plugins[\\/]yanshu-workbench[\\/]scripts[\\/]yanshu\.mjs$/,
  );
});

test("plugin version handshake compares cachebusters and resolves a callable Codex CLI", () => {
  assert.ok(
    comparePluginVersions(
      "0.2.0+codex.20260727120000",
      "0.2.0+codex.20260726120000",
    ) > 0,
  );
  assert.ok(
    comparePluginVersions(
      "0.3.0+codex.20260101000000",
      "0.2.9+codex.20261231235959",
    ) > 0,
  );
  const calls = [];
  const resolved = resolveCodexExecutable((executable, args) => {
    calls.push({ executable, args });
    return {
      status: executable === "codex" ? 0 : 1,
      stdout: "codex-test",
      stderr: "",
    };
  });
  assert.equal(resolved.executable, "codex");
  assert.deepEqual(calls.at(-1).args, ["--version"]);
});

test("visible Chat bridge prefers the verified chooser and keeps native file paste as fallback", async () => {
  const bundle = await readFile(
    new URL(
      "../vendor/chatgpt-control/node/codex-chatgpt-control.bundle.mjs",
      import.meta.url,
    ),
    "utf8",
  );
  assert.match(bundle, /native-file-clipboard-paste/);
  assert.ok(
    bundle.indexOf('name: "add-photos-files-menu-item"') <
      bundle.indexOf('name: "native-file-clipboard-paste"'),
  );
  assert.match(bundle, /Clipboard\]::SetFileDropList/);
  assert.match(bundle, /textbox\.press\("Control\+V"/);
  assert.match(bundle, /div\.__menu-item\[tabindex='0'\]/);
  assert.match(bundle, /route: attempt\.name/);
  assert.match(bundle, /route: "already-attached"/);
  assert.doesNotMatch(bundle, /snapshot === void 0\) \{\s*return \{ ready: true \}/);
  assert.doesNotMatch(bundle, /direct-file-input-set/);
  assert.match(bundle, /case "\.tex":\s*case "\.bib":\s*return \{ mimeType: "text\/plain"/);
  assert.match(bundle, /files\.listLatest/);
  assert.match(bundle, /files\.downloadByArtifactName/);
  assert.match(bundle, /hasResponseActions/);
  assert.match(bundle, /filenameCandidates\.find\(fileLike\)/);
  assert.doesNotMatch(bundle, /guessMimeType\(extension\)/);
});

test("Chat completion semantics normalize ambiguous partial states", async () => {
  assert.equal(
    normalizeChatCompletion({
      ok: false,
      status: "partial",
      data: {
        completionState: "partial",
        generationActive: false,
        text: "Draft",
      },
    }).state,
    "needs_continuation",
  );
  assert.equal(
    normalizeChatCompletion({
      ok: true,
      data: {
        completionState: "complete",
        generationActive: false,
        text: "Done",
      },
    }).state,
    "completed",
  );
  assert.equal(
    normalizeChatCompletion({
      ok: true,
      data: {
        completionState: "partial",
        generationActive: false,
        hasResponseActions: true,
        latestAssistantPreview: "Stable answer",
      },
    }).state,
    "completed",
  );
  const chatgpt = {
    messages: {
      status: async () => ({
        ok: true,
        data: {
          completionState: "generating",
          generationActive: true,
        },
      }),
      waitAndRead: async (args) => ({
        ok: true,
        data: {
          completionState: "complete",
          generationActive: false,
          text: "Finished",
          timeoutMs: args.timeoutMs,
        },
      }),
    },
  };
  const waited = await waitForChatRound(chatgpt, {
    pollIntervalMs: 60_000,
  });
  assert.equal(waited.state, "completed");
  assert.equal(waited.preview, "Finished");

  let waitedAgain = false;
  const stableChat = {
    messages: {
      status: async () => ({
        ok: true,
        data: {
          completionState: "partial",
          generationActive: false,
          hasResponseActions: true,
          latestAssistantPreview: "Artifact ready",
        },
      }),
      waitAndRead: async () => {
        waitedAgain = true;
        throw new Error("Stable completed turns should not be re-polled.");
      },
    },
  };
  const stable = await waitForChatRound(stableChat, {
    pollIntervalMs: 300_000,
  });
  assert.equal(stable.state, "completed");
  assert.equal(waitedAgain, false);
});

test("MCP mode selection is automatic and attachment fallback is verified without confirmation", async () => {
  const mcpChat = {
    tools: {
      select: async () => ({ ok: true, data: { selected: "YanShu" } }),
    },
    messages: {
      ask: async () => ({ ok: true }),
      waitAndRead: async () => ({
        ok: true,
        data: {
          completionState: "complete",
          generationActive: false,
          text: "YANSHU_MCP_READY",
        },
      }),
    },
    files: {
      preflight: async () => {
        throw new Error("Attachment fallback should not run in MCP mode.");
      },
    },
  };
  const mcp = await autoSelectChatTransferMode(mcpChat);
  assert.equal(mcp.ok, true);
  assert.equal(mcp.transferMode, "mcp");

  const attachmentChat = {
    tools: {
      select: async () => ({
        ok: false,
        blocker: { code: "tool_not_visible" },
      }),
    },
    messages: {},
    files: {
      preflight: async ({ paths }) => ({
        ok: true,
        data: {
          files: paths.map((target) => ({
            name: path.basename(target),
            mimeType: "text/plain",
          })),
        },
      }),
      attach: async () => ({ ok: true }),
    },
  };
  const attachment = await autoSelectChatTransferMode(attachmentChat);
  assert.equal(attachment.ok, true);
  assert.equal(attachment.transferMode, "attachments");
  assert.equal(attachment.fallbackReason, "tool_not_visible");
  assert.match(attachment.notice, /automatically/i);
});

test("structured artifact download normalizes browser duplicate suffixes", async () => {
  assert.equal(
    normalizeChatArtifactName("paper_round_5_artifacts (1).zip"),
    "paper_round_5_artifacts.zip",
  );
  assert.equal(
    normalizeDuplicateDownloadName("paper_round_5_artifacts.zip (2)"),
    "paper_round_5_artifacts.zip",
  );
  const chatgpt = {
    files: {
      listLatest: async () => ({
        ok: true,
        data: {
          assistantTurn: 7,
          files: [
            {
              artifactName: "paper_round_5_artifacts (1).zip",
              normalizedArtifactName: "paper_round_5_artifacts.zip",
              assistantIndex: 7,
              type: "archive",
            },
          ],
        },
      }),
      downloadByArtifactName: async () => ({
        ok: true,
        data: {
          path: path.join(
            tmpdir(),
            "paper_round_5_artifacts (1).zip",
          ),
          suggestedFilename: "paper_round_5_artifacts (1).zip",
          bytes: 10,
        },
      }),
    },
  };
  const downloaded = await downloadAssistantArtifact(chatgpt, {
    artifactName: "paper_round_5_artifacts.zip",
    destDir: tmpdir(),
  });
  assert.equal(downloaded.ok, true);
  assert.equal(downloaded.assistantTurn, 7);
});

test("structured artifact download uses the page-assets image fallback for Round 4", async () => {
  const chatgpt = {
    files: {
      listLatest: async () => ({
        ok: true,
        data: { assistantTurn: 4, files: [] },
      }),
    },
    artifacts: {
      listLatest: async () => ({
        ok: true,
        data: {
          artifacts: [
            {
              kind: "image",
              selectorProvenance:
                "pageAssets image inventory",
            },
          ],
        },
      }),
      downloadLatest: async () => ({
        ok: true,
        data: {
          path: path.join(
            tmpdir(),
            "generated-image-1.png",
          ),
          suggestedFilename: "generated-image-1.png",
          bytes: 24,
        },
      }),
    },
  };
  const downloaded = await downloadAssistantArtifact(chatgpt, {
    artifactName:
      "paper_round_4_framework_reconstruction.png",
    destDir: tmpdir(),
  });
  assert.equal(downloaded.ok, true);
  assert.equal(
    downloaded.downloadMode,
    "generated-image-artifact",
  );
  assert.equal(
    downloaded.canonicalArtifactName,
    "paper_round_4_framework_reconstruction.png",
  );
  assert.match(
    downloaded.selected.selectorProvenance,
    /pageAssets/,
  );
});

test("deterministic TeX helpers find citations, graphics, bibliography, and visual-equivalent words", () => {
  const tex = String.raw`
\section{Introduction}
Prior work~\citep{alpha,beta} motivates the study.
\includegraphics{figures/overview.png}
\bibliography{paper_round_5_references}
\begin{figure}\caption{Example}\end{figure}
`;
  assert.deepEqual([...extractCiteKeys(tex)], ["alpha", "beta"]);
  assert.deepEqual(
    [...extractBibKeys("@article{alpha, title={A}}\n@inproceedings{beta,title={B}}")],
    ["alpha", "beta"],
  );
  assert.deepEqual(extractGraphics(tex), ["figures/overview.png"]);
  assert.deepEqual(
    [...extractBibliographyStems(tex)],
    ["paper_round_5_references"],
  );
  const words = countMainTextWords(tex, 200);
  assert.equal(words.visualCount, 1);
  assert.ok(words.totalWords >= 200);
});

test("attachment verification accepts ChatGPT duplicate suffixes without weakening the original name", async () => {
  const runtime = await importChatGPTControl({ cacheBust: true });

  assert.equal(runtime.attachmentDisplayNameMatches("main.tex", "main.tex"), true);
  assert.equal(runtime.attachmentDisplayNameMatches("main.tex", "main (1).tex"), true);
  assert.equal(runtime.attachmentDisplayNameMatches("main.tex", "main(12).tex"), true);
  assert.equal(runtime.attachmentDisplayNameMatches("main.tex", "main.tex (2)"), true);
  assert.equal(runtime.attachmentDisplayNameMatches("main (1).tex", "main (1) (2).tex"), true);
  assert.equal(runtime.attachmentDisplayNameMatches("main.tex", "domain.tex"), false);
  assert.equal(runtime.attachmentDisplayNameMatches("main.tex", "main.tex.backup"), false);
});

test("attachment verification consumes visible filename occurrences as a multiset", async () => {
  const runtime = await importChatGPTControl({ cacheBust: true });
  const matches = runtime.matchAttachmentDisplayNames(
    ["main.tex", "main.tex", "references.bib"],
    ["main.tex · main (1).tex · references (3).bib"],
  );

  assert.deepEqual(
    matches.map(({ name, visible }) => ({ name, visible })),
    [
      { name: "main.tex", visible: true },
      { name: "main.tex", visible: true },
      { name: "references.bib", visible: true },
    ],
  );
  assert.deepEqual(
    matches.map((match) => match.displayName),
    ["main.tex", "main (1).tex", "references (3).bib"],
  );

  assert.deepEqual(
    runtime.matchAttachmentDisplayNames(
      ["README.md", "README.md"],
      ["README.md"],
    ).map((match) => match.visible),
    [true, false],
  );
  assert.deepEqual(
    runtime.matchAttachmentDisplayNames(
      ["README.md", "README.md"],
      ["README.md", "README.md"],
    ).map((match) => match.visible),
    [true, true],
  );
});

test("prompt runtime builds five configuration-driven rounds", () => {
  const workflow = buildReconstructionWorkflow({
    language: "en",
    styleId: "conference",
    hasWordLimit: true,
    targetWords: 4500,
    includeAppendix: true,
    unlimitedCoreSections: false,
    includeSectionNavigationSentence: true,
  });

  assert.equal(workflow.rounds.length, 5);
  assert.equal(workflow.workflowVersion, "2026.07.28");
  assert.deepEqual(
    workflow.rounds.map((round) => round.number),
    [1, 2, 3, 4, 5],
  );
  assert.match(workflow.rounds[0].prompt, /4,500 words/);
  for (const round of workflow.rounds) {
    assert.match(
      round.prompt,
      /Understand this Prompt's objectives, evidence boundaries, and deliverables as a whole/,
    );
  }
  assert.match(
    workflow.rounds[0].prompt,
    /select and apply the best title, full method name, or four-to-seven-letter brand acronym automatically/,
  );
  assert.match(workflow.rounds[0].prompt, /high-risk diff/);
  assert.match(
    workflow.rounds[0].prompt,
    /This paper makes the following three contributions:/,
  );
  assert.match(workflow.rounds[0].prompt, /\\begin\{itemize\}/);
  assert.match(
    workflow.rounds[0].prompt,
    /paper-roadmap paragraph of about 65 words/,
  );
  assert.match(
    workflow.rounds[0].prompt,
    /excluded from the suggested Introduction word count/,
  );
  assert.doesNotMatch(
    workflow.rounds[0].prompt,
    /explicit author selection|wait for manual selection|Candidates are never applied automatically/,
  );
  assert.match(workflow.rounds[0].prompt, /Appendix allowed/);
  assert.match(
    workflow.rounds[0].prompt,
    /Conference prose is compact and claim-first/,
  );
  assert.match(
    workflow.rounds[0].prompt,
    /<base_name>_round_1_artifacts\.zip/,
  );
  assert.match(
    workflow.rounds[0].prompt,
    /complete current BibTeX library/,
  );
  assert.match(
    workflow.rounds[0].prompt,
    /<base_name>_round_1_references\.bib/,
  );
  assert.match(
    workflow.rounds[1].prompt,
    /Preserve every protocol, core result, unfavorable result/,
  );
  assert.match(
    workflow.rounds[1].prompt,
    /never turn its column labels into repeated TeX headings/,
  );
  assert.match(
    workflow.rounds[2].prompt,
    /four consecutive narrative paragraphs/,
  );
  assert.match(
    workflow.rounds[2].prompt,
    /This paper makes the following three contributions:/,
  );
  assert.match(workflow.rounds[2].prompt, /three `\\item` entries/);
  assert.match(
    workflow.rounds[2].prompt,
    /separate paper-roadmap paragraph of about 65 words/,
  );
  assert.equal(workflow.rounds[3].id, "framework-figure");
  assert.match(workflow.rounds[3].prompt, /Visual settings: 2:1 canvas on pure white/);
  assert.match(
    workflow.rounds[3].prompt,
    /use 2–4 accent colors from Tol Vibrant · blue–orange/,
  );
  assert.match(
    workflow.rounds[3].prompt,
    /#0077BB, #EE7733, #009988, #CC3311/,
  );
  assert.doesNotMatch(workflow.rounds[3].prompt, /RGB\(/);
  assert.match(
    workflow.rounds[3].prompt,
    /one dark-neutral color for borders, arrows, and connectors/,
  );
  assert.match(
    workflow.rounds[3].prompt,
    /Calibri, 3 type-size levels/,
  );
  assert.match(
    workflow.rounds[3].prompt,
    /paper-specific lightweight scientific forms or icons are allowed/,
  );
  assert.match(workflow.rounds[3].prompt, /no large in-figure title/);
  assert.match(
    workflow.rounds[3].prompt,
    /<base_name>_round_4_framework_reconstruction\.png/,
  );
  assert.match(
    workflow.rounds[3].prompt,
    /Execution mode: draw directly/,
  );
  assert.match(
    workflow.rounds[3].prompt,
    /Do not print that prompt or wait for confirmation/,
  );
  assert.match(
    workflow.rounds[3].prompt,
    /render an ultra-high-resolution scientific figure with crisp details and legible text for publication/,
  );
  assert.match(
    workflow.rounds[3].prompt,
    /If I also provide an existing framework figure, first summarize its composition, palette, line work, typography, and overall visual language/,
  );
  assert.doesNotMatch(workflow.rounds[3].prompt, /FINAL IMAGE PROMPT/);
  assert.doesNotMatch(workflow.rounds[3].prompt, /Start drawing/);
  assert.equal(
    (workflow.rounds[3].prompt.match(/2:1/g) ?? []).length,
    1,
  );
  assert.doesNotMatch(
    workflow.rounds[3].prompt,
    /_round_4_artifacts\.zip/,
  );
  assert.equal(workflow.rounds[4].id, "final-refinement");
  assert.deepEqual(workflow.config.chatExecution, {
    modelPolicy: "latest-visible-reasoning",
    reasoningPreference: "strongest",
    forceProForAllTurns: false,
    fallbackPolicy: "closest-lower-then-strongest",
    pollingPolicy: {
      strategy: "selected-reasoning-capability",
      intervalMsByCapability: {
        medium: 60_000,
        high: 60_000,
        "extra-high": 180_000,
        pro: 300_000,
      },
      unknownIntervalMs: 60_000,
    },
  });
});

test("framework figure canvas ratio is configuration-driven", () => {
  const workflow = buildReconstructionWorkflow({
    language: "en",
    frameworkFigure: {
      aspectRatioId: "portrait-3-4",
      customAspectWidth: 3,
      customAspectHeight: 4,
    },
  });

  assert.equal(
    workflow.config.frameworkFigure.aspectRatioId,
    "portrait-3-4",
  );
  assert.equal("placementId" in workflow.config.frameworkFigure, false);
  assert.doesNotMatch(workflow.rounds[3].prompt, /paper placement/i);
  assert.match(workflow.rounds[3].prompt, /Visual settings: 3:4 canvas/);
  assert.equal(
    (workflow.rounds[3].prompt.match(/3:4/g) ?? []).length,
    1,
  );
});

test("skill uses one local configuration page and a no-intervention recoverable execution protocol", async () => {
  const skill = await readFile(
    new URL("../skills/paper-reconstruction/SKILL.md", import.meta.url),
    "utf8",
  );
  const bridgeReference = await readFile(
    new URL(
      "../skills/paper-reconstruction/references/chat-bridge.md",
      import.meta.url,
    ),
    "utf8",
  );

  assert.match(skill, /# Paper Reconstruction/);
  assert.match(skill, /Ask for the paper directory/);
  assert.match(skill, /Never select randomly/);
  assert.match(skill, /Runtime and automatic version handshake/);
  assert.match(skill, /node-launcher\.cjs/);
  assert.match(skill, /version-handshake/);
  assert.match(skill, /preserves the Prompt files and `workflowVersion`/);
  assert.match(skill, /configure-start/);
  assert.match(skill, /configure-status/);
  assert.match(
    skill,
    /do not ask for another confirmation/,
  );
  assert.match(skill, /Start full automation/);
  assert.match(skill, /Exit/);
  assert.match(skill, /STATUS\.md/);
  assert.match(skill, /Automatic transport selection/);
  assert.match(skill, /zero-sensitive `yanshu_health`/);
  assert.match(skill, /Never ask the user to choose or confirm the mode/);
  assert.match(skill, /chat-plan/);
  assert.match(skill, /chat-plan --interaction initial/);
  assert.match(skill, /chat-plan --interaction follow-up/);
  assert.match(skill, /forceProForAllTurns/);
  assert.match(skill, /Medium and High: 60 seconds/);
  assert.match(skill, /Extra High: 180 seconds/);
  assert.match(skill, /Pro: 300 seconds/);
  assert.match(skill, /click-acknowledged/);
  assert.match(skill, /waitForChatRound/);
  assert.match(skill, /mcp-start/);
  assert.match(skill, /yanshu_get_round_manifest/);
  assert.match(skill, /yanshu_get_evidence_index/);
  assert.match(skill, /yanshu_view_image/);
  assert.match(skill, /round-finalize/);
  assert.match(skill, /correction-requested/);
  assert.match(skill, /final-manifest\.json/);
  assert.match(bridgeReference, /openYanShuFreshChatRound/);
  assert.match(bridgeReference, /applyYanShuChatReasoningSelection/);
  assert.match(bridgeReference, /submitYanShuPreparedChatRound/);
  assert.match(bridgeReference, /autoSelectYanShuTransferMode/);
  assert.match(bridgeReference, /downloadYanShuArtifact/);
  assert.match(bridgeReference, /files: \[\]/);
  assert.match(
    bridgeReference,
    /pollIntervalMs: yanshuChatPlan\.pollIntervalMs/,
  );
  assert.doesNotMatch(bridgeReference, /timeoutMs: 25_000/);
});

test("paper input detection prefers the current build PDF over archived copies", async () => {
  const temporaryRoot = await mkdtemp(
    path.join(tmpdir(), "yanshu-input-detection-test-"),
  );
  try {
    const paperRoot = path.join(temporaryRoot, "paper");
    const buildRoot = path.join(paperRoot, "build");
    await mkdir(path.join(buildRoot, "arxiv_compile"), { recursive: true });
    await writeFile(
      path.join(paperRoot, "main.tex"),
      "\\documentclass{article}\\begin{document}Test\\end{document}\n",
      "utf8",
    );
    await writeFile(path.join(buildRoot, "main.pdf"), "current", "utf8");
    await writeFile(
      path.join(buildRoot, "arxiv_compile", "main.pdf"),
      "archived",
      "utf8",
    );

    const inputs = await resolvePaperInputs(paperRoot);
    assert.equal(inputs.pdf, path.join(buildRoot, "main.pdf"));
  } finally {
    await rm(temporaryRoot, { recursive: true, force: true });
  }
});

test("local onboarding page confirms a complete automation config", async () => {
  const temporaryRoot = await mkdtemp(
    path.join(tmpdir(), "yanshu-onboarding-test-"),
  );
  try {
    const paperRoot = path.join(temporaryRoot, "paper");
    const figures = path.join(paperRoot, "figures");
    await mkdir(figures, { recursive: true });
    await writeFile(
      path.join(paperRoot, "main.tex"),
      "\\documentclass{article}\\begin{document}Test\\end{document}\n",
      "utf8",
    );
    await writeFile(path.join(paperRoot, "references.bib"), "", "utf8");
    await writeFile(path.join(paperRoot, "main.pdf"), "pdf fixture", "utf8");
    await writeFile(path.join(figures, "overview.png"), "png fixture", "utf8");

    const inputs = await resolvePaperInputs(paperRoot);
    const pluginRoot = path.resolve(
      new URL("..", import.meta.url).pathname,
    );
    const started = await startOnboardingSession({
      pluginRoot,
      projectRoot: paperRoot,
      inputs,
      uiLanguage: "zh",
      openBrowser: false,
      sessionRoot: path.join(temporaryRoot, "sessions"),
      ttlMs: 30_000,
    });

    assert.equal(started.status, "ready");
    assert.match(started.url, /^http:\/\/127\.0\.0\.1:\d+\//);
    const pageUrl = new URL(started.url);
    const token = pageUrl.searchParams.get("token");
    const endpoint = (pathname) => {
      const url = new URL(pathname, pageUrl.origin);
      url.searchParams.set("token", token);
      return url;
    };

    const bootstrapResponse = await fetch(endpoint("/api/bootstrap"));
    const bootstrap = await bootstrapResponse.json();
    assert.equal(bootstrap.ok, true);
    assert.equal(bootstrap.model.paperStyles.conference.defaultTargetWords, 4500);
    assert.equal(bootstrap.model.paperStyles.journal.defaultTargetWords, 5000);
    assert.equal(bootstrap.initialWorkflow.styleId, "conference");
    assert.equal(bootstrap.initialWorkflow.hasWordLimit, false);
    assert.equal(bootstrap.initialWorkflow.unlimitedCoreSections, true);
    assert.equal(
      bootstrap.initialWorkflow.chatExecution.forceProForAllTurns,
      false,
    );
    assert.equal("placements" in bootstrap.model.frameworkFigure, false);
    assert.deepEqual(
      bootstrap.model.chatExecution.pollingPolicy.intervalMsByCapability,
      {
        medium: 60_000,
        high: 60_000,
        "extra-high": 180_000,
        pro: 300_000,
      },
    );

    const previewResponse = await fetch(endpoint("/api/preview"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        workflow: {
          ...bootstrap.initialWorkflow,
          language: "zh",
          roundLanguages: {
            ...bootstrap.initialWorkflow.roundLanguages,
            "scientific-positioning": "en",
            "method-experiments": "zh",
          },
          styleId: "journal",
          hasWordLimit: false,
          includeAppendix: true,
        },
      }),
    });
    const preview = await previewResponse.json();
    assert.equal(preview.ok, true);
    assert.equal(preview.rounds.length, 5);
    assert.equal(preview.rounds[0].id, "scientific-positioning");
    assert.equal(preview.rounds[0].language, "en");
    assert.match(preview.rounds[0].prompt, /## Your Role/);
    assert.equal(preview.rounds[1].language, "zh");
    assert.match(preview.rounds[1].prompt, /## 你的角色/);

    const confirmedResponse = await fetch(endpoint("/api/confirm"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        workflow: {
          ...bootstrap.initialWorkflow,
          language: "en",
          styleId: "journal",
          hasWordLimit: false,
          unlimitedCoreSections: true,
          includeAppendix: true,
          frameworkFigure: {
            aspectRatioId: "portrait-3-4",
            customAspectWidth: 3,
            customAspectHeight: 4,
          },
          chatExecution: {
            ...bootstrap.initialWorkflow.chatExecution,
            reasoningPreference: "pro",
            forceProForAllTurns: true,
          },
        },
      }),
    });
    const confirmed = await confirmedResponse.json();
    assert.equal(confirmed.ok, true);
    assert.equal(confirmed.status, "confirmed");

    const status = await onboardingStatus(started.sessionPath);
    assert.equal(status.status, "confirmed");
    assert.ok(status.configPath);
    const config = JSON.parse(await readFile(status.configPath, "utf8"));
    assert.equal(config.execution.startAuthorized, true);
    assert.equal(config.projectRoot, paperRoot);
    assert.equal(config.workflow.styleId, "journal");
    assert.equal(config.workflow.hasWordLimit, false);
    assert.equal(config.workflow.unlimitedCoreSections, true);
    assert.equal("placementId" in config.workflow.frameworkFigure, false);
    assert.equal(config.workflow.chatExecution.reasoningPreference, "pro");
    assert.equal(config.workflow.chatExecution.forceProForAllTurns, true);

    const ui = await readFile(
      path.join(pluginRoot, "ui", "onboarding", "index.html"),
      "utf8",
    );
    assert.match(ui, /configuration-form/);
    assert.match(ui, /confirm-button/);
    assert.match(ui, /exit-button/);
    assert.match(ui, /copy-all-button/);
    assert.match(ui, /prompt-preview-list/);
    assert.match(ui, /force-all-pro-toggle/);
    assert.doesNotMatch(ui, /title-brand-candidates-toggle/);
    assert.doesNotMatch(ui, /placement-options/);
  } finally {
    await rm(temporaryRoot, { recursive: true, force: true });
  }
});

test("exiting local onboarding cancels without creating a run config", async () => {
  const temporaryRoot = await mkdtemp(
    path.join(tmpdir(), "yanshu-onboarding-cancel-test-"),
  );
  try {
    const paperRoot = path.join(temporaryRoot, "paper");
    await mkdir(path.join(paperRoot, "figures"), { recursive: true });
    await writeFile(
      path.join(paperRoot, "main.tex"),
      "\\documentclass{article}\\begin{document}Test\\end{document}\n",
      "utf8",
    );
    await writeFile(path.join(paperRoot, "references.bib"), "", "utf8");
    await writeFile(path.join(paperRoot, "main.pdf"), "pdf fixture", "utf8");

    const inputs = await resolvePaperInputs(paperRoot);
    const pluginRoot = path.resolve(
      new URL("..", import.meta.url).pathname,
    );
    const started = await startOnboardingSession({
      pluginRoot,
      projectRoot: paperRoot,
      inputs,
      uiLanguage: "zh",
      openBrowser: false,
      sessionRoot: path.join(temporaryRoot, "sessions"),
      ttlMs: 30_000,
    });
    const pageUrl = new URL(started.url);
    const cancelUrl = new URL("/api/cancel", pageUrl.origin);
    cancelUrl.searchParams.set("token", pageUrl.searchParams.get("token"));
    const response = await fetch(cancelUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{}",
    });
    const cancelled = await response.json();
    assert.equal(cancelled.ok, true);
    assert.equal(cancelled.status, "cancelled");

    const status = await onboardingStatus(started.sessionPath);
    assert.equal(status.status, "cancelled");
    assert.equal(status.configPath, null);
    await assert.rejects(
      readFile(path.join(started.sessionPath, "confirmed.yanshu.json")),
      /ENOENT/,
    );
  } finally {
    await rm(temporaryRoot, { recursive: true, force: true });
  }
});

test("reasoning preferences fall back against visible Chat options", () => {
  const pollingPolicy =
    getReconstructionConfigurationModel().chatExecution.pollingPolicy;
  const plusPro = resolveChatPreference({
    requested: "pro",
    visibleOptions: ["Medium", "High"],
    pollingPolicy,
  });
  assert.equal(plusPro.selectedLabel, "High");
  assert.equal(plusPro.fallbackApplied, true);
  assert.equal(plusPro.pollIntervalMs, 60_000);
  assert.match(plusPro.notice, /Requested Pro; selected High/);

  const plusExtraHigh = resolveChatPreference({
    requested: "extra-high",
    visibleOptions: ["Medium", "High"],
    pollingPolicy,
  });
  assert.equal(plusExtraHigh.selectedLabel, "High");
  assert.equal(plusExtraHigh.fallbackApplied, true);
  assert.equal(plusExtraHigh.pollIntervalMs, 60_000);

  const strongest = resolveChatPreference({
    requested: "strongest",
    visibleOptions: ["Medium", "High", "Extra High", "Pro Standard", "Pro Extended"],
    pollingPolicy,
  });
  assert.equal(strongest.selectedLabel, "Pro Extended");
  assert.equal(strongest.fallbackApplied, false);
  assert.equal(strongest.pollIntervalMs, 300_000);

  const renamed = resolveChatPreference({
    requested: "pro",
    visibleOptions: ["Balanced", "Deep"],
    pollingPolicy,
  });
  assert.equal(renamed.selectedLabel, "Deep");
  assert.equal(renamed.fallbackApplied, true);
  assert.equal(renamed.pollIntervalMs, 60_000);
  assert.equal(renamed.pollIntervalSource, "unknown-capability-default");
  assert.match(renamed.source, /visible-order/);

  const newerAliases = resolveChatPreference({
    requested: "pro",
    visibleOptions: ["Standard", "Extended", "Max", "Ultra"],
    pollingPolicy,
  });
  assert.equal(newerAliases.selectedLabel, "Ultra");
  assert.equal(newerAliases.fallbackApplied, false);
  assert.equal(newerAliases.pollIntervalMs, 300_000);

  const extraHigh = resolveChatPreference({
    requested: "extra-high",
    visibleOptions: ["Medium", "High", "Extra High"],
    pollingPolicy,
  });
  assert.equal(extraHigh.selectedLabel, "Extra High");
  assert.equal(extraHigh.pollIntervalMs, 180_000);
});

test("Pro is limited to the first effective interaction unless explicitly forced", () => {
  const initial = resolveEffectiveChatPreference({
    configured: "pro",
    interactionKind: "initial",
  });
  assert.equal(initial.effective, "pro");
  assert.equal(initial.policyApplied, false);
  assert.match(initial.notice, /first effective interaction/);

  const followUp = resolveEffectiveChatPreference({
    configured: "pro",
    interactionKind: "follow-up",
  });
  assert.equal(followUp.effective, "extra-high");
  assert.equal(followUp.policyApplied, true);
  assert.match(followUp.notice, /follow-up uses Extra High/);

  const forced = resolveEffectiveChatPreference({
    configured: "pro",
    interactionKind: "follow-up",
    forceProForAllTurns: true,
  });
  assert.equal(forced.effective, "pro");
  assert.equal(forced.policyApplied, false);
  assert.match(forced.notice, /substantially extend the workflow/);
});

test("chat round protocol prepares a fresh thread before configuration and upload", async () => {
  const calls = [];
  const chatgpt = {
    experience: {
      open: async (args) => {
        calls.push(["experience.open", args]);
        return {
          ok: true,
          status: "success",
          context: { url: "https://chatgpt.com/c/existing-thread" },
        };
      },
    },
    threads: {
      new: async () => {
        calls.push(["threads.new"]);
        return {
          ok: true,
          status: "success",
          data: { url: "https://chatgpt.com/" },
          context: { url: "https://chatgpt.com/" },
        };
      },
    },
    configuration: {
      inspect: async (args) => {
        calls.push(["configuration.inspect", args]);
        return {
          ok: true,
          status: "success",
          data: {
            experience: "chat",
            options: {
              intelligence: [
                { label: "Medium" },
                { label: "High" },
                { label: "Extra High" },
              ],
            },
          },
        };
      },
      apply: async (args) => {
        calls.push(["configuration.apply", args]);
        return {
          ok: true,
          status: "success",
          data: {
            verified: false,
            selected: [
              {
                axis: "intelligence",
                requested: "Extra High",
                selected: "Extra High",
              },
            ],
            after: { active: {} },
          },
          warnings: ["Visible postcondition is unavailable."],
        };
      },
    },
    modes: {
      get: async () => {
        calls.push(["modes.get"]);
        return {
          ok: true,
          status: "success",
          data: { modes: [] },
          warnings: ["No active mode label is exposed."],
        };
      },
    },
    askWithFiles: async (args) => {
      calls.push(["askWithFiles", args]);
      return {
        ok: true,
        status: "running",
        context: { url: "https://chatgpt.com/c/new-round-thread" },
      };
    },
  };

  const opened = await openFreshChatRound(chatgpt);
  assert.equal(opened.ok, true);
  assert.equal(opened.data.currentUrl, "https://chatgpt.com/");

  const inspected = await inspectFreshChatConfiguration(chatgpt);
  assert.equal(inspected.ok, true);

  const applied = await applyChatReasoningSelection(chatgpt, {
    selectedLabel: "Extra High",
    visibleOptions: ["Medium", "High", "Extra High"],
  });
  assert.equal(applied.ok, true);
  assert.equal(applied.data.verification, "click-acknowledged");
  assert.match(applied.warnings.at(-1), /will continue/);

  const submitted = await submitPreparedChatRound(chatgpt, {
    files: ["/paper/main.tex", "/paper/main.pdf"],
    tools: [{ tool: "YanShu" }],
    prompt: "Reconstruct this paper.",
  });
  assert.equal(submitted.ok, true);
  assert.deepEqual(
    calls.map(([name]) => name),
    [
      "experience.open",
      "threads.new",
      "configuration.inspect",
      "configuration.apply",
      "modes.get",
      "askWithFiles",
    ],
  );
  const applyArgs = calls.find(
    ([name]) => name === "configuration.apply",
  )[1];
  assert.equal(applyArgs.strict, false);
  const submitArgs = calls.find(([name]) => name === "askWithFiles")[1];
  assert.deepEqual(submitArgs.thread, { type: "current" });
  assert.equal(submitArgs.existingTab, true);
  assert.equal(submitArgs.configuration, undefined);
  assert.deepEqual(submitArgs.tools, [{ tool: "YanShu" }]);
});

test("chat round protocol blocks a stale thread or contradictory reasoning readback", async () => {
  const staleThread = await openFreshChatRound({
    experience: {
      open: async () => ({
        ok: true,
        context: { url: "https://chatgpt.com/c/same-thread" },
      }),
    },
    threads: {
      new: async () => ({
        ok: true,
        data: { url: "https://chatgpt.com/c/same-thread" },
      }),
    },
  });
  assert.equal(staleThread.ok, false);
  assert.equal(staleThread.blocker.code, "thread_creation_unverified");

  const conflicting = await applyChatReasoningSelection(
    {
      configuration: {
        apply: async () => ({
          ok: true,
          data: {
            verified: false,
            selected: [
              {
                axis: "intelligence",
                requested: "Extra High",
                selected: "Extra High",
              },
            ],
          },
          warnings: [],
        }),
      },
      modes: {
        get: async () => ({
          ok: true,
          data: { modes: ["High"] },
          warnings: [],
        }),
      },
    },
    {
      selectedLabel: "Extra High",
      visibleOptions: ["Medium", "High", "Extra High"],
    },
  );
  assert.equal(conflicting.ok, false);
  assert.equal(
    conflicting.blocker.code,
    "configuration_readback_conflict",
  );
});

test("workflow preserves an explicit reasoning preference", () => {
  const workflow = buildReconstructionWorkflow({
    chatExecution: {
      reasoningPreference: "extra-high",
      forceProForAllTurns: false,
    },
  });

  assert.equal(
    workflow.config.chatExecution.reasoningPreference,
    "extra-high",
  );
  assert.equal(
    workflow.config.chatExecution.modelPolicy,
    "latest-visible-reasoning",
  );
  assert.equal(
    workflow.config.chatExecution.forceProForAllTurns,
    false,
  );
});

test("new runs detect an older installed Prompt release", () => {
  assert.equal(
    compareWorkflowVersions("2026.07.7", "2026.07.7"),
    0,
  );
  assert.equal(
    compareWorkflowVersions("2026.07.6", "2026.07.7"),
    -1,
  );
  assert.equal(
    compareWorkflowVersions("2026.07.9", "2026.07.8"),
    1,
  );

  const release = inspectPublishedPromptRelease(
    "2026.07.6",
    '<div data-reconstruction-workflow-version="2026.07.7"></div>',
  );
  assert.equal(release.ok, false);
  assert.equal(release.status, "installed-older");
  assert.equal(release.publishedVersion, "2026.07.7");
});

test("complete BibTeX handoff preserves every prior key", () => {
  const audit = inspectBibLibraryContinuity(
    `@article{first, title={First}}
@inproceedings{second, title={Second}}
`,
    `@article{first, title={First}}
@article{third, title={Third}}
`,
  );
  assert.equal(audit.ok, false);
  assert.deepEqual(audit.missingKeys, ["second"]);
  assert.equal(audit.inputKeyCount, 2);
  assert.equal(audit.outputKeyCount, 2);
});

test("no-limit and unlimited-core modes alter generated prompts", () => {
  const noLimit = buildReconstructionWorkflow({
    language: "en",
    styleId: "journal",
    hasWordLimit: false,
  });
  assert.doesNotMatch(
    noLimit.rounds[0].prompt,
    /## Optional Main-text and Section Length Guidance/,
  );
  assert.match(
    noLimit.rounds[1].prompt,
    /stop the heading hierarchy at subsubsection by default/i,
  );
  assert.match(
    noLimit.rounds[1].prompt,
    /rather than paragraph headings for discourse functions/i,
  );
  assert.doesNotMatch(
    noLimit.rounds[1].prompt,
    /section → subsection → subsubsection → paragraph/,
  );

  const unlimitedCore = buildReconstructionWorkflow({
    language: "en",
    styleId: "conference",
    hasWordLimit: true,
    unlimitedCoreSections: true,
  });
  assert.match(
    unlimitedCore.rounds[0].prompt,
    /No suggested main-text total; optional ranges only for sections other than Method and Experiments/,
  );
  assert.match(unlimitedCore.rounds[0].prompt, /Method: No suggestion/);
  assert.match(
    unlimitedCore.rounds[0].prompt,
    /each table or figure as 200 words/,
  );
});

test("each automated round can preserve its exported prompt language", () => {
  const workflow = buildReconstructionWorkflow({
    language: "zh",
    roundLanguages: {
      "scientific-positioning": "en",
      "method-experiments": "zh",
      "narrative-reconstruction": "en",
      "framework-figure": "en",
      "final-refinement": "zh",
    },
  });

  assert.equal(workflow.rounds[0].language, "en");
  assert.match(workflow.rounds[0].prompt, /## Your Role/);
  assert.equal(workflow.rounds[1].language, "zh");
  assert.match(workflow.rounds[1].prompt, /## 你的角色/);
});

test("custom budgets must match the configured total", () => {
  assert.throws(
    () =>
      buildReconstructionWorkflow({
        language: "en",
        styleId: "conference",
        hasWordLimit: true,
        targetWords: 4500,
        sectionBudgets: { abstract: 999 },
        unlimitedCoreSections: false,
      }),
    /Section length suggestions total/,
  );
});

test("run state is recoverable and attachment-scoped", async () => {
  const temporaryRoot = await mkdtemp(path.join(tmpdir(), "yanshu-test-"));
  try {
    const paperRoot = path.join(temporaryRoot, "paper");
    const figures = path.join(paperRoot, "figures");
    await mkdir(figures, { recursive: true });
    await writeFile(
      path.join(paperRoot, "main.tex"),
      "\\documentclass{article}\\begin{document}Test\\end{document}\n",
      "utf8",
    );
    await writeFile(path.join(paperRoot, "references.bib"), "", "utf8");
    await writeFile(path.join(paperRoot, "main.pdf"), "pdf fixture", "utf8");
    await writeFile(path.join(figures, "overview.png"), "png fixture", "utf8");
    await writeFile(path.join(figures, "overview.pdf"), "pdf fixture", "utf8");

    const inputs = await resolvePaperInputs(paperRoot);
    const workflow = buildReconstructionWorkflow({
      language: "zh",
      styleId: "conference",
    });
    const state = await createRun({
      projectRoot: paperRoot,
      runId: "test-run",
      inputs,
      workflow,
    });

    assert.equal(nextRound(state)?.number, 1);
    assert.equal(summarizeRun(state).progress.completed, 0);
    assert.match(
      await readFile(path.join(state.runPath, "STATUS.md"), "utf8"),
      /0\/5 rounds/,
    );
    assert.match(
      await readFile(path.join(state.runPath, "events.jsonl"), "utf8"),
      /"type":"run-created"/,
    );
    assert.match(
      await readFile(
        path.join(
          state.runPath,
          "round-01-scientific-positioning",
          "prompt.md",
        ),
        "utf8",
      ),
      /Scientific Positioning Contract/,
    );

    const attachments = await roundAttachments(state, "scientific-positioning");
    assert.deepEqual(
      attachments.map((item) => path.basename(item)).sort(),
      ["main.pdf", "main.tex", "references.bib"],
    );

    await markRound(state, "1", {
      status: "running",
      threadUrl: "https://chatgpt.com/c/example",
      experience: "chat",
      model: "strongest-visible",
      effort: "strongest-visible",
      configurationVerification: "click-acknowledged",
    });
    assert.equal(
      state.rounds[0].chat.configurationVerification,
      "click-acknowledged",
    );
    async function addRoundArtifacts(selector, names) {
      for (const name of names) {
        const downloaded = path.join(temporaryRoot, name);
        await writeFile(downloaded, `${name} fixture`, "utf8");
        await registerArtifact(state, selector, downloaded);
      }
    }

    await addRoundArtifacts("1", [
      "paper_round_1_scientific_structure.tex",
      "paper_round_1_report_zh.md",
      "paper_round_1_references.bib",
      "paper_round_1_scientific_structure.pdf",
    ]);
    await markRound(state, "1", { status: "completed" });

    assert.equal(nextRound(state)?.number, 2);
    assert.equal(summarizeRun(state).progress.completed, 1);
    const secondAttachments = await roundAttachments(state, "2");
    assert.deepEqual(
      secondAttachments.map((item) => path.basename(item)).sort(),
      [
        "paper_round_1_references.bib",
        "paper_round_1_scientific_structure.pdf",
        "paper_round_1_scientific_structure.tex",
      ],
    );

    await addRoundArtifacts("2", [
      "paper_round_2_method_experiments.tex",
      "paper_round_2_report_zh.md",
      "paper_round_2_references.bib",
      "paper_round_2_method_experiments.pdf",
    ]);
    await markRound(state, "2", { status: "completed" });
    assert.deepEqual(
      (await roundAttachments(state, "3"))
        .map((item) => path.basename(item))
        .sort(),
      [
        "paper_round_2_method_experiments.pdf",
        "paper_round_2_method_experiments.tex",
        "paper_round_2_references.bib",
      ],
    );

    await addRoundArtifacts("3", [
      "paper_round_3_narrative_reconstruction.tex",
      "paper_round_3_report_zh.md",
      "paper_round_3_references.bib",
      "paper_round_3_narrative_reconstruction.pdf",
    ]);
    await markRound(state, "3", { status: "completed" });
    assert.deepEqual(
      (await roundAttachments(state, "4"))
        .map((item) => path.basename(item))
        .sort(),
      [
        "paper_round_3_narrative_reconstruction.pdf",
        "paper_round_3_narrative_reconstruction.tex",
      ],
    );

    await addRoundArtifacts("4", [
      "paper_round_4_framework_reconstruction.png",
    ]);
    await markRound(state, "4", { status: "completed" });
    assert.deepEqual(
      (await roundAttachments(state, "5"))
        .map((item) => path.basename(item))
        .sort(),
      [
        "main.pdf",
        "main.tex",
        "paper_round_3_narrative_reconstruction.pdf",
        "paper_round_3_narrative_reconstruction.tex",
        "paper_round_3_references.bib",
        "paper_round_4_framework_reconstruction.png",
      ],
    );
  } finally {
    await rm(temporaryRoot, { recursive: true, force: true });
  }
});

test("one validated ZIP imports all fallback Chat artifacts", async () => {
  const temporaryRoot = await mkdtemp(path.join(tmpdir(), "yanshu-bundle-"));
  try {
    const paperRoot = path.join(temporaryRoot, "paper");
    await mkdir(paperRoot, { recursive: true });
    await writeFile(
      path.join(paperRoot, "main.tex"),
      "\\documentclass{article}\\begin{document}Test\\end{document}\n",
      "utf8",
    );
    await writeFile(path.join(paperRoot, "references.bib"), "", "utf8");
    await writeFile(path.join(paperRoot, "main.pdf"), "pdf fixture", "utf8");
    const inputs = await resolvePaperInputs(paperRoot);
    const workflow = buildReconstructionWorkflow({
      language: "en",
      styleId: "journal",
    });
    const state = await createRun({
      projectRoot: paperRoot,
      runId: "bundle-run",
      inputs,
      workflow,
    });

    const spec = artifactBundleSpec(
      state.rounds[1],
      state.workflowVersion,
    );
    assert.equal(spec.required, true);
    assert.equal(
      spec.archiveName,
      "<base_name>_round_2_artifacts.zip",
    );
    const legacySpec = artifactBundleSpec(
      state.rounds[1],
      "2026.07.6",
    );
    assert.equal(legacySpec.required, false);
    assert.match(legacySpec.reason, /saved run predates/i);
    const frameworkSpec = artifactBundleSpec(
      state.rounds[3],
      state.workflowVersion,
    );
    assert.equal(frameworkSpec.required, false);
    assert.equal(
      frameworkSpec.directArtifactSuffix,
      "_round_4_framework_reconstruction.png",
    );
    const bundlePath = path.join(
      temporaryRoot,
      "paper_round_2_artifacts.zip",
    );
    await writeFile(
      bundlePath,
      storedZip({
        "paper_round_2_method_experiments.tex": "complete tex",
        "paper_round_2_report_zh.md": "完整报告",
        "paper_round_2_references.bib": "@article{fixture}",
      }),
    );

    const imported = await importArtifactBundle({
      state,
      selector: "2",
      bundlePath,
    });
    assert.equal(path.basename(imported.bundle), path.basename(bundlePath));
    assert.deepEqual(
      imported.artifacts.map((item) => path.basename(item)).sort(),
      [
        "paper_round_2_method_experiments.tex",
        "paper_round_2_references.bib",
        "paper_round_2_report_zh.md",
      ],
    );
    assert.equal(
      await readFile(
        path.join(
          state.runPath,
          state.rounds[1].directory,
          "output",
          "paper_round_2_method_experiments.tex",
        ),
        "utf8",
      ),
      "complete tex",
    );
    assert.equal(
      state.rounds[1].outputs.length,
      4,
      "the ZIP and its three exact artifacts are registered",
    );
    const replacementPath = path.join(
      temporaryRoot,
      "paper_round_2_artifacts (1).zip",
    );
    await writeFile(
      replacementPath,
      storedZip({
        "paper_round_2_method_experiments.tex": "revised complete tex",
        "paper_round_2_report_zh.md": "revised report",
        "paper_round_2_references.bib": "@article{fixture, title={Revised}}",
      }),
    );
    const replaced = await importArtifactBundle({
      state,
      selector: "2",
      bundlePath: replacementPath,
      replace: true,
      reason: "test correction",
      chatTurn: "assistant-7",
    });
    assert.equal(
      path.basename(replaced.bundle),
      "paper_round_2_artifacts.zip",
    );
    assert.equal(replaced.downloadedArchiveName, path.basename(replacementPath));
    assert.equal(replaced.revisions.length, 4);
    assert.ok(
      replaced.revisions.every(
        (revision) =>
          revision.reason === "test correction" &&
          revision.chatTurn === "assistant-7" &&
          revision.previousSha256 &&
          revision.newSha256,
      ),
    );
    assert.equal(
      await readFile(
        path.join(
          state.runPath,
          state.rounds[1].directory,
          "output",
          "paper_round_2_method_experiments.tex",
        ),
        "utf8",
      ),
      "revised complete tex",
    );
    assert.match(
      await readFile(path.join(state.runPath, "STATUS.md"), "utf8"),
      /artifact-imported/,
    );
  } finally {
    await rm(temporaryRoot, { recursive: true, force: true });
  }
});

test("loading a legacy run migrates checkpoints and keeps progress visible beside the paper", async () => {
  const temporaryRoot = await mkdtemp(
    path.join(tmpdir(), "yanshu-migration-"),
  );
  try {
    const paperRoot = path.join(
      temporaryRoot,
      "论文 空格",
    );
    await mkdir(paperRoot, { recursive: true });
    await writeFile(
      path.join(paperRoot, "main.tex"),
      "\\documentclass{article}\\begin{document}Test\\end{document}\n",
      "utf8",
    );
    const workflow = buildReconstructionWorkflow({
      language: "en",
      hasWordLimit: false,
    });
    const state = await createRun({
      projectRoot: paperRoot,
      runId: "legacy-run",
      inputs: await resolvePaperInputs(paperRoot),
      workflow,
    });
    const statePath = path.join(state.runPath, "run.json");
    const legacy = JSON.parse(await readFile(statePath, "utf8"));
    legacy.schemaVersion = 1;
    delete legacy.execution;
    delete legacy.runtimeVersions;
    delete legacy.finalManifestPath;
    delete legacy.validation.checks;
    for (const round of legacy.rounds) {
      delete round.checkpoint;
      delete round.revisions;
      delete round.compilation;
      delete round.validation;
    }
    await writeFile(
      statePath,
      `${JSON.stringify(legacy, null, 2)}\n`,
      "utf8",
    );

    const migrated = await loadRun(state.runPath);
    assert.equal(migrated.schemaVersion, 2);
    assert.equal(migrated.rounds[0].checkpoint, "configured");
    assert.equal(
      migrated.runtimeVersions.marketplaceRevision,
      null,
    );
    assert.match(
      await readFile(path.join(state.runPath, "STATUS.md"), "utf8"),
      /Current round: \*\*1\./,
    );
  } finally {
    await rm(temporaryRoot, { recursive: true, force: true });
  }
});

test("final manifest records hashes, per-round validation, configuration compliance, and figure dimensions", async () => {
  const temporaryRoot = await mkdtemp(
    path.join(tmpdir(), "yanshu-manifest-"),
  );
  try {
    const paperRoot = path.join(
      temporaryRoot,
      "论文 with spaces",
    );
    const figures = path.join(paperRoot, "figures");
    await mkdir(figures, { recursive: true });
    await writeFile(
      path.join(paperRoot, "main.tex"),
      "\\documentclass{article}\\begin{document}Input\\end{document}\n",
      "utf8",
    );
    await writeFile(
      path.join(paperRoot, "references.bib"),
      "@article{input,title={Input}}\n",
      "utf8",
    );
    await writeFile(
      path.join(figures, "input.png"),
      pngHeader(20, 10),
    );
    const workflow = buildReconstructionWorkflow({
      language: "en",
      hasWordLimit: false,
      frameworkFigure: {
        aspectRatioId: "landscape-2-1",
        customAspectWidth: 2,
        customAspectHeight: 1,
      },
    });
    const state = await createRun({
      projectRoot: paperRoot,
      runId: "manifest-run",
      inputs: await resolvePaperInputs(paperRoot),
      workflow,
      runtimeVersions: {
        pluginVersion: "0.2.0+codex.20260727120000",
        loadedSkillVersion: "0.2.0+codex.20260726120000",
        marketplaceVersion: "0.2.0+codex.20260727120000",
        marketplaceRevision: "abc123",
      },
    });
    const frameworkSource = path.join(
      temporaryRoot,
      "paper_round_4_framework_reconstruction.png",
    );
    await writeFile(frameworkSource, pngHeader(2000, 1000));
    await registerArtifact(
      state,
      "4",
      frameworkSource,
    );

    const finalArtifacts = {
      "paper_round_5_final_refinement.tex": String.raw`\documentclass{article}
\usepackage{graphicx}
\begin{document}
\includegraphics{paper_round_4_framework_reconstruction.png}
\bibliography{paper_round_5_references}
\end{document}
`,
      "paper_round_5_report_zh.md": "# Report\n",
      "paper_round_5_references.bib":
        "@article{input,title={Input}}\n",
      "paper_round_5_final_refinement.pdf": "compiled pdf",
    };
    for (const [name, content] of Object.entries(finalArtifacts)) {
      const source = path.join(temporaryRoot, name);
      await writeFile(source, content, "utf8");
      await registerArtifact(state, "5", source);
    }
    state.rounds[4].compilation = {
      status: "passed",
      engine: "pdflatex",
      pdfPath: state.rounds[4].outputs.find((value) =>
        value.endsWith(".pdf"),
      ),
      logPath: null,
    };
    const frameworkValidation = await validateRoundConsistency({
      state,
      selector: "4",
    });
    const finalValidation = await validateRoundConsistency({
      state,
      selector: "5",
    });
    assert.equal(frameworkValidation.passed, true);
    assert.equal(finalValidation.passed, true);
    for (const round of state.rounds) {
      round.status = "completed";
      round.checkpoint = "finalized";
      round.validation = {
        status: "passed",
        path: null,
        checks: [],
      };
      round.chat = {
        threadUrl: `https://chatgpt.com/c/round-${round.number}`,
        model: "latest visible reasoning",
        effort: "High",
        assistantTurn: round.number,
        transferMode: "mcp",
      };
    }
    state.rounds[3].validation.checks =
      frameworkValidation.checks;
    state.rounds[4].validation.checks =
      finalValidation.checks;
    state.execution = {
      transferMode: "mcp",
      fallbackReason: null,
    };
    await saveRun(state);

    const manifest = await buildFinalManifest(state);
    assert.equal(manifest.schemaVersion, 2);
    assert.equal(manifest.validation.status, "passed");
    assert.equal(
      manifest.configurationCompliance.frameworkCanvas.details.width,
      2000,
    );
    assert.equal(
      manifest.configurationCompliance.mainTextWordBudget.status,
      "not-applicable",
    );
    assert.equal(manifest.inputs.find((item) => item.role === "figures").type, "directory");
    assert.equal(manifest.runtimeVersions.marketplaceRevision, "abc123");
    assert.equal(manifest.chats.length, 5);
    assert.ok(
      manifest.deliverables.some((item) =>
        item.path.endsWith(
          "paper_round_5_final_refinement.pdf",
        ),
      ),
    );
  } finally {
    await rm(temporaryRoot, { recursive: true, force: true });
  }
});
