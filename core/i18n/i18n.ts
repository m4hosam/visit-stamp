// core/i18n/i18n.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { I18nManager } from "react-native";

const LANGUAGE_KEY = "@language_preference";

const en = require("@/core/i18n/locales/en.json");
const ar = require("@/core/i18n/locales/ar.json");

const resources = {
  en: {
    translation: en,
  },
  ar: {
    translation: ar,
  },
};

// Load saved language preference
const loadLanguagePreference = async () => {
  try {
    const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
    return savedLanguage || "en";
  } catch (error) {
    console.error("Error loading language preference:", error);
    return "en";
  }
};

// Save language preference and handle RTL
export const saveLanguagePreference = async (language: string) => {
  try {
    await AsyncStorage.setItem(LANGUAGE_KEY, language);

    // Handle RTL for Arabic
    const isRTL = language === "ar";
    if (I18nManager.isRTL !== isRTL) {
      I18nManager.forceRTL(isRTL);
      I18nManager.allowRTL(isRTL);

      // // Reload the app to apply RTL changes
      // if (!__DEV__) {
      //   Updates.reloadAsync();
      // }
    }
  } catch (error) {
    console.error("Error saving language preference:", error);
  }
};

// Initialize i18n
loadLanguagePreference().then((language) => {
  // Set RTL based on saved language
  const isRTL = language === "ar";
  I18nManager.allowRTL(isRTL);
  I18nManager.forceRTL(isRTL);

  i18n.use(initReactI18next).init({
    resources,
    lng: language,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });
});

// Listen for language changes and save them
i18n.on("languageChanged", (lng) => {
  saveLanguagePreference(lng);
});

export { i18n as default };
