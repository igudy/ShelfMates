import React from "react";
import {
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { ArrowLeftIcon } from "@/components/icons";
import type { NeighborProfile, ShelfBook } from "@/data/neighbors";

import Avatar2 from "../../assets/images/startYourLibImage2top.svg";

type NeighborProfileScreenProps = {
  neighbor: NeighborProfile;
  onBack: () => void;
  onBookPress: (book: ShelfBook) => void;
};

function MessageIcon() {
  return (
    <View className="mr-2 h-5 w-5 items-center justify-center">
      <View className="h-3.5 w-4 rounded-sm border-2 border-white" />
      <View className="absolute -bottom-0.5 left-1 h-0 w-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white" />
    </View>
  );
}

export default function NeighborProfileScreen({
  neighbor,
  onBack,
  onBookPress,
}: NeighborProfileScreenProps) {
  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />

      <LinearGradient
        colors={["#ECEBFB", "#FFFFFF"]}
        style={{ position: "absolute", top: 0, left: 0, right: 0, height: 320 }}
      />

      <SafeAreaView className="flex-1" edges={["top", "bottom"]}>
        <View className="px-5 pt-2">
          <Pressable
            onPress={onBack}
            className="h-11 w-11 items-center justify-center rounded-full bg-white shadow-md shadow-black/10 active:opacity-90"
          >
            <ArrowLeftIcon />
          </Pressable>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerClassName="px-6 pb-8 pt-4"
          showsVerticalScrollIndicator={false}
        >
          <View className="items-center">
            <View className="rounded-[28px] bg-[#ECEBFB] p-1.5 shadow-lg shadow-[#3C06A7]/20">
              <Avatar2 width={148} height={168} />
            </View>

            <Text className="mt-6 font-satoshi-black text-4xl text-[#0F172A]">
              {neighbor.name}
            </Text>
            <Text className="mt-2 font-satoshi text-base text-[#64748B]">
              {neighbor.tagline} • {neighbor.score.toLocaleString()} Score
            </Text>
          </View>

          <Pressable className="mt-8 active:opacity-90">
            <LinearGradient
              colors={["#3C06A7", "#3C06A7"]}
              style={{ borderRadius: 999 }}
            >
              <View className="flex-row items-center justify-center py-4">
                <MessageIcon />
                <Text className="font-satoshi-bold text-lg text-white">
                  Message
                </Text>
              </View>
            </LinearGradient>
          </Pressable>

          <Text className="mt-10 font-satoshi-bold text-2xl text-[#0F172A]">
            Available on Shelf
          </Text>

          {neighbor.books.map((book) => (
            <Pressable
              key={book.id}
              onPress={() => onBookPress(book)}
              className="mt-4 flex-row items-center rounded-[24px] border border-[#ECEBFB] bg-white p-4 shadow-sm shadow-black/5 active:opacity-90"
            >
              <View
                className="mr-4 h-20 w-14 rounded-xl"
                style={{ backgroundColor: book.coverColor }}
              />
              <View className="flex-1">
                <Text className="font-satoshi-bold text-lg text-[#0F172A]">
                  {book.title}
                </Text>
                <Text className="mt-1 font-satoshi text-sm text-[#64748B]">
                  {book.distance}
                </Text>
              </View>
              <View className="rounded-full bg-[#ECEBFB] px-3 py-2">
                <Text className="font-satoshi-bold text-sm text-[#3C06A7]">
                  {book.match}%
                </Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
