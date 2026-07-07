import React, { useRef, useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { BackspaceIcon } from "@/components/icons";
import { AuthHero, GradientButton } from "@/components/auth";

const OTP_LENGTH = 6;

type ResetPasswordOtpScreenProps = {
  email: string;
  onReset: () => void;
};

type OtpKeyProps = {
  label: string;
  onPress: () => void;
  wide?: boolean;
};

function OtpKey({ label, onPress, wide }: OtpKeyProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`items-center justify-center rounded-2xl bg-white py-4 active:opacity-80 ${
        wide ? "flex-[2]" : "flex-1"
      }`}
    >
      <Text className="font-satoshi-medium text-2xl text-[#1C1917]">{label}</Text>
    </Pressable>
  );
}

export default function ResetPasswordOtpScreen({
  email,
  onReset,
}: ResetPasswordOtpScreenProps) {
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const inputRefs = useRef<Array<TextInput | null>>([]);

  const updateDigit = (index: number, value: string) => {
    const next = value.replace(/\D/g, "").slice(-1);
    setDigits((prev) => {
      const copy = [...prev];
      copy[index] = next;
      return copy;
    });
    if (next && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (label: string) => {
    if (label === "backspace") {
      setDigits((prev) => {
        const copy = [...prev];
        let target = copy.length - 1;
        while (target > 0 && copy[target] === "") {
          target -= 1;
        }
        if (copy[target] !== "") {
          copy[target] = "";
        }
        inputRefs.current[target]?.focus();
        return copy;
      });
      return;
    }

    const emptyIndex = digits.findIndex((digit) => digit === "");
    if (emptyIndex === -1) {
      return;
    }

    updateDigit(emptyIndex, label);
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />
      <ScrollView
        className="flex-1"
        contentContainerClassName="flex-grow"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <AuthHero
          variant="light"
          title="Reset Password"
          subtitle={`Code sent to ${email || "your email"}`}
        />

        <View className="flex-1 px-6">
          <Text className="mb-4 font-satoshi-medium text-xs tracking-[2px] text-[#9CA3AF]">
            ENTER 6 DIGIT OTP SENT TO YOUR MAIL
          </Text>

          <View className="mb-8 flex-row justify-between gap-2">
            {digits.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  inputRefs.current[index] = ref;
                }}
                value={digit}
                onChangeText={(value) => updateDigit(index, value)}
                onKeyPress={({ nativeEvent }) => {
                  if (nativeEvent.key === "Backspace" && !digit && index > 0) {
                    inputRefs.current[index - 1]?.focus();
                  }
                }}
                keyboardType="number-pad"
                maxLength={1}
                className="h-14 flex-1 rounded-2xl bg-[#F3F4F6] text-center font-satoshi-medium text-xl text-[#1C1917]"
              />
            ))}
          </View>

          <GradientButton
            label="Reset Password"
            onPress={onReset}
            colors={["#3C06A7", "#3C06A7"]}
          />
        </View>
      </ScrollView>

      {/* Numeric keypad */}
      <View className="rounded-t-[28px] bg-[#ECECF1] px-4 pb-8 pt-4">
        <View className="gap-2">
          {[
            ["1", "2", "3"],
            ["4", "5", "6"],
            ["7", "8", "9"],
            ["", "0", "backspace"],
          ].map((row, rowIndex) => (
            <View key={rowIndex} className="flex-row gap-2">
              {row.map((key) =>
                key === "" ? (
                  <View key="spacer" className="flex-1" />
                ) : key === "backspace" ? (
                  <Pressable
                    key={key}
                    onPress={() => handleKeyPress("backspace")}
                    className="flex-1 items-center justify-center rounded-2xl bg-white py-4 active:opacity-80"
                  >
                    <BackspaceIcon size={22} />
                  </Pressable>
                ) : (
                  <OtpKey
                    key={key}
                    label={key}
                    onPress={() => handleKeyPress(key)}
                  />
                )
              )}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
