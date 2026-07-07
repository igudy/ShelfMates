import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { AuthHero, Field, GradientButton } from "@/components/auth";

type ResetPasswordEmailScreenProps = {
  onProceed: (email: string) => void;
};

export default function ResetPasswordEmailScreen({
  onProceed,
}: ResetPasswordEmailScreenProps) {
  const [email, setEmail] = useState("");

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="flex-grow"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <AuthHero
            variant="light"
            title="Reset Password"
            subtitle="Input your registered email"
          />

          <View className="flex-1 px-6 pb-10">
            <Field label="EMAIL">
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="name@email.com"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                className="rounded-2xl bg-[#F3F4F6] px-4 py-4 font-satoshi text-base text-[#1C1917]"
              />
            </Field>

            <View className="mt-2">
              <GradientButton
                label="Proceed"
                onPress={() => onProceed(email)}
                colors={["#3C06A7", "#3C06A7"]}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
