import "./global.css";
import React, { useEffect } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { AppProviders } from "@/providers/AppProviders";
import HomeScreen from "@/screens/HomeScreen";

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
      <HomeScreen />
    </AppProviders>
  );
}
