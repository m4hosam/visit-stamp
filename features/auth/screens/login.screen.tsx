// app/auth/login.tsx
import { ThemeSwitcher } from "@/components/theme-switcher";
import { useTheme } from "@/core/theme/theme-provider";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  I18nManager,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isRTL = I18nManager.isRTL;

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      // Implement Google OAuth login
      console.log("Google login initiated");
      // After successful login:
      // router.replace('/(tabs)');
    } catch (error) {
      console.error("Google login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      // Implement email/password login
      console.log("Login with:", email);
      // After successful login:
      // router.replace('/(tabs)');
    } catch (error) {
      console.error("Login error:", error);
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
        contentContainerStyle={{ flexGrow: 1 }}
        className="bg-background dark:bg-background-dark"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 px-6 pt-20 pb-8">
          {/* Header */}
          <View className="items-center mb-12">
            <Text className="text-primary dark:text-primary-dark text-3xl font-bold mb-8">
              {t("login.title")}
            </Text>

            {/* Logo Section */}
            <View className="items-center mb-6">
              {/* Logo Icon */}
              <View className="mb-3">
                <View className="flex-row items-center">
                  {/* Top wing */}
                  <View
                    className="w-12 h-8 bg-secondary dark:bg-primary-dark rounded-t-full"
                    style={{
                      marginRight: -8,
                      transform: [{ rotate: "-20deg" }],
                    }}
                  />
                  <View
                    className="w-12 h-8 bg-secondary dark:bg-primary-dark rounded-t-full"
                    style={{ marginLeft: -8, transform: [{ rotate: "20deg" }] }}
                  />
                </View>
                {/* Bottom triangle */}
                <View className="items-center" style={{ marginTop: -4 }}>
                  <View
                    className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[16px]"
                    style={{
                      borderLeftColor: "transparent",
                      borderRightColor: "transparent",
                      borderTopColor: theme === "dark" ? "#5EC2A5" : "#24647A",
                    }}
                  />
                </View>
              </View>
              <ThemeSwitcher />
              <Text className="text-primary dark:text-text-primary-dark text-xl font-bold">
                {t("login.appName") || "Visit Stamp"}
              </Text>
            </View>

            <Text className="text-text-primary dark:text-text-secondary-dark text-sm text-center px-4">
              {t("login.subtitle") || "login to start using TourStamp now!"}
            </Text>
          </View>

          {/* Google Login Button */}
          <TouchableOpacity
            onPress={handleGoogleLogin}
            disabled={loading}
            className="flex-row items-center justify-center bg-white dark:bg-gray-800 border border-input-border dark:border-border-dark rounded-full py-4 px-6 mb-6 shadow-sm"
            activeOpacity={0.7}
          >
            <Ionicons
              name="logo-google"
              size={20}
              color={theme === "dark" ? "#5EC2A5" : "#5EC2A5"}
              style={{ marginRight: 8 }}
            />
            <Text className="text-secondary dark:text-primary-dark font-semibold text-base">
              {t("login.googleLogin") || "Log in with Google"}
            </Text>
          </TouchableOpacity>

          {/* Divider */}
          <View className="flex-row items-center mb-6">
            <View className="flex-1 h-px bg-border dark:bg-border-dark" />
            <Text className="mx-4 text-text-secondary dark:text-text-secondary-dark text-sm">
              {t("login.orLoginWith") || "or login with email"}
            </Text>
            <View className="flex-1 h-px bg-border dark:bg-border-dark" />
          </View>

          {/* Email Input */}
          <View className="mb-4">
            <TextInput
              placeholder={t("login.emailPlaceholder") || "Email"}
              placeholderTextColor="#C6C6C6"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              editable={!loading}
              className="bg-white dark:bg-gray-800 border border-input-border dark:border-border-dark rounded-full px-6 py-4 text-text-primary dark:text-text-primary-dark text-base"
              style={{
                textAlign: isRTL ? "right" : "left",
                writingDirection: isRTL ? "rtl" : "ltr",
              }}
            />
          </View>

          {/* Password Input */}
          <View className="mb-6 relative">
            <TextInput
              placeholder={t("login.passwordPlaceholder") || "Password"}
              placeholderTextColor="#C6C6C6"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoComplete="password"
              editable={!loading}
              className="bg-white dark:bg-gray-800 border border-input-border dark:border-border-dark rounded-full px-6 py-4 text-text-primary dark:text-text-primary-dark text-base"
              style={{
                textAlign: isRTL ? "right" : "left",
                writingDirection: isRTL ? "rtl" : "ltr",
                paddingRight: isRTL ? 24 : 48,
                paddingLeft: isRTL ? 48 : 24,
              }}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              className="absolute top-4 right-6"
              style={{
                right: isRTL ? undefined : 24,
                left: isRTL ? 24 : undefined,
              }}
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={24}
                color="#C6C6C6"
              />
            </TouchableOpacity>
          </View>

          {/* Forgot Password Link */}
          <Link href="/auth/forgot-password" asChild>
            <TouchableOpacity className="mb-6">
              <Text className="text-secondary dark:text-primary-dark text-sm text-center">
                {t("login.forgotPassword") || "Forgot Password?"}
              </Text>
            </TouchableOpacity>
          </Link>

          {/* Login Button */}
          <TouchableOpacity
            onPress={handleLogin}
            disabled={loading || !email || !password}
            className={`rounded-full py-4 mb-6 shadow-sm ${
              loading || !email || !password
                ? "bg-text-secondary dark:bg-gray-700 opacity-50"
                : "bg-secondary dark:bg-primary-dark"
            }`}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text className="text-white text-center font-semibold text-base">
                {t("login.loginButton") || "Login"}
              </Text>
            )}
          </TouchableOpacity>

          {/* Sign Up Link */}
          <View className="flex-row items-center justify-center">
            <Text className="text-text-primary dark:text-text-secondary-dark text-sm">
              {t("login.noAccount") || "Don't have an account?"}{" "}
            </Text>
            <Link href="/auth/register" asChild>
              <TouchableOpacity>
                <Text className="text-secondary dark:text-primary-dark font-semibold text-sm">
                  {t("login.signUp") || "SignUp"}
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
