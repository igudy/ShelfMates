import {
  MD3LightTheme,
  configureFonts,
  type MD3Theme,
} from "react-native-paper";

const fontConfig = {
  fontFamily: "System",
};

const fonts = configureFonts({ config: fontConfig });

export const shelfMatesTheme: MD3Theme = {
  ...MD3LightTheme,
  fonts,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#5B4B8A",
    onPrimary: "#FFFFFF",
    primaryContainer: "#E8E0F5",
    onPrimaryContainer: "#2E1F52",
    secondary: "#C17C4A",
    onSecondary: "#FFFFFF",
    secondaryContainer: "#F5E0D0",
    onSecondaryContainer: "#4A2F18",
    tertiary: "#2D6A4F",
    onTertiary: "#FFFFFF",
    background: "#FAF7F2",
    onBackground: "#1C1917",
    surface: "#FFFFFF",
    onSurface: "#1C1917",
    surfaceVariant: "#F0EBE3",
    onSurfaceVariant: "#57534E",
    outline: "#D6D3D1",
    elevation: {
      level0: "transparent",
      level1: "#FFFFFF",
      level2: "#FAF7F2",
      level3: "#F0EBE3",
      level4: "#E7E0D5",
      level5: "#D6D3D1",
    },
  },
  roundness: 12,
};
