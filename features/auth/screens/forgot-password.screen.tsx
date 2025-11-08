import { useAuth } from "@/core/auth/auth.context";
import { useTheme } from "@/core/theme/theme-provider";
import { router, Stack } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

export default function ForgotPasswordScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { resetPassword } = useAuth();
  const isDark = theme === "dark";

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert(t("common.error"), t("auth.validation.fillAllFields"));
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email);
      Alert.alert(
        t("common.success"),
        t("auth.forgotPassword.successMessage"),
        [{ text: "OK", onPress: () => router.back() }]
      );
    } catch (error: any) {
      Alert.alert(t("common.error"), error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <ScrollView
        className={`flex-1 ${isDark ? "bg-background-dark" : "bg-background-light"}`}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <Stack.Screen
          options={{ headerShown: true, title: t("auth.forgotPassword.title") }}
        />
        <View className="flex-1 justify-center px-6 py-12">
          <View className="mb-8">
            <Text
              className={`text-3xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
            >
              {t("auth.forgotPassword.header")}
            </Text>
            <Text
              className={`text-base ${isDark ? "text-gray-400" : "text-gray-600"}`}
            >
              {t("auth.forgotPassword.subtitle")}
            </Text>
          </View>

          <View className="space-y-4">
            <View>
              <Text
                className={`text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}
              >
                {t("auth.fields.email")}
              </Text>
              <TextInput
                className={`px-4 py-3 rounded-xl border ${isDark ? "bg-gray-800 text-white border-gray-700" : "bg-white text-gray-900 border-gray-300"}`}
                placeholder={t("auth.placeholders.email")}
                placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                editable={!loading}
              />
            </View>

            <Pressable
              className={`py-4 rounded-xl mt-4 ${loading ? "opacity-50" : ""} ${isDark ? "bg-primary-600" : "bg-primary-500"}`}
              onPress={handleResetPassword}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-center text-base font-semibold">
                  {t("auth.forgotPassword.button")}
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
