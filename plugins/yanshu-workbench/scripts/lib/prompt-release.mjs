export const OFFICIAL_RECONSTRUCTION_URL =
  "https://yanshu-workbench.pages.dev/reconstruction/";

export function compareWorkflowVersions(left, right) {
  const parse = (value) =>
    String(value)
      .split(".")
      .map((part) => Number.parseInt(part, 10));
  const leftParts = parse(left);
  const rightParts = parse(right);
  const length = Math.max(leftParts.length, rightParts.length);
  for (let index = 0; index < length; index += 1) {
    const difference =
      (leftParts[index] ?? 0) - (rightParts[index] ?? 0);
    if (difference !== 0) return Math.sign(difference);
  }
  return 0;
}

export function inspectPublishedPromptRelease(
  installedVersion,
  html,
  officialUrl = OFFICIAL_RECONSTRUCTION_URL,
) {
  const match = html.match(
    /data-reconstruction-workflow-version=["']([^"']+)["']/i,
  );
  if (!match) {
    return {
      ok: true,
      status: "unavailable",
      installedVersion,
      publishedVersion: null,
      officialUrl,
      note:
        "The official site has not exposed a readable workflow version yet; local generated-bundle validation still applies.",
    };
  }
  const publishedVersion = match[1];
  const comparison = compareWorkflowVersions(
    installedVersion,
    publishedVersion,
  );
  return {
    ok: comparison >= 0,
    status:
      comparison === 0
        ? "match"
        : comparison < 0
          ? "installed-older"
          : "installed-newer",
    installedVersion,
    publishedVersion,
    officialUrl,
    note:
      comparison === 0
        ? "The installed plugin and official website use the same canonical workflow release."
        : comparison < 0
          ? "Upgrade YanShu before starting a new run; the installed plugin is older than the official prompt release."
          : "This development build is newer than the currently published website.",
  };
}

export async function checkPublishedPromptRelease(
  installedVersion,
  options = {},
) {
  const officialUrl =
    options.officialUrl ?? OFFICIAL_RECONSTRUCTION_URL;
  const fetchImpl = options.fetchImpl ?? fetch;
  try {
    const response = await fetchImpl(officialUrl, {
      headers: { Accept: "text/html" },
      redirect: "follow",
      signal: AbortSignal.timeout(options.timeoutMs ?? 4_000),
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return inspectPublishedPromptRelease(
      installedVersion,
      await response.text(),
      officialUrl,
    );
  } catch (error) {
    return {
      ok: true,
      status: "unavailable",
      installedVersion,
      publishedVersion: null,
      officialUrl,
      note: `Could not read the official release version: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
}
