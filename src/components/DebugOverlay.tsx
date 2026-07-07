import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Modal,
  PanResponder,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import {
  clearNetworkLogs,
  getEndpointLabel,
  getFailedNetworkLogCount,
  getNetworkLogs,
  subscribeNetworkLogs,
  type NetworkLogEntry,
} from "@/debug/networkLog";

const BUTTON_SIZE = 44;
const EDGE_PADDING = 12;
const TAP_SLOP = 8;
const SHEET_DISMISS_THRESHOLD = 96;

function LogRow({ entry }: { entry: NetworkLogEntry }) {
  const isPending = entry.logStatus === "pending";
  const statusColor = isPending
    ? "#F59E0B"
    : entry.ok
      ? "#22C55E"
      : "#EF4444";

  return (
    <View className="mb-3 rounded-2xl border border-[#E5E7EB] bg-white p-3">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <View
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: statusColor }}
          />
          <Text className="font-satoshi-bold text-sm text-[#1C1917]">
            {entry.method} {getEndpointLabel(entry.url)}
          </Text>
        </View>
        {entry.durationMs != null ? (
          <Text className="font-satoshi text-xs text-[#6B7280]">
            {entry.durationMs}ms
          </Text>
        ) : null}
      </View>

      <Text className="mt-2 font-satoshi text-xs text-[#6B7280]">
        {entry.displayUrl}
      </Text>

      {entry.status != null || entry.apiStatus ? (
        <Text className="mt-2 font-satoshi-medium text-xs text-[#374151]">
          {entry.status != null ? `HTTP ${entry.status}` : ""}
          {entry.status != null && entry.apiStatus ? " • " : ""}
          {entry.apiStatus ? `API ${entry.apiStatus}` : ""}
        </Text>
      ) : null}

      {entry.error ? (
        <Text className="mt-2 font-satoshi-bold text-xs text-[#EF4444]">
          {entry.error}
        </Text>
      ) : null}

      {entry.responsePreview ? (
        <Text className="mt-2 font-satoshi text-[11px] leading-4 text-[#9CA3AF]">
          {entry.responsePreview}
        </Text>
      ) : null}
    </View>
  );
}

export function DebugOverlay() {
  const [visible, setVisible] = useState(false);
  const [, setTick] = useState(0);
  const insets = useSafeAreaInsets();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const [position, setPosition] = useState({
    x: EDGE_PADDING,
    y: insets.top + 12,
  });

  const positionRef = useRef(position);
  const dragOriginRef = useRef(position);
  const movedRef = useRef(false);
  const sheetTranslateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      sheetTranslateY.setValue(0);
    }
  }, [visible, sheetTranslateY]);

  const closeSheet = () => {
    setVisible(false);
    sheetTranslateY.setValue(0);
  };

  const sheetPanResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gesture) =>
          gesture.dy > TAP_SLOP && gesture.dy > Math.abs(gesture.dx),
        onMoveShouldSetPanResponderCapture: (_, gesture) =>
          gesture.dy > TAP_SLOP && gesture.dy > Math.abs(gesture.dx),
        onPanResponderMove: (_, gesture) => {
          if (gesture.dy > 0) {
            sheetTranslateY.setValue(gesture.dy);
          }
        },
        onPanResponderRelease: (_, gesture) => {
          const shouldDismiss =
            gesture.dy > SHEET_DISMISS_THRESHOLD || gesture.vy > 0.75;

          if (shouldDismiss) {
            Animated.timing(sheetTranslateY, {
              toValue: screenHeight,
              duration: 180,
              useNativeDriver: true,
            }).start(closeSheet);
            return;
          }

          Animated.spring(sheetTranslateY, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 0,
          }).start();
        },
        onPanResponderTerminate: () => {
          Animated.spring(sheetTranslateY, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 0,
          }).start();
        },
      }),
    [screenHeight, sheetTranslateY]
  );

  useEffect(() => {
    positionRef.current = position;
  }, [position]);

  useEffect(() => {
    return subscribeNetworkLogs(() => setTick((value) => value + 1));
  }, []);

  const clampPosition = useMemo(() => {
    const minX = EDGE_PADDING;
    const maxX = Math.max(minX, screenWidth - BUTTON_SIZE - EDGE_PADDING);
    const minY = insets.top + EDGE_PADDING;
    const maxY = Math.max(
      minY,
      screenHeight - BUTTON_SIZE - insets.bottom - EDGE_PADDING
    );

    return (x: number, y: number) => ({
      x: Math.min(Math.max(x, minX), maxX),
      y: Math.min(Math.max(y, minY), maxY),
    });
  }, [insets.bottom, insets.top, screenHeight, screenWidth]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_, gesture) =>
          Math.abs(gesture.dx) > TAP_SLOP || Math.abs(gesture.dy) > TAP_SLOP,
        onPanResponderGrant: () => {
          movedRef.current = false;
          dragOriginRef.current = { ...positionRef.current };
        },
        onPanResponderMove: (_, gesture) => {
          if (
            Math.abs(gesture.dx) > TAP_SLOP ||
            Math.abs(gesture.dy) > TAP_SLOP
          ) {
            movedRef.current = true;
          }

          setPosition(
            clampPosition(
              dragOriginRef.current.x + gesture.dx,
              dragOriginRef.current.y + gesture.dy
            )
          );
        },
        onPanResponderRelease: () => {
          if (!movedRef.current) {
            setVisible(true);
          }
        },
        onPanResponderTerminate: () => {
          movedRef.current = false;
        },
      }),
    [clampPosition]
  );

  if (!__DEV__) {
    return null;
  }

  const logs = getNetworkLogs();
  const failedCount = getFailedNetworkLogCount();

  return (
    <>
      <Modal
        visible
        transparent
        animationType="none"
        statusBarTranslucent
        onRequestClose={() => {}}
      >
        <View
          pointerEvents="box-none"
          style={{
            flex: 1,
          }}
        >
          <View
            {...panResponder.panHandlers}
            style={{
              position: "absolute",
              left: position.x,
              top: position.y,
              width: BUTTON_SIZE,
              height: BUTTON_SIZE,
            }}
          >
            <View className="h-11 w-11 items-center justify-center rounded-full bg-[#111827] shadow-lg shadow-black/30">
              <Text className="text-lg">🐞</Text>
              {failedCount > 0 ? (
                <View className="absolute -right-1 -top-1 min-h-5 min-w-5 items-center justify-center rounded-full bg-[#EF4444] px-1">
                  <Text className="font-satoshi-bold text-[10px] text-white">
                    {failedCount > 9 ? "9+" : failedCount}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={visible}
        animationType="slide"
        transparent
        onRequestClose={closeSheet}
      >
        <View className="flex-1 justify-end bg-black/40">
          <Pressable className="flex-1" onPress={closeSheet} />
          <Animated.View
            style={{ transform: [{ translateY: sheetTranslateY }] }}
          >
            <SafeAreaView
              edges={["bottom"]}
              className="max-h-[78%] rounded-t-[28px] bg-[#F9FAFB]"
            >
              <View {...sheetPanResponder.panHandlers}>
                <View className="items-center pb-2 pt-3">
                  <View className="h-1 w-10 rounded-full bg-[#D1D5DB]" />
                </View>

                <View className="flex-row items-center justify-between border-b border-[#E5E7EB] px-5 pb-4">
                  <View>
                    <Text className="font-satoshi-bold text-lg text-[#1C1917]">
                      Debug
                    </Text>
                    <Text className="mt-1 font-satoshi text-sm text-[#6B7280]">
                      {failedCount} failing • {logs.length} entries
                    </Text>
                  </View>
                  <View className="flex-row gap-2">
                    <Pressable
                      onPress={clearNetworkLogs}
                      className="rounded-full bg-[#E5E7EB] px-4 py-2 active:opacity-80"
                    >
                      <Text className="font-satoshi-bold text-xs text-[#374151]">
                        Clear
                      </Text>
                    </Pressable>
                    <Pressable
                      onPress={closeSheet}
                      className="rounded-full bg-[#111827] px-4 py-2 active:opacity-80"
                    >
                      <Text className="font-satoshi-bold text-xs text-white">
                        Close
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </View>

              <ScrollView
                className="px-5 py-4"
                contentContainerClassName="pb-6"
                showsVerticalScrollIndicator={false}
              >
                {logs.length === 0 ? (
                  <View className="items-center py-12">
                    <Text className="font-satoshi text-base text-[#6B7280]">
                      Waiting for diagnostics…
                    </Text>
                    <Text className="mt-2 text-center font-satoshi text-sm text-[#9CA3AF]">
                      Reload the app if this stays empty. Startup checks run
                      automatically for the API key, map provider, and Places
                      API.
                    </Text>
                  </View>
                ) : (
                  logs.map((entry) => <LogRow key={entry.id} entry={entry} />)
                )}
              </ScrollView>
            </SafeAreaView>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
}
