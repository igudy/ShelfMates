import React, { type ReactNode } from "react";
import { View } from "react-native";
import { Provider as ReduxProvider } from "react-redux";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { store } from "@/store";
import { shelfMatesTheme } from "@/theme";

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ReduxProvider store={store}>
      <SafeAreaProvider>
        <PaperProvider theme={shelfMatesTheme}>
          <View className="flex-1">
            {children}
          </View>
        </PaperProvider>
      </SafeAreaProvider>
    </ReduxProvider>
  );
}
