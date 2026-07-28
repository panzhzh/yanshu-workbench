import { build } from "esbuild";
import {
  mkdir,
  readFile,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const siteRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const pluginRuntimeRoot = path.resolve(
  siteRoot,
  "..",
  "plugins",
  "yanshu-workbench",
  "runtime",
);
const runtimeTargets = [
  {
    label: "reconstruction prompt runtime",
    entryPoint: path.join(
      siteRoot,
      "content",
      "prompts",
      "pluginExport.ts",
    ),
    outputPath: path.join(pluginRuntimeRoot, "prompt-engine.mjs"),
  },
  {
    label: "skill workflow runtime",
    entryPoint: path.join(
      siteRoot,
      "content",
      "workflows",
      "pluginExport.ts",
    ),
    outputPath: path.join(pluginRuntimeRoot, "skill-workflow-engine.mjs"),
  },
];
const checkOnly = process.argv.includes("--check");

const generatedTargets = [];
for (const target of runtimeTargets) {
  const result = await build({
    entryPoints: [target.entryPoint],
    bundle: true,
    platform: "node",
    format: "esm",
    target: "node22",
    outfile: target.outputPath,
    write: false,
    logLevel: "silent",
  });
  const generated = result.outputFiles.find(
    (file) => path.resolve(file.path) === target.outputPath,
  )?.contents;
  if (!generated) {
    throw new Error(`esbuild did not return the YanShu ${target.label}.`);
  }
  generatedTargets.push({ ...target, generated });
}

if (checkOnly) {
  const staleTargets = [];
  for (const target of generatedTargets) {
    let current = null;
    try {
      current = await readFile(target.outputPath);
    } catch {
      // The mismatch message below also covers a missing generated runtime.
    }
    if (!current || !current.equals(target.generated)) {
      staleTargets.push(target.label);
    }
  }
  if (staleTargets.length > 0) {
    process.stderr.write(
      `YanShu plugin runtime is stale (${staleTargets.join(", ")}). Run \`npm run plugin:bundle\` from site/ and commit the generated runtimes.\n`,
    );
    process.exitCode = 1;
  } else {
    process.stdout.write(
      "YanShu website sources and plugin runtimes are byte-for-byte synchronized.\n",
    );
  }
} else {
  await mkdir(pluginRuntimeRoot, { recursive: true });
  for (const target of generatedTargets) {
    await writeFile(target.outputPath, target.generated);
    process.stdout.write(`Synchronized ${target.outputPath}\n`);
  }
}
