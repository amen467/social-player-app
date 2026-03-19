export type LogLevel = "info" | "warn" | "error";

type LogMetadata = Record<string, unknown>;

function writeLog(level: LogLevel, event: string, metadata: LogMetadata = {}) {
  const payload = {
    level,
    event,
    timestamp: new Date().toISOString(),
    ...metadata,
  };

  const output = JSON.stringify(payload);

  if (level === "error") {
    console.error(output);
    return;
  }

  if (level === "warn") {
    console.warn(output);
    return;
  }

  console.info(output);
}

export const logger = {
  info: (event: string, metadata?: LogMetadata) => writeLog("info", event, metadata),
  warn: (event: string, metadata?: LogMetadata) => writeLog("warn", event, metadata),
  error: (event: string, metadata?: LogMetadata) => writeLog("error", event, metadata),
};
