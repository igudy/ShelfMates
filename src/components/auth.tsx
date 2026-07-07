import React from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { AppleIcon, GoogleIcon } from "@/components/icons";

import Avatar1 from "../../assets/images/startYourLibImage1top.svg";
import Avatar2 from "../../assets/images/startYourLibImage2top.svg";
import Avatar3 from "../../assets/images/startYourLibImage3top.svg";

const AVATARS = [
  { Component: Avatar1, rotate: "-6deg", z: 10, marginTop: 2 },
  { Component: Avatar2, rotate: "5deg", z: 30, marginTop: -4 },
  { Component: Avatar3, rotate: "-5deg", z: 20, marginTop: 2 },
] as const;

type AuthHeroProps = {
  title: string;
  subtitle?: string;
  variant?: "hero" | "light";
};

/** Overlapping neighbour avatars used across auth flows. */
export function AuthAvatars() {
  return (
    <View className="mb-7 mt-2 flex-row items-end self-start">
      {AVATARS.map(({ Component, rotate, z, marginTop }, index) => (
        <View
          key={index}
          style={{
            marginLeft: index === 0 ? 0 : -26,
            marginTop,
            transform: [{ rotate }],
            zIndex: z,
          }}
        >
          <Component width={122} height={142} />
        </View>
      ))}
    </View>
  );
}

/** Purple or light hero with overlapping avatars, serif title and subtitle. */
export function AuthHero({
  title,
  subtitle = "Join over 2,000 neighbors sharing books.",
  variant = "hero",
}: AuthHeroProps) {
  const isLight = variant === "light";

  return (
    <SafeAreaView edges={["top"]}>
      <View className={`px-6 pb-8 pt-4 ${isLight ? "bg-white" : ""}`}>
        <AuthAvatars />

        <Text
          className={`font-instrument text-6xl leading-[60px] ${
            isLight ? "text-[#3C06A7]" : "text-white"
          }`}
        >
          {title}
        </Text>
        <Text
          className={`mt-3 font-satoshi text-base ${
            isLight ? "text-[#3C06A7]/80" : "text-white/80"
          }`}
        >
          {subtitle}
        </Text>
      </View>
    </SafeAreaView>
  );
}

type FieldProps = {
  label: string;
  children: React.ReactNode;
};

export function Field({ label, children }: FieldProps) {
  return (
    <View className="mb-5">
      <Text className="mb-2 font-satoshi-medium text-xs tracking-[2px] text-[#9CA3AF]">
        {label}
      </Text>
      {children}
    </View>
  );
}

type GradientButtonProps = {
  label: string;
  onPress: () => void;
  colors?: [string, string];
};

export function GradientButton({
  label,
  onPress,
  colors = ["#6D4BEF", "#2E1065"],
}: GradientButtonProps) {
  return (
    <Pressable onPress={onPress} className="active:opacity-90">
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ borderRadius: 999 }}
      >
        <View className="items-center py-5">
          <Text className="font-satoshi-bold text-lg text-white">{label}</Text>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

/** "──── Or ────" separator. */
export function OrDivider() {
  return (
    <View className="my-6 flex-row items-center">
      <View className="h-px flex-1 bg-[#E5E7EB]" />
      <Text className="mx-4 font-satoshi text-base text-[#6B7280]">Or</Text>
      <View className="h-px flex-1 bg-[#E5E7EB]" />
    </View>
  );
}

/** Google + Apple social sign-in buttons. */
export function SocialRow() {
  return (
    <View className="flex-row gap-3">
      <Pressable className="flex-1 flex-row items-center justify-center gap-2 rounded-full bg-[#ECEBFB] py-4 active:opacity-90">
        <GoogleIcon size={20} />
        <Text className="font-satoshi-medium text-base text-[#1C1917]">
          Google
        </Text>
      </Pressable>
      <Pressable className="flex-1 flex-row items-center justify-center gap-2 rounded-full bg-[#ECEBFB] py-4 active:opacity-90">
        <AppleIcon size={20} color="#1C1917" />
        <Text className="font-satoshi-medium text-base text-[#1C1917]">
          Apple
        </Text>
      </Pressable>
    </View>
  );
}
