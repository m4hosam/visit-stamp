// (auth)/verify.tsx
import { Colors } from "@/constants/theme";
import { useAuth } from "@/core/auth/auth.context";
import { Alert } from "@/core/shared/alert";
import { AuthService } from "@/features/auth/services/auth.service";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function VerifyScreen() {
  const params = useLocalSearchParams();
  const email = params.email as string;
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const [resending, setResending] = useState(false);
  const [checking, setChecking] = useState(false);

  // Check if user is already verified
  useEffect(() => {
    if (user?.emailVerified) {
      router.replace("/(tabs)");
    }
  }, [user, router]);

  const handleResendCode = async () => {
    setResending(true);
    try {
      await AuthService.sendVerificationEmail();
      Alert.alert(
        "Success",
        "Verification email sent! Please check your inbox and spam folder."
      );
    } catch (error: any) {
      let message = "Failed to resend verification email. Please try again.";

      switch (error.code) {
        case "auth/too-many-requests":
          message =
            "Too many requests. Please wait before requesting another email.";
          break;
        case "auth/user-not-found":
          message = "User not found. Please try signing up again.";
          break;
      }

      Alert.alert("Error", message);
    } finally {
      setResending(false);
    }
  };

  const handleCheckVerification = async () => {
    setChecking(true);
    try {
      const isVerified = await AuthService.checkEmailVerification();
      if (isVerified) {
        Alert.alert("Success", "Email verified successfully!");
        refreshUser(); // Refresh auth state
        router.replace("/(tabs)");
      } else {
        Alert.alert(
          "Not Verified",
          "Your email is not verified yet. Please check your email and click the verification link."
        );
      }
    } catch (error: any) {
      Alert.alert(
        "Error",
        "Failed to check verification status. Please try again."
      );
    } finally {
      setChecking(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.content}>
        {/* Header */}
        <Text style={styles.title}>Verify</Text>

        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/images/logo-header.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Message */}
        <Text style={styles.message}>
          we have send a link to your{"\n"}
          email to verify your Account
        </Text>

        {/* Check Email Button */}
        <View>
          <Text style={styles.checkEmailText}>
            Check Your{"\n"}
            Email
          </Text>
        </View>

        {/* Resend Link */}
        {/* Resend Link */}
        <View style={styles.footer}>
          <Text style={styles.resendText} allowFontScaling={false}>
            There is no link?
          </Text>

          <TouchableOpacity
            style={styles.resendLinkContainer}
            onPress={handleResendCode}
            disabled={resending}
            accessibilityRole="button"
          >
            <Text style={styles.resendLink} allowFontScaling={false}>
              {"  "}Resend Mail
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 35,
    color: Colors.light.secondary,
    textAlign: "center",
    marginBottom: 35,
    fontFamily: "Poppins_700Bold",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 120,
  },
  logo: {
    width: 250,
    height: 62,
  },
  message: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 35,
    fontFamily: "Poppins_500Medium",
  },
  checkEmailText: {
    fontSize: 32,
    color: Colors.light.primary,
    textAlign: "center",
    lineHeight: 32,
    marginBottom: 30,
    fontFamily: "Poppins_800ExtraBold",
  },
  resendContainer: {
    alignItems: "center",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center", // ensures vertical centering
    justifyContent: "center", // centers the whole group on X axis
    marginTop: 24,
    marginBottom: 32,
  },
  resendLinkContainer: {
    marginLeft: 4, // small space between texts
  },
  resendText: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    fontFamily: "Poppins_500Medium",
  },
  resendLink: {
    fontSize: 16, // match resendText font size for perfect alignment
    color: Colors.light.primary,
    fontFamily: "Poppins_700Bold",
  },
});
