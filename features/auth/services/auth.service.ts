import { auth } from "@/core/firebase/firebase.config";
import { UserService } from "@/features/auth/services/user.service";
import { AppUser, AuthError, AuthErrorCode } from "@/features/auth/types";
import {
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  User as FirebaseUser,
  reload,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

/**
 * Authentication Service
 * Handles Firebase Authentication operations only
 * Delegates user data management to UserService
 */
export class AuthService {
  /**
   * Sign in with email and password
   */
  static async login(email: string, password: string): Promise<FirebaseUser> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("User signed in successfully:", userCredential.user.uid);
      return userCredential.user;
    } catch (error: any) {
      console.error("Error signing in:", error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Register new user with email and password
   */
  static async register(
    email: string,
    password: string,
    displayName: string,
    phoneNumber?: string
  ): Promise<AppUser> {
    try {
      console.log("Creating account for:", email);

      // Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser = userCredential.user;

      console.log("Firebase user created:", firebaseUser.uid);

      // Update Firebase profile
      if (displayName) {
        await updateProfile(firebaseUser, { displayName });
        console.log("Profile updated with displayName");
      }

      // Create Firestore user document
      const userData: AppUser = {
        uid: firebaseUser.uid,
        email: firebaseUser.email!,
        displayName,
        phoneNumber,
        createdAt: new Date(),
        emailVerified: false,
      };

      await UserService.createUser(userData);
      console.log("User document created in Firestore");

      // Send verification email
      await this.sendVerificationEmail(firebaseUser);

      return userData;
    } catch (error: any) {
      console.error("Error creating account:", error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Sign out current user
   */
  static async logout(): Promise<void> {
    try {
      console.log("Signing out user");
      await firebaseSignOut(auth);
      console.log("Sign out successful");
    } catch (error: any) {
      console.error("Error signing out:", error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Send password reset email
   */
  static async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
      console.log("Password reset email sent to:", email);
    } catch (error: any) {
      console.error("Error sending password reset email:", error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Send email verification
   */
  static async sendVerificationEmail(user?: FirebaseUser): Promise<void> {
    try {
      const currentUser = user || auth.currentUser;

      if (!currentUser) {
        throw new AuthError(
          AuthErrorCode.NO_USER,
          "No user is currently signed in"
        );
      }

      if (currentUser.emailVerified) {
        throw new AuthError(
          AuthErrorCode.ALREADY_VERIFIED,
          "Email is already verified"
        );
      }

      await sendEmailVerification(currentUser);
      console.log("Verification email sent successfully");
    } catch (error: any) {
      console.error("Error sending verification email:", error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Check if email is verified (refreshes from server)
   */
  static async checkEmailVerification(): Promise<boolean> {
    try {
      const user = auth.currentUser;

      if (!user) {
        throw new AuthError(
          AuthErrorCode.NO_USER,
          "No user is currently signed in"
        );
      }

      // Reload user to get latest verification status
      await reload(user);
      return user.emailVerified;
    } catch (error: any) {
      console.error("Error checking email verification:", error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Get current Firebase user
   */
  static getCurrentUser(): FirebaseUser | null {
    return auth.currentUser;
  }

  /**
   * Get current user's auth provider
   */
  static getUserAuthProvider(): string {
    const user = auth.currentUser;

    if (!user || !user.providerData || user.providerData.length === 0) {
      return "unknown";
    }

    const providerId = user.providerData[0].providerId;

    switch (providerId) {
      case "password":
        return "password";
      case "google.com":
        return "google";
      default:
        return providerId;
    }
  }

  /**
   * Handle and transform Firebase auth errors
   */
  private static handleAuthError(error: any): AuthError {
    const code = error.code || "unknown";
    const message = error.message || "An unknown error occurred";

    switch (code) {
      case "auth/invalid-email":
        return new AuthError(
          AuthErrorCode.INVALID_EMAIL,
          "Invalid email address",
          error
        );
      case "auth/user-not-found":
        return new AuthError(
          AuthErrorCode.USER_NOT_FOUND,
          "No account found with this email",
          error
        );
      case "auth/wrong-password":
        return new AuthError(
          AuthErrorCode.WRONG_PASSWORD,
          "Incorrect password",
          error
        );
      case "auth/email-already-in-use":
        return new AuthError(
          AuthErrorCode.EMAIL_IN_USE,
          "An account with this email already exists",
          error
        );
      case "auth/weak-password":
        return new AuthError(
          AuthErrorCode.WEAK_PASSWORD,
          "Password should be at least 6 characters",
          error
        );
      case "auth/network-request-failed":
        return new AuthError(
          AuthErrorCode.NETWORK_ERROR,
          "Network error. Please check your connection",
          error
        );
      case "auth/too-many-requests":
        return new AuthError(
          AuthErrorCode.TOO_MANY_REQUESTS,
          "Too many failed attempts. Please try again later",
          error
        );
      default:
        return new AuthError(code, message, error);
    }
  }
}
