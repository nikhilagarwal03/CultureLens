type LogLevel = "info" | "warn" | "error" | "debug";

type LogMeta = Record<string, unknown>;

type LogInput = {
  level: LogLevel;
  message: string;
  scope?: string;
  requestId?: string;
  meta?: LogMeta;
};

function toLine(input: LogInput): string {
  const base = {
    ts: new Date().toISOString(),
    level: input.level,
    scope: input.scope ?? "app",
    message: input.message,
    requestId: input.requestId,
    ...input.meta,
  };
  return JSON.stringify(base);
}

function write(level: LogLevel, line: string): void {
  if (level === "error") {
    console.error(line);
    return;
  }
  if (level === "warn") {
    console.warn(line);
    return;
  }
  if (level === "debug") {
    console.debug(line);
    return;
  }
  console.info(line);
}

export function log(input: LogInput): void {
  write(input.level, toLine(input));
}

export function logApiRequest(params: {
  routeName: string;
  requestId: string;
  method: string;
  durationMs: number;
}): void {
  log({
    level: "info",
    scope: "api",
    message: "request.completed",
    requestId: params.requestId,
    meta: {
      routeName: params.routeName,
      method: params.method,
      durationMs: params.durationMs,
    },
  });
}

export function logApiError(params: {
  routeName: string;
  requestId: string;
  durationMs: number;
  status: number;
  code: string;
}): void {
  log({
    level: "error",
    scope: "api",
    message: "request.failed",
    requestId: params.requestId,
    meta: {
      routeName: params.routeName,
      durationMs: params.durationMs,
      status: params.status,
      code: params.code,
    },
  });
}
