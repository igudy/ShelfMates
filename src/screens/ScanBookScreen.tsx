import React from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { ArrowLeftIcon } from "@/components/icons";

type ScanBookScreenProps = {
  onBack: () => void;
  onSimulateScan: () => void;
};

function ScanCorner({ className }: { className: string }) {
  return (
    <View className={`absolute h-8 w-8 border-white ${className}`} />
  );
}

export default function ScanBookScreen({
  onBack,
  onSimulateScan,
}: ScanBookScreenProps) {
  return (
    <View className="flex-1 bg-[#3C06A7]">
      <StatusBar style="light" />
      <SafeAreaView className="flex-1 px-6" edges={["top", "bottom"]}>
        <Pressable
          onPress={onBack}
          className="mb-8 h-11 w-11 items-center justify-center rounded-full bg-white active:opacity-90"
        >
          <ArrowLeftIcon />
        </Pressable>

        <Text className="font-instrument text-5xl leading-[52px] text-white">
          Add to Neighborhood
        </Text>
        <Text className="mt-3 font-satoshi text-base leading-6 text-white/80">
          Scan the ISBN barcode to automatically fetch book details and list it
          on your shelf.
        </Text>

        <View className="mt-10 flex-1 items-center justify-center">
          <View className="h-[320px] w-full overflow-hidden rounded-[28px] bg-black/30">
            <View className="absolute inset-5">
              <ScanCorner className="left-0 top-0 border-l-4 border-t-4" />
              <ScanCorner className="right-0 top-0 border-r-4 border-t-4" />
              <ScanCorner className="bottom-0 left-0 border-b-4 border-l-4" />
              <ScanCorner className="bottom-0 right-0 border-b-4 border-r-4" />
            </View>

            <View className="flex-1 items-center justify-center bg-[#1C1917]/40">
              <View className="h-0.5 w-[78%] bg-[#6BB3F2]" />
            </View>
          </View>
        </View>

        <Pressable
          onPress={onSimulateScan}
          className="mb-2 items-center rounded-full bg-white py-5 active:opacity-90"
        >
          <Text className="font-satoshi-bold text-lg text-[#1C1917]">
            Simulate ISBN Scan
          </Text>
        </Pressable>
      </SafeAreaView>
    </View>
  );
}
