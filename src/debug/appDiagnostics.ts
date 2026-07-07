import { Platform } from "react-native";
import Constants from "expo-constants";
import { getGooglePlacesApiKey } from "@/config/google";
import { getMapProviderInfo } from "@/config/mapProvider";
import { addNetworkLog } from "@/debug/networkLog";

let diagnosticsStarted = false;

function maskKey(key: string): string {
  if (key.length <= 8) {
    return "***";
  }
  return `${key.slice(0, 6)}…${key.slice(-4)}`;
}

function logDiagnostic(
  id: string,
  label: string,
  ok: boolean,
  detail: string
) {
  addNetworkLog({
    id,
    method: "DIAG",
    url: label,
    displayUrl: label,
    ok,
    logStatus: ok ? "success" : "error",
    error: ok ? undefined : detail,
    responsePreview: ok ? detail : undefined,
    timestamp: Date.now(),
  });
}

export async function runAppDiagnostics() {
  if (!__DEV__ || diagnosticsStarted) {
    return;
  }

  diagnosticsStarted = true;

  const apiKey = getGooglePlacesApiKey();
  const mapInfo = getMapProviderInfo();

  logDiagnostic(
    `diag-env-${Date.now()}`,
    "Runtime",
    true,
    `${Platform.OS} • ${Constants.appOwnership ?? "unknown"} • dev=${String(__DEV__)}`
  );

  logDiagnostic(
    `diag-key-${Date.now()}`,
    "Google API key",
    Boolean(apiKey),
    apiKey
      ? `Configured (${maskKey(apiKey)})`
      : "EXPO_PUBLIC_GOOGLE_PLACES_API is missing from .env"
  );

  logDiagnostic(
    `diag-map-${Date.now()}`,
    "Map provider",
    !mapInfo.needsDevBuild || mapInfo.provider !== undefined,
    `${mapInfo.label} — ${mapInfo.reason}`
  );

  if (!apiKey) {
    return;
  }

  try {
    const params = new URLSearchParams({
      input: "Lagos",
      key: apiKey,
      types: "geocode",
    });

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?${params}`
    );
    const data = (await response.json()) as {
      status?: string;
      error_message?: string;
    };

    const ok =
      response.ok &&
      (data.status === "OK" ||
        data.status === "ZERO_RESULTS" ||
        !data.status);

    logDiagnostic(
      `diag-places-${Date.now()}`,
      "Places API health",
      ok,
      ok
        ? `HTTP ${response.status} • API ${data.status ?? "OK"}`
        : data.error_message ??
            `HTTP ${response.status} • API ${data.status ?? "UNKNOWN"}`
    );
  } catch (error) {
    logDiagnostic(
      `diag-places-${Date.now()}`,
      "Places API health",
      false,
      error instanceof Error ? error.message : "Places API request failed"
    );
  }
}

export function logMapReady() {
  logDiagnostic(
    `diag-map-ready-${Date.now()}`,
    "Map ready",
    true,
    `${getMapProviderInfo().label} loaded successfully`
  );
}

export function logMapError(message: string) {
  logDiagnostic(
    `diag-map-error-${Date.now()}`,
    "Map error",
    false,
    message
  );
}
