import "./global.css";
import React, { useEffect, useState } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { completeOnboarding } from "@/store/slices/appSlice";
import { AppProviders } from "@/providers/AppProviders";
import HomeScreen from "@/screens/HomeScreen";
import GetStartedScreen from "@/screens/GetStartedScreen";
import SignInScreen from "@/screens/SignInScreen";
import InterestsScreen from "@/screens/InterestsScreen";
import ResetPasswordEmailScreen from "@/screens/ResetPasswordEmailScreen";
import ResetPasswordOtpScreen from "@/screens/ResetPasswordOtpScreen";
import MainAppScreen from "@/screens/MainAppScreen";

type OnboardingScreen =
  | "welcome"
  | "getStarted"
  | "signIn"
  | "interests"
  | "resetEmail"
  | "resetOtp";

function Root() {
  const dispatch = useAppDispatch();
  const hasOnboarded = useAppSelector((state) => state.app.hasOnboarded);
  const [screen, setScreen] = useState<OnboardingScreen>("welcome");
  const [resetEmail, setResetEmail] = useState("");

  if (hasOnboarded) {
    return <MainAppScreen />;
  }

  switch (screen) {
    case "getStarted":
      return (
        <GetStartedScreen
          onSignIn={() => setScreen("signIn")}
          onCreateAccount={() => setScreen("interests")}
          onForgotPassword={() => setScreen("resetEmail")}
        />
      );
    case "signIn":
      return (
        <SignInScreen
          onSignIn={() => dispatch(completeOnboarding())}
          onCreateAccount={() => setScreen("getStarted")}
          onForgotPassword={() => setScreen("resetEmail")}
        />
      );
    case "interests":
      return (
        <InterestsScreen onContinue={() => dispatch(completeOnboarding())} />
      );
    case "resetEmail":
      return (
        <ResetPasswordEmailScreen
          onProceed={(email) => {
            setResetEmail(email);
            setScreen("resetOtp");
          }}
        />
      );
    case "resetOtp":
      return (
        <ResetPasswordOtpScreen
          email={resetEmail}
          onReset={() => setScreen("signIn")}
        />
      );
    default:
      return <HomeScreen onGetStarted={() => setScreen("getStarted")} />;
  }
}

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [loaded, error] = useFonts({
    "InstrumentSerif-Regular": require("./assets/fonts/instrumentserif-regular.ttf"),
    "InstrumentSerif-Italic": require("./assets/fonts/instrumentserif-italic.ttf"),
    "Satoshi-Regular": require("./assets/fonts/Satoshi-Regular.otf"),
    "Satoshi-Medium": require("./assets/fonts/Satoshi-Medium.otf"),
    "Satoshi-Bold": require("./assets/fonts/Satoshi-Bold.otf"),
    "Satoshi-Black": require("./assets/fonts/Satoshi-Black.otf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <AppProviders>
      <Root />
    </AppProviders>
  );
}
