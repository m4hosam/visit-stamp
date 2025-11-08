import "@/core/i18n/i18n";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import "../global.css";

import { ErrorBoundary } from "@/components/error-boundary";
import { AuthProvider } from "@/core/auth/auth.context";
import { ThemeProvider, useTheme } from "@/core/theme/theme-provider";
import { View } from "react-native";

export const unstable_settings = {
  initialRouteName: "index",
};

function RootLayoutNav() {
  const { theme } = useTheme();

  return (
    <View className={theme === "dark" ? "dark flex-1" : "flex-1"}>
      <NavigationThemeProvider
        value={theme === "dark" ? DarkTheme : DefaultTheme}
      >
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="auth/login" />
          <Stack.Screen name="auth/register" />
          <Stack.Screen name="auth/forgot-password" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="products/[id]"
            options={{ presentation: "card", headerShown: true }}
          />
          <Stack.Screen
            name="modal"
            options={{
              presentation: "modal",
              title: "Modal",
              headerShown: true,
            }}
          />
        </Stack>
        <StatusBar style={theme === "dark" ? "light" : "dark"} />
      </NavigationThemeProvider>
    </View>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <AuthProvider>
          <RootLayoutNav />
        </AuthProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
}
