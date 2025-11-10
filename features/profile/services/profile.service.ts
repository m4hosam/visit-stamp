// ============================================================================
// FILE: features/profile/services/profile.service.ts
// ============================================================================

import { auth, db, storage } from "@/core/firebase/firebase.config";
import { AuthError, AuthErrorCode } from "@/features/auth/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import {
  EmailAuthProvider,
  User as FirebaseUser,
  deleteUser,
  reauthenticateWithCredential,
  updateProfile,
} from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { deleteObject, listAll, ref } from "firebase/storage";

/**
 * Profile Service
 * Handles user profile operations including account deletion
 */
export class ProfileService {
  /**
   * Update user display name
   */
  static async updateDisplayName(
    user: FirebaseUser,
    displayName: string
  ): Promise<void> {
    try {
      await updateProfile(user, { displayName });
      console.log("Display name updated successfully");
    } catch (error: any) {
      console.error("Error updating display name:", error);
      throw new AuthError(
        "profile/update-failed",
        "Failed to update display name",
        error
      );
    }
  }

  /**
   * Reauthenticate user with password
   */
  static async reauthenticateWithPassword(
    user: FirebaseUser,
    password: string
  ): Promise<void> {
    try {
      if (!user.email) {
        throw new AuthError(AuthErrorCode.NO_USER, "User email not found");
      }

      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);
      console.log("Reauthenticated with email/password");
    } catch (error: any) {
      console.error("Error reauthenticating:", error);
      throw new AuthError(
        AuthErrorCode.WRONG_PASSWORD,
        "Failed to reauthenticate. Please check your password",
        error
      );
    }
  }

  /**
   * Delete user account and all associated data
   * Note: Google reauthentication must be handled separately in the UI layer
   */
  static async deleteAccount(password?: string): Promise<void> {
    const user = auth.currentUser;

    if (!user) {
      throw new AuthError(
        AuthErrorCode.NO_USER,
        "No user is currently signed in"
      );
    }

    try {
      // Step 1: Reauthenticate if password provider
      const providerId = user.providerData[0]?.providerId;

      if (providerId === "password") {
        if (!password) {
          throw new AuthError(
            AuthErrorCode.REQUIRES_PASSWORD,
            "Password is required for email/password accounts"
          );
        }
        await this.reauthenticateWithPassword(user, password);
      }
      // Note: Google reauthentication should be handled in the UI
      // before calling this method

      // Step 2: Delete user data from Firestore
      await this.deleteUserData(user.uid);

      // Step 3: Delete user's images from Storage
      await this.deleteUserImages(user.uid);

      // Step 4: Clear local storage
      await AsyncStorage.removeItem(`notified_locations_${user.uid}`);
      await AsyncStorage.removeItem("user");

      // Step 5: Delete Firebase Auth user
      await deleteUser(user);

      console.log("User account deleted successfully");

      // Step 6: Navigate to login
      router.replace("/auth/login");
    } catch (error: any) {
      console.error("Error deleting account:", error);

      // If requires recent login, throw specific error
      if (error.code === "auth/requires-recent-login") {
        throw new AuthError(
          AuthErrorCode.REQUIRES_RECENT_LOGIN,
          "For security, please sign out and sign in again before deleting your account",
          error
        );
      }

      throw new AuthError(
        "profile/delete-failed",
        "Failed to delete account. Please try again",
        error
      );
    }
  }

  /**
   * Delete all user-related data from Firestore
   */
  private static async deleteUserData(userId: string): Promise<void> {
    const batch = writeBatch(db);
    let batchCount = 0;
    const MAX_BATCH_SIZE = 500;

    try {
      // Helper function to commit batch if needed
      const commitIfNeeded = async () => {
        if (batchCount >= MAX_BATCH_SIZE) {
          await batch.commit();
          console.log(`Committed batch of ${batchCount} deletions`);
          batchCount = 0;
        }
      };

      // 1. Delete user document
      const userDocRef = doc(db, "users", userId);
      batch.delete(userDocRef);
      batchCount++;
      console.log("Queued user document for deletion");

      // 2. Delete all stamps
      const stampsQuery = query(
        collection(db, "stamps"),
        where("userId", "==", userId)
      );
      const stampsSnapshot = await getDocs(stampsQuery);

      for (const stampDoc of stampsSnapshot.docs) {
        batch.delete(stampDoc.ref);
        batchCount++;
        await commitIfNeeded();
      }
      console.log(`Queued ${stampsSnapshot.size} stamps for deletion`);

      // 3. Delete all user locations
      const userLocationsQuery = query(
        collection(db, "userLocations"),
        where("userId", "==", userId)
      );
      const userLocationsSnapshot = await getDocs(userLocationsQuery);

      for (const locationDoc of userLocationsSnapshot.docs) {
        batch.delete(locationDoc.ref);
        batchCount++;
        await commitIfNeeded();
      }
      console.log(
        `Queued ${userLocationsSnapshot.size} user locations for deletion`
      );

      // 4. Delete all notifications
      const notificationsQuery = query(
        collection(db, "notifications"),
        where("userId", "==", userId)
      );
      const notificationsSnapshot = await getDocs(notificationsQuery);

      for (const notificationDoc of notificationsSnapshot.docs) {
        batch.delete(notificationDoc.ref);
        batchCount++;
        await commitIfNeeded();
      }
      console.log(
        `Queued ${notificationsSnapshot.size} notifications for deletion`
      );

      // Commit any remaining deletions
      if (batchCount > 0) {
        await batch.commit();
        console.log(`Committed final batch of ${batchCount} deletions`);
      }

      console.log("All Firestore data deleted successfully");
    } catch (error) {
      console.error("Error deleting user data from Firestore:", error);
      throw new AuthError(
        "profile/delete-data-failed",
        "Failed to delete user data from database",
        error
      );
    }
  }

  /**
   * Delete all user images from Firebase Storage
   */
  private static async deleteUserImages(userId: string): Promise<void> {
    try {
      const stampsFolder = ref(storage, `stamps/${userId}`);
      const fileList = await listAll(stampsFolder);

      const deletePromises = fileList.items.map((fileRef) => {
        console.log(`Deleting file: ${fileRef.fullPath}`);
        return deleteObject(fileRef);
      });

      await Promise.all(deletePromises);
      console.log(`Deleted ${fileList.items.length} images from Storage`);
    } catch (error: any) {
      // If folder doesn't exist, that's okay
      if (error.code === "storage/object-not-found") {
        console.log("No images found in Storage for this user");
      } else {
        console.error("Error deleting user images from Storage:", error);
        throw new AuthError(
          "profile/delete-images-failed",
          "Failed to delete user images",
          error
        );
      }
    }
  }
}
