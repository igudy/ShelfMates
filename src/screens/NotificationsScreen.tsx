import React, { useMemo, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  ArrowLeftIcon,
  BellIcon,
  BookOpenIcon,
  JourneyIcon,
} from "@/components/icons";
import LiquidSurface from "@/components/LiquidSurface";
import {
  NOTIFICATIONS,
  type AppNotification,
  type NotificationType,
} from "@/data/notifications";

type NotificationsScreenProps = {
  onBack: () => void;
};

function NotificationIcon({
  type,
  accent = "#3C06A7",
}: {
  type: NotificationType;
  accent?: string;
}) {
  const icon =
    type === "book_nearby" ? (
      <BookOpenIcon size={20} color={accent} />
    ) : type === "handoff_ready" ? (
      <JourneyIcon size={20} color={accent} />
    ) : (
      <BellIcon size={20} color={accent} />
    );

  return (
    <View
      className="h-12 w-12 items-center justify-center rounded-2xl"
      style={{ backgroundColor: `${accent}18` }}
    >
      {icon}
    </View>
  );
}

function NotificationRow({
  notification,
  onPress,
}: {
  notification: AppNotification;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`mb-3 flex-row items-start rounded-[24px] border p-4 active:opacity-90 ${
        notification.read
          ? "border-[#F3F4F6] bg-white"
          : "border-[#ECEBFB] bg-[#F8F7FC]"
      }`}
    >
      <NotificationIcon
        type={notification.type}
        accent={notification.accent}
      />
      <View className="ml-3 flex-1">
        <View className="flex-row items-start justify-between gap-2">
          <Text className="flex-1 font-satoshi-bold text-base text-[#0F172A]">
            {notification.title}
          </Text>
          {!notification.read ? (
            <View className="mt-1.5 h-2 w-2 rounded-full bg-[#EF4444]" />
          ) : null}
        </View>
        <Text className="mt-1 font-satoshi text-sm leading-5 text-[#64748B]">
          {notification.message}
        </Text>
        <Text className="mt-2 font-satoshi-medium text-xs tracking-[1px] text-[#94A3B8]">
          {notification.time.toUpperCase()}
        </Text>
      </View>
    </Pressable>
  );
}

export default function NotificationsScreen({ onBack }: NotificationsScreenProps) {
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  const unreadCount = useMemo(
    () => notifications.filter((entry) => !entry.read).length,
    [notifications]
  );

  const markAllRead = () => {
    setNotifications((current) =>
      current.map((entry) => ({ ...entry, read: true }))
    );
  };

  const markRead = (id: string) => {
    setNotifications((current) =>
      current.map((entry) =>
        entry.id === id ? { ...entry, read: true } : entry
      )
    );
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />

      <LinearGradient
        colors={["#ECEBFB", "#FFFFFF"]}
        style={{ position: "absolute", top: 0, left: 0, right: 0, height: 280 }}
      />

      <SafeAreaView className="flex-1" edges={["top", "bottom"]}>
        <View className="flex-row items-center justify-between px-5 pt-2">
          <Pressable
            onPress={onBack}
            className="active:opacity-90"
          >
            <LiquidSurface
              rounded="full"
              className="h-11 w-11 items-center justify-center liquid-solid"
            >
              <ArrowLeftIcon />
            </LiquidSurface>
          </Pressable>

          {unreadCount > 0 ? (
            <Pressable onPress={markAllRead} className="active:opacity-80">
              <Text className="font-satoshi-bold text-sm text-[#3C06A7]">
                Mark all read
              </Text>
            </Pressable>
          ) : (
            <View className="w-20" />
          )}
        </View>

        <View className="px-6 pt-6">
          <Text className="font-instrument text-5xl text-[#0F172A]">
            Notifications
          </Text>
          <Text className="mt-2 font-satoshi text-base text-[#64748B]">
            {unreadCount > 0
              ? `${unreadCount} unread update${unreadCount === 1 ? "" : "s"}`
              : "You're all caught up"}
          </Text>
        </View>

        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          contentContainerClassName="px-5 pb-8 pt-8"
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <NotificationRow
              notification={item}
              onPress={() => markRead(item.id)}
            />
          )}
          ListEmptyComponent={
            <View className="items-center rounded-[28px] bg-[#F8F7FC] px-6 py-12">
              <View className="mb-4 h-14 w-14 items-center justify-center rounded-full bg-[#ECEBFB]">
                <BellIcon size={24} color="#3C06A7" />
              </View>
              <Text className="font-satoshi-bold text-lg text-[#0F172A]">
                No notifications yet
              </Text>
              <Text className="mt-2 text-center font-satoshi text-sm text-[#64748B]">
                Borrow requests, handoffs, and nearby books will show up here.
              </Text>
            </View>
          }
        />
      </SafeAreaView>
    </View>
  );
}
