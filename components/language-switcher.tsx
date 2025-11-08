import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/core/theme/theme-provider";

interface Language {
  code: string;
  name: string;
  nativeName: string;
}

const LANGUAGES: Language[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "ar", name: "Arabic", nativeName: "العربية" },
];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const handleLanguageChange = async (languageCode: string) => {
    await i18n.changeLanguage(languageCode);
  };

  return (
    <View className="flex-row items-center gap-2">
      {LANGUAGES.map((language) => {
        const isActive = i18n.language === language.code;
        return (
          <TouchableOpacity
            key={language.code}
            onPress={() => handleLanguageChange(language.code)}
            className={`px-4 py-2 rounded-lg ${
              isActive
                ? "bg-primary-500"
                : isDark
                  ? "bg-gray-700"
                  : "bg-gray-200"
            }`}
          >
            <Text
              className={`font-semibold ${
                isActive
                  ? "text-white"
                  : isDark
                    ? "text-gray-300"
                    : "text-gray-700"
              }`}
            >
              {language.nativeName}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
