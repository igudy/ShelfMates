import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { AuthHero } from "@/components/auth";

import GetStartedIcon from "../../assets/images/getStartedicon.svg";

type InterestsScreenProps = {
  onContinue: () => void;
};

const MIN_SELECTION = 3;

type Interest = {
  label: string;
  color: string;
  rotate: number;
};

/** 4 × 3 grid — tighter spacing with subtle tilt like Figma. */
const INTEREST_ROWS: Interest[][] = [
  [
    { label: "Design", color: "#F2B93E", rotate: -6 },
    { label: "Sci-Fi", color: "#6BB3F2", rotate: 5 },
    { label: "Biography", color: "#A0D858", rotate: -5 },
  ],
  [
    { label: "History", color: "#E5533C", rotate: 4 },
    { label: "Fiction", color: "#E8843C", rotate: -7 },
    { label: "Business", color: "#6BB3F2", rotate: 5 },
  ],
  [
    { label: "Technology", color: "#A0D858", rotate: -6 },
    { label: "Art", color: "#F2B93E", rotate: 4 },
    { label: "Fantasy", color: "#8B5CF6", rotate: -4 },
  ],
  [
    { label: "Science", color: "#6BB3F2", rotate: 5 },
    { label: "Self-Help", color: "#E8843C", rotate: -5 },
    { label: "Philosophy", color: "#A0D858", rotate: 4 },
  ],
];

type InterestChipProps = {
  label: string;
  color: string;
  rotate: number;
  isSelected: boolean;
  onPress: () => void;
};

function InterestChip({
  label,
  color,
  rotate,
  isSelected,
  onPress,
}: InterestChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        transform: [{ rotate: `${rotate}deg` }],
        backgroundColor: isSelected ? color : "#FFFFFF",
      }}
      className="rounded-full px-5 py-3.5 shadow-md shadow-black/15 active:opacity-90"
    >
      <Text className="font-satoshi-bold text-base text-[#1C1917]">{label}</Text>
    </Pressable>
  );
}

export default function InterestsScreen({ onContinue }: InterestsScreenProps) {
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(["Design", "Fiction", "Technology"])
  );

  const toggle = (label: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  };

  const canContinue = selected.size >= MIN_SELECTION;

  return (
    <SafeAreaView className="flex-1 bg-hero" edges={["top", "bottom"]}>
      <StatusBar style="light" />

      <View className="flex-1">
        <AuthHero
          title="Choose your interests"
          subtitle="Pick at least 3 topics to tune your Vibe Match recommendations."
        />

        <View className="flex-1 justify-between px-5 pb-2 pt-1">
          {INTEREST_ROWS.map((row, rowIndex) => (
            <View key={rowIndex} className="w-full flex-row items-center justify-between">
              {row.map(({ label, color, rotate }) => (
                <InterestChip
                  key={label}
                  label={label}
                  color={color}
                  rotate={rotate}
                  isSelected={selected.has(label)}
                  onPress={() => toggle(label)}
                />
              ))}
            </View>
          ))}
        </View>
      </View>

      <View className="px-6 pb-2">
        <Pressable
          onPress={onContinue}
          disabled={!canContinue}
          className={`flex-row items-center justify-center rounded-full bg-[#EDEAE4] py-5 active:opacity-90 ${
            canContinue ? "" : "opacity-50"
          }`}
        >
          <Text className="font-satoshi-bold text-xl text-[#1C1917]">
            Continue
          </Text>
          <View className="ml-3">
            <GetStartedIcon width={30} height={19} />
          </View>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
