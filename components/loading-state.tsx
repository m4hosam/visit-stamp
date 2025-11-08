import React from "react";
import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import { useTheme } from "@/core/theme/theme-provider";
import { useTranslation } from "react-i18next";

interface LoadingStateProps {
  loading: boolean;
  error?: string | null;
  empty?: boolean;
  emptyMessage?: string;
  onRetry?: () => void;
  children: React.ReactNode;
}

export function LoadingState({
  loading,
  error,
  empty,
  emptyMessage,
  onRetry,
  children,
}: LoadingStateProps) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const isDark = theme === "dark";

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className={`mt-4 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
          {t("common.loading")}
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-red-500 text-lg font-semibold mb-2">
          {t("common.error")}
        </Text>
        <Text
          className={`text-center mb-4 ${isDark ? "text-gray-400" : "text-gray-600"}`}
        >
          {error}
        </Text>
        {onRetry && (
          <TouchableOpacity
            onPress={onRetry}
            className="bg-primary-500 px-6 py-3 rounded-lg"
          >
            <Text className="text-white font-semibold">{t("common.retry")}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  if (empty) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Text
          className={`text-xl font-semibold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
        >
          {emptyMessage || t("common.noData")}
        </Text>
      </View>
    );
  }

  return <>{children}</>;
}
