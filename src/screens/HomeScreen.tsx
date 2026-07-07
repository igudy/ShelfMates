import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import BackgroundCircles from "../../assets/images/gradientname.svg";
import GetStartedIcon from "../../assets/images/getStartedicon.svg";

const leftHandImage = require("../../assets/images/rightHandImage.png");
const rightHandImage = require("../../assets/images/leftHandImage.png");

type HomeScreenProps = {
  onGetStarted: () => void;
};

type CategoryPillProps = {
  label: string;
  className: string;
  textClassName: string;
};

function CategoryPill({ label, className, textClassName }: CategoryPillProps) {
  return (
    <View
      className={`absolute rounded-full px-6 py-3 shadow-lg shadow-black/25 ${className}`}
    >
      <Text className={`font-satoshi-bold text-lg ${textClassName}`}>
        {label}
      </Text>
    </View>
  );
}

export default function HomeScreen({ onGetStarted }: HomeScreenProps) {
  return (
    <SafeAreaView className="flex-1 bg-hero" edges={["top", "bottom"]}>
      <StatusBar style="light" />

      {/* Hero composition */}
      <View className="flex-1">
        {/* Concentric backdrop circles, centred behind the books */}
        <View className="absolute inset-x-0 top-2 items-center">
          <BackgroundCircles width={420} height={420} />
        </View>

        {/* Left hand holding "Thinking, Fast and Slow" */}
        <View className="absolute left-[-28px] top-[196px]">
          <Image
            source={leftHandImage}
            style={{ width: 286, height: 518 }}
            resizeMode="contain"
          />
        </View>

        {/* Right hand holding "Atomic Habits" */}
        <View className="absolute right-[-40px] top-3">
          <Image
            source={rightHandImage}
            style={{ width: 352, height: 483 }}
            resizeMode="contain"
          />
        </View>

        {/* Scattered category pills */}
        <CategoryPill
          label="Sci-Fi"
          className="left-[112px] top-9 z-20 bg-[#2E1065] rotate-[-9deg]"
          textClassName="text-white"
        />
        <CategoryPill
          label="History"
          className="right-1 top-[150px] z-20 bg-[#6BB3F2] rotate-[5deg]"
          textClassName="text-white"
        />
        <CategoryPill
          label="Fiction"
          className="left-[-6px] top-[228px] z-20 bg-[#E5533C] rotate-[-4deg]"
          textClassName="text-white"
        />
        <CategoryPill
          label="Biography"
          className="left-[150px] top-[352px] z-20 bg-[#A0D858] rotate-[6deg]"
          textClassName="text-[#1C1917]"
        />
        <CategoryPill
          label="Design"
          className="right-6 top-[432px] z-20 bg-[#F2B93E] rotate-[-4deg]"
          textClassName="text-[#1C1917]"
        />
      </View>

      {/* Headline + CTA */}
      <View className="px-6 pb-2">
        <Text className="font-instrument text-6xl leading-[64px] text-white">
          Share Your Shelf, Expand Your World.
        </Text>

        <Pressable
          onPress={onGetStarted}
          className="mt-8 flex-row items-center justify-center rounded-full bg-[#EDEAE4] py-5 active:opacity-90"
        >
          <Text className="font-satoshi-bold text-xl text-[#1C1917]">
            Get Started
          </Text>
          <View className="ml-3">
            <GetStartedIcon width={30} height={19} />
          </View>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
