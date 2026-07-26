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
const entryPoint = path.join(
  siteRoot,
  "content",
  "prompts",
  "pluginExport.ts",
);
const outputPath = path.resolve(
  siteRoot,
  "..",
  "plugins",
  "yanshu-workbench",
  "runtime",
  "prompt-engine.mjs",
);
const checkOnly = process.argv.includes("--check");

const result = await build({
  entryPoints: [entryPoint],
  bundle: true,
  platform: "node",
  format: "esm",
  target: "node22",
  outfile: outputPath,
  write: false,
  logLevel: "silent",
});
const generated = result.outputFiles.find(
  (file) => path.resolve(file.path) === outputPath,
)?.contents;
if (!generated) {
  throw new Error("esbuild did not return the YanShu prompt runtime.");
}

if (checkOnly) {
  let current = null;
  try {
    current = await readFile(outputPath);
  } catch {
    // The mismatch message below also covers a missing generated runtime.
  }
  if (!current || !current.equals(generated)) {
    process.stderr.write(
      "YanShu prompt runtime is stale. Run `npm run plugin:bundle` from site/ and commit the generated runtime.\n",
    );
    process.exitCode = 1;
  } else {
    process.stdout.write(
      "YanShu website sources and plugin prompt runtime are byte-for-byte synchronized.\n",
    );
  }
} else {
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, generated);
  process.stdout.write(`Synchronized ${outputPath}\n`);
}
