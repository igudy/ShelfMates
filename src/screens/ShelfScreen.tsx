import React from "react";
import { Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BookOpenIcon, LightningIcon } from "@/components/icons";
import { useAppSelector } from "@/store/hooks";

const bookShelfImage = require("../../assets/images/bookShelf.png");

function EmptyShelfIllustration() {
  const bars = [
    { height: 56, rotate: "0deg" },
    { height: 72, rotate: "0deg" },
    { height: 48, rotate: "0deg" },
    { height: 64, rotate: "12deg" },
  ];

  return (
    <View className="flex-row items-end justify-center gap-3 py-8">
      {bars.map((bar, index) => (
        <View
          key={index}
          className="w-5 rounded-md bg-[#D1D5DB]"
          style={{
            height: bar.height,
            transform: [{ rotate: bar.rotate }],
          }}
        />
      ))}
    </View>
  );
}

export default function ShelfScreen() {
  const shelfBookCount = useAppSelector((state) => state.app.shelfBookCount);
  const hasBooks = shelfBookCount > 0;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pb-28 pt-4"
        showsVerticalScrollIndicator={false}
      >
        {/* Community trust card */}
        <View className="rounded-[28px] bg-[#3C06A7] p-6">
          <View className="flex-row items-start justify-between">
            <Text className="font-satoshi-medium text-xs tracking-[2px] text-white/80">
              COMMUNITY TRUST
            </Text>
            <LightningIcon size={18} />
          </View>

          <Text className="mt-3 font-satoshi-black text-5xl text-white">
            2,480
          </Text>

          <View className="mt-5 h-2 overflow-hidden rounded-full bg-white/20">
            <View className="h-full w-[85%] rounded-full bg-white" />
          </View>

          <Text className="mt-4 font-satoshi-medium text-xs tracking-[1px] text-white/70">
            TOP 5% OF LOCAL CONTRIBUTORS
          </Text>
        </View>

        {/* Currently reading */}
        <View className="mt-8">
          <View className="mb-4 flex-row items-center gap-2">
            <BookOpenIcon />
            <Text className="font-satoshi-bold text-xl text-[#1C1917]">
              Currently Reading
            </Text>
          </View>

          {hasBooks ? (
            <View className="overflow-hidden rounded-[24px] bg-[#F8F7FC]">
              <View className="items-end px-4 pt-3">
                <Text className="font-satoshi text-sm text-[#9CA3AF]">
                  {shelfBookCount} books
                </Text>
              </View>
              <Image
                source={bookShelfImage}
                resizeMode="contain"
                style={{ width: "100%", height: 208 }}
              />
            </View>
          ) : (
            <View className="items-center rounded-[24px] border border-[#E5E7EB] bg-[#FAFAFA] px-6 py-2">
              <EmptyShelfIllustration />
              <Text className="pb-6 font-satoshi text-base text-[#9CA3AF]">
                Empty Shelf. Go find a book!
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
