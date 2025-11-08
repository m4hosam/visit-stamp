import { LoadingState } from "@/components/loading-state";
import { useTheme } from "@/core/theme/theme-provider";
import {
  Product,
  ProductsService,
} from "@/features/products/services/products.service";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, ScrollView, Text, View } from "react-native";

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ProductsService.getProductById(id!);
      if (data) {
        setProduct(data);
      } else {
        setError(t("products.detail.notFound"));
      }
    } catch (err: any) {
      console.error("Error fetching product details:", err);
      setError(err.message || t("common.error"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchProduct();
  }, [id]);

  return (
    <LoadingState
      loading={loading}
      error={error}
      empty={!product}
      emptyMessage={t("products.detail.notFound")}
      onRetry={fetchProduct}
    >
      <ScrollView
        className={`flex-1 ${isDark ? "bg-background-dark" : "bg-background-light"}`}
      >
        <Stack.Screen options={{ title: product?.name || t("products.title"), headerShown: true }} />
        {!product ? null : (<>
      {product.imageUrl ? (
        <Image
          source={{ uri: product.imageUrl }}
          className="w-full h-64"
          resizeMode="cover"
        />
      ) : (
        <View
          className={`w-full h-64 items-center justify-center ${isDark ? "bg-gray-700" : "bg-gray-200"}`}
        >
          <Text className="text-8xl">📦</Text>
        </View>
      )}
      <View className="p-6">
        <View className="flex-row justify-between items-start mb-2">
          <Text
            className={`text-2xl font-bold flex-1 ${isDark ? "text-white" : "text-gray-900"}`}
          >
            {product.name}
          </Text>
          <Text className="text-primary-500 font-bold text-2xl ml-4">
            ${product.price.toFixed(2)}
          </Text>
        </View>

        <View
          className={`px-3 py-1 rounded-full self-start my-3 ${isDark ? "bg-gray-700" : "bg-gray-100"}`}
        >
          <Text
            className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}
          >
            {product.category}
          </Text>
        </View>

        <Text
          className={`text-base my-4 ${isDark ? "text-gray-300" : "text-gray-500"}`}
        >
          {product.description}
        </Text>

        <View className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <Text
            className={`text-lg font-semibold ${isDark ? "text-white" : "text-black"}`}
          >
            {t("products.stockStatus")}:{" "}
            <Text
              className={
                product.stock > 0 ? "text-success-500" : "text-error-500"
              }
            >
              {product.stock > 0
                ? `${t("products.inStock")} (${product.stock})`
                : t("products.outOfStock")}
            </Text>
          </Text>
        </View>
        </View>
        </>
        )}
      </ScrollView>
    </LoadingState>
  );
}
