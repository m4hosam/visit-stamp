import { useTheme } from "@/core/theme/theme-provider";
import React from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, Text, View } from "react-native";

export default function HomeScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const features = [
    {
      icon: "⚡",
      title: t("home.features.feature1.title"),
      description: t("home.features.feature1.description"),
    },
    {
      icon: "🎨",
      title: t("home.features.feature2.title"),
      description: t("home.features.feature2.description"),
    },
    {
      icon: "🔒",
      title: t("home.features.feature3.title"),
      description: t("home.features.feature3.description"),
    },
  ];

  const stats = [
    { value: "10K+", label: t("home.stats.users") },
    { value: "50K+", label: t("home.stats.downloads") },
    { value: "4.9", label: t("home.stats.rating") },
  ];

  return (
    <ScrollView
      className={`flex-1 ${isDark ? "bg-background-dark" : "bg-background-light"}`}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero Section */}
      <View
        className={`h-64 justify-center items-center px-6 ${
          isDark ? "bg-primary-700" : "bg-primary-500"
        }`}
      >
        <Text className="text-4xl font-bold text-center mb-3 text-white">
          {t("home.title")}
        </Text>
        <Text className="text-lg text-center text-gray-100">
          {t("home.subtitle")}
        </Text>
      </View>

      {/* Stats Section */}
      <View className="flex-row justify-around px-6 py-8 -mt-8">
        {stats.map((stat, index) => (
          <View
            key={index}
            className={`flex-1 mx-2 p-4 rounded-2xl shadow-lg ${
              isDark ? "bg-gray-800" : "bg-white"
            }`}
          >
            <Text
              className={`text-2xl font-bold text-center ${
                isDark ? "text-primary-400" : "text-primary-600"
              }`}
            >
              {stat.value}
            </Text>
            <Text
              className={`text-sm text-center mt-1 ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {stat.label}
            </Text>
          </View>
        ))}
      </View>

      {/* Greeting Section */}
      <View className="px-6 py-4">
        <Text
          className={`text-2xl font-semibold ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          {t("home.greeting", { name: "User" })}
        </Text>
      </View>

      {/* Features Section */}
      <View className="px-6 py-4">
        <Text
          className={`text-xl font-bold mb-4 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          {t("home.features.title")}
        </Text>

        {features.map((feature, index) => (
          <View
            key={index}
            className={`mb-4 p-5 rounded-xl shadow-md ${
              isDark ? "bg-gray-800" : "bg-white"
            }`}
          >
            <View className="flex-row items-center mb-3">
              <Text className="text-3xl mr-3">{feature.icon}</Text>
              <Text
                className={`text-lg font-semibold flex-1 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {feature.title}
              </Text>
            </View>
            <Text
              className={`text-base ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {feature.description}
            </Text>
          </View>
        ))}
      </View>

      {/* CTA Button */}
      <View className="px-6 py-8">
        <Pressable
          className={`py-4 px-6 rounded-xl shadow-lg active:opacity-80 ${
            isDark ? "bg-primary-600" : "bg-primary-500"
          }`}
        >
          <Text className="text-white text-center text-lg font-semibold">
            {t("home.cta")}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
