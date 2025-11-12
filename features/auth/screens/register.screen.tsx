// (auth)/register.tsx
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/Button";
import {
  Country,
  CountryPicker,
  countries,
} from "@/components/ui/CountryPicker";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/core/auth/auth.context";
import { Alert } from "@/core/shared/alert";
import { useThemeStyle } from "@/hooks/use-theme-style";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { AuthError } from "../types";

export default function RegisterScreen() {
  const { register } = useAuth();
  const { colors, getFont, getColor } = useThemeStyle();
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    displayName: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.displayName.trim()) {
      newErrors.displayName = "Full Name is required";
    } else if (formData.displayName.length < 2) {
      newErrors.displayName = "Name must be at least 2 characters";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (
      !/^\+?[1-9]\d{1,14}$/.test(formData.phoneNumber.replace(/\s/g, ""))
    ) {
      newErrors.phoneNumber = "Please enter a valid phone number";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await register(
        formData.email,
        formData.password,
        formData.displayName,
        selectedCountry.dialCode + formData.phoneNumber
      );

      router.replace({
        pathname: "/verify" as any,
        params: { email: formData.email },
      });
    } catch (error) {
      if (error instanceof AuthError) {
        Alert.alert("Error", error.message);
      } else {
        Alert.alert("Error", "An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContainer: {
      flexGrow: 1,
    },
    content: {
      flex: 1,
      padding: 24,
      justifyContent: "center",
    },
    title: {
      fontSize: 35,
      color: colors.textPrimary,
      textAlign: "center",
      marginBottom: 32,
      marginTop: 15,
      fontFamily: getFont("700"),
    },
    logoContainer: {
      alignItems: "center",
      marginBottom: 32,
    },
    logo: {
      width: 250,
      height: 62,
    },
    subtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: "center",
      marginBottom: 32,
      fontFamily: getFont("500"),
    },
    form: {
      marginBottom: 24,
    },
    input: {
      borderRadius: 25,
      borderColor: colors.border,
      backgroundColor: colors.background,
      color: colors.textPrimary,
      fontFamily: getFont("300"),
    },
    phoneContainer: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: 16,
    },
    countryCode: {
      marginRight: 12,
    },
    phoneInputContainer: {
      flex: 1,
      marginBottom: 0,
    },
    phoneInput: {
      flex: 1,
    },
    termsContainer: {
      marginVertical: 16,
    },
    termsText: {
      fontSize: 12,
      color: colors.textPrimary,
      textAlign: "center",
      lineHeight: 18,
      fontFamily: getFont("400"),
    },
    signUpButton: {
      backgroundColor: colors.primary,
      borderRadius: 25,
      paddingVertical: 14,
      width: "70%",
      marginLeft: "auto",
      marginRight: "auto",
      marginTop: 16,
    },
    footer: {
      alignItems: "center",
      marginTop: 24,
      marginBottom: 32,
    },
    footerText: {
      fontSize: 16,
      color: colors.textPrimary,
      fontFamily: getFont("500"),
    },
    link: {
      color: colors.primary,
      fontFamily: getFont("700"),
    },
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <ThemeSwitcher />
          <Text style={styles.title}>Sign Up</Text>

          <View style={styles.logoContainer}>
            <Image
              source={require("../../../assets/images/logo-header.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.subtitle}>Sign up for TourStamp now!</Text>

          <View style={styles.form}>
            <Input
              value={formData.email}
              onChangeText={(value) => updateFormData("email", value)}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              error={errors.email}
              style={styles.input}
              placeholderTextColor={colors.textPrimary}
            />

            <Input
              value={formData.displayName}
              onChangeText={(value) => updateFormData("displayName", value)}
              placeholder="Full Name"
              autoComplete="name"
              error={errors.displayName}
              style={styles.input}
              placeholderTextColor={colors.textPrimary}
            />

            <View style={styles.phoneContainer}>
              <CountryPicker
                selectedCountry={selectedCountry}
                onCountrySelect={setSelectedCountry}
                style={styles.countryCode}
              />
              <Input
                value={formData.phoneNumber}
                onChangeText={(value) => updateFormData("phoneNumber", value)}
                placeholder="Phone Number"
                keyboardType="phone-pad"
                error={errors.phoneNumber}
                style={[styles.input, styles.phoneInput]}
                containerStyle={styles.phoneInputContainer}
                placeholderTextColor={colors.textPrimary}
              />
            </View>

            <Input
              value={formData.password}
              onChangeText={(value) => updateFormData("password", value)}
              placeholder="Password"
              secureTextEntry
              autoComplete="password-new"
              error={errors.password}
              style={styles.input}
              placeholderTextColor={colors.textPrimary}
            />

            <Input
              value={formData.confirmPassword}
              onChangeText={(value) => updateFormData("confirmPassword", value)}
              placeholder="Confirm Password"
              secureTextEntry
              autoComplete="password-new"
              error={errors.confirmPassword}
              style={styles.input}
              placeholderTextColor={colors.textPrimary}
            />

            <View style={styles.termsContainer}>
              <Text style={styles.termsText}>
                By clicking Sign up you agree to our Terms of Service and
                Privacy Policy
              </Text>
            </View>

            <Button
              title="Sign Up"
              onPress={handleRegister}
              loading={loading}
              style={styles.signUpButton}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Already have an account?{" "}
              <Link href="/auth/login" style={styles.link}>
                Login
              </Link>
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
