export class CliError extends Error {
  constructor(message, code = "invalid_request", details = undefined) {
    super(message);
    this.name = "CliError";
    this.code = code;
    this.details = details;
  }
}

export function parseArgs(argv) {
  const [command = "help", ...tokens] = argv;
  const flags = {};
  const positional = [];

  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    if (!token.startsWith("--")) {
      positional.push(token);
      continue;
    }

    const separator = token.indexOf("=");
    if (separator > -1) {
      flags[token.slice(2, separator)] = token.slice(separator + 1);
      continue;
    }

    const name = token.slice(2);
    const next = tokens[index + 1];
    if (next !== undefined && !next.startsWith("--")) {
      flags[name] = next;
      index += 1;
    } else {
      flags[name] = true;
    }
  }

  return { command, flags, positional };
}

export function stringFlag(flags, name, fallback = undefined) {
  const value = flags[name];
  if (value === undefined) return fallback;
  if (value === true) return "true";
  return String(value);
}

export function requiredFlag(flags, name) {
  const value = stringFlag(flags, name);
  if (!value) {
    throw new CliError(`Missing required option --${name}.`);
  }
  return value;
}

export function booleanFlag(flags, name, fallback) {
  const value = flags[name];
  if (value === undefined) return fallback;
  if (value === true) return true;
  if (["true", "1", "yes", "on"].includes(String(value).toLowerCase())) {
    return true;
  }
  if (["false", "0", "no", "off"].includes(String(value).toLowerCase())) {
    return false;
  }
  throw new CliError(
    `Option --${name} must be true or false, received "${value}".`,
  );
}

export function numberFlag(flags, name, fallback = undefined) {
  const value = flags[name];
  if (value === undefined) return fallback;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    throw new CliError(`Option --${name} must be a finite number.`);
  }
  return parsed;
}

export function enumFlag(flags, name, allowed, fallback) {
  const value = stringFlag(flags, name, fallback);
  if (!allowed.includes(value)) {
    throw new CliError(
      `Option --${name} must be one of ${allowed.join(", ")}.`,
    );
  }
  return value;
}

export function printJson(value) {
  process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
}
