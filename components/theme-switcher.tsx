import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { useTheme } from "@/core/theme/theme-provider";
import { useTranslation } from "react-i18next";

export function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const isDark = theme === "dark";

  return (
    <TouchableOpacity
      onPress={toggleTheme}
      className={`px-4 py-2 rounded-lg ${isDark ? "bg-gray-700" : "bg-gray-200"}`}
    >
      <Text className={`font-semibold ${isDark ? "text-gray-300" : "text-gray-700"}`}>
        {isDark ? "🌙 " : "☀️ "} {isDark ? t("profile.settings.darkMode") : "Light Mode"}
      </Text>
    </TouchableOpacity>
  );
}
