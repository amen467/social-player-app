import type { Instrumentation } from "next";

import { logger } from "@/lib/observability/logger";

export function register() {
  logger.info("instrumentation_registered", {
    runtime: process.env.NEXT_RUNTIME ?? "nodejs",
    environment: process.env.NODE_ENV,
  });
}

export const onRequestError: Instrumentation.onRequestError = async (
  error,
  request,
  context,
) => {
  const normalizedError = error instanceof Error ? error : new Error("Unknown request error");
  const digest =
    typeof error === "object" && error !== null && "digest" in error
      ? String((error as { digest?: unknown }).digest ?? "")
      : "";

  logger.error("request_error", {
    message: normalizedError.message,
    digest,
    path: request.path,
    method: request.method,
    routeType: context.routeType,
    routePath: context.routePath,
  });
};
