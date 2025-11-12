/**
 * Custom hook for theme-aware colors and language-aware fonts
 */

import { Colors } from "@/constants/theme";
import { useTheme } from "@/core/theme/theme-provider";
import { useTranslation } from "react-i18next";

export type FontWeight = "300" | "400" | "500" | "600" | "700" | "800";

const fontFamilyMap = {
  en: {
    "300": "Poppins_300Light",
    "400": "Poppins_400Regular",
    "500": "Poppins_500Medium",
    "600": "Poppins_600SemiBold",
    "700": "Poppins_700Bold",
    "800": "Poppins_800ExtraBold",
  },
  ar: {
    "300": "Cairo_300Light",
    "400": "Cairo_400Regular",
    "500": "Cairo_500Medium",
    "600": "Cairo_600SemiBold",
    "700": "Cairo_700Bold",
    "800": "Cairo_800ExtraBold",
  },
};

export function useThemeStyle() {
  const { theme } = useTheme();
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language as "en" | "ar";

  /**
   * Get color based on current theme
   */
  const getColor = (colorName: keyof typeof Colors.light) => {
    return Colors[theme][colorName];
  };

  /**
   * Get font family based on current language and weight
   */
  const getFont = (weight: FontWeight = "400") => {
    return fontFamilyMap[currentLanguage][weight];
  };

  /**
   * Check if current language is RTL
   */
  const isRTL = currentLanguage === "ar";

  return {
    colors: Colors[theme],
    getColor,
    getFont,
    isRTL,
    theme,
    language: currentLanguage,
  };
}
