import { useAuth } from "@/core/auth/auth.context";
import { useTheme } from "@/core/theme/theme-provider";
import { router } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Pressable, ScrollView, Switch, Text, View } from "react-native";

interface ProfileItem {
  label: string;
  value: string;
  icon: string;
  hasSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: () => void;
  onPress?: () => void;
}

interface ProfileSection {
  title: string;
  items: ProfileItem[];
}

export default function ProfileScreen() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const isDark = theme === "dark";

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  const handleLanguageChange = () => {
    const newLang = currentLanguage === "en" ? "es" : "en";
    i18n.changeLanguage(newLang);
    setCurrentLanguage(newLang);
  };

  const profileSections: ProfileSection[] = [
    {
      title: t("profile.sections.account"),
      items: [
        { label: t("profile.fields.name"), value: "John Doe", icon: "👤" },
        {
          label: t("profile.fields.email"),
          value: "john.doe@example.com",
          icon: "📧",
        },
        {
          label: t("profile.fields.phone"),
          value: "+1 234 567 8900",
          icon: "📱",
        },
      ],
    },
    {
      title: t("profile.sections.preferences"),
      items: [
        {
          label: t("profile.settings.darkMode"),
          value: theme === "dark" ? "On" : "Off",
          icon: "🌙",
          hasSwitch: true,
          switchValue: theme === "dark",
          onSwitchChange: toggleTheme,
        },
        {
          label: t("profile.settings.notifications"),
          value: notificationsEnabled ? "On" : "Off",
          icon: "🔔",
          hasSwitch: true,
          switchValue: notificationsEnabled,
          onSwitchChange: () => setNotificationsEnabled(!notificationsEnabled),
        },
        {
          label: t("profile.settings.language"),
          value: currentLanguage === "en" ? "English" : "Español",
          icon: "🌐",
          onPress: handleLanguageChange,
        },
      ],
    },
  ];

  return (
    <ScrollView
      className={`flex-1 ${isDark ? "bg-background-dark" : "bg-background-light"}`}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View
        className={`pt-12 pb-8 px-6 ${isDark ? "bg-gray-800" : "bg-primary-500"}`}
      >
        <View className="items-center mb-4">
          <View
            className={`w-24 h-24 rounded-full items-center justify-center mb-4 ${
              isDark ? "bg-gray-700" : "bg-white"
            }`}
          >
            <Text className="text-5xl">👤</Text>
          </View>
          <Text className="text-2xl font-bold text-white mb-1">
            {user?.displayName || user?.email || "User"}
          </Text>
          <Text
            className={`text-base ${isDark ? "text-gray-300" : "text-gray-100"}`}
          >
            {t("profile.subtitle")}
          </Text>
        </View>
      </View>

      {/* Profile Sections */}
      <View className="px-6 py-6">
        {profileSections.map((section, sectionIndex) => (
          <View key={sectionIndex} className="mb-6">
            <Text
              className={`text-lg font-semibold mb-3 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {section.title}
            </Text>

            <View
              className={`rounded-xl overflow-hidden ${
                isDark ? "bg-gray-800" : "bg-white"
              }`}
            >
              {section.items.map((item, itemIndex) => (
                <Pressable
                  key={itemIndex}
                  onPress={item.onPress}
                  disabled={!item.onPress && !item.hasSwitch}
                  className={`flex-row items-center p-4 ${
                    itemIndex !== section.items.length - 1
                      ? isDark
                        ? "border-b border-gray-700"
                        : "border-b border-gray-200"
                      : ""
                  }`}
                >
                  <Text className="text-2xl mr-3">{item.icon}</Text>
                  <View className="flex-1">
                    <Text
                      className={`text-base font-medium ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {item.label}
                    </Text>
                    {!item.hasSwitch && (
                      <Text
                        className={`text-sm mt-1 ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {item.value}
                      </Text>
                    )}
                  </View>
                  {item.hasSwitch ? (
                    <Switch
                      value={item.switchValue}
                      onValueChange={item.onSwitchChange}
                      trackColor={{ false: "#767577", true: "#3b82f6" }}
                      thumbColor={item.switchValue ? "#ffffff" : "#f4f3f4"}
                    />
                  ) : item.onPress ? (
                    <Text
                      className={`text-lg ${isDark ? "text-gray-400" : "text-gray-500"}`}
                    >
                      →
                    </Text>
                  ) : null}
                </Pressable>
              ))}
            </View>
          </View>
        ))}
      </View>

      {/* Action Buttons */}
      <View className="px-6 pb-8">
        <Pressable
          className={`py-4 px-6 rounded-xl mb-3 ${
            isDark ? "bg-primary-600" : "bg-primary-500"
          }`}
        >
          <Text className="text-white text-center text-base font-semibold">
            {t("profile.actions.edit")}
          </Text>
        </Pressable>

        <Pressable
          className={`py-4 px-6 rounded-xl mb-3 ${
            isDark ? "bg-gray-700" : "bg-gray-200"
          }`}
        >
          <Text
            className={`text-center text-base font-semibold ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {t("profile.actions.changePassword")}
          </Text>
        </Pressable>

        <Pressable
          className={`py-4 px-6 rounded-xl ${
            isDark ? "bg-error-600" : "bg-error-500"
          }`}
          onPress={() => {
            Alert.alert(
              t("profile.actions.logout"),
              "Are you sure you want to logout?",
              [
                { text: t("common.cancel"), style: "cancel" },
                {
                  text: t("common.confirm"),
                  style: "destructive",
                  onPress: async () => {
                    try {
                      await logout();
                      router.replace("/auth/login");
                    } catch (error: any) {
                      Alert.alert(t("common.error"), error.message);
                    }
                  },
                },
              ]
            );
          }}
        >
          <Text className="text-white text-center text-base font-semibold">
            {t("profile.actions.logout")}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
