export type NetworkLogStatus = "success" | "error" | "pending";

export type NetworkLogEntry = {
  id: string;
  method: string;
  url: string;
  displayUrl: string;
  status?: number;
  apiStatus?: string;
  ok: boolean;
  durationMs?: number;
  error?: string;
  responsePreview?: string;
  timestamp: number;
  logStatus: NetworkLogStatus;
};

const MAX_LOGS = 50;

let logs: NetworkLogEntry[] = [];
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

export function subscribeNetworkLogs(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getNetworkLogs(): NetworkLogEntry[] {
  return logs;
}

export function getFailedNetworkLogCount(): number {
  return logs.filter((log) => !log.ok && log.logStatus !== "pending").length;
}

export function clearNetworkLogs() {
  logs = [];
  notify();
}

export function redactSensitiveUrl(url: string): string {
  return url.replace(/([?&]key=)[^&]+/gi, "$1***");
}

export function getEndpointLabel(url: string): string {
  try {
    const { pathname } = new URL(url);
    const parts = pathname.split("/").filter(Boolean);
    return parts.slice(-2).join("/") || pathname || url;
  } catch {
    return url;
  }
}

export function addNetworkLog(entry: NetworkLogEntry) {
  logs = [entry, ...logs].slice(0, MAX_LOGS);
  notify();
}

export function updateNetworkLog(
  id: string,
  patch: Partial<NetworkLogEntry>
) {
  logs = logs.map((log) => (log.id === id ? { ...log, ...patch } : log));
  notify();
}

async function readResponsePreview(response: Response): Promise<{
  apiStatus?: string;
  errorMessage?: string;
  preview?: string;
  businessOk: boolean;
}> {
  try {
    const clone = response.clone();
    const contentType = clone.headers.get("content-type") ?? "";

    if (!contentType.includes("application/json")) {
      const text = await clone.text();
      return {
        preview: text.slice(0, 180),
        businessOk: response.ok,
      };
    }

    const data = (await clone.json()) as Record<string, unknown>;
    const apiStatus = typeof data.status === "string" ? data.status : undefined;
    const errorMessage =
      typeof data.error_message === "string" ? data.error_message : undefined;
    const businessOk =
      response.ok && (!apiStatus || apiStatus === "OK" || apiStatus === "ZERO_RESULTS");

    return {
      apiStatus,
      errorMessage,
      preview: JSON.stringify(data).slice(0, 220),
      businessOk,
    };
  } catch {
    return { businessOk: response.ok };
  }
}

export function installNetworkLogger() {
  if (!__DEV__ || (globalThis as { __networkLoggerInstalled?: boolean }).__networkLoggerInstalled) {
    return;
  }

  (globalThis as { __networkLoggerInstalled?: boolean }).__networkLoggerInstalled = true;

  const originalFetch = globalThis.fetch.bind(globalThis);

  globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const startedAt = Date.now();
    const method = (init?.method ?? "GET").toUpperCase();
    const rawUrl =
      typeof input === "string"
        ? input
        : input instanceof URL
          ? input.toString()
          : input.url;
    const id = `${startedAt}-${Math.random().toString(36).slice(2, 8)}`;

    addNetworkLog({
      id,
      method,
      url: rawUrl,
      displayUrl: redactSensitiveUrl(rawUrl),
      ok: false,
      timestamp: startedAt,
      logStatus: "pending",
    });

    try {
      const response = await originalFetch(input, init);
      const durationMs = Date.now() - startedAt;
      const parsed = await readResponsePreview(response);
      const ok = parsed.businessOk;

      updateNetworkLog(id, {
        status: response.status,
        apiStatus: parsed.apiStatus,
        durationMs,
        ok,
        logStatus: ok ? "success" : "error",
        error: ok
          ? undefined
          : parsed.errorMessage ??
            (parsed.apiStatus && parsed.apiStatus !== "OK"
              ? `API status: ${parsed.apiStatus}`
              : `HTTP ${response.status}`),
        responsePreview: parsed.preview,
      });

      return response;
    } catch (error) {
      const durationMs = Date.now() - startedAt;
      updateNetworkLog(id, {
        durationMs,
        ok: false,
        logStatus: "error",
        error: error instanceof Error ? error.message : "Network request failed",
      });
      throw error;
    }
  };
}
