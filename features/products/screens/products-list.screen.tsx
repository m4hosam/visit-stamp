import { LoadingState } from "@/components/loading-state";
import { useTheme } from "@/core/theme/theme-provider";
import {
  Product,
  ProductsService,
} from "@/features/products/services/products.service";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  Text,
  View,
} from "react-native";

export default function ProductsListScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setError(null);
      const data = await ProductsService.getAllProducts();
      setProducts(data);
    } catch (err: any) {
      console.error("Error fetching products:", err);
      setError(err.message || t("common.error"));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <Pressable
      className={`mb-4 rounded-xl overflow-hidden ${
        isDark ? "bg-gray-800" : "bg-white"
      } shadow-md`}
      onPress={() => router.push(("/products/" + item.id) as any)}
    >
      {/* Product Image */}
      {item.imageUrl ? (
        <Image
          source={{ uri: item.imageUrl }}
          className="w-full h-48"
          resizeMode="cover"
        />
      ) : (
        <View
          className={`w-full h-48 items-center justify-center ${
            isDark ? "bg-gray-700" : "bg-gray-200"
          }`}
        >
          <Text className="text-6xl">📦</Text>
        </View>
      )}

      {/* Product Info */}
      <View className="p-4">
        <View className="flex-row justify-between items-start mb-2">
          <Text
            className={`text-lg font-semibold flex-1 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
            numberOfLines={2}
          >
            {item.name}
          </Text>
          <Text className="text-primary-500 font-bold text-lg ml-2">
            ${item.price.toFixed(2)}
          </Text>
        </View>

        <Text
          className={`text-sm mb-3 ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`}
          numberOfLines={2}
        >
          {item.description}
        </Text>

        <View className="flex-row justify-between items-center">
          <View
            className={`px-3 py-1 rounded-full ${
              isDark ? "bg-gray-700" : "bg-gray-100"
            }`}
          >
            <Text
              className={`text-xs font-medium ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {item.category}
            </Text>
          </View>

          <Text
            className={`text-sm ${
              item.stock > 0
                ? isDark
                  ? "text-success-400"
                  : "text-success-600"
                : isDark
                  ? "text-error-400"
                  : "text-error-600"
            }`}
          >
            {item.stock > 0
              ? `${t("products.inStock")}: ${item.stock}`
              : t("products.outOfStock")}
          </Text>
        </View>
      </View>
    </Pressable>
  );

  return (
    <View
      className={`flex-1 ${isDark ? "bg-background-dark" : "bg-background-light"}`}
    >
      {/* Header */}
      <View
        className={`pt-12 pb-6 px-6 ${isDark ? "bg-gray-800" : "bg-primary-500"}`}
      >
        <Text className="text-3xl font-bold text-white mb-2">
          {t("products.title")}
        </Text>
        <Text className="text-gray-100">{t("products.subtitle")}</Text>
      </View>

      {/* Products List */}
      <LoadingState
        loading={loading}
        error={error}
        empty={products.length === 0}
        emptyMessage={t("products.empty.title")}
        onRetry={fetchProducts}
      >
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id || ""}
          contentContainerStyle={{ padding: 16 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={isDark ? "#60A5FA" : "#3B82F6"}
            />
          }
        />
      </LoadingState>
    </View>
  );
}
