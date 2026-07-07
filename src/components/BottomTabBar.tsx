import React from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import NearbyIcon from "../../assets/icons/nearby.svg";
import ShelfIcon from "../../assets/icons/shelf.svg";
import BioIcon from "../../assets/icons/bio.svg";

const ACTIVE_COLOR = "#3C06A7";
const INACTIVE_COLOR = "#90A1B9";
const ICON_BOX = 24;

export type TabId = "nearby" | "shelf" | "bio";

type TabConfig = {
  id: TabId;
  label: string;
  Icon: React.FC<{ width?: number; height?: number; color?: string }>;
};

const TABS: TabConfig[] = [
  { id: "nearby", label: "NEARBY", Icon: NearbyIcon },
  { id: "shelf", label: "SHELF", Icon: ShelfIcon },
  { id: "bio", label: "BIO", Icon: BioIcon },
];

type BottomTabBarProps = {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  className?: string;
};

export function BottomTabBar({
  activeTab,
  onTabChange,
  className = "",
}: BottomTabBarProps) {
  return (
    <SafeAreaView
      edges={["bottom"]}
      className={`border-t border-[#F3F4F6] bg-white px-8 pt-2 ${className}`}
    >
      <View className="flex-row items-center justify-between">
        {TABS.map(({ id, label, Icon }) => {
          const isActive = activeTab === id;
          const color = isActive ? ACTIVE_COLOR : INACTIVE_COLOR;

          return (
            <Pressable
              key={id}
              onPress={() => onTabChange(id)}
              className="min-w-[72px] items-center active:opacity-80"
            >
              <View
                className="items-center justify-center"
                style={{ width: ICON_BOX, height: ICON_BOX }}
              >
                <Icon width={ICON_BOX} height={ICON_BOX} color={color} />
              </View>
              <Text
                className={`mt-1 font-satoshi-bold text-[11px] tracking-[1px] ${
                  isActive ? "text-[#3C06A7]" : "text-[#9CA3AF]"
                }`}
              >
                {label}
              </Text>
              {isActive ? (
                <View className="mt-1 h-1.5 w-1.5 rounded-full bg-[#3C06A7]" />
              ) : (
                <View className="mt-1 h-1.5 w-1.5" />
              )}
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}
