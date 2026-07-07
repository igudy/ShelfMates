import Constants from "expo-constants";
import { Platform } from "react-native";
import { PROVIDER_GOOGLE, type Provider } from "react-native-maps";
import { getGooglePlacesApiKey } from "@/config/google";

export type MapProviderInfo = {
  provider?: Provider;
  label: string;
  reason: string;
  needsDevBuild: boolean;
};

export function getMapProviderInfo(): MapProviderInfo {
  const hasApiKey = Boolean(getGooglePlacesApiKey());
  const isExpoGo = Constants.appOwnership === "expo";

  if (Platform.OS === "ios" && isExpoGo) {
    return {
      provider: undefined,
      label: "Apple Maps",
      reason:
        "Expo Go on iOS cannot load Google Maps tiles. Using Apple Maps instead. Run a dev build for Google Maps.",
      needsDevBuild: true,
    };
  }

  if (!hasApiKey) {
    return {
      provider: Platform.OS === "android" ? PROVIDER_GOOGLE : undefined,
      label: Platform.OS === "android" ? "Google Maps (no API key)" : "Apple Maps",
      reason:
        "EXPO_PUBLIC_GOOGLE_PLACES_API is missing. Map tiles may be blank on Android.",
      needsDevBuild: Platform.OS !== "android",
    };
  }

  return {
    provider: PROVIDER_GOOGLE,
    label: "Google Maps",
    reason: isExpoGo
      ? "Using Google Maps in Expo Go."
      : "Using Google Maps from your dev/production build.",
    needsDevBuild: false,
  };
}
