/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

export const Colors = {
  light: {
    primary: "#24647A",
    secondary: "#5EC2A5",
    background: "#fff",
    textPrimary: "#7E7E7E",
    textSecondary: "#C6C6C6",
    placeholder: "#C6C6C6",
    inputBorder: "#DCDCDC",
    border: "#D9D9D9",
    danger: "#FF5F6B",
    dangerSecondary: "#FF4B55",
    error: "#ef4444",
    success: "#22c55e",
    white: "#FFFFFF",
    tint: tintColorLight,
  },
  dark: {
    primary: "#5EC2A5",
    secondary: "#24647A",
    background: "#07222B",
    textPrimary: "#FFFFFF",
    textSecondary: "#C6C6C6",
    placeholder: "#C6C6C6",
    inputBorder: "#DCDCDC",
    border: "#D9D9D9",
    danger: "#FF5F6B",
    dangerSecondary: "#FF4B55",
    error: "#ef4444",
    success: "#22c55e",
    white: "#FFFFFF",
    tint: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
