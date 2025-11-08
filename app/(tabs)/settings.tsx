import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/core/theme/theme-provider";
import { useAuth } from "@/core/auth/auth.context";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { router } from "expo-router";

export default function SettingsScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { user, logout } = useAuth();
  const isDark = theme === "dark";

  const handleLogout = () => {
    Alert.alert(
      t("profile.actions.logout"),
      "Are you sure you want to logout?",
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("profile.actions.logout"),
          style: "destructive",
          onPress: async () => {
            await logout();
            router.replace("/auth/login");
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      className={`flex-1 ${isDark ? "bg-gray-900" : "bg-white"}`}
      contentContainerClassName="p-4"
    >
      {/* Header */}
      <View className="mb-6">
        <Text className={`text-3xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
          {t("profile.title")}
        </Text>
        <Text className={`text-base ${isDark ? "text-gray-400" : "text-gray-600"}`}>
          {t("profile.subtitle")}
        </Text>
      </View>

      {/* User Info Section */}
      <View className={`p-4 rounded-xl mb-4 ${isDark ? "bg-gray-800" : "bg-gray-100"}`}>
        <Text className={`text-lg font-semibold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
          {t("profile.sections.account")}
        </Text>
        <View className="gap-2">
          <View>
            <Text className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              {t("profile.fields.name")}
            </Text>
            <Text className={`text-base font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
              {user?.displayName || "User"}
            </Text>
          </View>
          <View>
            <Text className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              {t("profile.fields.email")}
            </Text>
            <Text className={`text-base font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
              {user?.email}
            </Text>
          </View>
        </View>
      </View>

      {/* Preferences Section */}
      <View className={`p-4 rounded-xl mb-4 ${isDark ? "bg-gray-800" : "bg-gray-100"}`}>
        <Text className={`text-lg font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
          {t("profile.sections.preferences")}
        </Text>

        {/* Theme Switcher */}
        <View className="mb-4">
          <Text className={`text-sm mb-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            {t("profile.settings.darkMode")}
          </Text>
          <ThemeSwitcher />
        </View>

        {/* Language Switcher */}
        <View>
          <Text className={`text-sm mb-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            {t("profile.settings.language")}
          </Text>
          <LanguageSwitcher />
        </View>
      </View>

      {/* Actions Section */}
      <View className={`p-4 rounded-xl mb-4 ${isDark ? "bg-gray-800" : "bg-gray-100"}`}>
        <Text className={`text-lg font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
          {t("profile.sections.security")}
        </Text>

        <TouchableOpacity
          className="bg-primary-500 py-3 rounded-lg mb-3"
          onPress={() => Alert.alert("Info", "Change password feature coming soon!")}
        >
          <Text className="text-white text-center font-semibold">
            {t("profile.actions.changePassword")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-red-500 py-3 rounded-lg"
          onPress={handleLogout}
        >
          <Text className="text-white text-center font-semibold">
            {t("profile.actions.logout")}
          </Text>
        </TouchableOpacity>
      </View>

      {/* App Info */}
      <View className="items-center mt-4 mb-8">
        <Text className={`text-sm ${isDark ? "text-gray-500" : "text-gray-400"}`}>
          Version 1.0.0
        </Text>
        <Text className={`text-xs mt-1 ${isDark ? "text-gray-600" : "text-gray-500"}`}>
          Built with React Native + Expo
        </Text>
      </View>
    </ScrollView>
  );
}
