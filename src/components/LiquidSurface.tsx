import React from "react";
import { BlurView } from "expo-blur";
import { Platform, View, type ViewProps } from "react-native";

type LiquidSurfaceProps = ViewProps & {
  children: React.ReactNode;
  className?: string;
  rounded?: "full" | "3xl" | "2xl" | "xl";
};

const roundedClass = {
  full: "rounded-full",
  "3xl": "rounded-3xl",
  "2xl": "rounded-2xl",
  xl: "rounded-xl",
} as const;

/**
 * Frosted-glass surface — pair with the `liquid` utility class from global.css.
 * Search bars and floating panels use `rounded="full"` or `rounded="2xl"`.
 */
export default function LiquidSurface({
  children,
  className = "",
  rounded = "full",
  style,
  ...props
}: LiquidSurfaceProps) {
  const radiusClass = roundedClass[rounded];

  if (Platform.OS === "web") {
    return (
      <View
        className={`liquid ${radiusClass} ${className}`}
        style={style}
        {...props}
      >
        {children}
      </View>
    );
  }

  return (
    <BlurView
      intensity={Platform.OS === "ios" ? 48 : 72}
      tint="light"
      className={`liquid ${radiusClass} ${className}`}
      style={style}
      experimentalBlurMethod={
        Platform.OS === "android" ? "dimezisBlurView" : undefined
      }
      {...props}
    >
      {children}
    </BlurView>
  );
}
