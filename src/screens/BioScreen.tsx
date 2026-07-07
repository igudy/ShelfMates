import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ChatBubbleIcon,
  ChevronRightIcon,
  HelpCircleIcon,
  LightningIcon,
  LogOutIcon,
  PencilIcon,
  SettingsIcon,
  UserOutlineIcon,
} from "@/components/icons";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { resetApp } from "@/store/slices/appSlice";

import ProfileAvatar from "../../assets/images/startYourLibImage2top.svg";

const DEFAULT_NAME = "Oladimeji";
const DEFAULT_HANDLE = "@oladimeji_ux";
const DEFAULT_NODE = "Okitipupa Node";
const DEFAULT_JOINED = "2024";

function formatHandle(displayName: string): string {
  if (!displayName.trim()) {
    return DEFAULT_HANDLE;
  }

  const slug = displayName.trim().toLowerCase().replace(/\s+/g, "_");
  return `@${slug}_ux`;
}

function getFirstName(displayName: string): string {
  const trimmed = displayName.trim();
  if (!trimmed) {
    return DEFAULT_NAME;
  }

  return trimmed.split(/\s+/)[0] ?? trimmed;
}

type ProfileMenuItemProps = {
  label: string;
  icon: React.ReactNode;
  iconBackgroundClassName?: string;
  labelClassName?: string;
  chevronColor?: string;
  onPress?: () => void;
};

function ProfileMenuItem({
  label,
  icon,
  iconBackgroundClassName = "bg-[#F1F5F9]",
  labelClassName = "font-satoshi-medium text-base text-[#1C1917]",
  chevronColor = "#CBD5E1",
  onPress,
}: ProfileMenuItemProps) {
  return (
    <Pressable
      onPress={onPress}
      className="mb-2.5 flex-row items-center rounded-[20px] bg-white px-4 py-4 shadow-sm shadow-black/5 active:opacity-90"
    >
      <View
        className={`mr-4 h-11 w-11 items-center justify-center rounded-2xl ${iconBackgroundClassName}`}
      >
        {icon}
      </View>
      <Text className={`flex-1 ${labelClassName}`}>{label}</Text>
      <ChevronRightIcon color={chevronColor} />
    </Pressable>
  );
}

function StatCard({
  value,
  label,
  valueClassName = "font-satoshi-black text-3xl text-[#1C1917]",
  trailing,
}: {
  value: string;
  label: string;
  valueClassName?: string;
  trailing?: React.ReactNode;
}) {
  return (
    <View className="flex-1 rounded-[20px] bg-white px-3 py-4 shadow-sm shadow-black/5">
      <View className="flex-row items-center">
        <Text className={valueClassName}>{value}</Text>
        {trailing}
      </View>
      <Text className="mt-2 font-satoshi-bold text-[11px] tracking-[1px] text-[#9CA3AF]">
        {label}
      </Text>
    </View>
  );
}

export default function BioScreen() {
  const dispatch = useAppDispatch();
  const displayName = useAppSelector((state) => state.app.displayName);

  const name = getFirstName(displayName);
  const handle = formatHandle(displayName);

  const handleLogOut = () => {
    dispatch(resetApp());
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F5F6F8]" edges={["top"]}>
      <View className="border-b border-[#E5E7EB] bg-white px-5 pb-4 pt-1">
        <Text className="text-center font-satoshi-bold text-lg text-[#1C1917]">
          My Profile
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pb-28 pt-6"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center">
          <View className="relative">
            <View className="overflow-hidden rounded-[22px] border-[3px] border-[#ECEBFB] bg-[#ECEBFB] p-1 shadow-md shadow-[#3C06A7]/10">
              <ProfileAvatar width={96} height={110} />
            </View>
            <Pressable className="absolute -bottom-1 -right-1 h-8 w-8 items-center justify-center rounded-full bg-[#111827] shadow-md shadow-black/20 active:opacity-90">
              <PencilIcon size={13} />
            </Pressable>
          </View>

          <View className="ml-4 flex-1">
            <Text className="font-satoshi-black text-[28px] leading-8 text-[#1C1917]">
              {name}
            </Text>
            <Text className="mt-1 font-satoshi-medium text-base text-[#3C06A7]">
              {handle}
            </Text>
            <Text className="mt-1 font-satoshi text-sm text-[#9CA3AF]">
              {DEFAULT_NODE} • Joined {DEFAULT_JOINED}
            </Text>
          </View>
        </View>

        <View className="mt-6 flex-row gap-3">
          <StatCard value="12" label="SHARED" />
          <StatCard value="34" label="BORROWED" />
          <StatCard
            value="2.4k"
            label="TRUST"
            valueClassName="font-satoshi-black text-3xl text-[#3C06A7]"
            trailing={
              <View className="ml-1">
                <LightningIcon size={16} color="#3C06A7" />
              </View>
            }
          />
        </View>

        <Text className="mb-3 mt-8 font-satoshi-bold text-xs tracking-[1.5px] text-[#9CA3AF]">
          ACCOUNT
        </Text>

        <ProfileMenuItem
          label="Personal Info"
          icon={<UserOutlineIcon />}
        />
        <ProfileMenuItem
          label="My Reviews"
          icon={<ChatBubbleIcon color="#64748B" />}
        />
        <ProfileMenuItem
          label="App Preferences"
          icon={<SettingsIcon />}
        />

        <Text className="mb-3 mt-6 font-satoshi-bold text-xs tracking-[1.5px] text-[#9CA3AF]">
          SUPPORT
        </Text>

        <ProfileMenuItem
          label="Help Center"
          icon={<HelpCircleIcon />}
        />
        <ProfileMenuItem
          label="Log Out"
          icon={<LogOutIcon />}
          iconBackgroundClassName="bg-[#FEE2E2]"
          labelClassName="font-satoshi-bold text-base text-[#EF4444]"
          chevronColor="#FECACA"
          onPress={handleLogOut}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
