// components/error-boundary.tsx
import React, { Component, ReactNode } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/core/theme/theme-provider";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

// Wrapper component to use hooks
function ErrorFallback({ error, onReset }: { error: Error | null; onReset: () => void }) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <View className={`flex-1 justify-center items-center p-5 ${isDark ? "bg-gray-900" : "bg-white"}`}>
      <Text className={`text-2xl font-bold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>
        {t("errorBoundary.title")}
      </Text>
      <Text className={`text-base text-center mb-5 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
        {error?.message || t("errorBoundary.message")}
      </Text>
      <TouchableOpacity
        className="bg-primary-500 px-6 py-3 rounded-lg"
        onPress={onReset}
      >
        <Text className="text-white text-base font-semibold">
          {t("errorBoundary.retry")}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    // Log to error tracking service (e.g., Sentry)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <ErrorFallback error={this.state.error} onReset={this.handleReset} />;
    }

    return this.props.children;
  }
}
