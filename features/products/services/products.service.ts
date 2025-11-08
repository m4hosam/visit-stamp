import { db } from "@/core/firebase/firebase.config";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";

/**
 * Product interface
 */
export interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  stock: number;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Products Service
 * Handles all Firestore operations for products collection
 */
export class ProductsService {
  private static readonly COLLECTION_NAME = "products";

  /**
   * Get all products
   */
  static async getAllProducts(): Promise<Product[]> {
    try {
      const productsRef = collection(db, this.COLLECTION_NAME);
      const q = query(productsRef, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Product[];
    } catch (error: any) {
      console.error("Error fetching products:", error);
      throw new Error("Failed to fetch products");
    }
  }

  /**
   * Get products by category
   */
  static async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      const productsRef = collection(db, this.COLLECTION_NAME);
      const q = query(
        productsRef,
        where("category", "==", category),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Product[];
    } catch (error: any) {
      console.error("Error fetching products by category:", error);
      throw new Error("Failed to fetch products");
    }
  }

  /**
   * Get a single product by ID
   */
  static async getProductById(id: string): Promise<Product | null> {
    try {
      const productRef = doc(db, this.COLLECTION_NAME, id);
      const productSnap = await getDoc(productRef);

      if (productSnap.exists()) {
        return {
          id: productSnap.id,
          ...productSnap.data(),
          createdAt: productSnap.data().createdAt?.toDate(),
          updatedAt: productSnap.data().updatedAt?.toDate(),
        } as Product;
      }

      return null;
    } catch (error: any) {
      console.error("Error fetching product:", error);
      throw new Error("Failed to fetch product");
    }
  }

  /**
   * Add a new product
   */
  static async addProduct(product: Omit<Product, "id">): Promise<string> {
    try {
      const productsRef = collection(db, this.COLLECTION_NAME);
      const docRef = await addDoc(productsRef, {
        ...product,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      return docRef.id;
    } catch (error: any) {
      console.error("Error adding product:", error);
      throw new Error("Failed to add product");
    }
  }

  /**
   * Update an existing product
   */
  static async updateProduct(
    id: string,
    product: Partial<Product>
  ): Promise<void> {
    try {
      const productRef = doc(db, this.COLLECTION_NAME, id);
      await updateDoc(productRef, {
        ...product,
        updatedAt: Timestamp.now(),
      });
    } catch (error: any) {
      console.error("Error updating product:", error);
      throw new Error("Failed to update product");
    }
  }

  /**
   * Delete a product
   */
  static async deleteProduct(id: string): Promise<void> {
    try {
      const productRef = doc(db, this.COLLECTION_NAME, id);
      await deleteDoc(productRef);
    } catch (error: any) {
      console.error("Error deleting product:", error);
      throw new Error("Failed to delete product");
    }
  }

  /**
   * Search products by name
   */
  static async searchProducts(searchTerm: string): Promise<Product[]> {
    try {
      const productsRef = collection(db, this.COLLECTION_NAME);
      const querySnapshot = await getDocs(productsRef);

      const products = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Product[];

      // Filter products by name (case-insensitive)
      return products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } catch (error: any) {
      console.error("Error searching products:", error);
      throw new Error("Failed to search products");
    }
  }
}
