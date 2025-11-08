// core/i18n/i18n.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

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

// Save language preference
export const saveLanguagePreference = async (language: string) => {
  try {
    await AsyncStorage.setItem(LANGUAGE_KEY, language);
  } catch (error) {
    console.error("Error saving language preference:", error);
  }
};

// Initialize i18n
loadLanguagePreference().then((language) => {
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
