import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { EyeIcon } from "@/components/icons";
import {
  AuthHero,
  Field,
  GradientButton,
  OrDivider,
  SocialRow,
} from "@/components/auth";

type SignInScreenProps = {
  onSignIn: () => void;
  onCreateAccount: () => void;
  onForgotPassword: () => void;
};

export default function SignInScreen({
  onSignIn,
  onCreateAccount,
  onForgotPassword,
}: SignInScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className="flex-1 bg-hero">
      <StatusBar style="light" />
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
          <AuthHero title="Welcome back" />

          {/* Form sheet */}
          <View className="flex-1 rounded-t-[32px] bg-white px-6 pb-10 pt-8">
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

            <Field label="PASSWORD">
              <View className="flex-row items-center rounded-2xl bg-[#F3F4F6] pr-4">
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="************"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  className="flex-1 px-4 py-4 font-satoshi text-base text-[#1C1917]"
                />
                <Pressable
                  hitSlop={10}
                  onPress={() => setShowPassword((prev) => !prev)}
                >
                  <EyeIcon size={22} color={showPassword ? "#4B3FE4" : "#6B7280"} />
                </Pressable>
              </View>
            </Field>

            <View className="mt-2">
              <GradientButton label="Sign in" onPress={onSignIn} />
            </View>

            <Pressable
              hitSlop={8}
              onPress={onForgotPassword}
              className="mt-4 items-center active:opacity-70"
            >
              <Text className="font-satoshi-bold text-base text-[#4B3FE4]">
                Forgot password?
              </Text>
            </Pressable>

            <OrDivider />

            <SocialRow />

            <View className="mt-7 flex-row items-center justify-center">
              <Text className="font-satoshi text-base text-[#4B5563]">
                New here?{" "}
              </Text>
              <Pressable
                hitSlop={8}
                onPress={onCreateAccount}
                className="active:opacity-70"
              >
                <Text className="font-satoshi-bold text-base text-[#4B3FE4]">
                  Create account
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
