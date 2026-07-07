import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
  type ImageSourcePropType,
} from "react-native";
import MapView, { Marker, type Region } from "react-native-maps";
import { getMapProviderInfo } from "@/config/mapProvider";
import { logMapError, logMapReady } from "@/debug/appDiagnostics";
import { SafeAreaView } from "react-native-safe-area-context";
import { BellIcon, SearchIcon } from "@/components/icons";
import BookCover from "@/components/BookCover";
import LiquidSurface from "@/components/LiquidSurface";
import { NEIGHBORS } from "@/data/neighbors";
import type { NeighborProfile } from "@/data/neighbors";
import {
  filterNearbyBooks,
  searchNearby,
  type NearbySearchResult,
} from "@/utils/searchNearby";

const DEFAULT_REGION: Region = {
  latitude: 6.5244,
  longitude: 3.3792,
  latitudeDelta: 0.045,
  longitudeDelta: 0.045,
};

const SNAP_REGION_DELTA = 0.018;
const SNAP_ANIMATION_MS = 480;

type NearbyScreenProps = {
  onNeighborSnap: (neighbor: NeighborProfile) => void;
  onOpenNotifications: () => void;
  unreadCount?: number;
};

function NeighborAvatar({ name, color }: { name: string; color: string }) {
  return (
    <View
      className="h-11 w-11 items-center justify-center rounded-full border-2 border-white shadow-lg shadow-black/20"
      style={{ backgroundColor: color }}
    >
      <Text className="font-satoshi-bold text-sm text-white">
        {name.slice(0, 1).toUpperCase()}
      </Text>
    </View>
  );
}

function BookCard({
  title,
  owner,
  distance,
  match,
  coverColor,
  coverImage,
  onPress,
}: {
  title: string;
  owner: string;
  distance: string;
  match: number;
  coverColor: string;
  coverImage?: ImageSourcePropType;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="mb-3 flex-row items-center rounded-3xl bg-[#F8F7FC] p-3 active:opacity-90"
    >
      <BookCover
        coverImage={coverImage}
        coverColor={coverColor}
        className="mr-3 h-16 w-12 rounded-lg"
      />
      <View className="flex-1">
        <Text className="font-satoshi-bold text-base text-[#1C1917]">
          {title}
        </Text>
        <Text className="mt-1 font-satoshi text-sm text-[#6B7280]">
          {owner} • {distance}
        </Text>
      </View>
      <View className="rounded-full bg-[#ECEBFB] px-3 py-2">
        <Text className="font-satoshi-bold text-xs text-[#3C06A7]">
          {match}% match
        </Text>
      </View>
    </Pressable>
  );
}

function SearchResultRow({
  result,
  onPress,
}: {
  result: NearbySearchResult;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="border-b border-[#F3F4F6] px-4 py-3 active:bg-[#F9FAFB]"
    >
      {result.type === "book" ? (
        <>
          <Text className="font-satoshi-medium text-base text-[#1C1917]">
            {result.title}
          </Text>
          <Text className="mt-0.5 font-satoshi text-sm text-[#6B7280]">
            {result.owner} • Book
          </Text>
        </>
      ) : (
        <>
          <Text className="font-satoshi-medium text-base text-[#1C1917]">
            {result.name}
          </Text>
          <Text className="mt-0.5 font-satoshi text-sm text-[#6B7280]">
            Neighbor
          </Text>
        </>
      )}
    </Pressable>
  );
}

export default function NearbyScreen({
  onNeighborSnap,
  onOpenNotifications,
  unreadCount = 2,
}: NearbyScreenProps) {
  const mapProviderInfo = useMemo(() => getMapProviderInfo(), []);
  const mapRef = useRef<MapView>(null);
  const mapReadyRef = useRef(false);
  const snapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [region, setRegion] = useState(DEFAULT_REGION);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const searchResults = useMemo(
    () => searchNearby(searchQuery),
    [searchQuery]
  );

  const visibleBooks = useMemo(
    () => filterNearbyBooks(searchQuery),
    [searchQuery]
  );

  const showSearchDropdown =
    isSearchFocused && searchQuery.trim().length > 0 && searchResults.length > 0;

  const snapToNeighbor = useCallback(
    (neighbor: NeighborProfile) => {
      if (snapTimeoutRef.current) {
        clearTimeout(snapTimeoutRef.current);
      }

      const nextRegion: Region = {
        latitude: neighbor.latitude,
        longitude: neighbor.longitude,
        latitudeDelta: SNAP_REGION_DELTA,
        longitudeDelta: SNAP_REGION_DELTA,
      };

      setRegion(nextRegion);
      mapRef.current?.animateToRegion(nextRegion, SNAP_ANIMATION_MS);

      snapTimeoutRef.current = setTimeout(() => {
        onNeighborSnap(neighbor);
      }, SNAP_ANIMATION_MS);
    },
    [onNeighborSnap]
  );

  useEffect(() => {
    return () => {
      if (snapTimeoutRef.current) {
        clearTimeout(snapTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!mapReadyRef.current) {
        logMapError(
          `${mapProviderInfo.label} did not finish loading within 8s. Check API key restrictions or use a dev build for Google Maps on iOS.`
        );
      }
    }, 8000);

    return () => clearTimeout(timeout);
  }, [mapProviderInfo.label]);

  const handleMapReady = useCallback(() => {
    mapReadyRef.current = true;
    logMapReady();
  }, []);

  const handleSearchSelect = (result: NearbySearchResult) => {
    setSearchQuery(
      result.type === "book" ? result.title : result.name
    );
    setIsSearchFocused(false);
    snapToNeighbor(result.neighbor);
  };

  return (
    <View className="flex-1 bg-white">
      <MapView
        ref={mapRef}
        provider={mapProviderInfo.provider}
        style={{ position: "absolute", inset: 0 }}
        initialRegion={DEFAULT_REGION}
        region={region}
        onRegionChangeComplete={setRegion}
        onMapReady={handleMapReady}
        onMapLoaded={handleMapReady}
        showsUserLocation={false}
        showsMyLocationButton={false}
      >
        {NEIGHBORS.map((neighbor) => (
          <Marker
            key={neighbor.id}
            coordinate={{
              latitude: neighbor.latitude,
              longitude: neighbor.longitude,
            }}
            onPress={() => snapToNeighbor(neighbor)}
          >
            <NeighborAvatar name={neighbor.name} color={neighbor.color} />
          </Marker>
        ))}
      </MapView>

      <SafeAreaView edges={["top"]} className="px-4">
        <View className="flex-row items-center gap-3">
          <LiquidSurface
            rounded="full"
            className="h-12 flex-1 flex-row items-center px-4"
          >
            <SearchIcon />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => {
                setTimeout(() => setIsSearchFocused(false), 160);
              }}
              placeholder="Search titles or neighbors..."
              placeholderTextColor="#9CA3AF"
              returnKeyType="search"
              className="ml-3 flex-1 font-satoshi text-base text-[#1C1917]"
            />
          </LiquidSurface>

          <Pressable
            onPress={onOpenNotifications}
            className="active:opacity-90"
          >
            <LiquidSurface
              rounded="full"
              className="h-12 w-12 items-center justify-center liquid-solid"
            >
              <BellIcon size={20} color="#334155" />
              {unreadCount > 0 ? (
                <View className="absolute right-3 top-3 h-2 w-2 rounded-full bg-[#EF4444]" />
              ) : null}
            </LiquidSurface>
          </Pressable>
        </View>

        {showSearchDropdown ? (
          <LiquidSurface rounded="2xl" className="mt-2">
            <FlatList
              data={searchResults}
              keyExtractor={(item) => item.id}
              keyboardShouldPersistTaps="handled"
              style={{ maxHeight: 220 }}
              renderItem={({ item }) => (
                <SearchResultRow
                  result={item}
                  onPress={() => handleSearchSelect(item)}
                />
              )}
            />
          </LiquidSurface>
        ) : null}
      </SafeAreaView>

      <View className="absolute bottom-0 left-0 right-0 rounded-t-[32px] bg-white px-5 pb-4 pt-10 shadow-2xl shadow-black/15">
        <View className="mb-4 flex-row items-start justify-between">
          <View>
            <Text className="font-satoshi-bold text-2xl text-[#1C1917]">
              Nearby Books
            </Text>
            <Text className="mt-1 font-satoshi text-sm text-[#6B7280]">
              {searchQuery.trim()
                ? `${visibleBooks.length} result${visibleBooks.length === 1 ? "" : "s"}`
                : "Updated just now"}
            </Text>
          </View>
          <View className="rounded-full bg-[#ECEBFB] px-3 py-2">
            <Text className="font-satoshi-bold text-xs text-[#3C06A7]">
              1.2KM
            </Text>
          </View>
        </View>

        <FlatList
          data={visibleBooks}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          style={{ maxHeight: 220 }}
          ListEmptyComponent={
            searchQuery.trim() ? (
              <View className="items-center py-8">
                <Text className="font-satoshi text-sm text-[#9CA3AF]">
                  No books or neighbors match your search.
                </Text>
              </View>
            ) : null
          }
          renderItem={({ item }) => (
            <BookCard
              title={item.title}
              owner={item.owner}
              distance={item.distance}
              match={item.match}
              coverColor={item.coverColor}
              coverImage={item.coverImage}
              onPress={() => {
                const neighbor = NEIGHBORS.find(
                  (entry) => entry.id === item.neighborId
                );
                if (neighbor) {
                  snapToNeighbor(neighbor);
                }
              }}
            />
          )}
        />
      </View>
    </View>
  );
}
