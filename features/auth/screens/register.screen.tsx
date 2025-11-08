import { useAuth } from "@/core/auth/auth.context";
import { useTheme } from "@/core/theme/theme-provider";
import { useFormValidation } from "@/hooks/use-form-validation";
import { Link, router } from "expo-router";
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

export default function RegisterScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { register } = useAuth();
  const isDark = theme === "dark";
  const [loading, setLoading] = useState(false);

  const { values, errors, touched, handleChange, handleBlur, validateAll } =
    useFormValidation(
      { name: "", email: "", password: "", confirmPassword: "" },
      {
        name: {
          required: true,
          minLength: 2,
        },
        email: {
          required: true,
          pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        },
        password: {
          required: true,
          minLength: 6,
        },
        confirmPassword: {
          required: true,
          custom: (value) => {
            if (value !== values.password) {
              return t("validation.passwordMismatch");
            }
            return null;
          },
        },
      }
    );

  const handleRegister = async () => {
    if (!validateAll()) {
      return;
    }

    setLoading(true);
    try {
      await register(values.email, values.password, values.name);
      Alert.alert(t("common.success"), t("auth.register.success"), [
        {
          text: "OK",
          onPress: () => router.replace("/(tabs)"),
        },
      ]);
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
        <View className="flex-1 justify-center px-6 py-12">
          {/* Header */}
          <View className="mb-8">
            <Text
              className={`text-4xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
            >
              {t("auth.register.title")}
            </Text>
            <Text
              className={`text-base ${isDark ? "text-gray-400" : "text-gray-600"}`}
            >
              {t("auth.register.subtitle")}
            </Text>
          </View>

          {/* Form */}
          <View className="space-y-4">
            {/* Name Input */}
            <View>
              <Text
                className={`text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}
              >
                {t("auth.fields.name")}
              </Text>
              <TextInput
                className={`px-4 py-3 rounded-xl ${
                  isDark
                    ? "bg-gray-800 text-white border-gray-700"
                    : "bg-white text-gray-900 border-gray-300"
                } border ${
                  touched.name && errors.name ? "border-red-500" : ""
                }`}
                placeholder={t("auth.placeholders.name")}
                placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
                value={values.name}
                onChangeText={(text) => handleChange("name", text)}
                onBlur={() => handleBlur("name")}
                autoCapitalize="words"
                autoComplete="name"
                editable={!loading}
              />
              {touched.name && errors.name && (
                <Text className="text-red-500 text-sm mt-1">
                  {errors.name}
                </Text>
              )}
            </View>

            {/* Email Input */}
            <View>
              <Text
                className={`text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}
              >
                {t("auth.fields.email")}
              </Text>
              <TextInput
                className={`px-4 py-3 rounded-xl ${
                  isDark
                    ? "bg-gray-800 text-white border-gray-700"
                    : "bg-white text-gray-900 border-gray-300"
                } border ${
                  touched.email && errors.email ? "border-red-500" : ""
                }`}
                placeholder={t("auth.placeholders.email")}
                placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
                value={values.email}
                onChangeText={(text) => handleChange("email", text)}
                onBlur={() => handleBlur("email")}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                editable={!loading}
              />
              {touched.email && errors.email && (
                <Text className="text-red-500 text-sm mt-1">
                  {errors.email}
                </Text>
              )}
            </View>

            {/* Password Input */}
            <View>
              <Text
                className={`text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}
              >
                {t("auth.fields.password")}
              </Text>
              <TextInput
                className={`px-4 py-3 rounded-xl ${
                  isDark
                    ? "bg-gray-800 text-white border-gray-700"
                    : "bg-white text-gray-900 border-gray-300"
                } border ${
                  touched.password && errors.password ? "border-red-500" : ""
                }`}
                placeholder={t("auth.placeholders.password")}
                placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
                value={values.password}
                onChangeText={(text) => handleChange("password", text)}
                onBlur={() => handleBlur("password")}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password"
                editable={!loading}
              />
              {touched.password && errors.password && (
                <Text className="text-red-500 text-sm mt-1">
                  {errors.password}
                </Text>
              )}
            </View>

            {/* Confirm Password Input */}
            <View>
              <Text
                className={`text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}
              >
                {t("auth.fields.confirmPassword")}
              </Text>
              <TextInput
                className={`px-4 py-3 rounded-xl ${
                  isDark
                    ? "bg-gray-800 text-white border-gray-700"
                    : "bg-white text-gray-900 border-gray-300"
                } border ${
                  touched.confirmPassword && errors.confirmPassword ? "border-red-500" : ""
                }`}
                placeholder={t("auth.placeholders.confirmPassword")}
                placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
                value={values.confirmPassword}
                onChangeText={(text) => handleChange("confirmPassword", text)}
                onBlur={() => handleBlur("confirmPassword")}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password"
                editable={!loading}
              />
              {touched.confirmPassword && errors.confirmPassword && (
                <Text className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword}
                </Text>
              )}
            </View>

            {/* Register Button */}
            <Pressable
              className={`py-4 rounded-xl mt-4 ${
                loading ? "opacity-50" : ""
              } ${isDark ? "bg-primary-600" : "bg-primary-500"}`}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-center text-base font-semibold">
                  {t("auth.register.button")}
                </Text>
              )}
            </Pressable>
          </View>

          {/* Login Link */}
          <View className="flex-row justify-center mt-6">
            <Text className={isDark ? "text-gray-400" : "text-gray-600"}>
              {t("auth.register.haveAccount")}{" "}
            </Text>
            <Link href="/auth/login" asChild>
              <Pressable disabled={loading}>
                <Text className="text-primary-500 font-semibold">
                  {t("auth.register.loginLink")}
                </Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
