import { getGooglePlacesApiKey } from "@/config/google";

export type PlacePrediction = {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText: string;
};

export type PlaceLocation = {
  latitude: number;
  longitude: number;
  description: string;
};

type AutocompleteResponse = {
  status: string;
  predictions?: Array<{
    place_id: string;
    description: string;
    structured_formatting?: {
      main_text?: string;
      secondary_text?: string;
    };
  }>;
};

type DetailsResponse = {
  status: string;
  result?: {
    geometry?: {
      location?: {
        lat: number;
        lng: number;
      };
    };
    formatted_address?: string;
  };
};

export async function fetchPlacePredictions(
  input: string
): Promise<PlacePrediction[]> {
  const query = input.trim();
  if (query.length < 2) {
    return [];
  }

  const key = getGooglePlacesApiKey();
  if (!key) {
    return [];
  }

  const params = new URLSearchParams({
    input: query,
    key,
    types: "geocode",
  });

  const response = await fetch(
    `https://maps.googleapis.com/maps/api/place/autocomplete/json?${params}`
  );
  const data = (await response.json()) as AutocompleteResponse;

  if (data.status !== "OK" || !data.predictions) {
    return [];
  }

  return data.predictions.map((prediction) => ({
    placeId: prediction.place_id,
    description: prediction.description,
    mainText: prediction.structured_formatting?.main_text ?? prediction.description,
    secondaryText: prediction.structured_formatting?.secondary_text ?? "",
  }));
}

export async function fetchPlaceLocation(
  placeId: string
): Promise<PlaceLocation | null> {
  const key = getGooglePlacesApiKey();
  if (!key) {
    return null;
  }

  const params = new URLSearchParams({
    place_id: placeId,
    fields: "geometry,formatted_address",
    key,
  });

  const response = await fetch(
    `https://maps.googleapis.com/maps/api/place/details/json?${params}`
  );
  const data = (await response.json()) as DetailsResponse;

  const location = data.result?.geometry?.location;
  if (!location) {
    return null;
  }

  return {
    latitude: location.lat,
    longitude: location.lng,
    description: data.result?.formatted_address ?? "",
  };
}
