import { db } from "@/core/firebase/firebase.config";
import { AppUser, AuthError } from "@/features/auth/types";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

/**
 * User Service
 * Handles Firestore user document operations
 * Separated from auth for single responsibility
 */
export class UserService {
  private static readonly COLLECTION_NAME = "users";

  /**
   * Create user document in Firestore
   */
  static async createUser(userData: AppUser): Promise<void> {
    try {
      await setDoc(doc(db, this.COLLECTION_NAME, userData.uid), {
        ...userData,
        createdAt: userData.createdAt.toISOString(), // Store as ISO string
      });
      console.log("User document created:", userData.uid);
    } catch (error: any) {
      console.error("Error creating user document:", error);
      throw new AuthError(
        "user/create-failed",
        "Failed to create user profile",
        error
      );
    }
  }

  /**
   * Get user data from Firestore
   */
  static async getUser(uid: string): Promise<AppUser | null> {
    try {
      const userDoc = await getDoc(doc(db, this.COLLECTION_NAME, uid));

      if (!userDoc.exists()) {
        return null;
      }

      const data = userDoc.data();
      return {
        uid: data.uid,
        email: data.email,
        displayName: data.displayName,
        phoneNumber: data.phoneNumber,
        createdAt: new Date(data.createdAt), // Convert back to Date
        emailVerified: data.emailVerified,
      };
    } catch (error: any) {
      console.error("Error getting user data:", error);
      throw new AuthError(
        "user/get-failed",
        "Failed to retrieve user profile",
        error
      );
    }
  }

  /**
   * Update user document in Firestore
   */
  static async updateUser(
    uid: string,
    updates: Partial<Omit<AppUser, "uid" | "email" | "createdAt">>
  ): Promise<void> {
    try {
      await updateDoc(doc(db, this.COLLECTION_NAME, uid), updates);
      console.log("User document updated:", uid);
    } catch (error: any) {
      console.error("Error updating user document:", error);
      throw new AuthError(
        "user/update-failed",
        "Failed to update user profile",
        error
      );
    }
  }

  /**
   * Update email verification status
   */
  static async updateEmailVerificationStatus(
    uid: string,
    emailVerified: boolean
  ): Promise<void> {
    try {
      await this.updateUser(uid, { emailVerified });
    } catch (error) {
      console.error("Error updating email verification status:", error);
      throw error;
    }
  }
}
