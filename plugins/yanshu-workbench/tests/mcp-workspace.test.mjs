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
import { fileURLToPath } from "node:url";
import { buildReconstructionWorkflow } from "../runtime/prompt-engine.mjs";
import {
  compileRound,
  completeRound,
  getEvidenceIndex,
  getRoundManifest,
  readPdfText,
  readTextArtifact,
  viewImageArtifact,
  workspaceCapabilities,
  writeRoundArtifact,
} from "../scripts/lib/mcp-workspace.mjs";
import {
  createRun,
  loadRun,
  resolvePaperInputs,
} from "../scripts/lib/run-store.mjs";
import {
  mcpSessionStatus,
  startMcpSession,
  stopMcpSession,
} from "../scripts/lib/mcp-session.mjs";
import {
  callTool,
  handleJsonRpc,
  startHttpServer,
  toolDefinitions,
} from "../mcp/server.mjs";

const ONE_PIXEL_PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
  "base64",
);

async function createFixture() {
  const temporaryRoot = await mkdtemp(
    path.join(tmpdir(), "yanshu-mcp-test-"),
  );
  const paperRoot = path.join(
    temporaryRoot,
    "论文 空格",
    "paper",
  );
  const figures = path.join(paperRoot, "figures");
  await mkdir(figures, { recursive: true });
  const tex = String.raw`\documentclass{article}
\usepackage{graphicx}
\begin{document}
\section{Experiments}
The result is summarized in Figure~\ref{fig:result} and Table~\ref{tab:main}.
\begin{figure}[t]
  \centering
  \includegraphics[width=0.2\linewidth]{figures/result.png}
  \caption{Accuracy results on the held-out evaluation set.}
  \label{fig:result}
\end{figure}
\begin{table}[t]
  \centering
  \caption{Main evaluation scores.}
  \label{tab:main}
  \begin{tabular}{lc}
  Method & Accuracy \\
  Proposed & 91.2 \\
  \end{tabular}
\end{table}
\end{document}
`;
  const bib = `@article{existing_source,
  title = {Existing Source},
  author = {Author, Example},
  year = {2025}
}
`;
  await writeFile(path.join(paperRoot, "main.tex"), tex, "utf8");
  await writeFile(path.join(paperRoot, "references.bib"), bib, "utf8");
  await writeFile(path.join(paperRoot, "main.pdf"), "pdf fixture", "utf8");
  await writeFile(path.join(figures, "result.png"), ONE_PIXEL_PNG);
  const inputs = await resolvePaperInputs(paperRoot);
  const workflow = buildReconstructionWorkflow({
    language: "en",
    styleId: "conference",
  });
  const state = await createRun({
    projectRoot: paperRoot,
    runId: "mcp-test",
    inputs,
    workflow,
  });
  return { temporaryRoot, paperRoot, state, tex, bib };
}

test("MCP workspace exposes prompts, TeX evidence, and real figure pixels", async () => {
  const fixture = await createFixture();
  try {
    const manifest = await getRoundManifest(fixture.state.runPath, "1");
    assert.equal(manifest.round.number, 1);
    assert.ok(manifest.promptArtifactId);
    assert.ok(
      manifest.artifacts.some((artifact) =>
        artifact.roles.includes("primary-tex"),
      ),
    );
    assert.ok(
      manifest.artifacts.some(
        (artifact) =>
          artifact.name === "result.png" &&
          artifact.roles.includes("evidence-figure"),
      ),
      "MCP must expose a TeX-referenced source figure even when a compiled PDF is present",
    );
    const prompt = await readTextArtifact({
      runPath: fixture.state.runPath,
      round: "1",
      artifactId: manifest.promptArtifactId,
      maxChars: 2_000,
    });
    assert.match(prompt.content, /macro-reconstruction|科学定位/);

    const evidence = await getEvidenceIndex(
      fixture.state.runPath,
      "1",
    );
    assert.equal(evidence.figures.length, 1);
    assert.equal(evidence.figures[0].label, "fig:result");
    assert.match(evidence.figures[0].caption, /Accuracy results/);
    assert.ok(evidence.figures[0].graphics[0].artifactId);
    assert.equal(evidence.tables.length, 1);
    assert.match(evidence.tables[0].texExcerpt, /91\.2/);

    const image = await viewImageArtifact({
      runPath: fixture.state.runPath,
      round: "1",
      artifactId: evidence.figures[0].graphics[0].artifactId,
    });
    assert.equal(image.mimeType, "image/png");
    assert.deepEqual(image.bytes, ONE_PIXEL_PNG);
  } finally {
    await rm(fixture.temporaryRoot, { recursive: true, force: true });
  }
});

test("MCP writes are scoped, versioned, compiled, rendered, and handed off", async (t) => {
  const capabilities = workspaceCapabilities();
  if (
    !capabilities.latexmk ||
    !capabilities.pdfinfo ||
    !capabilities.pdftotext ||
    !capabilities.pdftoppm
  ) {
    t.skip("Local LaTeX and Poppler tools are unavailable.");
    return;
  }

  const fixture = await createFixture();
  try {
    const first = await writeRoundArtifact({
      runPath: fixture.state.runPath,
      round: "1",
      fileName: "rewritten.tex",
      content: fixture.tex,
    });
    assert.equal(first.changed, true);

    const unchanged = await writeRoundArtifact({
      runPath: fixture.state.runPath,
      round: "1",
      fileName: "rewritten.tex",
      content: fixture.tex,
    });
    assert.equal(unchanged.changed, false);

    const revisedTex = fixture.tex.replace(
      "The result is summarized",
      "The revised result is summarized",
    );
    const revised = await writeRoundArtifact({
      runPath: fixture.state.runPath,
      round: "1",
      fileName: "rewritten.tex",
      content: revisedTex,
    });
    assert.equal(revised.changed, true);
    assert.match(revised.previousVersion, /run\/.*\.versions/);

    await assert.rejects(
      writeRoundArtifact({
        runPath: fixture.state.runPath,
        round: "1",
        fileName: "../main.tex",
        content: revisedTex,
      }),
      /inside the current round output directory/,
    );

    const compilation = await compileRound({
      runPath: fixture.state.runPath,
      round: "1",
      texArtifactId: revised.artifactId,
      engine: "auto",
    });
    assert.equal(
      compilation.success,
      true,
      compilation.logTail,
    );
    assert.ok(compilation.compiledPdfArtifactId);
    const compiledState = await loadRun(fixture.state.runPath);
    const stagingRecord = JSON.parse(
      await readFile(
        path.resolve(
          compiledState.runPath,
          compiledState.rounds[0].compilation.staging.manifestPath.replace(
            /^run\//u,
            "",
          ),
        ),
        "utf8",
      ),
    );
    assert.equal(stagingRecord.strategy, "ascii-temporary");
    assert.match(stagingRecord.sourceRunPath, /论文 空格/u);
    assert.ok(stagingRecord.cleanedAt);

    await assert.rejects(
      completeRound({
        runPath: fixture.state.runPath,
        round: "1",
        note: "Missing the report and complete bibliography.",
      }),
      /missing required registered artifacts/i,
    );
    await writeRoundArtifact({
      runPath: fixture.state.runPath,
      round: "1",
      fileName: "round_1_report_zh.md",
      content: "# Report\n",
    });
    await writeRoundArtifact({
      runPath: fixture.state.runPath,
      round: "1",
      fileName: "round_1_references.bib",
      content: `${fixture.bib}
@article{verified_addition,
  title = {Verified Addition},
  author = {Researcher, Example},
  year = {2026}
}
`,
    });

    const pdfText = await readPdfText({
      runPath: fixture.state.runPath,
      round: "1",
      artifactId: compilation.compiledPdfArtifactId,
      startPage: 1,
      endPage: 1,
    });
    assert.match(pdfText.pages[0].text, /revised result/i);

    const page = await viewImageArtifact({
      runPath: fixture.state.runPath,
      round: "1",
      artifactId: compilation.compiledPdfArtifactId,
      page: 1,
    });
    assert.equal(page.mimeType, "image/png");
    assert.ok(page.bytes.length > 100);

    const completed = await completeRound({
      runPath: fixture.state.runPath,
      round: "1",
      note: "Validated through the MCP test.",
    });
    assert.equal(completed.completedRound.number, 1);
    assert.equal(completed.nextRound.number, 2);
    const finalizedState = await loadRun(fixture.state.runPath);
    assert.equal(finalizedState.validation.status, "passed");
    assert.equal(
      finalizedState.rounds[0].checkpoint,
      "finalized",
    );
    assert.match(
      await readFile(
        path.join(finalizedState.runPath, "STATUS.md"),
        "utf8",
      ),
      /Round 1:.*completed \/ finalized/u,
    );

    const handoff = await getRoundManifest(
      fixture.state.runPath,
      "2",
    );
    const handoffNames = handoff.artifacts.map(
      (artifact) => artifact.name,
    );
    assert.ok(handoffNames.includes("rewritten.tex"));
    assert.ok(
      handoff.artifacts.some(
        (artifact) =>
          artifact.kind === "pdf" &&
          artifact.roles.includes("compiled-paper"),
      ),
    );
    assert.ok(handoffNames.includes("round_1_references.bib"));
    assert.ok(!handoffNames.includes("references.bib"));
    assert.ok(!handoffNames.includes("main.tex"));
    assert.ok(
      handoff.artifacts.some(
        (artifact) =>
          artifact.name === "result.png" &&
          artifact.roles.includes("evidence-figure"),
      ),
    );
  } finally {
    await rm(fixture.temporaryRoot, { recursive: true, force: true });
  }
});

test("MCP JSON-RPC and HTTP transports advertise bound, focused tools", async () => {
  const fixture = await createFixture();
  let server;
  try {
    const initialized = await handleJsonRpc(
      {
        jsonrpc: "2.0",
        id: 1,
        method: "initialize",
        params: { protocolVersion: "2025-11-25" },
      },
      { boundRunPath: fixture.state.runPath },
    );
    assert.equal(initialized.result.serverInfo.name, "YanShu Paper Workspace");
    assert.match(initialized.result.instructions, /inspect every relevant image/);

    const tools = toolDefinitions(fixture.state.runPath);
    assert.ok(
      tools.some((tool) => tool.name === "yanshu_view_image"),
    );
    assert.equal(
      tools[0].inputSchema.properties.runPath,
      undefined,
    );
    const health = await callTool("yanshu_health", {}, null);
    assert.equal(health.structuredContent.ready, true);
    assert.equal(health.structuredContent.runBound, false);

    const manifestResult = await callTool(
      "yanshu_get_round_manifest",
      { round: 1 },
      fixture.state.runPath,
    );
    assert.equal(manifestResult.structuredContent.round.number, 1);

    const evidenceResult = await callTool(
      "yanshu_get_evidence_index",
      { round: 1 },
      fixture.state.runPath,
    );
    const figureArtifactId =
      evidenceResult.structuredContent.figures[0].graphics[0].artifactId;
    const imageResult = await callTool(
      "yanshu_view_image",
      { round: 1, artifactId: figureArtifactId },
      fixture.state.runPath,
    );
    assert.equal(imageResult.content[1].type, "image");
    assert.equal(imageResult.content[1].mimeType, "image/png");
    assert.equal(
      Buffer.from(imageResult.content[1].data, "base64").length,
      ONE_PIXEL_PNG.length,
    );

    const started = await startHttpServer({
      host: "127.0.0.1",
      port: 0,
      token: "test-token",
      boundRunPath: fixture.state.runPath,
    });
    server = started.server;
    const response = await fetch(started.state.localUrl, {
      method: "POST",
      headers: {
        Accept: "application/json, text/event-stream",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 2,
        method: "tools/list",
        params: {},
      }),
    });
    assert.equal(response.status, 200);
    const payload = await response.json();
    assert.ok(
      payload.result.tools.some(
        (tool) => tool.name === "yanshu_compile_latex",
      ),
    );
  } finally {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
    await rm(fixture.temporaryRoot, { recursive: true, force: true });
  }
});

test("plugin manifest ships the YanShu MCP companion", async () => {
  const manifest = JSON.parse(
    await readFile(
      new URL("../.codex-plugin/plugin.json", import.meta.url),
      "utf8",
    ),
  );
  const mcp = JSON.parse(
    await readFile(new URL("../.mcp.json", import.meta.url), "utf8"),
  );
  assert.equal(manifest.mcpServers, "./.mcp.json");
  assert.deepEqual(
    mcp.mcpServers["yanshu-paper-workspace"].args,
    [
      "./scripts/node-launcher.cjs",
      "./mcp/server.mjs",
      "--transport",
      "stdio",
    ],
  );
});

test("run-scoped MCP session starts, responds, and stops cleanly", async () => {
  const fixture = await createFixture();
  let started = false;
  try {
    const pluginRoot = path.resolve(
      fileURLToPath(new URL("..", import.meta.url)),
    );
    const session = await startMcpSession({
      pluginRoot,
      runPath: fixture.state.runPath,
      port: 0,
    });
    started = true;
    assert.match(session.localUrl, /^http:\/\/127\.0\.0\.1:\d+\/mcp\//);
    assert.match(session.bootstrapPrompt, /call yanshu_get_round_manifest first/i);

    const status = await mcpSessionStatus(fixture.state.runPath);
    assert.equal(status.running, true);
    assert.equal(status.session.pid, session.pid);

    const stopped = await stopMcpSession(fixture.state.runPath);
    started = false;
    assert.equal(stopped.stopped, true);
  } finally {
    if (started) {
      await stopMcpSession(fixture.state.runPath);
    }
    await rm(fixture.temporaryRoot, { recursive: true, force: true });
  }
});
