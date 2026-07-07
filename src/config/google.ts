const apiKey = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API ?? "";

export function getGooglePlacesApiKey(): string {
  if (!apiKey) {
    console.warn(
      "EXPO_PUBLIC_GOOGLE_PLACES_API is missing. Map search will not work."
    );
  }
  return apiKey;
}
