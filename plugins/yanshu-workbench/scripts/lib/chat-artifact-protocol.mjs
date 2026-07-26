import path from "node:path";

export function normalizeChatArtifactName(value) {
  let normalized = path.basename(String(value)).trim();
  let previous;
  do {
    previous = normalized;
    normalized = normalized
      .replace(/\s*\(\d+\)(?=\.[^.]+$)/u, "")
      .replace(/\s*\(\d+\)$/u, "");
  } while (normalized !== previous);
  return normalized.toLocaleLowerCase("en-US");
}

export async function listLatestAssistantFiles(chatgpt) {
  const result = await chatgpt.files.listLatest({
    from: "latest_assistant",
    timeoutMs: 30_000,
  });
  if (!result?.ok) return result;
  return {
    ok: true,
    assistantTurn: result.data?.assistantTurn ?? null,
    files: (result.data?.files ?? []).map((file) => ({
      artifactName: file.artifactName,
      normalizedArtifactName:
        file.normalizedArtifactName ??
        normalizeChatArtifactName(
          file.backendFilename ?? file.artifactName,
        ),
      backendFilename: file.backendFilename ?? null,
      assistantIndex: file.assistantIndex ?? null,
      type: file.type ?? "file",
      downloadable: file.downloadable !== false,
    })),
  };
}

export async function downloadAssistantArtifact(
  chatgpt,
  {
    artifactName,
    destDir,
    timeoutMs = 120_000,
  },
) {
  if (!path.isAbsolute(destDir)) {
    throw new TypeError("destDir must be an absolute directory.");
  }
  const expected = normalizeChatArtifactName(artifactName);
  const expectedExtension = path
    .extname(artifactName)
    .toLocaleLowerCase("en-US");
  const imageExpected = [
    ".png",
    ".jpg",
    ".jpeg",
    ".webp",
  ].includes(expectedExtension);
  const inventory = await listLatestAssistantFiles(chatgpt);
  if (!inventory?.ok && !imageExpected) return inventory;
  const candidate = [...(inventory.files ?? [])]
    .reverse()
    .find(
      (file) =>
        file.normalizedArtifactName === expected ||
        normalizeChatArtifactName(file.artifactName) === expected,
    );
  if (!candidate) {
    if (
      imageExpected &&
      typeof chatgpt.artifacts?.listLatest === "function" &&
      typeof chatgpt.artifacts?.downloadLatest === "function"
    ) {
      const visualInventory =
        await chatgpt.artifacts.listLatest({
          kind: "image",
          max: 8,
          timeoutMs: Math.min(timeoutMs, 30_000),
        });
      const visuals = visualInventory?.ok
        ? (visualInventory.data?.artifacts ?? [])
        : [];
      if (visuals.length > 0) {
        const downloaded =
          await chatgpt.artifacts.downloadLatest({
            destDir,
            timeoutMs,
          });
        if (!downloaded?.ok) {
          return {
            ...downloaded,
            inventory,
            visualInventory,
          };
        }
        const downloadedPath = downloaded.data?.path ?? null;
        const downloadedName =
          downloaded.data?.suggestedFilename ??
          (downloadedPath
            ? path.basename(downloadedPath)
            : null);
        const downloadedExtension = path
          .extname(downloadedName ?? "")
          .toLocaleLowerCase("en-US");
        if (
          !downloadedName ||
          downloadedExtension !== expectedExtension
        ) {
          return {
            ok: false,
            status: "blocked",
            blocker: {
              kind: "download_unavailable",
              code: "generated_image_format_mismatch",
              message: `Expected a ${expectedExtension || "matching"} image for ${artifactName}, but ChatGPT provided ${downloadedName ?? "an unnamed artifact"}.`,
              resumable: true,
            },
            inventory,
            visualInventory,
            downloaded: downloaded.data ?? null,
          };
        }
        return {
          ok: true,
          assistantTurn:
            inventory?.assistantTurn ?? null,
          selected: {
            type: "image",
            artifactIndex: visuals.length - 1,
            selectorProvenance:
              visuals.at(-1)?.selectorProvenance ??
              null,
          },
          path: downloadedPath,
          downloadedName,
          canonicalArtifactName: artifactName,
          bytes: downloaded.data?.bytes ?? null,
          downloadMode: "generated-image-artifact",
        };
      }
    }
    return {
      ok: false,
      status: "blocked",
      blocker: {
        kind: "download_unavailable",
        code: "download_artifact_name_not_found",
        message: `The latest assistant turn does not contain ${artifactName}.`,
        resumable: true,
      },
      inventory,
    };
  }
  const downloaded = await chatgpt.files.downloadByArtifactName({
    artifactName: candidate.artifactName,
    destDir,
    from: {
      assistantIndex: candidate.assistantIndex,
    },
    timeoutMs,
  });
  if (!downloaded?.ok) {
    return {
      ...downloaded,
      inventory,
      selected: candidate,
    };
  }
  const downloadedPath = downloaded.data?.path ?? null;
  const downloadedName =
    downloaded.data?.suggestedFilename ??
    (downloadedPath ? path.basename(downloadedPath) : null);
  if (
    !downloadedName ||
    normalizeChatArtifactName(downloadedName) !== expected
  ) {
    return {
      ok: false,
      status: "blocked",
      blocker: {
        kind: "download_unavailable",
        code: "downloaded_artifact_name_mismatch",
        message: `Expected ${artifactName}, but the browser downloaded ${downloadedName ?? "an unnamed file"}.`,
        resumable: true,
      },
      inventory,
      selected: candidate,
      downloaded: downloaded.data ?? null,
    };
  }
  return {
    ok: true,
    assistantTurn: inventory.assistantTurn,
    selected: candidate,
    path: downloadedPath,
    downloadedName,
    bytes: downloaded.data?.bytes ?? null,
    downloadMode: "named-assistant-file",
  };
}
